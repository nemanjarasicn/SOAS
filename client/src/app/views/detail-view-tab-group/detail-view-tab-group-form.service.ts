import {ElementRef, Injectable, ViewChild} from '@angular/core';
import {ConstantsService, SoasModel, SubTabGroupTabNames, ViewQueryTypes} from '../../_services/constants.service';
import {DynamicFormComponent} from '../../dynamic-view/dynamic-form/dynamic-form.component';
import {Customer} from '../../models/customer';
import {Orders} from '../../models/orders';
import {DeliveryNotes} from '../../models/delivery-notes';
import {Invoices} from '../../models/invoices';
import {DetailViewTabGroupPositionsService} from './detail-view-tab-group-positions.service';
import {FormService} from '../../_services/form.service';
import {DetailViewTabGroupTabsService} from './detail-view-tab-group-tabs.service';
import {FormControl} from '@angular/forms';
import {CustomPTableComponent} from '../custom/custom-p-table/custom-p-table.component';
import {DetailViewTabGroupLoadService} from './detail-view-tab-group-load.service';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {DetailViewTabGroupPDialogService} from './detail-view-tab-group-p-dialog.service';
import {DetailViewTabGroupCustomerAddressesService} from './detail-view-tab-group-customer-addresses.service';
import {OptionsService} from '../../_services/options.service';
import {FormOptionsINV, FormOptionsNVn, FormOptionsNVs, FormOptionsNVS} from '../../interfaces/form-options';
import {MessagesService} from "../../_services/messages.service";
import {MessageService} from "primeng/api";
import {TableDataService} from "../../_services/table-data.service";

@Injectable({
  providedIn: 'root'
})

/**
 * DetailViewTabGroupFormService - a service for detail view tab group component view to manage form (details)
 *
 * Used by: DetailViewTabGroupComponent
 */
export class DetailViewTabGroupFormService {

  refTable: string;
  refTableCustomersAddresses: string;

  // form view for details (customer details, order details, delivery notes details, invoices details)
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  // selected table row item
  selTableRow: undefined | Customer | Orders | DeliveryNotes | Invoices;
  // selected table row item taxation value (required for customers, orders)
  selTableRowTaxation: number;

  positionsService: DetailViewTabGroupPositionsService;
  tabsService: DetailViewTabGroupTabsService;
  tabGroupFormService: DetailViewTabGroupFormService;
  loadService: DetailViewTabGroupLoadService;
  pDialogService: DetailViewTabGroupPDialogService;
  customerAddressesService: DetailViewTabGroupCustomerAddressesService;

  // flag to determine if form data is available and loaded,
  // so buttons (create delivery note, create invoice) can be enabled
  formDataAvailableFlag: boolean;
  // flag to disable form fields or positions buttons
  formDisabledFlag: boolean;

  orderReleaseFlag: boolean;
  deliveryNoteReleaseFlag: boolean;
  invoiceReleaseFlag: boolean;
  orderPayedFlag: boolean;
  orderAllocatedFlag: boolean; // is order fully allocated (all positions have state 3 - STATE_POS_COMPLETELY_ALLOCATED)

  fullEditMode: boolean = false; // Flag to manage editing readonly fields like ASSIGN_QTY at order positions

  newItemMode: boolean;
  // newCustomerAddrDLVMode: boolean;
  // newCustomerMode: boolean;
  // newCustomerAddrINVMode: boolean;
  // newOrderMode: boolean;
  // newOrderPositionMode: boolean;

  // empty (main) model for new item mode
  emptyModel: SoasModel;
  // empty details model for new item mode, e.g. customer address
  emptyDetailsModel: SoasModel;

  // default form settings
  defaultPaymentCondition: string;
  defaultPaymentTermId: string;

  currencies: FormOptionsNVs[];
  countriesWithId: FormOptionsINV[];
  updatedOrderPositionsRows: string[];

  ordDlvInvStates: FormOptionsNVn[]; // = [{name: 'PLEASE_SELECT', value: undefined}]

  @ViewChild('saveButton', {static: false}) saveButton: ElementRef;
  @ViewChild('allocateButton', {static: false}) allocateButton: ElementRef;
  @ViewChild('dlgSaveButton', {static: false}) dlgSaveButton: ElementRef;

  // p-table view for positions (order-, delivery notes-, invoices-positions)
  @ViewChild(CustomPTableComponent) pTable !: CustomPTableComponent;

  ordPosStates: FormOptionsNVS[];
  dlvPosStates: FormOptionsNVS[];
  invPosStates: FormOptionsNVS[];
  translatePipe: TranslateItPipe;
  messageService: MessageService;

  displayedColumns: string[] = [];

  constructor(private CONSTANTS: ConstantsService,
              private optionsService: OptionsService,
              private formService: FormService,
              private messagesService: MessagesService,
              private tableDataService: TableDataService) {
  }

  setRequiredParams(refTable: string, refTableCustomersAddresses: string, form: DynamicFormComponent, selTableRow: any,
                    positionsService: DetailViewTabGroupPositionsService, tabsService: DetailViewTabGroupTabsService,
                    loadService: DetailViewTabGroupLoadService, pDialogService: DetailViewTabGroupPDialogService,
                    tabGroupFormService: DetailViewTabGroupFormService,
                    customerAddressesService: DetailViewTabGroupCustomerAddressesService,
                    formDataAvailableFlag: boolean, formDisabledFlag: boolean, orderReleaseFlag: boolean,
                    deliveryNoteReleaseFlag: boolean, invoiceReleaseFlag: boolean, orderPayedFlag: boolean,
                    emptyModel: SoasModel, emptyDetailsModel: SoasModel, saveButton: ElementRef,
                    allocateButton: ElementRef, dlgSaveButton: ElementRef, fullEditMode: boolean,
                    currencies: FormOptionsNVs[],
                    updatedOrderPositionsRows: string[], orderAllocatedFlag: boolean,
                    pTable: CustomPTableComponent,
                    ordPosStates: FormOptionsNVS[], dlvPosStates: FormOptionsNVS[], invPosStates: FormOptionsNVS[],
                    countriesWithId: FormOptionsINV[],
                    selTableRowTaxation: number, newItemMode: boolean, translatePipe: TranslateItPipe, cols: any[], dialogCols: any[],
                    displayedColumns: string[], ordDlvInvStates: FormOptionsNVn[]
  ) {
    this.setRefTable(refTable);
    this.setRefTableCustomersAddresses(refTableCustomersAddresses);
    this.setForm(form);
    this.setSelTableRow(selTableRow);
    this.setPositionsService(positionsService);
    this.setTabsService(tabsService);
    this.setLoadService(loadService);
    this.setPDialogService(pDialogService);
    this.setTabGroupFormService(tabGroupFormService);
    this.setCustomerAddressesService(customerAddressesService);
    this.setFormDataAvailableFlag(formDataAvailableFlag);
    this.setFormDisabledFlag(formDisabledFlag);
    this.setOrderReleaseFlag(orderReleaseFlag);
    this.setDeliveryNoteReleaseFlag(deliveryNoteReleaseFlag);
    this.setInvoiceReleaseFlag(invoiceReleaseFlag);
    this.setOrderPayedFlag(orderPayedFlag);
    this.setEmptyModel(emptyModel);
    this.setEmptyDetailsModel(emptyDetailsModel);
    this.setSaveButton(saveButton)
    this.setAllocateButton(allocateButton);
    this.setDlgSaveButton(dlgSaveButton);
    this.setFullEditMode(fullEditMode);
    this.setCurrencies(currencies);
    this.setUpdatedOrderPositionsRows(updatedOrderPositionsRows);
    this.setOrderAllocatedFlag(orderAllocatedFlag);
    this.setPTable(pTable);
    this.setOrdPosStates(ordPosStates);
    this.setDlvPosStates(dlvPosStates);
    this.setInvPosStates(invPosStates)
    this.setCountriesWithId(countriesWithId);
    this.setSelTableRowTaxation(selTableRowTaxation);

    this.setNewItemMode(newItemMode);
    // this.setNewCustomerAddrDLVMode(newCustomerAddrDLVMode);
    // this.setNewCustomerMode(newCustomerMode);
    // this.setNewCustomerAddrINVMode(newCustomerAddrINVMode);
    // this.setNewOrderMode(newOrderMode);
    // this.setNewOrderPositionMode(newOrderPositionMode);

    this.setTranslatePipe(translatePipe);
    this.positionsService.setCols(cols);
    this.pDialogService.setDialogCols(dialogCols);
    this.setDisplayedColumns(displayedColumns);
    this.setOrdDlvInvStates(ordDlvInvStates);
  }

  setRefTable(refTable: string) {
    this.refTable = refTable;
  }

  setRefTableCustomersAddresses(refTable: string) {
    this.refTableCustomersAddresses = refTable;
  }

  setForm(form: DynamicFormComponent) {
    this.form = form;
  }

  setSelTableRow(selRow: any) {
    this.selTableRow = selRow;
  }

  setPositionsService(service: DetailViewTabGroupPositionsService) {
    this.positionsService = service;
  }

  setTabsService(service: DetailViewTabGroupTabsService) {
    this.tabsService = service;
  }

  setTabGroupFormService(service: DetailViewTabGroupFormService) {
    this.tabGroupFormService = service;
  }

  setPDialogService(service: DetailViewTabGroupPDialogService) {
    this.pDialogService = service;
  }

  setCustomerAddressesService(service: DetailViewTabGroupCustomerAddressesService) {
    this.customerAddressesService = service;
  }

  setFormDataAvailableFlag(flag: boolean) {
    this.formDataAvailableFlag = flag;
  }

  setFormDisabledFlag(flag: boolean) {
    this.formDisabledFlag = flag;
  }

  setOrderReleaseFlag(flag: boolean) {
    this.orderReleaseFlag = flag;
  }

  setDeliveryNoteReleaseFlag(flag: boolean) {
    this.deliveryNoteReleaseFlag = flag;
  }

  setInvoiceReleaseFlag(flag: boolean) {
    this.invoiceReleaseFlag = flag;
  }

  setOrderPayedFlag(flag: boolean) {
    this.orderPayedFlag = flag;
  }

  setEmptyModel(model: SoasModel) {
    this.emptyModel = model;
  }

  setEmptyDetailsModel(model: SoasModel) {
    this.emptyDetailsModel = model;
  }

  setSaveButton(button: ElementRef) {
    this.saveButton = button;
  }

  setAllocateButton(button: ElementRef) {
    this.allocateButton = button;
  }

  setDlgSaveButton(button: ElementRef) {
    this.dlgSaveButton = button;
  }

  setFullEditMode(mode: boolean) {
    this.fullEditMode = mode;
  }

  setCurrencies(cr: FormOptionsNVs[]) {
    this.currencies = cr;
  }

  setUpdatedOrderPositionsRows(rows: string[]) {
    this.updatedOrderPositionsRows = rows;
  }

  setOrderAllocatedFlag(flag: boolean) {
    this.orderAllocatedFlag = flag;
  }

  setPTable(pTable: CustomPTableComponent) {
    this.pTable = pTable;
  }

  setOrdPosStates(states: FormOptionsNVS[]) {
    this.ordPosStates = states;
  }

  setCountriesWithId(countriesWithId: FormOptionsINV[]) {
    this.countriesWithId = countriesWithId;
  }

  setSelTableRowTaxation(taxation: number) {
    this.selTableRowTaxation = taxation;
  }

  setLoadService(service: DetailViewTabGroupLoadService) {
    this.loadService = service;
  }

  setNewItemMode(mode: boolean) {
    this.newItemMode = mode;
  }
  //
  // setNewCustomerAddrDLVMode(mode: boolean) {
  //   this.newCustomerAddrDLVMode = mode;
  // }
  //
  // setNewCustomerMode(mode: boolean) {
  //   this.newCustomerMode = mode;
  // }
  //
  // setNewCustomerAddrINVMode(mode: boolean) {
  //   this.newCustomerAddrINVMode = mode;
  // }
  //
  // setNewOrderMode(mode: boolean) {
  //   this.newOrderMode = mode;
  // }
  //
  // setNewOrderPositionMode(mode: boolean) {
  //   this.newOrderPositionMode = mode;
  // }

  setTranslatePipe(pipe: TranslateItPipe) {
    this.translatePipe = pipe;
    this.optionsService.setTranslatePipe(pipe);
    this.formService.setTranslatePipe(pipe);
    this.messagesService.setTranslatePipe(this.translatePipe);
  }

  setMessageService(message: MessageService) {
    this.messageService = message;
  }

  setDisplayedColumns(columns: string[]) {
    this.displayedColumns = columns;
  }

  setOrdDlvInvStates(states: FormOptionsNVn[]) {
    this.ordDlvInvStates = states;
  }

  setDlvPosStates(states: FormOptionsNVS[]) {
    this.dlvPosStates = states;
  }

  setInvPosStates(states: FormOptionsNVS[]) {
    this.invPosStates = states;
  }

  /**
   * Get form or table data by given customer number:
   * If view contains only form (orders/customers details), then load form (A).
   * If view contains table (orders positions) or table + form (customers addresses table + form), then load
   * addresses/positions table (B).
   *
   * A. load formly form template
   * or
   * B. load addresses/positions table
   *
   * @param formRefTable
   * @param customerColumn
   * @param customerNumber
   * @param secondColumn
   * @param secondId
   * @param createNewItemMode
   * @param subTabGroupName
   * @param existsTableData - flag, if table data (here customer addresses or positions) are existing
   */
  public async getFormDataLogic(formRefTable: undefined | string, customerColumn: string,
                                customerNumber: string, secondColumn: string, secondId: string,
                                createNewItemMode: boolean, subTabGroupName: SubTabGroupTabNames,
                                existsTableData: boolean): Promise<void> {
    // do not change refTable here, because it is right!
    // this.refTable = formRefTable;
    this.resetReleaseFlags();
    if (this.form) {
      this.form.resetOptions();
      this.form.resetForm();
    } else {
      console.log('form is not defined!');
    }
    // formRefTable = this.refTableCustomersAddresses;
    // determine, if form fields should be disabled
    this.formDisabledFlag = <boolean>(createNewItemMode ? false : !!(this.selTableRow &&
      (this.selTableRow['ORDERS_STATE'] === this.CONSTANTS.ORDER_STATES_COMPLETED || this.selTableRow['RELEASE'])));
    // Workaround for loading customer addresses form data
    const __ret = this.setParamsForCustomerAddresses(existsTableData, secondColumn, secondId, formRefTable);
    secondColumn = __ret.secondColumn;
    secondId = __ret.secondId;
    if (this.isDetailsView(subTabGroupName)) {
      if (this.form) {
        // A. load formly form template of current referral table
        let result: { model: any, fields: any } =
          await this.formService.getFormConfigData(formRefTable, createNewItemMode, customerColumn,
            customerNumber, secondColumn, secondId, undefined, this.formDisabledFlag);
        if (createNewItemMode) {
          /*
          // if new item mode, set model with empty one (set in component e.g. custbtwoc)
          // make a copy from model by JSON parse and stringify,
          // to prevent deleting of empty model data at form model reset
          // result.model - form template is in raw form, loaded from db
          // this.emptyDetailsModel or this.emptyModel - form template is modified with default values from constants
          result.model = ((this.refTableCustomersAddresses === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV) ||
            (this.refTableCustomersAddresses === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV)) ?
            JSON.parse(JSON.stringify(this.emptyDetailsModel)) : // result.model : //
            JSON.parse(JSON.stringify(this.emptyModel));
          */
        }
        this.form.setModel(result.model);
        this.form.setFields(result.fields);
        if (result.model) {
          // set flags for order released / payed flags...
          this.setReleaseFlagsByModel(result.model);
        } else {
          console.log('result.model is empty!');
        }
        this.formDataAvailableFlag = createNewItemMode ? true :
          <boolean>(result.model && Object.keys(result.model).length > 0);
        this.setFormValueChanges();
      } else {
        console.log(new Error('form is not defined...'));
      }
    } else {
      this.initPositions();
    }
    // set flag to disable buttons (create delivery note and buttons at positions)
    if (this.orderReleaseFlag || this.deliveryNoteReleaseFlag || this.invoiceReleaseFlag) {
      this.formDisabledFlag = true;
    }
  }

  private initPositions() {
    // B. load positions table: orders, delivery notes, invoices
    this.initializePositionsService();
    this.positionsService.initPositionsTable();
    this.setReleaseFlagsByModel(this.selTableRow);
    // for positions, if selected table row is set and if taxation is set
    this.formDataAvailableFlag = <boolean>!!(this.selTableRow);
  }

  /**
   * is details view (views with form)
   *
   * @param subTabGroupName
   * @private
   */
  private isDetailsView(subTabGroupName: SubTabGroupTabNames): boolean {
    return (subTabGroupName === this.CONSTANTS.REFTABLE_CUSTOMER_CUS_TITLE) ||
      (subTabGroupName === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_TITLE) ||
      (subTabGroupName === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV_TITLE) ||
      (subTabGroupName === this.CONSTANTS.REFTABLE_ORDERS_DETAILS_TITLE) ||
      (subTabGroupName === this.CONSTANTS.REFTABLE_DELIVERY_NOTE_DETAILS_TITLE) ||
      (subTabGroupName === this.CONSTANTS.REFTABLE_INVOICE_DETAILS_TITLE);
  }

  private initializePositionsService() {
    this.positionsService.setRequiredParams(this.refTable, this.tabsService.selCurrentTabGroupName,
      this.updatedOrderPositionsRows, this.fullEditMode, this.orderAllocatedFlag, this.pTable, this.tabsService,
      this.ordPosStates, this.dlvPosStates, this.invPosStates,
      this.saveButton, this.dlgSaveButton, this.allocateButton, this.currencies,
      this.positionsService.cols, this.selTableRow, this.ordDlvInvStates, this.formDataAvailableFlag,
      this.formDisabledFlag, this.selTableRowTaxation, this.orderReleaseFlag);
  }

  /**
   * set form value changes
   *
   * @private
   */
  public setFormValueChanges() {
    if (!this.formDisabledFlag) {
      if (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER || this.refTable === this.CONSTANTS.REFTABLE_PARTNERS) {
        this.setOptionsChangesForCustomer();
      } else if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) {
        this.setOptionsChangesForOrder();
      } else if (this.refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES) {
        this.setOptionsChangesForDeliveryNote();
      } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
        this.setOptionsChangesForInvoice();
      }
    }
  }

  /**
   * set for form options the value changes subscriptions
   * fake existing of empty controls, to be able to set valueChanges function
   */
  private setOptionsChangesForOrder() {
    this.form.form.registerControl('CUSTOMER_ORDER', new FormControl());
    this.form.form.get('CUSTOMER_ORDER')?.valueChanges
      .subscribe(async selectedValue => {
        if (selectedValue && !selectedValue.includes("(")) {
          await this.setValuesByCustomerNumber(selectedValue);
        }
      });
    this.form.form.registerControl('RELEASE', new FormControl());
    this.form.form.get('RELEASE')?.valueChanges
      .subscribe(async selectedValue => {
        if (selectedValue) {
          let errorMessage = this.translatePipe.transform('IS_NOT_PAYED');
          if (!this.form.form.get('PAYED')?.value) {
            this.resetFieldAtError('RELEASE', 'ORDER_POSITION', errorMessage);
          }
        }
      });
  }

  /**
   * set values by customer number / client
   *
   * values:
   *  customers type
   *  payment term id
   *  address dlv
   *  address inv
   *
   * @param customerNumber
   * @private
   */
  private async setValuesByCustomerNumber(customerNumber: string) {
    let customersType: string;
    let paymentTermId: string;
    let addressDlv: string;
    let addressInv: string;
    let addressTaxationNames: string;
    let addressTaxCode: string;
    let addressTaxRate: string;
    let addressNames: string;
    if (customerNumber) {
      let customersDbData: { table: [any[string], any[]], maxRows: number, page: number } =
        await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_CUSTOMER,
          ViewQueryTypes.DETAIL_TABLE, this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN, customerNumber);
      customersType = (customersDbData && customersDbData?.table[1] && customersDbData.table[1][0]) ?
        customersDbData['table'][1][0].CUSTOMERS_TYPE : undefined;
      paymentTermId = (customersDbData && customersDbData?.table[1] && customersDbData.table[1][0]) ?
        customersDbData['table'][1][0].PAYMENT_TERM_ID : undefined;
      if (this.newItemMode) {
        let addressesData: { table: [any[string], any[]], maxRows: number, page: number } =
          await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV,
            ViewQueryTypes.DETAIL_TABLE, this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN, customerNumber);
        // Build addresses string in specific format like at server > Table > getAddressesSelectQuery function
        if (addressesData && addressesData?.table[1] && addressesData.table[1][0] && addressesData.table[1][1]) {
          addressNames = "";
          addressTaxationNames = "";
          for (let addressItem in addressesData.table[1]) {
            if (addressesData.table[1].hasOwnProperty(addressItem)) {
              // create a string with addresses dlv and inv, separated by ";"
              addressNames += addressesData['table'][1][addressItem].ADDRESS_TYPE +
                this.CONSTANTS.CUSTOMERS_ADDRESSES_DELIMITER +
                addressesData['table'][1][addressItem].ID +
                this.CONSTANTS.CUSTOMERS_ADDRESSES_DELIMITER +
                addressesData['table'][1][addressItem].ADDRESS_STREET +
                " " + this.CONSTANTS.CUSTOMERS_ADDRESSES_STREET_ZIP_DELIMITER + " " +
                addressesData['table'][1][addressItem].ADDRESS_POSTCODE +
                " " +
                addressesData['table'][1][addressItem].ADDRESS_CITY + ";";
              // extract addresses id's of dlv and inv
              if (addressesData.table[1][addressItem].ADDRESS_TYPE === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_COLUMN) {
                addressDlv = addressesData['table'][1][addressItem].ID ? addressesData['table'][1][addressItem].ID : undefined;
              } else if (addressesData.table[1][addressItem].ADDRESS_TYPE === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV_COLUMN) {
                addressInv = addressesData['table'][1][addressItem].ID ? addressesData['table'][1][addressItem].ID : undefined;
                addressTaxCode = addressesData['table'][1][addressItem].TAXCODE ?
                  addressesData['table'][1][addressItem].TAXCODE : undefined;
              }
              // create a string with taxation of dlv and inv, separated by ";"
              addressTaxationNames += addressesData['table'][1][addressItem].ADDRESS_TYPE +
                this.CONSTANTS.CUSTOMERS_ADDRESSES_DELIMITER +
                addressesData['table'][1][addressItem].ID +
                this.CONSTANTS.CUSTOMERS_ADDRESSES_DELIMITER +
                addressesData['table'][1][addressItem].TAXCODE + ";";
            }
          }
        }
      }
    }
    this.form.form.get(this.CONSTANTS.REFTABLE_ORDERS_CLIENT_COLUMN)?.setValue(customersType);
    this.form.form.get('PAYMENT_TERM_ID')?.setValue(paymentTermId);
    if (this.newItemMode) {
      // set orders selected customer number for delivery and invoice (CUSTOMER_DELIVERY, CUSTOMER_INVOICE)
      this.setFormValueAndOptions('CUSTOMER_DELIVERY', (customerNumber) ? customerNumber : '');
      this.setFormValueAndOptions('CUSTOMER_INVOICE', (customerNumber) ? customerNumber : '');
      // assign addresses string to the form options
      this.optionsService.getOrderAddresses(addressNames);
      this.setFormValueAndOptions('CUSTOMER_ADDRESSES_ID_DELIVERY', addressDlv, this.optionsService.addressesDLV);
      this.setFormValueAndOptions('CUSTOMER_ADDRESSES_ID_INVOICE', addressInv, this.optionsService.addressesINV);
      // assign taxation string to the form options
      this.optionsService.getOrderTaxation(addressTaxationNames);
      this.setFormValueAndOptions('TAXCODE', addressTaxCode, this.optionsService.taxCodes);
      addressTaxRate = await this.getTaxRateByTaxCode(addressTaxCode);
      this.setFormValueAndOptions('TAXRATE', addressTaxRate, this.optionsService.taxRates);
      // assign locations
      this.setLocationsOptions();
      // assign currencies
      this.setCurrencyOptions();
    }
  }

  /**
   * return tax rate by given tac code
   *
   * @param taxCode
   * @private
   */
  private async getTaxRateByTaxCode(taxCode: string) {
    let taxRate: string;
    if (taxCode && this.optionsService.taxRates) {
      const taxRatesData: { table: [any[string], any[]], maxRows: number, page: number } =
        await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_TAXESRATE, ViewQueryTypes.DETAIL_TABLE,
          this.CONSTANTS.REFTABLE_TAXESRATE_COLUMN, taxCode);
      if (!taxRatesData || !taxRatesData.table || !taxRatesData.table[1]) {
        console.log(new Error('tax rates data is undefined!'));
      } else {
        let taxRates = taxRatesData.table[1];
        for (let rateItem in taxRates) {
          if (taxRates.hasOwnProperty(rateItem) &&
            taxRates[rateItem][this.CONSTANTS.REFTABLE_TAXESRATE_PER_END_COLUMN] === null &&
            taxCode === taxRates[rateItem][this.CONSTANTS.REFTABLE_TAXESRATE_COLUMN]) {
            taxRate = taxRates[rateItem][this.CONSTANTS.REFTABLE_TAXESRATE_TAXRATE_COLUMN];
            break;
          }
        }
      }
    }
    return taxRate;
  }

  /**
   * set id and options of the form address field dlv or inv
   *
   * @param key
   * @param value
   * @param options
   * @private
   */
  private setFormValueAndOptions(key: string, value: string, options: any[] = []) {
    // set id if only one address is available
    this.form.form.get(key)?.setValue(value);
    // 'Please select' text + street item = 2 elements
    if ((key === 'CUSTOMER_ADDRESSES_ID_DELIVERY' || key === 'CUSTOMER_ADDRESSES_ID_INVOICE') && options.length > 2) {
      this.messagesService.showInfoMessage("There are more then one customer address " +
        (key === 'CUSTOMER_ADDRESSES_ID_DELIVERY' ? "delivery" : "invoice") + ". " +
        "Please select one of them.");
    }
    let field = this.formService.getField(key, this.formService.fields);
    // (this.form.options as any)._markForCheck(field);
    if (field && field.templateOptions && field.templateOptions.options) {
      field.templateOptions.options = options;
    }
  }

  private setLocationsOptions() {
    this.form.form.registerControl('WAREHOUSE', new FormControl());
    this.setFormValueAndOptions('WAREHOUSE', undefined, this.optionsService.warehousingLocations); // pwarehouses
    this.form.form.registerControl('SALES_LOCATION', new FormControl());
    this.setFormValueAndOptions('SALES_LOCATION', undefined, this.optionsService.salesLocations);
  }

  private setCurrencyOptions() {
    this.form.form.registerControl('CURRENCY', new FormControl());
    this.setFormValueAndOptions('CURRENCY', undefined, this.optionsService.pcurrencies);
  }

  /**
   * reset form field and show error message
   *
   * @param fieldName
   * @param errorTextPart
   * @param errorMessage
   * @private
   */
  private resetFieldAtError(fieldName: string, errorTextPart: string, errorMessage: string) {
    errorMessage = errorMessage.replace('%s', this.translatePipe.transform(errorTextPart));
    this.messagesService.showErrorMessage(errorMessage);
    this.form.form.get(fieldName)?.setValue(false);
  }

  /**
   * set for form options the value changes subscriptions
   * fake existing of empty controls, to be able to set valueChanges function
   */
  private setOptionsChangesForDeliveryNote() {
    this.form.form.registerControl('RELEASE', new FormControl());
    // for delivery note check at release = true, if some/all positions are partly or complete delivered
    // if there are no positions delivered, reset to release = false
    this.form.form.get('RELEASE')?.valueChanges
      .subscribe(async selectedValue => {
        if (selectedValue) {
          // check if some delivery note positions are not delivered: not have state 'DELIVERED' (3)
          const objectData: {} = {
            deliveryNoteId: this.selTableRow['DELIVERY_NOTES_NUMBER'],
            // positionStatusDelivered: this.dlvPosStates[2].value // [1] PARTLY_DELIVERED
            // [1] PARTLY_DELIVERED, [2] DELIVERED
            positionStates: [this.dlvPosStates[1].value, this.dlvPosStates[2].value]
          };
          const dlvPositionsNotDelivered: { result: boolean } =
            await this.tableDataService.checkTableData('checkDLVPositionsState', objectData, true);
          if (dlvPositionsNotDelivered.result) {
            let errorMessage = this.translatePipe.transform('DELIVERY_NOTES_POSITION_STATE_NOT_DELIVERED');
            this.resetFieldAtError('RELEASE', '', errorMessage);
          }
        }
      });
  }

  private setOptionsChangesForInvoice() {
    this.form.form.registerControl('RELEASE', new FormControl());
    this.form.form.get('RELEASE')?.valueChanges
      .subscribe(async selectedValue => {
        if (selectedValue) {
          let errorMessage = this.translatePipe.transform('IS_NOT_PAYED');
          // check if some invoice positions are not paid: not have state 'PAYED' (2)
          const objectData: {} = {
            invoiceId: this.selTableRow['INVOICES_NUMBER'],
            positionStatusPayed: this.invPosStates[1].value
          };
          const invoicePositionsNotPayed: { result: boolean } =
            await this.tableDataService.checkTableData('checkINVPositionsState', objectData, true);
          if (invoicePositionsNotPayed.result) {
            this.resetFieldAtError('RELEASE', 'INVOICE_POSITION', errorMessage);
          } else if (!this.form.form.get('PAYED')?.value) {
            this.resetFieldAtError('RELEASE', 'INVOICE', errorMessage);
          }
        }
      });
    // check at deselect of PAYED field, if RELEASE field is set. if yes, deselect RELEASE field.
    this.form.form.registerControl('PAYED', new FormControl());
    this.form.form.get('PAYED')?.valueChanges
      .subscribe(async selectedValue => {
        if (!selectedValue) {
          if (this.form.form.get('RELEASE')?.value) {
            this.form.form.get('RELEASE')?.setValue(false);
          }
        }
      });

    this.form.form.registerControl('INVOICES_CUSTOMER', new FormControl());
    this.form.form.get('INVOICES_CUSTOMER')?.valueChanges
      .subscribe(async selectedValue => {
        if (selectedValue && !selectedValue.includes("(")) {
          await this.setValuesByCustomerNumber(selectedValue);
        }
      });
  }

  /**
   * set release flag by model data
   *
   * @param model
   * @private
   */
  private setReleaseFlagsByModel(model: any) {
    switch (this.refTable) {
      case(this.CONSTANTS.REFTABLE_CUSTOMER) :
        break;
      case(this.CONSTANTS.REFTABLE_PARTNERS) :
        break;
      case(this.CONSTANTS.REFTABLE_ORDERS) :
        this.formDisabledFlag = <boolean>(model.ORDERS_STATE === this.CONSTANTS.ORDER_STATES_COMPLETED);
        // set RELEASE flag for view
        this.orderReleaseFlag = <boolean>(!!model.RELEASE);
        this.orderPayedFlag = <boolean>(!!model.PAYED);
        break;
      case(this.CONSTANTS.REFTABLE_DELIVERY_NOTES) :
        // set RELEASE flag for view
        this.deliveryNoteReleaseFlag = <boolean>(!!model.RELEASE);
        break;
      case(this.CONSTANTS.REFTABLE_INVOICE) :
        this.invoiceReleaseFlag = <boolean>(!!model.RELEASE);
        break;
    }
  }

  /**
   * reset release flags
   */
  resetReleaseFlags() {
    this.orderReleaseFlag = false;
    this.invoiceReleaseFlag = false;
    this.deliveryNoteReleaseFlag = false;
    this.formDataAvailableFlag = false;
    this.formDisabledFlag = false;
  }

  /**
   * set second params - as workaround for loading customer addresses data
   *
   * @param existsTableData
   * @param secondColumn
   * @param secondId
   * @param formRefTable
   * @private
   */
  private setParamsForCustomerAddresses(existsTableData: boolean, secondColumn: string, secondId: string,
                                        formRefTable: string): { secondColumn, secondId } {
    // Workaround to prevent loading of wrong customer addresses type data
    if (existsTableData && secondColumn && !secondId) {
      if (formRefTable === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV) {
        secondColumn = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_ADDRESS_TYPE;
        secondId = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_COLUMN;
      } else if (formRefTable === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV) {
        secondColumn = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_ADDRESS_TYPE
        secondId = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV_COLUMN;
      }
    }
    return {secondColumn, secondId};
  }

  /**
   * set for form options the value changes subscriptions
   * fake existing of empty controls, to be able to set valueChanges function
   */
  public setOptionsChangesForCustomer() {
    // fake existing of language control, to set valueChanges function
    this.form.form.registerControl('LANGUAGE', new FormControl());
    // set value changes method
    this.form.form.get('LANGUAGE')?.valueChanges
      .subscribe(val => {
        this.onCustomersLanguageChange(val);
      });
    this.form.form.registerControl('ADDRESS_ISO_CODE', new FormControl());
    this.form.form.get('ADDRESS_ISO_CODE')?.valueChanges
      .subscribe(async () => {
        const formVal = this.form.form.getRawValue();
        await this.changeTaxCode(formVal?.ADDRESS_ISO_CODE);
      });

    this.form.form.registerControl('ADDRESS_CRYNAME', new FormControl());
    this.addressCountryNameChange();
  }

  async changeTaxCode(countryIsoCode: string) {
    if (this.form.form.get('TAXCODE')) {
      // @ToDo: Add default taxation for b2b & b2c
      let newTaxCode: string; // = this.CONSTANTS.DEFAULT_B2C_TAX_CODE;
      newTaxCode = await this.optionsService.getTaxCodeByCountryIsoCode(countryIsoCode);
      this.form.form.controls['TAXCODE']?.setValue(newTaxCode);
    }
  }

  /**
   * at address country name change, the address iso code and tax code will be changed
   */
  addressCountryNameChange() {
    this.form.form.get('ADDRESS_CRYNAME')?.valueChanges
      .subscribe(async selectedValue => {
        await this.setAddressIsoCodeByCountry(selectedValue, this.countriesWithId);
        // if (this.form.form.get('ADDRESS_ISO_CODE')) {
        //   await this.changeTaxCode(this.form.form.controls['ADDRESS_ISO_CODE'].value);
        // }
      });
  }

  /**
   * should set address iso code by country
   *
   * @param country
   * @param countriesWithId
   */
  async setAddressIsoCodeByCountry(country: string, countriesWithId: FormOptionsINV[]) {
    if (this.form.form.get('ADDRESS_ISO_CODE')) {
      let newAddressIsoCode: string = this.formService.getAddressIsoCodeByCountry(country, countriesWithId);
      this.form.form.controls['ADDRESS_ISO_CODE']?.setValue(newAddressIsoCode);
      await this.changeTaxCode(newAddressIsoCode);
    }
  }

  /**
   * on customers language change
   *
   * @param language
   */
  public onCustomersLanguageChange(language: string) {
    if (this.form && this.form.form.get('LANGUAGE')) {
      this.changePaymentTermId(language);
    }
  }

  /**
   * change payment term id by given language ([LANGUAGE_ISO_ALPHA_3], e.g. 'DEU')
   *
   * @param language
   */
  changePaymentTermId(language: string): void {
    if (this.form.form.get('PAYMENT_TERM_ID')) {
      let newPaymentTermId: string = this.defaultPaymentTermId;
      newPaymentTermId = this.optionsService.getPaymentTermByLanguage(language, newPaymentTermId);
      this.form.form.controls['PAYMENT_TERM_ID']?.setValue(newPaymentTermId);
    }
  }

  /**
   * set default payment condition
   *
   * @param condition
   */
  setDefaultPaymentCondition(condition: string) {
    this.defaultPaymentCondition = condition;
  }

  /**
   * set default payment condition
   *
   * @param id
   */
  setDefaultPaymentTermId(id: string) {
    this.defaultPaymentTermId = id;
  }

  /**
   * Disable or enable form save button(s)
   *
   * @param disable: boolean - if true - disable save button
   */
  disableSaveButton(disable: boolean) {
    if (this.saveButton) {
      this.saveButton.nativeElement.disabled = disable;
    }
    if (this.dlgSaveButton) {
      this.dlgSaveButton.nativeElement.disabled = disable;
    }
  }
}
