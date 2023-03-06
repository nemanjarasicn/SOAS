import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {CustomTableComponent} from '../../custom-table/custom-table.component';
import {CustomFormComponent} from '../../custom-form/custom-form.component';
import {Observable, Subscription} from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {HttpClient} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {TableDataService} from '../../../../_services/table-data.service';
import {Router} from '@angular/router';
import {ConstantsService, OptionsTypes, SoasModel, ViewQueryTypes} from '../../../../_services/constants.service';
import {TranslateItPipe} from '../../../../shared/pipes/translate-it.pipe';
import {MessageService} from 'primeng/api';
import {FormService} from '../../../../_services/form.service';
import {FetchDataService} from '../../../../_services/fetch-data.service';
import {Sort} from '../../custom-table/page';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import {OptionsService} from "../../../../_services/options.service";
import {MessagesService} from "../../../../_services/messages.service";


/** Custom options the configure the tooltip's default show/hide delays. */
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 100,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-custom-table-form-view',
  templateUrl: './custom-table-form-view.component.html',
  styleUrls: ['./custom-table-form-view.component.css'],
  providers: [TranslateItPipe, MessageService, {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
  // changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * CustomTableFormViewComponent - custom table form view, contains the logic of the components that are using
 *
 * - on left view: table view of CustomTableComponent
 * - on right view: form view of CustomFormComponent
 *
 * Used by: Countries, Currencies, PaymentTerms, ProductUnits, Providers, Companies, ImportTypes,
 * ImportTypesRefTablesComponent, ImportTypeConstants
 *
 * Documentation at: /docs/create-new-component/table-form/custom-table-form-view.md
 */
export class CustomTableFormViewComponent implements OnInit, AfterViewInit {

  // flag to start loading of this component, first if parent view is initialized...
  startLoading: boolean;

  // referral table name to identify current selected table
  refTable: string;

  // primary referral table column name to query table by
  primaryRefTableColumnName: string;

  // secondary referral table column name to select item (or possible: to query table by)
  secondaryRefTableColumnName: string;

  // selected item local storage key
  selItemLocalStorageKey: string;

  // referral model name: e.g. Countries
  refModel: SoasModel;

  // empty item id
  emptyItemId: string;

  // empty model to set at new item mode
  emptyModel: SoasModel;

  // flag for new item mode: false by default
  newItemMode: boolean;

  // flag if main table view is loaded
  isMainTableViewLoaded: boolean;
  // flag if form view is loaded
  isFormViewLoaded: boolean;

  // currently selected table row
  selTableRow: SoasModel;
  // last selected table row
  lastSelTableRow: SoasModel;

  // clicked row function to override
  clickedRow: Function;

  // flag if table clicked
  isTableClicked: boolean;

  // table columns that should be displayed
  displayedTableColumns: string[];
  // primary table column name to search by
  searchTableColumn: string;
  // primary table additional column name to search by
  additionalTableSearchColumns: string;
  // primary table initial sorting setting
  initialTableSort: Sort<any>;

  // form options that are required: currencies, states...
  formOptionsToLoad: OptionsTypes[];

  // Table view
  @ViewChild(CustomTableComponent) tableComponent !: CustomTableComponent;
  // Form view
  @ViewChild(CustomFormComponent) formComponent !: CustomFormComponent;

  // table title text
  tableTitle: string;
  // form title text
  formTitle: string;
  // create item title text
  createTitle: string;
  // create tooltip title text
  createTooltip: string;

  // allow table multiselect: false by default
  allowMultiSelect: boolean;

  // service subscription
  serviceSubscription: Subscription;

  // table paginator elements per side number: BIG ([14, 25, 50, 100]) by default
  PAGINATOR_ELEMENTS_PER_SIDE: number[];
  // current page size number: 14 by default
  currPageSize: number;
  // selected index of the table
  selectedIndex: number;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private tableDataService: TableDataService,
    private router: Router,
    public CONSTANTS: ConstantsService,
    public translatePipe: TranslateItPipe,
    private messageService: MessageService,
    private messagesService: MessagesService,
    private optionsService: OptionsService,
    private formService: FormService,
    private fetchDataService: FetchDataService
  ) {
    this.startLoading = false;
    this.allowMultiSelect = false;
    this.resetVars();
    optionsService.setTranslatePipe(translatePipe);
    formService.setTranslatePipe(translatePipe);
    messagesService.setTranslatePipe(translatePipe);
  }

  /**
   * 1. Initialize the directive or component after Angular first displays the data-bound properties and sets
   * the directive or component's input properties
   * .
   * https://angular.io/guide/lifecycle-hooks#lifecycle-sequence
   *
   * Set titles, paginator and referral table name
   */
  ngOnInit(): void {
    this.PAGINATOR_ELEMENTS_PER_SIDE = this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE_BIG;
    this.currPageSize = this.PAGINATOR_ELEMENTS_PER_SIDE[0];
    // subscribe and wait for table changes (click or fetch)
    this.serviceSubscription = this.fetchDataService.getDataObs().subscribe(async (selTableData) => {
      if (this.tableComponent) {
        this.tableComponent.selectionIndex = undefined;
      }
      if (selTableData && selTableData.selTableRow) {
        this.selTableRow = selTableData.selTableRow;
        // update table and form
        await this.tableUpdate(this.selTableRow);
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

  /**
   * unsubscribe from service at component destroy
   */
  ngOnDestroy() {
    // reset selected referral table title name
    this.formService.setSeItemRefTableTitle(undefined);
    // unsubscribe subscription
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }

  /**
   * Setup table: Load table data and the form data
   *
   * @private
   */
  private setupTableView(): boolean {
    // set currently selected referral table name to the local storage
    localStorage.setItem(this.CONSTANTS.LS_SEL_REF_TABLE, this.refTable);
    if (this.tableComponent) {
      const selCountryId = localStorage.getItem(this.selItemLocalStorageKey);
      this.tableComponent.setPageParams(this.refTable, this.primaryRefTableColumnName, selCountryId,
        '', '', this.searchTableColumn, this.additionalTableSearchColumns,
        this.displayedTableColumns, ViewQueryTypes.MAIN_TABLE);
      this.tableComponent.setIsLoadingResults(true);
      this.tableComponent.setPaginator(this.PAGINATOR_ELEMENTS_PER_SIDE);
      this.tableComponent.setPageSize(this.currPageSize);
      this.tableComponent.setLabels(this.tableTitle, this.createTitle);
      this.tableComponent.setShowCreateButton(true);
      this.tableComponent.setPaginatedDataSource(this.currPageSize);

      // load data for table via data source observable. loaded data will be processed in
      // serviceSubscription > refreshView, where form data will be loaded via setAndLoadFormData
      const obsData: Observable<any> = this.tableComponent.getDataSource();
      obsData.subscribe(async (data: any) => {

        // load form options from form service, before form is loaded
        await this.optionsService.initializeOptions(this.formOptionsToLoad);

        this.tableComponent.setCurrencies(this.optionsService.currencies);
        this.tableComponent.setPCurrencies(this.optionsService.pcurrencies);
        this.tableComponent.setCurrenciesWithId(this.optionsService.currenciesWithId);
        this.tableComponent.setCountries(this.optionsService.countries);
        this.selTableRow = await this.tableComponent.setTableItems(data, this.primaryRefTableColumnName,
          selCountryId, false);

        this.findSelectedIndex(data);

        this.tableComponent.setClickedRow = this.getClickedRow(this);
        this.formComponent.setLabels(this.formTitle, this.createTitle);
        // set create button enabled, after form was completely loaded
        this.tableComponent.setDisabledCreateButton(false);
        this.tableComponent.setIsTableClicked(false);
        this.formComponent.setIsLoadingResults(false);
        this.tableComponent.setSelTableRow(this.selTableRow, this.selectedIndex);
        this.tableComponent.setSelectionModel();
        this.tableComponent.setFocus(this.selectedIndex);

        return true;
      });
    } else {
      return false;
    }
  }

  private findSelectedIndex(data: any) {
    // let index: number = undefined;
    if (this.tableComponent.selectionModel && this.tableComponent.selectionModel.selected) {
      for (let item in data) {
        if (data.hasOwnProperty(item) &&
          (data[item] === this.tableComponent.selectionModel.selected[0])) {
          this.selectedIndex = parseInt(item);
          break;
        }
      }
    }
  }

  /**
   * returns row click function
   *
   * @param self
   * @private
   */
  getClickedRow(self: this) {
    return async function (tableRow: SoasModel, $event: Event) {
      if (!self.isTableClicked) {
        self.isTableClicked = true;
        self.tableComponent.setIsTableClicked(true);
        self.tableComponent.setIsLoadingResults(true);
        self.emptyForms();
        await self.tableClickLogic(tableRow);
      } else if ($event && (typeof Event)) {
        $event.stopPropagation();
      }
    };
  }

  /**
   * table click logic
   *
   * @param tableRow
   * @private
   */
  private async tableClickLogic(tableRow: SoasModel): Promise<void> {
    if (this.tableComponent) {
      this.newItemMode = false;
      this.selTableRow = tableRow;
      this.tableComponent.selectionModel.select(tableRow);
      this.findSelectedIndex(this.tableComponent.items);
      localStorage.setItem(this.selItemLocalStorageKey, tableRow[this.primaryRefTableColumnName].toString());
      await this.tableDataService.removeAllTableLocks(true, '', '');
      this.refreshTableViews();
    } else {
      this.isTableClicked = false;
    }
  }

  /**
   * refresh view - called after service has loaded form data
   *
   * @private
   */
  private async refreshView(): Promise<void> {
    if (this.tableComponent) {
      if (this.selTableRow && this.selTableRow[this.primaryRefTableColumnName] &&
        this.selTableRow[this.primaryRefTableColumnName] !== 0 &&
        (this.selTableRow.hasOwnProperty(this.primaryRefTableColumnName) ||
          this.selTableRow.hasOwnProperty(this.secondaryRefTableColumnName))) {
        this.lastSelTableRow = this.selTableRow;
        await this.setAndLoadFormData(this.selTableRow);
      } else if (this.isFormViewLoaded) {
        await this.setAndLoadFormData(this.lastSelTableRow);
      }
      this.tableComponent.setSelTableRow(this.selTableRow, this.selectedIndex);
      this.tableComponent.setSelectionModel();
      this.tableComponent.setIsTableClicked(false);
      this.tableComponent.setDisabledCreateButton(false);
      this.tableComponent.setIsLoadingResults(false);
    }
  }

  /**
   * set and load form data
   *
   * @private
   */
  private async setAndLoadFormData(selTabRow: SoasModel): Promise<void> {
    this.formComponent.setNewItem(this.newItemMode);
    this.formComponent.setRefTable(this.refTable);
    this.formComponent.setLocalStorageKey(this.selItemLocalStorageKey);
    if (selTabRow) {
      this.formComponent.setSelectedRow(selTabRow);
      await this.loadFormData(selTabRow[this.primaryRefTableColumnName].toString());
    } else if (this.newItemMode) {
      this.formComponent.setSelectedRow(this.emptyModel);
      await this.loadFormData(this.emptyItemId.toString());
    }
  }

  /**
   * load form data
   *
   * @param countryId
   * @private
   */
  private async loadFormData(countryId: string): Promise<void> {
    const formDisabled: boolean = false;
    const result: {model: any, fields: FormlyFieldConfig[]} =
      await this.formService.getFormConfigData(this.refTable, this.newItemMode,
        this.primaryRefTableColumnName, countryId, undefined, undefined, undefined,
        formDisabled);
    const formResult: { result: boolean } = this.formComponent.setFormData(result);
    this.isFormViewLoaded = true;
    this.evalFormResult(formResult, this);
  }

  /**
   * create item. set new country mode, empty form and load default form data.
   */
  public async createItem(): Promise<void> {
    this.newItemMode = true;
    this.emptyForms();
    if (this.formComponent) {
      await this.setAndLoadFormData(this.selTableRow ? this.selTableRow : this.lastSelTableRow);
    }
  }

  /**
   * evaluate from result
   *
   * @param formResult
   * @param self
   * @private
   */
  private evalFormResult(formResult, self: this): void {
    if (formResult && formResult.result) {
      // Unblock table click
      self.isTableClicked = false;
    } else {
      throw new Error('Callback error: ' + formResult.method);
    }
  }

  /**
   * empty forms
   *
   * @private
   */
  private emptyForms(): void {
    // set empty model
    if (this.formComponent) {
      this.formComponent.setNewItem(this.newItemMode);
      this.formComponent.emptyForm();
    }
  }

  /**
   * apply filter
   *
   * @param event
   */
  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  /** Function to call from children
   * https://stackoverflow.com/a/50585796
   **/
  get resetFormFunc() {
    return this.resetForm.bind(this);
  }

  /**
   * reset table - reset selected table row
   *
   * @private
   */
  private resetTable(): void {
    localStorage.removeItem(this.selItemLocalStorageKey);
    this.selTableRow = undefined;
    this.lastSelTableRow = undefined;
    if (this.tableComponent) {
      this.tableComponent.selectionIndex = undefined;
      this.tableComponent.setSelTableRow(this.selTableRow, this.tableComponent.selectionIndex);
      this.tableComponent.clearSearch();
    }
  }

  /**
   * reset form - called from custom form via cancel button
   *
   * @private
   */
  private async resetForm(): Promise<void> {
    this.emptyForms();
    if (!this.newItemMode) {
      this.resetVars();
      this.resetTable();
    } else {
      this.newItemMode = false;
      this.formComponent.setNewItem(this.newItemMode);
      await this.setupTableView();
      await this.tableUpdate(this.selTableRow);
    }
  }

  get loadFormFunc() {
    return this.loadForm.bind(this);
  }

  /**
   * load form
   */
  private async loadForm(): Promise<void> {
    await this.loadFormData(this.selTableRow[this.primaryRefTableColumnName].toString());
  }

  get tableUpdateFunc() {
    return this.tableUpdate.bind(this);
  }

  /**
   * table update
   *
   */
  private async tableUpdate(selTableRow: SoasModel): Promise<void> {
    this.emptyForms();
    this.newItemMode = false;
    this.setSelTableRow(selTableRow);
    await this.refreshView();
  }

  public setSelTableRow(selRow: SoasModel): void {
    if (selRow && this.tableComponent) {
      this.tableComponent.setSelTableRow(selRow, this.selectedIndex);
    } else {
      console.log('ERROR: selRow or customTableComponent is not set!');
    }
  }

  get tableCreateFunc() {
    return this.tableCreate.bind(this);
  }

  private tableCreate(): void {
    this.createItem();
  }

  get saveFormFunc() {
    return this.saveForm.bind(this);
  }

  private refreshTableViews(): void {
    this.resetVars();
    this.ngAfterViewInit();
  }

  /**
   * save form - function need form data only for saving
   *
   * form data should contain all necessary data for every field stored in form field 'templateOptions', like:
   * 'refTable':'countries'     - Referral table name
   * 'tableName':'COUNTRIES',   - Table name to save data to.
   * 'newItemMode': 'false',    - New item mode boolean flag.
   * 'isPrimary': 'true',       - Flag to mark field as primary, so the primary key will be detected.
   * 'needsValidation': 'false'
   * @private
   */
  private async saveForm(): Promise<void> {
    console.log(0);
    if (!(this.formComponent && this.formComponent.customForm && this.formComponent.customForm.form)) {
      this.messagesService.showErrorMessage('ERROR_DURING_SAVING');
    }
    const formValues: SoasModel = this.formComponent.customForm.form.getRawValue();
    const fields: FormlyFieldConfig[] = this.formComponent.customForm.formlyFieldConfig;
    const saveResultData: { result: boolean, message: string } =
      await this.formService.saveForm({formValues: formValues, fields: fields});
    if (saveResultData) {
      if (saveResultData.result) {
        this.messagesService.showSuccessMessage(this.translatePipe.transform(saveResultData.message));
      } else {
        this.messagesService.showErrorMessage(this.translatePipe.transform(saveResultData.message));
      }
      this.refreshTableViews();
    } else {
      this.messagesService.showErrorMessage('ERROR_DURING_SAVING');
    }
  }

  /**
   * conditions if form should be displayed
   * - if new item mode is true
   * - if last selected table row is set
   * - is currently selected table row set
   */
  shouldDisplayForm(): string {
    // * - if form view data is loaded
    //   * and
    // (this.isFormViewLoaded && ( // flickering, if added...
    return (this.newItemMode || this.lastSelTableRow || this.selTableRow) ? 'block' : 'none';
  }

  /**********************************************************************
   * SETTER METHODS
   **********************************************************************/

  /**
   * set table title
   *
   * @param title
   */
  setTableTitle(title: string) {
    this.tableTitle = title;
  }

  /**
   * set form title
   *
   * @param title
   */
  setFormTitle(title: string) {
    this.formTitle = title;
  }

  /**
   * set create title
   *
   * @param title
   */
  setCreateTitle(title: string) {
    this.createTitle = title;
  }

  /**
   * set create tooltip
   *
   * @param tooltip
   */
  setCreateTooltip(tooltip: string) {
    this.createTooltip = tooltip;
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
   * set referral model type: e.g. Countries
   * @param model
   */
  setReferralModel(model: SoasModel) {
    this.refModel = model;
  }

  /**
   * set empty id
   *
   * @param emptyItemId
   */
  setEmptyItemId(emptyItemId: string) {
    this.emptyItemId = emptyItemId;
  }

  /**
   * set empty model
   *
   * @param emptyModel
   */
  setEmptyModel(emptyModel: SoasModel) {
    this.emptyModel = emptyModel;
  }

  /**
   * set tables displayed columns
   *
   * @param columns
   */
  setDisplayedTableColumns(columns: string[]) {
    this.displayedTableColumns = columns;
  }

  /**
   * set tables search column
   * @param column
   */
  setSearchTableColumn(column: string) {
    this.searchTableColumn = column;
  }

  /**
   * set tables additional search columns
   * @param columns
   */
  setAdditionalTableSearchColumns(columns: string) {
    this.additionalTableSearchColumns = columns;
  }

  /**
   * set initial table sort
   *
   * @param sort
   */
  setInitialTableSort(sort: Sort<any>) {
    this.initialTableSort = sort;
  }

  /**
   * specify form options to load before form data is loaded
   *
   * @param options
   */
  setFormOptionsToLoad(options: OptionsTypes[]) {
    this.formOptionsToLoad = options;
  }

  /**
   * set tables paginator number of elements per side
   * @param elements
   */
  setPaginatorElementsPerSide(elements: number[]) {
    this.PAGINATOR_ELEMENTS_PER_SIDE = elements;
  }

  /**
   * set current tables page size number
   *
   * @param size
   */
  setCurrPageSize(size: number) {
    this.currPageSize = size;
  }

  /**
   * set selected item local storage key
   *
   * @param key
   */
  setSelItemLocalStorageKey(key: string) {
    this.selItemLocalStorageKey = key;
    this.formService.setSelItemLocalStorageKey(key);
  }

  /**
   * set primary referral table column name to query by (e.g. 'ID')
   *
   * @param column
   */
  setPrimaryRefTableColumnName(column: string) {
    this.primaryRefTableColumnName = column;
  }

  /**
   * set secondary referral table column name to query by (e.g. 'NAME')
   *
   * @param column
   */
  setSecondaryRefTableColumnName(column: string) {
    this.secondaryRefTableColumnName = column;
  }

  /**
   * reset variables
   *
   * @private
   */
  private resetVars(): void {
    this.isMainTableViewLoaded = false;
    this.isFormViewLoaded = false;
    this.selTableRow = undefined;
    this.newItemMode = false;
    this.isTableClicked = false;
    if (this.tableComponent) {
      this.tableComponent.setIsTableClicked(false);
      this.tableComponent.setDisabledCreateButton(true);
    }
  }

  /**
   * set selected item referral table title name
   *
   * @param table
   */
  setSeItemRefTableTitle(table: string) {
    this.formService.setSeItemRefTableTitle(table);
  }
}
