import { DetailViewTabGroupComponent } from '../detail-view-tab-group/detail-view-tab-group.component';
import { CustomTableComponent } from '../custom/custom-table/custom-table.component';
import { MessageService } from 'primeng/api';
import { TranslateItPipe } from '../../shared/pipes/translate-it.pipe';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryNotesComponent } from './delivery-notes.component';
import {CustomTableTabGroupViewComponent} from "../custom/custom-views/custom-table-tab-group-view/custom-table-tab-group-view.component";

describe('DeliveryNotesComponent', () => {
  let component: DeliveryNotesComponent;
  let fixture: ComponentFixture<DeliveryNotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ DeliveryNotesComponent, CustomTableTabGroupViewComponent, DetailViewTabGroupComponent, TranslateItPipe ],
      providers: [TranslateItPipe, MessageService]
    })

    fixture = TestBed.createComponent(DeliveryNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
