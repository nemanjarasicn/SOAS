import {ElementRef, Injectable, ViewChild} from '@angular/core';
import {OrderPositionItem} from '../../interfaces/order-position-item';
import {
  ConstantsService,
  CustomersTypes, DELIVERY_NOTE_POSITIONS_COLS, INVOICE_POSITIONS_COLS,
  ORDER_POSITIONS_COLS, ORDER_POSITIONS_DIALOG_COLS,
  SubTabGroupTabNames
} from '../../_services/constants.service';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {DeliveryNotePositionItem} from '../../interfaces/delivery-note-position-item';
import {InvoicePositionItem} from '../../interfaces/invoice-position-item';
import {CustomPTableComponent} from '../custom/custom-p-table/custom-p-table.component';
import {HelperService} from '../../_services/helper.service';
import {DetailViewTabGroupTabsService} from "./detail-view-tab-group-tabs.service";
import {Customer} from "../../models/customer";
import {Orders} from "../../models/orders";
import {DeliveryNotes} from "../../models/delivery-notes";
import {Invoices} from "../../models/invoices";
import {FormOptionsNVn, FormOptionsNVS} from "../../interfaces/form-options";
import {AutoComplete} from "primeng/autocomplete";

@Injectable({
  providedIn: 'root'
})

/**
 * DetailViewTabGroupPositionsService - a service for detail view tab group component view to manage positions (orders,
 * delivery notes, invoices)
 *
 * Used by: DetailViewTabGroupComponent
 */
export class DetailViewTabGroupPositionsService {

  refTable: string;
  selCurrentTabGroupName: string;
  updatedOrderPositionsRows: string[];
  fullEditMode: boolean;
  orderAllocatedFlag: boolean;
  ordPosStates: FormOptionsNVS[];
  dlvPosStates: FormOptionsNVS[];
  invPosStates: FormOptionsNVS[];
  currencies: any[];
  cols: any[]; // order positions form columns

  // selected table row item
  selTableRow: undefined | Customer | Orders | DeliveryNotes | Invoices;
  ordDlvInvStates: FormOptionsNVn[]; // = [{name: 'PLEASE_SELECT', value: undefined}];

  formDataAvailableFlag: boolean;
  formDisabledFlag: boolean;
  // selected table row item taxation value (required for customers, orders)
  selTableRowTaxation: number;
  orderReleaseFlag: boolean;

  // p-table view for positions (order-, delivery notes-, invoices-positions)
  @ViewChild(CustomPTableComponent) pTable !: CustomPTableComponent;

  tabsService: DetailViewTabGroupTabsService;

  private translatePipe: TranslateItPipe;

  @ViewChild('saveButton', {static: false}) saveButton: ElementRef;
  @ViewChild('allocateButton', {static: false}) allocateButton: ElementRef;
  @ViewChild('dlgSaveButton', {static: false}) dlgSaveButton: ElementRef;

  constructor(private CONSTANTS: ConstantsService,
              private helperService: HelperService) {
  }

  /**
   * set translation pipe at tab-group constructor
   *
   * @param translatePipe
   */
  setTranslatePipe(translatePipe: TranslateItPipe) {
    this.translatePipe = translatePipe;
  }

  setRequiredParams(refTable: string, selCurrentTabGroupName: string,
                    updatedOrderPositionsRows: string[], fullEditMode: boolean, orderAllocatedFlag: boolean,
                    pTable: CustomPTableComponent, tabsService: DetailViewTabGroupTabsService,
                    ordPosStates: FormOptionsNVS[],
                    dlvPosStates: FormOptionsNVS[],
                    invPosStates: FormOptionsNVS[],
                    saveButton: ElementRef, dlgSaveButton: ElementRef, allocateButton: ElementRef,
                    currencies: any[], cols: any[],
                    selTableRow: undefined | Customer | Orders | DeliveryNotes | Invoices,
                    ordDlvInvStates: FormOptionsNVn[], formDataAvailableFlag: boolean, formDisabledFlag: boolean,
                    selTableRowTaxation: number, orderReleaseFlag: boolean
  ) {
    this.setRefTable(refTable);
    this.setSelCurrentTabGroupName(selCurrentTabGroupName);
    this.setUpdatedOrderPositionsRows(updatedOrderPositionsRows);
    this.setFullEditMode(fullEditMode);
    this.setOrderAllocatedFlag(orderAllocatedFlag);
    this.setPTable(pTable);
    this.setTabsService(tabsService);
    this.setOrdPosStates(ordPosStates);
    this.setDlvPosStates(dlvPosStates);
    this.setInvPosStates(invPosStates);

    this.setSaveButton(saveButton);
    this.setDlgSaveButton(dlgSaveButton);
    this.setAllocateButton(allocateButton);

    this.setCurrencies(currencies);
    this.setCols(cols);

    this.setSelTableRow(selTableRow);
    this.setOrdDlvInvStates(ordDlvInvStates);

    this.setFormDataAvailableFlag(formDataAvailableFlag);
    this.setFormDisabledFlag(formDisabledFlag);
    this.setSelTableRowTaxation(selTableRowTaxation);
    this.setOrderReleaseFlag(orderReleaseFlag);

  }

  setRefTable(name: string) {
    this.refTable = name;
  }

  setSelCurrentTabGroupName(name: string) {
    this.selCurrentTabGroupName = name;
  }

  setUpdatedOrderPositionsRows(rows: string[]) {
    this.updatedOrderPositionsRows = rows;
  }

  setFullEditMode(flag: boolean) {
    this.fullEditMode = flag;
  }

  setOrderAllocatedFlag(flag: boolean) {
    this.orderAllocatedFlag = flag;
  }

  setPTable(table: CustomPTableComponent) {
    this.pTable = table;
  }

  setTabsService(service: DetailViewTabGroupTabsService) {
    this.tabsService = service;
  }

  setOrdPosStates(states: FormOptionsNVS[]) {
    this.ordPosStates = states;
  }

  setDlvPosStates(states: FormOptionsNVS[]) {
    this.dlvPosStates = states;
  }

  setInvPosStates(states: FormOptionsNVS[]) {
    this.invPosStates = states;
  }

  setSaveButton(button: ElementRef) {
    this.saveButton = button;
  }

  setDlgSaveButton(button: ElementRef) {
    this.dlgSaveButton = button;
  }

  setAllocateButton(button: ElementRef) {
    this.allocateButton = button;
  }

  setCurrencies(currencies: any[]) {
    this.currencies = currencies;
  }

  setCols(cols: any[]) {
    this.cols = cols;
  }

  setSelTableRow(row: undefined | Customer | Orders | DeliveryNotes | Invoices) {
    this.selTableRow = row;
  }

  setOrdDlvInvStates(states: FormOptionsNVn[]) {
    this.ordDlvInvStates = states;
  }

  setFormDataAvailableFlag(flag: boolean) {
    this.formDataAvailableFlag = flag;
  }

  setFormDisabledFlag(flag: boolean) {
    this.formDisabledFlag = flag;
  }

  setSelTableRowTaxation(taxation) {
    this.selTableRowTaxation = taxation;
  }

  setOrderReleaseFlag(flag: boolean) {
    this.orderReleaseFlag = flag;
  }

  /**
   * Order Positions - Reset autocomplete field class values
   *
   * @param element
   * @param classNamesToReplace
   * @param classNamesReplaceWith
   */
  public replaceAutocompleteElementClass(element: any, classNamesToReplace: string[], classNamesReplaceWith: string[]) {
    let classValue = element.getAttributeNode('class').value;
    for (let itm in classNamesToReplace) {
      classValue = classValue.replace(classNamesToReplace[itm], '');
      classValue += ' ' + classNamesReplaceWith[itm];
      // Workaround for removing editing class from edited autocomplete element
      // element.attributes.removeNamedItem('class');
      element.setAttribute('class', classValue);
    }
  }

  /**
   * check if given order position item is one of given delivery notes positions entries
   *
   * @param deliveryNotePositions
   * @param orderPosition
   * @return true if order position is in delivery notes positions, otherwise false
   */
  public checkPositionIsInDnp(deliveryNotePositions: DeliveryNotePositionItem[], orderPosition: OrderPositionItem):
    boolean {
    let dnQTY = 0;
    let foundSameITMNUM = false;
    for (let dnItem in deliveryNotePositions) {
      if (deliveryNotePositions.hasOwnProperty(dnItem)) {
        if (deliveryNotePositions[dnItem].ITMNUM === orderPosition.ITMNUM &&
          deliveryNotePositions[dnItem].ORDERS_POSITIONS_ID === orderPosition.ID) {
          foundSameITMNUM = true;
          dnQTY += deliveryNotePositions[dnItem].ORDER_QTY;
          break;
        }
      }
    }
    if (foundSameITMNUM) {
      if (orderPosition.ORDER_QTY === dnQTY) {
        return true;
      }
    }
    return false;
  }

  /**
   * check if given delivery note position item is one of given invoices positions entries
   *
   * @param invPositions
   * @param deliveryNotePosition
   * @return true if delivery note position is in invoice positions, otherwise false
   */
  public checkPositionIsInInvp(invPositions: InvoicePositionItem[], deliveryNotePosition: OrderPositionItem): boolean {
    let invQTY = 0;
    let foundSameITMNUM = false;
    for (let ivItem in invPositions) {
      if (invPositions.hasOwnProperty(ivItem) &&
        invPositions[ivItem].ITMNUM === deliveryNotePosition.ITMNUM &&
        invPositions[ivItem].DELIVERY_NOTES_POSITIONS_ID === deliveryNotePosition.ID) {
        foundSameITMNUM = true;
        invQTY += invPositions[ivItem].ORDER_QTY;
        break;
      }
    }
    if (foundSameITMNUM) {
      if (deliveryNotePosition.ORDER_QTY === invQTY) {
        return true;
      }
    }
    return false;
  }

  /**
   * Add focus to autocomplete field, after loading p-dialog
   */
  public addFocusToAutocomplete(autocomplete: AutoComplete, displayDialog: boolean) {
    if (displayDialog) {
      if (autocomplete) {
        autocomplete.focusInput();
        // console.log("Loaded");
      } else {
        this.addFocusToAutocomplete(autocomplete, displayDialog);
        // console.log("Waited");
      }
    }
  }

  public valueToUppercase($event) {
    $event.target.value = $event.target.value.toUpperCase();
  }

  public manageKeyUp($event) {
    $event.target.value = $event.target.value.toUpperCase();
  }

  /**
   * Returns cols for position item and dialog position item (without id) disabled - if true, not show column in table
   *
   * @param clientType
   */
  public getOrderPositionCols(clientType: CustomersTypes):
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

  /**
   * Returns columns (cols) for delivery note position items. disabled - if true, not show column in table
   */
  public getDeliveryNotePositionCols():
    { field: string, header: string, disabled: boolean, readonly: boolean, size: number, width: string }[] {
    return DELIVERY_NOTE_POSITIONS_COLS;
  }

  /**
   * Returns columns (cols) for invoice position items. disabled - if true, not show column in table
   */
  public getInvoicePositionCols():
    { field: string, header: string, disabled: boolean, readonly: boolean, size: number, width: string }[] {
    return INVOICE_POSITIONS_COLS;
  }

  public initPositionsTable() {
    this.disableSaveButton(true);
    this.disableAllocateButton(true);
    if (this.refTable === this.CONSTANTS.REFTABLE_CUSTOMER || this.refTable === this.CONSTANTS.REFTABLE_PARTNERS ||
      this.refTable === this.CONSTANTS.REFTABLE_ORDERS || this.refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES ||
      this.refTable === this.CONSTANTS.REFTABLE_INVOICE) {
      if (this.selCurrentTabGroupName === SubTabGroupTabNames.ORDER_DETAILS ||
        this.selCurrentTabGroupName === SubTabGroupTabNames.ORDER_POSITIONS) {
        this.showOrderPositions();
      } else if (this.selCurrentTabGroupName === SubTabGroupTabNames.DELIVERY_NOTES_DETAILS ||
        this.selCurrentTabGroupName === SubTabGroupTabNames.DELIVERY_NOTES_POSITIONS) {
        this.showDeliveryNotePositions();
      } else if (this.selCurrentTabGroupName === SubTabGroupTabNames.INVOICE_DETAILS ||
        this.selCurrentTabGroupName === SubTabGroupTabNames.INVOICES_POSITIONS) {
        this.showInvoicePositions();
      }
    }
  }

  /**
   * show order positions
   *
   * IMPORTANT: If a new field is added and should be visible, make sure to add it to
   * constants.service.ts > ORDER_POSITIONS_DIALOG_COLS constant too
   */
  public showOrderPositions() {
    if (this.pTable) {
      this.pTable.setOrderPositionStates(this.ordPosStates);
      this.pTable.releaseFlag = this.orderReleaseFlag;
      this.pTable.formDisabledFlag = this.formDisabledFlag;
      // init order positions
      let counter = 1;
      // this.orderPositions = [];
      let tmpOrderPositions: OrderPositionItem[] = [];
      this.pTable.resetPositions();
      this.updatedOrderPositionsRows = [];
      this.fullEditMode = false;
      this.orderAllocatedFlag = true;
      if (this.pTable.positionsWithId.length) {
        for (let formElement in this.pTable.positionsWithId) {
          if (this.pTable.positionsWithId.hasOwnProperty(formElement)) {
            const ordPosItemWithId: OrderPositionItem = this.pTable.positionsWithId[formElement];
            if (ordPosItemWithId.hasOwnProperty('CURRENCY')) {
              ordPosItemWithId.CURRENCY =
                this.helperService.getCurrencyName(this.currencies, ordPosItemWithId.CURRENCY);
            }
            // ordPosItemWithId.ASSIGNED_QTY = this.orderPositionModel.ASSIGNED_QTY;
            // make copy of order positions item and replace id with counter, so the ID stay unchanged
            let newItem: OrderPositionItem = {
              ID: ordPosItemWithId.ID,
              POS: counter++, // virtual column for showing position number in view
              ORDERS_NUMBER: ordPosItemWithId.ORDERS_NUMBER,
              ITMNUM: ordPosItemWithId.ITMNUM,
              ITMDES: ordPosItemWithId.ITMDES,
              CATEGORY_SOAS: ordPosItemWithId.CATEGORY_SOAS,
              ORDER_QTY: ordPosItemWithId.ORDER_QTY,
              ASSIGNED_QTY: ordPosItemWithId.ASSIGNED_QTY,
              DELIVERED_QTY: ordPosItemWithId.DELIVERED_QTY,
              PRICE_NET: ordPosItemWithId.PRICE_NET,
              PRICE_BRU: ordPosItemWithId.PRICE_BRU,
              CURRENCY: ordPosItemWithId.CURRENCY,
              WAREHOUSE: ordPosItemWithId.WAREHOUSE,
              POSITION_STATUS: ordPosItemWithId.POSITION_STATUS,
              DIST_COMPONENTS_ID: ordPosItemWithId.DIST_COMPONENTS_ID,
              PARENT_LINE_ID: ordPosItemWithId.PARENT_LINE_ID // added extra
            };
            if (this.ordPosStates && this.ordPosStates.length) {
              // check if order position has states (OPEN, PARTLY_ALLOCATED, FULL_ALLOCATED), and allow for
              // these states to edit table items
              this.fullEditMode = (!this.fullEditMode && (newItem.POSITION_STATUS === this.ordPosStates[1].value ||
                newItem.POSITION_STATUS === this.ordPosStates[2].value ||
                newItem.POSITION_STATUS === this.ordPosStates[3].value
              )) ? true : this.fullEditMode;
              if (newItem.POSITION_STATUS !== this.ordPosStates[3].value) {
                this.orderAllocatedFlag = false;
              }
            } else {
              console.log(new Error('this.ordPosStates is undefined!'));
            }
            // this.orderAllocatedFlag = !this.orderAllocatedFlag ? (newItem.POSITION_STATUS !== this.ordPosStates[3].value) :
            //   this.orderAllocatedFlag;
            // this.orderPositions.push(newItem);
            tmpOrderPositions.push(newItem);
            // this.pTable.addItem(newItem);
          }
        }
        this.pTable.setFullEditMode(this.fullEditMode);
        this.disableAllocateButton(this.orderAllocatedFlag);
      } else {
        this.orderAllocatedFlag = false;
        this.disableAllocateButton(true);
      }
      this.pTable.positionsWithId = tmpOrderPositions;
    } else {
      console.log('pTable is not initialized!');
    }
  }

  /**
   * show delivery note positions
   *
   * IMPORTANT: If a new field is added and should be visible, make sure to add it to
   * constants.service.ts > DELIVERY_NOTE_POSITIONS_COLS constant too
   */
  public showDeliveryNotePositions() {
    if (this.pTable) {
      this.pTable.setDlvPositionStates(this.dlvPosStates);
      this.pTable.formDisabledFlag = this.formDisabledFlag;
      // this.dlnPositionItems = [];
      let tmpDeliveryNotePositions: DeliveryNotePositionItem[] = [];
      this.pTable.resetPositions();
      this.updatedOrderPositionsRows = [];
      let counter = 1;
      this.fullEditMode = false;
      for (let formElement in this.pTable.positionsWithId) {
        if (this.pTable.positionsWithId.hasOwnProperty(formElement)) {
          const dlvPosItemWithId: DeliveryNotePositionItem = this.pTable.positionsWithId[formElement];
          // make copy of order positions item and replace id with counter, so the ID stay unchanged
          let newItem: DeliveryNotePositionItem = {
            ID: dlvPosItemWithId.ID,
            POS: counter++, // virtual column for showing position number in view
            DELIVERY_NOTES_NUMBER: dlvPosItemWithId.DELIVERY_NOTES_NUMBER,
            ORDERS_NUMBER: dlvPosItemWithId.ORDERS_NUMBER,
            ITMNUM: dlvPosItemWithId.ITMNUM,
            CATEGORY_SOAS: dlvPosItemWithId.CATEGORY_SOAS,
            ORDER_QTY: dlvPosItemWithId.ORDER_QTY,
            WEIGHT_PER: dlvPosItemWithId.WEIGHT_PER,
            DELIVERY_QTY: dlvPosItemWithId.DELIVERY_QTY,
            ORDERS_POSITIONS_ID: dlvPosItemWithId.ORDERS_POSITIONS_ID,
            POSITION_STATUS: dlvPosItemWithId.POSITION_STATUS
          };
          this.fullEditMode = (!this.fullEditMode && newItem.DELIVERY_QTY === 0) ? true : this.fullEditMode;
          // this.dlnPositionItems.push(newItem);
          this.pTable.setFullEditMode(this.fullEditMode);
          // this.pTable.addItem(newItem);
          tmpDeliveryNotePositions.push(newItem);
        }
      }
      this.pTable.positionsWithId = tmpDeliveryNotePositions;
    }
  }

  /**
   * show invoice postions
   *
   * IMPORTANT: If a new field is added and should be visible, make sure to add it to
   * constants.service.ts > INVOICE_POSITIONS_COLS constant too
   */
  public showInvoicePositions() {
    if (this.pTable) {
      this.pTable.setInvPositionStates(this.invPosStates);
      this.pTable.formDisabledFlag = this.formDisabledFlag;
      // this.invPositionItems = [];
      let tmpInvoicePositions: InvoicePositionItem[] = [];
      this.pTable.resetPositions();
      this.fullEditMode = false;
      let counter = 1;
      for (let formElement in this.pTable.positionsWithId) {
        if (this.pTable.positionsWithId.hasOwnProperty(formElement)) {
          const invPosItemWithId: InvoicePositionItem = this.pTable.positionsWithId[formElement];
          invPosItemWithId.CURRENCY = this.helperService.getCurrencyName(this.currencies, invPosItemWithId.CURRENCY);
          // make copy of order positions item and replace id with counter, so the ID stay unchanged
          let newItem: InvoicePositionItem = {
            ID: invPosItemWithId.ID,
            POS: counter++, // virtual column for showing position number in view
            INVOICES_NUMBER: invPosItemWithId.INVOICES_NUMBER,
            DELIVERY_NOTES_NUMBER: invPosItemWithId.DELIVERY_NOTES_NUMBER,
            ORDERS_NUMBER: invPosItemWithId.ORDERS_NUMBER,
            ITMNUM: invPosItemWithId.ITMNUM,
            ITMDES: invPosItemWithId.ITMDES,
            CATEGORY_SOAS: invPosItemWithId.CATEGORY_SOAS,
            ORDER_QTY: invPosItemWithId.ORDER_QTY,
            DELIVERY_QTY: invPosItemWithId.DELIVERY_QTY,
            PRICE_NET: invPosItemWithId.PRICE_NET,
            PRICE_BRU: invPosItemWithId.PRICE_BRU,
            CURRENCY: invPosItemWithId.CURRENCY,
            DELIVERY_NOTES_POSITIONS_ID: invPosItemWithId.DELIVERY_NOTES_POSITIONS_ID,
            SALES_LOCATION: invPosItemWithId.SALES_LOCATION,
            POSITION_STATUS: invPosItemWithId.POSITION_STATUS,
            PARENT_LINE_ID: invPosItemWithId.PARENT_LINE_ID,
            TAX_AMOUNT: invPosItemWithId.TAX_AMOUNT
          };
          // this.invPositionItems.push(newItem);
          if (this.invPosStates && this.invPosStates.length) {
            // check if invoice position has states (OPEN, PAYED), and allow for these states to edit table items
            this.fullEditMode = (!this.fullEditMode && (newItem.POSITION_STATUS === this.invPosStates[0].value ||
              newItem.POSITION_STATUS === this.invPosStates[1].value
            )) ? true : this.fullEditMode;
          }
          this.pTable.setFullEditMode(this.fullEditMode);
          // this.pTable.addItem(newItem);
          tmpInvoicePositions.push(newItem);
        }
      }
      this.pTable.positionsWithId = tmpInvoicePositions;
    }
  }

  /**
   * Disable or enable allocate button
   *
   * @param disable: boolean - if true - disable allocate button
   */
  disableAllocateButton(disable: boolean) {
    if (this.allocateButton) {
      this.allocateButton.nativeElement.disabled = disable;
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
   * get columns item properties
   *
   * @param itemName
   */
  getColsItemProperties(itemName: string) {
    for (let cItem in this.cols) {
      if (this.cols[cItem].field === itemName) {
        return this.cols[cItem];
      }
    }
    return false;
  }

  /**
   * condition if 'new position' button should be visible at order positions view
   *
   * @description
   * '(create) new position' button should be shown if:
   * [1. form data is loaded and available (this.formDataAvailableFlag &&)]
   * 2. form is not disabled
   * 3. taxation is loaded and set (reset at orders component table click)
   * 4. order is not released or
   *    order state is lower than 30 ("Komplett abgeschlossen") STATE_AU_COMPLETED
   */
  public isCreatePositionButtonVisible(): boolean {
    return !!(!this.orderReleaseFlag && !this.formDisabledFlag && this.selTableRowTaxation !== undefined &&
      (this.ordDlvInvStates && this.selTableRow &&  // @ts-ignore
      (this.selTableRow.ORDERS_STATE < this.ordDlvInvStates[4].value)));
  }

  /**
   * condition if 'new position' button should be visible at invoice positions view
   *
   * @description
   * '(create) new position' button should be shown if:
   * 1. form is not disabled
   * 2. taxation is loaded and set (reset at orders component table click)
   * 3. invoice does not have orders- and delivery notes-number
   * 4. invoice state is lower than 100 ("Vollständig bezahlt") STATE_RG_COMPLETLY_PAYED
   */
  public isInvoiceCreatePositionButtonVisible(): boolean {
    return !!(!this.formDisabledFlag && this.selTableRowTaxation !== undefined &&
      (this.ordDlvInvStates && this.selTableRow && // @ts-ignore
        !this.selTableRow.ORDERS_NUMBER && !this.selTableRow.DELIVERY_NOTES_NUMBER && // @ts-ignore
        (this.selTableRow.INVOICES_STATE < this.ordDlvInvStates[3]?.value)));
  }
}
