export interface PricelistSales {
  ID: number;
  POS?: number; // virtual column for showing position number in view
  ITMNUM: string;
  PRICE_NET: number;
  PRICE_BRU: number;
  CURRENCY: string;
  PRILIST: string;
  CUSGRP: string;
  START_DATE: string;
  END_DATE: string;
  PRIORITY: number;
}
