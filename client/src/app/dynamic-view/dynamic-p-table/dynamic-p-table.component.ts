import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DynamicTableComponent} from "../dynamic-table/dynamic-table.component";
import {PageService} from "../../views/custom/custom-table/page.service";
import {TableDataService} from "../../_services/table-data.service";
import {DynamicTableService} from "../../_services/dynamic-table.service";
import {MatDialog} from "@angular/material/dialog";
import {Table} from "primeng/table";
import {
  ConstantsService,
  CustomersTypes,
  ORDER_POSITIONS_COLS,
  ORDER_POSITIONS_DIALOG_COLS
} from "../../_services/constants.service";
import {OrderPositionItem} from "../../interfaces/order-position-item";
import {FormOptionsNVS} from "../../interfaces/form-options";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {ConfirmationService} from "primeng/api";
import {PricelistSales} from "../../interfaces/price-list-sales-item";
import {StatesTestConstants} from "../../../assets/test-constants/states";
import {InvoicePositionItem} from "../../interfaces/invoice-position-item";

@Component({
  selector: 'dynamic-p-table',
  templateUrl: './dynamic-p-table.component.html',
  styleUrls: ['./dynamic-p-table.component.css'],
  providers: [TranslateItPipe]
})
export class DynamicPTableComponent extends DynamicTableComponent {

  @ViewChild('pTable', {static: false}) pTable: Table

  cols: any[]     // An array of objects to represent dynamic columns
  rows: number    // Number of rows to display per page
  dataKey: string // A property to uniquely identify a record in data. For cell editing: default editMode is 'cell'
  // ToDo: Load states from db
  ordPosStates: FormOptionsNVS[]
  dlvPosStates: FormOptionsNVS[]
  invPosStates: FormOptionsNVS[]
  releaseFlag: boolean  // Flag to set all editable table fields as readonly, if the value is true
  fullEditMode: boolean // Flag to manage editing readonly fields like ASSIGN_QTY at order positions

  constructor(protected pageService: PageService,
              protected tableDataService: TableDataService,
              protected dynamicTableService: DynamicTableService,
              public dialog: MatDialog,
              protected cd: ChangeDetectorRef,
              private CONSTANTS: ConstantsService,
              public translatePipe: TranslateItPipe,
              private confirmationService: ConfirmationService) {
    super(pageService, tableDataService, dynamicTableService, dialog);

    const columnData = this.getPositionCols(CustomersTypes.B2C)
    this.cols = columnData.cols
    this.rows = CONSTANTS.PRILISTS_PTABLE_MAX_ROWS
    this.setDataKey("id")
    this.fullEditMode = false
    // ToDo: Load states from db
    this.ordPosStates = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS
    this.dlvPosStates = StatesTestConstants.STATES_SELECT_LI_POSITIONS
    this.invPosStates = StatesTestConstants.STATES_SELECT_RG_POSITIONS
  }

  /**
   * after view is initialized
   */
  public ngAfterViewInit(): void {
    if (this.staticInput) {
      this.refTable = this.staticInput?.refTable
      this.releaseFlag = this.staticInput?.parentModalData ? this.staticInput?.parentModalData['RELEASE'] : false
    }
    this.cd.detectChanges()
  }

  /**
   * set cols
   *
   * @param cols
   */
  setCols(cols: any[]) {
    this.cols = cols;
  }

  /**
   * set rows
   *
   * @param rows
   */
  setRows(rows: number) {
    this.rows = rows;
  }

  /**
   * set table data key
   *
   * @param key
   */
  setDataKey(key: string) {
    this.dataKey = key;
  }

  /**
   * get cols item properties
   *
   * @param itemName
   */
  public getColsItemProperties(itemName: string) {
    for (let cItem in this.cols) {
      if (this.cols.hasOwnProperty(cItem)) {
        if (this.cols[cItem].field === itemName) {
          return this.cols[cItem];
        }
      }
    }
    return false;
  }

  /**
   * get max of input number digits
   *
   * @param field
   */
  getInputNumberMax(field: string): number {
    return (field === 'PRIORITY') ? this.CONSTANTS.PRILISTS_PRIORITY_MAX : this.CONSTANTS.DEFAULT_PRIORITY_MAX;
  }

  /**
   * get min of input number digits
   */
  getInputNumberMin(): number {
    return this.CONSTANTS.PRILISTS_PRIORITY_MIN;
  }

  /**
   * condition if position should be shown as span
   *
   * @param refTable
   * @param rowIndex
   * @param colField
   */
  public showPositionAsSpan(refTable: string, rowIndex: number, colField?: string) {
    if (refTable === this.CONSTANTS.REFTABLE_ORDERS_POSITIONS) {
      return this.data[rowIndex] ? (this.releaseFlag || !this.fullEditMode ||
        ((this.data[rowIndex] as OrderPositionItem).CATEGORY_SOAS === this.CONSTANTS.CATEGORY_SOAS_KOMP ||
          ((this.data[rowIndex] as OrderPositionItem).POSITION_STATUS === this.ordPosStates[2].value  ||
            (this.data[rowIndex] as OrderPositionItem).POSITION_STATUS === this.ordPosStates[3].value ) ||
          this.getColsItemProperties(colField).readonly)) : false;
    } else if (refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS) {
      return true;
    } else if (refTable === this.CONSTANTS.REFTABLE_PRILISTS_DETAILS) {
      return this.getColsItemProperties(colField).readonly;
    } else {
      return false;
    }
  }

  /**
   * show position as text area
   *
   * @param refTable
   * @param rowIndex
   * @param colField
   */
  public showPositionAsTextArea(refTable: string, rowIndex: number, colField?: string): boolean {
    if (refTable === this.CONSTANTS.REFTABLE_ORDERS_POSITIONS) {
      return this.data[rowIndex] ?
        (!this.releaseFlag && (this.fullEditMode && colField === 'ITMDES')) : false;
    } else if (refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS) {
      return false;
    } else if (refTable === this.CONSTANTS.REFTABLE_PRILISTS_DETAILS) {
      return false;
    } else {
      return false;
    }
  }

  /**
   * show position state text
   *
   * @param tableType
   * @param column
   * @param posState
   */
  public showPositionStateText(tableType: string, column: string, posState: number): string {
    if (column && column === 'POSITION_STATUS') {
      if ('ord' === tableType) {
        for (let opsItem in this.ordPosStates) {
          if (this.ordPosStates.hasOwnProperty(opsItem) && this.ordPosStates[opsItem].value === posState) {
            return this.translatePipe.transform(this.ordPosStates[opsItem].name);
          }
        }
      } else if ('dlv' === tableType) {
        for (let dpsItem in this.dlvPosStates) {
          if (this.dlvPosStates.hasOwnProperty(dpsItem) && this.dlvPosStates[dpsItem].value === posState) {
            return this.translatePipe.transform(this.dlvPosStates[dpsItem].name);
          }
        }
      } else if ('inv' === tableType) {
        for (let ipsItem in this.invPosStates) {
          if (this.invPosStates.hasOwnProperty(ipsItem) && this.invPosStates[ipsItem].value === posState) {
            return this.translatePipe.transform(this.invPosStates[ipsItem].name);
          }
        }
      }
    }
    return posState?.toString();
  }

  /**
   * condition if position can be deleted (show delete button)
   *
   * @description
   * Positions in Orders can be deleted if:
   * 1. the postion/article has no data in the database field PARENT_LINE_ID
   * 2. the position was not delivered yet.
   *
   * IMPORTANT: If delete button should be shown set form setting full edit mode to true,
   * to activate delete button in table header, see showDeletePositionButtonInTH() and
   * detail-view-tab-group-positions.service.ts > showOrderPositions
   * detail-view-tab-group-positions.service.ts > showInvoicePositions
   *
   * @param rowIndex
   */
  public showDeleteButtonForSetPosition(rowIndex: number): boolean {
    if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS_POSITIONS) {
      if (this.data[rowIndex] && (this.ordPosStates !== undefined)) {
        const ordPosWithId = this.data[rowIndex]; // OrderPositionItem  && !this.formDisabledFlag
        return this.data && !this.releaseFlag && this.fullEditMode &&
          ordPosWithId['PARENT_LINE_ID'] === null && ordPosWithId['POSITION_STATUS'] !== this.ordPosStates[0].value;
      } else {
        return false;
      }
    } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE_POSITIONS) {
      if (this.data[rowIndex] && (this.invPosStates !== undefined)) {
        const invPosWithId = this.data[rowIndex]; // InvoicePositionItem
        return this.data && !this.releaseFlag && this.fullEditMode &&
          invPosWithId['ORDERS_NUMBER'] === "" && invPosWithId['DELIVERY_NOTES_NUMBER'] === "" &&
          invPosWithId['PARENT_LINE_ID'] === null && invPosWithId['POSITION_STATUS'] !== this.invPosStates[1].value;
      } else {
        return false;
      }
    } else if (this.refTable === this.CONSTANTS.REFTABLE_PRILISTS_DETAILS) {
      return this.data && this.fullEditMode;
      // && this.data[rowIndex] && !this.releaseFlag && // @ts-ignore
      // this.data[rowIndex].PARENT_LINE_ID === null && this.ordPosStates && // @ts-ignore
      // this.data[rowIndex].POSITION_STATUS !== this.ordPosStates[0].value;
    } else {
      return false;
    }
  }

  /**
   * returns flag if delete position button should be shown in table header
   */
  showDeletePositionButtonInTH() {
    return !this.releaseFlag && this.fullEditMode;
  }

  /**
   * delete one position (SET + ITEMS) and refresh table view
   *
   * @param position
   * @param index
   */
  async deletePosition(position: OrderPositionItem | InvoicePositionItem | PricelistSales, index: number) {
    let deleteMessage = this.translatePipe.transform('DELETE_TITLE');
    let deleteTitle = deleteMessage.replace('%s', this.translatePipe.transform(
      (this.refTable === this.CONSTANTS.REFTABLE_ORDERS_POSITIONS ||
        this.refTable === this.CONSTANTS.REFTABLE_INVOICE_POSITIONS) ? 'ITMNUM' : 'PRILIST'));
    deleteMessage = deleteMessage.replace('%s',
      this.translatePipe.transform(
        (this.refTable === this.CONSTANTS.REFTABLE_ORDERS_POSITIONS ||
          this.refTable === this.CONSTANTS.REFTABLE_INVOICE_POSITIONS) ?
          this.translatePipe.transform('ITMNUM') + ' ' + '\"' + position.ITMNUM + '\"'
          : // @ts-ignore
          this.translatePipe.transform('PRILIST') + ' ' + '\"' + position.PRILIST + '\"'));
    this.confirmationService.confirm({
      header: deleteTitle,
      message: deleteMessage,
      acceptLabel: this.translatePipe.transform('DIALOG_YES'),
      rejectLabel: this.translatePipe.transform('DIALOG_NO'),
      accept: async () => {
        await this.deleteItem(position, index);
      }
    });
  }

  /**
   * ToDo: Move this function to helper or service class
   * delete position item
   *
   * @param position
   * @param index
   * @private
   */
  private async deleteItem(position: OrderPositionItem | InvoicePositionItem | PricelistSales, index: number) {
    // let userRole: string = localStorage.getItem(this.CONSTANTS.LS_ROLE);
    // if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS_POSITIONS) {
    //   await this.deleteOrderPosition(position, userRole, index);
    // } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE_POSITIONS) {
    //   const invoicePosition: InvoicePositionItem = position;
    //   if (!invoicePosition.ORDERS_NUMBER && !invoicePosition.DELIVERY_NOTES_NUMBER) {
    //     console.log('DELETE INVOICE POSITION...');
    //     await this.deleteInvoicePosition(position, userRole, index);
    //   } else {
    //     this.messagesService.showErrorMessage('This position has order and/or delivery note number set!');
    //   }
    // } else if (this.refTable === this.CONSTANTS.REFTABLE_PRILISTS_DETAILS) {
    //   // ToDo: Manage to receive result, to check if item was deleted
    //   if ("PRILIST" in position) {
    //     await this.tableDataService.deleteTableData(this.CONSTANTS.REFTABLE_PRILISTS_TITLE,
    //       this.CONSTANTS.REFTABLE_PRILISTS_COLUMN_ID, position.ID.toString(),
    //       this.CONSTANTS.REFTABLE_PRILISTS_COLUMN_PRILIST,
    //       position.PRILIST, this.CONSTANTS.REFTABLE_PRILISTS_COLUMN_CUSGRP, position.CUSGRP, userRole);
    //     // @ts-ignore
    //     this.positionsWithId = this.positionsWithId.filter((val, i) => i != index);
    //     // send service message via subscription, to notify detail view to refresh
    //     this.fetchTableService.setDataObs(this.refTable, position.PRILIST, true,
    //       [], true);
    //     // this.formService.showErrorMessage('deletePosition: Error occurred. Item was not deleted!');
    //   }
    // }
  }

  /**
   * highlight 'SET' position
   *
   * @param refTable
   * @param rowIndex
   */
  public highlightSetPosition(refTable: string, rowIndex: number): string {
    if (refTable === this.CONSTANTS.REFTABLE_PRILISTS_DETAILS) {
      return '';
    } else {
      return (this.data[rowIndex] && // @ts-ignore
        this.data[rowIndex].CATEGORY_SOAS !== this.CONSTANTS.CATEGORY_SOAS_KOMP) ? 'lightgrey' : '';
    }
  }

  /**
   * consume key on input key down (ArrowLeft and ArrowRight)
   *
   * @param event
   */
  consumeKey(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.stopPropagation();
    }
  }

  /**
   * Returns cols for position item and dialog position item (without id) disabled - if true, not show column in table
   *
   * @param clientType
   */
  public getPositionCols(clientType: CustomersTypes):
    {
      cols:
        { field: string, header: string, disabled: boolean, readonly: boolean, size: number, width: string }[],
      dialogCols:
        any[]
    } {
    // ToDo: Manage toggle of ASSIGNED_QTY: disabled: true; disabled: false (fullMode = true)
    let dialogCols: { field: string; size: number; header: string; disabled: boolean }[] = ORDER_POSITIONS_DIALOG_COLS;
    for (let item in dialogCols) {
      if (dialogCols[item]) {
        if (dialogCols[item].field === 'PRICE_BRU') {
          dialogCols[item].disabled = (clientType !== this.CONSTANTS.CLIENT_B2C);
        } else if (dialogCols[item].field === 'PRICE_NET') {
          dialogCols[item].disabled = (clientType === this.CONSTANTS.CLIENT_B2C);
        }
      }
    }
    return {cols: ORDER_POSITIONS_COLS, dialogCols: dialogCols};
  }
}
