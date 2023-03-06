/**
 * warehousing constants for unit tests
 */
export class WarehousingTestConstants {

  // 2 items
  public static WAREHOUSING_FIELDS = JSON.stringify([
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-6",
        "type": "input",
        "key": "ID",
        "templateOptions": {"label": "ID", "required": true},
        "expressionProperties": {"templateOptions.disabled": "true"}
      }, {"className": "section-label", "template": "<br />"}]
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-6",
        "type": "input",
        "key": "UPDATE_LOC",
        "defaultValue": "undefined",
        "templateOptions": {"label": "UPDATE_LOC", "required": true},
        "expressionProperties": {"templateOptions.disabled": "true"}
      }, {"className": "section-label", "template": "<br />"}]
    },
  ]);
}
