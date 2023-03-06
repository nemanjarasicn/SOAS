import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import {DynamicFormComponent} from '../../dynamic-view/dynamic-form/dynamic-form.component';
import {TableDataService} from '../../_services/table-data.service';
import {Router} from '@angular/router';
import {ConstantsService, SoasModel, ViewQueryTypes} from '../../_services/constants.service';
import {DistComponent} from '../../models/dist-component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ArticleComponent} from '../../interfaces/article-component-item';
import {CustomTableComponent} from '../custom/custom-table/custom-table.component';
import {FormService} from '../../_services/form.service';
import {Sort} from '../custom/custom-table/page';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {MessageService} from 'primeng/api';
import {Observable} from 'rxjs';
import {FetchDataService} from '../../_services/fetch-data.service';
import {MessagesService} from "../../_services/messages.service";
import {FormOptionsLVs, FormOptionsNVs} from "../../interfaces/form-options";
import {DynamicFormService} from "../../_services/dynamic-form.service";

/**
 * Class is used by: priceListSales = PRILISTS, components=DIST_COMPONENTS, warehousing=WAREHOUSING, attributes,
 * prodComponents=PROD_COMPONENTS,
 */

@Component({
  selector: 'app-detail-view-list',
  templateUrl: './detail-view-list.component.html',
  styleUrls: ['./detail-view-list.component.css']
})
export class DetailViewListComponent implements AfterViewInit {

  @Input() resetForm: Function;
  @Input() refreshTable: Function;
  @Input() refreshDetails: Function;
  @Input() detailViewTableCreate: Function;

  // detail view referral table name
  refTable: string;
  // parent view referral table name (set in custom-table-table-form-view)
  parentRefTable: string;

  // Table view
  @ViewChild(CustomTableComponent) tableComponent !: CustomTableComponent;

  displayedColumns: string[] = ['ID','ITMNUM', 'COMPNUM', 'DIST_QTY'];
  initialSort: Sort<DistComponent> = {property: 'ITMNUM', order: 'asc'};

  @ViewChild(DynamicFormComponent) listForm: DynamicFormComponent;

  isFormLoaded: Promise<boolean>;
  detailViewInitialized: boolean;
  

  // empty model to set at new item mode
  emptyModel: SoasModel;

  tableTitle: string;
  listTitle: string;
  createTitle: string;
  createTooltip: string;
  createDetailviewButtonTitle: string;
  detailViewCreateTitle: string;
  IsDetailView: boolean = false;


  showDetailViewCreateButton: boolean = false;

  listSubTitle: string;
  formDisabledFlag: boolean;

  selListItemIndex: number;

  newItemMode: boolean;
  listFormChanged: boolean;

  PAGINATOR_ELEMENTS_PER_SIDE : number[];
  currPageSize: number;
  tableColumnsToHide: string[];
  componentPositionsItems: ArticleComponent[];

  currencies: FormOptionsNVs[] = [{name: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
  pcurrencies: FormOptionsLVs[] = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
  prodUnits = [{name: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
  compnums = [{name: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];

  dividerChar = '#';

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    private tableDataService: TableDataService,
    private router: Router,
    private formService: FormService,
    private messageService: MessageService,
    private messagesService: MessagesService,
    private CONSTANTS: ConstantsService,
    public translatePipe: TranslateItPipe,
    private fetchDataService: FetchDataService,
    private cd: ChangeDetectorRef,
    private dynamicFormService: DynamicFormService
  ) {
    this.tableTitle = 'ARTICLE_COMPONENTS';
    this.listTitle = 'ARTICLE_COMPONENT';
    this.createTitle = 'CREATE_NEW_COMPONENT';
    this.createTooltip = 'CREATE_NEW_COMPONENT'; //'Neue Komponente hinzufügen';
    this.listSubTitle = 'Komponenten-Nr.:'; // 'Komponentennummer:';
    this.resetVars();
    this.formService.setTranslatePipe(translatePipe);
    this.messagesService.setTranslatePipe(translatePipe);
    // form is not disabled by default
    this.formDisabledFlag = false;
  }

  /**
   * after view is initialized
   */
  public ngAfterViewInit(): void {
    this.listForm = new DynamicFormComponent(this.fetchDataService, this.dynamicFormService);
    this.detailViewInitialized = true;
    this.cd.detectChanges();

    this.tableComponent.close = this.close
    this.tableComponent.onFormSubmit = this.save
  }

  public resetVars(): void {
    this.isFormLoaded = Promise.resolve(false);
    this.newItemMode = false;
    this.listFormChanged = false;
    this.componentPositionsItems = [];
    this.detailViewInitialized = false;
  }

  public setPaginator(paginatorPerSide: number []): void {
    this.PAGINATOR_ELEMENTS_PER_SIDE = paginatorPerSide;
    this.currPageSize = paginatorPerSide[0];
  }

  public setSelTableRow(selRow: SoasModel): void {
    if (selRow && this.tableComponent) {
      this.tableComponent.setSelTableRow(selRow);
    } else {
      console.log('ERROR: selRow or customTableComponent is not set!');
    }
  }

  public setRefTable(table: string): void {
    this.refTable = table;
    if (this.tableComponent) {
      this.tableComponent.refTable = table;
    }
  }

  public setTableColumnsToHide(tableColumnsToHide: string[]): void {
    this.tableColumnsToHide = tableColumnsToHide;
  }

  public setCurrencies(cr: FormOptionsNVs[]): void {
    this.currencies = cr;
  }

  public setPCurrencies(pcr: FormOptionsLVs[]): void {
    this.pcurrencies = pcr;
  }

  public setIsDetailView(IsDetailView: boolean): void {
    this.IsDetailView = IsDetailView;
  }

  /**
   * set show detail view create button
   *
   * @param showDetailViewCreateButton
   */
   public setShowDetailViewCreateButton(showDetailViewCreateButton: boolean): void {
   this.showDetailViewCreateButton = showDetailViewCreateButton;
 }


 /**
   * create item
   */
  createItem(): void {
    console.log(0);
    this.detailViewTableCreate();
  }

  /**
   * Loads table data for:
   * detail view table via custom-table > getDataSource()..
   *
   * @param primaryKey
   * @param primaryValue
   * @param secondaryKey
   * @param secondaryValue
   * @param getFormKey - key for loading form data
   * @param getFormValue - value for loading form data
   * @param searchColumn
   * @param additionalSearchColumns
   * @param displayedColumns
   */
  public async loadTableData(primaryKey: string, primaryValue: string, secondaryKey: string, secondaryValue: string,
                             getFormKey: string, getFormValue: string,
                             searchColumn: string, additionalSearchColumns: string,
                             displayedColumns: string[]): Promise<Observable<Object> | undefined> {

    if (!primaryValue || primaryValue === '') {
      console.log('ERROR: getFormData - itemNumber is empty...');
      return;
    }
    this.displayedColumns = displayedColumns;
    let refTableTitle: undefined | string;
    let selItemNumber: undefined | string;
    // get referral table name for checking table locks
    const __ret = this.getTableAndDataset(refTableTitle, selItemNumber);
    refTableTitle = __ret.refTableTitle;
    selItemNumber = __ret.selItemNumber;
    if (refTableTitle === undefined || selItemNumber === undefined) {
      console.log('ERROR: getFormData - articleNumber is empty...');
      return;
    }
    let lockedMessage: string = this.translatePipe.transform('TABLE_LOCK_MESSAGE_LOCKED');
    let isLockedResult = await this.tableDataService.isTableLocked(refTableTitle, primaryValue, lockedMessage);
    this.formDisabledFlag = !!isLockedResult;
    if (!this.tableComponent) {
      console.log('ERROR: getFormData - customTableComponent is empty...');
      return;
    }
    this.tableComponent.setLabels(this.tableTitle, this.createTitle);
    this.tableComponent.setParentRefTable(this.parentRefTable);
    // Load data for the detail view table via getDataSource()...
    this.tableComponent.setPageParams(this.refTable, primaryKey, primaryValue, secondaryKey,
      secondaryValue, searchColumn, additionalSearchColumns, this.displayedColumns, ViewQueryTypes.DETAIL_TABLE);
    this.tableComponent.setPaginatedDataSource(this.currPageSize);

    return this.tableComponent.getDataSource();
  }

  /**
   * load empty form if new item mode is true
   *
   * @param primaryKey
   * @param primaryValue
   */
  
  async loadEmptyForm(primaryKey: string, primaryValue: string, tableEmp:string) {
    this.setSelTableRow(this.emptyModel);
    await this.setForm(primaryKey, primaryValue, undefined, undefined, tableEmp);
  }
  /**
   * set table data - subscribe to fetch data service
   *
   * @param selItemId
   * @param selItemKey
   * @param selItemValue
   * @private
   */
  public async setTableData(selItemId: string, selItemKey: string, selItemValue: string): Promise<void> {
    let data: {} = await this.tableComponent.getDataSource();
    this.tableComponent.selTableRow = await this.tableComponent.setTableItems(data,
      selItemKey, selItemValue, true, selItemId);
    this.tableComponent.setSelTableRow(this.tableComponent.selTableRow);
    this.tableComponent.setSelectionModel();
  }

  /**
   * set form - loads form data of selected detail view table item via form.service > getFormConfigData()
   *
   * @param itemColumn
   * @param itemNumber
   * @param secondColumn
   * @param secondId
   */

   public async setForm(itemColumn: string, itemNumber: string, secondColumn: string, secondId: string, tablePar:string)
   : Promise<void> {

    // TODO check and remove
    // if (this.detailViewInitialized === false) {
    //   return {result: false, method: 'setForm - detailViewInitialized is false...'};
    // }
    this.listForm.resetForm();

    // get form config data: model - data model with values; fields - form fields from FORM_TEMPLATES table
    let result: { model: SoasModel, fields: FormlyFieldConfig[] } =
      await this.formService.getFormConfigData(
        tablePar,
        this.newItemMode,
        itemColumn,
        itemNumber,
        secondColumn,
        secondId,
        undefined,
        false
      );

    this.setListFormData(result);
  }

  /**
   * set forms config, selection, model and fields
   *
   * @param result
   * @private
   */
  private setListFormData(result: { model: SoasModel, fields: FormlyFieldConfig[] }): void {
    this.listForm.setModel(result.model);
    this.listForm.setFields(result.fields);
  }

  showItem(itemList: number): void {
    this.selListItemIndex = itemList;
  }

  /**
   * reset details table selection by removing local storage item
   *
   * @private
   */
  private resetSelection(): void {
    this.selListItemIndex = 0;
    this.resetForm();
  }

  async close(): Promise<void> {
    this.emptyForms();
    if (this.newItemMode) {
      this.newItemMode = false;
      this.resetForm();
    } else {
      this.resetSelection();
      await this.tableDataService.removeAllTableLocks(true, '', '');
    }
    // this.resetForm();
  }


  onFormSubmit() {
    this.save().then(() => {
      // do nothing...
    });
  }



  public emptyForms(): void {
    if (this.tableComponent && this.tableComponent.selTableRow) {
      this.tableComponent.selTableRow = undefined;
    }
    this.selListItemIndex = 0;
    if (this.tableComponent && this.tableComponent.selectionModel) {
      this.tableComponent.selectionModel.clear();
    }
    if (this.listForm) {
      this.listForm.resetForm();
    }
  }

  public setNewItemMode(flag: boolean): void {
    this.newItemMode = flag;
  }

  async save(): Promise<void> {
    let formValues: SoasModel = this.listForm.form.getRawValue();
    let fields: FormlyFieldConfig[] = this.listForm.formlyFieldConfig;

    let saveResultData: { result: boolean, message: string, refTable: string } =
      await this.formService.saveForm({formValues: formValues, fields: fields});


    if (saveResultData) {
      if (saveResultData.result) {
        this.messagesService.showSuccessMessage(this.translatePipe.transform(saveResultData.message));
      } else {
        this.messagesService.showErrorMessage(this.translatePipe.transform(saveResultData.message));
      }
      this.emptyForms();
      // after saving refresh complete view, because redirect to referral table name from form is not working for
      // views with 2 tables, for example: attributes, taxes.
      this.refreshTable(); // this.tableDataService.redirectTo('//' + saveResultData.refTable);
    } else {
      this.messagesService.showErrorMessage('ERROR_DURING_SAVING');
    }
  }

  /**
   * set form changed
   *
   * @param flag
   */
  public setFormChanged(flag: boolean): void {
    this.listFormChanged = flag;
  }

  /**
   * get table and data set for custom-table-table-form view types
   *
   * @param refTableTitle - detail view referral table name
   * @param selItemNumber  -
   * @private
   */
  getTableAndDataset(refTableTitle: string, selItemNumber: undefined | string):
    { refTableTitle: string, selItemNumber: string } {
    refTableTitle = this.formService.selItemRefTableTitle;
    // example for articles: selItemNumber = this.CONSTANTS.LS_SEL_ITEM_NUMBER
    selItemNumber = localStorage.getItem(this.formService.selItemLocalStorageKey);
    return {refTableTitle, selItemNumber};
  }

  /**
   * set form titles
   *
   * @param formTabTitle
   * @param formTitle
   * @param articleTitle
   * @param articlesDetailsTitle
   * @param createTitle
   * @param createDetailviewButtonTitle
   */
  public setLabels(formTabTitle: string, formTitle: string, articleTitle: string, articlesDetailsTitle: string,
                   createTitle: string, createDetailviewButtonTitle:   string, detailViewCreateTitle: string): void {
    this.tableTitle = formTabTitle;
    this.listTitle = formTitle;
    this.createTitle = createTitle;
    this.createTooltip = createTitle;
    this.listSubTitle = articleTitle;
    this.createDetailviewButtonTitle =  createDetailviewButtonTitle;
    this.detailViewCreateTitle = detailViewCreateTitle
  }

  public setFormOptions(refTable: string, options: FormOptionsNVs[]): void {
    switch (refTable) {
      case this.CONSTANTS.REFTABLE_PRODUCT_COMPONENTS:
        this.prodUnits = options;
        break;
      default:
        break;
    }
  }

  get tableUpdateFunc() {
    return this.tableUpdate.bind(this);
  }

  tableUpdate(selTableRow: SoasModel): void {
    this.newItemMode = false;
    this.emptyForms();
    this.setSelTableRow(selTableRow);
    this.refreshTable();
  }

  get tableCreateFunc() {
    return this.tableCreate.bind(this);
  }

  tableCreate(): void {
  }

  public setPageSize(currPageSize: number): void {
    this.currPageSize = currPageSize;
  }

  /**
   * condition if table should be displayed
   * - if new item mode is true
   */
  shouldDisplayTable(): string {
    return this.newItemMode ? 'none' : 'inherit';
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
   * get temp referral table name - is a workaround to load single table components (custom-table-table-form) detail
   * view: prilist, article-components, product-components, warehousing
   */
  public getTempRefTable(): string {
    return this.parentRefTable ? this.parentRefTable : this.refTable;
  }

  /**
   * set parent referral table name
   *
   * @param table
   */
  setParentRefTable(table: string) {
    this.parentRefTable = table;
  }
}
