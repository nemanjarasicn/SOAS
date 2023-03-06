import {WarehouseCharge} from "../WarehouseCharge";

export interface WarehouseLocInterface {
    location: string;
    charges: Array<WarehouseCharge>;
    lastUpdate: Date;
}

export interface WarehouseLocModel {
    LOCATION: string;
    LAST_UPDATE: Date;
}