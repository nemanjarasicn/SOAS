import {ProviderAddressInterface, ProviderAddressDataInterface} from "./interfaces/ProviderAddressInterface";

export class ProviderAddress implements ProviderAddressInterface{
    private _providerName: string;
    private _providerAddressCountry: string;
    private _providerAddressStreet: string;
    private _providerAddressPostcode: string;
    private _providerAddressCity: string;
    private _providerAddressURL: string;
    private _providerAddressTelefon: string;
    private _providerAddressFax: string;
    private _providerAddressEmail: string;

    constructor(providerAddressData: ProviderAddressDataInterface) {
        this._providerName = providerAddressData.PROVIDERS_NAME;
        this._providerAddressCountry = providerAddressData.PROVIDERS_ADDR_COUNTRY;
        this._providerAddressStreet = providerAddressData.PROVIDERS_ADDR_STREET;
        this._providerAddressPostcode = providerAddressData.PROVIDERS_ADDR_CITY;
        this._providerAddressCity = providerAddressData.PROVIDERS_ADDR_CITY;
        this._providerAddressURL = providerAddressData.PROVIDERS_ADDR_URL;
        this._providerAddressTelefon = providerAddressData.PROVIDERS_ADDR_TELEFON;
        this._providerAddressFax = providerAddressData.PROVIDERS_ADDR_FAX;
        this._providerAddressEmail = providerAddressData.PROVIDERS_ADDR_EMAIL;
    }

    get providerAddressData(): ProviderAddressDataInterface {
        return {
            PROVIDERS_NAME: this._providerName,
            PROVIDERS_ADDR_COUNTRY: this._providerAddressCountry,
            PROVIDERS_ADDR_STREET: this._providerAddressStreet,
            PROVIDERS_ADDR_POSTCODE: this._providerAddressPostcode,
            PROVIDERS_ADDR_CITY: this._providerAddressCity,
            PROVIDERS_ADDR_URL: this._providerAddressURL,
            PROVIDERS_ADDR_TELEFON: this._providerAddressTelefon,
            PROVIDERS_ADDR_FAX: this._providerAddressFax,
            PROVIDERS_ADDR_EMAIL: this._providerAddressEmail
        }
    }

    get providerName(): string {
        return this._providerName;
    }

    set providerName(value: string) {
        this._providerName = value;
    }

    get providerAddressCountry(): string {
        return this._providerAddressCountry;
    }

    set providerAddressCountry(value: string) {
        this._providerAddressCountry = value;
    }

    get providerAddressStreet(): string {
        return this._providerAddressStreet;
    }

    set providerAddressStreet(value: string) {
        this._providerAddressStreet = value;
    }

    get providerAddressPostcode(): string {
        return this._providerAddressPostcode;
    }

    set providerAddressPostcode(value: string) {
        this._providerAddressPostcode = value;
    }

    get providerAddressCity(): string {
        return this._providerAddressCity;
    }

    set providerAddressCity(value: string) {
        this._providerAddressCity = value;
    }

    get providerAddressURL(): string {
        return this._providerAddressURL;
    }

    set providerAddressURL(value: string) {
        this._providerAddressURL = value;
    }

    get providerAddressTelefon(): string {
        return this._providerAddressTelefon;
    }

    set providerAddressTelefon(value: string) {
        this._providerAddressTelefon = value;
    }

    get providerAddressFax(): string {
        return this._providerAddressFax;
    }

    set providerAddressFax(value: string) {
        this._providerAddressFax = value;
    }

    get providerAddressEmail(): string {
        return this._providerAddressEmail;
    }

    set providerAddressEmail(value: string) {
        this._providerAddressEmail = value;
    }
}
