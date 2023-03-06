import {Component, ViewChild} from '@angular/core';
import {CustomTableFormViewComponent} from '../custom/custom-views/custom-table-form-view/custom-table-form-view.component';
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})

/**
 * CurrenciesComponent - currencies view component with a CustomTableFormViewComponent: table (on left) and form (on right)
 *
 * table:    [CURRENCIES]
 * refTable: currencies
 */
export class CurrenciesComponent{

  // custom table form view component
  @ViewChild(CustomTableFormViewComponent) customComponent !: CustomTableFormViewComponent;

  constructor() {}

  title = "CURRENCIES"
  fetchTableConfig: IFetchTableConfig = {
    refTable: 'currencies',
    pk: "CURRENCY_ID",
  }
}
