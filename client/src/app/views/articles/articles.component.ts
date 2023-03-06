import {Component, ViewChild} from '@angular/core';

import {
  CustomTableFormViewComponent
} from "../custom/custom-views/custom-table-form-view/custom-table-form-view.component";
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";


@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})

/**
 * ArticlesComponent - articles view component with
 * CustomTableComponent for table (on left) and a TabGroup with 2 CustomFormComponent components
 * for a tab group with forms (on right): article details (form 1) and attributes (form 2).
 *
 * table:    [ITEM_BASIS]
 * refTable: articles
 */
export class ArticlesComponent {

  // custom table form view component
  @ViewChild(CustomTableFormViewComponent) customComponent !: CustomTableFormViewComponent;

  constructor() {
  }

  title = "ARTICLE"
  fetchTableConfig: IFetchTableConfig = {
    subtitle: 'Details',
    refTable: 'articles',
    pk: "ID",
    relatedList: {
      refTable: 'articlesAttributes',
      subtitle: 'ATTRIBUTES',
      referenceColumn: 'ITEM_BASIS_ID',
      pk: 'ID'
    }
  }
}
