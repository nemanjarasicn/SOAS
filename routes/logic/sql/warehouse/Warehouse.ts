/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 31.05.2021 */

import * as sql from 'mssql';
import * as mssqlCall from '../../mssql_call';
import {constants} from '../../constants/constants';

const deliveryNote = require('../delivery-note/DeliveryNote');
import {WarehouseControl} from '../../classes/WarehouseControl';
import {DeliveryNotePosition} from '../../classes/DeliveryNotePosition';
import {OrderPosition} from '../../classes/OrderPosition';
import {WarehouseReservationCacheInterface} from '../../classes/interfaces/WarehouseReservationCacheInterface';
import {WarehousingInterface} from '../../classes/interfaces/WarehousingInterface';
import {OrderPositionDataInterface} from '../../classes/interfaces/OrderPositionInterface';
import {mssql_select_Table_by_Number} from '../table/Table';
import {updateRowsTableMethod} from '../order/Order';
import {loadStatesByType} from '../states/States';
import {isComponentWHManaged} from '../article/Article';
import {getDateForQuery} from '../date/Date';
import {getItemForQuery} from '../../helpers';
import {searchColumnTypes} from '../search/Search';
import {ViewQueryTypes} from '../../constants/enumerations';
import {
    DeliveryNotePositionDataInterface,
    DeliveryNotePositionInterface
} from "../../classes/interfaces/DeliveryNotePositionInterface";
import {InvoicePositionsDataInterface} from "../../classes/interfaces/InvoicePositionsInterface";


/**
 * Check warehousing allocation for given orders positions object and collect data for writing a new order position.
 * Returns result data as array with first 'SET' item, followed by 'KOMP' items.
 * Every 'KOMP' item has WAREHOUSING_IDS array with data for writing into WAREHOUSE_RESERVATION_CACHE and
 * WAREHOUSING tables
 *
 * @param orderPositionsData - if delivery notes is available for this order, dn qty are already subtracted
 */
export async function mssql_check_warehousing_allocation(orderPositionsData: object | any) {
    console.log("START: orderPositionsData: ", orderPositionsData);
    let isPartlyDelivery: boolean = orderPositionsData['isPartlyDelivery'];
    let cacheCheck: boolean = orderPositionsData['cacheCheck'];
    let whLoc: string = orderPositionsData['orderWarehouse']; // orders WAREHOUSE value
    // 1. get orders data (orderData: any|Order):
    // 2. Check orders release === false; currency, customerNumber
    let errors = {
        0: 'COMPONENT_HAS_NO_WAREHOUSING_DATA',
        1: 'COMPONENT_WAS_NOT_FOUND',
        2: 'COMPONENT_HAS_NO_ALLOCATION',
        3: 'COMPONENT_HAS_NOT_ENOUGH_ALLOCATION',
        4: 'UNKNOWN_ERROR_OCCURRED',
        5: 'WAREHOUSING_IS_INCONSISTENT',
        6: 'SET_ARRAY_IS_EMPTY'
    };
    let resultData: any[] = [];
    let successFlag: boolean = true;
    let errorMessage: string = "";
    // check if warehousing table is inconsistent
    let whConsistent: boolean = await isWarehousingConsistent();
    if (whConsistent) {
        // align order positions as array of set´s. important if article is added many times in provided order positions.
        let orderPositionsSetsArray: [OrderPositionDataInterface[]] = getOrderPositionsSetsArray(orderPositionsData['data']);
        // try to allocate every set separately
        if (orderPositionsSetsArray && orderPositionsSetsArray.length > 0) {
            for (let setItem in orderPositionsSetsArray) {
                let ordersPositions: OrderPositionDataInterface[] = orderPositionsSetsArray[setItem]; // orderPositionsData['data'];
                // global set assigned qty: if some components have insufficient allocation, reduce set qty to be able to
                // allocate only available quantity
                let globalSetAssignedQty: undefined | number = undefined;
                let currentSetItemData: {
                    currentSetId: undefined | number,
                    currentSetItmnum: string,
                    currentSetOrderQty: number,
                    currentSetAssignedQty: number,
                    currentSetAssignedQtyUnchanged: number
                } = {
                    currentSetId: undefined, currentSetItmnum: '', currentSetOrderQty: 0,
                    currentSetAssignedQty: 0, currentSetAssignedQtyUnchanged: 0
                };
                let isOneSetComplete: boolean = false; // determine, if min one set is complete and partly delivery can be created...
                let isCurrSetComplete: boolean = false; // flag, to determine, if current loop step set is complete
                for (let key = 0; key < ordersPositions.length; key++) {

                    // console.log('key: ', key);
                    // console.log('key: ', typeof key);
                    // console.log('resultData: ', resultData);
                    // console.log('ordersPositions[key].PARENT_LINE_ID: ', ordersPositions[key].PARENT_LINE_ID);
                    // console.log('currentSetItemData[\'currentSetId\']: ', currentSetItemData['currentSetId']);
                    // console.log('currentSetItemData[\'currentSetAssignedQty\']: ', currentSetItemData['currentSetAssignedQty']);
                    // console.log('errorMessage: ', errorMessage);

                    // calculate ASSIGNED_QTY for a SET article
                    let calcResult: {} = await calcSetAssignedQty(
                        resultData,
                        ordersPositions[key].PARENT_LINE_ID,
                        currentSetItemData['currentSetId'],
                        currentSetItemData['currentSetAssignedQty'],
                        errorMessage,
                        false
                    );
                    // console.log('calcResult: ', calcResult);
                    resultData = calcResult['resultData'];
                    currentSetItemData['currentSetAssignedQty'] = calcResult['currentSetAssignedQty'];
                    currentSetItemData['currentSetId'] = calcResult['currentSetId'];
                    // console.log('>>>ordersPositions[key]: ', JSON.parse(JSON.stringify(ordersPositions[key])));
                    if (ordersPositions[key].CATEGORY_SOAS !== constants.CATEGORY_SOAS_KOMP) {
                        if (!isOneSetComplete) {
                            isOneSetComplete = (successFlag && isCurrSetComplete);
                            successFlag = true; // for next set we presuppose that all comp's maybe allocated
                            isCurrSetComplete = false;
                        }
                        // new SET, reset variables
                        currentSetItemData = resetCurrentSetItemData(currentSetItemData);
                        if (ordersPositions[key].ORDER_QTY > ordersPositions[key].ASSIGNED_QTY) { // 2 > 0
                            resultData.push({
                                'ID': ordersPositions[key].ID,
                                'ORDERS_NUMBER': ordersPositions[key].ORDERS_NUMBER,
                                'CATEGORY_SOAS': ordersPositions[key].CATEGORY_SOAS,
                                'ITMNUM': ordersPositions[key].ITMNUM,
                                'ORDER_QTY': ordersPositions[key].ORDER_QTY,
                                'ASSIGNED_QTY': ordersPositions[key].ASSIGNED_QTY,
                                'WAREHOUSING_RESERVED_QTY': 0,
                                'WAREHOUSING_ID': undefined,
                                'WAREHOUSING_IDS': undefined,
                                'WAREHOUSING_MANAGED': false,
                                'POSITION_ID': ordersPositions[key].POSITION_ID,
                                'PARENT_LINE_ID': ordersPositions[key].PARENT_LINE_ID,
                                'POSITION_STATUS': ordersPositions[key].POSITION_STATUS,
                                'DIST_COMPONENTS_ID': ordersPositions[key].DIST_COMPONENTS_ID,
                            });
                            currentSetItemData['currentSetId'] = ordersPositions[key].ID;
                            currentSetItemData['currentSetItmnum'] = ordersPositions[key].ITMNUM;
                            currentSetItemData['currentSetOrderQty'] = ordersPositions[key].ORDER_QTY; // 2
                            if (globalSetAssignedQty === undefined) {
                                // make a copy of qty
                                globalSetAssignedQty = JSON.parse(JSON.stringify(currentSetItemData['currentSetOrderQty']));
                            }
                            // console.log('SET globalSetAssignedQty: ', globalSetAssignedQty);
                            //  by default, start with assigned qty = order qty
                            currentSetItemData['currentSetAssignedQty'] =
                                (globalSetAssignedQty > 0) ? globalSetAssignedQty :
                                    (ordersPositions[key].ORDER_QTY > 0) ? ordersPositions[key].ORDER_QTY : 0; // 2

                            // copy of currentSetAssignedQty - to have not changed assigned qty
                            currentSetItemData['currentSetAssignedQtyUnchanged'] =
                                (ordersPositions[key].ASSIGNED_QTY > 0) ? ordersPositions[key].ASSIGNED_QTY :
                                    (ordersPositions[key].ORDER_QTY > 0) ? ordersPositions[key].ORDER_QTY : 0;
                            // console.log("SET COMPLETED... ", currentSetItemData['currentSetAssignedQty']);
                        } else {
                            // console.log("SET is already complete allocated! ", ordersPositions[key].ITMNUM);
                            currentSetItemData['currentSetId'] = undefined;
                            currentSetItemData['currentSetItmnum'] = '';
                            currentSetItemData['currentSetOrderQty'] = 0;
                            currentSetItemData['currentSetAssignedQty'] = 0;
                            currentSetItemData['currentSetAssignedQtyUnchanged'] = 0;
                        }
                    } else if (ordersPositions[key].CATEGORY_SOAS === constants.CATEGORY_SOAS_KOMP) {
                        if (currentSetItemData['currentSetItmnum']) {
                            let skipBlock: boolean = false;
                            let assignedQty: number = 0;
                            let reservedQty: number = 0;
                            let warehouseId: undefined | number = undefined;
                            let warehouseIds: [] = [];
                            // iterate assigned qty times and try to reserve component items step by step
                            const lowestQty: number = 1;
                            // 2 step: load qty data of every component from WAREHOUSING
                            let whData = await getWarehousingData(currentSetItemData['currentSetItmnum'],
                                ordersPositions[key].ITMNUM, lowestQty, ordersPositions[key].DIST_COMPONENTS_ID,
                                'LOT', 'ASC', false, cacheCheck, ordersPositions[key].ID, whLoc);
                            if (whData && whData.length > 0) {
                                const __ret = removeAlreadyReserved(resultData, ordersPositions, key, whData);
                                whData = __ret.whData;
                                let whReservedData = getWarehousingReservedForInsert(whData,
                                    currentSetItemData['currentSetAssignedQty'],
                                    __ret.currKompAssignedQty);
                                if (whReservedData.success) {
                                    reservedQty = whReservedData['reservedQty'];
                                    warehouseId = whReservedData['warehouseId'];
                                    warehouseIds = whReservedData['warehouseIds'];
                                    assignedQty += whReservedData['reservableQty'];
                                    // console.log('whReservedData: ', whReservedData);
                                } else {
                                    // at iteration through every component of current set determine how many set's can be completely allocated
                                    // example: set qty = 2, but some on components can be completely allocated only 1 time,
                                    // so as result we need to reduce assigned qty (globally) of the current set to 1.
                                    // here reduce set qty by 1 and try to allocate all positions again from the start...
                                    if (globalSetAssignedQty >= 0) {
                                        globalSetAssignedQty--;
                                        // reset key to be able to iterate again with globally set assigned qty
                                        key = -1;
                                        currentSetItemData = resetCurrentSetItemData(currentSetItemData);
                                        successFlag = true;
                                        resultData = [];
                                        errorMessage = "";
                                        skipBlock = true;
                                    } else {
                                        // break process, because allocation is not possible for current item
                                        successFlag = false;
                                        resultData = [];
                                        errorMessage = errors[3];
                                        break;
                                    }
                                    // console.log('!!! globalSetAssignedQty: ', globalSetAssignedQty);
                                }
                            }
                            if (!skipBlock) {
                                // console.log("warehouseIds: ", warehouseIds);
                                let isWHManaged: boolean = false;
                                if (!warehouseId) {
                                    // check ITEM_BASIS for special components, that are always available
                                    let isManagedData: any = await isComponentWHManaged(ordersPositions[key].ITMNUM);
                                    isWHManaged = isManagedData['managed'];
                                    if (isWHManaged) {
                                        // assignedQty += currentSetItemData['currentSetAssignedQty'];
                                        assignedQty += ordersPositions[key].ORDER_QTY;
                                    }
                                }
                                // after for loop, add position to resultData array
                                resultData.push({
                                    'ID': ordersPositions[key].ID,
                                    'ORDERS_NUMBER': ordersPositions[key].ORDERS_NUMBER,
                                    'CATEGORY_SOAS': ordersPositions[key].CATEGORY_SOAS,
                                    'ITMNUM': ordersPositions[key].ITMNUM,
                                    'ORDER_QTY': ordersPositions[key].ORDER_QTY,
                                    // Change on 20220106 by AL: summe of new allocated qty + previous qty
                                    'ASSIGNED_QTY': (assignedQty + ordersPositions[key].ASSIGNED_QTY),
                                    'WAREHOUSING_RESERVED_QTY': reservedQty,
                                    'WAREHOUSING_ID': warehouseId,
                                    'WAREHOUSING_IDS': warehouseIds,
                                    'WAREHOUSING_MANAGED': isWHManaged,
                                    'POSITION_ID': ordersPositions[key].POSITION_ID,
                                    'PARENT_LINE_ID': ordersPositions[key].PARENT_LINE_ID,
                                    'POSITION_STATUS': ordersPositions[key].POSITION_STATUS,
                                    'DIST_COMPONENTS_ID': ordersPositions[key].DIST_COMPONENTS_ID,
                                });
                                currentSetItemData['currentSetId'] = ordersPositions[key].PARENT_LINE_ID
                                if (isWHManaged) {
                                    isCurrSetComplete = true; // this SET is complete
                                } else {
                                    // break for, because an empty stock item found
                                    if (!warehouseId) { // foundAvailableItem
                                        console.log("ERROR: ", errors[2] + " FOR " + currentSetItemData['currentSetItmnum'] +
                                            " AND KOMP: " + ordersPositions[key].ITMNUM);
                                        for (let resItem in resultData) {
                                            // reset SET assign qty to 0, because some of components has no allocation
                                            if (resultData.hasOwnProperty(resItem) &&
                                                resultData[resItem].ITMNUM === currentSetItemData['currentSetItmnum'] &&
                                                resultData[resItem].ID === currentSetItemData['currentSetId']) {
                                                resultData[resItem].ASSIGNED_QTY = 0;
                                                currentSetItemData['currentSetAssignedQty'] = 0;
                                                break;
                                            }
                                        }
                                        successFlag = false;
                                        isCurrSetComplete = false;
                                    } else {
                                        isCurrSetComplete = true; // this SET is complete
                                        if (errorMessage.length > 0) {
                                            errorMessage = errors[3]; // allow to create partly delivery
                                        }
                                    }
                                }
                                // check if enough quantity of current component is available,
                                // so a partly delivery note can be created => show yes/no dialog first
                                if (ordersPositions[key].ORDER_QTY > assignedQty) {
                                    errorMessage = errors[3];
                                }
                            }
                        } else {
                            console.log("Component ignored - SET not found: ", ordersPositions[key].ITMNUM);
                        }
                    }
                }
                if (!isOneSetComplete) {
                    isOneSetComplete = (successFlag && isCurrSetComplete);
                }
                if (!successFlag) {
                    successFlag = isOneSetComplete;
                }
                if (successFlag && isPartlyDelivery && errorMessage.length === 0) {
                    errorMessage = errors[3]; // allow to create partly delivery
                }
                // console.log("Pre final after check-wh-cache resultData: ", JSON.parse(JSON.stringify(resultData)));
                // check and update qty for SET, if components are not fully allocated
                let calcResult: {} = await calcSetAssignedQty(resultData, undefined, currentSetItemData['currentSetId'],
                    currentSetItemData['currentSetAssignedQtyUnchanged'], errorMessage, true);
                resultData = calcResult['resultData'];
            }
        } else {
            successFlag = false;
            errorMessage = errors[6]; // warehousing is inconsistent
        }
    } else {
        successFlag = false;
        errorMessage = errors[5]; // warehousing is inconsistent
    }
    return {
        success: successFlag,
        message: errorMessage,
        data: resultData
    };
}

/**
 * reset SET variables
 */
function resetCurrentSetItemData(currentSetItemData: {
    currentSetId: undefined | number,
    currentSetItmnum: string,
    currentSetOrderQty: number,
    currentSetAssignedQty: number,
    currentSetAssignedQtyUnchanged: number
}) {
    currentSetItemData = {
        currentSetId: undefined,
        currentSetItmnum: '',
        currentSetOrderQty: 0,
        currentSetAssignedQty: 0,
        currentSetAssignedQtyUnchanged: 0
    };
    return currentSetItemData;
}


/**
 * book inventory function for batch process => cron_logic -> check_new_batches
 */
export async function mssql_batch_process_book_inventory() {
    let errors: boolean = false;
    let result: any;
    try {
        result = await new Promise(async (resolve, reject) => {
            let warehouseControl: WarehouseControl = new WarehouseControl();
            let warehouseReservationCacheItems: WarehouseReservationCacheInterface[] = [];
            // Step 1: Get all items from Cache where DELIVERY_NOTES_POSITIONS_ID is not NULL
            let loadBINVData: any = await warehouseControl.loadBookInventoryFromWarehouseReservationCache();
            console.log("loadBINVData: ", loadBINVData);
            if (loadBINVData && loadBINVData.length) {
                for (let binvDataItem in loadBINVData) {
                    if (loadBINVData.hasOwnProperty(binvDataItem)) {
                        let newWRCItem: WarehouseReservationCacheInterface = {
                            warehouseRCId: loadBINVData[binvDataItem].ID,
                            warehouseRCDocumentNumber: loadBINVData[binvDataItem].DOCUMENT_NUMBER,
                            warehouseRCItemNumber: loadBINVData[binvDataItem].ITMNUM,
                            warehouseRCAssignedQuantity: loadBINVData[binvDataItem].ASSIGNED_QTY,
                            warehouseRCBatchNumber: loadBINVData[binvDataItem].LOT,
                            warehouseRCStorageLocation: loadBINVData[binvDataItem].LOC,
                            warehouseRCWarehouse: loadBINVData[binvDataItem].WAREHOUSE,
                            warehouseRCPositionId: loadBINVData[binvDataItem].POSITION_ID,
                            warehouseRCAssignmentDate: loadBINVData[binvDataItem].ASSIGNMENT_DATE,
                            warehouseRCWarehousingId: loadBINVData[binvDataItem].WAREHOUSING_ID,
                            warehouseRCOrdersPositionsId: loadBINVData[binvDataItem].ORDERS_POSITIONS_ID,
                            warehouseRCDeliveryNotesPositionsId: loadBINVData[binvDataItem].DELIVERY_NOTES_POSITIONS_ID,
                        };
                        warehouseReservationCacheItems.push(newWRCItem);
                    }
                }
                for (let wrcItem in warehouseReservationCacheItems) {
                    // Load item from Warehousing
                    let loadWHData: any = await warehouseControl.loadFromWarehousing(
                        warehouseReservationCacheItems[wrcItem].warehouseRCWarehousingId);
                    console.log("loadWHData: ", loadWHData);
                    // Step 2: Book every item by deleting it from Cache and reduce Warehousing QTY and RESERVED
                    //ToDo: Remove: For a test without updating warehousing...  (3 von 3)
                    await warehouseControl.postStock(warehouseReservationCacheItems[wrcItem],
                        (loadWHData && loadWHData[0]) ? loadWHData[0] : undefined);
                }
                // Step 3: Update delivery notes and set DELIVERY_QTY, POSITION_STATUS AND RELEASE FLAG
                await deliveryNote.updateDeliveryNotesQtyAndStatus(loadBINVData);
            } else {
                console.log("loadBINVData is empty... No inventory to book available...");
            }
            if (errors) {
                reject({success: false, error: 'Allocation error.'});
            } else {
                resolve({success: true, error: undefined});
            }
        }).catch(err => {
            console.log("Error err: ", err);
            // @ts-ignore
            logger.error(new Error(err));
            return {success: false, error: err};
        });
        return result;
    } catch (e) {
        console.log("Error e: ", e);
        // @ts-ignore
        logger.error(new Error(e));
        throw new Error(e);
    }
}

/**
 * allocation function for batch process => cron_logic -> check_new_batches
 */
export async function soas_hourly_allocation_check(whLoc = "101") {
    let errors: boolean = false;
    let result: any;
    try {
        result = await new Promise(async (resolve, reject) => {
            // Step 1: get list of orders positions with STATES 1 and 2 (un- or not completely allocated)
            let opItemsList: any[] = [];
            let inputParamsArray: { name: string, type: any, value: any }[] = [
                {name: 'CATEGORY_SOAS', type: sql.VarChar, value: constants.CATEGORY_SOAS_SET},
                {name: 'POSITION_STATUS_1', type: sql.Int, value: 1},
                {name: 'POSITION_STATUS_2', type: sql.Int, value: 2},
                {name: 'WAREHOUSE_LOC', type: sql.VarChar, value: whLoc}
            ];
            const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
            let opSelectQuery: string = `SELECT AA.ORDERS_NUMBER, AA.WAREHOUSE FROM ` + DB_TABLE_PREFIX + `ORDERS_POSITIONS AA 
                LEFT JOIN ` + DB_TABLE_PREFIX + `ORDERS BB ON BB.ORDERS_NUMBER = AA.ORDERS_NUMBER 
                WHERE AA.CATEGORY_SOAS = @CATEGORY_SOAS AND
                AA.WAREHOUSE = @WAREHOUSE_LOC  AND
                (AA.POSITION_STATUS = @POSITION_STATUS_1 OR AA.POSITION_STATUS = @POSITION_STATUS_2) `;
            //ToDo: Remove and test all items...  (2 von 3)
            // opSelectQuery += `AND BB.ORDERS_DATE > '20210401' AND AA.ORDERS_NUMBER = '50021AU000020'`;
            console.log("opSelectQuery: ", opSelectQuery);
            let opSelectData: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, opSelectQuery);
            if (opSelectData) {
                opItemsList = opSelectData;
                // Step 2: go through list and try to allocate positions
                for (let opItem in opItemsList) {
                    if (opItemsList[opItem] && opItemsList[opItem].ORDERS_NUMBER) {
                        if (opItemsList[opItem].WAREHOUSE) {
                            await mssql_check_allocation(opItemsList[opItem].ORDERS_NUMBER, opItemsList[opItem].WAREHOUSE);
                        } else {
                            let error: string = "ERROR: WAREHOUSE is not set for opItem: " + opItemsList[opItem];
                            console.log(error); // @ts-ignore
                            logger.error(new Error(error));
                            errors = true;
                        }
                    } else {
                        console.log("ERROR: something wrong with opItem: ", opItemsList[opItem]);
                        errors = true;
                    }
                }
            }
            if (errors) {
                reject({success: false, error: 'Allocation error.'});
            } else {
                resolve({success: true, error: undefined});
            }
        }).catch(err => {
            console.log("Error err: ", err);
            // @ts-ignore
            logger.error(new Error(err));
            return {success: false, error: err};
        });
        return result;
    } catch (e) {
        console.log("Error e: ", e);
        // @ts-ignore
        logger.error(new Error(e));
        throw new Error(e);
    }
}

/**
 * check and allocate orders positions if possible
 *
 * @param ordersNumber
 * @param warehouse
 */
export async function mssql_check_allocation(ordersNumber: string, warehouse: string) {
    const PRIMARY_KEY: string = 'ORDERS_NUMBER';
    const ORDERS_POSITIONS_STATES: any[] = await loadStatesByType('POS');
    if (ORDERS_POSITIONS_STATES && ORDERS_POSITIONS_STATES.length > 0) {
        // 1. load order positions data for given orders number
        let orderPositionDbData: any = await mssql_select_Table_by_Number('orderPosition',
            ViewQueryTypes.DETAIL_TABLE, PRIMARY_KEY,
            ordersNumber, undefined, undefined, undefined,
            undefined, 0, PRIMARY_KEY, "ASC");
        if (!orderPositionDbData) {
            return {success: false, message: 'ORDERS_POSITIONS_NOT_FOUND', ordersNumber: ordersNumber};
        }
        let orderPositions = orderPositionDbData['data'][1];
        if (orderPositions && orderPositions.length) {
            // 2. prepare order positions data for allocation - find & collect not (complete) allocated items
            let partlyDeliveryDetected: boolean = false;
            let orderPositionsForAllocation: any[] = [];
            for (let formElement in orderPositions) {
                if (orderPositions.hasOwnProperty(formElement)) {
                    if (orderPositions[formElement].POSITION_STATUS === ORDERS_POSITIONS_STATES[1].STATES_ID ||
                        orderPositions[formElement].POSITION_STATUS === ORDERS_POSITIONS_STATES[2].STATES_ID) {
                        orderPositionsForAllocation.push(orderPositions[formElement]);
                    }
                }
            }
            // console.log("orderPositionsForAllocation: ", orderPositionsForAllocation);
            if (orderPositions.length > orderPositionsForAllocation.length) {
                partlyDeliveryDetected = true;
            }
            // 3. check if for found order positions warehousing quantity can be allocated: SOAS-17
            let whAllocationData: any | {} = await mssql_check_warehousing_allocation({
                data: orderPositionsForAllocation,
                isPartlyDelivery: partlyDeliveryDetected,
                cacheCheck: false,
                orderWarehouse: warehouse
            });
            if (whAllocationData) {
                if (whAllocationData['success'] && whAllocationData['data'].length) {
                    // (all) items can be allocated
                    let orderPositionsElements: {} = {'ITM': [], 'KMP': []};
                    for (let opElmItem in whAllocationData['data']) {
                        if (whAllocationData['data'].hasOwnProperty(opElmItem)) {
                            if (whAllocationData['data'][opElmItem].CATEGORY_SOAS === constants.CATEGORY_SOAS_SET) {
                                orderPositionsElements['ITM'].push(whAllocationData['data'][opElmItem]);
                            } else {
                                orderPositionsElements['KMP'].push(whAllocationData['data'][opElmItem]);
                            }
                        }
                    }
                    let allocData: any | {} = setAllocationAssignedQty(
                        whAllocationData['data'], orderPositionsElements,
                        ORDERS_POSITIONS_STATES, false);
                    orderPositionsElements = allocData.orderPositionsElements;
                    await updateRowsTableMethod('orderPosition',
                        orderPositionsElements,
                        PRIMARY_KEY, ordersNumber,
                        'allocatePositions', undefined, undefined, undefined);
                    return {success: true, message: 'OK', ordersNumber: ordersNumber};
                } else {
                    return {success: false, message: 'ALLOCATION_NOT_POSSIBLE', ordersNumber: ordersNumber};
                }
            } else {
                return {success: false, message: 'WH_DATA_NOT_FOUND', ordersNumber: ordersNumber};
            }
        } else {
            console.log("ERROR: No orders positions found for: ", ordersNumber);
            return {success: false, message: 'NO_POSITIONS_FOUND', ordersNumber: ordersNumber};
        }
    } else {
        return {success: false, message: 'NO_STATES_FOUND', ordersNumber: ordersNumber};
    }
}

/**
 *  * set allocation ASSIGNED_QTY and update POSITION_STATUS
 *
 * @param whAllocData - warehouse allocation data
 * @param orderPositionsElements
 * @param ordPosStates
 * @param insertFlag
 */
export function setAllocationAssignedQty(whAllocData: any | {}, orderPositionsElements: any | {},
                                         ordPosStates: any[], insertFlag: boolean):
    { orderPositionsElements: any | {}, showInfoMessage: undefined | {} } {
    let showInfoMessage: undefined | {};
    // merge allocation data with orderPositionsElements['KMP']
    let setComplete: undefined | boolean = undefined;
    let setEmpty: boolean = false;
    for (let resDatItem in whAllocData) {
        if (whAllocData.hasOwnProperty(resDatItem)) {
            if (whAllocData[resDatItem].CATEGORY_SOAS === constants.CATEGORY_SOAS_KOMP) {
                for (let opKmpItem in orderPositionsElements['KMP']) {
                    if (orderPositionsElements['KMP'].hasOwnProperty(opKmpItem)) {
                        if (whAllocData[resDatItem].ORDERS_NUMBER === orderPositionsElements['KMP'][opKmpItem].ORDERS_NUMBER &&
                            whAllocData[resDatItem].ITMNUM === orderPositionsElements['KMP'][opKmpItem].ITMNUM &&
                            whAllocData[resDatItem].POSITION_ID === orderPositionsElements['KMP'][opKmpItem].POSITION_ID) {
                            // overwrite ASSIGNED_QTY with allocation QTY
                            orderPositionsElements['KMP'][opKmpItem].ASSIGNED_QTY = whAllocData[resDatItem].ASSIGNED_QTY;
                            if (orderPositionsElements['KMP'][opKmpItem].ASSIGNED_QTY ===
                                orderPositionsElements['KMP'][opKmpItem].ORDER_QTY) {
                                setComplete = (setComplete === undefined && !setEmpty) ? true : setComplete;
                            } else {
                                if (orderPositionsElements['KMP'][opKmpItem].ASSIGNED_QTY > 0) {
                                    setComplete = (!setEmpty) ? false : setComplete;
                                } else {
                                    setEmpty = true;
                                    setComplete = undefined;
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
    // order positions data for warehouse allocation (qty's not summed)
    let wHUpdatePositionStateData: { orderPositionsElements: any, showInfoMessage: {} } =
        updatePositionState(orderPositionsElements, insertFlag, setComplete, ordPosStates, showInfoMessage);
    orderPositionsElements = wHUpdatePositionStateData.orderPositionsElements;
    showInfoMessage = wHUpdatePositionStateData.showInfoMessage;
    return {orderPositionsElements, showInfoMessage};
}

/**
 * update position state
 *
 * @param orderPositionsElements
 * @param insertFlag
 * @param setComplete
 * @param ordPosStates
 * @param showInfoMessage
 */
function updatePositionState(orderPositionsElements: any, insertFlag: boolean, setComplete: boolean, ordPosStates: any[],
                             showInfoMessage: {}): { orderPositionsElements: any, showInfoMessage: {} } {
    // update SET POSITION_STATUS
    for (let opItmItem in orderPositionsElements['ITM']) {
        if (orderPositionsElements['ITM'].hasOwnProperty(opItmItem)) {
            if (!insertFlag) {
                orderPositionsElements['ITM'][opItmItem].ASSIGNED_QTY = 0;
            }
            orderPositionsElements['ITM'][opItmItem].POSITION_STATUS = setComplete ?
                ordPosStates[3].STATES_ID : setComplete === false ? ordPosStates[2].STATES_ID : ordPosStates[1].STATES_ID;
            if (!setComplete) {
                for (let opsItem in ordPosStates) {
                    if (ordPosStates[opsItem].STATES_ID === orderPositionsElements['ITM'][opItmItem].POSITION_STATUS) {
                        showInfoMessage = {
                            param1: 'OP_ERROR_COMPONENTS_AVAILABILITY',
                            param2: orderPositionsElements['ITM'][opItmItem].ITMNUM,
                            param3: ordPosStates[opsItem].STATES_NAME
                        };
                        break;
                    }
                }
            }
        }
    }
    // update KMP POSITION_STATUS
    for (let opKmpItem in orderPositionsElements['KMP']) {
        if (orderPositionsElements['KMP'].hasOwnProperty(opKmpItem)) {
            orderPositionsElements['KMP'][opKmpItem].POSITION_STATUS = setComplete ?
                ordPosStates[3].STATES_ID : setComplete === false ? ordPosStates[2].STATES_ID : ordPosStates[1].STATES_ID;
        }
    }
    return {orderPositionsElements, showInfoMessage};
}

/**
 * set allocation for given warehousing an orders positions data
 *
 * @param whAllocationData
 * @param orderPositionsElements
 * @param insertFlag
 */
export async function mssql_set_allocation(whAllocationData: any, orderPositionsElements: [], insertFlag: boolean) {
    const ORDERS_POSITIONS_STATES: any[] = await loadStatesByType('POS');
    if (ORDERS_POSITIONS_STATES && ORDERS_POSITIONS_STATES.length > 0) {
        let allocData: any | {} = setAllocationAssignedQty(whAllocationData, orderPositionsElements,
            ORDERS_POSITIONS_STATES, insertFlag);
        return {success: true, message: allocData.showInfoMessage, data: allocData.orderPositionsElements};
    } else {
        return {success: false, message: 'NO_STATES_FOUND', data: undefined};
    }
}

/**
 * calculate ASSIGNED_QTY and POSITION_STATUS for a SET item
 *
 * @param resultData
 * @param parentLineId
 * @param currentSetId
 * @param currentSetAssignedQty
 * @param errorMessage
 * @param calcComponentsQty - if true, calculates components ASSIGNED_QTY too
 */
export async function calcSetAssignedQty(resultData: any, parentLineId: undefined | number,
                                         currentSetId: undefined | number, currentSetAssignedQty: number,
                                         errorMessage: string, calcComponentsQty: boolean = false) {
    // Important - was deprecated before...
    // Replaced by calcComponentAssignedQty, because assigned qty should be shown at component
    // if next set, so update previous one ASSIGNED_QTY
    if (currentSetId && (currentSetId !== parentLineId)) {
        for (let resultItem in resultData) {
            if (resultData.hasOwnProperty(resultItem)) {
                if (resultData[resultItem].ID === currentSetId) {
                    if (errorMessage.length > 0) {
                        // partly delivery
                        console.log("partly delivery !!!");
                        currentSetAssignedQty = !currentSetAssignedQty ?
                            resultData[resultItem].ASSIGNED_QTY : currentSetAssignedQty;
                        resultData[resultItem].ASSIGNED_QTY = currentSetAssignedQty;
                        resultData[resultItem] = await calcOPItemPositionStatus(resultData[resultItem]);
                        if (calcComponentsQty) {
                            // update KOMP Assigned qty too
                            for (let compResItem in resultData) {
                                if (resultData.hasOwnProperty(compResItem) &&
                                    resultData[compResItem].PARENT_LINE_ID === currentSetId) {
                                    if (resultData[compResItem].ASSIGNED_QTY > 0) {
                                        resultData[compResItem].ASSIGNED_QTY =
                                            (resultData[compResItem].ASSIGNED_QTY / currentSetAssignedQty) *
                                            currentSetAssignedQty;
                                    } else {
                                        console.log("NOT UPDATED: ", resultData[compResItem].ASSIGNED_QTY +
                                            " for ID: " + resultData[compResItem].ID);
                                    }
                                }
                            }
                        }
                    } else {
                        console.log("Full Delivery !!!");
                        // full delivery
                        resultData[resultItem].ASSIGNED_QTY = resultData[resultItem].ORDER_QTY;
                        currentSetAssignedQty = resultData[resultItem].ASSIGNED_QTY;
                        resultData[resultItem] = await calcOPItemPositionStatus(resultData[resultItem]);
                    }
                    break;
                }
            }
        }
    }
    return {resultData: resultData, currentSetAssignedQty: currentSetAssignedQty, currentSetId: currentSetId};
}

/**
 * get WAREHOUSING items for reservation or cancellation (forCancel = true)
 *
 * @param itmnum
 * @param compnum
 * @param lowestQty
 * @param distCompId
 * @param sortColumnName
 * @param sortType
 * @param forCancel
 * @param cacheCheck
 * @param ordersPositionsId
 * @param whLoc - order WAREHOUSE value
 */
export async function getWarehousingData(itmnum: string, compnum: string, lowestQty: number, distCompId: number,
                                         sortColumnName: string, sortType: string, forCancel: boolean,
                                         cacheCheck: boolean, ordersPositionsId: undefined | number, whLoc: string) {
    let statusPos: string = 'A';
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'ITMNUM', type: sql.VarChar, value: itmnum},
        {name: 'COMPNUM', type: sql.VarChar, value: compnum},
        {name: 'QTY', type: sql.Int, value: lowestQty},
        {name: 'QTY_RESERVED', type: sql.Int, value: 0},
        {name: 'DIST_COMP_ID', type: sql.Int, value: distCompId},
        {name: 'ORDERS_POSITIONS_ID', type: sql.Int, value: ordersPositionsId},
        {name: 'STATUS_POS', type: sql.VarChar, value: statusPos},
        {name: 'WH_LOC', type: sql.VarChar, value: whLoc}
    ];
    const SORT_COLUMN_NAME_VALUE: string = getItemForQuery([sortColumnName], searchColumnTypes);
    const SORT_TYPE_VALUE: string = getItemForQuery([sortType], constants.SORT_TYPES); // sortTypes
    // TOP 1
    const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    let whQuery: string = `SELECT *, (SELECT TOP 1 DIST_QTY FROM ` + DB_TABLE_PREFIX + `DIST_COMPONENTS 
        WHERE ITMNUM = @ITMNUM AND COMPNUM = AA.ITMNUM AND ID = @DIST_COMP_ID) AS DIST_QTY, 
        (SELECT SUM(ASSIGNED_QTY) FROM ` + DB_TABLE_PREFIX + `WAREHOUSE_RESERVATION_CACHE WHERE WAREHOUSING_ID = AA.ID`;
    if (!cacheCheck && ordersPositionsId) {
        // at creating of delivery note, no check of current cache item needed. so check only other cache items.
        whQuery += ` AND ORDERS_POSITIONS_ID != @ORDERS_POSITIONS_ID`;
    }
    whQuery += `) AS SUM_QTY FROM ` + DB_TABLE_PREFIX + `WAREHOUSING AA `;
    // whQuery += `LEFT JOIN ` + constants.DB_TABLE_PREFIX + `DIST_COMPONENTS BB ON BB.COMPNUM = AA.ITMNUM `;
    whQuery += `WHERE AA.ITMNUM = @COMPNUM AND AA.QTY >= @QTY `;
    if (forCancel) {
        whQuery += `AND AA.RESERVED >= @QTY `;
    }
    // if items for cancellation/rollback should be returned, so reduce RESERVED with QTY
    // SOAS-17: stockAvailable = ∑stockPhysical - cache - ∑stockReserved
    // 26.04.2021: >= @QTY_RESERVED - because calculation for delivery notes creation checks - SUM_QTY
    whQuery += `AND (AA.QTY-` + (!forCancel ? `AA.RESERVED` : `AA.RESERVED + @QTY`) + `) >= @QTY_RESERVED AND 
        AA.LOT != '' AND STATUS_POS = @STATUS_POS AND WHLOC = @WH_LOC `;
    // whQuery += `AND BB.ITMNUM = @ITMNUM AND BB.DIST_QTY = '" + distQty + "' `;
    whQuery += `ORDER BY AA.` + SORT_COLUMN_NAME_VALUE + ` ` + SORT_TYPE_VALUE;
    console.log("whQuery: ", whQuery);
    console.log("inputParamsArray: ", inputParamsArray);
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, whQuery);
}

/**
 * Check whData, if some of WAREHOUSING items are already 'reserved' in previous orders positions and
 * ignore full reserved items.
 * Returns summe of current components ASSIGNED_QTY and whData array.
 *
 * @param resultData
 * @param ordersPositions
 * @param key
 * @param whData
 */
export function removeAlreadyReserved(resultData: any, ordersPositions: OrderPositionDataInterface[], key: any,
                                      whData: any) {
    let foundSameItem: boolean = false;
    let currKompAssignedQty: number = 0;
    for (let resItem in resultData) {
        if (resultData.hasOwnProperty(resItem)) {
            if (ordersPositions[key].ITMNUM === resultData[resItem].ITMNUM) {
                currKompAssignedQty += resultData[resItem].ASSIGNED_QTY;
                foundSameItem = true;
                let localAssignedQty: number = 0;
                let whDataChecked: any[] = [];
                for (let whDataItem in whData) {
                    if (whData.hasOwnProperty(whDataItem)) {
                        localAssignedQty = (whData[whDataItem].QTY - whData[whDataItem].RESERVED) - currKompAssignedQty;
                        if (localAssignedQty > 0) {
                            // ok
                            whDataChecked.push(whData[whDataItem]);
                        } else {
                            // ignore item, because already full reserved
                            console.log("Ignored whDataItem: ", whData[whDataItem]);
                            currKompAssignedQty = resultData[resItem].ASSIGNED_QTY - whData[whDataItem].QTY;
                        }
                    }
                }
                whData = whDataChecked;
            }
        }
    }
    if (currKompAssignedQty < 0) {
        console.log("ERROR: currKompAssignedQty is negative! " + currKompAssignedQty + " Set it to 0!");
        currKompAssignedQty = 0;
    }
    return {currKompAssignedQty, whData};
}

/**
 * get reservable/reserved quantity and warehousing ids, for given warehousing items array and needed order quantity
 * SOAS-17: Comment "Warehouse Logic related to orders and delivery notes"
 *
 * @param warehousingData
 * @param setOrderQty
 * @param compAssignedQty
 */
export function getWarehousingReservedForInsert(warehousingData: any, setOrderQty: number, compAssignedQty: number):
    {
        success: boolean, reservedQty: number, reservableQty: number, warehouseId: undefined | number, warehouseIds: [],
        partlyDelivery: boolean
    } {
    // go through warehousing items and reserve until needed quantity is reached
    let reservableQty: number = 0; // number of possible reservable quantity
    let reservedQty: number = 0;  // currently reserved quantity
    let currSummeReservableQty: number = 0; // => ASSIGNED_QTY
    let warehouseId: undefined | number = undefined;
    let warehouseIds: [] = [];
    let partlyDelivery: boolean = false;
    let breakLoop: boolean = false;
    let success: boolean = false;
    if (warehousingData && warehousingData.length > 0) {
        for (let whItem in warehousingData) {
            if (warehousingData.hasOwnProperty(whItem)) {
                if (warehousingData[whItem].QTY > warehousingData[whItem].RESERVED) {
                    reservedQty = warehousingData[whItem].RESERVED;
                    warehouseId = warehousingData[whItem].ID;
                    // Part 1: calculate reserved qty for current orders positions item => ASSIGNED_QTY
                    // SOAS-17: stockAvailable = ∑stockPhysical - ∑stockReserved
                    reservableQty = warehousingData[whItem].QTY - warehousingData[whItem].RESERVED;
                    // console.log("###reservableQty1: ", JSON.parse(JSON.stringify(reservableQty)));
                    if (reservableQty >= (setOrderQty * warehousingData[whItem].DIST_QTY)) { // warehousingData[whItem].DIST_QTY
                        if (reservableQty > ((setOrderQty * warehousingData[whItem].DIST_QTY) - compAssignedQty)) {
                            // all items can be allocated
                            // if ((reservableQty-kompAssignedQty) ==
                            // ((setOrderQty * warehousingData[whItem].DIST_QTY)-kompAssignedQty)) {
                            //     console.log("available qty is EQUAL as needed qty... ", (reservableQty-kompAssignedQty));
                            // }
                            if ((reservableQty - compAssignedQty) >=
                                ((setOrderQty * warehousingData[whItem].DIST_QTY) - compAssignedQty)) {
                                console.log("available qty is HIGHER then needed qty...");
                                // if available qty it higher than needed qty
                                if (((setOrderQty * warehousingData[whItem].DIST_QTY) - compAssignedQty) > 0) {
                                    reservableQty = ((setOrderQty * warehousingData[whItem].DIST_QTY) - compAssignedQty);
                                } else {
                                    if ((reservableQty - compAssignedQty) > 0) {
                                        reservableQty -= compAssignedQty;
                                    }
                                }
                            } else {
                                console.log("available qty is LOWER then needed qty...");
                                // if available qty it lower than needed qty
                                if ((reservableQty - compAssignedQty) > 0) {
                                    reservableQty -= compAssignedQty;
                                } else if (((setOrderQty * warehousingData[whItem].DIST_QTY) - compAssignedQty) > 0) {
                                    reservableQty = ((setOrderQty * warehousingData[whItem].DIST_QTY) - compAssignedQty);
                                }
                            }
                            // console.log("###reservableQty2.1: ", JSON.parse(JSON.stringify(reservableQty)));
                        } else if (reservableQty === warehousingData[whItem].DIST_QTY) {
                            partlyDelivery = true; // "some" of x items is reservable => partly delivery is possible for this item
                        }
                        currSummeReservableQty += reservableQty;
                        // Part 2: calculate warehousing qty => For WAREHOUSING and CACHE tables
                        let warehousingIdQty: number = 0;
                        // currently reservable qty
                        let calcQty: number = (setOrderQty * warehousingData[whItem].DIST_QTY) - reservableQty;
                        // console.log("calcQty: ", JSON.parse(JSON.stringify(calcQty)));
                        // calculate previous items reservableQty
                        warehousingIdQty = (calcQty >= 0) ? reservableQty : setOrderQty;  // part of qty can be allocated

                        // break loop, if reservation is completed
                        if (currSummeReservableQty >= (setOrderQty * warehousingData[whItem].DIST_QTY)) {
                            // all items can be reserved...
                            reservableQty = (setOrderQty * warehousingData[whItem].DIST_QTY);
                            // console.log("BREAK => reservableQty: ", JSON.parse(JSON.stringify(reservableQty)));
                            currSummeReservableQty = reservableQty;
                            breakLoop = true;
                        } else {
                            // not all items can be reserved...
                            // console.log("ELSE => reservableQty: ", JSON.parse(JSON.stringify(reservableQty)));
                            compAssignedQty += reservableQty; // overall qty (summe of qty from previous warehousing items)
                        }
                        warehouseIds.push({ // @ts-ignore
                            warehouseId: warehouseId, reservableQty: reservableQty, // @ts-ignore
                            reservedQty: reservedQty, warehousingIdQty: warehousingIdQty, // @ts-ignore
                            lot: warehousingData[whItem].LOT, loc: warehousingData[whItem].LOC, // @ts-ignore
                            warehouse: warehousingData[whItem].WHLOC
                        });
                        success = true;
                    } else {
                        // ignore item: QTY-RESERVED is lower than DIST_QTY of component
                        // reset complete all items
                        reservableQty = 0;
                        reservedQty = 0;
                        currSummeReservableQty = 0;
                        warehouseId = undefined;
                        partlyDelivery = false;
                        warehouseIds = [];
                        success = false;
                        breakLoop = true;
                        console.warn('QTY-RESERVED is lower than DIST_QTY of component: ', warehousingData[whItem]);
                    }
                    if (breakLoop) {
                        break;
                    }
                } else {
                    console.log("Ignore item... ", warehousingData[whItem].ITMNUM);
                }
            }
        }
    }
    return {
        success: success, reservedQty: reservedQty, reservableQty: currSummeReservableQty, warehouseId: warehouseId,
        warehouseIds: warehouseIds, partlyDelivery: partlyDelivery
    };
}

/**
 * calculate order positions item POSITION_STATUS
 *
 * @param resultDataItem
 */
export async function calcOPItemPositionStatus(resultDataItem: any) {
    let deliveryNotesPositions: undefined | DeliveryNotePosition[] = undefined;
    let deliveryNotesPositionOrderQty: number = 0;
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'ORDERS_NUMBER', type: sql.VarChar, value: resultDataItem.ORDERS_NUMBER},
        {name: 'ITMNUM', type: sql.VarChar, value: resultDataItem.ITMNUM},
        {name: 'ORDERS_POSITIONS_ID', type: sql.Int, value: resultDataItem.ID}];
    // let dnpSelectQuery: string = `SELECT TOP 1 * FROM ` + constants.DB_TABLE_PREFIX + `DELIVERY_NOTES_POSITIONS WHERE
    //     ORDERS_NUMBER = @ORDERS_NUMBER AND ITMNUM = @ITMNUM AND ORDERS_POSITIONS_ID = @ORDERS_POSITIONS_ID`;
    let oPSelectQuery: string = `SELECT TOP 1 * FROM ` + constants.DB_TABLE_PREFIX + `ORDERS_POSITIONS WHERE 
        ORDERS_NUMBER = @ORDERS_NUMBER AND ITMNUM = @ITMNUM AND ID = @ORDERS_POSITIONS_ID`;
    console.log('oPSelectQuery: ', oPSelectQuery);
    console.log('inputParamsArray: ', inputParamsArray);
    let dnpSelectData: any = await mssqlCall.mssqlCallEscaped(inputParamsArray, oPSelectQuery);
    if (dnpSelectData && dnpSelectData[0]) {
        deliveryNotesPositions = dnpSelectData[0];
        // @ts-ignore
        if (deliveryNotesPositions && deliveryNotesPositions.ITMNUM === resultDataItem.ITMNUM) {
            if (resultDataItem.CATEGORY_SOAS !== constants.CATEGORY_SOAS_KOMP && // @ts-ignore
                deliveryNotesPositions.PARENT_LINE_ID === resultDataItem.PARENT_LINE_ID) { // @ts-ignore
                // SET
                deliveryNotesPositionOrderQty = deliveryNotesPositions.ORDER_QTY;
            }
        }
    } else {
        console.log("Error: dnpSelectData is empty! ", resultDataItem.ITMNUM);
    }
    // @ToDo: Replace POSITION_STATUS numbers from constants here
    if (resultDataItem.POSITION_STATUS < 3) {
        if (resultDataItem.ORDER_QTY ===
            (deliveryNotesPositionOrderQty + resultDataItem.ASSIGNED_QTY)) {
            resultDataItem.POSITION_STATUS = 3;
        } else if ((resultDataItem.ORDER_QTY >
                (deliveryNotesPositionOrderQty + resultDataItem.ASSIGNED_QTY)) &&
            (resultDataItem.ASSIGNED_QTY > 0)) {
            resultDataItem.POSITION_STATUS = 2;
        }
    }
    console.log('resultDataItem: ', JSON.parse(JSON.stringify(resultDataItem)));
    return resultDataItem;
}

/**
 * calculate position order qty
 *
 * @param orderPosition
 * @param dnPositions
 */
export function calcPositionsOrderQty(orderPosition: OrderPosition, dnPositions: any) {
    let foundDnpOrderQty: number = 0;
    let foundOne: boolean = false;
    // go through delivery note positions an search for given order position
    for (let dnItem in dnPositions) {
        if (dnPositions.hasOwnProperty(dnItem)) {
            // @ts-ignore
            if (dnPositions[dnItem].ITMNUM === orderPosition.ITMNUM &&
                // @ts-ignore
                dnPositions[dnItem].ORDERS_POSITIONS_ID === orderPosition.ID) {
                // summe all dvp positions order qty
                foundDnpOrderQty += dnPositions[dnItem].ORDER_QTY;
                foundOne = true;
                break;
            }
        }
    }
    if (foundOne) {
        // @ts-ignore
        if (foundDnpOrderQty < orderPosition.ORDER_QTY) {
            // @ts-ignore
            let newQty: number = (orderPosition.ASSIGNED_QTY - foundDnpOrderQty);  // @ts-ignore
            return newQty > 0 ? newQty : // @ts-ignore
                (foundDnpOrderQty > 0 ? foundDnpOrderQty : 0);
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}

/**
 * check if given order position item is one of given delivery notes positions entries
 * (detect both, set and his components)
 *
 * @param positions
 * @param orderPosition
 * @return true if order position is in delivery notes positions, otherwise false
 */
export function checkPositionIsInDnp(positions: any|DeliveryNotePositionDataInterface[]|InvoicePositionsDataInterface[],
                                     orderPosition: OrderPositionDataInterface) {
    let summeDNQty: number = 0;
    let foundSameITMNUM: boolean = false;
    for (let dnItem in positions) {
        if (positions.hasOwnProperty(dnItem)) {
            // compare order position with positions = delivery note positions
            if (positions[dnItem].ORDERS_POSITIONS_ID) {
                if (positions[dnItem].ITMNUM === orderPosition.ITMNUM &&
                    positions[dnItem].ORDERS_POSITIONS_ID === orderPosition.ID) {
                    if (positions[dnItem].ORDER_QTY === orderPosition.ORDER_QTY) {
                        foundSameITMNUM = true;
                        break;
                    } else {
                        summeDNQty += positions[dnItem].ORDER_QTY;
                    }
                }
            } else if (positions[dnItem].DELIVERY_NOTES_POSITIONS_ID) { // positions = invoices positions
                if (positions[dnItem].ITMNUM === orderPosition.ITMNUM &&
                    positions[dnItem].DELIVERY_NOTES_POSITIONS_ID === orderPosition.ID) {
                    foundSameITMNUM = true;
                    summeDNQty += positions[dnItem].ORDER_QTY;
                    break;
                }
            }
        }
    }
    // if same qty´s not found, check if summe of found qty´s is the same with order´s qty
    if (!foundSameITMNUM && (summeDNQty === orderPosition.ORDER_QTY)) {
        foundSameITMNUM = true;
    }
    return foundSameITMNUM;
}

/**
 * set data for WarehouseController interface
 *
 * @param posForDNC
 * @param insertWRCData
 */
export function setDataForWRCacheInterface(posForDNC: any, insertWRCData: WarehouseReservationCacheInterface[]) {
    if (!posForDNC.WAREHOUSING_MANAGED) {
        for (let whIdsItem in posForDNC['WAREHOUSING_IDS']) {
            if (posForDNC['WAREHOUSING_IDS'].hasOwnProperty(whIdsItem)) {
                // WAREHOUSING_IDS => reservableQty - max of qty = ASSIGNED_QTY
                // WAREHOUSING_IDS => warehousingIdQty - needed number of qty
                insertWRCData.push({
                    warehouseRCId: 0,
                    warehouseRCDocumentNumber: posForDNC.ORDERS_NUMBER,
                    warehouseRCItemNumber: posForDNC.ITMNUM,
                    warehouseRCAssignedQuantity: posForDNC['WAREHOUSING_IDS'][whIdsItem]['warehousingIdQty'], //posForDNC.ASSIGNED_QTY,
                    warehouseRCBatchNumber: posForDNC['WAREHOUSING_IDS'][whIdsItem]['lot'],
                    warehouseRCStorageLocation: posForDNC['WAREHOUSING_IDS'][whIdsItem]['loc'],
                    warehouseRCWarehouse: posForDNC['WAREHOUSING_IDS'][whIdsItem]['warehouse'],
                    warehouseRCPositionId: posForDNC.POSITION_ID,
                    warehouseRCAssignmentDate: getDateForQuery(),
                    warehouseRCWarehousingId: posForDNC['WAREHOUSING_IDS'][whIdsItem]['warehouseId'],
                    warehouseRCOrdersPositionsId: posForDNC.ID,
                    warehouseRCDeliveryNotesPositionsId: null,
                });
            }
        }
    } else {
        // if item is an WAREHOUSE_MANAGED article, so add it to cache too
        // make sure to check it later for WAREHOUSE = NULL and so check at ITEM_BASIS if WAREHOUSE_MANAGED = true
        // to determine it right
        insertWRCData.push({
            warehouseRCId: 0,
            warehouseRCDocumentNumber: posForDNC.ORDERS_NUMBER,
            warehouseRCItemNumber: posForDNC.ITMNUM,
            warehouseRCAssignedQuantity: posForDNC.ASSIGNED_QTY,
            warehouseRCBatchNumber: null,
            warehouseRCStorageLocation: null,
            warehouseRCWarehouse: null,
            warehouseRCPositionId: posForDNC.POSITION_ID,
            warehouseRCAssignmentDate: getDateForQuery(),
            warehouseRCWarehousingId: null,
            warehouseRCOrdersPositionsId: posForDNC.ID,
            warehouseRCDeliveryNotesPositionsId: null,
        });
    }
    return insertWRCData;
}

/**
 * set data for WarehouseController interface
 *
 * @param posForDNC
 * @param updateWData
 */
export function setDataForWarehousing(posForDNC: any, updateWData: WarehousingInterface[]) {
    if (!posForDNC.WAREHOUSING_MANAGED) {
        for (let whIdsItem in posForDNC['WAREHOUSING_IDS']) {
            if (posForDNC['WAREHOUSING_IDS'].hasOwnProperty(whIdsItem)) {
                // WAREHOUSING_IDS => reservableQty - max of qty = ASSIGNED_QTY
                // WAREHOUSING_IDS => warehousingIdQty - needed number of qty
                updateWData.push({
                    warehousingId: posForDNC['WAREHOUSING_IDS'][whIdsItem]['warehouseId'],
                    warehousingLocation: posForDNC['WAREHOUSING_IDS'][whIdsItem]['warehouse'],
                    warehousingItemNumber: posForDNC.ITMNUM,
                    warehousingBatchNumber: posForDNC['WAREHOUSING_IDS'][whIdsItem]['lot'],
                    warehousingStorageLocation: posForDNC['WAREHOUSING_IDS'][whIdsItem]['loc'],
                    warehousingStatusPosition: '', // UNSET
                    warehousingQuantity: 0, // UNSET
                    warehousingReserved: posForDNC['WAREHOUSING_IDS'][whIdsItem]['warehousingIdQty'], //posForDNC.ASSIGNED_QTY,
                    warehousingUpdateLocation: getDateForQuery(),
                });
            }
        }
    }
    return updateWData;
}

/**
 * prepare positions data for warehousing control
 *
 * @param refTable
 * @param elementsArray
 * @param warehouseReservationCacheItems
 * @param warehousingItems
 */
export function prepareDataForWarehousingControl(refTable: string, elementsArray: any,
                                                 warehouseReservationCacheItems: WarehouseReservationCacheInterface[],
                                                 warehousingItems: WarehousingInterface[]) {
    if (refTable === 'orderPosition') {
        for (let elArrItem in elementsArray['whElm']) {
            if (elementsArray['whElm'].hasOwnProperty(elArrItem)) {
                for (let opElArrItem in elementsArray['opElm']['KMP']) {
                    if (elementsArray['opElm']['KMP'].hasOwnProperty(opElArrItem)) {
                        // search for current inserting order position
                        if (elementsArray['whElm'][elArrItem].ORDERS_NUMBER ===
                            elementsArray['opElm']['KMP'][opElArrItem].ORDERS_NUMBER &&
                            elementsArray['whElm'][elArrItem].ITMNUM ===
                            elementsArray['opElm']['KMP'][opElArrItem].ITMNUM &&
                            elementsArray['whElm'][elArrItem].CATEGORY_SOAS ===
                            elementsArray['opElm']['KMP'][opElArrItem].CATEGORY_SOAS &&
                            elementsArray['whElm'][elArrItem].POSITION_ID ===
                            elementsArray['opElm']['KMP'][opElArrItem].POSITION_ID) {
                            // set insert data for WAREHOUSE_RESERVATION_CACHE components
                            warehouseReservationCacheItems =
                                setDataForWRCacheInterface(elementsArray['whElm'][elArrItem],
                                    warehouseReservationCacheItems);
                            warehousingItems =
                                setDataForWarehousing(elementsArray['whElm'][elArrItem], warehousingItems);
                            break;
                        } else {
                            // console.log("Ignored: ", elementsArray['opElm']['KMP'][opElArrItem].ITMNUM + " - " +
                            //     elementsArray['opElm']['KMP'][opElArrItem].CATEGORY_SOAS);
                        }
                    }
                }
            }
        }
    }
    return {warehouseReservationCacheItems, warehousingItems};
}


/*** HELPER FUNCTIONS ***/

/**
 * get all available storage places - LOC from WAREHOUSING
 *
 * @param searchText
 */
export async function getStorageLocations(searchText: string) {
    const STATUS_POS: string = 'A';
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'SEARCH_TEXT', type: sql.VarChar, value: searchText},
        {name: 'STATUS_POS', type: sql.VarChar, value: STATUS_POS}];
    let whQuery: string = `SELECT DISTINCT LOC FROM ` + constants.DB_TABLE_PREFIX + `WAREHOUSING WHERE `;
    if (searchText && searchText.length) {
        whQuery += `LOC LIKE '%' + @SEARCH_TEXT + '%' AND `;
    }
    whQuery += `STATUS_POS = @STATUS_POS ORDER BY LOC ASC`;
    console.log("getStorageLocations - whQuery: ", whQuery);
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, whQuery);
}

/**
 * check if WAREHOUSING table has quantity inconsistency (QTY, RESERVED, (QTY-RESERVED) is lower 0 or RESERVED > QTY)
 * return true if warehouse is consistent
 */
export async function isWarehousingConsistent(): Promise<boolean> {
    let warehouseControl: WarehouseControl = new WarehouseControl();
    let warehousingCheckItems = await warehouseControl.isWarehousingConsistentQuery();
    return !warehousingCheckItems.length;
}

/**
 * get order positions as array of set´s. important if article is added many times in provided order positions.
 *
 * @param orderPositionsData
 */
function getOrderPositionsSetsArray(orderPositionsData: OrderPositionDataInterface[]): [OrderPositionDataInterface[]] {
    let ordersPositions: any|[OrderPositionDataInterface[]] = [];
    let currentSetOrderPositions: OrderPositionDataInterface[] = [];
    for (let item in orderPositionsData) {
        // SET item
        if (orderPositionsData[item].CATEGORY_SOAS !== constants.CATEGORY_SOAS_KOMP) {
            for (let currSetItem in currentSetOrderPositions) {
                if (currentSetOrderPositions &&
                    currentSetOrderPositions[currSetItem]?.ITMNUM === orderPositionsData[item].ITMNUM) {
                    // write set items to result
                    ordersPositions.push(currentSetOrderPositions);
                    // found same item num, so reset current set
                    currentSetOrderPositions = [];
                }
            }
        }
        currentSetOrderPositions.push(orderPositionsData[item]);
    }
    // write last set item to result
    ordersPositions.push(currentSetOrderPositions);
    // console.log('FINAL ordersPositions: ', ordersPositions);
    return ordersPositions;
}
