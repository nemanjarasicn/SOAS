# MS SQL

## Settings:

Sorting: Latin1_General_CI_AS

Example: From Sage "Taş" imported as "Tas"

## Field types:

ID => Integer Wert - Wird automatisch hochgezählt: int IDENTITY(1,1) NOT NULL;

FLG => Boolean Wert: bit NOT NULL;


## Limits:

Insert IN values max number is 2100
https://stackoverflow.com/questions/1869753/maximum-size-for-a-sql-server-query-in-clause-is-there-a-better-approach

It is better to use max 900 "INSERT IN" items, for better performance. See csv_import.ts => elasticImport function for example of using.

Number of queries in sequence: 65000

## MS SQL Backup

Backup-Pfade:
Y:/Development/SOAS-Projekt/DB-Backup/
/home/emo/

A) In Microsoft SQL Studio DB Backup per Datenbanken/SOAS/Tasks/Sichern mit Sicherungstyp-Einstellung 
"Vollständig" erstellen. Der Dateiname bleibt bei: SOAS_Backup_2019-11-01.bak

B) Putty starten und SSH Verbindung zu 138 aufbauen. 
Mit root Rechten anmelden (sudo su). 
Zu var/opt/mssql/data wechseln.
SOAS_Backup_2019-11-01.bak zu /home/emo/ kopieren per: cp SOAS_Backup_2019-11-01.bak /home/emo

C) WinSCP starten und zu 138 SFTP verbinden. 
Die zuvor kopierte SOAS_Backup_2019-11-01.bak Datei zu z.B.: /home/emo/SOAS_Backup_2020-05-04.bak umbenennen.
Die umbenannte Datei sicherheitshalber zu Y:/Development/SOAS-Projekt/DB-Backup/ kopieren.


## MS SQL Export all data from table in sql format

https://stackoverflow.com/a/20543132

Quick and Easy way:

1. Right click database
2. Point to _Tasks_ / _tasks_ In SSMS 2017 you need to ignore step 2 - the generate scripts options is at the top level of the context menu Thanks to Daniel for the comment to update.
3. Select _Scripts generieren_ / _generate scripts_
4. Click _next_
5. Choose _Bestimmte Datenobjekte auswählen_ und dann die gewünschte Tabellen selektieren. Oder _... gesamte Datenbank ..._ / _tables_
6. Click _next_
7. Click _Erweitert_ / _advanced_
8. Scroll to _Datentypen, für die ein Skript erstellt wird_ / _Types of data to script_ - Called types of data to script in SMSS 2014 Thanks to Ellesedil for commenting
9. Select _Schema und Daten_ oder _Nur Daten_ / _data only_
10. Click on 'Ok' to close the advanced script options window
11. Click _next_ and generate your script

I usually in cases like this generate to a new query editor window and then just do any modifications where needed.


## MS SQL Queries

### Delete Orders + Delivery Notes + Invoices

####1. Order löschen:

```
delete FROM [SOAS].[dbo].[ORDERS] where [ORDERS_NUMBER] = '50020AU000005';
```

```
delete FROM [SOAS].[dbo].[ORDERS_POSITIONS] where [ORDERS_NUMBER] = '50020AU000009';
update [SOAS].[dbo].[ORDERS] set ORDERAMOUNT_NET = 0, ORDERAMOUNT_BRU = 0 where [ORDERS_NUMBER] = '50020AU000009';
```

####2. Order zurücksetzen + Lieferschein löschen (geöffnete PDF schließen)

```
update [SOAS].[dbo].[ORDERS] SET [ORDERS_STATE] = '10', [CUSTOMER_DELIVERY] = '', [RELEASE] = '0' where [ORDERS_NUMBER] = '50020AU000009';
delete FROM [SOAS].[dbo].[DELIVERY_NOTES] where [ORDERS_NUMBER] = '50020AU000009';
delete FROM [SOAS].[dbo].[DELIVERY_NOTES_POSITIONS] where [ORDERS_NUMBER] = '50020AU000009';
```

####3. Order + Lieferschein zurücksetzen + Rechnung löschen (geöffnete PDF schließen) 

```
update [SOAS].[dbo].[INVOICES] set [INVOICES_STATE] = '90' where [INVOICES_NUMBER] = '50020RG000011'; 
update [SOAS].[dbo].[INVOICES] set [PAYED] = '0' where [INVOICES_NUMBER] = '50020RG000011';
```

```
update [SOAS].[dbo].[ORDERS] SET [ORDERS_STATE] = '20' where [ORDERS_NUMBER] = '50020AU000007';
update [SOAS].[dbo].[DELIVERY_NOTES] SET [DELIVERY_NOTES_STATE] = '40' where [DELIVERY_NOTES_NUMBER] = '50020LI000007';
delete FROM [SOAS].[dbo].[INVOICES] where [INVOICES_NUMBER] = '50020RG000007';
delete FROM [SOAS].[dbo].[INVOICES_POSITIONS] where [INVOICES_NUMBER] = '50020RG000007';
```

### Create table
```
create table SOAS.dbo.TAXATION_RELATIONS (TAXATION_NAME nvarchar(5) NOT NULL, TAXATION_RATE numeric(16,7) NOT NULL);
```
### Insert into table
```
insert into SOAS.dbo.TAXATION_RELATIONS (TAXATION_NAME, TAXATION_RATE) VALUES ('DEK','19');
```
### Update table
```
update SOAS.dbo.ORDERS_POSITIONS set CURRENCY = '1' where CURRENCY = 'EUR'; 
```
### Change column field type
```
ALTER TABLE SOAS.dbo.CUSTOMERS_ADDRESSES ALTER COLUMN TAXATION nvarchar(5) NOT NULL;

ALTER TABLE SOAS.dbo.ORDERS ALTER COLUMN LAST_INVOICE nvarchar(20) NULL;
```
### Add new column to table
```
ALTER TABLE SOAS.dbo.BATCH_PROCESSES ADD BATCH_CODE nvarchar(max) NULL;

ALTER TABLE SOAS.dbo.ORDERS_POSITIONS ADD ID int IDENTITY(1,1) NOT NULL;
```
### Rename column
```
EXEC sp_rename 'SOAS.dbo.LANGUAGES.LANGUAGE_NAME', 'LANGUAGE_CODE', 'COLUMN';
```
### Delete table column
```
ALTER TABLE [SOAS].[dbo].[ORDERS] DROP COLUMN "PAYMENT_ID";
```
### ID reseed

#### new COUNTRIES item begins with next COUNTRY_ID: 32
```
DBCC CHECKIDENT ('COUNTRIES', RESEED, 31)  
```
#### new WAREHOUSING item begins with ID: 1
```
DBCC CHECKIDENT ('WAREHOUSING', RESEED, 0) 
```
### Count (Show only elements with more then 2 items)
```
SELECT CUSTOMERS_NUMBER FROM [SOAS].[dbo].[CUSTOMERS_ADDRESSES] 
GROUP BY CUSTOMERS_NUMBER 
HAVING COUNT(*) = 2;
```
```
SELECT CUSTOMERS_NUMBER FROM [SOAS].[dbo].[CUSTOMERS_ADDRESSES] 
where ADDRESS_TYPE = 'INV'
GROUP BY CUSTOMERS_NUMBER 
HAVING COUNT(*) = 2;
```
### Table DEFAULT values
```
ALTER TABLE SOAS.dbo.ITEM_BASIS ADD CROSSSELLING_FLG bit NOT NULL DEFAULT 0;
```
### Trim all entries of given column ITMNUM
```
update [SOAS].[dbo].[ITEM_BASIS] set ITMNUM = lTrim(rTrim(ITMNUM));
```
#### Info: lTrim(rTrim()) seems not working if field type is nchar, so change it to nvarchar and run query again.

### Copy one column to another
```
UPDATE table SET columnB = columnA;
```

### Update a Date
```
UPDATE SOAS.dbo.WAREHOUSING SET UPDATE_LOC = CAST('2021-05-14T16:38:00' AS DATETIME) WHERE ID = '7712';
```
