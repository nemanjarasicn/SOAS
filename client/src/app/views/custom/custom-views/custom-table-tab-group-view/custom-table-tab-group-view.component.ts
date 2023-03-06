import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {CustomTableComponent} from '../../custom-table/custom-table.component';
import {DetailViewTabGroupComponent} from '../../../detail-view-tab-group/detail-view-tab-group.component';
import {Orders} from '../../../../models/orders';
import {Sort} from '../../custom-table/page';
import {
  ComponentViewTypes,
  ConstantsService,
  OptionsTypes,
  SoasModel,
  SubTabGroupTabNames,
  SubTabGroupTabNumbers,
  TabGroupModel,
  TabGroupTabNames,
  TabGroupTabNumbers,
  ViewQueryTypes
} from '../../../../_services/constants.service';
import {Observable, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {TableDataService} from '../../../../_services/table-data.service';
import {Router} from '@angular/router';
import {TranslateItPipe} from '../../../../shared/pipes/translate-it.pipe';
import {MessageService} from 'primeng/api';
import {FormService} from '../../../../_services/form.service';
import {HelperService} from '../../../../_services/helper.service';
import {FetchDataService} from '../../../../_services/fetch-data.service';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import {OptionsService} from "../../../../_services/options.service";

/** Custom options the configure the tooltip's default show/hide delays. */
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 100,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-custom-table-tab-group-view',
  templateUrl: './custom-table-tab-group-view.component.html',
  styleUrls: ['./custom-table-tab-group-view.component.css'],
  providers: [TranslateItPipe, MessageService,
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}],
})

/**
 * CustomTableTabGroupViewComponent - custom table tab-group view - contains the logic of the components that are using
 *
 * - on left view: table view of CustomTableComponent
 * - on right view: tab-group with 5 tabs and as sub-tabs: form or table + form or p-table
 *
 * CustomTableTabGroupViewComponent => { CustomTableComponent and DetailViewTabGroupComponent }
 *
 * Used by: OrdersComponent, DeliveryNotesComponent, InvoicesComponent, CustbtwocComponent, CustbtwobComponent
 *
 * Documentation at: /docs/create-new-component/table-tab-group/custom-table-tab-group-view.md
 */
export class CustomTableTabGroupViewComponent implements OnInit, AfterViewInit {

  // flag to start loading of this component, first if parent view is initialized...
  startLoading: boolean;

  // referral table name to identify current selected table
  refTable: string;

  // details referral tables names to identify current selected details table for each tab group item: customers,
  // orders, delivery notes, invoices
  detailsRefTables: {
    custbtwoc: string,
    custbtwob: string,
    orders: string,
    deliveryNote: string,
    invoices: string
  };

  // primary referral table column name to query table by
  primaryTableColumnName: string;
  // secondary referral table column name to query table by
  secondaryTableColumnName: string;
  // tertiary referral table column name to query table by
  tertiaryTableColumnName: string;

  // local storage keys:
  // selected item local storage key
  primaryLocalStorageKey: string;
  // selected item secondary local storage key
  secondaryLocalStorageKey: string;
  // selected item tertiary local storage key
  tertiaryLocalStorageKey: string;

  // tab-group tab to select: 0 - customers, 1 - order, 2 - delivery note, 3 - invoice, 4 - comments
  selTabGroupTab: TabGroupTabNumbers;
  // sub-tab-group tab to select: 0 - details, 1 - positions / addresses dlv, (2 - addresses inv)
  selSubTabGroupTab: SubTabGroupTabNumbers;

  // allow table multiselect: false by default
  allowMultiSelect: boolean;

  // empty main model to set at new item mode, e.g. customers
  emptyModel: SoasModel;
  // empty details model to set at new item mode, e.g. customer addresses
  emptyDetailsModel: SoasModel;

  // flag if main table view is loaded
  isMainTableViewLoaded: boolean;

  // is table visible
  tableVisible: boolean;
  // environment variable, to load global settings like sidenavopened, tablevisible
  env = environment;

  // Main table view
  @ViewChild(CustomTableComponent) tableComponent !: CustomTableComponent;
  // TabGroup view (details with sub-tabs: form or table + form or p-table)
  @ViewChild(DetailViewTabGroupComponent) tabGroupComponent !: DetailViewTabGroupComponent;

  // currently selected main table row
  selTableRow: TabGroupModel;
  // previous selected main table row
  lastSelTableRow: TabGroupModel;

  // flag for new item mode: false by default
  newItemMode: boolean;

  // main table view columns that should be displayed
  displayedColumns: string[];
  // main table column name to search by
  searchColumn: string;
  // main table additional column name to search by
  additionalSearchColumns: string;
  // main table columns to hide
  columnsToHide: string[];
  // main table default sort settings
  initialSort: Sort<SoasModel>;

  // tab-group view title name
  tabGroupName: TabGroupTabNames;
  // table view title name
  tableTitle: string;
  // create item title text
  createTitle: string;
  // create item tooltip text
  createTooltip: string;

  // detail view titles
  detailsFormTitle: SubTabGroupTabNames;

  // detail view columns that should be displayed
  detailsDisplayedColumns: string[];
  // detail view columns to hide
  detailsColumnsToHide: string[];
  // detail view column name to search by
  detailsSearchColumn: string;
  // detail view additional column name to search by
  detailsAdditionalSearchColumns: string;
  // detail view default sort settings
  detailsInitialSort: Sort<SoasModel>;

  PAGINATOR_ELEMENTS_PER_SIDE: number[];
  currPageSizeMainTable: number;
  currPageSizeDetailTable: number;

  // form options that are required...
  formOptionsToLoad: OptionsTypes[];

  // default form settings
  defaultPaymentCondition: string;
  defaultPaymentTermId: string;

  // fetch data subscription
  serviceSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private tableDataService: TableDataService,
    private router: Router,
    private CONSTANTS: ConstantsService,
    public translatePipe: TranslateItPipe,
    private optionsService: OptionsService,
    private formService: FormService,
    private helperService: HelperService,
    private fetchDataService: FetchDataService
  ) {
    this.startLoading = false;
    this.allowMultiSelect = false;
    this.resetVars();
    optionsService.setTranslatePipe(translatePipe);
    formService.setTranslatePipe(translatePipe);
    // set main table visibility by global environment setting
    this.tableVisible = this.env.tablevisible;
  }

  /**
   * Initialize the directive or component after Angular first displays the data-bound properties and sets the
   * directive or component's input properties. See details in Initializing a component or directive in this document.
   */
  ngOnInit() {
    this.PAGINATOR_ELEMENTS_PER_SIDE = this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE_BIG;
    this.currPageSizeMainTable = this.PAGINATOR_ELEMENTS_PER_SIDE[0];
    this.currPageSizeDetailTable = this.CONSTANTS.PAGINATOR_MAX_ELEMENTS_MINI;
    if (this.tableComponent) {
      this.tableComponent.setPaginator(this.PAGINATOR_ELEMENTS_PER_SIDE);
      this.tableComponent.setPageSize(this.currPageSizeMainTable);
    }
    this.serviceSubscription = this.fetchDataService.getDataObs().subscribe(async (selTableData) => {
      if (this.tableComponent) {
        this.tableComponent.selectionIndex = undefined;
      }
      if (selTableData) {
        if (selTableData.refTableName === ComponentViewTypes.DynamicForm) {
          // If user click on 'create new item' button and not the first tab (details) is selected.
          // First tab will be selected and then new form data loaded here.
          if (this.newItemMode) {
            await this.loadNewFormData();
          } else {
            await this.setDetailView();
          }
        } else if (selTableData.refTableName === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV ||
          selTableData.refTableName === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV) {
          await this.loadCustomerAddressesItem(selTableData);
        } else {
          if (selTableData.selTableRow) {
            this.selTableRow = selTableData.selTableRow as TabGroupModel;
            await this.tableUpdate();
          }
        }
      } else {
        this.selTableRow = undefined;
      }
    });
  }

  /**
   * after view is initialized, setup table and then form by loading data from database
   */
  public ngAfterViewInit(): void {
    if (this.startLoading) {
      this.isMainTableViewLoaded = this.tableComponent ? this.setupTableView() : false;
    }
  }

  ngOnDestroy() {
    // reset selected referral table title name
    this.formService.setSeItemRefTableTitle(undefined);
    // unsubscribe subscription
    if (this.serviceSubscription && !this.serviceSubscription.closed) {
      this.serviceSubscription.unsubscribe();
    }
  }

  public resetVars(): void {
    this.isMainTableViewLoaded = false;
    this.selTableRow = undefined;
    // this.tabGroupName = TabGroupTabNames.CUSTOMER; // this.detailsFormTitle;
    this.newItemMode = false;
    const lsRefTable = localStorage.getItem(this.CONSTANTS.LS_SEL_DETAILS_REF_TABLES);
    this.detailsRefTables = lsRefTable ? JSON.parse(lsRefTable) : this.CONSTANTS.LS_SEL_DETAILS_REF_TABLES_JSON_TYPES;
    if(!lsRefTable) localStorage.setItem(this.CONSTANTS.LS_SEL_DETAILS_REF_TABLES, JSON.stringify(this.detailsRefTables));
    if (this.tableComponent) {
      this.tableComponent.setIsTableClicked(false);
      this.tableComponent.setDisabledCreateButton(true);
    }
  }

  /**
   * set table view by loading table data via observable. then load detail view data (form or p-table)
   *
   * @private
   */
  private setupTableView(): boolean {
    // set currently selected referral table name to the local storage
    localStorage.setItem(this.CONSTANTS.LS_SEL_REF_TABLE, this.refTable);
    if (this.tableComponent) {

      this.tableComponent.setIsTableClicked(false);
      this.tableComponent.setIsLoadingResults(true);

      this.displayedColumns = this.helperService.removeElmsFromArr(this.displayedColumns, this.columnsToHide);

      const selItem: string = localStorage.getItem(this.primaryLocalStorageKey);
      const primaryValue: string = selItem ? selItem : undefined;
      const __ret = this.getCustomersSecondaryParams();
      const secondaryKey: string = __ret.secondaryKey;
      const secondaryValue: string = __ret.secondaryValue;
      this.tableComponent.setPageParams(this.refTable, this.primaryTableColumnName, primaryValue,
        secondaryKey, secondaryValue, this.searchColumn, this.additionalSearchColumns,
        this.displayedColumns, ViewQueryTypes.MAIN_TABLE);
      this.tableComponent.setInitialSort(this.initialSort);
      this.tableComponent.setPaginator(this.PAGINATOR_ELEMENTS_PER_SIDE);
      this.tableComponent.setPageSize(this.currPageSizeMainTable);
      const self = this;
      this.tableComponent.setClickedRow = async function (tableRow: Orders, $event: Event) {
        await self.tableClickLogic(tableRow, $event);
      };

      this.tableComponent.setLabels(this.tableTitle, this.createTitle);
      this.tableComponent.setShowCreateButton(this.isNewItemModeAllowed());

      const selOrdersNumber = localStorage.getItem(this.primaryLocalStorageKey);
      this.tableComponent.setPaginatedDataSource(this.currPageSizeMainTable);

      // Override detail view tab selected index change function, to have callback to enable table click
      this.tabGroupComponent.selectedIndexChange = async function (tabIndex: number) {
        // if (self.isMainTableViewLoaded) {
        //   self.setLSItemBySelSubTabGroup(subTabIndex);
        // }
        await self.onSelectedIndexChange(self, tabIndex);
      }

      this.tabGroupComponent.selectedSubIndexChange = async function (subTabIndex: number) {
        if (self.isMainTableViewLoaded) {
          self.setLSItemBySelSubTabGroup(subTabIndex);
        }
        await self.onSelectedIndexChange(self, self.selTabGroupTab, subTabIndex);
      }

      // load data for table via data source observable. loaded data will be processed in
      // serviceSubscription > refreshView, where detail view data will be loaded via setDetailView()
      let obsData: Observable<any> = this.tableComponent.getDataSource();
      obsData.subscribe(async (data: any) => {

        // load form options from form service, before form is loaded
        await this.optionsService.initializeOptions(this.formOptionsToLoad, this.refTable);

        this.tableComponent.setCurrencies(this.optionsService.currencies);
        this.tableComponent.setCurrenciesWithId(this.optionsService.currenciesWithId);

        // after options are loaded, load detail view form or p-table data
        this.setOptionsData();
        // set selection
        this.selTableRow = await this.tableComponent.setTableItems(data, this.primaryTableColumnName, selOrdersNumber,
          false);
        this.tableComponent.setSelTableRow(this.selTableRow);

        // set default payment options settings
        this.tabGroupComponent.tabGroupFormService.setDefaultPaymentCondition(this.defaultPaymentCondition);
        this.tabGroupComponent.tabGroupFormService.setDefaultPaymentTermId(this.defaultPaymentTermId);

        return true;
      });

    } else {
      return false;
    }
  }

  /**
   * on selected index change
   *
   * @param self
   * @param tabIndex
   * @param subTabIndex
   * @private
   */
  private async onSelectedIndexChange(self: this, tabIndex: number, subTabIndex: number = undefined) {
    if (!subTabIndex) {
      await this.selectSubTabGroupByLSItem();
      subTabIndex = this.selSubTabGroupTab;
    }
    // only if data (table+form) is already loaded...
    if (self.isMainTableViewLoaded) {
      // update tab ans sub-tab indexes
      self.setTabToSelect(tabIndex);
      self.setSubTabToSelect(subTabIndex);
      // update selected tab group names
      self.tabGroupComponent.getCurrentTabNames(tabIndex, subTabIndex);
      // reset new item mode, only if user is on other tab, then the viewed one (refTable).
      if (self.tabGroupComponent.tabsService.shouldResetNewItemMode(self.refTable, tabIndex, subTabIndex)) {
        self.newItemMode = false;
        self.tabGroupComponent.resetNewModes();
      }
      self.lastSelTableRow = undefined;
      self.tableComponent.setIsLoadingResults(true);
      self.tableComponent.setIsTableClicked(true);
      await self.tabGroupComponent.showTableFormData(tabIndex, subTabIndex);
      // set create button enabled, after form was completely loaded
      self.tableComponent.setDisabledCreateButton(false);
      self.tableComponent.setIsTableClicked(false);
      self.tableComponent.setIsLoadingResults(false);
    }
  }

  /**
   * get customers secondary params - as workaround to be able to select customers by type b2c/b2b
   *
   * @private
   */
  private getCustomersSecondaryParams() {
    let secondaryKey: string = '';
    let secondaryValue: string = '';
    if ((this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) || (this.refTable === this.CONSTANTS.REFTABLE_PARTNERS)) {
      secondaryKey = this.CONSTANTS.REFTABLE_CUSTOMER_CUSTOMERS_TYPE;
      secondaryValue = (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) ?
        this.CONSTANTS.CLIENT_B2C : this.CONSTANTS.CLIENT_B2B;
    }
    return {secondaryKey, secondaryValue};
  }

  /**
   * set options of main table view and detail view
   *
   * @private
   */
  private setOptionsData(): void {
    if (!this.isMainTableViewLoaded) {
      if (this.tableComponent) {
        this.tableComponent.setLabels(this.tableTitle, this.createTitle);
        // set main view options/dependencies: currencies
        this.tableComponent.setCurrencies(this.optionsService.currencies);
        this.tableComponent.setCurrenciesWithId(this.optionsService.currenciesWithId);
      }
      if (this.tabGroupComponent) {
        // set customer addresses table parameters...
        // if user is on different view (e.g. orders), then customer addresses table parameters are not set, so load
        // then parameters from constants:
        this.tabGroupComponent.customerAddressesService.setDisplayedColumns(this.detailsDisplayedColumns ?
          this.detailsDisplayedColumns : this.CONSTANTS.DEFAULT_CUSTOMER_ADDRESSES_DISPLAYED_COLUMNS);
        this.tabGroupComponent.customerAddressesService.setTableColumnsToHide(this.detailsColumnsToHide ?
          this.detailsColumnsToHide : this.CONSTANTS.DEFAULT_CUSTOMER_ADDRESSES_COLUMNS_TO_HIDE);
        this.tabGroupComponent.customerAddressesService.setSearchColumn(this.detailsSearchColumn ?
          this.detailsSearchColumn : this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN);
        this.tabGroupComponent.customerAddressesService.setAdditionalSearchColumns(this.detailsAdditionalSearchColumns ?
          this.detailsAdditionalSearchColumns : this.CONSTANTS.DEFAULT_CUSTOMER_ADDRESSES_ADDITIONAL_SEARCH_COLUMNS);
        this.tabGroupComponent.customerAddressesService.setInitialSort(this.detailsInitialSort ?
          this.detailsInitialSort : this.CONSTANTS.DEFAULT_CUSTOMER_ADDRESSES_INITIAL_SORT);

        // set detail view options/dependencies: states, payment methods and terms
        this.tabGroupComponent.setStates(this.optionsService.ordDlvInvStates);
        this.tabGroupComponent.setOrderPositionStates(this.optionsService.ordPosStates);
        this.tabGroupComponent.setDlvPositionStates(this.optionsService.dlvPosStates);
        this.tabGroupComponent.setInvPositionStates(this.optionsService.invPosStates);
        this.tabGroupComponent.setCurrencies(this.optionsService.currencies);
        this.tabGroupComponent.setPCurrencies(this.optionsService.pcurrencies);
        this.tabGroupComponent.setCountriesWithId(this.optionsService.countriesWithId);
        if (this.emptyModel && this.emptyModel instanceof Orders) {
          // Replace currency iso code with id
          this.emptyModel.CURRENCY =
            this.helperService.getCurrencyIdByIsoCode(this.optionsService.currencies, this.emptyModel.CURRENCY);
        }
        this.tabGroupComponent.setEmptyModel(this.emptyModel);
        this.tabGroupComponent.setEmptyDetailsModel(this.emptyDetailsModel);
        this.tabGroupComponent.setPaginator(this.PAGINATOR_ELEMENTS_PER_SIDE);
        this.tabGroupComponent.setPageSize(this.currPageSizeDetailTable);
        this.tabGroupComponent.resetTaxation();
      }
    }
    this.isMainTableViewLoaded = true;
    if (this.tableComponent) {
      this.tableComponent.setIsLoadingResults(false);
    }
  }

  private async tableClickLogic(tableRow: Orders, $event: Event): Promise<void> {
    // "this" here is a custom-table one !!!
    if (!this.tableComponent.getIsTableClicked()) {
      this.tableComponent.setIsLoadingResults(true);
      this.tableComponent.setIsTableClicked(true);
      this.emptyForms();
      // const rowNumber = parseInt(this.dataSource.data.findIndex(row => row === customer));
      this.newItemMode = false; // set insert(false)/update(true) customer mode
      this.selTableRow = tableRow;
      localStorage.setItem(this.primaryLocalStorageKey, tableRow[this.primaryTableColumnName]);
      if (this.secondaryTableColumnName && this.secondaryLocalStorageKey) {
        localStorage.setItem(this.secondaryLocalStorageKey, tableRow[this.secondaryTableColumnName]);
      }
      if (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) {
        localStorage.removeItem(this.CONSTANTS.LS_SEL_CUSTOMER_ADDRESSES_DLV_ID);
        localStorage.removeItem(this.CONSTANTS.LS_SEL_CUSTOMER_ADDRESSES_INV_ID);
      } else if (this.refTable === this.CONSTANTS.REFTABLE_PARTNERS) {
        localStorage.removeItem(this.CONSTANTS.LS_SEL_PARTNER_ADDRESSES_DLV_ID);
        localStorage.removeItem(this.CONSTANTS.LS_SEL_PARTNER_ADDRESSES_INV_ID);
      }
      await this.tableDataService.removeAllTableLocks(true, '', '');
      this.refreshTableViews();
    } else {
      if ($event && (typeof Event)) {
        $event.stopPropagation();
      }
    }
  }

  /**
   * set detail view, form or p-table
   *
   * @private
   */
  private async setDetailView(): Promise<void> {
    if (this.tabGroupComponent) {
      this.tabGroupComponent.resetTaxation();
      if (this.tabGroupComponent.customAddrDLVTableComponent) {
        this.tabGroupComponent.customAddrDLVTableComponent.setIsTableClicked(false);
        this.tabGroupComponent.customAddrDLVTableComponent.setIsLoadingResults(false);
      }
      if (this.tabGroupComponent.customAddrINVTableComponent) {
        this.tabGroupComponent.customAddrINVTableComponent.setIsTableClicked(false);
        this.tabGroupComponent.customAddrINVTableComponent.setIsLoadingResults(false);
      }
      this.tabGroupComponent.setIsLoadingResults(false);
    }
  }

  /**
   * Show form data
   *
   * @param tabToSelect
   * @param selTabRow
   * @private
   */
  private async showFormData(tabToSelect: undefined | number, selTabRow: TabGroupModel): Promise<void> {
    if (this.tabGroupComponent) {
      this.tableComponent.setIsLoadingResults(true);
      // this.tabGroupComponent.initializeTabGroup();
      this.tabGroupComponent.resetODITableItems();
      this.tabGroupComponent.setNewItem(this.newItemMode);
      this.tabGroupComponent.setRefTable(this.refTable);
      this.tabGroupComponent.setCurrencies(this.optionsService.currencies);
      this.tabGroupComponent.setPCurrencies(this.optionsService.pcurrencies);
      if (selTabRow && selTabRow[this.primaryTableColumnName] && selTabRow[this.primaryTableColumnName] !== '') {
        if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS &&
          selTabRow[this.tertiaryTableColumnName] === (this.CONSTANTS.CLIENT_B2C || this.CONSTANTS.CLIENT_B2B)) {
          localStorage.setItem(this.secondaryLocalStorageKey, selTabRow[this.secondaryTableColumnName]);
        }
        this.tabGroupComponent.setSelectedTableRow(selTabRow);
        // this.tabGroupComponent.tabsService.setOrdersDetailsFormTitle(this.translatePipe.transform(this.detailsFormTitle)
        //   + ' - ' + localStorage.getItem(this.primaryLocalStorageKey));
        if (tabToSelect === undefined) {
          if (!this.isMainTableViewLoaded) {
            this.tabGroupComponent.tabsService.selectTab(this.tableTitle);
            this.isMainTableViewLoaded = true;
          } else {
            await this.tabGroupComponent.showTableFormData(undefined, undefined);
          }
        } else {
          // check if positions tab is selected, if so reload positions data
          let subTabName: undefined | SubTabGroupTabNames;
          if (this.selTabGroupTab === TabGroupTabNumbers.CUSTOMER) {
            subTabName = (this.selSubTabGroupTab === SubTabGroupTabNumbers.DETAILS) ?
              SubTabGroupTabNames.CUSTOMER_DETAILS : (this.selSubTabGroupTab === SubTabGroupTabNumbers.ADDRESSES_DLV) ?
                SubTabGroupTabNames.ADDRESS_DELIVERIES : SubTabGroupTabNames.ADDRESS_INVOICES;
          } else if (this.selTabGroupTab === TabGroupTabNumbers.ORDER) {
            subTabName = (this.selSubTabGroupTab === SubTabGroupTabNumbers.DETAILS) ?
              SubTabGroupTabNames.ORDER_DETAILS : SubTabGroupTabNames.ORDER_POSITIONS;
          } else if (this.selTabGroupTab === TabGroupTabNumbers.DELIVERY_NOTE) {
            subTabName = (this.selSubTabGroupTab === SubTabGroupTabNumbers.DETAILS) ?
              SubTabGroupTabNames.DELIVERY_NOTES_DETAILS : SubTabGroupTabNames.DELIVERY_NOTES_POSITIONS;
          } else if (this.selTabGroupTab === TabGroupTabNumbers.INVOICE) {
            subTabName = (this.selSubTabGroupTab === SubTabGroupTabNumbers.DETAILS) ?
              SubTabGroupTabNames.INVOICE_DETAILS : SubTabGroupTabNames.INVOICES_POSITIONS;
          }
          if (subTabName) {
            await this.tabGroupComponent.getFormData(subTabName);
          } else {
            await this.tabGroupComponent.setSelectedTabIndex(this.selTabGroupTab);
          }
          this.isMainTableViewLoaded = true;
        }
        await this.selectSubTabGroupByLSItem();
      }
    }
  }

  /**
   * select sub tab group (details tabs) by local storage item of details referral table name
   *
   * @private
   */
  private async selectSubTabGroupByLSItem() {
    let detailRefTablesJSON = JSON.parse(localStorage.getItem(this.CONSTANTS.LS_SEL_DETAILS_REF_TABLES));
    switch (detailRefTablesJSON[this.refTable]) {
      case(this.CONSTANTS.REFTABLE_CUSTOMER) :
        this.selSubTabGroupTab = SubTabGroupTabNumbers.DETAILS;
        break;
      case(this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV) :
        this.selSubTabGroupTab = SubTabGroupTabNumbers.ADDRESSES_DLV;
        break;
      case(this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV) :
        this.selSubTabGroupTab = SubTabGroupTabNumbers.ADDRESSES_INV;
        break;
      case(this.CONSTANTS.REFTABLE_ORDERS) :
        this.selSubTabGroupTab = SubTabGroupTabNumbers.DETAILS;
        break;
      case(this.CONSTANTS.REFTABLE_ORDERS_POSITIONS) :
        this.selSubTabGroupTab = SubTabGroupTabNumbers.POSITIONS;
        break;
      case(this.CONSTANTS.REFTABLE_DELIVERY_NOTES) :
        this.selSubTabGroupTab = SubTabGroupTabNumbers.DETAILS;
        break;
      case(this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS) :
        this.selSubTabGroupTab = SubTabGroupTabNumbers.POSITIONS;
        break;
      case(this.CONSTANTS.REFTABLE_INVOICE) :
        this.selSubTabGroupTab = SubTabGroupTabNumbers.DETAILS;
        break;
      case(this.CONSTANTS.REFTABLE_INVOICE_POSITIONS) :
        this.selSubTabGroupTab = SubTabGroupTabNumbers.POSITIONS;
        break;
      default:
        this.selSubTabGroupTab = SubTabGroupTabNumbers.DETAILS;
        break;
    }
    await this.tabGroupComponent.setSelectedTabIndex(this.selTabGroupTab, this.selSubTabGroupTab);
  }

  /**
   * set local storage item by selected sub tab group item (details tabs)
   *
   * @private
   */
  private setLSItemBySelSubTabGroup(subTabIndex: number) {
    switch (subTabIndex) {
      case(0) :
        this.detailsRefTables[this.refTable] = this.refTable;
        break;
      case(1) :
        this.detailsRefTables[this.refTable] = (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER ||
          this.refTable === this.CONSTANTS.REFTABLE_PARTNERS) ?
          this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV : (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) ?
            this.CONSTANTS.REFTABLE_ORDERS_POSITIONS : (this.refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES) ?
              this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS : (this.refTable === this.CONSTANTS.REFTABLE_INVOICE) ?
                this.CONSTANTS.REFTABLE_INVOICE_POSITIONS : undefined;
        break;
      case(2) :
        this.detailsRefTables[this.refTable] = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV;
        break;
      default:
        this.detailsRefTables[this.refTable] = this.refTable;
        break;
    }
    localStorage.setItem(this.CONSTANTS.LS_SEL_DETAILS_REF_TABLES, JSON.stringify(this.detailsRefTables));
  }

  private async refreshView(): Promise<void> {
    if (this.tableComponent) {
      // show form data for selected table row
      if (this.selTableRow && this.selTableRow.hasOwnProperty(this.primaryTableColumnName)
        && this.selTableRow[this.primaryTableColumnName] !== '') {
        this.lastSelTableRow = this.selTableRow;
        await this.showFormData(this.selTabGroupTab, this.selTableRow);
      } else if (this.lastSelTableRow) {
        await this.showFormData(this.selTabGroupTab, this.lastSelTableRow);
      }
      this.tableComponent.setIsTableClicked(false);
      this.tableComponent.setDisabledCreateButton(false);
      this.tableComponent.setIsLoadingResults(false);
    }
  }

  /**
   * user has clicked on an item in customer addresses table, load customer addresses item
   *
   * @param selTableData
   * @private
   */
  private async loadCustomerAddressesItem(selTableData: { selTableRow; selTableIndex; refTableName }) {
    // select customers tab
    this.selTabGroupTab = TabGroupTabNumbers.CUSTOMER;
    // this.selTabGroupTab = selTableData.selTableIndex;
    this.selTableRow = selTableData.selTableRow;
    // call show form data directly, so params of initial view (e.g. orders) stay unchanged.
    await this.showFormData(this.selTabGroupTab, this.selTableRow);
    this.tableComponent.setIsTableClicked(false);
    this.tableComponent.setIsLoadingResults(false);
  }

  /**
   * Create order
   */
  async createNewItem(): Promise<void> {
    if (this.isNewItemModeAllowed() && this.tabGroupComponent) {
      this.newItemMode = true;
      this.tabGroupComponent.setRefTable(this.refTable);
      this.tabGroupComponent.resetTaxation();
      this.tabGroupComponent.getCurrentTabNames();
      this.tabGroupName = this.tabGroupComponent.getCurrentTabName();
      if (!this.tabGroupComponent.cusTabGroup || !this.tabGroupComponent.ordTabGroup ||
        !this.tabGroupComponent.delTabGroup || !this.tabGroupComponent.invTabGroup ||
        !this.tabGroupComponent.comTabGroup) {
        // initialize tab group, because may undefined... but then
        this.tabGroupComponent.initializeTabGroup();
      }
      // Workaround to load new item form data: If another tab-group tab (e.g. addresses or positions) may be selected,
      // then it is necessary to select right tab-group tab (customer- or orders-details).
      // Get selected tab (customer) and check if tab is different then current referral table name (orders).
      // If it is different, then select right tab first and then load form data over serviceSubscription.
      // Otherwise just load new form data.
      const selectedTab: undefined | TabGroupTabNumbers = this.tabGroupComponent.tabsService.getSelectedTabIndex();
      const isDifferentTabAsRefTable: boolean
        = this.tabGroupComponent.tabsService.shouldResetNewItemMode(this.refTable, selectedTab, 0);
      if (isDifferentTabAsRefTable) {
        switch (this.refTable) {
          case(this.CONSTANTS.REFTABLE_CUSTOMER) :
            this.tabGroupComponent.tabsService.selectCustomerTab();
            break;
          case(this.CONSTANTS.REFTABLE_PARTNERS) :
            this.tabGroupComponent.tabsService.selectCustomerTab();
            break;
          case(this.CONSTANTS.REFTABLE_ORDERS) :
            this.tabGroupComponent.tabsService.selectOrderTab();
            break;
          case(this.CONSTANTS.REFTABLE_INVOICE) :
            this.tabGroupComponent.tabsService.selectInvoiceTab();
            break;
          default :
            this.tabGroupComponent.tabsService.selectCustomerTab();
            break;
        }
        // this.formService.showInfoMessage('Kunden-Details Tab wurde ausgewählt.');
      } else {
        await this.loadNewFormData();
      }
    }
  }

  /**
   * load new form data - add referral table name here, if component have a new item mode
   *
   * @private
   */
  private async loadNewFormData(): Promise<void> {
    this.newItemMode = true;
    this.emptyForms();
    this.tabGroupComponent.setNewItem(this.newItemMode);
    // only for orders. reset params on client change.
    if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) {
      await this.tabGroupComponent.getOrderFormData();
      const self = this;
      this.tabGroupComponent.form.form.valueChanges.subscribe((selectedValue) => {
        self.changeClient(selectedValue);
      });
    } else if ((this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) ||
      (this.refTable === this.CONSTANTS.REFTABLE_PARTNERS)) {
      await this.tabGroupComponent.getCustomerFormData();
    } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      await this.tabGroupComponent.getInvoiceFormData();
      // const self = this;
      // this.tabGroupComponent.form.form.valueChanges.subscribe((selectedValue) => {
      //   self.changeClient(selectedValue);
      // });
    }
  }

  private resetTableSelection(): void {
    this.removeFromLS();
    this.selTableRow = undefined;
    this.lastSelTableRow = undefined;
    if (this.tableComponent) {
      this.tableComponent.setSelTableRow(this.selTableRow);
      this.tableComponent.selTableRow = this.selTableRow;
    }
  }

  /**
   * remove selection items from local storage
   *
   * @private
   */
  private removeFromLS(): void {
    localStorage.removeItem(this.primaryLocalStorageKey);
    localStorage.removeItem(this.secondaryLocalStorageKey);
  }

  /**
   * empty forms
   *
   * @private
   */
  private emptyForms(): void {
    if (this.tabGroupComponent) {
      this.tabGroupComponent.form?.resetForm();
      this.tabGroupComponent.resetODITableItems();
      this.tabGroupComponent.setNewItem(this.newItemMode);
      this.tabGroupComponent.emptySelTableRow(false);
      // for orders remove tertiary local storage key (selOrdersClient), that is set at orders new item mode,
      // to determine if client type (B2C/B2B) has changed
      if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) {
        localStorage.removeItem(this.tertiaryLocalStorageKey);
      }
    }
  }

  /** Function to call from children
   * https://stackoverflow.com/a/50585796
   **/
  get resetFormFunc() {
    return this.resetForm.bind(this);
  }

  /**
   * reset form - called via cancel button of detail view form
   */
  async resetForm(): Promise<void> {
    this.emptyForms();
    if (!this.newItemMode) {
      this.resetTableSelection();
    } else {
      this.newItemMode = false;
      this.tabGroupComponent.setNewItem(this.newItemMode);
    }
    this.refreshTableViews();
  }

  get refreshTableFunc() {
    return this.refreshTable.bind(this);
  }

  async refreshTable(resetSelTableRow: boolean = true): Promise<void> {
    this.newItemMode = false;
    this.selTableRow = resetSelTableRow ? undefined : this.selTableRow;
    this.lastSelTableRow = resetSelTableRow ? undefined : this.lastSelTableRow;
    if (resetSelTableRow) {
      // this.removeFromLS();
      await this.resetForm();
    } else {
      this.isMainTableViewLoaded = false;
      this.setupTableView();
    }
  }

  get tableUpdateFunc() {
    return this.tableUpdate.bind(this);
  }

  async tableUpdate(): Promise<void> {
    this.emptyForms();
    this.newItemMode = false;
    await this.refreshView();
  }

  get tableCreateFunc() {
    return this.tableCreate.bind(this);
  }

  async tableCreate(): Promise<void> {
    await this.createNewItem();
  }

  get refreshDetailsFunc() {
    return this.refreshDetails.bind(this);
  }

  /**
   * refresh view - called from detail-view-tab-group (after save())
   */
  refreshDetails(): void {
    this.newItemMode = false;
    this.isMainTableViewLoaded = false;
    this.refreshTableViews();
  }

  /**
   * orders view change client function for new item mode
   * if user change client, reset customer order and payment term
   *
   * @param changedValues
   */
  changeClient(changedValues: any): void {
    if (this.newItemMode) {
      const client: undefined | string = changedValues[this.tertiaryTableColumnName] ?
        changedValues[this.tertiaryTableColumnName] : undefined;
      if (client) {
        if (localStorage.getItem(this.tertiaryLocalStorageKey) !== client) {
          // client has changed...
          localStorage.setItem(this.tertiaryLocalStorageKey, client);
          // Reset CUSTOMER_ORDER if client typ has changed...
          this.tabGroupComponent.form.form.controls[this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN].setValue('');
          this.tabGroupComponent.form.form.controls[this.CONSTANTS.REFTABLE_ORDERS_PAYMENT_TERM_ID].setValue(null);
        }
      }
    }
  }

  /**
   * change payment term id by given language ([LANGUAGE_ISO_ALPHA_3], e.g. 'DEU')
   *
   * @param language
   */
  changePaymentTermId(language: string): void {
    if (this.tabGroupComponent.form.form.get('PAYMENT_TERM_ID')) {
      let newPaymentTermId: string = this.defaultPaymentTermId;
      newPaymentTermId = this.optionsService.getPaymentTermByLanguage(language, newPaymentTermId);
      this.tabGroupComponent.form.form.controls['PAYMENT_TERM_ID'].setValue(newPaymentTermId);
    }
  }

  // private async changeCustomerOrder(self: this, selectedValue: string) {
  //   if (self.newItemMode) {
  //     const client: undefined | string = self.tabGroupComponent.form.form.get('CLIENT') ?
  //       self.tabGroupComponent.form.form.get('CLIENT').value : undefined;
  //     const self2 = self;
  //     const tableDbData: {} = await self.tableDataService.getTableDataByCustomersNumber(self.CONSTANTS.REFTABLE_CUSTOMER,
  //       ViewQueryTypes.PURE_SELECT, self.CONSTANTS.REFTABLE_CUSTOMER_COLUMN, selectedValue);
  //     if (!tableDbData) {
  //       return;
  //     }
  //     if (tableDbData['table'] && Object.keys(tableDbData['table']).length > 1) {
  //       if (tableDbData['table'][1][0] && tableDbData['table'][1][0]['CUSTOMERS_TYPE'] && client) {
  //         if (tableDbData['table'][1][0]['CUSTOMERS_TYPE'] !== client) {
  //           // Reset CUSTOMER_ORDER if client typ has changed...
  //           self2.formService.showErrorMessage("Klient und Kundenauftragsnummer passen nicht zusammen!");
  //           self2.tabGroupComponent.form.form.controls['CUSTOMER_ORDER'].setValue('');
  //         } else {
  //           self2.tabGroupComponent.form.form.controls['PAYMENT_TERM_ID'].setValue(
  //             tableDbData['table'][1][0]['PAYMENT_TERM_ID']);
  //         }
  //       }
  //     }
  //   }
  // }

  private refreshTableViews(): void {
    this.resetVars();
    this.ngAfterViewInit();
  }

  /**
   * condition if form should be displayed
   * - if new country mode is true
   * - if last selected table row is set
   * - is currently selected table row is set
   */
  shouldDisplayForm(): string {
    return (this.newItemMode || this.lastSelTableRow || this.selTableRow) ? 'block' : 'none';
  }

  /**
   * set referral table name
   *
   * @param name
   */
  setReferralTable(name: string) {
    this.refTable = name;
  }

  /**
   * set details referral table name
   *
   * @param name
   */
  setDetailsReferralTable(name: string) {
    this.detailsRefTables[name] = name;
  }

  /**
   * set primary referral table column name to query by (e.g. 'ORDERS_NUMBER')
   *
   * @param column
   */
  setPrimaryTableColumnName(column: string) {
    this.primaryTableColumnName = column;
    this.formService.setPrimaryTableColumnName(column);
  }

  /**
   * set secondary referral table column name to query by (e.g. 'CUSTOMER_ORDER')
   *
   * @param column
   */
  setSecondaryTableColumnName(column: string) {
    this.secondaryTableColumnName = column;
  }

  /**
   * set tertiary referral table column name to query by (e.g. 'CLIENT')
   *
   * @param column
   */
  setTertiaryTableColumnName(column: string) {
    this.tertiaryTableColumnName = column;
  }

  /**
   * set main table view displayed columns
   *
   * @param columns
   */
  setDisplayedColumns(columns: string[]) {
    this.displayedColumns = columns;
  }

  /**
   * set details view displayed columns
   *
   * @param columns
   */
  setDetailsDisplayedColumns(columns: string[]) {
    this.detailsDisplayedColumns = columns;
  }


  /**
   * set main table view search column
   * @param column
   */
  setSearchColumn(column: string) {
    this.searchColumn = column;
  }

  /**
   * set main table view additional search columns
   * @param columns
   */
  setAdditionalSearchColumns(columns: string) {
    this.additionalSearchColumns = columns;
  }

  /**
   * set main table view initial sort
   *
   * @param sort
   */
  setInitialSort(sort: Sort<any>) {
    this.initialSort = sort;
  }

  /**
   * set main table view columns to hide
   *
   * @param columns
   */
  setColumnsToHide(columns: string[]) {
    this.columnsToHide = columns;
  }

  /**
   * set details view table columns to hide
   *
   * @param columns
   */
  setDetailsColumnsToHide(columns: string[]) {
    this.detailsColumnsToHide = columns;
  }

  /**
   * set main table title
   *
   * @param title
   */
  setTableTitle(title: string) {
    this.tableTitle = title;
  }

  /**
   * set create new item title
   *
   * @param title
   */
  setCreateTitle(title: string) {
    this.createTitle = title;
  }

  /**
   * set create new item tooltip
   *
   * @param tooltip
   */
  setCreateTooltip(tooltip: string) {
    this.createTooltip = tooltip;
  }

  /**
   * set detail view form title
   *
   * @param title
   */
  setDetailsFormTitle(title: SubTabGroupTabNames) {
    this.detailsFormTitle = title;
  }

  /**
   * set selected item primary local storage key
   *
   * @param key
   */
  setPrimaryLocalStorageKey(key: string) {
    this.primaryLocalStorageKey = key;
    this.formService.setSelItemLocalStorageKey(key);
  }

  /**
   * set selected item secondary local storage key
   *
   * @param key
   */
  setSecondaryLocalStorageKey(key: string) {
    this.secondaryLocalStorageKey = key;
  }

  /**
   * set selected item tertiary local storage key
   *
   * @param key
   */
  setTertiaryLocalStorageKey(key: string) {
    this.tertiaryLocalStorageKey = key;
  }

  /**
   * set required form options to be loaded
   *
   * @param options
   */
  setFormOptionsToLoad(options: OptionsTypes[]) {
    this.formOptionsToLoad = options;
  }

  /**
   * set empty (main) model, e.g. customer
   *
   * @param emptyModel
   */
  setEmptyModel(emptyModel: SoasModel) {
    this.emptyModel = emptyModel;
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
   * set tab group tab number to be selected
   *
   * @param number
   */
  setTabToSelect(number: TabGroupTabNumbers) {
    this.selTabGroupTab = number;
    this.tabGroupComponent.tabsService.setTabToSelect(number);
  }

  /**
   * set sub tab group tab number to be selected
   *
   * @param number
   */
  async setSubTabToSelect(number: SubTabGroupTabNumbers) {
    this.selSubTabGroupTab = number;
    this.tabGroupComponent.tabsService.setSubTabToSelect(number);
    await this.tabGroupComponent.setSelectedTabIndex(this.selTabGroupTab, this.selSubTabGroupTab);
  }

  /**
   * is new item mode allowed for current referral table name
   */
  isNewItemModeAllowed(): boolean {
    return <boolean>((this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) ||
      (this.refTable === this.CONSTANTS.REFTABLE_PARTNERS) ||
      (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) ||
      (this.refTable === this.CONSTANTS.REFTABLE_INVOICE));
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
   * set selected item referral table title name
   *
   * @param table
   */
  setSeItemRefTableTitle(table: string) {
    this.formService.setSeItemRefTableTitle(table);
  }

  /**
   * set details view search column
   * @param column
   */
  setDetailsSearchColumn(column: string) {
    this.detailsSearchColumn = column;
  }

  /**
   * set details view additional search columns
   * @param columns
   */
  setDetailsAdditionalSearchColumns(columns: string) {
    this.detailsAdditionalSearchColumns = columns;
  }

  /**
   * set details view initial sort
   *
   * @param sort
   */
  setDetailsInitialSort(sort: Sort<any>) {
    this.detailsInitialSort = sort;
  }
}
