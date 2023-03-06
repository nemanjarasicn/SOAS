/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 01.06.2021 */

import * as sql from 'mssql';
import * as mssqlCall from '../../mssql_call';
import {constants} from '../../constants/constants';


/**
 * get all active states from db
 */
export async function mssql_select_states() {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'STATES_ACTIVE', type: sql.Int, value: 1}];
    let query: string = `SELECT STATES_ID,STATES_NAME,STATES_COMMENT,STATES_ACTIVE,STATES_TYPE 
        FROM ` +
        constants.DB_TABLE_PREFIX + `STATES WHERE STATES_ACTIVE = @STATES_ACTIVE`;
    let result: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
    return (result && !result.error) ? result : 'undefined';
}

/**
 * load stats for given type
 *
 * @param type
 */
export async function loadStatesByType(type: string): Promise<[]> {
    let statesByType: [] = [];
    let states: [] = await mssql_select_states();
    for (let stItem in states) {
        if (states.hasOwnProperty(stItem) && states[stItem]['STATES_TYPE'] === type) {
            statesByType.push(states[stItem]);
        }
    }
    return statesByType;
}
