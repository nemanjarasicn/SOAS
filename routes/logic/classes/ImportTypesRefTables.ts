/** reviewed by Ronny Brandt - 24.07.2021
 * beautiful file, beautiful code, nothing messy here */

import {
  ImportTypesRefTablesDataInterface,
  ImportTypesRefTablesInterface,
} from "./interfaces/ImportTypesRefTablesInterface";

export class ImportTypesRefTables implements ImportTypesRefTablesInterface {
  importTypesRefTableId: number;
  importTypesRefTableImportId: number;
  importTypesRefTableRefTable: string;

  constructor(importTypesRefTablesData: ImportTypesRefTablesDataInterface) {
    this.importTypesRefTableId = importTypesRefTablesData.ID;
    this.importTypesRefTableImportId = importTypesRefTablesData.IMPORT_TYPE_ID;
    this.importTypesRefTableRefTable =
      importTypesRefTablesData.REFERENCED_TABLE;
  }

  get importTypesRefTablesData(): ImportTypesRefTablesDataInterface {
    return {
      ID: this.importTypesRefTableId,
      IMPORT_TYPE_ID: this.importTypesRefTableImportId,
      REFERENCED_TABLE: this.importTypesRefTableRefTable,
    };
  }

  get importTypesRefTablesId(): number {
    return this.importTypesRefTableId;
  }

  set importTypesRefTablesId(value: number) {
    this.importTypesRefTableId = value;
  }

  get importTypesRefTablesImportId(): number {
    return this.importTypesRefTableImportId;
  }

  set importTypesRefTablesImportId(value: number) {
    this.importTypesRefTableImportId = value;
  }

  get importTypesRefTablesRefTable(): string {
    return this.importTypesRefTableRefTable;
  }

  set importTypesRefTablesRefTable(value: string) {
    this.importTypesRefTableRefTable = value;
  }
}
