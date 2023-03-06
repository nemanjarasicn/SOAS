import {Component, ElementRef,Input, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator, MatPaginatorIntl} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {User} from "../../interfaces/user-item";
import {BatchItem} from "../../interfaces/batch-item";
import {UserService} from "../../_services/user.service";
import {BatchService} from "../../_services/batch.service";
import {MatTableDataSource} from "@angular/material/table";
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import {Router} from "@angular/router";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {ConstantsService,SoasModel,modelNames} from "../../_services/constants.service";
import {BooleanToMatIconPipe} from "../../shared/pipes/boolean-to-mat-icon.pipe";
import {MatPaginatorIntlCro} from "../../views/custom/custom-table/MatPaginatorIntlCro";
import {TableDataService} from "../../_services/table-data.service";
import {Sort} from "../../views/custom/custom-table/page";


/** Custom options the configure the tooltip's default show/hide delays. */
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 100,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-table-dialog',
  templateUrl: './table-dialog.component.html',
  styleUrls: ['./table-dialog.component.css'],
  providers: [TranslateItPipe, BooleanToMatIconPipe,
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults},
    {provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro}
  ],
})

export class TableDialogComponent implements OnInit {

  tableForm: FormGroup;
  displayedColumns: string[];
  users: SoasModel[];
  batches: SoasModel[];
  dataSource: MatTableDataSource<any>;
  data;
  PAGINATOR_ELEMENTS_PER_SIDE: number[];
  searchTitle;
  createTitle;
  createTooltip;
  editTooltip;
  deleteTooltip;
  isLoadingResults: boolean = false;
  _page = 0
  _offset = 0
  _size = 10
  _sort: Sort<SoasModel>
  _search: string

  @ViewChild('searchInput', {static: false}) searchInput: ElementRef;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<TableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    private userService: UserService,
    private CONSTANTS: ConstantsService,
    private batchService: BatchService,
    private formBuilder: FormBuilder,
    public translateIt: TranslateItPipe,
    public dialog: MatDialog,
    private router: Router,
    private tableDataService: TableDataService,
  ) {
    this.setIsLoadingResults(true);
    this.displayedColumns = modalData.displayedColumns;
    this.data = modalData.data;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = this.translateIt.transform('ITEMS_PER_SIDE');
    this.PAGINATOR_ELEMENTS_PER_SIDE = this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE_FIVE;
    this.initTableDialog();
  }

  private async initTableDialog() {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    this.searchTitle = 'SEARCH_FOR';
    if (this.data === 'users') {
      await this.setUsers();
    } else if (this.data === 'batches') {
      await this.setBatches();
    }
  }

  /**
   * set users
   *
   * @private
   */
  private async setUsers() {
    this.createTitle = 'CREATE_USER';
    this.createTooltip = 'CREATE_NEW_USER';
    this.editTooltip = 'EDIT_USER';
    this.deleteTooltip = 'DELETE_USER_TITLE';
    
    const res = await this.tableDataService.getModelEndpoint({
      modelName: modelNames[this.modalData.refTable],
      query: {
        page: this._page,
        offset: this._offset,
        size: this._size,
        sort: {
          column: this._sort?.property || this.modalData.pk,
          direction: this._sort?.order || 'asc'
        },
        searchColumn: `${this.modalData.pk},${this.modalData.additionalSearch}`,
        searchText: this._search,
        exactSearchColumn: this.modalData?.secondColumn,
        exactSearchText: this.modalData?.secondColumnValue
      }
    })
    
    const tmpResUsers = res as { table: [string, SoasModel[]], maxRows: number, page: number }
    this.users = tmpResUsers.table[1];
    if (!this.users) {
      return;
    }
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.setIsLoadingResults(false);
  }

  /**
   * set batches
   *
   * @private
   */
  private async setBatches() {
    this.createTitle = 'CREATE_NEW_BATCH';
    this.createTooltip = 'CREATE_NEW_BATCH';
    this.editTooltip = 'EDIT_BATCH';
    let deleteMessage = this.translateIt.transform('DELETE_TITLE');
    this.deleteTooltip = deleteMessage.replace('%s', this.translateIt.transform('BATCH'));
  
    const res = await this.tableDataService.getModelEndpoint({
      modelName: modelNames[this.modalData.refTable],
      query: {
        page: this._page,
        offset: this._offset,
        size: this._size,
        sort: {
          column: this._sort?.property || this.modalData.pk,
          direction: this._sort?.order || 'asc'
        },
        searchColumn: `${this.modalData.pk},${this.modalData.additionalSearch}`,
        searchText: this._search,
        exactSearchColumn: this.modalData?.secondColumn,
        exactSearchText: this.modalData?.secondColumnValue
      }
    })
    
    const tmpResBatches = res as { table: [string, SoasModel[]], maxRows: number, page: number }
    this.batches = tmpResBatches.table[1];
    console.log(this.batches);
    if (!this.batches) {
      return;
    }
    
    this.dataSource = new MatTableDataSource(this.batches);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.setIsLoadingResults(false);
  }

  createItem(item) {
  }

  editItem(item) {
  }

  deleteItem(i, item) {
  }

  openDialog(action, obj) {
    if (obj) {
      obj.action = action;
    }
  }

  // When the user clicks the action button, the modal calls the service\
  // responsible for executing the action for this modal (depending on\
  // the name passed to `modalData`). After that, it closes the modal
  okFunction() {
    //this.userManagementService.modalAction(this.modalData);
    this.closeFunction();
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeFunction() {
    this.dialogRef.close();
    this.router.navigateByUrl('/', {skipLocationChange: true});
  }

  @HostListener("keydown.esc")
  public onEsc() {
    this.closeFunction();
  }

  public setIsLoadingResults(flag: boolean) {
    this.isLoadingResults = flag;
  }

  refreshFunction() {
    this.initTableDialog();
  }
}

