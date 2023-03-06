/* AUTHOR: Andreas Lening */
/* LAST UPDATE: ß4.02.2022 */
import {
    getTableColumnsTypesByDataTypes, mssql_call_get_import_template,
    mssql_call_get_table_data_types,
    mssql_call_get_table_name_and_detail_view
} from "../../mssql_logic";
import {parseCsvImportFile} from "../../csv_import";
import {constants} from "../../constants/constants";
import mssqlCall = require('../../mssql_call');
import {startTimeTracking, stopTimeTracking} from "../../helpers";
import fs = require('fs');
import logger = require('../../../config/winston');
import * as path from 'path';
import * as csv from 'fast-csv';


/**
 * Import table data from csv file. Use imported data to create INSERT/UPDATE/SELECT query.
 *
 * IMPORTANT:
 * Insert query type:  Csv file should not have header row. Query will be executed automatically after creation,
 * if EXEC_INSERT_QUERY is set to true!
 * Update/Select query type: Need to have a header row. Results will be written to txt file.
 *
 * Export data as csv file for all query types:
 * Export csv file with mssql studio by do SELECT all items of the source table and save result as csv file.
 *
 * Setup for INSERT query:
 * Do a back-up of the target table.
 * Make a copy of the csv file and remove header row.
 * Put csv file to import to folder at: /routes/logic/csv/imported/tmp/.
 * Empty target table and if neccessary, reseed identities before running import function.
 * Set EXEC_INSERTQUERY to true only after reviewing the query in the console log.
 *
 * Setup for UPDATE/SELECT query:
 * Make a copy of exported csv file (don't remove header row).
 * Add to UPDATE_OR_SELECT_MODE_COLUMNS the column names of the data in csv file.
 * Results will be written at /tmp folder to txt file named 'update.txt' or 'select.txt'
 */
export async function importCsvFile() {

    const START_TIME = startTimeTracking('importCsvFile');

    const QUERY_TYPE: string = constants.QUERY_TYPES.UPDATE;
    // set target table name for insert, update or select qeury
    const TARGET_TABLE_NAME: string = 'ORDERS_POSITIONS';
    const UPDATE_OR_SELECT_MODE_COLUMNS: string[] = ['ORDERS_NUMBER', 'POSITION_ID', 'CATEGORY_SOAS', 'ITMDES'];
    const CSV_FILENAME: string = 'ExportedOrderPositions.csv';

    // Insert type settings
    const EXEC_INSERT_QUERY: boolean = false;
    const SET_IDENTITY: boolean = true; // don't set true where is no ID: ORDERS, DELIVERY NOTRES, INVOICES, CUSTOMERS
    const MAX_INSERT_NUMBER = 400;
    const TIMEOUT_BETWEEN_INSERTS = 250;

    console.log('CURRENT DATABASE: ', constants.DB_TABLE_PREFIX);
    console.log('csvFileName: ', CSV_FILENAME);
    console.log('tableName: ', TARGET_TABLE_NAME);

    // const IMPORT_MODE: string = getImportType(CSV_FILENAME);
    // console.log('importMode: ', IMPORT_MODE);

    // get column names from table columns data
    let columns: string[] = [];

    if (QUERY_TYPE === constants.QUERY_TYPES.INSERT) {
        // For insert query type, get the column names from db's target table
        const TABLE_DATA: any = await mssql_call_get_import_template(TARGET_TABLE_NAME);
        if (!TABLE_DATA) {
            throw new Error('Wrong ' + TARGET_TABLE_NAME);
        }
        const TABLE_DETAIL_VIEW: string[] = TABLE_DATA[0]['TEMPLATE_FIELDS'].split(',');
        const DATA_TYPES: [] = await mssql_call_get_table_data_types(TARGET_TABLE_NAME);
        console.log('DATA_TYPES: ', DATA_TYPES);
        checkIdentity(DATA_TYPES, SET_IDENTITY);
        const TABLE_COLUMNS_DATA: {} = getTableColumnsTypesByDataTypes(DATA_TYPES, TABLE_DETAIL_VIEW);
        console.log('tableColumnsData: ', TABLE_COLUMNS_DATA);
        // check columns for insert query
        columns = checkColumns(QUERY_TYPE, TABLE_COLUMNS_DATA, columns);
    } else {
        // set reduced columns for update/select queries
        columns = UPDATE_OR_SELECT_MODE_COLUMNS;
    }
    console.log('columns: ', columns);

    // load csv file data by fast-csv or csv-parser
    const CSV_DATA: any = await readCSVFile(CSV_FILENAME); // load by fast-csv
    // const CSV_DATA: any = await parseCsvImportFile(CSV_FILENAME, columns); // load by csv-parser
    console.log('ORDER_POSITIONS_DATA[0]: ', CSV_DATA[0]);

    let lines = 0;
    let writtenLines = 0;

    if (QUERY_TYPE === constants.QUERY_TYPES.INSERT) {
        let data = await createInsertQueries(TARGET_TABLE_NAME, columns, CSV_DATA, MAX_INSERT_NUMBER, SET_IDENTITY,
            TIMEOUT_BETWEEN_INSERTS, EXEC_INSERT_QUERY);
        lines = data.lines;
        writtenLines = data.writtenLines;
    } else if (QUERY_TYPE === constants.QUERY_TYPES.UPDATE) {
        createUpdateQueries(TARGET_TABLE_NAME, columns, CSV_DATA, MAX_INSERT_NUMBER);
    } else {
        createSelectQuery(TARGET_TABLE_NAME, columns, CSV_DATA, MAX_INSERT_NUMBER);
    }

    console.log('Finished ' + QUERY_TYPE.toUpperCase() + ' : ', writtenLines + ' of ' + lines + ' ' + new Date());
    stopTimeTracking(START_TIME, 'importCsvFile');
}

/**
 * create uodate queries and write them to txt file at tmp folder
 *
 * @param TABLE_NAME
 * @param columns
 * @param CSV_DATA
 * @param MAX_INSERT_NUMBER
 */
function createUpdateQueries(TABLE_NAME: string, columns: string[], CSV_DATA: any, MAX_INSERT_NUMBER: number) {
    let queryToUpdate: string[] = getQueryToUpdate(TABLE_NAME, columns, CSV_DATA, MAX_INSERT_NUMBER);
    console.log('queryToUpdate[0]: ', queryToUpdate[0]);
    writeToFile(queryToUpdate, 'update.txt');
    return {lines: queryToUpdate.length, writtenLines: queryToUpdate.length};
}

/**
 * create uodate queries and write them to txt file at tmp folder
 *
 * @param TABLE_NAME
 * @param columns
 * @param CSV_DATA
 * @param MAX_INSERT_NUMBER
 */
function createSelectQuery(TABLE_NAME: string, columns: string[], CSV_DATA: any, MAX_INSERT_NUMBER: number) {
    let queryToSelect: string[] = getQueryToSelect(TABLE_NAME, columns, CSV_DATA, MAX_INSERT_NUMBER);
    // console.log('queryToSelect[0]: ', queryToSelect[0]);
    writeToFile(queryToSelect, 'select.txt');
    return {lines: queryToSelect.length, writtenLines: queryToSelect.length};
}

/**
 * create insert queries and write them directly to db
 *
 * @param TABLE_NAME
 * @param columns
 * @param CSV_DATA
 * @param MAX_INSERT_NUMBER
 * @param SET_IDENTITY
 * @param TIMEOUT_BETWEEN_INSERTS
 * @param EXEC_INSERT_QUERY
 */
async function createInsertQueries(TABLE_NAME: string, columns: string[], CSV_DATA: any, MAX_INSERT_NUMBER: number,
                                   SET_IDENTITY: boolean, TIMEOUT_BETWEEN_INSERTS: number, EXEC_INSERT_QUERY: boolean) {

    // insert many VALUES rows per each call
    // prepare insert queries with limited number of VALUES rows to insert
    let queryToInsert: string[] = getQueryToInsert(TABLE_NAME, columns, CSV_DATA, MAX_INSERT_NUMBER);
    console.log('orderQueryToInsert: ', queryToInsert[0]);

    let writtenLines = 0;
    if (EXEC_INSERT_QUERY) {

        // IMPORTANT: don't add ';' to queries, because otherwise SET IDENTITY_INSERT ON OFF is not working !!!
        // @link https://stackoverflow.com/a/61883209
        const SET_ON_QUERY = 'SET IDENTITY_INSERT ' + constants.DB_TABLE_PREFIX + TABLE_NAME + ' ON ';
        const SET_OFF_QUERY = 'SET IDENTITY_INSERT ' + constants.DB_TABLE_PREFIX + TABLE_NAME + ' OFF ';

        // write insert queries into db in steps of max 400 items
        let maxLines: number = CSV_DATA.length;
        try {
            console.log('Start inserting...');
            for (let insertItem in queryToInsert) {
                if (queryToInsert.hasOwnProperty(insertItem)) {
                    await mssqlCall.mssqlCall((SET_IDENTITY ? SET_ON_QUERY + ' ' : '') + queryToInsert[insertItem]);
                    new Promise((resolve) => {
                        setTimeout(resolve, TIMEOUT_BETWEEN_INSERTS); // wait some time
                    });
                    writtenLines++;
                    printWrittenLines(writtenLines, maxLines);
                }
            }
            // Last query to disallow insert identity
            if (SET_IDENTITY) {
                await mssqlCall.mssqlCall(SET_OFF_QUERY);
            }
        } catch (err) {
            console.log('ERROR catch writtenLines: ', writtenLines);
            console.log(new Error(err));
        }
    }
    return {lines: queryToInsert.length, writtenLines};
}

function addFormattedValueToQuery(dataArray: any[], ordItem: string, templateFieldsArr: string[], tmplItem: string,
                                  stepQuery, tableName: string) {
    if (dataArray[ordItem][templateFieldsArr[tmplItem]] &&
        dataArray[ordItem][templateFieldsArr[tmplItem]].trim() !== 'NULL') {

        let dataField: any = dataArray[ordItem][templateFieldsArr[tmplItem]].trim();
        // replace line breaks and quotes
        dataField = dataField.replace(/\r\n/g, " "); // https://stackoverflow.com/a/30908728
        dataField = dataField.replace(/'/g, '\'\'');
        dataField = dataField.replace(/"/g, '""');

        if (templateFieldsArr[tmplItem] === 'CREATE_DATE') {
            stepQuery += "CAST(N'" + dataField + "' AS Date),";
        } else // replace comma with point for float 'DISCOUNT' field
        if (tableName === 'ORDERS' && templateFieldsArr[tmplItem] === 'DISCOUNT') {
            stepQuery += "N'" + dataField.replace(',', '.') + "',";
        } else {
            stepQuery += "N'" + dataField + "',";
        }
    } else {
        // Workauround for invoices, to be able to insert invoice without order and delivery note
        if (tableName === 'INVOICES' &&
            (templateFieldsArr[tmplItem] === 'ORDERS_NUMBER' ||
                templateFieldsArr[tmplItem] === 'DELIVERY_NOTES_NUMBER')) {
            stepQuery += "N'',";
        } else {
            stepQuery += "NULL,";
        }
    }
    return stepQuery;
}

/**
 * returns array of insert queries from given data array, with limited VALUES rows per query
 *
 * @param tableName
 * @param templateFieldsArr
 * @param dataArray
 * @param maxInsertRows - max number of values rows for insert (default is 400; mssql limit is 1000 rows)
 */
export function getQueryToInsert(tableName: string,
                                 templateFieldsArr: string[],
                                 dataArray: any[],
                                 maxInsertRows = 400): any[] {
    if (maxInsertRows > 1000) {
        // @link https://docs.microsoft.com/en-us/sql/t-sql/queries/table-value-constructor-transact-sql?redirectedfrom=MSDN&view=sql-server-ver15
        throw new Error('Maximum number of insert VALUES rows is 1000!');
    }
    // Add as first element the query to allow insert identity
    let insertData: any[] = [];
    let orderQuery: string = "INSERT INTO " + constants.DB_TABLE_PREFIX + tableName + " (";
    for (let tmplItem in templateFieldsArr) {
        orderQuery += templateFieldsArr[tmplItem] + ",";
    }
    orderQuery = orderQuery.substr(0, orderQuery.length - 1); // remove last ,
    orderQuery += ") VALUES ";
    let counter = 0;
    let stepQuery = JSON.parse(JSON.stringify(orderQuery)); // make a copy
    console.log('dataArray::: ', dataArray);
    for (let ordItem in dataArray) {
        stepQuery += "(";
        for (let tmplItem in templateFieldsArr) {
            // console.log('dataArray[ordItem][templateFieldsArr[tmplItem]] : ', dataArray[ordItem][templateFieldsArr[tmplItem]] );
            // console.log('type: ', (typeof dataArray[ordItem][templateFieldsArr[tmplItem]]) );
            stepQuery = addFormattedValueToQuery(dataArray, ordItem, templateFieldsArr, tmplItem, stepQuery, tableName);
        }
        stepQuery = stepQuery.substr(0, stepQuery.length - 1); // remove last ,
        stepQuery += "),";
        counter++;
        if (counter === maxInsertRows) {
            counter = 0;
            stepQuery = stepQuery.substr(0, stepQuery.length - 1); // remove last ,
            stepQuery += ''; // don't add ';' because otherwise SET IDENTITY_INSERT ON OFF is not working !!!
            insertData.push(stepQuery);
            stepQuery = JSON.parse(JSON.stringify(orderQuery)); // make a copy
        }
    }
    if (counter > 0) {
        stepQuery = stepQuery.substr(0, stepQuery.length - 1); // remove last ,
        stepQuery += ';'; // don't add ';' because otherwise SET IDENTITY_INSERT ON OFF is not working !!!
        insertData.push(stepQuery);
    }
    return insertData;
}

/**
 * returns array of update queries from given data array, with limited VALUES rows per query
 *
 * @param tableName
 * @param templateFieldsArr
 * @param dataArray
 * @param maxInsertRows - max number of values rows for insert (default is 400; mssql limit is 1000 rows)
 */
export function getQueryToUpdate(tableName: string,
                                 templateFieldsArr: string[],
                                 dataArray: any[],
                                 maxInsertRows = 400): any[] {
    // Add as first element the query to allow insert identity
    let insertData: any[] = [];
    let orderQuery: string = " UPDATE " + constants.DB_TABLE_PREFIX + tableName + " SET ";
    let counter = 0;
    let stepQuery: string;
    for (let ordItem in dataArray) {
        stepQuery = JSON.parse(JSON.stringify(orderQuery)); // make a copy
        for (let tmplItem in templateFieldsArr) {
            if (templateFieldsArr[tmplItem] !== 'ID') {
                stepQuery += " " + templateFieldsArr[tmplItem] + " = ";
                stepQuery = addFormattedValueToQuery(dataArray, ordItem, templateFieldsArr, tmplItem, stepQuery, tableName);
            }
        }
        stepQuery += " ITMNUM = N'0000',"
        stepQuery = stepQuery.substr(0, stepQuery.length - 1); // remove last ,
        stepQuery += " WHERE " +
            // "ID = '" + dataArray[ordItem]['ID'] + "' AND " +
            "ORDERS_NUMBER = '" + dataArray[ordItem]['ORDERS_NUMBER'] + "'" +
            " AND POSITION_ID = '" + dataArray[ordItem]['POSITION_ID'] + "'" +
            " AND ITMNUM = '0'" +
            ";";
        insertData.push(stepQuery);
        counter++;
    }
    return insertData;
}

export function getQueryToSelect(tableName: string,
                                 templateFieldsArr: string[],
                                 dataArray: any[],
                                 maxInsertRows = 400): any[] {
    // Add as first element the query to allow insert identity
    let insertData: any[] = [];
    let orderQuery: string = " ";
    let counter = 0;
    let ignored = 0;
    let stepQuery: string = "";
    for (let ordItem in dataArray) {
        for (let tmplItem in templateFieldsArr) {
            if (templateFieldsArr[tmplItem] === 'ORDERS_NUMBER') {
                if (stepQuery.toLowerCase().indexOf(
                    dataArray[ordItem][templateFieldsArr[tmplItem]].trim().replace(/'/g, '\'\'').toLowerCase()) === -1) {
                    // stepQuery += " " + templateFieldsArr[tmplItem] + " = ";
                    // stepQuery += " " + "SORDER.SOHNUM_0" + " = ";
                    stepQuery = addFormattedValueToQuery(dataArray, ordItem, templateFieldsArr, tmplItem, stepQuery, tableName);
                } else {
                    ignored++;
                }
            }
        }
        stepQuery = stepQuery.substr(0, stepQuery.length - 1); // remove last ,
        // stepQuery += " OR ";
        stepQuery += ",";
        counter++;
        // if (counter === 7) {
        //     break;
        // }
    }
    // stepQuery = stepQuery.substr(0, stepQuery.length - 3); // remove last OR
    stepQuery = stepQuery.substr(0, stepQuery.length - 1); // remove last ,
    stepQuery = "SELECT SORDER.SOHNUM_0, SORDERP.ITMDES_0 from x3v65p.EMOPILOT.SORDERP " +
        "LEFT JOIN x3v65p.EMOPILOT.SORDER ON SORDER.SOHNUM_0 = SORDERP.SOHNUM_0 " +
        "WHERE SORDERP.ITMREF_0 = '0000' AND SORDER.SOHNUM_0 IN (" + stepQuery + ");";
    // "WHERE SORDERP.ITMREF_0 = '0000' AND (" + stepQuery + ");";
    insertData.push(stepQuery);
    console.log('ignored: ', ignored + ' of ' + counter);
    return insertData;
}

export function readCSVFile(fileName: string) {
    return new Promise((res, rej) => {
        let dataArray = [];
        fs.createReadStream(path.resolve(__dirname, '../../../logic/csv/imported/', 'tmp', fileName))
            .pipe(csv.parse({headers: true, delimiter: ';', trim: true}))
            .on('error', (error) => console.error(error))
            .on('data', (row) => {
                // console.log(row);
                dataArray.push(row);
            })
            .on('end', (rowCount: number) => {
                console.log(`Parsed ${rowCount} rows`);
                res(dataArray);
            });
    })
}

/**
 * write to file
 *
 * @param queryToUpdate
 * @param fileName
 */
export function writeToFile(queryToUpdate: string[], fileName: string, tmpPath: string = '../../../logic/csv/imported/') {

    const CreateFiles = fs.createWriteStream(path.resolve(__dirname, tmpPath, 'tmp', fileName), {
        flags: 'a' //flags: 'a' preserved old data
    })

    for(let i = 0; i < queryToUpdate.length; i++){
        CreateFiles.write(queryToUpdate[i].toString()+'\r\n') //'\r\n at the end of each value
    }

    CreateFiles.close();
}

/**
 * print written lines
 *
 * @param writtenLines
 * @param maxLines
 */
function printWrittenLines(writtenLines: number, maxLines: number) {
    if (writtenLines > maxLines) {
        console.log('ERROR writtenLines: ', writtenLines);
    } else if (writtenLines === 250) {
        console.log('100000 lines written ', new Date());
    } else if (writtenLines === 500) {
        console.log('200000 lines written ', new Date());
    } else if (writtenLines === 1000) {
        console.log('400000 lines written ', new Date());
    } else if (writtenLines === 1500) {
        console.log('600000 lines written ', new Date());
    }
}

/**
 * check identity field in given tables columns
 *
 * @param dataTypes
 * @param setIdentity
 */
function checkIdentity(dataTypes: any[], setIdentity: boolean) {
    let foundIdentity = false;
    for (let dataItem in dataTypes) {
        if (dataTypes.hasOwnProperty(dataItem)) {
            if (dataTypes[dataItem].column === 'ID') {
                if (setIdentity === false) {
                    throw new Error('Current table have IDENTITY field! Please set identity flag to TRUE!');
                }
                foundIdentity = true;
                break;
            }
        }
    }
    if (foundIdentity === false && setIdentity === true) {
        throw new Error('Current table does not have IDENTITY field! Please set identity flag to FALSE!');
    }
}

/**
 * check columns for insert query
 *
 * @param QUERY_TYPE
 * @param TABLE_COLUMNS_DATA
 * @param columns
 */
function checkColumns(QUERY_TYPE: string, TABLE_COLUMNS_DATA: {}, columns: string[]) {
    if (QUERY_TYPE === constants.QUERY_TYPES.INSERT) {
        let allColumnsAvailable = true;
        for (let columnItem in TABLE_COLUMNS_DATA) {
            columns.push(columnItem);
            if (!columns.includes(columnItem)) {
                allColumnsAvailable = false;
                break;
            }
        }
        if (!allColumnsAvailable) {
            throw new Error('Not all columns from DB are set!');
        }
    }
    return columns;
}

/**
 * get import type by given file name
 *
 * @param CSV_FILENAME
 */
function getImportType(CSV_FILENAME: string) {
    let importMode: string;
    const fileNameParts = CSV_FILENAME.split('.');
    console.log('fileNameParts: ', fileNameParts);
    console.log('constants.IMPORT_TYPES: ', constants.IMPORT_TYPES);
    if (fileNameParts[1].toUpperCase() === 'CSV' || fileNameParts[1].toUpperCase() === 'TXT') {
        importMode = constants.IMPORT_TYPES.CSV;
    } else if (fileNameParts[1].toUpperCase() === 'SQL') {
        importMode = constants.IMPORT_TYPES.SQL;
    }
    return importMode;
}
