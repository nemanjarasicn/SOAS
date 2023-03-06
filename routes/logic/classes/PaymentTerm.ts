import {PaymentTermInterface, PaymentTermDataInterface} from "./interfaces/PaymentTermInterface";

export class PaymentTerm implements PaymentTermInterface {
    private _paymentTermId: number;
    private _paymentTermName: string;
    private _paymentTermComment: string;
    private _paymentTermActive: boolean;
    private _paymentConfirmed: boolean;

    constructor(paymentTermData: PaymentTermDataInterface) {
        this._paymentTermId = paymentTermData.PAYMENT_TERM_ID;
        this._paymentTermName = paymentTermData.PAYMENT_TERM_NAME;
        this._paymentTermComment = paymentTermData.PAYMENT_TERM_COMMENT;
        this._paymentTermActive = paymentTermData.PAYMENT_TERM_ACTIVE;
        this._paymentConfirmed = paymentTermData.PAYMENT_CONFIRMED;
    }

    get paymentTermData(): PaymentTermDataInterface {
        return {
            PAYMENT_TERM_ID: this._paymentTermId,
            PAYMENT_TERM_NAME: this._paymentTermName,
            PAYMENT_TERM_COMMENT: this._paymentTermComment,
            PAYMENT_TERM_ACTIVE: this._paymentTermActive,
            PAYMENT_CONFIRMED: this._paymentConfirmed
        }
    }

    get paymentTermId(): number {
        return this._paymentTermId;
    }

    set paymentTermId(value: number) {
        this._paymentTermId = value;
    }

    get paymentTermName(): string {
        return this._paymentTermName;
    }

    set paymentTermName(value: string) {
        this._paymentTermName = value;
    }

    get paymentTermComment(): string {
        return this._paymentTermComment;
    }

    set paymentTermComment(value: string) {
        this._paymentTermComment = value;
    }

    get paymentTermActive(): boolean {
        return this._paymentTermActive;
    }

    set paymentTermActive(value: boolean) {
        this._paymentTermActive = value;
    }

    get paymentConfirmed(): boolean {
        return this._paymentConfirmed;
    }

    set paymentConfirmed(value: boolean) {
        this._paymentConfirmed = value;
    }
}
