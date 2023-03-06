/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 31.05.2021 */

import sql = require('mssql');
import mssqlCall = require('../../mssql_call');
import {constants} from '../../constants/constants';
import {mssql_select_Table_by_Number} from '../table/Table';
import {getThisLocalizeData} from '../localize-it/LocalizeIt';
import {ViewQueryTypes} from '../../constants/enumerations';

/**
 * get form template for given referral table name
 *
 * @param refTable
 */
export async function mssql_call_get_form_template(refTable: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'REF_TABLE', type: sql.VarChar, value: refTable}];
    return await mssqlCall.mssqlCallEscaped(inputParamsArray,
        `SELECT REF_TABLE,FORM_TEMPLATE FROM ` + constants.DB_TABLE_PREFIX + `FORM_TEMPLATES 
        WHERE REF_TABLE = @REF_TABLE`);
}

/**
 * get form template by refTable
 *
 * @param refTable
 * @param language
 */
export async function mssql_select_form_template(refTable: string, language: string) {
    // console.log("mssql_select_form_template...........");
    // console.log('refTable: ', refTable);
    let resultData: any = mssql_call_get_form_template(refTable);
    if (resultData && Object.keys(resultData).length > 0) {
        let formTemplateResultAsArray: any = [];
        formTemplateResultAsArray.push(JSON.parse(resultData[0]['FORM_TEMPLATE']));
        let inputParamsArray: { name: string, type: any, value: any }[] = [
            {name: 'REF_TABLE', type: sql.VarChar, value: refTable}];
        let lockedFields: any = await mssqlCall.mssqlCallEscaped(inputParamsArray,
            `SELECT LOCKED_FIELDS FROM ` +
            constants.DB_TABLE_PREFIX + `TABLE_TEMPLATES WHERE REF_TABLE = @REF_TABLE`);
        return await getThisLocalizeData(formTemplateResultAsArray, language, lockedFields, refTable);
    } else {
        console.log('ERROR: resultData for refTable ' + refTable + ' is empty...');
        return {
            success: false,
            message: 'No entry is found in FORM_TEMPLATES for refTable = "' + refTable + '" !'
        };
    }
}

/**
 *
 * @param refTable
 * @param primaryKey
 * @param primaryValue
 * @param secondaryKey
 * @param secondaryValue
 * @param language
 * @param offsetRowCount
 * @param fetchRowCount
 * @param pageNumber
 */
export async function formly_mssql_select_table_for_form(refTable: string,
                                                         primaryKey: string, primaryValue: string,
                                                         secondaryKey: string | undefined,
                                                         secondaryValue: string | undefined,
                                                         language: string, offsetRowCount: number | undefined,
                                                         fetchRowCount: number | undefined,
                                                         pageNumber: number):
    Promise<{ data: {}, rows: number, page: number }> {
    let orderByColumn: string = primaryKey;
    let orderByDirection: string = constants.SORT_TYPES.ASC;
    return await mssql_select_Table_by_Number(refTable, ViewQueryTypes.DETAIL_TABLE,
        primaryKey, primaryValue, secondaryKey, secondaryValue,
        offsetRowCount, fetchRowCount, pageNumber, orderByColumn, orderByDirection);
}

/**
 * get formly form template
 *
 * @param refTable
 */
export async function get_formly_form(refTable: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'REF_TABLE', type: sql.VarChar, value: refTable}];
    return await mssqlCall.mssqlCallEscaped(inputParamsArray,
        `SELECT FORM_TEMPLATE FROM ` + constants.DB_TABLE_PREFIX + `FORM_TEMPLATES WHERE REF_TABLE = @REF_TABLE`);
}
