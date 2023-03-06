/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 31.05.2021 */

import mssqlCall = require('../../mssql_call');
import {constants} from '../../constants/constants';


/**
 * select all from customers
 */
export async function mssql_select_Customers() {
    let selectQuery: string = `SELECT * FROM ` + constants.DB_TABLE_PREFIX + `CUSTOMERS`;
    return await mssqlCall.mssqlCallEscaped([], selectQuery);
}

/**
 * get last added customers address
 */
export async function mssql_last_customersAddressesId() {
    let selectQuery: string = `SELECT ID FROM ` + constants.DB_TABLE_PREFIX + `CUSTOMERS_ADDRESSES ORDER BY ID DESC`;
    let data: any = await mssqlCall.mssqlCallEscaped([], selectQuery);
    return data.length ? data[0]['ID'] : 0;
}
