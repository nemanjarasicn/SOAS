import {TaxesInterface, TaxesDataInterface} from "./interfaces/TaxesInterface";

export class Taxes implements TaxesInterface {
    private _taxcode: string;
    private _description: string;
    private _country: string;
    private _taxrate: string;

    constructor(TaxesData: TaxesDataInterface) {
        this._taxcode = TaxesData.TAXCODE;
        this._description = TaxesData.DESCRIPTION;
        this._country = TaxesData.COUNTRY;
        this._taxrate = TaxesData.TAXRATE;
    }

    get TaxesData(): TaxesDataInterface {
        return {
            TAXCODE: this._taxcode,
            DESCRIPTION: this._description,
            COUNTRY: this._country,
            TAXRATE: this._taxrate
        }
    }

    get taxcode(): string {
        return this._taxcode;
    }

    set taxcode(value: string) {
        this._taxcode = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get country(): string {
        return this._country;
    }

    set country(value: string) {
        this._country = value;
    }

    get taxrate(): string {
      return this._taxrate;
  }

  set taxrate(value: string) {
      this._taxrate = value;
  }
}
