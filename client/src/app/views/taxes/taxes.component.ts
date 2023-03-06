import {Component} from '@angular/core';
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";

/**
 * TaxesComponent:
 *
 * 2 tables:    [TAXCODES] + [TAXRATES]
 * 2 refTables: taxes      + taxesRate
 */

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.css']
})
export class TaxesComponent {
  title = 'TAXCODES'
  fetchTableConfig: IFetchTableConfig = {
    subtitle: 'Details',
    refTable: 'taxes',
    pk: "TAXCODE",
    relatedList: {
        refTable: 'taxesRate',
        subtitle: 'History',
        referenceColumn: 'TAXCODE',
        pk: 'TAXCODE'
    }
  }
}
