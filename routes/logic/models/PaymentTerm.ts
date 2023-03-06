import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class PaymentTerm extends SoasModel {
    readonly type = ModelEnum.PaymentTerm
    declare PAYMENT_TERM_ID: string
    declare PAYMENT_TERM_NAME: string
    declare PAYMENT_TERM_COMMENT: string
    declare PAYMENT_TERM_ACTIVE: boolean
    declare PAYMENT_CONFIRMED: boolean

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

PaymentTerm.init({
        PAYMENT_TERM_ID: {
            type: DataTypes.STRING(14),
            primaryKey: true,
            autoIncrement: false
        },
        PAYMENT_TERM_NAME: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        PAYMENT_TERM_COMMENT: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        PAYMENT_TERM_ACTIVE: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        PAYMENT_CONFIRMED: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'PAYMENT_TERMS'
    }
);
