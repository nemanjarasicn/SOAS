import { TestBed } from '@angular/core/testing';

import { DetailViewTabGroupLoadService } from './detail-view-tab-group-load.service';
import {TestingModule} from "../../testing/testing.module";
import {ConstantsService, CustomersTypes, SubTabGroupTabNames} from "../../_services/constants.service";
import {DetailViewTabGroupTabsService} from "./detail-view-tab-group-tabs.service";
import {DetailViewTabGroupPositionsService} from "./detail-view-tab-group-positions.service";
import {OrdersTestConstants} from "../../../assets/test-constants/orders";
import {Orders} from "../../models/orders";
import {FormService} from "../../_services/form.service";
import {CustomersTestConstants} from "../../../assets/test-constants/customers";
import {DeliveryNotesTestConstants} from "../../../assets/test-constants/delivery-notes";
import {InvoicesTestConstants} from "../../../assets/test-constants/invoices";
import {Customer} from "../../models/customer";
import {DeliveryNotes} from "../../models/delivery-notes";
import {Invoices} from "../../models/invoices";

describe('DetailViewTabGroupLoadService', () => {
  let service: DetailViewTabGroupLoadService;
  let constantsService: ConstantsService;
  let tabsService: DetailViewTabGroupTabsService;
  let positionsService: DetailViewTabGroupPositionsService;
  let formService: FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ConstantsService, DetailViewTabGroupTabsService, DetailViewTabGroupPositionsService, FormService]
    });
    service = TestBed.inject(DetailViewTabGroupLoadService);
    constantsService = TestBed.inject(ConstantsService);
    tabsService = TestBed.inject(DetailViewTabGroupTabsService);
    positionsService = TestBed.inject(DetailViewTabGroupPositionsService);
    formService = TestBed.inject(FormService);
  });

  afterEach(() => {
    // Workaround to have selected table row should be reset
    service.refTable = undefined;
    service.selTableRow = undefined; // JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_ITEM));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set required params', function() {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS;
    const refTableCustomersAddresses: string = constantsService.REFTABLE_CUSTOMER_ADDRESS_DLV;
    const selTableRow: Orders = OrdersTestConstants.ORDERS_ITEM;
    const newCustomerAddrDLVMode: boolean = false;
    const newCustomerMode: boolean = false;
    const newCustomerAddrINVMode: boolean = false;
    const newOrderMode: boolean = false;
    const newOrderPositionMode: boolean = false;

    // Act
    service.setRequiredParams(refTable, refTableCustomersAddresses, tabsService, positionsService, selTableRow,
      newCustomerAddrDLVMode, newCustomerMode, newCustomerAddrINVMode, newOrderMode, newOrderPositionMode);

    // Assert
    expect(service.refTable).toEqual(refTable);
    expect(service.secondaryRefTable).toEqual(refTableCustomersAddresses);
    expect(service.tabsService).toEqual(tabsService);
    expect(service.positionsService).toEqual(positionsService);
    expect(service.selTableRow).toEqual(selTableRow);
    expect(service.newCustomerAddrDLVMode).toEqual(newCustomerAddrDLVMode);
    expect(service.newCustomerMode).toEqual(newCustomerMode);
    expect(service.newCustomerAddrINVMode).toEqual(newCustomerAddrINVMode);
    expect(service.newOrderMode).toEqual(newOrderMode);
    expect(service.newOrderPositionMode).toEqual(newOrderPositionMode);

  });

  it('should get param data for loading for customer details', function() {

    // Arrange
    const paramsSubTabName: SubTabGroupTabNames = SubTabGroupTabNames.CUSTOMER_DETAILS;
    const paramsLockedRefTable: string = constantsService.REFTABLE_CUSTOMER;
    const paramsTablePrimaryColumn: string = constantsService.REFTABLE_CUSTOMER_COLUMN;
    const paramsTablePrimaryValue: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_NUMBER;
    const paramsCustomerType: CustomersTypes = CustomersTypes.B2C;
    const paramsTableSecondColumn: string = constantsService.REFTABLE_CUSTOMER_CUSTOMERS_TYPE;
    const paramsTableSecondValue: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_TYPE;
    const paramsFormSecondColumn: string = constantsService.REFTABLE_CUSTOMER_COLUMN;
    const paramsFormSecondValue: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_NUMBER;
    const paramsPrimaryRefTable: undefined | string = undefined;
    formService.selItemRefTableTitle = constantsService.REFTABLE_CUSTOMER;
    service.newOrderMode = false;
    service.selTableRow = CustomersTestConstants.CUSTOMER_B2C_ITEM;
    service.refTable = constantsService.REFTABLE_CUSTOMER;

    const resultPrimaryRefTable: undefined | string = constantsService.REFTABLE_CUSTOMER;
    const resultTablePrimaryColumn: string = constantsService.REFTABLE_CUSTOMER_COLUMN;
    const resultTablePrimaryValue: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_NUMBER;
    const resultCustomerType: CustomersTypes = CustomersTypes.B2C;
    const resultFormSecondColumn: undefined|string = undefined;
    const resultFormSecondValue: undefined|string = undefined;
    const resultSecondaryRefTable: undefined|string = constantsService.REFTABLE_CUSTOMER;
    spyOn(localStorage, 'getItem').and.returnValue(CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_NUMBER);

    // Act
    const result: {
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
    } = service.getParamDataForLoading(paramsSubTabName, paramsLockedRefTable, paramsTablePrimaryColumn,
      paramsTablePrimaryValue, paramsCustomerType, paramsTableSecondColumn, paramsTableSecondValue,
      paramsFormSecondColumn, paramsFormSecondValue, paramsPrimaryRefTable);

    // Assert
    expect(result.lockedRefTable).toEqual(paramsLockedRefTable);
    expect(result.tablePrimaryColumn).toEqual(resultTablePrimaryColumn);
    expect(result.tablePrimaryValue).toEqual(resultTablePrimaryValue);
    expect(result.customerType).toEqual(resultCustomerType);
    expect(result.tableSecondColumn).toEqual(paramsTableSecondColumn);
    expect(result.tableSecondValue).toEqual(paramsTableSecondValue);
    expect(result.formSecondColumn).toEqual(resultFormSecondColumn);
    expect(result.formSecondValue).toEqual(resultFormSecondValue);
    expect(result.primaryRefTable).toEqual(resultPrimaryRefTable);
    expect(result.secondaryRefTable).toEqual(resultSecondaryRefTable);

  });

  it('should get param data for loading for customer address deliveries', function() {

    // Arrange
    const paramsSubTabName: SubTabGroupTabNames = SubTabGroupTabNames.ADDRESS_DELIVERIES;
    const paramsLockedRefTable: string = constantsService.REFTABLE_CUSTOMER;
    const paramsTablePrimaryColumn: string = constantsService.REFTABLE_CUSTOMER_ADDRESS_DLV_ID;
    const paramsTablePrimaryValue: string = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV[0].ID.toString();
    const paramsCustomerType: CustomersTypes = CustomersTypes.B2C;
    const paramsTableSecondColumn: string = constantsService.REFTABLE_CUSTOMER_ADDRESS_ADDRESS_TYPE;
    const paramsTableSecondValue: string = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV[0].ADDRESS_TYPE.toString();
    const paramsFormSecondColumn: string = constantsService.REFTABLE_CUSTOMER_ADDRESS_DLV_ID;
    const paramsFormSecondValue: string = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV[0].ID.toString();
    const paramsPrimaryRefTable: undefined | string = undefined;
    formService.selItemRefTableTitle = constantsService.REFTABLE_CUSTOMER;
    service.newOrderMode = false;
    service.selTableRow = CustomersTestConstants.CUSTOMER_B2C_ITEM;
    service.refTable = constantsService.REFTABLE_CUSTOMER;

    const resultPrimaryRefTable: undefined | string = constantsService.REFTABLE_CUSTOMER_ADDRESS_DLV;
    const resultTablePrimaryColumn: string = constantsService.REFTABLE_CUSTOMER_COLUMN;
    const resultTablePrimaryValue: string = CustomersTestConstants.CUSTOMERS_ADDRESSES_DLV[0].ID.toString();
    const resultCustomerType: CustomersTypes = CustomersTypes.B2C;
    const resultFormSecondColumn: undefined|string = constantsService.REFTABLE_CUSTOMER_ADDRESS_DLV_ID;
    const resultFormSecondValue: undefined|string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_NUMBER;
    const resultSecondaryRefTable: undefined|string = constantsService.REFTABLE_CUSTOMER_ADDRESS_DLV;
    spyOn(localStorage, 'getItem').and.returnValue(CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_NUMBER);

    // Act
    const result: {
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
    } = service.getParamDataForLoading(paramsSubTabName, paramsLockedRefTable, paramsTablePrimaryColumn,
      paramsTablePrimaryValue, paramsCustomerType, paramsTableSecondColumn, paramsTableSecondValue,
      paramsFormSecondColumn, paramsFormSecondValue, paramsPrimaryRefTable);

    // Assert
    expect(result.lockedRefTable).toEqual(paramsLockedRefTable);
    expect(result.tablePrimaryColumn).toEqual(resultTablePrimaryColumn);
    expect(result.tablePrimaryValue).toEqual(resultTablePrimaryValue);
    expect(result.customerType).toEqual(resultCustomerType);
    expect(result.tableSecondColumn).toEqual(paramsTableSecondColumn);
    expect(result.tableSecondValue).toEqual(paramsTableSecondValue);
    expect(result.formSecondColumn).toEqual(resultFormSecondColumn);
    expect(result.formSecondValue).toEqual(resultFormSecondValue);
    expect(result.primaryRefTable).toEqual(resultPrimaryRefTable);
    expect(result.secondaryRefTable).toEqual(resultSecondaryRefTable);

  });

  it('should get param data for loading for customer address invoices', function() {

    // Arrange
    const paramsSubTabName: SubTabGroupTabNames = SubTabGroupTabNames.ADDRESS_INVOICES;
    const paramsLockedRefTable: string = constantsService.REFTABLE_CUSTOMER;
    const paramsTablePrimaryColumn: string = constantsService.REFTABLE_CUSTOMER_ADDRESS_INV_ID;
    const paramsTablePrimaryValue: string = CustomersTestConstants.CUSTOMERS_ADDRESSES_INV[0].ID.toString();
    const paramsCustomerType: CustomersTypes = CustomersTypes.B2C;
    const paramsTableSecondColumn: string = constantsService.REFTABLE_CUSTOMER_ADDRESS_ADDRESS_TYPE;
    const paramsTableSecondValue: string = CustomersTestConstants.CUSTOMERS_ADDRESSES_INV[0].ADDRESS_TYPE.toString();
    const paramsFormSecondColumn: string = constantsService.REFTABLE_CUSTOMER_ADDRESS_INV_ID;
    const paramsFormSecondValue: string = CustomersTestConstants.CUSTOMERS_ADDRESSES_INV[0].ID.toString();
    const paramsPrimaryRefTable: undefined | string = undefined;
    formService.selItemRefTableTitle = constantsService.REFTABLE_CUSTOMER;
    service.newOrderMode = false;
    service.selTableRow = CustomersTestConstants.CUSTOMER_B2C_ITEM;
    service.refTable = constantsService.REFTABLE_CUSTOMER;

    const resultPrimaryRefTable: undefined | string = constantsService.REFTABLE_CUSTOMER_ADDRESS_INV;
    const resultTablePrimaryColumn: string = constantsService.REFTABLE_CUSTOMER_COLUMN;
    const resultTablePrimaryValue: string = CustomersTestConstants.CUSTOMERS_ADDRESSES_INV[0].ID.toString();
    const resultCustomerType: CustomersTypes = CustomersTypes.B2C;
    const resultFormSecondColumn: undefined|string = constantsService.REFTABLE_CUSTOMER_ADDRESS_INV_ID;
    const resultFormSecondValue: undefined|string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_NUMBER;
    const resultSecondaryRefTable: undefined|string = constantsService.REFTABLE_CUSTOMER_ADDRESS_INV;
    spyOn(localStorage, 'getItem').and.returnValue(CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_NUMBER);

    // Act
    const result: {
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
    } = service.getParamDataForLoading(paramsSubTabName, paramsLockedRefTable, paramsTablePrimaryColumn,
      paramsTablePrimaryValue, paramsCustomerType, paramsTableSecondColumn, paramsTableSecondValue,
      paramsFormSecondColumn, paramsFormSecondValue, paramsPrimaryRefTable);

    // Assert
    expect(result.lockedRefTable).toEqual(paramsLockedRefTable);
    expect(result.tablePrimaryColumn).toEqual(resultTablePrimaryColumn);
    expect(result.tablePrimaryValue).toEqual(resultTablePrimaryValue);
    expect(result.customerType).toEqual(resultCustomerType);
    expect(result.tableSecondColumn).toEqual(paramsTableSecondColumn);
    expect(result.tableSecondValue).toEqual(paramsTableSecondValue);
    expect(result.formSecondColumn).toEqual(resultFormSecondColumn);
    expect(result.formSecondValue).toEqual(resultFormSecondValue);
    expect(result.primaryRefTable).toEqual(resultPrimaryRefTable);
    expect(result.secondaryRefTable).toEqual(resultSecondaryRefTable);

  });

  it('should get param data for loading for order details', function() {

    // Arrange
    const paramsSubTabName: SubTabGroupTabNames = JSON.parse(JSON.stringify(SubTabGroupTabNames.ORDER_DETAILS));
    const paramsLockedRefTable: string = constantsService.REFTABLE_ORDERS;
    const paramsTablePrimaryColumn: string = constantsService.REFTABLE_ORDERS_CLIENT_COLUMN;
    const paramsTablePrimaryValue: string = constantsService.CLIENT_B2C;
    const paramsCustomerType: CustomersTypes = CustomersTypes.B2C;
    const paramsTableSecondColumn: string = constantsService.REFTABLE_ORDERS_CLIENT_COLUMN;
    const paramsTableSecondValue: string = constantsService.CLIENT_B2C;
    const paramsFormSecondColumn: string = constantsService.REFTABLE_ORDERS_COLUMN;
    const paramsFormSecondValue: string =  OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER;
    const paramsPrimaryRefTable: undefined | string = undefined;
    formService.selItemRefTableTitle = constantsService.REFTABLE_ORDERS;
    service.newOrderMode = false;
    service.selTableRow = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_ITEM));
    service.refTable = constantsService.REFTABLE_ORDERS;

    const resultPrimaryRefTable: undefined | string = constantsService.REFTABLE_ORDERS;
    const resultTablePrimaryColumn: string = constantsService.REFTABLE_ORDERS_COLUMN;
    const resultTablePrimaryValue: string = OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER;
    const resultCustomerType: CustomersTypes = CustomersTypes.B2C;
    const resultFormSecondColumn: undefined|string = undefined;
    const resultFormSecondValue: undefined|string = undefined;
    const resultSecondaryRefTable: undefined|string = constantsService.REFTABLE_ORDERS;
    spyOn(localStorage, 'getItem').and.returnValue(OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER);

    // Act
    const result: {
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
    } = service.getParamDataForLoading(paramsSubTabName, paramsLockedRefTable, paramsTablePrimaryColumn,
      paramsTablePrimaryValue, paramsCustomerType, paramsTableSecondColumn, paramsTableSecondValue,
      paramsFormSecondColumn, paramsFormSecondValue, paramsPrimaryRefTable);

    // Assert
    expect(result.lockedRefTable).toEqual(paramsLockedRefTable);
    expect(result.tablePrimaryColumn).toEqual(resultTablePrimaryColumn);
    expect(result.tablePrimaryValue).toEqual(resultTablePrimaryValue);
    expect(result.customerType).toEqual(resultCustomerType);
    expect(result.tableSecondColumn).toEqual(paramsTableSecondColumn);
    expect(result.tableSecondValue).toEqual(paramsTableSecondValue);
    expect(result.formSecondColumn).toEqual(resultFormSecondColumn);
    expect(result.formSecondValue).toEqual(resultFormSecondValue);
    expect(result.primaryRefTable).toEqual(resultPrimaryRefTable);
    expect(result.secondaryRefTable).toEqual(resultSecondaryRefTable);

  });

  it('should get param data for loading for order positions', function() {

    // Arrange
    const paramsSubTabName: SubTabGroupTabNames = JSON.parse(JSON.stringify(SubTabGroupTabNames.ORDER_POSITIONS));
    const paramsLockedRefTable: string = constantsService.REFTABLE_ORDERS;
    const paramsTablePrimaryColumn: string = constantsService.REFTABLE_ORDERS_CLIENT_COLUMN;
    const paramsTablePrimaryValue: string = CustomersTestConstants.CUSTOMERS_ADDRESSES_INV[0].ID.toString();
    const paramsCustomerType: CustomersTypes = CustomersTypes.B2C;
    const paramsTableSecondColumn: string = constantsService.REFTABLE_ORDERS_CLIENT_COLUMN;
    const paramsTableSecondValue: string = constantsService.CLIENT_B2C;
    const paramsFormSecondColumn: string = constantsService.REFTABLE_ORDERS_COLUMN;
    const paramsFormSecondValue: string =  JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER));
    const paramsPrimaryRefTable: undefined | string = undefined;
    formService.selItemRefTableTitle = constantsService.REFTABLE_ORDERS;
    service.newOrderMode = false;
    service.selTableRow = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_ITEM));
    service.refTable = constantsService.REFTABLE_ORDERS;
    service.positionsService = positionsService;

    const resultPrimaryRefTable: undefined | string = constantsService.REFTABLE_ORDERS_POSITIONS;
    const resultTablePrimaryColumn: string = constantsService.REFTABLE_ORDERS_COLUMN;
    const resultTablePrimaryValue: string = OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER;
    const resultCustomerType: CustomersTypes = CustomersTypes.B2C;
    const resultFormSecondColumn: undefined|string = constantsService.REFTABLE_ORDERS_COLUMN;
    const resultFormSecondValue: undefined|string = OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER;
    const resultSecondaryRefTable: undefined|string = constantsService.REFTABLE_ORDERS_POSITIONS;
    const resultOrderPositionCols: { cols: any[], dialogCols: any[] } =
      {
        cols:
          [{field: 'ID', header: 'ID', disabled: true, readonly: true, size: 10, width: '15%'}],
        dialogCols:
          [{field: 'ORDERS_NUMBER', header: 'ORDERS_NUMBER', disabled: true, size: 50}]
      };
    spyOn(positionsService,'getOrderPositionCols').and.returnValue(resultOrderPositionCols);
    spyOn(localStorage, 'getItem').and.returnValue(OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER);
    spyOn(service,'getCustomerType').and.callThrough();

    // Act
    const result: {
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
    } = service.getParamDataForLoading(paramsSubTabName, paramsLockedRefTable, paramsTablePrimaryColumn,
      paramsTablePrimaryValue, paramsCustomerType, paramsTableSecondColumn, paramsTableSecondValue,
      paramsFormSecondColumn, paramsFormSecondValue, paramsPrimaryRefTable);

    // Assert
    expect(result.lockedRefTable).toEqual(paramsLockedRefTable);
    expect(result.tablePrimaryColumn).toEqual(resultTablePrimaryColumn);
    expect(result.tablePrimaryValue).toEqual(resultTablePrimaryValue);
    expect(result.customerType).toEqual(resultCustomerType);
    expect(result.tableSecondColumn).toEqual(paramsTableSecondColumn);
    expect(result.tableSecondValue).toEqual(paramsTableSecondValue);
    expect(result.formSecondColumn).toEqual(resultFormSecondColumn);
    expect(result.formSecondValue).toEqual(resultFormSecondValue);
    expect(result.primaryRefTable).toEqual(resultPrimaryRefTable);
    expect(result.secondaryRefTable).toEqual(resultSecondaryRefTable);
    expect(positionsService.getOrderPositionCols).toHaveBeenCalled();
    expect(service.getCustomerType).toHaveBeenCalled();

  });

  it('should get param data for loading for delivery notes details', function() {

    // Arrange
    const paramsSubTabName: SubTabGroupTabNames = SubTabGroupTabNames.DELIVERY_NOTES_DETAILS;
    const paramsLockedRefTable: string = constantsService.REFTABLE_DELIVERY_NOTES;
    const paramsTablePrimaryColumn: string = constantsService.REFTABLE_DELIVERY_NOTES_COLUMN;
    const paramsTablePrimaryValue: string = DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM.DELIVERY_NOTES_NUMBER;
    const paramsCustomerType: CustomersTypes = CustomersTypes.B2C;
    const paramsTableSecondColumn: string = ""; // constantsService.REFTABLE_ORDERS_CLIENT_COLUMN;
    const paramsTableSecondValue: string = ""; // constantsService.CLIENT_B2C;
    const paramsFormSecondColumn: string = constantsService.REFTABLE_DELIVERY_NOTES_COLUMN;
    const paramsFormSecondValue: string =  DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM.DELIVERY_NOTES_NUMBER;
    const paramsPrimaryRefTable: undefined | string = undefined;
    formService.selItemRefTableTitle = constantsService.REFTABLE_DELIVERY_NOTES;
    service.newOrderMode = false;
    service.selTableRow = DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM;
    service.refTable = constantsService.REFTABLE_DELIVERY_NOTES;

    const resultPrimaryRefTable: undefined | string = constantsService.REFTABLE_DELIVERY_NOTES;
    const resultTablePrimaryColumn: string = constantsService.REFTABLE_DELIVERY_NOTES_COLUMN;
    const resultTablePrimaryValue: string = DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM.DELIVERY_NOTES_NUMBER;
    const resultCustomerType: CustomersTypes = undefined;
    const resultFormSecondColumn: undefined|string = undefined;
    const resultFormSecondValue: undefined|string = undefined;
    const resultSecondaryRefTable: undefined|string = constantsService.REFTABLE_DELIVERY_NOTES;
    spyOn(localStorage, 'getItem').and.returnValue(
      DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM.DELIVERY_NOTES_NUMBER);

    // Act
    const result: {
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
    } = service.getParamDataForLoading(paramsSubTabName, paramsLockedRefTable, paramsTablePrimaryColumn,
      paramsTablePrimaryValue, paramsCustomerType, paramsTableSecondColumn, paramsTableSecondValue,
      paramsFormSecondColumn, paramsFormSecondValue, paramsPrimaryRefTable);

    // Assert
    expect(result.lockedRefTable).toEqual(paramsLockedRefTable);
    expect(result.tablePrimaryColumn).toEqual(resultTablePrimaryColumn);
    expect(result.tablePrimaryValue).toEqual(resultTablePrimaryValue);
    expect(result.customerType).toEqual(resultCustomerType);
    expect(result.tableSecondColumn).toEqual(paramsTableSecondColumn);
    expect(result.tableSecondValue).toEqual(paramsTableSecondValue);
    expect(result.formSecondColumn).toEqual(resultFormSecondColumn);
    expect(result.formSecondValue).toEqual(resultFormSecondValue);
    expect(result.primaryRefTable).toEqual(resultPrimaryRefTable);
    expect(result.secondaryRefTable).toEqual(resultSecondaryRefTable);

  });

  it('should get param data for loading for delivery notes positions', function() {

    // Arrange
    const paramsSubTabName: SubTabGroupTabNames = SubTabGroupTabNames.DELIVERY_NOTES_POSITIONS;
    const paramsLockedRefTable: string = constantsService.REFTABLE_DELIVERY_NOTES;
    const paramsTablePrimaryColumn: string = constantsService.REFTABLE_DELIVERY_NOTES_COLUMN;
    const paramsTablePrimaryValue: string = DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM.DELIVERY_NOTES_NUMBER;
    const paramsCustomerType: CustomersTypes = CustomersTypes.B2C;
    const paramsTableSecondColumn: string = ""; // constantsService.REFTABLE_ORDERS_CLIENT_COLUMN;
    const paramsTableSecondValue: string = ""; // constantsService.CLIENT_B2C;
    const paramsFormSecondColumn: string = constantsService.REFTABLE_DELIVERY_NOTES_COLUMN;
    const paramsFormSecondValue: string =  DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM.DELIVERY_NOTES_NUMBER;
    const paramsPrimaryRefTable: undefined | string = undefined;
    formService.selItemRefTableTitle = constantsService.REFTABLE_DELIVERY_NOTES;
    service.newOrderMode = false;
    service.selTableRow = DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM;
    service.refTable = constantsService.REFTABLE_DELIVERY_NOTES;
    service.positionsService = positionsService;

    const resultPrimaryRefTable: undefined | string = constantsService.REFTABLE_DELIVERY_NOTES_POSITIONS;
    const resultTablePrimaryColumn: string = constantsService.REFTABLE_DELIVERY_NOTES_COLUMN;
    const resultTablePrimaryValue: string = DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM.DELIVERY_NOTES_NUMBER;
    const resultCustomerType: CustomersTypes = undefined;
    const resultFormSecondColumn: undefined|string = undefined;
    const resultFormSecondValue: undefined|string = undefined;
    const resultSecondaryRefTable: undefined|string = constantsService.REFTABLE_DELIVERY_NOTES_POSITIONS;
    const resultDeliveryNotePositionCols: any[] =
      [{field: 'DELIVERY_NOTES_NUMBER', header: 'DELIVERY_NOTES_NUMBER', disabled: true, size: 50}];
    spyOn(positionsService,'getDeliveryNotePositionCols').and.returnValue(resultDeliveryNotePositionCols);
    spyOn(localStorage, 'getItem').and.returnValue(
      DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM.DELIVERY_NOTES_NUMBER);

    // Act
    const result: {
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
    } = service.getParamDataForLoading(paramsSubTabName, paramsLockedRefTable, paramsTablePrimaryColumn,
      paramsTablePrimaryValue, paramsCustomerType, paramsTableSecondColumn, paramsTableSecondValue,
      paramsFormSecondColumn, paramsFormSecondValue, paramsPrimaryRefTable);

    // Assert
    expect(result.lockedRefTable).toEqual(paramsLockedRefTable);
    expect(result.tablePrimaryColumn).toEqual(resultTablePrimaryColumn);
    expect(result.tablePrimaryValue).toEqual(resultTablePrimaryValue);
    expect(result.customerType).toEqual(resultCustomerType);
    expect(result.tableSecondColumn).toEqual(paramsTableSecondColumn);
    expect(result.tableSecondValue).toEqual(paramsTableSecondValue);
    expect(result.formSecondColumn).toEqual(resultFormSecondColumn);
    expect(result.formSecondValue).toEqual(resultFormSecondValue);
    expect(result.primaryRefTable).toEqual(resultPrimaryRefTable);
    expect(result.secondaryRefTable).toEqual(resultSecondaryRefTable);
    expect(positionsService.getDeliveryNotePositionCols).toHaveBeenCalled();

  });

  it('should get param data for loading for invoice details', function() {

    // Arrange
    const paramsSubTabName: SubTabGroupTabNames = SubTabGroupTabNames.INVOICE_DETAILS;
    const paramsLockedRefTable: string = constantsService.REFTABLE_INVOICE;
    const paramsTablePrimaryColumn: string = constantsService.REFTABLE_INVOICE_COLUMN;
    const paramsTablePrimaryValue: string = InvoicesTestConstants.INVOICE_ITEM.INVOICES_NUMBER;
    const paramsCustomerType: CustomersTypes = CustomersTypes.B2C;
    const paramsTableSecondColumn: string = ""; // constantsService.REFTABLE_ORDERS_CLIENT_COLUMN;
    const paramsTableSecondValue: string = ""; // constantsService.CLIENT_B2C;
    const paramsFormSecondColumn: string = constantsService.REFTABLE_INVOICE_COLUMN;
    const paramsFormSecondValue: string =  InvoicesTestConstants.INVOICE_ITEM.INVOICES_NUMBER;
    const paramsPrimaryRefTable: undefined | string = undefined;
    formService.selItemRefTableTitle = constantsService.REFTABLE_INVOICE;
    service.newOrderMode = false;
    service.selTableRow = InvoicesTestConstants.INVOICE_ITEM;
    service.refTable = constantsService.REFTABLE_INVOICE;

    const resultPrimaryRefTable: undefined | string = constantsService.REFTABLE_INVOICE;
    const resultTablePrimaryColumn: string = constantsService.REFTABLE_INVOICE_COLUMN;
    const resultTablePrimaryValue: string = InvoicesTestConstants.INVOICE_ITEM.INVOICES_NUMBER;
    const resultCustomerType: CustomersTypes = undefined;
    const resultFormSecondColumn: undefined|string = undefined;
    const resultFormSecondValue: undefined|string = undefined;
    const resultSecondaryRefTable: undefined|string = constantsService.REFTABLE_INVOICE;
    spyOn(localStorage, 'getItem').and.returnValue(InvoicesTestConstants.INVOICE_ITEM.INVOICES_NUMBER);

    // Act
    const result: {
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
    } = service.getParamDataForLoading(paramsSubTabName, paramsLockedRefTable, paramsTablePrimaryColumn,
      paramsTablePrimaryValue, paramsCustomerType, paramsTableSecondColumn, paramsTableSecondValue,
      paramsFormSecondColumn, paramsFormSecondValue, paramsPrimaryRefTable);

    // Assert
    expect(result.lockedRefTable).toEqual(paramsLockedRefTable);
    expect(result.tablePrimaryColumn).toEqual(resultTablePrimaryColumn);
    expect(result.tablePrimaryValue).toEqual(resultTablePrimaryValue);
    expect(result.customerType).toEqual(resultCustomerType);
    expect(result.tableSecondColumn).toEqual(paramsTableSecondColumn);
    expect(result.tableSecondValue).toEqual(paramsTableSecondValue);
    expect(result.formSecondColumn).toEqual(resultFormSecondColumn);
    expect(result.formSecondValue).toEqual(resultFormSecondValue);
    expect(result.primaryRefTable).toEqual(resultPrimaryRefTable);
    expect(result.secondaryRefTable).toEqual(resultSecondaryRefTable);

  });

  it('should get param data for loading for invoice positions', function() {

    // Arrange
    const paramsSubTabName: SubTabGroupTabNames = SubTabGroupTabNames.INVOICES_POSITIONS;
    const paramsLockedRefTable: string = constantsService.REFTABLE_INVOICE;
    const paramsTablePrimaryColumn: string = constantsService.REFTABLE_INVOICE_COLUMN;
    const paramsTablePrimaryValue: string = InvoicesTestConstants.INVOICE_ITEM.INVOICES_NUMBER;
    const paramsCustomerType: CustomersTypes = CustomersTypes.B2C;
    const paramsTableSecondColumn: string = "";
    const paramsTableSecondValue: string = "";
    const paramsFormSecondColumn: string = constantsService.REFTABLE_INVOICE_COLUMN;
    const paramsFormSecondValue: string =  InvoicesTestConstants.INVOICE_ITEM.INVOICES_NUMBER;
    const paramsPrimaryRefTable: undefined | string = undefined;
    formService.selItemRefTableTitle = constantsService.REFTABLE_INVOICE;
    service.newOrderMode = false;
    service.selTableRow = InvoicesTestConstants.INVOICE_ITEM;
    service.refTable = constantsService.REFTABLE_INVOICE;
    service.positionsService = positionsService;

    const resultPrimaryRefTable: undefined | string = constantsService.REFTABLE_INVOICE_POSITIONS;
    const resultTablePrimaryColumn: string = constantsService.REFTABLE_INVOICE_COLUMN;
    const resultTablePrimaryValue: string = InvoicesTestConstants.INVOICE_ITEM.INVOICES_NUMBER;
    const resultCustomerType: CustomersTypes = undefined;
    const resultFormSecondColumn: undefined|string = undefined;
    const resultFormSecondValue: undefined|string = undefined;
    const resultSecondaryRefTable: undefined|string = constantsService.REFTABLE_INVOICE_POSITIONS;
    const resultInvoicePositionCols: any[] =
      [{field: 'INVOICES_NUMBER', header: 'INVOICES_NUMBER', disabled: true, size: 50}];
    spyOn(positionsService,'getInvoicePositionCols').and.returnValue(resultInvoicePositionCols);
    spyOn(localStorage, 'getItem').and.returnValue(InvoicesTestConstants.INVOICE_ITEM.INVOICES_NUMBER);

    // Act
    const result: {
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
    } = service.getParamDataForLoading(paramsSubTabName, paramsLockedRefTable, paramsTablePrimaryColumn,
      paramsTablePrimaryValue, paramsCustomerType, paramsTableSecondColumn, paramsTableSecondValue,
      paramsFormSecondColumn, paramsFormSecondValue, paramsPrimaryRefTable);

    // Assert
    expect(result.lockedRefTable).toEqual(paramsLockedRefTable);
    expect(result.tablePrimaryColumn).toEqual(resultTablePrimaryColumn);
    expect(result.tablePrimaryValue).toEqual(resultTablePrimaryValue);
    expect(result.customerType).toEqual(resultCustomerType);
    expect(result.tableSecondColumn).toEqual(paramsTableSecondColumn);
    expect(result.tableSecondValue).toEqual(paramsTableSecondValue);
    expect(result.formSecondColumn).toEqual(resultFormSecondColumn);
    expect(result.formSecondValue).toEqual(resultFormSecondValue);
    expect(result.primaryRefTable).toEqual(resultPrimaryRefTable);
    expect(result.secondaryRefTable).toEqual(resultSecondaryRefTable);
    expect(positionsService.getInvoicePositionCols).toHaveBeenCalled();

  });

  it('should set setRefTable', () => {

    // Arrange
    service.refTable = undefined;

    // Act
    service.setRefTable('newRefTable');

    // Assert
    expect(service.refTable).toBeDefined();
    expect(service.refTable).toEqual('newRefTable');
  });

  it('should set setRefTableCustomersAddresses', () => {

    // Arrange
    service.secondaryRefTable = undefined;

    // Act
    service.setRefTableCustomersAddresses('newRefTable');

    // Assert
    expect(service.secondaryRefTable).toBeDefined();
    expect(service.secondaryRefTable).toEqual('newRefTable');
  });

  it('should set setTabsService', () => {

    // Arrange
    // const tabsService: DetailViewTabGroupTabsService) ;

    // Act
    service.setTabsService(tabsService);

    // Assert
    expect(service.tabsService).toBeDefined();
    expect(service.tabsService).toEqual(tabsService);
  });

  it('should return customer type of B2C for customer table', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_CUSTOMER;
    const selTableRow: Customer = JSON.parse(JSON.stringify(CustomersTestConstants.CUSTOMER_B2C_ITEM)) as Customer;

    // Act
    const result: undefined | CustomersTypes = service.getCustomerType(refTable, selTableRow);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(CustomersTypes.B2C);
  });

  it('should return customer type of B2B for customer table', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_PARTNERS;
    let selTableRow: Customer = JSON.parse(JSON.stringify(CustomersTestConstants.CUSTOMER_B2C_ITEM)) as Customer;
    // change type to B2B
    selTableRow.CUSTOMERS_TYPE = CustomersTypes.B2B;

    // Act
    const result: undefined | CustomersTypes = service.getCustomerType(refTable, selTableRow);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(CustomersTypes.B2B);
  });

  it('should return customer type of B2C for orders table', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS;
    const selTableRow: Orders = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_ITEM)) as Orders;

    // Act
    const result: undefined | CustomersTypes = service.getCustomerType(refTable, selTableRow);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(CustomersTypes.B2C);
  });

  it('should return customer type of undefined for articles table', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ARTICLES;
    const selTableRow: Customer = JSON.parse(JSON.stringify(CustomersTestConstants.CUSTOMER_B2C_ITEM)) as Customer;

    // Act
    const result: undefined | CustomersTypes = service.getCustomerType(refTable, selTableRow);

    // Assert
    expect(result).not.toBeDefined();
  });

});
