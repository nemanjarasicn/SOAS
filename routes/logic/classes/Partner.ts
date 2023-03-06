import {PartnerInterface, PartnerDataInterface} from "./interfaces/PartnerInterface";

export class Partner implements PartnerInterface {
    private _partnerNumber: string;
    private _partnerPreName: string;
    private _partnerName: string;
    private _partnerCompany: string;
    private _partnerLanguage: string;
    private _partnerCreateDate: string;
    private _partnerEmail: string;
    private _partnerPhone: string;
    private _partnerType: string;
    private _partnerEecNumber: string;
    private _partnerEdiInvoice: string;
    private _partnerEdiOrderSp: string;
    private _partnerEdiDesadv: string;
    private _partnerPaymentCondition: string;
    private _partnerEmailRg: string;
    private _partnerEmailLi: string;
    private _partnerEmailAu: string;
    private _partnerPhone0: string;
    private _partnerPhone1: string;
    private _partnerFax0: string;
    private _partnerMob0: string;
    private _partnerMob1: string;
    private _partnerCrnnum: string;
    private _partnerPaymentTermId: string;

    constructor(partnerData: PartnerDataInterface) {
        this._partnerNumber = partnerData.CUSTOMERS_NUMBER;
        this._partnerPreName = partnerData.CUSTOMERS_PRENAME;
        this._partnerName = partnerData.CUSTOMERS_NAME;
        this._partnerCompany = partnerData.CUSTOMERS_COMPANY;
        this._partnerLanguage = partnerData.LANGUAGE;
        this._partnerCreateDate = partnerData.CREATE_DATE;
        this._partnerEmail = partnerData.CUSTOMERS_EMAIL;
        this._partnerPhone = partnerData.CUSTOMERS_PHONE;
        this._partnerType = partnerData.CUSTOMERS_TYPE; // 'B2B'; //
        this._partnerEecNumber = partnerData.EEC_NUM;
        this._partnerEdiInvoice = partnerData.EDI_INVOIC;
        this._partnerEdiOrderSp = partnerData.EDI_ORDERSP;
        this._partnerEdiDesadv = partnerData.EDI_DESADV;
        this._partnerEmailRg = partnerData.EMAIL_RG;
        this._partnerEmailLi = partnerData.EMAIL_LI;
        this._partnerEmailAu = partnerData.EMAIL_AU;
        this._partnerPhone0 = partnerData.PHONE_0;
        this._partnerPhone1 = partnerData.PHONE_1;
        this._partnerFax0 = partnerData.FAX_0;
        this._partnerMob0 = partnerData.MOB_0;
        this._partnerMob1 = partnerData.MOB_1;
        this._partnerCrnnum = partnerData.CRNNUM;
        this._partnerPaymentTermId = partnerData.PAYMENT_TERM_ID;
    }

    get partnerData(): PartnerDataInterface {
        return {
            CUSTOMERS_NUMBER: this._partnerNumber,
            CUSTOMERS_PRENAME: this._partnerPreName,
            CUSTOMERS_NAME: this._partnerName,
            CUSTOMERS_COMPANY: this._partnerCompany,
            LANGUAGE: this._partnerLanguage,
            CREATE_DATE: this._partnerCreateDate,
            CUSTOMERS_EMAIL: this._partnerEmail,
            CUSTOMERS_PHONE: this._partnerPhone,
            CUSTOMERS_TYPE: this._partnerType,
            EEC_NUM: this._partnerEecNumber,
            EDI_INVOIC: this._partnerEdiInvoice,
            EDI_ORDERSP: this._partnerEdiOrderSp,
            EDI_DESADV: this._partnerEdiDesadv,
            EMAIL_RG: this._partnerEmailRg,
            EMAIL_LI: this._partnerEmailLi,
            EMAIL_AU: this._partnerEmailAu,
            PHONE_0: this._partnerPhone0,
            PHONE_1: this._partnerPhone1,
            FAX_0: this._partnerFax0,
            MOB_0: this._partnerMob0,
            MOB_1: this._partnerMob1,
            CRNNUM: this._partnerCrnnum,
            PAYMENT_TERM_ID: this._partnerPaymentTermId
        }
    }

    get partnerCompany(): string {
        return this._partnerCompany;
    }

    set partnerCompany(value: string) {
        this._partnerCompany = value;
    }

    get partnerCreateDate(): string {
        return this._partnerCreateDate;
    }

    set partnerCreateDate(value: string) {
        this._partnerCreateDate = value;
    }

    get partnerEecNumber(): string {
        return this._partnerEecNumber;
    }

    set partnerEecNumber(value: string) {
        this._partnerEecNumber = value;
    }

    get partnerEmail(): string {
        return this._partnerEmail;
    }

    set partnerEmail(value: string) {
        this._partnerEmail = value;
    }

    get partnerEdiInvoice(): string {
        return this._partnerEdiInvoice;
    }

    set partnerEdiInvoice(value: string) {
        this._partnerEdiInvoice = value;
    }

    get partnerLanguage(): string {
        return this._partnerLanguage;
    }

    set partnerLanguage(value: string) {
        this._partnerLanguage = value;
    }

    get partnerName(): string {
        return this._partnerName;
    }

    set partnerName(value: string) {
        this._partnerName = value;
    }

    get partnerNumber(): string {
        return this._partnerNumber;
    }

    set partnerNumber(value: string) {
        this._partnerNumber = value;
    }

    get partnerPhone(): string {
        return this._partnerPhone;
    }

    set partnerPhone(value: string) {
        this._partnerPhone = value;
    }

    get partnerPreName(): string {
        return this._partnerPreName;
    }

    set partnerPreName(value: string) {
        this._partnerPreName = value;
    }

    get partnerType(): string {
        return this._partnerType;
    }

    get partnerEdiOrderSp(): string {
        return this._partnerEdiOrderSp;
    }

    set partnerEdiOrderSp(value: string) {
        this._partnerEdiOrderSp = value;
    }

    get partnerEdiDesadv(): string {
        return this._partnerEdiDesadv;
    }

    set partnerEdiDesadv(value: string) {
        this._partnerEdiDesadv = value;
    }

    get partnerEmailRg(): string {
        return this._partnerEmailRg;
    }

    set partnerEmailRg(value: string) {
        this._partnerEmailRg = value;
    }

    get partnerEmailLi(): string {
        return this._partnerEmailLi;
    }

    set partnerEmailLi(value: string) {
        this._partnerEmailLi = value;
    }

    get partnerEmailAu(): string {
        return this._partnerEmailAu;
    }

    set partnerEmailAu(value: string) {
        this._partnerEmailAu = value;
    }

    get partnerPhone0(): string {
        return this._partnerPhone0;
    }

    set partnerPhone0(value: string) {
        this._partnerPhone0 = value;
    }

    get partnerPhone1(): string {
        return this._partnerPhone1;
    }

    set partnerPhone1(value: string) {
        this._partnerPhone1 = value;
    }

    get partnerFax0(): string {
        return this._partnerFax0;
    }

    set partnerFax0(value: string) {
        this._partnerFax0 = value;
    }

    get partnerMob0(): string {
        return this._partnerMob0;
    }

    set partnerMob0(value: string) {
        this._partnerMob0 = value;
    }

    get partnerMob1(): string {
        return this._partnerMob1;
    }

    set partnerMob1(value: string) {
        this._partnerMob1 = value;
    }

    get partnerCrnnum(): string {
        return this._partnerCrnnum;
    }

    set partnerCrnnum(value: string) {
        this._partnerCrnnum = value;
    }

    get partnerPaymentTermId(): string {
        return this._partnerPaymentTermId;
    }

    set partnerPaymentTermId(value: string) {
        this._partnerPaymentTermId = value;
    }
}
