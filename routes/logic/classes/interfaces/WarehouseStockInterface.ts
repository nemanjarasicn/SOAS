export interface WarehouseStockInterface {
    warehouseName: string;
    warehouseId: string;
    warehousePhysicalStock: number;
    warehouseOrderBacklog: number;
    warehouseStockLocation: string;
}

export interface WarehouseStockDataInterface {
    ITMNUM: string;
    WAREHOUSE_IDENT: string;
    PHYS_STOCK: number;
    ORDER_BACKLOG: number;
    STOCK_LOCATION: string;
}
