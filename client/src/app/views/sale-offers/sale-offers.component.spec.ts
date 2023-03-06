import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOffersComponent } from './sale-offers.component';

describe('SaleOffersComponent', () => {
  let component: SaleOffersComponent;
  let fixture: ComponentFixture<SaleOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
