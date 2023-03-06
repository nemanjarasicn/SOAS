export interface OrderPositionItem {
  ID?: number;
  POS?: number; // virtual column for showing position number in view
  ORDERS_NUMBER?: string;
  ITMNUM?: string;
  ITMDES?: string;
  CATEGORY_SOAS?: string;
  ORDER_QTY?: number;
  ASSIGNED_QTY?: number;
  DELIVERED_QTY?: number;
  PRICE_NET?: number;
  PRICE_BRU?: number;
  CURRENCY?: string;
  POSITION_STATUS?: number;
  POSITION_ID?: number;
  PARENT_LINE_ID?: number;
  WAREHOUSE?: string;
  DIST_COMPONENTS_ID?: number;
  TAX_AMOUNT?: number;
}
