import {OrderPositionItem} from "../interfaces/order-position-item";

export class OrdersPositions implements OrderPositionItem {
  constructor(
    public ID: number,
    public ORDERS_NUMBER: string,
    public ITMNUM: string,
    public ITMDES: string,
    public CATEGORY_SOAS: string,
    public ORDER_QTY: number,
    public ASSIGNED_QTY: number,
    public DELIVERED_QTY: number,
    public PRICE_NET: number,
    public PRICE_BRU: number,
    public CURRENCY: string,
    public POSITION_STATUS: number,
    public POSITION_ID: number,
    public PARENT_LINE_ID: number,
    public WAREHOUSE: string,
    public DIST_COMPONENTS_ID: number,
    public TAX_AMOUNT: number
  ) {
  }
}
