import { Component, OnInit } from '@angular/core';
import {TableDataService} from "../../_services/table-data.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {InfoDialogComponent} from "../info-dialog/info-dialog.component";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";

@Component({
  selector: 'app-table-locks-dialog',
  templateUrl: './table-locks-dialog.component.html',
  styleUrls: ['./table-locks-dialog.component.css'],
  providers: [TranslateItPipe]
})
export class TableLocksDialogComponent implements OnInit {

  constructor(public translatePipe: TranslateItPipe,
              private tableDataService: TableDataService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.deleteTableLocks();
  }

  private async deleteTableLocks() {
    let description = this.translatePipe.transform('REMOVE_TABLE_LOCKS');
    let text = this.translatePipe.transform('TABLE_LOCK_MESSAGE_DELETED');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      description, text
    };
    let self = this;
    let allFlag: boolean = true;
    let dbData = await this.tableDataService.deleteTableLocks(allFlag, "", "", "");
    if (!dbData) {
      return;
    }
    self.dialog.open(InfoDialogComponent, dialogConfig);
  }
}
