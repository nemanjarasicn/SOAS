import {DistComponentInterface, DistComponentDataInterface} from "./interfaces/DistComponentInterface";

export class DistComponents implements DistComponentInterface {

    private _id: number;
    private _articleComponentNumber: string;
    private _articleName: string;
    private _articleQuantity: number;

    constructor(distComponentData: DistComponentDataInterface) {
        this._id = distComponentData.ID;
        this._articleName = distComponentData.ITMNUM;
        this._articleComponentNumber = distComponentData.COMPNUM;
        this._articleQuantity = distComponentData.DIST_QTY;
    }

    get distComponentsData(): DistComponentDataInterface {
        return {
            ID: this._id,
            ITMNUM: this._articleName,
            COMPNUM: this._articleComponentNumber,
            DIST_QTY: this._articleQuantity
        }
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get articleComponentNumber(): string {
        return this._articleComponentNumber;
    }

    set articleComponentNumber(value: string) {
        this._articleComponentNumber = value;
    }

    get articleName(): string {
        return this._articleName;
    }

    set articleName(value: string) {
        this._articleName = value;
    }

    get articleQuantity(): number {
        return this._articleQuantity;
    }

    set articleQuantity(value: number) {
        this._articleQuantity = value;
    }
}
