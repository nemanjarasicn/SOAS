import {
  Component,
  ViewChild,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  AfterViewChecked, ChangeDetectorRef, OnDestroy
} from '@angular/core';
import {ActivationStart, Router, RouterOutlet} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from "./_services/auth.service";
import {HttpClient} from "@angular/common/http";
import {ConstantsService} from "./_services/constants.service";
import {TableDataService} from "./_services/table-data.service";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewChecked, OnDestroy {
  options: FormGroup;
  siteNavFixed;
  parentMenuItems: any[];
  parentSubMenuItems: any[];
  childSubMenuItems: any[];
  isShowTableClicked: boolean;
  selectedMenuItem: string;
  private externalWindow = null;

  @ViewChild(RouterOutlet, {static: true}) outlet: RouterOutlet;

  url = this.CONSTANTS.SERVER_URL + '/table';

  env = environment;
  sidenavOpened: boolean;
  tableVisible: boolean;

  constructor(private auth: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private http: HttpClient,
              private componentFactoryResolver: ComponentFactoryResolver,
              private applicationRef: ApplicationRef,
              private injector: Injector,
              private CONSTANTS: ConstantsService,
              private cdRef: ChangeDetectorRef,
              private tableDataService: TableDataService) {
    this.isShowTableClicked = false;
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0
    });
    this.sidenavOpened = this.env.sidenavopened;
    this.tableVisible = this.env.tablevisible;
  }

  ngOnInit() {
    this.parentMenuItems = this.CONSTANTS.MENU_ITEMS;
    this.parentSubMenuItems = this.CONSTANTS.MENU_SUBITEMS;
    this.childSubMenuItems = this.CONSTANTS.MENU_CHILDSUBITEMS;
    this.selectedMenuItem = "";
    this.siteNavFixed = false;
    // remove table locks on every page reload
    // this.appService.removeAllTableLocks(true, "", "", function (remResult) {});
    this.router.events.subscribe(e => {
      if ((e instanceof ActivationStart && e.snapshot.outlet === "site-router-outlet-content") ||
        (e instanceof ActivationStart && e.snapshot.outlet === "notloggedin")) {
        if ((typeof this.outlet) !== "undefined") {
          // console.log('outlet deactivate... app.component');
          this.outlet.deactivate();
        }
      }
    });
  }

  /**
   * show table by given selected menu item
   *
   * @param selectedMenuItem
   */
  async showTable(selectedMenuItem: string) {
    // if(!this.isShowTableClicked) {
    //   this.isShowTableClicked = true;
    this.selectedMenuItem = selectedMenuItem;
    await this.tableDataService.removeAllTableLocks(true, "", "");
    this.url = this.CONSTANTS.SERVER_URL + '/' + selectedMenuItem;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    if (selectedMenuItem) {
      this.router.navigate([selectedMenuItem]); // {skipLocationChange: true}
    }
    //   // Workaround to prevent user click many times on same menu item: Wait 3 seconds and then allow click again.
    //   setTimeout(() => {
    //     this.isShowTableClicked = false;
    //   }, 3000);
    // }
  }

  logout() {
    this.auth.logout();
    // this.router.navigate(['logout']);
  }

  /**
   * create and show an external window (second instance of SOAS)
   */
  showNewWindow() {
    this.externalWindow = window.open(
      this.CONSTANTS.SERVER_URL + '/',
      '',
      'location=yes,' +
      'width=800,' +
      'height=600,' +
      'left=200,' +
      'top=200,' +
      'scrollbars=yes,' +
      'status=no,' +
      'menubar=no,' +
      'toolbar=no,' +
      'titlebar=no'
    );
  }

  ngOnDestroy() {
    this.outlet?.deactivate();
    // close the window when this component destroyed
    this.externalWindow?.close()
  }

  ngAfterViewChecked(): void {
    // Workaround for "ngIf - Expression has changed after it was checked" error
    // https://stackoverflow.com/a/43513959
    this.cdRef.detectChanges();
  }

  isLoggedIn(): boolean {
    return this.auth.loggedIn;
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  toggleCustomTable() {
    this.tableVisible = !this.tableVisible;
  }

  // getRole() {
  //   this.http.get<{ table: object }>(this.CONSTANTS.SERVER_URL + '/getRole')
  //     .pipe(
  //       map(result => {
  //         return result.table;
  //       })
  //     );
  // }

  // /**
  //  * called in view
  //  * @param $event
  //  */
  // onActivate($event: any) {
  //   if ((typeof this.outlet) !== "undefined") {
  //     console.log("app component is activated: ", this.outlet.isActivated);
  //   }
  // }

  // /**
  //  * called in view
  //  * @param $event
  //  */
  // onDeactivate($event: any) {
  // }

  // ngAfterViewInit(): void {
  //   // setTimeout(() => {
  //   //   //create the component dynamically
  //   //   const factory = this.r.resolveComponentFactory(AppComponent);
  //   //   const comp: ComponentRef<AppComponent> =
  //   //     this.viewContainerRef.createComponent(factory);
  //   //   //in case you also need to inject an input to the child,
  //   //   //like the windows reference
  //   //   //comp.instance.someInputField = this.externalWindow.document.body;
  //   //   //add you freshly baked component on the windows
  //   //   this.externalWindow.document.body.appendChild(comp.location.nativeElement);
  //   // });
  // }
}
