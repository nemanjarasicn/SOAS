import {FormOptionsNVn, FormOptionsNVs, FormOptionsNVS} from "../../app/interfaces/form-options";

/**
 * states constants for unit tests
 */
export class StatesTestConstants {

  public static STATES = [
    {
      STATES_ID: 0, STATES_NAME: "STATE_AU_CANCELED", STATES_COMMENT: "Storniert",
      STATES_ACTIVE: true, STATES_TYPE: "AU"
    },
    {
      STATES_ID: 0, STATES_NAME: "STATE_POS_NOT_ALLOCATED", STATES_COMMENT: "Nicht zugeteilt",
      STATES_ACTIVE: true, STATES_TYPE: "POS"
    },
    {
      STATES_ID: 1, STATES_NAME: "STATE_POS_OPEN", STATES_COMMENT: "Offen",
      STATES_ACTIVE: true, STATES_TYPE: "POS"
    },
    {
      STATES_ID: 1, STATES_NAME: "STATE_POS_LI_OPEN", STATES_COMMENT: "Offen",
      STATES_ACTIVE: true, STATES_TYPE: "POS_LI"
    },
    {
      STATES_ID: 2, STATES_NAME: "STATE_POS_PARTIALLY_ALLOCATED", STATES_COMMENT: "Teilzugeteilt",
      STATES_ACTIVE: true, STATES_TYPE: "POS"
    },
    {
      STATES_ID: 2, STATES_NAME: "STATE_POS_LI_PARTIALLY_DELIVERED", STATES_COMMENT: "Teilweise geliefert",
      STATES_ACTIVE: true, STATES_TYPE: "POS_LI"
    },
    {
      STATES_ID: 3, STATES_NAME: "STATE_POS_COMPLETELY_ALLOCATED", STATES_COMMENT: "Vollständig Zugeteilt",
      STATES_ACTIVE: true, STATES_TYPE: "POS"
    },
    {
      STATES_ID: 3, STATES_NAME: "STATE_POS_LI_DELIVERED", STATES_COMMENT: "Geliefert",
      STATES_ACTIVE: true, STATES_TYPE: "POS_LI"
    },
    {
      STATES_ID: 10, STATES_NAME: "STATE_AU_OPEN", STATES_COMMENT: "Offen (Bestellung)",
      STATES_ACTIVE: true, STATES_TYPE: "AU"
    },
    {
      STATES_ID: 20, STATES_NAME: "STATE_AU_IN_PROCESS", STATES_COMMENT: "In Bearbeitung (Wartet)",
      STATES_ACTIVE: true, STATES_TYPE: "AU"
    },
    {
      STATES_ID: 30, STATES_NAME: "STATE_AU_COMPLETED", STATES_COMMENT: "Komplett abgeschlossen",
      STATES_ACTIVE: true, STATES_TYPE: "AU"
    },
    {
      STATES_ID: 40, STATES_NAME: "STATE_LI_OPEN", STATES_COMMENT: "Offen (Lieferschein)",
      STATES_ACTIVE: true, STATES_TYPE: "LI"
    },
    {
      STATES_ID: 50, STATES_NAME: "STATE_LI_IN_DELIVERY", STATES_COMMENT: "In Zustellung",
      STATES_ACTIVE: true, STATES_TYPE: "LI"
    },
    {
      STATES_ID: 60, STATES_NAME: "STATE_LI_PARTLY_DELIVERY", STATES_COMMENT: "Teils geliefert",
      STATES_ACTIVE: true, STATES_TYPE: "LI"
    },
    {
      STATES_ID: 70, STATES_NAME: "STATE_LI_COMPLETLY_DELIVERED", STATES_COMMENT: "Vollständig geliefert",
      STATES_ACTIVE: true, STATES_TYPE: "LI"
    },
    {
      STATES_ID: 80, STATES_NAME: "STATE_RG_OPEN", STATES_COMMENT: "Offen (Rechnung)",
      STATES_ACTIVE: true, STATES_TYPE: "RG"
    },
    {
      STATES_ID: 90, STATES_NAME: "STATE_RG_PARTLY_PAYED", STATES_COMMENT: "Teils bezahlt",
      STATES_ACTIVE: true, STATES_TYPE: "RG"
    },
    {
      STATES_ID: 100, STATES_NAME: "STATE_RG_COMPLETLY_PAYED", STATES_COMMENT: "Vollständig bezahlt",
      STATES_ACTIVE: true, STATES_TYPE: "RG"
    },
    {
      STATES_ID: 110, STATES_NAME: "STATE_AL_CLARIFICATION_REQUIRED", STATES_COMMENT: "Klärung notwendig",
      STATES_ACTIVE: true, STATES_TYPE: "AL"
    },
  ];

  public static STATES_SELECT = [
    {label: 'PLEASE_SELECT', value: undefined},
    {label: 'Storniert (0)', value: 0},
    {label: 'Nicht zugeteilt (0)', value: 0},
    {label: 'Offen (1)', value: 1},
    {label: 'Offen (1)', value: 1},
    {label: 'Teilzugeteilt (2)', value: 2},
    {label: 'Teilweise geliefert (2)', value: 2},
    {label: 'Vollständig Zugeteilt (3)', value: 3},
    {label: 'Geliefert (3)', value: 3},
    {label: 'Offen (Bestellung) (10)', value: 10},
    {label: 'In Bearbeitung (Wartet) (20)', value: 20},
    {label: 'Komplett abgeschlossen (30)', value: 30},
    {label: 'Offen (Lieferschein) (40)', value: 40},
    {label: 'In Zustellung (50)', value: 50},
    {label: 'Teils geliefert (60)', value: 60},
    {label: 'Vollständig geliefert (70)', value: 70},
    {label: 'Offen (Rechnung) (80)', value: 80},
    {label: 'Teils bezahlt (90)', value: 90},
    {label: 'Vollständig bezahlt (100)', value: 100},
    {label: 'Klärung notwendig (110)', value: 110}
  ];

  public static STATES_SELECT_NVs: FormOptionsNVs[] = [
    {name: 'PLEASE_SELECT', value: undefined},
    {name: 'Storniert (0)', value: '0'},
    {name: 'Nicht zugeteilt (0)', value: '0'},
    {name: 'Offen (1)', value: '1'},
    {name: 'Offen (1)', value: '1'},
    {name: 'Teilzugeteilt (2)', value: '2'},
    {name: 'Teilweise geliefert (2)', value: '2'},
    {name: 'Vollständig Zugeteilt (3)', value: '3'},
    {name: 'Geliefert (3)', value: '3'},
    {name: 'Offen (Bestellung) (10)', value: '10'},
    {name: 'In Bearbeitung (Wartet) (20)', value: '20'},
    {name: 'Komplett abgeschlossen (30)', value: '30'},
    {name: 'Offen (Lieferschein) (40)', value: '40'},
    {name: 'In Zustellung (50)', value: '50'},
    {name: 'Teils geliefert (60)', value: '60'},
    {name: 'Vollständig geliefert (70)', value: '70'},
    {name: 'Offen (Rechnung) (80)', value: '80'},
    {name: 'Teils bezahlt (90)', value: '90'},
    {name: 'Vollständig bezahlt (100)', value: '100'},
    {name: 'Klärung notwendig (110)', value: '110'}
  ];

  public static STATES_SELECT_NVn: FormOptionsNVn[] = [
    {name: 'PLEASE_SELECT', value: undefined},
    {name: 'Storniert (0)', value: 0},
    {name: 'Nicht zugeteilt (0)', value: 0},
    {name: 'Offen (1)', value: 1},
    {name: 'Offen (1)', value: 1},
    {name: 'Teilzugeteilt (2)', value: 2},
    {name: 'Teilweise geliefert (2)', value: 2},
    {name: 'Vollständig Zugeteilt (3)', value: 3},
    {name: 'Geliefert (3)', value: 3},
    {name: 'Offen (Bestellung) (10)', value: 10},
    {name: 'In Bearbeitung (Wartet) (20)', value: 20},
    {name: 'Komplett abgeschlossen (30)', value: 30},
    {name: 'Offen (Lieferschein) (40)', value: 40},
    {name: 'In Zustellung (50)', value: 50},
    {name: 'Teils geliefert (60)', value: 60},
    {name: 'Vollständig geliefert (70)', value: 70},
    {name: 'Offen (Rechnung) (80)', value: 80},
    {name: 'Teils bezahlt (90)', value: 90},
    {name: 'Vollständig bezahlt (100)', value: 100},
    {name: 'Klärung notwendig (110)', value: 110}
  ];

  public static STATES_SELECT_ORDER_POSITIONS: FormOptionsNVS[] = [
    {name: 'PLEASE_SELECT', value: undefined, state: undefined},
    {name: 'NOT_ALLOCATED (0)', value: 0, state: 'STATE_POS_NOT_ALLOCATED'},
    {name: 'OPEN (1)', value: 1, state: 'STATE_POS_OPEN'},
    {name: 'PARTIALLY_ALLOCATED (2)', value: 2, state: 'STATE_POS_PARTIALLY_ALLOCATED'},
    {name: 'STATE_POS_COMPLETELY_ALLOCATED (3)', value: 3, state: 'STATE_POS_COMPLETELY_ALLOCATED'}
  ];

  public static STATES_SELECT_LI_POSITIONS: FormOptionsNVS[] = [
    {name: 'PLEASE_SELECT', value: undefined, state: undefined},
    {name: 'OPEN (0)', value: 0, state: 'STATE_POS_LI_OPEN'},
    {name: 'PARTIALLY_DELIVERED (1)', value: 1, state: 'STATE_POS_LI_PARTIALLY_DELIVERED'},
    {name: 'DELIVERED (2)', value: 2, state: 'STATE_POS_LI_DELIVERED'}
  ];

  public static STATES_SELECT_RG_POSITIONS: FormOptionsNVS[] = [
    {name: 'PLEASE_SELECT', value: undefined, state: undefined},
    {name: 'OPEN (0)', value: 0, state: 'STATE_POS_RG_OPEN'},
    {name: 'PAYED (1)', value: 1, state: 'STATE_POS_RG_PAYED'}
  ];

}
