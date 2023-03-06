import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";

export class Currency extends SoasModel {
    readonly type = ModelEnum.Currency;
    declare CURRENCY_ID: number;
    declare CURRENCY_NAME: string;
    declare CURRENCY_ISO_CODE: string;
    declare CURRENCY_SYMBOL: string;

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

Currency.init({
    CURRENCY_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    CURRENCY_NAME: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CURRENCY_ISO_CODE: {
        type: DataTypes.STRING(3),
        allowNull: false,
        unique: true
    },
    CURRENCY_SYMBOL: {
        type: DataTypes.STRING(5),
        allowNull: false
    }
}, {sequelize, timestamps: false});

