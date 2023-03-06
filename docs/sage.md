# SAGE

## Help / documentation

### Documentation for the standard version

Server path:  (EDV) X:\SageX3Help\GER\X3_help.chm

It is best to copy the "GER" folder to the local hard drive.
e.g .: local path: C:\Docs\Sage\GER\X3_help.chm

### Import data from SAGE to SOAS:

### Orders:

#### CLIENT
```
[CLIENT]  => Note new orders line entry for field 'CUSTOMER_ORDER'. 
Then search for this noted value at CUSTOMERS table and 
take the CUSTOMERS_TYPE (like 'B2C' or 'B2B') from there.
```
```
So it is important, that first you need to add a new customer (if not already exists). 
Oterwise you can't get CUSTOMERS_TYPE for new order item.
```
#### ORDERAMOUNT_NET
```
SAGE field => ORDNOT_0
```

#### ORDERAMOUNT_BRU
```
SAGE field => ORDATI_0
```

#### CUSTOMER_ORDERREF
```
SAGE field => CUSORDREF_0
```

#### EDI_ORDERRESPONSE_SENT
```
[EDI_ORDERRESPONSE_SENT] => 0
```

#### RELEASE
```
[RELEASE] => see ORDERS_STATE...
```

#### ORDERS_STATE
```
[ORDERS_STATE] => SAGE => ORDSTA_0
```

```
// Logic to set ORDERS_STATE, RELEASE, PAYED:

// BY DEFAULT:
soasRELEASE = 0;
soasPAYED = 0;
soasORDERS_STATE = 10;

if (resultNewSORDER[i].ORDSTA_0 && parseInt(resultNewSORDER[i].ORDSTA_0) === 2) {
    soasORDERS_STATE = 30; // statesResult
    soasRELEASE = 1;
    soasPAYED = 1;
}
```
#### PAYED
```
If not already set to 1 at ORDERS_STATE logic: 
Order item has field PAYMENT_TERM_ID. 
See for this field value in SOAS => [PAYMENT_TERMS] => [PAYMENT_CONFIRMED] field. 
If it is  1 there, so then set PAYED = 1 for order item.
```
