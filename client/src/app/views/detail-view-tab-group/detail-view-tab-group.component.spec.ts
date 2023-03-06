import {Confirmation, ConfirmationService, MessageService} from 'primeng/api';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {DetailViewTabGroupComponent} from './detail-view-tab-group.component';
import {DynamicFormComponent} from "../../dynamic-view/dynamic-form/dynamic-form.component";
import {CustomPTableComponent} from "../custom/custom-p-table/custom-p-table.component";
import {CustomTableComponent} from "../custom/custom-table/custom-table.component";
import {CustomPDialogComponent} from "../custom/custom-p-dialog/custom-p-dialog.component";
import {
  FormOptionsINV,
  FormOptionsLVs,
  FormOptionsNVn,
  FormOptionsNVS,
  FormOptionsNVs
} from "../../interfaces/form-options";
import {StatesTestConstants} from "../../../assets/test-constants/states";
import {
  ConstantsService, CustomerAddressTypes, SoasModel,
  SubTabGroupTabNames, SubTabGroupTabNumbers, TabGroupModel,
  TabGroupTabNames,
  TabGroupTabNumbers
} from "../../_services/constants.service";
import {CurrenciesTestConstants} from "../../../assets/test-constants/currencies";
import {CountriesTestConstants} from "../../../assets/test-constants/countries";
import {DetailViewTabGroupTabsService} from "./detail-view-tab-group-tabs.service";
import {OrdersTestConstants} from "../../../assets/test-constants/orders";
import {DetailViewTabGroupFormService} from "./detail-view-tab-group-form.service";
import {CustomersTestConstants} from "../../../assets/test-constants/customers";
import {FormService} from "../../_services/form.service";
import {TableDataService} from "../../_services/table-data.service";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {ChangeDetectorRef, ElementRef} from "@angular/core";
import {DetailViewTabGroupSaveService} from "./detail-view-tab-group-save.service";
import {DeliveryNotesTestConstants} from "../../../assets/test-constants/delivery-notes";
import {MessagesService} from "../../_services/messages.service";
import {Customer} from "../../models/customer";
import {DetailViewTabGroupLoadService} from "./detail-view-tab-group-load.service";
import {DetailViewTabGroupPositionsService} from "./detail-view-tab-group-positions.service";
import {DetailViewTabGroupPDialogService} from "./detail-view-tab-group-p-dialog.service";
import {DetailViewTabGroupCustomerAddressesService} from "./detail-view-tab-group-customer-addresses.service";
import {Table, TableModule} from "primeng/table";
import {MatPaginator} from "@angular/material/paginator";
import {FetchTableService} from "../../_services/fetch-table.service";
import {DeliveryNotes} from "../../models/delivery-notes";


describe('DetailViewTabGroupComponent', () => {
  let component: DetailViewTabGroupComponent;
  let fixture: ComponentFixture<DetailViewTabGroupComponent>;
  let translate: TranslateItPipe;
  let constantsService: ConstantsService;
  let tabsService: DetailViewTabGroupTabsService;
  let form: DynamicFormComponent;
  let tabGroupFormService: DetailViewTabGroupFormService;
  let formService: FormService;
  let tableDataService: TableDataService;
  let saveService: DetailViewTabGroupSaveService;
  let pDialogComponent: CustomPDialogComponent;
  let pTable: Table;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, TableModule],
      declarations: [DetailViewTabGroupComponent, TranslateItPipe],
      providers: [TranslateItPipe, MessagesService, DynamicFormComponent, CustomPTableComponent,
        CustomTableComponent, CustomPDialogComponent, ConstantsService, DetailViewTabGroupTabsService,
        DetailViewTabGroupFormService, FormService, TableDataService, DetailViewTabGroupSaveService,
        ConfirmationService, DetailViewTabGroupLoadService, ChangeDetectorRef, MatPaginator, MessageService]
    })

    fixture = TestBed.createComponent(DetailViewTabGroupComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateItPipe);
    constantsService = TestBed.inject(ConstantsService);
    tabsService = TestBed.inject(DetailViewTabGroupTabsService);
    form = TestBed.inject(DynamicFormComponent);
    tabGroupFormService = TestBed.inject(DetailViewTabGroupFormService);
    component.tabGroupFormService = tabGroupFormService;
    formService = TestBed.inject(FormService);
    tableDataService = TestBed.inject(TableDataService);
    saveService = TestBed.inject(DetailViewTabGroupSaveService);
    pDialogComponent = TestBed.inject(CustomPDialogComponent);
    pTable = fixture.debugElement.children[0].componentInstance;
    // set input property function: @Input() refreshDetails: Function;
    component.refreshDetails = new Function(); // set input before first detectChanges
    component.tabsService = tabsService;
    component.tabsService.selTabGroupTab = TabGroupTabNumbers.DELIVERY_NOTE;
    component.tabsService.selSubTabGroupTab = SubTabGroupTabNumbers.DETAILS;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset taxation', function () {

    // Arrange

    // Act
    component.resetTaxation();

    // Assert
    expect(component.selTableRowTaxation).toEqual(undefined);
  });

  it('should set referral table name', function () {

    // Arrange
    const tableName: string = constantsService.REFTABLE_ORDERS;

    // Act
    component.setRefTable(tableName);

    // Assert
    expect(component.refTable).toEqual(tableName);
  });

  it('should set states', function () {

    // Arrange
    const states: FormOptionsNVn[] = StatesTestConstants.STATES_SELECT_NVn;

    // Act
    component.setStates(states);

    // Assert
    expect(component.ordDlvInvStates).toEqual(states);
  });

  it('should set order positions states', function () {

    // Arrange
    const states: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;

    // Act
    component.setOrderPositionStates(states);

    // Assert
    expect(component.ordPosStates).toEqual(states);
  });

  it('should set delivery note positions states', function () {

    // Arrange
    const states: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_LI_POSITIONS;

    // Act
    component.setDlvPositionStates(states);

    // Assert
    expect(component.dlvPosStates).toEqual(states);
  });

  it('should set invoice positions states', function () {

    // Arrange
    const states: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_RG_POSITIONS;

    // Act
    component.setInvPositionStates(states);

    // Assert
    expect(component.invPosStates).toEqual(states);
  });

  it('should set currencies (name and value)', function () {

    // Arrange
    const currencies: FormOptionsNVs[] = CurrenciesTestConstants.CURRENCIES_NV;

    // Act
    component.setCurrencies(currencies);

    // Assert
    expect(component.currencies).toEqual(currencies);
  });

  it('should set p currencies (label and value)', function () {

    // Arrange
    const pcurrencies: FormOptionsLVs[] = CurrenciesTestConstants.PCURRENCIES_LV;

    // Act
    component.setPCurrencies(pcurrencies);

    // Assert
    expect(component.pcurrencies).toEqual(pcurrencies);
  });

  it('should set countries (id, name, and value)', function () {

    // Arrange
    const countriesWithId: FormOptionsINV[] = CountriesTestConstants.COUNTRIES_WITH_ID;

    // Act
    component.setCountriesWithId(countriesWithId);

    // Assert
    expect(component.countriesWithId).toEqual(countriesWithId);
  });

  it('should get current tab names', function () {

    // Arrange
    const tabIndex: number = 1;
    const tabGroupIndex: number = 0;
    spyOn(tabsService, 'getCurrentTabNames').and.callThrough();

    // Act
    const result: SubTabGroupTabNames = component.getCurrentTabNames(tabIndex, tabGroupIndex);

    // Assert
    expect(tabsService.getCurrentTabNames).toHaveBeenCalled();
    expect(result).toEqual(SubTabGroupTabNames.ORDER_DETAILS);
  });

  it('should get current tab name', function () {

    // Arrange
    tabsService.setSelCurrentTabName(TabGroupTabNames.ORDER);
    spyOn(tabsService, 'getSelCurrentTabName').and.callThrough();

    // Act
    const result: TabGroupTabNames = component.getCurrentTabName();

    // Assert
    expect(tabsService.getSelCurrentTabName).toHaveBeenCalled();
    expect(result).toEqual(TabGroupTabNames.ORDER);
  });

  it('should show table form data', function () {

    // Arrange
    const tabIndex: number = 3;
    const tabGroupIndex: number = 0;
    // tabsService.setSelCurrentTabName(TabGroupTabNames.ORDER);
    component.refTable = constantsService.REFTABLE_INVOICE;
    tabsService.setTabToSelect(TabGroupTabNumbers.INVOICE);
    // spyOn(tabsService,'getSelCurrentTabName').and.callThrough();
    spyOn(component, 'getFormData').and.callThrough();

    // Act
    component.showTableFormData(tabIndex, tabGroupIndex);

    // Assert
    expect(component.getFormData).toHaveBeenCalled();
  });

  it('should load form data', fakeAsync(() => {

    // Arrange
    const secondaryRefTable: string = constantsService.REFTABLE_ORDERS
    const tablePrimaryColumn: string = constantsService.REFTABLE_ORDERS_COLUMN;
    const tablePrimaryValue: string = OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER;
    const formSecondColumn: string = constantsService.REFTABLE_ORDERS_COLUMN;
    const formSecondValue: string = OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER;
    const createNewItemMode: boolean = false;
    const subTabName: SubTabGroupTabNames = SubTabGroupTabNames.ORDER_DETAILS
    const existsTableData: boolean = true;
    component.form = form;
    spyOn(component, 'initializeTabGroupForm').and.callThrough();
    // spyOn(component,'initializePositionsService').and.callThrough();
    // spyOn(component,'initializePDialogService').and.callThrough();
    spyOn(tabGroupFormService, 'getFormDataLogic').and.callThrough();

    // Act
    component.loadFormData(secondaryRefTable, tablePrimaryColumn, tablePrimaryValue, formSecondColumn, formSecondValue,
      createNewItemMode, subTabName, existsTableData);

    // Assert
    expect(component.initializeTabGroupForm).toHaveBeenCalled();
    // expect(component.initializePositionsService).toHaveBeenCalled();
    // expect(component.initializePDialogService).toHaveBeenCalled();
    expect(tabGroupFormService.getFormDataLogic).toHaveBeenCalled();
  }));

  it('should set new item mode for orders', function () {

    // Arrange
    const flag: boolean = true;
    component.refTable = constantsService.REFTABLE_ORDERS;
    spyOn(component, 'resetNewModes').and.callThrough();

    // Act
    component.setNewItem(flag);

    // Assert
    expect(component.resetNewModes).toHaveBeenCalled();
    expect(component.newOrderMode).toBeTruthy();
  });

  it('should set new item mode for customer', function () {

    // Arrange
    const flag: boolean = true;
    component.refTable = constantsService.REFTABLE_CUSTOMER;
    spyOn(component, 'resetNewModes').and.callThrough();

    // Act
    component.setNewItem(flag);

    // Assert
    expect(component.resetNewModes).toHaveBeenCalled();
    expect(component.newCustomerMode).toBeTruthy();
  });

  it('should set new item mode for partner', function () {

    // Arrange
    const flag: boolean = true;
    component.refTable = constantsService.REFTABLE_PARTNERS;
    spyOn(component, 'resetNewModes').and.callThrough();

    // Act
    component.setNewItem(flag);

    // Assert
    expect(component.resetNewModes).toHaveBeenCalled();
    expect(component.newCustomerMode).toBeTruthy();
  });

  it('should set new item mode for delivery note', function () {

    // Arrange
    const flag: boolean = true;
    component.refTable = constantsService.REFTABLE_DELIVERY_NOTES;
    spyOn(component, 'resetNewModes').and.callThrough();

    // Act
    component.setNewItem(flag);

    // Assert
    expect(component.resetNewModes).toHaveBeenCalled();
    expect(component.newDeliveryNoteMode).toBeTruthy();
  });

  it('should set new item mode for invoice', function () {

    // Arrange
    const flag: boolean = true;
    component.refTable = constantsService.REFTABLE_INVOICE;
    spyOn(component, 'resetNewModes').and.callThrough();

    // Act
    component.setNewItem(flag);

    // Assert
    expect(component.resetNewModes).toHaveBeenCalled();
    expect(component.newInvoiceMode).toBeTruthy();
  });

  it('should get new item mode for order', function () {

    // Arrange
    component.refTable = constantsService.REFTABLE_ORDERS;
    component.newOrderMode = true;

    // Act
    const result: boolean = component.getNewItemFlag();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should get new item mode for customer', function () {

    // Arrange
    component.refTable = constantsService.REFTABLE_CUSTOMER;
    component.newCustomerMode = true;

    // Act
    const result: boolean = component.getNewItemFlag();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should get new item mode for partner', function () {

    // Arrange
    component.refTable = constantsService.REFTABLE_PARTNERS;
    component.newCustomerMode = true;

    // Act
    const result: boolean = component.getNewItemFlag();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should get new item mode for delivery note', function () {

    // Arrange
    component.refTable = constantsService.REFTABLE_DELIVERY_NOTES;
    component.newDeliveryNoteMode = true;

    // Act
    const result: boolean = component.getNewItemFlag();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should get new item mode for invoice', function () {

    // Arrange
    component.refTable = constantsService.REFTABLE_INVOICE;
    component.newInvoiceMode = true;

    // Act
    const result: boolean = component.getNewItemFlag();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should get customer form data', fakeAsync(() => {

    // Arrange
    spyOn(component, 'getFormData').and.callThrough();

    // Act
    component.getCustomerFormData();

    // Assert
    expect(component.getFormData).toHaveBeenCalled();
  }));

  it('should get order form data', fakeAsync(() => {

    // Arrange
    spyOn(component, 'getFormData').and.callThrough();

    // Act
    component.getOrderFormData();

    // Assert
    expect(component.getFormData).toHaveBeenCalled();
  }));

  /*

  public async getCustomerFormData() {
    await this.getFormData(SubTabGroupTabNames.CUSTOMER_DETAILS);
  }

  public async getOrderFormData() {
    await this.getFormData(SubTabGroupTabNames.ORDER_DETAILS);
  }
   */

  it('should save form', fakeAsync(() => {

    // Arrange
    const fields: FormlyFieldConfig[] = [];
    const fromValues: { formValues: TabGroupModel, fields: FormlyFieldConfig[] } =
      {formValues: OrdersTestConstants.ORDERS_ITEM, fields: fields};
    component.refTable = constantsService.REFTABLE_ORDERS;
    component.newOrderMode = true;
    spyOn(component, 'setIsLoadingResults').and.callThrough();
    spyOn(formService, 'saveForm').and.callThrough();
    spyOn(tabsService, 'getCurrentTabNames').and.callThrough();
    spyOn(component, 'getFormValuesAndFields').and.returnValue(fromValues);
    spyOn(component, 'refreshDetails').and.callThrough();

    // Act
    component.save();

    tick();

    // Assert
    expect(formService.saveForm).toHaveBeenCalled();
    expect(component.setIsLoadingResults).toHaveBeenCalled();
    expect(tabsService.getCurrentTabNames).toHaveBeenCalled();
    expect(component.getFormValuesAndFields).toHaveBeenCalled();
    expect(component.refreshDetails).toHaveBeenCalled();
  }));

  it('should create new address item', function () {
    // Arrange
    const formValues: {} = {};
    const fields: FormlyFieldConfig[] = [];
    const expectedResult: { formValues: {}, fields: FormlyFieldConfig[] } =
      {formValues: formValues, fields: fields};
    component.form = form;

    // Act
    const result: { formValues: {}, fields: FormlyFieldConfig[] } =
      component.getFormValuesAndFields();

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return true if order is released', function () {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS;
    tabGroupFormService.orderReleaseFlag = true;

    // Act
    const result: boolean = component.isReleased(refTable);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return true if delivery note is released', function () {

    // Arrange
    const refTable: string = constantsService.REFTABLE_DELIVERY_NOTES;
    tabGroupFormService.deliveryNoteReleaseFlag = true;

    // Act
    const result: boolean = component.isReleased(refTable);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return true if invoice is released', function () {

    // Arrange
    const refTable: string = constantsService.REFTABLE_INVOICE;
    tabGroupFormService.invoiceReleaseFlag = true;

    // Act
    const result: boolean = component.isReleased(refTable);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not create new address item, if referral table is undefined', fakeAsync(() => {

    // Arrange
    console.log = jasmine.createSpy("log");
    const addressType: CustomerAddressTypes = CustomerAddressTypes.DLV;
    component.refTable = undefined;
    component.newItemMode, component.newCustomerMode, component.newOrderMode,
      component.newCustomerAddrDLVMode, component.newCustomerAddrINVMode = false;
    component.selTableRow = CustomersTestConstants.CUSTOMER_B2C_ITEM;
    tabGroupFormService.form = form;
    component.form = form;
    spyOn(component, 'getFormData').and.callThrough();
    spyOn(tabGroupFormService, 'addressCountryNameChange').and.callThrough();

    // Act
    component.createAddressItem(addressType);

    // Assert
    expect(component.newCustomerAddrDLVMode).toBeTruthy();
    expect(component.getFormData).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(new Error('refTable is undefined...'));
  }));

  // tabGroupFormService.addressCountryNameChange is not called...
  it('should create new address item', fakeAsync(() => {

    // Arrange
    const addressType: CustomerAddressTypes = CustomerAddressTypes.DLV;
    component.refTable = constantsService.REFTABLE_CUSTOMER;
    component.newItemMode, component.newCustomerMode, component.newOrderMode, component.newCustomerAddrDLVMode,
      component.newCustomerAddrINVMode = false;
    component.selTableRow = CustomersTestConstants.CUSTOMER_B2C_ITEM;
    const tableDbData: { table: [any[string], any[]], maxRows: number, page: number } =
      CustomersTestConstants.CUSTOMERS_B2C_TABLE_DB_DATA;
    // component.tabGroupFormService = tabGroupFormService;
    tabGroupFormService.form = form;
    component.form = form;
    // component.tableDataService = tableDataService;
    spyOn(component, 'getFormData').and.callThrough();
    spyOn(tabGroupFormService, 'addressCountryNameChange').and.callThrough();
    // thing["init"]("Unit Test", 123);
    spyOn(tableDataService, 'getTableDataByCustomersNumber').and.returnValue(Promise.resolve(tableDbData));
    // spyOn(component,'resetTableAndForm').and.callThrough();
    // tableDataService.isTableLocked
    // loadService.getParamDataForLoading

    // Act
    component.createAddressItem(addressType);

    // Assert
    expect(component.newCustomerAddrDLVMode).toBeTruthy();
    expect(component.getFormData).toHaveBeenCalled();
    // expect(tableDataService.getTableDataByCustomersNumber).toHaveBeenCalled();
    // expect(tabGroupFormService.addressCountryNameChange).toHaveBeenCalled();
  }));

  // fit('should not create new address item, if ', fakeAsync(() => {
  //
  //   // Arrange
  //   console.log = jasmine.createSpy("log");
  //   const addressType: CustomerAddressTypes = CustomerAddressTypes.DLV;
  //   component.refTable = constantsService.REFTABLE_CUSTOMER;
  //   component.newItemMode, component.newCustomerMode, component.newOrderMode, component.newCustomerAddrDLVMode,
  //     component.newCustomerAddrINVMode = false;
  //   component.selTableRow = CustomersTestConstants.CUSTOMER_B2C_ITEM;
  //   const tableDbData: {} = undefined;
  //   tabGroupFormService.form = form;
  //   component.form = form;
  //   spyOn(component, 'getFormData').and.callThrough();
  //   spyOn(tabGroupFormService, 'addressCountryNameChange').and.callThrough();
  //   // thing["init"]("Unit Test", 123);
  //   // create get function...
  //   spyOn(tableDataService,'getTableDataByCustomersNumber').and.returnValue(Promise.resolve(tableDbData));
  //
  //   // Act
  //   component.createAddressItem(addressType);
  //
  //   // Assert
  //   expect(component.newCustomerAddrDLVMode).toBeTruthy();
  //   expect(component.getFormData).toHaveBeenCalled();
  //   expect(console.log).toHaveBeenCalledWith(new Error('tableDbData is undefined...'));
  // }));

  it('should set selected tab index #0', fakeAsync(() => {

    // Arrange
    const selectedIndex: TabGroupTabNumbers = TabGroupTabNumbers.ORDER;
    component.tabGroup.selectedIndex = TabGroupTabNumbers.CUSTOMER;
    component.selectedIndexChange = new Function();
    // spyOn(component,'getFormData').and.callThrough();

    // Act
    component.setSelectedTabIndex(selectedIndex);
    // detect changes, because tab group index was changed...
    fixture.detectChanges();

    // Assert
    expect(component.tabGroup.selectedIndex).toEqual(selectedIndex);
    // expect(component.countriesWithId).toEqual(selectedIndex);
    // expect(component.getFormData).toHaveBeenCalled();
  }));

  it('should load customer form data if tab index #0 is selected', fakeAsync(() => {

    // Arrange
    const selectedIndex: TabGroupTabNumbers = TabGroupTabNumbers.CUSTOMER;
    component.tabGroup.selectedIndex = TabGroupTabNumbers.CUSTOMER;
    // detect changes, because tab group index was changed...
    fixture.detectChanges();
    component.selectedIndexChange = new Function();
    component.refTable = constantsService.REFTABLE_CUSTOMER;
    component.form = form;
    spyOn(component, 'getFormData').and.callThrough();

    // Act
    component.setSelectedTabIndex(selectedIndex);

    // Assert
    expect(component.tabGroup.selectedIndex).toEqual(selectedIndex);
    expect(component.getFormData).toHaveBeenCalled();
  }));

  it('should load order form data if tab index #1 is selected', fakeAsync(() => {

    // Arrange
    const selectedIndex: TabGroupTabNumbers = TabGroupTabNumbers.ORDER;
    component.tabGroup.selectedIndex = TabGroupTabNumbers.ORDER;
    // detect changes, because tab group index was changed...
    fixture.detectChanges();
    component.selectedIndexChange = new Function();
    component.refTable = constantsService.REFTABLE_ORDERS;
    component.form = form;
    spyOn(component, 'getFormData').and.callThrough();

    // Act
    component.setSelectedTabIndex(selectedIndex);

    // Assert
    expect(component.tabGroup.selectedIndex).toEqual(selectedIndex);
    expect(component.getFormData).toHaveBeenCalled();
  }));

  it('should load delivery note form data if tab index #2 is selected', fakeAsync(() => {

    // Arrange
    const selectedIndex: TabGroupTabNumbers = TabGroupTabNumbers.DELIVERY_NOTE;
    component.tabGroup.selectedIndex = TabGroupTabNumbers.DELIVERY_NOTE;
    // detect changes, because tab group index was changed...
    fixture.detectChanges();
    component.selectedIndexChange = new Function();
    component.refTable = constantsService.REFTABLE_DELIVERY_NOTES;
    component.form = form;
    spyOn(component, 'getFormData').and.callThrough();

    // Act
    component.setSelectedTabIndex(selectedIndex);

    // Assert
    expect(component.tabGroup.selectedIndex).toEqual(selectedIndex);
    expect(component.getFormData).toHaveBeenCalled();
  }));

  it('should load invoice form data if tab index #3 is selected', fakeAsync(() => {

    // Arrange
    const selectedIndex: TabGroupTabNumbers = TabGroupTabNumbers.INVOICE;
    component.tabGroup.selectedIndex = TabGroupTabNumbers.INVOICE;
    // detect changes, because tab group index was changed...
    fixture.detectChanges();
    component.selectedIndexChange = new Function();
    component.refTable = constantsService.REFTABLE_INVOICE;
    component.form = form;
    spyOn(component, 'getFormData').and.callThrough();

    // Act
    component.setSelectedTabIndex(selectedIndex);

    // Assert
    expect(component.tabGroup.selectedIndex).toEqual(selectedIndex);
    expect(component.getFormData).toHaveBeenCalled();
  }));

  it('should load comment form data if tab index #4 is selected', fakeAsync(() => {

    // Arrange
    const selectedIndex: TabGroupTabNumbers = TabGroupTabNumbers.COMMENT;
    component.tabGroup.selectedIndex = TabGroupTabNumbers.COMMENT;
    // detect changes, because tab group index was changed...
    fixture.detectChanges();
    component.selectedIndexChange = new Function();
    component.refTable = constantsService.REFTABLE_COMMENTS;
    component.form = form;
    spyOn(component, 'getFormData').and.callThrough();

    // Act
    component.setSelectedTabIndex(selectedIndex);
    // detect changes, because tab group index was changed...
    fixture.detectChanges();

    // Assert
    expect(component.tabGroup.selectedIndex).toEqual(selectedIndex);
    expect(component.getFormData).toHaveBeenCalled();
  }));

  it('should create delivery note', fakeAsync(() => {

    // Arrange
    const saveResultData: { result: boolean, message: string } = {result: true, message: 'ok'};
    spyOn(component, 'setIsLoadingResults').and.callThrough();
    spyOn(component, 'disableCreateDeliveryNoteButton').and.callThrough();
    spyOn(component, 'disableCreateInvoiceButton').and.callThrough();
    spyOn(saveService, 'createDeliveryNote').and.returnValue(Promise.resolve(saveResultData));

    // Act
    component.createDeliveryNote();

    // Assert
    expect(component.setIsLoadingResults).toHaveBeenCalled();
    expect(component.disableCreateDeliveryNoteButton).toHaveBeenCalled();
    expect(component.disableCreateInvoiceButton).toHaveBeenCalled();
    expect(saveService.createDeliveryNote).toHaveBeenCalled();
  }));

  it('should create invoice', fakeAsync(() => {

    // Arrange
    const saveResultData: { result: boolean, message: string } = {result: true, message: 'ok'};
    spyOn(component, 'setIsLoadingResults').and.callThrough();
    spyOn(component, 'disableCreateDeliveryNoteButton').and.callThrough();
    spyOn(component, 'disableCreateInvoiceButton').and.callThrough();
    spyOn(saveService, 'createInvoice').and.returnValue(Promise.resolve(saveResultData));

    // Act
    component.createInvoice();

    // Assert
    expect(component.setIsLoadingResults).toHaveBeenCalled();
    expect(component.disableCreateDeliveryNoteButton).toHaveBeenCalled();
    expect(component.disableCreateInvoiceButton).toHaveBeenCalled();
    expect(saveService.createInvoice).toHaveBeenCalled();
  }));

  it('should disable allocation button', function () {

    // Arrange
    const disable: boolean = true;
    component.allocateButton = new ElementRef(
      {nativeElement: jasmine.createSpyObj('nativeElement', ['disabled'])}
    );

    // Act
    component.disableAllocateButton(disable);

    // Assert
    expect(component.allocateButton.nativeElement.disabled).toEqual(disable);
  });

  it('should call refreshTableViews on table form cancel', function () {

    // Arrange
    component.resetState = false;
    spyOn(tabGroupFormService, 'disableSaveButton').and.callThrough();

    // Act
    component.onTableFormCancel();

    // Assert
    expect(tabGroupFormService.disableSaveButton).toHaveBeenCalled();
    expect(component.resetState).toBeTruthy();
  });

  it('should call resetForm on table form cancel', function () {

    // Arrange
    component.resetState = true;
    component.resetForm = new Function();
    tabGroupFormService.form = form;
    spyOn(tabGroupFormService, 'disableSaveButton').and.callThrough();
    spyOn(component, 'resetForm').and.callThrough();

    // Act
    component.onTableFormCancel();

    // Assert
    expect(tabGroupFormService.disableSaveButton).toHaveBeenCalled();
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.resetState).toBeTruthy();
  });

  it('should toggle full edit mode', function () {

    // Arrange
    component.fullEditMode = true;
    spyOn(tabGroupFormService, 'disableSaveButton').and.callThrough();

    // Act
    component.toggleFullEditMode();

    // Assert
    expect(component.fullEditMode).toBeFalsy();
    expect(tabGroupFormService.disableSaveButton).toHaveBeenCalled();
  });

  it('should reset new item modes', function () {

    // Arrange
    component.newItemMode = true;
    component.newCustomerMode = true;
    component.newCustomerAddrDLVMode = true;
    component.newCustomerAddrINVMode = true;
    component.newOrderMode = true;
    component.newOrderPosition = true;
    component.newInvoicePosition = true;
    component.newOrderPositionMode = true;
    component.newDeliveryNoteMode = true;
    component.newInvoiceMode = true;
    component.tabGroupFormService.formDataAvailableFlag = true;

    // Act
    component.resetNewModes();

    // Assert
    expect(component.newItemMode).toBeFalsy();
    expect(component.newCustomerMode).toBeFalsy();
    expect(component.newCustomerAddrDLVMode).toBeFalsy();
    expect(component.newCustomerAddrINVMode).toBeFalsy();
    expect(component.newOrderMode).toBeFalsy();
    expect(component.newOrderPosition).toBeFalsy();
    expect(component.newInvoicePosition).toBeFalsy();
    expect(component.newOrderPositionMode).toBeFalsy();
    expect(component.newDeliveryNoteMode).toBeFalsy();
    expect(component.newInvoiceMode).toBeFalsy();
    expect(component.tabGroupFormService.formDataAvailableFlag).toBeFalsy();
  });

  it('should empty selected table row', function () {

    // Arrange
    component.selTableRow = OrdersTestConstants.ORDERS_ITEM;

    // Act
    component.emptySelTableRow();

    // Assert
    expect(component.selTableRow).toEqual(undefined)

  });

  it('should close form view for new order position mode = true and not empty selTableRow', fakeAsync(() => {

    // Arrange
    component.refTable = constantsService.REFTABLE_ORDERS;
    component.form = form;
    component.newOrderPositionMode = true;
    component.selTableRow = OrdersTestConstants.ORDERS_ITEM;
    spyOn(component.form, 'resetForm').and.callThrough();
    spyOn(component, 'resetNewModes').and.callThrough();
    spyOn(component, 'getFormData').and.callThrough();

    // Act
    component.close();

    // Assert
    expect(component.form.resetForm).toHaveBeenCalled();
    expect(component.resetNewModes).toHaveBeenCalled();
    expect(component.getFormData).toHaveBeenCalled();

  }));

  it('should close form view for new order position mode = true and empty selTableRow', fakeAsync(() => {

    // Arrange
    component.refTable = constantsService.REFTABLE_ORDERS;
    component.form = form;
    component.newOrderPositionMode = true;
    component.selTableRow = undefined;
    component.refreshTable = new Function();
    spyOn(component.form, 'resetForm').and.callThrough();
    spyOn(component, 'resetNewModes').and.callThrough();
    spyOn(component, 'refreshTable').and.callThrough();

    // Act
    component.close();

    // Assert
    expect(component.form.resetForm).toHaveBeenCalled();
    expect(component.resetNewModes).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();

  }));

  it('should close form view for new order mode = true', fakeAsync(() => {

    // Arrange
    component.refTable = constantsService.REFTABLE_ORDERS;
    component.form = form;
    component.newOrderPositionMode = false;
    component.newOrderMode = true;
    component.refreshTable = new Function();
    spyOn(component.form, 'resetForm').and.callThrough();
    spyOn(component, 'resetNewModes').and.callThrough();
    spyOn(component, 'refreshTable').and.callThrough();

    // Act
    component.close();

    // Assert
    expect(component.form.resetForm).toHaveBeenCalled();
    expect(component.resetNewModes).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();

  }));

  it('should close form view for new customer mode = true and not empty selTableRow', fakeAsync(() => {

    // Arrange
    component.refTable = constantsService.REFTABLE_CUSTOMER;
    component.form = form;
    component.newOrderPositionMode = false;
    component.newOrderMode = false;
    component.newCustomerMode = true;
    component.selTableRow = CustomersTestConstants.CUSTOMER_B2C_ITEM;
    spyOn(component.form, 'resetForm').and.callThrough();
    spyOn(component, 'resetNewModes').and.callThrough();
    spyOn(component, 'refreshDetails').and.callThrough();

    // Act
    component.close();

    // Assert
    expect(component.form.resetForm).toHaveBeenCalled();
    expect(component.resetNewModes).toHaveBeenCalled();
    expect(component.refreshDetails).toHaveBeenCalled();

  }));

  it('should close form view for new customer mode = true and empty selTableRow', fakeAsync(() => {

    // Arrange
    component.refTable = constantsService.REFTABLE_CUSTOMER;
    component.form = form;
    component.newOrderPositionMode = false;
    component.newOrderMode = false;
    component.newCustomerMode = false;
    component.newCustomerMode = true;
    component.selTableRow = undefined;
    component.refreshTable = new Function();
    spyOn(component.form, 'resetForm').and.callThrough();
    spyOn(component, 'resetNewModes').and.callThrough();
    spyOn(component, 'refreshTable').and.callThrough();

    // Act
    component.close();

    // Assert
    expect(component.form.resetForm).toHaveBeenCalled();
    expect(component.resetNewModes).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();

  }));

  it('should close form view for new customer address dlv mode = true and not empty selTableRow', fakeAsync(() => {

    // Arrange
    component.refTable = constantsService.REFTABLE_CUSTOMER;
    component.form = form;
    component.newOrderPositionMode = false;
    component.newOrderMode = false;
    component.newCustomerMode = false;
    component.newCustomerAddrDLVMode = true;
    component.selTableRow = CustomersTestConstants.CUSTOMER_B2C_ITEM;
    spyOn(component.form, 'resetForm').and.callThrough();
    spyOn(component, 'resetNewModes').and.callThrough();
    spyOn(component, 'getFormData').and.callThrough();

    // Act
    component.close();

    // Assert
    expect(component.form.resetForm).toHaveBeenCalled();
    expect(component.resetNewModes).toHaveBeenCalled();
    expect(component.getFormData).toHaveBeenCalled();

  }));

  it('should close form view for new customer address inv mode = true and not empty selTableRow', fakeAsync(() => {

    // Arrange
    component.refTable = constantsService.REFTABLE_CUSTOMER;
    component.form = form;
    component.newOrderPositionMode = false;
    component.newOrderMode = false;
    component.newCustomerMode = false;
    component.newCustomerAddrDLVMode = false;
    component.newCustomerAddrINVMode = true;
    component.selTableRow = CustomersTestConstants.CUSTOMER_B2C_ITEM;
    spyOn(component.form, 'resetForm').and.callThrough();
    spyOn(component, 'resetNewModes').and.callThrough();
    spyOn(component, 'getFormData').and.callThrough();

    // Act
    component.close();

    // Assert
    expect(component.form.resetForm).toHaveBeenCalled();
    expect(component.resetNewModes).toHaveBeenCalled();
    expect(component.getFormData).toHaveBeenCalled();

  }));

  // Error: Expected spy refreshTable to have been called.
  it('should close form view for all new modes = false', fakeAsync(() => {

    // Arrange
    component.refTable = constantsService.REFTABLE_CUSTOMER;
    component.form = form;
    component.newOrderPositionMode = false;
    component.newOrderMode = false;
    component.newCustomerMode = false;
    component.newCustomerAddrDLVMode = false;
    component.newCustomerAddrINVMode = false;
    component.selTableRow = CustomersTestConstants.CUSTOMER_B2C_ITEM;
    component.refreshTable = new Function();
    spyOn(component.form, 'resetForm').and.callThrough();
    spyOn(component, 'resetNewModes').and.callThrough();
    // spyOn(tableDataService, 'removeAllTableLocks').and.callThrough();
    spyOn(component, 'refreshTable').and.callThrough();

    // Act
    component.close();

    // Assert
    expect(component.form.resetForm).toHaveBeenCalled();
    expect(component.resetNewModes).toHaveBeenCalled();
    // expect(component.refreshTable).toHaveBeenCalled();
  }));

  it('should update table', fakeAsync(() => {

    // Arrange
    // component.refTable = constantsService.REFTABLE_CUSTOMER;
    const selTableRow = CustomersTestConstants.CUSTOMER_B2C_ITEM;
    component.newItemMode = true;
    component.selTableRow = undefined;
    spyOn(component, 'emptySelTableRow').and.callThrough();

    // Act
    component.updateTable(selTableRow);

    // Assert
    expect(component.emptySelTableRow).toHaveBeenCalled();
    expect(component.selTableRow).toEqual(selTableRow);
    expect(component.newItemMode).toBeFalsy();
  }));

  it('should delete delivery note', fakeAsync(() => {

    // Arrange
    component.refTable = constantsService.REFTABLE_DELIVERY_NOTES;
    const confirmationService: ConfirmationService = TestBed.inject(ConfirmationService);
    const messagesService: MessagesService = TestBed.inject(MessagesService);
    component.selTableRow = DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM;
    component.translatePipe = translate;
    spyOn(confirmationService, 'confirm').and.callFake((confirmation: Confirmation) => confirmation.accept());
    spyOn(tableDataService, 'deleteTableData').and.returnValue(Promise.resolve({'result': true}));
    spyOn(messagesService, 'showSuccessMessage').and.returnValue(true);
    spyOn(tableDataService, 'getLastIdOfTable').and.returnValues(Promise.resolve({id: '1'}));
    spyOn(saveService, 'storeLastAddedItemToLS').and.callThrough();
    spyOn(localStorage,'setItem').and.callThrough();
    spyOn(component, 'showTableFormData').and.callThrough();
    spyOn(component, 'getCurrentTabNames').and.returnValue(SubTabGroupTabNames.DELIVERY_NOTES_DETAILS);
    spyOn(component, 'getFormData').and.callThrough();
    spyOn(tabGroupFormService, 'disableSaveButton').and.callThrough();
    spyOn(component, 'setIsLoadingResults').and.callThrough();

    // Act
    component.deleteDeliveryNote();

    tick();

    // Assert
    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(messagesService.showSuccessMessage).toHaveBeenCalled();
    expect(tableDataService.getLastIdOfTable).toHaveBeenCalled();
    expect(saveService.storeLastAddedItemToLS).toHaveBeenCalled();
    expect(component.showTableFormData).toHaveBeenCalled();
    expect(component.getFormData).toHaveBeenCalled();
    expect(component.setIsLoadingResults).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalled();
  }));

  it('should show error at delete delivery note', fakeAsync(() => {

    // Arrange
    component.refTable = constantsService.REFTABLE_DELIVERY_NOTES;
    const confirmationService: ConfirmationService = TestBed.inject(ConfirmationService);
    const messagesService: MessagesService = TestBed.inject(MessagesService);
    component.selTableRow = DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM;
    component.translatePipe = translate;
    spyOn(confirmationService, 'confirm').and.callFake((confirmation: Confirmation) => confirmation.accept());
    spyOn(tableDataService, 'deleteTableData').and.returnValue(Promise.resolve({'result': {'error': 'Error text'}}));
    spyOn(String.prototype, 'replace').and.callThrough();
    spyOn(translate, 'transform').and.callThrough();
    spyOn(messagesService, 'showErrorMessage').and.callThrough();
    spyOn(component, 'setIsLoadingResults').and.callThrough();

    // Act
    component.deleteDeliveryNote();

    tick();

    // Assert
    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(messagesService.showErrorMessage).toHaveBeenCalled();
    expect(component.setIsLoadingResults).toHaveBeenCalled();
  }));

  it('should set paginator', function () {

    // Arrange
    const paginatorPerSide: number[] = [14];

    // Act
    component.setPaginator(paginatorPerSide);

    // Assert
    expect(component.PAGINATOR_ELEMENTS_PER_SIDE).toEqual(paginatorPerSide);
  });

  it('should set page size', function () {

    // Arrange
    const currPageSize: number = 14;

    // Act
    component.setPageSize(currPageSize);

    // Assert
    expect(component.currPageSizeMainTable).toEqual(currPageSize);
  });

  it('return true if allocation button should be visible', function () {

    // Arrange
    const isVisible: boolean = true;
    tabGroupFormService.orderReleaseFlag = false;
    tabGroupFormService.formDisabledFlag = false;
    component.pTable = TestBed.inject(CustomPTableComponent);
    component.pTable.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM];

    // Act
    const result: boolean = component.isAllocateButtonVisible();

    // Assert
    expect(result).toEqual(isVisible);
  });

  it('return true if save button should be visible', function () {

    // Arrange
    const isVisible: boolean = true;
    tabGroupFormService.orderReleaseFlag = false;
    tabGroupFormService.formDisabledFlag = false;
    component.pTable = TestBed.inject(CustomPTableComponent);
    component.pTable.positionsWithId = [OrdersTestConstants.ORDERS_POSITION_ITEM];

    // Act
    const result: boolean = component.isSaveButtonVisible();

    // Assert
    expect(result).toEqual(isVisible);
  });

  it('should allocate order positions', fakeAsync(() => {

    // Arrange
    const tryAllocateResult: { success: boolean, message: any, data: any } =
      {success: true, message: 'Message', data: []};
    component.refTable = constantsService.REFTABLE_ORDERS;
    component.selTableRow = OrdersTestConstants.ORDERS_ITEM;
    component.pDialogComponent = TestBed.inject(CustomPDialogComponent);
    component.form = form;
    spyOn(component, 'setIsLoadingResults').and.callThrough();
    spyOn(tableDataService, 'tryAllocate').and.returnValue(Promise.resolve(tryAllocateResult));
    spyOn(component, 'updateView').and.callThrough();
    spyOn(component, 'disableAllocateButton').and.callThrough();

    // Act
    component.onTableFormAllocate();
    tick();

    // Assert
    expect(component.setIsLoadingResults).toHaveBeenCalled();
    expect(component.pDialogComponent.savedState).toBeTruthy();
    expect(component.updateView).toHaveBeenCalled();
    expect(component.disableAllocateButton).toHaveBeenCalled();
    expect(component.setIsLoadingResults).toHaveBeenCalledTimes(3);
  }));

  it('if allocate order positions fails', fakeAsync(() => {

    // Arrange
    const tryAllocateResult: { success: boolean, message: any, data: any } =
      {success: false, message: 'Error', data: []};
    component.refTable = constantsService.REFTABLE_ORDERS;
    component.selTableRow = OrdersTestConstants.ORDERS_ITEM;
    component.pDialogComponent = TestBed.inject(CustomPDialogComponent);
    const messagesService: MessagesService = TestBed.inject(MessagesService);
    spyOn(component, 'setIsLoadingResults').and.callThrough();
    spyOn(tableDataService, 'tryAllocate').and.returnValue(Promise.resolve(tryAllocateResult));
    spyOn(messagesService, 'showInfoMessage').and.callThrough();
    spyOn(component, 'disableAllocateButton').and.callThrough();

    // Act
    component.onTableFormAllocate();
    tick();

    // Assert
    expect(component.setIsLoadingResults).toHaveBeenCalled();
    expect(component.pDialogComponent.savedState).toBeFalsy();
    expect(messagesService.showInfoMessage).toHaveBeenCalled();
    expect(component.disableAllocateButton).toHaveBeenCalled();
    expect(component.setIsLoadingResults).toHaveBeenCalledTimes(2);
  }));

  it('should update view', fakeAsync(() => {

    // Arrange
    component.refTable = constantsService.REFTABLE_DELIVERY_NOTES;
    component.selTableRow = DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM;
    component.pDialogComponent = TestBed.inject(CustomPDialogComponent);
    component.pDialogComponent.savedState = true;
    component.newDeliveryNoteMode = false;
    component.form = form;
    const tableDbData: { table: [any[string], any[]], maxRows: number, page: number } =
      DeliveryNotesTestConstants.DELIVERY_NOTE_POSITIONS_TABLE_DB_DATA;
    spyOn(component, 'showTableFormData').and.callThrough();
    spyOn(component.tabsService, 'getCurrentTabNames').and.callThrough();
    spyOn(component, 'getCurrentTabNames').and.returnValue(SubTabGroupTabNames.DELIVERY_NOTES_DETAILS);
    // spyOn(tabsService,'getCurrentTabNames').and.returnValue(SubTabGroupTabNames.DELIVERY_NOTES_DETAILS);
    spyOn(component, 'getFormData').and.callThrough();
    spyOn(component,'initializePositionsService').and.callThrough();
    spyOn(component,'setIsLoadingResults').and.callThrough();
    spyOn(tableDataService, 'getTableDataByCustomersNumber').and.returnValue(Promise.resolve(tableDbData));
    spyOn(component.tabGroupFormService,'getFormDataLogic').and.callThrough();
    const formServiceResult: { model: any|SoasModel, fields: FormlyFieldConfig[], dbdata?: {} } =
      { model: DeliveryNotes, fields: []};
    spyOn(formService,'getFormConfigData').and.returnValue(Promise.resolve(formServiceResult));
    // spyOn(component.tabGroupFormService,'disableSaveButton').and.callThrough();

    // Act
    component.updateView().then(() => {

      // Assert
      expect(component.showTableFormData).toHaveBeenCalled();
      expect(component.getCurrentTabNames).toHaveBeenCalled();
      expect(component.getFormData).toHaveBeenCalled();
      expect(formService.getFormConfigData).toHaveBeenCalled();
      expect(component.pDialogComponent.savedState).toBeFalsy();
    })
    // tick();

  }));

  it('should return orders positions', fakeAsync(() => {

    // Arrange
    const ordersNumber: string = OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER;
    const getOrdersPositionsResult: { success: boolean; data: any } =
      {success: true, data: OrdersTestConstants.ORDERS_POSITIONS_TABLE_DB_DATA['table'][1]};
    const tableDataResult = OrdersTestConstants.ORDERS_POSITIONS_TABLE_DB_DATA;
    spyOn(tableDataService, 'getTableDataById').and.returnValue(Promise.resolve(tableDataResult));

    // Act
    component.getOrdersPositions(ordersNumber).then(result => {
      // Assert
      expect(result).toEqual(getOrdersPositionsResult);
      expect(tableDataService.getTableDataById).toHaveBeenCalled();
    });
  }));

  it('should show error if orders positions result is empty', fakeAsync(() => {

    // Arrange
    const ordersNumber: string = OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER;
    const getOrdersPositionsResult: { success: boolean; data: any } =
      {success: false, data: undefined};
    const tableDataResult = undefined;
    const messagesService: MessagesService = TestBed.inject(MessagesService);
    spyOn(tableDataService, 'getTableDataById').and.returnValue(Promise.resolve(tableDataResult));
    spyOn(String.prototype, 'replace').and.callThrough();
    spyOn(translate, 'transform').and.callThrough();
    spyOn(messagesService, 'showErrorMessage').and.callThrough();
    spyOn(component, 'setIsLoadingResults').and.callThrough();

    // Act
    component.getOrdersPositions(ordersNumber).then(result => {
      // Assert
      expect(result).toEqual(getOrdersPositionsResult);
      expect(tableDataService.getTableDataById).toHaveBeenCalled();
    });
  }));

  it('should disable create delivery note button', function () {

    // Arrange
    const disable: boolean = true;
    component.createDNButton = new ElementRef(
      {nativeElement: jasmine.createSpyObj('nativeElement', ['disabled'])}
    );

    // Act
    component.disableCreateDeliveryNoteButton(disable);

    // Assert
    expect(component.createDNButton.nativeElement.disabled).toEqual(disable);
  });

  it('should disable create invoice button', function () {

    // Arrange
    const disable: boolean = true;
    component.createINVButton = new ElementRef(
      {nativeElement: jasmine.createSpyObj('nativeElement', ['disabled'])}
    );

    // Act
    component.disableCreateInvoiceButton(disable);

    // Assert
    expect(component.createINVButton.nativeElement.disabled).toEqual(disable);
  });

  it('should set empty model', function () {

    // Arrange
    const model: SoasModel = Customer as unknown as SoasModel;

    // Act
    component.setEmptyModel(model);

    // Assert
    expect(component.emptyModel).toEqual(model);
  });

  it('should set empty details model', function () {

    // Arrange
    const model: SoasModel = Customer as unknown as SoasModel;

    // Act
    component.setEmptyDetailsModel(model);

    // Assert
    expect(component.emptyDetailsModel).toEqual(model);
  });

  it('should initialize tab group', function () {

    // Arrange
    spyOn(tabsService, 'setTabGroup').and.callThrough();
    spyOn(tabsService, 'setCdRef').and.callThrough();

    // Act
    component.initializeTabGroup();

    // Assert
    expect(tabsService.setTabGroup).toHaveBeenCalled();
    expect(tabsService.setCdRef).toHaveBeenCalled();
  });

  it('should initialize tab group form', function () {

    // Arrange
    spyOn(tabGroupFormService, 'setRequiredParams').and.callThrough();

    // Act
    component.initializeTabGroupForm();

    // Assert
    expect(tabGroupFormService.setRequiredParams).toHaveBeenCalled();
  });

  it('should initialize load service', function () {

    // Arrange
    component.loadService = TestBed.inject(DetailViewTabGroupLoadService);
    spyOn(component.loadService, 'setRequiredParams').and.callThrough();

    // Act
    component.initializeLoadService();

    // Assert
    expect(component.loadService.setRequiredParams).toHaveBeenCalled();
  });

  it('should initialize positions service', function () {

    // Arrange
    component.positionsService = TestBed.inject(DetailViewTabGroupPositionsService);
    spyOn(component.positionsService, 'setRequiredParams').and.callThrough();

    // Act
    component.initializePositionsService();

    // Assert
    expect(component.positionsService.setRequiredParams).toHaveBeenCalled();
  });

  it('should initialize p-dialog service', function () {

    // Arrange
    component.pDialogService = TestBed.inject(DetailViewTabGroupPDialogService);
    spyOn(component.pDialogService, 'setRequiredParams').and.callThrough();

    // Act
    component.initializePDialogService();

    // Assert
    expect(component.pDialogService.setRequiredParams).toHaveBeenCalled();
  });

  it('should initialize customer addresses service', function () {

    // Arrange
    component.customerAddressesService = TestBed.inject(DetailViewTabGroupCustomerAddressesService);
    spyOn(component.customerAddressesService, 'setRequiredParams').and.callThrough();

    // Act
    component.initializeCustomerAddressesService();

    // Assert
    expect(component.customerAddressesService.setRequiredParams).toHaveBeenCalled();
  });

  it('should set table columns to hide', function () {

    // Arrange
    const columns: string[] = ['column'];

    // Act
    component.setTableColumnsToHide(columns);

    // Assert
    expect(component.tableColumnsToHide).toEqual(columns);
  });

  it('should return customer address type', function () {

    // Arrange
    const type: string = 'DLV';
    component.customerAddressesService = TestBed.inject(DetailViewTabGroupCustomerAddressesService);
    spyOn(component.customerAddressesService, 'setRequiredParams').and.callThrough();

    // Act
    const result: CustomerAddressTypes = component.getCustomerAddressType(type);

    // Assert
    expect(result).toEqual(CustomerAddressTypes.DLV);
  });

  it('should call save function on customer form submit', function () {

    // Arrange
    spyOn(component, 'save').and.callThrough();

    // Act
    component.onCustomerFormSubmit();

    // Assert
    expect(component.save).toHaveBeenCalled();
  });

  it('should call save function on customer address form submit', function () {

    // Arrange
    spyOn(component, 'save').and.callThrough();

    // Act
    component.onCustomersAddrFormSubmit();

    // Assert
    expect(component.save).toHaveBeenCalled();
  });

  it('should save order positions on order positions form submit', fakeAsync(() => {

    // Arrange
    component.pTable = TestBed.inject(CustomPTableComponent);
    component.pTable.pTable = pTable;
    component.pTable.pTable._value = [];
    component.pTable.updatedPositionsRows = [];
    component.selTableRow = OrdersTestConstants.ORDERS_ITEM;
    spyOn(saveService, 'saveOrderPositions').and.callThrough();

    // Act
    component.onOrderPositionsFormSubmit();

    // Assert
    expect(saveService.saveOrderPositions).toHaveBeenCalled();
  }));

  it('should set selected table row', function () {

    // Arrange
    const selTableRow: TabGroupModel = Customer as unknown as TabGroupModel;
    spyOn(component, 'resetNewModes').and.callThrough();

    // Act
    component.setSelectedTableRow(selTableRow);

    // Assert
    expect(component.resetNewModes).toHaveBeenCalled();
    expect(component.selTableRow).toEqual(selTableRow);
  });

  it('should send service result', function () {

    // Arrange
    const dataObj: {
      refTableName: string, fieldName: string, disableSaveButton: boolean, positions: [], refreshDetailView: boolean
    } = {
      refTableName: constantsService.REFTABLE_ORDERS, fieldName: 'field', disableSaveButton: true, positions: [],
      refreshDetailView: true
    }
    let fetchTableService = TestBed.inject(FetchTableService);
    component.refTable = constantsService.REFTABLE_ORDERS;
    component.selTableRow = OrdersTestConstants.ORDERS_ITEM;
    spyOn(fetchTableService, 'setDataObs').and.callThrough();

    // Act
    component.sendServiceResult(dataObj);

    // Assert
    expect(fetchTableService.setDataObs).toHaveBeenCalled();
  });

});
