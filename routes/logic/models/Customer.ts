import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {SequelizeModel} from "../constants/constants";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {CustomerAddress} from "./CustomerAddress";
import {Order} from "./Order";
import {Language} from "./Language";


export class Customer extends SoasModel {
    readonly type = ModelEnum.Customer
    declare CUSTOMERS_NUMBER: string
    declare CUSTOMERS_PRENAME: string
    declare CUSTOMERS_NAME: string
    declare CUSTOMERS_COMPANY: string
    declare CUSTOMERS_TYPE: string
    declare EEC_NUM: string
    declare LANGUAGE: string
    declare EDI_INVOIC: boolean
    declare EDI_ORDERSP: boolean
    declare EDI_DESADV: boolean
    declare CREATE_DATE: string
    declare CUSTOMERS_EMAIL: string
    declare CUSTOMERS_PHONE: string
    declare EMAIL_RG: string
    declare EMAIL_LI: string
    declare EMAIL_AU: string
    declare PHONE_0: string
    declare PHONE_1: string
    declare FAX_0: string
    declare MOB_0: string
    declare MOB_1: string
    declare CRNNUM: string
    declare PAYMENT_TERM_ID: string
    declare EMAIL: string
    declare DIFFERENT_DLV_NAME_0: string
    declare DIFFERENT_DLV_NAME_1: string

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

Customer.init({
        CUSTOMERS_NUMBER: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            autoIncrement: false
        },
        CUSTOMERS_PRENAME: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CUSTOMERS_NAME: {
            type: DataTypes.STRING,
            allowNull: false
        },
        CUSTOMERS_COMPANY: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CUSTOMERS_TYPE: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        EEC_NUM: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        LANGUAGE: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        EDI_INVOIC: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        EDI_ORDERSP: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        EDI_DESADV: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        CREATE_DATE: {
            type: DataTypes.DATE,
            allowNull: false
        },
        CUSTOMERS_EMAIL: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CUSTOMERS_PHONE: {
            type: DataTypes.STRING,
            allowNull: true
        },
        EMAIL_RG: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        EMAIL_LI: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        EMAIL_AU: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        PHONE_0: {
            type: DataTypes.STRING,
            allowNull: true
        },
        PHONE_1: {
            type: DataTypes.STRING,
            allowNull: true
        },
        FAX_0: {
            type: DataTypes.STRING,
            allowNull: true
        },
        MOB_0: {
            type: DataTypes.STRING,
            allowNull: true
        },
        MOB_1: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CRNNUM: {
            type: DataTypes.STRING(55),
            allowNull: true
        },
        PAYMENT_TERM_ID: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        EMAIL: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        DIFFERENT_DLV_NAME_0: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        DIFFERENT_DLV_NAME_1: {
            type: DataTypes.STRING(80),
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'CUSTOMERS'
    }
);

Customer.hasMany(CustomerAddress, {
    sourceKey: 'CUSTOMERS_NUMBER',
    foreignKey: 'CUSTOMERS_NUMBER'
});
CustomerAddress.belongsTo(Customer, {
    targetKey: 'CUSTOMERS_NUMBER',
    foreignKey: 'CUSTOMERS_NUMBER'
});

Customer.hasOne(Language, {
    sourceKey: 'LANGUAGE',
    foreignKey: 'LANGUAGE_ISO_ALPHA_3'
});
