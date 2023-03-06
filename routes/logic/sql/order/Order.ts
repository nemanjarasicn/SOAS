/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 13.09.2021 */

import * as sql from 'mssql';
import * as mssqlCall from '../../mssql_call';
import {constants} from '../../constants/constants';
import {WarehouseControl} from '../../classes/WarehouseControl';
import {WarehouseReservationCacheInterface} from '../../classes/interfaces/WarehouseReservationCacheInterface';
import {OrderPosition} from '../../classes/OrderPosition';
import {WarehousingInterface} from '../../classes/interfaces/WarehousingInterface';
import {
    addValuesToQuery,
    execInsertMethod,
    execMSSQLQueryWithPromise, getTableColumnsTypes, mssql_call_get_table_data_types,
    mssql_call_get_table_name,
    mssql_call_get_table_name_and_detail_view
} from '../../mssql_logic';
import {
    isWarehousingConsistent,
    prepareDataForWarehousingControl, setDataForWarehousing,
    setDataForWRCacheInterface
} from '../warehouse/Warehouse';
import {calcTaxAmount, getItemForQuery, removeLastChar} from '../../helpers';
import {getFieldType, getFieldValue, mssql_last_table_id, primaryColumnTypes} from '../table/Table';
import {OrderPositionDataInterface} from "../../classes/interfaces/OrderPositionInterface";
import {DistComponentDataInterface} from "../../classes/interfaces/DistComponentInterface";
import {
    DeliveryNotePositionDataInterface,
} from "../../classes/interfaces/DeliveryNotePositionInterface";
import {updateInvoiceAmounts, getInvoiceTaxQuery} from "../invoice/Invoice";
import {InvoicePositions} from "../../classes/InvoicePositions";
import {Order} from "../../classes/Order";
import {Invoice} from "../../classes/Invoice";
import {InvoiceDataInterface} from "../../classes/interfaces/InvoiceInterface";
import {OrderDataInterface} from "../../classes/interfaces/OrderInterface";


/**
 * insert positions rows
 *
 * @param refTable
 * @param elementsArray
 * @param allocate - allocate positions flag, optional, true by default
 */
export async function insertPositionsRows(refTable: string, elementsArray: any, allocate: boolean = true):
    Promise<{success: boolean, message: string, data: []}>{
    let tableTemplate: any = await mssql_call_get_table_name_and_detail_view(refTable);
    if (!tableTemplate) {
        return {success: false, message: 'tableTemplate not found', data: []};
    }
    console.log('Allocation is: ', (allocate) ? 'ON' : 'OFF');
    if (refTable === 'orderPosition' || refTable === 'deliveryNotePositions' || refTable === 'invoicePositions') {
        let warehouseControl: WarehouseControl = new WarehouseControl();
        let warehouseReservationCacheItems: WarehouseReservationCacheInterface[] = [];
        let warehousingItems: WarehousingInterface[] = [];
        if (allocate) {
            const __ret = prepareDataForWarehousingControl(refTable, elementsArray,
                warehouseReservationCacheItems, warehousingItems);
            warehouseReservationCacheItems = __ret.warehouseReservationCacheItems;
            warehousingItems = __ret.warehousingItems;
        }
        const INSERT_FLAG: boolean = true;
        // @ts-ignore
        let insertResult: { result: any, insertedPositions: [], message: string } =
            await insertPositions(refTable, allocate ? elementsArray['opElm'] : elementsArray,
                tableTemplate, INSERT_FLAG);
        if (!insertResult.result) {
            return {success: false, message: insertResult.message, data: []};
        }
        if (allocate && refTable === 'orderPosition') {
            warehouseReservationCacheItems =
                insertWRCacheInterface('NEW_OP', insertResult, warehouseReservationCacheItems);
            // @ts-ignore
            await warehouseControl.alignWarehouseReservations(constants.WH_CTRL_USE_CASE_TYPES.RESERVED,
                warehouseReservationCacheItems, warehousingItems);
        }
        // check if warehousing table is inconsistent
        let result: boolean = await isWarehousingConsistent();
        if (result) {
            // let resultOPC: boolean = await module.exports.isOPAndCacheConsistent();
            // if (resultOPC) {
            // message: 'OP_AND_CACHE_ARE_INCONSISTENT',
            return {success: true, message: '', data: []}; //insertResult.result;
        } else {
            return {success: false, message: 'WAREHOUSING_IS_INCONSISTENT', data: []};
        }
    }
}

/**
 * Update rows table method
 * Used:
 *  - client execUpdatePositions: Update order positions or prilist
 *  - server Warehouse.mssql_check_allocation
 *
 * @param refTable 'orderPosition'
 * @param elementsArray - { ITM: [ [Object] ], KMP: [ [Object], [Object] ] }
 * @param primaryKey 'ORDERS_NUMBER'
 * @param primaryValue
 * @param secondaryKey optional
 * @param secondaryValue optional
 * @param thirdKey optional
 * @param thirdValue optional
 */
export async function updateRowsTableMethod(refTable: string, elementsArray: any, primaryKey: string,
                                     primaryValue: string, secondaryKey: string, secondaryValue: undefined|string,
                                     thirdKey: undefined|string, thirdValue: undefined|string) {
    // console.log('secondaryKey: ', secondaryKey);
    const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    let opDataForUpdate: any[] = []; // OrderPositionDataInterface
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'PRIMARY_VALUE', type: sql.VarChar, value: primaryValue},
        {name: 'SECONDARY_VALUE', type: sql.VarChar, value: secondaryValue}];
    const PRIMARY_KEY_VALUE: string = getItemForQuery([primaryKey], primaryColumnTypes);
    const SECONDARY_KEY_VALUE: string = getItemForQuery([secondaryKey], primaryColumnTypes);
    if (secondaryKey && secondaryKey === 'allocatePositions') {
        opDataForUpdate = getAllocatePositionsData(elementsArray);
    } else {
        opDataForUpdate = elementsArray;
    }
    let updateQueriesArr: any = [];
    let updateItmnums: string = ''; // list of items that will be updated
    let values: string = '';
    const MAIN_KEY: string = 'ID';
    let mainValue: string = '';
    let insertFlag: boolean = false;
    let tableTemplate: any = await mssql_call_get_table_name_and_detail_view(refTable);
    if (!tableTemplate) {
        console.log("tableTemplate not found...");
        return {success: false, itmnums: updateItmnums};
    }
    const TABLE_NAME_VALUE: string = DB_TABLE_PREFIX + tableTemplate[0]['TABLE_NAME'];
    const TABLE_DETAIL_VIEW: string[] = tableTemplate[0]['DETAIL_VIEW'].split(',');
    let OP_TABLE_DETAIL_VIEW: string[];
    let PL_TABLE_DETAIL_VIEW: string[];
    let opTableColumnsData: {};
    let plTableColumnsData: {};
    if (refTable === constants.REFTABLE_ORDERS_POSITIONS) {
        let opTableTemplate: any = await mssql_call_get_table_name_and_detail_view(constants.REFTABLE_ORDERS_POSITIONS);
        if (!opTableTemplate) {
            console.log("tableTemplate not found... ", constants.REFTABLE_ORDERS_POSITIONS);
            return {success: false, itmnums: updateItmnums};
        }
        OP_TABLE_DETAIL_VIEW = opTableTemplate[0]['DETAIL_VIEW'].split(',');
        // load table columns data types for order positions
        const opDataTypes: [] = await mssql_call_get_table_data_types(tableTemplate[0]['TABLE_NAME']);
        opTableColumnsData = getTableColumnsTypes(opDataTypes, OP_TABLE_DETAIL_VIEW);
    } else if (refTable === constants.REFTABLE_PRILISTS) {
        let plTableTemplate: any = await mssql_call_get_table_name_and_detail_view(constants.REFTABLE_PRILISTS);
        if (!plTableTemplate) {
            console.log("tableTemplate not found... ", constants.REFTABLE_PRILISTS);
            return {success: false, itmnums: updateItmnums};
        }
        PL_TABLE_DETAIL_VIEW = plTableTemplate[0]['DETAIL_VIEW'].split(',');
        const plDataTypes: [] = await mssql_call_get_table_data_types(plTableTemplate[0]['TABLE_NAME']);
        plTableColumnsData = getTableColumnsTypes(plDataTypes, PL_TABLE_DETAIL_VIEW);
    }
    const IPN_PREFIX: string = 'IPN';
    const IPN_DELIMITER: string = '_';
    let iPNKeyCntr: number = 0;
    let query: string = ``;
    let inputName: string = ``;
    // update order positions
    for (let key in opDataForUpdate) {
        query = `UPDATE ` + TABLE_NAME_VALUE + ` SET `;
        values = '';
        mainValue = '';
        inputName = ``;
        for (let key2 in opDataForUpdate[key]) {
            if (opDataForUpdate[key].hasOwnProperty(key2)) {
                let key2_OP: boolean = OP_TABLE_DETAIL_VIEW ? OP_TABLE_DETAIL_VIEW.includes(key2) : false;
                let key2_PL: boolean = PL_TABLE_DETAIL_VIEW ? PL_TABLE_DETAIL_VIEW.includes(key2) : false;
                if (key2_OP || key2_PL) {
                    inputName = `${IPN_PREFIX}${IPN_DELIMITER}${iPNKeyCntr}${IPN_DELIMITER}${key2}`;
                    inputParamsArray.push({
                        name: inputName,
                        type: key2_OP ? getFieldType(opTableColumnsData[key2].DATA_TYPE) :
                            getFieldType(plTableColumnsData[key2].DATA_TYPE),
                        value: key2_OP ? getFieldValue(opTableColumnsData[key2].DATA_TYPE,
                                opDataForUpdate[key][key2]) :
                            getFieldValue(plTableColumnsData[key2].DATA_TYPE,
                                opDataForUpdate[key][key2])
                    });
                    // ignore ID at update of order positions
                    if (key2 !== 'ID') {
                        values += key2 + ` = @${inputName}, `;
                    } else {
                        mainValue = `@${inputName}`;
                    }
                    if (key2 === 'ITMNUM') {
                        updateItmnums += opDataForUpdate[key][key2] + ', ';
                    }
                    iPNKeyCntr++;
                } else {
                    console.warn('KEY not found in constants: ', key2 +
                        ' Add KEY to constants > DB_TABLE_COLUMNS!');
                }
            }
        }
        values = removeLastChar(values);
        query += values;
        // Replace mainValue with
        query += ` WHERE ` + MAIN_KEY + ` = ` + mainValue;
        if (refTable !== 'priceListSales') {
            query += ` AND ` + PRIMARY_KEY_VALUE + ` = @PRIMARY_VALUE`;
        }
        if (SECONDARY_KEY_VALUE && secondaryValue) {
            query += ` AND ` + SECONDARY_KEY_VALUE + ` = @SECONDARY_VALUE`;
        }
        // console.log('inputParamsArray: ', inputParamsArray);
        console.log('update query: ', query);
        updateQueriesArr.push(query);
    }
    if (Object.keys(updateQueriesArr).length === 0) {
        console.log("No positions for update found...");
        return {success: false, itmnums: updateItmnums};
    }
    console.log('inputParamsArray: ', inputParamsArray);
    console.log('updateQueriesArr: ', updateQueriesArr);
    // throw new Error('stopp');

    return await execMSSQLQueryWithPromise(inputParamsArray, updateQueriesArr).then(async r => {
        return await updatePositions(refTable, elementsArray, primaryKey, primaryValue, secondaryKey, secondaryValue,
            inputParamsArray, insertFlag, DB_TABLE_PREFIX, updateItmnums);
    });
}

/**
 * update positions
 *
 * @param refTable
 * @param elementsArray
 * @param primaryKey
 * @param primaryValue
 * @param secondaryKey
 * @param secondaryValue
 * @param inputParamsArray
 * @param insertFlag
 * @param DB_TABLE_PREFIX
 * @param updateItmNums
 */
async function updatePositions(refTable: string, elementsArray: any, primaryKey: string, primaryValue: string,
                               secondaryKey: string, secondaryValue: undefined | string,
                               inputParamsArray: { name: string, type: any, value: any }[], insertFlag: boolean,
                               DB_TABLE_PREFIX: string, updateItmNums: string):
    Promise<{ success: boolean, itmnums: string, message: string }> {
    if (refTable === 'orderPosition') {
        // get customers taxation and current orders amount prices
        let updateAmountQueriesArr: any = [];
        let taxQuery: { inputParamsArray: { name: string, type: any, value: any }[], queryString: string } =
            getTaxQuery(primaryValue);
        console.log('taxQuery.inputParamsArray: ', taxQuery.inputParamsArray);
        console.log('taxQuery: ', taxQuery.queryString);
        let taxResult: any = await mssqlCall.mssqlCallEscaped(taxQuery.inputParamsArray, taxQuery.queryString);
        if (taxResult.length > 0 && taxResult[0]['TAXATION'] !== null) {
            for (let key in elementsArray) {
                if (elementsArray.hasOwnProperty(key)) {
                    let newOrderPrices: { 'ORDERAMOUNT_NET': number, 'ORDERAMOUNT_BRU': number } =
                        calculateOrderPrices(taxResult, elementsArray[key], insertFlag);
                    inputParamsArray.push({
                        name: 'ORDERAMOUNT_NET', type: sql.NVarChar,
                        value: newOrderPrices['ORDERAMOUNT_NET']
                    });
                    inputParamsArray.push({
                        name: 'ORDERAMOUNT_BRU', type: sql.NVarChar,
                        value: newOrderPrices['ORDERAMOUNT_BRU']
                    });
                    let updateOrderAmountQuery: string = `UPDATE ` + DB_TABLE_PREFIX + `ORDERS SET 
                                    ORDERAMOUNT_NET = @ORDERAMOUNT_NET, ORDERAMOUNT_BRU = @ORDERAMOUNT_BRU 
                                    WHERE ORDERS_NUMBER = @PRIMARY_VALUE`;
                    updateAmountQueriesArr.push(updateOrderAmountQuery);
                }
            }
        } else {
            console.log('Taxation not found...');
            return {success: false, itmnums: updateItmNums, message: 'TAXATION'};
        }
        if (Object.keys(updateAmountQueriesArr).length > 0) {
            return await execMSSQLQueryWithPromise(inputParamsArray, updateAmountQueriesArr)
                .then(async updateResult => {
                    let clbSuccess: boolean = false;
                    updateItmNums = removeLastChar(updateItmNums);
                    if (secondaryKey && secondaryKey === 'allocatePositions') {
                        clbSuccess = await allocatePositions(elementsArray, refTable); // orderPositionsElements
                    } else {
                        clbSuccess = true;
                    }
                    console.log('Go back to client... ', updateResult);
                    return {success: clbSuccess, itmnums: updateItmNums, message: ''};
                });
        } else {
            console.log('updateAmountQueriesArr is empty!');
            return {success: false, itmnums: updateItmNums, message: 'updateAmountQueriesArr is empty!'};
        }
    } else if (refTable === 'deliveryNotePositions') {
        return {success: true, itmnums: updateItmNums, message: ''};
    } else if (refTable === 'invoicePositions') {
    } else if (refTable === 'priceListSales') {
        return {success: true, itmnums: updateItmNums, message: ''};
    }
}

/**
 * get allocate positions data
 *
 * @param elementsArray
 */
function getAllocatePositionsData(elementsArray: any) {
    let opDataForUpdate: any[] = [];
    // remove data that is unnecessary to update:
    // ORDERS_NUMBER, CATEGORY_SOAS, ITMNUM, ORDER_QTY
    // WAREHOUSING_RESERVED_QTY, WAREHOUSING_IDS, WAREHOUSING_ID, WAREHOUSING_MANAGED,
    // POSITION_ID, DIST_COMPONENTS_ID
    for (let opElmItem in elementsArray['ITM']) {
        if (elementsArray['ITM'].hasOwnProperty(opElmItem)) {
            opDataForUpdate.push({
                ID: elementsArray['ITM'][opElmItem].ID,
                ORDERS_NUMBER: elementsArray['ITM'][opElmItem].ORDERS_NUMBER,
                ASSIGNED_QTY: elementsArray['ITM'][opElmItem].ASSIGNED_QTY,
                POSITION_STATUS: elementsArray['ITM'][opElmItem].POSITION_STATUS
            });
        }
    }
    for (let opElmItem in elementsArray['KMP']) {
        if (elementsArray['KMP'].hasOwnProperty(opElmItem)) {
            opDataForUpdate.push({
                ID: elementsArray['KMP'][opElmItem].ID,
                ORDERS_NUMBER: elementsArray['KMP'][opElmItem].ORDERS_NUMBER,
                ASSIGNED_QTY: elementsArray['KMP'][opElmItem].ASSIGNED_QTY,
                POSITION_STATUS: elementsArray['KMP'][opElmItem].POSITION_STATUS
            });
        }
    }
    // console.log("opDataForUpdate: ", opDataForUpdate);
    return opDataForUpdate;
}

/**
 * allocate positions
 *
 * @param orderPositionsElements
 * @param refTable
 */
async function allocatePositions(orderPositionsElements: any, refTable: string) {
    let warehouseControl: WarehouseControl = new WarehouseControl();
    let warehouseReservationCacheItems: WarehouseReservationCacheInterface[] = [];
    let warehousingItems: WarehousingInterface[] = [];
    for (let opElmItem in orderPositionsElements['KMP']) {
        if (orderPositionsElements['KMP'].hasOwnProperty(opElmItem)) {
            // set insert data for WAREHOUSE_RESERVATION_CACHE components
            warehouseReservationCacheItems =
                setDataForWRCacheInterface(orderPositionsElements['KMP'][opElmItem],
                    warehouseReservationCacheItems);
            warehousingItems =
                setDataForWarehousing(orderPositionsElements['KMP'][opElmItem],
                    warehousingItems);
        }
    }
    console.log('allocatePositions...');
    console.log('warehouseReservationCacheItems: ', warehouseReservationCacheItems);
    console.log('warehousingItems: ', warehousingItems);
    if (refTable === 'orderPosition') {
        await warehouseControl.alignWarehouseReservations(
            constants.WH_CTRL_USE_CASE_TYPES.RESERVED,
            warehouseReservationCacheItems, warehousingItems);
    }
    // check if warehousing table is inconsistent
    return await isWarehousingConsistent();
}

/**
 * select all items from orders
 */
export async function mssql_select_orderAvise() {
    let query: string = `SELECT * FROM ` + constants.DB_TABLE_PREFIX + `ORDERS`;
    return await mssqlCall.mssqlCall(query);
}

/**
 * delete positions at orders or delivery notes. update prices at order
 *
 * @param tableName - 'orderPosition'
 * @param primaryKey - 'ID'
 * @param primaryValue
 * @param secondaryKey - 'ORDERS_NUMBER'
 * @param secondaryValue
 * @param thirdKey - 'ITMNUM'
 * @param thirdValue
 */
export async function mssql_delete_positions(tableName: string, primaryKey: string, primaryValue: string,
                                        secondaryKey: string, secondaryValue: string, thirdKey: string,
                                        thirdValue: string): Promise<{result: boolean, data: [], message: string}> {
    // check if warehousing table is inconsistent
    let whCheckResult: boolean = await isWarehousingConsistent();
    if (whCheckResult) {
        const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
        let tableNameValue: string = '';
        if (tableName === 'orderPosition') {
            tableNameValue = 'ORDERS_POSITIONS';
        } else if (tableName === 'deliveryNotePositions') {
            tableNameValue = 'DELIVERY_NOTES_POSITIONS';
        } else if (tableName === 'invoicePositions') {
            tableNameValue = 'INVOICES_POSITIONS';
        }
        if (tableNameValue && tableNameValue.length > 0) {
            // first delete caching items
            let warehouseControl: WarehouseControl = new WarehouseControl();
            let inputParamsArray: { name: string, type: any, value: any }[] = [
                {name: 'PRIMARY_VALUE', type: sql.VarChar, value: primaryValue},
                {name: 'SECONDARY_VALUE', type: sql.VarChar, value: secondaryValue},
                {name: 'THIRD_VALUE', type: sql.VarChar, value: thirdValue}];
            const PRIMARY_KEY_VALUE: string = getItemForQuery([primaryKey], primaryColumnTypes);
            const SECONDARY_KEY_VALUE: string = getItemForQuery([secondaryKey], primaryColumnTypes);
            const THIRD_KEY_VALUE: string = getItemForQuery([thirdKey], primaryColumnTypes);
            if (tableNameValue === 'ORDERS_POSITIONS') {
                let opsQery: string = `SELECT * FROM ` + DB_TABLE_PREFIX + `ORDERS_POSITIONS 
                WHERE ` + SECONDARY_KEY_VALUE + ` = @SECONDARY_VALUE AND PARENT_LINE_ID = @PRIMARY_VALUE`;
                console.log("opsQery: ", opsQery);
                let dataOPS: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, opsQery);
                if (dataOPS) {
                    for (let opItem in dataOPS) {
                        if (dataOPS.hasOwnProperty(opItem)) {
                            let warehouseReservationCacheItem: WarehouseReservationCacheInterface = {
                                warehouseRCId: 0,
                                warehouseRCDocumentNumber: secondaryValue,
                                warehouseRCItemNumber: dataOPS[opItem].ITMNUM,
                                warehouseRCAssignedQuantity: 0,
                                warehouseRCBatchNumber: '',
                                warehouseRCStorageLocation: '',
                                warehouseRCWarehouse: '',
                                warehouseRCPositionId: dataOPS[opItem].POSITION_ID,
                                warehouseRCAssignmentDate: '',
                                warehouseRCWarehousingId: 0,
                                warehouseRCOrdersPositionsId: dataOPS[opItem].ID,
                                warehouseRCDeliveryNotesPositionsId: null,
                            };
                            // delete WAREHOUSE_RESERVATION_CACHE items for current order position
                            await warehouseControl.dereserveStock(secondaryValue, warehouseReservationCacheItem);
                        }
                    }
                } else {
                    console.log('ERROR: Order Positions SET item not found! ', secondaryValue);
                }
            } else if (tableNameValue === 'DELIVERY_NOTES_POSITIONS') {
                /*
                let dnpsQery: string = `SELECT * FROM ` + DB_TABLE_PREFIX + `DELIVERY_NOTES_POSITIONS
                    WHERE ` + secondaryKey + ` = '` + secondaryValue + `' AND
                    PARENT_LINE_ID = '` + primaryValue + `'`;
                console.log("dnpsQery: ", dnpsQery);
                // @ts-ignore
                let dataDNPS: any = await mssqlCall.mssqlCall(dnpsQery);
                if (dataDNPS) {
                    for (let dnpItem in dataDNPS) {
                        await resetWRCDelNotePosID(secondaryValue, dataDNPS[dnpItem], warehouseControl);
                    }
                }
                */
            }
            // then delete SET item
            let delSetQuery: string = `DELETE FROM ` + DB_TABLE_PREFIX + tableNameValue + `
            WHERE ` + PRIMARY_KEY_VALUE + ` = @PRIMARY_VALUE AND ` + SECONDARY_KEY_VALUE + ` = @SECONDARY_VALUE
            AND ` + THIRD_KEY_VALUE + ` = @THIRD_VALUE`;
            console.log('Delete delSetQuery: ', delSetQuery);
            await mssqlCall.mssqlCallEscaped(inputParamsArray, delSetQuery);
            // second delete KOMP items, if available...
            let delKompQuery: string = `DELETE FROM ` + DB_TABLE_PREFIX + tableNameValue + ` 
            WHERE PARENT_LINE_ID = @PRIMARY_VALUE AND ` + SECONDARY_KEY_VALUE + ` = @SECONDARY_VALUE`;
            console.log('Delete delKompQuery: ', delKompQuery);
            await mssqlCall.mssqlCallEscaped(inputParamsArray, delKompQuery);
            if (tableNameValue === 'ORDERS_POSITIONS') {
                // now update orders prices
                // flag = false to determine, that order prices should be updated...
                const INSERT_FLAG: boolean = false;
                let elementsArray: { 'ITM': any[], 'KMP': any[] } = {'ITM': [], 'KMP': []};
                let orderPositionItem: any | OrderPosition = {};
                orderPositionItem[secondaryKey] = secondaryValue; // 'ORDERS_NUMBER'
                elementsArray['ITM'].push(orderPositionItem);
                let tableTemplate = undefined;
                // @ts-ignore
                let insertResult: { result: any, insertedPositions: [], message: string } =
                    await insertPositions(tableName, elementsArray, tableTemplate, INSERT_FLAG);
                return {result: insertResult.result, data: insertResult.insertedPositions, message: insertResult.message};
            } else if (tableNameValue === 'INVOICES_POSITIONS') {
                // now update invoices prices
                // flag = false to determine, that invoices prices should be updated...
                const INSERT_FLAG: boolean = false;
                let elementsArray: { 'ITM': any[], 'KMP': any[] } = {'ITM': [], 'KMP': []};
                let invoicesPositionItem: any | InvoicePositions = {};
                invoicesPositionItem[secondaryKey] = secondaryValue; // 'ORDERS_NUMBER'
                elementsArray['ITM'].push(invoicesPositionItem);
                let tableTemplate = undefined;
                // @ts-ignore
                let insertResult: { result: any, insertedPositions: [], message: string } =
                    await insertPositions(tableName, elementsArray, tableTemplate, INSERT_FLAG);
                return {result: insertResult.result, data: insertResult.insertedPositions, message: insertResult.message};
            } else {
                return {result: true, data: [], message: ''};
            }
        } else {
            console.log("Error: wrong referral table name!");
            return {result: false, message: 'wrong referral table name', data: []};
        }
    } else {
        console.log("Error: Warehousing is not consistent!");
        return {result: false, message: 'WAREHOUSING_IS_INCONSISTENT', data: []};
    }
}

/**
 * check if all orders positions have STATE 3 = STATE_POS_LI_DELIVERED
 *
 * @param ordersNumber
 * @param positionStatusDelivered
 */
export async function checkOrdersPositionsState(ordersNumber: string, positionStatusDelivered: number) {
    let foundWrongState: boolean = false;
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'ORDERS_NUMBER', type: sql.VarChar, value: ordersNumber}];
    let query: string = `SELECT AA.ID, AA.POSITION_STATUS FROM ` + constants.DB_TABLE_PREFIX + `ORDERS_POSITIONS AA 
    WHERE AA.ORDERS_NUMBER = @ORDERS_NUMBER`;
    console.log("checkOrdersPositionsState-Query: ", query);
    let opData: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
    for (let opItem in opData) {
        if (opData.hasOwnProperty(opItem) && opData[opItem].POSITION_STATUS !== positionStatusDelivered) {
            foundWrongState = true;
            break;
        }
    }
    return foundWrongState;
}

/**
 * returns last ORDERS_NUMBER
 */
export async function mssql_last_orderNumber() {
    let query: string = `SELECT TOP 1 ORDERS_NUMBER FROM ` + constants.DB_TABLE_PREFIX + `ORDERS 
    ORDER BY ORDERS_NUMBER DESC`;
    let data: any = await mssqlCall.mssqlCall(query);
    return (data.length) ? data[0]['ORDERS_NUMBER'] : 0;
}

/**
 * returns boolean flag if items existing for given orders number
 *
 * @param ordersNumber
 */
export async function mssql_is_order_number_existing(ordersNumber: string): Promise<boolean> {
    let query: string = `SELECT COUNT(ORDERS_NUMBER) AS NR FROM ${constants.DB_TABLE_PREFIX}ORDERS 
            WHERE ORDERS_NUMBER = '${ordersNumber}'`;
    console.log('query: ', query);
    const data: any = await mssqlCall.mssqlCall(query);
    console.log('data ', data);
    return <boolean>(data[0]['NR'] > 0);
}

/**
 * insert order/delivery note/invoice positions - FOR ONLY ONE SET ITEM !!! For many SET call function for each SET!
 *
 * @param refTable - 'orderPosition' or 'deliveryNotePositions' or 'invoicePositions'
 * @param elementsArray - array with ['ITM'] and ['KMP'] data of Order or Invoice
 * @param tableTemplate - tableTemplate array
 * @param insertFlag - if true, order positions will be inserted. otherwise only order prices will be updated
 */
export async function insertPositions(refTable: string,
                                      elementsArray: any | OrderDataInterface | InvoiceDataInterface,
                                      tableTemplate: any,
                                      insertFlag: boolean):
    Promise<{ result: boolean, insertedPositions: any[], message: string }> {
    console.log('insertPositions...');
    if (elementsArray && elementsArray['ITM'] && elementsArray['KMP']) {
        let insertedPositions: any[] = [];
        let taxResult: any = [];
        // get customers taxation and current orders amount prices
        let taxQuery: { inputParamsArray: { name: string, type: any, value: any }[], queryString: string };
        if (elementsArray['ITM'][0].ORDERS_NUMBER) {
            taxQuery = getTaxQuery(elementsArray['ITM'][0].ORDERS_NUMBER);
        } else if(elementsArray['ITM'][0].INVOICES_NUMBER) {
            taxQuery = getInvoiceTaxQuery(elementsArray['ITM'][0].INVOICES_NUMBER);
        }
        if (taxQuery) {
            console.log('taxQuery.inputParamsArray: ', taxQuery.inputParamsArray);
            console.log('taxQuery.queryString: ', taxQuery.queryString);
            taxResult = await mssqlCall.mssqlCallEscaped(taxQuery.inputParamsArray, taxQuery.queryString);
        }
        console.log('taxResult: ',taxResult);
        if (!(taxResult.length > 0) || taxResult[0]['TAXATION'] === null) {
            // console.log('Taxation not found...');
            return {result: false, insertedPositions: [], message: 'TAXATION'};
        }
        let query: string = ``;
        if (insertFlag) {
            // remove ID from insert query, because it will be generated by default
            if (tableTemplate[0]['DETAIL_VIEW'].substring(0, 3) === 'ID,') {
                tableTemplate[0]['DETAIL_VIEW'] =
                    tableTemplate[0]['DETAIL_VIEW'].substring(3, tableTemplate[0]['DETAIL_VIEW'].length); // remove id
            }
            const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
            const TABLE_NAME_VALUE: string = tableTemplate[0]['TABLE_NAME'];
            const TABLE_DETAIL_VIEW: string = tableTemplate[0]['DETAIL_VIEW'];
            console.log('TABLE_DETAIL_VIEW: ', TABLE_DETAIL_VIEW);
            let inputParamsArray: { name: string, type: any, value: any }[] = [];
            query = `INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE + ` (` + TABLE_DETAIL_VIEW + `) VALUES `;
            elementsArray['ITM'][0]['PARENT_LINE_ID'] = null;
            console.log('INSERT ITM: ', elementsArray['ITM'][0]);
            const TABLE_DETAIL_VIEW_ARR: string[] = TABLE_DETAIL_VIEW.split(',');
            await execInsertMethod(TABLE_DETAIL_VIEW_ARR, elementsArray['ITM'][0], query, TABLE_NAME_VALUE);
            // load the inserted article position item id
            let lastOPIDResult: any = await mssql_last_table_id(tableTemplate[0]['TABLE_NAME'], "ID",
                undefined, undefined);
            if (typeof lastOPIDResult === 'number') {
                query = `DECLARE @positionsids table (
                                ID int, ORDERS_NUMBER nvarchar(20), ITMNUM nvarchar(255), POSITION_ID int);
                                INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE + ` (` + TABLE_DETAIL_VIEW + `) 
                                OUTPUT INSERTED.ID, INSERTED.ORDERS_NUMBER, INSERTED.ITMNUM, INSERTED.POSITION_ID 
                                INTO @positionsids VALUES `;
                // then add components to the query
                let iPNKeyCntr: number = 0
                for (let kmpItem in elementsArray['KMP']) {
                    if (elementsArray['KMP'].hasOwnProperty(kmpItem)) {
                        elementsArray['KMP'][kmpItem]['PARENT_LINE_ID'] =
                            (elementsArray['KMP'][kmpItem]['CATEGORY_SOAS'] === constants.CATEGORY_SOAS_KOMP) ?
                                lastOPIDResult : null;
                        let queryValues: { inputParamsArray: any, query: string, iPNKeyCntr: number } =
                            await addValuesToQuery(TABLE_DETAIL_VIEW_ARR, elementsArray['KMP'][kmpItem],
                                query, TABLE_NAME_VALUE, iPNKeyCntr);
                        iPNKeyCntr = queryValues.iPNKeyCntr; // queryValues.inputParamsArray.length;
                        inputParamsArray.push(...queryValues.inputParamsArray);
                        query = queryValues.query;
                        query += `,`;
                    }
                }
                console.log('inputParamsArray: ', inputParamsArray);
                // remove last comma
                query = (query.substr(query.length - 1, query.length) === `,`) ?
                    query.substr(0, query.length - 1) : query;
                // add select query for inserted ids
                query += `; SELECT * FROM @positionsids`;
                console.log("Insert query: ", query);
                // write all values to db
                let insertedData = await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
                console.log('Insert Result: ', insertedData);
                if (insertedData && !insertedData.error) {
                    for (let insDataItem in insertedData) {
                        if (insertedData.hasOwnProperty(insDataItem)) {
                            if (typeof insertedData[insDataItem].ID === 'number') {
                                let foundItem: boolean = false;
                                for (let kmpItem in elementsArray['KMP']) {
                                    if (elementsArray['KMP'].hasOwnProperty(kmpItem)) {
                                        if ((insertedData[insDataItem]['ORDERS_NUMBER'] ===
                                                elementsArray['KMP'][kmpItem]['ORDERS_NUMBER']) &&
                                            (insertedData[insDataItem]['ITMNUM'] ===
                                                elementsArray['KMP'][kmpItem]['ITMNUM']) &&
                                            (insertedData[insDataItem]['POSITION_ID'] ===
                                                elementsArray['KMP'][kmpItem]['POSITION_ID'])) {
                                            insertedPositions.push({
                                                NEW_INSERTED_ID: insertedData[insDataItem].ID,
                                                DELIVERY_NOTES_POSITIONS_ID:
                                                    elementsArray['KMP'][kmpItem]['DELIVERY_NOTES_POSITIONS_ID'],
                                                ORDERS_NUMBER: insertedData[insDataItem].ORDERS_NUMBER,
                                                ITMNUM: insertedData[insDataItem].ITMNUM,
                                                ORDERS_POSITIONS_ID: elementsArray['KMP'][kmpItem]['ORDERS_POSITIONS_ID'],
                                                POSITION_ID: insertedData[insDataItem].POSITION_ID,
                                            });
                                            foundItem = true;
                                            break;
                                        }
                                    }
                                }
                                if (!foundItem) {
                                    console.log("ERROR: Inserted item not found! ", insertedData[insDataItem]);
                                }
                            }
                        }
                    }
                }
                console.log("refTable: ", refTable);
                if (refTable === 'orderPosition') {
                    // console.log('elementsArray[\'ITM\']: ', elementsArray['ITM']);
                    await updateOrderPrices(taxResult, elementsArray['ITM'][0], insertFlag);
                } else if (refTable === 'invoicePositions') {
                    await updateInvoiceAmounts(taxResult, elementsArray['ITM'][0], insertFlag);
                }
                // when all have been added
                return {result: true, insertedPositions: insertedPositions, message: ''};
            }
        } else {
            if (refTable === 'orderPosition') {
                await updateOrderPrices(taxResult, elementsArray['ITM'][0], insertFlag);
            } else if (refTable === 'invoicePositions') {
                await updateInvoiceAmounts(taxResult, elementsArray['ITM'][0], insertFlag);
            }
            return {result: true, insertedPositions: insertedPositions, message: ''};
        }
    } else {
        console.log("ERROR: updateOrderPositions - elementsArray is empty!");
        return {result: false, insertedPositions: [], message: 'ERROR: updateOrderPositions - elementsArray is empty!'};
    }
}

/**
 * update order prices
 *
 * @param taxResult
 * @param elementsArray
 * @param insertFlag
 */
export async function updateOrderPrices(taxResult: any, elementsArray: any, insertFlag: boolean) {
    let newOrderPrices: { 'ORDERAMOUNT_NET': number, 'ORDERAMOUNT_BRU': number, 'TAX_AMOUNT': number } =
        calculateOrderPrices(taxResult, elementsArray, insertFlag);
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'ORDERAMOUNT_NET', type: sql.NVarChar, value: newOrderPrices['ORDERAMOUNT_NET']},
        {name: 'ORDERAMOUNT_BRU', type: sql.NVarChar, value: newOrderPrices['ORDERAMOUNT_BRU']},
        {name: 'TAX_AMOUNT', type: sql.NVarChar, value: newOrderPrices['TAX_AMOUNT']},
        {name: 'ORDERS_NUMBER', type: sql.VarChar, value: elementsArray['ORDERS_NUMBER']}];
    let updateOrderAmountQuery: string = `UPDATE ` + constants.DB_TABLE_PREFIX + `ORDERS SET 
        ORDERAMOUNT_NET = @ORDERAMOUNT_NET, ORDERAMOUNT_BRU = @ORDERAMOUNT_BRU, TAX_AMOUNT = @TAX_AMOUNT 
        WHERE ORDERS_NUMBER = @ORDERS_NUMBER`;
    console.log('inputParamsArray: ', inputParamsArray);
    console.log('updateOrderAmountQuery: ', updateOrderAmountQuery);
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, updateOrderAmountQuery);
}

/**
 * Calculate prices after order positions are updated
 *
 * @param taxResult
 * @param newOrderPositionArray
 * @param insertFlag
 */
export function calculateOrderPrices(taxResult: any, newOrderPositionArray: any, insertFlag: boolean):
    { 'ORDERAMOUNT_NET': number, 'ORDERAMOUNT_BRU': number, 'TAX_AMOUNT': number } {
    console.log('calculateOrderPrices...');
    // console.log('taxResult: ', taxResult);
    // console.log('newOrderPositionArray: ', newOrderPositionArray);
    // go through all order positions items
    let orderAmountNet: number = 0;
    let orderAmountBru: number = 0;
    let taxAmount: number = 0;
    // flag if discount etc. is set
    let discountSet: boolean = false;
    let discount: number = 0;
    let voucher: number = 0;
    let shippingCosts: number = 0;
    //@ToDo: Add check for position category here...
    // calculate already available prices
    for (let ordElm in taxResult) {
        if (taxResult.hasOwnProperty(ordElm)) {
            // get prices only from invoice elements
            if (taxResult[ordElm]['ADDRESS_TYPE'] === 'INV') {
                if (taxResult[ordElm]['PRICE_BRU'] && taxResult[ordElm]['PRICE_NET']) {
                    if (taxResult[ordElm]['ORDER_QTY'] > 0) { //ASSIGNED_QTY
                        orderAmountBru += taxResult[ordElm]['PRICE_BRU'] * taxResult[ordElm]['ORDER_QTY']; //ASSIGNED_QTY
                        orderAmountNet += taxResult[ordElm]['PRICE_NET'] * taxResult[ordElm]['ORDER_QTY'];
                    } else {
                        console.log('ERROR: ORDER_QTY is 0 for ITMNUM: ', taxResult[ordElm]['ITMNUM']);
                    }
                }
                if (!discountSet && taxResult[ordElm]['DISCOUNT'] && taxResult[ordElm]['VOUCHER'] &&
                    taxResult[ordElm]['SHIPPING_COSTS']) {
                    discount = taxResult[ordElm]['DISCOUNT'];
                    voucher = taxResult[ordElm]['VOUCHER'];
                    shippingCosts = taxResult[ordElm]['SHIPPING_COSTS'];
                    discountSet = true;
                }
            }
        }
    }
    // console.log('orderAmountBru: ', orderAmountBru);
    // console.log('orderAmountNet: ', orderAmountNet);
    if (insertFlag) {
        console.log('Add prices of new item');
        // add prices of new item
        orderAmountBru += newOrderPositionArray['PRICE_BRU'] * newOrderPositionArray['ORDER_QTY']; //ASSIGNED_QTY
        orderAmountNet += newOrderPositionArray['PRICE_NET'] * newOrderPositionArray['ORDER_QTY'];
    } else {
        console.log('Ignore prices of updated item');
    }
    /*** calculate price amount bru and net with: orders DISCOUNT, VOUCHER, SHIPPING_COSTS ***/
    // Only for B2C customers: calculate voucher => use real and not changed (by voucher or shipping costs) value
    if (taxResult['CLIENT'] === constants.CLIENT_B2C) {
        const __retVoucher = calculateVoucher(orderAmountNet, orderAmountBru, voucher);
        orderAmountNet = __retVoucher.orderAmountNet;
        orderAmountBru = __retVoucher.orderAmountBru;
    }
    const __retDiscount = calculateDiscount(orderAmountNet, orderAmountBru, discount);
    orderAmountNet = __retDiscount.orderAmountNet;
    orderAmountBru = __retDiscount.orderAmountBru;
    const __retShippingCosts = calculateShippingCosts(orderAmountNet, orderAmountBru, shippingCosts);
    orderAmountNet = __retShippingCosts.orderAmountNet;
    orderAmountBru = __retShippingCosts.orderAmountBru;
    taxAmount = calcTaxAmount(orderAmountBru, orderAmountNet);
    console.log('NEW calculated prices: ', {'ORDERAMOUNT_NET': orderAmountNet, 'ORDERAMOUNT_BRU': orderAmountBru});
    return {'ORDERAMOUNT_NET': orderAmountNet, 'ORDERAMOUNT_BRU': orderAmountBru, 'TAX_AMOUNT': taxAmount};
}

/**
 * Calculate order amount prices (NET and BRU) with DISCOUNT
 *
 * @param orderAmountNet
 * @param orderAmountBru
 * @param discount
 */
export function calculateDiscount(orderAmountNet: number, orderAmountBru: number, discount: number) {
    console.log('discount: ', discount);
    if (discount && discount > 0) {
        if (orderAmountNet > 0) {
            orderAmountNet -= discount;
        }
        if (orderAmountBru > 0) {
            orderAmountBru -= discount;
        }
    }
    console.log('orderAmountNet: ', orderAmountNet);
    console.log('orderAmountBru: ', orderAmountBru);
    return {orderAmountNet, orderAmountBru};
}

/**
 * calculate voucher
 *
 * @param orderAmountNet
 * @param orderAmountBru
 * @param voucher
 */
export function calculateVoucher(orderAmountNet: number, orderAmountBru: number, voucher: number) {
    console.log('voucher: ', voucher);
    if (voucher && voucher > 0) {
        if (orderAmountNet > 0) {
            orderAmountNet = (orderAmountNet - ((orderAmountNet / 100) * voucher));
        }
        if (orderAmountBru > 0) {
            orderAmountBru = (orderAmountBru - ((orderAmountBru / 100) * voucher));
        }
    }
    console.log('orderAmountNet: ', orderAmountNet);
    console.log('orderAmountBru: ', orderAmountBru);
    return {orderAmountNet, orderAmountBru};
}

/**
 * calculate shipping costs
 *
 * @param orderAmountNet
 * @param orderAmountBru
 * @param shippingCosts
 */
export function calculateShippingCosts(orderAmountNet: number, orderAmountBru: number, shippingCosts: number) {
    console.log('shippingCosts: ', shippingCosts);
    if (shippingCosts && shippingCosts > 0) {
        if (orderAmountNet > 0) {
            orderAmountNet += shippingCosts;
        }
        if (orderAmountBru > 0) {
            orderAmountBru += shippingCosts;
        }
    }
    console.log('orderAmountNet: ', orderAmountNet);
    console.log('orderAmountBru: ', orderAmountBru);
    return {orderAmountNet, orderAmountBru};
}

/**
 * return tax query for given orders number
 *
 * @param ordersNumber
 */
export function getTaxQuery(ordersNumber: string) {
    // ToDo: Refactor by adding/providing column names from client or db table:
    //  at adding new column to orders positions no need to update this query...
    const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'ORDERS_NUMBER', type: sql.VarChar, value: ordersNumber}];
    let queryString: string = `SELECT TR.TAXRATE AS TAXATION, 
        CA.ADDRESS_TYPE, CA.ADDRESS_STREET, CA.ADDRESS_CITY, CA.ADDRESS_POSTCODE, 
        O.ORDERAMOUNT_NET, O.ORDERAMOUNT_BRU, O.DISCOUNT, O.VOUCHER, O.SHIPPING_COSTS, O.CLIENT, 
        OP.ITMNUM, OP.PRICE_NET, OP.PRICE_BRU, OP.ORDER_QTY, OP.ASSIGNED_QTY, OP.POSITION_ID, 
        OP.DELIVERED_QTY, OP.WAREHOUSE, OP.DIST_COMPONENTS_ID, OP.CATEGORY_SOAS
        FROM ` + DB_TABLE_PREFIX + `CUSTOMERS CS 
        LEFT JOIN ` + DB_TABLE_PREFIX + `ORDERS O ON O.CUSTOMER_ORDER = CS.CUSTOMERS_NUMBER 
        LEFT JOIN ` + DB_TABLE_PREFIX + `CUSTOMERS_ADDRESSES CA ON CA.CUSTOMERS_NUMBER = CS.CUSTOMERS_NUMBER 
        LEFT JOIN ` + DB_TABLE_PREFIX + `ORDERS_POSITIONS OP ON O.ORDERS_NUMBER = OP.ORDERS_NUMBER 
        LEFT JOIN ` + DB_TABLE_PREFIX + `TAXRATES TR ON CA.TAXCODE = TR.TAXCODE AND O.TAXCODE = TR.TAXCODE AND 
        O.TAXRATE = TR.TAXRATE AND TR.PER_END IS NULL 
        WHERE O.ORDERS_NUMBER = @ORDERS_NUMBER`;
    return {inputParamsArray, queryString};
}

/**
 * updates WAREHOUSE_RESERVATION_CACHE item and set DELIVERY_NOTES_POSITIONS_ID
 *
 * @param orderNumber
 * @param dataDNPSItem
 * @param warehouseControl
 */
export async function setWRCDelNotePosID(orderNumber: string, dataDNPSItem: any, warehouseControl: WarehouseControl) {
    let warehouseReservationCacheItem: WarehouseReservationCacheInterface = {
        warehouseRCId: 0,
        warehouseRCDocumentNumber: orderNumber,
        warehouseRCItemNumber: dataDNPSItem.ITMNUM,
        warehouseRCAssignedQuantity: 0,
        warehouseRCBatchNumber: '',
        warehouseRCStorageLocation: '',
        warehouseRCWarehouse: '',
        warehouseRCPositionId: dataDNPSItem.POSITION_ID,
        warehouseRCAssignmentDate: '',
        warehouseRCWarehousingId: 0, // dataDNPSItem.WAREHOUSING_ID,
        warehouseRCOrdersPositionsId: dataDNPSItem.ORDERS_POSITIONS_ID,
        warehouseRCDeliveryNotesPositionsId: 0,
    };
    await warehouseControl.setDLVPosIdWarehouseReservationCache(dataDNPSItem.NEW_INSERTED_ID,
        warehouseReservationCacheItem);
}

/**
 * prepare data for insert into WarehouseReservationCache
 *
 * @param insertType
 * @param insertOPResult
 * @param insertWRCData
 */
export function insertWRCacheInterface(insertType: string, insertOPResult: { result: any; insertedPositions: [] },
                                insertWRCData: WarehouseReservationCacheInterface[]) {
    // insert into warehousing cache
    if (insertOPResult.insertedPositions) {
        for (let insPosItem in insertOPResult.insertedPositions) {
            if (insertOPResult.insertedPositions.hasOwnProperty(insPosItem)) {
                // add delivery notes positions ids
                for (let insWRCDataItem in insertWRCData) {
                    if ((insertOPResult.insertedPositions[insPosItem]['ORDERS_NUMBER'] ===
                        insertWRCData[insWRCDataItem].warehouseRCDocumentNumber) &&
                        (insertOPResult.insertedPositions[insPosItem]['ITMNUM'] ===
                            insertWRCData[insWRCDataItem].warehouseRCItemNumber) &&
                        (insertOPResult.insertedPositions[insPosItem]['POSITION_ID'] ===
                            insertWRCData[insWRCDataItem].warehouseRCPositionId)) {
                        if (insertType === 'NEW_OP') {
                            // if new order positions: prepare data by adding order position id
                            // DELIVERY_NOTES_POSITIONS_ID = new ORDERS_POSITIONS_ID here
                            insertWRCData[insWRCDataItem].warehouseRCOrdersPositionsId =
                                insertOPResult.insertedPositions[insPosItem]['NEW_INSERTED_ID']; // DELIVERY_NOTES_POSITIONS_ID
                        } else if (insertType === 'NEW_DEL') {
                            // if new delivery note: prepare data by adding delivery note position id
                            if ((insertOPResult.insertedPositions[insPosItem]['ORDERS_POSITIONS_ID'] ===
                                insertWRCData[insWRCDataItem].warehouseRCOrdersPositionsId)) {
                                insertWRCData[insWRCDataItem].warehouseRCDeliveryNotesPositionsId =
                                    insertOPResult.insertedPositions[insPosItem]['NEW_INSERTED_ID']; // DELIVERY_NOTES_POSITIONS_ID
                            }
                        }
                    }
                }
            }
        }
    } else {
        console.log('Error occurred: WAREHOUSE_RESERVATION_CACHE items was not updated...');
    }
    return insertWRCData;
}

/**
 * calculate order position SET (virtual) assigned quantity (qty)
 *
 * @param ordersNumber
 * @param orderPositions
 * @param orderPositionsStates
 */

export async function calc_order_position_set_assigned_qty(ordersNumber: string,
                                                           orderPositions: OrderPositionDataInterface[],
                                                           orderPositionsStates: []
): Promise<OrderPositionDataInterface[]> {
    let currSetItem: any;
    let currSetId = 0;
    let currSetQty = 0;
    let currSetAssignedQty = 0;
    console.log('orderPositions: ', orderPositions);
    let currSetDistComponents: DistComponentDataInterface[] = [];
    // load current´s SET already available delivery note positions (partly delivery note)
    let currOrderDNPositions: DeliveryNotePositionDataInterface[] = await getPartlyDeliveryNotePositions(ordersNumber);
    // console.log('currOrderDNPositions: ', currOrderDNPositions);
    let allocatedPositions: any = await loadAllocatedFromCache(ordersNumber);
    // console.log('allocatedPositions: ', allocatedPositions);
    let finalSetVirtualQty = 0;
    let qtyErrorFound = false;

    // Step 1: Reduce order positions qty by delivery note positions assigned qty
    qtyErrorFound = reduceByDeliveryNotePositions(orderPositions, currOrderDNPositions, qtyErrorFound);
    // console.log('Zwischenstand Step 1 - orderPositions: ', JSON.parse(JSON.stringify(orderPositions)));

    // Step 2: Reduce order positions qty by warehouse reservation cache qty
    for (let item in orderPositions) {
        if (orderPositions[item]) {
            for (let allPItem in allocatedPositions) {
                if (orderPositions[item].ORDERS_NUMBER === allocatedPositions[allPItem].DOCUMENT_NUMBER &&
                    orderPositions[item].ITMNUM === allocatedPositions[allPItem].ITMNUM &&
                    orderPositions[item].ID === allocatedPositions[allPItem].ORDERS_POSITIONS_ID &&
                    allocatedPositions[allPItem].DELIVERY_NOTES_POSITIONS_ID === null) {
                    orderPositions[item].ORDER_QTY -= allocatedPositions[allPItem].ASSIGNED_QTY;
                }
            }
        }
    }
    // console.log('Zwischenstand Step 2 - orderPositions: ', JSON.parse(JSON.stringify(orderPositions)));

    // Step 3: Reduce SET qty by dist components qty
    qtyErrorFound = await reduceSetQty(orderPositions, currSetId, currSetItem, currSetQty, currSetAssignedQty,
        currSetDistComponents, finalSetVirtualQty, orderPositionsStates, qtyErrorFound);

    // console.log('Zwischenstand Step 3 - orderPositions: ', JSON.parse(JSON.stringify(orderPositions)));

    /*
    if (!qtyErrorFound) {
        qtyErrorFound = reduceByDeliveryNotePositions(orderPositions, currOrderDNPositions, qtyErrorFound);
        // compare order positions with delivery notes positions, if for some positions are already delivery notes created
        // reduce qty of this positions
    }
    */

    if (qtyErrorFound) {
        console.warn('ERROR occurred! Reset orderPositions.');
        orderPositions = [];
    }

    // console.log('Final - orderPositions: ', JSON.parse(JSON.stringify(orderPositions)));
    // throw new Error('stopp');

    return orderPositions;
}

function reduceByDeliveryNotePositions(orderPositions: OrderPositionDataInterface[],
                                       currOrderDNPositions: DeliveryNotePositionDataInterface[],
                                       qtyErrorFound: boolean) {
    // (maybe optional) check order positions, if new calculated qty is consistent
    // if it is not consistent, update components qty based on new set qty
    for (let item in orderPositions) {
        if (orderPositions[item]) {
            for (let dnpItem in currOrderDNPositions) {
                if (orderPositions[item].ORDERS_NUMBER === currOrderDNPositions[dnpItem].ORDERS_NUMBER &&
                    orderPositions[item].ITMNUM === currOrderDNPositions[dnpItem].ITMNUM &&
                    orderPositions[item].ID === currOrderDNPositions[dnpItem].ORDERS_POSITIONS_ID &&
                    orderPositions[item].POSITION_ID === currOrderDNPositions[dnpItem].POSITION_ID &&
                    orderPositions[item].CATEGORY_SOAS === currOrderDNPositions[dnpItem].CATEGORY_SOAS) {
                    // console.log('FOUND! ', orderPositions[item].ITMNUM);
                    if (orderPositions[item].ORDER_QTY > currOrderDNPositions[dnpItem].ORDER_QTY) {
                        orderPositions[item].ORDER_QTY -= currOrderDNPositions[dnpItem].ORDER_QTY;
                        // console.log('REDUCED! ', orderPositions[item].ORDER_QTY);
                        if (orderPositions[item].ORDER_QTY <= 0) {
                            console.warn('ERROR: ORDER_QTY is 0 or lower! ', orderPositions[item]);
                            qtyErrorFound = true;
                        }
                        // reduce orders assigned qty for components only
                        if (orderPositions[item].CATEGORY_SOAS === constants.CATEGORY_SOAS_KOMP) {
                            orderPositions[item].ASSIGNED_QTY -= currOrderDNPositions[dnpItem].ORDER_QTY;
                            if (orderPositions[item].ASSIGNED_QTY <= 0) {
                                console.warn('ERROR: ASSIGNED_QTY is 0 or lower! ', orderPositions[item]);
                                qtyErrorFound = true;
                            }
                        }
                    }
                }
            }
        }
    }
    return qtyErrorFound;
}

/**
 * get partly delivery notes positions for given itmnum
 *
 * @param ordersNumber
 */
export async function getPartlyDeliveryNotePositions(ordersNumber: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] =
        [
            {name: 'ORDERS_NUMBER', type: sql.NVarChar, value: ordersNumber},
            {name: 'PARTLY_DELIVERY', type: sql.NVarChar, value: '1'}
        ];
    let getPartlyDNPQuery: string = `SELECT BB.* FROM ` + constants.DB_TABLE_PREFIX + `DELIVERY_NOTES AA
        LEFT JOIN ` + constants.DB_TABLE_PREFIX + `DELIVERY_NOTES_POSITIONS BB ON BB.DELIVERY_NOTES_NUMBER = AA.DELIVERY_NOTES_NUMBER
        WHERE AA.ORDERS_NUMBER = @ORDERS_NUMBER AND AA.PARTLY_DELIVERY = @PARTLY_DELIVERY`;
    console.log('getPartlyDNPQuery: ', getPartlyDNPQuery);
    console.log('inputParamsArray: ', inputParamsArray);
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, getPartlyDNPQuery);
}

/**
 * load item(s) from WAREHOUSE_RESERVATION_CACHE by orders number and where delivery note positions id is null
 *
 * @param ordersNumber
 */
async function loadAllocatedFromCache(ordersNumber: string) {
    let inputParamsArray: {name: string, type: any, value: any}[] = [
        {name: 'DOCUMENT_NUMBER', type: sql.VarChar, value: ordersNumber}
    ];
    let loadFWRCQuery: string = `SELECT * FROM ` + constants.DB_TABLE_PREFIX + `WAREHOUSE_RESERVATION_CACHE 
        WHERE DOCUMENT_NUMBER = @DOCUMENT_NUMBER AND DELIVERY_NOTES_POSITIONS_ID IS NULL`;
    console.log("loadAllocatedFromCache: ", loadFWRCQuery);
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, loadFWRCQuery);
}

async function reduceSetQty(orderPositions: OrderPositionDataInterface[], currSetId: number, currSetItem: any,
                            currSetQty: number, currSetAssignedQty: number,
                            currSetDistComponents: DistComponentDataInterface[], finalSetVirtualQty: number,
                            orderPositionsStates: [], qtyErrorFound: boolean) {
    for (let item in orderPositions) {
        if (orderPositions[item]) {
            // SET item: get set´s data (id and position in array)
            if (orderPositions[item].CATEGORY_SOAS !== constants.CATEGORY_SOAS_KOMP) {
                if (!currSetId || (currSetId !== orderPositions[item].ID)) {
                    currSetItem = JSON.parse(JSON.stringify(item));
                    currSetId = orderPositions[item].ID;
                    currSetQty = orderPositions[item].ORDER_QTY;
                    // make a copy of qty
                    currSetAssignedQty = JSON.parse(JSON.stringify(currSetQty));
                    // console.log('currentSetId: ', currSetId);
                    // load current´s SET components, to be able to load qty of components
                    currSetDistComponents = await getComponents(orderPositions[item].ITMNUM);
                    finalSetVirtualQty = 0;
                }
            } else {
                // KOMP item: go through dist components and determine how many times component is in set and
                // based on this value set (reduce) the set value

                // console.log('--------------------------------------------------------------------------- ');
                // console.log('KOMP - orderPositions[item].ID: ', orderPositions[item].ID);

                if (currSetItem && orderPositions[item] && (orderPositions[item].PARENT_LINE_ID === currSetId) &&
                    currSetDistComponents) {

                    let currSummeQty = 0;
                    let currSetVirtualQty = 0;
                    let currDistComponentQty = 0;

                    for (let compItem in currSetDistComponents) {
                        if (currSetDistComponents[compItem].ID === orderPositions[item].DIST_COMPONENTS_ID &&
                            currSetDistComponents[compItem].COMPNUM === orderPositions[item].ITMNUM) {
                            currDistComponentQty = currSetDistComponents[compItem].DIST_QTY; // 1, 2
                            for (let i = 1; i <= currDistComponentQty; i++) { // 1
                                currSummeQty += currDistComponentQty;
                                currSetVirtualQty++;
                                if (orderPositions[item].ASSIGNED_QTY === currSummeQty) {  // 1 === 1
                                    i = currDistComponentQty; // break
                                } else if (orderPositions[item].ASSIGNED_QTY < currSummeQty) {  // 1 < 2
                                    console.warn('ERROR: currentSummeQty is higher than ASSIGNED_QTY! ' +
                                        currSummeQty + ' vs. ' + orderPositions[item].ASSIGNED_QTY + ' ITMNUM: ' +
                                        orderPositions[item].ITMNUM);
                                    currSetVirtualQty = 0;
                                    i = currDistComponentQty; // break
                                }
                            }
                        }
                    }

                    // write qty to SET
                    if (currSetVirtualQty) {
                        // @ts-ignore write only for partially state positions
                        if (orderPositions[currSetItem].POSITION_STATUS === orderPositionsStates[2].STATES_ID) {
                            orderPositions[currSetItem].ORDER_QTY = currSetVirtualQty;
                            console.log('NEW currentSetVirtualQty: ', currSetVirtualQty + ' ID: ' + orderPositions[item].ID +
                                ' SET-ID: ' + currSetId + ' currentSetItem: ' + currSetItem);

                            if (finalSetVirtualQty > 0 && orderPositions[currSetItem].ORDER_QTY !== finalSetVirtualQty) {
                                console.warn('ERROR: Component qty is wrong! ' + currSetVirtualQty + ' final: ' +
                                    finalSetVirtualQty + ' ITMNUM: ' + orderPositions[item].ITMNUM);
                                qtyErrorFound = true;
                            } else {
                                finalSetVirtualQty = currSetVirtualQty;
                            }
                        } else {
                            console.log('IGNORE: Wrong position state! ' + orderPositions[currSetItem].POSITION_STATUS +
                                ' qty: ' + currSetVirtualQty + ' ITMNUM: ' + orderPositions[item].ITMNUM);
                        }
                    } else {
                        console.warn('ERROR: Component qty is empty! ' + currSetVirtualQty + ' ITMNUM: ' + orderPositions[item].ITMNUM);
                    }

                } else {
                    console.warn('ERROR: Component not found! ', orderPositions[item] + ' currentSetItem: ' + currSetItem);
                }
            }
        }
    }
    return qtyErrorFound;
}

/**
 * get components for given itmnum
 *
 * @param itmnum
 */
export async function getComponents(itmnum: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] =
        [
            {name: 'ITMNUM', type: sql.NVarChar, value: itmnum}
        ];
    let getComponentsQuery: string = `SELECT * FROM ` + constants.DB_TABLE_PREFIX + `DIST_COMPONENTS WHERE 
        ITMNUM = @ITMNUM`;
    console.log('getComponentsQuery: ', getComponentsQuery);
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, getComponentsQuery);
}
