// import {Component, OnInit} from '@angular/core';
// import {FieldConfig} from "../../interfaces/field.interface";
// import {FormGroup} from "@angular/forms";
// import {TableDataService} from "../../_services/table-data.service";
// import {ConstantsService} from "../../_services/constants.service";
//
// @Component({
//   selector: 'app-pautocomplete',
//   template: `
//       <div class="field-full-width" [formGroup]="group">
//         <h5>{{ field?.label }}</h5>
//         <span class="p-fluid">
//             <p-autoComplete [id]="field?.id" formControlName="{{field?.name}}" [suggestions]="results"
//                             (completeMethod)="search($event)" (onDropdownClick)="search($event)" [dropdown]="true"
//                             [multiple]="multiple" [autoHighlight]="true">
//             </p-autoComplete>
//         </span>
//       </div>
//   `,
//   styleUrls: ['./pautocomplete.component.css']
// })
// export class PautocompleteComponent implements OnInit {
//
//   field: FieldConfig;
//   group: FormGroup = new FormGroup({});
//   isLoading = false;
//   texts: string[];
//   results: string[];
//   multiple: boolean;
//
//   constructor(
//     private CONSTANTS: ConstantsService,
//     private tableDataService: TableDataService
//   ) {
//     this.multiple = true;
//   }
//
//   ngOnInit() {
//     // this.group= this.fb.group({
//     //   'CROSSSELLING_DATA': new FormControl(this.field.name)
//     // });
//     // console.log('field?.name: ', this.field.name);
//     // console.log('field?.value: ', this.field.value);
//     // console.log('type of: ', (typeof this.field.value));
//     if (this.field.value && (typeof this.field.value === "string")) { //  this.field.value.includes(',')
//       this.field.value = this.field.value.split(',');
//       this.group.controls[this.field.name].setValue(this.field.value);
//     }
//     this.multiple = (this.field.name === "CROSSSELLING");
//   }
//
//   async search(event) {
//     // this.tableDataService.getCrosssellingResults(event.query).then(data => {
//     //   this.results = data;
//     // });
//     let validateFieldName: string = 'ITMNUM';
//     let validateFieldValue: string = event.query;
//     // Workaround: Set both second params to 'PROD_COMPONENTS', so 'mssql_logic > mssql_select_filteredItems'
//     // extends the search query with: CATEGORY_SOAS = 'RAW' AND RAW_FLG = 'true'
//     let secondColumn: string = 'PROD_COMPONENTS'; // undefined;
//     let secondValue: any = 'PROD_COMPONENTS'; // undefined;
//     if (this.field.name === "CROSSSELLING") {
//       secondColumn = 'CROSSSELLING_FLG';
//       secondValue = true;
//     }
//     let searchWithLike: boolean = true;
//     let resultAsArray: boolean = false;
//     let currentSelectedITMNUM = localStorage.getItem(this.CONSTANTS.LS_SEL_ITEM_NUMBER);
//     let dbData = await this.tableDataService.searchTableColumnData(this.CONSTANTS.REFTABLE_ARTICLES, validateFieldName,
//       validateFieldValue, secondColumn, secondValue, searchWithLike, resultAsArray, "");
//     let filterItmnums: string[] = [];
//     for (let dbItm in dbData) {
//       if (dbData[dbItm].ITMNUM !== currentSelectedITMNUM) {
//         filterItmnums.push(dbData[dbItm].ITMNUM);
//       }
//     }
//     this.results = filterItmnums;
//     // Scroll down to bottom of form
//     document.querySelector(".scrollable-table-form").scrollTop =
//       document.querySelector(".scrollable-table-form").scrollHeight;
//   }
//
// }
