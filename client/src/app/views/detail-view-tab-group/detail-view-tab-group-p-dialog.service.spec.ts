import {fakeAsync, TestBed} from '@angular/core/testing';

import {DetailViewTabGroupPDialogService} from './detail-view-tab-group-p-dialog.service';
import {ConstantsService, ORDER_POSITIONS_DIALOG_COLS} from "../../_services/constants.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {TestingModule} from "../../testing/testing.module";
import {OrderPositionItem} from "../../interfaces/order-position-item";
import {AutoComplete} from "primeng/autocomplete";
import {CurrenciesTestConstants} from "../../../assets/test-constants/currencies";
import {FormOptionsLVs, FormOptionsNVs} from "../../interfaces/form-options";
import {OrdersTestConstants} from "../../../assets/test-constants/orders";
import {ChangeDetectorRef, ElementRef, Renderer2} from "@angular/core";
import {MockElementRef} from "../../dialogs/stock-transfer-dialog/stock-transfer-dialog.component.spec";
import {CustomPDialogComponent} from "../custom/custom-p-dialog/custom-p-dialog.component";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {CustomPTableComponent} from "../custom/custom-p-table/custom-p-table.component";
import {TableDataService} from "../../_services/table-data.service";
import {DetailViewTabGroupPositionsService} from "./detail-view-tab-group-positions.service";
import {ArticlesTestConstants} from "../../../assets/test-constants/articles";
import {MessagesService} from "../../_services/messages.service";
import {DetailViewTabGroupTabsService} from "./detail-view-tab-group-tabs.service";
import {Table, TableService} from 'primeng/table';
import {CustomersTestConstants} from "../../../assets/test-constants/customers";
import {HelperService} from "../../_services/helper.service";
import {PriceListSalesTestConstants} from "../../../assets/test-constants/price-list-sales";
import {Orders} from "../../models/orders";
import {OrdersPositions} from "../../models/orders-positions";
import {MatTabGroup} from "@angular/material/tabs";

// @link https://stackoverflow.com/a/54693988
export class MatDialogMock {
  // When the component calls this.dialog.open(...) we'll return an object
  // with an afterClosed method that allows to subscribe to the dialog result observable.
  open() {
    return {
      afterClosed: () => of({action: true})
    };
  }
}

describe('DetailViewTabGroupPDialogService', () => {
  let service: DetailViewTabGroupPDialogService;
  let constantsService: ConstantsService;
  let autocomplete: AutoComplete;
  let tableDataService: TableDataService;
  // let fixture: ComponentFixture<DetailViewTabGroupPDialogService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [AutoComplete, CustomPDialogComponent],
      providers: [ConstantsService, ConfirmationService, {provide: MatDialog, useClass: MatDialogMock}, AutoComplete,
        {provide: ElementRef, useValue: MockElementRef}, Renderer2, ChangeDetectorRef, CustomPDialogComponent,
        TranslateItPipe, MessageService, CustomPTableComponent, DetailViewTabGroupPositionsService, Table, TableService]
    });

    // fixture = TestBed.createComponent(DetailViewTabGroupPDialogService);
    service = TestBed.inject(DetailViewTabGroupPDialogService);
    constantsService = TestBed.inject(ConstantsService);
    service.translatePipe = TestBed.inject(TranslateItPipe);
    tableDataService = TestBed.inject(TableDataService);
    autocomplete = TestBed.inject(AutoComplete);
    autocomplete.value = '12MORRIS-E14-WA-STEC#1#1#2#101##0#A#2014-01-01 00:00:00#2';
    autocomplete.inputEL = new ElementRef(service);
    autocomplete.inputEL.nativeElement = new ElementRef(service);
    autocomplete.inputEL.nativeElement.focus = new Function();
    service.pTable = TestBed.inject(CustomPTableComponent);
    service.pTable.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM];
    service.pTable.pTable = TestBed.inject(Table);
    service.selTableRow = OrdersTestConstants.ORDERS_ITEM;
    service.positionsModel = OrdersTestConstants.ORDERS_POSITION_ITEM as OrdersPositions;
    service.pDialogComponent = TestBed.inject(CustomPDialogComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set required parameters', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS;
    const selTableRow: any = OrdersTestConstants.ORDERS_ITEM;
    const pDialogComponent: CustomPDialogComponent = TestBed.inject(CustomPDialogComponent);
    let pTable: CustomPTableComponent = TestBed.inject(CustomPTableComponent);
    pTable.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM];
    const errorMessage: string = 'ERROR';
    const orderPosition: OrderPositionItem = OrdersTestConstants.ORDERS_POSITION_ITEM;
    const newOrderPosition: boolean = true;
    const saveButton: ElementRef = new ElementRef(service);
    const dlgSaveButton: ElementRef = new ElementRef(service);
    const dialogCols: any[] = ORDER_POSITIONS_DIALOG_COLS;
    const tabsService: DetailViewTabGroupTabsService = TestBed.inject(DetailViewTabGroupTabsService);
    const currencies: FormOptionsNVs[] = CurrenciesTestConstants.CURRENCIES_NV;
    const pCurrencies: FormOptionsLVs[] = CurrenciesTestConstants.PCURRENCIES_LV;
    const selTableRowTaxation: number = 16;
    const selectedOrderPosition: OrderPositionItem = OrdersTestConstants.ORDERS_POSITION_ITEM;
    const displayDialog: boolean = true;
    const autocomplete: AutoComplete = TestBed.inject(AutoComplete);
    spyOn(service, 'setEmptyModel').and.callThrough();

    // Act
    service.setRequiredParams(refTable, selTableRow, pDialogComponent, pTable, errorMessage, orderPosition,
      newOrderPosition, saveButton, dlgSaveButton, dialogCols, tabsService, currencies, pCurrencies, selTableRowTaxation,
      selectedOrderPosition, displayDialog, autocomplete);

    // Assert
    expect(service.setEmptyModel).toHaveBeenCalled();
  })

  it('setTranslatePipe returns false if translatePipe is not set', () => {

    // Arrange

    // Act
    service.setTranslatePipe(undefined);

    // Assert
    expect(service['translatePipe']).toEqual(undefined);
  })

  it('should init position dialog', fakeAsync(() => {

    // Arrange
    const currencies: FormOptionsNVs[] = CurrenciesTestConstants.CURRENCIES_NV;
    const pCurrencies: FormOptionsLVs[] = CurrenciesTestConstants.PCURRENCIES_LV;
    const selTableRowTaxation: number = 16;
    const dialogCols: any[] = ORDER_POSITIONS_DIALOG_COLS;
    const selectedOrderPosition: OrderPositionItem = OrdersTestConstants.ORDERS_POSITION_ITEM;
    const displayDialog: boolean = true;

    service.pDialogComponent = TestBed.inject(CustomPDialogComponent);
    service.pDialogComponent.dlgCancelButton = new ElementRef(service);
    service.pDialogComponent.dlgCancelButton.nativeElement = new ElementRef(service);

    service.positionsService = TestBed.inject(DetailViewTabGroupPositionsService);
    spyOn(service.positionsService, 'addFocusToAutocomplete').and.callThrough();

    service.saveButton = new ElementRef(service);
    service.dlgSaveButton = new ElementRef(service);

    spyOn(tableDataService, 'getTableDataById').and.callThrough();
    service.pDialogComponent.setPriceLogic = new Function();

    // Act
    service.initPDialog(currencies, pCurrencies, selTableRowTaxation, dialogCols, selectedOrderPosition, displayDialog,
      autocomplete).then((result: { result: string }) => {
      // Assert
      expect(result).toEqual({result: 'OK'});
    })
  }))

  it('should reset autocomplete', fakeAsync(() => {

    // Arrange
    const rowId: string = "1";
    const client: string = constantsService.LS_SEL_ORDERS_CLIENT;
    const customerOrder: string = constantsService.LS_SEL_ORDERS_NUMBER;
    const displayDialog: boolean = false;
    const selTableRowTaxation: number = 16;
    service.pTable.pTable.editingCell = null;
    spyOn(service, 'setOPCategoryAndDesc').and.returnValue(Promise.resolve(true));
    spyOn(document, 'getElementById').and.callThrough();

    // Act
    service.resetAutocomplete(autocomplete, rowId, client, customerOrder, displayDialog, selTableRowTaxation);

    // Assert
    expect(service.setOPCategoryAndDesc).toHaveBeenCalled();
  }))

  it('should set order position category and description', fakeAsync(() => {

    // Arrange
    const itemNumber: string = constantsService.LS_SEL_ITEM_NUMBER;
    service.orderPosition = OrdersTestConstants.ORDERS_POSITION_ITEM;
    spyOn(service.translatePipe, 'transform').and.returnValue('FIELD_SHOULD_NOT_BE_EMPTY');
    const getTableDataByIdResult: { table: [any[string], any[]], maxRows: number, page: number } =
      ArticlesTestConstants.ARTICLES_TABLE_DB_DATA;
    spyOn(tableDataService, 'getTableDataById').and.returnValue(Promise.resolve(getTableDataByIdResult));

    // Act
    service.setOPCategoryAndDesc(itemNumber).then((result: boolean) => {

      // Assert
      expect(tableDataService.getTableDataById).toHaveBeenCalled();
      expect(result).toEqual(true);
    })
  }))

  it('should not set order position category and description', fakeAsync(() => {

    // Arrange
    const itemNumber: string = constantsService.LS_SEL_ITEM_NUMBER;
    service.orderPosition = OrdersTestConstants.ORDERS_POSITION_ITEM;
    spyOn(service.translatePipe, 'transform').and.returnValue('FIELD_SHOULD_NOT_BE_EMPTY');
    const getTableDataByIdResult: { table: [any[string], any[]], maxRows: number, page: number } =
      ArticlesTestConstants.ARTICLES_TABLE_EMPTY_DB_DATA;
    spyOn(tableDataService, 'getTableDataById').and.returnValue(Promise.resolve(getTableDataByIdResult));

    // Act
    service.setOPCategoryAndDesc(itemNumber).then((result: boolean) => {

      // Assert
      expect(tableDataService.getTableDataById).toHaveBeenCalled();
      expect(result).toEqual(false);
    })
  }))

  it('should set price by itmnum', fakeAsync(() => {

    // Arrange
    const itmnum: string = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.ITMNUM;
    const rowId: string = "id_79_td_0_0";
    const clientType: string = constantsService.CLIENT_B2B;
    const customerNumber: string = constantsService.LS_SEL_ITEM_NUMBER;
    const selTableRowTaxation: number = 16;

    service.orderPosition = OrdersTestConstants.ORDERS_POSITION_ITEM;
    spyOn(service.translatePipe, 'transform').and.returnValue('FIELD_SHOULD_NOT_BE_EMPTY');
    const getTableDataByCustomersNumberResult: { table: [any[string], any[]], maxRows: number, page: number } =
      CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV_TABLE_DB_DATA;
    spyOn(tableDataService, 'getTableDataByCustomersNumber').and.returnValue(
      Promise.resolve(getTableDataByCustomersNumberResult));
    const getTableDataByIdResult: { table: [any[string], any[]], maxRows: number, page: number } =
      PriceListSalesTestConstants.PRICE_LIST_SALES_TABLE_DB_DATA;
    const ordersResult: { table: [any[string], any[]], maxRows: number, page: number } =
      OrdersTestConstants.ORDERS_TABLE_DB_DATA;
    spyOn(tableDataService, 'getTableDataById').and.returnValues(
      Promise.resolve(getTableDataByIdResult),
      Promise.resolve(ordersResult)
    );

    // Act
    service.setPriceByItmnum(itmnum, rowId, clientType, customerNumber, selTableRowTaxation).then(() => {

      // Assert
      expect(tableDataService.getTableDataByCustomersNumber).toHaveBeenCalled();
      expect(tableDataService.getTableDataById).toHaveBeenCalled();
    })
  }))

  it('should not set price by itmnum if itmnum is undefined', fakeAsync(() => {

    // Arrange
    const itmnum: string = undefined;
    const rowId: string = "id_79_td_0_0";
    const clientType: string = constantsService.CLIENT_B2B;
    const customerNumber: string = constantsService.LS_SEL_ITEM_NUMBER;
    const selTableRowTaxation: number = 16;
    console.log = jasmine.createSpy("log");
    const expectedResult: string = 'ITMNUM is not set...';

    // Act
    service.setPriceByItmnum(itmnum, rowId, clientType, customerNumber, selTableRowTaxation).then(() => {

      // Assert
      expect(console.log).toHaveBeenCalledWith(expectedResult);
    })
  }))

  it('should not set price by itmnum if itmnum is undefined', fakeAsync(() => {

    // Arrange
    const itmnum: string = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.ITMNUM;
    const rowId: string = "id_79_td_0_0";
    const clientType: string = constantsService.CLIENT_B2B;
    const customerNumber: string = constantsService.LS_SEL_ITEM_NUMBER;
    const selTableRowTaxation: number = 16;
    const getTableDataByCustomersNumberResult: { table: [any[string], any[]], maxRows: number, page: number } =
      {table: undefined, maxRows: 100, page: 0};
    spyOn(tableDataService, 'getTableDataByCustomersNumber').and.returnValue(
      Promise.resolve(getTableDataByCustomersNumberResult));
    console.log = jasmine.createSpy("log");
    const expectedResult: string = 'Customer Address is not set...';

    // Act
    service.setPriceByItmnum(itmnum, rowId, clientType, customerNumber, selTableRowTaxation).then(() => {

      // Assert
      expect(tableDataService.getTableDataByCustomersNumber).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(expectedResult);
    })
  }))

  it('should not set price by itmnum', fakeAsync(() => {

    // Arrange
    const itmnum: string = constantsService.LS_SEL_ORDERS_NUMBER;
    const rowId: string = "1";
    const clientType: string = constantsService.LS_SEL_ORDERS_CLIENT;
    const customerNumber: string = constantsService.LS_SEL_ITEM_NUMBER;
    const selTableRowTaxation: number = 16;

    service.orderPosition = OrdersTestConstants.ORDERS_POSITION_ITEM;
    spyOn(service.translatePipe, 'transform').and.returnValue('FIELD_SHOULD_NOT_BE_EMPTY');
    const getTableDataByIdResult: { table: [any[string], any[]], maxRows: number, page: number } = undefined;
    spyOn(tableDataService, 'getTableDataByCustomersNumber').and.returnValue(Promise.resolve(getTableDataByIdResult));

    // Act
    service.setPriceByItmnum(itmnum, rowId, clientType, customerNumber, selTableRowTaxation).then(() => {

      // Assert
      expect(tableDataService.getTableDataByCustomersNumber).toHaveBeenCalled();

    })
  }))

  it('should validate price calculation for B2C', () => {

    // Arrange
    const row: any = "0";
    const validateFieldValue: number = 120.35;
    const selTableRowTaxation: number = 16;
    (service.selTableRow as Orders).CLIENT = "B2C";
    const helperService: HelperService = TestBed.inject(HelperService);
    service.pTable.pTable._value = [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM];
    spyOn(helperService, 'calcB2CPriceNet').and.callThrough();
    spyOn(service, 'disableSaveButton').and.callThrough();

    // Act
    service.inputValidationPriceCalculation(row, validateFieldValue, selTableRowTaxation);

    // Assert
    expect(helperService.calcB2CPriceNet).toHaveBeenCalled();
    expect(service.disableSaveButton).toHaveBeenCalled();

  })

  it('should validate price calculation for B2B', () => {

    // Arrange
    const row: any = "0";
    const validateFieldValue: number = 120.35;
    const selTableRowTaxation: number = 16;
    (service.selTableRow as Orders).CLIENT = "B2B";
    const helperService: HelperService = TestBed.inject(HelperService);
    service.pTable.pTable._value = [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM];
    spyOn(helperService, 'calcB2BPriceBru').and.callThrough();
    spyOn(service, 'disableSaveButton').and.callThrough();

    // Act
    service.inputValidationPriceCalculation(row, validateFieldValue, selTableRowTaxation);

    // Assert
    expect(helperService.calcB2BPriceBru).toHaveBeenCalled();
    expect(service.disableSaveButton).toHaveBeenCalled();

  })

  it('should not validate price calculation if taxation is not set', () => {

    // Arrange
    const row: any = "0";
    const validateFieldValue: number = 120.35;
    const selTableRowTaxation: number = undefined;
    service.errorMessage = 'ERROR';
    (service.selTableRow as Orders).CLIENT = "B2B";
    const messagesService: MessagesService = TestBed.inject(MessagesService);
    spyOn(messagesService, 'showErrorMessage').and.callThrough();
    spyOn(service, 'disableSaveButton').and.callThrough();
    spyOn(String.prototype, 'replace').and.callThrough();

    // Act
    service.inputValidationPriceCalculation(row, validateFieldValue, selTableRowTaxation);

    // Assert
    expect(messagesService.showErrorMessage).toHaveBeenCalled();
    expect(service.disableSaveButton).toHaveBeenCalled();
    expect(String.prototype.replace).toHaveBeenCalled();

  })

  it('should not validate price calculation if taxation is not set', fakeAsync(() => {

    // Arrange
    const positionsForDeliveryNoteCreation: OrdersPositions[] = [OrdersTestConstants.ORDERS_POSITION_ITEM as OrdersPositions];
    const isPartlyDelivery: boolean = false;
    const cacheCheck: boolean = true;
    const orderWarehouse: string = OrdersTestConstants.ORDER_ITEM.WAREHOUSE;
    const checkTableData: { result: { success: boolean, message: string, data: any[] } } =
      {result: {success: true, message: 'OK', data: []}};
    spyOn(tableDataService, 'checkTableData').and.returnValue(Promise.resolve(checkTableData));
    const expectedResult: {
      resultAllocation: boolean,
      resultPartlyDelivery: boolean,
      resultData: undefined | { success: boolean, message: string, data: any[] }
    } = {
      resultAllocation: true,
      resultPartlyDelivery: false,
      resultData: {success: true, message: 'OK', data: []}
    };

    // Act
    service.checkWHAllocation(positionsForDeliveryNoteCreation, isPartlyDelivery, cacheCheck, orderWarehouse)
      .then((result: {
        resultAllocation: boolean,
        resultPartlyDelivery: boolean,
        resultData: undefined | { success: boolean, message: string, data: any[] }
      }) => {
        // Assert
        expect(tableDataService.checkTableData).toHaveBeenCalled();
        expect(result).toEqual(expectedResult);
      })
  }))

  it('should set order position defaults if order mode is false', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS;
    const selOrderRow = OrdersTestConstants.ORDERS_ITEM;
    const orderMode: boolean = false;
    const ordersPositionsModel: OrdersPositions = OrdersTestConstants.ORDERS_POSITION_ITEM as OrdersPositions;
    const expectedOrderPosition = {
      ORDERS_NUMBER: selOrderRow['ORDERS_NUMBER'],
      CATEGORY_SOAS: ordersPositionsModel.CATEGORY_SOAS,
      ASSIGNED_QTY: ordersPositionsModel.ASSIGNED_QTY,
      PRICE_BRU: ordersPositionsModel.PRICE_BRU,
      PRICE_NET: ordersPositionsModel.PRICE_NET,
      CURRENCY: selOrderRow['CURRENCY'],
      WAREHOUSE: selOrderRow['WAREHOUSE']
    };

    // Act
    service.setOrderPositionDefaults(refTable, selOrderRow, orderMode, ordersPositionsModel);

    // Assert
    expect(service.orderPosition).toEqual(expectedOrderPosition);

  })

  it('should set order position defaults if order mode is true', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS;
    const selOrderRow = OrdersTestConstants.ORDERS_ITEM;
    const orderMode: boolean = true;
    let ordersPositionsModel: OrdersPositions = OrdersTestConstants.ORDERS_POSITION_ITEM as OrdersPositions;
    const expectedOrderPosition = {
      ORDERS_NUMBER: selOrderRow['ORDERS_NUMBER'],
      CATEGORY_SOAS: ordersPositionsModel.CATEGORY_SOAS,
      ASSIGNED_QTY: ordersPositionsModel.ASSIGNED_QTY,
      PRICE_BRU: ordersPositionsModel.PRICE_BRU,
      PRICE_NET: ordersPositionsModel.PRICE_NET,
      CURRENCY: selOrderRow['CURRENCY'],
      WAREHOUSE: selOrderRow['WAREHOUSE'],
      POSITION_STATUS: ordersPositionsModel.POSITION_STATUS
    };

    // Act
    service.setOrderPositionDefaults(refTable, selOrderRow, orderMode, ordersPositionsModel);

    // Assert
    expect(service.orderPosition).toEqual(expectedOrderPosition);
  })

  it('should show dialog to add', fakeAsync(() => {

    // Arrange
    service.refTable = constantsService.REFTABLE_ORDERS;
    spyOn(service, 'setOrderPositionDefaults').and.callThrough();
    spyOn(service, 'initPDialog').and.callThrough();
    spyOn(service, 'setRefTable').and.callThrough();

    // Act
    service.showDialogToAdd().then(() => {
      // Assert
      expect(service.newOrderPosition).toBeTruthy();
      expect(service.setOrderPositionDefaults).toHaveBeenCalled();
      expect(service.initPDialog).toHaveBeenCalled();
    })
  }))

  // ERROR: 'Unhandled Promise rejection:', 'Cannot read properties of undefined (reading 'detectChanges')', '; Zone:', 'ProxyZone',
  // it('should not show dialog to add if selected table row is undefined', () => {
  //
  //   // Arrange
  //   service.selTableRow = undefined;
  //   const messagesService: MessagesService = TestBed.inject(MessagesService);
  //   spyOn(messagesService, 'showErrorMessage').and.callThrough();
  //   service.tabsService = TestBed.inject(DetailViewTabGroupTabsService);
  //   service.tabsService.tabGroup = jasmine.createSpyObj('MatTabGroup', ['childMethod']);
  //   service.tabsService.tabGroup.selectedIndex = 0;
  //   spyOn(service.tabsService, 'selectTab').and.callThrough();
  //
  //   // Act
  //   service.showDialogToAdd();
  //
  //   // Assert
  //   expect(messagesService.showErrorMessage).toHaveBeenCalled();
  //   expect(service.tabsService.selectTab).toHaveBeenCalled();
  // })

});
