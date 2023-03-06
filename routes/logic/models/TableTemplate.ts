import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";

export class TableTemplate extends SoasModel {
    readonly type = ModelEnum.TableTemplate
    declare REF_TABLE: string
    declare TEMPLATE_FIELDS: string
    declare TABLE_NAME: string
    declare LOCKED_FIELDS: string
    declare RELATION_TABLE: string
    declare DETAIL_VIEW: string

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

TableTemplate.init(
    {
        REF_TABLE: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            autoIncrement: false
        },
        TEMPLATE_FIELDS: {
            type: DataTypes.STRING,
            allowNull: false
        },
        TABLE_NAME: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        LOCKED_FIELDS: {
            type: DataTypes.STRING,
            allowNull: true
        },
        RELATION_TABLE: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        DETAIL_VIEW: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'TABLE_TEMPLATES'
    });
