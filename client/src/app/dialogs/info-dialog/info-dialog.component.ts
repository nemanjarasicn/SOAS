import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Info} from "../../models/info-dialog";
import {Router} from "@angular/router";
import {ConstantsService} from "../../_services/constants.service";

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent implements OnInit {

  description: string;
  text: string;
  refTable: string;

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) {description,text,reftable}:Info,
    private CONSTANTS: ConstantsService) {
    this.description = description;
    this.text = text;
    this.refTable = reftable;
  }

  ngOnInit() {}

  close() {
    this.dialogRef.close();
    if (this.refTable !== undefined) {
      if (this.refTable === this.CONSTANTS.INFO_DIALOG_NO_NAVIGATION_KEY) {
        // do nothing
      } else {
        this.router.navigate([this.refTable]);
      }
    } else {
      this.router.navigate(['']);
    }
  }

}
