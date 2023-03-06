/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 01.06.2021 */

import * as sql from 'mssql';
import * as mssqlCall from '../../mssql_call';
import {constants} from '../../constants/constants';
import {getAlternativeStockTransferItems} from '../stock-transfer/StockTransfer';
import {checkDate} from '../date/Date';
import {addItemsToQuery, getItemForQuery,} from '../../helpers';
import {primaryColumnTypes, secondColumnTypes} from '../table/Table';

export enum searchColumnTypes {
    ID = 'ID' as any, // search at articles
    ORDERS_NUMBER = 'ORDERS_NUMBER' as any,
    DELIVERY_NOTES_NUMBER = 'DELIVERY_NOTES_NUMBER' as any,
    INVOICES_NUMBER = 'INVOICES_NUMBER' as any,
    CUSTOMERS_NUMBER = 'CUSTOMERS_NUMBER' as any,
    ITMNUM = 'ITMNUM' as any,
    LOC = 'LOC' as any,
    LOT = 'LOT' as any,
    COMPNUM = 'COMPNUM' as any,
    CURRENCY_NAME = 'CURRENCY_NAME' as any,
    COUNTRY_NAME = 'COUNTRY_NAME' as any,
    ATTRIBUTE_NAME = 'ATTRIBUTE_NAME' as any,
    PAYMENT_TERM_ID = 'PAYMENT_TERM_ID' as any,
    PROD_UNIT_NAME = 'PROD_UNIT_NAME' as any,
    TAX_NUMBER = 'TAX_NUMBER' as any,
    PRILIST = 'PRILIST' as any,
    CUSGRP = 'CUSGRP' as any,
    COMPANY = 'COMPANY'  as  any,
    TAXCODE = 'TAXCODE'  as any,
    LOCATION = 'LOCATION'  as  any,
    TAXRATE  =  'TAXRATE'  as   any,
}

enum articlesAdditionalColumnsTypes {
    ID = 'ID' as any,
    ITMDES = 'ITMDES' as any,
    EANCOD = 'EANCOD' as any
}

enum ordersAdditionalColumnsTypes {
    CUSTOMER_ORDER = 'CUSTOMER_ORDER' as any,
    ORDERS_DATE = 'ORDERS_DATE' as any,
    ORDERAMOUNT_BRU = 'ORDERAMOUNT_BRU' as any
}

enum deliveryNoteAdditionalColumnsTypes {
    CUSTOMERS_NUMBER = 'CUSTOMERS_NUMBER' as any,
    ORDERS_NUMBER = 'ORDERS_NUMBER' as any,
    SHIPPING_DATE = 'SHIPPING_DATE' as any,
    EXPORT_PRINT = 'EXPORT_PRINT' as any,
    DELIVERY_NOTES_STATE = 'DELIVERY_NOTES_STATE' as any,
    RELEASE = 'RELEASE' as any,
    CURRENCY = 'CURRENCY' as any
}

enum invoiceAdditionalColumnsTypes {
    INVOICES_CUSTOMER = 'INVOICES_CUSTOMER' as any,
    ORDERS_NUMBER = 'ORDERS_NUMBER' as any,
    DELIVERY_NOTES_NUMBER = 'DELIVERY_NOTES_NUMBER' as any,
    INVOICES_DATE = 'INVOICES_DATE' as any,
    INVOICES_STATE = 'INVOICES_STATE' as any,
    PAYMENT_TERM_ID = 'PAYMENT_TERM_ID' as any,
    PAYED = 'PAYED' as any,
    RELEASE = 'RELEASE' as any,
    CURRENCY = 'CURRENCY' as any
}

enum customersAdditionalColumnsTypes {
    CUSTOMERS_NUMBER = 'CUSTOMERS_NUMBER' as any,
    CUSTOMERS_COMPANY = 'CUSTOMERS_COMPANY' as any,
    CUSTOMERS_PRENAME = 'CUSTOMERS_PRENAME' as any,
    CUSTOMERS_NAME = 'CUSTOMERS_NAME' as any,
}

enum componentsAdditionalColumnsTypes {
    ID = 'ID' as any,
    ITMNUM = 'ITMNUM' as any,
    DIST_QTY = 'DIST_QTY' as any,
}

enum currenciesAdditionalColumnsTypes {
    CURRENCY_ID = 'CURRENCY_ID' as any,
    CURRENCY_ISO_CODE = 'CURRENCY_ISO_CODE' as any,
    CURRENCY_SYMBOL = 'CURRENCY_SYMBOL' as any
}

enum countriesAdditionalColumnsTypes {
    COUNTRY_ID = 'COUNTRY_ID' as any,
    COUNTRY_ISO_CODE = 'COUNTRY_ISO_CODE' as any
}

enum attributeNamesAdditionalColumnsTypes {
    ID = 'ID' as any,
}

enum paymentTermsAdditionalColumnsTypes {
    PAYMENT_TERM_NAME = 'PAYMENT_TERM_NAME' as any,
    PAYMENT_TERM_COMMENT = 'PAYMENT_TERM_COMMENT' as any,
    PAYMENT_TERM_ACTIVE = 'PAYMENT_TERM_ACTIVE' as any,
    PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED' as any,
}

enum prodUnitsAdditionalColumnsTypes {
    PROD_UNIT_DESC = 'PROD_UNIT_DESC' as any,
    PROD_UNIT_SYMBOL = 'PROD_UNIT_SYMBOL' as any
}

enum providersAdditionalColumnsTypes {
    PROVIDERS_NAME = 'PROVIDERS_NAME' as any,
    PROVIDERS_COUNTRY = 'PROVIDERS_COUNTRY' as any,
    LANGUAGE = 'LANGUAGE' as any,
    EU_UST_IDNR = 'EU_UST_IDNR' as any,
    CURRENCY = 'CURRENCY' as any
}

enum priceListSalesAdditionalColumnsTypes {
    ID = 'ID' as any,
    PRICE_NET = 'PRICE_NET' as any,
    PRICE_BRU = 'PRICE_BRU' as any,
    CURRENCY = 'CURRENCY' as any,
    PRILIST = 'PRILIST' as any,
    CUSGRP = 'CUSGRP' as any,
    ITMNUM = 'ITMNUM' as any,
}

enum warehousingAdditionalColumnsTypes {
    ID = 'ID' as any,
    WHLOC = 'WHLOC' as any,
    QTY = 'QTY' as any,
    LOT = 'LOT' as any,
    LOC = 'LOC' as any
}

enum prodComponentsAdditionalColumnsTypes {
    COMPNUM = 'COMPNUM' as any,
    // COMPNUMBER = 'COMPNUMBER' as any, // virtual column !
}

/**
 * Filter items by searching (with LIKE)
 *
 * @param searchColumn - e.g. ITMNUM
 * @param searchText - e.g. TEST
 * @param primaryColumn - e.g ACTIVE_FLG
 * @param primaryValue - e.g 1
 * @param secondColumn
 * @param secondValue
 * @param top - search max values e.g. 50
 * @param bot - search bot values e.g. 0
 * @param refTable - referral table
 * @param searchWithLike - flag if search by LIKE
 * @param additionalColumns - additional table columns to return
 */
export async function mssql_select_filteredItems(searchColumn: string, searchText: string, primaryColumn: string,
                                                 primaryValue: string, secondColumn: string, secondValue: string,
                                                 top: number, bot: number, refTable: string, searchWithLike: boolean,
                                                 additionalColumns: string): Promise<any[]> {

    console.log('search 1 ' + searchColumn);
    console.log('additionalColumns: ', additionalColumns);
    const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    let query: string = `SELECT `;
    let query_table: string = `SELECT  *`;
    let additionalColumnsArr: string[] = [];
    let flagQueryTable: boolean = false;
    if (searchWithLike && additionalColumns) {
        additionalColumnsArr = additionalColumns.split(',');
    }
   
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'SEARCH_COLUMN', type: sql.VarChar, value: searchColumn},
        {name: 'SEARCH_TEXT', type: sql.VarChar, value: searchText},
        {name: 'REF_TABLE', type: sql.VarChar, value: refTable},
        {name: 'PRIMARY_VALUE', type: sql.VarChar, value: primaryValue},
        {name: 'SECOND_VALUE', type: sql.VarChar, value: secondValue},
        {name: 'TOP', type: sql.Int, value: top},
        {name: 'BOT', type: sql.Int, value: bot}];
    // get values of items before start and set them to const
    const PRIMARY_COLUMN_VALUE: string = getItemForQuery([primaryColumn], primaryColumnTypes);
    const SEARCH_COLUMN_VALUE: string = getItemForQuery([searchColumn], searchColumnTypes);
    const SECOND_COLUMN_VALUE: string = getItemForQuery([secondColumn], secondColumnTypes);
    const CURR_ADD_COLUMNS_TYPES: any = getAdditionalColumnsTypes(refTable);
    if (refTable === 'components') {
        query = `SELECT DISTINCT ITMNUM, 
        (SELECT COUNT (COMPNUM) FROM ` + DB_TABLE_PREFIX + `DIST_COMPONENTS WHERE ` + SEARCH_COLUMN_VALUE + ` 
        LIKE '%' + @SEARCH_TEXT + '%' OR DIST_QTY LIKE '%' + @SEARCH_TEXT + '%' ) AS DIST_QTY
        FROM ` + DB_TABLE_PREFIX + `DIST_COMPONENTS  
        WHERE ` + SEARCH_COLUMN_VALUE + ` LIKE '%' + @SEARCH_TEXT + '%' OR DIST_QTY LIKE '%' + @SEARCH_TEXT + '%'
        ORDER BY ` + SEARCH_COLUMN_VALUE + ` `;
    } else if (refTable === 'articlesForNewPosition') {
        inputParamsArray.push({name: 'ACTIVE_FLG', type: sql.Bit, value: 1});
        query = `SELECT DISTINCT AA.` + SEARCH_COLUMN_VALUE + ` FROM ` + DB_TABLE_PREFIX + `ITEM_BASIS AA 
        LEFT JOIN ` + DB_TABLE_PREFIX + `DIST_COMPONENTS BB ON BB.ITMNUM = AA.ITMNUM 
        LEFT JOIN ` + DB_TABLE_PREFIX + `WAREHOUSING CC ON BB.COMPNUM = CC.ITMNUM 
        WHERE AA.` + SEARCH_COLUMN_VALUE + ` LIKE '%' + @SEARCH_TEXT + '%' AND 
            AA.ACTIVE_FLG = @ACTIVE_FLG AND  CC.` + PRIMARY_COLUMN_VALUE + ` = @PRIMARY_VALUE 
        GROUP BY AA.` + SEARCH_COLUMN_VALUE + ` 
        ORDER BY AA.` + SEARCH_COLUMN_VALUE + ` `;
    } else if (refTable === 'importTypes') {
        query = `SELECT ` + SEARCH_COLUMN_VALUE + `,IMPORT_TYPE_NAME  FROM ` + DB_TABLE_PREFIX + `IMPORT_TYPE 
        WHERE ` + SEARCH_COLUMN_VALUE + ` LIKE '%' + @SEARCH_TEXT + '%' 
        ORDER BY ` + SEARCH_COLUMN_VALUE + ` `;
    } else if (refTable === 'importTypesRefTables') {
        query = `SELECT IMPORT_TYPE_ID,REFERENCED_TABLE  FROM ` + DB_TABLE_PREFIX + `IMPORT_TYPE_REFERENCED_TABLES 
        WHERE IMPORT_TYPE_ID LIKE '%' + @SEARCH_TEXT + '%' 
        ORDER BY IMPORT_TYPE_ID `;
    }  else if (refTable === 'batchProcesses') {
        console.log('usao u batchProcesses query')
        query = `SELECT BATCH_FUNCTION  FROM ` + DB_TABLE_PREFIX + `BATCH_PROCESSES
        WHERE BATCH_FUNCTION LIKE '%' + @SEARCH_TEXT + '%'  `;
    }
     else {
        let tableName: any = await mssqlCall.mssqlCallEscaped(inputParamsArray,
            `SELECT TABLE_NAME FROM ` + DB_TABLE_PREFIX + `TABLE_TEMPLATES WHERE REF_TABLE = @REF_TABLE`);
        if (!tableName) {
            return [];
        }
        const TABLE_NAME_VALUE: string = DB_TABLE_PREFIX + tableName[0]['TABLE_NAME'];
        if (refTable === 'dialogStockTransfer' ) { // WAREHOUSING
            let tmpTableName = DB_TABLE_PREFIX + 'WAREHOUSE_LOC'; //  if search column LOC, we need to select from WAREHOUSE_LOC not from  WAREHOUSING
            let statusPos: string = 'A';
            inputParamsArray.push({name: 'STATUS_POS', type: sql.VarChar, value: statusPos});
            inputParamsArray.push({name: 'QTY_RESERVED', type: sql.Int, value: 0});
            if (searchColumn === 'ITMNUM') {
                query += SEARCH_COLUMN_VALUE + `,` +
                    additionalColumns + `, (QTY - RESERVED) AS 'realQTY'`;

                query += ` FROM ` + TABLE_NAME_VALUE + ` `;

            } else if (searchColumn === 'LOC') {
                query += `DISTINCT ` + SEARCH_COLUMN_VALUE;

                query += ` FROM ` + tmpTableName + ` `;
            }

            if (searchWithLike) {
                if (additionalColumns && additionalColumns.length > 0) {
                    query += `WHERE (` + SEARCH_COLUMN_VALUE + ` LIKE '%' + @SEARCH_TEXT + '%' `;
                    for (let item in additionalColumnsArr) {
                        query += ` OR ` + additionalColumnsArr[item] + ` LIKE '%' + @SEARCH_TEXT + '%' `;
                    }
                    query += `) `;
                } else {
                    query += `WHERE ` + SEARCH_COLUMN_VALUE + ` LIKE '%' + @SEARCH_TEXT + '%' `;
                }
            } else {
                query += `WHERE ` + SEARCH_COLUMN_VALUE + ` = @SEARCH_TEXT `;
            }
            if (searchColumn === 'ITMNUM') {
                query += `AND (QTY - RESERVED) > @QTY_RESERVED `;
            } else if (searchColumn === 'LOC') {
                //query += `AND ` + PRIMARY_COLUMN_VALUE + ` != @PRIMARY_VALUE `; now we get data from WAREHOUSE_LOC
            }
            if (searchColumn === 'ITMNUM') {
                query += `AND STATUS_POS = @STATUS_POS `;
                query += `ORDER BY ITMNUM ` + constants.SORT_TYPES.ASC + `, LOT ` + constants.SORT_TYPES.DESC + ` `;
            } else if (searchColumn === 'LOC') {
                query += `ORDER BY LOC ` + constants.SORT_TYPES.ASC + ` `;
            }
        } else {
            if (additionalColumns && additionalColumns.length > 0) {
                // check if, primaryColumn is in additionalColumns
                /*if (PRIMARY_COLUMN_VALUE && additionalColumns.indexOf(primaryColumn) === -1) {
                    query += PRIMARY_COLUMN_VALUE + `,`;
                }
                if (searchColumn && query.indexOf(searchColumn) === -1 && additionalColumns.indexOf(searchColumn) === -1) {
                    query += SEARCH_COLUMN_VALUE + `,`;
                }
                query = addItemsToQuery(additionalColumnsArr, CURR_ADD_COLUMNS_TYPES, query);*/
                query_table += ` FROM ` + TABLE_NAME_VALUE + ` WHERE `;
                flagQueryTable = true;
            } else {
                /*query += SEARCH_COLUMN_VALUE + ` FROM ` + TABLE_NAME_VALUE + ` WHERE `;*/
                query_table +=  ` FROM ` + TABLE_NAME_VALUE + ` WHERE `;
                flagQueryTable  = true;
            }
            if (searchWithLike) {
                if (additionalColumns && additionalColumns.length > 0) {
                    if (secondColumn && secondValue) {
                        query_table += `(`;
                    }
                    if (primaryColumn && primaryValue) {
                        query_table += `(`;
                    }
                    query_table += SEARCH_COLUMN_VALUE + ` LIKE '%' + @SEARCH_TEXT + '%'`;
                    for (let item in additionalColumnsArr) {
                        if (Object.values(CURR_ADD_COLUMNS_TYPES).includes(additionalColumnsArr[item])) {
                            query_table += ` OR ` + CURR_ADD_COLUMNS_TYPES[
                                    additionalColumnsArr[item] as keyof typeof CURR_ADD_COLUMNS_TYPES]
                                + ` LIKE '%' + @SEARCH_TEXT + '%'`;
                        }
                    }
                    if (primaryColumn && primaryValue) {
                        query_table += `) AND ` + PRIMARY_COLUMN_VALUE + ` = @PRIMARY_VALUE`;
                    }
                    // CONVERT(VARCHAR(25), ORDERS_DATE, 126) LIKE '2018-10-10%'
                    if (secondColumn && secondValue) {
                        query_table += `) `;
                    } else {
                        query_table += ` `;
                    }
                } else {
                    query_table += SEARCH_COLUMN_VALUE + ` LIKE '%' + @SEARCH_TEXT + '%' `;
                    if (primaryColumn && primaryValue) {
                        query_table += ` AND ` + PRIMARY_COLUMN_VALUE + ` = @PRIMARY_VALUE `;
                    }
                }
                if (secondColumn && secondValue) {
                    // Workaround to determine PROD_COMPONENTS query
                    if (secondColumn === 'PROD_COMPONENTS' && secondValue === 'PROD_COMPONENTS') {
                        query_table += `AND CATEGORY_SOAS = ` + constants.CATEGORY_SOAS_RAW + ` AND RAW_FLG = 'true' `;
                    } else {
                        if (secondColumn !== "FULL") {
                            query_table += `AND ` + SECOND_COLUMN_VALUE + ` = @SECOND_VALUE `;
                        }
                    }
                }
            } else {
                if (secondColumn && secondValue) {
                    if (secondColumn !== "FULL") {
                        query += SEARCH_COLUMN_VALUE + ` = @SEARCH_TEXT AND ` + SECOND_COLUMN_VALUE + ` = @SECOND_VALUE `;
                    }
                } else {
                    query += SEARCH_COLUMN_VALUE + ` = @SEARCH_TEXT `;
                }
                if (primaryColumn && primaryValue) {
                    query += ` AND ` + PRIMARY_COLUMN_VALUE + ` = @PRIMARY_VALUE`;
                }
            }

            // search by substring search_text inside search column value
            // query += `ORDER BY charindex(@SEARCH_TEXT,` + SEARCH_COLUMN_VALUE + `) `;

            // search by search column value descending
            query_table += `ORDER BY ${SEARCH_COLUMN_VALUE} DESC `;
        }
    }
    query += `OFFSET @TOP ROWS FETCH NEXT @BOT ROWS ONLY`;
    query_table += `OFFSET @TOP ROWS FETCH NEXT @BOT ROWS ONLY`;
    console.log('inputParamsArray: ', inputParamsArray);
    let dataTable;
    if(flagQueryTable) {
        console.log('search-query: ', query_table);
        dataTable = query_table;
    }else {
        console.log('search-query: ', query);
        dataTable = query;
    }
    let data: any[] = await mssqlCall.mssqlCallEscaped(inputParamsArray, dataTable);
    if (refTable === 'dialogStockTransfer' && searchColumn === 'ITMNUM' && data && data.length === 0) {
        data = await getAlternativeStockTransferItems(searchColumn, searchText, additionalColumns, top, bot);
    }
    for (let i = 0; i < data.length; i++) {
        if (data.hasOwnProperty(i)) {
            for (let key in data[i]) {
                if (data[i].hasOwnProperty(key)) {
                    data[i][key] = checkDate(data[i][key]);
                }
            }
        }
    }
    return data;
}

/**
 * get additions columns types
 *
 * @param refTable
 */
function getAdditionalColumnsTypes(refTable: string) {
    if (refTable === 'articles') {
        return articlesAdditionalColumnsTypes;
    } else if (refTable === 'orders') {
        return ordersAdditionalColumnsTypes;
    } else if (refTable === 'deliveryNote') {
        return deliveryNoteAdditionalColumnsTypes;
    } else if (refTable === 'invoice') {
        return invoiceAdditionalColumnsTypes;
    } else if (refTable === 'custbtwoc' || refTable === 'custbtwob') {
        return customersAdditionalColumnsTypes;
    } else if (refTable === 'components') {
        return componentsAdditionalColumnsTypes;
    } else if (refTable === 'currencies') {
        return currenciesAdditionalColumnsTypes;
    } else if (refTable === 'countries') {
        return countriesAdditionalColumnsTypes;
    } else if (refTable === 'attributeNames') {
        return attributeNamesAdditionalColumnsTypes;
    } else if (refTable === 'paymentTerms') {
        return paymentTermsAdditionalColumnsTypes;
    } else if (refTable === 'prodUnits') {
        return prodUnitsAdditionalColumnsTypes;
    } else if (refTable === 'providers') {
        return providersAdditionalColumnsTypes;
    } else if (refTable === 'priceListSales') {
        return priceListSalesAdditionalColumnsTypes;
    } else if (refTable === 'warehousing') {
        return warehousingAdditionalColumnsTypes;
    } else if (refTable === 'prodComponents') {
        return prodComponentsAdditionalColumnsTypes;
    } else {
        return {};
    }
}
