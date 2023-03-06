import {IGetParams, IPostParams, IPutParams, SoasModel} from "./SoasModel";
import {SequelizeModel} from "../constants/constants";
import {getData, ModelEnum, setData, updateData} from "./Helper";
import {DataTypes} from "sequelize";
import {sequelize} from "./Database/DatabaseService";
import {CrossSelling} from "./CrossSelling";
import { Attribute } from "./Attribute";

export class Article extends SoasModel {
    readonly type = ModelEnum.Article
    declare ID: number
    declare ITMNUM: string
    declare ITMDES: string
    declare ITMDES_UC: string
    declare EANCOD: string
    declare CATEGORY_SOAS: string
    declare ART_LENGTH: number
    declare ART_WIDTH: number
    declare ART_HEIGHT: number
    declare PACK_LENGTH: number
    declare PACK_WIDTH: number
    declare PACK_HEIGHT: number
    declare ITMWEIGHT: number
    declare ACTIVE_FLG: boolean
    declare CROSSSELLING: number
    declare CROSSSELLING_FLG: boolean
    declare RAW_FLG: boolean
    declare WAREHOUSE_MANAGED: boolean

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

Article.init({
    ID: {
        type: DataTypes.INTEGER,
        // primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    ITMNUM: {
        type: DataTypes.STRING,
        unique: true,
        autoIncrement: false,
        allowNull: false
    },
    ITMDES: {
        type: DataTypes.STRING(512),
        allowNull: false
    },
    ITMDES_UC: {
        type: DataTypes.STRING(512),
        allowNull: false
    },
    EANCOD: {
        type: DataTypes.STRING(13),
        allowNull: false
    },
    CATEGORY_SOAS: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    ART_LENGTH: {
        type: DataTypes.DECIMAL(18,4),
        allowNull: false
    },
    ART_WIDTH: {
        type: DataTypes.DECIMAL(18,4),
        allowNull: false
    },
    ART_HEIGHT: {
        type: DataTypes.DECIMAL(18,4),
        allowNull: false
    },
    PACK_LENGTH: {
        type: DataTypes.DECIMAL(18,4),
        allowNull: false
    },
    PACK_WIDTH: {
        type: DataTypes.DECIMAL(18,4),
        allowNull: false
    },
    PACK_HEIGHT: {
        type: DataTypes.DECIMAL(18,4),
        allowNull: false
    },
    ITMWEIGHT: {
        type: DataTypes.DECIMAL(18,4),
        allowNull: false
    },
    ACTIVE_FLG: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    CROSSSELLING: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CROSSSELLING_FLG: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    RAW_FLG: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    WAREHOUSE_MANAGED: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {sequelize, timestamps: false, tableName: 'ITEM_BASIS'});

// Relation has to be defined both ways:

// Article -> CrossSelling
Article.hasOne(CrossSelling, {
    sourceKey: 'CROSSSELLING',
    foreignKey: 'CROSSSELLING_ID'
});
// CrossSelling -> Article
CrossSelling.belongsTo(Article, {
    targetKey: 'CROSSSELLING',
    foreignKey: 'CROSSSELLING_ID'
});

Article.hasMany(Attribute, {
    sourceKey: 'ID',
    foreignKey: 'ITM_BASIS_ID'
});

Attribute.belongsTo(Article, {
    targetKey: 'ID',
    foreignKey: 'ITM_BASIS_ID'
});

