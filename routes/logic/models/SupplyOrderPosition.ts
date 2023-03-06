import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {sequelize} from "./Database/DatabaseService";
import {DataTypes} from "sequelize";

export class SupplyOrderPosition extends SoasModel {
    readonly type = ModelEnum.SupplyOrderPosition
    declare ID: number
    declare PROVIDERS_ORDER: string
    declare ITMNUM: string
    declare ORDER_QTY: number
    declare PRICE_NET: number
    declare PRICE_BRU: number
    declare SCHEDULED_ARRIVAL: string
    declare SUPPLIED_QTY: number
    declare WAREHOUSE: string

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

SupplyOrderPosition.init({
        ID: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        PROVIDERS_ORDER: {
            type: DataTypes.STRING(15),
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
        PRICE_NET: {
            type: DataTypes.DECIMAL(19, 5),
            allowNull: false
        },
        PRICE_BRU: {
            type: DataTypes.DECIMAL(19, 5),
            allowNull: false
        },
        SCHEDULED_ARRIVAL: {
            type: DataTypes.STRING,
            allowNull: false
        },
        SUPPLIED_QTY: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        WAREHOUSE: {
            type: DataTypes.STRING(3),
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'SUPPLY_ORDERS_POSITIONS'
    }
);
