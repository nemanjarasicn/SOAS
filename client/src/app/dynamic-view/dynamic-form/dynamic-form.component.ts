import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {FetchDataService} from '../../_services/fetch-data.service';
import {
  ConstantsService,
  modelNames,
  SoasModel,
} from '../../_services/constants.service';
import {DynamicFormService} from "../../_services/dynamic-form.service";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {TableDataService} from "../../_services/table-data.service";
import {HelperService} from "../../_services/helper.service";

@Component({
  exportAs: 'dynamicForm',
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})

/**
 * DynamicFormComponent - dynamic formly form view
 *
 * Used by: CustomFormComponent, DetailViewListComponent, DetailViewTabGroupComponent
 */
export class DynamicFormComponent implements OnInit, AfterViewInit, OnDestroy {
  disabledFlag: boolean;
  form: FormGroup = new FormGroup({})
  translateItPipe: TranslateItPipe
  // disable whole form by form-state: https://formly.dev/examples/form-options/form-state
  options: FormlyFormOptions = {};

  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('saveButton', {static: false}) saveButton: ElementRef;
  @Input() togetherData ?: Object
  @Input() modalData?: SoasModel
  @Input() saveMode? = true
  @Input() formlyFieldConfig: FormlyFieldConfig[]
  @Output() reset: EventEmitter<any> = new EventEmitter<any>();
  @Input() newItemMode: boolean
  @Output() emitTmpMainTableForm = new EventEmitter<FormGroup | null>()

  constructor(
    private fetchDataService: FetchDataService,
    private dynamicFormService: DynamicFormService,
    private constantsService?: ConstantsService,
    private tableDataService?: TableDataService,
    private helperService?: HelperService
  ) {
    this.translateItPipe = new TranslateItPipe(this.constantsService)
  }

  ngOnInit(): void {
    this.initDynamicForm()
      .catch((err)=>{
        return err;
      })
  }

  async initDynamicForm(): Promise<void> {
    this.form = new FormGroup({});

    // if (this.newItemMode) {
    //   this.toggleDisabledOption()
    // }

    for (let row of this.formlyFieldConfig) {

      if (row?.fieldGroup) {
        for (let fieldGroup of row.fieldGroup){

          // add control to formGroup
          if (fieldGroup?.key) {
            this.form.addControl(String(fieldGroup.key), new FormControl(fieldGroup.defaultValue || null))
          }

          // translate label
          if (fieldGroup?.templateOptions) {
            fieldGroup.templateOptions.label = this.translateItPipe.transform(fieldGroup.templateOptions.label)

            // populate options
            if (fieldGroup?.type === 'native-select' && fieldGroup.templateOptions?.refTable) {
              const tmpOptions = await this.tableDataService.getModelEndpoint({
                modelName: modelNames[fieldGroup.templateOptions.refTable],
              })

              if(tmpOptions?.table.length > 1) {
                fieldGroup.templateOptions.options = tmpOptions.table[1].map((opt) => {
                  let value, label
                  for (let key in opt){
                    if (key === fieldGroup.templateOptions.columnValue) {
                      value = opt[key]
                    }

                    if (key === fieldGroup.templateOptions.columnLabel){
                      label = opt[key]
                    }
                  }

                  return {value, label}
                })
              }
            } else  if (fieldGroup?.type === 'formly-autocomplete-type' && fieldGroup.templateOptions?.refTable) {
              // set new item number (article) event function
              fieldGroup.templateOptions.newItmNumEvent = (event) => this.addItem(event)
            }
          }
        }
      }
    }

    for (const key in this.modalData) {
      if (this.form.controls[key]) {
        this.form.controls[key].setValue(this.modalData[key])
      }
    }
  }

  //TODO: I not sure that we need this!?
  toggleDisabledOption() {
    let i = 0;
    for (let row of this.formlyFieldConfig) {

      if (row?.fieldGroup) {
        let j = 0;
        for (let fieldGroup of row.fieldGroup) {
          if (this.formlyFieldConfig[i].fieldGroup[j].templateOptions) {
            this.formlyFieldConfig[i].fieldGroup[j].templateOptions.newItemMode = this.newItemMode ? 'true' : 'false';
            this.formlyFieldConfig[i].fieldGroup[j].expressionProperties = {
              'templateOptions.disabled':
                this.formlyFieldConfig[i].fieldGroup[j].templateOptions.newItemMode === 'true' ? 'false' : 'true',
            };
            delete this.formlyFieldConfig[i].fieldGroup[j].templateOptions.disabled;
            this.formlyFieldConfig[i].fieldGroup[j].templateOptions.disabled = false;
          } else {
            console.log('templateOptions is not defined for: i: ', i + ' - j: ' + j);
          }
          j++;
        }
      }
      i++;
    }
    this.setDisabled(false);
  }

  /**
   * reset form, model and fields
   */
  resetForm() {
    this.form = new FormGroup({});
    this.modalData = null
    this.formlyFieldConfig = []
  }

  onCancel(): void {
    this.reset.emit(null);
    this.emitTmpMainTableForm.emit(null)
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
      this.submit.emit(this.form);

      this.resetForm()
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  bindValidations(validations: any): null|ValidatorFn {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        validList.push(valid.validator);
      });
      return Validators.compose(validList);
    }
    return null;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  shouldWaitOnTogetherData(): boolean {
    if (!this.togetherData) {
      return false
    } else {
      for (let key in this.togetherData) {
        if (this.togetherData[key].data?.length < 1) {
          return true
        }
      }

      return false
    }
  }

  ngOnDestroy(): void {
    if (this.newItemMode) {
      this.emitTmpMainTableForm.emit(this.form)
    }
  }

  // TODO: delete all under after refactoring all view components
  /**
   * after view is initialized
   */
  public ngAfterViewInit(): void {
    //this.fetchDataService.setDataObs(undefined, undefined, ComponentViewTypes.DynamicForm);
  }

  setModel(model: SoasModel) {
    this.modalData = model;
  }

  setFields(fields: FormlyFieldConfig[]) {
    this.formlyFieldConfig = fields;
  }

  getDisabledFlag() {
    return this.disabledFlag;
  }

  public setDisabled(flag: boolean) {
    this.disabledFlag = flag;
  }

  public removeAllFields() {
    this.formlyFieldConfig = [];
  }

  public getFields() {
    return this.formlyFieldConfig;
  }

  public getControls() {
    return this.form.controls;
  }

  // public isFormInitialized() {
  //   return !!(this.model && this.model.length);
  // }

  public resetOptions() {
    this.options.resetModel();
  }

  get value() {
    return this.form.value;
  }

  /**
   * add new item number (article) to order positions
   *
   * @param itemNumber
   */
  async addItem(itemNumber: string) {

    const order = await this.getModelData(this.constantsService.REFTABLE_ORDERS,
      this.constantsService.REFTABLE_ORDERS_COLUMN,
      this.modalData[this.constantsService.REFTABLE_ORDERS_COLUMN])
    const currency = await this.getModelData(this.constantsService.REFTABLE_CURRENCIES,
      this.constantsService.REFTABLE_CURRENCIES_COLUMN,
      order.table[1][0]['CURRENCY'])
    const article = await this.getModelData(this.constantsService.REFTABLE_ARTICLES,
      this.constantsService.REFTABLE_ARTICLES_COLUMN,
      itemNumber)
    const prilist = await this.getModelData(this.constantsService.REFTABLE_PRILISTS,
      "" + this.constantsService.REFTABLE_PRILISTS_COLUMN + "," +
      "" + this.constantsService.REFTABLE_PRILISTS_COLUMN_CUSGRP,
      "" + itemNumber + "," + "" + "DE_B2C",
      this.constantsService.REFTABLE_PRILISTS_COLUMN_PRILIST,
      'DESC')

    this.form.controls['ITMDES'].setValue(article.table[1][0]['ITMDES'])
    this.form.controls['CATEGORY_SOAS'].setValue(article.table[1][0]['CATEGORY_SOAS'])

    const fixedPriceBru = this.helperService.getFixedPrice(prilist.table[1][0]['PRICE_BRU'])
    const fiexdPriceNet = this.helperService.getFixedPrice(prilist.table[1][0]['PRICE_NET'])
    this.form.controls['PRICE_BRU'].setValue(fixedPriceBru)
    this.form.controls['PRICE_NET'].setValue(fiexdPriceNet)
    const fixedTaxAmount = this.helperService.calcTaxAmount(fixedPriceBru, fiexdPriceNet)
    this.form.controls['TAX_AMOUNT'].setValue(fixedTaxAmount)

    this.form.controls['CURRENCY'].setValue(currency.table[1][0]['CURRENCY_NAME'])
  }

  private async getModelData(refTable: string,
                             searchColumn: string,
                             searchText: string,
                             sortColumn?: string,
                             sortDirection?: string) {
    let params = {
      modelName: modelNames[refTable],
      query: {
        exactSearchColumn: searchColumn,
        exactSearchText: searchText
      }
    }
    if (sortColumn && sortDirection) {
      params.query['sort'] = {
        column: sortColumn,
        direction: sortDirection
      }
    }
    return await this.tableDataService.getModelEndpoint(params);
  }
}
