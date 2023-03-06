import {TaxesRateInterface, TaxesRateDataInterface} from "./interfaces/TaxesRateInterface";

export class TaxesRate implements TaxesRateInterface {
    private _taxcode: string;
    private _per_start: string;
    private _per_end: string;
    private _taxrate: string;

    constructor(TaxesRateData: TaxesRateDataInterface) {
        this._taxcode = TaxesRateData.TAXCODE;
        this._per_start = TaxesRateData.PER_START;
        this._per_end = TaxesRateData.PER_END;
        this._taxrate = TaxesRateData.TAXRATE;
    }

    get TaxesRateData(): TaxesRateDataInterface {
        return {
            TAXCODE: this._taxcode,
            PER_START: this._per_start,
            PER_END: this._per_end,
            TAXRATE: this._taxrate
        }
    }

    get taxcode(): string {
        return this._taxcode;
    }

    set taxcode(value: string) {
        this._taxcode = value;
    }

    get per_start(): string {
        return this._per_start;
    }

    set per_start(value: string) {
        this._per_start = value;
    }

    get per_end(): string {
        return this._per_end;
    }

    set per_end(value: string) {
        this._per_end = value;
    }

    get taxrate(): string {
      return this._taxrate;
  }

  set taxrate(value: string) {
      this._taxrate = value;
  }
}
