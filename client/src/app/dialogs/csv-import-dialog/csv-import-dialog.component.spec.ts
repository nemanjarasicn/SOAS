import { ConfirmationService, MessageService } from 'primeng/api';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed, inject} from '@angular/core/testing';
import {AngularMaterialModule} from 'src/app/angular-material.module';
import { CsvImportDialogComponent } from './csv-import-dialog.component';
import {ConstantsService} from "../../_services/constants.service";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";

import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { RouterTestingModule } from '@angular/router/testing';
import { CsvImportService } from 'src/app/_services/csv-import.service';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';


describe('CsvImportDialogComponent', () => {
  let component: CsvImportDialogComponent;
  let fixture: ComponentFixture<CsvImportDialogComponent>;
  let de: DebugElement

  let csvImportService: CsvImportService

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TestingModule, AngularMaterialModule],
      declarations: [ CsvImportDialogComponent, TranslateItPipe ],
      providers: [ConstantsService,
        ConfirmationService,
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        RxFormBuilder,
        RouterTestingModule,
        CsvImportService,
        MessageService,
        TranslateItPipe
      ]
    }).compileComponents()
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvImportDialogComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement

    csvImportService = de.injector.get(CsvImportService)

    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init form variable as formGroup with formControls', () => {
    //Act
    component.ngOnInit()

    //Assert
    expect(component.form).toBeTruthy()
    expect(component.form.controls.file).toBeDefined()
    expect(component.form.controls.csv_type).toBeDefined()
    expect(component.form.controls.csv_template).toBeDefined()
  });


  it('should assign value to csvImportType in ngOnInit at subscribing to observable when the response is not false', ()=>{
    //Arrange
    let res: Array<{id: number, label: string}> | false = [
      {
        id: 0,
        label: 'Test 0'
      },
      {
        id: 1,
        label: 'Test 1'
      }
    ]

    spyOn(csvImportService, 'getCsvTypes').and.returnValue(of(res))

    //Act
    component.ngOnInit()

    //Assert
    expect(component.csvImportTypes).toBeDefined()
    expect(component.csvImportTypes).toEqual(res)
  })

  it('should assign value to csvImportType in ngOnInit at subscribing to observable when the response is false', ()=>{
    //Arrange
    let res: Array<{id: number, label: string}> | false = false

    spyOn(csvImportService, 'getCsvTypes').and.returnValue(of(res))

    //Act
    component.ngOnInit()

    //Assert
    expect(component.csvImportTypes).toBeDefined()
    expect(component.csvImportTypes).toEqual([])
  })

  it('onCsvTypeChange should keep calm', ()=>{
      //Arrange
      const id: string = ''

      //Act
      component.onCsvTypeChange(id)

      //Assert
      expect(component.form.get('csv_template').value).toBeNull()
      expect(component.form.get('csv_template').disabled).toEqual(true)
  })

  it('onCsvTypeChange should subscribe to observable and get resposne that is not false', ()=>{
    //Arrange
    let res: Array<{id: number, label: string}> | false = [
      {
        id: 1,
        label: 'test'
      }
    ]
    const id: string = '1'
    spyOn(csvImportService, 'getTemplateConfigs').and.returnValue(of(res))

    //Act
    component.onCsvTypeChange(id)

    //Assert
    expect(component.csvTemplateConfigs).toEqual(res)
    expect(component.form.get('csv_template').disabled).toBeFalsy()
  })

  it('onCsvTypeChange should subscribe to observable and get resposne that is false', ()=>{
    //Arrange
    let res: Array<{id: number, label: string}> | false = false
    const id: string = '1'
    spyOn(csvImportService, 'getTemplateConfigs').and.returnValue(of(res))

    //Act
    component.onCsvTypeChange(id)

    //Assert
    expect(component.csvTemplateConfigs).toEqual([])
    expect(component.form.get('csv_template').disabled).toEqual(true)
  })

});
