import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class PurchaseOrder extends SoasModel {
    readonly type = ModelEnum.PurchaseOrder
    declare PURCHASE_NUMBER: string
    declare PURCHASE_DATE: string
    declare PURCHASE_AMOUNT_NET: number
    declare PURCHASE_AMOUNT_BRU: number
    declare CURRENCY: string
    declare PAYMENT_METHOD: string
    declare RELEASE: boolean
    declare PAYED: boolean

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

PurchaseOrder.init({
        PURCHASE_NUMBER: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        PURCHASE_DATE: {
            type: DataTypes.DATE,
            allowNull: false
        },
        PURCHASE_AMOUNT_NET: {
            type: DataTypes.DECIMAL(12, 4),
            allowNull: false
        },
        PURCHASE_AMOUNT_BRU: {
            type: DataTypes.DECIMAL(12, 4),
            allowNull: true
        },
        CURRENCY: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        PAYMENT_METHOD: {
            type: DataTypes.STRING(12),
            allowNull: true
        },
        RELEASE: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        PAYED: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'PURCHASE_ORDERS'
    }
);
