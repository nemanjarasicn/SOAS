import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplyOrdersComponent } from './supply-orders.component';
import {CustomTableTableFormViewComponent} from '../custom/custom-views/custom-table-table-form-view/custom-table-table-form-view.component';
import {DetailViewListComponent} from '../detail-view-list/detail-view-list.component';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {TestingModule} from '../../testing/testing.module';
import {MessageService} from "primeng/api";

describe('SupplyOrdersComponent', () => {
  let component: SupplyOrdersComponent;
  let fixture: ComponentFixture<SupplyOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ SupplyOrdersComponent, CustomTableTableFormViewComponent, DetailViewListComponent, TranslateItPipe ],
      providers: [TranslateItPipe, MessageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyOrdersComponent);
    component = fixture.componentInstance;
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
