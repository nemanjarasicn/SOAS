import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoragePlacesComponent } from './storage-places.component';
import {CustomTableFormViewComponent} from "../custom/custom-views/custom-table-form-view/custom-table-form-view.component";
import {ConstantsService} from "../../_services/constants.service";
import {TestingModule} from "../../testing/testing.module";
import {MessageService} from "primeng/api";

describe('StoragePlacesComponent', () => {
  let component: StoragePlacesComponent;
  let fixture: ComponentFixture<StoragePlacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ StoragePlacesComponent, CustomTableFormViewComponent ],
      providers: [ ConstantsService, MessageService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoragePlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
