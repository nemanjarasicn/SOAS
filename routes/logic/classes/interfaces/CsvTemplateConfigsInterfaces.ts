import {CSVTemplateConfigType} from '../../../../client/src/app/enums/csvtemplate-config-type.enum'


export interface CsvTemplateConfigsInterfaces {
    csvId : number;
    csvName : string;
    csvType : CSVTemplateConfigType;
    csvEncoding: string;
    csvEol: string;
    csvDelimiter: string;
}

export interface CsvTemplateConfigsDataInterface {
    CSVCONFIG_ID: number,
    CSVCONFIG_NAME: string,
    CSVCONFIG_TYPE: CSVTemplateConfigType,
    CSVCONFIG_ENCODING: string,
    CSVCONFIG_EOL: string,
    CSVCONFIG_DELIMITER: string
}

export interface TemplateConfigFields{
    column: string, 
    table: string, 
    required: boolean
}