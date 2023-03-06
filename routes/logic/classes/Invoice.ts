import {InvoiceInterface, InvoiceDataInterface} from "./interfaces/InvoiceInterface";
import {constants} from "../constants/constants";
import * as sql from 'mssql';
import {mssqlCallEscaped} from "../mssql_call";

export class Invoice implements InvoiceInterface {
    private _invoiceNumber: string;
    private _invoiceCustomerNumber: string;
    private _invoiceDate: string;
    private _invoiceCreator: string;
    private _invoiceUpdate: string;
    private _invoiceState: number;
    private _paymentTermId: string;
    private _deliveryNotesNumber: string;
    private _orderNumber: string;
    private _isPayed: boolean;
    private _pdfCreatedDate: string;
    private _pdfDownloadLink: string;
    private _invoiceRelease: boolean;
    private _invoiceCurrency: string;
    private _partlyInvoice: boolean;
    private _salesLocation: string;
    private _warehouse: string;
    private _taxCode: string;
    private _taxAmount: number;
    private _netOrder: number;
    private _customerAddressesIdDelivery: number;
    private _customerAddressesIdInvoice: number;
    private _invoicesAmountBru: number;
    private _invoicesAmountNet: number;

    constructor(invoiceData: InvoiceDataInterface) {
        this._invoiceNumber = invoiceData.INVOICES_NUMBER;
        this._invoiceCustomerNumber = invoiceData.INVOICES_CUSTOMER;
        this._invoiceDate = invoiceData.INVOICES_DATE;
        this._invoiceCreator = invoiceData.INVOICES_CREATOR;
        this._invoiceUpdate = invoiceData.INVOICES_UPDATE;
        this._invoiceState = invoiceData.INVOICES_STATE;
        this._paymentTermId = invoiceData.PAYMENT_TERM_ID;
        this._deliveryNotesNumber = invoiceData.DELIVERY_NOTES_NUMBER;
        this._orderNumber = invoiceData.ORDERS_NUMBER;
        this._isPayed = invoiceData.PAYED;
        this._pdfCreatedDate = invoiceData.PDF_CREATED_DATE;
        this._pdfDownloadLink = invoiceData.PDF_DOWNLOAD_LINK;
        this._invoiceRelease = invoiceData.RELEASE;
        this._invoiceCurrency = invoiceData.CURRENCY;
        this._partlyInvoice = invoiceData.PARTLY_INVOICE;
        this._salesLocation = invoiceData.SALES_LOCATION;
        this._warehouse = invoiceData.WAREHOUSE;
        this._taxCode = invoiceData.TAXCODE;
        this._taxAmount = invoiceData.TAX_AMOUNT;
        this._netOrder = invoiceData.NET_ORDER;
        this._customerAddressesIdDelivery = invoiceData.CUSTOMER_ADDRESSES_ID_DELIVERY;
        this._customerAddressesIdInvoice = invoiceData.CUSTOMER_ADDRESSES_ID_INVOICE;
        this._invoicesAmountBru = invoiceData.INVOICES_AMOUNT_BRU;
        this._invoicesAmountNet = invoiceData.INVOICES_AMOUNT_NET;
    }

    get invoiceData(): InvoiceDataInterface {
        return {
            INVOICES_NUMBER: this._invoiceNumber,
            INVOICES_CUSTOMER: this._invoiceCustomerNumber,
            INVOICES_DATE: this._invoiceDate,
            INVOICES_CREATOR: this._invoiceCreator,
            INVOICES_UPDATE: this._invoiceUpdate,
            INVOICES_STATE: this._invoiceState,
            PAYMENT_TERM_ID: this._paymentTermId,
            DELIVERY_NOTES_NUMBER: this._deliveryNotesNumber,
            ORDERS_NUMBER: this._orderNumber,
            PAYED: this._isPayed,
            PDF_CREATED_DATE: this._pdfCreatedDate,
            PDF_DOWNLOAD_LINK: this._pdfDownloadLink,
            RELEASE: this._invoiceRelease,
            CURRENCY: this._invoiceCurrency,
            PARTLY_INVOICE: this._partlyInvoice,
            SALES_LOCATION: this._salesLocation,
            WAREHOUSE: this._warehouse,
            TAXCODE: this._taxCode,
            TAX_AMOUNT: this._taxAmount,
            NET_ORDER: this._netOrder,
            CUSTOMER_ADDRESSES_ID_DELIVERY: this._customerAddressesIdDelivery,
            CUSTOMER_ADDRESSES_ID_INVOICE: this._customerAddressesIdInvoice,
            INVOICES_AMOUNT_BRU: this._invoicesAmountBru,
            INVOICES_AMOUNT_NET: this._invoicesAmountNet
        }
    }

    get invoiceNumber(): string {
        return this._invoiceNumber;
    }

    set invoiceNumber(value: string) {
        this._invoiceNumber = value;
    }

    get invoiceCustomerNumber(): string {
        return this._invoiceCustomerNumber;
    }

    set invoiceCustomerNumber(value: string) {
        this._invoiceCustomerNumber = value;
    }

    get invoiceDate(): string {
        return this._invoiceDate;
    }

    set invoiceDate(value: string) {
        this._invoiceDate = value;
    }

    get invoiceCreator(): string {
        return this._invoiceCreator;
    }

    set invoiceCreator(value: string) {
        this._invoiceCreator = value;
    }

    get invoiceUpdate(): string {
        return this._invoiceUpdate;
    }

    set invoiceUpdate(value: string) {
        this._invoiceUpdate = value;
    }

    get invoiceState(): number {
        return this._invoiceState;
    }

    set invoiceState(value: number) {
        this._invoiceState = value;
    }

    get paymentTermId(): string {
        return this._paymentTermId;
    }

    set paymentTermId(value: string) {
        this._paymentTermId = value;
    }

    get deliveryNotesNumber(): string {
        return this._deliveryNotesNumber;
    }

    set deliveryNotesNumber(value: string) {
        this._deliveryNotesNumber = value;
    }

    get orderNumber(): string {
        return this._orderNumber;
    }

    set orderNumber(value: string) {
        this._orderNumber = value;
    }

    get isPayed(): boolean {
        return this._isPayed;
    }

    set isPayed(value: boolean) {
        this._isPayed = value;
    }

    get pdfCreatedDate(): string {
        return this._pdfCreatedDate;
    }

    set pdfCreatedDate(value: string) {
        this._pdfCreatedDate = value;
    }

    get pdfDownloadLink(): string {
        return this._pdfDownloadLink;
    }

    set pdfDownloadLink(value: string) {
        this._pdfDownloadLink = value;
    }

    get invoiceRelease(): boolean {
        return this._invoiceRelease;
    }

    set invoiceRelease(value: boolean) {
        this._invoiceRelease = value;
    }

    get invoiceCurrency(): string {
        return this._invoiceCurrency;
    }

    set invoiceCurrency(value: string) {
        this._invoiceCurrency = value;
    }

    get partlyInvoice(): boolean {
        return this._partlyInvoice;
    }

    set partlyInvoice(value: boolean) {
        this._partlyInvoice = value;
    }

    get salesLocation(): string {
        return this._salesLocation;
    }

    set salesLocation(value: string) {
        this._salesLocation = value;
    }

    get warehouse(): string {
        return this._warehouse;
    }

    set warehouse(value: string) {
        this._warehouse = value;
    }

    get taxCode(): string {
        return this._taxCode;
    }

    set taxCode(value: string) {
        this._taxCode = value;
    }

    get taxAmount(): number {
        return this._taxAmount;
    }

    set taxAmount(value: number) {
        this._taxAmount = value;
    }

    get netOrder(): number {
        return this._netOrder;
    }

    set netOrder(value: number) {
        this._netOrder = value;
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

    get invoicesAmountBru(): number {
        return this._invoicesAmountBru;
    }

    set invoicesAmountBru(value: number) {
        this._invoicesAmountBru = value;
    }

    get invoicesAmountNet(): number {
        return this._invoicesAmountNet;
    }

    set invoicesAmountNet(value: number) {
        this._invoicesAmountNet = value;
    }

    static async getLastDigitsForDeliveryNumber(lastNumber: string): Promise<number>{
        return +lastNumber.slice(
            lastNumber.length - constants.MINIMUM_NUMBER_LENGTH_INVOICE_NUMBER,
            lastNumber.length
        )
    }

    static async getInvoiceNoteNumber(startParam: string): Promise<{lastNum: string}[]> {
        const sqlQuery = `SELECT TOP 1 INVOICES_NUMBER AS lastNum FROM INVOICES 
        WHERE INVOICES_NUMBER LIKE @LIKE 
        ORDER BY INVOICES_NUMBER DESC`

        const params = [
            {
                name: 'LIKE',
                type: sql.NVarChar,
                value: `${startParam}%`
            }
        ]

        return await mssqlCallEscaped(params, sqlQuery)
    }
}
