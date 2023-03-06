import {Custbtwoc, CustbtwocDataInterface} from '../interfaces/custbtwoc-item';

export class Customer {

    // private _customerNumber: string;
    // private _customerPreName: string;
    // private _customerName: string;
    // private _customerCompany: string;
    // private _customerLanguage: string;
    // private _customerCreateDate: string;
    // private _customerEmail: string;
    // private _customerPhone: string;
    // private _customerType: string;
    // private _customerEecNumber: string;
    // private _customerEdiInvoice: boolean;
    // private _customerEdiOrderSp: boolean;
    // private _customerEdiDesadv: boolean;
    // private _customerPaymentCondition: string;
    // private _customerEmailRg: string;
    // private _customerEmailLi: string;
    // private _customerEmailAu: string;
    // private _customerPhone0: string;
    // private _customerPhone1: string;
    // private _customerFax0: string;
    // private _customerMob0: string;
    // private _customerMob1: string;
    // private _customerCrnnum: string;
    // private _customerPaymentTermId: string;

    constructor(
        public CUSTOMERS_NUMBER: string,
        public CUSTOMERS_PRENAME: string,
        public CUSTOMERS_NAME: string,
        public CUSTOMERS_COMPANY: string,
        public LANGUAGE: string,
        public CREATE_DATE: string,
        public EEC_NUM: string,
        public EDI_INVOIC: boolean,
        public EDI_ORDERSP: boolean,
        public EDI_DESADV: boolean,
        public CUSTOMERS_EMAIL: string,
        public CUSTOMERS_PHONE: string,
        public CUSTOMERS_TYPE: string,
        public EMAIL_RG: string,
        public EMAIL_LI: string,
        public EMAIL_AU: string,
        public PHONE_0: string,
        public PHONE_1: string,
        public FAX_0: string,
        public MOB_0: string,
        public MOB_1: string,
        public CRNNUM: string,
        public PAYMENT_TERM_ID: string
    ) {
    }

    // get customerData(): CustbtwocDataInterface {
    //     return {
    //         CUSTOMERS_NUMBER: this._customerNumber,
    //         CUSTOMERS_PRENAME: this._customerPreName,
    //         CUSTOMERS_NAME: this._customerName,
    //         CUSTOMERS_COMPANY: this._customerCompany,
    //         LANGUAGE: this._customerLanguage,
    //         CREATE_DATE: this._customerCreateDate,
    //         CUSTOMERS_EMAIL: this._customerEmail,
    //         CUSTOMERS_PHONE: this._customerPhone,
    //         CUSTOMERS_TYPE: this._customerType,
    //         EEC_NUM: this._customerEecNumber,
    //         EDI_INVOIC: this._customerEdiInvoice,
    //         EDI_ORDERSP: this._customerEdiOrderSp,
    //         EDI_DESADV: this._customerEdiDesadv,
    //         EMAIL_RG: this._customerEmailRg,
    //         EMAIL_LI: this._customerEmailLi,
    //         EMAIL_AU: this._customerEmailAu,
    //         PHONE_0: this._customerPhone0,
    //         PHONE_1: this._customerPhone1,
    //         FAX_0: this._customerFax0,
    //         MOB_0: this._customerMob0,
    //         MOB_1: this._customerMob1,
    //         CRNNUM: this._customerCrnnum,
    //         PAYMENT_TERM_ID: this._customerPaymentTermId
    //     }
    // }
    //
    // get customerType(): string {
    //     return this._customerType;
    // }
    //
    // get customerNumber(): string {
    //     return this._customerNumber;
    // }
    //
    // set customerNumber(value: string) {
    //     this._customerNumber = value;
    // }
    //
    // get customerPreName(): string {
    //     return this._customerPreName;
    // }
    //
    // set customerPreName(value: string) {
    //     this._customerPreName = value;
    // }
    //
    // get customerName(): string {
    //     return this._customerName;
    // }
    //
    // set customerName(value: string) {
    //     this._customerName = value;
    // }
    //
    // get customerCompany(): string {
    //     return this._customerCompany;
    // }
    //
    // set customerCompany(value: string) {
    //     this._customerCompany = value;
    // }
    //
    // get customerLanguage(): string {
    //     return this._customerLanguage;
    // }
    //
    // set customerLanguage(value: string) {
    //     this._customerLanguage = value;
    // }
    //
    // get customerCreateDate(): string {
    //     return this._customerCreateDate;
    // }
    //
    // set customerCreateDate(value: string) {
    //     this._customerCreateDate = value;
    // }
    //
    // get customerEmail(): string {
    //     return this._customerEmail;
    // }
    //
    // set customerEmail(value: string) {
    //     this._customerEmail = value;
    // }
    //
    // get customerPhone(): string {
    //     return this._customerPhone;
    // }
    //
    // set customerPhone(value: string) {
    //     this._customerPhone = value;
    // }
    //
    // get customerPaymentCondition(): string {
    //     return this._customerPaymentCondition;
    // }
    //
    // set customerPaymentCondition(value: string) {
    //     this._customerPaymentCondition = value;
    // }
    //
    // get customerEmailRg(): string {
    //     return this._customerEmailRg;
    // }
    //
    // set customerEmailRg(value: string) {
    //     this._customerEmailRg = value;
    // }
    //
    // get customerEmailLi(): string {
    //     return this._customerEmailLi;
    // }
    //
    // set customerEmailLi(value: string) {
    //     this._customerEmailLi = value;
    // }
    //
    // get customerEmailAu(): string {
    //     return this._customerEmailAu;
    // }
    //
    // set customerEmailAu(value: string) {
    //     this._customerEmailAu = value;
    // }
    //
    // get customerPhone0(): string {
    //     return this._customerPhone0;
    // }
    //
    // set customerPhone0(value: string) {
    //     this._customerPhone0 = value;
    // }
    //
    // get customerPhone1(): string {
    //     return this._customerPhone1;
    // }
    //
    // set customerPhone1(value: string) {
    //     this._customerPhone1 = value;
    // }
    //
    // get customerFax0(): string {
    //     return this._customerFax0;
    // }
    //
    // set customerFax0(value: string) {
    //     this._customerFax0 = value;
    // }
    //
    // get customerMob0(): string {
    //     return this._customerMob0;
    // }
    //
    // set customerMob0(value: string) {
    //     this._customerMob0 = value;
    // }
    //
    // get customerMob1(): string {
    //     return this._customerMob1;
    // }
    //
    // set customerMob1(value: string) {
    //     this._customerMob1 = value;
    // }
    //
    // get customerCrnnum(): string {
    //     return this._customerCrnnum;
    // }
    //
    // set customerCrnnum(value: string) {
    //     this._customerCrnnum = value;
    // }
    //
    // get customerPaymentTermId(): string {
    //     return this._customerPaymentTermId;
    // }
    //
    // set customerPaymentTermId(value: string) {
    //     this._customerPaymentTermId = value;
    // }
    //
    // get customerEecNumber(): string {
    //     return this._customerEecNumber;
    // }
    //
    // set customerEecNumber(value: string) {
    //     this._customerEecNumber = value;
    // }
    //
    // get customerEdiInvoice(): boolean {
    //     return this._customerEdiInvoice;
    // }
    //
    // set customerEdiInvoice(value: boolean) {
    //     this._customerEdiInvoice = value;
    // }
    //
    // get customerEdiOrderSp(): boolean {
    //     return this._customerEdiOrderSp;
    // }
    //
    // set customerEdiOrderSp(value: boolean) {
    //     this._customerEdiOrderSp = value;
    // }
    //
    // get customerEdiDesadv(): boolean {
    //     return this._customerEdiDesadv;
    // }
    //
    // set customerEdiDesadv(value: boolean) {
    //     this._customerEdiDesadv = value;
    // }
}
