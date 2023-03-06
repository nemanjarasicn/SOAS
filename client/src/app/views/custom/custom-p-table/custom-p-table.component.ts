import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import {OrderPositionItem} from '../../../interfaces/order-position-item';
import {ConstantsService, ViewQueryTypes} from '../../../_services/constants.service';
import {TranslateItPipe} from '../../../shared/pipes/translate-it.pipe';
import {TableDataService} from '../../../_services/table-data.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {FetchTableService} from '../../../_services/fetch-table.service';
import {Subscription} from 'rxjs';
import {InvoicePositionItem} from '../../../interfaces/invoice-position-item';
import {DeliveryNotePositionItem} from '../../../interfaces/delivery-note-position-item';
import {PricelistSales} from '../../../interfaces/price-list-sales-item';
import {MessagesService} from "../../../_services/messages.service";
import {FormOptionsNVS} from "../../../interfaces/form-options";

/**
 * @deprecated, switch to DynamicPTableComponent
 */
@Component({
  selector: 'app-custom-p-table',
  templateUrl: './custom-p-table.component.html',
  styleUrls: ['./custom-p-table.component.css'],
  providers: [TranslateItPipe, MessageService]
})

/**
 * CustomPTableComponent - custom primeng p-table view for the positions table.
 *
 * Important:
 * Add tag "<p-confirmDialog header="Confirmation" icon="pi pi-exclamation-triangle"></p-confirmDialog>" for showing
 * delete dialog to components view, that is using CustomPTableComponent! See examples of PriceListSalesComponent or
 * DetailViewTabGroupComponent.
 *
 *
 * Used by: DetailViewTabGroupComponent
 */
export class CustomPTableComponent implements OnInit {

  refTable: string;
  errorMessage: string;
  errorTdId: string;

  // fetch data subscription (communicate with detail-view-tab-group)
  serviceTableSubscription: Subscription;

  newPositionMode: boolean;

  @ViewChild('pTable', {static: false}) pTable: Table;

  tableForm: FormGroup;

  // orders positions items data loaded from database (id's still available). running index (1,2,3...) will be added here.
  positionsWithId: OrderPositionItem[]|DeliveryNotePositionItem[]|InvoicePositionItem[]|PricelistSales[]; // replace orderPositionsItems
  // order positions updated items
  updatedPositionsRows: string[]; // replace updatedOrderPositionsRows

  cols: any[]; // order positions form columns
  rows: number = 6;
  dataIsAvailableFlag: boolean; // replace formDataAvailableFlag
  positionsEditableFlag: boolean;

  releaseFlag: boolean;
  fullEditMode: boolean;
  // Flag to disable form fields or positions buttons
  formDisabledFlag: boolean;

  createPositionTitle: string;
  dataKey: string;

  // if false - positions table will be reset, if true - close positions view
  resetState: boolean;

  // Functions that will be initialized from main component
  disableSaveButton: Function;
  inputValidationPriceCalculation: Function;
  showDialogToAdd: Function;

  ordPosStates: FormOptionsNVS[];
  dlvPosStates: FormOptionsNVS[];
  invPosStates: FormOptionsNVS[];

  constructor(private fb: FormBuilder,
              private tableDataService: TableDataService,
              private CONSTANTS: ConstantsService,
              public translatePipe: TranslateItPipe,
              private fetchTableService: FetchTableService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private messagesService: MessagesService) {
    this.errorTdId = '';
    this.positionsWithId = [];
    // this.resetPositions();
    this.updatedPositionsRows = [];
    this.newPositionMode = false;
    this.dataIsAvailableFlag = true;
    this.positionsEditableFlag = false;
    this.releaseFlag = false;
    this.fullEditMode = false;
    this.formDisabledFlag = false;
    this.tableForm = this.fb.group({
      pTable: new FormControl
    });
    this.messagesService.setTranslatePipe(translatePipe);
  }

  ngOnInit(): void {

    // subscribe to wait for loaded changes
    this.serviceTableSubscription = this.fetchTableService.getDataObs().subscribe(async (dataObj) => {
      if (dataObj) { // this.detailViewInitialized &&

        // let viewType: ComponentViewTypes;
        // if (dataObj.refTableName === this.CONSTANTS.REFTABLE_WAREHOUSING) {
        //   this.selTableRow = dataObj.selTableRow;
        //   viewType = ComponentViewTypes.Table;
        // } else if (dataObj.refTableName === this.CONSTANTS.REFTABLE_WAREHOUSING_DETAILS) {
        //   this.detailViewListComponents.first.customTableComponent.first.selTableRow = dataObj.selTableRow;
        //   viewType = ComponentViewTypes.Details;
        // }
        // this.tableUpdate(viewType);

        // do resolve changes came from p-table...
        // console.log('custom-p-table dataObj: ', dataObj);

      }
    });
  }

  ngOnDestroy() {
    if (this.serviceTableSubscription && !this.serviceTableSubscription.closed) {
      this.serviceTableSubscription.unsubscribe();
    }
  }

  /**
   * send service result
   *
   * @param: dataObj
   */
  public sendServiceResult(dataObj: {
    refTableName: string, fieldName: string, disableSaveButton: boolean, positions: string[],
    refreshDetailView: boolean
  }) {
    this.fetchTableService.setDataObs(dataObj.refTableName, dataObj.fieldName, dataObj.disableSaveButton,
      dataObj.positions, dataObj.refreshDetailView);
  }

  setFullEditMode(flag: boolean) {
    this.fullEditMode = flag;
  }

  /**
   * set form data available flag
   *
   * @param flag
   */
  setDataIsAvailableFlag(flag: boolean) {
    this.dataIsAvailableFlag = flag;
  }

  /**
   * init p-table
   *
   * @param tableValues
   */
  async initTable(tableValues: OrderPositionItem[]|DeliveryNotePositionItem[]|InvoicePositionItem[]|PricelistSales[]): Promise<void> {
    this.positionsWithId = tableValues;
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
      return (this.positionsWithId[rowIndex] && // @ts-ignore
        this.positionsWithId[rowIndex].CATEGORY_SOAS !== this.CONSTANTS.CATEGORY_SOAS_KOMP) ? 'lightgrey' : '';
    }
  }

  /**
   * on table form allocate
   */
  onTableFormAllocate() {
    // call method in detail component...
  }

  /**
   * on table form cancel
   */
  onTableFormCancel() {
    // call method in detail component...
  }

  /**
   * is create position button visible
   */
  isCreatePositionButtonVisible() {
    // overwrite method in detail component...
  }

  /**
   * reset positions
   */
  resetPositions() {
    // this.positionsWithIndex = [];
    // this.positionsWithId = [];
  }

  /**
   * add item
   *
   * @param item
   */
  addItem(item: OrderPositionItem|DeliveryNotePositionItem|InvoicePositionItem|PricelistSales) {
    // @ts-ignore
    this.positionsWithId.push(item);
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
   * Positions - Set field focused
   *
   * @param tdId td id
   * @param errorMessage error message
   */
  private setFieldFocused(tdId: string, errorMessage: string) {
    this.errorTdId = tdId;
    this.errorMessage = errorMessage;
    // need to send service message, that save button should be disabled etc.
    this.sendServiceResult({
      refTableName: this.refTable, fieldName: tdId, disableSaveButton: true, positions: [],
      refreshDetailView: false
    });
    // this.disableSaveButton(true);

    if (document.getElementById(tdId)) {
      document.getElementById(tdId).click();
      document.getElementById(tdId).focus(); //select the input textfield and set the focus on it
      // this.pTable._selection.nativeElement.focus();
      // document.getElementById(tdId).applyFocus();
      // document.getElementById(tdId).inputfieldViewChild.nativeElement.focus();
    }
    this.messagesService.showErrorMessage(errorMessage);
    return false;
  }

  /**
   * condition if position should be shown as input
   *
   * @param refTable
   * @param rowIndex
   * @param colField
   */
  public showPositionAsInput(refTable: string, rowIndex: number, colField?: string): boolean {
    if (refTable === this.CONSTANTS.REFTABLE_ORDERS_POSITIONS) {
      if (this.ordPosStates && this.ordPosStates.length) {
        return this.positionsWithId[rowIndex] ?
          (!this.releaseFlag &&
            (this.fullEditMode &&
              ((this.positionsWithId[rowIndex] as OrderPositionItem).CATEGORY_SOAS !== this.CONSTANTS.CATEGORY_SOAS_KOMP &&
                ((this.positionsWithId[rowIndex] as OrderPositionItem).POSITION_STATUS === this.ordPosStates[1].value) &&
                !this.getColsItemProperties(colField).readonly)
              && colField !== 'ITMDES')) : false;
      } else {
        return false;
      }
    } else if (refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS) {
      return false;
    } else if (refTable === this.CONSTANTS.REFTABLE_PRILISTS_DETAILS) {
      return false;
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
      return this.positionsWithId[rowIndex] ?
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
   * show position table item as input number
   *
   * @param refTable
   * @param rowIndex
   * @param field
   */
  showPositionAsInputNumber(refTable: string, rowIndex: number, field: string): boolean {
    if (refTable === this.CONSTANTS.REFTABLE_ORDERS_POSITIONS) {
      return false;
    } else if (refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS) {
      return false;
    } else if (refTable === this.CONSTANTS.REFTABLE_PRILISTS_DETAILS) {
      return !this.getColsItemProperties(field).readonly;
    } else {
      return false;
    }
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
      return this.positionsWithId[rowIndex] ? (this.releaseFlag || !this.fullEditMode ||
        ((this.positionsWithId[rowIndex] as OrderPositionItem).CATEGORY_SOAS === this.CONSTANTS.CATEGORY_SOAS_KOMP ||
          ((this.positionsWithId[rowIndex] as OrderPositionItem).POSITION_STATUS === this.ordPosStates[2].value  ||
            (this.positionsWithId[rowIndex] as OrderPositionItem).POSITION_STATUS === this.ordPosStates[3].value ) ||
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
            return this.ordPosStates[opsItem].name;
          }
        }
      } else if ('dlv' === tableType) {
        for (let dpsItem in this.dlvPosStates) {
          if (this.dlvPosStates.hasOwnProperty(dpsItem) && this.dlvPosStates[dpsItem].value === posState) {
            return this.dlvPosStates[dpsItem].name;
          }
        }
      } else if ('inv' === tableType) {
        for (let ipsItem in this.invPosStates) {
          if (this.invPosStates.hasOwnProperty(ipsItem) && this.invPosStates[ipsItem].value === posState) {
            return this.invPosStates[ipsItem].name;
          }
        }
      }
    }
    return posState?.toString();
  }

  /**
   * set order position states
   *
   * @param st
   */
  public setOrderPositionStates(st: FormOptionsNVS[]) {
    this.ordPosStates = st;
  }

  /**
   * set delivery notes position states
   *
   * @param st
   */
  public setDlvPositionStates(st: FormOptionsNVS[]) {
    this.dlvPosStates = st;
  }

  /**
   * set invoice position states
   * @param st
   */
  public setInvPositionStates(st: FormOptionsNVS[]) {
    this.invPosStates = st;
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
      if (this.positionsWithId[rowIndex] && (this.ordPosStates !== undefined)) {
        const ordPosWithId: OrderPositionItem = this.positionsWithId[rowIndex];
        return this.dataIsAvailableFlag && !this.releaseFlag && this.fullEditMode && !this.formDisabledFlag &&
          ordPosWithId.PARENT_LINE_ID === null && ordPosWithId.POSITION_STATUS !== this.ordPosStates[0].value;
      } else {
        return false;
      }
    } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE_POSITIONS) {
      if (this.positionsWithId[rowIndex] && (this.invPosStates !== undefined)) {
        const invPosWithId: InvoicePositionItem = this.positionsWithId[rowIndex];
        return this.dataIsAvailableFlag && !this.releaseFlag && this.fullEditMode && !this.formDisabledFlag &&
          invPosWithId.ORDERS_NUMBER === "" && invPosWithId.DELIVERY_NOTES_NUMBER === "" &&
          invPosWithId.PARENT_LINE_ID === null && invPosWithId.POSITION_STATUS !== this.invPosStates[1].value;
      } else {
        return false;
      }
    } else if (this.refTable === this.CONSTANTS.REFTABLE_PRILISTS_DETAILS) {
      return this.dataIsAvailableFlag && this.fullEditMode;
        // && this.positionsWithId[rowIndex] && !this.releaseFlag && !this.formDisabledFlag && // @ts-ignore
        // this.positionsWithId[rowIndex].PARENT_LINE_ID === null && this.ordPosStates && // @ts-ignore
        // this.positionsWithId[rowIndex].POSITION_STATUS !== this.ordPosStates[0].value;
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
   * delete position item
   *
   * @param position
   * @param index
   * @private
   */
  private async deleteItem(position: OrderPositionItem | InvoicePositionItem | PricelistSales, index: number) {
    let userRole: string = localStorage.getItem(this.CONSTANTS.LS_ROLE);
    if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS_POSITIONS) {
      await this.deleteOrderPosition(position, userRole, index);
    } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE_POSITIONS) {
      const invoicePosition: InvoicePositionItem = position;
      if (!invoicePosition.ORDERS_NUMBER && !invoicePosition.DELIVERY_NOTES_NUMBER) {
        console.log('DELETE INVOICE POSITION...');
        await this.deleteInvoicePosition(position, userRole, index);
      } else {
        this.messagesService.showErrorMessage('This position has order and/or delivery note number set!');
      }
    } else if (this.refTable === this.CONSTANTS.REFTABLE_PRILISTS_DETAILS) {
      // ToDo: Manage to receive result, to check if item was deleted
      if ("PRILIST" in position) {
        await this.tableDataService.deleteTableData(this.CONSTANTS.REFTABLE_PRILISTS_TITLE,
          this.CONSTANTS.REFTABLE_PRILISTS_COLUMN_ID, position.ID.toString(),
          this.CONSTANTS.REFTABLE_PRILISTS_COLUMN_PRILIST,
          position.PRILIST, this.CONSTANTS.REFTABLE_PRILISTS_COLUMN_CUSGRP, position.CUSGRP, userRole);
        // @ts-ignore
        this.positionsWithId = this.positionsWithId.filter((val, i) => i != index);
        // send service message via subscription, to notify detail view to refresh
        this.fetchTableService.setDataObs(this.refTable, position.PRILIST, true,
          [], true);
        // this.formService.showErrorMessage('deletePosition: Error occurred. Item was not deleted!');
      }
    }
  }

  /**
   * delete order position
   *
   * @param position
   * @param userRole
   * @param index
   * @private
   */
  private async deleteOrderPosition(position: OrderPositionItem, userRole: string, index: number) {
    // check if a delivery note is existing for position
    let deliveryNotePositions = await this.getPositionItem(this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS, position,
      'ORDERS_POSITIONS_ID', 'ORDERS_NUMBER');
    if (deliveryNotePositions && deliveryNotePositions.length === 0) {
      if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS_POSITIONS) {
        // load full selected order positions data
        let orderPositionsDbData = await this.tableDataService.getTableDataById(
          this.CONSTANTS.REFTABLE_ORDERS_POSITIONS, ViewQueryTypes.MAIN_TABLE,
          this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_ROW_ID, position.ID.toString());
        if (!orderPositionsDbData) {
          this.messagesService.showErrorMessage('deletePosition: ' +
            this.errorMessage.replace('%s', this.translatePipe.transform('ORDERS_NUMBER')));
          return;
        }
        let orderPositions = orderPositionsDbData['table'][1];
        if (orderPositions) {
          await this.deleteItemLogic(this.CONSTANTS.REFTABLE_ORDERS_POSITIONS, orderPositions, position,
            this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_ROW_ID, this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_COLUMN,
            this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_ID, userRole, index);
        } else {
          this.messagesService.showErrorMessage('deletePosition: orderPositionsDbData is empty.');
        }
      }
    } else {
      this.messagesService.showErrorMessage(this.translatePipe.transform('OP_ERROR_DELIVERY_NOTE_AVAILABLE'));
    }
  }

  /**
   * logic to delete positions item
   *
   * @param refTable
   * @param positions
   * @param position
   * @param primaryColumn
   * @param secondaryColumn
   * @param positionsIdColumn
   * @param userRole
   * @param index
   * @private
   */
  private async deleteItemLogic(refTable: string, positions: any[], position: OrderPositionItem|InvoicePositionItem,
                                primaryColumn: string, secondaryColumn: string, positionsIdColumn: string,
                                userRole: string, index: number) {
    // get real ID of the row for orders and update positions
    let counter = 0;
    let foundElm: boolean = false;
    for (let pItem in positions) {
      if ((parseInt(positions[pItem][primaryColumn]) === (position[primaryColumn])) &&
        (positions[pItem][positionsIdColumn] === position[positionsIdColumn])) {
        foundElm = true;
        await this.tableDataService.deleteTableData(refTable, primaryColumn, positions[pItem][primaryColumn].toString(),
          secondaryColumn, position[secondaryColumn], positionsIdColumn, position[positionsIdColumn], userRole);
        // @ts-ignore
        this.positionsWithId = this.positionsWithId.filter((val, i) => i != index);
        // send service message via subscription, to notify detail view to refresh
        this.fetchTableService.setDataObs(this.refTable, positions[pItem][positionsIdColumn], true,
          [], true);
        break;
      }
      counter++
    }
    if (!foundElm) {
      console.log('Position ID not found for: ', position[positionsIdColumn]);
    }
  }

  /**
   * delete delivery note position
   *
   * @param position
   * @param userRole
   * @param index
   * @private
   */
  private async deleteInvoicePosition(position: InvoicePositionItem, userRole: string, index: number) {
    // check if a invoice position is existing for position
    let invoicePositions = await this.getPositionItem(this.CONSTANTS.REFTABLE_INVOICE_POSITIONS, position,
      this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_ROW_ID, 'INVOICES_NUMBER');
    if (invoicePositions && invoicePositions.length > 0) {
      await this.deleteItemLogic(this.CONSTANTS.REFTABLE_INVOICE_POSITIONS, invoicePositions, position,
        this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_ROW_ID, this.CONSTANTS.REFTABLE_INVOICE_COLUMN,
        this.CONSTANTS.REFTABLE_INVOICE_POSITIONS_ID, userRole, index);
    } else {
      this.messagesService.showErrorMessage('deletePosition: invoicePositionsDbData is empty.');
    }
  }

  /**
   * get item if exists
   *
   * @param refTable
   * @param position
   * @param searchColumn
   * @param checkColumn
   * @private
   */
  private async getPositionItem(refTable: string, position: OrderPositionItem | InvoicePositionItem | PricelistSales,
                                  searchColumn: string, checkColumn: string): Promise<any[]|undefined> {
    // check if delivery note is available for this order
    let deliveryNotePositionsDbData: { table: [any[string], any[]], maxRows: number, page: number } =
      await this.tableDataService.getTableDataById(refTable, ViewQueryTypes.MAIN_TABLE,
      searchColumn, position.ID.toString());
    if (!deliveryNotePositionsDbData) {
      if (checkColumn in position) {
        this.messagesService.showErrorMessage('check delivery note: Get delivery note positions - ' +
          checkColumn + ': ' + position[checkColumn]);
      }
      return undefined;
    }
    return deliveryNotePositionsDbData['table'][1];
  }

  /**
   * set referral table name
   * @param name
   */
  setRefTable(name: string) {
    this.refTable = name;
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
   * Positions - Validate user inputs
   *
   * @param event
   * @param fieldName
   * @param tdId
   * @param row
   */
  inputChangeValidation(event: number|Event, fieldName: string, tdId: string, row?: any) {
    let fieldValue: string | number = (typeof event === 'number' || typeof event === 'string') ?  event :
      (event.target as HTMLInputElement)?.value.trim();
    this.resetState = false;
    if (!fieldValue || ((typeof fieldValue === 'string') ? fieldValue.trim().length === 0 : fieldValue === 0)) {
      const errorMessage: string =
        this.messagesService.getErrorMessage('FIELD_SHOULD_NOT_BE_EMPTY', fieldValue?.toString(), fieldName);
      return this.setFieldFocused(tdId, errorMessage);
    }
    // reset error is, if field is filled
    if (tdId === this.errorTdId) {
      this.errorTdId = '';
      this.errorMessage = '';
    }
    // add currently edited row, to save updates later at save button click
    this.updatedPositionsRows.push(tdId);
    switch (fieldName) {
      case('ITMDES') :
        // this.pTable.first.disableSaveButton(false);
        this.disableSaveButton(false);
        this.sendServiceResult({
          refTableName: this.refTable, fieldName: fieldName, disableSaveButton: false, positions: [],
          refreshDetailView: false
        });
        return true;
      case('PRICE_BRU') :
        // ToDo: User should not be able to enter price brutto. This price should update by default if price net change.
        // if (isNaN(<number>fieldValue)) {
        //   const errorMessage: string = this.getErrorMessage('MUST_BE_A_PRICE', fieldValue.toString(), fieldName);
        //   return this.setFieldFocused(tdId, errorMessage);
        // } else {
        //   if (this.refTable === this.CONSTANTS.REFTABLE_PRILISTS_DETAILS) {
        //     return this.sendResult(fieldValue, fieldName);
        //   } else {
        //     return this.inputValidationPriceCalculation(row, fieldValue);
        //   }
        // }
        return true;
      case('PRICE_NET') :
        let checkPrice: number = (typeof fieldValue !== 'number') ?
          parseFloat(fieldValue.replace(',', '')) : fieldValue;
        if (isNaN(checkPrice)) {
          const errorMessage: string =
            this.messagesService.getErrorMessage('MUST_BE_A_PRICE', fieldValue.toString(), fieldName);
          return this.setFieldFocused(tdId, errorMessage);
        } else {
          // if (fieldValue > 0) {
          if (this.refTable === this.CONSTANTS.REFTABLE_PRILISTS_DETAILS) {
            return this.sendResult(fieldValue, fieldName);
          } else {
            return this.inputValidationPriceCalculation(row, fieldValue);
          }
          // } else {
          //   const errorMessage: string =
          //     this.getErrorMessage('MUST_BE_MINIMUM_1', fieldValue.toString(), fieldName);
          //   return this.setFieldFocused(tdId, errorMessage);
          // }
        }
      default:
        return this.sendResult(fieldValue, fieldName);
    }
  }

  /**
   * send service result to all subscribed components
   *
   * @param validateFieldValue
   * @param validateFieldName
   * @private
   */
  private sendResult(validateFieldValue: string|number, validateFieldName: string) {
    if ((typeof validateFieldValue === 'string') ? validateFieldValue.trim().length > 0 : validateFieldValue > 0) {
      if (this.errorTdId && this.errorTdId.length && this.errorMessage && this.errorMessage.length) {
        this.checkForErrors(this.errorTdId);
      } else {
        this.sendServiceResult({
          refTableName: this.refTable, fieldName: validateFieldName, disableSaveButton: false,
          positions: this.updatedPositionsRows, refreshDetailView: false
        });
      }
    }
    return true;
  }

  checkForErrors(id: string) {
    if (this.errorTdId && this.errorTdId.length && this.errorMessage && this.errorMessage.length && id === this.errorTdId) {
      this.setFieldFocused(this.errorTdId, this.errorMessage);
      //   if (document.getElementById(tdId)) {
      //     document.getElementById(tdId).click();
      //     document.getElementById(tdId).focus(); //select the input textfield and set the focus on it
      //   }
    }
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
   * get min fraction digits (after comma)
   *
   * @param field
   */
  getMinFractionDigits(field: string): number {
    return (field === 'PRIORITY') ? 0 : this.CONSTANTS.FRACTION_DIGITS_MIN;
  }

  /**
   * get max fraction digits (after comma)
   *
   * @param field
   */
  getMaxFractionDigits(field: string): number {
    return (field === 'PRIORITY') ? 0 : this.CONSTANTS.FRACTION_DIGITS_MAX;
  }

  /**
   * if input number field should show buttons to provide numerical input
   *
   * @param field
   */
  getInputNumberShowButtons(field: string): boolean {
    return (field === 'PRIORITY');
  }

  /**
   * set input number styles
   *
   * @param field
   */
  getInputNumberStyles(field: string): {'width': string} {
    return (field === 'PRIORITY') ? {'width':'100%'} : {'width':'100%'}; // width: 47px; width: 110px;
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
}
