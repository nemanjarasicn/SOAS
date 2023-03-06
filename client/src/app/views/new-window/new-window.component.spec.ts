import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { NewWindowComponent } from './new-window.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ConstantsService} from "../../_services/constants.service";

describe('NewWindowComponent', () => {
  let component: NewWindowComponent;
  let fixture: ComponentFixture<NewWindowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ NewWindowComponent ],
      providers: [ConstantsService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
