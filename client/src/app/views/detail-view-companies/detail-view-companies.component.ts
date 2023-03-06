// import {Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
// import {DynamicFormComponent} from "../../dynamic-view/dynamic-form/dynamic-form.component";
// import {TableDataService} from "../../_services/table-data.service";
// import {Router} from "@angular/router";
// import {ConstantsService, ViewQueryTypes} from "../../_services/constants.service";
// import {MatTabChangeEvent} from "@angular/material/tabs";
// import {CompaniesLocations} from "../../models/Companies-locations";
// import {MatPaginator} from "@angular/material/paginator";
// import {MatSort} from "@angular/material/sort";
// import {ArticleComponent} from "../../interfaces/article-component-item";
// import {PriceListSales} from "../../models/price-list-sales";
// import {CustomTableComponent} from "../custom/custom-table/custom-table.component";
// import {FormService} from "../../_services/form.service";
// import {Warehousing} from "../../models/warehousing";
// import {AttributeNames} from "../../models/attribute-names";
// import {Attributes} from "../../models/attributes";
// import {ProductComponents} from "../../models/product-components";
// import {Sort} from "../custom/custom-table/page";
// import {FormlyFieldConfig} from "@ngx-formly/core";
// import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
// import {MessageService} from "primeng/api";
//
//
// @Component({
//   selector: 'app-detail-view-companies',
//   templateUrl: './detail-view-companies.component.html',
//   styleUrls: ['./detail-view-companies.component.css']
// })
// export class DetailViewCompaniesComponent implements OnInit {
//
//   @Input() resetForm: Function;
//
//   refTable: string = this.CONSTANTS.REFTABLE_COMPANIES_LOCATIONS;
//   allowMultiSelect: boolean;
//
//   // Table view
//   @ViewChildren(CustomTableComponent) customTableComponent !: QueryList<CustomTableComponent>;
//
//   displayedColumns = ['COMPANY','LOCATION', 'DESCRIPTION'];
//   initialSort: Sort<CompaniesLocations> = {property: 'COMPANY', order: 'asc'};
//
//   // @ts-ignore
//   @ViewChild(DynamicFormComponent) listForm: DynamicFormComponent;
//   detailViewInitialized: boolean;
//
//   // Empty models
//   componentModel = new CompaniesLocations(0,'', '', 0, 0);
//
//   tableTitle: string;
//   listTitle: string;
//   createTitle: string;
//   createTooltip: string;
//
//   listSubTitle: string;
//
//   formConfig: FormlyFieldConfig[];
//   formDisabledFlag: boolean;
//
//   selListItemIndex: number;
//
//   newComponentMode: boolean;
//   listFormChanged: boolean;
//
//   PAGINATOR_ELEMENTS_PER_SIDE : number[];
//   currPageSize: number;
//   tableColumnsToHide: string[];
//
//   currencies = [{name: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
//   pcurrencies = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
//   prodUnits = [{name: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
//   compnums = [{name: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
//
//   dividerChar = "#";
//
//   @ViewChild(MatSort, {static: false}) sort: MatSort;
//   @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
//
//   constructor(private tableDataService: TableDataService,
//               private router: Router,
//               private formService: FormService,
//               private messageService: MessageService,
//               private CONSTANTS: ConstantsService,
//               public translatePipe: TranslateItPipe) {
//     this.tableTitle = 'COMPANIES_LOCATIONS';
//     this.listTitle = 'COMPANIES_LOCATIONS';
//     this.createTitle = 'CREATE_NEW_COMPANIES_LOCATION';
//     this.createTooltip = 'CREATE_NEW_COMPANIES_LOCATION'; //'Neue Komponente hinzufügen';
//     this.listSubTitle = 'Komponenten-Nr.:'; // 'Komponentennummer:';
//     this.resetVars();
//     this.formService.setTranslatePipe(translatePipe);
//     formService.setMessageService(messageService);
//     // form is not disabled by default
//     this.formDisabledFlag = false;
//   }
//
//   ngOnInit() {
//   }
//
//   public resetVars() {
//     this.newComponentMode = false;
//     this.listFormChanged = false;
//     //this.componentPositionsItems = [];
//     this.allowMultiSelect = false;
//     this.detailViewInitialized = false;
//   }
//
//   public setPaginator(paginatorPerSide: number []) {
//     this.PAGINATOR_ELEMENTS_PER_SIDE = paginatorPerSide;
//     this.currPageSize = paginatorPerSide[0]; // maxElements;
//   }
//
//   public setSelTableRow(selRow: CompaniesLocations) {
//     if (this.customTableComponent && this.customTableComponent.first) {
//       this.customTableComponent.first.setSelTableRow(selRow);
//     }
//   }
//
//   public setRefTable(table: string) {
//     this.refTable = table;
//   }
//
//   public setTableColumnsToHide(tableColumnsToHide: string[]) {
//     this.tableColumnsToHide = tableColumnsToHide;
//   }
//
//   /*public setCurrencies(cr: []) {
//     this.currencies = cr;
//   }
//
//   public setPCurrencies(pcr: []) {
//     this.pcurrencies = pcr;
//   }*/
//
//   /**
//    * @ToDo: Refactor to remove switch and have only one getTableDataByCustomersNumberPromise..
//    *
//    * getTableDataByCustomersNumber() - loads detail view table items to tableDbData
//    *
//    * @param itemNumber
//    * @param optionalParameter
//    * @param clicked
//    */
//   public async getFormData(itemNumber: string, optionalParameter: string, clicked: boolean) {
//     let customerColumn;
//     let secondColumn = undefined;
//     let secondId = undefined;
//     let refTableTitle: undefined | string = undefined;
//     let customerNumber: undefined | string = undefined;
//     const __ret = this.getTableAndDataset(refTableTitle, customerNumber);
//     refTableTitle = __ret.refTableTitle;
//     customerNumber = __ret.customerNumber;
//     let optionalParameterColumn: string;
//     let lockedMessage: string = this.translatePipe.transform('TABLE_LOCK_MESSAGE_LOCKED');
//     let isLockedResult = await this.tableDataService.isTableLocked(refTableTitle, itemNumber, lockedMessage);
//     this.formDisabledFlag = !!isLockedResult;
//     let selItemId: string; // optional param for WAREHOUSING id
//     let tempRefTable: string = this.refTable;
//     let firstParamKey: string = "";
//     let firstParamVal: string = "";
//     let secondParamKey: string = "";
//     let secondParamVal: string = "";
//     let searchColumn: string;
//     let additionalSearchColumns: string = "";
//     let localStorageKey: string = "";
//     let secondParamColumn;
//     let secondParamValue;
//     if (itemNumber !== "") {
//       let tableDbData: {};
//       if (refTableTitle !== undefined && customerNumber !== undefined) {
//         if (this.newComponentMode) {
//           if (this.refTable === this.CONSTANTS.REFTABLE_COMPANIES_LOCATIONS) {
//             this.setSelTableRow(this.componentModel);
//           }
//           return await this.setForm(customerColumn, itemNumber, secondColumn, secondId);
//         } else {
//
//             customerColumn = this.CONSTANTS.REFTABLE_COMPANIES_LOCATIONS_COLUMN;
//             localStorageKey = this.CONSTANTS.LS_SEL_COMPANY_LOCATION;
//             selItemId = localStorage.getItem(localStorageKey);
//             optionalParameterColumn = this.CONSTANTS.REFTABLE_COMPANIES_LOCATIONS_LOCATION_COLUMN;
//             tempRefTable = this.CONSTANTS.REFTABLE_COMPANIES_LOCATIONS;
//             firstParamKey = this.CONSTANTS.REFTABLE_COMPANIES_LOCATIONS_COLUMN;
//             searchColumn = "COMPANY";
//             additionalSearchColumns = "COMPANY,LOCATION";
//
//           firstParamVal = localStorage.getItem(localStorageKey);
//           const __ret = await this.getTableDataFromDB(tableDbData, tempRefTable, customerColumn, itemNumber,
//             firstParamVal, firstParamKey, localStorageKey, secondParamColumn, secondParamValue);
//           tableDbData = __ret.tableDbData;
//           firstParamVal = __ret.firstParamVal;
//           if (!tableDbData) {
//             return {result: false, method: 'getFormData - tableDbData is empty...'};
//           }
//           this.customTableComponent.first.setLabels(this.tableTitle, this.createTitle);
//           if (!clicked) {
//             this.customTableComponent.first.setPageParams(this.refTable,
//               customerColumn, itemNumber, secondParamKey, "",
//               searchColumn, additionalSearchColumns, this.displayedColumns, ViewQueryTypes.DETAIL_TABLE);
//             this.customTableComponent.first.setPaginatedDataSource(this.currPageSize);
//             let tableData: {} = await this.customTableComponent.first.getDataSource();
//             this.customTableComponent.first.selTableRow = await this.customTableComponent.first.setTableItems(tableData,
//               customerColumn, itemNumber, true, selItemId);
//             this.customTableComponent.first.setSelTableRow(this.customTableComponent.first.selTableRow);
//           }
//           return await this.setForm(firstParamKey, firstParamVal, secondParamKey, secondParamVal);
//         }
//       } else {
//         return {result: false, method: 'getFormData - articleNumber is empty...'};
//       }
//     } else {
//       return {result: false, method: 'getFormData - itemNumber is empty...'};
//     }
//   }
//
//   /**
//    * get table data from db
//    *
//    * @param tableDbData
//    * @param tempRefTable
//    * @param customerColumn
//    * @param itemNumber
//    * @param firstParamVal
//    * @param firstParamKey
//    * @param lsKey
//    * @param secondParamColumn
//    * @param secondParamValue
//    * @private
//    */
//   private async getTableDataFromDB(tableDbData: {}, tempRefTable: string, customerColumn: string, itemNumber: string,
//                                    firstParamVal: string, firstParamKey: string, lsKey: string,
//                                    secondParamColumn: string, secondParamValue: string) {
//     tableDbData = await this.tableDataService.getTableDataByCustomersNumber(tempRefTable,
//       ViewQueryTypes.PURE_SELECT, customerColumn, itemNumber, secondParamColumn, secondParamValue);
//     // If no detail table item is selected, select first item and save item to localStorage
//     if (!firstParamVal && tableDbData['table'][1][0]) {
//       firstParamVal = tableDbData['table'][1][0][firstParamKey];
//       localStorage.setItem(lsKey, firstParamVal);
//       this.setSelTableRow(tableDbData['table'][1][0]);
//     }
//     return {tableDbData, firstParamVal};
//   }
//
//   /**
//    * set table data - subscribe to fetch data service
//    *
//    * @param selItemId
//    * @param selItemKey
//    * @param selItemValue
//    * @private
//    */
//   public async setTableData(selItemId: string, selItemKey: string, selItemValue: string) {
//     let data = await this.customTableComponent.first.getDataSource();
//     this.customTableComponent.first.selTableRow = await this.customTableComponent.first.setTableItems(data,
//       selItemKey, selItemValue, true, selItemId);
//     this.customTableComponent.first.setSelTableRow(this.customTableComponent.first.selTableRow);
//     this.customTableComponent.first.setSelectionModel();
//   }
//
//   /**
//    * set form
//    *
//    * @param customerColumn
//    * @param itemNumber
//    * @param secondColumn
//    * @param secondId
//    */
//   public setForm(customerColumn: string, itemNumber: string, secondColumn: string, secondId: string): Promise<{}> {
//     return new Promise(async (resolve, reject) => {
//       let formDisabled: boolean = false;
//       this.resetFormConfigs();
//       this.resetFormList();
//       let tempRefTable = (this.refTable === this.CONSTANTS.REFTABLE_COMPANIES_LOCATIONS) ?
//         this.CONSTANTS.REFTABLE_COMPANIES_LOCATIONS : this.refTable;
//       let result = await this.formService.getFormConfigData(tempRefTable, this.newComponentMode,
//         customerColumn, itemNumber, secondColumn, secondId, undefined, formDisabled);
//       // this.listForm = new DynamicFormComponent();
//       this.formConfig = result.fields;
//       setTimeout(() => {
//         if (this.listForm) {
//           this.listForm.setModel(result.model);
//           this.listForm.setFields(result.fields);
//         } else {
//           resolve({result: false, method: 'setForm - listform is undefined...'});
//         }
//         resolve({result: true});
//       });
//     });
//   }
//
//   public resetFormConfigs() {
//     //this.formList = undefined;
//     //this.allListItemsConfig = [];
//     this.formConfig = undefined;
//   }
//
//   public resetFormList() {
//     //this.formList = undefined;
//     //this.allListItemsConfig = [];
//   }
//
//   createItem() {
//     // console.log('detail-view-list createItem...');
//     // this.newComponentMode = true;
//     // this.emptyForms();
//     // if (this.listForm) {
//     //   return this.setAndLoadFormData(this);
//     // } else {
//     //
//     // }
//   }
//
//   /**
//    * set and load form data
//    *
//    * @private
//    */
//   public async setAndLoadFormData() {
//     return await this.loadFormData(this.newComponentMode ? this.CONSTANTS.UNIVERSAL_ID_PLACEHOLDER : "");
//   }
//   /**
//    * load form data
//    *
//    * @param selItemId
//    * @private
//    */
//   private async loadFormData(selItemId: string) {
//     let formDisabled: boolean = false;
//     let result: {model: any, fields: any} = await this.formService.getFormConfigData(this.refTable, this.newComponentMode,
//       this.CONSTANTS.REFTABLE_COUNTRIES_COLUMN, selItemId, undefined, undefined,
//       undefined, formDisabled);
//     if (this.listForm) {
//       this.listForm.setFields(result.fields);
//       this.listForm.setModel(result.model);
//     }
//     return {result: true};
//   }
//
//   showItem(itemList: number) {
//     this.selListItemIndex = itemList;
//   }
//
//   private resetSelection() {
//     //this.formList = undefined;
//     this.selListItemIndex = 0;
//     if (this.refTable === this.CONSTANTS.REFTABLE_COMPANIES_LOCATIONS) {
//       localStorage.removeItem(this.CONSTANTS.LS_SEL_COMPANY_LOCATION);
//     }
//     this.resetForm();
//   }
//
//   async close() {
//     if (this.newComponentMode) {
//       this.newComponentMode = false;
//       this.resetForm();
//     } else {
//       this.resetSelection();
//       await this.tableDataService.removeAllTableLocks(true, "", "");
//     }
//   }
//
//   onFormSubmit($event: any) {
//     this.save();
//   }
//
//   public emptyForms() {
//     if (this.customTableComponent.first && this.customTableComponent.first.selTableRow) {
//       this.customTableComponent.first.selTableRow = undefined;
//     }
//     this.selListItemIndex = 0;
//     if (this.customTableComponent.first && this.customTableComponent.first.selectionModel) {
//       this.customTableComponent.first.selectionModel.clear();
//     }
//   }
//
//   public setNewItem(flag) {
//     this.newComponentMode = flag;
//   }
//
//   /*******************************************
//    * HELPER FUNCTIONS
//    ******************************************/
//
//   onTabChange($event: MatTabChangeEvent) {}
//
//   async save() {
//     let formValues: {} = this.listForm.form.getRawValue();
//     let fields: FormlyFieldConfig[] = this.listForm.fields;
//     let saveResultData: { result: boolean, message: string, refTable: string } =
//       await this.formService.saveForm({formValues: formValues, fields: fields});
//     if (saveResultData) {
//       if (saveResultData.result) {
//         this.formService.showSuccessMessage(this.translatePipe.transform(saveResultData.message));
//       } else {
//         this.formService.showErrorMessage(this.translatePipe.transform(saveResultData.message));
//       }
//       this.emptyForms();
//       this.tableDataService.redirectTo('//' + saveResultData.refTable);
//     } else {
//       this.formService.showErrorMessage('ERROR_DURING_SAVING');
//     }
//   }
//
//   public setChanged(flag) {
//     this.listFormChanged = flag;
//   }
//
//   private getTableAndDataset(refTableTitle: string, customerNumber: string) {
//
//     refTableTitle = this.CONSTANTS.REFTABLE_COMPANIES_LOCATIONS;
//     customerNumber = localStorage.getItem(this.CONSTANTS.LS_SEL_COMPANY_LOCATION);
//
//     return {refTableTitle, customerNumber};
//   }
//
//   /**
//    * set form titles
//    *
//    * @param formTabTitle
//    * @param formTitle
//    * @param articleTitle
//    * @param articlesDetailsTitle
//    * @param createTitle
//    */
//   public setLabels(formTabTitle: string, formTitle: string, articleTitle: string, articlesDetailsTitle: string,
//                    createTitle: string) {
//     this.tableTitle = formTabTitle;
//     this.listTitle = formTitle;
//     this.createTitle = createTitle;
//     this.createTooltip = createTitle;
//     this.listSubTitle = articleTitle;
//   }
//
//   public setFormOptions(refTable: string, options: []) {
//     switch (refTable) {
//       case this.CONSTANTS.REFTABLE_PRODUCT_COMPONENTS:
//         this.prodUnits = options;
//         break;
//       default:
//         break;
//     }
//   }
//
//   get tableUpdateFunc() {
//     return this.tableUpdate.bind(this);
//   }
//
//   tableUpdate(selTableRow) {
//     this.newComponentMode = false;
//     this.emptyForms();
//     this.setSelTableRow(selTableRow);
//   }
//
//   get tableCreateFunc() {
//     return this.tableCreate.bind(this);
//   }
//
//   tableCreate() {
//     this.createItem();
//   }
//
//   public setPageSize(currPageSize: number) {
//     this.currPageSize = currPageSize;
//   }
//
// }
