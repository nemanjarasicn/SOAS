import {
  IOrdersColumns,
  IOrdersPosColumns
} from "../classes/interfaces/Import";
import * as sql from 'mssql';

export const _columns = {
  orders_number: {
    columnName: 'ORDERS_NUMBER',
    notNull: true,
    sqlType: sql.NVarChar
  },
  client: {
    columnName: 'CLIENT',
    notNull: true,
    sqlType: sql.NVarChar
  },
  orders_type: {
    columnName: 'ORDERS_TYPE',
    notNull: true,
    sqlType: sql.NVarChar
  },
  project_field_0: {
    columnName: 'PROJECT_FIELD_0',
    notNull: true,
    sqlType: sql.NVarChar
  },
  project_field_1: {
    columnName: 'PROJECT_FIELD_1',
    notNull: true,
    sqlType: sql.NVarChar
  },
  project_field_2: {
    columnName: 'PROJECT_FIELD_2',
    notNull: true,
    sqlType: sql.NVarChar
  },
  customer_order: {
    columnName: 'CUSTOMER_ORDER',
    notNull: true,
    sqlType: sql.NVarChar
  },
  customer_delivery: {
    columnName: 'CUSTOMER_DELIVERY',
    notNull: true,
    sqlType: sql.NVarChar,
  },
  customer_invoice: {
    columnName: 'CUSTOMER_INVOICE',
    notNull: true,
    sqlType: sql.NVarChar,
  },
  orders_date: {
    columnName: 'ORDERS_DATE',
    notNull: true,
    sqlType: sql.NVarChar
  },
  orderamount_net: {
    columnName: 'ORDERAMOUNT_NET',
    notNull: true,
    sqlType: sql.Float
  },
  orderamount_bru: {
    columnName: 'ORDERAMOUNT_BRU',
    notNull: true,
    sqlType: sql.Float
  },
  customer_orderref: {
    columnName: 'CUSTOMER_ORDERREF',
    notNull: true,
    sqlType: sql.NVarChar
  },
  last_delivery: {
    columnName: 'LAST_DELIVERY',
    notNull: false,
    sqlType: sql.NVarChar
  },
  last_invoice: {
    columnName: 'LAST_INVOICE',
    notNull: false,
    sqlType: sql.NVarChar
  },
  edi_orderresponse_sent: {
    columnName: 'EDI_ORDERRESPONSE_SENT',
    notNull: true,
    sqlType: sql.Bit
  },
  release: {
    columnName: 'RELEASE',
    notNull: true,
    sqlType: sql.Bit
  },
  payed: {
    columnName: 'PAYED',
    notNull: true,
    sqlType: sql.Bit
  },
  currency: {
    columnName: 'CURRENCY',
    notNull: true,
    sqlType: sql.NVarChar
  },
  orders_state: {
    columnName: 'ORDERS_STATE',
    notNull: true,
    sqlType: sql.TinyInt
  },
  customer_addresses_id_delivery: {
    columnName: 'CUSTOMER_ADDRESSES_ID_DELIVERY',
    notNull: false,
    sqlType: sql.Int,
    default: 200
  },
  customer_addresses_id_invoice: {
    columnName: 'CUSTOMER_ADDRESSES_ID_INVOICE',
    notNull: false,
    sqlType: sql.Int,
    default: 200
  },
  payment_term_id: {
    columnName: 'PAYMENT_TERM_ID',
    notNull: false,
    sqlType: sql.NVarChar
  },
  webshop_id: {
    columnName: 'WEBSHOP_ID',
    notNull: false,
    sqlType: sql.Int
  },
  webshop_order_ref: {
    columnName: 'WEBSHOP_ORDER_REF',
    notNull: false,
    sqlType: sql.NVarChar
  },
  discount: {
    columnName: 'DISCOUNT',
    notNull: false,
    sqlType: sql.Float
  },
  voucher: {
    columnName: 'VOUCHER',
    notNull: true,
    sqlType: sql.Float
  },
  shipping_costs: {
    columnName: 'SHIPPING_COSTS',
    notNull: true,
    sqlType: sql.Float
  },
  warehouse: {
    columnName: 'WAREHOUSE',
    notNull: false,
    sqlType: sql.NChar
  },
  sales_location: {
    columnName: 'SALES_LOCATION',
    notNull: false,
    sqlType: sql.NChar
  },
  delivery_method: {
    columnName: 'DELIVERY_METHOD',
    notNull: false,
    sqlType: sql.NChar
  },
  comment: {
    columnName: 'COMMENT',
    notNull: false,
    sqlType: sql.Text
  },
  pac_qty: {
    columnName: 'PAC_QTY',
    notNull: false,
    sqlType: sql.Int
  },
  discount_perc: {
    columnName: 'DISCOUNT_PERC',
    notNull: false,
    sqlType: sql.Float
  },
  supply_order_reference: {
    columnName: 'SUPPLY_ORDER_REFERENCE',
    notNull: false,
    sqlType: sql.NVarChar
  },
  taxcode: {
    columnName: 'TAXCODE',
    notNull: false,
    sqlType: sql.NVarChar
  },
  taxrate: {
    columnName: 'TAXRATE',
    notNull: false,
    sqlType: sql.NVarChar
  },
  tax_amount: {
    columnName: 'TAX_AMOUNT',
    notNull: false,
    sqlType: sql.Decimal
  },
  net_order: {
    columnName: 'NET_ORDER',
    notNull: false,
    sqlType: sql.SmallInt
  },
} as IOrdersColumns

export const _columnsPos = {
  orders_number: {
    columnName: 'ORDERS_NUMBER',
    notNull: true,
    sqlType: sql.NVarChar
  },
  itmnum: {
    columnName: 'ITMNUM',
    notNull: true,
    sqlType: sql.NVarChar
  },
  order_qty: {
    columnName: 'ORDER_QTY',
    notNull: true,
    sqlType: sql.Int
  },
  assigned_qty: {
    columnName: 'ASSIGNED_QTY',
    notNull: true,
    sqlType: sql.Int,
    default: 0
  },
  price_net: {
    columnName: 'PRICE_NET',
    notNull: true,
    sqlType: sql.Float,
    default: 0
  },
  price_bru: {
    columnName: 'PRICE_BRU',
    notNull: true,
    sqlType: sql.Float,
    default: 0
  },
  currency: {
    columnName: 'CURRENCY',
    notNull: true,
    sqlType: sql.NVarChar
  },
  position_status: {
    columnName: 'POSITION_STATUS',
    notNull: false,
    sqlType: sql.Int,
    default: 0
  },
  position_id: {
    columnName: 'POSITION_ID',
    notNull: false,
    sqlType: sql.Int
  },
  category_soas: {
    columnName: 'CATEGORY_SOAS',
    notNull: false,
    sqlType: sql.NVarChar
  },
  parent_line_id: {
    columnName: 'PARENT_LINE_ID',
    notNull: false,
    sqlType: sql.Int
  },
  delivered_qty: {
    columnName: 'DELIVERED_QTY',
    notNull: false,
    sqlType: sql.Int
  },
  itmdes: {
    columnName: 'ITMDES',
    notNull: false,
    sqlType: sql.NVarChar
  },
  warehouse: {
    columnName: 'WAREHOUSE',
    notNull: false,
    sqlType: sql.NChar
  },
  dist_components_id: {
    columnName: 'DIST_COMPONENTS_ID',
    notNull: false,
    sqlType: sql.Int
  },
  tax_amount: {
    columnName: 'TAX_AMOUNT',
    notNull: false,
    sqlType: sql.Decimal
  },
} as IOrdersPosColumns
