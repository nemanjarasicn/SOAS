export interface SaleOfferInterface {
  offerNumber: string;
  offerAccepted: boolean;
  offerClient: string;
  offerType: string;
  offerDate: string;
  offerAmountNet: number;
  offerAmountBrut: number;
  offerCurrency: string;
  discount: number;
  shippingCosts: number;
  warehouse: string;
  offerSalesLocations: string;
  offerComment: string;
  offerDiscPerc: number;
}

export interface SaleOfferDataInterface {
  OFFER_NUMBER: string;
  OFFER_ACCEPTED:  boolean;
  CLIENT: string;
  ORDERS_TYPE: string;
  OFFER_DATE: string;
  ORDERAMOUNT_NET: number;
  ORDERAMOUNT_BRU: number;
  CURRENCY: string;
  DISCOUNT: number;
  SHIPPING_COSTS: number;
  WAREHOUSE: string;
  SALES_LOCATION:  string;
  COMMENT: string;
  DISCOUNT_PERC: number;
}
