import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {SoasModel} from "../../../_services/constants.service";
import {AbstractControl} from "@angular/forms";

@Component({
  selector: 'app-detail-view-list-dialog',
  templateUrl: './detail-view-list-dialog.component.html',
  styleUrls: ['./detail-view-list-dialog.component.css']
})
export class DetailViewListDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: {
    listTitle: string
    onFormSubmit: (value)=>void
    close: ()=>void
  }) {}

  ngOnInit(): void {}

}
