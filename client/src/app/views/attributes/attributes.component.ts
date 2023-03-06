import { Component} from '@angular/core';
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.css']
})

/**
 * AttributesComponent - attributes component with a CustomTableTableFormViewComponent:
 * table (on left) and table + form (on right)
 *
 * 2 tables:    [ATTRIBUTE_NAMES] + [ATTRIBUTES]
 * 2 refTables: attributeNames    +  attributes
 */
export class AttributesComponent {
  title = 'ATTRIBUTE_NAMES'
  fetchTableConfig: IFetchTableConfig = {
    subtitle: 'Details',
    refTable: 'attributeNames',
    pk: "ID",
  }
}
