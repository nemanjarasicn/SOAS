import {fakeAsync, TestBed} from '@angular/core/testing';

import {DetailViewTabGroupCustomerAddressesService} from './detail-view-tab-group-customer-addresses.service';
import {TestingModule} from "../../testing/testing.module";
import {
  ConstantsService,
  CustomerAddressTypes,
  CustomersTypes
} from "../../_services/constants.service";
import {Page, Sort} from "../custom/custom-table/page";
import {CustomersAddr} from "../../interfaces/customers-addr-item";
import {CustomersTestConstants} from "../../../assets/test-constants/customers";
import {CustomTableComponent} from "../custom/custom-table/custom-table.component";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {of} from "rxjs";
import {PaginatedDataSource} from "../custom/custom-table/paginated-datasource";
import {ArticleQuery} from "../custom/custom-table/page.service";
import createSpy = jasmine.createSpy;
import {CustomerAdrr} from "../../models/customer-addr";

describe('DetailViewTabGroupCustomerAddressesService', () => {
  let service: DetailViewTabGroupCustomerAddressesService;
  let customAddrDLVTableComponent;
  let customAddrINVTableComponent;
  let constantsService: ConstantsService;

  const sort: Sort<CustomersAddr> = {order: 'asc', property: 'CUSTOMERS_NUMBER'};
  const query: ArticleQuery = {search: '', registration: new Date()};
  const page: Page<CustomersAddr> = {
    content: CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV,
    totalElements: 0,
    size: 0,
    number: 0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [CustomTableComponent, TranslateItPipe],
      providers: [ConstantsService, CustomTableComponent, TranslateItPipe]
    });
    service = TestBed.inject(DetailViewTabGroupCustomerAddressesService);
    customAddrDLVTableComponent = new CustomTableComponent(undefined,
      undefined, undefined, undefined, undefined, undefined,
      undefined, undefined);
    service.customAddrDLVTableComponent = customAddrDLVTableComponent;
    customAddrINVTableComponent = new CustomTableComponent(undefined,
      undefined, undefined, undefined, undefined, undefined,
      undefined, undefined);
    service.customAddrINVTableComponent = customAddrINVTableComponent;

    // service.customAddrDLVTableComponent.dataSource =
    //   new PaginatedDataSource<any, any>(undefined,undefined,undefined);
    // service.customAddrINVTableComponent.dataSource =
    //   new PaginatedDataSource<any, any>(undefined,undefined,undefined);

    constantsService = TestBed.inject(ConstantsService);
    service.PAGINATOR_ELEMENTS_PER_SIDE = [14];
    service.currPageSizeMainTable = 14;
    service.addrDLVPositionsItems = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV;
    service.addrINVPositionsItems = CustomersTestConstants.CUSTOMERS_ADDRESSES_INV;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set required parameters', () => {

    // Arrange
    const refTableCustomersAddresses: string = constantsService.REFTABLE_CUSTOMER_ADDRESS_DLV;
    const paginator: number[] = [14];
    const currPageSizeMainTable: number = 14;
    const tableColumnsToHide: string[] = [constantsService.REFTABLE_CUSTOMER_ADDRESS_ADDRESS_TYPE];
    const addrDLVPositionsItems: CustomersAddr[] = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV;
    const addrINVPositionsItems: CustomersAddr[] = CustomersTestConstants.CUSTOMERS_ADDRESSES_INV;

    spyOn(service, 'setRefTableCustomersAddresses').and.callThrough();
    spyOn(service, 'setCustomAddrINVTableComponent').and.callThrough();

    // Act
    service.setRequiredParams(refTableCustomersAddresses, paginator, currPageSizeMainTable, tableColumnsToHide,
      addrDLVPositionsItems, addrINVPositionsItems, customAddrDLVTableComponent, customAddrINVTableComponent);

    // Assert
    expect(service.setRefTableCustomersAddresses).toHaveBeenCalled();
    expect(service.setCustomAddrINVTableComponent).toHaveBeenCalled();
  })

  it('should set displayedColumns', () => {

    // Arrange
    const displayedColumns: string[] = ['column'];

    // Act
    service.setDisplayedColumns(displayedColumns);

    // Assert
    expect(service.tableColumnsToDisplay).toEqual(displayedColumns);
  });

  it('should set columnsToHide', () => {

    // Arrange
    const columnsToHide: string[] = ['column'];

    // Act
    service.setColumnsToHide(columnsToHide);

    // Assert
    expect(service.tableColumnsToHide).toEqual(columnsToHide);
  });

  it('should set initialSort', () => {

    // Arrange
    const initialSort: Sort<any> = {property: 'CURRENCY_NAME', order: 'asc'};

    // Act
    service.setInitialSort(initialSort);

    // Assert
    expect(service.initialSort).toEqual(initialSort);
  });

  it('should set refTableCustomersAddresses', () => {

    // Arrange
    const refTableCustomersAddresses: string = 'refTable';

    // Act
    service.setRefTableCustomersAddresses(refTableCustomersAddresses);

    // Assert
    expect(service.refTableCustomersAddresses).toEqual(refTableCustomersAddresses);
  });

  it('should set PAGINATOR_ELEMENTS_PER_SIDE', () => {

    // Arrange
    const PAGINATOR_ELEMENTS_PER_SIDE: number[] = [14];

    // Act
    service.setPaginator(PAGINATOR_ELEMENTS_PER_SIDE);

    // Assert
    expect(service.PAGINATOR_ELEMENTS_PER_SIDE).toEqual(PAGINATOR_ELEMENTS_PER_SIDE);
  });

  it('should set currPageSizeMainTable', () => {

    // Arrange
    const currPageSizeMainTable: number = 14;

    // Act
    service.setPageSize(currPageSizeMainTable);

    // Assert
    expect(service.currPageSizeMainTable).toEqual(currPageSizeMainTable);
  });

  it('should set tableColumnsToHide', () => {

    // Arrange
    const tableColumnsToHide: string[] = ['column'];

    // Act
    service.setTableColumnsToHide(tableColumnsToHide);

    // Assert
    expect(service.tableColumnsToHide).toEqual(tableColumnsToHide);
  });

  it('should set addrDLVPositionsItems', () => {

    // Arrange
    const addrDLVPositionsItems: CustomerAdrr[] = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV;

    // Act
    service.setAddrDLVPositionsItems(addrDLVPositionsItems);

    // Assert
    expect(service.addrDLVPositionsItems).toEqual(addrDLVPositionsItems);
  });

  it('should set addrINVPositionsItems', () => {

    // Arrange
    const addrINVPositionsItems: CustomerAdrr[] = CustomersTestConstants.CUSTOMERS_ADDRESSES_INV;

    // Act
    service.setAddrINVPositionsItems(addrINVPositionsItems);

    // Assert
    expect(service.addrINVPositionsItems).toEqual(addrINVPositionsItems);
  });

  it('should set customAddrDLVTableComponent', () => {

    // Arrange
    const customAddrDLVTableComponent: CustomTableComponent = service.customAddrINVTableComponent;
    const spy = createSpy('endpoint').and.callFake(() => of(page));
    service.customAddrDLVTableComponent.dataSource = new PaginatedDataSource<CustomersAddr, ArticleQuery>(spy, sort, query);

    // Act
    service.setCustomAddrDLVTableComponent(customAddrDLVTableComponent);

    // Assert
    expect(service.customAddrDLVTableComponent).toEqual(customAddrDLVTableComponent);
  });

  it('should set customAddrINVTableComponent', () => {

    // Arrange
    const customAddrINVTableComponent: CustomTableComponent = service.customAddrINVTableComponent;
    const spy = createSpy('endpoint').and.callFake(() => of(page));
    service.customAddrINVTableComponent.dataSource = new PaginatedDataSource<CustomersAddr, ArticleQuery>(spy, sort, query);

    // Act
    service.setCustomAddrINVTableComponent(customAddrINVTableComponent);

    // Assert
    expect(service.customAddrINVTableComponent).toEqual(customAddrINVTableComponent);
  });

  it('should set searchColumn', () => {

    // Arrange
    const searchColumn: string = 'column';

    // Act
    service.setSearchColumn(searchColumn);

    // Assert
    expect(service.searchColumn).toEqual(searchColumn);
  });

  it('should set additionalSearchColumns', () => {

    // Arrange
    const additionalSearchColumns: string = 'column';

    // Act
    service.setAdditionalSearchColumns(additionalSearchColumns);

    // Assert
    expect(service.additionalSearchColumns).toEqual(additionalSearchColumns);
  });

  // setAddressesTableItems(type: string, data: CustomersAddr[], addrTableComponent: CustomTableComponent) {
  //   if (type === 'DLV') {

  it('should set DLV addresses table items', () => {

    // Arrange
    const type: string = 'DLV';
    const data: CustomersAddr[] = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV;
    const addrTableComponent: CustomTableComponent = customAddrINVTableComponent;

    // Act
    service.setAddressesTableItems(type, data, addrTableComponent);

    // Assert
    expect(service.addrDLVPositionsItems).toEqual(data);
  });

  it('should set INV addresses table items', () => {

    // Arrange
    const type: string = 'INV';
    const data: CustomersAddr[] = CustomersTestConstants.CUSTOMERS_ADDRESSES_INV;
    const addrTableComponent: CustomTableComponent = customAddrINVTableComponent;

    // Act
    service.setAddressesTableItems(type, data, addrTableComponent);

    // Assert
    expect(service.addrINVPositionsItems).toEqual(data);
  });

  it('should reset addrDLVPositionsItems', () => {

    // Arrange
    const addrDLVPositionsItems: [] = [];
    const addrTableComponent: CustomTableComponent = customAddrDLVTableComponent;
    service.setCustomAddrDLVTableComponent(addrTableComponent);
    spyOn(addrTableComponent, "resetTable").and.callThrough();

    // Act
    service.resetAddressesTableItems();

    // Assert
    expect(service.addrDLVPositionsItems).toEqual(addrDLVPositionsItems);
    expect(service.customAddrDLVTableComponent.resetTable).toHaveBeenCalled();
  });

  it('should set address table click if selected address id is set and type is DLV', fakeAsync(() => {

    // Arrange
    const addressType: CustomerAddressTypes = CustomerAddressTypes.DLV;
    const addressItems: CustomersAddr[] = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV;
    const selAddressId: string = '1';
    const customerType: CustomersTypes = CustomersTypes.B2C;
    const selCustomerNumber: string = '12345';
    service.addrDLVPositionsItems = [];
    spyOn(service, 'setAddressesTableItems').and.callThrough();
    const getDataSourceResult = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV;
    spyOn(customAddrDLVTableComponent, "getDataSource").and.returnValue(of(getDataSourceResult));

    // Act
    service.setAddressTableClick(addressType, customAddrDLVTableComponent, addressItems, selAddressId,
      customerType, selCustomerNumber);

    // tick();

    // Assert
    expect(service.setAddressesTableItems).toHaveBeenCalled();
  }));

  it('should set address table click if selected address id is set and type is INV', fakeAsync(() => {

    // Arrange
    const addressType: CustomerAddressTypes = CustomerAddressTypes.INV;
    const addressItems: CustomersAddr[] = CustomersTestConstants.CUSTOMERS_ADDRESSES_INV;
    const selAddressId: string = '1';
    const customerType: CustomersTypes = CustomersTypes.B2C;
    const selCustomerNumber: string = '12345';
    service.addrINVPositionsItems = [];
    spyOn(service, 'setAddressesTableItems').and.callThrough();
    const getDataSourceResult = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV;
    spyOn(customAddrINVTableComponent, "getDataSource").and.returnValue(of(getDataSourceResult));

    // Act
    service.setAddressTableClick(addressType, customAddrINVTableComponent, addressItems, selAddressId,
      customerType, selCustomerNumber);

    // Assert
    expect(service.setAddressesTableItems).toHaveBeenCalled();
  }));

  it('should set address table click if selected address id is not set', fakeAsync(() => {

    // Arrange
    const addressType: CustomerAddressTypes = CustomerAddressTypes.DLV;
    const addressItems: CustomersAddr[] = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV;
    const selAddressId: string = undefined;
    const customerType: CustomersTypes = CustomersTypes.B2C;
    const selCustomerNumber: string = '12345';
    service.addrDLVPositionsItems = [];
    spyOn(service, 'setAddressesTableItems').and.callThrough();
    const getDataSourceResult = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV;
    spyOn(customAddrINVTableComponent, "getDataSource").and.returnValue(of(getDataSourceResult));

    // Act
    service.setAddressTableClick(addressType, customAddrINVTableComponent, addressItems, selAddressId,
      customerType, selCustomerNumber);

    // Assert
    expect(service.setAddressesTableItems).toHaveBeenCalled();
  }));

  it('should set address table click if selected address id is not set and customer type is B2B', fakeAsync(() => {

    // Arrange
    const addressType: CustomerAddressTypes = CustomerAddressTypes.DLV;
    const addressItems: CustomersAddr[] = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV;
    const selAddressId: string = undefined;
    const customerType: CustomersTypes = CustomersTypes.B2B;
    const selCustomerNumber: string = '12345';
    service.addrDLVPositionsItems = [];
    spyOn(service, 'setAddressesTableItems').and.callThrough();
    const getDataSourceResult = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV;
    spyOn(customAddrINVTableComponent, "getDataSource").and.returnValue(of(getDataSourceResult));

    // Act
    service.setAddressTableClick(addressType, customAddrINVTableComponent, addressItems, selAddressId,
      customerType, selCustomerNumber);

    // Assert
    expect(service.setAddressesTableItems).toHaveBeenCalled();
  }));

  it('should set address table click if address items are not set and customer type is undefined', fakeAsync(() => {

    // Arrange
    const addressType: CustomerAddressTypes = CustomerAddressTypes.DLV;
    const addressItems: CustomersAddr[] = undefined;
    const selAddressId: string = undefined;
    const customerType: CustomersTypes = undefined;
    const selCustomerNumber: string = '12345';
    spyOn(service, 'setAddressesTableItems').and.callThrough();
    spyOn(customAddrINVTableComponent, "resetTable").and.callThrough();

    // Act
    service.setAddressTableClick(addressType, customAddrINVTableComponent, addressItems, selAddressId,
      customerType, selCustomerNumber);

    // Assert
    expect(service.setAddressesTableItems).toHaveBeenCalled();
    expect(customAddrINVTableComponent.resetTable).toHaveBeenCalled();
  }));

  it('should set address table click if address items are not set and customer type is B2C', fakeAsync(() => {

    // Arrange
    const addressType: CustomerAddressTypes = CustomerAddressTypes.DLV;
    const addressItems: CustomersAddr[] = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV;
    const selAddressId: string = undefined;
    const customerType: CustomersTypes = CustomersTypes.B2C;
    const selCustomerNumber: string = '12345';
    spyOn(service, 'setAddressesTableItems').and.callThrough();
    spyOn(localStorage, 'getItem').and.returnValue(undefined);
    spyOn(customAddrINVTableComponent, 'getDataSource').and.returnValue(of(CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV));

    // Act
    service.setAddressTableClick(addressType, customAddrINVTableComponent, addressItems, selAddressId,
      customerType, selCustomerNumber);

    // Assert
    expect(service.setAddressesTableItems).toHaveBeenCalled();
  }));

  it('should set address table click if address items are not set and customer type is B2B', fakeAsync(() => {

    // Arrange
    const addressType: CustomerAddressTypes = CustomerAddressTypes.DLV;
    const addressItems: CustomersAddr[] = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV;
    const selAddressId: string = undefined;
    const customerType: CustomersTypes = CustomersTypes.B2B;
    const selCustomerNumber: string = '12345';
    spyOn(service, 'setAddressesTableItems').and.callThrough();
    spyOn(localStorage, 'getItem').and.returnValue(undefined);
    spyOn(customAddrINVTableComponent, 'getDataSource').and.returnValue(of(CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV));

    // Act
    service.setAddressTableClick(addressType, customAddrINVTableComponent, addressItems, selAddressId,
      customerType, selCustomerNumber);

    // Assert
    expect(service.setAddressesTableItems).toHaveBeenCalled();
  }));

  it('should reset address table items', () => {

    // Arrange
    const addrDLVPositionsItems: [] = [];
    const addrINVPositionsItems: [] = [];
    const spy = createSpy('endpoint').and.callFake(() => of(page));
    service.customAddrDLVTableComponent.dataSource = new PaginatedDataSource<CustomersAddr, ArticleQuery>(spy, sort, query);
    service.customAddrINVTableComponent.dataSource = new PaginatedDataSource<CustomersAddr, ArticleQuery>(spy, sort, query);
    spyOn(service.customAddrDLVTableComponent, "resetTable").and.callThrough();
    spyOn(service.customAddrINVTableComponent, "resetTable").and.callThrough();

    // Act
    service.resetAddressesTableItems();

    // Assert
    expect(service.addrDLVPositionsItems).toEqual(addrDLVPositionsItems);
    expect(service.addrINVPositionsItems).toEqual(addrINVPositionsItems);
    expect(service.customAddrDLVTableComponent.resetTable).toHaveBeenCalled();
    expect(service.customAddrINVTableComponent.resetTable).toHaveBeenCalled();
  });

});
