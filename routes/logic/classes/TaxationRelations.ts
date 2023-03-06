import {TaxationRelationsInterface,TaxationRelationsDataInterface} from "./interfaces/TaxationRelationsInterface";
import {CountriesDataInterface} from "./interfaces/CountriesInterface";

export class TaxationRelations implements TaxationRelationsInterface{
    private _taxationName:string;
    private _taxationRate:string;

    constructor(taxationRelationsData : TaxationRelationsDataInterface) {
        this._taxationName = taxationRelationsData.TAXATION_NAME;
        this._taxationRate = taxationRelationsData.TAXATION_RATE;
    }

    get taxationRelationsData(): TaxationRelationsDataInterface {
        return {
            TAXATION_NAME: this._taxationName,
            TAXATION_RATE: this._taxationRate
        }
    }

    get taxationName(): string {
        return this._taxationName;
    }

    set taxationName(value: string) {
        this._taxationName = value;
    }

    get taxationRate(): string {
        return this._taxationRate;
    }

    set taxationRate(value: string) {
        this._taxationRate = value;
    }
}
