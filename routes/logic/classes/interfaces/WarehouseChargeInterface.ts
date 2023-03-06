export interface WarehouseChargeInterface {
    warehouseCharge: string;
    articleNumber: string;
    physicalStock: number;
    reservedStock: number;
    lastUpdate: Date;
}

export interface WarehouseChargeModel {
    WAREHOUSE_CHARGE: string;
    ITMNUM: string;
    PHYS_STOCK: number;
    RESERVED_STOCK: number;
    LAST_UPDATE: Date;
}