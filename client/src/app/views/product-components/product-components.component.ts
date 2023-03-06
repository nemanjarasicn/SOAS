import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ConstantsService} from '../../_services/constants.service';
import {ProductComponents} from '../../models/product-components';
import {CustomTableTableFormViewComponent} from '../custom/custom-views/custom-table-table-form-view/custom-table-table-form-view.component';

@Component({
  selector: 'app-product-components',
  templateUrl: './product-components.component.html',
  styleUrls: ['./product-components.component.css']
})

/**
 * ProductComponentsComponent - product components component with a CustomTableTableFormViewComponent:
 * table (on left) and table + form (on right)
 *
 * table: [PROD_COMPONENTS]
 * refTable: prodComponents
 */
export class ProductComponentsComponent implements AfterViewInit {

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

    // referral table name of the db table
    this.customComponent.setReferralTable(this.CONSTANTS.REFTABLE_PRODUCT_COMPONENTS);
    this.customComponent.setPrimaryRefTableColumnName(this.CONSTANTS.REFTABLE_PRODUCT_COMPONENTS_COLUMN);
    this.customComponent.setSecondaryRefTableColumnName(this.CONSTANTS.REFTABLE_PRODUCT_COMPONENTS_COMPNUM);
    this.customComponent.setSelItemPrimaryLocalStorageKey(this.CONSTANTS.LS_SEL_PRODUCT_COMPONENTS_ITEM_NUMBER);
    this.customComponent.setSelItemSecondaryLocalStorageKey(this.CONSTANTS.LS_SEL_PRODUCT_COMPONENTS_COMPNUM);
    // local storage key to manage selection of detail view form item...
    this.customComponent.setSelItemSecondaryIdLocalStorageKey(this.CONSTANTS.LS_SEL_PRODUCT_COMPONENTS_COMPNUM);
    this.customComponent.setPageParamsPrimaryColumnName('');

    // set selected item referral table
    this.customComponent.setSeItemRefTableTitle(this.CONSTANTS.REFTABLE_PRODUCT_COMPONENTS_TITLE);

    this.customComponent.setDetailViewRefTable(this.CONSTANTS.REFTABLE_PRODUCT_COMPONENTS_DETAILS);
    this.customComponent.setDetailViewPrimaryRefTableColumnName(this.CONSTANTS.REFTABLE_COMPONENTS_PRIMARY_COLUMN);
    // this.customTableTableFormComponent.setReferralModel(ProductComponents);

    // form settings to load data by COMPNUM
    this.customComponent.setDetailViewFormKey(this.CONSTANTS.REFTABLE_PRODUCT_COMPONENTS_COMPNUM);
    this.customComponent.setDetailViewFormValue(this.CONSTANTS.LS_SEL_PRODUCT_COMPONENTS_COMPNUM);

    // set a flag, that in details view the data should be shown based on second table referral name (not primary)
    this.customComponent.setShowSecondTableDataInDetailsView(false);

    // load only needed form options: countries
    // this.customTableTableFormComponent.setFormOptionsToLoad([OptionsTypes.countries]);

    // set titles
    this.customComponent.setTableTitle('PRODUCTION_PARTS_LIST');
    this.customComponent.setDetailTableTitle('PRODUCTION_PARTS_LISTS');
    this.customComponent.setDetailFormTitle('PRODUCTION_PARTS_LIST');
    this.customComponent.setCreateTitle('CREATE_NEW_PROD_COMPONENT');
    this.customComponent.setCreateTooltip('CREATE_NEW_PROD_COMPONENT');

    // set main table...
    // set displayed table column names
    this.customComponent.setTableViewDisplayedColumns(['ITMNUM','COMPNUM','PROD_QTY','PROD_UNIT']);
    this.customComponent.setTableViewSearchColumn(this.CONSTANTS.REFTABLE_PRODUCT_COMPONENTS_COLUMN);
    this.customComponent.setTableViewAdditionalSearchColumns('ITMNUM,COMPNUM,PROD_QTY,PROD_UNIT');
    this.customComponent.setTableViewInitialSort({property: 'ITMNUM', order: 'asc'});
    this.customComponent.setTableViewColumnsToHide([]);

    // set detail view...
    this.customComponent.setDetailViewTableDisplayedColumns(['ITMNUM','COMPNUM','PROD_QTY','PROD_UNIT']);

    // set empty item id
    // this.customTableTableFormComponent.setEmptyItemId(this.CONSTANTS.UNIVERSAL_ID_PLACEHOLDER);

    // set empty table model for the new item mode
    this.customComponent.setEmptyModel(
      new ProductComponents('', '', 0,''));

    // allow to load view after all parameters are set
    this.customComponent.startLoading = true;
    this.customComponent.ngAfterViewInit();
  }
}
