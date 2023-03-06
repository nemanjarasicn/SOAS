import {StoragePlacesInterface, StoragePlacesDataInterface} from "./interfaces/StoragePlacesInterfaces";

export class StoragePlaces implements StoragePlacesInterface {
    private _storagePlacesId: number;
    private _storagePlacesLoc: string;
    private _storagePlacesWhloc: string;
    private _storagePlacesStatusPos: string;
    private _storagePlacesVirtualLoc: number;

    constructor(StoragePlacesData: StoragePlacesDataInterface) {
        this._storagePlacesId = StoragePlacesData.ID;
        this._storagePlacesLoc = StoragePlacesData.LOC;
        this._storagePlacesWhloc = StoragePlacesData.WHLOC;
        this._storagePlacesStatusPos = StoragePlacesData.STATUS_POS;
        this._storagePlacesVirtualLoc = StoragePlacesData.VIRTUAL_LOC;
    }

    get StoragePlacesData(): StoragePlacesDataInterface {
        return {
            ID: this._storagePlacesId,
            LOC: this._storagePlacesLoc,
            WHLOC: this._storagePlacesWhloc,
            STATUS_POS: this._storagePlacesStatusPos,
            VIRTUAL_LOC: this._storagePlacesVirtualLoc,
        }
    }

    get storagePlacesId(): number {
        return this._storagePlacesId;
    }

    set storagePlacesId(value: number) {
        this._storagePlacesId = value;
    }

    get storagePlacesStatusPos(): string {
        return this._storagePlacesStatusPos;
    }

    set storagePlacesStatusPos(value: string) {
        this._storagePlacesStatusPos = value;
    }

    get storagePlacesWhloc(): string {
        return this._storagePlacesWhloc;
    }

    set storagePlacesWhloc(value: string) {
        this._storagePlacesWhloc = value;
    }

    get storagePlacesLoc(): string {
      return this._storagePlacesLoc;
  }

  set storagePlacesLoc(value: string) {
      this._storagePlacesLoc = value;
  }

    get storagePlacesVirtualLoc(): number {
        return this._storagePlacesVirtualLoc;
    }

    set storagePlacesVirtualLoc(value: number) {
        this._storagePlacesVirtualLoc = value;
    }
}
