export interface SupplyOrderPositionItem {
  PROVIDERS_ORDER?: string;
  POS?: number; // virtual column for showing position number in view
  ITMNUM?: string;
  ORDER_QTY?: number;
  PRICE_NET?: number;
  PRICE_BRU?: number;
  SCHEDULED_ARRIVAL?: string;
  SUPPLIED_QTY?: number;
  WAREHOUSE?: string;
  ID?: number;
}
