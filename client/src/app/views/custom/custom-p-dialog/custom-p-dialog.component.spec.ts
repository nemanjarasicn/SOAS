import {MessageService} from 'primeng/api';
import {TranslateItPipe} from '../../../shared/pipes/translate-it.pipe';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {CustomPDialogComponent, PrimeOrderPosition} from './custom-p-dialog.component';
import {TestingModule} from 'src/app/testing/testing.module';
import {TableDataService} from '../../../_services/table-data.service';
import {AutoComplete} from 'primeng/autocomplete';
import {InputNumber} from 'primeng/inputnumber';
import {OrderPositionItem} from "../../../interfaces/order-position-item";
import {OrdersTestConstants} from "../../../../assets/test-constants/orders";
import {Order} from "../../../interfaces/order-item";
import {MessagesService} from "../../../_services/messages.service";
import {Orders} from "../../../models/orders";
import {ArticlesTestConstants} from "../../../../assets/test-constants/articles";
import {ComponentsTestConstants} from "../../../../assets/test-constants/components";
import {HelperService} from "../../../_services/helper.service";
import {ConstantsService, CustomersTypes} from "../../../_services/constants.service";

describe('CustomPDialogComponent', () => {

  let component: CustomPDialogComponent;
  let fixture: ComponentFixture<CustomPDialogComponent>;
  let tableDataService: TableDataService;
  let constantsService: ConstantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [CustomPDialogComponent, AutoComplete, InputNumber, TranslateItPipe],
      providers: [AutoComplete, TranslateItPipe, MessageService, ConstantsService]
    });

    fixture = TestBed.createComponent(CustomPDialogComponent);
    component = fixture.componentInstance;
    tableDataService = TestBed.inject(TableDataService);
    component.helperService = TestBed.inject(HelperService);
    // component.selTableRow = OrdersTestConstants.ORDERS_ITEM;
    component.selTableRowTaxation = 16;
    constantsService = TestBed.inject(ConstantsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set fieldsNumber and title', () => {

    // Arrange
    component.title = undefined;
    component.fieldsNumber = 0;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.title).toBeDefined();
    expect(component.fieldsNumber).toEqual(10);
  });

  it('should set setRefTable', () => {

    // Arrange
    component.refTable = undefined;

    // Act
    component.setRefTable('newRefTable');

    // Assert
    expect(component.refTable).toBeDefined();
    expect(component.refTable).toEqual('newRefTable');
  });

  it('should set setOrderPosition', () => {

    // Arrange
    component.orderPosition = undefined;

    // Act
    component.setOrderPosition({});

    // Assert
    expect(component.orderPosition).toBeDefined();
    expect(component.orderPosition).toEqual({});
  });

  it('should set setOrderPositions', () => {

    // Arrange
    component.orderPositions = undefined;

    // Act
    component.setOrderPositions([]);

    // Assert
    expect(component.orderPositions).toBeDefined();
    expect(component.orderPositions).toEqual([]);
  });

  it('should set dialogCols', () => {

    // Arrange
    component.dialogCols = undefined;

    // Act
    component.setDialogCols([]);

    // Assert
    expect(component.dialogCols).toBeDefined();
    expect(component.dialogCols).toEqual([]);
  });

  it('should set selCustomerTaxation', () => {

    // Arrange
    component.selTableRowTaxation = undefined;

    // Act
    component.setSelTableRowTaxation(5);

    // Assert
    expect(component.selTableRowTaxation).toBeDefined();
    expect(component.selTableRowTaxation).toEqual(5);
  });

  it('should set newOrderPosition', () => {

    // Arrange
    component.newOrderPosition = false;

    // Act
    component.setNewOrderPosition(true);

    // Assert
    expect(component.newOrderPosition).toBeDefined();
    expect(component.newOrderPosition).toEqual(true);
  });

  it('should set pcurrencies', () => {

    // Arrange
    component.pCurrencies = undefined;

    // Act
    component.setPCurrencies([]);

    // Assert
    expect(component.pCurrencies).toBeDefined();
    expect(component.pCurrencies).toEqual([]);
  });

  it('should set currencies', () => {

    // Arrange
    component.currencies = undefined;

    // Act
    component.setCurrencies([]);

    // Assert
    expect(component.currencies).toBeDefined();
    expect(component.currencies).toEqual([]);
  });

  it('should set selectedOrderPosition', () => {

    // Arrange
    component.currencies = undefined;

    // Act
    component.setSelectedOrderPosition({});

    // Assert
    expect(component.selectedOrderPosition).toBeDefined();
    expect(component.selectedOrderPosition).toEqual({});
  });

  it('should return one of dialogCols', () => {

    // Arrange
    component.dialogCols = [{field: 'itemName'}];

    // Act
    let result = component.getDialogColsItemProperties('itemName');

    // Assert
    expect(component.dialogCols).toBeDefined();
    expect(result).toEqual(component.dialogCols[0]);
  });

  it('should return false', () => {

    // Arrange
    component.dialogCols = [{field: 'itemName'}];

    // Act
    let result = component.getDialogColsItemProperties('unknown');

    // Assert
    expect(component.dialogCols).toBeDefined();
    expect(result).toEqual(undefined); // false
  });

  it('should call filterItmnumLogic', () => {

    // Arrange
    const event = {query: 'text'};
    component.dialogCols = [{field: 'itemName'}];
    component.updatedOrderPositionsRows = [];
    spyOn(tableDataService, "searchTableColumnData").and.callThrough();

    // Act
    let result = component.filterItmnum(event);

    // Assert
    expect(component.dialogCols).toBeDefined();
    // expect(component.updatedOrderPositionsRows.length).toEqual(1);
    // expect(result).toEqual(false);
    // expect(tableDataService.searchTableColumnData).toHaveBeenCalled();
  });

  it('should call disableSaveButton', () => {

    // Arrange
    const disable: boolean = true;

    // Act
    component.disableSaveButton(disable);

    // Assert
    expect(component.dlgSaveButton.nativeElement.disabled).toEqual(disable);
  });

  it('should call disableCancelButton', () => {

    // Arrange
    const disable: boolean = true;

    // Act
    component.disableCancelButton(disable);

    // Assert
    expect(component.dlgCancelButton.nativeElement.disabled).toEqual(disable);
  });

  it('should call disableFields', () => {

    // Arrange
    const disable: boolean = true;

    // Act
    component.disableFields(disable);

    // Assert
    expect(component.dlgCancelButton.nativeElement.disabled).toEqual(disable);
    expect(component.dlgSaveButton.nativeElement.disabled).toEqual(disable);
    expect(component.dlgPriceNet.disabled).toEqual(disable);

  });

  it('should call createNewPosition with success', fakeAsync(() => {

    // Arrange
    const ordersNumber: string = OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER;
    const currentOrderPosition: OrderPositionItem = OrdersTestConstants.ORDERS_POSITION_ITEM;
    const overwriteCurrent: boolean = true;
    const insertFlag: boolean = true;
    const saveButtonDisableFlag: boolean = true;
    const saveResult: { success: boolean, itmnum: {}, message: string } = {success: true, itmnum: {}, message: ''};
    fixture.componentInstance.updateView = new Function();
    spyOn(component, "saveOrderPosition").and.returnValue(Promise.resolve(saveResult));

    // Act
    component.createNewPosition(ordersNumber, currentOrderPosition, overwriteCurrent, insertFlag);

    // Assert
    expect(component.dlgSaveButton.nativeElement.disabled).toEqual(saveButtonDisableFlag);
    expect(component.saveOrderPosition).toHaveBeenCalled();

  }));

  it('should call manageKeyUp', fakeAsync(() => {

    // Arrange
    const eventMock = {code: 'Up', target: {value: 'a'}};
    const $eventValueUpperCase = eventMock.target.value.toUpperCase();

    // Act
    component.manageKeyUp(eventMock);

    // Assert
    expect(eventMock.target.value).toEqual($eventValueUpperCase);

  }));

  it('should validate input change for field name of ORDER_QTY for input value of text', () => {

    // Arrange
    const eventMock: Event = <Event><any>{code: 'keyUp', target: {value: 'a'}};
    const fieldName: string = 'ORDER_QTY';
    const tdId: string = 'error id';
    const row: any = undefined;
    const expectedResetState: boolean = false;
    spyOn(component, 'disableSaveButton').and.callThrough();

    // Act
    component.inputChangeValidation(eventMock, fieldName, tdId, row);

    // Assert
    expect(component.resetState).toEqual(expectedResetState);
  });

  it('should validate input change for field name of ORDER_QTY for input value of number > 0', () => {

    // Arrange
    const eventMock: Event = <Event><any>{code: 'keyUp', target: {value: '1'}};
    const fieldName: string = 'ORDER_QTY';
    const tdId: string = 'error id';
    const row: any = undefined;
    const expectedResetState: boolean = false;
    spyOn(component, 'disableSaveButton').and.callThrough();

    // Act
    component.inputChangeValidation(eventMock, fieldName, tdId, row);

    // Assert
    expect(component.resetState).toEqual(expectedResetState);
    expect(component.disableSaveButton).toHaveBeenCalled();
  });

  it('should validate input change for field name of ORDER_QTY for input value of number = 0', () => {

    // Arrange
    const eventMock: Event = <Event><any>{code: 'keyUp', target: {value: '0'}};
    const fieldName: string = 'ORDER_QTY';
    const tdId: string = 'error id';
    const row: any = undefined;
    const expectedResetState: boolean = false;
    const messagesService: MessagesService = TestBed.inject(MessagesService);
    spyOn(messagesService, 'getErrorMessage').and.callThrough();

    // Act
    component.inputChangeValidation(eventMock, fieldName, tdId, row);

    // Assert
    expect(component.resetState).toEqual(expectedResetState);
    expect(messagesService.getErrorMessage).toHaveBeenCalled();
  });

  it('should validate input change for field name of DEFAULT and empty input value', () => {

    // Arrange
    const fieldName: string = 'DEFAULT';
    let inputElement: HTMLInputElement = document.createElement(fieldName) as HTMLInputElement;
    inputElement.value = '';
    const eventMock: Event = <Event><any>{code: 'keyUp', target: inputElement};
    const tdId: string = 'error id';
    const row: any = undefined;
    const expectedResetState: boolean = false;
    component.translatePipe = TestBed.inject(TranslateItPipe);
    const messagesService: MessagesService = TestBed.inject(MessagesService);
    spyOn(component.translatePipe, 'transform').and.callThrough();
    spyOn(messagesService, 'getErrorMessage').and.callThrough();

    // Act
    component.inputChangeValidation(eventMock, fieldName, tdId, row);

    // Assert
    expect(component.resetState).toEqual(expectedResetState);
    expect(messagesService.getErrorMessage).toHaveBeenCalled();
  });

  it('should calculate order position prices for B2C', () => {

    // Arrange
    const currentOrderPosition: OrderPositionItem = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_POSITION_ITEM));
    const orderData: Orders = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_ITEM));
    const taxation: number = 16;
    const priceNetError: boolean = false;
    const priceBruError: boolean = false;
    const priceBru = 10;
    const priceNet = 5;
    const orderQty = 1;
    const client: CustomersTypes = CustomersTypes.B2C;
    component.selTableRow = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_ITEM));
    spyOn(component.helperService, 'calcB2CPriceNet').and.callThrough();
    spyOn(component, 'calculateVoucher').and.callThrough();
    spyOn(component, 'calculateShippingCosts').and.callThrough();
    spyOn(Number.prototype, 'toFixed').and.returnValue("100.10");

    // Act
    component.calculateOrderPositionPrices(priceBru, priceNet, orderQty, orderData, taxation, priceNetError,
      priceBruError, client);

    // Assert
    expect(Number.prototype.toFixed).toHaveBeenCalled();
    // expect(component.calculateVoucher).toHaveBeenCalled();
    expect(component.calculateShippingCosts).toHaveBeenCalled();
    // expect(component.helperService.calcB2CPriceNet).toHaveBeenCalled();
  });

  it('should calculate order position prices for B2B', () => {

    // Arrange
    const currentOrderPosition: OrderPositionItem = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_POSITION_ITEM));
    let orderData: Orders = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_ITEM));
    orderData.CLIENT = constantsService.CLIENT_B2B;
    const taxation: number = 16;
    const priceNetError: boolean = false;
    const priceBruError: boolean = false;
    const priceBru = 10;
    const priceNet = 5;
    const orderQty = 1;
    const client: CustomersTypes = CustomersTypes.B2B;
    component.selTableRow = JSON.parse(JSON.stringify(orderData));
    spyOn(component.helperService, 'calcB2BPriceBru').and.callThrough();
    spyOn(component, 'calculateShippingCosts').and.callThrough();
    spyOn(Number.prototype, 'toFixed').and.returnValue("100.10");

    // Act
    component.calculateOrderPositionPrices(priceBru, priceNet, orderQty, orderData, taxation, priceNetError,
      priceBruError, client);

    // Assert
    expect(Number.prototype.toFixed).toHaveBeenCalled();
    expect(component.calculateShippingCosts).toHaveBeenCalled();
    expect(component.helperService.calcB2BPriceBru).toHaveBeenCalled();
  });

  it('should calculate discount', () => {

    // Arrange
    let orderData: Orders = OrdersTestConstants.ORDERS_ITEM;
    orderData.DISCOUNT = 10.50;
    const expectedAmountNetResult: number = orderData.ORDERAMOUNT_NET - orderData.DISCOUNT;
    const expectedAmountBruResult: number = orderData.ORDERAMOUNT_BRU - orderData.DISCOUNT;

    // Act
    const result = component.calculateDiscount(orderData);

    // Assert
    expect(result.ORDERAMOUNT_NET).toEqual(expectedAmountNetResult);
    expect(result.ORDERAMOUNT_BRU).toEqual(expectedAmountBruResult);
  });

  it('should calculate voucher', () => {

    // Arrange
    let orderData: Orders = OrdersTestConstants.ORDERS_ITEM;
    orderData.VOUCHER = 10.50;
    const expectedAmountNetResult: number = (orderData.ORDERAMOUNT_NET -
      (orderData.ORDERAMOUNT_NET / 100) * orderData.VOUCHER);
    const expectedAmountBruResult: number = (orderData.ORDERAMOUNT_BRU -
      (orderData.ORDERAMOUNT_BRU / 100) * orderData.VOUCHER);

    // Act
    const result = component.calculateVoucher(orderData);

    // Assert
    expect(result.ORDERAMOUNT_NET).toEqual(expectedAmountNetResult);
    expect(result.ORDERAMOUNT_BRU).toEqual(expectedAmountBruResult);
  });

  it('should calculate shipping costs', () => {

    // Arrange
    let orderData: Orders = OrdersTestConstants.ORDERS_ITEM;
    orderData.SHIPPING_COSTS = 10.50;
    const expectedAmountNetResult: number = (orderData.ORDERAMOUNT_NET + orderData.SHIPPING_COSTS);
    const expectedAmountBruResult: number = (orderData.ORDERAMOUNT_BRU + orderData.SHIPPING_COSTS);

    // Act
    const result = component.calculateShippingCosts(orderData);

    // Assert
    expect(result.ORDERAMOUNT_NET).toEqual(expectedAmountNetResult);
    expect(result.ORDERAMOUNT_BRU).toEqual(expectedAmountBruResult);
  });

  it('should cancel save position dialog', fakeAsync(() => {

    // Arrange
    const expectedDisplayDialog: boolean = false;
    const expectedOrderPosition = new PrimeOrderPosition();
    component.resetAutocomplete = new Function();
    component.selTableRow = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_ITEM));
    spyOn(component, 'resetAutocomplete').and.callThrough();

    // Act
    component.cancelSavePositionDialog();

    // Simulates the passage of time until all pending asynchronous activities complete
    // tick();

    // Assert
    expect(component.displayDialog).toEqual(expectedDisplayDialog);
    expect(component.resetAutocomplete).toHaveBeenCalled();
    expect(component.orderPosition).toEqual(expectedOrderPosition);

  }));

  it('should return false if save button should not disabled', () => {

    // Arrange
    const expectedResult: boolean = false;
    component.orderPosition = OrdersTestConstants.ORDERS_POSITION_ITEM;

    // Act
    const result: boolean = component.isSaveButtonDisabled();

    // Assert
    expect(result).toEqual(expectedResult);

  });

  it('should return true if save button should be disabled', () => {

    // Arrange
    const expectedResult: boolean = true;
    component.orderPosition = undefined;

    // Act
    const result: boolean = component.isSaveButtonDisabled();

    // Assert
    expect(result).toEqual(expectedResult);

  });

  // it('should save order position', fakeAsync(() => {
  //
  //   // Arrange
  //   const currentOrderPosition: OrderPositionItem = OrdersTestConstants.ORDERS_POSITION_ITEM;
  //   const ordersNumber: string = currentOrderPosition.ORDERS_NUMBER;
  //   const overwriteCurrent: boolean = true;
  //   const insertFlag: boolean = true;
  //   component.checkWHAllocation = new Function();
  //   component.selTableRow = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_ITEM));
  //   const artDbData = ArticlesTestConstants.ARTICLES_TABLE_DB_DATA;
  //   const distCompDbData = ComponentsTestConstants.COMPONENTS_TABLE_DB_DATA;
  //   const orderDbData = OrdersTestConstants.ORDERS_TABLE_DB_DATA;
  //   const orderPositionsDbData = OrdersTestConstants.ORDERS_POSITIONS_TABLE_DB_DATA;
  //   const orderPositionPricesResult: { orderData: Orders, priceNetError: boolean, priceBruError: boolean, taxAmount: number } =
  //     {orderData: OrdersTestConstants.ORDERS_ITEM, priceNetError: false, priceBruError: false, taxAmount: 5};
  //   const checkWHAllocationResult: {
  //     resultAllocation: boolean, resultPartlyDelivery: boolean,
  //     resultData: undefined | { success: boolean, message: string, data: any[] }
  //   } = {
  //     resultAllocation: true, resultPartlyDelivery: false,
  //     resultData: {success: true, message: 'OK', data: []}
  //   }
  //   spyOn(tableDataService, 'getTableDataById').and.returnValues(
  //     Promise.resolve(artDbData),
  //     Promise.resolve(distCompDbData),
  //     Promise.resolve(orderDbData),
  //     Promise.resolve(orderPositionsDbData));
  //   spyOn(component, 'calculateOrderPositionPrices').and.returnValue(orderPositionPricesResult);
  //   spyOn(component, 'checkWHAllocation').and.returnValue(checkWHAllocationResult);
  //
  //   // Act
  //   component.saveOrderPosition(ordersNumber, currentOrderPosition, overwriteCurrent, insertFlag)
  //     .then(
  //       (result: { success: boolean; itmnum: {}; }) => {
  //         // Assert
  //         expect(tableDataService.getTableDataById).toHaveBeenCalled();
  //         expect(component.calculateOrderPositionPrices).toHaveBeenCalled();
  //         expect(component.checkWHAllocation).toHaveBeenCalled();
  //       });
  // }));

  it('should set selCustomerRow', () => {

    // Arrange
    const order: Order = OrdersTestConstants.ORDERS_ITEM;
    component.selTableRow = undefined;

    // Act
    component.setSelTableRow(order);

    // Assert
    expect(component.selTableRow).toBeDefined();
    expect(component.selTableRow).toEqual(order);
  });

  it('should call createNewPosition with error', fakeAsync(() => {

    // Arrange
    console.log = jasmine.createSpy("log");
    const ordersNumber: string = OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER;
    const currentOrderPosition: OrderPositionItem = undefined;
    const overwriteCurrent: boolean = true;
    const insertFlag: boolean = true;
    const saveButtonDisableFlag: boolean = true;
    const saveResult: { success: boolean, itmnum: {}, message: string } = {success: false, itmnum: {}, message: ''};
    component.selTableRow = undefined;
    fixture.componentInstance.updateView = new Function();
    // spyOn(component,"updateView").and.callThrough();
    spyOn(component, "saveOrderPosition").and.returnValue(Promise.resolve(saveResult));

    // Act
    component.createNewPosition(ordersNumber, currentOrderPosition, overwriteCurrent, insertFlag).then(() => {
      // Assert
      expect(console.log).toHaveBeenCalledWith('ERROR occurred at saveOrderPosition!');
    });

    // Assert
    expect(component.dlgSaveButton.nativeElement.disabled).toEqual(saveButtonDisableFlag);
    expect(component.saveOrderPosition).toHaveBeenCalled();

  }));
});
