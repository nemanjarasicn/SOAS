import {
    IRequiredDataSupplyOrderImport,
    IRequiredDataSupplyOrderPosImport,
    ISupplyOrderColumns,
    ISupplyOrderPositionsColumns,
} from './interfaces/Import'
import {_columns, _columnsPos} from "../constants/SupplyOrderImportConstants";
import {ImportBasic} from "./ImportBasic";
import * as sql from 'mssql';
import {mssqlCallEscaped} from "../mssql_call";

export class SupplyOrderImport extends ImportBasic{
    static async getLastSupplyOrder(whereParam: string): Promise<string>{
        const sqlQuery = `SELECT TOP 1 PROVIDERS_ORDER as ordnum FROM SUPPLY_ORDERS 
    WHERE PROVIDERS_ORDER LIKE @LIKE ORDER BY PROVIDERS_ORDER DESC`
        const result = await mssqlCallEscaped([{
            name: 'LIKE',
            value: `%${whereParam}%`,
            type: sql.NVarChar
        }], sqlQuery)

        return result[0]?.ordnum
    }

    static async checkIsItSupplyOrder(salesLocation: string): Promise<boolean>{
        const companyStart = salesLocation[0]
        const sqlQuery = `SELECT COUNT(COMPANY) as 'num' from COMPANIES WHERE COMPANY LIKE @COMPANY 
     AND INTERCOMPANY = @INTERCOMPANY AND ACTIVE = @ACTIVE`
        const result = await mssqlCallEscaped([
            {
                name: 'COMPANY',
                type: sql.NVarChar,
                value: `${companyStart}%`
            },
            {
                name: 'INTERCOMPANY',
                type: sql.Int,
                value: 1
            },
            {
                name: 'ACTIVE',
                type: sql.Int,
                value: 1
            }
        ], sqlQuery)

        return +result[0].num > 0
    }

    constructor(
        data: IRequiredDataSupplyOrderImport
    ) {
        super()

        this.tableName = 'SUPPLY_ORDERS'
        this.columns = _columns as ISupplyOrderColumns

        for (const dataKey in data) {
            this.columns[dataKey].value = data[dataKey]
        }

    }

    async prepareInsert(){
        await this.insert()
    }
}

export class SupplyOrderPositions extends ImportBasic{

    constructor(data: IRequiredDataSupplyOrderPosImport) {
        super()

        this.tableName = 'SUPPLY_ORDERS_POSITIONS'
        this.columns = _columnsPos as ISupplyOrderPositionsColumns

        for (const dataKey in data) {
            this.columns[dataKey].value = data[dataKey]
        }
    }

    async prepareInsert(){
        await this.insert()
    }
}
