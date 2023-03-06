/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 24.01.2022 */



import {Language} from "../models/Language";
import {Country} from "../models/Country";
import {Currency} from "../models/Currency";
import {Provider} from "../models/Provider";
import {WarehouseLoc} from "../models/WarehouseLoc";
import {ProdUnit} from "../models/ProdUnit";
import {BuildOptions, Model} from "sequelize";
import {Warehousing} from "../models/Warehousing";
import {DistComponent} from "../models/DistComponent";
import {Attribute} from "../models/Attribute";
import {Article} from "../models/Article";
import {CrossSelling} from "../models/CrossSelling";
import {Customer} from "../models/Customer";
import {CustomerAddress} from "../models/CustomerAddress";
import {Order} from "../models/Order";
import {OrderPosition} from "../models/OrderPosition";
import {TaxCode} from "../models/TaxCode";
import {AttributeName} from "../models/AttributeName";
import {BatchProcess} from "../models/BatchProcess";
import {Company} from "../models/Company";
import {CompanyLocation} from "../models/CompanyLocation";
import {FormTemplate} from "../models/FormTemplate";
import {ImportTemplate} from "../models/ImportTemplate";
import {DeliveryNotePosition} from "../models/DeliveryNotePosition";
import {DeliveryNote} from "../models/DeliveryNote";
import {TableTemplate} from "../models/TableTemplate";
import {ImportType} from "../models/ImportType";
import {ImportTypeConstant} from "../models/ImportTypeConstant";
import {ImportTypeReferencedTable} from "../models/ImportTypeReferencedTable";
import {InvoicePosition} from "../models/InvoicePosition";
import {Invoice} from "../models/Invoice";
import {ReCreditingPosition} from "../models/ReCreditingPosition";
import {ReCrediting} from "../models/ReCrediting";
import {SaleOfferPosition} from "../models/SaleOfferPosition";
import {SaleOffer} from "../models/SaleOffer";
import {SupplyOrderPosition} from "../models/SupplyOrderPosition";
import {SupplyOrder} from "../models/SupplyOrder";
import {ItemLock} from "../models/ItemLock";
import {TableLock} from "../models/TableLock";
import {ItmVariant} from "../models/ItmVariant";
import {LocalizeIt} from "../models/LocalizeIt";
import {PaymentTerm} from "../models/PaymentTerm";
import {Prilist} from "../models/Prilist";
import {ProdComponent} from "../models/ProdComponent";
import {PurchaseOrder} from "../models/PurchaseOrder";
import {TaxationRelation} from "../models/TaxationRelation";
import {TaxRate} from "../models/TaxRate";
import {State} from "../models/State";
import {Role} from "../models/Role";
import {WarehouseReservationCache} from "../models/WarehouseReservationCache";
import {User} from "../models/User";
import {Comment} from "../models/Comment";

export class constants {

    constructor() {}

    static readonly DELIVERY_NOTE_TYPE_ID = 'LI';
    static readonly INVOICE_TYPE_ID = 'RG';
    static readonly ORDER_TYPE_ID = 'AU';
    static readonly SUPPLY_ORDER_TYPE_ID = 'BE';
    static readonly CUSTOMER_TYPE_ID = 'CUS';
    static readonly CURRENCY_US = 'USD';
    static readonly CURRENCY_EU = 'EUR';
    static readonly COUNTRY_ID = '100'; // '500' = US Shopware Country ID
    // For delivery note of '10021LI05211' the number of 05211 has the length of 5
    static readonly MINIMUM_NUMBER_LENGTH = 5;
    static readonly MINIMUM_NUMBER_LENGTH_ORDERS_NUMBER = 5;
    static readonly MINIMUM_NUMBER_LENGTH_DELIVERY_NUMBER = 5;
    static readonly MINIMUM_NUMBER_LENGTH_INVOICE_NUMBER = 5;
    static readonly MINIMUM_NUMBER_LENGTH_CUSTOMER_NUMBER = 10;
    static readonly LOCALE = 'de-DE';
    static readonly TIME_ZONE_BASE = 'UTC';
    static readonly TIME_ZONE_CURRENT = 'Europe/Berlin'; // Central European Standard Time
    static readonly ORDER_STATES_OPEN = 10;
    static readonly ORDER_STATES_IN_PROCESS = 20;
    static readonly ORDER_STATES_COMPLETED = 30;
    static readonly DLV_STATES_OPEN = 40;
    static readonly DLV_STATES_IN_DELIVERY = 50;
    static readonly DLV_STATES_DELIVERED = 70;
    static readonly INV_STATES_OPEN = 80;
    static readonly INV_STATES_COMPLETED = 100;
    static readonly CLIENT_B2C = 'B2C';
    static readonly CLIENT_B2B = 'B2B';
    static readonly CATEGORY_SOAS_SET = 'SET';
    static readonly CATEGORY_SOAS_KOMP = 'KOMP';
    static readonly CATEGORY_SOAS_SERV = 'SERV';
    static readonly CATEGORY_SOAS_RAW = 'RAW';
    // @ToDo: Add database name from environment setting
    static readonly DB_TABLE_PREFIX = 'SOAS_DEV.dbo.';
    static readonly REFTABLE_ARTICLES = 'articles';
    static readonly REFTABLE_ATTRIBUTES = 'attributes';
    static readonly VIRTUAL_REFTABLE_ARTICLES_ATTRIBUTES = 'articlesAttributes';
    static readonly REFTABLE_COMPONENTS = 'components';
    static readonly VIRTUAL_REFTABLE_COMPONENTS_DETAILS = 'componentsDetails';
    static readonly REFTABLE_WAREHOUSING = 'warehousing';
    static readonly REFTABLE_ORDERS = 'orders';
    static readonly REFTABLE_ORDERS_POSITIONS = 'orderPosition';
    static readonly REFTABLE_DELIVERY_NOTES = 'deliveryNote';
    static readonly REFTABLE_DELIVERY_NOTES_POSITIONS = 'deliveryNotePositions';
    static readonly REFTABLE_INVOICES = 'invoice';
    static readonly REFTABLE_INVOICES_POSITIONS = 'invoicePositions';
    static readonly REFTABLE_PRILISTS = 'priceListSales';
    static readonly REFTABLE_CROSSSELLING = 'crossSelling';
    static readonly VIRTUAL_REFTABLE_WAREHOUSING_DETAILS = 'warehousingDetails';
    static readonly CUSTOMERS_ADDRESSES_DELIMITER = '~'; // '#';
    static readonly CUSTOMERS_ADDRESSES_STREET_ZIP_DELIMITER = "-";

    /*** PDF FILE PATHS START ***/

        // Final folder for accessing pdf file. In project: SOAS/pdfs
        // Path for saving into db e.g. [PDF_DOWNLOAD_LINK]: \pdfs\LI\2019\10\50019LI000001.pdf
    static readonly finalPdfFilePath: string = ''; // path.join('/pdfs/')
    static readonly finalPdfFileBasePath: string = ''; // path.join(__dirname, '..', '..', '..', '/pdfs/')

    // Temporary folder for creating pdf file. In project: SOAS/routes/logic/pdf
    static readonly tempPdfFilePath: string = ''; // path.join('/routes/', '/logic/', '/pdf/')
    static readonly tempPdfFileBasePath: string = ''; // path.join(__dirname, '..', '', '/pdf/')
    static readonly yearMonthFoldersPath: string = new Date().getFullYear() + '/' + (new Date().getMonth() + 1);
    static readonly dirName: string = ''; // path.join(__dirname, '..', '..', '..')
    static readonly PDF_FILE_LINK_SHORT: string = ''; // path.join(__dirname, '..', '..', '..');
    static readonly TMP_PDF_FILE_LINK: string = ''; // path.join(this.tempPdfFilePath);
    static readonly TMP_PDF_FILE_FULL_PATH: string = ''; // path.join(this.tempPdfFileBasePath);
    static readonly PDF_FILE_LINK_DELIVERY_NOTES: string = ''; // path.join(this.finalPdfFilePath,
    // constants.DELIVERY_NOTE_TYPE_ID,
    // this.yearMonthFoldersPath);
    static readonly PDF_FILE_FULL_PATH_DELIVERY_NOTES: string = ''; // path.join(this.finalPdfFileBasePath,
    // constants.DELIVERY_NOTE_TYPE_ID, this.yearMonthFoldersPath);
    static readonly PDF_FILE_LINK_INVOICES: string = ''; // path.join(this.finalPdfFilePath,
    // constants.INVOICE_TYPE_ID,
    // this.yearMonthFoldersPath);
    static readonly PDF_FILE_FULL_PATH_INVOICES: string = ''; // path.join(this.finalPdfFileBasePath,
    // constants.INVOICE_TYPE_ID,
    // this.yearMonthFoldersPath);

    /*** PDF FILE PATHS END ***/

    static readonly SORT_TYPES = {
        ASC: 'ASC',
        DESC: 'DESC'
    };

    static readonly WH_CTRL_USE_CASE_TYPES = {
        RESERVED: 'reserved',
        DERESERVED: 'dereserved'
    };

    static readonly STOCK_TRANSFER_SAVE_TYPES = {
        UPDATE_BOTH: 'updateBothLocations',
        UPDATE_DELETE: 'updateAndDeleteLocation',
        REPLACE: 'replaceLocation',
        CREATE: 'createLocation'
    };

    static readonly ARTICLE_DEFAULT_ATTRIBUTES = {
        ATTR_BRAND: 'ATTR_BRAND',
        ATTR_CATEGORY_0: 'ATTR_CATEGORY_0',
        ATTR_CATEGORY_1: 'ATTR_CATEGORY_1',
        ATTR_GROUP: 'ATTR_GROUP',
        ATTR_COLOR: 'ATTR_COLOR',
        ATTR_FEATURE: 'ATTR_FEATURE',
        ATTR_YOUTUBE: 'ATTR_YOUTUBE'
    };

    /**
     * Customers types:
     * 'B2C' - business to customer
     * 'B2B' - business to business (partners)
     */
    static readonly CustomersTypes =  {
        B2C: "B2C",
        B2B: "B2B"
    }

    static readonly DB_TABLE_COLUMNS = {
        TABLELOCKS: {
            TABLENAME: {DATA_TYPE: 'VarChar'},
            LOCKED_BY: {DATA_TYPE: 'VarChar'},
            LOCKED_SINCE: {DATA_TYPE: 'SmallDateTime'},
            LOCKED: {DATA_TYPE: 'Int'},
            LOCKED_DATASET: {DATA_TYPE: 'VarChar'}
        },
        ORDERS: {
            ORDERS_NUMBER: {DATA_TYPE: 'VarChar'},
            CLIENT: {DATA_TYPE: 'VarChar'},
            ORDERS_TYPE: {DATA_TYPE: 'VarChar'},
            PROJECT_FIELD_0: {DATA_TYPE: 'VarChar'},
            PROJECT_FIELD_1: {DATA_TYPE: 'VarChar'},
            PROJECT_FIELD_2: {DATA_TYPE: 'VarChar'},
            CUSTOMER_ORDER: {DATA_TYPE: 'VarChar'},
            CUSTOMER_DELIVERY: {DATA_TYPE: 'VarChar'},
            CUSTOMER_INVOICE: {DATA_TYPE: 'VarChar'},
            ORDERS_DATE: {DATA_TYPE: 'SmallDateTime'},
            ORDERAMOUNT_NET: {DATA_TYPE: 'Decimal'}, //decimal
            ORDERAMOUNT_BRU: {DATA_TYPE: 'Decimal'}, //decimal
            CUSTOMER_ORDERREF: {DATA_TYPE: 'VarChar'},
            LAST_DELIVERY: {DATA_TYPE: 'VarChar'},
            LAST_INVOICE: {DATA_TYPE: 'VarChar'},
            EDI_ORDERRESPONSE_SENT: {DATA_TYPE: 'Bit'},
            RELEASE: {DATA_TYPE: 'Bit'},
            PAYED: {DATA_TYPE: 'Bit'},
            CURRENCY: {DATA_TYPE: 'VarChar'},
            ORDERS_STATE: {DATA_TYPE: 'Int'},
            CUSTOMER_ADDRESSES_ID_DELIVERY: {DATA_TYPE: 'Int'},
            CUSTOMER_ADDRESSES_ID_INVOICE: {DATA_TYPE: 'Int'},
            PAYMENT_TERM_ID: {DATA_TYPE: 'VarChar'},
            WEBSHOP_ID: {DATA_TYPE: 'Int'},
            WEBSHOP_ORDER_REF: {DATA_TYPE: 'VarChar'},
            DISCOUNT: {DATA_TYPE: 'Decimal'}, //float
            VOUCHER: {DATA_TYPE: 'Decimal'}, //decimal
            SHIPPING_COSTS: {DATA_TYPE: 'Decimal'}, //decimal
            WAREHOUSE: {DATA_TYPE: 'VarChar'},
            SALES_LOCATION: {DATA_TYPE: 'VarChar'},
            DELIVERY_METHOD: {DATA_TYPE: 'VarChar'},
            COMMENT: {DATA_TYPE: 'VarChar'}, // text
            PAC_QTY: {DATA_TYPE: 'Int'},
            DISCOUNT_PERC: {DATA_TYPE: 'Decimal'} //float
        },
        ORDERS_POSITIONS: {
            ID: {DATA_TYPE: 'Int'},
            ORDERS_NUMBER: {DATA_TYPE: 'VarChar'},
            ITMNUM: {DATA_TYPE: 'VarChar'},
            ORDER_QTY: {DATA_TYPE: 'Int'},
            ASSIGNED_QTY: {DATA_TYPE: 'Int'},
            PRICE_NET: {DATA_TYPE: 'Decimal'}, //decimal
            PRICE_BRU: {DATA_TYPE: 'Decimal'}, //decimal
            CURRENCY: {DATA_TYPE: 'VarChar'},
            POSITION_STATUS: {DATA_TYPE: 'Int'},
            POSITION_ID: {DATA_TYPE: 'Int'},
            CATEGORY_SOAS: {DATA_TYPE: 'VarChar'},
            PARENT_LINE_ID: {DATA_TYPE: 'Int'},
            DELIVERED_QTY: {DATA_TYPE: 'Int'},
            ITMDES: {DATA_TYPE: 'VarChar'},
            WAREHOUSE: {DATA_TYPE: 'VarChar'},
            DIST_COMPONENTS_ID: {DATA_TYPE: 'Int'}
        },
        DELIVERY_NOTES: {
            DELIVERY_NOTES_NUMBER: {DATA_TYPE: 'VarChar'},
            SHIPPING_DATE: {DATA_TYPE: 'SmallDateTime'},
            EXPORT_PRINT: {DATA_TYPE: 'NVarChar'}, // Bit
            DELIVERY_NOTES_STATE: {DATA_TYPE: 'Int'},
            RETOUR: {DATA_TYPE: 'NVarChar'}, // Bit
            ORDERS_NUMBER: {DATA_TYPE: 'VarChar'},
            PDF_CREATED_DATE: {DATA_TYPE: 'SmallDateTime'},
            PDF_DOWNLOAD_LINK: {DATA_TYPE: 'VarChar'},
            CUSTOMERS_NUMBER: {DATA_TYPE: 'VarChar'},
            RELEASE: {DATA_TYPE: 'NVarChar'}, // Bit
            CURRENCY: {DATA_TYPE: 'VarChar'},
            PARTLY_DELIVERY: {DATA_TYPE:'NVarChar'} // Bit
        },
        DELIVERY_NOTES_POSITIONS: {
            ID: {DATA_TYPE: 'Int'},
            DELIVERY_NOTES_NUMBER: {DATA_TYPE: 'VarChar'},
            ORDERS_NUMBER: {DATA_TYPE: 'VarChar'},
            ITMNUM: {DATA_TYPE: 'VarChar'},
            ORDER_QTY: {DATA_TYPE: 'Int'},
            WEIGHT_PER: {DATA_TYPE: 'Decimal'}, //decimal
            DELIVERY_QTY: {DATA_TYPE: 'Int'},
            ORDERS_POSITIONS_ID: {DATA_TYPE: 'Int'},
            POSITION_ID: {DATA_TYPE: 'Int'},
            CATEGORY_SOAS: {DATA_TYPE: 'VarChar'},
            PARENT_LINE_ID: {DATA_TYPE: 'Int'},
            POSITION_STATUS: {DATA_TYPE: 'Int'}
        },
        INVOICES: {
            INVOICES_NUMBER: {DATA_TYPE: 'VarChar'},
            INVOICES_CUSTOMER: {DATA_TYPE: 'VarChar'},
            INVOICES_DATE: {DATA_TYPE: 'SmallDateTime'},
            INVOICES_CREATOR: {DATA_TYPE: 'VarChar'},
            INVOICES_UPDATE: {DATA_TYPE: 'VarChar'},
            INVOICES_STATE: {DATA_TYPE: 'Int'},
            PAYMENT_TERM_ID: {DATA_TYPE: 'VarChar'},
            DELIVERY_NOTES_NUMBER: {DATA_TYPE: 'VarChar'},
            ORDERS_NUMBER: {DATA_TYPE: 'VarChar'},
            PAYED: {DATA_TYPE: 'NVarChar'}, // Bit
            PDF_CREATED_DATE: {DATA_TYPE: 'SmallDateTime'},
            PDF_DOWNLOAD_LINK: {DATA_TYPE: 'VarChar'},
            RELEASE: {DATA_TYPE: 'NVarChar'}, // Bit
            CURRENCY: {DATA_TYPE: 'VarChar'},
            PARTLY_INVOICE: {DATA_TYPE: 'NVarChar'} // Bit
        },
        INVOICES_POSITIONS: {
            ID: {DATA_TYPE: 'Int'},
            INVOICES_NUMBER: {DATA_TYPE: 'VarChar'},
            ORDERS_NUMBER: {DATA_TYPE: 'VarChar'},
            DELIVERY_NOTES_NUMBER: {DATA_TYPE: 'VarChar'},
            ITMNUM: {DATA_TYPE: 'VarChar'},
            ORDER_QTY: {DATA_TYPE: 'Int'},
            DELIVERY_QTY: {DATA_TYPE: 'Int'},
            PRICE_NET: {DATA_TYPE: 'Decimal'}, //decimal
            PRICE_BRU: {DATA_TYPE: 'Decimal'}, //decimal
            CURRENCY: {DATA_TYPE: 'VarChar'},
            DELIVERY_NOTES_POSITIONS_ID: {DATA_TYPE: 'Int'},
            POSITION_ID: {DATA_TYPE: 'Int'},
            CATEGORY_SOAS: {DATA_TYPE: 'VarChar'},
            PARENT_LINE_ID: {DATA_TYPE: 'Int'},
            POSITION_STATUS: {DATA_TYPE: 'Int'}
        },
        WAREHOUSING: {
            ID: {DATA_TYPE: 'Int'},
            WHLOC: {DATA_TYPE: 'VarChar'},
            ITMNUM: {DATA_TYPE: 'VarChar'},
            LOT: {DATA_TYPE: 'VarChar'},
            LOC: {DATA_TYPE: 'VarChar'},
            STATUS_POS: {DATA_TYPE: 'VarChar'},
            QTY: {DATA_TYPE: 'Int'},
            RESERVED: {DATA_TYPE: 'Int'},
            UPDATE_LOC: {DATA_TYPE: 'SmallDateTime'}
        },
        ATTRIBUTES: {
            ID: {DATA_TYPE: 'Int'},
            ATTRIBUTE_NAME: {DATA_TYPE: 'VarChar'},
            ATTRIBUTE_DATA: {DATA_TYPE: 'VarChar'}
        },
        ATTRIBUTE_NAMES: {
            ID: {DATA_TYPE: 'Int'},
            ATTRIBUTE_NAME: {DATA_TYPE: 'VarChar'},
            ATTRIBUTE_FIELD_TYPE: {DATA_TYPE: 'VarChar'},
            ATTRIBUTE_DATA_TYPE: {DATA_TYPE: 'VarChar'}
        },
        ATTRIBUTE_RELATIONS: {
            ITEM_BASIS_ID: {DATA_TYPE: 'Int'},
            ATTRIBUTE_ID: {DATA_TYPE: 'Int'}
        },
        ITEM_BASIS: {
            ID: {DATA_TYPE: 'Int'},
            ITMNUM: {DATA_TYPE: 'VarChar'},
            ITMDES: {DATA_TYPE: 'VarChar'},
            ITMDES_UC: {DATA_TYPE: 'VarChar'},
            EANCOD: {DATA_TYPE: 'VarChar'},
            CATEGORY_SOAS: {DATA_TYPE: 'VarChar'},
            ART_LENGTH: {DATA_TYPE: 'Decimal'}, //decimal
            ART_WIDTH: {DATA_TYPE: 'Decimal'}, //decimal
            ART_HEIGHT: {DATA_TYPE: 'Decimal'}, //decimal
            PACK_LENGTH: {DATA_TYPE: 'Decimal'}, //decimal
            PACK_WIDTH: {DATA_TYPE: 'Decimal'}, //decimal
            PACK_HEIGHT: {DATA_TYPE: 'Decimal'}, //decimal
            ITMWEIGHT: {DATA_TYPE: 'Decimal'}, //decimal
            ACTIVE_FLG: {DATA_TYPE: 'Bit'},
            CROSSSELLING: {DATA_TYPE: 'Int'},
            CROSSSELLING_FLG: {DATA_TYPE: 'Bit'},
            RAW_FLG: {DATA_TYPE: 'Bit'},
            WAREHOUSE_MANAGED: {DATA_TYPE: 'Bit'}
        },
        CUSTOMERS: {
            CUSTOMERS_NUMBER: {DATA_TYPE: 'VarChar'},
            CUSTOMERS_PRENAME: {DATA_TYPE: 'VarChar'},
            CUSTOMERS_NAME: {DATA_TYPE: 'VarChar'},
            CUSTOMERS_COMPANY: {DATA_TYPE: 'VarChar'},
            CUSTOMERS_TYPE: {DATA_TYPE: 'VarChar'},
            EEC_NUM: {DATA_TYPE: 'VarChar'},
            LANGUAGE: {DATA_TYPE: 'VarChar'},
            EDI_INVOIC: {DATA_TYPE: 'Bit'},
            EDI_ORDERSP: {DATA_TYPE: 'Bit'},
            EDI_DESADV: {DATA_TYPE: 'Bit'},
            CREATE_DATE: {DATA_TYPE: 'SmallDateTime'},
            CUSTOMERS_EMAIL: {DATA_TYPE: 'VarChar'},
            CUSTOMERS_PHONE: {DATA_TYPE: 'VarChar'},
            PAYMENT_CONDITION: {DATA_TYPE: 'VarChar'},
            EMAIL_RG: {DATA_TYPE: 'VarChar'},
            EMAIL_LI: {DATA_TYPE: 'VarChar'},
            EMAIL_AU: {DATA_TYPE: 'VarChar'},
            PHONE_0: {DATA_TYPE: 'VarChar'},
            PHONE_1: {DATA_TYPE: 'VarChar'},
            FAX_0: {DATA_TYPE: 'VarChar'},
            MOB_0: {DATA_TYPE: 'VarChar'},
            MOB_1: {DATA_TYPE: 'VarChar'},
            CRNNUM: {DATA_TYPE: 'VarChar'},
            PAYMENT_TERM_ID: {DATA_TYPE: 'VarChar'},
            EMAIL: {DATA_TYPE: 'VarChar'},
            DIFFERENT_DLV_NAME_0: {DATA_TYPE: 'VarChar'},
            DIFFERENT_DLV_NAME_1: {DATA_TYPE: 'VarChar'}
        },
        CUSTOMERS_ADDRESSES: {
            ID: {DATA_TYPE: 'Int'},
            ADDRESS_TYPE: {DATA_TYPE: 'VarChar'},
            CUSTOMERS_NUMBER: {DATA_TYPE: 'VarChar'},
            ADDRESS_CRYNAME: {DATA_TYPE: 'VarChar'},
            ADDRESS_STREET: {DATA_TYPE: 'VarChar'},
            ADDRESS_CITY: {DATA_TYPE: 'VarChar'},
            ADDRESS_POSTCODE: {DATA_TYPE: 'VarChar'},
            ADDRESS_ISO_CODE: {DATA_TYPE: 'VarChar'},
            ADDRESS_COMMENT: {DATA_TYPE: 'VarChar'},
            TAXATION: {DATA_TYPE: 'VarChar'},
            NAME_ADDR: {DATA_TYPE: 'VarChar'},
            EMAIL: {DATA_TYPE: 'VarChar'},
            PHONE: {DATA_TYPE: 'VarChar'},
            ADDRESS_ID: {DATA_TYPE: 'VarChar'}
        },
        DIST_COMPONENTS: {
            ID: {DATA_TYPE: 'Int'},
            ITMNUM: {DATA_TYPE: 'VarChar'},
            COMPNUM: {DATA_TYPE: 'VarChar'},
            DIST_QTY: {DATA_TYPE: 'Int'}
        },
        LANGUAGES: {
            LANGUAGE_CODE: {DATA_TYPE: 'VarChar'},
            LANGUAGE_NAME: {DATA_TYPE: 'VarChar'},
            LANGUAGE_ISO_ALPHA_2: {DATA_TYPE: 'VarChar'},
            LANGUAGE_ISO_ALPHA_3: {DATA_TYPE: 'VarChar'}
        },
        CURRENCIES: {
            CURRENCY_ID: {DATA_TYPE: 'Int'},
            CURRENCY_NAME: {DATA_TYPE: 'VarChar'},
            CURRENCY_ISO_CODE: {DATA_TYPE: 'VarChar'},
            CURRENCY_SYMBOL: {DATA_TYPE: 'VarChar'}
        },
        COUNTRIES: {
            COUNTRY_ID: {DATA_TYPE: 'Int'},
            COUNTRY_NAME: {DATA_TYPE: 'VarChar'},
            COUNTRY_ISO_CODE: {DATA_TYPE: 'VarChar'}
        },
        USERS: {
            USER_SOAS_ID: {DATA_TYPE: 'Int'},
            USER_SOAS_NAME: {DATA_TYPE: 'VarChar'},
            USER_SOAS_LOGIN: {DATA_TYPE: 'VarChar'},
            USER_SOAS_PASSWD: {DATA_TYPE: 'VarChar'},
            USER_ROLE: {DATA_TYPE: 'VarChar'},
            USER_LANGUAGE: {DATA_TYPE: 'VarChar'}
        },
        PROD_UNITS: {
            PROD_UNIT_NAME: {DATA_TYPE: 'VarChar'},
            PROD_UNIT_DESC: {DATA_TYPE: 'VarChar'},
            PROD_UNIT_SYMBOL: {DATA_TYPE: 'VarChar'}
        },
        PRILISTS: {
            ID: {DATA_TYPE: 'Int'},
            ITMNUM: {DATA_TYPE: 'VarChar'},
            PRICE_NET: {DATA_TYPE: 'Decimal'}, // decimal
            PRICE_BRU: {DATA_TYPE: 'Decimal'}, // decimal
            CURRENCY: {DATA_TYPE: 'VarChar'},
            PRILIST: {DATA_TYPE: 'VarChar'},
            CUSGRP: {DATA_TYPE: 'VarChar'},
            START_DATE: {DATA_TYPE: 'Date'}, // 'VarChar'
            END_DATE: {DATA_TYPE: 'Date'}, // 'VarChar'
            PRIORITY: {DATA_TYPE: 'Int'}
        },
        BATCH_PROCESSES: {
            BATCH_NAME: {DATA_TYPE: 'VarChar'},
            BATCH_DESCRIPTION: {DATA_TYPE: 'VarChar'},
            BATCH_FUNCTION: {DATA_TYPE: 'VarChar'},
            BATCH_INTERVAL: {DATA_TYPE: 'VarChar'},
            BATCH_ACTIVE: {DATA_TYPE: 'NVarChar'}, // Bit
            BATCH_LAST_RUN_START: {DATA_TYPE: 'SmallDateTime'}, // datetime
            BATCH_LAST_RUN_FINISH: {DATA_TYPE: 'SmallDateTime'}, // datetime
            BATCH_LAST_RUN_RESULT: {DATA_TYPE: 'VarChar'},
            BATCH_CODE: {DATA_TYPE: 'VarChar'},
            BATCH_CODE_REQUIRED: {DATA_TYPE: 'NVarChar'} // Bit
        },
        BATCH_FUNCTIONS : {
            soas_hourly_allocation_check: {
              warehouseLocation: '',
              testParameter:''
            },
            mssql_batch_process_book_inventory: null,
          },
        PAYMENT_TERMS: {
            PAYMENT_TERM_ID: {DATA_TYPE: 'VarChar'},
            PAYMENT_TERM_NAME: {DATA_TYPE: 'VarChar'},
            PAYMENT_TERM_COMMENT: {DATA_TYPE: 'VarChar'},
            PAYMENT_TERM_ACTIVE: {DATA_TYPE: 'NVarChar'}, // Bit
            PAYMENT_CONFIRMED: {DATA_TYPE: 'NVarChar'} // Bit
        },
        PROD_COMPONENTS: {
            ITMNUM: {DATA_TYPE: 'VarChar'},
            COMPNUM: {DATA_TYPE: 'VarChar'},
            PROD_QTY: {DATA_TYPE: 'Decimal'}, //decimal
            PROD_UNIT: {DATA_TYPE: 'VarChar'}
        },
        PROVIDERS: {
            PROVIDERS_NAME: {DATA_TYPE: 'VarChar'},
            PROVIDERS_COUNTRY: {DATA_TYPE: 'VarChar'},
            LANGUAGE: {DATA_TYPE: 'VarChar'},
            TAX_NUMBER: {DATA_TYPE: 'VarChar'},
            EU_UST_IDNR: {DATA_TYPE: 'VarChar'},
            CURRENCY: {DATA_TYPE: 'VarChar'}
        },
        TAXATION_RELATIONS: {
            TAXATION_NAME: {DATA_TYPE: 'VarChar'},
            TAXATION_RATE: {DATA_TYPE: 'Int'}
        },
        CSV_TEMPLATE_CONFIG: {
            CSVCONFIG_ID: {DATA_TYPE: 'Int'},
            CSVCONFIG_NAME: {DATA_TYPE: 'VarChar'},
            CSVCONFIG_TYPE: {DATA_TYPE: 'Int'},
            CSVCONFIG_ENCODING: {DATA_TYPE: 'VarChar'},
            CSVCONFIG_EOL: {DATA_TYPE: 'VarChar'},
            CSVCONFIG_DELIMITER: {DATA_TYPE: 'VarChar'}
        },
        CSV_TEMPLATE_CONFIG_FIELD: {
            ID: {DATA_TYPE: 'Int'},
            CSV_TEMPLATE_CONFIG_ID: {DATA_TYPE: 'Int'},
            NUM_IN_ORDER: {DATA_TYPE: 'Int'},
            SHORT_DESC: {DATA_TYPE: 'VarChar'},
            REQUIRED: {DATA_TYPE: 'Int'}
        },
        IMPORT_TYPE: {
            ID: {DATA_TYPE: 'Int'},
            IMPORT_TYPE_NAME: {DATA_TYPE: 'VarChar'},
            ACTIVE: {DATA_TYPE: 'Int'},
            CREATED: {DATA_TYPE: 'SmallDateTime'},
            CREATED_FROM: {DATA_TYPE: 'VarChar'}
        },
        IMPORT_TYPE_REFERENCED_TABLES: {
            ID: {DATA_TYPE: 'Int'},
            IMPORT_TYPE_ID: {DATA_TYPE: 'Int'},
            REFERENCED_TABLE: {DATA_TYPE: 'VarChar'}

        },
        IMPORT_TYPE_CONSTANTS: {
            ID: {DATA_TYPE: 'Int'},
            IMPORT_TYPE_REFERENCED_TABLES_ID: {DATA_TYPE: 'Int'},
            COLUMN_NAME: {DATA_TYPE: 'VarChar'},
            COLUMN_ACTIVE: {DATA_TYPE: 'Int'}
        },
        CSV_TEMPLATE_CONFIG_FIELD_TEMP: {
            ID: {DATA_TYPE: 'Int'},
            CSV_TEMPLATE_CONFIG_ID: {DATA_TYPE: 'Int'},
            NUM_IN_ORDER: {DATA_TYPE: 'Int'},
            SHORT_DESC: {DATA_TYPE: 'VarChar'},
            REQUIRED: {DATA_TYPE: 'Int'}
        },
        CROSSSELLING: {
            CROSSSELLING_ID: {DATA_TYPE: 'Int'},
            CROSSSELLING_DATA: {DATA_TYPE: 'VarChar'}
        },
        TAXCODES: {
            TAXCODE: {DATA_TYPE: 'VarChar'},
            DESCRIPTION: {DATA_TYPE: 'VarChar'},
            COUNTRY: {DATA_TYPE: 'VarChar'}
        },
        TAXRATES: {
            TAXCODE: {DATA_TYPE: 'VarChar'},
            PER_START: {DATA_TYPE: 'Date'},
            PER_END: {DATA_TYPE: 'Date'},
            TAXRATE: {DATA_TYPE: 'VarChar'}
        },
        SUPPLY_ORDERS: {
            PROVIDERS_ORDER:  {DATA_TYPE: 'VarChar'},
            PROVIDER:  {DATA_TYPE: 'VarChar'},
            CLIENT_DELIVERY:  {DATA_TYPE: 'VarChar'},
            CLIENT_INVOICE:  {DATA_TYPE: 'VarChar'},
            ORDERAMOUNT_NET:  {DATA_TYPE: 'Decimal'}, //decimal
            ORDERAMOUNT_BRU:  {DATA_TYPE: 'Decimal'}, //decimal
            ORDERREF:  {DATA_TYPE: 'VarChar'},
            CURRENCY:  {DATA_TYPE: 'VarChar'},
            SHIPPING_COSTS:  {DATA_TYPE: 'Decimal'}, //decimal
            WAREHOUSE:  {DATA_TYPE: 'VarChar'},
            ORDERS_DATE:  {DATA_TYPE: 'SmallDateTime'}, // datetime
            INTERCOMPANY:  {DATA_TYPE: 'Int'},
            ID:  {DATA_TYPE: 'Int'}
        },
        SUPPLY_ORDERS_POSITIONS: {
            SUPPLY_ORDERS_POSITIONS:  {DATA_TYPE: 'VarChar'},
            ITMNUM: {DATA_TYPE: 'VarChar'},
            ORDER_QTY: {DATA_TYPE: 'Int'},
            PRICE_NET: {DATA_TYPE: 'Decimal'}, //decimal
            PRICE_BRU: {DATA_TYPE: 'Decimal'}, //decimal
            SCHEDULED_ARRIVAL: {DATA_TYPE: 'SmallDateTime'},
            SUPPLIED_QTY: {DATA_TYPE: 'Int'},
            WAREHOUSE: {DATA_TYPE: 'VarChar'},
            ID: {DATA_TYPE: 'Int'}
        },
        WAREHOUSE_LOC: {
            ID: {DATA_TYPE: 'int'},
            LOC: {DATA_TYPE: 'VarChar'},
            WHLOC: {DATA_TYPE: 'VarChar'},
            STATUS_POS: {DATA_TYPE: 'VarChar'},
            VIRTUAL_LOC: {DATA_TYPE: 'Int'}
        }
    }
    // get new line number
    static readonly NEW_LINE_ITEM = {
        CUSTOMER: '/selectThisCustomer',
        ORDER: '/selectThisOrderNew',
        DELIVERY: '/selectThisOrderAvise',
        INVOICE: '/selectThisDeliveryNote',
    }

    static readonly IMPORT_TYPES = {
        CSV: 'CSV',
        SQL: 'SQL'
    };

    static readonly QUERY_TYPES = {
        SELECT: 'SELECT',
        UPDATE: 'UPDATE',
        INSERT: 'INSERT'
    };

    static readonly QUERY_PAGE_DEFAULT: number = 0;
    static readonly QUERY_SIZE_DEFAULT: number = 10;
}

export type SequelizeModel =
    | Article
    | Attribute
    | AttributeName
    | BatchProcess
    | Comment
    | Company
    | CompanyLocation
    | Country
    | CrossSelling
    | Currency
    | Customer
    | CustomerAddress
    | DeliveryNote
    | DeliveryNotePosition
    | DistComponent
    | FormTemplate
    | ImportTemplate
    | ImportType
    | ImportTypeConstant
    | ImportTypeReferencedTable
    | Invoice
    | InvoicePosition
    | ItemLock
    | ItmVariant
    | Language
    | LocalizeIt
    | Order
    | OrderPosition
    | PaymentTerm
    | Prilist
    | ProdComponent
    | ProdUnit
    | Provider
    | PurchaseOrder
    | ReCrediting
    | ReCreditingPosition
    | Role
    | SaleOffer
    | SaleOfferPosition
    | State
    | SupplyOrder
    | SupplyOrderPosition
    | TableLock
    | TableTemplate
    | TaxCode
    | TaxRate
    | TaxationRelation
    | User
    | WarehouseLoc
    | WarehouseReservationCache
    | Warehousing

export type SequelizeModelStatic = typeof Model & (new(values?: object, options?: BuildOptions) => SequelizeModel);

export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500
}
