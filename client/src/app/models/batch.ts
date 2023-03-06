export class Batch {

  constructor(
    public BATCH_NAME: string,
    public BATCH_DESCRIPTION: string,
    public BATCH_FUNCTION: string,
    // public BATCH_INTERVAL: string,

    public BATCH_INTERVAL_MINUTES: string,
    public BATCH_INTERVAL_HOURS: string,
    public BATCH_INTERVAL_DAYS: string,
    public BATCH_INTERVAL_MONTHS: string,
    public BATCH_INTERVAL_DAYOFMONTH: string,

    public BATCH_ACTIVE: boolean,
    public BATCH_LAST_RUN_START: string,
    public BATCH_LAST_RUN_FINISH: string,
    public BATCH_LAST_RUN_RESULT: string,
    public BATCH_CODE: string,
    public BATCH_CODE_REQUIRED: boolean,
    public BATCH_PARAMS:object
  ) {  }

}
