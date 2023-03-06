import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import { WarehousingComponent } from './warehousing.component';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {CustomTableTableFormViewComponent} from '../custom/custom-views/custom-table-table-form-view/custom-table-table-form-view.component';
import {DetailViewListComponent} from '../detail-view-list/detail-view-list.component';
import {MessageService} from "primeng/api";

describe('WarehousingComponent', () => {
  let component: WarehousingComponent;
  let fixture: ComponentFixture<WarehousingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [WarehousingComponent, CustomTableTableFormViewComponent, DetailViewListComponent, TranslateItPipe],
      providers: [TranslateItPipe, MessageService]
    })

    fixture = TestBed.createComponent(WarehousingComponent);
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
