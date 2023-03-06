/**
 * tax codes constants for unit tests
 */
export class TaxCodesTestConstants {

  public static TAX_CODES = [
    {TAXCODE: "DEK", DESCRIPTION: 'Deutschland Ust.', COUNTRY: 'DE'},
    {TAXCODE: "ITK", DESCRIPTION: 'Italien Ust. Kunde', COUNTRY: 'IT'},
    {TAXCODE: "FRA", DESCRIPTION: 'French', COUNTRY: 'FR'},
    // {TAXCODE: "EUK", DESCRIPTION: '', COUNTRY: ''},
    // {TAXCODE: "EXK", DESCRIPTION: '', COUNTRY: ''},
    // {TAXCODE: "EXP", DESCRIPTION: '', COUNTRY: ''},
    // {TAXCODE: "FXE", DESCRIPTION: '', COUNTRY: ''},
    // {TAXCODE: "FXK", DESCRIPTION: '', COUNTRY: ''},
    // {TAXCODE: "RVK", DESCRIPTION: '', COUNTRY: ''},
  ];

  public static TAX_CODES_SELECT = {
    taxCodes: [{name: 'PLEASE_SELECT', value: undefined},
      {name: 'DEK (Deutschland Ust. 19%)', value: 'DEK'},
      {name: 'ITK (Italien Ust. Kunde 20%)', value: 'ITK'},
      {name: 'FRA (French 20%)', value: 'FRA'},
      // {name: 'EUK (16 %)', value: 'EUK'},
      // {name: 'EXK (16 %)', value: 'EXK'},
      // {name: 'EXP (20 %)', value: 'EXP'},
      // {name: 'FXE (20 %)', value: 'FXE'},
      // {name: 'FXK (20 %)', value: 'FXK'},
      // {name: 'RVK (20 %)', value: 'RVK'},
    ],
    pTaxCodes: [{label: 'PLEASE_SELECT', value: undefined},
      {label: 'DEK (Deutschland Ust. 19%)', value: 'DEK'},
      {label: 'ITK (Italien Ust. Kunde 20%)', value: 'ITK'},
      {label: 'FRA (French 20%)', value: 'FRA'},
      // {label: 'EUK (16 %)', value: 'EUK'},
      // {label: 'EXK (16 %)', value: 'EXK'},
      // {label: 'EXP (20 %)', value: 'EXP'},
      // {label: 'FXE (20 %)', value: 'FXE'},
      // {label: 'FXK (20 %)', value: 'FXK'},
      // {label: 'RVK (20 %)', value: 'RVK'},
    ],
  };
}
