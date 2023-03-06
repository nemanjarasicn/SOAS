import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {sequelize} from "./Database/DatabaseService";
import {DataTypes} from "sequelize";

export class ItmVariant extends SoasModel {
    readonly type = ModelEnum.ItmVariant
    declare ID: number
    declare ITMNUM: string
    declare ITMVARIANT: string
    declare ATTR_COLOR: string

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

ItmVariant.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ITMNUM: {
            type: DataTypes.STRING(55),
            // primaryKey: true,
            allowNull: false
        },
        ITMVARIANT: {
            type: DataTypes.STRING(55),
            allowNull: false
        },
        ATTR_COLOR: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'ITM_VARIANTS'
    }
);
