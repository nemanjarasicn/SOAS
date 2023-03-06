import {CSVTemplateConfigType} from '../../../client/src/app/enums/csvtemplate-config-type.enum'
import { CsvTemplateConfigsDataInterface, CsvTemplateConfigsInterfaces } from "./interfaces/CsvTemplateConfigsInterfaces";

export class CsvTemplateConfigs implements CsvTemplateConfigsInterfaces {
      csvId: number;
      csvName: string;
      csvType: CSVTemplateConfigType;
      csvEncoding: string;
      csvEol: string;
      csvDelimiter: string;

    constructor(CsvTemplateConfigsData: CsvTemplateConfigsDataInterface) {
        this.csvId = CsvTemplateConfigsData.CSVCONFIG_ID;
        this.csvName = CsvTemplateConfigsData.CSVCONFIG_NAME;
        this.csvType = CsvTemplateConfigsData.CSVCONFIG_TYPE;
        this.csvEncoding = CsvTemplateConfigsData.CSVCONFIG_ENCODING;
        this.csvEol = CsvTemplateConfigsData.CSVCONFIG_EOL;
        this.csvDelimiter = CsvTemplateConfigsData.CSVCONFIG_DELIMITER;
    }
    

    get CsvTemplateConfigsData(): CsvTemplateConfigsDataInterface {
        return {
            CSVCONFIG_ID: this.csvId,
            CSVCONFIG_NAME: this.csvName,
            CSVCONFIG_TYPE: this.csvType,
            CSVCONFIG_ENCODING: this.csvEncoding,
            CSVCONFIG_EOL: this.csvEol,
            CSVCONFIG_DELIMITER: this.csvDelimiter
        }   
    }

    get csvTemplateConfigId(): number {
        return this.csvId;
    }

    set csvTemplateConfigId(value: number) {
        this.csvId = value;
    }

    get csvTemplateConfigName(): string {
        return this.csvName;
    }

    set csvTemplateConfigName(value: string) {
        this.csvName = value;
    }

    get csvTemplateConfigType(): CSVTemplateConfigType {
        return this.csvType;
    }

    set csvTemplateConfigType(value: CSVTemplateConfigType) {
        this.csvType = value;
    }

    get csvTemplateConfigEncoding(): string {
        return this.csvEncoding;
    }

    set csvTemplateConfigEncoding(value: string) {
        this.csvEncoding = value;
    }

    get csvTemplateConfigEol(): string {
        return this.csvEol;
    }

    set csvTemplateConfigEol(value: string) {
        this.csvEol = value;
    } 
    
    get csvTemplateConfigDelimiter(): string {
        return this.csvDelimiter;
    }

    set csvTemplateConfigDelimiter(value: string) {
        this.csvDelimiter = value;
    }
}
