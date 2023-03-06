import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {sequelize} from "./Database/DatabaseService";
import {DataTypes} from "sequelize";
import {SaleOfferPosition} from "./SaleOfferPosition";
import {Customer} from "./Customer";

export class SaleOffer extends SoasModel {
    readonly type = ModelEnum.SaleOffer
    declare OFFER_NUMBER: string
    declare OFFER_DATE: string
    declare OFFER_ACCEPTED: number
    declare CLIENT: string
    declare ORDERS_TYPE: string
    declare PROJECT_FIELD_0: string
    declare PROJECT_FIELD_1: string
    declare PROJECT_FIELD_2: string
    declare CUSTOMER_ORDER: string
    declare ORDERAMOUNT_NET: number
    declare ORDERAMOUNT_BRU: number
    declare CURRENCY: string
    declare DISCOUNT: number
    declare SHIPPING_COSTS: number
    declare WAREHOUSE: string
    declare SALES_LOCATION: string
    declare COMMENT: string
    declare DISCOUNT_PERC: number

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

SaleOffer.init({
        OFFER_NUMBER: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            autoIncrement: false
        },
        OFFER_DATE: {
            type: DataTypes.DATE,
            allowNull: false
        },
        OFFER_ACCEPTED: {
            type: DataTypes.SMALLINT,
            allowNull: false
        },
        CLIENT: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        ORDERS_TYPE: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        PROJECT_FIELD_0: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        PROJECT_FIELD_1: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        PROJECT_FIELD_2: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        CUSTOMER_ORDER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        ORDERAMOUNT_NET: {
            type: DataTypes.DECIMAL(19,5),
            allowNull: false
        },
        ORDERAMOUNT_BRU: {
            type: DataTypes.DECIMAL(19,5),
            allowNull: false
        },
        CURRENCY: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        DISCOUNT: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        SHIPPING_COSTS: {
            type: DataTypes.DECIMAL(19,4),
            allowNull: false
        },
        WAREHOUSE: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        SALES_LOCATION: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        COMMENT: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        DISCOUNT_PERC: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'SALE_OFFERS'
    }
);

// ToDo: Check if OFFER_NUMBER is matching ORDERS_NUMBER at SaleOfferPosition.
SaleOffer.hasMany(SaleOfferPosition, {
    sourceKey: 'OFFER_NUMBER',
    foreignKey: 'ORDERS_NUMBER'
});
SaleOfferPosition.belongsTo(SaleOffer, {
    targetKey: 'OFFER_NUMBER',
    foreignKey: 'ORDERS_NUMBER'
});

SaleOffer.hasOne(Customer, {
    sourceKey: 'CUSTOMER_ORDER',
    foreignKey: 'CUSTOMERS_NUMBER'
});

