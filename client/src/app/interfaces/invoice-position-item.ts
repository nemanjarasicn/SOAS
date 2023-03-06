export interface InvoicePositionItem {
  ID?: number;
  POS?: number; // virtual column for showing position number in view
  INVOICES_NUMBER?: string;
  DELIVERY_NOTES_NUMBER?: string;
  ORDERS_NUMBER?: string;
  ITMNUM?: string;
  CATEGORY_SOAS?: string;
  ORDER_QTY?: number;
  DELIVERY_QTY?: number;
  PRICE_NET?: number;
  PRICE_BRU?: number;
  CURRENCY?: string;
  DELIVERY_NOTES_POSITIONS_ID?: number;
  PARENT_LINE_ID?: number;
  POSITION_STATUS?: number;
  POSITION_ID?: number;
  ITMDES?: string;
  SALES_LOCATION?: string;
  TAX_AMOUNT?: number;
}
