import {fakeAsync, TestBed, tick} from "@angular/core/testing";
import {TestingModule} from "../testing/testing.module";
import {CsvImportService} from "./csv-import.service";
import {TranslateItPipe} from "../shared/pipes/translate-it.pipe";
import {ConstantsService} from "./constants.service";
import {HttpTestingController} from "@angular/common/http/testing";
import {MessagesService} from "./messages.service";
import {MessageService} from "primeng/api";

describe('CsvImportService', () => {

  let service: CsvImportService;
  let constantsService: ConstantsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [TranslateItPipe, ConstantsService, MessagesService, MessageService]
    })

    service = TestBed.inject(CsvImportService);
    constantsService = TestBed.inject(ConstantsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return headers', () => {

    // Arrange
    const expectedResult =
      {headers: {Authorization: 'Bearer ' + localStorage.getItem(constantsService.LS_ACCESS_TOKEN)}};

    // Act
    const result = service.getHeaders();

    // Assert
    expect(result).toEqual(expectedResult);
  })

  it('setTranslatePipe returns true (show error message) if translatePipe is set', () => {

    // Arrange
    let translate: TranslateItPipe = TestBed.inject(TranslateItPipe);

    // Act
    service.setTranslatePipe(translate);

    // Assert
    expect(service['translatePipe']).toEqual(translate);
  })

  it('should import csv file', fakeAsync(() => {

    // Arrange
    const params: { template: string, file: File } =
      {
        template: 'name',
        file: new File([new ArrayBuffer(2e+5)], 'test-file.csv',
          {lastModified: null, type: 'file'})
      };
    const importCsvFileBody = new FormData();
    const importCsvFileResponse: { result: string, error: string } = {result: 'OK', error: ''};
    const messagesService: MessagesService = TestBed.inject(MessagesService);
    spyOn(messagesService, 'showInfoDialog').and.callThrough();

    // Act
    service.importCsvFile(params).then((res) => {
      // Assert
      expect(messagesService.showInfoDialog).toHaveBeenCalled();
    });

    // tick() steps through the next round of pending asynchronous activity
    // this will also step through 'setTimeout' and 'setInterval' code
    // you may have in your service, as well as Observable code
    tick();

    // Assert
    // importCsvFile should have made one request to POST data of table
    const req = httpTestingController.expectOne(constantsService.SERVER_URL + '/csvImport');

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(importCsvFileBody);

    req.flush(importCsvFileResponse);
  }))

  it('should not import csv file', fakeAsync(() => {

    // Arrange
    const params: { template: string, file: File } =
      {
        template: 'name',
        file: new File([new ArrayBuffer(2e+5)], 'test-file.csv',
          {lastModified: null, type: 'file'})
      };
    const importCsvFileBody = new FormData();
    const importCsvFileResponse: { result: string, error: string } = {result: 'ERROR', error: 'CSV Import ERROR'};
    const messagesService: MessagesService = TestBed.inject(MessagesService);
    spyOn(messagesService, 'showInfoDialog').and.callThrough();

    // Act
    service.importCsvFile(params).then((res) => {
      // Assert
      expect(messagesService.showInfoDialog).toHaveBeenCalled();
    });

    // tick() steps through the next round of pending asynchronous activity
    // this will also step through 'setTimeout' and 'setInterval' code
    // you may have in your service, as well as Observable code
    tick();

    // Assert
    // importCsvFile should have made one request to POST data of table
    const req = httpTestingController.expectOne(constantsService.SERVER_URL + '/csvImport');

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(importCsvFileBody);

    req.flush(importCsvFileResponse);
  }))

  it('should return csv types', fakeAsync(() => {

    // Arrange
    spyOn(service, 'getHeaders').and.callThrough();

    // Act
    service.getCsvTypes().subscribe((result) => {

    })

    tick();

    // Assert
    const req = httpTestingController.expectOne(constantsService.SERVER_URL + '/csvGetImportTypes');
    expect(req.request.method).toEqual('POST');

    expect(service.getHeaders).toHaveBeenCalled();
  }))

  it('should return template configs', fakeAsync(() => {

    // Arrange
    const id: number = 1;
    spyOn(service, 'getHeaders').and.callThrough();

    // Act
    service.getTemplateConfigs(id).subscribe((result) => {

    })

    tick();

    // Assert
    const req = httpTestingController.expectOne(constantsService.SERVER_URL + '/csvGetTemplateConfigs');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({id: id});

    expect(service.getHeaders).toHaveBeenCalled();
  }))
});
