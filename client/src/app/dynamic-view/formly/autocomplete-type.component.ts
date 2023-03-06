import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FieldType} from '@ngx-formly/material';
import {MatInput} from '@angular/material/input';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {pairwise, startWith} from 'rxjs/operators';
import {TableDataService} from '../../_services/table-data.service';
import {Router} from '@angular/router';
import {ConstantsService} from '../../_services/constants.service';

@Component({
  selector: 'formly-autocomplete-type',
  template: `
    <input matInput
           [matAutocomplete]="auto"
           [formControl]="formControl"
           [formlyAttributes]="field"
           [placeholder]="to.placeholder"
           [errorStateMatcher]="errorStateMatcher"
           (focus)="resetDataOptions()">
    <mat-autocomplete #auto="matAutocomplete" (optionSelected)='removeTextInBrackets($event.option.value)'>
      <mat-option *ngFor="let value of filter | async" [value]="value">
        {{ value }}
      </mat-option>
    </mat-autocomplete>
    <button class="btn btn-primary save" (click)="newCustomer($event)" [disabled]="formFieldControl.disabled"
            *ngIf="newCustomerButtonVisible">
      {{'CREATE_NEW_CUSTOMER' | translateIt}}
    </button>
  `,
  styles: [`
  `]
})

/**
 * @Link: https://stackblitz.com/edit/angular-formly-chip-autocomplete?file=src%2Fapp%2Fapp.module.ts
 */
export class AutocompleteTypeComponent extends FieldType implements OnInit, AfterViewInit {
  @ViewChild(MatInput, {static: false}) formFieldControl: MatInput;
  @ViewChild(MatAutocompleteTrigger, {static: false}) autocomplete: MatAutocompleteTrigger;
  @Output() newItmNumEvent = new EventEmitter<string>();

  filter: Observable<any>;
  isFilterSet: boolean;
  initialValue: string;
  dataOptions: string[] = [];
  newCustomerButtonVisible: boolean;

  constructor(
    private tableDataService: TableDataService,
    private router: Router,
    private CONSTANTS: ConstantsService
  ) {
    super();
    this.isFilterSet = false;
  }

  ngOnInit() {
    super.ngOnInit();
    this.newCustomerButtonVisible =
      (this.field && this.field.key === this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN);
    this.initialValue = this.value;
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    // temporary fix for https://github.com/angular/material2/issues/6728
    (<any>this.autocomplete)._formField = this.formField;
    this.filter = this.formControl.valueChanges
      .pipe(
        // tap(() => this.isLoading = true),
        startWith(''),
        pairwise()
      )
      .map((([prev, next]: [any, any]) => this._filter(next)
      ));
  }

  /**
   * query db by given value
   *
   * @param value
   * @private
   */
  private _filter(value: string): string[] {
    if (this.field) {
      // allow to filter, only if field is not disabled...
      if (this.field.templateOptions && !this.field.templateOptions.disabled) {
        let lowercaseValue = value && value.length > 0 ? value.toLowerCase() : '';
        const self = this;
        // step 1: filter customer number for orders or invoice (at new item mode)
        // step 2: remove text in brackets at option selected, see removeTextInBrackets()
        if (this.field.key === this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN ||
          this.field.key === this.CONSTANTS.REFTABLE_INVOICE_CUS_COLUMN) {
          const filterValue = lowercaseValue;
          this.searchCustomersNumber(filterValue, function (result) {
            self.dataOptions = result;
            // self.isLoading = false;
          });
          return self.dataOptions;
        } else if (this.isArticleColumn()) {
          lowercaseValue = lowercaseValue.slice(lowercaseValue.lastIndexOf(',') + 1, lowercaseValue.length);
          const filterValue = lowercaseValue;
          this.searchArticleNumber(filterValue, this.field.key, function (result) {
            self.dataOptions = result;
            // self.isLoading = false;
          });
          return this.dataOptions; //.filter(option => option.toLowerCase().includes(filterValue));
        } else if (this.field.key === this.CONSTANTS.REFTABLE_IMPORT_TYPES_REF_TABLES_ID_COLUMN) {
          lowercaseValue = lowercaseValue.slice(lowercaseValue.lastIndexOf(',') + 1, lowercaseValue.length);
          const filterValue = lowercaseValue;
          console.log(filterValue);
          this.searchImportType(filterValue, function (result) {
            self.dataOptions = result;
            // self.isLoading = false;
          });
          return self.dataOptions.filter(option => option.toLowerCase().includes(filterValue));
        } else if (this.field.key === this.CONSTANTS.REFTABLE_IMPORT_TYPE_CONSTANTS_IMP_TYPE_REF_TABLE_COLUMN) {
          lowercaseValue = lowercaseValue.slice(lowercaseValue.lastIndexOf(',') + 1, lowercaseValue.length);
          const filterValue = lowercaseValue;
          this.searchImportTypeRef(filterValue, function (result) {
            self.dataOptions = result;
            // self.isLoading = false;
          });
          return self.dataOptions.filter(option => option.toLowerCase().includes(filterValue));
        }
      }
    }
  }

  /**
   * Search a customers number. Used at orders details view > CUSTOMER_ORDER form field.
   *
   * @param value
   * @param callback
   */
  public async searchCustomersNumber(value, callback) {
    let searchWithLike: boolean = true;
    let resultAsArray: boolean = true;
    // For orders > customer number search, at new item mode:
    // If CLIENT is not selected, the search will not find all possible items. So set CLIENT first.
    // If adding a new item to additional columns, check at server > Search.ts > ordersAdditionalColumnsTypes,
    // if new column name is set there and add it there if missing.
    let additionalColumns: string = 'CUSTOMERS_NUMBER,CUSTOMERS_COMPANY,CUSTOMERS_PRENAME,CUSTOMERS_NAME,' +
      'CUSTOMER_ORDER,CUSTOMER_DELIVERY,CUSTOMER_INVOICE';
    let curLocRefTable = localStorage.getItem(this.CONSTANTS.LS_SEL_REF_TABLE);
    // client = undefined - means that search will return items of both types (B2C & B2B)
    let client: string = undefined; // this.CONSTANTS.CLIENT_B2C;
    let curRefTable: string = (curLocRefTable &&
      (curLocRefTable === this.CONSTANTS.REFTABLE_CUSTOMER || curLocRefTable === this.CONSTANTS.REFTABLE_PARTNERS)) ?
      curLocRefTable : this.CONSTANTS.REFTABLE_CUSTOMER;
    let ordersClient = localStorage.getItem(this.CONSTANTS.LS_SEL_ORDERS_CLIENT);
    if (ordersClient && curLocRefTable === this.CONSTANTS.REFTABLE_ORDERS) {
      curRefTable = ordersClient === this.CONSTANTS.CLIENT_B2C ?
        this.CONSTANTS.REFTABLE_CUSTOMER : this.CONSTANTS.REFTABLE_PARTNERS;
      // client = ordersClient;
    }
    let dbData = await this.tableDataService.searchTableColumnData(curRefTable, 'CUSTOMERS_NUMBER', value,
      'CUSTOMERS_TYPE', client, searchWithLike, resultAsArray, additionalColumns);
    let newArray = [];
    for (let dbItem in dbData) {
      newArray.push(dbData[dbItem].CUSTOMERS_NUMBER +
        ' (' + dbData[dbItem].CUSTOMERS_COMPANY + ' - ' + dbData[dbItem].CUSTOMERS_TYPE + ')');
    }
    callback(newArray);
  }

  /**
   * search for article number at articles view > Cross-Selling form field
   *
   * @param value
   * @param key
   * @param callback
   */
  public async searchArticleNumber(value, key, callback) {
    let searchWithLike: boolean = true;
    let resultAsArray: boolean = true;
    let additionalColumns: string = (key === this.CONSTANTS.REFTABLE_CROSSELLING_ID) ? 'ITMDES,EANCOD' : '';
    let curRefTable: string = this.CONSTANTS.REFTABLE_ARTICLES;
    let dbData = await this.tableDataService.searchTableColumnData(curRefTable, 'ITMNUM', value,
      'ITMNUM', undefined, searchWithLike, resultAsArray, additionalColumns);
    let newArray = [];
    for (let dbItem in dbData) {
      newArray.push((key === this.CONSTANTS.REFTABLE_CROSSELLING_ID) ?
        dbData[dbItem].ITMNUM + ' (' + dbData[dbItem].ITMDES + ' - ' + dbData[dbItem].EANCOD + ')' : dbData[dbItem].ITMNUM);
    }
    callback(newArray);
  }

  public async searchImportType(value, callback) {
    let searchWithLike: boolean = true;
    let resultAsArray: boolean = true;
    let additionalColumns: string = 'IMPORT_TYPE_NAME';
    let curRefTable: string = this.CONSTANTS.REFTABLE_IMPORT_TYPES;
    let dbData = await this.tableDataService.searchTableColumnData(curRefTable, 'ID', value,
      'ID', undefined, searchWithLike, resultAsArray, additionalColumns);
    let newArray = [];
    for (let dbItem in dbData) {
      console.log(dbItem);
      newArray.push(dbData[dbItem].ID + ' (' + dbData[dbItem].IMPORT_TYPE_NAME + ')');
    }
    callback(newArray);
  }

  public async searchImportTypeRef(value, callback) {
    let searchWithLike: boolean = true;
    let resultAsArray: boolean = true;
    let additionalColumns: string = 'REFERENCED_TABLE';
    let curRefTable: string = this.CONSTANTS.REFTABLE_IMPORT_TYPES_REF_TABLES;
    let dbData = await this.tableDataService.searchTableColumnData(curRefTable, 'IMPORT_TYPE_ID', value,
      'IMPORT_TYPE_ID', undefined, searchWithLike, resultAsArray, additionalColumns);
    let newArray = [];
    for (let dbItem in dbData) {
      console.log(dbItem);
      newArray.push(dbData[dbItem].IMPORT_TYPE_ID + ' (' + dbData[dbItem].REFERENCED_TABLE + ')');
    }
    callback(newArray);
  }

  /**
   * remove text in brackets for insert only customer number into CUSTOMER_ORDER field
   *
   * IN:  4500000301 (TEST-20210720 Firma - B2C)
   * OUT: 4500000301
   *
   * @param value
   */
  removeTextInBrackets(value: string) {
    let extractedValue: string = value.slice(0, value.indexOf('(')).trim();
    if (this.field.key === this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN ||
      this.field.key === this.CONSTANTS.REFTABLE_INVOICE_CUS_COLUMN) {
      this.value = extractedValue;
    } else if (this.field.key === this.CONSTANTS.REFTABLE_CROSSELLING_ID) {
      this.value = this.initialValue ? this.initialValue + ',' + extractedValue : extractedValue;
      this.initialValue = this.value;
    }  else if (this.field.key === this.CONSTANTS.REFTABLE_IMPORT_TYPES_REF_TABLES_ID_COLUMN) {
      this.value = this.initialValue ? this.initialValue + ',' + extractedValue : extractedValue;
      this.initialValue = this.value;
    }
    if (this.isArticleColumn()) {
      // trigger new item number (article) event at dynamic form component
      this.field.templateOptions.newItmNumEvent(value);
    }
  }

  private isArticleColumn() {
    return this.field.key === this.CONSTANTS.REFTABLE_ARTICLES_COLUMN ||
      this.field.key === this.CONSTANTS.REFTABLE_CROSSELLING_ID ||
      this.field.key === this.CONSTANTS.REFTABLE_PRILISTS_COLUMN;
  }

  newCustomer($event: MouseEvent) {
    this.tableDataService.openNewWindow($event, this.CONSTANTS.REFTABLE_CUSTOMER);
  }

  /**
   * reset autocomplete data options,
   * to prevent select of wrong type of customer number at type change between b2c/b2b
   */
  resetDataOptions() {
    if (!this.formFieldControl.value || !this.dataOptions) {
      if (this.field && this.field.key === this.CONSTANTS.REFTABLE_ORDERS_CUS_COLUMN) {
        this.dataOptions = [];
        this.ngAfterViewInit();
      }
    }
  }
}
