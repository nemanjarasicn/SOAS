import { TranslateItPipe } from '../../shared/pipes/translate-it.pipe';
import { ConfirmationService } from 'primeng/api';
import { TableDataService } from '../../_services/table-data.service';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import { SiteHeaderComponent } from './site-header.component';
import {ConstantsService} from "../../_services/constants.service";
import {AppComponent} from "../../app.component";
import {ReplaySubject} from "rxjs";
import {NavigationEnd, Router, RouterEvent} from "@angular/router";

describe('SiteHeaderComponent', () => {

  let component: SiteHeaderComponent;
  let fixture: ComponentFixture<SiteHeaderComponent>;
  const eventSubject = new ReplaySubject<RouterEvent>(1);
  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: eventSubject.asObservable(),
    url: 'test/url'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ SiteHeaderComponent, TranslateItPipe ],
      providers: [ConstantsService, AppComponent, TableDataService, ConfirmationService,
        {provide: Router, useValue: routerMock}]
    });

    fixture = TestBed.createComponent(SiteHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit reset fields', () => {

    // Arrange
    component.isAdmin = undefined;
    component.navItems = [];
    const constants: ConstantsService = TestBed.inject(ConstantsService);
    // spyOn(component.outlet, "deactivate").and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.isAdmin).toBeTruthy();
    expect(component.navItems.length).toEqual(constants.NAV_ITEMS.length);
    // expect(component.outlet.deactivate).toHaveBeenCalled();
  });

  it('should check router event', () => {

    // Arrange

    // Act
    eventSubject.next(new NavigationEnd(1,'regular','redirectUrl'));

    // Assert
    expect(component).toBeDefined();
  });

});
