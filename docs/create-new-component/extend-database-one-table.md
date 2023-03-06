### 1. Extend database for view based on 1 table:

Example for COUNTRIES view that is based on 1 db table.

[Link to countries component][countries-component]

##### 1.1 Create a new table "COUNTRIES":

SQL-Query:

```
CREATE TABLE SOAS.dbo.COUNTRIES (
	[COUNTRY_ID] [int] IDENTITY(1,1) NOT NULL,
	[COUNTRY_NAME] [nvarchar](255) NOT NULL,
	[COUNTRY_ISO_CODE] [nvarchar](3) NOT NULL
);
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
```
INSERT INTO [SOAS].[dbo].[TABLE_TEMPLATES] (REF_TABLE,TEMPLATE_FIELDS,TABLE_NAME,DETAIL_VIEW) values 
('countries','COUNTRY_ID,COUNTRY_NAME,COUNTRY_ISO_CODE','COUNTRIES','COUNTRY_ID,COUNTRY_NAME,COUNTRY_ISO_CODE');
```

___

##### 1.3 Add a new table to the "FORM_TEMPLATES" table:

Important: The number of fields and their order should be the same at TABLE_TEMPLATES > DETAIL_VIEW
and FORM_TEMPLATES. Otherwise, the form will not display formdata.

The information in the "FORM_TEMPLATES" table causes the form fields to be displayed when a data record is created.

##### [Set formly form][formly-form]

You find the documentation about formly form at [formly-form.md][formly-form] file.


######DB query for countries view form template:

```
  INSERT INTO [SOAS].[dbo].[FORM_TEMPLATES] (REF_TABLE,FORM_TEMPLATE) values ('formly_countries',
  '[{"fieldGroupClassName":"row","fieldGroup":[{"className":"col-md-3","type":"input","key":"COUNTRY_ID","templateOptions":{"label":"COUNTRY_ID","required":true,"refTable":"countries","tableName":"COUNTRIES","newItemMode": "false", "isPrimary": "true","isIdentity": "true","needsValidation": "false"},"expressionProperties": {"templateOptions.disabled": "true"}}]},{"fieldGroupClassName":"row","fieldGroup":[{"className":"col-md-12","type":"input","key":"COUNTRY_NAME","templateOptions":{"label":"COUNTRY_NAME","required":true,"refTable":"countries","tableName":"COUNTRIES","newItemMode": "false","needsValidation": "true"},"expressionProperties": {"templateOptions.disabled": "false"}}]},{"fieldGroupClassName":"row","fieldGroup":[{"className":"col-md-12","type":"input","key":"COUNTRY_ISO_CODE","templateOptions":{"label":"COUNTRY_ISO_CODE","required":true,"refTable":"countries","minLength":2,"maxLength":2,"attributes":{"style":"text-transform: uppercase"},"tableName":"COUNTRIES","newItemMode": "false","needsValidation": "true"},"expressionProperties": {"templateOptions.disabled": "false" }}]}]'
   );
```

---

##### 1.4 Extend table "LOCALIZE_IT" with new table fields:

If the new table contains new table- or form-fields, then these must be added to the "LOCALIZE_IT" table
for correct display column names (translation).

SQL-Query:

```
INSERT INTO [SOAS].[dbo].[LOCALIZE_IT] ( [LOCALIZE_TAG],[DE_DE],[EN_US]) values ('COUNTRY_ISO_CODE', 'Land ISO Code','country iso code');
```

___

##### 1.5 Extend table "IMPORT_TEMPLATES" with new table fields:

If the new table has to support CSV import, then "IMPORT_TEMPLATES" must be set in the table.

* [TEMPLATE_FIELDS] - are fields that can be imported.
* [UPDATE_FIELDS] - are fields that, once imported, can be updated.

SQL-Query:

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

* interfaces/country-item.ts: Create interface.

```
ng g interface interfaces/country-item
```

Content of the interface:

```
export interface Country {
  COUNTRY_ID: number;
  COUNTRY_NAME: string;
  COUNTRY_ISO_CODE: string;
}

```

* models/countries.ts: Create class.

```
ng g class models/countries
```

Content of the class:

```
export class Countries {
  constructor(
    public COUNTRY_ID: number,
    public COUNTRY_NAME: string,
    public COUNTRY_ISO_CODE: string
  ) {  }
}
```

##### 1.8.2 Server:

Server paths:
```
SOAS-GIT/routes/logic/classes/
SOAS-GIT/routes/logic/classes/interfaces
```

Here you create manually or via Terminal Command 2 files for the class and interface:

* routes/logic/classes/interfaces/CountriesInterface.ts

The interface must contain the database fields of the table.

```
export interface CountriesInterface {
    countriesId : number;
    countriesName : string;
    countriesIsoCode : string;
}

export interface CountriesDataInterface {
    COUNTRY_ID: number;
    COUNTRY_NAME: string;
    COUNTRY_ISO_CODE: string;
}

```

* routes/logic/classes/Countries.ts

The class is based on the interface and contains the setter and getter methods.

```
import {CountriesInterface, CountriesDataInterface} from "./interfaces/CountriesInterface";

export class Countries implements CountriesInterface {
    private _countriesId: number;
    private _countriesName: string;
    private _countriesIsoCode: string;

    constructor(countriesData: CountriesDataInterface) {
        this._countriesId = countriesData.COUNTRY_ID;
        this._countriesName = countriesData.COUNTRY_NAME;
        this._countriesIsoCode = countriesData.COUNTRY_ISO_CODE;
    }

    get countriesData(): CountriesDataInterface {
        return {
            COUNTRY_ID: this._countriesId,
            COUNTRY_NAME: this._countriesName,
            COUNTRY_ISO_CODE: this._countriesIsoCode
        }
    }

    get countriesId(): number {
        return this._countriesId;
    }

    set countriesId(value: number) {
        this._countriesId = value;
    }

    get countriesName(): string {
        return this._countriesName;
    }

    set countriesName(value: string) {
        this._countriesName = value;
    }

    get countriesIsoCode(): string {
        return this._countriesIsoCode;
    }

    set countriesIsoCode(value: string) {
        this._countriesIsoCode = value;
    }
}

```

##### 1.8.3 Extend TableController class

routes/logic/controller/TableController.ts

The interface and the class must then be specified in the table controller so
that they are also recognized for the data consistency check.

To do this, extend the switch function to include another "case".
As "tableid" you set the referral table names,
e.g. the table "TABLE_TEMPLATES-> REF_TABLE":

```
      case "countries":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Countries(<CountriesDataInterface>this.jsonData[item])
              .countriesData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
```

##### 1.9 Server: Add a query(s) for new component in the SQL queries classes on the server:

* routes > logic > sql > Table
```
primaryColumnTypes enumeration: Contains the pimary column types. Add new item, if primary column name of new component is not in the list.
mssql_select_Table_by_Number function: Contains the query to load table and form data from db for specific referral table name and parameters.
```
* routes > logic > constants > constants.ts
```
Add the db table column names of the new components to "constants['DB_TABLE_COLUMNS']".
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


[countries-component]: ../..\client\src\app\views\countries\countries.component.ts
[formly-form]: \formly-form.md
