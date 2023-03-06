## SupplyOrders

Based on custom-table-table-form-view.

Link to component: [Link][component]

* Component description:
```

 SupplyOrdersComponent:
 
 2 tables:    [SUPPLY_ORDERS] + [SUPPLY_ORDERS_POSITIONS]
 2 refTables: supplyOrders      + supplyOrdersPosition
 
```

---

### Important requirements before start:

* New table at TABLE_TEMPLATES is created
* New item at FORM_TEMPLATES is added
* New item at IMPORT_TEMPLATES (please extend docs for new import function: IMPORT_TYPE, IMPORT_TYPE_CONSTANTS, IMPORT_TYPE_REFERENCED_TABLES) is added
* Interface and class are added to server/client
* Servers constants.ts (DB_TABLE_COLUMNS) are updated

You find the documentation about that here: [Link][extend-database-two-tables]

---

### 1. Create component:

##### 1.1a Create in the Webstorm terminal via Angular command:

```
ng g component views/supply-orders --module=app
```

##### 1.1b Alternatively, you can manually create a "supply-orders" folder under "views". Then create 4 files there:
* supply-orders.component.ts: Component with logic
* supply-orders.component.spec.ts: Test automation of the component
* supply-orders.component.html: View of the component
* supply-orders.component.css: Component styles

___

#### 1.2 Add html code to new component

##### 1.2.1 supply-orders.component.html

The HTML code for the table, table and form is inserted here:

```
<app-custom-table-table-form-view></app-custom-table-table-form-view>
```

##### 1.2.2 supply-orders.component.css

The custom CSS code for table and form can be inserted here.

```
.table-content {
    padding: 30px;
}
```

##### 1.2.3 supply-orders.component.ts:

Add CustomTableTableFormViewComponent component view:

* Before the constructor:
```
  // custom table table form view component
  @ViewChild(CustomTableTableFormViewComponent) customComponent !: CustomTableTableFormViewComponent;
```

Add ngAfterViewInit() function:
```
ngAfterViewInit() -  Inside of ng after view init, call the initCustomTableFormView() function.
```

Add initCustomTableFormView() function after ngAfterViewInit() and add it to ngAfterViewInit:
```
initCustomTableFormView() - initialize the view, call CustomTableTableFormViewComponent ng after view init function to 
load the table and form data.
```

This function will be completed later. First you need to create constants for the new view in the next step 1.3.

#### 1.3 Extend constants service

Services-path: _services/constants.service.ts

##### 1.3.1 Add new constants

Add the constant names for the new table to the service class. These will be used later in the component.

Constants for referral table and the column name of the "main key":

```
      // referral table name = TABLE_TEMPLATES > REF_TABLE 
      readonly REFTABLE_SUPPLY_ORDERS: string = "supplyOrders";
      readonly REFTABLE_SUPPLY_ORDERS_COLUMN: string = "ORDERREF";
      readonly REFTABLE_SUPPLY_ORDERS_TITLE: string = "SUPPLY_ORDERS";
      readonly REFTABLE_SUPPLY_ORDERS_DETAILS_TITLE: string =
        "SUPPLY_ORDER_DETAILS";
      readonly REFTABLE_SUPPLY_ORDERS_PROV_COLUMN: string = "PROVIDERS_ORDER";
      readonly REFTABLE_SUPPLY_ORDERS_POSITIONS = "supplyOrdersPosition";
      readonly REFTABLE_SUPPLY_ORDERS_POSITIONS_TITLE = "SUPPLY_ORDERS_POSITIONS";
      readonly REFTABLE_SUPPLY_ORDERS_POSITIONS_COLUMN: string = "PROVIDERS_ORDER";
      readonly REFTABLE_SUPPLY_ORDERS_POSITIONS_ID: string = "ITMNUM";
      readonly REFTABLE_SUPPLY_ORDERS_POSITIONS_ROW_ID: string = "ID";
  
```

Constants for item selection:

```
    readonly LS_SEL_SUPPLY_ORDERS_NUMBER: string = "selSupplyOrdersNumber";
    readonly LS_SEL_SUPPLY_ORDERS_POSITION_ID: string =
    "selSupplyOrdersPositionId";
    // DETAIL_ID ?!
    readonly LS_SEL_SUPPLY_ORDERS_POSITION_PROV_ORDERS: string =
    "selSupplyOrdersPositionProvOrders";
```

#### 1.3.2 Add translations into LOCALIZE_IT table:

After adding the constants you need to add the translation for them into db LOCALIZE_IT table. 

Example for countries view:

```
insert into [SOAS].[dbo].[LOCALIZE_IT] ( [LOCALIZE_TAG],[DE_DE],[EN_US]) values ('COUNTRY', 'Land ', 'country');
...
insert into [SOAS].[dbo].[LOCALIZE_IT] ( [LOCALIZE_TAG],[DE_DE],[EN_US]) values ('CREATE_NEW_COUNTRY', 'Neues Land', 'new country');
```


##### 1.3.3 Extend menu for new view

To display the view as a submenu, the constant "MENU_ITEMS" must be extended at _services / constants.service.ts.

The new view should appear in the menu under "Administration" ('ADMINISTRATION'):

Title 'SUPPLY_ORDERS' (table name translation -> LOCALIZE_TAG) and
the "referral table" / refTable name 'countries' (TABLE_TEMPLATES -> REF_TABLE)
must be specified for the new entry.

Menu main items: 

Optional: Add here new main item, if needed.

```
  readonly MENU_ITEMS = [
    {
      title: 'ADMINISTRATION',
      menuItems: [
        {
        ...

```

Required: Add new submenu item 'supplyOrders' to MENU_SUBITEMS > MASTER_DATA > menuItems:

```
readonly MENU_SUBITEMS = [
{
    title: 'MASTER_DATA',
    menuItems: [
        ...
        {
            id: 'supplyOrders1',
            type: 'button',
            title: 'SUPPLY_ORDERS',
            refTable: 'supplyOrders',
        },
        ...
```

---

##### 1.4 Continue with supply-orders.component.ts:

Setup the view initialization inside initCustomTableFormView() function:

* Set referral table name:
```
// referral table name of the db table
this.customComponent.setReferralTable(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS);
```

* Set table column names to query table or select item:
```
this.customComponent.setPrimaryRefTableColumnName(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS_PROV_COLUMN);
this.customComponent.setSecondaryRefTableColumnName(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS_PROV_COLUMN);
```

* Set values from local storage key to query table by or select item:
```
this.customComponent.setSelItemPrimaryLocalStorageKey(this.CONSTANTS.LS_SEL_SUPPLY_ORDERS_NUMBER);
this.customComponent.setSelItemSecondaryLocalStorageKey(this.CONSTANTS.LS_SEL_SUPPLY_ORDERS_POSITION_ID);
```

* Set main table view data settings (column name and local storage key):
```
this.customComponent.setPageParamsPrimaryColumnName(this.CONSTANTS.REFTABLE_COMPONENTS_PRIMARY_COLUMN);
// add local storage key as value
this.customComponent.setPageParamsPrimaryColumnValue(this.CONSTANTS.LS_SEL_COMPONENTS_ITEM_NUMBER);
```

* Set detail table view data settings (referral table and column names):
```
this.customComponent.setDetailViewRefTable(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS_POSITIONS);
this.customComponent.setDetailViewPrimaryRefTableColumnName(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS_POSITIONS_ROW_ID);
```

* Set selected item secondary id local storage key:
```
// local storage key to manage selection of detail view form item...
this.customComponent.setSelItemSecondaryIdLocalStorageKey(this.CONSTANTS.LS_SEL_SUPPLY_ORDERS_POSITION_ID);
```

* Set (detail) form loading data settings (column name and local storage key):
```
// form settings to load data by ID
this.customComponent.setDetailViewFormKey(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS_PROV_COLUMN);
this.customComponent.setDetailViewFormValue(this.CONSTANTS.LS_SEL_SUPPLY_ORDERS_POSITION_ID);
```

* (Optionally) Set options (currency, states etc.) that should be loaded:

Example:
```
    // load only needed form options: countries
    // this.customTableFormComponent.setFormOptionsToLoad([OptionsTypes.countries]);
```

* Set titles for the view:
```
    // set titles
    this.customComponent.setTableTitle('SUPPLY_ORDERS');
    this.customComponent.setDetailTableTitle('SUPPLY_ORDERS_POSITIONS');
    this.customComponent.setDetailFormTitle('SUPPLY_ORDERS_FORM');
    this.customComponent.setCreateTitle('CREATE_NEW_SUPPLY_ORDER');
    this.customComponent.setCreateTooltip('CREATE_NEW_SUPPLY_ORDER');
```

* Set table column names (to be displayed, for search and initial sort) for main table and detail view. Set table paginator:
```
    // set main table...
    // set displayed table column names
    this.customComponent.setTableViewDisplayedColumns(['PROVIDERS_ORDER','ORDERAMOUNT_NET','ORDERREF','ORDERS_DATE']);
    this.customComponent.setTableViewSearchColumn(this.CONSTANTS.REFTABLE_SUPPLY_ORDERS_PROV_COLUMN);
    this.customComponent.setTableViewAdditionalSearchColumns('PROVIDERS_ORDER');
    this.customComponent.setTableViewInitialSort({property: 'PROVIDERS_ORDER', order: 'asc'});
    
    // set paginator
    this.customComponent.setPaginatorElementsPerSideDetailTable(this.CONSTANTS.PAGINATOR_ELEMENTS_PER_SIDE_THREE);
    this.customComponent.setCurrPageSizeDetailTable(this.CONSTANTS.PAGINATOR_MAX_ELEMENTS_TINY);
    
    // set detail view...
    this.customComponent.setDetailViewTableDisplayedColumns(['PROVIDERS_ORDER',  'PRICE_NET', 'WAREHOUSE']);
```

* Set empty item data for new item mode:
```
    // set empty table model for the new item mode
    this.customComponent.setEmptyModel(new SupplyOrders('','','','',0,0,'',0,0,'','',0,0));
```

* Start to load data by activate flag and call ng after view init:
```
    // allow to load view after all parameters are set
    this.customComponent.startLoading = true;
    this.customComponent.ngAfterViewInit();
```

___

#### 1.5 Extend routes

Finally, you have to register the new component with the routes so that the route can be resolved.

Browser-Link: http://localhost:3000/#/supplyOrders

* app-routing-module.ts

Here you enter the "referral table" name "supplyOrders" and the associated component.

```
const routes: Routes = [
    ...

     {
    path: "supplyOrders",
    component: SupplyOrdersComponent,
    canActivate: [AuthGuard],
  },

```
___

#### Additional steps:

custom-table-table-form-view contains following components, which need to be extended:

CustomTableComponent for the main view contains if-conditions that may need to be extended:
* getTempRefTable()

DetailViewListComponent for the table + form views and contains if-conditions that need to be extended:
* setForm()
* getTableAndDataset()
* getModelForSelectedTableRow()


---

[soas]: ../..\soas.md
[component]: ../../..\client\src\app\views\supply-orders\supply-orders.component.ts
[extend-database-two-tables]: ..\extend-database-two-tables.md
