import {TestBed} from '@angular/core/testing';

import { DetailViewTabGroupFormService } from './detail-view-tab-group-form.service';
import {TestingModule} from "../../testing/testing.module";
import {
  ConstantsService,
  ORDER_POSITIONS_COLS,
  ORDER_POSITIONS_DIALOG_COLS,
  SoasModel, SubTabGroupTabNames
} from "../../_services/constants.service";
import {DynamicFormComponent} from "../../dynamic-view/dynamic-form/dynamic-form.component";
import {DetailViewTabGroupPositionsService} from "./detail-view-tab-group-positions.service";
import {DetailViewTabGroupTabsService} from "./detail-view-tab-group-tabs.service";
import {DetailViewTabGroupLoadService} from "./detail-view-tab-group-load.service";
import {DetailViewTabGroupPDialogService} from "./detail-view-tab-group-p-dialog.service";
import {DetailViewTabGroupCustomerAddressesService} from "./detail-view-tab-group-customer-addresses.service";
import {Orders} from "../../models/orders";
import {OrdersTestConstants} from "../../../assets/test-constants/orders";
import {ElementRef} from "@angular/core";
import {CurrenciesTestConstants} from "../../../assets/test-constants/currencies";
import {FormOptionsINV, FormOptionsNVS, FormOptionsNVs} from "../../interfaces/form-options";
import {StatesTestConstants} from "../../../assets/test-constants/states";
import {CustomPTableComponent} from "../custom/custom-p-table/custom-p-table.component";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {MessageService} from "primeng/api";
import {CustomersTestConstants} from "../../../assets/test-constants/customers";
import {FormService} from "../../_services/form.service";
import {OptionsService} from "../../_services/options.service";
import {FormBuilder, Validators} from "@angular/forms";

describe('DetailViewTabGroupFormService', () => {
  let service: DetailViewTabGroupFormService;
  let constantsService: ConstantsService;
  let positionsService: DetailViewTabGroupPositionsService;
  let tabsService: DetailViewTabGroupTabsService;
  let loadService: DetailViewTabGroupLoadService;
  let pDialogService: DetailViewTabGroupPDialogService;
  let tabGroupFormService: DetailViewTabGroupFormService;
  let customerAddressesService: DetailViewTabGroupCustomerAddressesService;
  let pTable: CustomPTableComponent;
  let translate: TranslateItPipe;
  let formService: FormService;
  let form: DynamicFormComponent;
  let optionsService: OptionsService;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [TranslateItPipe, ConstantsService, DynamicFormComponent, DetailViewTabGroupPositionsService,
        DetailViewTabGroupTabsService, DetailViewTabGroupFormService, DetailViewTabGroupLoadService,
        DetailViewTabGroupPDialogService, DetailViewTabGroupCustomerAddressesService, CustomPTableComponent,
        MessageService, FormService, OptionsService, FormBuilder]
    });
    service = TestBed.inject(DetailViewTabGroupFormService);
    constantsService = TestBed.inject(ConstantsService);
    positionsService = TestBed.inject(DetailViewTabGroupPositionsService);
    tabsService = TestBed.inject(DetailViewTabGroupTabsService);
    loadService = TestBed.inject(DetailViewTabGroupLoadService);
    pDialogService = TestBed.inject(DetailViewTabGroupPDialogService);
    tabGroupFormService = TestBed.inject(DetailViewTabGroupFormService);
    customerAddressesService = TestBed.inject(DetailViewTabGroupCustomerAddressesService);
    pTable = TestBed.inject(CustomPTableComponent);
    translate = TestBed.inject(TranslateItPipe);
    formService = TestBed.inject(FormService);
    form = TestBed.inject(DynamicFormComponent);
    optionsService = TestBed.inject(OptionsService);
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set required params', async function() {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS;
    const refTableCustomersAddresses: string = constantsService.REFTABLE_CUSTOMER_ADDRESS_DLV;
    const selTableRow: Orders = OrdersTestConstants.ORDERS_ITEM;
    const formDataAvailableFlag: boolean = true;
    const formDisabledFlag: boolean = false;
    const orderReleaseFlag: boolean = false;
    const deliveryNoteReleaseFlag: boolean = false;
    const invoiceReleaseFlag: boolean = false;
    const orderPayedFlag: boolean = true;

    const emptyModel: SoasModel = OrdersTestConstants.ORDERS_ITEM;
    const emptyDetailsModel: SoasModel =  OrdersTestConstants.ORDERS_ITEM;
    const saveButton: ElementRef = new ElementRef(service.saveButton);
    const allocateButton: ElementRef = new ElementRef(service.allocateButton);
    const dlgSaveButton: ElementRef = new ElementRef(service.dlgSaveButton);
    const fullEditMode: boolean = true;

    const currencies: FormOptionsNVs[] = CurrenciesTestConstants.CURRENCIES_SELECT.currencies;
    const updatedOrderPositionsRows: string[] = ['row'];
    const orderAllocatedFlag: boolean = false;
    // const pTable: CustomPTableComponent;
    const ordPosStates: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;
    const countriesWithId: FormOptionsINV[] = CurrenciesTestConstants.CURRENCIES_SELECT.currenciesWithId;

    const selTableRowTaxation: number = 10;
    const newItemMode: boolean = false;
    const newCustomerAddrDLVMode: boolean = false;
    const newCustomerMode: boolean = false;
    const newCustomerAddrINVMode: boolean = false;
    const newOrderMode: boolean = false;
    const newOrderPositionMode: boolean = false;
    // translatePipe: TranslateItPipe,
    const cols: any[] = ORDER_POSITIONS_COLS;
    const dialogCols: any[] = ORDER_POSITIONS_DIALOG_COLS;
    const displayedColumns: string[] = ['cols'];
    const ordDlvInvStates: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;
    const dlvPosStates: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;
    const invPosStates: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;

    // Act
    await service.setRequiredParams(refTable, refTableCustomersAddresses, form, selTableRow, positionsService,
      tabsService, loadService, pDialogService, tabGroupFormService, customerAddressesService, formDataAvailableFlag,
      formDisabledFlag, orderReleaseFlag, deliveryNoteReleaseFlag, invoiceReleaseFlag, orderPayedFlag, emptyModel,
      emptyDetailsModel, saveButton, allocateButton, dlgSaveButton, fullEditMode, currencies, updatedOrderPositionsRows,
      orderAllocatedFlag, pTable, ordPosStates, dlvPosStates, invPosStates, countriesWithId, selTableRowTaxation,
      newItemMode, translate, cols, dialogCols, displayedColumns, ordDlvInvStates);

    // Assert
    expect(service.refTable).toEqual(refTable);
    expect(service.tabsService).toEqual(tabsService);
    expect(service.positionsService).toEqual(positionsService);
    expect(service.selTableRow).toEqual(selTableRow);
    expect(service.newItemMode).toEqual(newItemMode);

  });

  it('should set form data logic', async function() {

    // Arrange
    const formRefTable: undefined | string = constantsService.REFTABLE_CUSTOMER_ADDRESS_DLV;
    const customerColumn: string = 'column';
    const customerNumber: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_NUMBER;
    const secondColumn: string = 'secondColumn'
    const secondId: string = '1';
    const createNewItemMode: boolean = false;
    const subTabGroupName: SubTabGroupTabNames = SubTabGroupTabNames.ORDER_DETAILS;
    const existsTableData: boolean = true;
    const getFormConfigDataResult: { model: any, fields: any } =
      {model: OrdersTestConstants.ORDERS_MODEL, fields: []};
    service.form = form;
    spyOn(service,'resetReleaseFlags').and.callThrough();
    spyOn(formService, 'getFormConfigData').and.returnValue(Promise.resolve(getFormConfigDataResult));

    // Act
    service.getFormDataLogic(formRefTable, customerColumn, customerNumber, secondColumn, secondId,
      createNewItemMode, subTabGroupName, existsTableData);

    // Assert
    expect(service.resetReleaseFlags).toHaveBeenCalled();
    expect(formService.getFormConfigData).toHaveBeenCalled();
  });

  it('should set form options value changes', async function() {

    // Arrange
    service.form = form;
    spyOn(service, 'addressCountryNameChange').and.callThrough();

    // Act
    service.setOptionsChangesForCustomer();

    // Assert
    expect(service.addressCountryNameChange).toHaveBeenCalled();
  });

  it('should change tax code', async function() {

    // Arrange
    const country: string =  constantsService.DEFAULT_COUNTRY_NAME;
    service.form = form;
    service.form.form.addControl('TAXCODE', formBuilder.control('', [Validators.required]))
    spyOn(optionsService, 'getTaxationByCountry').and.callThrough();

    // Act
    service.changeTaxCode(country);

    // Assert
    expect(optionsService.getTaxationByCountry).toHaveBeenCalled();
  });

  it('should set form address iso code by country', async function() {

    // Arrange
    const countryResult: string = 'DE';
    const country: string = constantsService.DEFAULT_COUNTRY_NAME;
    const countriesWithId: FormOptionsINV[] = CurrenciesTestConstants.CURRENCIES_SELECT.currenciesWithId;
    service.form = form;
    service.form.form.addControl('ADDRESS_ISO_CODE', formBuilder.control('', [Validators.required]))
    spyOn(optionsService, 'getTaxationByCountry').and.callThrough();

    // Act
    service.setAddressIsoCodeByCountry(country, countriesWithId);

    // Assert
    expect(service.form.form.controls['ADDRESS_ISO_CODE'].value).toEqual(countryResult);
  });

  it('should set form address iso code by country', async function () {

    // Arrange
    const language: string = constantsService.DEFAULT_LANGUAGE_ISO_3;
    const languageResult: string = '';
    service.form = form;
    service.form.form.addControl('LANGUAGE', formBuilder.control('', [Validators.required]));
    spyOn(service, 'changePaymentTermId').and.callThrough();

    // Act
    service.onCustomersLanguageChange(language);

    // Assert
    expect(service.changePaymentTermId).toHaveBeenCalled();
    expect(service.form.form.controls['LANGUAGE'].value).toEqual(languageResult);
  });

  it('should change payment term id', async function () {

    // Arrange
    const language: string = constantsService.DEFAULT_LANGUAGE_ISO_3;
    service.form = form;
    service.form.form.addControl('PAYMENT_TERM_ID', formBuilder.control('', [Validators.required]));
    spyOn(optionsService, 'getPaymentTermByLanguage').and.callThrough();

    // Act
    service.changePaymentTermId(language);

    // Assert
    expect(optionsService.getPaymentTermByLanguage).toHaveBeenCalled();
  });

  it('should default payment id', async function () {

    // Arrange
    const id: string = constantsService.DEFAULT_B2C_PAYMENT_TERM_ID;

    // Act
    service.setDefaultPaymentTermId(id);

    // Assert
    expect(service.defaultPaymentTermId).toEqual(id);
  });

  it('should default payment id', async function () {

    // Arrange
    const disable: boolean = true;
    service.saveButton = new ElementRef(
      {nativeElement: jasmine.createSpyObj('nativeElement', ['disabled'])}
    );
    service.dlgSaveButton = new ElementRef(
      {nativeElement: jasmine.createSpyObj('nativeElement', ['disabled'])}
    );

    // Act
    service.disableSaveButton(disable);

    // Assert
    expect(service.saveButton.nativeElement.disabled).toEqual(disable);
    expect(service.dlgSaveButton.nativeElement.disabled).toEqual(disable);
  });

  // valueChange should be tested
  // fit('should change address country name', fakeAsync(() => {
  //
  //   // Arrange
  //   const values: string[] = ['Deutschland'];
  //   spyOn(service, 'changeTaxation').and.callThrough();
  //
  //   // Act
  //   service.addressCountryNameChange();
  //   // tick();
  //
  //   // Assert
  //   // expect(service.form.form.get('ADDRESS_CRYNAME').value).toEqual(values);
  //   // expect(optionsService.getTaxationByCountry).toHaveBeenCalled();
  //   expect(service.changeTaxation).toHaveBeenCalled();
  //
  // }));

});
