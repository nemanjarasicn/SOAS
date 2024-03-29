export interface OrderInterface {
    orderNumber: string;
    orderClient: string;
    orderType: string;
    customerOrderNumber: string;
    customerAddressesIdDelivery: number;
    customerAddressesIdInvoice: number;
    customerDeliveryNumber: string;
    customerInvoiceNumber: string;
    orderDate: string;
    orderAmountNet: number;
    orderAmountBrut: number;
    customerOrderRef: string;
    orderLastDelivery: string;
    orderLastInvoice: string;
    orderEdiOrderResponseSent: string;
    orderPaymentTermId: number;
    orderRelease: boolean;
    orderPayed: boolean;
    orderCurrency: string;
    orderState: number;
    webshopId: number;
    webshopOrderRef: string;
    discount: number;
    voucher: number;
    shippingCosts: number;
    warehouse: string;
    salesLocation: string;
}

export interface OrderDataInterface {
    ORDERS_NUMBER: string;
    CLIENT: string;
    ORDERS_TYPE: string;
    CUSTOMER_ORDER: string;
    CUSTOMER_ADDRESSES_ID_DELIVERY: number;
    CUSTOMER_ADDRESSES_ID_INVOICE: number;
    CUSTOMER_DELIVERY: string;
    CUSTOMER_INVOICE: string;
    ORDERS_DATE: string;
    ORDERAMOUNT_NET: number;
    ORDERAMOUNT_BRU: number;
    CUSTOMER_ORDERREF: string;
    LAST_DELIVERY: string;
    LAST_INVOICE: string;
    EDI_ORDERRESPONSE_SENT: string;
    PAYMENT_TERM_ID: number;
    RELEASE: boolean;
    PAYED: boolean;
    CURRENCY: string;
    ORDERS_STATE: number;
    WEBSHOP_ID: number;
    WEBSHOP_ORDER_REF: string;
    DISCOUNT: number;
    VOUCHER: number;
    SHIPPING_COSTS: number;
    WAREHOUSE: string;
    SALES_LOCATION: string;
}
