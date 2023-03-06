import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {TableDataService} from "../../_services/table-data.service";
import {StockTransferDialogComponent} from "../stock-transfer-dialog/stock-transfer-dialog.component";

@Component({
  selector: 'app-stock-transfer-dialog-setup',
  templateUrl: './stock-transfer-dialog-setup.component.html',
  styleUrls: ['./stock-transfer-dialog-setup.component.css'],
  providers: [ TranslateItPipe ]
})
export class StockTransferDialogSetupComponent implements OnInit {

  description: string;

  constructor(public matDialog: MatDialog,
              public translatePipe: TranslateItPipe,
              private tableDataService: TableDataService) { }

  ngOnInit() {
    this.description = this.translatePipe.transform("STOCK_TRANSFER_DESCRIPTION");
    this.showDialog();
  }

  async showDialog() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "table-dialog";
    dialogConfig.width = "900px";
    dialogConfig.height = "600px";
    dialogConfig.data = {
      name: "stockTransfer",
      title: "STOCK_TRANSFER",
      description: this.description + ":",
      actionButtonText: "OK",
      message: "",
      data: 'stockTransfer'
    };
    await this.tableDataService.removeAllTableLocks(true, "", "");
    // https://material.angular.io/components/dialog/overview
    this.matDialog.open(StockTransferDialogComponent, dialogConfig);
  }

}
