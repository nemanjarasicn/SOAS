/* AUTHOR: Ronny Brandt */
/* Update: Andreas Lening */

import * as sql from 'mssql';
import * as mssqlCall from './../mssql_call'
import {constants} from '../constants/constants';
import {WarehouseReservationCacheInterface} from './interfaces/WarehouseReservationCacheInterface';
import {WarehouseControlInterface} from './interfaces/WarehouseControlInterface';
import {WarehousingInterface} from './interfaces/WarehousingInterface';
import {getDateForQuery} from '../sql/date/Date';

export class WarehouseControl implements WarehouseControlInterface {

    /**
     * align warehouse reservations. reserve or dereserve given items on WAREHOUSE_RESERVATION_CACHE.
     *
     * @param usecaseType - reserved/dereserved - a string with type constants.WH_CTRL_USE_CASE_TYPES
     * @param warehouseReservationCacheItems - WarehouseReservationCacheInterface objects array
     * @param warehousingItems - WarehousingInterface objects array
     */
    async alignWarehouseReservations(
        usecaseType: string,
        warehouseReservationCacheItems: WarehouseReservationCacheInterface[],
        warehousingItems: WarehousingInterface[]
    ): Promise<{}> {
        let typeError: boolean = false;
        let orderNumber: string = '';
        // Step 1: reserve or dereserve items

        switch (usecaseType) {
            case(constants.WH_CTRL_USE_CASE_TYPES.RESERVED) :
                for (let whRCItem in warehouseReservationCacheItems) {
                    // check if same item(s) already available in WAREHOUSE_RESERVATION_CACHE
                    // TODO: add interface
                    let checkItems: any = await this.checkWarehouseReservationCache(
                        warehouseReservationCacheItems[whRCItem].warehouseRCDocumentNumber,
                        warehouseReservationCacheItems[whRCItem].warehouseRCItemNumber,
                        warehouseReservationCacheItems[whRCItem].warehouseRCWarehousingId,
                        warehouseReservationCacheItems[whRCItem].warehouseRCOrdersPositionsId
                    );
                    console.log('checkItems: ', checkItems);
                    if (checkItems && checkItems[0] && checkItems[0]['IDS_NUMBER'] > 0) {
                        await this.updateWarehouseReservationCache(
                            orderNumber,
                            warehouseReservationCacheItems[whRCItem]
                        );
                    } else {
                        await this.insertWarehouseReservationCache(
                            orderNumber,
                            warehouseReservationCacheItems[whRCItem]
                        );
                    }
                }
                break;
            case(constants.WH_CTRL_USE_CASE_TYPES.DERESERVED) :
                for (let whRCItem in warehouseReservationCacheItems) {
                    await this.deleteFromWarehouseReservationCache(
                        orderNumber,
                        warehouseReservationCacheItems[whRCItem]
                    );
                }
                break;
            default :
                console.log('ERROR: undefined usecaseType! ', usecaseType);
                typeError = true;
                break;
        }
        // Step 2: update WAREHOUSING.RESERVED
        if (!typeError) {
            for (let whItem in warehousingItems) {
                await this.updateWarehousingReserved(usecaseType, warehousingItems[whItem]);
            }
        }
        return {result: typeError};

        // Step 3: update ORDERS_POSITIONS
        for (let whRCItem in warehouseReservationCacheItems) {
            await this.updateOrdersPositions(
                warehouseReservationCacheItems[whRCItem].warehouseRCOrdersPositionsId,
                warehouseReservationCacheItems[whRCItem].warehouseRCAssignedQuantity
            )
        }
    }

    /**
     * reserve stock on WAREHOUSE_RESERVATION_CACHE
     *
     * @param orderNumber
     * @param warehouseReservationCacheItem
     */
    async reserveStock(
        orderNumber: string,
        warehouseReservationCacheItem: WarehouseReservationCacheInterface
    ): Promise<{}> {

        //1. Überprüfung
        //ToDo: Add check service

        //2. align warehouse reservations
        return await this.alignWarehouseReservations(
            constants.WH_CTRL_USE_CASE_TYPES.RESERVED,
            [warehouseReservationCacheItem],
            []
        );
    }

    /**
     * dereserve stock on WAREHOUSE_RESERVATION_CACHE
     *
     * @param orderNumber
     * @param warehouseReservationCacheItem
     */
    async dereserveStock(orderNumber: string,
                         warehouseReservationCacheItem: WarehouseReservationCacheInterface): Promise<{}> {
        //1. Löschung
        let fullWRCacheItems: WarehouseReservationCacheInterface[] =
            await this.loadFromWarehouseReservationCache(warehouseReservationCacheItem);
        if (fullWRCacheItems && fullWRCacheItems.length > 0) {
            let results: [] = [];
            for(let fullWRCItem in fullWRCacheItems) {
                let warehousingItem: WarehousingInterface;
                let fullWarehousingItem: any = // @ts-ignore
                    await this.loadFromWarehousing(fullWRCacheItems[fullWRCItem].WAREHOUSING_ID);
                // if WAREHOUSING_ID is null => WAREHOUSING_MANAGED item => warehousingItem is undefined
                if (fullWarehousingItem && fullWarehousingItem.length > 0) {
                    warehousingItem = {
                        warehousingId: fullWarehousingItem[0].ID,
                        warehousingLocation: fullWarehousingItem[0].WHLOC, // @ts-ignore
                        warehousingItemNumber: fullWRCacheItems[fullWRCItem].ITMNUM, // @ts-ignore
                        warehousingBatchNumber: fullWRCacheItems[fullWRCItem].LOT, // @ts-ignore
                        warehousingStorageLocation: fullWRCacheItems[fullWRCItem].LOC,
                        warehousingStatusPosition: fullWarehousingItem[0].STATUS_POS,
                        warehousingQuantity: fullWarehousingItem[0].QTY, // @ts-ignore
                        warehousingReserved: fullWRCacheItems[fullWRCItem].ASSIGNED_QTY,
                        warehousingUpdateLocation: getDateForQuery(constants.LOCALE),
                    };
                }
                //2. align warehouse reservations
                // @ts-ignore
                results.push(await this.alignWarehouseReservations(constants.WH_CTRL_USE_CASE_TYPES.DERESERVED, // @ts-ignore
                    [warehouseReservationCacheItem], [warehousingItem]));
            }
            return results;
        } else {
            console.log("ERROR: WarehouseReservationCacheItem was not found! ", warehouseReservationCacheItem);
        }
        return false;
    }

    /**
     * updates the stock on 2 given storage places and batches
     *
     * @param fromWarehousingId
     * @param toWarehousingId
     * @param quantity
     */
    async moveStock(fromWarehousingId: number, toWarehousingId: number, quantity: number): Promise<{}> {
        // one to increment, one to decrement a given quantity.
        // 1. update 'to' item
        // @ts-ignore
        let warehousingToItem: WarehousingInterface = {
            warehousingId: toWarehousingId,
            warehousingQuantity: quantity,
            warehousingUpdateLocation: getDateForQuery(constants.LOCALE),
        };
        await this.updateWarehousingQty(constants.WH_CTRL_USE_CASE_TYPES.RESERVED, warehousingToItem); // + 1
        // 2. update 'from' item
        // @ts-ignore
        let warehousingFromItem: WarehousingInterface = {
            warehousingId: fromWarehousingId,
            warehousingQuantity: quantity,
            warehousingUpdateLocation: getDateForQuery(constants.LOCALE),
        };
        return await this.updateWarehousingQty(constants.WH_CTRL_USE_CASE_TYPES.DERESERVED, warehousingFromItem); // - 1
    }

    /**
     * update warehouse to-location and delete from-location (because qty = 1)
     *
     * @param fromWarehousingId
     * @param toWarehousingId
     * @param quantity
     */
    async moveAndDeleteStock(fromWarehousingId: number, toWarehousingId: number, quantity: number): Promise<{}> {
        // 1. update 'to' item
        // @ts-ignore
        let warehousingToItem: WarehousingInterface = {
            warehousingId: toWarehousingId,
            warehousingQuantity: quantity,
            warehousingUpdateLocation: getDateForQuery(constants.LOCALE),
        };
        await this.updateWarehousingQty(constants.WH_CTRL_USE_CASE_TYPES.RESERVED, warehousingToItem); // + 1
        // 2. delete 'from' item
        // @ts-ignore
        let warehousingFromItem: WarehousingInterface = {
            warehousingId: fromWarehousingId,
            warehousingQuantity: 0,
            warehousingUpdateLocation: '',
        };
        return await this.deleteFromWarehousing(warehousingFromItem);
    }

    /**
     * create new warehouse to-location and update from-location
     *
     * @param fromWarehousingId
     * @param warehousingToItem
     * @param quantity
     */
    async moveAndCreateStock(fromWarehousingId: number,  warehousingToItem: WarehousingInterface, quantity: number):
        Promise<{}> {
        // 1. insert 'to' item
        await this.insertWarehousing(warehousingToItem);
        // 2. update 'from' item
        // @ts-ignore
        let warehousingFromItem: WarehousingInterface = {
            warehousingId: fromWarehousingId,
            warehousingQuantity: quantity,
            warehousingUpdateLocation: getDateForQuery(constants.LOCALE),
        };
        return await this.updateWarehousingQty(constants.WH_CTRL_USE_CASE_TYPES.DERESERVED, warehousingFromItem); // - 1
    }

    /**
     * replace warehouse from-location with to-location (because both qty's are the same )
     *
     * @param fromWarehousingId
     * @param storageLocation
     */
    async replaceStock(fromWarehousingId: number, storageLocation: string): Promise<{}> {
        // 1. updates 'from' item with 'to' LOC value
        // @ts-ignore
        let warehousingFromItem: WarehousingInterface = {
            warehousingId: fromWarehousingId,
            warehousingStorageLocation: storageLocation,
            warehousingUpdateLocation: getDateForQuery(constants.LOCALE),
        };
        // @ts-ignore
        return await this.updateWarehousingLoc(warehousingFromItem);
    }

    /**
     * reduces the physical stock of the storage place
     */
    async postStock(warehouseReservationCacheItem: WarehouseReservationCacheInterface,
                    warehousingItem: WarehousingInterface): Promise<{}> {
        // Step 1: Delete given cache item from WAREHOUSE_RESERVATION_CACHE table
        await this.deleteFromWarehouseReservationCache('DLV', warehouseReservationCacheItem);
        if (warehousingItem) {
            // Step 2: Reduces the physical stock of the storage place at WAREHOUSING
            // Sub-step 2.1: Prepare WAREHOUSING object by adding to reduce quantity to QTY and RESERVED fields
            // @ts-ignore
            let warehousingToReduceItem: WarehousingInterface = {  // @ts-ignore
                warehousingId: warehouseReservationCacheItem.warehouseRCWarehousingId, // @ts-ignore
                warehousingQuantity: warehouseReservationCacheItem.warehouseRCAssignedQuantity, // @ts-ignore
                warehousingReserved: warehouseReservationCacheItem.warehouseRCAssignedQuantity,
                warehousingItemNumber: warehouseReservationCacheItem.warehouseRCItemNumber,
                warehousingUpdateLocation: getDateForQuery(constants.LOCALE),
            };
            // Sub-step 2.2: Reduce RESERVED field in WAREHOUSING table
            await this.updateWarehousingReserved(constants.WH_CTRL_USE_CASE_TYPES.DERESERVED, warehousingToReduceItem); // - 1
            // Sub-step 2.3: Reduce QTY field in WAREHOUSING table
            await this.updateWarehousingQty(constants.WH_CTRL_USE_CASE_TYPES.DERESERVED, warehousingToReduceItem); // - 1
            // Check here if currently reduced QTY and RESERVED are === 0, if so,
            // check if it is used by another items in Cache and if not, then delete this WAREHOUSING item
            return await this.checkForEmptyWarehousingItem(warehousingToReduceItem);
        } else {
            console.log("loadWHData is empty for: ", warehouseReservationCacheItem);
            return {};
        }
    }


    /**************************************************************************************
     * QUERY FUNCTIONS
     *************************************************************************************/

    /**
     * insert one item into WAREHOUSE_RESERVATION_CACHE
     *
     * @param orderNumber
     * @param whRCItem
     */
    async insertWarehouseReservationCache(orderNumber: string, whRCItem: WarehouseReservationCacheInterface) {
        let inputParamsArray: {name: string, type: any, value: any}[] = [
            {name: 'DOCUMENT_NUMBER', type: sql.VarChar, value: whRCItem.warehouseRCDocumentNumber},
            {name: 'ITMNUM', type: sql.VarChar, value: whRCItem.warehouseRCItemNumber},
            {name: 'ASSIGNED_QTY', type: sql.Int, value: whRCItem.warehouseRCAssignedQuantity},
            {name: 'LOT', type: sql.VarChar, value: whRCItem.warehouseRCBatchNumber ?
                    whRCItem.warehouseRCBatchNumber : null},
            {name: 'LOC', type: sql.VarChar, value: whRCItem.warehouseRCStorageLocation ?
                    whRCItem.warehouseRCStorageLocation : null},
            {name: 'WAREHOUSE', type: sql.VarChar, value: whRCItem.warehouseRCWarehouse ?
                    whRCItem.warehouseRCWarehouse : null},
            {name: 'POSITION_ID', type: sql.Int, value: whRCItem.warehouseRCPositionId},
            {name: 'ASSIGNMENT_DATE', type: sql.SmallDateTime, value: new Date(whRCItem.warehouseRCAssignmentDate)},
            {name: 'WAREHOUSING_ID', type: sql.Int, value: whRCItem.warehouseRCWarehousingId ?
                    whRCItem.warehouseRCWarehousingId : null},
            {name: 'ORDERS_POSITIONS_ID', type: sql.Int, value: whRCItem.warehouseRCOrdersPositionsId},
            {name: 'DELIVERY_NOTES_POSITIONS_ID', type: sql.Int, value: whRCItem.warehouseRCDeliveryNotesPositionsId ?
                    whRCItem.warehouseRCDeliveryNotesPositionsId : null}];
        let insertWRCQuery: string = `INSERT INTO ` + constants.DB_TABLE_PREFIX + `WAREHOUSE_RESERVATION_CACHE 
            (DOCUMENT_NUMBER,ITMNUM,ASSIGNED_QTY,LOT,LOC,WAREHOUSE,POSITION_ID,ASSIGNMENT_DATE,WAREHOUSING_ID,
            ORDERS_POSITIONS_ID,DELIVERY_NOTES_POSITIONS_ID) VALUES 
        (@DOCUMENT_NUMBER,@ITMNUM,@ASSIGNED_QTY,@LOT,@LOC,@WAREHOUSE,@POSITION_ID,@ASSIGNMENT_DATE,
            @WAREHOUSING_ID,@ORDERS_POSITIONS_ID,@DELIVERY_NOTES_POSITIONS_ID)`;
        console.log('inputParamsArray: ', inputParamsArray);
        console.log("New insertWRCQuery: ", insertWRCQuery);
        return await mssqlCall.mssqlCallEscaped(inputParamsArray, insertWRCQuery);
    }

    /**
     * update WAREHOUSE_RESERVATION_CACHE. set DELIVERY_NOTES_POSITIONS_ID.
     *
     * @param orderNumber
     * @param whRCItem
     */
    async updateWarehouseReservationCache(orderNumber: string, whRCItem: WarehouseReservationCacheInterface) {
        let inputParamsArray: {name: string, type: any, value: any}[] = [
            {name: 'DOCUMENT_NUMBER', type: sql.VarChar, value: whRCItem.warehouseRCDocumentNumber},
            {name: 'ASSIGNED_QTY', type: sql.Int, value: whRCItem.warehouseRCAssignedQuantity},
            {name: 'LOT', type: sql.VarChar, value: whRCItem.warehouseRCBatchNumber},
            {name: 'LOC', type: sql.VarChar, value: whRCItem.warehouseRCStorageLocation},
            {name: 'WAREHOUSE', type: sql.VarChar, value: whRCItem.warehouseRCWarehouse},
            {name: 'POSITION_ID', type: sql.Int, value: whRCItem.warehouseRCPositionId},
            {name: 'ASSIGNMENT_DATE', type: sql.SmallDateTime, value: new Date(whRCItem.warehouseRCAssignmentDate)},
            {name: 'WAREHOUSING_ID', type: sql.Int, value: whRCItem.warehouseRCWarehousingId},
            {name: 'ORDERS_POSITIONS_ID', type: sql.Int, value: whRCItem.warehouseRCOrdersPositionsId},
            {name: 'DELIVERY_NOTES_POSITIONS_ID', type: sql.Int, value: whRCItem.warehouseRCDeliveryNotesPositionsId}];
        // Change on 20220106 by AL: ASSIGNED_QTY = ASSIGNED_QTY + @ASSIGNED_QTY
        let updateWRCQuery: string = `UPDATE ` + constants.DB_TABLE_PREFIX + `WAREHOUSE_RESERVATION_CACHE SET 
        ASSIGNED_QTY = ASSIGNED_QTY + @ASSIGNED_QTY, LOT = @LOT, LOC = @LOC, WAREHOUSE = @WAREHOUSE, 
        POSITION_ID = @POSITION_ID, ASSIGNMENT_DATE = @ASSIGNMENT_DATE, DELIVERY_NOTES_POSITIONS_ID ` +
            (whRCItem.warehouseRCDeliveryNotesPositionsId ? `= @DELIVERY_NOTES_POSITIONS_ID ` : `= NULL `) +
        `WHERE DOCUMENT_NUMBER = @DOCUMENT_NUMBER AND WAREHOUSING_ID ` +
            (whRCItem.warehouseRCWarehousingId ? `= @WAREHOUSING_ID ` : `IS NULL `) +
        `AND ORDERS_POSITIONS_ID = @ORDERS_POSITIONS_ID`;
        console.log("New updateWRCQuery: ", updateWRCQuery);
        console.log('inputParamsArray: ', inputParamsArray);
        return await mssqlCall.mssqlCallEscaped(inputParamsArray, updateWRCQuery);
    }

    /**
     * reset DELIVERY_NOTES_POSITIONS_ID to NULL in WAREHOUSE_RESERVATION_CACHE
     *
     * @param orderNumber
     * @param whRCItem
     */
    async resetWarehouseReservationCache(orderNumber: string, whRCItem: WarehouseReservationCacheInterface) {
        let inputParamsArray: {name: string, type: any, value: any}[] = [
            {name: 'DELIVERY_NOTES_POSITIONS_ID', type: sql.Int, value: whRCItem.warehouseRCDeliveryNotesPositionsId},
            {name: 'DOCUMENT_NUMBER', type: sql.VarChar, value: whRCItem.warehouseRCDocumentNumber},
            {name: 'ORDERS_POSITIONS_ID', type: sql.Int, value: whRCItem.warehouseRCOrdersPositionsId}];
        let resetWRCQuery: string = `UPDATE ` + constants.DB_TABLE_PREFIX + `WAREHOUSE_RESERVATION_CACHE 
        SET DELIVERY_NOTES_POSITIONS_ID = NULL 
        WHERE DOCUMENT_NUMBER = @DOCUMENT_NUMBER AND ORDERS_POSITIONS_ID = @ORDERS_POSITIONS_ID AND 
        DELIVERY_NOTES_POSITIONS_ID ` + (whRCItem.warehouseRCDeliveryNotesPositionsId ?
        `= @DELIVERY_NOTES_POSITIONS_ID` : `IS NULL`);
        console.log("New resetWRCQuery: ", resetWRCQuery);
        return await mssqlCall.mssqlCallEscaped(inputParamsArray, resetWRCQuery);
    }

    /**
     * set DELIVERY_NOTES_POSITIONS_ID at WAREHOUSE_RESERVATION_CACHE
     *
     * @param dlvPosId
     * @param whRCItem
     */
    async setDLVPosIdWarehouseReservationCache(dlvPosId: number, whRCItem: WarehouseReservationCacheInterface) {
        let inputParamsArray: {name: string, type: any, value: any}[] = [
            {name: 'DELIVERY_NOTES_POSITIONS_ID', type: sql.Int, value: dlvPosId},
            {name: 'DOCUMENT_NUMBER', type: sql.VarChar, value: whRCItem.warehouseRCDocumentNumber},
            {name: 'ORDERS_POSITIONS_ID', type: sql.Int, value: whRCItem.warehouseRCOrdersPositionsId}];
        let setWRCQuery: string = `UPDATE ` + constants.DB_TABLE_PREFIX + `WAREHOUSE_RESERVATION_CACHE SET 
        DELIVERY_NOTES_POSITIONS_ID = @DELIVERY_NOTES_POSITIONS_ID 
        WHERE DOCUMENT_NUMBER = @DOCUMENT_NUMBER AND ORDERS_POSITIONS_ID = @ORDERS_POSITIONS_ID AND 
        DELIVERY_NOTES_POSITIONS_ID IS NULL`;
        console.log("New setWRCQuery: ", setWRCQuery);
        return await mssqlCall.mssqlCallEscaped(inputParamsArray, setWRCQuery);
    }

    /**
     * delete one item from WAREHOUSE_RESERVATION_CACHE table
     * ! WAREHOUSE_MANAGED items doesn't have warehouse id
     *
     * @param delType - if 'ORD', then ID IS NULL. if 'DLV', then ID is number.
     * @param whRCItem
     */
    async deleteFromWarehouseReservationCache(delType: string, whRCItem: WarehouseReservationCacheInterface) {
        let inputParamsArray: { name: string, type: any, value: any }[] = [
            {name: 'DOCUMENT_NUMBER', type: sql.VarChar, value: whRCItem.warehouseRCDocumentNumber},
            {name: 'ITMNUM', type: sql.VarChar, value: whRCItem.warehouseRCItemNumber},
            {name: 'POSITION_ID', type: sql.Int, value: whRCItem.warehouseRCPositionId},
            {name: 'ORDERS_POSITIONS_ID', type: sql.Int, value: whRCItem.warehouseRCOrdersPositionsId},
            {name: 'DELIVERY_NOTES_POSITIONS_ID', type: sql.Int, value: whRCItem.warehouseRCDeliveryNotesPositionsId}];
        let delWRCQuery: string = `DELETE FROM ` + constants.DB_TABLE_PREFIX + `WAREHOUSE_RESERVATION_CACHE 
        WHERE DOCUMENT_NUMBER = @DOCUMENT_NUMBER AND ITMNUM = @ITMNUM AND POSITION_ID = @POSITION_ID AND 
        ORDERS_POSITIONS_ID = @ORDERS_POSITIONS_ID AND DELIVERY_NOTES_POSITIONS_ID ` +
            ((delType === 'DLV') ? (whRCItem.warehouseRCDeliveryNotesPositionsId ?
                `= @DELIVERY_NOTES_POSITIONS_ID` : null) : (`IS NULL`));
        console.log("New delWRCQuery: ", delWRCQuery);
        return await mssqlCall.mssqlCallEscaped(inputParamsArray, delWRCQuery);
    }

    /**
     * load item(s) from WAREHOUSE_RESERVATION_CACHE
     *
     * @param warehouseReservationCacheItem
     */
    async loadFromWarehouseReservationCache(warehouseReservationCacheItem: WarehouseReservationCacheInterface) {
        let inputParamsArray: {name: string, type: any, value: any}[] = [
            {name: 'DOCUMENT_NUMBER', type: sql.VarChar, value: warehouseReservationCacheItem.warehouseRCDocumentNumber},
            {name: 'ITMNUM', type: sql.VarChar, value: warehouseReservationCacheItem.warehouseRCItemNumber},
            {name: 'POSITION_ID', type: sql.Int, value: warehouseReservationCacheItem.warehouseRCPositionId},
            {name: 'ORDERS_POSITIONS_ID', type: sql.Int, value: warehouseReservationCacheItem.warehouseRCOrdersPositionsId}];
        let loadFWRCQuery: string = `SELECT * FROM ` + constants.DB_TABLE_PREFIX + `WAREHOUSE_RESERVATION_CACHE 
        WHERE DOCUMENT_NUMBER = @DOCUMENT_NUMBER AND ITMNUM = @ITMNUM AND POSITION_ID = @POSITION_ID AND 
        ORDERS_POSITIONS_ID = @ORDERS_POSITIONS_ID`;
        console.log("New loadFWRCQuery: ", loadFWRCQuery);
        return await mssqlCall.mssqlCallEscaped(inputParamsArray, loadFWRCQuery);
    }

    /**
     * load item from WAREHOUSING
     *
     * @param warehousingId
     */
    async loadFromWarehousing(warehousingId: null|number) {
        if (warehousingId) {
            let inputParamsArray: {name: string, type: any, value: any}[] = [
                {name: 'ID', type: sql.Int, value: warehousingId}];
            let loadFWQuery: string = `SELECT * FROM ` + constants.DB_TABLE_PREFIX + `WAREHOUSING WHERE ID = @ID`;
            console.log("New loadFWQuery: ", loadFWQuery);
            return await mssqlCall.mssqlCallEscaped(inputParamsArray, loadFWQuery);
        } else {
            return null;
        }
    }

    /**
     * update warehousing reserved
     *
     * @param usecaseType
     * @param warehousingItem
     */ // @ts-ignore
    async updateWarehousingReserved(usecaseType: constants.WH_CTRL_USE_CASE_TYPES, warehousingItem: WarehousingInterface) {
        if (warehousingItem) {
            let inputParamsArray: {name: string, type: any, value: any}[] = [
                {name: 'ID', type: sql.Int, value: warehousingItem.warehousingId},
                {name: 'ITMNUM', type: sql.VarChar, value: warehousingItem.warehousingItemNumber},
                {name: 'RESERVED', type: sql.Int, value: warehousingItem.warehousingReserved},
                {name: 'UPDATE_LOC', type: sql.SmallDateTime, value: new Date(warehousingItem.warehousingUpdateLocation)}];
            let updateWarehousingReservedQuery: string =
                `UPDATE ` + constants.DB_TABLE_PREFIX + `WAREHOUSING SET RESERVED = RESERVED ` +
                ((usecaseType === constants.WH_CTRL_USE_CASE_TYPES.RESERVED) ? `+` : `-`) +
                ` @RESERVED, UPDATE_LOC = @UPDATE_LOC WHERE ITMNUM = @ITMNUM AND ID = @ID`;
            console.log("New updateWarehousingReservedQuery: ", updateWarehousingReservedQuery);
            return await mssqlCall.mssqlCallEscaped(inputParamsArray, updateWarehousingReservedQuery);
        } else {
            console.log('updateWarehousingReserved: warehousingItem is empty! WAREHOUSE_MANAGED item?');
            return {};
        }
    }

    /**
     * update warehousing QTY
     *
     * @param usecaseType -
     * @param warehousingItem
     */ // @ts-ignore
    async updateWarehousingQty(usecaseType: constants.WH_CTRL_USE_CASE_TYPES, warehousingItem: WarehousingInterface) {
        let inputParamsArray: { name: string, type: any, value: any }[] = [
            {name: 'ID', type: sql.Int, value: warehousingItem.warehousingId},
            {name: 'QTY', type: sql.Int, value: warehousingItem.warehousingQuantity},
            {name: 'UPDATE_LOC', type: sql.SmallDateTime, value: new Date(warehousingItem.warehousingUpdateLocation)}];
        let updateWQuery: string =
            `UPDATE ` + constants.DB_TABLE_PREFIX + `WAREHOUSING SET QTY = QTY ` +
            ((usecaseType === constants.WH_CTRL_USE_CASE_TYPES.RESERVED) ? `+` : `-`) + ` @QTY, 
        UPDATE_LOC = @UPDATE_LOC WHERE ID = @ID`;
        console.log("New updateWarehousingQty updateWQuery: ", updateWQuery);
        return await mssqlCall.mssqlCallEscaped(inputParamsArray, updateWQuery);
    }

    /**
     * Check after reducing if QTY and RESERVED are = 0, if so,
     * check if item is still used in cache by another items and if not, then delete this WAREHOUSING item
     *
     * @param warehousingItem
     */
    async checkForEmptyWarehousingItem(warehousingItem: WarehousingInterface) {
        const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
        // check if item with same WAREHOUSING_ID is used in WAREHOUSE_RESERVATION_CACHE
        let inputParamsArray: { name: string, type: any, value: any }[] = [
            {name: 'ID', type: sql.Int, value: warehousingItem.warehousingId},
            {name: 'QTY', type: sql.Int, value: 0},
            {name: 'RESERVED', type: sql.Int, value: 0}];
        let checkZeroQuery: string = `SELECT * FROM ` + DB_TABLE_PREFIX + `WAREHOUSING WHERE 
        ID = @ID AND QTY = @QTY AND RESERVED = @RESERVED`;
        console.log("New checkZeroQuery: ", checkZeroQuery);
        let zeroItem: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, checkZeroQuery);
        if (zeroItem.length) {
            console.log("checkForEmptyWarehousingItem: Zero item found " + warehousingItem.warehousingId);
            // check if item with same WAREHOUSING_ID is used in WAREHOUSE_RESERVATION_CACHE
            let inputParamsArray: { name: string, type: any, value: any }[] = [
                {name: 'WAREHOUSING_ID', type: sql.Int, value: warehousingItem.warehousingId}];
            let checkCacheQuery: string = `SELECT * FROM ` + DB_TABLE_PREFIX + `WAREHOUSE_RESERVATION_CACHE WHERE 
                WAREHOUSING_ID = @WAREHOUSING_ID`;
            console.log("New checkCacheQuery: ", checkCacheQuery);
            let existsItems: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, checkCacheQuery);
            if (existsItems.length) {
                console.log("checkForEmptyWarehousingItem: Empty item " + warehousingItem.warehousingId +
                    " can't be deleted, because it is used by another item(s): ", existsItems);
                return {};
            } else {
                // 2. delete WAREHOUSE item wit QTY und RESERVED = 0
                console.log("OK - item will be deleted... ", warehousingItem);
                return await this.deleteFromWarehousing(warehousingItem);
            }
        } else {
            console.log("checkForEmptyWarehousingItem: Item not zero " + warehousingItem.warehousingId);
            return {};
        }
    }

    /**
     * update warehousing LOC
     *
     * @param warehousingItem
     */
    async updateWarehousingLoc(warehousingItem: WarehousingInterface) {
        let inputParamsArray: { name: string, type: any, value: any }[] = [
            {name: 'ID', type: sql.Int, value: warehousingItem.warehousingId},
            {name: 'LOC', type: sql.VarChar, value: warehousingItem.warehousingStorageLocation},
            {name: 'UPDATE_LOC', type: sql.SmallDateTime, value: new Date(warehousingItem.warehousingUpdateLocation)}];
        let updateWQuery: string = `UPDATE ` + constants.DB_TABLE_PREFIX + `WAREHOUSING 
        SET LOC = @LOC, UPDATE_LOC = @UPDATE_LOC WHERE ID = @ID`;
        console.log("New updateWarehousingLoc updateWQuery: ", updateWQuery);
        return await mssqlCall.mssqlCallEscaped(inputParamsArray, updateWQuery);
    }

    /**
     * insert one item into WAREHOUSING
     *
     * @param warehousingItem
     */
    async insertWarehousing(warehousingItem: WarehousingInterface) {
        let inputParamsArray: {name: string, type: any, value: any}[] = [
            {name: 'WHLOC', type: sql.VarChar, value: warehousingItem.warehousingLocation},
            {name: 'ITMNUM', type: sql.VarChar, value: warehousingItem.warehousingItemNumber},
            {name: 'LOT', type: sql.VarChar, value: warehousingItem.warehousingBatchNumber},
            {name: 'LOC', type: sql.VarChar, value: warehousingItem.warehousingStorageLocation},
            {name: 'STATUS_POS', type: sql.VarChar, value: warehousingItem.warehousingStatusPosition},
            {name: 'QTY', type: sql.Int, value: warehousingItem.warehousingQuantity},
            {name: 'RESERVED', type: sql.Int, value: warehousingItem.warehousingReserved},
            {name: 'UPDATE_LOC', type: sql.SmallDateTime, value: new Date(warehousingItem.warehousingUpdateLocation)}];
        let insertWQuery: string = `INSERT INTO ` + constants.DB_TABLE_PREFIX + `WAREHOUSING 
            (WHLOC,ITMNUM,LOT,LOC,STATUS_POS,QTY,RESERVED,UPDATE_LOC) VALUES 
            (@WHLOC,@ITMNUM,@LOT,@LOC,@STATUS_POS,@QTY,@RESERVED,@UPDATE_LOC)`;
        console.log("New insertWarehousing: ", insertWQuery);
        return await mssqlCall.mssqlCallEscaped(inputParamsArray, insertWQuery);

    }

    /**
     * deletes warehousing item
     *
     * @param warehousingItem
     */
    async deleteFromWarehousing(warehousingItem: WarehousingInterface) {
        let inputParamsArray: { name: string, type: any, value: any }[] = [
            {name: 'ID', type: sql.Int, value: warehousingItem.warehousingId}];
        let deleteWarehousingQuery: string = `DELETE FROM ` + constants.DB_TABLE_PREFIX + `WAREHOUSING WHERE ID = @ID`;
        console.log("New deleteWarehousingQuery: ", deleteWarehousingQuery);
        return await mssqlCall.mssqlCallEscaped(inputParamsArray, deleteWarehousingQuery);
    }

    /**
     * check if item is available in WAREHOUSE_RESERVATION_CACHE
     *
     * @param documentNumber
     * @param itmnum
     * @param warehousingId
     * @param orderPositionsId
     */
    async checkWarehouseReservationCache(documentNumber: string, itmnum: string, warehousingId: null|number,
                                         orderPositionsId: number) {
        // check if item with same DOCUMENT_NUMBER, WAREHOUSING_ID and ORDERS_POSITIONS_ID available
        // if warehousingId is set, it is problematically, because the order can be changed
        // otherwise it is WAREHOUSE_MANAGED item
        // 20220111 by AL: Added to query 'AND DELIVERY_NOTES_POSITIONS_ID IS NULL' to prevent that the items for
        // which a delivery note has already been created are ignored
        let inputParamsArray: { name: string, type: any, value: any }[] = [
            {name: 'DOCUMENT_NUMBER', type: sql.VarChar, value: documentNumber},
            {name: 'ITMNUM', type: sql.VarChar, value: itmnum},
            {name: 'WAREHOUSING_ID', type: sql.Int, value: warehousingId},
            {name: 'ORDERS_POSITIONS_ID', type: sql.Int, value: orderPositionsId}];
        let checkQuery: string = `SELECT COUNT(ID) AS IDS_NUMBER FROM ` +
            constants.DB_TABLE_PREFIX + `WAREHOUSE_RESERVATION_CACHE WHERE
            DOCUMENT_NUMBER = @DOCUMENT_NUMBER AND 
            ITMNUM = @ITMNUM AND 
            WAREHOUSING_ID ` + (warehousingId ? `= @WAREHOUSING_ID` : `IS NULL`) + ` AND
            ORDERS_POSITIONS_ID = @ORDERS_POSITIONS_ID AND DELIVERY_NOTES_POSITIONS_ID IS NULL`;
        console.log("New checkWarehouseReservationCache: ", checkQuery);
        return await mssqlCall.mssqlCallEscaped(inputParamsArray, checkQuery);
    }

    /**
     * query to check if WAREHOUSING table has inconsistent qty
     * 1: (QTY-RESERVED) is lower 0
     * 2: RESERVED > QTY
     * 3: QTY is lower 0
     * 4: RESERVED is lower 0
     */
    async isWarehousingConsistentQuery() {
        const qty: number = 0;
        const reserved: number = 0;
        const qtyReserved: number = 0;
        let inputParamsArray: { name: string, type: any, value: any }[] = [
            {name: 'QTY', type: sql.Int, value: qty},
            {name: 'RESERVED', type: sql.Int, value: reserved},
            {name: 'QTY_RESERVED', type: sql.Int, value: qtyReserved}];
        let checkQuery: string = `SELECT * FROM ` + constants.DB_TABLE_PREFIX + `WAREHOUSING 
        WHERE 
        (QTY - RESERVED) < @QTY_RESERVED OR 
        RESERVED > QTY OR 
        QTY < @QTY OR 
        RESERVED < @RESERVED`;
        console.log("New isWarehousingConsistentQuery: ", checkQuery);
        return await mssqlCall.mssqlCallEscaped(inputParamsArray, checkQuery);
    }

    /**
     * Reduces the physical stock of the storage place at WAREHOUSING
     */
    // async reducePhysicalStock() {
    //     // Update Warehousing Set QTY = QTY - current item ASSIGNED_QTY,
    //     // RESERVED = RESERVED - current cache item ASSIGNED_QTY where Warehousing ID = current cache item WAREHOUSING_ID;
    //     let inputParamsArray: { name: string, type: any, value: any }[] = [
    //         {name: 'QTY', type: sql.Int, value: warehousingItem.warehousingStorageLocation},
    //         {name: 'UPDATE_LOC', type: sql.SmallDateTime, value: new Date(warehousingItem.warehousingUpdateLocation)},
    //         {name: 'ID', type: sql.Int, value: warehousingItem.warehousingId}];
    //     let updateWarehousingLocQuery: string = `UPDATE ` + constants.DB_TABLE_PREFIX + `WAREHOUSING SET
    //     QTY = (QTY - @QTY), UPDATE_LOC = @UPDATE_LOC WHERE ID = @ID`;
    //     console.log("updateWarehousingLocQuery: ", updateWarehousingLocQuery);
    //     return await mssqlCall.mssqlCallEscaped(inputParamsArray, updateWarehousingLocQuery);
    // }

    /**
     * load cache items from WAREHOUSE_RESERVATION_CACHE where DELIVERY_NOTES_POSITIONS_ID IS NOT NULL
     */
    async loadBookInventoryFromWarehouseReservationCache() {
        const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
        let loadBINVQuery: string =
            `SELECT AA.*, BB.DELIVERY_NOTES_NUMBER FROM ` + DB_TABLE_PREFIX + `WAREHOUSE_RESERVATION_CACHE AA 
            LEFT JOIN ` + DB_TABLE_PREFIX + `DELIVERY_NOTES_POSITIONS BB ON BB.ID = AA.DELIVERY_NOTES_POSITIONS_ID 
            WHERE AA.DELIVERY_NOTES_POSITIONS_ID IS NOT NULL`;
        console.log("loadBINVQuery: ", loadBINVQuery);
        return await mssqlCall.mssqlCallEscaped([], loadBINVQuery);
    }

    async updateOrdersPositions(ordersPositionsId: number, assignedQty: number){
        const query = `UPDATE ORDERS_POSITIONS SET ASSIGNED_QTY = @ASSIGNED_QTY WHERE ID = @ID`
        const queryParams = [
            {
                name: 'ASSIGNED_QTY',
                type: sql.Int,
                value: assignedQty
            },
            {
                name: 'ID',
                type: sql.Int,
                value: ordersPositionsId
            },
        ]

        return await mssqlCall.mssqlCallEscaped(queryParams, query)
    }

}
