## custom-table-table-form-view

###Contains a table view on the left and a table + form view on the right. Used for example for article-partlist (partlist=components = DIST_COMPONENTS) component.

Link to component: [Link][component]

* Component description:

```
CustomTableTableFormViewComponent - custom table table form view - contains the logic of the components that are using

- on left view: table view of CustomTableComponent
- on right view: table and form views of DetailViewListComponent

Used by: Warehousing, Taxes, ProductComponents, Attributes, ArticleComponents, SupplyOrdersComponent

Documentation at: /docs/create-new-component/table-table-form/custom-table-table-form-view.md
```
---

### 1. Create new custom-table-table-form-view component:

Example [ArticleComponentsComponent][article-components-component]:

![](C:\Repos\Soas\docs\images\Article-partlist.png)

* Component description:

```
ArticleComponentsComponent - article components component with a CustomTableTableFormViewComponent:
table (on left) and table + form (on right)

table: [DIST_COMPONENTS]
refTable: components
```


---

### Important requirements before start:

* New table at TABLE_TEMPLATES is created
* New item at FORM_TEMPLATES is added
* New item at IMPORT_TEMPLATES (please extend docs for new import function: IMPORT_TYPE, IMPORT_TYPE_CONSTANTS, IMPORT_TYPE_REFERENCED_TABLES) is added
* Interface and class are added to server/client
* Servers constants.ts (DB_TABLE_COLUMNS) are updated

Depends on how many tables the component is based, you will find the documentation about it here:
* 1 table; [Link][extend-database-one-table]
* 2 tables: [Link][extend-database-two-tables]

---

### 1. Create component:

##### 1.1a Create in the Webstorm terminal via Angular command: 

```
ng g component views/article-components --module=app
```

##### 1.1b Alternatively, you can manually create an "article-components" folder under "views". Then create 4 files there: 
* article-components.component.ts: Component with logic
* article-components.component.spec.ts: Test automation of the component
* article-components.component.html: View of the component
* article-components.component.css: Component styles 

___

#### 1.2 Add table and form to new component

##### 1.2.1 article-components.component.html 

The HTML code for the table and form is inserted here:

```
<app-custom-table-table-form-view></app-custom-table-table-form-view>
```

##### 1.2.2 article-components.component.css

The custom CSS code for table and form can be inserted here.


##### 1.2.3 article-components.component.ts: 

Add CustomTableTableFormViewComponent component view:

* Before the constructor:
```
  // custom table form view component
  @ViewChild(CustomTableTableFormViewComponent) customComponent !: CustomTableTableFormViewComponent;
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
// referral table names of the db table
this.customComponent.setReferralTable(this.CONSTANTS.REFTABLE_COMPONENTS);
```

* Set table column names to query table or select item:
```
this.customComponent.setPrimaryRefTableColumnName(this.CONSTANTS.REFTABLE_COMPONENTS_PRIMARY_COLUMN);
this.customComponent.setSecondaryRefTableColumnName(this.CONSTANTS.REFTABLE_COMPONENTS_SECONDARY_COLUMN);
```

* Set values from local storage key to query table by or select item:
```
// local storage keys
// keys by name (ITMNUM and COMPNUM)
this.customComponent.setSelItemPrimaryLocalStorageKey(this.CONSTANTS.LS_SEL_COMPONENTS_ITEM_NUMBER);
this.customComponent.setSelItemSecondaryLocalStorageKey(this.CONSTANTS.LS_SEL_COMPONENTS_COMPNUM);
// keys by id
this.customComponent.setSelItemPrimaryIdLocalStorageKey(this.CONSTANTS.LS_SEL_COMPONENTS_ID);
this.customComponent.setSelItemSecondaryIdLocalStorageKey(this.CONSTANTS.LS_SEL_COMPONENTS_DETAILS_ID);
```

* Set main table view data settings (column name and local storage key):
```
this.customComponent.setPageParamsPrimaryColumnName(this.CONSTANTS.REFTABLE_COMPONENTS_PRIMARY_COLUMN);
// add local storage key as value
this.customComponent.setPageParamsPrimaryColumnValue(this.CONSTANTS.LS_SEL_COMPONENTS_ITEM_NUMBER);
```

* Set detail table view data settings (referral table and column names):
```
this.customComponent.setDetailViewRefTable(this.CONSTANTS.REFTABLE_COMPONENTS_DETAILS);
this.customComponent.setDetailViewPrimaryRefTableColumnName(this.CONSTANTS.REFTABLE_COMPONENTS_PRIMARY_COLUMN);
```

* Set selected item referral table ( used for detail-view-list > getTableAndDataset() )
```
this.customComponent.setSeItemRefTableTitle(this.CONSTANTS.REFTABLE_COMPONENTS_TITLE);
```

* Set (detail) form loading data settings (column name and local storage key):
```
    // form settings to load data by ID
    this.customComponent.setDetailViewFormKey(this.CONSTANTS.REFTABLE_COMPONENTS_ID_COLUMN);
    // add local storage key as value
    this.customComponent.setDetailViewFormValue(this.CONSTANTS.LS_SEL_COMPONENTS_DETAILS_ID);
```

* Set a flag, that in details view the data should be shown based on second table referral name (not primary)
``` 
this.customComponent.setShowSecondTableDataInDetailsView(false);
```

* (Optionally) Set options (currency, states etc.) that should be loaded:
```
    // load only needed form options: countries
    // this.customTableFormComponent.setFormOptionsToLoad([OptionsTypes.countries]);
```

* Set titles for the view:
```
    // set titles
    this.customComponent.setTableTitle('ARTICLE_COMPONENTS');
    this.customComponent.setDetailTableTitle('ARTICLE_COMPONENTS');
    this.customComponent.setDetailFormTitle('ARTICLE_COMPONENT');
    this.customComponent.setCreateTitle('CREATE_NEW_COMPONENT');
    this.customComponent.setCreateTooltip('CREATE_NEW_COMPONENT');
```

* Set table column names (to be displayed, for search and initial sort) for main table and detail view:
```
    // set main table...
    // set displayed table column names
    this.customComponent.setTableViewDisplayedColumns(['ITMNUM', 'DIST_QTY']);
    this.customComponent.setTableViewSearchColumn('ITMNUM');
    this.customComponent.setTableViewAdditionalSearchColumns('ID,COMPNUM,DIST_QTY');
    this.customComponent.setTableViewInitialSort({property: 'ITMNUM', order: 'asc'});
    this.customComponent.setTableViewColumnsToHide(['COMPNUM','PROD_QTY','PROD_UNIT']);
    
    // set detail view...
    this.customComponent.setDetailViewTableDisplayedColumns(['ID', 'ITMNUM', 'COMPNUM', 'DIST_QTY']);
```

* Set empty item data for new item mode:
```
    // set empty item id
    // this.customTableTableFormComponent.setEmptyItemId(this.CONSTANTS.UNIVERSAL_ID_PLACEHOLDER);
    // set empty table model for the new item mode
    this.customComponent.setEmptyModel(new DistComponent(0, '', '',0));
```

* Start to load data by activate flag and call ng after view init:
```
    // allow to load view after all parameters are set
    this.customComponent.startLoading = true;
    this.customComponent.ngAfterViewInit();
```

---

[soas]: ../..\soas.md
[component]: ../../..\client\src\app\views\custom\custom-views\custom-table-table-form-view\custom-table-table-form-view.component.ts
[article-components-component]: ../../..\client\src\app\views\article-components\article-components.component.ts
[extend-database-one-table]: ..\extend-database-one-table.md
[extend-database-two-tables]: ..\extend-database-two-tables.md
