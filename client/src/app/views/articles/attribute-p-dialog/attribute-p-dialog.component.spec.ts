import {MessageService} from 'primeng/api';
import {TranslateItPipe} from '../../../shared/pipes/translate-it.pipe';
import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {AttributePDialogComponent} from './attribute-p-dialog.component';
import {TableDataService} from "../../../_services/table-data.service";
import {HelperService} from "../../../_services/helper.service";
import {AttributesNamesItem} from "../../../interfaces/attributes-names-item";
import {MessagesService} from "../../../_services/messages.service";

describe('AttributePDialogComponent', () => {

  let component: AttributePDialogComponent;
  let fixture: ComponentFixture<AttributePDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [AttributePDialogComponent, TranslateItPipe],
      providers: [TranslateItPipe, MessageService]
    })

    fixture = TestBed.createComponent(AttributePDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load attribute names', fakeAsync(() => {
    // Arrange
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    component.messagesService.setTranslatePipe(TestBed.inject(TranslateItPipe));
    spyOn(component.translatePipe, "transform").and.returnValue('ABC');
    spyOn(tableDataService, "getFormDataByCustomersNumber").and.returnValue(Promise.resolve(
      {'formConfig': [[{label: 'ID', name: 'test'}, {label: 'ATTRIBUTE_NAME', name: 'ATTRIBUTE_NAME'}]]}));

    // Act
    component.loadAttributeNames([{ATTRIBUTE_NAME: ''}]);

    // Assert
    expect(tableDataService.getFormDataByCustomersNumber).toHaveBeenCalled();
  }));

  it('should set selectedAttributeData to undefined if event is undefined', () => {

    // Arrange
    const event = undefined;
    const helperService: HelperService = TestBed.inject(HelperService);
    spyOn(helperService, "getStringInBrackets").and.callThrough();

    // Act
    component.attrNameChanged(event);

    // Assert
    expect(helperService.getStringInBrackets).not.toHaveBeenCalled();
    expect(component.selectedAttributeData).toEqual(undefined);
  });

  it('should set showInputAttrData if attrName is \'ATTR_YOUTUBE\'', () => {

    // Arrange
    const event = {value: {name: 'abc (ATTR_YOUTUBE) def'}};
    const helperService: HelperService = TestBed.inject(HelperService);
    spyOn(helperService, "getStringInBrackets").and.callThrough();

    // Act
    component.attrNameChanged(event);

    // Assert
    expect(helperService.getStringInBrackets).toHaveBeenCalled();
    expect(component.showInputAttrData).toBeTruthy();
  });

  it('should set showInputAttrData if attrName is \'ATTR_SHOP_ACTIVE\'', () => {

    // Arrange
    const event = {value: {name: 'abc (ATTR_SHOP_ACTIVE) def'}};
    const helperService: HelperService = TestBed.inject(HelperService);
    spyOn(helperService, "getStringInBrackets").and.callThrough();

    // Act
    component.attrNameChanged(event);

    // Assert
    expect(helperService.getStringInBrackets).toHaveBeenCalled();
    expect(component.showCheckboxAttrData).toBeTruthy();
  });

  it('should set showInputAttrData if attrName is \'OTHER\'', () => {

    // Arrange
    const event = {value: {name: 'abc (OTHER) def'}};
    const helperService: HelperService = TestBed.inject(HelperService);
    spyOn(helperService, "getStringInBrackets").and.callThrough();

    // Act
    component.attrNameChanged(event);

    // Assert
    expect(helperService.getStringInBrackets).toHaveBeenCalled();
    expect(component.showDropdownAttrData).toBeTruthy();
  });

  it('should set showDialog to true', () => {

    // Arrange
    component.showDialog = false;

    // Act
    component.setShowDialog(true);

    // Assert
    expect(component.showDialog).toBeTruthy();
  });

  it('should return possible new attributes', () => {

    // Arrange
    const attributes: { id: string, name: string }[] = [{id: 'id', name: 'name'}];
    component.possibleNewAttributes = attributes;

    // Act
    component.getPossibleNewAttributes();

    // Assert
    expect(component.possibleNewAttributes).toEqual(attributes);
  });

  it('should return attribute id', () => {

    // Arrange
    const attributeName: string = 'ATTR_CRAFT';
    const attributeId: string = '2012';
    const attributesData: { 'table': any[] } =
      {'table': [[], [{ID: attributeId, ATTRIBUTE_NAME: attributeName, ATTRIBUTE_DATA: '0'}]]};

    // Act
    const result: undefined | string = component.getAttributeId(attributeName, attributesData);

    // Assert
    expect(result).toEqual(attributeId);

  });

  it('should return attribute names', fakeAsync(() => {

    // Arrange
    const expectedResult: AttributesNamesItem[] = [{
      ID: '1',
      ATTRIBUTE_NAME: 'ATTR_CATEGORY_0',
      ATTRIBUTE_FIELD_TYPE: '',
      ATTRIBUTE_DATA_TYPE: ''
    }];
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, "getFormDataByCustomersNumber").and.returnValue(Promise.resolve(
      {
        'formConfig': [[{label: 'ID', value: '1'}, {label: 'ATTRIBUTE_NAME', value: 'ATTR_CATEGORY_0'},
          {label: 'ATTRIBUTE_FIELD_TYPE', value: 'string'}, {label: 'ATTRIBUTE_DATA_TYPE', value: 'string'}]]
      }));

    // Act
    component.getAttributeNames().then((result: AttributesNamesItem[]) => {
      // Assert
      expect(result).toEqual(expectedResult);
      expect(tableDataService.getFormDataByCustomersNumber).toHaveBeenCalled();
    });

  }));

  it('should save form for attribute "ATTR_CATEGORY_0"', fakeAsync(() => {

    // Arrange
    component.showDropdownAttrData = false;
    component.attributesNames = ['ATTR_CATEGORY_0', 'ATTR_CATEGORY_1', 'ATTR_YOUTUBE'];
    component.articleAttributesNames = ['ATTR_CATEGORY_0'];
    component.messagesService = TestBed.inject(MessagesService);
    component.attrViewUpdate = new Function();
    let tableDataService: TableDataService = TestBed.inject(TableDataService);
    const getTableDataByIdResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {table: [[], []], maxRows: 0, page: 0};
    const getAttributeNameResult: { attributeName: string, attrNameWithBrackets: string } =
      {attributeName: 'ATTR_CATEGORY_1', attrNameWithBrackets: 'ATTR_CATEGORY_1'};
    const attributeId: string = '1';
    spyOn(component, 'getAttributeName').and.returnValue(Promise.resolve(getAttributeNameResult));
    spyOn(component, 'getAttributeId').and.returnValue(attributeId);
    spyOn(localStorage, 'getItem').and.returnValue("selItemId");
    spyOn(tableDataService, 'getTableDataById').and.returnValue(Promise.resolve(getTableDataByIdResponse));
    // attribute is not existing: result = false
    spyOn(tableDataService, 'checkTableData').and.returnValue(Promise.resolve({result: false}));
    spyOn(tableDataService, 'setTableData').and.callThrough();
    spyOn(component.messagesService, 'showSuccessMessage').and.callThrough();
    spyOn(component, 'attrViewUpdate').and.callThrough();

    // Act
    component.saveForm().then(() => {

      // Assert
      expect(component.getAttributeName).toHaveBeenCalled();
      expect(component.getAttributeId).toHaveBeenCalled();
      expect(tableDataService.getTableDataById).toHaveBeenCalled();
      expect(tableDataService.checkTableData).toHaveBeenCalled();
      expect(tableDataService.setTableData).toHaveBeenCalled();
      expect(component.attrViewUpdate).toHaveBeenCalled();
    })

  }))

  // fit('should save form for attribute "ATTR_YOUTUBE"', fakeAsync(() => {
  //
  //   // Arrange
  //   component.showDropdownAttrData = false;
  //   component.attributesNames = ['ATTR_CATEGORY_0', 'ATTR_CATEGORY_1', 'ATTR_YOUTUBE'];
  //   component.articleAttributesNames = ['ATTR_CATEGORY_0'];
  //   component.messagesService = TestBed.inject(MessagesService);
  //   component.attrViewUpdate = new Function();
  //   // component.messagesService.setTranslatePipe(TestBed.inject(TranslateItPipe));
  //
  //   let tableDataService: TableDataService = TestBed.inject(TableDataService);
  //   const getTableDataByIdResponse: { table: [any[string], any[]], maxRows: number, page: number } =
  //     {table: [[], []], maxRows: 0, page: 0};
  //   const getAttributeNameResult: { attributeName: string, attrNameWithBrackets: string } =
  //     {attributeName: 'ATTR_YOUTUBE', attrNameWithBrackets: 'ATTR_YOUTUBE'};
  //   spyOn(component, 'getAttributeName').and.returnValue(Promise.resolve(getAttributeNameResult));
  //   spyOn(localStorage, 'getItem').and.returnValue("selItemId");
  //   spyOn(tableDataService, 'getTableDataById').and.returnValue(Promise.resolve(getTableDataByIdResponse));
  //   spyOn(tableDataService, 'setTableData').and.returnValue(Promise.resolve({}));
  //   spyOn(tableDataService, 'getLastIdOfTable').and.returnValue(Promise.resolve({id: '1'}));
  //   // attribute is not existing: result = false
  //   spyOn(tableDataService, 'checkTableData').and.returnValue(Promise.resolve({result: false}));
  //   // spyOn(component.messagesService, 'showSuccessMessage').and.callThrough();
  //   spyOn(component, 'attrViewUpdate').and.callThrough();
  //
  //   // Act
  //   component.saveForm().then(() => {
  //
  //     // Assert
  //     expect(component.getAttributeName).toHaveBeenCalled();
  //     expect(tableDataService.getTableDataById).toHaveBeenCalled();
  //     expect(tableDataService.getLastIdOfTable).toHaveBeenCalled();
  //     expect(tableDataService.checkTableData).toHaveBeenCalled();
  //     expect(tableDataService.setTableData).toHaveBeenCalled();
  //     expect(component.attrViewUpdate).toHaveBeenCalled();
  //   })
  //
  // }))

  it('should not save form if attribute is not existing in attributes names', fakeAsync(() => {

    // Arrange
    console.log = jasmine.createSpy("log");
    component.showDropdownAttrData = false;
    component.attributesNames = ['ATTR_CATEGORY_0', 'ATTR_CATEGORY_1'];
    component.articleAttributesNames = ['ATTR_CATEGORY_0'];
    component.messagesService = TestBed.inject(MessagesService);
    component.attrViewUpdate = new Function();
    let tableDataService: TableDataService = TestBed.inject(TableDataService);
    const getTableDataByIdResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {table: [[], []], maxRows: 0, page: 0};
    const getAttributeNameResult: { attributeName: string, attrNameWithBrackets: string } =
      {attributeName: 'ATTR_YOUTUBE', attrNameWithBrackets: 'ATTR_YOUTUBE'};
    spyOn(component, 'getAttributeName').and.returnValue(Promise.resolve(getAttributeNameResult));
    spyOn(tableDataService, 'getTableDataById').and.returnValue(Promise.resolve(getTableDataByIdResponse));

    // Act
    component.saveForm().then(() => {

      // Assert
      expect(component.getAttributeName).toHaveBeenCalled();
      expect(tableDataService.getTableDataById).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Extracted attribute name \'' +
        getAttributeNameResult.attributeName + '\' not exists in attributesNames: ', component.attributesNames);
    })

  }))

  it('should not save form if attribute is already existing in db', fakeAsync(() => {

    // Arrange
    console.log = jasmine.createSpy("log");
    component.showDropdownAttrData = false;
    component.attributesNames = ['ATTR_CATEGORY_0', 'ATTR_CATEGORY_1', 'ATTR_YOUTUBE'];
    component.articleAttributesNames = ['ATTR_YOUTUBE'];
    component.messagesService = TestBed.inject(MessagesService);
    component.attrViewUpdate = new Function();
    component.messagesService.setTranslatePipe(TestBed.inject(TranslateItPipe));
    let tableDataService: TableDataService = TestBed.inject(TableDataService);
    const getTableDataByIdResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {table: [[], []], maxRows: 0, page: 0};
    const getAttributeNameResult: { attributeName: string, attrNameWithBrackets: string } =
      {attributeName: 'ATTR_YOUTUBE', attrNameWithBrackets: 'ATTR_YOUTUBE'};
    spyOn(component, 'getAttributeName').and.returnValue(Promise.resolve(getAttributeNameResult));
    spyOn(tableDataService, 'getTableDataById').and.returnValue(Promise.resolve(getTableDataByIdResponse));
    spyOn(component.messagesService, 'showErrorMessage').and.callThrough();

    // Act
    component.saveForm().then(() => {

      // Assert
      expect(component.getAttributeName).toHaveBeenCalled();
      expect(tableDataService.getTableDataById).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Attribute name \'' + getAttributeNameResult.attributeName + '\' ' +
        'already exists in attributes names select for current article!');
      expect(component.messagesService.showErrorMessage).toHaveBeenCalled();
    })

  }))

  it('should open new window for creating new attribute', () => {

    // Arrange
    const $event: MouseEvent = document.createEvent('MouseEvent');
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, 'openNewWindow').and.callThrough();

    // Act
    component.newAttribute($event);

    // Assert
    expect(tableDataService.openNewWindow).toHaveBeenCalled();
  })

  it('should return attribute name for drop down', fakeAsync(() => {

    // Arrange
    component.selectedAttributeData = {id: '1'};
    component.showDropdownAttrData = true;
    component.showCheckboxAttrData = false;
    component.showInputAttrData = false;
    component.selectedAttributeName = {id: '1', name: 'ATTR_CATEGORY_1'};
    const getAttributeNamesResult: AttributesNamesItem[] = [{
      ID: '1',
      ATTRIBUTE_NAME: 'ATTR_CATEGORY_1',
      ATTRIBUTE_FIELD_TYPE: '',
      ATTRIBUTE_DATA_TYPE: ''
    }];
    const expectedResult: { attributeName: string, attrNameWithBrackets: string } =
      {attributeName: 'ATTR_CATEGORY_1', attrNameWithBrackets: 'ATTR_CATEGORY_1'};
    spyOn(component, 'getAttributeNames').and.returnValue(Promise.resolve(getAttributeNamesResult));

    // Act
    component.getAttributeName().then((result: { attributeName: string, attrNameWithBrackets: string }) => {
      // Assert
      expect(component.getAttributeNames).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

  }));

  it('should return attribute name for checkbox', fakeAsync(() => {

    // Arrange
    component.selectedAttributeData = {id: '1'};
    component.showDropdownAttrData = false;
    component.showCheckboxAttrData = true;
    component.showInputAttrData = false;
    component.selectedAttributeName = {id: '1', name: 'ATTR_CATEGORY_1'};
    component.dataAttributes = [{
      ID: '1',
      ATTRIBUTE_NAME: 'ATTR_CATEGORY_1',
      ATTRIBUTE_FIELD_TYPE: '',
      ATTRIBUTE_DATA_TYPE: ''
    }];
    const expectedResult: { attributeName: string, attrNameWithBrackets: string } =
      {attributeName: 'ATTR_CATEGORY_1', attrNameWithBrackets: 'ATTR_CATEGORY_1'};

    // Act
    component.getAttributeName().then((result: { attributeName: string, attrNameWithBrackets: string }) => {
      // Assert
      expect(result).toEqual(expectedResult);
    });

  }));

  it('should return attribute name for checkbox', fakeAsync(() => {

    // Arrange
    component.selectedAttributeData = {id: '1'};
    component.showDropdownAttrData = false;
    component.showCheckboxAttrData = false;
    component.showInputAttrData = true;
    component.selectedAttributeName = {id: '1', name: 'ATTR_CATEGORY_1'};
    component.dataAttributes = [{
      ID: '1',
      ATTRIBUTE_NAME: 'ATTR_CATEGORY_1',
      ATTRIBUTE_FIELD_TYPE: '',
      ATTRIBUTE_DATA_TYPE: ''
    }];
    const expectedResult: { attributeName: string, attrNameWithBrackets: string } =
      {attributeName: 'ATTR_CATEGORY_1', attrNameWithBrackets: 'ATTR_CATEGORY_1'};

    // Act
    component.getAttributeName().then((result: { attributeName: string, attrNameWithBrackets: string }) => {
      // Assert
      expect(result).toEqual(expectedResult);
    });

  }));

});
