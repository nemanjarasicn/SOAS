import {CrossSellingInterface, CrossSellingDataInterface} from "./interfaces/CrossSellingInterface";

export class CrossSelling implements CrossSellingInterface {
    private _crossSellingId: number;
    private _crossSellingData: string;

    constructor(crossSellingData: CrossSellingDataInterface) {
        this._crossSellingId = crossSellingData.CROSSSELLING_ID;
        this._crossSellingData = crossSellingData.CROSSSELLING_DATA;
    }

    get crossSellingFullData(): CrossSellingDataInterface {
        return {
            CROSSSELLING_ID: this._crossSellingId,
            CROSSSELLING_DATA: this._crossSellingData,
        }
    }

    get crossSellingId(): number {
        return this._crossSellingId;
    }

    set crossSellingId(value: number) {
        this._crossSellingId = value;
    }

    get crossSellingData(): string {
        return this._crossSellingData;
    }

    set crossSellingData(value: string) {
        this._crossSellingData = value;
    }
}
