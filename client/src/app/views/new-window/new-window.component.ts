import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ConstantsService} from "../../_services/constants.service";

@Component({
  selector: 'app-new-window',
  templateUrl: './new-window.component.html',
  styleUrls: ['./new-window.component.css']
})
export class NewWindowComponent implements OnInit {

  private externalWindow = null;

  constructor(
    private router: Router,
    private CONSTANTS: ConstantsService
  ) { }

  ngOnInit() {
    this.showNewWindow();
  }

  showNewWindow() {

    // create an external window
    this.externalWindow = window.open(this.CONSTANTS.SERVER_URL + '/', '', 'location=yes,width=800,height=600,left=200,top=200,scrollbars=yes,status=no,menubar=no,toolbar=no,titlebar=no');

    this.router.navigate(['/']);
  }

}
