import { Component, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import { MatInput } from '@angular/material/input';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-form-datepicker-type',
  template: `
<!--    <input matInput-->
<!--      [errorStateMatcher]="errorStateMatcher"-->
<!--      [formControl]="formControl"-->
<!--      [matDatepicker]="picker"-->
<!--      [matDatepickerFilter]="to.datepickerOptions.filter"-->
<!--      [formlyAttributes]="field">-->
<!--    <ng-template #matSuffix>-->
<!--      <mat-datepicker-toggle [for]="picker"></mat-datepicker-toggle>-->
<!--    </ng-template>-->
<!--    <mat-datepicker #picker></mat-datepicker>-->
  <mat-form-field appearance="fill">
    <mat-label>Moment.js datepicker</mat-label>
    <input matInput [matDatepicker]="dp" [formControl]="date">
    <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>
    <mat-datepicker #dp></mat-datepicker>
  </mat-form-field>
  `,
})
export class DatepickerTypeComponent {
  // Optional: only if you want to rely on `MatInput` implementation
  // @ViewChild(MatInput, {static: false}) formFieldControl: MatInput;
  // Datepicker takes `Moment` objects instead of `Date` objects.
  date: any;
}
