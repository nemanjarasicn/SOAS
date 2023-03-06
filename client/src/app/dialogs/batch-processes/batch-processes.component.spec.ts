import {ConfirmationService} from 'primeng/api';
import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BatchProcessesComponent} from './batch-processes.component';
import {TableDataService} from "../../_services/table-data.service";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {MatDialogRef} from "@angular/material/dialog";
import {TableDialogComponent} from "../table-dialog/table-dialog.component";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";


describe('BatchProcessesComponent', () => {

  let component: BatchProcessesComponent;
  let fixture: ComponentFixture<BatchProcessesComponent>;
  let translate: TranslateItPipe;
  const mockDialogRef = {
    open: jasmine.createSpy('open'),
    translateIt: jasmine.createSpy('translateIt'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [BatchProcessesComponent, TableDialogComponent, ConfirmationDialogComponent, TranslateItPipe],
      providers: [ConfirmationService, TranslateItPipe,
        {provide: MatDialogRef, TranslateItPipe, useValue: mockDialogRef},
      ]
    })

    fixture = TestBed.createComponent(BatchProcessesComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateItPipe);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit calls batchProcessClick function', () => {

    // Arrange
    spyOn(component, "batchProcessClick").and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.batchProcessClick).toHaveBeenCalled();
  });

  it('batchProcessClick reset batch function, name etc.', async () => {

    // Arrange
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(component, "batchProcessClick").and.callThrough();
    spyOn(tableDataService, "removeAllTableLocks").and.callThrough();
    spyOn(tableDataService, "deleteTableLocks").and.returnValue(Promise.resolve([]));
    spyOn(component.matDialog, "open").and.callThrough();

    // Act
    await component.batchProcessClick();

    // Assert
    expect(component.batchProcessClick).toHaveBeenCalled();
    expect(tableDataService.removeAllTableLocks).toHaveBeenCalled();
    expect(tableDataService.deleteTableLocks).toHaveBeenCalled();
    expect(component.matDialog.open).toHaveBeenCalled();
  });

  it('should open a dialog and delete', () => {

    // Arrange
    const dialogRef = component.matDialog.open(TableDialogComponent, {
      data: {param: '1'}
    });
    spyOn(dialogRef.componentInstance, "deleteItem").and.callThrough();

    // Act
    dialogRef.componentInstance.deleteItem(1, "");

    // Assert
    expect(dialogRef.componentInstance instanceof TableDialogComponent).toBe(true);
    expect(dialogRef.componentInstance.deleteItem).toBeDefined();
    expect(dialogRef.componentInstance.deleteItem).toHaveBeenCalled();
  });

  it('should open a dialog and delete item', () => {

    // Arrange
    const dialogRef = component.matDialog.open(TableDialogComponent, {data: {param: '1'}});
    spyOn(dialogRef.componentInstance, "deleteItem").and.callThrough();

    // Act
    // dialogRef.componentInstance.dialog.open(ConfirmationDialogComponent, {data: { param: '1' }});
    dialogRef.componentInstance.deleteItem(1, "");

    // Assert
    expect(dialogRef.componentInstance instanceof TableDialogComponent).toBe(true);
    expect(dialogRef.componentInstance.deleteItem).toHaveBeenCalled();
    expect(dialogRef.componentInstance.dialog).toBeDefined();
    // console.log('type of: ', (typeof dialogRef.componentInstance.dialog));
    // expect(dialogRef.componentInstance.dialog instanceof ConfirmationDialogComponent).toBe(true);
    // expect(dialogRef.componentInstance.dialog.open).toHaveBeenCalled();
  });

  it('should return edit item', () => {

    // Arrange
    let func = jasmine.any(Function);
    let returnFunction = function(self) {
      return function (item) { };
    };
    const item = {BATCH_INTERVAL: '30 0 * * *'};
    spyOn(component,'getEditItem').and.callFake(returnFunction);
    spyOn(component,'setBatchItemInterval').and.returnValue(item);

    // Act
    const result = component.getEditItem(this);

    // Assert
    expect(result).toEqual(func);
  });

  it('should set batch item interval', () => {

    // Arrange
    const item = {BATCH_INTERVAL: '30 0 * * *'};

    // Act
    const result = component.setBatchItemInterval(item);

    // Assert
    expect(result).toEqual(item);
    expect(result.BATCH_INTERVAL_MINUTES).toEqual('30');

  });

});
