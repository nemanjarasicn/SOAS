import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {DetailViewListComponent} from '../detail-view-list/detail-view-list.component';
import {CustomTableFormViewComponent} from '../custom/custom-views/custom-table-form-view/custom-table-form-view.component';
import {ProductUnitsComponent} from './product-units.component';
import {MessageService} from "primeng/api";

describe('ProductUnitsComponent', () => {

  let component: ProductUnitsComponent;
  let fixture: ComponentFixture<ProductUnitsComponent>;
  let translate: TranslateItPipe;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ProductUnitsComponent, CustomTableFormViewComponent, DetailViewListComponent, TranslateItPipe],
      providers: [TranslateItPipe, MessageService ]
    });

    fixture = TestBed.createComponent(ProductUnitsComponent);
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
