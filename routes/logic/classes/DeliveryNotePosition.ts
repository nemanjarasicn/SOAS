import {DeliveryNotePositionInterface, DeliveryNotePositionDataInterface} from "./interfaces/DeliveryNotePositionInterface";

export class DeliveryNotePosition implements DeliveryNotePositionInterface {
    private _id: number;
    private _deliveryNoteNumber: string;
    private _orderNumber: string;
    private _articleNumber: string;
    private _positionId: number;
    private _categorySoas: string;
    private _orderQuantity: number;
    private _weightPerItem: number;
    private _deliveryQty: number;
    private _ordersPositionsId: number;
    private _parentLineId: number;
    private _positionStatus: number;

    constructor(deliveryNotePositionData: DeliveryNotePositionDataInterface) {
        this._id = deliveryNotePositionData.ID;
        this._deliveryNoteNumber = deliveryNotePositionData.DELIVERY_NOTES_NUMBER;
        this._orderNumber = deliveryNotePositionData.ORDERS_NUMBER;
        this._articleNumber = deliveryNotePositionData.ITMNUM;
        this._positionId = deliveryNotePositionData.POSITION_ID;
        this._categorySoas = deliveryNotePositionData.CATEGORY_SOAS;
        this._orderQuantity = deliveryNotePositionData.ORDER_QTY;
        this._weightPerItem = deliveryNotePositionData.WEIGHT_PER;
        this._deliveryQty = deliveryNotePositionData.DELIVERY_QTY;
        this._ordersPositionsId = deliveryNotePositionData.ORDERS_POSITIONS_ID;
        this._parentLineId = deliveryNotePositionData.PARENT_LINE_ID;
        this._positionStatus = deliveryNotePositionData.POSITION_STATUS;
    }

    get deliveryNotePositionData(): DeliveryNotePositionDataInterface {
        return {
            ID: this._id,
            DELIVERY_NOTES_NUMBER: this._deliveryNoteNumber,
            ORDERS_NUMBER: this._orderNumber,
            ITMNUM: this._articleNumber,
            POSITION_ID: this._positionId,
            CATEGORY_SOAS: this._categorySoas,
            ORDER_QTY: this._orderQuantity,
            WEIGHT_PER: this._weightPerItem,
            DELIVERY_QTY: this._deliveryQty,
            ORDERS_POSITIONS_ID: this._ordersPositionsId,
            PARENT_LINE_ID: this._parentLineId,
            POSITION_STATUS: this._positionStatus,
        }
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get deliveryNoteNumber(): string {
        return this._deliveryNoteNumber;
    }

    set deliveryNoteNumber(value: string) {
        this._deliveryNoteNumber = value;
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
    get positionId(): number {
        return this._positionId;
    }

    set positionId(value: number) {
        this._positionId = value;
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

    get weightPerItem(): number {
        return this._weightPerItem;
    }

    set weightPerItem(value: number) {
        this._weightPerItem = value;
    }

    get deliveryQty(): number {
        return this._deliveryQty;
    }

    set deliveryQty(value: number) {
        this._deliveryQty = value;
    }

    get ordersPositionsId(): number {
        return this._ordersPositionsId;
    }

    set ordersPositionsId(value: number) {
        this._ordersPositionsId = value;
    }

    get parentLineId(): number {
        return this._parentLineId;
    }

    set parentLineId(value: number) {
        this._parentLineId = value;
    }

    get positionStatus(): number {
        return this._positionStatus;
    }

    set positionStatus(value: number) {
        this._positionStatus = value;
    }
}
