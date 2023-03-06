export interface DeliveryNotePositionItem {
  ID?: number;
  POS?: number; // virtual column for showing position number in view
  DELIVERY_NOTES_NUMBER?: string;
  ORDERS_NUMBER?: string;
  ITMNUM?: string;
  CATEGORY_SOAS?: string;
  ORDER_QTY?: number;
  WEIGHT_PER?: number;
  DELIVERY_QTY?: number;
  ORDERS_POSITIONS_ID?: number;
  PARENT_LINE_ID?: number;
  POSITION_STATUS?: number;
  TAX_AMOUNT?: number;
}
