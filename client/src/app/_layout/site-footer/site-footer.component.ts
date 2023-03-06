import {AfterViewChecked, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ConstantsService} from "../../_services/constants.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.css']
})
export class SiteFooterComponent implements AfterViewChecked, OnInit {

  user: string;
  role: string;
  language: string;
  dbName: string;

  env = environment;
  sidenavOpened: boolean;
  @Output() sidenavOpenedClicked = new EventEmitter();
  tableVisible: boolean;
  @Output() tableVisibleClicked = new EventEmitter();
  isLoadingResults = false
  isRateLimitReached = false

  constructor(private CONSTANTS: ConstantsService) {
  }

  ngOnInit() {
    this.user = localStorage.getItem(this.CONSTANTS.LS_USERNAME);
    this.role = localStorage.getItem(this.CONSTANTS.LS_ROLE);
    this.language = localStorage.getItem(this.CONSTANTS.LS_LANGUAGE);
    this.sidenavOpened = this.env.sidenavopened;
    this.tableVisible = this.env.tablevisible;
    this.dbName = this.CONSTANTS.DB_TABLE_PREFIX.split('.')[0];
  }

  ngAfterViewChecked() {
    this.setIsLoading()
  }

  setIsLoading() {
    this.isLoadingResults = this.env.isloadingdata
  }

  getIsLoading() {
    return this.isLoadingResults
  }

  getIsRateLimitReached() {
    return this.isRateLimitReached
  }
}
