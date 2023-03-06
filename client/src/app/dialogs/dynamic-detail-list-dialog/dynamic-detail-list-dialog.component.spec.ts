import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDetailListDialogComponent } from './dynamic-detail-list-dialog.component';

describe('DynamicDetailListDialogComponent', () => {
  let component: DynamicDetailListDialogComponent;
  let fixture: ComponentFixture<DynamicDetailListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicDetailListDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicDetailListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
