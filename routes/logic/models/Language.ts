import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {Currency} from "./Currency";

export class Language extends SoasModel {
    readonly type = ModelEnum.Language;
    declare LANGUAGE_CODE: string;
    declare LANGUAGE_NAME: string;
    declare LANGUAGE_ISO_ALPHA_2: string;
    declare LANGUAGE_ISO_ALPHA_3: string;
    declare CURRENCY_ID: number;

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

Language.init({
    LANGUAGE_CODE: {
        type: DataTypes.STRING(5),
        primaryKey: true
    },
    LANGUAGE_NAME: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    LANGUAGE_ISO_ALPHA_2: {
        type: DataTypes.STRING(2),
        allowNull: false,
        unique: true
    },
    LANGUAGE_ISO_ALPHA_3: {
        type: DataTypes.STRING(3),
        allowNull: false,
        unique: true
    },
    CURRENCY_ID: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {sequelize, timestamps: false});

Language.hasOne(Currency, {
    sourceKey: 'CURRENCY_ID',
    foreignKey: 'CURRENCY_ID'
});
