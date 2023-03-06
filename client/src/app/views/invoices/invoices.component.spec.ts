import { DetailViewTabGroupComponent } from '../detail-view-tab-group/detail-view-tab-group.component';
import { CustomTableComponent } from '../custom/custom-table/custom-table.component';
import { MessageService } from 'primeng/api';
import { TranslateItPipe } from '../../shared/pipes/translate-it.pipe';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import { InvoicesComponent } from './invoices.component';
import {ConstantsService} from "../../_services/constants.service";
import {CustomTableTabGroupViewComponent} from "../custom/custom-views/custom-table-tab-group-view/custom-table-tab-group-view.component";

describe('InvoicesComponent', () => {
  let component: InvoicesComponent;
  let fixture: ComponentFixture<InvoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ InvoicesComponent, CustomTableTabGroupViewComponent, DetailViewTabGroupComponent, TranslateItPipe ],
      providers: [ConstantsService, TranslateItPipe, MessageService]
    })

    fixture = TestBed.createComponent(InvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
