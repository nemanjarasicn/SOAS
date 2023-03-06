import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {sequelize} from "./Database/DatabaseService";
import {DataTypes} from "sequelize";
import {CompanyLocation} from "./CompanyLocation";

export class Company extends SoasModel {
    readonly type = ModelEnum.Company
    declare COMPANY: number
    declare DESCRIPTION: string
    declare ACTIVE: number
    declare INTERCOMPANY: number
    declare INTERCOMPANY_CONNECTION: number

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

Company.init({
        COMPANY: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            autoIncrement: false
        },
        DESCRIPTION: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        ACTIVE: {
            type: DataTypes.SMALLINT,
            allowNull: false
        },
        INTERCOMPANY: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        INTERCOMPANY_CONNECTION: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'COMPANIES'
    }
);

Company.hasMany(CompanyLocation, {
    sourceKey: 'COMPANY',
    foreignKey: 'COMPANY'
});
CompanyLocation.belongsTo(Company, {
    targetKey: 'COMPANY',
    foreignKey: 'COMPANY'
});


