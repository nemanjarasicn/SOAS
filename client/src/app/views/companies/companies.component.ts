import {Component} from '@angular/core';
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";



@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})

/**
 * CompaniesComponent - companies view component with a CustomTableFormViewComponent: table (on left) and form (on right)
 *
 * table:    [COMPANIES] [COMPANIES_LOCATIONS]
 * refTable: companies companies_locations
 */
export class CompaniesComponent   {

  title = 'COMPANIES'
  fetchTableConfig: IFetchTableConfig = {
    subtitle: 'Details',
    refTable: 'companies',
    pk: "COMPANY",
    relatedList: {
        refTable: 'companiesLocations',
        subtitle: 'History',
        referenceColumn: 'COMPANY',
        pk: 'COMPANY'
    }
  }
}

