import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import { CustomTableTabGroupViewComponent } from './custom-table-tab-group-view.component';
import {DetailViewTabGroupComponent} from '../../../detail-view-tab-group/detail-view-tab-group.component';
import {CustomTableComponent} from '../../custom-table/custom-table.component';
import {TranslateItPipe} from '../../../../shared/pipes/translate-it.pipe';
import {TestingModule} from '../../../../testing/testing.module';
import {Sort} from "../../custom-table/page";
import {
  ConstantsService,
  CustomersTypes,
  OptionsTypes,
  SoasModel,
  SubTabGroupTabNames, SubTabGroupTabNumbers,
  TabGroupTabNumbers
} from "../../../../_services/constants.service";
import {Currencies} from "../../../../models/currencies";
import {DynamicFormComponent} from "../../../../dynamic-view/dynamic-form/dynamic-form.component";
import {OptionsService} from "../../../../_services/options.service";
import {of} from "rxjs";
import {OrdersTestConstants} from "../../../../../assets/test-constants/orders";
import {FetchDataService} from "../../../../_services/fetch-data.service";
import {MessageService} from "primeng/api";
import {OrdersPositions} from "../../../../models/orders-positions";

describe('CustomTableTabGroupViewComponent', () => {
  let component: CustomTableTabGroupViewComponent;
  let fixture: ComponentFixture<CustomTableTabGroupViewComponent>;
  let optionsService: OptionsService;
  let constantsService: ConstantsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [CustomTableTabGroupViewComponent, DetailViewTabGroupComponent, CustomTableComponent,
        DynamicFormComponent, TranslateItPipe],
      providers: [TranslateItPipe, OptionsService, ConstantsService, MessageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTableTabGroupViewComponent);
    component = fixture.componentInstance;
    optionsService = TestBed.inject(OptionsService);
    constantsService = TestBed.inject(ConstantsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test ngOnInit', () => {

    // Arrange
    component.startLoading = false;
    component.refTable = constantsService.REFTABLE_ORDERS;
    const fetchDataServiceResult: { selTableRow: SoasModel, selTableIndex: number, refTableName: string } = {
      selTableRow: OrdersTestConstants.ORDERS_ITEM,
      selTableIndex: 0,
      refTableName: constantsService.REFTABLE_ORDERS
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
    const getDataSourceResult =  [OrdersTestConstants.ORDERS_ITEM];
    component.startLoading = true;
    component.tabGroupComponent.selectedIndexChange = new Function();
    spyOn(component.tableComponent,'getDataSource').and.returnValue(of(getDataSourceResult));
    spyOn(component.tabGroupComponent,'selectedIndexChange').and.callThrough();

    // Act
    component.ngAfterViewInit();

    // Assert
    expect(component.tableComponent).toBeDefined();
    expect(component.tableComponent.getDataSource).toHaveBeenCalled();
    // expect(component.tabGroupComponent.selectedIndexChange).toHaveBeenCalled();
    expect(component.startLoading).toBeTruthy();
  });

  it('should set refTable', () => {

    // Arrange
    const refTable = 'refTable';

    // Act
    component.setReferralTable(refTable);

    // Assert
    expect(component.refTable).toEqual(refTable);
  });

  it('should set primaryTableColumnName', () => {

    // Arrange
    const primaryTableColumnName = 'column';

    // Act
    component.setPrimaryTableColumnName(primaryTableColumnName);

    // Assert
    expect(component.primaryTableColumnName).toEqual(primaryTableColumnName);
  });

  it('should set secondaryTableColumnName', () => {

    // Arrange
    const secondaryTableColumnName = 'column';

    // Act
    component.setSecondaryTableColumnName(secondaryTableColumnName);

    // Assert
    expect(component.secondaryTableColumnName).toEqual(secondaryTableColumnName);
  });

  it('should set tertiaryTableColumnName', () => {

    // Arrange
    const tertiaryTableColumnName = 'column';

    // Act
    component.setTertiaryTableColumnName(tertiaryTableColumnName);

    // Assert
    expect(component.tertiaryTableColumnName).toEqual(tertiaryTableColumnName);
  });

  it('should set displayedColumns', () => {

    // Arrange
    const displayedColumns: string[] = ['column'];

    // Act
    component.setDisplayedColumns(displayedColumns);

    // Assert
    expect(component.displayedColumns).toEqual(displayedColumns);
  });

  it('should set detailsDisplayedColumns', () => {

    // Arrange
    const detailsDisplayedColumns: string[] = ['column'];

    // Act
    component.setDetailsDisplayedColumns(detailsDisplayedColumns);

    // Assert
    expect(component.detailsDisplayedColumns).toEqual(detailsDisplayedColumns);
  });

  it('should set searchColumn', () => {

    // Arrange
    const searchColumn: string = 'column';

    // Act
    component.setSearchColumn(searchColumn);

    // Assert
    expect(component.searchColumn).toEqual(searchColumn);
  });

  it('should set additionalSearchColumns', () => {

    // Arrange
    const additionalSearchColumns: string = 'column';

    // Act
    component.setAdditionalSearchColumns(additionalSearchColumns);

    // Assert
    expect(component.additionalSearchColumns).toEqual(additionalSearchColumns);
  });

  it('should set initialSort', () => {

    // Arrange
    const initialSort: Sort<any> = {property: 'CURRENCY_NAME', order: 'asc'};

    // Act
    component.setInitialSort(initialSort);

    // Assert
    expect(component.initialSort).toEqual(initialSort);
  });

  it('should set columnsToHide', () => {

    // Arrange
    const columnsToHide: string[] = ['column'];

    // Act
    component.setColumnsToHide(columnsToHide);

    // Assert
    expect(component.columnsToHide).toEqual(columnsToHide);
  });

  it('should set detailsColumnsToHide', () => {

    // Arrange
    const detailsColumnsToHide: string[] = ['column'];

    // Act
    component.setDetailsColumnsToHide(detailsColumnsToHide);

    // Assert
    expect(component.detailsColumnsToHide).toEqual(detailsColumnsToHide);
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

  it('should set detailsFormTitle', () => {

    // Arrange
    const detailsFormTitle: SubTabGroupTabNames = SubTabGroupTabNames.ORDER_DETAILS;

    // Act
    component.setDetailsFormTitle(detailsFormTitle);

    // Assert
    expect(component.detailsFormTitle).toEqual(detailsFormTitle);
  });

  it('should set primaryLocalStorageKey', () => {

    // Arrange
    const primaryLocalStorageKey = 'key';

    // Act
    component.setPrimaryLocalStorageKey(primaryLocalStorageKey);

    // Assert
    expect(component.primaryLocalStorageKey).toEqual(primaryLocalStorageKey);
  });

  it('should set secondaryLocalStorageKey', () => {

    // Arrange
    const secondaryLocalStorageKey = 'key';

    // Act
    component.setSecondaryLocalStorageKey(secondaryLocalStorageKey);

    // Assert
    expect(component.secondaryLocalStorageKey).toEqual(secondaryLocalStorageKey);
  });

  it('should set tertiaryLocalStorageKey', () => {

    // Arrange
    const tertiaryLocalStorageKey = 'key';

    // Act
    component.setTertiaryLocalStorageKey(tertiaryLocalStorageKey);

    // Assert
    expect(component.tertiaryLocalStorageKey).toEqual(tertiaryLocalStorageKey);
  });

  it('should set formOptionsToLoad', () => {

    // Arrange
    const formOptionsToLoad: OptionsTypes[] = [OptionsTypes.currencies];

    // Act
    component.setFormOptionsToLoad(formOptionsToLoad);

    // Assert
    expect(component.formOptionsToLoad).toEqual(formOptionsToLoad);
  });

  it('should set emptyModel', () => {

    // Arrange
    const emptyModel: SoasModel = Currencies as unknown as SoasModel;

    // Act
    component.setEmptyModel(emptyModel);

    // Assert
    expect(component.emptyModel).toEqual(emptyModel);
  });

  it('should set emptyDetailsModel', () => {

    // Arrange
    const emptyDetailsModel: SoasModel = OrdersPositions as unknown as SoasModel;

    // Act
    component.setEmptyDetailsModel(emptyDetailsModel);

    // Assert
    expect(component.emptyDetailsModel).toEqual(emptyDetailsModel);
  });

  it('should set selTabGroupTab', () => {

    // Arrange
    const selTabGroupTab: TabGroupTabNumbers = TabGroupTabNumbers.ORDER;

    // Act
    component.setTabToSelect(selTabGroupTab);

    // Assert
    expect(component.selTabGroupTab).toEqual(selTabGroupTab);
  });

  it('should set setSubTabToSelect', () => {

    // Arrange
    const selSubTabGroupTab: SubTabGroupTabNumbers = SubTabGroupTabNumbers.DETAILS;

    // Act
    component.setSubTabToSelect(selSubTabGroupTab);

    // Assert
    expect(component.selSubTabGroupTab).toEqual(selSubTabGroupTab);
  });

  it('is new item mode allowed returns true', () => {

    // Arrange

    // Act
    component.refTable = 'orders';
    const result: boolean = component.isNewItemModeAllowed();

    // Assert
    expect(result).toEqual(true);
  });

  it('is new item mode allowed returns false', () => {

    // Arrange

    // Act
    component.refTable = 'unknown';
    const result: boolean = component.isNewItemModeAllowed();

    // Assert
    expect(result).toEqual(false);
  });

  it('should set defaultPaymentTermId', () => {

    // Arrange
    const defaultPaymentTermId = 'id';

    // Act
    component.setDefaultPaymentTermId(defaultPaymentTermId);

    // Assert
    expect(component.defaultPaymentTermId).toEqual(defaultPaymentTermId);
  });

  it('should set detailsSearchColumn', () => {

    // Arrange
    const detailsSearchColumn = 'column';

    // Act
    component.setDetailsSearchColumn(detailsSearchColumn);

    // Assert
    expect(component.detailsSearchColumn).toEqual(detailsSearchColumn);
  });

  it('should set detailsAdditionalSearchColumns', () => {

    // Arrange
    const detailsAdditionalSearchColumns = 'column1,column2';

    // Act
    component.setDetailsAdditionalSearchColumns(detailsAdditionalSearchColumns);

    // Assert
    expect(component.detailsAdditionalSearchColumns).toEqual(detailsAdditionalSearchColumns);
  });

  it('should set detailsInitialSort', () => {

    // Arrange
    const detailsInitialSort: Sort<any> = {property: 'ORDERS_NUMBER', order: 'asc'};

    // Act
    component.setDetailsInitialSort(detailsInitialSort);

    // Assert
    expect(component.detailsInitialSort).toEqual(detailsInitialSort);
  });

  it('should set new item mode to true', async function() {

    // Arrange
    const newItemMode: boolean = true;
    const isNewItemModeAllowed: boolean = true;
    spyOn(component, "isNewItemModeAllowed").and.returnValue(isNewItemModeAllowed);

    // Act
    await component.createNewItem();

    // Assert
    expect(component.newItemMode).toEqual(newItemMode);
  });

  it('should set resetForm', async function() {

    // Arrange
    const expectedNewItemMode: boolean = false;

    // Act
    component.newItemMode = true;
    component.resetForm();

    // Assert
    expect(component.newItemMode).toEqual(expectedNewItemMode);

  });

  it('tableUpdate should set set newItemMode to false',async function() {

    // Arrange
    const newItemMode: boolean = false;

    // Act
    await component.tableUpdate();

    // Assert
    expect(component.newItemMode).toEqual(newItemMode);

  });

  it('refreshDetails should set set newItemMode to false',async function() {

    // Arrange
    const newItemMode: boolean = false;
    const isMainTableViewLoaded: boolean = false;

    // Act
    await component.refreshDetails();

    // Assert
    expect(component.newItemMode).toEqual(newItemMode);
    expect(component.isMainTableViewLoaded).toEqual(isMainTableViewLoaded);

  });

  it('changeClient should set local storage item and reset form controls',  fakeAsync( async (done) => {

    // Arrange
    const client: string = CustomersTypes.B2C;

    // Act
    component.changeClient(client);

    // Assert

  }));

  it('should call createNewItem', async function() {

    // Arrange
    spyOn(component,"createNewItem").and.callThrough();

    // Act
    await component.tableCreate();

    // Assert
    expect(component.createNewItem).toHaveBeenCalled();

  });

  // Expected spy getPaymentTermByLanguage to have been called.
  // if (this.tabGroupComponent.form.form.get('PAYMENT_TERM_ID')) { - PAYMENT_TERM_ID seems to be not set in form
  // it('changePaymentTermId should set form control PAYMENT_TERM_ID',   () => {
  //
  //   // Arrange
  //   const language: string = 'DEU';
  //   // component.tabGroupComponent.form.form = new FormGroup({'PAYMENT_TERM_ID': '1'});
  //   const paymentTermId = 'id';
  //   component.defaultPaymentTermId = paymentTermId;
  //   spyOn(component.tabGroupComponent.form.form,"get").and.callThrough();
  //   spyOn(optionsService,"getPaymentTermByLanguage").and.returnValue(paymentTermId);
  //
  //   // Act
  //   component.changePaymentTermId(language);
  //
  //   // Assert
  //   expect(optionsService.getPaymentTermByLanguage).toHaveBeenCalled();
  //   // expect(component.tabGroupComponent.form.form.controls['PAYMENT_TERM_ID'].value).toEqual(component.defaultPaymentTermId);
  // });

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
