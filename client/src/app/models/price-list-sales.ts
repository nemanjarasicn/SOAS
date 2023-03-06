export class PriceListSales {

  constructor(
    public ID: number,
    public ITMNUM: string,
    public PRICE_NET: number,
    public PRICE_BRU: number,
    public CURRENCY: string,
    public PRILIST: string,
    public CUSGRP: string,
    public START_DATE: string,
    public END_DATE: string,
    public PRIORITY: number,
  ) {  }

}
