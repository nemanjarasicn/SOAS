/* AUTHOR: Stefan Schimmelpfennig */
/* AUTHOR: Ronny Brandt */
/* LAST UPDATE: 10.11.2021 (by Strahinja Belic) */
// @ts-ignore
import mssqlLogic = require('./mssql_logic');
import fs = require('fs');
import csv = require('csv-parser');
import sql = require('mssql');
import {mssqlCallEscaped} from './mssql_call';
import {TemplateConfigFields} from './classes/interfaces/CsvTemplateConfigsInterfaces';
import * as path from "path";
import {CustomerAddrImport, CustomerImport} from "./classes/CustomerImport";
import {OrderImport, OrderPosImport} from "./classes/OrderImport";
import {IPositionWC} from "./classes/interfaces/Import";
import {SupplyOrderImport} from "./classes/SupplyOrderImport";
import {SecondaryOrderPosImport} from "./classes/SecondaryOrderImport";

/**
 * Author: Strahinja Belic
 * Last Change: 23.08.2021.
 *
 * returns import types from DB
 * @returns Promise<any> - it should return data from db [{id: number, label: string}]
 */
export async function getImportTypes(){
    const sqlQuery = "SELECT ID AS 'id', IMPORT_TYPE_NAME AS 'label' FROM IMPORT_TYPE WHERE ACTIVE = @ACTIVE"
    const result = await mssqlCallEscaped([
        {
            name: 'ACTIVE',
            type: sql.TinyInt,
            value: 1
        }
    ], sqlQuery)
    if(result?.error) return(result.error)
    return(result)
}

/**
 * Author: Nemanja Rasic
 * Last Change: 31.08.2021.
 *
 * returns import types constants from DB
 * @returns Promise<any> - it should return data from db [{id: number, label: string}]
 */
 export async function getImportTypesConstants(){
    const sqlQuery = "SELECT ID AS 'id', COLUMN_NAME AS 'label' FROM IMPORT_TYPE_CONSTANTS WHERE ACTIVE = @ACTIVE"
    const result = await mssqlCallEscaped([
        {
            name: 'ACTIVE',
            type: sql.TinyInt,
            value: 1
        }
    ], sqlQuery)
    if(result?.error) return(result.error)
    return(result)
}

/**
 * Author: Strahinja Belic
 * Last Change: 23.08.2021.
 *
 * returns template configs from DB
 * @param params {id: number} - id represents the CSV TYPE ID
 * @returns Promise<any> - it should return data from db [{id: number, label: string}]
 */
export function getTemplateConfigs(params: {id: number}): Promise<any>{
    return new Promise(async(res)=>{
        const sqlQuery = `SELECT CSVCONFIG_ID AS 'id', CSVCONFIG_NAME AS 'label' FROM CSV_TEMPLATE_CONFIG
        WHERE CSVCONFIG_TYPE = @CSVCONFIG_TYPE`
        const result = await mssqlCallEscaped([
            {
                name: 'CSVCONFIG_TYPE',
                type: sql.Int,
                value: params.id
            }
        ], sqlQuery)

        res(result)
    })
}

/**
 * Author: Strahinja Belic 30.07.2021.
 * Last Change: 07.10.2021.
 *
 * It will fetch all necessary data for headers
 * @param template_id number
 * @returns Promise<{id: number, short_desc: string, required: number}[]>
 */
export async function getHeadersForTemplateConfig(template_id: number): Promise<{
    id: number,
    short_desc: string,
    required: number
}[]>{
    const sqlQuery = `SELECT ID as id, SHORT_DESC as short_desc, [REQUIRED] as required 
    FROM CSV_TEMPLATE_CONFIG_FIELD WHERE CSV_TEMPLATE_CONFIG_ID = @TEMPLATE_ID ORDER BY NUM_IN_ORDER`
    return await mssqlCallEscaped([
        {
            name: 'TEMPLATE_ID',
            type: sql.Int,
            value: template_id
        }
    ], sqlQuery)
}

/**
 * Author: Strahinja Belic 30.07.2021.
 * Last Change: 30.07.2021.
 *
 * It will fetch all basics for template config
 * @param template_id number
 * @returns Promise<{encoding: string, delimiter: string, eol: string, import_type: number}>
 */
export async function getBasicsForTemplateConfig(template_id: number): Promise<{
    encoding: string,
    delimiter: string,
    eol: string,
    import_type: number
}>{
        let sqlQuery = `SELECT CSVCONFIG_TYPE as 'import_type', CSVCONFIG_ENCODING as 'encoding', 
        CSVCONFIG_EOL as 'eol', CSVCONFIG_DELIMITER as 'delimiter' FROM
        CSV_TEMPLATE_CONFIG WHERE CSVCONFIG_ID = @TEMPLATE_ID`
        let result = await mssqlCallEscaped([
            {
                name: 'TEMPLATE_ID',
                type: sql.Int,
                value: template_id
            }
        ], sqlQuery)

        return {
            encoding: result[0]?.encoding,
            delimiter: result[0]?.delimiter,
            eol: result[0]?.eol,
            import_type: result[0]?.import_type,
        }
}

/**
 * Author: Strahinja Belic 30.07.2021.
 * Last Change: 23.08.2021.
 * It will fetch table name and column name for given field_id
 * @param field_id number
 * @returns
 */
export async function getFieldResult(field_id: number): Promise<{table: string, column: string}[]>{
        const query = `SELECT t.REFERENCED_TABLE as 'table', c.COLUMN_NAME as 'column' 
            FROM CSV_TEMPLATE_CONFIG_FIELD_LIST l 
            INNER JOIN IMPORT_TYPE_CONSTANTS c on c.ID = l.IMPORT_TYPE_CONSTANTS_ID
            INNER JOIN IMPORT_TYPE_REFERENCED_TABLES t on t.ID = c.IMPORT_TYPE_REFERENCED_TABLES_ID
            WHERE l.CSV_TEMPLATE_CONFIG_FIELD_ID = @TEMPLATE_FIELD_ID`
        const fieldResult = await mssqlCallEscaped([
            {
                name: 'TEMPLATE_FIELD_ID',
                type: sql.Int,
                value: field_id
            }
        ], query)

        return fieldResult || []
}

/**
 * Author: Strahinja Belic 30.07.2021.
 * Last Change: 23.08.2021
 * It will build headers and fields for import file with given data from DB about headers
 * @param headerFromDB {id: number, short_desc: string, required: number}[]
 * @returns Promise<{headers: string[], fields: Array<TemplateConfigFields | TemplateConfigFields[]>
}>
 */
export async function buildHeadersAndFieldsForImportFile(headerFromDB: {id: number, short_desc: string, required: number}[]): Promise<{
    headers: string[],
    fields: Array<TemplateConfigFields | TemplateConfigFields[]>
}>{

    let fields: Array<TemplateConfigFields | TemplateConfigFields[]> = [],
    headers: string[] = [];
    for (const field of headerFromDB) {
        const fieldResult = await getFieldResult(field.id)

        let tmpArr: Array<TemplateConfigFields> = []

        if(fieldResult?.length > 1){
            for(const innerField of fieldResult)
                tmpArr.push({column: innerField.column, table: innerField.table, required: !!field.required});
        }
        else tmpArr.push({
            column: fieldResult[0]?.column || '',
            table: fieldResult[0]?.table || '',
            required: !!field.required
        })

        fields.push(tmpArr);
        headers.push(field.short_desc)
    }

    return {
        headers,
        fields
    }
}

/**
 * Author: Strahinja Belic 28.06.2021.
 * Last Change: 23.08.2021.
 *
 * It should return all necessary stuff for parsing and inserting CSV data to DB
 * @param template_id number - selected template config
 * @returns Promise<{fields:Array<TemplateConfigFields | TemplateConfigFields[]>, headers: string[], encoding: string, delimiter: string, eol: string, import_type: number}>
 */
export async function getTemplateConfigStuff(template_id: number): Promise<{
    fields: Array<TemplateConfigFields | TemplateConfigFields[]>
    headers: string[],
    encoding: string,
    delimiter: string,
    eol: string,
    import_type: number}>
{
    //get encoding, delimiter, eol, import_type
    const basicResult = await getBasicsForTemplateConfig(template_id)
    const { encoding, delimiter, eol, import_type} = basicResult

    //get headers
    const headersResult = await getHeadersForTemplateConfig(template_id)

    //build headers and fields
    let {headers, fields} = await buildHeadersAndFieldsForImportFile(headersResult)

    /*
        import_type: 1 - is customer type
        import_type: 2 - is order type
    */
    return {fields, headers, encoding, delimiter, eol, import_type}
}

/**
 * Author: Strahinja Belic 30.06.2021.
 * Last Change: 23.08.2021.
 *
 * It will prepare sqlTablesToDealWith for sqlEscapeCall
 * @param table string
 * @param columnName string
 * @param value any
 * @param tmpSqlTablesToDealWith Map<string, {tableName: string, params: {name: string, type: any, value: any}[]}>
 * @param import_type number
 * @returns Map<string, {tableName: string, params: {name: string, type: any, value: any}[]}>)>
 */
export function prepareTableToDealWith(
    table: string,
    columnName: string,
    value: any,
    tmpSqlTablesToDealWith: Map<string, {tableName: string, params: {name: string, type: any, value: any}[]}>,
    import_type: number,

): Map<string, {tableName: string, params: {name: string, type: any, value: any}[]}>{
    if(table !== ''){
        let tmpParam: {name: string, type: any, value: any} = {name: columnName, type: sql.NVarChar, value}

        //if table already exists in sqlTablesToDealWith
        if(tmpSqlTablesToDealWith.get(table)){
            if(tmpParam.value !== false){
                let tmpParams: any = tmpSqlTablesToDealWith.get(table)?.params
                tmpParams.push(tmpParam)
                //update params
                tmpSqlTablesToDealWith.set(table, {tableName: table, params: tmpParams})
            }
        }else{
            if(tmpParam.value !== false){
                //add new
                tmpSqlTablesToDealWith.set(table,{
                    tableName: table,
                    params: [
                        {
                            name: columnName,
                            type: sql.NVarChar,
                            value: value
                        }
                    ]
                })
            }
        }
    }

    return tmpSqlTablesToDealWith
}

/**
 * Author: Strahinja Belic 30.07.2021.
 * Last Change: 30.07.2021.
 *
 * It will move file to __dirname + '/csv/imported/tmp/
 * @param file
 * @returns
 */
export function moveFileForImport(file: any): Promise<boolean | Error>{
    return new Promise((res, rej)=>{
        //move file to tmp
        file.mv(__dirname + '/csv/imported/tmp/' + file.name, (err: any)=>{
            if (err) {
                //logger.error(new Error(err)); <-- enable on production!
                rej(err)

            }
            res(true)
        })
    })
}

export function parseCsvImportFile(file_name: string, headers: string[]): Promise<any[] | {allOk: boolean, err: string}>{
    return new Promise((res, rej)=>{
        let result = [] as any[]
        fs.createReadStream(__dirname + '/csv/imported/tmp/' + file_name)
        .pipe(csv(
            {
                headers,
                separator: ';' //delimiter,
                //newline: eol
            }
        ))
        .on('data', (data: any) => {
            let i = 0
            for (const key in data) {
                i++
            }

            if(i !== headers?.length){
                //allOk = false
                //customErrMsg = "Wrong template config, number of items not matched"
                return rej({allOk: false, err: "Wrong template config, number of items not matched"})
            }

            result.push(data)
        })
        .on('end', () => {
            res(result)
        })
    })
}


/**
 * Author: Strahinja Belic 28.06.2021.
 * Last Change: 23.08.2021.
 *
 * Uploads csv file and then do the logic for DB
 * @param template_id - number - it represents template config ID
 * @param file - File - it represents csv file that should be uploaded
 * @param username - logged in username
 */
export function csvImport(template_id: number, file:any, username: string): Promise<{allOk: boolean, customErrMsg?: string}>{
    return new Promise(async (resolve, reject)=>{
        //move file
        await moveFileForImport(file)
        .catch((err)=>{
            return reject({
                allOk: false,
                customErrMsg: err
            })
        })

        //get vars that are necessary
        //// rev: import_type seems to be an enum, but you use it as a number. Should be an enum tho
        const {fields, headers, encoding, eol, delimiter, import_type} = await getTemplateConfigStuff(template_id)

        //parse CSV
        let results = await parseCsvImportFile(file.name, headers)
            .catch(error => {return reject({
                    allOk: false,
                    //@ts-ignore
                    customErrMsg: error.err
                })
            })

        //@ts-ignore
        if(results?.allOk === false){
            return reject({
                allOk: false,
                //@ts-ignore
                customErrMsg: results!.err
            })
        }

        //@ts-ignore
        if(results?.length < 1){
            return reject({
                allOk: false,
                customErrMsg: "No data or wrong template config"
            })
        }

        let rowIndex = 0,
        positionID_ord = 1000,
        customerImportClass,
        customerAddrImportClass,
        orderImportClass,
        orderPosImportClass;

        //@ts-ignore
        for (const row of results) {
            let sqlTablesToDealWith = new Map() as Map<string, {
                tableName: string,
                params: {name: string, type: any, value: any}[]
            }>,
            i = 0;

            for (const key in row) {
                const column = row[key];

                //@ts-ignore
                if(fields[i]?.required && typeof column !== 'number' && !column){
                    return reject({
                        allOk: false,
                        customErrMsg: 'Required data is empty'
                    })
                }

                //@ts-ignore
                if(fields[i]?.table !== undefined){
                    //@ts-ignore
                    sqlTablesToDealWith = prepareTableToDealWith(fields[i].table, fields[i].column, column,  sqlTablesToDealWith, import_type)
                }else{
                    //@ts-ignore
                    fields[i]?.forEach((innerField: {column: string, table: string, required: boolean}) => {
                        sqlTablesToDealWith = prepareTableToDealWith(innerField.table, innerField.column, column,  sqlTablesToDealWith, import_type)
                    })
                }

                i++
            }

            //simplify sqlTablesToDealWith
            const tmpSqlTablesToDealWithObj:
                {
                    tableName: string,
                    params: {name: string, type: any, value: any}[]
                }[] = []
            sqlTablesToDealWith.forEach(arr => tmpSqlTablesToDealWithObj.push(arr))

            const findFromSqlTablesToDealWithObj = (
                tableName: string,
                columnName: string,
                backOnlyValue: boolean = true) => {
                return backOnlyValue?
                    sqlTablesToDealWith.get(tableName)!.params
                        .find(columns => columns.name === columnName)?.value || null :
                    sqlTablesToDealWith.get(tableName)!.params
                        .find(columns => columns.name === columnName) || null
            }

            // make sql query
            for (const table of tmpSqlTablesToDealWithObj) {
                switch(table.tableName){
                    case 'CUSTOMERS':
                        customerImportClass = new CustomerImport({
                            customers_number: findFromSqlTablesToDealWithObj(table.tableName, 'CUSTOMERS_NUMBER'),
                            customers_prename: findFromSqlTablesToDealWithObj(table.tableName, 'CUSTOMERS_PRENAME') || ' ',
                            customers_name: findFromSqlTablesToDealWithObj(table.tableName, 'CUSTOMERS_NAME') || ' ',
                            customers_company: findFromSqlTablesToDealWithObj(table.tableName, 'CUSTOMERS_COMPANY'),
                            eec_num: findFromSqlTablesToDealWithObj(table.tableName, 'EEC_NUM') || ' ',
                            language: findFromSqlTablesToDealWithObj(table.tableName, 'LANGUAGE'),
                            edi_invoic: findFromSqlTablesToDealWithObj(table.tableName, 'EDI_INVOIC'),
                            edi_ordersp: findFromSqlTablesToDealWithObj(table.tableName, 'EDI_ORDERSP'),
                            edi_desadv: findFromSqlTablesToDealWithObj(table.tableName, 'EDI_DESADV'),
                            create_date:
                                findFromSqlTablesToDealWithObj(table.tableName, 'CREATE_DATE') ||
                                `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
                            ,
                            customers_email: findFromSqlTablesToDealWithObj(table.tableName, 'CUSTOMERS_EMAIL'),
                            customers_phone: findFromSqlTablesToDealWithObj(table.tableName, 'CUSTOMERS_PHONE'),
                            email_rg: findFromSqlTablesToDealWithObj(table.tableName, 'EMAIL_RG') || ' ',
                            email_li: findFromSqlTablesToDealWithObj(table.tableName, 'EMAIL_LI') || ' ',
                            email_au: findFromSqlTablesToDealWithObj(table.tableName, 'EMAIL_AU') || ' ',
                            phone_0: findFromSqlTablesToDealWithObj(table.tableName, 'PHONE_0') || ' ',
                            phone_1: findFromSqlTablesToDealWithObj(table.tableName, 'PHONE_1') || ' ',
                            fax_0: findFromSqlTablesToDealWithObj(table.tableName, 'FAX_0') || ' ',
                            mob_0: findFromSqlTablesToDealWithObj(table.tableName, 'MOB_0') || ' ',
                            mob_1: findFromSqlTablesToDealWithObj(table.tableName, 'MOB_1') || ' ',
                            crnnum: findFromSqlTablesToDealWithObj(table.tableName, 'CRNNUM'),
                            payment_term_id: findFromSqlTablesToDealWithObj(table.tableName, 'PAYMENT_TERM_ID') || ' ',
                            email: findFromSqlTablesToDealWithObj(table.tableName, 'EMAIL') || ' ',
                            different_dlv_name_0: findFromSqlTablesToDealWithObj(table.tableName, 'DIFFERENT_DLV_NAME_0'),
                            different_dlv_name_1: findFromSqlTablesToDealWithObj(table.tableName, 'DIFFERENT_DLV_NAME_1'),
                        })

                        await  customerImportClass.prepareInsert()
                        break
                    case 'CUSTOMERS_ADDRESSES':
                         customerAddrImportClass = new CustomerAddrImport({
                            address_type: (+findFromSqlTablesToDealWithObj(table.tableName, 'ADDRESS_TYPE') === 1 )? 'DLV': 'INV',
                            customers_number: findFromSqlTablesToDealWithObj('CUSTOMERS', 'CUSTOMERS_NUMBER'),
                            address_street: findFromSqlTablesToDealWithObj(table.tableName, 'ADDRESS_STREET'),
                            address_city: findFromSqlTablesToDealWithObj(table.tableName, 'ADDRESS_CITY'),
                            address_postcode: findFromSqlTablesToDealWithObj(table.tableName, 'ADDRESS_POSTCODE'),
                            address_iso_code: findFromSqlTablesToDealWithObj(table.tableName, 'ADDRESS_ISO_CODE'),
                            address_comment: findFromSqlTablesToDealWithObj(table.tableName, 'ADDRESS_COMMENT', false),
                            taxation: findFromSqlTablesToDealWithObj(table.tableName, 'TAXCODE') || ' ',
                            name_addr: findFromSqlTablesToDealWithObj(table.tableName, 'NAME_ADDR'),
                            email: findFromSqlTablesToDealWithObj(table.tableName, 'EMAIL') || ' ',
                            phone: findFromSqlTablesToDealWithObj(table.tableName, 'PHONE'),
                            address_id: findFromSqlTablesToDealWithObj(table.tableName, 'ADDRESS_ID'),
                        })

                        await customerAddrImportClass.prepareInsert()
                        break
                    case 'ORDERS':
                        //check if sales and warehouse locations are compatible
                        if(!OrderImport.checkSalesLocationAndWarehouse({
                            salesLocation: findFromSqlTablesToDealWithObj(table.tableName, 'SALES_LOCATION'),
                            warehouseLocation: findFromSqlTablesToDealWithObj(table.tableName, 'WAREHOUSE')
                        }))
                            return reject({
                                allOk: false,
                                customErrMsg: `SalesLocation: 
                                ${findFromSqlTablesToDealWithObj(table.tableName, 'SALES_LOCATION')}
                                 is not compatible with WarehouseLocation: 
                                 ${findFromSqlTablesToDealWithObj(table.tableName, 'WAREHOUSE')}`
                            })

                        if(await CustomerImport.checkCustomer(
                            findFromSqlTablesToDealWithObj(table.tableName, 'CUSTOMER_ORDER')
                        ))
                            return reject({
                                allOk: false,
                                customErrMsg: `Customer with 
                                ${findFromSqlTablesToDealWithObj(table.tableName, "CUSTOMER_ORDER")}
                                 number, does not exists in DB`
                            })

                        if(rowIndex === 0){
                            orderImportClass = new OrderImport({
                                orders_type: findFromSqlTablesToDealWithObj(table.tableName, "ORDERS_TYPE"),
                                project_field_0: findFromSqlTablesToDealWithObj(table.tableName, "PROJECT_FIELD_0"),
                                project_field_1: findFromSqlTablesToDealWithObj(table.tableName, "PROJECT_FIELD_1"),
                                project_field_2: findFromSqlTablesToDealWithObj(table.tableName, "PROJECT_FIELD_2"),
                                customer_order: findFromSqlTablesToDealWithObj(table.tableName, "CUSTOMER_ORDER"),
                                customer_delivery: findFromSqlTablesToDealWithObj(table.tableName, "CUSTOMER_DELIVERY"),
                                customer_invoice: findFromSqlTablesToDealWithObj(table.tableName, "CUSTOMER_INVOICE"),
                                orders_date: findFromSqlTablesToDealWithObj(table.tableName, "ORDERS_DATE"),
                                orderamount_net: null,
                                orderamount_bru: +findFromSqlTablesToDealWithObj('ORDERS_POSITIONS', 'PRICE_BRU'),
                                customer_orderref: findFromSqlTablesToDealWithObj(table.tableName, "CUSTOMER_ORDER"),
                                edi_orderresponse_sent: findFromSqlTablesToDealWithObj(table.tableName, "EDI_ORDERRESPONSE_SENT") || ' ',
                                release: findFromSqlTablesToDealWithObj(table.tableName, "RELEASE") || '0',
                                payed: findFromSqlTablesToDealWithObj(table.tableName, "PAYED") || '0',
                                currency: findFromSqlTablesToDealWithObj(table.tableName, "CURRENCY"),
                                orders_state: findFromSqlTablesToDealWithObj(table.tableName, "ORDERS_STATE") || '0',
                                voucher: findFromSqlTablesToDealWithObj(table.tableName, "VOUCHER"),
                                shipping_costs: +findFromSqlTablesToDealWithObj(table.tableName, "SHIPPING_COSTS"),
                                warehouse: findFromSqlTablesToDealWithObj(table.tableName, "WAREHOUSE"),
                                sales_location: findFromSqlTablesToDealWithObj(table.tableName, "SALES_LOCATION"),
                                delivery_method: findFromSqlTablesToDealWithObj(table.tableName, "DELIVERY_METHOD"),
                                comment: findFromSqlTablesToDealWithObj(table.tableName, "COMMENT"),
                                pac_qty: findFromSqlTablesToDealWithObj(table.tableName, "PAC_QTY"),
                                discount_perc: findFromSqlTablesToDealWithObj(table.tableName, "DISCOUNT_PERC"),
                                supply_order_reference: findFromSqlTablesToDealWithObj(table.tableName, "SUPPLY_ORDER_REFERENCE"),
                                last_delivery: findFromSqlTablesToDealWithObj(table.tableName, "LAST_DELIVERY"),
                                last_invoice: findFromSqlTablesToDealWithObj(table.tableName, "LAST_INVOICE"),
                                payment_term_id: findFromSqlTablesToDealWithObj(table.tableName, "PAYMENT_TERM_ID"),
                                webshop_id: findFromSqlTablesToDealWithObj(table.tableName, "WEBSHOP_ID"),
                                webshop_order_ref: findFromSqlTablesToDealWithObj(table.tableName, "WEBSHOP_ORDER_REF"),
                                discount: findFromSqlTablesToDealWithObj(table.tableName, "DISCOUNT"),
                            })

                            await orderImportClass.prepareInsert()
                                .catch((err)=>{
                                    console.log(err)
                                    return reject({
                                        allOk: false,
                                        customErrMsg: err
                                    })
                                })
                        }
                        break
                    case 'ORDERS_POSITIONS':
                        if(
                            await OrderPosImport.checkArticle(
                                findFromSqlTablesToDealWithObj(table.tableName, 'ITMNUM')
                            )
                        ){
                            return reject({
                                allOk: false,
                                customErrMsg: `Article with 
                                ${findFromSqlTablesToDealWithObj(table.tableName, 'ITMNUM')} 
                                number, does not exists in DB or it's not active`
                            })
                        }

                        orderPosImportClass = new OrderPosImport({
                            orders_number: orderImportClass.getColumnValue('orders_number'),
                            itmnum: findFromSqlTablesToDealWithObj(table.tableName, 'ITMNUM'),
                            price_bru: +findFromSqlTablesToDealWithObj(table.tableName, 'PRICE_BRU'),
                            price_net: null,
                            order_qty: +findFromSqlTablesToDealWithObj(table.tableName, 'ORDER_QTY'),
                            currency: findFromSqlTablesToDealWithObj(table.tableName, 'CURRENCY'),
                            position_id: positionID_ord,
                            dist_components_id: findFromSqlTablesToDealWithObj(table.tableName, 'DIST_COMPONENTS_ID'),
                            warehouse: findFromSqlTablesToDealWithObj(table.tableName, 'WAREHOUSE'),
                            delivered_qty: findFromSqlTablesToDealWithObj(table.tableName, 'DELIVERED_QTY'),
                            category_soas: findFromSqlTablesToDealWithObj(table.tableName, 'CATEGORY_SOAS') || 'SET',
                            parent_line_id: findFromSqlTablesToDealWithObj(table.tableName, 'PARENT_LINE_ID'),
                        }, orderImportClass.getColumnValue('customer_order'))

                        await orderPosImportClass.prepareInsert()

                        // if it's a supply/secondary orders then insert `SET` to positions
                        if(await SupplyOrderImport.checkIsItSupplyOrder(orderImportClass.getColumnValue('sales_location'))){
                            const tmpSecOrdPos = new SecondaryOrderPosImport({
                                orders_number_secondary: orderImportClass.secondaryOrderImportClass.getColumnValue('orders_number_secondary'),
                                itmnum_secondary: findFromSqlTablesToDealWithObj(table.tableName, 'ITMNUM'),
                                price_bru_secondary: +findFromSqlTablesToDealWithObj(table.tableName, 'PRICE_BRU'),
                                price_net_secondary: null,
                                order_qty_secondary: findFromSqlTablesToDealWithObj(table.tableName, 'ORDER_QTY'),
                                currency_secondary: findFromSqlTablesToDealWithObj(table.tableName, 'CURRENCY'),
                                position_id_secondary: positionID_ord,
                                dist_components_id_secondary: findFromSqlTablesToDealWithObj(table.tableName, 'DIST_COMPONENTS_ID'),
                                warehouse_secondary: '101', // TODO change hardcoded vars
                                delivered_qty_secondary: findFromSqlTablesToDealWithObj(table.tableName, 'DELIVERED_QTY'),
                                category_soas_secondary: findFromSqlTablesToDealWithObj(table.tableName, 'CATEGORY_SOAS') || 'SET',
                                parent_line_id_secondary: findFromSqlTablesToDealWithObj(table.tableName, 'PARENT_LINE_ID'),
                            })
                            await tmpSecOrdPos.prepareInsert()

                            const lastId = await tmpSecOrdPos.getLastInserted()

                            orderImportClass.addPosition({
                                itemNumber: tmpSecOrdPos.getColumnValue('itmnum_secondary'),
                                assignedQuantity: tmpSecOrdPos.getColumnValue('assigned_qty_secondary') || 0,
                                positionId: positionID_ord,
                                assignmentDate: new Date(),
                                warehouse: '101', // TODO change hardcoded vars
                                ordersPositionsId: lastId,
                                itemDes: tmpSecOrdPos.getColumnValue('itmdes_secondary'),
                                categorySoas: 'SET',
                                orderQuantity: tmpSecOrdPos.getColumnValue('order_qty_secondary'),
                                priceNet: 0,
                                priceBru: 0,
                                currency: tmpSecOrdPos.getColumnValue('currency_secondary'),
                                parentLineId: null,
                                distComponentId: tmpSecOrdPos.getColumnValue('dist_components_id_secondary'),
                            })
                        }

                        positionID_ord = await OrderPosImport.insertRestComponentsOrdPos(
                            {
                                ordersNumber: orderPosImportClass.getColumnValue('orders_number'),
                                itmnum: orderPosImportClass.getColumnValue('itmnum'),
                                order_qty: orderPosImportClass.getColumnValue('order_qty'),
                                positionID_ord,
                                supplyOrderNumber: orderImportClass?.supplyOrderImportClass?.getColumnValue('provider_order_supply'),
                                secondaryOrdersNumber: orderImportClass?.secondaryOrderImportClass?.getColumnValue('orders_number_secondary')
                            },
                            orderImportClass.getColumnValue('sales_location'),
                            orderImportClass?
                                (position: IPositionWC) => {orderImportClass.addPosition(position)}:
                                undefined
                        )

                        if(rowIndex > 0)
                            await OrderImport.updateNetAndBruPrice(
                                orderPosImportClass.getColumnValue('price_net'),
                                orderPosImportClass.getColumnValue('price_bru'),
                                orderImportClass.getColumnValue('orders_number'),
                                orderImportClass?.secondaryOrderImportClass?.getColumnValue('orders_number_secondary'),
                                orderImportClass.getColumnValue('customer_order'),
                            )
                        break
                }
            }

            //@ts-ignore
            if(rowIndex === results?.length - 1){
                fs.rename(
                    path.join(
                        __dirname,
                        'csv',
                        'imported',
                        'tmp',
                        file.name,
                    ),
                    path.join(
                        __dirname,
                        'csv',
                        'imported',
                        'imported_' + file.name,
                    ),
                    (err) => {
                    if (err) throw err;
                })

                if(orderImportClass?.getColumnValue('orders_number'))
                    await orderImportClass.invokeWarehouseControl(username)

                resolve({
                    allOk: true
                })
            }

            rowIndex++
        }
    })
}

