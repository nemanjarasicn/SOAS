export interface SupplyOrdersInterface {
  supplyOrdersProvidersOrder: string;
  supplyOrdersProvider: string;
  supplyOrdersClientDelivery: string;
  supplyOrdersClientInvoice: string;
  supplyOrdersAmountNet: number;
  supplyOrdersAmountBru: number;
  supplyOrdersRef: string;
  supplyOrdersCurrency: number;
  supplyOrdersShippingCosts: number;
  supplyOrdersWarehouse: string;
  supplyOrdersOrdersDate: string;
  supplyOrdersInterCompany: number;
  supplyOrdersId: number;
}

export interface SupplyOrdersDataInterface {
  PROVIDERS_ORDER: string;
  PROVIDER: string;
  CLIENT_DELIVERY: string;
  CLIENT_INVOICE: string;
  ORDERAMOUNT_NET: number;
  ORDERAMOUNT_BRU: number;
  ORDERREF: string;
  CURRENCY: number;
  SHIPPING_COSTS: number;
  WAREHOUSE: string;
  ORDERS_DATE: string;
  INTERCOMPANY: number;
  ID: number;
}
