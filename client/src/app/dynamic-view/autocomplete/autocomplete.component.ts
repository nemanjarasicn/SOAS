// import {Component, OnInit, ViewChild} from '@angular/core';
// import {FieldConfig} from "../../interfaces/field.interface";
// import {FormGroup} from "@angular/forms";
// import {Observable} from "rxjs";
// import {map, startWith, tap} from 'rxjs/operators';
// import {TableDataService} from "../../_services/table-data.service";
// import {MatAutocomplete} from "@angular/material/autocomplete";
// import {Router} from "@angular/router";
// import {ConstantsService} from "../../_services/constants.service";
//
//
// @Component({
//   selector: 'app-autocomplete',
//   template: `
//     <span class="inputButtonClass">
//       <mat-form-field class="field-full-width" [formGroup]="group">
//         <input matInput [formControlName]="field?.name" [placeholder]="field?.label" [id]="field?.id"
//                [type]="field?.inputType"
//                [value]="field?.value" [readonly]="field?.readonly" [matAutocomplete]="auto">
//         <ng-container *ngFor="let validation of field?.validations;" ngProjectAs="mat-error">
//           <mat-error *ngIf="group.get(field?.name)?.hasError(validation?.name)">{{validation?.message}}</mat-error>
//         </ng-container>
//         <mat-autocomplete #auto="matAutocomplete" (optionSelected)='removeTextInBrackets($event.option.value)'>
//           <mat-option *ngIf="isLoading" class="is-loading">
//             <mat-spinner diameter="30"></mat-spinner>
//           </mat-option>
//           <ng-container *ngIf="!isLoading">
//             <mat-option *ngFor="let option of filteredOptions | async" [value]="option">
//               {{option}}
//             </mat-option>
//           </ng-container>
//         </mat-autocomplete>
//       </mat-form-field>
//       <button class="btn btn-primary save" (click)="newCustomer()" [disabled]="field?.readonly">
//         {{'CREATE_NEW_CUSTOMER' | translateIt}}
//       </button>
//     </span>
//   `,
//   //templateUrl: './autocomplete.component.html',
//   styleUrls: ['./autocomplete.component.css']
// })
// export class AutocompleteComponent implements OnInit {
//
//   field: FieldConfig;
//   group: FormGroup;
//   options: string[] = [];
//   filteredOptions: Observable<string[]>;
//   isLoading = false;
//
//   @ViewChild(MatAutocomplete, {static: false}) auto: MatAutocomplete;
//
//   constructor(
//     private autocompleteService: TableDataService,
//     private router: Router,
//     private CONSTANTS: ConstantsService
//   ) {
//   }
//
//   ngOnInit() {
//     this.setFieldEnabled();
//     if (!this.field.readonly) {
//       if (this.group.controls["CUSTOMER_ORDER"]) {
//         this.filteredOptions = this.group.controls["CUSTOMER_ORDER"].valueChanges
//           .pipe(
//             tap(() => this.isLoading = true),
//             startWith(''),
//             map(value => this._filter(value))
//           );
//       } else if (this.group.controls["CROSSSELLING_DATA"]) {
//         this.filteredOptions = this.group.controls["CROSSSELLING_DATA"].valueChanges
//           .pipe(
//             tap(() => this.isLoading = true),
//             startWith(''),
//             map(value => this._filter(value))
//           );
//       }
//     }
//   }
//
//   private _filter(value: string): string[] {
//     let lowercaseValue = value && value.length > 0 ? value.toLowerCase() : "";
//     const filterValue = lowercaseValue;
//     let self = this;
//     this.searchCustomersNumber(value, function (result) {
//       self.options = result;
//       self.isLoading = false;
//     });
//     return this.options.filter(option => option.toLowerCase().includes(filterValue));
//   }
//
//   public async searchCustomersNumber(value, callback) {
//     // console.log("autocomplete... searchCustomersNumber... value: '" + value + "'");
//     let searchWithLike: boolean = true;
//     let resultAsArray: boolean = true;
//     let additionalColumns: string = "CUSTOMERS_NUMBER,CUSTOMERS_COMPANY,CUSTOMERS_PRENAME,CUSTOMERS_NAME";
//     let curLocRefTable = localStorage.getItem(this.CONSTANTS.LS_SEL_REF_TABLE);
//     let client: string = this.CONSTANTS.CLIENT_B2C;
//     let curRefTable: string = (curLocRefTable &&
//       (curLocRefTable === this.CONSTANTS.REFTABLE_CUSTOMER || curLocRefTable === this.CONSTANTS.REFTABLE_PARTNERS)) ?
//       curLocRefTable : this.CONSTANTS.REFTABLE_CUSTOMER;
//     let ordersClient = localStorage.getItem(this.CONSTANTS.LS_SEL_ORDERS_CLIENT);
//     if (ordersClient && curLocRefTable === this.CONSTANTS.REFTABLE_ORDERS) {
//       curRefTable = ordersClient === this.CONSTANTS.CLIENT_B2C ?
//         this.CONSTANTS.REFTABLE_CUSTOMER : this.CONSTANTS.REFTABLE_PARTNERS;
//       client = ordersClient;
//     }
//     let dbData = await this.autocompleteService.searchTableColumnData(curRefTable, 'CUSTOMERS_NUMBER', value,
//       'CUSTOMERS_TYPE', client, searchWithLike, resultAsArray, additionalColumns);
//     let newArray = [];
//     // console.log('SEARCH RESULT: ', dbData);
//     for (let dbItem in dbData) {
//       newArray.push(dbData[dbItem].CUSTOMERS_NUMBER + ' (' +
//         dbData[dbItem].CUSTOMERS_COMPANY + ' - ' +
//         dbData[dbItem].CUSTOMERS_TYPE + ')');
//     }
//     callback(newArray);
//   }
//
//   public setAutoCompleteOptions(opt: string[]) {
//     this.options = opt;
//   }
//
//   /**
//    * remove text in brackets for insert only customer number into CUSTOMER_ORDER field
//    *
//    * @param value
//    */
//   removeTextInBrackets(value) {
//     // console.log('removeTextInBrackets... ', value);
//     this.field.value = value.replace(/ *\([^)]*\) */g, "");
//     this.group.controls["CUSTOMER_ORDER"].setValue(this.field.value);
//   }
//
//   private setFieldEnabled() {
//
//     if (!this.group.controls[this.field.name]) {
//       return;
//     }
//
//     if (this.field.readonly) {
//       this.group.controls[this.field.name].disable();
//     } else {
//       this.group.controls[this.field.name].enable();
//     }
//   }
//
//   newCustomer() {
//     // this.autocompleteService.redirectTo('//showNewWindow');
//     // create an external window
//     let newWindow : Window = window.open(this.CONSTANTS.SERVER_URL + '/#/custbtwoc', '', 'location=yes,width=800,height=600,left=200,top=200,scrollbars=yes,status=no,menubar=no,toolbar=no,titlebar=no');
//     // newWindow.location.assign('custbtwoc');
//     // newWindow.window.document.location.assign('custbtwoc');
//   }
// }
