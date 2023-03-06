import {ArticleInterface, SingleArticleJsonInterface} from "./interfaces/ArticleInterface";

export class Article implements ArticleInterface {
    private _articleId: number;
    private _articleIsActive: boolean;
    private _articleNumber: string;
    private _articleDescription: string;
    private _articleDescriptionUpperCase: string;
    private _articleEAN: string;
    private _articleCategorySoas: string;
    private _articleLength: number;
    private _articleWidth: number;
    private _articleHeight: number;
    private _articlePackLength: number;
    private _articlePackWidth: number;
    private _articlePackHeight: number;
    private _articleWeight: number;
    private _articleRaw: boolean;
    private _articleIsCrossSelling: boolean;
    private _crossSelling: string;
    private _warehouseManaged: boolean;

    constructor(singleArticleJson: SingleArticleJsonInterface) {
        this._articleId = singleArticleJson.ID;
        this._articleIsActive = singleArticleJson.ACTIVE_FLG;
        this._articleNumber = singleArticleJson.ITMNUM;
        this._articleDescription = singleArticleJson.ITMDES;
        this._articleDescriptionUpperCase = singleArticleJson.ITMDES_UC;
        this._articleEAN = singleArticleJson.EANCOD;
        this._articleCategorySoas = singleArticleJson.CATEGORY_SOAS;
        this._articleLength = singleArticleJson.ART_LENGTH;
        this._articleWidth = singleArticleJson.ART_WIDTH;
        this._articleHeight = singleArticleJson.ART_HEIGHT;
        this._articlePackLength = singleArticleJson.PACK_LENGTH;
        this._articlePackWidth = singleArticleJson.PACK_WIDTH;
        this._articlePackHeight = singleArticleJson.PACK_HEIGHT;
        this._articleWeight = singleArticleJson.ITMWEIGHT;
        this._articleRaw = singleArticleJson.RAW_FLG;
        this._articleIsCrossSelling = singleArticleJson.CROSSSELLING_FLG;
        this._crossSelling = singleArticleJson.CROSSSELLING;
        this._warehouseManaged = singleArticleJson.WAREHOUSE_MANAGED;
    }

    get articleData(): SingleArticleJsonInterface {
        return {
            ID: this._articleId,
            ACTIVE_FLG: this._articleIsActive,
            ITMNUM: this._articleNumber,
            ITMDES: this._articleDescription,
            ITMDES_UC: this._articleDescriptionUpperCase,
            EANCOD: this._articleEAN,
            CATEGORY_SOAS: this._articleCategorySoas,
            ART_LENGTH: this._articleLength,
            ART_WIDTH: this._articleWeight,
            ART_HEIGHT: this._articleHeight,
            PACK_LENGTH: this._articlePackLength,
            PACK_WIDTH: this._articlePackWidth,
            PACK_HEIGHT: this._articlePackHeight,
            ITMWEIGHT: this._articleWeight,
            RAW_FLG: this._articleRaw,
            CROSSSELLING_FLG: this._articleIsCrossSelling,
            CROSSSELLING: this._crossSelling,
            WAREHOUSE_MANAGED: this._warehouseManaged
        }
    }

    get articleId(): number {
        return this._articleId;
    }

    set articleId(value: number) {
        this._articleId = value;
    }

    get articleNumber(): string {
        return this._articleNumber;
    }

    set articleNumber(value: string) {
        this._articleNumber = value;
    }

    get articleDescription(): string {
        return this._articleDescription;
    }

    set articleDescription(value: string) {
        this._articleDescription = value;
    }

    get articleDescriptionUpperCase(): string {
        return this._articleDescriptionUpperCase;
    }

    set articleDescriptionUpperCase(value: string) {
        this._articleDescriptionUpperCase = value;
    }

    get articleEAN(): string {
        return this._articleEAN;
    }

    set articleEAN(value: string) {
        this._articleEAN = value;
    }

    get articleCategorySoas(): string {
        return this._articleCategorySoas;
    }

    set articleCategorySoas(value: string) {
        this._articleCategorySoas = value;
    }

    get articleLength(): number {
        return this._articleLength;
    }

    set articleLength(value: number) {
        this._articleLength = value;
    }

    get articleWidth(): number {
        return this._articleWidth;
    }

    set articleWidth(value: number) {
        this._articleWidth = value;
    }

    get articleHeight(): number {
        return this._articleHeight;
    }

    set articleHeight(value: number) {
        this._articleHeight = value;
    }

    get articlePackWidth(): number {
        return this._articlePackWidth;
    }

    set articlePackWidth(value: number) {
        this._articlePackWidth = value;
    }

    get articlePackHeight(): number {
        return this._articlePackHeight;
    }

    set articlePackHeight(value: number) {
        this._articlePackHeight = value;
    }

    get articleWeight(): number {
        return this._articleWeight;
    }

    set articleWeight(value: number) {
        this._articleWeight = value;
    }

    get crossSelling(): string {
        return this._crossSelling;
    }

    set crossSelling(value: string) {
        this._crossSelling = value;
    }

    get articlePackLength(): number {
        return this._articlePackLength;
    }

    set articlePackLength(value: number) {
        this._articlePackLength = value;
    }

    get articleIsActive(): boolean {
        return this._articleIsActive;
    }

    set articleIsActive(value: boolean) {
        this._articleIsActive = value;
    }

    get articleRaw(): boolean {
        return this._articleRaw;
    }

    set articleRaw(value: boolean) {
        this._articleRaw = value;
    }

    get articleIsCrossSelling(): boolean {
        return this._articleIsCrossSelling;
    }

    set articleIsCrossSelling(value: boolean) {
        this._articleIsCrossSelling = value;
    }

    get warehouseManaged(): boolean {
        return this._warehouseManaged;
    }

    set warehouseManaged(value: boolean) {
        this._warehouseManaged = value;
    }
}

