import { NgForm, NgModel } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import { UserDialogComponent } from './user-dialog.component';
import {TableDataService} from "../../_services/table-data.service";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {UserService} from "../../_services/user.service";
import {ErrorsTestConstants} from "../../../assets/test-constants/errors";

// ToDo: Refactor - Callback replaced by Promise
describe('UserDialogComponent', () => {

  let component: UserDialogComponent;
  let fixture: ComponentFixture<UserDialogComponent>;
  let tableDataService: TableDataService;
  const dialogMock = {
    close: () => { }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [UserDialogComponent, NgForm, NgModel, TranslateItPipe],
      providers: [TranslateItPipe,
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })

    fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;
    tableDataService = TestBed.inject(TableDataService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit call', () => {

    // Arrange
    // Act
    component.ngOnInit();

    // Assert
    expect(component.roles).toEqual(['admin', 'user', 'guest']);
  });

  it('onSubmit call insert user', () => {

    // Arrange
    component.editMode = false;
    spyOn(component,"close").and.callThrough();

    // Act
    component.onSubmit();

    // Assert
    // expect(component.close).toHaveBeenCalled();
  });

  it('onSubmit call update user', fakeAsync(() => {

    // Arrange
    const userService: UserService = TestBed.inject(UserService);
    component.editMode = true;
    spyOn(userService, "updateUser").and.returnValue(Promise.resolve([]));
    spyOn(component,"close").and.callThrough();

    // Act
    component.onSubmit();

    // Assert
    expect(userService.updateUser).toHaveBeenCalled();
    // expect(component.close).toHaveBeenCalled();

  }));

  it('onSubmit not execute update user, because temp is undefined', () => {

    // Arrange
    const userService: UserService = TestBed.inject(UserService);
    component.editMode = true;
    spyOn(userService, "updateUser").and.returnValue(undefined);
    spyOn(component,"close").and.callThrough();

    // Act
    component.onSubmit();

    // Assert
    expect(userService.updateUser).toHaveBeenCalled();
    // expect(component.close).toHaveBeenCalled();
  });

  // ToDo: Refactor - Callback replaced by Promise
  it('onSubmit call update user fail because of http error', () => {

    // // Arrange
    // const userService: UserService = TestBed.inject(UserService);
    // component.editMode = true;
    // const errorResponse = ErrorsTestConstants.HTTP_ERROR;
    // spyOn(userService, "updateUser").and.returnValue(throwError(errorResponse));
    // spyOn(tableDataService, 'handleHttpError').and.callThrough();
    // spyOn(component,"close").and.callThrough();
    //
    // // Act
    // component.onSubmit();
    //
    // // Assert
    // expect(userService.updateUser).toHaveBeenCalled();
    // expect(tableDataService.handleHttpError).toHaveBeenCalled();
    // expect(component.close).toHaveBeenCalled();
  });

  it('newUser set user model', () => {

    // Arrange
    // Act
    component.newUser();

    // Assert
    expect(component.model).toBeDefined();
  });

  it('newUser not set user model, if roles or languages is undefined', () => {

    // Arrange
    component.model = undefined;
    component.roles = undefined;
    component.languages = undefined;

    // Act
    component.newUser();

    // Assert
    expect(component.model).not.toBeDefined();
  });
});
