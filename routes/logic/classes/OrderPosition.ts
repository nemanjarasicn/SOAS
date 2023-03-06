import {OrderPositionInterface , OrderPositionDataInterface} from "./interfaces/OrderPositionInterface";

export class OrderPosition implements OrderPositionInterface {
    private _id: number;
    private _orderNumber: string;
    private _articleNumber: string;
    private _articleDescription: string;
    private _categorySoas: string;
    private _orderQuantity: number;
    private _assignedQuantity: number;
    private _deliveredQuantity: number;
    private _priceNetto: number;
    private _priceBrutto: number;
    private _currency: string;
    private _positionStatus: number;
    private _positionId: number;
    private _parentLineId: number;
    private _warehouse: string;
    private _distComponentsId: number;

    constructor(orderPositionData: OrderPositionDataInterface) {
        this._id = orderPositionData.ID;
        this._orderNumber = orderPositionData.ORDERS_NUMBER;
        this._articleNumber = orderPositionData.ITMNUM;
        this._articleDescription = orderPositionData.ITMDES;
        this._categorySoas = orderPositionData.CATEGORY_SOAS;
        this._orderQuantity = orderPositionData.ORDER_QTY;
        this._assignedQuantity = orderPositionData.ASSIGNED_QTY;
        this._deliveredQuantity = orderPositionData.DELIVERED_QTY;
        this._priceNetto = orderPositionData.PRICE_NET;
        this._priceBrutto = orderPositionData.PRICE_BRU;
        this._currency = orderPositionData.CURRENCY;
        this._positionStatus = orderPositionData.POSITION_STATUS;
        this._positionId = orderPositionData.POSITION_ID;
        this._parentLineId = orderPositionData.PARENT_LINE_ID;
        this._warehouse = orderPositionData.WAREHOUSE;
        this._distComponentsId = orderPositionData.DIST_COMPONENTS_ID;
    }

    get orderPositionData(): OrderPositionDataInterface {
        return {
            ID: this._id,
            ORDERS_NUMBER: this._orderNumber,
            ITMNUM: this._articleNumber,
            ITMDES: this._articleDescription,
            CATEGORY_SOAS: this._categorySoas,
            ORDER_QTY: this._orderQuantity,
            ASSIGNED_QTY: this._assignedQuantity,
            DELIVERED_QTY: this._deliveredQuantity,
            PRICE_NET: this._priceNetto,
            PRICE_BRU: this._priceBrutto,
            CURRENCY: this._currency,
            POSITION_STATUS: this._positionStatus,
            POSITION_ID: this._positionId,
            PARENT_LINE_ID: this._parentLineId,
            WAREHOUSE: this._warehouse,
            DIST_COMPONENTS_ID: this._distComponentsId,
        }
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get orderNumber(): string {
        return this._orderNumber;
    }

    set orderNumber(value: string) {
        this._orderNumber = value;
    }

    get articleNumber(): string {
        return this._articleNumber;
    }

    set articleNumber(value: string) {
        this._articleNumber = value;
    }

    get articleDescription(): string {
        return this._articleDescription;
    }

    set articleDescription(value: string) {
        this._articleDescription = value;
    }

    get categorySoas(): string {
        return this._categorySoas;
    }

    set categorySoas(value: string) {
        this._categorySoas = value;
    }

    get orderQuantity(): number {
        return this._orderQuantity;
    }

    set orderQuantity(value: number) {
        this._orderQuantity = value;
    }

    get assignedQuantity(): number {
        return this._assignedQuantity;
    }

    set assignedQuantity(value: number) {
        this._assignedQuantity = value;
    }

    get deliveredQuantity(): number {
        return this._deliveredQuantity;
    }

    set deliveredQuantity(value: number) {
        this._deliveredQuantity = value;
    }

    get priceNetto(): number {
        return this._priceNetto;
    }

    set priceNetto(value: number) {
        this._priceNetto = value;
    }

    get priceBrutto(): number {
        return this._priceBrutto;
    }

    set priceBrutto(value: number) {
        this._priceBrutto = value;
    }

    get currency(): string {
        return this._currency;
    }

    set currency(value: string) {
        this._currency = value;
    }

    get positionStatus(): number {
        return this._positionStatus;
    }

    set positionStatus(value: number) {
        this._positionStatus = value;
    }

    get positionId(): number {
        return this._positionId;
    }

    set positionId(value: number) {
        this._positionId = value;
    }

    get parentLineId(): number {
        return this._parentLineId;
    }

    set parentLineId(value: number) {
        this._parentLineId = value;
    }

    get warehouse(): string {
        return this._warehouse;
    }

    set warehouse(value: string) {
        this._warehouse = value;
    }

    get distComponentsId(): number {
        return this._distComponentsId;
    }

    set distComponentsId(value: number) {
        this._distComponentsId = value;
    }
}
