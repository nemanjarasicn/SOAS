import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {LogoutComponent} from './logout.component';
import {AppComponent} from "../../app.component";
import {TableDataService} from "../../_services/table-data.service";
import {NavigationEnd, Router, RouterOutlet} from "@angular/router";
import {AppRoutingModule} from "../../app-routing.module";
import {of} from "rxjs";
import {NO_ERRORS_SCHEMA} from "@angular/core";

class MockServices {
  // Router
  // const eventSubject = new ReplaySubject<RouterEvent>(1);
  navigate = jasmine.createSpy('navigate');
  events = of(new NavigationEnd(0, 'http://localhost:3000/login',
    'http://localhost:3000/login'));
  url = 'test/url'
}

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, AppRoutingModule],
      declarations: [LogoutComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [AppComponent, RouterOutlet, {provide: Router, useClass: MockServices}]
    })

    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {

    // Arrange
    console.log = jasmine.createSpy("log");
    const events = of(new NavigationEnd(2, '/', '/'));
    const router: Router = TestBed.inject(Router);
    spyOn(router.events, 'pipe').and.returnValue(events);
    // spyOn(router, "navigate").and.returnValue(Promise.resolve(true));
    spyOn(component, 'logout').and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.logout).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('logout at logout.component executed...');
  });

  it('should logout', fakeAsync(() => {

    // Arrange
    // returns a string instead of allowing the redirect to take place
    window.onbeforeunload = jasmine.createSpy();
    const appComponent: AppComponent = TestBed.inject(AppComponent);
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'removeAllTableLocks').and.returnValue(Promise.resolve({}));
    spyOn(localStorage, 'clear').and.callThrough();
    spyOn(appComponent, 'logout').and.callThrough();
    const router: Router = TestBed.inject(Router);
    // spyOn(router, "navigate").and.returnValue(Promise.resolve(true));
    spyOn(component, 'windowReload').and.callFake(function () {
    });

    // Act
    component.logout();

    tick();

    // Assert
    expect(tableDataService.removeAllTableLocks).toHaveBeenCalled();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(appComponent.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toBeTruthy();
    expect(component.windowReload).toHaveBeenCalled();
  }));

  // ERROR: location.reload do full page reload
  // it('should reload page', fakeAsync(() => {
  //
  //   // Arrange
  //   // returns a string instead of allowing the redirect to take place
  //   window.onbeforeunload = jasmine.createSpy();
  //   Object.defineProperty(location, 'reload', jasmine.createSpy('reload'));
  //
  //   // Act
  //   // component.windowReload();
  //
  //   // Assert
  // }));

});
