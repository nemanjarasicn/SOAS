import {Component, ViewChild} from "@angular/core";
import {
  CustomTableFormViewComponent
} from "../custom/custom-views/custom-table-form-view/custom-table-form-view.component";

@Component({
  selector: "app-storage-places",
  templateUrl: "./storage-places.component.html",
  styleUrls: ["./storage-places.component.css"],
})

/**
 * CountriesComponent: countries view component with a CustomTableFormViewComponent: table (on left) and form (on right)
 *
 * table:    [WAREHOUSING_LOC]
 * refTable: warehousingLoc
 */
export class StoragePlacesComponent {

  // custom table form view component
  @ViewChild(CustomTableFormViewComponent) customComponent !: CustomTableFormViewComponent;

  constructor() {}

  title = "WAREHOUSE_LOK"
  fetchTableConfig = {
    tableName: 'WAREHOUSE_LOC',
    refTable: 'warehousingLoc',
    column: "ID",
    id: "warehousingLoc"
  }
}
