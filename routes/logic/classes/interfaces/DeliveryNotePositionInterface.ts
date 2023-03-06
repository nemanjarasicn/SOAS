export interface DeliveryNotePositionInterface {
    id: number;
    deliveryNoteNumber: string;
    orderNumber: string;
    articleNumber: string;
    positionId: number;
    categorySoas: string;
    orderQuantity: number;
    weightPerItem: number;
    deliveryQty: number;
    ordersPositionsId: number;
    parentLineId: number;
    positionStatus: number;
}

export interface DeliveryNotePositionDataInterface {
    ID: number;
    DELIVERY_NOTES_NUMBER: string;
    ORDERS_NUMBER: string;
    ITMNUM: string;
    POSITION_ID: number;
    CATEGORY_SOAS: string;
    ORDER_QTY: number;
    WEIGHT_PER: number;
    DELIVERY_QTY: number;
    ORDERS_POSITIONS_ID: number;
    PARENT_LINE_ID: number;
    POSITION_STATUS: number;
}
