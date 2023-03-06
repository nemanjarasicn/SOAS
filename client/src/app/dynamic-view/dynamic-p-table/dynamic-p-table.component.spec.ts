import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPTableComponent } from './dynamic-p-table.component';

describe('DynamicPTableComponent', () => {
  let component: DynamicPTableComponent;
  let fixture: ComponentFixture<DynamicPTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicPTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
