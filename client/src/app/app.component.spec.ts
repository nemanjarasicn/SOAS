import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {Router} from "@angular/router";
import {TableDataService} from "./_services/table-data.service";
import {ConstantsService} from "./_services/constants.service";
import {ChangeDetectorRef} from "@angular/core";
import {MessageService} from "primeng/api";


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let constants: ConstantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [AppComponent],
      providers: [ConstantsService, ChangeDetectorRef, MessageService]
    })
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    constants = TestBed.inject(ConstantsService);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call ngOnInit', function () {

    // Arrange
    const parentMenuItems = constants.MENU_ITEMS;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.parentMenuItems).toEqual(parentMenuItems);
    expect(component.siteNavFixed).toEqual(false);
  });

  it('should call ngAfterViewChecked', function () {

    // Arrange
    let cdRef: ChangeDetectorRef = TestBed.inject(ChangeDetectorRef);
    // spyOn(cdRef,'detectChanges').and.callThrough();

    // Act
    component.ngAfterViewChecked();

    // Assert
    // expect(cdRef.detectChanges).toHaveBeenCalled();
  });

  // private function tableDataService.removeTableLocks can not be called...
  it('should show table', fakeAsync(() => {

    // Arrange
    const selectedMenuItem: string = 'orders';
    const router = TestBed.inject(Router);
    const tableDataService = TestBed.inject(TableDataService);
    const removeAllTableLocksResponse = {};
    component.url = 'url';
    // spyOn<any>(tableDataService, 'removeTableLocks').and.callThrough(); // returnValue(Promise.resolve({}));
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    // Act
    component.showTable(selectedMenuItem);

    // Assert
    expect(component.selectedMenuItem).toEqual(selectedMenuItem);
    // expect(tableDataService['removeAllTableLocks']).toHaveBeenCalled();
    // expect(router.navigate).toHaveBeenCalled();
  }));

  it('should logout user', function () {

    // Arrange

    // Act
    component.logout();

    // Assert
  });

  it('should show new window', function () {

    // Arrange
    spyOn(window, 'open').and.callThrough();

    // Act
    component.showNewWindow();

    // Assert
    expect(window.open).toHaveBeenCalled();
  });

  // it('should return true if user is logged in', function () {
  //
  //   // Arrange
  //   const loggedIn: boolean = true;
  //
  //   // Act
  //   const result: boolean = component.isLoggedIn();
  //
  //   // Assert
  //   expect(result).toEqual(loggedIn);
  // });

  it('isLoggedIn returns false when the user has not been authenticated', () => {
    localStorage.removeItem(constants.LS_ACCESS_TOKEN);
    expect(component.isLoggedIn()).toBeFalsy();
  });

  it('isLoggedIn returns true when the user has been authenticated', () => {
    localStorage.setItem(constants.LS_ACCESS_TOKEN, '12345');
    expect(component.isLoggedIn()).toBeTruthy();
  });

  it('should toggle sidenavOpened boolean value to false', function () {

    // Arrange
    const sidenavOpened: boolean = false;
    component.sidenavOpened = true;

    // Act
    component.toggleSidenav();

    // Assert
    expect(component.sidenavOpened).toEqual(sidenavOpened);
  });

  it('should toggle tableVisible boolean value to false', function () {

    // Arrange
    const tableVisible: boolean = false;
    component.tableVisible = true;

    // Act
    component.toggleCustomTable();

    // Assert
    expect(component.tableVisible).toEqual(tableVisible);
  });

});
