/**
 * currencies constants for unit tests
 */
import {CustbtwocDataInterface} from "../../app/interfaces/custbtwoc-item";
import {CustomersTypes} from "../../app/_services/constants.service";
import {Customer} from "../../app/models/customer";
import {CustomersAddr} from "../../app/interfaces/customers-addr-item";
import {CustomerAdrr} from "../../app/models/customer-addr";

export class CustomersTestConstants {

  public static readonly CUSTOMER_B2C_ITEM: Customer =
    {
      CUSTOMERS_NUMBER: '123456789',
      CUSTOMERS_PRENAME: 'Max',
      CUSTOMERS_NAME: 'Mustermann',
      CUSTOMERS_COMPANY: '',
      CUSTOMERS_TYPE: CustomersTypes.B2C,
      LANGUAGE: 'ENG',
      CREATE_DATE: '2014-01-02',
      CUSTOMERS_EMAIL: 'max@mustermann.de',
      CUSTOMERS_PHONE: 'max@mustermann.de',
      EEC_NUM: '',
      EDI_INVOIC: false,
      EDI_ORDERSP: false,
      EDI_DESADV: false,
      EMAIL_RG: 'max@mustermann.de',
      EMAIL_LI: 'max@mustermann.de',
      EMAIL_AU: 'max@mustermann.de',
      PHONE_0: '0421 12 34 56',
      PHONE_1: '0421 12 34 57',
      FAX_0: '0421 12 34 58',
      MOB_0: '0171 12 34 56',
      MOB_1: '',
      CRNNUM: '',
      PAYMENT_TERM_ID: 'DEVORAUS'
    };

  public static readonly CUSTOMERS_ADDRESSES_DLV: CustomerAdrr[] = [
    {
      ID: 1,
      ADDRESS_TYPE: 'DLV',
      CUSTOMERS_NUMBER: '123456789',
      ADDRESS_ISO_CODE: 'DE',
      ADDRESS_CRYNAME: 'Deutschland',
      ADDRESS_STREET: 'Musterstr. 1',
      ADDRESS_CITY: 'Musterstadt',
      ADDRESS_POSTCODE: '11111',
      ADDRESS_COMMENT: 'test comment',
      TAXCODE: 'DEK',
      NAME_ADDR: 'Mustermann, Max',
      EMAIL: 'max@mustermann.de',
      PHONE: '0421 12 34 56',
      ADDRESS_ID: '1'
    }
  ];

  public static readonly CUSTOMERS_ADDRESSES_INV: CustomerAdrr[] = [
    {
      ID: 1,
      ADDRESS_TYPE: 'INV',
      CUSTOMERS_NUMBER: '123456789',
      ADDRESS_ISO_CODE: 'DE',
      ADDRESS_CRYNAME: 'Deutschland',
      ADDRESS_STREET: 'Musterstr. 1',
      ADDRESS_CITY: 'Musterstadt',
      ADDRESS_POSTCODE: '11111',
      ADDRESS_COMMENT: 'test comment',
      TAXCODE: 'DEK',
      NAME_ADDR: 'Mustermann, Max',
      EMAIL: 'max@mustermann.de',
      PHONE: '0421 12 34 56',
      ADDRESS_ID: '1'
    }
  ];

  /**
   * Customers B2C table data returned by:
   * let tableDbData = await this.tableDataService.getTableDataByCustomersNumber(primaryRefTable,
     ViewQueryTypes.DETAIL_TABLE, tablePrimaryColumn, tablePrimaryValue, tableSecondColumn, tableSecondValue);
   */
  public static CUSTOMERS_B2C_TABLE_DB_DATA: { table: [any[string], any[]], maxRows: number, page: number } = {
    "table": [
      "CUSTOMERS_NUMBER,CUSTOMERS_PRENAME,CUSTOMERS_NAME,CUSTOMERS_COMPANY,CUSTOMERS_TYPE,EEC_NUM,LANGUAGE," +
      "EDI_INVOIC,EDI_ORDERSP,EDI_DESADV,CREATE_DATE,CUSTOMERS_EMAIL,CUSTOMERS_PHONE,EMAIL_AU," +
      "EMAIL_LI,EMAIL_RG,PHONE_0,PHONE_1,MOB_0,MOB_1,FAX_0,CRNNUM,PAYMENT_TERM_ID",
      [
        {
          "CUSTOMERS_NUMBER": "4500000299",
          "CUSTOMERS_PRENAME": "TEST-20210715 Vorname",
          "CUSTOMERS_NAME": "TEST-20210715 Nachname",
          "CUSTOMERS_COMPANY": "TEST-20210715 Firma 222",
          "LANGUAGE": "DEU",
          "CREATE_DATE": "2021-07-15 00:00:00",
          "CUSTOMERS_EMAIL": "test@test.com",
          "CUSTOMERS_PHONE": "0234234234",
          "CUSTOMERS_TYPE": "B2C",
          "EEC_NUM": "12345",
          "EDI_INVOIC": true,
          "EDI_ORDERSP": false,
          "EDI_DESADV": false,
          "EMAIL_RG": "test@test.com",
          "EMAIL_LI": "test@test.com",
          "EMAIL_AU": "test@test.com",
          "PHONE_0": "0234234234",
          "PHONE_1": "",
          "FAX_0": "",
          "MOB_0": "0234234234",
          "MOB_1": "",
          "CRNNUM": "12345",
          "PAYMENT_TERM_ID": "DEVORAUS"
        }
      ]
    ],
    "maxRows": 254810,
    "page": 0
  };

  public static CUSTOMERS_ADDRESSES_DLV_TABLE_DB_DATA: { table: [any[string], any[]], maxRows: number, page: number } = {
    "table": [
      "ID, ADDRESS_TYPE, CUSTOMERS_NUMBER, ADDRESS_CRYNAME, ADDRESS_STREET, ADDRESS_CITY, ADDRESS_POSTCODE, " +
      "ADDRESS_ISO_CODE, ADDRESS_COMMENT, TAXCODE, NAME_ADDR, EMAIL, PHONE, ADDRESS_ID",
        CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV
    ],
    "maxRows": 254810,
    "page": 0
  };

  public static CUSTOMERS_ADDRESSES_DLV_EMPTY_TABLE_DB_DATA: { table: [any[string], any[]], maxRows: number, page: number } = {
    "table": [
      "ID, ADDRESS_TYPE, CUSTOMERS_NUMBER, ADDRESS_CRYNAME, ADDRESS_STREET, ADDRESS_CITY, ADDRESS_POSTCODE, " +
      "ADDRESS_ISO_CODE, ADDRESS_COMMENT, TAXCODE, NAME_ADDR, EMAIL, PHONE, ADDRESS_ID",
      []
    ],
    "maxRows": 254810,
    "page": 0
  };

  /**
   * For testing new item mode:
   *  form data:
   *  {
   *    formValues: {…},  => CUSTOMER_B2C_NEW_ITEM
   *    fields: Array(24) => CUSTOMER_B2C_NEW_ITEM_FORM_FIELDS
   *  }
   */
  public static readonly CUSTOMER_B2C_NEW_ITEM: Customer =
    {
      LANGUAGE: "DEU",
      // ADDRESS_ISO_CODE: "DE", ??? why this field is in form values
      // ADDRESS_CRYNAME: null, ??? why this field is in form values
      CUSTOMERS_NUMBER: "will be automatically generated",
      CUSTOMERS_PRENAME: "Muster",
      CUSTOMERS_NAME: "Mustermann",
      CUSTOMERS_COMPANY: "Musterfirma",
      CUSTOMERS_TYPE: "B2C",
      EEC_NUM: "1234567",
      EDI_INVOIC: false,
      EDI_ORDERSP: false,
      EDI_DESADV: false,
      CREATE_DATE: "2021-12-22",
      CUSTOMERS_EMAIL: "test@test.com",
      CUSTOMERS_PHONE: "0234234234",
      EMAIL_AU: "test@test.com",
      EMAIL_LI: "test@test.com",
      EMAIL_RG: "test@test.com",
      PHONE_0: "0234234234",
      PHONE_1: "",
      MOB_0: "0234234234",
      MOB_1: "",
      FAX_0: "",
      CRNNUM: "12345",
      PAYMENT_TERM_ID: "DEVORAUS"
    };

  /**
   * For testing new item mode:
   *  form data:
   *  {
   *    formValues: {…},  => CUSTOMER_B2C_NEW_ITEM
   *    fields: Array(24) => CUSTOMER_B2C_NEW_ITEM_FORM_FIELDS
   *  }
   */
  public static CUSTOMER_B2C_NEW_ITEM_FORM_FIELDS: string = JSON.stringify([{
    "fieldGroupClassName": "row",
    "fieldGroup": [
      {
        "className": "col-md-12",
        "type": "input",
        "key": "CUSTOMERS_NUMBER",
        "templateOptions": {
          "label": "customer number",
          "refTable": "custbtwoc",
          "tableName": "CUSTOMERS",
          "newItemMode": true,
          "isPrimary": "true",
          "needsValidation": "false",
          "placeholder": "",
          "focus": false,
          "disabled": true,
          "hidden": false
        },
        "expressionProperties": {
          "templateOptions.disabled": "true"
        },
        "defaultValue": "will be automatically generated",
        "id": "formly_137_input_CUSTOMERS_NUMBER_0",
        "hooks": {},
        "modelOptions": {},
        "wrappers": [
          "form-field"
        ],
        "_keyPath": {
          "key": "CUSTOMERS_NUMBER",
          "path": [
            "CUSTOMERS_NUMBER"
          ]
        },
        "hide": false
      },
      {
        "className": "section-label",
        "template": "<br />",
        "id": "formly_137_template__1",
        "hooks": {},
        "modelOptions": {},
        "templateOptions": {
          "disabled": false
        },
        "type": "formly-template",
        "wrappers": []
      }
    ],
    "id": "formly_135___0",
    "hooks": {},
    "modelOptions": {},
    "templateOptions": {},
    "type": "formly-group",
    "defaultValue": {},
    "wrappers": []
  },
    {
      "className": "section-label",
      "template": "<div class=\"form-section-title\"><strong>Persönliche Daten:</strong></div>",
      "id": "formly_137_template__1",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {
        "disabled": false
      },
      "type": "formly-template",
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "className": "col-md-6",
          "type": "input",
          "key": "CUSTOMERS_PRENAME",
          "templateOptions": {
            "label": "first name",
            "required": true,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_139_input_CUSTOMERS_PRENAME_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "CUSTOMERS_PRENAME",
            "path": [
              "CUSTOMERS_PRENAME"
            ]
          }
        },
        {
          "className": "col-md-6",
          "type": "input",
          "key": "CUSTOMERS_NAME",
          "templateOptions": {
            "label": "customer name",
            "required": true,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_139_input_CUSTOMERS_NAME_1",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "CUSTOMERS_NAME",
            "path": [
              "CUSTOMERS_NAME"
            ]
          }
        }
      ],
      "id": "formly_137___2",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "className": "col-md-6",
          "type": "input",
          "key": "CUSTOMERS_COMPANY",
          "templateOptions": {
            "label": "company",
            "required": true,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_140_input_CUSTOMERS_COMPANY_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "CUSTOMERS_COMPANY",
            "path": [
              "CUSTOMERS_COMPANY"
            ]
          }
        }
      ],
      "id": "formly_139___3",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "key": "CUSTOMERS_TYPE",
          "type": "native-select",
          "className": "col-md-4",
          "defaultValue": "B2C",
          "templateOptions": {
            "label": "customer type",
            "required": true,
            "options": [
              {
                "label": "Please select"
              },
              {
                "label": "B2C",
                "value": "B2C"
              },
              {
                "label": "B2B",
                "value": "B2B"
              }
            ],
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": true,
            "_flatOptions": true
          },
          "expressionProperties": {
            "templateOptions.disabled": "true"
          },
          "id": "formly_142_native-select_CUSTOMERS_TYPE_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "CUSTOMERS_TYPE",
            "path": [
              "CUSTOMERS_TYPE"
            ]
          }
        },
        {
          "className": "section-label",
          "template": "<br />",
          "id": "formly_142_template__1",
          "hooks": {},
          "modelOptions": {},
          "templateOptions": {
            "disabled": false
          },
          "type": "formly-template",
          "wrappers": []
        }
      ],
      "id": "formly_140___4",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "className": "col-md-4",
          "type": "input",
          "key": "EEC_NUM",
          "templateOptions": {
            "label": "EEC_NUM",
            "required": true,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_143_input_EEC_NUM_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "EEC_NUM",
            "path": [
              "EEC_NUM"
            ]
          }
        }
      ],
      "id": "formly_142___5",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "key": "LANGUAGE",
          "type": "native-select",
          "className": "col-md-4",
          "defaultValue": "DEU",
          "templateOptions": {
            "label": "language",
            "required": true,
            "options": [
              {
                "label": "Please select"
              },
              {
                "label": "Chinesisch (CN - CHI)",
                "value": "CHI"
              },
              {
                "label": "Dänisch (DK - DEN)",
                "value": "DEN"
              },
              {
                "label": "Deutsch (DE - DEU)",
                "value": "DEU"
              },
              {
                "label": "Deutsch (Österreich) (AT - AUT)",
                "value": "AUT"
              },
              {
                "label": "Englisch (GB) (GB - GBR)",
                "value": "GBR"
              },
              {
                "label": "Englisch (US) (US - ENG)",
                "value": "ENG"
              },
              {
                "label": "Französisch (FR - FRA)",
                "value": "FRA"
              },
              {
                "label": "Französisch (BE - BEL)",
                "value": "BEL"
              },
              {
                "label": "Italienisch (IT - ITA)",
                "value": "ITA"
              },
              {
                "label": "Mazedonisch (MK - MAZ)",
                "value": "MAZ"
              },
              {
                "label": "Niederländisch (NL - NED)",
                "value": "NED"
              },
              {
                "label": "Spanisch (ES - SPA)",
                "value": "SPA"
              },
              {
                "label": "Tschechisch (CZ - CZE)",
                "value": "CZE"
              }
            ],
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false,
            "_flatOptions": true
          },
          "id": "formly_145_native-select_LANGUAGE_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "LANGUAGE",
            "path": [
              "LANGUAGE"
            ]
          }
        },
        {
          "className": "section-label",
          "template": "<br />",
          "id": "formly_145_template__1",
          "hooks": {},
          "modelOptions": {},
          "templateOptions": {
            "disabled": false
          },
          "type": "formly-template",
          "wrappers": []
        }
      ],
      "id": "formly_143___6",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "className": "section-label",
      "template": "<div class=\"form-section-title\"><strong>EDI Felder:</strong></div>",
      "id": "formly_145_template__7",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {
        "disabled": false
      },
      "type": "formly-template",
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "key": "EDI_INVOIC",
          "className": "col-md-4",
          "type": "checkbox",
          "defaultValue": false,
          "templateOptions": {
            "label": "EDI_INVOIC",
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false,
            "hideFieldUnderline": true,
            "indeterminate": true,
            "floatLabel": "always",
            "hideLabel": true,
            "align": "start",
            "color": "accent"
          },
          "id": "formly_146_checkbox_EDI_INVOIC_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "EDI_INVOIC",
            "path": [
              "EDI_INVOIC"
            ]
          }
        }
      ],
      "id": "formly_145___8",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "key": "EDI_ORDERSP",
          "className": "col-md-4",
          "type": "checkbox",
          "defaultValue": false,
          "templateOptions": {
            "label": "EDI_ORDERSP",
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false,
            "hideFieldUnderline": true,
            "indeterminate": true,
            "floatLabel": "always",
            "hideLabel": true,
            "align": "start",
            "color": "accent"
          },
          "id": "formly_147_checkbox_EDI_ORDERSP_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "EDI_ORDERSP",
            "path": [
              "EDI_ORDERSP"
            ]
          }
        }
      ],
      "id": "formly_146___9",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "key": "EDI_DESADV",
          "className": "col-md-4",
          "type": "checkbox",
          "defaultValue": false,
          "templateOptions": {
            "label": "EDI_DESADV",
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false,
            "hideFieldUnderline": true,
            "indeterminate": true,
            "floatLabel": "always",
            "hideLabel": true,
            "align": "start",
            "color": "accent"
          },
          "id": "formly_148_checkbox_EDI_DESADV_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "EDI_DESADV",
            "path": [
              "EDI_DESADV"
            ]
          }
        }
      ],
      "id": "formly_147___10",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "className": "col-md-6",
          "type": "input",
          "key": "CREATE_DATE",
          "templateOptions": {
            "label": "creation date",
            "type": "date",
            "required": true,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_149_input_CREATE_DATE_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "CREATE_DATE",
            "path": [
              "CREATE_DATE"
            ]
          }
        }
      ],
      "id": "formly_148___11",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "className": "col-md-6",
          "type": "input",
          "key": "CUSTOMERS_EMAIL",
          "templateOptions": {
            "label": "e-mail",
            "required": true,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_150_input_CUSTOMERS_EMAIL_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "CUSTOMERS_EMAIL",
            "path": [
              "CUSTOMERS_EMAIL"
            ]
          }
        }
      ],
      "id": "formly_149___12",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "className": "col-md-6",
          "type": "input",
          "key": "CUSTOMERS_PHONE",
          "templateOptions": {
            "label": "telefon",
            "required": true,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_151_input_CUSTOMERS_PHONE_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "CUSTOMERS_PHONE",
            "path": [
              "CUSTOMERS_PHONE"
            ]
          }
        }
      ],
      "id": "formly_150___13",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "className": "section-label",
      "template": "<div class=\"form-section-title\"><strong>Emails Bestellvorgang:</strong></div>",
      "id": "formly_153_template__15",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {
        "disabled": false
      },
      "type": "formly-template",
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "className": "col-md-4",
          "type": "input",
          "key": "EMAIL_AU",
          "templateOptions": {
            "label": "order email",
            "required": true,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_156_input_EMAIL_AU_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "EMAIL_AU",
            "path": [
              "EMAIL_AU"
            ]
          }
        },
        {
          "className": "col-md-4",
          "type": "input",
          "key": "EMAIL_LI",
          "templateOptions": {
            "label": "delivery note email",
            "required": true,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_156_input_EMAIL_LI_1",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "EMAIL_LI",
            "path": [
              "EMAIL_LI"
            ]
          }
        },
        {
          "className": "col-md-4",
          "type": "input",
          "key": "EMAIL_RG",
          "templateOptions": {
            "label": "invoice email",
            "required": true,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_156_input_EMAIL_RG_2",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "EMAIL_RG",
            "path": [
              "EMAIL_RG"
            ]
          }
        }
      ],
      "id": "formly_153___16",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "className": "section-label",
      "template": "<div class=\"form-section-title\"><strong>Telefonnummern:</strong></div>",
      "id": "formly_156_template__17",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {
        "disabled": false
      },
      "type": "formly-template",
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "className": "col-md-6",
          "type": "input",
          "key": "PHONE_0",
          "templateOptions": {
            "label": "Phone",
            "required": true,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_158_input_PHONE_0_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "PHONE_0",
            "path": [
              "PHONE_0"
            ]
          }
        },
        {
          "className": "col-md-6",
          "type": "input",
          "key": "PHONE_1",
          "defaultValue": "",
          "templateOptions": {
            "label": "Phone 1",
            "required": false,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_158_input_PHONE_1_1",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "PHONE_1",
            "path": [
              "PHONE_1"
            ]
          }
        }
      ],
      "id": "formly_156___18",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "className": "section-label",
      "template": "<div class=\"form-section-title\"><strong>Mobilerufnummern:</strong></div>",
      "id": "formly_158_template__19",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {
        "disabled": false
      },
      "type": "formly-template",
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "className": "col-md-6",
          "type": "input",
          "key": "MOB_0",
          "templateOptions": {
            "label": "Mobile",
            "required": true,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_160_input_MOB_0_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "MOB_0",
            "path": [
              "MOB_0"
            ]
          }
        },
        {
          "className": "col-md-6",
          "type": "input",
          "key": "MOB_1",
          "defaultValue": "",
          "templateOptions": {
            "label": "Mobile 1",
            "required": false,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_160_input_MOB_1_1",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "MOB_1",
            "path": [
              "MOB_1"
            ]
          }
        }
      ],
      "id": "formly_158___20",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "className": "col-md-6",
          "type": "input",
          "key": "FAX_0",
          "defaultValue": "",
          "templateOptions": {
            "label": "Fax",
            "required": false,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_161_input_FAX_0_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "FAX_0",
            "path": [
              "FAX_0"
            ]
          }
        }
      ],
      "id": "formly_160___21",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "className": "col-md-4",
          "type": "input",
          "key": "CRNNUM",
          "templateOptions": {
            "label": "CRNNUM",
            "required": true,
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false
          },
          "id": "formly_162_input_CRNNUM_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "CRNNUM",
            "path": [
              "CRNNUM"
            ]
          }
        }
      ],
      "id": "formly_161___22",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [
        {
          "key": "PAYMENT_TERM_ID",
          "type": "native-select",
          "className": "col-md-7",
          "defaultValue": "DEVORAUS",
          "templateOptions": {
            "label": "term of payment id",
            "required": true,
            "options": [
              {
                "label": "Please select"
              },
              {
                "label": "GER~14 Tage~ (FR14T)",
                "value": "FR14T"
              },
              {
                "label": "GER~30 Jours~ (FR30T)",
                "value": "FR30T"
              },
              {
                "label": "GER~Amazon Payments~ (AMAZONPAYMENTS)",
                "value": "AMAZONPAYMENTS"
              },
              {
                "label": "GER~Anzahlung~DEANZ (DEANZ)",
                "value": "DEANZ"
              },
              {
                "label": "GER~auf Rechnung~ (RE)",
                "value": "RE"
              },
              {
                "label": "GER~Bank Transfer~VORAUS (UKVORAUS)",
                "value": "UKVORAUS"
              },
              {
                "label": "GER~Bankeinzug~DELAST (DELAST)",
                "value": "DELAST"
              },
              {
                "label": "GER~Banküberweisung~VORAUS (PAY)",
                "value": "PAY"
              },
              {
                "label": "GER~Barzahlung~ (BAR)",
                "value": "BAR"
              },
              {
                "label": "GER~Cheque~Cheque (FRCHQ30FM)",
                "value": "FRCHQ30FM"
              },
              {
                "label": "GER~COD~COD (UKNACH)",
                "value": "UKNACH"
              },
              {
                "label": "GER~Comptant~ (BARFR)",
                "value": "BARFR"
              },
              {
                "label": "GER~Contre-remboursement~Contre Rem (FRNACH)",
                "value": "FRNACH"
              },
              {
                "label": "GER~EC Kartenzahlung~ (DEEC)",
                "value": "DEEC"
              },
              {
                "label": "GER~Farbmuster Versand~MUSTER (MUSTER)",
                "value": "MUSTER"
              },
              {
                "label": "GER~Finanzierung Commerzfinanz~DECOMMERZ (DECOMMERZ)",
                "value": "DECOMMERZ"
              },
              {
                "label": "GER~kostenlose Lieferung~ERSATZ (ERSATZ)",
                "value": "ERSATZ"
              },
              {
                "label": "GER~Kostenlos~ERSATZ (FRERSATZ)",
                "value": "FRERSATZ"
              },
              {
                "label": "GER~Mastercard/Visa~ (DECC)",
                "value": "DECC"
              },
              {
                "label": "GER~Mastercard/Visa~ (ESCC)",
                "value": "ESCC"
              },
              {
                "label": "GER~Mastercard/Visa~ (FRCC)",
                "value": "FRCC"
              },
              {
                "label": "GER~Mastercard/Visa~ (ITCC)",
                "value": "ITCC"
              },
              {
                "label": "GER~Mastercard/Visa~ (UKCC)",
                "value": "UKCC"
              },
              {
                "label": "GER~Muster Frankreich~FRMUSTER (FRMUSTER)",
                "value": "FRMUSTER"
              },
              {
                "label": "GER~Nach Erhalt der Rechnung~ (SOFORT)",
                "value": "SOFORT"
              },
              {
                "label": "GER~Nachnahme~Nachnahme (DENACH)",
                "value": "DENACH"
              },
              {
                "label": "GER~Paiement en 3 fois~ (FRRA)",
                "value": "FRRA"
              },
              {
                "label": "GER~Par acomptes~FRANZ (FRANZ)",
                "value": "FRANZ"
              },
              {
                "label": "GER~Par cheque~Cheque (FRCHQ)",
                "value": "FRCHQ"
              },
              {
                "label": "GER~Par facture~ (FRRE)",
                "value": "FRRE"
              },
              {
                "label": "GER~PARTIAL PAYMENT~UKANZ (UKANZ)",
                "value": "UKANZ"
              },
              {
                "label": "GER~Payable within 30 Days~ (UK30T)",
                "value": "UK30T"
              },
              {
                "label": "GER~PayPal~PayPal (PAYPAL)",
                "value": "PAYPAL"
              },
              {
                "label": "GER~Portal~Portal (PORTAL)",
                "value": "PORTAL"
              },
              {
                "label": "GER~Ratenzahlung Payolution~ (RAPAY)",
                "value": "RAPAY"
              },
              {
                "label": "GER~Ratepay Ratenzahlung~RATERA (RATERA)",
                "value": "RATERA"
              },
              {
                "label": "GER~Ratepay Rechnung~RATERE (RATERE)",
                "value": "RATERE"
              },
              {
                "label": "GER~Ratepay SEPA-Lastschrift~RATESELA (RATESELA)",
                "value": "RATESELA"
              },
              {
                "label": "GER~Rechnung Fälligkeit 10 Tage~ (DE10T)",
                "value": "DE10T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 10 Tage~ (DE10TAGE)",
                "value": "DE10TAGE"
              },
              {
                "label": "GER~Rechnung Fälligkeit 120 Tage~ (DE120T)",
                "value": "DE120T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 14 Tage~ (DE14T)",
                "value": "DE14T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 14 Tage~ (EMO14T)",
                "value": "EMO14T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 15 Tage~ (DE15T)",
                "value": "DE15T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 20 Tage~ (DE20T)",
                "value": "DE20T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 21 Tage, 2 % Skonto~21T/ 2% (DE21T3)",
                "value": "DE21T3"
              },
              {
                "label": "GER~Rechnung Fälligkeit 21 Tage, 5 % Skonto~21T/ 5% (DE21T)",
                "value": "DE21T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 21 Tage~ (DE21TAGE)",
                "value": "DE21TAGE"
              },
              {
                "label": "GER~Rechnung Fälligkeit 28 Tage~ (DE28T)",
                "value": "DE28T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 3 Tage~3 Tage netto (DE03T)",
                "value": "DE03T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 30 Tage~ (DE30T)",
                "value": "DE30T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 30 Tage~ (DELASR)",
                "value": "DELASR"
              },
              {
                "label": "GER~Rechnung Fälligkeit 31 Tage~ (DE31T)",
                "value": "DE31T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 40 Tage~ (DE40T)",
                "value": "DE40T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 45 Tage~ (DE45T)",
                "value": "DE45T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 46 Tage~ (DE46T)",
                "value": "DE46T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 5 Tage~5 Tage netto (DE05T)",
                "value": "DE05T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 50 Tage~ (DE50T)",
                "value": "DE50T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 60 Tage~ (DE60T)",
                "value": "DE60T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 61 Tage~ (DE61T)",
                "value": "DE61T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 7 Tage~ (DE07T)",
                "value": "DE07T"
              },
              {
                "label": "GER~Rechnung Fälligkeit 8 Tage~ (DE08T)",
                "value": "DE08T"
              },
              {
                "label": "GER~Rechnung Payolution~ (REPAY)",
                "value": "REPAY"
              },
              {
                "label": "GER~Vario bezahlt~VARIOBEZAHLT (VARIOBEZAHLT)",
                "value": "VARIOBEZAHLT"
              },
              {
                "label": "GER~Virement bancaire~VORAUS (FRVORAUS)",
                "value": "FRVORAUS"
              },
              {
                "label": "GER~Vorkasse Banküberweisung~VORAUS (DEVORAUS)",
                "value": "DEVORAUS"
              },
              {
                "label": "GER~Vorkasse Banküberweisung~VORAUS (ITVORAUS)",
                "value": "ITVORAUS"
              },
              {
                "label": "GER~Vorkasse~VORAUS (ESVORAUS)",
                "value": "ESVORAUS"
              }
            ],
            "refTable": "custbtwoc",
            "tableName": "CUSTOMERS",
            "newItemMode": true,
            "needsValidation": "false",
            "placeholder": "",
            "focus": false,
            "disabled": false,
            "_flatOptions": true
          },
          "id": "formly_163_native-select_PAYMENT_TERM_ID_0",
          "hooks": {},
          "modelOptions": {},
          "wrappers": [
            "form-field"
          ],
          "_keyPath": {
            "key": "PAYMENT_TERM_ID",
            "path": [
              "PAYMENT_TERM_ID"
            ]
          }
        }
      ],
      "id": "formly_162___23",
      "hooks": {},
      "modelOptions": {},
      "templateOptions": {},
      "type": "formly-group",
      "defaultValue": {},
      "wrappers": []
    }]);

}
