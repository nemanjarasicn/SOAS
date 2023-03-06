import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../_services/auth.service';
import {ActivationStart, Router, RouterOutlet} from '@angular/router';
import {AppComponent} from '../../app.component';
import {TableDataService} from '../../_services/table-data.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  @ViewChild(RouterOutlet, {static: true}) outlet: RouterOutlet;

  constructor(private auth: AuthService,
              private router: Router,
              private appComponent: AppComponent,
              private tableDataService: TableDataService) {
  }

  ngOnInit() {

    this.router.events.subscribe(e => {
      if ((e instanceof ActivationStart && e.snapshot.outlet === 'site-router-outlet-content') ||
        (e instanceof ActivationStart && e.snapshot.outlet === 'notloggedin'))
        console.log('outlet deactivate... ', ((typeof this.outlet) !== 'undefined'));
      if ((typeof this.outlet) !== 'undefined') {
        this.outlet.deactivate();
        // this.outlet = null;
      }
    });

    this.logout().then(r => {
    });
  }

  async logout() {
    const allFlag = true;
    try {
      await this.tableDataService.removeAllTableLocks(allFlag, '', '');
    } catch (err) {
      console.log(err);
    }
    localStorage.clear();
    this.appComponent.logout();
    await this.router.navigate(['login']);
    this.windowReload();
  }

  windowReload() {
    // ToDo: This is workaround to prevent outlet error. Need to be removed, if outlet error is fixed.
    location.reload();
  }

}
