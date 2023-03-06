// @ts-ignore
import createError = require('http-errors');
// @ts-ignore
import _ = require('lodash');
// @ts-ignore
import express = require('express');
// @ts-ignore
import path = require('path');
// @ts-ignore
import cookieParser = require('cookie-parser');
// @ts-ignore
import logger = require('morgan');
// @ts-ignore
import session = require('express-session');
const promiseMiddleware = require('./routes/logic/middlewares/promise');
// @ts-ignore
import indexRouter = require('./routes/index');
// @ts-ignore
import usersRouter = require('./routes/users');
import modelsRouter = require('./routes/models');
import documentsRouter = require('./routes/documents');
// @ts-ignore
import fileUpload = require('express-fileupload');
// @ts-ignore
import cron = require('node-cron');
// @ts-ignore
import cronJobs = require('./routes/logic/cron_logic.js');
// commented out winston logging on 20220328 by Andreas
// @ts-ignore
// import winston = require('./routes/config/winston');
// @ts-ignore
import bodyParser = require('body-parser');

const passport = require('passport');
let app = express();

// Reggi
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(fileUpload());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// commented out winston logging on 20220328 by Andreas
// @ts-ignore
// app.use(logger("combined", { "stream": winston.stream }));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

function modifyResponseBody(req, res, next) {
    let oldSend = res.send;
    let tempData: { status: number, error: string, message: string, data: any } = undefined;

    res.send = function (data) {
        // TODO check the possible structures of data
        tempData = {
            status: (data.hasOwnProperty('status')) ? data.status : 500,
            error: (data.hasOwnProperty('error')) ? data.error : (data instanceof Error),
            message: (data.hasOwnProperty('message')) ? data.message : 'Something went horribly wrong',
            data: [(data.hasOwnProperty('data')) ? (Array.isArray(data.data) ? data.data[0] : data.data) : data]
        };

        res.send = oldSend // set function back to avoid the 'double-send'
        return res.send(tempData);
    }

    next();
}
app.use(modifyResponseBody);
app.use(promiseMiddleware());
app.use(express.static(path.join(__dirname, 'public')));
// @ts-ignore
app.use('/', indexRouter);
// @ts-ignore
app.use('/users', usersRouter);
// @ts-ignore
app.use('/models', modelsRouter);
// @ts-ignore
app.use('/documents', documentsRouter);

// commented out old error handling on 20220328 by Andreas

// catch 404 and forward to error handler
// app.use(function (req: any, res: any, next: (arg0: any) => void) {
//     next(createError(404));
// });
// error handler
// app.use(function (err: { message: any; status: any; }, req: { app: { get: (arg0: string) => string; }; },
//                   res: { locals: { message: any; error: any; }; status: (arg0: any) => void;
//                         render: (arg0: string) => void; }, next: any) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     console.log('ERROR HANDLER: ', err.message);
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

// promise middleware error handling
app.use(function(req, res: any, next) {
    res.promise(Promise.reject(createError(404)));
});
app.use(function(err,req, res, next) {
    res.promise(Promise.reject(err));
});


// commented out winston logging on 20220518 by Andreas
// app.use(bodyParser.json());

module.exports = app;

/**
 * Important note: Do insert/update in specific order 1 to 11!
 * (1) Attributes, (2) Articles, (3) Crossselling, (4) Dist components, (5) Prilists, (6) Currencies, (7) Warehousing,
 * (8) Customers, (9) Orders, (10) Delivery notes, (11) Invoices
 */

// @ts-ignore
// cronJobs.test_promise_query();

/**
 * Last Import: 20201206 -  Duration: 45 min
 */
// @ts-ignore
// cronJobs.sage_daily_import();

// @ts-ignore
// cronJobs.sage_complete_import();

/**
 * 1. Test cron job to separately execute "check_new_orders" function
 */
// cron.schedule('10,20,30,40,50,00 * * * * *', () => {
// cron.schedule('10 * * * * *', () => {
// console.log('Cron executed...');

// @ts-ignore
// cronJobs.cron_sage_find_table_keys_for_soas(function () {
// });

/*** SAGE - import functions ***/

// @ts-ignore
// cronJobs.cron_sage_check_new_itmmaster(function (result) {
// });

//Dependencies: Refresh prilists
// @ts-ignore
// cronJobs.cron_sage_check_new_customers(function (result) {
// });

// @ts-ignore
// cronJobs.cron_sage_check_new_sorders(function (result) {
// });

// @ts-ignore
// cronJobs.cron_sage_check_new_sdelivery(function (result) {
// });

// @ts-ignore
// cronJobs.cron_sage_check_new_sinvoice(function (result) {
// });


/*** SHOPWARE - US SHOP import functions ***/

// @ts-ignore
// cronJobs.check_new_orders(function (result) {
// });

/*** BATCHES/CRON JOBS  ***/

// let batchCode = '{"mssql_query":"select DISTINCT DN.DELIVERY_NOTES_NUMBER, OP.ITMNUM, OP.PRICE_NET,
// OP.PRICE_BRU, IB.ITMDES, IB.EANCOD, IB.ITMWEIGHT,
// FORMAT( DN.SHIPPING_DATE, \'dd-MM-yyyy\', \'en-US\' ) AS SHIPPING_DATE, DN.ORDERS_NUMBER, DP.ORDER_QTY,
// DP.WEIGHT_PER, OS.CUSTOMER_ORDER, OS.ORDERAMOUNT_NET, OS.ORDERAMOUNT_BRU, CS.CUSTOMERS_PRENAME,
// CS.CUSTOMERS_NAME, CS.CUSTOMERS_COMPANY, CS.CUSTOMERS_EMAIL, CS.CUSTOMERS_PHONE, CA.ADDRESS_TYPE,
// CA.ADDRESS_STREET, CA.ADDRESS_CITY, CA.ADDRESS_POSTCODE from SOAS.dbo.DELIVERY_NOTES DN
// LEFT JOIN SOAS.dbo.ORDERS OS ON OS.ORDERS_NUMBER = DN.ORDERS_NUMBER
// LEFT JOIN SOAS.dbo.ORDERS_POSITIONS OP ON OP.ORDERS_NUMBER = DN.ORDERS_NUMBER
// LEFT JOIN SOAS.dbo.ITEM_BASIS IB ON IB.ITMNUM = OP.ITMNUM
// LEFT JOIN SOAS.dbo.CUSTOMERS CS ON CS.CUSTOMERS_NUMBER = OS.CUSTOMER_ORDER
// LEFT JOIN SOAS.dbo.CUSTOMERS_ADDRESSES_RELATION CAR ON CAR.CUSTOMER_NUMBER = CS.CUSTOMERS_NUMBER
// LEFT JOIN SOAS.dbo.CUSTOMERS_ADDRESSES CA ON CA.ID = CAR.CUSTOMER_ADDRESSES_ID AND CA.CUSTOMER_NUMBER = CS.CUSTOMERS_NUMBER
// LEFT JOIN SOAS.dbo.DELIVERY_NOTES_POSITIONS DP ON DP.DELIVERY_NOTES_NUMBER = DN.DELIVERY_NOTES_NUMBER AND DP.ORDER_QTY = OP.ORDER_QTY
// WHERE DN.DELIVERY_NOTES_NUMBER = \'50020LI000004\';","csv_filename":"lieferscheine_statistik","csv_delimiter":";",
// "email_address":"a.lening@emotion-24.de","email_subject":"SOAS-Cron-Mailer: Lieferscheine Statistik vom 25.05.2020 10:10Uhr"}';
// // @ts-ignore
// cronJobs.execute_sql_create_csv_send_mail(batchCode, function () {
// });
// });

/**
 * 2. Cron Job, to load and execute Cron Jobs from database orders BATCH_PROCESSES
 * Examples:
 * '00 * * * * *' - every 1 minute at 00 seconds
 * '00 0 * * * *' - every 1 hour
 */
cron.schedule('00 * * * * *', () => { // 00,10,20,30,40,50,55,57 => live only 00 = every 1 minute
    let d = new Date();
    // Ronny Brandt - i took this out cause it bugs the hell out of me
    // console.log('new plopp ' + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2));
    // @ts-ignore
    cronJobs.check_new_batches(function (result) {});
});
