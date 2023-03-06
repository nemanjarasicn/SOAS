import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {SequelizeModel} from "../constants/constants";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {OrderPosition} from "./OrderPosition";
import {Order} from "./Order";

export class DeliveryNotePosition extends SoasModel {
    readonly type = ModelEnum.DeliveryNotePosition
    declare ID: number
    declare DELIVERY_NOTES_NUMBER: string
    declare ORDERS_NUMBER: string
    declare ITMNUM: string
    declare ORDER_QTY: number
    declare WEIGHT_PER: number
    declare DELIVERY_QTY: number
    declare ORDERS_POSITIONS_ID: number
    declare POSITION_ID: number
    declare CATEGORY_SOAS: string
    declare PARENT_LINE_ID: number
    declare POSITION_STATUS:number
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

DeliveryNotePosition.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        DELIVERY_NOTES_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: false
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
        WEIGHT_PER: {
            type: DataTypes.DECIMAL(19,5),
            allowNull: true
        },
        DELIVERY_QTY: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ORDERS_POSITIONS_ID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        POSITION_ID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        CATEGORY_SOAS: {
            type: DataTypes.STRING(5),
            allowNull: true
        },
        PARENT_LINE_ID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        POSITION_STATUS: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        TAX_AMOUNT: {
            type: DataTypes.DECIMAL(19,5),
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'DELIVERY_NOTES_POSITIONS'
    }
);

DeliveryNotePosition.hasOne(OrderPosition, {
    sourceKey: 'ORDERS_POSITIONS_ID',
    foreignKey: 'ID'
})
OrderPosition.belongsTo(DeliveryNotePosition, {
    targetKey: 'ORDERS_POSITIONS_ID',
    foreignKey: 'ID'
})

DeliveryNotePosition.hasOne(Order, {
    sourceKey: 'ORDERS_NUMBER',
    foreignKey: 'ORDERS_NUMBER'
});
Order.belongsTo(DeliveryNotePosition, {
    targetKey: 'ORDERS_NUMBER',
    foreignKey: 'ORDERS_NUMBER'
});
