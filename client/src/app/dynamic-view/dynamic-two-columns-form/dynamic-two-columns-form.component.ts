// import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
// import {FieldConfig} from "../../interfaces/field.interface";
// import {FormBuilder, FormGroup, Validators} from "@angular/forms";
//
// @Component({
//   selector: 'dynamic-two-columns-form',
//   templateUrl: './dynamic-two-columns-form.component.html',
//   styleUrls: ['./dynamic-two-columns-form.component.css']
// })
// /**
//  * @deprecated
//  */
// export class DynamicTwoColumnsFormComponent implements OnInit {
//
//   maxFieldsInColumn: number = 10;
//
//   @Input() fields: FieldConfig[] = [];
//   @Input() leftFields: FieldConfig[] = [];
//   @Input() rightFields: FieldConfig[] = [];
//   @Output() submit: EventEmitter<any> = new EventEmitter<any>();
//
//   form: FormGroup;
//   disabledFlag: boolean;
//
//   get value() {
//     //console.log(this.form);
//     return this.form.value;
//   }
//
//   constructor(private fb: FormBuilder) {
//     this.disabledFlag = false;
//   }
//
//   ngOnInit() {
//     let counter = 0;
//     this.fields.forEach(field => {
//       if (counter < this.maxFieldsInColumn) {
//         this.leftFields.push(field);
//       } else if (counter < (this.maxFieldsInColumn*2)) {
//         this.rightFields.push(field);
//       }
//       counter++;
//     });
//     this.form = this.createControl(this.leftFields);
//     this.form = this.appendToControl(this.rightFields, this.form);
//     this.validateAllFormFields(this.form);
//     this.form.disable();
//   }
//
//   onSubmit(event: Event) {
//     event.preventDefault();
//     event.stopPropagation();
//     if (this.form.valid) {
//       this.submit.emit(this.form.value);
//     } else {
//       this.validateAllFormFields(this.form);
//     }
//   }
//
//   createControl(fields: FieldConfig[]) {
//     const group = this.fb.group({});
//     if (fields) {
//       fields.forEach(field => {
//         if (field.type === "button") return;
//         const control = this.fb.control(
//           field.value,
//           this.bindValidations(field.validations || [])
//         );
//         group.addControl(field.name, control);
//       });
//     }
//     return group;
//   }
//
//   appendToControl(fields: FieldConfig[], group: FormGroup) {
//     if (fields) {
//       fields.forEach(field => {
//         if (field.type === "button") return;
//         const control = this.fb.control(
//           field.value,
//           this.bindValidations(field.validations || [])
//         );
//         group.addControl(field.name, control);
//       });
//     }
//     return group;
//   }
//
//   bindValidations(validations: any) {
//     if (validations.length > 0) {
//       const validList = [];
//       validations.forEach(valid => {
//         validList.push(valid.validator);
//       });
//       return Validators.compose(validList);
//     }
//     return null;
//   }
//
//   validateAllFormFields(formGroup: FormGroup) {
//     Object.keys(formGroup.controls).forEach(field => {
//       const control = formGroup.get(field);
//       control.markAsTouched({ onlySelf: true });
//     });
//   }
//
//   getDisabledFlag() {
//     return this.disabledFlag;
//   }
//
//   public setDisabled(flag: boolean) {
//     this.disabledFlag = flag;
//
//     // // set readonly, to disable/enable select fields
//     // this.fields.forEach(field => {
//     //   if (this.disabledFlag === true) {
//     //     field.readonly = this.disabledFlag;
//     //   }
//     // });
//
//     if (this.disabledFlag) {
//       this.form.disable();
//     } else {
//       this.form.enable();
//     }
//   }
//
//   public removeAllFields() {
//     this.fields = [];
//     this.leftFields = [];
//     this.rightFields = [];
//   }
// }
