import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {NavItem} from '../../interfaces/nav-item';
import {AppComponent} from "../../app.component";
import {ActivationStart, Router, RouterOutlet} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ConstantsService} from "../../_services/constants.service";

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.css']
})

export class SiteHeaderComponent implements OnInit {

  isAdmin: boolean;
  navItems: NavItem[];

  @ViewChild(RouterOutlet, {static: true}) outlet: RouterOutlet;

  constructor(
    private auth: AuthService,
    private router: Router,
    private appComp: AppComponent,
    private CONSTANTS: ConstantsService,
    public matDialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.resetFields();
    this.router.events.subscribe(e => {
      // console.log('Site-header event... ', (e instanceof ActivationStart));
      if ((e instanceof ActivationStart && e.snapshot.outlet === "site-router-outlet-content") ||
        (e instanceof ActivationStart && e.snapshot.outlet === "notloggedin")) {
        // console.log('SiteHeaderComponent - outlet deactivate... site-header ', ((typeof this.outlet) !== "undefined"));
        if ((typeof this.outlet) !== "undefined") {
          this.outlet.deactivate();
        }
      }
    });
  }

  /**
   * reset fields
   *
   * @private
   */
  private resetFields() {
    this.isAdmin = true;
    // add navigation items
    this.navItems = this.CONSTANTS.NAV_ITEMS;
  }
}
