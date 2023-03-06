import {ISupplyOrderColumns, ISupplyOrderPositionsColumns} from "../classes/interfaces/Import";
import * as sql from 'mssql';
export const _columns = {
  provider_order_supply: {
    columnName: 'PROVIDERS_ORDER',
    notNull: true,
    sqlType: sql.NVarChar
  },
  provider_supply: {
    columnName: 'PROVIDER',
    notNull: true,
    default: 100,
    sqlType: sql.Int
  },
  client_delivery_supply: {
    columnName: 'CLIENT_DELIVERY',
    notNull: true,
    default: 200,
    sqlType: sql.NVarChar
  },
  client_invoice_supply: {
    columnName: 'CLIENT_INVOICE',
    notNull: true,
    default: 200,
    sqlType: sql.NVarChar
  },
  amount_net_supply: {
    columnName: 'ORDERAMOUNT_NET',
    notNull: true,
    default: 0,
    sqlType: sql.Float
  },
  amount_bru_supply: {
    columnName: 'ORDERAMOUNT_BRU',
    notNull: true,
    default: 0,
    sqlType: sql.Float
  },
  order_ref_supply: {
    columnName: 'ORDERREF',
    notNull: true,
    sqlType: sql.NVarChar
  },
  currency_supply: {
    columnName: 'CURRENCY',
    notNull: true,
    default: 'EUR',
    sqlType: sql.NVarChar
  },
  shipping_costs_supply: {
    columnName: 'SHIPPING_COSTS',
    notNull: true,
    default: 0,
    sqlType: sql.Float
  },
  warehouse_supply: {
    columnName: 'WAREHOUSE',
    notNull: true,
    default: 101,
    sqlType: sql.NVarChar
  },
  orders_date_supply: {
    columnName: 'ORDERS_DATE',
    notNull: true,
    sqlType: sql.NVarChar
  },
  inter_company_supply: {
    columnName: 'INTERCOMPANY',
    notNull: true,
    default: 1,
    sqlType: sql.SmallInt
  },
} as ISupplyOrderColumns

export const _columnsPos = {
  providers_order_supply: {
    columnName: 'PROVIDERS_ORDER',
    notNull: true,
    sqlType: sql.NVarChar
  },
  item_num_supply: {
    columnName: 'ITMNUM',
    notNull: true,
    sqlType: sql.NVarChar
  },
  order_qty_supply: {
    columnName: 'ORDER_QTY',
    notNull: true,
    sqlType: sql.Int
  },
  price_net_supply: {
    columnName: 'PRICE_NET',
    notNull: true,
    sqlType: sql.Float,
    default: 0
  },
  price_bru_supply: {
    columnName: 'PRICE_BRU',
    notNull: true,
    sqlType: sql.Float,
    default: 0
  },
  scheduled_arrival_supply: {
    columnName: 'SCHEDULED_ARRIVAL',
    notNull: true,
    sqlType: sql.SmallDateTime,
    default: new Date()
  },
  supplied_qty_supply: {
    columnName: 'SUPPLIED_QTY',
    notNull: true,
    sqlType: sql.Int,
    default: 0
  },
  warehouse_supply: {
    columnName: 'WAREHOUSE',
    sqlType: sql.NVarChar,
    notNull: true
  }
} as ISupplyOrderPositionsColumns
