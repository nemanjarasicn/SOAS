import {ReCreditingInterface, ReCreditingDataInterface} from "./interfaces/ReCreditingInterface";

export class ReCrediting implements ReCreditingInterface {
    private _recreditingNumber: string;
    private _recreditingDate: string;
    private _recreditingState: number;
    private _recreditingPosition: string;
    private _recreditingCreator: string;
    private _orderNumber: string;
    private _deliveryNoteNumber: string;
    private _invoiceNumber: string;
    private _invoiceDate: string;

    constructor(reCreditingData: ReCreditingDataInterface) {
        this._recreditingNumber = reCreditingData.RE_CREDITING_NUMBER;
        this._recreditingDate = reCreditingData.RE_CREDITING_DATE;
        this._recreditingState = reCreditingData.RE_CREDITING_STATE;
        this._recreditingPosition = reCreditingData.RE_CREDITING_POSITIONS;
        this._recreditingCreator = reCreditingData.RE_CREDITING_CREATOR;
        this._orderNumber = reCreditingData.ORDERS_NUMBER;
        this._deliveryNoteNumber = reCreditingData.DELIVERY_NOTES_NUMBER;
        this._invoiceNumber = reCreditingData.INVOICES_NUMBER;
        this._invoiceDate = reCreditingData.INVOICES_DATE;
    }

    get reCreditingData(): ReCreditingDataInterface {
        return {
            RE_CREDITING_NUMBER: this._recreditingNumber,
            RE_CREDITING_DATE: this._recreditingDate,
            RE_CREDITING_STATE: this._recreditingState,
            RE_CREDITING_POSITIONS: this._recreditingPosition,
            RE_CREDITING_CREATOR: this._recreditingCreator,
            ORDERS_NUMBER: this._orderNumber,
            DELIVERY_NOTES_NUMBER: this._deliveryNoteNumber,
            INVOICES_NUMBER: this._invoiceNumber,
            INVOICES_DATE: this._invoiceDate
        }
    }

    get recreditingNumber(): string {
        return this._recreditingNumber;
    }

    set recreditingNumber(value: string) {
        this._recreditingNumber = value;
    }

    get recreditingDate(): string {
        return this._recreditingDate;
    }

    set recreditingDate(value: string) {
        this._recreditingDate = value;
    }

    get recreditingState(): number {
        return this._recreditingState;
    }

    set recreditingState(value: number) {
        this._recreditingState = value;
    }

    get recreditingPosition(): string {
        return this._recreditingPosition;
    }

    set recreditingPosition(value: string) {
        this._recreditingPosition = value;
    }

    get recreditingCreator(): string {
        return this._recreditingCreator;
    }

    set recreditingCreator(value: string) {
        this._recreditingCreator = value;
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

    get invoiceNumber(): string {
        return this._invoiceNumber;
    }

    set invoiceNumber(value: string) {
        this._invoiceNumber = value;
    }

    get invoiceDate(): string {
        return this._invoiceDate;
    }

    set invoiceDate(value: string) {
        this._invoiceDate = value;
    }
}
