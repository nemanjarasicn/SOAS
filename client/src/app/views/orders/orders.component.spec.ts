import { MessageService } from 'primeng/api';
import { TranslateItPipe } from '../../shared/pipes/translate-it.pipe';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import { OrdersComponent } from './orders.component';
import {CustomTableTabGroupViewComponent} from "../custom/custom-views/custom-table-tab-group-view/custom-table-tab-group-view.component";
import {DetailViewTabGroupComponent} from "../detail-view-tab-group/detail-view-tab-group.component";

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ OrdersComponent, CustomTableTabGroupViewComponent, DetailViewTabGroupComponent, TranslateItPipe ],
      providers: [TranslateItPipe, MessageService]
    })

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
