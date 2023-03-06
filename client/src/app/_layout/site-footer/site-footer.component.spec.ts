import { MatToolbarModule } from '@angular/material/toolbar';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import { SiteFooterComponent } from './site-footer.component';
import {ConstantsService} from "../../_services/constants.service";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";

describe('SiteFooterComponent', () => {

  let component: SiteFooterComponent;
  let fixture: ComponentFixture<SiteFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatToolbarModule],
      declarations: [ SiteFooterComponent, TranslateItPipe ],
      providers: [ConstantsService]
    });

    fixture = TestBed.createComponent(SiteFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('ngOnInit reset fields', () => {

    // Arrange
    component.user = undefined;
    component.tableVisible = undefined;
    component.env.tablevisible = true;
    spyOn(localStorage,"getItem").and.returnValue('user');

    // Act
    component.ngOnInit();

    // Assert
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(component.user).toBeTruthy();
    expect(component.tableVisible).toBeTruthy();
  });
});
