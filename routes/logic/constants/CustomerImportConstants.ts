import * as  sql from 'mssql';
import {ICustomers, ICustomersAddr} from "../classes/interfaces/Import";

export const _columns = {
  customers_number: {
    columnName: 'CUSTOMERS_NUMBER',
    notNull: true,
    sqlType: sql.NVarChar
  },
  customers_prename: {
    columnName: 'CUSTOMERS_PRENAME',
    notNull: true,
    sqlType: sql.NVarChar
  },
  customers_name: {
    columnName: 'CUSTOMERS_NAME',
    notNull: true,
    sqlType: sql.NVarChar
  },
  customers_company: {
    columnName: 'CUSTOMERS_COMPANY',
    notNull: false,
    sqlType: sql.NVarChar
  },
  customers_type: {
    columnName: 'CUSTOMERS_TYPE',
    notNull: true,
    sqlType: sql.NVarChar
  },
  eec_num: {
    columnName: 'EEC_NUM',
    notNull: true,
    sqlType: sql.NVarChar
  },
  language: {
    columnName: 'LANGUAGE',
    notNull: true,
    sqlType: sql.NVarChar
  },
  edi_invoic: {
    columnName: 'EDI_INVOIC',
    notNull: false,
    sqlType: sql.Bit
  },
  edi_ordersp: {
    columnName: 'EDI_ORDERSP',
    notNull: false,
    sqlType: sql.Bit
  },
  edi_desadv: {
    columnName: 'EDI_DESADV',
    notNull: false,
    sqlType: sql.Bit
  },
  create_date: {
    columnName: 'CREATE_DATE',
    notNull: false,
    sqlType: sql.Date
  },
  customers_email: {
    columnName: 'CUSTOMERS_EMAIL',
    notNull: false,
    sqlType: sql.NVarChar
  },
  customers_phone: {
    columnName: 'CUSTOMERS_PHONE',
    notNull: false,
    sqlType: sql.NVarChar
  },
  email_rg: {
    columnName: 'EMAIL_RG',
    notNull: true,
    sqlType: sql.NVarChar
  },
  email_li: {
    columnName: 'EMAIL_LI',
    notNull: true,
    sqlType: sql.NVarChar
  },
  email_au: {
    columnName: 'EMAIL_AU',
    notNull: true,
    sqlType: sql.NVarChar
  },
  phone_0: {
    columnName: 'PHONE_0',
    notNull: true,
    sqlType: sql.NVarChar
  },
  phone_1: {
    columnName: 'PHONE_1',
    notNull: true,
    sqlType: sql.NVarChar
  },
  fax_0: {
    columnName: 'FAX_0',
    notNull: true,
    sqlType: sql.NVarChar
  },
  mob_0: {
    columnName: 'MOB_0',
    notNull: true,
    sqlType: sql.NVarChar
  },
  mob_1: {
    columnName: 'MOB_1',
    notNull: true,
    sqlType: sql.NVarChar
  },
  crnnum: {
    columnName: 'CRNNUM',
    notNull: false,
    sqlType: sql.NChar
  },
  payment_term_id: {
    columnName: 'PAYMENT_TERM_ID',
    notNull: true,
    sqlType: sql.NVarChar
  },
  email: {
    columnName: 'EMAIL',
    notNull: false,
    sqlType: sql.NVarChar
  },
  different_dlv_name_0: {
    columnName: 'DIFFERENT_DLV_NAME_0',
    notNull: false,
    sqlType: sql.NChar
  },
  different_dlv_name_1: {
    columnName: 'DIFFERENT_DLV_NAME_1',
    notNull: false,
    sqlType: sql.NChar
  },
} as ICustomers

export const _columnsAddr = {
  address_type: {
    columnName: 'ADDRESS_TYPE',
    notNull: true,
    sqlType: sql.NChar
  },
  customers_number: {
    columnName: 'CUSTOMERS_NUMBER',
    notNull: true,
    sqlType: sql.NVarChar
  },
  address_cryname: {
    columnName: 'ADDRESS_CRYNAME',
    notNull: true,
    sqlType: sql.NVarChar
  },
  address_street: {
    columnName: 'ADDRESS_STREET',
    notNull: true,
    sqlType: sql.NVarChar
  },
  address_city: {
    columnName: 'ADDRESS_CITY',
    notNull: true,
    sqlType: sql.NVarChar
  },
  address_postcode: {
    columnName: 'ADDRESS_POSTCODE',
    notNull: true,
    sqlType: sql.NVarChar
  },
  address_iso_code: {
    columnName: 'ADDRESS_ISO_CODE',
    notNull: true,
    sqlType: sql.NVarChar
  },
  address_comment: {
    columnName: 'ADDRESS_COMMENT',
    notNull: false,
    sqlType: sql.Text
  },
  taxation: {
    columnName: 'TAXCODE',
    notNull: true,
    sqlType: sql.NVarChar
  },
  name_addr: {
    columnName: 'NAME_ADDR',
    notNull: false,
    sqlType: sql.NVarChar
  },
  email: {
    columnName: 'EMAIL',
    notNull: true,
    sqlType: sql.NVarChar
  },
  phone: {
    columnName: 'PHONE',
    notNull: true,
    sqlType: sql.NVarChar
  },
  address_id: {
    columnName: 'ADDRESS_ID',
    notNull: false,
    sqlType: sql.NChar
  },
} as ICustomersAddr
