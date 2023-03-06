import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {sequelize} from "./Database/DatabaseService";
import {DataTypes} from "sequelize";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";

export class Comment extends SoasModel {
    readonly type = ModelEnum.Comment
    declare COMMENTS_ID: number
    declare CUSTOMERS_NUMBER: string
    declare CONTACT_TYPE: string
    declare FIRST_CONTACT_DATE: string
    declare COMMENTS_STATE: number
    declare ORDERS_NUMBER: string
    declare CUSTOMER_COMMENTS: string
    declare AGENT_COMMENT: string
    declare UPDATE_DATE: string
    declare RELATED: number

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

Comment.init({
        COMMENTS_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        CUSTOMERS_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        CONNTACT_TYPE: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        FIRST_CONNTACT_DATE: {
            type: DataTypes.DATE,
            allowNull: false
        },
        COMMENTS_STATE: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ORDERS_NUMBER: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        CUSTOMER_COMMENTS: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        AGENT_COMMENT: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        UPDATE_DATE: {
            type: DataTypes.DATE,
            allowNull: true
        },
        RELATED: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'COMMENTS'
    }
);
