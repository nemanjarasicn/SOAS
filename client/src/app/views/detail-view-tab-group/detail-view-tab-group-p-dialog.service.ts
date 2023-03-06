import {ElementRef, Injectable, ViewChild} from '@angular/core';
import {ConstantsService, SubTabGroupTabNames, TabGroupModel, ViewQueryTypes} from '../../_services/constants.service';
import {OrdersPositions} from '../../models/orders-positions';
import {Orders} from '../../models/orders';
import {
  CustomPDialogComponent,
  PrimeInvoicePosition,
  PrimeOrderPosition
} from '../custom/custom-p-dialog/custom-p-dialog.component';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {CustomPTableComponent} from '../custom/custom-p-table/custom-p-table.component';
import {DetailViewTabGroupPositionsService} from './detail-view-tab-group-positions.service';
import {TableDataService} from '../../_services/table-data.service';
import {HelperService} from '../../_services/helper.service';
import {OrderPositionItem} from '../../interfaces/order-position-item';
import {Table} from 'primeng/table';
import {AutoComplete} from 'primeng/autocomplete';
import {DetailViewTabGroupTabsService} from "./detail-view-tab-group-tabs.service";
import {MessagesService} from "../../_services/messages.service";
import {FormOptionsLVs, FormOptionsNVs} from "../../interfaces/form-options";
import {InvoicePositionItem} from "../../interfaces/invoice-position-item";
import {InvoicesPositions} from "../../models/invoices-positions";
import {Invoices} from "../../models/invoices";


@Injectable({
  providedIn: 'root'
})

/**
 * DetailViewTabGroupPDialogService - a service for detail view tab group component view to manage p-dialog
 *
 * Used by: DetailViewTabGroupComponent
 */
export class DetailViewTabGroupPDialogService {

  refTable: string;
  // selected table row item
  selTableRow: Orders|Invoices;
  // a p-dialog to add a new position at orders positions view
  @ViewChild(CustomPDialogComponent) pDialogComponent !: CustomPDialogComponent;
  // p-table view for positions (order-, delivery notes-, invoices-positions)
  @ViewChild(CustomPTableComponent) pTable !: CustomPTableComponent;
  @ViewChild('autocomplete', {static: false}) autocomplete: AutoComplete;
  errorMessage: string;
  orderPosition: OrderPositionItem = new PrimeOrderPosition();
  invoicePosition: InvoicePositionItem = new PrimeInvoicePosition();
  newOrderPosition: boolean;
  dialogCols: any[]; // new position dialog form columns

  tabsService: DetailViewTabGroupTabsService;

  currencies: FormOptionsNVs[] = [{ name: 'PLEASE_SELECT', value: undefined }];
  pCurrencies: FormOptionsLVs[] = [{ label: 'PLEASE_SELECT', value: undefined }];
  selTableRowTaxation: number;
  selectedOrderPosition: OrderPositionItem;
  displayDialog: boolean;

  // Empty orders or invoices positions model
  positionsModel: OrdersPositions | InvoicesPositions;

  @ViewChild('dlnDataTable', {static: false}) dlnDataTable: Table;
  @ViewChild('invDataTable', {static: false}) invDataTable: Table;

  @ViewChild('saveButton', {static: false}) saveButton: ElementRef;
  @ViewChild('dlgSaveButton', {static: false}) dlgSaveButton: ElementRef;

  translatePipe: TranslateItPipe;

  constructor(public CONSTANTS: ConstantsService,
              private messagesService: MessagesService,
              public positionsService: DetailViewTabGroupPositionsService,
              private tableDataService: TableDataService,
              private helperService: HelperService) {
  }

  /**
   * set translate pipe in tab-group component constructor
   *
   * @param pipe
   */
  setTranslatePipe(pipe) {
    this.translatePipe = pipe;
    this.messagesService.setTranslatePipe(pipe);
  }

  isMessageServiceSet(): boolean {
    return this.messagesService.isMessageServiceSet();
  }

  /**
   * set required parameters
   *
   * @param refTable
   * @param selTableRow
   * @param pDialogComponent
   * @param pTable
   * @param errorMessage
   * @param orderPosition
   * @param newOrderPosition
   * @param saveButton
   * @param dlgSaveButton
   * @param dialogCols
   * @param tabsService
   * @param currencies
   * @param pCurrencies
   * @param selTableRowTaxation
   * @param selectedOrderPosition
   * @param displayDialog
   * @param autocomplete
   */
  setRequiredParams(refTable: string, selTableRow: any, pDialogComponent: CustomPDialogComponent,
                    pTable: CustomPTableComponent, errorMessage: string, orderPosition: OrderPositionItem,
                    newOrderPosition: boolean, saveButton: ElementRef, dlgSaveButton: ElementRef,
                    dialogCols: any[], tabsService: DetailViewTabGroupTabsService,
                    currencies: FormOptionsNVs[], pCurrencies: FormOptionsLVs[], selTableRowTaxation: number,
                    selectedOrderPosition: OrderPositionItem, displayDialog: boolean, autocomplete: AutoComplete) {
    this.setRefTable(refTable);
    this.setSelTableRow(selTableRow);
    this.setPDialogComponent(pDialogComponent);
    this.setPTable(pTable);
    this.setErrorMessage(errorMessage);
    this.setOrderPosition(orderPosition);
    this.setNewOrderPosition(newOrderPosition);
    this.setSaveButton(saveButton);
    this.setDlgSaveButton(dlgSaveButton);
    this.setDialogCols(dialogCols);
    this.setTabsService(tabsService);
    this.setCurrencies(currencies);
    this.setPCurrencies(pCurrencies);
    this.setSelTableRowTaxation(selTableRowTaxation);
    this.setSelectedOrderPosition(selectedOrderPosition);
    this.setDisplayDialog(displayDialog);
    this.setAutocomplete(autocomplete);
    this.setEmptyModel();
  }

  setSelTableRow(selRow: any) {
    this.selTableRow = selRow;
  }

  setRefTable(refTable: string) {
    this.refTable = refTable;
  }

  setPDialogComponent(pDialog: CustomPDialogComponent) {
    this.pDialogComponent = pDialog;
  }

  setPTable(pTable: CustomPTableComponent) {
    this.pTable = pTable;
  }

  setErrorMessage(msg: string) {
    this.errorMessage = msg;
  }

  setOrderPosition(orderPosition: OrderPositionItem) {
    this.orderPosition = orderPosition;
  }

  setNewOrderPosition(newOrderPosition: boolean) {
    this.newOrderPosition = newOrderPosition;
  }

  setSaveButton(saveButton: ElementRef) {
    this.saveButton = saveButton;
  }

  setDlgSaveButton(dlgSaveButton: ElementRef) {
    this.dlgSaveButton = dlgSaveButton;
  }

  setDialogCols(cols: any[]) {
    this.dialogCols = cols;
  }

  setTabsService(service: DetailViewTabGroupTabsService) {
    this.tabsService = service;
  }

  setCurrencies(cr: FormOptionsNVs[]) {
    this.currencies = cr;
  }

  setPCurrencies(pcr: FormOptionsLVs[]) {
    this.pCurrencies = pcr;
  }

  setSelTableRowTaxation(taxation: number) {
    this.selTableRowTaxation = taxation;
  }

  setSelectedOrderPosition(position: OrderPositionItem) {
    this.selectedOrderPosition = position;
  }

  setDisplayDialog(flag: boolean) {
    this.displayDialog = flag;
  }

  setAutocomplete(autocomplete: AutoComplete) {
    this.autocomplete = autocomplete;
  }

  /**
   * set empty model
   * important is that currencies are set, before call this function
   */
  setEmptyModel() {
    if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) {
      // @ToDo: Should it be possible to add new positions at another views? If yes, currencies should be set here.
      this.positionsModel = new OrdersPositions(0, '', '', '',
        '', 0, 0, 0, 0, 0,
        this.currencies ? this.currencies[0]?.value : '',
        1, 1000, 0, '', 0, 0);
    } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      this.positionsModel = new InvoicesPositions(0, '', '', '',
        '', '', 0, 0, 0, 0,
        this.currencies ? this.currencies[0]?.value : '',
        0, 0, 1,1000,'','', 0);
    }
  }

  /**
   * init p-dialog. assign data and functions.
   *
   * @param currencies
   * @param pCurrencies
   * @param selTableRowTaxation
   * @param dialogCols
   * @param selectedOrderPosition
   * @param displayDialog
   * @param autocomplete
   * @private
   */
  public initPDialog(currencies: FormOptionsNVs[], pCurrencies: FormOptionsLVs[], selTableRowTaxation: number,
                     dialogCols: any[], selectedOrderPosition: OrderPositionItem, displayDialog: boolean,
                     autocomplete: AutoComplete): Promise<{ result: string }> {
    return new Promise((resolve, reject) => {
      // console.log('intiPDialog: ', this.selTableRow);
      this.pDialogComponent.setRefTable(this.refTable);
      this.pDialogComponent.setSelTableRow((this.refTable === this.CONSTANTS.REFTABLE_ORDERS) ?
        this.selTableRow as Orders : this.selTableRow as Invoices);
      this.pDialogComponent.setCurrencies(currencies);
      this.pDialogComponent.setPCurrencies(pCurrencies);
      this.pDialogComponent.setNewOrderPosition(this.newOrderPosition);
      this.pDialogComponent.setSelTableRowTaxation(selTableRowTaxation);
      this.pDialogComponent.setDialogCols(dialogCols);
      this.pDialogComponent.setOrderPosition(this.orderPosition);
      this.pDialogComponent.setOrderPositions(this.pTable?.positionsWithId);
      this.pDialogComponent.setInvoicePosition(this.invoicePosition);
      this.pDialogComponent.setSelectedOrderPosition(selectedOrderPosition);
      this.pDialogComponent.resetAutocomplete = this.resetAutocomplete;
      this.pDialogComponent.setPriceLogic = this.setPriceLogic;
      this.pDialogComponent.setOPCategoryAndDesc = this.setOPCategoryAndDesc;
      this.pDialogComponent.setPriceByItmnum = this.setPriceByItmnum;
      this.pDialogComponent.inputValidationPriceCalculation = this.inputValidationPriceCalculation;
      this.pDialogComponent.checkWHAllocation = this.checkWHAllocation;
      this.positionsService.addFocusToAutocomplete(autocomplete, displayDialog);
      this.pDialogComponent.disableCancelButton(false);
      resolve({result: 'OK'});
    });
  }

  /**
   * reset autocomplete field at CustomPDialogComponent (add new order position)
   *
   * @param autocomplete
   * @param rowId
   * @param client
   * @param customerOrder
   * @param displayDialog
   * @param selTableRowTaxation
   */
  async resetAutocomplete(autocomplete: AutoComplete, rowId: string, client: string, customerOrder: string,
                          displayDialog: boolean, selTableRowTaxation: number) {
    if (autocomplete && autocomplete.value) {
      let itmnum = autocomplete.value.trim();
      let classNamesToReplace = ['ng-untouched', 'ui-inputwrapper-focus', 'ng-dirty'];
      let classNamesReplaceWith = ['ng-touched', 'ui-inputwrapper-filled', 'ng-pristine'];
      if (this.pTable && this.pTable.pTable.editingCell && this.pTable.pTable.editingCell.children &&
        this.pTable.pTable.editingCell.children[0].children[0].attributes.getNamedItem('class')) {
        this.positionsService.replaceAutocompleteElementClass(this.pTable.pTable.editingCell.children[0].children[0],
          classNamesToReplace, classNamesReplaceWith);
      } else if (this.dlnDataTable && this.dlnDataTable.editingCell && this.dlnDataTable.editingCell.children &&
        this.dlnDataTable.editingCell.children[0].children[0].attributes.getNamedItem('class')) {
        this.positionsService.replaceAutocompleteElementClass(this.dlnDataTable.editingCell.children[0].children[0],
          classNamesToReplace, classNamesReplaceWith);
      } else if (this.invDataTable && this.invDataTable.editingCell && this.invDataTable.editingCell.children &&
        this.invDataTable.editingCell.children[0].children[0].attributes.getNamedItem('class')) {
        this.positionsService.replaceAutocompleteElementClass(this.invDataTable.editingCell.children[0].children[0],
          classNamesToReplace, classNamesReplaceWith);
      }
      // onDropdownClick = Callback to invoke when dropdown button is clicked.
      // close suggestions list
      autocomplete.handleDropdownClick(itmnum);
      await this.setOPCategoryAndDesc(itmnum);
      await this.setPriceByItmnum(itmnum, rowId, client, customerOrder, selTableRowTaxation);
      if (!displayDialog) {
        if (document.getElementById(rowId + '_2')) {        // 'td_' + rowId
          document.getElementById(rowId + '_2').click();    // 'td_' + rowId + '_2'
        } else if (document.getElementById(rowId + '_2')) { // 'dn_td_' + rowId + '_2'
          document.getElementById(rowId + '_2').click();    // 'dn_td_' + rowId + '_2'
        } else if (document.getElementById(rowId + '_3')) { // 'inv_td_' + rowId + '_3'
          document.getElementById(rowId + '_3').click();    // 'inv_td_' + rowId + '_3'
        }
      }
    } else {
      console.log("autocomplete is not defined...");
    }
  }

  /**
   * Set brutto price for B2C or netto price for B2B
   *
   * Runs inside of custom-p-dialog !!!
   *
   * @param prlData
   * @param clientType
   * @param itmnum
   * @param rowId
   * @param cusAddrISOCode
   * @param selTableRowTaxation
   */
  private async setPriceLogic(prlData: any, clientType: string, itmnum: string, rowId: string, cusAddrISOCode: string,
                              selTableRowTaxation: number) {
    // let prlData = prlDbData['table'][1][0];
    this.errorMessage = this.translatePipe.transform('FIELD_SHOULD_NOT_BE_EMPTY');
    if (prlData && (prlData.PRICE_NET || this.orderPosition.CATEGORY_SOAS === this.CONSTANTS.CATEGORY_SOAS_SERV)) {
      // check order only if it is set (at invoice without order/dlv it is not set!)
      if (this.selTableRow['ORDERS_NUMBER']) {
        // load full selected order data
        let orderDbData: { table: [any[string], any[]], maxRows: number, page: number } =
          await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_ORDERS,
            ViewQueryTypes.DETAIL_TABLE, 'ORDERS_NUMBER', this.selTableRow['ORDERS_NUMBER']);
        if (!orderDbData) {
          this.messagesService.showErrorMessage('saveOrderPosition: ' +
            this.errorMessage.replace('%s', this.translatePipe.transform('ORDERS_NUMBER')));
          return;
        }
        // let orderData = orderDbData['table'][1][0];
        // if (orderData) {
        // } else {
        //   console.log('No order data found...');
        //   return;
        // }
      }
      if (selTableRowTaxation) {
        let priceNetError: boolean = false;
        let priceBruError: boolean = false;
        // If new position dialog "custom-p-dialog" > "dialogForm" is opened, update the prices
        if (this.newOrderPosition) {
          if (clientType === this.CONSTANTS.CLIENT_B2C) {
            // pre calculation of price net
            this.orderPosition.PRICE_BRU = prlData.PRICE_BRU;
            this.orderPosition.PRICE_NET =
              this.helperService.calcB2CPriceNet(this.orderPosition.PRICE_BRU, selTableRowTaxation);
          } else if (clientType === this.CONSTANTS.CLIENT_B2B) {
            // pre calculation of price bru
            this.orderPosition.PRICE_NET = prlData.PRICE_NET;
            this.orderPosition.PRICE_BRU =
              this.helperService.calcB2BPriceBru(this.orderPosition.PRICE_NET, selTableRowTaxation);
          }
          this.orderPosition.TAX_AMOUNT =
            this.helperService.calcTaxAmount(this.orderPosition.PRICE_BRU, this.orderPosition.PRICE_NET);
        } else {
          let oneRow = rowId.split('_');
          if (Object.keys(oneRow).length > 0) {
            if (this.pTable && this.pTable.positionsWithId &&
              this.pTable.positionsWithId[oneRow[3]].ITMNUM === prlData.ITMNUM) {
              if (clientType === this.CONSTANTS.CLIENT_B2C) {
                // pre calculation of price net
                this.pTable.positionsWithId[oneRow[3]].PRICE_BRU = prlData.PRICE_BRU;
                this.pTable.positionsWithId[oneRow[3]].PRICE_NET =
                  this.helperService.calcB2CPriceNet(this.pTable.positionsWithId[oneRow[3]].PRICE_BRU,
                    selTableRowTaxation);
              } else if (clientType === this.CONSTANTS.CLIENT_B2B) {
                // pre calculation of price bru
                this.pTable.positionsWithId[oneRow[3]].PRICE_NET = prlData.PRICE_NET;
                this.pTable.positionsWithId[oneRow[3]].PRICE_BRU =
                  this.helperService.calcB2BPriceBru(this.pTable.positionsWithId[oneRow[3]].PRICE_NET,
                    selTableRowTaxation);
              }
              this.pTable.positionsWithId[oneRow[3]].TAX_AMOUNT = this.helperService.calcTaxAmount(
                this.pTable.positionsWithId[oneRow[3]].PRICE_BRU, this.pTable.positionsWithId[oneRow[3]].PRICE_NET);
              this.disableSaveButton(false);
            }
          }
        }
      } else {
        console.log(new Error('Taxation is not defined!'));
        this.messagesService.showErrorMessage('saveOrderPosition: '
          + this.errorMessage.replace('%s', this.translatePipe.transform('TAXATION')));
      }
    } else {
      let infoMessage = this.translatePipe.transform('NO_PRICE_FOUND_FOR_ARTICLE');
      infoMessage += ' ' + this.translatePipe.transform('CLIENT') + ': ' + clientType;
      infoMessage += ' ' + this.translatePipe.transform('COUNTRY_ISO_CODE') + ': ' + cusAddrISOCode;
      this.messagesService.showInfoMessage(infoMessage.replace('%s', ' "' + itmnum + '"'));
      this.orderPosition.PRICE_BRU = 0;
      this.orderPosition.PRICE_NET = 0;
      this.orderPosition.TAX_AMOUNT = 0;
    }
  }

  /**
   * set article category soas and description for order position by given article item number
   *
   * @param itemNumber
   */
  public async setOPCategoryAndDesc(itemNumber: string): Promise<boolean> {
    this.errorMessage = this.translatePipe.transform('FIELD_SHOULD_NOT_BE_EMPTY');
    let artDbData: { table: [any[string], any[]], maxRows: number, page: number } =
      await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_ARTICLES,
        ViewQueryTypes.DETAIL_TABLE, 'ITMNUM', itemNumber);
    if (!artDbData || (Object.keys(artDbData['table'][1]).length === 0)) {
      this.messagesService.showErrorMessage('setCategorySoas: ' +
        this.errorMessage.replace('%s', this.translatePipe.transform('ITMNUM')));
      return false;
    }
    let articleData = artDbData['table'][1][0];
    this.orderPosition.CATEGORY_SOAS = articleData ? articleData.CATEGORY_SOAS : undefined;
    this.orderPosition.ITMDES = articleData ? articleData.ITMDES : undefined;
    return true;
  }

  /**
   * Set price by item number
   *
   * @param itmnum
   * @param rowId
   * @param clientType
   * @param customerNumber
   * @param selTableRowTaxation
   */
  public async setPriceByItmnum(itmnum: string, rowId: string, clientType: string, customerNumber: string,
                                selTableRowTaxation: number) {
    console.log('setPriceByItmnum... ', this.refTable + ' itmnum: ' + itmnum + ' customer: ' + customerNumber +
      ' client: ' + clientType + ' tax: '+ selTableRowTaxation);
    if (itmnum && itmnum.length > 0) {
      let cusRefTable: string = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV;
      let cusColumn: string = this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN;
      let typeColumn: string = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_ADDRESS_TYPE;
      let typeValue: string = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_COLUMN;
      // CUSTOMERS_NUMBER = '3100022966' AND ADDRESS_TYPE = 'DLV'
      let tableDbData: { table: [any[string], any[]], maxRows: number, page: number } =
        await this.tableDataService.getTableDataByCustomersNumber(cusRefTable,
          ViewQueryTypes.DETAIL_TABLE, cusColumn, customerNumber, typeColumn, typeValue);
      if (!tableDbData) {
        return;
      }
      if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
        // load customer type
        clientType = 'B2C';
      }
      if (tableDbData['table'] && Object.keys(tableDbData['table']).length > 1) {
        let customerAddressISOCode = ""; // 'DE';
        if (tableDbData['table'][1][0].ADDRESS_ISO_CODE) {
          customerAddressISOCode = tableDbData['table'][1][0].ADDRESS_ISO_CODE;
        } else {
          console.log('Customer Address not found! Customer group set to default: ' + customerAddressISOCode);
          // this.showInfoMessage('Customer Address not found! Customer group set to default: ' + customerAddressISOCode);
          return;
        }
        let customerGroup = customerAddressISOCode + '_' + clientType; // DE_B2C
        console.log('customer group: ', customerGroup);
        // load prices from PRILIST table
        if (clientType === this.CONSTANTS.CLIENT_B2B) {
          // check if for current customerNumber a separate price exists
          // if not, load price by country group name
          let prlDbData: { table: [any[string], any[]], maxRows: number, page: number } =
            await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_PRILISTS,
              ViewQueryTypes.DETAIL_TABLE, 'ITMNUM', itmnum, 'CUSGRP', customerNumber);
          if (!prlDbData) {
            return;
          }
          let prlData = prlDbData['table'][1][0];
          if (prlData && prlData.PRICE_NET) {
            await this.setPriceLogic(prlData, clientType, itmnum, rowId, customerAddressISOCode, selTableRowTaxation);
          } else {
            console.log('WARNING: Price list for ITMNUM: ' + itmnum, +' not found by CUSGRP: ' +
              customerNumber + '. Search it for customer country CUSGRP: ' + customerGroup);
            // set price by default customer group of customer country
            let prlDbData2: { table: [any[string], any[]], maxRows: number, page: number } =
              await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_PRILISTS,
                ViewQueryTypes.DETAIL_TABLE, 'ITMNUM', itmnum, 'CUSGRP', customerGroup);
            if (!prlDbData2) {
              return;
            }
            if (prlDbData2['table'] && prlDbData2['table'][1] && prlDbData2['table'][1][0]) {
              await this.setPriceLogic(prlDbData2['table'][1][0], clientType, itmnum, rowId, customerAddressISOCode,
                selTableRowTaxation);
            } else {
              console.log('ERROR: 1. Price list is not loaded for ITMNUM: ' + itmnum + ' CUSGRP: ' + customerGroup);
            }
          }
        } else if (clientType === this.CONSTANTS.CLIENT_B2C) {
          // load price by country group name
          let prlDbData: { table: [any[string], any[]], maxRows: number, page: number } =
            await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_PRILISTS,
              ViewQueryTypes.DETAIL_TABLE, 'ITMNUM', itmnum, 'CUSGRP', customerGroup);
          console.log('prlDbData: ', prlDbData);
          if (!prlDbData) {
            return;
          }
          if (prlDbData['table'] && prlDbData['table'][1] && prlDbData['table'][1][0]) {
            await this.setPriceLogic(prlDbData['table'][1][0], clientType, itmnum, rowId, customerAddressISOCode,
              selTableRowTaxation);
          } else {
            console.log('ERROR: 2. Price list is not loaded for ITMNUM: ' + itmnum + ' CUSGRP: ' + customerGroup);
          }
        }
      } else {
        console.log('Customer Address is not set...');
      }
    } else {
      console.log('ITMNUM is not set...');
    }
  }

  /**
   * Order Positions - Validate prices
   *
   * Used in p-dialog and p-table !!!
   *
   * @param row
   * @param validateFieldValue
   * @param selTableRowTaxation
   */
  public inputValidationPriceCalculation(row: any, validateFieldValue: number, selTableRowTaxation: number) {
    console.log('inputValidationPriceCalculation - selTableRowTaxation: ', selTableRowTaxation);
    console.log('this.selTableRow: ', this.selTableRow);
    if (selTableRowTaxation) {
      if (this.selTableRow['CLIENT'] === this.CONSTANTS.CLIENT_B2C) {
        this.pTable.pTable._value[row].PRICE_NET =
          this.helperService.calcB2CPriceNet(validateFieldValue, selTableRowTaxation);
      } else if (this.selTableRow['CLIENT'] === this.CONSTANTS.CLIENT_B2B) {
        this.pTable.pTable._value[row].PRICE_BRU =
          this.helperService.calcB2BPriceBru(validateFieldValue, selTableRowTaxation);
      }
    } else {
      this.messagesService.showErrorMessage('saveOrderPosition: ' +
        this.errorMessage.replace('%s', this.translatePipe.transform('TAXATION')));
    }
    this.disableSaveButton(false);
    return true;
  }

  /**
   * check warehouse allocation of given order positions
   * SOAS-17
   *
   * @param positionsForDeliveryNoteCreation
   * @param isPartlyDelivery
   * @param cacheCheck
   * @param orderWarehouse
   */
  checkWHAllocation(positionsForDeliveryNoteCreation: OrdersPositions[], isPartlyDelivery: boolean,
                    cacheCheck: boolean, orderWarehouse: string): Promise<{
    resultAllocation: boolean,
    resultPartlyDelivery: boolean,
    resultData: undefined | { success: boolean, message: string, data: any[] }
  }> {
    let resultAllocation: boolean = false;
    let resultPartlyDelivery: boolean = false;
    let self = this;
    return new Promise(async resolve => {
      // 1 check: If same LOC available in db with same (ITMNUM, LOT (WHLOC, STATUS_POS, RESERVED))
      let tempCheckData: {result: { success: boolean, message: string, data: any[] }} =
        await self.tableDataService.checkTableData("checkWHAllocation",
        {
          data: positionsForDeliveryNoteCreation, isPartlyDelivery: isPartlyDelivery,
          cacheCheck: cacheCheck, orderWarehouse: orderWarehouse
        }, false);
      if (tempCheckData && tempCheckData['result']) {
        resultAllocation = true;
        resolve({
          resultAllocation: resultAllocation,
          resultPartlyDelivery: resultPartlyDelivery,
          resultData: tempCheckData['result']
        });
      } else {
        console.log("Check result is empty!");
        resolve({
          resultAllocation: resultAllocation,
          resultPartlyDelivery: resultPartlyDelivery,
          resultData: undefined
        });
      }
    });
  }

  /**
   * Order Positions - Set default values for order position 'new postion' dialog
   *
   * @param refTable
   * @param selTableRow
   * @param positionsModel
   * @private
   */
  public setOrderPositionDefaults(refTable: string,
                                  selTableRow: TabGroupModel,
                                  positionsModel: OrdersPositions | InvoicesPositions) {
    this.orderPosition = undefined;
    this.invoicePosition = undefined;
    if (this.refTable === this.CONSTANTS.REFTABLE_ORDERS) {
      if (positionsModel instanceof OrdersPositions) {
        this.orderPosition = {
          ORDERS_NUMBER: selTableRow['ORDERS_NUMBER'],
          CATEGORY_SOAS: positionsModel.CATEGORY_SOAS,
          ASSIGNED_QTY: positionsModel.ASSIGNED_QTY,
          PRICE_BRU: positionsModel.PRICE_BRU,
          PRICE_NET: positionsModel.PRICE_NET,
          CURRENCY: selTableRow['CURRENCY'],
          WAREHOUSE: selTableRow['WAREHOUSE']
        };
      }
      this.orderPosition['POSITION_STATUS'] = positionsModel.POSITION_STATUS;
    } else if (this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {





      this.orderPosition = {
        // INVOICES_NUMBER: selTableRow['INVOICES_NUMBER'],
        ORDERS_NUMBER: selTableRow['ORDERS_NUMBER'],
        CATEGORY_SOAS: positionsModel.CATEGORY_SOAS,
        // DELIVERY_QTY: positionsModel.DELIVERY_QTY,
        PRICE_BRU: positionsModel.PRICE_BRU,
        PRICE_NET: positionsModel.PRICE_NET,
        CURRENCY: selTableRow['CURRENCY'],
        WAREHOUSE: selTableRow['SALES_LOCATION'] // selTableRow['WAREHOUSE'],
      };
      // this.positionsModel.ORDERS_NUMBER = selTableRow['ORDERS_NUMBER'];
      this.invoicePosition = {
        INVOICES_NUMBER: selTableRow['INVOICES_NUMBER'],
        // ORDERS_NUMBER: selTableRow['ORDERS_NUMBER'],
        CATEGORY_SOAS: positionsModel.CATEGORY_SOAS,
        // DELIVERY_QTY: positionsModel.DELIVERY_QTY,
        PRICE_BRU: positionsModel.PRICE_BRU,
        PRICE_NET: positionsModel.PRICE_NET,
        CURRENCY: selTableRow['CURRENCY'],
        SALES_LOCATION: selTableRow['SALES_LOCATION']
      };
    }
  }

  /**
   * Disable or enable save button(s)
   *
   * @param disable: boolean - if true - disable save button
   */
  disableSaveButton(disable: boolean) {
    if (this.saveButton) {
      this.saveButton.nativeElement.disabled = disable;
    }
    if (this.dlgSaveButton) {
      this.dlgSaveButton.nativeElement.disabled = disable;
    }
  }

  /**
   *  Order Positions - Show "Add new position" dialog <CustomPDialogComponent>
   */
  async showDialogToAdd() {
    console.log('###selTableRow: ', this.selTableRow);
    if (this.selTableRow &&
      (this.selTableRow['CUSTOMER_ADDRESSES_ID_DELIVERY'] && this.selTableRow['CUSTOMER_ADDRESSES_ID_INVOICE']) ||
      this.selTableRow['INVOICES_CUSTOMER']) {
      // check if current customer row has address data set
      if ((this.refTable === this.CONSTANTS.REFTABLE_ORDERS) || (this.refTable === this.CONSTANTS.REFTABLE_INVOICE)) {
        this.newOrderPosition = true;
        // set default values here
        this.setOrderPositionDefaults(this.refTable, this.selTableRow, this.positionsModel);
      }
      // Setup pDialog service...
      this.setTranslatePipe(this.translatePipe);
      this.setSelTableRow(this.selTableRow);
      this.setRefTable(this.refTable);
      this.setPDialogComponent(this.pDialogComponent);
      this.setPTable(this.pTable);
      this.setNewOrderPosition(this.newOrderPosition);
      this.setSaveButton(this.saveButton);
      this.setDlgSaveButton(this.dlgSaveButton);
      await this.initPDialog(this.currencies, this.pCurrencies, this.selTableRowTaxation,
        this.dialogCols, this.selectedOrderPosition, this.displayDialog, this.autocomplete);
      this.pDialogComponent.displayDialog = true;
    } else {
      this.messagesService.showErrorMessage(this.translatePipe.transform('REQUIRED_FIELDS_MESSAGE') + ' ' +
        this.translatePipe.transform('CUSTOMER_ADDRESSES_ID_DELIVERY') + ', ' +
        this.translatePipe.transform('CUSTOMER_ADDRESSES_ID_INVOICE') + '.');
      this.tabsService.selectTab(this.tabsService.ordersTitle, SubTabGroupTabNames.ORDER_DETAILS);
    }
  }
}
