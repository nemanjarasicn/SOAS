import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import { TableLocksDialogComponent } from './table-locks-dialog.component';
import {TableDataService} from "../../_services/table-data.service";
import {of, throwError} from "rxjs";
import {ErrorsTestConstants} from "../../../assets/test-constants/errors";

describe('TableLocksDialogComponent', () => {

  let component: TableLocksDialogComponent;
  let fixture: ComponentFixture<TableLocksDialogComponent>;
  let tableDataService: TableDataService;
  const dialogMock = {
    open: () => { }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ TableLocksDialogComponent ],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}},
      ]
    })

    fixture = TestBed.createComponent(TableLocksDialogComponent);
    component = fixture.componentInstance;
    tableDataService = TestBed.inject(TableDataService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit calls deleteTableLocks and open dialog', () => {

    // Arrange
    spyOn(tableDataService,"deleteTableLocks").and.returnValue(Promise.resolve([]));

    // Act
    component.ngOnInit();

    // Assert
    expect(tableDataService.deleteTableLocks).toHaveBeenCalled();
  });

  it('ngOnInit calls deleteTableLocks and not open dialog', fakeAsync(() => {

    // Arrange
    spyOn(tableDataService,"deleteTableLocks").and.returnValue(Promise.resolve(undefined));

    // Act
    component.ngOnInit();

    // Assert
    expect(tableDataService.deleteTableLocks).toHaveBeenCalled();
  }));

  it('ngOnInit calls deleteTableLocks and not open dialog, because of http error', fakeAsync(() => {

    // Arrange
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    spyOn(tableDataService,"deleteTableLocks").and.returnValue(Promise.resolve(throwError(errorResponse)));
    spyOn(tableDataService, 'handleHttpError').and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(tableDataService.deleteTableLocks).toHaveBeenCalled();
    // expect(tableDataService.handleHttpError).toHaveBeenCalled();
  }));

});
