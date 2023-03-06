import {WarehouseReservationCacheInterface,WarehouseReservationCacheDataInterface}
from "./interfaces/WarehouseReservationCacheInterface";

export class WarehouseReservationCache implements WarehouseReservationCacheInterface {

    private _warehouseRCId: number;
    private _warehouseRCDocumentNumber: string;
    private _warehouseRCItemNumber: string;
    private _warehouseRCAssignedQuantity: number;
    private _warehouseRCBatchNumber: null|string;
    private _warehouseRCStorageLocation: null|string;
    private _warehouseRCWarehouse: null|string;
    private _warehouseRCPositionId: number;
    private _warehouseRCAssignmentDate: string;
    private _warehouseRCWarehousingId: null|number;
    private _warehouseRCOrdersPositionsId: number;
    private _warehouseRCDeliveryNotesPositionsId: null|number;

    constructor(warehouseRCData: WarehouseReservationCacheDataInterface) {
        this._warehouseRCId = warehouseRCData.ID;
        this._warehouseRCDocumentNumber = warehouseRCData.DOCUMENT_NUMBER;
        this._warehouseRCItemNumber = warehouseRCData.ITMNUM;
        this._warehouseRCAssignedQuantity = warehouseRCData.ASSIGNED_QTY;
        this._warehouseRCBatchNumber = warehouseRCData.LOT;
        this._warehouseRCStorageLocation = warehouseRCData.LOC;
        this._warehouseRCWarehouse = warehouseRCData.WAREHOUSE;
        this._warehouseRCPositionId = warehouseRCData.POSITION_ID;
        this._warehouseRCAssignmentDate = warehouseRCData.ASSIGNMENT_DATE;
        this._warehouseRCWarehousingId = warehouseRCData.WAREHOUSING_ID;
        this._warehouseRCOrdersPositionsId = warehouseRCData.ORDERS_POSITIONS_ID;
        this._warehouseRCDeliveryNotesPositionsId = warehouseRCData.DELIVERY_NOTES_POSITIONS_ID;
    }

    get warehouseRCData(): WarehouseReservationCacheDataInterface {
        return {
            ID: this._warehouseRCId,
            DOCUMENT_NUMBER: this._warehouseRCDocumentNumber,
            ITMNUM: this._warehouseRCItemNumber,
            ASSIGNED_QTY: this._warehouseRCAssignedQuantity,
            LOT: this._warehouseRCBatchNumber,
            LOC: this._warehouseRCStorageLocation,
            WAREHOUSE: this._warehouseRCWarehouse,
            POSITION_ID: this._warehouseRCPositionId,
            ASSIGNMENT_DATE: this._warehouseRCAssignmentDate,
            WAREHOUSING_ID: this._warehouseRCWarehousingId,
            ORDERS_POSITIONS_ID: this._warehouseRCOrdersPositionsId,
            DELIVERY_NOTES_POSITIONS_ID: this._warehouseRCDeliveryNotesPositionsId,
        }
    }

    get warehouseRCId(): number {
        return this._warehouseRCId;
    }

    set warehouseRCId(value: number) {
        this._warehouseRCId = value;
    }

    get warehouseRCDocumentNumber(): string {
        return this._warehouseRCDocumentNumber;
    }

    set warehouseRCDocumentNumber(value: string) {
        this._warehouseRCDocumentNumber = value;
    }

    get warehouseRCItemNumber(): string {
        return this._warehouseRCItemNumber;
    }

    set warehouseRCItemNumber(value: string) {
        this._warehouseRCItemNumber = value;
    }

    get warehouseRCAssignedQuantity(): number {
        return this._warehouseRCAssignedQuantity;
    }

    set warehouseRCAssignedQuantity(value: number) {
        this._warehouseRCAssignedQuantity = value;
    }

    get warehouseRCBatchNumber(): null|string {
        return this._warehouseRCBatchNumber;
    }

    set warehouseRCBatchNumber(value: null|string) {
        this._warehouseRCBatchNumber = value;
    }

    get warehouseRCStorageLocation(): null|string {
        return this._warehouseRCStorageLocation;
    }

    set warehouseRCStorageLocation(value: null|string) {
        this._warehouseRCStorageLocation = value;
    }

    get warehouseRCWarehouse(): null|string {
        return this._warehouseRCWarehouse;
    }

    set warehouseRCWarehouse(value: null|string) {
        this._warehouseRCWarehouse = value;
    }

    get warehouseRCPositionId(): number {
        return this._warehouseRCPositionId;
    }

    set warehouseRCPositionId(value: number) {
        this._warehouseRCPositionId = value;
    }

    get warehouseRCAssignmentDate(): string {
        return this._warehouseRCAssignmentDate;
    }

    set warehouseRCAssignmentDate(value: string) {
        this._warehouseRCAssignmentDate = value;
    }

    get warehouseRCWarehousingId(): null|number {
        return this._warehouseRCWarehousingId;
    }

    set warehouseRCWarehousingId(value: null|number) {
        this._warehouseRCWarehousingId = value;
    }

    get warehouseRCOrdersPositionsId(): number {
        return this._warehouseRCOrdersPositionsId;
    }

    set warehouseRCOrdersPositionsId(value: number) {
        this._warehouseRCOrdersPositionsId = value;
    }

    get warehouseRCDeliveryNotesPositionsId(): null|number {
        return this._warehouseRCDeliveryNotesPositionsId;
    }

    set warehouseRCDeliveryNotesPositionsId(value: null|number) {
        this._warehouseRCDeliveryNotesPositionsId = value;
    }

}
