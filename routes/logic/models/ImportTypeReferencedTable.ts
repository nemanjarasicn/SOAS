import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class ImportTypeReferencedTable extends SoasModel {
    readonly type = ModelEnum.ImportTypeReferencedTable
    declare ID: number
    declare IMPORT_TYPE_ID: number
    declare REFERENCED_TABLE: string

    async fetchData(getParams: IGetParams):
        Promise<SequelizeModel[] | { table: [string, SequelizeModel[]]; maxRows: number; page: number }> {

        return await getData(this.type, getParams)
    }

    async saveData(postParams: IPostParams): Promise<SequelizeModel> {

        return await setData(this.type, postParams)
    }

    async updateData(putParams: IPutParams): Promise<SequelizeModel> {

        return await updateData(this.type, putParams)
    }
}

ImportTypeReferencedTable.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        IMPORT_TYPE_ID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        REFERENCED_TABLE: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'IMPORT_TYPE_REFERENCED_TABLES'
    }
);
