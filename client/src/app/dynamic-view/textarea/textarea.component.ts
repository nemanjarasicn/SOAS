// import { Component, OnInit } from '@angular/core';
// import {FieldConfig} from "../../interfaces/field.interface";
// import {FormGroup} from "@angular/forms";
//
// @Component({
//   selector: 'app-textarea',
//   template: `
//     <mat-form-field appearance="fill"  class="field-full-width margin-top" [formGroup]="group">
//       <mat-label>{{field?.label}}</mat-label>
//       <textarea matInput type="text" [formControlName]="field?.name" [placeholder]="field?.label" [value]="field?.value"  [readonly]="field?.readonly"></textarea>
//       <ng-container *ngFor="let validation of field?.validations;" ngProjectAs="mat-error">
//         <mat-error *ngIf="group.get(field?.name)?.hasError(validation?.name)">{{validation?.message}}</mat-error>
//       </ng-container>
//     </mat-form-field>
//   `,
//   styleUrls: ['./textarea.component.css']
// })
// export class TextareaComponent implements OnInit {
//
//   field: FieldConfig;
//   group: FormGroup;
//
//   constructor() {
//
//   }
//
//   ngOnInit() {
//   }
//
// }
