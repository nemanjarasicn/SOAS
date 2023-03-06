import {CSVTemplateConfigType} from '../enums/csvtemplate-config-type.enum'

export class CSVTemplateConfigs {
    constructor(
        public CSVCONFIG_ID: number,
        public CSVCONFIG_NAME: string,
        public CSVCONFIG_TYPE: CSVTemplateConfigType,
        public CSVCONFIG_ENCODING: string,
        public CSVCONFIG_EOL: string,
        public CSVCONFIG_DELIMITER: string
    ) {  }
}
