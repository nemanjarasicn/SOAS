import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {SoasModel} from "../../_services/constants.service";

@Component({
  selector: 'app-dynamic-form-dialog',
  templateUrl: './dynamic-form-dialog.component.html',
  styleUrls: ['./dynamic-form-dialog.component.css']
})
export class DynamicFormDialogComponent{

  constructor(
    public dialogRef: MatDialogRef<DynamicFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      title: string
      formlyFieldConfig: FormlyFieldConfig[]
      modalData?: SoasModel
    }
  ) {}

  onFormSubmit(form: FormGroup): void {
    this.dialogRef.close(form.getRawValue())
  }

  close(): void {
    this.dialogRef.close(null)
  }
}
