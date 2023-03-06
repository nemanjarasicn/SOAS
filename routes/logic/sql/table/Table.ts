/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 09.06.2021 */

import * as sql from 'mssql';
import * as mssqlCall from '../../mssql_call';
import {constants} from '../../constants/constants';
import {
    execInsertMethod,
    getCompanyBySalesLocation,
    getNewListNumber,
    getTableColumnsTypes,
    mssql_call_get_table_data_types,
    mssql_call_get_table_name,
    mssql_call_get_table_name_and_detail_view,
    mssql_count_all_rows
} from '../../mssql_logic';
import {updateAttributes} from '../attributes/Attributes';
import {getThisLocalizeData} from '../localize-it/LocalizeIt';
import {insertCrossselling, updateCrossselling} from '../crossselling/Crossselling';
import {setStockTransfer} from '../stock-transfer/StockTransfer';
import {checkDate} from '../date/Date';
import {getItemForQuery} from '../../helpers';
import {ViewQueryTypes} from '../../constants/enumerations';
import {mssql_is_order_number_existing} from '../order/Order';
import {mssql_is_invoices_number_existing} from "../invoice/Invoice";


export enum primaryColumnTypes {
    ID = 'ID' as any,
    ITMNUM = 'ITMNUM' as any,
    ORDERS_NUMBER = 'ORDERS_NUMBER' as any,
    DELIVERY_NOTES_NUMBER = 'DELIVERY_NOTES_NUMBER' as any,
    INVOICES_NUMBER = 'INVOICES_NUMBER' as any,
    CUSTOMERS_NUMBER = 'CUSTOMERS_NUMBER' as any,
    CUSTOMERS_TYPE = 'CUSTOMERS_TYPE' as any,
    WHLOC = 'WHLOC' as any, // orderPositions -> add new position
    CUSGRP = 'CUSGRP' as any, // prilists
    ADDRESS_TYPE = 'ADDRESS_TYPE' as any,
    TABLENAME = 'TABLENAME' as any, // tableLocks
    COMPNUM = 'COMPNUM' as any, // components
    CURRENCY_ID = 'CURRENCY_ID' as any,
    COUNTRY_ID = 'COUNTRY_ID' as any,
    COUNTRY_NAME = 'COUNTRY_NAME' as any,
    ATTRIBUTE_NAME = 'ATTRIBUTE_NAME' as any,
    ATTRIBUTE_DATA = 'ATTRIBUTE_DATA' as any,
    PAYMENT_TERM_ID = 'PAYMENT_TERM_ID' as any,
    PROD_UNIT_NAME = 'PROD_UNIT_NAME' as any,
    PROVIDERS_NAME = 'PROVIDERS_NAME' as any,
    ORDERS_POSITIONS_ID = 'ORDERS_POSITIONS_ID' as any,
    CROSSSELLING = 'CROSSSELLING' as any,
    TAX_NUMBER = 'TAX_NUMBER' as any, // secondary key at PROVIDERS
    PRILIST = 'PRILIST' as any,
    TAXCODE = 'TAXCODE' as any,
    TAXRATE = 'TAXRATE' as any,
    INVOICES_CUSTOMER = 'INVOICES_CUSTOMER' as any,
    CUSTOMER_ORDER = 'CUSTOMER_ORDER' as any,
    COMPANY = 'COMPANY' as any,
    CROSSSELLING_ID = 'CROSSSELLING_ID' as any,
    PROVIDERS_ORDER = 'PROVIDERS_ORDER' as any,
    OFFER_NUMBER = 'OFFER_NUMBER' as  any

}

export enum secondColumnTypes {
    PROD_COMPONENTS = 'PROD_COMPONENTS' as any,
    FULL = 'FULL' as any,
    CUSTOMERS_TYPE = 'CUSTOMERS_TYPE' as any,
}

/**
 * check if data of given refTable and object data (e.g. Warehousing) is consistent
 *
 * @param refTable
 * @param objectData
 * @param onlyCheck
 */
export async function mssql_check_table_data(refTable: string, objectData: object | any, onlyCheck: boolean) {
    console.log('mssql_check_table_data...');
    // console.log('objectData: ', objectData);
    let result: any = {found: false, data: undefined};
    let resultData: any = [];
    let tableName: any = await mssql_call_get_table_name_and_detail_view(refTable);
    if (!tableName) {
        return result;
    }
    //const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    const DB_TABLE_PREFIX: string = process.env.DATABASE +  '.dbo.';
    const TABLE_NAME_VALUE: string = tableName[0]['TABLE_NAME'];
    const TABLE_DETAIL_VIEW: string[] = tableName[0]['DETAIL_VIEW'].split(',');
    let inputParamsArray: { name: string, type: any, value: any }[] = [];
    const IPN_PREFIX: string = 'IPN';
    const IPN_DELIMITER: string = '_';
    let iPNKeyCntr: number = 0;
    let inputName: string = ``;
    let completeQuery = `SELECT `;
    let whereQuery = `WHERE `;

    const dataTypes: [] = await mssql_call_get_table_data_types(TABLE_NAME_VALUE);
    const tableColumnsData: {} = getTableColumnsTypes(dataTypes, TABLE_DETAIL_VIEW);
    if (!tableColumnsData || Object.keys(tableColumnsData).length === 0) {
        console.error(new Error('No table columns found for ' + refTable + '! ' +
            'Check if TABLE_TEMPLATES table is up to date!'));
        return result;
    }
    // get all key/value from object and append them to WHERE query (except 'ID', 'UPDATE_LOC' or 'QTY')
    for (let key in tableColumnsData) {
    // for (let key in objectData) {
        inputName = ``;
        // if (objectData.hasOwnProperty(key)) {
            // if (TABLE_DETAIL_VIEW.includes(key)) {
        if (tableColumnsData.hasOwnProperty(key)) {
        if (key in objectData) {
                completeQuery += key + `,`; // ID,WHLOC,ITMNUM etc.
                if (key !== 'ID' && key !== 'UPDATE_LOC' && key !== 'QTY' && key !== 'RESERVED') {
                    let objectDataValue = objectData[key]; // value of the key
                    inputName = `${IPN_PREFIX}${IPN_DELIMITER}${iPNKeyCntr}${IPN_DELIMITER}${key}`;
                    inputParamsArray.push({
                        name: inputName,
                        type: getFieldType(tableColumnsData[key].DATA_TYPE),
                        value: getFieldValue(tableColumnsData[key].DATA_TYPE, objectDataValue)
                    });
                    whereQuery += key + ` = @${inputName} AND `;
                }
                iPNKeyCntr++;
            } else {
                console.warn('KEY not found in db table: ', key);
            }
        }
    }
    completeQuery = completeQuery.substr(0, completeQuery.length - 1); // remove last comma
    whereQuery = whereQuery.substr(0, whereQuery.length - 5); // remove last comma
    completeQuery += ` FROM ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE + ` ` + whereQuery;
    // console.log('inputParamsArray: ', inputParamsArray);
    console.log('completeQuery: ', completeQuery);
    let data: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, completeQuery);
    if (data.length > 0) {
        result = {found: true};
    }
    if (!onlyCheck) {
        for (let i = 0; i < data.length; i++) {
            for (let key in data[i]) {
                if (data[i].hasOwnProperty(key)) {
                    data[i][key] = checkDate(data[i][key]);
                }
            }
        }
        resultData.push(data);
        result['data'] = resultData;
    }
    return result;
}

/**
 * select table fields: all or only one, by loading LOCKED_FIELDS of TABLE_TEMPLATES.
 *
 * All: Only refTable param is needed: (like: refTable = 'custbtwoc')
 *
 * Only one: refTable, firstUniqueColumn and firstUniqueNumber are needed:
 * (like: refTable = 'customersAddrDlv', firstUniqueColumn = 'CUSTOMERS_NUMBER', firstUniqueNumber = '50019CUS20038')
 *
 * @param refTable - 'custbtwoc'
 * @param viewQueryType - view query types: 'MAIN_TABLE', 'DETAIL_TABLE', 'PURE_SELECT'
 * @param primaryKey - (optional) 'CUSTOMERS_NUMBER'
 * @param primaryValue - (optional) '50019CUS20038'
 * @param secondaryKey - (optional) 'CUSTOMERS_TYPE'
 * @param secondaryValue - (optional) 'B2C'
 * @param offsetRowCount
 * @param fetchRowCount
 * @param pageNumber - page number from client pagination
 * @param orderByColumn
 * @param orderByDirection
 */
export async function mssql_select_Table_by_Number(refTable: string,
                                                   viewQueryType: ViewQueryTypes,
                                                   primaryKey: string, primaryValue: string,
                                                   secondaryKey: string | undefined,
                                                   secondaryValue: string | undefined,
                                                   // @ToDo Set offset and fetch row count at customer or detailTabGroup,
                                                   //   to show page number at customers Lieferadressen...
                                                   offsetRowCount: undefined | number, fetchRowCount: undefined | number,
                                                   pageNumber: number,
                                                   orderByColumn: string, orderByDirection: string)
    : Promise<{ data: {}, rows: number, page: number }> {
    console.log('mssql_select_Table_by_Number...', refTable);
    console.log('fechrow: ', fetchRowCount);
    //const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    const DB_TABLE_PREFIX: string = process.env.DATABASE +  '.dbo.';
    console.log('sasasassas' +  process.env.DATABASE);
    let query: string = `SELECT`;
    let wherePartSql: string = '';
    let queryPartTwo: string = '';
    let queryJoin: string = '';
    let resultData: any = [];
    let fullSQL: boolean = false;
    let completeQuery: string = '';
    let selectedColumns: string = '';
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'PRIMARY_VALUE', type: sql.VarChar, value: primaryValue},
        {name: 'SECONDARY_VALUE', type: sql.VarChar, value: secondaryValue},
        {name: 'ORDER_BY_DIRECTION', type: sql.VarChar, value: orderByDirection},
        {name: 'OFFSET_ROW_COUNT', type: sql.Int, value: offsetRowCount},
        {name: 'FETCH_ROW_COUNT', type: sql.Int, value: fetchRowCount},
    ];

    const ORDER_BY_DIRECTION_VALUE: string = getItemForQuery([orderByDirection], constants.SORT_TYPES);
    console.log('constants.SORT_TYPES: ', constants.SORT_TYPES);
    // Workaround to show positions at customers, because positions tables do not have customer number column and
    // it is not possible to select positions by this column. Therefore select first row of orders/del-notes/invoices
    // by customer number and load then positions of this order/del-note/invoice number.
    let positionsWorkaround: boolean = false;
    if ((refTable === 'orderPosition' && primaryKey === 'CUSTOMER_ORDER') ||
        (refTable === 'deliveryNotePositions' && primaryKey === 'CUSTOMERS_NUMBER') ||
        (refTable === 'invoicePositions' && primaryKey === 'INVOICES_CUSTOMER')) {
        positionsWorkaround = true;
        const __ret = await getColumnsForPositionsWorkaround(primaryKey, DB_TABLE_PREFIX, refTable, secondaryKey,
            orderByColumn, inputParamsArray);
        primaryKey = __ret.primaryKey;
        secondaryKey = __ret.secondaryKey;
        orderByColumn = __ret.orderByColumn;
        primaryValue = __ret.primaryValue;
        inputParamsArray = replaceInputParamsArrayValue(inputParamsArray, 'PRIMARY_VALUE', primaryValue);
    }
    if (positionsWorkaround && !primaryValue) {
        return {data: resultData, rows: 0, page: 0};
    } else {
        let tableName: any = await mssql_call_get_table_name_and_detail_view(getVirtualTableNames(refTable));
        if (!tableName || tableName.length === 0) {
            return {data: resultData, rows: 0, page: 0};
        }
        const TABLE_NAME_VALUE: string = DB_TABLE_PREFIX + tableName[0]['TABLE_NAME'];
        let rowsNumberResult: { MAX_ROWS: number, PAGE: number };
        if ((viewQueryType === ViewQueryTypes.MAIN_TABLE) ||
            (viewQueryType === ViewQueryTypes.DETAIL_TABLE && hasTableInDetailView(refTable))) {
            // select count page number and number of all rows, to show it for pagination at mat-paginator: 1 - 14 of 200
            // 1 - page number; 14 - number of items per page; 200 - number of all rows
            rowsNumberResult = await mssql_count_all_rows(tableName[0]['TABLE_NAME'], refTable, viewQueryType,
                primaryKey, primaryValue, secondaryKey, secondaryValue, offsetRowCount,
                fetchRowCount, pageNumber, orderByDirection);
            // calculate page number from row number: go through items an "search" for page number (rowsNumberResult['PAGE'])
            // returns page number: for given 12 => 0, for 20 => 1, for 35 => 3
            if ((primaryValue || ((refTable === 'warehousing' || refTable === 'warehousingDetails') &&
                secondaryValue))) {
                let offsetData: any = calcSelItemPageOffset(offsetRowCount, fetchRowCount,
                    rowsNumberResult['MAX_ROWS'], rowsNumberResult['PAGE'], pageNumber);
                offsetRowCount = offsetData.offsetFrom;
                pageNumber = offsetData.page;
                console.log('offsetRowCount: ', offsetRowCount);
                inputParamsArray = replaceInputParamsArrayValue(inputParamsArray, 'OFFSET_ROW_COUNT', offsetRowCount);
                console.log('pageNumber: ', pageNumber);
            } else {
                console.log('firstUniqueNumber not set... offsetRowCount: ', offsetRowCount);
            }
        }
        const PRIMARY_KEY: string = primaryKey;
        const SECONDARY_KEY: undefined | string = secondaryKey;
        const PAGE_NUMBER: number = pageNumber;
        const FETCH_ROW_COUNT: number = fetchRowCount ? fetchRowCount : 0;
        const ORDER_BY_COLUMN: string = orderByColumn;
        if (viewQueryType === ViewQueryTypes.NEW_ITEM) {
            selectedColumns = tableName[0]['DETAIL_VIEW'];
           
            wherePartSql = getNewItemCheckQuery(viewQueryType, primaryKey, primaryValue, secondaryKey, secondaryValue,
                wherePartSql, PRIMARY_KEY, SECONDARY_KEY);
                console.log('prover'  + wherePartSql);
        } else {
            if (refTable === 'articlesAttributes') {
                const __ret = getArticleAttributesQuery(completeQuery, DB_TABLE_PREFIX, ORDER_BY_DIRECTION_VALUE, fullSQL);
                completeQuery = __ret.completeQuery;
                fullSQL = __ret.fullSQL;
            } else {
                if ((viewQueryType !== ViewQueryTypes.MAIN_TABLE) && primaryValue) {
                    selectedColumns = tableName[0]['DETAIL_VIEW'];
                } else {
                    selectedColumns = tableName[0]['TEMPLATE_FIELDS'];
                }
                let selColValues = selectedColumns.split(',');
                if (refTable === 'taxationRelations') {
                    const __ret = getTaxationRelationsQuery(primaryKey, primaryValue, completeQuery, DB_TABLE_PREFIX,
                        ORDER_BY_COLUMN, ORDER_BY_DIRECTION_VALUE, fullSQL);
                    completeQuery = __ret.completeQuery;
                    fullSQL = __ret.fullSQL;
                } else if (refTable === 'orders') {
                    const __ret = getOrdersQuery(viewQueryType, primaryKey, primaryValue, completeQuery,
                        selColValues, DB_TABLE_PREFIX, PRIMARY_KEY, offsetRowCount, fetchRowCount,
                        ORDER_BY_COLUMN, ORDER_BY_DIRECTION_VALUE, fullSQL, wherePartSql, PAGE_NUMBER, FETCH_ROW_COUNT);
                    completeQuery = __ret.completeQuery;
                    fullSQL = __ret.fullSQL;
                    wherePartSql = __ret.wherePartSql;
                } else if (refTable === 'invoice') {
                    const __ret = getInvoiceQuery(viewQueryType, primaryKey, primaryValue, secondaryKey, secondaryValue, completeQuery,
                        selColValues, DB_TABLE_PREFIX, PRIMARY_KEY, SECONDARY_KEY, offsetRowCount, fetchRowCount,
                        ORDER_BY_COLUMN, ORDER_BY_DIRECTION_VALUE, fullSQL, wherePartSql, PAGE_NUMBER, FETCH_ROW_COUNT);
                    completeQuery = __ret.completeQuery;
                    fullSQL = __ret.fullSQL;
                    wherePartSql = __ret.wherePartSql;
                } else if (refTable === 'orderPosition' || refTable === 'deliveryNotePositions' ||
                    refTable === 'invoicePositions') {
                    const __ret = getPositionsQuery(completeQuery, selColValues, refTable, DB_TABLE_PREFIX, primaryKey,
                        primaryValue, secondaryKey, secondaryValue, PRIMARY_KEY, SECONDARY_KEY,
                        fullSQL);
                    completeQuery = __ret.completeQuery;
                    fullSQL = __ret.fullSQL;
                } else if (refTable === 'warehousing' || refTable === 'warehousingDetails') {
                    const __ret = getWarehousingQuery(viewQueryType, completeQuery, selColValues, DB_TABLE_PREFIX,
                        secondaryKey, PRIMARY_KEY, secondaryValue, SECONDARY_KEY, offsetRowCount,
                        fetchRowCount, primaryKey, ORDER_BY_COLUMN, ORDER_BY_DIRECTION_VALUE, fullSQL, pageNumber,
                        FETCH_ROW_COUNT);
                    completeQuery = __ret.completeQuery;
                    fullSQL = __ret.fullSQL;
                } else if (refTable === 'components') {
                    const __ret = getComponentsQuery(viewQueryType, completeQuery, selColValues, DB_TABLE_PREFIX,
                        secondaryKey, PRIMARY_KEY, offsetRowCount, fetchRowCount, primaryKey, ORDER_BY_COLUMN,
                        ORDER_BY_DIRECTION_VALUE, fullSQL, pageNumber, FETCH_ROW_COUNT);
                    completeQuery = __ret.completeQuery;
                    fullSQL = __ret.fullSQL;
                } else if (refTable === 'prodComponents') {
                    const __ret = getProdComponents(viewQueryType, primaryKey, primaryValue,
                        undefined, undefined,
                        // secondaryKey, secondaryValue,
                        completeQuery, selColValues, DB_TABLE_PREFIX, PRIMARY_KEY,
                        undefined,
                        // SECONDARY_KEY,
                        fullSQL, offsetRowCount, fetchRowCount, ORDER_BY_COLUMN,
                        ORDER_BY_DIRECTION_VALUE, PAGE_NUMBER, FETCH_ROW_COUNT);
                    completeQuery = __ret.completeQuery;
                    fullSQL = __ret.fullSQL;
                } else if (refTable === 'articles') {
                    const __ret = getArticlesQuery(viewQueryType, completeQuery, selColValues, DB_TABLE_PREFIX, primaryKey,
                        primaryValue, secondaryKey, secondaryValue, PRIMARY_KEY, SECONDARY_KEY,
                        offsetRowCount, fetchRowCount, ORDER_BY_COLUMN, ORDER_BY_DIRECTION_VALUE, fullSQL,
                        PAGE_NUMBER, FETCH_ROW_COUNT);
                    completeQuery = __ret.completeQuery;
                    fullSQL = __ret.fullSQL;
                } else if (refTable === 'priceListSales') {
                    const __ret = getPriceListSalesQuery(viewQueryType, completeQuery, DB_TABLE_PREFIX, selColValues, primaryKey,
                        primaryValue, secondaryKey, secondaryValue, PRIMARY_KEY, SECONDARY_KEY,
                        offsetRowCount, fetchRowCount, fullSQL, PAGE_NUMBER, FETCH_ROW_COUNT,
                        ORDER_BY_COLUMN, ORDER_BY_DIRECTION_VALUE);
                    completeQuery = __ret.completeQuery;
                    fullSQL = __ret.fullSQL;
                } else if (refTable === 'taxes') {
                    queryJoin = 'SELECT TC.TAXCODE,TC.DESCRIPTION,TC.COUNTRY,TX.TAXRATE FROM TAXCODES TC ' +
                        'INNER JOIN TAXRATES TX ON TX.PER_END IS NULL AND TC.TAXCODE = TX.TAXCODE ';
                } else {
                    wherePartSql = getDefaultTableQuery(
                        viewQueryType,
                        primaryKey, primaryValue, secondaryKey, secondaryValue,
                        wherePartSql, PRIMARY_KEY,
                        SECONDARY_KEY, refTable, offsetRowCount, fetchRowCount, ORDER_BY_COLUMN,
                        ORDER_BY_DIRECTION_VALUE, PAGE_NUMBER, FETCH_ROW_COUNT, orderByColumn, orderByDirection);
                }
            }
        }
        if (!fullSQL) {
            queryPartTwo = `FROM ${TABLE_NAME_VALUE} ${wherePartSql}`;
        }
        resultData.push(selectedColumns);
        if (fullSQL) {
            query = completeQuery;
        } else if (queryJoin) {
            query = queryJoin;
        } else {
            query += ` ` + selectedColumns + ` ` + queryPartTwo;
        }
        // show console logs only for allowed referral table names... (for better debug overview of console logs)
        if (refTable !== 'taxationRelations' && refTable !== 'languages' &&
            refTable !== 'paymentTerms' && refTable !== 'states' && refTable !== 'taxationRelations' &&
            refTable !== 'currencies') {
            console.log('inputParamsArray: ', inputParamsArray);
            console.log('query=> ', query);
        } else {
            console.log('inputParamsArray: ', inputParamsArray);
            console.log('query=> ', query);
        }
        let data = await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
        for (let i = 0; i < data.length; i++) {
            for (let key in data[i]) {
                if (data[i].hasOwnProperty(key)) {
                    data[i][key] = checkDate(data[i][key]);
                }
            }
        }
        resultData.push(data);
        return {data: resultData, rows: rowsNumberResult ? rowsNumberResult['MAX_ROWS'] : 0, page: pageNumber};
    }
}

/**
 * get column data for workaround to show positions at customers by selecting first found item
 *
 * e.g. for orders:
 * load existing orders rows for given CUSTOMER_ORDER number and returns value (ORDERS_NUMBER) of first found item
 * IN: primaryKey = 'CUSTOMER_ORDER', refTable = 'orders', secondaryKey = undefined
 * OUT: primaryKey = 'ORDERS_NUMBER', secondaryKey = undefined, orderByColumn = 'ORDERS_NUMBER', primaryValue = '10018AU10445'
 *
 * @param primaryKey
 * @param DB_TABLE_PREFIX
 * @param refTable
 * @param secondaryKey
 * @param orderByColumn
 * @param inputParamsArray
 */
async function getColumnsForPositionsWorkaround(primaryKey: string, DB_TABLE_PREFIX: string, refTable: string,
                                                secondaryKey: string | undefined, orderByColumn: string,
                                                inputParamsArray: { name: string; type: any; value: any }[]):
    Promise<{ primaryKey, secondaryKey, orderByColumn, primaryValue }> {
    let primaryValue: undefined | string;
    const FIRST_UNIQUE_COLUMN_POS: string = primaryKey;
    let selectColumn: string = 'ORDERS_NUMBER';
    let selectTable: string = DB_TABLE_PREFIX + 'ORDERS';
    if (refTable === 'deliveryNotePositions') {
        selectColumn = 'DELIVERY_NOTES_NUMBER';
        secondaryKey = 'DELIVERY_NOTES_NUMBER';
        selectTable = DB_TABLE_PREFIX + 'DELIVERY_NOTES';
    } else if (refTable === 'invoicePositions') {
        selectColumn = 'INVOICES_NUMBER';
        secondaryKey = 'INVOICES_NUMBER';
        selectTable = DB_TABLE_PREFIX + 'INVOICES';
    }
    orderByColumn = selectColumn;
    const SELECT_COLUMN_VALUE: string = getItemForQuery([selectColumn], primaryColumnTypes);
    // check if some orders/del-notes/invoices are existing for given primary key/value
    // e.g.: load by orders 'CUSTOMER_ORDER'
    const orderResult: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, `SELECT ` +
        SELECT_COLUMN_VALUE + ` FROM ` + selectTable + ` WHERE ` + FIRST_UNIQUE_COLUMN_POS + ` = @PRIMARY_VALUE`);
    primaryKey = selectColumn;
    // selects as value first of found orders/del-notes/invoices or set to undefined
    primaryValue = (orderResult.length > 0) ? orderResult[0][selectColumn] : primaryValue;
    return {primaryKey, secondaryKey, orderByColumn, primaryValue};
}


function getTaxationRelationsQuery(primaryKey: string, primaryValue: string, completeQuery: string, DB_TABLE_PREFIX: string,
                                   ORDER_BY_COLUMN: string, ORDER_BY_DIRECTION_VALUE: string, fullSQL: boolean) {
    if (primaryKey && primaryValue) {
        completeQuery = `SELECT BB.TAXRATE FROM ` + DB_TABLE_PREFIX + `CUSTOMERS_ADDRESSES AA 
            LEFT JOIN ` + DB_TABLE_PREFIX + `TAXRATES BB ON BB.TAXCODE = AA.TAXCODE `;
        // orders CUSTOMER_ADDRESSES_ID_INVOICE column value
        if (primaryKey === 'CUSTOMER_ADDRESSES_ID_INVOICE') {
            completeQuery += `WHERE AA.ID = @PRIMARY_VALUE`;
        } else if (primaryKey === 'INVOICES_CUSTOMER') {
            completeQuery += `WHERE AA.CUSTOMERS_NUMBER = @PRIMARY_VALUE AND AA.ADDRESS_TYPE = 'INV'
             AND BB.PER_END IS NULL ORDER BY BB.PER_START DESC`;
        } else {
            // orders ORDERS_NUMBER column value
            completeQuery += `LEFT JOIN ` + DB_TABLE_PREFIX + `.ORDERS CC ON CC.CUSTOMER_ADDRESSES_ID_INVOICE = AA.ID
            WHERE CC.ORDERS_NUMBER = @PRIMARY_VALUE`;
        }
    } else {
        completeQuery = `SELECT * FROM ` + DB_TABLE_PREFIX + `TAXRATES 
                                    ORDER BY ` + ORDER_BY_COLUMN + ` ` + ORDER_BY_DIRECTION_VALUE;
    }
    fullSQL = true;
    return {completeQuery, fullSQL};
}

function getOrdersQuery(viewQueryType: ViewQueryTypes, primaryKey: string, primaryValue: string,
                        completeQuery: string, selColValues: string[], DB_TABLE_PREFIX: string, PRIMARY_KEY: string,
                        offsetRowCount: number | undefined, fetchRowCount: number | undefined, ORDER_BY_COLUMN: string,
                        ORDER_BY_DIRECTION_VALUE: string, fullSQL: boolean, wherePartSql: string,
                        PAGE_NUMBER: number, FETCH_ROW_COUNT: number): { completeQuery, fullSQL, wherePartSql } {

    if ((viewQueryType === ViewQueryTypes.DETAIL_TABLE) && primaryKey && primaryValue) {
        completeQuery = getAddressesQuery('ORDERS', 'CUSTOMER_ORDER', completeQuery,
            selColValues, DB_TABLE_PREFIX, PRIMARY_KEY, offsetRowCount,
            fetchRowCount, ORDER_BY_COLUMN, ORDER_BY_DIRECTION_VALUE, PAGE_NUMBER, FETCH_ROW_COUNT);
        fullSQL = true;
    } else if ((viewQueryType === ViewQueryTypes.PURE_SELECT) && primaryKey && primaryValue) {
        // orders - PURE_SELECT - check of existing items
        wherePartSql += `WHERE ${PRIMARY_KEY} = @PRIMARY_VALUE `;
    } else {
        if (offsetRowCount !== undefined && fetchRowCount !== undefined && primaryKey) {
            wherePartSql += `ORDER BY ` + ORDER_BY_COLUMN + ` ` + ORDER_BY_DIRECTION_VALUE + ` 
                                    OFFSET (` + PAGE_NUMBER + `)*` + FETCH_ROW_COUNT + `
                                    ROWS FETCH NEXT @FETCH_ROW_COUNT ROWS ONLY`;
        }
    }
    return {completeQuery, fullSQL, wherePartSql};
}

function getAddressesQuery(tableName: string, customerNumberColumn: string, completeQuery: string,
                           selColValues: string[], DB_TABLE_PREFIX: string, PRIMARY_KEY: string,
                           offsetRowCount: number, fetchRowCount: number, ORDER_BY_COLUMN: string,
                           ORDER_BY_DIRECTION_VALUE: string, PAGE_NUMBER: number, FETCH_ROW_COUNT: number) {
    completeQuery = getAddressesSelectQuery('CC');
    for (let item in selColValues) {
        completeQuery += `AA.` + selColValues[item] + `,`;
    }
    completeQuery = completeQuery.substr(0, completeQuery.length - 1); // remove last comma
    completeQuery += ` FROM ` + DB_TABLE_PREFIX + tableName + ` AA 
                                LEFT JOIN ` + DB_TABLE_PREFIX + `CUSTOMERS_ADDRESSES CC ON 
                                CC.CUSTOMERS_NUMBER = AA.` + customerNumberColumn + `
                                WHERE AA.` + PRIMARY_KEY + ` = @PRIMARY_VALUE 
                                GROUP BY `;
    for (let item in selColValues) {
        completeQuery += `AA.` + selColValues[item] + `,`;
    }
    completeQuery = completeQuery.substr(0, completeQuery.length - 1); // remove last comma
    if (offsetRowCount !== undefined && fetchRowCount !== undefined) {
        completeQuery += ` ORDER BY AA.` + ORDER_BY_COLUMN + ` ` + ORDER_BY_DIRECTION_VALUE + ` 
                                    OFFSET (` + PAGE_NUMBER + `)*` + FETCH_ROW_COUNT + `
                                    ROWS FETCH NEXT @FETCH_ROW_COUNT ROWS ONLY`;
    }
    return completeQuery;
}

function getAddressesSelectQuery(tablePrefix: string) {
    const addressDelimiter = constants.CUSTOMERS_ADDRESSES_DELIMITER;
    const streetZipDelimiter = constants.CUSTOMERS_ADDRESSES_STREET_ZIP_DELIMITER;
    return `SELECT STRING_AGG(` + tablePrefix + `.ADDRESS_TYPE + '` + addressDelimiter + `' +
                   CONVERT(nvarchar(max), ` + tablePrefix + `.ID) + '` + addressDelimiter + `' +` + tablePrefix +
            `.ADDRESS_STREET + ' ` + streetZipDelimiter + ` ' + ` + tablePrefix + `.ADDRESS_POSTCODE + ' ' +  ` +
                    tablePrefix + `.ADDRESS_CITY, ';') 
            WITHIN GROUP (ORDER BY ` + tablePrefix + `.ID) AS CUSTOMER_ADDRESSES,
            STRING_AGG(` + tablePrefix + `.ADDRESS_TYPE + '` + addressDelimiter + `' + CONVERT(nvarchar(max), ` +
                    tablePrefix + `.ID)  + '` + addressDelimiter + `' +` + tablePrefix + `.TAXCODE, ';')
            WITHIN GROUP (ORDER BY CC.ID) AS CUSTOMER_TAXATIONS, `;
}

function getPositionsQuery(completeQuery: string, selColValues: string[], refTable: string, DB_TABLE_PREFIX: string,
                           primaryKey: string, primaryValue: string,
                           secondaryKey: string | undefined, secondaryValue: string | undefined,
                           PRIMARY_KEY: string, SECONDARY_KEY: string | undefined, fullSQL: boolean) {
    completeQuery = `SELECT `;
    for (let item in selColValues) {
        completeQuery += `AA.` + selColValues[item] + `,`;
    }
    let tableNameToQuery: string = 'ORDERS_POSITIONS';
    let tableNameToJoin: string = 'ORDERS';
    let tableNameToJoinColumn: string = 'ORDERS_NUMBER';
    if (refTable === 'deliveryNotePositions') {
        tableNameToQuery = 'DELIVERY_NOTES_POSITIONS';
        tableNameToJoin = 'DELIVERY_NOTES';
        tableNameToJoinColumn = 'ORDERS_NUMBER';
    } else if (refTable === 'invoicePositions') {
        tableNameToQuery = 'INVOICES_POSITIONS';
        tableNameToJoin = 'INVOICES';
        tableNameToJoinColumn = 'INVOICES_NUMBER';
    }
    completeQuery = completeQuery.substr(0, completeQuery.length - 1);
    completeQuery += ` FROM ` + DB_TABLE_PREFIX + tableNameToQuery + ` AA `;
    if (refTable !== 'deliveryNotePositions' && refTable !== 'invoicePositions') {
        completeQuery += `LEFT JOIN ` + DB_TABLE_PREFIX + tableNameToJoin + ` BB ON 
                                    BB.` + tableNameToJoinColumn + ` = AA.` + tableNameToJoinColumn + ` `;
    }
    if (primaryKey && primaryValue) {
        if (secondaryKey && secondaryValue) {
            completeQuery += `WHERE AA.` + PRIMARY_KEY + ` = @PRIMARY_VALUE AND 
                                        BB.` + SECONDARY_KEY + ` = @SECONDARY_VALUE `;
        } else {
            completeQuery += `WHERE AA.` + PRIMARY_KEY + ` = @PRIMARY_VALUE `;
        }
        completeQuery += `ORDER BY POSITION_ID ASC`;
    }
    fullSQL = true;
    return {completeQuery, fullSQL};
}

function getInvoiceQuery(viewQueryType: ViewQueryTypes, primaryKey: string, primaryValue: string,
                         secondaryKey: string, secondaryValue: string, completeQuery: string,
                         selColValues: string[], DB_TABLE_PREFIX: string, PRIMARY_KEY: string, SECONDARY_KEY: string,
                         offsetRowCount: number, fetchRowCount: number, ORDER_BY_COLUMN: string,
                         ORDER_BY_DIRECTION_VALUE: string, fullSQL: boolean, wherePartSql: string, PAGE_NUMBER: number,
                         FETCH_ROW_COUNT: number):
    { completeQuery, fullSQL, wherePartSql } {
    if ((viewQueryType === ViewQueryTypes.DETAIL_TABLE) && primaryKey && primaryValue) {
        completeQuery = getAddressesQuery('INVOICES', 'INVOICES_CUSTOMER', completeQuery,
            selColValues, DB_TABLE_PREFIX, PRIMARY_KEY, offsetRowCount,
            fetchRowCount, ORDER_BY_COLUMN, ORDER_BY_DIRECTION_VALUE, PAGE_NUMBER, FETCH_ROW_COUNT);
        fullSQL = true;

        // if (secondaryKey && secondaryValue) {
        //     wherePartSql += `WHERE ${PRIMARY_KEY} = @PRIMARY_VALUE AND ${SECONDARY_KEY} = @SECONDARY_VALUE `;
        // } else {
        //     wherePartSql += `WHERE ${PRIMARY_KEY} = @PRIMARY_VALUE `;
        // }
    } else if ((viewQueryType === ViewQueryTypes.PURE_SELECT) && primaryKey && primaryValue) {
        // invoice - PURE_SELECT - check of existing items
        wherePartSql += `WHERE ${PRIMARY_KEY} = @PRIMARY_VALUE `;
    } else {
        if (offsetRowCount !== undefined && fetchRowCount !== undefined && primaryKey) {
            wherePartSql += `ORDER BY ` + ORDER_BY_COLUMN + ` ` + ORDER_BY_DIRECTION_VALUE + ` 
                                    OFFSET (` + PAGE_NUMBER + `)*` + FETCH_ROW_COUNT + `
                                    ROWS FETCH NEXT @FETCH_ROW_COUNT ROWS ONLY`;
        }
    }
    return {completeQuery, fullSQL, wherePartSql};
}

function getWarehousingQuery(viewQueryType: ViewQueryTypes, completeQuery: string,
                             selColValues: string[], DB_TABLE_PREFIX: string,
                             secondaryKey: string | undefined, PRIMARY_KEY: string,
                             secondaryValue: string | undefined, SECONDARY_KEY: string | undefined,
                             offsetRowCount: number | undefined, fetchRowCount: number | undefined,
                             firstUniqueColumn: string, ORDER_BY_COLUMN: string, ORDER_BY_DIRECTION_VALUE: string,
                             fullSQL: boolean, pageNumber: number, FETCH_ROW_COUNT: number) {

    if (viewQueryType === ViewQueryTypes.DETAIL_TABLE) {
        completeQuery = `SELECT `;
        for (let item in selColValues) {
            completeQuery += `AA.${selColValues[item]},`;
        }
        completeQuery = completeQuery.substr(0, completeQuery.length - 1);
        completeQuery += ` FROM ${DB_TABLE_PREFIX}WAREHOUSING AA `;
        if (PRIMARY_KEY) {
            completeQuery += `WHERE AA.${PRIMARY_KEY} = @PRIMARY_VALUE `;
        }
        if (secondaryKey && (secondaryKey !== "FULL") && secondaryValue) {
            completeQuery += ` AND AA.${SECONDARY_KEY} = @SECONDARY_VALUE `;
        }
        if (offsetRowCount !== undefined && fetchRowCount !== undefined && firstUniqueColumn) {
            completeQuery += `ORDER BY AA.${ORDER_BY_COLUMN} ${ORDER_BY_DIRECTION_VALUE} 
                            OFFSET @OFFSET_ROW_COUNT ROWS FETCH NEXT @FETCH_ROW_COUNT ROWS ONLY`;
        }
        fullSQL = true;

    } else if (viewQueryType === ViewQueryTypes.MAIN_TABLE) {
        // get full table data for left table view
        completeQuery = `SELECT DISTINCT ITMNUM, (SELECT SUM(QTY) FROM ${DB_TABLE_PREFIX}WAREHOUSING
                                    WHERE ITMNUM = WH.ITMNUM AND STATUS_POS = 'A') AS 'QTY'
                                    FROM ${DB_TABLE_PREFIX}WAREHOUSING WH `;
        if (offsetRowCount !== undefined && fetchRowCount !== undefined && firstUniqueColumn) {
            completeQuery += `ORDER BY ${ORDER_BY_COLUMN} ${ORDER_BY_DIRECTION_VALUE}
                                    OFFSET (${pageNumber})*${FETCH_ROW_COUNT} ROWS 
                                    FETCH NEXT @FETCH_ROW_COUNT ROWS ONLY`;
        }
        fullSQL = true;
    }
    return {completeQuery, fullSQL};
}

function getComponentsQuery(viewQueryType: ViewQueryTypes, completeQuery: string, selColValues: string[],
                            DB_TABLE_PREFIX: string,
                            secondaryKey: string | undefined, PRIMARY_KEY: string,
                            offsetRowCount: number | undefined, fetchRowCount: number | undefined,
                            firstUniqueColumn: string, ORDER_BY_COLUMN: string, ORDER_BY_DIRECTION_VALUE: string,
                            fullSQL: boolean, pageNumber: number, FETCH_ROW_COUNT: number) {

    if (viewQueryType === ViewQueryTypes.DETAIL_TABLE) {
        // if (secondaryKey) {
        // detail view query for detail table view and form view
        completeQuery = `SELECT ID,ITMNUM,COMPNUM,DIST_QTY FROM ` + DB_TABLE_PREFIX + `DIST_COMPONENTS 
                            WHERE ` + PRIMARY_KEY + ` = @PRIMARY_VALUE `;
        // }
    } else if (viewQueryType === ViewQueryTypes.MAIN_TABLE) {
        // table query for left table view
        completeQuery = `SELECT DISTINCT ITMNUM, (SELECT SUM(DIST_QTY) FROM ` + DB_TABLE_PREFIX + `DIST_COMPONENTS 
                                    WHERE ITMNUM = WH.ITMNUM) AS 'DIST_QTY', 
        (SELECT TOP 1 ID FROM ` + DB_TABLE_PREFIX + `DIST_COMPONENTS WHERE ITMNUM = WH.ITMNUM) AS 'ID', 
        (SELECT TOP 1 COMPNUM FROM ` + DB_TABLE_PREFIX + `DIST_COMPONENTS WHERE ITMNUM = WH.ITMNUM) AS 'COMPNUM'
                                    FROM ` + DB_TABLE_PREFIX + `DIST_COMPONENTS WH `;
    }
    if (offsetRowCount !== undefined && fetchRowCount !== undefined && firstUniqueColumn) {
        completeQuery += `ORDER BY ` + ORDER_BY_COLUMN + ` ` + ORDER_BY_DIRECTION_VALUE + `
                                    OFFSET (` + pageNumber + `)*` + FETCH_ROW_COUNT + ` ROWS 
                                    FETCH NEXT @FETCH_ROW_COUNT ROWS ONLY`;
    }
    fullSQL = true;
    return {completeQuery, fullSQL};
}

function getProdComponents(viewQueryType: ViewQueryTypes, primaryKey: string, primaryValue: string,
                           secondaryKey: string | undefined, secondaryValue: string | undefined, completeQuery: string,
                           selColValues: string[], DB_TABLE_PREFIX: string,
                           FIRST_UNIQUE_COLUMN: string, SECOND_UNIQUE_COLUMN: string | undefined,
                           fullSQL: boolean, offsetRowCount: number | undefined, fetchRowCount: number | undefined,
                           ORDER_BY_COLUMN: string, ORDER_BY_DIRECTION_VALUE: string,
                           PAGE_NUMBER: number, FETCH_ROW_COUNT: number) {

    if (viewQueryType === ViewQueryTypes.DETAIL_TABLE) {
        if (primaryKey && primaryValue) {
            if (secondaryKey && secondaryValue) {
                completeQuery = `SELECT `;
                for (let item in selColValues) {
                    completeQuery += `AA.` + selColValues[item] + `,`;
                }
                // remove last comma
                completeQuery = completeQuery.substr(0, completeQuery.length - 1);
                completeQuery += ` FROM ` + DB_TABLE_PREFIX + `PROD_COMPONENTS AA 
                            WHERE AA.` + FIRST_UNIQUE_COLUMN + ` = @PRIMARY_VALUE `;
                if (secondaryKey !== "FULL") {
                    completeQuery += ` AND AA.` + SECOND_UNIQUE_COLUMN + ` = @SECONDARY_VALUE `;
                }
                fullSQL = true;
            } else {
                completeQuery = `SELECT ITMNUM,COMPNUM,PROD_QTY,PROD_UNIT FROM ` + DB_TABLE_PREFIX +
                    `PROD_COMPONENTS WHERE ` + FIRST_UNIQUE_COLUMN + ` = @PRIMARY_VALUE `;
                fullSQL = true;
            }
        }
    } else if (viewQueryType === ViewQueryTypes.MAIN_TABLE) {
        completeQuery = `SELECT DISTINCT ITMNUM, PROD_UNIT, (SELECT TOP 1 PC1.COMPNUM FROM ` + DB_TABLE_PREFIX + `PROD_COMPONENTS PC1 
                                    WHERE PC1.ITMNUM = WH.ITMNUM) AS 'COMPNUM', 
                                    (SELECT COUNT(PC2.COMPNUM) FROM ` + DB_TABLE_PREFIX + `PROD_COMPONENTS PC2 
                                    WHERE PC2.ITMNUM = WH.ITMNUM) AS 'PROD_QTY' 
                                    FROM ` + DB_TABLE_PREFIX + `PROD_COMPONENTS WH `;
        fullSQL = true;
    }
    if (offsetRowCount !== undefined && fetchRowCount !== undefined && primaryKey) {
        completeQuery += `ORDER BY ` + ORDER_BY_COLUMN + ` ` + ORDER_BY_DIRECTION_VALUE + `       
                                        OFFSET (` + PAGE_NUMBER + `)*` + FETCH_ROW_COUNT + `
                                        ROWS FETCH NEXT @FETCH_ROW_COUNT ROWS ONLY;`;
    }
    return {completeQuery, fullSQL};
}

function getArticlesQuery(viewQueryType: ViewQueryTypes, completeQuery: string, selColValues: string[],
                          DB_TABLE_PREFIX: string,
                          primaryKey: string, primaryValue: string,
                          secondaryKey: string | undefined, secondaryValue: string | undefined,
                          PRIMARY_KEY: string, SECONDARY_KEY: string | undefined,
                          offsetRowCount: number | undefined,
                          fetchRowCount: number | undefined, ORDER_BY_COLUMN: string, ORDER_BY_DIRECTION_VALUE: string,
                          fullSQL: boolean, PAGE_NUMBER: number, FETCH_ROW_COUNT: number) {
    completeQuery = `SELECT `;
    for (let item in selColValues) {
        completeQuery += `AA.` + selColValues[item] + `,`;
    }
    completeQuery = completeQuery.substr(0, completeQuery.length - 1);
    if (viewQueryType === ViewQueryTypes.DETAIL_TABLE) {
        completeQuery += `,AA.CROSSSELLING AS CROSSSELLING_ID, BB.CROSSSELLING_DATA AS CROSSSELLING 
                                 FROM ` + DB_TABLE_PREFIX + `ITEM_BASIS AA 
                                 LEFT JOIN ` + DB_TABLE_PREFIX + `CROSSSELLING BB ON BB.CROSSSELLING_ID = AA.CROSSSELLING `;
    } else {
        completeQuery += ` FROM ` + DB_TABLE_PREFIX + `ITEM_BASIS AA `;
    }
    if ((viewQueryType === ViewQueryTypes.DETAIL_TABLE) && primaryKey && primaryValue) {
        if (secondaryKey && secondaryValue) {
            completeQuery += `WHERE AA.` + PRIMARY_KEY + ` = @PRIMARY_VALUE AND 
                                        AA.` + SECONDARY_KEY + ` = @SECONDARY_VALUE `;
        } else {
            completeQuery += `WHERE AA.` + PRIMARY_KEY + ` = @PRIMARY_VALUE `;
        }
    }
    if (offsetRowCount !== undefined && fetchRowCount !== undefined) {
        completeQuery += `ORDER BY AA.` + ORDER_BY_COLUMN + ` ` + ORDER_BY_DIRECTION_VALUE + `
                                OFFSET (` + PAGE_NUMBER + `)*` + FETCH_ROW_COUNT + `
                                ROWS FETCH NEXT @FETCH_ROW_COUNT ROWS ONLY;`;
    }
    fullSQL = true;
    return {completeQuery, fullSQL};
}

function getArticleAttributesQuery(completeQuery: string, DB_TABLE_PREFIX: string, ORDER_BY_DIRECTION_VALUE: string,
                                   fullSQL: boolean) {
    completeQuery = `SELECT ATTRIBUTE_ID, BB.ATTRIBUTE_NAME, BB.ATTRIBUTE_DATA 
                            FROM ` + DB_TABLE_PREFIX + `ATTRIBUTE_RELATIONS AA 
                            LEFT JOIN ` + DB_TABLE_PREFIX + `ATTRIBUTES BB ON BB.ID = AA.ATTRIBUTE_ID 
                            LEFT JOIN ` + DB_TABLE_PREFIX + `ATTRIBUTE_NAMES CC ON CC.ATTRIBUTE_NAME = BB.ATTRIBUTE_NAME 
                            WHERE AA.ITEM_BASIS_ID = @PRIMARY_VALUE 
                            ORDER BY CC.ID ` + ORDER_BY_DIRECTION_VALUE;
    // Sort by ID order of ATTRIBUTE_NAMES // " + orderByColumn + "
    fullSQL = true;
    return {completeQuery, fullSQL};
}

function getPriceListSalesQuery(viewQueryType: ViewQueryTypes,
                                completeQuery: string,
                                DB_TABLE_PREFIX: string,
                                selColValues: string[],
                                primaryKey: string,
                                primaryValue: string,
                                secondaryKey: string | undefined,
                                secondaryValue: string | undefined,
                                PRIMARY_KEY: string,
                                SECONDARY_KEY: string | undefined,
                                offsetRowCount: number | undefined,
                                fetchRowCount: number | undefined,
                                fullSQL: boolean,
                                PAGE_NUMBER: number,
                                FETCH_ROW_COUNT: number,
                                ORDER_BY_COLUMN: string,
                                ORDER_BY_DIRECTION_VALUE: string) {
    completeQuery = `SELECT `;
    if (viewQueryType === ViewQueryTypes.MAIN_TABLE) {
        completeQuery += `DISTINCT PRILIST, CUSGRP`;
    } else {
        for (let item in selColValues) {
            completeQuery += `AA.` + selColValues[item] + `,`;
        }
        completeQuery = completeQuery.substr(0, completeQuery.length - 1);
    }
    completeQuery += ` FROM ` + DB_TABLE_PREFIX + `PRILISTS AA `;
    if ((viewQueryType === ViewQueryTypes.DETAIL_TABLE) && primaryKey && primaryValue) {
        if (secondaryKey && secondaryValue) {
            completeQuery += `WHERE AA.` + PRIMARY_KEY + ` = @PRIMARY_VALUE AND 
                                        AA.` + SECONDARY_KEY + ` = @SECONDARY_VALUE 
                                        ORDER BY ITMNUM ASC`;
        }
    }
    if (offsetRowCount !== undefined && fetchRowCount !== undefined) {
        completeQuery += `ORDER BY PRILIST ` + ORDER_BY_DIRECTION_VALUE + `, CUSGRP ASC
                                OFFSET (` + PAGE_NUMBER + `)*` + FETCH_ROW_COUNT + `
                                ROWS FETCH NEXT @FETCH_ROW_COUNT ROWS ONLY;`;
    }
    fullSQL = true;
    return {completeQuery, fullSQL};
}

function getDefaultTableQuery(viewQueryType: ViewQueryTypes,
                              primaryKey: string, primaryValue: string,
                              secondaryKey: string | undefined, secondaryValue: string | undefined,
                              wherePartSql: string,
                              PRIMARY_KEY: string, SECONDARY_KEY: string | undefined,
                              refTable: string,
                              offsetRowCount: number | undefined, fetchRowCount: number | undefined,
                              ORDER_BY_COLUMN: string, ORDER_BY_DIRECTION_VALUE: string, PAGE_NUMBER: number,
                              FETCH_ROW_COUNT: number, orderByColumn: string, orderByDirection: string) {
    console.log('getDefaultTableQuery... ', primaryKey + ' - ' + primaryValue + ' queryType: ' + viewQueryType);
    if (viewQueryType === ViewQueryTypes.DETAIL_TABLE) {
        if (primaryKey && primaryValue) {
            if (secondaryKey &&
                (secondaryValue || (!secondaryValue && (refTable === 'customersAddrDlv' || refTable === 'customersAddrInv')))) {
                wherePartSql += `WHERE ${PRIMARY_KEY} = @PRIMARY_VALUE AND ${SECONDARY_KEY} = @SECONDARY_VALUE `;
            } else {
                wherePartSql += `WHERE ${PRIMARY_KEY} = @PRIMARY_VALUE `;
            }
        } else {
            console.log('>>> ELSE - NO WHERE ADDITIONS... ');
            // customers - because both types (b2c/b2b) are in same table
            if ((refTable === 'custbtwoc') || (refTable === 'custbtwob')) {
                if (secondaryKey && secondaryValue) {
                    wherePartSql += `WHERE ${SECONDARY_KEY} = @SECONDARY_VALUE `;
                }
            }
        }
    } else if ((refTable === 'custbtwoc') || (refTable === 'custbtwob')) {
        // customers - because both types (b2c/b2b) are in same table
        if (secondaryKey && secondaryValue) {
            wherePartSql += `WHERE ${SECONDARY_KEY} = @SECONDARY_VALUE `;
        }
    }
    if (refTable !== 'tablelocks') {
        if (offsetRowCount !== undefined && fetchRowCount !== undefined && primaryKey) {
            wherePartSql += `ORDER BY ${ORDER_BY_COLUMN} ${ORDER_BY_DIRECTION_VALUE}
                                OFFSET (${PAGE_NUMBER})*${FETCH_ROW_COUNT}
                                ROWS FETCH NEXT @FETCH_ROW_COUNT ROWS ONLY`;
        } else {
            if (orderByColumn !== undefined && orderByDirection !== undefined) {
                wherePartSql += `ORDER BY ${ORDER_BY_COLUMN} ${ORDER_BY_DIRECTION_VALUE}`;
            }
        }
    }
    return wherePartSql;
}

/**
 * get new item check query - check if there are items with provided parameters already availablein db
 *
 * @param viewQueryType
 * @param primaryKey
 * @param primaryValue
 * @param secondaryKey
 * @param secondaryValue
 * @param wherePartSql
 * @param PRIMARY_KEY
 * @param SECONDARY_KEY
 */
function getNewItemCheckQuery(viewQueryType: ViewQueryTypes, primaryKey: string, primaryValue: string,
                              secondaryKey: string | undefined, secondaryValue: string | undefined,
                              wherePartSql: string, PRIMARY_KEY: string, SECONDARY_KEY: string | undefined) {
    if (viewQueryType === ViewQueryTypes.NEW_ITEM) {
        if (primaryKey && primaryValue) {
            if (secondaryKey && secondaryValue) {
                wherePartSql += `WHERE ${PRIMARY_KEY} = @PRIMARY_VALUE AND ${SECONDARY_KEY} = @SECONDARY_VALUE `;
            } else {
                wherePartSql += `WHERE ${PRIMARY_KEY} = @PRIMARY_VALUE `;
            }
        } else if (secondaryKey && secondaryValue) {
            wherePartSql += `WHERE ${SECONDARY_KEY} = @SECONDARY_VALUE `;
        }
    }
    return wherePartSql;
}

/**
 * get reduced column list
 *
 * @param primaryKey - primary key = column name to remove: COUNTRY_ID
 * @param tableTemplateDetailView - TABLE_TEMPLATES > DETAIL_VIEW values: "COUNTRY_ID,COUNTRY_NAME,COUNTRY_ISO_CODE"
 */
function getReducedColumnList(primaryKey: string, tableTemplateDetailView: string) {
    let splitTableTemplateDetailView = tableTemplateDetailView.split(',');
    let tableTemplateDetailViewWithNoPrimaryColumn: string = '';
    for (let sTItem in splitTableTemplateDetailView) {
        if (splitTableTemplateDetailView.hasOwnProperty(sTItem) &&
            (splitTableTemplateDetailView[sTItem] !== primaryKey)) {
            tableTemplateDetailViewWithNoPrimaryColumn += splitTableTemplateDetailView[sTItem].trim() + ',';
        }
    }
    if (tableTemplateDetailViewWithNoPrimaryColumn.length > 0) {
        tableTemplateDetailViewWithNoPrimaryColumn = tableTemplateDetailViewWithNoPrimaryColumn.substring(0,
            tableTemplateDetailViewWithNoPrimaryColumn.length - 1);
    }
    return tableTemplateDetailViewWithNoPrimaryColumn;
}

/**
 * Insert table
 *
 * @param refTable - TABLE_TEMPLATES > REF_TABLE value: countries
 * @param tableName - TABLE_TEMPLATES > TABLE_NAME value: COUNTRIES
 * @param primaryKey - primary key: this key need to be removed from column list
 * @param isIdentity - is primary key an IDENTITY field ([ID] [int] IDENTITY(1,1) NOT NULL)
 * @param elementsArray - form fields elements to insert: { COUNTRY_NAME: 'testland', COUNTRY_ISO_CODE: 'AB' }
 */
export async function insertTableMethod(refTable: string, tableName: string, primaryKey: string, isIdentity: boolean,
                                        elementsArray: any): Promise<{ success: boolean, message: string, data: [] }> {
    // console.log('insertTableMethod - refTable: ', refTable);
     console.log('elementsArray: ', elementsArray);
    let result: any = null;
    let tableTemplate: any = await mssql_call_get_table_name_and_detail_view(refTable);
    if (!tableTemplate) {
        return { success: false, message: 'tableTemplate', data: [] };
    }
    // const TABLE_NAME_VALUE: string = tableTemplate[0]['TABLE_NAME'];
    const TABLE_NAME_VALUE: string = tableName;
    //const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    const DB_TABLE_PREFIX: string = process.env.DATABASE +  '.dbo.';
    if ((refTable.toUpperCase() === 'CUSTBTWOC') || (refTable.toUpperCase() === 'CUSTBTWOB')) { // 'CUSTOMERS'
        let newCusNumber: string = await getNewListNumber(constants.NEW_LINE_ITEM.CUSTOMER);
        if (newCusNumber) {
            elementsArray['CUSTOMERS_NUMBER'] = newCusNumber;
            const TABLE_DETAIL_VIEW: string[] = tableTemplate[0]['DETAIL_VIEW'].split(',');
            let query: string = `INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE +
                ` (` + tableTemplate[0]['DETAIL_VIEW'] + `) VALUES `;
            result = await execInsertMethod(TABLE_DETAIL_VIEW, elementsArray, query, TABLE_NAME_VALUE);
        } else {
            console.log('CUSTOMERS_NUMBER not generated...');
            return { success: false, message: 'CUSTOMERS_NUMBER not generated...', data: [] };
        }
    } else if ((refTable.toUpperCase() === 'CUSTOMERSADDRDLV') || (refTable.toUpperCase() === 'CUSTOMERSADDRINV') ||
        (refTable.toUpperCase() === 'PRICELISTSALES') || (refTable.toUpperCase() === 'WAREHOUSING') ||
        (refTable.toUpperCase() === 'ATTRIBUTES') || (refTable.toUpperCase() === 'COMPONENTS')) {
        tableTemplate[0]['DETAIL_VIEW'] =
            tableTemplate[0]['DETAIL_VIEW'].toString().substr(
                3, tableTemplate[0]['DETAIL_VIEW'].toString().length); // remove ID
        const TABLE_DETAIL_VIEW: string[] = tableTemplate[0]['DETAIL_VIEW'].split(',');
        let query: string = `INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE +
            ` (` + tableTemplate[0]['DETAIL_VIEW'] + `) VALUES `;
        result = await execInsertMethod(TABLE_DETAIL_VIEW, elementsArray, query, TABLE_NAME_VALUE);
    } else if (refTable.toUpperCase() === 'ARTICLES') {
        // remove ID from query, because it will automatically generated => [ID] [int] IDENTITY(1,1) NOT NULL,
        let idText = 'ID,';
        tableTemplate[0]['DETAIL_VIEW'] =
            tableTemplate[0]['DETAIL_VIEW'].toString().substr(
                idText.length, tableTemplate[0]['DETAIL_VIEW'].toString().length);
        tableTemplate[0]['DETAIL_VIEW'] += ",CROSSSELLING";
        const TABLE_DETAIL_VIEW: string[] = tableTemplate[0]['DETAIL_VIEW'].split(',');
        let query: string = `INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE +
            ` (` + tableTemplate[0]['DETAIL_VIEW'] + `) VALUES `;
        let crossData: string = elementsArray['CROSSSELLING'];
        elementsArray['CROSSSELLING'] = null;
        let articleResult: any = await execInsertMethod(TABLE_DETAIL_VIEW, elementsArray, query, TABLE_NAME_VALUE);
        if (crossData && crossData.length > 0) {
            let lastArticleIDResult: any = await mssql_last_table_id(TABLE_NAME_VALUE, "ID",
                undefined, undefined);
            result = await insertCrossselling(lastArticleIDResult, crossData, tableTemplate);
        } else {
            result = articleResult;
        }
    } else if (refTable.toUpperCase() === 'ORDERS') {
        const TABLE_DETAIL_VIEW: string[] = tableTemplate[0]['DETAIL_VIEW'].split(',');
        let query: string = `INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE +
            ` (` + tableTemplate[0]['DETAIL_VIEW'] + `) VALUES `; // CUSTOMERS_COMPANY,
        elementsArray['ORDERS_NUMBER'] = await getNewListNumber(constants.NEW_LINE_ITEM.ORDER, elementsArray['SALES_LOCATION']);
        // do check if new ORDERS_NUMBER already exists...
        const isOrdersNumberExisting: boolean = await mssql_is_order_number_existing(elementsArray['ORDERS_NUMBER']);
        if (!isOrdersNumberExisting) {
            result = await execInsertMethod(TABLE_DETAIL_VIEW, elementsArray, query, TABLE_NAME_VALUE);
        } else {
            return { success: false, message: 'ORDERS_NUMBER ' + elementsArray['ORDERS_NUMBER'] +
                    ' already existing.', data: [] };
        }
    } else if (refTable.toUpperCase() === 'INVOICE') {
        const TABLE_DETAIL_VIEW: string[] = tableTemplate[0]['DETAIL_VIEW'].split(',');
        let query: string = `INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE +
            ` (` + tableTemplate[0]['DETAIL_VIEW'] + `) VALUES `;
        elementsArray['INVOICES_NUMBER'] = await getNewListNumber(constants.NEW_LINE_ITEM.INVOICE, elementsArray['SALES_LOCATION']);
        // do check if new INVOICES_NUMBER already exists...
        const isInvoicesNumberExisting: boolean = await mssql_is_invoices_number_existing(elementsArray['INVOICES_NUMBER']);
        if (!isInvoicesNumberExisting) {
            result = await execInsertMethod(TABLE_DETAIL_VIEW, elementsArray, query, TABLE_NAME_VALUE);
        } else {
            return { success: false, message: 'INVOICES_NUMBER ' + elementsArray['INVOICES_NUMBER'] +
                    ' already existing.', data: [] };
        }
    } else if ((refTable.toUpperCase() === 'ORDERPOSITION') || (refTable.toUpperCase() === 'DELIVERYNOTEPOSITIONS')
        // || (refTable.toUpperCase() === 'INVOICEPOSITIONS')
    ) {
        // Moved to Order
    } else if (refTable.toUpperCase() === 'CURRENCIES') {
        let currencyId = 'CURRENCY_ID,';
        tableTemplate[0]['DETAIL_VIEW'] =
            tableTemplate[0]['DETAIL_VIEW'].toString().substr(
                currencyId.length, tableTemplate[0]['DETAIL_VIEW'].toString().length); // remove ID
        const TABLE_DETAIL_VIEW: string[] = tableTemplate[0]['DETAIL_VIEW'].split(',');
        let query: string = `INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE +
            ` (` + tableTemplate[0]['DETAIL_VIEW'] + `) VALUES `;
        result = await execInsertMethod(TABLE_DETAIL_VIEW, elementsArray, query, TABLE_NAME_VALUE);
    } else if (refTable === 'csvTemplateConfig') {
        let currencyId = 'CSVCONFIG_ID,';
        tableTemplate[0]['DETAIL_VIEW'] =
            tableTemplate[0]['DETAIL_VIEW'].toString().substr(
                currencyId.length, tableTemplate[0]['DETAIL_VIEW'].toString().length); // remove ID
        const TABLE_DETAIL_VIEW: string[] = tableTemplate[0]['DETAIL_VIEW'].split(',');
        let query: string = `INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE +
            ` (` + tableTemplate[0]['DETAIL_VIEW'] + `) VALUES `;
        result = await execInsertMethod(TABLE_DETAIL_VIEW, elementsArray, query, TABLE_NAME_VALUE);
    } else if (refTable === 'csvTemplateConfigFieldTmp') {
        let query: string = `INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE +
            ` (` + tableTemplate[0]['DETAIL_VIEW'] + `) VALUES `;
        const TABLE_DETAIL_VIEW: string[] = tableTemplate[0]['DETAIL_VIEW'].split(',');
        result = await execInsertMethod(TABLE_DETAIL_VIEW, elementsArray, query, TABLE_NAME_VALUE);
    } else if (refTable === 'importTypes') {
        let tmpId = 'ID,';
        tableTemplate[0]['DETAIL_VIEW'] =
            tableTemplate[0]['DETAIL_VIEW'].toString().substr(
                tmpId.length, tableTemplate[0]['DETAIL_VIEW'].toString().length); // remove ID
        const TABLE_DETAIL_VIEW: string[] = tableTemplate[0]['DETAIL_VIEW'].split(',');
        let query: string = `INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE +
            ` (` + tableTemplate[0]['DETAIL_VIEW'] + `) VALUES `;
        result = await execInsertMethod(TABLE_DETAIL_VIEW, elementsArray, query, TABLE_NAME_VALUE);
    } else if (refTable === 'importTypesRefTables') {
        let tmpId = 'ID,';
        tableTemplate[0]['DETAIL_VIEW'] =
            tableTemplate[0]['DETAIL_VIEW'].toString().substr(
                tmpId.length, tableTemplate[0]['DETAIL_VIEW'].toString().length); // remove ID
        const TABLE_DETAIL_VIEW: string[] = tableTemplate[0]['DETAIL_VIEW'].split(',');
        let query: string = `INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE +
            ` (` + tableTemplate[0]['DETAIL_VIEW'] + `) VALUES `;
        result = await execInsertMethod(TABLE_DETAIL_VIEW, elementsArray, query, TABLE_NAME_VALUE);
    } else if (refTable === 'importTypeConstants') {
        let tmpID = 'ID,';
        tableTemplate[0]['DETAIL_VIEW'] =
            tableTemplate[0]['DETAIL_VIEW'].toString().substr(
                tmpID.length, tableTemplate[0]['DETAIL_VIEW'].toString().length); // remove ID
        const TABLE_DETAIL_VIEW: string[] = tableTemplate[0]['DETAIL_VIEW'].split(',');
        let query: string = `INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE +
            ` (` + tableTemplate[0]['DETAIL_VIEW'] + `) VALUES `;
        result = await execInsertMethod(TABLE_DETAIL_VIEW, elementsArray, query, TABLE_NAME_VALUE);
    } else {
        let reducedColumnList: string = tableTemplate[0]['DETAIL_VIEW'];
        if (isIdentity) {
            reducedColumnList = getReducedColumnList(primaryKey, tableTemplate[0]['DETAIL_VIEW']);
        }
        const TABLE_DETAIL_VIEW: string[] = reducedColumnList.split(',');
        let query: string = `INSERT INTO ` + DB_TABLE_PREFIX + TABLE_NAME_VALUE +
            ` (` + reducedColumnList + `) VALUES `;
        console.log('DEFAULT query: ', query);
        result = await execInsertMethod(TABLE_DETAIL_VIEW, elementsArray, query, TABLE_NAME_VALUE);
    }
    return {success: (result === undefined || result === 'undefined') ? true : false, message: '', data: []};
}

/**
 * Update table
 *
 * @param refTable 'providers'
 * @param tableName 'PROVIDERS'
 * @param elementsArray
 * @param primaryKey 'PROVIDERS_NAME'
 * @param primaryValue 'Muster Provider'
 * @param secondaryKey optional 'COMPNUM'
 * @param secondaryValue optional 'B143010104DE'
 * @param thirdKey
 * @param thirdValue
 */
export async function updateTableMethod(refTable: string, tableName: string, elementsArray: any, primaryKey: string,
                                        primaryValue: string, secondaryKey: string, secondaryValue: any,
                                        thirdKey: string, thirdValue: string):
    Promise<{ success: boolean, message: string, data: [] }> {
    let crosssellingId: string;
    let crosssellingData: string;
    if (refTable === 'dialogStockTransfer') {
        await setStockTransfer(primaryValue, elementsArray);
        return { success: true, message: '', data: [] };
    } else if (refTable === 'articlesAttributes') { // articles attributes
        const result = await updateAttributes(primaryValue, secondaryValue, elementsArray);
        return { success: (result === undefined) ? true : false, message: 'tableTemplate', data: [] };
    } else {
        let tableTemplate: any = await mssql_call_get_table_name_and_detail_view(refTable);
        if (!tableTemplate) {
            return { success: false, message: 'tableTemplate', data: [] };
        }
        const TABLE_NAME_VALUE: string = tableTemplate[0]['TABLE_NAME'];
        const TABLE_DETAIL_VIEW: string[] = tableTemplate[0]['DETAIL_VIEW'].split(',');
        const PRIMARY_KEY_VALUE: string = getItemForQuery([primaryKey], primaryColumnTypes);
        const SECONDARY_KEY_VALUE: string = getItemForQuery([secondaryKey], primaryColumnTypes);
        let inputParamsArray: { name: string, type: any, value: any }[] = [
            {name: 'PRIMARY_VALUE', type: sql.VarChar, value: primaryValue},
            {name: 'SECONDARY_VALUE', type: sql.VarChar, value: secondaryValue}];
        const IPN_PREFIX: string = 'IPN';
        const IPN_DELIMITER: string = '_';
        let iPNKeyCntr: number = 0;
        let inputName: string = ``;
        let query = `UPDATE ` + constants.DB_TABLE_PREFIX + TABLE_NAME_VALUE + ` SET `;
        let values: string = ``;

        const dataTypes: [] = await mssql_call_get_table_data_types(TABLE_NAME_VALUE);
        const tableColumnsData: {} = getTableColumnsTypes(dataTypes, TABLE_DETAIL_VIEW);
        for (let key in tableColumnsData) {
            if (tableColumnsData.hasOwnProperty(key)) {
                if (key in elementsArray) {
                    inputName = `${IPN_PREFIX}${IPN_DELIMITER}${iPNKeyCntr}${IPN_DELIMITER}${key}`;
                    inputParamsArray.push({
                        name: inputName,
                        type: getFieldType(tableColumnsData[key].DATA_TYPE),
                        value: getFieldValue(tableColumnsData[key].DATA_TYPE,
                            elementsArray[key])
                    });
                    if (refTable === 'articles') {
                        if (key === 'CROSSSELLING') { // 'CROSSSELLING_DATA'
                            crosssellingData = elementsArray[key];
                            crosssellingId = secondaryValue;
                        } else {
                            values += key + ` = @${inputName}, `;
                        }
                    } else if (refTable === 'customersAddrDlv' || refTable === 'customersAddrInv' ||
                        refTable === 'priceListSales' || refTable === 'components') {
                        if (key !== 'ID') {  // ignore ID
                            values += key + ` = @${inputName}, `;
                        }
                    } else if (refTable === 'warehousing') {
                        if (key !== 'RESERVED') {  // ignore RESERVED
                            values += key + ` = @${inputName}, `;
                        }
                    } else {
                        values += key + ` = @${inputName}, `;
                    }
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
        query += values;
        query += ` WHERE ` + PRIMARY_KEY_VALUE + ` = @PRIMARY_VALUE`;
        // Use (form) secondary parameter only for insert mode...
        // if (secondaryKey && secondaryValue) {
        //     query += ` AND ` + SECONDARY_KEY_VALUE + ` = @SECONDARY_VALUE`;
        // }
        console.log('inputParamsArray: ', inputParamsArray);
        console.log('Update query: ', query);
        let result = await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
        let resultCrossselling: any;
        if (refTable === 'articles') {
            if (crosssellingData && crosssellingData.length > 0) {
                if (!crosssellingId) {
                    resultCrossselling = await insertCrossselling(primaryValue, crosssellingData, tableTemplate);
                } else if (crosssellingId) {
                    resultCrossselling = await updateCrossselling(crosssellingId, crosssellingData);
                }
            } else {
                if (crosssellingId) {
                    resultCrossselling = await updateCrossselling(crosssellingId, crosssellingData);
                }
            }
        }
        return {
            success: (result === undefined && resultCrossselling === undefined) ? true : false,
            message: '',
            data: []
        };
    }
}

/**
 * get missing fields
 *
 * @param detailViewFields
 * @param importTemplateFields
 * @param elementsArray
 * @param columnTypes
 */
export function getMissingFields(detailViewFields: any, importTemplateFields: any, elementsArray: any, columnTypes: any) {
    let diffFields: string = "";
    let found: boolean = false;
    if (detailViewFields && detailViewFields[0] && detailViewFields[0]['DETAIL_VIEW'] &&
        importTemplateFields && importTemplateFields[0] && importTemplateFields[0]['TEMPLATE_FIELDS']) {
        let splitedDetailViewFields = detailViewFields[0]['DETAIL_VIEW'].split(',');
        let splitedImportTemplateFields = importTemplateFields[0]['TEMPLATE_FIELDS'].split(',');
        for (let iTItem in splitedImportTemplateFields) {
            found = false;
            for (let dVItem in splitedDetailViewFields) {
                if (splitedImportTemplateFields[iTItem].trim() === splitedDetailViewFields[dVItem].trim()) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                diffFields += splitedImportTemplateFields[iTItem].trim() + ",";
                for (let cTItem in columnTypes) {
                    if (columnTypes.hasOwnProperty(cTItem)) {
                        if (columnTypes[cTItem].COLUMN_NAME === splitedImportTemplateFields[iTItem].trim()) {
                            let columnValue: any = null;
                            switch (columnTypes[cTItem].DATA_TYPE) {
                                case('nvarchar'):
                                    columnValue = "";
                                    break;
                                case('nchar'):
                                    columnValue = "";
                                    break;
                                case('bit'):
                                    columnValue = 0;
                                    break;
                                case('date'):
                                    columnValue = 0;
                                    break;
                                default:
                                    break;
                            }
                            elementsArray[splitedImportTemplateFields[iTItem].trim()] = columnValue;
                        }
                    }
                }
            }
        }
        if (diffFields.length > 0) {
            diffFields = "," + diffFields.substring(0, diffFields.length - 1);
        }
    }
    return {df: diffFields, ea: elementsArray};
}

/**
 * select from given table name
 *
 * @param tableName
 */
export async function mssql_select_TableByName(tableName: string) {
    let query: string = `SELECT * FROM ` + constants.DB_TABLE_PREFIX + tableName; // 1000 Einträge
    // let query: string = "select * from ` + constants.DB_TABLE_PREFIX + `ITEM_BASIS " +
    // "where ITMNUM = '" + "OPTIMOSET1006000104DE" + "';";
    // "where ITMNUM = '" + "TOSCANASET803000101DE" + "';";
    return await mssqlCall.mssqlCall(query);
}


/**
 * copy from one table to another
 *
 * @param tableName1
 * @param tableName2
 * @param columnsTo
 */
export async function mssql_copy_from_into_table(tableName1: string, tableName2: string, columnsTo: string) {
    let query: string = `INSERT INTO  ` + constants.DB_TABLE_PREFIX + tableName1 + '(' + columnsTo + ') ' + 'SELECT ' +  columnsTo + ' FROM ' + constants.DB_TABLE_PREFIX +  tableName2 ; // 1000 Einträge
    console.log('copy rows query ' + query);
    // let query: string = "select * from ` + constants.DB_TABLE_PREFIX + `ITEM_BASIS " +
    // "where ITMNUM = '" + "OPTIMOSET1006000104DE" + "';";
    // "where ITMNUM = '" + "TOSCANASET803000101DE" + "';";
    return await mssqlCall.mssqlCall(query);
}

/**
 * insert into temporary table
 *
 * @param idTempField
 * @param idTempConst
 */
export async function msql_insert_into_temp(idTempField: number, idTempConst: number) {
    let query: string = `INSERT INTO  ` + constants.DB_TABLE_PREFIX +
        `CSV_TEMPLATE_CONFIG_FIELD_LIST_TEMP (CSV_TEMPLATE_CONFIG_FIELD_ID, IMPORT_TYPE_CONSTANTS_ID) VALUES( ` +
        idTempField + `,` + idTempConst + ` ) `
    console.log('insert into temp ' + query);
    return await mssqlCall.mssqlCall(query);
}

/**
 * delete all rows from table
 *
 * @param tableName
 * @param columnsTo
 */
export async function mssql_delete_all_rows_table(tableName: string, columnsTo: string) {
    let query: string = `DELETE FROM  ` + constants.DB_TABLE_PREFIX + tableName; // 1000 Einträge
    console.log('delete rows from table ' + query);
    // let query: string = "select * from ` + constants.DB_TABLE_PREFIX + `ITEM_BASIS " +
    // "where ITMNUM = '" + "OPTIMOSET1006000104DE" + "';";
    // "where ITMNUM = '" + "TOSCANASET803000101DE" + "';";
    return await mssqlCall.mssqlCall(query);
}

/**
 * select table for form
 *
 * @param refTable
 * @param uniqueColumn
 * @param uniqueNumber
 * @param secondUniqueColumn
 * @param secondUniqueNumber
 * @param language
 * @param offsetRowCount
 * @param fetchRowCount
 * @param showAllFlag
 * @param pageNumber
 */
export async function mssql_select_table_for_form(refTable: string, uniqueColumn: string, uniqueNumber: string,
                                                  secondUniqueColumn: string | undefined,
                                                  secondUniqueNumber: string | undefined,
                                                  language: string, offsetRowCount: number,
                                                  fetchRowCount: number, showAllFlag: boolean,
                                                  pageNumber: number) {
    let orderByColumn: string = uniqueColumn;
    let orderByDirection: string = "ASC";
    let jsonResult: any = await mssql_select_Table_by_Number(refTable, ViewQueryTypes.PURE_SELECT,
        uniqueColumn, uniqueNumber, secondUniqueColumn,
        secondUniqueNumber, offsetRowCount, fetchRowCount, pageNumber, orderByColumn, orderByDirection);
    // let tableController = new TableController(refTable, jsonResult);
    // let currTable = tableController.getCurrentTable();
    // generate form fields object
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'REF_TABLE', type: sql.VarChar, value: refTable}];
    let lockedFields: any = await mssqlCall.mssqlCallEscaped(inputParamsArray,
        `SELECT LOCKED_FIELDS FROM ` + constants.DB_TABLE_PREFIX + `TABLE_TEMPLATES WHERE REF_TABLE = @REF_TABLE`);
    return await getThisLocalizeData(jsonResult['data'][1], language, lockedFields, refTable);
}

/**
 * delete table row
 *
 * @param tableName
 * @param primaryKey
 * @param primaryValue
 */
export async function mssql_delete_row(tableName: string, primaryKey: string, primaryValue: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'PRIMARY_VALUE', type: sql.VarChar, value: primaryValue}];
    const PRIMARY_KEY_VALUE: string = getItemForQuery([primaryKey], primaryColumnTypes);
    let query: string =
        `DELETE FROM ` + constants.DB_TABLE_PREFIX + tableName + ` WHERE ` + PRIMARY_KEY_VALUE + ` = @PRIMARY_VALUE`;
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
}

/**
 * Calculate offset and page of selected item
 * calculate page number from row number: go through items an "search" for page number (rowsNumberResult['PAGE'])
 * returns page number: for given 12 => 0, for 20 => 1, for 35 => 3
 *
 * @param offsetRowCount 1
 * @param fetchRowCount 14
 * @param maxRows 3
 * @param pageNumber 136 - calculated at mssql_count_all_rows function
 * @param clientPageNumber 1
 */
export function calcSelItemPageOffset(offsetRowCount: number, fetchRowCount: number, maxRows: number,
                                      pageNumber: number, clientPageNumber: number) {
    // calculate max pages: rounds up: 7.004 => 8
    const maxPages: number = Math.ceil(maxRows / fetchRowCount);
    // initialize with current offset value from client
    let pageOffsetFrom: undefined | number = offsetRowCount;
    // "search" for provided page number (of selected row)
    // starts with current clients page number
    let i: number = clientPageNumber;
    for (; i < maxPages; i++) {
        if (pageOffsetFrom <= pageNumber && (pageOffsetFrom + fetchRowCount) >= pageNumber) {
            return {offsetFrom: pageOffsetFrom, page: i};
        } else {
            if ((pageOffsetFrom + fetchRowCount) < pageNumber) {
                pageOffsetFrom += fetchRowCount;
            } else {
                return {offsetFrom: offsetRowCount, page: clientPageNumber};
            }
        }
    }
    // if page number was not found
    offsetRowCount = offsetRowCount * fetchRowCount;
    return {offsetFrom: offsetRowCount, page: clientPageNumber};
}

/**
 * get last added ID for given table
 *
 * @param tableName
 * @param columnName
 * @param uniqueColumnName
 * @param uniqueValue
 */
export async function mssql_last_table_id(tableName: string, columnName: string, uniqueColumnName: undefined | string,
                                          uniqueValue: undefined | string): Promise<any | 0> {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'TABLE_NAME', type: sql.VarChar, value: tableName.toUpperCase()},
        {name: 'CUSTOMERS_NUMBER_1', type: sql.VarChar, value: 'TESTETST'},
        {name: 'CUSTOMERS_NUMBER_2', type: sql.VarChar, value: 'COLLOVALD'},
        {name: 'CUSTOMERS_NUMBER_3', type: sql.VarChar, value: 'DE'},
        {name: 'UNIQUE_VALUE', type: sql.VarChar, value: uniqueValue},
        {name: 'COLUMN_NAME_UPPERCASE', type: sql.VarChar, value: columnName.toUpperCase()}];
    const TABLE_NAME_VALUE: string = constants.DB_TABLE_PREFIX + tableName.toUpperCase();
    const COLUMN_NAME_VALUE: string = getItemForQuery([columnName], primaryColumnTypes);
    const COLUMN_NAME_VALUE_CSV: string = columnName.toUpperCase();
    const UNIQUE_COLUMN_NAME_VALUE: undefined | string = uniqueColumnName ?
        getItemForQuery([uniqueColumnName], primaryColumnTypes) : undefined
    let query: string = `SELECT TOP 1 ` + COLUMN_NAME_VALUE + ` FROM ` + TABLE_NAME_VALUE + ` `;
    let query1: string = `SELECT TOP 1 ` + COLUMN_NAME_VALUE_CSV + ` FROM ` + TABLE_NAME_VALUE + ` `;
    let company = '';
    let searchNumber = '';
    if (uniqueValue) {
        company = await getCompanyBySalesLocation(uniqueValue) as string;
        searchNumber = `${company}${String(new Date().getFullYear()).slice(2)}`;
    }
    if (tableName.toUpperCase() === 'ORDERS') {
        searchNumber += `${constants.ORDER_TYPE_ID}`;
        query += ` WHERE ORDERS_NUMBER LIKE '${searchNumber}%' `;
    } else if (tableName.toUpperCase() === 'INVOICES') {
        searchNumber += `${constants.INVOICE_TYPE_ID}`;
        query += ` WHERE INVOICES_NUMBER LIKE '${searchNumber}%' `;
    } else if (tableName.toUpperCase() === 'CUSTOMERS') {
        query += `WHERE CUSTOMERS_NUMBER != @CUSTOMERS_NUMBER_1 AND CUSTOMERS_NUMBER != @CUSTOMERS_NUMBER_2 
        AND CUSTOMERS_NUMBER != @CUSTOMERS_NUMBER_3 `;
    } else if (tableName.toUpperCase() === 'CSV_TEMPLATE_CONFIG_FIELD' ||
        tableName.toUpperCase() === 'CSV_TEMPLATE_CONFIG_FIELD_TMP' ||
        tableName.toUpperCase() === 'CSV_TEMPLATE_CONFIG') {
        query1 += `WHERE  1 =  1 `;
        query1 += `ORDER BY ` + COLUMN_NAME_VALUE_CSV + ` DESC`;
    } else if (uniqueColumnName && uniqueValue) {
        query += `WHERE ` + UNIQUE_COLUMN_NAME_VALUE + ` = @UNIQUE_VALUE `;
    }
    query += `ORDER BY ` + COLUMN_NAME_VALUE + ` DESC`;
    console.log('mssql_last_table_id query: ', query);
    console.log('mssql_last_table_id query_csv: ', query1);
    let data: any;
    if (tableName.toUpperCase() === 'CSV_TEMPLATE_CONFIG_FIELD' ||
        tableName.toUpperCase() === 'CSV_TEMPLATE_CONFIG_FIELD_TMP' ||
        tableName.toUpperCase() === 'CSV_TEMPLATE_CONFIG') {
        data = await mssqlCall.mssqlCallEscaped(inputParamsArray, query1);
    } else {
        data = await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
    }
    return (data && data.length) ? data[0][columnName.toUpperCase()] : 0;
}

/**
 * get real table name existing in TABLE_TEMPLATES
 *
 * @param refTable
 */
function getVirtualTableNames(refTable: string) {
    if (refTable === constants.VIRTUAL_REFTABLE_ARTICLES_ATTRIBUTES) {
        return constants.REFTABLE_ARTICLES; // REFTABLE_ATTRIBUTES;
    } else if (refTable === constants.VIRTUAL_REFTABLE_COMPONENTS_DETAILS) {
        return constants.REFTABLE_COMPONENTS;
    } else if (refTable === constants.VIRTUAL_REFTABLE_WAREHOUSING_DETAILS) {
        return constants.REFTABLE_WAREHOUSING;
    } else {
        return refTable
    }
}

/**
 * returns mssql field type for given type name
 *
 * @param typeName - 'Int'
 */
export function getFieldType(typeName: string) {
    switch (typeName) {
        case('Int'):
            return sql.Int;
        case('Decimal'):
            return sql.NVarChar; //sql.Decimal(19, 5);
        case('VarChar'):
            return sql.VarChar;
        case('Bit'):
            return sql.Bit;
        case('SmallDateTime'):
            return sql.SmallDateTime;
        case('date'):
            return sql.Date;
        default:
            return sql.NVarChar;
    }
}

/**
 * returns mssql field formatted value for given type name
 *
 * @param typeName
 * @param value
 */
export function getFieldValue(typeName: string, value: string) {
    if (value) {
        switch (typeName) {
            case('Int'):
                return parseInt(value);
            case('Decimal'):
                return value;
            case('VarChar'):
                return value.toString();
            case('Bit'):
                return stringToBoolean(value);
            case('SmallDateTime'):
                return new Date(value);
            case('Date'):
                return new Date(value);
            default:
                return value;
        }
    } else if (value === '' && typeName === 'Int') {
        // If value === '' and type Int, so parseInt('') returns a number: NaN
        return parseInt(value);
    }
    return value;

}

/**
 * get last added ColumnValue for given table
 *
 * @param tableName
 * @param columnName
 * @param uniqueColumnName
 * @param uniqueValue
 */
export async function mssql_last_column_value(tableName: string, columnName: string, uniqueColumnName: undefined | string,
                                              uniqueValue: undefined | string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'TABLE_NAME', type: sql.VarChar, value: tableName.toUpperCase()},
        {name: 'UNIQUE_VALUE', type: sql.VarChar, value: uniqueValue},
        {name: 'COLUMN_NAME_UPPERCASE', type: sql.VarChar, value: columnName.toUpperCase()}];
    const TABLE_NAME_VALUE: string = constants.DB_TABLE_PREFIX + tableName.toUpperCase();
    const COLUMN_NAME_VALUE: string = columnName.toUpperCase();
    const UNIQUE_COLUMN_NAME_VALUE: undefined | string = uniqueColumnName ?
        getItemForQuery([uniqueColumnName], primaryColumnTypes) : undefined
    let query: string = `SELECT TOP 1 ` + COLUMN_NAME_VALUE + ` FROM ` + TABLE_NAME_VALUE + ` `;

    query += `ORDER BY ` + COLUMN_NAME_VALUE + ` DESC`;
    console.log('mssql_last_column_value query: ', query);

    let data: any

    data = await mssqlCall.mssqlCallEscaped(inputParamsArray, query);

    return (data && data.length) ? data[0][columnName.toUpperCase()] : 0;
}


/**
 * get last added ColumnValue for given table
 *
 * @param tableName
 * @param columnName
 * @param whereColumnValue
 * @param uniqueValue
 */
export async function update_column(tableName: string, columnName: string, whereColumnValue: string,
                                    uniqueValue: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'TABLE_NAME', type: sql.VarChar, value: tableName.toUpperCase()},
        {name: 'UNIQUE_VALUE', type: sql.VarChar, value: uniqueValue},
        {name: 'WHERE_COLUMN_VALUE', type: sql.VarChar, value: whereColumnValue},
        {name: 'COLUMN_NAME_UPPERCASE', type: sql.VarChar, value: columnName.toUpperCase()}];
    const TABLE_NAME_VALUE: string = constants.DB_TABLE_PREFIX + tableName.toUpperCase();
    const COLUMN_NAME: string = columnName.toUpperCase();
    const COLUMN_NAME_VALUE: string = uniqueValue;
    const WHERE_COLUMN: string = 'ID';
    const WHERE_COLUMN_VALUE: string = whereColumnValue;

    let query: string = `UPDATE  ` + TABLE_NAME_VALUE + ` SET  ` + COLUMN_NAME + ` = ` + COLUMN_NAME_VALUE + ` WHERE  ` + WHERE_COLUMN + ` = ` + WHERE_COLUMN_VALUE;

    console.log('mssql_update_column query: ', query);

    let data: any

    data = await mssqlCall.mssqlCallEscaped(inputParamsArray, query);

    return data;
}


/**
 * replace input parameters array value by given name and value
 *
 * @param inputParamsArray
 * @param name
 * @param primaryValue
 */
export function replaceInputParamsArrayValue(inputParamsArray: { name: string, type: any, value: any }[], name: string,
                                             primaryValue: any): { name: string, type: any, value: any }[] {
    for (let i = 0; i < inputParamsArray.length; i++) {
        if (inputParamsArray.hasOwnProperty(i) && inputParamsArray[i]?.name === name) {
            inputParamsArray[i].value = primaryValue;
            i = inputParamsArray.length;
        }
    }
    return inputParamsArray;
}

/**
 * convert string to boolean (mssql query)
 *
 * @param value
 */
export function stringToBoolean(value: string) {
    switch (value) {
        case "1":
            return 1;
        case "0":
            return 0;
        default:
            return value;
    }
}

/**
 * return true if given referral table name is a component with a table in detail view:
 *  - custom-table-tab-group: CUSTOMERS_ADDRESSES (DLV/INV)
 *  - custom-table-table: Warehousing, Taxes, ProductComponents, Attributes, ArticleComponents, SupplyOrdersComponent
 * @param refTable
 */
export function hasTableInDetailView(refTable: string) {
    return refTable === 'customersAddrDlv' || refTable === 'customersAddrInv' ||
        refTable === 'warehousing' || refTable === 'taxes' || refTable === 'prodComponents' ||
        refTable === 'attributes' || refTable === 'components';
}
