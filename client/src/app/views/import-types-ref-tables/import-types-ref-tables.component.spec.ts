import { ImportTypesRefTablesComponent } from './import-types-ref-tables.component';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CustomTableFormViewComponent} from '../custom/custom-views/custom-table-form-view/custom-table-form-view.component';
import {DetailViewListComponent} from '../detail-view-list/detail-view-list.component';
import {MessageService} from "primeng/api";


describe('ImportTypesRefTablesComponent', () => {

  let component: ImportTypesRefTablesComponent;
  let fixture: ComponentFixture<ImportTypesRefTablesComponent>;
  let translate: TranslateItPipe;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ImportTypesRefTablesComponent, CustomTableFormViewComponent, DetailViewListComponent, TranslateItPipe],
      providers: [TranslateItPipe, MessageService ]
    });

    fixture = TestBed.createComponent(ImportTypesRefTablesComponent);
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
