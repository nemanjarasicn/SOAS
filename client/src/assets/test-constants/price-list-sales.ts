import {PricelistSales} from "../../app/interfaces/price-list-sales-item";

/**
 * price list sales constants for unit tests
 */
export class PriceListSalesTestConstants {

  public static PRICE_LIST_SALES_ITEM: PricelistSales = {
    ID: 82108,
    ITMNUM: 'APOLLO000101DE',
    PRICE_NET: 168.04000,
    PRICE_BRU: 0.00000,
    CURRENCY: '1',
    PRILIST: 'SPL21-0008',
    CUSGRP: '0900008901',
    START_DATE: '2021-01-01',
    END_DATE: '2029-01-01',
    PRIORITY: 50,
  };



  /**
   * Price list sale table data returned by:
   * let tableDbData = await this.tableDataService.getTableDataByCustomersNumber(this.CONSTANTS.REFTABLE_PRILISTS,
   *  ViewQueryTypes.DETAIL_TABLE, 'ITMNUM', itmnum, 'CUSGRP', customerNumber);
   */
  public static PRICE_LIST_SALES_TABLE_DB_DATA: { table: [any[string], any[]], maxRows: number, page: number } = {
    "table": [
      "ID, ITMNUM, PRICE_NET, PRICE_BRU, CURRENCY, PRILIST, CUSGRP, START_DATE, END_DATE, PRIORITY",
      [
        PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM
      ]
    ],
    "maxRows": 254810,
    "page": 0
  };
}
