
/**
 * View query types enumeration:
 * 'MAIN_TABLE' - to query data for main table view (on the left)
 * 'DETAIL_TABLE' - to query data for detail table view (on the right)
 * 'PURE_SELECT' - to query data for options (currencies, states etc.)
 */
export enum ViewQueryTypes {
    MAIN_TABLE = 'MAIN_TABLE',
    DETAIL_TABLE = 'DETAIL_TABLE',
    PURE_SELECT = 'PURE_SELECT',
    NEW_ITEM = 'NEW_ITEM'
}
