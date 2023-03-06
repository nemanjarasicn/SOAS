/* AUTHOR: Ronny Brandt, Andreas Lening */
/* LAST UPDATE: 28.05.2021 */

import sql = require('mssql');
import mssqlCall = require('../../mssql_call');
import {constants} from '../../constants/constants';
import {getThisLocalizeData} from '../localize-it/LocalizeIt';


/** Ronny Brandt
 * USER Queries to check if a user has successfully authenticated
 *
 * @param user
 * @param pass
 */
export async function mssql_query_users(user: string, pass: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'USER_SOAS_LOGIN', type: sql.VarChar, value: user},
        {name: 'USER_SOAS_PASSWD', type: sql.VarChar, value: pass}];
    let query: string = `SELECT * FROM ` + constants.DB_TABLE_PREFIX + `USERS WHERE USER_SOAS_LOGIN = @USER_SOAS_LOGIN AND 
    USER_SOAS_PASSWD = CONVERT(BINARY(32), @USER_SOAS_PASSWD)`;
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
}

/**
 * Andreas Lening
 * Select user(s). Returns one user, if userid is set. Else all users.
 *
 * @param userid
 * @param top
 * @param bot
 * @param orderCondition
 * @param refTable
 * @param language
 */
export async function mssql_select_user(userid: undefined|number, top: number, bot: number, orderCondition: string,
                                        refTable: string, language: string,) {
    let resultArray: any = [];
    top = (typeof top === "undefined") ? 0 : top;
    bot = (typeof bot === "undefined") ? 1 : bot;
    enum orderConditionTypes {
        USER_SOAS_ID = 'USER_SOAS_ID' as any,
        USER_SOAS_NAME = 'USER_SOAS_NAME' as any,
        USER_SOAS_LOGIN = 'USER_SOAS_LOGIN' as any,
    }
    const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'USER_ID', type: sql.Int, value: userid ? userid : null},
        {name: 'TOP', type: sql.Int, value: top},
        {name: 'BOT', type: sql.Int, value: bot},
        {name: 'REF_TABLE', type: sql.VarChar, value: refTable},
        {name: 'ORDER_CONDITION', type: sql.VarChar, value: orderCondition},
        {name: 'OC_USER_SOAS_ID', type: sql.VarChar, value: 'USER_SOAS_ID'},
        {name: 'OC_USER_SOAS_NAME', type: sql.VarChar, value: 'USER_SOAS_NAME'}];
    let query: string = `SELECT USER_SOAS_ID,USER_SOAS_NAME,USER_SOAS_LOGIN,USER_ROLE,USER_LANGUAGE 
        FROM ` + DB_TABLE_PREFIX + `USERS`;
    if (typeof userid !== 'undefined' && userid !== 0) {
        query += ` WHERE USER_SOAS_ID = @USER_ID`;
    }
    if (orderCondition && Object.values(orderConditionTypes).includes(orderCondition)) {
        query += ` ORDER BY ` + orderConditionTypes[orderCondition as keyof typeof orderConditionTypes] +
            ` OFFSET @TOP ROWS FETCH NEXT @BOT ROWS ONLY`;
    }
    console.log("mssql_select_user query: ", query);
    let data: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
    resultArray.push(data);
    if (refTable) {
        let lockedFields: any = await mssqlCall.mssqlCallEscaped(inputParamsArray,
            `SELECT LOCKED_FIELDS FROM ` + DB_TABLE_PREFIX + `TABLE_TEMPLATES WHERE REF_TABLE = @REF_TABLE`);
        let result: any = await getThisLocalizeData(data, language, lockedFields, refTable);
        resultArray.push(result);
    }
    return resultArray;
}

/** Andreas Lening
 * Insert new user
 *
 * @param name
 * @param login
 * @param hash_pass
 * @param role
 * @param language
 */
export async function mssql_insert_user(name: string, login: string, hash_pass: string, role: string, language: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'USER_SOAS_NAME', type: sql.VarChar, value: name},
        {name: 'USER_SOAS_LOGIN', type: sql.VarChar, value: login},
        {name: 'USER_SOAS_PASSWD', type: sql.VarChar, value: hash_pass},
        {name: 'USER_ROLE', type: sql.VarChar, value: role},
        {name: 'USER_LANGUAGE', type: sql.VarChar, value: language}];
    let query: string = `INSERT INTO ` + constants.DB_TABLE_PREFIX + `USERS 
        (USER_SOAS_NAME, USER_SOAS_LOGIN, USER_SOAS_PASSWD, USER_ROLE, USER_LANGUAGE) VALUES 
        (@USER_SOAS_NAME, @USER_SOAS_LOGIN, CONVERT(BINARY(32), @USER_SOAS_PASSWD), @USER_ROLE, @USER_LANGUAGE)`;
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
}

/** Andreas Lening
 * Update given user
 *
 * @param id
 * @param name
 * @param role
 * @param language
 */
export async function mssql_update_user(id: number, name: string, role: string, language: string) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'USER_SOAS_ID', type: sql.VarChar, value: id},
        {name: 'USER_SOAS_NAME', type: sql.VarChar, value: name},
        {name: 'USER_ROLE', type: sql.VarChar, value: role},
        {name: 'USER_LANGUAGE', type: sql.VarChar, value: language}];
    let query: string = `UPDATE ` + constants.DB_TABLE_PREFIX + `USERS SET USER_SOAS_NAME = @USER_SOAS_NAME, 
    USER_ROLE = @USER_ROLE, USER_LANGUAGE = @USER_LANGUAGE WHERE USER_SOAS_ID = @USER_SOAS_ID`;
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
}

/** Andreas Lening
 * Delete user
 *
 * @param id
 */
export async function mssql_delete_user(id: number) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'USER_SOAS_ID', type: sql.Int, value: id}];
    let query: string = `DELETE FROM ` + constants.DB_TABLE_PREFIX + `USERS WHERE USER_SOAS_ID = @USER_SOAS_ID`;
   return await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
}

/**
 * Get role(s)
 *
 * @param roleName
 * @returns one role, if role name is set. Else all roles.
 */
export async function mssql_select_role(roleName: any) {
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'ROLE_NAME', type: sql.VarChar, value: roleName}];
    let query: string = `SELECT * FROM ` + constants.DB_TABLE_PREFIX + `ROLES`;
    if (typeof roleName !== 'undefined' && roleName !== 0 && roleName !== '') {
        query += ` WHERE ROLE_NAME = @ROLE_NAME`;
    }
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, query);
}
