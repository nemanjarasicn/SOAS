/**
 * languages constants for unit tests
 */
export class LanguagesTestConstants {

  public static LANGUAGES = [
    {
      LANGUAGE_CODE: "CN_CN",
      LANGUAGE_NAME: "Chinesisch",
      LANGUAGE_ISO_ALPHA_2: "CN",
      LANGUAGE_ISO_ALPHA_3: "CHI"
    },
    {LANGUAGE_CODE: "DK_DK", LANGUAGE_NAME: "Dänisch", LANGUAGE_ISO_ALPHA_2: "DK", LANGUAGE_ISO_ALPHA_3: "DEN"},
    {LANGUAGE_CODE: "DE_DE", LANGUAGE_NAME: "Deutsch", LANGUAGE_ISO_ALPHA_2: "DE", LANGUAGE_ISO_ALPHA_3: "DEU"},
    {
      LANGUAGE_CODE: "DE_AT",
      LANGUAGE_NAME: "Deutsch (Österreich)",
      LANGUAGE_ISO_ALPHA_2: "AT",
      LANGUAGE_ISO_ALPHA_3: "AUT"
    },
    {
      LANGUAGE_CODE: "EN_GB",
      LANGUAGE_NAME: "Englisch (GB)",
      LANGUAGE_ISO_ALPHA_2: "GB",
      LANGUAGE_ISO_ALPHA_3: "GBR"
    },
  ];

  public static LANGUAGES_SELECT = {
    languages: [{name: 'PLEASE_SELECT', value: undefined},
      {name: 'Chinesisch CN (CHI)', value: 'CHI'},
      {name: 'Dänisch DK (DEN)', value: 'DEN'},
      {name: 'Deutsch DE (DEU)', value: 'DEU'},
      {name: 'Deutsch (Österreich) AT (AUT)', value: 'AUT'},
      {name: 'Englisch (GB) GB (GBR)', value: 'GBR'},],
    planguages: [{label: 'PLEASE_SELECT', value: undefined},
      {label: 'Chinesisch (CN - CHI)', value: 'CHI'},
      {label: 'Dänisch (DK - DEN)', value: 'DEN'},
      {label: 'Deutsch (DE - DEU)', value: 'DEU'},
      {label: 'Deutsch (Österreich) (AT - AUT)', value: 'AUT'},
      {label: 'Englisch (GB) (GB - GBR)', value: 'GBR'},],
  };
}
