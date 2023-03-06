import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {Attribute} from "./Attribute";
import {TaxCode} from "./TaxCode";

export class TaxationRelation extends SoasModel {
    readonly type = ModelEnum.TaxationRelation
    declare TAXATION_NAME: string
    declare TAXATION_RATE: number

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

TaxationRelation.init({
        TAXATION_NAME: {
            type: DataTypes.STRING(5),
            primaryKey: true,
            allowNull: false
        },
        TAXATION_RATE: {
            type: DataTypes.DECIMAL(16,7),
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'TAXATION_RELATIONS'
    }
);

TaxationRelation.hasOne(TaxCode, {
    sourceKey: 'TAXATION_NAME',
    foreignKey: 'TAXCODE'
})
TaxCode.belongsTo(TaxationRelation, {
    targetKey: 'TAXATION_NAME',
    foreignKey: 'TAXCODE'
})
