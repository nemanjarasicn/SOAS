import {MessageService} from 'primeng/api';
import {TranslateItPipe} from '../../../shared/pipes/translate-it.pipe';
import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {CustomFormComponent} from './custom-form.component';
import {FormlyFieldConfig} from "@ngx-formly/core";
import {DynamicFormComponent} from "../../../dynamic-view/dynamic-form/dynamic-form.component";
import {TableDataService} from "../../../_services/table-data.service";
import {SoasModel} from "../../../_services/constants.service";
import {Article} from "../../../models/article";

describe('CustomFormComponent', () => {
  let component: CustomFormComponent;
  let fixture: ComponentFixture<CustomFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [CustomFormComponent, TranslateItPipe, DynamicFormComponent],
      providers: [TranslateItPipe, MessageService, DynamicFormComponent]
    })

    fixture = TestBed.createComponent(CustomFormComponent);
    component = fixture.componentInstance;
    component.customForm = TestBed.inject(DynamicFormComponent);
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test ngAfterViewInit', () => {

    // Arrange
    const isFormViewLoaded: boolean = true;

    // Act
    component.ngAfterViewInit();

    // Assert
    expect(component.isFormViewLoaded).toEqual(isFormViewLoaded);
  });

  it('should set labels', () => {

    // Arrange
    const formTitle: string = 'title';
    const createTitle: string = 'title';

    // Act
    component.setLabels(formTitle, createTitle);

    // Assert
    expect(component.formTitle).toEqual(formTitle);
    expect(component.createTitle).toEqual(createTitle);
  });

  it('should initialize form', () => {

    // Arrange
    const newItemMode: boolean = true;
    const refTable: string = 'title';
    spyOn(component, 'setNewItem').and.callThrough();
    spyOn(component, 'setRefTable').and.callThrough();

    // Act
    component.initForm(newItemMode, refTable);

    // Assert
    expect(component.setNewItem).toHaveBeenCalled();
    expect(component.setRefTable).toHaveBeenCalled();
    expect(component.refTable).toEqual(refTable);

  });

  it('should set form data', () => {

    // Arrange
    const regConfig: { model: any, fields: FormlyFieldConfig[] } = {model: {}, fields: undefined};
    const formDisabledFlag: boolean = false;
    const expectedResult: { result: boolean } = {result: true};
    spyOn(component.customForm, 'setModel').and.callThrough();
    spyOn(component.customForm, 'setFields').and.callThrough();
    spyOn(component, 'setIsLoadingResults').and.callThrough();

    // Act
    const result: { result: boolean } = component.setFormData(regConfig, formDisabledFlag);

    // Assert
    expect(component.customForm.setModel).toHaveBeenCalled();
    expect(component.customForm.setFields).toHaveBeenCalled();
    expect(component.setIsLoadingResults).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);

  });

  it('should not set form data', () => {

    // Arrange
    console.log = jasmine.createSpy("log");
    const regConfig: { model: any, fields: FormlyFieldConfig[] } = {model: {}, fields: undefined};
    const formDisabledFlag: boolean = false;
    component.customForm = undefined;
    const expectedConsoleLog = new Error('customForm is not defined');
    const expectedResult: { result: boolean } = {result: false};
    spyOn(component, 'setIsLoadingResults').and.callThrough();

    // Act
    const result: { result: boolean } = component.setFormData(regConfig, formDisabledFlag);

    // Assert
    expect(component.setIsLoadingResults).not.toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
    expect(console.log).toHaveBeenCalledWith(expectedConsoleLog);

  });

  it('should close form at new item mode = true', fakeAsync(() => {

    // Arrange
    component.newItemMode = true;
    component.resetForm = new Function();
    const expectedNewItemMode = false;
    spyOn(component, 'resetForm').and.callThrough();

    // Act
    component.close();

    // Assert
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.newItemMode).toEqual(expectedNewItemMode);

  }));

  it('should close form at new item mode = false', fakeAsync(() => {

    // Arrange
    component.newItemMode = false;
    component.resetForm = new Function();
    const expectedNewItemMode = false;
    const tableDataService = TestBed.inject(TableDataService);
    spyOn(component, 'resetSelection').and.callThrough();
    spyOn(tableDataService, 'removeAllTableLocks').and.callThrough();

    // Act
    component.close();

    // Assert
    expect(component.resetSelection).toHaveBeenCalled();
    expect(component.newItemMode).toEqual(expectedNewItemMode);
    expect(tableDataService.removeAllTableLocks).toHaveBeenCalled();

  }));

  it('should set selected row', () => {

    // Arrange
    const selRow: SoasModel = Article as unknown as SoasModel;

    // Act
    component.setSelectedRow(selRow);

    // Assert
    expect(component.selRow).toEqual(selRow);

  });

  it('should empty forms', () => {

    // Arrange
    const selRow: SoasModel = undefined;

    // Act
    component.emptyForm();

    // Assert
    expect(component.selRow).toEqual(selRow);

  });

  it('should set local storage key', () => {

    // Arrange
    const selItemLocalStorageKey: string = 'key';

    // Act
    component.setLocalStorageKey(selItemLocalStorageKey);

    // Assert
    expect(component.selItemLocalStorageKey).toEqual(selItemLocalStorageKey);

  });

  it('should save form on form submit', () => {

    // Arrange
    component.saveForm = new Function();
    spyOn(component, 'saveForm').and.callThrough();

    // Act
    component.onFormSubmit();

    // Assert
    expect(component.saveForm).toHaveBeenCalled();

  });

  it('should reset selection', () => {

    // Arrange
    const selRow: SoasModel = undefined;
    component.selItemLocalStorageKey = 'key';
    component.resetForm = new Function;
    spyOn(component, 'resetForm').and.callThrough();

    // Act
    component.resetSelection();

    // Assert
    expect(component.selRow).toEqual(selRow);
    expect(component.resetForm).toHaveBeenCalled();

  });
});
