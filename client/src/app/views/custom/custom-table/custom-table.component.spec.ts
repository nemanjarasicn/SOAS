import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {CustomTableComponent} from "./custom-table.component";
import {RxFormBuilder} from "@rxweb/reactive-form-validators";
import {TestingModule} from "../../../testing/testing.module";
import {TranslateItPipe} from "../../../shared/pipes/translate-it.pipe";
import {ArticlesTestConstants} from "../../../../assets/test-constants/articles";
import {SoasModel} from "../../../_services/constants.service";
import {CountriesTestConstants} from "../../../../assets/test-constants/countries";
import {PageEvent} from "@angular/material/paginator";
import {CurrenciesTestConstants} from "../../../../assets/test-constants/currencies";
import {PaginatedDataSource} from "./paginated-datasource";
import {PaginatedEndpoint, Sort} from "./page";

describe('CustomTableComponent', () => {
  let component: CustomTableComponent;
  let fixture: ComponentFixture<CustomTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [CustomTableComponent, TranslateItPipe],
      providers: [RxFormBuilder, TranslateItPipe]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select table item', () => {

    // Arrange
    const item: number = 1;

    // Act
    component.selectTableItem(item);

    // Assert
    expect(component.selectionIndex).toEqual(item);
  });

  it('should return selected index item', () => {

    // Arrange
    const selItemKey: string = "ITMNUM";
    const selItemValue: string = ArticlesTestConstants.ARTICLES_ITEM.ITMNUM;
    component.items = [ArticlesTestConstants.ARTICLES_ITEM];
    // const selItemId?: string;
    const expectedResult: { selItemFound: boolean, selectionIndex: number } =
      {selItemFound: true, selectionIndex: 0};

    // Act
    const result: { selItemFound: boolean, selectionIndex: number } =
      component.getSelectedIndex(selItemKey, selItemValue);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should set selected table row', () => {

    // Arrange
    const selTableRow: SoasModel = CountriesTestConstants.COUNTRIES_ITEM;
    const selIndex: number = 1;

    // Act
    component.setSelTableRow(selTableRow, selIndex);

    // Assert
    expect(component.selTableRow).toEqual(selTableRow);
    expect(component.selectionIndex).toEqual(selIndex);
  });

  it('should set columns to display', () => {

    // Arrange
    const columnsToDisplay: string[] = ['ID'];

    // Act
    component.setColumnsToDisplay(columnsToDisplay);

    // Assert
    expect(component.columnsToDisplay).toEqual(columnsToDisplay);
  });

  it('should set csv template configs', () => {

    // Arrange
    const csvTemplateConfigs: [] = [];

    // Act
    component.setCsvTemplateConfigs(csvTemplateConfigs);

    // Assert
    expect(component.csvTemplateConfigs).toEqual(csvTemplateConfigs);
  });

  it('should set allow multi select', () => {

    // Arrange
    const flag: boolean = true;

    // Act
    component.setAllowMultiSelect(flag);

    // Assert
    expect(component.allowMultiSelect).toEqual(flag);
  });

  it('should get allow multi select', () => {

    // Arrange
    component.allowMultiSelect = false;

    // Act
    const result: boolean = component.getAllowMultiSelect();

    // Assert
    expect(result).toEqual(component.allowMultiSelect);
  });

  it('should set countries', () => {

    // Arrange
    const countries: any[] = [];

    // Act
    component.setCountries(countries);

    // Assert
    expect(component.countries).toEqual(countries);
  });

  it('should manage key down event of arrow down', fakeAsync(() => {

    // Arrange
    const event: KeyboardEvent = new KeyboardEvent('keydown', {code: 'KeyA', key: 'ArrowDown'});
    const selRow: SoasModel = CountriesTestConstants.COUNTRIES_ITEM;
    const selIndex: number = 0;
    component.items = [CountriesTestConstants.COUNTRIES_ITEM, CountriesTestConstants.COUNTRIES_ITEM];
    component.setClickedRow = new Function();
    spyOn(component, 'setClickedRow').and.callThrough();

    // Act
    component.tableKeydown(event, selRow, selIndex);

    // Assert
    // expect(component.setClickedRow).toHaveBeenCalled();
  }));

  it('should manage key down event of arrow up', fakeAsync(() => {

    // Arrange
    const event: KeyboardEvent = new KeyboardEvent('keydown', {code: 'KeyA', key: 'ArrowUp'});
    const selRow: SoasModel = CountriesTestConstants.COUNTRIES_ITEM;
    const selIndex: number = 0;
    component.items = [CountriesTestConstants.COUNTRIES_ITEM, CountriesTestConstants.COUNTRIES_ITEM];
    component.setClickedRow = new Function();
    spyOn(component, 'setClickedRow').and.callThrough();

    // Act
    component.tableKeydown(event, selRow, selIndex);

    // Assert
    // expect(component.setClickedRow).toHaveBeenCalled();
  }));

  it('should set page event', () => {

    // Arrange
    const $event: PageEvent = {pageSize: 14, pageIndex: 1, length: 14} as any;

    // Act
    component.pageEvent($event);

    // Assert
    expect(component.currPageSize).toEqual($event.pageSize);
  });

  it('should return currency name', () => {

    // Arrange
    const currencyId: string = '2';
    component.currenciesWithId = CurrenciesTestConstants.CURRENCIES_SELECT.currenciesWithId;

    // Act
    const result: string = component.getCurrencyName(currencyId);

    // Assert
    expect(result).toEqual('USD');
  });

  it('should return currency name = " ", if given id was not found', () => {

    // Arrange
    const currencyId: string = '1000';
    component.currenciesWithId = CurrenciesTestConstants.CURRENCIES_SELECT.currenciesWithId;

    // Act
    const result: string = component.getCurrencyName(currencyId);

    // Assert
    expect(result).toEqual(' ');
  });

  it('should return currency symbol', () => {

    // Arrange
    const currencyValue: string = '2';
    component.currencies = CurrenciesTestConstants.CURRENCIES_SELECT.currencies;

    // Act
    const result: string = component.getCurrencySymbol(currencyValue);

    // Assert
    expect(result).toEqual('USD');
  });

  it('should not return currency symbol', () => {

    // Arrange
    const currencyValue: string = '1000';
    component.currencies = CurrenciesTestConstants.CURRENCIES_SELECT.currencies;

    // Act
    const result: string = component.getCurrencySymbol(currencyValue);

    // Assert
    expect(result).toEqual(currencyValue);
  });

  it('should return if table is clicked', () => {

    // Arrange
    component.isTableClicked = true;

    // Act
    const result: boolean = component.getIsTableClicked();

    // Assert
    expect(result).toEqual(component.isTableClicked);
  });

  it('should fetch data', () => {

    // Arrange
    const $event: PageEvent = {pageSize: 14, pageIndex: 1, length: 14} as any;
    const endpoint: PaginatedEndpoint<any, any> = undefined;
    const initialSort: Sort<SoasModel> = {property: 'ITMNUM', order: 'asc'};
    const initialQuery: any = {
      search: 'abc',
      registration: new Date
    }
    component.dataSource = new PaginatedDataSource<any, any>(endpoint, initialSort, initialQuery);
    spyOn(component, 'setIsLoadingResults').and.callThrough();
    spyOn(component, 'setSelTableRow').and.callThrough();
    spyOn(component.dataSource, 'fetch').and.callThrough();

    // Act
    component.fetchData($event);

    // Assert
    expect(component.setIsLoadingResults).toHaveBeenCalled();
    expect(component.selectionIndex).toEqual(undefined);
    expect(component.setSelTableRow).toHaveBeenCalled();
    expect(component.dataSource.fetch).toHaveBeenCalled();
  });

});
