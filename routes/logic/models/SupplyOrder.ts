import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {sequelize} from "./Database/DatabaseService";
import {DataTypes} from "sequelize";
import {SupplyOrderPosition} from "./SupplyOrderPosition";

export class SupplyOrder extends SoasModel {
    readonly type = ModelEnum.SupplyOrder
    declare ID: number
    declare PROVIDERS_ORDER: string
    declare PROVIDER: string
    declare CLIENT_DELIVERY: string
    declare CLIENT_INVOICE: string
    declare ORDERAMOUNT_NET: number
    declare ORDERAMOUNT_BRU: number
    declare ORDERREF: string
    declare CURRENCY: string
    declare SHIPPING_COSTS: number
    declare WAREHOUSE: string
    declare ORDERS_DATE: string
    declare INTERCOMPANY: number

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

SupplyOrder.init({
        ID: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false
        },
        // ToDo: Do we need a "unique: true," here?
        PROVIDERS_ORDER: {
            type: DataTypes.STRING(15),
            primaryKey: true,
            autoIncrement: false,
            allowNull: false
        },
        PROVIDER: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        CLIENT_DELIVERY: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        CLIENT_INVOICE: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        ORDERAMOUNT_NET: {
            type: DataTypes.DECIMAL(19,5),
            allowNull: false
        },
        ORDERAMOUNT_BRU: {
            type: DataTypes.DECIMAL(19,5),
            allowNull: false
        },
        ORDERREF: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        CURRENCY: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        SHIPPING_COSTS: {
            type: DataTypes.DECIMAL(19,5),
            allowNull: false
        },
        WAREHOUSE: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        ORDERS_DATE: {
            type: DataTypes.DATE,
            allowNull: true
        },
        INTERCOMPANY: {
            type: DataTypes.SMALLINT,
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'SUPPLY_ORDERS'
    }
);

SupplyOrder.hasMany(SupplyOrderPosition, {
    sourceKey: 'PROVIDERS_ORDER',
    foreignKey: 'PROVIDERS_ORDER'
})
SupplyOrderPosition.belongsTo(SupplyOrder, {
    targetKey: 'PROVIDERS_ORDER',
    foreignKey: 'PROVIDERS_ORDER'
})
