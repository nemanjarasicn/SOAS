import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class LocalizeIt extends SoasModel {
    readonly type = ModelEnum.LocalizeIt
    declare LOCALIZE_TAG: string
    declare DE_DE: string
    declare EN_US: string

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

LocalizeIt.init({
        LOCALIZE_TAG: {
            type: DataTypes.STRING(250),
            primaryKey: true,
            allowNull: false
        },
        DE_DE: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        EN_US: {
            type: DataTypes.STRING(250),
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'LOCALIZE_IT'
    }
);

