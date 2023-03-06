import {TableLocksInterface, TableLocksDataInterface} from "./interfaces/TableLocksInterface";

export class TableLocks implements TableLocksInterface {
    private _tablelocksTableName: string;
    private _tablelocksLockedBy: string;
    private _tablelocksLockedSince: string;
    private _tablelocksLocked: boolean;
    private _tablelocksLockedDataset: string;

    constructor(tablelocksData: TableLocksDataInterface) {
        this._tablelocksTableName = tablelocksData.TABLENAME;
        this._tablelocksLockedBy = tablelocksData.LOCKED_BY;
        this._tablelocksLockedSince = tablelocksData.LOCKED_SINCE;
        this._tablelocksLocked = tablelocksData.LOCKED;
        this._tablelocksLockedDataset = tablelocksData.LOCKED_DATASET;
    }

    get tablelocksData(): TableLocksDataInterface {
        return {
            TABLENAME: this._tablelocksTableName,
            LOCKED_BY: this._tablelocksLockedBy,
            LOCKED_SINCE: this._tablelocksLockedSince,
            LOCKED: this._tablelocksLocked,
            LOCKED_DATASET: this._tablelocksLockedDataset
        }
    }

    get tablelocksTableName(): string {
        return this._tablelocksTableName;
    }

    set tablelocksTableName(value: string) {
        this._tablelocksTableName = value;
    }

    get tablelocksLockedBy(): string {
        return this._tablelocksLockedBy;
    }

    set tablelocksLockedBy(value: string) {
        this._tablelocksLockedBy = value;
    }

    get tablelocksLockedSince(): string {
        return this._tablelocksLockedSince;
    }

    set tablelocksLockedSince(value: string) {
        this._tablelocksLockedSince = value;
    }

    get tablelocksLocked(): boolean {
        return this._tablelocksLocked;
    }

    set tablelocksLocked(value: boolean) {
        this._tablelocksLocked = value;
    }

    get tablelocksLockedDataset(): string {
        return this._tablelocksLockedDataset;
    }

    set tablelocksLockedDataset(value: string) {
        this._tablelocksLockedDataset = value;
    }
}
