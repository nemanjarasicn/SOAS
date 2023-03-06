import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {SequelizeModel} from "../constants/constants";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class OrderPosition extends SoasModel {
    readonly type = ModelEnum.OrderPosition
    declare ID: number
    declare ORDERS_NUMBER: string
    declare ITMNUM: string
    declare ORDER_QTY: number
    declare ASSIGNED_QTY: number
    declare PRICE_NET: number
    declare PRICE_BRU: number
    declare CURRENCY: string
    declare POSITION_STATUS: number
    declare POSITION_ID: number
    declare CATEGORY_SOAS: string
    declare PARENT_LINE_ID: number
    declare DELIVERED_QTY: number
    declare ITMDES: string
    declare WAREHOUSE: string
    declare DIST_COMPONENTS_ID: number
    declare TAX_AMOUNT: number

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

OrderPosition.init({
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ORDERS_NUMBER: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    ITMNUM: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ORDER_QTY: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ASSIGNED_QTY: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    PRICE_NET: {
        type: DataTypes.DECIMAL(19, 5),
        allowNull: false
    },
    PRICE_BRU: {
        type: DataTypes.DECIMAL(19, 5),
        allowNull: false
    },
    CURRENCY: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    POSITION_STATUS: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    POSITION_ID: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    // ToDo: Check if 'allowNull: true' is ok
    CATEGORY_SOAS: {
        type: DataTypes.STRING(5),
        allowNull: true
    },
    PARENT_LINE_ID: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    DELIVERED_QTY: {
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
    },
    TAX_AMOUNT: {
        type: DataTypes.DECIMAL(19, 5),
        allowNull: true
    }
}, {sequelize, timestamps: false, tableName: 'ORDERS_POSITIONS'});
