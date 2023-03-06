export interface InvoicePositionsInterface {
    id: number;
    invoiceNumber : string;
    orderNumber : string;
    deliveryNoteNumber : string;
    articleNumber : string;
    categorySoas: string;
    orderQuantity : number;
    deliveryQuantity : number;
    priceNetto: number;
    priceBrutto: number;
    currency : string;
    deliveryNotesPositionsId: number;
    parentLineId: number;
    positionStatus: number;
    positionId: number;
    articleDescription: string;
    salesLocation: string;
    taxAmount: number;
}

export interface InvoicePositionsDataInterface {
    ID: number;
    INVOICES_NUMBER: string;
    ORDERS_NUMBER: string;
    DELIVERY_NOTES_NUMBER: string;
    ITMNUM: string;
    CATEGORY_SOAS: string;
    ORDER_QTY: number;
    DELIVERY_QTY: number;
    PRICE_NET: number;
    PRICE_BRU: number;
    CURRENCY: string;
    DELIVERY_NOTES_POSITIONS_ID: number;
    PARENT_LINE_ID: number;
    POSITION_STATUS: number;
    POSITION_ID: number;
    ITMDES: string;
    SALES_LOCATION: string;
    TAX_AMOUNT: number;
}
