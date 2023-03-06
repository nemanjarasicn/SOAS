import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../models/user";
import {UserService} from "../../_services/user.service";
import * as forge from "node-forge";
import {UserTestConstants} from "../../../assets/test-constants/users";
import {TableDataService} from "../../_services/table-data.service";


@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {

  description: string; // form title
  roles: string[];
  languages: string[];
  model: User;
  submitted: boolean;
  editMode: boolean;

  constructor(
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private userService: UserService,
    private tableDataService: TableDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    this.resetFields();
    this.description = data.description;
    this.model = new User(data.USER_SOAS_ID, data.USER_SOAS_NAME, data.USER_SOAS_LOGIN, data.USER_SOAS_PASSWD,
      data.USER_ROLE, data.USER_LANGUAGE);
    this.editMode = data.editMode;
  }

  ngOnInit(): void {
  }

  /**
   * reset fields
   *
   * @private
   */
  private resetFields() {
    this.description = ''; // form title
    // ToDo: Add roles from DB.
    this.roles = ['admin', 'user', 'guest'];
    this.languages = ['DE_DE', 'EN_US'];
    this.model = UserTestConstants.USER_WITH_ID;
    this.submitted = false;
    this.editMode = false; // if true => edit user dialog; false => create user dialog
  }

  /**
   * get hashed pass
   *
   * @param pass
   */
  private static getHashedPass(pass: string) {
    let md = forge.md.sha256.create();
    md.start();
    md.update(pass, "utf8");
    return md.digest().toHex();
  }

  /**
   * on submit - create or update user
   */
  async onSubmit() {
    this.submitted = true;
    if (!this.editMode) {
      await this.getCreateUserPromise();
    } else {
      await this.getUpdateUserPromise();
    }
    this.close();
  }

  /**
   * update user at Edit user mode
   *
   * @private
   */
  private async getUpdateUserPromise(): Promise<void> {
    // Edit/Update user route aufrufen.
     /*this.userService.updateUser({
      USER_SOAS_ID: this.model.USER_SOAS_ID,
      USER_SOAS_NAME: this.model.USER_SOAS_NAME,
      USER_ROLE: this.model.USER_ROLE,
      USER_LANGUAGE: this.model.USER_LANGUAGE
    });*/

    await this.tableDataService.putModelEndpoint({
      primaryKey: `${this.model.USER_SOAS_ID}`,
      modelName: 'user',
      data: JSON.stringify(this.model),
    })
  }

  /**
   * create user at Create user mode
   *
   * @private
   */
  private async getCreateUserPromise() {
    // Create user route aufrufen.
    return await this.userService.insertUser({
      USER_SOAS_NAME: this.model.USER_SOAS_NAME,
      USER_SOAS_LOGIN: this.model.USER_SOAS_LOGIN,
      USER_SOAS_PASSWD: UserDialogComponent.getHashedPass(this.model.USER_SOAS_PASSWD),
      USER_ROLE: this.model.USER_ROLE,
      USER_LANGUAGE: this.model.USER_LANGUAGE
    });
  }

  /**
   * add new user to model
   */
  newUser() {
    if (this.roles && this.languages) {
      this.model = new User(0, '', '', '', this.roles[0],
        this.languages[0]);
    }
  }

  /**
   * close dialog - If the user clicks the cancel button a.k.a. the go back button, then just close the modal
   */
  close() {
    this.dialogRef.close();
  }
}
