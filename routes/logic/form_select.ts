import {mssqlCallEscaped} from "./mssql_call";
import sql = require('mssql');

/**
 * Author: Strahinja Belic (28/29/2021)
 * LastChange: (07.10.2021)
 *
 * It will return warehouse locations that are allowed for this order_number
 * @param order_number
 */
export async function getWarehouseOptForSelect(order_number: string){
    const whloc = await getWarehouseInOrder(order_number)

    const sqlQuery = `SELECT DISTINCT WHLOC FROM WAREHOUSING WHERE WHLOC LIKE @WHLOC`
    return await mssqlCallEscaped([{
        name: 'WHLOC',
        type: sql.NVarChar,
        value: `${whloc[0]?.WAREHOUSE[0] || 1}%` // added '1%' as default, cause it happens that whloc is null
    }], sqlQuery)

}

/**
 * Author: Strahinja Belic (28/29/2021)
 * LastChange: (28/29/2021)
 *
 * It will return current warehouse locations for given order_number
 * @param order_number
 */
export async function getWarehouseInOrder(order_number: string){
    const sqlQuery =  `SELECT WAREHOUSE FROM ORDERS WHERE ORDERS_NUMBER = @ORDERS_NUMBER`
    return await mssqlCallEscaped([{
        name: 'ORDERS_NUMBER',
        type: sql.NVarChar,
        value: order_number
    }], sqlQuery)
}
