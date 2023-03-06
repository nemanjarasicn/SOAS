import { ConfirmationService } from 'primeng/api';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import { ShowVersionInfoComponent } from './show-version-info.component';
import { ConstantsService } from "../../_services/constants.service";
import {TableDataService} from "../../_services/table-data.service";

describe('ShowVersionInfoComponent', () => {

  let component: ShowVersionInfoComponent;
  let fixture: ComponentFixture<ShowVersionInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ShowVersionInfoComponent],
      providers: [ConstantsService, ConfirmationService]
    })

    fixture = TestBed.createComponent(ShowVersionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit calls openDialog', () => {

    // Arrange
    spyOn(component, "openDialog").and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.openDialog).toHaveBeenCalled();
  });

  it('openDialog opens dialog', fakeAsync(async (done) => {

    // Arrange
    const tableService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableService, "removeAllTableLocks").and.callThrough();

    // Act
    component.openDialog().then(() => {
      done();
    });

    // Assert
    expect(tableService.removeAllTableLocks).toHaveBeenCalled();
  }));

});
