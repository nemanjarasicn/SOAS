import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class TaxRate extends SoasModel {
    readonly type = ModelEnum.TaxRate
    declare ID: number
    declare TAXCODE: string
    declare PER_START: string
    declare PER_END: string
    declare TAXRATE: string

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

TaxRate.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        TAXCODE: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        PER_START: {
            type: DataTypes.DATE,
            allowNull: false
        },
        PER_END: {
            type: DataTypes.DATE,
            allowNull: true
        },
        TAXRATE: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'TAXRATES'
    }
);
