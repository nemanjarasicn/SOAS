import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalStorageDialogComponent } from './local-storage-dialog.component';
import {ConstantsService} from "../../_services/constants.service";

describe('LocalStorageDialogComponent', () => {
  let component: LocalStorageDialogComponent;
  let fixture: ComponentFixture<LocalStorageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalStorageDialogComponent ],
      providers: [ConstantsService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalStorageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
