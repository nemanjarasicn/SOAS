// @ts-ignore
import mssqlCall = require('./mssql_call');
// @ts-ignore
import logic_a = require('./mssql_logic');
// @ts-ignore
import logger = require('./../config/winston');
import {mssql_select_states} from "./sql/states/States";

module.exports = {

    // 1. Get all orders with RELEASE = true. JOIN/MATCH with DELIVERY_NOTES if an entry for ORDERS_NUMBER is available.
    // 2. Generate DELIVERY_NOTES by running \createNote route for every order
    // with ORDERS_STATE = ??? 20 => LS erstellt => 30???
    batch_to_generate_delivery_notes: async function (username: any, callback: (arg0: unknown[]) => void) {

        let ORDERS_STATE_IN_PROCESS: string = '20';
        let ORDERS_RELEASE: number = 1;

        let anum: string = '';
        let thisItem: string = '/selectThisOrderAvise';

        let written: number = 0;
        let createdNumbers: any[] = [];

        let query: string = "select * from SOAS.dbo.ORDERS AS OS " +
            "WHERE OS.ORDERS_NUMBER NOT IN " +
            "(SELECT DN.ORDERS_NUMBER FROM SOAS.dbo.DELIVERY_NOTES AS DN) " +
            "AND RELEASE = " + ORDERS_RELEASE + " AND ORDERS_STATE = " + ORDERS_STATE_IN_PROCESS + " ";

        let ordersResult = await new Promise(function (resolve, reject) {
            // @ts-ignore
            mssqlCall.mssqlCall(query, function (result: any) {
                if (result === undefined || result['error'])
                    reject(result['error']);
                else {
                    // logger.info(result);
                    // @ts-ignore
                    logger.info('Anzahl: ' + result.length);
                    resolve(result);
                }
            });
        });

        // @ts-ignore
        if (ordersResult && ordersResult.length) {
            // @ts-ignore
            for (let i = 0; i < ordersResult.length; i++) {
                // @ts-ignore
                let createdDNItem = await getCreateNotesPromise(anum, thisItem, // @ts-ignore
                    ordersResult[i]['ORDERS_NUMBER'], ordersResult[i]['CUSTOMER_ORDER'], username);
                written++;
                createdNumbers.push(createdDNItem);
            }
            // @ts-ignore
            logger.info('Delivery Notes Batch finished... Verarbeitet: ' + written + ' von ' + ordersResult.length);
        } else {
            // callback({error: 'ERROR: ordersResult is null...'});
            // @ts-ignore
            logger.info('Delivery Notes Batch finished... ordersResult is undefined or 0. Nothing to create...');
        }
        callback(createdNumbers);
    },

    // 3. Generate DELIVERY_NOTES PDFs by running \createPDF route for every delivery note
    // with DELIVERY_NOTE_STATE = ??? 40 => DN-PDF erstellt => 50 ???
    batch_to_generate_delivery_notes_pdf_files: async function (language: any, createdNumbers: any[],
                                                                callback: (arg0: unknown[]) => void) {

        let written: number = 0;
        let shouldCallbackData: boolean = false;
        let createdPdfs: any[] = [];
        // @ts-ignore
        logger.info('createdNumbers', createdNumbers);
        if (createdNumbers && createdNumbers.length && (createdNumbers.length > 0)) {
            // @ts-ignore
            logger.info('PDF Elemente sind zu erstellen: ' + createdNumbers.length);
            for (let i = 0; i < createdNumbers.length; i++) {
                let pdfItem = await getDeliveryNotesPDFPromise(createdNumbers[i], i, language, shouldCallbackData);
                written++;
                createdPdfs.push(pdfItem);
            }
            // if (createdPdfs.length > 0) {
            // @ts-ignore
            logger.info('PDF Batch finished... Verarbeitet: ' + written + ' von ' + createdPdfs.length);
            // } else {
            //     logger.info('PDF Batch finished...  Nothing to create...');
            // }
        } else {
            // @ts-ignore
            logger.info('PDF Batch finished... createdNumbers is undefined or 0. Nothing to create...');
        }
        callback(createdPdfs);
    },

    // 4. Generate INVOICES by running \createNote route for every order
    // with DELIVERY_NOTE_STATE = ??? 50 => DN-PDF erstellt
    batch_to_generate_invoices: async function (username: any, callback: (arg0: unknown[]) => void) {

        let DELIVERY_NOTES_STATE_OPEN: string = '40';
        let DELIVERY_NOTES_STATE_COMPLETLY_DELIVERED: string = '70';

        let FIELD_IS_NULL = null;

        let thisItem: string = '/selectThisDeliveryNote';

        let written: number = 0;
        let createdNumbers: any[] = [];

        let query: string = "select * from SOAS.dbo.DELIVERY_NOTES AS DN " +
            "WHERE DN.DELIVERY_NOTES_NUMBER NOT IN " +
            "(SELECT INV.DELIVERY_NOTES_NUMBER FROM SOAS.dbo.INVOICES AS INV) " +
            "AND PDF_CREATED_DATE IS NOT " + FIELD_IS_NULL + " " +
            "AND PDF_DOWNLOAD_LINK IS NOT " + FIELD_IS_NULL + " " +
            "AND DELIVERY_NOTES_STATE = " + DELIVERY_NOTES_STATE_COMPLETLY_DELIVERED + " ";
        // "AND SHIPPING_DATE != " + FIELD_IS_NULL + "
        // console.log("batch_to_generate_invoices: ", query);
        let deliveryNotesResult = await new Promise(function (resolve, reject) {
            // @ts-ignore
            mssqlCall.mssqlCall(query, function (result: any) {
                if (result == undefined || result['error'])
                    reject(result['error']);
                else {
                    // logger.info(result);
                    // @ts-ignore
                    logger.info('Anzahl: ' + result.length);
                    resolve(result);
                }
            });
        });

        // @ts-ignore
        if (deliveryNotesResult && deliveryNotesResult.length) {
            // @ts-ignore
            for (let i = 0; i < deliveryNotesResult.length; i++) {
                // @ts-ignore
                let createdInvItem = // @ts-ignore
                    await getCreateNotesPromise(deliveryNotesResult[i]['DELIVERY_NOTES_NUMBER'], // @ts-ignore
                    thisItem, deliveryNotesResult[i]['ORDERS_NUMBER'], deliveryNotesResult[i]['CUSTOMERS_NUMBER'],
                    username);
                written++;
                createdNumbers.push(createdInvItem);
            }
            // @ts-ignore
            logger.info('Invoices Batch finished... Verarbeitet: ' + written + ' von ' + deliveryNotesResult.length);
        } else {
            // callback({error: 'ERROR: deliveryNotesResult is null...'});
            // @ts-ignore
            logger.info('Invoices Batch finished... deliveryNotesResult is undefined or 0. Nothing to create...');
        }
        callback(createdNumbers);
    },

    // 5. Generate INVOICES PDFs by running \createPDF route for every order
    // with INVOICES_STATE = ??? 80 => Offen
    // batch_to_generate_invoices_pdf_files: async function(language, createdNumbers, callback) {
    //
    //     let written = 0;
    //     let shouldCallbackData = false;
    //     let createdPdfs = [];
    //
    //     // logger.info('PDF Elemente sind zu erstellen: ' + createdNumbers.length);
    //     // logger.info('createdNumbers' + createdNumbers);
    //
    //     if (createdNumbers && createdNumbers.length) {
    //         for (let i = 0; i < createdNumbers.length; i++) {
    //             let pdfItem = await getDeliveryNotesPDFPromise(createdNumbers[i], i, language, shouldCallbackData);
    //             written++;
    //             createdPdfs.push(pdfItem);
    //         }
    //
    //         logger.info('Delivery Notes PDF Batch finished... Verarbeitet: ' + written + ' von ' + createdPdfs.length);
    //         callback(createdPdfs);
    //     } else {
    //         callback({error: 'ERROR: ordersResult is null...'});
    //     }
    // }
};

/**
 * create notes promise
 *
 * @param anum
 * @param thisItem
 * @param orderNumber
 * @param customerNumber
 * @param userID
 */
async function getCreateNotesPromise(anum: string, thisItem: string, orderNumber: string, customerNumber: string,
                                     userID: string) {
    return new Promise(async (resolve, reject) => {
        let deliveryNoteState: any = undefined;
        let statesResult: any = await mssql_select_states();
        // console.log("getCreateNotesPromise - statesResult: ", statesResult);
        if (statesResult) {
            // thisID: string, thisDialog: string, orderNumber: string, customerNumber: string, userID: string,
            // statesObj: any, deliveryNoteState
            // generate delivery notes
            // @ts-ignore
            logic_a.mssql_create_notes(anum, thisItem, orderNumber, customerNumber, userID, statesResult,
                deliveryNoteState, function (result: any) {
                // @ts-ignore
                logger.info(result);
                if (result === undefined || result['error']) {
                    reject("FAILURE " + result['error']);
                } else {
                    resolve(result);
                }
            });
        } else {
            reject("FAILURE statesResult is undefined...");
        }
    });
}

async function getDeliveryNotesPDFPromise(createdNumberItem: { [x: string]: any; }, i: number, language: any,
                                          shouldCallbackData: boolean) {

    let refTable: string;
    let batchCall: boolean = true; // flag to update the states of delivery notes and invoices after creating pdfs
    let errorMsg: string = 'Try creating pdf job failed. ';
    if (createdNumberItem['thisDialog'] === '/selectThisOrderAvise') {
        refTable = 'deliveryNote';
        errorMsg += ' Lieferschein: ';
    } else if (createdNumberItem['thisDialog'] === '/selectThisDeliveryNote') {
        refTable = 'invoice';
        errorMsg += ' Rechnung: ';
    }
    errorMsg += createdNumberItem['number'] + ' ';
    let pdfItem: any;
    try {
        pdfItem = await new Promise((resolve, reject) => {
            // @ts-ignore
            logic_a.mssql_select_thisItem(createdNumberItem['number'], refTable, language, shouldCallbackData,
                batchCall,function (result: any) {
                // logger.info(result);
                if (result == undefined || result['error']) {
                    reject("FAILURE " + result['error']);
                } else {
                    resolve(result);
                }
            });
        })
    } catch (e) {
        // @ts-ignore
        logger.error(new Error(errorMsg));
    }
    return pdfItem;
}
