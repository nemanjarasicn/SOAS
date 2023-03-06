import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule} from '@angular/core';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularMaterialModule } from "./angular-material.module";

/* FormsModule */
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from "@angular/forms";

/* Angular Flex Layout */
import { FlexLayoutModule } from "@angular/flex-layout";

import { HomeComponent } from "./views/home/home.component";
import { LoginComponent } from "./views/login/login.component";
import { SiteHeaderComponent } from "./_layout/site-header/site-header.component";
import { SiteFooterComponent } from "./_layout/site-footer/site-footer.component";
import { SiteLayoutComponent } from "./_layout/site-layout/site-layout.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from "@angular/material/form-field";

import { JwtModule } from "@auth0/angular-jwt";

import { AuthService } from "./_services/auth.service";
import { AuthGuard } from "./auth.guard";
import { OrdersComponent } from "./views/orders/orders.component";

import { APP_BASE_HREF } from "@angular/common";
import { PageNotFoundComponent } from "./views/page-not-found/page-not-found.component";
import {
  _MatMenuDirectivesModule,
  MatMenuModule,
} from "@angular/material/menu";
import { MenuItemComponent } from "./menu-item/menu-item.component";
import { MatExpansionModule } from "@angular/material/expansion";

import { PortalModule } from "@angular/cdk/portal";
import { LogoutComponent } from "./views/logout/logout.component";
import { MatTreeModule } from "@angular/material/tree";
import { CustbtwocComponent } from './views/custbtwoc/custbtwoc.component';
/* Dialog Module */
import { MatDialogModule } from "@angular/material/dialog";
import { InfoDialogComponent } from "./dialogs/info-dialog/info-dialog.component";
import { ShowVersionInfoComponent } from "./dialogs/show-version-info/show-version-info.component";
import { InvoicesComponent } from "./views/invoices/invoices.component";
import { ArticlesComponent } from "./views/articles/articles.component";
import { ArticleComponentsComponent } from "./views/article-components/article-components.component";
import { DeliveryNotesComponent } from "./views/delivery-notes/delivery-notes.component";
import { PriceListSalesComponent } from "./views/price-list-sales/price-list-sales.component";
// import { PriceListPurchaseComponent } from "./views/price-list-purchase/price-list-purchase.component";
import { ProvidersComponent } from "./views/providers/providers.component";
// import { ReCreditingComponent } from "./views/re-crediting/re-crediting.component";
import { CustbtwobComponent } from "./views/custbtwob/custbtwob.component";
// import { StockedInComponent } from "./views/stocked-in/stocked-in.component";
import { UserManagementComponent } from "./dialogs/user-management/user-management.component";
import { TableDialogComponent } from "./dialogs/table-dialog/table-dialog.component";
import { ConfirmationDialogComponent } from "./dialogs/confirmation-dialog/confirmation-dialog.component";
import { UserDialogComponent } from "./dialogs/user-dialog/user-dialog.component";
import { NewWindowComponent } from "./views/new-window/new-window.component";
import { BatchProcessesComponent } from "./dialogs/batch-processes/batch-processes.component";
import { BatchDialogComponent } from "./dialogs/batch-dialog/batch-dialog.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import {
  DayOfMonthsValidator,
  DaysValidator,
  HoursValidator,
  MinutesValidator,
  MonthsValidator,
} from "./shared/validator-directives";
import { CsvImportDialogComponent } from './dialogs/csv-import-dialog/csv-import-dialog.component';
import { FileUploadDialogComponent } from './dialogs/file-upload-dialog/file-upload-dialog.component';
import {RxReactiveFormsModule} from "@rxweb/reactive-form-validators";
import {MatTabsModule} from "@angular/material/tabs";
import {ConstantsService} from "./_services/constants.service";
import {DynamicFormComponent} from "./dynamic-view/dynamic-form/dynamic-form.component";
// import {ButtonComponent} from "./dynamic-view/button/button.component";
// import {InputComponent} from "./dynamic-view/input/input.component";
// import {SelectComponent} from "./dynamic-view/select/select.component";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
// import {DynamicFieldDirective} from "./dynamic-view/dynamic-field/dynamic-field.directive";
import { DetailViewTabGroupComponent } from './views/detail-view-tab-group/detail-view-tab-group.component';
// import { CheckboxComponent } from './dynamic-view/checkbox/checkbox.component';
// import { TextareaComponent } from './dynamic-view/textarea/textarea.component';
import { DetailViewListComponent } from './views/detail-view-list/detail-view-list.component';
// import { HiddenComponent } from './dynamic-view/hidden/hidden.component';
import { CurrenciesComponent } from './views/currencies/currencies.component';
import { TableLocksDialogComponent } from './dialogs/table-locks-dialog/table-locks-dialog.component';
import { PaymentTermsComponent } from './views/payment-terms/payment-terms.component';
import { CountriesComponent } from './views/countries/countries.component';
import {EditableComponent} from "./dynamic-view/editable/editable.component";
import {ViewModeDirective} from "./dynamic-view/editable/view-mode.directive";
import {EditModeDirective} from "./dynamic-view/editable/edit-mode.directive";
import {EditableOnEnterDirective} from "./dynamic-view/editable/edit-on-enter.directive";
import {FocusableDirective} from "./focusable.directive";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {MessageModule} from "primeng/message";
import {MessagesModule} from "primeng/messages";
import {PanelModule} from "primeng/panel";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {TooltipModule} from "primeng/tooltip";
// import {SearchComponent} from "./dynamic-view/search/search.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {CustomTableComponent} from "./views/custom/custom-table/custom-table.component";
import { CustomFormComponent } from './views/custom/custom-form/custom-form.component';
import { CustomPDialogComponent } from './views/custom/custom-p-dialog/custom-p-dialog.component';
import { WarehousingComponent } from './views/warehousing/warehousing.component';
import { StockTransferDialogComponent } from './dialogs/stock-transfer-dialog/stock-transfer-dialog.component';
import { StockTransferDialogSetupComponent } from './dialogs/stock-transfer-dialog-setup/stock-transfer-dialog-setup.component';
// import { PautocompleteComponent } from './dynamic-view/pautocomplete/pautocomplete.component';
// import { CustomTwoColumnsFormComponent } from './views/custom/custom-two-columns-form/custom-two-columns-form.component';
// import { DynamicTwoColumnsFormComponent } from './dynamic-view/dynamic-two-columns-form/dynamic-two-columns-form.component';
import { AttributePDialogComponent } from './views/articles/attribute-p-dialog/attribute-p-dialog.component';
import { AttributesComponent } from './views/attributes/attributes.component';
import { ProductComponentsComponent } from './views/product-components/product-components.component';
import { ProductUnitsComponent } from './views/product-units/product-units.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FormlyFieldConfig, FormlyModule} from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import {FormlyMatNativeSelectModule} from "@ngx-formly/material/native-select";
import {DatepickerTypeComponent} from "./dynamic-view/formly/datepicker-type.component";
import {AutocompleteTypeComponent} from "./dynamic-view/formly/autocomplete-type.component";
import {InputTextareaModule} from "primeng/inputtextarea";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "./shared/shared.module";
import { CsvTemplateConfigComponent } from './views/csv-template-config/csv-template-config.component';
import { ImportCsvComponent } from "./views/import-csv/import-csv.component";
import { ImportTypesComponent } from "./views/import-types/import-types.component";
import { ImportTypesRefTablesComponent } from "./views/import-types-ref-tables/import-types-ref-tables.component";
import { ImportTypesConstantsComponent } from "./views/import-types-constants/import-types-constants.component";
import { DetailViewCsvTemplateConfigComponent } from "./views/detail-view-csv-template-config/detail-view-csv-template-config.component";
import { CompaniesComponent } from './views/companies/companies.component';
// import { DetailViewCompaniesComponent } from './views/detail-view-companies/detail-view-companies.component';
import {CustomPTableComponent} from './views/custom/custom-p-table/custom-p-table.component';
import { TaxesComponent } from './views/taxes/taxes.component';
import { LocalStorageDialogComponent } from './dialogs/local-storage-dialog/local-storage-dialog.component';
import { CustomTableFormViewComponent } from './views/custom/custom-views/custom-table-form-view/custom-table-form-view.component';
import { CustomTableTableFormViewComponent } from './views/custom/custom-views/custom-table-table-form-view/custom-table-table-form-view.component';
import { SupplyOrdersComponent } from './views/supply-orders/supply-orders.component';
import {CustomTableTabGroupViewComponent} from "./views/custom/custom-views/custom-table-tab-group-view/custom-table-tab-group-view.component";
import { StoragePlacesComponent } from './views/storage-places/storage-places.component';
import { SaleOffersComponent } from './views/sale-offers/sale-offers.component';

import { DetailViewListDialogComponent } from './views/detail-view-list/detail-view-list-dialog/detail-view-list-dialog.component';
import { MainTableComponent } from './dynamic-view/main-table/main-table.component';
import {DynamicFormService} from "./_services/dynamic-form.service";
import {DynamicTableComponent} from "./dynamic-view/dynamic-table/dynamic-table.component";
import {DynamicTableService} from "./_services/dynamic-table.service";
import { DynamicFormDialogComponent } from './dialogs/dynamic-form-dialog/dynamic-form-dialog.component';
import { DynamicDetailListDialogComponent } from './dialogs/dynamic-detail-list-dialog/dynamic-detail-list-dialog.component';
import { DynamicPTableComponent } from './dynamic-view/dynamic-p-table/dynamic-p-table.component';
import {GlobalErrorHandler} from './global-error-handler';
import {ServerSuccessInterceptor} from './server-success.interceptor';
import {TranslateItPipe} from './shared/pipes/translate-it.pipe';
import {ErrorDialogComponent} from './dialogs/error-dialog/error-dialog.component';
import {HttpLoadingInterceptor} from "./http-loading.interceptor";
import {TestComponent} from "./views/test/test.component";

// import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
// import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
//import {CheckboxComponent} from "./checkbox/checkbox.component";

export function tokenGetter() {
  let CONSTANTS = new ConstantsService();
  return localStorage.getItem(CONSTANTS.LS_ACCESS_TOKEN);
}

export function dateFutureValidator(
  control: FormControl,
  field: FormlyFieldConfig,
  options = {}
): ValidationErrors {
  return {
    'date-future': { message: `Validator options: ${JSON.stringify(options)}` },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    SiteLayoutComponent,
    OrdersComponent,
    PageNotFoundComponent,
    MenuItemComponent,
    LogoutComponent,
    CustbtwocComponent,
    InfoDialogComponent,
    ShowVersionInfoComponent,
    InvoicesComponent,
    ArticlesComponent,
    ArticleComponentsComponent,
    DeliveryNotesComponent,
    PriceListSalesComponent,
    // PriceListPurchaseComponent,
    ProvidersComponent,
    // ReCreditingComponent,
    CustbtwobComponent,
    // StockedInComponent,
    UserManagementComponent,
    TableDialogComponent,
    ConfirmationDialogComponent,
    UserDialogComponent,
    NewWindowComponent,
    BatchProcessesComponent,
    BatchDialogComponent,
    MonthsValidator,
    DayOfMonthsValidator,
    DaysValidator,
    HoursValidator,
    MinutesValidator,
    CsvImportDialogComponent,
    FileUploadDialogComponent,
    // DynamicFieldDirective,
    DynamicFormComponent,
    // ButtonComponent,
    // InputComponent,
    // SelectComponent,
    DetailViewTabGroupComponent,
    // CheckboxComponent,
    // TextareaComponent,
    DetailViewListComponent,
    // HiddenComponent,
    CurrenciesComponent,
    TableLocksDialogComponent,
    PaymentTermsComponent,
    CountriesComponent,
    EditableComponent,
    ViewModeDirective,
    EditModeDirective,
    EditableOnEnterDirective,
    FocusableDirective,
    // SearchComponent,
    CustomTableComponent,
    CustomFormComponent,
    CustomPDialogComponent,
    WarehousingComponent,
    StockTransferDialogComponent,
    StockTransferDialogSetupComponent,
    // PautocompleteComponent,
    // CustomTwoColumnsFormComponent,
    // DynamicTwoColumnsFormComponent,
    AttributePDialogComponent,
    AttributesComponent,
    ProductComponentsComponent,
    ProductUnitsComponent,
    DatepickerTypeComponent,
    AutocompleteTypeComponent,
    CsvTemplateConfigComponent,
    DetailViewCsvTemplateConfigComponent,
    ImportCsvComponent,
    ImportTypesComponent,
    ImportTypesRefTablesComponent,
    ImportTypesConstantsComponent,
    CompaniesComponent,
    // DetailViewCompaniesComponent,
    CustomPTableComponent,
    TaxesComponent,
    LocalStorageDialogComponent,
    CustomTableFormViewComponent,
    CustomTableTableFormViewComponent,
    CustomTableTabGroupViewComponent,
    SupplyOrdersComponent,
    StoragePlacesComponent,
    SaleOffersComponent,
    DetailViewListDialogComponent,
    MainTableComponent,
    DynamicTableComponent,
    DynamicFormDialogComponent,
    DynamicDetailListDialogComponent,
    DynamicPTableComponent,
    ErrorDialogComponent,
    // TranslateItPipe,
    // BooleanToMatIconPipe,
    // CurrencySpacePipe,
    // CheckboxComponent
    TestComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    // Add this import here
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [
          'localhost:3000',
          '192.168.77.57:3000',
          '192.168.77.121:3000',
        ],
        disallowedRoutes: [
          'localhost:3000/api/auth',
          '192.168.77.57:3000/api/auth',
          '192.168.77.121:3000/api/auth',
        ],
      },
    }),
    AppRoutingModule,
    _MatMenuDirectivesModule,
    MatMenuModule,
    MatExpansionModule,
    PortalModule,
    MatTreeModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    RxReactiveFormsModule,
    MatTabsModule,
    TableModule,
    DropdownModule,
    MessageModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    ConfirmDialogModule,
    InputNumberModule,
    InputTextModule,
    TooltipModule,
    AutoCompleteModule,
    MessagesModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    PanelModule,
    CheckboxModule,
    MatButtonToggleModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'datepicker',
          component: DatepickerTypeComponent,
          wrappers: ['form-field'],
          defaultOptions: {
            defaultValue: new Date(),
            templateOptions: {
              datepickerOptions: {},
            },
          },
        },
        {
          name: 'formly-autocomplete-type',
          component: AutocompleteTypeComponent,
          wrappers: ['form-field'],
        },
      ],
      extras: { lazyRender: true },
      validators: [
        {
          name: 'date-future',
          validation: dateFutureValidator,
          options: { days: 2 },
        },
      ],
      validationMessages: [
        { name: 'required', message: 'Dieses Feld ist erforderlich' },
      ],
    }),
    ReactiveFormsModule,
    FormlyMatNativeSelectModule,
    FormlyMaterialModule,
    // FormlyPrimeNGModule,
    // FormlyBootstrapModule,
    FormlyModule.forRoot({ extras: { lazyRender: true } }),
    InputTextareaModule,
    RippleModule,
    SharedModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    ConstantsService,
    ConfirmationService,
    MessageService,
    DynamicFormService,
    DynamicTableService,
    // TranslateItPipe,
    {provide: APP_BASE_HREF, useValue: '/'},
    // appearance - MatFormFieldAppearance from /client/node_modules/@angular/material/form-field/form-field.d.ts
    // floatLabel: 'always' - added because of NG0100 error at DetailViewTabGroupFormService > setValuesByCustomerNumber
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill', floatLabel: 'always'}},
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: ServerSuccessInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: HttpLoadingInterceptor, multi: true},
    {provide: TranslateItPipe, useClass: TranslateItPipe}
  ],
  bootstrap: [AppComponent],
  entryComponents:
    [
      InfoDialogComponent,
      TableDialogComponent,
      ConfirmationDialogComponent,
      UserDialogComponent,
      BatchDialogComponent,
      FileUploadDialogComponent,
      // ButtonComponent,
      // InputComponent,
      // SelectComponent,
      DynamicFormComponent,
      // DynamicTwoColumnsFormComponent,
      // CustomTwoColumnsFormComponent,
      // TextareaComponent,
      // CheckboxComponent,
      // HiddenComponent,
      // SearchComponent,
      // PautocompleteComponent,
      StockTransferDialogComponent
    ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
