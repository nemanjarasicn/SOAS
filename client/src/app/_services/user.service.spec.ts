import {fakeAsync, TestBed} from '@angular/core/testing';

import {UserService} from './user.service';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ConstantsService} from "./constants.service";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {UserTestConstants} from "../../assets/test-constants/users";

describe('UserService', () => {

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

  afterEach(() => {
    httpTestingController.verify(); // Verifies that no requests are outstanding.
  });

  it('should be created', () => {
    const service: UserService = TestBed.inject(UserService);
    expect(service).toBeTruthy();
  });

  it('getUsers returns all users', fakeAsync(() => {

    // Arrange
    const service: UserService = TestBed.inject(UserService);
    const getUsersBody = {showOnPageMax: constants.SHOW_ON_PAGE_MAX, orderCondition: 'USER_SOAS_ID'};
    const getUsersResponse = {showOnPageMax: constants.SHOW_ON_PAGE_MAX, orderCondition: 'USER_SOAS_ID'};

    // Act
    expectAsync(service.getUsers()).toBeResolvedTo(getUsersResponse);

    // Assert
    // getUsers should have made one request to POST user
    const req = httpTestingController.expectOne(constants.SERVER_URL + '/selectUser');

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(getUsersBody);

    // Expect server to return the user after POST
    const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getUsersResponse});
    req.event(expectedResponse);
  }));

  it('should call getUsers and return all users', fakeAsync(() => {

    // Arrange
    const service: UserService = TestBed.inject(UserService);
    const mockResponse = {
      USER_SOAS_ID: 8786,
      USER_SOAS_NAME: 'Andreas Lening',
      USER_SOAS_LOGIN: 'AL',
      USER_LANGUAGE: 'DE_DE'
    };

    // Act
    expectAsync(service.getUsers()).toBeResolvedTo(mockResponse);

    const mockRequest = httpTestingController.expectOne(constants.SERVER_URL + '/selectUser');
    mockRequest.flush(mockResponse);
  }));

  it('getUsers returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/selectUser';
    const service: UserService = TestBed.inject(UserService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse(
        { status: 0, statusText: '', url: url, error: errorEvent });

    // Act & Assert
    expectAsync(service.getUsers()).toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('deleteUser returns message \'deleted\' if user was deleted', fakeAsync(() => {

    // Arrange
    const service: UserService = TestBed.inject(UserService);
    const mockResponse = 'deleted';
    const userId: number = 1001;

    // Act
    expectAsync(service.deleteUser(userId)).toBeResolvedTo(mockResponse);

    const mockRequest = httpTestingController.expectOne(constants.SERVER_URL + '/deleteUser');
    mockRequest.flush(mockResponse);
  }));

  it('deleteUser returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/deleteUser';
    const userId: number = 1001;
    const service: UserService = TestBed.inject(UserService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({ status: 0, statusText: '', url: url, error: errorEvent });

    // Act & Assert
    expectAsync(service.deleteUser(userId)).toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('insertUser returns \'inserted\' message', fakeAsync(() => {

    // Arrange
    const service: UserService = TestBed.inject(UserService);
    const mockResponse = 'inserted';

    // Act
    expectAsync(service.insertUser(UserTestConstants.USER)).toBeResolvedTo(mockResponse);

    const mockRequest = httpTestingController.expectOne(constants.SERVER_URL + '/insertUser');
    mockRequest.flush(mockResponse);
  }));

  it('insertUser returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/insertUser';
    const service: UserService = TestBed.inject(UserService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({ status: 0, statusText: '', url: url, error: errorEvent });

    // Act & Assert
    expectAsync(service.insertUser(UserTestConstants.USER)).toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

  it('updateUser returns \'updated\' message', fakeAsync(() => {

    // Arrange
    const service: UserService = TestBed.inject(UserService);
    const mockResponse = 'updated';

    // Act
    expectAsync(service.updateUser(UserTestConstants.USER)).toBeResolvedTo(mockResponse);

    const mockRequest = httpTestingController.expectOne(constants.SERVER_URL + '/updateUser');
    mockRequest.flush(mockResponse);
  }));

  it('updateUser returns error message', fakeAsync(() => {

    // Arrange
    const url = constants.SERVER_URL + '/updateUser';
    const service: UserService = TestBed.inject(UserService);
    const errorEvent: ErrorEvent = new ErrorEvent('network error');
    const mockResponse: HttpErrorResponse =
      new HttpErrorResponse({ status: 0, statusText: '', url: url, error: errorEvent });

    // Act & Assert
    expectAsync(service.updateUser(UserTestConstants.USER)).toBeRejectedWith(mockResponse);

    httpTestingController.expectOne(url).error(errorEvent);
  }));

});
