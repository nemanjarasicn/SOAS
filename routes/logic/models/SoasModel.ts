import {SequelizeModel} from "../constants/constants";
import {Model} from "sequelize";

export interface IGetParams {
    primaryKey: string,
    searchColumn: string,
    searchText: string,
    exactSearchColumn?: string,
    exactSearchText?: string,
    page: number,
    size: number,
    sortColumn: string,
    sortDirection: string,
    options: []
}

export interface IPostParams {
    data: {}
    insertTogetherData?: {}[]
}

export interface IPutParams {
    primaryKey: string
    data: {}
}

export abstract class SoasModel extends Model {

    abstract fetchData(getParams: IGetParams): Promise<
        SequelizeModel[] |
        {
            table: [string, SequelizeModel[]],
            maxRows: number,
            page: number
        }
    >

    abstract saveData(postParams: IPostParams): Promise<SequelizeModel>

    abstract updateData(putParams: IPutParams): Promise<SequelizeModel>
}
