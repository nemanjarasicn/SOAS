import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {sequelize} from "./Database/DatabaseService";
import {DataTypes} from "sequelize";

export class SaleOfferPosition extends SoasModel {
    readonly type = ModelEnum.SaleOfferPosition
    declare ID: number
    declare ORDERS_NUMBER: string
    declare ITMNUM: string
    declare ORDER_QTY: number
    declare PRICE_NET: number
    declare PRICE_BRU: number
    declare CURRENCY: string
    declare POSITION_ID: number
    declare CATEGORY_SOAS: string
    declare PARENT_LINE_ID: number
    declare ITMDES: string
    declare WAREHOUSE: string
    declare DIST_COMPONENTS_ID: number

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

SaleOfferPosition.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false
        },
        ORDERS_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        ITMNUM: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        ORDER_QTY: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        PRICE_NET: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        PRICE_BRU: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        CURRENCY: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        POSITION_ID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        CATEGORY_SOAS: {
            type: DataTypes.STRING(5),
            allowNull: true
        },
        PARENT_LINE_ID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ITMDES: {
            type: DataTypes.STRING(512),
            allowNull: true
        },
        WAREHOUSE: {
            type: DataTypes.STRING(3),
            allowNull: true
        },
        DIST_COMPONENTS_ID: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'SALE_OFFERS_POSITIONS'
    }
);
