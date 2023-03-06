export interface CustomerInterface {
    customerNumber: string;
    customerPreName: string;
    customerName: string;
    customerCompany: string;
    customerLanguage: string
    customerCreateDate: string;
    customerEmail: string;
    customerPhone: string;
    customerType: string;
    customerEecNumber: string;
    customerEdiInvoice: boolean;
    customerEdiOrderSp: boolean;
    customerEdiDesadv: boolean;
    customerEmailRg: string;
    customerEmailLi: string;
    customerEmailAu: string;
    customerPhone0: string;
    customerPhone1: string;
    customerFax0: string;
    customerMob0: string;
    customerMob1: string;
    customerCrnnum: string;
    customerPaymentTermId: string;
}

export interface CustomerDataInterface {
    CUSTOMERS_NUMBER: string;
    CUSTOMERS_PRENAME: string;
    CUSTOMERS_NAME: string;
    CUSTOMERS_COMPANY: string;
    CUSTOMERS_TYPE: string;
    LANGUAGE: string;
    CREATE_DATE: string;
    CUSTOMERS_EMAIL: string;
    CUSTOMERS_PHONE: string;
    EEC_NUM: string;
    EDI_INVOIC: boolean;
    EDI_ORDERSP: boolean;
    EDI_DESADV: boolean;
    EMAIL_RG: string;
    EMAIL_LI: string;
    EMAIL_AU: string;
    PHONE_0: string;
    PHONE_1: string;
    FAX_0: string;
    MOB_0: string;
    MOB_1: string;
    CRNNUM: string;
    PAYMENT_TERM_ID: string;
}
