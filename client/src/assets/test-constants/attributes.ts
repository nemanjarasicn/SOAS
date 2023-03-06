/**
 * attributes constants for unit tests
 */
export class AttributesTestConstants {

  public static ATTRIBUTES = JSON.stringify([{
    "fieldGroupClassName": "row",
    "fieldGroup": [{
      "className": "col-md-12",
      "type": "input",
      "key": "ID",
      "templateOptions": {
        "label": "ID",
        "required": true,
        "refTable": "attributes",
        "tableName": "ATTRIBUTES",
        "newItemMode": "false",
        "isPrimary": "true",
        "isIdentity": "true",
        "needsValidation": "false"
      },
      "expressionProperties": {"templateOptions.disabled": "true"}
    }]
  }, {
    "fieldGroupClassName": "row",
    "fieldGroup": [{
      "className": "col-md-12",
      "type": "input",
      "key": "ATTRIBUTE_NAME",
      "templateOptions": {
        "label": "ATTRIBUTE_NAME",
        "required": true,
        "refTable": "attributes",
        "tableName": "ATTRIBUTES",
        "newItemMode": "false",
        "needsValidation": "false"
      }
    }]
  }, {
    "fieldGroupClassName": "row",
    "fieldGroup": [{
      "className": "col-md-12",
      "type": "input",
      "key": "ATTRIBUTE_DATA",
      "templateOptions": {
        "label": "ATTRIBUTE_DATA",
        "required": true,
        "refTable": "attributes",
        "tableName": "ATTRIBUTES",
        "newItemMode": "false",
        "needsValidation": "false"
      }
    }]
  }]);

  public static ATTRIBUTES_FIELDS = JSON.stringify([
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        defaultValue: {},
        fieldGroup: [
          {key: "ATTR_BRAND", type: "native-select", templateOptions: {}, id: "formly_43_native-select_ATTR_BRAND_0",},
          {
            key: "ATTR_CATEGORY_0",
            type: "native-select",
            templateOptions: {},
            id: "formly_43_native-select_ATTR_CATEGORY_0_1",
          },
          {
            key: "ATTR_CATEGORY_1",
            type: "native-select",
            templateOptions: {
              "label": "ATTR_CATEGORY_1", // Kategorie 1
              "required": false,
              "options": [
                {
                  "label": "",
                  "value": 61
                },
                {
                  "label": "Gästebad",
                  "value": 59
                },
                {
                  "label": "Keramik",
                  "value": 7558
                },
                {
                  "label": "LED Spiegel",
                  "value": 63
                },
                {
                  "label": "LED-Leuchtspiegel",
                  "value": 8157
                },
                {
                  "label": "Runde Badmöbel",
                  "value": 62
                },
                {
                  "label": "Smart Home Badmöbel",
                  "value": 65
                },
                {
                  "label": "Spar-Sets",
                  "value": 64
                },
                {
                  "label": "Spiegelschrank",
                  "value": 3190
                },
                {
                  "label": "SpiegelschrankPLUS",
                  "value": 2122
                },
                {
                  "label": "Stand-Badmöbel",
                  "value": 60
                },
                {
                  "label": "wandhängend",
                  "value": 6646
                }
              ],
              "placeholder": "",
              "focus": false,
              "disabled": false,
              "_flatOptions": true
            },
            id: "formly_43_native-select_ATTR_CATEGORY_1_2",
          },
          {key: "ATTR_GROUP", type: "native-select", templateOptions: {}, id: "formly_43_native-select_ATTR_GROUP_3",},
          {key: "ATTR_COLOR", type: "native-select", templateOptions: {}, id: "formly_43_native-select_ATTR_COLOR_4",},
          {
            key: "ATTR_FEATURE",
            type: "native-select",
            templateOptions: {},
            id: "formly_43_native-select_ATTR_FEATURE_5",
          },
          {key: "ATTR_YOUTUBE", type: "input", templateOptions: {}, id: "formly_43_input_ATTR_YOUTUBE_6",},
          {
            key: "ATTR_SHOP_ACTIVE",
            type: "checkbox",
            defaultValue: false,
            templateOptions: {
              "label": "ATTR_SHOP_ACTIVE", // im Shop aktiv
              "required": false,
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
            id: "formly_43_checkbox_ATTR_SHOP_ACTIVE_7",
          },
        ]
      }]
    }]);

  public static ATTRIBUTES_FIELDS_2 = JSON.stringify([
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "key": "ATTR_CATEGORY_1",
        "type": "native-select",
        "templateOptions": {
          "label": "ATTR_CATEGORY_1", // Kategorie 1
          "required": false,
          "options": [
            {
              "label": "",
              "value": 61
            },
            {
              "label": "Gästebad",
              "value": 59
            },
            {
              "label": "Keramik",
              "value": 7558
            },
            {
              "label": "LED Spiegel",
              "value": 63
            },
            {
              "label": "LED-Leuchtspiegel",
              "value": 8157
            },
            {
              "label": "Runde Badmöbel",
              "value": 62
            },
            {
              "label": "Smart Home Badmöbel",
              "value": 65
            },
            {
              "label": "Spar-Sets",
              "value": 64
            },
            {
              "label": "Spiegelschrank",
              "value": 3190
            },
            {
              "label": "SpiegelschrankPLUS",
              "value": 2122
            },
            {
              "label": "Stand-Badmöbel",
              "value": 60
            },
            {
              "label": "wandhängend",
              "value": 6646
            }
          ],
          "placeholder": "",
          "focus": false,
          "disabled": false,
          "_flatOptions": true
        },
      }]
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "key": "ATTR_SHOP_ACTIVE",
        "type": "checkbox",
        "defaultValue": false,
        "templateOptions": {
          "label": "ATTR_SHOP_ACTIVE", // im Shop aktiv
          "required": false,
          "placeholder": "",
          "focus": false,
          "disabled": false,
          "hideFieldUnderline": true,
          "indeterminate": true,
          "floatLabel": "always",
          "hideLabel": true,
          "align": "start",
          "color": "accent"
        }
      }]
    }]);

  public static ATTRIBUTE_OPTIONS: any[] =
    [
      {
        "ATTR_BRAND": [
          {label: "Keramag", value: 7}
        ]
      },
      {
        "ATTR_CATEGORY_1": [
          {label: "", value: 61},
          {label: "Gästebad", value: 59},
          {label: "Keramik", value: 7558},
          {label: "LED Spiegel", value: 63},
          {label: "LED-Leuchtspiegel", value: 8157},
          {label: "Runde Badmöbel", value: 62},
          {label: "Smart Home Badmöbel", value: 65},
          {label: "Spar-Sets", value: 64},
          {label: "Spiegelschrank", value: 3190},
          {label: "SpiegelschrankPLUS", value: 2122},
          {label: "Stand-Badmöbel", value: 60},
          {label: "wandhängend", value: 6646},
        ]
      },
      {
        "ATTR_SHOP_ACTIVE": [
          {
            label: false,
            value: 2010
          },
          {
            label: true,
            value: 2011
          }
        ]
      }
    ];

  public static ATTRIBUTES_MODEL = {ATTR_BRAND: 9, ATTR_CATEGORY_1: 65, ATTR_SHOP_ACTIVE: true};

}
