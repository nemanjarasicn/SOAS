// import {Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
// import {TableDataService} from "../../../_services/table-data.service";
// import {Router} from "@angular/router";
// import {ConstantsService} from "../../../_services/constants.service";
// import {FormService} from "../../../_services/form.service";
// import {DynamicTwoColumnsFormComponent} from "../../../dynamic-view/dynamic-two-columns-form/dynamic-two-columns-form.component";
// import {AttributePDialogComponent} from "../../articles/attribute-p-dialog/attribute-p-dialog.component";
// import {FormlyFieldConfig} from "@ngx-formly/core";
// import {TranslateItPipe} from "../../../shared/pipes/translate-it.pipe";
//
// @Component({
//   selector: 'app-custom-two-columns-form',
//   templateUrl: './custom-two-columns-form.component.html',
//   styleUrls: ['./custom-two-columns-form.component.css'],
//   providers: [TranslateItPipe]
// })
//
// /**
//  * @deprecated
//  */
// export class CustomTwoColumnsFormComponent implements OnInit {
//
//   @Input() loadForm: Function;
//   @Input() resetForm: Function;
//   @Input() saveForm: Function;
//
//   // New position dialog
//   @ViewChildren(AttributePDialogComponent) attributePDialogComponent !: QueryList<AttributePDialogComponent>;
//   // @ts-ignore
//   @ViewChild(DynamicTwoColumnsFormComponent) twoColumnsCustomForm: DynamicTwoColumnsFormComponent;
//
//   customFormConfig: any[]; // FormlyFieldConfig|FieldConfig
//   selRow: any;
//   refTable: string = '';
//   newItemMode: boolean;
//   formTitle: string;
//   createTitle: string;
//   formConfig: any;
//   formDisabledFlag: boolean;
//   createTooltip: string;
//   articlesDetailsShow: boolean;
//
//   paymentTerms = [{name: "Bitte auswählen", value: undefined}];
//
//   // flag to determine form changes: true = show form values; false = hide values
//   customFormChanged: boolean;
//
//   constructor(private tableDataService: TableDataService,
//               private router: Router,
//               private CONSTANTS: ConstantsService,
//               private formService: FormService
//               // public translatePipe: TranslateItPipe
//   ) {
//     console.log('custom-two-columns-form-component - CONSTRUCTOR...');
//   }
//
//   ngOnInit() {}
//
//   public setLabels(formTitle, createTitle) {
//     this.formTitle = formTitle;
//     this.createTitle = createTitle;
//   }
//
//   public initForm(newItemMode: boolean, refTable: string) {
//     this.setNewItem(newItemMode);
//     this.setChanged(false);
//     this.customFormConfig = undefined;
//     this.setRefTable(refTable);
//   }
//
//   public setNewItem(flag) {
//     this.newItemMode = flag;
//   }
//
//   setPaymentTerms(pt) {
//     this.paymentTerms = pt;
//   }
//
//   public setFormData(regConfig: FormlyFieldConfig[], dbData: any, formDisabledFlag: boolean) {
//     this.formDisabledFlag = formDisabledFlag;
//     console.log('custom-form-component setFormData - this.customFormConfig: ', this.customFormConfig);
//     // console.log('customForm set1: ', this.customForm);
//     console.log('regConfig: ', regConfig);
//     // console.log('dbData: ', dbData);
//     // console.log('selTableRow: ', this.selRow);
//
//     this.customFormConfig = regConfig;
//
//     setTimeout(() => {
//       // disable/set not editable form, if table is locked
//       if (this.twoColumnsCustomForm) {
//         // this.customForm.fields = regConfig;
//         // this.twoColumnsCustomForm.setModel(regConfig.model);
//         // this.twoColumnsCustomForm.setFields(regConfig.fields);
//         this.twoColumnsCustomForm.setDisabled(this.formDisabledFlag);
//         // this.customForm.validateAllFormFields(this.customForm.form);
//         // this.customForm.form.markAsPristine();
//       }
//
//     });
//
//
//     // setTimeout(() => {
//     //   this.customFormConfig = regConfig;
//     //   this.formService.patchFormValues(this.twoColumnsCustomForm, regConfig, this.newItemMode);
//     //   setTimeout(() => {
//     //     // disable/set not editable form, if table is locked
//     //     if (this.twoColumnsCustomForm) {
//     //       this.twoColumnsCustomForm.setDisabled(this.formDisabledFlag);
//     //       // this.customForm.validateAllFormFields(this.customForm.form);
//     //       // this.customForm.form.markAsPristine();
//     //     }
//     //   });
//     // });
//   }
//
//   /**
//    * @deprecated
//    * @param regConfig
//    * @param dbData
//    * @param formDisabledFlag
//    */
//   /*
//   public setFormDataOld(regConfig: FieldConfig[], dbData: any, formDisabledFlag: boolean) {
//     this.formDisabledFlag = formDisabledFlag;
//     console.log('custom-form-component setFormDataOld - this.customFormConfig: ', this.customFormConfig);
//     // console.log('customForm set1: ', this.customForm);
//     console.log('regConfig: ', regConfig);
//     // console.log('dbData: ', dbData);
//     // console.log('selTableRow: ', this.selRow);
//
//     setTimeout(() => {
//       this.customFormConfig = regConfig;
//       // if (this.twoColumnsCustomForm) {
//         this.formService.patchFormValues(this.twoColumnsCustomForm, regConfig, this.newItemMode);
//         setTimeout(() => {
//           // disable/set not editable form, if table is locked
//           if (this.twoColumnsCustomForm) {
//             this.twoColumnsCustomForm.setDisabled(this.formDisabledFlag);
//             // this.customForm.validateAllFormFields(this.customForm.form);
//             // this.customForm.form.markAsPristine();
//           }
//         });
//       // } else {
//       //   console.log("this.twoColumnsCustomForm is empty!");
//       // }
//     });
//   }
//    */
//
//   private refreshTableViews() {
//     this.resetForm();
//   }
//
//   onFormSubmit($event: any) {
//     console.log('save - onArticleAttributeFormSubmit...');
//     this.saveForm();
//   }
//
//   createItem() {
//     if (this.attributePDialogComponent && this.attributePDialogComponent.first) {
//       let articleAttributesNames: String[] = []; //Attributes[];
//       console.log("custom-two-columns-form this.customFormConfig: ", this.customFormConfig);
//       for(let item in this.customFormConfig) {
//         articleAttributesNames.push(this.customFormConfig[item].name);
//       }
//       this.attributePDialogComponent.first.setArticleAttributesNames(articleAttributesNames);
//       this.attributePDialogComponent.first.setShowDialog(true);
//     }
//   }
//
//   async close() {
//     console.log('Close form... ', this.newItemMode);
//     // console.log('this.refTable: ', this.refTable);
//     if (this.newItemMode) {
//       // ToDo: load data at close, without refresh the table...
//       // this.getArticleFormData(selItemNum);
//       this.refreshTableViews();
//       if (this.newItemMode) {
//         this.newItemMode = false;
//       }
//     } else {
//       this.resetSelection();
//       await this.tableDataService.removeAllTableLocks(true, "", "");
//     }
//   }
//
//   public resetSelection() {
//     console.log('resetSelection...');
//     this.selRow = undefined;
//     // Is set for ArticlesComponent by default
//     let constantToRemove = this.CONSTANTS.LS_SEL_ITEM_NUMBER;
//     switch (this.refTable) {
//       case(this.CONSTANTS.REFTABLE_ARTICLES) :
//         constantToRemove = this.CONSTANTS.LS_SEL_ITEM_ID;
//         localStorage.removeItem(constantToRemove);
//         break;
//       case(this.CONSTANTS.REFTABLE_COUNTRIES) :
//         constantToRemove = this.CONSTANTS.LS_SEL_COUNTRY_ID;
//         break;
//       case(this.CONSTANTS.REFTABLE_CURRENCIES) :
//         constantToRemove = this.CONSTANTS.LS_SEL_CURRENCY_ID;
//         break;
//       case(this.CONSTANTS.REFTABLE_PAYMENT_TERMS) :
//         constantToRemove = this.CONSTANTS.LS_SEL_PAYMENT_TERM_ID;
//         break;
//       case(this.CONSTANTS.REFTABLE_PROVIDERS) :
//         constantToRemove = this.CONSTANTS.LS_SEL_PROVIDERS_NAME;
//         break;
//       case(this.CONSTANTS.REFTABLE_CSV_TEMPLATE_CONFIG) :
//         constantToRemove = this.CONSTANTS.LS_SEL_COUNTRY_ID;
//         break;
//       default:
//         break;
//     }
//     localStorage.removeItem(constantToRemove);
//     this.resetForm();
//   }
//
//   public setChanged(flag) {
//     this.customFormChanged = flag;
//   }
//
//   public setRefTable(table) {
//     this.refTable = table;
//   }
//
//   setSelCustomerRow(selRow) {
//     this.selRow = selRow;
//   }
//
//   public emptyForms(full = true) {
//     if (full) {
//       this.selRow = undefined;
//     }
//     if (this.twoColumnsCustomForm && this.twoColumnsCustomForm.form) {
//       console.log('Reset articles form now...');
//       setTimeout(() => {
//         this.customFormConfig = undefined;
//       });
//     } else {
//       console.log('Article form is not defined... ');
//     }
//   }
//
//   /**
//    * Bind update view function, that can be call from from p-dialog, after an item was saved
//    */
//   get attrViewUpdateFunc() {
//     return this.attrViewUpdate.bind(this);
//   }
//
//   /**
//    * refresh table views of this class, after p-dialog item was successfully saved to db
//    */
//   attrViewUpdate() {
//     console.log('attrViewUpdate...');
//     this.refreshTableViews();
//   }
// }
