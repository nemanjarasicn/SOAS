export interface OrderPositionInterface {
    id: number;
    orderNumber: string;
    articleNumber: string;
    articleDescription: string;
    categorySoas: string;
    orderQuantity: number;
    assignedQuantity: number;
    deliveredQuantity: number;
    priceNetto: number;
    priceBrutto: number;
    currency: string;
    positionStatus: number;
    positionId: number;
    parentLineId: number;
    warehouse: string;
    distComponentsId: number;
}

export interface OrderPositionDataInterface {
    ID: number;
    ORDERS_NUMBER: string;
    ITMNUM: string;
    ITMDES: string;
    CATEGORY_SOAS: string;
    ORDER_QTY: number;
    ASSIGNED_QTY: number;
    DELIVERED_QTY: number;
    PRICE_NET: number;
    PRICE_BRU: number;
    CURRENCY: string;
    POSITION_STATUS: number;
    POSITION_ID: number;
    PARENT_LINE_ID: number;
    WAREHOUSE: string;
    DIST_COMPONENTS_ID: number;
}
