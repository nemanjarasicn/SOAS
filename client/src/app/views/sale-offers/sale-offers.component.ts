import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {
  ConstantsService,
  OptionsTypes,
  SubTabGroupTabNames, SubTabGroupTabNumbers,
  TabGroupTabNumbers
} from '../../_services/constants.service';
import {CustomTableTabGroupViewComponent} from '../custom/custom-views/custom-table-tab-group-view/custom-table-tab-group-view.component';

@Component({
  selector: 'app-sale-offers',
  templateUrl: './sale-offers.component.html',
  styleUrls: ['./sale-offers.component.css']
})

/**
 * SaleOffers: saleOffers view component with a CustomTableTabGroupViewComponent:
 * table (on left) and tab-group (on right)
 *
 * SaleOffers => CustomTableTabGroupViewComponent => { CustomTableComponent and DetailViewTabGroupComponent }
 *
 * table:    [SALE_OFFERS]
 * refTable: saleOffers
 */



export class SaleOffersComponent implements AfterViewInit {

  // custom table + tab-group view component
  @ViewChild(CustomTableTabGroupViewComponent) customComponent !: CustomTableTabGroupViewComponent;

  constructor(private CONSTANTS: ConstantsService) {
  }

  /**
   * after view is initialized, setup table and then tab-group by loading data from database
   */
  public ngAfterViewInit(): void {
    this.initCustomTableFormView();
  }

  /**
   * initialize custom table + tab-group view with specific data of saleOffers component
   *
   * @private
   */
  private initCustomTableFormView() {

    // referral table name of the db table
    this.customComponent.setReferralTable(this.CONSTANTS.REFTABLE_SALE_OFFERS);
    // primary + secondary column names for item selection: e.g. selTableRow[primary column name = ORDERS_NUMBER]
    this.customComponent.setPrimaryTableColumnName(this.CONSTANTS.REFTABLE_SALE_OFFERS_COLUMN);
    this.customComponent.setSecondaryTableColumnName(this.CONSTANTS.REFTABLE_SALE_OFFERS_CUS_COLUMN);
    this.customComponent.setTertiaryTableColumnName(this.CONSTANTS.REFTABLE_SALE_OFFERS_CLIENT_COLUMN);

    // set local storage keys
    this.customComponent.setPrimaryLocalStorageKey(this.CONSTANTS.LS_SEL_SALE_OFFERS_NUMBER);
    this.customComponent.setSecondaryLocalStorageKey(this.CONSTANTS.LS_SEL_SALE_OFFERS_CUST_OR_PART_NUMBER);
    this.customComponent.setTertiaryLocalStorageKey(this.CONSTANTS.LS_SEL_SALE_OFFERS_CLIENT);

    // set selected item referral table
    this.customComponent.setSeItemRefTableTitle(this.CONSTANTS.REFTABLE_SALE_OFFERS_TITLE);

    // set main table...
    // set displayed table column names
    this.customComponent.setDisplayedColumns([
      'OFFER_NUMBER',
      'OFFER_DATE',
      'OFFER_ACCEPTED',
      'CLIENT',
      'ORDERS_TYPE',
      'CUSTOMER_ORDER',
      'ORDERAMOUNT_NET',
      'ORDERAMOUNT_BRU',
      'CURRENCY',
      'DISCOUNT',
      'SHIPPING_COSTS',
      'WAREHOUSE',
      'SALES_LOCATION',
      'COMMENT',
      'DISCOUNT_PERC',
    ]); // ,'action');
    this.customComponent.setSearchColumn(this.CONSTANTS.REFTABLE_SALE_OFFERS_COLUMN);
    this.customComponent.setAdditionalSearchColumns('OFFER_NUMBER,OFFER_DATE,OFFER_ACCEPTED,CLIENT,ORDERS_TYPE,CUSTOMER_ORDER,ORDERAMOUNT_NET,ORDERAMOUNT_BRU,CURRENCY,DISCOUNT,SHIPPING_COSTS,WAREHOUSE,SALES_LOCATION,COMMENT,DISCOUNT_PERC');
    this.customComponent.setInitialSort({property: 'OFFER_NUMBER', order: 'desc'});
    this.customComponent.setColumnsToHide([]);

    // set tab group tab number to be selected for order
    this.customComponent.setTabToSelect(TabGroupTabNumbers.SALE_OFFERS);
    this.customComponent.setSubTabToSelect(SubTabGroupTabNumbers.DETAILS);

    // set titles
    this.customComponent.setTableTitle('SALE_OFFERS');
    this.customComponent.setCreateTitle('CREATE_NEW_SALE_OFFERS');
    this.customComponent.setCreateTooltip('ADD_NEW_SALE_OFFERS');

    this.customComponent.setDetailsFormTitle(SubTabGroupTabNames.SALE_OFFERS_DETAILS);

    // load only orders needed form options...
    this.customComponent.setFormOptionsToLoad([OptionsTypes.currencies, OptionsTypes.states, OptionsTypes.paymentTerms,
      OptionsTypes.warehousingLocations, OptionsTypes.customerTypes]);

    // @ToDo: Check (and remove) all emptyModel uses, if empty model should be set from db
    // set empty table model for the new item mode
    // this.customComponent.setEmptyModel(new Orders('', 'B2C',
    //   this.CONSTANTS.ORDER_TYPES[0], '', '', '',
    //   '', '', '',0, 0,
    //   this.CONSTANTS.CURRENCY_EU, '', '', '', '',
    //   false, false,false, this.CONSTANTS.ORDER_STATES_OPEN, 0,
    //   '', 0,0, 0, ''));

    // allow to load view after all parameters are set
    this.customComponent.startLoading = true;
    this.customComponent.ngAfterViewInit();
  }


}
