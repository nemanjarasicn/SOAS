## Batch Dialog Info:

Letzter Stand: 11.11.2019

[Link zur Logik][cron_logic]

### Batch für Lieferscheine, Rechnungen erstellen und PDFs generieren

###Batches:

####1. check_new_orders

SQL Queries, um alle Tabellen zu leeren, die vom new orders batch gefüllt werden.

```
delete from [SOAS].[dbo].[ORDERS];
delete from [SOAS].[dbo].[ORDERS_POSITIONS];
delete from [SOAS].[dbo].[DELIVERY_NOTES];
delete from [SOAS].[dbo].[DELIVERY_NOTES_POSITIONS];
delete from [SOAS].[dbo].[INVOICES];
delete from [SOAS].[dbo].[INVOICES_POSITIONS];

delete from [SOAS].[dbo].[CUSTOMERS];
delete from [SOAS].[dbo].[CUSTOMERS_ADDR];
```


####Testaufruf:

Vor dem Testaufruf sollten die alten Testdaten gelöscht und die Staties zurückgesetzt werden.

Wichtig: Die eventuell bereits vorhandene PDFs werden überschrieben.

SQL-Queries zum Löschen von Testdaten und Zurücksetzen von Staties.

```
delete FROM [SOAS].[dbo].[DELIVERY_NOTES] where DELIVERY_NOTES_NUMBER NOT IN ('50019LI000001','50019LI000002','50019LI000003','50019LI000004','50019LI000005','50019LI000006')
delete FROM [SOAS].[dbo].[DELIVERY_NOTES_POSITIONS] where DELIVERY_NOTES_NUMBER NOT IN ('50019LI000001','50019LI000002','50019LI000003','50019LI000004','50019LI000005','50019LI000006')
update [SOAS].[dbo].[ORDERS] set ORDERS_STATE = '10' where ORDERS_NUMBER NOT IN ('50019AU000003','50019AU000012','50019AU000006','50019AU000001','50019AU000010','50019AU000049');

delete FROM [SOAS].[dbo].[INVOICES] where INVOICES_NUMBER NOT IN ('50019RG000001')
delete FROM [SOAS].[dbo].[INVOICES_POSITIONS] where INVOICES_NUMBER NOT IN ('50019RG000001')
update [SOAS].[dbo].[DELIVERY_NOTES] set DELIVERY_NOTES_STATE = '40' where DELIVERY_NOTES_NUMBER NOT IN ('50019LI000001','50019LI000002','50019LI000003','50019LI000004','50019LI000005','50019LI000006');

DELETE OP FROM [SOAS].[dbo].[ORDERS_POSITIONS] OP
LEFT JOIN SOAS.dbo.ORDERS OO ON OO.ORDERS_NUMBER = OP.ORDERS_NUMBER
where CAST(OO.ORDERS_DATE as DATE) <= '2019-02-01';

DELETE FROM [SOAS].[dbo].[ORDERS]
  where CAST(ORDERS_DATE as DATE) <= '2019-02-01'; 
```

Aufrufbar per Menu "Batch > Batchserver konfig". Batch "check_new_orders" bearbeiten, Batch Intervall:setzen und auf aktiv stellen.
Um Batch zu stoppen, dazu den Batch bearbeiten und Aktiv Flag deaktivieren.

####Check Shopware orders for duplicates
```
SELECT * FROM s_order SO left join s_order_details OD ON SO.id = OD.orderID left join s_user U ON U.id = SO.userID 
left join s_user_billingaddress UB on UB.userID = U.id 
left join s_user_shippingaddress US on US.userID = U.id 
where U.customernumber = '20044'
ORDER BY U.customernumber
```

###2. execute_sql_create_csv_send_mail

#### BATCH_CODE DB-Feld:

Wichtig beim Feld "mssql_query" ist, dass dort keine Zeilenumbrüche vorkommen, da sonst das Parsen mit der 
Fehlermeldung "Batchcode ist nicht JSON konform." fehlschlägt.

#### Mssql Beispiele:

```
{
"mssql_query":"select TOP (10) ORDERS_NUMBER,CLIENT,ORDERS_TYPE,CUSTOMER_ORDER,CUSTOMER_DELIVERY,CUSTOMER_INVOICE,ORDERS_DATE,ORDERAMOUNT_NET,ORDERAMOUNT_BRU,CUSTOMER_ORDERREF FROM SOAS.dbo.ORDERS where ORDERS_NUMBER = '50019AU000003';",
"csv_filename":"bestellungen_statistik",
"csv_delimiter":";",
"email_address":"a.lening@emotion-24.de",
"email_subject":"SOAS-Cron-Mailer: Bestellungen Statistik vom 08.11.2019 08:10Uhr"
}
```

```
{
"mssql_query":"select TOP (10) DN.DELIVERY_NOTES_NUMBER, OP.ITMNUM, IB.ITMDES, FORMAT( DN.SHIPPING_DATE, 'dd-MM-yyyy', 'en-US' ) AS SHIPPING_DATE, DN.ORDERS_NUMBER, OS.CUSTOMER_ORDER, CS.CUSTOMERS_PRENAME, CS.CUSTOMERS_NAME, CS.CUSTOMERS_COMPANY, CS.CUSTOMERS_EMAIL, CS.CUSTOMERS_PHONE, CA.ADDR_STREET_DLV, CA.ADDR_CITY_DLV, CA.ADDR_POSTCODE_DLV, CA.ADDR_STREET_INV, CA.ADDR_CITY_INV, CA.ADDR_POSTCODE_INV from SOAS.dbo.DELIVERY_NOTES DN LEFT JOIN SOAS.dbo.ORDERS OS ON OS.ORDERS_NUMBER = DN.ORDERS_NUMBER LEFT JOIN SOAS.dbo.ORDERS_POSITIONS OP ON OP.ORDERS_NUMBER = DN.ORDERS_NUMBER LEFT JOIN SOAS.dbo.ITM_BASIS IB ON IB.ITMNUM = OP.ITMNUM LEFT JOIN SOAS.dbo.CUSTOMERS CS ON CS.CUSTOMERS_NUMBER = OS.CUSTOMER_ORDER LEFT JOIN SOAS.dbo.CUSTOMERS_ADDR CA ON  CA.CUSTOMERS_NUMBER = CS.CUSTOMERS_NUMBER where DN.DELIVERY_NOTES_NUMBER = '50019LI000004';",
"csv_filename":"lieferscheine_statistik",
"csv_delimiter":";",
"email_address":"a.lening@emotion-24.de",
"email_subject":"SOAS-Cron-Mailer: Lieferscheine Statistik vom 08.11.2019 08:10Uhr"
}
```

#### MySql Beispiel:
```
{
	mysql_query:   "SELECT * FROM s_order;",
	csv_filename:  "shopware_bestellungen_statistik",
	csv_delimiter: ";",
	email_address: "a.lening@emotion-24.de",
	email_subject: "SOAS-Cron-Mailer: Shopware Bestellungen Statistik vom 08.11.2019 08:10Uhr"
}
```

---

[cron_logic]: ..\routes\logic\cron_logic.ts
