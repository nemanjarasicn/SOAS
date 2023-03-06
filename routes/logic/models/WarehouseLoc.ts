import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";

export class WarehouseLoc extends SoasModel {
    readonly type = ModelEnum.WarehouseLoc;
    declare ID: number;
    declare LOC: string;
    declare WHLOC: string;
    declare STATUS_POS: string;
    declare VIRTUAL_LOC: boolean;

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

WarehouseLoc.init({
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    LOC: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    WHLOC: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    STATUS_POS: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    VIRTUAL_LOC: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {sequelize, timestamps: false, tableName: 'WAREHOUSE_LOC'});
