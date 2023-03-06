import {InvoicePositionsInterface, InvoicePositionsDataInterface} from "./interfaces/InvoicePositionsInterface";

export class InvoicePositions implements InvoicePositionsInterface {
    private _id: number;
    private _invoiceNumber: string;
    private _orderNumber: string;
    private _deliveryNoteNumber: string;
    private _articleNumber: string;
    private _categorySoas: string;
    private _orderQuantity: number;
    private _deliveryQuantity: number;
    private _priceNetto: number;
    private _priceBrutto: number;
    private _currency: string;
    private _deliveryNotesPositionsId: number;
    private _parentLineId: number;
    private _positionStatus: number;
    private _positionId: number;
    private _articleDescription: string;
    private _salesLocation: string;
    private _taxAmount: number;

    constructor(invoicePositionsData: InvoicePositionsDataInterface) {
        this._id = invoicePositionsData.ID;
        this._invoiceNumber = invoicePositionsData.INVOICES_NUMBER;
        this._orderNumber = invoicePositionsData.ORDERS_NUMBER;
        this._deliveryNoteNumber = invoicePositionsData.DELIVERY_NOTES_NUMBER;
        this._articleNumber = invoicePositionsData.ITMNUM;
        this._categorySoas = invoicePositionsData.CATEGORY_SOAS;
        this._orderQuantity = invoicePositionsData.ORDER_QTY;
        this._deliveryQuantity = invoicePositionsData.DELIVERY_QTY;
        this._priceNetto = invoicePositionsData.PRICE_NET;
        this._priceBrutto = invoicePositionsData.PRICE_BRU;
        this._currency = invoicePositionsData.CURRENCY;
        this._deliveryNotesPositionsId = invoicePositionsData.DELIVERY_NOTES_POSITIONS_ID;
        this._parentLineId = invoicePositionsData.PARENT_LINE_ID;
        this._positionStatus = invoicePositionsData.POSITION_STATUS;
        this._positionId = invoicePositionsData.POSITION_ID;
        this._articleDescription = invoicePositionsData.ITMDES;
        this._salesLocation = invoicePositionsData.SALES_LOCATION;
        this._taxAmount = invoicePositionsData.TAX_AMOUNT;
    }

    get invoicePositionsData(): InvoicePositionsDataInterface {
        return {
            ID: this._id,
            INVOICES_NUMBER: this._invoiceNumber,
            ORDERS_NUMBER: this._orderNumber,
            DELIVERY_NOTES_NUMBER: this._deliveryNoteNumber,
            ITMNUM: this._articleNumber,
            CATEGORY_SOAS: this._categorySoas,
            ORDER_QTY: this._orderQuantity,
            DELIVERY_QTY: this._deliveryQuantity,
            PRICE_NET: this._priceNetto,
            PRICE_BRU: this._priceBrutto,
            CURRENCY: this._currency,
            DELIVERY_NOTES_POSITIONS_ID: this._deliveryNotesPositionsId,
            PARENT_LINE_ID: this._parentLineId,
            POSITION_STATUS: this._positionStatus,
            POSITION_ID: this._positionId,
            ITMDES: this._articleDescription,
            SALES_LOCATION: this._salesLocation,
            TAX_AMOUNT: this._taxAmount
        }
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get invoiceNumber(): string {
        return this._invoiceNumber;
    }

    set invoiceNumber(value: string) {
        this._invoiceNumber = value;
    }

    get orderNumber(): string {
        return this._orderNumber;
    }

    set orderNumber(value: string) {
        this._orderNumber = value;
    }

    get deliveryNoteNumber(): string {
        return this._deliveryNoteNumber;
    }

    set deliveryNoteNumber(value: string) {
        this._deliveryNoteNumber = value;
    }

    get articleNumber(): string {
        return this._articleNumber;
    }

    set articleNumber(value: string) {
        this._articleNumber = value;
    }

    get categorySoas(): string {
        return this._categorySoas;
    }

    set categorySoas(value: string) {
        this._categorySoas = value;
    }

    get orderQuantity(): number {
        return this._orderQuantity;
    }

    set orderQuantity(value: number) {
        this._orderQuantity = value;
    }

    get deliveryQuantity(): number {
        return this._deliveryQuantity;
    }

    set deliveryQuantity(value: number) {
        this._deliveryQuantity = value;
    }

    get priceNetto(): number {
        return this._priceNetto;
    }

    set priceNetto(value: number) {
        this._priceNetto = value;
    }

    get priceBrutto(): number {
        return this._priceBrutto;
    }

    set priceBrutto(value: number) {
        this._priceBrutto = value;
    }

    get currency(): string {
        return this._currency;
    }

    set currency(value: string) {
        this._currency = value;
    }

    get deliveryNotesPositionsId(): number {
        return this._deliveryNotesPositionsId;
    }

    set deliveryNotesPositionsId(value: number) {
        this._deliveryNotesPositionsId = value;
    }

    get parentLineId(): number {
        return this._parentLineId;
    }

    set parentLineId(value: number) {
        this._parentLineId = value;
    }

    get positionStatus(): number {
        return this._positionStatus;
    }

    set positionStatus(value: number) {
        this._positionStatus = value;
    }

    get positionId(): number {
        return this._positionId;
    }

    set positionId(value: number) {
        this._positionId = value;
    }

    get articleDescription(): string {
        return this._articleDescription;
    }

    set articleDescription(value: string) {
        this._articleDescription = value;
    }

    get salesLocation(): string {
        return this._salesLocation;
    }

    set salesLocation(value: string) {
        this._salesLocation = value;
    }

    get taxAmount(): number {
        return this._taxAmount;
    }

    set taxAmount(value: number) {
        this._taxAmount = value;
    }
}
