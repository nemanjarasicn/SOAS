import {ArticleAttributesInterface,ArticleAttributesDataInterface} from "./interfaces/ArticleAttributesInterface";

export class ArticleAttributes implements ArticleAttributesInterface{
    private _attributeName:string;
    private _attributeData:string;
    constructor(articleAttributesData : ArticleAttributesDataInterface) {
        this._attributeName = articleAttributesData.ATTRIBUTE_NAME;
        this._attributeData = articleAttributesData.ATTRIBUTE_DATA;
    }

    get attributeName(): string {
        return this._attributeName;
    }

    set attributeName(value: string) {
        this._attributeName = value;
    }

    get attributeData(): string {
        return this._attributeData;
    }

    set attributeData(value: string) {
        this._attributeData = value;
    }
}
