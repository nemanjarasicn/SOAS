export class Orders {
  constructor(
    public ORDERS_NUMBER: string,
    public CLIENT: string,
    public ORDERS_TYPE: string,
    public CUSTOMER_ORDER: string,
    public CUSTOMER_ADDRESSES_ID_DELIVERY: number,
    public CUSTOMER_ADDRESSES_ID_INVOICE: number,
    public CUSTOMER_DELIVERY: string,
    public CUSTOMER_INVOICE: string,
    public ORDERS_DATE: string,
    public ORDERAMOUNT_NET: number,
    public ORDERAMOUNT_BRU: number,
    public CURRENCY: string,
    public PAYMENT_TERM_ID: string,
    public CUSTOMER_ORDERREF: string,
    public LAST_DELIVERY: string,
    public LAST_INVOICE: string,
    public EDI_ORDERRESPONSE_SENT: boolean,
    public RELEASE: boolean,
    public PAYED: boolean,
    public ORDERS_STATE: number,
    public WEBSHOP_ID: number,
    public WEBSHOP_ORDER_REF: string,
    public DISCOUNT: number,
    public VOUCHER: number,
    public SHIPPING_COSTS: number,
    public WAREHOUSE: string,
    public SALES_LOCATION: string,
    public TAX_AMOUNT: number,
    public CUSTOMER_ADDRESSES?: string // virtual column for showing customers addresses in view
  ) {
  }
}


