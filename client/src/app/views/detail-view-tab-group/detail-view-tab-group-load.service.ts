import {Injectable} from '@angular/core';
import {DetailViewTabGroupTabsService} from './detail-view-tab-group-tabs.service';
import {
  ConstantsService,
  CustomersTypes,
  ORDER_POSITIONS_DIALOG_COLS,
  SubTabGroupTabNames
} from '../../_services/constants.service';
import {Customer} from '../../models/customer';
import {Orders} from '../../models/orders';
import {DeliveryNotes} from '../../models/delivery-notes';
import {Invoices} from '../../models/invoices';
import {DetailViewTabGroupPositionsService} from './detail-view-tab-group-positions.service';
import {FormService} from '../../_services/form.service';

@Injectable({
  providedIn: 'root'
})

/**
 * DetailViewTabGroupLoadService - a service for detail view tab group component view to manage set parameters for
 * loading of data from db for form (details) or positions/addresses
 *
 * Used by: DetailViewTabGroupComponent
 */
export class DetailViewTabGroupLoadService {

  refTable: string;
  // secondary referral table name for query, because customers has
  // e.g. customer addresses=customersAddrDlv
  secondaryRefTable: string;
  tabsService: DetailViewTabGroupTabsService;
  positionsService: DetailViewTabGroupPositionsService;
  // selected table row item
  selTableRow: undefined | Customer | Orders | DeliveryNotes | Invoices;

  newCustomerAddrDLVMode: boolean;
  newCustomerMode: boolean;
  newCustomerAddrINVMode: boolean;
  newOrderMode: boolean;
  newOrderPositionMode: boolean;

  cols: any[]; // order positions form columns
  dialogCols: any[]; // new position dialog form columns

  constructor(private CONSTANTS: ConstantsService,
              private formService: FormService) {
  }

  setRequiredParams(refTable: string, refTableCustomersAddresses: string, tabsService: DetailViewTabGroupTabsService,
                    positionsService: DetailViewTabGroupPositionsService, selTableRow: any,
                    newCustomerAddrDLVMode: boolean, newCustomerMode: boolean, newCustomerAddrINVMode: boolean,
                    newOrderMode: boolean, newOrderPositionMode: boolean) {
    this.setRefTable(refTable);
    this.setRefTableCustomersAddresses(refTableCustomersAddresses);
    this.setTabsService(tabsService);
    this.setPositionsService(positionsService);
    this.setSelTableRow(selTableRow);
    this.setNewCustomerAddrDLVMode(newCustomerAddrDLVMode);
    this.setNewCustomerMode(newCustomerMode);
    this.setNewCustomerAddrINVMode(newCustomerAddrINVMode);
    this.setNewOrderMode(newOrderMode);
    this.setNewOrderPositionMode(newOrderPositionMode);
  }

  setRefTable(refTable: string) {
    this.refTable = refTable;
  }

  setRefTableCustomersAddresses(refTable: string) {
    this.secondaryRefTable = refTable;
  }

  setTabsService(service: DetailViewTabGroupTabsService) {
    this.tabsService = service;
  }

  setPositionsService(service: DetailViewTabGroupPositionsService) {
    this.positionsService = service;
  }

  setSelTableRow(selRow: any) {
    this.selTableRow = selRow;
  }

  setNewCustomerAddrDLVMode(flag: boolean) {
    this.newCustomerAddrDLVMode = flag;
  }

  setNewCustomerMode(flag: boolean) {
    this.newCustomerMode = flag;
  }

  setNewCustomerAddrINVMode(flag: boolean) {
    this.newCustomerAddrINVMode = flag;
  }

  setNewOrderMode(flag: boolean) {
    this.newOrderMode = flag;
  }

  setNewOrderPositionMode(flag: boolean) {
    this.newOrderPositionMode = flag;
  }

  /**
   * get parameters for loading form and table data from db
   *
   * @param subTabName - name of the sub-tab: e.g. 'CUSTOMER_DETAILS' or 'ADDRESS_DELIVERIES'
   * @param lockedRefTable -  referral table name to check if table is locked
   * @param tablePrimaryColumn - table primary column
   * @param tablePrimaryValue - table primary value
   * @param customerType - additional parameter for customer type: b2c/b2b
   * @param tableSecondColumn - table secondary column
   * @param tableSecondValue - table secondary value
   * @param formSecondColumn - form secondary column
   * @param formSecondValue - form secondary value
   * @param primaryRefTable - primary referral table name for query: e.g. customers=custbtwoc
   * @private
   */
  public getParamDataForLoading(subTabName: SubTabGroupTabNames, lockedRefTable: string,
                                tablePrimaryColumn: string, tablePrimaryValue: string, customerType: CustomersTypes,
                                tableSecondColumn: string, tableSecondValue: string, formSecondColumn: string,
                                formSecondValue: string, primaryRefTable: undefined | string):
    {
      lockedRefTable: string,
      tablePrimaryColumn: string,
      tablePrimaryValue: string,
      customerType: CustomersTypes,
      tableSecondColumn: string,
      tableSecondValue: string,
      formSecondColumn: string,
      formSecondValue: string,
      primaryRefTable: undefined | string,
      secondaryRefTable: undefined | string
    } {
    tablePrimaryColumn = this.formService.primaryTableColumnName;
    customerType = this.getCustomerType(this.refTable, this.selTableRow);
    // secondary referral table name for query: e.g. customer addresses=customersAddrDlv
    this.secondaryRefTable = this.refTable;
    lockedRefTable = this.formService.selItemRefTableTitle;
    // console.log('subTabName: ', subTabName);
    // console.log('this.refTable: ', this.refTable);
    switch (subTabName) {
      // user has customer detail sub-tab selected...
      case SubTabGroupTabNames.CUSTOMER_DETAILS:
        // set default params for customer details view
        primaryRefTable = (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) ? this.CONSTANTS.REFTABLE_CUSTOMER :
          this.CONSTANTS.REFTABLE_PARTNERS;
        this.secondaryRefTable = primaryRefTable;
        tableSecondColumn = this.CONSTANTS.REFTABLE_CUSTOMER_CUSTOMERS_TYPE;
        tableSecondValue = customerType;
        formSecondColumn = undefined;
        formSecondValue = undefined;
        // set params if user is on other view (referral table), then selected tab:
        // e.g. sub-tab-group is 'CUSTOMER_DETAILS', but refTable is 'orders' etc.
        const __ret = this.setCustomerNumberAndFormParams(tablePrimaryColumn, tablePrimaryValue, formSecondColumn,
          formSecondValue, this.refTable);
        tablePrimaryColumn = __ret.tablePrimaryColumn;
        tablePrimaryValue = __ret.tablePrimaryValue;
        break;
      // user has customer addresses deliveries sub-tab selected...
      case SubTabGroupTabNames.ADDRESS_DELIVERIES:
        primaryRefTable = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV;
        this.secondaryRefTable = primaryRefTable;
        tableSecondColumn = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_ADDRESS_TYPE;
        tableSecondValue = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_COLUMN;
        // if user is on same scope view as refTable: customer or partner, then select form data by local storage id
        if (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER || this.refTable === this.CONSTANTS.REFTABLE_PARTNERS) {
          formSecondColumn = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_ID;
          formSecondValue = (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) ?
            localStorage.getItem(this.CONSTANTS.LS_SEL_CUSTOMER_ADDRESSES_DLV_ID) :
            localStorage.getItem(this.CONSTANTS.LS_SEL_PARTNER_ADDRESSES_DLV_ID);
        } else {
          // otherwise select by type: DLV
          formSecondColumn = tableSecondColumn;
          formSecondValue = tableSecondValue;
        }
        // set params if user is on other view (referral table), then selected tab:
        // e.g. sub-tab-group is 'ADDRESS_DELIVERIES', but refTable is 'orders' etc.
        const __ret1 = this.setCustomerNumberAndFormParams(tablePrimaryColumn, tablePrimaryValue, formSecondColumn,
          formSecondValue, this.refTable);
        tablePrimaryColumn = __ret1.tablePrimaryColumn;
        tablePrimaryValue = __ret1.tablePrimaryValue;
        break;
      // user has customer addresses invoices sub-tab selected...
      case SubTabGroupTabNames.ADDRESS_INVOICES:
        primaryRefTable = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV;
        this.secondaryRefTable = primaryRefTable;
        tableSecondColumn = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_ADDRESS_TYPE;
        tableSecondValue = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV_COLUMN;
        // if user is on same scope view as refTable: customer or partner, then select form data by local storage id
        if (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER || this.refTable === this.CONSTANTS.REFTABLE_PARTNERS) {
          formSecondColumn = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV_ID;
          formSecondValue = (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) ?
            localStorage.getItem(this.CONSTANTS.LS_SEL_CUSTOMER_ADDRESSES_INV_ID) :
            localStorage.getItem(this.CONSTANTS.LS_SEL_PARTNER_ADDRESSES_INV_ID);
        } else {
          // otherwise select by type: INV
          formSecondColumn = tableSecondColumn;
          formSecondValue = tableSecondValue;
        }
        // set params if user is on other view (referral table), then selects a sub-tab:
        // e.g. sub-tab-group is 'ADDRESS_INVOICES', but refTable is 'orders' etc.
        const __ret2 = this.setCustomerNumberAndFormParams(tablePrimaryColumn, tablePrimaryValue, formSecondColumn,
          formSecondValue, this.refTable);
        tablePrimaryColumn = __ret2.tablePrimaryColumn;
        tablePrimaryValue = __ret2.tablePrimaryValue;
        break;
      case SubTabGroupTabNames.ORDER_DETAILS:
        primaryRefTable = this.CONSTANTS.REFTABLE_ORDERS;
        this.secondaryRefTable = primaryRefTable;
        formSecondColumn = undefined;
        formSecondValue = undefined;
        const __ret3 = this.getOrdersNumberAndColumn(SubTabGroupTabNames.ORDER_DETAILS, this.refTable);
        tablePrimaryColumn = __ret3.tablePrimaryColumn;
        tablePrimaryValue = __ret3.tablePrimaryValue;
        break;
      case SubTabGroupTabNames.ORDER_POSITIONS:
        primaryRefTable = this.CONSTANTS.REFTABLE_ORDERS_POSITIONS;
        this.secondaryRefTable = primaryRefTable;
        if (this.selTableRow) {
          let __ret4 = this.positionsService.getOrderPositionCols(
            this.selTableRow[this.CONSTANTS.REFTABLE_ORDERS_CLIENT_COLUMN]);
          this.cols = __ret4.cols;
          this.dialogCols = __ret4.dialogCols;
        }
        const __ret5 =
          this.getOrderPositionsCustomerNumberAndColumn(SubTabGroupTabNames.ORDER_POSITIONS, this.refTable);
        tablePrimaryColumn = __ret5.tablePrimaryColumn;
        tablePrimaryValue = __ret5.tablePrimaryValue;
        break;
      case SubTabGroupTabNames.DELIVERY_NOTES_DETAILS:
        primaryRefTable = this.CONSTANTS.REFTABLE_DELIVERY_NOTES;
        this.secondaryRefTable = primaryRefTable;
        formSecondColumn = undefined;
        formSecondValue = undefined;
        const __ret6 =
          this.getDeliveryNoteCustomerNumberAndColumn(SubTabGroupTabNames.DELIVERY_NOTES_DETAILS, this.refTable);
        tablePrimaryColumn = __ret6.tablePrimaryColumn;
        tablePrimaryValue = __ret6.tablePrimaryValue;
        break;
      case SubTabGroupTabNames.DELIVERY_NOTES_POSITIONS:
        primaryRefTable = this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS;
        this.secondaryRefTable = primaryRefTable;
        this.cols = this.positionsService.getDeliveryNotePositionCols();
        formSecondColumn = undefined;
        formSecondValue = undefined;
        const __ret7 =
          this.getDeliveryNoteCustomerNumberAndColumn(SubTabGroupTabNames.DELIVERY_NOTES_POSITIONS, this.refTable);
        tablePrimaryColumn = __ret7.tablePrimaryColumn;
        tablePrimaryValue = __ret7.tablePrimaryValue;
        break;
      case SubTabGroupTabNames.INVOICE_DETAILS:
        primaryRefTable = this.CONSTANTS.REFTABLE_INVOICE;
        this.secondaryRefTable = primaryRefTable;
        formSecondColumn = undefined;
        formSecondValue = undefined;
        const __ret8 =
          this.getInvoiceCustomerNumberAndColumn(SubTabGroupTabNames.INVOICE_DETAILS, this.refTable);
        tablePrimaryColumn = __ret8.tablePrimaryColumn;
        tablePrimaryValue = __ret8.tablePrimaryValue;
        break;
      case SubTabGroupTabNames.INVOICES_POSITIONS:
        this.cols = this.positionsService.getInvoicePositionCols();
        primaryRefTable = this.CONSTANTS.REFTABLE_INVOICE_POSITIONS;
        this.secondaryRefTable = primaryRefTable;
        formSecondColumn = undefined;
        formSecondValue = undefined;
        const __ret9 =
          this.getInvoiceCustomerNumberAndColumn(SubTabGroupTabNames.INVOICES_POSITIONS, this.refTable);
        tablePrimaryColumn = __ret9.tablePrimaryColumn;
        tablePrimaryValue = __ret9.tablePrimaryValue;
        // set columns for new position dialog
        // if (this.selTableRow) {
        //   let __ret10 = this.positionsService.getOrderPositionCols(
        //     this.selTableRow[this.CONSTANTS.REFTABLE_ORDERS_CLIENT_COLUMN]);
          this.dialogCols = ORDER_POSITIONS_DIALOG_COLS; // __ret10.dialogCols;
        // }
        break;
      case SubTabGroupTabNames.COMMENT_DETAILS:
        primaryRefTable = this.CONSTANTS.REFTABLE_COMMENTS;
        this.secondaryRefTable = primaryRefTable;
        formSecondColumn = undefined;
        formSecondValue = undefined;
        // @ToDo: Add tablePrimaryColumn & tablePrimaryValue for comments
        break;
      default:
        primaryRefTable = undefined;
        formSecondColumn = undefined;
        formSecondValue = undefined;
        tablePrimaryColumn = undefined;
        tablePrimaryValue = undefined;
        break;
    }
    return {
      lockedRefTable: lockedRefTable,
      tablePrimaryColumn: tablePrimaryColumn,
      tablePrimaryValue: tablePrimaryValue,
      customerType,
      tableSecondColumn,
      tableSecondValue,
      formSecondColumn,
      formSecondValue,
      primaryRefTable: primaryRefTable,
      secondaryRefTable: this.secondaryRefTable
    };
  }

  /**
   * get customer type by given referral table (customers/partners) or by selected table row data (orders)
   *
   * custbtwoc: B2C
   * custbtwob: B2B
   * orders: load type from selTableRow
   *
   * @param refTable
   * @param selTableRow
   * @private
   */
  public getCustomerType(refTable: string, selTableRow: Customer | Orders | DeliveryNotes | Invoices):
    undefined | CustomersTypes {
    return (refTable === this.CONSTANTS.REFTABLE_CUSTOMER || refTable === this.CONSTANTS.REFTABLE_PARTNERS) ?
      ((refTable === this.CONSTANTS.REFTABLE_CUSTOMER) ? CustomersTypes.B2C : CustomersTypes.B2B) :
      (refTable === this.CONSTANTS.REFTABLE_ORDERS) ?
        (selTableRow && selTableRow.hasOwnProperty(this.CONSTANTS.REFTABLE_ORDERS_CLIENT_COLUMN) ?
          selTableRow[this.CONSTANTS.REFTABLE_ORDERS_CLIENT_COLUMN] : undefined) :
        undefined;
  }

  /**
   * set selected number and form parameters for customer tab,
   * if user has other tab-group selected then current referral table:
   * e.g. refTable is 'custbtwoc', but tab-group is 'orders'
   *
   * @param tablePrimaryColumn
   * @param tablePrimaryValue
   * @param formSecondColumn
   * @param formSecondValue
   * @param refTable
   * @private
   */
  private setCustomerNumberAndFormParams(tablePrimaryColumn: string, tablePrimaryValue: string, formSecondColumn: string,
                                         formSecondValue: string, refTable: string):
    { tablePrimaryColumn, tablePrimaryValue } {
    tablePrimaryColumn = this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN;
    if ((refTable === this.CONSTANTS.REFTABLE_ORDERS) || (refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES) ||
      (refTable === this.CONSTANTS.REFTABLE_INVOICE)) {
      switch (refTable) {
        case(this.CONSTANTS.REFTABLE_ORDERS) :
          // user is currently at orders view, but has customers tab selected
          // so load customers data for current orders customer number: [CUSTOMER_ORDER]
          tablePrimaryValue = this.selTableRow[this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN];
          break;
        case(this.CONSTANTS.REFTABLE_DELIVERY_NOTES) :
          // user is currently at delivery note view (refTable), but has customers tab selected
          // so load customers data for current selected delivery note customer number: [CUSTOMERS_NUMBER]
          tablePrimaryValue = this.selTableRow[this.CONSTANTS.REFTABLE_DELIVERY_NOTES_CUS_COLUMN];
          break;
        case(this.CONSTANTS.REFTABLE_INVOICE) :
          // user is currently at invoice view (refTable), but has customers tab selected
          // so load customers data for current selected invoice customer number: [INVOICES_CUSTOMER]
          tablePrimaryValue = this.selTableRow[this.CONSTANTS.REFTABLE_INVOICE_CUS_COLUMN];
          break;
      }
    }
    return {
      tablePrimaryColumn: tablePrimaryColumn, tablePrimaryValue: tablePrimaryValue
    };
  }

  /**
   * get customer number and column for delivery note and positions
   *
   * @param tabTitle
   * @param refTable
   * @private
   */
  private getOrdersNumberAndColumn(tabTitle: string, refTable: string):
    { tablePrimaryColumn, tablePrimaryValue, primaryRefTable } {
    let primaryRefTable: string = refTable;
    let tablePrimaryColumn: string = this.CONSTANTS.REFTABLE_ORDERS_COLUMN;
    let tablePrimaryValue: string = ((tabTitle === SubTabGroupTabNames.ORDER_DETAILS) ||
      (tabTitle === SubTabGroupTabNames.ORDER_POSITIONS)) ?
      this.newOrderMode ? this.CONSTANTS.UNIVERSAL_ID_PLACEHOLDER :
        localStorage.getItem(this.CONSTANTS.LS_SEL_ORDERS_NUMBER) : undefined;
    // user is currently at customer view (refTable), but has orders tab selected
    // so load orders data for current customer number: [CUSTOMERS_NUMBER]
    if (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER || this.refTable === this.CONSTANTS.REFTABLE_PARTNERS) {
      tablePrimaryColumn = this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN;
      tablePrimaryValue = this.selTableRow[this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN];
    } else if (this.refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES ||
      this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      // user is currently at delivery note or invoice view (refTable), but has orders tab selected
      // so load orders data for current orders number: [ORDERS_NUMBER]
      tablePrimaryValue = this.selTableRow[tablePrimaryColumn]; // this.CONSTANTS.REFTABLE_ORDERS_COLUMN
    }
    return {tablePrimaryColumn, tablePrimaryValue, primaryRefTable};
  }

  /**
   * get customer number and column for delivery note and positions
   *
   * @param tabTitle
   * @param refTable
   * @private
   */
  private getOrderPositionsCustomerNumberAndColumn(tabTitle: string, refTable: string):
    { tablePrimaryColumn, tablePrimaryValue, primaryRefTable } {
    let tablePrimaryColumn: string = this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_COLUMN;
    let tablePrimaryValue: string = ((tabTitle === SubTabGroupTabNames.ORDER_DETAILS) ||
      (tabTitle === SubTabGroupTabNames.ORDER_POSITIONS)) ?
      this.newOrderPositionMode ? this.CONSTANTS.UNIVERSAL_ID_PLACEHOLDER :
        localStorage.getItem(this.CONSTANTS.LS_SEL_ORDERS_NUMBER) : undefined;
    let primaryRefTable: string = refTable;
    // user is currently at customer view (refTable), but has orders positions tab selected
    // so load orders positions data for current customer number: [CUSTOMERS_NUMBER]
    if (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER || this.refTable === this.CONSTANTS.REFTABLE_PARTNERS) {
      tablePrimaryColumn = this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN;
      tablePrimaryValue = this.selTableRow[this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN];
    } else if (this.refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES ||
      this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      // user is currently at delivery note or invoice view (refTable), but has orders positions tab selected
      // so load orders positions data for current orders number: [ORDERS_NUMBER]
      tablePrimaryColumn = this.CONSTANTS.REFTABLE_ORDERS_COLUMN;
      tablePrimaryValue = this.selTableRow[this.CONSTANTS.REFTABLE_ORDERS_COLUMN];
    }
    return {tablePrimaryColumn, tablePrimaryValue, primaryRefTable};
  }

  /**
   * get customer number and column for delivery note and positions
   *
   * @param tabTitle
   * @param refTable
   * @private
   */
  private getDeliveryNoteCustomerNumberAndColumn(tabTitle: string, refTable: string):
    { tablePrimaryColumn, tablePrimaryValue, primaryRefTable } {
    let primaryRefTable: string = refTable;
    let tablePrimaryColumn: string = this.CONSTANTS.REFTABLE_DELIVERY_NOTES_COLUMN;
    let tablePrimaryValue: string = ((tabTitle === SubTabGroupTabNames.DELIVERY_NOTES_DETAILS) ||
      (tabTitle === SubTabGroupTabNames.DELIVERY_NOTES_POSITIONS)) ?
      localStorage.getItem(this.CONSTANTS.LS_SEL_DLV_NOTES_NUMBER) : undefined;
    // user is currently at customer view (refTable), but has delivery note tab selected
    // so load delivery note data for current customer number: [CUSTOMERS_NUMBER]
    if (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER || this.refTable === this.CONSTANTS.REFTABLE_PARTNERS) {
      tablePrimaryColumn = this.CONSTANTS.REFTABLE_DELIVERY_NOTES_CUS_COLUMN;
      tablePrimaryValue = this.selTableRow[tablePrimaryColumn];
    } else if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS || this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      // user is currently at orders or invoice view (refTable), but has delivery note tab selected
      // so load delivery note data for current orders number: [ORDERS_NUMBER]
      tablePrimaryColumn = this.CONSTANTS.REFTABLE_ORDERS_COLUMN;
      tablePrimaryValue = this.selTableRow[tablePrimaryColumn];
    }
    return {tablePrimaryColumn, tablePrimaryValue, primaryRefTable};
  }

  /**
   * get customer number and column for invoice detail or positions
   *
   * @param tabTitle
   * @param refTable
   * @private
   */
  private getInvoiceCustomerNumberAndColumn(tabTitle: string, refTable: string):
    { tablePrimaryColumn, tablePrimaryValue, primaryRefTable } {
    let primaryRefTable: string = refTable;
    let tablePrimaryColumn: string = this.CONSTANTS.REFTABLE_INVOICE_COLUMN;
    let tablePrimaryValue: string =
      ((tabTitle === SubTabGroupTabNames.INVOICE_DETAILS) || (tabTitle === SubTabGroupTabNames.INVOICES_POSITIONS)) ?
        localStorage.getItem(this.CONSTANTS.LS_SEL_INVOICE_NUMBER) : undefined;
    // user is currently at customer/partner view (refTable), but has invoice tab selected
    // so load invoice data for current customer number: [CUSTOMERS_NUMBER]
    if (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER || this.refTable === this.CONSTANTS.REFTABLE_PARTNERS) {
      tablePrimaryColumn = this.CONSTANTS.REFTABLE_INVOICE_CUS_COLUMN;
      tablePrimaryValue = this.selTableRow[this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN];
    } else if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) {
      // user is currently at orders view (refTable), but has invoice tab selected
      // so load invoice data for current orders number: [ORDERS_NUMBER]
      tablePrimaryColumn = this.CONSTANTS.REFTABLE_ORDERS_COLUMN;
      tablePrimaryValue = this.selTableRow[tablePrimaryColumn];
    } else if (this.refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES) {
      // user is currently at delivery notes view (refTable), but has invoice tab selected
      // so load invoice data for current delivery notes number: [DELIVERY_NOTES_NUMBER]
      tablePrimaryColumn = this.CONSTANTS.REFTABLE_DELIVERY_NOTES_COLUMN;
      tablePrimaryValue = this.selTableRow[tablePrimaryColumn];
    }
    return {tablePrimaryColumn, tablePrimaryValue, primaryRefTable};
  }
}
