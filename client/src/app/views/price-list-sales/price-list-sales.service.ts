import { Injectable } from '@angular/core';
import {PricelistSales} from "../../interfaces/price-list-sales-item";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {TableDataService} from "../../_services/table-data.service";
import {ConstantsService, PRICE_LIST_SALES_POSITIONS_COLS} from "../../_services/constants.service";
import {OrderPositionItem} from "../../interfaces/order-position-item";
import {DeliveryNotePositionItem} from "../../interfaces/delivery-note-position-item";
import {InvoicePositionItem} from "../../interfaces/invoice-position-item";
import {HelperService} from "../../_services/helper.service";
import {FormOptionsNVs} from "../../interfaces/form-options";

@Injectable({
  providedIn: 'root'
})
export class PriceListSalesService {

  translatePipe: TranslateItPipe;

  constructor(private tableDataService: TableDataService,
              private CONSTANTS: ConstantsService,
              private helperService: HelperService) { }

  /**
   * set translate pipe
   *
   * @param translatePipe
   */
  setTranslatePipe(translatePipe) {
    this.translatePipe = translatePipe;
  }

  /**
   * price list position columns settings
   *
   * - disabled: boolean flag, if the column should not be shown = true
   *
   * - readonly: boolean flag, if the column should be not editable = true. the logic for set field readonly is in
   * custom-p-table: e.g.
   *  set editable: showPositionAsTextArea(), showPositionAsInput()
   *  set readonly: showPositionAsSpan()
   *
   * - size: is not used yet
   * - width: the width of each column in %
   */
  public getPriceListPositionCols(): {
    field: string, header: string, disabled: boolean, readonly: boolean, size: number, width: string, rows: number,
    cols: number, type: string
  }[] {
    return PRICE_LIST_SALES_POSITIONS_COLS;
  }

  /**
   * save positions
   *
   * @param positionsItems
   * @param updatedPositionsRows
   * @param pDataTableValues
   * @param itemNumber
   */
  public async savePositions(
    positionsItems: OrderPositionItem[]|DeliveryNotePositionItem[]|InvoicePositionItem[]|PricelistSales[],
    updatedPositionsRows: string[], pDataTableValues: any[], itemNumber: string, currencies: FormOptionsNVs[]):
    Promise<{result: boolean, message: string}> {
    // extract row numbers from ids
    let rowNumbers = [];
    let rowIdNumbers = [];
    const __ret = this.getChangedPositionsRowIds(updatedPositionsRows, rowNumbers, rowIdNumbers, 3,
      1);
    rowNumbers = __ret.rowNumbers;
    rowIdNumbers = __ret.rowIdNumbers;
    let result: boolean = false;
    let message: string = "Save positions error.";
    // load taxation
    if (positionsItems) {
      if (Object.keys(rowNumbers).length > 0) {
        let allUpdateDataArr = [];
        let updateData: PricelistSales;
        let positionsError: boolean = false;
        let counter: number = 0;
        for (let rowItem in rowNumbers) {
          for (let opDatItem in pDataTableValues) {
            if (opDatItem === rowNumbers[rowItem]) { // compare POS of table and update rows POS
              // get real ID of the row for orders and update position
              counter = 0;
              if (pDataTableValues[opDatItem].ITMNUM &&
                pDataTableValues[opDatItem].ITMNUM.trim().length > 0) {
                // ToDo: Prices NET/BRU like at setPriceLogic ??? Or should they stay manually set?
                let priceNet = pDataTableValues[opDatItem].PRICE_NET;
                let priceBru = pDataTableValues[opDatItem].PRICE_BRU;
                // update this item in db
                updateData = {
                  'ID': rowIdNumbers[rowItem],
                  'ITMNUM': pDataTableValues[opDatItem].ITMNUM,
                  'PRICE_NET': priceNet,
                  'PRICE_BRU': priceBru,
                  'CURRENCY': pDataTableValues[opDatItem].CURRENCY,
                  'PRILIST': pDataTableValues[opDatItem].PRILIST,
                  'CUSGRP': pDataTableValues[opDatItem].CUSGRP,
                  'START_DATE': pDataTableValues[opDatItem].START_DATE,
                  'END_DATE': pDataTableValues[opDatItem].END_DATE,
                  'PRIORITY': pDataTableValues[opDatItem].PRIORITY
                };
                // move all update rows to array
                allUpdateDataArr.push(updateData);
              } else {
                positionsError = true;
                message = this.translatePipe.transform('FIELD_SHOULD_NOT_BE_EMPTY')
                  .replace('%s', this.translatePipe.transform('ITMNUM'));
              }
              break;
            }
          }
        }
        if (!positionsError) {
          let insertFlag: boolean = false;
          let overwriteCurrent: boolean = false;
          // execute update query: where is by ITMNUM
          let updateResult: {result: boolean, message: string} = await this.execUpdatePositions(
            this.CONSTANTS.REFTABLE_PRILISTS, this.CONSTANTS.REFTABLE_PRILISTS, this.CONSTANTS.REFTABLE_PRILISTS_COLUMN,
            itemNumber, allUpdateDataArr, insertFlag, overwriteCurrent, currencies);
          result = updateResult.result;
          message = updateResult.message;
        } else {
          // ToDo: Do properly reset the position item => if refresh same tab where you are => no changes!
          // fullEditMode = false; // !!!
        }
      } else {
        message = 'save position: No row keys found for ITMNUM "' + itemNumber + '"!';
      }
    }
    return {result: result, message: message};
  }

  /**
   * get row ids of changed position items
   *
   * @param updatedPositionsRows
   * @param rowNumbers
   * @param rowIdNumbers
   * @param rowPosition
   * @param rowIdPosition
   * @private
   */
  getChangedPositionsRowIds(updatedPositionsRows: any[], rowNumbers: any[], rowIdNumbers: any[],
                            rowPosition: number, rowIdPosition: number):
    { rowNumbers: any[], rowIdNumbers: any[] } {
    for (let opItem in updatedPositionsRows) { // "_1_2" // id_79_td_1_2
      if (updatedPositionsRows[opItem] && updatedPositionsRows[opItem].length > 0) {
        let oneRow = updatedPositionsRows[opItem].split('_');
        if (Object.keys(oneRow).length > 0) {
          // avoid duplicates
          if (rowNumbers.indexOf(oneRow[rowPosition]) == -1) {
            rowNumbers.push(oneRow[rowPosition]);
            rowIdNumbers.push(oneRow[rowIdPosition]);
          }
        }
      }
    }
    return {rowNumbers, rowIdNumbers};
  }

  /**
   * Update order or delivery note positions
   *
   * @param currentTableToSave
   * @param saveToTableName
   * @param itemKey
   * @param itemValue
   * @param orderPositionsElements
   * @param insertFlag
   * @param overwriteCurrent
   */
  private async execUpdatePositions(currentTableToSave: string, saveToTableName: string, itemKey: string,
                                    itemValue: string, orderPositionsElements: any, insertFlag: boolean,
                                    overwriteCurrent: boolean, currencies: FormOptionsNVs[]): Promise<{ result: boolean, message: string }> {
    let result: boolean = false;
    let message: string = 'Update positions error.';
    let secondaryKey = itemKey;
    let secondaryValue = itemValue;
    // convert currency field from text to id
    for (let item in orderPositionsElements) {
      if (orderPositionsElements.hasOwnProperty(item)) {
        orderPositionsElements[item].CURRENCY =
          this.helperService.getCurrencyIdByIsoCode(currencies, orderPositionsElements[item].CURRENCY);
      }
    }
    let dbData: { result: any } | { error: any } =
      await this.tableDataService.setTableRowsData(saveToTableName, orderPositionsElements,
        secondaryKey, secondaryValue, insertFlag, undefined, undefined);
    if (dbData && dbData['result']) {
      if (dbData['result']['success']) {
        if (dbData['result']['itmnums']) {
          let messageDetails: string = "";
          // "Die Position(en) %s2 %s3 %s1 wurden aktualisiert."
          messageDetails = this.translatePipe.transform('POSITION_SAVED_DETAILS');
          messageDetails = messageDetails.replace('%s1', secondaryValue);
          messageDetails = messageDetails.replace('%s2', dbData['result']['itmnums']);
          messageDetails = messageDetails.replace('%s3',
            this.translatePipe.transform('POSITION_SAVED_DETAILS_POSITIONS'));
          message = messageDetails;
        } else {
          message = this.translatePipe.transform('SAVEDSUCCESS');
        }
        result = true;
      } else {
        message = this.translatePipe.transform('SAVEDFAILED');
      }
    }
    return {result, message};
  }

}
