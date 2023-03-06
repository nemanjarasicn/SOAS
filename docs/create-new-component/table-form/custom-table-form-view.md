## custom-table-form-view

###Contains a table view on the left and a form view on the right. Used for example for countries component.

Link to component: [Link][component]

* Component description:

```
    CustomTableFormViewComponent - custom table form view, contains the logic of the components that are using

   - on left view: table view of CustomTableComponent
   - on right view: form view of CustomFormComponent
    
    Used by: Countries, Currencies, PaymentTerms, ProductUnits, Providers, Companies, ImportTypes,
    ImportTypesRefTablesComponent, ImportTypeConstants

   Documentation for this view starts in this md-file at topic ### 1.1
```
---

### 1. Create new custom-table-form-view component:


#### Example: [Countries component][countries-component]:


![](../../images/Countries.png)

* Component description:

```
 CountriesComponent: countries view component with a CustomTableFormViewComponent: table (on left) and form (on right)
 
 table:    [COUNTRIES]
 refTable: countries
```

---

### Important requirements before start:

* New table at TABLE_TEMPLATES is created
* New item at FORM_TEMPLATES is added
* New item at IMPORT_TEMPLATES (please extend docs for new import function: IMPORT_TYPE, IMPORT_TYPE_CONSTANTS, IMPORT_TYPE_REFERENCED_TABLES) is added
* Interface and class are added to server/client
* Servers constants.ts (DB_TABLE_COLUMNS) are updated

You find the documentation about that here: [Link][extend-database-one-table]

---

### Create a new custom-table-form-view for countries component:

Single steps:
---

### 1. Create component

#### 1.1 Create a new custom-table-form-view component on the client:

Following example: Create a "countries" (table and form such as at administration > countries submenu)

##### 1.1.1a Create in the Webstorm terminal via Angular command:

```
ng g component views/countries --module=app
```

##### 1.1.1b Alternatively, you can manually create a "countries" folder under "views". Then create 4 files there:
* countries.component.ts: Component with logic
* countries.component.spec.ts: Test automation of the component
* countries.component.html: View of the component
* countries.component.css: Component styles

___


#### 1.2 Add table and form to new component

##### 1.2.1 countries.component.html

The HTML code for the view tag (contains table and form) is inserted here:

```
<app-custom-table-form-view></app-custom-table-form-view>
```
##### 1.2.2 countries.component.css

The custom CSS code for table and form can be inserted here.


##### 1.2.3 countries.component.ts:

Add CustomTableFormViewComponent component view:

* Before the constructor:
```
// custom table and form view component
@ViewChild(CustomTableFormViewComponent) customComponent !: CustomTableFormViewComponent;
```

Add ngAfterViewInit() function:
```
ngAfterViewInit() -  Inside of ng after view init, call the initCustomTableFormView() function.
```

Add initCustomTableFormView() function after ngAfterViewInit():
```
initCustomTableFormView() - initialize the view, call CustomTableFormViewComponent ng after view init function to 
load the table and form data.
```

---

Setup the view initialization inside initCustomTableFormView() function:

* Set referral table name:
```
// referral table name of the db table
this.customComponent.setReferralTable(this.CONSTANTS.REFTABLE_COUNTRIES);
```

* Set table column names to query table or select item:
```
this.customComponent.setPrimaryRefTableColumnName(this.CONSTANTS.REFTABLE_COUNTRIES_COLUMN);
this.customComponent.setSecondaryRefTableColumnName(this.CONSTANTS.REFTABLE_COUNTRIES_NAME_COLUMN);
```

* Set value from local storage key to query table by or select item:
```
this.customComponent.setSelItemLocalStorageKey(this.CONSTANTS.LS_SEL_COUNTRY_ID);
```

* Set selected item referral table:
```
this.customComponent.setSeItemRefTableTitle(this.CONSTANTS.REFTABLE_COUNTRIES_TITLE);
```

* (Optionally) Set options (currency, states etc.) that should be loaded:
```
// load only needed form options: countries
// this.customTableFormComponent.setFormOptionsToLoad([OptionsTypes.countries]);
```

* Set titles for the view:
```
    // set titles
    this.customComponent.setTableTitle('COUNTRY');
    this.customComponent.setFormTitle('COUNTRY_FORM');
    this.customComponent.setCreateTitle('CREATE_NEW_COUNTRY');
    this.customComponent.setCreateTooltip('CREATE_NEW_COUNTRY');
```

* Set table column names:
```
    // set displayed table column names
    this.customComponent.setDisplayedTableColumns(['COUNTRY_ID', 'COUNTRY_NAME', 'COUNTRY_ISO_CODE']);
    this.customComponent.setSearchTableColumn('COUNTRY_NAME');
    this.customComponent.setAdditionalTableSearchColumns('COUNTRY_ID,COUNTRY_ISO_CODE');
    this.customComponent.setInitialTableSort({property: 'COUNTRY_NAME', order: 'asc'});
```

* Set empty item data for new item mode:
```
    // set empty item id
    this.customComponent.setEmptyItemId(this.CONSTANTS.UNIVERSAL_ID_PLACEHOLDER);
    // set empty table model for the new item mode
    this.customComponent.setEmptyModel(new Countries(0, '', ''));
```

* Start to load data by activate flag and call ng after view init:
```
    // allow to load view after all parameters are set
    this.customComponent.startLoading = true;
    this.customComponent.ngAfterViewInit();
```
___

#### 1.3 Extend constants service

Services-path: _services/constants.service.ts

##### 1.3.1 Add new constants

Add the constant names for the new table to the service class. These will be used later in the component.

4 constants for referral table and the column name of the "main key".

```
  readonly REFTABLE_COUNTRIES: string = "countries";
  readonly REFTABLE_COUNTRIES_COLUMN: string = "COUNTRY_ID";
  readonly REFTABLE_COUNTRIES_NAME_COLUMN: string = "COUNTRY_NAME";
```

Constant for the currently / last selected row in the table.

```
  readonly LS_SEL_COUNTRY_ID: string = "selCountryId";
```

___


##### 1.3.2 Extend menu

To display the view as a submenu, the constant "MENU_ITEMS" must be added
to _services / constants.service.ts.

The new view should appear in the menu under "Administration" ('ADMINISTRATION'):

Title 'COUNTRIES' (table name translation -> LOCALIZE_TAG) and
the "referral table" / refTable name 'countries' (TABLE_TEMPLATES -> REF_TABLE)
must be specified for the new entry.

```
  readonly MENU_ITEMS = [
    {
      title: 'ADMINISTRATION',
      menuItems: [
        {
        ...

```

Add new 'countries' item to MENU_SUBITEMS > MASTER_DATA > menuItems:

```
readonly MENU_SUBITEMS = [
{
    title: 'MASTER_DATA',
    menuItems: [
        ...
        {
            id: 'countries1',
            type: 'button',
            title: 'COUNTRIES',
            refTable: 'countries',
        },
        ...
```

___


#### 1.4 Add translations into LOCALIZE_IT table:

```
insert into [SOAS].[dbo].[LOCALIZE_IT] ( [LOCALIZE_TAG],[DE_DE],[EN_US]) values ('COUNTRY', 'Land ', 'country');
...
insert into [SOAS].[dbo].[LOCALIZE_IT] ( [LOCALIZE_TAG],[DE_DE],[EN_US]) values ('CREATE_NEW_COUNTRY', 'Neues Land', 'new country');
```

___

#### 1.6 Extend routes

Finally, you have to register the new component with the routes so that the route can be resolved.

Browser-Link: http://localhost:3000/#/countries

* app-routing-module.ts

Here you enter the "referral table" name "countries" and the associated component.

```
const routes: Routes = [
    ...

     {
    path: "countries",
    component: CountriesComponent,
    canActivate: [AuthGuard],
  },

```

___

[soas]: ../..\soas.md
[component]: ../../..\client\src\app\views\custom\custom-views\custom-table-form-view\custom-table-form-view.component.ts
[countries-component]: ../../..\client\src\app\views\countries\countries.component.ts
[extend-database-one-table]: ..\extend-database-one-table.md
