import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {OrderPosition} from "./OrderPosition";
import {CustomerAddress} from "./CustomerAddress";
import {TaxCode} from "./TaxCode";
import {Customer} from "./Customer";
import {Currency} from "./Currency";
import {PaymentTerm} from "./PaymentTerm";

export class Order extends SoasModel {
    readonly type = ModelEnum.Order
    declare ORDERS_NUMBER: string
    declare CLIENT: string
    declare ORDERS_TYPE: string
    declare PROJECT_FIELD_0: string
    declare PROJECT_FIELD_1: string
    declare PROJECT_FIELD_2: string
    declare CUSTOMER_ORDER: string
    declare CUSTOMER_DELIVERY: string
    declare CUSTOMER_INVOICE: string
    declare ORDERS_DATE: string
    declare ORDERAMOUNT_NET: number
    declare ORDERAMOUNT_BRU: number
    declare CUSTOMER_ORDERREF: string
    declare LAST_DELIVERY: string
    declare LAST_INVOICE: string
    declare EDI_ORDERRESPONSE_SENT: boolean
    declare RELEASE: boolean
    declare PAYED: boolean
    declare CURRENCY: string
    declare ORDERS_STATE: number
    declare CUSTOMER_ADDRESSES_ID_DELIVERY: number
    declare CUSTOMER_ADDRESSES_ID_INVOICE: number
    declare PAYMENT_TERM_ID: string
    declare WEBSHOP_ID: number
    declare WEBSHOP_ORDER_REF: string
    declare DISCOUNT: number
    declare VOUCHER: number
    declare SHIPPING_COSTS: number
    declare WAREHOUSE: string
    declare SALES_LOCATION: string
    declare DELIVERY_METHOD: string
    declare COMMENT: string
    declare PAC_QTY: number
    declare DISCOUNT_PERC: number
    declare SUPPLY_ORDER_REFERENCE: string
    declare TAXCODE: string
    declare TAXRATE: string
    declare TAX_AMOUNT: number
    declare NET_ORDER: number
    declare ORDERAMOUNT_NET_POS: number
    declare ORDERAMOUNT_BRU_POS: number

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

Order.init({
    ORDERS_NUMBER: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        autoIncrement: false
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
        allowNull: true
    },
    PROJECT_FIELD_1: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    PROJECT_FIELD_2: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    CUSTOMER_ORDER: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    CUSTOMER_DELIVERY: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    CUSTOMER_INVOICE: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    ORDERS_DATE: {
        type: DataTypes.DATE,
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
    CUSTOMER_ORDERREF: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    LAST_DELIVERY: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    LAST_INVOICE: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    // ToDo: Is Bit as BOOLEAN ok?
    EDI_ORDERRESPONSE_SENT: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    RELEASE: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    PAYED: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    CURRENCY: {
        type: DataTypes.STRING(3),
        allowNull: true
    },
    ORDERS_STATE: {
        type: DataTypes.TINYINT,
        allowNull: true
    },
    CUSTOMER_ADDRESSES_ID_DELIVERY: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CUSTOMER_ADDRESSES_ID_INVOICE: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    PAYMENT_TERM_ID: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    WEBSHOP_ID: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    WEBSHOP_ORDER_REF: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    DISCOUNT: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    VOUCHER: {
        type: DataTypes.DECIMAL(19,4),
        allowNull: false
    },
    SHIPPING_COSTS: {
        type: DataTypes.DECIMAL(19,4),
        allowNull: false
    },
    WAREHOUSE: {
        type: DataTypes.STRING(3),
        allowNull: true
    },
    SALES_LOCATION: {
        type: DataTypes.STRING(3),
        allowNull: true
    },
    DELIVERY_METHOD: {
        type: DataTypes.STRING(6),
        allowNull: true
    },
    COMMENT: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    PAC_QTY: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    DISCOUNT_PERC: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    SUPPLY_ORDER_REFERENCE: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    TAXCODE: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    TAXRATE: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    TAX_AMOUNT: {
        type: DataTypes.DECIMAL(19,5),
        allowNull: true
    },
    NET_ORDER: {
        type: DataTypes.SMALLINT,
        allowNull: true
    },
    ORDERAMOUNT_NET_POS: {
        type: DataTypes.DECIMAL(19, 5),
        allowNull: false
    },
    ORDERAMOUNT_BRU_POS: {
        type: DataTypes.DECIMAL(19, 5),
        allowNull: false
    }
}, {sequelize, timestamps: false, tableName: 'ORDERS'});

Order.hasMany(OrderPosition, {
    sourceKey: 'ORDERS_NUMBER',
    foreignKey: 'ORDERS_NUMBER'
});
OrderPosition.belongsTo(Order, {
    targetKey: 'ORDERS_NUMBER',
    foreignKey: 'ORDERS_NUMBER'
});

Order.hasOne(TaxCode, {
    sourceKey: 'TAXCODE',
    foreignKey: 'TAXCODE'
});

Order.hasOne(Currency, {
    sourceKey: 'CURRENCY',
    foreignKey: 'CURRENCY_ID'
});

Order.hasOne(PaymentTerm, {
    sourceKey: 'PAYMENT_TERM_ID',
    foreignKey: 'PAYMENT_TERM_ID'
})
