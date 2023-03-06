import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {SequelizeModel} from "../constants/constants";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {Order} from "./Order";
import {DeliveryNotePosition} from "./DeliveryNotePosition";
import {Customer} from "./Customer";
import {Warehousing} from "./Warehousing";
import {TaxCode} from "./TaxCode";
import {Currency} from "./Currency";
import {PaymentTerm} from "./PaymentTerm";

export class DeliveryNote extends SoasModel {
    readonly type = ModelEnum.DeliveryNote
    declare DELIVERY_NOTES_NUMBER: string
    declare SHIPPING_DATE: string
    declare EXPORT_PRINT: boolean
    declare DELIVERY_NOTES_STATE: number
    declare RETOUR: boolean
    declare ORDERS_NUMBER: string
    declare PDF_CREATED_DATE: string
    declare PDF_DOWNLOAD_LINK: string
    declare CUSTOMERS_NUMBER: string
    declare RELEASE: boolean
    declare CURRENCY: string
    declare PARTLY_DELIVERY: boolean
    declare WAREHOUSE: string
    declare SALES_LOCATION: string
    declare TAXCODE: string
    declare TAXRATE: string
    declare TAX_AMOUNT: number
    declare NET_ORDER: number
    declare PAYMENT_TERM_ID: string

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

DeliveryNote.init({
        DELIVERY_NOTES_NUMBER: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            autoIncrement: false
        },
        SHIPPING_DATE: {
            type: DataTypes.DATE,
            allowNull: true
        },
        EXPORT_PRINT: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        DELIVERY_NOTES_STATE: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        RETOUR: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        ORDERS_NUMBER: {
            type: DataTypes.STRING(20),
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
        CUSTOMERS_NUMBER: {
            type: DataTypes.STRING(20),
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
        PARTLY_DELIVERY: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        WAREHOUSE: {
            type: DataTypes.STRING(3),
            allowNull: true
        },
        SALES_LOCATION: {
            type: DataTypes.STRING(3),
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
            type: DataTypes.DECIMAL(19, 5),
            allowNull: true
        },
        NET_ORDER: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        PAYMENT_TERM_ID: {
            type: DataTypes.STRING(15),
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'DELIVERY_NOTES'
    }
);

DeliveryNote.hasMany(DeliveryNotePosition, {
    sourceKey: 'DELIVERY_NOTES_NUMBER',
    foreignKey: 'DELIVERY_NOTES_NUMBER'
})
DeliveryNotePosition.belongsTo(DeliveryNote, {
    targetKey: 'DELIVERY_NOTES_NUMBER',
    foreignKey: 'DELIVERY_NOTES_NUMBER'
})

DeliveryNote.hasOne(Order, {
    sourceKey: 'ORDERS_NUMBER',
    foreignKey: 'ORDERS_NUMBER'
});

DeliveryNote.hasOne(Warehousing, {
    sourceKey: 'WAREHOUSE',
    foreignKey: 'WHLOC'
});

DeliveryNote.hasOne(TaxCode, {
    sourceKey: 'TAXCODE',
    foreignKey: 'TAXCODE'
});

DeliveryNote.hasOne(Currency, {
    sourceKey: 'CURRENCY',
    foreignKey: 'CURRENCY_ID'
});

DeliveryNote.hasOne(PaymentTerm, {
    sourceKey: 'PAYMENT_TERM_ID',
    foreignKey: 'PAYMENT_TERM_ID'
});
