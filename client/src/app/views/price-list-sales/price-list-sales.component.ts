import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Router} from '@angular/router';
import {
  ComponentViewTypes,
  ConstantsService,
  OptionsTypes,
  SoasModel,
  ViewQueryTypes
} from '../../_services/constants.service';
import {SelectionModel} from '@angular/cdk/collections';
import {TableDataService} from '../../_services/table-data.service';
import {CustomTableComponent} from '../custom/custom-table/custom-table.component';
import {FormService} from '../../_services/form.service';
import {MessageService} from 'primeng/api';
import {TableItem} from '../../interfaces/table-item';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {FetchDataService} from '../../_services/fetch-data.service';
import {PriceListSales} from '../../models/price-list-sales';
import {CustomPTableComponent} from '../custom/custom-p-table/custom-p-table.component';
import {PricelistSales} from '../../interfaces/price-list-sales-item';
import {FetchTableService} from '../../_services/fetch-table.service';
import {PriceListSalesService} from './price-list-sales.service';
import {HelperService} from '../../_services/helper.service';
import {Sort} from '../custom/custom-table/page';
import {MessagesService} from "../../_services/messages.service";
import {OptionsService} from "../../_services/options.service";

@Component({
  selector: 'app-price-list-sales',
  templateUrl: './price-list-sales.component.html',
  styleUrls: ['./price-list-sales.component.css'],
  providers: [TranslateItPipe, MessageService]
})

/**
 * PriceListSalesComponent - price list sales view component with a CustomTableTableFormViewComponent:
 * table (on left) and table + form (on right)
 *
 * table:    [PRILISTS]
 * refTable: priceListSales
 */
export class PriceListSalesComponent implements OnInit, AfterViewInit {

  @ViewChild(CustomPTableComponent) pTable !: CustomPTableComponent;
  pTableCols: any[]; // positions table columns
  pTableRows: number; // positions table visible rows number

  refTable: string = this.CONSTANTS.REFTABLE_PRILISTS;
  emptyPrilistNumber: string = this.CONSTANTS.UNIVERSAL_ID_PLACEHOLDER;
  allowMultiSelect: boolean;

  @ViewChild(CustomTableComponent) tableComponent !: CustomTableComponent;
  // @ViewChild(DetailViewListComponent) detailViewListComponents !: DetailViewListComponent;

  isMainTableViewLoaded: boolean;

  selTableRow: PriceListSales;
  lastSelTableRow: PriceListSales;
  selTableIndex: number;
  setClickedRow: Function;
  isTableClicked: boolean;

  tableForm: FormGroup;
  // ToDo: Manage to replace hardcoded column names for the tables by the database items:
  //  TEMPLATE_FIELDS (left) and DETAIL_VIEW (right)
  // ['ID','ITMNUM','PRICE_NET','PRICE_BRU','CURRENCY','PRILIST','CUSGRP']
  displayedColumns: string[] = [
    'PRILIST',
    'CUSGRP'
  ];
  // ToDo: Make sure that the order of the items should be viewed in the same order like at detailDisplayedColumns
  //  Now the order is set at price-list-sales.service => getPriceListPositionCols()
  detailDisplayedColumns: string[] = [
    'ITMNUM',
    'PRILIST',
    'CUSGRP',
    'PRICE_NET',
    'PRICE_BRU',
    'CURRENCY',
    'START_DATE',
    'END_DATE',
    'PRIORITY'
  ];
  initialSort: Sort<PriceListSales> = {property: 'CUSGRP', order: 'asc'};
  tableColumnsToHide: string[];
  tableTitle: string;
  PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE: number[];
  PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE: number[];
  currPageSizeMainTable: number;
  currPageSizeDetailTable: number;
  selectionModel: SelectionModel<TableItem>;

  detailTableTitle: string;
  detailFormTitle: string;
  createTitle: string;
  createTooltip: string;
  editTooltip: string;
  deleteTooltip: string;

  newItemMode: boolean;

  // form options that are required
  formOptionsToLoad: OptionsTypes[];

  // fetch data subscription
  serviceSubscription: Subscription;
  // fetch table subscription
  serviceTableSubscription: Subscription;

  /** buttons & inputs definitions */
  @ViewChild('saveButton', {static: false}) saveButton: ElementRef;

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
    private fetchDataService: FetchDataService,
    private fetchTableService: FetchTableService,
    public priceListSalesService: PriceListSalesService,
    private helperService: HelperService
  ) {
    this.priceListSalesService.setTranslatePipe(this.translatePipe);
    this.tableTitle = 'PRICELISTS_SALES';
    this.detailTableTitle = 'PRICE_LISTS';
    this.detailFormTitle = 'PRICELIST';
    this.createTitle = 'CREATE_NEW_PRILIST';
    this.createTooltip = 'ADD_NEW_PRILIST';
    this.pTableRows = this.CONSTANTS.PRILISTS_PTABLE_MAX_ROWS;
    this.pTableCols = this.priceListSalesService.getPriceListPositionCols();
    this.allowMultiSelect = false;
    // load only needed form options...
    this.formOptionsToLoad = [OptionsTypes.currencies];
    this.resetVars();
    messagesService.setTranslatePipe(translatePipe);
    optionsService.setTranslatePipe(translatePipe);
    formService.setTranslatePipe(translatePipe);
  }

  ngOnInit() {
    localStorage.setItem(this.CONSTANTS.LS_SEL_REF_TABLE, this.refTable);
    this.PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE = this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE_BIG;
    this.PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE = this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE_THREE;
    this.currPageSizeMainTable = this.CONSTANTS.PAGINATOR_MAX_ELEMENTS_SMALL;
    this.currPageSizeDetailTable = this.CONSTANTS.PAGINATOR_MAX_ELEMENTS_MINI;
    if (this.tableComponent) {
      this.tableComponent.setPaginator(this.PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE);
      this.tableComponent.setPageSize(this.currPageSizeMainTable);
    }
    this.disableSaveButton(true);
    // subscribe to wait for loaded changes
    this.serviceSubscription = this.fetchDataService.getDataObs().subscribe(async (selTableData) => {
      if (this.tableComponent) {
        this.tableComponent.selectionIndex = undefined;
      }
      if (selTableData && selTableData.selTableRow) {
        let viewType: ComponentViewTypes;
        if (selTableData.refTableName === this.CONSTANTS.REFTABLE_PRILISTS) {
          this.selTableRow = selTableData.selTableRow as PriceListSales;
          viewType = ComponentViewTypes.Table;
          // reset flag to be able to load detail view
          this.isMainTableViewLoaded = false;
        } else if (selTableData.refTableName === this.CONSTANTS.REFTABLE_PRILISTS_DETAILS) {
          // this.detailViewListComponents.customTableComponent.selTableRow = selTableData.selTableRow;
          viewType = ComponentViewTypes.Details;
        }
        await this.tableUpdate(viewType);
      } else {
        if (this.tableComponent) {
          this.tableComponent.setIsTableClicked(false);
          this.tableComponent.setIsLoadingResults(false);
        }
      }
    });

    this.serviceTableSubscription = this.fetchTableService.getDataObs().subscribe(async (tableData) => {
      if (this.isMainTableViewLoaded && tableData) {
        this.disableSaveButton(tableData.disableSaveButton);
        if (tableData.refreshDetailView) {
          // refresh all views (left & right tables)
          this.setupTableView();
        }
      }
    });
  }

  /**
   * after view is initialized, setup table and then form by loading data from database
   */
  public ngAfterViewInit(): void {
    this.isMainTableViewLoaded = this.tableComponent ? this.setupTableView() : false;
  }

  ngOnDestroy() {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
    if (this.serviceTableSubscription) {
      this.serviceTableSubscription.unsubscribe();
    }
  }

  private resetVars() {
    this.isMainTableViewLoaded = false;
    this.newItemMode = false;
    this.selTableRow = undefined;
    this.selTableIndex = undefined;
    this.isTableClicked = false;
    // define table columns that are loaded by default, but should be not visible for user
    this.tableColumnsToHide = ["ID"]; // "CURRENCY"
    if (this.tableComponent) {
      this.tableComponent.setIsTableClicked(false);
      this.tableComponent.setDisabledCreateButton(true);
    }
  }


  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  /**
   * setup left table view
   * - initialize custom table
   *
   * @private
   */
  private setupTableView(): boolean {
    // let selItmnum = localStorage.getItem(this.CONSTANTS.LS_SEL_PRICELISTS_ITEM_NUMBER);
    let selPrilist = localStorage.getItem(this.CONSTANTS.LS_SEL_PRICELISTS_PRILIST);
    // set selected item ls key and referral table ( used for detail-view-list > getTableAndDataset() )
    this.formService.setSelItemLocalStorageKey(this.CONSTANTS.LS_SEL_PRICELISTS_ITEM_NUMBER);
    this.formService.setSelDetailsItemLocalStorageKey(this.CONSTANTS.LS_SEL_PRICELISTS_DETAIL_ID);
    this.formService.setSeItemRefTableTitle(this.CONSTANTS.REFTABLE_PRILISTS_TITLE);
    if (this.tableComponent) {
      this.tableComponent.setPageParams(this.CONSTANTS.REFTABLE_PRILISTS,
        this.CONSTANTS.REFTABLE_PRILISTS_COLUMN_PRILIST, selPrilist, "", "",
        this.CONSTANTS.REFTABLE_PRILISTS_COLUMN_PRILIST, "ID,PRICE_NET,PRICE_BRU,CURRENCY,PRILIST,CUSGRP,ITMNUM",
        this.displayedColumns, ViewQueryTypes.MAIN_TABLE);
      // @ts-ignore
      this.tableComponent.setInitialSort(this.initialSort);
      this.tableComponent.setIsLoadingResults(true);
      this.tableComponent.setPaginator(this.PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE);
      this.tableComponent.setTableColumnsToHide(this.tableColumnsToHide);
      this.tableComponent.setLabels(this.tableTitle, this.createTitle);
      this.tableComponent.setShowCreateButton(true);
      this.tableComponent.setPageSize(this.currPageSizeMainTable);

      let selPrilistPrilist = localStorage.getItem(this.CONSTANTS.LS_SEL_PRICELISTS_PRILIST);
      let selPrilistCusGrp = localStorage.getItem(this.CONSTANTS.LS_SEL_PRICELISTS_CUSGRP);
      if (!localStorage.getItem(this.CONSTANTS.LS_SEL_PRICELISTS_DETAIL_ID)) {
        if (selPrilistPrilist) {
          localStorage.setItem(this.CONSTANTS.LS_SEL_PRICELISTS_DETAIL_ID, selPrilistPrilist);
        }
      }
      this.tableComponent.setPaginatedDataSource(this.currPageSizeMainTable);

      // load data for table via data source observable. loaded data will be processed in
      // serviceSubscription > refreshView, where form data will be loaded via setAndLoadFormData
      let obsData: Observable<any> = this.tableComponent.getDataSource();
      obsData.subscribe(async (data: any) => {

        // load form options from form service, before form is loaded
        await this.optionsService.initializeOptions(this.formOptionsToLoad);

        this.tableComponent.setCurrencies(this.optionsService.currencies);
        this.tableComponent.setPCurrencies(this.optionsService.pcurrencies);
        this.tableComponent.setCurrenciesWithId(this.optionsService.currenciesWithId);

        this.selTableRow = await this.tableComponent.setTableItems(data,
          this.CONSTANTS.REFTABLE_PRILISTS_COLUMN_PRILIST, selPrilistPrilist, false, selPrilistCusGrp);
        this.tableComponent.setSelTableRow(this.selTableRow);
        this.tableComponent.setViewQueryType(ViewQueryTypes.MAIN_TABLE);
        await this.setupPTableView();
        this.tableComponent.setClickedRow = this.getClickedRow(this);
        return true;
      });
    } else {
      return false;
    }
  }

  private getClickedRow(self: this) {
    return async function (tableRow: PriceListSales, $event: Event) {
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
   * table click logic
   * - set selected table row
   * - set local storage items
   * - remove table locks
   * - set selection index
   * - send service result: triggers page next() call, to load table data from db
   *
   * @param tableRow
   * @private
   */
  private async tableClickLogic(tableRow: PriceListSales) {
    if (this.tableComponent) {
      this.tableComponent.setIsLoadingResults(true);
      this.tableComponent.setIsTableClicked(true);
      this.newItemMode = false;
      this.selTableRow = tableRow;
      localStorage.setItem(this.CONSTANTS.LS_SEL_PRICELISTS_PRILIST, tableRow.PRILIST);
      localStorage.setItem(this.CONSTANTS.LS_SEL_PRICELISTS_CUSGRP, tableRow.CUSGRP);
      localStorage.setItem(this.CONSTANTS.LS_SEL_PRICELISTS_DETAIL_ID, tableRow.PRILIST);
      await this.tableDataService.removeAllTableLocks(true, "", "");
      this.resetVars();
      this.refreshTableViews();
    } else {
      this.isTableClicked = false;
    }
  }

  /**
   * setup primeng table
   *
   * @private
   */
  private async setupPTableView() {
    let data: any;
    if (this.pTable) {
      if (this.selTableRow && this.selTableRow.PRILIST && this.selTableRow.PRILIST !== "") {
        let optionalParameter: string = this.CONSTANTS.REFTABLE_PRILISTS_COLUMN_CUSGRP;
        let customerColumn = this.CONSTANTS.REFTABLE_PRILISTS_COLUMN_PRILIST;
        let tempRefTable = this.CONSTANTS.REFTABLE_PRILISTS;
        this.pTable.positionsWithId = [];
        this.pTable.setDataKey("ID");
        this.pTable.setCols(this.pTableCols);
        this.pTable.setRows(this.pTableRows);
        this.pTable.setRefTable(this.CONSTANTS.REFTABLE_PRILISTS_DETAILS);
        // this.pTable.inputChangeValidation = this.inputChangeValidation;
        let tableDbData = await this.tableDataService.getTableDataByCustomersNumber(tempRefTable,
          ViewQueryTypes.DETAIL_TABLE, customerColumn, this.selTableRow.PRILIST, optionalParameter,
          this.selTableRow.CUSGRP);
        if (tableDbData) {
          data = [];
          data = tableDbData['table'][1];
          // return {result: false, method: 'getFormData - tableDbData is empty...'};
          this.pTable.initTable(data);
          if (this.pTable.positionsWithId.length) {
            let tmpPriceListPositions: PricelistSales[] = [];
            let counter = 1;
            for (let formElement in this.pTable.positionsWithId) {
              let newItem: PricelistSales = {
                ID: this.pTable.positionsWithId[formElement].ID,
                POS: counter++, // @ts-ignore virtual column for showing position number in view
                ITMNUM: this.pTable.positionsWithId[formElement].ITMNUM, // @ts-ignore
                PRICE_NET: this.pTable.positionsWithId[formElement].PRICE_NET, // @ts-ignore
                PRICE_BRU: this.pTable.positionsWithId[formElement].PRICE_BRU, // @ts-ignore
                CURRENCY:
                  this.helperService.getCurrencyName(this.optionsService.currencies, // @ts-ignore
                    this.pTable.positionsWithId[formElement].CURRENCY), // @ts-ignore
                PRILIST: this.pTable.positionsWithId[formElement].PRILIST, // @ts-ignore
                CUSGRP: this.pTable.positionsWithId[formElement].CUSGRP, // @ts-ignore
                START_DATE: this.pTable.positionsWithId[formElement].START_DATE, // @ts-ignore
                END_DATE: this.pTable.positionsWithId[formElement].END_DATE, // @ts-ignore
                PRIORITY: this.pTable.positionsWithId[formElement].PRIORITY,
              };
              tmpPriceListPositions.push(newItem);
            }
            this.pTable.positionsWithId = tmpPriceListPositions;
            this.pTable.setFullEditMode(true);
          }
        } else {
          console.log('table data is empty!');
        }
        this.isMainTableViewLoaded = true;
        // Unblock table click
        this.isTableClicked = false;
        // set create button enabled, after form was completely loaded
        this.tableComponent.setDisabledCreateButton(false);
        this.tableComponent.setIsTableClicked(false);
      }
    }
  }

/*
  private async setDetailView() {
    if (this.detailViewListComponents) {
      this.detailViewListComponents.setRefTable(this.CONSTANTS.REFTABLE_PRILISTS_DETAILS);
      this.detailViewListComponents.setLabels(this.detailTableTitle, this.detailFormTitle, this.detailFormTitle,
        this.detailFormTitle, this.createTitle);
      this.detailViewListComponents.setTableColumnsToHide(this.tableColumnsToHide);
      this.detailViewListComponents.setCurrencies(this.formService.currencies);
      this.detailViewListComponents.setPCurrencies(this.formService.pcurrencies);
      if (this.detailViewListComponents.customTableComponent) {
        this.detailViewListComponents.customTableComponent.setPaginator(
          this.PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE);
        this.detailViewListComponents.setPageSize(this.currPageSizeDetailTable);
        this.detailViewListComponents.customTableComponent.setCurrencies(this.formService.currencies);
        this.detailViewListComponents.customTableComponent.setPCurrencies(this.formService.pcurrencies);
        this.detailViewListComponents.customTableComponent.setCurrenciesWithId(this.formService.currenciesWithId);
      }
      // let self = this;
      // this.detailViewListComponents.changes.subscribe(cp => {
      //   self.loadDetailViewTableData(self.selTableRow);
      // });
      this.setDetailViewClick();
      if (this.selTableRow && this.selTableRow.PRILIST && this.selTableRow.PRILIST !== "") { // ITMNUM
        // subscribe to fetch data service...
        let articleFormResult = await this.detailViewListComponents.loadTableData(this.selTableRow.PRILIST,
          this.selTableRow.CUSGRP, false);
        this.evalArticleFormResult(articleFormResult);
      }
    }
    this.detailViewInitialized = true;
  }

  private setDetailViewClick() {
    if (this.detailViewListComponents.customTableComponent) {
      let self = this;
      this.detailViewListComponents.customTableComponent.setClickedRow = async function (tableRow, index) {
        this.setSelTableRow(tableRow, index);
        await self.loadDetailViewTableData(tableRow);
      }
    }
  }

  private async loadDetailViewTableData(tableRow) {
    this.detailViewListComponents.setRefTable(this.CONSTANTS.REFTABLE_PRILISTS_DETAILS);
    // ToDo: Switch from PRILIST to ID, to load right detail view form data
    localStorage.setItem(this.CONSTANTS.LS_SEL_PRICELISTS_DETAIL_ID, tableRow['PRILIST']);
    // localStorage.setItem(this.CONSTANTS.LS_SEL_PRICELISTS_DETAIL_ID, tableRow['ID']);
    let articleFormResult = await this.detailViewListComponents.loadTableData(tableRow.PRILIST, tableRow.CUSGRP, true);
    this.evalArticleFormResult(articleFormResult);
  }
*/

  /*******************************************
   * HELPER FUNCTIONS
   ******************************************/

  private resetTable() {
    localStorage.removeItem(this.CONSTANTS.LS_SEL_PRICELISTS_PRILIST);
    localStorage.removeItem(this.CONSTANTS.LS_SEL_PRICELISTS_CUSGRP);
    localStorage.removeItem(this.CONSTANTS.LS_SEL_PRICELISTS_DETAIL_ID);
    this.selTableRow = undefined;
    this.lastSelTableRow = undefined;
  }

  private emptyForms() {
    // if (this.detailViewListComponents) {
    //   this.detailViewListComponents.setNewItem(this.newItemMode);
    // }
  }

  get resetFormFunc() {
    return this.resetForm.bind(this);
  }

  async resetForm() {
    this.disableSaveButton(true);
    if (!this.newItemMode) {
      this.emptyForms();
      this.resetTable();
    } else {
      this.newItemMode = false;
      await this.setupTableView();
      // await this.tableUpdate();
    }
  }

  pageEvent($event: PageEvent) {
    this.currPageSizeMainTable = $event.pageSize;
  }

  async createItem() {
    // ToDo: Manage to add a new price list via p-dialog (with form loaded from FORM_TEMPLATES).
    /*
    this.newItemMode = true;
    this.emptyForms();
    if (this.detailViewListComponents) {
      this.detailViewListComponents.setNewItem(this.newItemMode);
      this.detailViewListComponents.setRefTable(this.CONSTANTS.REFTABLE_PRILISTS_DETAILS);
      let articleFormResult = await this.detailViewListComponents.loadTableData(this.emptyPrilistNumber,
        undefined, false);
      this.evalArticleFormResult(articleFormResult);
    }
     */
  }

  deleteItem(i: any, row: any) {
  }

  get tableUpdateFunc() {
    return this.tableUpdate.bind(this);
  }

  /**
   * table update
   *
   * @param viewType
   */
  async tableUpdate(viewType: ComponentViewTypes = ComponentViewTypes.Table): Promise<void> {
    this.emptyForms();
    this.newItemMode = false;
    await this.refreshView(viewType);
  }

  /**
   * refresh view - called after service has loaded form data
   *
   * @private
   */
  private async refreshView(viewType: ComponentViewTypes = ComponentViewTypes.Table) {
    if (this.tableComponent) {
      if (this.selTableRow && this.selTableRow.PRILIST) { // && (this.selTableRow.hasOwnProperty(this.CONSTANTS.REFTABLE_PRILISTS_COLUMN_PRILIST))
        if (viewType === ComponentViewTypes.Table) {
          this.tableComponent.setSelTableRow(this.selTableRow, this.selTableIndex);
          this.tableComponent.selTableRow = this.selTableRow;
          this.lastSelTableRow = this.selTableRow;
          // ToDo: At every change of left table, the detail (right) table will be reloaded.
          //  But need to be reloaded only at table click (or selection change)
          // this.detailViewInitialized = false;
          await this.setupPTableView();
        } else if (viewType === ComponentViewTypes.Details) {
          // select detail view table item
        }
      } else if (this.lastSelTableRow) {
        // await this.setupPTableView();
      }
      this.tableComponent.setIsTableClicked(false);
      this.tableComponent.setDisabledCreateButton(false);
      this.tableComponent.setIsLoadingResults(false);
    }
  }

  get tableCreateFunc() {
    return this.tableCreate.bind(this);
  }

  tableCreate() {
    this.createItem();
  }

  /**
   * form submit changes on price list positions table - save positions changes to db
   */
  async onPrilistPositionsFormSubmit() {
    let tableValue: any[] = this.pTable.pTable._value; // typeof PriceListDataInterface
    let saveResultData: { result: boolean, message: string } =
      await this.priceListSalesService.savePositions(this.pTable.positionsWithId,
        this.pTable.updatedPositionsRows, tableValue,
        this.selTableRow[this.CONSTANTS.REFTABLE_PRILISTS_COLUMN_PRILIST],
        this.optionsService.currencies);
    await this.evaluateResults(saveResultData);
  }

  /**
   * evaluate save result. show message and refresh table view.
   *
   * @param saveResultData
   * @private
   */
  private async evaluateResults(saveResultData: {result: boolean, message: string}) {
    if (saveResultData) {
      if (this.refTable === this.CONSTANTS.REFTABLE_PRILISTS) {
        this.disableSaveButton(true);
      }
      if (saveResultData.result) {
        // this.selectTab(this.ordersTitle, this.orderPositionsTitle); !!! for update orders...
        this.messagesService.showSuccessMessage(saveResultData.message);
      } else {
        this.messagesService.showErrorMessage(saveResultData.message);
      }
    } else {
      this.messagesService.showErrorMessage('ERROR_DURING_SAVING');
    }
    await this.refreshView();
  }

  /**
   * Manage close of the form view
   */
  async close() {
    await this.onTableFormCancel();
  }

  /**
   * cancel form changes or return to table overview
   */
  async onTableFormCancel() {
    this.emptyForms();
    if (!this.newItemMode) {
      this.resetTable();
    } else {
      this.newItemMode = false;
      // this.detailViewListComponents.setNewItem(this.newItemMode);
      await this.tableUpdate();
    }
  }

  /**
   * Disable or enable save button(s)
   *
   * @param disable: boolean - if true - disable save button
   */
  disableSaveButton(disable: boolean) {
    if (this.saveButton) {
      this.saveButton.nativeElement.disabled = disable;
    }
  }

  private refreshTableViews(): void {
    this.resetVars();
    this.ngAfterViewInit();
  }

  /**
   * condition if form should be displayed
   * - if new item mode is true
   * - if last selected table row is set
   * - is currently selected table row is set
   */
  shouldDisplayForm(): string {
    // selTableRow ? newItemMode ? 'block' : 'flex' : 'none'
    return (this.newItemMode || this.lastSelTableRow || this.selTableRow) ? 'block' : 'none';
  }
}
