/**
 * taxation relations constants for unit tests
 * @deprecated
 */
export class TaxationRelationsTestConstants {

  public static TAXATION_RELATIONS = [
    {TAXATION_NAME: "DEK", TAXATION_RATE: 16},
    {TAXATION_NAME: "EUK", TAXATION_RATE: 16},
    {TAXATION_NAME: "EXK", TAXATION_RATE: 16},
    {TAXATION_NAME: "EXP", TAXATION_RATE: 20},
    {TAXATION_NAME: "FRA", TAXATION_RATE: 20},
    {TAXATION_NAME: "FXE", TAXATION_RATE: 20},
    {TAXATION_NAME: "FXK", TAXATION_RATE: 20},
    {TAXATION_NAME: "RVK", TAXATION_RATE: 20},
  ];

  public static TAXATION_RELATIONS_SELECT = {
    taxRelations: [{name: 'PLEASE_SELECT', value: undefined},
      {name: 'DEK (16 %)', value: 'DEK'},
      {name: 'EUK (16 %)', value: 'EUK'},
      {name: 'EXK (16 %)', value: 'EXK'},
      {name: 'EXP (20 %)', value: 'EXP'},
      {name: 'FRA (20 %)', value: 'FRA'},
      {name: 'FXE (20 %)', value: 'FXE'},
      {name: 'FXK (20 %)', value: 'FXK'},
      {name: 'RVK (20 %)', value: 'RVK'},
    ],
    pTaxRelations: [{label: 'PLEASE_SELECT', value: undefined},
      {label: 'DEK (16 %)', value: 'DEK'},
      {label: 'EUK (16 %)', value: 'EUK'},
      {label: 'EXK (16 %)', value: 'EXK'},
      {label: 'EXP (20 %)', value: 'EXP'},
      {label: 'FRA (20 %)', value: 'FRA'},
      {label: 'FXE (20 %)', value: 'FXE'},
      {label: 'FXK (20 %)', value: 'FXK'},
      {label: 'RVK (20 %)', value: 'RVK'},
    ],
  };
}
