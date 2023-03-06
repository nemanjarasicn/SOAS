import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class CrossSelling extends SoasModel {
    readonly type = ModelEnum.CrossSelling
    declare CROSSSELLING_ID: number
    declare CROSSSELLING_DATA: string

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

CrossSelling.init({
    CROSSSELLING_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CROSSSELLING_DATA: {
        // nvarchar(max) as TEXT: https://stackoverflow.com/a/45945889
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {sequelize, timestamps: false, tableName: 'CROSSSELLING'});
