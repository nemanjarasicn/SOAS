import {MessageService} from 'primeng/api';
import {CustomTableComponent} from '../custom/custom-table/custom-table.component';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {ArticlesComponent} from './articles.component';
import {CustomFormComponent} from "../custom/custom-form/custom-form.component";
import {AttributePDialogComponent} from "./attribute-p-dialog/attribute-p-dialog.component";
import {ArticlesTestConstants} from "../../../assets/test-constants/articles";
import {MatTabGroup} from "@angular/material/tabs";
import {MessagesService} from "../../_services/messages.service";

describe('ArticlesComponent', () => {
  let component: ArticlesComponent;
  let fixture: ComponentFixture<ArticlesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ArticlesComponent, TranslateItPipe, CustomTableComponent, CustomFormComponent,
        AttributePDialogComponent, MatTabGroup],
      providers: [TranslateItPipe, MessageService, MessagesService, TranslateItPipe, CustomTableComponent,
        CustomFormComponent, AttributePDialogComponent]
    })
    fixture = TestBed.createComponent(ArticlesComponent);
    component = fixture.componentInstance;
    component.formComponent = fixture.debugElement.children[0].componentInstance;
    component.attributePDialogComponent = TestBed.inject(AttributePDialogComponent);

    // Fake custom form component
    // const counterEl = fixture.debugElement.query(
    //   By.directive(FakeCustomFormComponent)
    // );
    // component.customFormComponent = counterEl.componentInstance;

    // Workaround to prevent NG100 error
    // @link: https://stackoverflow.com/a/62690274
    // @link: https://stackoverflow.com/a/35243106
    fixture.componentInstance.ngAfterViewInit();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    // Arrange

    // Act
    component.ngOnInit();

    // Assert
  });

  it('should test ngAfterViewInit and return true', () => {

    // Arrange
    const getDataSourceResult = [ArticlesTestConstants.ARTICLES_ITEM];
    component.tableComponent = TestBed.inject(CustomTableComponent);
    // spyOn(component.tableComponent,'getDataSource').and.returnValue(of(getDataSourceResult));

    // Act
    component.ngAfterViewInit();

    // Assert
    expect(component.tableComponent).toBeDefined();
    // expect(component.tableComponent.getDataSource).toHaveBeenCalled();
    // expect(component.isMainTableViewLoaded).toBeTruthy();
  });

  it('should test ngAfterViewInit and return false', () => {

    // Arrange
    component.tableComponent = undefined;

    // Act
    component.ngAfterViewInit();

    // Assert
    expect(component.tableComponent).not.toBeDefined();
    expect(component.isMainTableViewLoaded).toBeFalsy();
  });

  it('tableUpdate should set set newItemMode to false', async function () {

    // Arrange
    const newItemMode: boolean = false;

    // Act
    await component.tableUpdate();

    // Assert
    expect(component.newItemMode).toEqual(newItemMode);

  });

  it('should reset form', () => {

    // Arrange
    component.selTableRow = ArticlesTestConstants.ARTICLES_ITEM;
    component.tableComponent = TestBed.inject(CustomTableComponent);
    component.tableComponent.selectionIndex = 1;
    component.articlesTabGroup = jasmine.createSpyObj('MatTabGroup', ['childMethod']);
    component.articlesTabGroup.selectedIndex = 1;

    // Act
    component.articlesResetForm();

    // Assert
    expect(component.selTableRow).not.toBeDefined();
    expect(component.lastSelTableRow).not.toBeDefined();
    expect(component.articlesTabGroup.selectedIndex).toEqual(0);
  });

  it('should create article item', () => {

    // Arrange
    component.newItemMode = true;
    component.selTableRow = ArticlesTestConstants.ARTICLES_ITEM;
    component.tableComponent = TestBed.inject(CustomTableComponent);
    component.tableComponent.selectionIndex = 1;
    component.articlesTabGroup = jasmine.createSpyObj('MatTabGroup', ['childMethod']);
    // select article tab (0) as selected
    component.articlesTabGroup.selectedIndex = 0;

    // Act
    component.createItem();

    // Assert
    expect(component.newItemMode).toBeTruthy();
    expect(component.articleAttributesMode).toBeFalsy();
    expect(component.articlesTabGroup.selectedIndex).toEqual(0);

  });

  // Error: Uncaught (in promise): TypeError: Cannot read properties of undefined (reading 'last')
  it('should create attribute item', fakeAsync(() => {

    // Arrange
    component.newItemMode = true;
    component.selTableRow = ArticlesTestConstants.ARTICLES_ITEM;
    component.tableComponent = TestBed.inject(CustomTableComponent);
    component.tableComponent.selectionIndex = 1;
    component.articlesTabGroup = jasmine.createSpyObj('MatTabGroup', ['childMethod']);
    // select attributes tab (1) as selected
    component.articlesTabGroup.selectedIndex = 1;
    // component.attributePDialogComponent = jasmine.createSpyObj('AttributePDialogComponent',
    //   ['setMessageService, loadAttributeNames, setArticleAttributesNames, setShowDialog']);
    spyOn(component.attributePDialogComponent, 'loadAttributeNames').and.returnValue(Promise.resolve(true));
    spyOn(component.attributePDialogComponent, 'setShowDialog').and.callThrough();

    // Act
    component.createAttributeItem().then(() => {

      // Assert
      expect(component.newItemMode).toBeTruthy();
      expect(component.articleAttributesMode).toBeFalsy();
      expect(component.articlesTabGroup.selectedIndex).toEqual(1);
      expect(component.attributePDialogComponent.setShowDialog).toHaveBeenCalled();
    })

  }));

  // TypeError: Cannot read properties of undefined (reading 'first')
  it('should reset form', async function () {

    // Arrange
    component.formComponent = fixture.componentInstance.formComponent;
    const expectedNewItemMode: boolean = false;
    component.newItemMode = true;

    // Act
    component.resetForm();

    // Assert
    expect(component.newItemMode).toEqual(expectedNewItemMode);

  });

  it('should return "block" if new item mode = true', function () {

    // Arrange
    component.newItemMode = true;

    // Act
    const result: string = component.shouldDisplayForm();

    // Assert
    expect(result).toEqual('block');

  });

  it('should return "none" if new item mode = false', function () {

    // Arrange
    component.newItemMode = false;
    component.lastSelTableRow = undefined;
    component.selTableRow = undefined;

    // Act
    const result: string = component.shouldDisplayForm();

    // Assert
    expect(result).toEqual('none');

  });

  // TypeError: Cannot read properties of undefined (reading 'first')
  // it('should load form data on article tab change', fakeAsync(() => {
  //
  //   // Arrange
  //   component.newItemMode = false;
  //   const $event: MatTabChangeEvent = new MatTabChangeEvent();
  //   component.tableComponent = TestBed.inject(CustomTableComponent);
  //   component.tableComponent.selectionIndex = 0;
  //   component.formComponent = fixture.debugElement.children[0].componentInstance;// new QueryList(); // TestBed.inject(CustomFormComponent);
  //   component.articlesTabGroup = jasmine.createSpyObj('MatTabGroup', ['childMethod']);
  //   // select article tab (0) as selected
  //   component.articlesTabGroup.selectedIndex = 0;
  //   spyOn(component.tableComponent,'setIsLoadingResults').and.callThrough();
  //   spyOn(component.formComponent.first,'setIsLoadingResults').and.callThrough();
  //   spyOn(component.formComponent.last,'setIsLoadingResults').and.callThrough();
  //
  //   // Act
  //   component.onArticleTabChange($event);
  //
  //   // Assert
  //   expect(component.tableComponent.setIsLoadingResults).toHaveBeenCalled();
  //
  // }));

  // TypeError: Cannot read properties of undefined (reading 'first')
  // it('should save form', () => {
  //
  //   // Arrange
  //   const formService: FormService = TestBed.inject(FormService);
  //   spyOn(formService,'saveForm').and.callThrough();
  //   spyOn(component.customFormComponent.first,'setIsLoadingResults').and.callThrough();
  //
  //   // Act
  //   component.saveForm();
  //
  //   // Assert
  //   expect(formService.saveForm).toHaveBeenCalled();
  //
  // });

  // TypeError: Cannot read properties of undefined (reading 'first')
  // it('should load form', () => {
  //
  //   // Arrange
  //   component.customFormComponent = fixture.componentInstance.customFormComponent;
  //   const formService: FormService = TestBed.inject(FormService);
  //   spyOn(formService,'getFormConfigData').and.callThrough();
  //
  //   // Act
  //   component.loadForm();
  //
  //   // Assert
  //   expect(formService.getFormConfigData).toHaveBeenCalled();
  //
  // });
});
