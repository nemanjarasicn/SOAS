import { MatMenuModule } from '@angular/material/menu';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { MenuItemComponent } from './menu-item.component';

describe('MenuItemComponent', () => {
  let component: MenuItemComponent;
  let fixture: ComponentFixture<MenuItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, MatMenuModule],
      declarations: [ MenuItemComponent ]
    });

    fixture = TestBed.createComponent(MenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
