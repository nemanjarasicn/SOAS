import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {SequelizeModel} from "../constants/constants";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class User extends SoasModel {
    readonly type = ModelEnum.User
    declare USER_SOAS_ID: number
    declare USER_SOAS_NAME: string
    declare USER_SOAS_LOGIN: string
    declare USER_SOAS_PASSWD: number
    declare USER_ROLE: string
    declare USER_LANGUAGE: string

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

User.init({
        USER_SOAS_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        USER_SOAS_NAME: {
            type: DataTypes.STRING(55),
            allowNull: false
        },
        USER_SOAS_LOGIN: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        // ToDo: Is binary(32) as STRING ok?
        USER_SOAS_PASSWD: {
            type: DataTypes.STRING,
            allowNull: false
        },
        USER_ROLE: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        USER_LANGUAGE: {
            type: DataTypes.STRING(5),
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'USERS'
    }
);
