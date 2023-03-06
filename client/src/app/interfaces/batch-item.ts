export interface BatchItem {
  BATCH_NAME: string;
  BATCH_DESCRIPTION: string;
  BATCH_FUNCTION: string;
  BATCH_INTERVAL: string;
  BATCH_ACTIVE: boolean;
  BATCH_PARAMS:string,
  BATCH_LAST_RUN_START: string;
  BATCH_LAST_RUN_FINISH: string;
  BATCH_LAST_RUN_RESULT: string;
  BATCH_CODE: string;
  BATCH_CODE_REQUIRED: boolean;
}
