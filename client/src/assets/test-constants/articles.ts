/**
 * articles (ITEM_BASIS) constants for unit tests
 */
import {Article} from "../../app/models/article";

export class ArticlesTestConstants {

  public static ARTICLES_FIELDS = JSON.stringify([
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-12",
        "type": "input",
        "key": "ID",
        "defaultValue": "A",
        "templateOptions": {"label": "ID"},
        "expressionProperties": {"templateOptions.disabled": "true"}
      },
      {
        "className": "col-md-6",
        "type": "input",
        "key": "ITMNUM",
        "templateOptions": {"label": "ITMNUM", "required": true}
      },
        {"className": "section-label", "template": "<br />"}
      ]
    },
    {
      "className": "section-label",
      "template": "<div class=\"form-section-title\"><strong>Beschreibung:</strong></div>"
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-6",
        "type": "input",
        "key": "ITMDES",
        "templateOptions": {"label": "ITMDES", "required": true}
      }, {
        "className": "col-md-6",
        "type": "input",
        "key": "ITMDES_UC",
        "templateOptions": {
          "label": "ITMDES_UC",
          "required": true,
          "attributes": {"style": "text-transform: uppercase"}
        }
      }]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-3",
        "type": "input",
        "key": "EANCOD",
        "templateOptions": {"label": "EANCOD", "required": true}
      }]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-4",
        "type": "native-select",
        "key": "CATEGORY_SOAS",
        "templateOptions": {"label": "CATEGORY_SOAS", "required": true, "options": []}
      }]
    },
    {
      "className": "section-label",
      "template": "<div class=\"form-section-title\"><strong>Maßen:</strong></div>"
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-4",
        "type": "input",
        "key": "ART_LENGTH",
        "templateOptions": {"label": "ART_LENGTH", "required": true}
      }, {
        "className": "col-md-4",
        "type": "input",
        "key": "ART_WIDTH",
        "templateOptions": {"label": "ART_WIDTH", "required": true}
      }, {
        "className": "col-md-4",
        "type": "input",
        "key": "ART_HEIGHT",
        "templateOptions": {"label": "ART_HEIGHT", "required": true}
      }]
    },
    {
      "className": "section-label",
      "template": "<div class=\"form-section-title\"><strong>Packmaßen:</strong></div>"
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-4",
        "type": "input",
        "key": "PACK_LENGTH",
        "templateOptions": {"label": "PACK_LENGTH", "required": true}
      }, {
        "className": "col-md-4",
        "type": "input",
        "key": "PACK_WIDTH",
        "templateOptions": {"label": "PACK_WIDTH", "required": true}
      }, {
        "className": "col-md-4",
        "type": "input",
        "key": "PACK_HEIGHT",
        "templateOptions": {"label": "PACK_HEIGHT", "required": true}
      }]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "className": "col-md-3",
        "type": "input",
        "key": "ITMWEIGHT",
        "templateOptions": {"label": "ITMWEIGHT", "required": true}
      }]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "key": "ACTIVE_FLG",
        "className": "col-md-6",
        "type": "checkbox",
        "defaultValue": false,
        "templateOptions": {"label": "ACTIVE_FLG"}
      }, {
        "key": "RAW_FLG",
        "className": "col-md-6",
        "type": "checkbox",
        "defaultValue": false,
        "templateOptions": {"label": "RAW_FLG"}
      }]
    },
    {
      "className": "section-label",
      "template": "<div class=\"form-section-title\"><strong>Crossselling:</strong></div>"
    },
    {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "key": "CROSSSELLING_FLG",
        "className": "col-md-4",
        "type": "checkbox",
        "defaultValue": false,
        "templateOptions": {"label": "CROSSSELLING_FLG"}
      }, {
        "key": "CROSSSELLING",
        "type": "formly-autocomplete-type",
        "className": "col-md-8",
        "templateOptions": {"label": "CROSSSELLING"}
      }]
    }, {
      "fieldGroupClassName": "row",
      "fieldGroup": [{
        "key": "WAREHOUSE_MANAGED",
        "className": "col-md-4",
        "type": "checkbox",
        "defaultValue": false,
        "templateOptions": {"label": "WAREHOUSE_MANAGED"}
      }]
    }]);

  public static ARTICLES_ITEM: Article = {
    ID: 1471,
    ITMNUM: "MARS600SET000104DE",
    ITMDES: "Badmöbel Mars 600 2-teilig mit LED Spiegel SlimLine anthrazit seidenglanz",
    ITMDES_UC: "BADMÖBEL MARS 600 2-TEILIG MIT LED SPIEGEL SLIMLINE ANTHRAZIT SEIDENGLANZ",
    EANCOD: "4251461512076",
    CATEGORY_SOAS: "SET",
    ART_LENGTH: 60.0000,
    ART_WIDTH: 36.0000,
    ART_HEIGHT: 52.0000,
    PACK_LENGTH: 0.0000,
    PACK_WIDTH: 0.0000,
    PACK_HEIGHT: 0.0000,
    ITMWEIGHT: 0.0000,
    ACTIVE_FLG: true,
    RAW_FLG: false,
    CROSSSELLING_FLG: false,
    // CROSSSELLING_ID: 1051,
    CROSSSELLING_DATA: "BMCROSS53,4250363417984,BMCROSS33,BMCROSS34,BMCROSS36,4250363417908,BMCROSS37,BMCROSS43,BMCROSS47," +
      "BMCROSS44,LED-LEUCHTE-SPIEGELSCHRANK,BMCROSS49,PURE-34200-PENDELLEUCHTE-3ER,LIPCO-34389-WANDLEUCHTE," +
      "KNIGHT-39168-BALKEN-3ER,BMCROSS50,KNIGHT-39167-RONDELL-3ER,LJ-SPIEGEL900-600,LJ-SPIEGEL800-600,LJ-SPIEGEL700-600," +
      "LJ-SPIEGEL600-600,LJ-SPIEGEL400-600,LJ-SPIEGEL1400-600,LJ-SPIEGEL1200-650,LJ-SPIEGEL1000-600,4250363417823," +
      "4250363417809,4250363417847,BMCROSS1,BMCROSS4,4250524133258,4250524133289,4250524133265,4250524133234," +
      "4250524133241,4250524133296,4250524133272,4250524133302,SPIEGEL-UNBELEUCHTET-90X50CM,SPIEGEL-UNBELEUCHTET-75X60CM," +
      "SPIEGEL-UNBELEUCHTET-75X54-5CM,SPIEGEL-UNBELEUCHTET-75X50CM,SPIEGEL-UNBELEUCHTET-70X50CM," +
      "SPIEGEL-UNBELEUCHTET-66X50CM,SPIEGEL-UNBELEUCHTET-60X40CM,SPIEGEL-UNBELEUCHTET-60X38-5CM," +
      "SPIEGEL-UNBELEUCHTET-40X60CM,SPIEGEL-UNBELEUCHTET-135X50CM,SPIEGEL-UNBELEUCHTET-120X80CM," +
      "SPIEGEL-UNBELEUCHTET-120X60CM,WCROSS26,WCROSS29,WCROSS28,WCROSS27,BMCROSS7,ARMATUR-ATHOS," +
      "ARMATUR-CADANS-KIWA,BMCROSS2,BMCROSS3,AURUM-XL000104DE,AURUM-S000104DE,AURUM-M000104DE,AURUM-L000104DE," +
      "HS115CM000104DE,HS110CM000104DE,SPS90X60CM000104DE,SPS75X60CM000104DE,SPS66X60CM000104DE,SPS140X62CM000104DE," +
      "SPS120X62CM000104DE,SPS100X50CM000104DE,SPS90X60CM000104SETDE,SPS75X60CM000104SETDE,SPS66X60CM000104SETDE," +
      "SPS100X50CM000104SETDE,ARMATUR-GROHE-ESSENCE,BMCROSS21,BMCROSS25,BMCROSS29,BMCROSS27,ARMATUR-GROHE-32240001-00," +
      "BMCROSS23,SMEDBO-KOSMETIKSPIEGEL-FK483E,SMEDBO-KOSMETIKSPIEGEL-FK482E,BMCROSS51,SMEDBO-KOSMETIKSPIEGEL-FK472E," +
      "SMEDBO-KOSMETIKSPIEGEL-FK470E,SMEDBO-KOSMETIKSPIEGEL-FK443,SMEDBO-KOSMETIKSPIEGEL-FK435," +
      "SMEDBO-KOSMETIKSPIEGEL-FK474E,ECKVENTIL1-2-A603,HM1-50150W00,HM1-60120W00,HM1-60140W00,HM1-60160W00,HM1-60180W00," +
      "ION600X1200WEISS00,ION600X1200ANTHRAZIT00,IONRD600X1200WEISS00,IONRD600X1800WEISS00,ION600X1800ANTHRAZIT00," +
      "BMCROSS35,BMCROSS39,BMCROSS52,BMCROSS38,BMCROSS19,SPIEGEL-UNBELEUCHTET-144X50CM,BMCROSS45,BMCROSS46,BMCROSS40," +
      "BMCROSS41,BMCROSS42,LED-SPIEGEL-100-60,LED-SPIEGEL-120-65,LED-SPIEGEL-140-60,LED-SPIEGEL-60-60,LED-SPIEGEL-70-60," +
      "LED-SPIEGEL-80-60,LED-SPIEGEL-90-60,WCROSS30,BMCROSS58,BMCROSS59,BMCROSS60,BMCROSS61,BMCROSS62,BMCROSS71," +
      "BMCROSS72,BMCROSS73,BMCROSS75,HS120CM000104DE,HS180CM000104DE,HS188CM000104DE,HS062CM000104DE,HSXL000104DE," +
      "HS150CM000104DE,MSHS000104DE,SANTINIPANEL000104DE,SANTINILED000104DE,CUBEPANEL000104DE",
    WAREHOUSE_MANAGED: false
  };

  /**
   * Articles table data returned by:
   * let tableDbData = await tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_ARTICLES,
   * ViewQueryTypes.DETAIL_TABLE, 'ITMNUM', currentOrderPosition.ITMNUM);
   */
  public static ARTICLES_TABLE_DB_DATA: { table: [any[string], any[]], maxRows: number, page: number } = {
    "table": [
      "ID, ITMNUM, ITMDES, ITMDES_UC, EANCOD, CATEGORY_SOAS, ART_LENGTH, ART_WIDTH, ART_HEIGHT, PACK_LENGTH, " +
      "PACK_WIDTH, PACK_HEIGHT, ITMWEIGHT, ACTIVE_FLG, RAW_FLG, CROSSSELLING_FLG, WAREHOUSE_MANAGED, CROSSSELLING_ID," +
      "CROSSSELLING",
      [
        {
          ID: 1471,
          ITMNUM: "MARS600SET000104DE",
          ITMDES: "Badmöbel Mars 600 2-teilig mit LED Spiegel SlimLine anthrazit seidenglanz",
          ITMDES_UC: "BADMÖBEL MARS 600 2-TEILIG MIT LED SPIEGEL SLIMLINE ANTHRAZIT SEIDENGLANZ",
          EANCOD: "4251461512076",
          CATEGORY_SOAS: "SET",
          ART_LENGTH: 60.0000,
          ART_WIDTH: 36.0000,
          ART_HEIGHT: 52.0000,
          PACK_LENGTH: 0.0000,
          PACK_WIDTH: 0.0000,
          PACK_HEIGHT: 0.0000,
          ITMWEIGHT: 0.0000,
          ACTIVE_FLG: 1,
          RAW_FLG: 0,
          CROSSSELLING_FLG: 0,
          WAREHOUSE_MANAGED: 0,
          CROSSSELLING_ID: 1051,
          CROSSSELLING_DATA: "BMCROSS53,4250363417984,BMCROSS33,BMCROSS34,BMCROSS36,4250363417908,BMCROSS37,BMCROSS43," +
            "BMCROSS47,BMCROSS44,LED-LEUCHTE-SPIEGELSCHRANK,BMCROSS49,PURE-34200-PENDELLEUCHTE-3ER,LIPCO-34389-WANDLEUCHTE," +
            "KNIGHT-39168-BALKEN-3ER,BMCROSS50,KNIGHT-39167-RONDELL-3ER,LJ-SPIEGEL900-600,LJ-SPIEGEL800-600,LJ-SPIEGEL700-600," +
            "LJ-SPIEGEL600-600,LJ-SPIEGEL400-600,LJ-SPIEGEL1400-600,LJ-SPIEGEL1200-650,LJ-SPIEGEL1000-600,4250363417823," +
            "4250363417809,4250363417847,BMCROSS1,BMCROSS4,4250524133258,4250524133289,4250524133265,4250524133234," +
            "4250524133241,4250524133296,4250524133272,4250524133302,SPIEGEL-UNBELEUCHTET-90X50CM,SPIEGEL-UNBELEUCHTET-75X60CM," +
            "SPIEGEL-UNBELEUCHTET-75X54-5CM,SPIEGEL-UNBELEUCHTET-75X50CM,SPIEGEL-UNBELEUCHTET-70X50CM," +
            "SPIEGEL-UNBELEUCHTET-66X50CM,SPIEGEL-UNBELEUCHTET-60X40CM,SPIEGEL-UNBELEUCHTET-60X38-5CM," +
            "SPIEGEL-UNBELEUCHTET-40X60CM,SPIEGEL-UNBELEUCHTET-135X50CM,SPIEGEL-UNBELEUCHTET-120X80CM," +
            "SPIEGEL-UNBELEUCHTET-120X60CM,WCROSS26,WCROSS29,WCROSS28,WCROSS27,BMCROSS7,ARMATUR-ATHOS," +
            "ARMATUR-CADANS-KIWA,BMCROSS2,BMCROSS3,AURUM-XL000104DE,AURUM-S000104DE,AURUM-M000104DE,AURUM-L000104DE," +
            "HS115CM000104DE,HS110CM000104DE,SPS90X60CM000104DE,SPS75X60CM000104DE,SPS66X60CM000104DE,SPS140X62CM000104DE," +
            "SPS120X62CM000104DE,SPS100X50CM000104DE,SPS90X60CM000104SETDE,SPS75X60CM000104SETDE,SPS66X60CM000104SETDE," +
            "SPS100X50CM000104SETDE,ARMATUR-GROHE-ESSENCE,BMCROSS21,BMCROSS25,BMCROSS29,BMCROSS27,ARMATUR-GROHE-32240001-00," +
            "BMCROSS23,SMEDBO-KOSMETIKSPIEGEL-FK483E,SMEDBO-KOSMETIKSPIEGEL-FK482E,BMCROSS51,SMEDBO-KOSMETIKSPIEGEL-FK472E," +
            "SMEDBO-KOSMETIKSPIEGEL-FK470E,SMEDBO-KOSMETIKSPIEGEL-FK443,SMEDBO-KOSMETIKSPIEGEL-FK435," +
            "SMEDBO-KOSMETIKSPIEGEL-FK474E,ECKVENTIL1-2-A603,HM1-50150W00,HM1-60120W00,HM1-60140W00,HM1-60160W00,HM1-60180W00," +
            "ION600X1200WEISS00,ION600X1200ANTHRAZIT00,IONRD600X1200WEISS00,IONRD600X1800WEISS00,ION600X1800ANTHRAZIT00," +
            "BMCROSS35,BMCROSS39,BMCROSS52,BMCROSS38,BMCROSS19,SPIEGEL-UNBELEUCHTET-144X50CM,BMCROSS45,BMCROSS46,BMCROSS40," +
            "BMCROSS41,BMCROSS42,LED-SPIEGEL-100-60,LED-SPIEGEL-120-65,LED-SPIEGEL-140-60,LED-SPIEGEL-60-60,LED-SPIEGEL-70-60," +
            "LED-SPIEGEL-80-60,LED-SPIEGEL-90-60,WCROSS30,BMCROSS58,BMCROSS59,BMCROSS60,BMCROSS61,BMCROSS62,BMCROSS71," +
            "BMCROSS72,BMCROSS73,BMCROSS75,HS120CM000104DE,HS180CM000104DE,HS188CM000104DE,HS062CM000104DE,HSXL000104DE," +
            "HS150CM000104DE,MSHS000104DE,SANTINIPANEL000104DE,SANTINILED000104DE,CUBEPANEL000104DE",
        }
      ]
    ],
    "maxRows": 203955,
    "page": 0
  };

  public static ARTICLES_TABLE_EMPTY_DB_DATA: { table: [any[string], any[]], maxRows: number, page: number } = {
    "table": [
      "ID, ITMNUM, ITMDES, ITMDES_UC, EANCOD, CATEGORY_SOAS, ART_LENGTH, ART_WIDTH, ART_HEIGHT, PACK_LENGTH, PACK_WIDTH, " +
      "PACK_HEIGHT, ITMWEIGHT, ACTIVE_FLG, RAW_FLG, CROSSSELLING_FLG, WAREHOUSE_MANAGED, CROSSSELLING_ID, CROSSSELLING",
      []
    ],
    "maxRows": 203955,
    "page": 0
  };
}
