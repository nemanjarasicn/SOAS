import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";

export class Provider extends SoasModel {
    readonly type = ModelEnum.Provider;
    declare PROVIDERS_NUMBER: string;
    declare PROVIDERS_NAME: string;
    declare PROVIDERS_COUNTRY: string;
    declare LANGUAGE: string;
    declare TAX_NUMBER: string;
    declare EU_UST_IDNR: string;
    declare CURRENCY: number;
    declare AUTO_COMPLETE_ORDERS: boolean; // number

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

Provider.init({
    PROVIDERS_NUMBER: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    PROVIDERS_NAME: {
        type: DataTypes.STRING,
        allowNull: false
    },
    PROVIDERS_COUNTRY: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    LANGUAGE: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    TAX_NUMBER: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    EU_UST_IDNR: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    CURRENCY: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    AUTO_COMPLETE_ORDERS: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {sequelize, timestamps: false});
