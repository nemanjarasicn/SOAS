import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import {ActivationStart, Router, RouterOutlet} from '@angular/router';
import {LoginModel} from "../../models/login.model";
import {first} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {TableDataService} from "../../_services/table-data.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: LoginModel = new LoginModel();
  loginForm: FormGroup;
  error: string;
  hide = true;
  version: string;

  @ViewChild(RouterOutlet, {static: true}) outlet: RouterOutlet;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private tableDataService: TableDataService) { }

  ngOnInit() {
    this.version = 'SOAS Version ' + environment.version;
    // this.router.events.subscribe(e => {
    //   if (e instanceof ActivationStart && e.snapshot.outlet === "notloggedin")
    //     this.outlet.deactivate();
    // });

    this.router.events.subscribe(e => {
      if (e instanceof ActivationStart &&
        (e.snapshot.outlet === "site-router-outlet-content" || e.snapshot.outlet === "notloggedin") &&
        ((typeof this.outlet) !== "undefined")) {
        console.log('outlet deactivate...');
        this.outlet.deactivate();
      }
    });

    this.loginForm = this.formBuilder.group({
      'username': [this.user.username, [
        //Validators.required,
        //Validators.email
      ]],
      'password': [this.user.password, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]]
    });

  }

  onLoginSubmit() {
    this.authService.login(this.loginForm.get('username').value, this.loginForm.get('password').value)
      .pipe(first())
      .subscribe(
        async result => {
          let self = this;
          let allFlag: boolean = true;
          await this.tableDataService.removeAllTableLocks(allFlag, "", "");
          self.router.navigate(['/']); // ['home'] '/'
        },
        err => {
          console.log('Login error', err);
          this.error = 'Could not authenticate';
        }
      );
  }

}
