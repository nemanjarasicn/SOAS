import {TableDataService} from './table-data.service';
import {MessageService} from 'primeng/api';
import {TranslateItPipe} from '../shared/pipes/translate-it.pipe';
import {TestingModule} from 'src/app/testing/testing.module';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FormService} from './form.service';
import {OrdersTestConstants} from '../../assets/test-constants/orders';
import {WarehousingTestConstants} from '../../assets/test-constants/warehousing';
import {CountriesTestConstants} from '../../assets/test-constants/countries';
import {AttributesTestConstants} from '../../assets/test-constants/attributes';
import {ArticlesTestConstants} from '../../assets/test-constants/articles';
import {ErrorsTestConstants} from '../../assets/test-constants/errors';
import {ConstantsService, SoasModel} from './constants.service';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {OptionsService} from './options.service';
import {Countries} from "../models/countries";
import {CustomersTestConstants} from "../../assets/test-constants/customers";


describe('FormService', () => {

  let service: FormService;
  let tableDataService: TableDataService;
  let translate: TranslateItPipe;
  let optionsService: OptionsService;
  let constants: ConstantsService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [TranslateItPipe],
      providers: [MessageService, TableDataService, TranslateItPipe, OptionsService, ConstantsService]
    })

    service = TestBed.inject(FormService);
    tableDataService = TestBed.inject(TableDataService);
    translate = TestBed.inject(TranslateItPipe);
    service.setTranslatePipe(translate);
    optionsService = TestBed.inject(OptionsService);
    constants = TestBed.inject(ConstantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getFormConfigData calls callback with {model: {}, fields: []} if formTemplate is not set', fakeAsync(() => {

    // Arrange
    const formlyFormResponse = {formTemplate: undefined};
    spyOn(tableDataService, 'getFormlyForm').and.returnValue(Promise.resolve(formlyFormResponse));

    // Act
    expectAsync(service.getFormConfigData('orders', false, 'ORDERS_NUMBER',
      '50021AU000027', 'CUSTOMER_ORDER', undefined, undefined,
      false)).toBeResolvedTo({model: {}, fields: []});

    // Assert
    expect(tableDataService.getFormlyForm).toHaveBeenCalled();
  }));

  it('getFormConfigData calls callback with {model: {}, fields: []} if table is not found', fakeAsync(() => {

    // Arrange
    const tableServiceResponse = undefined;
    spyOn(tableDataService, 'getFormlyForm').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getFormConfigData('tableName', false, 'customerColumn',
      'customerNumber', 'secondColumn', 'secondId', 'formOptions',
      false)).toBeResolvedTo({model: {}, fields: []});

    // Assert
    expect(tableDataService.getFormlyForm).toHaveBeenCalled();
  }));

  it('getFormConfigData calls callback with {model: {}, fields: []} if http error is occurred', fakeAsync(() => {

    // Arrange
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    spyOn(tableDataService, 'getFormlyForm').and.returnValue(Promise.reject(errorResponse)); // throwError(errorResponse)
    spyOn(tableDataService, 'handleHttpError').and.callThrough();

    // Act
    expectAsync(service.getFormConfigData('tableName', false, 'customerColumn',
      'customerNumber', 'secondColumn', 'secondId', 'formOptions',
      false)).toBeRejectedWith(errorResponse);

    // Assert
    expect(tableDataService.getFormlyForm).toHaveBeenCalled();
    // expect(tableDataService.handleHttpError).toHaveBeenCalled();
  }));

  it('getFormConfigData calls callback with {model: {...}, fields: [...]} if table is found', fakeAsync(() => {

    // Arrange
    const jsonObject = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_FIELDS)); // make copy
    const formlyFormResponse = {formTemplate: [{FORM_TEMPLATE: jsonObject}]};
    const formDataResponse = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_MODEL)); // make copy

    const modelValuesResponse = 26;
    const orderNumberFieldName = 'ORDERS_NUMBER';
    const orderNumberFieldValue = '50021AU000027';

    spyOn(tableDataService, 'getFormlyForm').and.returnValue(Promise.resolve(formlyFormResponse));
    spyOn(tableDataService, 'getFormlyFormData').and.returnValue(Promise.resolve(formDataResponse));
    spyOn(service, 'setFormFields').and.callThrough();

    // Act
    service.getFormConfigData('orders', false, 'ORDERS_NUMBER',
      '50021AU000027', 'CUSTOMER_ORDER', undefined, undefined,
      false);

    tick();

    // Assert
    expect(tableDataService.getFormlyForm).toHaveBeenCalled();
    expect(tableDataService.getFormlyFormData).toHaveBeenCalled();

    // check if set was called with 'formDisabled' param = false. that means 'getFormDisabled' was called.
    // expect(service.setFormFields).toHaveBeenCalledWith(false, 'orders', orderNumberFieldValue, [], 0, undefined,
    //   formDataResponse, false);

    expect(service.model).toBeDefined();
    expect(service.fields).toBeDefined();

    expect((Object.keys(service.model).length - 1) as number).toBe(modelValuesResponse);
    // -1 because CUSTOMER_ADDRESSES is a virtual field
    expect(Object.keys(service.fields).length as number).toBe((Object.keys(service.model).length - 1) as number);

    expect(service.model[orderNumberFieldName]).toEqual(orderNumberFieldValue);
    expect(service.fields[0]['fieldGroup'][0].key).toEqual(orderNumberFieldName);
  }));

  it('getFormConfigData check if getFormDisabled was called', fakeAsync(() => {

    // Arrange
    const jsonObject = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_FIELDS)); // make copy
    let ordersModel = OrdersTestConstants.ORDERS_MODEL;
    ordersModel.row.data[1][0].ORDERS_STATE = 30; // set state to ORDER_STATES_COMPLETED = 30
    const formDataResponse = JSON.parse(JSON.stringify(ordersModel)); // make copy
    const formlyFormResponse = {formTemplate: [{FORM_TEMPLATE: jsonObject}]};

    const orderNumberFieldValue = '50021AU000027';

    spyOn(tableDataService, 'getFormlyForm').and.returnValue(Promise.resolve(formlyFormResponse));
    spyOn(tableDataService, 'getFormlyFormData').and.returnValue(Promise.resolve(formDataResponse));
    spyOn(service, 'setFormFields').and.callThrough();

    // Act
    service.getFormConfigData('orders', false, 'ORDERS_NUMBER',
      '50021AU000027', 'CUSTOMER_ORDER', undefined, undefined,
      false);

    tick();

    expect(tableDataService.getFormlyFormData).toHaveBeenCalled();

    // check if set was called with 'formDisabled' param = true. that means 'getFormDisabled' was called.
    expect(service.setFormFields).toHaveBeenCalledWith(false, 'orders', orderNumberFieldValue, [], 0, undefined,
      formDataResponse, true);
  }));

  it('checkCustomerNumber calls callback with {exists: false, type: false} if table is not found', fakeAsync(() => {

    // Arrange
    const tableServiceResponse = undefined;
    spyOn(tableDataService, 'getTableDataByCustomersNumber').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.checkCustomerNumber('customerNumber', 'client'))
      .toBeResolvedTo({exists: false, type: false});


    // Assert
    expect(tableDataService.getTableDataByCustomersNumber).toHaveBeenCalled();
  }));

  it('checkCustomerNumber calls callback with {exists: true, type: true} if table is found', fakeAsync(() => {

    // Arrange
    const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } = {
      table: [[], [
        {'CUSTOMERS_TYPE': 'B2C'}
      ]],
      "maxRows": 203955,
      "page": 0
    };
    spyOn(tableDataService, 'getTableDataByCustomersNumber').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.checkCustomerNumber('0100000020', 'B2C'))
      .toBeResolvedTo({exists: true, type: true});

    // Assert
    expect(tableDataService.getTableDataByCustomersNumber).toHaveBeenCalled();
  }));

  it('getAddressIsoCodeByCountry returns "DE" if countriesWithIso items are undefined', () => {

    // Arrange
    const tableServiceResponse = 'DE';

    // Act
    let result = service.getAddressIsoCodeByCountry('country',
      [{id: undefined, name: undefined, value: undefined}]);

    // Assert
    expect(result).toBe(tableServiceResponse);
  });

  it('getAddressIsoCodeByCountry returns "CH" if countriesWithIso items are set', () => {

    // Arrange
    const tableServiceResponse = 'CH';

    // Act
    let result = service.getAddressIsoCodeByCountry('Schweiz',
      [{id: '26', name: 'Schweiz', value: 'CH'}]);

    // Assert
    expect(result).toBe(tableServiceResponse);
  });

  it('setFormFields returns 0 if fields items are undefined', fakeAsync(async (done) => {

    // Arrange
    service.fields = undefined;
    const tableServiceResponse = await Promise.resolve(0);

    // Act
    let result = service.setFormFields(false, 'refTable', 'customerNumber',
      ['attribOptions'], 0, 'formOptions', 'dbData', false);

    // Assert
    expectAsync(result).toBeResolvedTo(tableServiceResponse);
  }));

  it('setFormFields on orders fields returns fields number (26) if fields items are set', fakeAsync(async (done) => {

    // Arrange
    service.fields = JSON.parse(OrdersTestConstants.ORDERS_FIELDS); // make copy
    service.model = OrdersTestConstants.ORDERS_MODEL;
    const tableServiceResponse = service.fields.length;
    const tableServiceResponseAsPromise = await Promise.resolve(tableServiceResponse);
    spyOn(translate, 'transform').and.callThrough();

    // Act
    let result = await service.setFormFields(false, 'refTable', 'customerNumber',
      ['attribOptions'], 0, 'formOptions', {}, true);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(tableServiceResponseAsPromise);

    // check if translate transform was called 26 times. that means private function 'translateFieldLabel' was called
    expect(translate.transform).toHaveBeenCalledTimes(tableServiceResponse);

    // check if private function 'setFieldsDisabled' was executed and 'templateOptions.disabled'"' is set to 'true'
    expect(service.fields[1].fieldGroup[0].expressionProperties['templateOptions.disabled']).toBe('true');
  }));

  it('setFormFields on attribute fields returns translated fields number (2) if fields items are set', fakeAsync(async (done) => {

    // Arrange
    const fieldsItemsNumber: number = 8; // AttributesTestConstants.ATTRIBUTES_FIELDS
    service.fields = JSON.parse(AttributesTestConstants.ATTRIBUTES_FIELDS); // make copy
    service.model = AttributesTestConstants.ATTRIBUTES_MODEL;
    // const tableServiceResponse = service.fields.length;
    const translatedNumber: number = AttributesTestConstants.ATTRIBUTE_OPTIONS.length;
    spyOn(translate, 'transform').and.callThrough();

    // Act
    let result = await service.setFormFields(false, 'articlesAttributes', 'customerNumber',
      AttributesTestConstants.ATTRIBUTE_OPTIONS, 0, 'formOptions', {}, true);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(fieldsItemsNumber);
    expect(translate).toBeDefined();
    expect(translate.transform).toBeDefined();
    // expect(result).toBe(tableServiceResponse);

    // check if translate transform was called 3 times. that means private function 'translateAttrFieldLabel' was called
    expect(translate.transform).toHaveBeenCalledTimes(translatedNumber);
  }));

  it('setFormFields on attribute fields returns extended fields number of (+2) if new fields are added', fakeAsync(async (done) => {

    // Arrange
    service.fields = JSON.parse(AttributesTestConstants.ATTRIBUTES_FIELDS); // make copy
    service.model = AttributesTestConstants.ATTRIBUTES_MODEL;
    const tableServiceResponse = await Promise.resolve(service.fields[0]['fieldGroup'][0]['fieldGroup'].length);
    // translated number is 3: 2 items in fields and one new added item at addAdditionalAttributesFields
    const translatedNumber: number = AttributesTestConstants.ATTRIBUTE_OPTIONS.length;
    spyOn(translate, 'transform').and.callThrough();

    // Act
    let result = await service.setFormFields(false, 'articlesAttributes', 'customerNumber',
      AttributesTestConstants.ATTRIBUTE_OPTIONS, 0, 'formOptions', {}, true);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(tableServiceResponse);

    // check if translate transform was called 3 times.
    // that means private function 'addAdditionalAttributesFields' was called
    expect(translate.transform).toHaveBeenCalledTimes(translatedNumber);
  }));

  it('setFormFields returns warehousing fields number and set date if fields items are set and newItemMode is true', fakeAsync(async (done) => {

    // Arrange
    service.fields = JSON.parse(WarehousingTestConstants.WAREHOUSING_FIELDS); // make copy
    const tableServiceResponse = await Promise.resolve(service.fields.length);

    // Act
    let result = await service.setFormFields(true, 'warehousing', '7712',
      ['attribOptions'], 0, 'formOptions', {}, true);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(tableServiceResponse);

    // check if private function 'setFieldsDisabled' was executed and 'templateOptions.disabled' is set to 'true'
    expect(service.fields[1].fieldGroup[0].expressionProperties['templateOptions.disabled']).toBe('true');

    // if private function 'getCurrentDate' was executed and 'defaultValue' is set to Date
    const date = new Date(service.fields[1].fieldGroup[0].defaultValue);
    const date1 = new Date();
    expect(date.getUTCFullYear() + '.' + date.getMonth() + '.' + date.getDay())
      .toEqual(date1.getUTCFullYear() + '.' + date1.getMonth() + '.' + date1.getDay());
  }));

  it('setFormFields returns articles fields number and set date if fields items are set and newItemMode is true', fakeAsync(async (done) => {

    // Arrange
    service.fields = JSON.parse(ArticlesTestConstants.ARTICLES_FIELDS); // make copy
    const responseValue = service.fields.length + 4; // 4 section-label elements;
    const tableServiceResponse = await Promise.resolve(responseValue); // 4 section-label elements

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(
      [{"DE_DE": "wird automatisch generiert", "LOCALIZE_TAG": "WILL_BE_AUTO_GENERATED"}]));
    spyOn(translate, 'transform').and.callThrough();

    // Act
    let result = await service.setFormFields(true, 'articles', '7712',
      ['attribOptions'], 0, 'formOptions', 'dbData', true);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(tableServiceResponse);

    // if private function 'setFieldsOptions' was executed and 'defaultValue' is set to undefined
    // expect(service.fields[0].fieldGroup[0].defaultValue).toEqual('wird automatisch generiert');

    // check if translate transform was called 18 + 1 times. that means private function 'setFieldsOptions' was called
    expect(translate.transform).toHaveBeenCalledTimes(responseValue + 1);
  }));

  it('setFormFields returns fields number and not set date if fields items are set and newItemMode is false', fakeAsync(async (done) => {

    // Arrange
    service.fields = JSON.parse(WarehousingTestConstants.WAREHOUSING_FIELDS); // make copy
    const tableServiceResponse = await Promise.resolve(service.fields.length);

    // Act
    let result = await service.setFormFields(false, 'warehousing', '7712',
      ['attribOptions'], 0, 'formOptions', 'dbData', true);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(tableServiceResponse);

    // check if private function 'setFieldsDisabled' was executed and 'templateOptions.disabled' is set to 'true'
    expect(service.fields[1].fieldGroup[0].expressionProperties['templateOptions.disabled']).toBe('true');

    // if private function 'getCurrentDate' was not executed and 'defaultValue' is set to undefined
    expect(service.fields[1].fieldGroup[0].defaultValue).toEqual(undefined);
  }));

  it('setModelValues not change model ({}) if dbData is not set', () => {

    // Arrange
    const response = {};
    service.model = {};

    // Act
    service.setModelValues(false, 'refTable', undefined, 'formOptions',
      ['attribOptions']);

    // Assert
    expect(optionsService.addressesDLV).toBeDefined();
    expect(optionsService.addressesINV).toBeDefined();
    expect(service.model).toBeDefined();

    expect(service.model).toEqual(response);
  });

  it('setModelValues not change model ({}) if newItemMode is true', () => {

    // Arrange
    const response = {};
    service.model = {};

    // Act
    service.setModelValues(true, 'refTable', undefined, 'formOptions',
      ['attribOptions']);

    // Assert
    expect(optionsService.addressesDLV).toBeDefined();
    expect(optionsService.addressesINV).toBeDefined();
    expect(service.model).toBeDefined();

    expect(service.model).toEqual(response);
  });

  it('setModelValues change model to {ORDERS_NUMBER: "50021AU000027", ...} if dbData is set', () => {

    // Arrange
    const newItemMode: boolean = false;
    const refTable: string = 'refTable';
    const formOptions: {} = {options: 'formOptions'};
    const attribOptions: string[] = ['attribOptions'];
    const response: any | SoasModel = JSON.parse(JSON.stringify(OrdersTestConstants.ORDERS_MODEL.row.data[1][0]))
    const dbData: { row: { data: {} } } = OrdersTestConstants.ORDERS_MODEL;
    service.model = response;
    spyOn(optionsService, "getOrderAddresses").and.callThrough();

    // Act
    service.setModelValues(newItemMode, refTable, dbData, formOptions, attribOptions);

    // Assert
    expect(optionsService.getOrderAddresses).toHaveBeenCalled();
    expect(optionsService.addressesDLV).toBeDefined();
    expect(optionsService.addressesINV).toBeDefined();
    expect(service.model).toBeDefined();
    expect(service.model).toEqual(response);

    // check private function 'getOrderAddresses':
    // 2 items: 'PLEASE_SELECT' + address item (extracted from 'DLV~511823~Musterstr. 1 - 11111 Musterstadt;')
    expect(optionsService.addressesDLV.length as number).toBe(2);
    expect(optionsService.addressesINV.length as number).toBe(2);
  })

  it('saveForm calls callback with {result: false, ...} if refTable was not resolved', fakeAsync(() => {

    // Arrange
    console.log = jasmine.createSpy("log");
    const tableServiceResponse = {result: false, message: 'ERROR_DURING_CHECKING', refTable: undefined};
    let fields: FormlyFieldConfig[] = JSON.parse(JSON.stringify(CountriesTestConstants.COUNTRIES_FORM_FIELDS_AS_FORMLY_CONFIG));
    // set refTable to undefined
    fields[0].fieldGroup[0].templateOptions.refTable = undefined;
    fields[1].fieldGroup[0].templateOptions.refTable = undefined;
    fields[2].fieldGroup[0].templateOptions.refTable = undefined;
    const saveFormParams = {formValues: CountriesTestConstants.COUNTRIES_ITEM, fields: fields};

    // Act
    service.saveForm(saveFormParams).then((result) => {
      // Assert
      expect(console.log).toHaveBeenCalledWith(
        'ERROR: Check if refTable, customer number, primary key/value and formValues are set.');
      expect(result).toEqual(tableServiceResponse);
    });

  }));

  it('saveForm calls callback with {result: "ERROR"} if formValues ar not set', fakeAsync(() => {

    // Arrange
    const tableServiceResponse = {result: false, message: 'ERROR_DURING_CHECKING', refTable: 'countries'};
    const fields: FormlyFieldConfig[] = CountriesTestConstants.COUNTRIES_FORM_FIELDS_AS_FORMLY_CONFIG;
    const formValues: SoasModel = undefined;

    const saveFormParams = {formValues: formValues, fields: fields};

    // Act & Assert
    service.saveForm(saveFormParams).then((result) => {
      // Assert
      expect(result).toEqual(tableServiceResponse);
    });

  }));

  // it('saveForm calls callback with {result: "ERROR"} if http error is occurred', () => {
  //
  //   // Arrange
  //   const callbackObject = {func: (status) => {}};
  //   const tableServiceResponse = {result: 'ERROR'};
  //   const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
  //   spyOn(localStorage, 'getItem').and.returnValue('1234'); // set localStorage getItem to return some value
  //   spyOn(tableDataService, 'getTableDataById').and.returnValue(throwError(errorResponse));
  //   spyOn(tableDataService, 'handleHttpError').and.callThrough();
  //   spyOn(callbackObject, 'func');
  //
  //   // Act
  //   service.saveForm({PAYMENT_CONFIRMED:'1'}, 'paymentTerms', true,
  //     'PAYMENT_TERM_ID', 'BAR', null, null, callbackObject.func);
  //
  //   // Assert
  //   expect(tableDataService.getTableDataById).toHaveBeenCalled();
  //   expect(tableDataService.handleHttpError).toHaveBeenCalled();
  //   expect(callbackObject.func).toHaveBeenCalledWith(tableServiceResponse);
  // })
  //
  // // ToDo: Set temporarily LOCKED result to true or enable test if table locks are enabled
  // // xit('saveForm calls callback with {result: "LOCKED"} if refTable and item was locked', () => {
  // //
  // //   // Arrange
  // //
  // //   const callbackObject = {func: () => {}};
  // //   const tableServiceResponse = {result: 'LOCKED'};
  // //   spyOn(callbackObject, 'func');
  // //
  // //   // Act
  // //   service.saveForm({}, 'paymentTerms', false, 'PAYMENT_TERM_ID', 'BAR',
  // //     null, null, callbackObject.func);
  // //
  // //   // Assert
  // //   expect(callbackObject.func).toHaveBeenCalledWith(tableServiceResponse);
  // // })
  //

  it('saveForm calls callback with {result: "OK"} if all parameters are set and update mode', fakeAsync(() => {

    // Arrange
    const refTable = 'countries';
    const tableName = 'COUNTRIES';
    const newItemMode: boolean = false;
    const needsValidation: boolean = false;
    const primaryKey: string = 'COUNTRY_ID';
    const primaryValue: string = 'Australien';
    const secondaryKey: string = '';
    const secondaryValue: string = '';
    const tertiaryKey: string = '';
    const tertiaryValue: string = '';
    const isIdentity: boolean = false;
    const country: Countries = CountriesTestConstants.COUNTRIES_ITEM;
    const tableServiceResponse = {result: true, message: 'OK', refTable: refTable};
    let fields: FormlyFieldConfig[] = JSON.parse(CountriesTestConstants.COUNTRIES_FORM_FIELDS);
    const saveFormParams = {formValues: country, fields: fields};
    const getFieldsPropertiesResponse: {
      refTable: string, tableName: string, newItemMode: boolean, needsValidation: boolean,
      primaryKey: string, primaryValue: string, secondaryKey: string, secondaryValue: string, tertiaryKey: string,
      tertiaryValue: string, isIdentity: boolean
    } = {
      refTable, tableName, newItemMode, needsValidation, primaryKey, primaryValue,
      secondaryKey, secondaryValue, tertiaryKey, tertiaryValue, isIdentity
    };
    const getTableAndDatasetResponse: { refTableTitle: string, primaryValue: string } =
      {refTableTitle: tableName, primaryValue: primaryValue};
    spyOn(service as any, "getFieldsProperties").and.returnValue(getFieldsPropertiesResponse);
    spyOn(service as any, "getTableAndDataset").and.returnValue(getTableAndDatasetResponse);
    spyOn(localStorage, 'getItem').and.returnValue('1234');
    // spyOn(tableDataService, 'setTableData').and.returnValue( Promise.resolve(getTableDataByIdResponse) );

    // Act
    // service.saveForm({PAYMENT_CONFIRMED:'1'}, 'paymentTerms', false,
    //   'PAYMENT_TERM_ID', 'BAR', null, null, callbackObject.func);
    service.saveForm(saveFormParams).then((result) => {
      // Assert
      expect(result).toEqual(tableServiceResponse);
      // expect(tableDataService.setTableData).toHaveBeenCalled();
    });

  }));

  it('saveForm calls callback with {result: "OK"} for countries, if all parameters are set and insert mode', fakeAsync(() => {

    // Arrange
    const refTable = constants.REFTABLE_COUNTRIES;
    const tableName = constants.REFTABLE_COUNTRIES_TITLE;
    const newItemMode: boolean = true;
    const needsValidation: boolean = false;
    const primaryKey: string = constants.REFTABLE_COUNTRIES_COLUMN;
    const primaryValue: string = 'Australien';
    const secondaryKey: string = '';
    const secondaryValue: string = '';
    const tertiaryKey: string = '';
    const tertiaryValue: string = '';
    const isIdentity: boolean = false;
    const getTableDataByIdResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {table: [[], []], maxRows: 0, page: 0};
    const setTableDataResponse = {result: {}};
    const tableServiceResponse = {result: true, message: 'SAVEDSUCCESS', refTable: refTable};
    let fields: FormlyFieldConfig[] = JSON.parse(CountriesTestConstants.COUNTRIES_FORM_FIELDS);
    const country = {COUNTRY_ID: 1, COUNTRY_NAME: "Australien", COUNTRY_ISO_CODE: "AU"};
    const saveFormParams = {formValues: country, fields: fields};
    const getFieldsPropertiesResponse: {
      refTable: string, tableName: string, newItemMode: boolean, needsValidation: boolean,
      primaryKey: string, primaryValue: string, secondaryKey: string, secondaryValue: string, tertiaryKey: string,
      tertiaryValue: string, isIdentity: boolean
    } = {
      refTable, tableName, newItemMode, needsValidation, primaryKey, primaryValue,
      secondaryKey, secondaryValue, tertiaryKey, tertiaryValue, isIdentity
    };
    const getTableAndDatasetResponse: { refTableTitle: string, primaryValue: string } =
      {refTableTitle: tableName, primaryValue: primaryValue};
    spyOn(service, "getFieldsProperties").and.returnValue(getFieldsPropertiesResponse);
    spyOn(service as any, "getTableAndDataset").and.returnValue(getTableAndDatasetResponse);
    spyOn(localStorage, 'getItem').and.returnValue('1234'); // set localStorage getItem to return some value
    spyOn(service, 'prepareFormValues').and.returnValue(
      {
        postFormValues: country,
        primaryKey: primaryKey,
        primaryValue: primaryValue,
        release: false
      }
    );
    spyOn(tableDataService, 'getTableDataById').and.returnValue(Promise.resolve(getTableDataByIdResponse));
    spyOn(tableDataService, 'setTableData').and.returnValue(Promise.resolve(setTableDataResponse));
    spyOn(tableDataService,'getLastIdOfTable').and.returnValue(Promise.resolve({id: '1'}));

    // Act
    service.saveForm(saveFormParams).then((result) => {

      // Assert
      expect(result).toEqual(tableServiceResponse);
      expect(service.getFieldsProperties).toHaveBeenCalled();
      expect(service.prepareFormValues).toHaveBeenCalled();
      expect(tableDataService.getTableDataById).toHaveBeenCalled();
      expect(tableDataService.getLastIdOfTable).not.toHaveBeenCalled();
    });
  }));

  it('saveForm calls callback with {result: "OK"} for customer, if all parameters are set and insert mode', fakeAsync(() => {

    // Arrange
    const refTable = constants.REFTABLE_CUSTOMER;
    const tableName = constants.REFTABLE_CUSTOMER_TITLE;
    const newItemMode: boolean = true;
    const needsValidation: boolean = false;
    const primaryKey: string = constants.REFTABLE_CUSTOMER_COLUMN;
    const primaryValue: string = CustomersTestConstants.CUSTOMER_B2C_NEW_ITEM.CUSTOMERS_NUMBER;
    const secondaryKey: string = '';
    const secondaryValue: string = '';
    const tertiaryKey: string = '';
    const tertiaryValue: string = '';
    const isIdentity: boolean = false;
    const getTableDataByIdResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {table: [[], []], maxRows: 0, page: 0};
    const setTableDataResponse = {result: {}};
    const tableServiceResponse = {result: true, message: 'SAVEDSUCCESS', refTable: refTable};
    let fields: FormlyFieldConfig[] = JSON.parse(CustomersTestConstants.CUSTOMER_B2C_NEW_ITEM_FORM_FIELDS);
    const saveFormParams = {formValues: CustomersTestConstants.CUSTOMER_B2C_NEW_ITEM, fields: fields};
    const getFieldsPropertiesResponse: {
      refTable: string, tableName: string, newItemMode: boolean, needsValidation: boolean,
      primaryKey: string, primaryValue: string, secondaryKey: string, secondaryValue: string, tertiaryKey: string,
      tertiaryValue: string, isIdentity: boolean
    } = {
      refTable, tableName, newItemMode, needsValidation, primaryKey, primaryValue,
      secondaryKey, secondaryValue, tertiaryKey, tertiaryValue, isIdentity
    };
    const getTableAndDatasetResponse: { refTableTitle: string, primaryValue: string } =
      {refTableTitle: tableName, primaryValue: primaryValue};
    spyOn(service, "getFieldsProperties").and.returnValue(getFieldsPropertiesResponse);
    spyOn(service as any, "getTableAndDataset").and.returnValue(getTableAndDatasetResponse);
    spyOn(localStorage, 'getItem').and.returnValue('1234'); // set localStorage getItem to return some value
    spyOn(service, 'prepareFormValues').and.returnValue(
      {
        postFormValues: CustomersTestConstants.CUSTOMER_B2C_NEW_ITEM,
        primaryKey: primaryKey,
        primaryValue: primaryValue,
        release: false
      }
    );
    spyOn(tableDataService, 'getTableDataById').and.returnValue(Promise.resolve(getTableDataByIdResponse));
    // spyOn(service,'saveDataToTable').and.returnValue(Promise.resolve({ result: true, message: 'SAVEDSUCCESS' }));
    spyOn(tableDataService, 'setTableData').and.returnValue(Promise.resolve(setTableDataResponse));
    spyOn(tableDataService,'getLastIdOfTable').and.returnValue(Promise.resolve({id: '1'}));

    // Act
    service.saveForm(saveFormParams).then((result) => {

      // Assert
      expect(result).toEqual(tableServiceResponse);
      expect(service.getFieldsProperties).toHaveBeenCalled();
      expect(service.prepareFormValues).toHaveBeenCalled();
      // expect(service.saveDataToTable).toHaveBeenCalled();
      expect(tableDataService.getTableDataById).toHaveBeenCalled();
      expect(tableDataService.getLastIdOfTable).toHaveBeenCalled();
    });
  }));

  it('setTranslatePipe returns false if translatePipe is not set', () => {

    // Arrange

    // Act
    service.setTranslatePipe(undefined);

    // Assert
    expect(service['translatePipe']).toEqual(undefined);
  })

  it('setTranslatePipe returns true (show error message) if translatePipe is set', () => {

    // Arrange

    // Act
    service.setTranslatePipe(translate);

    // Assert
    expect(service['translatePipe']).toEqual(translate);
  })

  // Unhandled promise rejection: TypeError: Cannot convert undefined or null to object
  // TypeError: Cannot convert undefined or null to object
  // at <Jasmine>
  // at FormService.<anonymous> (http://localhost:9876/_karma_webpack_/webpack:/src/app/_services/form.service.ts:982:49)

  // it('saveFormQuery calls callback with {result: "ERROR"} if http error is occurred', fakeAsync(() => {
  //
  //   // Arrange
  //   // const tableServiceResponse = {result: 'ERROR'};
  //   const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
  //   spyOn(tableDataService, 'setTableData').and.returnValue(Promise.resolve(errorResponse));
  //   spyOn(tableDataService, 'handleHttpError').and.callThrough();
  //
  //   // Act
  //   expectAsync(service.saveFormQuery({PAYMENT_CONFIRMED: '1'}, 'paymentTerms',
  //     'PRIMARY_VALUE', false, 'PAYMENT_TERM_ID', 'BAR',
  //     'table', false)).toBeResolvedTo(errorResponse);
  //
  //   // Assert
  //   expect(tableDataService.setTableData).toHaveBeenCalled();
  //   // expect(tableDataService.handleHttpError).toHaveBeenCalled();
  // }));

  // xit('should set currencies, countries etc. in the constructor', fakeAsync(() => {
  //
  //   // Arrange
  //   let helperService = TestBed.inject(HelperService);//new HelperService();
  //   let constants = TestBed.inject(ConstantsService);//new ConstantsService();
  //   spyOn(service, 'getCurrencies').and.callThrough();
  //   spyOn(service, 'getCountries').and.callThrough();
  //   spyOn(service, 'getStates').and.callThrough();
  //   spyOn(service, 'getPaymentTerms').and.callThrough();
  //   spyOn(service, 'getLanguages').and.callThrough();
  //   spyOn(service, 'getSoasCategories').and.callThrough();
  //   spyOn(service, 'getTaxationRelations').and.callThrough();
  //   spyOn(service, 'getCustomerTypes').and.callThrough();
  //   spyOn(service, 'getWarehouses').and.callThrough();
  //
  //   // Act
  //   new FormService(tableDataService, helperService, constants);
  //   tick(500);
  //
  //   //Assert
  //   expect(service.getCurrencies).toHaveBeenCalled();
  //   // expect(service.currencies).toBeDefined();
  //   // expect(service.pcurrencies).toBeDefined();
  //   expect(service.getCountries).toHaveBeenCalled();
  //   // expect(service.countries).toBeDefined();
  //   // expect(service.pcountries).toBeDefined();
  //   // expect(service.countriesON).toBeDefined();
  //   // expect(service.countriesWithId).toBeDefined();
  //   // expect(service.pcountriesON).toBeDefined();
  //   expect(service.getStates).toHaveBeenCalled();
  //   // expect(service.statesOptions).toBeDefined();
  //   expect(service.getPaymentTerms).toHaveBeenCalled();
  //   // expect(service.paymentTermsOptions).toBeDefined();
  //   expect(service.getLanguages).toHaveBeenCalled();
  //   // expect(service.languages).toBeDefined();
  //   // expect(service.planguages).toBeDefined();
  //   expect(service.getSoasCategories).toHaveBeenCalled();
  //   // expect(service.soasCategories).toBeDefined();
  //   expect(service.getTaxationRelations).toHaveBeenCalled();
  //   // expect(service.pTaxRelations).toBeDefined();
  //   expect(service.getCustomerTypes).toHaveBeenCalled();
  //   // expect(service.customertypes).toBeDefined();
  //   expect(service.getWarehouses).toHaveBeenCalled();
  //   // expect(service.pwarehouses).toBeDefined();
  // }));

});
