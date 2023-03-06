export interface SaleOffer {
  OFFER_NUMBER: string;
  OFFER_ACCEPTED: boolean;
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
