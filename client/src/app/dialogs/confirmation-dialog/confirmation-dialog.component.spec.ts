import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmationDialogComponent} from './confirmation-dialog.component';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ConstantsService} from "../../_services/constants.service";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('ConfirmationDialogComponent', () => {

  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let translate: TranslateItPipe;
  const mockDialogRef = {
    open: jasmine.createSpy('open'),
    close: jasmine.createSpy('close'),
    translateIt: jasmine.createSpy('translateIt'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ConfirmationDialogComponent, TranslateItPipe],
      providers: [ConstantsService, TranslateItPipe,
        {provide: MatDialogRef, useValue: mockDialogRef},
        {provide: MAT_DIALOG_DATA, useValue: {}}]
    })

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    component.message = 'ABC';
    translate = TestBed.inject(TranslateItPipe);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog', () => {

    // Arrange
    component.translateIt = translate;
    component.message = 'ABC';

    // Act
    component.onNoClick();

    // Assert
    expect(mockDialogRef).toBeDefined();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

});
