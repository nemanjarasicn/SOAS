import {ProdComponentsInterface, ProdComponentsDataInterface} from "./interfaces/ProdComponentsInterface";

export class ProdComponents implements ProdComponentsInterface {
    private _itmnum: string;
    private _compnum: string;
    private _prodQty: number;
    private _prodUnit: string;

    constructor(prodComponentsData: ProdComponentsDataInterface) {
        this._itmnum = prodComponentsData.ITMNUM;
        this._compnum = prodComponentsData.COMPNUM;
        this._prodQty = prodComponentsData.PROD_QTY;
        this._prodUnit = prodComponentsData.PROD_UNIT;
    }

    get prodComponentsData(): ProdComponentsDataInterface {
        return {
            ITMNUM: this._itmnum,
            COMPNUM: this._compnum,
            PROD_QTY: this._prodQty,
            PROD_UNIT: this._prodUnit
        }
    }

    get itmnum(): string {
        return this._itmnum;
    }

    set itmnum(value: string) {
        this._itmnum = value;
    }

    get compnum(): string {
        return this._compnum;
    }

    set compnum(value: string) {
        this._compnum = value;
    }

    get prodQty(): number {
        return this._prodQty;
    }

    set prodQty(value: number) {
        this._prodQty = value;
    }

    get prodUnit(): string {
        return this._prodUnit;
    }

    set prodUnit(value: string) {
        this._prodUnit = value;
    }
}
