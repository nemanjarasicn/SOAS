import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {sequelize} from "./Database/DatabaseService";
import {DataTypes} from "sequelize";

export class ItemLock extends SoasModel {
    readonly type = ModelEnum.ItemLock
    declare ID: number
    declare ITEM: string
    declare DATE: string
    declare UPDATER: string
    declare REFTABLE: string

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

ItemLock.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ITEM: {
            type: DataTypes.STRING,
            allowNull: false
        },
        DATE: {
            type: DataTypes.DATE,
            allowNull: false
        },
        UPDATER: {
            type: DataTypes.STRING,
            allowNull: false
        },
        REFTABLE: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'ITEM_LOCKS'
    }
);
