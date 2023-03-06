// import {Component, OnInit, ViewChild} from '@angular/core';
// import {map} from "rxjs/operators";
// import {HttpClient, HttpErrorResponse} from "@angular/common/http";
// import {FormBuilder, FormGroup} from "@angular/forms";
// import {Observable} from "rxjs";
// import {MatSort} from '@angular/material/sort';
// import {MatTableDataSource} from '@angular/material/table';
// import {MatPaginator, PageEvent} from '@angular/material/paginator';
// import {Router} from "@angular/router";
// import {Whlocation} from "../../interfaces/whlocation-item";
// import {ConstantsService} from "../../_services/constants.service";
// import {SelectionModel} from "@angular/cdk/collections";
// import {TableDataService} from "../../_services/table-data.service";
// import {DetailViewArticlesComponent} from "../detail-view-articles/detail-view-articles.component";
// import {WhLocation} from "../../models/wh-location";
// import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
//
// interface TableItem {
//   name: string;
// }
//
// @Component({
//   selector: 'app-whlocation',
//   templateUrl: './whlocation.component.html',
//   styleUrls: ['./whlocation.component.css'],
//   providers: [TranslateItPipe]
// })
// /** @deprecated  */
// export class WhlocationComponent implements OnInit {
//
//   @ViewChild(DetailViewArticlesComponent, {static: false}) detailViewArticleComponent: DetailViewArticlesComponent;
//
//   allowMultiSelect: boolean = false;
//
//   refTable = 'whlocation'; // [WAREHOUSE_LOCATIONS]
//   emptyWHLName = '00000000000000'; // [WAREHOUSE_NAME]
//
//   selTableRow: WhLocation;
//   setClickedRow: Function;
//
//   tableForm: FormGroup;
//   displayedColumns: string[] = [];
//   tableTitle: string = 'WAREHOUSE_LOCATION';
//   items: Whlocation[];
//   dataSource;
//   data: string = 'whlocation';
//   PAGINATOR_ELEMENTS_PER_SIDE: number[];
//   currPageSize: number;
//   selectionModel: SelectionModel<TableItem>;
//
//   createTitle: string;
//   createTooltip: string;
//
//   newWHLocationMode = false;
//
//   @ViewChild(MatSort, {static: false}) sort: MatSort;
//   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
//
//   constructor(
//     private http: HttpClient,
//     private formBuilder: FormBuilder,
//     private whlocationService: TableDataService,
//     private router: Router,
//     private CONSTANTS: ConstantsService,
//     public soasPipe: TranslateItPipe
//   ) {
//     this.selTableRow = undefined;
//     this.items = [];
//   }
//
//   applyFilter(event: Event) {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//   }
//
//   ngOnInit() {
//     localStorage.setItem(this.CONSTANTS.LS_SEL_REF_TABLE, this.refTable);
//     this.PAGINATOR_ELEMENTS_PER_SIDE = this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE_BIG;
//     this.paginator._intl.itemsPerPageLabel = this.soasPipe.transform('ITEMS_PER_SIDE');
//     this.currPageSize = this.PAGINATOR_ELEMENTS_PER_SIDE[0];
//
//     this.createTitle = 'CREATE_NEW_WHLOCATION';
//     this.createTooltip = '';
//
//     this.setClickedRow = function (component) {
//       let rowNumber = parseInt(this.dataSource.data.findIndex(row => row === component));
//       this.newWHLocationMode = false;
//       this.emptyForms();
//       this.selTableRow = component;
//       localStorage.setItem(this.CONSTANTS.LS_SEL_WH_LOCATION_NAME, component.WAREHOUSE_NAME);
//       let self = this;
//       this.whlocationService.removeAllTableLocks(true, "","",function (remResult) {
//         self.selectTableItem(rowNumber, self.allowMultiSelect);
//       });
//     }
//   }
//
//   ngAfterViewInit() {
//     //
//     // let temp = this.whlocationService.getTableData(this.data);
//     // temp.subscribe((dbData) => {
//     //     if (!dbData) {
//     //       return;
//     //     }
//     //     this.items = dbData['table'][1];
//     //     this.displayedColumns = (<string>dbData['table'][0]).split(',');
//     //     this.displayedColumns.push("action");
//     //     this.dataSource = new MatTableDataSource(this.items);
//     //     this.dataSource.sort = this.sort;
//     //     this.dataSource.paginator = this.paginator;
//     //
//     //     let selectionIndex: number = 0;
//     //     let selWhLocationName = localStorage.getItem(this.CONSTANTS.LS_SEL_WH_LOCATION_NAME);
//     //     let selCustomerFound = false;
//     //     if ((selWhLocationName !== undefined) && (selWhLocationName !== 'undefined') && selWhLocationName) {
//     //       for (let item in this.items) {
//     //         if (this.items[item].WAREHOUSE_NAME === selWhLocationName) {
//     //           this.selectTableItem(item, this.allowMultiSelect);
//     //           selCustomerFound = true;
//     //         }
//     //       }
//     //     }
//     //     if (!selCustomerFound) {
//     //       // @ts-ignore
//     //       const initialSelection = [this.items[selectionIndex]];
//     //       // @ts-ignore
//     //       this.selectionModel = new SelectionModel<TableItem>(this.allowMultiSelect, initialSelection);
//     //     }
//     //   },
//     //   (err: HttpErrorResponse) => {
//     //     this.handleHttpError(err);
//     //   });
//   }
//
//   private selectTableItem(item: string, allowMultiSelect: boolean) {
//     console.log('selectTableItem Article Components');
//     if ((this.selTableRow === undefined) && this.items) {
//       // @ts-ignore
//       this.selTableRow = this.items[item];
//     }
//     if (this.detailViewArticleComponent) {
//       this.detailViewArticleComponent.setRefTable(this.refTable);
//       this.detailViewArticleComponent.setSelCustomerRow(this.selTableRow);
//       this.detailViewArticleComponent.getArticleFormData(this.selTableRow.WAREHOUSE_NAME);
//     } else {
//       console.log('detailViewArticleComponent still UNDEFINED ?!?!?!?!?!?');
//     }
//     const initialSelection = [this.items[item]];
//     // @ts-ignore
//     this.selectionModel = new SelectionModel<TableItem>(allowMultiSelect, initialSelection);
//   }
//
//   onGetTable(): Observable<object> {
//     return this.http.get<{ table: object }>('table')
//       .pipe(
//         map(result => {
//           return result.table;
//         })
//       );
//   }
//
//   tableKeydown(event: KeyboardEvent) {
//     if (this.selTableRow) {
//       let newSelection;
//       const currentSelection = this.selTableRow;
//       const currentIndex     = this.dataSource.data.findIndex(row => row === currentSelection);
//       if (event.key === 'ArrowDown') {
//         if (this.currPageSize > (currentIndex + 1)) {
//           newSelection = this.dataSource.data[currentIndex + 1];
//         }
//       } else if (event.key === 'ArrowUp') {
//         if (this.currPageSize > (currentIndex - 1)) {
//           newSelection = this.dataSource.data[currentIndex - 1];
//         }
//       }
//       if (newSelection) {
//         this.setClickedRow(newSelection);
//       }
//     }
//   }
//
//   /*******************************************
//    * HELPER FUNCTIONS
//    ******************************************/
//
//   private handleHttpError(err: HttpErrorResponse) {
//     if (err.error instanceof Error) {
//       console.log('Client-side error occured.');
//     } else {
//       console.log('Server-side error occured.');
//     }
//     console.log('error', err);
//   }
//
//   private resetTable() {
//     this.selTableRow = undefined;
//   }
//
//   private emptyForms() {
//     // set empty whlocation model
//     this.selTableRow = this.detailViewArticleComponent.whLocationModel;
//     if (this.detailViewArticleComponent) {
//       this.detailViewArticleComponent.emptyForms();
//     }
//   }
//
//   get articlesResetFormFunc() {
//     return this.articlesResetForm.bind(this);
//   }
//
//   articlesResetForm() {
//     this.emptyForms();
//     this.resetTable();
//   }
//
//   pageEvent($event: PageEvent) {
//     this.currPageSize = $event.pageSize;
//   }
//
//   createItem() {
//     this.newWHLocationMode = true;
//     this.emptyForms();
//     if (this.detailViewArticleComponent) {
//       this.detailViewArticleComponent.setRefTable(this.refTable);
//       this.detailViewArticleComponent.getArticleFormData(this.emptyWHLName);
//     }
//   }
//
//   deleteItem(i: any, row: any) {
//   }
// }
//
