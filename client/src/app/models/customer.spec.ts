import {Customer} from "./customer";
import {CustomersTestConstants} from "../../assets/test-constants/customers";

describe('Customer', () => {
  it('should create an instance', () => {
    // Arrange
    const CUSTOMERS_NUMBER: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_NUMBER;
    const CUSTOMERS_PRENAME: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_PRENAME;
    const CUSTOMERS_NAME: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_NAME;
    const CUSTOMERS_COMPANY: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_COMPANY;
    const LANGUAGE: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.LANGUAGE;
    const CREATE_DATE: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CREATE_DATE;
    const EEC_NUM: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.EEC_NUM;
    const EDI_INVOIC: boolean = CustomersTestConstants.CUSTOMER_B2C_ITEM.EDI_INVOIC;
    const EDI_ORDERSP: boolean = CustomersTestConstants.CUSTOMER_B2C_ITEM.EDI_ORDERSP;
    const EDI_DESADV: boolean = CustomersTestConstants.CUSTOMER_B2C_ITEM.EDI_DESADV;
    const CUSTOMERS_EMAIL: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_EMAIL;
    const CUSTOMERS_PHONE: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_PHONE;
    const CUSTOMERS_TYPE: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CUSTOMERS_TYPE;
    const EMAIL_RG: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.EMAIL_RG;
    const EMAIL_LI: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.EMAIL_LI;
    const EMAIL_AU: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.EMAIL_AU;
    const PHONE_0: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.PHONE_0;
    const PHONE_1: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.PHONE_1;
    const FAX_0: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.FAX_0;
    const MOB_0: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.MOB_0;
    const MOB_1: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.MOB_1;
    const CRNNUM: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.CRNNUM;
    const PAYMENT_TERM_ID: string = CustomersTestConstants.CUSTOMER_B2C_ITEM.PAYMENT_TERM_ID;
    // Act & Assert
    expect(new Customer(CUSTOMERS_NUMBER, CUSTOMERS_PRENAME, CUSTOMERS_NAME, CUSTOMERS_COMPANY, LANGUAGE,
      CREATE_DATE, EEC_NUM, EDI_INVOIC, EDI_ORDERSP, EDI_DESADV, CUSTOMERS_EMAIL, CUSTOMERS_PHONE, CUSTOMERS_TYPE,
      EMAIL_RG, EMAIL_LI, EMAIL_AU, PHONE_0, PHONE_1, FAX_0, MOB_0, MOB_1, CRNNUM, PAYMENT_TERM_ID)
    ).toBeTruthy();
  });
});
