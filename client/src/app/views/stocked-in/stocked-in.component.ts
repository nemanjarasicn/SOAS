// import {Component, OnInit, ViewChild} from '@angular/core';
// import {map} from "rxjs/operators";
// import {HttpClient, HttpErrorResponse} from "@angular/common/http";
// import {FormBuilder, FormGroup} from "@angular/forms";
// import {Observable} from "rxjs";
// import {MatSort} from '@angular/material/sort';
// import {MatTableDataSource} from '@angular/material/table';
// import {MatPaginator} from '@angular/material/paginator';
// import {Router} from "@angular/router";
// import {StockedIn} from "../../interfaces/stocked-in-item";
// import {ConstantsService} from "../../_services/constants.service";
// import {SelectionModel} from "@angular/cdk/collections";
// import {TableDataService} from "../../_services/table-data.service";
// import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
//
// interface TableItem {
//   name: string;
// }
//
// @Component({
//   selector: 'app-stocked-in',
//   templateUrl: './stocked-in.component.html',
//   styleUrls: ['./stocked-in.component.css'],
//   providers: [TranslateItPipe]
// })
//
// /** @deprecated  */
// export class StockedInComponent implements OnInit {
//
//   tableForm: FormGroup;
//   displayedColumns: string[] = [];
//   tableTitle: string = 'WAREHOUSE_LOCATION';
//   items: StockedIn[];
//   dataSource;
//   data : string = 'whlocation';
//   PAGINATOR_ELEMENTS_PER_SIDE : number[];
//   selectionModel: SelectionModel<TableItem>;
//
//   @ViewChild(MatSort, {static: false}) sort: MatSort;
//   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
//
//   constructor(
//     private http: HttpClient,
//     private formBuilder: FormBuilder,
//     private stockedInService: TableDataService,
//     private router: Router,
//     private CONSTANTS: ConstantsService,
//     public soasPipe: TranslateItPipe
//   ) {
//   }
//
//   applyFilter(event: Event) {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//   }
//
//   ngOnInit() {
//     // this.PAGINATOR_ELEMENTS_PER_SIDE = this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE;
//     // this.paginator._intl.itemsPerPageLabel = this.soasPipe.transform('ITEMS_PER_SIDE');
//     //
//     // let temp = this.stockedInService.getTableData(this.data);
//     // temp.subscribe((dbData ) => {
//     //     if (!dbData) {
//     //       return;
//     //     }
//     //     this.items = dbData['table'][1];
//     //     this.displayedColumns = (<string>dbData['table'][0]).split(',');
//     //     this.dataSource = new MatTableDataSource(this.items);
//     //     this.dataSource.sort = this.sort;
//     //     this.dataSource.paginator = this.paginator;
//     //     this.selectionModel = new SelectionModel<TableItem>(false);
//     //   },
//     //   (err: HttpErrorResponse) => {
//     //     if (err.error instanceof Error) {
//     //       console.log('Client-side error occured.');
//     //     } else {
//     //       console.log('Server-side error occured.');
//     //     }
//     //     console.log('error', err);
//     //   });
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
// }
//
