import {OrderPositionItem} from "../../app/interfaces/order-position-item";
import {Order} from "../../app/interfaces/order-item";
import {Customer} from "../../app/models/customer";
import {Orders} from "../../app/models/orders";
import {DeliveryNotes} from "../../app/models/delivery-notes";
import {Invoices} from "../../app/models/invoices";

/**
 * orders constants for unit tests
 */
export class OrdersTestConstants {

  // all 26 items
  public static ORDERS_FIELDS: string = JSON.stringify([
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-6",
        "type": "input",
        "key": "ORDERS_NUMBER",
        "templateOptions": {"label": "ORDERS_NUMBER", "required": true},
        "expressionProperties": {"templateOptions.disabled": "true"}
      }, {"className": "section-label", "template": "<br />"}]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "key": "CLIENT",
        "type": "native-select",
        "className": "col-md-4",
        "templateOptions": {"label": "CLIENT", "required": true, "options": []},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }, {"className": "section-label", "template": "<br />"}]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-4",
        "type": "input",
        "key": "ORDERS_TYPE",
        "defaultValue": "webde",
        "templateOptions": {"label": "ORDERS_TYPE", "required": true},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }, {"className": "section-label", "template": "<br />"}]
    }, {
      "className": "section-label",
      "template": "<div class=\"form-section-title\"><strong>Kundennummern:</strong></div>"
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-12",
        "type": "formly-autocomplete-type",
        "key": "CUSTOMER_ORDER",
        "templateOptions": {"label": "CUSTOMER_ORDER", "required": true},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }, {
        "className": "col-md-6",
        "type": "input",
        "key": "CUSTOMER_DELIVERY",
        "templateOptions": {"label": "CUSTOMER_DELIVERY"},
        "expressionProperties": {"templateOptions.disabled": "true"}
      }, {
        "className": "col-md-6",
        "type": "input",
        "key": "CUSTOMER_INVOICE",
        "templateOptions": {"label": "CUSTOMER_INVOICE"},
        "expressionProperties": {"templateOptions.disabled": "true"}
      }]
    }, {
      "className": "section-label",
      "template": "<div class=\"form-section-title\"><strong>Adressen:</strong></div>"
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "key": "CUSTOMER_ADDRESSES_ID_DELIVERY",
        "type": "native-select",
        "className": "col-md-6",
        "templateOptions": {"label": "CUSTOMER_ADDRESSES_ID_DELIVERY", "options": []},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "key": "CUSTOMER_ADDRESSES_ID_INVOICE",
        "type": "native-select",
        "className": "col-md-6",
        "templateOptions": {"label": "CUSTOMER_ADDRESSES_ID_INVOICE", "options": []},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-6",
        "type": "input",
        "key": "ORDERS_DATE",
        "templateOptions": {"label": "ORDERS_DATE", "type": "date", "required": true},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }]
    }, {
      "className": "section-label",
      "template": "<div class=\"form-section-title\"><strong>Beträge:</strong></div>"
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-6",
        "type": "input",
        "key": "ORDERAMOUNT_NET",
        "defaultValue": 0,
        "templateOptions": {"label": "ORDERAMOUNT_NET", "required": true},
        "expressionProperties": {"templateOptions.disabled": "true"}
      }, {
        "className": "col-md-6",
        "type": "input",
        "key": "ORDERAMOUNT_BRU",
        "defaultValue": 0,
        "templateOptions": {"label": "ORDERAMOUNT_BRU", "required": true},
        "expressionProperties": {"templateOptions.disabled": "true"}
      }]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "key": "CURRENCY",
        "type": "native-select",
        "className": "col-md-3",
        "templateOptions": {"label": "CURRENCY", "required": true, "options": []},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }, {"className": "section-label", "template": "<br />"}]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "key": "PAYMENT_TERM_ID",
        "type": "native-select",
        "className": "col-md-6",
        "templateOptions": {"label": "PAYMENT_TERM_ID", "required": true, "options": []},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }, {"className": "section-label", "template": "<br />"}]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "key": "WAREHOUSE",
        "type": "native-select",
        "className": "col-md-3",
        "templateOptions": {"label": "WAREHOUSE", "required": true, "options": []},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }, {"className": "section-label", "template": "<br />"}]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-6",
        "type": "input",
        "key": "CUSTOMER_ORDERREF",
        "templateOptions": {"label": "CUSTOMER_ORDERREF"},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }]
    }, {
      "className": "section-label",
      "template": "<div class=\"form-section-title\"><strong>Beträge:</strong></div>"
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-6",
        "type": "input",
        "key": "LAST_DELIVERY",
        "templateOptions": {"label": "LAST_DELIVERY"},
        "expressionProperties": {"templateOptions.disabled": "true"}
      }, {
        "className": "col-md-6",
        "type": "input",
        "key": "LAST_INVOICE",
        "templateOptions": {"label": "LAST_INVOICE"},
        "expressionProperties": {"templateOptions.disabled": "true"}
      }]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "key": "EDI_ORDERRESPONSE_SENT",
        "className": "col-md-6",
        "type": "checkbox",
        "defaultValue": false,
        "templateOptions": {"label": "EDI_ORDERRESPONSE_SENT"},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "key": "RELEASE",
        "className": "col-md-6",
        "type": "checkbox",
        "defaultValue": false,
        "templateOptions": {"label": "RELEASE"},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "key": "PAYED",
        "className": "col-md-6",
        "type": "checkbox",
        "defaultValue": false,
        "templateOptions": {"label": "PAYED"},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "key": "ORDERS_STATE",
        "type": "native-select",
        "className": "col-md-6",
        "defaultValue": 10,
        "templateOptions": {"label": "ORDERS_STATE", "required": true, "options": []},
        "expressionProperties": {"templateOptions.disabled": "true"}
      }, {"className": "section-label", "template": "<br />"}]
    }, {
      "className": "section-label",
      "template": "<div class=\"form-section-title\"><strong>Webshop:</strong></div>"
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-6",
        "type": "input",
        "key": "WEBSHOP_ID",
        "templateOptions": {"label": "WEBSHOP_ID"},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }, {
        "className": "col-md-6",
        "type": "input",
        "key": "WEBSHOP_ORDER_REF",
        "templateOptions": {"label": "WEBSHOP_ORDER_REF"},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-6",
        "type": "input",
        "key": "DISCOUNT",
        "templateOptions": {"label": "DISCOUNT"},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-6",
        "type": "input",
        "key": "VOUCHER",
        "templateOptions": {"label": "VOUCHER"},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-6",
        "type": "input",
        "key": "SHIPPING_COSTS",
        "templateOptions": {"label": "SHIPPING_COSTS"},
        "expressionProperties": {"templateOptions.disabled": "false"}
      }]
    }
  ]);

  public static ORDERS_CUSTOMER_ADDRESSES: string =
    'DLV~511823~Musterstr. 1 - 11111 Musterstadt;INV~511824~Musterstr. 1 - 11111 Musterstadt';

  // IMPORTANT: CUSTOMER_ADDRESSES should be first element, because otherwise addresses select elements will be not set
  public static readonly ORDER_ITEM: Order = {
    CUSTOMER_ADDRESSES: OrdersTestConstants.ORDERS_CUSTOMER_ADDRESSES,
    ORDERS_NUMBER: "50021AU000027",
    CLIENT: "B2C",
    ORDERS_TYPE: "webde",
    CUSTOMER_ORDER: "4500000298",
    CUSTOMER_ADDRESSES_ID_DELIVERY: 511823,
    CUSTOMER_ADDRESSES_ID_INVOICE: 511824,
    CUSTOMER_DELIVERY: "4500000298",
    CUSTOMER_INVOICE: "0",
    ORDERS_DATE: "2021-05-31",
    ORDERAMOUNT_BRU: 120.744,
    ORDERAMOUNT_NET: 101.425,
    CURRENCY: "1",
    PAYMENT_TERM_ID: "RE",
    CUSTOMER_ORDERREF: "4500000298",
    LAST_DELIVERY: "50021LI014739",
    LAST_INVOICE: "",
    EDI_ORDERRESPONSE_SENT: false,
    RELEASE: false,
    PAYED: true,
    ORDERS_STATE: 10,
    WEBSHOP_ID: 0,
    WEBSHOP_ORDER_REF: "",
    DISCOUNT: 0,
    VOUCHER: 0,
    SHIPPING_COSTS: 0,
    WAREHOUSE: "101",
    SALES_LOCATION: "101"
  };

  public static readonly ORDERS_ITEM: Orders = {
    CUSTOMER_ADDRESSES: OrdersTestConstants.ORDERS_CUSTOMER_ADDRESSES,
    ORDERS_NUMBER: "50021AU000027",
    CLIENT: "B2C",
    ORDERS_TYPE: "webde",
    CUSTOMER_ORDER: "4500000298",
    CUSTOMER_ADDRESSES_ID_DELIVERY: 511823,
    CUSTOMER_ADDRESSES_ID_INVOICE: 511824,
    CUSTOMER_DELIVERY: "4500000298",
    CUSTOMER_INVOICE: "0",
    ORDERS_DATE: "2021-05-31",
    ORDERAMOUNT_BRU: 120.744,
    ORDERAMOUNT_NET: 101.425,
    CURRENCY: "1",
    PAYMENT_TERM_ID: "RE",
    CUSTOMER_ORDERREF: "4500000298",
    LAST_DELIVERY: "50021LI014739",
    LAST_INVOICE: "",
    EDI_ORDERRESPONSE_SENT: false,
    RELEASE: false,
    PAYED: true,
    ORDERS_STATE: 10,
    WEBSHOP_ID: 0,
    WEBSHOP_ORDER_REF: "",
    DISCOUNT: 0,
    VOUCHER: 0,
    SHIPPING_COSTS: 0,
    WAREHOUSE: "101",
    SALES_LOCATION: "101"
  };

  public static readonly ORDERS_POSITION_ITEM: OrderPositionItem = {
    ID: 985581,
    POS: 0, // virtual column for showing position number in view
    ORDERS_NUMBER: "50021AU000027",
    ITMNUM: "MARS600STAND000216DE",
    ITMDES: "Stand Badmöbel Mars 600 SlimLine Beton",
    CATEGORY_SOAS: "SET",
    ORDER_QTY: 1,
    ASSIGNED_QTY: 0,
    DELIVERED_QTY: 0,
    PRICE_NET: 335.91600,
    PRICE_BRU: 399.90000,
    CURRENCY: "1",
    POSITION_STATUS: 1,
    POSITION_ID: 1000,
    PARENT_LINE_ID: null,
    WAREHOUSE: "101",
    DIST_COMPONENTS_ID: null
  };

  public static readonly ORDERS_POSITION_ITEM_KOMP: OrderPositionItem = {
    ID: 985582,
    POS: 1, // virtual column for showing position number in view
    ORDERS_NUMBER: "50021AU000027",
    ITMNUM: "BMCN161",
    ITMDES: "Stand Badmöbel Mars 600 SlimLine Beton",
    CATEGORY_SOAS: "KOMP",
    ORDER_QTY: 1,
    ASSIGNED_QTY: 1,
    DELIVERED_QTY: 0,
    PRICE_NET: 0.00000,
    PRICE_BRU: 0.00000,
    CURRENCY: "1",
    POSITION_STATUS: 3,
    POSITION_ID: 2000,
    PARENT_LINE_ID: 985581,
    WAREHOUSE: "101",
    DIST_COMPONENTS_ID: 10025
  };

  // IMPORTANT: CUSTOMER_ADDRESSES should be first element, because otherwise addresses select elements will be not set
  public static ORDERS_MODEL: { row: { data: {} } } = {
    row: {
      data: [[], [OrdersTestConstants.ORDERS_ITEM]]
    }
  };

  /**
   * Orders table data returned by:
   * let tableDbData = await this.tableDataService.getTableDataByCustomersNumber(primaryRefTable,
   * ViewQueryTypes.DETAIL_TABLE, tablePrimaryColumn, tablePrimaryValue, tableSecondColumn, tableSecondValue);
   */
  public static ORDERS_TABLE_DB_DATA: { table: [any[string], any[]], maxRows: number, page: number } = {
    "table": [
      "ORDERS_NUMBER,CLIENT,ORDERS_TYPE,CUSTOMER_ORDER,CUSTOMER_DELIVERY,CUSTOMER_INVOICE," +
      "CUSTOMER_ADDRESSES_ID_DELIVERY,CUSTOMER_ADDRESSES_ID_INVOICE,ORDERS_DATE,ORDERAMOUNT_NET,ORDERAMOUNT_BRU," +
      "CURRENCY,PAYMENT_TERM_ID,WAREHOUSE,CUSTOMER_ORDERREF,LAST_DELIVERY,LAST_INVOICE,EDI_ORDERRESPONSE_SENT," +
      "RELEASE,PAYED,ORDERS_STATE,WEBSHOP_ID,WEBSHOP_ORDER_REF,DISCOUNT,VOUCHER,SHIPPING_COSTS",
      [
        {
          "ORDERS_NUMBER": "50021AU000023",
          "CLIENT": "B2C",
          "ORDERS_TYPE": "webde",
          "CUSTOMER_ORDER": "4500000298",
          "CUSTOMER_ADDRESSES_ID_DELIVERY": 511823,
          "CUSTOMER_ADDRESSES_ID_INVOICE": 511824,
          "CUSTOMER_DELIVERY": "4500000298",
          "CUSTOMER_INVOICE": "0",
          "ORDERS_DATE": "2021-04-20 00:00:00",
          "ORDERAMOUNT_NET": 327.516,
          "ORDERAMOUNT_BRU": 389.9,
          "CUSTOMER_ORDERREF": "4500000298",
          "LAST_DELIVERY": "",
          "LAST_INVOICE": "10021RG010690",
          "EDI_ORDERRESPONSE_SENT": false,
          "PAYMENT_TERM_ID": "RE",
          "RELEASE": false,
          "PAYED": true,
          "CURRENCY": "1",
          "ORDERS_STATE": 10,
          "WEBSHOP_ID": 0,
          "WEBSHOP_ORDER_REF": "",
          "DISCOUNT": 0,
          "VOUCHER": 0,
          "SHIPPING_COSTS": 0,
          "WAREHOUSE": "101"
        }
      ]
    ],
    "maxRows": 203955,
    "page": 0
  };

  /**
   * Orders positions table data returned by:
   * let ordersPositionsDbData = await self.tableDataService.getTableDataById(
   * self.CONSTANTS.REFTABLE_ORDERS_POSITIONS, ViewQueryTypes.MAIN_TABLE, 'ORDERS_NUMBER', ordersNumber);
   */
  public static ORDERS_POSITIONS_TABLE_DB_DATA: { table: [any[string], any[]], maxRows: number, page: number } = {
    "table": [
      "ID,ORDERS_NUMBER,ITMNUM,CATEGORY_SOAS,ORDER_QTY,ASSIGNED_QTY,PRICE_NET,PARENT_LINE_ID",
      [
        {
          "ID": 985581,
          "ORDERS_NUMBER": "50021AU000023",
          "ITMNUM": "MARS600STAND000216DE",
          "CATEGORY_SOAS": "SET",
          "ORDER_QTY": 1,
          "ASSIGNED_QTY": 0,
          "PRICE_NET": 327.516,
          "PARENT_LINE_ID": null
        },
        {
          "ID": 985582,
          "ORDERS_NUMBER": "50021AU000023",
          "ITMNUM": "BMCN161",
          "CATEGORY_SOAS": "KOMP",
          "ORDER_QTY": 1,
          "ASSIGNED_QTY": 1,
          "PRICE_NET": 0,
          "PARENT_LINE_ID": 985581
        },
        {
          "ID": 985583,
          "ORDERS_NUMBER": "50021AU000023",
          "ITMNUM": "A10104",
          "CATEGORY_SOAS": "KOMP",
          "ORDER_QTY": 1,
          "ASSIGNED_QTY": 1,
          "PRICE_NET": 0,
          "PARENT_LINE_ID": 985581
        },
        {
          "ID": 985584,
          "ORDERS_NUMBER": "50021AU000023",
          "ITMNUM": "B101010216DE",
          "CATEGORY_SOAS": "KOMP",
          "ORDER_QTY": 1,
          "ASSIGNED_QTY": 1,
          "PRICE_NET": 0,
          "PARENT_LINE_ID": 985581
        },
        {
          "ID": 985585,
          "ORDERS_NUMBER": "50021AU000023",
          "ITMNUM": "0024",
          "CATEGORY_SOAS": "KOMP",
          "ORDER_QTY": 6,
          "ASSIGNED_QTY": 6,
          "PRICE_NET": 0,
          "PARENT_LINE_ID": 985581
        }
      ]
    ],
    "maxRows": 981120,
    "page": 0
  };
}
