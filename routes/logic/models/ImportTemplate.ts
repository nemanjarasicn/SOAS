import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, updateData, setData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class ImportTemplate extends SoasModel {
    readonly type = ModelEnum.ImportTemplate
    declare TEMPLATE_NAME: string
    declare TEMPLATE_DESCRIPTION: string
    declare TEMPLATE_FIELDS: string
    declare REF_TABLE: string
    declare UPDATE_FIELDS: string

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

ImportTemplate.init({
        TEMPLATE_NAME: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            autoIncrement: false
        },
        TEMPLATE_DESCRIPTION: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        TEMPLATE_FIELDS: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        REF_TABLE: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        UPDATE_FIELDS: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'IMPORT_TEMPLATES'
    }
);
