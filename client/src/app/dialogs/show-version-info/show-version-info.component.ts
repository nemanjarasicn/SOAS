import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {InfoDialogComponent} from "../info-dialog/info-dialog.component";
import { environment } from '../../../environments/environment';
import {TableDataService} from "../../_services/table-data.service";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";

@Component({
  selector: 'app-show-version-info',
  templateUrl: './show-version-info.component.html',
  styleUrls: ['./show-version-info.component.css'],
  providers: [TranslateItPipe]
})
export class ShowVersionInfoComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    public translatePipe: TranslateItPipe,
    private tableDataService: TableDataService) { }

  ngOnInit() {
    this.openDialog();
  }

  async openDialog() {
    let description = this.translatePipe.transform('VERSION_INFORMATION');
    let text = this.translatePipe.transform('SOAS_VERSION_IS') + ' ' + environment.version;
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      description, text
    };
    let self = this;
    await this.tableDataService.removeAllTableLocks(true, "", "");
    self.dialog.open(InfoDialogComponent, dialogConfig); // const dialogRef =
    // do something after dialog is closed
    /*dialogRef.afterClosed().subscribe(
      val => console.log("Dialog output:", val)
    );*/
  }
}
