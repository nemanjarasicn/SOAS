import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {TableDataService} from "../../_services/table-data.service";
import {Router} from "@angular/router";
import {ComponentViewTypes, ConstantsService, ViewQueryTypes} from "../../_services/constants.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import { CustomTableComponent } from "../custom/custom-table/custom-table.component";
import { CSVTemplateConfigs } from "../../models/csvtemplate-configs.model"
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {MessageService} from "primeng/api";
import {Sort} from "../custom/custom-table/page";
import {CSVTemplateConfigType} from '../../enums/csvtemplate-config-type.enum'
import {DetailViewCsvTemplateConfigComponent} from "../detail-view-csv-template-config/detail-view-csv-template-config.component";
import {FetchDataService} from "../../_services/fetch-data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-csv-template-config',
  templateUrl: './csv-template-config.component.html',
  styleUrls: ['./csv-template-config.component.css'],
  providers: [TranslateItPipe, MessageService]
})
export class CsvTemplateConfigComponent implements OnInit {
  selTableRow: CSVTemplateConfigs;

  // Table view
  @ViewChildren(CustomTableComponent) customTableComponent !: QueryList<CustomTableComponent>;
  @ViewChildren(DetailViewCsvTemplateConfigComponent) DetailViewCsvTemplateConfigComponents !: QueryList<DetailViewCsvTemplateConfigComponent>;

  refTable: string = this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG;
  emptyItemId: string = this.CONSTANTS.UNIVERSAL_ID_PLACEHOLDER;
  emptyCsvTemplateConfigModel = new CSVTemplateConfigs(0, '', CSVTemplateConfigType.ORDER,'UTF-8','/n',';');
  allowMultiSelect: boolean;

  detailViewInitialized: boolean;

  //formInitialized: boolean;
  //items: csvTemplateConfigsItem[];
  //dataSource: MatTableDataSource<csvTemplateConfigsItem>;
  setClickedRow: Function;
  isTableClicked: boolean;
  editMode: boolean;

  newCSVTemplateConfigMode: boolean;
  displayedColumns: string[] = ['CSVCONFIG_ID','CSVCONFIG_NAME','CSVCONFIG_TYPE'];
  initialSort: Sort<CSVTemplateConfigs> = {property: 'CSVCONFIG_NAME', order: 'asc'};
  tableColumnsToHide: string[];

  PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE: number[];
  PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE: number[];
  //PAGINATOR_ELEMENTS_PER_SIDE: number[];
  currPageSizeMainTable: number;
  currPageSizeDetailTable: number;
  //currPageSize: number;
  //selectionModel: SelectionModel<TableItem>;

  lastIdCsv: string;
  idTemp: number;

  tableTitle: string;
  detailTableTitle: string;
  detailFormTitle: string;
  formTitle: string;
  createTitle: string;
  createTooltip: string;
  editTooltip: string;
  deleteTooltip: string;

  // service subscription
  serviceSubscription: Subscription;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private tableDataService: TableDataService,
    private router: Router,
    private CONSTANTS: ConstantsService,
    public translatePipe: TranslateItPipe,
    private messageService: MessageService,
    private fetchDataService: FetchDataService
  ) {
    this.tableTitle = 'CSV_TEMPLATE_CONFIG';
    this.formTitle = 'CSV_TEMPLATE_CONFIG_FORM';
    this.detailTableTitle = 'CSV_TEMPLATE_CONFIG';
    this.detailFormTitle = 'CSV_TEMPLATE_CONFIG_FORM';

    this.createTooltip = 'CREATE_NEW_CSV_TEMPLATE_CONFIG';
    this.resetVars();
  }


  ngOnInit() {
    localStorage.setItem(this.CONSTANTS.LS_SEL_REF_TABLE, this.refTable);
    this.PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE = this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE_BIG;
    this.PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE = this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE_FIVE;
    this.currPageSizeMainTable = this.CONSTANTS.PAGINATOR_MAX_ELEMENTS_SMALL;
    this.currPageSizeDetailTable = this.CONSTANTS.PAGINATOR_MAX_ELEMENTS_MINI;
    if (this.customTableComponent) {
      this.customTableComponent.first.setPaginator(this.PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE);
      this.customTableComponent.first.setPageSize(this.currPageSizeMainTable);
    }
    this.createTitle = 'CREATE_NEW_CSV_CONFIG_TEMPLATE';
    this.createTooltip = '';
    setTimeout(async () => {
      await this.setupTableView();
    });
    // subscribe to wait for loaded changes
    this.serviceSubscription = this.fetchDataService.getDataObs().subscribe(async (selTableData) => {
      if (this.detailViewInitialized && selTableData) {
        let viewType: ComponentViewTypes;
        if (selTableData.refTableName === this.CONSTANTS.REFTABLE_COMPONENTS) {
          this.selTableRow = selTableData.selTableRow as CSVTemplateConfigs;
          viewType = ComponentViewTypes.Table;
        } else if (selTableData.refTableName === this.CONSTANTS.REFTABLE_COMPONENTS_DETAILS) {
          this.DetailViewCsvTemplateConfigComponents.first.customTableComponent.first.selTableRow = selTableData.selTableRow;
          viewType = ComponentViewTypes.Details;
        }
        await this.tableUpdate(viewType);
      }
    });
  }


  /**
   * unsubscribe from service at component destroy
   */
  ngOnDestroy() {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }

  /**
   * reset variables
   *
   * @private
   */
  private resetVars() {
    this.allowMultiSelect = false;
    this.detailViewInitialized = false;
    this.newCSVTemplateConfigMode = false;
    this.selTableRow = undefined;
    this.editMode = false;
    this.isTableClicked = false;
  }


  private async setupTableView() {
    let selId = localStorage.getItem(this.CONSTANTS.LS_SEL_CSV_TEMPLATE_CONFIG);
    // let selCompnum = localStorage.getItem(this.CONSTANTS.LS_SEL_COMPONENTS_COMPNUM);
    if (this.customTableComponent  && this.customTableComponent.first) {
      this.customTableComponent.first.setPageParams(this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG,
        this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_COLUMN, selId, "", "",
        "CSVCONFIG_NAME", "CSVCONFIG_NAME,CSVCONFIG_TYPE", this.displayedColumns,
        ViewQueryTypes.MAIN_TABLE);
      this.customTableComponent.first.setIsLoadingResults(true);
      this.customTableComponent.first.setPaginator(this.PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE);
      this.customTableComponent.first.setPageSize(this.currPageSizeMainTable);
      this.customTableComponent.first.setLabels(this.tableTitle, this.createTitle);
      this.customTableComponent.first.setShowCreateButton(true);
      let selCompId = localStorage.getItem(this.CONSTANTS.LS_SEL_CSV_TEMPLATE_CONFIG_ID);
      if (!localStorage.getItem(this.CONSTANTS.LS_SEL_COMPONENTS_DETAILS_CSV_ID)) {
        if (selCompId) {
          localStorage.setItem(this.CONSTANTS.LS_SEL_COMPONENTS_DETAILS_CSV_ID, selCompId);
        }
      }
      this.customTableComponent.first.setPaginatedDataSource(this.currPageSizeMainTable);
      let data: any = await this.customTableComponent.first.getDataSource();
      this.selTableRow = await this.customTableComponent.first.setTableItems(data,
        this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_COLUMN, selCompId, false);
      this.customTableComponent.first.setSelTableRow(this.selTableRow);
      let self = this;
      this.customTableComponent.first.setClickedRow = async function (tableRow: any, selectionIndex: number) {
        if (!self.isTableClicked) {
          self.isTableClicked = true;
          self.emptyForms();
          await self.tableClickLogic(tableRow, selectionIndex);
        }
      }
      await this.setDetailView();
    }
  }





  private async tableClickLogic(tableRow: any, selectionIndex: number) {
    if (this.customTableComponent && this.customTableComponent.first) {
      this.newCSVTemplateConfigMode = false;
      this.selTableRow = tableRow;
      localStorage.setItem(this.CONSTANTS.LS_SEL_CSV_TEMPLATE_CONFIG_ID, tableRow.CSVCONFIG_ID);
      localStorage.setItem(this.CONSTANTS.LS_SEL_COMPONENTS_ITEM_NUMBER, tableRow.CSVCONFIG_NAME); // overwrite
      // localStorage.setItem(this.CONSTANTS.LS_SEL_COMPONENTS_COMPNUM, tableRow.COMPNUM);
      // localStorage.removeItem(this.CONSTANTS.LS_SEL_COMPONENTS_COMPNUM);
      localStorage.removeItem(this.CONSTANTS.LS_SEL_COMPONENTS_DETAILS_CSV_ID);
      await this.tableDataService.removeAllTableLocks(true, "", "");
      setTimeout(() => {
        this.customTableComponent.first.setSelTableRow(tableRow, selectionIndex);
        this.customTableComponent.first.selTableRow = tableRow;
        this.customTableComponent.first.selectionIndex = selectionIndex;
        this.customTableComponent.first.sendServiceResult();
      });
    } else {
      this.isTableClicked = false;
    }
  }


  private async setDetailView() {
    if (this.DetailViewCsvTemplateConfigComponents && this.DetailViewCsvTemplateConfigComponents.first.customTableComponent.first) {
      this.DetailViewCsvTemplateConfigComponents.first.setRefTable(this.CONSTANTS.REFTABLE_COMPONENTS_DETAILS);
      this.DetailViewCsvTemplateConfigComponents.first.setLabels(this.detailTableTitle, this.detailFormTitle, this.detailFormTitle,
        this.detailFormTitle, this.createTitle);
      this.DetailViewCsvTemplateConfigComponents.first.setTableColumnsToHide(this.tableColumnsToHide);
      // ToDo: Manage to set the table paginator to 3 items
      this.DetailViewCsvTemplateConfigComponents.first.customTableComponent.first.setPaginator(
        this.PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE);
      this.DetailViewCsvTemplateConfigComponents.first.setPageSize(this.currPageSizeDetailTable);
      this.setDetailViewClick();
      if (this.selTableRow && this.selTableRow.CSVCONFIG_ID /*&& this.selTableRow.CSVCONFIG_ID !== ""*/) {
        let articleFormResult = await this.DetailViewCsvTemplateConfigComponents.first.getFormData(this.selTableRow.CSVCONFIG_NAME,
          "", false);
        this.evalCsvConfigTemplateFormResult(articleFormResult);
      }
    }
    this.detailViewInitialized = true;
  }

  private setDetailViewClick() {
    if(this.DetailViewCsvTemplateConfigComponents.first.customTableComponent.first) {
      let self = this;
      this.DetailViewCsvTemplateConfigComponents.first.customTableComponent.first.setClickedRow = async function (tableRow) {
        await self.loadDetailViewTableData(tableRow);
      }
    }
  }

  private async loadDetailViewTableData(tableRow) {
    this.DetailViewCsvTemplateConfigComponents.first.setRefTable(this.CONSTANTS.REFTABLE_COMPONENTS_DETAILS);
    localStorage.setItem(this.CONSTANTS.LS_SEL_CSV_TEMPLATE_CONFIG, tableRow['CSVCONFIG_ID']);
    let csvConfigTemplateFormResult = await this.DetailViewCsvTemplateConfigComponents.first.getFormData(tableRow['CSVCONFIG_ID'],
      tableRow['CSVCONFIG_NAME'], true);
    this.DetailViewCsvTemplateConfigComponents.first.customTableComponent.first.setSelTableRow(tableRow);
    this.evalCsvConfigTemplateFormResult(csvConfigTemplateFormResult);
  }


  /*private async setAndLoadFormData(): Promise<void> {
    this.DetailViewCsvTemplateConfigComponents.first.setNewItem(this.newCSVTemplateConfigMode);
    this.DetailViewCsvTemplateConfigComponents.first.setRefTable(this.refTable);
    this.DetailViewCsvTemplateConfigComponents.first.setSelCustomerRow(this.selTableRow);
    //console.log(this.selTableRow);
    await this.loadFormData(this.newCSVTemplateConfigMode ? this.emptyItemId.toString() :
      this.selTableRow.CSVCONFIG_ID.toString());
  }*/

  /**
   * load form data
   *
   * @param countryId
   * @private
   */
  /*private async loadFormData(csvTemplateConfigId: string): Promise<void> {
   let formDisabled: boolean = false;
   let result: {} = await this.formService.getFormConfigData(this.refTable, this.newCSVTemplateConfigMode,
     this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG_COLUMN, csvTemplateConfigId, undefined, undefined,
     undefined, formDisabled);
   let formResult: {} = await this.customFormComponent.first.setFormData(result);
   this.evalFormResult(formResult, this);
 }*/


  /*******************************************
   * HELPER FUNCTIONS
   ******************************************/

  private resetTable() {
    this.selTableRow = undefined;
  }

  private emptyForms() {
    // set empty component model
    if (this.DetailViewCsvTemplateConfigComponents) {
      this.DetailViewCsvTemplateConfigComponents.first.setNewItem(this.newCSVTemplateConfigMode);
    }
  }

  /** Function to call from children
   * https://stackoverflow.com/a/50585796
   **/
  get csvTemplateConfigResetFormFunc() {
    return this.resetForm.bind(this);
  }


  async resetForm() {
    if (this.newCSVTemplateConfigMode) {
      this.newCSVTemplateConfigMode = false;
      await this.setupTableView();
    } else {
      this.emptyForms();
      this.resetTable();
    }
  }


  pageEvent($event: PageEvent) {
    this.currPageSizeMainTable = $event.pageSize;
  }



  async createItem() {
    console.log(0);
    this.newCSVTemplateConfigMode = true;
    this.emptyForms();
    if (this.DetailViewCsvTemplateConfigComponents && this.DetailViewCsvTemplateConfigComponents.first) {
      this.DetailViewCsvTemplateConfigComponents.first.setNewItem(this.newCSVTemplateConfigMode);
      this.DetailViewCsvTemplateConfigComponents.first.setRefTable(this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG);
      let self = this;
      let csvConfigTemplateFormResult = await this.DetailViewCsvTemplateConfigComponents.first.getFormData(this.emptyItemId,
        undefined, false);
      self.evalCsvConfigTemplateFormResult(csvConfigTemplateFormResult);
    }
  }



  private evalCsvConfigTemplateFormResult(csvConfigTemplateFormResult) {
    if (csvConfigTemplateFormResult && csvConfigTemplateFormResult.result) {
      // Unblock table click
      this.isTableClicked = false;
    }
  }

  get tableUpdateFunc() {
    return this.tableUpdate.bind(this);
  }

  /**
   * table update
   *
   * @param viewType
   */
  async tableUpdate(viewType: ComponentViewTypes = ComponentViewTypes.Table) {
    console.log(0);
    this.emptyForms();
    this.newCSVTemplateConfigMode = false;
    await this.refreshView(viewType);
  }

  /**
   * refresh view - called after service has loaded form data
   *
   * @private
   */
  private async refreshView(viewType: ComponentViewTypes = ComponentViewTypes.Table) {
    if (this.DetailViewCsvTemplateConfigComponents && this.DetailViewCsvTemplateConfigComponents.first) {
      if (this.selTableRow && this.selTableRow.CSVCONFIG_ID /*&& this.selTableRow.CSVCONFIG_ID !== ""*/) {
        if (viewType === ComponentViewTypes.Table) {
          this.customTableComponent.first.setSelTableRow(this.selTableRow);
          this.customTableComponent.first.selTableRow = this.selTableRow;
          this.detailViewInitialized = false;
          await this.setDetailView();
        } else if (viewType === ComponentViewTypes.Details) {
          // select detail view table item
        }
        if (this.DetailViewCsvTemplateConfigComponents.first.customTableComponent.first.selTableRow instanceof CSVTemplateConfigs) {
          await this.DetailViewCsvTemplateConfigComponents.first.setTableData(
            this.DetailViewCsvTemplateConfigComponents.first.customTableComponent.first.selTableRow.CSVCONFIG_ID.toString(),
            this.CONSTANTS.LS_SEL_CSV_TEMPLATE_CONFIG_NAME,
            this.DetailViewCsvTemplateConfigComponents.first.customTableComponent.first.selTableRow.CSVCONFIG_ID.toString());
        }
      }
    }
    this.customTableComponent.first.setIsTableClicked(false);
    this.customTableComponent.first.setIsLoadingResults(false);
  }



  /*get loadFormFunc() {
    return this.loadForm.bind(this);
  }*/

  /**
   * load form
   */
  /*private async loadForm(): Promise<void> {
   await this.loadFormData(this.selTableRow.CSVCONFIG_ID.toString());
 }*/



  get tableCreateFunc() {
    return this.tableCreate.bind(this);
  }

  tableCreate() {
    this.createItem();
  }

  /*get csvTemplateConfigSaveFormFunc() {
    return this.saveForm.bind(this);
  }*/

  /**
   * save form - function need form data only for saving
   *
   * form data should contain all necessary data for every field stored in form field "templateOptions", like:
   * "refTable":"countries"     - Referral table name
   * "tableName":"COUNTRIES",   - Table name to save data to.
   * "newItemMode": "false",    - New item mode boolean flag.
   * "isPrimary": "true",       - Flag to mark field as primary, so the primary key will be detected.
   * "needsValidation": "false"
   * @private
   */
  /*private async saveForm(): Promise<void> {
   if (this.customFormComponent && this.customFormComponent.first && this.customFormComponent.first.customForm &&
     this.customFormComponent.first.customForm.form) {
     let formValues: {} = this.customFormComponent.first.customForm.form.getRawValue();
     let fields: FormlyFieldConfig[] = this.customFormComponent.first.customForm.fields;
     let saveResultData: { result: boolean, message: string } =
       await this.formService.saveForm({formValues: formValues, fields: fields});
     if (saveResultData) {
       if (saveResultData.result) {
         this.formService.showSuccessMessage(this.translatePipe.transform(saveResultData.message));
       } else {
         this.formService.showErrorMessage(this.translatePipe.transform(saveResultData.message));
         this.setCopyRowsFromIntoTable('CSV_TEMPLATE_CONFIG_FIELD', 'CSV_TEMPLATE_CONFIG_FIELD_TMP', 'CSV_TEMPLATE_CONFIG_ID,NUM_IN_ORDER,SHORT_DESC,REQUIRED' );
         this.setDeleteAllRowsTable('CSV_TEMPLATE_CONFIG_FIELD_TMP', '')
       }
       this.refreshTableViews();
     } else {
       this.formService.showErrorMessage('ERROR_DURING_SAVING');
     }
   } else {
     this.formService.showErrorMessage('ERROR_DURING_SAVING');
   }
 }*/

  /*private setCopyRowsFromIntoTable(tableName1: string, tableName2: string, columnsTo: string) {
    let idTemp = this.tableDataService.copyRowsFromIntoTable(tableName1, tableName2, columnsTo);
    idTemp.subscribe(() => {
        console.log('Copy all rows from one table to ');
      },
      (err: HttpErrorResponse) => {
        this.tableDataService.handleHttpError(err);
      });
  }

  private setDeleteAllRowsTable(tableName: string,  columnsTo: string) {
    let idTemp = this.tableDataService.deleteAllRowsTable(tableName, columnsTo);
    idTemp.subscribe(() => {
        console.log('Delete all rows from table ');
      },
      (err: HttpErrorResponse) => {
        this.tableDataService.handleHttpError(err);
      });
  }*/

}
