# SOAS

## Dokumentation

Letzter Stand: 25.08.2020
___

Inhalt:

> 1. Neue View erstellen
> 2. Formular um ein neues Feld erweitern
> 3. Viewstypen
> 4. CSV Import Dialog
> 5. Batch Dialog

___

### 1. Neue View erstellen:

Beispiel: "Produktionsstückliste - production parts list" erstellen (Tabelle und Formular wie z.B. bei Verwaltung > Länder/countries)

#### 1.1 Auf dem Client eine neue Komponente/Component erstellen:

##### 1.1.1a Erstellen im Webstorm Terminal per Angular Command:

```
ng g component views/production-parts-list --module=app
```

##### 1.1.1b Alternativ kann man manuell einen Ordner "productionPartsList" unter "views" erstellen. Dort dann 4 Dateien anlegen:
* production-parts-list.component.ts: Komponente mit der Logik
* production-parts-list.component.spec.ts: Testautomatisierung der Komponente
* production-parts-list.component.html: View der Komponente
* production-parts-list.component.css: Styles der Komponente

___

#### 1.2 Tabelle und Formular zu neuer Komponente hinzufügen.

##### 1.2.1 production-parts-list.component.html

Hier wir der HTML-Code für Tabelle und Formular eingefügt:

```
<div class="table-content">
  <div class="mat-elevation-z8">
    <div class="two-columns-container">
      <div class="column-table">
        <custom-table [custTableUpdate]="custTableUpdateFunc" [custTableCreate]="custTableCreateFunc"></custom-table>
      </div>
      <div class="column-form" [style.display]="selTableRow ? 'block' : 'none'">
        <custom-form [loadForm]="loadFormFunc" [resetForm]="countriesResetFormFunc" [saveForm]="countriesSaveFormFunc"></custom-form>
      </div>
    </div>
  </div>
</div>
```
##### 1.2.2 production-parts-list.component.css

Hier wird der CSS-Code für Tabelle und Formular eingefügt.

```
.table-content {
  padding: 30px;
}

table {
  width: 100%;
}

th.mat-sort-header-sorted {
  color: black;
}

.two-columns-container {
  display: flex;
}

.column-table,
.column-form {
  float: left;
}

.column-table {
  flex: 1;
}

.column-form {
  flex: 1;
  min-width: 700px;
  background: white;
  padding: 30px;
  margin-left: 10px;
}

.mat-elevation-z8 {
  box-shadow: none;
}
```

##### 1.2.3 production-parts-list.component.ts:

Hier werden die Title und Verweis-Tabelle gesetzt. Anschließend die Daten für die Tabelle und Formular geladen.

* Vor dem Konstruktor:

```
@ViewChildren(CustomTableComponent) customTableComponent !: QueryList<CustomTableComponent>; - Table view child
@ViewChildren(CustomFormComponent) customFormComponent !: QueryList<CustomFormComponent>; - Form view child
```

```
ngOnInit() -  Set titles and referral table.
```

* Nach ngOnInit() werden folgende Methoden benötigt:

```
ngAfterViewInit() - Load table and form data.
loadTableData() - Load table, trigger form data load.
loadFormData() - Load form data.
formChangedLogic() - if form change event is triggered, load form data
tableClickLogic() - Table click logic. 
saveForm() - Save form logic.
emptyForms() - Formular leeren.
```

* ngAfterViewInit(): Lade Formular Daten, setze Klick auf die Tabelle und lade Tabellen- und Formular-Daten.

```
  ngAfterViewInit() {

    // at form change: load form data
    if (this.customFormComponent) {
      this.customFormComponent.first.setLabels(this.formTitle, this.createTitle);
      let self = this;
      this.customFormComponent.changes.subscribe(cp => {
         self.formChangedLogic(this);
      });
    }
    
    // set table click
    if (this.customTableComponent) {
      let self = this;
      this.customTableComponent.first.setClickedRow = function (tableRow) {
        self.emptyForms();
        self.tableClickLogic(tableRow, this);
      };
    }

    // load table data
    this.loadTableData();

  }
```

* Zusatzmethoden hinzufügen

Zusätzlich müssen noch weitere Methoden für die Kommunikation mit der Tabelle und Formular hinzugefügt werden. Damit ist es möglich aus der Tabelle oder Formular heraus, die Methoden der Componente aufzurufen.

Für die Tabelle:

```
  get custTableUpdateFunc() {
    return this.custTableUpdate.bind(this);
  }
  
  get custTableCreateFunc() {
    return this.createItem.bind(this);
  }

```

Für Formular:

```
 get custFormLoadFormFunc() {
   return this.loadForm.bind(this);
 }
  
 get custFormSaveFormFunc() {
   return this.saveForm.bind(this);
 }
  
 get custFormResetFormFunc() {
   return this.resetForm.bind(this);
 }

```

* Provider hinzufügen

Außerdem ist es wichtig die Provider für die Übersetzungen und Info Messages Dialog zu registrieren. Wenn man es vergisst, wird die Tabelle nicht geladen und es gibt keine Fehlermeldung.

Die beiden Provider SoasTranslateItPipe und MessageService werden vor der Definition der Klasse im @Compontent({ ... }) eingetragen.

```
@Component({
  selector: 'app-production-parts-list',
  templateUrl: './production-parts-list.component.html',
  styleUrls: ['./production-parts-list.component.css'],
  providers: [SoasTranslateItPipe, MessageService]
})
export class ProductionPartsListComponent implements OnInit {
```
___

#### 1.3 Services erweitern

Services-Pfad: _services/constants.service.ts

##### 1.3.1 Konstanten hinzufügen

Füge in die Service Klasse die Konstanten Namen für die neue Tabelle hinzu. Diese werden später in der Komponente verwendet.

4 Konstanten für Referral Table und der Spaltenname des "Hauptkeys".

```
  readonly REFTABLE_PRODUCTION_PARTS_LIST: string = "productionPartsList";
  readonly REFTABLE_PRODUCTION_PARTS_LIST_COLUMN: string = "ITMNUM";
  readonly REFTABLE_PRODUCTION_PARTS_PARTNUM: string = "PARTNUM";
  readonly REFTABLE_PRODUCTION_PARTS_LIST_TITLE: string = "PRODUCTION_PARTS_LIST";
```

Konstante für die aktuell/zuletzt ausgewählte Reihe der Tabelle.

```
  readonly LS_SEL_PRODUCTION_PARTS_LIST: string = "selProductionPartsList";
```

___


##### 1.3.2 Menü erweitern

Damit die View als Untermenü angezeigt wird muss die Konstante "MENU_ITEMS" in _services/constants.service.ts ergänzt werden.

Neue View soll im Menü unter Punkt "Verwaltung" ('ADMINISTRATION') erscheinen:

Es müssen Titel/title (Tabellenname-Übersetzung -> LOCALIZE_TAG) und die "referral table"/refTable Name (TABLE_TEMPLATES -> REF_TABLE) beim neuen Eintrag angegeben werden.

```
  readonly MENU_ITEMS = [
    {
      title: 'ADMINISTRATION',
      menuItems: [
        {
        ...
        {
          title: 'PRODUCTION_PARTS_LIST',
          refTable: 'productionPartsList'
        }
        ...

```

___


#### 1.4 Übersetzungen hinzufügen:

```
insert into [SOAS].[dbo].[LOCALIZE_IT] ( [LOCALIZE_TAG],[DE_DE],[EN_US]) values ('PRODUCTION_PARTS_LIST', 'Produktionsstücklisten ', 'production parts list');
insert into [SOAS].[dbo].[LOCALIZE_IT] ( [LOCALIZE_TAG],[DE_DE],[EN_US]) values ('CREATE_NEW_PRODUCTION_PARTS_LIST', 'Neue Produktionsstückliste', 'new production parts list');
```

___

#### 1.6 Routen erweitern

Schließlich muss man die neue Komponente bei den Routen anmelden, damit die Route Browser aufgelöst wird.

Browser-Link: http://localhost:3000/productionPartsList;id=productionPartsList

* app-routing-modue.ts

Hier gibt man die "referral table" Name "productionPartsList" und die zugehörige Komponente an.

```
const routes: Routes = [
    ...

     { path: 'productionPartsList', component: ProductionPartsListComponent, canActivate: [AuthGuard] },

```
___

#### 1.7 Datenbank erweitern:

##### 1.7.1 Neue Tabelle "PRODUCTION_PARTS_LIST" erstellen:

SQL-Query:

```
CREATE TABLE SOAS.dbo.PRODUCTION_PARTS_LIST (ITMNUM nvarchar(255) NOT NULL, PARTNUM nvarchar(255) NOT NULL, PART_QTY decimal(10,8) NULL);
```
___

##### 1.7.2 Tabelle "TABLE_TEMPLATES" um neue Tabelle erweitern:

Wichtig: Anzahl der Felder und deren Reihenfolge sollten bei TABLE_TEMPLATES> DETAIL_VIEW und FORM_TEMPLATES gleich sein. Andernfalls zeigt das Formular keine Formulardaten an.

Die Angaben bewirken die Darstellung der neuen Tabelle. In "TEMPLATE_FIELDS" werden die Header-Namen für Tabellenspalten angegeben. In "DETAIL_VIEW" werden die Namen für die Formularfelder angegeben.

Wichtig: Bei der Angabe der Felder für "TEMPLATE_FIELDS" und "DETAIL_VIEW" keine Leerzeichen verwenden, weil sonst die Tabelleninhalte später nicht angezeigt werden können!

* Richtig: "TEMPLATE_FIELDS" => 'ITMNUM,PARTNUM,PART_QTY'
* Falsch: "TEMPLATE_FIELDS" => 'ITMNUM, PARTNUM, PART_QTY'

SQL-Query:
```
INSERT INTO [SOAS].[dbo].[TABLE_TEMPLATES] (REF_TABLE,TEMPLATE_FIELDS,TABLE_NAME,DETAIL_VIEW) values ('productionPartsList','ITMNUM,PARTNUM,PART_QTY','PRODUCTION_PARTS_LIST','ITMNUM,PARTNUM,PART_QTY');
```

___

##### 1.7.3 Tabelle "FORM_TEMPLATES" um neue Tabelle erweitern:

Wichtig: Anzahl der Felder und deren Reihenfolge sollten bei TABLE_TEMPLATES> DETAIL_VIEW und FORM_TEMPLATES gleich sein. Andernfalls zeigt das Formular keine Formulardaten an.

Die Angaben in der Tabelle "FORM_TEMPLATES" bewirken die Darstellung der Formularfelder bei der Erstellung eines Datensatzes.

#### Formly

https://formly.dev/

Angular-Bibliothek Formly wird verwendet, um dynamische Formulare anzuzeigen. Die Formularvorlage sollte im JSON-Format vorliegen.

Für die Speicherfunktion müssen wir jedem Feld spezifische Attribute hinzufügen.
Formulardaten sollten alle notwendigen Daten für jedes Feld enthalten, das im Formularfeld "templateOptions" gespeichert sind, wie:

* "refTable": "Länder" - Name der Verweistabelle
* "tableName": "COUNTRIES" - Tabellenname zum Speichern von Daten.
* "newItemMode": "false" - Flag für neuer Item Modus. 
  Standardmäßig ist auf "false" gesetzt. Wird beim Laden automatisch auf "true" gesetzt.
* "isPrimary": "true" - Flag, um das Feld als primär zu markieren, damit der Primärschlüssel erkannt wird. Fügen Sie es nur hinzu, wenn das Feld wirklich ein Primärschlüssel ist. Sie müssen also nicht "isPrimary": "false" hinzufügen, wenn das Feld kein Primärschlüssel ist.
* "isIdentity": "true" - Flag, um zu bestimmen, ob der Primärschlüssel ein IDENTITY-Typ ist ([ID] [int] IDENTITY(1,1) NOT NULL) und nicht in die DB gespeichert werden muss, da es automatisch erstellt wird.
  Wenn es keine Identität ist, sollte der Primärwert in die DB-Tabelle gespeichert werden: wie für ORDERS_NUMBER oder PAYMENT_TERM_ID
* "needsValidation": "false" - für zukünftige Validierung des Feldes

Beispiel für eine Länderansichtsformularvorlage:

```
  INSERT INTO [SOAS].[dbo].[FORM_TEMPLATES] (REF_TABLE,FORM_TEMPLATE) values ('formly_countries',
  '[{"fieldGroupClassName":"row","fieldGroup":[{"className":"col-md-3","type":"input","key":"COUNTRY_ID","templateOptions":{"label":"COUNTRY_ID","required":true,"refTable":"countries","tableName":"COUNTRIES","newItemMode": "false", "isPrimary": "true","isIdentity": "true","needsValidation": "false"},"expressionProperties": {"templateOptions.disabled": "true"}}]},{"fieldGroupClassName":"row","fieldGroup":[{"className":"col-md-12","type":"input","key":"COUNTRY_NAME","templateOptions":{"label":"COUNTRY_NAME","required":true,"refTable":"countries","tableName":"COUNTRIES","newItemMode": "false","needsValidation": "true"},"expressionProperties": {"templateOptions.disabled": "false"}}]},{"fieldGroupClassName":"row","fieldGroup":[{"className":"col-md-12","type":"input","key":"COUNTRY_ISO_CODE","templateOptions":{"label":"COUNTRY_ISO_CODE","required":true,"refTable":"countries","minLength":2,"maxLength":2,"attributes":{"style":"text-transform: uppercase"},"tableName":"COUNTRIES","newItemMode": "false","needsValidation": "true"},"expressionProperties": {"templateOptions.disabled": "false" }}]}]'
   );
```

Tabellen mit IDENTITÄT:

```
COUNTRY_ID - COUNTRIES
```
```
CURRENCY_ID - CURRENCIES
```
```
ID - CUSTOMERS_ADDRESSES, DIST_COMPONENTS, ORDERS_POSITIONS, DELIVERY_NOTES_POSITIONS, INVOICES_POSITIONS, ITEM_BASIS, PRILISTS, WAREHOUSING
```


___

##### 1.7.4 Tabelle "LOCALIZE_IT" um neue Tabellenfelder erweitern:

Wenn die neue Tabelle neue Tabellen- oder Formularfelder beinhaltet, dann müssen diese für die korrekte Darstellung und auch für die Übersetzungen in die Tabelle "LOCALIZE_IT" eingetragen werden.

SQL-Query:

```
INSERT INTO [SOAS].[dbo].[LOCALIZE_IT] ( [LOCALIZE_TAG],[DE_DE],[EN_US]) values ('PARTNUM', 'Artikelnummer','part number');
```

___

##### 1.7.5 Tabelle "IMPORT_TEMPLATES" um neue Tabellenfelder erweitern:

Wenn die neue Tabelle CSV-Import unterstützen soll, dann müssen  in die Tabelle "IMPORT_TEMPLATES" eingetragen werden.

SQL-Query:

```
INSERT INTO [SOAS].[dbo].[IMPORT_TEMPLATES] ([TEMPLATE_NAME],[TEMPLATE_DESCRIPTION],[TEMPLATE_FIELDS],[REF_TABLE],[UPDATE_FIELDS]) values 
('Länder',
'Vorlage zum Import von Ländern', 
'COUNTRY_NAME,COUNTRY_ISO_CODE',
'COUNTRIES',
'');
```

___

#### 1.8 Interfaces und Klassen für die neue Komponente hinzufügen:

Es müssen sowohl auf dem Client, als auch auf dem Server Interfaces und Klassen(Models) angelegt werden.


##### 1.8.1 Client:

* interfaces/production-parts-list-item.ts: Interface erstellen.

```
ng g interface interfaces/production-parts-list-item
```

Inhalt vom Interface:

```
export interface ProductionPartsListItem {
  ITMNUM: string;
  PARTNUM: string;
  PART_QTY: number;
}

```

* models/production-parts-list.ts: Klasse erstellen.

```
ng g class models/production-parts-list
```

Inhalt der Klasse:

```
export class ProductionPartsList {
  constructor(
    public ITMNUM: string,
    public PARTNUM: string,
    public PART_QTY: number
  ) {
  }
}
```

##### 1.8.2 Server:

Hier legt man manuell oder per Terminal Command 2 Dateien für die Klasse und Interface an:

* routes/logic/classes/interfaces/ProductionPartsListInterface.ts

Das Interface muss die Datenbankfelder der Tabelle beinhalten.

```
export interface ProductionPartsListInterface {
    productionPartsListName: string;
    productionPartsListPartNumber: string;
    productionPartsListQuantity: number;
}

export interface ProductionPartsListDataInterface {
    ITMNUM: string;
    PARTNUM: string;
    PART_QTY: number;
}

```

* routes/logic/classes/ProductionPartsList.ts

Die Klasse baut auf dem Interface auf und beinhaltet die Setter und Getter Methoden.

```
import {ProductionPartsListInterface, ProductionPartsListDataInterface} from "./interfaces/ProductionPartsListInterface";

export class ProductionPartsList implements ProductionPartsListInterface {
    private _productionPartsListName: string;
    private _productionPartsListPartNumber: string;
    private _productionPartsListQuantity: number;

    constructor(productionPartsListData: ProductionPartsListDataInterface) {
        this._productionPartsListName = productionPartsListData.ITMNUM;
        this._productionPartsListPartNumber = productionPartsListData.PARTNUM;
        this._productionPartsListQuantity = productionPartsListData.PART_QTY;
    }

    get productionPartsListData(): ProductionPartsListDataInterface {
        return {
            ITMNUM: this._productionPartsListName,
            PARTNUM: this._productionPartsListPartNumber,
            PART_QTY: this._productionPartsListQuantity
        }
    }

    get productionPartsListName (): string {
        return this._productionPartsListName;
    }

    set productionPartsListName (value: string) {
        this._productionPartsListName = value;
    }

    get productionPartsListPartNumber(): string {
        return this._productionPartsListPartNumber;
    }

    set productionPartsListPartNumber(value: string) {
        this._productionPartsListPartNumber = value;
    }

    get productionPartsListQuantity(): number {
        return this._productionPartsListQuantity;
    }

    set productionPartsListQuantity(value: number) {
        this._productionPartsListQuantity = value;
    }
}

```

##### 1.8.3 TableController Klasse erweitern

routes/logic/controller/TableController.ts

Das Interface und die Klasse muss dann im TableController angegeben werden, damit die auch für die Datenkonsistenz Prüfung erkannt werden.

Dazu erweitert man die switch Funktion um ein weiteres "case". Als "tableid" gibt man die referral table Namen aus z.B. der Tabelle "TABLE_TEMPLATES->REF_TABLE":

```
            case('productionPartsList'):
                for (let item in this.jsonData) {
                    this.jsonTempData.push((new ProductionPartsList(<ProductionPartsListDataInterface>this.jsonData[item])).productionPartsListData);
                }
                this.jsonResult.push(this.jsonTempData);
                break;
```

##### 1.8.4 Server Klassen kompilieren

Nach dem alle Änderungen auf dem Server getätigt wurden, müssen die Klassen einmal kompiliert werden, damit diese vom Typescript zu Javascript übersetzt werden.

Dazu führt man die folgende Anweisung im Terminal im Server Pfad, z.B.: "...\WebstormProjects\SOAS-GIT>"

```
tsc -t es5 app.ts
```

Danach muss man der Server einmal stoppen und dann neustarten, damit die Änderung greifen.

___

### 2. Formular um ein neues Feld erweitern

#### 2.1 Neue Spalte in die Datenbank-Tabelle einfügen:

##### Beispiel-SQL-Queries:

* "ALTER TABLE [SOAS].[dbo].[CUSTOMERS_ADDRESSES] ADD NAME_ADDR nvarchar(255) NULL;"

* Für ID's die nicht Primary Key sein sollten und nur automatisch hochgezählt werden sollten, sollte IDENTITY(1,1) verwendet werden: "ALTER TABLE [SOAS].[dbo].[PRILISTS] ADD ID int IDENTITY(1,1) NOT NULL;"

* Bestehende Spalte den Typ ändern (z.B.: von nchar auf nvarchar): "ALTER TABLE [SOAS].[dbo].[CUSTOMERS_ADDRESSES] ALTER COLUMN NAME_ADDR nvarchar(255) NULL;"

* Bestehende Spalte umbenennen: "EXEC sp_rename 'SOAS.dbo.CUSTOMERS_ADDRESSES.NAME_ADDR', 'NAME_ADDR_NEU', 'COLUMN';"

Orders/Bestellung

___

#### 2.2 Interfaces und Models erweitern:

##### Server:

Auf dem Server müssen die Klassen und Interfaces erweitert werden.

* routes\logic\classes\interfaces\CustomerAddressInterface.ts
* routes\logic\classes\CustomerAddress.ts

##### Client:

Auch auf dem Client müssen die Interfaces und Models erweitert werden.

* client\src\app\interfaces\customers-addr-item.ts
* client\src\app\model\customer-add.ts

Falls nötig: Erweitere Model in der jeweiligen Komponente um das neue Feld.

___

#### 2.3 Neues Feld in die Datenbanktabelle TABLE_TEMPLATES > DETAIL_VIEW einfügen

SQL-Query: "update [SOAS].[dbo].[TABLE_TEMPLATES] set
[DETAIL_VIEW] = 'ID,ADDRESS_TYPE,CUSTOMER_NUMBER,NAME_ADDR,ADDRESS_CRYNAME,ADDRESS_STREET,ADDRESS_CITY,ADDRESS_POSTCODE,ADDRESS_ISO_CODE,TAXATION,ADDRESS_COMMENT' where [REF_TABLE] = 'customersAddrDlv';"

#### 2.4 Neues Feld in die Datenbanktabelle FORM_TEMPLATES > FORM_TEMPLATE einfügen

SQL-Query:


```
update [SOAS].[dbo].[FORM_TEMPLATES] set [FORM_TEMPLATE] = 
'{"ADDRESS_TYPE":"INV","CUSTOMERS_NUMBER":"","NAME_ADDR":"","ADDRESS_CRYNAME":"Deutschland","ADDRESS_STREET":"","ADDRESS_CITY":"","ADDRESS_POSTCODE":"","ADDRESS_ISO_CODE":"DE","TAXATION":"DEK","ADDRESS_COMMENT":""}'
where [REF_TABLE] = 'customersAddrInv';
```
___

#### 2.5 Übersetzung für das neue Feld in die LOCALIZE_IT einfügen (Deutsch und Englisch). Vorher prüfen, ob es bereits vorhanden ist.

* Prüfen:

```
SELECT TOP (1000) [LOCALIZE_TAG],[DE_DE],[EN_US]
FROM [SOAS].[dbo].[LOCALIZE_IT] where DE_DE LIKE '%Artikel%' OR LOCALIZE_TAG LIKE '%DELETE%';
```

* Einfügen:

```
insert into [SOAS].[dbo].[LOCALIZE_IT] ( [LOCALIZE_TAG],[DE_DE],[EN_US]) values ('NAME_ADDR', 'Name', 'name');
```

Wichtig: Nach dem Einfügen oder Aktualisieren der Tabelle LOCALIZE_IT müssen Sie sich abmelden und erneut anmelden, um die Wirkung zu sehen.
LocalStorage-Elemente werden beim Abmelden gelöscht und beim Anmelden eingefügt.

___

#### 2.6 Prüfen, ob das neue Feld eventuell auf dem Server in den SQL-Queries angegeben werden sollte:

* routes > logic > mssql_logic > mssql_select_Table_by_Number

___

### 3. Viewstypen

##### 3.1 CustomTableComponent

Tabellen Ansicht.

HTML-Tag:

```
<custom-table></custom-table>
```
___

##### 3.2 CustomFormComponent

Formular Ansicht.

HTML-Tag:

```
<custom-form></custom-form>
```
___

##### 3.3 DetailViewListComponent

Detailansicht mit einer Tabelle oberhalb und einem Formular unterhalb.

HTML-Tag:

```
<app-detail-view-list></app-detail-view-list>
```
___

##### 3.4 DetailViewCustomerComponent

Detailansicht mit 5 Tabs (Kunde,Bestellung,Lieferschein,Rechnung,Kommentar).
Jeder Tab beinhaltet mindestens einen Tab, wo dann die Daten im Form von Formulare oder Tabelle dargestellt werden.

###### 3.4.1 Die 5 Tabs

* Kunde: Beinhaltet 3 Tabs (Kunden-Details, Lieferadressen und Rechnungsadressen)
* Bestellung: Beinhaltet 2 Tabs (Bestellung, Bestellposition)
* Lieferschein: Beinhaltet 2 Tabs (Lieferschein, Lieferscheinposition)
* Rechnung: Beinhaltet 2 Tabs (Rechnung, Rechnungsposition)
* Kommentar: Noch nicht implementiert.

einen Tabelle oberhalb und einem Formular unterhalb.

HTML-Tag:

```
<app-detail-view-customer></app-detail-view-customer>
```
___

##### 3.5 ArticleComponentsComponent - Artikel - Stücklisten:

**Ordner**: views/article-components

**URL**: http://localhost:3000/#/components

**Referenz Tabellenname/URL-Actionname (refTable)**: components

**View selector**: 'app-article-components'

**DB-Tabelle**: DIST_COMPONENTS

**Beschreibung**:

Die Ansicht besteht aus:
* **Links**: CustomTableComponent - Eine Tabelle mit Übersicht aller Artikel-Stücklisten.
* **Rechts**: DetailViewListComponent - Die Detail Ansicht bestehend aus einem View-Element mit 2 Komponenten:
    - Oben: CustomTableComponent -  Eine Tabelle mit allen Artikel-Stücklisten, die den gleichen Namen (Artikelnummer) wie der links ausgewählte Eintrag haben.
    - Unten: CustomFormComponent - Die Detail-Ansicht als Formular mit Tabellenfeldern der oben ausgewählten Artikel-Stückliste.

___

##### 3.6 ArticlesComponent - Artikel:

**Ordner**: views/articles

**URL**: http://localhost:3000/#/articles

**Referenz Tabellenname/URL-Actionname (refTable)**: articles

**View selector**: 'app-articles'

**DB-Tabelle**: ITEM_BASIS

**Beschreibung**:

Die Ansicht besteht aus:
* **Links**: CustomTableComponent - Eine Tabelle mit Übersicht aller Artikel.
* **Rechts**: CustomFormComponent - Die Detail-Ansicht als Formular mit Tabellenfeldern vom ausgewählten Artikel.

___

##### 3.7 CurrenciesComponent - Währungen:

**Ordner**: views/currencies

**URL**: http://localhost:3000/#/currencies

**Referenz Tabellenname/URL-Actionname (refTable)**: currencies

**View selector**: 'app-currencies'

**DB-Tabelle**: CURRENCIES

**Beschreibung**:

Die Ansicht besteht aus:
* **Links**: CustomTableComponent - Eine Tabelle mit Übersicht aller Währungen.
* **Rechts**: CustomFormComponent - Die Detail-Ansicht als Formular mit Tabellenfeldern der ausgewählten Währung.

___

##### 3.8 CountriesComponent - Länder:

**Ordner**: views/countries

**URL**: http://localhost:3000/#/countries

**Referenz Tabellenname/URL-Actionname (refTable)**: countries

**View selector**: 'app-currencies'

**DB-Tabelle**: COUNTRIES

**Beschreibung**:

Die Ansicht besteht aus:
* **Links**: CustomTableComponent - Eine Tabelle mit Übersicht aller Länder.
* **Rechts**: CustomFormComponent - Die Detail-Ansicht als Formular mit Tabellenfeldern vom ausgewählten Land.

___

##### 3.9 ProvidersComponent - Provider:

**Ordner**: views/providers

**URL**: http://localhost:3000/#/providers

**Referenz Tabellenname/URL-Actionname (refTable)**: providers

**View selector**: 'app-providers'

**DB-Tabelle**: PROVIDERS

**Beschreibung**:

Die Ansicht besteht aus:
* **Links**: CustomTableComponent - Eine Tabelle mit Übersicht aller Provider.
* **Rechts**: CustomFormComponent - Die Detail-Ansicht als Formular mit Tabellenfeldern vom ausgewählten Provider.

___

##### 3.10 PaymentMethodsComponent - Bezahlarten:

**Ordner**: views/payment-methods

**URL**: http://localhost:3000/#/paymentMethods

**Referenz Tabellenname/URL-Actionname (refTable)**: paymentMethods

**View selector**: 'app-payment-methods'

**DB-Tabelle**: PAYMENT_METHODS

**Beschreibung**:

Die Ansicht besteht aus:
* **Links**: CustomTableComponent - Eine Tabelle mit Übersicht aller Bezahlarten.
* **Rechts**: CustomFormComponent - Die Detail-Ansicht als Formular mit Tabellenfeldern der ausgewählten Zahlungsart.

___

##### 3.11 PaymentTermsComponent - Zahlungsbedingungen:

**Ordner**: views/payment-terms

**URL**: http://localhost:3000/#/paymentTerms

**Referenz Tabellenname/URL-Actionname (refTable)**: paymentTerms

**View selector**: 'app-payment-terms'

**DB-Tabelle**: PAYMENT_TERMS

**Beschreibung**:

Die Ansicht besteht aus:
* **Links**: CustomTableComponent - Eine Tabelle mit Übersicht aller Zahlungsbedingungen.
* **Rechts**: CustomFormComponent - Die Detail-Ansicht als Formular mit Tabellenfeldern der ausgewählten Zahlungsbedingung.

___

##### 3.12 DetailViewCustomerComponent - Bestellungen/Lieferscheine/Rechnung/Kunden - B2C/Kunden - B2B:

**Ordner**: views/detail-view-customer

**URLs**:
* Bestellungen - http://localhost:3000/#/orders
* Lieferscheine - http://localhost:3000/#/deliveryNote
* Rechnung - http://localhost:3000/#/invoice
* Kunden B2C - http://localhost:3000/#/custbtwoc
* Kunden B2B - http://localhost:3000/#/custbtwob

**Referenz Tabellennamen/URL-Actionnamen (refTable)**:
* Bestellungen - orders
* Lieferscheine - deliveryNote
* Rechnung - invoice
* Kunden B2C - custbtwoc
* Kunden B2B - custbtwob

**View selector**: 'app-detail-view-customer'

**DB-Tabellen**:
* Bestellungen - ORDERS
* Lieferscheine - DELIVERY_NOTES
* Rechnung - INVOICES
* Kunden B2C & B2B - CUSTOMERS

**Beschreibung**:

Die Ansicht besteht aus:
* **Links**: CustomTableComponent - Eine Tabelle mit Übersicht aller Kunden (B2C/B2B)/Bestellungen/Lieferscheine/Rechnung.
* **Rechts**: DetailViewCustomerComponent - Die Detail Ansicht bestehend aus einem View-Element mit 2 Komponenten:
  Kunden:
  Kunden-Details:
  - CustomFormComponent - Die Detail-Ansicht als Formular mit Tabellenfeldern der oben ausgewählten Kunden.  
  Lieferadressen/Rechnungsadressen:
  - Oben: CustomTableComponent -  Eine Tabelle mit allen Kundenadressen, die die gleiche Kundenummer, wie der oben ausgewählte Eintrag, haben.
  - Unten: CustomFormComponent - Die Detail-Ansicht als Formular mit Tabellenfeldern der oben ausgewählten Kundenadresse.
  Bestellungen/Lieferscheine/Rechnungen:
  Bestellung:
  - CustomFormComponent - Die Detail-Ansicht als Formular mit Tabellenfeldern der ausgewählten Bestellung.  
  Bestellposition:
  - <p-table></p-table> - Die Tabelle mit allen Positionen der ausgewählten Bestellung.

___

### 4. CSV Import Dialog:

CSV-Import-Dialog kann über Menü "Öffnen > CSV-Import" geöffnet werden.

#### Voraussetzungen: Beim Import ist es wichtig, dass die Spaltennamen in der CSV-Datei genau so wie in der SOAS Tabelle "IMPORT_TEMPLATES" sind. Also gegeben falls angleichen.

#### Beispiel-CSV-Datei für Order Positions (ORDERS_POSITIONS):

```
ORDERS_NUMBER;ITMNUM;ORDER_QTY;ASSIGNED_QTY;PRICE_NET;CURRENCY;PRICE_BRU
50020AU000052;SW10098;2;0;55;2;0
50020AU000054;DOMINO1000000101DE;1;0;369;2;0
```

#### Updates:

Wenn man Daten nur aktualisieren möchte, so muss da drauf geachtet werden, dass sich in der Import-CSV-Datei nur die Felder aus der Spalte "UPDATE_FIELDS" ändern. Anderenfalls wird ein doppelter Eintrag eingefügt.
___

#### 4.1 CSV-Datei aus MSSQL-Query erstellen:

Beispiel: Preislisten Tabelle 'PRILISTS'. Dazu die Sage MSSQL Query für Preislisten Export als CSV Datei:

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

#### 4.2 Weitere Infos:

Wichtig ist, dass die Spaltennamen in der CSV-Datei genau so wie in der Tabelle IMPORT_TEMPLATES sind. Also gegebenenfalls angleichen.

Für 'PRILISTS' sind es (Die laufende ID wird automatisch erstellt): ITMNUM,PRICE_NET,PRICE_BRU,CURRENCY,PRILIST,CUSGRP

PRICE_NET und PRICE_BRU sollten am besten keine Komma-Zeichen enthalten (Die Kommas werden vom Importskript in Punkte umgewandelt!).
Leere PRICE_BRU Einträge werden im decimal Format als 0.0 importiert.

CURRENCY wird aus der SOAS-Tabelle CURRENCIES=>CURRENCY_ID bestimmt. Für 'EUR' ist es der Eintrag dann '1'.

Import von über 70000+ Einträgen ins SOAS per CSV-Import-Dialog dauert über 20 Minuten.
___

### 5. Batch Dialog:

Batch-Dialog kann übers Menü "Batch > Batchserver" geöffnet werden.

Die Dokumentation dazu kann unter docs > batch.md gefunden werden.


### 6. Run second instance of SOAS:

It can be helpful t run second instance of SOAS, for example for running script for import data from Sage.

So change port from 3000 to 4000 for example.

Change it on 3 places:

##### 6.1 SAOS > bin > www

```
var port = normalizePort(process.env.PORT || '4000');
```

##### 6.2 SOAS > client > src > app > _services > constant.service.ts

```
  readonly SERVER_URL: string = 'http://localhost:4000';
```

##### 6.3 SOAS > client > src > app > app.module.ts

```
JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4000'],
        blacklistedRoutes: ['localhost:4000/api/auth']
      }
    }),
```
