export const csvTemplateImport = {
    CUSTOMERS:{
        notNull: {
            CUSTOMERS_NUMBER: {name: 'CUSTOMERS_NUMBER', param: ''},
            PAYMENT_TERM_ID: {param: '', name:'PAYMENT_TERM_ID'},
            CUSTOMERS_PRENAME: { param: '', name: 'CUSTOMERS_PRENAME'},
            FAX_0: { param: '', name: 'FAX_0'},
            PHONE_1: { param: '', name: 'PHONE_1'},
            MOB_0: { param: '', name: 'MOB_0'},
            MOB_1: { param: '', name: 'MOB_1'},
            CUSTOMERS_TYPE: { param: 'B2C', name:'CUSTOMERS_TYPE'},
            CUSTOMERS_NAME: {name: 'CUSTOMERS_NAME', param: ''},
            EEC_NUM: {name: 'EEC_NUM', param: ''},
            LANGUAGE: {name: 'LANGUAGE', param: ''},
            EMAIL_RG: {name: 'EMAIL_RG', param: ''},
            EMAIL_LI: {name: 'EMAIL_LI', param: ''},
            PHONE_0: {name: 'PHONE_0', param: ''},
            DIFFERENT_DLV_NAME_0: {name: 'DIFFERENT_DLV_NAME_0', param: ''},
            DIFFERENT_DLV_NAME_1: {name: 'DIFFERENT_DLV_NAME_1', param: ''},
            CREATE_DATE: {name: 'CREATE_DATE', param: new Date().toLocaleDateString("en-US")}
        }
    },
    CUSTOMERS_ADDRESSES: {
        notNull:{
            ADDRESS_TYPE: {name: 'ADDRESS_TYPE', param: ''},
            ADDRESS_CRYNAME: {name: 'ADDRESS_CRYNAME', param: ''},
            ADDRESS_COMMENT: {name: 'ADDRESS_COMMENT', param: ''},
            EMAIL: {name: 'EMAIL', param: ''},
            CUSTOMERS_NUMBER: {name: 'CUSTOMERS_NUMBER', param: ''},
            ADDRESS_STREET: {name: 'ADDRESS_STREET', param: ''}
        }
    },
    ORDERS:{
        notNull:{
            ORDERS_NUMBER: { name: 'ORDERS_NUMBER', param: ''},
            CLIENT: {name: 'CLIENT', param: ''},
            ORDERAMOUNT_NET: { name: 'ORDERAMOUNT_NET', param: '0'},
            ORDERAMOUNT_BRU: { name: 'ORDERAMOUNT_BRU', param: '0'},
            PAYED: { name: 'PAYED', param: '0'},
            RELEASE: { name: 'RELEASE', param: '0'},
            ORDERS_STATE: { name: 'ORDERS_STATE', param: '10'},
            EDI_ORDERRESPONSE_SENT: {name: 'EDI_ORDERRESPONSE_SENT', param: '0'},
            CUSTOMER_ORDER: {name: 'CUSTOMER_ORDER', param: ''},
            CUSTOMER_ORDERREF: {name: 'CUSTOMER_ORDERREF', param: ''},
            CURRENCY: { name:'CURRENCY', param: '0'},
            ORDERS_DATE: {name: 'ORDERS_DATE', param: ''}
        }
    },
    ORDERS_POSITIONS:{
        notNull:{
            ORDERS_NUMBER: {name: 'ORDERS_NUMBER', param: ''},
            ITMNUM: {name: 'ITMNUM', param: ''},
            ORDER_QTY: {name: 'ORDER_QTY', param: ''},
            ASSIGNED_QTY: {name: 'ASSIGNED_QTY', param: '0'},
            PRICE_NET: {name: 'PRICE_NET', param: '0'},
            PRICE_BRU: {name: 'PRICE_BRU', param: '0'},
            CURRENCY: {name: 'CURRENCY', param: '0'},
            CATEGORY_SOAS: {name: 'CATEGORY_SOAS', param: 'SET'},
            POSITION_ID: {name: 'POSITION_ID', param: 1000},
            ITMDES: {name: 'ITMDES', param: ''}
        }
    }
}
