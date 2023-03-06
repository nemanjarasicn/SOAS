/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 04.06.2021 */

import * as sql from 'mssql';
import * as mssqlCall from '../../mssql_call';
import {constants} from '../../constants/constants';
import {getDateForQuery} from '../date/Date';


/**
 * delete one specific item (given params) from TABLELOCKS
 *
 * @param tableName
 * @param dataSet
 * @param lockedBy
 */
export async function mssql_delete_one_tableLock(tableName: string, dataSet: string, lockedBy: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'TABLENAME', type: sql.VarChar, value: tableName},
        {name: 'LOCKED_DATASET', type: sql.VarChar, value: dataSet},
        {name: 'LOCKED_BY', type: sql.VarChar, value: lockedBy}];
    let deleteQuery: string = `DELETE FROM ` + constants.DB_TABLE_PREFIX + `TABLELOCKS WHERE TABLENAME = @TABLENAME AND 
        LOCKED_DATASET = @LOCKED_DATASET AND LOCKED_BY = @LOCKED_BY`;
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, deleteQuery);
}

/**
 * delete all locks of given user
 *
 * @param lockedBy
 */
export async function mssql_delete_all_users_tableLocks(lockedBy: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'LOCKED_BY', type: sql.VarChar, value: lockedBy}]; // @ts-ignore
    let deleteQuery: string = `DELETE FROM ` + constants.DB_TABLE_PREFIX + `TABLELOCKS WHERE LOCKED_BY = @LOCKED_BY`;
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, deleteQuery);
}

/**
 * delete all locks
 */
export async function mssql_delete_all_tableLocks() {
    // @ts-ignore
    let query: string = `DELETE FROM ` + constants.DB_TABLE_PREFIX + `TABLELOCKS`;
    return await mssqlCall.mssqlCall(query);
}

/**
 * change change lock status and updates timestamp
 *
 * @param lockStatus
 * @param tableName
 * @param currentUser
 */
export async function changeLockStatus(lockStatus: number, tableName: string, currentUser: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'TABLENAME', type: sql.VarChar, value: tableName},
        {name: 'LOCKED', type: sql.Bit, value: (lockStatus ? 1 : 0)},
        {name: 'LOCKED_SINCE', type: sql.SmallDateTime, value: new Date(getDateForQuery())},
        {name: 'LOCKED_BY', type: sql.VarChar, value: currentUser}];
    // @ts-ignore
    let updateQuery: string = `UPDATE ` + constants.DB_TABLE_PREFIX + `TABLELOCKS SET LOCKED = @LOCKED, 
        LOCKED_SINCE = @LOCKED_SINCE, LOCKED_BY = @LOCKED_BY WHERE TABLENAME = @TABLENAME`;
    await mssqlCall.mssqlCallEscaped(inputParamsArray, updateQuery);
    return true;
}

/**
 * check locked status
 *
 * @param tableName
 */
export async function tableLockStatus(tableName: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'TABLENAME', type: sql.VarChar, value: tableName}];
    // @ts-ignore
    let selectQuery: string = `SELECT LOCKED_BY, LOCKED FROM ` + constants.DB_TABLE_PREFIX + `TABLELOCKS 
    WHERE TABLENAME = @TABLENAME`;
    let isLocked: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, selectQuery);
    if (isLocked.length === 0) {
        isLocked = {LOCKED: '0', DATASTRING: 'table locks is empty!'};
        return isLocked;
    } else {
        return isLocked[0];
    }
}
