import {TestingModule} from 'src/app/testing/testing.module';
import {fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import {TableDataService} from './table-data.service';
import {ConstantsService, ViewQueryTypes} from "./constants.service";
import {Router} from "@angular/router";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {HttpTestingController} from "@angular/common/http/testing";
import {ErrorsTestConstants} from "../../assets/test-constants/errors";
import {DeliveryNotesTestConstants} from "../../assets/test-constants/delivery-notes";
import {OrdersTestConstants} from "../../assets/test-constants/orders";
import {InvoicesTestConstants} from "../../assets/test-constants/invoices";


describe('TableDataService', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let constants: ConstantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ConstantsService]
    })

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    constants = TestBed.inject(ConstantsService);
    // jasmine.DEFAULT_TIMEOUT_INTERVAL= 10000;
  });

  // solves "An error was thrown in afterAll - [object Object] thrown" error
  // afterAll(() => {
  //   TestBed.resetTestingModule();
  // });

  it('should be created', () => {
    const service: TableDataService = TestBed.inject(TableDataService);
    expect(service).toBeTruthy();
  });

  it('redirectTo navigates to another view', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const router: Router = TestBed.inject(Router);
    spyOn(router, "navigateByUrl").and.returnValue(Promise.resolve(true));
    spyOn(router, "navigate").and.returnValue(Promise.resolve(true));

    // Act
    service.redirectTo('/');

    // Assert
    tick();
    expect(router.navigateByUrl).toHaveBeenCalled();
    expect(router.navigateByUrl).toBeTruthy();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toBeTruthy();
  }));

  it('getTableData returns table data if full params provided', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const getTableDataBody = {
      id: 'orders', viewQueryType: 'DETAIL_TABLE', orderByColumn: 'orderByColumn',
      orderByDirection: 'orderByDirection'
    };
    const getTableDataResponse = {id: 'orders', orderByColumn: 'orderByColumn', orderByDirection: 'orderByDirection'};

    // Act
    service.getTableData(ViewQueryTypes.DETAIL_TABLE, 'orders', 'orderByColumn',
      'orderByDirection').then((res) => {
      expect(res).toBeTruthy();
    })

    // Assert
    // getTableData should have made one request to POST data of table
    const req = httpTestingController.expectOne(constants.SERVER_URL + '/table');

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(getTableDataBody);

    // Expect server to return the table data after POST
    const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    req.event(expectedResponse);
  }));

  it('getTableData returns table data if minimum params provided', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const getTableDataBody = {id: 'orders', viewQueryType: ViewQueryTypes.MAIN_TABLE};
    const getTableDataResponse = {id: 'orders'};

    // Act
    service.getTableData(ViewQueryTypes.MAIN_TABLE, 'orders');

    // Assert
    const req = httpTestingController.expectOne(constants.SERVER_URL + '/table');

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(getTableDataBody);

    const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    req.event(expectedResponse);
  }));

  it('getTableData resolve result', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/table';
    const service: TableDataService = TestBed.inject(TableDataService);
    const result: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], [{ORDERS_NUMBER: '1234567', CLIENT: 'B2C'}]], maxRows: 1, page: 0
      };

    // Act & Assert
    expectAsync(service.getTableData(ViewQueryTypes.MAIN_TABLE, 'orders')).toBeResolvedTo(result);

    httpTestingController.expectOne(url).flush(result);
  }));

  // it('getTableData returns error message', fakeAsync(() => {
  //
  //   // Arrange
  //   const url = constants.SERVER_URL + '/table';
  //   const service: TableDataService = TestBed.inject(TableDataService);
  //   const errorEvent: ErrorEvent = new ErrorEvent('network error');
  //   const mockResponse: HttpErrorResponse =
  //     new HttpErrorResponse({status: 0, statusText: '', url: url, error: errorEvent});
  //
  //   // Act & Assert
  //   expectAsync(service.getTableData(ViewQueryTypes.MAIN_TABLE, 'orders')).toBeResolvedTo(mockResponse);
  //
  //   httpTestingController.expectOne(url).error(errorEvent);
  // }));

  it('getTableDataByCustomersNumber returns table data if full params provided', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    spyOn(service, 'getTableDataById').and.callThrough();

    // Act
    service.getTableDataByCustomersNumber('refTable', ViewQueryTypes.DETAIL_TABLE, 'customerColumn',
      'customersNumber', 'optionalParameterColumn',
      'optionalParameterValue');

    // Assert
    expect(service.getTableDataById).toHaveBeenCalled();
  }));

  it('getTableDataByCustomersNumber returns table data if minimum params provided', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    spyOn(service, 'getTableDataById').and.callThrough();

    // Act
    service.getTableDataByCustomersNumber('refTable', ViewQueryTypes.MAIN_TABLE, 'customerColumn',
      'customersNumber',);

    // Assert
    expect(service.getTableDataById).toHaveBeenCalled();
  }));

  it('getTableDataById returns undefined if refTable is not set', async (done) => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);

    // Act & assert
    await expectAsync(service.getTableDataById(undefined, ViewQueryTypes.MAIN_TABLE, 'customerColumn',
      'customersNumber', 'optionalParameterColumn',
      'optionalParameterValue', 10, 10))
      .toBeRejectedWith(undefined);
    done();
  });

  it('getTableDataById returns table data if full params provided', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const getTableDataByIdResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {table: [[], []], maxRows: 0, page: 0};

    // Act & assert
    expectAsync(service.getTableDataById('refTable', ViewQueryTypes.MAIN_TABLE, 'customerColumn',
      'customersNumber', 'optionalParameterColumn',
      'optionalParameterValue', 10, 10,))
      .toBeResolvedTo(getTableDataByIdResponse);

    // Assert
    // getTableDataById should have made one request to POST data of table
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/table');
    //
    // // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    //
    // // Expect server to return the table data after POST
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));

  it('getTableDataById returns table data if minimum params provided', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const getTableDataByIdResponse: { table: [[], []], maxRows: number, page: number } =
      {table: [[], []], maxRows: 0, page: 0};

    // Act
    // let result = service.getTableDataById('refTable', 'customerColumn', 'customersNumber');
    expectAsync(service.getTableDataById('refTable', ViewQueryTypes.MAIN_TABLE,
      'customerColumn', 'customersNumber'))
      .toBeResolvedTo(getTableDataByIdResponse);

    // Assert
    // expect(result).toEqual(getTableDataBody);
    // // getTableDataById should have made one request to POST data of table
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/table');
    //
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    //
    // // Expect server to return the table data after POST
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataBody});
    // req.event(expectedResponse);
  }));

  // it('getTableDataById resolve result', fakeAsync(() => {
  //
  //   // Arrange
  //   const url = constants.SERVER_URL + '/table';
  //   const service: TableDataService = TestBed.inject(TableDataService);
  //   const result = { success: true, message: 'text', data: '' };
  //
  //   // Act & Assert
  //   expectAsync(service.getTableDataById('refTable', 'customerColumn', 'customersNumber'))
  //     .toBeResolvedTo(result);
  //
  //   httpTestingController.expectOne(url).flush(result);
  // }));
  //
  // it('getTableDataById returns error message', fakeAsync(() => {
  //
  //   // Arrange
  //   const url = constants.SERVER_URL + '/table';
  //   const service: TableDataService = TestBed.inject(TableDataService);
  //   const errorEvent: ErrorEvent = new ErrorEvent('network error');
  //   const mockResponse: HttpErrorResponse =
  //     new HttpErrorResponse({ status: 0, statusText: '', url: url, error: errorEvent });
  //
  //   // Act & Assert
  //   expectAsync(service.getTableDataById('refTable', 'customerColumn', 'customersNumber'))
  //     .toBeRejectedWith(mockResponse);
  //
  //   httpTestingController.expectOne(url).error(errorEvent);
  // }));

  it('checkTableData returns undefined if refTable is not set', async (done) => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);

    // Act & Assert
    await expectAsync(service.checkTableData(undefined, {}, true))
      .toBeRejectedWith(undefined);

    done();
  });

  it('checkTableData returns undefined if objectData is not set', async (done) => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);

    // Act & Assert
    await expectAsync(service.checkTableData('refTable', undefined, true))
      .toBeRejectedWith(undefined);

    done();
  });

  it('checkTableData returns data if refTable is set', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const getTableDataBody: { result: any } = {result: {}};

    // Act
    expectAsync(service.checkTableData('refTable', {}, true)).toBeResolvedTo(getTableDataBody);

    // Assert
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/check');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));

  it('checkTableData resolve result', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/check';
    const service: TableDataService = TestBed.inject(TableDataService);
    const result: { result: any } = {result: {}};

    // Act & Assert
    expectAsync(service.checkTableData('refTable', {}, true)).toBeResolvedTo(result);

    httpTestingController.expectOne(url).flush(result);
  }));

  it('checkTableData returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/check';
    const service: TableDataService = TestBed.inject(TableDataService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({status: 0, statusText: '', url: url, error: errorEvent});

    // Act & Assert
    expectAsync(service.checkTableData('refTable', {}, true)).toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('searchTableColumnData returns undefined if refTable is not set', async (done) => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);

    // Act
    await expectAsync(service.searchTableColumnData(undefined, 'searchColumn',
      'searchText', 'primaryColumn', 'primaryValue', true,
      false, "")).toBeRejectedWith(undefined);

    // Assert
    // expect(result).toEqual(undefined);
    done();
  });

  it('searchTableColumnData returns [] if refTable is not set', async (done) => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);

    // Act & Assert
    await expectAsync(service.searchTableColumnData(undefined, 'searchColumn', 'searchText',
      'primaryColumn', 'primaryValue', true, true, ""))
      .toBeRejectedWith([]);

    done();
  });

  it('searchTableColumnData returns data if refTable is set', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    // const getTableDataBody = {
    //   refTable: 'refTable',
    //   searchColumn: 'searchColumn',
    //   searchText: 'searchText',
    //   primaryColumn: 'primaryColumn',
    //   primaryValue: 'primaryValue',
    //   searchWithLike: true,
    //   additionalColumns: ""
    // };
    // const getTableDataResponse = {result: 'jsonResult'};

    // Act
    expectAsync(service.searchTableColumnData('refTable', 'searchColumn', 'searchText',
      'primaryColumn', 'primaryValue', true, true, ""))
      .toBeResolvedTo([]);

    // Assert
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/search');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));


  it('searchTableColumnData resolve result', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/search';
    const service: TableDataService = TestBed.inject(TableDataService);
    const result = {success: true, message: 'text', data: ''};

    // Act & Assert
    expectAsync(service.searchTableColumnData('refTable', 'searchColumn', 'searchText',
      'primaryColumn', 'primaryValue', true, true, "")).toBeResolvedTo(result);

    httpTestingController.expectOne(url).flush(result);
  }));

  it('searchTableColumnData returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/search';
    const service: TableDataService = TestBed.inject(TableDataService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({status: 0, statusText: '', url: url, error: errorEvent});

    // Act & Assert
    expectAsync(service.searchTableColumnData('refTable', 'searchColumn', 'searchText',
      'primaryColumn', 'primaryValue', true, true, ""))
      .toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('getFormDataByCustomersNumber calls /createform and returns data', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const getTableDataBody = {
      id: 'refTable',
      language: 'DE_DE'
    };
    spyOn(localStorage, "getItem").and.returnValue('DE_DE');

    // Act
    expectAsync(service.getFormDataByCustomersNumber('refTable', 'customerColumn',
      'customersNumber', 'secondColumn', 'secondId', true))
      .toBeRejectedWith(getTableDataBody);

    // Assert
    expect(localStorage.getItem).toHaveBeenCalled();
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/createform');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));

  it('getFormDataByCustomersNumber calls /form and returns data', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const getTableDataBody = {
      id: 'refTable',
      customercolumn: 'customerColumn',
      customerid: 'customersNumber',
      secondcolumn: 'secondColumn',
      secondid: 'secondId',
      language: 'DE_DE'
    };
    spyOn(localStorage, "getItem").and.returnValue('DE_DE');

    // Act
    expectAsync(service.getFormDataByCustomersNumber('refTable', 'customerColumn',
      'customersNumber', 'secondColumn', 'secondId', false))
      .toBeResolvedTo(getTableDataBody);

    // Assert
    expect(localStorage.getItem).toHaveBeenCalled();
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/form');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));

  it('getFormDataByCustomersNumber resolve result', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/form';
    const service: TableDataService = TestBed.inject(TableDataService);
    const result = {success: true, message: 'text', data: ''};

    // Act & Assert
    expectAsync(service.getFormDataByCustomersNumber('refTable', 'customerColumn',
      'customersNumber', 'secondColumn', 'secondId', false))
      .toBeResolvedTo(result);

    httpTestingController.expectOne(url).flush(result);
  }));

  it('getFormDataByCustomersNumber returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/form';
    const service: TableDataService = TestBed.inject(TableDataService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({status: 0, statusText: '', url: url, error: errorEvent});

    // Act & Assert
    expectAsync(service.getFormDataByCustomersNumber('refTable', 'customerColumn',
      'customersNumber', 'secondColumn', 'secondId', false))
      .toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('getFormDataByItem calls /form and returns data', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const getTableDataBody = {
      id: 'refTable',
      customercolumn: 'ITMNUM',
      customerid: 'itemNumber',
      secondcolumn: undefined,
      secondid: undefined,
      language: 'DE_DE'
    };
    spyOn(localStorage, "getItem").and.returnValue('DE_DE');

    // Act
    expectAsync(service.getFormDataByItem('refTable', 'itemNumber')).toBeResolvedTo(getTableDataBody);

    // Assert
    expect(localStorage.getItem).toHaveBeenCalled();
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/form');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));

  it('getFormDataByItem resolve result', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/form';
    const service: TableDataService = TestBed.inject(TableDataService);
    const result = {success: true, message: 'text', data: ''};

    // Act & Assert
    expectAsync(service.getFormDataByItem('refTable', 'itemNumber')).toBeResolvedTo(result);

    httpTestingController.expectOne(url).flush(result);
  }));

  it('getFormDataByItem returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/form';
    const service: TableDataService = TestBed.inject(TableDataService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({status: 0, statusText: '', url: url, error: errorEvent});

    // Act & Assert
    expectAsync(service.getFormDataByItem('refTable', 'itemNumber')).toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('getFormlyFormData calls /getform and returns form data', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const getFormlyFormBody: { row: { data: {}, rows: number, page: number } } =
      {row: {data: {}, rows: 0, page: 0}};
    spyOn(localStorage, "getItem").and.returnValue('DE_DE');

    // Act
    expectAsync(service.getFormlyFormData('refTable', 'customerColumn',
      'customersNumber', 'secondColumn', 'secondId'))
      .toBeResolvedTo(getFormlyFormBody);

    flush();

    // Assert
    expect(localStorage.getItem).toHaveBeenCalled();
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/getform');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));


  it('getFormlyFormData resolve result', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/getform';
    const service: TableDataService = TestBed.inject(TableDataService);
    const getFormlyFormBody: { row: { data: {}, rows: number, page: number } } =
      {row: {data: {}, rows: 0, page: 0}};
    // const result = {success: true, message: 'text', data: ''};

    // Act & Assert
    expectAsync(service.getFormlyFormData('refTable', 'customerColumn',
      'customersNumber', 'secondColumn', 'secondId')).toBeResolvedTo(getFormlyFormBody);

    httpTestingController.expectOne(url).flush(getFormlyFormBody);
  }));

  it('getFormlyFormData returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/getform';
    const service: TableDataService = TestBed.inject(TableDataService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({status: 0, statusText: '', url: url, error: errorEvent});

    // Act & Assert
    expectAsync(service.getFormlyFormData('refTable', 'customerColumn',
      'customersNumber', 'secondColumn', 'secondId')).toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('getFormlyFormData returns undefined if refTable is undefined', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);

    // Act & Assert
    expectAsync(service.getFormlyFormData(undefined, 'customerColumn',
      'customersNumber', 'secondColumn', 'secondId'))
      .toBeRejectedWith(undefined);
  }));

  it('getFormlyForm calls /formlyform and returns form data', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const getTableDataBody = {formTemplate: 'formTemplate'};

    // Act
    expectAsync(service.getFormlyForm('refTable')).toBeResolvedTo(getTableDataBody);

    // Assert
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/formlyform');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));

  it('getFormlyForm resolve result', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/formlyform';
    const service: TableDataService = TestBed.inject(TableDataService);
    const result = {formTemplate: 'formTemplate'};

    // Act & Assert
    expectAsync(service.getFormlyForm('refTable')).toBeResolvedTo(result);

    httpTestingController.expectOne(url).flush(result);
  }));

  it('getFormlyForm returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/formlyform';
    const service: TableDataService = TestBed.inject(TableDataService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({status: 0, statusText: '', url: url, error: errorEvent});

    // Act & Assert
    expectAsync(service.getFormlyForm('refTable')).toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('getFormlyForm returns undefined if refTable is undefined', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);

    // Act & Assert
    expectAsync(service.getFormlyForm(undefined)).toBeRejectedWith(undefined);
  }));

  it('setTableData with new item mode = true, calls /insert and returns {result: result}', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const newItemMode: boolean = true;
    const saveData: {
      refTable: string, tableName: string, dataArray: {}, primaryKey: string, primaryValue: string, isIdentity: boolean,
      newItemMode: boolean, secondaryKey: string, secondaryValue: any, thirdKey?: string, thirdValue?: string
    } = {
      refTable: 'refTable', tableName: 'TABLE_NAME', dataArray: {}, primaryKey: 'primaryKey',
      primaryValue: 'primaryValue', isIdentity: false, newItemMode: newItemMode, secondaryKey: 'secondaryKey',
      secondaryValue: 'secondaryValue', thirdKey: 'thirdKey', thirdValue: 'thirdValue'
    };
    const getTableDataResponse: { result: { success: boolean, message: string, data: [] } } =
      {result: {success: true, message: '', data: []}};

    // Act
    expectAsync(service.setTableData(saveData)).toBeResolvedTo(getTableDataResponse);

    // Assert
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/insert');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));

  it('setTableData with new item mode = false, calls /update and returns {result: result}', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const newItemMode: boolean = false;
    const saveData: {
      refTable: string, tableName: string, dataArray: {}, primaryKey: string, primaryValue: string, isIdentity: boolean,
      newItemMode: boolean, secondaryKey: string, secondaryValue: any, thirdKey?: string, thirdValue?: string
    } = {
      refTable: 'refTable', tableName: 'TABLE_NAME', dataArray: {}, primaryKey: 'primaryKey',
      primaryValue: 'primaryValue', isIdentity: false, newItemMode: newItemMode, secondaryKey: 'secondaryKey',
      secondaryValue: 'secondaryValue', thirdKey: 'thirdKey', thirdValue: 'thirdValue'
    };
    // const getTableDataBody = {
    //   tableName: 'refTable', elementsArray: {},
    //   pKey: 'primaryKey', pValue: 'primaryValue',
    //   sKey: 'secondaryKey', sValue: 'secondaryValue',
    //   tKey: 'thirdKey', tValue: 'thirdValue'
    // };
    const getTableDataResponse: { result: { success: boolean, message: string, data: [] } } =
      {result: {success: true, message: '', data: []}};

    // Act
    expectAsync(service.setTableData(saveData)).toBeResolvedTo(getTableDataResponse);

    // Assert
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/update');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));

  it('setTableRowsData with new item mode = true, returns {error: ...}', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const newItemMode: boolean = true;
    const getTableDataResponse = {error: 'newItemMode true is not supported.'};

    // Act
    expectAsync(service.setTableRowsData('refTable', {}, 'primaryKey', 'primaryValue',
      newItemMode, 'secondaryKey', 'secondaryValue', 'thirdKey', 'thirdValue'))
      .toBeRejectedWith(getTableDataResponse);

    // solves "An error was thrown in afterAll - [object Object] thrown" error
    TestBed.resetTestingModule();
  }));

  it('setTableRowsData with new item mode = false, calls /updateRows and returns {result: result}', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const newItemMode: boolean = false;
    // const getTableDataBody = {
    //   tableName: 'refTable', elementsArray: {},
    //   pKey: 'primaryKey', pValue: 'primaryValue',
    //   sKey: 'secondaryKey', sValue: 'secondaryValue',
    //   tKey: 'thirdKey', tValue: 'thirdValue'
    // };
    const getTableDataResponse = {result: 'result'};

    // Act
    expectAsync(service.setTableRowsData('refTable', {}, 'primaryKey', 'primaryValue',
      newItemMode, 'secondaryKey', 'secondaryValue', 'thirdKey', 'thirdValue'))
      .toBeResolvedTo(getTableDataResponse);

    // Assert
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/updateRows');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));

  it('setTableRowsData resolve result', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/updateRows';
    const newItemMode: boolean = false;
    const service: TableDataService = TestBed.inject(TableDataService);
    const result: { result: any } | { error: any } = {result: {success: true, message: 'text', data: ''}};

    // Act & Assert
    expectAsync(service.setTableRowsData('refTable', {}, 'primaryKey', 'primaryValue',
      newItemMode, 'secondaryKey', 'secondaryValue', 'thirdKey', 'thirdValue'))
      .toBeResolvedTo(result);

    httpTestingController.expectOne(url).flush(result);
  }));

  it('setTableRowsData returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/updateRows';
    const newItemMode: boolean = false;
    const service: TableDataService = TestBed.inject(TableDataService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({status: 0, statusText: '', url: url, error: errorEvent});

    // Act & Assert
    expectAsync(service.setTableRowsData('refTable', {}, 'primaryKey', 'primaryValue',
      newItemMode, 'secondaryKey', 'secondaryValue', 'thirdKey', 'thirdValue'))
      .toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('deleteTableData calls /delete and returns {result: result}', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    // const getTableDataBody = {
    //   tableName: 'refTable',
    //   pKey: 'primaryKey', pValue: 'primaryValue',
    //   sKey: 'secondaryKey', sValue: 'secondaryValue',
    //   tKey: 'thirdKey', tValue: 'thirdValue',
    //   userRole: 'userRole'
    // };
    const getTableDataResponse = {result: 'result'}; // {success: 'Fertig'} {error: 'Not allowed!'}

    // Act
    expectAsync(service.deleteTableData('refTable', 'primaryKey', 'primaryValue',
      'secondaryKey', 'secondaryValue', 'thirdKey', 'thirdValue',
      'userRole')).toBeResolvedTo(getTableDataResponse);

    // Assert
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/delete');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));

  it('deleteTableData resolve result', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/delete';
    const service: TableDataService = TestBed.inject(TableDataService);
    const result = {success: true, message: 'text', data: ''};

    // Act & Assert
    expectAsync(service.deleteTableData('refTable', 'primaryKey', 'primaryValue',
      'secondaryKey', 'secondaryValue', 'thirdKey', 'thirdValue',
      'userRole')).toBeResolvedTo(result);

    httpTestingController.expectOne(url).flush(result);
  }));

  it('deleteTableData returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/delete';
    const service: TableDataService = TestBed.inject(TableDataService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({status: 0, statusText: '', url: url, error: errorEvent});

    // Act & Assert
    expectAsync(service.deleteTableData('refTable', 'primaryKey', 'primaryValue',
      'secondaryKey', 'secondaryValue', 'thirdKey', 'thirdValue',
      'userRole')).toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('setDeliveryNote calls /createnote and returns {message: result}', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    // const getTableDataBody = {
    //   thisItem: 'thisItem',
    //   pKey: 'primaryKey',
    //   pValue: 'primaryValue',
    //   userName: 'userName',
    //   language: 'language',
    //   components: 'components',
    //   partlyDelivery: false,
    // };
    const getTableDataResponse: { message: { success: boolean, errorCode: string, newDeliveryNote: string, positions: string } } =
      {
        message: {
          success: true,
          errorCode: 'notesResult',
          newDeliveryNote: DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM.DELIVERY_NOTES_NUMBER,
          positions: OrdersTestConstants.ORDERS_POSITION_ITEM.ORDERS_NUMBER
        }
      };

    // Act
    expectAsync(service.setDeliveryNote('thisItem', 'primaryKey', 'primaryValue',
      'userName', 'language', 'components', false))
      .toBeResolvedTo(getTableDataResponse);

    // Assert
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/createnote');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));

  it('setDeliveryNote resolve result', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/createnote';
    const service: TableDataService = TestBed.inject(TableDataService);
    // const result = { success: true, message: 'text', data: '' };
    const getTableDataResponse: { message: {success: boolean,  errorCode: string, newDeliveryNote: string, positions: string } } =
      {
        message: {
          success: true,
          errorCode: 'notesResult',
          newDeliveryNote: DeliveryNotesTestConstants.DELIVERY_NOTE_ITEM.DELIVERY_NOTES_NUMBER,
          positions: OrdersTestConstants.ORDERS_POSITION_ITEM.ORDERS_NUMBER
        }
      };

    // Act & Assert
    expectAsync(service.setDeliveryNote('thisItem', 'primaryKey', 'primaryValue',
      'userName', 'language', 'components', false)).toBeResolvedTo(getTableDataResponse);

    httpTestingController.expectOne(url).flush(getTableDataResponse);
  }));

  it('setDeliveryNote returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/createnote';
    const service: TableDataService = TestBed.inject(TableDataService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({status: 0, statusText: '', url: url, error: errorEvent});

    // Act & Assert
    expectAsync(service.setDeliveryNote('thisItem', 'primaryKey', 'primaryValue',
      'userName', 'language', 'components', false)).toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  // it('setInvoice calls /createnote and returns result', fakeAsync(() => {
  //
  //   // Arrange
  //   const service: TableDataService = TestBed.inject(TableDataService);
  //   // const getTableDataBody = {
  //   //   thisItem: 'thisItem',
  //   //   pKey: 'primaryKey',
  //   //   pValue: 'primaryValue',
  //   //   sKey: 'secondaryKey',
  //   //   sValue: 'secondaryValue',
  //   //   userName: 'userName',
  //   //   language: 'language',
  //   //   // partlyInvoice: false,
  //   // };
  //   const setInvoiceResponse: { message: {success: boolean,  errorCode: string, newInvoice: string, positions: string } } =
  //     {
  //       message: {
  //         success: true,
  //         errorCode: 'notesResult',
  //         newInvoice: InvoicesTestConstants.INVOICE_ITEM.INVOICES_NUMBER,
  //         positions: OrdersTestConstants.ORDERS_POSITION_ITEM.ORDERS_NUMBER
  //       }
  //     };
  //
  //   // Act
  //   expectAsync(service.setInvoice('thisItem', 'primaryKey', 'primaryValue',
  //     'secondaryKey', 'secondaryValue', 'userName', 'language'))
  //     .toBeResolvedTo(setInvoiceResponse);
  //
  //   // Assert
  //   // const req = httpTestingController.expectOne(constants.SERVER_URL + '/createinvoice');
  //   // expect(req.request.method).toEqual('POST');
  //   // expect(req.request.body).toEqual(getTableDataBody);
  //   // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
  //   // req.event(expectedResponse);
  // }));

  it('setInvoice resolve result', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/createinvoice';
    const service: TableDataService = TestBed.inject(TableDataService);
    const setInvoiceResponse: { message: {success: boolean,  errorCode: string, newInvoice: string, positions: string } } =
      {
        message: {
          success: true,
          errorCode: 'notesResult',
          newInvoice: InvoicesTestConstants.INVOICE_ITEM.INVOICES_NUMBER,
          positions: OrdersTestConstants.ORDERS_POSITION_ITEM.ORDERS_NUMBER
        }
      };

    // Act & Assert
    expectAsync(service.setInvoice({
      thisItem: 'thisItem', primaryKey: 'primaryKey', primaryValue: 'primaryValue',
      secondaryKey: 'secondaryKey', secondaryValue: 'secondaryValue', userName: 'userName', language: 'language',
      partlyDelivery: false
    }))
      .toBeResolvedTo(setInvoiceResponse);

    httpTestingController.expectOne(url).flush(setInvoiceResponse);
  }));

  it('setInvoice returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/createinvoice';
    const service: TableDataService = TestBed.inject(TableDataService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({status: 0, statusText: '', url: url, error: errorEvent});

    // Act & Assert
    expectAsync(service.setInvoice({
      thisItem: 'thisItem', primaryKey: 'primaryKey', primaryValue: 'primaryValue',
      secondaryKey: 'secondaryKey', secondaryValue: 'secondaryValue', userName: 'userName', language: 'language',
      partlyDelivery: false
    }))
      .toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('showPDF calls /downloadpdf and returns {result: result}', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    // const getTableDataBody = {
    //   fullPath: 'fullPath',
    //   pdfFilename: 'pdfFilename',
    //   refTable: 'refTable',
    //   language: 'language'
    // };
    const getTableDataResponse = {message: 'notesResult'};

    // Act
    expectAsync(service.showPDF('fullPath', 'pdfFilename', 'refTable', 'language'))
      .toBeResolvedTo(getTableDataResponse);

    // Assert
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/downloadpdf');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));

  it('showPDF resolve result', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/downloadpdf';
    const service: TableDataService = TestBed.inject(TableDataService);
    const result = {success: true, message: 'text', data: ''};

    // Act & Assert
    expectAsync(service.showPDF('fullPath', 'pdfFilename', 'refTable', 'language'))
      .toBeResolvedTo(result);

    httpTestingController.expectOne(url).flush(result);
  }));

  it('showPDF returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/downloadpdf';
    const service: TableDataService = TestBed.inject(TableDataService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({status: 0, statusText: '', url: url, error: errorEvent});

    // Act & Assert
    expectAsync(service.showPDF('fullPath', 'pdfFilename', 'refTable', 'language'))
      .toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('deleteTableLocks calls /deleteTableLocks and returns {result: result}', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const getTableDataBody = {
      deleteAll: true,
      tableName: 'tableName',
      dataSet: 'dataSet',
      lockedBy: 'lockedBy'
    };
    const getTableDataResponse = true;

    // Act
    expectAsync(service.deleteTableLocks(true, 'tableName', 'dataSet', 'lockedBy'))
      .toBeResolvedTo(getTableDataResponse);

    // Assert
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/deleteTableLocks');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));

  it('deleteTableLocks resolve result', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/deleteTableLocks';
    const service: TableDataService = TestBed.inject(TableDataService);
    const result = {success: true, message: 'text', data: ''};

    // Act & Assert
    expectAsync(service.deleteTableLocks(true, 'tableName', 'dataSet', 'lockedBy')).toBeResolvedTo(result);

    httpTestingController.expectOne(url).flush(result);
  }));

  it('deleteTableLocks returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/deleteTableLocks';
    const service: TableDataService = TestBed.inject(TableDataService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({status: 0, statusText: '', url: url, error: errorEvent});

    // Act & Assert
    expectAsync(service.deleteTableLocks(true, 'tableName', 'dataSet', 'lockedBy'))
      .toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('removeTableLocks returns {locked: false, ...} if refTable is not set', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const setTableDataResponse: { result: { success: boolean, message: string, data: [] } } =
      {result: {success: true, message: '', data: []}};
    spyOn(service, "setTableData").and.returnValue(Promise.resolve(setTableDataResponse));

    // Act & Assert
    expectAsync(service.removeTableLocks('columnTable', 'tableName', 'columnData'))
      .toBeResolvedTo(setTableDataResponse);
    expect(service.setTableData).toHaveBeenCalled();
  }));

  it('removeTableLocks calls callback with {error: ...} if http error is occurred', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    spyOn(service, "setTableData").and.returnValue(Promise.reject(errorResponse));
    // spyOn(service, "handleHttpError").and.callThrough();

    // Act & Assert
    expectAsync(service.removeTableLocks('columnTable', 'tableName', 'columnData'))
      .toBeRejectedWith(errorResponse);
    expect(service.setTableData).toHaveBeenCalled();
    // expect(service.handleHttpError).toHaveBeenCalled();
  }));

  // ToDo: Disable this test and enable isTableLocked tests bellow, at production mode
  it('isTableLocked returns false', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const isTableLockedResponse = false;

    // Act &  Assert
    expectAsync(service.isTableLocked('refTableTitle', 'customerNumber', 'lockedMessage'))
      .toBeResolvedTo(isTableLockedResponse);
  }));

  xit('isTableLocked returns false if customer number not set', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const isTableLockedResponse = false;

    // Act &  Assert
    expectAsync(service.isTableLocked('refTableTitle', undefined, 'lockedMessage'))
      .toBeResolvedTo(isTableLockedResponse);
  }));

  // ToDo: Test if private functions have been called...
  /*
  it('isTableLocked returns true if customer number is set and gtbResult is undefined', () => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const callbackObject = {func: () => {}};
    const getTableDataByIdResponse = {table: [[], []] };
    // const isTableLockedResponse = false;
    // window['CONSTANTS'] = "LOCKED_DATASET"; // declare constants
    // spyOn(service,"getTableLocks").and.callThrough();
    // .and.returnValue(of({locked: false, lockedByCurrentUser: false})); // spy on private function
    spyOn(service,"getTableDataById").and.returnValue( of(getTableDataByIdResponse) );
    spyOn(callbackObject, 'func');

    // Act
    service.isTableLocked('orders', 'customerNumber', 'lockedMessage',
      callbackObject.func);

    // Assert
    // expect(service.getTableLocks).toHaveBeenCalled();
    expect(service.getTableDataById).toHaveBeenCalled();
    // expect(callbackObject.func).toHaveBeenCalled();
    // expect(callbackObject.func).toHaveBeenCalledWith(isTableLockedResponse);
  });
  */

  it('getLastIdOfTable returns table data if full params provided', fakeAsync(() => {

    // Arrange
    const tableName: string = 'tableName';
    const columnName: string = 'columnName';
    const uniqueColumnName: string = 'uniqueColumnName';
    const uniqueValue: string = 'uniqueValue';
    const service: TableDataService = TestBed.inject(TableDataService);
    const getTableDataBody: { id: string } = {id: 'abc'};

    // Act
    expectAsync(service.getLastIdOfTable(tableName, columnName, uniqueColumnName, uniqueValue)).toBeResolvedTo(getTableDataBody);

    // Assert
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/getLastTableId');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));

  it('removeAllTableLocks returns {}', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const removeAllTableLocksResponse = {};
    spyOn(service, "deleteTableLocks").and.returnValue(Promise.resolve(removeAllTableLocksResponse));

    // Act & Assert
    expectAsync(service.removeAllTableLocks(true, 'tableName', 'dataSet'))
      .toBeResolvedTo(removeAllTableLocksResponse);
    expect(service.deleteTableLocks).toHaveBeenCalled();
  }));

  it('removeAllTableLocks calls callback with false if http error is occurred', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    spyOn(service, "deleteTableLocks").and.returnValue(Promise.reject(errorResponse));
    // spyOn(service, "handleHttpError").and.callThrough();

    // Act & Assert
    expectAsync(service.removeAllTableLocks(true, 'tableName', 'dataSet'))
      .toBeRejectedWith(errorResponse);
    expect(service.deleteTableLocks).toHaveBeenCalled();
    // expect(service.handleHttpError).toHaveBeenCalled();
  }));

  it('handleHttpError console logs \'Server-side error occurred.\' if server error occurred', (done) => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    console.log = jasmine.createSpy("log");
    const error: HttpErrorResponse = ErrorsTestConstants.HTTP_ERROR;

    // Act
    service.handleHttpError(error);

    // Assert
    expect(console.log).toHaveBeenCalledWith('Server-side error occurred.');
    done();
  });

  it('handleHttpError console logs \'Client-side error occurred.\' if client error occurred', (done) => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    console.log = jasmine.createSpy("log");
    const error: HttpErrorResponse = ErrorsTestConstants.ERROR;

    // Act
    service.handleHttpError(error);

    // Assert
    expect(console.log).toHaveBeenCalledWith('Client-side error occurred.');
    done();
  });

  it('handleHttpError console logs \'Server-side error occurred.\' and do logout, if 401 error occurred',
    fakeAsync((done) => {

      // Arrange
      const service: TableDataService = TestBed.inject(TableDataService);
      console.log = jasmine.createSpy("log");
      const error: HttpErrorResponse = ErrorsTestConstants.HTTP_ERROR_401;
      const router: Router = TestBed.inject(Router);
      spyOn(router, "navigateByUrl").and.returnValue(Promise.resolve(true));
      spyOn(router, "navigate").and.returnValue(Promise.resolve(true));

      // Act
      service.handleHttpError(error);

      // Assert
      expect(console.log).toHaveBeenCalledWith('Server-side error occurred.');
      tick();
      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toBeTruthy();
      expect(router.navigate).toHaveBeenCalled();
      expect(router.navigate).toBeTruthy();
      // done();
    }));

  it('openNewWindow returns table rows number', () => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const refTable: string = 'orders';
    const features: string =
      'location=yes,width=800,height=600,left=200,top=200,scrollbars=yes,status=no,menubar=no,toolbar=no,titlebar=no';
    const mouseClick = document.createEvent('MouseEvent');
    mouseClick.initEvent('mouseclick', true, true);
    document.dispatchEvent(mouseClick);
    spyOn(window, 'open');
    spyOn(mouseClick, 'preventDefault');
    spyOn(mouseClick, 'stopPropagation');

    // Act
    service.openNewWindow(mouseClick, refTable);

    // Assert
    expect(mouseClick.preventDefault).toHaveBeenCalled();
    expect(mouseClick.stopPropagation).toHaveBeenCalled();
    expect(window.open).toBeDefined();
    expect(window.open).toHaveBeenCalledWith(constants.SERVER_URL + '/#/' + refTable, '', features);
  });

  it('tryAllocate returns allocable data', fakeAsync(() => {

    // Arrange
    const service: TableDataService = TestBed.inject(TableDataService);
    const getTableDataBody = {type: 'type', data: 'data'};
    const getTableDataResponse = {success: true, message: 'OK', data: {}};

    // Act
    expectAsync(service.tryAllocate('type', 'data')).toBeResolvedTo(getTableDataResponse);

    // Assert
    // const req = httpTestingController.expectOne(constants.SERVER_URL + '/allocate');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(getTableDataBody);
    // const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getTableDataResponse});
    // req.event(expectedResponse);
  }));

  it('tryAllocate resolve result', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/allocate';
    const service: TableDataService = TestBed.inject(TableDataService);
    const result = {success: true, message: 'text', data: ''};

    // Act & Assert
    expectAsync(service.tryAllocate('type', 'data')).toBeResolvedTo(result);

    httpTestingController.expectOne(url).flush(result);
  }));

  it('tryAllocate returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/allocate';
    const service: TableDataService = TestBed.inject(TableDataService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({status: 0, statusText: '', url: url, error: errorEvent});

    // Act & Assert
    expectAsync(service.tryAllocate('type', 'data')).toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('return last column value', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/getLastColumnValue';
    const tableName: string = constants.REFTABLE_COUNTRIES_TITLE;
    const columnName: string = constants.REFTABLE_COUNTRIES_COLUMN;
    const service: TableDataService = TestBed.inject(TableDataService);
    const result = {value: '12345'};

    // Act & Assert
    expectAsync(service.getLastColumnValue(tableName, columnName)).toBeResolvedTo(result);

    httpTestingController.expectOne(url).flush(result);

  }));

  it('should update column', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/updateColumn';
    const tableName: string = constants.REFTABLE_COUNTRIES_TITLE;
    const columnName: string = constants.REFTABLE_COUNTRIES_COLUMN;
    const whereColumnValue: string = constants.REFTABLE_COUNTRIES_COLUMN;
    const service: TableDataService = TestBed.inject(TableDataService);
    const result = true;

    // Act & Assert
    expectAsync(service.updateColumn(tableName, columnName, whereColumnValue)).toBeResolvedTo(result);

    httpTestingController.expectOne(url).flush(result);

  }));

  it('should insert into temp', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/insertTemp';
    const idTempField: number = 1;
    const idTempConst: number = 1;
    const service: TableDataService = TestBed.inject(TableDataService);
    const expectedResult = {result: {}};

    // Act
    service.insertIntoTemp(idTempField, idTempConst).subscribe((result) => {
        // Assert
        expect(result).toEqual(expectedResult);
      }
    );

    tick();

    httpTestingController.expectOne(url).flush(expectedResult);

  }));
});
