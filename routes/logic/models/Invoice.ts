import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {Order} from "./Order";
import {DeliveryNote} from "./DeliveryNote";
import {InvoicePosition} from "./InvoicePosition";
import {Currency} from "./Currency";
import {PaymentTerm} from "./PaymentTerm";

export class Invoice extends SoasModel {
    readonly type = ModelEnum.Invoice
    declare INVOICES_NUMBER: string
    declare INVOICES_CUSTOMER: string
    declare INVOICES_DATE: string
    declare INVOICES_CREATOR: string
    declare INVOICES_UPDATE: string
    declare INVOICES_STATE: number
    declare PAYMENT_TERM_ID: string
    declare DELIVERY_NOTES_NUMBER: string
    declare ORDERS_NUMBER: string
    declare PAYED: boolean
    declare PDF_CREATED_DATE: string
    declare PDF_DOWNLOAD_LINK: string
    declare RELEASE: boolean
    declare CURRENCY: string
    declare PARTLY_INVOICE: boolean
    declare WAREHOUSE: string
    declare SALES_LOCATION: string
    declare TAXCODE: string
    declare TAX_AMOUNT: number
    declare NET_ORDER: number
    declare TAXRATE: string
    declare CUSTOMER_ADDRESSES_ID_DELIVERY: number
    declare CUSTOMER_ADDRESSES_ID_INVOICE: number
    declare INVOICES_AMOUNT_BRU: number
    declare INVOICES_AMOUNT_NET: number

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

Invoice.init({
        INVOICES_NUMBER: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            autoIncrement: false
        },
        INVOICES_CUSTOMER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        INVOICES_DATE: {
            type: DataTypes.DATE,
            allowNull: false
        },
        INVOICES_CREATOR: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        INVOICES_UPDATE: {
            type: DataTypes.STRING(5),
            allowNull: true
        },
        INVOICES_STATE: {
            type: DataTypes.TINYINT,
            allowNull: true
        },
        PAYMENT_TERM_ID: {
            type: DataTypes.STRING(14),
            allowNull: true
        },
        DELIVERY_NOTES_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        ORDERS_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        PAYED: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        PDF_CREATED_DATE: {
            type: DataTypes.DATE,
            allowNull: true
        },
        PDF_DOWNLOAD_LINK: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        RELEASE: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        CURRENCY: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        PARTLY_INVOICE: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        WAREHOUSE: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        SALES_LOCATION: {
            type: DataTypes.STRING(3),
            allowNull: true
        },
        TAXCODE: {
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
        TAXRATE: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        CUSTOMER_ADDRESSES_ID_DELIVERY: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        CUSTOMER_ADDRESSES_ID_INVOICE: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        INVOICES_AMOUNT_BRU: {
            type: DataTypes.DECIMAL(19,5),
            allowNull: true
        },
        INVOICES_AMOUNT_NET: {
            type: DataTypes.DECIMAL(19,5),
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'INVOICES'
    }
);

Invoice.hasMany(InvoicePosition, {
    sourceKey: 'INVOICES_NUMBER',
    foreignKey: 'INVOICES_NUMBER'
})
InvoicePosition.belongsTo(Invoice, {
    targetKey: 'INVOICES_NUMBER',
    foreignKey: 'INVOICES_NUMBER'
})

Invoice.hasOne(Order, {
    sourceKey: 'ORDERS_NUMBER',
    foreignKey: 'ORDERS_NUMBER'
});

Invoice.hasOne(DeliveryNote, {
    sourceKey: 'DELIVERY_NOTES_NUMBER',
    foreignKey: 'DELIVERY_NOTES_NUMBER'
});

Invoice.hasOne(Currency, {
    sourceKey: 'CURRENCY',
    foreignKey: 'CURRENCY_ID'
});

Invoice.hasOne(PaymentTerm, {
    sourceKey: 'PAYMENT_TERM_ID',
    foreignKey: 'PAYMENT_TERM_ID'
});
