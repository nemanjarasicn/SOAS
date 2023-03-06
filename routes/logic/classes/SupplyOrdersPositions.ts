import {
  SupplyOrdersPositionsDataInterface,
  SupplyOrdersPositionsInterface
} from "./interfaces/SupplyOrdersPositionsInterface";

export class SupplyOrdersPositions implements SupplyOrdersPositionsInterface {
  _supplyOrdersPositionsId: number;
  _supplyOrdersPositionsProvidersOrder: string;
  _supplyOrdersPositionsItmnum: string;
  _supplyOrdersPositionsOrderQty: number;
  _supplyOrdersPositionsPriceNet: number;
  _supplyOrdersPositionsPriceBru: number;
  _supplyOrdersPositionsScheduledArrival: string;
  _supplyOrdersPositionsSuppliedQty: number;
  _supplyOrdersPositionsWarehouse: string;

  constructor(supplyOrdersPositionsData: SupplyOrdersPositionsDataInterface) {
    this._supplyOrdersPositionsId = supplyOrdersPositionsData.ID;
    this._supplyOrdersPositionsProvidersOrder = supplyOrdersPositionsData.PROVIDERS_ORDER;
    this._supplyOrdersPositionsItmnum = supplyOrdersPositionsData.ITMNUM;
    this._supplyOrdersPositionsOrderQty = supplyOrdersPositionsData.ORDER_QTY;
    this._supplyOrdersPositionsPriceNet = supplyOrdersPositionsData.PRICE_NET;
    this._supplyOrdersPositionsPriceBru = supplyOrdersPositionsData.PRICE_BRU;
    this._supplyOrdersPositionsScheduledArrival = supplyOrdersPositionsData.SCHEDULED_ARRIVAL;
    this._supplyOrdersPositionsSuppliedQty = supplyOrdersPositionsData.SUPPLIED_QTY;
    this._supplyOrdersPositionsWarehouse = supplyOrdersPositionsData.WAREHOUSE;
  }

  get supplyOrdersData(): SupplyOrdersPositionsDataInterface {
    return {
      ID: this._supplyOrdersPositionsId,
      PROVIDERS_ORDER: this._supplyOrdersPositionsProvidersOrder,
      ITMNUM: this._supplyOrdersPositionsItmnum,
      ORDER_QTY: this._supplyOrdersPositionsOrderQty,
      PRICE_NET: this._supplyOrdersPositionsPriceNet,
      PRICE_BRU: this._supplyOrdersPositionsPriceBru,
      SCHEDULED_ARRIVAL: this._supplyOrdersPositionsScheduledArrival,
      SUPPLIED_QTY: this._supplyOrdersPositionsSuppliedQty,
      WAREHOUSE: this._supplyOrdersPositionsWarehouse
    };
  }

  get supplyOrdersPositionsId(): number {
    return this._supplyOrdersPositionsId;
  }

  set supplyOrdersPositionsId(value: number) {
    this._supplyOrdersPositionsId = value;
  }

  get supplyOrdersPositionsProvidersOrder(): string {
    return this._supplyOrdersPositionsProvidersOrder;
  }

  set supplyOrdersPositionsProvidersOrder(value: string) {
    this._supplyOrdersPositionsProvidersOrder = value;
  }

  get supplyOrdersPositionsItmnum(): string {
    return this._supplyOrdersPositionsItmnum;
  }

  set supplyOrdersPositionsItmnum(value: string) {
    this._supplyOrdersPositionsItmnum = value;
  }

  get supplyOrdersPositionsOrderQty(): number {
    return this._supplyOrdersPositionsOrderQty;
  }

  set supplyOrdersPositionsOrderQty(value: number) {
    this._supplyOrdersPositionsOrderQty = value;
  }

  get supplyOrdersPositionsPriceNet(): number {
    return this._supplyOrdersPositionsPriceNet;
  }

  set supplyOrdersPositionsPriceNet(value: number) {
    this._supplyOrdersPositionsPriceNet = value;
  }

  get supplyOrdersPositionsPriceBru(): number {
    return this._supplyOrdersPositionsPriceBru;
  }

  set supplyOrdersPositionsPriceBru(value: number) {
    this._supplyOrdersPositionsPriceBru = value;
  }

  get supplyOrdersPositionsScheduledArrival(): string {
    return this._supplyOrdersPositionsScheduledArrival;
  }

  set supplyOrdersPositionsScheduledArrival(value: string) {
    this._supplyOrdersPositionsScheduledArrival = value;
  }

  get supplyOrdersPositionsSuppliedQty(): number {
    return this._supplyOrdersPositionsSuppliedQty;
  }

  set supplyOrdersPositionsSuppliedQty(value: number) {
    this._supplyOrdersPositionsSuppliedQty = value;
  }

  get supplyOrdersPositionsWarehouse(): string {
    return this._supplyOrdersPositionsWarehouse;
  }

  set supplyOrdersPositionsWarehouse(value: string) {
    this._supplyOrdersPositionsWarehouse = value;
  }
}
