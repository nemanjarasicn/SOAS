import {Injectable} from "@angular/core";
import {
  FormOptionsINV,
  FormOptionsLVn,
  FormOptionsLVs,
  FormOptionsNVn, FormOptionsNVS,
  FormOptionsNVs
} from "../interfaces/form-options";
import {TranslateItPipe} from "../shared/pipes/translate-it.pipe";
import {TableDataService} from "./table-data.service";
import {HelperService} from "./helper.service";
import {
  CompaniesLocationsTypes,
  ConstantsService,
  CustomerAddressTypes,
  OptionsTypes,
  ViewQueryTypes
} from "./constants.service";
import { Console } from "console";

@Injectable({
  providedIn: 'root',
})
export class OptionsService {

  paymentTerms: FormOptionsNVs[];
  ordDlvInvStates: FormOptionsNVn[];
  ordPosStates: FormOptionsNVS[];
  dlvPosStates: FormOptionsNVS[];
  invPosStates: FormOptionsNVS[];

  // form fields
  customertypes: FormOptionsLVs[] | [];
  warehousingLocations: FormOptionsLVs[];
  salesLocations: FormOptionsLVs[];
  statusPos: FormOptionsLVs[];
  provider: FormOptionsLVs[];
  languages: FormOptionsNVs[];
  planguages: FormOptionsLVs[];
  countries: FormOptionsNVs[];
  pcountries: FormOptionsLVs[];
  countriesON: FormOptionsNVs[];
  pcountriesON: FormOptionsLVs[];
  countriesWithId: FormOptionsINV[];

  // pTaxRelations: FormOptionsLVs[]; // replaced by tax code + tax rate

  taxCodes: FormOptionsLVs[];
  taxRates: FormOptionsLVs[];

  currencies: FormOptionsNVs[];
  pcurrencies: FormOptionsLVs[];
  currenciesWithId: FormOptionsINV[];

  paymentTermsOptions: FormOptionsLVs[];
  statesOptions: FormOptionsLVn[];

  addressesDLV: FormOptionsLVn[];
  addressesINV: FormOptionsLVn[];

  // crossellings: FormOptionsLVn[];
  // crossellingsNames: string[];
  soasCategories: FormOptionsLVs[];

  // pwarehouses: FormOptionsLVs[];

  csvTemplateConfig: FormOptionsNVs[];
  pcsvTemplateConfig: FormOptionsLVs[];
  impTypes: FormOptionsNVs[];
  pimpTypes: FormOptionsLVs[];
  impTypesRefTables: FormOptionsNVs[];
  pimpTypesRefTables: FormOptionsLVs[];

  private translatePipe: TranslateItPipe;

  constructor(private tableDataService: TableDataService,
              private helperService: HelperService,
              private CONSTANTS: ConstantsService) {
  }

  /**
   * set translate pipe
   *
   * @param translatePipe
   */
  public setTranslatePipe(translatePipe: TranslateItPipe) {
    this.translatePipe = translatePipe;
  }

  /**
   * load/initialize form options. specify options to load in components constructor. if nothing is provided,
   * then no options are loaded.
   *
   * @param optionsToLoad
   * @param refTable - optional - required for orders, delivery notes, invoices : payment terms, states
   */
  async initializeOptions(optionsToLoad: OptionsTypes[], refTable?: string) {
    if (optionsToLoad) {
      const self = this;
      if (optionsToLoad.find(x => x == OptionsTypes.currencies)) {
        const resultCur: any = await self.getCurrencies();
        if (resultCur.currencies && resultCur.pcurrencies && resultCur.currenciesWithId) {
          self.currencies = resultCur.currencies;
          self.pcurrencies = resultCur.pcurrencies;
          self.currenciesWithId = resultCur.currenciesWithId;
        }
      }
      if (optionsToLoad.find(x => x == OptionsTypes.countries)) {
        const resultCnt: any = await self.getCountries();
        if (resultCnt.countries && resultCnt.pcountries && resultCnt.countriesOnlyName && resultCnt.countriesWithId &&
          resultCnt.pcountriesOnlyName) {
          self.countries = resultCnt.countries;
          self.pcountries = resultCnt.pcountries;
          self.countriesON = resultCnt.countriesOnlyName;
          self.countriesWithId = resultCnt.countriesWithId;
          self.pcountriesON = resultCnt.pcountriesOnlyName;
        }
      }
      if (optionsToLoad.find(x => x == OptionsTypes.states)) {
        // load all states and states for given referral table: order, delivery note and invoice
        let statesResult = await self.getFormOptionsData('states', refTable);
        if (!statesResult) {
          console.log(new Error('States data is not available...'));
        }
      }
      if (optionsToLoad.find(x => x == OptionsTypes.paymentTerms)) {
        let ptResult = await self.getFormOptionsData('paymentTerms', refTable);
        if (!ptResult) {
          console.log(new Error('Payment terms data is not available...'));
        }
      }
      if (optionsToLoad.find(x => x == OptionsTypes.languages)) {
        const resultLng: any = await self.getLanguages();
        self.languages = resultLng.languages ? resultLng.languages : self.languages;
        self.planguages = resultLng.planguages ? resultLng.planguages : self.planguages;
      }
      // this.loadCrossSellingOptions();
      if (optionsToLoad.find(x => x == OptionsTypes.soasCategories)) {
        const resultSCat: any = self.getSoasCategories();
        if (resultSCat.tmpCat) {
          self.soasCategories = resultSCat.tmpCat;
        }
      }
      if (optionsToLoad.find(x => x == OptionsTypes.taxCodes)) {
        const taxCodes: { taxCodes, pTaxCodes } = await self.getTaxCodes();
        if (taxCodes.pTaxCodes) {
          self.taxCodes = taxCodes.pTaxCodes;
        }
      }
      if (optionsToLoad.find(x => x == OptionsTypes.taxRates)) {
        const taxRates: { taxRates } = await self.getTaxRates();
        if (taxRates.taxRates) {
          self.taxRates = taxRates.taxRates;
        }
      }
      if (optionsToLoad.find(x => x == OptionsTypes.customerTypes)) {
        self.getCustomerTypes();
      }
      if (optionsToLoad.find(x => x == OptionsTypes.warehousingLocations)) {
        await this.getWarehouseLocations();
      }
      if (optionsToLoad.find(x => x == OptionsTypes.salesLocations)) {
        await this.getSalesLocations();
      }
      if (optionsToLoad.find(x => x == OptionsTypes.statusPos)) {
        this.getStatusPos();
      }

      if (optionsToLoad.find(x => x == OptionsTypes.provider)) {
        this.getProvider();
      }
      /*OVE 3*/
      /*this.getWarehouses(function (result) {
        if (result.pwarehouses) {
          self.pwarehouses = result.pwarehouses;
        }
      });
      this.getCsvTemplateConfig(function (result) {
        if (result.csvTemplateConfig && result.pcsvTemplateConfig) {
          self.csvTemplateConfig = result.csvTemplateConfig;
          self.pcsvTemplateConfig = result.pcsvTemplateConfig;
        }
      });
      this.getImportTypes(function (result) {
        if (result.impTypes && result.pimpTypes) {
          self.impTypes = result.impTypes;
          self.pimpTypes = result.pimpTypes;
        }
      });*/

      // NEMANJA SREDI PO OVOME

      // only init
      // if (optionsToLoad.find(x => x == OptionsTypes.warehouses)) {
      //   const resultWrh: any = await self.getWarehousesData(CompaniesLocationsTypes.warehousingLocations);
      //   if (resultWrh.data) {
      //     self.pwarehouses = resultWrh.data;
      //   }
      // }
    }
  }

  /**
   * get table data (e.g. paymentTerms or states) and convert it for form options
   *
   * @param tableName - db query table name
   * @param refTableType - type of ref table (order, delivery note, invoice)
   */
  public async getFormOptionsData(tableName: string, refTableType: string): Promise<boolean> {
    const dbData: any = await this.tableDataService.getTableData(ViewQueryTypes.PURE_SELECT, tableName);
    if (!dbData || !(dbData.table && dbData.table[1])) {
      return false;
    } else {
      if (tableName === this.CONSTANTS.REFTABLE_STATES) {
        this.statesOptions = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
        this.ordDlvInvStates = [{name: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
        this.ordPosStates = [undefined];
        this.dlvPosStates = [undefined];
        this.invPosStates = [undefined];
        let counter = Object.keys(this.ordDlvInvStates).length;
        let posCounter = 0;
        let posLiCounter = 0;
        let posRgCounter = 0;
        for (const pmElm in dbData.table[1]) {
          if (dbData.table[1].hasOwnProperty(pmElm)) {
            // collect all states rows in statesOptions
            this.statesOptions.push({
              label: dbData.table[1][pmElm].STATES_COMMENT + ' (' + dbData.table[1][pmElm].STATES_ID + ')',
              value: dbData.table[1][pmElm].STATES_ID
            });
            // separate states by order, delivery note or invoice state
            if ((refTableType === this.CONSTANTS.REFTABLE_ORDERS &&
                dbData.table[1][pmElm].STATES_TYPE === this.CONSTANTS.ORDER_TYPE_ID) ||
              (refTableType === this.CONSTANTS.REFTABLE_DELIVERY_NOTES &&
                dbData.table[1][pmElm].STATES_TYPE === this.CONSTANTS.DELIVERY_NOTE_TYPE_ID) ||
              (refTableType === this.CONSTANTS.REFTABLE_INVOICE &&
                dbData.table[1][pmElm].STATES_TYPE === this.CONSTANTS.INVOICE_TYPE_ID)
            ) {
              this.ordDlvInvStates[counter++] = {
                name: dbData.table[1][pmElm].STATES_COMMENT, // + ' (' + dbData['table'][1][pmElm].STATES_ID + ')',
                value: parseInt(dbData.table[1][pmElm].STATES_ID, 10)
              };
            } else if (dbData.table[1][pmElm].STATES_TYPE === this.CONSTANTS.ORDER_POSITION_TYPE_ID) {
              this.ordPosStates[posCounter++] = {
                name: dbData.table[1][pmElm].STATES_COMMENT, // + ' (' + dbData['table'][1][pmElm].STATES_ID + ')',
                value: parseInt(dbData.table[1][pmElm].STATES_ID, 10),
                state: dbData.table[1][pmElm].STATES_NAME
              };
            } else if (dbData.table[1][pmElm].STATES_TYPE === this.CONSTANTS.DELIVERY_NOTE_POSITION_TYPE_ID) {
              this.dlvPosStates[posLiCounter++] = {
                name: dbData.table[1][pmElm].STATES_COMMENT,
                value: parseInt(dbData.table[1][pmElm].STATES_ID, 10),
                state: dbData.table[1][pmElm].STATES_NAME
              };
            } else if (dbData.table[1][pmElm].STATES_TYPE === this.CONSTANTS.INVOICE_POSITION_TYPE_ID) {
              this.invPosStates[posRgCounter++] = {
                name: dbData.table[1][pmElm].STATES_COMMENT,
                value: parseInt(dbData.table[1][pmElm].STATES_ID, 10),
                state: dbData.table[1][pmElm].STATES_NAME
              };
            }
          }
        }
      } else if (tableName === this.CONSTANTS.REFTABLE_PAYMENT_TERMS) {
        this.paymentTermsOptions = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
        this.paymentTerms = [{name: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
        let tmpPTLVTemp = [];
        let tmpPTNVTemp = [];
        for (const pmElm in dbData.table[1]) {
          if (dbData.table[1].hasOwnProperty(pmElm)) {
            tmpPTLVTemp.push({
              label: dbData.table[1][pmElm].PAYMENT_TERM_NAME + ' (' + dbData.table[1][pmElm].PAYMENT_TERM_ID + ')',
              value: dbData.table[1][pmElm].PAYMENT_TERM_ID
            });
            tmpPTNVTemp.push({
              name: '(' + dbData.table[1][pmElm].PAYMENT_TERM_ID + ') ' + dbData.table[1][pmElm].PAYMENT_TERM_NAME,
              value: dbData.table[1][pmElm].PAYMENT_TERM_ID
            });
          }
        }
        this.helperService.sortOptions(tmpPTLVTemp);
        this.paymentTermsOptions.push(...tmpPTLVTemp); // make sure 'Please select' is first element
        this.helperService.sortOptions(tmpPTNVTemp);
        this.paymentTerms.push(...tmpPTNVTemp);
      }
      return true;
    }
  }

  /**
   * get customer types
   */
  public getCustomerTypes(): FormOptionsLVs[] | [] {
    if (this.translatePipe) {
      this.customertypes = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
      this.customertypes.push({label: this.CONSTANTS.CLIENT_B2C, value: this.CONSTANTS.CLIENT_B2C});
      this.customertypes.push({label: this.CONSTANTS.CLIENT_B2B, value: this.CONSTANTS.CLIENT_B2B});
    }
    return this.customertypes ? this.customertypes : [];
  }

  /**
   * Get languages. Returns array of languages: {languages: languages}
   * Examples: languages: { name: 'Deutsch DE (DEU)', value: 'DEU'}
   */
  public async getLanguages(): Promise<any> {
    const laDbData: { table: [any[string], any[]], maxRows: number, page: number } =
      await this.tableDataService.getTableData(ViewQueryTypes.PURE_SELECT, this.CONSTANTS.REFTABLE_LANGUAGES,
        'LANGUAGE_NAME', 'ASC');
    if (!laDbData || !laDbData.table || !laDbData.table[1]) {
      return {error: 'languages laDbData is undefined!'};
    } else {
      let languages = [{name: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
      let planguages = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
      for (const pos in laDbData.table[1]) {
        if (laDbData.table[1].hasOwnProperty(pos)) {
          languages.push({
            name: laDbData.table[1][pos].LANGUAGE_NAME + ' ' + laDbData.table[1][pos].LANGUAGE_ISO_ALPHA_2 +
              ' (' + laDbData.table[1][pos].LANGUAGE_ISO_ALPHA_3 + ')',
            value: laDbData.table[1][pos].LANGUAGE_ISO_ALPHA_3.toString()
          });
          planguages.push({
            label: laDbData.table[1][pos].LANGUAGE_NAME + ' (' + laDbData.table[1][pos].LANGUAGE_ISO_ALPHA_2 +
              ' - ' + laDbData.table[1][pos].LANGUAGE_ISO_ALPHA_3 + ')',
            value: laDbData.table[1][pos].LANGUAGE_ISO_ALPHA_3.toString()
          });
        }
      }
      return {languages, planguages};
    }
  }

  /**
   * Get countries. Returns array with 2 types of country arrays: {countries: countries,
   * countriesWithId: countriesWithId}
   * Examples: countries: { name: 'Finnland (FI)', value: 'FI'}, countriesWithId: { id: 5, name: 'Finnland',
   * value: 'FI'}
   */
  public async getCountries(): Promise<any> {
    const coDbData: { table: [any[string], any[]], maxRows: number, page: number } =
      await this.tableDataService.getTableData(ViewQueryTypes.PURE_SELECT, this.CONSTANTS.REFTABLE_COUNTRIES);
    if (!coDbData || !coDbData.table || !coDbData.table[1]) {
      return {error: 'countries coDbData is undefined!'};
    } else {
      let countries: FormOptionsNVs[] = [{name: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
      let pcountries: FormOptionsLVs[] = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
      let countriesOnlyName: FormOptionsNVs[] = [];
      let pcountriesOnlyName: FormOptionsLVs[] = [{
        label: this.translatePipe.transform('PLEASE_SELECT'),
        value: undefined
      }];
      let countriesWithId: FormOptionsINV[] = [];
      for (const pos in coDbData.table[1]) {
        if (coDbData.table[1].hasOwnProperty(pos)) {
          countries.push({
            name: coDbData.table[1][pos].COUNTRY_NAME + ' (' + coDbData.table[1][pos].COUNTRY_ISO_CODE + ')',
            value: coDbData.table[1][pos].COUNTRY_ISO_CODE.toString()
          });
          pcountries.push({
            label: coDbData.table[1][pos].COUNTRY_NAME + ' (' + coDbData.table[1][pos].COUNTRY_ISO_CODE + ')',
            value: coDbData.table[1][pos].COUNTRY_ISO_CODE.toString()
          });
          countriesOnlyName.push({
            name: coDbData.table[1][pos].COUNTRY_NAME,
            value: coDbData.table[1][pos].COUNTRY_NAME
          });
          pcountriesOnlyName.push({
            label: coDbData.table[1][pos].COUNTRY_NAME + ' (' + coDbData.table[1][pos].COUNTRY_ISO_CODE + ')',
            value: coDbData.table[1][pos].COUNTRY_NAME
          });
          countriesWithId.push({
            id: coDbData.table[1][pos].COUNTRY_ID,
            name: coDbData.table[1][pos].COUNTRY_NAME,
            value: coDbData.table[1][pos].COUNTRY_ISO_CODE
          });
        }
      }
      return {
        countries, pcountries,
        countriesWithId, countriesOnlyName,
        pcountriesOnlyName
      };
    }
  }

  /**
   * Get tax codes. Returns array of tax codes: {TAXCODE, DESCRIPTION, COUNTRY, TAXRATE}
   * Note: TAXRATE is 'virtual' column selected via inner join on server
   * Example: tax code: { name: 'DEK (Deutschland Ust.)', value: 'DEK'}
   */
  public async getTaxCodes(): Promise<{ taxCodes, pTaxCodes }> {
    let taxCodes: FormOptionsNVs[] =
      [{name: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
    let pTaxCodes: FormOptionsLVs[] =
      [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
    const taxDbData: { table: [any[string], any[]], maxRows: number, page: number } =
      await this.tableDataService.getTableData(ViewQueryTypes.PURE_SELECT, this.CONSTANTS.REFTABLE_TAXES,
        this.CONSTANTS.REFTABLE_TAXES_COLUMN, 'ASC');
    if (!taxDbData || !taxDbData.table || !taxDbData.table[1]) {
      console.log(new Error('tax codes data is undefined!'));
    } else {
      for (const pos in taxDbData.table[1]) {
        if (taxDbData.table[1].hasOwnProperty(pos)) {
          taxCodes.push({name: taxDbData.table[1][pos].TAXCODE + ' (' + taxDbData.table[1][pos].DESCRIPTION + ' ' +
              taxDbData.table[1][pos].TAXRATE + ')',
            value: taxDbData.table[1][pos].TAXCODE.toString()
          });
          pTaxCodes.push({
            label: taxDbData.table[1][pos].TAXCODE + ' (' + taxDbData.table[1][pos].DESCRIPTION + ' ' +
              taxDbData.table[1][pos].TAXRATE + ')',
            value: taxDbData.table[1][pos].TAXCODE.toString()
          });
        }
      }
      return {taxCodes, pTaxCodes};
    }
  }

  /**
   * Get tax rates. Returns array of tax rates: {TAXCODE, PER_START, PER_END, TAXRATE}
   * Example: tax rate: { name: 'DEK (19%)', value: '19%'}
   */
  public async getTaxRates(): Promise<{ taxRates }> {
    let taxRates: FormOptionsLVs[] =
      [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
    const taxRatesData: { table: [any[string], any[]], maxRows: number, page: number } =
      await this.tableDataService.getTableData(ViewQueryTypes.PURE_SELECT, this.CONSTANTS.REFTABLE_TAXESRATE,
        this.CONSTANTS.REFTABLE_TAXESRATE_COLUMN, 'ASC');
    if (!taxRatesData || !taxRatesData.table || !taxRatesData.table[1]) {
      console.log(new Error('tax rates data is undefined!'));
    } else {
      for (const pos in taxRatesData.table[1]) {
        if (taxRatesData.table[1].hasOwnProperty(pos)) {
          taxRates.push({
            label: taxRatesData.table[1][pos].TAXCODE + ' (' + taxRatesData.table[1][pos].TAXRATE + ')',
            value: taxRatesData.table[1][pos].TAXRATE.toString()
          });
        }
      }
      return {taxRates};
    }
  }

  /**
   * Get currencies. Returns array with 2 types of currencies arrays: {currencies: currencies,
   * pcurrencies: pcurrencies, currenciesWithId: currenciesWithId}
   * Examples: currencies: { name: 'EUR', value: '1'}, pcurrencies: { name: 'EUR (€)', value: '1'},
   * currenciesWithId: { id: 1, name: 'Euro', value: 'EUR'}
   */
  public async getCurrencies(): Promise<any> {
    const dbData: { table: [any[string], any[]], maxRows: number, page: number } =
      await this.tableDataService.getTableData(ViewQueryTypes.PURE_SELECT, this.CONSTANTS.REFTABLE_CURRENCIES);
    if (!dbData) {
      return {error: 'currencies dbData is undefined!'};
    } else {
      let currencies = [{name: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
      let currenciesWithId: FormOptionsINV[] = [];
      let pcurrencies = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
      for (const pos in dbData.table[1]) {
        if (dbData.table[1].hasOwnProperty(pos)) {
          currencies.push({
            name: dbData.table[1][pos].CURRENCY_ISO_CODE,
            value: dbData.table[1][pos].CURRENCY_ID.toString()
          });
          pcurrencies.push({
            label: dbData.table[1][pos].CURRENCY_ISO_CODE + ' (' + dbData.table[1][pos].CURRENCY_SYMBOL + ')',
            value: dbData.table[1][pos].CURRENCY_ID.toString()
          });
          currenciesWithId.push({
            id: dbData.table[1][pos].CURRENCY_ID,
            name: dbData.table[1][pos].CURRENCY_NAME,
            value: dbData.table[1][pos].CURRENCY_ISO_CODE
          });
        }
      }
      return {currencies, pcurrencies, currenciesWithId};
    }
  }

  /**
   * get states
   * Examples: States {label: Offen (Bestellung) (10), value: 10}
   */
  public async getStates(): Promise<any> {
    const dbData: { table: [any[string], any[]], maxRows: number, page: number } =
      await this.tableDataService.getTableData(ViewQueryTypes.PURE_SELECT, this.CONSTANTS.REFTABLE_STATES);
    if (!dbData) {
      return {error: 'states dbData is undefined!'};
    } else {
      let tmpStates = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
      for (const pos in dbData.table[1]) {
        if (dbData.table[1].hasOwnProperty(pos)) {
          tmpStates.push({
            label: dbData.table[1][pos].STATES_COMMENT + ' (' + dbData.table[1][pos].STATES_ID + ')',
            value: dbData.table[1][pos].STATES_ID
          });
        }
      }
      return {tmpStates};
    }
  }

  /**
   * get order addresses
   * IMPORTANT: CUSTOMER_ADDRESSES should be first element in fields, because otherwise addresses select elements
   * will be not set
   *
   * @param addressNames
   * @private
   */
  public getOrderAddresses(addressNames: string) {
    // console.log('OPTIONS - addressNames: ', addressNames);
    this.addressesDLV = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
    this.addressesINV = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
    if (addressNames && addressNames.length) {
      const addrPartsOne: string[] = addressNames.trim().split(';');
      for (const oneParts in addrPartsOne) {
        if (addrPartsOne.hasOwnProperty(oneParts)) {
          const addrParts: string[] = addrPartsOne[oneParts].split(
            this.CONSTANTS.CUSTOMERS_ADDRESSES_DELIMITER
          );
          if (addrParts && addrParts.length === 3) {
            const addrItem: { label; value } = {
              label: addrParts[2].trim(),
              value: parseInt(addrParts[1].trim(), 10),
            };
            if (addrParts[0].trim() === CustomerAddressTypes.DLV) {
              this.addressesDLV.push(addrItem);
            } else if (addrParts[0].trim() === CustomerAddressTypes.INV) {
              this.addressesINV.push(addrItem);
            }
          }
        }
      }
    }
  }

  public getOrderTaxation(taxation: string) {
    // console.log('OPTIONS - taxation: ', taxation);
    // // this.taxCodes = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
    // if (this.taxCodes) {
    //   this.taxRates = [];
    //   for (const taxRelItem in this.taxCodes) {
    //     if (this.taxCodes.hasOwnProperty(taxRelItem)) {
    //       this.taxRates.push(this.taxCodes[taxRelItem]);
    //     }
    //   }
    // } else {
    //   this.taxRates = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
    // }
    if (taxation && taxation.length) {
      this.taxCodes = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
      const taxPartsOne: string[] = taxation.trim().split(';');
      for (const oneParts in taxPartsOne) {
        if (taxPartsOne.hasOwnProperty(oneParts)) {
          const taxParts: string[] = taxPartsOne[oneParts].split(
            this.CONSTANTS.CUSTOMERS_ADDRESSES_DELIMITER
          );
          if (taxParts && taxParts.length === 3) {
            const taxItem: { label; value } = {
              label: taxParts[2].trim(),
              value: taxParts[2].trim(),
            };
            if (taxParts[0].trim() === CustomerAddressTypes.INV) {
              this.taxCodes.push(taxItem);
            }
          }
        }
      }
    }
  }

  /**
   * get soas categories
   * Examples: {label: 'HAUPT', value: 'HAUPT'}
   */
  public getSoasCategories(): { tmpCat: FormOptionsLVs[] | [] } {
    let tmpCat: FormOptionsLVs[];
    if (this.translatePipe) {
      tmpCat = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
      if (this.CONSTANTS.ARTICLE_DEFAULT_CATEGORIES) {
        let tempCatTmp = [];
        for (const pos in this.CONSTANTS.ARTICLE_DEFAULT_CATEGORIES) {
          if (this.CONSTANTS.ARTICLE_DEFAULT_CATEGORIES.hasOwnProperty(pos)) {
            tempCatTmp.push({
              label: this.CONSTANTS.ARTICLE_DEFAULT_CATEGORIES[pos],
              value: this.CONSTANTS.ARTICLE_DEFAULT_CATEGORIES[pos],
            });
          }
        }
        this.helperService.sortOptions(tempCatTmp);
        tmpCat.push(...tempCatTmp);
      } else {
        console.log(
          this.CONSTANTS.ARTICLE_DEFAULT_CATEGORIES,
          ' is undefined!'
        );
      }
    }
    return {tmpCat: tmpCat ? tmpCat : []};
  }

  /**
   * load warehouses options:
   *
   * Examples: data {label: '101', value: '101'}
   *
   * @param type - 'warehousingLocations' or 'salesLocations'
   */
  public async getWarehousesData(type: CompaniesLocationsTypes): Promise<{ data: FormOptionsLVs[] | [] }> {
    let pWarehousesData: FormOptionsLVs[];
    if (this.translatePipe) {
      pWarehousesData = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
      const dbData: { table: [any[string], any[]], maxRows: number, page: number } =
        await this.tableDataService.getTableData(ViewQueryTypes.PURE_SELECT, this.CONSTANTS.REFTABLE_COMPANIES_LOCATIONS);
      if (!dbData || !dbData.table || !dbData.table[1]) {
        console.log('companies locations dbData is undefined!');
      } else {
        for (const pos in dbData.table[1]) {
          if (dbData.table[1].hasOwnProperty(pos)) {
            if ((type === CompaniesLocationsTypes.warehousingLocations && dbData.table[1][pos].IS_WAREHOUSE_LOCATION) ||
              (type === CompaniesLocationsTypes.salesLocations && dbData.table[1][pos].IS_SALES_LOCATION)) {
              pWarehousesData.push({
                label: dbData.table[1][pos].LOCATION.toString(),
                value: dbData.table[1][pos].LOCATION.toString()
              });
            }
          }
        }
      }
    }
    return {data: pWarehousesData ? pWarehousesData : []};
  }

  /**
   * get warehouse locations
   */
  public async getWarehouseLocations(): Promise<FormOptionsLVs[] | []> {
    const warehouses = await this.getWarehousesData(CompaniesLocationsTypes.warehousingLocations);
    this.warehousingLocations = [];
    for (const pos in warehouses.data) {
      this.warehousingLocations.push({label: warehouses.data[pos].label, value: warehouses.data[pos].value});
    }
    return warehouses.data;
  }

  /**
   * get sales locations
   */
  public async getSalesLocations(): Promise<FormOptionsLVs[] | []> {
    const warehouses = await this.getWarehousesData(CompaniesLocationsTypes.salesLocations);
    this.salesLocations = [];
    for (const pos in warehouses.data) {
      this.salesLocations.push({label: warehouses.data[pos].label, value: warehouses.data[pos].value});
    }
    return warehouses.data;
  }

  /**
   * get warehouse options for select element
   *
   * @param orderNumber
   */
  // public getWarehouseOptForSelect(orderNumber: string): void {
  //   this.http.post<Array<{ WHLOC: string }>>(
  //     this.CONSTANTS.SERVER_URL + '/formSelect/orderWarehouse',
  //     {
  //       orderNumber
  //     },
  //     {headers: {Authorization: 'Bearer ' + localStorage.getItem(this.CONSTANTS.LS_ACCESS_TOKEN)}}
  //   ).toPromise().then((res) => {
  //     let pWarehouses =
  //       [
  //         {
  //           label: this.translatePipe.transform('PLEASE_SELECT'),
  //           value: undefined
  //         }
  //       ] as { label: string, value: string }[]
  //
  //     if (this.translatePipe && res) {
  //       for (const pos of res) {
  //         pWarehouses.push({label: pos.WHLOC, value: pos.WHLOC})
  //       }
  //     }
  //     this.pwarehouses = pWarehouses
  //   })
  // }

  /**
   * get cross selling data
   */
  public async getCrosssellings():
    Promise<{ tmpCross: { label: string; value: any; }[], tmpCrossNames: string[] } | { error: string }> {
    const dbData: { table: [any[string], any[]], maxRows: number, page: number } =
      await this.tableDataService.getTableData(ViewQueryTypes.PURE_SELECT, this.CONSTANTS.REFTABLE_CROSSELLING);
    if (!dbData || !dbData.table || !dbData.table[1]) {
      return {error: 'crosssellings dbData is undefined!'};
    } else {
      let tmpCross = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
      let tmpCrossNames: string[] = [];
      for (const pos in dbData.table[1]) {
        if (dbData.table[1].hasOwnProperty(pos)) {
          tmpCross.push({
            label: dbData.table[1][pos].CROSSSELLING_DATA + ' (' + dbData.table[1][pos].CROSSSELLING_ID + ')',
            value: dbData.table[1][pos].CROSSSELLING_ID
          });
          tmpCrossNames.push('(' + dbData.table[1][pos].CROSSSELLING_ID + ') ' +
            dbData.table[1][pos].CROSSSELLING_DATA);
        }
      }
      return {tmpCross, tmpCrossNames};
    }
  }

  /**
   * get payment terms
   * Examples: paymentTerms: {label: GER~Amazon Payments~ (AMAZONPAYMENTS), value: AMAZONPAYMENTS}
   */
  public async getPaymentTerms(): Promise<{ tmpPT: FormOptionsLVs[] } | { error: string }> {
    const dbData: { table: [any[string], any[]], maxRows: number, page: number } =
      await this.tableDataService.getTableData(ViewQueryTypes.PURE_SELECT, this.CONSTANTS.REFTABLE_PAYMENT_TERMS);
    if (!dbData || !dbData.table || !dbData.table[1]) {
      return {error: 'payment terms dbData is undefined!'};
    } else {
      let tmpPT: FormOptionsLVs[] = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
      let tmpPTTemp = [];
      for (const pos in dbData.table[1]) {
        if (dbData.table[1].hasOwnProperty(pos)) {
          tmpPTTemp.push({
            label: dbData.table[1][pos].PAYMENT_TERM_NAME + ' (' + dbData.table[1][pos].PAYMENT_TERM_ID + ')',
            value: dbData.table[1][pos].PAYMENT_TERM_ID
          });
        }
      }
      this.helperService.sortOptions(tmpPTTemp);
      tmpPT.push(...tmpPTTemp); // make sure 'Please select' is first element
      return {tmpPT};
    }
  }

  /**
   * get payment term by language
   *
   * @param language - DEU
   * @param newPaymentCondition
   */
  public getPaymentTermByLanguage(language: string, newPaymentCondition: string): string {
    switch (language) {
      case 'DEU':
        newPaymentCondition = 'DEVORAUS';
        break;
      case 'ENG':
        newPaymentCondition = 'UKVORAUS';
        break;
      case 'FRA':
        newPaymentCondition = 'FRVORAUS';
        break;
      case 'SPA':
        newPaymentCondition = 'ESVORAUS';
        break;
      case 'CHI':
        newPaymentCondition = 'PAYPAL';
        break;
      case 'CZE':
        newPaymentCondition = 'PAYPAL';
        break;
      case 'DEN':
        newPaymentCondition = 'PAYPAL';
        break;
      case 'MAZ':
        newPaymentCondition = 'PAYPAL';
        break;
      case 'NED':
        newPaymentCondition = 'PAYPAL';
        break;
      case 'AUT':
        newPaymentCondition = 'DEVORAUS';
        break;
      case 'BEL':
        newPaymentCondition = 'PAYPAL';
        break;
      case 'GBR':
        newPaymentCondition = 'UKVORAUS';
        break;
      case 'ITA':
        newPaymentCondition = 'ITVORAUS';
        break;
      default:
        break;
    }
    return newPaymentCondition;
  }

  /**
   * get tax code by country (COUNTRY_ISO_CODE).
   *
   * @param countryIsoCode - e.g. 'DE'
   */
  public async getTaxCodeByCountryIsoCode(countryIsoCode: string): Promise<string> {
    // let newTaxCode: string = this.CONSTANTS.DEFAULT_B2C_TAX_CODE;
    let taxCode: string;
    const taxCodesData: { table: [any[string], any[]], maxRows: number, page: number } =
      await this.tableDataService.getTableData(ViewQueryTypes.PURE_SELECT, this.CONSTANTS.REFTABLE_TAXES,
        this.CONSTANTS.REFTABLE_TAXES_COLUMN, 'ASC');
      // await this.tableDataService.getTableData(ViewQueryTypes.PURE_SELECT, this.CONSTANTS.REFTABLE_TAXESRATE,
      //   this.CONSTANTS.REFTABLE_TAXESRATE_COLUMN, 'ASC');
    if (!taxCodesData || !taxCodesData.table || !taxCodesData.table[1]) {
      console.log(new Error('tax codes data is undefined!'));
    } else {
      // console.log('countryIsoCode: ', countryIsoCode);
      // console.log('taxCodesData.table[1]: ', taxCodesData.table[1]);
      for (const pos in taxCodesData.table[1]) {
        if (taxCodesData.table[1].hasOwnProperty(pos) &&
          taxCodesData.table[1][pos].COUNTRY === countryIsoCode) {
          taxCode = taxCodesData.table[1][pos].TAXCODE;
          break;
        }
      }
      return taxCode;
    }
  }

  /**
   * get status pos
   */
  public getStatusPos(): FormOptionsLVs[] | [] {
    if (this.translatePipe) {
      this.statusPos = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
      this.statusPos.push({label: "A", value: "A"});
      this.statusPos.push({label: "Q", value: "Q"});
      this.statusPos.push({label: "R", value: "R"});
      this.statusPos.push({label: "R1", value: "R1"});
    }
    return this.statusPos ? this.statusPos : [];
  }


  /**
   * get providers
   */
   public async getProvider(): Promise<{ tmpPT: FormOptionsLVs[] } | { error: string }> {
    const dbData: { table: [any[string], any[]], maxRows: number, page: number } =
      await this.tableDataService.getTableData(ViewQueryTypes.PURE_SELECT, this.CONSTANTS.REFTABLE_PROVIDERS);
    if (!dbData || !dbData.table || !dbData.table[1]) {
      return {error: 'providers dbData is undefined!'};
    } else {
      let tmpPT: FormOptionsLVs[] = [{label: this.translatePipe.transform('PLEASE_SELECT'), value: undefined}];
      let tmpPTTemp = [];
      for (const pos in dbData.table[1]) {
        if (dbData.table[1].hasOwnProperty(pos)) {
          tmpPTTemp.push({
            label: dbData.table[1][pos].PROVIDERS_NAME + ' (' + dbData.table[1][pos].PROVIDERS_COUNTRY + ')',
            value: dbData.table[1][pos].PROVIDERS_NAME
          });
        }
      }
      this.helperService.sortOptions(tmpPTTemp);
      tmpPT.push(...tmpPTTemp); // make sure 'Please select' is first element
      this.provider = tmpPTTemp;
      return {tmpPT};
    }
  }

}
