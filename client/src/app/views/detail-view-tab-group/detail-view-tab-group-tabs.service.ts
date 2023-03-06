import {ChangeDetectorRef, Injectable, ViewChild} from '@angular/core';
import {MatTabGroup} from '@angular/material/tabs';
import {
  ConstantsService,
  SubTabGroupTabNames,
  SubTabGroupTabNumbers, TabGroupTabNames,
  TabGroupTabNumbers
} from '../../_services/constants.service';

@Injectable({
  providedIn: 'root'
})

/**
 * DetailViewTabGroupTabsService - a service for detail view tab group component view to manage tab-group tabs
 *
 * Used by: DetailViewTabGroupComponent
 */
export class DetailViewTabGroupTabsService {

  /** tabs definitions */
  @ViewChild('tabs', {static: false}) tabGroup: MatTabGroup;
  // 5 main tabs: customer, order, delivery note, invoice, comment
  @ViewChild('custabs', {static: false}) cusTabGroup: MatTabGroup;
  @ViewChild('ordtabs', {static: false}) ordTabGroup: MatTabGroup;
  @ViewChild('deltabs', {static: false}) delTabGroup: MatTabGroup;
  @ViewChild('invtabs', {static: false}) invTabGroup: MatTabGroup;
  @ViewChild('comtabs', {static: false}) comTabGroup: MatTabGroup;

  // tab-group tab to select: 0 - customers, 1 - order, 2 - delivery note, 3 - invoice, 4 - comments
  selTabGroupTab: TabGroupTabNumbers;
  // sub-tab-group tab to select: 0 - details, 1 - positions / addresses dlv, (2 - addresses inv)
  selSubTabGroupTab: SubTabGroupTabNumbers;

  // selected tab name
  selCurrentTabName: TabGroupTabNames;
  // selected tab group name
  selCurrentTabGroupName: string;
  // title names
  customerTitle: TabGroupTabNames;
  // tab title
  ordersTitle: TabGroupTabNames;
  // details form title
  ordersDetailsFormTitle: string;
  delNotesTitle: TabGroupTabNames;
  delNoteFormTitle: string;
  invoicesTitle: TabGroupTabNames;
  invoiceFormTitle: string;
  commentsTitle: TabGroupTabNames;
  commentDetails: string;
  createAddressTitle: string;
  createTooltip: string;
  createOrderPositionTitle: string;

  cdRef: ChangeDetectorRef;

  constructor(private CONSTANTS: ConstantsService) {

    // Tab (0) - Customer
    this.setCustomerTitle(TabGroupTabNames.CUSTOMER);
    // - Sub-TabGroup - Customer-Details
    // - Sub-TabGroup - Customer-Delivery-Addresses
    // - Sub-TabGroup - Customer-Invoice-Addresses

    this.setOrdersTitle(TabGroupTabNames.ORDER);
    this.setDelNotesTitle(TabGroupTabNames.DELIVERY_NOTE);
    this.setInvoicesTitle(TabGroupTabNames.INVOICE);
    this.setCommentsTitle(TabGroupTabNames.COMMENT);
    this.setCommentDetailsTitle('COMMENT');

    this.setInvoiceFormTitle(this.CONSTANTS.REFTABLE_INVOICE_TITLE);
    this.setDelNoteFormTitle(this.CONSTANTS.REFTABLE_DELIVERY_NOTE_TITLE);
    // show orders number by: this.ordersDetailsFormTitle
    this.setOrdersDetailsFormTitle(this.CONSTANTS.REFTABLE_ORDERS_DETAILS_TITLE);
    this.setCreateAddressTitle(this.CONSTANTS.CREATE_ADDRESS_TITLE);
    this.setCreateTooltip(this.CONSTANTS.CREATE_ADDRESS_TOOLTIP);
    this.setCreateOrderPositionTitle(this.CONSTANTS.CREATE_ORDER_POSITION);
  }

  setSelCurrentTabName(name: TabGroupTabNames) {
    this.selCurrentTabName = name;
  }

  getSelCurrentTabName(): TabGroupTabNames {
    return this.selCurrentTabName;
  }

  setSelCurrentTabGroupName(name: string) {
    this.selCurrentTabGroupName = name;
  }

  setCustomerTitle(title: TabGroupTabNames) {
    this.customerTitle = title;
  }

  setOrdersTitle(title: TabGroupTabNames) {
    this.ordersTitle = title;
  }

  setOrdersDetailsFormTitle(title: string) {
    this.ordersDetailsFormTitle = title
  }

  setDelNotesTitle(title: TabGroupTabNames) {
    this.delNotesTitle = title;
  }

  setDelNoteFormTitle(title: string) {
    this.delNoteFormTitle = title;
  }

  setInvoicesTitle(title: TabGroupTabNames) {
    this.invoicesTitle = title;
  }

  setInvoiceFormTitle(title: string) {
    this.invoiceFormTitle = title;
  }

  setCommentsTitle(title: TabGroupTabNames) {
    this.commentsTitle = title;
  }

  setCommentDetailsTitle(title: string) {
    this.commentDetails = title;
  }

  setTabGroup(group: MatTabGroup) {
    this.tabGroup = group;
  }

  setCusTabGroup(group: MatTabGroup) {
    this.cusTabGroup = group;
  }

  setOrdTabGroup(group: MatTabGroup) {
    this.ordTabGroup = group;
  }

  setDelTabGroup(group: MatTabGroup) {
    this.delTabGroup = group;
  }

  setInvTabGroup(group: MatTabGroup) {
    this.invTabGroup = group;
  }

  setComTabGroup(group: MatTabGroup) {
    this.comTabGroup = group;
  }

  setCreateAddressTitle(title: string) {
    this.createAddressTitle = title;
  }

  setCreateTooltip(title: string) {
    this.createTooltip = title;
  }

  setCreateOrderPositionTitle(title: string) {
    this.createOrderPositionTitle = title;
  }

  setCdRef(cdRef) {
    this.cdRef = cdRef;
  }

  public selectCustomerTab() {
    // "Customer" tab is selected by default
    this.selCurrentTabName = this.customerTitle;
    this.selectTab(this.customerTitle);
  }

  public selectOrderTab() {
    this.selCurrentTabName = this.ordersTitle;
    this.selectTab(this.ordersTitle);
  }

  public selectOrderPositionsTab() {
    this.selCurrentTabName = this.ordersTitle;
    this.selectTab(this.ordersTitle, SubTabGroupTabNames.ORDER_DETAILS);
  }

  public selectDeliveryNoteTab() {
    this.selCurrentTabName = this.delNotesTitle;
    this.selectTab(this.delNotesTitle);
  }

  public selectInvoiceTab() {
    this.selCurrentTabName = this.invoicesTitle;
    this.selectTab(this.invoicesTitle);
  }

  /**
   * get selected sub-tab-group index for given title name.
   * returns tab-group index number or undefined, if title was not found.
   *
   * IN: 'ORDER' (order details is selected)
   * OUT: 0
   *
   * @param tabTitle
   */
  getSelectedSubTabGroupIndex(tabTitle: TabGroupTabNames): undefined | number {
    switch (tabTitle) {
      case(this.customerTitle):
        if (this.cusTabGroup && this.cusTabGroup.selectedIndex !== undefined) {
          return this.cusTabGroup.selectedIndex;
        }
        break;
      case(this.ordersTitle):
        if (this.ordTabGroup && this.ordTabGroup.selectedIndex !== undefined) {
          return this.ordTabGroup.selectedIndex;
        }
        break;
      case(this.delNotesTitle):
        if (this.delTabGroup && this.delTabGroup.selectedIndex !== undefined) {
          return this.delTabGroup.selectedIndex;
        }
        break;
      case(this.invoicesTitle):
        if (this.invTabGroup && this.invTabGroup.selectedIndex !== undefined) {
          return this.invTabGroup.selectedIndex;
        }
        break;
      case(this.commentsTitle):
        if (this.comTabGroup && this.comTabGroup.selectedIndex !== undefined) {
          return this.comTabGroup.selectedIndex;
        }
        break;
      default:
        return undefined;
    }
  }

  /**
   * get selected tab index
   */
  getSelectedTabIndex(): TabGroupTabNumbers {
    return this.tabGroup.selectedIndex;
  }

  /**
   * Get current names by tab and tab group
   *
   * @param tabIndex
   * @param subTabGroupIndex
   * @private
   */
  public getCurrentTabNames(refTable: string, tabIndex: TabGroupTabNumbers, subTabGroupIndex: SubTabGroupTabNumbers):
    SubTabGroupTabNames {
    let currGroup: undefined | SubTabGroupTabNames;
    // if (subTabGroupIndex || (subTabGroupIndex === 0)) {
      let currTab: undefined | TabGroupTabNames;
      if ((!tabIndex && tabIndex !== 0) && this.tabGroup) {
        tabIndex = this.tabGroup.selectedIndex;
      }
      const __ret = this.getTabAndTabGroup(refTable, tabIndex, subTabGroupIndex);
      currTab = __ret.currTab;
      currGroup = __ret.currGroup;
      this.selCurrentTabName = currTab;
      this.selCurrentTabGroupName = currGroup;
    // } else {
    //   console.log(new Error('subTabGroupIndex is undefined!'));
    // }
    return currGroup;
  }

  /**
   * get tab and tab-group for given tab and tab-group indexes
   *
   * IN: tabIndex = 0, tabGroupIndex = 1
   * OUT: currTab = 'CUSTOMER', currGroup = 'ADDRESS_DELIVERIES'
   *
   * @param tabIndex
   * @param subTabGroupIndex
   */
  public getTabAndTabGroup(refTable: string, tabIndex: TabGroupTabNumbers, subTabGroupIndex: SubTabGroupTabNumbers):
    { currTab: undefined | TabGroupTabNames, currGroup: undefined | SubTabGroupTabNames } {
    let currTab: undefined | TabGroupTabNames;
    let currGroup: undefined | SubTabGroupTabNames;
    switch (tabIndex) {
      case(TabGroupTabNumbers.CUSTOMER):
        currTab = (refTable === this.CONSTANTS.REFTABLE_PARTNERS) ? TabGroupTabNames.PARTNER : this.customerTitle;
        if (!subTabGroupIndex && subTabGroupIndex !== 0) {
          if (this.cusTabGroup && this.cusTabGroup.selectedIndex !== undefined) {
            subTabGroupIndex = this.cusTabGroup.selectedIndex;
          } else {
            subTabGroupIndex = SubTabGroupTabNumbers.DETAILS;
          }
        }
        switch (subTabGroupIndex) {
          case(SubTabGroupTabNumbers.DETAILS):
            currGroup = SubTabGroupTabNames.CUSTOMER_DETAILS;
            break;
          case(SubTabGroupTabNumbers.ADDRESSES_DLV):
            currGroup = SubTabGroupTabNames.ADDRESS_DELIVERIES;
            break;
          case(SubTabGroupTabNumbers.ADDRESSES_INV):
            currGroup = SubTabGroupTabNames.ADDRESS_INVOICES;
            break;
        }
        break;
      case(TabGroupTabNumbers.ORDER):
        currTab = this.ordersTitle;
        if (!subTabGroupIndex && subTabGroupIndex !== 0) {
          if (this.ordTabGroup && this.ordTabGroup.selectedIndex !== undefined) {
            subTabGroupIndex = this.ordTabGroup.selectedIndex;
          } else {
            subTabGroupIndex = SubTabGroupTabNumbers.DETAILS;
          }
        }
        switch (subTabGroupIndex) {
          case(SubTabGroupTabNumbers.DETAILS):
            currGroup = SubTabGroupTabNames.ORDER_DETAILS;
            break;
          case(SubTabGroupTabNumbers.POSITIONS):
            currGroup = SubTabGroupTabNames.ORDER_POSITIONS;
            break;
          default:
            currGroup = SubTabGroupTabNames.ORDER_DETAILS;
            break;
        }
        break;
      case(TabGroupTabNumbers.DELIVERY_NOTE):
        currTab = this.delNotesTitle;
        if (!subTabGroupIndex && subTabGroupIndex !== 0) {
          if (this.delTabGroup && this.delTabGroup.selectedIndex !== undefined) {
            subTabGroupIndex = this.delTabGroup.selectedIndex;
          } else {
            subTabGroupIndex = SubTabGroupTabNumbers.DETAILS;
          }
        }
        switch (subTabGroupIndex) {
          case(SubTabGroupTabNumbers.DETAILS):
            currGroup = SubTabGroupTabNames.DELIVERY_NOTES_DETAILS;
            break;
          case(SubTabGroupTabNumbers.POSITIONS):
            currGroup = SubTabGroupTabNames.DELIVERY_NOTES_POSITIONS;
            break;
        }
        break;
      case(TabGroupTabNumbers.INVOICE):
        currTab = this.invoicesTitle;
        if (!subTabGroupIndex && subTabGroupIndex !== 0) {
          if (this.invTabGroup && this.invTabGroup.selectedIndex !== undefined) {
            subTabGroupIndex = this.invTabGroup.selectedIndex;
          } else {
            subTabGroupIndex = SubTabGroupTabNumbers.DETAILS;
          }
        }
        switch (subTabGroupIndex) {
          case(SubTabGroupTabNumbers.DETAILS):
            currGroup = SubTabGroupTabNames.INVOICE_DETAILS;
            break;
          case(SubTabGroupTabNumbers.POSITIONS):
            currGroup = SubTabGroupTabNames.INVOICES_POSITIONS;
            break;
        }
        break;
      case(TabGroupTabNumbers.COMMENT):
        currTab = this.commentsTitle;
        if (!subTabGroupIndex && subTabGroupIndex !== 0) {
          if (this.comTabGroup && this.comTabGroup.selectedIndex !== undefined) {
            subTabGroupIndex = this.comTabGroup.selectedIndex;
          } else {
            subTabGroupIndex = SubTabGroupTabNumbers.DETAILS;
          }
        }
        switch (subTabGroupIndex) {
          case(SubTabGroupTabNumbers.DETAILS):
            currGroup = SubTabGroupTabNames.COMMENT_DETAILS;
            break;
        }
        break;
    }
    return {currTab, currGroup};
  }

  /**
   * select tab: customers(0), orders(1), delivery notes(2), invoices(3)
   *
   * @param title: string - tab title
   * @param subTabTitle: string - sub tab title
   */
  selectTab(title: string, subTabTitle?: SubTabGroupTabNames.ORDER_DETAILS) {
    /** Info: change of selectedIndex triggers "showTableFormData()" method (set in .html file) **/
    switch (title) {
      case(this.customerTitle):
        this.tabGroup.selectedIndex = TabGroupTabNumbers.CUSTOMER;
        if (this.cusTabGroup && this.cusTabGroup.selectedIndex !== undefined) {
          this.cusTabGroup.selectedIndex = SubTabGroupTabNumbers.DETAILS;
        }
        break;
      case(this.ordersTitle):
        this.tabGroup.selectedIndex = TabGroupTabNumbers.ORDER;
        if (this.ordTabGroup && this.ordTabGroup.selectedIndex !== undefined) {
          if (subTabTitle) {
            if (subTabTitle === SubTabGroupTabNames.ORDER_DETAILS) {
              this.ordTabGroup.selectedIndex = SubTabGroupTabNumbers.DETAILS;
            } else {
              this.ordTabGroup.selectedIndex = SubTabGroupTabNumbers.POSITIONS;
            }
          } else {
            this.ordTabGroup.selectedIndex = SubTabGroupTabNumbers.DETAILS;
          }
        }
        break;
      case(this.delNotesTitle):
        this.tabGroup.selectedIndex = TabGroupTabNumbers.DELIVERY_NOTE;
        if (this.delTabGroup && this.delTabGroup.selectedIndex !== undefined) {
          this.delTabGroup.selectedIndex = SubTabGroupTabNumbers.DETAILS;
        }
        break;
      case(this.invoicesTitle):
        this.tabGroup.selectedIndex = TabGroupTabNumbers.INVOICE;
        if (this.invTabGroup && this.invTabGroup.selectedIndex !== undefined) {
          this.invTabGroup.selectedIndex = SubTabGroupTabNumbers.DETAILS;
        }
        break;
      case(this.commentsTitle):
        this.tabGroup.selectedIndex = TabGroupTabNumbers.COMMENT;
        if (this.comTabGroup && this.comTabGroup.selectedIndex !== undefined) {
          this.comTabGroup.selectedIndex = SubTabGroupTabNumbers.DETAILS;
        }
        break;
      default:
        break;
    }
    this.detectChanges();
  }

  private detectChanges(): void {
    this.cdRef.detectChanges();
  }

  /**
   * get tab group name for given referral table name
   *
   * IN: 'orders'
   * OUT: 'ORDER'
   *
   * @param refTable
   */
  getTabByRefTable(refTable: string): undefined|TabGroupTabNames {
    switch (refTable) {
      case(this.CONSTANTS.REFTABLE_CUSTOMER) :
        return TabGroupTabNames.CUSTOMER;
      case(this.CONSTANTS.REFTABLE_PARTNERS) :
        return TabGroupTabNames.PARTNER;
      case(this.CONSTANTS.REFTABLE_ORDERS) :
        return TabGroupTabNames.ORDER;
      case(this.CONSTANTS.REFTABLE_DELIVERY_NOTES) :
        return TabGroupTabNames.DELIVERY_NOTE;
      case(this.CONSTANTS.REFTABLE_INVOICE) :
        return TabGroupTabNames.INVOICE;
      case(this.CONSTANTS.REFTABLE_COMMENTS) :
        return TabGroupTabNames.COMMENT;
      default:
        return undefined;
    }
  }

  /**
   * should reset new item mode. returns boolean true, if given (selected) tab is equal with the views one.
   *
   * IN: refTable = 'orders', tabIndex = 0, tabGroupIndex = 1
   * OUT: true
   *
   * @param refTable
   * @param tabIndex
   * @param subTabGroupIndex
   */
  shouldResetNewItemMode(refTable: string, tabIndex: TabGroupTabNumbers, subTabGroupIndex: SubTabGroupTabNumbers): boolean {
    const __ret: { currTab: undefined | TabGroupTabNames, currGroup: undefined | SubTabGroupTabNames } =
      this.getTabAndTabGroup(refTable, tabIndex, subTabGroupIndex);
    let tabByRefTable: TabGroupTabNames = this.getTabByRefTable(refTable);
    return (__ret.currTab !== tabByRefTable);
  }

  /**
   * set tab group tab number to be selected
   *
   * @param number
   */
  setTabToSelect(number: TabGroupTabNumbers) {
    this.selTabGroupTab = number;
  }

  /**
   * set sub tab group tab number to be selected
   *
   * @param number
   */
  setSubTabToSelect(number: SubTabGroupTabNumbers) {
    this.selSubTabGroupTab = number;
  }
}
