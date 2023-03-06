import {getData, ModelEnum, setData, updateData} from "./Helper";
import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {Order} from "./Order";
import {DeliveryNotePosition} from "./DeliveryNotePosition";
import {DeliveryNote} from "./DeliveryNote";
import {Currency} from "./Currency";

export class InvoicePosition extends SoasModel {
    readonly type = ModelEnum.InvoicePosition
    declare ID: number
    declare INVOICES_NUMBER: string
    declare ORDERS_NUMBER: string
    declare DELIVERY_NOTES_NUMBER: string
    declare ITMNUM: string
    declare ORDER_QTY: number
    declare DELIVERY_QTY: number
    declare PRICE_NET: number
    declare PRICE_BRU: number
    declare CURRENCY: string
    declare DELIVERY_NOTES_POSITIONS_ID: number
    declare POSITION_ID: number
    declare CATEGORY_SOAS: string
    declare PARENT_LINE_ID: number
    declare POSITION_STATUS: number
    declare ITMDES: string
    declare SALES_LOCATION: string
    declare TAX_AMOUNT: number

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

InvoicePosition.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        INVOICES_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        ORDERS_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        DELIVERY_NOTES_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        ITMNUM: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ORDER_QTY: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        DELIVERY_QTY: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        PRICE_NET: {
            type: DataTypes.DECIMAL(19,5),
            allowNull: false
        },
        PRICE_BRU: {
            type: DataTypes.DECIMAL(19,5),
            allowNull: false
        },
        CURRENCY: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        DELIVERY_NOTES_POSITIONS_ID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        POSITION_ID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        CATEGORY_SOAS: {
            type: DataTypes.STRING(5),
            allowNull: true
        },
        PARENT_LINE_ID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        POSITION_STATUS: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ITMDES: {
            type: DataTypes.STRING(512),
            allowNull: true
        },
        SALES_LOCATION: {
            type: DataTypes.STRING(3),
            allowNull: true
        },
        TAX_AMOUNT: {
            type: DataTypes.DECIMAL(19,5),
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'INVOICES_POSITIONS'
    }
);

InvoicePosition.hasOne(DeliveryNotePosition, {
    sourceKey: 'DELIVERY_NOTES_POSITIONS_ID',
    foreignKey: 'ID'
})
DeliveryNotePosition.belongsTo(InvoicePosition, {
    targetKey: 'DELIVERY_NOTES_POSITIONS_ID',
    foreignKey: 'ID'
})

// InvoicePosition.hasOne(Invoice, {
//     sourceKey: 'INVOICES_NUMBER',
//     foreignKey: 'INVOICES_NUMBER'
// });
// Invoice.belongsTo(InvoicePosition, {
//     targetKey: 'INVOICES_NUMBER',
//     foreignKey: 'INVOICES_NUMBER'
// });

InvoicePosition.hasOne(Order, {
    sourceKey: 'ORDERS_NUMBER',
    foreignKey: 'ORDERS_NUMBER'
});
Order.belongsTo(InvoicePosition, {
    targetKey: 'ORDERS_NUMBER',
    foreignKey: 'ORDERS_NUMBER'
});

InvoicePosition.hasOne(DeliveryNote, {
    sourceKey: 'DELIVERY_NOTES_NUMBER',
    foreignKey: 'DELIVERY_NOTES_NUMBER'
});
DeliveryNote.belongsTo(InvoicePosition, {
    targetKey: 'DELIVERY_NOTES_NUMBER',
    foreignKey: 'DELIVERY_NOTES_NUMBER'
});

InvoicePosition.hasOne(Currency, {
    sourceKey: 'CURRENCY',
    foreignKey: 'CURRENCY_ID'
});
Currency.belongsTo(InvoicePosition, {
    targetKey: 'CURRENCY',
    foreignKey: 'CURRENCY_ID'
});
