import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {SequelizeModel} from "../constants/constants";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {AttributeName} from "./AttributeName";

export class Attribute extends SoasModel {
    readonly type = ModelEnum.Attribute
    declare ID: number
    declare ATTRIBUTE_NAME: string
    declare ATTRIBUTE_DATA: string
    declare ITM_BASIS_ID: number

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

Attribute.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ATTRIBUTE_NAME: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ATTRIBUTE_DATA: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ITM_BASIS_ID: {
            type: DataTypes.NUMBER,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'ATTRIBUTES'
    }
);

Attribute.hasOne(AttributeName, {
    sourceKey: 'ATTRIBUTE_NAME',
    foreignKey: 'ATTRIBUTE_NAME'
})
AttributeName.belongsTo(Attribute, {
    targetKey: 'ATTRIBUTE_NAME',
    foreignKey: 'ATTRIBUTE_NAME'
})
