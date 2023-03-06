export interface SupplyOrdersPositionsInterface {
  supplyOrdersPositionsId: number;
  supplyOrdersPositionsProvidersOrder: string;
  supplyOrdersPositionsItmnum: string;
  supplyOrdersPositionsOrderQty: number;
  supplyOrdersPositionsPriceNet: number;
  supplyOrdersPositionsPriceBru: number;
  supplyOrdersPositionsScheduledArrival: string;
  supplyOrdersPositionsSuppliedQty: number;
  supplyOrdersPositionsWarehouse: string;
}

export interface SupplyOrdersPositionsDataInterface {
  ID: number;
  PROVIDERS_ORDER: string;
  ITMNUM: string;
  ORDER_QTY: number;
  PRICE_NET: number;
  PRICE_BRU: number;
  SCHEDULED_ARRIVAL: string;
  SUPPLIED_QTY: number;
  WAREHOUSE: string;
}
