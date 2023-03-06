/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 15.06.2021 */
import * as sql from 'mssql';
import * as mssqlCall from '../../mssql_call';
import {constants} from '../../constants/constants';
import {OrderPosition} from '../../classes/OrderPosition';
import {WarehouseControl} from '../../classes/WarehouseControl';
import {DeliveryNote} from '../../classes/DeliveryNote';
import {DeliveryNotePosition} from '../../classes/DeliveryNotePosition';
import {WarehouseReservationCacheInterface} from '../../classes/interfaces/WarehouseReservationCacheInterface';
import {
    calc_order_position_set_assigned_qty,
    checkOrdersPositionsState,
    insertPositions,
    setWRCDelNotePosID
} from '../order/Order';
import {
    getNewListNumber,
    execMSSQLQueryWithPromise,
    mssql_call_get_table_name_and_detail_view,
    addValuesToQuery, mssql_call_get_table_name
} from '../../mssql_logic';
import {OrderPositionDataInterface} from '../../classes/interfaces/OrderPositionInterface';
import {mssql_select_Table_by_Number, primaryColumnTypes} from '../table/Table';
import {calcPositionsOrderQty, checkPositionIsInDnp} from '../warehouse/Warehouse';
import {loadStatesByType} from '../states/States';
import {getDateForQuery} from '../date/Date';
import {getItemForQuery} from '../../helpers';
import {ViewQueryTypes} from '../../constants/enumerations';
import {DeliveryNotePositionDataInterface} from "../../classes/interfaces/DeliveryNotePositionInterface";
import {DeliveryNoteDataInterface, DeliveryNoteInterface} from "../../classes/interfaces/DeliveryNoteInterface";


/**
 * Create delivery note manually (at orders form view, over "Lieferschein erstellen" button on the bottom)
 *
 * @param thisID - id to determine which type of new list number should be returned/generated
 * @param primaryKey - DELIVERY
 * @param primaryValue
 * @param userID
 * @param statesObj
 * @param ordersPositions
 * @param partlyDelivery
 */
export async function mssql_create_notes_manually(thisID: string, primaryKey: string, primaryValue: string,
                                                  userID: string, statesObj: any, ordersPositions: any,
                                                  partlyDelivery: boolean):
    Promise<{ success: boolean, errorCode: string, newDeliveryNote: undefined|string, positions: undefined|string }> {
    console.log('mssql_create_notes_manually...........');
    // 1. get orders data (orderData: any|Order):
    // 2. Check orders release === false; currency, customerNumber
    // 3. get orders positions data (orderPositionsData: any|OrderPosition): all entries
    // 4. check/extract, if one/all positions are suitable for creating a new delivery note
    // 5. create new delivery note, if needed
    // 6. return code for showing message for user, if delivery note was created or some errors occurred.
    // 7. return code for showing message for user, that a partly delivery note was created
    // 8. return code for showing error message for user, that the order of positions is wrong:
    //      first element must be 'SET', then followed by 'KOMP'
    let errors = {
        0: 'ORDER_IS_NOT_RELEASED',
        1: 'NO_POSITION_FOR_DELIVERY_NOTE_CREATION',
        2: 'DELIVERY_NOTE_WAS_CREATED',
        3: 'NO_ORDER_FOUND',
        4: 'NO_POSITIONS_FOUND',
        5: 'ERROR_OCCURRED',
        6: 'NO_POSITION_WITH_ASSIGNED_QTY_SET',
        7: 'PARTLY_DELIVERY_WAS_CREATED',
        8: 'POSITIONS_ORDER_IS_WRONG',
    }
    let states: {} = {};
    for (let i = 0; i < statesObj.length; i++) {
        states[statesObj[i]['STATES_NAME']] = statesObj[i]['STATES_ID'];
    }
    // 1. get orders data (orderData: any|Order): release === false; currency, customerNumber
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'PRIMARY_VALUE', type: sql.VarChar, value: primaryValue}];
    // get values of items before start and set them to const
    const PRIMARY_KEY_VALUE: string = getItemForQuery([primaryKey], primaryColumnTypes);
    let query: string = `SELECT * FROM ` + constants.DB_TABLE_PREFIX + `ORDERS 
    WHERE ` + PRIMARY_KEY_VALUE + ` = @PRIMARY_VALUE`;
    let orderData = await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
    if (!orderData.length) {
        return {success: false, errorCode: errors[3], newDeliveryNote: undefined, positions: undefined};
    }
    // // check if order positions have allowed state and correct delivered qty
    // let foundWrongState = await checkDLVPositionsState(primaryValue,
    //     [states['STATE_POS_PARTIALLY_ALLOCATED'], states['STATE_POS_COMPLETELY_ALLOCATED']]);
    // if (foundWrongState) {
    //     return {success: false, errorCode: errors[12], newInvoice: undefined, positions: undefined};
    // }
    let dnPositionsDbData: any =
        await mssql_select_Table_by_Number('deliveryNotePositions', ViewQueryTypes.DETAIL_TABLE,
            primaryKey, primaryValue, undefined, undefined,
            undefined, undefined,
             0, primaryKey, "ASC");
    if (!dnPositionsDbData) {
        return {success: false, errorCode: errors[4], newDeliveryNote: undefined, positions: undefined};
    }
    let dnPositions = dnPositionsDbData['data'][1];
    let orderPositionDbData: any =
        await mssql_select_Table_by_Number('orderPosition', ViewQueryTypes.DETAIL_TABLE, primaryKey, primaryValue,
            undefined, undefined, undefined, undefined,
             0, primaryKey, "ASC");
    console.log('orderPositionDbData: ', orderPositionDbData);
    if (!orderPositionDbData) {
        return {success: false, errorCode: errors[4], newDeliveryNote: undefined, positions: undefined};
    }
    let originalOrderPositions = orderPositionDbData['data'][1];
    console.log('ordersPositions: ', ordersPositions);
    // go through order positions and search for positions that are suitable for
    // generation of delivery note
    let positionsForDeliveryNoteCreation: any | OrderPosition[] = [];
    for (let opItem in ordersPositions) {
        if (ordersPositions.hasOwnProperty(opItem)) {
            let newKmpPosition: OrderPosition = ordersPositions[opItem];
            positionsForDeliveryNoteCreation.push(newKmpPosition);
        }
    }
    console.log("positionsForDeliveryNoteCreation: ", positionsForDeliveryNoteCreation);
    // throw new Error('stopp');
    return await createDeliveryNote(positionsForDeliveryNoteCreation, orderData, states, thisID,
        dnPositions, originalOrderPositions, partlyDelivery, errors);
}

/**
 * Create delivery note - IMPORTANT is the order of positions (posForDelNoteCrt): first 'SET', then 'KOMP'
 *
 * @param posForDelNoteCrt - positions for delivery note creation
 * @param orderData
 * @param states
 * @param thisID
 * @param dnPositions
 * @param ordersPositions
 * @param partlyDelivery
 * @param errors
 */
async function createDeliveryNote(posForDelNoteCrt: any, orderData: any, states: {}, thisID: string,
                                  dnPositions: any, ordersPositions: {}, partlyDelivery: boolean,
                                  errors: {
                                      "0": string; "1": string; "2": string; "3": string; "4": string;
                                      "5": string; "6": string; "7": string; "8": string
                                  }):
    Promise<{ success: boolean, errorCode: string, newDeliveryNote: undefined|string, positions: undefined|string }> {
    // Queries to insert/update
    let insertDelNoteQueries: any = [];
    let updateOrderStatusQueries: any = [];
    let warehouseControl: WarehouseControl = new WarehouseControl();
    const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    let inputParamsArray: {
        name: string,
        type: any,
        value: any
    }[] = [];
    if (Object.keys(posForDelNoteCrt).length > 0) {
        if (orderData) {
            if (ordersPositions) {
                // ToDo: Check if state is set to 20, after creating delivery note
                let orderState: string = states['STATE_AU_IN_PROCESS'];
                let deliveryState: string = states['STATE_LI_OPEN'];
                let delNoteTable: any = await mssql_call_get_table_name_and_detail_view(constants.REFTABLE_DELIVERY_NOTES);
                let delNotePosTable: any = await mssql_call_get_table_name_and_detail_view(constants.REFTABLE_DELIVERY_NOTES_POSITIONS);

                let splitDelNoteFields: any = delNoteTable[0].DETAIL_VIEW.split(',');
                let newDelNoteData: {
                    newLiNumber: undefined | string,
                    newDelNoteVal: any | DeliveryNoteInterface
                } = await setNewDelNoteValues(splitDelNoteFields, orderData, thisID, deliveryState);
                let newDelNoteVal: any | DeliveryNoteInterface = newDelNoteData.newDelNoteVal;
                let newLiNumber: undefined | string = newDelNoteData.newLiNumber;

                inputParamsArray.push({name: 'ORDER_STATE', type: sql.VarChar, value: orderState});
                inputParamsArray.push({
                    name: 'CUSTOMER_DELIVERY', type: sql.VarChar,
                    value: orderData[0]['CUSTOMER_ORDER']
                });
                inputParamsArray.push({name: 'LAST_DELIVERY', type: sql.VarChar, value: newLiNumber});
                inputParamsArray.push({
                    name: 'ORDERS_NUMBER', type: sql.VarChar, value:
                        orderData[0]['ORDERS_NUMBER']
                });
                // add update query to set order state and new delivery note number
                let updateOrderQuery = `UPDATE ` + DB_TABLE_PREFIX + `ORDERS SET ORDERS_STATE = @ORDER_STATE, 
                                    CUSTOMER_DELIVERY = @CUSTOMER_DELIVERY, LAST_DELIVERY = @LAST_DELIVERY 
                                    WHERE ORDERS_NUMBER = @ORDERS_NUMBER`;
                updateOrderStatusQueries.push(updateOrderQuery);

                let newDelNotePositionsValues: {
                    positionsItmNumsForMessage: string,
                    insertDelNotePosArray: any[],
                    partlyDelivery: boolean
                } = setNewDelNotePositionsValues(delNotePosTable, posForDelNoteCrt, newLiNumber, states, partlyDelivery);
                let insertDelNotePosArray: any[] = newDelNotePositionsValues.insertDelNotePosArray;
                let positionsItmNumsForMessage: string = newDelNotePositionsValues.positionsItmNumsForMessage;
                partlyDelivery = newDelNotePositionsValues.partlyDelivery;

                newDelNoteVal['PARTLY_DELIVERY'] = partlyDelivery ? '1' : '0';
                let queryInsert = `INSERT INTO ` + DB_TABLE_PREFIX + `DELIVERY_NOTES (` +
                    delNoteTable[0].DETAIL_VIEW + `) VALUES `;
                const TABLE_DETAIL_VIEW: string[] = delNoteTable[0]['DETAIL_VIEW'].split(',');
                let queryValues: { inputParamsArray: any, query: string, iPNKeyCntr: number } =
                    await addValuesToQuery(TABLE_DETAIL_VIEW, newDelNoteVal, queryInsert, 'DELIVERY_NOTES');
                console.log('insert query: ', queryValues.query);
                inputParamsArray.push(...queryValues.inputParamsArray);
                console.log('execInsertMethod inputParamsArray: ', inputParamsArray);
                queryInsert = queryValues.query;
                insertDelNoteQueries.push(queryInsert);
                if (Object.keys(insertDelNoteQueries).length > 0
                    && Object.keys(insertDelNotePosArray).length > 0) {
                    // && Object.keys(updateOrderStatusQueries).length > 0) {
                    // @ToDo: Add a rollback logic, if error occurred at inserting of delivery note
                    // IMPORTANT is, that the order of positions is right here: first 'SET', then 'KOMP'
                    console.log('insertDelNotePosArray: ', insertDelNotePosArray);
                    // Iterate over a SET (ITEM+KOMP) object items (for many SET's case)
                    let isDeliveryNoteCreated: boolean = false;
                    for (let arrayItem in insertDelNotePosArray) {
                        if (insertDelNotePosArray.hasOwnProperty(arrayItem)) {
                            // insert delivery note positions first
                            let insertDlvPosResult: { result: boolean | string, insertedPositions: any[] } =
                                await insertPositions('deliveryNotePositions', insertDelNotePosArray[arrayItem],
                                    delNotePosTable, true);
                            if (insertDlvPosResult.result) {
                                // check if delivery note item is already created, to prevent duplicates if many SET's provided.
                                if (!isDeliveryNoteCreated) {
                                    isDeliveryNoteCreated = true;
                                    // create delivery note
                                    await execMSSQLQueryWithPromise(inputParamsArray,
                                        insertDelNoteQueries).then(async () => {
                                        // update order state
                                        return await execMSSQLQueryWithPromise(inputParamsArray,
                                            updateOrderStatusQueries).then(async () => {
                                            if (positionsItmNumsForMessage.length) {
                                                positionsItmNumsForMessage =
                                                    positionsItmNumsForMessage.trim();
                                                positionsItmNumsForMessage =
                                                    positionsItmNumsForMessage.substr(0,
                                                        positionsItmNumsForMessage.length - 1);
                                            }
                                        });
                                    });
                                }
                                // update WAREHOUSE_RESERVATION_CACHE and
                                // set new created delivery note positions ids
                                for (let iOpItem in insertDlvPosResult.insertedPositions) {
                                    if (insertDlvPosResult.insertedPositions.hasOwnProperty(iOpItem)) {
                                        await setWRCDelNotePosID(orderData[0]['ORDERS_NUMBER'],
                                            insertDlvPosResult.insertedPositions[iOpItem],
                                            warehouseControl);
                                    }
                                }
                            } else {
                                console.log('Error occurred at positions insert...');
                                return {success: false, errorCode: errors[5], newDeliveryNote: undefined, positions: undefined};
                            }
                        }
                    }
                    console.log('Go back to client... !!!!!!!!!!!!!!!!');
                    return {
                        success: true,
                        errorCode: partlyDelivery ? errors[7] : errors[2],
                        newDeliveryNote: newLiNumber,
                        positions: positionsItmNumsForMessage
                    };
                } else {
                    console.log("No positions found for insert/update... Delivery note was NOT created...");
                    return {success: false, errorCode: errors[6], newDeliveryNote: undefined, positions: undefined};
                }
            } else {
                console.log('orderPositions are empty...');
                return {success: false, errorCode: errors[5], newDeliveryNote: undefined, positions: undefined};
            }
        } else {
            console.log('orderData is empty...');
            return {success: false, errorCode: errors[5], newDeliveryNote: undefined, positions: undefined};
        }
    } else {
        console.log('No order positions found for delivery notes creation...');
        return {success: false, errorCode: errors[1], newDeliveryNote: undefined, positions: undefined};
    }
}

/**
 * set new delivery note values
 *
 * @param splitDelNoteFields
 * @param orderData
 * @param thisID
 * @param deliveryState
 */
async function setNewDelNoteValues(splitDelNoteFields: any, orderData: any, thisID: string, deliveryState: string):
    Promise<{ newLiNumber: undefined | string, newDelNoteVal: any | DeliveryNoteInterface }> {
    let newDelNoteVal: any | DeliveryNoteInterface = {};
    for (let sdItem in splitDelNoteFields) {
        if (splitDelNoteFields.hasOwnProperty(sdItem)) {
            if (orderData[0][splitDelNoteFields[sdItem]]) {
                newDelNoteVal[splitDelNoteFields[sdItem]] =
                    orderData[0][splitDelNoteFields[sdItem]];
            } else {
                newDelNoteVal[splitDelNoteFields[sdItem]] = undefined;
            }
        }
    }
    let newLiNumber: undefined | string = await getNewListNumber(thisID, orderData[0]['SALES_LOCATION']); // TODO Andreas pls check this
    newDelNoteVal['DELIVERY_NOTES_NUMBER'] = newLiNumber;
    newDelNoteVal['CUSTOMERS_NUMBER'] = orderData[0]['CUSTOMER_ORDER'];
    newDelNoteVal['CUSTOMERS_NUMBER'] = orderData[0]['CUSTOMER_ORDER'];
    newDelNoteVal['DELIVERY_NOTES_STATE'] = deliveryState;
    newDelNoteVal['EXPORT_PRINT'] = '0';
    newDelNoteVal['RETOUR'] = '0';
    newDelNoteVal['RELEASE'] = '0';
    newDelNoteVal['SHIPPING_DATE'] = getDateForQuery();
    return {newLiNumber, newDelNoteVal};
}

/**
 * set new delivery note positions values
 *
 * @param delNotePosTable
 * @param posForDelNoteCrt
 * @param newLiNumber
 * @param states
 * @param partlyDelivery
 */
function setNewDelNotePositionsValues(delNotePosTable: any, posForDelNoteCrt: any, newLiNumber: string, states: {},
                                      partlyDelivery: boolean):
    { positionsItmNumsForMessage: string, insertDelNotePosArray: any[], partlyDelivery: boolean } {

    let insertDelNotePosArray: any[] = [];
    let insertDelNotePosObject: { 'ITM': DeliveryNotePositionDataInterface[], 'KMP': DeliveryNotePositionDataInterface[] } = {
        'ITM': [], 'KMP': []
    };
    let isSetItemAdded: boolean = false;
    // delivery notes positions fields names
    let splitDelNotePosFields: any = delNotePosTable[0].DETAIL_VIEW.split(',');
    let newDelNotePosValues: any | DeliveryNotePositionDataInterface;
    // QTY for new delivery note position
    let newDelNotePosOrderQTY: number;
    // Variable to manage update of the order position 'POSITION_STATUS'
    // If 'undefined' => status will be not changed
    // Otherwise, it can be changed from 1 to (2), or from 2 to (3)
    let updateOrderPositionStatus: undefined | number;
    let positionsItmNumsForMessage: string = "";
    for (let opItem in posForDelNoteCrt) {
        if (posForDelNoteCrt.hasOwnProperty(opItem)) {
            newDelNotePosValues = {};
            // - already existing in dlv pos
            newDelNotePosOrderQTY = posForDelNoteCrt[opItem]['ASSIGNED_QTY'];
            updateOrderPositionStatus = posForDelNoteCrt[opItem]['POSITION_STATUS'];
            // Fill new delivery note position with values from orders position:
            // like 'ORDER_NUMBER', 'CURRENCY'
            for (let sdpItem in splitDelNotePosFields) {
                if (splitDelNotePosFields.hasOwnProperty(sdpItem)) {
                    if (posForDelNoteCrt[opItem][splitDelNotePosFields[sdpItem]]) {
                        newDelNotePosValues[splitDelNotePosFields[sdpItem]] =
                            posForDelNoteCrt[opItem][splitDelNotePosFields[sdpItem]];
                    } else {
                        newDelNotePosValues[splitDelNotePosFields[sdpItem]] = undefined;
                    }
                }
            }
            // remove ID from insert query, because it will be generated by default
            if (delNotePosTable[0].DETAIL_VIEW.substring(0, 3) === 'ID,') {
                delNotePosTable[0].DETAIL_VIEW = delNotePosTable[0].DETAIL_VIEW.substring(3,
                    delNotePosTable[0].DETAIL_VIEW.length); // remove id
            }
            // remove ID from query
            delete newDelNotePosValues['ID'];
            newDelNotePosValues['DELIVERY_NOTES_NUMBER'] = newLiNumber;
            newDelNotePosValues['WEIGHT_PER'] = '0';
            newDelNotePosValues['DELIVERY_QTY'] = '0';
            newDelNotePosValues['ORDERS_POSITIONS_ID'] = posForDelNoteCrt[opItem].ID;
            newDelNotePosValues['CATEGORY_SOAS'] = posForDelNoteCrt[opItem].CATEGORY_SOAS;
            newDelNotePosValues['POSITION_STATUS'] = states['STATE_POS_LI_OPEN']; // '1';
            let currentSetAssignedQty: number = 0;
            if (posForDelNoteCrt[opItem]['CATEGORY_SOAS'] !== constants.CATEGORY_SOAS_KOMP) {
                // if order position state is partially delivered (2) or delivered (3)
                currentSetAssignedQty = (updateOrderPositionStatus === states['STATE_POS_PARTIALLY_ALLOCATED'] ||
                    updateOrderPositionStatus === states['STATE_POS_COMPLETELY_ALLOCATED']) ?
                    posForDelNoteCrt[opItem].ORDER_QTY : posForDelNoteCrt[opItem].ASSIGNED_QTY;
                newDelNotePosOrderQTY = currentSetAssignedQty;
                newDelNotePosValues['ORDER_QTY'] = newDelNotePosOrderQTY;
            } else {
                if (partlyDelivery) {
                    newDelNotePosValues['ORDER_QTY'] = newDelNotePosOrderQTY - currentSetAssignedQty;
                } else {
                    newDelNotePosValues['ORDER_QTY'] = newDelNotePosOrderQTY;
                }
            }
            if (newDelNotePosOrderQTY >= 0) {
                positionsItmNumsForMessage += posForDelNoteCrt[opItem].ITMNUM + " (" + newDelNotePosOrderQTY + "), ";
                // if many SET items in positions: at next SET item, push complete object (SET+KOMP) to array
                if ((posForDelNoteCrt[opItem].CATEGORY_SOAS === 'SET') && isSetItemAdded) {
                    insertDelNotePosArray.push(insertDelNotePosObject);
                    // reset object
                    insertDelNotePosObject = {'ITM': [], 'KMP': []};
                }
                // first push SET item
                if (!insertDelNotePosObject['ITM'].length) {
                    insertDelNotePosObject['ITM'].push(newDelNotePosValues);
                    isSetItemAdded = true;
                } else {
                    // then push KOMP items
                    insertDelNotePosObject['KMP'].push(newDelNotePosValues);
                }
            } else {
                console.log('Ignore position... ' + posForDelNoteCrt[opItem].ITMNUM +
                    ': newDeliveryNotePositionOrderQTY is ', newDelNotePosOrderQTY);
                throw new Error('newDelNotePosOrderQTY is undefined!');
            }
        }
    }
    // add last object
    insertDelNotePosArray.push(insertDelNotePosObject);

    return {positionsItmNumsForMessage, insertDelNotePosArray, partlyDelivery};
}

/**
 * Update delivery notes and set DELIVERY_QTY, POSITION_STATUS AND RELEASE FLAG
 *
 * @param loadBINVData WarehouseReservationCacheInterface[] - WAREHOUSE_RESERVATION_CACHE items
 */
export async function updateDeliveryNotesQtyAndStatus(loadBINVData: any) {
    if (loadBINVData && loadBINVData.length) {
        const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
        const ORDERS_STATES: [] = await loadStatesByType('AU');
        const DLV_STATES: [] = await loadStatesByType('LI');
        const DLV_POSITIONS_STATES: [] = await loadStatesByType('POS_LI');
        if ((ORDERS_STATES && ORDERS_STATES.length > 0) && (DLV_STATES && DLV_STATES.length > 0) &&
            (DLV_POSITIONS_STATES && DLV_POSITIONS_STATES.length > 0)) {
            // @ts-ignore
            const ORDERS_STATE_COMPLETED: number = ORDERS_STATES[3].STATES_ID; // constants.ORDER_STATES_COMPLETED; // 30;
            // @ts-ignore
            const POSITION_STATUS_PARTIALLY_DELIVERED: number = DLV_POSITIONS_STATES[1].STATES_ID; // 2;  // STATE_POS_LI_PARTIALLY_DELIVERED
            // @ts-ignore
            const POSITION_STATUS_DELIVERED: number = DLV_POSITIONS_STATES[2].STATES_ID; // 3;  // STATE_POS_LI_DELIVERED
            // @ts-ignore
            const DELIVERY_STATE_IN_DELIVERY: number = DLV_STATES[1].STATES_ID; // constants.DLV_STATES_IN_DELIVERY; // 50;
            const DELIVERY_RELEASE: number = 1;
            const CATEGORY_SOAS: string = constants.CATEGORY_SOAS_SET;
            // Eine Liste aufbauen mit allen SET udn KMP Einträgen zu DELIVERY_NOTES_NUMBER:
            //    50021LI014733: KMP:  0: 4251	Testartikel_20210301_Komponente_1	1
            //                   SET:  0: 4250	Testartikel_20210301	1
            let groupedBINVData: any [] = []; //{ 'ITM': [], 'KMP': [] } = {'ITM': [], 'KMP': []};
            for (let binvDataItem in loadBINVData) {
                if (loadBINVData.hasOwnProperty(binvDataItem)) {
                    if (!groupedBINVData[loadBINVData[binvDataItem].DELIVERY_NOTES_NUMBER]) {
                        groupedBINVData[loadBINVData[binvDataItem].DELIVERY_NOTES_NUMBER] = [];
                        groupedBINVData[loadBINVData[binvDataItem].DELIVERY_NOTES_NUMBER]['SET'] = [];
                        groupedBINVData[loadBINVData[binvDataItem].DELIVERY_NOTES_NUMBER]['KMP'] = [];
                    }
                    // add component item
                    groupedBINVData[loadBINVData[binvDataItem].DELIVERY_NOTES_NUMBER]['KMP'].push(loadBINVData[binvDataItem]);
                }
            }
            // add set items - because set items should be updated too
            for (let grpItem in groupedBINVData) {
                if (groupedBINVData.hasOwnProperty(grpItem)) {
                    let setQuery1: string = `SELECT * FROM ` + DB_TABLE_PREFIX + `DELIVERY_NOTES_POSITIONS 
                WHERE DELIVERY_NOTES_NUMBER = '` + grpItem + `' AND CATEGORY_SOAS = '` + CATEGORY_SOAS + `'`;
                    console.log("setQuery1: ", setQuery1);
                    let setData: any = await mssqlCall.mssqlCallEscaped([], setQuery1);
                    if (setData && setData.length > 0) {
                        for (let setItem in setData) {
                            if (setData.hasOwnProperty(setItem)) {
                                groupedBINVData[grpItem]['SET'].push(setData[setItem]);
                            }
                        }
                    }
                }
            }
            let foundWrongState: boolean = false;
            // delivery notes items  [ '50021LI014733': [...] ]
            for (let grpDlvItem in groupedBINVData) {
                // ITM and KMP items [ ITM: [ [Object] ], KMP: [ [Object], [Object] ] ]
                for (let grpKmpItem in groupedBINVData[grpDlvItem]['KMP']) {
                    if (groupedBINVData[grpDlvItem]['KMP'].hasOwnProperty(grpKmpItem)) {
                        await updateDlvQtyAndState('KMP',
                            groupedBINVData[grpDlvItem]['KMP'][grpKmpItem].DELIVERY_NOTES_POSITIONS_ID,
                            groupedBINVData[grpDlvItem]['KMP'][grpKmpItem].ORDERS_POSITIONS_ID,
                            POSITION_STATUS_DELIVERED);
                    }
                }
                for (let grpSetItem in groupedBINVData[grpDlvItem]['SET']) { // set item
                    if (groupedBINVData[grpDlvItem]['SET'].hasOwnProperty(grpSetItem)) {
                        await updateDlvQtyAndState('SET', groupedBINVData[grpDlvItem]['SET'][grpSetItem].ID,
                            groupedBINVData[grpDlvItem]['SET'][grpSetItem].ORDERS_POSITIONS_ID, POSITION_STATUS_DELIVERED);
                    }
                }
                if (grpDlvItem && groupedBINVData[grpDlvItem]) {
                    foundWrongState = await checkDLVPositionsState(grpDlvItem,
                        [POSITION_STATUS_PARTIALLY_DELIVERED, POSITION_STATUS_DELIVERED]);
                    if (!foundWrongState) {
                        // Set DELIVERY_NOTES.RELEASE to '1'
                        let updateReleaseQuery: string = `UPDATE ` + DB_TABLE_PREFIX + `DELIVERY_NOTES SET 
                    DELIVERY_NOTES_STATE = '` + DELIVERY_STATE_IN_DELIVERY + `', RELEASE = '` + DELIVERY_RELEASE + `' 
                    WHERE DELIVERY_NOTES_NUMBER = '` + grpDlvItem + `'`;
                        console.log("updateReleaseQuery: ", updateReleaseQuery);
                        await mssqlCall.mssqlCallEscaped([], updateReleaseQuery);
                        // Set ORDERS.ORDERS_STATES to '30', if all positions are completed
                        if (await checkOrdersPositionsState(
                            groupedBINVData[grpDlvItem]['SET'][0].ORDERS_NUMBER, ORDERS_STATE_COMPLETED)) {
                            let updateOrdersQuery: string = `UPDATE ` + DB_TABLE_PREFIX + `ORDERS SET 
                        ORDERS_STATE = '` + ORDERS_STATE_COMPLETED + `' 
                        WHERE ORDERS_NUMBER = '` + groupedBINVData[grpDlvItem]['SET'][0].ORDERS_NUMBER + `'`;
                            console.log("updateOrdersQuery: ", updateOrdersQuery);
                            await mssqlCall.mssqlCallEscaped([], updateOrdersQuery);
                        }
                    } else {
                        console.log('Delivery note ' + groupedBINVData[grpDlvItem] + ' still unreleased, ' +
                            'because there are positions with a state != ' + POSITION_STATUS_DELIVERED + '.');
                    }
                } else {
                    console.log('ERROR: DELIVERY_NOTES_NUMBER was not found!');
                }
            }
        } else {
            console.log('States not loaded.');
        }
    }
}

/**
 * update delivery notes positions. copy ORDER_QTY to DELIVERY_QTY, SET STATUS to 3 = STATE_POS_LI_DELIVERED
 *
 * @param type
 * @param deliveryNotesPositionsId
 * @param ordersPositionsId
 * @param positionStatusDelivered
 */
async function updateDlvQtyAndState(type: string, deliveryNotesPositionsId: string, ordersPositionsId: string,
                                    positionStatusDelivered: number) {
    const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    let inputParamsArrayDlv: { name: string, type: any, value: any }[] = [
        {name: 'ID', type: sql.Int, value: deliveryNotesPositionsId},
        {name: 'POSITION_STATUS', type: sql.Int, value: positionStatusDelivered}];
    let updateDlvPosQuery: string = `UPDATE ` + DB_TABLE_PREFIX + `DELIVERY_NOTES_POSITIONS SET 
    DELIVERY_QTY = ORDER_QTY, POSITION_STATUS = @POSITION_STATUS WHERE ID = @ID`;
    console.log("updateDlvPosQuery: ", updateDlvPosQuery);
    await mssqlCall.mssqlCallEscaped(inputParamsArrayDlv, updateDlvPosQuery);
    let inputParamsArrayOrd: { name: string, type: any, value: any }[] = [
        {name: 'ID', type: sql.Int, value: ordersPositionsId}];
    let updateOrdPosQuery: string = `UPDATE ` + DB_TABLE_PREFIX + `ORDERS_POSITIONS SET 
    DELIVERED_QTY = ` + ((type === 'KMP') ? `ASSIGNED_QTY` : `ORDER_QTY`) + ` WHERE ID = @ID`;
    console.log("updateOrdQuery: ", updateOrdPosQuery);
    await mssqlCall.mssqlCallEscaped(inputParamsArrayOrd, updateOrdPosQuery);
    return {success: true};
}

/**
 * check if all delivery notes positions have STATE 3 = STATE_POS_LI_DELIVERED
 * check if some delivery notes positions have STATE 2 = STATE_POS_LI_PARTIALLY_DELIVERED or
 * STATE 3 = STATE_POS_LI_DELIVERED
 *
 * @param deliveryNotesId
 * @param positionStates - [[1] PARTLY_DELIVERED, [2] DELIVERED]
 */
export async function checkDLVPositionsState(deliveryNotesId: string, positionStates: number[]): Promise<boolean> {
    let foundWrongState: boolean = false;
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'DELIVERY_NOTES_NUMBER', type: sql.VarChar, value: deliveryNotesId}];
    let selectQuery: string = `SELECT AA.ID, AA.POSITION_STATUS, AA.DELIVERY_QTY, AA.ORDER_QTY FROM ` +
        constants.DB_TABLE_PREFIX + `DELIVERY_NOTES_POSITIONS AA 
    WHERE AA.DELIVERY_NOTES_NUMBER = @DELIVERY_NOTES_NUMBER`;
    console.log("checkDLVPositionsState-selectQuery: ", selectQuery);
    let delNoteData: DeliveryNotePositionDataInterface[] = await mssqlCall.mssqlCallEscaped(inputParamsArray, selectQuery);
    for (let delNoteItem in delNoteData) {
        if (delNoteData.hasOwnProperty(delNoteItem)) {
            for (let stateItem in positionStates) {

                // if one of positions has state 2 or 3, return false

                // if one of positions does not have state 2 or 3, return false
                if (!positionStates.includes(delNoteData[delNoteItem].POSITION_STATUS)) {
                    foundWrongState = true;
                    break;
                }
                // if one of positions does not have correct delivery qty, return false
                if ((delNoteData[delNoteItem].DELIVERY_QTY > 0) &&
                    (delNoteData[delNoteItem].DELIVERY_QTY !== delNoteData[delNoteItem].ORDER_QTY)) {
                    foundWrongState = true;
                    break;
                }
            }
        }
    }
    return foundWrongState;
}

/**
 * reset DELIVERY_NOTES_POSITIONS_ID at WAREHOUSE_RESERVATION_CACHE
 * @param secondaryValue
 * @param dataDNPSItem
 * @param warehouseControl
 */
async function resetWRCDelNotePosID(secondaryValue: string, dataDNPSItem: any, warehouseControl: WarehouseControl) {
    let warehouseReservationCacheItem: WarehouseReservationCacheInterface = {
        warehouseRCId: 0,
        warehouseRCDocumentNumber: secondaryValue,
        warehouseRCItemNumber: dataDNPSItem.ITMNUM,
        warehouseRCAssignedQuantity: 0,
        warehouseRCBatchNumber: '',
        warehouseRCStorageLocation: '',
        warehouseRCWarehouse: '',
        warehouseRCPositionId: dataDNPSItem.POSITION_ID,
        warehouseRCAssignmentDate: '',
        warehouseRCWarehousingId: 0, // dataDNPSItem.WAREHOUSING_ID,
        warehouseRCOrdersPositionsId: dataDNPSItem.ORDERS_POSITIONS_ID,
        warehouseRCDeliveryNotesPositionsId: dataDNPSItem.ID,
    };
    // delete WAREHOUSE_RESERVATION_CACHE items for current order position
    // await warehouseControl.dereserveStock(secondaryValue, warehouseReservationCacheItem);
    await warehouseControl.resetWarehouseReservationCache(secondaryValue, warehouseReservationCacheItem);
}

/**
 * delete delivery note: delete delivery note positions, then delivery note and update order state
 *
 * @param tableName
 * @param primaryKey
 * @param primaryValue
 * @param secondaryKey
 * @param secondaryValue
 */
export async function mssql_delete_delivery_note(tableName: string, primaryKey: string, primaryValue: string,
                                            secondaryKey: string, secondaryValue: string) {
    let warehouseControl: WarehouseControl = new WarehouseControl();
    const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'PRIMARY_VALUE', type: sql.VarChar, value: primaryValue},
        {name: 'SECONDARY_VALUE', type: sql.VarChar, value: secondaryValue},
        {name: 'ORDER_STATE_OPEN', type: sql.Int, value: constants.ORDER_STATES_OPEN}];
    const PRIMARY_KEY_VALUE: string = getItemForQuery([primaryKey], primaryColumnTypes);
    const SECONDARY_KEY_VALUE: string = getItemForQuery([secondaryKey], primaryColumnTypes);
    const TABLE_NAME_DN: string = `DELIVERY_NOTES`;
    const TABLE_NAME_DN_POS: string = `DELIVERY_NOTES_POSITIONS`;
    const TABLE_NAME_ORD: string = `ORDERS`;
    // const TABLE_NAME_ORD_POS: string = `ORDERS_POSITIONS`;
    // Check delivery note status and release flag
    let dnQuery: string = `SELECT * FROM ` + DB_TABLE_PREFIX + TABLE_NAME_DN + ` 
    WHERE ` + PRIMARY_KEY_VALUE + ` = @PRIMARY_VALUE`;
    let deliveryNote: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, dnQuery);
    if (deliveryNote && deliveryNote[0]) {
        if (deliveryNote[0].RELEASE) {
            return {error: "DELIVERY_NOTE_IS_RELEASED"};
        }
        if (parseInt(deliveryNote[0].DELIVERY_NOTES_STATE) !== constants.DLV_STATES_DELIVERED) {
            // Get all delivery notes positions - for updating order positions state later
            let selPosQuery: string = `SELECT * FROM ` + DB_TABLE_PREFIX + TABLE_NAME_DN_POS + ` 
                    WHERE ` + PRIMARY_KEY_VALUE + ` = @PRIMARY_VALUE ORDER BY POSITION_ID ASC`;
            console.log("selectPositionsQuery: ", selPosQuery);
            let deliveryNotePositions: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, selPosQuery);
            console.log('deliveryNotePositions: ', deliveryNotePositions);
            if (deliveryNotePositions && deliveryNotePositions[0]) {
                // Delete delivery notes positions
                let delPosQuery: string = `DELETE FROM ` + DB_TABLE_PREFIX + TABLE_NAME_DN_POS + ` 
                        WHERE ` + PRIMARY_KEY_VALUE + ` = @PRIMARY_VALUE`;
                await mssqlCall.mssqlCallEscaped(inputParamsArray, delPosQuery);
                let selPosCountQuery: string = `SELECT COUNT (*) AS POS_NUM 
                        FROM ` + DB_TABLE_PREFIX + TABLE_NAME_DN_POS + ` WHERE ` + PRIMARY_KEY_VALUE + ` = @PRIMARY_VALUE`;
                let data2: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, selPosCountQuery);
                if (data2 && data2[0] && data2[0].POS_NUM === 0) {
                    let dnpTableTemplate: any = await mssql_call_get_table_name_and_detail_view(constants.REFTABLE_DELIVERY_NOTES_POSITIONS);
                    if (!dnpTableTemplate) {
                        console.log("table not found... ", constants.REFTABLE_DELIVERY_NOTES_POSITIONS);
                        return {error: "DELIVERY_NOTE_POSITIONS_ERROR"};
                    }
                    const DNP_TABLE_DETAIL_VIEW: string[] = dnpTableTemplate[0]['DETAIL_VIEW'].split(',');
                    // let forInputParamsArray: { name: string, type: any, value: any }[] = [];
                    // Reset order positions to state 1
                    let currDelNotesPosSetItmnum: string = "";
                    let currDelNotesPosSetID: undefined | number = undefined;
                    for (let i = 0; i < deliveryNotePositions.length; i++) {
                        // forInputParamsArray = [];
                        if (DNP_TABLE_DETAIL_VIEW.includes('ORDERS_POSITIONS_ID')) {
                            /*
                            // dataOPS for partly delivery: removed commented out code
                            forInputParamsArray.push({name: 'SECONDARY_VALUE', type: sql.VarChar,
                                value: secondaryValue});
                            forInputParamsArray.push({name: 'ORDERS_POSITIONS_ID', type: sql.VarChar,
                                value: deliveryNotePositions[i].ORDERS_POSITIONS_ID});
                            let opsQery: string = `SELECT ASSIGNED_QTY, POSITION_STATUS
                            FROM ` + DB_TABLE_PREFIX + TABLE_NAME_ORD_POS + `
                            WHERE ` + SECONDARY_KEY_VALUE + ` = @SECONDARY_VALUE AND ID = @ORDERS_POSITIONS_ID`;
                            console.log("opsQery: ", opsQery);
                            // dataOPS for partly delivery: removed commented out code
                            let dataOPS: any = await mssqlCall.mssqlCallEscaped(forInputParamsArray, opsQery);
                            */
                            // update only 'SET' items
                            if (!deliveryNotePositions[i].PARENT_LINE_ID &&
                                deliveryNotePositions[i].CATEGORY_SOAS !== constants.CATEGORY_SOAS_KOMP) {
                                currDelNotesPosSetID = deliveryNotePositions[i].ID;
                                currDelNotesPosSetItmnum = deliveryNotePositions[i].ITMNUM;
                                console.log('A: ', currDelNotesPosSetID);
                            } else {
                                console.log('B: ', currDelNotesPosSetID);
                                // rollback WAREHOUSING RESERVED qty's
                                if (currDelNotesPosSetID === deliveryNotePositions[i].PARENT_LINE_ID) {
                                    await resetWRCDelNotePosID(secondaryValue, deliveryNotePositions[i], warehouseControl);
                                }
                            }
                        } else {
                            console.warn('KEY not found in db: ', 'ORDERS_POSITIONS_ID');
                        }
                    }
                    // Delete delivery note
                    let deleteDNQuery: string = `DELETE FROM ` + DB_TABLE_PREFIX + TABLE_NAME_DN + ` 
                            WHERE ` + PRIMARY_KEY_VALUE + ` = @PRIMARY_VALUE`;
                    console.log('deleteDNQuery: ', deleteDNQuery);
                    console.log('inputParamsArray: ', inputParamsArray);
                    await mssqlCall.mssqlCallEscaped(inputParamsArray, deleteDNQuery);
                    let query4: string = `SELECT COUNT (*) AS DLN_NUM FROM ` + DB_TABLE_PREFIX + TABLE_NAME_DN + ` 
                            WHERE ` + PRIMARY_KEY_VALUE + ` = @PRIMARY_VALUE`;
                    let data4: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, query4);
                    console.log('data4: ', data4);
                    if (data4 && data4[0] && data4[0].DLN_NUM === 0) {
                        // Check if no other delivery notes available for current order
                        let query5: string = `SELECT COUNT (*) AS DLN_NUM FROM ` + DB_TABLE_PREFIX + TABLE_NAME_DN + ` 
                                WHERE ` + SECONDARY_KEY_VALUE + ` = @SECONDARY_VALUE`;
                        let data5: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, query5);
                        console.log('data5: ', data5);
                        if (data5 && data5[0] && data5[0].DLN_NUM === 0) {
                            // Reset order state to 10
                            let query6: string = `UPDATE ` + DB_TABLE_PREFIX + TABLE_NAME_ORD + ` 
                                    SET ORDERS_STATE = @ORDER_STATE_OPEN 
                                    WHERE ` + SECONDARY_KEY_VALUE + ` = @SECONDARY_VALUE`;
                            await mssqlCall.mssqlCallEscaped(inputParamsArray, query6);
                        } else {
                            // console.log("ORDER STILL HAVE DELIVERY NOTES! ORDER STATE NOT UPDATED!");
                        }
                        return {success: "OK"};
                    } else {
                        console.log("DELIVERY_NOTE NOT DELETED!");
                        return {error: "ERROR_DURING_DELETING"};
                    }
                } else {
                    console.log("DELIVERY_NOTES_POSITIONS NOT DELETED!");
                    return {error: "ERROR_DURING_DELETING"};
                }
            } else {
                console.log("DONT FOUND ANY DELIVERY_NOTES_POSITIONS!");
                return {error: "NO_POSITIONS_FOUND"};
            }
        } else {
            return {error: "DELIVERY_NOTE_HAS_STATE_DELIVERED"};
        }
    } else {
        return {error: "NOT_FOUND_ERROR"};
    }
}

/**
 * get positions allowed for delivery note creation
 * (check for given orders positions, if some are already existing in delivery note positions)
 *
 * @param orderPositionsData
 * @param onlyCheck
 */
export async function mssql_get_orders_positions_for_delivery_note_creation(orderPositionsData: object | any,
                                                                            onlyCheck: boolean) {
    let errors = {
        0: 'NO_DELIVERY_NOTES_POSITIONS_FOUND',
        1: 'UNKNOWN_ERROR_OCCURRED',
        2: 'STATES_ARE_EMPTY',
        3: 'NO_POSITION_WITH_ASSIGNED_QTY_SET',
        4: 'NO_DELIVERY_NOTE_FOUND',
    };
    let ordersPositions: OrderPositionDataInterface[] | any = orderPositionsData['ordersPositions'];
    // console.log('### ordersPositions: ', ordersPositions);
    let calcAssignedQty: boolean = orderPositionsData['calcAssignedQty'];
    // ORDERS_POSITIONS_STATES[i].STATES_ID: i = 0 - NOT ALLOC; 1 - OPEN; 2 - PARTLY ALLOC; 3 - COMPLETELY ALLOC;
    const ORDERS_POSITIONS_STATES: [] = await loadStatesByType('POS');
    if (ORDERS_POSITIONS_STATES && ORDERS_POSITIONS_STATES.length > 0) {
        // get all delivery notes positions for this order number
        const PRIMARY_KEY: string = 'ORDERS_NUMBER';
        const PRIMARY_VALUE: string = orderPositionsData['ordersNumber'];
        // check if orders delivery note(s) is/are partly delivery
        let partlyDeliveryResult: { success: boolean, partlyDelivery: undefined | boolean } =
            await checkPartlyDelivery(PRIMARY_KEY, PRIMARY_VALUE);
        let partlyDeliveryDetected: boolean = (partlyDeliveryResult.success) ? partlyDeliveryResult.partlyDelivery : false;
        // console.log('partlyDeliveryDetected: ', partlyDeliveryDetected);
        let setAlreadyAvailableInDP: { available: boolean, setOpId: undefined | number } = {
            available: false, setOpId: undefined
        };
        let dnPositionsDbData: any = await mssql_select_Table_by_Number('deliveryNotePositions',
            ViewQueryTypes.DETAIL_TABLE, PRIMARY_KEY, PRIMARY_VALUE, undefined, undefined,
            undefined, undefined, 0, PRIMARY_KEY, "ASC");
        if (!dnPositionsDbData) {
            return {success: false, message: errors[0], data: undefined};
        }
        let dnPositions = dnPositionsDbData['data'][1];
        // go through order positions and search for positions that are suitable for
        // generation of delivery note
        let positionsForDeliveryNoteCreation: OrderPositionDataInterface[] = [];
        for (let opItem in ordersPositions) {
            if (ordersPositions.hasOwnProperty(opItem)) {
                // only if qty should be calculated
                if (calcAssignedQty) {
                    ordersPositions[opItem].ASSIGNED_QTY = calcPositionsOrderQty(ordersPositions[opItem], dnPositions);
                }
                // check every dn item separately
                if (!checkPositionIsInDnp(dnPositions, ordersPositions[opItem])) {
                    // @ts-ignore // QTY and STATUS not changeable (external workflow)
                    if (((ordersPositions[opItem].POSITION_STATUS === ORDERS_POSITIONS_STATES[3].STATES_ID) || // @ts-ignore
                            (ordersPositions[opItem].POSITION_STATUS === ORDERS_POSITIONS_STATES[2].STATES_ID)) &&
                        // ((ordersPositions[opItem].POSITION_STATUS === ORDERS_POSITIONS_STATES[1].STATES_ID) || // @ts-ignore
                        // (ordersPositions[opItem].POSITION_STATUS === ORDERS_POSITIONS_STATES[2].STATES_ID)) &&
                        (ordersPositions[opItem].ASSIGNED_QTY <= ordersPositions[opItem].ORDER_QTY)) {
                        // console.log("OK for this item: ", ordersPositions[opItem].ID);
                        // OK, for this position a delivery note can be generated => partly
                        positionsForDeliveryNoteCreation.push(ordersPositions[opItem]); // @ts-ignore
                        if (ordersPositions[opItem].POSITION_STATUS === ORDERS_POSITIONS_STATES[2].STATES_ID) {
                            partlyDeliveryDetected = true;
                        } // @ts-ignore
                    } else if ((ordersPositions[opItem].POSITION_STATUS === ORDERS_POSITIONS_STATES[0].STATES_ID) &&
                        (ordersPositions[opItem].CATEGORY_SOAS === constants.CATEGORY_SOAS_KOMP)) {
                        // check if current components set is already in delivery notes, if not add component
                        if (!(setAlreadyAvailableInDP && setAlreadyAvailableInDP['available'] &&
                            setAlreadyAvailableInDP['setOpId'] === ordersPositions[opItem].PARENT_LINE_ID)) {
                            // OK, for this position a delivery note can be generated => partly
                            positionsForDeliveryNoteCreation.push(ordersPositions[opItem]);
                        } else {
                            console.log('Ignore KOMP of SET that is already in delivery notes: ',
                                ordersPositions[opItem].ITMNUM + ' ID: ' + ordersPositions[opItem].ID);
                        }
                    } else {
                        // WRONG, for this position can't be generated delivery note
                        console.log('WRONG, for this position can\'t be generated delivery note: ',
                            ordersPositions[opItem].ITMNUM + ' ID: ' + ordersPositions[opItem].ID);
                    }
                } else {
                    console.log("Item ignored. Is already complete allocated. ",
                        ordersPositions[opItem].ITMNUM + ' ID: ' + ordersPositions[opItem].ID);
                }
                // } else {
                //     console.log("Item ignored. Set is already complete allocated. ",
                //         ordersPositions[opItem].ITMNUM + ' ID: ' + ordersPositions[opItem].ID);
                // }
            }
        }
        let success: boolean = false;
        if (Object.keys(positionsForDeliveryNoteCreation).length > 0) {
            success = true;
            if (!partlyDeliveryDetected &&
                ordersPositions.length > Object.keys(positionsForDeliveryNoteCreation).length) {
                partlyDeliveryDetected = true;
            }
        }
        // if partly delivery note, check qty of the SET items and reduce it by really allocated qty,
        // to be able to write into delivery notes only really allocated amount of position qty´s
        if (partlyDeliveryDetected) {
            let newPositionsForDeliveryNoteCreation = await calc_order_position_set_assigned_qty(PRIMARY_VALUE,
                positionsForDeliveryNoteCreation, ORDERS_POSITIONS_STATES);
            // console.log('newPositionsForDeliveryNoteCreation: ', newPositionsForDeliveryNoteCreation);
            if (newPositionsForDeliveryNoteCreation && newPositionsForDeliveryNoteCreation.length > 0) {
                positionsForDeliveryNoteCreation = JSON.parse(JSON.stringify(newPositionsForDeliveryNoteCreation));
            } else {
                // ORDER_OR_ASSIGNED_QTY_IS_WRONG
                return {success: false, message: errors[3], data: undefined, partlyDeliveryDetected: false};
            }
        }

        console.log('partlyDeliveryDetected: ', partlyDeliveryDetected);
        // throw new Error('stopp');

        return {
            success: success, message: '',
            data: positionsForDeliveryNoteCreation, partlyDeliveryDetected: partlyDeliveryDetected
        };
    } else {
        return {success: false, message: errors[2], data: undefined, partlyDeliveryDetected: false};
    }
}

/**
 * check if delivery note is a partly delivery
 *
 * @param primaryKey 'OR
 * @param primaryValue
 */
export async function checkPartlyDelivery(primaryKey: string, primaryValue: string):
    Promise<{ success: boolean, partlyDelivery: undefined | boolean }> {
    // load delivery note data to check if it is a partly delivery
    let dnDbData: any = await mssql_select_Table_by_Number('deliveryNote', ViewQueryTypes.DETAIL_TABLE,
        primaryKey, primaryValue, undefined, undefined,
        undefined, undefined, 0, primaryKey, "ASC");
    if (!dnDbData) {
        return {success: false, partlyDelivery: undefined};
    }
    let deliveryNotes = dnDbData['data'][1];
    for (let item in deliveryNotes) {
        if (deliveryNotes[item].PARTLY_DELIVERY) {
            return {success: true, partlyDelivery: true};
        }
    }
    return {success: true, partlyDelivery: false};
}
