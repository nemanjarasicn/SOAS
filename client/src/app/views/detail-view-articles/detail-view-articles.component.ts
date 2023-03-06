// import {Component, Input, OnInit, ViewChild} from '@angular/core';
// import {DynamicFormComponent} from "../../dynamic-view/dynamic-form/dynamic-form.component";
// import {Article} from "../../models/article";
// import {TableDataService} from "../../_services/table-data.service";
// import {Router} from "@angular/router";
// import {ConstantsService} from "../../_services/constants.service";
// import {MatTabChangeEvent} from "@angular/material/tabs";
// import {AbstractControl, Validators} from "@angular/forms";
// import {WhStock} from "../../models/wh-stock";
// import {WhLocation} from "../../models/wh-location";
// import {PriceListSales} from "../../models/price-list-sales";
// import {Providers} from "../../models/providers";
// import {Currencies} from "../../models/currencies";
// import {PaymentTerms} from "../../models/payment-terms";
// import {Countries} from "../../models/countries";
// import {MessageService} from "primeng/api";
// import {FormlyFieldConfig} from "@ngx-formly/core";
// import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
//
// /**
//  * @deprecated Class is currently not used
//  */
//
// @Component({
//   selector: 'app-detail-view-articles',
//   templateUrl: './detail-view-articles.component.html',
//   styleUrls: ['./detail-view-articles.component.css'],
//   providers: [TranslateItPipe, MessageService]
// })
// export class DetailViewArticlesComponent implements OnInit {
//
//   @Input() articlesResetForm: Function;
//   refTable = 'articles';
//
//   // @ts-ignore
//   @ViewChild(DynamicFormComponent) articleForm: DynamicFormComponent;
//   articleFormConfig: FormlyFieldConfig[];
//   articleAttributesFormConfig: FormlyFieldConfig[];
//   emptyArticleFormConfig: FormlyFieldConfig[];
//   formDisabledFlag: boolean;
//
//   languages =  [ { name: "Bitte auswählen", value: undefined } ];
//   currencies = [ { name: "Bitte auswählen", value: undefined } ];
//
//     // Empty article
//   articleModel = new Article(0,false, '', '', '',
//     '', '', 0, 0, 0,0,0,0,0,false,
//     false, '');
//
//   articleShortModel = new Article(0,false, '', '', '',
//     '', '', 0, 0, 0,0,0,0,0,false, false, '');
//
//   // Empty stock
//   whStockModel = new WhStock('', '', '', '', '');
//
//   // Empty location
//   whLocationModel = new WhLocation('', '', '',
//     '', '', '','','');
//
//   // Empty prilist
//   pricelistModel = new PriceListSales(0,'', 0, 0,this.currencies[0].value, '', '',
//     this.CONSTANTS.PRILISTS_START_DATE, this.CONSTANTS.PRILISTS_END_DATE, this.CONSTANTS.PRILISTS_PRIORITY);
//
//   // Empty payment term
//   paymentTermModel = new PaymentTerms('', '', '',true, false);
//
//   // Empty payment method
//   providersModel = new Providers('', '', this.languages[0].value,'','','');
//
//   // Empty currency
//   currencyModel = new Currencies(0, '', '','');
//
//   // Empty currency
//   countryModel = new Countries(0, '', '');
//
//   selArticlesRow: any;
//   setArticlesClickedRow: Function;
//
//   newArticlesMode: boolean = false;
//   newArticleAttributesMode: boolean = false;
//
//   selCurrentTabName : string;
//
//   formTitle: string;
//   formTabTitle: string;
//
//   articleTitle: string;
//   articlesDetailsTitle: string;
//   articlesDetailsShow: boolean;
//
//   createTooltip: string;
//   createArticleTitle: string;
//   commentsTitle: string;
//
//   // flag to determine form changes: true = show form values; false = hide values
//   articleFormChanged: boolean;
//
//   constructor(private tableDataService: TableDataService,
//               private router: Router,
//               private CONSTANTS: ConstantsService,
//               public translatePipe: TranslateItPipe,
//               private messageService: MessageService) {
//     this.setLabels('TAB_TITLE_ARTICLE_DATA','Artikelformular','ARTICLE','ATTRIBUTES');
//     this.createTooltip = 'ADD_NEW_ARTICLE';
//     this.commentsTitle = 'COMMENTS';
//     this.articleFormChanged = false;
//     this.articlesDetailsShow = false;
//     console.log('detail-view-articles - CONSTRUCTOR...');
//   }
//
//   ngOnInit() {
//     setTimeout(async () => {
//       await this.setCurrencies();
//       await this.setLanguages();
//     });
//     // form is not disabled by default
//     this.formDisabledFlag = false;
//   }
//
//   ngAfterViewInit() {
//   }
//
//   onArticleTabChange($event: MatTabChangeEvent) {
//     const currTab = $event.tab.textLabel;
//     this.selCurrentTabName = currTab;
//     console.log(currTab);
//     switch (currTab) {
//       case(this.translatePipe.transform(this.articleTitle)):
//         console.log("Article");
//         break;
//       case(this.translatePipe.transform(this.articlesDetailsTitle)):
//         console.log("Article-Details");
//         //this.getCustomerAddrFormData(this.selCustomerRow.CUSTOMERS_NUMBER, this.addrColumnTypes[0]);
//         break;
//       default:
//         break;
//     }
//   }
//
//   public setRefTable(table) {
//     this.refTable = table;
//   }
//
//   public setNewItem(flag) {
//     this.newArticlesMode = flag;
//   }
//
//   public async getArticleFormData(articleNumber) {
//     // this.emptyForms();
//     let customerColumn = 'ITMNUM';
//     let secondColumn = undefined;
//     let secondId = undefined;
//     this.articlesDetailsShow = false;
//     switch (this.refTable) {
//       case(this.CONSTANTS.REFTABLE_ARTICLES) :
//         this.articlesDetailsShow = true;
//         break;
//       case(this.CONSTANTS.REFTABLE_WAREHOUSE_LOCATIONS) :
//         customerColumn = 'WAREHOUSE_NAME';
//         break;
//       case(this.CONSTANTS.REFTABLE_PROVIDERS) :
//         customerColumn = 'PROVIDERS_NAME';
//         break;
//       case(this.CONSTANTS.REFTABLE_CURRENCIES) :
//         customerColumn = 'CURRENCY_ID';
//         break;
//       case(this.CONSTANTS.REFTABLE_PAYMENT_TERMS) :
//         customerColumn = 'PAYMENT_TERM_ID';
//         break;
//       case(this.CONSTANTS.REFTABLE_COUNTRIES) :
//         customerColumn = 'COUNTRY_ID';
//         break;
//       default:
//         break;
//     }
//     let refTableTitle: undefined | string = undefined;
//     let customerNumber: undefined | string = undefined;
//     const __ret = this.getTableAndDataset(refTableTitle, customerNumber);
//     refTableTitle = __ret.refTableTitle;
//     customerNumber = __ret.customerNumber;
//     if (refTableTitle !== undefined && customerNumber !== undefined) {
//       let self = this;
//       let lockedMessage: string = this.translatePipe.transform('TABLE_LOCK_MESSAGE_LOCKED');
//       let isLockedResult = await this.tableDataService.isTableLocked(refTableTitle, articleNumber, lockedMessage);
//       self.formDisabledFlag = !!isLockedResult;
//       if (articleNumber !== "") {
//         let createNewItemMode: boolean = self.newArticlesMode || self.newArticleAttributesMode;
//         let dbData = await self.tableDataService.getFormDataByCustomersNumber(self.refTable, customerColumn,
//           articleNumber, secondColumn, secondId, createNewItemMode);
//         if (!dbData) {
//           return;
//         }
//         if (!self.newArticleAttributesMode) {
//           self.articleAttributesFormConfig = undefined;
//           // set form config
//           let regConfig: FormlyFieldConfig[] = [];
//           for (let fItem in dbData['formConfig']) {
//             for (let fIElm in dbData['formConfig'][fItem]) {
//               let formConfigItem = dbData['formConfig'][fItem][fIElm];
//               regConfig = this.setRegConfig(formConfigItem, regConfig);
//             }
//           }
//           if (self.articleFormConfig == undefined) {
//             self.articleFormConfig = regConfig;
//           } else {
//             // Add values to the form
//             setTimeout(() => {
//               if (self.articleForm && self.articleForm.form) {
//                 self.setFormValues(dbData);
//               }
//             });
//           }
//           setTimeout(() => {
//             // disable/set not editable form, if table is locked
//             if (self.articleForm) {
//               self.articleForm.setDisabled(self.formDisabledFlag);
//             }
//           });
//         } else {
//           this.setRegConfigForAttributes(dbData);
//         }
//       } else {
//         throw new Error("articleNumber is empty...");
//       }
//     }
//   }
//
//   private setRegConfigForAttributes(dbData: {}) {
//     this.articleFormConfig = undefined;
//     this.articleForm = undefined;
//     // new article attribute mode
//     let regConfig: FormlyFieldConfig[] = [];
//     let currOptions = this.getCurrOptions(this);
//     let finalCurrOptions = [{name: "Bitte auswählen", value: undefined}];
//     let found: boolean = false;
//     for (let cOItem in currOptions) {
//       found = false;
//       for (let fItem in dbData['formConfig']) {
//         for (let fIElm in dbData['formConfig'][fItem]) {
//           if (dbData['formConfig'][fItem][fIElm].name.length > 5 &&
//             dbData['formConfig'][fItem][fIElm].name.substr(0, 5) === 'ATTR_') {
//             if ((dbData['formConfig'][fItem][fIElm].name === currOptions[cOItem].value)) {
//               console.log("FOUND... ", dbData['formConfig'][fItem][fIElm].name);
//               found = true;
//             }
//           }
//         }
//       }
//       if (!found) {
//         finalCurrOptions.push({
//           name: currOptions[cOItem].name,
//           value: currOptions[cOItem].value
//         });
//       }
//     }
//     let configObj: any = {
//       type: 'select',
//       label: 'Attribute Typ',
//       inputType: 'text',
//       name: 'ATTRIBUTE_NAME',
//       value: "",
//       options: finalCurrOptions,
//       readonly: false,
//       validations: [
//         {
//           name: "required",
//           validator: Validators.nullValidator,
//           message: "Required"
//         },
//         {
//           name: "pattern",
//           validator: Validators.nullValidator,
//           message: "Accept text and numbers"
//         }
//       ]
//     };
//     regConfig.push(configObj);
//     configObj = {
//       type: 'input',
//       label: 'Attribute Name',
//       inputType: 'text',
//       name: 'ATTRIBUTE_DATA',
//       value: "",
//       options: currOptions,
//       readonly: false,
//       validations: [
//         {
//           name: "required",
//           validator: Validators.nullValidator,
//           message: "Required"
//         },
//         {
//           name: "pattern",
//           validator: Validators.nullValidator,
//           message: "Accept text and numbers"
//         }
//       ]
//     };
//     regConfig.push(configObj);
//     if (this.articleAttributesFormConfig == undefined) {
//       this.articleAttributesFormConfig = regConfig;
//     }
//   }
//
//   private setRegConfig(formConfigItem, regConfig: FormlyFieldConfig[]) {
//     let validate = true;
//     let currOptions = null;
//     let currValue = formConfigItem.value;
//     if (typeof currValue === "boolean") {
//       currValue = currValue ? true : false;
//       validate = false;
//     }
//     let validatorFlag = (formConfigItem.validations[0].validator === 'required') ?
//       Validators.required : Validators.nullValidator;
//     let fieldReadonly = false;
//     // if new component mode, empty fields
//     if ((formConfigItem.name === 'ITMNUM' ||
//       formConfigItem.name === 'ITMDES' ||
//       formConfigItem.name === 'ITMDES_UC' ||
//       formConfigItem.name === 'CROSSSELLING_DATA' ||
//       formConfigItem.name === 'CATEGORY_SOAS' ||
//       formConfigItem.name === 'PROVIDERS_NAME') && this.newArticlesMode) {
//       formConfigItem.value = "";
//     }
//     if (formConfigItem.name === "CURRENCY") {
//       if (this.newArticlesMode) {
//         currValue = undefined;
//       } else {
//         for (let cur in this.currencies) {
//           if (formConfigItem.value === this.currencies[cur].name) {
//             currValue = this.currencies[cur].value;
//           }
//         }
//       }
//       currOptions = this.currencies;
//     }
//     if (formConfigItem.name === "LANGUAGE") {
//       if (this.newArticlesMode) {
//         currValue = undefined;
//       } else {
//         for (let cur in this.languages) {
//           if (formConfigItem.value === this.languages[cur].name) {
//             currValue = this.languages[cur].value;
//           }
//         }
//       }
//       currOptions = this.languages;
//     }
//     if (formConfigItem.name === "ID" ||
//       formConfigItem.name === "CURRENCY_ID") {
//       fieldReadonly = true;
//       validatorFlag = Validators.nullValidator;
//     }
//     let fieldType = formConfigItem.type;
//     if (formConfigItem.name === "PAYMENT_TERM_ID") {
//       fieldType = 'input';
//     }
//     if (formConfigItem.name === "PAYMENT_TERM_COMMENT") {
//       validatorFlag = Validators.nullValidator;
//     }
//     if ((formConfigItem.name === "CURRENCY_ID") && this.newArticlesMode) {
//       currValue = this.translatePipe.transform('WILL_BE_AUTO_GENERATED');
//       formConfigItem.value = currValue;
//     }
//     if (validate) {
//       let configObj = {
//         type: fieldType,
//         label: formConfigItem.label,
//         inputType: formConfigItem.inputType,
//         name: formConfigItem.name,
//         value: currValue,
//         options: currOptions,
//         readonly: fieldReadonly,
//         validations: [
//           {
//             name: "required",
//             validator: validatorFlag,
//             message: formConfigItem.label + " " + this.translatePipe.transform("Required")
//           },
//           {
//             name: "pattern",
//             validator: (formConfigItem.validations[1].validator !== '') ?
//               Validators.pattern(this.CONSTANTS.PATTERN_CHARACTERS_UMLAUTS_NUMBERS_SPACE) :
//               Validators.nullValidator,
//             message: "Accept text and numbers"
//           }
//         ]
//       };
//       regConfig.push(configObj);
//     } else {
//       // checkbox
//       let configObj = {
//         type: formConfigItem.type,
//         label: formConfigItem.label,
//         name: formConfigItem.name,
//         value: currValue
//       };
//       regConfig.push(configObj);
//     }
//     return regConfig;
//   }
//
//   private getCurrOptions(self: this) {
//     return [{name: self.translatePipe.transform("ATTR_BASIN_TYPE"), value: "ATTR_BASIN_TYPE"},
//       {name: self.translatePipe.transform("ATTR_BRAND"), value: "ATTR_BRAND"},
//       {
//         name: self.translatePipe.transform("ATTR_CATEGORY_0"),
//         value: "ATTR_CATEGORY_0"
//       }, {name: self.translatePipe.transform("ATTR_CATEGORY_1"), value: "ATTR_CATEGORY_1"},
//       {
//         name: self.translatePipe.transform("ATTR_CATEGORY_2"),
//         value: "ATTR_CATEGORY_2"
//       }, {name: self.translatePipe.transform("ATTR_CATEGORY_3"), value: "ATTR_CATEGORY_3"},
//       {
//         name: self.translatePipe.transform("ATTR_CATEGORY_4"),
//         value: "ATTR_CATEGORY_4"
//       }, {name: self.translatePipe.transform("ATTR_CATEGORY_5"), value: "ATTR_CATEGORY_5"},
//       {
//         name: self.translatePipe.transform("ATTR_CATEGORY_6"),
//         value: "ATTR_CATEGORY_6"
//       }, {name: self.translatePipe.transform("ATTR_CATEGORY_7"), value: "ATTR_CATEGORY_7"},
//       {
//         name: self.translatePipe.transform("ATTR_CATEGORY_8"),
//         value: "ATTR_CATEGORY_8"
//       }, {name: self.translatePipe.transform("ATTR_CATEGORY_9"), value: "ATTR_CATEGORY_9"},
//       {name: self.translatePipe.transform("ATTR_COLOR"), value: "ATTR_COLOR"},
//       {
//         name: self.translatePipe.transform("ATTR_CRAFT"),
//         value: "ATTR_CRAFT"
//       }, {name: self.translatePipe.transform("ATTR_GROUP"), value: "ATTR_GROUP"},
//       {
//         name: self.translatePipe.transform("ATTR_FEATURE"),
//         value: "ATTR_FEATURE"
//       }, {name: self.translatePipe.transform("ATTR_YOUTUBE"), value: "ATTR_YOUTUBE"},
//       {name: self.translatePipe.transform("ATTR_X"), value: "ATTR_X"}, {
//         name: self.translatePipe.transform("ATTR_Y"),
//         value: "ATTR_Y"
//       },
//       {name: self.translatePipe.transform("ATTR_Z"), value: "ATTR_Z"}, {
//         name: self.translatePipe.transform("ATTR_WP_BM"),
//         value: "ATTR_WP_BM"
//       }];
//   }
//
//   onArticleFormSubmit($event: any) {
//     console.log('SAVE - onArticleFormSubmit...');
//     this.save();
//   }
//
//   createArticleItem(param) {
//
//   }
//
//   async close() {
//     console.log('Close form... ', this.newArticlesMode + ' - ' + this.newArticleAttributesMode);
//     if (this.newArticlesMode || this.newArticleAttributesMode) {
//       let selItemNum = undefined;
//       if (this.refTable === this.CONSTANTS.REFTABLE_ARTICLES || this.refTable === this.CONSTANTS.REFTABLE_PRILISTS) {
//         selItemNum = localStorage.getItem(this.CONSTANTS.LS_SEL_ITEM_NUMBER);
//       } else if (this.refTable === this.CONSTANTS.REFTABLE_CURRENCIES) {
//         selItemNum = localStorage.getItem(this.CONSTANTS.LS_SEL_CURRENCY_ID);
//       } else if (this.refTable === this.CONSTANTS.REFTABLE_PROVIDERS) {
//         selItemNum = localStorage.getItem(this.CONSTANTS.LS_SEL_PROVIDERS_NAME);
//       } else if (this.refTable === this.CONSTANTS.REFTABLE_PAYMENT_TERMS) {
//         selItemNum = localStorage.getItem(this.CONSTANTS.LS_SEL_PAYMENT_TERM_ID);
//       } else if (this.refTable === this.CONSTANTS.REFTABLE_COUNTRIES) {
//         selItemNum = localStorage.getItem(this.CONSTANTS.LS_SEL_COUNTRY_ID);
//       }
//       if (selItemNum) {
//         this.getArticleFormData(selItemNum);
//       }
//       if (this.newArticlesMode) {
//         this.newArticlesMode = false;
//       } else if (this.newArticleAttributesMode) {
//         this.newArticleAttributesMode = false;
//       }
//     } else {
//       this.resetSelection();
//       await this.tableDataService.removeAllTableLocks(true, "", "");
//     }
//   }
//
//   // closeAddr(customersAddrForm: NgForm) {
//   //   console.log('Close ADDR form...');
//   //   this.resetSelection();
//   // }
//
//   public emptyForms(full = true) {
//     if (full) {
//       this.selArticlesRow = undefined;
//     }
//     if (this.articleForm && this.articleForm.form) {
//       // console.log('Reset articles form now...');
//       this.articleFormConfig = undefined;
//       // this.articleForm.form.setValue({});
//       // this.articleForm.form.reset();
//       // this.articleForm.form.clearValidators();
//       // this.articleForm.form.updateValueAndValidity();
//       // this.articleForm.form.markAsPristine();
//     } else {
//       // console.log('Article form is not defined... ');
//     }
//   }
//
//   public resetSelection() {
//     this.selArticlesRow = undefined;
//     let constantToRemove = this.CONSTANTS.LS_SEL_ITEM_NUMBER;
//     switch (this.refTable) {
//       case(this.CONSTANTS.REFTABLE_WAREHOUSE_LOCATIONS) :
//         constantToRemove = this.CONSTANTS.LS_SEL_WH_LOCATION_NAME;
//         break;
//       case(this.CONSTANTS.REFTABLE_PROVIDERS) :
//         constantToRemove = this.CONSTANTS.LS_SEL_PROVIDERS_NAME;
//         break;
//       case(this.CONSTANTS.REFTABLE_CURRENCIES) :
//         constantToRemove = this.CONSTANTS.LS_SEL_CURRENCY_ID;
//         break;
//       case(this.CONSTANTS.REFTABLE_PAYMENT_TERMS) :
//         constantToRemove = this.CONSTANTS.LS_SEL_PAYMENT_TERM_ID;
//         break;
//       case(this.CONSTANTS.REFTABLE_COUNTRIES) :
//         constantToRemove = this.CONSTANTS.LS_SEL_COUNTRY_ID;
//         break;
//       default:
//         break;
//     }
//     localStorage.removeItem(constantToRemove);
//     this.articlesResetForm();
//   }
//
//   /*******************************************
//    * HELPER FUNCTIONS
//    ******************************************/
//
//   setSelCustomerRow(selRow) {
//     this.selArticlesRow = selRow;
//   }
//
//   onTabChange($event: MatTabChangeEvent) {
//
//   }
//
//   public setLabels(formTabTitle, formTitle, articleTitle, articlesDetailsTitle) {
//     this.formTabTitle = formTabTitle;
//     this.formTitle = formTitle;
//     this.articleTitle = articleTitle;
//     this.articlesDetailsTitle = articlesDetailsTitle;
//   }
//
//   save() {
//     // console.log('Save...');
//     // let refTableTitle: undefined | string = undefined;
//     // let customerNumber: undefined | string = undefined;
//     // const __ret = this.getTableAndDataset(refTableTitle, customerNumber);
//     // refTableTitle = __ret.refTableTitle;
//     // customerNumber = __ret.customerNumber;
//     // if (refTableTitle !== undefined && customerNumber !== undefined) {
//     //   let self = this;
//     //   let lockedMessage: string =  this.translatePipe.transform('TABLE_LOCK_MESSAGE_LOCKED');
//     //   this.tableDataService.isTableLocked(refTableTitle, customerNumber, lockedMessage,async function (isLockedResult) {
//     //     if (isLockedResult) {
//     //       self.formDisabledFlag = true;
//     //     } else {
//     //       self.formDisabledFlag = false;
//     //       let formValues = self.articleForm.form.value;
//     //       let primaryKey = null;
//     //       let primaryValue = null;
//     //       let secondaryKey = null;
//     //       let secondaryValue = null;
//     //       let postFormValues = {};
//     //       let temp = undefined;
//     //       switch (self.refTable) {
//     //         case(self.CONSTANTS.REFTABLE_ARTICLES) :
//     //           primaryKey = self.CONSTANTS.REFTABLE_ARTICLES_COLUMN;
//     //           if (!self.newArticlesMode) {
//     //             primaryValue = localStorage.getItem(self.CONSTANTS.LS_SEL_ITEM_NUMBER);
//     //           }
//     //           if (!self.newArticleAttributesMode) {
//     //             console.log('Save articles');
//     //             for (let property in formValues) {
//     //               postFormValues[property.toUpperCase()] = formValues[property];
//     //             }
//     //             if (postFormValues['ID']) {
//     //               secondaryKey = self.CONSTANTS.REFTABLE_ARTICLES_SECONDARY_COLUMN;
//     //               secondaryValue = postFormValues['ID'];
//     //               delete postFormValues['ID'];
//     //             }
//     //             await self.tableDataService.setTableDataPromise({
//     //               refTable: self.refTable, tableName: self.refTable, dataArray: postFormValues, primaryKey: primaryKey,
//     //               primaryValue: primaryValue, newItemMode: self.newArticlesMode, secondaryKey: secondaryKey,
//     //               secondaryValue: secondaryValue
//     //             });
//     //             self.emptyForms();
//     //             self.tableDataService.redirectTo('//' + self.CONSTANTS.REFTABLE_ARTICLES);
//     //           } else {
//     //             console.log('Save articles attributes');
//
//                 /*
//                 let formValues = self.articleForm.form.value;
//                 // console.log("formValues: ", formValues);
//                 // console.log("primaryKey: ", primaryKey);
//                 // console.log("primaryValue: ", primaryValue);
//                 // console.log("secondaryKey: ", secondaryKey);
//                 // console.log("secondaryValue: ", secondaryValue);
//                 let itmBasisId = localStorage.getItem(self.CONSTANTS.LS_SEL_ITEM_ID);
//                 if (itmBasisId) {
//                   temp = self.tableDataService.setTableData(self.CONSTANTS.REFTABLE_ATTRIBUTES, formValues, primaryKey, primaryValue, true, secondaryKey, secondaryValue);
//                   temp.subscribe((dbData) => {
//                       // receive back new attribute id or get it at this point
//                       let attributeRelationData = {'ITEM_BASIS_ID': itmBasisId, 'ATTRIBUTE_ID': ""};
//                       temp = self.tableDataService.setTableData(self.CONSTANTS.REFTABLE_ATTRIBUTE_RELATIONS, attributeRelationData, primaryKey, primaryValue, true, secondaryKey, secondaryValue);
//                       temp.subscribe((dbData) => {
//                           self.emptyForms();
//                           self.tableDataService.redirectTo('//' + self.CONSTANTS.REFTABLE_ARTICLES);
//                         },
//                         (err: HttpErrorResponse) => {
//                           self.tableDataService.handleHttpError(err);
//                         });
//                     },
//                     (err: HttpErrorResponse) => {
//                       self.tableDataService.handleHttpError(err);
//                     });
//                 } else {
//                   throw new Error("LS_SEL_ITEM_ID is not set. Data not saved.")
//                 }
//                 */
//     /*
//               }
//               break;
//             case(self.CONSTANTS.REFTABLE_PROVIDERS) :
//               console.log('Save provider');
//               console.log('onCustomerFormSubmit...');
//               // post form data to server
//               // Convert form keys to db keys
//               for (let property in formValues) {
//                 postFormValues[property.toUpperCase()] = formValues[property];
//               }
//               primaryKey = self.CONSTANTS.REFTABLE_PROVIDERS_COLUMN;
//               if (!self.newArticlesMode) {
//                 primaryValue = localStorage.getItem(self.CONSTANTS.LS_SEL_PROVIDERS_NAME);
//               }
//               for (let cur in self.currencies) {
//                 if (postFormValues['CURRENCY'] === self.currencies[cur].name) {
//                   postFormValues['CURRENCY'] = self.currencies[cur].value;
//                 }
//               }
//               await self.tableDataService.setTableDataPromise({
//                 refTable: self.refTable, tableName: self.refTable, dataArray: postFormValues, primaryKey: primaryKey,
//                 primaryValue: primaryValue, newItemMode: self.newArticlesMode, secondaryKey: undefined,
//                 secondaryValue: undefined
//               });
//               self.emptyForms();
//               self.tableDataService.redirectTo('//' + self.CONSTANTS.REFTABLE_PROVIDERS);
//               break;
//             case(self.CONSTANTS.REFTABLE_PRILISTS) :
//               console.log('Save prilists');
//               for (let property in formValues) {
//                 postFormValues[property.toUpperCase()] = formValues[property];
//               }
//               primaryKey = self.CONSTANTS.REFTABLE_PRILISTS_COLUMN;
//               if (!self.newArticlesMode) {
//                 primaryValue = localStorage.getItem(self.CONSTANTS.LS_SEL_ITEM_NUMBER);
//               }
//               await self.tableDataService.setTableDataPromise({
//                 refTable: self.refTable, tableName: self.refTable, dataArray: postFormValues, primaryKey: primaryKey,
//                 primaryValue: primaryValue, newItemMode: self.newArticlesMode, secondaryKey: undefined,
//                 secondaryValue: undefined
//               });
//               self.emptyForms();
//               self.tableDataService.redirectTo('//' + self.CONSTANTS.REFTABLE_PRILISTS);
//               break;
//             case(self.CONSTANTS.REFTABLE_CURRENCIES) :
//               console.log('Save currency');
//               for (let property in formValues) {
//                 postFormValues[property.toUpperCase()] = formValues[property];
//               }
//               primaryKey = self.CONSTANTS.REFTABLE_CURRENCIES_COLUMN;
//               if (!self.newArticlesMode) {
//                 primaryValue = localStorage.getItem(self.CONSTANTS.LS_SEL_CURRENCY_ID);
//                 if (postFormValues['CURRENCY_ID']) {
//                   delete postFormValues['CURRENCY_ID'];
//                 }
//               }
//               await self.tableDataService.setTableDataPromise({
//                 refTable: self.refTable, tableName: self.refTable, dataArray: postFormValues, primaryKey: primaryKey,
//                 primaryValue: primaryValue, newItemMode: self.newArticlesMode, secondaryKey: undefined,
//                 secondaryValue: undefined
//               });
//               self.emptyForms();
//               self.tableDataService.redirectTo('//' + self.CONSTANTS.REFTABLE_CURRENCIES);
//               break;
//             case(self.CONSTANTS.REFTABLE_COUNTRIES) :
//               console.log('Save country');
//               for (let property in formValues) {
//                 postFormValues[property.toUpperCase()] = formValues[property];
//               }
//               console.log('postFormValues: ', postFormValues);
//               primaryKey = self.CONSTANTS.REFTABLE_COUNTRIES_COLUMN;
//               if (!self.newArticlesMode) {
//                 primaryValue = localStorage.getItem(self.CONSTANTS.LS_SEL_COUNTRY_ID);
//                 if (postFormValues['COUNTRY_ID']) {
//                   delete postFormValues['COUNTRY_ID'];
//                 }
//                 temp = self.saveTable(temp, self, postFormValues, primaryKey, primaryValue);
//               } else {
//                 // check for duplicates, before insert into table
//                 let cDbData = await self.tableDataService.getTableDataByIdPromise(self.refTable,
//                   self.CONSTANTS.REFTABLE_COUNTRIES_NAME_COLUMN,
//                   postFormValues[self.CONSTANTS.REFTABLE_COUNTRIES_NAME_COLUMN],
//                   self.CONSTANTS.REFTABLE_COUNTRIES_ISO_COLUMN,
//                   postFormValues[self.CONSTANTS.REFTABLE_COUNTRIES_ISO_COLUMN]);
//                 if (!cDbData) {
//                   //this.showErrorMessage('save order: Get orders positions - ' + this.errorMessage.replace('%s', this.translatePipe.transform('ORDERS_NUMBER')));
//                   return;
//                 }
//                 if (cDbData['table'][1].length === 0) {
//                   temp = self.saveTable(temp, self, postFormValues, primaryKey, primaryValue);
//                 } else {
//                   console.log('Country is already available in db...');
//                   let errMessage = self.translatePipe.transform('ITEM_ALREADY_EXISTS');
//                   errMessage = errMessage.replace('%s1', self.translatePipe.transform(self.CONSTANTS.REFTABLE_COUNTRIES_NAME_COLUMN));
//                   self.showErrorMessage(errMessage);
//                 }
//               }
//               break;
//             case(self.CONSTANTS.REFTABLE_WAREHOUSE_LOCATIONS) :
//               break;
//             default:
//               break;
//           }
//         }
//       });
//     } else {
//       console.log('ERROR: Check Reftable or Customernumber... Is undefined.');
//       throw new Error("Check Reftable or Customernumber... Is undefined.");
//     }
//     */
//   }
//
//   // private async saveTable(temp, self: this, postFormValues: {}, primaryKey, primaryValue) {
//   //   await self.tableDataService.setTableDataPromise({
//   //     refTable: self.refTable, tableName: self.refTable, dataArray: postFormValues, primaryKey: primaryKey,
//   //     primaryValue: primaryValue, newItemMode: self.newArticlesMode, secondaryKey: undefined,
//   //     secondaryValue: undefined
//   //   });
//   //   // self.emptyForms();
//   //   self.refreshTableViews();
//   //   self.showSuccessMessage('SAVEDSUCCESS');
//   //   // self.redirectTo('//' + self.CONSTANTS.REFTABLE_COUNTRIES);
//   //   return temp;
//   // }
//
//   private getTableAndDataset(refTableTitle: string, customerNumber: string) {
//     switch (this.refTable) {
//       case this.CONSTANTS.REFTABLE_ARTICLES:
//         refTableTitle = this.CONSTANTS.REFTABLE_ARTICLES_TITLE;
//         if (this.newArticlesMode) {
//           customerNumber = localStorage.getItem(this.CONSTANTS.LS_SEL_ITEM_NUMBER);
//         } else {
//           customerNumber =  this.CONSTANTS.UNIVERSAL_ID_PLACEHOLDER;
//         }
//         break;
//       case this.CONSTANTS.REFTABLE_PROVIDERS:
//         refTableTitle = this.CONSTANTS.REFTABLE_PROVIDERS_TITLE;
//         customerNumber = localStorage.getItem(this.CONSTANTS.LS_SEL_PROVIDERS_NAME);
//         break;
//       case this.CONSTANTS.REFTABLE_PRILISTS:
//         refTableTitle = this.CONSTANTS.REFTABLE_PRILISTS_TITLE;
//         customerNumber = localStorage.getItem(this.CONSTANTS.LS_SEL_ITEM_NUMBER);
//         break;
//       case this.CONSTANTS.REFTABLE_CURRENCIES:
//         refTableTitle = this.CONSTANTS.REFTABLE_CURRENCIES_TITLE;
//         customerNumber = localStorage.getItem(this.CONSTANTS.LS_SEL_CURRENCY_ID);
//         break;
//       case this.CONSTANTS.REFTABLE_PAYMENT_TERMS:
//         refTableTitle = this.CONSTANTS.REFTABLE_PAYMENT_TERMS_TITLE;
//         customerNumber = localStorage.getItem(this.CONSTANTS.LS_SEL_PAYMENT_TERM_ID);
//         break;
//       case this.CONSTANTS.REFTABLE_COUNTRIES:
//         refTableTitle = this.CONSTANTS.REFTABLE_COUNTRIES_TITLE;
//         customerNumber = localStorage.getItem(this.CONSTANTS.LS_SEL_COUNTRY_ID);
//         break;
//       default:
//         break;
//     }
//     return {refTableTitle, customerNumber};
//   }
//
//   public setFormValues(dbData) {
//     // set values
//     console.log('Try to set values...');
//     if (this.articleForm && this.articleForm.form) {
//       console.log('Articles form is initialized...');
//       if (!dbData) {
//         return;
//       }
//       let customerColumn = 'ITMNUM';
//       switch (this.refTable) {
//         case(this.CONSTANTS.REFTABLE_WAREHOUSE_LOCATIONS) :
//           customerColumn = 'WAREHOUSE_NAME';
//           break;
//         case(this.CONSTANTS.REFTABLE_PROVIDERS) :
//           customerColumn = 'PROVIDERS_NAME';
//           break;
//         case(this.CONSTANTS.REFTABLE_CURRENCIES) :
//           customerColumn = 'CURRENCY_ID';
//           break;
//         case(this.CONSTANTS.REFTABLE_COUNTRIES) :
//           customerColumn = 'COUNTRY_ID';
//           break;
//         default:
//           break;
//       }
//       // for (let formElement in dbData['formConfig']) {
//       for (let fItem in dbData['formConfig']) {
//         for (let fIElm in dbData['formConfig'][fItem]) {
//           let currValue = dbData['formConfig'][fItem][fIElm].value;
//           if (typeof currValue === "boolean") {
//             currValue = currValue ? true : false;
//           }
//           if (this.articleForm && this.articleForm.form) {
//             if (this.articleForm.form.get(dbData['formConfig'][fItem][fIElm].name)) {
//               this.articleForm.form.get(dbData['formConfig'][fItem][fIElm].name).setValue(currValue);
//             } else {
//               console.log('Property name not exists for... ', dbData['formConfig'][fItem][fIElm]);
//             }
//           } else {
//             console.log('articleForm or articleForm.form is undefined...');
//           }
//         }
//       }
//       if (this.articleForm && this.articleForm.form) {
//         const controls = this.articleForm.form.controls;
//         this.removeInvalidFormElements(controls, dbData);
//         // this.articleForm.validateAllFormFields(this.articleForm.form);
//         this.articleFormChanged = true;
//         // check/print not validated fields
//         //console.log('NOT VALIDATED FIELDS:::: ', this.findInvalidControls());
//       }
//     } else {
//       console.log('Articles form NOT initialized...');
//     }
//   }
//
//   /**
//    * remove invalid (no more needed) current form elements by comparing with elements received from server
//    *
//    * @param controls
//    * @param dbData
//    */
//   private removeInvalidFormElements(controls: { [p: string]: AbstractControl }, dbData: Object) {
//     let foundElement = false;
//     for (const name in controls) {
//       foundElement = false;
//       // for (let formElement in dbData['formConfig']) {
//       for(let fItem in dbData['formConfig']) {
//         for (let fIElm in dbData['formConfig'][fItem]) {
//           if (name === dbData['formConfig'][fItem][fIElm].name) {
//             foundElement = true;
//             break;
//           }
//         }
//       }
//       if (!foundElement) {
//         this.articleForm.form.removeControl(name);
//       }
//     }
//   }
//
//   /**
//    * test method to detect invalid form fields
//    */
//   public findInvalidControls() {
//     const invalid = [];
//     const controls = this.articleForm.form.controls;
//     for (const name in controls) {
//       if (controls[name].invalid) {
//         invalid.push(name);
//       }
//     }
//     return invalid;
//   }
//
//   public setChanged(flag) {
//     this.articleFormChanged = flag;
//   }
//
//   private async setCurrencies() {
//     let dbData = await this.tableDataService.getTableData(this.CONSTANTS.REFTABLE_CURRENCIES);
//     if (!dbData) {
//       return;
//     }
//     for (let pos in dbData['table'][1]) {
//       this.currencies.push({
//         name: dbData['table'][1][pos].CURRENCY_ISO_CODE,
//         value: dbData['table'][1][pos].CURRENCY_ID.toString()
//       });
//     }
//     return;
//   }
//
//   private async setLanguages() {
//     let dbData = await this.tableDataService.getTableData(this.CONSTANTS.REFTABLE_LANGUAGES);
//     if (!dbData) {
//       return;
//     }
//     for (let pos in dbData['table'][1]) {
//       this.languages.push({
//         name: dbData['table'][1][pos].LANGUAGE_NAME + " " + dbData['table'][1][pos].LANGUAGE_ISO_ALPHA_2 +
//           " (" + dbData['table'][1][pos].LANGUAGE_ISO_ALPHA_3 + ")",
//         value: dbData['table'][1][pos].LANGUAGE_ISO_ALPHA_3.toString()
//       });
//     }
//     return;
//   }
//
//   private removeOneFormField(dbData: Object, itemName) {
//     // console.log("removeOneFormField: ", dbData['formConfig']);
//     for(let fItem in dbData['formConfig']) {
//       for (let fIElm in dbData['formConfig'][fItem]) {
//         if (dbData['formConfig'][fItem][fIElm].name === itemName) {
//           dbData['formConfig'][fItem].splice(parseInt(fIElm), 1);
//           return dbData;
//         }
//       }
//     }
//     return dbData;
//   }
//
//   onArticleAttributeFormSubmit($event: any) {
//     console.log('save - onArticleAttributeFormSubmit...');
//     this.save();
//   }
//
//   createAttributeItem() {
//     this.newArticleAttributesMode = true;
//     let selItemNum = localStorage.getItem(this.CONSTANTS.LS_SEL_ITEM_NUMBER);
//     this.emptyForms();
//     this.getArticleFormData(selItemNum);
//   }
//
//   private refreshTableViews() {
//     this.articlesResetForm();
//   }
//
//   private showSuccessMessage(msg: string) {
//     this.messageService.add({
//       severity: 'success',
//       summary: this.translatePipe.transform('INFO'),
//       detail: this.translatePipe.transform(msg)
//     });
//   }
//
//   private showInfoMessage(msg: string) {
//     this.messageService.add({
//       severity: 'info',
//       summary: this.translatePipe.transform('INFO'),
//       detail: this.translatePipe.transform(msg)
//     });
//   }
//
//   private showErrorMessage(msg: string) {
//     // this.msgs.push({severity:'error', summary:'Error Message', detail: this.translatePipe.transform(msg)});
//     this.messageService.add({
//       severity: 'error',
//       summary: 'Error',
//       detail: this.translatePipe.transform(msg),
//       sticky: true
//     });
//   }
// }
