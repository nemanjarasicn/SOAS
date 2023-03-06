import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CustomTableComponent} from '../../custom-table/custom-table.component';
import {DetailViewListComponent} from '../../../detail-view-list/detail-view-list.component';
import {ComponentViewTypes, ConstantsService, OptionsTypes, SoasModel, ViewQueryTypes} from '../../../../_services/constants.service';
import {TranslateItPipe} from '../../../../shared/pipes/translate-it.pipe';
import {MessageService} from 'primeng/api';
import {Sort} from '../../custom-table/page';
import {Observable, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {TableDataService} from '../../../../_services/table-data.service';
import {Router} from '@angular/router';
import {FormService} from '../../../../_services/form.service';
import {FetchDataService} from '../../../../_services/fetch-data.service';
import {DetailViewListDialogComponent} from "../../../detail-view-list/detail-view-list-dialog/detail-view-list-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DynamicFormComponent} from "../../../../dynamic-view/dynamic-form/dynamic-form.component";
import {DynamicFormService} from "../../../../_services/dynamic-form.service";
import {OptionsService} from "../../../../_services/options.service";

@Component({
  selector: 'app-custom-table-table-form-view',
  templateUrl: './custom-table-table-form-view.component.html',
  styleUrls: ['./custom-table-table-form-view.component.css'],
  providers: [TranslateItPipe, MessageService]
})

/**
 * CustomTableTableFormViewComponent - custom table table form view - contains the logic of the components that are using
 *
 * - on left view: table view of CustomTableComponent
 * - on right view: table and form views of DetailViewListComponent
 *
 * Used by: Warehousing, Taxes, ProductComponents, Attributes, ArticleComponents, SupplyOrdersComponent
 *
 * Documentation at: /docs/create-new-component/table-table-form/custom-table-table-form-view.md
 */
export class CustomTableTableFormViewComponent implements OnInit, AfterViewInit {

  // flag to start loading of this component, first if parent view is initialized...
  startLoading: boolean;

  // referral table name to identify current selected table
  refTable: string;
  // primary referral table column name to query table by
  primaryRefTableColumnName: string;
  // secondary referral table column name to query table by
  secondaryRefTableColumnName: string;

  // detail view - referral table name to identify current selected detail table
  detailViewRefTable: string;
  // detail view - primary referral table column name to query table by
  detailViewPrimaryRefTableColumnName: string;

  // detail view - form key name
  detailViewFormKey: string;
  // detail view - form value
  detailViewFormValue: string;

  // local storage keys:
  // selected item local storage key
  selItemPrimaryLocalStorageKey: string;
  // selected item secondary local storage key
  selItemSecondaryLocalStorageKey: string;
  // selected items primary ID local storage key
  selItemPrimaryIdLocalStorageKey: string;
  // selected items secondary ID local storage key
  selItemSecondaryIdLocalStorageKey: string;

  // page params primary column name
  pageParamsPrimaryColumnName: string;
  // page params primary column value
  pageParamsPrimaryColumnValue: string;

  // flag to determine, if in details view the data should be shown based on second table referral name
  showSecondTableDataInDetailsView: boolean;

  emptyProductComponentId: string;
  emptyProductComponentModel: SoasModel;

  // flag for new item mode: false by default
  newItemMode: boolean;

  // allow table multiselect: false by default
  allowMultiSelect: boolean;

  // empty model to set at new item mode
  emptyModel: SoasModel;

  // Main table view
  @ViewChild(CustomTableComponent) tableComponent !: CustomTableComponent;
  // Detail view with table and form
  @ViewChild(DetailViewListComponent) detailViewListComponents !: DetailViewListComponent;

  // flag if main table view is loaded
  isMainTableViewLoaded: boolean;

  // currently selected main table row
  selTableRow: SoasModel;

  // main table clicked row function to override
  setClickedRow: Function;
  // flag if main table clicked
  isTableClicked: boolean;

  // table view columns that should be displayed
  tableViewDisplayedColumns: string[];
  // main table column name to search by
  tableViewSearchColumn: string;
  // main table additional column name to search by
  tableViewAdditionalSearchColumns: string;
  // main table initial sorting setting
  tableViewInitialSort: Sort<SoasModel>;
  // main table columns to hide
  tableViewColumnsToHide: string[];

  // detail view table view columns that should be displayed
  detailViewTableDisplayedColumns: string[];
  // detail view table column name to search by
  detailViewTableSearchColumn: string;
  // detail view table additional column name to search by
  detailViewTableAdditionalSearchColumns: string;
  // detail view table initial sorting setting
  detailViewTableInitialSort: Sort<SoasModel>;
  // detail view table columns to hide
  detailViewTableColumnsToHide: string[];

  // main table paginator elements per side number: BIG ([14, 25, 50, 100]) by default
  PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE: number[];
  // detail table paginator elements per side number: FIVE (5) by default
  PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE: number[];
  // main table current page size number: 14 by default
  currPageSizeMainTable: number;
  // detail table current page size number: 4 by default
  currPageSizeDetailTable: number;

  // table view title text
  tableTitle: string;
  // detail view table title text
  detailTableTitle: string;
  // detail view form title
  detailFormTitle: string;
  // create item title text
  createTitle: string;
  // create item tooltip text
  createTooltip: string;
  // edit item title text
  editTooltip: string;
  // edit item tooltip text
  deleteTooltip: string;
  // edit title for detail view create button
  createDetailviewButtonTitle: string;


    // form options that are required: currencies, states...
    formOptionsToLoad: OptionsTypes[];

  // edit title for detail view create text
  detailViewCreateTitle: string;

  //check if detailView table

  isDetailView: boolean = false;

  // fetch data subscription
  serviceSubscription: Subscription;

  // @ViewChild(MatSort, {static: false}) sort: MatSort;
  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private tableDataService: TableDataService,
    private router: Router,
    private CONSTANTS: ConstantsService,
    public translatePipe: TranslateItPipe,
    private formService: FormService,
    private optionsService: OptionsService,
    private fetchDataService: FetchDataService,
    public dialog: MatDialog,
    private dynamicFormService: DynamicFormService
  ) {
    optionsService.setTranslatePipe(translatePipe);
    this.startLoading = false;
    this.allowMultiSelect = false;
    this.resetVars();
    formService.setTranslatePipe(translatePipe);
  }

  ngOnInit(): void {
    this.PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE = this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE_BIG;
    this.PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE = this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE_FIVE;
    this.currPageSizeMainTable = this.CONSTANTS.PAGINATOR_MAX_ELEMENTS_SMALL;
    this.currPageSizeDetailTable = this.CONSTANTS.PAGINATOR_MAX_ELEMENTS_MINI;
    if (this.tableComponent) {
      this.tableComponent.setPaginator(this.PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE);
      this.tableComponent.setPageSize(this.currPageSizeMainTable);
    }
    // subscribe to wait for loaded changes
    this.serviceSubscription = this.fetchDataService.getDataObs().subscribe(async (selTableData) => {
      if (this.tableComponent) {
        this.tableComponent.selectionIndex = undefined;
      }
      if (selTableData && selTableData.selTableRow) {
        let viewType: ComponentViewTypes;
        if (selTableData.refTableName === this.refTable) {
          this.selTableRow = selTableData.selTableRow;
          viewType = ComponentViewTypes.Table;
          // reset flag to be able to load detail view
          this.isMainTableViewLoaded = false;
        } else if (selTableData.refTableName === this.detailViewRefTable) {
          this.detailViewListComponents.tableComponent.selTableRow = selTableData.selTableRow;
          viewType = ComponentViewTypes.Details;
        }
        await this.tableUpdate(viewType, selTableData.selTableRow);
      } else if (selTableData && selTableData.refTableName === ComponentViewTypes.DynamicForm) {
        // called after dynamic-form component is initialized in ngAfterViewInit()
        if (this.detailViewListComponents) {
          await this.setDetailForm();
        }
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
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }

  private resetVars(): void {
    this.isMainTableViewLoaded = false;
    this.newItemMode = false;
    this.selTableRow = undefined;
    this.detailViewTableColumnsToHide = [];
    this.isTableClicked = false;
    if (this.tableComponent) {
      this.tableComponent.setIsTableClicked(false);
      this.tableComponent.setDisabledCreateButton(true);
    }
  }

  /**
   * Setup table view:
   * Loads custom table data via dataSource observable and then (from custom table) a service result is sent
   * and tableUpdate is triggered to load the detail view (table + form)
   *
   * @private
   */
  private setupTableView(): boolean {
    // set currently selected referral table name to the local storage
    localStorage.setItem(this.CONSTANTS.LS_SEL_REF_TABLE, this.refTable);
    if (this.tableComponent) {
      // set detail view local storage item, to load some item for form. for article-components...
      let selCompId = this.selItemPrimaryIdLocalStorageKey ?
        localStorage.getItem(this.selItemPrimaryIdLocalStorageKey) : undefined;
      if (selCompId && !localStorage.getItem(this.selItemSecondaryIdLocalStorageKey)) {
        localStorage.setItem(this.selItemSecondaryIdLocalStorageKey, selCompId);
      }
      let pageParamsValue = this.pageParamsPrimaryColumnValue ?
        localStorage.getItem(this.pageParamsPrimaryColumnValue) : '';
      this.tableComponent.setPageParams(this.refTable,
        this.pageParamsPrimaryColumnName, pageParamsValue, '', '', this.tableViewSearchColumn,
        this.tableViewAdditionalSearchColumns, this.tableViewDisplayedColumns, ViewQueryTypes.MAIN_TABLE);
      this.tableComponent.setIsLoadingResults(true);
      this.tableComponent.setLabels(this.tableTitle, this.createTitle);
      this.tableComponent.setShowCreateButton(true);
      this.tableComponent.setPageSize(this.currPageSizeMainTable);

      this.tableComponent.setPaginatedDataSource(this.currPageSizeMainTable);

      // load data for table via data source observable. loaded data will be processed in
      // serviceSubscription > refreshView, where form data will be loaded via setAndLoadFormData
      let obsData: Observable<any> = this.tableComponent.getDataSource();
      obsData.subscribe(async (data: any) => {

        // load form options from form service, before form is loaded
        await this.optionsService.initializeOptions(this.formOptionsToLoad);


        let selPrimaryValue = localStorage.getItem(this.selItemPrimaryLocalStorageKey);
        this.selTableRow = await this.tableComponent.setTableItems(data,
          this.primaryRefTableColumnName, selPrimaryValue, false);
        this.tableComponent.setSelTableRow(this.selTableRow);
        this.tableComponent.setClickedRow = this.getClickedRow(this);
        // set create button enabled, after form was completely loaded
        this.tableComponent.setDisabledCreateButton(false);
        this.tableComponent.setIsTableClicked(false);
        this.tableComponent.setIsLoadingResults(false);
        return true;

      });
    } else {
      return false;
    }
  }

  /**
   * get clicked row function
   *
   * @param self
   * @private
   */
  private getClickedRow(self: this) {
    return async function (tableRow: SoasModel, $event: Event) {
      if (!self.isTableClicked) {
        self.isTableClicked = true;
        self.emptyForms();
        await self.tableClickLogic(tableRow);
      } else if ($event && (typeof Event)) {
        $event.stopPropagation();
      }
    };
  }

  /**
   * set table click logic
   *
   * @param tableRow
   * @private
   */
  private async tableClickLogic(tableRow: SoasModel): Promise<void> {
    if (this.tableComponent) {
      this.tableComponent.setIsLoadingResults(true);
      this.tableComponent.setIsTableClicked(true);
      this.newItemMode = false;
      this.selTableRow = tableRow;
      localStorage.setItem(this.selItemPrimaryLocalStorageKey, tableRow[this.primaryRefTableColumnName]);
      if (this.selItemSecondaryLocalStorageKey) {
        localStorage.removeItem(this.selItemSecondaryLocalStorageKey);
      }
      if (this.selItemSecondaryIdLocalStorageKey) {
        localStorage.removeItem(this.selItemSecondaryIdLocalStorageKey);
      }
      if (this.detailViewFormValue) {
        localStorage.removeItem(this.detailViewFormValue);
      }
      await this.tableDataService.removeAllTableLocks(true, '', '');
      this.refreshTableViews();
    } else {
      this.isTableClicked = false;
    }
  }

  private emptyForms(): void {
    if (this.detailViewListComponents) {
      this.detailViewListComponents.setNewItemMode(this.newItemMode);
      this.detailViewListComponents.emptyForms();
    }
  }

  /**
   * set detail view by loading table and form data, and setting detail view table click
   *
   * @private
   */
  private async setDetailView(): Promise<void> {
    this.detailViewListComponents.listForm = new DynamicFormComponent(this.fetchDataService, this.dynamicFormService);

    if (!this.isMainTableViewLoaded && this.detailViewListComponents) {
      this.detailViewListComponents.setRefTable(this.detailViewRefTable);
      this.detailViewListComponents.setShowDetailViewCreateButton(true);
      this.setParentRefTable();
      this.detailViewListComponents.setLabels(this.detailTableTitle, this.detailFormTitle, this.detailFormTitle,
        this.detailFormTitle, this.createTitle,  this.createDetailviewButtonTitle, this.detailViewCreateTitle);
      // ToDo: Manage to set the table paginator to 3 items
      this.detailViewListComponents.setPaginator(this.PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE);
      this.detailViewListComponents.setPageSize(this.currPageSizeDetailTable);
      this.detailViewListComponents.setTableColumnsToHide(this.detailViewTableColumnsToHide);
      if (this.detailViewListComponents.tableComponent) {
        this.detailViewListComponents.tableComponent.setPaginator(this.PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE);
        this.detailViewListComponents.tableComponent.setPageSize(this.currPageSizeDetailTable);
      }
      if (this.selTableRow && this.selTableRow[this.primaryRefTableColumnName] &&
        this.selTableRow[this.primaryRefTableColumnName] !== '') {
        await this.getTableAndFormData(this.primaryRefTableColumnName, this.selTableRow[this.primaryRefTableColumnName]);
        this.setDetailViewClick();
      }
    }
    this.isMainTableViewLoaded = true;
    if (this.tableComponent) {
      this.tableComponent.setIsLoadingResults(false);
    }
  }

  private setParentRefTable() {
    this.detailViewListComponents.setParentRefTable(!this.showSecondTableDataInDetailsView ?
      this.refTable : this.detailViewRefTable);
  }

  private setDetailViewClick(): void {
    if (this.tableComponent) {
      this.tableComponent.setIsLoadingResults(true);
    }

    if (this.detailViewListComponents.tableComponent) {
      this.detailViewListComponents.tableComponent.setClickedRow =
        async (model: SoasModel) => {
          this.detailViewListComponents.tableComponent.setPaginator(this.PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE);
          this.detailViewListComponents.tableComponent.setPageSize(this.currPageSizeDetailTable);

          this.detailViewListComponents.tableComponent.setSelTableRow(model);

          await this.loadDetailViewTableData(model);
          await this.setDetailForm();

          this.dynamicFormService.setActiveModel(model);
          this.dynamicFormService.setActiveFields(this.detailViewListComponents.listForm.formlyFieldConfig);

          this.dialog.open(DetailViewListDialogComponent, {
            data: {
              listTitle: this.detailFormTitle,
              onFormSubmit: async (value) => {
                this.detailViewListComponents.listForm.form = value
                await this.detailViewListComponents.save()
              },
              close: async () => {await this.detailViewListComponents.close()},
            }
          })
        }
    }
  }

  private async loadDetailViewTableData(tableRow: SoasModel): Promise<void> {
    this.detailViewListComponents.setRefTable(this.detailViewRefTable);
    this.setParentRefTable();
    if (this.selItemSecondaryLocalStorageKey) {
      localStorage.setItem(this.selItemSecondaryLocalStorageKey, tableRow[this.secondaryRefTableColumnName]);
    }
    // set ID of the selected item, if ID is available in the table data
    if (this.detailViewFormKey && this.detailViewFormValue) {
      localStorage.setItem(this.detailViewFormValue, tableRow[this.detailViewFormKey].toString());
    }
    // try to load detail view form

  }

  /**
   * load table and form data from database
   *
   * @param primaryKey
   * @param primaryValue
   * @private
   */
  private async getTableAndFormData(primaryKey: string, primaryValue: string, tableTem?:  string) {
    let selItemId: string = this.selItemSecondaryIdLocalStorageKey ?
      localStorage.getItem(this.selItemSecondaryIdLocalStorageKey) : undefined;
    let getFormKey: string = selItemId ? this.detailViewPrimaryRefTableColumnName : this.primaryRefTableColumnName;
    let getFormValue: string = selItemId ? selItemId : localStorage.getItem(this.selItemPrimaryLocalStorageKey);
    if (!this.newItemMode) {
      let obsData: Observable<any> = await this.detailViewListComponents.loadTableData(
        primaryKey, primaryValue, this.detailViewPrimaryRefTableColumnName, undefined,
        getFormKey, getFormValue, this.detailViewTableSearchColumn, this.detailViewTableAdditionalSearchColumns,
        this.detailViewTableDisplayedColumns);
      if (obsData) {
        obsData.subscribe(async (tableData: any) => {
          if (tableData) {
            const selTableRowData = await this.detailViewListComponents.tableComponent.setTableItems(tableData,
              primaryKey, primaryValue, true, selItemId);
            this.detailViewListComponents.tableComponent.selTableRow = selTableRowData;

            // to be able to load form data (if nothing are selected before), add selected table item to local storage
            const lsItem: string = localStorage.getItem(this.selItemSecondaryIdLocalStorageKey);
            if (!lsItem || lsItem === 'undefined' && selTableRowData &&
              selTableRowData.hasOwnProperty(this.detailViewFormKey)) {
              const selTableItemValue: string = selTableRowData[this.detailViewFormKey];
              if (selTableItemValue) {
                localStorage.setItem(this.selItemSecondaryIdLocalStorageKey, selTableItemValue);
              }
            }

            // try to load detail view form
            await this.setDetailForm();
          } else {
            console.log(new Error('tableData is empty!'));
          }
        });
      }
    } else {
      await this.detailViewListComponents.loadEmptyForm(primaryKey, primaryValue, tableTem);
    }
  }

  /**
   * load detail view form:
   * - after detail view form initialization (ngAfterViewInit()) a service message will be send from
   * dynamic-form component (ngAfterViewInit() with refTableName as 'dynamicForm') and setDetailForm() will triggered
   * - if form is not initialized yet, form will be not loaded and an error message will be returned.
   *
   * @private
   */
  private async setDetailForm() {
    let getFormKey: string;
    let getFormValue: string;
    let selItemId: string = this.selItemSecondaryIdLocalStorageKey ?
      localStorage.getItem(this.selItemSecondaryIdLocalStorageKey) : undefined;
    getFormKey = selItemId ? this.detailViewPrimaryRefTableColumnName : this.primaryRefTableColumnName;
    getFormValue = selItemId ? selItemId : localStorage.getItem(this.selItemPrimaryLocalStorageKey);
    // overwrite form params (e.g. by ITMNUM), if ID values are available
    if (this.detailViewFormKey && this.detailViewFormValue) {
      getFormKey = this.detailViewFormKey;
      getFormValue = localStorage.getItem(this.detailViewFormValue);
    }
    // Load data for form...
    // If form is not loaded, check if params (getFormKey, getFormValue) are set.
      await this.detailViewListComponents.setForm(getFormKey, getFormValue, '', '', this.detailViewRefTable);
    this.evalFormResult();
  }

  async createItem(flagIsDetailView): Promise<void> {
    let tableTmp;
    this.newItemMode = true;
    this.emptyForms();
    if (this.detailViewListComponents) {
      this.detailViewListComponents.setNewItemMode(this.newItemMode);
      this.detailViewListComponents.setRefTable(this.refTable);
      this.setParentRefTable();
      if(flagIsDetailView) {
        this.detailViewListComponents.setIsDetailView(flagIsDetailView);
        tableTmp = this.detailViewRefTable;
      } else {
        this.detailViewListComponents.setIsDetailView(flagIsDetailView);
        tableTmp = this.refTable;
      }
      await this.getTableAndFormData(this.primaryRefTableColumnName, this.emptyProductComponentId, tableTmp);
    }
  }

  private evalFormResult(): void {
      // Unblock table click
      this.isTableClicked = false;

      if (this.tableComponent) {
        this.tableComponent.setIsLoadingResults(false);
      }
  }

  private resetTable(): void {
    localStorage.removeItem(this.selItemPrimaryLocalStorageKey);
    localStorage.removeItem(this.selItemSecondaryLocalStorageKey);
    this.selTableRow = undefined;
    // this.lastSelTableRow = undefined;
    this.tableComponent.setSelTableRow(this.selTableRow);
    this.tableComponent.selTableRow = this.selTableRow;
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  /** Function to call from children
   * https://stackoverflow.com/a/50585796
   **/
  get productComponentsResetFormFunc() {
    return this.resetForm.bind(this);
  }

  async resetForm(): Promise<void> {
    this.emptyForms();
    if (!this.newItemMode) {
      this.resetTable();
    } else {
      this.newItemMode = false;
      this.detailViewListComponents.setNewItemMode(this.newItemMode);
      this.refreshTableViews();
    }
  }

  get refreshTableViewsFunc() {
    return this.refreshTableViews.bind(this);
  }

  /**
   * reset variables and call ng after view init to complete refresh view component
   *
   * @private
   */
  private refreshTableViews(): void {
    this.resetVars();
    this.ngAfterViewInit();
  }

  get loadFormFunc() {
    return this.loadForm.bind(this);
  }

  loadForm(): void {
    // this.loadFormData(this, this.selTableRow.ITMNUM.toString());
  }

  get tableUpdateFunc() {
    return this.tableUpdate.bind(this);
  }

  /**
   * table update
   *
   * @param viewType
   * @param selTableRow
   */
  async tableUpdate(viewType: ComponentViewTypes = ComponentViewTypes.Table,
                    selTableRow: SoasModel = undefined): Promise<void> {
    this.emptyForms();
    this.newItemMode = false;
    await this.refreshView(viewType, selTableRow);
  }

  /**
   * refresh view - called after service has loaded form data
   *
   * @param viewType
   * @param selTableRow
   * @private
   */
  private async refreshView(viewType: ComponentViewTypes = ComponentViewTypes.Table,
                            selTableRow: SoasModel = undefined): Promise<void> {
    if (this.tableComponent) {
      if (this.detailViewListComponents) {
        if (this.selTableRow && this.selTableRow[this.primaryRefTableColumnName] &&
          this.selTableRow[this.primaryRefTableColumnName] !== '') {
          if (viewType === ComponentViewTypes.Table) {
            this.tableComponent.setSelTableRow(this.selTableRow);
            this.tableComponent.selTableRow = this.selTableRow;
            // set detail view first, after all view components are loaded: detail table and form
            await this.setDetailView();
          } else if (viewType === ComponentViewTypes.Details) {
            // select detail view table item: selTableRow instanceof ProductComponents)
            if (selTableRow && (selTableRow[this.primaryRefTableColumnName] &&
              selTableRow[this.primaryRefTableColumnName] !== '')) {
              this.detailViewListComponents.setSelTableRow(selTableRow);
            }
          }
        }
      }
      this.tableComponent.setIsTableClicked(false);
      this.tableComponent.setDisabledCreateButton(false);
      this.tableComponent.setIsLoadingResults(false);
    }
  }

  get tableCreateFunc() {
    this.isDetailView = false;
    return this.tableCreate.bind(this,this.isDetailView);
  }


  get detailViewTableCreateFunc() {
    this.isDetailView = true;
    return this.tableCreate.bind(this,this.isDetailView);
  }

  async tableCreate(id): Promise<void> {
    await this.createItem(id);
  }

  // private refreshTableViews(): void {
  //   this.resetForm();
  // }

  get listResetFormFunc() {
    return this.listResetForm.bind(this);
  }

  async listResetForm(): Promise<void> {
    this.emptyForms();
    if (!this.newItemMode) {
      this.resetTable();
    } else {
      this.newItemMode = false;
      this.detailViewListComponents.setNewItemMode(this.newItemMode);
      this.refreshTableViews();
    }
  }

  /**
   * condition if table (on the left side) should be displayed
   * - if new item mode is true
   * - if last selected table row is set
   * - is currently selected table row is set
   */
  shouldDisplayTable(): string {
    return (this.tableComponent && this.tableComponent.dataSource &&
      this.tableComponent.dataSource.page$) ? 'block' : 'none';
  }

  /**
   * condition if form (on the right side) should be displayed
   * - if new item mode is true
   * - if last selected table row is set
   * - is currently selected table row is set
   */
  shouldDisplayForm(): string {
    return (this.newItemMode || this.selTableRow) ? 'block' : 'none';
  }

  /**********************************************************************
   * SETTER METHODS
   **********************************************************************/

  /**
   * set referral table name
   *
   * @param name
   */
  setReferralTable(name: string) {
    this.refTable = name;
  }

  /**
   * set detail view referral table name
   *
   * @param name
   */
  setDetailViewRefTable(name: string) {
    this.detailViewRefTable = name;
  }

  /**
   * set detail view primary referral table column name
   *
   * @param column
   */
  setDetailViewPrimaryRefTableColumnName(column: string) {
    this.detailViewPrimaryRefTableColumnName = column;
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
   * set selected item primary local storage key
   *
   * @param key
   */
  setSelItemPrimaryLocalStorageKey(key: string) {
    this.selItemPrimaryLocalStorageKey = key;
    this.formService.setSelItemLocalStorageKey(key);
  }

  /**
   * set selected item secondary local storage key
   *
   * @param key
   */
  setSelItemSecondaryLocalStorageKey(key: string) {
    this.selItemSecondaryLocalStorageKey = key;
    this.formService.setSelDetailsItemLocalStorageKey(key);
  }

  /**
   * set selected item primary ID local storage key
   *
   * @param key
   */
  setSelItemPrimaryIdLocalStorageKey(key: string) {
    this.selItemPrimaryIdLocalStorageKey = key;
  }

  /**
   * set selected items secondary ID local storage key
   *
   * @param key
   */
  setSelItemSecondaryIdLocalStorageKey(key: string) {
    this.selItemSecondaryIdLocalStorageKey = key;
  }

  /**
   * set page params primary column name. need to be set for attributes, otherwise empty string ''.
   *
   * @param column
   */
  setPageParamsPrimaryColumnName(column: string) {
    this.pageParamsPrimaryColumnName = column;
  }

  /**
   * set page params primary column value. need to be set for attributes, article-components, otherwise empty string ''.
   *
   * @param value
   */
  setPageParamsPrimaryColumnValue(value: string) {
    this.pageParamsPrimaryColumnValue = value;
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
   * set detail view table title
   *
   * @param title
   */
  setDetailTableTitle(title: string) {
    this.detailTableTitle = title;
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
   * set detail view form title
   *
   * @param title
   */
  setDetailFormTitle(title: string) {
    this.detailFormTitle = title;
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
   * set create new item title
   *
   * @param title
   */
    setDetailViewCreateTitle(title: string) {
      this.detailViewCreateTitle = title;
    }


  /**
   * set title detail view create button
   *
   * @param createDetailviewButtonTitle
   */
   public setCreateDetailviewButtonTitle(createDetailviewButtonTitle: string): void {
     console.log(createDetailviewButtonTitle);
   this.createDetailviewButtonTitle = createDetailviewButtonTitle;
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
   * set main table view columns to hide
   *
   * @param columns
   */
  setTableViewColumnsToHide(columns: string[]) {
    this.tableViewColumnsToHide = columns;
  }

  /**
   * set detail view table view columns to hide
   *
   * @param columns
   */
  setDetailViewTableColumnsToHide(columns: string[]) {
    this.detailViewTableColumnsToHide = columns;
  }

  /**
   * set main table view displayed columns
   *
   * @param columns
   */
  setTableViewDisplayedColumns(columns: string[]) {
    this.tableViewDisplayedColumns = columns;
  }

  /**
   * set detail view table displayed columns
   *
   * @param columns
   */
  setDetailViewTableDisplayedColumns(columns: string[]) {
    this.detailViewTableDisplayedColumns = columns;
  }

  /**
   * set table view search column
   * @param column
   */
  setTableViewSearchColumn(column: string) {
    this.tableViewSearchColumn = column;
  }


  /**
   * set table view additional search columns
   * @param columns
   */
  setTableViewAdditionalSearchColumns(columns: string) {
    this.tableViewAdditionalSearchColumns = columns;
  }

  /**
   * set table view initial sort
   *
   * @param sort
   */
  setTableViewInitialSort(sort: Sort<any>) {
    this.tableViewInitialSort = sort;
  }


   /**
   * set detail  table view search column
   * @param column
   */
    setDetailTableViewSearchColumn(column: string) {
      this.detailViewTableSearchColumn = column;
    }

  /**
   * set detail view table initial sort
   *
   * @param sort
   */
  setDetailViewTableInitialSort(sort: Sort<any>) {
    this.detailViewTableInitialSort = sort;
  }

  /**
   * set empty model
   *
   * @param emptyModel
   */
  setEmptyModel(emptyModel: SoasModel) {
    this.emptyModel = emptyModel;
    this.detailViewListComponents.setEmptyModel(emptyModel);
  }

  /**
   * set main table current page size number
   *
   * @param size
   */
  setCurrPageSizeMainTable(size: number) {
    this.currPageSizeMainTable = size;
  }

  /**
   * set detail table current page size number
   *
   * @param size
   */
  setCurrPageSizeDetailTable(size: number) {
    this.currPageSizeDetailTable = size;
  }

  /**
   * set paginator elements per side for main view table
   *
   * @param elements
   */
  setPaginatorElementsPerSideMainTable(elements: number[]) {
    this.PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE = elements;
  }

  /**
   * set paginator elements per side for detail view table
   *
   * @param elements
   */
  setPaginatorElementsPerSideDetailTable(elements: number[]) {
    this.PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE = elements;
  }

  /**
   * set detail view - form key name
   *
    * @param key
   */
  setDetailViewFormKey(key: string) {
    this.detailViewFormKey = key;
  }

  /**
   * set detail view - form value
   *
   * @param value
   */
  setDetailViewFormValue(value: string) {
    this.detailViewFormValue = value;
  }

  /**
   * set selected item referral table title name
   *
   * @param table
   */
  setSeItemRefTableTitle(table: string) {
    this.formService.setSeItemRefTableTitle(table);
  }

  get refreshDetailsFunc() {
    return this.refreshTableViews.bind(this);
  }

  /**
   * a boolean flag, that in details view the data should be shown based on second table referral name (not primary)
   * true - 2 tables
   * false - 1 table
   *
   * @param flag
   */
  setShowSecondTableDataInDetailsView(flag: boolean) {
    this.showSecondTableDataInDetailsView = flag;
  }
}
