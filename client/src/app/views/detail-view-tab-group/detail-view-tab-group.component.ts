import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {DynamicFormComponent} from '../../dynamic-view/dynamic-form/dynamic-form.component';
import {MatTabGroup} from '@angular/material/tabs';
import {CustomersAddr} from '../../interfaces/customers-addr-item';
import {CustomerAdrr} from '../../models/customer-addr';
import {FormBuilder} from '@angular/forms';
import {TableDataService} from '../../_services/table-data.service';
import {Router} from '@angular/router';
import {
  ConstantsService,
  CustomerAddressTypes,
  CustomersTypes,
  SoasModel,
  SubTabGroupTabNames, SubTabGroupTabNumbers,
  TabGroupModel,
  TabGroupTabNames,
  TabGroupTabNumbers,
  ViewQueryTypes
} from '../../_services/constants.service';
import {SelectionModel} from '@angular/cdk/collections';
import {OrderPositionItem} from '../../interfaces/order-position-item';
import {OrdersPositions} from '../../models/orders-positions';
import {DeliveryNotesPositions} from '../../models/delivery-notes-positions';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {DeliveryNotePositionItem} from 'src/app/interfaces/delivery-note-position-item';
import {InvoicePositionItem} from 'src/app/interfaces/invoice-position-item';
import {Table} from 'primeng/table';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AutoComplete} from 'primeng/autocomplete';
import {InvoicesPositions} from 'src/app/models/invoices-positions';
import {CustomTableComponent} from '../custom/custom-table/custom-table.component';
import {CustomPDialogComponent} from '../custom/custom-p-dialog/custom-p-dialog.component';
import {HelperService} from 'src/app/_services/helper.service';
import {DetailViewTabGroupPositionsService} from './detail-view-tab-group-positions.service';
import {FormService} from 'src/app/_services/form.service';
import {TableItem} from 'src/app/interfaces/table-item';
import {Sort} from '../custom/custom-table/page';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {TranslateItPipe} from 'src/app/shared/pipes/translate-it.pipe';
import {DetailViewTabGroupSaveService} from './detail-view-tab-group-save.service';
import {Subscription} from 'rxjs';
import {CustomPTableComponent} from '../custom/custom-p-table/custom-p-table.component';
import {FetchTableService} from '../../_services/fetch-table.service';
import {FetchDataService} from '../../_services/fetch-data.service';
import {DetailViewTabGroupPDialogService} from './detail-view-tab-group-p-dialog.service';
import {DetailViewTabGroupCustomerAddressesService} from './detail-view-tab-group-customer-addresses.service';
import {DetailViewTabGroupTabsService} from './detail-view-tab-group-tabs.service';
import {DetailViewTabGroupLoadService} from "./detail-view-tab-group-load.service";
import {DetailViewTabGroupFormService} from "./detail-view-tab-group-form.service";
import {PricelistSales} from "../../interfaces/price-list-sales-item";
import {MessagesService} from "../../_services/messages.service";
import {
  FormOptionsINV,
  FormOptionsLVs,
  FormOptionsNVn,
  FormOptionsNVs,
  FormOptionsNVS
} from "../../interfaces/form-options";
import {DeliveryNotes} from "../../models/delivery-notes";

// Overwrite console log function, to enable or disable logs
// console.log = function() {};

@Component({
  selector: 'app-detail-view-tab-group',
  templateUrl: './detail-view-tab-group.component.html',
  styleUrls: ['./detail-view-tab-group.component.css'],
  providers: [TranslateItPipe, MessageService]
})

/**
 * DetailViewTabGroupComponent - detail view tab group component view with 5 tabs
 *
 * - 1 tab: Customer
 *    - 1.1 sub-tab: Customer-Details: form view of DynamicFormComponent
 *    - 1.2 sub-tab: Delivery-Addresses: table + form view of CustomTableComponent + DynamicFormComponent
 *    - 1.3 sub-tab: Invoice-Addresses: table + form view of CustomTableComponent + DynamicFormComponent
 * - 2 tab: Order
 *    - 2.1 sub-tab: Order-Details: form view of DynamicFormComponent
 *    - 2.2 sub-tab: Order-Positions: p-table view of CustomPTableComponent
 * - 3 tab: Delivery note
 *    - 3.1 sub-tab: Delivery-Note-Details: form view of DynamicFormComponent
 *    - 3.2 sub-tab: Delivery-Note-Positions: p-table view of CustomPTableComponent
 * - 4 tab: Invoice
 *    - 4.1 sub-tab: Invoice-Details: form view of DynamicFormComponent
 *    - 4.2 sub-tab: Invoice-Positions: p-table view of CustomPTableComponent
 * - 5 tab: Comments:
 *    - not implemented yet
 *
 * { CustomTableComponent and DetailViewTabGroupComponent }
 *
 * Used by: OrdersComponent, DeliveryNotesComponent, InvoicesComponent, CustbtwocComponent, CustbtwobComponent
 */
export class DetailViewTabGroupComponent implements OnInit, AfterViewInit {

  // functions will be set/overwritten in customers, orders, delivery notes, invoices components
  // reset details view form
  @Input() resetForm: Function;
  // refresh main table
  @Input() refreshTable: Function;
  // refresh details view
  @Input() refreshDetails: Function;

  /**
   * selected view referral table name:
   * customer details - CONSTANTS.REFTABLE_CUSTOMER = "custbtwoc"
   * partner details - CONSTANTS.REFTABLE_PARTNERS = "custbtwob"
   */
  refTable: string;

  // referral table name for secondary table: e.g. customers addresses
  secondaryRefTable: string = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV;

  // fetch data subscription - wait for loaded changes and refresh view or enable/disable save button
  serviceSubscription: Subscription;

  allowMultiSelect: boolean;
  // flag if results are loading, so an overlay and animation (mat-spinner) is shown
  isLoadingResults: boolean = false;
  // (not used yet) flag to catch if the API has reached its rate limit (return empty data.)
  isRateLimitReached: boolean = false;

  // form view for details (customer details, order details, delivery notes details, invoices details)
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  // p-table view for positions (order-, delivery notes-, invoices-positions)
  @ViewChild(CustomPTableComponent) pTable !: CustomPTableComponent;

  // table view for customer delivery note addresses (dlv)
  @ViewChild(CustomTableComponent) customAddrDLVTableComponent !: CustomTableComponent;
  // table view for customer invoice addresses (inv)
  @ViewChild(CustomTableComponent) customAddrINVTableComponent !: CustomTableComponent;
  // a p-dialog to add a new position at orders positions view
  @ViewChild(CustomPDialogComponent) pDialogComponent !: CustomPDialogComponent;

  /** tabs definitions */
  @ViewChild('tabs', {static: false}) tabGroup: MatTabGroup;
  @ViewChild('custabs', {static: false}) cusTabGroup: MatTabGroup;
  @ViewChild('ordtabs', {static: false}) ordTabGroup: MatTabGroup;
  @ViewChild('deltabs', {static: false}) delTabGroup: MatTabGroup;
  @ViewChild('invtabs', {static: false}) invTabGroup: MatTabGroup;
  @ViewChild('comtabs', {static: false}) comTabGroup: MatTabGroup;

  /** buttons & inputs definitions */
  @ViewChild('saveButton', {static: false}) saveButton: ElementRef;
  @ViewChild('allocateButton', {static: false}) allocateButton: ElementRef;
  @ViewChild('dlgSaveButton', {static: false}) dlgSaveButton: ElementRef;
  @ViewChild('createDNButton', {static: false}) createDNButton: ElementRef;
  @ViewChild('createINVButton', {static: false}) createINVButton: ElementRef;
  @ViewChild('dlnTableSearchInput', {static: false}) dlnTableSearchInput: ElementRef;
  @ViewChild('autocomplete', {static: false}) autocomplete: AutoComplete;

  //**** Delivery Note variables
  @ViewChild('dlnDataTable', {static: false}) dlnDataTable: Table;

  //**** Invoice variables
  @ViewChild('invDataTable', {static: false}) invDataTable: Table;
  newInvoicePosition: boolean;

  // tab group index change function, will be set/overwritten in customers, orders, delivery notes, invoices components
  selectedIndexChange: Function;
  // sub tab group index change function, will be initialized at CustomTableTabGroupViewComponent
  selectedSubIndexChange: Function;

  // p-table data rows number (orders, delivery notes)
  pDataTableRows: number = 6;
  // p-table data rows number (invoices)
  pDataTableRowsINV: number = 7;

  // details form fields options (customers, orders, delivery note, invoices)
  countriesWithId: FormOptionsINV[];
  currencies: FormOptionsNVs[];
  pcurrencies: FormOptionsLVs[];
  ordDlvInvStates: FormOptionsNVn[];
  ordPosStates: FormOptionsNVS[];
  dlvPosStates: FormOptionsNVS[];
  invPosStates: FormOptionsNVS[];

  // empty (main) model for new item mode
  emptyModel: SoasModel;
  // empty details model for new item mode, e.g. customer address
  emptyDetailsModel: SoasModel;

  // selected table row item
  selTableRow: TabGroupModel;
  // selected table row item taxation value (required for customers, orders)
  selTableRowTaxation: number;
  // selected positions row (orders, delivery notes, invoices)
  selPositionsRow: OrdersPositions | DeliveryNotesPositions | InvoicesPositions;

  selectionModel: SelectionModel<TableItem>;

  // @ToDo: Use one variable for all new modes
  newItemMode: boolean;
  newCustomerMode: boolean;
  newCustomerAddrINVMode: boolean;
  newCustomerAddrDLVMode: boolean;
  newOrderMode: boolean;
  newOrderPositionMode: boolean;
  newDeliveryNoteMode: boolean;
  newInvoiceMode: boolean;

  PAGINATOR_ELEMENTS_PER_SIDE: number[];
  PAGINATOR_ELEMENTS_PER_SIDE_SMALL: number[];
  currPageSizeMainTable: number;
  currPageSizeDetailTable: number;
  // main table view displayed columns
  displayedColumns: string[] = [];
  initialSort: Sort<CustomerAdrr>;
  tableColumnsToHide: string[];
  addrDLVPositionsItems: CustomersAddr[];
  addrINVPositionsItems: CustomersAddr[];

  // *** Primeng table orders variables
  selectedOrderPosition: OrderPositionItem;
  newOrderPosition: boolean;
  cols: any[]; // order positions form columns
  dialogCols: any[]; // new position dialog form columns
  displayDialog: boolean;
  saveEditable: boolean;
  updatedOrderPositionsRows: string[];
  filterItmnums: any[];
  orderAllocatedFlag: boolean; // is order fully allocated (all positions have state 3 - STATE_POS_COMPLETELY_ALLOCATED)

  // if false - positions table will be reset, if true - close positions view
  resetState: boolean;

  errorMessage: string;

  /*** DEBUG methods ************/
  fullEditMode: boolean = false; // Flag to manage editing readonly fields like ASSIGN_QTY at order positions

  // default form settings
  defaultPaymentCondition: string;
  defaultPaymentTermId: string;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private tableDataService: TableDataService,
    private router: Router,
    private CONSTANTS: ConstantsService,
    public translatePipe: TranslateItPipe,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private helperService: HelperService,
    private messagesService: MessagesService,
    private formService: FormService,
    public positionsService: DetailViewTabGroupPositionsService,
    public saveService: DetailViewTabGroupSaveService,
    private fetchTableService: FetchTableService,
    private fetchDataService: FetchDataService,
    private cdRef: ChangeDetectorRef,
    public tabsService: DetailViewTabGroupTabsService,
    public pDialogService: DetailViewTabGroupPDialogService,
    public customerAddressesService: DetailViewTabGroupCustomerAddressesService,
    public loadService: DetailViewTabGroupLoadService,
    public tabGroupFormService: DetailViewTabGroupFormService
  ) {
    this.resetVars();
    // this.tableColumnsToHide = ['ADDRESS_COMMENT', 'TAXATION', 'ADDRESS_ISO_CODE', 'ID'];
    this.errorMessage = this.translatePipe.transform('FIELD_SHOULD_NOT_BE_EMPTY');
    formService.setTranslatePipe(translatePipe);
    this.positionsService.setTranslatePipe(this.translatePipe);
    this.pDialogService.setTranslatePipe(this.translatePipe);
    this.saveService.setTranslatePipe(this.translatePipe);
    this.saveService.setMessageService(this.messageService);
    this.tabGroupFormService.setTranslatePipe(this.translatePipe);
    this.tabGroupFormService.setMessageService(this.messageService);
  }

  ngOnInit() {
    // form is not disabled by default
    this.tabGroupFormService.formDisabledFlag = false;
    this.tabGroupFormService.formDataAvailableFlag = false;
    this.resetState = false;
    this.newOrderPosition = false;
    this.newInvoicePosition = false;
    this.tabGroupFormService.disableSaveButton(true);
    this.disableAllocateButton(true);
    this.PAGINATOR_ELEMENTS_PER_SIDE = this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE_BIG;
    this.currPageSizeMainTable = this.PAGINATOR_ELEMENTS_PER_SIDE[0];
    this.currPageSizeDetailTable = this.CONSTANTS.PAGINATOR_MAX_ELEMENTS_TINY;

    const pleaseSelectName: string = this.translatePipe.transform('PLEASE_SELECT');
    this.currencies = [{name: pleaseSelectName, value: undefined}];
    this.pcurrencies = [{label: pleaseSelectName, value: undefined}];
    this.ordDlvInvStates = [{name: pleaseSelectName, value: undefined}];

    // subscribe to wait for loaded changes
    this.serviceSubscription = this.fetchTableService.getDataObs().subscribe(async (dataObs) => {
      // do resolve changes came from p-table...
      if (dataObs) {
        // disable or enable save button for positions
        if (dataObs.hasOwnProperty('disableSaveButton')) {
          this.tabGroupFormService.disableSaveButton(dataObs.disableSaveButton);
        }
        // refresh this detail view
        if (dataObs.hasOwnProperty('refreshDetailView') && dataObs.refreshDetailView) {
          // this.orderPositions = this.orderPositions.filter((val, i) => i != index);
          // this.orderPosition = null;
          await this.showTableFormData(undefined, undefined); // load table data from db...
          // await this.getFormData(SubTabGroupTabNames.ORDER_POSITIONS);
          this.refreshTableViews(); // reset save button, disable loading animation etc.
          this.messagesService.showSuccessMessage(this.translatePipe.transform('POSITIONS') + ': ' +
            this.translatePipe.transform('DELETE_SUCCESS'));
        }
      }
    });
  }

  public ngAfterViewInit(): void {
    this.initializeTabGroup();
    // this.initializePositionsService(); // this.ordPosStates
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.serviceSubscription && !this.serviceSubscription.closed) {
      this.serviceSubscription.unsubscribe();
    }
  }

  /**
   * send service result
   *
   * @param: dataObj
   */
  public sendServiceResult(dataObj: {
    refTableName: string, fieldName: string, disableSaveButton: boolean, positions: [], refreshDetailView: boolean
  }) {
    this.fetchTableService.setDataObs(dataObj.refTableName, dataObj.fieldName, dataObj.disableSaveButton,
      dataObj.positions, dataObj.refreshDetailView);
  }

  private resetVars() {
    this.refTable = undefined;
    this.selTableRow = undefined;
    this.selPositionsRow = undefined;
    this.customerAddressesService.resetAddressesTableItems();
    this.resetODITableItems();
    this.resetState = false;
    this.allowMultiSelect = false;
    this.displayDialog = false;
    this.saveEditable = true;
    this.filterItmnums = [];
    this.tabGroupFormService.orderPayedFlag = false;
    this.orderAllocatedFlag = false;
    this.newItemMode = false;
    this.newCustomerMode = false;
    this.newCustomerAddrINVMode = false;
    this.newCustomerAddrDLVMode = false;
    this.newOrderMode = false;
    this.newOrderPositionMode = false;
    this.newDeliveryNoteMode = false;
    this.newInvoiceMode = false;
    this.tabGroupFormService.resetReleaseFlags();
    this.fetchTableService.resetDataObs();
  }

  /**
   * reset (odi) orders, delivery notes and invoices table items
   *
   * @private
   */
  public resetODITableItems() {
    this.updatedOrderPositionsRows = [];
  }

  /**
   * reset taxation if order has changed (at click)
   */
  resetTaxation() {
    this.selTableRowTaxation = undefined;
  }

  public setRefTable(table: string) {
    this.refTable = table;
  }

  public setStates(st: FormOptionsNVn[]) {
    this.ordDlvInvStates = st;
  }

  public setOrderPositionStates(st: FormOptionsNVS[]) {
    this.ordPosStates = st;
  }

  public setDlvPositionStates(st: FormOptionsNVS[]) {
    this.dlvPosStates = st;
  }

  public setInvPositionStates(st: FormOptionsNVS[]) {
    this.invPosStates = st;
  }

  public setCurrencies(cr: FormOptionsNVs[]) {
    this.currencies = cr;
  }

  public setPCurrencies(pcr: FormOptionsLVs[]) {
    this.pcurrencies = pcr;
  }

  public setCountriesWithId(countriesWithId: FormOptionsINV[]) {
    this.countriesWithId = countriesWithId;
  }

  async setSelectedTabIndex(selectedIndex: TabGroupTabNumbers, detailsSelectedIndex: SubTabGroupTabNumbers = undefined) {
    // console.log('#this.tabGroup.selectedIndex: ', this.tabGroup.selectedIndex);
    // console.log('#selectedIndex: ', selectedIndex);
    // console.log('#detailsSelectedIndex: ', detailsSelectedIndex);
    if (this.tabGroup.selectedIndex !== selectedIndex) {
      this.tabGroup.selectedIndex = selectedIndex;
    } else {
      switch (selectedIndex) {
        case(TabGroupTabNumbers.CUSTOMER) :
          // @ToDp: cusTabGroup is defined.
          if (detailsSelectedIndex !== undefined) {
            this.cusTabGroup.selectedIndex = detailsSelectedIndex;
          } else {
            this.cusTabGroup.selectedIndex = selectedIndex;
          }
          break;
        case(TabGroupTabNumbers.ORDER) :
          if (this.ordTabGroup) {
            if (detailsSelectedIndex !== undefined) {
              this.ordTabGroup.selectedIndex = detailsSelectedIndex;
            } else {
              this.ordTabGroup.selectedIndex = selectedIndex;
            }
          } else {
            console.log('ordTabGroup is undefined!');
            this.tabGroup.selectedIndex = selectedIndex;
          }
          break;
        case(TabGroupTabNumbers.DELIVERY_NOTE) :
          if (this.delTabGroup) {
            if (detailsSelectedIndex !== undefined) {
              this.delTabGroup.selectedIndex = detailsSelectedIndex;
            } else {
              this.delTabGroup.selectedIndex = selectedIndex;
            }
          } else {
            this.tabGroup.selectedIndex = selectedIndex;
          }
          break;
        case(TabGroupTabNumbers.INVOICE) :
          if (this.invTabGroup) {
            if (detailsSelectedIndex !== undefined) {
              this.invTabGroup.selectedIndex = detailsSelectedIndex;
            } else {
              this.invTabGroup.selectedIndex = selectedIndex;
            }
          } else {
            this.tabGroup.selectedIndex = selectedIndex;
          }
          break;
        case(TabGroupTabNumbers.COMMENT) :
          if (this.comTabGroup) {
            if (detailsSelectedIndex !== undefined) {
              this.comTabGroup.selectedIndex = detailsSelectedIndex;
            } else {
              this.comTabGroup.selectedIndex = selectedIndex;
            }
          } else {
            this.tabGroup.selectedIndex = selectedIndex;
          }
          break;
        default :
          // await this.getFormData(SubTabGroupTabNames.ORDER_DETAILS);
          break;
      }
    }
  }

  /**
   * Show table and form data for given tab and tab-group indexes
   *
   * @param tabIndex
   * @param tabGroupIndex
   */
  async showTableFormData(tabIndex: number, tabGroupIndex: number) {
    tabIndex = tabIndex ? this.tabsService.selTabGroupTab : tabIndex;
    tabGroupIndex = tabGroupIndex ? this.tabsService.selSubTabGroupTab : tabGroupIndex;
    let currTabGroupName: SubTabGroupTabNames = this.getCurrentTabNames(tabIndex, tabGroupIndex);
    console.log('currTabGroupName: ', currTabGroupName);
    await this.getFormData(currTabGroupName);
  }

  /**
   * get current tab group name
   *
   * @param tabIndex
   * @param tabGroupIndex
   */
  public getCurrentTabNames(tabIndex?: number, tabGroupIndex?: number): SubTabGroupTabNames {
    return this.tabsService.getCurrentTabNames(this.refTable, tabIndex, tabGroupIndex);
  }

  public getCurrentTabName(): TabGroupTabNames {
    return this.tabsService.getSelCurrentTabName();
  }

  /**
   * Get current selected customer/order/delivery note etc. data from server and add it to form config
   *
   * Example:
   * CUSTOMER - load data from CUSTOMERS:
   *  tableDbData - check if data exists;
   *  loadFormData() - load form view data;
   * CUSTOMERS_ADDRESSES - load data from CUSTOMERS_ADDRESSES:
   *  tableDbData - load table view data;
   *  loadFormData() - load form view data;
   *
   * New item mode: load data via getFormDataLogic()
   *
   * @param subTabName - name of the sub-tab: e.g. 'CUSTOMER_DETAILS' or 'ADDRESS_DELIVERIES'
   */
  public async getFormData(subTabName: SubTabGroupTabNames): Promise<void> {
    if (!this.refTable || !subTabName) {
      console.log(new Error(((!this.refTable) ? 'refTable' : 'tabGroupName') + ' is undefined...'));
      return;
    }
    this.setIsLoadingResults(true);
    // table query primary referral table name: e.g. customers=custbtwoc
    let primaryRefTable: undefined | string = undefined;
    // table query parameters: primary and secondary
    let tablePrimaryColumn: string;
    let tablePrimaryValue: undefined | string = this.getCurrentItemNumber();
    let tableSecondColumn: string;
    let tableSecondValue: string;
    // form query secondary parameters - form query primary parameters are tablePrimaryColumn & tablePrimaryValue
    let formSecondColumn = undefined;
    let formSecondValue = undefined;
    // additional parameter for customer type: b2c/b2b
    let customerType: CustomersTypes;
    // referral table name to check if table is locked
    let lockedRefTable: undefined | string = undefined;
    const createNewItemMode: boolean = this.newItemMode || this.newCustomerMode || this.newCustomerAddrDLVMode ||
      this.newCustomerAddrINVMode || this.newOrderMode || this.newDeliveryNoteMode || this.newInvoiceMode;
    this.initializeTabGroupForm();
    this.initializePositionsService();
    this.initializeLoadService();
    // get parameters data before loading form and table data from db
    const __ret = this.loadService.getParamDataForLoading(subTabName, lockedRefTable,
      tablePrimaryColumn, tablePrimaryValue, customerType,
      tableSecondColumn, tableSecondValue, formSecondColumn, formSecondValue, primaryRefTable);
    // make documentation, before remove this console logs
    tablePrimaryColumn = __ret.tablePrimaryColumn;
    tablePrimaryValue = __ret.tablePrimaryValue;
    customerType = __ret.customerType;
    tableSecondColumn = __ret.tableSecondColumn;
    tableSecondValue = __ret.tableSecondValue;
    formSecondColumn = __ret.formSecondColumn;
    formSecondValue = __ret.formSecondValue;
    primaryRefTable = __ret.primaryRefTable;
    // secondary referral table name for query: e.g. customer addresses=customersAddrDlv
    this.secondaryRefTable = __ret.secondaryRefTable;
    lockedRefTable = __ret.lockedRefTable;
    this.cols = this.loadService.cols;
    this.dialogCols = this.loadService.dialogCols;
    let lockedMessage: string = this.translatePipe.transform('TABLE_LOCK_MESSAGE_LOCKED');
    this.tabGroupFormService.formDisabledFlag =
      await this.tableDataService.isTableLocked(lockedRefTable, tablePrimaryValue, lockedMessage);
    // query table data. check if data exists.
    // if exists, show this data in tables: customer addresses or orders/delivery note/invoices positions.
    // primaryRefTable ? primaryRefTable : this.secondaryRefTable
    let tableDbData = await this.tableDataService.getTableDataByCustomersNumber(primaryRefTable,
      ViewQueryTypes.DETAIL_TABLE, tablePrimaryColumn, tablePrimaryValue, tableSecondColumn, tableSecondValue);
    if (!tableDbData) {
      console.log(new Error('tableDbData is undefined...'));
      return;
    }
    // flag, if table data is existing
    let existsTableData: boolean = tableDbData && tableDbData['table'] && tableDbData['table'][1] &&
      Object.keys(tableDbData['table'][1]).length > 0;
    let tableHeader: string = undefined;
    let tableValues: {} = {};
    // if (!createNewItemMode) {
    //   await this.initTaxation(tablePrimaryColumn, tablePrimaryValue);
    // }
    // @Todo: If for CUSTOMER_ORDER more then 1 item is available, a combobox should be shown with all loaded items
    if ((existsTableData || (!existsTableData &&
        (subTabName === SubTabGroupTabNames.ORDER_POSITIONS || subTabName === SubTabGroupTabNames.INVOICES_POSITIONS ||
          subTabName === SubTabGroupTabNames.ADDRESS_DELIVERIES || subTabName === SubTabGroupTabNames.ADDRESS_INVOICES))) &&
      (createNewItemMode === false)) {
      await this.initTaxation(tablePrimaryColumn, tablePrimaryValue);
      tableHeader = tableDbData['table'][0];
      tableValues = tableDbData['table'][1];
      await this.initializeTableViews(subTabName, tableHeader, tableValues, customerType);
      await this.loadFormData(primaryRefTable, tablePrimaryColumn, tablePrimaryValue,
        formSecondColumn, formSecondValue, createNewItemMode, subTabName, existsTableData);
    } else {
      // await this.initializeTableViews(subTabName, tableHeader, tableValues, customerType);
      // this.resetTableAndForm(tableSecondColumn);
    }
    await this.initializeNewItemMode(createNewItemMode, tablePrimaryColumn, tablePrimaryValue, formSecondColumn,
      formSecondValue, subTabName, existsTableData);
    this.setIsLoadingResults(false);
  }

  /**
   * load taxation
   *
   * @param tablePrimaryColumn
   * @param tablePrimaryValue
   * @private
   */
  private async initTaxation(tablePrimaryColumn: string, tablePrimaryValue: string) {
    // load taxation, then load form data and show form
    this.selTableRowTaxation = undefined;
    const taxationResult: { result: boolean; taxation: number } =
      await this.loadTaxation(this.refTable, this.selTableRow, tablePrimaryColumn, tablePrimaryValue);
    if (taxationResult && taxationResult.result) {
      this.selTableRowTaxation = taxationResult.taxation;
    }
  }

  /**
   * reset table (customer addresses) and form
   *
   * @param tableSecondColumn - e.g. "ADDRESS_TYPE"
   * @private
   */
  private resetTableAndForm(tableSecondColumn: string) {
    // reset customer addresses table items
    if (tableSecondColumn === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_ADDRESS_TYPE) {
      this.customerAddressesService.resetAddressesTableItems();
    }
    this.form?.resetForm();
    // reset positions, to show empty table
    this.initializePositionsService();
    this.positionsService.initPositionsTable();
  }

  /**
   * initialize new item mode and load form data
   *
   * @param createNewItemMode
   * @param tablePrimaryColumn
   * @param tablePrimaryValue
   * @param formSecondColumn
   * @param formSecondValue
   * @param subTabName
   * @param existsTableData
   * @private
   */
  private async initializeNewItemMode(createNewItemMode: boolean, tablePrimaryColumn: string, tablePrimaryValue: string,
                                      formSecondColumn, formSecondValue, subTabName: SubTabGroupTabNames,
                                      existsTableData: boolean) {
    if (createNewItemMode) {
      this.initializeTabGroupForm();
      // load form if new item should be created
      await this.tabGroupFormService.getFormDataLogic(this.secondaryRefTable, tablePrimaryColumn, tablePrimaryValue,
        formSecondColumn, formSecondValue, createNewItemMode, subTabName, existsTableData);
      // positions flags may have changed, so update positions service
      this.initializePositionsService();
      // set form value changes (again), because they may not be set at form load
      this.tabGroupFormService.setFormValueChanges();
    }
  }

  /**
   * setup table views: customer addresses or orders/delivery note/invoices positions
   *
   * @param subTabName
   * @param tableHeader
   * @param tableValues
   * @param customerType
   * @private
   */
  private async initializeTableViews(subTabName: SubTabGroupTabNames, tableHeader: string, tableValues: {},
                                     customerType: CustomersTypes) {
    await this.initSecondaryTables(subTabName, tableHeader, tableValues, customerType);
    if ((this.secondaryRefTable === this.CONSTANTS.REFTABLE_ORDERS_POSITIONS ||
        this.secondaryRefTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS ||
        this.secondaryRefTable === this.CONSTANTS.REFTABLE_INVOICE_POSITIONS)
      && this.pTable) {
      // empty orders positions items data
      this.pTable.positionsWithId = [];
      this.initializePDialogService();
      // order positions - primaryRefTable is undefined, so query db by this.secondaryRefTable = 'orderPosition' etc.
      this.pTable.setRefTable(this.secondaryRefTable);
      if (this.secondaryRefTable === this.CONSTANTS.REFTABLE_ORDERS_POSITIONS) {
        this.pTable.setOrderPositionStates(this.ordPosStates);
      } else if (this.secondaryRefTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS) {
        this.pTable.setOrderPositionStates(this.dlvPosStates);
      } else if (this.secondaryRefTable === this.CONSTANTS.REFTABLE_INVOICE_POSITIONS) {
        this.pTable.setOrderPositionStates(this.invPosStates);
      }
      this.pTable.disableSaveButton = this.tabGroupFormService.disableSaveButton;
      // this.pTable.showErrorMessage = this.showErrorMessage;
      this.pTable.inputValidationPriceCalculation = this.pDialogService.inputValidationPriceCalculation;
      this.pTable.getColsItemProperties = this.positionsService.getColsItemProperties;
      this.pTable.showDialogToAdd = this.pDialogService.showDialogToAdd;
      this.pTable.isCreatePositionButtonVisible = this.positionsService.isCreatePositionButtonVisible;
      // this.pTable.inputChangeValidation = this.inputChangeValidation;
      this.pTable.setCols(this.cols);
      await this.pTable.initTable(tableValues as OrderPositionItem[]|DeliveryNotePositionItem[]|InvoicePositionItem[]|
        PricelistSales[]);
    } else {
      console.log('initializeTableViews - unsupported secondaryRefTable or pTable is not set...', this.secondaryRefTable);
    }
  }

  /**
   * load form data and show form (assign model and fields to the formly form)
   *
   * @param secondaryRefTable
   * @param tablePrimaryColumn
   * @param tablePrimaryValue
   * @param formSecondColumn
   * @param formSecondValue
   * @param createNewItemMode
   * @param subTabName
   * @param existsTableData
   */
  async loadFormData(secondaryRefTable: string, tablePrimaryColumn: string, tablePrimaryValue: string,
                     formSecondColumn: string, formSecondValue: string, createNewItemMode: boolean,
                     subTabName: SubTabGroupTabNames, existsTableData: boolean): Promise<void> {
    this.initializeTabGroupForm();
    this.initializePositionsService();
    this.initializePDialogService();
    await this.tabGroupFormService.getFormDataLogic(secondaryRefTable,
      tablePrimaryColumn, tablePrimaryValue, formSecondColumn, formSecondValue, createNewItemMode, subTabName,
      existsTableData);
    // positions flags may have changed, so update positions service
    this.initializePositionsService();
  }

  /**
   * init secondary tables: customers addresses or orders/del-notes/invoices position tables
   *
   * @param tabGroupName
   * @param tableHeader
   * @param tableValues
   * @param customerType
   * @private
   */
  private async initSecondaryTables(tabGroupName: SubTabGroupTabNames, tableHeader: string, tableValues: {},
                                    customerType: CustomersTypes):
    Promise<void> {
    if ((tabGroupName === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_TITLE) ||
      (tabGroupName === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV_TITLE)) {
      await this.setAddressesPositionsAndTableData(tabGroupName, tableHeader, tableValues, customerType);
    }
    if (tabGroupName === this.CONSTANTS.REFTABLE_INVOICE_POSITIONS_TITLE) {
      this.helperService.removeElmsFromArr(this.displayedColumns,
        ['ORDERS_NUMBER', 'DELIVERY_NOTES_NUMBER']);
    }
  }

  /**
   * set (customer or partner) addresses positions and table data
   *
   * @param tabGroupName - ADDRESS_DELIVERIES or ADDRESS_INVOICES
   * @param tableHeader
   * @param tableValues
   * @param customerType
   * @private
   */
  private async setAddressesPositionsAndTableData(tabGroupName: string, tableHeader: string, tableValues: {},
                                                  customerType: CustomersTypes) {
    let tablePrimaryColumn: string = undefined;
    let selOrderPositionNumber: string = undefined;
    const isDLVMode: boolean = (tabGroupName === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_TITLE);
    if (isDLVMode) {
      this.addrDLVPositionsItems = <CustomersAddr[]>tableValues;
    } else {
      this.addrINVPositionsItems = <CustomersAddr[]>tableValues;
    }
    if (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) {
      tablePrimaryColumn = localStorage.getItem(this.CONSTANTS.LS_SEL_CUSTOMERS_NUMBER);
      selOrderPositionNumber = (isDLVMode) ?
        localStorage.getItem(this.CONSTANTS.LS_SEL_CUSTOMER_ADDRESSES_DLV_ID) :
        localStorage.getItem(this.CONSTANTS.LS_SEL_CUSTOMER_ADDRESSES_INV_ID);
    } else if (this.refTable === this.CONSTANTS.REFTABLE_PARTNERS) {
      tablePrimaryColumn = localStorage.getItem(this.CONSTANTS.LS_SEL_PARTNER_NUMBER);
      selOrderPositionNumber = (isDLVMode) ?
        localStorage.getItem(this.CONSTANTS.LS_SEL_PARTNER_ADDRESSES_DLV_ID) :
        localStorage.getItem(this.CONSTANTS.LS_SEL_PARTNER_ADDRESSES_INV_ID);
    } else if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) {
      tablePrimaryColumn = this.selTableRow[this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN] ?
        this.selTableRow[this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN] : tablePrimaryColumn;
    } else if (this.refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES) {
      tablePrimaryColumn = this.selTableRow[this.CONSTANTS.REFTABLE_DELIVERY_NOTES_CUS_COLUMN] ?
        this.selTableRow[this.CONSTANTS.REFTABLE_DELIVERY_NOTES_CUS_COLUMN] : tablePrimaryColumn;
    } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      tablePrimaryColumn = this.selTableRow[this.CONSTANTS.REFTABLE_INVOICE_CUS_COLUMN] ?
        this.selTableRow[this.CONSTANTS.REFTABLE_INVOICE_CUS_COLUMN] : tablePrimaryColumn;
    }
    await this.initTableData(tableHeader, tableValues,
      (isDLVMode) ? this.addrDLVPositionsItems : this.addrINVPositionsItems,
      tablePrimaryColumn, selOrderPositionNumber, customerType);
    this.helperService.removeElmsFromArr(this.displayedColumns,
      ['ID', 'ADDRESS_TYPE', 'CUSTOMERS_NUMBER', 'ADDRESS_COMMENT']);
  }

  /**
   * load taxation from customer address table via given selected table row or referral table name
   *
   * @param refTable
   * @param selTableRow
   * @param tablePrimaryColumn
   * @param tablePrimaryValue
   * @private
   */
  private async loadTaxation(refTable: string, selTableRow: TabGroupModel, tablePrimaryColumn: string,
                             tablePrimaryValue: string): Promise<{ result: boolean, taxation: number }> {
    let result: boolean = false;
    let taxation: number = undefined;
    if (refTable !== this.CONSTANTS.REFTABLE_ORDERS && refTable !== this.CONSTANTS.REFTABLE_INVOICE) {
      console.log('ERROR: refTable is not supported!');
      return {result: result, taxation: taxation};
    }
    if (!selTableRow) {
      console.log('ERROR: selTableRow is undefined!');
      return {result: result, taxation: taxation};
    }
    let primaryKey: string;
    let primaryValue: string;
    // invoice => INVOICES_CUSTOMER
    // @ToDo: if order item is selected, taxation will be loaded. but if customers/partners view is selected, taxation
    //    is not loaded, because customer table didn't have CUSTOMER_ADDRESSES_ID_INVOICE column
    if (refTable === this.CONSTANTS.REFTABLE_ORDERS) {
      if (!selTableRow['CUSTOMER_ADDRESSES_ID_INVOICE']) {
        this.showErrorMessage(this.errorMessage.replace('%s',
          this.translatePipe.transform('CUSTOMER_ADDRESSES_ID_INVOICE')));
        return {result: result, taxation: taxation};
      }
      primaryKey = selTableRow['CUSTOMER_ADDRESSES_ID_INVOICE'] ?
        'CUSTOMER_ADDRESSES_ID_INVOICE' : tablePrimaryColumn;
      primaryValue = selTableRow['CUSTOMER_ADDRESSES_ID_INVOICE'] ?
        selTableRow['CUSTOMER_ADDRESSES_ID_INVOICE'] : tablePrimaryValue;
    }
    if (refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      if (!selTableRow['INVOICES_CUSTOMER']) {
        this.showErrorMessage(this.errorMessage.replace('%s',
          this.translatePipe.transform('INVOICES_CUSTOMER')));
        return {result: result, taxation: taxation};
      }
      primaryKey = selTableRow['INVOICES_CUSTOMER'] ? 'INVOICES_CUSTOMER' : tablePrimaryColumn;
      primaryValue = selTableRow['INVOICES_CUSTOMER'] ? selTableRow['INVOICES_CUSTOMER'] : tablePrimaryValue;
    }
    // load taxation from customer address
    let taxDbData = await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_TAXATION_RELATIONS,
      ViewQueryTypes.PURE_SELECT, primaryKey, primaryValue);
    if (taxDbData && taxDbData['table'] && taxDbData['table'][1] && taxDbData['table'][1][0] &&
      taxDbData['table'][1][0]['TAXRATE']) {
      taxation = parseFloat(taxDbData['table'][1][0]['TAXRATE']);
      result = true;
    } else {
      this.form?.resetForm();
      this.showErrorMessage(this.errorMessage.replace('%s', this.translatePipe.transform('TAXATION')));
    }
    return {result: result, taxation: taxation};
  }

  /**
   * return released state for given referral table name.
   * if referral table was not found, returns false.
   *
   * @param refTable
   */
  isReleased(refTable: string): boolean {
    switch (refTable) {
      case(this.CONSTANTS.REFTABLE_ORDERS) :
        return this.tabGroupFormService.orderReleaseFlag;
      case(this.CONSTANTS.REFTABLE_DELIVERY_NOTES) :
        return this.tabGroupFormService.deliveryNoteReleaseFlag;
      case(this.CONSTANTS.REFTABLE_INVOICE) :
        return this.tabGroupFormService.invoiceReleaseFlag;
    }
    return false;
  }

  /**
   * init table data for customer addresses and orders/dlv/inv positions
   *
   * @param tableHeader
   * @param tableValues
   * @param positionsItems
   * @param selCustomerNumber
   * @param selOrderPositionNumber
   * @param customerType
   * @private
   */
  private async initTableData(tableHeader: string, tableValues: {}, positionsItems: any | CustomersAddr[] | OrderPositionItem[] |
                                DeliveryNotePositionItem[] | InvoicePositionItem[],
                              selCustomerNumber: undefined | string,
                              selOrderPositionNumber: undefined | string, customerType: CustomersTypes) {
    this.initializeCustomerAddressesService();
    if (tableHeader && tableValues) {
      positionsItems = (tableValues) ? tableValues : undefined;
      if (this.secondaryRefTable === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV) {
        await this.customerAddressesService.setAddressTableClick(CustomerAddressTypes.DLV,
          this.customAddrDLVTableComponent, positionsItems, selOrderPositionNumber, customerType, selCustomerNumber);
      } else if (this.secondaryRefTable === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV) {
        await this.customerAddressesService.setAddressTableClick(CustomerAddressTypes.INV,
          this.customAddrINVTableComponent, positionsItems, selOrderPositionNumber, customerType, selCustomerNumber);
      } else {
        // Prepare position items: orders, delivery notes, invoices
        if (tableHeader) {
          this.displayedColumns = (<string>tableHeader).split(',');
          let selectionIndex = 0;
          if (positionsItems) {
            let selCustomerFound = false;
            if ((selCustomerNumber !== undefined) && (selCustomerNumber !== 'undefined') && selCustomerNumber) {
              for (let item in positionsItems) {
                if ((positionsItems[item].ID && (positionsItems[item].ID === parseInt(selOrderPositionNumber))) ||
                  (positionsItems[item].ITMNUM && (positionsItems[item].ITMNUM === selOrderPositionNumber))) {
                  selectionIndex = this.selectTableItem(selectionIndex, item, this.allowMultiSelect);
                  selCustomerFound = true;
                  break;
                }
                selectionIndex++;
              }
            }
            if (!selCustomerFound) {
              selectionIndex = 0;
              const initialSelection = [positionsItems[selectionIndex]];
              this.selectionModel = new SelectionModel<TableItem>(this.allowMultiSelect, initialSelection);
            }
          }
        }
      }
    } else {
      console.log('tableDbData is empty!');
    }
  }

  /**
   * set new item mode
   *
   * @param flag
   */
  public setNewItem(flag: boolean): void {
    this.resetNewModes();
    // Workaround to solve Customer Addresses bug: create new address and try to update it right after it.
    // There is no 'ID' field in the form. => because the form config is already set, patchValues will be called.
    // By resetting form configs, force to append form config instead of patching it...
    // this.resetFormConfigs();
    if (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) {
      this.newCustomerMode = flag;
    } else if (this.refTable === this.CONSTANTS.REFTABLE_PARTNERS) {
      this.newCustomerMode = flag;
    } else if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) {
      this.newOrderMode = flag;
    } else if (this.refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES) {
      this.newDeliveryNoteMode = flag;
    } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      this.newInvoiceMode = flag;
    }
  }

  /**
   * get new item flag
   */
  public getNewItemFlag(): boolean {
    if (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) {
      return this.newCustomerMode;
    } else if (this.refTable === this.CONSTANTS.REFTABLE_PARTNERS) {
      return this.newCustomerMode;
    } else if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) {
      return this.newOrderMode;
    } else if (this.refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES) {
      return this.newDeliveryNoteMode;
    } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      return this.newInvoiceMode;
    }
  }

  public async getCustomerFormData() {
    await this.getFormData(SubTabGroupTabNames.CUSTOMER_DETAILS);
  }

  public async getOrderFormData() {
    await this.getFormData(SubTabGroupTabNames.ORDER_DETAILS);
  }

  public async getInvoiceFormData() {
    await this.getFormData(SubTabGroupTabNames.INVOICE_DETAILS);
  }

  /**
   * get current item number from local storage
   *
   * @private
   */
  private getCurrentItemNumber(): undefined | string {
    let itemNumber: undefined | string;
    if (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) {
      itemNumber = localStorage.getItem(this.CONSTANTS.LS_SEL_CUSTOMERS_NUMBER);
    } else if (this.refTable === this.CONSTANTS.REFTABLE_PARTNERS) {
      itemNumber = localStorage.getItem(this.CONSTANTS.LS_SEL_PARTNER_NUMBER);
    } else if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) {
      itemNumber = localStorage.getItem(this.CONSTANTS.LS_SEL_ORDERS_CUST_OR_PART_NUMBER);
    } else if (this.refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES) {
      itemNumber = localStorage.getItem(this.CONSTANTS.LS_SEL_DLV_NOTES_CUST_OR_PART_NUMBER);
    } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      itemNumber = localStorage.getItem(this.CONSTANTS.LS_SEL_INVOICE_CUST_OR_PART_NUMBER);
    } else if (this.refTable === this.CONSTANTS.REFTABLE_COMMENTS) {
      itemNumber = localStorage.getItem(this.CONSTANTS.LS_SEL_COMMENT_CUST_OR_PART_NUMBER);
    }
    return itemNumber;
  }

  /**
   * customers - create new address item
   *
   * @param addressType
   */
  async createAddressItem(addressType: CustomerAddressTypes) {
    this.resetNewModes();
    if (addressType === CustomerAddressTypes.DLV) {
      this.newCustomerAddrDLVMode = true;
      if (this.selTableRow) {
        await this.getFormData(SubTabGroupTabNames.ADDRESS_DELIVERIES);
        // @ToDo: check if form is set...
        this.tabGroupFormService.addressCountryNameChange();
      } else {
        console.log('ERROR - this.selTableRow IS NOT SET !!!');
      }
    } else if (addressType === CustomerAddressTypes.INV) {
      this.newCustomerAddrINVMode = true;
      if (this.selTableRow) {
        await this.getFormData(SubTabGroupTabNames.ADDRESS_INVOICES);
        // @ToDo: check if form is set...
        this.tabGroupFormService.addressCountryNameChange();
      } else {
        console.log('ERROR - this.selTableRow IS NOT SET !!!');
      }
    }
    console.log('createAddrItem... finished... ', this.newCustomerAddrDLVMode);
  }

  /**
   * Save/Update data
   */
  onCustomerFormSubmit() {
    this.save();
  }

  onCustomersAddrFormSubmit() {
    this.save();
  }

  async onOrderPositionsFormSubmit() {
    let tableValue = this.pTable.pTable._value; // this.opDataTable._value
    this.updatedOrderPositionsRows = this.pTable.updatedPositionsRows;
    let saveResultData: {result, message} = await this.saveService.saveOrderPositions(this.pTable.positionsWithId,
      this.updatedOrderPositionsRows, tableValue, this.selTableRow['ORDERS_NUMBER']);
    this.evaluateResults(saveResultData);
  }

  /**
   * Save method for views: customers, both customers addresses dlv/inv, orders, orders positions (only update),
   * delivery notes, delivery notes positions (only update), invoices
   */
  async save() {
    this.setIsLoadingResults(true);
    if (!this.tabsService.selCurrentTabGroupName) {
      this.tabsService.getCurrentTabNames(this.refTable, undefined, undefined);
    }
    const __ret = this.getFormValuesAndFields();
    let formValues: TabGroupModel = __ret.formValues;
    let fields: FormlyFieldConfig[] = __ret.fields;
    let saveResultData: {result: boolean, message: string, refTable: string } =
      await this.formService.saveForm({formValues: formValues, fields: fields});
    this.evaluateResults({ result: saveResultData.result, message: saveResultData.message });
  }

  /**
   * evaluate save result. show message and refresh table view.
   *
   * @param saveResultData
   * @private
   */
  private evaluateResults(saveResultData: { result: boolean, message: string }) {
    if (saveResultData) {
      if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS || this.refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES
        || this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
        this.resetPositionsButtons(saveResultData.result);
        this.disableCreateDeliveryNoteButton(saveResultData.result);
        this.disableCreateInvoiceButton(saveResultData.result);
      }
      if (saveResultData.result) {
        // this.selectTab(this.ordersTitle, this.orderPositionsTitle); !!! for update orders...
        this.messagesService.showSuccessMessage(saveResultData.message);
      } else {
        this.messagesService.showErrorMessage((saveResultData.message) ?
          saveResultData.message : 'ERROR_DURING_SAVING');
      }
    } else {
      this.messagesService.showErrorMessage('ERROR_DURING_SAVING');
    }
    this.refreshTableViews();
  }

  /**
   * get formly form values and fields
   *
   * @private
   */
  public getFormValuesAndFields(): {formValues: TabGroupModel, fields: FormlyFieldConfig[]} {
    let formValues: TabGroupModel;
    let fields: FormlyFieldConfig[];
    if (this.form) {
      // Workaround for having disabled field in values:
      // @https://stackoverflow.com/questions/40148102/angular-2-disabled-controls-do-not-get-included-in-the-form-value
      formValues = this.form.form.getRawValue();
      fields = this.form.formlyFieldConfig;
    }
    return {formValues, fields};
  }

  /**
   * reset positions buttons
   *
   * @param overwriteCurrent
   * @private
   */
  private resetPositionsButtons(overwriteCurrent: boolean) {
    if (overwriteCurrent) {
      // this.orderPosition = null;
      this.displayDialog = false;
      this.newOrderPosition = false;
    }
    this.tabGroupFormService.disableSaveButton(true);
    this.disableAllocateButton(true);
    this.toggleFullEditMode();
  }

  /**
   * create a delivery note manually by user - used at click on button 'Lieferschein erstellen'
   * Tickets: SOAS-17, SOAS-27, SOAS-29
   */
  async createDeliveryNote() {
    this.setIsLoadingResults(true);
    this.disableCreateDeliveryNoteButton(true);
    this.disableCreateInvoiceButton(true);
    let saveResultData: { result: boolean, message: string } =
      await this.saveService.createDeliveryNote(this.refTable, this.selTableRow);
    this.evaluateResults(saveResultData);
  }

  /**
   * create a invoice manually by user - used at click on button 'Lieferschein erstellen'
   * Tickets:
   */
  async createInvoice() {
    this.setIsLoadingResults(true);
    this.disableCreateDeliveryNoteButton(true);
    this.disableCreateInvoiceButton(true);
    let saveResultData: { result, message } =
      await this.saveService.createInvoice(this.refTable, this.selTableRow as DeliveryNotes);
    this.evaluateResults(saveResultData);
  }

  /**
   * Select table item
   *
   * @param selectionIndex
   * @param item
   * @param allowMultiSelect
   */
  private selectTableItem(selectionIndex: number, item: string, allowMultiSelect: boolean) {
    selectionIndex = parseInt(item);
    if ((this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) ||
      (this.refTable === this.CONSTANTS.REFTABLE_PARTNERS)) {
      if (this.cusTabGroup && (this.cusTabGroup.selectedIndex !== undefined)) {
        if (this.cusTabGroup.selectedIndex === 1) {
          this.selectTableItemHelper(this, item, selectionIndex, allowMultiSelect, this.addrDLVPositionsItems);
        } else if (this.cusTabGroup.selectedIndex === 2) {
          this.selectTableItemHelper(this, item, selectionIndex, allowMultiSelect, this.addrINVPositionsItems);
        }
      }
    } else if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS ||
      this.refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES ||
      this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      this.selectTableItemHelper(this, item, selectionIndex, allowMultiSelect, this.pTable.positionsWithId);
    }
    // else if (this.refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES) {
    //   this.selectTableItemHelper(this, item, selectionIndex, allowMultiSelect, this.pTable.positionsWithId);
    // } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
    //   this.selectTableItemHelper(this, item, selectionIndex, allowMultiSelect, this.invoicePositionsItems);
    // }
    return selectionIndex;
  }

  /**
   * Select Table Item Helper
   *
   * @param self
   * @param item
   * @param selectionIndex
   * @param allowMultiSelect
   * @param positionsItems
   */
  private selectTableItemHelper(self, item: string, selectionIndex: number, allowMultiSelect: boolean, positionsItems) {
    if ((self.selTableRow === undefined) && positionsItems) {
      self.selTableRow = positionsItems[item];
    }
    const initialSelection = [positionsItems[selectionIndex]];
    // @ts-ignore
    self.selectionModel = new SelectionModel<TableItem>(allowMultiSelect, initialSelection);
  }

  /**
   * refresh table views
   *
   * @private
   */
  private refreshTableViews() {
    this.tabGroupFormService.disableSaveButton(true);
    this.disableAllocateButton(true);
    this.disableCreateDeliveryNoteButton(true);
    this.disableCreateInvoiceButton(true);
    this.refreshDetails();
    this.setIsLoadingResults(false);
  }

  /**
   * Disable or enable allocate button
   *
   * @param disable: boolean - if true - disable allocate button
   */
  disableAllocateButton(disable: boolean) {
    if (this.allocateButton) {
      this.allocateButton.nativeElement.disabled = disable;
    }
  }

  /**
   * Order/Delivery-Note/Invoice Positions - Manage table form cancel button click
   */
  onTableFormCancel() {
    // this.orderPositionsEditableFlag = false;
    this.tabGroupFormService.disableSaveButton(true);
    if (this.resetState === false) {
      // Todo: Manage refresh of the order positions (stay at positions view)
      // this.custRefreshTable();
      // this.emptyFormAndRedirect();
      this.refreshTableViews();
      this.resetState = true;
    } else {
      this.resetForm();
    }
    // this.orderPosition = null;
    // this.initPositionsTable();
    // this.opDataTable.reset();
  }

  /**
   * Toggle full edit mode: Edit order positions 'ASSIGN_QTY'
   */
  toggleFullEditMode() {
    this.fullEditMode = !this.fullEditMode;
    if (this.fullEditMode === false) {
      this.tabGroupFormService.disableSaveButton(true);
    }
    // ToDo: Manage staying on current tab at view refresh.
    // this.refreshTableViews();
  }

  /**
   * Reset new modes
   */
  public resetNewModes() {
    this.newItemMode = false;
    this.newCustomerMode = false;
    this.newCustomerAddrDLVMode = false;
    this.newCustomerAddrINVMode = false;
    this.newOrderMode = false;
    this.newOrderPosition = false;
    this.newInvoicePosition = false;
    this.newOrderPositionMode = false;
    this.newDeliveryNoteMode = false;
    this.newInvoiceMode = false;
    // Workaround to disable form fields at reload
    this.tabGroupFormService.formDataAvailableFlag = false;
  }

  /**
   * Empty forms
   *
   * @param full
   */
  public emptySelTableRow(full = true) {
    if (full) {
      this.selTableRow = undefined;
    }
  }

  /**
   * Manage close of the form view
   */
  async close() {
    // ToDo: Manage close of the form for all tables
    if (this.form) {
      this.form.resetForm();
    }
    if (this.newOrderPositionMode) {
      this.resetNewModes();
      if (this.selTableRow) {
        await this.getFormData(SubTabGroupTabNames.ORDER_POSITIONS);
      } else {
        this.refreshTable();
      }
    } else if (this.newOrderMode) {
      this.resetNewModes();
      this.refreshTable(false);
    } else if (this.newCustomerMode) {
      this.resetNewModes();
      if (this.selTableRow) {
        // if select row is set, load this item
        this.refreshDetails();
      } else {
        // otherwise load main table only
        this.refreshTable();
      }
    } else if (this.newCustomerAddrDLVMode) {
      this.resetNewModes();
      if (this.selTableRow) {
        await this.getFormData(SubTabGroupTabNames.ADDRESS_DELIVERIES);
      }
    } else if (this.newCustomerAddrINVMode) {
      this.resetNewModes();
      if (this.selTableRow) {
        await this.getFormData(SubTabGroupTabNames.ADDRESS_INVOICES);
      }
    } else {
      this.resetNewModes();
      // Do not call resetForm. Because otherwise custom-table fetch.next() would not load data properly
      // this.resetSelection();
      await this.tableDataService.removeAllTableLocks(true, '', '');
      this.refreshTable();
    }
  }

  /**
   * Remove from local storage all order selected items (key/value)
   * @private
   */
  private lsRemORD() {
    localStorage.removeItem(this.CONSTANTS.LS_SEL_ORDERS_NUMBER);
    localStorage.removeItem(this.CONSTANTS.LS_SEL_ORDERS_POSITION_ID);
    localStorage.removeItem(this.CONSTANTS.LS_SEL_ORDERS_CUST_OR_PART_NUMBER);
  }

  /**
   * Remove from local storage all delivery note selected items (key/value)
   * @private
   */
  private lsRemDLN() {
    localStorage.removeItem(this.CONSTANTS.LS_SEL_DLV_NOTES_NUMBER);
    localStorage.removeItem(this.CONSTANTS.LS_SEL_DLV_NOTES_POSITION_ID);
    localStorage.removeItem(this.CONSTANTS.LS_SEL_DLV_NOTES_CUST_OR_PART_NUMBER);
  }

  /**
   * Remove from local storage all invoice selected items (key/value)
   * @private
   */
  private lsRemINV() {
    localStorage.removeItem(this.CONSTANTS.LS_SEL_INVOICE_NUMBER);
    localStorage.removeItem(this.CONSTANTS.LS_SEL_INVOICE_POSITION_ID);
    localStorage.removeItem(this.CONSTANTS.LS_SEL_INVOICE_CUST_OR_PART_NUMBER);
  }

  /**
   * Set selected table row (custom
   * @param selTableRow
   */
  setSelectedTableRow(selTableRow: TabGroupModel) { // undefined | Customer | Orders | DeliveryNotes | Invoices
    this.resetNewModes();
    this.selTableRow = selTableRow;
  }

  /**
   * Bind update view function, that can be call from p-dialog, after an item was saved
   */
  get updateViewFunc() {
    return this.updateView.bind(this);
  }

  /**
   * refresh table views of this class, after p-dialog item was successfully saved to db
   */
  async updateView() {
    await this.showTableFormData(undefined, undefined);
    this.refreshTableViews();
    if (this.pDialogComponent.savedState) {
      this.pDialogComponent.savedState = false;
      this.messagesService.showSuccessMessage(this.translatePipe.transform('POSITIONS') + ': ' +
        this.translatePipe.transform('SAVEDSUCCESS'));
    }
  }

  private showErrorMessage(msg: string) {
    this.messagesService.showErrorMessage(msg);
    this.setIsLoadingResults(false);
  }

  get updateTableFunc() {
    return this.updateTable.bind(this);
  }

  updateTable(selTableRow) {
    this.emptySelTableRow();
    this.newItemMode = false; // newCustomerMode
    this.selTableRow = selTableRow;
    // ToDo: Manage workaround for loop at customer addresses view...
    // this.showTableFormData(undefined, undefined, function () {
    //   console.log('custTableUpdate - callback........');
    // });
    this.refreshTableViews();
  }

  get createTableFunc() {
    return this.createTable.bind(this);
  }

  createTable() {
    // this.createAddrItem('DLV');
  }

  /**
   * Delete selected delivery note
   */
  deleteDeliveryNote() {
    console.log('deleteDeliveryNote');
    let primaryKey: string = this.CONSTANTS.REFTABLE_DELIVERY_NOTES_COLUMN;
    let primaryValue: string = this.selTableRow[primaryKey];
    let secondaryKey: string = this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_COLUMN;
    let secondaryValue: string = this.selTableRow[secondaryKey];
    let userRole: string = localStorage.getItem(this.CONSTANTS.LS_ROLE);
    let deleteMessage = this.translatePipe.transform('DELETE_TITLE');
    let deleteTitle = deleteMessage.replace('%s', this.translatePipe.transform('DELIVERY_NOTE'));
    deleteMessage = deleteMessage.replace('%s', this.translatePipe.transform('DELIVERY_NOTE') +
      ' ' + '\"' + primaryValue + ' ' + '\"');
    this.confirmationService.confirm({
      header: deleteTitle,
      message: deleteMessage,
      acceptLabel: this.translatePipe.transform('DIALOG_YES'),
      rejectLabel: this.translatePipe.transform('DIALOG_NO'),
      accept: async () => {
        let dbData = await this.tableDataService.deleteTableData(this.refTable, primaryKey, primaryValue,
          secondaryKey, secondaryValue, undefined, undefined, userRole);
        if (dbData && dbData['result'] && dbData['result']['error']) {
          let errorMessage: string = this.translatePipe.transform(dbData['result']['error']).toString();
          let errorMessagePart2: string = this.translatePipe.transform('DELIVERY_NOTE').toString();
          errorMessage = errorMessage.replace('%s', errorMessagePart2);
          this.showErrorMessage(errorMessage);
        } else {
          this.messagesService.showSuccessMessage(this.translatePipe.transform('DELIVERY_NOTE') + ': ' +
            this.translatePipe.transform('DELETE_SUCCESS'));
          this.lsRemDLN();
          await this.saveService.storeLastAddedItemToLS(this.CONSTANTS.REFTABLE_DELIVERY_NOTES_TITLE,
            this.CONSTANTS.REFTABLE_DELIVERY_NOTES_COLUMN);
          await this.showTableFormData(undefined, undefined);
          this.refreshTableViews();
        }
      }
    });
  }

  public setPaginator(paginatorPerSide: number[]) {
    this.PAGINATOR_ELEMENTS_PER_SIDE = paginatorPerSide;
  }

  public setPageSize(currPageSize: number) {
    this.currPageSizeMainTable = currPageSize;
  }

  /**
   * condition if 'allocate' button should be visible at order positions view
   */
  public isAllocateButtonVisible(): boolean {
    return Boolean((!this.tabGroupFormService.orderReleaseFlag && !this.tabGroupFormService.formDisabledFlag) &&
      (this.pTable && this.pTable.positionsWithId &&
        this.pTable.positionsWithId.length));
  }

  /**
   * condition if 'save' button should be visible at order positions view
   */
  public isSaveButtonVisible(): boolean {
    return Boolean((!this.tabGroupFormService.orderReleaseFlag && !this.tabGroupFormService.formDisabledFlag) &&
      (this.pTable && this.pTable.positionsWithId &&
        this.pTable.positionsWithId.length));
  }

  /**
   * try to allocate incomplete orders positions - used at click on button 'allocate'
   *
   * Tickets: SOAS-17
   */
  async onTableFormAllocate() {
    this.setIsLoadingResults(true);
    this.disableAllocateButton(true);
    this.tabGroupFormService.disableSaveButton(true);
    let updateDataResult: { success: boolean, message: string } = await this.tableDataService.tryAllocate('CHECK',
      {ordersNumber: this.selTableRow['ORDERS_NUMBER'], warehouse: this.selTableRow['WAREHOUSE']});
    if (updateDataResult.success) {
      this.pDialogComponent.savedState = true;
      this.updateView();
      this.disableAllocateButton(this.orderAllocatedFlag);
    } else {
      this.messagesService.showInfoMessage(this.translatePipe.transform(updateDataResult.message));
      this.disableAllocateButton(this.orderAllocatedFlag);
    }
    this.setIsLoadingResults(false);
  }

  /**
   * set a flag if results are loading. if true, an overlay and animation (mat-spinner) is shown
   *
   * @param flag
   */
  public setIsLoadingResults(flag: boolean) {
    this.isLoadingResults = flag;
  }

  /**
   * get orders positions for given orders number
   *
   * @param ordersNumber
   */
  getOrdersPositions(ordersNumber: string): Promise<{success: boolean, data: any}> {
    let resultAvailability: boolean = false;
    let resultData: any = undefined;
    let partlyDeliveryDetected: boolean = false;
    let self = this;
    return new Promise(async resolve => {
      let ordersPositionsDbData: { table: [any[string], any[]], maxRows: number, page: number } =
        await self.tableDataService.getTableDataById(self.CONSTANTS.REFTABLE_ORDERS_POSITIONS,
          ViewQueryTypes.MAIN_TABLE, 'ORDERS_NUMBER', ordersNumber);
      if (!ordersPositionsDbData) {
        this.showErrorMessage('save order: Get orders positions - ' +
          this.errorMessage.replace('%s', this.translatePipe.transform('ORDERS_NUMBER')));
        resolve({success: false, data: undefined});
      } else {
        let ordersPositions: any[] = ordersPositionsDbData['table'][1];
        if (ordersPositions) {
          resolve({success: true, data: ordersPositions});
        }
      }
    });
  }

  disableCreateDeliveryNoteButton(disable: boolean) {
    if (this.createDNButton) {
      this.createDNButton.nativeElement.disabled = disable;
    }
  }

  disableCreateInvoiceButton(disable: boolean) {
    if (this.createINVButton) {
      this.createINVButton.nativeElement.disabled = disable;
    }
  }

  /**
   * set empty model for new item mode, e.g. customer
   *
   * @param model
   */
  setEmptyModel(model: SoasModel) {
    this.emptyModel = model;
  }

  /**
   * set empty details model, e.g. customer addresses
   *
   * @param emptyModel
   */
  setEmptyDetailsModel(emptyModel: SoasModel) {
    this.emptyDetailsModel = emptyModel;
  }

  /**
   * initialize tabs service tab group items
   */
  initializeTabGroup() {
    this.tabsService.setTabGroup(this.tabGroup);
    this.tabsService.setCusTabGroup(this.cusTabGroup);
    this.tabsService.setOrdTabGroup(this.ordTabGroup);
    this.tabsService.setDelTabGroup(this.delTabGroup);
    this.tabsService.setInvTabGroup(this.invTabGroup);
    this.tabsService.setComTabGroup(this.comTabGroup);
    this.tabsService.setCdRef(this.cdRef);
  }

  /**
   * initialize TabGroup form (details) service
   */
  initializeTabGroupForm() {
    const formNewItemMode = this.newItemMode || this.newCustomerAddrDLVMode || this.newCustomerMode ||
      this.newCustomerAddrINVMode || this.newOrderMode || this.newOrderPositionMode || this.newInvoiceMode;
    this.tabGroupFormService.setRequiredParams(this.refTable, this.secondaryRefTable, this.form,
      this.selTableRow, this.positionsService, this.tabsService, this.loadService, this.pDialogService,
      this.tabGroupFormService, this.customerAddressesService,
      this.tabGroupFormService.formDataAvailableFlag, this.tabGroupFormService.formDisabledFlag,
      this.tabGroupFormService.orderReleaseFlag, this.tabGroupFormService.deliveryNoteReleaseFlag,
      this.tabGroupFormService.invoiceReleaseFlag, this.tabGroupFormService.orderPayedFlag,
      this.emptyModel, this.emptyDetailsModel, this.saveButton, this.allocateButton, this.dlgSaveButton,
      this.fullEditMode, this.currencies, this.updatedOrderPositionsRows, this.orderAllocatedFlag, this.pTable,
      this.ordPosStates, this.dlvPosStates, this.invPosStates, this.countriesWithId, this.selTableRowTaxation,
      formNewItemMode, this.translatePipe, this.cols, this.dialogCols, this.displayedColumns, this.ordDlvInvStates);
  }

  initializeLoadService() {
    this.loadService.setRequiredParams(this.refTable, this.secondaryRefTable, this.tabsService,
      this.positionsService, this.selTableRow, this.newCustomerAddrDLVMode, this.newCustomerMode,
      this.newCustomerAddrINVMode, this.newOrderMode, this.newOrderPositionMode);
  }

  initializePositionsService() {
    this.positionsService.setRequiredParams(this.refTable, this.tabsService.selCurrentTabGroupName,
      this.updatedOrderPositionsRows, this.fullEditMode, this.orderAllocatedFlag, this.pTable, this.tabsService,
      this.ordPosStates, this.dlvPosStates, this.invPosStates,
      this.saveButton, this.dlgSaveButton, this.allocateButton, this.currencies, this.cols,
      this.selTableRow, this.ordDlvInvStates, this.tabGroupFormService.formDataAvailableFlag,
      this.tabGroupFormService.formDisabledFlag, this.selTableRowTaxation, this.tabGroupFormService.orderReleaseFlag);
  }

  initializePDialogService() {
    this.pDialogService.setRequiredParams(this.refTable, this.selTableRow, this.pDialogComponent, this.pTable,
      this.errorMessage, this.selectedOrderPosition, this.newOrderPosition, this.saveButton, this.dlgSaveButton,
      this.dialogCols, this.tabsService, this.currencies, this.pcurrencies, this.selTableRowTaxation,
      this.selectedOrderPosition, this.displayDialog, this.autocomplete);
  }

  initializeCustomerAddressesService() {
    this.customerAddressesService.setRequiredParams(this.secondaryRefTable, this.PAGINATOR_ELEMENTS_PER_SIDE,
      this.currPageSizeMainTable, this.tableColumnsToHide, this.addrDLVPositionsItems, this.addrINVPositionsItems,
      this.customAddrDLVTableComponent, this.customAddrINVTableComponent);
  }

  /**
   * make enum accessible in the view
   */
  get subTabGroupTabNamesEnum() {
    return SubTabGroupTabNames;
  }

  setTableColumnsToHide(columns: string[]) {
    this.tableColumnsToHide = columns;
  }

  getCustomerAddressType(type: string): CustomerAddressTypes {
    return CustomerAddressTypes[type];
  }
}
