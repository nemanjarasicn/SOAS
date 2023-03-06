import {WarehouseControl} from '../routes/logic/classes/WarehouseControl';
import {WarehouseReservationCacheInterface} from '../routes/logic/classes/interfaces/WarehouseReservationCacheInterface';
import {WarehousingInterface} from '../routes/logic/classes/interfaces/WarehousingInterface';
import {constants} from '../routes/logic/constants/constants';
import 'mocha';
let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');

describe('WarehouseControl Interface', function () {

    after(function () {
    });

    beforeEach(function () {
        sinon.restore();
    });

    const warehouseControl = new WarehouseControl();

    const warehouseReservationCacheItem: WarehouseReservationCacheInterface = {
        warehouseRCId: 4629,
        warehouseRCDocumentNumber: '50021TT000020',
        warehouseRCItemNumber: 'Testartikel_20210301_Komponente_1',
        warehouseRCAssignedQuantity: 1,
        warehouseRCBatchNumber: 'LO71011010433',
        warehouseRCStorageLocation: 'HXA757',
        warehouseRCWarehouse: '101',
        warehouseRCPositionId: 5000,
        warehouseRCAssignmentDate: "CAST('2021-05-12T15:14:00' AS DATETIME)", // '2021-05-12T15:14:00'
        warehouseRCWarehousingId: 7712,
        warehouseRCOrdersPositionsId: 900000000,
        warehouseRCDeliveryNotesPositionsId: null,
    };

    const warehousingItem: WarehousingInterface = {
        warehousingId: 7712,
        warehousingLocation: '101',
        warehousingItemNumber: 'Testartikel_20210301_Komponente_1',
        warehousingBatchNumber: 'LO71011010433',
        warehousingStorageLocation: 'HXA757',
        warehousingStatusPosition: 'A',
        warehousingQuantity:1,
        warehousingReserved: 1,
        warehousingUpdateLocation: "CAST('2021-05-25T13:31:00' AS DATETIME)",
    };

    const warehousingToItem: WarehousingInterface = {
        warehousingId: 7713,
        warehousingLocation: '101',
        warehousingItemNumber: 'Testartikel_20210301_Komponente_2',
        warehousingBatchNumber: 'LO71011010434',
        warehousingStorageLocation: 'HXA758',
        warehousingStatusPosition: 'A',
        warehousingQuantity: 1,
        warehousingReserved: 1,
        warehousingUpdateLocation: "CAST('2021-05-14T16:38:00' AS DATETIME)",
    };

    const stubValue = {result: false}; // {success: true, data: []};

    describe('#alignWarehouseReservations()', function () {

        // test if alignWarehouseReservations function behaves correctly
        // given correct warehousing data should retrieve stubValue
        // expects detects which of the functions are really called
        // stub supports all the methods of a spy
        it('stub => align warehouse reservations RESERVE - INSERT', async function () {

            let stub1 = sinon.stub(warehouseControl, "checkWarehouseReservationCache")
                .returns([{'IDS_NUMBER': 0}]); // null);

            let stub2 = sinon.stub(warehouseControl, "insertWarehouseReservationCache").onFirstCall().resolves(null);
            let stub3 = sinon.stub(warehouseControl, "updateWarehouseReservationCache").onFirstCall().resolves(null);
            let stub4 = sinon.stub(warehouseControl, "updateWarehousingReserved").onFirstCall().resolves(null);

            expect(await warehouseControl.alignWarehouseReservations(
                constants.WH_CTRL_USE_CASE_TYPES.RESERVED,
                [warehouseReservationCacheItem],
                [warehousingItem])).to.eql(stubValue); // eql compares content and enforces order

            expect(stub1.calledOnce).to.be.true;
            expect(stub2.calledOnce).to.be.true;
            expect(stub3.calledOnce).to.be.false;
            expect(stub4.calledOnce).to.be.true;

        });

        it('stub => align warehouse reservations RESERVE - UPDATE', async function () {

            let stub1 = sinon.stub(warehouseControl, "checkWarehouseReservationCache").returns([{'IDS_NUMBER': 1}]);

            let stub2 = sinon.stub(warehouseControl, "insertWarehouseReservationCache").onFirstCall().resolves(null);
            let stub3 = sinon.stub(warehouseControl, "updateWarehouseReservationCache").onFirstCall().resolves(null);
            let stub4 = sinon.stub(warehouseControl, "updateWarehousingReserved").onFirstCall().resolves(null);

            expect(await warehouseControl.alignWarehouseReservations(
                constants.WH_CTRL_USE_CASE_TYPES.RESERVED,
                [warehouseReservationCacheItem],
                [warehousingItem])).to.eql(stubValue);

            expect(stub1.calledOnce).to.be.true;
            expect(stub2.calledOnce).to.be.false;
            expect(stub3.calledOnce).to.be.true;
            expect(stub4.calledOnce).to.be.true;

        });

        it('stub => align warehouse reservations DERESERVE - DELETE', async function () {

            let stub1 = sinon.stub(warehouseControl, "deleteFromWarehouseReservationCache").returns(null);
            let stub2 = sinon.stub(warehouseControl, "insertWarehouseReservationCache").onFirstCall().resolves(null);
            let stub3 = sinon.stub(warehouseControl, "updateWarehouseReservationCache").onFirstCall().resolves(null);
            let stub4 = sinon.stub(warehouseControl, "updateWarehousingReserved").onFirstCall().resolves(null);

            expect(await warehouseControl.alignWarehouseReservations(
                constants.WH_CTRL_USE_CASE_TYPES.DERESERVED,
                [warehouseReservationCacheItem],
                [warehousingItem])).to.eql(stubValue);

            expect(stub1.calledOnce).to.be.true;
            expect(stub2.calledOnce).to.be.false;
            expect(stub3.calledOnce).to.be.false;
            expect(stub4.calledOnce).to.be.true;

        });

    });

    describe('#reserveStock()', function () {

        it('stub => reserve stock on WAREHOUSE_RESERVATION_CACHE', async function() {

            let stub1 = sinon.stub(warehouseControl, "alignWarehouseReservations").returns(stubValue);

            expect(await warehouseControl.reserveStock( '', warehouseReservationCacheItem)).to.eql(stubValue);

            expect(stub1.calledOnce).to.be.true;

        });

    });

    describe('#dereserveStock()', function () {

        it('stub => dereserve stock on WAREHOUSE_RESERVATION_CACHE', async function() {

            let stub1 = sinon.stub(warehouseControl, "loadFromWarehouseReservationCache")
                .returns([warehouseReservationCacheItem]);
            let stub2 = sinon.stub(warehouseControl, "loadFromWarehousing").returns([warehousingItem]);
            // let stub3 = sinon.stub(warehouseControl, "getDateForQuery").returns(
            //     "GETDATE() AT TIME ZONE '" + constants.TIME_ZONE_BASE + "' " +
            //     "AT TIME ZONE '" + constants.TIME_ZONE_CURRENT + "' "
            // );
            let stub4 = sinon.stub(warehouseControl, "alignWarehouseReservations").returns(stubValue);

            expect(await warehouseControl.dereserveStock( '', warehouseReservationCacheItem))
                .to.eql([stubValue]);

            expect(stub1.calledOnce).to.be.true;
            expect(stub2.calledOnce).to.be.true;
            // expect(stub3.calledOnce).to.be.true;
            expect(stub4.calledOnce).to.be.true;

        });

    });

    describe('#moveStock()', function () {

        it('stub => moveStock - updates the stock on 2 given storage places and batches', async function() {

            let stub1 = sinon.stub(warehouseControl, "updateWarehousingQty").returns(null);

            expect(await warehouseControl.moveStock(warehousingItem.warehousingId,
                warehousingToItem.warehousingId, 1)).to.eql(null);

            expect(stub1.calledTwice).to.be.true;

        });

        it('stub => moveAndDeleteStock - update warehouse to-location and delete from-location',
            async function() {

            let stub1 = sinon.stub(warehouseControl, "updateWarehousingQty").returns(null);
            let stub2 = sinon.stub(warehouseControl, "deleteFromWarehousing").returns(null);

            expect(await warehouseControl.moveAndDeleteStock(warehousingItem.warehousingId,
                warehousingToItem.warehousingId, 1)).to.eql(null);

            expect(stub1.calledOnce).to.be.true;
            expect(stub2.calledOnce).to.be.true;

        });

        it('stub => moveAndCreateStock - create new warehouse to-location and update from-location', async function() {

            let stub1 = sinon.stub(warehouseControl, "insertWarehousing").returns(null);
            let stub2 = sinon.stub(warehouseControl, "updateWarehousingQty").returns(null);

            expect(await warehouseControl.moveAndCreateStock(warehousingItem.warehousingId,
                warehousingToItem, 1)).to.eql(null);

            expect(stub1.calledOnce).to.be.true;
            expect(stub2.calledOnce).to.be.true;

        });

        it('stub => replaceStock - replace warehouse from-location with to-location', async function() {

            let stub1 = sinon.stub(warehouseControl, "updateWarehousingLoc").returns(null);

            expect(await warehouseControl.replaceStock(warehousingItem.warehousingId, '101'))
                .to.eql(null);

            expect(stub1.calledOnce).to.be.true;

        });

    });

    describe('#postStock()', function () {

        it('stub => reduces the physical stock of the storage place', async function() {

            let stub1 = sinon.stub(warehouseControl, "deleteFromWarehouseReservationCache").returns(null);
            let stub2 = sinon.stub(warehouseControl, "updateWarehousingReserved").returns(null);
            let stub3 = sinon.stub(warehouseControl, "updateWarehousingQty").returns(null);
            let stub4 = sinon.stub(warehouseControl, "checkForEmptyWarehousingItem").returns(null);

            expect(await warehouseControl.postStock(warehouseReservationCacheItem, warehousingItem)).to.eql(null);

            expect(stub1.calledOnce).to.be.true;
            expect(stub2.calledOnce).to.be.true;
            expect(stub3.calledOnce).to.be.true;
            expect(stub4.calledOnce).to.be.true;

        });

    });

});
