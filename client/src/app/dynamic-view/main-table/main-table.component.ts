import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {modelNames, SoasModel, TableTypes} from "../../_services/constants.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {PageService} from "../../views/custom/custom-table/page.service";
import {Sort} from "../../views/custom/custom-table/page";
import {Subscription} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {TableDataService} from "../../_services/table-data.service";
import {DynamicTableService} from "../../_services/dynamic-table.service";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {MatTab} from "@angular/material/tabs";
import {IFetchTableConfig, IRelatedList} from "../../interfaces/dynamic-view-main-table.interface";

@Component({
  selector: 'app-dynamic-view-main-table',
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.css']
})
export class MainTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() title!: string
  @Input() fetchTableConfig!:IFetchTableConfig

  showForm = false
  tmpMainTableForm = null as FormGroup | null
  togetherData: {}
  relatedList = {data: [], displayedColumns: [], formlyConfig: []} as {
    data?: SoasModel[]
    displayedColumns?: string[]
    formlyConfig?: FormlyFieldConfig[]
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchInput = new FormControl(null, []);

  constructor(
    private pageService: PageService,
    private tableDataService: TableDataService,
    private dynamicTableService: DynamicTableService
  ) { }

  dataSource: SoasModel[]
  displayedColumns: string[] = []
  formConfig: FormlyFieldConfig[]
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  activeRelatedList: IRelatedList
  dynamicTableIsLoadingResults = false

  _page = 0
  _offset = 0
  _size = 10
  _sort: Sort<SoasModel>
  _search: string

  selectedTabIndex = 0
  selectedSubTabIndex = 0

  subscriptions: Subscription[] = []
  activeItem: SoasModel
  editMode = false
  newItemMode = false
  selectedItemIndex: number
  activeRefTable: string

  clearSearch(): void{
    this.searchInput.setValue(null)
  }

  async fetchTableData(): Promise<void>{
    this.isLoadingResults = true;

    const res = await this.tableDataService.getModelEndpoint({
      modelName: modelNames[this.fetchTableConfig.refTable],
      query: {
        page: this._page,
        offset: this._offset,
        size: this._size,
        sort: {
          column: this._sort?.property || this.fetchTableConfig.pk,
          direction: this._sort?.order || 'asc'
        },
        searchColumn: `${this.fetchTableConfig.pk},${this.fetchTableConfig.additionalSearch}`,
        searchText: this._search,
        exactSearchColumn: this.fetchTableConfig?.secondColumn,
        exactSearchText: this.fetchTableConfig?.secondColumnValue
      }
    })

    const tmpRes = res as { table: [string, SoasModel[]], maxRows: number, page: number }
    if (this.fetchTableConfig?.onlyShowColumns && this.fetchTableConfig.onlyShowColumns.length > 0) {
      //TODO: Add logic to show only wished columns
      console.log('')
    } else {
      // show all columns
      this.displayedColumns = tmpRes.table[0].split(',')
      this.dataSource = tmpRes.table[1]
    }
    this.resultsLength = tmpRes.maxRows

    this.isLoadingResults = false
  }


  ngOnInit(): void {
    this.initTogetherData()
    this.fetchTableData()
  }

  initTogetherData(): void {
    if (this.fetchTableConfig?.insertTogether) {
      for (let item of this.fetchTableConfig.insertTogether) {
        this.togetherData = {
          ...this.togetherData,

          [item.refTable]: {
            data: [],
            displayedColumns: [],
            formlyConfig: null
          }

        }
      }
    }
  }

  resetTogetherData(): void{
    if(this.fetchTableConfig?.insertTogether) {
      for (let item of this.fetchTableConfig.insertTogether) {
        if (this.togetherData[item.refTable]) {
          this.togetherData[item.refTable].data = []
        }
      }
    }

    this.dynamicTableService.setDataSource([])
  }

  ngAfterViewInit(): void{
    this.subscriptions.push(
      // fetch data again on search changes
      this.searchInput.valueChanges
        .pipe(debounceTime(300))
        .subscribe(async (res) => {
          this._search = res
          this._page = 0
          this._offset = 0
          await this.fetchTableData()
        }),

      // fetch data again on any sort change
      this.sort.sortChange.subscribe(async (res) => {
        this._sort = {
          property: res.active,
          order: res.direction
        }
        await this.fetchTableData()
      }),

      // fetch data again on any paginator change
      this.paginator.page.subscribe(async (res) => {
        this._size = res.pageSize
        this._page = res.pageIndex
        this._offset = res.pageSize * res.pageIndex
        await this.fetchTableData()
      })
    )
  }

  //TODO: break it into 2 functions, make it async, add a proper error handler
  getFormlyConfig(): Promise<void> {
    this.dynamicTableIsLoadingResults = true

    return this.tableDataService.getModelEndpoint({
      modelName: 'formTemplate',
      primaryKey: `formly_${this.fetchTableConfig.refTable}`
    })
      .then(res => {
        this.formConfig = res && res[0] ? JSON.parse(res[0].FORM_TEMPLATE) : undefined;

        if (this.fetchTableConfig?.insertTogether) {
          for (let item of this.fetchTableConfig.insertTogether) {
            this.tableDataService.getModelEndpoint({
              modelName: 'formTemplate',
              primaryKey: `formly_${item.refTable}`
            })
              .then(res => {
                this.togetherData[item.refTable].formlyConfig = res && res[0] ? JSON.parse(res[0].FORM_TEMPLATE) : undefined

                if (this.activeRefTable === item.refTable) {
                  this.dynamicTableService.setFormlyConfig(JSON.parse(res[0].FORM_TEMPLATE))
                }
              })
          }
        } else if (this.fetchTableConfig?.relatedList) {

          this.tableDataService.getModelEndpoint({
            modelName: 'formTemplate',
            primaryKey:`formly_${this.fetchTableConfig.relatedList.refTable}`
          })
            .then(res => {
              this.relatedList.formlyConfig = res && res[0] ? JSON.parse(res[0].FORM_TEMPLATE) : undefined

              if (this.activeRefTable === this.fetchTableConfig.relatedList.refTable) {
                this.dynamicTableService.setFormlyConfig(JSON.parse(res[0].FORM_TEMPLATE))
              }
            })
        }
      })
      .catch(() => {
        //TODO: add proper catch
      })
      .finally(() => {
        this.dynamicTableIsLoadingResults = false
      })
  }

  async fetchRelatedListConfig(
    params: {
      referenceColumnValue: string
      referenceColumn: string
      secondColumn?: string
      secondColumnValue?: string
      refTable: string
    }
  ): Promise<{data: SoasModel[], displayedColumns: string[]} | false> {

    const res = await this.tableDataService.getModelEndpoint({
      modelName: modelNames[params.refTable],
      query: {
        exactSearchColumn: `${params.referenceColumn}${params?.secondColumn? `,${params.secondColumn}`: ''}`,
        exactSearchText: `${params.referenceColumnValue}${params?.secondColumnValue? `,${params.secondColumnValue}`: ''}`
      }
    })

    const tmpRes = res as { table: [string, SoasModel[]], maxRows: number, page: number }

    if (this.activeRefTable === params.refTable) {
      this.dynamicTableService.setDataSource(tmpRes.table[1])
      this.dynamicTableService.setDisplayedColumns(tmpRes.table[0].split(','))
    }

    return {data: tmpRes.table[1], displayedColumns: tmpRes.table[0].split(',')}
  }

  getFormlyFormData(): Promise<void> {
    this.dynamicTableIsLoadingResults = true

    return this.tableDataService.getModelEndpoint({
      primaryKey: this.dataSource[this.selectedItemIndex][this.fetchTableConfig.pk],
      modelName: modelNames[this.fetchTableConfig.refTable]
    })
      .then(async res => {
        this.activeItem = res && res[0] ? res[0] : undefined;

        if (this.fetchTableConfig?.insertTogether) {
          this.resetTogetherData()

          for (let item of this.fetchTableConfig.insertTogether) {
            const rlResult = await this.fetchRelatedListConfig({
              refTable: item.refTable,
              referenceColumnValue: this.activeItem[item.referenceColumn],
              referenceColumn: item.referenceColumn,
              secondColumn: item.secondColumn,
              secondColumnValue: item.secondColumnValue,
            })

            if (rlResult) {
              this.togetherData[item.refTable].data = rlResult.data
              this.togetherData[item.refTable].displayedColumns = rlResult.displayedColumns
            }
          }
        } else if (this.fetchTableConfig?.relatedList) {
          const rlResult = await this.fetchRelatedListConfig({
            refTable: this.fetchTableConfig.relatedList.refTable,
            referenceColumn: this.fetchTableConfig.relatedList.referenceColumn,
            referenceColumnValue: this.activeItem[this.fetchTableConfig.relatedList.referenceColumn],
            secondColumn: this.fetchTableConfig.relatedList.secondColumn,
            secondColumnValue: this.fetchTableConfig.relatedList.secondColumnValue,
          })

          if (rlResult) {
            this.relatedList.data = rlResult.data
            this.relatedList.displayedColumns = rlResult.displayedColumns
          }
        }

      })
      .catch(() => {
        //TODO: add proper catch
      })
      .finally(() => {
        this.dynamicTableIsLoadingResults = false
      })
  }

  async createItem(): Promise<void> {
    this.activeRefTable = undefined
    this.selectedItemIndex = undefined
    this.activeItem = undefined
    this.showForm = false

    this.resetTogetherData()
    await this.getFormlyConfig()
    for (let item of this.fetchTableConfig.insertTogether) {
      const rlResult = await this.fetchRelatedListConfig({
        refTable: item.refTable,
        referenceColumnValue: null,
        referenceColumn: item.referenceColumn,
        secondColumn: item.secondColumn,
        secondColumnValue: item.secondColumnValue,
      })

      if (rlResult) {
        this.togetherData[item.refTable].data = rlResult.data
        this.togetherData[item.refTable].displayedColumns = rlResult.displayedColumns
      }
    }

    this.showForm = true
    this.editMode = true
    this.newItemMode = true
  }

  onItemClick(index: number): void{
    this.showForm = false
    this.newItemMode = false
    this.selectedItemIndex = index
    this.selectedSubTabIndex = 0
    Promise.all([
      this.getFormlyConfig(),
      this.getFormlyFormData()
    ]).then(() => {
      this.showForm = true
      this.editMode = true
    })
  }

  async formSubmitted(form: FormGroup): Promise<void> {
    const data = form.getRawValue()

    if (this.selectedItemIndex !== undefined) {
      await this.tableDataService.putModelEndpoint({
        primaryKey: data[this.fetchTableConfig.pk],
        modelName: modelNames[this.fetchTableConfig.refTable],
        data: JSON.stringify(data),
      })
    } else {
      await this.tableDataService.postModelEndpoint({
        modelName: modelNames[this.fetchTableConfig.refTable],
        data: JSON.stringify(data),
        insertTogetherData: this?.togetherData? JSON.stringify(this.togetherData): undefined
      })
    }


    this.closeEdit()
    await this.fetchTableData()
  }

  closeEdit():void {
    this.editMode = false
    this.newItemMode = false
    this.activeItem = undefined
  }

  onClickTab(e: {index: number, tab: MatTab}): void {
    this.selectedTabIndex = e.index
    this.dynamicTableIsLoadingResults = true

    if (e.index > 0) {
      this.dynamicTableService.setDataSource(null)
      this.dynamicTableService.setDisplayedColumns(null)
      this.dynamicTableService.setFormlyConfig(null)
      this.dynamicTableService.setTitle(this.fetchTableConfig.viewEditTabs[e.index - 1].subtitle)
      this.dynamicTableService.setReferenceColumn(this.fetchTableConfig.viewEditTabs[e.index - 1].referenceColumn)
      this.dynamicTableService.setReferenceValue(this.activeItem[this.fetchTableConfig.viewEditTabs[e.index - 1].referenceColumn])
      this.dynamicTableService.setShowTogether(this.fetchTableConfig.viewEditTabs[e.index - 1].showTogether)
      this.dynamicTableService.setPk(this.fetchTableConfig.viewEditTabs[e.index - 1].pk)

      this.dynamicTableService.setRefTable(this.fetchTableConfig.viewEditTabs[e.index - 1].refTable)

      this.showForm = false
    } else {
      this.showForm = true
      this.selectedSubTabIndex = 0
    }

    this.dynamicTableIsLoadingResults = false
  }

  onClickSubTab(e: {index: number, tab: MatTab}): void {
    this.selectedSubTabIndex = e.index
    this.dynamicTableIsLoadingResults = true

    if (e.index > 0) {

      let relatedListConfig

      if (this.fetchTableConfig?.insertTogether) {
        this.activeRelatedList = this.fetchTableConfig.insertTogether[e.index - 1]
        relatedListConfig = this.togetherData[this.activeRelatedList.refTable]
      } else if (this.fetchTableConfig?.relatedList){
        this.activeRelatedList = this.fetchTableConfig.relatedList
        relatedListConfig = this.relatedList
      }

      this.activeRefTable = this.activeRelatedList.refTable

      this.dynamicTableService.setShowTogether(null)
      this.dynamicTableService.setDisplayedColumns(relatedListConfig.displayedColumns)
      this.dynamicTableService.setDataSource(relatedListConfig.data)
      this.dynamicTableService.setFormlyConfig(relatedListConfig.formlyConfig)
      this.dynamicTableService.setTitle(this.activeRelatedList.subtitle)
      this.dynamicTableService.setPk(this.activeRelatedList.pk)
      this.dynamicTableService.setReferenceColumn(this.activeRelatedList.referenceColumn)
      this.dynamicTableService.setReferenceValue(this.newItemMode && this.activeRefTable !== 'orderPosition' ? '' : relatedListConfig?.data[0][this.activeRelatedList.referenceColumn])

      this.dynamicTableService.setRefTable(this.activeRelatedList.refTable)

      this.showForm = false
    } else {
      this.showForm = true
      this.activeRefTable = undefined
    }

    this.dynamicTableIsLoadingResults = false
  }

  appendDataDynamicTable(param: [string, SoasModel]): void {
    this.togetherData[param[0]].data.push(param[1])
    this.dynamicTableService.setDisplayedColumns(this.togetherData[param[0]].displayedColumns)
    this.dynamicTableService.setDataSource(this.togetherData[param[0]].data)
  }

  async saveDataDynamicTable(param: {pkValue: string, data: SoasModel, modelName: string, refTable?: string}): Promise<void> {
    let res
    if (param.pkValue) {
      res = await this.tableDataService.putModelEndpoint({
        modelName: param.modelName,
        primaryKey: param.pkValue,
        data: JSON.stringify(param.data)
      })
    } else {
        res = await this.tableDataService.postModelEndpoint({
          modelName: param.modelName,
          data: JSON.stringify(param.data)
        })

        this.appendDataDynamicTable([param.refTable, res])
    }
  }

  setTmpMainTableForm(form: FormGroup | null): void {
      this.activeItem = form?.getRawValue()
  }

  ngOnDestroy(): void{
    for (const subscription of this.subscriptions){
      subscription?.unsubscribe()
    }
  }

  isMatTable(): boolean {
    return !this.activeRelatedList ? true : !this.activeRelatedList.tableType ? true :
      this.activeRelatedList.tableType === TableTypes.matTable;
  }

  isPTable(): boolean {
     return !this.activeRelatedList ? false : !this.activeRelatedList.tableType ? false :
      this.activeRelatedList?.tableType === TableTypes.pTable;
  }
}
