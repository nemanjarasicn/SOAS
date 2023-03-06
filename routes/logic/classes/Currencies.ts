import {CurrenciesInterface, CurrenciesDataInterface} from "./interfaces/CurrenciesInterface";

export class Currencies implements CurrenciesInterface {
    private _currenciesId: number;
    private _currenciesName: string;
    private _currenciesIsoCode: string;
    private _currenciesSymbol: string;

    constructor(currenciesData: CurrenciesDataInterface) {
        this._currenciesId = currenciesData.CURRENCY_ID;
        this._currenciesName = currenciesData.CURRENCY_NAME;
        this._currenciesIsoCode = currenciesData.CURRENCY_ISO_CODE;
        this._currenciesSymbol = currenciesData.CURRENCY_SYMBOL;
    }

    get currenciesData(): CurrenciesDataInterface {
        return {
            CURRENCY_ID: this._currenciesId,
            CURRENCY_NAME: this._currenciesName,
            CURRENCY_ISO_CODE: this._currenciesIsoCode,
            CURRENCY_SYMBOL: this._currenciesSymbol
        }
    }

    get currenciesId(): number {
        return this._currenciesId;
    }

    set currenciesId(value: number) {
        this._currenciesId = value;
    }

    get currenciesName(): string {
        return this._currenciesName;
    }

    set currenciesName(value: string) {
        this._currenciesName = value;
    }

    get currenciesIsoCode(): string {
        return this._currenciesIsoCode;
    }

    set currenciesIsoCode(value: string) {
        this._currenciesIsoCode = value;
    }

    get currenciesSymbol(): string {
        return this._currenciesSymbol;
    }

    set currenciesSymbol(value: string) {
        this._currenciesSymbol = value;
    }
}
