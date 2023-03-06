export class SaleOffers {
  constructor(
    public OFFER_NUMBER: string,
    public OFFER_ACCEPTED: boolean,
    public CLIENT: string,
    public ORDERS_TYPE: string,
    public CUSTOMER_ORDER: string,
    public OFFER_DATE: string,
    public ORDERAMOUNT_NET: number,
    public ORDERAMOUNT_BRU: number,
    public CURRENCY: string,
    public DISCOUNT: number,
    public SHIPPING_COSTS: number,
    public SALES_LOCATION:  string,
    public COMMENT: string,
    public DISCOUNT_PERC: number
  ) {
  }
}


