import {
    IOrdersPosSecondaryColumns,
    IOrdersSecondaryColumns,
    IRequiredDataSecondaryOrderImport,
    IRequiredDataSecondaryOrderPosImport
} from "./interfaces/Import";
import {_columns, _columnsPos} from '../constants/SecondaryOrderImportConstants'
import * as sql from 'mssql';
import {mssqlCallEscaped} from "../mssql_call";
import {ImportBasic} from "./ImportBasic";
import {OrderImport, OrderPosImport} from "./OrderImport";

export class SecondaryOrderImport extends ImportBasic{

    constructor(requiredData: IRequiredDataSecondaryOrderImport) {
        super()
        this.tableName = "ORDERS"
        this.columns = _columns as IOrdersSecondaryColumns

        for (const dataKey in requiredData) {
            this.columns[dataKey].value = requiredData[dataKey]
        }
    }

    async prepareInsert(){
        await this.getCompanyAddress()

        await this.insert()
    }

    private async getCompanyAddress(){
        const sqlQuery = `SELECT ID FROM CUSTOMERS_ADDRESSES 
        WHERE CUSTOMERS_NUMBER = @CUSTOMERS_NUMBER ORDER BY ADDRESS_TYPE`
        const sqlParams = [
            {
                name: `CUSTOMERS_NUMBER`,
                type: sql.NVarChar,
                value: 200 // TODO change hardcoded vars
            }
        ]

        const result = await mssqlCallEscaped(sqlParams, sqlQuery)
        this.columns.customer_addresses_id_delivery_secondary.value = result[0].ID
        this.columns.customer_addresses_id_invoice_secondary.value = result[1].ID
    }
}

export class SecondaryOrderPosImport extends ImportBasic{

    constructor(requiredData: IRequiredDataSecondaryOrderPosImport) {
        super()

        this.tableName = "ORDERS_POSITIONS"
        this.columns = _columnsPos as IOrdersPosSecondaryColumns

        for (const dataKey in requiredData) {
            this.columns[dataKey].value = requiredData[dataKey]
        }
    }

    async getLastInserted(): Promise<number>{
        const sqlQuery = `SELECT TOP 1 ID FROM ORDERS_POSITIONS WHERE ORDERS_NUMBER = @ORDERS_NUMBER AND ITMNUM = @ITMNUM
            AND POSITION_ID = @POSITION_ID
        `
        const sqlParams = [
            {
                name: 'ORDERS_NUMBER',
                type: sql.NVarChar,
                value: this.getColumnValue('orders_number_secondary')
            },
            {
                name: 'ITMNUM',
                type: sql.NVarChar,
                value: this.getColumnValue('itmnum_secondary')
            },
            {
                name: 'POSITION_ID',
                type: sql.Int,
                value: this.getColumnValue('position_id_secondary')
            },
        ]

        const result = await mssqlCallEscaped(sqlParams, sqlQuery) as {ID: number}[]
        return result[0].ID
    }

    async prepareInsert(){
        this.setColumnValue(
            'itmdes_secondary',
            await OrderPosImport.getItmDes(this.getColumnValue('itmnum_secondary'))
        )

        if(!this.getColumnValue('itmnum_secondary')){
            this.setColumnValue(
                'itmdes_secondary',
                await OrderPosImport.getItmDes(this.getColumnValue('itmnum_secondary'))
            )
        }

        if(this.getColumnValue('category_soas_secondary') === 'KOMP'){
            this.setColumnValue('price_net_secondary', 0)
            this.setColumnValue('price_bru_secondary', 0)
        }
        else if(
            this.getColumnValue('price_net_secondary') === null ||
            this.getColumnValue('price_net_secondary') === undefined
        ){
            this.setColumnValue(
                'price_net_secondary',
                await OrderImport.getNetPriceForOrdPos(
                    +this.getColumnValue('price_bru_secondary'),
                    '200' // TODO change hardcoded vars
                )
            )
        }

        const tmpCurrency = this.getColumnValue('currency_secondary')
        this.setColumnValue(
            'currency_secondary',
            !+`${tmpCurrency}`? await OrderImport.getCurrencyID( tmpCurrency ) : tmpCurrency
        )

        const distQty = await OrderPosImport.getDistQtyForComponent(this.getColumnValue('itmnum_secondary')) as number
        this.setColumnValue(
            'assigned_qty_secondary',
            +this.getColumnValue('order_qty_secondary') * distQty
        )

        await this.insert()
    }
}
