/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 11.11.2021 */
import * as sql from 'mssql';
import * as mssqlCall from '../../mssql_call';
import {constants} from '../../constants/constants';
import {DeliveryNote} from '../../classes/DeliveryNote';
import {Invoice} from '../../classes/Invoice';
import {DeliveryNotePosition} from '../../classes/DeliveryNotePosition';
import {
    getNewListNumber,
    execMSSQLQueryWithPromise,
    mssql_call_get_table_name_and_detail_view,
    addValuesToQuery
} from '../../mssql_logic';
import {calculateOrderPrices, insertPositions} from '../order/Order';
import {mssql_select_Table_by_Number, primaryColumnTypes} from '../table/Table';
import {getDateForQuery} from '../date/Date';
import {getItemForQuery} from '../../helpers';
import {ViewQueryTypes} from '../../constants/enumerations';
import {InvoicePositions} from "../../classes/InvoicePositions";
import {InvoicePositionsDataInterface} from "../../classes/interfaces/InvoicePositionsInterface";
import {InvoiceInterface} from "../../classes/interfaces/InvoiceInterface";
import {DeliveryNotePositionDataInterface} from "../../classes/interfaces/DeliveryNotePositionInterface";
import {OrderPosition} from "../../classes/OrderPosition";
import {OrderPositionDataInterface} from "../../classes/interfaces/OrderPositionInterface";
import {checkDLVPositionsState} from "../delivery-note/DeliveryNote";


/**
 * create invoice
 *
 * @param thisID
 * @param primaryKey - 'DELIVERY_NOTE_NUMBER'
 * @param primaryValue
 * @param secondaryKey - 'ORDERS_NUMBER'
 * @param secondaryValue
 * @param userID
 * @param statesObj
 * @param partlyDelivery
 */
export async function mssql_create_invoice_manually(thisID: string, primaryKey: string, primaryValue: string,
                                                    secondaryKey: string, secondaryValue: string, userID: string,
                                                    statesObj: any, partlyDelivery: boolean):
    Promise<{ success: boolean, errorCode: string, newInvoice: string, positions: string }> {
    console.log('mssql_create_invoice_manually...........');
    // 1. get delivery note data (dnData: any|DeliveryNote):
    // 2. Check delivery note release === false; currency, customerNumber
    // 3. get orders positions data (orderPositionsData: any|OrderPosition): all entries
    // 4. check/extract, if one/all positions are suitable for creating a new delivery note
    // 5. create new delivery note, if needed
    // 6. return code for showing message for user, if delivery note was created or some errors occurred.
    let errors = {
        0: 'DELIVERY_NOTE_IS_RELEASED',
        1: 'NO_POSITION_FOR_INVOICE_CREATION',
        2: 'INVOICE_WAS_CREATED',
        3: 'NO_DELIVERY_NOTE_FOUND',
        4: 'NO_DELIVERY_NOTE_POSITION_FOUND',
        5: 'ERROR_OCCURRED',
        6: 'NO_ORDER_FOUND',
        7: 'NO_ORDER_POSITIONS_FOUND',
        8: 'PARTLY_INVOICE_WAS_CREATED',
        9: 'POSITIONS_ORDER_IS_WRONG',
        10: 'PRICE_IS_ZERO',
        11: 'ORDER_QTY_IS_LOWER_THAN_DELIVERY_QTY',
        12: 'POSITION_STATUS_OR_DELIVERY_QTY_IS_WRONG',
        13: 'STATES_ARE_NOT_SET',
        14: 'PARTLY_INVOICE_DETECTED'
    }
    let states: {} = {};
    for (let i = 0; i < statesObj.length; i++) {
        states[statesObj[i]['STATES_NAME']] = statesObj[i]['STATES_ID'];
    }
    if (!states || Object.keys(states).length === 0) {
        return {success: false, errorCode: errors[13], newInvoice: undefined, positions: undefined};
    }
    // Queries to insert/update
    let insertDeliveryNotesQueries: any = [];
    let updateOrderStatusQueries: any = [];
    const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    const TABLE_NAME_VALUE: string = DB_TABLE_PREFIX + 'DELIVERY_NOTES';
    // 1. get orders data (orderData: any|Order): release === false; currency, customerNumber
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'PRIMARY_VALUE', type: sql.VarChar, value: primaryValue}];
    const primaryKeyValue: string = getItemForQuery([primaryKey], primaryColumnTypes);
    let query: string = `SELECT * FROM ` + TABLE_NAME_VALUE + ` WHERE ` + primaryKeyValue + ` = @PRIMARY_VALUE`;
    let dnData: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
    if (!dnData || !dnData.length) {
        return {success: false, errorCode: errors[3], newInvoice: undefined, positions: undefined};
    }
    // 2. Check delivery note release === true; currency, customerNumber
    if (!dnData[0]['RELEASE']) {
        return {success: false, errorCode: errors[0], newInvoice: undefined, positions: undefined};
    }
    // check if delivery notes positions have allowed state and correct delivered qty
    let positionStates: number[] = [states['STATE_POS_LI_PARTIALLY_DELIVERED'], states['STATE_POS_LI_DELIVERED']];
    let foundWrongState =  await checkDLVPositionsState(primaryValue, positionStates);
    if (foundWrongState) {
        return {success: false, errorCode: errors[12], newInvoice: undefined, positions: undefined};
    }
    // 3. get delivery note positions data (dnPositionsDbData: any|DeliveryNotePosition): all entries
    let dnPositionsDbData: any =
        await mssql_select_Table_by_Number('deliveryNotePositions', ViewQueryTypes.DETAIL_TABLE,
            primaryKey, primaryValue,
            undefined, undefined, undefined, undefined,
            0, primaryKey, 'ASC');
    if (!dnPositionsDbData) {
        return {success: false, errorCode: errors[4], newInvoice: undefined, positions: undefined};
    }
    let dnPositionsData = dnPositionsDbData['data'][1];
    if (!dnPositionsData) {
        return {success: false, errorCode: errors[4], newInvoice: undefined, positions: undefined};
    }
    let invPositionsDbData: any =
        await mssql_select_Table_by_Number('invoicePositions', ViewQueryTypes.DETAIL_TABLE,
            primaryKey, primaryValue, undefined, undefined, undefined,
            undefined, 0, primaryKey, 'ASC');
    if (!invPositionsDbData) {
        return {success: false, errorCode: errors[4], newInvoice: undefined, positions: undefined};
    }
    let invPositions = invPositionsDbData['data'][1];
    // console.log('invPositions: ', invPositions);
    // get order data for getting payment method
    let orderDbData: any =
        await mssql_select_Table_by_Number('orders', ViewQueryTypes.DETAIL_TABLE,
            secondaryKey, secondaryValue,
            undefined, undefined, undefined,
            undefined, 0, primaryKey, 'ASC');
    if (!orderDbData) {
        return {success: false, errorCode: errors[6], newInvoice: undefined, positions: undefined};
    }
    let orderData = orderDbData['data'][1];
    if (orderData) {
        // get orders positions data (orderPositionsData: any|OrderPosition): all entries
        let orderPositionsDbData: any =
            await mssql_select_Table_by_Number('orderPosition', ViewQueryTypes.DETAIL_TABLE,
                secondaryKey, secondaryValue, undefined, undefined,
                undefined, undefined, 0, primaryKey, 'ASC');
        if (!orderPositionsDbData) {
            return {success: false, errorCode: errors[7], newInvoice: undefined, positions: undefined};
        }
        let orderPositionsData = orderPositionsDbData['data'][1];
        if (orderPositionsData) {
            // check if order positions order is right: first element is always 'SET'
            if (orderPositionsData[0] && orderPositionsData[0]['PARENT_LINE_ID'] === null) {
                // console.log('>>>orderPositionsData: ', orderPositionsData);
                // go through delivery note positions and search for positions that are
                // suitable for generation of invoice
                let positionsForInvoiceCreation: any | DeliveryNote[] = [];
                for (let dpItem in dnPositionsData) {
                    if (dnPositionsData.hasOwnProperty(dpItem)) {
                        if ((!invPositions || Object.keys(invPositions).length === 0) ||
                            (!checkPositionIsInDnp(invPositions, dnPositionsData[dpItem]))) {
                            // QTY not changeable (external workflow) but POSITION_STATUS will be updated
                            if (dnPositionsData[dpItem].DELIVERY_QTY > 0 &&
                                dnPositionsData[dpItem].DELIVERY_QTY <= dnPositionsData[dpItem].ORDER_QTY) {
                                // OK, for this position an invoice position can be generated
                                positionsForInvoiceCreation.push(dnPositionsData[dpItem]);
                            }
                            // else if ((dnPositionsData[dpItem].DELIVERY_QTY === 0) &&
                            //     (dnPositionsData[dpItem].CATEGORY_SOAS === constants.CATEGORY_SOAS_KOMP)) {
                                // OK, for this position an invoice position can be generated
                                // positionsForInvoiceCreation.push(dnPositionsData[dpItem]);
                            // } else {
                                // WRONG, for this position can't be generated delivery note: ORDER_QTY < DELIVERY_QTY
                                // return {success: false, errorCode: errors[11], newInvoice: undefined, positions: undefined};
                            // }
                        }
                    }
                }
                // console.log('positionsForInvoiceCreation: ', positionsForInvoiceCreation);
                // check if collected positions have set delivery qty
                for (let pInvItem in positionsForInvoiceCreation) {
                    if (positionsForInvoiceCreation[pInvItem].DELIVERY_QTY === 0) {
                        // WRONG, for this position can't be generated delivery note: ORDER_QTY < DELIVERY_QTY
                        return {success: false, errorCode: errors[11], newInvoice: undefined, positions: undefined};
                    }
                }

                // throw new Error('stopp');

                return await createInvoice(positionsForInvoiceCreation, dnData, dnPositionsDbData, states,
                    thisID, userID, orderData, insertDeliveryNotesQueries, orderPositionsData,
                    updateOrderStatusQueries, partlyDelivery, errors);
            } else {
                return {success: false, errorCode: errors[9], newInvoice: undefined, positions: undefined};
            }
        } else {
            return {success: false, errorCode: errors[7], newInvoice: undefined, positions: undefined};
        }
    } else {
        return {success: false, errorCode: errors[6], newInvoice: undefined, positions: undefined};
    }
}

/**
 * Create invoice - IMPORTANT is the order of positions (positionsForInvoiceCreation): first 'SET', then 'KOMP'
 *
 * @param positionsForInvoiceCreation
 * @param dnData
 * @param dnPositionsDbData
 * @param states
 * @param thisID
 * @param userID
 * @param orderData
 * @param insertInvoiceQueries
 * @param orderPositionsData
 * @param updateOrderStatusQueries
 * @param partlyInvoice
 * @param errors
 */
async function createInvoice(positionsForInvoiceCreation: any, dnData: any, dnPositionsDbData: any, states: {},
                             thisID: string, userID: string, orderData: any, insertInvoiceQueries: any,
                             orderPositionsData: any, updateOrderStatusQueries: any, partlyInvoice: boolean,
                             errors: {
                                 '0': string; '1': string; '2': string; '3': string; '4': string; '5': string;
                                 '6': string; '7': string; '8': string; '9': string; '10': string
                             }): Promise<{ success: boolean, errorCode: string, newInvoice: string, positions: string }> {
    let insertInvoicesPositionsQueries: any = [];
    const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    const TABLE_NAME_VALUE: string = 'INVOICES';
    const TABLE_NAME_POS_VALUE: string = 'INVOICES_POSITIONS';
    let inputParamsArray: { name: string, type: any, value: any }[] = [];
    if (Object.keys(positionsForInvoiceCreation).length > 0) {
        if (!dnData) { // orderData is empty...
            return {success: false, errorCode: errors[5], newInvoice: undefined, positions: undefined};
        }
        if (!dnPositionsDbData) { // orderPositionsData is empty...
            return {success: false, errorCode: errors[5], newInvoice: undefined, positions: undefined};
        }
        let invoiceState: string = states['STATE_RG_OPEN'];
        // let partlyInvoice: boolean = false;
        let invoiceTable: any = await mssql_call_get_table_name_and_detail_view(constants.REFTABLE_INVOICES);
        let invoicePositionsTable: any =
            await mssql_call_get_table_name_and_detail_view(constants.REFTABLE_INVOICES_POSITIONS);
        let splitInvoiceFields: string[] = invoiceTable[0].DETAIL_VIEW.split(',');
        const __ret: { newInvoiceValues: any | InvoiceInterface, newRGNumber: undefined | string} =
            await setNewInvoiceValues(splitInvoiceFields, dnData, thisID, invoiceState, userID, orderData, partlyInvoice);
        let newInvoiceValues = __ret.newInvoiceValues;
        let newRGNumber = __ret.newRGNumber;
        let queryInsert = `INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE +
            ` (` + invoiceTable[0].DETAIL_VIEW + `) VALUES `;
        let queryValues: { inputParamsArray: any, query: string, iPNKeyCntr: number } =
            await addValuesToQuery(splitInvoiceFields, newInvoiceValues, queryInsert, TABLE_NAME_VALUE);
        console.log('insert query: ', queryValues.query);
        inputParamsArray.push(...queryValues.inputParamsArray);
        console.log('execInsertMethod inputParamsArray: ', inputParamsArray);
        queryInsert = queryValues.query;
        insertInvoiceQueries.push(queryInsert);
        let splitDeliveryNotePositionsFields: any =
            invoicePositionsTable[0].DETAIL_VIEW.split(',');
        let newInvoicePositionsData: { insertInvoicesPositionsArray: any[], positionsItmNumsForMessage: string } =
            setNewInvoicePositionsValues(positionsForInvoiceCreation, splitDeliveryNotePositionsFields,
                invoicePositionsTable, DB_TABLE_PREFIX, TABLE_NAME_POS_VALUE, newRGNumber, dnData, states,
                orderPositionsData, orderData, updateOrderStatusQueries, insertInvoicesPositionsQueries);
        let insertInvoicesPositionsArray: any[] = newInvoicePositionsData.insertInvoicesPositionsArray;

        if (Object.keys(insertInvoiceQueries).length > 0
            && Object.keys(insertInvoicesPositionsQueries).length > 0
            && Object.keys(updateOrderStatusQueries).length > 0) {
            console.log('BEFORE: ', insertInvoicesPositionsArray);
            let isInvoiceCreated: boolean = false;
            for (let arrayItem in insertInvoicesPositionsArray) {
                if (insertInvoicesPositionsArray.hasOwnProperty(arrayItem)) {
                    console.log('next items: ', insertInvoicesPositionsArray[arrayItem]);
                    // insert invoice positions first
                    // important is, that the order of positions is right here: first 'SET', then 'KOMP'
                    let insertInvPosResult: { result: boolean | string, insertedPositions: any[] } =
                        await insertPositions('invoicePositions', insertInvoicesPositionsArray[arrayItem],
                            invoicePositionsTable, true);
                    if (insertInvPosResult.result) {
                        // check if invoice item is already created, to prevent duplicates if many SET's provided.
                        if (!isInvoiceCreated) {
                            isInvoiceCreated = true;
                            // create invoice
                            await execMSSQLQueryWithPromise(inputParamsArray, insertInvoiceQueries)
                                .then(async () => {
                                    return await execMSSQLQueryWithPromise(inputParamsArray, updateOrderStatusQueries)
                                        .then(async () => {
                                        });
                                });
                        }
                    } else {
                        console.log('Error occurred at positions insert...');
                        return {success: false, errorCode: errors[5], newInvoice: undefined, positions: undefined};
                    }
                }
            }
            console.log('Go back to client...');
            return {
                success: true,
                errorCode: partlyInvoice ? errors[8] : errors[2],
                newInvoice: newRGNumber,
                positions: newInvoicePositionsData.positionsItmNumsForMessage
            };
        } else {
            console.log('No positions found for insert/update... Delivery note was NOT created...');
            return {success: false, errorCode: errors[5], newInvoice: undefined, positions: undefined};
        }
    } else {
        console.log('No order positions found for delivery notes creation...');
        return {success: false, errorCode: errors[1], newInvoice: undefined, positions: undefined};
    }
}

/**
 * set new invoice values
 *
 * @param splitInvoiceFields
 * @param dnData
 * @param thisID
 * @param invoiceState
 * @param userID
 * @param orderData
 * @param partlyInvoice
 */
async function setNewInvoiceValues(splitInvoiceFields: any, dnData: any, thisID: string, invoiceState: string,
                                   userID: string, orderData: any, partlyInvoice: boolean):
    Promise<{ newInvoiceValues: any | InvoiceInterface, newRGNumber: undefined | string}> {
    let newInvoiceValues: any | InvoiceInterface = {};
    for (let sdItem in splitInvoiceFields) {
        if (splitInvoiceFields.hasOwnProperty(sdItem)) {
            if (dnData[0][splitInvoiceFields[sdItem]]) {
                newInvoiceValues[splitInvoiceFields[sdItem]] =
                    dnData[0][splitInvoiceFields[sdItem]];
            } else {
                newInvoiceValues[splitInvoiceFields[sdItem]] = undefined;
            }
        }
    }
    let newRGNumber: undefined | string = await getNewListNumber(thisID, orderData[0]['SALES_LOCATION']); // TODO Andreas pls check this
    newInvoiceValues['INVOICES_NUMBER'] = newRGNumber;
    newInvoiceValues['INVOICES_CUSTOMER'] = dnData[0]['CUSTOMERS_NUMBER'];
    newInvoiceValues['INVOICES_STATE'] = invoiceState;
    newInvoiceValues['INVOICES_CREATOR'] = userID;
    newInvoiceValues['PAYED'] = '0';
    newInvoiceValues['RELEASE'] = '0';
    newInvoiceValues['PAYMENT_TERM_ID'] = orderData[0]['PAYMENT_TERM_ID'];
    // if not already set as partly invoice (based on delivery note positions state), set it based on delivery note state
    newInvoiceValues['PARTLY_INVOICE'] = (partlyInvoice === true) ? partlyInvoice: dnData[0]['PARTLY_DELIVERY'] ? '1' : '0';
    newInvoiceValues['INVOICES_DATE'] = getDateForQuery();
    newInvoiceValues['INVOICES_UPDATE'] = ''; // getDateForQuery();
    return {newInvoiceValues, newRGNumber};
}

/**
 * set new invoice positions values
 *
 * @param positionsForInvoiceCreation
 * @param splitDeliveryNotePositionsFields
 * @param invoicePositionsTable
 * @param DB_TABLE_PREFIX
 * @param TABLE_NAME_POS_VALUE
 * @param newRGNumber
 * @param dnData
 * @param states
 * @param orderPositionsData
 * @param orderData
 * @param updateOrderStatusQueries
 * @param insertInvoicesPositionsQueries
 */
function setNewInvoicePositionsValues(positionsForInvoiceCreation: any, splitDeliveryNotePositionsFields: any,
                                      invoicePositionsTable: any, DB_TABLE_PREFIX: string, TABLE_NAME_POS_VALUE: string,
                                      newRGNumber: string, dnData: any, states: {}, orderPositionsData: any,
                                      orderData: any, updateOrderStatusQueries: any, insertInvoicesPositionsQueries: any):
    { insertInvoicesPositionsArray: any[], positionsItmNumsForMessage } {
    let insertInvoicesPositionsArray: any[] = [];
    let insertInvoicesPositionsObject: { 'ITM': InvoicePositionsDataInterface[], 'KMP': InvoicePositionsDataInterface[] } = {
        'ITM': [], 'KMP': []
    };
    let isSetItemAdded: boolean = false;
    let newINVPositionsValues: any | InvoicePositionsDataInterface;
    let queryInsertNotesPosition: string;
    // QTY for new delivery note position
    let newINVPositionOrderQTY: number;
    let newINVPositionDeliveryQTY: number;
    // Prices
    let newINVPositionPriceBru: number;
    let newINVPositionPriceNet: number;
    let newINVPositionCategorySoas: string;
    // Variable to manage update of the order position 'POSITION_STATUS'
    // If 'undefined' => status will be not changed
    // Otherwise, it can be changed from 1 to (2), or from 2 to (3)
    let updateOrderPositionPositionStatus: undefined | number;
    let positionsItmNumsForMessage: string = '';
    for (let picItem in positionsForInvoiceCreation) {
        if (positionsForInvoiceCreation.hasOwnProperty(picItem)) {
            newINVPositionsValues = {};
            newINVPositionOrderQTY = 0;
            newINVPositionDeliveryQTY = 0;
            newINVPositionPriceBru = 0;
            newINVPositionPriceNet = 0;
            newINVPositionCategorySoas = '';
            updateOrderPositionPositionStatus = undefined;
            // Fill new invoice position with values from delivery note position:
            // like 'ORDER_NUMBER', 'CURRENCY'
            for (let sdpItem in splitDeliveryNotePositionsFields) {
                if (splitDeliveryNotePositionsFields.hasOwnProperty(sdpItem)) {
                    if (positionsForInvoiceCreation[picItem][splitDeliveryNotePositionsFields[sdpItem]]) {
                        newINVPositionsValues[splitDeliveryNotePositionsFields[sdpItem]] =
                            positionsForInvoiceCreation[picItem][splitDeliveryNotePositionsFields[sdpItem]];
                    } else {
                        newINVPositionsValues[splitDeliveryNotePositionsFields[sdpItem]] = undefined;
                    }
                }
            }
            // remove ID from insert query, because it will be generated by default
            if (invoicePositionsTable[0].DETAIL_VIEW.substring(0, 3) === 'ID,') {
                invoicePositionsTable[0].DETAIL_VIEW =
                    invoicePositionsTable[0].DETAIL_VIEW.substring(3,
                        invoicePositionsTable[0].DETAIL_VIEW.length); // remove id
            }
            // let copyIfOrderPositionID = newDeliveryNotePositionsValues['ID'];
            // remove ID from query
            delete newINVPositionsValues['ID'];
            queryInsertNotesPosition = `INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_POS_VALUE + ` (` +
                invoicePositionsTable[0].DETAIL_VIEW + `) VALUES `;
            newINVPositionsValues['INVOICES_NUMBER'] = newRGNumber;
            newINVPositionsValues['DELIVERY_NOTES_NUMBER'] =
                dnData[0]['DELIVERY_NOTES_NUMBER'];
            // newDeliveryNotePositionsValues['WEIGHT_PER'] = '0';
            newINVPositionsValues['DELIVERY_QTY'] = '0';
            newINVPositionsValues['DELIVERY_NOTES_POSITIONS_ID'] =
                positionsForInvoiceCreation[picItem].ID;
            newINVPositionsValues['CATEGORY_SOAS'] =
                positionsForInvoiceCreation[picItem].CATEGORY_SOAS;
            // STATE_POS_RG_OPEN - 1, STATE_POS_RG_PAYED - 2
            newINVPositionsValues['POSITION_STATUS'] = states['STATE_POS_RG_OPEN'];
            // set QTY
            newINVPositionOrderQTY = positionsForInvoiceCreation[picItem].ORDER_QTY;
            // __ret.newInvoicePositionOrderQTY;
            newINVPositionDeliveryQTY =
                positionsForInvoiceCreation[picItem].DELIVERY_QTY;
            newINVPositionCategorySoas =
                positionsForInvoiceCreation[picItem].CATEGORY_SOAS;
            // search prices in order positions rows
            for (let opItem in orderPositionsData) {
                if (orderPositionsData.hasOwnProperty(opItem)) {
                    // (orderPositionsData[opItem].CATEGORY_SOAS !== constants.CATEGORY_SOAS_KOMP) &&
                    if (orderPositionsData[opItem].ID === positionsForInvoiceCreation[picItem].ORDERS_POSITIONS_ID) {
                        // @ToDo: 1. Make sure if only not KOMP category should have prices
                        newINVPositionPriceBru = orderPositionsData[opItem].PRICE_BRU;
                        newINVPositionPriceNet = orderPositionsData[opItem].PRICE_NET;
                        break;
                    }
                }
            }
            positionsItmNumsForMessage += positionsForInvoiceCreation[picItem].ITMNUM + ' (' +
                newINVPositionOrderQTY + '), ';
            if (positionsForInvoiceCreation[picItem]['CATEGORY_SOAS'] !== constants.CATEGORY_SOAS_KOMP) {
                let updateOrderQuery = `UPDATE ` + DB_TABLE_PREFIX + `ORDERS SET LAST_INVOICE = '` +
                    newRGNumber + `', CUSTOMER_DELIVERY = '` + orderData[0]['CUSTOMER_ORDER'] + `' 
                            WHERE ORDERS_NUMBER = '` + dnData[0]['ORDERS_NUMBER'] + `'`;
                updateOrderStatusQueries.push(updateOrderQuery);
            }
            queryInsertNotesPosition += `(`;
            for (let ndnpvItem in newINVPositionsValues) {
                if (newINVPositionsValues.hasOwnProperty(ndnpvItem)) {
                    if (ndnpvItem === 'PARENT_LINE_ID') {
                        queryInsertNotesPosition += `NULL,`; // !!! will be set later
                        newINVPositionsValues['PARENT_LINE_ID'] = null;
                    } else if (ndnpvItem === 'PRICE_NET') {
                        queryInsertNotesPosition += `'` + newINVPositionPriceNet + `',`;
                        newINVPositionsValues['PRICE_NET'] = newINVPositionPriceNet;
                    } else if (ndnpvItem === 'PRICE_BRU') {
                        queryInsertNotesPosition += `'` + newINVPositionPriceBru + `',`;
                        newINVPositionsValues['PRICE_BRU'] = newINVPositionPriceBru;
                    } else if (ndnpvItem === 'CURRENCY') {
                        queryInsertNotesPosition += `'` + dnData[0]['CURRENCY'] + `',`;
                        newINVPositionsValues['CURRENCY'] = dnData[0]['CURRENCY'];
                    } else if (ndnpvItem === 'ORDER_QTY') {
                        queryInsertNotesPosition += `'` + newINVPositionOrderQTY + `',`;
                        newINVPositionsValues['ORDER_QTY'] = newINVPositionOrderQTY;
                    } else if (ndnpvItem === 'DELIVERY_QTY') {
                        queryInsertNotesPosition += `'` + newINVPositionDeliveryQTY + `',`;
                        newINVPositionsValues['DELIVERY_QTY'] = newINVPositionDeliveryQTY;
                    } else if (newINVPositionsValues[ndnpvItem]) {
                        queryInsertNotesPosition += `'` + newINVPositionsValues[ndnpvItem] + `',`;
                    } else {
                        queryInsertNotesPosition += `NULL,`;
                    }
                }
            }
            // if many SET items in positions: at next SET item, push complete object (SET+KOMP) to array
            if ((positionsForInvoiceCreation[picItem].CATEGORY_SOAS === 'SET') && isSetItemAdded) {
                insertInvoicesPositionsArray.push(insertInvoicesPositionsObject);
                // reset object
                insertInvoicesPositionsObject = {'ITM': [], 'KMP': []};
            }
            if (!insertInvoicesPositionsObject['ITM'].length) {
                insertInvoicesPositionsObject['ITM'].push(newINVPositionsValues);
                isSetItemAdded = true;
            } else {
                insertInvoicesPositionsObject['KMP'].push(newINVPositionsValues);
            }
            if (queryInsertNotesPosition.length) {
                queryInsertNotesPosition = queryInsertNotesPosition.trim();
                queryInsertNotesPosition = queryInsertNotesPosition.substr(0,
                    queryInsertNotesPosition.length - 1);
            }
            queryInsertNotesPosition += `)`;
            // insertDeliveryNotesQueries.push(queryInsertNotesPosition);
            insertInvoicesPositionsQueries.push(queryInsertNotesPosition);
        }
    }
    // add last object
    insertInvoicesPositionsArray.push(insertInvoicesPositionsObject);

    if (positionsItmNumsForMessage.length) {
        positionsItmNumsForMessage = positionsItmNumsForMessage.trim();
        positionsItmNumsForMessage = positionsItmNumsForMessage.substr(0,
            positionsItmNumsForMessage.length - 1);
    }
    return {insertInvoicesPositionsArray, positionsItmNumsForMessage};
}

/**
 * check if given order position item is one of given delivery notes positions entries
 * (detect both, set and his components)
 *
 * @param deliveryNotePositions
 * @param orderPosition
 * @return true if order position is in delivery notes positions, otherwise false
 */
function checkPositionIsInDnp(deliveryNotePositions: any|DeliveryNotePositionDataInterface[]|InvoicePositionsDataInterface[],
                              orderPosition: any|OrderPositionDataInterface[]|DeliveryNotePositionDataInterface[]){
    // console.log('checkPositionIsInDnp...');
    // console.log('deliveryNotePositions: ', deliveryNotePositions);
    // console.log('orderPosition: ', orderPosition);
    let dnQTY = 0;
    let foundSameITMNUM = false;
    for (let dnItem in deliveryNotePositions) {
        if (deliveryNotePositions.hasOwnProperty(dnItem)) {
            if (deliveryNotePositions[dnItem].ORDERS_POSITIONS_ID) { // deliveryNotePositions
                if (deliveryNotePositions[dnItem].ITMNUM === orderPosition.ITMNUM &&
                    deliveryNotePositions[dnItem].ORDERS_POSITIONS_ID === orderPosition.ID) {
                    foundSameITMNUM = true;
                    dnQTY += deliveryNotePositions[dnItem].ORDER_QTY;
                    break;
                }
            } else if (deliveryNotePositions[dnItem].DELIVERY_NOTES_POSITIONS_ID) { // invoicesPositions
                if (deliveryNotePositions[dnItem].ITMNUM === orderPosition.ITMNUM &&
                    deliveryNotePositions[dnItem].DELIVERY_NOTES_POSITIONS_ID === orderPosition.ID) {
                    foundSameITMNUM = true;
                    dnQTY += deliveryNotePositions[dnItem].ORDER_QTY;
                    break;
                }
            }
        }
    }
    return foundSameITMNUM;
}

/**
 * returns boolean flag if items existing for given invoices number
 *
 * @param invoicesNumber
 */
export async function mssql_is_invoices_number_existing(invoicesNumber: string): Promise<boolean> {
    const query: string = `SELECT COUNT(INVOICES_NUMBER) AS NR FROM ${constants.DB_TABLE_PREFIX}INVOICES 
            WHERE INVOICES_NUMBER = '${invoicesNumber}'`;
    console.log('query: ', query);
    const data: any = await mssqlCall.mssqlCall(query);
    console.log('data ', data);
    return <boolean>(data[0]['NR'] > 0);
}

/**
 * check if all invoice positions have STATE 2 = STATE_POS_RG_PAYED
 *
 * @param invoiceId
 * @param positionStatusPayed
 */
export async function checkINVPositionsState(invoiceId: string, positionStatusPayed: number): Promise<boolean> {
    let foundWrongState: boolean = false;
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'INVOICES_NUMBER', type: sql.VarChar, value: invoiceId}];
    let selectQuery: string = `SELECT AA.ID, AA.POSITION_STATUS FROM ` +
        constants.DB_TABLE_PREFIX + `INVOICES_POSITIONS AA WHERE AA.INVOICES_NUMBER = @INVOICES_NUMBER`;
    console.log("checkINVPositionsState-selectQuery: ", selectQuery);
    let invoicePositionsData: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, selectQuery);
    for (let delNoteItem in invoicePositionsData) {
        if (invoicePositionsData.hasOwnProperty(delNoteItem)) {
            if (invoicePositionsData[delNoteItem].POSITION_STATUS !== positionStatusPayed) {
                foundWrongState = true;
                break;
            }
        }
    }
    return foundWrongState;
}

/**
 * update invoice price amounts
 *
 * @param taxResult
 * @param elementsArray
 * @param insertFlag
 */
export async function updateInvoiceAmounts(taxResult: any, elementsArray: any, insertFlag: boolean) {
    let newInvoicesAmounts: { 'ORDERAMOUNT_NET': number, 'ORDERAMOUNT_BRU': number, 'TAX_AMOUNT': number } =
        calculateOrderPrices(taxResult, elementsArray, insertFlag);
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'INVOICES_AMOUNT_NET', type: sql.NVarChar, value: newInvoicesAmounts['ORDERAMOUNT_NET']},
        {name: 'INVOICES_AMOUNT_BRU', type: sql.NVarChar, value: newInvoicesAmounts['ORDERAMOUNT_BRU']},
        {name: 'TAX_AMOUNT', type: sql.NVarChar, value: newInvoicesAmounts['TAX_AMOUNT']},
        {name: 'INVOICES_NUMBER', type: sql.VarChar, value: elementsArray['INVOICES_NUMBER']}];
    let updateInvoicesAmountQuery: string = `UPDATE ` + constants.DB_TABLE_PREFIX + `INVOICES SET 
        INVOICES_AMOUNT_NET = @INVOICES_AMOUNT_NET, INVOICES_AMOUNT_BRU = @INVOICES_AMOUNT_BRU, 
        TAX_AMOUNT = @TAX_AMOUNT WHERE INVOICES_NUMBER = @INVOICES_NUMBER`;
    console.log('updateInvoicesAmountQuery: ', updateInvoicesAmountQuery);
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, updateInvoicesAmountQuery);
}

/**
 * return tax query for given invoices number
 *
 * @param invoicesNumber
 */
export function getInvoiceTaxQuery(invoicesNumber: string) {
    const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'INVOICES_NUMBER', type: sql.VarChar, value: invoicesNumber}];
    let queryString: string = `SELECT TR.TAXRATE AS TAXATION, 
        CA.ADDRESS_TYPE, CA.ADDRESS_STREET, CA.ADDRESS_CITY, CA.ADDRESS_POSTCODE, 
        IV.INVOICES_AMOUNT_NET, IV.INVOICES_AMOUNT_BRU,
        IVP.ITMNUM, IVP.PRICE_NET, IVP.PRICE_BRU, IVP.ORDER_QTY, IVP.POSITION_ID, IVP.CATEGORY_SOAS,
        CS.CUSTOMERS_TYPE AS CLIENT
        FROM ` + DB_TABLE_PREFIX + `CUSTOMERS CS 
        LEFT JOIN ` + DB_TABLE_PREFIX + `INVOICES IV ON IV.INVOICES_CUSTOMER = CS.CUSTOMERS_NUMBER
        LEFT JOIN ` + DB_TABLE_PREFIX + `CUSTOMERS_ADDRESSES CA ON CA.CUSTOMERS_NUMBER = CS.CUSTOMERS_NUMBER 
        LEFT JOIN ` + DB_TABLE_PREFIX + `INVOICES_POSITIONS IVP ON IVP.INVOICES_NUMBER = IV.INVOICES_NUMBER 
        LEFT JOIN ` + DB_TABLE_PREFIX + `TAXRATES TR ON CA.TAXCODE = TR.TAXCODE AND IV.TAXCODE = TR.TAXCODE AND 
        IV.TAXRATE = TR.TAXRATE AND TR.PER_END IS NULL 
        WHERE IV.INVOICES_NUMBER = @INVOICES_NUMBER`; //  AND IVP.CATEGORY_SOAS = 'SET'
    return {inputParamsArray, queryString};
}
