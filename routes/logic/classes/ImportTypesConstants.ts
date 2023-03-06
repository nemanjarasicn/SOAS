/** reviewed by Ronny Brandt - 24.07.2021
 * when you comment out code, make sure to delete it once you've tested what you were trying to archive.*/

import {
  ImportTypesConstantsDataInterface,
  ImportTypesConstantsInterface,
} from "./interfaces/importTypesConstantsInterface";

export class ImportTypesConstants implements ImportTypesConstantsInterface {
  importTypesConstantId: number;
  importTypesConstantRefTableId: number;
  importTypesConstantColumnName: string;
  // importTypesConstantColumnActive: number;

  constructor(importTypesConstantsData: ImportTypesConstantsDataInterface) {
    this.importTypesConstantId = importTypesConstantsData.ID;
    this.importTypesConstantRefTableId =
      importTypesConstantsData.IMPORT_TYPE_REFERENCED_TABLES_ID;
    this.importTypesConstantColumnName = importTypesConstantsData.COLUMN_NAME;
    // this.importTypesConstantColumnActive =
    //   importTypesConstantsData.COLUMN_ACTIVE;
  }

  get importTypesConstantsData(): ImportTypesConstantsDataInterface {
    return {
      ID: this.importTypesConstantId,
      IMPORT_TYPE_REFERENCED_TABLES_ID: this.importTypesConstantRefTableId,
      COLUMN_NAME: this.importTypesConstantColumnName,
      // COLUMN_ACTIVE: this.importTypesConstantColumnActive,
    };
  }

  get importTypesConstantsId(): number {
    return this.importTypesConstantId;
  }

  set importTypesConstantsId(value: number) {
    this.importTypesConstantId = value;
  }

  get importTypesConstantsRefTableId(): number {
    return this.importTypesConstantRefTableId;
  }

  set importTypesConstantsRefTablesId(value: number) {
    this.importTypesConstantRefTableId = value;
  }

  get importTypesConstantsColumnName(): string {
    return this.importTypesConstantColumnName;
  }

  set importTypesConstantsColumnName(value: string) {
    this.importTypesConstantColumnName = value;
  }

  // get importTypesConstantsColumnActive(): number {
  //   return this.importTypesConstantColumnActive;
  // }

  // set importTypesConstantsColumnActive(value: number) {
  //   this.importTypesConstantColumnActive = value;
  // }
}
