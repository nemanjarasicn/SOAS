import {DeliveryNoteInterface, DeliveryNoteDataInterface} from "./interfaces/DeliveryNoteInterface";
import {constants} from "../constants/constants";
import {mssqlCallEscaped} from "../mssql_call";
import * as sql from 'mssql';

export class DeliveryNote implements DeliveryNoteInterface {
    private _deliveryNoteNumber: string;
    private _shippingDate: string;
    private _exportPrint: boolean;
    private _deliveryNoteState: number;
    private _retour: boolean;
    private _orderNumber: string;
    private _pdfCreatedDate: string;
    private _pdfDownloadLink: string;
    private _customersNumber: string;
    private _deliveryRelease: boolean;
    private _deliveryCurrency: string;
    private _partlyDelivery: boolean;

    constructor(deliveryNoteData: DeliveryNoteDataInterface) {
        this._deliveryNoteNumber = deliveryNoteData.DELIVERY_NOTES_NUMBER;
        this._shippingDate = deliveryNoteData.SHIPPING_DATE;
        this._exportPrint = deliveryNoteData.EXPORT_PRINT;
        this._deliveryNoteState = deliveryNoteData.DELIVERY_NOTES_STATE;
        this._retour = deliveryNoteData.RETOUR;
        this._orderNumber = deliveryNoteData.ORDERS_NUMBER;
        this._pdfCreatedDate = deliveryNoteData.PDF_CREATED_DATE;
        this._pdfDownloadLink = deliveryNoteData.PDF_DOWNLOAD_LINK;
        this._customersNumber = deliveryNoteData.CUSTOMERS_NUMBER;
        this._deliveryRelease = deliveryNoteData.RELEASE;
        this._deliveryCurrency = deliveryNoteData.CURRENCY;
        this._partlyDelivery = deliveryNoteData.PARTLY_DELIVERY;
    }

    get deliveryNoteData(): DeliveryNoteDataInterface {
        return {
            DELIVERY_NOTES_NUMBER: this._deliveryNoteNumber,
            SHIPPING_DATE: this._shippingDate,
            EXPORT_PRINT: this._exportPrint,
            DELIVERY_NOTES_STATE: this._deliveryNoteState,
            RETOUR: this._retour,
            ORDERS_NUMBER: this._orderNumber,
            PDF_CREATED_DATE: this._pdfCreatedDate,
            PDF_DOWNLOAD_LINK: this._pdfDownloadLink,
            CUSTOMERS_NUMBER: this._customersNumber,
            RELEASE: this._deliveryRelease,
            CURRENCY: this._deliveryCurrency,
            PARTLY_DELIVERY: this._partlyDelivery,
        }
    }

    get customersNumber(): string {
        return this._customersNumber;
    }

    set customersNumber(value: string) {
        this._customersNumber = value;
    }

    get deliveryNoteNumber(): string {
        return this._deliveryNoteNumber;
    }

    set deliveryNoteNumber(value: string) {
        this._deliveryNoteNumber = value;
    }

    get shippingDate(): string {
        return this._shippingDate;
    }

    set shippingDate(value: string) {
        this._shippingDate = value;
    }

    get exportPrint(): boolean {
        return this._exportPrint;
    }

    set exportPrint(value: boolean) {
        this._exportPrint = value;
    }

    get deliveryNoteState(): number {
        return this._deliveryNoteState;
    }

    set deliveryNoteState(value: number) {
        this._deliveryNoteState = value;
    }

    get retour(): boolean {
        return this._retour;
    }

    set retour(value: boolean) {
        this._retour = value;
    }

    get orderNumber(): string {
        return this._orderNumber;
    }

    set orderNumber(value: string) {
        this._orderNumber = value;
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

    get deliveryRelease(): boolean {
        return this._deliveryRelease;
    }

    set deliveryRelease(value: boolean) {
        this._deliveryRelease = value;
    }

    get deliveryCurrency(): string {
        return this._deliveryCurrency;
    }

    set deliveryCurrency(value: string) {
        this._deliveryCurrency = value;
    }

    get partlyDelivery(): boolean {
        return this._partlyDelivery;
    }

    set partlyDelivery(value: boolean) {
        this._partlyDelivery = value;
    }

    static async getLas5tDigitsForDeliveryNumber(lastNumber: string): Promise<number>{
        return +lastNumber.slice(
            lastNumber.length - constants.MINIMUM_NUMBER_LENGTH_ORDERS_NUMBER,
            lastNumber.length
        )
    }

    static async getDeliveryNoteNumber(startParam): Promise<{lastNum: string}[]>{
        const sqlQuery = `SELECT TOP 1 DELIVERY_NOTES_NUMBER AS lastNum FROM DELIVERY_NOTES 
            WHERE DELIVERY_NOTES_NUMBER LIKE @LIKE 
            ORDER BY DELIVERY_NOTES_NUMBER DESC`

        const params = [{
            name: 'LIKE',
            type: sql.NVarChar,
            value: `${startParam}%`
        }]

        return await mssqlCallEscaped(params, sqlQuery)
    }
}
