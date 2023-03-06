import {WarehouseChargeInterface, WarehouseChargeModel} from "./interfaces/WarehouseChargeInterface";

export class WarehouseCharge implements WarehouseChargeInterface {
    private _warehouseCharge: string;
    private _articleNumber: string;
    private _physicalStock: number;
    private _reservedStock: number;
    private _lastUpdate: Date;

    constructor(WarehouseChargeModelJson: WarehouseChargeModel) {
        this._warehouseCharge = WarehouseChargeModelJson.WAREHOUSE_CHARGE;
        this._articleNumber = WarehouseChargeModelJson.ITMNUM;
        this._physicalStock = WarehouseChargeModelJson.PHYS_STOCK;
        this._reservedStock = WarehouseChargeModelJson.RESERVED_STOCK;
        this._lastUpdate = WarehouseChargeModelJson.LAST_UPDATE;
    }

    get lastUpdate(): Date {return this._lastUpdate;}
    get reservedStock(): number {return this._reservedStock;}
    get articleNumber(): string {return this._articleNumber;}
    get physicalStock(): number {return this._physicalStock;}
    get warehouseCharge(): string {return this._warehouseCharge;}
}