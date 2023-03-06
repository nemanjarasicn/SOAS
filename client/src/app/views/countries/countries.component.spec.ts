import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CountriesComponent} from './countries.component';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {DetailViewListComponent} from '../detail-view-list/detail-view-list.component';
import {CustomTableFormViewComponent} from '../custom/custom-views/custom-table-form-view/custom-table-form-view.component';
import {MessageService} from "primeng/api";

describe('CountriesComponent', () => {

  let component: CountriesComponent;
  let fixture: ComponentFixture<CountriesComponent>;
  let translate: TranslateItPipe;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [CountriesComponent, CustomTableFormViewComponent, DetailViewListComponent, TranslateItPipe],
      providers: [TranslateItPipe, MessageService ]
    });

    fixture = TestBed.createComponent(CountriesComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateItPipe);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test ngAfterViewInit', () => {

    // Arrange

    // Act
    component.ngAfterViewInit();

    // Assert
    expect(component.customComponent).toBeDefined();
  });

});
