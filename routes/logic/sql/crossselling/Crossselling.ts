/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 01.06.2021 */

import * as sql from 'mssql';
import * as mssqlCall from '../../mssql_call';
import {constants} from '../../constants/constants';
import {
    execInsertMethod,
    mssql_call_get_table_name,
    mssql_call_get_table_name_and_detail_view
} from '../../mssql_logic';
import {mssql_last_table_id} from '../table/Table';


/**
 * insert into crossselling
 *
 * @param lastArticleIDResult
 * @param crossData
 * @param tableTemplate
 */
export async function insertCrossselling(lastArticleIDResult: any, crossData: string, tableTemplate: any): Promise<boolean> {
    if (typeof lastArticleIDResult === 'number') {
        const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
        const DB_TABLE_NAME: string = 'CROSSSELLING';
        let cTableTemplate: any = await mssql_call_get_table_name_and_detail_view(constants.REFTABLE_CROSSSELLING);
        if (!cTableTemplate) {
            console.log("tableTemplate not found... ", constants.REFTABLE_CROSSSELLING);
            return false;
        }
        const TABLE_DETAIL_VIEW: string[] = cTableTemplate[0]['DETAIL_VIEW'].split(',');
        let queryCrossselling: string = `INSERT INTO ` + DB_TABLE_PREFIX + DB_TABLE_NAME + ` (CROSSSELLING_DATA) VALUES `;
        let newCrossElmArray = {'CROSSSELLING_DATA': crossData};
        await execInsertMethod(TABLE_DETAIL_VIEW, newCrossElmArray, queryCrossselling, DB_TABLE_NAME);
        let lastCrossIDResult: any = await mssql_last_table_id(DB_TABLE_NAME, "CROSSSELLING_ID",
            undefined, undefined);
        if (typeof lastCrossIDResult === 'number') {
            let inputParamsArray: { name: string, type: any, value: any }[] = [
                {name: 'CROSSSELLING', type: sql.Int, value: lastCrossIDResult},
                {name: 'ID', type: sql.Int, value: lastArticleIDResult}];
            let updateArticleQuery = `UPDATE ` + DB_TABLE_PREFIX + `ITEM_BASIS
                            SET CROSSSELLING = @CROSSSELLING WHERE ID = @ID`;
            console.log(">>> updateArticleQuery: ", updateArticleQuery);
            const result = await mssqlCall.mssqlCallEscaped(inputParamsArray, updateArticleQuery);
            return (result === undefined);
        }
    }
}

/**
 * update crossseling
 *
 * @param crossId
 * @param crossData
 */
export async function updateCrossselling(crossId: string, crossData: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'CROSSSELLING_DATA', type: sql.VarChar, value: crossData},
        {name: 'CROSSSELLING_ID', type: sql.Int, value: crossId}];
    let queryCrossselling: string = `UPDATE ` + constants.DB_TABLE_PREFIX + `CROSSSELLING 
    SET CROSSSELLING_DATA = @CROSSSELLING_DATA 
    WHERE CROSSSELLING_ID = @CROSSSELLING_ID`;
    console.log('inputParamsArray: ', inputParamsArray);
    console.log('update query: ', queryCrossselling);
    const result = await mssqlCall.mssqlCallEscaped(inputParamsArray, queryCrossselling);
    return (result === undefined);
}
