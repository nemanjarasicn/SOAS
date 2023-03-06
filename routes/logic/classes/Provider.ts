import {ProviderInterface, ProviderDataInterface} from "./interfaces/ProviderInterface";

export class Provider implements ProviderInterface {
    private _providersNumber: string;
    private _providerName: string;
    private _providerCountry: string;
    private _language: string;
    private _taxNumber: string;
    private _euUstIdnr: string;
    private _currency: number;
    private _autoCompleteOrders: boolean;

    constructor(providerData: ProviderDataInterface) {
        this._providersNumber = providerData.PROVIDERS_NUMBER;
        this._providerName = providerData.PROVIDERS_NAME;
        this._providerCountry = providerData.PROVIDERS_COUNTRY;
        this._language = providerData.LANGUAGE;
        this._taxNumber = providerData.TAX_NUMBER;
        this._euUstIdnr = providerData.EU_UST_IDNR;
        this._currency = providerData.CURRENCY;
        this._autoCompleteOrders = providerData.AUTO_COMPLETE_ORDERS;
    }

    get providerData(): ProviderDataInterface {
        return {
            PROVIDERS_NUMBER: this._providersNumber,
            PROVIDERS_NAME: this._providerName,
            PROVIDERS_COUNTRY: this._providerCountry,
            LANGUAGE: this._language,
            TAX_NUMBER: this._taxNumber,
            EU_UST_IDNR: this._euUstIdnr,
            CURRENCY: this._currency,
            AUTO_COMPLETE_ORDERS: this._autoCompleteOrders
        }
    }

    get providersNumber(): string {
        return this._providersNumber;
    }

    set providersNumber(value: string) {
        this._providersNumber = value;
    }

    get providerName(): string {
        return this._providerName;
    }

    set providerName(value: string) {
        this._providerName = value;
    }

    get providerCountry(): string {
        return this._providerCountry;
    }

    set providerCountry(value: string) {
        this._providerCountry = value;
    }

    get language(): string {
        return this._language;
    }

    set language(value: string) {
        this._language = value;
    }

    get taxNumber(): string {
        return this._taxNumber;
    }

    set taxNumber(value: string) {
        this._taxNumber = value;
    }

    get euUstIdnr(): string {
        return this._euUstIdnr;
    }

    set euUstIdnr(value: string) {
        this._euUstIdnr = value;
    }

    get currency(): number {
        return this._currency;
    }

    set currency(value: number) {
        this._currency = value;
    }

    get autoCompleteOrders(): boolean {
        return this._autoCompleteOrders;
    }

    set autoCompleteOrders(value: boolean) {
        this._autoCompleteOrders = value;
    }
}
