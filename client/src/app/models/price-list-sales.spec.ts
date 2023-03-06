import {PriceListSales} from "./price-list-sales";
import {PriceListSalesTestConstants} from "../../assets/test-constants/price-list-sales";

describe('PriceListSales', () => {
  it('should create an instance', () => {
    // Arrange
    const ID: number = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.ID;
    const ITMNUM: string = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.ITMNUM;
    const PRICE_NET: number = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.PRICE_NET;
    const PRICE_BRU: number = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.PRICE_BRU;
    const CURRENCY: string = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.CURRENCY;
    const PRILIST: string = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.PRILIST;
    const CUSGRP: string = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.CUSGRP;
    const START_DATE: string = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.START_DATE;
    const END_DATE: string = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.END_DATE;
    const PRIORITY: number = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.PRIORITY;

    // Act & Assert
    expect(new PriceListSales(ID, ITMNUM, PRICE_NET, PRICE_BRU, CURRENCY, PRILIST, CUSGRP, START_DATE, END_DATE,
      PRIORITY)
    ).toBeTruthy();
  });
});
