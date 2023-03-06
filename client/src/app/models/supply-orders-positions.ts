import { SupplyOrderPositionItem } from "../interfaces/supply-order-position-item";

export class SupplyOrdersPositions implements SupplyOrderPositionItem {
  constructor(
    public PROVIDERS_ORDER: string,
    public ITMNUM: string,
    public ORDER_QTY: number,
    public PRICE_NET: number,
    public PRICE_BRU: number,
    public SCHEDULED_ARRIVAL: string,
    public SUPPLIED_QTY: number,
    public WAREHOUSE: string,
    public ID: number
  ) {}
}
