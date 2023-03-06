import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailViewListDialogComponent } from './detail-view-list-dialog.component';

describe('DetailViewListDialogComponent', () => {
  let component: DetailViewListDialogComponent;
  let fixture: ComponentFixture<DetailViewListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailViewListDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailViewListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
