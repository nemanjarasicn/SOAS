import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class FormTemplate extends SoasModel {
    readonly type = ModelEnum.FormTemplate
    declare REF_TABLE: string
    declare FORM_TEMPLATE: string

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

FormTemplate.init({
        REF_TABLE: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        FORM_TEMPLATE: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'FORM_TEMPLATES'
    }
);
