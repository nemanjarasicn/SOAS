import {FormOptionsINV} from "../../app/interfaces/form-options";
import {Countries} from "../../app/models/countries";
import {FormlyFieldConfig} from "@ngx-formly/core";

/**
 * countries constants for unit tests
 */
export class CountriesTestConstants {

  public static COUNTRIES = [
    {COUNTRY_ID: '1', COUNTRY_NAME: "Australien", COUNTRY_ISO_CODE: "AU"},
    {COUNTRY_ID: '2', COUNTRY_NAME: "Belgien", COUNTRY_ISO_CODE: "BE"},
    {COUNTRY_ID: '3', COUNTRY_NAME: "Deutschland", COUNTRY_ISO_CODE: "DE"},
    {COUNTRY_ID: '4', COUNTRY_NAME: "Dänemark", COUNTRY_ISO_CODE: "DK"},
    {COUNTRY_ID: '5', COUNTRY_NAME: "Finnland", COUNTRY_ISO_CODE: "FI"},
  ];

  public static COUNTRIES_WITH_ID: FormOptionsINV[] =
    [
      {id: '1', name: 'Australien', value: 'AU'},
      {id: '2', name: 'Belgien', value: 'BE'},
      {id: '3', name: 'Deutschland', value: 'DE'},
      {id: '4', name: 'Dänemark', value: 'DK'},
      {id: '5', name: 'Finnland', value: 'FI'}
    ];

  public static COUNTRIES_SELECT = {
    countries: [{name: 'PLEASE_SELECT', value: undefined},
      {name: 'Australien (AU)', value: 'AU'},
      {name: 'Belgien (BE)', value: 'BE'},
      {name: 'Deutschland (DE)', value: 'DE'},
      {name: 'Dänemark (DK)', value: 'DK'},
      {name: 'Finnland (FI)', value: 'FI'},],
    pcountries: [{label: 'PLEASE_SELECT', value: undefined},
      {label: 'Australien (AU)', value: 'AU'},
      {label: 'Belgien (BE)', value: 'BE'},
      {label: 'Deutschland (DE)', value: 'DE'},
      {label: 'Dänemark (DK)', value: 'DK'},
      {label: 'Finnland (FI)', value: 'FI'},],
    countriesWithId: CountriesTestConstants.COUNTRIES_WITH_ID,
    countriesOnlyName: [{name: 'Australien', value: 'Australien'},
      {name: 'Belgien', value: 'Belgien'},
      {name: 'Deutschland', value: 'Deutschland'},
      {name: 'Dänemark', value: 'Dänemark'},
      {name: 'Finnland', value: 'Finnland'},],
    pcountriesOnlyName: [{label: 'PLEASE_SELECT', value: undefined},
      {label: 'Australien (AU)', value: 'Australien'},
      {label: 'Belgien (BE)', value: 'Belgien'},
      {label: 'Deutschland (DE)', value: 'Deutschland'},
      {label: 'Dänemark (DK)', value: 'Dänemark'},
      {label: 'Finnland (FI)', value: 'Finnland'},]
  };

  public static COUNTRIES_FORM_FIELDS: string = JSON.stringify([{
    "fieldGroupClassName": "row",
    fieldGroup: [{
      className: "col-md-3",
      type: "input",
      key: "COUNTRY_ID",
      templateOptions: {
        label: "COUNTRY_ID",
        required: true,
        refTable: "countries",
        tableName: "COUNTRIES",
        newItemMode: "false",
        isPrimary: "true",
        isIdentity: "true",
        needsValidation: "false"
      },
      expressionProperties: {"templateOptions.disabled": "true"}
    }]
  }, {
    "fieldGroupClassName": "row",
    fieldGroup: [{
      className: "col-md-12",
      type: "input",
      key: "COUNTRY_NAME",
      templateOptions: {
        label: "COUNTRY_NAME",
        required: true,
        refTable: "countries",
        tableName: "COUNTRIES",
        newItemMode: "false",
        needsValidation: "true"
      },
      expressionProperties: {"templateOptions.disabled": "false"}
    }]
  }, {
    "fieldGroupClassName": "row",
    fieldGroup: [{
      className: "col-md-12",
      type: "input",
      key: "COUNTRY_ISO_CODE",
      templateOptions: {
        label: "COUNTRY_ISO_CODE",
        required: true,
        refTable: "countries",
        minLength: 2,
        maxLength: 2,
        attributes: {"style": "text-transform: uppercase"},
        tableName: "COUNTRIES",
        newItemMode: "false",
        needsValidation: "true"
      },
      expressionProperties: {"templateOptions.disabled": "false"}
    }]
  }]);

  public static COUNTRIES_FORM_FIELDS_AS_FORMLY_CONFIG: FormlyFieldConfig[] = [{
    "fieldGroupClassName": "row",
    fieldGroup: [{
      className: "col-md-3",
      type: "input",
      key: "COUNTRY_ID",
      templateOptions: {
        label: "COUNTRY_ID",
        required: true,
        refTable: "countries",
        tableName: "COUNTRIES",
        newItemMode: "false",
        isPrimary: "true",
        isIdentity: "true",
        needsValidation: "false"
      },
      expressionProperties: {"templateOptions.disabled": "true"}
    }]
  }, {
    "fieldGroupClassName": "row",
    fieldGroup: [{
      className: "col-md-12",
      type: "input",
      key: "COUNTRY_NAME",
      templateOptions: {
        label: "COUNTRY_NAME",
        required: true,
        refTable: "countries",
        tableName: "COUNTRIES",
        newItemMode: "false",
        needsValidation: "true"
      },
      expressionProperties: {"templateOptions.disabled": "false"}
    }]
  }, {
    "fieldGroupClassName": "row",
    fieldGroup: [{
      className: "col-md-12",
      type: "input",
      key: "COUNTRY_ISO_CODE",
      templateOptions: {
        label: "COUNTRY_ISO_CODE",
        required: true,
        refTable: "countries",
        minLength: 2,
        maxLength: 2,
        attributes: {"style": "text-transform: uppercase"},
        tableName: "COUNTRIES",
        newItemMode: "false",
        needsValidation: "true"
      },
      expressionProperties: {"templateOptions.disabled": "false"}
    }]
  }];

  public static COUNTRIES_ITEM: Countries = {
    COUNTRY_ID: 4,
    COUNTRY_NAME: 'Dänemark',
    COUNTRY_ISO_CODE: 'DK'
  };
}
