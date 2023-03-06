export class DeliveryNotes {
  constructor(
    public DELIVERY_NOTES_NUMBER: string,
    public ORDERS_NUMBER: string,
    public SHIPPING_DATE: string,
    public EXPORT_PRINT: boolean,
    public DELIVERY_NOTES_STATE: number,
    public PDF_CREATED_DATE: string,
    public PDF_DOWNLOAD_LINK: string,
    public CUSTOMERS_NUMBER: string,
    public RELEASE: boolean,
    public CURRENCY: string,
    public PARTLY_DELIVERY: boolean,
    public RETOUR: boolean,
    public TAX_AMOUNT: number
  ) {
  }
}
