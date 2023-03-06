import {TestBed} from '@angular/core/testing';

import {AppHttpService} from './app-http.service';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ConstantsService} from "./constants.service";
import {HttpClient} from "@angular/common/http";

describe('AppHttpService', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      // declarations: [],
      providers: [ConstantsService]
    })

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: AppHttpService = TestBed.get(AppHttpService);
    expect(service).toBeTruthy();
  });

  it('getHeaders returns headers data', () => {

    // Arrange
    const service: AppHttpService = TestBed.inject(AppHttpService);
    spyOn(localStorage, 'getItem').and.returnValue('ABCToken');

    // Act
    let result = service.getHeaders();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should get headers data', () => {

    // Arrange
    const service: AppHttpService = TestBed.inject(AppHttpService);
    spyOn(localStorage, 'getItem').and.returnValue('ABCToken');
    spyOn(service, 'getHeaders').and.callThrough();

    // Act
    let result = service.get('url');

    // Assert
    expect(service.getHeaders).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it('should post headers data', () => {

    // Arrange
    const service: AppHttpService = TestBed.inject(AppHttpService);
    spyOn(localStorage, 'getItem').and.returnValue('ABCToken');
    spyOn(service, 'getHeaders').and.callThrough();

    // Act
    let result = service.post('url', 'data');

    // Assert
    expect(service.getHeaders).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });
});
