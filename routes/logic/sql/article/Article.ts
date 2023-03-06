/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 01.06.2021 */

import * as sql from 'mssql';
import * as mssqlCall from '../../mssql_call';
import {constants} from '../../constants/constants';

/**
 * select all articles from ITEM_BASIS
 */
export async function mssql_select_ItemBasis() {
    const TABLE_NAME_VALUE: string = constants.DB_TABLE_PREFIX + 'ITEM_BASIS';
    let inputParamsArray: { name: string, type: any, value: any }[] = [];
    //     {name: 'ITMNUM', type: sql.VarChar, value: "OPTIMOSET1006000104DE"}];    // "TOSCANASET803000101DE"
    let selectQuery: string = `SELECT * FROM ` + TABLE_NAME_VALUE;
    console.log("New selectQuery: ", selectQuery);
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, selectQuery);
}

/**
 * check if given ITMNUM is available in ITEM_BASIS and have WAREHOUSE_MANAGED = 1.
 * Returns active item only (ACTIVE_FLG = 1).
 *
 * @param itmnum
 */
export async function isComponentWHManaged(itmnum: string) {
    let activeFlag: boolean = true;
    let warehouseManaged: boolean = true;
    const TABLE_NAME_VALUE: string = constants.DB_TABLE_PREFIX + 'ITEM_BASIS';
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'ITMNUM', type: sql.VarChar, value: itmnum},
        {name: 'ACTIVE_FLG', type: sql.Bit, value: activeFlag ? 1 : 0},
        {name: 'WAREHOUSE_MANAGED', type: sql.Bit, value: warehouseManaged ? 1 : 0}];
    let selectQuery: string = `SELECT * FROM ` + TABLE_NAME_VALUE + ` 
    WHERE ITMNUM = @ITMNUM AND ACTIVE_FLG = @ACTIVE_FLG AND WAREHOUSE_MANAGED = @WAREHOUSE_MANAGED`;
    console.log("New isComponentWHManaged selectQuery: ", selectQuery);
    let whSelectData: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, selectQuery);
    if (whSelectData && whSelectData[0] && whSelectData[0].WAREHOUSE_MANAGED) {
        return {managed: true, data: whSelectData[0]};
    }
    return {managed: false, data: undefined};
}
