import {Injectable, ViewChild} from '@angular/core';
import {CustomTableComponent} from '../custom/custom-table/custom-table.component';
import {CustomersAddr} from '../../interfaces/customers-addr-item';
import {
  ComponentViewTypes,
  ConstantsService,
  CustomerAddressTypes, CustomersTypes, SoasModel,
  ViewQueryTypes
} from '../../_services/constants.service';
import {Observable} from 'rxjs';
import {FormService} from '../../_services/form.service';
import {Sort} from '../custom/custom-table/page';
import {FetchDataService} from '../../_services/fetch-data.service';
import {TableDataService} from '../../_services/table-data.service';

@Injectable({
  providedIn: 'root'
})

/**
 * DetailViewTabGroupCustomerAddressesService - a service for detail view tab group component view to manage
 * customer addresses
 *
 * Used by: DetailViewTabGroupComponent
 */
export class DetailViewTabGroupCustomerAddressesService {

  refTableCustomersAddresses: string;

  tableColumnsToDisplay: string[];
  tableColumnsToHide: string[];
  initialSort: Sort<CustomersAddr>;
  addrDLVPositionsItems: CustomersAddr[];
  addrINVPositionsItems: CustomersAddr[];

  // column name to search by
  searchColumn: string;
  // additional column name to search by
  additionalSearchColumns: string;

  PAGINATOR_ELEMENTS_PER_SIDE: number[];
  currPageSizeMainTable: number;

  @ViewChild(CustomTableComponent) customAddrDLVTableComponent !: CustomTableComponent;
  @ViewChild(CustomTableComponent) customAddrINVTableComponent !: CustomTableComponent;

  constructor(public CONSTANTS: ConstantsService,
              private formService: FormService,
              private fetchDataService: FetchDataService,
              private tableDataService: TableDataService) {
    this.tableColumnsToDisplay = [];
    this.tableColumnsToHide = [];
  }

  setRequiredParams(refTableCustomersAddresses: string, paginator: number[], currPageSizeMainTable: number,
                    tableColumnsToHide: string[], addrDLVPositionsItems: CustomersAddr[],
                    addrINVPositionsItems: CustomersAddr[], customAddrDLVTableComponent: CustomTableComponent,
                    customAddrINVTableComponent: CustomTableComponent) {
    this.setRefTableCustomersAddresses(refTableCustomersAddresses);
    this.setPaginator(paginator);
    this.setPageSize(currPageSizeMainTable);
    this.setTableColumnsToHide(tableColumnsToHide);
    this.setAddrDLVPositionsItems(addrDLVPositionsItems);
    this.setAddrINVPositionsItems(addrINVPositionsItems);
    this.setCustomAddrDLVTableComponent(customAddrDLVTableComponent);
    this.setCustomAddrINVTableComponent(customAddrINVTableComponent);
  }

  setDisplayedColumns(columns: string[]) {
    this.tableColumnsToDisplay = columns;
  }

  setColumnsToHide(columns: string[]) {
    this.tableColumnsToHide = columns;
  }

  setInitialSort(sort: Sort<CustomersAddr>) {
    this.initialSort = sort;
  }

  setRefTableCustomersAddresses(table: string) {
    this.refTableCustomersAddresses = table;
  }

  setPaginator(paginator: number[]) {
    this.PAGINATOR_ELEMENTS_PER_SIDE = paginator;
  }

  setPageSize(pageSize: number) {
    this.currPageSizeMainTable = pageSize;
  }

  setTableColumnsToHide(columns: string[]) {
    this.tableColumnsToHide = columns;
  }

  setAddrDLVPositionsItems(positionsItems: CustomersAddr[]) {
    this.addrDLVPositionsItems = positionsItems;
  }

  setAddrINVPositionsItems(positionsItems: CustomersAddr[]) {
    this.addrINVPositionsItems = positionsItems;
  }

  setCustomAddrDLVTableComponent(component: CustomTableComponent) {
    this.customAddrDLVTableComponent = component;
  }

  setCustomAddrINVTableComponent(component: CustomTableComponent) {
    this.customAddrINVTableComponent = component;
  }

  // column name to search by
  setSearchColumn(column: string) {
    this.searchColumn = column;
  }

  // additional column name to search by
  setAdditionalSearchColumns(columns: string) {
    this.additionalSearchColumns = columns;
  }

  /**
   * set address table click
   *
   * @param addressType
   * @param addressTableComponent
   * @param addressItems
   * @param selAddressId
   * @param customerType
   * @param selCustomerNumber
   * @private
   */
  public async setAddressTableClick(addressType: CustomerAddressTypes, addressTableComponent: CustomTableComponent,
                                    addressItems: CustomersAddr[], selAddressId: string,
                                    customerType: CustomersTypes, selCustomerNumber: string) {
    if (addressTableComponent) {
      // Set address positions items
      this.setAddressesTableItems(addressType, addressItems, addressTableComponent);
      // If current referral table is not customers/partners, then get address data by customers type
      if (!selAddressId && customerType) {
        if (customerType === CustomersTypes.B2C) {
          selAddressId = (addressType === CustomerAddressTypes.DLV) ?
            localStorage.getItem(this.CONSTANTS.LS_SEL_CUSTOMER_ADDRESSES_DLV_ID) :
            localStorage.getItem(this.CONSTANTS.LS_SEL_CUSTOMER_ADDRESSES_INV_ID);
        } else if (customerType === CustomersTypes.B2B) {
          selAddressId = (addressType === CustomerAddressTypes.DLV) ?
            localStorage.getItem(this.CONSTANTS.LS_SEL_PARTNER_ADDRESSES_DLV_ID) :
            localStorage.getItem(this.CONSTANTS.LS_SEL_PARTNER_ADDRESSES_INV_ID);
        }
      }
      // set customer address, if it not set yet => select first item
      if (!selAddressId && (addressItems && addressItems.length && Object.keys(addressItems[0]).length)) {
        selAddressId = addressItems[0].ID.toString();
        if (customerType === CustomersTypes.B2C) {
          localStorage.setItem((addressType === CustomerAddressTypes.DLV) ? this.CONSTANTS.LS_SEL_CUSTOMER_ADDRESSES_DLV_ID :
            this.CONSTANTS.LS_SEL_CUSTOMER_ADDRESSES_INV_ID, selAddressId);
        } else if (customerType === CustomersTypes.B2B) {
          localStorage.setItem((addressType === CustomerAddressTypes.DLV) ? this.CONSTANTS.LS_SEL_PARTNER_ADDRESSES_DLV_ID :
            this.CONSTANTS.LS_SEL_PARTNER_ADDRESSES_INV_ID, selAddressId);
        }
      }
      if (selAddressId) {
        this.initialSort = {property: 'CUSTOMERS_NUMBER', order: 'asc'};
        addressTableComponent.setPageParams(this.refTableCustomersAddresses,
          this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN, selCustomerNumber,
          this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_ADDRESS_TYPE, (addressType === CustomerAddressTypes.DLV) ?
            this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_COLUMN : this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV_COLUMN,
          'CUSTOMERS_NUMBER', 'NAME_ADDR,ADDRESS_CRYNAME,ADDRESS_STREET,ADDRESS_CITY',
          this.tableColumnsToDisplay, ViewQueryTypes.DETAIL_TABLE);
        addressTableComponent.setPaginator(this.PAGINATOR_ELEMENTS_PER_SIDE);
        addressTableComponent.setPageSize(this.currPageSizeMainTable);
        addressTableComponent.setTableColumnsToHide(this.tableColumnsToHide);
        addressTableComponent.setPaginatedDataSource(this.currPageSizeMainTable);
        addressTableComponent.setSelectionModel();
        let obsData: Observable<any> = addressTableComponent.getDataSource();
        obsData.subscribe(async (data: CustomersAddr[]) => {
          this.setAddressesTableItems(addressType, data, addressTableComponent);
          // find and select local storage or first item...
          let index: number;
          if (selAddressId) {
            for (let item in data) {
              if (data.hasOwnProperty(item)) {
                if (data[item].hasOwnProperty(this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_ID) &&
                  (data[item][this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_ID].toString() === selAddressId)) {
                  index = parseInt(item);
                  break;
                }
              }
            }
          }
          const selRow: SoasModel = index !== undefined ? data[index] : undefined; // isLSItemSet ? data[0} : undefined
          addressTableComponent.setSelTableRow(selRow, index);
          // fake a call from dynamic form to load detail view setup function...
          this.fetchDataService.setDataObs(selRow, index, ComponentViewTypes.DynamicForm);
          return true;
        });
        if (addressType === CustomerAddressTypes.DLV) {
          await this.initCustomAddrDLVTableClick();
        } else {
          await this.initCustomAddrINVTableClick();
        }
      } else {
        addressTableComponent.resetTable();
        console.log('selAddrId is empty! May be a new customer without addresses...');
        // throw new Error('selAddrId is empty! May be a new customer without addresses...');
      }
    }
  }

  /**
   * set addresses table items
   *
   * @param type
   * @param data
   * @param addrTableComponent
   */
  public setAddressesTableItems(type: string, data: CustomersAddr[], addrTableComponent: CustomTableComponent) {
    if (type === 'DLV') {
      this.addrDLVPositionsItems = [];
      this.addrDLVPositionsItems = data;
      addrTableComponent.items = this.addrDLVPositionsItems;
    } else {
      this.addrINVPositionsItems = [];
      this.addrINVPositionsItems = data;
      addrTableComponent.items = this.addrINVPositionsItems;
    }
  }

  private async initCustomAddrDLVTableClick() {
    if (this.customAddrDLVTableComponent) {
      if (!this.customAddrDLVTableComponent.setClickedRow) {
        this.customAddrDLVTableComponent.setClickedRow = await this.getCustAddrClickedRow(CustomerAddressTypes.DLV);
      }
    }
  }

  private async initCustomAddrINVTableClick() {
    if (this.customAddrINVTableComponent) {
      if (!this.customAddrINVTableComponent.setClickedRow) {
        this.customAddrINVTableComponent.setClickedRow = await this.getCustAddrClickedRow(CustomerAddressTypes.INV);
      }
    }
  }

  /**
   * get customer address clicked row method
   *
   * @param type
   * @private
   */
  private getCustAddrClickedRow(type: string) {
    let self = this;
    return async function (tableRow: any, selectionIndex: number) {
      let selRefTable: string = localStorage.getItem(self.CONSTANTS.LS_SEL_REF_TABLE);
      if (selRefTable === self.CONSTANTS.REFTABLE_CUSTOMER) {
        localStorage.setItem((type === 'DLV') ? self.CONSTANTS.LS_SEL_CUSTOMER_ADDRESSES_DLV_ID :
          self.CONSTANTS.LS_SEL_CUSTOMER_ADDRESSES_INV_ID, tableRow['ID']);
      } else if (selRefTable === self.CONSTANTS.REFTABLE_PARTNERS) {
        localStorage.setItem((type === 'DLV') ? self.CONSTANTS.LS_SEL_PARTNER_ADDRESSES_DLV_ID :
          self.CONSTANTS.LS_SEL_PARTNER_ADDRESSES_INV_ID, tableRow['ID']);
      }
      await self.tableDataService.removeAllTableLocks(true, "", "");
      // Call function selectTableItem of custom-table-component
      if (type === 'DLV') {
        if (self.customAddrDLVTableComponent) {
          self.customAddrDLVTableComponent.selTableRow = tableRow;
          if (self.customAddrINVTableComponent) {
            // self.customAddrINVTableComponent.destroyFetchDataService();
          }
          // self.customAddrDLVTableComponent.selectTableItem(rowNumberToSelect, self.allowMultiSelect);
          self.customAddrDLVTableComponent.selTableRow = tableRow;
          self.customAddrDLVTableComponent.selectionIndex = selectionIndex;
          self.customAddrDLVTableComponent.sendServiceResult();
          // self.customAddrDLVTableComponent.setSelectionModel();
        }
      } else {
        if (self.customAddrINVTableComponent) {
          self.customAddrINVTableComponent.selTableRow = tableRow;
          if (self.customAddrDLVTableComponent) {
            // self.customAddrDLVTableComponent.destroyFetchDataService();
          }
          // self.customAddrINVTableComponent.selectTableItem(rowNumberToSelect, self.allowMultiSelect);
          self.customAddrINVTableComponent.selTableRow = tableRow;
          self.customAddrINVTableComponent.selectionIndex = selectionIndex;
          self.customAddrINVTableComponent.sendServiceResult();
        }
      }
    }
  }

  /**
   * reset addresses table items
   *
   * @private
   */
  public resetAddressesTableItems() {
    this.addrDLVPositionsItems = [];
    if (this.customAddrDLVTableComponent) {
      this.customAddrDLVTableComponent.items = this.addrDLVPositionsItems;
      this.customAddrDLVTableComponent.resetTable();
    }
    this.addrINVPositionsItems = [];
    if (this.customAddrINVTableComponent) {
      this.customAddrINVTableComponent.items = this.addrINVPositionsItems;
      this.customAddrINVTableComponent.resetTable();
    }
  }
}
