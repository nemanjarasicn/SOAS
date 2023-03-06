import {IGetParams, IPostParams, SoasModel, IPutParams} from "./SoasModel";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {SequelizeModel} from "../constants/constants";
import {sequelize} from "./Database/DatabaseService";
import {DataTypes} from "sequelize";

export class Warehousing extends SoasModel {
    readonly type = ModelEnum.Warehousing;
    // id can be undefined during creation when id field is set `autoIncrement` true
    declare ID: number;
    declare WHLOC: string;
    declare ITMNUM: string;
    declare LOT: string;
    declare LOC: string;
    declare STATUS_POS: string;
    declare QTY: number;
    declare RESERVED: number;
    declare UPDATE_LOC: string;

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

Warehousing.init({
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    WHLOC: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    ITMNUM: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    LOT: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    LOC: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    STATUS_POS: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    QTY: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RESERVED: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    UPDATE_LOC: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    hooks: {
        // set UPDATE_LOC date before create or update query execution
        beforeCreate: (record, options) => {
            record.UPDATE_LOC = new Date().toISOString();
        },
        beforeUpdate : (record, options) => {
            record.UPDATE_LOC = new Date().toISOString();
        }
    },
    sequelize,
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    paranoid: false,
    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: false,
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
    // define the table's name
    tableName: 'WAREHOUSING'
});
