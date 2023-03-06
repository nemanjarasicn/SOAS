import { CsvTemplateConfigsFieldDataInterface, CsvTemplateConfigsFieldInterfaces } from "./interfaces/CsvTemplateConfigFieldInterfaces";

export class CsvTemplateConfigsField implements CsvTemplateConfigsFieldInterfaces {
    csvFieldId: number;
    csvFieldTemplateId: number;
    csvFieldnumOrder: number;
    csvFieldShortDesc: string;
    csvFieldRequired: number;

    constructor(CsvTemplateConfigsFileData: CsvTemplateConfigsFieldDataInterface) {
        this.csvFieldId = CsvTemplateConfigsFileData.ID;
        this.csvFieldTemplateId = CsvTemplateConfigsFileData.CSV_TEMPLATE_CONFIG_ID;
        this.csvFieldnumOrder = CsvTemplateConfigsFileData.NUM_IN_ORDER;
        this.csvFieldShortDesc = CsvTemplateConfigsFileData.SHORT_DESC;
        this.csvFieldRequired = CsvTemplateConfigsFileData.REQUIRED;
        
    }
    

    get CsvTemplateConfigsFileData(): CsvTemplateConfigsFieldDataInterface {
        return {
            ID: this.csvFieldId,
            CSV_TEMPLATE_CONFIG_ID: this.csvFieldTemplateId,
            NUM_IN_ORDER: this.csvFieldnumOrder,
            SHORT_DESC: this.csvFieldShortDesc,
            REQUIRED: this.csvFieldRequired,
        }   
    }

    get csvTemplateConfigId(): number {
        return this.csvFieldId;
    }

    set csvTemplateConfigId(value: number) {
        this.csvFieldId = value;
    }

    get csvTemplateConfigTemplateId(): number {
        return this.csvFieldTemplateId;
    }

    set csvTemplateConfigTemplateId(value: number) {
        this.csvFieldTemplateId = value;
    }

    get csvTemplateConfigNumOrder(): number {
        return this.csvFieldnumOrder;
    }

    set csvTemplateConfigNumOrder(value: number) {
        this.csvFieldnumOrder = value;
    }

    get csvTemplateConfigShortDesc(): string {
        return this.csvFieldShortDesc;
    }

    set csvTemplateConfigShortDesc(value: string) {
        this.csvFieldShortDesc = value;
    }

    get csvTemplateConfigRequired(): number {
        return this.csvFieldRequired;
    }

    set csvTemplateConfigRequired(value: number) {
        this.csvFieldRequired = value;
    } 
    
}
