import {CustomerInterface, CustomerDataInterface} from "./interfaces/CustomerInterface";

export class Customer implements CustomerInterface {

    private _customerNumber: string;
    private _customerPreName: string;
    private _customerName: string;
    private _customerCompany: string;
    private _customerLanguage: string;
    private _customerCreateDate: string;
    private _customerEmail: string;
    private _customerPhone: string;
    private _customerType: string;
    private _customerEecNumber: string;
    private _customerEdiInvoice: boolean;
    private _customerEdiOrderSp: boolean;
    private _customerEdiDesadv: boolean;
    private _customerPaymentCondition: string;
    private _customerEmailRg: string;
    private _customerEmailLi: string;
    private _customerEmailAu: string;
    private _customerPhone0: string;
    private _customerPhone1: string;
    private _customerFax0: string;
    private _customerMob0: string;
    private _customerMob1: string;
    private _customerCrnnum: string;
    private _customerPaymentTermId: string;

    constructor(customerData: CustomerDataInterface) {
        this._customerNumber = customerData.CUSTOMERS_NUMBER;
        this._customerPreName = customerData.CUSTOMERS_PRENAME;
        this._customerName = customerData.CUSTOMERS_NAME;
        this._customerCompany = customerData.CUSTOMERS_COMPANY;
        this._customerLanguage = customerData.LANGUAGE;
        this._customerCreateDate = customerData.CREATE_DATE;
        this._customerEmail = customerData.CUSTOMERS_EMAIL;
        this._customerPhone = customerData.CUSTOMERS_PHONE;
        this._customerType = customerData.CUSTOMERS_TYPE; //'B2C';
        this._customerEecNumber = customerData.EEC_NUM
        this._customerEdiInvoice = customerData.EDI_INVOIC;
        this._customerEdiOrderSp = customerData.EDI_ORDERSP;
        this._customerEdiDesadv = customerData.EDI_DESADV;
        this._customerEmailRg = customerData.EMAIL_RG;
        this._customerEmailLi = customerData.EMAIL_LI;
        this._customerEmailAu = customerData.EMAIL_AU;
        this._customerPhone0 = customerData.PHONE_0;
        this._customerPhone1 = customerData.PHONE_1;
        this._customerFax0 = customerData.FAX_0;
        this._customerMob0 = customerData.MOB_0;
        this._customerMob1 = customerData.MOB_1;
        this._customerCrnnum = customerData.CRNNUM;
        this._customerPaymentTermId = customerData.PAYMENT_TERM_ID;
    }

    get customerData(): CustomerDataInterface {
        return {
            CUSTOMERS_NUMBER: this._customerNumber,
            CUSTOMERS_PRENAME: this._customerPreName,
            CUSTOMERS_NAME: this._customerName,
            CUSTOMERS_COMPANY: this._customerCompany,
            LANGUAGE: this._customerLanguage,
            CREATE_DATE: this._customerCreateDate,
            CUSTOMERS_EMAIL: this._customerEmail,
            CUSTOMERS_PHONE: this._customerPhone,
            CUSTOMERS_TYPE: this._customerType,
            EEC_NUM: this._customerEecNumber,
            EDI_INVOIC: this._customerEdiInvoice,
            EDI_ORDERSP: this._customerEdiOrderSp,
            EDI_DESADV: this._customerEdiDesadv,
            EMAIL_RG: this._customerEmailRg,
            EMAIL_LI: this._customerEmailLi,
            EMAIL_AU: this._customerEmailAu,
            PHONE_0: this._customerPhone0,
            PHONE_1: this._customerPhone1,
            FAX_0: this._customerFax0,
            MOB_0: this._customerMob0,
            MOB_1: this._customerMob1,
            CRNNUM: this._customerCrnnum,
            PAYMENT_TERM_ID: this._customerPaymentTermId
        }
    }

    get customerType(): string {
        return this._customerType;
    }

    /*    set customerType(value: string) {
            this._customerType = value;
        }*/

    get customerNumber(): string {
        return this._customerNumber;
    }

    set customerNumber(value: string) {
        this._customerNumber = value;
    }

    get customerPreName(): string {
        return this._customerPreName;
    }

    set customerPreName(value: string) {
        this._customerPreName = value;
    }

    get customerName(): string {
        return this._customerName;
    }

    set customerName(value: string) {
        this._customerName = value;
    }

    get customerCompany(): string {
        return this._customerCompany;
    }

    set customerCompany(value: string) {
        this._customerCompany = value;
    }

    get customerLanguage(): string {
        return this._customerLanguage;
    }

    set customerLanguage(value: string) {
        this._customerLanguage = value;
    }

    get customerCreateDate(): string {
        return this._customerCreateDate;
    }

    set customerCreateDate(value: string) {
        this._customerCreateDate = value;
    }

    get customerEmail(): string {
        return this._customerEmail;
    }

    set customerEmail(value: string) {
        this._customerEmail = value;
    }

    get customerPhone(): string {
        return this._customerPhone;
    }

    set customerPhone(value: string) {
        this._customerPhone = value;
    }

    get customerEmailRg(): string {
        return this._customerEmailRg;
    }

    set customerEmailRg(value: string) {
        this._customerEmailRg = value;
    }

    get customerEmailLi(): string {
        return this._customerEmailLi;
    }

    set customerEmailLi(value: string) {
        this._customerEmailLi = value;
    }

    get customerEmailAu(): string {
        return this._customerEmailAu;
    }

    set customerEmailAu(value: string) {
        this._customerEmailAu = value;
    }

    get customerPhone0(): string {
        return this._customerPhone0;
    }

    set customerPhone0(value: string) {
        this._customerPhone0 = value;
    }

    get customerPhone1(): string {
        return this._customerPhone1;
    }

    set customerPhone1(value: string) {
        this._customerPhone1 = value;
    }

    get customerFax0(): string {
        return this._customerFax0;
    }

    set customerFax0(value: string) {
        this._customerFax0 = value;
    }

    get customerMob0(): string {
        return this._customerMob0;
    }

    set customerMob0(value: string) {
        this._customerMob0 = value;
    }

    get customerMob1(): string {
        return this._customerMob1;
    }

    set customerMob1(value: string) {
        this._customerMob1 = value;
    }

    get customerCrnnum(): string {
        return this._customerCrnnum;
    }

    set customerCrnnum(value: string) {
        this._customerCrnnum = value;
    }

    get customerPaymentTermId(): string {
        return this._customerPaymentTermId;
    }

    set customerPaymentTermId(value: string) {
        this._customerPaymentTermId = value;
    }

    get customerEecNumber(): string {
        return this._customerEecNumber;
    }

    set customerEecNumber(value: string) {
        this._customerEecNumber = value;
    }

    get customerEdiInvoice(): boolean {
        return this._customerEdiInvoice;
    }

    set customerEdiInvoice(value: boolean) {
        this._customerEdiInvoice = value;
    }

    get customerEdiOrderSp(): boolean {
        return this._customerEdiOrderSp;
    }

    set customerEdiOrderSp(value: boolean) {
        this._customerEdiOrderSp = value;
    }

    get customerEdiDesadv(): boolean {
        return this._customerEdiDesadv;
    }

    set customerEdiDesadv(value: boolean) {
        this._customerEdiDesadv = value;
    }

}
