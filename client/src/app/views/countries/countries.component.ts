import {Component, ViewChild} from '@angular/core';
import {CustomTableFormViewComponent} from '../custom/custom-views/custom-table-form-view/custom-table-form-view.component';
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})

/**
 * CountriesComponent: countries view component with a CustomTableFormViewComponent: table (on left) and form (on right)
 *
 * table:    [COUNTRIES]
 * refTable: countries
 */
export class CountriesComponent  {

  // custom table form view component
  @ViewChild(CustomTableFormViewComponent) customComponent !: CustomTableFormViewComponent;

  constructor() {}

  title = 'COUNTRIES'
  fetchTableConfig: IFetchTableConfig = {
    refTable: 'countries',
    pk: 'COUNTRY_ID',
  }
}
