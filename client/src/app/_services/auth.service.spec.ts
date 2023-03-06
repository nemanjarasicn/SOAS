import {TestBed} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ConstantsService} from "./constants.service";
import {HttpClient, HttpResponse} from "@angular/common/http";
import * as forge from "node-forge";

describe('AuthService', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      // declarations: [  ],
      providers: [ConstantsService]
    })

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

  it('should login user', () => {

    // Arrange
    const service: AuthService = TestBed.inject(AuthService);
    const user: string = 'user';
    const pass: string = 'pass';
    let md = forge.md.sha256.create();
    md.update(pass.toString());
    const getLoginBody = {us: user, pa: md.digest().toHex()};
    const getLoginResponse = {
      token: 'ABCToken', localize: [{DE_DE: 'zurück', LOCALIZE_TAG: 'BACK'},
        {DE_DE: 'abbruch', LOCALIZE_TAG: 'CANCEL'},], language: 'DE_DE', username: 'GB', role: 'guest'
    };
    spyOn(localStorage, 'removeItem').and.callThrough();
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOnProperty(service, 'loggedIn', 'get').and.callThrough();

    // Act
    service.login('user', 'pass').subscribe(
      data => {
        expect(data).toEqual(true, 'should return the login user');
      }, fail
    );

    // Assert
    // login should have made one request to POST login
    const req = httpTestingController.expectOne('auth');

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(getLoginBody);

    // Expect server to return the login user after POST
    const expectedResponse = new HttpResponse({status: 201, statusText: 'Created', body: getLoginResponse});
    req.event(expectedResponse);
  });

  it('should logout user and empty local storage', () => {

    // Arrange
    const service: AuthService = TestBed.inject(AuthService);
    spyOn(localStorage, 'removeItem').and.callThrough();
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOnProperty(service, 'loggedIn', 'get').and.callThrough();

    // Act
    service.logout();

    // Assert
    expect(localStorage.removeItem).toHaveBeenCalled();
    expect(localStorage.removeItem).toBeTruthy();
    expect(service.loggedIn).toEqual(false);
  });

  it('should return true if user is logged in', () => {

    // Arrange
    const service: AuthService = TestBed.inject(AuthService);
    spyOn(localStorage, 'getItem').and.returnValue('ABCToken');

    // Act
    let result: boolean = service.loggedIn;

    // Assert
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(localStorage.getItem).toBeTruthy();
    expect(result).toBeTruthy();
  });

});
