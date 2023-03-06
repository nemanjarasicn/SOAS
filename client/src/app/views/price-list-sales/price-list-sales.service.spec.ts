import {fakeAsync, TestBed} from '@angular/core/testing';

import { PriceListSalesService } from './price-list-sales.service';
import {TestingModule} from "../../testing/testing.module";
import {HttpClientModule} from "@angular/common/http";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {MessageService} from "primeng/api";
import {TableDataService} from "../../_services/table-data.service";
import {ConstantsService, PRICE_LIST_SALES_POSITIONS_COLS} from "../../_services/constants.service";
import {PricelistSales} from "../../interfaces/price-list-sales-item";
import {PriceListSalesTestConstants} from "../../../assets/test-constants/price-list-sales";
import {CurrenciesTestConstants} from "../../../assets/test-constants/currencies";
import {FormOptionsNVs} from "../../interfaces/form-options";

describe('PriceListSalesService', () => {
  let service: PriceListSalesService;
  let translate: TranslateItPipe;
  let constantsService: ConstantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, HttpClientModule],
      declarations: [TranslateItPipe],
      providers: [MessageService, TableDataService, TranslateItPipe, ConstantsService]
    });
    service = TestBed.inject(PriceListSalesService);
    constantsService = TestBed.inject(ConstantsService);
    translate = TestBed.inject(TranslateItPipe);
    service.setTranslatePipe(translate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('setTranslatePipe returns false if translatePipe is not set', () => {

    // Arrange

    // Act
    service.setTranslatePipe(undefined);

    // Assert
    expect(service['translatePipe']).toEqual(undefined);
  })

  it('setTranslatePipe returns true (show error message) if translatePipe is set', () => {

    // Arrange

    // Act
    service.setTranslatePipe(translate);

    // Assert
    expect(service['translatePipe']).toEqual(translate);
  })

  it('should return price list positions columns', () => {

    // Arrange

    // Act
    const result = service.getPriceListPositionCols();

    // Assert
    expect(result).toEqual(PRICE_LIST_SALES_POSITIONS_COLS);
  })

  it('should save positions', fakeAsync(() => {

    // Arrange
    const positionsItems: PricelistSales[] = [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM];
    const updatedPositionsRows: string[] = ['id_' + PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.ID +  '_td_0_5'];
    const pDataTableValues: any[] = [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM];
    const itemNumber: string = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.PRILIST;
    const currencies: FormOptionsNVs[] = CurrenciesTestConstants.CURRENCIES_NV;
    const expectedResult: {result: boolean, message: string} = {result: true, message: 'OK'};
    const getChangedPositionsRowIdsResult: {rowNumbers: any[], rowIdNumbers: any[]} =
      {
        rowNumbers: ['0'],
        rowIdNumbers: [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.ID.toString()]
      };
    const setTableRowsDataResult: { result: any } | { error: any } =
      {
        result: {
          success: true,
          itmnums: [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.PRILIST]
        }
      };
    spyOn(service,'getChangedPositionsRowIds').and.returnValue(getChangedPositionsRowIdsResult);
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService,'setTableRowsData').and.returnValue(Promise.resolve(setTableRowsDataResult));
    spyOn(translate, 'transform').and.returnValue('OK');

    // Act
    service.savePositions(positionsItems, updatedPositionsRows, pDataTableValues, itemNumber, currencies)
      .then(
        (result: { result: boolean, message: string }) => {

          // Assert
          expect(service.getChangedPositionsRowIds).toHaveBeenCalled();
          expect(tableDataService.setTableRowsData).toHaveBeenCalled();
          // expect(tableDataService.setTableRowsData).toEqual(setTableRowsDataResult);
          expect(result).toEqual(expectedResult);

        })

  }))

  it('should not save positions if ITMNUM is not set', fakeAsync(() => {

    // Arrange
    const positionsItems: PricelistSales[] = [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM];
    const updatedPositionsRows: string[] = ['id_' + PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.ID +  '_td_0_5'];
    let priceListItem: PricelistSales =
      JSON.parse(JSON.stringify(PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM));
    // delete ITMNUM to provoke error
    priceListItem.ITMNUM = '';
    const pDataTableValues: any[] = [priceListItem];
    const itemNumber: string = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.PRILIST;
    const currencies: FormOptionsNVs[] = CurrenciesTestConstants.CURRENCIES_NV;
    // const expectedResult: {result: boolean, message: string} = {result: true, message: 'OK'};
    const getChangedPositionsRowIdsResult: {rowNumbers: any[], rowIdNumbers: any[]} =
      {
        rowNumbers: ['0'],
        rowIdNumbers: [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.ID.toString()]
      };
    spyOn(service,'getChangedPositionsRowIds').and.returnValue(getChangedPositionsRowIdsResult);
    spyOn(translate, 'transform').and.returnValue('ERROR');

    // Act
    service.savePositions(positionsItems, updatedPositionsRows, pDataTableValues, itemNumber, currencies).then(
      (result: {result: boolean, message: string}) => {

        // Assert
        expect(service.getChangedPositionsRowIds).toHaveBeenCalled();
        expect(translate.transform).toHaveBeenCalled();
        // expect(result).toEqual(expectedResult);
      })

  }))

  it('should not save positions if row number was not found', fakeAsync(() => {

    // Arrange
    const positionsItems: PricelistSales[] = [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM];
    const updatedPositionsRows: string[] = ['id_' + PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.ID +  '_td_0_5'];
    const pDataTableValues: any[] = [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM];
    const itemNumber: string = PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.PRILIST;
    const currencies: FormOptionsNVs[] = CurrenciesTestConstants.CURRENCIES_NV;
    const expectedResult: {result: boolean, message: string} = {
      result: false,
      message: 'save position: No row keys found for ITMNUM "' + itemNumber + '"!'
    };
    const getChangedPositionsRowIdsResult: {rowNumbers: any[], rowIdNumbers: any[]} =
      {
        rowNumbers: [], // row number not found = empty
        rowIdNumbers: [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.ID.toString()]
      };
    spyOn(service,'getChangedPositionsRowIds').and.returnValue(getChangedPositionsRowIdsResult);
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService,'setTableRowsData').and.callThrough();
    spyOn(translate, 'transform').and.returnValue('OK');

    // Act
    service.savePositions(positionsItems, updatedPositionsRows, pDataTableValues, itemNumber, currencies).then(
      (result: {result: boolean, message: string}) => {

        // Assert
        expect(service.getChangedPositionsRowIds).toHaveBeenCalled();
        expect(tableDataService.setTableRowsData).not.toHaveBeenCalled();
        expect(result).toEqual(expectedResult);
      })

  }))

  it('should return changed positions row ids', () => {

    // Arrange
    const updatedPositionsRows: string[] = ['id_' + PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.ID +  '_td_0_5'];
    const rowNumbers: any[] = ["0"];
    const rowIdNumbers: any[] = [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.ID.toString()];
    const rowPosition: number = 3;
    const rowIdPosition: number = 1;
    const getChangedPositionsRowIdsResult: {rowNumbers: any[], rowIdNumbers: any[]} =
      {
        rowNumbers: ['0'],
        rowIdNumbers: [PriceListSalesTestConstants.PRICE_LIST_SALES_ITEM.ID.toString()]
      };

    // Act
    const result =
      service.getChangedPositionsRowIds(updatedPositionsRows, rowNumbers, rowIdNumbers, rowPosition, rowIdPosition);

    // Assert
    expect(result).toEqual(getChangedPositionsRowIdsResult);

  })

});
