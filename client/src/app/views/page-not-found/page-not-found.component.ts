import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {TableDataService} from "../../_services/table-data.service";

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements AfterViewInit {

  pageLoaded: boolean;

  constructor(private tableDataService: TableDataService,
              private cd: ChangeDetectorRef) {
    this.pageLoaded = false;
  }

  ngAfterViewInit() {
    this.pageLoaded = true;
    this.cd.detectChanges();
  }

  redirectToHome() {
    this.tableDataService.redirectTo('');
  }
}
