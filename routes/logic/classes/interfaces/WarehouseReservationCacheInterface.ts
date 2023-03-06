export interface WarehouseReservationCacheInterface {
    warehouseRCId?: number;
    warehouseRCDocumentNumber: string;
    warehouseRCItemNumber: string;
    warehouseRCAssignedQuantity: number;
    warehouseRCBatchNumber: null|string;
    warehouseRCStorageLocation: null|string;
    warehouseRCWarehouse: null|string;
    warehouseRCPositionId: number;
    warehouseRCAssignmentDate: string;
    warehouseRCWarehousingId: null|number;
    warehouseRCOrdersPositionsId: number;
    warehouseRCDeliveryNotesPositionsId: null|number;
}

export interface WarehouseReservationCacheDataInterface {
    ID: number;
    DOCUMENT_NUMBER: string;
    ITMNUM: string;
    ASSIGNED_QTY: number;
    LOT: null|string;
    LOC: null|string;
    WAREHOUSE: null|string;
    POSITION_ID: number;
    ASSIGNMENT_DATE: string;
    WAREHOUSING_ID: null|number;
    ORDERS_POSITIONS_ID: number;
    DELIVERY_NOTES_POSITIONS_ID: null|number;
}
