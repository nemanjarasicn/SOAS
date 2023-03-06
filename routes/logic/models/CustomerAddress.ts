import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";

export class CustomerAddress extends SoasModel {
    readonly type = ModelEnum.CustomerAddress
    declare ID: number
    declare ADDRESS_TYPE: string
    declare CUSTOMERS_NUMBER: string
    declare ADDRESS_CRYNAME: string
    declare ADDRESS_STREET: string
    declare ADDRESS_CITY: string
    declare ADDRESS_POSTCODE: string
    declare ADDRESS_ISO_CODE: string
    declare ADDRESS_COMMENT: string
    declare TAXCODE: string
    declare NAME_ADDR: string
    declare EMAIL: string
    declare PHONE: string
    declare ADDRESS_ID: string

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

CustomerAddress.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ADDRESS_TYPE: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        CUSTOMERS_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        ADDRESS_CRYNAME: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ADDRESS_STREET: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ADDRESS_CITY: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ADDRESS_POSTCODE: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ADDRESS_ISO_CODE: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        ADDRESS_COMMENT: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        TAXCODE: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        NAME_ADDR: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        EMAIL: {
            type: DataTypes.STRING(80),
            allowNull: false
        },
        PHONE: {
            type: DataTypes.STRING(80),
            allowNull: false
        },
        ADDRESS_ID: {
            type: DataTypes.STRING(5),
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'CUSTOMERS_ADDRESSES'
    }
);
