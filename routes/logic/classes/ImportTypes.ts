import {
  ImportTypesDataInterface,
  ImportTypesInterface,
} from "./interfaces/ImportTypesInterface";

export class ImportTypes implements ImportTypesInterface {
  importTypeId: number;
  importTypeName: string;
  importTypeActive: number;

  constructor(importTypesData: ImportTypesDataInterface) {
    this.importTypeId = importTypesData.ID;
    this.importTypeName = importTypesData.IMPORT_TYPE_NAME;
    this.importTypeActive = importTypesData.ACTIVE;
  }

  get importTypesData(): ImportTypesDataInterface {
    return {
      ID: this.importTypeId,
      IMPORT_TYPE_NAME: this.importTypeName,
      ACTIVE: this.importTypeActive,
    };
  }

  get importTypesId(): number {
    return this.importTypeId;
  }

  set importTypesId(value: number) {
    this.importTypeId = value;
  }

  get importTypesName(): string {
    return this.importTypeName;
  }

  set importTypesName(value: string) {
    this.importTypeName = value;
  }

  get importTypesActive(): number {
    return this.importTypeActive;
  }

  set importTypesActive(value: number) {
    this.importTypeActive = value;
  }
}
