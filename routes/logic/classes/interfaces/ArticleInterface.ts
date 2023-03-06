export interface ArticleInterface {
    articleId: number;
    articleIsActive: boolean;
    articleNumber: string;
    articleDescription: string;
    articleDescriptionUpperCase: string;
    articleEAN: string;
    articleCategorySoas: string;
    articleLength: number;
    articleWidth: number;
    articleHeight: number;
    articlePackLength: number;
    articlePackWidth: number;
    articlePackHeight: number;
    articleWeight: number;
    articleRaw: boolean;
    articleIsCrossSelling: boolean;
    crossSelling: string;
    warehouseManaged: boolean;
}

export interface SingleArticleJsonInterface {
    ID: number;
    ACTIVE_FLG: boolean;
    ITMNUM: string;
    ITMDES: string;
    ITMDES_UC: string;
    EANCOD: string;
    CATEGORY_SOAS: string;
    ART_LENGTH: number;
    ART_WIDTH: number;
    ART_HEIGHT: number;
    PACK_LENGTH: number;
    PACK_WIDTH: number;
    PACK_HEIGHT: number;
    ITMWEIGHT: number;
    RAW_FLG: boolean;
    CROSSSELLING_FLG: boolean;
    CROSSSELLING: string;
    WAREHOUSE_MANAGED: boolean;
}
