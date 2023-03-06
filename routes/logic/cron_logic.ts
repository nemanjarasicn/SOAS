/* AUTHOR: Stefan Schimmelpfennig, Andreas Lening */
/* LASTUPDATE: 11.05.2021  */
import {writeToFile} from "./sql/csv-import/CsvImport";

let sqlController = require('./sql/SqlController');
import msLogic = require('./mssql_logic.js');
import mssqlCall = require('./mssql_call.js');
import importData = require('./csv_import.js');
import sgLogic = require('./sg_logic.js');
import sgCall = require('./sg_call.js');
import cronLogic = require('./cron_db_logic.js');
import logger = require('./../config/winston');
// @ts-ignore
import cron = require('node-cron');
// @ts-ignore
import mlLogic = require('./mail_logic');
import {startTimeTracking, stopTimeTracking} from './helpers';
import {constants} from "./constants/constants";

const activeBatchesObj = {};
let cronActiveFlag = 1;
let cronNotActiveFlag = 0;
let runResultsArr = ['STARTED', 'SUCCESS', 'FAILED'];

// @ts-ignore
module.exports = {

    // function for testing single methods via app.ts ...
    // test_promise_query: async function() {
    //
    //     await module.exports.sage_import_prilists(false, 0, 200000);
    // },

    /**
     * run daily import of tables updates from SAGE:
     *
     * articles - only insert of new articles
     *
     * dist components - insert and update of dist components
     * crossselling - update crossselling flag of articles
     * prilists - insert and update of price lists
     * customers - insert and update of customers
     * orders - insert and update of orders
     * delivery notes - insert and update of delivery notes
     * invoices - insert and update of invoices
     */
    sage_daily_import: async function () {

        let dailyCronUpdateStartTime = startTimeTracking('sage_daily_tables_update');

        // set ranges of tables update

        // articles : 20900 zu 21195 = 295
        // let itmStartNumber: number = 0;  // 19780;
        // let itmStepNumber: number = 0;   // ! 500;
        let itmRowsNumber: number = 100; // 0 ! 500;

        // dist components
        // let dcompStartNumber: number = 36700;
        // let dcompStepNumber: number = 1000;
        let dcompRowsNumber: number = 50000; //100;

        // prilists
        let prilistsStartNumber: number = 0; // 73400; //72500;
        let prilistsStepNumber: number = 100; // 1000; 200000;

        // customers
        let customersStartNumber: number = 0; //365000; //300000; //367350; //361500;
        let customersStepNumber: number = 1000; //30000;   //100000; // 17 min 31 sek (1000 => 2 min)
        // let customersRowsNumber: number = 100;

        // sorders
        let sordersStartNumber: number = 0; //886000; //820000; // 840000
        let sordersStepNumber: number = 1000; //30000; // 10000;

        // sdelivery
        let sdeliveryStartNumber: number = 0; //870000;
        let sdeliveryStepNumber: number = 1000; //30000;

        // sinvoice
        let sinvoiceStartNumber = 0; //690000; // 682000
        let sinvoiceStepNumber = 1000; //30000; // 10000;

        // Step 1: Update first tables without dependencies... Faster...

        // 1. Insert prilists - 5 seconds to 5min5sec
        // await module.exports.sage_import_prilists(false, 0, 200000); // 25 minutes with compare
        // 1. Update prilists
        // let prilistsStartNumber: number = 73400; //72500;
        // let prilistsStepNumber: number = 1000;
        // // @ts-ignore
        // await module.exports.sage_import_prilists(true, prilistsStartNumber, prilistsStepNumber);

        // 2. Update warehousing: 36 seconds
        let warehousingStartNumber: number = 8960;
        let warehousingStepNumber: number = 1000;
        // ToDo: Add update function, instead of full import after deleting
        // @ts-ignore
        // await module.exports.sage_import_new_warehousing(false, 0, 0);

        // Step 2: Update tables with dependencies...

        // 3. Update articles
        // let itmStartNumber: number = 19780; //19700;
        // let itmStepNumber: number = 500;
        // ToDo: Add/Check update logic (!)
        // @ts-ignore
        // await module.exports.sage_import_new_itmmaster(true, 35000); // itmStartNumber, itmStepNumber);

        // 4. Update crossselling
        // @ts-ignore
        // await module.exports.set_articles_crossselling_flg();

        // 5. Update dist components
        // let dcompStartNumber: number = 36700;
        // let dcompStepNumber: number = 1000;
        // @ts-ignore
        // await module.exports.sage_import_dist_components(true, dcompRowsNumber);

        /*
                // 6.Update currencies
                // ToDo: Don't update, because it inserts all 173 currencies...
                // @ts-ignore
                // await module.exports.sage_import_currencies();


                // 7. Update customers => Dependencies: Refresh prilists
                // let customersStartNumber: number = 365000; //300000; //367350; //361500;
                // let customersStepNumber: number = 30000;   //100000; // 17 min 31 sek (1000 => 2 min)
                // @ts-ignore
                await module.exports.sage_import_new_customers(true, customersStartNumber, customersStepNumber); // customersRowsNumber); //

                // 8. Update orders => Dependencies: Refresh customers/customers addresses before run! 960000/1000
                // let sordersStartNumber: number = 886000; //820000; // 840000
                // let sordersStepNumber: number = 30000; // 10000;
                // @ts-ignore
                await module.exports.sage_import_new_sorders(true, sordersStartNumber, sordersStepNumber);

                // 9. Update delivery notes: 919000/1000
                // let sdeliveryStartNumber: number = 870000;
                // let sdeliveryStepNumber: number = 30000;
                // @ts-ignore
                await module.exports.sage_import_new_sdelivery(true, sdeliveryStartNumber, sdeliveryStepNumber);

                // 10 Update invoices: 725850/100
                // let sinvoiceStartNumber = 690000; // 682000
                // let sinvoiceStepNumber = 30000; // 10000;
                // @ts-ignore
                await module.exports.sage_import_new_sinvoice(true, sinvoiceStartNumber, sinvoiceStepNumber);
        */
        console.log('sage_daily_tables_update finished...');

        stopTimeTracking(dailyCronUpdateStartTime, 'sage_daily_tables_update');

    },

    /**
     * Emptying of soas tables and import data from all needed sage tables at once
     *
     */
    sage_complete_import: async function() {

        let completeImportStartTime = startTimeTracking('sage_complete_import');

        throw new Error('stopp');

        //ToDo: Import for: PAYMENT_TERMS

        // ATRIBUTES, ITEM_BASIS, CROSSSELLING_FLG, PRILISTS, DIST_COMPONENTS, WAREHOUSING, CUSTOMERS, ORDERS, DELIVERY NOTES, INVOICES

        /**
         * 1. Delete all ATTRIBUTES, ATTRIBUTE_RELATIONS, CROSSSELLING, ITEM_BASIS, CUSTOMERS, CUSTOMERS_ADDRESSES and import all attributes from SAGE.
         * Last Import: 20201026 - Execution time:  30 seconds. All Attributes items: 1939 Last: Attr_Craft: 1; => 1941 Last Attr_Craft: 1;
         * Last Import: 20201008 - Execution time: 1.5-2 minutes All Attributes items: 10746
         * itm: 20512 - cross: 8926 - attr_rel: 62829 - attr: 10751
         */
        // @ts-ignore
        await module.exports.sage_import_new_attributes();

        /**
         * 2. Import all articles
         * Last Import: 20201030 - Execution time: 1 hour 30 minutes. All ITEM_BASIS items: 19786; ATTRIBUTES: 10747; ATTRIBUTE_RELATIONS: 62801 , CROSSSELLING: 8922.
         */
        //Dependencies: Refresh attributes before run!
        // @ts-ignore
        await module.exports.sage_import_new_itmmaster(false, 0, 20000);

        /**
         * 3. Set/Update crossselling flag based on soas ITEM_BASIS items
         * Last Import: 20201030 - Execution time: 40 seconds. All 1082 items.
         */
        // @ts-ignore
        await module.exports.set_articles_crossselling_flg();

        /**
         * 4. Import dist components
         * Last Import: 20201026 - Execution time: 2 seconds. All 36716 items.
         */
        // @ts-ignore
        await module.exports.sage_import_dist_components(false, 0); // 0 , 38000);

        /**
         * 5. Import prilists components
         * Last Import: 20201026 - Execution time: 15 sec (insert). All 72558 items.
         */
        // @ts-ignore
        await module.exports.sage_import_prilists(false, 0, 200000);

        /**
         * 6. Import all currencies from Sage > TABCUR
         * Execution time: All 168 items approx 10 seconds
         */
        // @ts-ignore
        // await module.exports.sage_import_currencies();

        /**
         * 7. Import all warehousing from Sage > STOCK
         * Execution time: All 8963 items approx 10 seconds
         */
        // @ts-ignore
        await module.exports.sage_import_new_warehousing(false, 0, 10000);

        /**
         * 8. Import customers
         * Last Import: 20201130 - Execution time: 8 minutes. All CUSTOMERS 243408 items. CUSTOMER_ADDRESSES 488858 items.
         * Last Import: 20201024 - Execution time: 1 hour 29 min. All CUSTOMERS 234101 items. CUSTOMER_ADDRESSES 470219 items.
         * All SAGE-DB: 369553 (20201126) -  357031 (20201025)-
         * NUR CUSTOMERS: 233286 (es fehlen 3000) "SELECT DISTINCT BPCUSTOMER.BPCNUM_0 FROM x3v65p.EMOPILOT.BPCUSTOMER;"
         * 50000 items 11 minuten
         * 10000 items 9 minutes (update)
         */
        //Dependencies: Refresh prilists
        await module.exports.sage_import_new_customers(false, 0, 500000);

        /**
         * 9. Import orders
         * All since 2018: 168289 ( WITH JOIN Q + P: 807076 )
         * Last Import: 20201130 : Duration 11 min: ORDERS 188184, POSITIONS: 901705
         * Last Import: 20201109 : Duration 34 std: ORDERS 177253, POSITIONS: 844337
         *  173307 und 803000
         */
        //Dependencies: Refresh customers/customers addresses before run!
        await module.exports.sage_import_new_sorders(false, 0, 1000000);

        /**
         * 10. Import delivery notes
         * All SAGE since 2018: 786068
         * Last Import: 20201130 : Duration 6 min: DEL-NOTES 183299, DEL-NOTES-POSITIONS: 842504
         * Last Import: 20201115 : Duration 36 min: DEL-NOTES 177366, DEL-NOTES-POSITIONS: 813861
         */
        //Dependencies: Refresh orders before run!
        await module.exports.sage_import_new_sdelivery(false, 0 , 1000000);

        /**
         * 11. Import invoices
         * All SAGE since 2018: 663096
         * Last Import: 20201130 : Duration 8 min: INVOICES 133967, INVOICES-POSITIONS: 683339
         * Last Import: 20201115 : Duration 14 min: INVOICES 130405, INVOICES-POSITIONS: 663966
         */
        //Dependencies: Refresh orders and delivery notes before run!
        await module.exports.sage_import_new_sinvoice(false, 0, 1000000);

        stopTimeTracking(completeImportStartTime, 'sage_complete_import');
    },

    /**
     * Insert / update currencies
     * ToDo: Method insert all 173 currencies!!! Better don't update. Use backup with only 8 used currencies.
     */
    sage_import_currencies: async function () {

        let currenciesUpdateMode: boolean = false
        let startTime = startTimeTracking('sage_import_currencies STARTED... ' +
        currenciesUpdateMode ? "UPDATE" : "INSERT");

        if (!currenciesUpdateMode) {
            // @ts-ignore
            // let deleteCurrenciesQuery = "DELETE FROM " + constants.DB_TABLE_PREFIX + "CURRENCIES;";
            // await msLogic.execOneMSSQLQueryWithPromise(deleteCurrenciesQuery);
            // @ts-ignore
            // let reseedCurrenciesQuery = "DBCC CHECKIDENT ('CURRENCIES', RESEED, 0);";
            // let reseedCurrenciesQueryResult = await msLogic.execOneMSSQLQueryWithPromise(reseedCurrenciesQuery);
        } else {
            await removeTableLocksPromiseQuery();
        }

        // @ts-ignore
        let tcrResults = await sgCall.sage_call_get_all_tabcur();
        // @ts-ignore
        await sgCall.sage_close_pool_connections();

        let tabcurArray: string[] = []; // tabcurArray
        // let found = 0;
        for (let tcrItem in tcrResults) {
            // CURRENCY_ISO_CODE,CURRENCY_SYMBOL,CURRENCY_NAME
            // @ts-ignore
            tabcurArray.push([tcrResults[tcrItem].CUR_0.trim(), tcrResults[tcrItem].CURSYM_0.trim(),
                tcrResults[tcrItem].CURSHO_0.trim()]);
        }
        // Insert/UPDATE CURRENCIES items...
        if (tabcurArray) {
            // @ts-ignore
            await importData.sw_data_import('CURRENCIES', tabcurArray);
        }
        stopTimeTracking(startTime, "sage_import_currencies");
    },

    sage_import_payment_terms: async function () {

        // Empty table by deleting table items from given table
        await emptyTablePromiseQuery("PAYMENT_TERMS", false, true);

        await new Promise((resolve, reject) => {
            /*
            // @ts-ignore
            sgLogic.sage_get_all_bomd(async function (ptResults: any) {
                // console.log("Received ptResults: ", ptResults);
                for (let ptItem in ptResults) {

                    // ToDo: Add update logic

                    // console.log("ptResults[ptItem]: ", ptResults[ptItem]);

                    // @ts-ignore
                    let ptInsertQuery = "INSERT INTO " + constants.DB_TABLE_PREFIX + "PAYMENT_TERMS (PAYMENT_TERM_ID,PAYMENT_TERM_NAME,
                    PAYMENT_TERM_COMMENT,PAYMENT_TERM_ACTIVE) VALUES " +
                        "('" + ptResults[ptItem].ITMREF_0 + "','" + ptResults[ptItem].CPNITMREF_0 + "','" +
                        ptResults[ptItem].BOMQTY_0 + "','" + ptResults[ptItem].BOMQTY_0 + "');";
                    let ptInsertQueryResult = await msLogic.execOneMSSQLQueryWithPromise(ptInsertQuery);
                    // throw new Error("");
                }
                resolve(true);
            });
            */
        });
    },

    /**
     * Import warehousing from SAGE (STOCK)
     *
     * Execution time: All 8961 (with check) items approx ... minutes
     */
    sage_import_new_warehousing: async function (warehousingUpdateMode: boolean, startNumber: number, stepNumber: number) {

        let startTime = startTimeTracking(warehousingUpdateMode ?
            "sage_import_new_warehousing UPDATE STARTED..." : "sage_import_new_warehousing INSERT STARTED...");
        let allSoasWarehousing: string[] = [];
        // if (!warehousingUpdateMode) {
        //     // Empty table by deleting table items from given table
        //     await emptyTablePromiseQuery("WAREHOUSING", true, true);
        // } else {
        //     await removeTableLocksPromiseQuery();
        allSoasWarehousing = await getAllFromSOAS("WAREHOUSING");
        console.log("ALL SOAS WAREHOUSING: ", allSoasWarehousing.length);
        // }

        // @ts-ignore
        let stockResults = await sgCall.sage_call_get_all_stock(startNumber, stepNumber);
        // @ts-ignore
        await sgCall.sage_close_pool_connections();

        console.log("ALL SAGE WAREHOUSING:", stockResults.length);

        let queriesArr = [];
        let counter: number = 900; // Max number of rows to insert in one query is 1000 !
        const stkQueryValue: string = "INSERT INTO " + constants.DB_TABLE_PREFIX + "WAREHOUSING " +
            "(WHLOC,ITMNUM,LOT,LOC,STATUS_POS,QTY,RESERVED,UPDATE_LOC) VALUES ";
        let stkQuery: string = JSON.parse(JSON.stringify(stkQueryValue));

        let soasDuplicateFound: boolean = false;
        let numberOfDuplicates = 0;
        for (let stkItem in stockResults) {
            soasDuplicateFound = false;
            // if (warehousingUpdateMode) {
            for (let soasWHItem in allSoasWarehousing) {
                if (allSoasWarehousing[soasWHItem]['ITMNUM'].trim() === stockResults[stkItem].ITMREF_0.trim()
                    &&
                    allSoasWarehousing[soasWHItem]['WHLOC'].trim() === stockResults[stkItem].STOFCY_0.trim() &&
                    allSoasWarehousing[soasWHItem]['LOT'].trim() === stockResults[stkItem].LOT_0.trim()
                    &&
                    allSoasWarehousing[soasWHItem]['LOC'].trim() === stockResults[stkItem].LOC_0.trim() &&
                    allSoasWarehousing[soasWHItem]['STATUS_POS'].trim() === stockResults[stkItem].STA_0.trim() // 9000
                    // &&
                    // allSoasWarehousing[soasWHItem]['QTY'] === stockResults[stkItem].QTYPCU_0
                ) {
                    soasDuplicateFound = true;
                    numberOfDuplicates++;
                    break;
                }
            }
            // }
            if (!soasDuplicateFound) {
                counter--;
                let reserved: number = 0; // stockResults[stkItem].;
                stkQuery += " ('" +
                    stockResults[stkItem].STOFCY_0 + "','" + stockResults[stkItem].ITMREF_0 + "','" +
                    stockResults[stkItem].LOT_0 + "','" + stockResults[stkItem].LOC_0 + "','" +
                    stockResults[stkItem].STA_0 + "','" + stockResults[stkItem].QTYPCU_0.toString() + "','" +
                    reserved + "','" + stockResults[stkItem].CREDAT_0.toISOString() + "'),";
                if (counter === 0) {
                    stkQuery = stkQuery.substr(0, stkQuery.length - 1); // remove last ,
                    queriesArr.push(stkQuery);
                    stkQuery = JSON.parse(JSON.stringify(stkQueryValue));
                    counter = 900;
                }
            }
        }
        // Add last items...
        if (counter < 900) {
            stkQuery = stkQuery.substr(0, stkQuery.length - 1); // remove last ,
            queriesArr.push(stkQuery);
        }
        // for (let qrItem in queriesArr) {
        //     // @ts-ignore
        //     // await msLogic.execOneMSSQLQueryWithPromise(queriesArr[qrItem]);
        // }
        console.log('numberOfDuplicates: ', numberOfDuplicates);
        writeToFile(queriesArr, 'insertWarehousing2022.txt' );
        //ToDo: Add logic for items delete, if there are not available at SAGE...

        stopTimeTracking(startTime, "sage_import_new_warehousing");
    },

    /**
     * Import prilists from SAGE
     * Pro 1 min = 2000 items; 10+ min = 20000 items
     */
    sage_import_prilists: async function (prilistsUpdateMode: boolean, startNumber: number, stepNumber: number) {

        let startTime = startTimeTracking( prilistsUpdateMode ? "sage_import_prilists UPDATE STARTED..." :
            "sage_import_prilists INSERT STARTED...");

        let prilistsRefTable: string = "PRILISTS";
        let allSagePrilistsNumber: number;
        let insertedPrilists: number = 0;
        let updatedPrilists: number = 0;
        let allSoasPrilists: [] = [];

        // if(!prilistsUpdateMode) {
        //     // Empty table by deleting table items from given table
        //     // await emptyTablePromiseQuery(prilistsRefTable, true, true);
        //     // await truncateTablePromiseQuery(prilistsRefTable, true);
        // } else {
        // await removeTableLocksPromiseQuery();
        allSoasPrilists = await getAllFromSOAS(prilistsRefTable);
        console.log("ALL SOAS PRILISTS: ", allSoasPrilists.length);
        // }

        // let prilistsImportTemplate: any = await getImportTemplate(prilistsRefTable);

        // @ts-ignore
        let prilistResults = await sgCall.sage_call_get_all_prilists_for_import(startNumber, stepNumber);
        // @ts-ignore
        await sgCall.sage_close_pool_connections();

        allSagePrilistsNumber = prilistResults.length;
        console.log("ALL SAGE PRILISTS: ", allSagePrilistsNumber);

        let queriesArr = [];
        let counter: number = 900; // Max number of rows to insert in one query is 1000 !
        const prlQueryStartValue: string = "INSERT INTO " + constants.DB_TABLE_PREFIX + "PRILISTS " +
            "(ITMNUM,CURRENCY,PRILIST,CUSGRP,PRICE_NET,PRICE_BRU,START_DATE,END_DATE,PRIORITY) VALUES "; // ITMNUM,PRICE_NET,PRICE_BRU,CURRENCY,PRILIST,CUSGRP
        let prlQuery: string = JSON.parse(JSON.stringify(prlQueryStartValue));
        let prlUpdateArr: never[] | any[][] = [];
        let soasDuplicateFound: boolean = false;
        // insert into empty table
        for (let prlItem in prilistResults) {
            soasDuplicateFound = false;
            // if (prilistsUpdateMode) {
            for (let soasPrlItem in allSoasPrilists) {
                if (allSoasPrilists[soasPrlItem]['ITMNUM'] === prilistResults[prlItem].ITMNUM &&
                    allSoasPrilists[soasPrlItem]['PRILIST'] === prilistResults[prlItem].PRILIST &&
                    allSoasPrilists[soasPrlItem]['CUSGRP'] === prilistResults[prlItem].CUSGRP) {
                    soasDuplicateFound = true;
                    break;
                }
            }
            // }
            if (!soasDuplicateFound) {
                // For insert
                counter--;

                // if price bru is empty/null => write 0.0
                // Later need to update PRICE_BRU column and calculate price based on price net
                // Then set PRICE_BRU db field again as NOT NULL
                let priceBru = getPrilistPriceBru(prilistResults, prlItem);

                // 'ITMNUM,CURRENCY,PRILIST,CUSGRP,PRICE_NET,PRICE_BRU'

                prlQuery += " ('" + prilistResults[prlItem].ITMNUM  + "','" + prilistResults[prlItem].CURRENCY + "','" +
                    prilistResults[prlItem].PRILIST + "','" + prilistResults[prlItem].CUSGRP + "','" +
                    prilistResults[prlItem].PRICE_NET.toString() + "','" + priceBru.toString() + "','" +
                    "2021-01-01" + "','" + "2029-01-01" + "','" + 50 + "'),";
                insertedPrilists++;
                if (counter === 0) {
                    prlQuery = prlQuery.substr(0, prlQuery.length - 1); // remove last ,
                    queriesArr.push(prlQuery);
                    prlQuery = JSON.parse(JSON.stringify(prlQueryStartValue));
                    counter = 900;
                }
            } else {
                /*
                                // if price bru is empty/null => write 0.0
                                // Later need to update PRICE_BRU column and calculate price based on price net
                                // Then set PRICE_BRU db field again as NOT NULL
                                let priceBru = getPrilistPriceBru(prilistResults, prlItem);

                                // For update - See [IMPORT_TEMPLATES] table > UPDATE FIELDS (Primary field: "ITMNUM" + 2 Update fields:
                                // "PRICE_NET","PRICE_BRU"
                                // @ts-ignore
                                prlUpdateArr.push([prilistResults[prlItem].ITMNUM, prilistResults[prlItem].CURRENCY, // @ts-ignore
                                    prilistResults[prlItem].PRILIST, prilistResults[prlItem].CUSGRP, // @ts-ignore
                                    prilistResults[prlItem].PRICE_NET.toString(), priceBru.toString()]);
                                // prilistResults[prlItem].PRICE_BRU.toString()
                                updatedPrilists++;

                 */
            }
        }
        if (!prilistsUpdateMode) {
            // Add last items...
            if (counter < 900) {
                prlQuery = prlQuery.substr(0, prlQuery.length - 1); // remove last ,
                queriesArr.push(prlQuery);
            }
            console.log('TO insert queriesArr: ', queriesArr.length);
            // for (let qrItem in queriesArr) {
            //@ts-ignore
            // await msLogic.execOneMSSQLQueryWithPromise(queriesArr[qrItem]);
            // }
            writeToFile(queriesArr, 'insertPrilist2022.txt' );
            // @ts-ignore
            logger.info('sage_import_prilists - inserted: ' + insertedPrilists + ' prilists');
            let loggerResultMessage: string = "sage_import_prilists - import ";
            loggerResultMessage += (insertedPrilists >= allSagePrilistsNumber) ? "successful: " : "not complete: ";
            loggerResultMessage += insertedPrilists + " of " + allSagePrilistsNumber + " was imported";
            // @ts-ignore
            logger.info(loggerResultMessage);
        } else {
            // console.log("prlUpdateArr: ", prlUpdateArr);
            console.log('TO update prlUpdateArr: ', prlUpdateArr.length);
            let resultsArr = [];
            resultsArr.push(prlUpdateArr);
            // @ts-ignore
            // await importData.sw_data_import(prilistsRefTable, resultsArr[0]);
            // @ts-ignore
            logger.info('sage_import_prilists - updated: ' + updatedPrilists + ' prilists');
        }
        stopTimeTracking(startTime, "sage_import_prilists");
    },

    sage_import_dist_components: async function (distComponentsUpdateMode: boolean, rowsNumber: number) {

        let startTime = startTimeTracking( distComponentsUpdateMode ?
            "sage_import_dist_components UPDATE STARTED..." : "sage_import_dist_components INSERT STARTED...");

        let distCompRefTable: string = "DIST_COMPONENTS";
        let allDistComp: string[] = [];
        let allSageDistCompNumber: number;
        let insertedDistComp: number = 0;
        let updatedDistComp: number = 0;

        // if (!distComponentsUpdateMode) {
        //     Empty table by deleting table items from given table
        // await emptyTablePromiseQuery(distCompRefTable, false, true);
        // } else {
        //     await removeTableLocksPromiseQuery();
        allDistComp = await getAllFromSOAS(distCompRefTable);
        console.log("ALL SOAS DIST_COMPONENTS: ", allDistComp.length);
        // }

        // @ts-ignore
        let bomdResults = await sgCall.sage_call_get_all_bomd(rowsNumber);
        // @ts-ignore
        await sgCall.sage_close_pool_connections();

        allSageDistCompNumber = bomdResults.length;
        console.log("ALL SAGE DIST_COMPONENTS: ", allSageDistCompNumber);

        let queriesArr = [];
        let counter: number = 900; // Max number of rows to insert in one query is 1000 !
        const distQueryValue: string = "INSERT INTO " + constants.DB_TABLE_PREFIX + "DIST_COMPONENTS (ITMNUM,COMPNUM,DIST_QTY) VALUES ";
        let distQuery: string = JSON.parse(JSON.stringify(distQueryValue));
        let distUpdateArr: never[] | any[][] = [];
        let soasDuplicateFound: boolean = false;
        let numberOfDuplicates = 0;
        for (let bmdItem in bomdResults) {
            soasDuplicateFound = false;
            // if (distComponentsUpdateMode) {
            for (let soasDCItem in allDistComp) {
                if (allDistComp[soasDCItem]['ITMNUM'].trim() === bomdResults[bmdItem].ITMREF_0.trim()
                    // &&
                    // allDistComp[soasDCItem]['COMPNUM'].trim() === bomdResults[bmdItem].CPNITMREF_0.trim() &&
                    // parseInt(allDistComp[soasDCItem]['DIST_QTY']) === bomdResults[bmdItem].BOMQTY_0
                ) {
                    soasDuplicateFound = true;
                    numberOfDuplicates++;
                    break;
                }
            }
            // }
            if (!soasDuplicateFound) {
                // For insert
                counter--;
                distQuery += " ('" + bomdResults[bmdItem].ITMREF_0.trim() + "','" +
                    bomdResults[bmdItem].CPNITMREF_0.trim() + "','" + bomdResults[bmdItem].BOMQTY_0 + "'),";
                insertedDistComp++;
                if (counter === 0) {
                    distQuery = distQuery.substr(0, distQuery.length - 1); // remove last ,
                    queriesArr.push(distQuery);
                    distQuery = JSON.parse(JSON.stringify(distQueryValue));
                    counter = 900;
                }
            } else {
                // For update - See [IMPORT_TEMPLATES] table > UPDATE FIELDS (Primary fields: "ITMNUM", "COMPNUM" + 1
                // Update fields: "DIST_QTY"
                // @ts-ignore
                distUpdateArr.push([bomdResults[bmdItem].ITMREF_0.trim(), // @ts-ignore
                    bomdResults[bmdItem].CPNITMREF_0.trim(), bomdResults[bmdItem].BOMQTY_0]);
                updatedDistComp++;
            }
        }
        // if (!distComponentsUpdateMode) {
        // Add last items...
        if (counter < 900) {
            distQuery = distQuery.substr(0, distQuery.length - 1); // remove last ,
            queriesArr.push(distQuery);
        }
        console.log('TO insert queriesArr: ', queriesArr.length);
        // throw new Error("");
        // for (let qrItem in queriesArr) {
        //     // @ts-ignore
        //     await msLogic.execOneMSSQLQueryWithPromise(queriesArr[qrItem]);
        // }
        console.log('Number of duplicates: ', numberOfDuplicates);
        writeToFile(queriesArr, 'insertDIST_COMPONENTS2022.txt' );
        // @ts-ignore
        logger.info('sage_import_dist_components - inserted: ' + insertedDistComp + ' dist_components');
        let loggerResultMessage: string = "sage_import_dist_components - import ";
        loggerResultMessage += (insertedDistComp >= allSageDistCompNumber) ? "successful: " : "not complete: ";
        loggerResultMessage += insertedDistComp + " of " + allSageDistCompNumber + " was imported";
        // @ts-ignore
        logger.info(loggerResultMessage);
        // } else {
        //     // console.log("distUpdateArr: ", distUpdateArr);
        //     console.log('TO update distUpdateArr: ', distUpdateArr.length);
        //     let resultsArr = [];
        //     resultsArr.push(distUpdateArr);
        //     // @ts-ignore
        //     await importData.sw_data_import(distCompRefTable, resultsArr[0]);
        //     // @ts-ignore
        //     logger.info('sage_import_dist_components - updated: ' + updatedDistComp + ' dist_components');
        // }
        stopTimeTracking(startTime, "sage_import_dist_components");
    },

    sage_import_new_attributes: async function () {

        // About 2000 items ti import...
        let attributesMode = 'insert';
        let startTime = startTimeTracking(attributesMode ?
            "sage_import_new_attributes UPDATE STARTED..." : "sage_import_new_attributes INSERT STARTED...");

        await removeTableLocksPromiseQuery();

        if (attributesMode === 'insert') {

            // Empty table by deleting table items from given table
            await emptyTablePromiseQuery("ATTRIBUTES", true, true);
            /*
                delete FROM " + constants.DB_TABLE_PREFIX + "[ATTRIBUTES] where ID > 1940;
                DBCC CHECKIDENT ('ATTRIBUTES', RESEED, 1940);
            */
            await emptyTablePromiseQuery("ATTRIBUTE_RELATIONS", false, false);
            await emptyTablePromiseQuery("CROSSSELLING", true, false);
            await emptyTablePromiseQuery("ITEM_BASIS", true, false);
        }

        // @ts-ignore
        let attrToImportArray: [{sage: any, soas: any}] = [
            {sage: "ATTRIBUT7_0", soas: "ATTR_BRAND"},              // 9
            {sage: "ATTRIBUT1_0", soas: "ATTR_CATEGORY_0"},         // 45
            {sage: "ATTRIBUT10_0", soas: "ATTR_CATEGORY_1"},        // 7
            {sage: "ATTRIBUT11_0", soas: "ATTR_GROUP"},             // 1793
            {sage: "ATTRIBUT3_0", soas: "ATTR_COLOR"},              // 68
            {sage: "ATTRIBUT12_0", soas: "ATTR_FEATURE"},           // 14
            {sage: "ATTRIBUT2_0", soas: "ATTR_BASIN_TYPE"}          // 6
        ];

        for(let attrImpItem in attrToImportArray) {

            // console.log("attrToImportArray[attrItem]: ", attrToImportArray[attrImpItem]);
            // console.log("attrToImportArray[attrItem].sage: ", attrToImportArray[attrImpItem].sage);
            // console.log("attrToImportArray[attrItem].soas: ", attrToImportArray[attrImpItem].soas);

            let counter: number = 0;

            // @ts-ignore
            let attrResults = await sgCall.sage_call_get_attribute_by_name(attrToImportArray[attrImpItem].sage);

            console.log('SAGE for "' + attrToImportArray[attrImpItem].sage + '": ', attrResults.length);
            for (let attrItem in attrResults) {
                counter++;
                // Check if attrbutue already exists
                // @ts-ignore
                let checkAvailableQuery = "SELECT ID FROM " + constants.DB_TABLE_PREFIX + "ATTRIBUTES WHERE ATTRIBUTE_NAME = '" +
                    attrToImportArray[attrImpItem].soas + "' AND ATTRIBUTE_DATA = '" +
                    attrResults[attrItem][attrToImportArray[attrImpItem].sage].trim() + "';";
                // console.log("checkAvailableQuery: ", checkAvailableQuery);
                // @ts-ignore
                let attrCheckQueryResult = await msLogic.execOneMSSQLQueryWithPromise(checkAvailableQuery);
                // @ts-ignore
                if (attrCheckQueryResult && !attrCheckQueryResult[0]) {
                    // Not exists: Insert new attribute
                    // ToDo: Check if "ATTR_CATEGORY_0: 'BÃ¼ro'" is correctly imported, after encoding via Buffer
                    let attrDataString: string =
                        Buffer.from(attrResults[attrItem][attrToImportArray[attrImpItem].sage].trim(), 'utf-8')
                            .toString();
                    // @ts-ignore
                    let attrInsertQuery = "INSERT INTO " + constants.DB_TABLE_PREFIX + "ATTRIBUTES (ATTRIBUTE_NAME,ATTRIBUTE_DATA) VALUES ('" +
                        attrToImportArray[attrImpItem].soas + "','" + attrDataString + "')";
                    // console.log("attrInsertQuery: ", attrInsertQuery);
                    // @ts-ignore
                    let attrInsertQueryResult = await msLogic.execOneMSSQLQueryWithPromise(attrInsertQuery);
                } else {
                    // Exists: Update attribute
                    // // @ts-ignore
                    // let attrUpdateQuery = "UPDATE " + constants.DB_TABLE_PREFIX + "ATTRIBUTES SET ATTRIBUTE_DATA = '" +
                    // attrResults[attrItem][attrToImportArray[attrImpItem].sage] + "' WHERE ID = '" +
                    // attrCheckQueryResult[0] +
                    // "' AND ATTRIBUTE_NAME = '" + attrToImportArray[attrImpItem].soas + "';";
                    // // console.log("attrInsertQuery: ", attrInsertQuery);
                    // let attrUpdateQueryResult = await msLogic.execOneMSSQLQueryWithPromise(attrUpdateQuery);
                    console.log('Ignored, because already exists: ',
                        attrResults[attrItem][attrToImportArray[attrImpItem].sage].trim());
                }
                if (counter === 250) {
                    await sleep(1000);
                    counter = 0;
                }
            }
        }

        if (attributesMode === 'insert') {
            // ATTR_SHOP_ACTIVE will be inserted for every article separately, so not insert it...
            let attrInsertActiveFalseQuery =
                "INSERT INTO " + constants.DB_TABLE_PREFIX + "ATTRIBUTES (ATTRIBUTE_NAME,ATTRIBUTE_DATA) VALUES ('ATTR_SHOP_ACTIVE', 0);";
            //@ts-ignore
            let attrInsertActiveFalseQueryResult = await msLogic.execOneMSSQLQueryWithPromise(attrInsertActiveFalseQuery);
            let attrInsertActiveTrueQuery =
                "INSERT INTO " + constants.DB_TABLE_PREFIX + "ATTRIBUTES (ATTRIBUTE_NAME,ATTRIBUTE_DATA) VALUES ('ATTR_SHOP_ACTIVE', 1);";
            //@ts-ignore
            let attrInsertActiveTrueQueryResult = await msLogic.execOneMSSQLQueryWithPromise(attrInsertActiveTrueQuery);

            let attrInsertCraftFalseQuery =
                "INSERT INTO " + constants.DB_TABLE_PREFIX + "ATTRIBUTES (ATTRIBUTE_NAME,ATTRIBUTE_DATA) VALUES ('ATTR_CRAFT', 0);";
            // @ts-ignore
            let attrInsertCraftFalseQueryResult = await msLogic.execOneMSSQLQueryWithPromise(attrInsertCraftFalseQuery);
            // @ts-ignore
            let attrInsertCraftTrueQuery =
                "INSERT INTO " + constants.DB_TABLE_PREFIX + "ATTRIBUTES (ATTRIBUTE_NAME,ATTRIBUTE_DATA) VALUES ('ATTR_CRAFT', 1);";
            // @ts-ignore
            let attrInsertCraftTrueQueryResult = await msLogic.execOneMSSQLQueryWithPromise(attrInsertCraftTrueQuery);
        }
        // @ts-ignore
        await sgCall.sage_close_pool_connections();
        stopTimeTracking(startTime, "sage_import_new_attributes");
    },

    check_new_attributes_colors: async function () {
        // @ts-ignore
        sgLogic.sage_get_colors(async function (colors: any) {
            // console.log('Cron: ', colors);
            for (let cItem in colors) {
                // if (colors[cItem].ATTRIBUT3_0 !== ' ') {
                let checkAvailableQuery =
                    "SELECT ID FROM " + constants.DB_TABLE_PREFIX + "ATTRIBUTES WHERE ATTRIBUTE_NAME = 'ATTR_COLOR' AND ATTRIBUTE_DATA = '" +
                    colors[cItem].ATTRIBUT3_0 + "';";
                // @ts-ignore
                let colorsCheckQueryResult = await msLogic.execOneMSSQLQueryWithPromise(checkAvailableQuery);
                // console.log("colorsCheckQueryResult::: ", colorsCheckQueryResult);
                // @ts-ignore
                // console.log('colorsCheckQueryResult[0]: ', colorsCheckQueryResult[0]);
                // @ts-ignore
                if (colorsCheckQueryResult && !colorsCheckQueryResult[0]) {
                    let colorsInsertQuery = "INSERT INTO " + constants.DB_TABLE_PREFIX + "ATTRIBUTES (ATTRIBUTE_NAME,ATTRIBUTE_DATA) VALUES ('" +
                        'ATTR_COLOR' + "','" + colors[cItem].ATTRIBUT3_0 + "')";
                    // @ts-ignore
                    let colorsInsertQueryResult = await msLogic.execOneMSSQLQueryWithPromise(colorsInsertQuery);
                    // console.log("colorsInsertQueryResult::: ", colorsInsertQueryResult);
                }
                // }
            }
        });
    },
    /**
     * Check if new batches states are available:
     * 1. Check and stop deactivated batches.
     * 2. Check and run activated batches.
     *
     * https://www.gnu.org/software/mcron/manual/html_node/Crontab-file.html
     * Examples:
     * # run every minute:                              *'/1 * * * *
     * # run five minutes after midnight, every day:    5 0 * * *
     * # run at 2:15pm on the first of every month:     15 14 1 * *
     * # run at 10 pm on weekdays:                      0 22 * * 1-5
     *
     */
    check_new_batches: async function () {

        // get all not active batches and check if they still active
        // @ts-ignore
        let notActiveBatches: { [x: string]: string; }[] = await cronLogic.mssql_query_active_batches(cronNotActiveFlag);
        // @ts-ignore
        // logger.info('++++++++++++++++++++++++++++++++++++++++++');
        // logger.info('activeBatchesObj' + activeBatchesObj);
        // @ts-ignore
        // logger.info('Nicht aktive Batches in DB: ' + notActiveBatches.length);
        let activeBatchesObjSize = Object.keys(activeBatchesObj).length;
        // @ts-ignore
        // logger.info('Active batches: ' + activeBatchesObjSize);
        for (let i = 0; i < notActiveBatches.length; i++) {
            for (let key in activeBatchesObj) {
                if (key == notActiveBatches[i]['BATCH_FUNCTION']) {
                    // @ts-ignore // Folgender aktiver Cron Job sollte beendet werden
                    logger.info('The following active cron job will be terminated: ' + key);
                    // @ts-ignore
                    let task = activeBatchesObj[key];
                    console.log('Job-status-before:' + task.getStatus());
                    // stops and destroys the cron job
                    task.stop();
                    task.destroy();
                    // @ts-ignore
                    logger.info('Cron job terminated: ' + key);
                    console.log('Job-status-after:' + task.getStatus());
                    // @ts-ignore
                    delete activeBatchesObj[key];
                    // Cron Job gelöscht aus dem Array mit aktiven Cron Jobs
                    console.log('Cron job deleted from the array with active cron jobs: ' + key);
                    // Neue Anzahl der Active Batches im Object
                    console.log('New number of active batches: ' + Object.keys(activeBatchesObj).length);
                }
            }
        }

        // Activate batches
        let activeBatches: { [x: string]: string | number; }[] = // @ts-ignore
            await cronLogic.mssql_query_active_batches(cronActiveFlag);
        // @ts-ignore
        // logger.info('##########################################');
        // @ts-ignore
        // logger.info('Aktive Batches in DB: ' + activeBatches.length);
        activeBatchesObjSize = Object.keys(activeBatchesObj).length;

        for (let i = 0; i < activeBatches.length; i++) {
            let foundActiveBatch = false;
            for (let key in activeBatchesObj) {
                if (key == activeBatches[i]['BATCH_FUNCTION']) {
                    foundActiveBatch = true;
                }
            }
            // wenn Batch noch nicht aktiviert ist, wir aktivieren es jetzt...
            if (!foundActiveBatch) {
                // @ts-ignore
                logger.info('Add new Batch now as new Cron Job Task: ' + activeBatches[i]['BATCH_NAME']);
                console.log('Description: ' + activeBatches[i]['BATCH_DESCRIPTION']);

                //ToDo: comment out this block, if cron job logic has errors
                // @ts-ignore
                let task = cron.schedule(activeBatches[i]['BATCH_INTERVAL'], async function() {
                    let d = new Date();
                    let n = d.getMinutes();
                    let functionName = activeBatches[i]['BATCH_FUNCTION'];

                            // save last run date to batch processes
                            // @ts-ignore
                            sqlController.batchProcess.mssql_update_batch_last_run(activeBatches[i]['BATCH_NAME'],
                                runResultsArr[0], true, function () {});

                            console.log('Try to start function: ', functionName);

                            switch (functionName) {

                                //TRY TO ALLOCATE - runs every hour (*/1 * * * *)
                                case('soas_hourly_allocation_check'):
                                    // @ts-ignore
                                    logger.info('Execute function ' + functionName + ' --- ' + n);
                                    // @ts-ignore
                                    let bpcaResult: any =
                                        await sqlController.warehouse.soas_hourly_allocation_check();
                                    console.log("bpcaResult: ", bpcaResult);
                                    setBatchLastRunDate(bpcaResult, activeBatches, i);
                                    break;

                                //BOOK INVENTORY - runs once daily, approx 22:30 (30 21 * * *)
                                case('soas_daily_book_inventory'):
                                    // @ts-ignore
                                    logger.info('Execute function ' + functionName + ' --- ' + n);
                                    // @ts-ignore
                                    let binvResult: any =
                                        await sqlController.warehouse.mssql_batch_process_book_inventory();
                                    console.log("binvResult: ", binvResult);
                                    setBatchLastRunDate(binvResult, activeBatches, i);
                                    break;

                                //SAGE daily import
                                case('sage_daily_import'):
                                    // @ts-ignore
                                    logger.info('Execute function ' + functionName + ' --- ' + n);
                                    // ToDo: Do updates for changed tables before run it...
                                    // let sdiResult = module.exports.sage_daily_import();
                                    // setBatchLastRunDate(sdiResult, activeBatches, i);
                                    break;
/*
                                //SAGE import warehousing (STOCK)
                                case('sage_import_new_warehousing'):
                                    // @ts-ignore
                                    logger.info('Execute function ' + functionName + ' --- ' + n);
                                    let whResult = await module.exports.sage_import_new_warehousing();
                                    setBatchLastRunDate(whResult, activeBatches, i);
                                    break;
                                //SAGE import invoices
                                case('sage_import_new_sinvoice'):
                                    // @ts-ignore
                                    logger.info('Execute function ' + functionName + ' --- ' + n);
                                    let siResult = await module.exports.sage_import_new_sinvoice();
                                    setBatchLastRunDate(siResult, activeBatches, i);
                                    break;
                                //SAGE import delivery notes
                                case('sage_import_new_sdelivery'):
                                    // @ts-ignore
                                    logger.info('Execute function ' + functionName + ' --- ' + n);
                                    let sdResult = await module.exports.sage_import_new_sdelivery();
                                    setBatchLastRunDate(sdResult, activeBatches, i);
                                    break;
                                //SAGE import orders
                                case('sage_import_new_sorders'):
                                    // @ts-ignore
                                    logger.info('Execute function ' + functionName + ' --- ' + n);
                                    let soResult = await module.exports.sage_import_new_sorders();
                                    setBatchLastRunDate(soResult, activeBatches, i);
                                    break;
                                //SAGE import articles
                                case('sage_import_new_itmmaster'):
                                    // @ts-ignore
                                    logger.info('Execute function ' + functionName + ' --- ' + n);
                                    let isResult = await module.exports.sage_import_new_itmmaster();
                                    setBatchLastRunDate(isResult, activeBatches, i);
                                    break;
                                //SAGE import attributes
                                case('sage_import_new_attributes'):
                                    // @ts-ignore
                                    logger.info('Execute function ' + functionName + ' --- ' + n);
                                    let atResult = await module.exports.sage_import_new_attributes();
                                    setBatchLastRunDate(atResult, activeBatches, i);
                                    break;
                                //SAGE import dist components (BOMD)
                                case('sage_import_dist_components'):
                                    // @ts-ignore
                                    logger.info('Execute function ' + functionName + ' --- ' + n);
                                    let dcResult = await module.exports.sage_import_dist_components();
                                    setBatchLastRunDate(dcResult, activeBatches, i);
                                    break;
                                //SAGE import prilists
                                case('sage_import_prilists'):
                                    // @ts-ignore
                                    logger.info('Execute function ' + functionName + ' --- ' + n);
                                    let prResult = await module.exports.sage_import_prilists();
                                    setBatchLastRunDate(prResult, activeBatches, i);
                                    break;
                                //SAGE import currencies
                                case('sage_import_currencies'):
                                    // @ts-ignore
                                    logger.info('Execute function ' + functionName + ' --- ' + n);
                                    let crResult = await module.exports.sage_import_currencies();
                                    setBatchLastRunDate(crResult, activeBatches, i);
                                    break;
                                //SAGE new customers check
                                case('sage_import_new_customers'):
                                    // @ts-ignore
                                    logger.info('Execute function ' + functionName + ' --- ' + n);
                                    let cuResult = await module.exports.sage_import_new_customers();
                                    setBatchLastRunDate(cuResult, activeBatches, i);
                                    break;
                                //SAGE new customers check
                                case('sage_import_new_payment_terms'):
                                    // @ts-ignore
                                    logger.info('Execute function ' + functionName + ' --- ' + n);
                                    let ptResult = await module.exports.sage_import_new_payment_terms();
                                    setBatchLastRunDate(ptResult, activeBatches, i);
                                    break;


                                //Shopware new orders check
                                case('shopware_check_new_orders'):
                                    // @ts-ignore
                                    logger.info('Execute function ' + functionName + ' --- ' + n);
                                    module.exports.shopware_check_new_orders(function (result: any) {
                                        setBatchLastRunDate(result, activeBatches, i);
                                    });
                                    break;
                    // save last run date to batch processes
                    // @ts-ignore
                    sqlController.batchProcess.mssql_update_batch_last_run(activeBatches[i]['BATCH_NAME'],
                        runResultsArr[0], true, function () {});

                    console.log('Try to start function: ', functionName);

                    switch (functionName) {

                      
                                                        //SAGE import warehousing (STOCK)
                                                        case('sage_import_new_warehousing'):
                                                            // @ts-ignore
                                                            logger.info('Execute function ' + functionName + ' --- ' + n);
                                                            let whResult = await module.exports.sage_import_new_warehousing();
                                                            setBatchLastRunDate(whResult, activeBatches, i);
                                                            break;
                                                        //SAGE import invoices
                                                        case('sage_import_new_sinvoice'):
                                                            // @ts-ignore
                                                            logger.info('Execute function ' + functionName + ' --- ' + n);
                                                            let siResult = await module.exports.sage_import_new_sinvoice();
                                                            setBatchLastRunDate(siResult, activeBatches, i);
                                                            break;
                                                        //SAGE import delivery notes
                                                        case('sage_import_new_sdelivery'):
                                                            // @ts-ignore
                                                            logger.info('Execute function ' + functionName + ' --- ' + n);
                                                            let sdResult = await module.exports.sage_import_new_sdelivery();
                                                            setBatchLastRunDate(sdResult, activeBatches, i);
                                                            break;
                                                        //SAGE import orders
                                                        case('sage_import_new_sorders'):
                                                            // @ts-ignore
                                                            logger.info('Execute function ' + functionName + ' --- ' + n);
                                                            let soResult = await module.exports.sage_import_new_sorders();
                                                            setBatchLastRunDate(soResult, activeBatches, i);
                                                            break;
                                                        //SAGE import articles
                                                        case('sage_import_new_itmmaster'):
                                                            // @ts-ignore
                                                            logger.info('Execute function ' + functionName + ' --- ' + n);
                                                            let isResult = await module.exports.sage_import_new_itmmaster();
                                                            setBatchLastRunDate(isResult, activeBatches, i);
                                                            break;
                                                        //SAGE import attributes
                                                        case('sage_import_new_attributes'):
                                                            // @ts-ignore
                                                            logger.info('Execute function ' + functionName + ' --- ' + n);
                                                            let atResult = await module.exports.sage_import_new_attributes();
                                                            setBatchLastRunDate(atResult, activeBatches, i);
                                                            break;
                                                        //SAGE import dist components (BOMD)
                                                        case('sage_import_dist_components'):
                                                            // @ts-ignore
                                                            logger.info('Execute function ' + functionName + ' --- ' + n);
                                                            let dcResult = await module.exports.sage_import_dist_components();
                                                            setBatchLastRunDate(dcResult, activeBatches, i);
                                                            break;
                                                        //SAGE import prilists
                                                        case('sage_import_prilists'):
                                                            // @ts-ignore
                                                            logger.info('Execute function ' + functionName + ' --- ' + n);
                                                            let prResult = await module.exports.sage_import_prilists();
                                                            setBatchLastRunDate(prResult, activeBatches, i);
                                                            break;
                                                        //SAGE import currencies
                                                        case('sage_import_currencies'):
                                                            // @ts-ignore
                                                            logger.info('Execute function ' + functionName + ' --- ' + n);
                                                            let crResult = await module.exports.sage_import_currencies();
                                                            setBatchLastRunDate(crResult, activeBatches, i);
                                                            break;
                                                        //SAGE new customers check
                                                        case('sage_import_new_customers'):
                                                            // @ts-ignore
                                                            logger.info('Execute function ' + functionName + ' --- ' + n);
                                                            let cuResult = await module.exports.sage_import_new_customers();
                                                            setBatchLastRunDate(cuResult, activeBatches, i);
                                                            break;
                                                        //SAGE new customers check
                                                        case('sage_import_new_payment_terms'):
                                                            // @ts-ignore
                                                            logger.info('Execute function ' + functionName + ' --- ' + n);
                                                            let ptResult = await module.exports.sage_import_new_payment_terms();
                                                            setBatchLastRunDate(ptResult, activeBatches, i);
                                                            break;


                                                        //Shopware new orders check
                                                        case('shopware_check_new_orders'):
                                                            // @ts-ignore
                                                            logger.info('Execute function ' + functionName + ' --- ' + n);
                                                            module.exports.shopware_check_new_orders(function (result: any) {
                                                                setBatchLastRunDate(result, activeBatches, i);
                                                            });
                                                            break;

                         */
                        case('execute_sql_create_csv_send_mail'):
                            // @ts-ignore
                            logger.info('Execute function ' + functionName + ' --- ' + n);
                            await module.exports.execute_sql_create_csv_send_mail(activeBatches[i]['BATCH_CODE'],
                                function (result: any) {
                                    // save last run date to batchprocesses
                                    setBatchLastRunDate(result, activeBatches, i);
                                });
                            break;
                        case('execute_sql'):
                            //ToDo:
                            // 1. Execute given sql query
                            break;
                        default:
                            // @ts-ignore
                            logger.error(new Error('Function NOT FOUND: '+ functionName));
                            break;
                    }
                });

                // @ts-ignore
                // logger.info('Job-Status-run: ' + task.getStatus());

                // push cron job to object array
                // @ts-ignore
                activeBatchesObj[activeBatches[i]['BATCH_FUNCTION']] = task;
                // @ts-ignore
                console.log('Active batches: ' + Object.keys(activeBatchesObj).length +
                    ' - Starts at Interval: ' + activeBatches[i]['BATCH_INTERVAL'] + ' ');
            } else {
                // @ts-ignore
                console.log('Batch is already active: ' + activeBatches[i]['BATCH_NAME'] +
                    ' - Starts at interval: ' + activeBatches[i]['BATCH_INTERVAL'] + ' ');
                // for (let key in activeBatchesObj) {
                //     if (key == activeBatches[i]['BATCH_FUNCTION']) {
                //         foundActiveBatch = true;
                //
                //     }
                // }
                // @ts-ignore
                // logger.info('Job-Status-run: ' + activeBatchesObj[activeBatches[i]['BATCH_FUNCTION']].getStatus());
            }
        }
    },


    /**
     * import/update customers
     *
     * @param customersUpdateMode
     * @param startNumber
     * @param stepNumber
     */
    sage_import_new_customers: async function (customersUpdateMode: boolean, startNumber: number, stepNumber: number) {
        // customersRowsNumber: number) { //

        let insertedCustomers: number = 0;
        let insertedCustomersAddr: number = 0;
        let updatedCustomers: number = 0;
        let updatedCustomersAddr: number = 0;
        let allSageCustomersNumber: number = 0;

        let custRefTable: string = "CUSTOMERS";
        let custAddrRefTable: string = "CUSTOMERS_ADDRESSES";


        let startTime = startTimeTracking( customersUpdateMode ?
            "sage_import_new_customers UPDATE STARTED..." : "sage_import_new_customers INSERT STARTED...");

        if(!customersUpdateMode) {
            await emptyTablePromiseQuery(custRefTable, false, true);
            await emptyTablePromiseQuery(custAddrRefTable, true, false);
            // stepNumber = 500000; // All items
            // startNumber = 0;
        } else {
            await removeTableLocksPromiseQuery();
            // startNumber = 365000; //300000; //367350; //361500;
            // stepNumber = 30000;//100000; // 17 min 31 sek (1000 => 2 min)
        }
        let customerB2CTemplate = 'SOASCUSB2C00000';
        let customerB2BTemplate = 'SOASCUSB2B00000';
        let lastCustomerNumberQuery: string = "SELECT CUSTOMERS_NUMBER FROM " + constants.DB_TABLE_PREFIX + "CUSTOMERS " +
            "WHERE CUSTOMERS_NUMBER != '" + customerB2CTemplate + "' " +
            "AND CUSTOMERS_NUMBER != '" + customerB2BTemplate + "' " +
            "ORDER BY CUSTOMERS_NUMBER DESC;";

        // @ts-ignore
        let lastCustomerNumber = await msLogic.execOneMSSQLQueryWithPromise(lastCustomerNumberQuery);
        if (lastCustomerNumber[0] && lastCustomerNumber[0]['CUSTOMERS_NUMBER']) {
            lastCustomerNumber = lastCustomerNumber[0]['CUSTOMERS_NUMBER'];
        } else {
            lastCustomerNumber = undefined;
        }
        console.log('cron_sage_check_new_customers1: ', lastCustomerNumber);

        let lastCustomersAddressesId = await getLastCustomersAddresses();
        console.log('lastCustomersAddressesId: ', lastCustomersAddressesId);

        // @ts-ignore
        let allCustomers = await msLogic.execOneMSSQLQueryWithPromise("SELECT * FROM " + constants.DB_TABLE_PREFIX + "CUSTOMERS;");
        // console.log('allCustomers: ', allCustomers);

        // @ts-ignore
        let languages = await msLogic.execOneMSSQLQueryWithPromise("SELECT * FROM " + constants.DB_TABLE_PREFIX + "LANGUAGES;");
        // console.log('languages: ', languages); // [{LANGUAGE_CODE: ...}]

        let custImportTemplate: any = await getImportTemplate(custRefTable);
        let custAddrPositionsImportTemplate: any = await getImportTemplate(custAddrRefTable);

        // @ts-ignore
        let allSoasPrilists = await msLogic.execOneMSSQLQueryWithPromise("SELECT * FROM " + constants.DB_TABLE_PREFIX + "PRILISTS;");
        console.log('allSoasPrilists.length: ', allSoasPrilists.length);

        // @ts-ignore
        let allSagePrilists = await sgCall.sage_call_get_all_prilists_for_import(0, 200000);
        console.log('allSagePrilists.length: ', allSagePrilists.length);

        let pushedCustomersCounter: number = 0;
        let detectedCustomersCounter: number = 0;
        let duplicatedCustomersCounter: number = 0;

        if (allSoasPrilists.length === allSagePrilists.length) {

            let allSoasPrilistsByCusGrp: any [] = [];
            for (let allPrlCounter = 0; allPrlCounter < allSoasPrilists.length; allPrlCounter++) {
                if (!allSoasPrilistsByCusGrp[allSoasPrilists[allPrlCounter].CUSGRP.trim()]) {
                    allSoasPrilistsByCusGrp[allSoasPrilists[allPrlCounter].CUSGRP.trim()] = [];
                }
                allSoasPrilistsByCusGrp[allSoasPrilists[allPrlCounter].CUSGRP.trim()].push(allSoasPrilists[allPrlCounter]);
            }

            // @ts-ignore
            let resultNewCustomers = await sgCall.sage_call_get_new_customers_promise(startNumber, stepNumber);
            allSageCustomersNumber = resultNewCustomers.length;
            console.log("Found " + allSageCustomersNumber + " Sage customers items...");

            // @ts-ignore
            await sgCall.sage_close_pool_connections();

            let resultArray: never[] | any[][];

            let stepCounter = 0;
            let maxStepNumber = 400; //850; // MAX 2100 ( bei 800000 / 1600 = 500 iterations => 1 iteration je 2 min. => 16 std.)
            let stepResultsNewCUSTOMERS: [] = [];

            // Variables for detecting customer change at iteration
            let customerNumberChangeDetected: boolean = false;
            let lastDetectedCustomerNumber: string;
            let currentCustomerNumber: string;

            for (let allCustomerCounter = 0; allCustomerCounter < resultNewCustomers.length; allCustomerCounter++) {

                currentCustomerNumber = resultNewCustomers[allCustomerCounter].BPCNUM_0.trim();
                currentCustomerNumber = currentCustomerNumber.toString();

                // @ts-ignore
                lastDetectedCustomerNumber = !lastDetectedCustomerNumber ? currentCustomerNumber : lastDetectedCustomerNumber;

                if (currentCustomerNumber !== lastDetectedCustomerNumber) {
                    lastDetectedCustomerNumber = currentCustomerNumber;
                    customerNumberChangeDetected = true;
                }

                if ((stepCounter <= maxStepNumber) || !customerNumberChangeDetected) {
                    customerNumberChangeDetected = false; // reset, because max step number must be reached first
                    // @ts-ignore
                    stepResultsNewCUSTOMERS.push(resultNewCustomers[allCustomerCounter]);
                    pushedCustomersCounter++;
                    stepCounter++;
                }
                // console.log('stepCounter: ' + stepCounter + ' :::  allCustomerCounter: ' + allCustomerCounter );
                // console.log("allOrderCounter: " + allOrderCounter + " resultNewSORDER.length: "+ resultNewSORDER.length);

                // if customer number has changed or if last item
                if (customerNumberChangeDetected || (allCustomerCounter === resultNewCustomers.length - 1)) {
                    if (customerNumberChangeDetected) {
                        allCustomerCounter--; // step back
                        customerNumberChangeDetected = false;
                        stepCounter = 0;
                    }

                    // console.log('WRITE INTO SOAS: ', stepResultsNewSORDER);
                    // console.log('WRITE SET - allCustomerCounter: ', allCustomerCounter);
                    // console.log('startNumber: ', startNumber);

                    // @ts-ignore
                    let newCustomersData = sgLogic.sage_add_new_customers(stepResultsNewCUSTOMERS, lastCustomerNumber, lastCustomersAddressesId, allCustomers, languages, allSoasPrilistsByCusGrp, resultArray, detectedCustomersCounter, duplicatedCustomersCounter);
                    resultArray = newCustomersData.resultArray;
                    detectedCustomersCounter = newCustomersData.detectedCustomersCounter;
                    duplicatedCustomersCounter = newCustomersData.duplicatedCustomersCounter;
                    startNumber = startNumber + stepNumber;

                    // @ts-ignore
                    if (resultArray) {
                        if (!customersUpdateMode) {
                            insertedCustomers += resultArray[0].length;
                            insertedCustomersAddr += resultArray[1].length;
                            let custQueryToInsert: string = getQueryToInsert(custRefTable, custImportTemplate, resultArray[0]);
                            // @ts-ignore
                            await msLogic.execOneMSSQLQueryWithPromise(custQueryToInsert);
                            let custAddrQueryToInsert: string = getQueryToInsert(custAddrRefTable, custAddrPositionsImportTemplate, resultArray[1]);
                            // @ts-ignore
                            await msLogic.execOneMSSQLQueryWithPromise(custAddrQueryToInsert);
                        } else {
                            // @ts-ignore
                            await importData.sw_data_import('CUSTOMERS', resultArray[0]);
                            // @ts-ignore
                            await importData.sw_data_import('CUSTOMERS_ADDRESSES', resultArray[1]);
                        }
                        // console.log('check for new customers finished...');
                    }
                    // await sleep(1000);
                    // @ts-ignore
                    resultArray = undefined;
                    stepResultsNewCUSTOMERS = [];
                }
            }
        } else {
            // @ts-ignore
            await sgCall.sage_close_pool_connections();
            let errorText = "Error: Prilist number is wrong => Soas: " + allSoasPrilists.length + " vs. Sage: " +  allSagePrilists.length + ". Please update prilists first...";
            console.log(errorText);
            // @ts-ignore
            logger.error(new Error(errorText));
        }
        console.log("pushedCustomersCounter: ", pushedCustomersCounter);
        console.log("detectedCustomersCounter: " + detectedCustomersCounter  + " vs. duplicatedCustomersCounter: " + duplicatedCustomersCounter + " = " + (detectedCustomersCounter + duplicatedCustomersCounter));
        // @ts-ignore
        logger.info('sage_import_new_customers - inserted: ' + insertedCustomers + ' customers (detected: ' + detectedCustomersCounter + ') and ' + insertedCustomersAddr + ' customers addresses');
        if (insertedCustomersAddr >= allSageCustomersNumber) {
            // @ts-ignore
            logger.info('sage_import_new_customers - import successful: ' + insertedCustomersAddr + ' of ' + allSageCustomersNumber + ' was imported');
        } else {
            // @ts-ignore
            logger.info('sage_import_new_customers - import not complete: ' + insertedCustomersAddr + ' of ' + allSageCustomersNumber + ' was imported');
        }
        stopTimeTracking(startTime, "sage_import_new_customers");
    },

    /**
     * Import Articles from SAGE ( from table 'EMOPILOT.ITMMASTER') into SOAS DB ( into Table 'ITEM_BASIS' )
     *
     * 1. Get all articles from SOAS > ITEM_BASIS (for duplicates check)
     * 2. Get all attributes from SOAS > ATTRIBUTES (for detection of attribute ID)
     * 3. Get all articles from SAGE > ITMMASTER
     * 4. Compare SAGE and SOAS entries to detect of already available items and then to do insert or update
     * 5. Get article data for insert/update SOAS > ITEM_BASIS
     * 6. Get Crossselling data (queries for insert)
     * 7. Get Attributes data
     * 8. Import articles data
     * 9. Import crossselling data
     * 10. Import attributes data
     *
     * @param callback
     */
    sage_import_new_itmmaster: async function (updateFlag: boolean, itmRowsNumber: number) {

        let startTime = startTimeTracking( updateFlag ? "sage_import_new_itmmaster UPDATE STARTED..." : "sage_import_new_itmmaster INSERT STARTED...");

        // if (!updateFlag) {
        //     await emptyTablePromiseQuery("ATTRIBUTE_RELATIONS", false, true);
        //     await emptyTablePromiseQuery("CROSSSELLING", true, false);
        //     await emptyTablePromiseQuery("ITEM_BASIS", true, false);
        // }
        // await removeTableLocksPromiseQuery();

        // @ts-ignore
        let allAttributes = await sqlController.attributes.mssql_select_Attributes(); // get all attributes from SOAS DB
        console.log("SOAS ATTRIBUTES: ", allAttributes.length);
        // let soasAllAttributes: any [] = [];
        // for (let allAttrCounter = 0; allAttrCounter < allAttributes.length; allAttrCounter++) {
        //     if (!soasAllAttributes[allAttributes[allAttrCounter].CUSTOMERS_NUMBER.trim()]) {
        //         soasAllAttributes[allAttributes[allAttrCounter].CUSTOMERS_NUMBER.trim()] = [];
        //     }
        //     soasAllAttributes[allAttributes[allAttrCounter].CUSTOMERS_NUMBER.trim()].push(allAttributes[allAttrCounter]);
        // }

        // @ts-ignore
        let resultNewITMMASTER = await sgCall.sage_call_get_new_itmmaster(itmRowsNumber);
        // console.log("resultNewITMMASTER: ", resultNewITMMASTER);
        // @ts-ignore
        await sgCall.sage_close_pool_connections();
        console.log("Found " + resultNewITMMASTER.length + " Sage itm_master items...");
        // @ts-ignore
        logger.info('sage_import_new_itmmaster - resultNewITMMASTER length: ' + resultNewITMMASTER.length);

        // @ts-ignore
        let resultData = await sgLogic.sage_add_new_itm_master(resultNewITMMASTER, allAttributes, updateFlag);

        if (resultData) {

            console.log("Insert finished..."); // 0:12:27, mit attr 0:22:1 => 24 minuten
            console.log("Inserted ITEM_BASIS: ", resultData.insertedItemBasis);
            console.log("Inserted CROSSSELLING: ", resultData.insertedCrossselling);
            console.log("Inserted ATTRIBUTES: ", resultData.insertedAttributes);

            console.log("Updated ITEM_BASIS: ", resultData.updatedItemBasis);
            console.log("Updated CROSSSELLING: ", resultData.updatedCrossselling);
            console.log("Updated ATTRIBUTES: ", resultData.updatedAttributes);

            if (resultNewITMMASTER.length === resultData.insertedItemBasis) {
                console.log("All SAGE items successfully inserted.");
            }

        } else {
            console.log('resultData is empty... Start number is too high...');
            // @ts-ignore
            logger.info('resultData is empty... Start number is too high...');
        }

        stopTimeTracking(startTime, 'sage_import_new_itmmaster');
    },

    /**
     * Get new orders data from sage. insert (all soas orders will be deleted!) or update existing ones.
     *
     * @param sordersUpdateMode - if true only update fields, otherwise delete all soas orders and insert ones from sage
     * @param startNumber
     * @param stepNumber
     */
    sage_import_new_sorders: async function (sordersUpdateMode: boolean, startNumber: number, stepNumber: number) {

        // let startNumber: number = 0;
        // // Full import: get all sage sorders and postions items: over 800000
        // let stepNumber: number = 1000000;

        let startTime = startTimeTracking('sage_import_new_sorders STARTED... ' +
            (sordersUpdateMode ? 'UPDATE' : 'INSERT') + " - startNumber: " + startNumber + " - stepNumber: " + stepNumber);

        if (!sordersUpdateMode) {
            await emptyTablePromiseQuery("ORDERS", false, true);
            await emptyTablePromiseQuery("ORDERS_POSITIONS", true, false);
        } else {
            await removeTableLocksPromiseQuery();
            // startNumber = 886000; //820000; // 840000
            // stepNumber = 30000; // 10000;
        }

        let lastOrderNumber = await getLastOrderNumberFromSoas();
        console.log('lastOrderNumber: ', lastOrderNumber);
        let lastCustomersAddressesId = await getLastCustomersAddresses();
        console.log('lastCustomersAddressesId: ', lastCustomersAddressesId);
        let soasAllOrders = await getAllFromSOAS('ORDERS');
        let soasAllOrdersPositions = await getAllFromSOAS('ORDERS_POSITIONS');
        let soasStates = await getStatesFromSOAS();
        let soasAllCurrencies = await getAllFromSOAS('CURRENCIES');
        // @ts-ignore
        let allCustomers = await msLogic.execOneMSSQLQueryWithPromise("SELECT * from " + constants.DB_TABLE_PREFIX + "CUSTOMERS;");
        console.log("ALL CUSTOMERS: ", allCustomers.length);
        let soasAllCustomers: any [] = [];
        for (let allCusCounter = 0; allCusCounter < allCustomers.length; allCusCounter++) {
            if (!soasAllCustomers[allCustomers[allCusCounter].CUSTOMERS_NUMBER.trim()]) {
                soasAllCustomers[allCustomers[allCusCounter].CUSTOMERS_NUMBER.trim()] = [];
            }
            soasAllCustomers[allCustomers[allCusCounter].CUSTOMERS_NUMBER.trim()].push(allCustomers[allCusCounter]);
        }
        if (allCustomers.length === Object.keys(soasAllCustomers).length) {
            // @ts-ignore
            let allCustomersPositions = await msLogic.execOneMSSQLQueryWithPromise("SELECT * from " + constants.DB_TABLE_PREFIX + "CUSTOMERS_ADDRESSES;");
            console.log("ALL CUSTOMERS_ADDRESSES: ", allCustomersPositions.length);
            let soasAllCustomersAddresses: any [] = [];
            for (let allCusPosCounter = 0; allCusPosCounter < allCustomersPositions.length; allCusPosCounter++) {
                if (!soasAllCustomersAddresses[allCustomersPositions[allCusPosCounter].CUSTOMERS_NUMBER.trim()]) {
                    soasAllCustomersAddresses[allCustomersPositions[allCusPosCounter].CUSTOMERS_NUMBER.trim()] = [];
                }
                soasAllCustomersAddresses[allCustomersPositions[allCusPosCounter].CUSTOMERS_NUMBER.trim()].push(allCustomersPositions[allCusPosCounter]);
            }

            let soasAllPaymentTerms = await getAllFromSOAS('PAYMENT_TERMS');

            let ordersRefTable: string = "ORDERS";
            let ordersImportTemplate: any = await getImportTemplate(ordersRefTable);
            let ordersPositionsRefTable: string = "ORDERS_POSITIONS";
            let ordersPositionsImportTemplate: any = await getImportTemplate(ordersPositionsRefTable);

            if (ordersImportTemplate && ordersImportTemplate.REF_TABLE && ordersPositionsImportTemplate && ordersPositionsImportTemplate.REF_TABLE) {

                // @ts-ignore
                let resultNewSORDER = await sgCall.sage_call_get_new_sorder_promise(startNumber, stepNumber); // over 800000

                // @ts-ignore
                await sgCall.sage_close_pool_connections();

                console.log('SAGE sorders length: ', resultNewSORDER.length);
                // @ts-ignore
                logger.info('sage_import_new_sorders - SAGE sorders length: ' + resultNewSORDER.length);

                let resultArray: undefined | never[] | any[][];
                let stepCounter = 0;
                let maxStepNumber = 400; // MAX 2100 ( bei 800000 / 1600 = 500 iterations => 1 iteration je 2 min. => 16 std.)
                if (stepNumber < maxStepNumber) {
                    maxStepNumber = stepNumber;
                }
                let stepResultsNewSORDER: [] = [];

                // Variables for detecting order change at iteration
                let orderNumberChangeDetected: boolean = false;
                let lastDetectedOrderNumber: string;
                let currentOrderNumber: string;

                for (let allOrderCounter = 0; allOrderCounter < resultNewSORDER.length; allOrderCounter++) {

                    currentOrderNumber = resultNewSORDER[allOrderCounter].SOHNUM_0.trim();
                    // @ts-ignore
                    lastDetectedOrderNumber = !lastDetectedOrderNumber ? currentOrderNumber : lastDetectedOrderNumber;

                    if (currentOrderNumber !== lastDetectedOrderNumber) {
                        lastDetectedOrderNumber = currentOrderNumber;
                        orderNumberChangeDetected = true;
                    }

                    if ((stepCounter <= maxStepNumber) || !orderNumberChangeDetected) {
                        orderNumberChangeDetected = false; // reset, because max step number must be reached first
                        // @ts-ignore
                        stepResultsNewSORDER.push(resultNewSORDER[allOrderCounter]);
                        stepCounter++;
                    }

                    // console.log("allOrderCounter: " + allOrderCounter + " resultNewSORDER.length: "+ resultNewSORDER.length);

                    // if order number has changed or if last item
                    if (orderNumberChangeDetected || (allOrderCounter === resultNewSORDER.length - 1)) {

                        if (orderNumberChangeDetected) {
                            allOrderCounter--; // step back
                            orderNumberChangeDetected = false;
                            stepCounter = 0;
                        }

                        // console.log('WRITE INTO SOAS: ', stepResultsNewSORDER);
                        // console.log('WRITE SET - allOrderCounter: ', allOrderCounter);
                        // console.log('startNumber: ', startNumber);

                        // @ts-ignore
                        let newOrdersData = sgLogic.sage_add_new_sorders(stepResultsNewSORDER, lastOrderNumber,
                            lastCustomersAddressesId, soasAllOrders, soasAllOrdersPositions, soasStates, soasAllCustomers,
                            soasAllCustomersAddresses, soasAllCurrencies, soasAllPaymentTerms, sordersUpdateMode, resultArray);
                        // if (newOrdersData) {
                        //     console.log('newOrdersData.length: ', newOrdersData.length);
                        //     console.log('newOrdersData[0].length: ', newOrdersData[0].length);
                        //     console.log('newOrdersData[0].length: ', newOrdersData[1].length);
                        // } else {
                        //     console.log('newOrdersData is empty...');
                        // }
                        // console.log("newOrdersData: ", newOrdersData);

                        resultArray = newOrdersData;
                        startNumber = startNumber + stepNumber;

                        // @ts-ignore
                        if (resultArray) {
                            // // @ts-ignore
                            // console.log('resultArray.length: ', resultArray.length);
                            // // @ts-ignore
                            // console.log('resultArray[0].length: ', resultArray[0].length);
                            // // @ts-ignore
                            // console.log('resultArray[1].length: ', resultArray[1].length);
                        } else {
                            console.log('resultArray is empty...');
                        }

                        // @ts-ignore
                        if (resultArray) {
                            // ToDo: If insert mode, build insert queries and import direct without checks
                            if (!sordersUpdateMode) {
                                let orderQueryToInsert: string = getQueryToInsert(ordersRefTable, ordersImportTemplate, resultArray[0]);
                                // @ts-ignore
                                await msLogic.execOneMSSQLQueryWithPromise(orderQueryToInsert);
                                let orderPositionsQueryToInsert: string = getQueryToInsert(ordersPositionsRefTable, ordersPositionsImportTemplate, resultArray[1]);
                                // @ts-ignore
                                await msLogic.execOneMSSQLQueryWithPromise(orderPositionsQueryToInsert);

                            } else {
                                // ToDo: Else, if update mode use elastic import...
                                // @ts-ignore
                                await importData.sw_data_import('ORDERS', resultArray[0]);
                                // @ts-ignore
                                await importData.sw_data_import('ORDERS_POSITIONS', resultArray[1]);
                            }
                            // @ts-ignore
                            // console.log('check for new orders finished...');
                        }
                        // @ts-ignore
                        resultArray = undefined;
                        stepResultsNewSORDER = [];
                    }
                }
                // @ts-ignore
                await mssqlCall.soas_close_pool_connections();
            } else {
                console.log('importTemplates (order, orderPositions) error...');
            }
        } else {
            console.log('soasAllCustomers length error... Some customer numbers are skipped...');
        }
        stopTimeTracking(startTime, 'sage_import_new_sorders');
    },

    /**
     *
     * @param sdeliveryUpdateMode
     * @param startNumber
     * @param stepNumber
     */
    sage_import_new_sdelivery: async function (sdeliveryUpdateMode: boolean, startNumber: number, stepNumber: number) {

        // ToDo: Add RELEASE value. For Positions:  DELIVERY_QTY value

        let dlvRefTable: string = "DELIVERY_NOTES";
        let dlvPositionsRefTable: string = "DELIVERY_NOTES_POSITIONS";

        // let startNumber: number = 0;
        // let stepNumber: number = 1000000;
        // if (sdeliveryUpdateMode) {
        //     startNumber = 870000;
        //     stepNumber = 30000;
        // }

        let startTime = startTimeTracking('sage_import_new_sdelivery STARTED... ' + (sdeliveryUpdateMode ? 'UPDATE' : 'INSERT') + " - startNumber: " + startNumber + " - stepNumber: " + stepNumber);

        if (!sdeliveryUpdateMode) {
            await emptyTablePromiseQuery(dlvRefTable, false, true);
            await emptyTablePromiseQuery(dlvPositionsRefTable, true, false);
        } else {
            await removeTableLocksPromiseQuery();
        }

        let lastDeliveryNotesNumber = await getLastDeliveryNotesFromSoas();
        console.log('lastDeliveryNotesNumber: ', lastDeliveryNotesNumber);
        let soasAllDeliveryNotes = await getAllFromSOAS('DELIVERY_NOTES');
        let soasStates = await getStatesFromSOAS();
        let soasAllCurrencies = await getAllFromSOAS('CURRENCIES');

        // @ts-ignore
        let allOrdersPositions = await msLogic.execOneMSSQLQueryWithPromise("SELECT * FROM " + constants.DB_TABLE_PREFIX + "ORDERS_POSITIONS;");
        console.log("ALL ORDERS_POSITIONS: ", allOrdersPositions.length);
        let allOrdersPositionsByOrdnum: any [] = [];
        for (let allORDCounter = 0; allORDCounter < allOrdersPositions.length; allORDCounter++) {
            if (!allOrdersPositionsByOrdnum[allOrdersPositions[allORDCounter].ORDERS_NUMBER.trim()]) {
                allOrdersPositionsByOrdnum[allOrdersPositions[allORDCounter].ORDERS_NUMBER.trim()] = [];
            }
            allOrdersPositionsByOrdnum[allOrdersPositions[allORDCounter].ORDERS_NUMBER.trim()].push(allOrdersPositions[allORDCounter]);
        }

        let dlvImportTemplate: any = await getImportTemplate(dlvRefTable);
        let dlvPositionsImportTemplate: any = await getImportTemplate(dlvPositionsRefTable);

        // @ts-ignore
        let resultNewSDELIVERY = await sgCall.sage_call_get_new_sdelivery(startNumber, stepNumber);
        // @ts-ignore
        await sgCall.sage_close_pool_connections();

        console.log('resultNewSDELIVERY length: ', resultNewSDELIVERY.length);
        // @ts-ignore
        logger.info('sage_import_new_sdelivery - resultNewSDELIVERY length: ' + resultNewSDELIVERY.length);

        let resultArray: undefined | never[] | any[][];
        let stepCounter = 0;
        let maxStepNumber = 400; // MAX 2100 ( bei 800000 / 1600 = 500 iterations => 1 iteration)
        if (stepNumber < maxStepNumber) {
            maxStepNumber = stepNumber;
        }
        let stepResultsNewSDELIVERY: [] = [];

        // Variables for detecting order change at iteration
        let dNNumberChangeDetected: boolean = false;
        let lastDetectedDNNumber: string;
        let currentDNNumber: string;

        for (let allDNCounter = 0; allDNCounter < resultNewSDELIVERY.length; allDNCounter++) {
            currentDNNumber = resultNewSDELIVERY[allDNCounter].SDHNUM_0.trim();
            // @ts-ignore
            lastDetectedDNNumber = !lastDetectedDNNumber ? currentDNNumber : lastDetectedDNNumber;
            if (currentDNNumber !== lastDetectedDNNumber) {
                lastDetectedDNNumber = currentDNNumber;
                dNNumberChangeDetected = true;
            }
            if ((stepCounter <= maxStepNumber) || !dNNumberChangeDetected) {
                dNNumberChangeDetected = false; // reset, because max step number must be reached first
                // @ts-ignore
                stepResultsNewSDELIVERY.push(resultNewSDELIVERY[allDNCounter]);
                stepCounter++;
            }
            // if dn number has changed or if last item
            if (dNNumberChangeDetected || (allDNCounter === resultNewSDELIVERY.length - 1)) {
                if (dNNumberChangeDetected) {
                    allDNCounter--; // step back
                    dNNumberChangeDetected = false;
                    stepCounter = 0;
                }
                // console.log('WRITE SET - allDNCounter: ', allDNCounter);
                // @ts-ignore
                let newDeliveryNotesData = sgLogic.sage_add_new_sdelivery(stepResultsNewSDELIVERY,
                    lastDeliveryNotesNumber, soasAllDeliveryNotes, soasStates, soasAllCurrencies, sdeliveryUpdateMode,
                    resultArray, allOrdersPositionsByOrdnum);
                // console.log('newDeliveryNotesData', newDeliveryNotesData);
                resultArray = newDeliveryNotesData;
                startNumber = startNumber + stepNumber;
                // @ts-ignore
                if (resultArray) {
                    // // @ts-ignore
                    // console.log('resultArray.length: ', resultArray.length);
                    // // @ts-ignore
                    // console.log('resultArray[0].length: ', resultArray[0].length);
                    // // @ts-ignore
                    // console.log('resultArray[1].length: ', resultArray[1].length);
                } else {
                    console.log('resultArray is empty...');
                }
                // @ts-ignore
                if (resultArray) {
                    if (!sdeliveryUpdateMode) {
                        let dlvQueryToInsert: string = getQueryToInsert(dlvRefTable, dlvImportTemplate, resultArray[0]);
                        // @ts-ignore
                        await msLogic.execOneMSSQLQueryWithPromise(dlvQueryToInsert);
                        let dlvPositionsQueryToInsert: string = getQueryToInsert(dlvPositionsRefTable, dlvPositionsImportTemplate, resultArray[1]);
                        // @ts-ignore
                        await msLogic.execOneMSSQLQueryWithPromise(dlvPositionsQueryToInsert);
                    } else {
                        // @ts-ignore
                        await importData.sw_data_import(dlvRefTable, resultArray[0]);
                        // @ts-ignore
                        await importData.sw_data_import(dlvPositionsRefTable, resultArray[1]);
                    }
                    // @ts-ignore
                    // logger.info('check for new delivery notes finished...');
                }
                // @ts-ignore
                resultArray = undefined;
                stepResultsNewSDELIVERY = [];
            }
        }
        // @ts-ignore
        await mssqlCall.soas_close_pool_connections();

        // ToDo: Update Positions and set [ORDERS_POSITIONS_ID]

        stopTimeTracking(startTime, 'sage_import_new_sdelivery');
    },

    sage_import_new_sinvoice: async function (sinvoiceUpdateMode: boolean, startNumber: number, stepNumber: number) {

        // ToDo: Add ... values. For Positions: ... values

        let invRefTable: string = "INVOICES";
        let invPositionsRefTable: string = "INVOICES_POSITIONS";

        // let startNumber: number = 0;
        // let stepNumber: number = 1000000;
        // if (sinvoiceUpdateMode) {
        //     startNumber = 690000; // 682000
        //     stepNumber = 30000; // 10000;
        // }

        let startTime = startTimeTracking('sage_import_new_sinvoice STARTED... ' +
            (sinvoiceUpdateMode ? 'UPDATE' : 'INSERT') + " - startNumber: " + startNumber + " - stepNumber: " + stepNumber);

        if (!sinvoiceUpdateMode) {
            await emptyTablePromiseQuery(invRefTable, false, true);
            await emptyTablePromiseQuery(invPositionsRefTable, true, false);
        } else {
            await removeTableLocksPromiseQuery();
        }

        let lastInvoiceNumber = await getLastInvoicesNumberFromSoas();
        console.log('lastInvoiceNumber: ', lastInvoiceNumber);
        let soasAllInvoices = await getAllInvoicesFromSoas();
        let soasStates = await getStatesFromSOAS();
        let soasAllCurrencies = await getAllFromSOAS('CURRENCIES');

        // @ts-ignore
        let allDLVNPositions = await msLogic.execOneMSSQLQueryWithPromise("SELECT * FROM " + constants.DB_TABLE_PREFIX + "DELIVERY_NOTES_POSITIONS;");
        console.log("ALL DLVN_POSITIONS: ", allDLVNPositions.length);
        let allDLVNPositionsByDlvnum: any [] = [];
        for (let allDLVCounter = 0; allDLVCounter < allDLVNPositions.length; allDLVCounter++) {
            if (!allDLVNPositionsByDlvnum[allDLVNPositions[allDLVCounter].DELIVERY_NOTES_NUMBER.trim()]) {
                allDLVNPositionsByDlvnum[allDLVNPositions[allDLVCounter].DELIVERY_NOTES_NUMBER.trim()] = [];
            }
            allDLVNPositionsByDlvnum[allDLVNPositions[allDLVCounter].DELIVERY_NOTES_NUMBER.trim()].push(allDLVNPositions[allDLVCounter]);
        }

        let invImportTemplate: any = await getImportTemplate(invRefTable);
        let invPositionsImportTemplate: any = await getImportTemplate(invPositionsRefTable);

        // @ts-ignore
        let resultNewSINVOICE = await sgCall.sage_call_get_new_sinvoice(startNumber, stepNumber);
        // @ts-ignore
        await sgCall.sage_close_pool_connections();

        console.log('resultNewSINVOICE length: ', resultNewSINVOICE.length);
        // @ts-ignore
        logger.info('sage_import_new_sinvoice - resultNewSINVOICE length: ' + resultNewSINVOICE.length);

        let resultArray: undefined | never[] | any[][];

        let stepCounter = 0;
        let maxStepNumber = 400; // MAX 2100 ( bei 800000 / 1600 = 500 iterations => 1 iteration)
        if (stepNumber < maxStepNumber) {
            maxStepNumber = stepNumber;
        }
        let stepResultsNewSINVOICE: [] = [];

        // Variables for detecting order change at iteration
        let invNumberChangeDetected: boolean = false;
        let lastDetectedINVNumber: string;
        let currentINVNumber: string;

        for (let allINVCounter = 0; allINVCounter < resultNewSINVOICE.length; allINVCounter++) {
            currentINVNumber = resultNewSINVOICE[allINVCounter].NUM_0.trim();
            // @ts-ignore
            lastDetectedINVNumber = !lastDetectedINVNumber ? currentINVNumber : lastDetectedINVNumber;
            if (currentINVNumber !== lastDetectedINVNumber) {
                lastDetectedINVNumber = currentINVNumber;
                invNumberChangeDetected = true;
            }
            if ((stepCounter <= maxStepNumber) || !invNumberChangeDetected) {
                invNumberChangeDetected = false; // reset, because max step number must be reached first
                // @ts-ignore
                stepResultsNewSINVOICE.push(resultNewSINVOICE[allINVCounter]);
                stepCounter++;
            }
            // if dn number has changed or if last item
            if (invNumberChangeDetected || (allINVCounter === resultNewSINVOICE.length - 1)) {
                if (invNumberChangeDetected) {
                    allINVCounter--; // step back
                    invNumberChangeDetected = false;
                    stepCounter = 0;
                }
                // console.log('WRITE SET - allINVCounter: ', allINVCounter);

                // @ts-ignore
                let newInvoicesData = sgLogic.sage_add_new_sinvoice(stepResultsNewSINVOICE, lastInvoiceNumber,
                    soasAllInvoices, soasStates, soasAllCurrencies, sinvoiceUpdateMode,
                    resultArray, allDLVNPositionsByDlvnum);
                // console.log('newInvoicesData', newInvoicesData);
                resultArray = newInvoicesData;
                startNumber = startNumber + stepNumber;

                // @ts-ignore
                if (resultArray) {
                    // // @ts-ignore
                    // console.log('resultArray.length: ', resultArray.length);
                    // // @ts-ignore
                    // console.log('resultArray[0].length: ', resultArray[0].length);
                    // // @ts-ignore
                    // console.log('resultArray[1].length: ', resultArray[1].length);
                } else {
                    console.log('resultArray is empty...');
                }

                // @ts-ignore
                if (resultArray) {
                    if (!sinvoiceUpdateMode) {
                        let invQueryToInsert: string = getQueryToInsert(invRefTable, invImportTemplate, resultArray[0]);
                        // @ts-ignore
                        await msLogic.execOneMSSQLQueryWithPromise(invQueryToInsert);
                        let invPositionsQueryToInsert: string = getQueryToInsert(invPositionsRefTable,
                            invPositionsImportTemplate, resultArray[1]);
                        // @ts-ignore
                        await msLogic.execOneMSSQLQueryWithPromise(invPositionsQueryToInsert);
                    } else {
                        // @ts-ignore
                        await importData.sw_data_import('INVOICES', resultArray[0]);
                        // @ts-ignore
                        await importData.sw_data_import('INVOICES_POSITIONS', resultArray[1]);
                    }
                    // @ts-ignore
                    // logger.info('sage_import_new_sinvoice finished..');
                }
                // @ts-ignore
                resultArray = undefined;
                stepResultsNewSINVOICE = [];
            }
        }
        // @ts-ignore
        await mssqlCall.soas_close_pool_connections();

        stopTimeTracking(startTime,'sage_import_new_sinvoice');
    },

    sage_import_new_payment_terms: async function () {

        let updateFlag: boolean = false;

        let startTime = startTimeTracking('sage_import_new_payment_terms STARTED... ' +
        updateFlag ? 'UPDATE' : 'INSERT');

        await emptyTablePromiseQuery("PAYMENT_TERMS", false, true);

        // @ts-ignore
        let newPaymentTermsData = await sgLogic.sage_add_new_payment_terms(updateFlag);
        console.log("newPaymentTermsData: ", newPaymentTermsData);
        // @ts-ignore
        if (newPaymentTermsData) {
            // @ts-ignore
            console.log('newPaymentTermsData.length: ', newPaymentTermsData.length);
        } else {
            console.log('newPaymentTermsData is empty...');
        }
        // @ts-ignore
        if (newPaymentTermsData) {
            // @ts-ignore
            await importData.sw_data_import('PAYMENT_TERMS', newPaymentTermsData[0]);
        }

        stopTimeTracking(startTime,'sage_import_new_payment_terms');
    },

    cron_sage_find_table_keys_for_soas: function(callback: (arg0: any) => void) {
        // msLogic.mssql_select_Table(callback())

        // @ts-ignore
        msLogic.mssql_select_TableByName("DELIVERY_NOTES",function (soasTableAllItems: any) {
            // @ts-ignore
            sgLogic.sage_find_table_keys_for_soas("SDELIVERY", soasTableAllItems, function () {
            });
        });

        // // @ts-ignore
        // msLogic.mssql_select_TableByName("ORDERS",function (soasTableAllItems: any) {
        //     // @ts-ignore
        //     sgLogic.sage_find_table_keys_for_soas("SORDER", soasTableAllItems, function () {
        //     });
        // });

        // // @ts-ignore
        // let soasTableAllItems: any = await mssql_select_ItemBasis();
        // @ts-ignore
        // sgLogic.sage_find_table_keys_for_soas("ITMMASTER", soasTableAllItems, function () {
        // });
    },

    execute_sql_create_csv_send_mail: async function (batchCode: string, callback: { (arg0: string): void;
        (arg0: string): void; (arg0: any): void; (arg0: string): void; }) {
        console.log('Enter execute_sql_create_csv_send_mail');
        if (batchCode.length) {
            try {
                batchCode = JSON.parse(batchCode);
                console.log("batchCode: ", batchCode);
                // @ts-ignore
                let sql_query = batchCode['mssql_query'];
                // @ts-ignore
                let csv_filename_prefix = batchCode['csv_filename'];
                // @ts-ignore
                let csv_delimiter = batchCode['csv_delimiter'];
                // @ts-ignore
                let email_address = batchCode['email_address'];
                // @ts-ignore
                let email_subject = batchCode['email_subject'];
                console.log("sql_query: ", sql_query);
                // @ts-ignore
                let data: any = await msLogic.execOneMSSQLQueryWithPromise(sql_query);
                // console.log("query ok - data: ", data);
                // format data for csv file
                // @ts-ignore
                let csvData = mlLogic.getFormattedCsvData(data, csv_delimiter);
                let emailHtmlText: string = '';
                if (csvData.length) {
                    let rowsFound = csvData.match(/\r\n/g);
                    console.log('Anzahl der gefundenen Zeilen: ' + csvData.length);
                    emailHtmlText = "<b>Es wurden " + (rowsFound.length - 1) + " Zeilen gefunden. Für mehr Details, " +
                        "siehe in die CSV-Datei im Anhang dieser Email</b>";
                    let cbReturnData = [
                        {
                            'emailAddress': email_address,
                            'emailSubject': email_subject,
                            'emailHtmlText': emailHtmlText,
                            'functionName': 'execute_sql_create_csv_send_mail',
                            'csvFilenamePrefix': csv_filename_prefix,
                            'csvData': csvData
                        }
                    ];
                    console.log('Send mail...');
                    // send csv file via mail
                    // @ts-ignore
                    mlLogic.send_mail(cbReturnData, function (result) {
                        // @ts-ignore
                        logger.info(result);
                    });
                    callback('Fertig');
                } else {
                    // @ts-ignore
                    logger.error(new Error('Mssql result or mysql result are empty...'));
                    callback('CSV error');
                }
            } catch (err) {
                // @ts-ignore
                logger.error(new Error(err));
                callback(err);
            }
        } else {
            callback('ERROR');
        }
    },

    set_articles_crossselling_flg: async function () {

        let startTime = startTimeTracking('set_articles_crossselling_flg STARTED... ');

        let crosssellingItemnums: string[] = [];

        // 1. Select all DISTINCT crossselling data items
        let selectCrosssDataQuery = "SELECT DISTINCT CROSSSELLING_DATA FROM " + constants.DB_TABLE_PREFIX + "CROSSSELLING;";

        // @ts-ignore
        let selectCrosssDataQueryResult: string[{CROSSSELLING_DATA}] =
            await msLogic.execOneMSSQLQueryWithPromise(selectCrosssDataQuery);
        // console.log("selectCrosssDataQueryResult::: ", selectCrosssDataQueryResult);

        // let items = ["BMCROSS53,4250363417984,BMCROSS33,BMCROSS34,BMCROSS36,4250363417908,BMCROSS37,BMCROSS3,
        // BMCROSS43,BMCROSS47,BMCROSS44,LED-LEUCHTE-SPIEGELSCHRANK,BMCROSS49,PURE-34200-PENDELLEUCHTE-3ER,
        // LIPCO-34389-WANDLEUCHTE,KNIGHT-39168-BALKEN-3ER,BMCROSS50,KNIGHT-39167-RONDELL-3ER,LJ-SPIEGEL900-600,
        // LJ-SPIEGEL800-600,LJ-SPIEGEL700-600,LJ-SPIEGEL600-600,LJ-SPIEGEL400-600,LJ-SPIEGEL1400-600,
        // LJ-SPIEGEL1200-650,LJ-SPIEGEL1000-600,4250363417823,4250363417809,4250363417847,4250524133258,
        // 4250524133289,4250524133265,4250524133234,4250524133241,4250524133296,4250524133272,4250524133302,
        // SPIEGEL-UNBELEUCHTET-90X50CM,SPIEGEL-UNBELEUCHTET-75X60CM,SPIEGEL-UNBELEUCHTET-75X54-5CM,
        // SPIEGEL-UNBELEUCHTET-75X50CM,SPIEGEL-UNBELEUCHTET-70X50CM,SPIEGEL-UNBELEUCHTET-66X50CM,
        // SPIEGEL-UNBELEUCHTET-60X40CM,SPIEGEL-UNBELEUCHTET-60X38-5CM,SPIEGEL-UNBELEUCHTET-40X60CM,
        // SPIEGEL-UNBELEUCHTET-135X50CM,SPIEGEL-UNBELEUCHTET-120X80CM,SPIEGEL-UNBELEUCHTET-120X60CM,WCROSS26,WCROSS29,
        // WCROSS28,WCROSS27,BMCROSS7,ARMATUR-ATHOS,ARMATUR-CADANS-KIWA,BMCROSS13,ARMATUR-HANSGROHE-ESSENCE,BMCROSS15,
        // BMCROSS17,BMCROSS11,BMCROSS9,BMCROSS1,BMCROSS2,BMCROSS4,BMCROSS3,HS188CM000215DE,HS150CM000215DE,
        // HS110CM000215DE,AURUM-XL000215DE,AURUM-S000215DE,AURUM-M000215DE,AURUM-L000215DE,ARMATUR-GROHE-ESSENCE,
        // BMCROSS21,BMCROSS25,BMCROSS29,BMCROSS27,ARMATUR-GROHE-32240001-00,BMCROSS23,SMEDBO-KOSMETIKSPIEGEL-FK483E,
        // SMEDBO-KOSMETIKSPIEGEL-FK482E,BMCROSS51,SMEDBO-KOSMETIKSPIEGEL-FK472E,SMEDBO-KOSMETIKSPIEGEL-FK470E,
        // SMEDBO-KOSMETIKSPIEGEL-FK443,SMEDBO-KOSMETIKSPIEGEL-FK435,SMEDBO-KOSMETIKSPIEGEL-FK474E,ECKVENTIL1-2-A603,
        // HM1-50150W00,HM1-60120W00,HM1-60140W00,HM1-60160W00,HM1-60180W00,ION600X1200WEISS00,ION600X1200ANTHRAZIT00,
        // IONRD600X1200WEISS00,IONRD600X1800WEISS00,ION600X1800ANTHRAZIT00,BMCROSS35,BMCROSS39,BMCROSS52,BMCROSS38,
        // BMCROSS19,SPIEGEL-UNBELEUCHTET-144X50CM,BMCROSS45,BMCROSS46,BMCROSS40,BMCROSS41,BMCROSS42,LED-SPIEGEL-100-60,
        // LED-SPIEGEL-120-65,LED-SPIEGEL-140-60,LED-SPIEGEL-60-60,LED-SPIEGEL-70-60,LED-SPIEGEL-80-60,LED-SPIEGEL-90-60,
        // WCROSS30,BMCROSS58,BMCROSS59,BMCROSS60,BMCROSS61,BMCROSS62,BMCROSS71,BMCROSS72,BMCROSS73",

        //     "BMCROSS53,4250363417984,BMCROSS33,BMCROSS34,BMCROSS36,4250363417908,BMCROSS37,BMCROSS43,BMCROSS47,
        //     BMCROSS44,LED-LEUCHTE-SPIEGELSCHRANK,BMCROSS49,PURE-34200-PENDELLEUCHTE-3ER,LIPCO-34389-WANDLEUCHTE,
        //     KNIGHT-39168-BALKEN-3ER,BMCROSS50,KNIGHT-39167-RONDELL-3ER,LJ-SPIEGEL900-600,LJ-SPIEGEL800-600,
        //     LJ-SPIEGEL700-600,LJ-SPIEGEL600-600,LJ-SPIEGEL400-600,LJ-SPIEGEL1400-600,LJ-SPIEGEL1200-650,
        //     LJ-SPIEGEL1000-600,4250363417823,4250363417809,4250363417847,4250524133258,4250524133289,4250524133265,
        //     4250524133234,4250524133241,4250524133296,4250524133272,4250524133302,SPIEGEL-UNBELEUCHTET-90X50CM,
        //     SPIEGEL-UNBELEUCHTET-75X60CM,SPIEGEL-UNBELEUCHTET-75X54-5CM,SPIEGEL-UNBELEUCHTET-75X50CM,
        //     SPIEGEL-UNBELEUCHTET-70X50CM,SPIEGEL-UNBELEUCHTET-66X50CM,SPIEGEL-UNBELEUCHTET-60X40CM,
        //     SPIEGEL-UNBELEUCHTET-60X38-5CM,SPIEGEL-UNBELEUCHTET-40X60CM,SPIEGEL-UNBELEUCHTET-135X50CM,
        //     SPIEGEL-UNBELEUCHTET-120X80CM,SPIEGEL-UNBELEUCHTET-120X60CM,WCROSS26,WCROSS29,WCROSS28,WCROSS27,BMCROSS7,
        //     ARMATUR-ATHOS,ARMATUR-CADANS-KIWA,BMCROSS13,ARMATUR-HANSGROHE-ESSENCE,BMCROSS15,BMCROSS17,BMCROSS11,
        //     BMCROSS9,BMCROSS2,BMCROSS3,BMCROSS1,BMCROSS4,AURUM-XL000101DE,AURUM-S000101DE,AURUM-M000101DE,
        //     AURUM-L000101DE,HS115CM000101DE,HS110CM000101DE,SPS90X60CM000101DE,SPS75X60CM000101DE,SPS66X60CM000101DE,
        //     SPS140X62CM000101DE,SPS120X62CM000101DE,SPS100X50CM000101DE,SPS90X60CM000101SETDE,SPS75X60CM000101SETDE,
        //     SPS66X60CM000101SETDE,SPS100X50CM000101SETDE,ARMATUR-GROHE-ESSENCE,BMCROSS21,BMCROSS25,BMCROSS29,
        //     BMCROSS27,ARMATUR-GROHE-32240001-00,BMCROSS23,SMEDBO-KOSMETIKSPIEGEL-FK483E,SMEDBO-KOSMETIKSPIEGEL-FK482E,
        //     BMCROSS51,SMEDBO-KOSMETIKSPIEGEL-FK472E,SMEDBO-KOSMETIKSPIEGEL-FK470E,SMEDBO-KOSMETIKSPIEGEL-FK443,
        //     SMEDBO-KOSMETIKSPIEGEL-FK435,SMEDBO-KOSMETIKSPIEGEL-FK474E,ECKVENTIL1-2-A603,HM1-50150W00,HM1-60120W00,
        //     HM1-60140W00,HM1-60160W00,HM1-60180W00,ION600X1200WEISS00,ION600X1200ANTHRAZIT00,IONRD600X1200WEISS00,
        //     IONRD600X1800WEISS00,ION600X1800ANTHRAZIT00,BMCROSS35,BMCROSS39,BMCROSS52,BMCROSS38,BMCROSS19,
        //     SPIEGEL-UNBELEUCHTET-144X50CM,BMCROSS45,BMCROSS46,BMCROSS40,BMCROSS41,BMCROSS42,LED-SPIEGEL-100-60,
        //     LED-SPIEGEL-120-65,LED-SPIEGEL-140-60,LED-SPIEGEL-60-60,LED-SPIEGEL-70-60,LED-SPIEGEL-80-60,
        //     LED-SPIEGEL-90-60,WCROSS30,BMCROSS58,BMCROSS59,BMCROSS60,BMCROSS61,BMCROSS62,BMCROSS71,
        //     BMCROSS72,BMCROSS73,BMCROSS75,HS120CM000101DE,HS180CM000101DE,HS188CM000101DE,HS062CM000101DE,
        //     HSXL000101DE,HS150CM000101DE,MSHS000101DE,SANTINIPANEL000101DE,SANTINILED000101DE,CUBEPANEL000101DE"];

        for (let itm in selectCrosssDataQueryResult) {
            if (selectCrosssDataQueryResult[itm] && selectCrosssDataQueryResult[itm].CROSSSELLING_DATA &&
                selectCrosssDataQueryResult[itm].CROSSSELLING_DATA.length > 0) {
                if (selectCrosssDataQueryResult[itm].CROSSSELLING_DATA.includes(',')) {
                    let itmNumsArr = selectCrosssDataQueryResult[itm].CROSSSELLING_DATA.split(',');
                    for (let itnuItem in itmNumsArr) {
                        // @ts-ignore
                        if (!crosssellingItemnums.includes(itmNumsArr[itnuItem])) {
                            crosssellingItemnums.push(itmNumsArr[itnuItem]);
                        }
                    }
                } else {
                    // @ts-ignore
                    if (!crosssellingItemnums.indexOf(selectCrosssDataQueryResult[itm].CROSSSELLING_DATA.trim())) {
                        crosssellingItemnums.push(selectCrosssDataQueryResult[itm].CROSSSELLING_DATA.trim());
                    }
                }
            }
        }

        // console.log("Search FERTIG: ", crosssellingItemnums);
        console.log("Anzahl: ", crosssellingItemnums.length);

        //Reset all CROSSSELLING_FLG to 0
        let resetCrosssFlgQuery = "UPDATE " + constants.DB_TABLE_PREFIX + "ITEM_BASIS SET CROSSSELLING_FLG = '0';";
        // @ts-ignore
        let resetCrosssFlgQueryResult = await msLogic.execOneMSSQLQueryWithPromise(resetCrosssFlgQuery);
        // console.log("resetCrosssFlgQueryResult::: ", resetCrosssFlgQueryResult);

        // Update articles => set CROSSSELLING_FLG for every found item...
        for (let crsItem in crosssellingItemnums) {
            // if (colors[cItem].ATTRIBUT3_0 !== ' ') {
            let updateCrosssFlgQuery = "UPDATE " + constants.DB_TABLE_PREFIX + "ITEM_BASIS SET CROSSSELLING_FLG = '1' WHERE ITMNUM = '" +
                crosssellingItemnums[crsItem] + "';";
            // @ts-ignore
            let updateCrosssFlgQueryResult = await msLogic.execOneMSSQLQueryWithPromise(updateCrosssFlgQuery);
            // console.log("updateCrosssFlgQueryResult::: ", updateCrosssFlgQueryResult);
        }

        stopTimeTracking(startTime, "set_articles_crossselling_flg");
    },

    getAllOrdersFromSOAS: async function() {
        return await getAllFromSOAS('ORDERS');
    },
    getStatesFromSOAS: async function() {
        return await getStatesFromSOAS();
    },
    getAllCustomersFromSOAS: async function() {
        return await getAllFromSOAS('CUSTOMERS');
    },
    getAllCurrenciesFromSOAS: async function() {
        return await getAllFromSOAS('CURRENCIES');
    },
    getAllCustomersAddressesFromSOAS: async function() {
        return await getAllFromSOAS('CUSTOMERS_ADDRESSES');
    },
    getLastCustomersAddresses: async function() {
        return await getLastCustomersAddresses();
    },
    emptyTablePromiseQuery: async function(tableName: string, reseedTable: boolean = false,
                                           deleteAllTablelocks: boolean = false) {
        await emptyTablePromiseQuery(tableName, reseedTable, deleteAllTablelocks);
    }
};

async function getLastDeliveryNotesFromSoas() {
    // Get last order number
    let lastDeliveryNotesNumberQuery: string = "SELECT DELIVERY_NOTES_NUMBER FROM " + constants.DB_TABLE_PREFIX + "DELIVERY_NOTES " +
        "ORDER BY DELIVERY_NOTES_NUMBER DESC;";
    // @ts-ignore
    let lastDeliveryNotesNumber = await msLogic.execOneMSSQLQueryWithPromise(lastDeliveryNotesNumberQuery);
    return (lastDeliveryNotesNumber[0] && lastDeliveryNotesNumber[0]['DELIVERY_NOTES_NUMBER']) ?
        lastDeliveryNotesNumber[0]['DELIVERY_NOTES_NUMBER'] : undefined;
}

async function getLastOrderNumberFromSoas() {
    // Get last order number
    let lastOrderNumberQuery: string = "SELECT ORDERS_NUMBER FROM " + constants.DB_TABLE_PREFIX + "ORDERS ORDER BY ORDERS_NUMBER DESC;";
    // @ts-ignore
    let lastOrderNumber = await msLogic.execOneMSSQLQueryWithPromise(lastOrderNumberQuery);
    return (lastOrderNumber[0] && lastOrderNumber[0]['ORDERS_NUMBER']) ? lastOrderNumber[0]['ORDERS_NUMBER'] : undefined;
}

async function getLastCustomersAddresses() {
    // @ts-ignore
    let lastCustomersAddressesId = await msLogic.execOneMSSQLQueryWithPromise("SELECT ID " +
        "FROM " + constants.DB_TABLE_PREFIX + "CUSTOMERS_ADDRESSES ORDER BY ID DESC;");
    if (lastCustomersAddressesId[0] && lastCustomersAddressesId[0]['ID']) {
        lastCustomersAddressesId = lastCustomersAddressesId[0]['ID'];
    } else {
        lastCustomersAddressesId = undefined;
    }
    return lastCustomersAddressesId;
}

async function getAllFromSOAS(tableName: string) {
    // @ts-ignore
    return await msLogic.execOneMSSQLQueryWithPromise("SELECT * FROM " + constants.DB_TABLE_PREFIX + tableName + ";");
}

async function getLastInvoicesNumberFromSoas() {
    // Get last invoices number
    let lastInvoicesNumberQuery: string = "SELECT INVOICES_NUMBER FROM " + constants.DB_TABLE_PREFIX + "INVOICES " +
        "ORDER BY INVOICES_NUMBER DESC;";
    // @ts-ignore
    let lastInvoicesNumber = await msLogic.execOneMSSQLQueryWithPromise(lastInvoicesNumberQuery);
    return (lastInvoicesNumber[0] && lastInvoicesNumber[0]['INVOICES_NUMBER']) ?
        lastInvoicesNumber[0]['INVOICES_NUMBER'] : undefined;
}

async function getAllInvoicesFromSoas() {
    // @ts-ignore
    return await msLogic.execOneMSSQLQueryWithPromise("SELECT * FROM " + constants.DB_TABLE_PREFIX + "INVOICES;");
}

async function getStatesFromSOAS() {
    // @ts-ignore
    let statesSoas = await msLogic.execOneMSSQLQueryWithPromise("SELECT STATES_ID,STATES_NAME,STATES_COMMENT," +
        "STATES_ACTIVE,STATES_TYPE FROM " + constants.DB_TABLE_PREFIX + "STATES WHERE STATES_ACTIVE = " + 1 + " ;");
    return statesSoas;
}

function setBatchLastRunDate(result: { [x: string]: any; }, activeBatches: { [x: string]: string | number; }[], i: number) {
    console.log('setBatchLastRunDate: ', result);
    // save last run date to batchprocesses
    let runResultValue = runResultsArr[1];
    if (result && result['error']) {
        runResultValue = runResultsArr[2];
    }
    // @ts-ignore
    sqlController.batchProcess.mssql_update_batch_last_run(activeBatches[i]['BATCH_NAME'], runResultValue,
        false, function () {});
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/**
 * Empty table (delete all table items from given table), by executing a promise query.
 *
 * @param tableName table name: "CUSTOMERS"
 * @param reseedTable if true the table will be reseeded to start index from 0, false by default
 * @param deleteAllTablelocks if true all items in table locks will be deleted, false by default
 */
async function emptyTablePromiseQuery(tableName: string, reseedTable: boolean = false, deleteAllTablelocks: boolean = false) {
    if (deleteAllTablelocks) {
        let deleteLocksQuery = "DELETE FROM " + constants.DB_TABLE_PREFIX + "TABLELOCKS;";
        // @ts-ignore
        await msLogic.execOneMSSQLQueryWithPromise(deleteLocksQuery);
    }
    let deleteQuery = "DELETE FROM " + constants.DB_TABLE_PREFIX + tableName + ";";
    console.log("deleteQuery: ", deleteQuery);
    // @ts-ignore
    await msLogic.execOneMSSQLQueryWithPromise(deleteQuery);
    if (reseedTable) {
        let reseedQuery = "DBCC CHECKIDENT ('" + tableName + "', RESEED, 0);";
        // @ts-ignore
        await msLogic.execOneMSSQLQueryWithPromise(reseedQuery);
    }
}

/**
 *
 * @param tableName
 * @param deleteAllTablelocks
 */
async function truncateTablePromiseQuery(tableName: string, deleteAllTablelocks: boolean = false) {
    if (deleteAllTablelocks) {
        let deleteLocksQuery = "DELETE FROM " + constants.DB_TABLE_PREFIX + "TABLELOCKS;";
        // @ts-ignore
        await msLogic.execOneMSSQLQueryWithPromise(deleteLocksQuery);
    }
    let truncateQuery = "TRUNCATE TABLE " + constants.DB_TABLE_PREFIX + tableName + ";";
    console.log("truncateQuery: ", truncateQuery);
    // @ts-ignore
    await msLogic.execOneMSSQLQueryWithPromise(truncateQuery);
}

async function removeTableLocksPromiseQuery() {
    let deleteLocksQuery = "DELETE FROM " + constants.DB_TABLE_PREFIX + "TABLELOCKS;";
    // @ts-ignore
    await msLogic.execOneMSSQLQueryWithPromise(deleteLocksQuery);
}

async function getImportTemplate(ordersRefTable: string) {
    let importTemplate: any;
    let flag: boolean = true;
    // @ts-ignore
    let data = await msLogic.mssql_call_csv_template();
    for (let i = 0; i < data.length; i++) {
        if (data[i].REF_TABLE.replace(/\s/g, "") === ordersRefTable && flag) {
            importTemplate = data[i];
            flag = false;
        }
    }
    return importTemplate;
}

function getQueryToInsert(reffTable: string, importTemplate: any, resultArray: never[] | any[][]) {
    let orderQuery: string = "INSERT INTO " + constants.DB_TABLE_PREFIX + reffTable + " (";
    let templateFieldsArr: [] = importTemplate.TEMPLATE_FIELDS.split(",");
    for (let tmplItem in templateFieldsArr) {
        orderQuery += templateFieldsArr[tmplItem] + ",";
    }
    orderQuery = orderQuery.substr(0, orderQuery.length - 1); // remove last ,
    orderQuery += ") VALUES ";

    for (let ordItem in resultArray) {
        orderQuery += "(";
        for (let tmplItem in templateFieldsArr) {
            orderQuery += "'" + resultArray[ordItem][tmplItem] + "',";
        }
        orderQuery = orderQuery.substr(0, orderQuery.length - 1); // remove last ,
        orderQuery += "),";
    }
    orderQuery = orderQuery.substr(0, orderQuery.length - 1); // remove last ,
    orderQuery += ";";
    return orderQuery;
}

/**
 * if price bru is empty/null => write 0.0
 * Later need to update PRICE_BRU column and calculate price based on price net
 * Then set PRICE_BRU db field again as NOT NULL
 *
 * @param prilistResults
 * @param prlItem
 */
function getPrilistPriceBru(prilistResults: any, prlItem: string) {
    let priceBru: number = 0.0;
    let priceBruString: string = prilistResults[prlItem].PRICE_BRU.trim();
    priceBruString.replace(",", ".");
    if ((priceBruString !== '')) {
        priceBru = parseFloat(priceBruString);
    }
    return priceBru;
}
