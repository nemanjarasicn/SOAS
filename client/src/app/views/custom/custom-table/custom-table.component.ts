import {ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {SelectionModel} from '@angular/cdk/collections';
import {ConstantsService, SoasModel, ViewQueryTypes} from '../../../_services/constants.service';
import {TranslateItPipe} from '../../../shared/pipes/translate-it.pipe';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {TableDataService} from '../../../_services/table-data.service';
import {HelperService} from '../../../_services/helper.service';
import {Sort} from './page';
import {PaginatedDataSource} from './paginated-datasource';
import {ArticleQuery, PageService} from './page.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {FetchDataService} from '../../../_services/fetch-data.service';
import {FormOptionsINV, FormOptionsLVs, FormOptionsNVs} from "../../../interfaces/form-options";
import { MatTable } from '@angular/material/table';
import { MatPaginatorIntlCro } from './MatPaginatorIntlCro';

@Component({
  exportAs: 'customTable',
  selector: 'custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css'],
  providers: [TranslateItPipe, { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro}],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * CustomTableComponent - custom table view for the main (left) table view.
 *
 * Used by: CustomTableFormViewComponent, CustomTableTableFormViewComponent, DetailViewTabGroupComponent
 */
export class CustomTableComponent {

  @Input() tableUpdate: Function;
  @Input() tableCreate: Function;

  @ViewChild('sortHeader', {static: false}) sortHeader: MatSortHeader;
  @ViewChild('searchInput', {static: false}) searchInput: ElementRef;

  formConfig
  onFormSubmit
  close

  showCreateButton: boolean = false;
  // create button is disabled by default and need to be enabled after all data (table and/or form) is loaded
  disabledCreateButton: boolean = true;

  title: string;
  createTitle: string;
  createTooltip: string;

  // @ToDo: Add a class that manage object types
  selTableRow: SoasModel;
  selectionModel: SelectionModel<SoasModel>;
  columnsToDisplay: string[] = [];
  items: SoasModel[];  // e.g. Countries

  displayedColumns = [];
  initialSort: Sort<SoasModel>;
  dataSource: PaginatedDataSource<any, any>;

  // pageService params
  // table view referral table name
  refTable: string;
  // for 2 tables views only: parent view referral table name (set in custom-table-table-form-view)
  parentRefTable: string;
  primaryColumn: string;
  primaryValue: string;
  secondaryColumn: string;
  secondaryValue: string;
  searchColumn: string;
  additionalSearchColumns: string;

  // view query types: 'MAIN_TABLE', 'DETAIL_TABLE', 'PURE_SELECT'
  viewQueryType: ViewQueryTypes;

  PAGINATOR_ELEMENTS_PER_SIDE: number[];
  currPageSize: number;

  tableColumnsToHide: string[];
  selectionIndex: number; // used for keyboard iteration
  selKeyIndex: number;  //used for keyboard test
  allowMultiSelect: boolean;
  currencies: FormOptionsNVs[] = [];
  pCurrencies: FormOptionsLVs[] = [];
  currenciesWithId: FormOptionsINV[] = [];
  countries: any = [];
  csvTemplateConfigs: [] = [];
  setClickedRow: Function;
  doTableSelection: Function;
  isTableClicked: boolean;

  isLoadingResults: boolean = false;
  isRateLimitReached: boolean = false;

  @ViewChild('customTable', {static: false}) customMatTable: MatTable<any>;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private fb: FormBuilder,
              private CONSTANTS: ConstantsService,
              private tableDataService: TableDataService,
              public translatePipe: TranslateItPipe,
              private helperService: HelperService,
              private pageService: PageService,
              private router: Router,
              private fetchDataService: FetchDataService) {
    this.items = [];
    this.tableColumnsToHide = ['ID'];
    this.isTableClicked = false;
    this.allowMultiSelect = false;
  }

  ngOnDestroy(): void {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  /**
   * select table item
   *
   * @param item
   */
  public selectTableItem(item: number): void {
    this.selectionIndex = item;
    this.selKeyIndex = item;
    this.sendServiceResult();
  }

  /**
   * Set table page params
   *
   * @param refTable - referral table name: 'countries'
   * @param primaryColumn - primary column name: ITMNUM or ID
   * @param primaryValue - primary column value:'MARS123' or '123'
   * @param secondaryColumn - secondary column name: COMPNUM
   * @param secondaryValue - secondary column value: '12ABC'
   * @param searchColumn - primary search column name: 'ITMNUM'
   * @param additionalSearchColumns - additional search solumns: 'ID,COMPNUM'
   * @param columnsToDisplay - columns names to display: ['COMPNUM', 'DIST_QTY']
   * @param viewQueryType - type of the table query: MAIN_TABLE, DETAIL_TABLE, PURE_SELECT
   */
  public setPageParams(refTable: string, primaryColumn: string, primaryValue: string, secondaryColumn: string,
                       secondaryValue: string, searchColumn: string, additionalSearchColumns: string,
                       columnsToDisplay: string[], viewQueryType: ViewQueryTypes): void {
    this.refTable = refTable;
    this.primaryColumn = primaryColumn;
    this.primaryValue = primaryValue;
    this.secondaryColumn = secondaryColumn;
    this.secondaryValue = secondaryValue;
    this.searchColumn = searchColumn;
    this.additionalSearchColumns = additionalSearchColumns;
    this.columnsToDisplay = columnsToDisplay;
    this.viewQueryType = viewQueryType;
  }

  /**
   * set view query type: MAIN_TABLE, DETAIL_TABLE, PURE_SELECT.
   *
   * @param viewQueryType
   */
  public setViewQueryType(viewQueryType: ViewQueryTypes): void {
    this.viewQueryType = viewQueryType;
  }

  /**
   * set table items and selection
   *
   * table data:
   * 0: {ID: 511867, ADDRESS_TYPE: 'DLV', CUSTOMERS_NUMBER: '4500000300', ADDRESS_ISO_CODE: 'DE', …}
   * 1: {ID: 511874, ADDRESS_TYPE: 'DLV', CUSTOMERS_NUMBER: '4500000300', ADDRESS_ISO_CODE: 'DE', …}
   *
   * @param tableData - table data, see example above
   * @param selItemKey - 'ID'
   * @param selItemValue - '511874'
   * @param fromDetailView - true
   * @param selItemId - optional
   */
  setTableItems(tableData: {}, selItemKey: string, selItemValue: string, fromDetailView: boolean, selItemId?: string):
    Promise<any> {
    return new Promise(async (resolve) => {
      this.setIsLoadingResults(false);
      // Empty primary value, for loading main table (left side) items...
      if (!fromDetailView) {
        this.primaryValue = '';
      }
      this.items = [];
      for (let item in tableData) {
        if (tableData.hasOwnProperty(item)) {
          this.items.push(tableData[item]);
        }
      }
      const __ret = this.getSelectedIndex(selItemKey, selItemValue, selItemId);
      let selItemFound: boolean = __ret.selItemFound;
      let selectionIndex: number = __ret.selKeyIndex;
      let selKeyIndex: number = __ret.selKeyIndex;
      if (selItemFound && this.selTableRow) {
        // this.selectTableItem(selectionIndex);
        this.selectTableItem(selKeyIndex);
        // this.selectionIndex = __ret.selectionIndex;
        // this.sendServiceResult();
      }
      // select first item
      // this.selTableRow = this.items ? this.items[0] : undefined;
      resolve(this.selTableRow);
    });
  }

  /**
   * get selected item index - go through items, find selected item.
   * returns boolean flag if item was found and selected index as number
   *
   * @param selItemKey
   * @param selItemValue
   * @param selItemId - optional param to detect right item for
   * e.g. WAREHOUSING (detail view can have same ITMNUM, so detection by 3 param (id) needed)
   * @private
   */
  public getSelectedIndex(selItemKey: string, selItemValue: string, selItemId?: string):
    { selItemFound: boolean, selKeyIndex: number } {
    let selectionIndex = 0;
    let selKeyIndex = 0;
    let selItemFound = false;
    if ((selItemValue !== undefined) && (selItemValue !== 'undefined') && selItemValue) {
      for (let item in this.items) {
        if (this.items[item][selItemKey] && this.items[item][selItemKey].toString() === selItemValue.toString()) {
          if (selItemId) {
            if (("ID" in this.items[item]) && // @ts-ignore
              (parseInt(selItemId) === parseInt(this.items[item].ID))) {
              this.selTableRow = this.items[item];
              selItemFound = true;
              break;
            }else if(this.items[item][selItemKey] === selItemValue){
              this.selTableRow = this.items[item];
              selItemFound = true;
              break;
            }
          } else {
            this.selTableRow = this.items[item];
            selItemFound = true;
            break;
          }
        }
        selectionIndex++;
        selKeyIndex++
      }
    } else {
      console.log('Error: LocalStorage selected Id not found...');
    }
    if (!selItemFound) {
      console.log('getSelectedItem ERROR: selected item was not found! ', this.refTable);
    }
    selectionIndex = selItemFound ? selectionIndex : undefined;
    selKeyIndex = selItemFound ? selKeyIndex : undefined;

    if (selKeyIndex === undefined) {
      this.selKeyIndex = undefined;
      this.selTableRow = undefined;
      this.setSelTableRow(this.selTableRow, this.selKeyIndex);
    }
    //return {selItemFound, selectionIndex};
    return {selItemFound, selKeyIndex};
  }

  /**
   * send service result
   */
  public sendServiceResult(): void {
    this.setIsLoadingResults(false);
    this.fetchDataService.setDataObs(this.selTableRow, this.selKeyIndex, this.refTable);
  }

  /**
   * set paginated data source
   *
   * @param pageSize
   */
  public setPaginatedDataSource(pageSize: number): void {
    // Workaround to load single table components (custom-table-table-form) detail view:
    // prilist, article-components, product-components, warehousing
    const tempRefTable = this.getTempRefTable();
    this.currPageSize = this.currPageSize ? this.currPageSize : pageSize;
    this.dataSource = new PaginatedDataSource<any, ArticleQuery>(
      (request, query) =>
        this.pageService.page(
          request,
          query,
          tempRefTable,
          this.primaryColumn,
          this.primaryValue,
          this.secondaryColumn,
          this.secondaryValue,
          this.searchColumn,
          this.additionalSearchColumns,
          this.viewQueryType
        ), this.initialSort, {search: '', registration: undefined}, this.currPageSize);
  }

  /**
   * get temp referral table name - is a workaround to load single table components (custom-table-table-form) detail
   * view: prilist, article-components, product-components, warehousing
   */
  public getTempRefTable() {
    return this.parentRefTable ? this.parentRefTable : this.refTable;
  }

  /**
   * set paginator
   *
   * @param paginatorPerSide
   */
  public setPaginator(paginatorPerSide: number[]): void {
    this.PAGINATOR_ELEMENTS_PER_SIDE = paginatorPerSide;
  }

  /**
   * set page size
   *
   * @param currPageSize
   */
  public setPageSize(currPageSize: number): void {
    this.currPageSize = currPageSize;
  }

  /**
   * set labels
   *
   * @param tableTitle
   * @param createTitle
   */
  public setLabels(tableTitle: string, createTitle: string): void {
    this.title = tableTitle;
    this.createTitle = createTitle;
    this.createTooltip = createTitle;
  }

  /**
   * set selected table row and optional a selected index
   *
   * @param selTableRow
   * @param selIndex
   */
  public setSelTableRow(selTableRow: SoasModel, selIndex?: number): void {
    this.selTableRow = selTableRow;
    if (selIndex) {
      //this.selectionIndex = selIndex;
      this.selKeyIndex = selIndex;
    }
    this.setSelectionModel();
  }

  /**
   * set selection model
   */
  public setSelectionModel(): void {
    this.selectionModel = new SelectionModel<SoasModel>(this.allowMultiSelect, [this.selTableRow]);
  }

  /**
   * set show create button
   *
   * @param showCreateButton
   */
  public setShowCreateButton(showCreateButton: boolean): void {
    this.showCreateButton = showCreateButton;
  }


  /**
   * set create button enabled or disabled by given boolean flag
   *
   * @param flag
   */
  public setDisabledCreateButton(flag: boolean) {
    this.disabledCreateButton = flag;
  }

  /**
   * set columns to display
   *
   * @param columnsToDisplay
   */
  public setColumnsToDisplay(columnsToDisplay: string[]): void {
    this.columnsToDisplay = columnsToDisplay;
  }

  /**
   * set table columns to hide
   *
   * @param tableColumnsToHide
   */
  public setTableColumnsToHide(tableColumnsToHide: string[]): void {
    this.tableColumnsToHide = tableColumnsToHide;
  }

  /**
   * create item
   */
  createItem(): void {
    this.tableCreate();
  }

  /**
   * set current page size = max number of rows
   * @param $event
   */
  pageEvent($event: PageEvent): void {
    this.currPageSize = $event.pageSize;
  }

  /**
   * table key down
   *
   * @param event
   * @param selRow
   * @param selIndex
   */
  async tableKeydown(event: KeyboardEvent, selRow: SoasModel, selIndex: number): Promise<void> {
    event.stopPropagation();
    this.setIsLoadingResults(true);
    let pageSize = this.items.length;
    let change: boolean = false;
    if (!this.selectionIndex) {
      // if necessary, add here a search function for selected item
      this.selectionIndex = 0;
      change = true;
    }
    if (selRow) {
      let newSelection: SoasModel;
      if (event.key === 'ArrowDown') {
        if ((this.selKeyIndex + 1) < pageSize) {
          this.selKeyIndex += 1;
          change = true;
        } else if ((this.selKeyIndex + 1) >= pageSize) {
          this.selKeyIndex = (pageSize - 1);
          change = true;
        }
      } else if (event.key === 'ArrowUp') {
        if ((this.selKeyIndex - 1) >= 0 && (this.selKeyIndex - 1) < pageSize) {
          this.selKeyIndex -= 1;
          change = true;
        } else if ((this.selKeyIndex - 1) < 0) {
          this.selKeyIndex = 0;
          change = true;
        }
      }
      if (change) {
        newSelection = this.items[this.selKeyIndex];
        if (newSelection) {
          await this.setClickedRow(newSelection, this.selKeyIndex, event);
        }
      }
    }
    this.setIsLoadingResults(false);
  }

  /**
   * get data source observable by connect to the pages stream of PaginatedDataSource
   */
  getDataSource(): Observable<Object> {
    if (this.dataSource) {
      return this.dataSource.connect();
    } else {
      console.log('Error: this.dataSource is not set!');
      this.setIsLoadingResults(false);
    }
  }

  /**
   * set countries
   *
   * @param countries
   */
  public setCountries(countries: any[]): void {
    this.countries = countries;
  }

  /**
   * set csv template configs
   *
   * @param csvTemplateConfigs
   */
  public setCsvTemplateConfigs(csvTemplateConfigs: []): void {
    this.csvTemplateConfigs = csvTemplateConfigs;
  }

  /**
   * set currencies
   *
   * @param currencies
   */
  public setCurrencies(currencies: FormOptionsNVs[]): void {
    this.currencies = currencies;
  }

  /**
   * set pCurrencies
   *
   * @param pcr
   */
  public setPCurrencies(pcr: FormOptionsLVs[]): void {
    this.pCurrencies = pcr;
  }

  /**
   * set currencies with id
   *
   * @param currenciesWithId
   */
  public setCurrenciesWithId(currenciesWithId): void {
    this.currenciesWithId = currenciesWithId;
  }

  /**
   * get currency name
   *
   * @param currencyId
   */
  public getCurrencyName(currencyId: string): string {
    // ToDo: Optimize get currency name loading, for faster load (caching)
    for (let cur in this.currenciesWithId) {
      if (parseInt(currencyId) === parseInt(this.currenciesWithId[cur].id)) {
        return this.currenciesWithId[cur].value;
      }
    }
    return ' ';
  }

  /**
   * get currency symbol
   *
   * @param currencyValue
   */
  public getCurrencySymbol(currencyValue: string): string {
    // ToDo: Optimize get currency name loading, for faster load (caching)
    for (let cur in this.currencies) {
      if (parseInt(currencyValue) === parseInt(this.currencies[cur].value)) {
        return this.currencies[cur].name;
      }
    }
    return currencyValue;
  }

  /**
   * set is table clicked. set to true, to block next clicks in the table, until data is completely loaded
   *
   * @param isTableClicked
   */
  public setIsTableClicked(isTableClicked: boolean): void {
    this.isTableClicked = isTableClicked;
  }

  /**
   * get is table clicked
   */
  public getIsTableClicked(): boolean {
    return this.isTableClicked;
  }

  /**
   * set is loading results. set to true, to show overlay and loading animation
   *
   * @param flag
   */
  public setIsLoadingResults(flag: boolean): void {
    this.isLoadingResults = flag;
  }

  /**
   * returns is loading results boolean flag
   */
  public getIsLoadingResults(): boolean {
    return this.isLoadingResults;
  }

  /**
   * get page size (used in view!)
   *
   * @param size
   */
  getPageSize(size: number): number {
    // Add logic to calculate size here...
    return size;
  }

  /**
   * clear search
   */
  clearSearch(): void {
    // this.searchInput.nativeElement.value = '';
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([(this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV
        || this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV) ?
        this.CONSTANTS.REFTABLE_CUSTOMER : this.refTable]));
  }

  /**
   * reset table
   */
  public resetTable(): void {
    this.items = [];
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
    this.dataSource = undefined;
    //this.selectionIndex = undefined;
    this.selKeyIndex = undefined;
    this.setSelTableRow(undefined, undefined);
  }

  /**
   * fetch data at page change < >
   *
   * @param $event
   */
  fetchData($event: PageEvent): void {
    this.setIsLoadingResults(true);
    // reset selection
    //this.selectionIndex = undefined;
    this.selKeyIndex = undefined;
    this.setSelTableRow(undefined, this.selKeyIndex);
    // fetch data calls page.services > page function
    this.dataSource.fetch($event.pageIndex);
  }

  /**
   * set allow multi select
   *
   * @param flag
   */
  setAllowMultiSelect(flag: boolean): void {
    this.allowMultiSelect = flag;
  }

  /**
   * get allow multi select
   */
  getAllowMultiSelect(): boolean {
    return this.allowMultiSelect;
  }

  /**
   * set initial sort ot the table - the default sort setting is at component
   *
   * @param sort
   */
  setInitialSort(sort: Sort<SoasModel>) {
    this.initialSort = sort;
  }

  /**
   * set parent referral table name (for 2 table views only)
   *
   * @param table
   */
  setParentRefTable(table: string) {
    this.parentRefTable = table;
  }

  focusTD(rowNum) {
    this.customMatTable?._getRenderedRows(this.customMatTable._rowOutlet)[rowNum]?.focus();
  }

  setFocus(rowNumber: number) {
    this.focusTD(rowNumber);
  }
}
