import {WarehouseStockInterface, WarehouseStockDataInterface} from "./interfaces/WarehouseStockInterface";

export class WarehouseStock implements WarehouseStockInterface {
    private _warehouseName: string;
    private _warehouseId: string;
    private _warehousePhysicalStock: number;
    private _warehouseOrderBacklog: number;
    private _warehouseStockLocation: string;

    constructor(warehouseStockData: WarehouseStockDataInterface) {
        this._warehouseName = warehouseStockData.ITMNUM;
        this._warehouseId = warehouseStockData.WAREHOUSE_IDENT;
        this._warehousePhysicalStock = warehouseStockData.PHYS_STOCK;
        this._warehouseOrderBacklog = warehouseStockData.ORDER_BACKLOG;
        this._warehouseStockLocation = warehouseStockData.STOCK_LOCATION;
    }

    get warehouseStockData(): WarehouseStockDataInterface {
        return {
            ITMNUM: this._warehouseName,
            WAREHOUSE_IDENT: this._warehouseId,
            PHYS_STOCK: this._warehousePhysicalStock,
            ORDER_BACKLOG: this._warehouseOrderBacklog,
            STOCK_LOCATION: this._warehouseStockLocation
        }
    }

    get warehouseName(): string {
        return this._warehouseName;
    }

    set warehouseName(value: string) {
        this._warehouseName = value;
    }

    get warehouseId(): string {
        return this._warehouseId;
    }

    set warehouseId(value: string) {
        this._warehouseId = value;
    }

    get warehousePhysicalStock(): number {
        return this._warehousePhysicalStock;
    }

    set warehousePhysicalStock(value: number) {
        this._warehousePhysicalStock = value;
    }

    get warehouseOrderBacklog(): number {
        return this._warehouseOrderBacklog;
    }

    set warehouseOrderBacklog(value: number) {
        this._warehouseOrderBacklog = value;
    }

    get warehouseStockLocation(): string {
        return this._warehouseStockLocation;
    }

    set warehouseStockLocation(value: string) {
        this._warehouseStockLocation = value;
    }
}
