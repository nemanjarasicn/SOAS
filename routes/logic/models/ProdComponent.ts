import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {SequelizeModel} from "../constants/constants";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class ProdComponent extends SoasModel {
    readonly type = ModelEnum.ProdComponent
    declare ID: number
    declare ITMNUM: string
    declare COMPNUM: string
    declare PROD_QTY: number
    declare PROD_UNIT: string

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

ProdComponent.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ITMNUM: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        COMPNUM: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        PROD_QTY: {
            type: DataTypes.DECIMAL(18,6),
            allowNull: true
        },
        PROD_UNIT: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'PROD_COMPONENTS'
    }
);
