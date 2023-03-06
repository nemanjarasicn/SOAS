/**
 * articles components (DIST_COMPONENTS) constants for unit tests
 */
export class ComponentsTestConstants {

  /**
   * Components table data returned by:
   * let tableDbData = await tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_COMPONENTS,
   * ViewQueryTypes.DETAIL_TABLE, 'ITMNUM', currentOrderPosition.ITMNUM);
   */
  public static COMPONENTS_TABLE_DB_DATA: { table: [any[string], any[]], maxRows: number, page: number } = {
    "table": [
      "ID, ITMNUM, COMPNUM, DIST_QTY",
      [
        {
          ID: 11503,
          ITMNUM: "MARS600SET000104DE",
          COMPNUM: "B101010104DE",
          DIST_QTY: 1
        },
        {
          ID: 11504,
          ITMNUM: "MARS600SET000104DE",
          COMPNUM: "A10104",
          DIST_QTY: 1
        },
        {
          ID: 11828,
          ITMNUM: "MARS600SET000104DE",
          COMPNUM: "BMCN115",
          DIST_QTY: 1
        }
      ]
    ],
    "maxRows": 39220,
    "page": 0
  };
}
