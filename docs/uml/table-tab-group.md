###Overview for [detail-view-table-tab-group][detail-view-tab-group-view]:

| view                  | Customers         | Addresses DLV       | Addresses INV        |  Orders           | Orders Positions  | Delivery Note            | Delivery Note Positions  | Invoice          | Invoice Positions |
|:----------------- |:-----------------:|:-------------------:|:--------------------:|:-----------------:|:-----------------:|:------------------------:|:------------------------:|:----------------:|:-------------:|
| refTable          | custbtwoc         | customersAddrDlv    |  customersAddrInv    |  orders           | orderPosition      | deliveryNote            | deliveryNotePositions    |  invoice         |  invoicePositions |
| db-Table          | CUSTOMERS         | CUSTOMERS_ADDRESSES |  CUSTOMERS_ADDRESSES |  ORDERS           | ORDERS_POSITIONS   | DELIVERY_NOTES          | DELIVERY_NOTES_POSITIONS | INVOICES         |  INVOICES_POSITIONS |
| primaryColumn     | CUSTOMERS_NUMBER  | ID                  |  ID                  |  ORDERS_NUMBER    |  ID                |  DELIVERY_NOTES_NUMBER  |  ID                      | INVOICES_NUMBER  |  ID |
| secondaryColumn   |                   |    |     |        |   |   |   |   |   |

###Customers view (refTable = 'custbtwoc') is selected
####The list of possible selected tabs and settings of values for refTable and primaryColumn:

###getParamDataForLoading

| selected tab name | refTable    | primaryRefTable | ??? secondaryRefTable | primaryColumn      | secondaryColumn  | formSecondColumn   |
|:----------------- |:-----------:|:---------------:|:-----------------:|:-----------------:|:-----------------:|:-----------------:|
| <b>Customers</b>  | custbtwoc   | custbtwoc       | custbtwoc         | CUSTOMERS_NUMBER    | CUSTOMERS_TYPE  |                   |
| <b>Addresses DLV</b>     | custbtwoc   | customersAddrDlv | customersAddrDlv | CUSTOMERS_NUMBER    | ADDRESS_TYPE   |        ID         |
| <b>Addresses INV</b>     | custbtwoc   | customersAddrInv | customersAddrInv | CUSTOMERS_NUMBER    | ADDRESS_TYPE   |        ID         |
| <b>Orders</b>            | custbtwoc   | orders          | orders            | CUSTOMER_ORDER      |                  |                   |
| <b>Orders Positions</b>  | custbtwoc   | orderPosition   | orderPosition     | (client) CUSTOMER_ORDER, (server) ORDERS_NUMBER       |                  |                   |
| <b>Delivery Note</b>     | custbtwoc   | deliveryNote    | deliveryNote      | CUSTOMERS_NUMBER    |                   |                   |
| <b>Delivery Note Positions</b> | custbtwoc | deliveryNotePositions | deliveryNotePositions | (client) CUSTOMERS_NUMBER, (server) DELIVERY_NOTES_NUMBER |                   |                   |
| <b>Invoice</b>           | custbtwoc   | invoice    |  invoice               | INVOICES_CUSTOMER   |                   |                   |
| <b>Invoice Positions</b> | custbtwoc   | invoicePositions | invoicePositions  | (client) INVOICES_CUSTOMER, (server) INVOICES_NUMBER     |                   |                  |


###Orders view (refTable = 'orders') is selected
####The list of possible selected tabs and settings of values for refTable and primaryColumn:

| selected tab name | refTable    | primaryRefTable | ??? secondaryRefTable | primaryColumn      | secondaryColumn  | formSecondColumn   |
|:----------------- |:-----------:|:---------------:|:-----------------:|:-----------------:|:-----------------:|:-----------------:|
| <b>Customers</b>  | orders   | custbtwoc       | <s>custbtwoc</s>         | CUSTOMERS_NUMBER    | CUSTOMERS_TYPE  |                   |
| <b>Addresses DLV</b> | orders   | customersAddrDlv | <s>customersAddrDlv</s> | CUSTOMERS_NUMBER    | ADDRESS_TYPE   |        ADDRESS_TYPE         |
| <b>Addresses INV</b> | orders   | customersAddrInv | <s>customersAddrInv</s> | CUSTOMERS_NUMBER    | ADDRESS_TYPE   |        ADDRESS_TYPE         |
| <b>Orders</b>            | orders   | orders          | <s>orders</s>            | ORDERS_NUMBER   |                  |                   |
| <b>Orders Positions</b>  | orders   | orderPosition   | <s>orderPosition</s>     | (client) ORDERS_NUMBER, (server) ORDERS_NUMBER  |            |              |
| <b>Delivery Note</b>     | orders   | deliveryNote    | <s>deliveryNote</s>      | ORDERS_NUMBER    |              |              |
| <b>Delivery Note Positions</b> | orders | deliveryNotePositions | <s>deliveryNotePositions</s> | (client) ORDERS_NUMBER, (server) ORDERS_NUMBER |            |            |
| <b>Invoice</b>           | orders   | invoice    |  <s>invoice</s>               | ORDERS_NUMBER   |                   |                   |
| <b>Invoice Positions</b> | orders   | invoicePositions | <s>invoicePositions</s>  | (client) ORDERS_NUMBER, (server) ORDERS_NUMBER     |           |           |


[detail-view-tab-group-view]:  ../..\client\src\app\views\detail-view-tab-group\detail-view-tab-group.component.ts
