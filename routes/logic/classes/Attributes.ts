import {AttributesDataInterface, AttributesInterface} from "./interfaces/AttributesInterface";

export class Attributes implements AttributesInterface{

    private _attributeId:string;
    private _attributeName:string;
    private _attributeData:string;

    constructor(attributesData : AttributesDataInterface) {
        this._attributeId = attributesData.ID;
        this._attributeName = attributesData.ATTRIBUTE_NAME;
        this._attributeData = attributesData.ATTRIBUTE_DATA;
    }

    get attributesData(): AttributesDataInterface {
        return {
            ID: this._attributeId,
            ATTRIBUTE_NAME: this._attributeName,
            ATTRIBUTE_DATA: this._attributeData,
        }
    }

    get attributeId(): string {
        return this._attributeId;
    }

    set attributeId(value: string) {
        this._attributeId = value;
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
