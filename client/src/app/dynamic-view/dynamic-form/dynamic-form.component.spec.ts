import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {DynamicFormComponent} from './dynamic-form.component';
import {RouterTestingModule} from "@angular/router/testing";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {FormControl, FormGroup, ValidatorFn} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {SoasModel} from "../../_services/constants.service";
import {CountriesTestConstants} from "../../../assets/test-constants/countries";
import {Article} from "../../models/article";

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DynamicFormComponent, TranslateItPipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get value', () => {

    // Arrange
    component.form = new FormGroup({});
    component.form.setValue({});

    // Act
    const result: any = component.value;

    // Assert
    expect(result).toEqual({});

  });

  it('should set model', () => {

    // Arrange
    const model: any = {};

    // Act
    component.setModel(model);

    // Assert
    expect(component.model).toEqual(model);

  });

  it('should set fields', () => {

    // Arrange
    const fields: FormlyFieldConfig[] = [];

    // Act
    component.setFields(fields);

    // Assert
    expect(component.fields).toEqual(fields);

  });

  it('should reset form', () => {

    // Arrange
    const fields: FormlyFieldConfig[] = [];
    const model: any | SoasModel = {};

    // Act
    component.resetForm();

    // Assert
    expect(component.form).toBeDefined();
    expect(component.model).toEqual(model);
    expect(component.fields).toEqual(fields);

  });

  it('onSubmit should submit if form is valid', () => {

    // Arrange
    let event: Event = {
      target: {value: 'test'},
      stopPropagation: new Function(),
      preventDefault: new Function()
    } as any;
    component.form = new FormGroup({});
    component.form.setValue({});
    spyOn(event, "stopPropagation").and.callThrough();
    spyOn(event, "preventDefault").and.callThrough();


    // Act
    component.onSubmit(event);

    // Assert
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('onSubmit should validate all form fields if form is not valid', () => {

    // Arrange
    let event: Event = {
      target: {value: 'test'},
      stopPropagation: new Function(),
      preventDefault: new Function()
    } as any;
    component.form = new FormGroup({email: new FormControl()});
    component.form.controls['email'].setErrors({'incorrect': true});
    spyOn(event, "stopPropagation").and.callThrough();
    spyOn(event, "preventDefault").and.callThrough();
    spyOn(component, 'validateAllFormFields').and.callThrough();

    // Act
    component.onSubmit(event);

    // Assert
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.validateAllFormFields).toHaveBeenCalled();
  });

  it('should not bind validations', () => {

    // Arrange
    const validations: any = [];
    const expectedResult = null;

    // Act
    const result: null | ValidatorFn = component.bindValidations(validations);

    // Assert
    expect(result).toEqual(expectedResult);

  });

  it('should bind validations', () => {

    // Arrange
    const validations: any = [{validator: {}}];
    // const expectedResult: ValidatorFn = Validators.min(3);

    // Act
    const result: null | ValidatorFn = component.bindValidations(validations);

    // Assert
    expect(result).toBeDefined();

  });

  it('should return disabled flag = true', () => {

    // Arrange
    component.disabledFlag = true;

    // Act
    const result: boolean = component.getDisabledFlag();

    // Assert
    expect(result).toBeTruthy();

  });

  it('should set forms disabled flag', () => {

    // Arrange
    component.disabledFlag = false;
    const disabledFlag: boolean = true;

    // Act
    component.setDisabled(disabledFlag);

    // Assert
    expect(component.disabledFlag).toBeTruthy();

  });

  it('should remove all fields', () => {

    // Arrange
    component.fields = JSON.parse(CountriesTestConstants.COUNTRIES_FORM_FIELDS);
    const expectedResult: any = [];

    // Act
    component.removeAllFields();

    // Assert
    expect(component.fields).toEqual(expectedResult);

  });

  it('should return fields', () => {

    // Arrange
    component.fields = JSON.parse(CountriesTestConstants.COUNTRIES_FORM_FIELDS);

    // Act
    const result: FormlyFieldConfig[] = component.getFields();

    // Assert
    expect(result).toEqual(component.fields);

  });

  it('should return controls', () => {

    // Arrange
    component.form = new FormGroup({email: new FormControl()});

    // Act
    const result: {} = component.getControls();

    // Assert
    expect(result).toEqual(component.form.controls);

  });
});
