// import {Component, HostListener, OnInit} from '@angular/core';
// import {FieldConfig} from "../../interfaces/field.interface";
// import {FormGroup} from "@angular/forms";
//
// @Component({
//   selector: 'app-input',
//   template: `
//     <mat-form-field class="field-full-width" [formGroup]="group">
//       <input matInput [formControlName]="field?.name" [placeholder]="field?.label" [id]="field?.id" [type]="field?.inputType" [value]="field?.value" [readonly]="field?.readonly">
//       <ng-container *ngFor="let validation of field?.validations;" ngProjectAs="mat-error">
//         <mat-error *ngIf="group.get(field?.name)?.hasError(validation?.name)">{{validation?.message}}</mat-error>
//       </ng-container>
//     </mat-form-field>
//   `,
//   //templateUrl: './input.component.html',
//   styleUrls: ['./input.component.css']
// })
// export class InputComponent implements OnInit {
//
//   field: FieldConfig;
//   group: FormGroup;
//
//   constructor() {
//   }
//
//   ngOnInit() {
//     this.setFieldEnabled();
//   }
//
//   /**
//    * Manage set field "Beschreibung (GROSSBUCHSTABEN)" to upper case
//    */
//   @HostListener('keyup') onKeyUp() {
//     // ToDo: Field name should not be hardcoded here
//     if (this.field.name === 'ITMDES_UC') {
//       this.group.controls[this.field.name].setValue(this.group.controls[this.field.name].value.toUpperCase());
//     } else if (this.field.name === 'ART_LENGTH' || this.field.name === 'ART_WIDTH' || this.field.name === 'ART_HEIGHT' ||
//       this.field.name === 'PACK_LENGTH' || this.field.name === 'PACK_WIDTH' || this.field.name === 'PACK_HEIGHT' ||
//       this.field.name === 'ITMWEIGHT') {
//       this.group.controls[this.field.name].setValue(this.group.controls[this.field.name].value.toString().replace(/,/g, '.'));
//     }
//   }
//
//   private setFieldEnabled() {
//
//     if (!this.field) {
//       return;
//     }
//
//     if (this.field.readonly) {
//       this.group.controls[this.field.name].disable();
//     } else {
//       this.group.controls[this.field.name].enable();
//     }
//   }
// }
