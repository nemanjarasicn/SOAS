import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ConstantsService,OptionsTypes} from '../../_services/constants.service';
import {SupplyOrders} from '../../models/supply-orders';
import {CustomTableTableFormViewComponent} from '../custom/custom-views/custom-table-table-form-view/custom-table-table-form-view.component';

/**
 * SupplyOrdersComponent:
 *
 * 2 tables:    [SUPPLY_ORDERS] + [SUPPLY_ORDERS_POSITIONS]
 * 2 refTables: supplyOrders      + supplyOrdersPosition
 */

@Component({
  selector: "app-supply-orders",
  templateUrl: "./supply-orders.component.html",
  styleUrls: ["./supply-orders.component.css"],
})
export class SupplyOrdersComponent implements AfterViewInit {

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
    this.customComponent.setReferralTable(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS);
    this.customComponent.setPrimaryRefTableColumnName(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS_PROV_COLUMN);
    this.customComponent.setSecondaryRefTableColumnName(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS_PROV_COLUMN);

    this.customComponent.setSelItemPrimaryLocalStorageKey(this.CONSTANTS.LS_SEL_SUPPLY_ORDERS_NUMBER);
    this.customComponent.setSelItemSecondaryLocalStorageKey(this.CONSTANTS.LS_SEL_SUPPLY_ORDERS_POSITION_ID);

    this.customComponent.setPageParamsPrimaryColumnName(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS_PROV_COLUMN);
    // local storage key to manage selection of detail view form item...
    this.customComponent.setSelItemSecondaryIdLocalStorageKey(this.CONSTANTS.LS_SEL_SUPPLY_ORDERS_POSITION_ID);

    // set selected item referral table
    this.customComponent.setSeItemRefTableTitle(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS_POSITIONS_TITLE);

    this.customComponent.setDetailViewRefTable(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS_POSITIONS);
    this.customComponent.setDetailViewPrimaryRefTableColumnName(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS_POSITIONS_ROW_ID);

    // form settings to load data by ID
    this.customComponent.setDetailViewFormKey(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS_PROV_COLUMN);
    this.customComponent.setDetailViewFormValue(this.CONSTANTS.LS_SEL_SUPPLY_ORDERS_POSITION_ID);

    // set a flag, that in details view the data should be shown based on second table referral name (not primary)
    this.customComponent.setShowSecondTableDataInDetailsView(true);

    // load only needed form options: ...
    // this.formOptionsToLoad = [OptionsTypes.];

    // set titles
    this.customComponent.setTableTitle('SUPPLY_ORDERS');
    this.customComponent.setDetailTableTitle('SUPPLY_ORDERS_POSITIONS');
    this.customComponent.setDetailFormTitle('SUPPLY_ORDERS_FORM');
    this.customComponent.setCreateTitle('CREATE_NEW_SUPPLY_ORDER');
    this.customComponent.setCreateTooltip('CREATE_NEW_SUPPLY_ORDER');
    this.customComponent.setCreateDetailviewButtonTitle('CREATE_NEW_SUPPLY_ORDER_POSITION');
    this.customComponent.setDetailViewCreateTitle('New supply order position');

    // set main table...
    // set displayed table column names
    this.customComponent.setTableViewDisplayedColumns([
      'PROVIDERS_ORDER',
      'PROVIDER',
      'CLIENT_DELIVERY',
      'CLIENT_INVOICE',
      'ORDERAMOUNT_NET',
      'ORDERAMOUNT_BRU',
      'ORDERREF',
      'CURRENCY',
      'SHIPPING_COSTS',
      'WAREHOUSE',
      'ORDERS_DATE',
      'INTERCOMPANY',
    ]);

    this.customComponent.setTableViewSearchColumn(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS_PROV_COLUMN);
    this.customComponent.setTableViewAdditionalSearchColumns('PROVIDERS_ORDER,PROVIDER,CLIENT_DELIVERY,CLIENT_INVOICE,ORDERAMOUNT_NET,ORDERAMOUNT_BRU,ORDERREF,CURRENCY,SHIPPING_COSTS,WAREHOUSE,ORDERS_DATE,INTERCOMPANY');
    this.customComponent.setTableViewInitialSort({property: 'PROVIDERS_ORDER', order: 'asc'});
    // define table columns that are loaded by default, but should be not visible for user
    // this.customTableTableFormComponent.setTableViewColumnsToHide([]);

    this.customComponent.setPaginatorElementsPerSideDetailTable(this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE_THREE);
    this.customComponent.setCurrPageSizeDetailTable(this.CONSTANTS.PAGINATOR_MAX_ELEMENTS_TINY);

    // set detail view...
    this.customComponent.setDetailViewTableDisplayedColumns(['ITMNUM', 'PRICE_NET', 'WAREHOUSE']);
    this.customComponent.setDetailViewTableColumnsToHide(['']);

    // set empty item id
    // this.customTableTableFormComponent.setEmptyItemId(this.CONSTANTS.UNIVERSAL_ID_PLACEHOLDER);


    this.customComponent.setDetailTableViewSearchColumn(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS_POSITIONS_ID);


    // load only needed form options: currencies...
    this.customComponent.setFormOptionsToLoad([OptionsTypes.provider]);


    // set empty table model for the new item mode
    this.customComponent.setEmptyModel(new SupplyOrders('','','','',0,0,'',0,0,'','',0,0));

    // allow to load view after all parameters are set
    this.customComponent.startLoading = true;
    this.customComponent.ngAfterViewInit();
  }
}
