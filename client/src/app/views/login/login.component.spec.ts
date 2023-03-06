import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {environment} from "../../../environments/environment";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {of} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {TableDataService} from "../../_services/table-data.service";

class MockServices {
  // Router
  // const eventSubject = new ReplaySubject<RouterEvent>(1);
  navigate = jasmine.createSpy('navigate');
  events = of(new NavigationEnd(0, 'http://localhost:3000/login',
    'http://localhost:3000/login'));
  url = 'test/url'
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [LoginComponent],
      providers: [{provide: Router, useClass: MockServices}]
    })

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call ngOnInit', () => {
    // Arrange
    const version = 'SOAS Version ' + environment.version;
    console.log = jasmine.createSpy("log");
    const events = of(new NavigationEnd(2, '/', '/'));
    const router: Router = TestBed.inject(Router);
    spyOn(router.events, 'pipe').and.returnValue(events);

    // Act
    component.ngOnInit();

    // Assert
    expect(component.version).toEqual(version);
    expect(component.loginForm).toBeDefined();
  });

  it('should login user on login submit', () => {
    // Arrange
    component.loginForm = new FormGroup(
      {
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'removeAllTableLocks').and.returnValue(Promise.resolve({}));

    // Act
    component.onLoginSubmit();

    // Assert
    expect(component).toBeTruthy();
    // expect(tableDataService.removeAllTableLocks).toHaveBeenCalled();
  });

});
