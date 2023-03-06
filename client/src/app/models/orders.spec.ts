import {Orders} from "./orders";
import {OrdersTestConstants} from "../../assets/test-constants/orders";

describe('Orders', () => {
  it('should create an instance', () => {
    // Arrange
    const ORDERS_NUMBER: string = OrdersTestConstants.ORDERS_ITEM.ORDERS_NUMBER;
    const CLIENT: string = OrdersTestConstants.ORDERS_ITEM.CLIENT;
    const ORDERS_TYPE: string = OrdersTestConstants.ORDERS_ITEM.ORDERS_TYPE;
    const CUSTOMER_ORDER: string = OrdersTestConstants.ORDERS_ITEM.CUSTOMER_ORDER;
    const CUSTOMER_ADDRESSES_ID_DELIVERY: number = OrdersTestConstants.ORDERS_ITEM.CUSTOMER_ADDRESSES_ID_DELIVERY;
    const CUSTOMER_ADDRESSES_ID_INVOICE: number = OrdersTestConstants.ORDERS_ITEM.CUSTOMER_ADDRESSES_ID_INVOICE;
    const CUSTOMER_DELIVERY: string = OrdersTestConstants.ORDERS_ITEM.CUSTOMER_DELIVERY;
    const CUSTOMER_INVOICE: string = OrdersTestConstants.ORDERS_ITEM.CUSTOMER_INVOICE;
    const ORDERS_DATE: string = OrdersTestConstants.ORDERS_ITEM.ORDERS_DATE;
    const ORDERAMOUNT_NET: number = OrdersTestConstants.ORDERS_ITEM.ORDERAMOUNT_NET;
    const ORDERAMOUNT_BRU: number = OrdersTestConstants.ORDERS_ITEM.ORDERAMOUNT_BRU;
    const CURRENCY: string = OrdersTestConstants.ORDERS_ITEM.CURRENCY;
    const PAYMENT_TERM_ID: string = OrdersTestConstants.ORDERS_ITEM.PAYMENT_TERM_ID;
    const CUSTOMER_ORDERREF: string = OrdersTestConstants.ORDERS_ITEM.CUSTOMER_ORDERREF;
    const LAST_DELIVERY: string = OrdersTestConstants.ORDERS_ITEM.LAST_DELIVERY;
    const LAST_INVOICE: string = OrdersTestConstants.ORDERS_ITEM.LAST_INVOICE;
    const EDI_ORDERRESPONSE_SENT: boolean = OrdersTestConstants.ORDERS_ITEM.EDI_ORDERRESPONSE_SENT;
    const RELEASE: boolean = OrdersTestConstants.ORDERS_ITEM.RELEASE;
    const PAYED: boolean = OrdersTestConstants.ORDERS_ITEM.PAYED;
    const ORDERS_STATE: number = OrdersTestConstants.ORDERS_ITEM.ORDERS_STATE;
    const WEBSHOP_ID: number = OrdersTestConstants.ORDERS_ITEM.WEBSHOP_ID;
    const WEBSHOP_ORDER_REF: string = OrdersTestConstants.ORDERS_ITEM.WEBSHOP_ORDER_REF;
    const DISCOUNT: number = OrdersTestConstants.ORDERS_ITEM.DISCOUNT;
    const VOUCHER: number = OrdersTestConstants.ORDERS_ITEM.VOUCHER;
    const SHIPPING_COSTS: number = OrdersTestConstants.ORDERS_ITEM.SHIPPING_COSTS;
    const WAREHOUSE: string = OrdersTestConstants.ORDERS_ITEM.WAREHOUSE;

    // Act & Assert
    expect(new Orders(ORDERS_NUMBER, CLIENT, ORDERS_TYPE, CUSTOMER_ORDER, CUSTOMER_ADDRESSES_ID_DELIVERY,
      CUSTOMER_ADDRESSES_ID_INVOICE, CUSTOMER_DELIVERY, CUSTOMER_INVOICE, ORDERS_DATE, ORDERAMOUNT_NET,
      ORDERAMOUNT_BRU, CURRENCY, PAYMENT_TERM_ID, CUSTOMER_ORDERREF, LAST_DELIVERY, LAST_INVOICE,
      EDI_ORDERRESPONSE_SENT, RELEASE, PAYED, ORDERS_STATE, WEBSHOP_ID, WEBSHOP_ORDER_REF, DISCOUNT, VOUCHER,
      SHIPPING_COSTS, WAREHOUSE)
    ).toBeTruthy();
  });
});
