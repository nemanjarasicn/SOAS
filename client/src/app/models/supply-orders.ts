export class SupplyOrders {
  constructor(
    public PROVIDERS_ORDER: string,
    public PROVIDER: string,
    public CLIENT_DELIVERY: string,
    public CLIENT_INVOICE: string,
    public ORDERAMOUNT_NET: number,
    public ORDERAMOUNT_BRU: number,
    public ORDERREF: string,
    public CURRENCY: number,
    public SHIPPING_COSTS: number,
    public WAREHOUSE: string,
    public ORDERS_DATE: string,
    public INTERCOMPANY: number,
    public ID: number
  ) {}
}
