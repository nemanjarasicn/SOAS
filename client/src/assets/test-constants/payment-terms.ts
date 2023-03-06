/**
 * payment terms constants for unit tests
 */
export class PaymentTermsTestConstants {

  public static PAYMENT_TERMS = [
    {
      PAYMENT_TERM_ID: "ERSATZ",
      PAYMENT_TERM_NAME: "GER~kostenlose Lieferung~ERSATZ",
      PAYMENT_TERM_COMMENT: "",
      PAYMENT_TERM_ACTIVE: true,
      PAYMENT_CONFIRMED: false
    },
    {
      PAYMENT_TERM_ID: "VARIOBEZAHLT",
      PAYMENT_TERM_NAME: "GER~Vario bezahlt~VARIOBEZAHLT",
      PAYMENT_TERM_COMMENT: "",
      PAYMENT_TERM_ACTIVE: true,
      PAYMENT_CONFIRMED: false
    },
    {
      PAYMENT_TERM_ID: "DE10T",
      PAYMENT_TERM_NAME: "GER~Rechnung Fälligkeit 10 Tage~",
      PAYMENT_TERM_COMMENT: "",
      PAYMENT_TERM_ACTIVE: true,
      PAYMENT_CONFIRMED: false
    },
    {
      PAYMENT_TERM_ID: "DE60T",
      PAYMENT_TERM_NAME: "GER~Rechnung Fälligkeit 60 Tage~",
      PAYMENT_TERM_COMMENT: "",
      PAYMENT_TERM_ACTIVE: true,
      PAYMENT_CONFIRMED: false
    },
    {
      PAYMENT_TERM_ID: "DE40T",
      PAYMENT_TERM_NAME: "GER~Rechnung Fälligkeit 40 Tage~",
      PAYMENT_TERM_COMMENT: "",
      PAYMENT_TERM_ACTIVE: true,
      PAYMENT_CONFIRMED: false
    },
    {
      PAYMENT_TERM_ID: "DE05T",
      PAYMENT_TERM_NAME: "GER~Rechnung Fälligkeit 5 Tage~5 Tage netto",
      PAYMENT_TERM_COMMENT: "",
      PAYMENT_TERM_ACTIVE: true,
      PAYMENT_CONFIRMED: false
    },
    {
      PAYMENT_TERM_ID: "DEEC",
      PAYMENT_TERM_NAME: "GER~EC Kartenzahlung~",
      PAYMENT_TERM_COMMENT: "",
      PAYMENT_TERM_ACTIVE: true,
      PAYMENT_CONFIRMED: false
    },
    {
      PAYMENT_TERM_ID: "PAYPAL",
      PAYMENT_TERM_NAME: "GER~PayPal~PayPal",
      PAYMENT_TERM_COMMENT: "",
      PAYMENT_TERM_ACTIVE: true,
      PAYMENT_CONFIRMED: true
    },
  ];

  public static PAYMENT_TERMS_SELECT = [
    {label: 'PLEASE_SELECT', value: undefined},
    {label: 'GER~EC Kartenzahlung~ (DEEC)', value: 'DEEC'},
    {label: 'GER~kostenlose Lieferung~ERSATZ (ERSATZ)', value: 'ERSATZ'},
    {label: 'GER~PayPal~PayPal (PAYPAL)', value: 'PAYPAL'},
    {label: 'GER~Rechnung Fälligkeit 10 Tage~ (DE10T)', value: 'DE10T'},
    {label: 'GER~Rechnung Fälligkeit 40 Tage~ (DE40T)', value: 'DE40T'},
    {label: 'GER~Rechnung Fälligkeit 5 Tage~5 Tage netto (DE05T)', value: 'DE05T'},
    {label: 'GER~Rechnung Fälligkeit 60 Tage~ (DE60T)', value: 'DE60T'},
    {label: 'GER~Vario bezahlt~VARIOBEZAHLT (VARIOBEZAHLT)', value: 'VARIOBEZAHLT'},
  ];

}
