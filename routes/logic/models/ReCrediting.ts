import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {sequelize} from "./Database/DatabaseService";
import {DataTypes} from "sequelize";
import {ReCreditingPosition} from "./ReCreditingPosition";

export class ReCrediting extends SoasModel {
    readonly type = ModelEnum.ReCrediting
    declare RE_CREDITING_NUMBER: string
    declare RE_CREDITING_DATE: string
    declare RE_CREDITING_STATE: number
    declare RE_CREDITING_POSITIONS: string
    declare RE_CREDITING_CREATOR: string
    declare ORDERS_NUMBER: string
    declare DELIVERY_NOTES_NUMBER: string
    declare INVOICES_NUMBER: string
    declare INVOICES_DATE: string

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

ReCrediting.init({
        RE_CREDITING_NUMBER: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            autoIncrement: false
        },
        RE_CREDITING_DATE: {
            type: DataTypes.DATE,
            allowNull: false
        },
        RE_CREDITING_STATE: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        RE_CREDITING_POSITIONS: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        RE_CREDITING_CREATOR: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        ORDERS_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        DELIVERY_NOTES_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        INVOICES_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        INVOICES_DATE: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'RE_CREDITING'
    }
);

// ToDo: Check if RE_CREDITING_POSITIONS_NUMBER is ok as foreignKey
ReCrediting.hasMany(ReCreditingPosition, {
    sourceKey: 'RE_CREDITING_NUMBER',
    foreignKey: 'RE_CREDITING_POSITIONS_NUMBER'
})
ReCreditingPosition.belongsTo(ReCrediting, {
    targetKey: 'RE_CREDITING_NUMBER',
    foreignKey: 'RE_CREDITING_POSITIONS_NUMBER'
})
