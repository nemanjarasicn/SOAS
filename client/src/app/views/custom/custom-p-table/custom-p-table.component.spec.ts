import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {CustomPTableComponent} from './custom-p-table.component';
import {RxFormBuilder} from "@rxweb/reactive-form-validators";
import {TestingModule} from "../../../testing/testing.module";
import {TranslateItPipe} from "../../../shared/pipes/translate-it.pipe";
import {OrdersTestConstants} from "../../../../assets/test-constants/orders";
import {
  ConstantsService,
  ORDER_POSITIONS_COLS,
  PRICE_LIST_SALES_POSITIONS_COLS
} from "../../../_services/constants.service";
import {FetchTableService} from "../../../_services/fetch-table.service";
import {OrderPositionItem} from "../../../interfaces/order-position-item";
import {StatesTestConstants} from "../../../../assets/test-constants/states";
import {DeliveryNotesTestConstants} from "../../../../assets/test-constants/delivery-notes";
import {PriceListSalesTestConstants} from "../../../../assets/test-constants/price-list-sales";
import {FormOptionsNVS} from "../../../interfaces/form-options";
import {Confirmation, ConfirmationService, MessageService} from "primeng/api";
import {MessagesService} from "../../../_services/messages.service";
import {TableDataService} from "../../../_services/table-data.service";
import {PricelistSales} from "../../../interfaces/price-list-sales-item";

describe('CustomPTableComponent', () => {
  let component: CustomPTableComponent;
  let fixture: ComponentFixture<CustomPTableComponent>;
  let constantsService: ConstantsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [CustomPTableComponent, TranslateItPipe],
      providers: [RxFormBuilder, TranslateItPipe, ConstantsService, MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomPTableComponent);
    component = fixture.componentInstance;
    constantsService = TestBed.inject(ConstantsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set full edit mode', () => {

    // Arrange
    const editMode: boolean = true;

    // Act
    component.setFullEditMode(editMode);

    // Assert
    expect(component.fullEditMode).toEqual(editMode);
  });

  it('should set dataIsAvailableFlag', () => {

    // Arrange
    const dataIsAvailableFlag: boolean = true;

    // Act
    component.setDataIsAvailableFlag(dataIsAvailableFlag);

    // Assert
    expect(component.dataIsAvailableFlag).toEqual(dataIsAvailableFlag);
  });

  it('should return highlightSetPosition empty color', () => {

    // Arrange
    const refTable: string = "priceListSalesDetails";
    const rowIndex: number = 0;
    const resultColor: string = '';
    component.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM];

    // Act
    let result = component.highlightSetPosition(refTable, rowIndex);

    // Assert
    expect(result).toEqual(resultColor);
  });

  it('should return highlightSetPosition lightgrey color', () => {

    // Arrange
    const refTable: string = "other";
    const rowIndex: number = 0;
    const resultColor: string = 'lightgrey';
    component.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM];

    // Act
    let result = component.highlightSetPosition(refTable, rowIndex);

    // Assert
    expect(result).toEqual(resultColor);
  });

  it('should send service result', function () {

    // Arrange
    const dataObj: {
      refTableName: string, fieldName: string, disableSaveButton: boolean, positions: string[],
      refreshDetailView: boolean
    } = {
      refTableName: constantsService.REFTABLE_ORDERS, fieldName: 'field', disableSaveButton: true, positions: [],
      refreshDetailView: true
    };
    const fetchTableService: FetchTableService = TestBed.inject(FetchTableService);
    spyOn(fetchTableService, 'setDataObs').and.callThrough();

    // Act
    component.sendServiceResult(dataObj);

    // Assert
    expect(fetchTableService.setDataObs).toHaveBeenCalled();
  });

  it('should initialize table', fakeAsync(() => {

    // Arrange
    const tableValues: OrderPositionItem[] = [];

    // Act
    component.initTable(tableValues);

    // Assert
    expect(component.positionsWithId).toEqual(tableValues);
  }));

  it('should add item', () => {

    // Arrange
    const item: OrderPositionItem = OrdersTestConstants.ORDERS_POSITION_ITEM;

    // Act
    component.addItem(item);

    // Assert
    expect(component.positionsWithId[0]).toEqual(item);
  });

  it('should set columns', () => {

    // Arrange
    const columns: any[] = [];

    // Act
    component.setCols(columns);

    // Assert
    expect(component.cols).toEqual(columns);
  });

  it('should set rows', () => {

    // Arrange
    const rows: number = 5;

    // Act
    component.setRows(rows);

    // Assert
    expect(component.rows).toEqual(rows);
  });

  it('should shown order position field as input, if positions status is not allocated', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS_POSITIONS;
    const rowIndex: number = 0;
    const colField: string = OrdersTestConstants.ORDERS_POSITION_ITEM.ORDERS_NUMBER;
    const expectedResult: boolean = true;
    component.fullEditMode = true;
    component.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM];
    // set position status to 0, so it is not allocated
    component.positionsWithId[rowIndex].POSITION_STATUS = 0;
    component.ordPosStates = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;

    // Act
    const result: boolean = component.showPositionAsInput(refTable, rowIndex, colField);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not shown order position field as input, if positions status is allocated', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS_POSITIONS;
    const rowIndex: number = 0;
    const colField: string = OrdersTestConstants.ORDERS_POSITION_ITEM.ORDERS_NUMBER;
    const expectedResult: boolean = false;
    component.fullEditMode = true;
    component.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM];
    // set position status is 1, so it is allocated
    component.positionsWithId[rowIndex].POSITION_STATUS = 1;
    component.ordPosStates = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;

    // Act
    const result: boolean = component.showPositionAsInput(refTable, rowIndex, colField);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not shown order position field as input, if positions are empty', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS_POSITIONS;
    const rowIndex: number = 0;
    const colField: string = OrdersTestConstants.ORDERS_POSITION_ITEM.ORDERS_NUMBER;
    const expectedResult: boolean = false;
    component.fullEditMode = true;
    component.positionsWithId = [];
    component.ordPosStates = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;

    // Act
    const result: boolean = component.showPositionAsInput(refTable, rowIndex, colField);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not shown order position field as input, if states are empty', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS_POSITIONS;
    const rowIndex: number = 0;
    const colField: string = OrdersTestConstants.ORDERS_POSITION_ITEM.ORDERS_NUMBER;
    const expectedResult: boolean = false;
    component.fullEditMode = true;
    component.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM];
    component.ordPosStates = [];

    // Act
    const result: boolean = component.showPositionAsInput(refTable, rowIndex, colField);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not shown position field as input for delivery note positions', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_DELIVERY_NOTES_POSITIONS;
    const expectedResult: boolean = false;
    const rowIndex: number = 0;
    const colField: string = DeliveryNotesTestConstants.DELIVERY_NOTE_POSITION_ITEM.ORDERS_NUMBER;

    // Act
    const result: boolean = component.showPositionAsInput(refTable, rowIndex, colField);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not shown position field as input for price list details', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_PRILISTS_DETAILS;
    const expectedResult: boolean = false;
    const rowIndex: number = 0;

    // Act
    const result: boolean = component.showPositionAsInput(refTable, rowIndex);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not shown position field as input for articles', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ARTICLES;
    const expectedResult: boolean = false;
    const rowIndex: number = 0;

    // Act
    const result: boolean = component.showPositionAsInput(refTable, rowIndex);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should shown position field ITMDES as text area for orders positions', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS_POSITIONS;
    const rowIndex: number = 0;
    const colField: string = ORDER_POSITIONS_COLS[4].field; // 'ITMDES'
    component.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM];
    component.releaseFlag = false;
    component.fullEditMode = true;
    const expectedResult: boolean = true;

    // Act
    const result: boolean = component.showPositionAsTextArea(refTable, rowIndex, colField);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not shown position field ITMDES as text area for empty orders positions', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS_POSITIONS;
    const rowIndex: number = 0;
    const colField: string = ORDER_POSITIONS_COLS[4].field; // 'ITMDES'
    component.positionsWithId = [];
    component.releaseFlag = false;
    component.fullEditMode = true;
    const expectedResult: boolean = false;

    // Act
    const result: boolean = component.showPositionAsTextArea(refTable, rowIndex, colField);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not shown position field as text area for delivery notes positions', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_DELIVERY_NOTES_POSITIONS;
    const rowIndex: number = 0;
    const expectedResult: boolean = false;

    // Act
    const result: boolean = component.showPositionAsTextArea(refTable, rowIndex);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not shown position field as text area for price list details', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_PRILISTS_DETAILS;
    const rowIndex: number = 0;
    const expectedResult: boolean = false;

    // Act
    const result: boolean = component.showPositionAsTextArea(refTable, rowIndex);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not shown position field as text area for articles', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ARTICLES;
    const rowIndex: number = 0;
    const expectedResult: boolean = false;

    // Act
    const result: boolean = component.showPositionAsTextArea(refTable, rowIndex);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should shown position field as input number for price list details', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_PRILISTS_DETAILS;
    const rowIndex: number = 0;
    const field: string = 'PRICE_NET';
    const expectedResult: boolean = true;
    spyOn(component, 'getColsItemProperties').and.callThrough();

    // Act
    const result: boolean = component.showPositionAsInputNumber(refTable, rowIndex, field);

    // Assert
    expect(component.getColsItemProperties).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

  it('should not shown position field as input number for order positions', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS_POSITIONS;
    const rowIndex: number = 0;
    const field: string = '';
    const expectedResult: boolean = false;

    // Act
    const result: boolean = component.showPositionAsInputNumber(refTable, rowIndex, field);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not shown position field as input number for delivery notes positions', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_DELIVERY_NOTES_POSITIONS;
    const rowIndex: number = 0;
    const field: string = '';
    const expectedResult: boolean = false;

    // Act
    const result: boolean = component.showPositionAsInputNumber(refTable, rowIndex, field);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not shown position field as input number for articles', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ARTICLES;
    const rowIndex: number = 0;
    const field: string = '';
    const expectedResult: boolean = false;

    // Act
    const result: boolean = component.showPositionAsInputNumber(refTable, rowIndex, field);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should shown position field as span for orders positions, if order is released', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS_POSITIONS;
    const rowIndex: number = 0;
    const colField: string = ORDER_POSITIONS_COLS[4].field; // 'ITMDES'
    component.releaseFlag = true;
    component.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM];
    const expectedResult: boolean = true;

    // Act
    const result: boolean = component.showPositionAsSpan(refTable, rowIndex, colField);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should shown position field as span for orders positions, if full edit mode is false', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS_POSITIONS;
    const rowIndex: number = 0;
    const colField: string = ORDER_POSITIONS_COLS[4].field; // 'ITMDES'
    component.releaseFlag = false;
    component.fullEditMode = false;
    component.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM];
    const expectedResult: boolean = true;

    // Act
    const result: boolean = component.showPositionAsSpan(refTable, rowIndex, colField);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should shown position field as span for orders positions, if position is partially allocated', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS_POSITIONS;
    const rowIndex: number = 0;
    const colField: string = ORDER_POSITIONS_COLS[4].field; // 'ITMDES'
    component.releaseFlag = false;
    component.fullEditMode = true;
    component.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM_KOMP];
    // set positions status to 2 (partially allocated)
    component.positionsWithId[rowIndex].POSITION_STATUS = 2;
    component.ordPosStates = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;
    const expectedResult: boolean = true;

    // Act
    const result: boolean = component.showPositionAsSpan(refTable, rowIndex, colField);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should shown position field as span for orders positions, if position is completely allocated', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS_POSITIONS;
    const rowIndex: number = 0;
    const colField: string = ORDER_POSITIONS_COLS[7].field; // 'ASSIGNED_QTY'
    component.releaseFlag = false;
    component.fullEditMode = true;
    component.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM];
    // set positions status to 3 (completely allocated)
    component.positionsWithId[rowIndex].POSITION_STATUS = 3;
    component.ordPosStates = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;
    component.cols = ORDER_POSITIONS_COLS;
    spyOn(component, 'getColsItemProperties').and.callThrough();
    const expectedResult: boolean = true;

    // Act
    const result: boolean = component.showPositionAsSpan(refTable, rowIndex, colField);

    // Assert
    expect(component.getColsItemProperties).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

  it('should not shown position field as span for orders positions, if positions not set', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS_POSITIONS;
    const rowIndex: number = 0;
    const colField: string = ORDER_POSITIONS_COLS[7].field; // 'ASSIGNED_QTY'
    component.releaseFlag = false;
    component.fullEditMode = true;
    component.positionsWithId = [];
    component.ordPosStates = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;
    component.cols = ORDER_POSITIONS_COLS;
    spyOn(component, 'getColsItemProperties').and.callThrough();
    const expectedResult: boolean = false;

    // Act
    const result: boolean = component.showPositionAsSpan(refTable, rowIndex, colField);

    // Assert
    expect(component.getColsItemProperties).not.toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

  it('should shown position field as span for delivery notes positions', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_DELIVERY_NOTES_POSITIONS;
    const rowIndex: number = 0;
    const colField: string = '';
    const expectedResult: boolean = true;

    // Act
    const result: boolean = component.showPositionAsSpan(refTable, rowIndex, colField);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should shown position field as span for price list details', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_PRILISTS_DETAILS;
    const rowIndex: number = 0;
    const colField: string = 'PRICE_BRU';
    const expectedResult: boolean = true;
    component.cols = PRICE_LIST_SALES_POSITIONS_COLS;
    spyOn(component, 'getColsItemProperties').and.callThrough();

    // Act
    const result: boolean = component.showPositionAsSpan(refTable, rowIndex, colField);

    // Assert
    expect(component.getColsItemProperties).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

  it('should not shown position field as span for articles', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ARTICLES;
    const rowIndex: number = 0;
    const colField: string = '';
    const expectedResult: boolean = false;

    // Act
    const result: boolean = component.showPositionAsSpan(refTable, rowIndex, colField);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should shown position state text for order positions', () => {

    // Arrange
    const tableType: string = 'ord';
    const column: string = 'POSITION_STATUS';
    const posState: number = 3;
    component.ordPosStates = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;
    const expectedResult: string = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS[4].name;

    // Act
    const result: string = component.showPositionStateText(tableType, column, posState);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should shown position state text for delivery notes positions', () => {

    // Arrange
    const tableType: string = 'dlv';
    const column: string = 'POSITION_STATUS';
    const posState: number = 2;
    component.dlvPosStates = StatesTestConstants.STATES_SELECT_LI_POSITIONS;
    const expectedResult: string = StatesTestConstants.STATES_SELECT_LI_POSITIONS[3].name;

    // Act
    const result: string = component.showPositionStateText(tableType, column, posState);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should shown position state text for invoice positions', () => {

    // Arrange
    const tableType: string = 'inv';
    const column: string = 'POSITION_STATUS';
    const posState: number = 1;
    component.invPosStates = StatesTestConstants.STATES_SELECT_RG_POSITIONS;
    const expectedResult: string = StatesTestConstants.STATES_SELECT_RG_POSITIONS[2].name;

    // Act
    const result: string = component.showPositionStateText(tableType, column, posState);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return given position state, if column is empty', () => {

    // Arrange
    const tableType: string = 'inv';
    const column: string = '';
    const posState: number = 1;
    const expectedResult: string = posState.toString();

    // Act
    const result: string = component.showPositionStateText(tableType, column, posState);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should set order position states', () => {

    // Arrange
    const states: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;

    // Act
    component.setOrderPositionStates(states);

    // Assert
    expect(component.ordPosStates).toEqual(states);
  });

  it('should set delivery notes position states', () => {

    // Arrange
    const states: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_LI_POSITIONS;

    // Act
    component.setDlvPositionStates(states);

    // Assert
    expect(component.dlvPosStates).toEqual(states);
  });

  it('should set invoice position states', () => {

    // Arrange
    const states: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_RG_POSITIONS;

    // Act
    component.setInvPositionStates(states);

    // Assert
    expect(component.invPosStates).toEqual(states);
  });

  it('should show delete button for set position of order position', () => {

    // Arrange
    const rowIndex: number = 0;
    component.refTable = constantsService.REFTABLE_ORDERS_POSITIONS;
    component.dataIsAvailableFlag = true;
    component.releaseFlag = false;
    component.formDisabledFlag = false;
    component.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM];
    component.ordPosStates = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;
    const expectedResult: boolean = true;

    // Act
    const result: boolean = component.showDeleteButtonForSetPosition(rowIndex);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should show delete button for set position of price list sales details', () => {

    // Arrange
    const rowIndex: number = 0;
    component.refTable = constantsService.REFTABLE_PRILISTS_DETAILS;
    component.dataIsAvailableFlag = true;
    const expectedResult: boolean = true;

    // Act
    const result: boolean = component.showDeleteButtonForSetPosition(rowIndex);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not show delete button for set position of articles', () => {

    // Arrange
    const rowIndex: number = 0;
    component.refTable = constantsService.REFTABLE_ARTICLES;
    const expectedResult: boolean = false;

    // Act
    const result: boolean = component.showDeleteButtonForSetPosition(rowIndex);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should delete position for orders positions', fakeAsync(() => {

    // Arrange
    const position: OrderPositionItem = OrdersTestConstants.ORDERS_POSITION_ITEM;
    const index: number = 0;
    component.refTable = constantsService.REFTABLE_ORDERS_POSITIONS;
    component.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM];
    const service: MessagesService = TestBed.inject(MessagesService);
    const confirmationService: ConfirmationService = TestBed.inject(ConfirmationService);
    const tableServiceResponse = true;
    const tableDataService = TestBed.inject(TableDataService);
    const deliveryNotePositionsDbData = DeliveryNotesTestConstants.DELIVERY_NOTE_POSITIONS_EMPTY_TABLE_DB_DATA;
    const orderPositionsDbData = OrdersTestConstants.ORDERS_POSITIONS_TABLE_DB_DATA;
    spyOn(confirmationService, 'confirm').and.callFake((confirmation: Confirmation) => confirmation.accept());
    spyOn(tableDataService, 'getTableDataById').and.returnValues(Promise.resolve(deliveryNotePositionsDbData),
      Promise.resolve(orderPositionsDbData));
    spyOn(tableDataService, 'deleteTableData').and.returnValue(Promise.resolve({'result': true}));

    // Act
    component.deletePosition(position, index);

    // Assert
    expectAsync(service.showConfirmationDialog('dialogTitle', 'dialogMessage',
      'buttonYesText', 'buttonNoText')).toBeResolvedTo(tableServiceResponse);
    expect(tableDataService.getTableDataById).toHaveBeenCalled();
    // expect(tableDataService.deleteTableData).toHaveBeenCalled();
  }));

  it('should delete position for price list sales details', fakeAsync(() => {

    // Arrange
    const position: PricelistSales = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM;
    const index: number = 0;
    component.refTable = constantsService.REFTABLE_PRILISTS_DETAILS;
    component.positionsWithId = [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM];
    const service: MessagesService = TestBed.inject(MessagesService);
    const confirmationService: ConfirmationService = TestBed.inject(ConfirmationService);
    const tableServiceResponse = true;
    const tableDataService = TestBed.inject(TableDataService);
    spyOn(confirmationService, 'confirm').and.callFake((confirmation: Confirmation) => confirmation.accept());
    spyOn(tableDataService, 'deleteTableData').and.returnValue(Promise.resolve({'result': true}));
    // const fetchTableService: FetchTableService = TestBed.inject(FetchTableService);
    // spyOn(fetchTableService,'setDataObs').and.callThrough();

    // Act
    component.deletePosition(position, index);

    // Assert
    expectAsync(service.showConfirmationDialog('dialogTitle', 'dialogMessage',
      'buttonYesText', 'buttonNoText')).toBeResolvedTo(tableServiceResponse);
    expect(tableDataService.deleteTableData).toHaveBeenCalled();
    // expect(fetchTableService.setDataObs).toHaveBeenCalled();
  }));

  it('should not delete position for orders positions, if no delivery note positions was found', fakeAsync(() => {

    // Arrange
    const position: OrderPositionItem = OrdersTestConstants.ORDERS_POSITION_ITEM;
    const index: number = 0;
    component.refTable = constantsService.REFTABLE_ORDERS_POSITIONS;
    const service: MessagesService = TestBed.inject(MessagesService);
    const confirmationService: ConfirmationService = TestBed.inject(ConfirmationService);
    const tableServiceResponse = true;
    const tableDataService = TestBed.inject(TableDataService);
    const deliveryNotePositionsDbData = undefined; // DeliveryNotesTestConstants.DELIVERY_NOTE_POSITION_ITEM;
    spyOn(confirmationService, 'confirm').and.callFake((confirmation: Confirmation) => confirmation.accept());
    spyOn(tableDataService, 'getTableDataById').and.returnValue(Promise.resolve(deliveryNotePositionsDbData));

    // Act
    component.deletePosition(position, index);

    // Assert
    expectAsync(service.showConfirmationDialog('dialogTitle', 'dialogMessage',
      'buttonYesText', 'buttonNoText')).toBeResolvedTo(tableServiceResponse);
    expect(tableDataService.getTableDataById).toHaveBeenCalled();
  }));

  it('should set referral table', () => {

    // Arrange
    const name: string = constantsService.REFTABLE_ARTICLES;

    // Act
    component.setRefTable(name);

    // Assert
    expect(component.refTable).toEqual(name);
  });

  it('should set data key', () => {

    // Arrange
    const key: string = 'key';

    // Act
    component.setDataKey(key);

    // Assert
    expect(component.dataKey).toEqual(key);
  });

  it('should return max input number as number of 100', () => {

    // Arrange
    const field: string = 'PRIORITY';
    const expectedResult: number = constantsService.PRILISTS_PRIORITY_MAX;

    // Act
    const result: number = component.getInputNumberMax(field);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should check for errors', () => {

    // Arrange
    const id: string = 'error1';
    component.errorTdId = 'error1';
    component.errorMessage = 'error message';
    spyOn(component, 'sendServiceResult').and.callThrough();

    // Act
    component.checkForErrors(id);

    // Assert
    expect(component.errorTdId).toEqual(id);
    expect(component.sendServiceResult).toHaveBeenCalled();
  });

  it('should return max input number as default number of 1000000', () => {

    // Arrange
    const field: string = '';
    const expectedResult: number = constantsService.DEFAULT_PRIORITY_MAX;

    // Act
    const result: number = component.getInputNumberMax(field);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return min input number as number of 0', () => {

    // Arrange
    const expectedResult: number = constantsService.PRILISTS_PRIORITY_MIN;

    // Act
    const result: number = component.getInputNumberMin();

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return min fraction digits as number of 0', () => {

    // Arrange
    const field: string = 'PRIORITY';
    const expectedResult: number = 0;

    // Act
    const result: number = component.getMinFractionDigits(field);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return min fraction digits as min number of 2', () => {

    // Arrange
    const field: string = '';
    const expectedResult: number = constantsService.FRACTION_DIGITS_MIN;

    // Act
    const result: number = component.getMinFractionDigits(field);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return max fraction digits as number of 0', () => {

    // Arrange
    const field: string = 'PRIORITY';
    const expectedResult: number = 0;

    // Act
    const result: number = component.getMaxFractionDigits(field);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return max fraction digits as max number of 5', () => {

    // Arrange
    const field: string = '';
    const expectedResult: number = constantsService.FRACTION_DIGITS_MAX;

    // Act
    const result: number = component.getMaxFractionDigits(field);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return input number show button boolean true', () => {

    // Arrange
    const field: string = 'PRIORITY';
    const expectedResult: boolean = true;

    // Act
    const result: boolean = component.getInputNumberShowButtons(field);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return input number styles', () => {

    // Arrange
    const field: string = 'PRIORITY';
    const expectedResult: { 'width': string } = {'width': '100%'};

    // Act
    const result: { 'width': string } = component.getInputNumberStyles(field);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should validate input change for field name of ITMDES', () => {

    // Arrange
    const eventMock: Event = <Event><any>{code: 'keyUp', target: {value: 'text'}};
    const fieldName: string = 'ITMDES';
    const tdId: string = 'error id';
    const row: any = undefined;
    component.errorTdId = 'error id';
    const expectedResetState: boolean = false;
    const expectedErrorTdId: string = '';
    component.disableSaveButton = Function();
    spyOn(component, 'disableSaveButton').and.callThrough();
    spyOn(component, 'sendServiceResult').and.callThrough();

    // Act
    component.inputChangeValidation(eventMock, fieldName, tdId, row);

    // Assert
    expect(component.resetState).toEqual(expectedResetState);
    expect(component.errorTdId).toEqual(expectedErrorTdId);
    expect(component.sendServiceResult).toHaveBeenCalled();
  });

  it('should validate input change for field name of PRICE_NET for orders positions', () => {

    // Arrange
    const fieldName: string = 'PRICE_NET';
    let inputElement: HTMLInputElement = document.createElement(fieldName) as HTMLInputElement;
    inputElement.value = '150.70';
    const eventMock: Event = <Event><any>{code: 'keyUp', target: inputElement};
    const tdId: string = 'error id';
    const row: any = undefined;
    component.errorTdId = 'error id';
    const expectedResetState: boolean = false;
    const expectedErrorTdId: string = '';
    component.inputValidationPriceCalculation = Function();
    component.refTable = constantsService.REFTABLE_ORDERS_POSITIONS;
    spyOn(component, 'inputValidationPriceCalculation').and.callThrough();

    // Act
    component.inputChangeValidation(eventMock, fieldName, tdId, row);

    // Assert
    expect(component.resetState).toEqual(expectedResetState);
    expect(component.errorTdId).toEqual(expectedErrorTdId);
  });

  it('should validate input change for field name of PRICE_NET for price list sales details', () => {

    // Arrange
    const fieldName: string = 'PRICE_NET';
    let inputElement: HTMLInputElement = document.createElement(fieldName) as HTMLInputElement;
    inputElement.value = '150.70';
    const eventMock: Event = <Event><any>{code: 'keyUp', target: inputElement};
    const tdId: string = 'error id';
    const row: any = undefined;
    component.errorTdId = 'error id';
    const expectedResetState: boolean = false;
    const expectedErrorTdId: string = '';
    component.refTable = constantsService.REFTABLE_PRILISTS_DETAILS;
    spyOn(component, 'sendServiceResult').and.callThrough();

    // Act
    component.inputChangeValidation(eventMock, fieldName, tdId, row);

    // Assert
    expect(component.resetState).toEqual(expectedResetState);
    expect(component.errorTdId).toEqual(expectedErrorTdId);
    expect(component.sendServiceResult).toHaveBeenCalled();
  });

  it('should validate input change for field name of PRICE_NET if price is not a number', () => {

    // Arrange
    const fieldName: string = 'PRICE_NET';
    let inputElement: HTMLInputElement = document.createElement(fieldName) as HTMLInputElement;
    inputElement.value = 'abc';
    const eventMock: Event = <Event><any>{code: 'keyUp', target: inputElement};
    const tdId: string = 'error id';
    const row: any = undefined;
    component.errorTdId = 'error id';
    const expectedResetState: boolean = false;
    const expectedErrorTdId: string = 'error id';
    component.refTable = constantsService.REFTABLE_PRILISTS_DETAILS;
    const messagesService: MessagesService = TestBed.inject(MessagesService);
    spyOn(component, 'sendServiceResult').and.callThrough();
    spyOn(messagesService, 'getErrorMessage').and.callThrough();

    // Act
    component.inputChangeValidation(eventMock, fieldName, tdId, row);

    // Assert
    expect(component.resetState).toEqual(expectedResetState);
    expect(component.errorTdId).toEqual(expectedErrorTdId);
    expect(component.sendServiceResult).toHaveBeenCalled();
    expect(messagesService.getErrorMessage).toHaveBeenCalled();
  });

  it('should validate input change for field name of PRICE_NET if price is a number of 0.01', () => {

    // Arrange
    const fieldName: string = 'PRICE_NET';
    let inputElement: HTMLInputElement = document.createElement(fieldName) as HTMLInputElement;
    inputElement.value = '0.01';
    const eventMock: Event = <Event><any>{code: 'keyUp', target: inputElement};
    const tdId: string = 'error id';
    const row: any = undefined;
    component.errorTdId = 'error id';
    const expectedResetState: boolean = false;
    const expectedErrorTdId: string = '';
    component.refTable = constantsService.REFTABLE_PRILISTS_DETAILS;
    component.translatePipe = TestBed.inject(TranslateItPipe);
    const messagesService: MessagesService = TestBed.inject(MessagesService);
    spyOn(component, 'sendServiceResult').and.callThrough();
    spyOn(component.translatePipe, 'transform').and.callThrough();
    spyOn(messagesService, 'getErrorMessage').and.callThrough();

    // Act
    component.inputChangeValidation(eventMock, fieldName, tdId, row);

    // Assert
    expect(component.resetState).toEqual(expectedResetState);
    expect(component.errorTdId).toEqual(expectedErrorTdId);
    expect(component.sendServiceResult).toHaveBeenCalled();
    expect(messagesService.getErrorMessage).not.toHaveBeenCalled();
  });

  it('should validate input change for field name of PRICE_BRU if price is a number of 0', () => {

    // Arrange
    const fieldName: string = 'PRICE_BRU';
    let inputElement: HTMLInputElement = document.createElement(fieldName) as HTMLInputElement;
    inputElement.value = '0';
    const eventMock: Event = <Event><any>{code: 'keyUp', target: inputElement};
    const tdId: string = 'error id';
    const row: any = undefined;
    component.errorTdId = 'error id';
    component.translatePipe = TestBed.inject(TranslateItPipe);
    // spyOn(component,'sendServiceResult').and.callThrough();

    // Act
    component.inputChangeValidation(eventMock, fieldName, tdId, row);

    // Assert
    // expect(component.sendServiceResult).toHaveBeenCalled();
  });

  it('should validate input change for field name of PRICE_BRU if price is a number of 0.01', () => {

    // Arrange
    const fieldName: string = 'PRICE_BRU';
    let inputElement: HTMLInputElement = document.createElement(fieldName) as HTMLInputElement;
    inputElement.value = '0.01';
    const eventMock: Event = <Event><any>{code: 'keyUp', target: inputElement};
    const tdId: string = 'error id';
    const row: any = undefined;
    component.errorTdId = 'error id';

    // Act
    component.inputChangeValidation(eventMock, fieldName, tdId, row);

    // Assert
  });

  it('should validate input change for field name of DEFAULT', () => {

    // Arrange
    const fieldName: string = 'DEFAULT';
    let inputElement: HTMLInputElement = document.createElement(fieldName) as HTMLInputElement;
    inputElement.value = '0.01';
    const eventMock: Event = <Event><any>{code: 'keyUp', target: inputElement};
    const tdId: string = 'error id';
    const row: any = undefined;
    component.errorTdId = 'error id';
    const expectedResetState: boolean = false;
    const expectedErrorTdId: string = '';
    component.refTable = constantsService.REFTABLE_PRILISTS_DETAILS;
    component.translatePipe = TestBed.inject(TranslateItPipe);
    spyOn(component, 'sendServiceResult').and.callThrough();
    spyOn(component.translatePipe, 'transform').and.callThrough();

    // Act
    component.inputChangeValidation(eventMock, fieldName, tdId, row);

    // Assert
    expect(component.resetState).toEqual(expectedResetState);
    expect(component.errorTdId).toEqual(expectedErrorTdId);
    expect(component.sendServiceResult).toHaveBeenCalled();
  });

  it('should validate input change for field name of DEFAULT and empty input value', () => {

    // Arrange
    const fieldName: string = 'DEFAULT';
    let inputElement: HTMLInputElement = document.createElement(fieldName) as HTMLInputElement;
    inputElement.value = '';
    const eventMock: Event = <Event><any>{code: 'keyUp', target: inputElement};
    const tdId: string = 'error id';
    const row: any = undefined;
    component.errorTdId = 'error id';
    const expectedResetState: boolean = false;
    const expectedErrorTdId: string = 'error id';
    component.refTable = constantsService.REFTABLE_PRILISTS_DETAILS;
    component.translatePipe = TestBed.inject(TranslateItPipe);
    const messagesService: MessagesService = TestBed.inject(MessagesService);
    spyOn(component, 'sendServiceResult').and.callThrough();
    spyOn(component.translatePipe, 'transform').and.callThrough();
    spyOn(messagesService, 'getErrorMessage').and.callThrough();

    // Act
    component.inputChangeValidation(eventMock, fieldName, tdId, row);

    // Assert
    expect(component.resetState).toEqual(expectedResetState);
    expect(component.errorTdId).toEqual(expectedErrorTdId);
    expect(component.sendServiceResult).toHaveBeenCalled();
    expect(messagesService.getErrorMessage).toHaveBeenCalled();
  });

});
