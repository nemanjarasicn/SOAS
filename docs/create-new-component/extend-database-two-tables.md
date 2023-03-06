### 1. Extend database for 2 tables view:

Example for SUPPLY_ORDERS view that is based on 2 db tables: SUPPLY_ORDERS + SUPPLY_ORDERS_POSITIONS

[Link to supply orders component][supply-orders-component]

##### 1.1 Create a new table "SUPPLY_ORDERS":

SQL-Queries:

Main table SUPPLY_ORDERS:

```
CREATE TABLE [dbo].[SUPPLY_ORDERS](
	[PROVIDERS_ORDER] [nchar](15) NOT NULL,
	[PROVIDER] [nchar](10) NOT NULL,
	[CLIENT_DELIVERY] [nchar](20) NOT NULL,
	[CLIENT_INVOICE] [nchar](20) NOT NULL,
	[ORDERAMOUNT_NET] [decimal](19, 5) NOT NULL,
	[ORDERAMOUNT_BRU] [decimal](19, 5) NOT NULL,
	[ORDERREF] [nchar](50) NULL,
	[CURRENCY] [nvarchar](3) NOT NULL,
	[SHIPPING_COSTS] [decimal](19, 5) NOT NULL,
	[WAREHOUSE] [nchar](3) NOT NULL,
	[ORDERS_DATE] [smalldatetime] NULL,
	[INTERCOMPANY] [smallint] NULL,
	[ID] [bigint] IDENTITY(1,1) NOT NULL
) ON [PRIMARY];
```

Detail table SUPPLY_ORDERS_POSITIONS:

```
CREATE TABLE [dbo].[SUPPLY_ORDERS_POSITIONS](
	[PROVIDERS_ORDER] [nchar](15) NOT NULL,
	[ITMNUM] [nvarchar](255) NOT NULL,
	[ORDER_QTY] [int] NOT NULL,
	[PRICE_NET] [decimal](19, 5) NOT NULL,
	[PRICE_BRU] [decimal](19, 5) NOT NULL,
	[SCHEDULED_ARRIVAL] [smalldatetime] NOT NULL,
	[SUPPLIED_QTY] [int] NOT NULL,
	[WAREHOUSE] [nchar](3) NOT NULL,
	[ID] [bigint] IDENTITY(1,1) NOT NULL
) ON [PRIMARY];
```

___

###### 1.2 Add a new table to the "TABLE_TEMPLATES" table:

Important: The number of fields and their order should be the same at
TABLE_TEMPLATES > DETAIL_VIEW  and FORM_TEMPLATES. Otherwise, the form will not display formdata.

The information causes the new table to be displayed.
The header names for table columns are specified in "TEMPLATE_FIELDS".
The names for the form fields are specified in "DETAIL_VIEW".

Important: When specifying the fields for "TEMPLATE_FIELDS" and "DETAIL_VIEW" do not use any spaces,
otherwise the table contents cannot be displayed later!

* Correct: "TEMPLATE_FIELDS" => 'ITMNUM,PARTNUM,PART_QTY'
* Wrong: "TEMPLATE_FIELDS" => 'ITMNUM, PARTNUM, PART_QTY'

SQL-Query:

Main table
```
INSERT INTO [SOAS].[dbo].[TABLE_TEMPLATES] (REF_TABLE,TEMPLATE_FIELDS,TABLE_NAME,DETAIL_VIEW) values 
('supplyOrders','PROVIDERS_ORDER,ORDERAMOUNT_NET,ORDERREF,ORDERS_DATE','SUPPLY_ORDERS','PROVIDERS_ORDER,ORDERAMOUNT_NET,ORDERREF,ORDERS_DATE');
```

Detail table:
```
INSERT INTO [SOAS].[dbo].[TABLE_TEMPLATES] (REF_TABLE,TEMPLATE_FIELDS,TABLE_NAME,DETAIL_VIEW) values 
('supplyOrdersPosition','PROVIDERS_ORDER,ITMNUM,ORDER_QTY,PRICE_NET,PRICE_BRU,SCHEDULED_ARRIVAL,SUPPLIED_QTY,WAREHOUSE','SUPPLY_ORDERS_POSITIONS','PROVIDERS_ORDER,ITMNUM,ORDER_QTY,PRICE_NET,PRICE_BRU,SCHEDULED_ARRIVAL,SUPPLIED_QTY,WAREHOUSE');
```

___

##### 1.3 Add a new table to the "FORM_TEMPLATES" table:

Important: The number of fields and their order should be the same at TABLE_TEMPLATES > DETAIL_VIEW
and FORM_TEMPLATES. Otherwise, the form will not display formdata.

The information in the "FORM_TEMPLATES" table causes the form fields to be displayed when a data record is created.

##### [Set formly form][formly-form]

You find the documentation about formly form at [formly-form.md][formly-form] file.

###### Example of supply orders view form template:

Detail form:

```
INSERT INTO [SOAS].[dbo].[FORM_TEMPLATES] (REF_TABLE,FORM_TEMPLATE) values ('formly_supplyOrders',
  '[{"fieldGroupClassName":"row","fieldGroup":[{"className":"col-md-6","type":"input","key":"PROVIDERS_ORDER","templateOptions":{"label":"PROVIDERS_ORDER","required":true"}}]}]'
   );
```

---

##### 1.4 Extend table "LOCALIZE_IT" with new table fields:

If the new table contains new table- or form-fields, then these must be added to the "LOCALIZE_IT" table
for correct display column names (translation).

SQL-Query example for countries:

```
INSERT INTO [SOAS].[dbo].[LOCALIZE_IT] ( [LOCALIZE_TAG],[DE_DE],[EN_US]) values ('COUNTRY_ISO_CODE', 'Land ISO Code','country iso code');
```

___

##### 1.5 Extend table "IMPORT_TEMPLATES" with new table fields:

If the new table has to support CSV import, then "IMPORT_TEMPLATES" must be set in the table.

* [TEMPLATE_FIELDS] - are fields that can be imported.
* [UPDATE_FIELDS] - are fields that, once imported, can be updated.

SQL-Query example for countries:

```
INSERT INTO [SOAS].[dbo].[IMPORT_TEMPLATES] ([TEMPLATE_NAME],[TEMPLATE_DESCRIPTION],[TEMPLATE_FIELDS],[REF_TABLE],[UPDATE_FIELDS]) values 
('Länder',
'Vorlage zum Import von Ländern', 
'COUNTRY_NAME,COUNTRY_ISO_CODE',
'COUNTRIES',
'COUNTRY_NAME');
```

___

#### 1.8 Add interfaces and classes for the new component:

Interfaces and classes (models) must be created on both the client and the server.

##### 1.8.1 Client:

Client paths:
```
SOAS-GIT/client/src/app/interfaces
SOAS-GIT/client/src/app/models
```

For 2 tables view you need to create 2 interfaces and models.

Create first interface.

* interfaces/supply-order-item: 

```
ng g interface interfaces/supply-order-item
```

Content of the interface:

```
export interface SupplyOrderItem {
  PROVIDERS_ORDER?: string;
  PROVIDER?: string;
  CLIENT_DELIVERY: string;
  CLIENT_INVOICE: string;
  ORDERAMOUNT_NET: number;
  ORDERAMOUNT_BRU: number;
  ORDERREF: string;
  CURRENCY: string;
  SHIPPING_COSTS
  WAREHOUSE: string;
  ORDERS_DATE: string;
  ID?: number;
}

```

---

Create second interface.

* interfaces/supply-order-position-item:

```
ng g interface interfaces/supply-order-position-item
```

Content of the interface:

```
export interface SupplyOrderPositionItem {
  PROVIDERS_ORDER?: string;
  POS?: number; // virtual column for showing position number in view
  ITMNUM?: string;
  ORDER_QTY?: number;
  PRICE_NET?: number;
  PRICE_BRU?: number;
  SCHEDULED_ARRIVAL?: string;
  SUPPLIED_QTY?: number;
  WAREHOUSE?: string;
  ID?: number;
}
```

---

* Create first class: models/supply-orders.ts 

```
ng g class models/supply-orders
```

Content of the class:

```
export class SupplyOrders {
  constructor(
    public PROVIDERS_ORDER: string,
    public PROVIDER: string,
    public CLIENT_DELIVERY: string,
    public CLIENT_INVOICE: string,
    public ORDERAMOUNT_NET: number,
    public ORDERAMOUNT_BRU: number,
    public ORDERREF: string,
    public CURRENCY: number,
    public SHIPPING_COSTS: number,
    public WAREHOUSE: string,
    public ORDERS_DATE: string,
    public INTERCOMPANY: number,
    public ID: number
  ) {}
}
```

---

* Create second class: models/supply-orders-positions.ts

```
ng g class models/supply-orders-positions
```

Content of the class:

```
export class SupplyOrdersPositions implements SupplyOrderPositionItem {
  constructor(
    public PROVIDERS_ORDER: string,
    public ITMNUM: string,
    public ORDER_QTY: number,
    public PRICE_NET: number,
    public PRICE_BRU: number,
    public SCHEDULED_ARRIVAL: string,
    public SUPPLIED_QTY: number,
    public WAREHOUSE: string,
    public ID: number
  ) {}
}
```

##### 1.8.2 Server:

Server paths:
```
SOAS-GIT/routes/logic/classes/
SOAS-GIT/routes/logic/classes/interfaces
```

Here you create manually or via Terminal Command 4 files for the class and interface:

* routes/logic/classes/interfaces/SupplyOrders.ts

The interface must contain the database fields of the table.

```
export interface SupplyOrdersInterface {
  supplyOrdersProvidersOrder: string;
  supplyOrdersProvider: string;
  supplyOrdersClientDelivery: string;
  supplyOrdersClientInvoice: string;
  supplyOrdersAmountNet: number;
  supplyOrdersAmountBru: number;
  supplyOrdersRef: string;
  supplyOrdersCurrency: number;
  supplyOrdersShippingCosts: number;
  supplyOrdersWarehouse: string;
  supplyOrdersOrdersDate: string;
  supplyOrdersInterCompany: number;
  supplyOrdersId: number;
}

export interface SupplyOrdersDataInterface {
  PROVIDERS_ORDER: string;
  PROVIDER: string;
  CLIENT_DELIVERY: string;
  CLIENT_INVOICE: string;
  ORDERAMOUNT_NET: number;
  ORDERAMOUNT_BRU: number;
  ORDERREF: string;
  CURRENCY: number;
  SHIPPING_COSTS: number;
  WAREHOUSE: string;
  ORDERS_DATE: string;
  INTERCOMPANY: number;
  ID: number;
}


```

* routes/logic/classes/SupplyOrders.ts

The class is based on the interface and contains the setter and getter methods.

Part of the class:

```
export class SupplyOrders implements SupplyOrdersInterface {
  supplyOrderProvidersOrder: string;
  supplyOrdersProvider: string;
  supplyOrderClientDelivery: string;
  supplyOrderClientInvoice: string;
  supplyOrderAmountNet: number;
  supplyOrderAmountBru: number;
  supplyOrderRef: string;
  supplyOrderCurrency: number;
  supplyOrderShippingCosts: number;
  supplyOrderWarehouse: string;
  supplyOrderOrdersDate: string;
  supplyOrderInterCompany: number;
  supplyOrderId: number;
  ...

```

---

And don't forget to add the 2 files (interface and class) for SupplyOrdersPositions.

---

##### 1.8.3 Extend TableController class

routes/logic/controller/TableController.ts

The interfaces and the classes must then be specified in the table controller so
that they are also recognized for the data consistency check.

To do this, extend the switch function to include another "case".
As "tableid" you set the referral table names,
e.g. the table "TABLE_TEMPLATES-> REF_TABLE":

Extend switch with 2 classes:

```
      case "supplyOrders":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new SupplyOrders(<SupplyOrdersInterface>this.jsonData[item])
              .supplyOrdersData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "supplyOrdersPositions":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new SupplyOrdersPositions(<SupplyOrdersPositionsInterface>this.jsonData[item])
              .supplyOrdersPositionsData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
```

##### 1.9 Server: Add a query(s) for new component in the SQL queries classes on the server:

* routes > logic > constants > constants.ts
```
Add the db table column names of the new components to "constants['DB_TABLE_COLUMNS']".
```

* routes > logic > sql > Table
```
primaryColumnTypes enumeration: Contains the pimary column types. Add new item, if primary column name of new component is not in the list.
mssql_select_Table_by_Number function: Contains the query to load table and form data from db for specific referral table name and parameters.
```

* routes > logic > sql > 'component name'
```
It can be helpful to add a new folder and ts.file for specific sql queries of the new component.
```

##### 1.9.1 Compile server classes

After all changes have been made on the server,
the classes must be compiled once so that they can be translated
from the Typescript to Javascript.

To do this, execute in the terminal following instruction
on the server path, e.g .: "...\WebstormProjects\SOAS-GIT>"

```
tsc -t es5 app.ts @tsc_files_to_compile.txt
```

Then you have to stop the server once and then restart it so that the changes take effect.

If a new added server typescript file is not automatically compiled, so add it to tsc_files_to_compile.txt file and execute compile extraction again.

___

[supply-orders-component]: ../..\client\src\app\views\supply-orders\supply-orders.component.ts
[formly-form]: \formly-form.md
