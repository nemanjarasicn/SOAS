/** reviewed by Ronny Brandt - 24.07.2021
 * when you comment out code, make sure to delete it once you've tested what you were trying to archive.*/

export interface ImportTypesConstantsInterface {
  importTypesConstantsId: number;
  importTypesConstantsRefTableId: number;
  importTypesConstantsColumnName: string;
}

export interface ImportTypesConstantsDataInterface {
  ID: number;
  IMPORT_TYPE_REFERENCED_TABLES_ID: number;
  COLUMN_NAME: string;
}
