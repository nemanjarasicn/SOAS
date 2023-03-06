// import { Component, OnInit } from '@angular/core';
// import {FieldConfig} from "../../interfaces/field.interface";
// import {FormGroup} from "@angular/forms";
//
// // ToDo: Add '[id]="field?.id"' to "<input ..." ?
// @Component({
//   selector: 'app-checkbox',
//   //templateUrl: './checkbox.component.html',
//   template: `
//     <div class="field-full-width margin-top" [formGroup]="group">
//       <!--<mat-checkbox [formControlName]="field?.name" [checked]="field?.value">{{field?.label}}</mat-checkbox>-->
//       <input type="checkbox" class="mat-checkbox-input" [formControlName]="field?.name" [placeholder]="field?.label"
//              [checked]="field?.value" [readonly]="field?.readonly"/>
//       <span class="mat-checkbox-label"><span style="display: none;">&nbsp;</span>{{field?.label}}</span>
//     </div>
//   `,
//   styleUrls: ['./checkbox.component.css']
// })
// export class CheckboxComponent implements OnInit {
//
//   field: FieldConfig;
//   group: FormGroup;
//
//   constructor() { }
//
//   ngOnInit() {
//     this.setFieldEnabled();
//   }
//
//   private setFieldEnabled() {
//
//     if (!this.field) {
//       return;
//     }
//
//     if (this.field.readonly) {
//       // this.group.controls[this.field.name].disable();
//       this.group.get(this.field.name).disable();
//     } else {
//       // this.group.controls[this.field.name].enable();
//       this.group.get(this.field.name).enable();
//     }
//   }
// }
