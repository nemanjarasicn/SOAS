import { CustomTableComponent } from '../custom/custom-table/custom-table.component';
import { MessageService } from 'primeng/api';
import { TranslateItPipe } from '../../shared/pipes/translate-it.pipe';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import { DetailViewListComponent } from './detail-view-list.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {PriceListSalesTestConstants} from "../../../assets/test-constants/price-list-sales";
import {PriceListSales} from "../../models/price-list-sales";
import {ConstantsService, SoasModel} from "../../_services/constants.service";
import {FormOptionsLVs, FormOptionsNVs} from "../../interfaces/form-options";
import {CurrenciesTestConstants} from "../../../assets/test-constants/currencies";
import {FormService} from "../../_services/form.service";
import {Article} from "../../models/article";
import {TableDataService} from "../../_services/table-data.service";
import {MessagesService} from "../../_services/messages.service";
import {of} from "rxjs";
import {FormlyFieldConfig} from "@ngx-formly/core";

describe('DetailViewListComponent', () => {
  let component: DetailViewListComponent;
  let fixture: ComponentFixture<DetailViewListComponent>;
  let constantsService: ConstantsService;
  let translate: TranslateItPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ DetailViewListComponent, CustomTableComponent, TranslateItPipe ],
      providers: [TranslateItPipe, MessageService, ConstantsService],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    })

    fixture = TestBed.createComponent(DetailViewListComponent);
    component = fixture.componentInstance;
    constantsService = TestBed.inject(ConstantsService);
    component.translatePipe = TestBed.inject(TranslateItPipe);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set PAGINATOR_ELEMENTS_PER_SIDE', () => {

    // Arrange
    const PAGINATOR_ELEMENTS_PER_SIDE: number[] = [14];

    // Act
    component.setPaginator(PAGINATOR_ELEMENTS_PER_SIDE);

    // Assert
    expect(component.PAGINATOR_ELEMENTS_PER_SIDE).toEqual(PAGINATOR_ELEMENTS_PER_SIDE);
  });

  it('should set selCustomerRow', () => {

    // Arrange
    const prilist: PriceListSales = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM;
    component.tableComponent.selTableRow = undefined;

    // Act
    component.setSelTableRow(prilist);

    // Assert
    expect(component.tableComponent.selTableRow).toBeDefined();
    expect(component.tableComponent.selTableRow).toEqual(prilist);
  });

  it('should not set selCustomerRow', () => {

    // Arrange
    const prilist: PriceListSales = undefined;
    component.tableComponent.selTableRow = undefined;
    console.log = jasmine.createSpy("log");

    // Act
    component.setSelTableRow(prilist);

    // Assert
    expect(component.tableComponent.selTableRow).not.toBeDefined();
    expect(component.tableComponent.selTableRow).toEqual(prilist);
    expect(console.log).toHaveBeenCalledWith('ERROR: selRow or customTableComponent is not set!');
  });

  it('should set referral table name', function () {

    // Arrange
    const tableName: string = constantsService.REFTABLE_PRILISTS;

    // Act
    component.setRefTable(tableName);

    // Assert
    expect(component.refTable).toEqual(tableName);
  });

  it('should set table columns to hide', function () {

    // Arrange
    const columns: string[] = ['column'];

    // Act
    component.setTableColumnsToHide(columns);

    // Assert
    expect(component.tableColumnsToHide).toEqual(columns);
  });

  it('should set currencies (name and value)', function () {

    // Arrange
    const currencies: FormOptionsNVs[] = CurrenciesTestConstants.CURRENCIES_NV;

    // Act
    component.setCurrencies(currencies);

    // Assert
    expect(component.currencies).toEqual(currencies);
  });

  it('should set p currencies (label and value)', function () {

    // Arrange
    const pcurrencies: FormOptionsLVs[] = CurrenciesTestConstants.PCURRENCIES_LV;

    // Act
    component.setPCurrencies(pcurrencies);

    // Assert
    expect(component.pcurrencies).toEqual(pcurrencies);
  });

  it('should load table data', fakeAsync(function () {

    // Arrange
    const primaryKey: string = 'ID';
    const primaryValue: string = '82108';
    const secondaryKey: string = 'ITMNUM';
    const secondaryValue: string = 'APOLLO000101DE';
    const getFormKey: string = 'ITMNUM';
    const getFormValue: string = 'APOLLO000101DE';
    const searchColumn: string = 'ITMNUM';
    const additionalSearchColumns: string = 'PRILIST';
    const displayedColumns: string[] = ['ITMNUM','PRILIST'];
    const getTableAndDatasetResult: { refTableTitle: string, selItemNumber: string } =
      { refTableTitle: constantsService.REFTABLE_PRILISTS, selItemNumber: secondaryValue };
    spyOn(component,'getTableAndDataset').and.returnValue(getTableAndDatasetResult);
    spyOn(component.translatePipe,'transform').and.returnValue('abc');

    // Act
    component.loadTableData(primaryKey, primaryValue, secondaryKey, secondaryValue, getFormKey, getFormValue,
      searchColumn, additionalSearchColumns, displayedColumns);

    // Assert
    expect(component.getTableAndDataset).toHaveBeenCalled();
    expect(component.translatePipe.transform).toHaveBeenCalled();
  }));

  it('should not load table data if primary value is empty', fakeAsync(function () {

    // Arrange
    console.log = jasmine.createSpy("log");
    const primaryKey: string = 'ID';
    const primaryValue: string = '';

    // Act
    component.loadTableData(primaryKey, primaryValue, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined);

    // Assert
    expect(console.log).toHaveBeenCalledWith('ERROR: getFormData - itemNumber is empty...');
  }));

  it('should not load table data if selected item number value is empty', fakeAsync(function () {

    // Arrange
    console.log = jasmine.createSpy("log");
    const primaryKey: string = 'ID';
    const primaryValue: string = '82108';
    // set selected item number to undefined (formService.selItemLocalStorageKey = undefined;)
    const getTableAndDatasetResult: { refTableTitle: string, selItemNumber: string } =
      { refTableTitle: constantsService.REFTABLE_PRILISTS, selItemNumber: undefined };
    spyOn(component,'getTableAndDataset').and.returnValue(getTableAndDatasetResult);

    // Act
    component.loadTableData(primaryKey, primaryValue, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined);

    // Assert
    expect(component.getTableAndDataset).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('ERROR: getFormData - articleNumber is empty...');
  }));

  it('should not load table data if custom table component is undefined', fakeAsync(function () {

    // Arrange
    console.log = jasmine.createSpy("log");
    const primaryKey: string = 'ID';
    const primaryValue: string = '82108';
    component.tableComponent = undefined;
    // set selected item number to undefined (formService.selItemLocalStorageKey = undefined;)
    const getTableAndDatasetResult: { refTableTitle: string, selItemNumber: string } =
      { refTableTitle: constantsService.REFTABLE_PRILISTS, selItemNumber: primaryValue };
    spyOn(component,'getTableAndDataset').and.returnValue(getTableAndDatasetResult);
    spyOn(component.translatePipe,'transform').and.returnValue('abc');
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService,'isTableLocked').and.returnValue(Promise.resolve(true));

    // Act
    component.loadTableData(primaryKey, primaryValue, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined).then(() => {
      // Assert
      expect(component.getTableAndDataset).toHaveBeenCalled();
      expect(tableDataService.isTableLocked).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('ERROR: getFormData - customTableComponent is empty...');
    })

  }));

  it('should return table and dataset', function () {

    // Arrange
    const refTableTitle: string = '';
    const selItemNumber: undefined | string = undefined;
    const getTableAndDatasetResult: { refTableTitle: string, selItemNumber: string } =
      { refTableTitle: constantsService.REFTABLE_PRILISTS, selItemNumber: 'abc' };
    const formService: FormService = TestBed.inject(FormService);
    formService.selItemRefTableTitle = constantsService.REFTABLE_PRILISTS;
    spyOn(localStorage, 'getItem').and.returnValue('abc');

    // Act
    const result = component.getTableAndDataset(refTableTitle, selItemNumber);

    // Assert
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(result).toEqual(getTableAndDatasetResult);
  });

  it('should set labels', () => {

    // Arrange
    const formTabTitle: string = 'title';
    const formTitle: string = 'title';
    const articleTitle: string = 'title';
    const articlesDetailsTitle: string = 'title';
    const createTitle: string = 'title';

    // Act
    component.setLabels(formTabTitle, formTitle, articleTitle, articlesDetailsTitle, createTitle);

    // Assert
    expect(component.tableTitle).toEqual(formTabTitle);
    expect(component.listTitle).toEqual(formTitle);
    expect(component.createTitle).toEqual(createTitle);
    expect(component.createTooltip).toEqual(createTitle);
    expect(component.listSubTitle).toEqual(articleTitle);
  });

  it('should set form options', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_PRODUCT_COMPONENTS;
    const options: FormOptionsNVs[] = CurrenciesTestConstants.CURRENCIES_NV;

    // Act
    component.setFormOptions(refTable, options);

    // Assert
    expect(component.prodUnits).toEqual(options);
  });

  it('should load empty form at new item mode = true', () => {

    // Arrange
    const primaryKey: string = 'ID';
    const primaryValue: string = '82108';
    component.newItemMode = true;
    component.emptyModel = Article as unknown as SoasModel;
    spyOn(component,'setSelTableRow').and.callThrough();
    spyOn(component,'setForm').and.callThrough();

    // Act
    component.loadEmptyForm(primaryKey, primaryValue);

    // Assert
    expect(component.setSelTableRow).toHaveBeenCalled();
    expect(component.setForm).toHaveBeenCalled();
  });

  it('should not load empty form if empty model is not set', () => {

    // Arrange
    const primaryKey: string = 'ID';
    const primaryValue: string = '82108';
    component.newItemMode = true;
    component.emptyModel = undefined;
    spyOn(component,'setSelTableRow').and.callThrough();
    spyOn(component,'setForm').and.callThrough();
    const messagesService: MessagesService = TestBed.inject(MessagesService);
    spyOn(messagesService,'showErrorMessage').and.callThrough();

    // Act
    component.loadEmptyForm(primaryKey, primaryValue);

    // Assert
    expect(component.setSelTableRow).not.toHaveBeenCalled();
    expect(component.setForm).not.toHaveBeenCalled();
    expect(messagesService.showErrorMessage).toHaveBeenCalled();
  });


  it('should set table data', fakeAsync(() => {

    // Arrange
    const selItemId: string = '82108';
    const selItemKey: string = 'ID';
    const selItemValue: string = 'APOLLO000101DE';
    const getDataSourceResult: Object = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM;
    spyOn(component.tableComponent,'getDataSource').and.returnValue(of(getDataSourceResult))
    spyOn(component.tableComponent,'setTableItems').and.callThrough();
    spyOn(component.tableComponent,'setSelTableRow').and.callThrough();
    spyOn(component.tableComponent,'setSelectionModel').and.callThrough();

    // Act
    component.setTableData(selItemId, selItemKey, selItemValue).then(() => {
      // Assert
      expect(component.tableComponent.getDataSource).toHaveBeenCalled();
      expect(component.tableComponent.setTableItems).toHaveBeenCalled();
      expect(component.tableComponent.setSelTableRow).toHaveBeenCalled();
      expect(component.tableComponent.setSelectionModel).toHaveBeenCalled();
    })

  }));

  it('should close form at new item mode = true', fakeAsync(() => {

    // Arrange
    component.newItemMode = true;
    component.resetForm = new Function();
    const expectedNewComponentMode = false;
    spyOn(component, 'emptyForms').and.callThrough();
    spyOn(component, 'resetForm').and.callThrough();

    // Act
    component.close();

    // Assert
    expect(component.emptyForms).toHaveBeenCalled();
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.newItemMode).toEqual(expectedNewComponentMode);

  }));

  it('should close form at new item mode = false', fakeAsync(() => {

    // Arrange
    component.newItemMode = false;
    component.resetForm = new Function();
    const expectedNewComponentMode = false;
    spyOn(component, 'emptyForms').and.callThrough();
    spyOn(component, 'resetForm').and.callThrough();
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService,'removeAllTableLocks').and.callThrough();

    // Act
    component.close();

    // Assert
    expect(component.emptyForms).toHaveBeenCalled();
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.newItemMode).toEqual(expectedNewComponentMode);
    expect(tableDataService.removeAllTableLocks).toHaveBeenCalled();

  }));



  it('should show item at item list number = 1', () => {

    // Arrange
    const itemList: number = 1;

    // Act
    component.showItem(itemList);

    // Assert
    expect(component.selListItemIndex).toEqual(itemList);

  });

  it('should show item at item list number = 1', () => {

    // Arrange
    const newItemMode: boolean = true;

    // Act
    component.setNewItemMode(newItemMode);

    // Assert
    expect(component.newItemMode).toEqual(newItemMode);

  });

  it('should save form', fakeAsync(() => {

    // Arrange
    component.refreshTable = new Function();
    const saveResultData: { result: boolean, message: string, refTable: string } =
      { result: true, message: 'OK', refTable: constantsService.REFTABLE_PRILISTS };
    const formService: FormService = TestBed.inject(FormService);
    spyOn(formService,'saveForm').and.returnValue(Promise.resolve(saveResultData));
    const messagesService: MessagesService = TestBed.inject(MessagesService);
    spyOn(messagesService,'showSuccessMessage').and.callThrough();

    // Act
    component.save().then(() => {
      // Assert
      expect(formService.saveForm).toHaveBeenCalled();
      expect(messagesService.showSuccessMessage).toHaveBeenCalled();
    })

  }));

  it('should set emptyModel', () => {

    // Arrange
    const emptyModel: SoasModel = PriceListSales as unknown as SoasModel;

    // Act
    component.setEmptyModel(emptyModel);

    // Assert
    expect(component.emptyModel).toEqual(emptyModel);
  });

  it('should return temporary referral table', () => {

    // Arrange
    component.parentRefTable = constantsService.REFTABLE_PRILISTS;

    // Act
    const result: string = component.getTempRefTable();

    // Assert
    expect(result).toEqual(component.parentRefTable);
  });

  it('should set parent referral table', () => {

    // Arrange
    const table: string = constantsService.REFTABLE_PRILISTS;

    // Act
    component.setParentRefTable(table);

    // Assert
    expect(component.parentRefTable).toEqual(table);
  });

  it('should update table',function() {

    // Arrange
    const selTableRow: SoasModel = PriceListSales as unknown as SoasModel;
    spyOn(component,'setSelTableRow').and.callThrough();
    spyOn(component, 'emptyForms').and.callThrough();
    component.refreshTable = new Function();
    spyOn(component, 'refreshTable').and.callThrough();

    // Act
    component.tableUpdate(selTableRow);

    // Assert
    expect(component.setSelTableRow).toHaveBeenCalled();
    expect(component.emptyForms).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();

  });

  it('should set currPageSize', () => {

    // Arrange
    const currPageSize: number = 14;

    // Act
    component.setPageSize(currPageSize);

    // Assert
    expect(component.currPageSize).toEqual(currPageSize);
  });


  it('should set form changed', () => {

    // Arrange
    const listFormChanged: boolean = true;

    // Act
    component.setFormChanged(listFormChanged);

    // Assert
    expect(component.listFormChanged).toEqual(listFormChanged);
  });

  it('should save form on form submit', () => {

    // Arrange
    component.refreshTable = new Function();
    spyOn(component, 'save').and.callThrough();

    // Act
    component.onFormSubmit();

    // Assert
    expect(component.save).toHaveBeenCalled();

  });

  it('should set form', fakeAsync(() => {

    // Arrange
    const itemColumn: string = constantsService.REFTABLE_PRILISTS_COLUMN;
    const itemNumber: string = constantsService.LS_SEL_ITEM_NUMBER;
    const secondColumn: string = constantsService.REFTABLE_PRILISTS_COLUMN_ID;
    const secondId: string = '8803';
    component.detailViewInitialized = true;
    const expectedResult = {result: true, method: 'setForm'};;

    spyOn(component, 'resetFormConfigs').and.callThrough();
    spyOn(component, 'resetFormList').and.callThrough();
    spyOn(component.listForm,'resetForm').and.callThrough();
    const formServiceResult: { model: any|SoasModel, fields: FormlyFieldConfig[], dbdata?: {} } =
      { model: PriceListSales, fields: []};
    const formService: FormService = TestBed.inject(FormService);
    spyOn(formService,'getFormConfigData').and.returnValue(Promise.resolve(formServiceResult));

    // Act
    component.setForm(itemColumn, itemNumber, secondColumn, secondId).then((result) => {

      // Assert
      expect(component.resetFormConfigs).toHaveBeenCalled();
      expect(component.resetFormList).toHaveBeenCalled();
      expect(component.listForm.resetForm).toHaveBeenCalled();
      expect(formService.getFormConfigData).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

  }));

  it('should not set form if detail view is not initialized', fakeAsync(() => {

    // Arrange
    const itemColumn: string = constantsService.REFTABLE_PRILISTS_COLUMN;
    const itemNumber: string = constantsService.LS_SEL_ITEM_NUMBER;
    const secondColumn: string = constantsService.REFTABLE_PRILISTS_COLUMN_ID;
    const secondId: string = '8803';
    component.detailViewInitialized = false;
    const expectedResult: { result: boolean, method: string } =
      {result: false, method: 'setForm - detailViewInitialized is false...'};

    // Act
    component.setForm(itemColumn, itemNumber, secondColumn, secondId).then((result: { result: boolean, method: string }) => {

      // Assert
      expect(result).toEqual(expectedResult);
    })

  }));

  it('should not set form if list form is not initialized', fakeAsync(() => {

    // Arrange
    const itemColumn: string = constantsService.REFTABLE_PRILISTS_COLUMN;
    const itemNumber: string = constantsService.LS_SEL_ITEM_NUMBER;
    const secondColumn: string = constantsService.REFTABLE_PRILISTS_COLUMN_ID;
    const secondId: string = '8803';
    component.detailViewInitialized = true;
    component.listForm = undefined;
    const expectedResult: { result: boolean, method: string } =
      {result: false, method: 'setForm - listform is undefined...'};

    // Act
    component.setForm(itemColumn, itemNumber, secondColumn, secondId).then((result: { result: boolean, method: string }) => {

      // Assert
      expect(result).toEqual(expectedResult);
    })

  }));

});
