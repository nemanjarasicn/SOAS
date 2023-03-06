import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import { OptionsService } from './options.service';
import {TranslateItPipe} from '../shared/pipes/translate-it.pipe';
import {TestingModule} from '../testing/testing.module';
import {MessageService} from 'primeng/api';
import {TableDataService} from './table-data.service';
import {ErrorsTestConstants} from '../../assets/test-constants/errors';
import {CountriesTestConstants} from '../../assets/test-constants/countries';
import {LanguagesTestConstants} from '../../assets/test-constants/languages';
import {TaxationRelationsTestConstants} from '../../assets/test-constants/taxation-relations';
import {CurrenciesTestConstants} from '../../assets/test-constants/currencies';
import {StatesTestConstants} from '../../assets/test-constants/states';
import {PaymentTermsTestConstants} from '../../assets/test-constants/payment-terms';
import {CompaniesLocationsTypes, OptionsTypes} from './constants.service';
import {
  FormOptionsINV,
  FormOptionsLVn,
  FormOptionsLVs,
  FormOptionsNVs
} from '../interfaces/form-options';
import {OrdersTestConstants} from '../../assets/test-constants/orders';
import {TaxCodesTestConstants} from "../../assets/test-constants/tax-codes";

describe('OptionsService', () => {
  let service: OptionsService;
  let translate: TranslateItPipe;
  let tableDataService: TableDataService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [TranslateItPipe],
      providers: [MessageService, TableDataService, TranslateItPipe]
    });

    service = TestBed.inject(OptionsService);
    tableDataService = TestBed.inject(TableDataService);
    translate = TestBed.inject(TranslateItPipe);
    service.setTranslatePipe(translate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initializeOptions loads provided currencies options for the form', async function() {

    // Arrange
    const formOptions: OptionsTypes[] = [OptionsTypes.currencies];
    const currencies: FormOptionsNVs[] = CurrenciesTestConstants.CURRENCIES_SELECT.currencies;
    const currenciesWithId: FormOptionsINV[] = CurrenciesTestConstants.CURRENCIES_SELECT.currenciesWithId;
    const pcurrencies: FormOptionsLVs[] = CurrenciesTestConstants.CURRENCIES_SELECT.pcurrencies;
    const getCurrenciesResponse: { currencies, pcurrencies, currenciesWithId } = {
      currencies,
      pcurrencies,
      currenciesWithId
    };
    spyOn(service, 'initializeOptions').and.callThrough();
    spyOn(service, 'getCurrencies').and.returnValue(Promise.resolve(getCurrenciesResponse));

    // Act
    await service.initializeOptions(formOptions);

    // Assert
    expect(service.initializeOptions).toHaveBeenCalled();
    expect(service.getCurrencies).toHaveBeenCalled();
    expect(service.currencies).toBeDefined();
    expect(service.pcurrencies).toBeDefined();
    expect(service.currenciesWithId).toBeDefined();
  });

  it('initializeOptions loads provided countries options for the form', async function() {

    // Arrange
    const formOptions: OptionsTypes[] = [OptionsTypes.countries];
    const countries: FormOptionsNVs[] = CountriesTestConstants.COUNTRIES_SELECT.countries;
    const pcountries: FormOptionsLVs[] = CountriesTestConstants.COUNTRIES_SELECT.pcountries;
    const countriesOnlyName: FormOptionsNVs[] = CountriesTestConstants.COUNTRIES_SELECT.countriesOnlyName;
    const pcountriesOnlyName: FormOptionsLVs[] = CountriesTestConstants.COUNTRIES_SELECT.pcountriesOnlyName
    const countriesWithId: FormOptionsINV[] = CountriesTestConstants.COUNTRIES_SELECT.countriesWithId;
    const getCountriesResponse: { countries, pcountries, countriesOnlyName, countriesWithId, pcountriesOnlyName } =
      {countries, pcountries, countriesOnlyName, countriesWithId, pcountriesOnlyName};
    spyOn(service, 'initializeOptions').and.callThrough();
    spyOn(service, 'getCountries').and.returnValue(Promise.resolve(getCountriesResponse));

    // Act
    await service.initializeOptions(formOptions);

    // Assert
    expect(service.initializeOptions).toHaveBeenCalled();
    expect(service.getCountries).toHaveBeenCalled();
    expect(service.countries).toBeDefined();
    expect(service.pcountries).toBeDefined();
    expect(service.countriesON).toBeDefined();
    expect(service.countriesWithId).toBeDefined();
    expect(service.pcountriesON).toBeDefined();

  });

  it('initializeOptions loads provided states options for the form', async function() {

    // Arrange
    const formOptions: OptionsTypes[] = [OptionsTypes.states];
    const tmpStates: FormOptionsLVn[] = StatesTestConstants.STATES_SELECT;
    const getStatesResponse: { tmpStates } = { tmpStates };
    // const ordPosStates: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_ORDER_POSITIONS;
    // const dlvPosStates: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_LI_POSITIONS;
    // const invPosStates: FormOptionsNVS[] = StatesTestConstants.STATES_SELECT_RG_POSITIONS;
    // const getOrdDlvInvStatesResponse: { dbData } = // ordPosStates, dlvPosStates, invPosStates
    //   { ordPosStates, dlvPosStates, invPosStates };
    spyOn(service, 'initializeOptions').and.callThrough();
    spyOn(service, 'getStates').and.returnValue(Promise.resolve(getStatesResponse));
    spyOn(service, 'getFormOptionsData').and.returnValue(Promise.resolve(true));
    // spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(getOrdDlvInvStatesResponse));
    // const tableServiceResponse = {
    //   table: [[], StatesTestConstants.STATES_SELECT]
    // };
    // spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    await service.initializeOptions(formOptions);

    // Assert
    expect(service.initializeOptions).toHaveBeenCalled();
    expect(service.getStates).toHaveBeenCalled();
    expect(service.getFormOptionsData).toHaveBeenCalled();
    // expect(tableDataService.getTableData).toHaveBeenCalled();
    expect(service.statesOptions).toBeDefined();
    // expect(service.ordPosStates).toBeDefined();
    // expect(service.dlvPosStates).toBeDefined();
    // expect(service.invPosStates).toBeDefined();

  });

  it('initializeOptions fail to load provided states options for the form', async function() {

    // Arrange
    console.log = jasmine.createSpy("log");
    const formOptions: OptionsTypes[] = [OptionsTypes.states];
    const tmpStates: FormOptionsLVn[] = StatesTestConstants.STATES_SELECT;
    const resultSta: { tmpStates } = {tmpStates};
    const ptResult = undefined;
    spyOn(service, 'initializeOptions').and.callThrough();
    spyOn(service, 'getStates').and.returnValue(Promise.resolve(tmpStates));
    spyOn(service, 'getFormOptionsData').and.returnValue(ptResult);

    // Act
    await service.initializeOptions(formOptions, 'countries');

    // Assert
    expect(service.initializeOptions).toHaveBeenCalled();
    expect(service.getStates).toHaveBeenCalled();
    expect(service.getFormOptionsData).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(new Error('States data is not available...'));

  });

  it('initializeOptions loads provided payment terms options for the form', fakeAsync(  async (done) => {

    // Arrange
    const formOptions: OptionsTypes[] = [OptionsTypes.paymentTerms];
    const tmpPT: FormOptionsLVs[] = PaymentTermsTestConstants.PAYMENT_TERMS_SELECT;
    const getPaymentTermsResponse: Promise<{ tmpPT }> = Promise.resolve({tmpPT});
    spyOn(service, 'getPaymentTerms').and.returnValue(getPaymentTermsResponse);

    // Act
    service.initializeOptions(formOptions).then(() => {
      expect(service.paymentTermsOptions).toBeDefined();
    });

    // Assert
    expect(service.getPaymentTerms).toHaveBeenCalled();

  }));

  it('initializeOptions fail to load provided payment terms options for the form', async function() {

    // Arrange
    console.log = jasmine.createSpy("log");
    const formOptions: OptionsTypes[] = [OptionsTypes.paymentTerms];
    const tmpPT: FormOptionsLVs[] = PaymentTermsTestConstants.PAYMENT_TERMS_SELECT;
    const resultPT: { tmpPT } = {tmpPT};
    const ptResult = undefined;
    spyOn(service, 'initializeOptions').and.callThrough();
    spyOn(service, 'getPaymentTerms').and.returnValue(Promise.resolve(resultPT));
    spyOn(service, 'getFormOptionsData').and.returnValue(ptResult);

    // Act
    await service.initializeOptions(formOptions, 'countries');

    // Assert
    expect(service.initializeOptions).toHaveBeenCalled();
    expect(service.getPaymentTerms).toHaveBeenCalled();
    expect(service.getFormOptionsData).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(new Error('Payment terms data is not available...'));

  });

  it('initializeOptions loads provided languages options for the form', async function() {

    // Arrange
    const formOptions: OptionsTypes[] = [OptionsTypes.languages];
    const languages: FormOptionsNVs[] = LanguagesTestConstants.LANGUAGES_SELECT.languages;
    const planguages: FormOptionsLVs[] = LanguagesTestConstants.LANGUAGES_SELECT.planguages;
    const getLanguagesResponse: { languages, planguages } = { languages, planguages };
    spyOn(service, 'initializeOptions').and.callThrough();
    spyOn(service, 'getLanguages').and.returnValue(Promise.resolve(getLanguagesResponse));

    // Act
    await service.initializeOptions(formOptions);

    // Assert
    expect(service.initializeOptions).toHaveBeenCalled();
    expect(service.getLanguages).toHaveBeenCalled();
    expect(service.languages).toBeDefined();
    expect(service.planguages).toBeDefined();

  });

  it('initializeOptions loads provided soas categories options for the form', async function() {

    // Arrange
    const formOptions: OptionsTypes[] = [OptionsTypes.soasCategories];
    const tmpCat: FormOptionsLVs[] = [{label: 'PLEASE_SELECT', value: undefined}, {label: 'HAUPT', value: 'HAUPT'}];
    const getCategoriesResponse: { tmpCat } = { tmpCat };
    spyOn(service, 'initializeOptions').and.callThrough();
    spyOn(service, 'getSoasCategories').and.returnValue(getCategoriesResponse);

    // Act
    await service.initializeOptions(formOptions);

    // Assert
    expect(service.initializeOptions).toHaveBeenCalled();
    expect(service.getSoasCategories).toHaveBeenCalled();
    expect(service.soasCategories).toBeDefined();

  });

  it('initializeOptions loads provided taxation relations options for the form', async function() {

    // Arrange
    const formOptions: OptionsTypes[] = [OptionsTypes.taxCodes];
    const taxCodes: FormOptionsNVs[] = TaxCodesTestConstants.TAX_CODES_SELECT.taxCodes;
    const pTaxCodes: FormOptionsLVs[] = TaxCodesTestConstants.TAX_CODES_SELECT.pTaxCodes;
    const taxCodesResponse: {taxCodes, pTaxCodes} = {taxCodes, pTaxCodes};
    spyOn(service, 'initializeOptions').and.callThrough();
    spyOn(service, 'getTaxCodes').and.returnValue(Promise.resolve(taxCodesResponse));

    // Act
    await service.initializeOptions(formOptions);

    // Assert
    expect(service.initializeOptions).toHaveBeenCalled();
    expect(service.getTaxCodes).toHaveBeenCalled();
    expect(service.taxCodes).toBeDefined();

  });

  it('initializeOptions loads provided customer types options for the form', async function() {

    // Arrange
    const formOptions: OptionsTypes[] = [OptionsTypes.customerTypes];
    const customerTypes: FormOptionsLVs[] | [] = [{label: 'B2B', value: 'B2B'}];
    // const customerTypesResponse: FormOptionsLVs[] | [] = { customertypes };
    spyOn(service, 'initializeOptions').and.callThrough();
    spyOn(service, 'getCustomerTypes').and.returnValue(customerTypes);

    // Act
    await service.initializeOptions(formOptions);

    // Assert
    expect(service.initializeOptions).toHaveBeenCalled();
    expect(service.getCustomerTypes).toHaveBeenCalled();
    // expect(service.customertypes).toBeDefined();

  });

  // it('initializeOptions loads provided warehouses options for the form', async function() {
  //
  //   // Arrange
  //   const formOptions: OptionsTypes[] = [OptionsTypes.warehouses];
  //   const data: FormOptionsLVs[] | [] = [{label: 'B2B', value: 'B2B'}];
  //   // const customerTypesResponse: FormOptionsLVs[] | [] = { customertypes };
  //   spyOn(service, 'initializeOptions').and.callThrough();
  //   spyOn(service, 'getWarehousesData').and.returnValue(Promise.resolve({data}));
  //
  //   // Act
  //   await service.initializeOptions(formOptions);
  //
  //   // Assert
  //   expect(service.initializeOptions).toHaveBeenCalled();
  //   expect(service.getWarehousesData).toHaveBeenCalled();
  //   expect(service.pwarehouses).toBeDefined();
  //
  // });

  it('getFormOptionsData calls callback with false if table is not found', async function() {

    // Arrange
    const tableServiceResponse = undefined;
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    await service.getFormOptionsData('tableName', 'tableRefTypes');

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();

  });

  it('getFormOptionsData calls callback with true when table is found', async function() {

    // Arrange
    const getTableDataByIdResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {table: [[], []], maxRows: 0, page: 0};
    spyOn(tableDataService, 'getTableData').and.returnValue( Promise.resolve(getTableDataByIdResponse) );

    // Act
    await service.getFormOptionsData('tableName', 'tableRefTypes');

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();

  });

  it('getFormOptionsData sets paymentTerms if tableName is paymentTerms and table data is retrieved', fakeAsync(async () => {

    // Arrange
    const getTableDataByIdResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], [
          {PAYMENT_TERM_ID: '1', PAYMENT_TERM_NAME: 'Val 1'},
          {PAYMENT_TERM_ID: '2', PAYMENT_TERM_NAME: 'Val 2'},
          {PAYMENT_TERM_ID: '3', PAYMENT_TERM_NAME: 'Val 3'}]
        ], maxRows: 1, page: 0
      };
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(getTableDataByIdResponse));

    const tableRowToCheck = getTableDataByIdResponse.table[1][1];
    const numberOfElements: number = getTableDataByIdResponse.table[1].length;
    const combinedNameInPaymentTerms = `(${tableRowToCheck.PAYMENT_TERM_ID}) ${tableRowToCheck.PAYMENT_TERM_NAME}`;

    // Act
    await service.getFormOptionsData('paymentTerms', 'tableRefTypes');

    // wait a time to make sure data is loaded
    tick();

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
    expect(service.paymentTerms).toBeDefined();

    expect(service.paymentTerms.length as number).toBe(numberOfElements + 1); // Function sets first element automatically
    expect(service.paymentTerms[2]['name']).toEqual(combinedNameInPaymentTerms);
    expect(service.paymentTerms[2]['value']).toEqual(tableRowToCheck.PAYMENT_TERM_ID);

  }));

  it('getFormOptionsData sets states if tableName is states and table data is retrieved', fakeAsync(async () => {

    // Arrange
    const callbackObject = {func: () => {}};
    const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], StatesTestConstants.STATES], maxRows: 1, page: 0
      };
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    const tableRowToCheckAu = tableServiceResponse.table[1][8]; // on 8th place in states response
    const tableRowToCheckPos = tableServiceResponse.table[1][2]; // on 2th place in states response

    // 19 elements
    const numberOfElementsAu: number = 4; //tableServiceResponse.table[1].length;
    const numberOfElementsPos: number = 4;

    // Act
    await service.getFormOptionsData('states', 'orders');

    // wait a time to make sure data is loaded
    tick();

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
    expect(service.ordDlvInvStates).toBeDefined();
    expect(service.ordPosStates).toBeDefined();
    expect(service.dlvPosStates).toBeDefined();
    expect(service.invPosStates).toBeDefined();

    // test orders-delivery notes-invoices states: ordDlvInvStates
    // +1: Function sets first element automatically
    expect(service.ordDlvInvStates.length as number).toBe(numberOfElementsAu + 1);
    expect(service.ordDlvInvStates[2]['name']).toEqual(tableRowToCheckAu.STATES_COMMENT);
    expect(service.ordDlvInvStates[2]['value']).toEqual(tableRowToCheckAu.STATES_ID);

    // test orders positions states: ordPosStates
    expect(service.ordPosStates.length as number).toBe(numberOfElementsPos);
    expect(service.ordPosStates[1]['name']).toEqual(tableRowToCheckPos.STATES_COMMENT);
    expect(service.ordPosStates[1]['value']).toEqual(tableRowToCheckPos.STATES_ID);
    expect(service.ordPosStates[1]['state']).toEqual(tableRowToCheckPos.STATES_NAME);

  }));

  // Check
  it('getFormOptionsData calls callback with false if http error is occurred', fakeAsync(() => {

    // Arrange
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.reject(errorResponse)); // throwError(errorResponse)
    spyOn(tableDataService, 'handleHttpError').and.callThrough();

    // Act
    expectAsync(service.getFormOptionsData('tableName', 'tableRefTypes'))
      .toBeRejectedWith(errorResponse);

    // wait a time to make sure data is loaded
    tick();

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
    // expect(tableDataService.handleHttpError).toHaveBeenCalled();
  }));

  it('getCustomerTypes returns customer types undefined if translatePipe is not set', () => {

    // Arrange
    let translate: TranslateItPipe = undefined;

    // Act
    service.setTranslatePipe(translate);
    let result: {} = service.getCustomerTypes();

    // Assert
    expect(result).toEqual([]);
  })

  it('getCustomerTypes returns customer types {...}', () => {

    // Arrange

    // Act
    service.setTranslatePipe(translate);
    let result: {} = service.getCustomerTypes();

    // Assert
    expect(Object.keys(result).length as number).toBe(3);
  })

  it('getPaymentTermByLanguage returns newPaymentCondition \'\' for given language \'\'', () => {

    // Arrange

    // Act
    let result: string = service.getPaymentTermByLanguage('', '');

    // Assert
    expect(result).toBe('');
  })

  it('getPaymentTermByLanguage returns newPaymentCondition \'DEVORAUS\' for given language \'DEU\'', () => {

    // Arrange
    let paypalLanguages: string[] = ['DEU','AUT'];

    // Act
    for (let i = 0; i < paypalLanguages.length; i++) {
      let result: string = service.getPaymentTermByLanguage(paypalLanguages[i], '');
      // Assert
      expect(result).toBe('DEVORAUS');
    }
  })

  it('getPaymentTermByLanguage returns newPaymentCondition \'UKVORAUS\' for given language \'ENG\'', () => {

    // Arrange
    let paypalLanguages: string[] = ['ENG','GBR'];

    // Act
    for (let i = 0; i < paypalLanguages.length; i++) {
      let result: string = service.getPaymentTermByLanguage(paypalLanguages[i], '');
      // Assert
      expect(result).toBe('UKVORAUS');
    }
  })

  it('getPaymentTermByLanguage returns newPaymentCondition \'FRVORAUS\' for given language \'FRA\'', () => {

    // Arrange

    // Act
    let result: string = service.getPaymentTermByLanguage('FRA', '');

    // Assert
    expect(result).toBe('FRVORAUS');
  })

  it('getPaymentTermByLanguage returns newPaymentCondition \'ESVORAUS\' for given language \'SPA\'', () => {

    // Arrange

    // Act
    let result: string = service.getPaymentTermByLanguage('SPA', '');

    // Assert
    expect(result).toBe('ESVORAUS');
  })

  it('getPaymentTermByLanguage returns newPaymentCondition \'PAYPAL\' for given language \'CHI\'', () => {

    // Arrange
    let paypalLanguages: string[] = ['CHI','CZE','DEN','MAZ','NED','BEL'];

    // Act
    for (let i = 0; i < paypalLanguages.length; i++) {
      let result: string = service.getPaymentTermByLanguage(paypalLanguages[i], '');
      // Assert
      expect(result).toBe('PAYPAL');
    }
  })

  it('getPaymentTermByLanguage returns newPaymentCondition \'ITVORAUS\' for given language \'ITA\'', () => {

    // Arrange

    // Act
    let result: string = service.getPaymentTermByLanguage('ITA', '');

    // Assert
    expect(result).toBe('ITVORAUS');
  })

  it('getTaxationByCountry returns newTaxation \'DEK\' for given country \'Spanien\'', async () => {

    // Arrange
    const countries: string[] = ['', 'Deutschland', 'Spanien', 'Tschechische Republik', 'Dänemark', 'Niederlande',
      'Österreich', 'Belgien', 'Italien'];

    // Act
    for (let i = 0; i < countries.length; i++) {
      let result: string = await service.getTaxCodeByCountryIsoCode(countries[i]);
      // Assert
      expect(result).toBe('DEK');
    }
  })

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

  it('getCountries calls callback with {error: "..."} if table is not found', fakeAsync(() => {

    // Arrange
    const tableServiceResponse = undefined;
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getCountries()).toBeResolvedTo({error: 'countries coDbData is undefined!'});

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  it('getCountries calls callback with {error: "..."} if table was found but empty', fakeAsync(async () => {

    // Arrange
    const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], CountriesTestConstants.COUNTRIES], maxRows: 1, page: 0
      };
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getCountries()).toBeResolvedTo({error: 'countries coDbData is undefined!'});

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();

  }));

  it('getCountries calls callback with {error: "..."} if http error is occurred', fakeAsync(() => {

    // Arrange
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    const tableServiceResponse = {error: errorResponse};
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.reject(tableServiceResponse)); // throwError
    spyOn(tableDataService, 'handleHttpError').and.callThrough();

    // Act
    expectAsync(service.getCountries()).toBeRejectedWith(tableServiceResponse);

    tick();

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
    // expect(tableDataService.handleHttpError).toHaveBeenCalled();
  }));

  it('getCountries calls callback with {countries: countries, ...} if table is found', fakeAsync(() => {

    // Arrange
    const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], []], maxRows: 0, page: 0
      };
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getCountries()).toBeResolvedTo({
      countries: [{name: 'PLEASE_SELECT', value: undefined}],
      pcountries: [{label: 'PLEASE_SELECT', value: undefined}], countriesWithId: [],
      countriesOnlyName: [], pcountriesOnlyName: [{label: 'PLEASE_SELECT', value: undefined}]
    });

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  it('getCountries sets countries if table data is retrieved', fakeAsync(async () => {

    // Arrange
    const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], CountriesTestConstants.COUNTRIES], maxRows: 1, page: 0
      };
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    let result = service.getCountries();

    tick();

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
    expect(JSON.stringify(await result)).toEqual(JSON.stringify(CountriesTestConstants.COUNTRIES_SELECT));
  }));

  it('getLanguages calls callback with {error: "..."} if table is not found', fakeAsync(() => {

    // Arrange
    const tableServiceResponse = undefined;
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getLanguages()).toBeResolvedTo({error: 'languages laDbData is undefined!'});

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  it('getLanguages calls callback with {error: "..."} if http error is occurred', fakeAsync(() => {

    // Arrange
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    const tableServiceResponse = {error: errorResponse};
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.reject(tableServiceResponse));
    spyOn(tableDataService, 'handleHttpError').and.callThrough();

    // Act
    expectAsync(service.getLanguages()).toBeRejectedWith(tableServiceResponse);

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
    // expect(tableDataService.handleHttpError).toHaveBeenCalled();
  }));

  it('getLanguages calls callback with {languages: languages, ...} if table is found', fakeAsync(() => {

    // Arrange
    const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], []], maxRows: 1, page: 0
      };
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getLanguages()).toBeResolvedTo({
      languages: [{name: 'PLEASE_SELECT', value: undefined}],
      planguages: [{label: 'PLEASE_SELECT', value: undefined}],
    });

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  it('getLanguages sets languages if table data is retrieved', fakeAsync(() => {

    // Arrange
    const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], LanguagesTestConstants.LANGUAGES], maxRows: 1, page: 0
      };
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getLanguages()).toBeResolvedTo(LanguagesTestConstants.LANGUAGES_SELECT);

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  // it('getTaxationRelations calls callback with {error: "..."} if table is not found', fakeAsync(() => {
  //
  //   // Arrange
  //   const tableServiceResponse = {error: 'taxation relations traDbData is undefined!'};
  //   spyOn(tableDataService, 'getTableData').and.returnValue(Promise.reject(tableServiceResponse));
  //
  //   // Act
  //   expectAsync(service.getTaxationRelations())
  //     .toBeRejectedWith(tableServiceResponse);
  //
  //   // Assert
  //   expect(tableDataService.getTableData).toHaveBeenCalled();
  // }));
  //
  // it('getTaxationRelations calls callback with {error: "..."} if http error is occurred', fakeAsync(() => {
  //
  //   // Arrange
  //   const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
  //   const tableServiceResponse = {error: errorResponse};
  //   spyOn(tableDataService, 'getTableData').and.returnValue(Promise.reject(tableServiceResponse)); // throwError()
  //   spyOn(tableDataService, 'handleHttpError').and.callThrough();
  //
  //   // Act
  //   expectAsync(service.getTaxationRelations()).toBeRejectedWith(tableServiceResponse);
  //
  //   // Assert
  //   expect(tableDataService.getTableData).toHaveBeenCalled();
  //   // expect(tableDataService.handleHttpError).toHaveBeenCalled();
  // }));
  //
  // it('getTaxationRelations calls callback with {taxRelations: [], ...} if table is found', fakeAsync(() => {
  //
  //   // Arrange
  //   const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
  //     {
  //       table: [[], []], maxRows: 0, page: 0
  //     };
  //   spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));
  //
  //   // Act
  //   expectAsync(service.getTaxationRelations()).toBeResolvedTo({
  //     taxRelations: [{name: 'PLEASE_SELECT', value: undefined}],
  //     pTaxRelations: [{label: 'PLEASE_SELECT', value: undefined}],
  //   });
  //
  //   // Assert
  //   expect(tableDataService.getTableData).toHaveBeenCalled();
  // }));
  //
  // it('getTaxationRelations callback with {taxRelations: [], ...} if table data is retrieved', fakeAsync(() => {
  //
  //   // Arrange
  //   const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
  //     {
  //       table: [[], TaxationRelationsTestConstants.TAXATION_RELATIONS], maxRows: 1, page: 0
  //     };
  //   spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));
  //
  //   // Act
  //   expectAsync(service.getTaxationRelations()).toBeResolvedTo(TaxationRelationsTestConstants.TAXATION_RELATIONS_SELECT);
  //
  //   // Assert
  //   expect(tableDataService.getTableData).toHaveBeenCalled();
  // }));

  it('getCurrencies calls callback with {error: "..."} if table is not found', fakeAsync(() => {

    // Arrange
    const tableServiceResponse = undefined;
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getCurrencies()).toBeResolvedTo({error: 'currencies dbData is undefined!'});

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  it('getCurrencies calls callback with {error: "..."} if http error is occurred', fakeAsync(() => {

    // Arrange
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    const tableServiceResponse = {error: errorResponse};
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.reject(tableServiceResponse));
    spyOn(tableDataService, 'handleHttpError').and.callThrough();

    // Act
    expectAsync(service.getCurrencies()).toBeRejectedWith(tableServiceResponse);

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
    // expect(tableDataService.handleHttpError).toHaveBeenCalled();
  }));

  it('getCurrencies calls callback with {currencies: [], ...} if table is found', fakeAsync(() => {

    // Arrange
    const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], []], maxRows: 0, page: 0
      };
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getCurrencies()).toBeResolvedTo({
      currencies: [{name: 'PLEASE_SELECT', value: undefined}],
      currenciesWithId: [],
      pcurrencies:  [{label: 'PLEASE_SELECT', value: undefined}],
    });

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  it('getCurrencies callback with {taxRelations: [], ...} if table data is retrieved', fakeAsync(() => {

    // Arrange
    const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], CurrenciesTestConstants.CURRENCIES], maxRows: 1, page: 0
      };
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getCurrencies()).toBeResolvedTo(CurrenciesTestConstants.CURRENCIES_SELECT);

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  it('getStates calls callback with {error: "..."} if table is not found', fakeAsync(() => {

    // Arrange
    const tableServiceResponse = undefined;
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getStates()).toBeResolvedTo({error: 'states dbData is undefined!'});

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  it('getStates calls callback with {error: "..."} if http error is occurred', fakeAsync(() => {

    // Arrange
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    const tableServiceResponse = {error: errorResponse};
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.reject(tableServiceResponse));
    spyOn(tableDataService, 'handleHttpError').and.callThrough();

    // Act
    expectAsync(service.getStates()).toBeRejectedWith(tableServiceResponse);

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
    // expect(tableDataService.handleHttpError).toHaveBeenCalled();
  }));

  it('getStates calls callback with {tmpStates: [], ...} if table is found', fakeAsync(() => {

    // Arrange
    const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], []], maxRows: 0, page: 0
      };
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getStates()).toBeResolvedTo({
      tmpStates: [{label: 'PLEASE_SELECT', value: undefined}],
    });

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  it('getStates callback with {tmpStates: [], ...} if table data is retrieved', fakeAsync(() => {

    // Arrange
    const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], StatesTestConstants.STATES], maxRows: 1, page: 0
      };
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getStates()).toBeResolvedTo({
      tmpStates: StatesTestConstants.STATES_SELECT,
    });

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  it('getPaymentTerms calls callback with {error: "..."} if table is not found', fakeAsync(() => {

    // Arrange
    const tableServiceResponse = {error: 'payment terms dbData is undefined!'};
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.reject(tableServiceResponse));

    // Act
    expectAsync(service.getPaymentTerms()).toBeRejectedWith(tableServiceResponse);

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  it('getPaymentTerms calls callback with {error: "..."} if http error is occurred', fakeAsync(() => {

    // Arrange
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    const tableServiceResponse = {error: errorResponse};
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.reject(tableServiceResponse));
    spyOn(tableDataService, 'handleHttpError').and.callThrough();

    // Act
    expectAsync(service.getPaymentTerms()).toBeRejectedWith(tableServiceResponse);

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
    // expect(tableDataService.handleHttpError).toHaveBeenCalled();
  }));

  it('getPaymentTerms calls callback with {tmpPT: [], ...} if table is found', fakeAsync(() => {

    // Arrange
    const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], []], maxRows: 0, page: 0
      };
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getPaymentTerms()).toBeResolvedTo({
      tmpPT: [{label: 'PLEASE_SELECT', value: undefined}],
    });

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  it('getPaymentTerms callback with {tmpPT: [], ...} if table data is retrieved', fakeAsync(() => {

    // Arrange
    const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], PaymentTermsTestConstants.PAYMENT_TERMS], maxRows: 1, page: 0
      };
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));
    // spyOn(helperService, 'sortOptions').and.callThrough();

    // Act
    // calling of sortOptions function is checked by right elements positions
    expectAsync(service.getPaymentTerms()).toBeResolvedTo({tmpPT: PaymentTermsTestConstants.PAYMENT_TERMS_SELECT});

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
    // expect(helperService.sortOptions).toHaveBeenCalled();
  }));


  it('getSoasCategories calls callback with {tmpCat: []} if translatePipe is not set', () => {

    // Arrange

    // Act
    service.setTranslatePipe(undefined);
    let result = service.getSoasCategories();

    // Assert
    expect(result).toEqual({tmpCat: []});
  });

  // not needed, because it is the same like if categories are found bellow ?
  // xit('getSoasCategories calls callback with {tmpCat: [{label:..., value:...}]} if translatePipe is set', () => {
  //
  //   // Arrange
  //   let service: FormService = TestBed.inject(FormService);
  //   // let translate: TranslateItPipe = TestBed.inject(TranslateItPipe);
  //   const callbackObject = {func: () => {}};
  //   spyOn(callbackObject, 'func');
  //
  //   // Act
  //   // service.setTranslatePipe(translate);
  //   service.getSoasCategories(callbackObject.func);
  //
  //   // Assert
  //   expect(callbackObject.func).toHaveBeenCalledWith({tmpCat: [{label: 'PLEASE_SELECT', value: undefined}]});
  // })

  // categories came from constants, how to check for it? need to check constants?
  // xit('getSoasCategories calls callback with {tmpCat: [...]} if categories are not found', () => {
  //
  //   // Arrange
  //
  //   const callbackObject = {func: () => {}};
  //   spyOn(callbackObject, 'func');
  //
  //   // Act
  //   service.getSoasCategories(callbackObject.func);
  //
  //   // Assert
  //   expect(callbackObject.func).toHaveBeenCalledWith({tmpCat: [{label: 'PLEASE_SELECT', value: undefined}]});
  // })

  it('getSoasCategories calls callback with {tmpCat: [...]} if categories are found', () => {

    // Arrange
    service.setTranslatePipe(translate);
    const expectedResult = {
      tmpCat: [
        {label: 'PLEASE_SELECT', value: undefined},
        {label: 'FERT', value: 'FERT'},
        {label: 'HAUPT', value: 'HAUPT'},
        {label: 'KOMP', value: 'KOMP'},
        {label: 'RAW', value: 'RAW'},
        {label: 'SERV', value: 'SERV'},
        {label: 'SET', value: 'SET'},
      ]
    };

    // Act
    let result = service.getSoasCategories();

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('getWarehouses calls callback with {pwarehouses: []} if translatePipe is not set', () => {

    // Arrange

    // Act
    service.setTranslatePipe(undefined);
    let result = service.getWarehousesData(CompaniesLocationsTypes.warehousingLocations);

    // Assert
    expect(result).toEqual({pwarehouses: [],});
  });

  // it('getWarehouses calls callback with {pwarehouses: [...]} if WAREHOUSE_LOCATIONS are found', () => {
  //
  //   // Arrange
  //   let expectedResult = {
  //     pwarehouses: [{label: 'PLEASE_SELECT', value: undefined},
  //       {label: '101', value: '101'},
  //       {label: '201', value: '201'},
  //       {label: '110', value: '110'},
  //       {label: '111', value: '111'},
  //     ],
  //   };
  //
  //   // Act
  //   let result = service.getWarehouses();
  //
  //   // Assert
  //   expect(result).toEqual(expectedResult);
  // });

  it('getCrosssellings calls callback with {exists: false, type: false} if table is not found', fakeAsync(() => {

    // Arrange
    const tableServiceResponse = {error: 'crosssellings dbData is undefined!'};
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.reject(tableServiceResponse));

    // Act
    expectAsync(service.getCrosssellings()).toBeRejectedWith(tableServiceResponse);

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  it('getCrosssellings calls callback with {error: ...} if http error is occurred', fakeAsync(() => {

    // Arrange
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    const tableServiceResponse = {error: errorResponse};
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.reject(tableServiceResponse));
    spyOn(tableDataService, 'handleHttpError').and.callThrough();

    // Act
    expectAsync(service.getCrosssellings()).toBeRejectedWith(tableServiceResponse);

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
    // expect(tableDataService.handleHttpError).toHaveBeenCalled();
  }));

  it('getCrosssellings calls callback with {tmpCross: [], tmpCrossNames: []} if table is found', fakeAsync(() => {

    // Arrange
    const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], [
          // {CROSSSELLING_ID: '1638', CROSSSELLING_DATA: 'BMCROSS70'}
        ]], maxRows: 1, page: 0
      };
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getCrosssellings()).toBeResolvedTo({
      tmpCross: [{label: 'PLEASE_SELECT', value: undefined}],
      tmpCrossNames: []
    });

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  it('getCrosssellings callback with {tmpCross: [...], tmpCrossNames: [...]}  if table data is retrieved', fakeAsync(() => {

    // Arrange
    const tableServiceResponse: { table: [any[string], any[]], maxRows: number, page: number } =
      {
        table: [[], [{CROSSSELLING_ID: '1638', CROSSSELLING_DATA: 'BMCROSS70'}]], maxRows: 1, page: 0
      };
    spyOn(tableDataService, 'getTableData').and.returnValue(Promise.resolve(tableServiceResponse));

    // Act
    expectAsync(service.getCrosssellings()).toBeResolvedTo({
      tmpCross: [{label: 'PLEASE_SELECT', value: undefined},
        {label: 'BMCROSS70 (1638)', value: 1638},
      ],
      tmpCrossNames: ['(1638) BMCROSS70']
    });

    // Assert
    expect(tableDataService.getTableData).toHaveBeenCalled();
  }));

  it('getOrderAddresses loads order addresses', () => {

    // Arrange

    // Act
    service.getOrderAddresses(OrdersTestConstants.ORDERS_CUSTOMER_ADDRESSES);

    // Assert
    expect(service.addressesDLV).toBeDefined();
    expect(service.addressesINV).toBeDefined();

  });

});
