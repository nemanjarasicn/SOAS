export interface Item_Basis {
  ID: number;
  ACTIVE_FLG: boolean;
  ITMNUM: string;
  ITMDES: string;
  ITMDES_UC: string;
  EANCOD: string;
  CATEGORY_SOAS: string;
  ART_LENGTH: number;
  ART_WIDTH: number;
  ART_HEIGHT: number;
  PACK_LENGTH: number;
  PACK_WIDTH: number;
  PACK_HEIGHT: number;
  ITMWEIGHT: number;
  RAW_FLG: boolean;
  CROSSSELLING_FLG: boolean;
  CROSSSELLING_DATA: string;
  WAREHOUSE_MANAGED: boolean;
                 // ATTR_BASIN_TYPE: string;
  // ATTR_BRAND: string;
  // ATTR_CATEGORY_0: string;
  // ATTR_CATEGORY_1: string;
  // ATTR_COLOR: string;
  // ATTR_GROUP: string;
  // ATTR_YOUTUBE: string;
  // ATTR_FEATURE: string;
}
