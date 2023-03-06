import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import { CustomTableTableFormViewComponent } from './custom-table-table-form-view.component';
import {Sort} from '../../custom-table/page';
import {DetailViewListComponent} from "../../../detail-view-list/detail-view-list.component";
import {CustomTableComponent} from "../../custom-table/custom-table.component";
import {TranslateItPipe} from "../../../../shared/pipes/translate-it.pipe";
import {TestingModule} from "../../../../testing/testing.module";
import {ComponentViewTypes, ConstantsService, SoasModel} from "../../../../_services/constants.service";
import {Currencies} from "../../../../models/currencies";
import {CountriesTestConstants} from "../../../../../assets/test-constants/countries";
import {of} from "rxjs";
import {FetchDataService} from "../../../../_services/fetch-data.service";
import {ArticlesTestConstants} from "../../../../../assets/test-constants/articles";
import {MessageService} from "primeng/api";


describe('CustomTableTableFormViewComponent', () => {
  let component: CustomTableTableFormViewComponent;
  let fixture: ComponentFixture<CustomTableTableFormViewComponent>;
  let constantsService: ConstantsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [CustomTableTableFormViewComponent, CustomTableComponent, DetailViewListComponent, TranslateItPipe],
      providers: [TranslateItPipe, ConstantsService, MessageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTableTableFormViewComponent);
    component = fixture.componentInstance;
    constantsService = TestBed.inject(ConstantsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test ngOnInit', () => {

    // Arrange
    component.startLoading = false;
    component.refTable = constantsService.REFTABLE_ARTICLES;
    const fetchDataServiceResult: { selTableRow: SoasModel, selTableIndex: number, refTableName: string } = {
      selTableRow: ArticlesTestConstants.ARTICLES_ITEM,
      selTableIndex: 0,
      refTableName: constantsService.REFTABLE_ARTICLES
    };
    const fetchDataService = TestBed.inject(FetchDataService);
    spyOn(fetchDataService, 'getDataObs').and.returnValue(of(fetchDataServiceResult));

    // Act
    component.ngOnInit();

    // Assert
    expect(component.tableComponent).toBeDefined();
    expect(fetchDataService.getDataObs).toHaveBeenCalled();
    expect(component.startLoading).toBeFalsy();
  });

  it('should test ngOnInit if refTableName = detailViewRefTable', () => {

    // Arrange
    component.startLoading = false;
    component.refTable = constantsService.REFTABLE_ARTICLES;
    component.detailViewRefTable = constantsService.REFTABLE_ATTRIBUTES;
    const fetchDataServiceResult: { selTableRow: SoasModel, selTableIndex: number, refTableName: string } = {
      selTableRow: ArticlesTestConstants.ARTICLES_ITEM,
      selTableIndex: 0,
      refTableName: constantsService.REFTABLE_ATTRIBUTES
    };
    const fetchDataService = TestBed.inject(FetchDataService);
    spyOn(fetchDataService, 'getDataObs').and.returnValue(of(fetchDataServiceResult));
    spyOn(component, 'tableUpdate').and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.tableComponent).toBeDefined();
    expect(fetchDataService.getDataObs).toHaveBeenCalled();
    expect(component.tableUpdate).toHaveBeenCalled();
    expect(component.startLoading).toBeFalsy();
  });

  it('should test ngOnInit if refTableName = DynamicForm', () => {

    // Arrange
    component.startLoading = false;
    component.refTable = constantsService.REFTABLE_ARTICLES;
    const fetchDataServiceResult: { selTableRow: SoasModel, selTableIndex: number, refTableName: string } = {
      selTableRow: undefined,
      selTableIndex: 0,
      refTableName: ComponentViewTypes.DynamicForm
    };
    const fetchDataService = TestBed.inject(FetchDataService);
    spyOn(fetchDataService, 'getDataObs').and.returnValue(of(fetchDataServiceResult));

    // Act
    component.ngOnInit();

    // Assert
    expect(component.detailViewListComponents).toBeDefined();
    expect(fetchDataService.getDataObs).toHaveBeenCalled();
    expect(component.startLoading).toBeFalsy();
  });

  it('should test ngAfterViewInit', () => {

    // Arrange
    const getDataSourceResult =  [CountriesTestConstants.COUNTRIES_ITEM];
    component.startLoading = true;
    spyOn(component.tableComponent,'getDataSource').and.returnValue(of(getDataSourceResult));

    // Act
    component.ngAfterViewInit();

    // Assert
    expect(component.tableComponent).toBeDefined();
    expect(component.tableComponent.getDataSource).toHaveBeenCalled();
    expect(component.startLoading).toBeTruthy();
  });

  // Error: Uncaught (in promise): TypeError: Cannot read properties of undefined (reading 'toString')
  //  at CustomTableFormViewComponent.<anonymous> (src/app/views/custom/custom-views/custom-table-form-view/custom-table-form-view.component.ts:440:4)
  it('should call create new item', async function() {

    // Arrange
    const newItemMode: boolean = true;
    // component.selTableRow['primaryRefTableColumnName'] = 'primaryRefTableColumnName';

    // Act
    await component.createItem();

    // Assert
    expect(component.newItemMode).toEqual(newItemMode);

  });

  // it('should get refreshTableViews function',  (done) => {
  //
  //   // Arrange
  //
  //   // Act
  //   component.refreshDetailsFunc(currPageSizeMainTable);
  //
  //   // Assert
  //   expect(component.refreshTableViews).toEqual(currPageSizeMainTable);
  //
  // });

  it('should set resetForm', async function() {

    // Arrange
    const expectedNewItemMode: boolean = false;

    // Act
    component.newItemMode = true;
    await component.resetForm();

    // Assert
    expect(component.newItemMode).toEqual(expectedNewItemMode);

  });

  it('should call createItem', async function() {

    // Arrange
    spyOn(component,"createItem").and.callThrough();

    // Act
    await component.tableCreate();

    // Assert
    expect(component.createItem).toHaveBeenCalled();

  });

  it('tableUpdate should set set newItemMode to false', async function() {

    // Arrange
    const newItemMode: boolean = false;

    // Act
    await component.tableUpdate();

    // Assert
    expect(component.newItemMode).toEqual(newItemMode);

  });

  // Error: Timeout - Async function did not complete within 5000ms
  it('should set currPageSizeMainTable', async function() {

    // Arrange
    const newItemMode: boolean = false;
    component.newItemMode = true;

    // Act
    await component.listResetForm();

    // Assert
    expect(component.newItemMode).toEqual(newItemMode);

  });

  // Error: Timeout - Async function did not complete within 5000ms
  it('should set detailViewTableInitialSort',  fakeAsync( async (done) => {

    // Arrange
    const detailViewTableInitialSort: Sort<any> = {property: 'ID', order: 'asc'};

    // Act
    component.setDetailViewTableInitialSort(detailViewTableInitialSort);

    // Assert
    expect(component.detailViewTableInitialSort).toEqual(detailViewTableInitialSort);

  }));

  // Error: Timeout - Async function did not complete within 5000ms
  it('should set PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE', fakeAsync( async (done) => {

    // Arrange
    const PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE: number[] = [14];

    // Act
    component.setPaginatorElementsPerSideMainTable(PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE);

    // Assert
    expect(component.PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE).toEqual(PAGINATOR_ELEMENTS_PER_SIDE_MAIN_TABLE);

  }));

  // Error: Timeout - Async function did not complete within 5000ms
  it('should set currPageSizeMainTable',  fakeAsync( async (done) => {

    // Arrange
    const currPageSizeMainTable: number = 14;

    // Act
    component.setCurrPageSizeMainTable(currPageSizeMainTable);

    // Assert
    expect(component.currPageSizeMainTable).toEqual(currPageSizeMainTable);

  }));

  it('should set refTable', () => {

    // Arrange
    const refTable = 'refTable';

    // Act
    component.setReferralTable(refTable);

    // Assert
    expect(component.refTable).toEqual(refTable);
  });

  it('should set detailViewRefTable', () => {

    // Arrange
    const detailViewRefTable = 'refTable';

    // Act
    component.setDetailViewRefTable(detailViewRefTable);

    // Assert
    expect(component.detailViewRefTable).toEqual(detailViewRefTable);
  });

  it('should set detailViewPrimaryRefTableColumnName', () => {

    // Arrange
    const detailViewPrimaryRefTableColumnName = 'column';

    // Act
    component.setDetailViewPrimaryRefTableColumnName(detailViewPrimaryRefTableColumnName);

    // Assert
    expect(component.detailViewPrimaryRefTableColumnName).toEqual(detailViewPrimaryRefTableColumnName);
  });

  it('should set primaryRefTableColumnName', () => {

    // Arrange
    const primaryRefTableColumnName = 'column';

    // Act
    component.setPrimaryRefTableColumnName(primaryRefTableColumnName);

    // Assert
    expect(component.primaryRefTableColumnName).toEqual(primaryRefTableColumnName);
  });

  it('should set secondaryRefTableColumnName', () => {

    // Arrange
    const secondaryRefTableColumnName = 'column';

    // Act
    component.setSecondaryRefTableColumnName(secondaryRefTableColumnName);

    // Assert
    expect(component.secondaryRefTableColumnName).toEqual(secondaryRefTableColumnName);
  });

  it('should set selItemPrimaryLocalStorageKey', () => {

    // Arrange
    const selItemPrimaryLocalStorageKey = 'key';

    // Act
    component.setSelItemPrimaryLocalStorageKey(selItemPrimaryLocalStorageKey);

    // Assert
    expect(component.selItemPrimaryLocalStorageKey).toEqual(selItemPrimaryLocalStorageKey);
  });

  it('should set selItemSecondaryLocalStorageKey', () => {

    // Arrange
    const selItemSecondaryLocalStorageKey = 'key';

    // Act
    component.setSelItemSecondaryLocalStorageKey(selItemSecondaryLocalStorageKey);

    // Assert
    expect(component.selItemSecondaryLocalStorageKey).toEqual(selItemSecondaryLocalStorageKey);
  });

  it('should set selItemPrimaryIdLocalStorageKey', () => {

    // Arrange
    const selItemPrimaryIdLocalStorageKey = 'key';

    // Act
    component.setSelItemPrimaryIdLocalStorageKey(selItemPrimaryIdLocalStorageKey);

    // Assert
    expect(component.selItemPrimaryIdLocalStorageKey).toEqual(selItemPrimaryIdLocalStorageKey);
  });

  it('should set selItemSecondaryIdLocalStorageKey', () => {

    // Arrange
    const selItemSecondaryIdLocalStorageKey = 'key';

    // Act
    component.setSelItemSecondaryIdLocalStorageKey(selItemSecondaryIdLocalStorageKey);

    // Assert
    expect(component.selItemSecondaryIdLocalStorageKey).toEqual(selItemSecondaryIdLocalStorageKey);
  });

  it('should set pageParamsPrimaryColumnName', () => {

    // Arrange
    const pageParamsPrimaryColumnName = 'key';

    // Act
    component.setPageParamsPrimaryColumnName(pageParamsPrimaryColumnName);

    // Assert
    expect(component.pageParamsPrimaryColumnName).toEqual(pageParamsPrimaryColumnName);
  });

  it('should set pageParamsPrimaryColumnValue', () => {

    // Arrange
    const pageParamsPrimaryColumnValue = 'key';

    // Act
    component.setPageParamsPrimaryColumnValue(pageParamsPrimaryColumnValue);

    // Assert
    expect(component.pageParamsPrimaryColumnValue).toEqual(pageParamsPrimaryColumnValue);
  });

  it('should set title', () => {

    // Arrange
    const title = 'title';

    // Act
    component.setTableTitle(title);

    // Assert
    expect(component.tableTitle).toEqual(title);
  });

  it('should set detailTableTitle', () => {

    // Arrange
    const detailTableTitle = 'title';

    // Act
    component.setDetailTableTitle(detailTableTitle);

    // Assert
    expect(component.detailTableTitle).toEqual(detailTableTitle);
  });

  it('should set detailFormTitle', () => {

    // Arrange
    const detailFormTitle = 'title';

    // Act
    component.setDetailFormTitle(detailFormTitle);

    // Assert
    expect(component.detailFormTitle).toEqual(detailFormTitle);
  });

  it('should set createTitle', () => {

    // Arrange
    const createTitle = 'title';

    // Act
    component.setCreateTitle(createTitle);

    // Assert
    expect(component.createTitle).toEqual(createTitle);
  });

  it('should set setCreateTooltip', () => {

    // Arrange
    const createTooltip = 'title';

    // Act
    component.setCreateTooltip(createTooltip);

    // Assert
    expect(component.createTooltip).toEqual(createTooltip);
  });

  it('should set tableViewColumnsToHide', () => {

    // Arrange
    const tableViewColumnsToHide: string[] = ['column'];

    // Act
    component.setTableViewColumnsToHide(tableViewColumnsToHide);

    // Assert
    expect(component.tableViewColumnsToHide).toEqual(tableViewColumnsToHide);
  });

  it('should set detailViewTableColumnsToHide', () => {

    // Arrange
    const detailViewTableColumnsToHide: string[] = ['column'];

    // Act
    component.setDetailViewTableColumnsToHide(detailViewTableColumnsToHide);

    // Assert
    expect(component.detailViewTableColumnsToHide).toEqual(detailViewTableColumnsToHide);
  });

  it('should set tableViewDisplayedColumns', () => {

    // Arrange
    const tableViewDisplayedColumns: string[] = ['column'];

    // Act
    component.setTableViewDisplayedColumns(tableViewDisplayedColumns);

    // Assert
    expect(component.tableViewDisplayedColumns).toEqual(tableViewDisplayedColumns);
  });

  it('should set detailViewTableDisplayedColumns', () => {

    // Arrange
    const detailViewTableDisplayedColumns: string[] = ['column'];

    // Act
    component.setDetailViewTableDisplayedColumns(detailViewTableDisplayedColumns);

    // Assert
    expect(component.detailViewTableDisplayedColumns).toEqual(detailViewTableDisplayedColumns);
  });

  it('should set tableViewSearchColumn', () => {

    // Arrange
    const tableViewSearchColumn = 'column';

    // Act
    component.setTableViewSearchColumn(tableViewSearchColumn);

    // Assert
    expect(component.tableViewSearchColumn).toEqual(tableViewSearchColumn);
  });

  it('should set tableViewAdditionalSearchColumns', () => {

    // Arrange
    const tableViewAdditionalSearchColumns = 'column';

    // Act
    component.setTableViewAdditionalSearchColumns(tableViewAdditionalSearchColumns);

    // Assert
    expect(component.tableViewAdditionalSearchColumns).toEqual(tableViewAdditionalSearchColumns);
  });

  it('should set tableViewInitialSort', () => {

    // Arrange
    const tableViewInitialSort: Sort<any> = {property: 'CURRENCY_NAME', order: 'asc'};

    // Act
    component.setTableViewInitialSort(tableViewInitialSort);

    // Assert
    expect(component.tableViewInitialSort).toEqual(tableViewInitialSort);
  });

  it('should set emptyModel', () => {

    // Arrange
    const emptyModel: SoasModel = Currencies as unknown as SoasModel;

    // Act
    component.setEmptyModel(emptyModel);

    // Assert
    expect(component.emptyModel).toEqual(emptyModel);
  });

  it('should set currPageSizeDetailTable', () => {

    // Arrange
    const currPageSizeDetailTable = 14;

    // Act
    component.setCurrPageSizeDetailTable(currPageSizeDetailTable);

    // Assert
    expect(component.currPageSizeDetailTable).toEqual(currPageSizeDetailTable);
  });

  it('should set PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE ', () => {

    // Arrange
    const PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE : number[] = [14];

    // Act
    component.setPaginatorElementsPerSideDetailTable(PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE );

    // Assert
    expect(component.PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE ).toEqual(PAGINATOR_ELEMENTS_PER_SIDE_DETAIL_TABLE );
  });

  it('should set detailViewFormKey', () => {

    // Arrange
    const detailViewFormKey = 'key';

    // Act
    component.setDetailViewFormKey(detailViewFormKey);

    // Assert
    expect(component.detailViewFormKey).toEqual(detailViewFormKey);
  });

  it('should set detailViewFormValue', () => {

    // Arrange
    const detailViewFormValue = 'value';

    // Act
    component.setDetailViewFormValue(detailViewFormValue);

    // Assert
    expect(component.detailViewFormValue).toEqual(detailViewFormValue);
  });

  it('should set showSecondTableDataInDetailsView', () => {

    // Arrange
    const showSecondTableDataInDetailsView = true;

    // Act
    component.setShowSecondTableDataInDetailsView(showSecondTableDataInDetailsView);

    // Assert
    expect(component.showSecondTableDataInDetailsView).toEqual(showSecondTableDataInDetailsView);
  });

  // component.formService is private
  // it('should set itemRefTableTitle', () => {
  //
  //   // Arrange
  //   const table = 'title';
  //
  //   // Act
  //   component.setSeItemRefTableTitle(table);
  //
  //   // Assert
  //   expect(component.formService.seItemRefTableTitle).toEqual(table);
  // });

});
