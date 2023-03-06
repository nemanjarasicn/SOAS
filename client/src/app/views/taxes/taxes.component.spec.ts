import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxesComponent } from './taxes.component';
import {CustomTableTableFormViewComponent} from '../custom/custom-views/custom-table-table-form-view/custom-table-table-form-view.component';
import {DetailViewListComponent} from '../detail-view-list/detail-view-list.component';
import {TestingModule} from '../../testing/testing.module';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {MessageService} from "primeng/api";


describe('TaxesComponent', () => {

  let component: TaxesComponent;
  let fixture: ComponentFixture<TaxesComponent>;
  let translate: TranslateItPipe;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [TaxesComponent, CustomTableTableFormViewComponent, DetailViewListComponent, TranslateItPipe],
      providers: [TranslateItPipe, MessageService ]
    });

    fixture = TestBed.createComponent(TaxesComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateItPipe);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test ngAfterViewInit', () => {

    // Arrange

    // Act
    component.ngAfterViewInit();

    // Assert
    expect(component.customComponent).toBeDefined();
  });

});
