import {CustomerAddressInterface, CustomerAddressDataInterface} from "./interfaces/CustomerAddressInterface";

export class CustomerAddress implements CustomerAddressInterface {

    private _id: number;
    private _customerAddressType: string;
    private _customersNumber: string;
    private _customerAddressIsoCode: string;
    private _customerAddressCountryName: string;
    private _customerAddressStreet: string;
    private _customerAddressCity: string;
    private _customerAddressPostcode: string;
    private _customerAddressComment: string;
    private _customerAddressTaxCode: string;
    private _customerAddressNameAddr: string;
    private _customerAddressEmail: string;
    private _customerAddressPhone: string;

    constructor(customerAddressData: CustomerAddressDataInterface) {
        this._id = customerAddressData.ID;
        this._customerAddressType = customerAddressData.ADDRESS_TYPE;
        this._customersNumber = customerAddressData.CUSTOMERS_NUMBER;
        this._customerAddressIsoCode = customerAddressData.ADDRESS_ISO_CODE;
        this._customerAddressCountryName = customerAddressData.ADDRESS_CRYNAME;
        this._customerAddressStreet = customerAddressData.ADDRESS_STREET;
        this._customerAddressCity = customerAddressData.ADDRESS_CITY;
        this._customerAddressPostcode = customerAddressData.ADDRESS_POSTCODE;
        this._customerAddressComment = customerAddressData.ADDRESS_COMMENT;
        this._customerAddressTaxCode = customerAddressData.TAXCODE;
        this._customerAddressNameAddr = customerAddressData.NAME_ADDR;
        this._customerAddressEmail = customerAddressData.EMAIL;
        this._customerAddressPhone = customerAddressData.PHONE;
    }

    get customerAddressData(): CustomerAddressDataInterface {
        return {
            ID: this._id,
            ADDRESS_TYPE: this._customerAddressType,
            CUSTOMERS_NUMBER: this._customersNumber,
            ADDRESS_ISO_CODE: this._customerAddressIsoCode,
            ADDRESS_CRYNAME: this._customerAddressCountryName,
            ADDRESS_STREET: this._customerAddressStreet,
            ADDRESS_CITY: this._customerAddressCity,
            ADDRESS_POSTCODE: this._customerAddressPostcode,
            ADDRESS_COMMENT: this._customerAddressComment,
            TAXCODE: this._customerAddressTaxCode,
            NAME_ADDR: this._customerAddressNameAddr,
            EMAIL: this._customerAddressEmail,
            PHONE: this._customerAddressPhone
        }
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get customerAddressType(): string {
        return this._customerAddressType;
    }

    set customerAddressType(value: string) {
        this._customerAddressType = value;
    }

    get customerAddressComment(): string {
        return this._customerAddressComment;
    }

    set customerAddressComment(value: string) {
        this._customerAddressComment = value;
    }

    get customersNumber(): string {
        return this._customersNumber;
    }

    set customersNumber(value: string) {
        this._customersNumber = value;
    }

    get customerAddressIsoCode(): string {
        return this._customerAddressIsoCode;
    }

    set customerAddressIsoCode(value: string) {
        this._customerAddressIsoCode = value;
    }

    get customerAddressCountryName(): string {
        return this._customerAddressCountryName;
    }

    set customerAddressCountryName(value: string) {
        this._customerAddressCountryName = value;
    }

    get customerAddressStreet(): string {
        return this._customerAddressStreet;
    }

    set customerAddressStreet(value: string) {
        this._customerAddressStreet = value;
    }

    get customerAddressCity(): string {
        return this._customerAddressCity;
    }

    set customerAddressCity(value: string) {
        this._customerAddressCity = value;
    }

    get customerAddressPostcode(): string {
        return this._customerAddressPostcode;
    }

    set customerAddressPostcode(value: string) {
        this._customerAddressPostcode = value;
    }

    get customerAddressTaxCode(): string {
        return this._customerAddressTaxCode;
    }

    set customerAddressTaxCode(value: string) {
        this._customerAddressTaxCode = value;
    }

    get customerAddressNameAddr(): string {
        return this._customerAddressNameAddr;
    }

    set customerAddressNameAddr(value: string) {
        this._customerAddressNameAddr = value;
    }

    get customerAddressEmail(): string {
        return this._customerAddressEmail;
    }

    set customerAddressEmail(value: string) {
        this._customerAddressEmail = value;
    }

    get customerAddressPhone(): string {
        return this._customerAddressPhone;
    }

    set customerAddressPhone(value: string) {
        this._customerAddressPhone = value;
    }
}
