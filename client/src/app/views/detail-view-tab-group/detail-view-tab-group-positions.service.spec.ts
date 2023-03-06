import { TestingModule } from 'src/app/testing/testing.module';
import { TestBed } from '@angular/core/testing';

import { DetailViewTabGroupPositionsService } from './detail-view-tab-group-positions.service';
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {CustomPTableComponent} from "../custom/custom-p-table/custom-p-table.component";
import {DetailViewTabGroupTabsService} from "./detail-view-tab-group-tabs.service";
import {Orders} from "../../models/orders";
import {OrdersTestConstants} from "../../../assets/test-constants/orders";
import {
  ConstantsService,
  CustomersTypes, DELIVERY_NOTE_POSITIONS_COLS, INVOICE_POSITIONS_COLS,
  ORDER_POSITIONS_COLS,
  ORDER_POSITIONS_DIALOG_COLS, SubTabGroupTabNames,
} from "../../_services/constants.service";
import {FormOptionsNVS} from "../../interfaces/form-options";
import {ElementRef} from "@angular/core";
import {CurrenciesTestConstants} from "../../../assets/test-constants/currencies";
import {StatesTestConstants} from "../../../assets/test-constants/states";
import {MessageService} from "primeng/api";
import {OrderPositionItem} from "../../interfaces/order-position-item";
import {DeliveryNotesTestConstants} from "../../../assets/test-constants/delivery-notes";
import {DeliveryNotePositionItem} from "../../interfaces/delivery-note-position-item";
import {InvoicesTestConstants} from "../../../assets/test-constants/invoices";
import {InvoicePositionItem} from "../../interfaces/invoice-position-item";

describe('DetailViewTabGroupPositionsService', () => {
  let service: DetailViewTabGroupPositionsService;
  let tabsService: DetailViewTabGroupTabsService;
  let constantsService: ConstantsService;
  let pTable: CustomPTableComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [TranslateItPipe, ConstantsService, CustomPTableComponent, DetailViewTabGroupTabsService,
        MessageService]
    });
    service = TestBed.inject(DetailViewTabGroupPositionsService);
    tabsService = TestBed.inject(DetailViewTabGroupTabsService);
    constantsService = TestBed.inject(ConstantsService);
    pTable = TestBed.inject(CustomPTableComponent);
  });

  afterEach(() => {
    // Workaround to have selected table row should be reset
    service.refTable = undefined;
    service.selTableRow = undefined; // JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_ITEM));
    service.ordDlvInvStates = undefined;
    service.formDisabledFlag = undefined;
    service.selTableRowTaxation = undefined;
    service.orderReleaseFlag = undefined;
  });

  it('should be created', () => {
    const service: DetailViewTabGroupPositionsService = TestBed.inject(DetailViewTabGroupPositionsService);
    expect(service).toBeTruthy();
  });

  it('should set required params', async function() {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS;
    const selCurrentTabGroupName: string = "";
    const updatedOrderPositionsRows: string[] = ["row"];
    const fullEditMode: boolean = false;
    const orderAllocatedFlag: boolean = false;
    const ordPosStates: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;
    const dlvPosStates: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_LI_POSITIONS;
    const invPosStates: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_RG_POSITIONS;
    const saveButton: ElementRef = new ElementRef(service);
    const dlgSaveButton: ElementRef = new ElementRef(service);
    const allocateButton: ElementRef = new ElementRef(service);
    const currencies: any[] = CurrenciesTestConstants.CURRENCIES;
    const cols: any[] = [];
    const selTableRow: Orders = OrdersTestConstants.ORDERS_ITEM;
    const ordDlvInvStates: any = StatesTestConstants.STATES;
    const formDataAvailableFlag: boolean = false;
    const formDisabledFlag: boolean = false;
    const selTableRowTaxation: number = 1;
    const orderReleaseFlag: boolean = false;

    // Act
    await service.setRequiredParams(refTable, selCurrentTabGroupName, updatedOrderPositionsRows, fullEditMode,
      orderAllocatedFlag, pTable, tabsService, ordPosStates, dlvPosStates, invPosStates, saveButton, dlgSaveButton,
      allocateButton, currencies, cols, selTableRow, ordDlvInvStates, formDataAvailableFlag, formDisabledFlag,
      selTableRowTaxation, orderReleaseFlag);

    // Assert
    expect(service.refTable).toEqual(refTable);
    expect(service.selCurrentTabGroupName).toEqual(selCurrentTabGroupName);
    expect(service.updatedOrderPositionsRows).toEqual(updatedOrderPositionsRows);
    expect(service.fullEditMode).toEqual(fullEditMode);
    expect(service.orderAllocatedFlag).toEqual(orderAllocatedFlag);
    expect(service.tabsService).toEqual(tabsService);
    expect(service.selTableRow).toEqual(selTableRow);
    expect(service.ordPosStates).toEqual(ordPosStates);
    expect(service.dlvPosStates).toEqual(dlvPosStates);
    expect(service.invPosStates).toEqual(invPosStates);
    expect(service.cols).toEqual(cols);
    expect(service.currencies).toEqual(currencies);
    expect(service.ordDlvInvStates).toEqual(ordDlvInvStates);
    expect(service.formDataAvailableFlag).toEqual(formDataAvailableFlag);
    expect(service.formDisabledFlag).toEqual(formDisabledFlag);
    expect(service.selTableRowTaxation).toEqual(selTableRowTaxation);
    expect(service.orderReleaseFlag).toEqual(orderReleaseFlag);

  });

  it('should set setRefTable', () => {

    // Arrange
    service.refTable = undefined;

    // Act
    service.setRefTable('newRefTable');

    // Assert
    expect(service.refTable).toBeDefined();
    expect(service.refTable).toEqual('newRefTable');
  });

  it('should set selCurrentTabGroupName', () => {

    // Arrange

    // Act
    service.setSelCurrentTabGroupName('newRefTable');

    // Assert
    expect(service.selCurrentTabGroupName).toBeDefined();
    expect(service.selCurrentTabGroupName).toEqual('newRefTable');
  });

  it('should set setUpdatedOrderPositionsRows', () => {

    // Arrange
    const rows: string[] = ["rows"];

    // Act
    service.setUpdatedOrderPositionsRows(rows);

    // Assert
    expect(service.updatedOrderPositionsRows).toBeDefined();
    expect(service.updatedOrderPositionsRows).toEqual(rows);
  });

  it('should set setFullEditMode', () => {

    // Arrange
    const flag: boolean = true;

    // Act
    service.setFullEditMode(flag);

    // Assert
    expect(service.fullEditMode).toEqual(flag);
  });

  it('should set setOrderAllocatedFlag', () => {

    // Arrange
    const flag: boolean = true;

    // Act
    service.setOrderAllocatedFlag(flag);

    // Assert
    expect(service.orderAllocatedFlag).toEqual(flag);
  });

  it('should set setPTable', () => {

    // Arrange

    // Act
    service.setPTable(pTable);

    // Assert
    expect(service.pTable).toBeDefined();
    expect(service.pTable).toEqual(pTable);
  });

  it('should set setTabsService', () => {

    // Arrange

    // Act
    service.setTabsService(tabsService);

    // Assert
    expect(service.tabsService).toBeDefined();
    expect(service.tabsService).toEqual(tabsService);
  });

  it('should set setOrdPosStates', () => {

    // Arrange
    const ordPosStates: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;

    // Act
    service.setOrdPosStates(ordPosStates);

    // Assert
    expect(service.ordPosStates).toBeDefined();
    expect(service.ordPosStates).toEqual(ordPosStates);
  });

  it('should set setDlvPosStates', () => {

    // Arrange
    const dlvPosStates: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_LI_POSITIONS;

    // Act
    service.setDlvPosStates(dlvPosStates);

    // Assert
    expect(service.dlvPosStates).toBeDefined();
    expect(service.dlvPosStates).toEqual(dlvPosStates);
  });

  it('should set setInvPosStates', () => {

    // Arrange
    const invPosStates: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_RG_POSITIONS;

    // Act
    service.setInvPosStates(invPosStates);

    // Assert
    expect(service.invPosStates).toBeDefined();
    expect(service.invPosStates).toEqual(invPosStates);
  });

  it('should check delivery note positions and return true, if same item was found', () => {

    // Arrange
    const deliveryNotePositions: DeliveryNotePositionItem[] = [DeliveryNotesTestConstants.DELIVERY_NOTE_POSITION_ITEM];
    const orderPosition: OrderPositionItem = OrdersTestConstants.ORDERS_POSITION_ITEM;

    // Act
    let result = service.checkPositionIsInDnp(deliveryNotePositions, orderPosition);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should check delivery note positions and return false, if same item was not found', () => {

    // Arrange
    const deliveryNotePositions: DeliveryNotePositionItem[] = [];
    const orderPosition: OrderPositionItem = OrdersTestConstants.ORDERS_POSITION_ITEM;

    // Act
    let result = service.checkPositionIsInDnp(deliveryNotePositions, orderPosition);

    // Assert
    expect(result).toBeFalsy();
  });

  it('should check invoice positions and return true, if same item was found', () => {

    // Arrange
    const invoicePositions: InvoicePositionItem[] = [InvoicesTestConstants.INVOICE_POSITION_ITEM];
    const deliveryNotePosition: DeliveryNotePositionItem = DeliveryNotesTestConstants.DELIVERY_NOTE_POSITION_ITEM;

    // Act
    let result = service.checkPositionIsInInvp(invoicePositions, deliveryNotePosition);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should check invoice positions and return false, if same item was not found', () => {

    // Arrange
    const invoicePositions: InvoicePositionItem[] = [];
    const deliveryNotePosition: DeliveryNotePositionItem = DeliveryNotesTestConstants.DELIVERY_NOTE_POSITION_ITEM;

    // Act
    let result = service.checkPositionIsInInvp(invoicePositions, deliveryNotePosition);

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return columns and dialog columns for order positions', () => {

    // Arrange
    const clientType: CustomersTypes = CustomersTypes.B2C;
    let expectedResult: {
      cols: { field: string, header: string, disabled: boolean, readonly: boolean, size: number, width: string }[],
      dialogCols: { field: string; size: number; header: string; disabled: boolean }[]
    } = {cols: ORDER_POSITIONS_COLS, dialogCols: ORDER_POSITIONS_DIALOG_COLS};
    expectedResult.dialogCols[5].disabled = (clientType !== CustomersTypes.B2C);
    expectedResult.dialogCols[6].disabled = (clientType === CustomersTypes.B2C);

    // Act
    let result:
      {
        cols:
          { field: string, header: string, disabled: boolean, readonly: boolean, size: number, width: string }[],
        dialogCols:
          { field: string; size: number; header: string; disabled: boolean }[]
      } = service.getOrderPositionCols(clientType);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return columns and dialog columns for delivery notes', () => {

    // Arrange
    let expectedResult:
      { field: string, header: string, disabled: boolean, readonly: boolean, size: number, width: string }[]
      = DELIVERY_NOTE_POSITIONS_COLS;

    // Act
    let result:
      { field: string, header: string, disabled: boolean, readonly: boolean, size: number, width: string }[]
      = service.getDeliveryNotePositionCols();

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return columns and dialog columns for invoices', () => {

    // Arrange
    let expectedResult:
      { field: string, header: string, disabled: boolean, readonly: boolean, size: number, width: string }[]
      = INVOICE_POSITIONS_COLS;

    // Act
    let result:
      { field: string, header: string, disabled: boolean, readonly: boolean, size: number, width: string }[]
      = service.getInvoicePositionCols();

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should init positions table for orders', () => {

    // Arrange
    service.refTable = constantsService.REFTABLE_ORDERS;
    service.selCurrentTabGroupName = SubTabGroupTabNames.ORDER_DETAILS;
    spyOn(service, 'disableSaveButton').and.callThrough();
    spyOn(service, 'disableAllocateButton').and.callThrough();
    spyOn(service, 'showOrderPositions').and.callThrough();
    service.setPTable(pTable);
    spyOn(service.pTable,'setOrderPositionStates').and.callThrough();

    // Act
    service.initPositionsTable();

    // Assert
    expect(service.disableSaveButton).toHaveBeenCalled();
    expect(service.disableAllocateButton).toHaveBeenCalled();
    expect(service.showOrderPositions).toHaveBeenCalled();
    expect(service.pTable.setOrderPositionStates).toHaveBeenCalled();

  });

  it('should init positions table for delivery notes', () => {

    // Arrange
    service.refTable = constantsService.REFTABLE_DELIVERY_NOTES;
    service.selCurrentTabGroupName = SubTabGroupTabNames.DELIVERY_NOTES_DETAILS;
    spyOn(service, 'disableSaveButton').and.callThrough();
    spyOn(service, 'disableAllocateButton').and.callThrough();
    spyOn(service, 'showDeliveryNotePositions').and.callThrough();
    service.setPTable(pTable);
    spyOn(service.pTable,'setDlvPositionStates').and.callThrough();

    // Act
    service.initPositionsTable();

    // Assert
    expect(service.disableSaveButton).toHaveBeenCalled();
    expect(service.disableAllocateButton).toHaveBeenCalled();
    expect(service.showDeliveryNotePositions).toHaveBeenCalled();
    expect(service.pTable.setDlvPositionStates).toHaveBeenCalled();

  });

  it('should init positions table for invoice', () => {

    // Arrange
    service.refTable = constantsService.REFTABLE_INVOICE;
    service.selCurrentTabGroupName = SubTabGroupTabNames.INVOICE_DETAILS;
    spyOn(service, 'disableSaveButton').and.callThrough();
    spyOn(service, 'disableAllocateButton').and.callThrough();
    spyOn(service, 'showInvoicePositions').and.callThrough();
    service.setPTable(pTable);
    spyOn(service.pTable,'setInvPositionStates').and.callThrough();

    // Act
    service.initPositionsTable();

    // Assert
    expect(service.disableSaveButton).toHaveBeenCalled();
    expect(service.disableAllocateButton).toHaveBeenCalled();
    expect(service.showInvoicePositions).toHaveBeenCalled();
    expect(service.pTable.setInvPositionStates).toHaveBeenCalled();

  });

  // fit('should set value to uppercase', () => {
  //
  //   // Arrange
  //   const $event: Event = { target: { value: 'test' } } as any;
  //   const expectedResult: string = 'TEST';
  //
  //   // Act
  //   service.valueToUppercase($event);
  //
  //   // Assert
  //   expect($event).toBeFalsy($event.target.value.toUpperCase());
  // });
  //
  // fit('should set value to upper case at manage key up', () => {
  //
  //   // Arrange
  //   const $event: Event;
  //
  //   // Act
  //   service.manageKeyUp($event);
  //
  //   // Assert
  //   expect($event).toBeFalsy($event.target.value.toUpperCase());
  // });

  it('should replace autocomplete element class', () => {

    // Arrange
    const value: string = '1';
    let element = document.createElement('p-table')
    element.setAttribute('class', 'className');
    element.setAttribute('value',value);
    const classNamesToReplace = ['ng-untouched', 'ui-inputwrapper-focus', 'ng-dirty'];
    const classNamesReplaceWith = ['ng-touched', 'ui-inputwrapper-filled', 'ng-pristine'];
    spyOn(element,'getAttributeNode').and.callThrough();

    // Act
    service.replaceAutocompleteElementClass(element, classNamesToReplace, classNamesReplaceWith);

    // Assert
    expect(element.getAttributeNode).toHaveBeenCalled();
  });

  it('should return columns item properties', () => {

    // Arrange
    const item: string = 'ITMNUM';
    service.cols = ORDER_POSITIONS_COLS;

    // Act
    const result: any = service.getColsItemProperties(item);

    // Assert
    expect(result).toBeTruthy();
    expect(result).toEqual(
      {field: 'ITMNUM', header: 'SHORT_ITMNUM', disabled: false, readonly: true, size: 50, width: '40%'}
    );
  });

  it('should not return columns item properties', () => {

    // Arrange
    const item: string = 'ERROR';
    service.cols = ORDER_POSITIONS_COLS;

    // Act
    const result: any = service.getColsItemProperties(item);

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return true, if create position button should be visible', () => {

    // Arrange
    service.formDisabledFlag = false;
    service.selTableRowTaxation = 16;
    service.orderReleaseFlag = false;
    service.ordDlvInvStates = [
      {name: 'PLEASE_SELECT', value: undefined},
      {name: 'Storniert', value: 0},
      {name: 'Offen (Bestellung)', value: 10},
      {name: 'In Bearbeitung (Wartet)', value: 20},
      {name: 'Komplett abgeschlossen', value: 30}
    ]; // StatesTestConstants.STATES_SELECT_NVn;
    service.selTableRow = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_ITEM)) as Orders;
    service.selTableRow.ORDERS_STATE = 10;

    // Act
    const result: boolean = service.isCreatePositionButtonVisible();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return false, if create position button is should not be visible', () => {

    // Arrange
    service.formDisabledFlag = false;
    service.selTableRowTaxation = 16;
    service.orderReleaseFlag = false;
    service.ordDlvInvStates = [
      {name: 'PLEASE_SELECT', value: undefined},
      {name: 'Storniert', value: 0},
      {name: 'Offen (Bestellung)', value: 10},
      {name: 'In Bearbeitung (Wartet)', value: 20},
      {name: 'Komplett abgeschlossen', value: 30}
    ]; // StatesTestConstants.STATES_SELECT_NVn;
    service.selTableRow = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_ITEM)) as Orders;
    service.selTableRow.ORDERS_STATE = 30;

    // Act
    const result: boolean = service.isCreatePositionButtonVisible();

    // Assert
    expect(result).toBeFalsy();
  });
});
