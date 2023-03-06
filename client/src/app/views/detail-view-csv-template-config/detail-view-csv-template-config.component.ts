import {Component, Input, OnInit, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {TableDataService} from "../../_services/table-data.service";
import {Router} from "@angular/router";
import {ConstantsService, ViewQueryTypes} from "../../_services/constants.service";
import {DynamicFormComponent} from "../../dynamic-view/dynamic-form/dynamic-form.component";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {HttpErrorResponse} from "@angular/common/http";
import { CustomTableComponent } from "../custom/custom-table/custom-table.component";
import { CSVTemplateConfigs } from "../../models/csvtemplate-configs.model"
import { CSVTemplateConfigsField } from "../../models/csvtemplate-configs-field.model"
import {csvTemplateConfigsItem} from "../../interfaces/csv-template-configs-item";
import {CSVTemplateConfigType} from '../../enums/csvtemplate-config-type.enum'
import {Sort} from "../custom/custom-table/page";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {MessageService} from "primeng/api";
import {TableItem} from "../../interfaces/table-item";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { CustomFormComponent } from "../custom/custom-form/custom-form.component";
import {SelectionModel} from "@angular/cdk/collections";
import {HttpClient} from "@angular/common/http";
import {FormService} from "../../_services/form.service";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-detail-view-csv-template-config',
  templateUrl: './detail-view-csv-template-config.component.html',
  styleUrls: ['./detail-view-csv-template-config.component.css']
})
export class DetailViewCsvTemplateConfigComponent implements OnInit {

  selTableRow: CSVTemplateConfigsField;

 /**
 * Custom details form view component
 */

  @Input() loadForm: Function;
  @Input() resetForm: Function;
  @Input() custResetForm: Function;
  @Input() saveForm: Function;
  @Input() lastIdCsv: string;

   // @ts-ignore
   @ViewChild(DynamicFormComponent) listForm: DynamicFormComponent;

  // @ts-ignore
  @ViewChild(DynamicFormComponent) customForm: DynamicFormComponent;
  //@ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @ViewChildren(CustomTableComponent) customTableComponent !: QueryList<CustomTableComponent>;
  @ViewChildren(CustomFormComponent) customFormComponent !: QueryList<CustomFormComponent>;
  ngForm: FormGroup;
  columnForm: any;
  customFormConfig: FormlyFieldConfig[];
  selRow: any;
  ShowAddInputField: boolean=false;
  numOrder: number;
  setCheckbox: string;
  newItemMode: boolean;
  formConfig: FormlyFieldConfig[];
  formList: FormlyFieldConfig[];
  allListItemsConfig: FormlyFieldConfig[][];
  formDisabledFlag: boolean;
  articlesDetailsShow: boolean;
  tableColumnsToHide: string[];
  listTitle: string;
  listSubTitle: string;

  isLoadingResults: boolean = false;

  refTable: string = this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_FIELD_TITLE;
  refTable1: string = this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_FIELD_TITLE;
  refTableTmp: string = this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_FIELD_TMP_TITLE;
  emptyItemId: string = this.CONSTANTS.UNIVERSAL_ID_PLACEHOLDER;
  emptyCsvTemplateConfigModel = new CSVTemplateConfigs(0, '', CSVTemplateConfigType.ORDER,'UTF-8','/n',';');
  allowMultiSelect: boolean;

  formInitialized: boolean;
  items: csvTemplateConfigsItem[];
  setClickedRow: Function;
  isTableClicked: boolean;

  newCSVTemplateConfigMode: boolean;
  displayedColumns: string[] = ['CSV_TEMPLATE_CONFIG_ID','SHORT_DESC','REQUIRED'];
  initialSort: Sort<CSVTemplateConfigsField> = {property: 'CSV_TEMPLATE_CONFIG_ID', order: 'asc'};

  idTemp: number;
  PAGINATOR_ELEMENTS_PER_SIDE: number[];
  currPageSize: number;
  selectionModel: SelectionModel<TableItem>;

  importTypesConstants!: Array<{id: number, label: string}>
  importTypesConstantsTmp: any = [];

  tableTitle: string;
  formTitle: string;
  createTitle: string;
  createTooltip: string;
  editTooltip: string;
  deleteTooltip: string;


  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  subscription1: Subscription


  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private tableDataService: TableDataService,
    private router: Router,
    private CONSTANTS: ConstantsService,
    public translatePipe: TranslateItPipe,
    private messageService: MessageService,
    private formService: FormService
  ) {
    this.tableTitle = 'CSV_TEMPLATE_CONFIG';
    this.listTitle = 'CSV_CONFIG_TEMPLATE';
    this.formTitle = 'CSV_TEMPLATE_CONFIG_FORM';
    this.createTitle = 'CREATE_NEW_CSV_TEMPLATE_CONFIG';
    this.listSubTitle = 'Komponenten-Nr.:'; // 'Komponentennummer:';
    this.createTooltip = 'CREATE_NEW_CSV_TEMPLATE_CONFIG';
    this.resetVars();
    formService.setTranslatePipe(translatePipe);
    this.ngForm = formBuilder.group({
      ID: [1, Validators.required],
      CSV_TEMPLATE_CONFIG_ID: ['', Validators.required],
      NUM_IN_ORDER: ['', Validators.required],
      SHORT_DESC: ['', Validators.required],
      REQUIRED: ['0', Validators.required],
      CSV_TYPE_CONSTANTS: ['']
    });
  }

  private resetVars() {
    this.formInitialized = false;
    this.allowMultiSelect = false;
    this.selTableRow = undefined;
    this.items = [];
    this.newCSVTemplateConfigMode = false;
    this.isTableClicked = false;
  }

  ngOnInit() {
    localStorage.setItem(this.CONSTANTS.LS_SEL_REF_TABLE, this.refTable);
    this.PAGINATOR_ELEMENTS_PER_SIDE = this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE_BIG;
    this.currPageSize = this.PAGINATOR_ELEMENTS_PER_SIDE[0];
    this.numOrder = 1;
    this.setCheckbox = '0'
    //nemanja treba da ispravi ovo
    /*this.subscription1 = this.tableDataService.getImportTypeConstants().subscribe((res: Array<{id: number, label: string}> | false)=>{
      if(res !== false) this.importTypesConstants =  res
      else{
        this.importTypesConstants = []
      }
    })*/
  }

  ngAfterViewInit(): void{
      this.setupTableView();
  }

  onCheckboxChange(e) {
    this.setCheckbox = (e.target.checked) ? '1' : '0';
  }

  onAddColumnsSubmit() {
    console.log('onAddColumnsSubmit...');
    this.ngForm.controls['ID'].setValue(this.idTemp);
    this.ngForm.controls['CSV_TEMPLATE_CONFIG_ID'].setValue(this.lastIdCsv);
    this.ngForm.controls['NUM_IN_ORDER'].setValue(this.numOrder);
    this.ngForm.controls['REQUIRED'].setValue(this.setCheckbox);
    this.columnForm = this.ngForm.value;
    this.numOrder++
    this.save();
    this.insertIntoTempTable();
    this.importTypesConstantsTmp = [];
  }

  addImportTypeConsants() {
    this.importTypesConstantsTmp.push(this.ngForm.controls['CSV_TYPE_CONSTANTS'].value);
  }

  insertIntoTempTable() {
    for (let item in this.importTypesConstantsTmp) {
      let tempITI =  this.tableDataService.insertIntoTemp(this.idTemp, Number(item));

      tempITI.subscribe((dbData) => {
        console.log('dbDAta: ', dbData);
       if(dbData) {
         this.showErrorMessage(dbData['result']['error']);
       } else {
         this.refreshTableViews();
         this.showSuccessMessage(this.translatePipe.transform('SAVEDSUCCESS'));
         this.ShowAddInputField = false;
       }
     },
     (err: HttpErrorResponse) => {
       this.tableDataService.handleHttpError(err);
     });
    }
  }

  async save() {
    console.log('ADD column ');
    // disable save button
    // this.disableSaveButton(true);
    // throw new Error("STOPP");
    this.setIsLoadingResults(true);
    this.numOrder = 1;
    let refTableTitle: undefined | string = undefined;
    let customerNumber: undefined | string = undefined;
    refTableTitle = this.tableTitle;
    customerNumber = '1';
    if (refTableTitle !== undefined && customerNumber !== undefined) {
      let self = this;
      self.formDisabledFlag = false;
      let primaryValue = null;
      let formValues = undefined;
      if (self.ngForm) {
        // formValues = self.form.value;
        // Workaround for having disabled field in values:
        // @ https://stackoverflow.com/questions/40148102/angular-2-disabled-controls-do-not-get-included-in-the-form-value
        formValues = self.columnForm;
        //console.log(formValues);
      }
      let postFormValues = {};
      let primaryKey = self.CONSTANTS.REFTABLE_CUSTOMER_COLUMN;
      let secondaryKey = undefined;
      let secondaryValue = undefined;
      let customerNumber = undefined;

      // post form data to server
      // Convert form keys to db keys
      for (let property in formValues) {
        postFormValues[property.toUpperCase()] = formValues[property];
      }
      let tempCUS: { result: { success: boolean, message: string, data: [] } } =
        await self.tableDataService.setTableData((self.refTableTmp, postFormValues, primaryKey, primaryValue,
          true, undefined, undefined));

      /*tempCUS.subscribe((dbData) => {
         console.log('dbData client received: ', dbData);*/
      if (tempCUS && tempCUS.result && !tempCUS.result.success) {
        self.showErrorMessage(tempCUS.result.message);
      } else {
        self.refreshTableViews();
        self.showSuccessMessage(self.translatePipe.transform('SAVEDSUCCESS'));
      }
      /*},
      (err: HttpErrorResponse) => {
        self.tableDataService.handleHttpError(err);
      });*/


    } else {
      throw new Error("Check Reftable or Customernumber... Is undefined.");
    }
  }

  private showSuccessMessage(msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: this.translatePipe.transform('INFO'),
      detail: msg
    });
  }


  private showErrorMessage(msg: string) {
    // this.msgs.push({severity:'error', summary:'Error Message', detail: msg});
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: msg,
      life: 6000
      // sticky: true
    });
    this.setIsLoadingResults(false);
  }

  private async setupTableView(): Promise<void> {
    let selId = localStorage.getItem(this.CONSTANTS.LS_SEL_ATTRIBUTE_NAMES_ID);
    if (this.customTableComponent && this.customTableComponent.first) {
      this.customTableComponent.first.setPageParams(this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_FIELD_TMP_TITLE,
        this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_FIELD_COLUMN, "",
        "","","CSV_TEMPLATE_CONFIG_ID","CSV_TEMPLATE_CONFIG_ID,SHORT_DESC",
        this.displayedColumns, ViewQueryTypes.MAIN_TABLE);
      this.customTableComponent.first.setIsLoadingResults(true);
      this.customTableComponent.first.setPaginator(this.PAGINATOR_ELEMENTS_PER_SIDE);
      this.customTableComponent.first.setPageSize(this.currPageSize);
      this.customTableComponent.first.setLabels(this.tableTitle, this.createTitle);
      this.customTableComponent.first.setShowCreateButton(true);
      this.customTableComponent.first.setPaginatedDataSource(this.currPageSize);
      let data: any = await this.customTableComponent.first.getDataSource();
      this.selTableRow = await this.customTableComponent.first.setTableItems(data,
        this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_FIELD_TMP_TITLE, selId, false);
      let index: number = 0;
      if (this.customTableComponent.first.selectionModel && this.customTableComponent.first.selectionModel.selected) {
        for (let item in data) {
          if (data.hasOwnProperty(item) &&
            (data[item] === this.customTableComponent.first.selectionModel.selected[0])) {
            index = parseInt(item);
            break;
          }
        }
      }
      this.customTableComponent.first.setSelTableRow(this.selTableRow, index);
      let self = this;
      this.customTableComponent.first.setClickedRow = async function (tableRow: CSVTemplateConfigsField, selectionIndex: number) {
        if (!self.isTableClicked) {
          self.isTableClicked = true;
          self.customTableComponent.first.setIsTableClicked(true);
          self.customTableComponent.first.setIsLoadingResults(true);
          self.emptyForms();
          await self.tableClickLogic(tableRow, selectionIndex);
        }
      }
    }

  }


  /**
   * set table data - subscribe to fetch data service
   *
   * @param selItemId
   * @param selItemKey
   * @param selItemValue
   * @private
   */
   public async setTableData(selItemId: string, selItemKey: string, selItemValue: string) {
    let data = await this.customTableComponent.first.getDataSource();
    this.customTableComponent.first.selTableRow = await this.customTableComponent.first.setTableItems(data,
      selItemKey, selItemValue, true, selItemId);
    this.customTableComponent.first.setSelTableRow(this.customTableComponent.first.selTableRow);
    this.customTableComponent.first.setSelectionModel();
  }


  private async setAndLoadFormData(): Promise<void> {
    this.customFormComponent.first.setNewItem(this.newCSVTemplateConfigMode);
    this.customFormComponent.first.setRefTable(this.refTable);
    this.customFormComponent.first.setSelectedRow(this.selTableRow);
    //console.log(this.selTableRow);
    await this.loadFormData(this.newCSVTemplateConfigMode ? this.emptyItemId.toString() :
      this.selTableRow.ID.toString());
  }

  /**
   * load form data
   *
   * @param csvTemplateConfigId
   * @private
   */
   private async loadFormData(csvTemplateConfigId: string): Promise<void> {
    let formDisabled: boolean = false;
    let result: {model: any, fields: FormlyFieldConfig[]} =
      await this.formService.getFormConfigData(this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_FIELD_TITLE,
        this.newCSVTemplateConfigMode, this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_COLUMN, csvTemplateConfigId,
        undefined, undefined, undefined, formDisabled);
    let formResult: { result: boolean } = this.customFormComponent.first.setFormData(result);
    this.evalFormResult(formResult, this);
  }

  /**
   * evaluate from result
   *
   * @param formResult
   * @param self
   * @private
   */
   private evalFormResult(formResult, self: this) {
    if (formResult && formResult.result) {
      // Unblock table click
      self.isTableClicked = false;
    } else {
      throw new Error("Callback error: " + formResult.method);
    }
  }


  /**
   * @ToDo: Refactor to remove switch and have only one getTableDataByCustomersNumberPromise..
   *
   * getTableDataByCustomersNumber() - loads detail view table items to tableDbData
   *
   * @param itemNumber
   * @param optionalParameter
   * @param clicked
   */
   public async getFormData(itemNumber: string, optionalParameter: string, clicked: boolean) {
    let customerColumn;
    let secondColumn = undefined;
    let secondId = undefined;
    let refTableTitle: undefined | string = undefined;
    let customerNumber: undefined | string = undefined;
    const __ret = this.getTableAndDataset(refTableTitle, customerNumber);
    refTableTitle = __ret.refTableTitle;
    customerNumber = __ret.customerNumber;
    let optionalParameterColumn: string;
    let lockedMessage: string = this.translatePipe.transform('TABLE_LOCK_MESSAGE_LOCKED');
    let isLockedResult = await this.tableDataService.isTableLocked(refTableTitle, itemNumber, lockedMessage);
    this.formDisabledFlag = !!isLockedResult;
    let selItemId: string; // optional param for WAREHOUSING id
    let tempRefTable: string = this.refTable;
    let firstParamKey: string = "";
    let firstParamVal: string = "";
    let secondParamKey: string = "";
    let secondParamVal: string = "";
    let searchColumn: string;
    let additionalSearchColumns: string = "";
    let localStorageKey: string = "";
    let secondParamColumn;
    let secondParamValue;
    if (itemNumber !== "") {
      let tableDbData: {};
      if (refTableTitle !== undefined && customerNumber !== undefined) {
        if (this.newItemMode) {

          this.setSelTableRow(this.emptyCsvTemplateConfigModel);

          return await this.setForm(customerColumn, itemNumber, secondColumn, secondId);
        } else {

          customerColumn = this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_COLUMN;
          localStorageKey = this.CONSTANTS.LS_SEL_CSV_TEMPLATE_CONFIG;
          selItemId = localStorage.getItem(localStorageKey);
          optionalParameterColumn = this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_NAME_COLUMN;
          tempRefTable = this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG;
          firstParamKey = this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_COLUMN;
          searchColumn = "CSVCONFIG_ID";
          additionalSearchColumns = "CSVCONFIG_ID,CSVCONFIG_NAME";




          firstParamVal = localStorage.getItem(localStorageKey);
          const __ret = await this.getTableDataFromDB(tableDbData, tempRefTable, customerColumn, itemNumber,
            firstParamVal, firstParamKey, localStorageKey, secondParamColumn, secondParamValue);
          tableDbData = __ret.tableDbData;
          firstParamVal = __ret.firstParamVal;
          if (!tableDbData) {
            return {result: false, method: 'getFormData - tableDbData is empty...'};
          }
          this.customTableComponent.first.setLabels(this.tableTitle, this.createTitle);
          if (!clicked) {
            this.customTableComponent.first.setPageParams(this.refTable,
              customerColumn, itemNumber, secondParamKey, "",
              searchColumn, additionalSearchColumns, this.displayedColumns, ViewQueryTypes.DETAIL_TABLE);
            this.customTableComponent.first.setPaginatedDataSource(this.currPageSize);
            let tableData: {} = await this.customTableComponent.first.getDataSource();
            this.customTableComponent.first.selTableRow = await this.customTableComponent.first.setTableItems(tableData,
              customerColumn, itemNumber, true, selItemId);
            this.customTableComponent.first.setSelTableRow(this.customTableComponent.first.selTableRow);
          }
          return await this.setForm(firstParamKey, firstParamVal, secondParamKey, secondParamVal);
        }
      } else {
        return {result: false, method: 'getFormData - articleNumber is empty...'};
      }
    } else {
      return {result: false, method: 'getFormData - itemNumber is empty...'};
    }
  }


  /**
   * get table data from db
   *
   * @param tableDbData
   * @param tempRefTable
   * @param customerColumn
   * @param itemNumber
   * @param firstParamVal
   * @param firstParamKey
   * @param lsKey
   * @param secondParamColumn
   * @param secondParamValue
   * @private
   */
   private async getTableDataFromDB(tableDbData: {}, tempRefTable: string, customerColumn: string, itemNumber: string,
    firstParamVal: string, firstParamKey: string, lsKey: string,
    secondParamColumn: string, secondParamValue: string) {
      console.log(tempRefTable);
    tableDbData = await this.tableDataService.getTableDataByCustomersNumber(tempRefTable, ViewQueryTypes.PURE_SELECT,
      customerColumn, itemNumber, secondParamColumn, secondParamValue);
    // If no detail table item is selected, select first item and save item to localStorage
    if (!firstParamVal && tableDbData['table'][1][0]) {
    firstParamVal = tableDbData['table'][1][0][firstParamKey];
    localStorage.setItem(lsKey, firstParamVal);
    this.setSelTableRow(tableDbData['table'][1][0]);
    }
    return {tableDbData, firstParamVal};
  }



  custTableUpdate(selTableRow) {
    this.emptyForms();
    this.newCSVTemplateConfigMode = false;
    if (selTableRow && (selTableRow.hasOwnProperty(this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_COLUMN) ||
      selTableRow.hasOwnProperty(this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_COLUMN))) {
      this.selTableRow = selTableRow;
        if (this.customFormComponent) {
          if (this.selTableRow && this.selTableRow.ID && this.selTableRow.ID !== 0) {
            this.setAndLoadFormData();
          }
        }
    }

  }


  /**
   * table click logic
   *
   * @param tableRow
   * @param selectionIndex
   * @private
   */
   private async tableClickLogic(tableRow: CSVTemplateConfigsField, selectionIndex: number): Promise<void> {
    this.newCSVTemplateConfigMode = false;
    this.selTableRow = tableRow;
    // @ToDo: Replace LS_SEL_COUNTRY_ID by right item...
    // localStorage.setItem(this.CONSTANTS.LS_SEL_COUNTRY_ID, tableRow.ID.toString());
    await this.tableDataService.removeAllTableLocks(true, "", "");
    setTimeout(() => {
      this.customTableComponent.first.setSelTableRow(tableRow, selectionIndex);
      this.customTableComponent.first.selTableRow = tableRow;
      this.customTableComponent.first.selectionIndex = selectionIndex;
      this.customTableComponent.first.sendServiceResult();
    });
  }


  /*private tableClickLogic(tableRow, self: this) {
    console.log(tableRow);
    if(confirm('Are you sure to delete row')) {
      console.log(' uspesno ');
      this.refreshTableViews();
    }
  }*/

  /**
   * set form titles
   *
   * @param formTabTitle
   * @param formTitle
   * @param articleTitle
   * @param articlesDetailsTitle
   * @param createTitle
   */
   public setLabels(formTabTitle: string, formTitle: string, articleTitle: string, articlesDetailsTitle: string,
    createTitle: string) {
    this.tableTitle = formTabTitle;
    this.listTitle = formTitle;
    this.createTitle = createTitle;
    this.createTooltip = createTitle;
    this.listSubTitle = articleTitle;
  }

  /*setLabels(formTitle, createTitle) {
    this.formTitle = formTitle;
    this.createTitle = createTitle;
  }*/

  initForm(newItemMode: boolean, refTable: string) {
    this.setNewItem(newItemMode);
    this.customFormConfig = undefined;
    this.setRefTable(refTable);
  }

  private getTableAndDataset(refTableTitle: string, customerNumber: string) {
    refTableTitle = this.formService.selItemRefTableTitle;
    customerNumber = localStorage.getItem(this.formService.selItemLocalStorageKey);
    return {refTableTitle, customerNumber};
  }

  setNewItem(flag) {
    this.newItemMode = flag;
  }

  public setForm(customerColumn: string, itemNumber: string, secondColumn: string, secondId: string): Promise<{}> {
    return new Promise(async (resolve, reject) => {
      let formDisabled: boolean = false;
      this.resetFormConfigs();
      this.resetFormList();
      let tempRefTable = (this.refTable === this.CONSTANTS.REFTABLE_PRILISTS_DETAILS) ?
        this.CONSTANTS.REFTABLE_PRILISTS : this.refTable;
      let result = await this.formService.getFormConfigData(this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_FIELD_TITLE, this.newItemMode,
        customerColumn, itemNumber, secondColumn, secondId, undefined, formDisabled);
      // this.listForm = new DynamicFormComponent();
      this.formConfig = result.fields;
      setTimeout(() => {
        if (this.listForm) {
          this.listForm.setModel(result.model);
          this.listForm.setFields(result.fields);
        } else {
          resolve({result: false, method: 'setForm - listform is undefined...'});
        }
        resolve({result: true});
      });
    });
  }

  public resetFormConfigs() {
    this.formList = undefined;
    this.allListItemsConfig = [];
    this.formConfig = undefined;
  }

  public resetFormList() {
    this.formList = undefined;
    this.allListItemsConfig = [];
  }

  // setFormData(regConfig: any, dbData: any, formDisabledFlag: boolean, callback) {
  //   // console.log("RECEIVED: ", regConfig);
  //   this.customFormConfig = regConfig;
  //   setTimeout(() => {
  //     if (this.customForm) {
  //       this.customForm.setModel(regConfig.model);
  //       this.customForm.setFields(regConfig.fields);
  //       // this.customForm.setDisabled(this.formDisabledFlag);
  //       this.setIsLoadingResults(false);
  //     } else {
  //       throw new Error("customForm is not defined...");
  //     }
  //     callback({result: true});
  //   });
  // }
  /**
   * set form data (model and fields)
   *
   * @param regConfig
   * @param formDisabledFlag - optional
   */
  setFormData(regConfig: any, formDisabledFlag?: boolean) {
    return new Promise((resolve, reject) => {
      this.customFormConfig = regConfig;
      setTimeout(() => {
        if (this.customForm) {
          this.customForm.setModel(regConfig.model);
          this.customForm.setFields(regConfig.fields);
          // this.customForm.setDisabled(this.formDisabledFlag);
          this.setIsLoadingResults(false);
          resolve({result: true});
        } else {
          console.log('customForm is not defined');
          // new Error("customForm is not defined...")
          reject({result: false});
        }
      });
    });
  }

  private refreshTableViews() {
    this.ngForm.reset()
    this.custResetForm();
    this.setupTableView();
  }

  onFormSubmit($event: any) {
    console.log('save - onArticleAttributeFormSubmit...');
    this.saveForm();
  }

  createItem() {}

  close() {
    // console.log('Close form... ', this.newItemMode);
    if (this.newItemMode) {
      // ToDo: load data at close, without refresh the table...
      // this.getArticleFormData(selItemNum);
      this.refreshTableViews();
      if (this.newItemMode) {
        this.newItemMode = false;
      }
    } else {
      this.tableDataService.removeAllTableLocks(true, "", "");
    }
  }

  setRefTable(table) {
    this.refTable = table;
  }

  public setTableColumnsToHide(tableColumnsToHide: string[]) {
    this.tableColumnsToHide = tableColumnsToHide;
  }

  setSelCustomerRow(selRow) {
    this.selRow = selRow;
  }

   public setSelTableRow(selRow: CSVTemplateConfigs) {
    if (this.customTableComponent && this.customTableComponent.first) {
      this.customTableComponent.first.setSelTableRow(selRow);
    }
  }

  emptyForms(full = true) {
    if (full) {
      this.selRow = undefined;
    }
    // console.log("emptyForms this.customForm: ", this.customForm);
    if (this.customForm && this.customForm.form) {
      // console.log('Reset articles form now...');
      setTimeout(() => {
        this.customFormConfig = undefined;
      });
    } else {
      // console.log(this.refTable + ' form is not defined... ');
    }
  }

  async setShowAddInputField() {
    let idTemp = await this.tableDataService.getLastIdOfTable('CSV_TEMPLATE_CONFIG_FIELD_TEMP', 'ID');

    //idTemp.subscribe((idDbData) => {
      if (idTemp && idTemp['id']) {
        this.idTemp = Number(idTemp['id']) + 1;
      } else {
        this.idTemp = 1;
      }
    /*},
    (err: HttpErrorResponse) => {
      this.tableDataService.handleHttpError(err);
    });*/
    this.ShowAddInputField = (this.ShowAddInputField) ? false : true;

  }

  setIsLoadingResults(flag: boolean) {
    this.isLoadingResults = flag;
  }

  public setPageSize(currPageSize: number) {
    this.currPageSize = currPageSize;
  }

  // ToDo: Need to add logic to following two functions...
  tableUpdateFunc: any;
  tableCreateFunc: any;
}

