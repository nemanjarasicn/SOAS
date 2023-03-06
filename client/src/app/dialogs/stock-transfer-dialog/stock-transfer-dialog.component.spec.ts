import { NgForm } from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';

import { StockTransferDialogComponent } from './stock-transfer-dialog.component';
import {ConstantsService} from "../../_services/constants.service";
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Warehousing } from 'src/app/models/warehousing';
import {TableDataService} from "../../_services/table-data.service";
import {AutoComplete} from "primeng/autocomplete";
import {InputNumber} from "primeng/inputnumber";
import {ErrorsTestConstants} from "../../../assets/test-constants/errors";
import {throwError} from "rxjs";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {ChangeDetectorRef, ElementRef, Renderer2} from "@angular/core";


export class MockElementRef extends ElementRef {}

describe('StockTransferDialogComponent', () => {

  let component: StockTransferDialogComponent;
  let fixture: ComponentFixture<StockTransferDialogComponent>;
  let tableDataService: TableDataService;
  let translate: TranslateItPipe;

  const dialogMock = {
    close: () => { }
  };
  const autocompleteMock = {
    value: ''
  };
  let renderer2: Renderer2;

  // let autocomplete: AutoComplete;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ StockTransferDialogComponent, NgForm, AutoComplete, InputNumber, TranslateItPipe ],
      providers: [ConstantsService, ConfirmationService, AutoComplete, Renderer2, ChangeDetectorRef, TranslateItPipe,
        // {provide: AutoComplete, useValue: autocompleteMock},
        {provide: ElementRef, useValue: MockElementRef},
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}}, RxFormBuilder]
    })

    fixture = TestBed.createComponent(StockTransferDialogComponent);
    component = fixture.componentInstance;

    tableDataService = TestBed.inject(TableDataService);
    translate = TestBed.inject(TranslateItPipe);
    // autocomplete = fixture.debugElement.children[0].componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {

    component.fromModel = new Warehousing(12, 'A1HXL', 'ITMNUM', 'LOTNUM', 'LOCNUM',
      'A', 2, 0, 'UPDLOC');
    component.toModel = new Warehousing(22, '415AS', 'ITMNUM', 'LOTNUM', 'LOCNUM',
      'A', 2, 0, 'UPDLOC');

    expect(component).toBeTruthy();
  });

  it('ngOnInit reset form', () => {

    // Arrange
    spyOn(component, "resetForm").and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.toLocAutocomplete).toBeDefined();
    expect(component.toLocAutocomplete.el.nativeElement.onsearch).toBeDefined();
  });

  it('ngOnInit call getToLocAutocompleteFunc', () => {

    // Arrange
    component.toLocAutocomplete.el = new ElementRef(component);
    component.toLocAutocomplete.el.nativeElement = new ElementRef(component);
    component.toLocAutocomplete.el.nativeElement.search = {};
    component.dlgAutocomplete = undefined;
    spyOn(component, "resetForm").and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.toLocAutocomplete).toBeDefined();
    expect(component.toLocAutocomplete.el.nativeElement.search).toBeDefined();
    // expect(component.toLocAutocomplete.value).toEqual("");
  });

  it('ngOnInit call getDlgAutocompleteFunc', () => {

    // Arrange
    component.toLocAutocomplete.el = undefined;
    component.dlgAutocomplete.el = new ElementRef(component);
    component.dlgAutocomplete.el.nativeElement = new ElementRef(component);
    component.dlgAutocomplete.el.nativeElement.search = {};
    spyOn(component, "resetForm").and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.dlgAutocomplete).toBeDefined();
    expect(component.dlgAutocomplete.el.nativeElement.search).toBeDefined();
  });

  it('onCancelClick closes dialog', () => {

    // Arrange
    spyOn(MatDialogRef.prototype,"close").and.callThrough();

    // Act
    component.onCancelClick();

    // Assert
    expect(MatDialogRef.prototype.close).toBeTruthy();
  });

  it('onSubmit do nothing', () => {

    // Arrange
    // Act
    component.onSubmit();
    // Assert
  });

  it('filterItmnum returns boolean false, if search was not successful', async () => {

    // Arrange
    const $event = {query: undefined};

    // Act
    let result = await component.filterItmnum($event);

    // Assert
    expect(component.filterItmnums).toEqual([]);
    expect(result).toEqual(false);
  });

  it('filterItmnum returns boolean false, if fieldName is undefined', async () => {

    // Arrange
    const $event = {query: "Search text"};

    // Act
    let result = await component.filterItmnum($event, undefined);

    // Assert
    expect(result).toEqual(false);
  });

  it('filterItmnum returns boolean false, if search was not successful for fieldName \'UNKNOWN\'',
    async () => {

    // Arrange
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    const $event = {query: "Search text"};
    spyOn(tableDataService, "searchTableColumnData").and.callThrough();

    // Act
    let result = await component.filterItmnum($event, 'UNKNOWN');

    // Assert
    expect(tableDataService.searchTableColumnData).not.toHaveBeenCalled();
    expect(result).toEqual(false);
  });

  it('filterItmnum returns boolean false, if http error occured', async () => {

    // Arrange
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    const $event = {query: "Search text"};
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    spyOn(tableDataService, "searchTableColumnData").and.returnValue(Promise.resolve(throwError(errorResponse)));
    spyOn(tableDataService, 'handleHttpError').and.callThrough();

    // Act
    let result = await component.filterItmnum($event, 'ITMNUM');

    // Assert
    expect(tableDataService.searchTableColumnData).toHaveBeenCalled();
    // ToDo: Refactor - Callback replaced by Promise
    // expect(tableDataService.handleHttpError).toHaveBeenCalled();
    // expect(result).toEqual(false);
  });

  it('filterItmnum returns boolean false, if search was not successful for fieldName \'ITMNUM\'', async () => {

    // Arrange
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    const $event = {query: "Search text"};
    spyOn(tableDataService, "searchTableColumnData").and.returnValue(Promise.resolve([]));

    // Act
    let result = await component.filterItmnum($event, 'ITMNUM');

    // Assert
    expect(tableDataService.searchTableColumnData).toHaveBeenCalled();
    expect(result).toEqual(false);
  });

  it('filterItmnum returns boolean true, if search was successful for fieldName \'ITMNUM\'', async () => {

    // Arrange
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    const $event = {query: "Search text"};
    spyOn(tableDataService, "searchTableColumnData").and.returnValue(Promise.resolve(
      [{
        ITMNUM: "12MORRIS-E14-WA-STEC", ID: 15, LOC: "1", WHLOC: "101", LOT: "", QTY: 2,
        RESERVED: 0, STATUS_POS: "A", UPDATE_LOC: "2014-01-01 00:00:00", realQTY: 2
      }]));

    // Act
    let result = await component.filterItmnum($event, 'ITMNUM');

    // Assert
    expect(tableDataService.searchTableColumnData).toHaveBeenCalled();
    expect(component.filterItmnums.length).toEqual(1);
    expect(result).toEqual(true);
  });

  it('filterItmnum returns boolean false, if search was successful for fieldName is \'LOC\'', async () => {

    // Arrange
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    const $event = {query: "Search text"};
    spyOn(tableDataService, "searchTableColumnData").and.returnValue(Promise.resolve(
      [{
        ITMNUM: "12MORRIS-E14-WA-STEC", ID: 15, LOC: "1", WHLOC: "101", LOT: "", QTY: 2,
        RESERVED: 0, STATUS_POS: "A", UPDATE_LOC: "2014-01-01 00:00:00", realQTY: 2
      }]));

    // Act
    let result = await component.filterItmnum($event, 'LOC');

    // Assert
    expect(tableDataService.searchTableColumnData).toHaveBeenCalled();
    expect(component.toStoragePlaces.length).toEqual(1);
    expect(result).toEqual(true);
  });

  it('checkQty returns boolean false, if qty from < to',  fakeAsync(() => {

    // Arrange
    component.fromModel.QTY = 2;
    component.toModel.QTY = 3;

    // Act
    component.onSaveClick();

    // Assert
    expect(component.errorMessageIsShowing).toBeTruthy();
    expect(component.fromModel.QTY).toEqual(component.toModel.QTY);
    flush();
  }));

  it('checkQty returns boolean false, if qty to < 0',  fakeAsync(() => {

    // Arrange
    component.toModel.QTY = -1;

    // Act
    component.onSaveClick();

    // Assert
    expect(component.errorMessageIsShowing).toBeTruthy();
    // setTimeout(() => {
    //   expect(component.errorMessageIsShowing).toBeFalsy();
    // }, 7000);
    flush();
  }));

  it('initFields console log message, if fieldName is not supported',  () => {

    // Arrange
    let dlgAutocomplete: AutoComplete = undefined;
    console.log = jasmine.createSpy("log");

    // Act
    component.initFields(dlgAutocomplete, "UNKNOWN");

    // Assert
    expect(console.log).toHaveBeenCalledWith( 'column not supported: ', 'UNKNOWN' );
  });

  it('setToStoragePlaces returns []',  () => {

    // Arrange
    const places: [] = [];
    // Act
    component.setToStoragePlaces(places);

    // Assert
    expect(component.toStoragePlaces).toEqual(places);
  });

  it('checkForEmpty consume event, if fieldName is \'ITMNUM\' or \'LOC\'',  () => {

    // Arrange
    const fieldNames: string[] = ['ITMNUM', 'LOC'];
    const $event = {preventDefault: () => {}, stopPropagation: () => {}};
    spyOn($event, "preventDefault").and.callThrough();
    spyOn($event, "stopPropagation").and.callThrough();

    // Act
    for (let i = 0; i < fieldNames.length; i++) {
      component.checkForEmpty($event, fieldNames[i]);
      // Assert
      expect($event.preventDefault).toHaveBeenCalled();
      expect($event.stopPropagation).toHaveBeenCalled();
    }
  });

  it('checkForEmpty execute event, if fieldName is not \'ITMNUM\' or \'LOC\'',  () => {

    // Arrange
    const $event = {preventDefault: () => {}, stopPropagation: () => {}};
    // component.toLocInputValid = true;
    spyOn($event, "preventDefault").and.callThrough();
    spyOn($event, "stopPropagation").and.callThrough();

    // Act
    component.checkForEmpty($event, 'UNKNOWN');
    // Assert
    expect($event.preventDefault).not.toHaveBeenCalled();
    expect($event.stopPropagation).not.toHaveBeenCalled();

  });

  it('onSaveClick shows error message, if both LOC are equal',  fakeAsync(() => {

    // Arrange
    component.fromModel.QTY = 3;
    component.toModel.QTY = 1;
    component.fromModel.LOC = "equal";
    component.toModel.LOC = "equal";

    // Act
    component.onSaveClick();

    // Assert
    expect(component.errorMessageIsShowing).toBeTruthy();
    expect(component.fromModel.LOC).toEqual(component.toModel.LOC);
    flush();
  }));

  it('onSaveClick, if checkTableData result is empty, goes to else > createLocation and set table with success',  fakeAsync(() => {

    // Arrange
    component.fromModel.QTY = 3;
    component.toModel.QTY = 1;
    component.fromModel.LOC = "equal";
    component.toModel.LOC = "not equal";
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    const setTableDataResponse: {result: {success: boolean, message: string, data: []}} =
      {result: {success: true, message: '', data: []}}
    spyOn(tableDataService, "checkTableData").and.returnValue(Promise.resolve(
      {
        result: [
          {
            data: []
          },
          {found: false}
        ]
      }));
    spyOn(tableDataService,"setTableData").and.returnValue(Promise.resolve(setTableDataResponse));

    // Act
    component.onSaveClick();

    // Assert
    expect(component.saveButton.nativeElement.disabled).toBeTruthy();
    expect(tableDataService.checkTableData).toHaveBeenCalled();
    // expect(tableDataService.setTableData).toHaveBeenCalled();
    expect(component.errorMessageIsShowing).toBeFalsy();
    flush();
  }));

  it('onSaveClick, if checkTableData result is empty, goes to else > createLocation and set table with error',  fakeAsync(() => {

    // Arrange
    component.fromModel.QTY = 3;
    component.toModel.QTY = 1;
    component.fromModel.LOC = "equal";
    component.toModel.LOC = "not equal";
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    const setTableDataResponse: {result: {success: boolean, message: string, data: []}} =
      {result: {success: false, message: 'method was not updated.', data: []}}
    spyOn(tableDataService, "checkTableData").and.returnValue(Promise.resolve(
      {
        result: [
          {
            data: []
          },
          {found: false}
        ]
      }));
    spyOn(tableDataService,"setTableData").and.returnValue(Promise.resolve(setTableDataResponse));

    // Act
    component.onSaveClick();

    // Assert
    expect(component.fromModel.LOC).not.toEqual(component.toModel.LOC);
    expect(component.saveButton.nativeElement.disabled).toBeTruthy();
    expect(tableDataService.checkTableData).toHaveBeenCalled();
    // ToDo: Refactor - Callback replaced by Promise
    // expect(tableDataService.setTableData).toHaveBeenCalled();
    // expect(component.errorMessageIsShowing).toBeTruthy();
    flush();
  }));

  // it('onSaveClick, if checkTableData result is empty, goes to else > createLocation and shows error message at http error', fakeAsync(() => {
  //
  //   // Arrange
  //   component.fromModel.QTY = 3;
  //   component.toModel.QTY = 2;
  //   component.fromModel.LOC = "equal";
  //   component.toModel.LOC = "not equal";
  //   const tableDataService: TableDataService = TestBed.inject(TableDataService);
  //   const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
  //   spyOn(tableDataService, "checkTableData").and.returnValue(Promise.resolve(
  //     {
  //       result: [
  //         {
  //           data: []
  //         },
  //         {found: false}
  //       ]
  //     }));
  //   spyOn(tableDataService, "setTableData").and.returnValue(Promise.resolve(throwError(errorResponse)));
  //   spyOn(tableDataService, "handleHttpError").and.callThrough();
  //
  //   // Act
  //   component.onSaveClick();
  //
  //   // Assert
  //   expect(component.fromModel.LOC).not.toEqual(component.toModel.LOC);
  //   expect(component.saveButton.nativeElement.disabled).toBeTruthy();
  //   expect(tableDataService.checkTableData).toHaveBeenCalled();
  //   // ToDo: Refactor - Callback replaced by Promise
  //   // expect(tableDataService.setTableData).toHaveBeenCalled();
  //   // expect(tableDataService.handleHttpError).toHaveBeenCalled();
  //   // expect(component.errorMessageIsShowing).toBeTruthy();
  //   flush();
  // }));

  it('onSaveClick, if checkTableData result is empty, goes to else > replaceLocation and replace with success',  fakeAsync(() => {

    // Arrange
    component.fromModel.QTY = 3;
    component.toModel.QTY = 3;
    component.fromModel.LOC = "equal";
    component.toModel.LOC = "not equal";
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    const setTableDataResponse: {result: {success: boolean, message: string, data: []}} =
      {result: {success: true, message: 'Fertig', data: []}};
    spyOn(tableDataService, "checkTableData").and.returnValue(Promise.resolve(
      {
        result: [
          {
            data: []
          },
          {found: false}
        ]
      }));
    spyOn(tableDataService,"setTableData").and.returnValue(Promise.resolve(setTableDataResponse));

    // Act
    component.onSaveClick();

    // Assert
    expect(component.errorMessageIsShowing).toBeFalsy();
    expect(component.saveButton.nativeElement.disabled).toBeTruthy();
    expect(tableDataService.checkTableData).toHaveBeenCalled();
    // ToDo: Refactor - Callback replaced by Promise
    // expect(tableDataService.setTableData).toHaveBeenCalled();
    flush();
  }));

  it('onSaveClick, if checkTableData result is empty, goes to else > replaceLocation and replace with error',  fakeAsync(() => {

    // Arrange
    component.fromModel.QTY = 3;
    component.toModel.QTY = 3;
    component.fromModel.LOC = "equal";
    component.toModel.LOC = "not equal";
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    const setTableDataResponse: {result: {success: boolean, message: string, data: []}} =
      {result: {success: false, message: 'method was not updated.', data: []}};
    spyOn(tableDataService, "checkTableData").and.returnValue(Promise.resolve(
      {
        result: [
          {
            data: []
          },
          {found: false}
        ]
      }));
    spyOn(tableDataService,"setTableData").and.returnValue(Promise.resolve(setTableDataResponse));

    // Act
    component.onSaveClick();

    // Assert
    expect(component.fromModel.LOC).not.toEqual(component.toModel.LOC);
    expect(component.saveButton.nativeElement.disabled).toBeTruthy();
    expect(tableDataService.checkTableData).toHaveBeenCalled();
    // ToDo: Refactor - Callback replaced by Promise
    // expect(tableDataService.setTableData).toHaveBeenCalled();
    // expect(component.errorMessageIsShowing).toBeTruthy();
    flush();
  }));

  // it('onSaveClick, if checkTableData result is empty, goes to else > replaceLocation and shows error message at http error',  fakeAsync(() => {
  //
  //   // Arrange
  //   component.fromModel.QTY = 3;
  //   component.toModel.QTY = 3;
  //   component.fromModel.LOC = "equal";
  //   component.toModel.LOC = "not equal";
  //   const tableDataService: TableDataService = TestBed.inject(TableDataService);
  //   const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
  //   spyOn(tableDataService, "checkTableData").and.returnValue(Promise.resolve(
  //     {
  //       result: [
  //         {
  //           data: []
  //         },
  //         {found: false}
  //       ]
  //     }));
  //   spyOn(tableDataService, "setTableData").and.returnValue(Promise.resolve(throwError(errorResponse)));
  //   spyOn(tableDataService, "handleHttpError").and.callThrough();
  //
  //   // Act
  //   component.onSaveClick();
  //
  //   // Assert
  //   expect(component.fromModel.LOC).not.toEqual(component.toModel.LOC);
  //   expect(component.saveButton.nativeElement.disabled).toBeTruthy();
  //   expect(tableDataService.checkTableData).toHaveBeenCalled();
  //   // ToDo: Refactor - Callback replaced by Promise
  //   // expect(tableDataService.setTableData).toHaveBeenCalled();
  //   // expect(tableDataService.handleHttpError).toHaveBeenCalled();
  //   // expect(component.errorMessageIsShowing).toBeTruthy();
  //   flush();
  // }));

  it('onSaveClick executes updateBothLocations with success, if result is found',  fakeAsync(() => {

    // Arrange
    component.fromModel.QTY = 3;
    component.toModel.QTY = 1;
    component.fromModel.LOC = "equal";
    component.toModel.LOC = "not equal";
    const tableServiceResponse: {result: {success: boolean, message: string, data: []}} =
      {result: {success: true, message: 'Fertig', data: []}};
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, "checkTableData").and.returnValue(Promise.resolve(
      {
        result:
          {
            data: [[{
              ITMNUM: "12MORRIS-E14-WA-STEC", ID: 15, LOC: "1", WHLOC: "101", LOT: "", QTY: 2,
              RESERVED: 0, STATUS_POS: "A", UPDATE_LOC: "2014-01-01 00:00:00", realQTY: 2
            }]],
            found: true
          }
      }));
    spyOn(tableDataService, "setTableData").and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    component.onSaveClick();

    // Assert
    expect(component.errorMessageIsShowing).toBeFalsy();
    expect(component.saveButton.nativeElement.disabled).toBeTruthy();
    expect(tableDataService.checkTableData).toHaveBeenCalled();
    // expect(tableDataService.setTableData).toHaveBeenCalled();
    flush();
  }));

  it('onSaveClick executes updateBothLocations with error, if result is found',  fakeAsync(() => {

    // Arrange
    component.fromModel.QTY = 3;
    component.toModel.QTY = 1;
    component.fromModel.LOC = "equal";
    component.toModel.LOC = "not equal";
    const tableServiceResponse: {result: {success: boolean, message: string, data: []}} =
      {result: {success: false, message: 'method was not updated.', data: []}};
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, "checkTableData").and.returnValue(Promise.resolve(
      {
        result:
          {
            data: [[{
              ITMNUM: "12MORRIS-E14-WA-STEC", ID: 15, LOC: "1", WHLOC: "101", LOT: "", QTY: 2,
              RESERVED: 0, STATUS_POS: "A", UPDATE_LOC: "2014-01-01 00:00:00", realQTY: 2
            }]],
            found: true
          }
      }));
    spyOn(tableDataService, "setTableData").and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    component.onSaveClick();

    // Assert
    // expect(component.fromModel.LOC).not.toEqual(component.toModel.LOC);
    expect(component.saveButton.nativeElement.disabled).toBeTruthy();
    expect(tableDataService.checkTableData).toHaveBeenCalled();
    // ToDo: Refactor - Callback replaced by Promise
    // expect(tableDataService.setTableData).toHaveBeenCalled();
    // expect(component.errorMessageIsShowing).toBeTruthy();
    flush();
  }));

  // it('onSaveClick executes updateBothLocations with http error, if result is found',  fakeAsync(() => {
  //
  //   // Arrange
  //   component.fromModel.QTY = 3;
  //   component.toModel.QTY = 1;
  //   component.fromModel.LOC = "equal";
  //   component.toModel.LOC = "not equal";
  //   const tableDataService: TableDataService = TestBed.inject(TableDataService);
  //   const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
  //   spyOn(tableDataService, "checkTableData").and.returnValue(Promise.resolve(
  //     {
  //       result:
  //         {
  //           data: [[{
  //             ITMNUM: "12MORRIS-E14-WA-STEC", ID: 15, LOC: "1", WHLOC: "101", LOT: "", QTY: 2,
  //             RESERVED: 0, STATUS_POS: "A", UPDATE_LOC: "2014-01-01 00:00:00", realQTY: 2
  //           }]],
  //           found: true
  //         }
  //     }));
  //   spyOn(tableDataService, "setTableData").and.returnValue(Promise.resolve(throwError(errorResponse)));
  //   spyOn(tableDataService, "handleHttpError").and.callThrough();
  //
  //   // Act
  //   component.onSaveClick();
  //
  //   // Assert
  //   expect(component.saveButton.nativeElement.disabled).toBeTruthy();
  //   expect(tableDataService.checkTableData).toHaveBeenCalled();
  //   // expect(tableDataService.setTableData).toHaveBeenCalled();
  //   // expect(tableDataService.handleHttpError).toHaveBeenCalled();
  //   // expect(component.errorMessageIsShowing).toBeTruthy();
  //   flush();
  // }));

  it('onSaveClick executes updateAndDeleteLocation with success, if result is found',  fakeAsync(() => {

    // Arrange
    component.fromModel.QTY = 3;
    component.toModel.QTY = 3;
    component.fromModel.LOC = "equal";
    component.toModel.LOC = "not equal";
    const tableServiceResponse: {result: {success: boolean, message: string, data: []}} =
      {result: {success: true, message: 'Fertig', data: []}};
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, "checkTableData").and.returnValue(Promise.resolve(
      {
        result:
          {
            data: [[{
              ITMNUM: "12MORRIS-E14-WA-STEC", ID: 15, LOC: "1", WHLOC: "101", LOT: "", QTY: 2,
              RESERVED: 0, STATUS_POS: "A", UPDATE_LOC: "2014-01-01 00:00:00", realQTY: 2
            }]],
            found: true
          }
      }));
    spyOn(tableDataService, "setTableData").and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    component.onSaveClick();

    // Assert
    expect(component.errorMessageIsShowing).toBeFalsy();
    expect(component.saveButton.nativeElement.disabled).toBeTruthy();
    expect(tableDataService.checkTableData).toHaveBeenCalled();
    // ToDo: Refactor - Callback replaced by Promise
    // expect(tableDataService.setTableData).toHaveBeenCalled();
    flush();
  }));

  it('onSaveClick executes updateAndDeleteLocation with error, if result is found',  fakeAsync(() => {

    // Arrange
    component.fromModel.QTY = 3;
    component.toModel.QTY = 3;
    component.fromModel.LOC = "equal";
    component.toModel.LOC = "not equal";
    const tableServiceResponse: {result: {success: boolean, message: string, data: []}} =
      {result: {success: false, message: 'method was not updated.', data: []}};
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, "checkTableData").and.returnValue(Promise.resolve(
      {
        result:
          {
            data: [[{
              ITMNUM: "12MORRIS-E14-WA-STEC", ID: 15, LOC: "1", WHLOC: "101", LOT: "", QTY: 2,
              RESERVED: 0, STATUS_POS: "A", UPDATE_LOC: "2014-01-01 00:00:00", realQTY: 2
            }]],
            found: true
          }
      }));
    spyOn(tableDataService, "setTableData").and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    component.onSaveClick();

    // Assert
    expect(component.saveButton.nativeElement.disabled).toBeTruthy();
    expect(tableDataService.checkTableData).toHaveBeenCalled();
    // ToDo: Refactor - Callback replaced by Promise
    // expect(tableDataService.setTableData).toHaveBeenCalled();
    // expect(component.errorMessageIsShowing).toBeTruthy();
    flush();
  }));

  // it('onSaveClick executes updateAndDeleteLocation with http error, if result is found',  fakeAsync(() => {
  //
  //   // Arrange
  //   component.fromModel.QTY = 3;
  //   component.toModel.QTY = 3;
  //   component.fromModel.LOC = "equal";
  //   component.toModel.LOC = "not equal";
  //   const tableDataService: TableDataService = TestBed.inject(TableDataService);
  //   const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
  //   spyOn(tableDataService, "checkTableData").and.returnValue(Promise.resolve(
  //     {
  //       result:
  //         {
  //           data: [[{
  //             ITMNUM: "12MORRIS-E14-WA-STEC", ID: 15, LOC: "1", WHLOC: "101", LOT: "", QTY: 2,
  //             RESERVED: 0, STATUS_POS: "A", UPDATE_LOC: "2014-01-01 00:00:00", realQTY: 2
  //           }]],
  //           found: true
  //         }
  //     }));
  //   spyOn(tableDataService, "setTableData").and.returnValue(Promise.resolve(throwError(errorResponse)));
  //   spyOn(tableDataService, "handleHttpError").and.callThrough();
  //
  //   // Act
  //   component.onSaveClick();
  //
  //   // Assert
  //   expect(component.saveButton.nativeElement.disabled).toBeTruthy();
  //   expect(tableDataService.checkTableData).toHaveBeenCalled();
  //   // ToDo: Refactor - Callback replaced by Promise
  //   // expect(tableDataService.setTableData).toHaveBeenCalled();
  //   // expect(tableDataService.handleHttpError).toHaveBeenCalled();
  //   // expect(component.errorMessageIsShowing).toBeTruthy();
  //   flush();
  // }));

  it('onSaveClick shows error message, if result is found but empty',  fakeAsync(() => {

    // Arrange
    component.fromModel.QTY = 3;
    component.toModel.QTY = 2;
    component.fromModel.LOC = "equal";
    component.toModel.LOC = "not equal";
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, "checkTableData").and.returnValue(Promise.resolve(
      {
        result:
          {
            data: [[{}]],
            found: true
          }
      }));

    // Act
    component.onSaveClick();

    // Assert
    expect(tableDataService.checkTableData).toHaveBeenCalled();
    // ToDo: Refactor - Callback replaced by Promise
    // expect(component.errorMessageIsShowing).toBeTruthy();
    flush();
  }));

  it('onSaveClick shows error message, if result is found and QTY is <= 0',  fakeAsync(() => {

    // Arrange
    component.fromModel.QTY = 3;
    component.toModel.QTY = 2;
    component.fromModel.LOC = "equal";
    component.toModel.LOC = "not equal";
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, "checkTableData").and.returnValue(Promise.resolve(
      {
        result:
          {
            data: [[{
              ITMNUM: "12MORRIS-E14-WA-STEC", ID: 15, LOC: "1", WHLOC: "101", LOT: "", QTY: 0,
              RESERVED: 0, STATUS_POS: "A", UPDATE_LOC: "2014-01-01 00:00:00", realQTY: 2
            }]],
            found: true
          }
      }));

    // Act
    component.onSaveClick();

    // Assert
    expect(tableDataService.checkTableData).toHaveBeenCalled();
    // ToDo: Refactor - Callback replaced by Promise
    // expect(component.errorMessageIsShowing).toBeTruthy();
    flush();
  }));

  it('onSaveClick shows error message, if http error is occurred',  fakeAsync(() => {

    // Arrange
    component.fromModel.QTY = 3;
    component.toModel.QTY = 2;
    component.fromModel.LOC = "equal";
    component.toModel.LOC = "not equal";
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    // ToDo: Refactor - Callback replaced by Promise
    // spyOn(tableDataService, "checkTableData").and.returnValue(Promise.resolve(throwError(errorResponse)));
    // spyOn(tableDataService, "handleHttpError").and.callThrough();

    // Act
    component.onSaveClick();

    // Assert
    // ToDo: Refactor - Callback replaced by Promise
    // expect(tableDataService.checkTableData).toHaveBeenCalled();
    // expect(tableDataService.handleHttpError).toHaveBeenCalled();
    // expect(component.errorMessageIsShowing).toBeTruthy();
    flush();
  }));

  // onSaveClick - all options?

  // showSuccessMessage
  // showErrorMessage
  // createLocation - private !
  // replaceLocation - private !
  // savingSuccessful - private !
  // validateSavingResults
  // updateAndDeleteLocation
  // updateBothLocations
  // setToQtyDisabled
  // setToLocDisabled

  it('initFields set toLocInputDisabled to false , if fieldName is \'ITMNUM\'',  () => {

    // Arrange
    const autocomplete: AutoComplete = TestBed.inject(AutoComplete);
    autocomplete.value = '12MORRIS-E14-WA-STEC#1#1#2#101##0#A#2014-01-01 00:00:00#2';
    component.filterItmnumsWithID = [{
      ITMNUM: "12MORRIS-E14-WA-STEC", ID: 15, LOC: "1", WHLOC: "101", LOT: "1", QTY: 2,
      RESERVED: 0, STATUS_POS: "A", UPDATE_LOC: "2014-01-01 00:00:00", realQTY: 2
    }];

    // Act
    component.initFields(autocomplete, "ITMNUM");

    // Assert
    expect(component.toLocInputDisabled).toBeFalsy();
    expect(component.toQtyInputDisabled).toBeFalsy();
    expect(component.errorMessageIsShowing).toBeFalsy();
  });

  it('initFields shows error message, if fieldName is \'ITMNUM\' and qty < 0',  () => {

    // Arrange
    const autocomplete: AutoComplete = TestBed.inject(AutoComplete);
    autocomplete.value = '12MORRIS-E14-WA-STEC#1#1#-1#101##0#A#2014-01-01 00:00:00#2';
    component.filterItmnumsWithID = [{
      ITMNUM: "12MORRIS-E14-WA-STEC", ID: 15, LOC: "1", WHLOC: "101", LOT: "1", QTY: -1,
      RESERVED: 0, STATUS_POS: "A", UPDATE_LOC: "2014-01-01 00:00:00", realQTY: 2
    }];

    // Act
    component.initFields(autocomplete, "ITMNUM");

    // Assert
    expect(component.toLocInputDisabled).toBeTruthy();
    expect(component.toQtyInputDisabled).toBeTruthy();
    expect(component.errorMessageIsShowing).toBeTruthy();
  });

  it('initFields shows error message, if fieldName is \'ITMNUM\' and toLocInputMax = 0',  () => {

    // Arrange
    // const translate: TranslateItPipe = TestBed.inject(TranslateItPipe);
    const autocomplete: AutoComplete = TestBed.inject(AutoComplete);
    autocomplete.value = '12MORRIS-E14-WA-STEC#1#1#2#101##0#A#2014-01-01 00:00:00#2';
    component.filterItmnumsWithID = [{
      ITMNUM: "12MORRIS-E14-WA-STEC", ID: 15, LOC: "1", WHLOC: "101", LOT: "1", QTY: 2,
      RESERVED: 2, STATUS_POS: "A", UPDATE_LOC: "2014-01-01 00:00:00", realQTY: 2
    }];
    component.errorMessageIsShowing = false;
    // spyOn(translate, 'transform').and.callThrough();

    // Act
    component.initFields(autocomplete, "ITMNUM");

    // Assert
    expect(component.toLocInputDisabled).toBeTruthy();
    expect(component.toQtyInputDisabled).toBeTruthy();
    expect(component.errorMessageIsShowing).toBeTruthy();
  });

  it('initFields shows error message, if filterItmnumsWithID is not set',  (done) => {

    // Arrange
    const autocomplete: AutoComplete = TestBed.inject(AutoComplete);
    autocomplete.value = '12MORRIS-E14-WA-STEC#1#1#2#101##0#A#2014-01-01 00:00:00#2';
    component.filterItmnumsWithID = undefined;
    component.errorMessageIsShowing = false;

    // Act
    component.initFields(autocomplete, "ITMNUM");

    // Assert
    expect(component.toLocInputDisabled).toBeTruthy();
    expect(component.toQtyInputDisabled).toBeTruthy();
    expect(component.errorMessageIsShowing).toBeTruthy();
    setTimeout(function() {
      expect(component.errorMessageIsShowing).toBeFalsy();
    }, 6500);
    done();
  });

  it('initFields console log message, if fieldName is \'LOC\'',  () => {

    // Arrange
    const dlgAutocomplete: AutoComplete = TestBed.inject(AutoComplete);
    component.toLocAutocomplete = TestBed.inject(AutoComplete);
    component.toLocAutocomplete.value = "HXA100";
    // console.log = jasmine.createSpy("log");

    // Act
    component.initFields(dlgAutocomplete, "LOC");

    // Assert
    expect(component.toLocInputValid).toEqual(true);
  });
});

