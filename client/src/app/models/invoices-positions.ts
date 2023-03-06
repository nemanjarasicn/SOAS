import {InvoicePositionItem} from "../interfaces/invoice-position-item";

export class InvoicesPositions implements InvoicePositionItem{
  constructor(
    public ID: number,
    public INVOICES_NUMBER: string,
    public ORDERS_NUMBER: string,
    public DELIVERY_NOTES_NUMBER: string,
    public ITMNUM: string,
    public CATEGORY_SOAS: string,
    public ORDER_QTY: number,
    public DELIVERY_QTY: number,
    public PRICE_NET: number,
    public PRICE_BRU: number,
    public CURRENCY: string,
    public DELIVERY_NOTES_POSITIONS_ID: number,
    public PARENT_LINE_ID: number,
    public POSITION_STATUS: number,
    public POSITION_ID: number,
    public ITMDES: string,
    public SALES_LOCATION: string,
    public TAX_AMOUNT: number
  ) {
  }
}

