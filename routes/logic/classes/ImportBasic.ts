import {makeAndExecuteQueryUpdate, makeAndExecuteQueryInsert} from "../ImportHelper";
import {IColumn} from "./interfaces/Import";
import {ISqlType} from "mssql";

export class ImportBasic {
  tableName: string
  columns: any
  where: IColumn[]

  protected setColumnValue(columnName: string, value: string | number | Date){
    this.columns[columnName].value = value
  }

  getColumnValue(columnName: string){
    return this.columns[columnName]?.value
  }

  getColumnName(columnName: string): string{
    return this.columns[columnName].columnName
  }

  getColumnSqlType(columnName: string): ISqlType{
    return this.columns[columnName].sqlType
  }

  protected async insert(){
    await makeAndExecuteQueryInsert(this.tableName, this.columns)
  }

  protected async update(){
    await makeAndExecuteQueryUpdate(this.tableName, this.columns, this.where)
  }
}
