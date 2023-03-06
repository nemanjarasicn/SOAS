import {
  IOrdersSecondaryColumns,
  IOrdersPosSecondaryColumns,
  IOrdersColumns,
  IOrdersPosColumns
} from "../classes/interfaces/Import";
import * as sql from 'mssql';

export const _columns = {
  orders_number_secondary: {
    columnName: 'ORDERS_NUMBER',
    notNull: true,
    sqlType: sql.NVarChar
  },
  client_secondary: {
    columnName: 'CLIENT',
    notNull: true,
    sqlType: sql.NVarChar
  },
  orders_type_secondary: {
    columnName: 'ORDERS_TYPE',
    notNull: true,
    sqlType: sql.NVarChar
  },
  project_field_0_secondary: {
    columnName: 'PROJECT_FIELD_0',
    notNull: true,
    sqlType: sql.NVarChar
  },
  project_field_1_secondary: {
    columnName: 'PROJECT_FIELD_1',
    notNull: true,
    sqlType: sql.NVarChar
  },
  project_field_2_secondary: {
    columnName: 'PROJECT_FIELD_2',
    notNull: true,
    sqlType: sql.NVarChar
  },
  customer_order_secondary: {
    columnName: 'CUSTOMER_ORDER',
    notNull: true,
    sqlType: sql.NVarChar
  },
  customer_delivery_secondary: {
    columnName: 'CUSTOMER_DELIVERY',
    notNull: true,
    sqlType: sql.NVarChar,
  },
  customer_invoice_secondary: {
    columnName: 'CUSTOMER_INVOICE',
    notNull: true,
    sqlType: sql.NVarChar,
  },
  orders_date_secondary: {
    columnName: 'ORDERS_DATE',
    notNull: true,
    sqlType: sql.NVarChar
  },
  orderamount_net_secondary: {
    columnName: 'ORDERAMOUNT_NET',
    notNull: true,
    sqlType: sql.Float
  },
  orderamount_bru_secondary: {
    columnName: 'ORDERAMOUNT_BRU',
    notNull: true,
    sqlType: sql.Float
  },
  customer_orderref_secondary: {
    columnName: 'CUSTOMER_ORDERREF',
    notNull: true,
    sqlType: sql.NVarChar
  },
  last_delivery_secondary: {
    columnName: 'LAST_DELIVERY',
    notNull: false,
    sqlType: sql.NVarChar
  },
  last_invoice_secondary: {
    columnName: 'LAST_INVOICE',
    notNull: false,
    sqlType: sql.NVarChar
  },
  edi_orderresponse_sent_secondary: {
    columnName: 'EDI_ORDERRESPONSE_SENT',
    notNull: true,
    sqlType: sql.Bit
  },
  release_secondary: {
    columnName: 'RELEASE',
    notNull: true,
    sqlType: sql.Bit
  },
  payed_secondary: {
    columnName: 'PAYED',
    notNull: true,
    sqlType: sql.Bit
  },
  currency_secondary: {
    columnName: 'CURRENCY',
    notNull: true,
    sqlType: sql.NVarChar
  },
  orders_state_secondary: {
    columnName: 'ORDERS_STATE',
    notNull: true,
    sqlType: sql.TinyInt
  },
  customer_addresses_id_delivery_secondary: {
    columnName: 'CUSTOMER_ADDRESSES_ID_DELIVERY',
    notNull: false,
    sqlType: sql.Int,
    default: 200 // TODO change hardcoded vars
  },
  customer_addresses_id_invoice_secondary: {
    columnName: 'CUSTOMER_ADDRESSES_ID_INVOICE',
    notNull: false,
    sqlType: sql.Int,
    default: 200 // TODO change hardcoded vars
  },
  payment_term_id_secondary: {
    columnName: 'PAYMENT_TERM_ID',
    notNull: false,
    sqlType: sql.NVarChar
  },
  webshop_id_secondary: {
    columnName: 'WEBSHOP_ID',
    notNull: false,
    sqlType: sql.Int
  },
  webshop_order_ref_secondary: {
    columnName: 'WEBSHOP_ORDER_REF',
    notNull: false,
    sqlType: sql.NVarChar
  },
  discount_secondary: {
    columnName: 'DISCOUNT',
    notNull: false,
    sqlType: sql.Float
  },
  voucher_secondary: {
    columnName: 'VOUCHER',
    notNull: true,
    sqlType: sql.Float
  },
  shipping_costs_secondary: {
    columnName: 'SHIPPING_COSTS',
    notNull: true,
    sqlType: sql.Float
  },
  warehouse_secondary: {
    columnName: 'WAREHOUSE',
    notNull: false,
    sqlType: sql.NChar
  },
  sales_location_secondary: {
    columnName: 'SALES_LOCATION',
    notNull: false,
    sqlType: sql.NChar
  },
  delivery_method_secondary: {
    columnName: 'DELIVERY_METHOD',
    notNull: false,
    sqlType: sql.NChar
  },
  comment_secondary: {
    columnName: 'COMMENT',
    notNull: false,
    sqlType: sql.Text
  },
  pac_qty_secondary: {
    columnName: 'PAC_QTY',
    notNull: false,
    sqlType: sql.Int
  },
  discount_perc_secondary: {
    columnName: 'DISCOUNT_PERC',
    notNull: false,
    sqlType: sql.Float
  },
  supply_order_reference_secondary: {
    columnName: 'SUPPLY_ORDER_REFERENCE',
    notNull: false,
    sqlType: sql.NVarChar
  },
} as IOrdersSecondaryColumns

export const _columnsPos = {
  orders_number_secondary: {
    columnName: 'ORDERS_NUMBER',
    notNull: true,
    sqlType: sql.NVarChar
  },
  itmnum_secondary: {
    columnName: 'ITMNUM',
    notNull: true,
    sqlType: sql.NVarChar
  },
  order_qty_secondary: {
    columnName: 'ORDER_QTY',
    notNull: true,
    sqlType: sql.Int
  },
  assigned_qty_secondary: {
    columnName: 'ASSIGNED_QTY',
    notNull: true,
    sqlType: sql.Int,
    default: 0
  },
  price_net_secondary: {
    columnName: 'PRICE_NET',
    notNull: true,
    sqlType: sql.Float,
    default: 0
  },
  price_bru_secondary: {
    columnName: 'PRICE_BRU',
    notNull: true,
    sqlType: sql.Float,
    default: 0
  },
  currency_secondary: {
    columnName: 'CURRENCY',
    notNull: true,
    sqlType: sql.NVarChar
  },
  position_status_secondary: {
    columnName: 'POSITION_STATUS',
    notNull: false,
    sqlType: sql.Int,
    default: 0
  },
  position_id_secondary: {
    columnName: 'POSITION_ID',
    notNull: false,
    sqlType: sql.Int
  },
  category_soas_secondary: {
    columnName: 'CATEGORY_SOAS',
    notNull: false,
    sqlType: sql.NVarChar
  },
  parent_line_id_secondary: {
    columnName: 'PARENT_LINE_ID',
    notNull: false,
    sqlType: sql.Int
  },
  delivered_qty_secondary: {
    columnName: 'DELIVERED_QTY',
    notNull: false,
    sqlType: sql.Int
  },
  itmdes_secondary: {
    columnName: 'ITMDES',
    notNull: false,
    sqlType: sql.NVarChar
  },
  warehouse_secondary: {
    columnName: 'WAREHOUSE',
    notNull: false,
    sqlType: sql.NChar
  },
  dist_components_id_secondary: {
    columnName: 'DIST_COMPONENTS_ID',
    notNull: false,
    sqlType: sql.Int
  }
} as IOrdersPosSecondaryColumns
