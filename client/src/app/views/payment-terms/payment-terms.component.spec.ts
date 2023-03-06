import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {DetailViewListComponent} from '../detail-view-list/detail-view-list.component';
import {CustomTableFormViewComponent} from '../custom/custom-views/custom-table-form-view/custom-table-form-view.component';
import {PaymentTermsComponent} from "./payment-terms.component";
import {MessageService} from "primeng/api";

describe('PaymentTermsComponent', () => {

  let component: PaymentTermsComponent;
  let fixture: ComponentFixture<PaymentTermsComponent>;
  let translate: TranslateItPipe;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PaymentTermsComponent, CustomTableFormViewComponent, DetailViewListComponent, TranslateItPipe],
      providers: [TranslateItPipe, MessageService ]
    });

    fixture = TestBed.createComponent(PaymentTermsComponent);
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
