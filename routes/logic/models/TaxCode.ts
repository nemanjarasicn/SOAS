import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class TaxCode extends SoasModel {
    readonly type = ModelEnum.TaxCode
    declare TAXCODE: string
    declare DESCRIPTION: string
    declare COUNTRY: string

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

TaxCode.init({
    TAXCODE: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        autoIncrement: false
    },
    DESCRIPTION: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    COUNTRY: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {sequelize, timestamps: false, tableName: 'TAXCODES'});
