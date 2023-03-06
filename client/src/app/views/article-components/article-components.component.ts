import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ConstantsService} from '../../_services/constants.service';
import {CustomTableTableFormViewComponent} from '../custom/custom-views/custom-table-table-form-view/custom-table-table-form-view.component';
import {DistComponent} from "../../models/dist-component";

@Component({
  selector: 'app-article-components',
  templateUrl: './article-components.component.html',
  styleUrls: ['./article-components.component.css']
})

/**
 * ArticleComponentsComponent - article components component with a CustomTableTableFormViewComponent:
 * table (on left) and table + form (on right)
 *
 * table: [DIST_COMPONENTS]
 * refTable: components
 */
export class ArticleComponentsComponent implements AfterViewInit {

  // custom table form view component
  @ViewChild(CustomTableTableFormViewComponent) customComponent !: CustomTableTableFormViewComponent;

  constructor(private CONSTANTS: ConstantsService) {
  }

  /**
   * after view is initialized, setup table and then form by loading data from database
   */
  public ngAfterViewInit(): void {
    this.initCustomTableFormView();
  }

  /**
   * initialize custom table form view with specific data of countries component
   *
   * @private
   */
  private initCustomTableFormView() {

    // referral table names of the db table
    this.customComponent.setReferralTable(this.CONSTANTS.REFTABLE_COMPONENTS);
    this.customComponent.setPrimaryRefTableColumnName(this.CONSTANTS.REFTABLE_COMPONENTS_PRIMARY_COLUMN);
    this.customComponent.setSecondaryRefTableColumnName(this.CONSTANTS.REFTABLE_COMPONENTS_SECONDARY_COLUMN);

    // local storage keys
    // keys by name (ITMNUM and COMPNUM)
    this.customComponent.setSelItemPrimaryLocalStorageKey(this.CONSTANTS.LS_SEL_COMPONENTS_ITEM_NUMBER);
    this.customComponent.setSelItemSecondaryLocalStorageKey(this.CONSTANTS.LS_SEL_COMPONENTS_COMPNUM);
    // keys by id
    this.customComponent.setSelItemPrimaryIdLocalStorageKey(this.CONSTANTS.LS_SEL_COMPONENTS_ID);
    this.customComponent.setSelItemSecondaryIdLocalStorageKey(this.CONSTANTS.LS_SEL_COMPONENTS_DETAILS_ID);

    this.customComponent.setPageParamsPrimaryColumnName(this.CONSTANTS.REFTABLE_COMPONENTS_PRIMARY_COLUMN);
    // add local storage key as value
    this.customComponent.setPageParamsPrimaryColumnValue(this.CONSTANTS.LS_SEL_COMPONENTS_ITEM_NUMBER);

    this.customComponent.setDetailViewRefTable(this.CONSTANTS.REFTABLE_COMPONENTS_DETAILS);
    this.customComponent.setDetailViewPrimaryRefTableColumnName(this.CONSTANTS.REFTABLE_COMPONENTS_PRIMARY_COLUMN);

    // set selected item referral table ( used for detail-view-list > getTableAndDataset() )
    this.customComponent.setSeItemRefTableTitle(this.CONSTANTS.REFTABLE_COMPONENTS_TITLE);

    // form settings to load data by ID
    this.customComponent.setDetailViewFormKey(this.CONSTANTS.REFTABLE_COMPONENTS_ID_COLUMN);
    // add local storage key as value
    this.customComponent.setDetailViewFormValue(this.CONSTANTS.LS_SEL_COMPONENTS_DETAILS_ID);

    // set a flag, that in details view the data should be shown based on second table referral name (not primary)
    this.customComponent.setShowSecondTableDataInDetailsView(false);

    // this.customTableTableFormComponent.setReferralModel(DistComponent);

    // load only needed form options: countries
    // this.customTableTableFormComponent.setFormOptionsToLoad([OptionsTypes.countries]);

    // set titles
    this.customComponent.setTableTitle('ARTICLE_COMPONENTS');
    this.customComponent.setDetailTableTitle('ARTICLE_COMPONENTS');
    this.customComponent.setDetailFormTitle('ARTICLE_COMPONENT');
    this.customComponent.setCreateTitle('CREATE_NEW_COMPONENT');
    this.customComponent.setCreateTooltip('CREATE_NEW_COMPONENT');

    // set main table...
    // set displayed table column names
    this.customComponent.setTableViewDisplayedColumns(['ITMNUM', 'DIST_QTY']);
    this.customComponent.setTableViewSearchColumn('ITMNUM');
    this.customComponent.setTableViewAdditionalSearchColumns('COMPNUM,DIST_QTY');
    this.customComponent.setTableViewInitialSort({property: 'ITMNUM', order: 'asc'});
    this.customComponent.setTableViewColumnsToHide(['COMPNUM','PROD_QTY','PROD_UNIT']);

    // set detail view...
    this.customComponent.setDetailViewTableDisplayedColumns(['ITMNUM', 'COMPNUM', 'DIST_QTY']);

    // set empty item id
    // this.customTableTableFormComponent.setEmptyItemId(this.CONSTANTS.UNIVERSAL_ID_PLACEHOLDER);

    this.customComponent.setPaginatorElementsPerSideDetailTable(this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE_THREE);
    // @ToDo Set proper value for detail view table page size
    this.customComponent.setCurrPageSizeDetailTable(12);

    this.customComponent.setDetailTableViewSearchColumn(this.CONSTANTS.REFTABLE_COMPONENTS_SECONDARY_COLUMN);

    // set empty table model for the new item mode
    this.customComponent.setEmptyModel(new DistComponent(0, '', '',0));

    // allow to load view after all parameters are set
    this.customComponent.startLoading = true;
    this.customComponent.ngAfterViewInit();
  }
}
