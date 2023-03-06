import {Component, ViewChild} from '@angular/core';
import {
  CustomTableFormViewComponent
} from "../custom/custom-views/custom-table-form-view/custom-table-form-view.component";

@Component({
  selector: 'app-product-units',
  templateUrl: './product-units.component.html',
  styleUrls: ['./product-units.component.css']
})

/**
 * ProductUnitsComponent - product units view component with a CustomTableFormViewComponent: table (on left) and form (on right)
 *
 * table:    [PROD_UNITS]
 * refTable: prodUnits
 */
export class ProductUnitsComponent {

  // custom table form view component
  @ViewChild(CustomTableFormViewComponent) customComponent !: CustomTableFormViewComponent;

  constructor() {}

  title = "PROD_UNITS"
  fetchTableConfig = {
    tableName: 'PROD_UNITS',
    refTable: 'prodUnits',
    column: "PROD_UNIT_NAME",
    id: "prodUnits"
  }
}
