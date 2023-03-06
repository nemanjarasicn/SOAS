import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class ImportTypeConstant extends SoasModel {
    readonly type = ModelEnum.ImportTypeConstant
    declare ID: number
    declare IMPORT_TYPE_REFERENCED_TABLES_ID: number
    declare COLUMN_NAME: string
    declare COLUMN_ACTIVE: number

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

ImportTypeConstant.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        IMPORT_TYPE_REFERENCED_TABLES_ID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        COLUMN_NAME: {
            type: DataTypes.STRING,
            allowNull: false
        },
        COLUMN_ACTIVE: {
            type: DataTypes.TINYINT,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'IMPORT_TYPE_CONSTANTS'
    }
);
