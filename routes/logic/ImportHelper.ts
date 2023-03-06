import {mssqlCallEscaped} from "./mssql_call";
import {IColumn} from "./classes/interfaces/Import";
import * as sql from 'mssql';

export function makeColumnsForQuery(simpleColumns: {}): {columnName: string, value: any, sqlType:  sql.ISqlTypeFactory, default?: any}[] {
    let tmpColumns = [] as {columnName: string, value: any, sqlType: sql.ISqlTypeFactory, default?: any}[]

    for (let key in simpleColumns) {
        tmpColumns.push({
            columnName: key,
            value: simpleColumns[key],
            sqlType: sql.NVarChar
        })
    }

    return tmpColumns
}

export async function makeAndExecuteQueryInsert(tableName: string, columns: {columnName: string, value: any, sqlType: sql.ISqlTypeFactory, default?: any}[]){
    let sqlQuery = `INSERT INTO ${tableName} (`
    let sqlQueryParams = ''
    let sqlParams = []

    for (const columnKey in columns) {
        sqlQuery += `${columns[columnKey].columnName},`
        sqlQueryParams += `@${columns[columnKey].columnName}_PARAM,`

        let tmpValue

        if(columns[columnKey]?.value === 0) tmpValue = 0
        else tmpValue  = columns[columnKey]?.value || columns[columnKey].default

        sqlParams.push({
            name: `${columns[columnKey].columnName}_PARAM`,
            type: columns[columnKey].sqlType,
            value: tmpValue !== undefined? tmpValue : null
        })
    }

    sqlQuery = sqlQuery.slice(0, -1) + `) VALUES (${sqlQueryParams.slice(0, -1)})`

    console.log(sqlParams, sqlQuery)
    await mssqlCallEscaped(sqlParams, sqlQuery)
}

export async function makeAndExecuteQueryUpdate(tableName: string, columns: {columnName: string, value: any, sqlType: sql.ISqlTypeFactory, default?: any}, where: IColumn[]){
    let sqlQuery = `UPDATE ${tableName} SET `
    let sqlParams = []

    // SET VALUES
    for (let columnKey in columns) {
        sqlQuery += `${columns[columnKey].columnName} = @${columns[columnKey].columnName}_PARAM, `

        let tmpValue

        if(columns[columnKey]?.value === 0) tmpValue = 0
        else tmpValue  = columns[columnKey]?.value || columns[columnKey].default

        sqlParams.push({
            name: `${columns[columnKey].columnName}_PARAM`,
            type: columns[columnKey].sqlType,
            value: tmpValue !== undefined? tmpValue : null
        })
    }
    sqlQuery = sqlQuery.slice(0, -2) + ' WHERE '

    //WHERE VALUES
    for (let column of where) {
        sqlQuery += `${column.columnName} = @${column.columnName}_PARAM AND `

        const tmpValue = column?.value || column.default
        sqlParams.push({
            name: `${column.columnName}_PARAM`,
            type: column.sqlType,
            value: tmpValue !== undefined? tmpValue : null
        })
    }
    sqlQuery = sqlQuery.slice(0, -4)

    console.log(sqlParams, sqlQuery)
    await mssqlCallEscaped(sqlParams, sqlQuery)
}
