import {Component, ViewChild} from '@angular/core';
import {CustomTableFormViewComponent} from '../custom/custom-views/custom-table-form-view/custom-table-form-view.component';
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";

/**
 * ProvidersComponent:
 *
 * table:    [PROVIDERS]
 * refTable: providers
 */

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})

export class ProvidersComponent  {

  // custom table form view component
  @ViewChild(CustomTableFormViewComponent) customComponent !: CustomTableFormViewComponent;

  constructor() {}

  title = 'PROVIDERS'
  fetchTableConfig: IFetchTableConfig = {
    refTable: 'providers',
    pk: 'PROVIDERS_NUMBER',
  }
}
