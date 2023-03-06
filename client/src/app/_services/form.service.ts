import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {
  ConstantsService,
  FormlyTemplateOptions,
  SoasModel,
  ViewQueryTypes
} from './constants.service';
import {TableDataService} from './table-data.service';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {formatDate} from '@angular/common';
import {HelperService} from './helper.service';
import {TranslateItPipe} from '../shared/pipes/translate-it.pipe';
import {HttpClient} from '@angular/common/http';
import {OptionsService} from './options.service';
import {FormOptionsINV} from "../interfaces/form-options";
import { Console } from 'console';

@Injectable({
  providedIn: 'root',
})
export class FormService {

  form = new FormGroup({});
  model: any|SoasModel;
  // options: FormlyFormOptions = {
  //   formState: {
  //     disabled: true, // disable whole form
  //     newItemMode: false, // new item mode
  //   },
  // };
  fields: FormlyFieldConfig[] = [];

  // field name that should not be added to post form values
  fieldNamesToIgnore: string[] = [
    this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_ID,
    this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV_ID,
    // 'INVOICES_NUMBER',
    // 'INVOICES_CUSTOMER',
    // 'INVOICES_DATE',
    // 'INVOICES_CREATOR',
    // 'PDF_CREATED_DATE',
    // 'PDF_DOWNLOAD_LINK'
  ];

  // variables to manage local storage items and can be set

  // selected item local storage key (main view table)
  selItemLocalStorageKey: string;
  // selected item local storage key (details view table)
  selDetailsItemLocalStorageKey: string;
  // selected item referral table name
  selItemRefTableTitle: string;

  // primary referral table column name to query table by
  primaryTableColumnName: string;

  private translatePipe: TranslateItPipe;

  constructor(private tableDataService: TableDataService,
              private helperService: HelperService,
              private CONSTANTS: ConstantsService,
              private http: HttpClient,
              private optionsService: OptionsService) {
  }

  /**
   * set translate pipe
   *
   * @param translatePipe
   */
  public setTranslatePipe(translatePipe: TranslateItPipe) {
    this.translatePipe = translatePipe;
    this.optionsService.setTranslatePipe(translatePipe);
  }

  /**
   * get form data model and fields:
   *  model - data model with values
   *  fields - form fields from FORM_TEMPLATES table
   *
   * @param refTable
   * @param newItemMode
   * @param customerColumn
   * @param customerNumber
   * @param secondColumn
   * @param secondId
   * @param formOptions
   * @param formDisabled
   */
  public async getFormConfigData(
    refTable: string,
    newItemMode: boolean,
    customerColumn: string,
    customerNumber: undefined | string,
    secondColumn: string,
    secondId: string,
    formOptions: {},
    formDisabled: boolean
  ): Promise<{ model: SoasModel, fields: FormlyFieldConfig[], dbdata?: {} }> {
    this.model = {};
    this.fields = [];
    // console.log('load form: ', refTable);
    // load formly template
    const dbData: {formTemplate: any} = await this.tableDataService.getFormlyForm('formly_' + refTable);
    if (!dbData) {
      return {model: this.model, fields: this.fields};
    } else {
      let formData = '';
      if (refTable === this.CONSTANTS.REFTABLE_ORDERS_POSITIONS ||
        refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS ||
        refTable === this.CONSTANTS.REFTABLE_INVOICE_POSITIONS) {
        // Do nothing...
      } else {
        if (dbData.formTemplate && dbData.formTemplate[0] && dbData.formTemplate[0].FORM_TEMPLATE) {
          formData = dbData.formTemplate[0].FORM_TEMPLATE;
          formData = this.translateSections(formData);
          this.fields = JSON.parse(formData);
        } else {
          console.log('ERROR: getFormConfigData - DB data is empty! Have you added form config to db?');
          return {model: this.model, fields: this.fields};
        }
      }
      // load data for formly form template
      const dbDataFFD: {row: { data: {}, rows: number, page: number }} =
        await this.tableDataService.getFormlyFormData(refTable, customerColumn, customerNumber,
        secondColumn, secondId);
      let fieldsItemsNumber = 0;
      let modelItemsNumber = 0;
      let attribOptions: any[] = [];
      if (!dbDataFFD) {
        return {model: this.model, fields: this.fields};
      }
      let dbDataOne: {} = {};
      if (dbDataFFD.row && dbDataFFD.row.data) {
        dbDataOne = dbDataFFD.row.data[1] ? dbDataFFD.row.data[1] : dbDataFFD;
        this.setModelValues(newItemMode, refTable, dbDataFFD, formOptions, attribOptions);
        formDisabled = !formDisabled ? this.getFormDisabled() : formDisabled;
        // Set field options
        fieldsItemsNumber = await this.setFormFields(newItemMode, refTable, customerNumber, attribOptions,
          fieldsItemsNumber, formOptions, dbDataFFD, formDisabled);
      };
      modelItemsNumber = Object.keys(this.model).length;
      // Orders and invoices models have temp field CUSTOMER_ADDRESSES and CUSTOMER_TAXATIONS (+2 virtual ields)
      // or Article model have temp field CROSSSELLING_ID (+1 virtual ield),
      // so reduce number
      // AA.CROSSSELLING AS CROSSSELLING_ID, BB.CROSSSELLING_DATA AS CROSSSELLING
      modelItemsNumber = ((refTable === this.CONSTANTS.REFTABLE_ORDERS) || (refTable === this.CONSTANTS.REFTABLE_INVOICE) ||
        (refTable === this.CONSTANTS.REFTABLE_ARTICLES)) ? (modelItemsNumber ?
        modelItemsNumber - ((refTable === this.CONSTANTS.REFTABLE_ARTICLES) ? 1 : 2) : modelItemsNumber) : modelItemsNumber;
      if (this.model && (newItemMode ||
        (refTable === this.CONSTANTS.REFTABLE_ORDERS_POSITIONS ||
          refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS ||
          refTable === this.CONSTANTS.REFTABLE_COMPANIES ||
          refTable === this.CONSTANTS.REFTABLE_INVOICE_POSITIONS) ||
        ((refTable === this.CONSTANTS.VIRTUAL_REFTABLE_ARTICLES_ATTRIBUTES) ||
          modelItemsNumber === fieldsItemsNumber))) {
        if (refTable === this.CONSTANTS.VIRTUAL_REFTABLE_ARTICLES_ATTRIBUTES) {
          return {model: this.model, fields: this.fields, dbdata: dbDataOne};
        } else {
          return {model: this.model, fields: this.fields};
        }
      } else {
        console.log('Error: model (TABLE_TEMPLATES) and fields (FORM_TEMPLATES) lengths are not equal. ',
          modelItemsNumber + ' vs ' + fieldsItemsNumber);
        // if model = 0 - check if data in TABLE_TEMPLATES is correct
        this.model = {};
        this.fields = [];
        return {model: this.model, fields: this.fields};
      }
    }
  }

  /**
   * translate form title sections
   *
   * e.g.: TAXATION => Beträge/Amounts
   *
   * @param formData
   * @private
   */
  public translateSections(formData: string) {
    const sections = ['CUSTOMERS_NUMBER', 'ADDRESS', 'AMOUNTS', 'TAXATION', 'LAST_DELIVERY_INVOICE', 'WEBSHOP'];
    for (let item in sections) {
      if (sections.hasOwnProperty(item)) {
        formData = formData.replace(
          '<div class=\\"form-section-title\\"><strong>' + sections[item] + ':</strong></div>',
          '<div class=\\"form-section-title\\">' +
          '<strong>' + this.translatePipe.transform(sections[item]) + ':</strong></div>');
      }
    }
    return formData;
  }

  /**
   * set form fields. set fields options, default value, disabled flag and translate labels.
   *
   * @param newItemMode
   * @param refTable
   * @param customerNumber
   * @param attribOptions
   * @param fieldsItemsNumber
   * @param formOptions
   * @param dbData
   * @param formDisabled
   */
  public async setFormFields(newItemMode: boolean, refTable: string, customerNumber: string, attribOptions: any[],
                             fieldsItemsNumber: number, formOptions: {}, dbData: {}, formDisabled: boolean): Promise<number> {
    /**
     * save form values to db
     *
     * 'refTable': 'countries'    => REF_TABLE from TABLE_TEMPLATES: string
     * 'tableName': 'COUNTRIES'   => (PRIMARY)TABLE_NAME from TABLE_TEMPLATES: string
     * 'newItemMode': 'false'     => New item mode: boolean
     * 'isPrimary': 'true'        => Is primary field flag: boolean
     * 'isSecondary': 'true'      => Is secondary field flag: boolean
     * 'isTertiary': 'true'       => Is tertiary field flag: boolean
     * 'needsValidation': 'false'  => Field value need to be validated: boolean
     * 'templateOptions.disabled': 'true' => Field should be readonly by default: boolean
     * 'parentId': '1111'         => Parent id: number. For example is used for Article > Crossselling field,
     *                                to determine CROSSSELLING_ID
     */
    if (this.fields) {
      for (const item in this.fields) {
        if (this.fields.hasOwnProperty(item)) {
          if (this.fields[item] && (Object.keys(this.fields[item]).indexOf('fieldGroup') !== -1)) {
            // if (this.fields[item].fieldGroup[0]) {
            // a field group can contain many fields, so iterate over it
            for (const groupItem in this.fields[item].fieldGroup) {
              if (this.fields[item].fieldGroup.hasOwnProperty(groupItem)) {
                let fieldGroupItem: FormlyFieldConfig = this.fields[item].fieldGroup[groupItem];
                fieldGroupItem =
                  await this.setFieldsOptions(fieldGroupItem, refTable, newItemMode, customerNumber, dbData);
                if (fieldGroupItem.templateOptions) {
                  if (fieldGroupItem.templateOptions.hasOwnProperty(FormlyTemplateOptions.NEW_ITEM_MODE)) {
                    fieldGroupItem.templateOptions[FormlyTemplateOptions.NEW_ITEM_MODE] = newItemMode;
                  } else {
                    console.log('Property newItemMode doesn\'t exists! RefTable: ', refTable);
                  }

                  // if (fieldGroupItem.templateOptions.hasOwnProperty(FormlyTemplateOptions.TABLE_NAME)) {
                  //   // fieldGroupItem.templateOptions[FormlyTemplateOptions.TABLE_NAME] = newItemMode;
                  // } else {
                  //   console.log('Property tableName doesn\'t exists! RefTable: ', refTable);
                  // }

                  // Article > Crossselling form field. Set id to be able to update value at server.
                  if (fieldGroupItem.templateOptions.hasOwnProperty(FormlyTemplateOptions.PARENT_ID) &&
                    this.model['CROSSSELLING_ID']) {
                    fieldGroupItem.templateOptions[FormlyTemplateOptions.PARENT_ID] = this.model['CROSSSELLING_ID'];
                  }

                  if (fieldGroupItem.templateOptions.hasOwnProperty(FormlyTemplateOptions.ISSET_VALUE) && fieldGroupItem.templateOptions.hasOwnProperty(FormlyTemplateOptions.NEW_ITEM_MODE) ) {
                    let valueTmp = await this.tableDataService.getLastColumnValue('PROVIDERS', 'PROVIDERS_NUMBER');
                    fieldGroupItem.defaultValue =  valueTmp['value'] !== null  ? parseInt(valueTmp['value']) + 1  :  '10000';
                  }

                  // commented out - form fields disable flag will be set from db > FORM_TEMPLATE
                  // if new item mode - enable all fields by default (except select types)
                  // if (newItemMode) {
                  //   if (fieldGroupItem.expressionProperties &&
                  //     fieldGroupItem.expressionProperties.hasOwnProperty('templateOptions.disabled')) {
                  //     if (this.isFieldEnabled(fieldGroupItem)) {
                  //       fieldGroupItem.expressionProperties = {'templateOptions.disabled': 'false'};
                  //     }
                  //   }
                  // }
                } else if (fieldGroupItem.fieldGroup) {
                  // Article > Attributes: ATTR_CATEGORY_0, ATTR_BRAND...
                  // For all DEFAULT ATTRIBUTES: set parentId with article number, to be able to save/update
                  if (fieldGroupItem.fieldGroup[0].templateOptions.hasOwnProperty(FormlyTemplateOptions.PARENT_ID) &&
                    (this.CONSTANTS.ARTICLE_DEFAULT_ATTRIBUTES.indexOf(fieldGroupItem.fieldGroup[0].key.toString()) !== -1)
                  ) {
                    fieldGroupItem.fieldGroup[0].templateOptions[FormlyTemplateOptions.PARENT_ID] = customerNumber;
                  }
                }
                this.fields[item].fieldGroup[groupItem] = fieldGroupItem;
              }
            }
            // count field items
            if (this.fields[item].fieldGroup) {
              for (const fGItem in this.fields[item].fieldGroup) {
                if (this.fields[item].fieldGroup.hasOwnProperty(fGItem)) {
                  if (
                    refTable ===
                    this.CONSTANTS.VIRTUAL_REFTABLE_ARTICLES_ATTRIBUTES &&
                    this.fields[item].fieldGroup[fGItem].fieldGroup
                  ) {
                    for (const fGItem2 in this.fields[item].fieldGroup[fGItem]
                      .fieldGroup) {
                      if (
                        this.fields[item].fieldGroup[
                          fGItem
                          ].fieldGroup.hasOwnProperty(fGItem2)
                      ) {
                        if (
                          attribOptions.indexOf(
                            this.fields[item].fieldGroup[fGItem].fieldGroup[
                              fGItem2
                              ].key.toString()
                          )
                        ) {
                          this.translateAttrFieldLabel(
                            item,
                            fGItem,
                            parseInt(fGItem2, 10)
                          );
                          this.fields[item].fieldGroup[fGItem].fieldGroup[
                            fGItem2
                            ].templateOptions.options =
                            attribOptions[
                              this.fields[item].fieldGroup[fGItem].fieldGroup[
                                fGItem2
                                ].key.toString()
                              ];
                          fieldsItemsNumber = this.fields[item].fieldGroup[
                            fGItem
                            ].fieldGroup[fGItem2].key
                            ? fieldsItemsNumber + 1
                            : fieldsItemsNumber;
                        }
                      }
                    }
                  } else {
                    this.translateFieldLabel(item, parseInt(fGItem, 10));
                  }
                  // disable all fields
                  this.setFieldsDisabled(item, fGItem, formDisabled);
                  if (this.fields[item].fieldGroup[fGItem].key) {
                    fieldsItemsNumber = this.fields[item].fieldGroup[fGItem].key
                      ? fieldsItemsNumber + 1
                      : fieldsItemsNumber;
                  }
                }
              }
            }
          } else {
            fieldsItemsNumber = this.fields[item].key
              ? fieldsItemsNumber + 1
              : fieldsItemsNumber;
          }
          // Disable fields without fieldGroup
          if (this.fields[item].key === 'RELEASE' && this.model?.RELEASE) {
            this.fields[item].expressionProperties = {
              'templateOptions.disabled': this.model.RELEASE ? 'true' : 'false',
            };
          }
        }
      }
      this.addAdditionalAttributesFields(refTable, attribOptions, formOptions);
    }
    return fieldsItemsNumber;
  }

  /**
   * returns boolean flag, if given field group item should be disabled or not
   *
   * Is enabled if:
   * - field type is not select
   * - isPrimary flag does not exists in templateOptions or is set to true and isIdentity flag does not exists
   *     in templateOptions or is set to false
   *
   * @param fieldGroupItem
   * @private
   */
  private isFieldEnabled(fieldGroupItem: FormlyFieldConfig): boolean {
    return (fieldGroupItem.key !== 'CUSTOMERS_NUMBER' && fieldGroupItem.key !== 'ORDERS_NUMBER') ||
      ((!fieldGroupItem.templateOptions.hasOwnProperty(FormlyTemplateOptions.IS_PRIMARY) ||
          (fieldGroupItem.templateOptions.hasOwnProperty(FormlyTemplateOptions.IS_PRIMARY) &&
            (fieldGroupItem.templateOptions[FormlyTemplateOptions.IS_PRIMARY] === 'true')) &&
          !fieldGroupItem.templateOptions.hasOwnProperty(FormlyTemplateOptions.IS_IDENTITY) ||
          (fieldGroupItem.templateOptions.hasOwnProperty(FormlyTemplateOptions.IS_IDENTITY) &&
            (fieldGroupItem.templateOptions[FormlyTemplateOptions.IS_IDENTITY] === 'false'))) &&
        fieldGroupItem.type !== 'native-select');
  }

  /**
   * set fields options (like payment terms, states, currencies, languages etc.) and set default values, set fields
   * enabled/disabled, set date.
   *
   * ID, CUSTOMERS_NUMBER, ORDERS_NUMBER - add a message 'WILL_BE_AUTO_GENERATED' that user knows, that this field
   * will be set automatically at server
   *
   * @param fieldGroupValue => this.fields[item].fieldGroup[0]
   * @param refTable
   * @param newItemMode
   * @param customerNumber
   * @param dbData
   * @private
   */
  private async setFieldsOptions(fieldGroupValue: FormlyFieldConfig, refTable: string,
                                 newItemMode: boolean, customerNumber: string, dbData: {}): Promise<FormlyFieldConfig> {
    // this.customFormComponent.first.customForm.fields[0].fieldGroup[0].templateOptions.tableName);
    if (fieldGroupValue.key === 'ID') {
      if ((refTable === this.CONSTANTS.REFTABLE_ARTICLES) ||
        (refTable === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV ||
          refTable === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV)) {
        fieldGroupValue.defaultValue =
          newItemMode ? this.translatePipe.transform('WILL_BE_AUTO_GENERATED') : undefined;
      }
    } else if (
      fieldGroupValue.key === 'PAYMENT_TERM_ID'
    ) {
      fieldGroupValue.templateOptions.options = this.optionsService.paymentTermsOptions;
      fieldGroupValue.defaultValue = undefined;
    } else if (
      fieldGroupValue.key === 'ORDERS_STATE' ||
      fieldGroupValue.key === 'DELIVERY_NOTES_STATE' ||
      fieldGroupValue.key === 'INVOICES_STATE'
    ) {
      fieldGroupValue.templateOptions.options = this.optionsService.statesOptions;
    } else if (fieldGroupValue.key === 'CURRENCY') {
      fieldGroupValue.templateOptions.options = this.optionsService.pcurrencies;
    } else if (fieldGroupValue.key === 'WAREHOUSE') {
      // && refTable === this.CONSTANTS.REFTABLE_ORDERS) {
      // only if orders table. at ordersPositions show as text
      fieldGroupValue.templateOptions.options = this.optionsService.warehousingLocations; // pwarehouses;
      fieldGroupValue.defaultValue = undefined;
    } else if (fieldGroupValue.key === 'CLIENT' || fieldGroupValue.key === 'CUSTOMERS_TYPE') {
      fieldGroupValue.templateOptions.options = this.optionsService.customertypes;
      // enable customers type editing at new mode only for orders and invoice
      // notice setFormFields() function, where native-select types (e.g. 'CUSTOMERS_TYPE') are not enabled by default
      if ((refTable === this.CONSTANTS.REFTABLE_ORDERS) || (refTable === this.CONSTANTS.REFTABLE_INVOICE)) {
        fieldGroupValue.expressionProperties = {
          'templateOptions.disabled': 'true'
        };
      }
    } else if (fieldGroupValue.key === 'LANGUAGE') {
      fieldGroupValue.templateOptions.options = this.optionsService.planguages;
    } else if (fieldGroupValue.key === 'CATEGORY_SOAS') {
      fieldGroupValue.templateOptions.options = this.optionsService.soasCategories;
    } else if (fieldGroupValue.key === 'UPDATE_LOC') {
      fieldGroupValue.defaultValue = newItemMode
        ? this.helperService.getCurrentDate()
        : undefined;
    } else if (
      fieldGroupValue.key === 'PROVIDERS_COUNTRY' ||
      fieldGroupValue.key === 'ADDRESS_ISO_CODE'
    ) {
      // value: 'DE'
      fieldGroupValue.templateOptions.options = this.optionsService.pcountries;
    } else if (fieldGroupValue.key === 'ADDRESS_CRYNAME') {
      // value: 'Deutschland'
      fieldGroupValue.templateOptions.options = this.optionsService.pcountriesON;
    } else if (fieldGroupValue.key === 'WHLOC') {
      fieldGroupValue.templateOptions.options = this.optionsService.warehousingLocations;
    } else if (fieldGroupValue.key === 'SALES_LOCATION') {
      fieldGroupValue.defaultValue = undefined;
      fieldGroupValue.templateOptions.options = this.optionsService.salesLocations;
      const positionAvailable: boolean = await this.isPositionAvailable(customerNumber);
      if (positionAvailable) {
        fieldGroupValue.expressionProperties = {
          'templateOptions.disabled': 'true',
        };
      }
    } else if (fieldGroupValue.key === 'STATUS_POS') {
      fieldGroupValue.templateOptions.options = this.optionsService.statusPos;
    } else if (fieldGroupValue.key === 'PROVIDER') {
      fieldGroupValue.templateOptions.options = this.optionsService.provider;
    } else if (fieldGroupValue.key === 'ORDERS_NUMBER') {
      fieldGroupValue.defaultValue =
        newItemMode ? this.translatePipe.transform('WILL_BE_AUTO_GENERATED') : undefined;
      // if (refTable === 'orders' && dbData && dbData['row'] && dbData['row']['data'] && dbData['row']['data'][1] &&
      //   dbData['row']['data'][1][0] && dbData['row']['data'][1][0].ORDERS_NUMBER) {
      //   await this.optionsService.getWarehouseOptForSelect(dbData['row']['data'][1][0].ORDERS_NUMBER);
      // }
    } else if (fieldGroupValue.key === 'CUSTOMER_ADDRESSES_ID_DELIVERY') { // ORDERS
      fieldGroupValue.templateOptions.options = this.optionsService.addressesDLV;
    } else if (fieldGroupValue.key === 'CUSTOMER_ADDRESSES_ID_INVOICE') { // ORDERS
      fieldGroupValue.templateOptions.options = this.optionsService.addressesINV;
    // } else if (fieldGroupValue.key === 'TAXATION') { // renamed to TAXCODE at CustomersAddresses on 20220216
    //   fieldGroupValue.templateOptions.options = this.optionsService.pTaxRelations;
    } else if (fieldGroupValue.key === 'TAXCODE') {
      fieldGroupValue.templateOptions.options = this.optionsService.taxCodes;
    } else if (fieldGroupValue.key === 'TAXRATE') {
      fieldGroupValue.templateOptions.options = this.optionsService.taxRates;
    } else if (fieldGroupValue.key === 'CUSTOMERS_NUMBER') {
      if (refTable === this.CONSTANTS.REFTABLE_CUSTOMER || refTable === this.CONSTANTS.REFTABLE_PARTNERS) {
        fieldGroupValue.defaultValue =
          newItemMode ? this.translatePipe.transform('WILL_BE_AUTO_GENERATED') : undefined;
      } else if (refTable === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV ||
        refTable === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV) {
        fieldGroupValue.defaultValue = newItemMode ? customerNumber : undefined;
        fieldGroupValue.expressionProperties = {
          'templateOptions.disabled': 'true',
        };
      }
    } else if (fieldGroupValue.key === 'ATTR_YOUTUBE') {
      // @ts-ignore
      if (dbData.row.data[1] && dbData.row.data[1]) { // @ts-ignore
        for (const pmElm in dbData.row.data[1]) { // @ts-ignore
          if (dbData.row.data[1].hasOwnProperty(pmElm)) {
            if ( // @ts-ignore
              dbData.row.data[1][pmElm].ATTRIBUTE_NAME === 'ATTR_YOUTUBE'
            ) { // @ts-ignore
              fieldGroupValue.id = dbData.row.data[1][pmElm].ATTRIBUTE_ID;
            }
          }
        }
      }
      // Set validation patterns
      // if (fieldGroupValue.key === 'ATTR_YOUTUBE') {
      //   fieldGroupValue.templateOptions.pattern =
      //     /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+
      //     [a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      //   fieldGroupValue.validation = {
      //     messages: {
      //       pattern: (error, field: FormlyFieldConfig) => `'${field.formControl.value}' is not a valid URL`,
      //     },
      //   };
      // }
    } else if (fieldGroupValue.key === 'CUSTOMER_ORDER') {
      fieldGroupValue.expressionProperties = {
        'templateOptions.disabled': newItemMode ? 'false' : 'true',
      };
    }
    // Disable fields
    if (fieldGroupValue.key === 'RELEASE' && this?.model.RELEASE) {
      fieldGroupValue.expressionProperties = {
        'templateOptions.disabled': this.model.RELEASE ? 'true' : 'false',
      };
    }
    if (refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      this.setInvoiceFieldsAtNewItemMode(refTable, newItemMode, fieldGroupValue);
    }
    return fieldGroupValue;
  }

  /**
   * set invoice fields at new item mode
   *
   * @param refTable
   * @param newItemMode
   * @param fieldGroupValue
   * @private
   */
  private setInvoiceFieldsAtNewItemMode(refTable: string, newItemMode: boolean, fieldGroupValue: FormlyFieldConfig) {
    if (newItemMode) {
      if (fieldGroupValue.key === 'INVOICES_NUMBER') {
        fieldGroupValue.defaultValue =
          newItemMode ? this.translatePipe.transform('WILL_BE_AUTO_GENERATED') : undefined;
      } else if (fieldGroupValue.key === 'INVOICES_CUSTOMER' || fieldGroupValue.key === 'INVOICES_DATE' ||
        fieldGroupValue.key === 'PAYMENT_TERM_ID' ||
        // fieldGroupValue.key === 'DELIVERY_NOTES_NUMBER' || fieldGroupValue.key === 'ORDERS_NUMBER' ||
        fieldGroupValue.key === 'CURRENCY' || fieldGroupValue.key === 'SALES_LOCATION') {
        fieldGroupValue.expressionProperties = {
          'templateOptions.disabled': newItemMode ? 'false' : 'true',
        };
      }

      // set orders, delivery notes number etc. to '', because this db fields are set as 'NOT NULL'
      if (fieldGroupValue.key === 'ORDERS_NUMBER' || fieldGroupValue.key === 'DELIVERY_NOTES_NUMBER' ||
        fieldGroupValue.key === 'INVOICES_UPDATE') {
        fieldGroupValue.defaultValue = ''; // undefined;
      } else if (fieldGroupValue.key === 'INVOICES_STATE') {
        fieldGroupValue.defaultValue = this.CONSTANTS.INV_STATES_OPEN;
      } else if (fieldGroupValue.key === 'CURRENCY') {
        fieldGroupValue.defaultValue = undefined; // this.CONSTANTS.CURRENCY_EU_ID;
      } else if (fieldGroupValue.key === 'INVOICES_DATE') {
        fieldGroupValue.defaultValue = this.helperService.getCurrentDate()?.substr(0,10).trim();
      } else if (fieldGroupValue.key === 'INVOICES_CREATOR') {
        fieldGroupValue.defaultValue = localStorage.getItem(this.CONSTANTS.LS_USERNAME);
      } else if (fieldGroupValue.key === 'PDF_CREATED_DATE') {
        // fieldGroupValue.defaultValue = this.helperService.getCurrentDate()?.substr(0,10).trim();
      } else if (fieldGroupValue.key === 'PAYMENT_TERM_ID' || fieldGroupValue.key === 'SALES_LOCATION') {
        fieldGroupValue.defaultValue = undefined;
      }
    }
  }

  /**
   * set fields disabled flag by formDisabled.
   *
   * if formDisabled is true disable all form fields. otherwise check for every field if 'templateOptions.disabled' data
   * is already available. templateOptions.disabled can be set in db at form JSON for every form field separately.
   *
   * @param item
   * @param fGItem
   * @param formDisabled
   * @private
   */
  private setFieldsDisabled(
    item: string,
    fGItem: string,
    formDisabled: boolean
  ) {
    if (formDisabled) {
      this.fields[item].fieldGroup[fGItem].expressionProperties = {
        'templateOptions.disabled': 'true',
      };
    } else {
      if (this.fields[item].fieldGroup[fGItem].expressionProperties) {
        let foundFieldDisabledKey = false;
        for (const subItem in this.fields[item].fieldGroup[fGItem]
          .expressionProperties) {
          if (subItem === 'templateOptions.disabled') {
            // for this field is templateOptions.disabled already set in db at form JSON
            foundFieldDisabledKey = true;
            break;
          }
        }
        if (!foundFieldDisabledKey) {
          // if 'templateOptions.disabled' is not set, don't disable field here
          this.fields[item].fieldGroup[fGItem].expressionProperties = {
            'templateOptions.disabled': 'false',
          };
        }
      }
    }
  }

  /**
   * translate field label
   *
   * @param item
   * @param groupIndex
   * @private
   */
  private translateFieldLabel(item: string, groupIndex: number) {
    // Translate labels
    if (('templateOptions' in this.fields[item].fieldGroup[groupIndex]) &&
      this.fields[item].fieldGroup[groupIndex].templateOptions.label && this.translatePipe) {
      this.fields[item].fieldGroup[groupIndex].templateOptions.label =
        this.translatePipe.transform(this.fields[item].fieldGroup[groupIndex].templateOptions.label);
    }
  }

  /**
   * translate attribute field label
   *
   * @param item
   * @param item2
   * @param groupIndex
   * @private
   */
  private translateAttrFieldLabel(
    item: string,
    item2: string,
    groupIndex: number
  ) {
    // Translate labels
    if (('templateOptions' in this.fields[item].fieldGroup[item2].fieldGroup[groupIndex]) &&
      this.fields[item].fieldGroup[item2].fieldGroup[groupIndex].templateOptions.label && this.translatePipe) {
      this.fields[item].fieldGroup[item2].fieldGroup[groupIndex].templateOptions.label =
        this.translatePipe.transform(this.fields[item].fieldGroup[item2].fieldGroup[groupIndex].templateOptions.label);
    }
  }

  /**
   * set model values
   *
   * @param newItemMode
   * @param refTable
   * @param dbData
   * @param formOptions
   * @param attribOptions
   */
  public setModelValues(newItemMode: boolean, refTable: string, dbData: { row: { data: {} } }, formOptions: {},
                        attribOptions: string[]) {
    this.optionsService.addressesDLV = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
    this.optionsService.addressesINV = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
    // this.optionsService.taxCodes = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
    // this.optionsService.taxRates = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
    // if (!newItemMode) {
      if (dbData && dbData.row && dbData.row.data[1]) {
        if (refTable === this.CONSTANTS.VIRTUAL_REFTABLE_ARTICLES_ATTRIBUTES) {
          if (!newItemMode) {
            this.setModelValuesForAttributes(formOptions, attribOptions, dbData);
          }
        } else {
          if (dbData.row.data[1][0]) {
            for (const pmElm in dbData.row.data[1][0]) {
              if (dbData.row.data[1][0].hasOwnProperty(pmElm)) {
                // set value by db data or if new item mode set to undefined
                this.setModelValuesDefault(pmElm, (!newItemMode) ? dbData.row.data[1][0][pmElm] : undefined);
              }
            }
          }
        }
      }
    // } else {
    //   // New item mode
    //   // model is empty !!! and will be set before setModel() with empty one (to set in component e.g. custbtwoc)
    //   // console.log('NEW ITEM MODE');
    // }
  }

  /**
   * set model values (default)
   *
   * @param key
   * @param value
   * @private
   */
  private setModelValuesDefault(key: string, value: any) {
    // IMPORTANT: CUSTOMER_ADDRESSES and CUSTOMER_TAXATIONS are 'virtual fields' and should be first elements in fields and
    // will be added first to the model.
    // Otherwise addresses select elements will be not set here
    if (this.model?.CUSTOMER_ADDRESSES) {
      this.optionsService.getOrderAddresses(this.model.CUSTOMER_ADDRESSES);
    }
    if (this.model?.CUSTOMER_TAXATIONS) {
      this.optionsService.getOrderTaxation(this.model.CUSTOMER_TAXATIONS);
    }
    if (key === 'CREATE_DATE' || key === 'ORDERS_DATE' || key === 'INVOICES_DATE' ||
      key === 'START_DATE' || key === 'END_DATE' || key === 'SHIPPING_DATE' || key === 'PDF_CREATED_DATE'
    ) {
      this.model[key] = value ? formatDate(value, 'yyyy-MM-dd', 'en_US') : value;
    } else {
      this.model[key] = value;
    }
  }

  /**
   * set model values for attributes
   *
   * @param formOptions
   * @param attribOptions
   * @param dbData
   * @private
   */
  private setModelValuesForAttributes(formOptions: {}, attribOptions: string[], dbData: { row: { data: {} } }) {
    // Get article attribute options
    for (const foItem in formOptions) {
      if (formOptions.hasOwnProperty(foItem)) {
        attribOptions[formOptions[foItem].label] =
          formOptions[foItem].options;
      }
    }
    for (const pmElm in dbData.row.data[1]) {
      if (dbData.row.data[1].hasOwnProperty(pmElm)) {
        if (
          dbData.row.data[1][pmElm].ATTRIBUTE_NAME === 'ATTR_YOUTUBE'
        ) {
          this.model[dbData.row.data[1][pmElm].ATTRIBUTE_NAME] = dbData.row.data[1][pmElm].ATTRIBUTE_DATA;
        } else if (
          dbData.row.data[1][pmElm].ATTRIBUTE_NAME === 'ATTR_SHOP_ACTIVE' ||
          dbData.row.data[1][pmElm].ATTRIBUTE_NAME === 'ATTR_CRAFT'
        ) {
          this.model[dbData.row.data[1][pmElm].ATTRIBUTE_NAME] =
            dbData.row.data[1][pmElm].ATTRIBUTE_ID === // @ts-ignore
            attribOptions[dbData.row.data[1][pmElm].ATTRIBUTE_NAME][0].value ? // @ts-ignore
              attribOptions[dbData.row.data[1][pmElm].ATTRIBUTE_NAME][0].label : // @ts-ignore
              attribOptions[dbData.row.data[1][pmElm].ATTRIBUTE_NAME][1].label;
        } else {
          this.model[dbData.row.data[1][pmElm].ATTRIBUTE_NAME] =
            dbData.row.data[1][pmElm].ATTRIBUTE_ID;
        }
      }
    }
  }

  /**
   * add additional attributes fields, that are not default attributes
   *
   * @param refTable
   * @param attribOptions
   * @param formOptions
   * @private
   */
  private addAdditionalAttributesFields(
    refTable: string,
    attribOptions: string[],
    formOptions: {}
  ) {
    if (refTable === this.CONSTANTS.VIRTUAL_REFTABLE_ARTICLES_ATTRIBUTES) {
      // Add additional attribute fields (not default attributes)
      for (const pmElm in this.model) {
        if (this.model.hasOwnProperty(pmElm)) {
          if (
            attribOptions.indexOf(pmElm) &&
            this.CONSTANTS.ARTICLE_DEFAULT_ATTRIBUTES.indexOf(pmElm) < 0
          ) {
            // Add additional fields here
            const newField: any = {
              key: pmElm,
              type: 'input',
              defaultValue: false,
              templateOptions: {
                label: this.translatePipe.transform(pmElm),
                required: false,
              },
            };
            if (pmElm === 'ATTR_SHOP_ACTIVE' || pmElm === 'ATTR_CRAFT') {
              newField.type = 'checkbox';
            } else if (pmElm === 'ATTR_BASIN_TYPE') {
              newField.type = 'native-select';
              // Get article attribute options
              for (const foItem in formOptions) {
                if (formOptions.hasOwnProperty(foItem)) {
                  if (formOptions[foItem].label === pmElm) {
                    newField.templateOptions.options =
                      formOptions[foItem].options;
                    break;
                  }
                }
              }
            }
            if (this.fields && this.fields[0] && this.fields[0].fieldGroup && this.fields[0].fieldGroup[0] &&
              this.fields[0].fieldGroup[0].fieldGroup) {
              if (this.fields[0].fieldGroup[0].fieldGroup.length < this.CONSTANTS.ARTICLE_ATTRIBUTES_MAX_COLUMN_ROWS) {
                this.fields[0].fieldGroup[0].fieldGroup.push(newField);
              } else if (this.fields[0].fieldGroup[0].fieldGroup.length ===
                this.CONSTANTS.ARTICLE_ATTRIBUTES_MAX_COLUMN_ROWS) {
                const newFieldGroup = {
                  className: 'col-md-6',
                  fieldGroup: []
                };
                newFieldGroup.fieldGroup.push(newField);
                this.fields[0].fieldGroup.push({
                  fieldGroupClassName: 'row',
                  fieldGroup: [newFieldGroup],
                });
              } else {
                this.fields[0].fieldGroup[1].fieldGroup.push(newField);
              }
            }
          }
        }
      }
    }
  }

  /**
   * get table and data set for custom-table-form view types
   *
   * @param refTableTitle
   * @param primaryValue
   * @private
   */
  private getTableAndDataset(refTableTitle: string, primaryValue: string): { refTableTitle: string, primaryValue: string } {
    refTableTitle = this.selItemRefTableTitle;
    primaryValue = localStorage.getItem(this.selItemLocalStorageKey);
    return {refTableTitle, primaryValue};
  }

  /**
   * prepare form values - convert form keys to db keys
   *
   * @private
   * @param saveData
   */
  public prepareFormValues(saveData: { refTable: string, formValues: {}, newItemMode: boolean, primaryKey: string,
    primaryValue: string }): {postFormValues: {}, primaryKey: string, primaryValue: string, release: boolean} {
    let release = false;
    let postFormValues: {} = {};
    for (const property in saveData.formValues) {
      if (saveData.formValues.hasOwnProperty(property)) {
        const upperCaseProperty: string = property.toUpperCase();
        if (upperCaseProperty === saveData.primaryKey) {
          // ignore primary keys (ID) for saving and set primary value
          saveData.primaryValue = saveData.formValues[property];
          if (saveData.newItemMode) { // for new item, add primary key to values
            postFormValues[upperCaseProperty] = saveData.formValues[property];
          }
        } else if (this.fieldNamesToIgnore.indexOf(upperCaseProperty) !== -1) {
          // } else if (this.CONSTANTS.PRIMARY_COLUMN_TYPES.indexOf(upperCaseProperty) != -1) {
        } else if (upperCaseProperty === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_ADDRESS_COMMENT_COLUMN &&
          (saveData.formValues[property] === 'null' || saveData.formValues[property] === null)) {
          postFormValues[upperCaseProperty] = '';
        } else if (upperCaseProperty === this.CONSTANTS.REFTABLE_ORDERS_CUSTOMER_ORDERREF_COLUMN) {
          // extract customer number from form field 'CUSTOMER_ORDERREF' (in: 50020CUS00012345 => out: 00012345)
          const pFValCustomerOrder: string = postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN];
          if (pFValCustomerOrder && pFValCustomerOrder.toUpperCase().includes(this.CONSTANTS.CUSTOMER_TYPE_ID)) {
            postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CUSTOMER_ORDERREF_COLUMN] =
              pFValCustomerOrder.substring(this.CONSTANTS.CUSTOMER_PREFIX_EXAMPLE.length, pFValCustomerOrder.length);
          } else {
            postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CUSTOMER_ORDERREF_COLUMN] = pFValCustomerOrder;
          }
        } else {
          // store release flag, used for orders, delivery notes and invoices
          if (upperCaseProperty === this.CONSTANTS.REFTABLE_ORDERS_RELEASE_COLUMN) {
            release = saveData.formValues[property];
          }
          postFormValues[upperCaseProperty] = saveData.formValues[property];
        }
      }
    }
    return {postFormValues, primaryKey: saveData.primaryKey, primaryValue: saveData.primaryValue, release};
  }

  /**
   * save data to db table
   *
   * @private
   * @param saveData
   */
  private async saveDataToTable(saveData: {
    refTable: string, tableName: string, newItemMode: boolean, postFormValues: {},
    primaryKey: string, primaryValue: string, isIdentity: boolean, secondaryKey: string, secondaryValue: string|{},
    tertiaryKey: string, tertiaryValue: string
  }): Promise<{ result: boolean, message: string }> {
    let result = false;
    let message: string;
    const dbData: { result: { success: boolean, message: string, data: [] } } =
      await this.tableDataService.setTableData({
        refTable: saveData.refTable,
        tableName: saveData.tableName, dataArray: saveData.postFormValues, primaryKey: saveData.primaryKey,
        primaryValue: saveData.primaryValue, isIdentity: saveData.isIdentity, newItemMode: saveData.newItemMode,
        secondaryKey: saveData.secondaryKey, secondaryValue: saveData.secondaryValue, thirdKey: saveData.tertiaryKey,
        thirdValue: saveData.tertiaryValue
      });
    // @ts-ignore
    if (dbData && dbData.result && !dbData.result.success) { // @ts-ignore
      message = dbData.result.message;
    } else {
      // if new mode, query the last added item and store it to the local storage
      // (last added item will be selected and loaded at view refresh)
      if (saveData.newItemMode) {
        let storeLSTableName: string = (saveData.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) ?
          this.CONSTANTS.REFTABLE_CUSTOMER_TITLE :
          (saveData.refTable === this.CONSTANTS.REFTABLE_ORDERS) ? this.CONSTANTS.REFTABLE_ORDERS_TITLE :
            this.CONSTANTS.REFTABLE_INVOICES_TITLE;

        let storeLSColumnName: string = (saveData.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) ?
          this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN :
          (saveData.refTable === this.CONSTANTS.REFTABLE_ORDERS) ? this.CONSTANTS.REFTABLE_ORDERS_COLUMN :
            this.CONSTANTS.REFTABLE_INVOICE_COLUMN;

        let salesLocation: string = (((saveData.refTable === this.CONSTANTS.REFTABLE_ORDERS) ||
          (saveData.refTable === this.CONSTANTS.REFTABLE_INVOICE)) &&
          saveData.postFormValues['SALES_LOCATION']) ? saveData.postFormValues['SALES_LOCATION'] : '';
        await this.storeLastAddedItemToLS(storeLSTableName, storeLSColumnName, salesLocation);
      }
      message = this.translatePipe.transform('SAVEDSUCCESS');
      result = true;
    }
    return {result, message};
  }

  /**
   * store last added item to localStorage
   *
   * @param tableName
   * @param columnName
   * @param salesLocation optional
   * @private
   */
  private async storeLastAddedItemToLS(tableName: string, columnName: string, salesLocation: string = '') {
    const idDbData: {} = await this.tableDataService.getLastIdOfTable(tableName, columnName,
      undefined, salesLocation);
    // @ts-ignore
    if (idDbData && idDbData.id) {
      switch (tableName) {
        case(this.CONSTANTS.REFTABLE_CUSTOMER_TITLE): // @ts-ignore
          localStorage.setItem(this.CONSTANTS.LS_SEL_CUSTOMERS_NUMBER, idDbData.id);
          break;
        case(this.CONSTANTS.REFTABLE_ORDERS_TITLE): // @ts-ignore
          localStorage.setItem(this.CONSTANTS.LS_SEL_ORDERS_NUMBER, idDbData.id);
          break;
        case(this.CONSTANTS.REFTABLE_DELIVERY_NOTES_TITLE): // @ts-ignore 'DELIVERY_NOTES'
          localStorage.setItem(this.CONSTANTS.LS_SEL_DLV_NOTES_NUMBER, idDbData.id);
          break;
        case(this.CONSTANTS.REFTABLE_INVOICES_TITLE): // @ts-ignore 'REFTABLE_INVOICES_TITLE'
          localStorage.setItem(this.CONSTANTS.LS_SEL_INVOICE_NUMBER, idDbData.id);
          break;
        default:
          console.log('ERROR: storeLastAddedItemToLS - tableName is not supported...');
          break;
      }
    }
  }

  /**
   * save form values to db
   *
   * see documentation, specially topic 1.3 about formly form: \docs\create-new-component\extend-database-one-table.md
   *
   * 1. Extract field properties (newItemMode, tableName, primaryKey, primaryValue) from form values
   * 2. Get table locks table name and local storage primary value (for update mode)
   * 3. Check for table locks
   * 4. Prepare form values. Convert form keys to db keys.
   * 5. Check for duplicates
   * 6. Save to table
   *
   * @param formData
   */
  public async saveForm(
    formData: {
      formValues: SoasModel,
      fields: FormlyFieldConfig[]
    }
  ): Promise<{ result: boolean, message: string, refTable: string }> {
    // 'templateOptions.disabled': 'true' => Field should be readonly by default: boolean

    /*  TODO: If validator for fields max number of chars for example PAYMENT_THERMS ADDED (see FormService ToDo),
        show error message for user here, if max number is reached ...
    */
    const retForm = this.getFieldsProperties(formData);

    // 'refTable': 'countries' => REF_TABLE from TABLE_TEMPLATES: string
    const refTable: string = retForm[FormlyTemplateOptions.REF_TABLE];

    // 'tableName': 'COUNTRIES' => (PRIMARY)TABLE_NAME from TABLE_TEMPLATES: string
    const tableName: string = retForm[FormlyTemplateOptions.TABLE_NAME];

    // 'newItemMode': 'false' => New item mode: boolean
    const newItemMode: boolean = retForm[FormlyTemplateOptions.NEW_ITEM_MODE];

    // 'needsValidation': 'false' => Field value need to be validated: boolean
    const needsValidation: boolean = retForm[FormlyTemplateOptions.NEEDS_VALIDATION];

    // 'isPrimary': 'true' => Is primary field flag: boolean
    let primaryKey: string = retForm.primaryKey;
    let primaryValue: string = retForm.primaryValue;

    // 'isSecondary': 'true' => Is secondary field flag: boolean
    const secondaryKey: string = retForm.secondaryKey;
    const secondaryValue: string = retForm.secondaryValue;

    // 'isTertiary': 'true' => Is tertiary field flag: boolean
    const tertiaryKey: string = retForm.tertiaryKey;
    const tertiaryValue: string = retForm.tertiaryValue;

    // 'isIdentity': 'true' => Field to determine, if primary key is an IDENTITY type: boolean
    const isIdentity: boolean = retForm[FormlyTemplateOptions.IS_IDENTITY];
    let tableLocksTableName: undefined | string = tableName;
    const ret = this.getTableAndDataset(tableLocksTableName, primaryValue);
    tableLocksTableName = ret.refTableTitle;
    // primaryValue = ret.primaryValue; // get primary value from local storage (for table lock check?)

    console.log('formData.formValues: ', formData.formValues);

    if (refTable && tableLocksTableName && primaryKey && formData.formValues &&
      Object.keys(formData.formValues).length) {
      const lockedMessage: string = this.translatePipe.transform('TABLE_LOCK_MESSAGE_LOCKED');
      const isLockedResult = await this.tableDataService.isTableLocked(tableLocksTableName, primaryValue, lockedMessage);
      if (isLockedResult) {
        return {result: false, message: 'LOCKED', refTable};
      } else {
        const retFV = this.prepareFormValues({ refTable: tableName, formValues: formData.formValues,
          newItemMode, primaryKey, primaryValue });
        const postFormValues: {} = retFV.postFormValues;
        primaryKey = retFV.primaryKey;
        primaryValue = retFV.primaryValue;
        if (!newItemMode && !primaryValue) {
          console.log('ERROR: Primary value is not set.');
          return {result: false, message: 'ERROR_DURING_CHECKING', refTable};
        }
        if (newItemMode) {
          // console.log('primaryKey: ', primaryKey);
          // console.log('primaryValue: ', primaryValue);
          // console.log('secondaryKey: ', secondaryKey);
          // console.log('secondaryValue: ', secondaryValue);
          // insert - check for duplicates, before insert into table
          if (!(refTable === 'customersAddrDlv' || refTable === 'customersAddrInv')) {
            let checkPrimaryKey: string = (primaryKey && primaryValue) ? primaryKey : secondaryKey;
            let checkPrimaryValue: string = (primaryKey && primaryValue) ? primaryValue : secondaryValue;
            let checkSecondaryKey: string = (primaryKey && primaryValue) ? secondaryKey : tertiaryKey;
            let checkSecondaryValue: string = (primaryKey && primaryValue) ? secondaryValue : tertiaryValue;
            const cDbData: { table: [any[string], any[]], maxRows: number, page: number } =
              await this.tableDataService.getTableDataById(refTable, ViewQueryTypes.NEW_ITEM,
                checkPrimaryKey, checkPrimaryValue, checkSecondaryKey, checkSecondaryValue);
            if (!cDbData) {
              return {result: false, message: 'DB ERROR', refTable};
            }
            if (cDbData.table[1] && cDbData.table[1].length > 0) {
              let errMessage = this.translatePipe.transform('ITEM_ALREADY_EXISTS');
              errMessage = errMessage.replace('%s', this.translatePipe.transform(primaryKey));
              return {result: false, message: errMessage, refTable};
            }
          }
        }
        // if no errors found - save data to db
        const saveResult: { result: boolean, message: string } = await this.saveDataToTable({
          refTable, tableName, postFormValues, newItemMode,
          primaryKey, primaryValue, isIdentity, secondaryKey,
          secondaryValue, tertiaryKey, tertiaryValue
        });
        return {result: saveResult.result, message: saveResult.message, refTable};
      }
    } else {
      console.log('ERROR: Check if refTable, customer number, primary key/value and formValues are set.');
      console.log(refTable);
      return {result: false, message: 'ERROR_DURING_CHECKING', refTable};
    }
  }

  /**
   * save form query
   *
   * @param postFormValues
   * @param primaryKey
   * @param primaryValue
   * @param isIdentity
   * @param secondaryKey
   * @param secondaryValue
   * @param refTable
   * @param newItemMode
   */
  public async saveFormQuery(postFormValues: {}, primaryKey: string, primaryValue: string, isIdentity: boolean,
                             secondaryKey: string, secondaryValue: string | {}, refTable: string, newItemMode: boolean):
    Promise<{}> {
    return await this.tableDataService.setTableData({
      refTable, tableName: refTable, dataArray: postFormValues, primaryKey,
      primaryValue, isIdentity, newItemMode,
      secondaryKey, secondaryValue
    });
  }

  /**
   * get address iso code by country. if item not found, returns 'DE'.
   *
   * @param country
   * @param countriesWithIso
   */
  public getAddressIsoCodeByCountry(country: string, countriesWithIso: FormOptionsINV[]): string {
    let addressIsoCode: string = this.CONSTANTS.DEFAULT_CUSTOMER_ADDRESS_ISO_CODE;
    for (let i = 0;i<countriesWithIso.length;i++) {
      if (countriesWithIso[i].name === country) {
        addressIsoCode = countriesWithIso[i].value;
        i = countriesWithIso.length;
      }
    }
    return addressIsoCode;
  }

  /**
   * check at new order mode, if entered customer number has same type like submitted client
   *
   * @param customerNumber
   * @param client
   */
  async checkCustomerNumber(customerNumber: string, client: string): Promise<{ exists: boolean, type: boolean }> {
    const tableDbData: { table: [any[string], any[]], maxRows: number, page: number } =
      await this.tableDataService.getTableDataByCustomersNumber(this.CONSTANTS.REFTABLE_CUSTOMER,
        ViewQueryTypes.PURE_SELECT, this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN, customerNumber);
    if (tableDbData && tableDbData.table && tableDbData.table[1] && tableDbData.table[1][0] &&
      tableDbData.table[1][0].CUSTOMERS_TYPE) {
      if (tableDbData.table[1][0].CUSTOMERS_TYPE === client) {
        return {exists: true, type: true};
      } else {
        return {exists: true, type: false};
      }
    }
    return {exists: false, type: false};
  }

  /**
   * get form disabled flag. returns false, if current model is empty.
   *
   * @private
   */
  private getFormDisabled(): boolean {
    let formDisabled = false;
    if (this.model?.ORDERS_STATE) {
      // possible flags to use: model.RELEASE - model.PAYED
      formDisabled =
        this.model.ORDERS_STATE === this.CONSTANTS.ORDER_STATES_COMPLETED ||
        this.model.ORDERS_STATE === this.CONSTANTS.DLV_STATES_DELIVERED ||
        this.model.ORDERS_STATE === this.CONSTANTS.INV_STATES_COMPLETED;
    } else if (!this.model) {
      console.log('result.model is empty!');
    }
    return formDisabled;
  }

  /**
   * get formly form fields properties: primary-, secondary-, tertiary-key/value, new item mode, referral table name,
   * table name to store data in, etc.
   *
   * see documentation, specially topic 1.3 about formly form: \docs\create-new-component\extend-database-one-table.md
   *
   * @param formData
   * @private
   */
  public getFieldsProperties(formData: { formValues: {}, fields: FormlyFieldConfig[] }):
    {
      refTable: string, tableName: string, newItemMode: boolean, needsValidation: boolean,
      primaryKey: string, primaryValue: string, secondaryKey: string, secondaryValue: string, tertiaryKey: string,
      tertiaryValue: string, isIdentity: boolean
    } {
    let refTable: string; // 'customersAddrDlv'
    let tableName: string;
    let newItemMode: boolean;
    let needsValidation: boolean;
    // Used for Article > Crossselling id, to be able to update CROSSSELLING table it at server
    let parentId: number;

    // this attribute should be only once in form, at field that is primary key field. all other fields doesn't have it.
    // this attribute is set to false by default
    let primaryKey: string;
    let primaryValue: string;

    // Field to determine, if primary key is an IDENTITY type ([ID] [int] IDENTITY(1,1) NOT NULL).
    // If not, the primary value should be stored to db table: ORDERS_NUMBER or PAYMENT_TERM_ID
    let isIdentity: boolean;
    let secondaryKey: string;
    let secondaryValue: string;
    let tertiaryKey: string;
    let tertiaryValue: string;
    for (const item in formData.fields) {
      if (formData.fields.hasOwnProperty(item)) {
        for (const groupItem in formData.fields[item].fieldGroup) {
          if (formData.fields[item].fieldGroup.hasOwnProperty(groupItem)) {
            const fieldGroupItem: FormlyFieldConfig = formData.fields[item].fieldGroup[groupItem];
            if (fieldGroupItem.templateOptions[FormlyTemplateOptions.REF_TABLE]) {
              // normal form
              refTable = (!refTable) ? fieldGroupItem.templateOptions[FormlyTemplateOptions.REF_TABLE] : refTable;
              tableName = (!tableName) ? fieldGroupItem.templateOptions[FormlyTemplateOptions.TABLE_NAME] : tableName;
              newItemMode = fieldGroupItem.templateOptions[FormlyTemplateOptions.NEW_ITEM_MODE];
              needsValidation = fieldGroupItem.templateOptions[FormlyTemplateOptions.NEEDS_VALIDATION];
              // Article > Crossselling form field. Extract crossselling id from 'templateOptions.parentId'.
              if (fieldGroupItem.templateOptions.hasOwnProperty(FormlyTemplateOptions.PARENT_ID)) {
                parentId = fieldGroupItem.templateOptions[FormlyTemplateOptions.PARENT_ID];
              }
              if (fieldGroupItem.templateOptions.hasOwnProperty(FormlyTemplateOptions.IS_PRIMARY)) {
                if (fieldGroupItem.templateOptions[FormlyTemplateOptions.IS_PRIMARY] === 'true') {
                  primaryKey = fieldGroupItem.key.toString();
                }
              }
              if (fieldGroupItem.templateOptions.hasOwnProperty(FormlyTemplateOptions.IS_IDENTITY)) {
                isIdentity = fieldGroupItem.templateOptions[FormlyTemplateOptions.IS_IDENTITY] === 'true';
              }
              if (fieldGroupItem.templateOptions.hasOwnProperty(FormlyTemplateOptions.IS_SECONDARY)) {
                if (fieldGroupItem.templateOptions[FormlyTemplateOptions.IS_SECONDARY] === 'true') {
                  secondaryKey = fieldGroupItem.key.toString();
                }
              }
              if (fieldGroupItem.templateOptions.hasOwnProperty(FormlyTemplateOptions.IS_TERTIARY)) {
                if (fieldGroupItem.templateOptions[FormlyTemplateOptions.IS_TERTIARY] === 'true') {
                  tertiaryKey = fieldGroupItem.key.toString();
                }
              }
            } else if (fieldGroupItem.fieldGroup) {
              // Article Attributes form
              for (const attrItem in fieldGroupItem.fieldGroup) {
                refTable = (!refTable) ?
                  fieldGroupItem.fieldGroup[attrItem].templateOptions[FormlyTemplateOptions.REF_TABLE] : refTable;
                tableName = (!tableName) ?
                  fieldGroupItem.fieldGroup[attrItem].templateOptions[FormlyTemplateOptions.TABLE_NAME] : tableName;

                // if article attributes, set primary key and value, based on parent id
                // instead of primaryKey set secondaryKey
                primaryKey = (!primaryKey) ? ((refTable === 'articlesAttributes') ?
                    (fieldGroupItem.fieldGroup[attrItem].templateOptions[FormlyTemplateOptions.PARENT_ID] ?
                      'ITEM_BASIS_ID' : primaryKey)
                    : primaryKey)
                  : primaryKey;
                primaryValue = (!primaryValue) ? ((refTable === 'articlesAttributes') ?
                    fieldGroupItem.fieldGroup[attrItem].templateOptions[FormlyTemplateOptions.PARENT_ID] : primaryValue)
                  : primaryValue;
              }
            }
          }
        }
      }
    }
    // get primary value
    if (formData.formValues) {
      //console.log(formData.formValues);
      if (newItemMode && isIdentity) {
        // remove primary key item from form values, because it will be created automatically at db insert
        // console.log('usao u brisanje')
        delete formData.formValues[primaryKey];
      } else {
        // console.log('nije usao u brisanje')
        // articlesAttributes - params: primary - ITEM_BASIS_ID, secondary - ATTRIBUTE_ID
        primaryValue = formData.formValues[primaryKey] ? formData.formValues[primaryKey] : primaryValue;
      }
      if ((refTable === 'articles') && (!parentId || (parentId && (parentId !== 0)))) {
        // Article > Crossselling form field parent id value: if id is not set = 0, set to undefined,
        // to be able to create crosselling item
        secondaryValue = (parentId && (parentId !== 0)) ? parentId.toString() : undefined;
      } else {
        secondaryValue = formData.formValues[secondaryKey] ? formData.formValues[secondaryKey] : secondaryValue;
      }
      tertiaryValue = formData.formValues[tertiaryKey] ? formData.formValues[tertiaryKey] : tertiaryValue;
    }
    return {
      refTable, tableName, newItemMode, needsValidation, primaryKey, primaryValue,
      secondaryKey, secondaryValue, tertiaryKey, tertiaryValue, isIdentity
    };
  }

  /**
   * set selected item local storage key for main table view
   *
   * @param key
   */
  setSelItemLocalStorageKey(key :string) {
    this.selItemLocalStorageKey = key;
  }

  /**
   * set selected item local storage key for details table view
   *
   * @param key
   */
  setSelDetailsItemLocalStorageKey(key :string) {
    this.selDetailsItemLocalStorageKey = key;
  }

  /**
   * set selected item referral table title name
   *
   * @param table
   */
  setSeItemRefTableTitle(table: string) {
    this.selItemRefTableTitle = table;
  }

  /**
   * set primary referral table column name to query by (e.g. 'ORDERS_NUMBER')
   *
   * @param column
   */
  setPrimaryTableColumnName(column: string) {
    this.primaryTableColumnName = column;
  }

  /**
   * return true if positions are vailable for given item number (invoice nubmer)
   *
   * @param itemNumber
   */
  async isPositionAvailable(itemNumber: string): Promise<boolean> {
    const tableDbData: { table: [any[string], any[]], maxRows: number, page: number } =
      await this.tableDataService.getTableDataByCustomersNumber(this.CONSTANTS.REFTABLE_INVOICE_POSITIONS,
        ViewQueryTypes.PURE_SELECT, this.CONSTANTS.REFTABLE_INVOICE_COLUMN, itemNumber);
    return (tableDbData && tableDbData.table && tableDbData.table[1] && tableDbData.table[1][0] &&
      tableDbData.table[1][0].ITMNUM) ? true : false;
  }

  /**
   * get formly form field
   *
   * @link https://github.com/ngx-formly/ngx-formly/issues/1783#issuecomment-533058837
   *
   * @param key
   * @param fields
   */
  getField(key: string, fields: FormlyFieldConfig[]): FormlyFieldConfig {
    for (let i = 0, len = fields.length; i < len; i++) {
      const f = fields[i];
      if (f.key === key) {
        return f;
      }
      if (f.fieldGroup && !f.key) {
        const cf = this.getField(key, f.fieldGroup);
        if (cf) {
          return cf;
        }
      }
    }
  }

}
