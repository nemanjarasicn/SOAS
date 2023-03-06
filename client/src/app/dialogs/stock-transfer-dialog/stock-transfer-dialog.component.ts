import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {FileUploadDialogComponent} from "../file-upload-dialog/file-upload-dialog.component";
import {RxFormBuilder, RxFormGroup} from "@rxweb/reactive-form-validators";
import {Router} from "@angular/router";
import {NgForm, Validators} from "@angular/forms";
import {Warehousing} from "../../models/warehousing";
import {AutoComplete} from 'primeng/autocomplete';
import {TableDataService} from "../../_services/table-data.service";
import {HelperService} from "../../_services/helper.service";
import {ConstantsService} from "../../_services/constants.service";
import {InputNumber} from "primeng/inputnumber";
import { Console } from 'console';
import {MessagesService} from "../../_services/messages.service";

@Component({
  selector: 'app-stock-transfer-dialog',
  templateUrl: './stock-transfer-dialog.component.html',
  styleUrls: ['./stock-transfer-dialog.component.css'],
  providers: [TranslateItPipe]
})
export class StockTransferDialogComponent implements OnInit {

  readonly LOC_INPUT_MIN: number = 0;
  readonly LOC_INPUT_MAX: number = 907;

  refTable: string = "dialogStockTransfer"; //"warehousing";
  dialogTitle: string;
  form: RxFormGroup;

  @ViewChild('dlgAutocomplete', {static: false}) dlgAutocomplete: AutoComplete;
  @ViewChild('toLocAutocomplete', {static: false}) toLocAutocomplete: AutoComplete;
  @ViewChild('toQtyInput', {static: false}) toQtyInput: InputNumber;
  @ViewChild('stockTransferForm', {static: false}) stockTransferForm: NgForm;
  @ViewChild('saveButton', {static: false}) saveButton: ElementRef;

  description: ''; // form title
  submitted = false;
  editMode = false; // if true => edit user dialog; false => create user dialog
  fromModel: Warehousing;
  toModel: Warehousing;
  selectedFilterItmnumID: string;
  filterItmnums: string[];
  filterItmnumsWithID:object[];
  dividerChar = "#";
  formError: boolean;
  errorMessageIsShowing: boolean;

  toQtyInputDisabled: boolean;
  toQtyInputRequired: boolean;

  toLocInputDisabled: boolean;
  toLocInputRequired: boolean;
  toLocInputValid: boolean;

  toLocInputMin: number;
  toLocInputMax: number;
  toStoragePlaces: string[];

  constructor(
    private router: Router,
    public translatePipe: TranslateItPipe,
    private fb: RxFormBuilder,
    private tableDataService: TableDataService,
    public dialogRef: MatDialogRef<FileUploadDialogComponent>,
    private messagesService: MessagesService,
    private helperService: HelperService,
    public CONSTANTS: ConstantsService,
    @Inject(MAT_DIALOG_DATA) public data: string) {
    // this.dialogTitle = this.translatePipe.transform('STOCK_TRANSFER_TITLE')
    this.filterItmnums = [];
    this.selectedFilterItmnumID = "";
    this.filterItmnumsWithID = [];
    this.toStoragePlaces = [];
    this.formError = false;
    this.errorMessageIsShowing = false;
    this.toLocInputValid = false;
  }

  ngOnInit() {
    this.messagesService.setTranslatePipe(this.translatePipe);
    this.resetForm();
    this.initForm();
    setTimeout(() => {
      if (this.toLocAutocomplete && this.toLocAutocomplete.el && this.toLocAutocomplete.el.nativeElement &&
        this.toLocAutocomplete.el.nativeElement.search) {
        this.toLocAutocomplete.el.nativeElement.search = this.getToLocAutocompleteFunc();
      }
      if (this.dlgAutocomplete && this.dlgAutocomplete.el && this.dlgAutocomplete.el.nativeElement &&
        this.dlgAutocomplete.el.nativeElement.search) {
        this.dlgAutocomplete.el.nativeElement.search = this.getDlgAutocompleteFunc();
      }
    });
  }

  private getDlgAutocompleteFunc() {
    return () => {
      this.dlgAutocomplete.value = "";
      this.resetForm();
    };
  }

  private getToLocAutocompleteFunc() {
    return () => {
      this.toLocInputValid = false;
      this.toStoragePlaces = [];
      this.toLocAutocomplete.value = "";
    };
  }

  private initForm(): void {
    this.form = <RxFormGroup>this.fb.group({
      file: ['', Validators.required]
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  /**
   * on form submit
   */
  onSubmit() {
    // this.checkQty();
  }

  /**
   * check if qty is wrong
   *
   * @private
   */
  private checkQty() {
    let result: boolean = true;
    if (this.toModel.QTY > 0) {
      if (this.fromModel.QTY < this.toModel.QTY) {
        this.messagesService.showErrorMessage(this.translatePipe.transform('ERROR_TO_QTY_IS_GREATER_FROM_QTY'));
        this.toModel.QTY = this.fromModel.QTY;
        result = false;
      }
    } else {
      this.messagesService.showErrorMessage(this.translatePipe.transform('ERROR_TO_QTY_IS_ZERO'));
      result = false;
      // this.saveButton.nativeElement.disabled = true;
    }
    // if (!result) {
    //   if (!this.errorMessageIsShowing) {
    //     this.errorMessageIsShowing = true;
    //     setTimeout(() => {
    //       this.errorMessageIsShowing = false;
    //     }, 6000);
    //   }
    // }
    return result;
  }

  /**
   * filter itmnum - search function
   *
   * @param $event
   * @param fieldName
   */
  filterItmnum($event: any, fieldName?: string) {
    let query = $event.query;
    return this.filterItmnumLogic(query, fieldName, true);
  }

  /**
   * filter itmnum logic
   *
   * @param query
   * @param fieldName
   * @param pDialogMode
   * @private
   */
  private async filterItmnumLogic(query: string, fieldName: string, pDialogMode: boolean) {
    let error: boolean = false;
    if (query) {
      let refTableName: string = 'dialogStockTransfer';
      // let validateFieldName: string = 'ITMNUM'; // 'LOC';
      if (fieldName && pDialogMode) {
        return await this.getItmnumSuggestions(refTableName, fieldName, query.trim());
      } else {
        error = true;
      }
    } else {
      console.log('query is empty...');
      error = true;
    }
    if (error) {
      this.filterItmnums = [];
      this.filterItmnumsWithID = [];
      this.toStoragePlaces = [];
      return false;
    }
  }

  /**
   * get itmnum suggestions
   *
   * @param refTableName
   * @param validateFieldName
   * @param validateFieldValue
   * @private
   */
  private async getItmnumSuggestions(refTableName: string, validateFieldName: string, validateFieldValue: string) {
    let result: boolean = false;
    if (validateFieldName &&
      Object.values(this.CONSTANTS.STOCK_TRANSFER_SEARCH_COLUMN_TYPES).includes(validateFieldName)) {
      let searchWithLike: boolean = true;
      let resultAsArray: boolean = false;
      let additionalColumns: string = (validateFieldName === 'ITMNUM') ?
        Object.values(this.CONSTANTS.STOCK_TRANSFER_ADDITIONAL_COLUMNS_TYPES).join(",") : "";
      let primaryColumn: undefined | string;
      let primaryValue: undefined | string;
      if (validateFieldName === this.CONSTANTS.STOCK_TRANSFER_SEARCH_COLUMN_TYPES.LOC) {
        primaryColumn = 'ID';
        primaryValue = this.fromModel.ID.toString();
      }
      return await this.searchSuggestions(refTableName, validateFieldName, validateFieldValue, primaryColumn,
        primaryValue, searchWithLike, resultAsArray, additionalColumns, result);
    } else {
      console.log("column not supported: ", validateFieldName);
      return false;
    }
  }

  /**
   * search suggestions
   *
   * @param refTableName
   * @param validateFieldName
   * @param validateFieldValue
   * @param primaryColumn
   * @param primaryValue
   * @param searchWithLike
   * @param resultAsArray
   * @param additionalColumns
   * @param result
   * @private
   */
  private searchSuggestions(refTableName: string, validateFieldName: string, validateFieldValue: string,
                                  primaryColumn: string, primaryValue: string, searchWithLike: boolean,
                                  resultAsArray: boolean, additionalColumns: string, result: boolean) {
                                    console.log(refTableName);
                                    return new Promise(async resolve => {
      let dbData: any = await this.tableDataService.searchTableColumnData(refTableName, validateFieldName,
        validateFieldValue, primaryColumn, primaryValue, searchWithLike, resultAsArray, additionalColumns);
      this.filterItmnums = [];
      this.filterItmnumsWithID = [];
      this.toStoragePlaces = [];
      if (!dbData || Object.keys(dbData).length === 0) {
        this.messagesService.showErrorMessage(this.translatePipe.transform('ERROR_DURING_CHECKING'));
      } else {
        if (validateFieldName === this.CONSTANTS.STOCK_TRANSFER_SEARCH_COLUMN_TYPES.ITMNUM) {
          // show received ITMNUM at autocomplete field
          this.filterItmnumsWithID = dbData;
          for (let dbItm in dbData) {
            if (dbData.hasOwnProperty(dbItm)) {
              this.filterItmnums.push(dbData[dbItm].ITMNUM + " " + this.dividerChar + " " + dbData[dbItm].LOT + " " +
                this.dividerChar + " " + dbData[dbItm].LOC + " " + this.dividerChar + " " + dbData[dbItm].QTY);
            }
          }
        } else if (validateFieldName === this.CONSTANTS.STOCK_TRANSFER_SEARCH_COLUMN_TYPES.LOC) {
          for (let dbItm in dbData) {
            if (dbData.hasOwnProperty(dbItm)) {
              this.toStoragePlaces.push(dbData[dbItm].LOC);
            }
          }
        }
        result = true;
      }
      resolve(result);
    });
  }

  /**
   * init fields
   *
   * @param dlgAutocomplete
   * @param fieldName
   */
  initFields(dlgAutocomplete: AutoComplete, fieldName: string) {
    if (fieldName === this.CONSTANTS.STOCK_TRANSFER_SEARCH_COLUMN_TYPES.ITMNUM) {
      let itmnumArr: string[] = dlgAutocomplete.value.trim().split(this.dividerChar);
      let itmnum: string = itmnumArr[0].trim();
      let foundItem: boolean = false;
      for (let item in this.filterItmnumsWithID) {
        if (this.filterItmnumsWithID.hasOwnProperty(item)) {
          if (this.filterItmnumsWithID[item]['ITMNUM'] &&
            this.filterItmnumsWithID[item]['ITMNUM'].trim() === itmnum &&
            this.filterItmnumsWithID[item]['LOT'].trim() === itmnumArr[1].trim() &&
            this.filterItmnumsWithID[item]['LOC'].trim() === itmnumArr[2].trim() &&
            this.filterItmnumsWithID[item]['QTY'] === parseInt(itmnumArr[3].trim())) {
            foundItem = true;
            let id: number = this.filterItmnumsWithID[item]['ID'];
            let lot: string = this.filterItmnumsWithID[item]['LOT'].trim();
            let loc: string = this.filterItmnumsWithID[item]['LOC'].trim();
            let qty: number = this.filterItmnumsWithID[item]['QTY'];
            if (qty < 0) {
              this.messagesService.showErrorMessage('Qty summe is lower 0!');
              break;
            }
            let whLoc: string = this.filterItmnumsWithID[item]['WHLOC'].trim();
            let statusPos: string = this.filterItmnumsWithID[item]['STATUS_POS'].trim();
            let reserved: number = this.filterItmnumsWithID[item]['RESERVED'];
            let updateLoc: string = this.filterItmnumsWithID[item]['UPDATE_LOC'].trim();
            this.fromModel = new Warehousing(id, whLoc, itmnum, lot, loc, statusPos, qty, reserved, updateLoc);
            this.toModel = new Warehousing(0, whLoc, itmnum, lot, '', statusPos, 0, 0, '');
            this.toLocInputMax = (qty - this.filterItmnumsWithID[item]['RESERVED']);
            if (this.toLocInputMax === 0) {
              this.messagesService.showErrorMessage(this.translatePipe.transform('ERROR_STORAGE_LOCATIONS_QTY_IS_ZERO'));
              break;
            }
            this.setToLocDisabled(false);
            this.setToQtyDisabled(false);
            break;
          }
        }
      }
      if (!foundItem) {
        this.messagesService.showErrorMessage(this.translatePipe.transform('NOT_FOUND_ERROR').replace('%s', itmnum));
      }
    } else if (fieldName === this.CONSTANTS.STOCK_TRANSFER_SEARCH_COLUMN_TYPES.LOC) {
      let toLoc: string = this.toLocAutocomplete.value.trim();
      this.toLocInputValid = !!(toLoc && toLoc.length);
    } else {
      console.log("column not supported: ", fieldName);
    }
  }

  /**
   * save on click
   */
  async onSaveClick() {
    if (this.checkQty()) {
      if (this.fromModel.LOC === this.toModel.LOC) {
        this.messagesService.showErrorMessage(this.translatePipe.transform('ERROR_STORAGE_LOCATIONS_ARE_EQUAL'));
      } else {
        this.saveButton.nativeElement.disabled = true;
        // save data to db
        this.fromModel.UPDATE_LOC = this.helperService.getCurrentDate();
        this.toModel.UPDATE_LOC = this.helperService.getCurrentDate();
        // 1 check: If same LOC available in db with same (ITMNUM, LOT (WHLOC, STATUS_POS, RESERVED))
        let dbData = await this.tableDataService.checkTableData(this.refTable, this.toModel, false);
        // 2 save data to db
        // let primaryKey: string = "ID";
        // let primaryValue: string = this.fromModel.ID.toString();
        let saveProcedureStepsLog = {1: false, 2: false, 3: false, 4: false};
        // 2 variants:
        if (dbData['result'] && dbData['result'].length > 0) {
          // a) "To" storage location is existing
          if (dbData['result'].data[0] && dbData['result'].data[0] && dbData['result'].data[0][0].ID) {
            if (dbData['result'].data[0][0].QTY && (dbData['result'].data[0][0].QTY > 0)) {
              if ((this.fromModel.QTY - this.toModel.QTY) > 0) {
                // a) storage location is existing, summe qty's and update both (From and To) items
                this.updateBothLocations(this.fromModel.ID, dbData['result'].data[0][0].ID,
                  this.toModel.QTY, saveProcedureStepsLog);
              } else if ((this.fromModel.QTY - this.toModel.QTY) === 0) { // Example: from 11 to 11 || from 1 to 1
                // b) storage location is existing, summe qty's and delete fromModel
                this.updateAndDeleteLocation(this.fromModel.ID, dbData['result'].data[0][0].ID, this.toModel.QTY,
                  saveProcedureStepsLog);
              }
            } else {
              this.messagesService.showErrorMessage(this.translatePipe.transform('ERROR_TO_QTY_IS_ZERO'));
            }
          } else {
            this.messagesService.showErrorMessage(this.translatePipe.transform('NOT_FOUND_ERROR').replace('%s',
              this.translatePipe.transform('WAREHOUSING_FROM') + '-' +
              this.translatePipe.transform('WAREHOUSING_QUANTITY')));
          }
        } else {
          // b) "To" storage location is NOT existing
          if ((this.fromModel.QTY - this.toModel.QTY) > 0) {
            // a) storage location is NOT existing yet, create new storage location
            this.createLocation(this.fromModel.ID, this.toModel.QTY, saveProcedureStepsLog);
          } else if ((this.fromModel.QTY - this.toModel.QTY) === 0) { // Example: from 11 to 11 || from 1 to 1
            // b) storage location is NOT existing => replace
            // 2.2) complete copy => just replace LOC with them from "toModel"...
            this.replaceLocation(this.fromModel.ID, saveProcedureStepsLog);
          }
        }
      }
    }
  }

  /**
   * Create new warehouse to-location and update from-location
   *
   * @param fromWarehousingId
   * @param qty
   * @param saveProcedureStepsLog
   * @private
   */
  private createLocation(fromWarehousingId: number, qty: number,
                         saveProcedureStepsLog: { 1: boolean; 2: boolean; 3: boolean; 4: boolean }) {
    // 2.1a: save to-model
    let saveType = "create";
    let stockTransferSaveType: string = this.CONSTANTS.STOCK_TRANSFER_SAVE_TYPES.CREATE;
    let newWarehousingToItem = { WHLOC: this.toModel.WHLOC, ITMNUM: this.toModel.ITMNUM, LOT: this.toModel.LOT,
      LOC: this.toModel.LOC, STATUS_POS: this.toModel.STATUS_POS, QTY: this.toModel.QTY,
      RESERVED: 0, UPDATE_LOC: this.toModel.UPDATE_LOC };
    let dataArray: {} =
      {fromWarehousingId: fromWarehousingId, warehousingToItem: newWarehousingToItem, quantity: qty};
    this.updateLocations(dataArray, stockTransferSaveType, saveProcedureStepsLog, saveType);
  }

  /**
   * Replace warehouse from-location with to-location (because both qty's are the same )
   *
   * @param fromWarehousingId
   * @param saveProcedureStepsLog
   * @private
   */
  private replaceLocation(fromWarehousingId: number,
                          saveProcedureStepsLog: { 1: boolean; 2: boolean; 3: boolean; 4: boolean }) {
    let saveType = "replace";
    let stockTransferSaveType: string = this.CONSTANTS.STOCK_TRANSFER_SAVE_TYPES.REPLACE;
    let warehousingToItem = {LOC: this.toModel.LOC, UPDATE_LOC: this.toModel.UPDATE_LOC};
    let dataArray: {} =
      {fromWarehousingId: fromWarehousingId, warehousingToItem: warehousingToItem};
    this.updateLocations(dataArray, stockTransferSaveType, saveProcedureStepsLog, saveType);
  }

  /**
   * saving was successful, so disable inputs and save button, show success message
   * @private
   */
  private savingSuccessful() {
    this.setToLocDisabled(true);
    this.setToQtyDisabled(true);
    this.messagesService.showSuccessMessage(this.translatePipe.transform('SAVEDSUCCESS'));
    this.resetForm();
  }

  /**
   * Update warehouse to-location and delete from-location (because qty = 1)
   *
   * @param fromWarehousingId
   * @param toWarehousingId
   * @param qty
   * @param saveProcedureStepsLog
   * @private
   */
  private updateAndDeleteLocation(fromWarehousingId: number, toWarehousingId: number, qty: number,
                                  saveProcedureStepsLog: { 1: boolean; 2: boolean; 3: boolean; 4: boolean }) {
    let saveType = "update";
    let stockTransferSaveType: string = this.CONSTANTS.STOCK_TRANSFER_SAVE_TYPES.UPDATE_DELETE;
    let dataArray: {} =
      {fromWarehousingId: fromWarehousingId, toWarehousingId: toWarehousingId, quantity: qty};
    this.updateLocations(dataArray, stockTransferSaveType, saveProcedureStepsLog, saveType);
  }

  /**
   * Update warehouse to-location and from-locations
   *
   * @param fromWarehousingId
   * @param toWarehousingId
   * @param qty
   * @param saveProcedureStepsLog
   * @private
   */
  private updateBothLocations(fromWarehousingId: number, toWarehousingId: number, qty: number,
                              saveProcedureStepsLog: { 1: boolean; 2: boolean; 3: boolean; 4: boolean }) {
    let saveType = "updateBoth";
    let stockTransferSaveType: string = this.CONSTANTS.STOCK_TRANSFER_SAVE_TYPES.UPDATE_BOTH;
    let dataArray: {} =
      {fromWarehousingId: fromWarehousingId, toWarehousingId: toWarehousingId, quantity: qty};
    this.updateLocations(dataArray, stockTransferSaveType, saveProcedureStepsLog, saveType);
  }

  /**
   * update locations by executing setTableData
   *
   * @param dataArray
   * @param stockTransferSaveType
   * @param saveProcedureStepsLog
   * @param saveType
   * @private
   */
  private async updateLocations(dataArray: {}, stockTransferSaveType: string, saveProcedureStepsLog:
    { "1": boolean; "2": boolean; "3": boolean; "4": boolean }, saveType: string) {
    const dbData: { result: { success: boolean, message: string, data: [] } } = await this.tableDataService.setTableData({
      refTable: this.refTable, tableName: this.refTable, dataArray: dataArray, primaryKey: 'saveType',
      primaryValue: stockTransferSaveType, isIdentity: undefined, newItemMode: false, secondaryKey: undefined,
      secondaryValue: undefined
    });
    if (dbData && dbData.result && !dbData.result.success) {
      this.messagesService.showErrorMessage(dbData.result.message);
    } else {
      this.savingSuccessful();
    }
  }

  /**
   * set toQty disabled
   *
   * @param flag
   * @private
   */
  private setToQtyDisabled(flag: boolean) {
    this.toQtyInputDisabled = flag;
    this.toQtyInputRequired = !flag;
  }

  /**
   * set toLoc disabled
   *
   * @param flag
   * @private
   */
  private setToLocDisabled(flag: boolean) {
    this.toLocInputDisabled = flag;
    this.toLocInputRequired = flag;
    // this.toLocInputValid = !flag;
  }

  setToStoragePlaces(places: []) {
    this.toStoragePlaces = places;
  }

  resetForm() {
    this.fromModel =
      new Warehousing(0, '', '', '', '', '', 0, 0, '');
    this.toModel =
      new Warehousing(0, '', '', '', '', '', 0, 0, '');
    this.toLocInputMin = this.LOC_INPUT_MIN;
    this.toLocInputMax = this.LOC_INPUT_MIN; //this.LOC_INPUT_MAX;
    this.setToLocDisabled(true);
    this.setToQtyDisabled(true);
    this.filterItmnums = [];
    this.toStoragePlaces = [];
    this.toLocInputValid = false;
    // this.saveButton.nativeElement.disabled = true;
    // this.dlgAutocomplete.disabled = true;
  }

  /**
   * check field for empty
   *
   * @param $event
   * @param fieldName
   */
  checkForEmpty($event: any, fieldName: string) {
    if ((fieldName === 'ITMNUM') || (fieldName === 'LOC' && this.toLocInputValid)) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }
}
