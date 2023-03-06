import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild
} from '@angular/core';
import {TableDataService} from '../../../_services/table-data.service';
import {Router} from '@angular/router';
import {ConstantsService, SoasModel} from '../../../_services/constants.service';
import {DynamicFormComponent} from '../../../dynamic-view/dynamic-form/dynamic-form.component';
import {FormlyFieldConfig} from '@ngx-formly/core';

@Component({
  exportAs: 'customForm',
  selector: 'custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.css']
})

/**
 * CustomFormComponent - custom form for the detail (right) form view.
 *
 * Used by: CountriesComponent, CurrenciesComponent, ArticlesComponent, PaymentTermsComponent, ProvidersComponent,
 * DetailViewTabGroupComponent
 */
export class CustomFormComponent implements AfterViewInit {

  @Input() loadForm: Function;
  @Input() resetForm: Function;
  @Input() saveForm: Function;

  refTable: string;

  // @ts-ignore
  @ViewChild(DynamicFormComponent) customForm: DynamicFormComponent;

  // flag if form view should be shown after view is initialized
  isFormViewLoaded: boolean;

  selRow: SoasModel;
  // local storage key to reset at close function
  selItemLocalStorageKey: string;
  newItemMode: boolean;
  formTitle: string;
  createTitle: string;
  formDisabledFlag: boolean;
  createTooltip: string;

  // flag to determine form changes: true = show form values; false = hide values
  customFormChanged: boolean;

  isLoadingResults: boolean = false;
  isRateLimitReached: boolean = false;

  constructor(private tableDataService: TableDataService,
              private router: Router,
              private CONSTANTS: ConstantsService,
              private cd: ChangeDetectorRef
  ) {
    this.isFormViewLoaded = false;
  }

  /**
   * after view is initialized
   */
  public ngAfterViewInit(): void {
    this.isFormViewLoaded = true;
    // trigger manually ChangeDetectorRef to prevent NG0100 error
    // @link: https://angular.io/errors/NG0100
    this.cd.detectChanges();
  }

  setLabels(formTitle: string, createTitle: string): void {
    this.formTitle = formTitle;
    this.createTitle = createTitle;
  }

  initForm(newItemMode: boolean, refTable: string): void {
    this.setNewItem(newItemMode);
    this.setChanged(false);
    this.setRefTable(refTable);
  }

  setNewItem(flag: boolean): void {
    this.newItemMode = flag;
  }

  /**
   * set form data (model and fields)
   *
   * @param regConfig
   * @param formDisabledFlag - optional
   */
  setFormData(regConfig: {model: any, fields: FormlyFieldConfig[]}, formDisabledFlag?: boolean): { result: boolean } {
    if (this.customForm) {
      this.customForm.setModel(regConfig.model);
      this.customForm.setFields(regConfig.fields);
      // this.customForm.setDisabled(this.formDisabledFlag);
      this.setIsLoadingResults(false);
      return {result: true};
    } else {
      console.log(new Error('customForm is not defined'));
      return {result: false};
    }
  }

  private refreshTableViews(): void {
    this.resetForm();
  }

  onFormSubmit(): void {
    this.saveForm();
  }

  createItem(): void {}

  async close(): Promise<void> {
    if (this.newItemMode) {
      // ToDo: load data at close, without refresh the table...
      // this.getArticleFormData(selItemNum);
      this.refreshTableViews();
      this.newItemMode = false;
    } else {
      this.resetSelection();
      await this.tableDataService.removeAllTableLocks(true, '', '');
    }
  }

  /**
   * reset selection by setting selected row to undefined and by removing local storage items
   */
  resetSelection(): void {
    this.selRow = undefined;
    if (this.selItemLocalStorageKey) {
      localStorage.removeItem(this.selItemLocalStorageKey);
    }
    this.resetForm();
  }

  setChanged(flag: boolean): void {
    this.customFormChanged = flag;
  }

  setRefTable(table: string): void {
    this.refTable = table;
  }

  setSelectedRow(selRow: SoasModel): void {
    this.selRow = selRow;
  }

  /**
   * empty form by set selected row to undefined
   */
  emptyForm(): void {
    this.selRow = undefined;
  }

  setIsLoadingResults(flag: boolean): void {
    this.isLoadingResults = flag;
  }

  setLocalStorageKey(selItemLocalStorageKey: string) {
    this.selItemLocalStorageKey = selItemLocalStorageKey;
  }
}
