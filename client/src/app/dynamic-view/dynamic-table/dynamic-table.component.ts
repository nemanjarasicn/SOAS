import {Component, EventEmitter, ViewChild, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {modelNames, SoasModel} from "../../_services/constants.service";
import {DynamicTableService} from "../../_services/dynamic-table.service";
import {Subscription} from "rxjs";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {MatDialog} from "@angular/material/dialog";
import {DynamicFormDialogComponent} from "../../dialogs/dynamic-form-dialog/dynamic-form-dialog.component";
import {DynamicDetailListDialogComponent} from "../../dialogs/dynamic-detail-list-dialog/dynamic-detail-list-dialog.component";
import {MatSort} from '@angular/material/sort';
import {PageService} from "../../views/custom/custom-table/page.service";
import {IShowTogether} from "../../interfaces/dynamic-view-main-table.interface";
import {TableDataService} from "../../_services/table-data.service";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent implements OnInit, OnDestroy {
  @Output() appendData = new EventEmitter<[string, SoasModel]>();
  @Output() saveData = new EventEmitter<{pkValue: string, data: SoasModel, modelName: string, refTable?: string}>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() isStatic?: boolean
  @Input() staticInput?: {
    displayedColumns: string[]
    data: SoasModel[]
    formlyConfig: FormlyFieldConfig[]
    refTable: string
    title: string
    referenceColumn: string
    referenceValue: string
    parentModalData?: SoasModel
  }

  constructor(
    protected pageService: PageService,
    protected tableDataService: TableDataService,
    protected dynamicTableService: DynamicTableService,
    public dialog: MatDialog
  ) { }
  data: SoasModel[]
  subscriptions: Subscription[] = []
  displayedColumns: string[]
  selectedItemIndex: number
  dataSource: MatTableDataSource<SoasModel>
  formlyConfig: FormlyFieldConfig[]
  activeModal: SoasModel | Object
  referenceColumn: string
  referenceValue: string
  title: string
  pk?: string
  refTable: string
  additionalDetailModal = false
  showTogether: IShowTogether[]

  ngOnInit(): void {
    if (!this.isStatic) {
      this.subscriptions.push(
        // TODO: maybe we could just pass one object with these properties

        this.dynamicTableService.getDataSource().subscribe(res => {
          this.data = res
          this.dataSource = new MatTableDataSource(res || []);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator
        }),

        this.dynamicTableService.getDisplayedColumns().subscribe(res => {
          this.displayedColumns = res || []
        }),

        this.dynamicTableService.getFormlyConfig().subscribe(res => {
          this.formlyConfig = res || []
        }),

        this.dynamicTableService.getRefTable().subscribe(res => {
          this.refTable = res
          if (!this.data) {
            this.fetchData()
            this.additionalDetailModal = true
          } else {
            this.additionalDetailModal = false
          }
        }),

        this.dynamicTableService.getTitle().subscribe(res => {
          this.title = res
        }),

        this.dynamicTableService.getReferenceColumn().subscribe(res => {
          this.referenceColumn = res
        }),

        this.dynamicTableService.getReferenceValue().subscribe(res => {
          this.referenceValue = res
        }),

        this.dynamicTableService.getShowTogether().subscribe(res => {
          this.showTogether = res
        }),

        this.dynamicTableService.getPk().subscribe(res => {
          this.pk = res
        })
      )
    } else {
      this.data = this.staticInput.data
      this.dataSource = new MatTableDataSource(this.data || []);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator

      this.displayedColumns = this.staticInput.displayedColumns
      this.formlyConfig = this.staticInput.formlyConfig
      this.refTable = this.staticInput.refTable
      this.title = this.staticInput.title
      this.referenceColumn = this.staticInput.referenceColumn
      this.referenceValue = this.staticInput.referenceValue
    }
  }

  ngOnDestroy(): void {
    if (!this.isStatic) {
      for (let subscription of this.subscriptions){
        subscription?.unsubscribe()
      }
    }
  }

  fetchData(): void {
    this.tableDataService.getModelEndpoint({
      modelName: modelNames[this.refTable],
      query: {
        exactSearchText: this.referenceValue,
        exactSearchColumn: this.pk
      }
    })
      .then((res) => {
        const tmpRes = res as { table: [string, SoasModel[]], maxRows: number, page: number }
        this.dynamicTableService.setDataSource(tmpRes.table[1])
        this.dynamicTableService.setDisplayedColumns(tmpRes.table[0].split(','))
      })
      .catch((err)=>{
        return err;
      })
  }

  addNew(): void {
    this.activeModal = {}
    this.activeModal[this.referenceColumn] = this.referenceValue
    this.openDialog()
  }

  openDialog(): void {
    if (!this.additionalDetailModal) {
      const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
        data:{
          title: this.title,
          formlyFieldConfig: this.formlyConfig,
          modalData: this.activeModal
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if ( this.pk && result[this.pk] ) {
            this.saveData.emit({
              pkValue: result[this.pk],
              data: result,
              modelName: modelNames[this.refTable],
            })
          } else if (result[this.referenceColumn]) {
            this.saveData.emit({
              pkValue: undefined,
              data: result,
              modelName: modelNames[this.refTable],
              refTable: this.refTable
            })
          } else {
            this.appendData.emit([this.refTable, result])
          }
        }
      });
    } else {
      this.tableDataService.getFormlyForm(`formly_${this.refTable}`)
        .then(res => {
          this.dialog.open(DynamicDetailListDialogComponent, {
            data:{
              title: this.title,
              formlyFieldConfig: JSON.parse(res.formTemplate[0].FORM_TEMPLATE),
              modalData: this.activeModal,
              showTogether: this.showTogether
            }
          })
        })
        .catch((err)=>{
          return err;
        })
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onItemClick(index: number): void{
    this.activeModal = this.data[index]

    this.openDialog()
  }

}
