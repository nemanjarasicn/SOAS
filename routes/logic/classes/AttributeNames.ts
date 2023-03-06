import {AttributeNamesInterface,AttributeNamesDataInterface} from "./interfaces/AttributeNamesInterface";

export class AttributeNames implements AttributeNamesInterface{

    private _attributeId:string;
    private _attributeName:string;
    private _attributeFieldType:string;
    private _attributeDataType:string;

    constructor(attributeNamesData : AttributeNamesDataInterface) {
        this._attributeId = attributeNamesData.ID;
        this._attributeName = attributeNamesData.ATTRIBUTE_NAME;
        this._attributeFieldType = attributeNamesData.ATTRIBUTE_FIELD_TYPE;
        this._attributeDataType = attributeNamesData.ATTRIBUTE_DATA_TYPE;
    }

    get attributeNamesData(): AttributeNamesDataInterface {
        return {
            ID: this._attributeId,
            ATTRIBUTE_NAME: this._attributeName,
            ATTRIBUTE_FIELD_TYPE: this._attributeFieldType,
            ATTRIBUTE_DATA_TYPE: this._attributeDataType
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

    get attributeFieldType(): string {
        return this._attributeFieldType;
    }

    set attributeFieldType(value: string) {
        this._attributeFieldType = value;
    }

    get attributeDataType(): string {
        return this._attributeDataType;
    }

    set attributeDataType(value: string) {
        this._attributeDataType = value;
    }
}
