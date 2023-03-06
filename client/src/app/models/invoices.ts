export class Invoices {
  constructor(
    public INVOICES_NUMBER: string,
    public INVOICES_CUSTOMER: string,
    public INVOICES_DATE: string,
    public INVOICES_CREATOR: string,
    public INVOICES_UPDATE: string,
    public INVOICES_STATE: number,
    public PAYMENT_TERM_ID: string,
    public DELIVERY_NOTES_NUMBER: string,
    public ORDERS_NUMBER: string,
    public PAYED: boolean,
    public PDF_CREATED_DATE: string,
    public PDF_DOWNLOAD_LINK: string,
    public RELEASE: boolean,
    public CURRENCY: string,
    public PARTLY_INVOICE: boolean,
    public SALES_LOCATION: string,
    public WAREHOUSE: string,
    public TAXCODE: string,
    public TAX_AMOUNT: number,
    public NET_ORDER: number,
    public CUSTOMER_ADDRESSES_ID_DELIVERY: number,
    public CUSTOMER_ADDRESSES_ID_INVOICE: number,
    public INVOICES_AMOUNT_BRU: number,
    public INVOICES_AMOUNT_NET: number
  ) {
  }
}
