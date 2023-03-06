export class DeliveryNotesPositions {
  constructor(
    public ID: number,
    public DELIVERY_NOTES_NUMBER: string,
    public ORDERS_NUMBER: string,
    public ITMNUM: string,
    public CATEGORY_SOAS: string,
    public ORDER_QTY: number,
    public WEIGHT_PER: number,
    public DELIVERY_QTY: number,
    public ORDERS_POSITIONS_ID: number,
    public PARENT_LINE_ID: number,
    public POSITION_STATUS: number,
    public TAX_AMOUNT: number
  ) {
  }
}

