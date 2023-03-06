export interface PaymentTermInterface {
    paymentTermId : number;
    paymentTermName : string;
    paymentTermComment : string;
    paymentTermActive : boolean;
    paymentConfirmed : boolean;
}

export interface PaymentTermDataInterface {
    PAYMENT_TERM_ID : number;
    PAYMENT_TERM_NAME : string;
    PAYMENT_TERM_COMMENT : string;
    PAYMENT_TERM_ACTIVE : boolean;
    PAYMENT_CONFIRMED : boolean;
}
