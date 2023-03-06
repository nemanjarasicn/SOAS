import {mssqlCallEscaped} from "./mssql_call";
import * as sql from 'mssql';

/**
 * Author Strahinja Belic 23.08.2021.
 * Last Change: 23.08.2021.
 *
 * It will insert ORDERS_POSITIONS for rest components ORD_POS
 * @param ordersNumber - string
 * @param currency - number
 * @param delivered_qty - number
 * @param warehouse - string
 * @param category_soas - string
 * @param parent_line_id - number
 * @param dist_qty - number
 * @param order_qty - number
 * @param itmdes - string
 * @param itmnum - string
 * @param dist_components_id - number
 * @param tmpPositionID_ord - number
 * @returns Promise<void>
 */
export async function insertRestComponentsOrdPosDBFun(
    ordersNumber: string,
    currency: number,
    delivered_qty: number,
    warehouse: string,
    category_soas: string,
    parent_line_id: number,
    dist_qty: number,
    order_qty: number,
    itmdes: string,
    itmnum: string,
    dist_components_id: number,
    tmpPositionID_ord: number
): Promise<void>{
    let sqlQuery = `INSERT INTO ORDERS_POSITIONS (
            ORDERS_NUMBER
            ,CURRENCY
            ,DELIVERED_QTY
            ,WAREHOUSE                
            ,CATEGORY_SOAS
            ,PRICE_NET
            ,PRICE_BRU
            ,PARENT_LINE_ID
            ,ORDER_QTY
            ,ITMDES
            ,ITMNUM
            ,DIST_COMPONENTS_ID
            ,POSITION_ID
            ,POSITION_STATUS
            ,ASSIGNED_QTY
        ) VALUES (
            @ORDERS_NUMBER
            ,@CURRENCY
            ,@DELIVERED_QTY
            ,@WAREHOUSE 
            ,@CATEGORY_SOAS
            ,@PRICE_NET
            ,@PRICE_BRU
            ,@PARENT_LINE_ID
            ,@ORDER_QTY
            ,@ITMDES
            ,@ITMNUM
            ,@DIST_COMPONENTS_ID
            ,@POSITION_ID
            ,@POSITION_STATUS
            ,@ASSIGNED_QTY
        )`

    await mssqlCallEscaped([
        {
            name: 'ORDERS_NUMBER',
            type: sql.NVarChar,
            value: ordersNumber
        },
        {
            name: 'CURRENCY',
            type: sql.NVarChar,
            value: currency
        },
        {
            name: 'DELIVERED_QTY',
            type: sql.NVarChar,
            value: delivered_qty
        },
        {
            name: 'WAREHOUSE',
            type: sql.NVarChar,
            value: warehouse
        },
        {
            name: 'CATEGORY_SOAS',
            type: sql.NVarChar,
            value: category_soas
        },
        {
            name: 'PRICE_NET',
            type: sql.Decimal,
            value: 0.00000
        },
        {
            name: 'PRICE_BRU',
            type: sql.Decimal,
            value: 0.00000
        },
        {
            name: 'PARENT_LINE_ID',
            type: sql.Int,
            value: parent_line_id
        },
        {
            name: 'ORDER_QTY',
            type: sql.Int,
            value: +dist_qty * order_qty
        },
        {
            name: 'ITMDES',
            type: sql.NVarChar,
            value: itmdes
        },
        {
            name: 'ITMNUM',
            type: sql.NVarChar,
            value: itmnum
        },
        {
            name: 'DIST_COMPONENTS_ID',
            type: sql.NVarChar,
            value: dist_components_id
        },
        {
            name: 'POSITION_ID',
            type: sql.Int,
            value: tmpPositionID_ord
        },
        {
            name: 'POSITION_STATUS',
            type: sql.Int,
            value: 0
        },
        {
            name: 'ASSIGNED_QTY',
            type: sql.Int,
            value: 0
        }
    ], sqlQuery)
}
