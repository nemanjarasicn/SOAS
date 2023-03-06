import {CustomTableComponent} from '../custom/custom-table/custom-table.component';
import {MessageService} from 'primeng/api';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {PriceListSalesComponent} from './price-list-sales.component';
import {HttpClientModule} from "@angular/common/http";
import {ConstantsService, SoasModel} from "../../_services/constants.service";
import {FetchDataService} from "../../_services/fetch-data.service";
import {of} from "rxjs";
import {PriceListSalesTestConstants} from "../../../assets/test-constants/price-list-sales";
import {CustomPTableComponent} from "../custom/custom-p-table/custom-p-table.component";
import {Table} from "primeng/table";
import {PriceListSalesService} from "./price-list-sales.service";
import {OptionsService} from "../../_services/options.service";
import {FetchTableService} from "../../_services/fetch-table.service";

describe('PriceListSalesComponent', () => {
  let component: PriceListSalesComponent;
  let fixture: ComponentFixture<PriceListSalesComponent>;
  let constantsService: ConstantsService;
  let pTable: Table;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, HttpClientModule],
      declarations: [PriceListSalesComponent, CustomTableComponent, TranslateItPipe],
      providers: [TranslateItPipe, MessageService, ConstantsService, CustomPTableComponent, Table]
    })

    fixture = TestBed.createComponent(PriceListSalesComponent);
    component = fixture.componentInstance;
    constantsService = TestBed.inject(ConstantsService);
    pTable = fixture.debugElement.children[0].componentInstance;
    component.refTable = constantsService.REFTABLE_PRILISTS;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit with referral table name of price lists', () => {

    // Arrange
    component.isMainTableViewLoaded = false;
    const fetchDataServiceResult: { selTableRow: SoasModel, selTableIndex: number, refTableName: string } = {
      selTableRow: PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM,
      selTableIndex: 0,
      refTableName: constantsService.REFTABLE_PRILISTS
    };
    const fetchDataService = TestBed.inject(FetchDataService);
    spyOn(fetchDataService, 'getDataObs').and.returnValue(of(fetchDataServiceResult));
    spyOn(component, 'disableSaveButton').and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.disableSaveButton).toHaveBeenCalled();
    expect(fetchDataService.getDataObs).toHaveBeenCalled();

  });

  it('should call ngOnInit with referral table name of price lists details', () => {

    // Arrange
    component.isMainTableViewLoaded = false;
    const fetchDataServiceResult: { selTableRow: SoasModel, selTableIndex: number, refTableName: string } = {
      selTableRow: PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM,
      selTableIndex: 0,
      refTableName: constantsService.REFTABLE_PRILISTS_DETAILS
    };
    const fetchDataService = TestBed.inject(FetchDataService);
    spyOn(fetchDataService, 'getDataObs').and.returnValue(of(fetchDataServiceResult));
    spyOn(component, 'disableSaveButton').and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.disableSaveButton).toHaveBeenCalled();
    expect(fetchDataService.getDataObs).toHaveBeenCalled();

  });

  it('should call ngOnInit with selTableRow = undefined', () => {

    // Arrange
    const fetchDataServiceResult: { selTableRow: SoasModel, selTableIndex: number, refTableName: string } = {
      selTableRow: undefined,
      selTableIndex: undefined,
      refTableName: constantsService.REFTABLE_PRILISTS
    };
    const fetchDataService = TestBed.inject(FetchDataService);
    spyOn(fetchDataService, 'getDataObs').and.returnValue(of(fetchDataServiceResult));
    spyOn(component.tableComponent, 'setIsTableClicked').and.callThrough();
    spyOn(component.tableComponent, 'setIsLoadingResults').and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(fetchDataService.getDataObs).toHaveBeenCalled();
    expect(component.tableComponent.setIsTableClicked).toHaveBeenCalled();
    expect(component.tableComponent.setIsLoadingResults).toHaveBeenCalled();

  });

  it('should test ngAfterViewInit', fakeAsync(() => {

    // Arrange
    const getDataSourceResult = [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM];
    spyOn(component.tableComponent, 'getDataSource').and.returnValue(of(getDataSourceResult));
    spyOn(localStorage, 'getItem').and.returnValue('abc');
    const optionsService = TestBed.inject(OptionsService);
    // Promise.resolve() for call of async void function
    spyOn(optionsService, 'initializeOptions').and.returnValue(Promise.resolve());
    spyOn(component.tableComponent, 'setCurrencies').and.callThrough();

    // Act
    component.ngAfterViewInit();

    // Assert
    expect(component.tableComponent).toBeDefined();
    expect(component.tableComponent.getDataSource).toHaveBeenCalled();
    tick();
    expect(component.tableComponent.setCurrencies).toHaveBeenCalled();

  }));

  it('should test fetch table data service call', () => {

    // Arrange
    component.isMainTableViewLoaded = true;
    const fetchTableServiceResult: {
      refTableName: string,
      fieldName: string,
      disableSaveButton: boolean,
      positions: string[],
      refreshDetailView: boolean
    } = {
      refTableName: constantsService.REFTABLE_PRILISTS,
      fieldName: constantsService.REFTABLE_PRILISTS_COLUMN,
      disableSaveButton: true,
      positions: ["id_79_td_1_2","id_80_td_1_2"],
      refreshDetailView: true
    };
    const fetchTableService = TestBed.inject(FetchTableService);
    spyOn(fetchTableService, 'getDataObs').and.returnValue(of(fetchTableServiceResult));
    spyOn(component, 'disableSaveButton').and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(fetchTableService.getDataObs).toHaveBeenCalled();
    expect(component.disableSaveButton).toHaveBeenCalled();

  });

  it('should reset form if new item mode is false', async function () {

    // Arrange
    component.newItemMode = false;
    spyOn(component, 'disableSaveButton').and.callThrough();

    // Act
    component.resetForm();

    // Assert
    expect(component.disableSaveButton).toHaveBeenCalled();
    expect(component.selTableRow).not.toBeDefined();
    expect(component.lastSelTableRow).not.toBeDefined();

  });

  it('should reset form if new item mode is true', async function () {

    // Arrange
    component.newItemMode = true;
    spyOn(component, 'disableSaveButton').and.callThrough();
    const getDataSourceResult = [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM];
    spyOn(component.tableComponent, 'getDataSource').and.returnValue(of(getDataSourceResult));

    // Act
    component.resetForm();

    // Assert
    expect(component.disableSaveButton).toHaveBeenCalled();
    expect(component.newItemMode).toBeFalsy();
    expect(component.tableComponent).toBeDefined();
    expect(component.tableComponent.getDataSource).toHaveBeenCalled();

  });

  it('should save positions at form submit', async function () {

    // Arrange
    component.newItemMode = false;
    component.selTableRow = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM;
    component.pTable = TestBed.inject(CustomPTableComponent);
    component.pTable.pTable = pTable;
    component.pTable.pTable._value = [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM];
    const priceListSalesService: PriceListSalesService = TestBed.inject(PriceListSalesService);
    const expectedSavePositionsResult: { result: boolean, message: string } = {result: true, message: 'OK'};
    spyOn(priceListSalesService, 'savePositions').and.returnValue(Promise.resolve(expectedSavePositionsResult));
    spyOn(component, 'disableSaveButton').and.callThrough();

    // Act
    component.onPrilistPositionsFormSubmit().then(() => {
      // Assert
      expect(component.pTable.pTable._value).toBeDefined();
      expect(priceListSalesService.savePositions).toHaveBeenCalled();
      expect(component.disableSaveButton).toHaveBeenCalled();
      expect(component.tableComponent).toBeDefined();
    })

  });

  it('should close', async function () {

    // Arrange
    spyOn(component, 'onTableFormCancel').and.callThrough();

    // Act
    component.close();

    // Assert
    expect(component.onTableFormCancel).toHaveBeenCalled();
  });

  it('should empty form at new item mode = true, on table form cancel', async function () {

    // Arrange
    component.newItemMode = true;
    spyOn(component, 'tableUpdate').and.callThrough();

    // Act
    component.onTableFormCancel();

    // Assert
    expect(component.newItemMode).toBeFalsy();
    expect(component.tableUpdate).toHaveBeenCalled();
  });

});
