export class Warehousing {
  constructor(
    public ID: number,
    public WHLOC: string,
    public ITMNUM: string,
    public LOT: string,
    public LOC: string,
    public STATUS_POS: string,
    public QTY: number,
    public RESERVED: number,
    public UPDATE_LOC: string,
  ) {
  }
}
