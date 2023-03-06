/* AUTHOR: Ronny Brandt */
/* Update: Stefan Schimmelpfennig, Andreas Lening, Strahinja Belic */
/* LAST UPDATE: 25.01.2022 */

import * as sql from 'mssql';
import * as mssqlCall from './mssql_call';
import {constants} from './constants/constants';
import * as logger from '../config/winston';
import { checkDate } from './sql/date/Date';
import {getItemForQuery} from './helpers';
import {getFieldType, getFieldValue, primaryColumnTypes} from './sql/table/Table';
import {ViewQueryTypes} from './constants/enumerations';
import {CustomerImport} from "./classes/CustomerImport";
import {OrderImport} from "./classes/OrderImport";
import {DeliveryNote} from "./classes/DeliveryNote";
import {Invoice} from "./classes/Invoice";
import {mssqlCallEscaped} from "./mssql_call";


// Overwrite console log function, to enable or disable logs
// console.log = function() {};

/**
 * Count all rows for given table name -
 * Used for count page number and max number of all rows for mat-paginator of custom-table views
 *
 * @param tableName
 * @param refTable
 * @param viewQueryType
 * @param primaryKey
 * @param primaryValue
 * @param secondaryKey
 * @param secondaryValue
 * @param offsetRowCount
 * @param fetchRowCount
 * @param pageNumber
 * @param orderByDirection - sort order value: asc or desc
 */
export async function mssql_count_all_rows(tableName: string, refTable: string, viewQueryType: ViewQueryTypes,
                                           primaryKey: string, primaryValue: string,
                                           secondaryKey: string | undefined, secondaryValue: string | undefined,
                                           offsetRowCount: undefined | number, fetchRowCount: undefined | number,
                                           pageNumber: number, orderByDirection: string)
    : Promise<{ MAX_ROWS: number, PAGE: number }> {
    console.log('');
    console.log('mssql_count_all_rows...');
    console.log('primaryKey: ', primaryKey);
    console.log('primaryValue: ', primaryValue);
    console.log('secondaryKey: ', secondaryKey);
    console.log('secondaryValue: ', secondaryValue);
    if (tableName) {
        //const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
        const DB_TABLE_PREFIX: string = process.env.DATABASE +  '.dbo.';
        // set sort direction - if provided param is empty, set by default ot asc sort
        let sortDirection: string = orderByDirection ? ((orderByDirection.toLowerCase() === 'asc') ? 'ASC' : 'DESC') : 'ASC';
        let sortDirectionArrow: string = orderByDirection ? ((orderByDirection.toLowerCase() === 'asc') ? '<' : '>') : '<';
        // ToDo: Refactor mssql_count_all_rows query: duration about 3 seconds for invoices...
        //  replace * by column name...
        let countSelector = primaryKey; // '*';
        if (viewQueryType === ViewQueryTypes.MAIN_TABLE) {
            if (refTable === 'prodComponents' || refTable === 'warehousing' || refTable === 'components') {
                countSelector = 'DISTINCT ITMNUM';
            } else if (refTable === 'priceListSales') {
                countSelector = 'DISTINCT concat(PRILIST, CUSGRP)';
            }
        } else if (viewQueryType === ViewQueryTypes.DETAIL_TABLE) {
            if (refTable === 'warehousingDetails' || refTable === 'componentsDetails') {
                countSelector = 'DISTINCT ITMNUM';
            }
        } else if (refTable === 'taxationRelations' || refTable === 'tablelocks') {
            primaryKey = '';
            primaryValue = '';
        }
        let maxRowsNumber: number;
        let inputParamsArray: { name: string, type: any, value: any }[] = [
            {name: 'PRIMARY_KEY', type: sql.VarChar, value: primaryKey},
            {name: 'PRIMARY_VALUE', type: sql.VarChar, value: primaryValue},
            {name: 'SECONDARY_KEY', type: sql.VarChar, value: secondaryKey},
            {name: 'SECONDARY_VALUE', type: sql.VarChar, value: secondaryValue},
            {name: 'CUSTOMER_TYPE_B2C', type: sql.VarChar, value: constants.CLIENT_B2C},
            {name: 'CUSTOMER_TYPE_B2B', type: sql.VarChar, value: constants.CLIENT_B2B},
            {name: 'STATUS_POS', type: sql.VarChar, value: 'A'}];
        const PRIMARY_KEY: string = getItemForQuery([primaryKey], primaryColumnTypes);
        const SECONDARY_KEY: string = secondaryKey ?
            getItemForQuery([secondaryKey], primaryColumnTypes) : secondaryKey;
        // const OFFSET_ROW_COUNT: number = offsetRowCount ? offsetRowCount : 0;
        const FETCH_ROW_COUNT: number = fetchRowCount ? fetchRowCount : 0;
        let query: string = `SELECT COUNT(` + countSelector + `) AS ROWS_NUMBER `;
        if (primaryKey && primaryValue) {
            query += `, (SELECT COUNT(` + countSelector + `) FROM ` + DB_TABLE_PREFIX + tableName + ` WHERE
            (` + PRIMARY_KEY + ` ` + sortDirectionArrow + `= @PRIMARY_VALUE `;
            if (secondaryKey && secondaryKey !== 'FULL' && secondaryValue ) {
                query += `AND ` + SECONDARY_KEY + ` = @SECONDARY_VALUE)  
                OR (` + PRIMARY_KEY + ` = @PRIMARY_VALUE AND 
                    ` + SECONDARY_KEY + ` = @SECONDARY_VALUE)
                OR (` + PRIMARY_KEY + ` = @PRIMARY_VALUE AND 
                    ` + SECONDARY_KEY + ` != @SECONDARY_VALUE)) `;
            } else {
                 query += `)) `;
            }
            query += `AS PAGE_NUMBER `;
        }
        query += ` FROM ` + DB_TABLE_PREFIX + tableName + ` `;
        if ((viewQueryType === ViewQueryTypes.DETAIL_TABLE) &&
            offsetRowCount !== undefined && fetchRowCount !== undefined && primaryKey && primaryValue) {
            query += `WHERE ` + PRIMARY_KEY + ` = @PRIMARY_VALUE `;
            if (secondaryKey && secondaryValue) {
                query += ` AND ` + SECONDARY_KEY + ` = @SECONDARY_VALUE `;
            }
            query += `GROUP BY ` + PRIMARY_KEY + `
            ORDER BY ` + PRIMARY_KEY + ` ` + sortDirection + ` 
            OFFSET 0 ROWS FETCH NEXT ` + FETCH_ROW_COUNT + ` ROWS ONLY`;
        } else if (refTable === 'custbtwoc') {
            query += ` WHERE CUSTOMERS_TYPE = @CUSTOMER_TYPE_B2C`;
        } else if (refTable === 'custbtwob') {
            query += ` WHERE CUSTOMERS_TYPE = @CUSTOMER_TYPE_B2B`;
        } else if (refTable === 'priceListSales' && (viewQueryType === ViewQueryTypes.DETAIL_TABLE)) {
            query += ` WHERE ` + PRIMARY_KEY + ` = @PRIMARY_VALUE`;
            if (secondaryValue) {
                query += ` AND ` + SECONDARY_KEY + ` = @SECONDARY_VALUE`;
            }
        }
        console.log(inputParamsArray, query)
        let data: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
        maxRowsNumber = data[0] && data[0]['ROWS_NUMBER'] ? data[0]['ROWS_NUMBER'] : 0;
        pageNumber = data[0] && data[0]['PAGE_NUMBER'] ? data[0]['PAGE_NUMBER'] : 0;
        // show console logs only for allowed referral table names... (for better debug overview of console logs)
        if (refTable !== 'taxationRelations' && refTable !== 'languages' &&
            refTable !== 'paymentTerms' && refTable !== 'states' && refTable !== 'taxationRelations' &&
            refTable !== 'currencies') {
            console.log("mssql_count_all_rows query: ", query);
            console.log('maxRows: ', maxRowsNumber);
            console.log('page: ', pageNumber);
        }
        return {MAX_ROWS: maxRowsNumber, PAGE: pageNumber};
    } else {
        return {MAX_ROWS: 0, PAGE: 0};
    }
}

/**
 * select table
 *
 * @param refTable
 */
export async function mssql_select_Table(refTable: string) {
    //const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    const DB_TABLE_PREFIX: string = process.env.DATABASE +  '.dbo.';
    let query: string = `SELECT `;
    let btob: string = ``;
    let resultData: any = [];
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'CUSTOMER_TYPE_B2C', type: sql.VarChar, value: constants.CLIENT_B2C},
        {name: 'CUSTOMER_TYPE_B2B', type: sql.VarChar, value: constants.CLIENT_B2B}];
    if (refTable === 'custbtwob') {
        btob = ` WHERE CUSTOMERS_TYPE = @CUSTOMER_TYPE_B2B `;
    } else if (refTable === 'custbtwoc') {
        btob = ` WHERE CUSTOMERS_TYPE = @CUSTOMER_TYPE_B2C `;
    }
    let tableName: any = await mssql_call_get_table_name(refTable);
    if (!tableName) {
        console.log('Table name not found! ', tableName);
        return resultData;
    }
    const TABLE_NAME_VALUE: string = DB_TABLE_PREFIX + tableName[0]['TABLE_NAME'];
    let queryPartTwo: string = ` FROM ` + TABLE_NAME_VALUE + btob;
    let refTableResult: string = await getTableColumns(refTable);
    query += refTableResult + queryPartTwo;
    console.log("mssql_select_Table query: ", query);
    resultData.push(refTableResult);
    let data: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
    for (let i = 0; i < data.length; i++) {
        for (let key in data[i]) {
            data[i][key] = checkDate(data[i][key]);
        }
    }
    resultData.push(data);
    return resultData;
}

/**
 * get table name
 *
 * @param refTable
 */
export async function mssql_call_get_table_name(refTable: string) {
    let DB_TABLE_PREFIX: string = process.env.DATABASE +  '.dbo.';

    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'REF_TABLE', type: sql.VarChar, value:refTable}];
    return await mssqlCall.mssqlCallEscaped(inputParamsArray,
        `SELECT TABLE_NAME FROM ` + DB_TABLE_PREFIX + `TABLE_TEMPLATES WHERE REF_TABLE = @REF_TABLE`);
}

/**
 * get table name and detail view
 *
 * @param refTable
 */
export async function mssql_call_get_table_name_and_detail_view(refTable: string) {
    let DB_TABLE_PREFIX: string = process.env.DATABASE +  '.dbo.';
    
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'REF_TABLE', type: sql.VarChar, value: refTable}];
    let selectQuery: string = `SELECT TABLE_NAME, DETAIL_VIEW, TEMPLATE_FIELDS 
        FROM ` +
        DB_TABLE_PREFIX + `TABLE_TEMPLATES WHERE REF_TABLE = @REF_TABLE`;
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, selectQuery);
}

/**
 * get data types for all columns in table
 *
 * @link https://stackoverflow.com/a/41146412
 *
 * Example:
 *  [
 *   {
 *     column: 'CUSTOMERS_NUMBER',
 *     max_length: 40,
 *     precision: 0,
 *     scale: 0,
 *     is_nullable: false,
 *     type: 'nvarchar'
 *   }
 *  ]
 *
 * @param tableName
 */
export async function mssql_call_get_table_data_types(tableName: string): Promise<[]> {
    let DB_TABLE_PREFIX  =  process.env.DATABASE +  '.dbo.';
    const selectQuery = `SELECT c.name AS 'column',
        c.max_length,
        c.precision,
        c.scale,
        c.is_nullable,
        t.name AS 'type'
    FROM sys.columns c
    JOIN sys.types   t
    ON c.user_type_id = t.user_type_id
    WHERE c.object_id = Object_id('` + DB_TABLE_PREFIX +`${tableName}')`;
    // console.log('selectQuery: ', selectQuery);
    return await mssqlCall.mssqlCallEscaped([], selectQuery);
}

/**
 * get all templates from db
 */
export async function mssql_call_csv_template() {
    let DB_TABLE_PREFIX  =  process.env.DATABASE +  '.dbo.';

    
    let query: string = `SELECT TEMPLATE_NAME, TEMPLATE_DESCRIPTION, TEMPLATE_FIELDS, REF_TABLE, UPDATE_FIELDS
        FROM ` +
        DB_TABLE_PREFIX + `IMPORT_TEMPLATES`;
    let data: any = await mssqlCall.mssqlCallEscaped([], query);
    return data;
}

/**
 * get specific import template
 *
 * @param refTable
 * @param rowName optional - if undefined, returns all columns
 */
export async function mssql_call_get_import_template(refTable: string, rowName?: string | undefined) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'REF_TABLE', type: sql.VarChar, value: refTable}];
    let selectQuery: string = `SELECT TEMPLATE_NAME, TEMPLATE_DESCRIPTION, TEMPLATE_FIELDS, REF_TABLE, UPDATE_FIELDS
        FROM ` +
        constants.DB_TABLE_PREFIX + `IMPORT_TEMPLATES WHERE REF_TABLE = @REF_TABLE`;
    if (rowName) {
        const ROW_NAME_VALUE: string = getItemForQuery([rowName], primaryColumnTypes);
        selectQuery = `SELECT ` + ROW_NAME_VALUE + ` FROM ` + constants.DB_TABLE_PREFIX + `IMPORT_TEMPLATES 
        WHERE REF_TABLE = @REF_TABLE`;
    }
    console.log('inputParamsArray: ', inputParamsArray);
    console.log('selectQuery: ', selectQuery);
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, selectQuery);
}

/**
 * get type(s) of given column(s) and table;
 * @param refTable
 * @param columnName - if columnName is undefined, returns all columns types; otherwise returns only one column type
 */
export async function mssql_call_get_table_columns_types(refTable: string, columnName: string | undefined) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'TABLE_NAME', type: sql.VarChar, value: refTable},
        {name: 'COLUMN_NAME', type: sql.VarChar, value: columnName}];
    let selectQuery: string = `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = @TABLE_NAME`;
    if (columnName) {
        selectQuery += ` AND COLUMN_NAME = @COLUMN_NAME`;
    }
    return await mssqlCall.mssqlCallEscaped(inputParamsArray,selectQuery);
}

/**
 * send query to db include check if orders is locked and locks orders, call query array and unlock orders
 *
 * @param tablename
 * @param sqlQueries
 * @param currentUser
 */
export async function mssql_writing_into_db(tablename: string, sqlQueries: any, currentUser: string) {
    // check for locked orders and it is available
    await mssqlCall.isTableLocked(tablename, async function (isLockedData: any) {
        if (isLockedData.LOCKED > 0) {
            if (isLockedData.LOCKED > 1) {
                // @ts-ignore
                logger.warn(isLockedData.DATASTRING);
            } else {
                // @ts-ignore
                logger.warn('locked by ' + isLockedData.LOCKED_BY);
            }
            return {error: tablename + ' locked by ' + isLockedData.LOCKED_BY};
        } else {
            // lock orders
            await mssqlCall.changeTableLockStatus(1, tablename, currentUser);
            // send query array to db
            let dataRes: any;
            for (let sqItem in sqlQueries) {
                dataRes = await mssqlCall.mssqlCall(sqlQueries[sqItem]);
            }
            // unlock orders
            await mssqlCall.changeTableLockStatus(0, tablename, currentUser);
            return dataRes;
        }
    });
}

/**
 * brings the query to the call
 *
 * @deprecated use mssqlCall.mssqlCall or mssqlCall.mssqlCallEscaped instead
 * @param query
 */
export async function mssql_get_it_through(query: string) {
    return await mssqlCall.mssqlCall(query);
}

/**
 * execute one query with promise (used for cron logic)
 *
 * @param query
 */
export async function execOneMSSQLQueryWithPromise(query: any) {
    let result: any;
    try {
        result = await new Promise(async (resolve, reject) => {
            // console.log('Promise i-query: ', query);
            let queryResult = await mssqlCall.mssqlCall(query);
            // console.log('queryResult: ', queryResult);
            if (queryResult && queryResult.error) {
                reject(new Error(queryResult.error));
            } else {
                resolve(queryResult);
            }
        }).catch(err => {
            console.log("Last query: ", query);
            console.log("Error err: ", err);
            // @ts-ignore
            logger.error(new Error("Last query: " + query));
            // @ts-ignore
            logger.error(new Error(err));
            return {error: err};
            // throw new Error(err);
        });
    } catch (e) {
        console.log("Last query: ", query);
        console.log("Error e: ", e);
        // @ts-ignore
        logger.error(new Error("Last query: " + query));
        // @ts-ignore
        logger.error(new Error(e));
        throw new Error(e);
    }
    return result;
}

/**
 * Last Update: Strahinja Belic 28.01.2022.
 * get Company from sales location
 *
 * @param salesLocation - string
 */
export async function getCompanyBySalesLocation(salesLocation: string): Promise<string>{
    const sqlQuery = `SELECT COMPANY FROM COMPANIES_LOCATIONS WHERE LOCATION = @LOC`
    const params = [{name: 'LOC', type: sql.NVarChar, value: salesLocation}]
    const res = await mssqlCallEscaped(params, sqlQuery)
    return res[0].COMPANY
}

/**
 * Last Update: Strahinja Belic 28.01.2022.
 * get Company from sales location
 *
 * @param lastNumber - LAST ORDER_NUMBER, DELIVERY_NOTE_NUMBER ...
 * @param minNum - constants.MINIMUM_NUMBER_LENGTH_DELIVERY_NUMBER, constants.MINIMUM_NUMBER_LENGTH_INVOICE_NUMBER ...
 */
export function getLastDigits(lastNumber: string, minNum: number): number{
    return +lastNumber.slice(
        lastNumber.length - minNum,
        lastNumber.length
    )
}

/**
 * Last Update: Strahinja Belic 25.01.2022.
 * get the latest number and increase it.
 *
 * @param thisItem - TYPE ID
 * @param salesLocation - string
 */
export async function getNewListNumber(thisItem: string, salesLocation?: string): Promise<undefined | string> {
    let company: string,
    startParam: string,
    lastDigits: number,
    lastRecord: {lastNum: string}[],
    minNum: number;

    if(salesLocation){
        company = await getCompanyBySalesLocation(salesLocation) as string
        startParam = `${company}${String(new Date().getFullYear()).slice(2)}`
    }

    switch(thisItem) {
        case constants.NEW_LINE_ITEM.CUSTOMER:
             return await CustomerImport.getNewCustomerNumber()
        case constants.NEW_LINE_ITEM.ORDER:
             return await OrderImport.makeOrdersNumber(salesLocation)
        case constants.NEW_LINE_ITEM.DELIVERY:
            startParam += constants.DELIVERY_NOTE_TYPE_ID
            lastRecord = await DeliveryNote.getDeliveryNoteNumber(startParam)
            minNum = constants.MINIMUM_NUMBER_LENGTH_DELIVERY_NUMBER
            break
        case constants.NEW_LINE_ITEM.INVOICE:
            startParam += constants.INVOICE_TYPE_ID
            lastRecord = await Invoice.getInvoiceNoteNumber(startParam)
            minNum = constants.MINIMUM_NUMBER_LENGTH_INVOICE_NUMBER
            break
        default:
            console.log('thisItem not found... ', thisItem);
            return undefined
    }

    if(lastRecord[0]?.lastNum) {
        lastDigits = getLastDigits(lastRecord[0].lastNum, minNum) + 1
        return startParam + lastDigits.toString().padStart(minNum, '0')
    }

    return  startParam + '1'.padStart(minNum, '0')
}

/**
 * get template for html orders build
 *
 * @param refTable
 */
export async function getTableTemplate(refTable: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'REF_TABLE', type: sql.VarChar, value: refTable}];
    let templateQuery: string = `SELECT REF_TABLE,TEMPLATE_FIELDS FROM ` + constants.DB_TABLE_PREFIX + `TABLE_TEMPLATES 
        WHERE REF_TABLE = @REF_TABLE`;
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, templateQuery);
}

/**
 * get template for html orders build
 *
 * @param refTable
 */
async function getTableColumns(refTable: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'REF_TABLE', type: sql.VarChar, value: refTable}];
    let templateQuery: string = `SELECT TEMPLATE_FIELDS FROM ` + constants.DB_TABLE_PREFIX + `TABLE_TEMPLATES 
    WHERE REF_TABLE = @REF_TABLE`;
    let data: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, templateQuery);
    return data[0]['TEMPLATE_FIELDS'];
}

/**
 * execute insert query
 *
 * @param elementsArray
 * @param query
 * @param tableName
 */
export async function execInsertMethod(tableDetailView: string[], elementsArray: any, query: string, tableName: string) {
    let queryValues: {inputParamsArray: any, query: string, iPNKeyCntr: number} =
        await addValuesToQuery(tableDetailView, elementsArray, query, tableName);
    console.log('queryValues: ', queryValues);

    let data: any = await mssqlCall.mssqlCallEscaped(queryValues.inputParamsArray, queryValues.query);
    console.log('Insert Result: ', data);
    return (data && !data.error) ? data : 'undefined';
}

/**
 * add values to the given query
 *
 * rearrange every form field from elementsArray to have the order of constants.DB_TABLE_COLUMNS and
 * build up inputParamsArray and values for query execution
 *
 * @param tableDetailView - TABLE_TEMPLATES > DETAIL_VIEW
 * @param elementsArray - form fields
 * @param query
 * @param tableName
 * @param iPNKeyCntr - optional, 0 by default
 */
export async function addValuesToQuery(tableDetailView: string[], elementsArray: any, query: string, tableName: string,
                                       iPNKeyCntr: number = 0): Promise<{ inputParamsArray, query, iPNKeyCntr }> {
    console.log('addValuesToQuery - tableName: ', tableName);
    let inputParamsArray: { name: string, type: any, value: any }[] = [];
    const IPN_PREFIX: string = 'IPN';
    const IPN_DELIMITER: string = '_';
    let inputName: string = ``;
    let values: string = `(`;
    const dataTypes: [] = await mssql_call_get_table_data_types(tableName);
     console.log('dataTypes loaded: ', dataTypes);
    const tableColumnsData: {} = getTableColumnsTypes(dataTypes, tableDetailView);

    console.log('tableDetailView: ', tableDetailView, 'tableColumnsData: ', tableColumnsData, 'dataTypes: ', dataTypes);

    for (let key in tableColumnsData) {
        if (tableColumnsData.hasOwnProperty(key)) {
            // if (tableDetailView.includes(key)) {
            if (key in elementsArray) {
                // console.log('CURRENT KEY FOUND: ', key);
                // console.log('TYPE: ', tableColumnsData[key].DATA_TYPE);
                // if (elementsArray[key] !== null) {
                inputName = `${IPN_PREFIX}${IPN_DELIMITER}${iPNKeyCntr}${IPN_DELIMITER}${key}`;
                inputParamsArray.push({
                    name: inputName,
                    type: getFieldType(tableColumnsData[key].DATA_TYPE),
                    value: getFieldValue(tableColumnsData[key].DATA_TYPE, elementsArray[key])
                });
                values += `@${inputName}, `;
                // } else {
                //     values += `NULL, `;
                // }
                iPNKeyCntr++;
            } else {
                console.warn('KEY not found in db: ', key);
            }
        }
    }

    if (values.length) {
        values = values.trim();
        values = values.substr(0, values.length - 1);
    }
    values += `)`;
    query += values;
    console.log('insert query: ', query);
    console.log('inputParamsArray: ', inputParamsArray);
    return {inputParamsArray, query, iPNKeyCntr};
}

/**
 * execute given queries array list one after another
 *
 * @param inputParamsArray
 * @param queries
 */
export async function execMSSQLQueryWithPromise(inputParamsArray: { name: string, type: any, value: any }[],
                                                queries: any) {
    let result: any;
    try {
        for (let idnItem in queries) {
            result = await new Promise(async (resolve, reject) => {
                console.log('Promise i-query: ', queries[idnItem]);
                let insertDNResult = await mssqlCall.mssqlCallEscaped(inputParamsArray, queries[idnItem]);
                // console.log('insertDNResult: ', insertDNResult);
                if (insertDNResult === undefined) {
                    resolve(insertDNResult);
                }
            });
        }
    } catch (e) {
        // @ts-ignore
        logger.error(new Error(e));
    }
    return result;
}

/**
 * check for given orders number if number of order positions and cache positions are equal
 *
 * @param ordersNumber
 */
export async function isOPAndCacheConsistent(ordersNumber: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'DOCUMENT_NUMBER', type: sql.VarChar, value: ordersNumber},
        {name: 'ORDERS_NUMBER', type: sql.VarChar, value: ordersNumber},
        {name: 'CATEGORY_SOAS', type: sql.VarChar, value: constants.CATEGORY_SOAS_SET}];
    let opCacheCompareQuery: string = `SELECT COUNT(ID) AS OP,
        (SELECT COUNT(ID) AS IDS_NUMBER FROM ` +
        constants.DB_TABLE_PREFIX + `WAREHOUSE_RESERVATION_CACHE WHERE
        DOCUMENT_NUMBER = @DOCUMENT_NUMBER) AS CACHE
        FROM [SOAS].[dbo].[ORDERS_POSITIONS]
        WHERE ORDERS_NUMBER = @ORDERS_NUMBER AND CATEGORY_SOAS != @CATEGORY_SOAS`;
    console.log("opCacheCompareQuery: ", opCacheCompareQuery);
    let opCacheCompareData: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, opCacheCompareQuery);
    return (opCacheCompareData.length && opCacheCompareData.OP === opCacheCompareData.CACHE);
}

/**
 * get table columns types
 *
 * @param dataTypes
 * @param tableDetailView
 */
export function getTableColumnsTypes(dataTypes: any, tableDetailView: string[]): {} {
    let tableColumnsData: {} = {};
    // order by table detail view
    for(let tableItem in tableDetailView) {
        if (tableDetailView.hasOwnProperty(tableItem)) {
            for (let dataItem in dataTypes) {
                if (dataTypes.hasOwnProperty(dataItem) && dataTypes[dataItem].column === tableDetailView[tableItem]) {
                    tableColumnsData[tableDetailView[tableItem]] = {DATA_TYPE: getDataType(dataTypes[dataItem].type)};
                    dataItem = dataTypes.length; // break
                }
            }
        }
    }
    // console.log('getTableColumnsTypes: ', tableColumnsData);
    return tableColumnsData;
}

/**
 * get table columns types, ordered by table data types
 *
 * IMPORTANT: The order of returned columns is the same like the columns order of the table
 *
 * @param dataTypes
 * @param tableDetailView
 */
export function getTableColumnsTypesByDataTypes(dataTypes: any, tableDetailView: string[]): {} {
    let tableColumnsData: {} = {};
    // order by table detail view
    for (let dataItem in dataTypes) {
        if (dataTypes.hasOwnProperty(dataItem)) {
            for (let tableItem in tableDetailView) {
                if (tableDetailView.hasOwnProperty(tableItem)) {
                    if (dataTypes[dataItem].column === tableDetailView[tableItem]) {
                        tableColumnsData[tableDetailView[tableItem]] = {DATA_TYPE: getDataType(dataTypes[dataItem].type)};
                        tableItem = tableDetailView.length.toString(); // break
                    }
                }
            }
        }
    }
    // console.log('getTableColumnsTypes: ', tableColumnsData);
    return tableColumnsData;
}

/**
 * get data type
 *
 * @param type
 */
export function getDataType(type: string): string {
    if (type === 'nvarchar' || type === 'nchar' || type === 'text') {
        return 'VarChar';
    } else if (type === 'smalldatetime') {
        return 'SmallDateTime';
    } else if (type === 'decimal') {
        return 'Decimal';
    } else if (type === 'bit') {
        return 'Bit';
    } else if (type === 'int') {
        return 'Int';
    }
    console.warn('getDataType: ' + type + ' was not found!');
    return type;
}

