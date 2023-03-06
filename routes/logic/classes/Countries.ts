import {CountriesInterface, CountriesDataInterface} from "./interfaces/CountriesInterface";

export class Countries implements CountriesInterface {
    private _countriesId: number;
    private _countriesName: string;
    private _countriesIsoCode: string;

    constructor(countriesData: CountriesDataInterface) {
        this._countriesId = countriesData.COUNTRY_ID;
        this._countriesName = countriesData.COUNTRY_NAME;
        this._countriesIsoCode = countriesData.COUNTRY_ISO_CODE;
    }

    get countriesData(): CountriesDataInterface {
        return {
            COUNTRY_ID: this._countriesId,
            COUNTRY_NAME: this._countriesName,
            COUNTRY_ISO_CODE: this._countriesIsoCode
        }
    }

    get countriesId(): number {
        return this._countriesId;
    }

    set countriesId(value: number) {
        this._countriesId = value;
    }

    get countriesName(): string {
        return this._countriesName;
    }

    set countriesName(value: string) {
        this._countriesName = value;
    }

    get countriesIsoCode(): string {
        return this._countriesIsoCode;
    }

    set countriesIsoCode(value: string) {
        this._countriesIsoCode = value;
    }
}
