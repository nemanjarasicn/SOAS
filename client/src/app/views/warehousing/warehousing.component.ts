import {Component} from '@angular/core';
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";


@Component({
  selector: 'app-warehousing',
  templateUrl: './warehousing.component.html',
  styleUrls: ['./warehousing.component.css']
})

/**
 * WarehousingComponent - warehousing view component with a CustomTableTableFormViewComponent:
 * table (on left) and table + form (on right)
 *
 * table:    [WAREHOUSING]
 * refTable: warehousing
 */
export class WarehousingComponent   {

  title = 'WAREHOUSING'
  fetchTableConfig: IFetchTableConfig = {
    subtitle: 'Details',
    refTable: 'warehousing',
    pk: "ID",
    relatedList: {
        refTable: 'warehousing',
        subtitle: 'History',
        referenceColumn: 'ID',
        pk: 'ID'
    }
  }
}
