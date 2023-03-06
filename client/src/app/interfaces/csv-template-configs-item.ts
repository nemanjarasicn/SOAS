import {CSVTemplateConfigType} from '../enums/csvtemplate-config-type.enum'

export interface csvTemplateConfigsItem {
    CSVCONFIG_ID: number,
    CSVCONFIG_NAME: string,
    CSVCONFIG_TYPE: CSVTemplateConfigType,
    CSVCONFIG_ENCODING: string,
    CSVCONFIG_EOL: string,
    CSVCONFIG_DELIMITER: string
}
    