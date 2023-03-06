import {fakeAsync, TestBed} from '@angular/core/testing';

import { BatchService } from './batch.service';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ConstantsService} from "./constants.service";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {BatchProcessesTestConstants} from "../../assets/test-constants/batchprocesses";

describe('BatchService', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let constants: ConstantsService;

  beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, HttpClientTestingModule],
        providers: [ConstantsService]
      })

      httpClient = TestBed.inject(HttpClient);
      httpTestingController = TestBed.inject(HttpTestingController);
      constants = TestBed.inject(ConstantsService);
  });

  it('should be created', () => {
    const service: BatchService = TestBed.get(BatchService);
    expect(service).toBeTruthy();
  });

  it('getBatches returns all batches', fakeAsync(() => {

    // Arrange
    const service: BatchService = TestBed.inject(BatchService);
    const getBatchesBody = {showOnPageMax: constants.SHOW_ON_PAGE_MAX, showTable: '0'};
    const getBatchesResponse = {showOnPageMax: constants.SHOW_ON_PAGE_MAX, showTable: '0'};

    // Act
    expectAsync(service.getBatches()).toBeResolvedTo(getBatchesResponse);

    // Assert
    // getBatches should have made one request to POST batches
    const req = httpTestingController.expectOne(constants.SERVER_URL + '/selectBatchProcesses');

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(getBatchesBody);

    // Expect server to return the batches after POST
    const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getBatchesResponse});
    req.event(expectedResponse);
  }));

  it('getBatches resolve result', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/selectBatchProcesses';
    const service: BatchService = TestBed.inject(BatchService);
    const result = 'valid result';

    // Act & Assert
    expectAsync(service.getBatches()).toBeResolvedTo(result);

    httpTestingController.expectOne(url).flush(result);
  }));

  it('getBatches returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/selectBatchProcesses';
    const service: BatchService = TestBed.inject(BatchService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({ status: 0, statusText: '', url: url, error: errorEvent });

    // Act & Assert
    expectAsync(service.getBatches()).toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('deleteBatch returns message \'deleted\' if batch was deleted', fakeAsync((done: DoneFn) => {

    // Arrange
    const service: BatchService = TestBed.inject(BatchService);
    const mockResponse = 'deleted';
    const batchName: string = '';

    // Act
    expectAsync(service.deleteBatch(batchName)).toBeResolvedTo(mockResponse);

    // Assert
    const mockRequest = httpTestingController.expectOne(constants.SERVER_URL + '/deleteBatch');
    mockRequest.flush(mockResponse);
  }));

  it('deleteBatch returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/deleteBatch';
    const service: BatchService = TestBed.inject(BatchService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const batchName: string = '';
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({ status: 0, statusText: '', url: url, error: errorEvent });

    // Act & Assert
    expectAsync(service.deleteBatch(batchName)).toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('insertBatch returns message', fakeAsync(() => {

    // Arrange
    const service: BatchService = TestBed.inject(BatchService);
    const mockResponse = 'inserted';

    // Act
    expectAsync(service.insertBatch(BatchProcessesTestConstants.BATCH_PROCESS)).toBeResolvedTo(mockResponse);

    const mockRequest = httpTestingController.expectOne(constants.SERVER_URL + '/insertBatch');
    mockRequest.flush(mockResponse);
  }));

  it('insertBatch returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/insertBatch';
    const service: BatchService = TestBed.inject(BatchService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({ status: 0, statusText: '', url: url, error: errorEvent });

    // Act & Assert
    expectAsync(service.insertBatch(BatchProcessesTestConstants.BATCH_PROCESS)).toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('updateBatch returns message', fakeAsync(() => {

    // Arrange
    const service: BatchService = TestBed.inject(BatchService);
    const mockResponse = 'not updated';

    // Act
    expectAsync(service.updateBatch(BatchProcessesTestConstants.BATCH_PROCESS)).toBeResolvedTo(mockResponse);

    const mockRequest = httpTestingController.expectOne(constants.SERVER_URL + '/updateBatch');
    mockRequest.flush(mockResponse);
  }));

  it('updateBatch returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/updateBatch';
    const service: BatchService = TestBed.inject(BatchService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({ status: 0, statusText: '', url: url, error: errorEvent });

    // Act & Assert
    expectAsync(service.updateBatch(BatchProcessesTestConstants.BATCH_PROCESS)).toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

});
