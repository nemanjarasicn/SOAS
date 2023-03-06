import {ArticlePartListInterface, ArticlePartListDataInterface} from "./interfaces/ArticlePartListInterface";

export class ArticlePartlist implements ArticlePartListInterface {
    private _articleName: string;
    private _articleComponentNumber: string;
    private _articleComponentQuantity: number;

    constructor(articlePartListData: ArticlePartListDataInterface) {
        this._articleName = articlePartListData.ITMNUM;
        this._articleComponentNumber = articlePartListData.COMPNUM;
        this._articleComponentQuantity = articlePartListData.DIST_QTY;
    }

    get articlePartListData(): ArticlePartListDataInterface {
        return {
            ITMNUM: this._articleName,
            COMPNUM: this._articleComponentNumber,
            DIST_QTY: this._articleComponentQuantity
        }
    }

    get articleName(): string {
        return this._articleName;
    }

    set articleName(value: string) {
        this._articleName = value;
    }

    get articleComponentNumber(): string {
        return this._articleComponentNumber;
    }

    set articleComponentNumber(value: string) {
        this._articleComponentNumber = value;
    }

    get articleComponentQuantity(): number {
        return this._articleComponentQuantity;
    }

    set articleComponentQuantity(value: number) {
        this._articleComponentQuantity = value;
    }
}
