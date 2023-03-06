import {WarehousingInterface, WarehousingDataInterface} from "./interfaces/WarehousingInterface";

export class Warehousing implements WarehousingInterface {

    private _warehousingId: number;
    private _warehousingLocation: string;
    private _warehousingItemNumber: string;
    private _warehousingBatchNumber: string;
    private _warehousingStorageLocation: string;
    private _warehousingStatusPosition: string;
    private _warehousingQuantity: number;
    private _warehousingReserved: number;
    private _warehousingUpdateLocation: string;

    constructor(warehousingData: WarehousingDataInterface) {
        this._warehousingId = warehousingData.ID;
        this._warehousingLocation = warehousingData.WHLOC;
        this._warehousingItemNumber = warehousingData.ITMNUM;
        this._warehousingBatchNumber = warehousingData.LOT;
        this._warehousingStorageLocation = warehousingData.LOC;
        this._warehousingStatusPosition = warehousingData.STATUS_POS;
        this._warehousingQuantity = warehousingData.QTY;
        this._warehousingReserved = warehousingData.RESERVED;
        this._warehousingUpdateLocation = warehousingData.UPDATE_LOC;
    }

    get warehousingData(): WarehousingDataInterface {
        return {
            ID: this._warehousingId,
            WHLOC: this._warehousingLocation,
            ITMNUM: this._warehousingItemNumber,
            LOT: this._warehousingBatchNumber,
            LOC: this._warehousingStorageLocation,
            STATUS_POS: this._warehousingStatusPosition,
            QTY: this._warehousingQuantity,
            RESERVED: this._warehousingReserved,
            UPDATE_LOC: this._warehousingUpdateLocation,
        }
    }

    get warehousingId (): number {
        return this._warehousingId;
    }

    set warehousingId (value: number) {
        this._warehousingId = value;
    }

    get warehousingLocation (): string {
        return this._warehousingLocation;
    }

    set warehousingLocation (value: string) {
        this._warehousingLocation = value;
    }

    get warehousingItemNumber(): string {
        return this._warehousingItemNumber;
    }

    set warehousingItemNumber(value: string) {
        this._warehousingItemNumber = value;
    }

    get warehousingBatchNumber(): string {
        return this._warehousingBatchNumber;
    }

    set warehousingBatchNumber(value: string) {
        this._warehousingBatchNumber = value;
    }

    get warehousingStorageLocation(): string {
        return this._warehousingStorageLocation;
    }

    set warehousingStorageLocation(value: string) {
        this._warehousingStorageLocation = value;
    }

    get warehousingStatusPosition(): string {
        return this._warehousingStatusPosition;
    }

    set warehousingStatusPosition(value: string) {
        this._warehousingStatusPosition = value;
    }

    get warehousingQuantity(): number {
        return this._warehousingQuantity;
    }

    set warehousingQuantity(value: number) {
        this._warehousingQuantity = value;
    }

    get warehousingReserved(): number {
        return this._warehousingReserved;
    }

    set warehousingReserved(value: number) {
        this._warehousingReserved = value;
    }

    get warehousingUpdateLocation(): string {
        return this._warehousingUpdateLocation;
    }

    // set warehousingUpdateLocation(value: string) {
    //     this._warehousingUpdateLocation = value;
    // }
}
