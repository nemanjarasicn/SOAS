import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";

export class ProdUnit extends SoasModel {
    readonly type = ModelEnum.ProdUnit;
    declare PROD_UNIT_NAME: string;
    declare PROD_UNIT_DESC: string;
    declare PROD_UNIT_SYMBOL: string;

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

ProdUnit.init({
    PROD_UNIT_NAME: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    PROD_UNIT_DESC: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    PROD_UNIT_SYMBOL: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, {sequelize, timestamps: false, tableName: 'PROD_UNITS'});


