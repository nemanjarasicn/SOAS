export interface ProviderInterface {
    providersNumber: string;
    providerName : string;
    providerCountry : string;
    language : string;
    taxNumber : string;
    euUstIdnr : string;
    currency : number;
    autoCompleteOrders: boolean;
}

export interface ProviderDataInterface {
    PROVIDERS_NUMBER: string;
    PROVIDERS_NAME : string;
    PROVIDERS_COUNTRY : string;
    LANGUAGE : string;
    TAX_NUMBER : string;
    EU_UST_IDNR : string;
    CURRENCY : number;
    AUTO_COMPLETE_ORDERS: boolean;
}
