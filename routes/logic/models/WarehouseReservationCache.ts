import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {SequelizeModel} from "../constants/constants";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class WarehouseReservationCache extends SoasModel {
    readonly type = ModelEnum.WarehouseReservationCache
    declare ID: number
    declare DOCUMENT_NUMBER: string
    declare ITMNUM: string
    declare ASSIGNED_QTY: number
    declare LOT: string
    declare LOC: string
    declare WAREHOUSE: string
    declare POSITION_ID: number
    declare ASSIGNMENT_DATE: string
    declare WAREHOUSING_ID: number
    declare ORDERS_POSITIONS_ID: number
    declare DELIVERY_NOTES_POSITIONS_ID: number

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

WarehouseReservationCache.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false
        },
        DOCUMENT_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        ITMNUM: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ASSIGNED_QTY: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        LOT: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        LOC: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        WAREHOUSE: {
            type: DataTypes.STRING(3),
            allowNull: true
        },
        POSITION_ID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ASSIGNMENT_DATE: {
            type: DataTypes.DATE,
            allowNull: false
        },
        WAREHOUSING_ID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ORDERS_POSITIONS_ID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        DELIVERY_NOTES_POSITIONS_ID: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'WAREHOUSE_RESERVATION_CACHE'
    }
);
