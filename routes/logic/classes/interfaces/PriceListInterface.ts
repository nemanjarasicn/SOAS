export interface PriceListInterface {
    id: number;
    articleNumber : string;
    priceNet : number;
    priceBru : number;
    currency : string;
    priceList : string;
    cusgrp : string;
    startDate: string;
    endDate: string;
    priority: number;
}

export interface PriceListDataInterface {
    ID: number;
    ITMNUM :string;
    PRICE_NET :number;
    PRICE_BRU : number;
    CURRENCY : string;
    PRILIST : string;
    CUSGRP : string;
    START_DATE: string;
    END_DATE: string;
    PRIORITY: number;
}
