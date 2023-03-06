export interface DeliveryNoteInterface {
    deliveryNoteNumber: string;
    shippingDate: string;
    exportPrint: boolean;
    deliveryNoteState: number;
    retour: boolean;
    orderNumber: string;
    pdfCreatedDate: string;
    pdfDownloadLink: string;
    customersNumber: string;
    deliveryRelease: boolean;
    deliveryCurrency: string;
    partlyDelivery: boolean;
}

export interface DeliveryNoteDataInterface {
    DELIVERY_NOTES_NUMBER: string;
    SHIPPING_DATE: string;
    EXPORT_PRINT: boolean;
    DELIVERY_NOTES_STATE: number;
    RETOUR: boolean;
    ORDERS_NUMBER: string;
    PDF_CREATED_DATE: string;
    PDF_DOWNLOAD_LINK: string;
    CUSTOMERS_NUMBER: string;
    RELEASE: boolean;
    CURRENCY: string;
    PARTLY_DELIVERY: boolean;
}
