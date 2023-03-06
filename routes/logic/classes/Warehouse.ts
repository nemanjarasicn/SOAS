import {WarehouseInterface, WarehouseModel} from "./interfaces/WarehouseInterface";
import {WarehouseLoc} from "./WarehouseLoc";

export class Warehouse implements WarehouseInterface {

    private _warehouse: number;
    private _inventoryActive: boolean;
    private _lastInventoryCountDate: Date;
    private _warehouseLocations: Array<WarehouseLoc>;

    constructor(WarehouseModelJson: WarehouseModel, locations: Array<WarehouseLoc>){
        this._warehouse = WarehouseModelJson.WAREHOUSE;
        this._inventoryActive = WarehouseModelJson.INVENTORY_COUNTING_ACTIVE;
        this._lastInventoryCountDate = WarehouseModelJson.LAST_INV_DATE;
        this._warehouseLocations = locations;
    }

    get lastInventoryCountDate(): Date {return this._lastInventoryCountDate;}
    get warehouse(): number {return this._warehouse;}
    get inventoryActive(): boolean {return this._inventoryActive;}
    get warehouseLocations(): Array<WarehouseLoc> {return this._warehouseLocations;}

}