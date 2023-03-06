import {SaleOfferInterface, SaleOfferDataInterface} from "./interfaces/SaleOfferInterface";

export class SaleOffer implements SaleOfferInterface {
    private _offerNumber: string;
    private _offerAccepted: boolean;
    private _offerClient: string;
    private _offerType: string;
    private _customerofferNumber: string;
    private _offerDate: string;
    private _offerAmountNet: number;
    private _offerAmountBrut: number;
    private _offerCurrency: string;
    private _discount: number;
    private _shippingCosts: number;
    private _warehouse: string;
    private _offerSalesLocations: string;
    private _offerComment: string;
    private _offerDiscPerc: number;

    constructor(saleOfferData : SaleOfferDataInterface) {
        this._offerNumber = saleOfferData.OFFER_NUMBER;
        this._offerAccepted = saleOfferData.OFFER_ACCEPTED;
        this._offerClient = saleOfferData.CLIENT;
        this._offerType = saleOfferData.ORDERS_TYPE;
        this._offerDate = saleOfferData.OFFER_DATE;
        this._offerAmountNet = saleOfferData.ORDERAMOUNT_NET;
        this._offerAmountBrut = saleOfferData.ORDERAMOUNT_BRU;
        this._offerCurrency = saleOfferData.CURRENCY;
        this._discount = saleOfferData.DISCOUNT;
        this._shippingCosts = saleOfferData.SHIPPING_COSTS;
        this._warehouse = saleOfferData.WAREHOUSE;
        this._offerSalesLocations = saleOfferData.SALES_LOCATION;
        this._offerComment = saleOfferData.COMMENT;
        this._offerDiscPerc = saleOfferData.DISCOUNT_PERC;

        
    }

    /**
     * each order need this format
     */
    get saleOfferData() : SaleOfferDataInterface {
        return {
            OFFER_NUMBER: this._offerNumber,
            OFFER_ACCEPTED: this._offerAccepted,
            CLIENT: this._offerClient,
            ORDERS_TYPE: this._offerType,
            OFFER_DATE: this._offerDate,
            ORDERAMOUNT_NET: this._offerAmountNet,
            ORDERAMOUNT_BRU: this._offerAmountBrut,
            CURRENCY: this._offerCurrency,
            DISCOUNT: this._discount,
            SHIPPING_COSTS: this._shippingCosts,
            WAREHOUSE: this._warehouse,
            SALES_LOCATION: this._offerSalesLocations,
            COMMENT: this._offerComment,
            DISCOUNT_PERC: this._offerDiscPerc
        }
    }
    


    get offerNumber(): string {
        return this._offerNumber;
    }

    set offerNumber(value: string) {
        this._offerNumber = value;
    }

    get offerClient(): string {
        return this._offerClient;
    }

    set offerClient(value: string) {
        this._offerClient = value;
    }

    get offerType(): string {
        return this._offerType;
    }

    set offerType(value: string) {
        this._offerType = value;
    }
    
    get offerDate(): string {
        return this._offerDate;
    }

    set offerDate(value: string) {
        this._offerDate = value;
    }

    get offerAmountNet(): number {
        return this._offerAmountNet;
    }

    set offerAmountNet(value: number) {
        this._offerAmountNet = value;
    }

    get offerAmountBrut(): number {
        return this._offerAmountBrut;
    }

    set offerAmountBrut(value: number) {
        this._offerAmountBrut = value;
    }

   
    get offerCurrency(): string {
        return this._offerCurrency;
    }

    set offerCurrency(value: string) {
        this._offerCurrency = value;
    }

    
    get discount(): number {
        return this._discount;
    }

    set discount(value: number) {
        this._discount = value;
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

    get offerSalesLocations(): string {
        return this._offerSalesLocations;
    }

    set offerSalesLocations(value: string) {
        this._offerSalesLocations = value;
    }


    get offerComment(): string {
        return this._offerComment;
    }

    set offerComment(value: string) {
        this._offerComment = value;
    }

    get offerDiscPerc(): number {
        return this._offerDiscPerc;
    }

    set offerDiscPerc(value: number) {
        this.offerDiscPerc = value;
    }



    get offerAccepted(): boolean {
        return this._offerAccepted;
    }

    set offerAccepted(value: boolean) {
        this._offerAccepted = value;
    }
}
