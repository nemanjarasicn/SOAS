export class PaymentTerms {

  constructor(
    public PAYMENT_TERM_ID: string,
    public PAYMENT_TERM_NAME: string,
    public PAYMENT_TERM_COMMENT: string,
    public PAYMENT_TERM_ACTIVE: boolean,
    public PAYMENT_CONFIRMED: boolean
  ) {  }
}
