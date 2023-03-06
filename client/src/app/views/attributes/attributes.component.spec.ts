import { MessageService } from 'primeng/api';
import { TranslateItPipe } from '../../shared/pipes/translate-it.pipe';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import { AttributesComponent } from './attributes.component';
import {CustomTableTableFormViewComponent} from '../custom/custom-views/custom-table-table-form-view/custom-table-table-form-view.component';
import {DetailViewListComponent} from '../detail-view-list/detail-view-list.component';

describe('AttributesComponent', () => {
  let component: AttributesComponent;
  let fixture: ComponentFixture<AttributesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [AttributesComponent, CustomTableTableFormViewComponent, DetailViewListComponent, TranslateItPipe],
      providers: [TranslateItPipe, MessageService, TranslateItPipe]
    })
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesComponent);
    component = fixture.componentInstance;
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
