/* AUTHOR: Stefan Schimmelpfennig, Andreas Lening */
/* LASTUPDATE: 01.06.2021  */

import * as sql from 'mssql';
import * as logger from '../config/winston';

import {changeLockStatus, tableLockStatus} from "./sql/table-locks/TableLocks";
import {addValuesToQuery} from "./mssql_logic";
import {config} from "mssql";

export function getConfigEnv() {
    const config: config = {
        server: process.env.SERVER,
        user: process.env.USER_ENV,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        options: {
            encrypt: false,
            trustedConnection: true,
            trustServerCertificate: true
        },
        pool: {
            min: parseInt(process.env.MIN),
            max: parseInt(process.env.MAX),
            idleTimeoutMillis: parseInt(process.env.IDLE_TIMEOUT_MILLIS),
        }
    }
    return config
}

const neededToLockKeyWords = ['update','UPDATE','insert','INSERT','use','USE','delete','DELETE','DBCC','truncate',
    'TRUNCATE','AA.RESERVED','DECLARE','SET'];
const whiteListKeyWords = ['select','SELECT'].concat(neededToLockKeyWords);
let counter: number = 0;
let arr: any;
let currentUser: string = '';
let finishFlag: boolean = false;

/**
 * @link https://www.npmjs.com/package/mssql
 * Managing connection pools by multiple pools
 */
const pools = {};

/**
 * manage a set of pools by name (config will be required to create the pool)
 * a pool will be removed when it is closed
 *
 * @param name
 * @param config
 */
async function getPool(name: string, config: config) {
    if (!Object.prototype.hasOwnProperty.call(pools, name)) {
        const pool = new sql.ConnectionPool(config);
        const close = pool.close.bind(pool);
        // @ts-ignore
        pool.close = (...args) => {
            // @ts-ignore
            delete pools[name];
            // @ts-ignore
            return close(...args);
        }
        await pool.connect();
        // @ts-ignore
        pools[name] = pool;
    }
    // @ts-ignore
    return pools[name];
}

/**
 * close all pools - call it when your application exits
 */
function closeAll() {
    return Promise.all(Object.values(pools).map((pool) => {
        // @ts-ignore
        return pool.close();
    }));
}

/**
 * close all mssql pools connections
 */
export async function soas_close_pool_connections() {
    return await closeAll();
}

/**
 * single db call (escaped)
 *
 * @param inputParamArray
 * @param query
 */
export async function mssqlCallEscaped(inputParamArray: { name: string, type: any, value: any }[], query: string) {
    return await dbCallEscaped(inputParamArray, query);
}

/**
 * single db call
 *
 * @param query
 */
export async function mssqlCall(query: string) {
    return await dbCall(query);
}

/**
 * multiple db calls
 * @param queryArray
 * @param callback
 */
export function mssqlCall_array(queryArray: [], callback: any) {
    arr = queryArray;
    counter = 0;
    recurseQueries();
    let myInterval = setInterval(function () {
        if (finishFlag) {
            clearInterval(myInterval);
            callback('IM DONE!');
        }
    }, 500);
}

/**
 * check if orders is locked
 * @param tableName
 * @param callback
 */
export async function isTableLocked(tableName: string, callback: any) {
    // @ts-ignore
    let data = await tableLockStatus(tableName);
    callback(data);
}

/**
 * change lockStatus from locked orders
 *
 * @param lockStatus
 * @param tableName
 * @param username
 */
export async function changeTableLockStatus(lockStatus: any, tableName: string, username: string) {
    currentUser = username;
    return await changeLockStatus(lockStatus, tableName, currentUser);
}

/**
 * execute insert method
 *
 * @param elementsArray
 * @param query
 * @param tableName
 */
export async function mssqlCallExecInsertMethod(tableDetailView: string[], elementsArray: any, query: string, tableName: string) {
    return await execInsertMethod(tableDetailView, elementsArray, query, tableName);
}

/**
 * send the query string to db - version for a query with escaping by built-in mssql library
 * Example:
 * UPDATE SOAS.dbo.WAREHOUSING SET RESERVED = RESERVED + @RESERVED WHERE ID = @ID;
 *
 * @param inputParamArray
 * @param query
 */
async function dbCallEscaped(inputParamArray: { name: string, type: any, value: any }[], query: any) {
    let config = getConfigEnv();
    if (query && (typeof query === 'string')) {
        // console.log('queryfsdfsf: ', query);
        // console.log('query type: ', typeof query);
        let splitQuery = query.split(" ");
        if (whiteListKeyWords.includes(splitQuery[0])) {
            // pool will always be connected when the promise has resolved - may reject if the connection config is invalid
            const pool = await getPool('default', config);
            try {
                // console.log('POOL: ', pool);
                let request = await pool.request();
                for (let inPmItem in inputParamArray) {
                    // console.log("pool: ", inputParamArray[inPmItem].name + " - " + inputParamArray[inPmItem].type + " - " +
                    // inputParamArray[inPmItem].value);
                    request.input(inputParamArray[inPmItem].name,
                        inputParamArray[inPmItem].type,
                        inputParamArray[inPmItem].value);
                }
                const result = await request.query(query);
                // console.dir("query-result: ", result.recordset);
                return result.recordset;
            } catch (err) {
                console.error('SQL error', err);
                // @ts-ignore
                logger.error(new Error(err));
                return {error: 'SQL error'};
            }
        } else {
            // @ts-ignore
            logger.warn('not allowed, not in whitelist: ');
            return {error: 'not allowed, not in whitelist'};
        }
    } else {
        // @ts-ignore
        logger.warn('query is empty: ');
        return {error: 'query is empty'};
    }
}

/**
 * send the query string to db
 *
 * @param query
 */
async function dbCall(query: any) {
    let config = await getConfigEnv();
    if (query && (typeof query === 'string')) {
        // console.log('query: ', query);
        // console.log('query type: ', typeof query);
        let splitQuery = query.split(" ");
        if (whiteListKeyWords.includes(splitQuery[0])) {
            // pool will always be connected when the promise has resolved - may reject if the connection config is invalid
            const pool = await getPool('default',config);
            try {
                // console.log('POOL: ', pool);
                const result = await pool.request().query(query);
                // console.dir("query-result: ", result.recordset);
                return result.recordset;
            } catch (err) {
                console.error('SQL error', err);
                // @ts-ignore
                logger.error(new Error(err));
                return {error: 'SQL error'};
            }
        } else {
            // @ts-ignore
            logger.warn('not allowed, not in whitelist: ');
            return {error: 'not allowed, not in whitelist'};
        }
    } else {
        // @ts-ignore
        logger.warn('query is empty: ');
        return {error: 'query is empty'};
    }
}

/**
 * recursive function to handle arrays from QueryStrings
 */
async function recurseQueries() {
    await dbCall(arr[counter]);
    if (counter < arr.length - 1) {
        counter++;
        await recurseQueries();
    } else {
        finishFlag = true;
    }
}

/**
 * execute insert method
 *
 * @param tableDetailView
 * @param elementsArray
 * @param query
 * @param tableName
 * @param iPNKeyCntr - optional, default = 0
 */
async function execInsertMethod(tableDetailView: string[], elementsArray: any, query: string, tableName: string, iPNKeyCntr: number = 0) {
    let queryValues: {inputParamsArray: any, query: string} =
        await addValuesToQuery(tableDetailView, elementsArray, query, tableName, iPNKeyCntr);
    console.log('execInsertMethod inputParamsArray: ', queryValues.inputParamsArray);
    console.log('insert query: ', queryValues.query);
    let data = await mssqlCallEscaped(queryValues.inputParamsArray, queryValues.query);
    console.log('Insert Result: ', data);
    return (data && !data.error) ? data : undefined;
}

/**
 * copy of mysql_real_escape_string
 *
 * @param str
 */
function real_escape_string (str: null|string) {
    if (str !== null) {
        return str.replace(/[\\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\" + char; // prepends a backslash to backslash, percent,
                                        // and double/single quotes
                default:
                    return char;
            }
        });
    } else {
        return str;
    }
}

/**
 * escape given string
 *
 * @deprecated - use enum instead
 * @param str
 */
export function escapeString(str: null|string) {
    return real_escape_string(str);
}
