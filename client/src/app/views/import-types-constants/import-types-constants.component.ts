import {Component, ViewChild} from '@angular/core';
import {CustomTableFormViewComponent} from '../custom/custom-views/custom-table-form-view/custom-table-form-view.component';
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";

@Component({
  selector: 'app-import-types-constants',
  templateUrl: './import-types-constants.component.html',
  styleUrls: ['./import-types-constants.component.css']
})

/**
 * ImportTypesConstantsComponent - import types constants view component with a
 * CustomTableFormViewComponent: table (on left) and form (on right)
 *
 * table: [IMPORT_TYPE_CONSTANTS]
 * refTable: importTypeConstants
 */
export class ImportTypesConstantsComponent   {

  // custom table form view component
  @ViewChild(CustomTableFormViewComponent) customComponent !: CustomTableFormViewComponent;

  constructor() {}

  title = 'IMPORT_TYPE_CONSTANTS'
  fetchTableConfig: IFetchTableConfig = {
    refTable: 'importTypeConstants',
    pk: 'ID',
  }
}