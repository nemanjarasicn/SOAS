import {DeliveryNotePositionItem} from "../../app/interfaces/delivery-note-position-item";
import {DeliveryNoteDataInterface} from "../../app/interfaces/delivery-note-item";

/**
 * delivery notes constants for unit tests
 */
export class DeliveryNotesTestConstants {

  // public static DELIVERY_NOTE_ITEM:
  //   {
  //   _deliveryNoteState: number; _deliveryNoteNumber: string; _shippingDate: string;
  //   _retour: boolean; _deliveryRelease: boolean; _exportPrint: boolean; _deliveryCurrency: string; _orderNumber: string;
  //   _partlyDelivery: boolean; _pdfCreatedDate: string; _pdfDownloadLink: string; _customersNumber: string
  // }
  // =
  //   {
  //     _deliveryNoteNumber: "50021LI000027",
  //     _shippingDate: "2021-05-31",
  //     _exportPrint: false,
  //     _deliveryNoteState: 70,
  //     _retour: false,
  //     _orderNumber: "50021AU000027",
  //     _pdfCreatedDate: "",
  //     _pdfDownloadLink: "",
  //     _customersNumber: "1100091588",
  //     _deliveryRelease: false,
  //     _deliveryCurrency: "1",
  //     _partlyDelivery: false
  //   };

  public static DELIVERY_NOTE_ITEM: DeliveryNoteDataInterface
    =
    {
      DELIVERY_NOTES_NUMBER: "50021LI000027",
      SHIPPING_DATE: "2021-05-31",
      EXPORT_PRINT: false,
      DELIVERY_NOTES_STATE: 70,
      RETOUR: false,
      ORDERS_NUMBER: "50021AU000027",
      PDF_CREATED_DATE: "",
      PDF_DOWNLOAD_LINK: "",
      CUSTOMERS_NUMBER: "1100091588",
      RELEASE: false,
      CURRENCY: "1",
      PARTLY_DELIVERY: false
    };

  public static DELIVERY_NOTE_POSITION_ITEM: DeliveryNotePositionItem = {
    ID: 1,
    POS: 0, // virtual column for showing position number in view
    DELIVERY_NOTES_NUMBER: "50021LI000027",
    ORDERS_NUMBER: "50021AU000027",
    ITMNUM: "MARS600STAND000216DE",
    CATEGORY_SOAS: "SET",
    ORDER_QTY: 1,
    WEIGHT_PER: 0,
    DELIVERY_QTY: 0,
    ORDERS_POSITIONS_ID: 985581,
    POSITION_STATUS: 1,
    PARENT_LINE_ID: null,
  };

  /**
   * Delivery notes positions table data returned by:
   * let deliveryNotePositionsDbData = await self.tableDataService.getTableDataById(
   * this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS, ViewQueryTypes.MAIN_TABLE, 'ORDERS_POSITIONS_ID',
   * position.ID.toString());
   */
  public static DELIVERY_NOTE_POSITIONS_TABLE_DB_DATA: { table: [any[string], any[]], maxRows: number, page: number } = {
    "table": [
      "ID,DELIVERY_NOTES_NUMBER,ORDERS_NUMBER,ITMNUM,ORDER_QTY,WEIGHT_PER,DELIVERY_QTY,ORDERS_POSITIONS_ID," +
      "POSITION_ID,CATEGORY_SOAS,PARENT_LINE_ID,POSITION_STATUS",
      [
        {
          "ID": 917708,
          "DELIVERY_NOTES_NUMBER": "50021LI014734",
          "ORDERS_NUMBER": "50021AU000025",
          "ITMNUM": "JOSEPHINE000101DE",
          "ORDER_QTY": 1,
          "WEIGHT_PER": 0.00000,
          "DELIVERY_QTY": 1,
          "ORDERS_POSITIONS_ID": 984670,
          "POSITION_ID":4000,
          "CATEGORY_SOAS": "SET",
          "PARENT_LINE_ID": null,
          "POSITION_STATUS":3
        },
        {
          "ID": 917708,
          "DELIVERY_NOTES_NUMBER": "50021LI014734",
          "ORDERS_NUMBER": "50021AU000025",
          "ITMNUM": "B179010101DE",
          "ORDER_QTY": 1,
          "WEIGHT_PER": 0.00000,
          "DELIVERY_QTY": 1,
          "ORDERS_POSITIONS_ID": 985375,
          "POSITION_ID":5000,
          "CATEGORY_SOAS": "KOMP",
          "PARENT_LINE_ID": 917710,
          "POSITION_STATUS":3
        },
        {
          "ID": 917708,
          "DELIVERY_NOTES_NUMBER": "50021LI014734",
          "ORDERS_NUMBER": "50021AU000025",
          "ITMNUM": "A121020101DE",
          "ORDER_QTY": 1,
          "WEIGHT_PER": 0.00000,
          "DELIVERY_QTY": 1,
          "ORDERS_POSITIONS_ID": 984671,
          "POSITION_ID":6000,
          "CATEGORY_SOAS": "KOMP",
          "PARENT_LINE_ID": 917708,
          "POSITION_STATUS":3
        }
      ]
    ],
    "maxRows": 981120,
    "page": 0
  };

  public static DELIVERY_NOTE_POSITIONS_EMPTY_TABLE_DB_DATA:
    { table: [any[string], any[]], maxRows: number, page: number } = {
    "table": [
      "ID,DELIVERY_NOTES_NUMBER,ORDERS_NUMBER,ITMNUM,ORDER_QTY,WEIGHT_PER,DELIVERY_QTY,ORDERS_POSITIONS_ID," +
      "POSITION_ID,CATEGORY_SOAS,PARENT_LINE_ID,POSITION_STATUS",
      []
    ],
    "maxRows": 981120,
    "page": 0
  };
}
