import {Component, ViewChild} from '@angular/core';
import {CustomTableFormViewComponent} from '../custom/custom-views/custom-table-form-view/custom-table-form-view.component';
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";

@Component({
  selector: 'app-import-types',
  templateUrl: './import-types.component.html',
  styleUrls: ['./import-types.component.css']
})

/**
 * ImportTypesComponent - import types view component with a CustomTableFormViewComponent: table (on left) and form (on right)
 *
 * table: [IMPORT_TYPE]
 * refTable: importTypes
 */
export class ImportTypesComponent   {

  // custom table form view component
  @ViewChild(CustomTableFormViewComponent) customComponent !: CustomTableFormViewComponent;

  constructor() {}

  title = 'IMPORT_TYPE'
  fetchTableConfig: IFetchTableConfig = {
    refTable: 'importTypes',
    pk: 'ID',
  }
}
