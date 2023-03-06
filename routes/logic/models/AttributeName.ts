import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class AttributeName extends SoasModel {
    readonly type = ModelEnum.AttributeName
    declare ID: number
    declare ATTRIBUTE_NAME: string
    declare ATTRIBUTE_FIELD_TYPE: string
    declare ATTRIBUTE_DATA_TYPE: string

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

AttributeName.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ATTRIBUTE_NAME: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ATTRIBUTE_FIELD_TYPE: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        ATTRIBUTE_DATA_TYPE: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'ATTRIBUTE_NAMES'
    }
);
