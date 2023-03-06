import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {sequelize} from "./Database/DatabaseService";
import {DataTypes} from "sequelize";
import {Company} from "./Company";

export class CompanyLocation extends SoasModel {
    readonly type = ModelEnum.CompanyLocation
    declare COMPANY: number
    declare LOCATION: number
    declare DESCRIPTION: string
    declare IS_SALES_LOCATION: number
    declare IS_WAREHOUSE_LOCATION: number
    declare STREET: string
    declare POSTCODE: string
    declare CITY: string
    declare COUNTRY_ISO_CODE: string

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

CompanyLocation.init({
        LOCATION: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false
        },
        COMPANY: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        DESCRIPTION: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        IS_SALES_LOCATION: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        IS_WAREHOUSE_LOCATION: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        STREET: {
            type: DataTypes.STRING,
            allowNull: false
        },
        POSTCODE: {
            type: DataTypes.STRING,
            allowNull: false
        },
        CITY: {
            type: DataTypes.STRING,
            allowNull: false
        },
        COUNTRY_ISO_CODE: {
            type: DataTypes.STRING(5),
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'COMPANIES_LOCATIONS'
    }
);
