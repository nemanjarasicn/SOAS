import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {OrderPositionItem} from '../../../interfaces/order-position-item';
import {TableDataService} from '../../../_services/table-data.service';
import {ConstantsService, CustomersTypes, ViewQueryTypes} from '../../../_services/constants.service';
import {TranslateItPipe} from '../../../shared/pipes/translate-it.pipe';
import {AutoComplete} from 'primeng/autocomplete';
import {DeliveryNotePositionItem} from '../../../interfaces/delivery-note-position-item';
import {InvoicePositionItem} from '../../../interfaces/invoice-position-item';
import {HelperService} from '../../../_services/helper.service';
import {InputNumber} from 'primeng/inputnumber';
import {Dialog} from 'primeng/dialog';
import {MessageService} from "primeng/api";
import {MessagesService} from "../../../_services/messages.service";
import {Orders} from "../../../models/orders";
import {FormOptionsLVs, FormOptionsNVs} from "../../../interfaces/form-options";
import {OrdersPositions} from "../../../models/orders-positions";
import {InvoicesPositions} from "../../../models/invoices-positions";
import {Invoices} from "../../../models/invoices";

export class PrimeOrderPosition implements OrderPositionItem {}
export class PrimeDeliveryNotePositionPosition implements DeliveryNotePositionItem {}
export class PrimeInvoicePosition implements InvoicePositionItem {}

@Component({
  selector: 'custom-p-dialog',
  templateUrl: './custom-p-dialog.component.html',
  styleUrls: ['./custom-p-dialog.component.css'],
  providers: [TranslateItPipe]
})

/**
 * CustomPDialogComponent - custom primeng dialog view for adding a new orders position.
 *
 * Used by: DetailViewTabGroupComponent
 */
export class CustomPDialogComponent implements OnInit {

  dialogWidth: string = '720px';
  dialogMargin: string = '0px'; //'0 0 0 40px';

  isLoadingResults: boolean = false;
  isRateLimitReached: boolean = false;

  @Input() updateView: Function;

  refTable: string;
  selTableRow: Orders|Invoices;
  displayDialog: boolean = false;

  // positionItem: OrderPositionItem|InvoicePositionItem;
  orderPosition: OrderPositionItem = new PrimeOrderPosition();
  invoicePosition: InvoicePositionItem = new PrimeInvoicePosition();
  // order positions items for viewing in table: id is replaced with running index (1,2,3...)
  orderPositions: OrderPositionItem[] = [];
  selectedOrderPosition: OrderPositionItem;

  // new position dialog form columns
  dialogCols: any[];
  // itmnum from filter/search function
  filterItmnums: any[];
  updatedOrderPositionsRows: string[] = [];
  currencies: FormOptionsNVs[] = [{name: 'PLEASE_SELECT', value: undefined}];
  pCurrencies: FormOptionsLVs[] = [{label: 'PLEASE_SELECT', value: undefined}];
  selTableRowTaxation: number;
  newOrderPosition: boolean;

  // if false - positions table will be reset, if true - close positions view
  resetState: boolean = false;
  // if true - position successfully saved
  savedState: boolean = false;

  // functions, that will be set at detail-view-tab-group.component=>initPDialog()
  resetAutocomplete: Function;
  setOPCategoryAndDesc: Function;
  setPriceByItmnum: Function;
  setPriceLogic: Function;
  inputValidationPriceCalculation: Function;

  /**
   * check warehouse allocation of given order positions
   *
   * @param positionsForDeliveryNoteCreation
   * @param isPartlyDelivery
   * @param cacheCheck
   * @param orderWarehouse
   */
  checkWHAllocation: Function;

  title: string;
  fieldNames: any[];
  fieldsNumber: number;
  itmnumActiveOnlyText: string;

  @ViewChild('pDialog', {static: false}) pDialog: Dialog;
  @ViewChild('dlgAutocomplete', {static: false}) dlgAutocomplete: AutoComplete;
  @ViewChild('dlgItemDes', {static: false}) dlgItmDes: ElementRef;
  @ViewChild('dlgOrderQty', {static: false}) dlgOrderQty: InputNumber;
  @ViewChild('dlgPriceBru', {static: false}) dlgPriceBru: InputNumber;
  @ViewChild('dlgPriceNet', {static: false}) dlgPriceNet: InputNumber;
  @ViewChild('dlgSaveButton', {static: false}) dlgSaveButton: ElementRef;
  @ViewChild('dlgCancelButton', {static: false}) dlgCancelButton: ElementRef;
  @ViewChild('dialogForm', {static: false}) dialogForm: ElementRef;
  @ViewChild('errorsText', {static: false}) errorsText: ElementRef;
  @ViewChild('errorInputId', {static: false}) errorInputId: ElementRef;

  constructor(private tableDataService: TableDataService,
              private CONSTANTS: ConstantsService,
              public translatePipe: TranslateItPipe,
              public helperService: HelperService,
              private messageService: MessageService,
              private messagesService: MessagesService) {
    this.messagesService.setTranslatePipe(translatePipe);
  }

  ngOnInit() {
    this.fieldsNumber = 10;
    this.title = 'NEW_POSITION';
    if (this.translatePipe) {
      this.itmnumActiveOnlyText = this.translatePipe.transform('ACTIVE_ONLY');
      this.itmnumActiveOnlyText = this.itmnumActiveOnlyText.replace('%s', this.translatePipe.transform('ITMNUM'));
    }
  }

  setRefTable(refTable) {
    this.refTable = refTable;
  }

  setSelTableRow(selRow: Orders | Invoices) {
    this.selTableRow = selRow;
  }

  /**
   * set order position with available default values (ORDERS_NUMBER, CURRENCY, WAREHOUSE)
   *
   * @param orderPosition
   */
  setOrderPosition(orderPosition: OrderPositionItem) {
    this.orderPosition = orderPosition;
  }

  setOrderPositions(orderPositions: OrderPositionItem[]) {
    this.orderPositions = orderPositions;
  }

  setInvoicePosition(position: InvoicePositionItem) {
    this.invoicePosition = position;
    // this.positionItem = position;
  }

  setDialogCols(dialogCols: any[]) {
    this.dialogCols = dialogCols;
  }

  setSelTableRowTaxation(selTaxation: number) {
    this.selTableRowTaxation = selTaxation;
  }

  setNewOrderPosition(newOrderPosition: boolean) {
    this.newOrderPosition = newOrderPosition;
  }

  setPCurrencies(pCurrencies: FormOptionsLVs[]) {
    this.pCurrencies = pCurrencies;
  }

  setCurrencies(currencies: FormOptionsNVs[]) {
    this.currencies = currencies;
  }

  setSelectedOrderPosition(selectedOrderPosition: OrderPositionItem) {
    this.selectedOrderPosition = selectedOrderPosition;
  }

  /**
   * get new position dialog form columns
   *
   * @param itemName
   */
  getDialogColsItemProperties(itemName): undefined|any[] {
    for (let cItem in this.dialogCols) {
      if (this.dialogCols[cItem].field === itemName) {
        return this.dialogCols[cItem];
      }
    }
    return undefined;
  }

  /**
   * get form item disabled property
   *
   * @param itemName
   */
  getDialogColsItemDisabled(itemName): boolean {
    // { field: string; size: number; header: string; disabled: boolean }
    let property: any = this.getDialogColsItemProperties(itemName);
    return property ? property.disabled : true;
  }

  async filterItmnum($event: any, fieldName?: string, tdId?: string, autocompleteField?: any): Promise<boolean> {
    let query = $event.query;
    this.emptyOrderPosition();
    return await this.filterItmnumLogic(query, $event, tdId, fieldName, autocompleteField, false, true);
  }

  private async filterItmnumLogic(query, $event: any, tdId: string, fieldName: string, autocompleteField: any,
                                  blurMode: boolean, pDialogMode: boolean): Promise<boolean> {
    this.setIsLoadingResults(true);
    if (query) {
      let validateFieldValue = query.trim();
      let refTableName: string = 'articlesForNewPosition';
      let validateRefTable: string = undefined;
      let validateFieldName: string = this.CONSTANTS.REFTABLE_ARTICLES_COLUMN;
      let errorMessage = this.translatePipe.transform('FIELD_SHOULD_NOT_BE_EMPTY');
      if (validateFieldValue.length === 0) {
        return this.setFieldFocused(tdId, errorMessage.replace('%s',
          this.translatePipe.transform(validateFieldName) + ' "' + validateFieldValue));
      }
      // add currently edited row, to save updates later at save button click
      this.updatedOrderPositionsRows.push(tdId);
      if (!fieldName) {
        if (pDialogMode) {
          await this.getItmnumSuggestions($event, validateRefTable, refTableName, validateFieldName, validateFieldValue,
            autocompleteField, tdId, blurMode);
        }
      } else {
        switch (fieldName) {
          case(this.CONSTANTS.REFTABLE_ARTICLES_COLUMN) :
            await this.getItmnumSuggestions($event, validateRefTable, refTableName, validateFieldName, validateFieldValue,
              autocompleteField, tdId, blurMode);
            break;
          default:
            break;
        }
      }
    } else {
      console.log('query is empty...');
    }
    return false;
  }

  private async getItmnumSuggestions($event: any, validateRefTable: string, refTableName: string,
                                     validateFieldName: string, validateFieldValue: string, autocompleteField: any,
                                     tdId: string, blurMode: boolean): Promise<void> {
    let location: string;
    if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) {
      validateRefTable = this.CONSTANTS.REFTABLE_ARTICLES;
      location = this.orderPosition.WAREHOUSE;
    } else if (this.refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES) {
      validateRefTable = this.CONSTANTS.REFTABLE_ARTICLES;
    } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      validateRefTable = this.CONSTANTS.REFTABLE_ARTICLES;
      location = this.selTableRow['SALES_LOCATION']; // this.invoicePosition.SALES_LOCATION;
    }

    // console.log('this.orderPosition', this.orderPosition);
    // console.log('this.invoicePosition', this.invoicePosition);
    // console.log('dialogCols: ', this.dialogCols);

    if (validateRefTable) {
      let searchWithLike: boolean = true;
      let resultAsArray: boolean = false;
      // allow to search only for active articles
      // let activeFlag: string = '1';
      let dbData = await this.tableDataService.searchTableColumnData(refTableName, validateFieldName, validateFieldValue,
        'WHLOC', location, searchWithLike, resultAsArray, '');
      this.filterItmnums = [];
      if (!dbData || Object.keys(dbData).length === 0) {
        this.autocompleteError(autocompleteField, validateFieldName, validateFieldValue, tdId);
      } else {
        if (!blurMode) {
          // show received ITMNUM at autocomplete field
          for (let dbItm in dbData) {
            if (dbData.hasOwnProperty(dbItm)) {
              this.filterItmnums.push(dbData[dbItm].ITMNUM);
            }
          }
          this.setIsLoadingResults(false);
        } else {
          if (Object.keys(dbData).length > 1) {
            this.autocompleteError(autocompleteField, validateFieldName, validateFieldValue, tdId);
          }
        }
      }
    }
  }

  private autocompleteError(autocompleteField: any, validateFieldName: string, validateFieldValue: string, tdId: string) {
    this.emptyOrderPosition();
    if (autocompleteField) {
      autocompleteField.handleDropdownClick();
    }
    let errorMessage = this.translatePipe.transform('NOT_FOUND_ERROR');
    errorMessage = errorMessage.replace('%s', this.translatePipe.transform(validateFieldName) + ' "' +
      validateFieldValue + '" ');
    this.setFieldFocused(tdId, errorMessage);
  }

  private setFieldFocused(tdId: string, errorMessage: string): boolean {
    // this.errorsText.nativeElement.innerHTML = "<br />" + errorMessage;
    this.disableSaveButton(true);
    if (document.getElementById(tdId)) {
      document.getElementById(tdId).click();
    }
    // this.errorInputId.nativeElement.textContent = tdId;
    this.messagesService.showErrorMessage(errorMessage, true);
    this.setIsLoadingResults(false);
    return false;
  }

  /**
   * Disable or enable save button(s)
   *
   * @param disable: boolean - if true - disable save button
   */
  disableSaveButton(disable: boolean) {
    // if (this.saveButton) {
    //   this.saveButton.nativeElement.disabled = disable;
    // }
    if (this.dlgSaveButton) {
      this.dlgSaveButton.nativeElement.disabled = disable;
    }
  }

  disableCancelButton(disable: boolean) {
    if (this.dlgCancelButton) {
      this.dlgCancelButton.nativeElement.disabled = disable;
    }
  }

  disableFields(disable: boolean) {
    this.disableSaveButton(disable);
    this.disableCancelButton(disable);
    if (this.dlgAutocomplete) {
      this.dlgAutocomplete.disabled = disable;
    }
    if (this.dlgItmDes) {
      this.dlgItmDes.nativeElement.disabled = disable;
    }
    if (this.dlgOrderQty) {
      this.dlgOrderQty.disabled = disable;
    }
    if (this.dlgPriceBru) {
      this.dlgPriceBru.disabled = disable;
    }
    if (this.dlgPriceNet) {
      this.dlgPriceNet.disabled = disable;
    }
  }

  manageKeyUp($event: any) {
    $event.target.value = $event.target.value.toUpperCase();
  }

  /**
   * input change validation (only number values)
   *
   * @param event
   * @param fieldName - input field name
   * @param tdId - input field id
   * @param row - optional
   */
  inputChangeValidation(event: Event, fieldName: string, tdId: string, row?: any): boolean {
    this.resetState = false;
    let fieldValue: string | number = (event.target as HTMLInputElement).value.trim();
    if (fieldValue.length === 0) {
      const errorMessage: string =
        this.messagesService.getErrorMessage('FIELD_SHOULD_NOT_BE_EMPTY', fieldValue, fieldName);
      return this.setFieldFocused(tdId, errorMessage);
    }
    // convert to number
    fieldValue = (typeof fieldValue !== 'number') ?
      parseFloat(fieldValue.replace(',', '')) : fieldValue;
    // add currently edited row, to save updates later at save button click
    this.updatedOrderPositionsRows.push(tdId);
    switch (fieldName) {
      case('ORDER_QTY') :
        return this.validateQty(fieldValue, fieldName, tdId);
      case('ASSIGNED_QTY') :
        return this.validateNumber(fieldValue, fieldName, tdId);
      case('PRICE_BRU') :
        return this.validatePrice(fieldValue, fieldName, tdId, row);
      case('PRICE_NET') :
        return this.validatePrice(fieldValue, fieldName, tdId, row);
      case('POSITION_STATUS') :
        return this.validateNumber(fieldValue, fieldName, tdId);
      case('DELIVERY_QTY') : // For delivery note form
        return this.validateNumber(fieldValue, fieldName, tdId);
      default:
        console.log('No validation for ', fieldName);
        return true;
    }
  }

  /**
   * validate qty
   *
   * @param fieldValue
   * @param fieldName
   * @param tdId
   * @private
   */
  private validateQty(fieldValue: number, fieldName: string, tdId: string): boolean {
    // check if is a number
    if (isNaN(fieldValue)) {
      const errorMessage: string =
        this.messagesService.getErrorMessage('MUST_BE_A_NUMBER', fieldValue.toString(), fieldName);
      return this.setFieldFocused(tdId, errorMessage);
    } else {
      if (fieldValue > 0) {
        this.disableSaveButton(false);
        return true;
      } else {
        const errorMessage: string =
          this.messagesService.getErrorMessage('MUST_BE_MINIMUM_1', fieldValue.toString(), fieldName);
        return this.setFieldFocused(tdId, errorMessage);
      }
    }
  }

  /**
   * validate price
   *
   * @param fieldValue
   * @param fieldName
   * @param tdId
   * @param row
   * @private
   */
  private validatePrice(fieldValue: number, fieldName: string, tdId: string, row: any): boolean {
    if (isNaN(fieldValue)) {
      const errorMessage: string =
        this.messagesService.getErrorMessage('MUST_BE_A_PRICE', fieldValue.toString(), fieldName);
      return this.setFieldFocused(tdId, errorMessage);
    } else {
      if (fieldValue > 0) {
        return this.inputValidationPriceCalculation(row, fieldValue, this.selTableRowTaxation);
      } else {
        const errorMessage: string =
          this.messagesService.getErrorMessage('MUST_BE_MINIMUM_1', fieldValue.toString(), fieldName);
        return this.setFieldFocused(tdId, errorMessage);
      }
    }
  }

  /**
   * validate number
   *
   * @param fieldValue
   * @param fieldName
   * @param tdId
   * @private
   */
  private validateNumber(fieldValue: number, fieldName: string, tdId: string): boolean {
    if (isNaN(fieldValue)) {
      const errorMessage: string =
        this.messagesService.getErrorMessage('MUST_BE_A_NUMBER', fieldValue.toString(), fieldName);
      return this.setFieldFocused(tdId, errorMessage);
    } else {
      this.disableSaveButton(false);
      return true;
    }
  }

  private replaceAutocompleteElementClass(element: any, classNamesToReplace: string[], classNamesReplaceWith: string[]) {
    let classValue = element.getAttributeNode('class').value;
    for (let itm in classNamesToReplace) {
      classValue = classValue.replace(classNamesToReplace[itm], '');
      classValue += ' ' + classNamesReplaceWith[itm];
      // Workaround for removing editing class from edited autocomplete element
      // element.attributes.removeNamedItem('class');
      element.setAttribute('class', classValue);
    }
  }

  async createNewPositionFunc() {
    let itemNumber: string;
    let position: OrderPositionItem; // |InvoicePositionItem
    if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) {
      itemNumber = this.orderPosition.ORDERS_NUMBER;
      position = this.orderPosition;
    } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      itemNumber = this.invoicePosition.INVOICES_NUMBER;
      // position = this.invoicePosition;
      position = this.orderPosition;
    }
    await this.createNewPosition(itemNumber, position, true, true);
  }

  /**
   * create new position
   *
   * @param itemNumber ORDERS_NUMBER or INVOICES_NUMBER
   * @param orderPosition
   * @param overwriteCurrent
   * @param insertFlag
   */
  async createNewPosition(itemNumber: string, orderPosition: OrderPositionItem, overwriteCurrent: boolean,
                          insertFlag: boolean) {
    this.disableSaveButton(true);
    this.disableFields(true);
    this.setIsLoadingResults(true);
    let saveResult: { success: boolean, itmnum: {}, message: string };
    if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) {
      saveResult = await this.saveOrderPosition(itemNumber, orderPosition, overwriteCurrent, insertFlag);
    } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      saveResult = await this.saveInvoicePosition(itemNumber, orderPosition, this.invoicePosition, overwriteCurrent,
        insertFlag);
    }
    if (saveResult.success) {
      await this.updateView();
    } else {
      console.log('ERROR occurred at saveOrderPosition!');
      this.messagesService.showErrorMessage('ERROR_DURING_SAVING', true);
      this.messagesService.showErrorMessage(saveResult.message, true);
    }
  }

  /**
   * save order position - ! important is to make sure that the order of field is the same like in TableTemplates !
   *
   * @param itemNumber ORDERS_NUMBER or INVOICES_NUMBER
   * @param currentPosition
   * @param overwriteCurrent
   * @param insertFlag
   */
  async saveOrderPosition(itemNumber: string, currentPosition: any | OrderPositionItem | InvoicePositionItem,
                          overwriteCurrent: boolean, insertFlag: boolean):
    Promise<{ success: boolean, itmnum: {}, message: string }> {
    let error: { success: boolean, itmnum: {}, message: string } = {success: false, itmnum: {}, message: ''};
    let client: CustomersTypes;
    if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) {
      client = this.selTableRow['CLIENT'];
    } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      client = await this.getCustomersType(this.selTableRow['INVOICES_CUSTOMER']);
    }
    // console.log('currentPosition: ', currentPosition);
    // Part 2
    if ((!overwriteCurrent || (overwriteCurrent && currentPosition.ORDERS_NUMBER)) &&
      currentPosition.ITMNUM && currentPosition.ORDER_QTY &&
      (((client === this.CONSTANTS.CLIENT_B2C) && currentPosition.PRICE_BRU) ||
        ((client === this.CONSTANTS.CLIENT_B2B) && currentPosition.PRICE_NET))) {
      let errorMessage = this.translatePipe.transform('NOT_FOUND_ERROR');
      // first check itmnum by loading category
      let categorySoas: string | undefined = await this.getCategorySoas(currentPosition.ITMNUM, errorMessage);
      if (!categorySoas) {
        return error;
      }
      // load dist_components data
      let distCompDbData = await this.getDistComponentsData(currentPosition.ITMNUM, errorMessage);
      if (!distCompDbData) {
        return error;
      }
      // load full selected order data
      let orderData: Orders | undefined = await this.getOrdersData(this.selTableRow['ORDERS_NUMBER']);
      if (!orderData) {
        return error;
      }
      // load full selected order positions data
      let orderPositionsData: OrdersPositions[] | undefined = await this.getOrdersPositionsData(this.selTableRow['ORDERS_NUMBER']);
      if (!orderPositionsData) {
        return error;
      }
      // calculate new POSITION_ID number
      let opPositionId: number = this.getOrdersPositionId(orderPositionsData);

      // console.log('opPositionId: ', opPositionId);
      // console.log('this.selTableRowTaxation: ', this.selTableRowTaxation);

      if (this.selTableRowTaxation) {
        let priceNetError: boolean = false;
        let priceBruError: boolean = false;
        const __ret: {
          orderData: Orders, priceNetError: boolean, priceBruError: boolean, priceBru: number,
          priceNet: number, taxAmount: number
        }
          = this.calculateOrderPositionPrices(currentPosition.PRICE_BRU, currentPosition.PRICE_NET,
          currentPosition.ORDER_QTY, orderData, this.selTableRowTaxation, priceNetError, priceBruError, client);
        currentPosition.PRICE_BRU = __ret.priceBru;
        currentPosition.PRICE_NET = __ret.priceNet;
        currentPosition.TAX_AMOUNT = __ret.taxAmount;
        orderData = __ret.orderData;
        priceNetError = __ret.priceNetError;
        priceBruError = __ret.priceBruError;
        if (!priceBruError && !priceNetError) {
          // add order positions elements for saving
          // SET item => 'ITM'
          let orderPositionsElements: {} = {};
          let orderPositionsElement: OrderPositionItem = new PrimeOrderPosition();
          let orderPositions: [] = [];
          let initSetResult: { success: boolean, data: any } =
            this.initOrderPositionSet(currentPosition, categorySoas, opPositionId,
              overwriteCurrent, insertFlag);
          if (initSetResult.success) {
            orderPositionsElements = initSetResult.data.orderPositionsElements;
            orderPositionsElement = initSetResult.data.orderPositionsElement;
            orderPositions = initSetResult.data.orderPositions;
            // replace currency id with name
            currentPosition['CURRENCY'] = this.getCurrencyName(currentPosition['CURRENCY']);
          } else {
            return error;
          }
          // add dist_components items here
          // KOMP items => 'KMP'
          let distCompArr = distCompDbData['table'][1];
          orderPositions = this.initOrderPositionKmp(orderPositions, orderPositionsElements, distCompArr,
            currentPosition, opPositionId, orderPositionsElement['CURRENCY'], insertFlag);

          // console.log("orderPositions: ", orderPositions);
          // throw new Error("stopp");

          // check the allocation is possible for new order position
          // check if for found order positions warehousing quantity can be allocated: SOAS-17
          let whAllocationData: {} =
            await this.checkWHAllocation(orderPositions, false, true, orderData['WAREHOUSE']);
          if (whAllocationData['resultAllocation'] && whAllocationData['resultData']) {
            if (!whAllocationData['resultData']['success'] &&
              whAllocationData['resultData']['message'] === 'WAREHOUSING_IS_INCONSISTENT') {
              this.messagesService.showErrorMessage(this.translatePipe.transform(whAllocationData['resultData']['message']));
              this.cancelSavePositionDialog();
              await this.updateView();
              return error;
            }
            let self = this;
            let allocObsResult: { success: boolean, message: any, data: any } =
              await this.tableDataService.tryAllocate('SET',
                {
                  whAllocationData: whAllocationData['resultData']['data'],
                  orderPositionsElements: orderPositionsElements,
                  insertFlag: insertFlag
                });
            if (allocObsResult && allocObsResult.success) {
              orderPositionsElements = allocObsResult.data;
              let saveResult: { success: boolean, itmnum: {}, message: string } =
                await self.execSavePositions(self.CONSTANTS.REFTABLE_ORDERS, self.CONSTANTS.REFTABLE_ORDERS_POSITIONS,
                  itemNumber,
                  {
                    opElm: orderPositionsElements,
                    whElm: whAllocationData['resultData']['data']
                  }, orderData, currentPosition, insertFlag, overwriteCurrent);
              self.setIsLoadingResults(false);
              if (saveResult.success && allocObsResult.message && allocObsResult.message.param1 &&
                allocObsResult.message.param2 && allocObsResult.message.param3) {
                this.messagesService.showInfoMessage(this.translatePipe.transform(
                    allocObsResult.message.param1).replace('%s', allocObsResult.message.param2) +
                  ' ' + this.translatePipe.transform(allocObsResult.message.param3), false);
              }
              return saveResult;
              // ToDo: if error at save position, rollback cache
            }
          }
        } else {
          // this.formService.showErrorMessage('saveOrderPosition: ' +
          // this.errorMessage.replace('%s', priceNetError ?
          // this.translatePipe.transform('PRICE_NET') : this.translatePipe.transform('PRICE_BRU')));
        }
      } else {
        // this.formService.showErrorMessage('saveOrderPosition: ' + this.errorMessage.replace('%s',
        // this.translatePipe.transform('TAXATION')));
      }

    } else {
      // this.formService.showErrorMessage('saveOrderPosition: ' + this.translatePipe.transform('REQUIRED_FIELDS_MESSAGE'));
    }
    return error;
  }

  /**
   * save order position - ! important is to make sure that the order of field is the same like in TableTemplates !
   *
   * @param itemNumber ORDERS_NUMBER or INVOICES_NUMBER
   * @param orderPosition
   * @param invoicePosition
   * @param overwriteCurrent
   * @param insertFlag
   */
  async saveInvoicePosition(itemNumber: string, orderPosition: OrderPositionItem, invoicePosition: InvoicePositionItem,
                          overwriteCurrent: boolean, insertFlag: boolean):
    Promise<{ success: boolean, itmnum: {}, message: string }> {
    let error: { success: boolean, itmnum: {}, message: string } = {success: false, itmnum: {}, message: ''};
    let client: CustomersTypes = await this.getCustomersType(this.selTableRow['INVOICES_CUSTOMER']);
    if ((!overwriteCurrent || (overwriteCurrent && invoicePosition.INVOICES_NUMBER)) &&
      orderPosition.ITMNUM && orderPosition.ORDER_QTY &&
      (((client === this.CONSTANTS.CLIENT_B2C) && orderPosition.PRICE_BRU) ||
        ((client === this.CONSTANTS.CLIENT_B2B) && orderPosition.PRICE_NET))) {
      let errorMessage = this.translatePipe.transform('NOT_FOUND_ERROR');
      // first check itmnum by loading category
      let categorySoas: string|undefined = await this.getCategorySoas(orderPosition.ITMNUM, errorMessage);
      if (!categorySoas) {
        return error;
      }
      // console.log('categorySoas: ', categorySoas);
      // load dist_components data
      let distCompDbData = await this.getDistComponentsData(orderPosition.ITMNUM, errorMessage);
      if (!distCompDbData) {
        return error;
      }
      // console.log('distCompDbData: ', distCompDbData);
      // load full selected invoices data
      let invoicesData: Invoices | undefined = await this.getInvoiceData(this.selTableRow['INVOICES_NUMBER']);
      if (!invoicesData) {
        return error;
      }
      // console.log('invoicesData: ', invoicesData);
      // load full selected invoices positions data
      let invoicesPositionsData: InvoicesPositions[] | undefined =
        await this.getInvoicePositionsData(this.selTableRow['INVOICES_NUMBER']);
      if (!invoicesPositionsData) {
        return error;
      }
      // console.log('invoicesPositionsData: ', invoicesPositionsData);
      let ipPositionId: number = this.getInvoicesPositionId(invoicesPositionsData);
      if (this.selTableRowTaxation) {
        let priceNetError: boolean = false;
        let priceBruError: boolean = false;
        const __ret: { orderData: Orders, priceNetError: boolean, priceBruError: boolean, priceBru: number,
          priceNet: number, taxAmount: number }
          = this.calculateOrderPositionPrices(orderPosition.PRICE_BRU, orderPosition.PRICE_NET, orderPosition.ORDER_QTY,
          undefined, this.selTableRowTaxation, priceNetError, priceBruError, client);
        orderPosition.PRICE_BRU = __ret.priceBru;
        orderPosition.PRICE_NET = __ret.priceNet;
        orderPosition.TAX_AMOUNT = __ret.taxAmount;
        let orderData = __ret.orderData;
        priceNetError = __ret.priceNetError;
        priceBruError = __ret.priceBruError;
        if (!priceBruError && !priceNetError) {

          // add invoice positions elements for saving
          // SET item => 'ITM'
          let invoicePositionsElements: {} = {};
          let invoicePositionsElement: InvoicePositionItem = new PrimeOrderPosition();
          let invoicePositions: InvoicesPositions[] = [];
          let initSetResult: { success: boolean, data: any } =
            this.initInvoicePositionSet(invoicePosition, orderPosition, categorySoas, ipPositionId, overwriteCurrent,
              insertFlag);
          if (initSetResult.success) {
            invoicePositionsElements = initSetResult.data.orderPositionsElements;
            invoicePositionsElement = initSetResult.data.orderPositionsElement;
            invoicePositions = initSetResult.data.orderPositions;
            // replace currency id with name
            invoicePosition.CURRENCY = this.getCurrencyName(invoicePosition.CURRENCY);
          } else {
            return error;
          }
          // add dist_components items here
          // KOMP items => 'KMP'
          let distCompArr = distCompDbData['table'][1];
          let invoicePositionKmpData = this.initInvoicePositionKmp(invoicePositions, invoicePositionsElements, distCompArr,
            invoicePosition, orderPosition, ipPositionId, invoicePositionsElement['CURRENCY'], insertFlag);
          invoicePositions = invoicePositionKmpData.invoicePositions;
          invoicePositionsElements = invoicePositionKmpData.positionsElements;

          // const sortedInvoicePositions: { 'ITM': any[], 'KMP': any[] } = {'ITM': [], 'KMP': []};
          // for(let item in invoicePositions) {
          //   if (invoicePositions.hasOwnProperty(item)) {
          //     if (invoicePositions[item].CATEGORY_SOAS !== this.CONSTANTS.CATEGORY_SOAS_KOMP) {
          //       // let invoicePositionItem: any | InvoicesPositions = {};
          //       // invoicePositionItem[secondaryKey] = invoicePositions[item];
          //       sortedInvoicePositions['ITM'].push(invoicePositions[item]);
          //     } else {
          //       sortedInvoicePositions['KMP'].push(invoicePositions[item]);
          //     }
          //   }
          // }

          // console.log('orderPosition: ', orderPosition);
          // console.log('invoicePositionsElement: ', invoicePositionsElement);
          // console.log('invoicePositionsElements', invoicePositionsElements);

          // console.log('');
          // console.log('invoicePositions: ', invoicePositions);
          // console.log('sortedInvoicePositions: ', sortedInvoicePositions);

          // throw new Error('stopp');

          let saveResult = await this.execSavePositions(this.CONSTANTS.REFTABLE_INVOICE,
            this.CONSTANTS.REFTABLE_INVOICE_POSITIONS, itemNumber, invoicePositionsElements, orderData,
            orderPosition, insertFlag, overwriteCurrent);
          this.setIsLoadingResults(false);
          return saveResult;
        }
        // console.log('priceBruError: ', priceBruError);
        // console.log('priceNetError: ', priceNetError);
      }
      // console.log('ipPositionId: ', ipPositionId);
      // console.log('this.selTableRowTaxation: ', this.selTableRowTaxation);
    } else {
      console.log('ERROR at orderPosition: ', orderPosition);
      console.log('Or at invoicePosition: ', invoicePosition);
    }
    return error;
  }


  /**
   * init new order postion SET item
   *
   * @param currentOrderPosition
   * @param categorySoas
   * @param opPositionId
   * @param overwriteCurrent
   * @param insertFlag
   * @private
   */
  private initOrderPositionSet(currentOrderPosition: any | OrderPositionItem, categorySoas: string, opPositionId: number,
                               overwriteCurrent: boolean, insertFlag: boolean) {
    // SET item => 'ITM'
    let orderPositionsElements: {} = {};
    let orderPositionsElement: OrderPositionItem = new PrimeOrderPosition();
    let orderPositions = []; //[...this.orderPositions];
    if (currentOrderPosition.ORDERS_NUMBER) {
      orderPositionsElement['ORDERS_NUMBER'] = currentOrderPosition.ORDERS_NUMBER;
    }
    if (currentOrderPosition.ITMNUM) {
      orderPositionsElement['ITMNUM'] = currentOrderPosition.ITMNUM;
    }
    if (currentOrderPosition.ITMDES) {
      orderPositionsElement['ITMDES'] = currentOrderPosition.ITMDES;
    }
    if (categorySoas) {
      orderPositionsElement['CATEGORY_SOAS'] = categorySoas;
    }
    if (currentOrderPosition.ORDER_QTY) {
      orderPositionsElement['ORDER_QTY'] = currentOrderPosition.ORDER_QTY;
    }
    if (currentOrderPosition.ASSIGNED_QTY !== undefined) {
      orderPositionsElement['ASSIGNED_QTY'] = currentOrderPosition.ASSIGNED_QTY;
    }
    if (orderPositionsElement['ASSIGNED_QTY'] <= orderPositionsElement['ORDER_QTY']) {
      orderPositionsElement['DELIVERED_QTY'] = 0;
      if (currentOrderPosition.PRICE_NET) {
        orderPositionsElement['PRICE_NET'] = currentOrderPosition.PRICE_NET;
      }
      if (currentOrderPosition.PRICE_BRU) {
        orderPositionsElement['PRICE_BRU'] = currentOrderPosition.PRICE_BRU;
      }
      if (currentOrderPosition.TAX_AMOUNT) {
        orderPositionsElement['TAX_AMOUNT'] = currentOrderPosition.TAX_AMOUNT;
      }
      if (currentOrderPosition.CURRENCY) {
        orderPositionsElement['CURRENCY'] = currentOrderPosition.CURRENCY;
        // // replace currency id with name
        // currentOrderPosition['CURRENCY'] = this.getCurrencyName(currentOrderPosition['CURRENCY']);
      }
      if (currentOrderPosition.POSITION_STATUS !== undefined) {
        orderPositionsElement['POSITION_STATUS'] = currentOrderPosition.POSITION_STATUS;
      }
      orderPositionsElement['POSITION_ID'] = opPositionId;
      // if (categorySoas && categorySoas !== 'KOMP') {
      // parent line id will be set at server save function
      orderPositionsElement['PARENT_LINE_ID'] = null;
      // }
      if (currentOrderPosition.WAREHOUSE) {
        orderPositionsElement['WAREHOUSE'] = currentOrderPosition.WAREHOUSE;
      }
      // if (currentOrderPosition.DIST_COMPONENTS_ID) {
      // for SET DIST_COMPONENTS_ID is null
      orderPositionsElement['DIST_COMPONENTS_ID'] = null;
      // }
      // orderPositionsElements = [orderPositionsElement];
      orderPositionsElements['ITM'] = [orderPositionsElement];
      if (insertFlag) {
        orderPositions.push(currentOrderPosition);
      } else {
        orderPositions[this.orderPositions.indexOf(this.selectedOrderPosition)] = currentOrderPosition;
      }
      this.orderPositions = orderPositions;
      if (overwriteCurrent) {
        this.orderPosition = currentOrderPosition;
      }
      return {success: true, data : {orderPositionsElements, orderPositionsElement, orderPositions}};
    } else {
      this.messagesService.showInfoDialog(this.messagesService,
        this.translatePipe.transform('INFO'),
        this.translatePipe.transform('ASSIGNED_QTY_IS_GREATER_THEN_ORDER_QTY'));
      return {success: false, data : undefined};
    }
  }

  /**
   * init new invoice postion SET item
   *
   * @param invoicePosition
   * @param orderPosition
   * @param categorySoas
   * @param ipPositionId
   * @param overwriteCurrent
   * @param insertFlag
   * @private
   */
  private initInvoicePositionSet(invoicePosition: InvoicePositionItem, orderPosition: OrderPositionItem,
                                 categorySoas: string, ipPositionId: number, overwriteCurrent: boolean, insertFlag: boolean) {
    // SET item => 'ITM'
    let invoicePositionsElements: {} = {};
    let positionsElement: InvoicePositionItem = new PrimeInvoicePosition();
    let invoicePositions = []; //[...this.orderPositions];
    positionsElement.INVOICES_NUMBER = (invoicePosition.INVOICES_NUMBER) ? invoicePosition.INVOICES_NUMBER : positionsElement.INVOICES_NUMBER;
    positionsElement.ORDERS_NUMBER = ''; // (position.ORDERS_NUMBER) ? position.ORDERS_NUMBER : positionsElement.ORDERS_NUMBER;
    positionsElement.DELIVERY_NOTES_NUMBER = '';
    positionsElement.ITMNUM = (orderPosition.ITMNUM) ? orderPosition.ITMNUM : positionsElement.ITMNUM;
    // positionsElement.ITMDES = (position.ITMDES) ? position.ITMDES : positionsElement.ITMDES;
    positionsElement.CATEGORY_SOAS = (categorySoas) ? categorySoas : positionsElement.CATEGORY_SOAS;
    positionsElement.ORDER_QTY = (orderPosition.ORDER_QTY) ? orderPosition.ORDER_QTY : positionsElement.ORDER_QTY;
    // positionsElement['ASSIGNED_QTY'] = (position.ASSIGNED_QTY !== undefined) ? position.ASSIGNED_QTY : positionsElement['ASSIGNED_QTY'];
    // if (positionsElement.ASSIGNED_QTY <= positionsElement.ORDER_QTY) {
      positionsElement.DELIVERY_QTY = 0; // 0;
      positionsElement.PRICE_NET = (orderPosition.PRICE_NET) ? orderPosition.PRICE_NET : positionsElement.PRICE_NET;
      positionsElement.PRICE_BRU = (orderPosition.PRICE_BRU) ? orderPosition.PRICE_BRU : positionsElement.PRICE_BRU;
      positionsElement.TAX_AMOUNT = (orderPosition.TAX_AMOUNT) ? orderPosition.TAX_AMOUNT : positionsElement.TAX_AMOUNT;
      positionsElement.CURRENCY = (orderPosition.CURRENCY) ? orderPosition.CURRENCY : positionsElement.CURRENCY;
    positionsElement.DELIVERY_NOTES_POSITIONS_ID = 0; // ipPositionId;
      positionsElement.POSITION_ID = ipPositionId;
    // parent line id will be set at server save function
    positionsElement.PARENT_LINE_ID = 0;
    positionsElement.POSITION_STATUS = (orderPosition.POSITION_STATUS !== undefined) ? orderPosition.POSITION_STATUS : 1;
      // if (categorySoas && categorySoas !== 'KOMP') {

    positionsElement.ITMDES = orderPosition.ITMDES;
    positionsElement.SALES_LOCATION = invoicePosition.SALES_LOCATION;
      // }
      // positionsElement.WAREHOUSE = (position.WAREHOUSE) ? position.WAREHOUSE : positionsElement.WAREHOUSE;
      // positionsElement.SALES_LOCATION = (position.SALES_LOCATION) ? position.SALES_LOCATION : positionsElement.SALES_LOCATION;
      // if (currentOrderPosition.DIST_COMPONENTS_ID) {
      // for SET DIST_COMPONENTS_ID is null
      // positionsElement.DIST_COMPONENTS_ID = null;
      // }
      // orderPositionsElements = [orderPositionsElement];
      invoicePositionsElements['ITM'] = [positionsElement];
      if (insertFlag) {
        invoicePositions.push(invoicePosition);
      } else {
        invoicePositions[this.orderPositions.indexOf(this.selectedOrderPosition)] = invoicePosition;
      }
      this.orderPositions = invoicePositions;
      if (overwriteCurrent) {
        this.orderPosition = invoicePosition;
      }
      return {
        success: true, data: {
          orderPositionsElements: invoicePositionsElements,
          orderPositionsElement: positionsElement,
          orderPositions: invoicePositions
        }
      };
    // } else {
    //   this.messagesService.showInfoDialog(this.messagesService,
    //     this.translatePipe.transform('INFO'),
    //     this.translatePipe.transform('ASSIGNED_QTY_IS_GREATER_THEN_ORDER_QTY'));
    //   return {success: false, data : undefined};
    // }
  }

  /**
   * init new order postion components KMP items
   *
   * @param orderPositions
   * @param orderPositionsElements
   * @param distCompArr
   * @param currentOrderPosition
   * @param opPositionId
   * @param currency
   * @param insertFlag
   * @private
   */
  private initOrderPositionKmp(orderPositions: any|[], orderPositionsElements: {}, distCompArr: {},
                               currentOrderPosition: any | OrderPositionItem, opPositionId: number,
                               currency: string, insertFlag: boolean) {
    orderPositionsElements['KMP'] = [];
    for (let distItem in distCompArr) {
      let newOrderPosition: OrderPositionItem = new PrimeOrderPosition();
      newOrderPosition.ORDERS_NUMBER = currentOrderPosition.ORDERS_NUMBER;
      newOrderPosition.ITMNUM = distCompArr[distItem].COMPNUM;
      newOrderPosition.ITMDES = currentOrderPosition.ITMDES;
      newOrderPosition.CATEGORY_SOAS = this.CONSTANTS.CATEGORY_SOAS_KOMP;
      newOrderPosition.ORDER_QTY = distCompArr[distItem].DIST_QTY * currentOrderPosition.ORDER_QTY;
      newOrderPosition.ASSIGNED_QTY = 0;
      newOrderPosition.DELIVERED_QTY = 0;
      newOrderPosition.PRICE_NET = 0;
      newOrderPosition.PRICE_BRU = 0;
      newOrderPosition.TAX_AMOUNT = 0;
      newOrderPosition.CURRENCY = currency;
      newOrderPosition.POSITION_STATUS = currentOrderPosition.POSITION_STATUS;
      opPositionId = opPositionId + this.CONSTANTS.ORDERS_POSITIONS_POSITION_ID_NUMBER;
      newOrderPosition.POSITION_ID = opPositionId;
      newOrderPosition.PARENT_LINE_ID = null;
      newOrderPosition.WAREHOUSE = currentOrderPosition.WAREHOUSE;
      newOrderPosition.DIST_COMPONENTS_ID = distCompArr[distItem].ID;
      // orderPositionsElements.push(newOrderPosition);
      orderPositionsElements['KMP'].push(newOrderPosition);
      if (insertFlag) {
        orderPositions.push(newOrderPosition);
      }
    }
    return orderPositions;
  }

  /**
   * init new invoice postion components KMP items
   *
   * @param invoicePositions
   * @param positionsElements
   * @param distCompArr
   * @param invoicePosition
   * @param orderPosition
   * @param ipPositionId
   * @param currency
   * @param insertFlag
   * @private
   */
  private initInvoicePositionKmp(invoicePositions: any|InvoicePositionItem[], positionsElements: {}, distCompArr: {},
                               invoicePosition: InvoicePositionItem, orderPosition: OrderPositionItem, ipPositionId: number,
                               currency: string, insertFlag: boolean) {
    positionsElements['KMP'] = [];
    for (let distItem in distCompArr) {
      let newPosition: InvoicePositionItem = new PrimeInvoicePosition();
      newPosition.INVOICES_NUMBER = invoicePosition.INVOICES_NUMBER;
      newPosition.ORDERS_NUMBER = ''; // invoicePosition.ORDERS_NUMBER;
      newPosition.DELIVERY_NOTES_NUMBER = '';
      newPosition.ITMNUM = distCompArr[distItem].COMPNUM;
      // newOrderPosition.ITMDES = currentOrderPosition.ITMDES;
      newPosition.CATEGORY_SOAS = this.CONSTANTS.CATEGORY_SOAS_KOMP;
      newPosition.ORDER_QTY = distCompArr[distItem].DIST_QTY * orderPosition.ORDER_QTY;
      // newOrderPosition.ASSIGNED_QTY = 0;
      // newOrderPosition.DELIVERED_QTY = 0;
      newPosition.DELIVERY_QTY = 0;
      newPosition.PRICE_NET = 0;
      newPosition.PRICE_BRU = 0;
      newPosition.TAX_AMOUNT = 0;
      newPosition.CURRENCY = currency;
      newPosition.DELIVERY_NOTES_POSITIONS_ID = 0;
      ipPositionId = ipPositionId + this.CONSTANTS.ORDERS_POSITIONS_POSITION_ID_NUMBER;
      newPosition.POSITION_ID = ipPositionId;
      newPosition.PARENT_LINE_ID = 0;
      newPosition.POSITION_STATUS = (orderPosition.POSITION_STATUS !== undefined) ? orderPosition.POSITION_STATUS : 1;
      newPosition.ITMDES = orderPosition.ITMDES;
      newPosition.SALES_LOCATION = invoicePosition.SALES_LOCATION;
      // newOrderPosition.WAREHOUSE = currentOrderPosition.WAREHOUSE;
      // newOrderPosition.DIST_COMPONENTS_ID = distCompArr[distItem].ID;
      // orderPositionsElements.push(newOrderPosition);
      positionsElements['KMP'].push(newPosition);
      if (insertFlag) {
        invoicePositions.push(newPosition);
      }
    }
    return {invoicePositions, positionsElements};
  }

  /**
   * execute save position
   *
   * @param currentTableToSave
   * @param saveToTableName
   * @param ordersNumber
   * @param orderPositionsElements
   * @param orderData
   * @param currentPosition
   * @param insertFlag
   * @param overwriteCurrent
   */
  private async execSavePositions(currentTableToSave: string, saveToTableName: string, ordersNumber: string,
                                  orderPositionsElements: {}, orderData: any,
                                  currentPosition: OrderPositionItem | DeliveryNotePositionItem | InvoicePositionItem,
                                  insertFlag: boolean, overwriteCurrent: boolean):
    Promise<{ success: boolean, itmnum: {}, message: string }> {
    let primaryKey: string = this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_ROW_ID;
    let primaryValue: string = currentPosition.ID ? currentPosition.ID.toString() : undefined;
    let secondaryKey: string = this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_COLUMN; // ORDERS_NUMBER
    let secondaryValue: string = ordersNumber;
    let thirdKey: string = this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_ID; // ITMNUM
    let thirdValue: string = currentPosition.ITMNUM;
    // let saveToTableName = this.CONSTANTS.REFTABLE_ORDERS_POSITIONS;
    if (currentTableToSave === this.CONSTANTS.REFTABLE_ORDERS) {
    } else if (currentTableToSave === this.CONSTANTS.REFTABLE_DELIVERY_NOTES) {
      secondaryKey = this.CONSTANTS.REFTABLE_DELIVERY_NOTES_COLUMN;
      // saveToTableName = this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS;
    } else if (currentTableToSave === this.CONSTANTS.REFTABLE_INVOICE) {
      secondaryKey = this.CONSTANTS.REFTABLE_INVOICE_COLUMN;
      // saveToTableName = this.CONSTANTS.REFTABLE_INVOICE_POSITIONS;
    }
    // ToDo: Use promise to wait until item is saved, and just after then refresh the views

    const saveResult: { result: { success: boolean, message: string, data: [] } } = await this.tableDataService.setTableData({
      refTable: saveToTableName, tableName: saveToTableName, dataArray: orderPositionsElements, primaryKey: primaryKey,
      primaryValue: primaryValue, isIdentity: undefined, newItemMode: insertFlag,
      secondaryKey: secondaryKey, secondaryValue: secondaryValue, thirdKey: thirdKey, thirdValue: thirdValue
    });
    if (overwriteCurrent) {
      this.orderPosition = null;
      this.displayDialog = false;
      this.newOrderPosition = false;
      // this.emptyFormAndRedirect();
    }
    this.disableSaveButton(true);
    this.savedState = true;
    return {success: saveResult.result.success, itmnum: thirdValue, message: saveResult.result.message};
  }

  /**
   * calculate order position prices
   *
   * @param priceBru
   * @param priceNet
   * @param orderQty
   * @param orderData
   * @param taxation
   * @param priceNetError
   * @param priceBruError
   * @param client
   */
  public calculateOrderPositionPrices(priceBru: number,
                                      priceNet: number,
                                      orderQty: number,
                                      orderData: Orders | undefined,
                                      taxation: number,
                                      priceNetError: boolean,
                                      priceBruError: boolean,
                                      client: CustomersTypes):
    {
      orderData: Orders,
      priceNetError: boolean,
      priceBruError: boolean,
      priceBru: number,
      priceNet: number,
      taxAmount: number
    } {
    let taxAmount = 0;
    if (client === this.CONSTANTS.CLIENT_B2C && priceBru) {
      // For B2B customers: Calculate netto price, based on brutto and customer taxation
      priceBru = Number(priceBru);
      if (orderData) {
        orderData['ORDERAMOUNT_BRU'] += priceBru * orderQty;
      }
      let tmpPriceNet: number = this.helperService.calcB2CPriceNet(priceBru, taxation);
      if (tmpPriceNet > 0) {
        tmpPriceNet = Number(tmpPriceNet);
        if (orderData) {
          orderData['ORDERAMOUNT_NET'] += tmpPriceNet * orderQty;
        }
        priceNet = tmpPriceNet;
      } else {
        priceNetError = true;
      }
      orderData = this.calculateVoucher(orderData);
      orderData = this.calculateDiscount(orderData);
      orderData = this.calculateShippingCosts(orderData);
    } else if (client === this.CONSTANTS.CLIENT_B2B && priceNet) {
      // For B2C customers: Calculate brutto price, based on netto and customer taxation
      priceNet = Number(priceNet);
      if (orderData) {
        orderData['ORDERAMOUNT_NET'] += priceNet * orderQty;
      }
      let tmpPriceBru: number = this.helperService.calcB2BPriceBru(priceNet, taxation);
      if (tmpPriceBru > 0) {
        tmpPriceBru = Number(tmpPriceBru);
        if (orderData) {
          orderData['ORDERAMOUNT_BRU'] += tmpPriceBru * orderQty;
        }
        priceBru = tmpPriceBru;
      } else {
        priceBruError = true;
      }
      orderData = this.calculateDiscount(orderData);
      orderData = this.calculateShippingCosts(orderData);
    }
    taxAmount = this.helperService.calcTaxAmount(priceBru, priceNet);
    return {orderData, priceNetError, priceBruError, priceBru, priceNet, taxAmount};
  }

  /**
   * Calculate order amount prices (NET and BRU) with DISCOUNT
   * @param orderData
   */
  public calculateDiscount(orderData: Orders): Orders {
    if (orderData && orderData['DISCOUNT'] && Number(orderData['DISCOUNT']) > 0) {
      orderData['ORDERAMOUNT_NET'] -= Number(orderData['DISCOUNT']);
      orderData['ORDERAMOUNT_BRU'] -= Number(orderData['DISCOUNT']);
    }
    return orderData;
  }

  public calculateVoucher(orderData: Orders): Orders {
    if (orderData && orderData['VOUCHER'] && Number(orderData['VOUCHER']) > 0) {
      orderData['ORDERAMOUNT_NET'] = (Number(orderData['ORDERAMOUNT_NET']) -
        (Number(orderData['ORDERAMOUNT_NET']) / 100) * Number(orderData['VOUCHER']));
      orderData['ORDERAMOUNT_BRU'] = (Number(orderData['ORDERAMOUNT_BRU']) -
        (Number(orderData['ORDERAMOUNT_BRU']) / 100) * Number(orderData['VOUCHER']));
    }
    return orderData;
  }

  public calculateShippingCosts(orderData: Orders): Orders {
    if (orderData && orderData['SHIPPING_COSTS'] && Number(orderData['SHIPPING_COSTS']) > 0) {
      orderData['ORDERAMOUNT_NET'] += Number(orderData['SHIPPING_COSTS']);
      orderData['ORDERAMOUNT_BRU'] += Number(orderData['SHIPPING_COSTS']);
    }
    return orderData;
  }

  async cancelSavePositionDialog(): Promise<void> {
    this.displayDialog = false;
    this.filterItmnums = [];
    this.dlgAutocomplete.autocomplete = '';
    this.dlgAutocomplete.inputFieldValue = '';
    this.dlgAutocomplete.value = '';
    // reset new order position item
    await this.callResetAutocomplete();
    this.orderPosition = new PrimeOrderPosition();
    this.newOrderPosition = false;
    this.setIsLoadingResults(false);
  }

  /**
   * Get currency name
   *
   * @param currencyId
   */
  private getCurrencyName(currencyId: string): string {
    for (let cur in this.currencies) {
      if (parseInt(currencyId) === parseInt(this.currencies[cur].value)) {
        return this.currencies[cur].name;
      }
    }
    return currencyId;
  }

  // inputValidator($event: any): void {
  //   $event.target.valid = false;
  //   return false;
  //   const pattern = /^[A-Za-z]+$/;
  //   if (!pattern.test($event.target.value)) {
  //     $event.target.value = $event.target.value.replace(/[^a-zA-Z]/g, '');
  //   }
  // }

  /**
   * condition if 'save' button should be disabled
   */
  public isSaveButtonDisabled(): boolean {
    return !this.orderPosition || (this.orderPosition && (!this.orderPosition.ITMNUM || !this.orderPosition.ORDER_QTY ||
      (!this.orderPosition.PRICE_NET && !this.orderPosition.PRICE_BRU) ||
      (!this.orderPosition.CATEGORY_SOAS && this.orderPosition.CATEGORY_SOAS?.trim().length === 0) ||
      !this.orderPosition.ITMDES));
  }

  /**
   * empty some of order postion fields: ITMDES, CATEGORY_SOAS, ORDER_QTY, PRICE_NET and PRICE_BRU
   *
   * @private
   */
  private emptyOrderPosition(): void {
    this.orderPosition.ITMDES = '';
    this.orderPosition.CATEGORY_SOAS = '';
    this.orderPosition.ORDER_QTY = 0;
    this.orderPosition.PRICE_NET = 0;
    this.orderPosition.PRICE_BRU = 0;
    this.orderPosition.TAX_AMOUNT = 0;
  }

  public setIsLoadingResults(flag: boolean): void {
    this.isLoadingResults = flag;
  }

  /**
   * reset autocomplete and calculate prices
   */
  async callResetAutocomplete() {
    this.setIsLoadingResults(true);
    const client: string = (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) ?
      this.selTableRow['CLIENT'] : undefined; // this.selTableRow['CLIENT']
    const customerNumber: string = (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) ?
      this.selTableRow['CUSTOMER_ORDER'] : this.selTableRow['INVOICES_CUSTOMER'];
    await this.resetAutocomplete(this.dlgAutocomplete, '0', client, customerNumber, this.displayDialog,
      this.selTableRowTaxation);
    this.setIsLoadingResults(false);
  }

  /**
   * returns true if position (orderPosition or invoicePosition) is initialized
   */
  isPositionInitialized(): boolean {
    return !!(this.orderPosition || this.invoicePosition);
  }

  /**
   * returns current orders number of order or invoice position
   */
  // getOrdersNumber() {
  //   return (this.orderPosition?.ORDERS_NUMBER) ? this.orderPosition.ORDERS_NUMBER :
  //     (this.invoicePosition?.ORDERS_NUMBER) ? this.invoicePosition.ORDERS_NUMBER : undefined;
  // }

  /**
   * returns customer type for given customer number
   */
  async getCustomersType(customerNumber: string): Promise<CustomersTypes | undefined> {
    const dbData: any = await this.tableDataService.getTableDataByCustomersNumber('custbtwoc',
      ViewQueryTypes.DETAIL_TABLE,'CUSTOMERS_NUMBER', customerNumber);
    if (!dbData || !(dbData.table && dbData.table[1])) {
      return undefined;
    } else {
      return dbData.table[1][0].CUSTOMERS_TYPE === CustomersTypes.B2C ? CustomersTypes.B2C : CustomersTypes.B2B;
    }
  }

  /**
   * returns category soas from articles (ITEM_BASIS)
   *
   * @param itemNum
   * @param errorMessage
   */
  async getCategorySoas(itemNum: string, errorMessage): Promise<string | undefined>  {
    let artDbData = await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_ARTICLES,
      ViewQueryTypes.DETAIL_TABLE,'ITMNUM', itemNum);
    if (!artDbData || !artDbData['table'][1][0]['ITMNUM']) {
      this.messagesService.showErrorMessage(errorMessage.replace('%s',
        this.translatePipe.transform('ITMNUM') + ' "' + itemNum + '" '), true);
      return undefined;
    } else {
      return artDbData['table'][1][0]['CATEGORY_SOAS'];
    }
  }

  /**
   * load dist_components data
   *
   * @param itemNum
   * @param errorMessage
   */
  async getDistComponentsData(itemNum: string, errorMessage) {
    let distCompDbData = await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_COMPONENTS,
      ViewQueryTypes.DETAIL_TABLE, 'ITMNUM', itemNum);
    if (!distCompDbData || !distCompDbData['table'][1]) {
      this.messagesService.showErrorMessage(this.CONSTANTS.REFTABLE_COMPONENTS_TITLE + ' ' +
        errorMessage.replace('%s',
          this.translatePipe.transform('ITMNUM') + ' "' + itemNum + '" '), true);
      return undefined;
    } else {
      return distCompDbData;
    }
  }

  /**
   * returns orders data
   */
  async getOrdersData(ordersNumber: string): Promise<Orders | undefined> {
    // load full selected order data
    let orderDbData: { table: any[], maxRows: number, page: number } =
      await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_ORDERS,
        ViewQueryTypes.DETAIL_TABLE,'ORDERS_NUMBER', ordersNumber);
    if (orderDbData && orderDbData['table'] && orderDbData['table'][1] && orderDbData['table'][1][0]) {
      return orderDbData['table'][1][0] as Orders;
    } else {
      return undefined;
    }
  }

  /**
   * load full selected order positions data
   */
  async getOrdersPositionsData(ordersNumber: string):  Promise<OrdersPositions[] | undefined>{
    let orderPositionsDbData = await this.tableDataService.getTableDataById(
      this.CONSTANTS.REFTABLE_ORDERS_POSITIONS, ViewQueryTypes.DETAIL_TABLE, 'ORDERS_NUMBER', ordersNumber);
    if (orderPositionsDbData && orderPositionsDbData['table'] && orderPositionsDbData['table'][1]) {
      return orderPositionsDbData['table'][1] as OrdersPositions[];
    } else {
      return  undefined;
    }
  }

  /**
   * returns invoice data
   */
  async getInvoiceData(invoicesNumber: string): Promise<Invoices | undefined> {
    let invoicesDbData: { table: any[], maxRows: number, page: number } =
      await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_INVOICE, ViewQueryTypes.DETAIL_TABLE,
        'INVOICES_NUMBER', invoicesNumber);
    if (invoicesDbData && invoicesDbData['table'] && invoicesDbData['table'][1] && invoicesDbData['table'][1][0]) {
      return invoicesDbData['table'][1][0] as Invoices;
    } else {
      return undefined;
    }
  }

  /**
   * load full selected invoice positions data
   */
  async getInvoicePositionsData(invoicesNumber: string):  Promise<InvoicesPositions[] | undefined>{
    let positionsDbData = await this.tableDataService.getTableDataById(
      this.CONSTANTS.REFTABLE_INVOICE_POSITIONS, ViewQueryTypes.DETAIL_TABLE, 'INVOICES_NUMBER', invoicesNumber);
    if (positionsDbData && positionsDbData['table'] && positionsDbData['table'][1]) {
      return positionsDbData['table'][1] as InvoicesPositions[];
    } else {
      return  undefined;
    }
  }

  /**
   * calculate new POSITION_ID number
   *
   * @param orderPositionsData
   */
  getOrdersPositionId(orderPositionsData: OrdersPositions[]): number {
    // calculate new POSITION_ID number
    let opPositionId: number = this.CONSTANTS.ORDERS_POSITIONS_POSITION_ID_NUMBER;
    //orderPositionsData && orderPositionsData.length > 0 ?
    // (orderPositionsData.length + 1) * this.CONSTANTS.ORDERS_POSITIONS_POSITION_ID_NUMBER :
    // this.CONSTANTS.ORDERS_POSITIONS_POSITION_ID_NUMBER;
    for (let opItm = 0; opItm < orderPositionsData.length; opItm++) {
      if (opPositionId <= orderPositionsData[opItm].POSITION_ID) {
        opPositionId = orderPositionsData[opItm].POSITION_ID + this.CONSTANTS.ORDERS_POSITIONS_POSITION_ID_NUMBER;
      }
      // if (orderPositionsData[opitm].ITMNUM === currentOrderPosition.ITMNUM) {
      //   this.showInfoMessage("Artikel ist bereits in Bestellpositionen vorhanden!");
      //   return;
      // }
    }
    return opPositionId;
  }

  /**
   * calculate new POSITION_ID number
   *
   * @param positionsData
   */
  getInvoicesPositionId(positionsData: InvoicesPositions[]): number {
    let opPositionId: number = this.CONSTANTS.ORDERS_POSITIONS_POSITION_ID_NUMBER;
    for (let opItm = 0; opItm < positionsData.length; opItm++) {
        if (opPositionId <= positionsData[opItm].POSITION_ID) {
        opPositionId = positionsData[opItm].POSITION_ID + this.CONSTANTS.ORDERS_POSITIONS_POSITION_ID_NUMBER;
      }
    }
    return opPositionId;
  }
}
