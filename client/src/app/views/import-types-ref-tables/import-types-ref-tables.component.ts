import {Component, ViewChild} from '@angular/core';
import {CustomTableFormViewComponent} from '../custom/custom-views/custom-table-form-view/custom-table-form-view.component';
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";

@Component({
  selector: 'app-import-types-ref-tables',
  templateUrl: './import-types-ref-tables.component.html',
  styleUrls: ['./import-types-ref-tables.component.css']
})

/**
 * ImportTypesRefTablesComponent - import types ref tables view component with a
 * CustomTableFormViewComponent: table (on left) and form (on right)
 *
 * table: [IMPORT_TYPE_REFERENCED_TABLES]
 * refTable: importTypesRefTables
 */
export class ImportTypesRefTablesComponent   {

  // custom table form view component
  @ViewChild(CustomTableFormViewComponent) customComponent !: CustomTableFormViewComponent;

  constructor() {}

  title = 'IMPORT_TYPE_REFERENCED_TABLES'
  fetchTableConfig: IFetchTableConfig = {
    refTable: 'importTypesRefTables',
    pk: 'ID',
  }
}