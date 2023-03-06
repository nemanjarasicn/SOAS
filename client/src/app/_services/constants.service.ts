import { Injectable } from "@angular/core";
import { Countries } from "../models/countries";
import { Currencies } from "../models/currencies";
import { PaymentTerms } from "../models/payment-terms";
import { ProdUnits } from "../models/prod_units";
import { Providers } from "../models/providers";
import { Companies } from "../models/companies";
import { ImportType } from "../models/import-type";
import { ImportTypesConstants } from "../models/import-types-constants";
import { ImportTypesRefTables } from "../models/import-types-ref-tables";
import { ProductComponents } from "../models/product-components";
import { DistComponent } from "../models/dist-component";
import { PriceListSales } from "../models/price-list-sales";
import { Warehousing } from "../models/warehousing";
import { Attributes } from "../models/attributes";
import { AttributeNames } from "../models/attribute-names";
import { Taxes } from "../models/taxes";
import { TaxesRate } from "../models/taxesrate";
import { Customer } from "../models/customer";
import { DeliveryNotes } from "../models/delivery-notes";
import { Article } from "../models/article";
import { Invoices } from "../models/invoices";
import { Orders } from "../models/orders";
import { CSVTemplateConfigs } from "../models/csvtemplate-configs.model";
import { CSVTemplateConfigsField } from "../models/csvtemplate-configs-field.model";
import { CustomerAdrr } from "../models/customer-addr";
import { CompaniesLocations } from "../models/companies-locations";
import { DeliveryNotesPositions } from "../models/delivery-notes-positions";
import { InvoicesPositions } from "../models/invoices-positions";
import { OrdersPositions } from "../models/orders-positions";
import { SupplyOrders } from "../models/supply-orders";
import { SupplyOrdersPositions } from "../models/supply-orders-positions";
import { User } from "../models/user";
import { Batch } from "../models/batch";
import { StoragePlaces } from "../models/storagePlaces";
import { Sort } from "../views/custom/custom-table/page";
import { SaleOffers } from "../models/sale-offers";

@Injectable()
export class ConstantsService {
  constructor() {}

  // 'http://192.168.77.57:3000', - Testserver
  // 'http://192.168.77.121:3000' - Liveserver
  readonly SERVER_URL: string = "http://localhost:3000";

  readonly PAGINATOR_MAX_ELEMENTS_MINI: number = 2;
  readonly PAGINATOR_MAX_ELEMENTS_TINY: number = 4;
  readonly PAGINATOR_MAX_ELEMENTS_SMALL: number = 14;
  readonly PAGINATOR_MAX_ELEMENTS_MIDDLE: number = 50;
  readonly PAGINATOR_MAX_ELEMENTS_BIG: number = 100;
  readonly PAGINATOR_ELEMENTS_PER_SIDE: number[] = [14, 20, 25];
  readonly PAGINATOR_ELEMENTS_PER_SIDE_SMALL: number[] = [2, 4, 10];
  readonly PAGINATOR_ELEMENTS_PER_SIDE_THREE: number[] = [3, 6, 12];
  readonly PAGINATOR_ELEMENTS_PER_SIDE_FIVE: number[] = [5, 10, 15];
  readonly PAGINATOR_ELEMENTS_PER_SIDE_MIDDLE: number[] = [7, 14, 30];
  readonly PAGINATOR_ELEMENTS_PER_SIDE_BIG: number[] = [14, 25, 50, 100];

  /* Forms validators patterns */
  readonly PATTERN_NUMBERS: string = "[0-9*]*";
  readonly PATTERN_NUMBERS_ONE_LETTER: string = "[0-9]";
  readonly PATTERN_PRICE: string = "[0-9.,*]*";
  readonly PATTERN_CHARACTERS: string = "[a-zA-Z]*";
  readonly PATTERN_CHARACTERS_UMLAUTS_NUMBERS_SPACE: string =
    "[a-zA-Z0-9À-ÿ€!&$£~ /\\\\\\\\_.:,\\-\\(\\)]*"; // a-zA-Z0129äÄ _-.,()
  readonly PATTERN_EMAIL: string =
    "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  readonly PATTERN_PHONE: string = "[0-9 +/\\\\\\*]*"; // allow 0-9 + / => /\\\

  readonly PATTERN_NUMBERS_0_7: string = "[0-7]"; // 0-7
  readonly PATTERN_NUMBERS_1_12: string = "[1-9]|1[0-2]"; // 1-12
  readonly PATTERN_ONE_STAR: string = "(\\*{1})"; // *

  readonly PATTERN_MONTHS_1_12_AND_STAR: string =
    "^((\\*{1})|[1-9]|1[0-2])\t*$"; // 1-12 and *
  readonly PATTERN_MONTHS_0_7_AND_STAR: string = "^((\\*{1})|[0-7])\t*$"; // 0-7 and *
  readonly PATTERN_DAYS_1_31_AND_STAR: string =
    "^((\\*{1})|[1-9]|(1|2)[0-9]|3[0-1])\t*$"; // 1-31 and *
  readonly PATTERN_HOURS_0_23_AND_STAR: string =
    "^((\\*{1})|[0-9]|1[0-9]|2[0-3])\t*$"; // 0-23 and *
  readonly PATTERN_MINUTES_0_59_AND_STAR: string =
    "^((\\*{1})|[0-9]|(1|2|3|4|5)[0-9])\t*$"; // 0-59 and *
  //readonly PATTERN_MINUTES_00_59_AND_STAR: string = '^((\\*{1})|[0-9]{2}|(1|2|3|4|5)[0-9])\t*$'; // 00-59 and *

  /* Menuitems for the Top navigation an left side navigation */
  readonly NAV_ITEMS = [
    {
      displayName: "HOME",
      iconName: "home",
      route: "home",
      id: "home1",
      click: "",
    },
    {
      displayName: "FILE",
      iconName: "home",
      id: "home12",
      children: [
        {
          displayName: "CLIENT",
          iconName: "group",
          route: "showNewWindow",
          id: "file1",
          click: "",
        },
        {
          displayName: "LOGOUT",
          iconName: "group",
          route: "logout",
          id: "file2",
          click: "",
        },
      ],
      click: "",
    },
    {
      displayName: "ADMIN",
      iconName: "build",
      id: "admin1",
      children: [
        {
          displayName: "USER_MANAGEMENT",
          iconName: "group",
          route: "user_management",
          id: "admin12",
          click: "userManagementClick()",
        },
        {
          displayName: "PERMISSIONS_MANAGEMENT",
          iconName: "supervised_user_circle",
          route: "permissions_management",
          id: "admin13",
          click: "",
        },
        {
          displayName: "SETTINGS_USER",
          iconName: "settings",
          route: "settings_user",
          id: "admin14",
          click: "",
        },
        {
          displayName: "REMOVE_TABLE_LOCKS",
          iconName: "table_chart",
          route: "remove_tablelocks",
          id: "admin15",
          click: "",
        },
        {
          displayName: "EMPTY_LOCAL_STORAGE",
          iconName: "remove_circle",
          route: "empty-local-storage",
          id: "admin16",
          click: "",
        },
        {
          displayName: "TEST",
          iconName: "bug_report",
          route: "test",
          id: "admin17",
          click: ""
        }
      ],
      click: "",
    },
    {
      displayName: "OPEN",
      iconName: "folder_open",
      id: "open1",
      children: [
        {
          displayName: "CSV_IMPORT",
          iconName: "import_export",
          route: "csv_import",
          id: "open12",
          click: "csvImportClick()",
        },
        {
          displayName: "API_IMPORT",
          iconName: "supervised_user_circle",
          route: "api_import",
          id: "open13",
          click: "",
        },
        {
          displayName: "API_CONFIG",
          iconName: "settings",
          route: "api_config",
          id: "open14",
          click: "",
        },
      ],
      click: "",
    },
    {
      displayName: "BATCH",
      iconName: "create",
      id: "batch1",
      children: [
        {
          displayName: "BATCHSERVER_CONFIG",
          iconName: "shutter_speed",
          route: "batchserver_config",
          id: "batch12",
          click: "",
        },
        // {
        //   displayName: 'BATCHSERVER_PROCESS',
        //   iconName: 'timer',
        //   route: 'batchserver_process',
        //   id: 'batch13',
        //   click: ''
        // }
      ],
      click: "",
    },
    {
      displayName: "ABOUT",
      iconName: "info",
      id: "about1",
      children: [
        {
          displayName: "INFO",
          iconName: "info",
          route: "info",
          id: "about12",
          click: "",
        },
      ],
      click: "",
    },
  ];

  readonly MENU_ITEMS = [
    {
      title: "ADMINISTRATION",
      menuItems: [
        {
          id: "masterData1",
          type: "expanel",
          title: "MASTER_DATA",
          refTable: "masterData",
          menuItems: [
            {
              id: "attributeNames234",
              type: "button",
              title: "ATTRIBUTES",
              refTable: "attributeNames",
              icon: "info"
            },
          ],
        } /*{
          id: 'incommingGoods1',
          title: 'INCOMMING_GOODS',
          refTable: 'components'
        }*/,
      ],
    },
    {
      title: "PURCHASING",
      menuItems: [
        {
          id: "providers1",
          type: "button",
          title: "PROVIDER",
          refTable: "providers",
          icon: "add_shopping_cart"
        },
        /*{
          title: 'PRICELISTS_PURCHASE',
          refTable: 'pricelistPurchase'
        },*/ {
          id: "orders1",
          type: "button",
          title: "ORDERS",
          refTable: "supplyOrders",
          icon: "assignment"
        } /*,{
          title: 'INCOMMING_GOODS',
          refTable: 'stockedIn'
        }*/,
      ],
    },
    {
      title: "SALE",
      menuItems: [
        {
          id: "providers2",
          type: "button",
          title: "PROVIDER",
          refTable: "providers",
          icon: "production_quantity_limits"
        },
        {
          id: "priceListSales1",
          type: "button",
          title: "PRICELISTS_SALES",
          refTable: "priceListSales",
          icon: "euro"
        },
        {
          id: "saleOffers1",
          type: "button",
          title: "SALE_OFFERS",
          refTable: "saleOffers",
          icon: "local_offer"
        },
      ],
    },
    {
      title: "AVISE",
      menuItems: [
        {
          id: "orders2",
          type: "button",
          title: "ORDERS",
          refTable: "orders",
          icon: "receipt"
        },
        {
          id: "deliveryNote1",
          type: "button",
          title: "DELIVERY_NOTES",
          refTable: "deliveryNote",
          icon: "local_shipping"
        },
        {
          id: "invoice1",
          type: "button",
          title: "INVOICE",
          refTable: "invoice",
          icon: "local_atm"
        },
        {
          id: "reCrediting1",
          type: "button",
          title: "CREDIT_VOUCHERS",
          refTable: "reCrediting",
          icon: "discount"
        },
      ],
    },
  ];

  readonly MENU_SUBITEMS = [
    {
      title: "MASTER_DATA",
      menuItems: [
        {
          id: "custbtwoc1",
          type: "button",
          title: "CUSTOMERB2C",
          refTable: "custbtwoc",
          icon: "account_circle"
        },
        {
          id: "custbtwob1",
          type: "button",
          title: "CUSTOMERB2B",
          refTable: "custbtwob",
          icon: "manage_accounts"
        },
        {
          id: "articles1",
          type: "button",
          title: "ARTICLE",
          refTable: "articles",
          icon: "inventory"
        },
        {
          id: "articleComponents1",
          type: "button",
          title: "ARTICLE_COMPONENTS",
          refTable: "components",
          icon: "extension"
        },
        {
          id: "currencies1",
          type: "button",
          title: "CURRENCIES",
          refTable: "currencies",
          icon: "currency_exchange"
        },
        {
          id: "countries1",
          type: "button",
          title: "COUNTRIES",
          refTable: "countries",
          icon: "location_city"
        },
        {
          id: "attributeNames1",
          type: "button",
          title: "ATTRIBUTES",
          refTable: "attributeNames",
          icon: "category"
        },
        {
          id: "paymentTerms1",
          type: "button",
          title: "PAYMENT_TERMS",
          refTable: "paymentTerms",
          icon: "payment"
        },
        {
          id: "prodUnits1",
          type: "button",
          title: "PROD_UNITS",
          refTable: "prodUnits",
          icon: "engineering"
        },
        {
          id: "csvTemplateConfig1",
          type: "csvButton",
          title: "CSV_TEMPLATE_CONFIG",
          refTable: "csvTemplateConfig",
          icon: "grading"
        },
        {
          id: "companies1",
          type: "button",
          title: "COMPANIES",
          refTable: "companies",
          icon: "apartment"
        },
        {
          id: "taxes1",
          type: "button",
          title: "Taxes",
          refTable: "taxes",
          icon: "point_of_sale"
        },
      ],
    },
    {
      title: "WAREHOUSING",
      menuItems: [
        {
          id: "warehousing1",
          type: "button",
          title: "WAREHOUSING",
          refTable: "warehousing",
          icon: "warehouse"
        },
        {
          id: "storagePlaces",
          type: "button",
          title: "STORAGE PLACES",
          refTable: "warehousingLoc",
          icon: "window"
        },
        {
          id: "stockTransfer1",
          type: "button",
          title: "STOCK_TRANSFER",
          refTable: "dialogStockTransfer",
          icon: "output"
        },
      ],
    },
    {
      title: "PRODUCTION",
      menuItems: [
        {
          id: "warehousing1",
          type: "button",
          title: "PRODUCTION_PARTS_LISTS",
          refTable: "prodComponents",
          icon: "settings_input_component"
        },
      ],
    },
  ];

  readonly MENU_CHILDSUBITEMS = [
    {
      title: "CSV_TEMPLATE_CONFIG",
      menuItems: [
        {
          id: "csvTemplateConfig2",
          type: "button",
          title: "CSV_TEMPLATE_CONFIG",
          refTable: "csvTemplateConfig",
          icon: "segment"
        },
        {
          id: "importTypes1",
          type: "button",
          title: "IMPORT_TYPES",
          refTable: "importTypes",
          icon: "rule"
        },
        {
          id: "importTypesRefTables1",
          type: "button",
          title: "IMPORT_TYPES_REF_TABLES",
          refTable: "importTypesRefTables",
          icon: "table_view"
        },
        {
          id: "importTypeConstants1",
          type: "button",
          title: "IMPORT_TYPE_CONSTANTS",
          refTable: "importTypeConstants",
          icon: "input"
        },
      ],
    },
  ];

  /* localStorage variables */
  readonly LS_ACCESS_TOKEN: string = "access_token";
  readonly LS_LOCALIZE: string = "localize";
  readonly LS_LANGUAGE: string = "language";
  readonly LS_USERNAME: string = "username";
  readonly LS_ROLE: string = "role";
  readonly LS_SEL_CUSTOMERS_NUMBER: string = "selCustomerNumber";
  readonly LS_SEL_PARTNER_NUMBER: string = "selPartnerNumber";
  readonly LS_SEL_ITEM_NUMBER: string = "selItemNumber";
  readonly LS_SEL_ITEM_ID: string = "selItemId";
  readonly LS_SEL_REF_TABLE: string = "selRefTable";
  readonly LS_SEL_DETAILS_REF_TABLES: string = "selDetailsRefTables";
  readonly LS_SEL_DETAILS_REF_TABLES_JSON_TYPES: {
    custbtwoc: string,
    custbtwob: string,
    orders: string,
    deliveryNote: string,
    invoices: string
  } = {
    custbtwoc: 'custbtwoc',
    custbtwob: 'custbtwob',
    orders: 'orders',
    deliveryNote: 'deliveryNote',
    invoices: 'invoices'
  };

  readonly LS_SEL_WH_LOCATION_NAME: string = "selWhLocationName";
  readonly LS_SEL_PAYMENT_TERM_ID: string = "selPaymentTermId";
  readonly LS_SEL_PROVIDERS_NAME: string = "selProvidersName";
  readonly LS_SEL_COMPONENTS_ID: string = "selComponentsId";
  readonly LS_SEL_COMPONENTS_ITEM_NUMBER: string = "selComponentsItmnum";
  readonly LS_SEL_COMPONENTS_COMPNUM: string = "selComponentsCompnum";
  readonly LS_SEL_COMPONENTS_DETAILS_ID: string = "selComponentsDetailsId";
  readonly LS_SEL_COMPONENTS_DETAILS_CSV_ID: string =
    "selComponentsDetailsCsvId";
  readonly LS_SEL_CUSTOMER_ADDRESSES_DLV_ID: string = "selCustomerAddrDlvId";
  readonly LS_SEL_CUSTOMER_ADDRESSES_INV_ID: string = "selCustomerAddrInvId";
  readonly LS_SEL_PARTNER_ADDRESSES_DLV_ID: string = "selPartnerAddrDlvId";
  readonly LS_SEL_PARTNER_ADDRESSES_INV_ID: string = "selPartnerAddrInvId";
  readonly LS_SEL_ORDERS_NUMBER: string = "selOrdersNumber";
  readonly LS_SEL_ORDERS_PROV_ORDERS: string = "selOrdersProvOrders";
  readonly LS_SEL_ORDERS_POSITION_ID: string = "selOrdersPositionId";
  readonly LS_SEL_SUPPLY_ORDERS_NUMBER: string = "selSupplyOrdersNumber";
  readonly LS_SEL_SUPPLY_ORDERS_POSITION_ID: string =
    "selSupplyOrdersPositionId";
  // DETAIL_ID ?!
  readonly LS_SEL_SUPPLY_ORDERS_POSITION_PROV_ORDERS: string =
    "selSupplyOrdersPositionProvOrders";
  // customer or partner number of selected order
  readonly LS_SEL_ORDERS_CUST_OR_PART_NUMBER: string = "selOrdersCOPNumber";
  readonly LS_SEL_ORDERS_CLIENT: string = "selOrdersClient";
  readonly LS_SEL_DLV_NOTES_NUMBER: string = "selDlvNumber";
  // customer or partner number of selected delivery note
  readonly LS_SEL_DLV_NOTES_CUST_OR_PART_NUMBER: string = "selDlvCOPNumber";
  readonly LS_SEL_DLV_NOTES_POSITION_ID: string = "selDlvPositionId";
  readonly LS_SEL_INVOICE_NUMBER: string = "selInvNumber";
  // customer or partner number of selected invoice
  readonly LS_SEL_INVOICE_CUST_OR_PART_NUMBER: string = "selInvCOPNumber";
  readonly LS_SEL_INVOICE_POSITION_ID: string = "selInvPositionId";
  readonly LS_SEL_CURRENCY_ID: string = "selCurrencyId";
  readonly LS_SEL_COUNTRY_ID: string = "selCountryId";
  readonly LS_SEL_PRICELISTS_ITEM_NUMBER: string = "selPricelistsItem";
  // readonly LS_SEL_PRICELISTS_ID: string = "selPricelistsId";
  readonly LS_SEL_PRICELISTS_DETAIL_ID: string = "selPricelistsDetailId";
  readonly LS_SEL_PRICELISTS_PRILIST: string = "selPricelistsPrilist";
  readonly LS_SEL_PRICELISTS_CUSGRP: string = "selPricelistsCusgrp";
  readonly LS_SEL_STORAGE_PLACES_ID: string = "selStoragePlacesId";
  readonly LS_SEL_STORAGE_PLACES_NUMBER: string = "selStoragePlacesNumber";
  readonly LS_SEL_WAREHOUSING_ITEM_NUMBER: string = "selWarehousingItem";
  readonly LS_SEL_WAREHOUSING_LOT: string = "selWarehousingLot";
  readonly LS_SEL_WAREHOUSING_ID: string = "selWarehousingId";
  readonly LS_SEL_WAREHOUSING_DETAIL_ID: string = "selWarehousingDetailId";
  readonly LS_SEL_ATTRIBUTE_NAMES_ID: string = "selAttributeNamesId";
  readonly LS_SEL_ATTRIBUTE_NAMES_NAME: string = "selAttributeNamesName";
  readonly LS_SEL_ATTRIBUTES_ID: string = "selAttributesId";
  readonly LS_SEL_PRODUCT_COMPONENTS_ITEM_NUMBER: string =
    "selProductComponentItem";
  readonly LS_SEL_PRODUCT_COMPONENTS_COMPNUM: string =
    "selProductComponentCompnum";
  readonly LS_SEL_PRODUCT_UNITS_ITEM_NAME: string = "selProductUnitItem";
  // readonly LS_SEL_COMPONENTS_ITEM_NUMBER: string = 'selComponentsITMNUM';
  readonly LS_SEL_CSV_TEMPLATE_CONFIG: string = "selCsvTemplateConfig";
  readonly LS_SEL_CSV_TEMPLATE_CONFIG_ID: string = "selCsvTemplateConfigId";
  readonly LS_SEL_CSV_TEMPLATE_CONFIG_NAME: string = "selCsvTemplateConfigName";
  readonly LS_SEL_IMPORT_TYPE_ID: string = "selImportTypeId";
  readonly LS_SEL_IMPORT_TYPE_REF_TABLES_ID: string =
    "selImportTypeRefTablesId";
  readonly LS_SEL_IMPORT_TYPE_CONSTANTS_ID: string = "selImportTypeConstantsId";
  readonly LS_SEL_COMPANY: string = "selCompany";
  readonly LS_SEL_COMPANY_LOCATION: string = "selCompanyLocation";

  readonly LS_SEL_TAXES: string = "selTaxes";
  readonly LS_SEL_TAXESRATE: string = "selTaxesRate";
  readonly LS_SEL_TAXES_TAXCODE: string = "selTaxesTaxcode";
  readonly LS_SEL_TAXESRATE_ID: string = "selTaxesRateId";



  readonly LS_SEL_SALE_OFFERS_NUMBER: string = "selSaleOffersNumber";
  readonly LS_SEL_SALE_OFFERS_CUST_OR_PART_NUMBER: string = "selSaleOffersCOPNumber";
  readonly LS_SEL_SALE_OFFERS_CLIENT: string = "selSaleOffersClient";


  readonly LS_SEL_COMMENT_NUMBER: string = "selCommentNumber";
  // customer or partner number of selected comment
  readonly LS_SEL_COMMENT_CUST_OR_PART_NUMBER: string = "selCommentCOPNumber";

  /*  */
  readonly CREATE_ADDRESS_TITLE: string = "NEW_ADDRESS";
  readonly CREATE_ADDRESS_TOOLTIP: string = "ADD_NEW_CUSTOMER";
  readonly CREATE_ORDER_POSITION: string = "NEW_POSITION";

  /* universal id for all items / users  */
  readonly UNIVERSAL_ID_PLACEHOLDER: string = "00000000000000";
  // readonly CUSTOMER_B2C_PLACEHOLDER: string = "SOASCUSB2C00000";
  // readonly CUSTOMER_B2B_PLACEHOLDER: string = "SOASCUSB2B00000";

  /* reftable names */
  readonly REFTABLE_ORDERS: string = "orders";
  readonly REFTABLE_ORDERS_COLUMN: string = "ORDERS_NUMBER";
  readonly REFTABLE_ORDERS_TITLE: string = "ORDERS";
  readonly REFTABLE_ORDERS_DETAILS_TITLE: string = "ORDER_DETAILS";
  readonly REFTABLE_ORDERS_CUS_COLUMN: string = "CUSTOMER_ORDER";
  readonly REFTABLE_ORDERS_PAYMENT_TERM_ID: string = "PAYMENT_TERM_ID";
  readonly REFTABLE_ORDERS_POSITIONS = "orderPosition";
  readonly REFTABLE_ORDERS_POSITIONS_TITLE = "ORDER_POSITIONS";
  readonly REFTABLE_ORDERS_POSITIONS_COLUMN: string = "ORDERS_NUMBER";
  readonly REFTABLE_ORDERS_POSITIONS_ID: string = "ITMNUM";
  readonly REFTABLE_ORDERS_POSITIONS_ROW_ID: string = "ID";
  readonly REFTABLE_ORDERS_CUSTOMER_ORDERREF_COLUMN: string =
    "CUSTOMER_ORDERREF";
  readonly REFTABLE_SUPPLY_ORDERS: string = "supplyOrders";
  readonly REFTABLE_SUPPLY_ORDERS_COLUMN: string = "ORDERREF";
  readonly REFTABLE_SUPPLY_ORDERS_TITLE: string = "SUPPLY_ORDERS";
  readonly REFTABLE_SUPPLY_ORDERS_DETAILS_TITLE: string =
    "SUPPLY_ORDER_DETAILS";
  readonly REFTABLE_SUPPLY_ORDERS_PROV_COLUMN: string = "PROVIDERS_ORDER";
  readonly REFTABLE_SUPPLY_ORDERS_POSITIONS = "supplyOrdersPosition";
  readonly REFTABLE_SUPPLY_ORDERS_POSITIONS_TITLE = "SUPPLY_ORDERS_POSITIONS";
  readonly REFTABLE_SUPPLY_ORDERS_POSITIONS_COLUMN: string = "PROVIDERS_ORDER";
  readonly REFTABLE_SUPPLY_ORDERS_POSITIONS_ID: string = "ITMNUM";
  readonly REFTABLE_SUPPLY_ORDERS_POSITIONS_ROW_ID: string = "ID";

  readonly REFTABLE_ORDERS_CLIENT_COLUMN: string = "CLIENT";
  readonly REFTABLE_ORDERS_RELEASE_COLUMN: string = "RELEASE"; // is same column name for delivery notes and invoices
  readonly REFTABLE_CUSTOMER: string = "custbtwoc";
  readonly REFTABLE_CUSTOMER_COLUMN: string = "CUSTOMERS_NUMBER";
  readonly REFTABLE_CUSTOMER_TITLE: string = "CUSTOMERS";
  readonly REFTABLE_CUSTOMER_CUS_TITLE: string = "CUSTOMER_DETAILS";
  readonly REFTABLE_CUSTOMER_CUSTOMERS_TYPE: string = "CUSTOMERS_TYPE";
  readonly REFTABLE_CUSTOMER_ADDRESS_TITLE: string = "CUSTOMERS_ADDRESSES";
  readonly REFTABLE_CUSTOMER_ADDRESS_DLV: string = "customersAddrDlv"; //'customersAddr';
  readonly REFTABLE_CUSTOMER_ADDRESS_DLV_COLUMN: string = "DLV"; //'DLVA';
  readonly REFTABLE_CUSTOMER_ADDRESS_DLV_TITLE: string = "ADDRESS_DELIVERIES";
  readonly REFTABLE_CUSTOMER_ADDRESS_DLV_ID: string = "ID";
  readonly REFTABLE_CUSTOMER_ADDRESS_INV: string = "customersAddrInv"; //'customersAddr';
  readonly REFTABLE_CUSTOMER_ADDRESS_INV_COLUMN: string = "INV"; //'INVA';
  readonly REFTABLE_CUSTOMER_ADDRESS_INV_TITLE: string = "ADDRESS_INVOICES";
  readonly REFTABLE_CUSTOMER_ADDRESS_INV_ID: string = "ID";
  readonly REFTABLE_CUSTOMER_ADDRESS_ADDRESS_TYPE: string = "ADDRESS_TYPE";
  readonly REFTABLE_CUSTOMER_ADDRESS_ADDRESS_COMMENT_COLUMN: string =
    "ADDRESS_COMMENT";
  readonly REFTABLE_DELIVERY_NOTES: string = "deliveryNote";
  readonly REFTABLE_DELIVERY_NOTES_TITLE: string = "DELIVERY_NOTES";
  readonly REFTABLE_DELIVERY_NOTE_TITLE: string = "DELIVERY_NOTE";
  readonly REFTABLE_DELIVERY_NOTE_DETAILS_TITLE: string =
    "DELIVERY_NOTES_DETAILS";
  readonly REFTABLE_DELIVERY_NOTES_COLUMN: string = "DELIVERY_NOTES_NUMBER";
  readonly REFTABLE_DELIVERY_NOTES_CUS_COLUMN: string = "CUSTOMERS_NUMBER";
  readonly REFTABLE_DELIVERY_NOTES_POSITIONS: string = "deliveryNotePositions";
  readonly REFTABLE_DELIVERY_NOTES_POSITIONS_COLUMN: string = "ORDERS_NUMBER";
  readonly REFTABLE_DELIVERY_NOTES_POSITIONS_TITLE: string =
    "DELIVERY_NOTES_POSITIONS";
  readonly REFTABLE_DELIVERY_NOTES_POSITIONS_ID: string = "ITMNUM";
  readonly REFTABLE_INVOICE: string = "invoice";
  readonly REFTABLE_INVOICE_COLUMN: string = "INVOICES_NUMBER";
  readonly REFTABLE_INVOICE_CUS_COLUMN: string = "INVOICES_CUSTOMER";
  readonly REFTABLE_INVOICES_TITLE: string = "INVOICES";
  readonly REFTABLE_INVOICE_TITLE: string = "INVOICE";
  readonly REFTABLE_INVOICE_DETAILS_TITLE: string = "INVOICE_DETAILS";
  readonly REFTABLE_INVOICE_POSITIONS: string = "invoicePositions";
  readonly REFTABLE_INVOICE_POSITIONS_COLUMN: string = "INVOICES_CUSTOMER";
  readonly REFTABLE_INVOICE_POSITIONS_TITLE: string = "INVOICES_POSITIONS";
  readonly REFTABLE_INVOICE_POSITIONS_ID: string = "ITMNUM";
  readonly REFTABLE_COMMENTS: string = "comments";
  readonly REFTABLE_COMMENTS_TITLE: string = "COMMENTS";
  readonly REFTABLE_COMMENTS_COLUMN: string = "CUSTOMERS_NUMBER";
  readonly REFTABLE_COMMENTS_DETAILS_TITLE: string = "COMMENT_DETAILS";
  readonly REFTABLE_ARTICLES: string = "articles";
  readonly REFTABLE_ARTICLES_TITLE: string = "ITEM_BASIS";
  readonly REFTABLE_ARTICLES_COLUMN: string = "ITMNUM";
  readonly REFTABLE_ARTICLES_EANCOD: string = "EANCOD";
  readonly REFTABLE_ARTICLES_SECONDARY_COLUMN: string = "ID";
  readonly REFTABLE_COMPONENTS: string = "components";
  readonly REFTABLE_COMPONENTS_TITLE: string = "DIST_COMPONENTS";
  readonly REFTABLE_COMPONENTS_ID_COLUMN: string = "ID";
  readonly REFTABLE_COMPONENTS_PRIMARY_COLUMN: string = "ITMNUM";
  readonly REFTABLE_COMPONENTS_SECONDARY_COLUMN: string = "COMPNUM";
  readonly REFTABLE_COMPONENTS_DETAILS: string = "componentsDetails";
  readonly REFTABLE_PARTNERS: string = "custbtwob";
  readonly REFTABLE_PARTNERS_ADDRESS_DLV_ID: string = "ID";
  readonly REFTABLE_PARTNERS_ADDRESS_INV_ID: string = "ID";
  readonly REFTABLE_USERS: string = "users";
  readonly REFTABLE_WAREHOUSE_STOCK: string = "whstock";
  readonly REFTABLE_WAREHOUSE_LOCATIONS: string = "whlocation";
  readonly REFTABLE_CROSSELLING: string = "crossSelling";
  readonly REFTABLE_RE_CREDITING: string = "reCrediting";
  readonly REFTABLE_PROVIDERS: string = "providers";
  readonly REFTABLE_PROVIDERS_TITLE: string = "PROVIDERS";
  readonly REFTABLE_PROVIDERS_COLUMN: string = "PROVIDERS_NAME";
  readonly REFTABLE_PROVIDERS_TAX_NUMBER: string = "TAX_NUMBER";
  readonly REFTABLE_STOCKED_IN: string = "stockedIn";
  readonly REFTABLE_PRILISTS: string = "priceListSales";
  readonly REFTABLE_PRILISTS_TITLE: string = "PRILISTS";
  readonly REFTABLE_PRILISTS_COLUMN: string = "ITMNUM";
  readonly REFTABLE_PRILISTS_COLUMN_ID: string = "ID";
  readonly REFTABLE_PRILISTS_COLUMN_CURRENCY: string = "CURRENCY";
  readonly REFTABLE_PRILISTS_COLUMN_PRILIST: string = "PRILIST";
  readonly REFTABLE_PRILISTS_COLUMN_CUSGRP: string = "CUSGRP";
  readonly REFTABLE_PRILISTS_DETAILS: string = "priceListSalesDetails";
  readonly REFTABLE_CURRENCIES: string = "currencies";
  readonly REFTABLE_CURRENCIES_TITLE: string = "CURRENCIES";
  readonly REFTABLE_CURRENCIES_COLUMN: string = "CURRENCY_ID";
  readonly REFTABLE_CURRENCIES_NAME_COLUMN: string = "CURRENCY_NAME";
  readonly REFTABLE_CURRENCIES_ISO_COLUMN: string = "CURRENCY_ISO_CODE";
  readonly REFTABLE_TABLELOCKS: string = "tablelocks";
  readonly REFTABLE_TABLELOCKS_TITLE: string = "TABLELOCKS";
  readonly REFTABLE_TABLELOCKS_DATASET_COLUMN: string = "LOCKED_DATASET";
  readonly REFTABLE_TABLELOCKS_TABLE_COLUMN: string = "TABLENAME";
  readonly REFTABLE_TABLELOCKS_LOCKED_BY_COLUMN: string = "LOCKED_BY";
  readonly REFTABLE_TABLELOCKS_LOCKED_COLUMN: string = "LOCKED";
  readonly REFTABLE_LANGUAGES: string = "languages";
  readonly REFTABLE_PAYMENT_TERMS: string = "paymentTerms";
  readonly REFTABLE_PAYMENT_TERMS_TITLE: string = "PAYMENT_TERMS";
  readonly REFTABLE_PAYMENT_TERMS_COLUMN: string = "PAYMENT_TERM_ID";
  readonly REFTABLE_COUNTRIES: string = "countries";
  readonly REFTABLE_COUNTRIES_TITLE: string = "COUNTRIES";
  readonly REFTABLE_COUNTRIES_COLUMN: string = "COUNTRY_ID";
  readonly REFTABLE_COUNTRIES_NAME_COLUMN: string = "COUNTRY_NAME";
  readonly REFTABLE_COUNTRIES_ISO_COLUMN: string = "COUNTRY_ISO_CODE";
  readonly REFTABLE_ATTRIBUTES: string = "attributes";
  readonly REFTABLE_ATTRIBUTES_TITLE: string = "ATTRIBUTES";
  readonly REFTABLE_ATTRIBUTES_COLUMN_ID: string = "ID";
  readonly REFTABLE_ATTRIBUTES_COLUMN_NAME: string = "ATTRIBUTE_NAME";
  readonly REFTABLE_ATTRIBUTE_RELATIONS: string = "attributeRelations";
  readonly REFTABLE_ATTRIBUTE_RELATIONS_TITLE: string = "ATTRIBUTE_RELATIONS";
  readonly REFTABLE_ATTRIBUTE_ID: string = "ATTRIBUTE_ID";
  readonly REFTABLE_ATTRIBUTE_NAMES: string = "attributeNames";
  readonly REFTABLE_ATTRIBUTE_NAMES_TITLE: string = "ATTRIBUTE_NAMES";
  readonly REFTABLE_ATTRIBUTE_NAMES_COLUMN_ID: string = "ID";
  readonly REFTABLE_ATTRIBUTE_NAMES_COLUMN_NAME: string = "ATTRIBUTE_NAME";
  // virtual table to get tax code from server by customer number
  readonly REFTABLE_TAXATION_RELATIONS: string = "taxationRelations";
  readonly REFTABLE_WAREHOUSING: string = "warehousing";
  readonly REFTABLE_WAREHOUSING_TITLE: string = "WAREHOUSING";
  readonly REFTABLE_WAREHOUSING_COLUMN: string = "ITMNUM";
  readonly REFTABLE_WAREHOUSING_COLUMN_LOT: string = "LOT";
  readonly REFTABLE_WAREHOUSING_COLUMN_ID: string = "ID";
  readonly REFTABLE_WAREHOUSING_DETAILS: string = "warehousingDetails";
  readonly REFTABLE_STORAGE_PLACES: string = "warehousingLoc";
  readonly REFTABLE_STORAGE_PLACES_TITLE: string = "WAREHOUSING_LOC";
  readonly REFTABLE_STORAGE_PLACES_COLUMN: string = "ID";
  readonly REFTABLE_STORAGE_PLACES_LOC_COLUMN: string = "LOC";
  readonly REFTABLE_CROSSELLING_ID: string = "CROSSSELLING";
  readonly REFTABLE_PRODUCT_COMPONENTS: string = "prodComponents";
  readonly REFTABLE_PRODUCT_COMPONENTS_COLUMN: string = "ITMNUM";
  readonly REFTABLE_PRODUCT_COMPONENTS_COMPNUM: string = "COMPNUM";
  readonly REFTABLE_PRODUCT_COMPONENTS_TITLE: string = "PROD_COMPONENTS";
  readonly REFTABLE_PRODUCT_COMPONENTS_COLUMN_PROD_UNIT: string = "PROD_UNIT";
  readonly REFTABLE_PRODUCT_COMPONENTS_DETAILS: string =
    "prodComponentsDetails";
  readonly REFTABLE_PRODUCT_UNITS: string = "prodUnits";
  readonly REFTABLE_PRODUCT_UNITS_TITLE: string = "PROD_UNITS";
  readonly REFTABLE_PRODUCT_UNITS_COLUMN: string = "PROD_UNIT_NAME";
  readonly REFTABLE_CSV_TEMPLATE_CONFIG: string = "csvTemplateConfig";
  readonly REFTABLE_CSV_TEMPLATE_CONFIG_TITLE: string = "CSV_TEMPLATE_CONFIG";
  readonly REFTABLE_CSV_TEMPLATE_CONFIG_CTCNUM: string = "CTCNUM";
  readonly REFTABLE_CSV_TEMPLATE_CONFIG_COLUMN: string = "CSVCONFIG_ID";
  readonly REFTABLE_CSV_TEMPLATE_CONFIG_NAME_COLUMN: string = "CSVCONFIG_NAME";
  readonly REFTABLE_CSV_TEMPLATE_CONFIG_TYPE_COLUMN: string = "CSVCONFIG_TYPE";
  readonly REFTABLE_IMPORT_TYPES: string = "importTypes";
  // readonly REFTABLE_IMPORT_TYPES_CTCNUM: string = 'IMPNUM';
  readonly REFTABLE_IMPORT_TYPES_TITLE: string = "IMPORT_TYPE";
  readonly REFTABLE_IMPORT_TYPES_COLUMN: string = "ID";
  readonly REFTABLE_IMPORT_TYPES_NAME_COLUMN: string = "IMPORT_TYPE_NAME";
  readonly REFTABLE_IMPORT_TYPES_ACTIVE_COLUMN: string = "ACTIVE";
  readonly REFTABLE_IMPORT_TYPES_REF_TABLES: string = "importTypesRefTables";
  readonly REFTABLE_IMPORT_TYPES_REF_TABLES_TITLE: string =
    "IMPORT_TYPE_REF_TABLES";
  readonly REFTABLE_IMPORT_TYPES_REF_TABLES_COLUMN: string = "ID";
  readonly REFTABLE_IMPORT_TYPES_REF_TABLES_ID_COLUMN: string =
    "IMPORT_TYPE_ID";
  readonly REFTABLE_IMPORT_TYPES_REF_TABLES_REF_TABLE_COLUMN: string =
    "REFERENCED_TABLE";
  readonly REFTABLE_IMPORT_TYPE_CONSTANTS: string = "importTypeConstants";
  readonly REFTABLE_IMPORT_TYPE_CONSTANTS_TITLE: string =
    "IMPORT_TYPE_CONSTANTS";
  readonly REFTABLE_IMPORT_TYPE_CONSTANTS_COLUMN: string = "ID";
  readonly REFTABLE_IMPORT_TYPE_CONSTANTS_COLUMN_COLUMN: string = "COLUMN_NAME";
  // readonly REFTABLE_IMPORT_TYPES_CONSTANTS_COLUMN_COLUMN_ACTIVE: string =
  //   'COLUMN_ACTIVE';
  readonly REFTABLE_IMPORT_TYPE_CONSTANTS_IMP_TYPE_REF_TABLE_COLUMN: string =
    "IMPORT_TYPE_REFERENCED_TABLES_ID";

  readonly REFTABLE_CSV_TEMPLATE_CONFIG_FIELD_TITLE: string =
    "csvTemplateConfigField";
  readonly REFTABLE_CSV_TEMPLATE_CONFIG_FIELD_COLUMN: string =
    "CSV_TEMPLATE_CONFIG_ID";

  readonly REFTABLE_CSV_TEMPLATE_CONFIG_FIELD_TMP_TITLE: string =
    "csvTemplateConfigFieldTmp";

  readonly VIRTUAL_REFTABLE_ARTICLES_ATTRIBUTES: string = "articlesAttributes";
  readonly VIRTUAL_REFTABLE_ARTICLES_ATTRIBUTES_TITLE: string =
    "ITEM_BASIS_ATTRIBUTES";
  readonly REFTABLE_STATES: string = "states";

  readonly REFTABLE_COMPANIES: string = "companies";
  readonly REFTABLE_COMPANIES_TITLE: string = "companies";
  readonly REFTABLE_COMPANIES_COLUMN: string = "COMPANY";
  readonly REFTABLE_COMPANIES_DESCRIPTION_COLUMN: string = "DESCRIPTION";
  readonly REFTABLE_COMPANIES_INTERCOMPANY_CONNECTION_COLUMN: string =
    "INTERCOMPANY_CONNECTION";

  readonly REFTABLE_SALE_OFFERS: string = "saleOffers";
  readonly REFTABLE_SALE_OFFERS_COLUMN: string = "OFFER_NUMBER";
  readonly REFTABLE_SALE_OFFERS_TITLE: string = "SALE_OFFERS";
  readonly REFTABLE_SALE_OFFERS_DETAILS_TITLE: string = "SALE_OFFER_DETAILS";
  readonly REFTABLE_SALE_OFFERS_CUS_COLUMN: string = "CUSTOMER_ORDER";
  readonly REFTABLE_SALE_OFFERS_CLIENT_COLUMN: string = "CLIENT";

  readonly REFTABLE_SALE_OFFERS_POSITIONS = "saleOffersPosition";
  readonly REFTABLE_SALE_OFFERS_POSITIONS_TITLE = "SALE_OFFERS_POSITIONS";
  readonly REFTABLE_SALE_OFFERS_POSITIONS_COLUMN: string = "ORDERS_NUMBER";
  readonly REFTABLE_SALE_OFFERS_POSITIONS_ID: string = "ITMNUM";
  readonly REFTABLE_SALE_OFFERS_POSITIONS_ROW_ID: string = "ID";


  readonly REFTABLE_TAXES: string = "taxes";
  readonly REFTABLE_TAXES_COLUMN: string = "TAXCODE";
  readonly REFTABLE_TAXES_DESCRIPTION: string = "DESCRIPTION";
  readonly REFTABLE_TAXES_TITLE: string = "TAXES";

  readonly REFTABLE_TAXESRATE: string = "taxesRate";
  readonly REFTABLE_TAXESRATE_COLUMN: string = "TAXCODE";
  // readonly REFTABLE_TAXESRATE_TAXRATE: string = "TAXRATE";
  readonly REFTABLE_TAXESRATE_TITLE: string = "TAXESRATE";
  readonly REFTABLE_TAXESRATE_PER_END_COLUMN: string = "PER_END";
  readonly REFTABLE_TAXESRATE_TAXRATE_COLUMN: string = "TAXRATE";

  readonly REFTABLE_COMPANIES_LOCATIONS: string = "companiesLocations";
  readonly REFTABLE_COMPANIES_LOCATIONS_TITLE: string = "companiesLocations";
  readonly REFTABLE_COMPANIES_LOCATIONS_COLUMN: string = "COMPANY";
  readonly REFTABLE_COMPANIES_LOCATIONS_LOCATION_COLUMN: string = "LOCATION";

  readonly CUSTOMER_PREFIX_EXAMPLE: string = "50020CUS"; // 50021CUS000003 oder 4300000123

  readonly DELIVERY_NOTE_TYPE_ID: string = "LI";
  readonly INVOICE_TYPE_ID: string = "RG";
  readonly ORDER_TYPE_ID: string = "AU";
  readonly CUSTOMER_TYPE_ID: string = "CUS";
  readonly ORDER_POSITION_TYPE_ID: string = "POS";
  readonly DELIVERY_NOTE_POSITION_TYPE_ID: string = "POS_LI";
  readonly INVOICE_POSITION_TYPE_ID: string = "POS_RG";

  readonly CURRENCY_US: string = "USD";
  readonly CURRENCY_EU: string = "EUR";
  readonly CURRENCY_EU_ID: string = "1";
  readonly COUNTRY_ID: string = "100"; // '500' = US Shopware Country ID

  readonly ORDER_STATES_OPEN: number = 10;
  readonly ORDER_STATES_IN_PROCESS: number = 20;
  readonly ORDER_STATES_COMPLETED: number = 30;
  readonly DLV_STATES_OPEN: number = 40;
  readonly DLV_STATES_IN_DELIVERY: number = 50;
  readonly DLV_STATES_DELIVERED: number = 70;
  readonly INV_STATES_OPEN: number = 80;
  readonly INV_STATES_COMPLETED: number = 100;

  // readonly orderStates = [ { name: 'Offen (Bestellung)', value: 10 },
  //   { name: 'In Bearbeitung (Wartet)', value: 20 }, { name: 'Komplett abgeschlossen', value: 30 },
  //   { name: 'Storniert', value: 0 }, { name: 'Klärung notwendig', value: 110 } ];
  // readonly dlvStates = [ { name: 'Offen (Lieferschein)', value: 40 }, { name: 'In Zustellung', value: 50 },
  //   { name: 'Teils geliefert', value: 60 }, { name: 'Vollständig geliefert', value: 70 } ];
  // readonly invStates = [ { name: 'Offen (Rechnung)', value: 80 }, { name: 'Teils bezahlt', value: 90 },
  //   { name: 'Vollständig bezahlt', value: 100 }];

  readonly INFO_DIALOG_NO_NAVIGATION_KEY = "nonavigation";
  readonly DB_TABLE_PREFIX = "SOAS_DEV.dbo.";

  // readonly ORDERS_POSITIONS_POSITION_STATUS_NOT_ALLOCATED: number = 0;
  // readonly ORDERS_POSITIONS_POSITION_STATUS_OPEN: number = 1;
  // readonly ORDERS_POSITIONS_POSITION_STATUS_PARTIALLY_ALLOCATED: number = 2;
  // readonly ORDERS_POSITIONS_POSITION_STATUS_COMPLETELY_ALLOCATED: number = 3;

  readonly CLIENT_B2C: string = "B2C";
  readonly CLIENT_B2B: string = "B2B";
  readonly ORDER_TYPES: string[] = ["webde", "webus"];

  // Article attributes maximal rows in one column
  readonly ARTICLE_ATTRIBUTES_MAX_COLUMN_ROWS: number = 8;
  // , 'ATTR_SHOP_ACTIVE'
  readonly ARTICLE_DEFAULT_ATTRIBUTES: string[] = [
    "ATTR_BRAND",
    "ATTR_CATEGORY_0",
    "ATTR_CATEGORY_1",
    "ATTR_GROUP",
    "ATTR_COLOR",
    "ATTR_FEATURE",
    "ATTR_YOUTUBE",
  ];
  readonly CATEGORY_SOAS_SET: string = "SET";
  readonly CATEGORY_SOAS_KOMP: string = "KOMP";
  readonly CATEGORY_SOAS_SERV: string = "SERV";
  readonly ARTICLE_DEFAULT_CATEGORIES: string[] = [
    "HAUPT",
    this.CATEGORY_SOAS_SERV,
    this.CATEGORY_SOAS_SET,
    "FERT",
    "RAW",
    this.CATEGORY_SOAS_KOMP,
  ];

  // Customers addresses delimiter
  readonly CUSTOMERS_ADDRESSES_DELIMITER: string = "~"; //'#';
  readonly CUSTOMERS_ADDRESSES_STREET_ZIP_DELIMITER: string = "-";

  readonly ORDERS_POSITIONS_POSITION_ID_NUMBER: number = 1000;

  // 101 (Warehouse in Bremen)
  // 201 (Warehouse in Emotion SARL FR)
  // 110 (Warehouse of Emotion Holztechnik)
  // 111 (Warehouse of Emotion Formholztechnik)
  // 401 (Posseik)
  // replaced by loading from [COMPANIES_LOCATIONS]
  // readonly WAREHOUSE_LOCATIONS: string[] = ["101", "201", "110", "111", "401"];

  readonly  BATCH_FUNCTIONS = {
    mssql_batch_process_check_allocation: {
      warehouseLocation: ''
    },
    mssql_batch_process_book_inventory: null,
    execute_sql_create_csv_send_mail: {
      batchCode: ''
    },
  }



  readonly STOCK_TRANSFER_SAVE_TYPES = {
    UPDATE_BOTH: "updateBothLocations",
    UPDATE_DELETE: "updateAndDeleteLocation",
    REPLACE: "replaceLocation",
    CREATE: "createLocation",
  };

  readonly STOCK_TRANSFER_SEARCH_COLUMN_TYPES = {
    ITMNUM: "ITMNUM",
    LOC: "LOC",
  };

  readonly BATCH_PROCESSES_SEARCH_COLUMN_TYPES = {
    BATCH_FUNCTION: "BATCH_FUNCTION",
  };

  readonly STOCK_TRANSFER_ADDITIONAL_COLUMNS_TYPES = {
    ID: "ID",
    LOC: "LOC",
    WHLOC: "WHLOC",
    LOT: "LOT",
    STATUS_POS: "STATUS_POS",
    QTY: "QTY",
    RESERVED: "RESERVED",
    UPDATE_LOC: "UPDATE_LOC",
  };

  readonly BATCH_PROCESSES_ADDITIONAL_COLUMNS_TYPES = {
    BATCH_NAME: "BATCH_NAME",
    BATCH_DESCRIPTION: "BATCH_DESCRIPTION",
    BATCH_INTERVAL: "BATCH_INTERVAL",
    BATCH_ACTIVE: "BATCH_ACTIVE",
    BATCH_LAST_RUN_START: "BATCH_LAST_RUN_START",
    BATCH_LAST_RUN_FINISH: "BATCH_LAST_RUN_FINISH",
    BATCH_LAST_RUN_RESULT: "BATCH_LAST_RUN_RESULT",
    BATCH_CODE: "BATCH_CODE",
    BATCH_CODE_REQUIRED:"BATCH_CODE_REQUIRED",
    BATCH_PARAMS:"BATCH_PARAMS"
  };


  readonly SHOW_ON_PAGE_MAX: number = 997;

  readonly PRIMARY_COLUMN_TYPES: string[] = [
    "ID",
    "ITMNUM",
    "ORDERS_NUMBER",
    "DELIVERY_NOTES_NUMBER",
    "INVOICES_NUMBER",
    "CUSTOMERS_NUMBER",
    "CUSTOMERS_TYPE",
    "WHLOC",
    "CUSGRP",
    "ADDRESS_TYPE",
    "TABLENAME",
    "COMPNUM",
    "CURRENCY_ID",
    "COUNTRY_ID",
    "ATTRIBUTE_NAME",
    "PAYMENT_TERM_ID",
    "PROD_UNIT_NAME",
    "PROVIDERS_NAME",
    "ORDERS_POSITIONS_ID",
    "CROSSSELLING",
    "OFFER_NUMBER"
  ];

  readonly PRILISTS_START_DATE: string = "01.01.2021";
  readonly PRILISTS_END_DATE: string = "01.01.2029";
  readonly PRILISTS_PRIORITY: number = 50;
  readonly PRILISTS_PRIORITY_MIN: number = 0;
  readonly PRILISTS_PRIORITY_MAX: number = 100;
  readonly DEFAULT_PRIORITY_MAX: number = 1000000;
  readonly PRILISTS_PTABLE_MAX_ROWS: number = 10;

  /** Min-Max Fraction Digits for input number fields of p-table: (min = 2 (100,12), max=5 (100,12345) */
  readonly FRACTION_DIGITS_MIN: number = 2;
  readonly FRACTION_DIGITS_MAX: number = 5;

  readonly DEFAULT_CUSTOMER_ADDRESS_ISO_CODE: string = "DE";

  readonly WAREHOUSING_DEFAULT_STATUS: string = "A";

  readonly DEFAULT_COUNTRY_NAME: string = "Grossbritannien"; // 'Deutschland';
  readonly DEFAULT_LANGUAGE_ISO_3: string = "DEU";
  readonly DEFAULT_B2C_PAYMENT_TERM_ID: string = "DEVORAUS";
  readonly DEFAULT_B2C_TAX_CODE: string = "DEK";

  readonly DEFAULT_B2B_PAYMENT_TERM_ID: string = "DE20T";
  readonly DEFAULT_B2B_TAX_CODE: string = "DEK";
  readonly DEFAULT_CUSTOMER_ADDRESSES_DISPLAYED_COLUMNS: string[] = [
    "ADDRESS_TYPE",
    "NAME_ADDR",
    "ADDRESS_CRYNAME",
    "ADDRESS_STREET",
    "ADDRESS_CITY",
    "ADDRESS_POSTCODE",
    "ADDRESS_ISO_CODE",
  ];
  readonly DEFAULT_CUSTOMER_ADDRESSES_COLUMNS_TO_HIDE: string[] = [
    "CUSTOMERS_NUMBER",
    "ADDRESS_COMMENT",
    "TAXCODE",
    "ADDRESS_ISO_CODE",
    "ID",
  ];
  readonly DEFAULT_CUSTOMER_ADDRESSES_ADDITIONAL_SEARCH_COLUMNS: string =
    "NAME_ADDR,ADDRESS_CRYNAME,ADDRESS_STREET," + "ADDRESS_CITY";
  readonly DEFAULT_CUSTOMER_ADDRESSES_INITIAL_SORT: Sort<CustomerAdrr> = {
    property: "CUSTOMERS_NUMBER",
    order: "desc",
  };
  // error message lifetime before disappear
  readonly MESSAGES_LIFE_TIME: number = 6000;
}

/**
 * Customer address types enumeration:
 * 'DLV' - delivery note
 * 'INV' - invoice
 */
export enum CustomerAddressTypes {
  DLV = "DLV",
  INV = "INV",
}

/**
 * Customers types:
 * 'B2C' - business to customer
 * 'B2B' - business to business (partners)
 */
export enum CustomersTypes {
  B2C = "B2C",
  B2B = "B2B",
}

/**
 * Options types: options are loaded at form.service
 *
 * First options item is normally {label: 'PLEASE_SELECT', value: undefined}
 *
 * - currencies:
 *  currencies: { name: 'EUR', value: '1'}, pcurrencies: { name: 'EUR (€)', value: '1'},
 *  currenciesWithId: { id: 1, name: 'Euro', value: 'EUR'}
 *
 * - countries:
 * countries: { name: 'Finnland (FI)', value: 'FI'}, countriesWithId: { id: 5, name: 'Finnland',
 * value: 'FI'}
 *
 * - states: {label: Offen (Bestellung) (10), value: 10}
 *
 * - paymentTerms: {label: GER~Amazon Payments~ (AMAZONPAYMENTS), value: AMAZONPAYMENTS}
 *
 * - languages: { name: 'Deutsch DE (DEU)', value: 'DEU'}
 *
 * - soas categories: {label: 'HAUPT', value: 'HAUPT'}
 *
 * - taxation relations: { name: 'DEK (16.0)', value: 'DEK'}
 *
 * - customer types: {lable: 'B2C', value: 'B2C'}
 *
 * - warehouses: pwarehouses {label: '101', value: '101'}
 */
export enum OptionsTypes {
  currencies = "currencies",
  countries = "countries",
  states = "states",
  paymentTerms = "paymentTerms",
  languages = "languages",
  taxCodes = "taxCodes",
  taxRates = "taxRates",
  soasCategories = "soasCategories",
  customerTypes = "customerTypes",
  // warehouses = "warehouses",  // WAREHOUSE
  warehousingLocations = "warehousingLocations", // WHLOC
  salesLocations = "salesLocations", // SALES_LOCATION
  statusPos = "statusPos",
  provider = "provider",
}

/**
 * Component view types enumeration:
 * 'table' - customer-table.component.ts (custom table view)
 * 'details' - customer-form.component.ts or detail-view-list.component.ts (custom form view or detail view)
 * 'dynamicForm' - dynamic-form.component.ts
 */
export enum ComponentViewTypes {
  Table = "table",
  Details = "details",
  DynamicForm = "dynamicForm",
}

/**
 * View query types enumeration:
 * 'MAIN_TABLE' - to query data for main table view (on the left)
 * 'DETAIL_TABLE' - to query data for detail table view (on the right)
 * 'PURE_SELECT' - to query data for options (currencies, states etc.)
 */
export enum ViewQueryTypes {
  MAIN_TABLE = "MAIN_TABLE",
  DETAIL_TABLE = "DETAIL_TABLE",
  PURE_SELECT = "PURE_SELECT",
  NEW_ITEM = 'NEW_ITEM'
}

/**
 * Soas model types
 */
export type SoasModel =
  | Article
  | AttributeNames
  | Attributes
  | Batch
  | Companies
  | CompaniesLocations
  | Countries
  | CSVTemplateConfigs
  | CSVTemplateConfigsField
  | Currencies
  | Customer
  | CustomerAdrr
  | DeliveryNotes
  | DeliveryNotesPositions
  | DistComponent
  | ImportType
  | ImportTypesConstants
  | ImportTypesRefTables
  | Invoices
  | InvoicesPositions
  | Orders
  | OrdersPositions
  | SupplyOrders
  | SupplyOrdersPositions
  | PaymentTerms
  | PriceListSales
  | ProdUnits
  | ProductComponents
  | Providers
  | Taxes
  | TaxesRate
  | User
  | StoragePlaces
  | Warehousing
  | SaleOffers;

/**
 * Tab group model types
 */
export type TabGroupModel =
  | undefined
  | Customer
  | Orders
  | DeliveryNotes
  | Invoices;

/**
 * TabGroup view tab numbers for 6 main tabs
 */
export enum TabGroupTabNumbers {
  CUSTOMER = 0,
  PARTNER = 0,
  ORDER = 1,
  DELIVERY_NOTE = 2,
  INVOICE = 3,
  COMMENT = 4,
  SALE_OFFERS = 1,
}

/**
 * TabGroup view tab names
 */
export enum TabGroupTabNames {
  CUSTOMER = "CUSTOMER",
  PARTNER = "PARTNER",
  ORDER = "ORDER",
  DELIVERY_NOTE = "DELIVERY_NOTE",
  INVOICE = "INVOICE",
  COMMENT = "COMMENT",
  SALE_OFFERS = "SALE_OFFERS",
}

export enum TabGroupTabTableTitles {
  CUSTOMER = "CUSTOMERS",
  PARTNER = "PARTNERS",
  ORDER = "ORDERS",
  DELIVERY_NOTE = "DELIVERY_NOTES",
  INVOICE = "INVOICES",
  COMMENT = "COMMENTS",
  SALE_OFFERS = "SALE_OFFERS",
}

/**
 * Sub TabGroup view tab numbers
 *
 * DETAILS - for all components
 * POSITIONS - for orders, deliver notes, invoices
 * ADDRESSES_DLV, ADDRESSES_INV - for customers
 */
export enum SubTabGroupTabNumbers {
  DETAILS = 0,
  POSITIONS = 1,
  ADDRESSES_DLV = 1,
  ADDRESSES_INV = 2,
}

/**
 * Sub TabGroup view tab names
 */
export enum SubTabGroupTabNames {
  CUSTOMER_DETAILS = "CUSTOMER_DETAILS", // tab number = 0
  ADDRESS_DELIVERIES = "ADDRESS_DELIVERIES", // tab number = 1
  ADDRESS_INVOICES = "ADDRESS_INVOICES", // tab number = 2
  ORDER_DETAILS = "ORDER_DETAILS", // tab number = 0
  ORDER_POSITIONS = "ORDER_POSITIONS", // tab number = 1
  DELIVERY_NOTES_DETAILS = "DELIVERY_NOTES_DETAILS", // tab number = 0
  DELIVERY_NOTES_POSITIONS = "DELIVERY_NOTES_POSITIONS", // tab number = 1
  INVOICE_DETAILS = "INVOICE_DETAILS", // tab number = 0
  INVOICES_POSITIONS = "INVOICES_POSITIONS", // tab number = 1
  COMMENT_DETAILS = "COMMENT_DETAILS", // tab number = 0
  SALE_OFFERS_DETAILS = "SALE_OFFERS_DETAILS",  //tab number = 0
  SALE_OFFER_POSITIONNS = "SALE_OFFERS_POSITIONS",  //tab_number = 1
}

/**
 * Formly form template options
 *
 * 'refTable': 'countries'    => REF_TABLE from TABLE_TEMPLATES: string
 * 'tableName': 'COUNTRIES'   => (PRIMARY)TABLE_NAME from TABLE_TEMPLATES: string
 * 'newItemMode': 'false'     => New item mode: boolean
 * 'isPrimary': 'true'        => Is primary field flag: boolean
 * 'isSecondary': 'true'      => Is secondary field flag: boolean
 * 'isTertiary': 'true'       => Is tertiary field flag: boolean
 * 'needsValidation': 'false'  => Field value need to be validated: boolean
 * 'templateOptions.disabled': 'true' => Field should be readonly by default: boolean
 * 'parentId': '1111'         => Parent id: number. For example is used for Article > Crossselling field,
 *                                to determine CROSSSELLING_ID
 */
export enum FormlyTemplateOptions {
  REF_TABLE = "refTable",
  TABLE_NAME = "tableName",
  NEW_ITEM_MODE = "newItemMode",
  IS_PRIMARY = "isPrimary",
  IS_SECONDARY = "isSecondary",
  IS_TERTIARY = "isTertiary",
  IS_IDENTITY = "isIdentity",
  NEEDS_VALIDATION = "needsValidation",
  PARENT_ID = "parentId",
  ISSET_VALUE = "isSetTable"
}

export enum PrimaryColumnTypes {
  ID = "ID" as any,
  ITMNUM = "ITMNUM" as any,
  ORDERS_NUMBER = "ORDERS_NUMBER" as any,
  DELIVERY_NOTES_NUMBER = "DELIVERY_NOTES_NUMBER" as any,
  INVOICES_NUMBER = "INVOICES_NUMBER" as any,
  CUSTOMERS_NUMBER = "CUSTOMERS_NUMBER" as any,
  CUSTOMERS_TYPE = "CUSTOMERS_TYPE" as any,
  WHLOC = "WHLOC" as any, // orderPositions -> add new position
  CUSGRP = "CUSGRP" as any, // prilists
  ADDRESS_TYPE = "ADDRESS_TYPE" as any,
  TABLENAME = "TABLENAME" as any, // tableLocks
  COMPNUM = "COMPNUM" as any, // components
  CURRENCY_ID = "CURRENCY_ID" as any,
  COUNTRY_ID = "COUNTRY_ID" as any,
  ATTRIBUTE_NAME = "ATTRIBUTE_NAME" as any,
  PAYMENT_TERM_ID = "PAYMENT_TERM_ID" as any,
  PROD_UNIT_NAME = "PROD_UNIT_NAME" as any,
  PROVIDERS_NAME = "PROVIDERS_NAME" as any,
  ORDERS_POSITIONS_ID = "ORDERS_POSITIONS_ID" as any,
  CROSSSELLING = "CROSSSELLING" as any,
  TAX_NUMBER = "TAX_NUMBER" as any, // secondary key at PROVIDERS
  PRILIST = "PRILIST" as any,
  TAXCODE = "TAXCODE" as any,
  TAXRATE = "TAXRATE" as any,
  INVOICES_CUSTOMER = "INVOICES_CUSTOMER" as any,
  CUSTOMER_ORDER = "CUSTOMER_ORDER" as any,
  COMPANY = "COMPANY" as any,
  CROSSSELLING_ID = "CROSSSELLING_ID" as any,
  PROVIDERS_ORDER = "PROVIDERS_ORDER" as any,
  OFFER_NUMBER = "OFFER_NUMBER"  as any
}

export enum IntegerPrimaryColumnTypes {
  ID = "ID" as any,
  COUNTRY_ID = "COUNTRY_ID" as any,
}

/**
 * Columns (cols) for order position item. disabled - if true, not show column in table
 */
export const ORDER_POSITIONS_COLS:
  { field: string, header: string, disabled: boolean, readonly: boolean, size: number, width: string, type: string }[]
  =
  [
    {field: 'ID', header: 'ID', disabled: true, readonly: true, size: 10, width: '15%', type: 'span'},
    {field: 'POS', header: 'POS', disabled: true, readonly: true, size: 10, width: '15%', type: 'span'},
    {field: 'ORDERS_NUMBER', header: 'SHORT_ORDERS_NUMBER', disabled: true, readonly: true, size: 50, width: '10%', type: 'span'},
    {field: 'ITMNUM', header: 'SHORT_ITMNUM', disabled: false, readonly: true, size: 50, width: '40%', type: 'span'},
    {field: 'ITMDES', header: 'ITMDES', disabled: false, readonly: false, size: 100, width: '50%', type: 'textarea'},
    {field: 'CATEGORY_SOAS', header: 'CATEGORY_SOAS', disabled: false, readonly: true, size: 50, width: '22%', type: 'span'},
    {field: 'ORDER_QTY', header: 'ORDER_QTY', disabled: false, readonly: true, size: 10, width: '21%', type: 'span'},
    {field: 'ASSIGNED_QTY', header: 'ASSIGNED_QTY', disabled: false, readonly: true, size: 10, width: '23%', type: 'span'},
    {field: 'DELIVERED_QTY', header: 'DELIVERED_QTY', disabled: false, readonly: true, size: 10, width: '22%', type: 'span'},
    {field: 'PRICE_BRU', header: 'PRICE_BRU', disabled: false, readonly: false, size: 15, width: '25%', type: 'inputNumber'},
    {field: 'PRICE_NET', header: 'PRICE_NET', disabled: false, readonly: false, size: 15, width: '25%', type: 'inputNumber'},
    {field: 'CURRENCY', header: 'CURRENCY', disabled: false, readonly: true, size: 15, width: '22%', type: 'span'},
    {field: 'WAREHOUSE', header: 'WAREHOUSE', disabled: true, readonly: true, size: 15, width: '18%', type: 'span'},
    {field: 'POSITION_STATUS', header: 'POSITION_STATUS', disabled: false, readonly: true, size: 15, width: '38%', type: 'span'}
  ];

/**
 * Columns (cols) for order dialog position item (without id) disabled - if true, not show column in table
 *
 * IMPORTANT: If a new field is added and should be visible, make sure to do following:
 * 1. add it to detail-view-tab-group-positions.service.ts > showOrderPositions() function
 * 2. check if client and server interface, model, class (server) have the new column added, and typescript files are recompiled
 */
export const ORDER_POSITIONS_DIALOG_COLS:
  { field: string; size: number; header: string; disabled: boolean, type: string }[
    ] = [
  {field: 'ORDERS_NUMBER', header: 'ORDERS_NUMBER', disabled: true, size: 50, type: 'span'},
  {field: 'ITMNUM', header: 'SHORT_ITMNUM', disabled: false, size: 50, type: 'span'},
  {field: 'ITMDES', header: 'ITMDES', disabled: false, size: 50, type: 'span'},
  {field: 'CATEGORY_SOAS', header: 'CATEGORY_SOAS', disabled: true, size: 50, type: 'span'},
  {field: 'ORDER_QTY', header: 'SHORT_ORDER_QTY', disabled: false, size: 10, type: 'span'},
  {field: 'PRICE_BRU', header: 'PRICE_BRU', disabled: false, size: 15, type: 'span'},
  {field: 'PRICE_NET', header: 'PRICE_NET', disabled: true, size: 15, type: 'span'},
  {field: 'TAX_AMOUNT', header: 'TAX_AMOUNT', disabled: true, size: 15, type: 'span'},
  {field: 'CURRENCY', header: 'CURRENCY', disabled: true, size: 15, type: 'span'}
];

/**
 * Columns (cols) for delivery note position items. disabled - if true, not show column in table
 *
 * IMPORTANT: If a new field is added and should be visible, make sure to do following:
 * 1. add it to detail-view-tab-group-positions.service.ts > showDeliveryNotePositions() function
 * 2. check if client and server interface, model, class (server) have the new column added, and typescript files are recompiled
 */
export const DELIVERY_NOTE_POSITIONS_COLS:
  { field: string, header: string, disabled: boolean, readonly: boolean, size: number, width: string, type: string }[]
  = [
  {field: 'ID', header: 'ID', disabled: true, readonly: true, size: 10, width: '14%', type: 'span'},
  {field: 'POS', header: 'POS', disabled: false, readonly: true, size: 10, width: '14%', type: 'span'},
  {
    field: 'DELIVERY_NOTES_NUMBER', header: 'SHORT_DELIVERY_NOTES_NUMBER', disabled: true, readonly: true, size: 50,
    width: '35%', type: 'span'
  },
  {field: 'ORDERS_NUMBER', header: 'SHORT_ORDERS_NUMBER', disabled: true, readonly: true, size: 50, width: '35%', type: 'span'},
  {field: 'ITMNUM', header: 'SHORT_ITMNUM', disabled: false, readonly: true, size: 50, width: '40%', type: 'span'},
  {field: 'CATEGORY_SOAS', header: 'CATEGORY_SOAS', disabled: false, readonly: true, size: 50, width: '20%', type: 'span'},
  {field: 'ORDER_QTY', header: 'ORDER_QTY', disabled: false, readonly: true, size: 10, width: '20%', type: 'span'},
  {field: 'WEIGHT_PER', header: 'WEIGHT_PER', disabled: false, readonly: true, size: 10, width: '22%', type: 'span'},
  {field: 'DELIVERY_QTY', header: 'DELIVERY_QTY', disabled: false, readonly: true, size: 10, width: '22%', type: 'span'},
  {field: 'POSITION_STATUS', header: 'POSITION_STATUS', disabled: false, readonly: true, size: 15, width: '38%', type: 'span'}
];

/**
 * Columns (cols) for invoice position items. disabled - if true, not show column in table
 *
 * IMPORTANT: If a new field is added and should be visible, make sure to do following:
 * 1. add it to detail-view-tab-group-positions.service.ts > showInvoicePositions() function
 * 2. check if client and server interface, model, class (server) have the new column added, and typescript files are recompiled
 */
export const INVOICE_POSITIONS_COLS:
  { field: string, header: string, disabled: boolean, readonly: boolean, size: number, width: string, type: string }[]
  = [
  {field: 'ID', header: 'ID', disabled: true, readonly: true, size: 5, width: '14%', type: 'span'},
  {field: 'POS', header: 'POS', disabled: false, readonly: true, size: 5, width: '14%', type: 'span'},
  {field: 'INVOICES_NUMBER', header: 'SHORT_INVOICES_NUMBER', disabled: true, readonly: false, size: 50, width: '40%', type: 'span'},
  {field: 'DELIVERY_NOTES_NUMBER', header: 'SHORT_DELIVERY_NOTES_NUMBER', disabled: true, readonly: false, size: 50, width: '40%', type: 'span'},
  {field: 'ORDERS_NUMBER', header: 'SHORT_ORDERS_NUMBER', disabled: true, readonly: false, size: 50, width: '40%', type: 'span'},
  {field: 'ITMNUM', header: 'SHORT_ITMNUM', disabled: false, readonly: false, size: 50, width: '35%', type: 'span'},
  {field: 'ITMDES', header: 'ITMDES', disabled: false, readonly: false, size: 100, width: '50%', type: 'textarea'},
  {field: 'CATEGORY_SOAS', header: 'CATEGORY_SOAS', disabled: false, readonly: true, size: 50, width: '20%', type: 'span'},
  {field: 'ORDER_QTY', header: 'ORDER_QTY', disabled: false, readonly: false, size: 10, width: '15%', type: 'span'},
  {field: 'DELIVERY_QTY', header: 'DELIVERY_QTY', disabled: false, readonly: false, size: 10, width: '17%', type: 'span'},
  {field: 'PRICE_BRU', header: 'PRICE_BRU', disabled: false, readonly: false, size: 15, width: '17%', type: 'span'},
  {field: 'PRICE_NET', header: 'PRICE_NET', disabled: false, readonly: false, size: 15, width: '17%', type: 'span'},
  {field: 'TAX_AMOUNT', header: 'TAX_AMOUNT', disabled: false, readonly: false, size: 15, width: '17%', type: 'span'},
  {field: 'CURRENCY', header: 'CURRENCY', disabled: false, readonly: false, size: 15, width: '15%', type: 'span'},
  {field: 'SALES_LOCATION', header: 'SALES_LOCATION', disabled: false, readonly: true, size: 15, width: '18%', type: 'span'},
  {field: 'POSITION_STATUS', header: 'POSITION_STATUS', disabled: false, readonly: true, size: 15, width: '38%', type: 'span'}
];

/**
 * price list position columns settings
 *
 * - disabled: boolean flag, if the column should not be shown = true
 *
 * - readonly: boolean flag, if the column should be not editable = true. the logic for set field readonly is in
 * custom-p-table: e.g.
 *  set editable: showPositionAsTextArea(), showPositionAsInput()
 *  set readonly: showPositionAsSpan()
 *
 * - size: is not used yet
 * - width: the width of each column in %
 */
export const PRICE_LIST_SALES_POSITIONS_COLS:
  {
    field: string, header: string, disabled: boolean, readonly: boolean, size: number, width: string, rows: number,
    cols: number, type: string
  }[]
  = [
  {field: 'ID', header: 'ID', disabled: true, readonly: true, size: 10, width: '14%', rows: 1, cols: 10, type: 'span'},
  {field: 'POS', header: 'POS', disabled: false, readonly: true, size: 10, width: '14%', rows: 1, cols: 10, type: 'span'},
  {field: 'ITMNUM', header: 'ITMNUM', disabled: false, readonly: true, size: 50, width: '40%', rows: 1, cols: 20, type: 'span'},
  {field: 'PRILIST', header: 'PRILIST', disabled: false, readonly: true, size: 10, width: '22%', rows: 1, cols: 10, type: 'span'},
  {field: 'CUSGRP', header: 'CUSGRP', disabled: false, readonly: true, size: 15, width: '26%', rows: 1, cols: 10, type: 'span'},
  {field: 'PRICE_NET', header: 'PRICE_NET', disabled: false, readonly: false, size: 10, width: '24%', rows: 1, cols: 8, type: 'inputNumber'},
  {field: 'PRICE_BRU', header: 'PRICE_BRU', disabled: false, readonly: true, size: 10, width: '24%', rows: 1, cols: 8, type: 'span'},
  {field: 'CURRENCY', header: 'CURRENCY', disabled: false, readonly: true, size: 10, width: '20%', rows: 1, cols: 10, type: 'span'},
  {field: 'START_DATE', header: 'START_DATE', disabled: false, readonly: true, size: 15, width: '30%', rows: 1, cols: 10, type: 'span'},
  {field: 'END_DATE', header: 'END_DATE', disabled: false, readonly: true, size: 15, width: '30%', rows: 1, cols: 10, type: 'span'},
  {field: 'PRIORITY', header: 'PRIORITY', disabled: false, readonly: false, size: 15, width: '18%', rows: 1, cols: 10, type: 'inputNumber'}
];

export enum CompaniesLocationsTypes {
  warehousingLocations = "warehousingLocations" as any,
  salesLocations = "salesLocations" as any
}

/**
 * model names sorted by referral table names
 *
 * refTable: route model name
 */
export const modelNames: {} = {
  'articles': 'article',
  'attributeNames': 'attributeName',
  'components': 'distComponent',
  'countries': 'country',
  'currencies': 'currency',
  'custbtwob': 'customer',
  'custbtwoc': 'customer',
  'customersAddrDlv': 'customerAddress',
  'customersAddrInv': 'customerAddress',
  'languages': 'language',
  'orders': 'order',
  'orderPosition' : 'orderPosition',
  'prodUnits': 'prodUnit',
  'providers': 'provider',
  'statusPos': 'statusPos',
  'warehousing': 'warehousing',
  'warehousingLoc': 'warehouseLoc',
  'whLoc': 'whLoc',
  'paymentTerms': 'paymentTerm',
  'taxes': 'taxCode',
  'taxcodes': 'taxCode',
  'taxesRate': 'taxRate',
  'taxrates': 'taxRate',
  'deliveryNotePositions': 'deliveryNotePosition',
  'deliveryNote': 'deliveryNote',
  'invoice': 'invoice',
  'invoicePositions': 'invoicePosition',
  'states': 'state',
  'categorySoas': 'categorySoas',
  'priceListSales': 'prilist',
  'importTypes':  'importType',
  'companies':  'company',
  'companiesLocations': 'companyLocation',
  'importTypesRefTables': 'importTypeReferencedTable',
  'importTypeConstants':  'importTypeConstant',
  'users': 'user',
  'batchProcesses':  'batchProcess'
};

/**
 * Table types of components:
 *
 * mat-table - material table
 * p-table - primeNG editabe table
 */
export enum TableTypes {
  matTable = "mat-table" as any,
  pTable = "p-table" as any
}
