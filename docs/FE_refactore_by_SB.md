<h1>FE Refactor</h1>
Strahinja Belic <br>
04.04.2022.

--------------------
<h2>1) Change view component ts file</h2>
First, we need to add these 2 properties to view component
```ts
    title: string
    fetchTableConfig: IFetchTableConfig
```
example:
```ts
    //file: currencies.component.ts

    title = "CURRENCIES"
    fetchTableConfig = {
        refTable: 'currencies',
        pk: "CURRENCY_ID",
    }
```

<h2>2) Change view component html file</h2>
instead of 
```html
<app-custom-table-form-view></app-custom-table-form-view>
```

put 

```html
<app-dynamic-view-main-table
  [fetchTableConfig]="fetchTableConfig"
  [title]="title"
></app-dynamic-view-main-table>

```

<h2>3) Cleanup view component ts file</h2>
We should delete all redundant code that is unused now

example: we should delete all of it
```
/**
   * after view is initialized, setup table and then form by loading data from database
   */
  public ngAfterViewInit(): void {
    this.initCustomTableFormView();
  }

  /**
   * initialize custom table form view with specific data of countries component
   *
   * @private
   */
  private initCustomTableFormView() {
    // referral table name of the db table
    this.customComponent.setReferralTable(this.CONSTANTS.REFTABLE_CURRENCIES);
    this.customComponent.setPrimaryRefTableColumnName(this.CONSTANTS.REFTABLE_CURRENCIES_COLUMN);
    this.customComponent.setSecondaryRefTableColumnName(this.CONSTANTS.REFTABLE_CURRENCIES_NAME_COLUMN);
    this.customComponent.setSelItemLocalStorageKey(this.CONSTANTS.LS_SEL_CURRENCY_ID);
    // this.customTableFormComponent.setReferralModel(Currencies);

    // set selected item referral table
    this.customComponent.setSeItemRefTableTitle(this.CONSTANTS.REFTABLE_CURRENCIES_TITLE);

    // load only needed form options: currencies
    // this.customTableFormComponent.setFormOptionsToLoad([OptionsTypes.currencies]);

    // set titles
    this.customComponent.setTableTitle('CURRENCIES');
    this.customComponent.setFormTitle('CURRENCY_FORM');
    this.customComponent.setCreateTitle('CREATE_NEW_CURRENCY');
    this.customComponent.setCreateTooltip('CREATE_NEW_CURRENCY');

    // set displayed table column names
    this.customComponent.setDisplayedTableColumns(['CURRENCY_NAME','CURRENCY_ISO_CODE','CURRENCY_SYMBOL']);
    this.customComponent.setSearchTableColumn(this.CONSTANTS.REFTABLE_CURRENCIES_NAME_COLUMN);
    this.customComponent.setAdditionalTableSearchColumns('CURRENCY_ISO_CODE,CURRENCY_SYMBOL');
    this.customComponent.setInitialTableSort({property: 'CURRENCY_NAME', order: 'asc'});
    // set empty item id
    this.customComponent.setEmptyItemId(this.CONSTANTS.UNIVERSAL_ID_PLACEHOLDER);
    // set empty table model for the new item mode
    this.customComponent.setEmptyModel(
      new Currencies(0, '', '',''));

    // allow to load view after all parameters are set
    this.customComponent.startLoading = true;
    this.customComponent.ngAfterViewInit();
  }
```

also 
```ts
constructor(public CONSTANTS: ConstantsService) {}
```

to 
```ts
constructor() {}
```

and

```ts
export class CurrenciesComponent implements AfterViewInit {
```

to 
```ts
export class CurrenciesComponent {
```


<b>For simple components such as Currencies, Countries... these 3 steps are enough.</b>

-------------------

<h2>4) Changing a FORM_TEMPLATES table at DB</h2>
<p>
    For modals that have some foreign columns (select with options, like providers) 
    we need to change a few things at DB in FORM_TEMPLATES table.
</p>

1) Find ref_table of the modal that you working on
2) Go to DB and execute 
    ```js
   SELECT [REF_TABLE],[FORM_TEMPLATE] FROM [SOAS_DEV].[dbo].[FORM_TEMPLATES] 
   WHERE REF_TABLE = 'formly_[ref_table]'
    ```
3) Now, you have a json result at FORM_TEMPLATE for your ref_table, then you should find your 
    select (foreign column) by searching for ```type: 'native-select'``` 
4) Now you have to change a few properties under the ```"templateOptions"``` 
   1) ```refTable```: to ref_table of foreign column
   2) add ```columnValue```: [COLUMN FROM FOREIGN TABLE] that represents the option value
   3) add ```columnLabel```: [COLUMN FROM FOREIGN TABLE] that represents the option label


    
    Example:
```formly_custbtwoc```
```js
    {
    "fieldGroupClassName": "row",
    "fieldGroup": [
      {
        "key": "PAYMENT_TERM_ID",
        "type": "native-select",
        "className": "col-md-7",
        "defaultValue": "DEVORAUS",
        "templateOptions": {
            "label": "PAYMENT_TERM_ID",
            "required": true,
            "options": [],
            "refTable": "paymentTerms",
            "columnValue": "PAYMENT_TERM_ID",
            "columnLabel": "PAYMENT_TERM_NAME",
            "newItemMode": "false",
            "needsValidation": "false"
        }
      }]
    }
```

--------------------
<h2>5) Related list componets (Taxes, Companies, Warehouse...)</h2>

These are the components that require showing a related list (1 on N relations in DB).

Besides the previous steps we have to add a new property to our ```fetchTableConfig``` variable

```js
relatedList: IRelatedList
```

Example with Taxes component:
```js
  fetchTableConfig: IFetchTableConfig = {
    subtitle: 'Details',
    refTable: 'taxes',
    pk: "TAXCODE",
    relatedList: {
        refTable: 'taxesRate',
        subtitle: 'History',
        referenceColumn: 'TAXCODE',
        pk: 'TAXCODE'
    }
  }
```
