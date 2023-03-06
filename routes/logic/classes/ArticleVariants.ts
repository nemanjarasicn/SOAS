import {ArticleVariantsInterface, ArticleVariantsDataInterface} from "./interfaces/ArticleVariantsInterface";

export class ArticleVariants implements ArticleVariantsInterface {
    private _articleName: string;
    private _articleVariant: string;
    private _articleColor: string;

    constructor(articleVariantsData: ArticleVariantsDataInterface) {
        this._articleName = articleVariantsData.ITMNUM;
        this._articleVariant = articleVariantsData.ITMVARIANT;
        this._articleColor = articleVariantsData.ATTR_COLOR;
    }

    get articleVariantsData(): ArticleVariantsDataInterface {
        return {
            ITMNUM: this._articleName,
            ITMVARIANT: this._articleVariant,
            ATTR_COLOR: this._articleColor
        }
    }

    get articleName(): string {
        return this._articleName;
    }

    set articleName(value: string) {
        this._articleName = value;
    }

    get articleVariant(): string {
        return this._articleVariant;
    }

    set articleVariant(value: string) {
        this._articleVariant = value;
    }

    get articleColor(): string {
        return this._articleColor;
    }

    set articleColor(value: string) {
        this._articleColor = value;
    }
}
