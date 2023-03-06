/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 28.05.2021 */
const warehouse = require('./warehouse/Warehouse');
const order = require('./order/Order');
const deliveryNote = require('./delivery-note/DeliveryNote');
const invoice = require('./invoice/Invoice');
const user = require('./user/User');
const batchProcess = require('./batch-process/BatchProcess');
const localizeIt = require('./localize-it/LocalizeIt');
const formTemplates = require('./form-templates/FormTemplates');
const attributes = require('./attributes/Attributes');
const table = require('./table/Table');
const crossselling = require('./crossselling/Crossselling');
const states = require('./states/States');
const stockTransfer = require('./stock-transfer/StockTransfer');
const search = require('./search/Search');
const article = require('./article/Article');
const tableLocks = require('./table-locks/TableLocks');
const pdf = require('./pdf/Pdf');
const date = require('./date/Date')
const customer = require('./customer/Customer');
const languages = require('./languages/Languages')

module.exports = {
    warehouse, order, deliveryNote, invoice, user, batchProcess, localizeIt, formTemplates, attributes, table,
    crossselling, states, stockTransfer, search, article, tableLocks, pdf, date, customer, languages
}
