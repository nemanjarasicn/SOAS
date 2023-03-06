import {CustomersAddr} from "../interfaces/customers-addr-item";

export class CustomerAdrr implements CustomersAddr {

  constructor(
    public ID: number,
    public ADDRESS_TYPE: string,
    public CUSTOMERS_NUMBER: string,
    public ADDRESS_ISO_CODE: string,
    public ADDRESS_CRYNAME: string,
    public ADDRESS_STREET: string,
    public ADDRESS_CITY: string,
    public ADDRESS_POSTCODE: string,
    public ADDRESS_COMMENT: string,
    public TAXCODE: string,
    public NAME_ADDR: string,
    public EMAIL: string,
    public PHONE: string,
    public ADDRESS_ID: string
  ) {
    this.ID = ID;
    this.ADDRESS_TYPE = ADDRESS_TYPE;
    this.CUSTOMERS_NUMBER = CUSTOMERS_NUMBER;
    this.ADDRESS_ISO_CODE = ADDRESS_ISO_CODE;
    this.ADDRESS_CRYNAME = ADDRESS_CRYNAME;
    this.ADDRESS_STREET = ADDRESS_STREET;
    this.ADDRESS_CITY = ADDRESS_CITY;
    this.ADDRESS_POSTCODE = ADDRESS_POSTCODE;
    this.ADDRESS_COMMENT = ADDRESS_COMMENT;
    this.TAXCODE = TAXCODE;
    this.NAME_ADDR = NAME_ADDR;
    this.EMAIL = EMAIL;
    this.PHONE = PHONE;
    this.ADDRESS_ID = ADDRESS_ID;
  }

  // setCustomerNumber(number: string) {
  //   this.CUSTOMERS_NUMBER = number;
  // }
}
