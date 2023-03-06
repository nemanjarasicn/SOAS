// import { Component, OnInit } from '@angular/core';
// import {FieldConfig} from "../../interfaces/field.interface";
// import {FormGroup} from "@angular/forms";
//
// @Component({
//   selector: 'app-hidden',
//   template: `
//     <mat-form-field class="field-full-width" [formGroup]="group" [hidden]="true">
//       <input matInput [formControlName]="field?.name" [placeholder]="field?.label" [id]="field?.id" [type]="field?.inputType"
//              [value]="field?.value" [readonly]="field?.readonly" [hidden]="true">
//       <ng-container *ngFor="let validation of field?.validations;" ngProjectAs="mat-error">
//         <mat-error *ngIf="group.get(field?.name)?.hasError(validation?.name)">{{validation?.message}}</mat-error>
//       </ng-container>
//     </mat-form-field>
//   `,
//   styleUrls: ['./hidden.component.css']
// })
// export class HiddenComponent implements OnInit {
//
//   field: FieldConfig;
//   group: FormGroup;
//
//   constructor() { }
//
//   ngOnInit() {
//   }
//
// }
