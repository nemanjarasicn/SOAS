import { Component, Inject, OnInit, NgModule, ViewChild } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { TranslateItPipe } from "../../shared/pipes/translate-it.pipe";
import { Batch } from "../../models/batch";
import { BatchService } from "../../_services/batch.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { ConstantsService } from "../../_services/constants.service";
import { TableDataService } from "../../_services/table-data.service";
import { MessageService } from "primeng/api";
import { AutoComplete } from "primeng/autocomplete";
import { BatchItem } from "../../interfaces/batch-item";

@Component({
  selector: "app-batch-dialog",
  templateUrl: "./batch-dialog.component.html",
  styleUrls: ["./batch-dialog.component.css"],
  providers: [TranslateItPipe, MessageService],
})
export class BatchDialogComponent implements OnInit {
  refTable: string = "batchProcesses";
  description: string = ""; // form title
  functions: string[] = [
    "check_new_orders",
    "execute_sql_create_csv_send_mail",
  ];

  @ViewChild("funcAutocomplete", { static: false })
  funcAutocomplete: AutoComplete;

  model: Batch = new Batch(
    "",
    "",
    "check_new_orders",
    "*",
    "*",
    "*",
    "*",
    "*",
    false,
    "",
    "",
    "",
    "",
    false,
    {}
  );

  submitted: boolean = false;
  editMode: boolean = false; // if true => edit user dialog; false => create user dialog
  batches: BatchItem[];
  batchForm: FormGroup;
  batchFunction: FormControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(255),
  ]);
  batchActive: FormControl;
  batchName: FormControl;
  batchDescription: FormControl;
  batchCode: FormControl;
  isBatchCodeChecked: boolean = true;
  batchParams: Object;
  hasParams: boolean = true; // if true=> Table with parameters will be shown
  options: string[] = [
    "soas_hourly_allocation_check",
    "mssql_batch_process_book_inventory",
  ];
  selectedFilterBatchFunction: string;
  batchFunctions: string[];
  suggestionFunctions: string[];
  batchFunctionsWithParams: Object;

  errorMessageIsShowing: boolean;

  inputFormControl: FormControl = new FormControl("", [Validators.required]);

  getErrorMessage() {
    return this.inputFormControl.hasError("required")
      ? "You must enter a value"
      : "";
  }

  constructor(
    private dialogRef: MatDialogRef<BatchDialogComponent>,
    private batchService: BatchService,
    public translatePipe: TranslateItPipe,
    public matDialog: MatDialog,
    public CONSTANTS: ConstantsService,
    private tableDataService: TableDataService,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.description = data.description;
    this.model = new Batch(
      data.BATCH_NAME,
      data.BATCH_DESCRIPTION,
      data.BATCH_FUNCTION,
      data.BATCH_INTERVAL_MINUTES,
      data.BATCH_INTERVAL_HOURS,
      data.BATCH_INTERVAL_DAYS,
      data.BATCH_INTERVAL_MONTHS,
      data.BATCH_INTERVAL_DAYOFMONTH,
      data.BATCH_ACTIVE,
      data.BATCH_LAST_RUN_START,
      data.BATCH_LAST_RUN_FINISH,
      data.BATCH_LAST_RUN_RESULT,
      data.BATCH_CODE,
      data.BATCH_CODE_REQUIRED,
      data.BATCH_PARAMS
    );
    this.editMode = data.editMode;
    this.hasParams = data.BATCH_PARAMS ? true : false;
    this.batchFunctions = [];
    this.selectedFilterBatchFunction = "";

    this.createFormControls();
    this.createBatchCodeFormControl(data.BATCH_CODE_REQUIRED);
    this.createForm();
    this.createParams();
  }

  async ngOnInit() {
    let batches: any[] = await this.batchService.getBatches();

    batches["table"][0].forEach((batch) => {
      !this.batchFunctions.includes(batch.BATCH_FUNCTION) &&
        this.batchFunctions.push(batch.BATCH_FUNCTION);
    });

    this.batchFunctionsWithParams = batches["table"][0][0].BATCH_FUNCTIONS;
  }

  /**
   * create form control
   */
  createFormControls() {
    this.batchActive = new FormControl("", []);
    this.batchName = new FormControl("", [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.batchDescription = new FormControl("", [
      Validators.required,
      Validators.maxLength(255),
    ]);
  }

  /**
   * create batch code form control
   *
   * @param codeRequired
   */
  createBatchCodeFormControl(codeRequired: boolean) {
    this.batchCode = new FormControl("", [Validators.nullValidator]);
  }

  /**
   * create form
   */
  createForm() {
    this.batchForm = new FormGroup({
      batchFunction: this.batchFunction,
      batchName: this.batchName,
      batchDescription: this.batchDescription,
      batchCode: this.batchCode,
    });
  }

  createParams() {
    for (const key in this.model.BATCH_PARAMS) {
      this.batchForm.addControl(
        key,
        new FormControl("", [Validators.required, Validators.maxLength(50)])
      );
    }
  }

  /**
   * on submit
   */
  async onSubmit() {
    this.submitted = true;
    let pbCode: string;
    if (this.model.BATCH_CODE) {
      pbCode = this.parseBatchCode(this.model.BATCH_CODE);
      this.model.BATCH_CODE = pbCode;
    }
    if (!this.editMode) {
      // Create batch route aufrufen.
      await this.batchService.insertBatch({
        BATCH_NAME: this.model.BATCH_NAME,
        BATCH_DESCRIPTION: this.model.BATCH_DESCRIPTION,
        BATCH_FUNCTION: this.model.BATCH_FUNCTION,
        BATCH_INTERVAL:
          this.model.BATCH_INTERVAL_MINUTES +
          " " +
          this.model.BATCH_INTERVAL_HOURS +
          " " +
          this.model.BATCH_INTERVAL_DAYS +
          " " +
          this.model.BATCH_INTERVAL_MONTHS +
          " " +
          this.model.BATCH_INTERVAL_DAYOFMONTH,
        BATCH_ACTIVE: this.model.BATCH_ACTIVE,
        BATCH_LAST_RUN_START: this.model.BATCH_LAST_RUN_START,
        BATCH_LAST_RUN_FINISH: this.model.BATCH_LAST_RUN_FINISH,
        BATCH_LAST_RUN_RESULT: this.model.BATCH_LAST_RUN_RESULT,
        BATCH_CODE: this.model.BATCH_CODE,
        BATCH_CODE_REQUIRED: this.model.BATCH_CODE_REQUIRED,
        BATCH_PARAMS: this.model.BATCH_PARAMS,
      });
    } else {
      // Edit/Update batch route aufrufen.
      /*await this.batchService.updateBatch({
        BATCH_NAME: this.model.BATCH_NAME,
        BATCH_DESCRIPTION: this.model.BATCH_DESCRIPTION,
        BATCH_FUNCTION: this.model.BATCH_FUNCTION,
        BATCH_INTERVAL:
          this.model.BATCH_INTERVAL_MINUTES +
          " " +
          this.model.BATCH_INTERVAL_HOURS +
          " " +
          this.model.BATCH_INTERVAL_DAYS +
          " " +
          this.model.BATCH_INTERVAL_MONTHS +
          " " +
          this.model.BATCH_INTERVAL_DAYOFMONTH,
        BATCH_ACTIVE: this.model.BATCH_ACTIVE,
        BATCH_LAST_RUN_START: this.model.BATCH_LAST_RUN_START,
        BATCH_LAST_RUN_FINISH: this.model.BATCH_LAST_RUN_FINISH,
        BATCH_LAST_RUN_RESULT: this.model.BATCH_LAST_RUN_RESULT,
        BATCH_CODE: this.model.BATCH_CODE,
        BATCH_CODE_REQUIRED: this.model.BATCH_CODE_REQUIRED,
        BATCH_PARAMS: this.model.BATCH_PARAMS,
      });*/
      await this.tableDataService.putModelEndpoint({
        primaryKey: `${this.model.BATCH_NAME}`,
        modelName: 'batchProcess',
        data: JSON.stringify(this.model),
      })
    }
    this.close();
  }

  /**
   * bew batch
   */
  newBatch() {
    this.model = new Batch(
      "",
      "",
      "check_new_orders",
      "*",
      "*",
      "*",
      "*",
      "*",
      false,
      "",
      "",
      "",
      "",
      false,
      {}
    );
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  close() {
    this.dialogRef.close();
  }

  /**
   * parse batch code
   *
   * @param batchCodeValue
   */
  parseBatchCode(batchCodeValue: string) {
    try {
      //parsedValue = JSON.parse(batchCodeValue);
      //return JSON.stringify(parsedValue);
      return this.real_escape_string(batchCodeValue);
    } catch (err) {
      return "";
    }
  }

  /**
   * real escape string
   *
   * @param str
   */
  real_escape_string(str: string) {
    if (str) {
      str = str.trim().replace(/\'/g, "''");
      // str = str.trim().replace(/\r\n/g, " ");
    }
    return str;
  }

  trackByIndex(index) {
    return index;
  }

  /**
   * searching functions query input
   *
   * @param event
   */

  search(event) {
    this.suggestionFunctions = this.batchFunctions.filter((c) =>
      c.includes(event.query)
    );
  }

  /**
   * setting selected function
   * and checking for params
   *
   * @param event
   */


  initFields(event) {
    this.selectedFilterBatchFunction = event;
    for (const key in this.batchFunctionsWithParams) {
      if (key === this.selectedFilterBatchFunction) {
        this.hasParams = true;
        this.model.BATCH_PARAMS = this.batchFunctionsWithParams[key];
      }
    }
  }
}
