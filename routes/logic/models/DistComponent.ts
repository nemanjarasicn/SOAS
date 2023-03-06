import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {getData, ModelEnum, setData,updateData} from "./Helper";
import {SequelizeModel} from "../constants/constants";
import {sequelize} from "./Database/DatabaseService";
import {DataTypes} from "sequelize";
import {Article} from "./Article";

export class DistComponent extends SoasModel {
    readonly type = ModelEnum.DistComponent;
    declare ID: number;
    declare ITMNUM: string;
    declare COMPNUM: string;
    declare DIST_QTY: number;

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

DistComponent.init({
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ITMNUM: {
        type: DataTypes.STRING,
        allowNull: false
    },
    COMPNUM: {
        type: DataTypes.STRING,
        allowNull: false
    },
    DIST_QTY: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
    timestamps: false,
    tableName: 'DIST_COMPONENTS'
});
