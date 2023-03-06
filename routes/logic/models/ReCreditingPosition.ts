import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {sequelize} from "./Database/DatabaseService";
import {DataTypes} from "sequelize";

export class ReCreditingPosition extends SoasModel {
    readonly type = ModelEnum.ReCreditingPosition
    declare ID: number
    declare RE_CREDITING_POSITIONS_NUMBER: string
    declare INVOICES_NUMBER: string
    declare INVIOCES_POSITIONS_NUMBER: string
    declare ITMNUM: string
    declare ORDER_QTY: number
    declare DELIVERY_QTY: number
    declare PRICE_PER: number
    declare CURRENCY: string

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

ReCreditingPosition.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        RE_CREDITING_POSITIONS_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        INVOICES_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        // ToDo: Rename column in db to INVOICES_POSITIONS_NUMBER
        INVIOCES_POSITIONS_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        ITMNUM: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ORDER_QTY: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        DELIVERY_QTY: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        PRICE_PER: {
            type: DataTypes.DECIMAL(15, 4),
            allowNull: false
        },
        CURRENCY: {
            type: DataTypes.STRING(3),
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'RE_CREDITING_POSITIONS'
    }
);
