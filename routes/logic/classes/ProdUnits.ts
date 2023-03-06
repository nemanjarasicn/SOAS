import {ProdUnitsInterface, ProdUnitsDataInterface} from "./interfaces/ProdUnitsInterface";

export class ProdUnits implements ProdUnitsInterface {
    private _prodUnitName: string;
    private _prodUnitDesc: string;
    private _prodUnitSymbol: string;

    constructor(prodUnitsData: ProdUnitsDataInterface) {
        this._prodUnitName = prodUnitsData.PROD_UNIT_NAME;
        this._prodUnitDesc = prodUnitsData.PROD_UNIT_DESC;
        this._prodUnitSymbol = prodUnitsData.PROD_UNIT_SYMBOL;
    }

    get prodUnitsData(): ProdUnitsDataInterface {
        return {
            PROD_UNIT_NAME: this._prodUnitName,
            PROD_UNIT_DESC: this._prodUnitDesc,
            PROD_UNIT_SYMBOL: this._prodUnitSymbol,
        }
    }

    get prodUnitName(): string {
        return this._prodUnitName;
    }

    set prodUnitName(value: string) {
        this._prodUnitName = value;
    }

    get prodUnitDesc(): string {
        return this._prodUnitDesc;
    }

    set prodUnitDesc(value: string) {
        this._prodUnitDesc = value;
    }

    get prodUnitSymbol(): string {
        return this._prodUnitSymbol;
    }

    set prodUnitSymbol(value: string) {
        this._prodUnitSymbol = value;
    }
}
