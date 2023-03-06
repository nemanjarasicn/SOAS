import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {SequelizeModel} from "../constants/constants";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class Prilist extends SoasModel {
    readonly type = ModelEnum.Prilist
    declare ID: number
    declare ITMNUM: string
    declare PRICE_NET: number
    declare PRICE_BRU: number
    declare CURRENCY: string
    declare PRILIST: string
    declare CUSGRP: string
    declare START_DATE: string
    declare END_DATE: string
    declare PRIORITY: number

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

Prilist.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ITMNUM: {
            type: DataTypes.STRING,
            allowNull: false
        },
        PRICE_NET: {
            type: DataTypes.DECIMAL(19, 5),
            allowNull: false
        },
        PRICE_BRU: {
            type: DataTypes.DECIMAL(19, 5),
            allowNull: true
        },
        CURRENCY: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        PRILIST: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        CUSGRP: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        START_DATE: {
            type: DataTypes.DATE,
            allowNull: true
        },
        END_DATE: {
            type: DataTypes.DATE,
            allowNull: true
        },
        PRIORITY: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'PRILISTS'
    }
);
