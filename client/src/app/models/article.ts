
export class Article {
  constructor(
    public ID: number,
    public ACTIVE_FLG: boolean,
    public ITMNUM: string,
    public ITMDES: string,
    public ITMDES_UC: string,
    public EANCOD: string,
    public CATEGORY_SOAS: string,
    public ART_LENGTH: number,
    public ART_WIDTH: number,
    public ART_HEIGHT: number,
    public PACK_LENGTH: number,
    public PACK_WIDTH: number,
    public PACK_HEIGHT: number,
    public ITMWEIGHT: number,
    public RAW_FLG: boolean,
    public CROSSSELLING_FLG: boolean,
    public CROSSSELLING_DATA?: string,
    public WAREHOUSE_MANAGED?: boolean,
  ) {  }

}
