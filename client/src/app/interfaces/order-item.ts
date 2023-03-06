export interface Order {
  CUSTOMER_ADDRESSES?: string; // virtual column for showing customers addresses in view
  ORDERS_NUMBER: string;
  CLIENT: string;
  ORDERS_TYPE: string;
  CUSTOMER_ORDER: string;
  CUSTOMER_ADDRESSES_ID_DELIVERY: number;
  CUSTOMER_ADDRESSES_ID_INVOICE: number;
  CUSTOMER_DELIVERY: string;
  CUSTOMER_INVOICE: string;
  ORDERS_DATE: string;
  ORDERAMOUNT_NET: number;
  ORDERAMOUNT_BRU: number;
  CURRENCY: string;
  PAYMENT_TERM_ID: string;
  CUSTOMER_ORDERREF: string;
  LAST_DELIVERY: string;
  LAST_INVOICE: string;
  EDI_ORDERRESPONSE_SENT: boolean;
  RELEASE: boolean;
  PAYED: boolean;
  ORDERS_STATE: number;
  WEBSHOP_ID: number;
  WEBSHOP_ORDER_REF: string;
  DISCOUNT: number;
  VOUCHER: number;
  SHIPPING_COSTS: number;
  WAREHOUSE: string;
  SALES_LOCATION: string;
  TAX_AMOUNT: number;
}
