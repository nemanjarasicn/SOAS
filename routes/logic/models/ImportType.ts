import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {sequelize} from "./Database/DatabaseService";
import {DataTypes} from "sequelize";

export class ImportType extends SoasModel {
    readonly type = ModelEnum.ImportType
    declare ID: number
    declare IMPORT_TYPE_NAME: string
    declare ACTIVE: number
    declare CREATED: string
    declare CREATED_FROM: string

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

ImportType.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        IMPORT_TYPE_NAME: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        ACTIVE: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        CREATED: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CREATED_FROM: {
            type: DataTypes.STRING(3),
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'IMPORT_TYPE',
        modelName: 'ImportType'
    }
);
