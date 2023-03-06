import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class BatchProcess extends SoasModel {
    readonly type = ModelEnum.BatchProcess
    declare BATCH_NAME: string
    declare BATCH_DESCRIPTION: string
    declare BATCH_FUNCTION: string
    declare BATCH_INTERVAL: string
    declare BATCH_ACTIVE: boolean
    declare BATCH_LAST_RUN_START: string
    declare BATCH_LAST_RUN_FINISH: string
    declare BATCH_LAST_RUN_RESULT: string
    declare BATCH_CODE: string
    declare BATCH_CODE_REQUIRED: boolean
    declare BATCH_PARAMS: string

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

BatchProcess.init({
        BATCH_NAME: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            autoIncrement: false
        },
        BATCH_DESCRIPTION: {
            type: DataTypes.STRING,
            allowNull: false
        },
        BATCH_FUNCTION: {
            type: DataTypes.STRING,
            allowNull: false
        },
        BATCH_INTERVAL: {
            type: DataTypes.STRING,
            allowNull: false
        },
        BATCH_ACTIVE: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        BATCH_LAST_RUN_START: {
            type: DataTypes.DATE,
            allowNull: true
        },
        BATCH_LAST_RUN_FINISH: {
            type: DataTypes.DATE,
            allowNull: true
        },
        BATCH_LAST_RUN_RESULT: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        BATCH_CODE: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        BATCH_CODE_REQUIRED: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        BATCH_PARAMS: {
            type: DataTypes.STRING(200),
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'BATCH_PROCESSES'
    }
);
