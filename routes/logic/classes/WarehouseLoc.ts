import {WarehouseLocInterface, WarehouseLocModel} from "./interfaces/WarehouseLocInterface";
import {WarehouseCharge} from "./WarehouseCharge";

export class WarehouseLoc implements WarehouseLocInterface {
    private _location: string;
    private _charges: Array<WarehouseCharge>;
    private _lastUpdate: Date;

    constructor(WarehouseLocModelJson: WarehouseLocModel, locationCharges: Array<WarehouseCharge>){
        this._location = WarehouseLocModelJson.LOCATION;
        this._lastUpdate = WarehouseLocModelJson.LAST_UPDATE;
        this._charges = locationCharges;
    }

    get location(): string {return this._location;}
    get charges(): Array<WarehouseCharge> {return this._charges;}
    get lastUpdate(): Date {return this._lastUpdate;}

}