
### CSV import dialog: (old version)

The CSV import dialog can be opened via the "Open> CSV import" menu.

#### Requirements: When importing, it is important that the column names in the CSV file are exactly the same as in the SOAS db table "IMPORT_TEMPLATES". So adjust if necessary.

#### Sample CSV file for Order Positions (ORDERS_POSITIONS):

```
ORDERS_NUMBER;ITMNUM;ORDER_QTY;ASSIGNED_QTY;PRICE_NET;CURRENCY;PRICE_BRU
50020AU000052;SW10098;2;0;55;2;0
50020AU000054;DOMINO1000000101DE;1;0;369;2;0
```

#### Updates:

If you only want to update data, you must ensure that only the fields from the "UPDATE_FIELDS" column change in the import CSV file. Otherwise, a duplicate entry will be inserted.

___

#### 1. Create CSV file from MSSQL query:

Example: Price list table 'PRILISTS'. In addition the Sage MSSQL Query for price list export as CSV file:

```
select 
PLICRI1_0 as 'ITMNUM',
PRI_0 as 'PRICE_NET',
ZBRUPRI_0 as 'PRICE_BRU',
REPLACE(REPLACE(REPLACE(CUR_0, 'GPB', '3'), 'GBP', '3'), 'EUR', '1') AS 'CURRENCY',
PLICRD_0 as 'PRILIST',
REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(PLI_0, 'POSNH', PLICRI2_0), 'EMT5', PLICRI2_0 + '_B2C'), 'EMT6', PLICRI2_0 + '_B2C'), 'EMT7', PLICRI2_0 + '_B2C'), 'HPREIS', PLICRI2_0), 'EMT1', PLICRI2_0 + '_B2C'), 'POSN', 'DE_B2B'), 'EMT2', PLICRI2_0 + '_B2C')  AS 'CUSGRP'
from x3v65p.EMOPILOT.SPRICLIST
where PLIENDDAT_0 >= GETDATE() 
AND PLICRI1_0 != '';
```
___

#### 2. Further information:

It is important that the column names in the CSV file are exactly the same as in the IMPORT_TEMPLATES table. So adjust if necessary.

For 'PRILISTS' these are (the current ID is being created automatically): ITMNUM,PRICE_NET,PRICE_BRU,CURRENCY,PRILIST,CUSGRP

PRICE_NET and PRICE_BRU should ideally not contain any comma characters (commas are converted into periods by the import script!).
Empty PRICE_BRU entries are imported in decimal format as 0.0.

CURRENCY is determined from the SOAS table CURRENCIES => CURRENCY_ID. For 'EUR' it is the entry '1'.

Importing over 70,000+ entries into SOAS via CSV import dialog takes over 20 minutes.

___
