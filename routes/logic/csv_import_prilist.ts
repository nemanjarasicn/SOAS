/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 06.08.2019 */
// @ts-ignore
import sql = require('mssql');
import fs = require('fs');
import logger = require('./../config/winston');
// @ts-ignore
import config = require('../config/config');
// @ts-ignore
import mssqlCall = require('./mssql_call.js');
/**
 * Upload csv file to csv folder. Read csv file data and generate sql queries for insert into db.
 */
module.exports = {
    csv_import_logic: function (importFile: any, callback: any) {
        let prilistColumnName = 'prilist'; // PRILIST
        let prilistColPos = 7;
        let delimiter = ';';
        let outputFilePath = __dirname + "\\csv\\";
        // @ts-ignore
        let csvDataObjArr = [];
        // @ts-ignore
        let sqlQueriesArray = [];
        let separator = '-';
        let d = new Date();
        let year = d.getFullYear().toString().substr(-2);
        let prilistSTART = 'SPL' + year.toString() + separator;
        let prLIST = '';
        let nextPRILIST = '';
        // Get latest PRILIST number from db, increase it + 1
        // Check CSV file for PRILIST column
        let initLatestPRILIST = function (callback: any) {
            getLatestPRILIST(prilistSTART, separator, function (data: any) {
                // @ts-ignore
                logger.info('CALLBACK: ' + data);
                prLIST = data;
                // @ts-ignore
                logger.info('Insert - LATEST PRILIST : ' + prLIST);
                if (prLIST) {
                    // Set next PRILIST once
                    if (!nextPRILIST) {
                        // @ts-ignore
                        nextPRILIST = generatePRILIST(prLIST, prilistSTART, separator);
                    }
                }
                if (nextPRILIST) {
                    //checkCSVFile();
                    return callback();
                } else {
                    throw 'Generated PRILIST is empty.';
                }
            });
        };
        initLatestPRILIST(function (data: any) {
            // @ts-ignore
            logger.info('PRILIST created... ' + data);
            if (importFile.length === 0) {
                callback('neiyen')
            }
            // @ts-ignore
            logger.info('File exists');
            // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
            let csvFile = importFile.csvfile;
            outputFilePath = outputFilePath + csvFile.name;
            // Use the mv() method to place the file somewhere on your server
            csvFile.mv(outputFilePath, function (err: any) {
                if (err) {
                    // @ts-ignore
                    logger.error(new Error(err));
                }
                //res.send('Datei hochgeladen und verschoben! Pfad: ' + outputFilePath);
                // @ts-ignore
                logger.info('Datei hochgeladen und verschoben! Pfad: ' + outputFilePath);
                readCSVFile(outputFilePath);
            });
            // Read in csv file lines into csvDataArray
            let readCSVFile = function (path: any) {
                // @ts-ignore
                let errors = [];
                let lineReader = require('readline').createInterface({
                    input: fs.createReadStream(path)
                    // output: fs.createWriteStream(path, { encoding: "utf8"})
                });
                let counter = 0;
                lineReader.on('line', function (line: any) {
                    //logger.info('Line from file:' + line);
                    let isError = false;
                    let lineElem = line.split(delimiter);
                    //check price_EK
                    if (counter > 0) {
                        // @ts-ignore
                        if (!lineElem[1] > 0) {
                            errors.push({
                                errortype: 'EK Preis <= 0',
                                linenumber: counter,
                                anum: lineElem[0],
                                faultyPrice: lineElem[1]
                            });
                            // @ts-ignore
                            logger.info('price_EK is 0 for ordernumber: ' + lineElem[0]);
                            isError = true;
                        }
                        if (!lineElem[3] || lineElem[3] === undefined) {
                            errors.push({
                                errortype: 'Preisliste nicht gesetzt',
                                linenumber: counter,
                                anum: lineElem[0],
                                faultyPrice: lineElem[1]
                            });
                            // @ts-ignore
                            logger.info('pricelist not set: ' + lineElem[0]);
                            isError = true;
                        }
                    }
                    if (!isError) {
                        csvDataObjArr.push({
                            ordernumber: lineElem[0],
                            price_EK: lineElem[1],
                            pseudoprice_EK: lineElem[2],
                            prilist: lineElem[3],
                        });
                    }
                    counter++;
                });
                lineReader.on('close', function () {
                    // @ts-ignore
                    logger.info('Csv file data was successfully imported...');
                    // @ts-ignore
                    logger.info('Delete csv file...');
                    // @ts-ignore
                    ifExistPrilistInDB(csvDataObjArr, function (data: any) {
                        // @ts-ignore
                        logger.info('Csv data and DB was checked...');
                        csvDataObjArr = data;
                        //printAllPRINTLISTSQLQueries(csvDataObjArr);
                        // @ts-ignore
                        writeCSVDataIntoTable(csvDataObjArr, sqlQueriesArray, function (data: any) {
                            // @ts-ignore
                            logger.info('Csv data was prepaired for writing to DB...');
                            sqlQueriesArray = data;
                            insertPRINTLISTSIntoDB(sqlQueriesArray, function (data: any) {
                                // @ts-ignore
                                logger.info('Everything done ' + data);
                                // @ts-ignore
                                logger.info('Print JSON message...');
                                let resJson = {
                                    message: 'im done',
                                    // @ts-ignore
                                    errs: errors,
                                };
                                callback(resJson);
                            });
                        });
                    });
                });
            }
        });
    }
};
/**
 * Print out all given sql queries
 */
let printAllPRINTLISTSQLQueries = function (sqlqueries: any) {
    // @ts-ignore
    logger.info('Print all PRINTLISTS sql queries: ');
    sqlqueries.forEach(function (element: any) {
        // @ts-ignore
        logger.info(element);
    });
};

/**
 * Insert all PRINTLISTS into database
 */
function insertPRINTLISTSIntoDB (sqlqueries: any, callback: any) {
    // @ts-ignore
    logger.info('Insert all PRINTLISTS to database: ' + sqlqueries.length);
    // @ts-ignore
    mssqlCall.mssqlCall_array(sqlqueries, function (data: any) {
        callback(data);
    });
}

/**
 * Get latest PRILIST item
 */
function getLatestPRILIST (prilistSTART: any, separator: any, callback: any) {
    let prilistVal = '';
    const pool = new sql.ConnectionPool(config);
    pool.connect().then((pool: { query: (arg0: string) => void; }) => {
        let sql_query = "SELECT TOP 1 PRILIST FROM dbo.PRILISTS WHERE PRILIST LIKE '" + prilistSTART + "%' ORDER BY PRILIST DESC";
        return pool.query(sql_query);
        // @ts-ignore
    }).then((result: { recordset: any; }) => {
        let feedback = result.recordset;
        if (feedback) {
            if (feedback.length === 0) {
                prilistVal = feedback;
            } else if (feedback[0]['PRILIST']) {
                prilistVal = feedback[0]['PRILIST'];
            } else {
                throw 'Given PRILIST number cant be read.';
            }
            return callback(prilistVal);
        } else {
            throw 'No feedback from PRILISTS orders.';
        }
        pool.close();
    }).catch((err: string | undefined) => {
        // @ts-ignore
        logger.error(new Error(err));
    });
}

/**
 * Generate PRILIST for next [SOAS].[dbo].[PRILISTS] item
 */
let generatePRILIST = function (number: any, priliststart: any, separator: any) {
    let startNum = 1;
    let maxValue = 9999;
    let numberCount = (maxValue + "").length;
    let prillistCount = numberCount + priliststart.length
    let prilistValue = '';
    if (number.length === 0) {
        // @ts-ignore
        prilistValue = priliststart + pad(startNum, numberCount);
    } else if (number.length === prillistCount) {
        let prilistParts = number.split(separator);
        // @ts-ignore
        prilistValue = parseInt(prilistParts[1], (prillistCount)) + 1;
        if (parseInt(prilistValue) <= maxValue) {
            // @ts-ignore
            prilistValue = priliststart + pad(prilistValue, numberCount);
        } else {
            throw 'Generated PRILIST number is greater then ' + maxValue;
            return false;
        }
    }
    return prilistValue;
};
/**
 * Fill n with '0', e.g.: n = 1 => '00001'
 */
let pad = function (n: any, width: any, z: any) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};
let fileExists = function (path: any) {
    try {
        if (fs.existsSync(path)) {
            //file exists
            return true;
        }
    } catch (err) {
        console.error(err)
    }
    return false;
};

function recIns (sqlQueryArray: any, callback: any) {
    // @ts-ignore
    logger.info(sqlQueryArray.length);
    let doneCount = 0;
    // @ts-ignore
    logger.info(sqlQueryArray.length);
    // @ts-ignore
    mssqlCall.mssqlCall_array(sqlQueryArray, function (data: any) {
        callback(data);
    });
}

function insertDB (query: any, callback: any) {
    // @ts-ignore
    logger.info(query);
    //process.exit();
    // @ts-ignore
    mssqlCall.mssqlCall(query, function (data: any) {
        callback(data);
    });
}

function ifExistPrilistInDB (rawProducts: any, callback: any) {
    // @ts-ignore
    logger.info('ifExistPrilistInDB is running..');
    let queryOrderNumber = "";
    let queryPrice_EK = "";
    let queryPseudoprice_EK = "";
    let queryPrilist = "";
    for (let i = 0; i < rawProducts.length; i++) {
        if (i < rawProducts.length - 1) {
            queryOrderNumber += "'" + rawProducts[i].ordernumber + "', ";
            queryPrice_EK += "'" + rawProducts[i].price_EK + "', ";
            queryPseudoprice_EK += "'" + rawProducts[i].pseudoprice_EK + "', ";
            queryPrilist += "'" + rawProducts[i].prilist + "', ";
        } else {
            queryOrderNumber += "'" + rawProducts[i].ordernumber + "'";
            queryPrice_EK += "'" + rawProducts[i].price_EK + "'";
            queryPseudoprice_EK += "'" + rawProducts[i].pseudoprice_EK + "'";
            queryPrilist += "'" + rawProducts[i].prilist + "'";
        }
    }
    let query = "select ITMNUM,EKPR,PSEUDOPR,PRILIST from SOAS.dbo.PRILISTS where ITMNUM IN (" + queryOrderNumber
        + ") and PRILIST in (" + queryPrilist + ");";
    new sql.ConnectionPool(config).connect().then((pool: { query: (arg0: string) => void; }) => {
        return pool.query(query);
        // @ts-ignore
    }).then((result: { recordset: any; }) => {
        let prods = result.recordset;
        for (let x = 0; x < rawProducts.length; x++) {
            let flag = false;
            for (let y = 0; y < prods.length; y++) {
                if (prods[y].ITMNUM === rawProducts[x].ordernumber && prods[y].PRILIST === rawProducts[x].prilist) {
                    rawProducts[x].alreadyIn = true;
                    flag = true;
                }
            }
            if (!flag) {
                rawProducts[x].alreadyIn = false;
            }
        }
        callback(rawProducts);
    }).catch((err: string | undefined) => {
        // @ts-ignore
        logger.error(new Error(err));
    });
}

// Prepaire sql entries and write them to db
let writeCSVDataIntoTable = function (csvdata: any, sqlqueries: any, callback: any) {
    // @ts-ignore
    logger.info('writeCSVDataIntoTable - Anzahl der Elemente: ' + csvdata.length);
    let tableName = 'PRILISTS';
    let tableColumns = ['ITMNUM', 'EKPR', 'PSEUDOPR', 'PRILIST'];
    let notFirst = false;
    if (csvdata && csvdata.length > 0) {
        // array durchgehen und gegen db prüfen
        csvdata.forEach(function (element: any) {
            if (notFirst) {
                let itmNUM = element.ordernumber;
                let ekPR = parseInt(element.price_EK);
                let pseudoPR = parseInt(element.pseudoprice_EK);
                let prilist = element.prilist;
                if (element.alreadyIn === false) {
                    sqlqueries.push("insert INTO " + tableName + " (" + tableColumns[0] + ", " + tableColumns[1] + ", " + tableColumns[2] + ", " + tableColumns[3] + ") " +
                        "VALUES ('" + itmNUM + "', '" + ekPR + "', '" + pseudoPR + "', '" + prilist + "')");
                } else {
                    sqlqueries.push("update " + tableName + " SET " + tableColumns[1] + " = '" + ekPR + "', " + tableColumns[2] + " = '" + pseudoPR + "' " +
                        "WHERE " + tableColumns[0] + " = '" + itmNUM + "' AND " + tableColumns[3] + " = '" + prilist + "'");
                }
            } else {
                notFirst = true;
            }
        });
        // For debug only
        printAllPRINTLISTSQLQueries(sqlqueries);
        // @ts-ignore
        logger.info('Anzahl der Queries: ' + sqlqueries.length);
        return callback(sqlqueries);
    } else {
        // @ts-ignore
        logger.error(new Error('csvdata has no elements...'));
    }
};
