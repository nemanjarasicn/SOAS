import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {IShowTogether} from "../../interfaces/dynamic-view-main-table.interface";
import {modelNames, SoasModel, TableTypes} from "../../_services/constants.service";
import {MatTab} from "@angular/material/tabs";
import {TableDataService} from "../../_services/table-data.service";

@Component({
  selector: 'app-dynamic-detail-list-dialog',
  templateUrl: './dynamic-detail-list-dialog.component.html',
  styleUrls: ['./dynamic-detail-list-dialog.component.css']
})
export class DynamicDetailListDialogComponent implements OnInit {

  showTogetherData: SoasModel[] = []
  showTogetherDisplayedColumns: string[] = []
  showTogetherFormlyConfig: FormlyFieldConfig[]
  showTogetherRefTable: string
  showTogetherTitle: string
  showTogetherReferenceColumn: string
  showTogetherReferenceValue: string
  showTogetherTableType: TableTypes
  selectedTabIndex = 0
  staticInput: {
    data: SoasModel[]
    displayedColumns: string[]
    formlyConfig: FormlyFieldConfig[]
    refTable: string
    title: string
    referenceColumn: string
    referenceValue: string
    parentModalData?: SoasModel
  }

  constructor(
    private tableDataService: TableDataService,
    public dialogRef: MatDialogRef<DynamicDetailListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      title: string
      formlyFieldConfig: FormlyFieldConfig[]
      modalData?: SoasModel
      showTogether: IShowTogether[]
    }
  ) { }

  ngOnInit(): void {
    this.setInitShowTogetherValues()

    this.fetchData()
  }

  setInitShowTogetherValues():void {
    this.showTogetherRefTable = this.dialogData.showTogether[this.selectedTabIndex].refTable
    this.showTogetherTitle = this.dialogData.showTogether[this.selectedTabIndex].subTubTitle
    this.showTogetherReferenceColumn = this.dialogData.showTogether[this.selectedTabIndex].referenceColumn
    this.showTogetherReferenceValue = this.dialogData.modalData[this.dialogData.showTogether[this.selectedTabIndex].referenceColumn]
    this.showTogetherTableType = this.dialogData.showTogether[this.selectedTabIndex].tableType

    this.staticInput = {
      data: this.showTogetherData,
      displayedColumns: this.showTogetherDisplayedColumns,
      formlyConfig: this.showTogetherFormlyConfig,
      refTable: this.showTogetherRefTable,
      title: this.showTogetherTitle,
      referenceColumn: this.showTogetherReferenceColumn,
      referenceValue: this.showTogetherReferenceValue,
      parentModalData: this.dialogData.modalData
    }
  }

  onClickTab(e: {index: number, tab: MatTab}): void {
    if (this.selectedTabIndex != e.index) {
      this.selectedTabIndex = e.index

      this.setInitShowTogetherValues()
    }
  }

  fetchData(): void {
    this.tableDataService.getModelEndpoint({
      modelName: modelNames[this.showTogetherRefTable],
      // ToDo: Need to decide if we use primary key or search column/text for getting items from BE
      //  For OrderPosition the primary key at BE model is ID, but items need to be loaded by ORDERS_NUMBER
      //  (so changed to search column/text here)
      // primaryKey: this.showTogetherReferenceValue,
      query: {
        searchColumn: this.showTogetherReferenceColumn,
        searchText: this.showTogetherReferenceValue
      }
    })
      .then((res) => {
        const tmpRes = res as { table: [string, SoasModel[]], maxRows: number, page: number }
        this.showTogetherData = tmpRes.table[1]
        this.showTogetherDisplayedColumns  = tmpRes.table[0].split(',')

        this.setInitShowTogetherValues()
      })
      .catch((err)=>{
        return err;
      })
  }

  closeEditDynamicForm(): void {
    this.dialogRef.close()
  }

  isMatTable(): boolean {
    return (this.showTogetherTableType === TableTypes.matTable);
  }

  isPTable(): boolean {
    return (this.showTogetherTableType === TableTypes.pTable);
  }
}
