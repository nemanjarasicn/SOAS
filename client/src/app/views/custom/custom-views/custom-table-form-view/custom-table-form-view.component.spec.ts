import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import { CustomTableFormViewComponent } from './custom-table-form-view.component';
import {CustomTableComponent} from '../../custom-table/custom-table.component';
import {CustomFormComponent} from '../../custom-form/custom-form.component';
import {TestingModule} from '../../../../testing/testing.module';
import {TranslateItPipe} from '../../../../shared/pipes/translate-it.pipe';
import {OptionsTypes, SoasModel} from '../../../../_services/constants.service';
import {Currencies} from '../../../../models/currencies';
import {Sort} from '../../custom-table/page';
import {CountriesTestConstants} from "../../../../../assets/test-constants/countries";
import {of} from "rxjs";
import {FetchDataService} from "../../../../_services/fetch-data.service";
import {SelectionModel} from "@angular/cdk/collections";
import {MessageService} from "primeng/api";

describe('CustomTableFormViewComponent', () => {
  let component: CustomTableFormViewComponent;
  let fixture: ComponentFixture<CustomTableFormViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ CustomTableFormViewComponent, CustomTableComponent, CustomFormComponent, TranslateItPipe ],
      providers: [TranslateItPipe, MessageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTableFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test ngOnInit', () => {

    // Arrange
    component.startLoading = false;
    const fetchDataServiceResult: { selTableRow: SoasModel, selTableIndex: number, refTableName: string } = {
      selTableRow: CountriesTestConstants.COUNTRIES_ITEM,
      selTableIndex: 0,
      refTableName: 'countries'
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

  it('should test ngAfterViewInit', () => {

    // Arrange
    const getDataSourceResult =  [CountriesTestConstants.COUNTRIES_ITEM];
    component.startLoading = true;
    component.tableComponent.selectionModel = new SelectionModel();
    component.tableComponent.selectionModel.select(CountriesTestConstants.COUNTRIES_ITEM);
    spyOn(component.tableComponent,'getDataSource').and.returnValue(of(getDataSourceResult));

    // Act
    component.ngAfterViewInit();

    // Assert
    expect(component.tableComponent).toBeDefined();
    expect(component.tableComponent.getDataSource).toHaveBeenCalled();
    expect(component.startLoading).toBeTruthy();
  });

  it('should test ngAfterViewInit, if table component is not defined', () => {

    // Arrange
    component.startLoading = true;
    component.tableComponent = undefined;


    // Act
    component.ngAfterViewInit();

    // Assert
    expect(component.tableComponent).not.toBeDefined();
    expect(component.isMainTableViewLoaded).toBeFalsy();
  });

  it('should set title', () => {

    // Arrange
    const title = 'title';

    // Act
    component.setTableTitle(title);

    // Assert
    expect(component.tableTitle).toEqual(title);
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

  it('should set refTable', () => {

    // Arrange
    const refTable = 'refTable';

    // Act
    component.setReferralTable(refTable);

    // Assert
    expect(component.refTable).toEqual(refTable);
  });

  it('should set refModel', () => {

    // Arrange
    const refModel: SoasModel = Currencies as unknown as SoasModel;

    // Act
    component.setReferralModel(refModel);

    // Assert
    expect(component.refModel).toEqual(refModel);
  });

  it('should set emptyItemId', () => {

    // Arrange
    const emptyItemId = 'id';

    // Act
    component.setEmptyItemId(emptyItemId);

    // Assert
    expect(component.emptyItemId).toEqual(emptyItemId);
  });

  it('should set emptyModel', () => {

    // Arrange
    const emptyModel: SoasModel = Currencies as unknown as SoasModel;

    // Act
    component.setEmptyModel(emptyModel);

    // Assert
    expect(component.emptyModel).toEqual(emptyModel);
  });

  it('should set setCreateTooltip', () => {

    // Arrange
    const displayedTableColumns: string[] = ['column'];

    // Act
    component.setDisplayedTableColumns(displayedTableColumns);

    // Assert
    expect(component.displayedTableColumns).toEqual(displayedTableColumns);
  });

  it('should set searchTableColumn', () => {

    // Arrange
    const searchTableColumn = 'title';

    // Act
    component.setSearchTableColumn(searchTableColumn);

    // Assert
    expect(component.searchTableColumn).toEqual(searchTableColumn);
  });

  it('should set additionalTableSearchColumns', () => {

    // Arrange
    const additionalTableSearchColumns = 'title';

    // Act
    component.setAdditionalTableSearchColumns(additionalTableSearchColumns);

    // Assert
    expect(component.additionalTableSearchColumns).toEqual(additionalTableSearchColumns);
  });

  it('should set initialTableSort', () => {

    // Arrange
    const initialTableSort: Sort<any> = {property: 'CURRENCY_NAME', order: 'asc'};

    // Act
    component.setInitialTableSort(initialTableSort);

    // Assert
    expect(component.initialTableSort).toEqual(initialTableSort);
  });

  it('should set formOptionsToLoad', () => {

    // Arrange
    const formOptionsToLoad: OptionsTypes[] = [OptionsTypes.currencies];

    // Act
    component.setFormOptionsToLoad(formOptionsToLoad);

    // Assert
    expect(component.formOptionsToLoad).toEqual(formOptionsToLoad);
  });

  it('should set setCreateTooltip', () => {

    // Arrange
    const PAGINATOR_ELEMENTS_PER_SIDE: number[] = [14];

    // Act
    component.setPaginatorElementsPerSide(PAGINATOR_ELEMENTS_PER_SIDE);

    // Assert
    expect(component.PAGINATOR_ELEMENTS_PER_SIDE).toEqual(PAGINATOR_ELEMENTS_PER_SIDE);
  });

  it('should set currPageSize', () => {

    // Arrange
    const currPageSize: number = 14;

    // Act
    component.setCurrPageSize(currPageSize);

    // Assert
    expect(component.currPageSize).toEqual(currPageSize);
  });

  it('should set selItemLocalStorageKey', () => {

    // Arrange
    const selItemLocalStorageKey = 'title';

    // Act
    component.setSelItemLocalStorageKey(selItemLocalStorageKey);

    // Assert
    expect(component.selItemLocalStorageKey).toEqual(selItemLocalStorageKey);
    // this.formService.setSelItemLocalStorageKey(key);
  });

  it('should set primaryRefTableColumnName', () => {

    // Arrange
    const primaryRefTableColumnName = 'title';

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

  it('should set formTitle', () => {

    // Arrange
    const formTitle = 'title';

    // Act
    component.setFormTitle(formTitle);

    // Assert
    expect(component.formTitle).toEqual(formTitle);
  });

  it('should call create new item',  fakeAsync(  (done) => {

    // Arrange
    const newItemMode: boolean = true;
    component.selTableRow = CountriesTestConstants.COUNTRIES_ITEM;
    component.primaryRefTableColumnName = 'COUNTRY_NAME';

    // Act
    component.createItem();

    // Assert
    expect(component.newItemMode).toEqual(newItemMode);

  }));

  it('should get clicked row',  fakeAsync(  (done) => {

    // Arrange
    const self = component;
    const expectedResult = jasmine.any(Function);
    let returnFunction = function(self) {
      return async function (tableRow: SoasModel, $event: Event) { };
    };
    self.isTableClicked = false;
    spyOn(component,'getClickedRow').and.callFake(returnFunction);

    // Act
    let result: any = component.getClickedRow(self);

    // Assert
    expect(result).toEqual(expectedResult);
  }));

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
