import {Injectable} from "@angular/core";
import {TableDataService} from "../../_services/table-data.service";
import {ConstantsService, SoasModel, ViewQueryTypes} from "../../_services/constants.service";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {OrderPositionItem} from "../../interfaces/order-position-item";
import {DeliveryNotePositionItem} from "../../interfaces/delivery-note-position-item";
import {DetailViewTabGroupPositionsService} from "./detail-view-tab-group-positions.service";
import {MessageService} from "primeng/api";
import {MessagesService} from "../../_services/messages.service";
import {DeliveryNotes} from "../../models/delivery-notes";
import {DeliveryNotesPositions} from "../../models/delivery-notes-positions";

@Injectable({
  providedIn: 'root'
})
export class DetailViewTabGroupSaveService {

  translatePipe: TranslateItPipe;
  messageService: MessageService;

  // field name that should not be added to post form values
  fieldNamesToIgnore: string[] = [
    this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_ID,
    this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV_ID,
    'INVOICES_NUMBER',
    'INVOICES_CUSTOMER',
    'INVOICES_DATE',
    'INVOICES_CREATOR',
    'PDF_CREATED_DATE',
    'PDF_DOWNLOAD_LINK'
  ];

  constructor(private tableDataService: TableDataService,
              private CONSTANTS: ConstantsService,
              private messagesService: MessagesService,
              private positionsService: DetailViewTabGroupPositionsService) {
  }

  /**
   * set translate pipe
   *
   * @param pipe
   */
  setTranslatePipe(pipe: TranslateItPipe) {
    this.translatePipe = pipe;
    this.messagesService.setTranslatePipe(this.translatePipe);
    this.positionsService.setTranslatePipe(this.translatePipe);
  }

  setMessageService(message: MessageService) {
    this.messageService = message;
  }

  /**
   * save order positions
   *
   * @param orderPositionsItems
   * @param updatedOrderPositionsRows
   * @param opDataTableValues
   * @param orderNumber
   */
  public async saveOrderPositions(orderPositionsItems: OrderPositionItem[], updatedOrderPositionsRows: string[],
                                  opDataTableValues: any[], orderNumber: string):
    Promise<{result: boolean, message: string}> {
    // extract row numbers from ids
    let rowNumbers = [];
    let rowIdNumbers = [];
    const __ret = this.getChangedPositionsRowIds(updatedOrderPositionsRows, rowNumbers, rowIdNumbers, 3,
      1);
    rowNumbers = __ret.rowNumbers;
    rowIdNumbers = __ret.rowIdNumbers;
    let result: boolean = false;
    let message: string = "Save order positions error.";
    // load taxation
    if (orderPositionsItems) {
      if (Object.keys(rowNumbers).length > 0) {
        let allUpdateDataArr = [];
        let updateData: OrderPositionItem = {};
        let orderPositionsError: boolean = false;
        let counter: number = 0;
        for (let rowItem in rowNumbers) {
          for (let opDatItem in opDataTableValues) {
            if (opDatItem === rowNumbers[rowItem]) { // compare POS of table and update rows POS
              // get real ID of the row for orders and update position
              updateData = {};
              counter = 0;
              if (opDataTableValues[opDatItem].ITMDES &&
                opDataTableValues[opDatItem].ITMDES.trim().length > 0) {
                // check qty numbers
                if (opDataTableValues[opDatItem].ASSIGNED_QTY >= 0) {
                  if (opDataTableValues[opDatItem].ORDER_QTY >=
                    opDataTableValues[opDatItem].ASSIGNED_QTY) {
                    // ToDo: Prices NET/BRU like at setPriceLogic ??? Or should they stay manually set?
                    let priceNet = opDataTableValues[opDatItem].PRICE_NET;
                    let priceBru = opDataTableValues[opDatItem].PRICE_BRU;
                    // update this item in db
                    updateData = {
                      'ID': rowIdNumbers[rowItem],
                      'ITMNUM': opDataTableValues[opDatItem].ITMNUM,
                      'ITMDES': opDataTableValues[opDatItem].ITMDES,
                      'ORDER_QTY': opDataTableValues[opDatItem].ORDER_QTY,
                      'ASSIGNED_QTY': opDataTableValues[opDatItem].ASSIGNED_QTY,
                      'PRICE_NET': priceNet,
                      'PRICE_BRU': priceBru,
                      'POSITION_STATUS': opDataTableValues[opDatItem].POSITION_STATUS
                    };
                    // move all update rows to array
                    allUpdateDataArr.push(updateData);
                  } else {
                    orderPositionsError = true;
                    message = this.translatePipe.transform('ASSIGNED_QTY_IS_GREATER_THEN_ORDER_QTY');
                  }
                } else {
                  orderPositionsError = true;
                  message = this.translatePipe.transform('ASSIGNED_QTY_IS_LOWER_THEN_ZERO');
                }
              } else {
                orderPositionsError = true;
                message = this.translatePipe.transform('FIELD_SHOULD_NOT_BE_EMPTY')
                  .replace('%s', this.translatePipe.transform('ITMDES'));
              }
              break;
            }
          }
        }
        if (!orderPositionsError) {
          let insertFlag: boolean = false;
          let overwriteCurrent: boolean = false;
          let updateResult: {result: boolean, message: string} = await this.execUpdatePositions(
            this.CONSTANTS.REFTABLE_ORDERS, this.CONSTANTS.REFTABLE_ORDERS_POSITIONS, orderNumber, allUpdateDataArr,
            insertFlag, overwriteCurrent);
          result = updateResult.result;
          message = updateResult.message;
        } else {
          // ToDo: Do properly reset the position item => if refresh same tab where you are => no changes!
          // fullEditMode = false; // !!!
        }
      } else {
        message = 'save order position: No row keys found for ORDERS_NUMBER "' + orderNumber + '"!';
      }
    }
    return {result: result, message: message};
  }

  /**
   * save delivery note positions
   *
   * @param deliveryNotePositionsItems
   * @param dlnDataTableValues
   * @param selItemRow
   */
  public async saveDeliveryNotePositions(deliveryNotePositionsItems: string[], dlnDataTableValues: {},
                                         selItemRow: {}):
    Promise<{result: boolean, message: string}> {
    // extract row numbers from ids
    let dnRowNumbers = [];
    let dnRowIdNumbers = [];
    let result: boolean = false;
    let message: string = "";
    const __ret2 = this.getChangedPositionsRowIds(deliveryNotePositionsItems, dnRowNumbers, dnRowIdNumbers,
      4, 2);
    dnRowNumbers = __ret2.rowNumbers;
    dnRowIdNumbers = __ret2.rowIdNumbers;
    if (deliveryNotePositionsItems) {
      if (Object.keys(dnRowNumbers).length > 0) {
        let allUpdateDataArr = [];
        let updateData: DeliveryNotePositionItem = {};
        let deliveryNotePositionsError: boolean = false;
        let counter: number = 0;
        for (let rowItem in dnRowNumbers) {
          for (let dnDatItem in dlnDataTableValues) {
            if (dnDatItem === dnRowNumbers[rowItem]) { // compare POS of table and update rows POS
              // get real ID of the row for orders and update position
              updateData = {};
              counter = 0;
              // check qty numbers
              if (dlnDataTableValues[dnDatItem].ORDER_QTY >= dlnDataTableValues[dnDatItem].DELIVERY_QTY) {
                // update this item in db
                updateData = {
                  'ID': dnRowIdNumbers[rowItem],
                  'ITMNUM': dlnDataTableValues[dnDatItem].ITMNUM,
                  'DELIVERY_QTY': dlnDataTableValues[dnDatItem].DELIVERY_QTY
                };
                allUpdateDataArr.push(updateData);
              } else {
                deliveryNotePositionsError = true;
                message = this.translatePipe.transform('DELIVERY_QTY_IS_GREATER_THEN_ORDER_QTY');
              }
              break;
            }
          }
        }
        if (!deliveryNotePositionsError) {
          let insertFlag: boolean = false;
          let overwriteCurrent: boolean = false;
          let updateResult: {result: boolean, message: string} = await this.execUpdatePositions(
            this.CONSTANTS.REFTABLE_DELIVERY_NOTES, this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS,
            selItemRow['DELIVERY_NOTES_NUMBER'], allUpdateDataArr, insertFlag, overwriteCurrent);
          result = updateResult.result;
          message = updateResult.message;
        } else {
          // Error occurred...
          // this.fullEditMode = false;
        }
      } else {
        message = 'No row keys found for ORDERS_NUMBER "' + selItemRow['ORDERS_NUMBER'] + '"!';
      }
    }
    return {result, message};
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
  getChangedPositionsRowIds(updatedPositionsRows: string[], rowNumbers: any[], rowIdNumbers: any[],
                                    rowPosition: number, rowIdPosition: number): {rowNumbers: any[], rowIdNumbers: any[]} {
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
    return {rowNumbers, rowIdNumbers}
  }

  /**
   * Update order or delivery note positions
   *
   * @param currentTableToSave
   * @param saveToTableName
   * @param ordersNumber
   * @param orderPositionsElements
   * @param insertFlag
   * @param overwriteCurrent
   */
  private async execUpdatePositions(currentTableToSave: string, saveToTableName: string, ordersNumber: string,
                                    orderPositionsElements: any, insertFlag: boolean, overwriteCurrent: boolean):
    Promise<{result: boolean, message: string}>  {
    let result: boolean = false;
    let message: string = 'Update positions error.';
    let secondaryKey = this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_COLUMN;
    let secondaryValue = ordersNumber;
    if (currentTableToSave === this.CONSTANTS.REFTABLE_ORDERS) {
      //...
    } else if (currentTableToSave === this.CONSTANTS.REFTABLE_DELIVERY_NOTES) {
      secondaryKey = this.CONSTANTS.REFTABLE_DELIVERY_NOTES_COLUMN;
    } else if (currentTableToSave === this.CONSTANTS.REFTABLE_INVOICE) {
      secondaryKey = this.CONSTANTS.REFTABLE_INVOICE_COLUMN;
    }
    let dbData: {} = await this.tableDataService.setTableRowsData(saveToTableName, orderPositionsElements,
      secondaryKey, secondaryValue, insertFlag, undefined, undefined);
    if (dbData && dbData['result']) {
      if (dbData['result']['success']) {
        if (dbData['result']['itmnums']) {
          let messageDetails: string = "";
          if (currentTableToSave === this.CONSTANTS.REFTABLE_ORDERS) {
            messageDetails = this.translatePipe.transform('ORDER_SAVED_DETAILS');
          } else if (currentTableToSave === this.CONSTANTS.REFTABLE_DELIVERY_NOTES) {
            messageDetails = this.translatePipe.transform('DELIVERY_NOTE_SAVED_DETAILS');
          } else if (currentTableToSave === this.CONSTANTS.REFTABLE_INVOICE) {
            messageDetails = this.translatePipe.transform('INVOICE_SAVED_DETAILS');
          }
          messageDetails = messageDetails.replace('%s1', secondaryValue);
          messageDetails = messageDetails.replace('%s2', dbData['result']['itmnums']);
          message = messageDetails;
        } else {
          message = this.translatePipe.transform('SAVEDSUCCESS');
        }
        result = true;
      } else {
        message = this.translatePipe.transform('SAVEDFAILED');
      }
    }
    // self.showTableFormData(undefined, undefined, function () {});
    return {result, message};
  }

  /*******************************************
   * DELIVERY NOTES FUNCTIONS - START
   ******************************************/

  /**
   * create a delivery note manually - used at click on button 'Create delivery note'
   * Tickets: SOAS-17, SOAS-27, SOAS-29
   */
  async createDeliveryNote(refTable: string, selItemRow: any): Promise<{ result: boolean, message: string }> {
    let result: boolean = false;
    let message: string;
    let release: boolean = false;
    // let positionsRelease: boolean = true;
    // let postFormValues: {};
    // from where user starts action: orders ('/selectThisOrderAvise') or delivery notes ('/selectThisDeliveryNote')
    let thisItem: string = '/selectThisOrderAvise';
    let primaryKey: string = this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_COLUMN;
    let primaryValue: string = selItemRow['ORDERS_NUMBER'];
    let userName: string = localStorage.getItem(this.CONSTANTS.LS_USERNAME);
    let language: string = localStorage.getItem(this.CONSTANTS.LS_LANGUAGE);
    if (refTable === this.CONSTANTS.REFTABLE_ORDERS) {
      if (selItemRow && selItemRow['ORDERS_NUMBER']) {
        // ToDo: Check if order is "Vollständig angezahlt" or "auf Rechnung" oder "PORTAL"
        if (selItemRow['PAYED']) {
          release = selItemRow['RELEASE'];
          // Temporary release state is true. Check if there are positions for that a delivery note can be created.
          let temporaryRelease: boolean = true;
          // if order is/should be released, then check first if all positions have POSITION_STATE 3
          if (temporaryRelease) { // release
            let ordersPositionsDbData = await this.tableDataService.getTableDataById(
              this.CONSTANTS.REFTABLE_ORDERS_POSITIONS, ViewQueryTypes.DETAIL_TABLE,
              'ORDERS_NUMBER', selItemRow['ORDERS_NUMBER']);
            if (!ordersPositionsDbData) {
              message = this.translatePipe.transform('FIELD_SHOULD_NOT_BE_EMPTY')
                .replace('%s', this.translatePipe.transform('ORDERS_NUMBER'));
              return {result, message};
            } else {
              let ordersPositions = ordersPositionsDbData['table'][1];
              if (ordersPositions) {
                // check if there is no delivery note items for current positions
                let opForDNP: {} = await this.getOPForDNPCreation(
                  {
                    ordersNumber: selItemRow['ORDERS_NUMBER'],
                    ordersPositions: ordersPositions,
                    calcAssignedQty: false
                  }, false);
                // if some positions are available for delivery note creation
                if (opForDNP['availability'] && opForDNP['data']) {
                  // if partly delivery, show yes/no dialog first...
                  if (opForDNP['partlyDeliveryDetected']) {
                    const dlgText = this.translatePipe.transform('PARTLY_DELIVERY_DIALOG_MESSAGE')
                      .replace('%s', "<br/>");
                    let dlgResult;
                    try {
                      dlgResult = await this.messagesService.showConfirmationDialog(
                        this.translatePipe.transform('PARTLY_DELIVERY'), dlgText,
                        this.translatePipe.transform('DIALOG_YES'),
                        this.translatePipe.transform('DIALOG_NO'));
                    } catch (error) {
                      dlgResult = error;
                    }
                    if (dlgResult) {
                      return await this.doCreateDeliveryNote(thisItem, primaryKey, primaryValue, userName, language,
                        opForDNP, selItemRow['ORDERS_NUMBER']);
                    } else {
                      return {result, message};
                    }
                  } else {
                    return await this.doCreateDeliveryNote(thisItem, primaryKey, primaryValue, userName, language,
                      opForDNP, selItemRow['ORDERS_NUMBER']);
                  }
                } else {
                  // show info message, that no positions are available for delivery note creation
                  message = this.translatePipe.transform('NO_POSITION_FOR_DELIVERY_NOTE_CREATION') + ' ' +
                    this.translatePipe.transform('ORDERS_NUMBER') + ' "' +
                    selItemRow['ORDERS_NUMBER'] + '".';
                  return {result, message};
                }
              }
            }
          } else {
            message = this.translatePipe.transform('ORDER_IS_NOT_RELEASED') + ' ' +
              this.translatePipe.transform('ORDERS_NUMBER') + ' "' + selItemRow['ORDERS_NUMBER'] + '".';
            return {result, message};
          }
        } else {
          let errorMessage = this.translatePipe.transform('IS_NOT_PAYED');
          errorMessage = errorMessage.replace('%s', this.translatePipe.transform('ORDER'));
          message = errorMessage + ' ' + this.translatePipe.transform('ORDERS_NUMBER') +
            ' "' + selItemRow['ORDERS_NUMBER'] + '".';
          return {result, message};
        }
      } else {
        message = 'selItemRow is empty...';
        console.log(message);
        return {result, message};
      }
    } else {
      message = 'Wrong refTable...';
      console.log(message);
      return {result, message};
    }
  }

  /**
   * get_orders_positions_for_delivery_note_creation
   *
   * @param orderPositionsData
   * @param checkAllocation - if true, call for allocation
   */
  getOPForDNPCreation(orderPositionsData: object, checkAllocation: boolean): Promise<{}> {
    let resultAvailability: boolean = false;
    let resultData: any = undefined;
    let partlyDeliveryDetected: boolean = false;
    let self = this;
    return new Promise(async resolve => {
      let tempCheckData = await self.tableDataService.checkTableData("getOPForDNPCreation", orderPositionsData,
        checkAllocation);
      if (tempCheckData && tempCheckData['result'] && tempCheckData['result']['success']) {
        resultAvailability = true;
        resultData = tempCheckData['result']['data'];
        partlyDeliveryDetected = tempCheckData['result']['partlyDeliveryDetected'];
      }
      resolve({
        availability: resultAvailability, data: resultData,
        partlyDeliveryDetected: partlyDeliveryDetected
      });
    });
  }

  /**
   * do create delivery note
   *
   * @param thisItem
   * @param primaryKey
   * @param primaryValue
   * @param userName
   * @param language
   * @param opForDNP
   * @param ordersNumber
   */
  async doCreateDeliveryNote(thisItem: string, primaryKey: string, primaryValue: string, userName: string,
                             language: string, opForDNP: {}, ordersNumber: string):
    Promise<{ result: boolean, message: string }> {
    let dbData: { message: { success: boolean, errorCode: string, newDeliveryNote: string, positions: string } } =
      await this.tableDataService.setDeliveryNote(thisItem, primaryKey, primaryValue, userName, language,
        opForDNP['data'], opForDNP['partlyDeliveryDetected']);
    if (dbData['message']) {
      if (dbData['message'].success && dbData['message'].errorCode && dbData['message'].newDeliveryNote &&
        dbData['message'].positions) {
        let messageDetails: string = this.translatePipe.transform('DELIVERY_NOTE_WAS_CREATED_DETAILS');
        messageDetails = messageDetails.replace('%s1', '"' + dbData['message'].newDeliveryNote + '"');
        messageDetails = messageDetails.replace('%s2', dbData['message'].positions);
        return {
          result: true,
          message: this.translatePipe.transform(dbData['message'].errorCode) + " " + messageDetails
        };
      } else {
        return {
          result: false, message: this.translatePipe.transform(dbData['message'].errorCode) + ' ' +
            this.translatePipe.transform('ORDERS_NUMBER') + ' "' + ordersNumber + '".'
        };
      }
    } else {
      return {result: false, message: 'ERROR_OCCURRED'};
    }
  }

  /*******************************************
   * DELIVERY NOTES FUNCTIONS - END
   ******************************************/

  /**
   * store last added item to localStorage
   *
   * @param tableName
   * @param columnName
   * @private
   */
  public async storeLastAddedItemToLS(tableName: string, columnName: string) {
    let idDbData: any | 0 = await this.tableDataService.getLastIdOfTable(tableName, columnName);
    if (idDbData && idDbData['id']) {
      switch (tableName) {
        case(this.CONSTANTS.REFTABLE_CUSTOMER_TITLE):
          localStorage.setItem(this.CONSTANTS.LS_SEL_CUSTOMERS_NUMBER, idDbData['id']);
          break;
        case(this.CONSTANTS.REFTABLE_ORDERS_TITLE):
          localStorage.setItem(this.CONSTANTS.LS_SEL_ORDERS_NUMBER, idDbData['id']);
          break;
        case(this.CONSTANTS.REFTABLE_DELIVERY_NOTES_TITLE):
          localStorage.setItem(this.CONSTANTS.LS_SEL_DLV_NOTES_NUMBER, idDbData['id']);
          break;
        case(this.CONSTANTS.REFTABLE_INVOICES_TITLE):
          localStorage.setItem(this.CONSTANTS.LS_SEL_INVOICE_NUMBER, idDbData['id']);
          break;
        default:
          break;
      }
    } else {
      console.log('ERROR: Last inserted ID was not found...');
    }
    return;
  }

  /**
   * create invoice manually - used at click on button 'Create invoice'
   *
   * @param refTable
   * @param selTableRow
   */
  async createInvoice(refTable: string, selTableRow: DeliveryNotes): Promise<{ result: boolean, message: string }> {
    let errorMessage: string = this.translatePipe.transform('FIELD_SHOULD_NOT_BE_EMPTY');
    let result: boolean = false;
    let message: string;
    let release: boolean = false;
    // where from user start action: orders ('/selectThisOrderAvise') or delivery notes ('/selectThisDeliveryNote')
    let thisItem: string = '/selectThisDeliveryNote';
    if (refTable === this.CONSTANTS.REFTABLE_DELIVERY_NOTES) {
      if (selTableRow && selTableRow['DELIVERY_NOTES_NUMBER']) {
        let primaryKey: string = this.CONSTANTS.REFTABLE_DELIVERY_NOTES_COLUMN;
        let primaryValue: string = selTableRow['DELIVERY_NOTES_NUMBER'];
        let secondaryKey: string = this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_COLUMN;
        let secondaryValue: string = selTableRow['ORDERS_NUMBER'];
        let userName: string = localStorage.getItem(this.CONSTANTS.LS_USERNAME);
        let language: string = localStorage.getItem(this.CONSTANTS.LS_LANGUAGE);
        // console.log('selTableRow: ', selTableRow);
        release = selTableRow['RELEASE'];
        if (release) {
          let deliveryNotePositionsDbData: { table: [any[string], any[]], maxRows: number, page: number } =
            await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS,
              ViewQueryTypes.DETAIL_TABLE, 'DELIVERY_NOTES_NUMBER', selTableRow['DELIVERY_NOTES_NUMBER']);
          if (!deliveryNotePositionsDbData) {
            message = 'save delivery note: Get delivery note positions - ' +
              errorMessage.replace('%s', this.translatePipe.transform('DELIVERY_NOTES_NUMBER'));
            return {result, message};
          }
          let deliveryNotePositions = deliveryNotePositionsDbData['table'][1];
          if (deliveryNotePositions) {
            // get all invoice positions for this delivery note number
            let invPositionsDbData: { table: [any[string], any[]], maxRows: number, page: number } =
              await this.tableDataService.getTableDataById(
                this.CONSTANTS.REFTABLE_INVOICE_POSITIONS, ViewQueryTypes.DETAIL_TABLE,
                'DELIVERY_NOTES_NUMBER', selTableRow['DELIVERY_NOTES_NUMBER']);
            // check if returned data is not undefined
            if (!invPositionsDbData) {
              message = 'save delivery note: Get invoice positions - ' +
                errorMessage.replace('%s', this.translatePipe.transform('DELIVERY_NOTES_NUMBER'));
              return {result, message};
            }
            let invPositions = invPositionsDbData['table'][1];
            // go through order positions and
            // search for positions that are suitable for generation of invoice
            let positionsForInvoiceCreation = [];
            let qtyError: boolean = false;
            for (let dnpItem in deliveryNotePositions) {
              if (!invPositions ||
                !this.positionsService.checkPositionIsInInvp(invPositions, deliveryNotePositions[dnpItem])) {
                if (deliveryNotePositions[dnpItem].DELIVERY_QTY === deliveryNotePositions[dnpItem].ORDER_QTY) {
                  // OK, for this position a invoice can be generated
                  positionsForInvoiceCreation.push(deliveryNotePositions[dnpItem]);
                } else {
                  // WRONG, for this position can't be generated delivery note
                  console.log('This position has different QTY numbers : ', deliveryNotePositions[dnpItem]);
                  qtyError = true;
                }
              } else {
                console.log('Delivery note position is already available in invoices... ID: ' +
                  deliveryNotePositions[dnpItem].ID + ' - ITMNUM: ' + deliveryNotePositions[dnpItem].ITMNUM);
              }
            }
            // console.log('positionsForInvoiceCreation: ', positionsForInvoiceCreation);
            if (Object.keys(positionsForInvoiceCreation).length > 0) {
              const data: {
                thisItem: string, primaryKey: string, primaryValue: string, secondaryKey: string,
                secondaryValue: string, userName: string, language: string, partlyDelivery: boolean
              } = {
                thisItem: thisItem, primaryKey: primaryKey, primaryValue: primaryValue, secondaryKey: secondaryKey,
                secondaryValue: secondaryValue, userName: userName, language: language,
                partlyDelivery: selTableRow['partlyDelivery']
              };
              let dbData: { message: { success: boolean, errorCode: string, newInvoice: string, positions: string } } =
                await this.tableDataService.setInvoice(data);
              // console.log('dbData: ', dbData);
              if (dbData['message'] && dbData['message'].success && dbData['message'].errorCode &&
                dbData['message'].newInvoice && dbData['message'].positions) {
                let messageDetails: string =
                  this.translatePipe.transform('INVOICE_WAS_CREATED_DETAILS');
                messageDetails = messageDetails.replace('%s1', '"' +
                  dbData['message'].newInvoice + '"');
                messageDetails = messageDetails.replace('%s2', dbData['message'].positions);
                message = this.translatePipe.transform(dbData['message'].errorCode) + " - " + messageDetails;
                result = true;
                return {result, message};
              } else {
                return {
                  result: false,  // false, because the message should be shown as error
                  message: this.translatePipe.transform(dbData['message'].errorCode) + ' ' +
                    this.translatePipe.transform('DELIVERY_NOTES_NUMBER') + ' "' + primaryValue + '".'
                };
              }
            } else {
              message = (qtyError) ? this.translatePipe.transform('DELIVERY_NOTE_DELIVERY_QTY_UNEQUAL') :
                'No order positions found for invoice creation... ' +
                'For ' + this.translatePipe.transform('DELIVERY_NOTES_NUMBER') +
                ' "' + selTableRow['DELIVERY_NOTES_NUMBER'] + '"';
              result = false; // false, because the message should be shown as error
              return {result, message};
            }
          } else {
            result = true; // true, because the message should be shown as info
            message = this.translatePipe.transform('No order positions to update found for ' +
              this.translatePipe.transform('DELIVERY_NOTES_NUMBER') + ' "' + selTableRow['DELIVERY_NOTES_NUMBER'] + '"');
            return {result, message};
          }
        } else {
          result = true;
          message = this.translatePipe.transform('DELIVERY_NOTE_IS_NOT_RELEASED');
        }
      } else {
        message = 'selTableRow is empty...';
      }
    } else {
      message = 'WRONG refTable...';
    }
    // console.log(message);
    return {result, message};
  }

  /*******************************************
   * COMMENTED OUT FUNCTIONS - START
   ******************************************/

  /**
   * save function - for all detail-view-tab-group views: CUSTOMERS, CUSTOMERS_ADDRESSES, ORDERS, DELIVERY_NOTES, INVOICES
   *
   * @param saveData
   */
  // public async save(saveData: { refTable: string, formValues: {}, newItemMode: boolean, primaryKey: string|undefined,
  //   primaryValue: string|undefined, postFormValues: {} }): Promise<{ result: boolean, message: string }> {
  //   const __retFV = this.prepareFormValuesNew(saveData);
  //   saveData.postFormValues = __retFV.postFormValues;
  //   saveData.primaryKey = __retFV.primaryKey;
  //   saveData.primaryValue = __retFV.primaryValue;
  //   let saveResult: {result: boolean, message: string} = await this.saveDataToTable({
  //     refTable: saveData.refTable, postFormValues: saveData.postFormValues, newItemMode: saveData.newItemMode,
  //     primaryKey: saveData.primaryKey, primaryValue: saveData.primaryValue
  //   });
  //   return {result: saveResult.result, message: saveResult.message};
  // }

  /**
   * save customer details
   * B2C - CONSTANTS.REFTABLE_CUSTOMER
   * B2B - CONSTANTS.REFTABLE_PARTNERS
   *
   * @param refTable
   * @param newItemMode
   * @param formValues
   * @param primaryValue
   * @param primaryKey
   * @param selItemNumber
   * @private
   */
  // public async saveCustomerDetails(refTable: string, newItemMode: boolean, formValues: {}, primaryValue: string,
  //                                  primaryKey: string, selItemNumber: string):
  // Promise<{result: boolean, message: string}> {
  //   // post form data to server - convert form keys to db keys
  //   const __ret = this.prepareFormValues(newItemMode, formValues, primaryKey, primaryValue);
  //   let postFormValues: {} = __ret.postFormValues;
  //   primaryValue = (!newItemMode) ? selItemNumber : primaryValue;
  //   let saveResult: {result: boolean, message: string} = await this.saveDataToTable(refTable, newItemMode,
  //     postFormValues, primaryKey, primaryValue);
  //   return {result: saveResult.result, message: saveResult.message};
  // }

  // /**
  //  * save customer details
  //  * B2C - CONSTANTS.REFTABLE_CUSTOMER
  //  * B2B - CONSTANTS.REFTABLE_PARTNERS
  //  *
  //  * @param saveData
  //  * @private
  //  */
  // // public async saveCustomerDetails(refTable: string, newItemMode: boolean, formValues: {}, primaryValue: string,
  // //                                  primaryKey: string, selItemNumber: string):
  // public async saveCustomerDetailsNew(saveData: { refTable: string, formValues: {}, newItemMode: boolean,
  //   primaryKey: string, primaryValue: string, postFormValues: {} }): Promise<{ result: boolean, message: string }> {
  //
  //   /*
  //          let saveParameter: {} = {
  //           refTable: this.refTable,
  //           newItemMode: this.newCustomerMode,
  //           formValues: formValues,
  //           primaryKey: self.CONSTANTS.REFTABLE_CUSTOMER_COLUMN,
  //           primaryValue: selItemNumber
  //         };
  //    */
  //
  //   // post form data to server - convert form keys to db keys
  //   const __ret = this.prepareFormValuesNew(saveData);
  //   // let postFormValues: {} = __ret.postFormValues;
  //   saveData.postFormValues = this.prepareFormValuesNew(saveData).postFormValues;
  //     //= __ret.postFormValues;
  //   // saveData.primaryValue = (!saveData.newItemMode) ? saveData.primaryValue : saveData.primaryValue;
  //   // refTable, newItemMode, postFormValues, primaryKey, primaryValue
  //   let saveResult: {result: boolean, message: string} = await this.saveDataToTableNew({
  //     refTable: saveData.refTable, postFormValues: saveData.postFormValues, newItemMode: saveData.newItemMode,
  //     primaryKey: saveData.primaryKey, primaryValue: saveData.primaryValue
  //   });
  //   return {result: saveResult.result, message: saveResult.message};
  // }

  /**
   * save customer address for delivery (dlv)
   *
   * @param refTable
   * @param newItemMode
   * @param formValues
   * @param primaryKey
   * @param primaryValue
   */
  // public async saveCustomerAddressDlv(refTable: string, newItemMode: boolean, formValues: {}, primaryKey: string,
  //                                     primaryValue: string):
  //   Promise<{result: boolean, message: string}> {
  //   const __ret = this.prepareFormValues(newItemMode, formValues, primaryKey, primaryValue);
  //   let postFormValues: {} = __ret.postFormValues;
  //   primaryKey = __ret.primaryKey;
  //   primaryValue = __ret.primaryValue;
  //   let saveResult: {result: boolean, message: string} = await this.saveDataToTable(refTable, newItemMode,
  //     postFormValues, primaryKey, primaryValue);
  //   return {result: saveResult.result, message: saveResult.message};
  // }

  /**
   * save customer address for invoice (inv)
   *
   * @param refTable
   * @param newItemMode
   * @param formValues
   * @param primaryKey
   * @param primaryValue
   */
  // public async saveCustomerAddressInv(refTable: string, newItemMode: boolean, formValues: {}, primaryKey: string,
  //                                     primaryValue: string):
  //   Promise<{result: boolean, message: string}> {
  //   const __ret = this.prepareFormValues(newItemMode, formValues, primaryKey, primaryValue);
  //   let postFormValues: {}  = __ret.postFormValues;
  //   primaryKey = __ret.primaryKey;
  //   primaryValue = __ret.primaryValue;
  //   let saveResult: {result: boolean, message: string} = await this.saveDataToTable(refTable, newItemMode,
  //     postFormValues, primaryKey, primaryValue);
  //   return {result: saveResult.result, message: saveResult.message};
  // }

  /**
   * save order details
   *
   * @param refTable
   * @param newItemMode
   * @param formValues
   * @param primaryKey
   * @param primaryValue
   * @param userName
   * @param language
   * @param ordersNumber
   * @param selCustomerRow
   */
  // public async saveOrderDetails(refTable: string, newItemMode: boolean, formValues: {}, primaryKey: string,
  //                               primaryValue: string, userName: string, language: string,
  //                               ordersNumber: string, selCustomerRow: {}):
  //   Promise<{result: boolean, message: string}> {
  //   const __ret = this.prepareFormValues(newItemMode, formValues, primaryKey, primaryValue);
  //   let postFormValues: {} = __ret.postFormValues;
  //   let release: boolean = __ret.release;
  //   let result: boolean = false;
  //   let message: string = "Save order error.";
  //   if (newItemMode) {
  //     let checkResult: { exists: boolean, type: boolean } = await this.formService.checkCustomerNumber(
  //       postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN],
  //       postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CLIENT_COLUMN]);
  //     if (checkResult['exists'] && checkResult['type']) {
  //       let saveResult: {result: boolean, message: string} = await this.saveOrderDetailsLogic(newItemMode, refTable,
  //         postFormValues, primaryKey, primaryValue, release, userName, language, ordersNumber);
  //       result = saveResult.result;
  //       message = saveResult.message;
  //     } else {
  //       if (!checkResult['exists']) {
  //         message = 'Customer number ' + postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN] + ' not found!';
  //       } else if (!checkResult['type']) {
  //         message = 'Customer type is wrong. Selected client type is: ' +
  //           postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CLIENT_COLUMN];
  //       }
  //     }
  //   } else {
  //     if (selCustomerRow && ordersNumber) {
  //       // get all order positions
  //       let orderPositionsDbData: {} = await this.tableDataService.getTableDataByIdPromise(
  //         this.CONSTANTS.REFTABLE_ORDERS_POSITIONS, this.CONSTANTS.REFTABLE_ORDERS_COLUMN, ordersNumber);
  //       if (!orderPositionsDbData) {
  //         message = 'Get orders positions - ' + this.translatePipe.transform('FIELD_SHOULD_NOT_BE_EMPTY')
  //             .replace('%s', this.translatePipe.transform(this.CONSTANTS.REFTABLE_ORDERS_COLUMN));
  //       } else {
  //         let orderPositions = orderPositionsDbData['table'][1];
  //         if (orderPositions) {
  //           // Check for warehouse: only if there are no positions, a warehouse can be changed
  //           if (orderPositions.length === 0 || (selCustomerRow['WAREHOUSE'] === postFormValues['WAREHOUSE'])) {
  //             // if order is/should be released, then check first if all positions have POSITION_STATE 3
  //             if (release) {
  //               let foundWrongQTY: boolean = false;
  //               for (let opItem in orderPositions) {
  //                 if (orderPositions.hasOwnProperty(opItem)) {
  //                   if (orderPositions[opItem].ASSIGNED_QTY !== orderPositions[opItem].ORDER_QTY) {
  //                     foundWrongQTY = true;
  //                     release = false;
  //                     break;
  //                   }
  //                 }
  //               }
  //               if (foundWrongQTY) {
  //                 message = this.translatePipe.transform('ORDER_POSITION_ASSIGNED_QTY_UNEQUAL');
  //                 result = false;
  //               } else {
  //                 let saveResult: { result: boolean, message: string } = await this.saveOrderDetailsLogic(newItemMode,
  //                   refTable, postFormValues, primaryKey, primaryValue, release, userName, language, ordersNumber);
  //                 result = saveResult.result;
  //                 message = saveResult.message;
  //               }
  //             } else {
  //               let saveResult: { result: boolean, message: string } = await this.saveOrderDetailsLogic(newItemMode,
  //                 refTable, postFormValues, primaryKey, primaryValue, release, userName, language, ordersNumber);
  //               result = saveResult.result;
  //               message = saveResult.message;
  //             }
  //           } else {
  //             message = this.translatePipe.transform('ORDER_WAREHOUSE_CHANGE_ERROR')
  //               .replace('%s', ('"' + selCustomerRow['WAREHOUSE'] + '"'));
  //           }
  //         } else {
  //           message = 'No order positions to update found for ORDERS_NUMBER "' + ordersNumber + '"!';
  //         }
  //       }
  //     } else {
  //       message = this.translatePipe.transform('NO_ORDER_FOUND') + ' ' +
  //         this.translatePipe.transform(this.CONSTANTS.REFTABLE_ORDERS_COLUMN) + ' "' + ordersNumber + '".';
  //     }
  //   }
  //   return {result: result, message: message};
  // }

  /**
   * save delivery note details
   *
   * @param refTable
   * @param newItemMode
   * @param formValues
   * @param primaryValue
   * @param primaryKey
   * @param customerNumber
   * @param userName
   * @param language
   * @param selCustomerRow
   */
  //   public async saveDeliveryNoteDetails(refTable: string, newItemMode: boolean, formValues: {}, primaryValue: string,
  //                                        primaryKey: string, customerNumber: string, userName: string, language: string,
  //                                        selCustomerRow: {}):
  //   Promise<{result: boolean, message: string}> {
  //   console.log('SAVE delivery notes');
  //   const __ret = this.prepareFormValues(newItemMode, formValues, primaryKey, primaryValue);
  //   let postFormValues: {} = __ret.postFormValues;
  //   let dnRelease = __ret.release;
  //   let dnThisItem = '/selectThisDeliveryNote';
  //   let dnDelNotesNumber = selCustomerRow['DELIVERY_NOTES_NUMBER'];
  //   let dnCurrency = selCustomerRow['CURRENCY'];
  //   let message: string = "";
  //   let result: boolean = false;
  //   if (!newItemMode) {
  //     primaryValue = selCustomerRow['ORDERS_NUMBER'];
  //   }
  //   primaryKey = this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_COLUMN;
  //   customerNumber = selCustomerRow['CUSTOMERS_NUMBER'];
  //   // if delivery note is/should be released,
  //   // then check first if at all positions field DELIVERY_QTY <= ORDER_QTY.
  //   if (dnRelease) {
  //     let dnPositionsDbData: {} = await this.tableDataService.getTableDataByIdPromise(
  //       this.CONSTANTS.REFTABLE_DELIVERY_NOTES_POSITIONS, this.CONSTANTS.REFTABLE_DELIVERY_NOTES_COLUMN,
  //       selCustomerRow['DELIVERY_NOTES_NUMBER']);
  //     if (!dnPositionsDbData) {
  //       message = 'save delivery note positions : ' + this.translatePipe.transform('FIELD_SHOULD_NOT_BE_EMPTY')
  //           .replace('%s', this.translatePipe.transform('DELIVERY_NOTES_NUMBER'));
  //     }
  //     let deliveryNotePositions = dnPositionsDbData['table'][1];
  //     if (deliveryNotePositions) {
  //       // check if qty numbers are ok
  //       let foundWrongDeliveryQTY: boolean = false;
  //       for (let dpItem in deliveryNotePositions) {
  //         if (deliveryNotePositions.hasOwnProperty(dpItem)) {
  //           if (deliveryNotePositions[dpItem].CATEGORY_SOAS !== this.CONSTANTS.CATEGORY_SOAS_KOMP) {
  //             if ((deliveryNotePositions[dpItem].DELIVERY_QTY === 0) ||
  //               (deliveryNotePositions[dpItem].ORDER_QTY === 0) ||
  //               (deliveryNotePositions[dpItem].DELIVERY_QTY > deliveryNotePositions[dpItem].ORDER_QTY)) {
  //               foundWrongDeliveryQTY = true;
  //               dnRelease = false;
  //               break;
  //             }
  //           }
  //         }
  //       }
  //       if (foundWrongDeliveryQTY) {
  //         message = this.translatePipe.transform('DELIVERY_NOTE_DELIVERY_QTY_UNEQUAL');
  //       } else {
  //         let saveResult: {result: boolean, message: string} = await this.saveDeliveryNoteLogic(refTable, newItemMode,
  //           postFormValues, primaryKey, primaryValue, dnThisItem, dnDelNotesNumber, customerNumber, userName, language,
  //           dnCurrency, formValues, dnRelease);
  //         result = saveResult.result;
  //         message = saveResult.message;
  //       }
  //     } else {
  //       message = this.translatePipe.transform('NO_POSITION_FOR_DELIVERY_NOTE_CREATION');
  //     }
  //   } else {
  //     let saveResult: {result: boolean, message: string} = await this.saveDeliveryNoteLogic(refTable, newItemMode,
  //       postFormValues, primaryKey, primaryValue, dnThisItem, dnDelNotesNumber, customerNumber, userName, language,
  //       dnCurrency, formValues, dnRelease);
  //     result = saveResult.result;
  //     message = saveResult.message;
  //   }
  //   return {result, message};
  // }


  /**
   * save invoice details
   *
   * @param refTable
   * @param newItemMode
   * @param primaryKey
   * @param primaryValue
   * @param formValues
   * @param userName
   * @param selCustomerRow
   */
  // public async saveInvoiceDetails(refTable: string, newItemMode: boolean, primaryKey: string, primaryValue: string,
  //                                 formValues: {}, userName: string, selCustomerRow: {}):
  //   Promise<{result: boolean, message: string}> {
  //   console.log('SAVE invoice - ', refTable);
  //   primaryKey = this.CONSTANTS.REFTABLE_INVOICE_COLUMN;
  //   primaryValue = selCustomerRow['INVOICES_NUMBER'];
  //   let invoiceState: number | undefined = undefined;
  //   let payed: boolean | undefined = undefined;
  //   let dNNumber: string | undefined = undefined;
  //   let result: boolean = false;
  //   let message: string = "";
  //   let postFormValues: {} = {};
  //   for (let property in formValues) {
  //     if (formValues.hasOwnProperty(property)) {
  //       if (property.toUpperCase() !== 'INVOICES_NUMBER' && property.toUpperCase() !== 'INVOICES_CUSTOMER'
  //         && property.toUpperCase() !== 'INVOICES_DATE' && property.toUpperCase() !== 'INVOICES_CREATOR'
  //         && property.toUpperCase() !== 'PDF_CREATED_DATE' && property.toUpperCase() !== 'PDF_DOWNLOAD_LINK') {
  //         //  && property.toUpperCase() !== 'INVOICES_STATE'
  //         if (property.toUpperCase() === 'INVOICES_STATE') {
  //           invoiceState = parseInt(formValues[property]);
  //         } else if (property.toUpperCase() === 'PAYED') {
  //           payed = formValues[property];
  //         } else if (property.toUpperCase() === 'DELIVERY_NOTES_NUMBER') {
  //           dNNumber = formValues[property];
  //         }
  //         if (property.toUpperCase() === 'INVOICES_UPDATE') {
  //           postFormValues[property.toUpperCase()] = userName;
  //         } else {
  //           postFormValues[property.toUpperCase()] = formValues[property];
  //         }
  //       }
  //     }
  //   }
  //   // update invoice state or payed flag
  //   if ((invoiceState && (invoiceState === this.CONSTANTS.INV_STATES_COMPLETED)) && payed === false) {
  //     payed = true;
  //     postFormValues['PAYED'] = payed;
  //   } else if ((invoiceState && (invoiceState < this.CONSTANTS.INV_STATES_COMPLETED)) && payed === true) {
  //     invoiceState = this.CONSTANTS.INV_STATES_COMPLETED;
  //     postFormValues['INVOICES_STATE'] = invoiceState;
  //   }
  //   let dbData: {} = await this.tableDataService.setTableDataPromise(refTable, postFormValues, primaryKey, primaryValue,
  //     false, undefined, undefined);
  //   if (dbData && dbData['result'] && dbData['result']['error']) {
  //     message = dbData['result']['error'];
  //     result = false;
  //   } else {
  //     // if state is payed, check if order is finished, if not, set it as finished
  //     if ((invoiceState && (invoiceState === this.CONSTANTS.INV_STATES_COMPLETED)) || payed === true) {
  //       let dataArray = {};
  //       dataArray['PAYED'] = (payed) ? payed : dataArray['PAYED'];
  //       // check if Delivery Note has state "70", otherwise don't set order as completed...
  //       if (dNNumber !== undefined) {
  //         let dbData: {} = await this.tableDataService.getTableDataByIdPromise(this.CONSTANTS.REFTABLE_DELIVERY_NOTES,
  //           this.CONSTANTS.REFTABLE_DELIVERY_NOTES_COLUMN, dNNumber);
  //         if (!dbData) {
  //           message = this.translatePipe.transform('SAVEDFAILED');
  //         } else {
  //           if (dbData['table'][1][0]['DELIVERY_NOTES_STATE'] === this.CONSTANTS.DLV_STATES_DELIVERED) {
  //             dataArray['ORDERS_STATE'] = this.CONSTANTS.ORDER_STATES_COMPLETED;
  //           }
  //           message = this.translatePipe.transform('SAVEDSUCCESS');
  //           let saveResult: { result: boolean, message: string } = await this.saveDataToTable(refTable, newItemMode,
  //             postFormValues, primaryKey, primaryValue);
  //           result = saveResult.result;
  //           message = saveResult.message;
  //         }
  //       }
  //     } else {
  //       message = this.translatePipe.transform('SAVEDSUCCESS');
  //       result = true;
  //     }
  //   }
  //   return {result, message};
  // }

  /**
   * prepare form values
   *
   * @param formValues
   * @param newItemMode
   * @param primaryKey
   * @param primaryValue
   * @private
   */
  // private prepareFormValues(newItemMode: boolean, formValues: {}, primaryKey: string, primaryValue: string) {
  //   let release: boolean = false;
  //   let postFormValues: {} = {};
  //   for (let property in formValues) {
  //     if (formValues.hasOwnProperty(property)) {
  //       let upperCaseProperty: string = property.toUpperCase();
  //       // ignore ID for saving
  //       if (upperCaseProperty === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_ID) {
  //         if (!newItemMode) {
  //           primaryKey = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_ID;
  //           primaryValue = formValues[property];
  //         }
  //       } else if (upperCaseProperty === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV_ID) {
  //         // ToDo: Possible refactoring with above if condition
  //         if (!newItemMode) {
  //           primaryKey = this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV_ID;
  //           primaryValue = formValues[property];
  //         }
  //       } else if (upperCaseProperty === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_ADDRESS_COMMENT_COLUMN &&
  //         (formValues[property] === 'null' || formValues[property] === null)) {
  //         postFormValues[upperCaseProperty] = '';
  //       } else if (upperCaseProperty === this.CONSTANTS.REFTABLE_ORDERS_CUSTOMER_ORDERREF_COLUMN) {
  //         // extract customer number from form field 'CUSTOMER_ORDERREF' (in: 50020CUS00012345 => out: 00012345)
  //         let pFValCustomerOrder: string = postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN];
  //         if (pFValCustomerOrder && pFValCustomerOrder.toUpperCase().includes(this.CONSTANTS.CUSTOMER_TYPE_ID)) {
  //           postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CUSTOMER_ORDERREF_COLUMN] =
  //             pFValCustomerOrder.substring(this.CONSTANTS.CUSTOMER_PREFIX_EXAMPLE.length, pFValCustomerOrder.length);
  //         } else {
  //           postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CUSTOMER_ORDERREF_COLUMN] = pFValCustomerOrder;
  //         }
  //       } else {
  //         // store release flag, used for orders, delivery notes and invoices
  //         if (upperCaseProperty === this.CONSTANTS.REFTABLE_ORDERS_RELEASE_COLUMN) {
  //           release = formValues[property];
  //         }
  //         postFormValues[upperCaseProperty] = formValues[property];
  //       }
  //     }
  //   }
  //   return {postFormValues, primaryKey, primaryValue, release};
  // }

  /**
   * prepare form values - convert form keys to db keys
   *
   * @private
   * @param saveData
   */
  // private prepareFormValuesNew(saveData: { refTable: string, formValues: {}, newItemMode: boolean, primaryKey: string,
  //   primaryValue: string }) {
  //   let __retSPK = this.getSavePrimaryKey(saveData.refTable);
  //   saveData.primaryKey = __retSPK.primaryKey;
  //   saveData.refTable = __retSPK.tableName;
  //   let release: boolean = false;
  //   let postFormValues: {} = {};
  //   for (let property in saveData.formValues) {
  //     if (saveData.formValues.hasOwnProperty(property)) {
  //       let upperCaseProperty: string = property.toUpperCase();
  //       if (upperCaseProperty === saveData.primaryKey) {
  //         // ignore primary keys (ID) for saving and set primary value
  //         saveData.primaryValue = saveData.formValues[property];
  //         if (saveData.newItemMode) { // for new item, add primary key to values
  //           postFormValues[upperCaseProperty] = saveData.formValues[property];
  //         }
  //       } else if (this.fieldNamesToIgnore.indexOf(upperCaseProperty) != -1) {
  //       } else if (upperCaseProperty === this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_ADDRESS_COMMENT_COLUMN &&
  //         (saveData.formValues[property] === 'null' || saveData.formValues[property] === null)) {
  //         postFormValues[upperCaseProperty] = '';
  //       } else if (upperCaseProperty === this.CONSTANTS.REFTABLE_ORDERS_CUSTOMER_ORDERREF_COLUMN) {
  //         // extract customer number from form field 'CUSTOMER_ORDERREF' (in: 50020CUS00012345 => out: 00012345)
  //         let pFValCustomerOrder: string = postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN];
  //         if (pFValCustomerOrder && pFValCustomerOrder.toUpperCase().includes(this.CONSTANTS.CUSTOMER_TYPE_ID)) {
  //           postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CUSTOMER_ORDERREF_COLUMN] =
  //             pFValCustomerOrder.substring(this.CONSTANTS.CUSTOMER_PREFIX_EXAMPLE.length, pFValCustomerOrder.length);
  //         } else {
  //           postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CUSTOMER_ORDERREF_COLUMN] = pFValCustomerOrder;
  //         }
  //       } else {
  //         // store release flag, used for orders, delivery notes and invoices
  //         if (upperCaseProperty === this.CONSTANTS.REFTABLE_ORDERS_RELEASE_COLUMN) {
  //           release = saveData.formValues[property];
  //         }
  //         postFormValues[upperCaseProperty] = saveData.formValues[property];
  //       }
  //     }
  //   }
  //   return {postFormValues, primaryKey: saveData.primaryKey, primaryValue: saveData.primaryValue, release};
  // }

  /**
   * save data to db table
   *
   * @param refTable
   * @param newItemMode
   * @param postFormValues
   * @param primaryKey
   * @param primaryValue
   * @private
   */
  // private async saveDataToTable(refTable: string, newItemMode: boolean, postFormValues: {}, primaryKey: string,
  //                               primaryValue: string):
  //   Promise<{result: boolean, message: string}> {
  //   let result: boolean = false;
  //   let message: string;
  //   let dbData: {} = await this.tableDataService.setTableDataPromise(refTable, postFormValues,
  //     primaryKey, primaryValue, newItemMode, undefined, undefined);
  //   if (dbData && dbData['result'] && dbData['result']['error']) {
  //     message = dbData['result']['error'];
  //   } else {
  //     if ((refTable === this.CONSTANTS.REFTABLE_CUSTOMER) && newItemMode) {
  //       await this.storeLastAddedItemToLS(this.CONSTANTS.REFTABLE_CUSTOMER_TITLE,
  //         this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN);
  //     }
  //     message = this.translatePipe.transform('SAVEDSUCCESS');
  //     result = true;
  //   }
  //   return {result, message};
  // }

  /**
   * save data to db table
   *
   * @private
   * @param saveData
   */
  // private async saveDataToTable(saveData: {refTable: string, newItemMode: boolean, postFormValues: {},
  //   primaryKey: string, primaryValue: string}): Promise<{result: boolean, message: string}> {
  //   let result: boolean = false;
  //   let message: string;
  //   let dbData: {} = await this.tableDataService.setTableDataPromise({refTable: saveData.refTable,
  //     dataArray: saveData.postFormValues, primaryKey: saveData.primaryKey, primaryValue: saveData.primaryValue,
  //     newItemMode: saveData.newItemMode, secondaryKey: undefined, secondaryValue: undefined});
  //   if (dbData && dbData['result'] && dbData['result']['error']) {
  //     message = dbData['result']['error'];
  //   } else {
  //     if ((saveData.refTable === this.CONSTANTS.REFTABLE_CUSTOMER) && saveData.newItemMode) {
  //       await this.storeLastAddedItemToLS(this.CONSTANTS.REFTABLE_CUSTOMER_TITLE, this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN);
  //     }
  //     message = this.translatePipe.transform('SAVEDSUCCESS');
  //     result = true;
  //   }
  //   return {result, message};
  // }

  /**
   * Save order details logic
   *
   * @param newItemMode
   * @param refTable
   * @param postFormValues
   * @param primaryKey
   * @param primaryValue
   * @param release
   * @param userName
   * @param language
   * @param ordersNumber
   */
  // private async saveOrderDetailsLogic(newItemMode: boolean, refTable: string, postFormValues: {}, primaryKey: string,
  //                                     primaryValue: string, release: boolean, userName: string, language: string,
  //                                     ordersNumber: string): Promise<{result: boolean, message: string}>  {
  //   let result: boolean = false;
  //   let message: string = "Save order logic error.";
  //   postFormValues = this.setOrderPostFormValues(newItemMode, postFormValues, release);
  //   primaryKey = this.CONSTANTS.REFTABLE_ORDERS_POSITIONS_COLUMN;
  //   /** Validate CUSTOMERS_NUMBER **/
  //   let validateRefTable = this.CONSTANTS.REFTABLE_CUSTOMER;
  //   if (postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CLIENT_COLUMN] &&
  //     (postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CLIENT_COLUMN] === this.CONSTANTS.CLIENT_B2B)) {
  //     validateRefTable = this.CONSTANTS.REFTABLE_PARTNERS;
  //   }
  //   let validateFieldName = this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN;
  //   let validateFieldValue = postFormValues[this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN];
  //   let dbData: {} = await this.tableDataService.getTableDataByIdPromise(validateRefTable, validateFieldName,
  //     validateFieldValue);
  //   if (!dbData) {
  //     message = validateRefTable + ' is empty ?';
  //   } else {
  //     let tableData: {} = dbData['table'];
  //     if (tableData && tableData[1] && (tableData[1].length > 0) && (Object.keys(tableData[1][0]).length > 0)) {
  //       if (newItemMode) {
  //         let dbData: {} = await this.tableDataService.setTableDataPromise(refTable, postFormValues, primaryKey,
  //           primaryValue, newItemMode, undefined, undefined);
  //         if (dbData['success']) {
  //           await this.storeLastAddedItemToLS(this.CONSTANTS.REFTABLE_ORDERS_TITLE, this.CONSTANTS.REFTABLE_ORDERS_COLUMN);
  //           message = this.translatePipe.transform('SAVEDSUCCESS');
  //           result = true;
  //         } else {
  //           message = dbData['error'];
  //         }
  //       } else {
  //         primaryValue = ordersNumber;
  //         let saveResult: {result: boolean, message: string} = await this.saveDataToTable(refTable, newItemMode,
  //           postFormValues, primaryKey, primaryValue);
  //         message = saveResult.message;
  //         result = saveResult.result;
  //       }
  //     } else {
  //       // let description = this.translatePipe.transform(validateFieldName) + ' : ' + validateFieldValue;
  //       message = this.translatePipe.transform(validateFieldName) + ' : ' + validateFieldValue +
  //         ' is NOT available in ' + validateRefTable;
  //     }
  //   }
  //   return {result, message};
  // }

  /**
   * set order post form values
   *
   * @param newItemMode
   * @param postFormValues
   * @param release
   * @private
   */
  // ToDo: Refactor to have this values already set in formly form
  // private setOrderPostFormValues(newItemMode: boolean, postFormValues: {}, release: boolean): {} {
  //   if (newItemMode) {
  //     postFormValues["EDI_ORDERRESPONSE_SENT"] = false;
  //     postFormValues["CUSTOMER_ADDRESSES_ID_DELIVERY"] = "0";
  //     postFormValues["CUSTOMER_ADDRESSES_ID_INVOICE"] = "0";
  //     postFormValues["LAST_DELIVERY"] = "";
  //     postFormValues["LAST_INVOICE"] = "";
  //   } else {
  //     // except orders number from update
  //     delete postFormValues["ORDERS_NUMBER"];
  //
  //     // save to db not 'null' => '0'
  //     if (!postFormValues["CUSTOMER_ADDRESSES_ID_DELIVERY"]) {
  //       postFormValues["CUSTOMER_ADDRESSES_ID_DELIVERY"] = "0";
  //     }
  //     if (!postFormValues["CUSTOMER_ADDRESSES_ID_INVOICE"]) {
  //       postFormValues["CUSTOMER_ADDRESSES_ID_INVOICE"] = "0";
  //     }
  //   }
  //   // // remove TAXATION field
  //   // if (postFormValues["TAXATION"]) {
  //   //   delete postFormValues["TAXATION"];
  //   // }
  //   // set WEBSHOP_ID field
  //   if (postFormValues["WEBSHOP_ID"] === null) {
  //     postFormValues["WEBSHOP_ID"] = "0";
  //   }
  //   if (postFormValues["WEBSHOP_ORDER_REF"] === null) {
  //     postFormValues["WEBSHOP_ORDER_REF"] = "";
  //   }
  //   if (postFormValues["DISCOUNT"] === null) {
  //     postFormValues["DISCOUNT"] = "0.0";
  //   }
  //   if (postFormValues["VOUCHER"] === null) {
  //     postFormValues["VOUCHER"] = "0.0";
  //   }
  //   if (postFormValues["SHIPPING_COSTS"] === null) {
  //     postFormValues["SHIPPING_COSTS"] = "0.0";
  //   }
  //   if (release && postFormValues["ORDERS_STATE"] === this.CONSTANTS.ORDER_STATES_OPEN) {
  //     // change order state to IN PROCESS, if release = true
  //     // ToDo: If released, change the state to ORDER_STATES_COMPLETED ???
  //     postFormValues["ORDERS_STATE"] = this.CONSTANTS.ORDER_STATES_IN_PROCESS;
  //   }
  //   return postFormValues;
  // }

  /**
   * Save delivery note logic
   *
   * @param refTable
   * @param newItemMode
   * @param postFormValues
   * @param primaryKey
   * @param primaryValue
   * @param dnSelfItem
   * @param dnDelNotesNumber
   * @param customerNumber
   * @param userName
   * @param language
   * @param dnCurrency
   * @param formValues
   * @param dnRelease
   */
  // private async saveDeliveryNoteLogic(refTable: string, newItemMode: boolean, postFormValues: {}, primaryKey: string,
  //                                     primaryValue: string, dnSelfItem: string, dnDelNotesNumber: string,
  //                                     customerNumber: string, userName: string, language: string, dnCurrency: string,
  //                                     formValues: {}, dnRelease: boolean): Promise<{result: boolean, message: string}> {
  //   // state = 40: just update dn fields
  //   if (postFormValues['DELIVERY_NOTES_STATE'] === this.CONSTANTS.DLV_STATES_OPEN) {
  //     postFormValues = {};
  //     for (let property in formValues) {
  //       if (formValues.hasOwnProperty(property)) {
  //         if (property.toUpperCase() !== 'DELIVERY_NOTES_NUMBER' && property.toUpperCase() !== 'ORDERS_NUMBER'
  //           && property.toUpperCase() !== 'CUSTOMERS_NUMBER' && property.toUpperCase() !== 'PDF_CREATED_DATE'
  //           && property.toUpperCase() !== 'PDF_DOWNLOAD_LINK') {
  //           postFormValues[property.toUpperCase()] = formValues[property];
  //         }
  //       }
  //     }
  //     if (dnRelease) { // If not released, just save delivery note
  //       // if delivery note is released, set state to 50 (IN DELIVERY)
  //       postFormValues['DELIVERY_NOTES_STATE'] = this.CONSTANTS.DLV_STATES_IN_DELIVERY;
  //     }
  //     return await this.saveDataToTable(refTable, newItemMode, postFormValues, primaryKey, primaryValue);
  //   } else {
  //     this.formService.showErrorMessage('save delivery note: Not Saved - Release STATE is > 40 ');
  //   }
  // }

  /**
   * get save primary key and table name
   *
   * @param tabGroupName
   * @private
   */
  // private getSavePrimaryKey(tabGroupName: string) {
  //   switch(tabGroupName) {
  //     case(this.CONSTANTS.REFTABLE_CUSTOMER_CUS_TITLE) :
  //       return {tableName: this.CONSTANTS.REFTABLE_CUSTOMER, primaryKey: this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN};
  //     case(this.CONSTANTS.REFTABLE_PARTNERS) :
  //       return {tableName: this.CONSTANTS.REFTABLE_PARTNERS, primaryKey: this.CONSTANTS.REFTABLE_CUSTOMER_COLUMN};
  //     case(this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_TITLE) :
  //       return {tableName: this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV, primaryKey: this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_DLV_ID};
  //     case(this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV_TITLE) :
  //       return {tableName: this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV, primaryKey: this.CONSTANTS.REFTABLE_CUSTOMER_ADDRESS_INV_ID};
  //     case(this.CONSTANTS.REFTABLE_ORDERS_DETAILS_TITLE) :
  //       return {tableName: this.CONSTANTS.REFTABLE_ORDERS, primaryKey: this.CONSTANTS.REFTABLE_ORDERS_COLUMN};
  //     case(this.CONSTANTS.REFTABLE_DELIVERY_NOTE_DETAILS_TITLE) :
  //       return {tableName: this.CONSTANTS.REFTABLE_DELIVERY_NOTES, primaryKey: this.CONSTANTS.REFTABLE_DELIVERY_NOTES_COLUMN};
  //     case(this.CONSTANTS.REFTABLE_INVOICE_DETAILS_TITLE) :
  //       return {tableName: this.CONSTANTS.REFTABLE_INVOICE, primaryKey: this.CONSTANTS.REFTABLE_INVOICE_COLUMN};
  //     default:
  //       return {tableName: undefined, primaryKey: undefined};
  //   }
  // }

  /*******************************************
   * COMMENTED OUT FUNCTIONS - END
   ******************************************/
}
