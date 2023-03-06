/**
 * delivery notes constants for unit tests
 */
import {InvoiceDataInterface} from "../../app/interfaces/invoice-item";
import {DeliveryNotePositionItem} from "../../app/interfaces/delivery-note-position-item";
import {InvoicePositionItem} from "../../app/interfaces/invoice-position-item";


export class InvoicesTestConstants {

  public static INVOICE_ITEM: InvoiceDataInterface
    =
    {
      INVOICES_NUMBER: "50021RG000027",
      INVOICES_CUSTOMER: "1100091588",
      INVOICES_DATE: "2021-05-31",
      INVOICES_CREATOR: "AL",
      INVOICES_UPDATE: "",
      INVOICES_STATE: 100,
      PAYMENT_TERM_ID: "BAR",
      DELIVERY_NOTES_NUMBER: "50021LI000027",
      ORDERS_NUMBER: "50021AU000027",
      PAYED: true,
      PDF_CREATED_DATE: "",
      PDF_DOWNLOAD_LINK: "",
      RELEASE: false,
      CURRENCY: "1",
      PARTLY_INVOICE: false,
      SALES_LOCATION: "101"
    };

  public static INVOICE_POSITION_ITEM: InvoicePositionItem = {
    ID: 1,
    POS: 0, // virtual column for showing position number in view
    INVOICES_NUMBER: "50021RG000027",
    DELIVERY_NOTES_NUMBER: "50021LI000027",
    ORDERS_NUMBER: "50021AU000027",
    ITMNUM: "MARS600STAND000216DE",
    CATEGORY_SOAS: "SET",
    ORDER_QTY: 1,
    DELIVERY_QTY: 0,
    PRICE_NET: 335.91600,
    PRICE_BRU: 399.90000,
    CURRENCY: "1",
    DELIVERY_NOTES_POSITIONS_ID: 1,
    POSITION_STATUS: 1,
    PARENT_LINE_ID: null,
  };

  /**
   * Invoice positions table data returned by:
   * let invoicePositionsDbData = await self.tableDataService.getTableDataById(
   * this.CONSTANTS.REFTABLE_INVOICE_POSITIONS, ViewQueryTypes.DETAIL_TABLE, 'DELIVERY_NOTES_NUMBER',
   * selTableRow['DELIVERY_NOTES_NUMBER']);
   */
  public static INVOICE_POSITIONS_TABLE_DB_DATA: { table: [any[string], any[]], maxRows: number, page: number } = {
    "table": [
      "ID,INVOICES_NUMBER,ORDERS_NUMBER, DELIVERY_NOTES_NUMBER, ITMNUM, ORDER_QTY, DELIVERY_QTY, PRICE_NET, PRICE_BRU, " +
      "CURRENCY, DELIVERY_NOTES_POSITIONS_ID, POSITION_ID,CATEGORY_SOAS, PARENT_LINE_ID, POSITION_STATUS",
      [
        {
          "ID": 915522,
          "INVOICES_NUMBER": "50021RG014734",
          "ORDERS_NUMBER": "50021AU000025",
          "DELIVERY_NOTES_NUMBER": "50021LI014734",
          "ITMNUM": "JOSEPHINE000101DE",
          "ORDER_QTY": 1,
          "DELIVERY_QTY": 1,
          "PRICE_NET": 0.00000,
          "PRICE_BRU": 0.00000,
          "CURRENCY": "1",
          "DELIVERY_NOTES_POSITIONS_ID": 917708,
          "POSITION_ID":4000,
          "CATEGORY_SOAS": "SET",
          "PARENT_LINE_ID": null,
          "POSITION_STATUS":2
        },
        {
          "ID": 915523,
          "INVOICES_NUMBER": "50021RG014734",
          "ORDERS_NUMBER": "50021AU000025",
          "DELIVERY_NOTES_NUMBER": "50021LI014734",
          "ITMNUM": "B179010101DE",
          "ORDER_QTY": 1,
          "DELIVERY_QTY": 1,
          "PRICE_NET": 0.00000,
          "PRICE_BRU": 0.00000,
          "CURRENCY": "1",
          "DELIVERY_NOTES_POSITIONS_ID": 917708,
          "POSITION_ID":5000,
          "CATEGORY_SOAS": "KOMP",
          "PARENT_LINE_ID": 917710,
          "POSITION_STATUS":2
        },
        {
          "ID": 915524,
          "INVOICES_NUMBER": "50021RG014734",
          "ORDERS_NUMBER": "50021AU000025",
          "DELIVERY_NOTES_NUMBER": "50021LI014734",
          "ITMNUM": "A121020101DE",
          "ORDER_QTY": 1,
          "DELIVERY_QTY": 1,
          "PRICE_NET": 0.00000,
          "PRICE_BRU": 0.00000,
          "CURRENCY": "1",
          "DELIVERY_NOTES_POSITIONS_ID": 917708,
          "ORDERS_POSITIONS_ID": 984671,
          "POSITION_ID":6000,
          "CATEGORY_SOAS": "KOMP",
          "PARENT_LINE_ID": 917708,
          "POSITION_STATUS":2
        }
      ]
    ],
    "maxRows": 981120,
    "page": 0
  };

  public static INVOICE_POSITIONS_EMPTY_TABLE_DB_DATA:
    { table: [any[string], any[]], maxRows: number, page: number } = {
    "table": [
      "ID,INVOICES_NUMBER,ORDERS_NUMBER, DELIVERY_NOTES_NUMBER, ITMNUM, ORDER_QTY, DELIVERY_QTY, PRICE_NET, PRICE_BRU, " +
      "CURRENCY, DELIVERY_NOTES_POSITIONS_ID, POSITION_ID,CATEGORY_SOAS, PARENT_LINE_ID, POSITION_STATUS",
      []
    ],
    "maxRows": 981120,
    "page": 0
  };
}
