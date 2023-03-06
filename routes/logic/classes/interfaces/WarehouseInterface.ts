import {WarehouseLoc} from "../WarehouseLoc";

export interface WarehouseInterface {
    warehouse: number;
    warehouseLocations: Array<WarehouseLoc>
    inventoryActive: boolean;
    lastInventoryCountDate: Date;
}

export interface WarehouseModel{
    WAREHOUSE: number;
    INVENTORY_COUNTING_ACTIVE: boolean;
    LAST_INV_DATE: Date;
}
