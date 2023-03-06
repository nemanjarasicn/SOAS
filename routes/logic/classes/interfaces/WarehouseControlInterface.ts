import {WarehouseReservationCacheInterface} from './WarehouseReservationCacheInterface';
import {WarehousingInterface} from './WarehousingInterface';
import {constants} from '../../constants/constants';

export interface WarehouseControlInterface {

    /**
     * Once the interface knows how many pieces need to be reserved/dereserved from a storage place, it writes all
     * reservations into WAREHOUSE_RESERVATION_CACHE / deletes all reservations from WAREHOUSE_RESERVATION_CACHE for a
     * given order. After doing so, this function will also update WAREHOUSING.RESERVED, so both tables contain the
     * exact same information about the reservations. This is redundant, but useful for future evaluations.
     * alignWarehouseReservations() can represent 2 functions (one for reservation and one for dereservation) or
     * use a boolean switch to define each use case.
     */
    // @ts-ignore
    alignWarehouseReservations(usecaseType: constants.WH_CTRL_USE_CASE_TYPES,
                               warehouseReservationCacheItems: WarehouseReservationCacheInterface[],
                               warehousingItems: WarehousingInterface[]): Promise<{}>;

    /**
     * Checks the Warehousing table to get the batches and storage places for an article in a given quantity
     * (can result in multiple storage places if taking the full quantity from a single batch is impossible.
     * make sure to always use up the oldest batch first). Once the function gets a set of batches and locations,
     * it will call alignWarehouseReservations() to insert the cache data and update the Warehousing table,
     * so future requests against the same article will provide the correct data.
     */
    // orderPositionsId: number, deliveryNotesPositionsId: null|number,
    reserveStock(orderNumber: string, warehouseReservationCacheItem: WarehouseReservationCacheInterface): Promise<{}>;

    /**
     * takes in an order number as an argument and sums up all reservations an order has in WAREHOUSE_RESERVATION_CACHE.
     * Then delete all entries and decrement WAREHOUSING.RESERVED by executing alignWarehouseReservations().
     */
    dereserveStock(orderNumber: string, warehouseReservationCacheItem: WarehouseReservationCacheInterface): Promise<{}>;

    /**
     * updates the stock on 2 given storage places and batches; one to increment, one to decrement a given quantity.
     */
    moveStock(fromWarehousingId: number, toWarehousingId: number, quantity: number): Promise<{}>;

    /**
     * Checks all reservations that are currently in WAREHOUSE_RESERVATION_CACHE. Takes every row and calls
     * alignWarehouseReservations() for dereservations, then reduces the physical stock of the storage place.
     * This function will be used in a batch process that runs every day and cleans up the reservations.
     * [Additionally we might want to have a history table where we can then store every moving action in the warehouse.
     * So when postStock() is called, it will also write into another table to say what it has done and when.]
     */
    postStock(warehouseReservationCacheItem: WarehouseReservationCacheInterface, warehousingItem: WarehousingInterface):
        Promise<{}>;
}
