import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import { StockTransferDialogSetupComponent } from './stock-transfer-dialog-setup.component';
import {TableDataService} from "../../_services/table-data.service";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {RxFormBuilder} from "@rxweb/reactive-form-validators";
import {StockTransferDialogComponent} from "../stock-transfer-dialog/stock-transfer-dialog.component";

describe('StockTransferDialogSetupComponent', () => {

  let component: StockTransferDialogSetupComponent;
  let fixture: ComponentFixture<StockTransferDialogSetupComponent>;
  let tableDataService: TableDataService;
  let translate: TranslateItPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ StockTransferDialogSetupComponent, TranslateItPipe, StockTransferDialogComponent ],
      providers: [ RxFormBuilder, TranslateItPipe ]
    });

    fixture = TestBed.createComponent(StockTransferDialogSetupComponent);
    component = fixture.componentInstance;
    tableDataService = TestBed.inject(TableDataService);
    translate = TestBed.inject(TranslateItPipe);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit calls showDialog', () => {

    // Arrange
    spyOn(component, "showDialog").and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.showDialog).toHaveBeenCalled();
  });

  // ToDo: Add test for component.matDialog.open
  it('showDialog opens dialog', () => {

    // Arrange
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    const callbackObject = {func: () => {}};
    spyOn(component, "showDialog").and.callThrough();
    spyOn(tableDataService, "removeAllTableLocks").and.returnValue(Promise.resolve({}));
    spyOn(component.matDialog,"open").and.callThrough();
    spyOn(callbackObject, 'func');

    // Act
    component.showDialog();

    // Assert
    expect(component.showDialog).toHaveBeenCalled();
    expect(tableDataService.removeAllTableLocks).toHaveBeenCalled();
    expect(component.matDialog).toBeDefined();
    // expect(component.matDialog.open).toHaveBeenCalled();
  });

});
