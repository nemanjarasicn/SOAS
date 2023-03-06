/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 28.05.2021 */

import sql = require('mssql');
import mssqlCall = require('../../mssql_call');
import {constants} from '../../constants/constants';
import {getDateForQuery} from '../date/Date';

/**
 * select batch processes
 *
 * @param batchName
 * @param top
 * @param bot
 * @param orderCond
 * @param refTable
 * @param language
 * @param showTable
 */
export async function mssql_select_batch_processes(batchName: undefined|string, top: undefined|number,
                                                   bot: undefined|number, orderCond: string,
                                                   refTable: string, language: string, showTable: string) {
    let resultArray: string[] = [];
    let inputParamsArray: {name: string, type: any, value: any}[] = [
        {name: 'BATCH_NAME', type: sql.VarChar, value: batchName},
        {name: 'ORDER_COND', type: sql.VarChar, value: orderCond},
        {name: 'TOP', type: sql.Int, value: top},
        {name: 'BOT', type: sql.Int, value: bot}];
    let selectQuery: string = `SELECT BATCH_NAME,BATCH_DESCRIPTION,BATCH_FUNCTION,BATCH_INTERVAL,BATCH_ACTIVE,BATCH_PARAMS,
    FORMAT(BATCH_LAST_RUN_START, 'dd-MM-yyyy HH:mm:ss', 'en-US') AS BATCH_LAST_RUN_START,
    FORMAT(BATCH_LAST_RUN_FINISH, 'dd-MM-yyyy HH:mm:ss', 'en-US') AS BATCH_LAST_RUN_FINISH, BATCH_LAST_RUN_RESULT`;
    if (showTable === '0') {
        selectQuery += `, BATCH_CODE, BATCH_CODE_REQUIRED `;
    }
    selectQuery += ` FROM ` + constants.DB_TABLE_PREFIX + `BATCH_PROCESSES `;
    if (batchName && batchName.length) {
        selectQuery += `WHERE BATCH_NAME = @BATCH_NAME `;
    }
    if (top && bot && orderCond) {
        selectQuery += `ORDER BY @ORDER_COND OFFSET @TOP ROWS FETCH NEXT @BOT ROWS ONLY`;
    }
    console.log("New selectQuery: ", selectQuery);
    let data: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, selectQuery);

    //*If BATCH_PARAMS exist, parse them to object, else check if function has parameters in the constants
    data.forEach(e => {
       e.BATCH_PARAMS= e.BATCH_PARAMS ? JSON.parse(e.BATCH_PARAMS) : (constants.DB_TABLE_COLUMNS.BATCH_FUNCTIONS[`${e.BATCH_FUNCTION}`] ?  constants.DB_TABLE_COLUMNS.BATCH_FUNCTIONS[`${e.BATCH_FUNCTION}`] : null) ;
       e['BATCH_FUNCTIONS']=constants.DB_TABLE_COLUMNS.BATCH_FUNCTIONS;
    });
   

    resultArray.push(data);
    return resultArray;
}

/**
 * insert batch process
 *
 * @param name
 * @param description
 * @param batchFunction
 * @param interval
 * @param active
 * @param code
 * @param codeRequired
 */
export async function mssql_insert_batch(name: string, description: string, batchFunction: any, interval: any,
                                         active: any, code: any, codeRequired: any,batchParams:string) {
    let codeValue: any = code ? code : null;
    let inputParamsArray: {name: string, type: any, value: any}[] = [
        {name: 'BATCH_NAME', type: sql.VarChar, value: name},
        {name: 'BATCH_DESCRIPTION', type: sql.VarChar, value: description},
        {name: 'BATCH_FUNCTION', type: sql.VarChar, value: batchFunction},
        {name: 'BATCH_INTERVAL', type: sql.VarChar, value: interval},
        {name: 'BATCH_ACTIVE', type: sql.Bit, value: active ? 1 : 0},
        {name: 'BATCH_LAST_RUN_START', type: sql.SmallDateTime, value: null},
        {name: 'BATCH_LAST_RUN_FINISH', type: sql.SmallDateTime, value: null},
        {name: 'BATCH_CODE', type: sql.VarChar, value: codeValue},
        {name: 'BATCH_CODE_REQUIRED', type: sql.Bit, value: codeRequired ? 1 : 0},
        {name: 'BATCH_PARAMS', type: sql.VarChar, value: batchParams}

    ];
    let insertQuery: string = `INSERT INTO ` + constants.DB_TABLE_PREFIX + `BATCH_PROCESSES
        (BATCH_NAME,BATCH_DESCRIPTION,BATCH_FUNCTION,BATCH_INTERVAL,BATCH_ACTIVE,BATCH_LAST_RUN_START,
        BATCH_LAST_RUN_FINISH, BATCH_CODE, BATCH_CODE_REQUIRED, BATCH_PARAMS) VALUES 
        (@BATCH_NAME, @BATCH_DESCRIPTION, @BATCH_FUNCTION, @BATCH_INTERVAL, @BATCH_ACTIVE, 
        @BATCH_LAST_RUN_START, @BATCH_LAST_RUN_FINISH, @BATCH_CODE, @BATCH_CODE_REQUIRED, @BATCH_PARAMS)`;
    console.log("New insertQuery: ", insertQuery);
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, insertQuery);
}

/**
 * update batch process
 *
 * @param name
 * @param description
 * @param batchFunction
 * @param interval
 * @param active
 * @param code
 */
export async function mssql_update_batch(name: string, description: string, batchFunction: any, interval: any,
                                         active: any, code: any,batchParams:string) {
    let inputParamsArray: {name: string, type: any, value: any}[] = [
        {name: 'BATCH_NAME', type: sql.VarChar, value: name},
        {name: 'BATCH_DESCRIPTION', type: sql.VarChar, value: description},
        {name: 'BATCH_FUNCTION', type: sql.VarChar, value: batchFunction},
        {name: 'BATCH_INTERVAL', type: sql.VarChar, value: interval},
        {name: 'BATCH_ACTIVE', type: sql.Bit, value: active ? 1 : 0},
        {name: 'BATCH_CODE', type: sql.VarChar, value: code},
        {name: 'BATCH_PARAMS', type: sql.VarChar, value: batchParams}
    ];
    let updateQuery: string = `UPDATE ` + constants.DB_TABLE_PREFIX + `BATCH_PROCESSES SET 
        BATCH_DESCRIPTION = @BATCH_DESCRIPTION, BATCH_FUNCTION = @BATCH_FUNCTION,
        BATCH_INTERVAL = @BATCH_INTERVAL, BATCH_ACTIVE = @BATCH_ACTIVE, BATCH_CODE = @BATCH_CODE,BATCH_PARAMS = @BATCH_PARAMS
        WHERE BATCH_NAME = @BATCH_NAME`;
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, updateQuery);
}

/**
 * delete batch process
 *
 * @param batchName
 */
export async function mssql_delete_batch(batchName: any) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'BATCH_NAME', type: sql.VarChar, value: batchName}];
    let deleteQuery: string = `DELETE FROM ` + constants.DB_TABLE_PREFIX + `BATCH_PROCESSES WHERE 
    BATCH_NAME = @BATCH_NAME`;
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, deleteQuery);
}

/**
 * update batch process last run date
 *
 * @param batchName
 * @param runResult
 * @param startFlag
 */
export async function mssql_update_batch_last_run(batchName: string, runResult: any, startFlag: boolean) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'BATCH_NAME', type: sql.VarChar, value: batchName},
        {name: 'BATCH_LAST_RUN_START', type: sql.DateTime, value: new Date(getDateForQuery())},
        {name: 'BATCH_LAST_RUN_FINISH', type: sql.DateTime, value: new Date(getDateForQuery())},
        {name: 'BATCH_LAST_RUN_RESULT', type: sql.VarChar, value: runResult}];
    console.log("inputParamsArray: ", inputParamsArray);
    let updateQuery: string = `UPDATE ` + constants.DB_TABLE_PREFIX + `BATCH_PROCESSES SET `;
    if (startFlag) {
        updateQuery += `BATCH_LAST_RUN_START = @BATCH_LAST_RUN_START, `;
    } else {
        updateQuery += `BATCH_LAST_RUN_FINISH = @BATCH_LAST_RUN_FINISH, `;
    }
    updateQuery += `BATCH_LAST_RUN_RESULT = @BATCH_LAST_RUN_RESULT WHERE BATCH_NAME = @BATCH_NAME`;
    console.log('mssql_update_batch_last_run-query: ', updateQuery);
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, updateQuery);
}
