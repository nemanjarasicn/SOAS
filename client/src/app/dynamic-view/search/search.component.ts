// import {Component, OnInit, ViewChild} from '@angular/core';
// import {FieldConfig} from "../../interfaces/field.interface";
// import {FormControl, FormGroup} from "@angular/forms";
// import {MatAutocomplete} from "@angular/material/autocomplete";
// import {Observable} from "rxjs";
// import {map, startWith} from 'rxjs/operators';
//
//
//
//
// // @Component({
// //   selector: 'app-p-autoComplete',
// //   template: `
// //     <mat-form-field class="field-full-width" [formGroup]="group">
// //       <mat-autocomplete #auto="matAutocomplete">
// //         <mat-option *ngFor="let option of options" [value]="option">
// //           {{option}}
// //         </mat-option>
// //       </mat-autocomplete>
// // <!--      <p-autoComplete #autocomplete-->
// // <!--                      [formControlName]="field?.name"-->
// // <!--                      [name]="field?.name"-->
// // <!--                      [minLength]="1"-->
// // <!--                      required-->
// // <!--                      autofocus>-->
// // <!--      </p-autoComplete>-->
// //     </mat-form-field>
// //   `,
// //   styleUrls: ['./search.component.css']
// // })
// @Component({
//   selector: 'app-autocomplete',
//   template: `
//     <mat-form-field class="field-full-width" [formGroup]="group">
//       <input matInput [formControlName]="field?.name" [placeholder]="field?.label" [id]="field?.id" [type]="field?.inputType" [value]="field?.value" [readonly]="field?.readonly" [matAutocomplete]="autocmpl">
//       <ng-container *ngFor="let validation of field?.validations;" ngProjectAs="mat-error">
//         <mat-error *ngIf="group.get(field?.name)?.hasError(validation?.name)">{{validation?.message}}</mat-error>
//       </ng-container>
//       <mat-autocomplete #autocmpl="matAutocomplete" >
//         <mat-option *ngFor="let option of filteredOptions | async" [value]="option">
//           {{option}}
//         </mat-option>
//       </mat-autocomplete>
//     </mat-form-field>
//   `,
//   //templateUrl: './input.component.html',
//   // styleUrls: ['./input.component.css']
//   styleUrls: ['./search.component.css']
// })
// export class SearchComponent implements OnInit {
//
//   field: FieldConfig;
//   group: FormGroup;
//
//   options: string[] = ['One', 'Two', 'Three'];
//   filteredOptions: Observable<string[]>;
//
//   constructor() {
//   }
//
//   ngOnInit() {
//     // this.group = new FormGroup({});
//     //
//     // this.group.addControl(this.field.name, new FormControl());
//
//     this.filteredOptions = this.group.controls["CUSTOMER_ORDER"].valueChanges
//       .pipe(
//         startWith(''),
//         map(value => this._filter(value))
//       );
//   }
//
//   private _filter(value: string): string[] {
//     let lowercaseValue = "";
//     if (value && value.length > 0) {
//       lowercaseValue = value.toLowerCase();
//     }
//     const filterValue = lowercaseValue;
//     return this.options.filter(option => option.toLowerCase().includes(filterValue));
//   }
//
//   public setAutoCompleteOptions(opt: string[]) {
//     this.options = opt;
//   }
//
// }
