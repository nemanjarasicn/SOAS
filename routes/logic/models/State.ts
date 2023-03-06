import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class State extends SoasModel {
    readonly type = ModelEnum.State
    declare STATES_ID: number
    declare STATES_NAME: string
    declare STATES_COMMENT: string
    declare STATES_ACTIVE: boolean
    declare STATES_TYPE: string

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

State.init({
        STATES_ID: {
            type: DataTypes.TINYINT,
            primaryKey: true,
            autoIncrement: false,
            allowNull: false
        },
        STATES_NAME: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        STATES_COMMENT: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        STATES_ACTIVE: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        STATES_TYPE: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            autoIncrement: false,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'STATES'
    }
);
