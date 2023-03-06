import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TableDialogComponent} from "../table-dialog/table-dialog.component";
import {BatchDialogComponent} from "../batch-dialog/batch-dialog.component";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {BatchService} from "../../_services/batch.service";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {TableDataService} from "../../_services/table-data.service";

@Component({
  selector: 'app-batch-processes',
  templateUrl: './batch-processes.component.html',
  styleUrls: ['./batch-processes.component.css'],
  providers: [TranslateItPipe]
})

export class BatchProcessesComponent implements OnInit {

  DIALOG_ID: string = "table-dialog";

  constructor(
    public matDialog: MatDialog,
    private batchService: BatchService,
    public translateIt: TranslateItPipe,
    private tableDataService: TableDataService
  ) {
  }

  ngOnInit() {
    this.batchProcessClick();
  }

  /**
   * batch process click
   */
  async batchProcessClick() {
    let deleteTitle = this.translateIt.transform('DELETE_BATCH_QUESTION');
    let dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = this.DIALOG_ID;
    dialogConfig.width = "1280px";
    dialogConfig.height = "600px";
    dialogConfig.data = {
      name: "batchProcess",
      title: this.translateIt.transform('BATCHSERVER_CONFIG'),
      description: "",
      actionButtonText: "OK",
      displayedColumns: [
        'BATCH_NAME',
        'BATCH_DESCRIPTION',
        // 'BATCH_FUNCTION',
        'BATCH_INTERVAL',
        'BATCH_ACTIVE',
        'BATCH_LAST_RUN_START',
        // 'BATCH_LAST_RUN_FINISH',
        'BATCH_LAST_RUN_RESULT',
        'action' // action buttons: edit, delete
      ],
      data: 'batches',
      refTable: 'batchProcesses',
      pk: 'BATCH_NAME',
    };
    await this.tableDataService.removeAllTableLocks(true, "", "");
    this.openMatDialog(dialogConfig, deleteTitle);
  }

  /**
   * open mat dialog - https://material.angular.io/components/dialog/overview
   *
   * @param dialogConfig
   * @param deleteTitle
   * @protected
   */
  protected openMatDialog(dialogConfig: MatDialogConfig, deleteTitle: string) {
    const modalDialog = this.matDialog.open(TableDialogComponent, dialogConfig);
    // Overwrite delete item function
    modalDialog.componentInstance.deleteItem = this.getDeleteItem(deleteTitle);
    // Overwrite create item function
    modalDialog.componentInstance.createItem = this.getItem(this);
    // Overwrite edit/update item function
    modalDialog.componentInstance.editItem = this.getEditItem(this);
  }

  /**
   * returns delete item function
   *
   * @param deleteTitle
   * @private
   */
  private getDeleteItem(deleteTitle: string) {
    return function (i, item) {
      deleteTitle = deleteTitle.replace('%s', '\"' + item.BATCH_NAME + '\"');
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: true,
        width: '350px',
        data: deleteTitle
      });
      let self = this;
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Yes clicked - Delete batch route aufrufen.
          let temp = self.batchService.deleteBatch(item);
          temp.subscribe(() => {
            // refresh table
            self.matDialog.getDialogById(self.DIALOG_ID).componentInstance.ngOnInit();
          });
        }
      });
    };
  }

  /**
   * returns edit item function
   *
   * @param self
   * @private
   */
  getEditItem(self: this) {
    return function (item) {
      item = self.setBatchItemInterval(item);
      const dialogRef = this.dialog.open(BatchDialogComponent, {
        width: '700px',
        disableClose: true,
        data: {
          description: 'EDIT_BATCH',
          BATCH_NAME: item.BATCH_NAME,
          BATCH_DESCRIPTION: item.BATCH_DESCRIPTION,
          BATCH_FUNCTION: item.BATCH_FUNCTION,
          //BATCH_INTERVAL: '',
          BATCH_INTERVAL_MINUTES: item.BATCH_INTERVAL_MINUTES,
          BATCH_INTERVAL_HOURS: item.BATCH_INTERVAL_HOURS,
          BATCH_INTERVAL_DAYS: item.BATCH_INTERVAL_DAYS,
          BATCH_INTERVAL_MONTHS: item.BATCH_INTERVAL_MONTHS,
          BATCH_INTERVAL_DAYOFMONTH: item.BATCH_INTERVAL_DAYOFMONTH,
          BATCH_ACTIVE: item.BATCH_ACTIVE,
          BATCH_LAST_RUN_START: item.BATCH_LAST_RUN_START,
          BATCH_LAST_RUN_FINISH: item.BATCH_LAST_RUN_FINISH,
          BATCH_LAST_RUN_RESULT: item.BATCH_LAST_RUN_RESULT,
          BATCH_CODE: item.BATCH_CODE,
          BATCH_CODE_REQUIRED: item.BATCH_CODE_REQUIRED,
          BATCH_PARAMS:item.BATCH_PARAMS,
          editMode: true,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // refresh table
        self.matDialog.getDialogById(self.DIALOG_ID).componentInstance.ngOnInit();
      });
    };
  }

  setBatchItemInterval(item) {
    // extract batch interval data
    if (item.BATCH_INTERVAL.length) {
      let batchValues = item.BATCH_INTERVAL.split(' ');
      for (let j = 0; j < batchValues.length; j++) {
        switch (j) {
          case(0):
            item.BATCH_INTERVAL_MINUTES = batchValues[0];
            break;
          case(1):
            item.BATCH_INTERVAL_HOURS = batchValues[1];
            break;
          case(2):
            item.BATCH_INTERVAL_DAYS = batchValues[2];
            break;
          case(3):
            item.BATCH_INTERVAL_MONTHS = batchValues[3];
            break;
          case(4):
            item.BATCH_INTERVAL_DAYOFMONTH = batchValues[4];
            break;
          default:
            break;
        }
      }
    }
    return item;
  }

  /**
   * returns get item function
   *
   * @param self
   * @private
   */
  private getItem(self: this) {
    return function () {
      const dialogRef = this.dialog.open(BatchDialogComponent, {
        width: '700px',
        disableClose: true,
        data: {
          description: 'CREATE_NEW_BATCH',
          BATCH_NAME: '',
          BATCH_DESCRIPTION: '',
          BATCH_FUNCTION: '',
          //BATCH_INTERVAL: '',
          BATCH_INTERVAL_MINUTES: '*',
          BATCH_INTERVAL_HOURS: '',
          BATCH_INTERVAL_DAYS: '*',
          BATCH_INTERVAL_MONTHS: '*',
          BATCH_INTERVAL_DAYOFMONTH: '*',
          BATCH_ACTIVE: false,
          BATCH_PARAMS:'',
          BATCH_LAST_RUN_START: '',
          BATCH_LAST_RUN_FINISH: '',
          BATCH_LAST_RUN_RESULT: '',
          BATCH_CODE: '',
          BATCH_CODE_REQUIRED: false,
          editMode: false
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // refresh table
        self.matDialog.getDialogById(self.DIALOG_ID).componentInstance.ngOnInit();
      });
    };
  }
}
