import {PriceListInterface, PriceListDataInterface} from "./interfaces/PriceListInterface";

/**
 * Pricelist = Prilist = Prilist Sales
 */
export class Pricelist implements PriceListInterface {
    private _id: number;
    private _articleNumber: string;
    private _priceNet: number;
    private _priceBru: number;
    private _currency: string;
    private _priceList: string;
    private _cusgrp: string;
    private _startDate: string;
    private _endDate: string;
    private _priority: number;

    constructor(priceListData: PriceListDataInterface) {
        this._id = priceListData.ID;
        this._articleNumber = priceListData.ITMNUM;
        this._priceNet = priceListData.PRICE_NET;
        this._priceBru = priceListData.PRICE_BRU;
        this._priceList = priceListData.PRILIST;
        this._currency = priceListData.CURRENCY;
        this._cusgrp = priceListData.CUSGRP;
        this._startDate = priceListData.START_DATE;
        this._endDate = priceListData.END_DATE;
        this._priority = priceListData.PRIORITY;
    }

    get priceListData(): PriceListDataInterface {
        return {
            ID: this._id,
            ITMNUM: this._articleNumber,
            PRICE_NET: this._priceNet,
            PRICE_BRU: this._priceBru,
            PRILIST: this._priceList,
            CURRENCY: this._currency,
            CUSGRP: this._cusgrp,
            START_DATE: this._startDate,
            END_DATE: this._endDate,
            PRIORITY: this._priority,
        }
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get articleNumber(): string {
        return this._articleNumber;
    }

    set articleNumber(value: string) {
        this._articleNumber = value;
    }

    get priceNet(): number {
        return this._priceNet;
    }

    set priceNet(value: number) {
        this._priceNet = value;
    }

    get priceBru(): number {
        return this._priceBru;
    }

    set priceBru(value: number) {
        this._priceBru = value;
    }

    get priceList(): string {
        return this._priceList;
    }

    set priceList(value: string) {
        this._priceList = value;
    }

    get currency(): string {
        return this._currency;
    }

    set currency(value: string) {
        this._currency = value;
    }

    get cusgrp(): string {
        return this._cusgrp;
    }

    set cusgrp(value: string) {
        this._cusgrp = value;
    }

    get startDate(): string {
        return this._startDate;
    }

    set startDate(value: string) {
        this._startDate = value;
    }

    get endDate(): string {
        return this._endDate;
    }

    set endDate(value: string) {
        this._endDate = value;
    }

    get priority(): number {
        return this._priority;
    }

    set priority(value: number) {
        this._priority = value;
    }
}
