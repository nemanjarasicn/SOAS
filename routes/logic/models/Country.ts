import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";

export class Country extends SoasModel {
    readonly type = ModelEnum.Country;
    declare COUNTRY_ID: number;
    declare COUNTRY_NAME: string;
    declare COUNTRY_ISO_CODE: string;

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

Country.init({
    COUNTRY_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    COUNTRY_NAME: {
        type: DataTypes.STRING,
        allowNull: false
    },
    COUNTRY_ISO_CODE: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
}, {sequelize, timestamps: false});
