import {NgForm} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import { BatchDialogComponent } from './batch-dialog.component';
import {BatchService} from "../../_services/batch.service";
import {throwError} from "rxjs";
import {ErrorsTestConstants} from "../../../assets/test-constants/errors";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";

describe('BatchDialogComponent', () => {

  let component: BatchDialogComponent;
  let fixture: ComponentFixture<BatchDialogComponent>;
  const dialogMock = {
    close: () => { }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [BatchDialogComponent, NgForm, TranslateItPipe],
      providers: [TranslateItPipe,
        { provide: MatDialogRef, useValue: dialogMock},
          // useFactory: () => jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed'])},
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })

    fixture = TestBed.createComponent(BatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('createFormControls reset batch function, name etc.', () => {

    // Act
    component.createFormControls();

    // Assert
    expect(component.batchFunction).toBeDefined();
    expect(component.batchActive).toBeDefined();
    expect(component.batchName).toBeDefined();
    expect(component.batchDescription).toBeDefined();
  });

  it('createBatchCodeFormControl reset batchCode', () => {

    // Act
    component.createBatchCodeFormControl(false);

    // Assert
    expect(component.batchCode).toBeDefined();
  });

  it('createForm reset batchCode', () => {

    // Act
    component.createForm();

    // Assert
    expect(component.batchForm).toBeDefined();
  });

  it('createForm reset model', () => {

    // Arrange

    // Act
    component.newBatch();

    // Assert
    expect(component.model).toBeDefined();
  });

  // it('close should close dialog', () => {
  //
  //   // Arrange
  //   spyOn(MatDialogRef.prototype,"close").and.callThrough();
  //
  //   // Act
  //   component.close();
  //
  //   // Assert
  //   expect(component.dialogRef.close).toHaveBeenCalled();
  // });

  it('parseBatchCode should return parsed batch code', () => {

    // Act
    let result = component.parseBatchCode("a'b'c");

    // Assert
    expect(result).toEqual("a''b''c");
  });

  it('parseBatchCode should return empty string \'\'', () => {

    // Arrange
    spyOn(component,"real_escape_string").and.throwError('some error message');

    // Act
    let result = component.parseBatchCode("a'b'c");

    // Assert
    expect(()=> { component.real_escape_string('abc'); }).toThrow(new Error('some error message'));
    expect(component.real_escape_string).toHaveBeenCalled();
    expect(result).toEqual('');
  });

  it('onSubmit should insert batch', fakeAsync(() => {

    // Arrange
   component.editMode = false;
   const batchService: BatchService = TestBed.inject(BatchService);
   spyOn(batchService,"insertBatch").and.callThrough();

    // Act
    component.onSubmit();

    // Assert
    expect(batchService.insertBatch).toHaveBeenCalled();
  }));

  it('onSubmit should update batch', async (done) => {

    // Arrange
    const batchService: BatchService = TestBed.inject(BatchService);
    component.editMode = true;
    component.model.BATCH_CODE = "ABC";
    spyOn(component,"parseBatchCode").and.returnValue('');
    spyOn(batchService,"updateBatch").and.returnValue(Promise.resolve({}));
    spyOn(component,"close").and.callThrough();

    // Act
    component.onSubmit().then(() => {
      done();
    });

    await Promise.resolve();

    // Assert
    expect(component.parseBatchCode).toHaveBeenCalled();
    expect(batchService.updateBatch).toHaveBeenCalled();
    expect(component.close).toHaveBeenCalled();
  });

  it('onSubmit should throw http client-side error', async (done) => {

    // Arrange
    console.log = jasmine.createSpy("log");
    const errorResponse = ErrorsTestConstants.ERROR; // set error response
    component.editMode = true;
    const batchService: BatchService = TestBed.inject(BatchService);
    spyOn(batchService,"updateBatch").and.returnValue(Promise.resolve(throwError(errorResponse)));

    // Act
    component.onSubmit().then(() => {
      done();
    });

    // Assert
    expect(batchService.updateBatch).toHaveBeenCalled();
    // expect(console.log).toHaveBeenCalledWith('Client-side error occurred.');
  });

  it('onSubmit should throw http server-side error', async (done) => {

    // Arrange
    console.log = jasmine.createSpy("log");
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    component.editMode = true;
    const batchService: BatchService = TestBed.inject(BatchService);
    spyOn(batchService,"updateBatch").and.returnValue(Promise.resolve(throwError(errorResponse)));

    // Act
    component.onSubmit().then(() => {
      done();
    });

    // Assert
    expect(batchService.updateBatch).toHaveBeenCalled();
    // expect(console.log).toHaveBeenCalledWith('Server-side error occurred.');
  });

  it('real_escape_string should return undefined', () => {

    // Act
    let result = component.real_escape_string(undefined);

    // Assert
    expect(result).toEqual(undefined);
  });

  it('real_escape_string should return empty string', () => {

    // Act
    let result = component.real_escape_string('');

    // Assert
    expect(result).toEqual('');
  });

  it('real_escape_string should return escaped string', () => {

    // Arrange
    spyOn(String.prototype, 'trim').and.callThrough();
    spyOn(String.prototype, 'replace').and.callThrough();

    // Act
    let result = component.real_escape_string("a'b'c");

    // Assert
    expect(String.prototype.trim).toHaveBeenCalled();
    expect(String.prototype.replace).toHaveBeenCalled();
    expect(result).toEqual("a''b''c");
  });

  // it('toggleBatchCodeRequired should do nothing', () => {
  //
  //   // Arrange
  //   const event: MatCheckboxChange = undefined;
  //
  //   // Act
  //   component.toggleBatchCodeRequired(event);
  //
  //   // Assert
  // });

  it('getErrorMessage should return error message', () => {

    // Arrange
    spyOn(component.inputFormControl, "hasError").and.returnValue(true);

    // Act
    let result = component.getErrorMessage();

    // Assert
    expect(result).toEqual('You must enter a value');
  });

  it('getErrorMessage should return empty error message', () => {

    // Arrange
    spyOn(component.inputFormControl, "hasError").and.returnValue(false);

    // Act
    let result = component.getErrorMessage();

    // Assert
    expect(result).toEqual('');
  });

  // fit('onSubmit should throw http server-side error', () => {
  //
  //   // Arrange
  //   console.log = jasmine.createSpy("log");
  //   component.editMode = true;
  //   const batchService: BatchService = TestBed.inject(BatchService);
  //   spyOn(batchService,"updateBatch").and.returnValue(of(false));
  //
  //   // Act
  //   component.onSubmit();
  //
  //   // Assert
  //   // expect(batchService.updateBatch).toEqual(undefined);
  //   expect(console.log).toHaveBeenCalledWith('Server-side error occurred.');
  // });

});
