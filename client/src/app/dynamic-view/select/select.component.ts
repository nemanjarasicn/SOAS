// import { Component, OnInit } from "@angular/core";
// import { FormGroup } from "@angular/forms";
// import {FieldConfig} from "../../interfaces/field.interface";
//
// @Component({
//   selector: "app-select",
//   template: `
//     <mat-form-field class="select-field" [formGroup]="group">
//       <mat-select [id]="field?.id" [placeholder]="field.label" [formControlName]="field.name"
//                   [required]="field.validations[0].validator">
//         <mat-option *ngFor="let item of field.options" [value]="item.value">{{item.name}}</mat-option>
//         <mat-error *ngIf="group.hasError('required')">
//           {{field.name}} is required
//         </mat-error>
//       </mat-select>
//     </mat-form-field>
// `,
//   styles: [`
//     .select-field {
//       display: flex !important;
//     }
//     .mat-select-value {
//       text-align: left;
//     }
//   `]
// })
// export class SelectComponent implements OnInit {
//   field: FieldConfig;
//   group: FormGroup;
//   constructor() {}
//   ngOnInit() {
//     this.setFieldEnabled();
//   }
//
//   // ngAfterViewInit() {}
//
//   setOptions(options) {
//     this.field.options = options;
//     // console.log("field.options: ", this.field.options);
//   }
//
//   private setFieldEnabled() {
//     // console.log("::: NAME: ", this.field.name);
//     // console.log("::: this.field.readonly: ", this.field.readonly);
//     if (this.field.readonly) {
//       this.group.controls[this.field.name].disable();
//     } else {
//       this.group.controls[this.field.name].enable();
//     }
//   }
//
//   // add (mouseenter)="onMouseEnter($event)" to mat-select first...
//   // onMouseEnter($event: MouseEvent) {
//   //   console.log("options: ", this.field.options);
//   //   console.log("is disabled: ", this.group.controls[this.field.name].disabled);
//   //   if (!this.group.controls[this.field.name].disabled) {
//   //     if (this.field.options && this.field.options.length === 1 && this.field.options[0]['name'] === 'Bitte auswählen') {
//   //       this.group.controls[this.field.name].disable();
//   //       console.log("Prevented...");
//   //     }
//   //   }
//   // }
// }
