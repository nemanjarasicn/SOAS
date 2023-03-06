import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { SiteLayoutComponent } from './site-layout.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ConstantsService} from "../../_services/constants.service";

describe('SiteLayoutComponent', () => {
  let component: SiteLayoutComponent;
  let fixture: ComponentFixture<SiteLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ SiteLayoutComponent ],
      providers: [ConstantsService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
