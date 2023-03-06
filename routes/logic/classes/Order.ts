import {OrderInterface, OrderDataInterface} from "./interfaces/OrderInterface";

export class Order implements OrderInterface {
    private _orderNumber: string;
    private _orderClient: string;
    private _orderType: string;
    private _customerOrderNumber: string;
    private _customerAddressesIdDelivery: number;
    private _customerAddressesIdInvoice: number;
    private _customerDeliveryNumber: string;
    private _customerInvoiceNumber: string;
    private _orderDate: string;
    private _orderAmountNet: number;
    private _orderAmountBrut: number;
    private _customerOrderRef: string;
    private _orderLastDelivery: string;
    private _orderLastInvoice: string;
    private _orderEdiOrderResponseSent: string;
    private _orderPaymentTermId: number;
    private _orderRelease: boolean;
    private _orderPayed: boolean;
    private _orderCurrency: string;
    private _orderState: number;
    private _webshopId: number;
    private _webshopOrderRef: string;
    private _discount: number;
    private _voucher: number;
    private _shippingCosts: number;
    private _warehouse: string;
    private _salesLocation: string;

    constructor(orderData : OrderDataInterface) {
        this._orderNumber = orderData.ORDERS_NUMBER;
        this._orderClient = orderData.CLIENT;
        this._orderType = orderData.ORDERS_TYPE;
        this._customerOrderNumber = orderData.CUSTOMER_ORDER;
        this._customerAddressesIdDelivery = orderData.CUSTOMER_ADDRESSES_ID_DELIVERY;
        this._customerAddressesIdInvoice = orderData.CUSTOMER_ADDRESSES_ID_INVOICE;
        this._customerDeliveryNumber = orderData.CUSTOMER_DELIVERY;
        this._customerInvoiceNumber = orderData.CUSTOMER_INVOICE;
        this._orderDate = orderData.ORDERS_DATE;
        this._orderAmountNet = orderData.ORDERAMOUNT_NET;
        this._orderAmountBrut = orderData.ORDERAMOUNT_BRU;
        this._customerOrderRef = orderData.CUSTOMER_ORDERREF;
        this._orderLastDelivery = orderData.LAST_DELIVERY;
        this._orderLastInvoice = orderData.LAST_INVOICE;
        this._orderEdiOrderResponseSent = orderData.EDI_ORDERRESPONSE_SENT;
        this._orderPaymentTermId = orderData.PAYMENT_TERM_ID;
        this._orderRelease = orderData.RELEASE;
        this._orderPayed = orderData.PAYED;
        this._orderCurrency = orderData.CURRENCY;
        this._orderState = orderData.ORDERS_STATE;
        this._webshopId = orderData.WEBSHOP_ID;
        this._webshopOrderRef = orderData.WEBSHOP_ORDER_REF;
        this._discount = orderData.DISCOUNT;
        this._voucher = orderData.VOUCHER;
        this._shippingCosts = orderData.SHIPPING_COSTS;
        this._warehouse = orderData.WAREHOUSE;
        this._salesLocation = orderData.SALES_LOCATION;
    }

    /**
     * each order need this format
     */
    get orderData() : OrderDataInterface {
        return {
            ORDERS_NUMBER: this._orderNumber,
            CLIENT: this._orderClient,
            ORDERS_TYPE: this._orderType,
            CUSTOMER_ORDER: this._customerOrderNumber,
            CUSTOMER_ADDRESSES_ID_DELIVERY: this._customerAddressesIdDelivery,
            CUSTOMER_ADDRESSES_ID_INVOICE: this._customerAddressesIdInvoice,
            CUSTOMER_DELIVERY: this._customerDeliveryNumber,
            CUSTOMER_INVOICE: this._customerInvoiceNumber,
            ORDERS_DATE: this._orderDate,
            ORDERAMOUNT_NET: this._orderAmountNet,
            ORDERAMOUNT_BRU: this._orderAmountBrut,
            CUSTOMER_ORDERREF: this._customerOrderRef,
            LAST_DELIVERY: this._orderLastDelivery,
            LAST_INVOICE: this._orderLastInvoice,
            EDI_ORDERRESPONSE_SENT: this._orderEdiOrderResponseSent,
            PAYMENT_TERM_ID: this._orderPaymentTermId,
            RELEASE: this._orderRelease,
            PAYED: this._orderPayed,
            CURRENCY: this._orderCurrency,
            ORDERS_STATE: this._orderState,
            WEBSHOP_ID: this._webshopId,
            WEBSHOP_ORDER_REF: this._webshopOrderRef,
            DISCOUNT: this._discount,
            VOUCHER: this._voucher,
            SHIPPING_COSTS: this._shippingCosts,
            WAREHOUSE: this._warehouse,
            SALES_LOCATION: this._salesLocation
        }
    }

    get customerOrderRef(): string {
        return this._customerOrderRef;
    }

    set customerOrderRef(value: string) {
        this._customerOrderRef = value;
    }

    get orderNumber(): string {
        return this._orderNumber;
    }

    set orderNumber(value: string) {
        this._orderNumber = value;
    }

    get orderClient(): string {
        return this._orderClient;
    }

    set orderClient(value: string) {
        this._orderClient = value;
    }

    get orderType(): string {
        return this._orderType;
    }

    set orderType(value: string) {
        this._orderType = value;
    }

    get customerOrderNumber(): string {
        return this._customerOrderNumber;
    }

    set customerOrderNumber(value: string) {
        this._customerOrderNumber = value;
    }

    get customerAddressesIdDelivery(): number {
        return this._customerAddressesIdDelivery;
    }

    set customerAddressesIdDelivery(value: number) {
        this._customerAddressesIdDelivery = value;
    }

    get customerAddressesIdInvoice(): number {
        return this._customerAddressesIdInvoice;
    }

    set customerAddressesIdInvoice(value: number) {
        this._customerAddressesIdInvoice = value;
    }

    get customerDeliveryNumber(): string {
        return this._customerDeliveryNumber;
    }

    set customerDeliveryNumber(value: string) {
        this._customerDeliveryNumber = value;
    }

    get customerInvoiceNumber(): string {
        return this._customerInvoiceNumber;
    }

    set customerInvoiceNumber(value: string) {
        this._customerInvoiceNumber = value;
    }

    get orderDate(): string {
        return this._orderDate;
    }

    set orderDate(value: string) {
        this._orderDate = value;
    }

    get orderAmountNet(): number {
        return this._orderAmountNet;
    }

    set orderAmountNet(value: number) {
        this._orderAmountNet = value;
    }

    get orderAmountBrut(): number {
        return this._orderAmountBrut;
    }

    set orderAmountBrut(value: number) {
        this._orderAmountBrut = value;
    }

    get orderLastDelivery(): string {
        return this._orderLastDelivery;
    }

    set orderLastDelivery(value: string) {
        this._orderLastDelivery = value;
    }

    get orderLastInvoice(): string {
        return this._orderLastInvoice;
    }

    set orderLastInvoice(value: string) {
        this._orderLastInvoice = value;
    }

    get orderEdiOrderResponseSent(): string {
        return this._orderEdiOrderResponseSent;
    }

    set orderEdiOrderResponseSent(value: string) {
        this._orderEdiOrderResponseSent = value;
    }

    get orderPaymentTermId(): number {
        return this._orderPaymentTermId;
    }

    set orderPaymentTermId(value: number) {
        this._orderPaymentTermId = value;
    }

    get orderRelease(): boolean {
        return this._orderRelease;
    }

    set orderRelease(value: boolean) {
        this._orderRelease = value;
    }

    get orderPayed(): boolean {
        return this._orderPayed;
    }

    set orderPayed(value: boolean) {
        this._orderPayed = value;
    }

    get orderCurrency(): string {
        return this._orderCurrency;
    }

    set orderCurrency(value: string) {
        this._orderCurrency = value;
    }

    get orderState(): number {
        return this._orderState;
    }

    set orderState(value: number) {
        this._orderState = value;
    }

    get webshopId(): number {
        return this._webshopId;
    }

    set webshopId(value: number) {
        this._webshopId = value;
    }

    get webshopOrderRef(): string {
        return this._webshopOrderRef;
    }

    set webshopOrderRef(value: string) {
        this._webshopOrderRef = value;
    }

    get discount(): number {
        return this._discount;
    }

    set discount(value: number) {
        this._discount = value;
    }

    get voucher(): number {
        return this._voucher;
    }

    set voucher(value: number) {
        this._voucher = value;
    }

    get shippingCosts(): number {
        return this._shippingCosts;
    }

    set shippingCosts(value: number) {
        this._shippingCosts = value;
    }

    get warehouse(): string {
        return this._warehouse;
    }

    set warehouse(value: string) {
        this._warehouse = value;
    }

    get salesLocation(): string {
        return this._salesLocation;
    }

    set salesLocation(value: string) {
        this._salesLocation = value;
    }
}
