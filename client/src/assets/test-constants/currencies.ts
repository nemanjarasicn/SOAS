import {FormOptionsLVs, FormOptionsNVs} from "../../app/interfaces/form-options";

/**
 * currencies constants for unit tests
 */
export class CurrenciesTestConstants {

  public static CURRENCIES = [
    {CURRENCY_ID: '1', CURRENCY_NAME: "Euro", CURRENCY_ISO_CODE: "EUR", CURRENCY_SYMBOL: "€"},
    {CURRENCY_ID: '2', CURRENCY_NAME: "US Dollar", CURRENCY_ISO_CODE: "USD", CURRENCY_SYMBOL: "$"},
    {CURRENCY_ID: '3', CURRENCY_NAME: "British pound", CURRENCY_ISO_CODE: "GBP", CURRENCY_SYMBOL: "£"},
    {CURRENCY_ID: '4', CURRENCY_NAME: "Swiss franc", CURRENCY_ISO_CODE: "CHF", CURRENCY_SYMBOL: "Fr."},
    {CURRENCY_ID: '5', CURRENCY_NAME: "Czech koruna", CURRENCY_ISO_CODE: "CZK", CURRENCY_SYMBOL: "Kč"},
    {CURRENCY_ID: '6', CURRENCY_NAME: "Polish złoty", CURRENCY_ISO_CODE: "PLN", CURRENCY_SYMBOL: "Zł"},
    {CURRENCY_ID: '7', CURRENCY_NAME: "Norwegian krone", CURRENCY_ISO_CODE: "NOK", CURRENCY_SYMBOL: "Kr"},
    {CURRENCY_ID: '8', CURRENCY_NAME: "Danish krone", CURRENCY_ISO_CODE: "DKK", CURRENCY_SYMBOL: "Kr"},
  ];

  public static CURRENCIES_NV: FormOptionsNVs[] =
    [
      {name: 'PLEASE_SELECT', value: undefined},
      {name: 'EUR', value: '1'},
      {name: 'USD', value: '2'},
      {name: 'GBP', value: '3'},
      {name: 'CHF', value: '4'},
      {name: 'CZK', value: '5'},
      {name: 'PLN', value: '6'},
      {name: 'NOK', value: '7'},
      {name: 'DKK', value: '8'}
    ];

  public static PCURRENCIES_LV: FormOptionsLVs[] =
    [
      {label: 'PLEASE_SELECT', value: undefined},
      {label: 'EUR (€)', value: '1'},
      {label: 'USD ($)', value: '2'},
      {label: 'GBP (£)', value: '3'},
      {label: 'CHF (Fr.)', value: '4'},
      {label: 'CZK (Kč)', value: '5'},
      {label: 'PLN (Zł)', value: '6'},
      {label: 'NOK (Kr)', value: '7'},
      {label: 'DKK (Kr)', value: '8'},
    ];

  public static CURRENCIES_SELECT = {
    currencies: CurrenciesTestConstants.CURRENCIES_NV,
    pcurrencies: CurrenciesTestConstants.PCURRENCIES_LV,
    currenciesWithId : [
      {id: '1', name: 'Euro', value: 'EUR'},
      {id: '2', name: 'US Dollar', value: 'USD'},
      {id: '3', name: 'British pound', value: 'GBP'},
      {id: '4', name: 'Swiss franc', value: 'CHF'},
      {id: '5', name: 'Czech koruna', value: 'CZK'},
      {id: '6', name: 'Polish złoty', value: 'PLN'},
      {id: '7', name: 'Norwegian krone', value: 'NOK'},
      {id: '8', name: 'Danish krone', value: 'DKK'},
    ]
  };
}
