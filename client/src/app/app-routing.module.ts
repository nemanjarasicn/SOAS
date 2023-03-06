import { NgModule } from "@angular/core";
import { AuthGuard } from "./auth.guard";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./views/login/login.component";
import { HomeComponent } from "./views/home/home.component";
import { OrdersComponent } from "./views/orders/orders.component";
import { PageNotFoundComponent } from "./views/page-not-found/page-not-found.component";
import { LogoutComponent } from "./views/logout/logout.component";
import { CustbtwocComponent } from "./views/custbtwoc/custbtwoc.component";
import { ShowVersionInfoComponent } from "./dialogs/show-version-info/show-version-info.component";
import { InvoicesComponent } from "./views/invoices/invoices.component";
import { ArticlesComponent } from "./views/articles/articles.component";
import { ArticleComponentsComponent } from "./views/article-components/article-components.component";
import { DeliveryNotesComponent } from "./views/delivery-notes/delivery-notes.component";
import { PriceListSalesComponent } from "./views/price-list-sales/price-list-sales.component";
import { ProvidersComponent } from "./views/providers/providers.component";
import { CustbtwobComponent } from "./views/custbtwob/custbtwob.component";
import { UserManagementComponent } from "./dialogs/user-management/user-management.component";
import { NewWindowComponent } from "./views/new-window/new-window.component";
import { BatchProcessesComponent } from "./dialogs/batch-processes/batch-processes.component";
import { ImportCsvComponent } from "./views/import-csv/import-csv.component";
import { CurrenciesComponent } from "./views/currencies/currencies.component";
import { TableLocksDialogComponent } from "./dialogs/table-locks-dialog/table-locks-dialog.component";
import { PaymentTermsComponent } from "./views/payment-terms/payment-terms.component";
import { CountriesComponent } from "./views/countries/countries.component";
import { WarehousingComponent } from "./views/warehousing/warehousing.component";
import { StockTransferDialogSetupComponent } from "./dialogs/stock-transfer-dialog-setup/stock-transfer-dialog-setup.component";
import { AttributesComponent } from "./views/attributes/attributes.component";
import { ProductComponentsComponent } from "./views/product-components/product-components.component";
import { ProductUnitsComponent } from "./views/product-units/product-units.component";
import { CsvTemplateConfigComponent } from "./views/csv-template-config/csv-template-config.component";
import { ImportTypesComponent } from "./views/import-types/import-types.component";
import { ImportTypesRefTablesComponent } from "./views/import-types-ref-tables/import-types-ref-tables.component";
import { ImportTypesConstantsComponent } from "./views/import-types-constants/import-types-constants.component";
import { SupplyOrdersComponent } from "./views/supply-orders/supply-orders.component";
import { CompaniesComponent } from "./views/companies/companies.component";
import { TaxesComponent } from "./views/taxes/taxes.component";
import { LocalStorageDialogComponent } from "./dialogs/local-storage-dialog/local-storage-dialog.component";
import { StoragePlacesComponent }  from  "./views/storage-places/storage-places.component";
import { SaleOffersComponent }  from  "./views/sale-offers/sale-offers.component";
import { TestComponent } from "./views/test/test.component";

const routes: Routes = [
  // Site routes goes here
  // { path: '', pathMatch: 'full', redirectTo: 'index' },
  // { path: '', pathMatch: 'full', redirectTo: 'login'},
  // { path: 'app', component: AppComponent, canActivate: [AuthGuard] },   // , outlet: "loggedin"
  { path: "",
    component: LoginComponent,
    outlet: "notloggedin",
    children: []
  },
  {
    path: "logout",
    component: LogoutComponent,
    canActivate: [AuthGuard]
    // , outlet: "loggedin"
  },
  { path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard]
  }, // , outlet: "loggedin"
  { path: "orders",
    component: OrdersComponent,
    canActivate: [AuthGuard]
  }, // , outlet: "loggedin"
  {
    path: "custbtwoc",
    component: CustbtwocComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "custbtwob",
    component: CustbtwobComponent,
    canActivate: [AuthGuard],
  },
  { path: "invoice",
    component: InvoicesComponent,
    canActivate: [AuthGuard]
  },
  { path: "articles",
    component: ArticlesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "components",
    component: ArticleComponentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "deliveryNote",
    component: DeliveryNotesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "priceListSales",
    component: PriceListSalesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "providers",
    component: ProvidersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "info",
    component: ShowVersionInfoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "currencies",
    component: CurrenciesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "paymentTerms",
    component: PaymentTermsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "countries",
    component: CountriesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "warehousing",
    component: WarehousingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "dialogStockTransfer",
    component: StockTransferDialogSetupComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "attributeNames",
    component: AttributesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "prodComponents",
    component: ProductComponentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "prodUnits",
    component: ProductUnitsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "csvTemplateConfig",
    component: CsvTemplateConfigComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "importTypes",
    component: ImportTypesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "importTypesRefTables",
    component: ImportTypesRefTablesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "importTypeConstants",
    component: ImportTypesConstantsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "supplyOrders",
    component: SupplyOrdersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "showNewWindow",
    component: NewWindowComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "batchserver_config",
    component: BatchProcessesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "remove_tablelocks",
    component: TableLocksDialogComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "batchserver_config",
    component: BatchProcessesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "remove_tablelocks",
    component: TableLocksDialogComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "empty-local-storage",
    component: LocalStorageDialogComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "user_management",
    component: UserManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "csv_import",
    component: ImportCsvComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "companies",
    component: CompaniesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "taxes",
    component: TaxesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "warehousingLoc",
    component: StoragePlacesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "saleOffers",
    component: SaleOffersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "test",
    component: TestComponent,
    canActivate: [AuthGuard],
  },

  // otherwise redirect to home
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "reload",
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
