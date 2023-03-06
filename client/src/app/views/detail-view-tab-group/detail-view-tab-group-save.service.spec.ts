import {DetailViewTabGroupSaveService} from "./detail-view-tab-group-save.service";
import {TableDataService} from "../../_services/table-data.service";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {fakeAsync, TestBed} from "@angular/core/testing";
import {TestingModule} from "../../testing/testing.module";
import {MessageService} from "primeng/api";
import {OrderPositionItem} from "../../interfaces/order-position-item";
import {OrdersTestConstants} from "../../../assets/test-constants/orders";
import {DeliveryNotePositionItem} from "../../interfaces/delivery-note-position-item";
import {DeliveryNotesTestConstants} from "../../../assets/test-constants/delivery-notes";
import {ConstantsService} from "../../_services/constants.service";
import {Orders} from "../../models/orders";
import {CustomersTestConstants} from "../../../assets/test-constants/customers";
import {InvoicesTestConstants} from "../../../assets/test-constants/invoices";
import {DeliveryNotes} from "../../models/delivery-notes";
import {DetailViewTabGroupPositionsService} from "./detail-view-tab-group-positions.service";

describe('DetailViewTabGroupSaveService', () => {

  let service: DetailViewTabGroupSaveService;
  let tableDataService: TableDataService;
  let translate: TranslateItPipe;
  let constantsService: ConstantsService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [TranslateItPipe],
      providers: [MessageService, TableDataService, TranslateItPipe, ConstantsService]
    })

    service = TestBed.inject(DetailViewTabGroupSaveService);
    tableDataService = TestBed.inject(TableDataService);
    translate = TestBed.inject(TranslateItPipe);
    service.setTranslatePipe(translate);
    constantsService = TestBed.inject(ConstantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setTranslatePipe returns false if translatePipe is not set', () => {

    // Arrange

    // Act
    service.setTranslatePipe(undefined);

    // Assert
    expect(service['translatePipe']).toEqual(undefined);
  })

  it('setTranslatePipe returns true (show error message) if translatePipe is set', () => {

    // Arrange

    // Act
    service.setTranslatePipe(translate);

    // Assert
    expect(service['translatePipe']).toEqual(translate);
  })

  it('should set message service', () => {

    // Arrange
    let message: MessageService = TestBed.inject(MessageService);

    // Act
    service.setMessageService(message);

    // Assert
    expect(service.messageService).toEqual(message);
  })

  it('should save orders positions', fakeAsync(() => {

    // Arrange
    const orderPositionsItems: OrderPositionItem[] = [OrdersTestConstants.ORDERS_POSITION_ITEM];
    const updatedOrderPositionsRows: string[] = ['1'];
    const opDataTableValues: any[] = [OrdersTestConstants.ORDERS_POSITION_ITEM];
    const orderNumber: string = OrdersTestConstants.ORDERS_POSITION_ITEM.ORDERS_NUMBER;
    const getChangedPositionsRowIdsResult: { rowNumbers: any[], rowIdNumbers: any[] } =
      {
        rowNumbers: ['0'],
        rowIdNumbers: [OrdersTestConstants.ORDERS_POSITION_ITEM.ID.toString()]
      };
    spyOn(service, 'getChangedPositionsRowIds').and.returnValue(getChangedPositionsRowIdsResult);
    const setTableRowsDataResult: { result: any } | { error: any } =
      {
        result: {
          success: true,
          itmnums: [OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER]
        }
      };
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'setTableRowsData').and.returnValue(Promise.resolve(setTableRowsDataResult));

    // Act
    service.saveOrderPositions(orderPositionsItems, updatedOrderPositionsRows, opDataTableValues, orderNumber)
      .then((result: { result: boolean, message: string }) => {

        // Assert
        expect(service.getChangedPositionsRowIds).toHaveBeenCalled();
        expect(tableDataService.setTableRowsData).toHaveBeenCalled();
        expect(result).toEqual({
          result: true,
          message: 'ORDER_SAVED_DETAILS'
        });
      })
  }))

  it('should not save orders positions', fakeAsync(() => {

    // Arrange
    const orderPositionsItems: OrderPositionItem[] = [OrdersTestConstants.ORDERS_POSITION_ITEM];
    const updatedOrderPositionsRows: string[] = ['1'];
    const opDataTableValues: any[] = [OrdersTestConstants.ORDERS_POSITION_ITEM];
    const orderNumber: string = OrdersTestConstants.ORDERS_POSITION_ITEM.ORDERS_NUMBER;
    const getChangedPositionsRowIdsResult: { rowNumbers: any[], rowIdNumbers: any[] } =
      {
        rowNumbers: [],
        rowIdNumbers: []
      };
    spyOn(service, 'getChangedPositionsRowIds').and.returnValue(getChangedPositionsRowIdsResult);

    // Act
    service.saveOrderPositions(orderPositionsItems, updatedOrderPositionsRows, opDataTableValues, orderNumber)
      .then((result: { result: boolean, message: string }) => {
        // Assert
        expect(service.getChangedPositionsRowIds).toHaveBeenCalled();
        expect(result).toEqual({
          result: false,
          message: 'save order position: No row keys found for ORDERS_NUMBER "' + orderNumber + '"!'
        });
      })

  }))

  it('should save delivery note positions', () => {

    // Arrange
    const deliveryNotePositionsItems: DeliveryNotePositionItem[] = [DeliveryNotesTestConstants.DELIVERY_NOTE_POSITION_ITEM];
    const updatedDeliveryNotePositionsRows: string[] = ['1'];
    const dlnDataTableValues: {} = DeliveryNotesTestConstants.DELIVERY_NOTE_POSITION_ITEM;
    const selItemRow: {} = DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM;
    const getChangedPositionsRowIdsResult: { rowNumbers: any[], rowIdNumbers: any[] } =
      {
        rowNumbers: ['0'],
        rowIdNumbers: [DeliveryNotesTestConstants.DELIVERY_NOTE_POSITION_ITEM.ID.toString()]
      };
    spyOn(service, 'getChangedPositionsRowIds').and.returnValue(getChangedPositionsRowIdsResult);
    const setTableRowsDataResult: { result: any } | { error: any } =
      {
        result: {
          success: true,
          itmnums: [DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM.DELIVERY_NOTES_NUMBER]
        }
      };
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'setTableRowsData').and.returnValue(Promise.resolve(setTableRowsDataResult));

    // Act
    service.saveDeliveryNotePositions(updatedDeliveryNotePositionsRows, dlnDataTableValues, selItemRow);

    // Assert
    expect(service.getChangedPositionsRowIds).toHaveBeenCalled();
    expect(tableDataService.setTableRowsData).toHaveBeenCalled();
  })

  it('should create delivery note', fakeAsync(() => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS;
    const selItemRow: Orders = OrdersTestConstants.ORDERS_ITEM;
    const expectedResult: { result: boolean, message: string } = {
      result: true,
      message: 'OK'
    }
    // Act
    service.createDeliveryNote(refTable, selItemRow).then((result: { result: boolean, message: string }) => {
      // Assert
      expect(result).toEqual(expectedResult);
    })

  }))

  it('should not create delivery note if referral table is wrong', fakeAsync(() => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_DELIVERY_NOTES;
    const selItemRow: Orders = OrdersTestConstants.ORDERS_ITEM;
    const expectedResult: { result: boolean, message: string } = {
      result: false,
      message: 'Wrong refTable...'
    }
    // Act
    service.createDeliveryNote(refTable, selItemRow).then((result: { result: boolean, message: string }) => {
      // Assert
      expect(result).toEqual(expectedResult);
    })

  }))

  it('should not create delivery note if order is not payed', fakeAsync(() => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS;
    // make a copy of data
    let selItemRow: Orders = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_ITEM));
    // set order is not paid
    selItemRow.PAYED = false;
    const expectedResult: { result: boolean, message: string } = {
      result: false,
      message: 'IS_NOT_PAYED ORDERS_NUMBER "' + DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM.ORDERS_NUMBER + '".'
    }
    // Act
    service.createDeliveryNote(refTable, selItemRow).then((result: { result: boolean, message: string }) => {
      // Assert
      expect(result).toEqual(expectedResult);
    })

  }))

  it('should return changed positions row ids', () => {

    // Arrange
    const updatedPositionsRows: string[] = ['id_' + OrdersTestConstants.ORDERS_POSITION_ITEM.ID + '_td_0_5'];
    const rowNumbers: any[] = ["0"];
    const rowIdNumbers: any[] = [OrdersTestConstants.ORDERS_POSITION_ITEM.ID.toString()];
    const rowPosition: number = 3;
    const rowIdPosition: number = 1;
    const expectedResult: { rowNumbers: any[], rowIdNumbers: any[] } = {
      rowNumbers: ['0'],
      rowIdNumbers: [OrdersTestConstants.ORDERS_POSITION_ITEM.ID.toString()]
    };

    // Act
    const result: { rowNumbers: any[], rowIdNumbers: any[] } =
      service.getChangedPositionsRowIds(updatedPositionsRows, rowNumbers, rowIdNumbers, rowPosition, rowIdPosition);

    // Assert
    expect(result).toEqual(expectedResult);
  })

  it('should return order positions for delivery note positions creation', fakeAsync(() => {

    // Arrange
    const orderPositionsData: object = OrdersTestConstants.ORDERS_POSITION_ITEM;
    const checkAllocation: boolean = true;
    spyOn(tableDataService, 'checkTableData').and.returnValue(Promise.resolve(
      {
        result:
          {
            success: true,
            message: 'OK',
            data: OrdersTestConstants.ORDERS_POSITION_ITEM,
            partlyDeliveryDetected: false
          }
      }));
    const expectedResult: {
      availability: boolean,
      data: Object,
      partlyDeliveryDetected: boolean
    } = {
      availability: true,
      data: OrdersTestConstants.ORDERS_POSITION_ITEM,
      partlyDeliveryDetected: false
    };

    // Act
    service.getOPForDNPCreation(orderPositionsData, checkAllocation).then((result: {}) => {

      // Assert
      expect(result).toEqual(expectedResult);
    })
  }))

  it('should do create delivery note', fakeAsync(() => {

    // Arrange
    const thisItem: string = '/selectThisOrderAvise';
    const primaryKey: string = constantsService.REFTABLE_ORDERS_COLUMN;
    const primaryValue: string = OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER;
    const userName: string = 'AL';
    const language: string = 'DE';
    const opForDNP: {} = {};
    const ordersNumber: string = OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER;
    const setDeliveryNoteResult: { message: { success: boolean, errorCode: string, newDeliveryNote: string, positions: string } } =
      {
        message: {
          success: true,
          errorCode: 'DELIVERY_NOTE_WAS_CREATED',
          newDeliveryNote: DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM.DELIVERY_NOTES_NUMBER,
          positions: OrdersTestConstants.ORDERS_POSITION_ITEM.ORDERS_NUMBER
        }
      };
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'setDeliveryNote').and.returnValue(Promise.resolve(setDeliveryNoteResult));
    const expectedResult: { result: boolean, message: string } =
      {result: true, message: 'DELIVERY_NOTE_WAS_CREATED DELIVERY_NOTE_WAS_CREATED_DETAILS'};

    // Act
    service.doCreateDeliveryNote(thisItem, primaryKey, primaryValue, userName, language, opForDNP, ordersNumber).then(
      (result: { result: boolean, message: string }) => {

        // Assert
        expect(tableDataService.setDeliveryNote).toHaveBeenCalled();
        expect(result).toEqual(expectedResult);
      })

  }))

  it('should not do create delivery note', fakeAsync(() => {

    // Arrange
    const thisItem: string = '/selectThisOrderAvise';
    const primaryKey: string = constantsService.REFTABLE_ORDERS_COLUMN;
    const primaryValue: string = OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER;
    const userName: string = 'AL';
    const language: string = 'DE';
    const opForDNP: {} = {};
    const ordersNumber: string = OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER;
    const setDeliveryNoteResult: { message: { success: boolean, errorCode: string, newDeliveryNote: string, positions: string } } =
      {
        message: {
          success: false,
          errorCode: 'ERROR_OCCURRED',
          newDeliveryNote: undefined,
          positions: undefined
        }
      };
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'setDeliveryNote').and.returnValue(Promise.resolve(setDeliveryNoteResult));
    const expectedResult: { result: boolean, message: string } =
      {result: false, message: 'ERROR_OCCURRED ORDERS_NUMBER "50021AU000027".'};

    // Act
    service.doCreateDeliveryNote(thisItem, primaryKey, primaryValue, userName, language, opForDNP, ordersNumber).then(
      (result: { result: boolean, message: string }) => {

        // Assert
        expect(tableDataService.setDeliveryNote).toHaveBeenCalled();
        expect(result).toEqual(expectedResult);
      })

  }))

  it('should store last added item to local storage for orders', fakeAsync(() => {

    // Arrange
    const tableName: string = constantsService.REFTABLE_ORDERS_TITLE;
    const columnName: string = constantsService.REFTABLE_ORDERS_COLUMN;
    const getLastIdOfTableResult: { id: any | 0 } = {id: OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER}
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'getLastIdOfTable').and.returnValue(Promise.resolve(getLastIdOfTableResult));

    // Act
    service.storeLastAddedItemToLS(tableName, columnName).then(() => {

      // Assert
      expect(tableDataService.getLastIdOfTable).toHaveBeenCalled();
      expect(localStorage.getItem(constantsService.LS_SEL_ORDERS_NUMBER)).toEqual(getLastIdOfTableResult.id);
    })
  }))

  it('should store last added item to local storage for customer', fakeAsync(() => {

    // Arrange
    const tableName: string = constantsService.REFTABLE_CUSTOMER_TITLE;
    const columnName: string = constantsService.REFTABLE_CUSTOMER_COLUMN;
    const getLastIdOfTableResult: { id: any | 0 } = {id: CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_NUMBER}
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'getLastIdOfTable').and.returnValue(Promise.resolve(getLastIdOfTableResult));

    // Act
    service.storeLastAddedItemToLS(tableName, columnName).then(() => {

      // Assert
      expect(tableDataService.getLastIdOfTable).toHaveBeenCalled();
      expect(localStorage.getItem(constantsService.LS_SEL_CUSTOMERS_NUMBER)).toEqual(getLastIdOfTableResult.id);
    })
  }))

  it('should store last added item to local storage for delivery note', fakeAsync(() => {

    // Arrange
    const tableName: string = constantsService.REFTABLE_DELIVERY_NOTES_TITLE;
    const columnName: string = constantsService.REFTABLE_DELIVERY_NOTES_COLUMN;
    const getLastIdOfTableResult: { id: any | 0 } = {id: DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM.DELIVERY_NOTES_NUMBER}
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'getLastIdOfTable').and.returnValue(Promise.resolve(getLastIdOfTableResult));

    // Act
    service.storeLastAddedItemToLS(tableName, columnName).then(() => {

      // Assert
      expect(tableDataService.getLastIdOfTable).toHaveBeenCalled();
      expect(localStorage.getItem(constantsService.LS_SEL_DLV_NOTES_NUMBER)).toEqual(getLastIdOfTableResult.id);
    })
  }))

  it('should store last added item to local storage for invoice', fakeAsync(() => {

    // Arrange
    const tableName: string = constantsService.REFTABLE_INVOICES_TITLE;
    const columnName: string = constantsService.REFTABLE_INVOICE_COLUMN;
    const getLastIdOfTableResult: { id: any | 0 } = {id: InvoicesTestConstants.INVOICE_ITEM.INVOICES_NUMBER}
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'getLastIdOfTable').and.returnValue(Promise.resolve(getLastIdOfTableResult));

    // Act
    service.storeLastAddedItemToLS(tableName, columnName).then(() => {

      // Assert
      expect(tableDataService.getLastIdOfTable).toHaveBeenCalled();
      expect(localStorage.getItem(constantsService.LS_SEL_INVOICE_NUMBER)).toEqual(getLastIdOfTableResult.id);
    })
  }))

  it('should store last added item to local storage and show error if returned id is 0', fakeAsync(() => {

    // Arrange
    console.log = jasmine.createSpy("log");
    const tableName: string = constantsService.REFTABLE_INVOICES_TITLE;
    const columnName: string = constantsService.REFTABLE_INVOICE_COLUMN;
    const getLastIdOfTableResult: { id: any | 0 } = {id: 0};
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'getLastIdOfTable').and.returnValue(Promise.resolve(getLastIdOfTableResult));

    // Act
    service.storeLastAddedItemToLS(tableName, columnName).then(() => {

      // Assert
      expect(tableDataService.getLastIdOfTable).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('ERROR: Last inserted ID was not found...');
    })
  }))

  it('should create invoice', fakeAsync(() => {

    // Arrange
    console.log = jasmine.createSpy("log");
    const refTable: string = constantsService.REFTABLE_DELIVERY_NOTES;
    // make a copy to be able to edit item and set RELEASE to true
    let selTableRow: DeliveryNotes = JSON.parse(JSON.stringify(DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM));
    selTableRow.RELEASE = true;
    spyOn(translate, 'transform').and.returnValue('FIELD_SHOULD_NOT_BE_EMPTY');
    spyOn(localStorage, 'getItem').and.returnValue('AL');
    const getTableDataByIdFirstResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      DeliveryNotesTestConstants.DELIVERY_NOTE_POSITIONS_TABLE_DB_DATA;
    // invoice positions data is empty
    const getTableDataByIdSecondResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      InvoicesTestConstants.INVOICE_POSITIONS_EMPTY_TABLE_DB_DATA;
    const setInvoiceResult: { message: { success: boolean, errorCode: string, newInvoice: string, positions: string } } =
      {
        message: {
          success: true,
          errorCode: 'INVOICE_WAS_CREATED',
          newInvoice: InvoicesTestConstants.INVOICE_ITEM.INVOICES_NUMBER,
          positions: DeliveryNotesTestConstants.DELIVERY_NOTE_POSITION_ITEM.DELIVERY_NOTES_NUMBER
        }
      };
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'getTableDataById').and.returnValues(
      Promise.resolve(getTableDataByIdFirstResponse),
      Promise.resolve(getTableDataByIdSecondResponse));
    spyOn(tableDataService, 'setInvoice').and.returnValue(Promise.resolve(setInvoiceResult));
    const positionsService: DetailViewTabGroupPositionsService = TestBed.inject(DetailViewTabGroupPositionsService);
    // check if position is already available in invoice positions
    spyOn(positionsService,'checkPositionIsInInvp').and.returnValue(false);

    // Act
    service.createInvoice(refTable, selTableRow).then((result: {result: boolean, message: string}) => {

      // Assert
      expect(tableDataService.getTableDataById).toHaveBeenCalled();
      expect(tableDataService.getTableDataById).toHaveBeenCalledTimes(2);
      expect(positionsService.checkPositionIsInInvp).toHaveBeenCalled();
      expect(result).toEqual({result: true, message: 'FIELD_SHOULD_NOT_BE_EMPTY - FIELD_SHOULD_NOT_BE_EMPTY'});
    })
  }))

  it('should not create invoice if referral table is wrong', fakeAsync(() => {

    // Arrange
    console.log = jasmine.createSpy("log");
    const refTable: string = constantsService.REFTABLE_ORDERS;
    // make a copy to be able to edit item and set RELEASE to true
    let selTableRow: DeliveryNotes = JSON.parse(JSON.stringify(DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM));
    selTableRow.RELEASE = true;
    const expectedMessage: string = 'WRONG refTable...';

    // Act
    service.createInvoice(refTable, selTableRow).then((result: {result: boolean, message: string}) => {

      // Assert
      expect(console.log).toHaveBeenCalledWith(expectedMessage);
      expect(result).toEqual({result: false, message: expectedMessage});
    })
  }))

  it('should not create invoice if selected table row is undefined', fakeAsync(() => {

    // Arrange
    console.log = jasmine.createSpy("log");
    const refTable: string = constantsService.REFTABLE_DELIVERY_NOTES;
    let selTableRow: DeliveryNotes = undefined;
    const expectedMessage: string = 'selTableRow is empty...';

    // Act
    service.createInvoice(refTable, selTableRow).then((result: {result: boolean, message: string}) => {

      // Assert
      expect(console.log).toHaveBeenCalledWith(expectedMessage);
      expect(result).toEqual({result: false, message: expectedMessage});
    })
  }))

  it('should not create invoice if delivery note is not released', fakeAsync(() => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_DELIVERY_NOTES;
    let selTableRow: DeliveryNotes = DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM;
    const expectedMessage: string = 'DELIVERY_NOTE_IS_NOT_RELEASED';
    spyOn(translate, 'transform').and.returnValue(expectedMessage);
    spyOn(localStorage, 'getItem').and.returnValue('AL');

    // Act
    service.createInvoice(refTable, selTableRow).then((result: {result: boolean, message: string}) => {

      // Assert
      expect(localStorage.getItem).toHaveBeenCalled();
      expect(result).toEqual({result: true, message: expectedMessage});
    })
  }))

  it('should not create invoice if delivery note positions table data was is undefined', fakeAsync(() => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_DELIVERY_NOTES;
    // make a copy to be able to edit item and set RELEASE to true
    let selTableRow: DeliveryNotes = JSON.parse(JSON.stringify(DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM));
    selTableRow.RELEASE = true;
    const expectedMessage: string = 'save delivery note: Get delivery note positions - DELIVERY_NOTES_NUMBER';
    spyOn(translate, 'transform').and.returnValues('DELIVERY_NOTES_NUMBER');
    spyOn(localStorage, 'getItem').and.returnValue('AL');
    const getTableDataByIdResponse: { table: [any[string], any[]], maxRows: number, page: number } = undefined;
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'getTableDataById').and.returnValue(Promise.resolve(getTableDataByIdResponse));

    // Act
    service.createInvoice(refTable, selTableRow).then((result: {result: boolean, message: string}) => {

      // Assert
      expect(localStorage.getItem).toHaveBeenCalled();
      expect(tableDataService.getTableDataById).toHaveBeenCalled();
      expect(result).toEqual({result: false, message: expectedMessage});
    })
  }))

  it('should not create invoice if invoice positions table data is undefined', fakeAsync(() => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_DELIVERY_NOTES;
    // make a copy to be able to edit item and set RELEASE to true
    let selTableRow: DeliveryNotes = JSON.parse(JSON.stringify(DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM));
    selTableRow.RELEASE = true;
    const expectedMessage: string = 'save delivery note: Get invoice positions - DELIVERY_NOTES_NUMBER';
    spyOn(translate, 'transform').and.returnValues('DELIVERY_NOTES_NUMBER');
    spyOn(localStorage, 'getItem').and.returnValue('AL');
    const deliveryNotePositionsDbData: { table: [any[string], any[]], maxRows: number, page: number } =
      DeliveryNotesTestConstants.DELIVERY_NOTE_POSITIONS_TABLE_DB_DATA;
    const invPositionsDbData: { table: [any[string], any[]], maxRows: number, page: number } =
      undefined;
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'getTableDataById').and.returnValues(
      Promise.resolve(deliveryNotePositionsDbData),
      Promise.resolve(invPositionsDbData));

    // Act
    service.createInvoice(refTable, selTableRow).then((result: {result: boolean, message: string}) => {

      // Assert
      expect(localStorage.getItem).toHaveBeenCalled();
      expect(tableDataService.getTableDataById).toHaveBeenCalled();
      expect(tableDataService.getTableDataById).toHaveBeenCalledTimes(2);
      expect(result).toEqual({result: false, message: expectedMessage});
    })
  }))

  it('should not create invoice if positions of invoice positions table data are already available', fakeAsync(() => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_DELIVERY_NOTES;
    // make a copy to be able to edit item and set RELEASE to true
    let selTableRow: DeliveryNotes = JSON.parse(JSON.stringify(DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM));
    selTableRow.RELEASE = true;
    const expectedMessage: string = 'No order positions found for delivery notes creation... For DELIVERY_NOTES_NUMBER "50021LI000027"';
    spyOn(translate, 'transform').and.returnValues('DELIVERY_NOTES_NUMBER', 'DELIVERY_NOTES_NUMBER', 'DELIVERY_NOTES_NUMBER');
    spyOn(localStorage, 'getItem').and.returnValue('AL');
    const deliveryNotePositionsDbData: { table: [any[string], any[]], maxRows: number, page: number } =
      DeliveryNotesTestConstants.DELIVERY_NOTE_POSITIONS_TABLE_DB_DATA;
    // invoice positions are already available
    const invPositionsDbData: { table: [any[string], any[]], maxRows: number, page: number } =
      InvoicesTestConstants.INVOICE_POSITIONS_TABLE_DB_DATA;
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'getTableDataById').and.returnValues(
      Promise.resolve(deliveryNotePositionsDbData),
      Promise.resolve(invPositionsDbData));
    const positionsService: DetailViewTabGroupPositionsService = TestBed.inject(DetailViewTabGroupPositionsService);
    // set position is already available in invoice positions
    spyOn(positionsService,'checkPositionIsInInvp').and.returnValue(true);

    // Act
    service.createInvoice(refTable, selTableRow).then((result: {result: boolean, message: string}) => {

      // Assert
      expect(localStorage.getItem).toHaveBeenCalled();
      expect(tableDataService.getTableDataById).toHaveBeenCalled();
      expect(tableDataService.getTableDataById).toHaveBeenCalledTimes(2);
      expect(positionsService.checkPositionIsInInvp).toHaveBeenCalled();
      expect(result).toEqual({result: true, message: expectedMessage});
    })
  }))

  it('should not create invoice if qty of some invoice positions is wrong', fakeAsync(() => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_DELIVERY_NOTES;
    // make a copy to be able to edit item and set RELEASE to true
    let selTableRow: DeliveryNotes = JSON.parse(JSON.stringify(DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM));
    selTableRow.RELEASE = true;
    const expectedMessage: string = 'DELIVERY_NOTE_DELIVERY_QTY_UNEQUAL';
    spyOn(translate, 'transform').and.returnValues('DELIVERY_NOTES_NUMBER');
    spyOn(localStorage, 'getItem').and.returnValue('AL');
    let deliveryNotePositionsDbData: { table: [any[string], any[]], maxRows: number, page: number } =
      JSON.parse(JSON.stringify(DeliveryNotesTestConstants.DELIVERY_NOTE_POSITIONS_TABLE_DB_DATA));
    // set DELIVERY_QTY of one position = 0, to provoke error
    deliveryNotePositionsDbData.table[1][1]["DELIVERY_QTY"] = 0;
    // invoice positions are already available
    const invPositionsDbData: { table: [any[string], any[]], maxRows: number, page: number } =
      InvoicesTestConstants.INVOICE_POSITIONS_EMPTY_TABLE_DB_DATA;
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'getTableDataById').and.returnValues(
      Promise.resolve(deliveryNotePositionsDbData),
      Promise.resolve(invPositionsDbData));
    const positionsService: DetailViewTabGroupPositionsService = TestBed.inject(DetailViewTabGroupPositionsService);
    // set position is already available in invoice positions
    spyOn(positionsService,'checkPositionIsInInvp').and.returnValue(false);

    // Act
    service.createInvoice(refTable, selTableRow).then((result: {result: boolean, message: string}) => {

      // Assert
      expect(localStorage.getItem).toHaveBeenCalled();
      expect(tableDataService.getTableDataById).toHaveBeenCalled();
      expect(tableDataService.getTableDataById).toHaveBeenCalledTimes(2);
      expect(positionsService.checkPositionIsInInvp).toHaveBeenCalled();
      expect(result).toEqual({result: true, message: expectedMessage});
    })
  }))

});
