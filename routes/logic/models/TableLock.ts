import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {sequelize} from "./Database/DatabaseService";
import {DataTypes} from "sequelize";

export class TableLock extends SoasModel {
    readonly type = ModelEnum.TableLock
    declare ID: number
    declare TABLENAME: string
    declare LOCKED_BY: string
    declare LOCKED_SINCE: string
    declare LOCKED: number
    declare LOCKED_DATASET: string

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

TableLock.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        TABLENAME: {
            type: DataTypes.STRING,
            allowNull: false
        },
        LOCKED_BY: {
            type: DataTypes.STRING(2),
            allowNull: false
        },
        LOCKED: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        LOCKED_SINCE: {
            type: DataTypes.DATE,
            allowNull: false
        },
        LOCKED_DATASET: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'TABLELOCKS'
    }
);
