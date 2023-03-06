export interface InvoiceInterface {
  invoiceNumber: string;
  invoiceCustomerNumber : string;
  invoiceDate : string;
  invoiceCreator : string;
  invoiceUpdate : string;
  invoiceState : number;
  paymentTermId : string;
  deliveryNotesNumber : string;
  orderNumber : string;
  isPayed : boolean;
  pdfCreatedDate : string;
  pdfDownloadLink : string;
  invoiceRelease: boolean;
  invoiceCurrency: string;
  partlyInvoice: boolean;
  salesLocation: string;
  warehouse: string;
  taxCode: string;
  taxAmount: number;
  netOrder: number;
  customerAddressesIdDelivery: number;
  customerAddressesIdInvoice: number;
}

export interface InvoiceDataInterface {
  INVOICES_NUMBER: string;
  INVOICES_CUSTOMER: string;
  INVOICES_DATE: string;
  INVOICES_CREATOR: string;
  INVOICES_UPDATE: string;
  INVOICES_STATE: number;
  PAYMENT_TERM_ID: string;
  DELIVERY_NOTES_NUMBER: string;
  ORDERS_NUMBER: string;
  PAYED: boolean;
  PDF_CREATED_DATE: string;
  PDF_DOWNLOAD_LINK: string;
  RELEASE: boolean;
  CURRENCY: string;
  PARTLY_INVOICE: boolean;
  SALES_LOCATION: string;
  WAREHOUSE: string;
  TAXCODE: string;
  TAX_AMOUNT: number;
  NET_ORDER: number;
  CUSTOMER_ADDRESSES_ID_DELIVERY: number;
  CUSTOMER_ADDRESSES_ID_INVOICE: number;
  INVOICES_AMOUNT_BRU: number;
  INVOICES_AMOUNT_NET: number;
}
