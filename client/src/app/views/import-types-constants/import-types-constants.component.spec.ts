import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CustomTableFormViewComponent} from '../custom/custom-views/custom-table-form-view/custom-table-form-view.component';
import {DetailViewListComponent} from '../detail-view-list/detail-view-list.component';
import {ImportTypesConstantsComponent} from './import-types-constants.component';
import {FormService} from "../../_services/form.service";
import { MessageService } from 'primeng/api';

describe('ImportTypesConstantsComponent', () => {

  let component: ImportTypesConstantsComponent;
  let fixture: ComponentFixture<ImportTypesConstantsComponent>;
  let translate: TranslateItPipe;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ImportTypesConstantsComponent, CustomTableFormViewComponent, DetailViewListComponent, TranslateItPipe],
      providers: [TranslateItPipe, FormService, MessageService ]
    });

    fixture = TestBed.createComponent(ImportTypesConstantsComponent);
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
