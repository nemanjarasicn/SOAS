import {ImportBasic} from "./ImportBasic";
import {constants} from '../constants/constants';
import {_columns, _columnsAddr} from "../constants/CustomerImportConstants";
import * as sql from 'mssql';
import {
  ICustomers,
  ICustomersAddr,
  IRequiredDataCustomersImport,
  IRequiredDataCustomersAddrImport
} from "./interfaces/Import";
import {mssqlCallEscaped} from "../mssql_call";

export class CustomerImport extends ImportBasic{

  static async getNewCustomerNumber(): Promise<string>{
    const sqlQuery = `SELECT TOP 1 CUSTOMERS_NUMBER FROM CUSTOMERS ORDER BY CUSTOMERS_NUMBER DESC`
    const result = await mssqlCallEscaped([], sqlQuery)

    if(result?.length > 0 && result[0]?.CUSTOMERS_NUMBER)
      return String( +result[0].CUSTOMERS_NUMBER + 1).padStart(constants.MINIMUM_NUMBER_LENGTH_CUSTOMER_NUMBER, '0')
    else
      return '1'.padStart(constants.MINIMUM_NUMBER_LENGTH_CUSTOMER_NUMBER, '0')
  }

  /**
   * Author: Strahinja Belic 29.06.2021.
   * Last Change: 29.07.2021.
   *
   * It will check if a customer already exists with the given CUSTOMERS_NUMBER
   * @param customerNumber string
   * @returns Promise<boolean>
   */
  static async checkCustomer(customerNumber: string): Promise<boolean>{

    const sqlQuery = `SELECT COUNT(CUSTOMERS_NUMBER) as 'num' FROM CUSTOMERS 
        WHERE CUSTOMERS_NUMBER = @CUSTOMERS_NUMBER`
    const result = await mssqlCallEscaped([
      {
        name: 'CUSTOMERS_NUMBER',
        type: sql.NVarChar,
        value: customerNumber
      }
    ], sqlQuery)

    return !+result[0].num
  }

  /**
   * Author: Strahinja Belic 30.06.2021.
   * Last Change: 23.08.2021.
   *
   * It will return a customer type according to given customer number
   * @param customerNumber string
   * @returns Promise <'B2B' | 'B2C'>
   */
  static async getCustomerType(customerNumber: string): Promise<'B2B' | 'B2C'>{
    const sqlQuery = `SELECT COUNT(CUSGRP) as 'num' FROM SOAS.dbo.PRILISTS WHERE CUSGRP = @CUSGRP`
    const result = await mssqlCallEscaped([
      {
        name: 'CUSGRP',
        type: sql.NVarChar,
        value: customerNumber
      }
    ], sqlQuery)

    return !!+result[0].num ? 'B2B' : 'B2C'
  }

  constructor(requiredData: IRequiredDataCustomersImport) {
    super();

    this.tableName = 'CUSTOMERS'
    this.columns = _columns as ICustomers

    for (const dataKey in requiredData) {
      this.columns[dataKey].value = requiredData[dataKey]
    }
  }

  async prepareInsert() {
    this.setColumnValue(
        'customers_type',
        await CustomerImport.getCustomerType(this.getColumnValue('customers_number').toString())
    )

    // check for INSERT / UPDATE
    if (await CustomerImport.checkCustomer(this.getColumnValue('customers_number').toString())){
      await this.insert()
    }
    else {
      this.where = [
        {
          columnName: this.getColumnName('customers_number'),
          sqlType: this.getColumnSqlType('customers_number'),
          value: this.getColumnValue('customers_number')
        }
      ]
      await this.update()
    }
  }
}

export class CustomerAddrImport extends ImportBasic{
  /**
   * Author: Strahinja Belic 30.06.2021.
   * Last Change: 23.08.2021.
   *
   * It will check should you insert or update CUSTOMERS_ADDRESSES
   * @param customerNumber string
   * @param addressType string
   * @returns Promise<boolean>
   */
  static async checkCustomerAddress(customerNumber: string, addressType: string): Promise<boolean>{
    const sqlQuery = `SELECT COUNT(CUSTOMERS_NUMBER) as 'num' FROM 
    CUSTOMERS_ADDRESSES WHERE CUSTOMERS_NUMBER = @CUSTOMERS_NUMBER AND ADDRESS_TYPE = @ADDRESS_TYPE`
    const result = await mssqlCallEscaped([
      {
        name: 'CUSTOMERS_NUMBER',
        type: sql.NVarChar,
        value: customerNumber
      },
      {
        name: 'ADDRESS_TYPE',
        type: sql.NVarChar,
        value: addressType
      }
    ], sqlQuery)

    return !+result[0].num
  }

  /**
   * Author: Strahinja Belic 30.06.2021.
   * Last Change: 23.08.2021.
   *
   * It will return full name of country by iso country code that you provide
   * @param country_iso string - 2 chars like DE
   * @returns Promise<string> - full name of country
   */
  async getAddressCountyName(country_iso: string): Promise<string>{
    const sqlQuery = `SELECT COUNTRY_NAME as 'name' FROM COUNTRIES
    WHERE COUNTRY_ISO_CODE = @COUNTRY_ISO`
    const result = await mssqlCallEscaped([
      {
        name: 'COUNTRY_ISO',
        type: sql.NVarChar,
        value: country_iso
      }
    ], sqlQuery)

    return result[0]?.name
  }

  setStreetAndComment(): void{
    const addrComments: {name: string, type: any, value: any}[] | {name: string, type: any, value: any} =
        this.getColumnValue('address_comment') || []
    // @ts-ignore
    if(addrComments[1]?.value){
      this.setColumnValue('address_street', addrComments[0]?.value || ' ')
      this.setColumnValue(
          'address_comment',
          addrComments
              // @ts-ignore
              .map(comm => comm?.value)
              .filter(comm => comm?.length > 0)
              .join('|') || ' ' //manually assign
      )
    }
    // @ts-ignore
    else if(addrComments?.value){
      // @ts-ignore
      this.setColumnValue('address_street', addrComments.value || ' ')
      // @ts-ignore
      this.setColumnValue('address_comment', addrComments.value || ' ')
    }
    else{
      this.setColumnValue('address_comment', ' ')
      this.setColumnValue('address_street', ' ')
    }
  }

  constructor(requiredData: IRequiredDataCustomersAddrImport) {
    super();

    this.tableName = 'CUSTOMERS_ADDRESSES'
    this.columns = _columnsAddr as ICustomersAddr

    for (const dataKey in requiredData) {
      this.columns[dataKey].value = requiredData[dataKey]
    }
  }

  async prepareInsert() {
    this.setColumnValue(
        'address_cryname',
        await this.getAddressCountyName(this.getColumnValue('address_iso_code').toString())
    )
    this.setStreetAndComment()

    // check for INSERT / UPDATE
    if(
        await CustomerAddrImport.checkCustomerAddress(
            this.getColumnValue('customers_number').toString(),
            this.getColumnValue('address_type').toString()
        )
    ) await this.insert()
    else{
      this.where = [
        {
          columnName: this.getColumnName('customers_number'),
          sqlType: this.getColumnSqlType('customers_number'),
          value: this.getColumnValue('customers_number')
        },
        {
          columnName: this.getColumnName('address_type'),
          sqlType: this.getColumnSqlType('address_type'),
          value: this.getColumnValue('address_type')
        }
      ]
      await this.update()
    }
  }
}
