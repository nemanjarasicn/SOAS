/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 31.05.2021 */

import * as mssqlCall from '../../mssql_call';
import {constants} from '../../constants/constants';
import {getTableTemplate} from '../../mssql_logic';
import {checkDate} from '../date/Date';
import {getAllLanguages} from '../languages/Languages';

/**
 * localize data
 *
 * @param reffTable
 * @param languageTag
 */
export async function localizeIt(reffTable: string, languageTag: string) {
    let templateData: any[] = [];
    let counterArray = [];
    let tableTemplateData: any = await getTableTemplate(reffTable);
    let tableTemplateDataArray = tableTemplateData[0].TEMPLATE_FIELDS.split(',');
    let localizeData: any = await getLocalizeData(languageTag);
    for (let i = 0; i < tableTemplateDataArray.length; i++) {
        for (let j = 0; j < localizeData.length; j++) {
            if (localizeData[j].LOCALIZE_TAG === tableTemplateDataArray[i].trim()) {
                templateData.push({
                    name: localizeData[j][languageTag], dbField: tableTemplateDataArray[i].trim()
                });
                counterArray.push(i)
            }
        }
    }
    if (counterArray.length < tableTemplateDataArray.length) {
        let addCount: number = 0;
        for (let i = 0; i < counterArray.length; i++) {
            let compare: number = i + addCount;
            if (counterArray[i] !== compare) {
                templateData.push({
                    name: tableTemplateDataArray[i].trim(),
                    dbField: tableTemplateDataArray[i].trim()
                });
                addCount++;
            }
        }
    }
    return templateData;
}

/**
 * Prepare fields for adding to form.
 *
 * @param data fields from TABLE_TEMPLATES
 * @param language
 * @param lockedFields
 * @param refTable
 */
export async function getThisLocalizeData(data: any, language: string, lockedFields: any, refTable: string) {
    let dataJson;
    let isNotTranslated = true;
    let result: any = [];
    let otherTypes: any = {
        RELEASE: 'checkbox',
        PAYED: 'checkbox',
        CROSSSELLING: 'pautocomplete',
        CROSSSELLING_ID: 'hidden', // Workaround to have CROSSSELLING_ID at articles, besides CROSSSELLING_DATA
        // CROSSSELLING: 'textarea', // 'autocomplete'
        // CROSSSELLING_DATA: 'pautocomplete', // 'textarea',
        ATTR_CRAFT: 'checkbox',
        ATTR_SHOP_ACTIVE: 'checkbox',
        ATTR_WP_BM: 'checkbox',
        ACTIVE_FLG: 'checkbox',
        ATTR_BRAND: 'select',
        EDI_ORDERRESPONSE_SENT: 'checkbox',
        EDI_INVOIC: 'checkbox',
        EDI_ORDERSP: 'checkbox',
        EDI_DESADV: 'checkbox',
        EXPORT_PRINT: 'checkbox',
        RETOUR: 'checkbox',
        BATCH_ACTIVE: 'checkbox',
        PAYMENT_ACTIVE: 'checkbox',
        ORDERS_STATE: 'select',
        DELIVERY_NOTES_STATE: 'select',
        INVOICES_STATE: 'select',
        COMMENT_IMAGE: 'textarea',
        COMMENT_FILE: 'textarea',
        ID: 'hidden',
        CLIENT: 'select',
        CURRENCY: 'select',
        CUSTOMER_ADDRESSES_ID_DELIVERY: 'select',
        CUSTOMER_ADDRESSES_ID_INVOICE: 'select',
        LANGUAGE: 'select',
        PAYMENT_TERM_ID: refTable === 'orders' || refTable === 'invoice' || refTable === 'custbtwoc' ||
        // ToDo: Manage to set 'select' type for order and 'input' type for payment term view
        refTable === 'custbtwob' ? 'select' : 'input',
        PAYMENT_TERM_ACTIVE: 'checkbox',
        CUSTOMER_ORDER: 'autocomplete',
        CROSSSELLING_FLG: 'checkbox',
        ITEM_BASIS_ID: 'hidden',
        ATTRIBUTE_ID: 'hidden',
        PROD_UNIT: 'select',
        RAW_FLG: 'checkbox',
        PROVIDERS_COUNTRY: 'select',
        CATEGORY_SOAS: 'select',
        PAYMENT_CONFIRMED: 'checkbox',
        PARTLY_DELIVERY: 'checkbox',
        PARTLY_INVOICE: 'checkbox',
        ADDRESS_CRYNAME: 'select',
        TAXATION: 'select',
        ADDRESS_ISO_CODE: 'select'
    };
    let notRequired = {
        PHONE_1: 'none',
        FAX_0: 'none',
        MOB_1: 'none',
        ADDRESS_COMMENT: 'none',
        INVOICES_UPDATE: 'none',
        PAYMENT_TERM_COMMENT: 'none'
    };
    //let readonly: any = false; // false => editierbar; true => gesperrt
    let statesClearText = false;
    // logger.info('lockedFields', lockedFields);
    let lockedFieldsArr: string[] = lockedFields && lockedFields[0] && lockedFields[0].LOCKED_FIELDS ?
        lockedFields[0].LOCKED_FIELDS.split(',') : [];
    let localData: any = await getLocalizeData(language);
    for (let h = 0; h < data.length; h++) {
        dataJson = data[h];
        result[h] = [];
        for (let key in dataJson) {
            if (dataJson.hasOwnProperty(key)) {
                for (let i = 0; i < localData.length; i++) {
                    // Important: If field is not in table [LOCALIZE_IT], it will be not added to result
                    if (localData[i]['LOCALIZE_TAG'] === key) {
                        let id = undefined;
                        if (key === 'ID' || key === 'ATTRIBUTE_ID') {
                            id = dataJson[key];
                        }
                        // console.log('KEYYYYYYYY: ', key);
                        // console.log('IDDDDDDDDD: ', id);
                        // console.log("SHOULD BE LOCKED: ", lockedFieldsArr.includes(key));
                        result[h].push({
                            // id: id,
                            label: localData[i][language],
                            value: statesClearText ? statesClearText : checkDate(dataJson[key]),
                            name: key,
                            // required: 'true',
                            readonly: lockedFieldsArr.includes(key) ? 'true' : 'false',
                            type: otherTypes.hasOwnProperty(key) ? otherTypes[key] : 'input',
                            inputType: 'text',
                            validations: [
                                {
                                    name: "required",
                                    validator: notRequired.hasOwnProperty(key) ? "none" : "required",
                                    message: key.toUpperCase() + "_REQUIRED" // Name Required
                                },
                                {
                                    name: "pattern",
                                    validator: "^[a-zA-Z]+$",
                                    message: "ACCEPT_ONLY_TEXT" // Accept only text
                                }
                            ]
                            //readonly: readonly
                        });
                        if (id) {
                            result[h].id = id;
                        }
                        // if(otherTypes.hasOwnProperty(key)) {
                        //     // @ts-ignore
                        //     if (otherTypes[key] === 'checkbox') {
                        //         result[h].checked = result[h].value;
                        //     }
                        // }
                        isNotTranslated = false;
                        statesClearText = false;
                        break
                    }
                }
                if (isNotTranslated) {
                    // console.log('NOT TRANSLATED: ');
                    result[h].push({
                        label: key,
                        value: statesClearText ? statesClearText : checkDate(dataJson[key]),
                        name: key,
                        // required: 'true',
                        readonly: 'false',
                        type: otherTypes.hasOwnProperty(key) ? otherTypes[key] : 'input',
                        inputType: 'text',
                        validations: [
                            {
                                name: "required",
                                validator: notRequired.hasOwnProperty(key) ? "none" : "required",
                                message: key.toUpperCase() + "_REQUIRED" // Name Required
                            },
                            {
                                name: "pattern",
                                validator: "^[a-zA-Z]+$",
                                message: "ACCEPT_ONLY_TEXT" // Accept only text
                            }
                        ]
                        //readonly: readonly
                    });
                }
                isNotTranslated = true;
            }
        }
    }
   return result;
}

/**
 * get localized data for given language
 *
 * @param language - DE_DE
 */
export async function getLocalizeData(language: string) {
    if (language && language.length > 0) {
        let languages: any[] = await getAllLanguages();
        const foundLanguageCode: any = languages.find( l => l.LANGUAGE_CODE === language);
        if (foundLanguageCode) {
            let localizeQuery: string = `SELECT ` + language + `,LOCALIZE_TAG FROM ` +
                constants.DB_TABLE_PREFIX + `LOCALIZE_IT`;
            return await mssqlCall.mssqlCall(localizeQuery);
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * get all localized tags for one language
 *
 * @param language
 */
export async function getAllLocalizedData(language: string) {
    let result: any[] = [];
    let data: any = await getLocalizeData(language);
    for (let i = 0; i < data.length; i++) {
        result[data[i].LOCALIZE_TAG] = data[i][language];
    }
    return result;
}
