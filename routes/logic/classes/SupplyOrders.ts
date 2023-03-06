import {
  SupplyOrdersDataInterface,
  SupplyOrdersInterface,
} from "./interfaces/SupplyOrdersInterface";

export class SupplyOrders implements SupplyOrdersInterface {
  supplyOrderProvidersOrder: string;
  supplyOrdersProvider: string;
  supplyOrderClientDelivery: string;
  supplyOrderClientInvoice: string;
  supplyOrderAmountNet: number;
  supplyOrderAmountBru: number;
  supplyOrderRef: string;
  supplyOrderCurrency: number;
  supplyOrderShippingCosts: number;
  supplyOrderWarehouse: string;
  supplyOrderOrdersDate: string;
  supplyOrderInterCompany: number;
  supplyOrderId: number;

  constructor(supplyOrdersData: SupplyOrdersDataInterface) {
    this.supplyOrderProvidersOrder = supplyOrdersData.PROVIDERS_ORDER;
    this.supplyOrdersProvider = supplyOrdersData.PROVIDER;
    this.supplyOrderClientDelivery = supplyOrdersData.CLIENT_DELIVERY;
    this.supplyOrderClientInvoice = supplyOrdersData.CLIENT_INVOICE;
    this.supplyOrderAmountNet = supplyOrdersData.ORDERAMOUNT_NET;
    this.supplyOrderAmountBru = supplyOrdersData.ORDERAMOUNT_BRU;
    this.supplyOrderRef = supplyOrdersData.ORDERREF;
    this.supplyOrderCurrency = supplyOrdersData.CURRENCY;
    this.supplyOrderShippingCosts = supplyOrdersData.SHIPPING_COSTS;
    this.supplyOrderWarehouse = supplyOrdersData.WAREHOUSE;
    this.supplyOrderOrdersDate = supplyOrdersData.ORDERS_DATE;
    this.supplyOrderInterCompany = supplyOrdersData.INTERCOMPANY;
    this.supplyOrderId = supplyOrdersData.ID;
  }

  get supplyOrdersData(): SupplyOrdersDataInterface {
    return {
      PROVIDERS_ORDER: this.supplyOrderProvidersOrder,
      PROVIDER: this.supplyOrdersProvider,
      CLIENT_DELIVERY: this.supplyOrderClientDelivery,
      CLIENT_INVOICE: this.supplyOrderClientInvoice,
      ORDERAMOUNT_NET: this.supplyOrderAmountNet,
      ORDERAMOUNT_BRU: this.supplyOrderAmountBru,
      ORDERREF: this.supplyOrderRef,
      CURRENCY: this.supplyOrderCurrency,
      SHIPPING_COSTS: this.supplyOrderShippingCosts,
      WAREHOUSE: this.supplyOrderWarehouse,
      ORDERS_DATE: this.supplyOrderOrdersDate,
      INTERCOMPANY: this.supplyOrderInterCompany,
      ID: this.supplyOrderId,
    };
  }

  get supplyOrdersProvidersOrder(): string {
    return this.supplyOrderProvidersOrder;
  }

  set supplyOrdersProvidersOrder(value: string) {
    this.supplyOrderProvidersOrder = value;
  }

  get supplyOrdersProviders(): string {
    return this.supplyOrdersProvider;
  }

  set supplyOrdersProviders(value: string) {
    this.supplyOrdersProvider = value;
  }

  get supplyOrdersClientDelivery(): string {
    return this.supplyOrderClientDelivery;
  }

  set supplyOrdersClientDelivery(value: string) {
    this.supplyOrderClientDelivery = value;
  }

  get supplyOrdersClientInvoice(): string {
    return this.supplyOrderClientInvoice;
  }

  set supplyOrdersClientInvoice(value: string) {
    this.supplyOrderClientInvoice = value;
  }

  get supplyOrdersAmountNet(): number {
    return this.supplyOrderAmountNet;
  }

  set supplyOrdersAmountNet(value: number) {
    this.supplyOrderAmountNet = value;
  }

  get supplyOrdersAmountBru(): number {
    return this.supplyOrderAmountBru;
  }

  set supplyOrdersAmountBru(value: number) {
    this.supplyOrderAmountBru = value;
  }

  get supplyOrdersRef(): string {
    return this.supplyOrderRef;
  }

  set supplyOrdersRef(value: string) {
    this.supplyOrderRef = value;
  }

  get supplyOrdersCurrency(): number {
    return this.supplyOrderCurrency;
  }

  set supplyOrdersCurrency(value: number) {
    this.supplyOrderCurrency = value;
  }

  get supplyOrdersShippingCosts(): number {
    return this.supplyOrderShippingCosts;
  }

  set supplyOrdersShippingCosts(value: number) {
    this.supplyOrderShippingCosts = value;
  }

  get supplyOrdersWarehouse(): string {
    return this.supplyOrderWarehouse;
  }

  set supplyOrdersWarehouse(value: string) {
    this.supplyOrderWarehouse = value;
  }

  get supplyOrdersOrdersDate(): string {
    return this.supplyOrderOrdersDate;
  }

  set supplyOrdersOrdersDate(value: string) {
    this.supplyOrderOrdersDate = value;
  }

  get supplyOrdersInterCompany(): number {
    return this.supplyOrderInterCompany;
  }

  set supplyOrdersInterCompany(value: number) {
    this.supplyOrderInterCompany = value;
  }

  get supplyOrdersId(): number {
    return this.supplyOrderId;
  }

  set supplyOrdersId(value: number) {
    this.supplyOrderId = value;
  }
}
