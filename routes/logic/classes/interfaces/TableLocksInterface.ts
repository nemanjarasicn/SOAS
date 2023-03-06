export interface TableLocksInterface {
    tablelocksTableName: string;
    tablelocksLockedBy: string;
    tablelocksLockedSince: string;
    tablelocksLocked: boolean;
    tablelocksLockedDataset: string;
}

export interface TableLocksDataInterface {
    TABLENAME: string;
    LOCKED_BY: string;
    LOCKED_SINCE: string;
    LOCKED: boolean;
    LOCKED_DATASET: string;
}
