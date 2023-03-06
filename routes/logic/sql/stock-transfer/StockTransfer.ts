/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 01.06.2021 */

import * as sql from 'mssql';
import * as mssqlCall from '../../mssql_call';
import {constants} from '../../constants/constants';
import {WarehouseControl} from '../../classes/WarehouseControl';
import {WarehousingInterface} from '../../classes/interfaces/WarehousingInterface';
import { getDateForQuery } from '../date/Date';
import {StockTransferSaveTypes} from "../../../../client/src/app/interfaces/stock-transfer-options";

/**
 * alternative way to get stock transfer dialog items at search
 *
 * @param searchColumn
 * @param itemNumber
 * @param additionalColumns
 * @param top
 * @param bot
 */
export async function getAlternativeStockTransferItems(searchColumn: string, itemNumber: string,
                                                       additionalColumns: string, top: number, bot: number) {
    console.log("getAlternativeStockTransferItems - searchColumn: ", searchColumn)
    const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'SEARCH_COLUMN', type: sql.VarChar, value: searchColumn},
        {name: 'ITMNUM', type: sql.VarChar, value: itemNumber},
        {name: 'QTY_RESERVED', type: sql.Int, value: 0},
        {name: 'TOP', type: sql.Int, value: top},
        {name: 'BOT', type: sql.Int, value: bot}];
    enum searchColumnTypes {
        ITMNUM = 'ITMNUM' as any,
        LOC = 'LOC' as any,
    }
    enum additionalColumnsTypes {
        ID = 'ID' as any,
        LOC = 'LOC' as any,
        WHLOC = 'WHLOC' as any,
        LOT = 'LOT' as any,
        STATUS_POS = 'STATUS_POS' as any,
        QTY = 'QTY' as any,
        RESERVED = 'RESERVED' as any,
        UPDATE_LOC = 'UPDATE_LOC' as any
    }
    if (searchColumn && Object.values(searchColumnTypes).includes(searchColumn)) {
        let stockSelectQuery: string = `SELECT DISTINCT AA.COMPNUM AS ` +
            searchColumnTypes[searchColumn as keyof typeof searchColumnTypes] + `,`;
        if (additionalColumns && additionalColumns.length > 0) {
            let additionalColumnsArr: string[] = additionalColumns.split(',');
            for (let addColItem in additionalColumnsArr) {
                if (Object.values(additionalColumnsTypes).includes(additionalColumnsArr[addColItem])) {
                    stockSelectQuery += `BB.` +
                        additionalColumnsTypes[additionalColumnsArr[addColItem] as keyof typeof additionalColumnsTypes]
                        + `, `;
                }
            }
        }
        stockSelectQuery += `(BB.QTY - BB.RESERVED) AS 'realQTY' 
        FROM ` + DB_TABLE_PREFIX + `DIST_COMPONENTS AA 
        LEFT JOIN ` + DB_TABLE_PREFIX + `WAREHOUSING BB ON BB.ITMNUM = AA.COMPNUM 
        WHERE (AA.ITMNUM LIKE '%' + @ITMNUM + '%' OR BB.LOC LIKE '%' + @ITMNUM + '%') 
        AND (QTY - RESERVED) > @QTY_RESERVED `;
        if (searchColumn === 'ITMNUM') {
            stockSelectQuery += `ORDER BY ITMNUM ASC, LOT DESC `;
        } else if (searchColumn === 'LOC') {
            stockSelectQuery += `ORDER BY LOC ASC `;
        }
        if (searchColumn === 'ITMNUM' || searchColumn === 'LOC') {
            stockSelectQuery += `OFFSET @TOP ROWS FETCH NEXT @BOT ROWS ONLY`;
        }
        console.log("stockSelectQuery: ", stockSelectQuery);
        return await mssqlCall.mssqlCallEscaped(inputParamsArray, stockSelectQuery);
    } else {
        return false;
    }
}

/**
 * set stock transfer dialog functions
 *
 * @param saveType string of constants.STOCK_TRANSFER_SAVE_TYPES
 * @param data
 */
export async function setStockTransfer(saveType: string, data: {} | any): Promise<[any]> {
    let warehouseControl: WarehouseControl = new WarehouseControl();
    let typeError: boolean = false;
    switch (saveType) {
        case(constants.STOCK_TRANSFER_SAVE_TYPES.UPDATE_BOTH) :
            await warehouseControl.moveStock(data.fromWarehousingId, data.toWarehousingId, data.quantity);
            break;
        case(constants.STOCK_TRANSFER_SAVE_TYPES.UPDATE_DELETE) :
            await warehouseControl.moveAndDeleteStock(data.fromWarehousingId, data.toWarehousingId, data.quantity);
            break;
        case(constants.STOCK_TRANSFER_SAVE_TYPES.CREATE) :
            let warehousingToItem: WarehousingInterface = {
                warehousingId: 0,
                warehousingLocation: data.warehousingToItem.WHLOC,
                warehousingItemNumber: data.warehousingToItem.ITMNUM,
                warehousingBatchNumber: data.warehousingToItem.LOT,
                warehousingStorageLocation: data.warehousingToItem.LOC,
                warehousingStatusPosition: data.warehousingToItem.STATUS_POS,
                warehousingQuantity: data.warehousingToItem.QTY,
                warehousingReserved: data.warehousingToItem.RESERVED,
                warehousingUpdateLocation: getDateForQuery(constants.LOCALE),
            };
            await warehouseControl.moveAndCreateStock(data.fromWarehousingId, warehousingToItem, data.quantity);
            break;
        case(constants.STOCK_TRANSFER_SAVE_TYPES.REPLACE) :
            await warehouseControl.replaceStock(data.fromWarehousingId, data.warehousingToItem.LOC);
            break;
        default :
            console.log('ERROR: undefined saveType! ', saveType);
            typeError = true;
            break;
    }
    return [{error: !typeError}];
}
