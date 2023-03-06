import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TableDialogComponent} from "../table-dialog/table-dialog.component";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {UserDialogComponent} from "../user-dialog/user-dialog.component";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {TableDataService} from "../../_services/table-data.service";
import {User} from "../../models/user";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  providers: [ TranslateItPipe ]
})

export class UserManagementComponent implements OnInit {

  DIALOG_ID: string = "table-dialog";
  userManagementTitle: string;
  dialogConfig: MatDialogConfig;
  deleteTitle: string;


  constructor(
    public matDialog: MatDialog,
    public translatePipe: TranslateItPipe,
    private tableDataService: TableDataService
  ) {
    this.deleteTitle = this.translatePipe.transform('DELETE_USER_QUESTION');
    this.userManagementTitle = this.translatePipe.transform("USER_MANAGEMENT");
  }

  ngOnInit() {
    this.setupClick();
  }

  public async setupClick() {
    this.dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    this.dialogConfig.disableClose = true;
    this.dialogConfig.id = this.DIALOG_ID;
    this.dialogConfig.width = "900px";
    this.dialogConfig.height = "620px";
    this.dialogConfig.data = {
      name: "userManagement",
      title: this.userManagementTitle,
      description: "",
      actionButtonText: "OK",
      displayedColumns: [
        'USER_SOAS_NAME',
        'USER_SOAS_LOGIN',
        'USER_ROLE',
        'USER_LANGUAGE',
        'action' // action buttons: edit, delete
      ],
      data: 'users',
      refTable: 'users',
      pk: 'USER_SOAS_ID',
    };
    await this.userManagementClick(this.deleteTitle);
  }

  resetDialog() {
    this.dialogConfig = undefined;
  }

  /**
   * user management click
   *
   * @param deleteTitle
   */
  async userManagementClick(deleteTitle: string) {
    await this.tableDataService.removeAllTableLocks(true, "", "");
    this.openMatDialog(this.dialogConfig, deleteTitle);
  }

  /**
   * open mat dialog
   *
   * @param dialogConfig
   * @param deleteTitle
   * @private
   */
  private openMatDialog(dialogConfig: MatDialogConfig<any>, deleteTitle: string) {
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(TableDialogComponent, dialogConfig);
    // Overwrite delete item function
    modalDialog.componentInstance.deleteItem = this.getDeleteItem(deleteTitle, this);
    modalDialog.componentInstance.createItem = this.getCreateItem(this);
    modalDialog.componentInstance.editItem = this.getEditItem(this);

  }

  /**
   * get edit item
   *
   * @param self
   * @private
   */
  private getEditItem(self: this) {
    return function (item: User) {
      const dialogRef = this.dialog.open(UserDialogComponent, {
        width: '700px',
        data: {
          description: 'EDIT_USER',
          USER_SOAS_ID: item.USER_SOAS_ID,
          USER_SOAS_NAME: item.USER_SOAS_NAME,
          USER_SOAS_LOGIN: item.USER_SOAS_LOGIN,
          // USER_SOAS_PASSWD: item.USER_SOAS_PASSWD,
          USER_ROLE: item.USER_ROLE,
          USER_LANGUAGE: item.USER_LANGUAGE,
          editMode: true
        }
      });
      dialogRef.afterClosed().subscribe( () => {
        // refresh dialog table
        self.matDialog.getDialogById(self.DIALOG_ID).componentInstance.ngOnInit();
      });
    };
  }

  /**
   * get create item
   *
   * @param self
   * @private
   */
  private getCreateItem(self: this) {
    return function () {
      const dialogRef = this.dialog.open(UserDialogComponent, {
        width: '700px',
        disableClose: true,
        data: {
          description: 'CREATE_NEW_USER',
          USER_SOAS_ID: '',
          USER_SOAS_NAME: '',
          USER_SOAS_LOGIN: '',
          USER_SOAS_PASSWD: '',
          USER_ROLE: '',
          USER_LANGUAGE: '',
          editMode: false
        }
      });
      dialogRef.afterClosed().subscribe(() => {
        // refresh dialog table
        self.matDialog.getDialogById(self.DIALOG_ID).componentInstance.ngOnInit();
      });
    };
  }

  /**
   * get delete item
   *
   * @param deleteTitle
   * @param self
   * @private
   */
  private getDeleteItem(deleteTitle, self: this) {
    return function (i: number, item: User) {
      deleteTitle = deleteTitle.replace('%s', '\"' + item.USER_SOAS_NAME + '\"');
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: true,
        width: '350px',
        data: deleteTitle
        /*data: {
          title: 'DELETE_USER_TITLE',
          message: 'DELETE_USER_QUESTION'
        }*/
      });
      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          // Delete user route aufrufen.
          await this.userService.deleteUser(item);
          // refresh dialog table
          self.matDialog.getDialogById(self.DIALOG_ID).componentInstance.ngOnInit();
        }
      });
    };
  }
}
