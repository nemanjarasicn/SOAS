/**
 * batch process constants for unit tests
 */
export class BatchProcessesTestConstants {

  public static BATCH_PROCESS = {
    BATCH_NAME: 'Batch name',
    BATCH_DESCRIPTION: 'Batch description',
    BATCH_FUNCTION: 'soas_daily_update',
    BATCH_INTERVAL: '30 0 * * *',
    BATCH_ACTIVE: false,
    BATCH_PARAMS: '',
    BATCH_LAST_RUN_START: '2020-11-11 00:30:00.200',
    BATCH_LAST_RUN_FINISH: '2020-11-11 00:30:00.200',
    BATCH_LAST_RUN_RESULT: 'SUCCESS',
    BATCH_CODE: null,
    BATCH_CODE_REQUIRED: false,
  };

}

