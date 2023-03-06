import { Router } from '@angular/router';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import { HomeComponent } from './home.component';
import {ConstantsService} from "../../_services/constants.service";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let router: Router
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ HomeComponent ],
      providers: [ConstantsService]
    })

    router = TestBed.inject(Router);


    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {

    // Arrange

    // Act

    // Assert
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {

    // Arrange
    window.onbeforeunload = jasmine.createSpy();
    // spyOn(router, 'navigateByUrl').and.returnValue(Promise.reject());

    // Act
    component.ngOnInit();

    // Assert
    // expect(router.navigateByUrl).toHaveBeenCalled();
  });
});
