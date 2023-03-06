import { Component, OnInit } from '@angular/core';
import {ConstantsService} from "../../_services/constants.service";

@Component({
  selector: 'app-local-storage-dialog',
  templateUrl: './local-storage-dialog.component.html',
  styleUrls: ['./local-storage-dialog.component.css']
})
export class LocalStorageDialogComponent implements OnInit {

  constructor(private CONSTANTS: ConstantsService) { }

  ngOnInit(): void {
    this.emptyLocalStorage();
  }

  emptyLocalStorage() {
    let localizeItem: string = localStorage.getItem(this.CONSTANTS.LS_LOCALIZE);
    let usernameItem: string = localStorage.getItem(this.CONSTANTS.LS_USERNAME);
    let languageItem: string = localStorage.getItem(this.CONSTANTS.LS_LANGUAGE);
    let roleItem: string = localStorage.getItem(this.CONSTANTS.LS_ROLE);
    let accessTokenItem: string = localStorage.getItem(this.CONSTANTS.LS_ACCESS_TOKEN);
    localStorage.clear();
    localStorage.setItem(this.CONSTANTS.LS_LOCALIZE, localizeItem);
    localStorage.setItem(this.CONSTANTS.LS_USERNAME, usernameItem);
    localStorage.setItem(this.CONSTANTS.LS_LANGUAGE, languageItem);
    localStorage.setItem(this.CONSTANTS.LS_ROLE, roleItem);
    localStorage.setItem(this.CONSTANTS.LS_ACCESS_TOKEN, accessTokenItem);
  }
}
