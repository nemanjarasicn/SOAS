export interface WarehousingInterface {
    warehousingId?: number;
    warehousingLocation: string;
    warehousingItemNumber: string;
    warehousingBatchNumber: string;
    warehousingStorageLocation: string;
    warehousingStatusPosition: string;
    warehousingQuantity: number;
    warehousingReserved: number;
    warehousingUpdateLocation: string | Date;
}

export interface WarehousingDataInterface {
    ID: number;
    WHLOC: string; // => VarChar
    ITMNUM: string;
    LOT: string;
    LOC: string;
    STATUS_POS: string;
    QTY: number;
    RESERVED: number;
    UPDATE_LOC: string;
}
