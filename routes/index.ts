/* AUTHOR: Ronny Brandt,
   Stefan Schimmelpfennig, Andreas Lening
   LAST UPDATE: 30.01.2022 (by Nemanja Rasic) */

import {getWarehouseOptForSelect} from "./logic/form_select";

import {makeAndExecuteQueryInsert, makeColumnsForQuery} from "./logic/ImportHelper";

let express = require('express');
let logger = require('./config/winston');
//let dotenv = require('dotenv').config();
let dotenv = require('custom-env').env(); // for this we must install npm i custom-env

let router = express.Router();
let fs = require('fs');
let path = require('path');
import {TableController} from "./logic/controller/TableController";
let sqlController = require('./logic/sql/SqlController');
let logic_a = require('./logic/mssql_logic');
import {csvImport, getImportTypes, getImportTypesConstants,  getTemplateConfigs} from './logic/csv_import'
import {ViewQueryTypes} from "./logic/constants/enumerations";
import {mssql_check_allocation} from "./logic/sql/warehouse/Warehouse";
import {insertPositionsRows} from "./logic/sql/order/Order";
import { importCsvFile } from "./logic/sql/csv-import/CsvImport";
import {ImportBasic} from "./logic/classes/ImportBasic";
import {HttpStatusCode} from "./logic/constants/constants";
import {CustomError} from "./logic/classes/CustomError";
//let csv_import = require('./logic/csv_import')


const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt'); // http://www.passportjs.org/packages/passport-jwt/
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
// @ts-ignore
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('Bearer'); //fromAuthHeaderAsBearerToken();
// @ts-ignore
jwtOptions.secretOrKey = 'emotion_gmbh_secret_token_key';
let strategy = new JwtStrategy(jwtOptions, async function (jwt_payload: any, next: any) {
    // console.log('SERVER - payload received', jwt_payload);
    // usually this would be a database call:
    let top, bot, ordCond, refTable, language;
    let userid: undefined | number;
    if (typeof jwt_payload.id !== 'undefined' && jwt_payload.id !== 0 && jwt_payload.id !== '') {
        userid = parseInt(jwt_payload.id);
    }
    let user: any = await sqlController.user.mssql_select_user(userid, top, bot, ordCond, refTable, language);
    if (typeof user !== 'undefined') {
        next(null, user);
    } else {
        next(null, false);
    }
});
passport.use('jwt', strategy);

router.get('/', function (req: any, res: any) {
    res.render('index', {
        title: 'Login',
        showIt: false,
    });
});

router.post('/auth', async function (req: any, res: any) {
    let username = req.body.us;
    let password = req.body.pa;
    let result: any = await sqlController.user.mssql_query_users(username, password);
    // console.log('result[0]', result[0]);
    if (result && typeof result[0] !== 'undefined') {
        // from now on we'll identify the user by the id and
        // the id is the only personalized value that goes into our token
        let payload = {id: result[0].USER_SOAS_ID};
        let username = result[0].USER_SOAS_LOGIN;
        let role = result[0].USER_ROLE;
        // all possible params for jwt.sign can be found at node_modules/jsonwebtoken/sign.js
        // token expiration time: jwt.sign({userID: user.id}, 'app-super-shared-secret', {expiresIn: '1m'});
        // @ts-ignore
        let token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: '730h'}); // token expires after 1 month
        let language = result[0].USER_LANGUAGE;
        let localData: any = await sqlController.localizeIt.getLocalizeData(language);
        if (localData) {
            res.send({
                message: "ok",
                token: token,
                'language': language,
                'localize': localData,
                'username': username,
                'role': role
            });
        } else {
            await res.status(400).send({message: "language or localize data error"});
        }
    } else {
        await res.status(401).send({message: "passwords did not match"});
    }
});

router.get('/home', async function (req: any, res: any) {
    if (req.session.loggedin) {
        logger.info('welcomepopupshown: ' + req.session.welcomepopupshown);
        let popupMsg: string = 'Willkommen ' + req.session.username;
        if (req.session.welcomepopupshown === true) {
            popupMsg = '';
        }
        let localData: any = await sqlController.localizeIt.getAllLocalizedData(req.session.language);
        res.render('home', {
            layout: 'layout',
            title: 'Home',
            showIt: true,
            user: req.session.username,
            role: req.session.role,
            isAdmin: req.session.isAdmin,
            home: true,
            localizedData: localData,
            language: req.session.language,
            popupmessage: popupMsg
        });
        req.session.welcomepopupshown = true;
    } else {
        res.render('login error');
    }
});

router.get('/logout', function (req: any, res: any, next: any) {
    if (req.session) {
        req.session.destroy(function (err: any) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    } else {
        res.render('login error');
    }
});

router.post('/insertBatch', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    let batchName = req.body.BATCH_NAME;
    let description = req.body.BATCH_DESCRIPTION;
    let batchFunction = req.body.BATCH_FUNCTION;
    let interval = req.body.BATCH_INTERVAL;
    let active = req.body.BATCH_ACTIVE;
    let code = req.body.BATCH_CODE;
    let codeRequired = req.body.BATCH_CODE_REQUIRED;
    let batchParams= req.body.BATCH_PARAMS? JSON.stringify(req.body.BATCH_PARAMS) : null ;
    let result: any = await sqlController.batchProcess.mssql_insert_batch(batchName, description, batchFunction,
        interval, active, code, codeRequired, batchParams);
    res.send({result: (typeof result !== 'undefined') ? 'inserted' : "batch was not inserted."});
});

router.post('/updateBatch', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    let batchName = req.body.BATCH_NAME;
    let description = req.body.BATCH_DESCRIPTION;
    let batchFunction = req.body.BATCH_FUNCTION;
    let interval = req.body.BATCH_INTERVAL;
    let active = req.body.BATCH_ACTIVE;
    let code = req.body.BATCH_CODE;
    let batchParams=JSON.stringify(req.body.BATCH_PARAMS)
    let result: any = await sqlController.batchProcess.mssql_update_batch(batchName, description, batchFunction,
        interval, active, code,batchParams);
    res.send({result: (typeof result !== 'undefined') ? 'updated' : "batch was not updated."});
});

router.post('/deleteBatch', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    let batchName = req.body.BATCH_NAME;
    let result: any = await sqlController.batchProcess.mssql_delete_batch(batchName);
    res.send({result: (typeof result !== 'undefined') ? 'deleted' : "batch was not deleted."});
});

router.post('/selectBatchProcesses', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    let top = req.body.showOnPageMin;
    let bot = req.body.showOnPageMax;
    let ordCond = req.body.ordercondition;
    let refTable = req.body.refTable;
    let language = req.session.language;
    let batchName = req.body.uid;
    let showTable = req.body.showTable;
    let data: any = await sqlController.batchProcess.mssql_select_batch_processes(batchName, top, bot, ordCond,
        refTable, language, showTable);
    res.send({table: data});
});

router.post('/deleteUser', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    let userid: number = req.body.uid;
    let result: any = await sqlController.user.mssql_delete_user(userid);
    res.send({result: (typeof result !== 'undefined') ? 'deleted' : "user was not deleted."});
});

router.post('/updateUser', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('Server /updateUser: ');
    let userid = req.body.USER_SOAS_ID;
    let username = req.body.USER_SOAS_NAME;
    let role = req.body.USER_ROLE;
    let language = req.body.USER_LANGUAGE;
    let result: any = await sqlController.user.mssql_update_user(userid, username, role, language);
    res.send({result: (typeof result !== 'undefined') ? 'updated' : "user was not updated."});
});

router.post('/insert', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('Server /insert... ');
    console.log('params: ', req.body);
    let elementsArray: any = req.body.elementsArray;
    let refTable: string = req.body.refTable;
    let tableName: string = req.body.tableName;
    let primaryKey: string = req.body.pKey;
    let isIdentity: boolean = req.body.isIdentity;
    if (tableName === 'orderPosition' || tableName === 'deliveryNotePositions' || tableName === 'invoicePositions') {
        // 'invoicePositions' and no 'opElm' and 'whElm' items in elementsArray means:
        // disable allocation - for insert invoice position of invoice without order and delivery note
        const allocate: boolean =
            (!(tableName === 'invoicePositions' && !elementsArray['opElm'] && !elementsArray['whElm']));
        let result: {success: boolean, message: string, data: []} =
            await sqlController.order.insertPositionsRows(tableName, elementsArray, allocate);
        res.send({result: result});
    } else {
        console.log('hfghfggfh'   +   elementsArray);
        let result: {success: boolean, message: string, data: []} =
            await sqlController.table.insertTableMethod(refTable, tableName, primaryKey, isIdentity, elementsArray);
        res.send({result: result});
    }
});

router.post('/update', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('Server /update...');
    console.log('params: ', req.body);
    let elementsArray: {} = req.body.elementsArray;
    let refTable: string = req.body.refTable;
    let tableName: string = req.body.tableName;
    let primaryKey: string = req.body.pKey;
    let primaryValue: string = req.body.pValue;
    let isIdentity: boolean = req.body.isIdentity;
    let secondaryKey: string = req.body.sKey;
    let secondaryValue: string | {} = req.body.sValue;
    let thirdKey: string = req.body.tKey;
    let thirdValue: string = req.body.tValue;
    let result: {success: boolean, message: string, data: []} =
        await sqlController.table.updateTableMethod(refTable, tableName, elementsArray, primaryKey,
        primaryValue, secondaryKey, secondaryValue, thirdKey, thirdValue);
    res.send({result: result});
    // res.send((typeof result !== 'undefined') ? {success: 'Fertig'} : {error: tableName + ' method was not updated.'});
});

/**
 * used only for update order positions or prilist
 */
router.post('/updateRows', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('Server /updateRows...');
    let elementsArray = req.body.elementsArray;
    let tableName = req.body.tableName; // refTable
    let primaryKey = req.body.pKey;
    let primaryValue = req.body.pValue;
    let secondaryKey = req.body.sKey;
    let secondaryValue = req.body.sValue;
    let thirdKey = req.body.tKey;
    let thirdValue = req.body.tValue;
    let result: any = await sqlController.order.updateRowsTableMethod(tableName, elementsArray, primaryKey,
        primaryValue, secondaryKey, secondaryValue, thirdKey, thirdValue);
    res.send((typeof result !== 'undefined') ? {result: result} : {error: tableName + ' method was not updated.'});
});

/**
 * Delete item from table. Add table name of the item to the if clause.
 * Important parameters:
 * - tableName: TABLE_NAME e.g. PRILISTS. Or if separate function, then use REF_TABLE: e.g. orderPosition.
 * - role: only 'admin' users are allowed to delete by mssql_delete_row function
 */
router.post('/delete', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('Server /delete...');
    let tableName = req.body.tableName;
    let primaryKey = req.body.pKey;
    let primaryValue = req.body.pValue;
    let secondaryKey = req.body.sKey;
    let secondaryValue = req.body.sValue;
    let thirdKey = req.body.tKey;
    let thirdValue = req.body.tValue;
    let role = req.body.userRole;
    // let userid = req.body.uid;
    if (tableName === 'orderPosition' || tableName === 'deliveryNotePositions' || tableName === 'invoicePositions') {
        const result: {result: boolean, data: [], message: string} =
            await sqlController.order.mssql_delete_positions(tableName, primaryKey, primaryValue,
            secondaryKey, secondaryValue, thirdKey, thirdValue);
        res.send(result.result ? {success: 'Fertig'} : {error: result.message});
    } else if (tableName === 'warehousing' || tableName === 'deliveryNote' || tableName === 'csvTemplateConfigFieldTmp'
        || tableName === 'PRILISTS') {
        if (role === 'admin') {
            if (tableName === 'deliveryNote') {
                let result: any = await sqlController.deliveryNote.mssql_delete_delivery_note(tableName, primaryKey,
                    primaryValue, secondaryKey, secondaryValue);
                res.send({result: result});
            } else {
                let result: any = await sqlController.table.mssql_delete_row(tableName, primaryKey, primaryValue);
                res.send({result: result});
            }
        } else if (tableName === 'csvTemplateConfigFieldTmp') {
            let result: any = await sqlController.table.mssql_delete_row(tableName, primaryKey, primaryValue);
            res.send({result: result});
        } else {
            console.log('ERROR: Not allowed!');
            res.send({error: 'Not allowed!'});
        }
    } else {
        console.log('ERROR: ' + tableName + ' can not be deleted!');
        res.send({error: tableName + ' can not be deleted!'});
    }
});

router.post('/search', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('Server /search...');
    let refTable: string = req.body.refTable;
    let searchColumn: string = req.body.searchColumn;
    let searchText: string = req.body.searchText;
    let primaryColumn: string = req.body.primaryColumn;
    let primaryValue: string = req.body.primaryValue;
    let secondColumn: string = req.body.secondColumn;
    let secondValue: string = req.body.secondValue;
    let searchWithLike: boolean = req.body.searchWithLike;
    let additionalColumns: string = req.body.additionalColumns;
    let top: number = req.body.offsetNumber ? req.body.offsetNumber : 0;
    let bot: number = req.body.fetchNumber ? req.body.fetchNumber : 100;
    let result: any[] = await sqlController.search.mssql_select_filteredItems(searchColumn, searchText,
        primaryColumn, primaryValue, secondColumn, secondValue, top, bot, refTable, searchWithLike, additionalColumns);
    res.send(result);
});

router.post('/insertUser', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    let username: string = req.body.USER_SOAS_NAME;
    let login: string = req.body.USER_SOAS_LOGIN;
    let hashPass: string = req.body.USER_SOAS_PASSWD;
    let role: string = req.body.USER_ROLE;
    let language: string = req.body.USER_LANGUAGE;
    let result: any = await sqlController.user.mssql_insert_user(username, login, hashPass, role, language);
    res.send((typeof result !== 'undefined') ? 'inserted' : "user was not inserted.");
});

router.post('/csvImport', passport.authenticate('jwt', {session: false}), function (req: any, res: any) {
    console.log('Server /csvImport...')

    console.log('files: ', req.files.file)
    console.log('body: ', req.body)

    csvImport(Number(req.body.template), req.files.file, req.body.userName)
        .then((response: {allOk: boolean})=>{

            if(response.allOk) res.send({result: 'OK'})
            else res.send({result: 'Not ok'})
        })
        .catch((response: {allOk: boolean, customErrMsg: string})=>{
            //remove uploaded file
            const dirName = path.join(__dirname,'logic', 'csv', 'imported','tmp')
            fs.readdir(dirName, (err: any, files: any) => {
                if (err) throw err;

                for (const file of files) {
                    fs.unlink(path.join(dirName, file), (err: any) => {
                        if (err) throw err;
                    });
                }
            });

            res.send({
                result: 'Not ok',
                error: response.customErrMsg
            })
        })

});

router.post('/csvGetImportTypes', passport.authenticate('jwt', {session: false}), function (req: any, res: any) {
    console.log('Server /csvGetImportTypes...');

    getImportTypes()
        .then((data: Array<{id: number, label: string}>)=>{
            res.send(data)
        })
        .catch((error: any) => {
            res.send(false)
            console.log('error: ', error)
        })

});

router.post('/csvGetTemplateConfigs', passport.authenticate('jwt', {session: false}), function (req: any, res: any) {
    console.log('Server /csvGetTemplateConfigs...');

    getTemplateConfigs({
        id: req.body.id
    }).then((data: Array<{id: number, label: string}>)=>{
        res.send(data)
    })
        .catch((error: any) => {
            res.send(false)
            console.log('error:  ', error)
        })
});

/**
 * Check if given data is consistent/exists
 */
router.post('/check', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('SERVER - /check');
    console.log('params: ', req.body);
    let refTable:string = req.body.refTable;
    let objectData:any|object = req.body.objectData;
    let onlyCheck: boolean = req.body.onlyCheck;
    if (refTable === 'getOPForDNPCreation') {
        let jsonResult: any = await sqlController.deliveryNote.mssql_get_orders_positions_for_delivery_note_creation(
            objectData, onlyCheck);
        // console.log('jsonResult: ', jsonResult);
        res.send({result: jsonResult});
    } else if (refTable === 'checkWHAllocation') {
        let jsonResult: { success: boolean, message: string, data: any[] } =
            await sqlController.warehouse.mssql_check_warehousing_allocation(objectData);
        res.send({result: jsonResult});
    } else if (refTable === 'checkAttributes') {
        let jsonResult: any = await sqlController.attributes.checkExistingAttributes(objectData);
        res.send({result: jsonResult});
    } else if (refTable === 'checkDLVPositionsState') {
        let jsonResult: boolean =
            await sqlController.deliveryNote.checkDLVPositionsState(objectData.deliveryNoteId, objectData.positionStates);
        res.send({result: jsonResult});
    } else if (refTable === 'checkINVPositionsState') {
        let jsonResult: boolean =
            await sqlController.invoice.checkINVPositionsState(objectData.invoiceId, objectData.positionStatusPayed);
        res.send({result: jsonResult});
    } else {
        // stock transfer (onSaveClick) and attributes (articles - save new attribute)
        let jsonResult: any = await sqlController.table.mssql_check_table_data(refTable, objectData, onlyCheck);
        res.send({result: jsonResult});
    }
});

router.post('/table', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('SERVER - /table');
    let refTable: string = req.body.id;
    // show console logs only for allowed referral table names... (for better debug overview of console logs)
    if (refTable !== 'taxationRelations' && refTable !== 'languages' &&
        refTable !== 'paymentTerms' && refTable !== 'states' && refTable !== 'taxationRelations' &&
        refTable !== 'currencies') { // && refTable !== 'countries'
        console.log('params: ', req.body);
    }

    // view query types: 'MAIN_TABLE', 'DETAIL_TABLE', 'PURE_SELECT'
    let viewQueryType: ViewQueryTypes = req.body.viewQueryType;
    let primaryKey: string = req.body.customerColumn;
    let primaryValue: string = req.body.customerId;
    let secondaryKey: string | undefined = req.body.secondColumn ? req.body.secondColumn : undefined;
    let secondaryValue: any = req.body.secondId ? req.body.secondId : undefined; // undefined | string | {}
    let offsetRowCount: undefined | number = req.body.page; // offsetRowCount;
    let fetchRowCount: undefined | number = req.body.fetchRowCount;
    // page number to select
    let pageNumber: number = req.body.page;
    let orderByColumn: string = req.body.orderByColumn;
    let orderByDirection: string = req.body.orderByDirection;
    let tableController: TableController;
    let jsonResult: { data: {}, rows: number, page: number } =
        await sqlController.table.mssql_select_Table_by_Number(refTable, viewQueryType,
            primaryKey, primaryValue, secondaryKey, secondaryValue, offsetRowCount, fetchRowCount, pageNumber,
            orderByColumn, orderByDirection);
    // console.log('jsonResult', jsonResult['data']);
    tableController = new TableController(refTable, jsonResult['data']);
    res.send({table: tableController.getCurrentTable(), maxRows: jsonResult['rows'], page: jsonResult['page']});
});

/**
 * function for saving data to tables
 * @deprecated
 */
router.post('/settable', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('SERVER - /settable');
    console.log(req.body.id);
    let refTable: string = req.body.id;
    let uniqueColumn: string = req.body.customercolumn;
    let uniqueNumber: string = req.body.customerid;
    let secondUniqueColumn: string | undefined = undefined;
    let secondUniqueNumber: string | undefined = undefined;
    let offsetRowCount: undefined | number = undefined;
    let fetchRowCount: undefined | number = undefined;
    // flag to show all table rows by ignoring WHERE clause. used for table views (left column)
    let showAllFlag: boolean = false; //req.body.showAllFlag;
    // page number to select
    let pageNumber: number = req.body.page;
    let orderByColumn: string = uniqueColumn;
    let orderByDirection: string = "ASC";
    let tableController: TableController;
    if (uniqueColumn && uniqueNumber) {
        let jsonResult: any = await sqlController.table.mssql_select_Table_by_Number(refTable, uniqueColumn,
            uniqueNumber, secondUniqueColumn, secondUniqueNumber,
            offsetRowCount, fetchRowCount, showAllFlag, pageNumber, orderByColumn, orderByDirection);
        tableController = new TableController(refTable, jsonResult['data']);
        res.send({table: tableController.getCurrentTable()});
    } else {
        let jsonResult: any = await logic_a.mssql_select_Table(refTable);
        tableController = new TableController(refTable, jsonResult);
        res.send({table: tableController.getCurrentTable()});
    }
});

/**
 * get json object for form create
 */
router.post('/createform', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('SERVER - /createform');
    console.log(req.body.id);
    let refTable: string = req.body.id;
    let language: string = req.body.language;
    let jsonResult: any = await sqlController.formTemplates.mssql_select_form_template(refTable, language);
    res.send({formConfig: jsonResult});
});

/**
 * get form object with form fields
 */
router.post('/form', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('SERVER - /form');
    let refTable: string = req.body.id;
    let uniqueColumn: string = req.body.customercolumn;
    let uniqueNumber: string = req.body.customerid;
    let secondUniqueColumn: string | undefined = req.body.secondcolumn;
    let secondUniqueNumber: string | undefined = req.body.secondid;
    let offsetRowCount: undefined | number = undefined;
    let fetchRowCount: undefined | number = undefined;
    let language: string = req.body.language;
    let showAllFlag: boolean = false;
    let pageNumber: number = req.body.page;
    let jsonResult: any = await sqlController.table.mssql_select_table_for_form(refTable, uniqueColumn, uniqueNumber,
        secondUniqueColumn, secondUniqueNumber, language, offsetRowCount, fetchRowCount, showAllFlag, pageNumber);
    res.send({formConfig: jsonResult});
});

/**
 * get form object with form fields from FORM_TEMPLATES table
 */
router.post('/formlyform', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('SERVER - /formlyform');
    let refTable: string = req.body.refTable;
    let formTemplate: any = await sqlController.formTemplates.get_formly_form(refTable);
    res.send({formTemplate: formTemplate});
});

/**
 * get db item data for form object
 */
router.post('/getform', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('SERVER - /getform');
    console.log('params: ', req.body);
    let refTable: string = req.body.id;
    let primaryKey: string = req.body.customercolumn;
    let primaryValue: string = req.body.customerid;
    let secondaryKey: string | undefined = req.body.secondcolumn;
    let secondaryValue: string | undefined = req.body.secondid;
    let offsetRowCount: undefined | number = undefined;
    let fetchRowCount: undefined | number = undefined;
    let language: string = req.body.language;
    let pageNumber: number = req.body.page;
    let jsonResult: { data: {}, rows: number, page: number } =
        await sqlController.formTemplates.formly_mssql_select_table_for_form(refTable, primaryKey,
        primaryValue, secondaryKey, secondaryValue, language, offsetRowCount, fetchRowCount,
        pageNumber);
    res.send({row: jsonResult});
});

router.post('/selectTableTemplates', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    //protect API Resources with a check for a loggedIn user
    let refTable = req.body.reffTable;
    let language = req.body.language; //req.session.language;
    let result: any = await sqlController.localizeIt.localizeIt(refTable, language);
    res.send({table: result});
});

router.post('/selectUser', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('SERVER - /selectUser');
    let top: number = req.body.showOnPageMin;
    let bot: number = req.body.showOnPageMax;
    let orderCondition: string = req.body.orderCondition;
    let refTable: string = req.body.refTable;
    let language: string = req.session.language;
    let userid: undefined | number;
    if (typeof req.body.uid !== 'undefined' && req.body.uid !== 0 && req.body.uid !== '') {
        userid = parseInt(req.body.uid);
    }
    let data: any = await sqlController.user.mssql_select_user(userid, top, bot, orderCondition, refTable, language);
    res.send((data.length) ? {table: data[0]} : {table: data});
});

/**
 * create delivery note for given order number of table 'ORDERS' item
 *
 * @param thisItem: string - refTable name
 * @param pKey: string - table column 'ORDERS_NUMBER'
 * @param pValue: string - table column value '50020AU000010'
 * @param userName: string - currently accessing username 'AL'
 * @param language: string - currently used language 'DE'
 */
router.post('/createnote', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('SERVER - /createnote');
    console.log('req.body: ', req.body);
    let thisItem = req.body.thisItem;
    let primaryKey = req.body.pKey; // primaryKey => 'ORDERS_NUMBER'
    let primaryValue = req.body.pValue; // primaryValue => orderNumber => '50020AU000006'
    let username = req.body.userName;
    // let language = req.body.language;
    let components = req.body.components;
    let partlyDelivery = req.body.partlyDelivery;
    let statesResult: any = await sqlController.states.mssql_select_states();
    let notesResult: { success: boolean, errorCode: string, newDeliveryNote: string, positions: string } =
        await sqlController.deliveryNote.mssql_create_notes_manually(thisItem, primaryKey, primaryValue, username,
            statesResult, components, partlyDelivery);
    res.send({message: notesResult});
});

/**
 * create invoice for given order number and delivery note number of table 'DELIVERY_NOTES' item
 *
 * @param thisItem: string - refTable name
 * @param pKey: string - table column 'ORDERS_NUMBER'
 * @param pValue: string - table column value '50020AU000010'
 * @param sKey: string - table second column 'DELIVERY_NOTE_NUMBER'
 * @param sValue: string - table second column value '50020LI000006'
 * @param userName: string - currently accessing username 'AL'
 */
router.post('/createinvoice', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('SERVER - /createinvoice');
    // console.log('BODY: ', req.body);
    let thisItem = req.body.thisItem;
    let primaryKey = req.body.pKey;     // primaryKey => 'DELIVERY_NOTE_NUMBER'
    let primaryValue = req.body.pValue; // primaryValue => '50020LI000006'
    let secondaryKey = req.body.sKey;     // secondaryKey => 'ORDERS_NUMBER'
    let secondaryValue = req.body.sValue; // secondaryValue => '50020AU000006'
    let username = req.body.userName;
    let partlyDelivery = req.body.partlyDelivery;
    let statesResult: any = await sqlController.states.mssql_select_states();
    let invoiceResult: { success: boolean, errorCode: string, newInvoice: string, positions: string } =
        await sqlController.invoice.mssql_create_invoice_manually(thisItem, primaryKey,
            primaryValue, secondaryKey, secondaryValue, username, statesResult, partlyDelivery);
    res.send({message: invoiceResult});
});

/**
 * Show pdf file to user by downloading it to "public" folder, show them in browser and delete it in "public" folder
 *
 * ToDo: downloadPdf need to be refactored and tested
 */
router.post('/downloadpdf', passport.authenticate('jwt', {session: false}), function (req: any, res: any) {
    console.log('SERVER - /downloadpdf');
    let fullPath: string = req.body.fullPath;
    let pdfFilename: string = req.body.pdfFilename;
    let refTable: string = req.body.refTable;
    let language: string = req.body.language;
    let symLinkPath = path.join(__dirname, '../public/', '/pdfs/' + pdfFilename + '.pdf');
    let symLinkPublicPath: string = req.protocol + '://' + req.get('host') + '/pdfs/' + pdfFilename + '.pdf';
    let result =
        sqlController.pdf.downloadPdf(refTable, fullPath, pdfFilename, symLinkPublicPath, symLinkPath, language);
    if (result.success) {
        res.send(result.data);
        setTimeout(function () {
            // public pdf file will be deleted after loading
            fs.unlink(symLinkPath, function () {});
        }, 100);
    } else {
        res.send(result.data);
    }
});

router.post('/deleteTableLocks', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('SERVER - /deleteTableLocks');
    let deleteAll: boolean = req.body.deleteAll;
    let lockedBy: string = req.body.lockedBy;
    if (deleteAll) {
        if (lockedBy === "") {
            // remove table locks for all users
            await sqlController.tableLocks.mssql_delete_all_tableLocks();
            res.send(true);
        } else {
            // remove table locks of given user
            await sqlController.tableLocks.mssql_delete_all_users_tableLocks(lockedBy);
            res.send(true);
        }
    } else {
        let tableName: string = req.body.tableName;
        let dataSet: string = req.body.dataSet;
        // remove only given user locks
        await sqlController.tableLocks.mssql_delete_one_tableLock(tableName, dataSet, lockedBy);
        res.send(true);
    }
});

/**
 * get last (inserted) id of the table for given table and column names
 */
router.post('/getLastTableId', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('server /getLastTableId');
    let tableName: string = req.body.tableName;   // "ORDERS"
    let columnName: string = req.body.columnName; // "ID"
    // optional
    let uniqueColumnName: string = req.body.uniqueColumnName; // ""
    let uniqueValue: string = req.body.uniqueValue;           // ""
    // 0 - means no id was found
    let lastTableIDResult: any | 0 = await sqlController.table.mssql_last_table_id(tableName, columnName,
        uniqueColumnName, uniqueValue);
    res.send({id: lastTableIDResult});
});

/**
 *insert into temporary table
 */
router.post('/insertTemp', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('server /insertTemp');
    let idTempField: string = req.body.idTempField;   // "ORDERS"
    let idTempConst: string = req.body.idTempConst; // "ID"

    let result: any = await sqlController.table.msql_insert_into_temp(idTempField, idTempConst);
    res.send({result: result});
});


/**
 * get all rows from importTypeConstants
 */
router.post('/getImportTypesConstants', passport.authenticate('jwt', {session: false}), function (req: any, res: any) {
    console.log('Server /getImportTypesConstants...');

    getImportTypesConstants()
        .then((data: Array<{id: number, label: string}>)=>{
            res.send(data)
        })
        .catch((error: any) => {
            res.send(false)
            console.log('error: ', error)
        })

});


/**
 * copy all rows from one table into another
 */
router.post('/copyRowsIntoTable', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('Server /copyRowsIntoTable');
    let tableName1: string = req.body.tableName1;   // "ORDERS"
    let tableName2: string = req.body.tableName2; // "ID"
    let columnsTo: string =  req.body.columnsTo;

    await sqlController.table.mssql_copy_from_into_table(tableName1, tableName2,columnsTo);
    res.send(true);
});

/**
 * delete all rows from table
 */
router.post('/deleteAllRows', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    let tableName: string = req.body.tableName;   // "ORDERS"
    let columnsTo: string =  req.body.columnsTo;

    await sqlController.table.mssql_delete_all_rows_table(tableName, columnsTo);
    res.send(true);
});

router.post('/countTableRows', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    let tableName = req.body.tableName;   // "ORDERS"
    let rowsNumberResult: any = await logic_a.mssql_count_all_rows(tableName, undefined, undefined,
        undefined, undefined, undefined, undefined,
        undefined, undefined);
    res.send({rows: rowsNumberResult});
});


/**
 * get last (inserted) provider_number from the table PROVIDERS
 */
router.post('/getLastColumnValue', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('server /getLastColumnValue');
    let tableName: string = req.body.tableName;   // "ORDERS"
    let columnName: string = req.body.columnName; // "ID"
    // optional
    let uniqueColumnName: string = req.body.uniqueColumnName; // ""
    let uniqueValue: string = req.body.uniqueValue;           // ""
    let lastColumnValueResult: any = await sqlController.table.mssql_last_column_value(tableName, columnName,
        uniqueColumnName, uniqueValue);
    res.send({value: lastColumnValueResult});
});


/**
 * get last (inserted) provider_number from the table PROVIDERS
 */
router.post('/updateColumn', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('server /updateColumn');
    let tableName: string = req.body.tableName;   // "ORDERS"
    let columnName: string = req.body.columnName; // "ID"
    let whereColumnValue: string = req.body.whereColumnValue;
    // optional
    let uniqueValue: string = req.body.uniqueValue;           // ""
    await sqlController.table.msql_update_column(tableName, columnName, whereColumnValue, uniqueValue);
    res.send(true);
});


/**
 * try to allocate orders positions
 */
router.post('/allocate', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    console.log('SERVER - /allocate');
    console.log('req.body: ', req.body);
    let type: string = req.body.type;
    if (type === 'CHECK') {
        // CHECK: on allocate button click at order positions p-table (detail-view-tab-group > onTableFormAllocate)
        // try to allocate one position SET (complete check of db data)
        let ordersNumber: string = req.body.data['ordersNumber'];
        let warehouse: string = req.body.data['warehouse'];
        let jsonResult: any = await sqlController.warehouse.mssql_check_allocation(ordersNumber, warehouse);
        // console.log('jsonResult: ', jsonResult);
        // throw new Error('stopp');
        res.send(jsonResult);
    } else if (type === 'SET') {
        // SET: on save new order position at dialog (custom-p-dialog > saveOrderPosition)
        // only set POSITION_STATUS and calculate ASSIGNED_QTY (without checking db data again) for given positions
        let whAllocationData: any = req.body.data['whAllocationData'];
        let orderPositionsElements: [] = req.body.data['orderPositionsElements'];
        let insertFlag: boolean = req.body.data['insertFlag'];
        let jsonResult: any = await sqlController.warehouse.mssql_set_allocation(whAllocationData,
            orderPositionsElements, insertFlag);
        res.send(jsonResult);
    } else {
        console.log('Undefined type found!');
        res.send({success: false, message: 'Undefined type found!', data: undefined});
    }
});

router.post('/formSelect/:action', passport.authenticate('jwt', {session: false}), async function (req: any, res: any) {
    let result: any
    switch (req.params.action) {
        case 'orderWarehouse': {
            result = await getWarehouseOptForSelect(req.body.orderNumber)
        }
    }

    res.send(result);
});

/**
 * route for testing purposes
 */
router.post('/test', passport.authenticate('jwt', {session: false}), function (req: any, res: any) {

    console.log('Test is running... DEFAULT timeout: 2 minutes. Current time: ', new Date());

    // IMPORTANT: If your async function is called from client, don't use await then!
    // Otherwise function can be called twice, if nodejs do default timeout after 2 minutes.

    // Add your function to test here
    // For long-running async functions (2+ minutes), call this route '/test' via Postman app.

    // commented out
    // await new Promise((resolve) => {
    //     setTimeout(resolve, 12000000); // wait some time
    // });

    // await new Promise(async (resolve) => {
    //     await importCsvFile();
    // });

    throw new Error('Test Error');
    // throw new CustomError('Error Test', HttpStatusCode.BAD_REQUEST, 'you can do better than that',
    //     false);
    // throw new CustomError('Error Test', HttpStatusCode.INTERNAL_SERVER, 'you can do better than that',
    //     false);

    res.send({result: true});
});

module.exports = router;

