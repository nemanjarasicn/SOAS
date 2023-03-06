import { OrderDataInterface } from "../classes/interfaces/OrderInterface";
import { SingleArticleJsonInterface } from "../classes/interfaces/ArticleInterface";
import { Order } from "../classes/Order";
import { Article } from "../classes/Article";
import { Customer } from "../classes/Customer";
import { CustomerDataInterface } from "../classes/interfaces/CustomerInterface";
import { Partner } from "../classes/Partner";
import { PartnerDataInterface } from "../classes/interfaces/PartnerInterface";
import { DistComponents } from "../classes/DistComponents";
import { DistComponentDataInterface } from "../classes/interfaces/DistComponentInterface";
import { Pricelist } from "../classes/Pricelist";
import { PriceListDataInterface } from "../classes/interfaces/PriceListInterface";
import { DeliveryNote } from "../classes/DeliveryNote";
import { DeliveryNoteDataInterface } from "../classes/interfaces/DeliveryNoteInterface";
import { Invoice } from "../classes/Invoice";
import { InvoiceDataInterface } from "../classes/interfaces/InvoiceInterface";
import { Provider } from "../classes/Provider";
import { ProviderDataInterface } from "../classes/interfaces/ProviderInterface";
import { ReCrediting } from "../classes/ReCrediting";
import { ReCreditingDataInterface } from "../classes/interfaces/ReCreditingInterface";
import { StockedIn } from "../classes/StockedIn";
import { StockedInDataInterface } from "../classes/interfaces/StockedInInterface";
import { WarehouseStock } from "../classes/WarehouseStock";
import { WarehouseStockDataInterface } from "../classes/interfaces/WarehouseStockInterface";
import { CustomerAddress } from "../classes/CustomerAddress";
import { CustomerAddressDataInterface } from "../classes/interfaces/CustomerAddressInterface";
import { States } from "../classes/States";
import { StatesDataInterface } from "../classes/interfaces/StatesInterface";
import { Currencies } from "../classes/Currencies";
import { CurrenciesDataInterface } from "../classes/interfaces/CurrenciesInterface";
import { TableLocksDataInterface } from "../classes/interfaces/TableLocksInterface";
import { TableLocks } from "../classes/TableLocks";
import { OrderPosition } from "../classes/OrderPosition";
import { OrderPositionDataInterface } from "../classes/interfaces/OrderPositionInterface";
import { DeliveryNotePositionDataInterface } from "../classes/interfaces/DeliveryNotePositionInterface";
import { DeliveryNotePosition } from "../classes/DeliveryNotePosition";
import { InvoicePositions } from "../classes/InvoicePositions";
import { InvoicePositionsDataInterface } from "../classes/interfaces/InvoicePositionsInterface";
import { LanguagesDataInterface } from "../classes/interfaces/LanguagesInterface";
import { Languages } from "../classes/Languages";
import { PaymentTermDataInterface } from "../classes/interfaces/PaymentTermInterface";
import { PaymentTerm } from "../classes/PaymentTerm";
import { Countries } from "../classes/Countries";
import { CountriesDataInterface } from "../classes/interfaces/CountriesInterface";
import { TaxationRelationsDataInterface } from "../classes/interfaces/TaxationRelationsInterface";
import { TaxationRelations } from "../classes/TaxationRelations";
import { WarehousingDataInterface } from "../classes/interfaces/WarehousingInterface";
import { Warehousing } from "../classes/Warehousing";
import { AttributeNames } from "../classes/AttributeNames";
import { AttributeNamesDataInterface } from "../classes/interfaces/AttributeNamesInterface";
import { AttributesDataInterface } from "../classes/interfaces/AttributesInterface";
import { Attributes } from "../classes/Attributes";
import { ProdComponents } from "../classes/ProdComponents";
import { ProdComponentsDataInterface } from "../classes/interfaces/ProdComponentsInterface";
import { ProdUnits } from "../classes/ProdUnits";
import { ProdUnitsDataInterface } from "../classes/interfaces/ProdUnitsInterface";
import { CrossSellingDataInterface } from "../classes/interfaces/CrossSellingInterface";
import { CrossSelling } from "../classes/CrossSelling";
import { CsvTemplateConfigs } from "../classes/CsvTemplateConfigs";
import { CsvTemplateConfigsDataInterface } from "../classes/interfaces/CsvTemplateConfigsInterfaces";
import { CsvTemplateConfigsField } from "../classes/CsvTemplateConfigField";
import { CsvTemplateConfigsFieldDataInterface } from "../classes/interfaces/CsvTemplateConfigFieldInterfaces";
import { ImportTypesDataInterface } from "../classes/interfaces/ImportTypesInterface";
import { ImportTypes } from "../classes/ImportTypes";
import { ImportTypesConstantsDataInterface } from "../classes/interfaces/importTypesConstantsInterface";
import { ImportTypesConstants } from "../classes/ImportTypesConstants";
import { ImportTypesRefTablesDataInterface } from "../classes/interfaces/ImportTypesRefTablesInterface";
import { ImportTypesRefTables } from "../classes/ImportTypesRefTables";
import { Companies } from "../classes/Companies";
import { CompaniesDataInterface } from "../classes/interfaces/CompaniesInterface";
import { Taxes } from "../classes/Taxes";
import { TaxesDataInterface } from "../classes/interfaces/TaxesInterface";
import { TaxesRate } from "../classes/TaxesRate";
import { TaxesRateDataInterface } from "../classes/interfaces/TaxesRateInterface";
import { SupplyOrders } from "../classes/SupplyOrders";
import { SupplyOrdersDataInterface } from "../classes/interfaces/SupplyOrdersInterface";
import { StoragePlaces } from "../classes/StoragePlaces";
import { StoragePlacesDataInterface } from "../classes/interfaces/StoragePlacesInterfaces";
import { SaleOffer } from "../classes/SaleOffer";
import { SaleOfferDataInterface } from "../classes/interfaces/SaleOfferInterface";
import {CompaniesLocationsDataInterface} from "../classes/interfaces/CompaniesLocationsInterface";
import {CompaniesLocations} from "../classes/CompaniesLocations";
import {SupplyOrdersPositionsDataInterface} from "../classes/interfaces/SupplyOrdersPositionsInterface";
import {SupplyOrdersPositions} from "../classes/SupplyOrdersPositions";

export class TableController {
  readonly tableId: string;
  readonly jsonData: any[] = [];
  readonly jsonTempData: any[] = [];

  private jsonResult: any[] = [];

  constructor(tableId: string, jsonData: any) {
    this.tableId = tableId;
    this.jsonData = jsonData[1];
    this.jsonResult.push(jsonData[0]);
  }

  public getCurrentTable(): any[] {
    console.log("TableController table: " + this.tableId);
    switch (this.tableId) {
      case "articles":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Article(<SingleArticleJsonInterface>this.jsonData[item])
              .articleData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "orders":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Order(<OrderDataInterface>this.jsonData[item]).orderData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "custbtwoc":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Customer(<CustomerDataInterface>this.jsonData[item])
              .customerData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "custbtwob":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Partner(<PartnerDataInterface>this.jsonData[item]).partnerData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "components":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new DistComponents(<DistComponentDataInterface>this.jsonData[item])
              .distComponentsData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "priceListSales":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Pricelist(<PriceListDataInterface>this.jsonData[item])
              .priceListData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "pricelistPurchase":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Pricelist(<PriceListDataInterface>this.jsonData[item])
              .priceListData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "deliveryNote":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new DeliveryNote(<DeliveryNoteDataInterface>this.jsonData[item])
              .deliveryNoteData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "invoice":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Invoice(<InvoiceDataInterface>this.jsonData[item]).invoiceData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "providers":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Provider(<ProviderDataInterface>this.jsonData[item])
              .providerData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "reCrediting":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new ReCrediting(<ReCreditingDataInterface>this.jsonData[item])
              .reCreditingData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "stockedIn":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new StockedIn(<StockedInDataInterface>this.jsonData[item])
              .stockedInData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      //ToDo: Check if WHLocation is still needed. Commented out, because of missing Class.
      // case('whlocation'):
      //     for (let item in this.jsonData) {
      //         this.jsonTempData.push((new WarehouseLocation(<WarehouseLocationDataInterface>this.jsonData[item])).warehouseLocationData);
      //     }
      //     this.jsonResult.push(this.jsonTempData);
      //     break;
      case "whstock":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new WarehouseStock(<WarehouseStockDataInterface>this.jsonData[item])
              .warehouseStockData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "customersAddrDlv":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new CustomerAddress(
              <CustomerAddressDataInterface>this.jsonData[item]
            ).customerAddressData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "customersAddrInv":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new CustomerAddress(
              <CustomerAddressDataInterface>this.jsonData[item]
            ).customerAddressData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "states":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new States(<StatesDataInterface>this.jsonData[item]).statesData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "currencies":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Currencies(<CurrenciesDataInterface>this.jsonData[item])
              .currenciesData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "tablelocks":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new TableLocks(<TableLocksDataInterface>this.jsonData[item])
              .tablelocksData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "orderPosition":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new OrderPosition(<OrderPositionDataInterface>this.jsonData[item])
              .orderPositionData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "deliveryNotePositions":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new DeliveryNotePosition(
              <DeliveryNotePositionDataInterface>this.jsonData[item]
            ).deliveryNotePositionData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "invoicePositions":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new InvoicePositions(
              <InvoicePositionsDataInterface>this.jsonData[item]
            ).invoicePositionsData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "languages":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Languages(<LanguagesDataInterface>this.jsonData[item])
              .languagesData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "paymentTerms":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new PaymentTerm(<PaymentTermDataInterface>this.jsonData[item])
              .paymentTermData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "countries":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Countries(<CountriesDataInterface>this.jsonData[item])
              .countriesData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "csvTemplateConfig":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new CsvTemplateConfigs(
              <CsvTemplateConfigsDataInterface>this.jsonData[item]
            ).CsvTemplateConfigsData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "csvTemplateConfigFieldTmp":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new CsvTemplateConfigsField(
              <CsvTemplateConfigsFieldDataInterface>this.jsonData[item]
            ).CsvTemplateConfigsFileData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "importTypes":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new ImportTypes(<ImportTypesDataInterface>this.jsonData[item])
              .importTypesData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "importTypeConstants":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new ImportTypesConstants(
              <ImportTypesConstantsDataInterface>this.jsonData[item]
            ).importTypesConstantsData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "importTypesRefTables":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new ImportTypesRefTables(
              <ImportTypesRefTablesDataInterface>this.jsonData[item]
            ).importTypesRefTablesData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "taxationRelations":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
              new TaxesRate(
                  <TaxesRateDataInterface>this.jsonData[item]
              ).TaxesRateData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "warehousing":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Warehousing(<WarehousingDataInterface>this.jsonData[item])
              .warehousingData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "warehousingDetails":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Warehousing(<WarehousingDataInterface>this.jsonData[item])
              .warehousingData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "attributeNames":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new AttributeNames(<AttributeNamesDataInterface>this.jsonData[item])
              .attributeNamesData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "attributes":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Attributes(<AttributesDataInterface>this.jsonData[item])
              .attributesData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "prodComponents":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new ProdComponents(<ProdComponentsDataInterface>this.jsonData[item])
              .prodComponentsData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "prodUnits":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new ProdUnits(<ProdUnitsDataInterface>this.jsonData[item])
              .prodUnitsData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "crossSelling":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new CrossSelling(<CrossSellingDataInterface>this.jsonData[item])
              .crossSellingFullData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "taxes":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Taxes(<TaxesDataInterface>this.jsonData[item]).TaxesData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "taxesRate": case "taxrates":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new TaxesRate(<TaxesRateDataInterface>this.jsonData[item])
              .TaxesRateData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "companies":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new Companies(<CompaniesDataInterface>this.jsonData[item])
              .CompaniesData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "companiesLocations":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new CompaniesLocations(<CompaniesLocationsDataInterface>this.jsonData[item])
              .CompaniesLocationsData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "supplyOrders":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new SupplyOrders(<SupplyOrdersDataInterface>this.jsonData[item])
              .supplyOrdersData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;


      case "saleOffers":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
            new SaleOffer(<SaleOfferDataInterface>this.jsonData[item])
              .saleOfferData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "supplyOrdersPosition":
        for (let item in this.jsonData) {
          this.jsonTempData.push(
              new SupplyOrdersPositions(<SupplyOrdersPositionsDataInterface>this.jsonData[item])
                  .supplyOrdersData
          );
        }
        this.jsonResult.push(this.jsonTempData);
        break;
      case "warehousingLoc":
          // @ToDo: Add a interface and class for StoragePlaces and set them here...
          for (let item in this.jsonData) {
            this.jsonTempData.push(
                new StoragePlaces(<StoragePlacesDataInterface>this.jsonData[item])
                    .StoragePlacesData
            );
          }
          this.jsonResult.push(this.jsonTempData);
          break;
      default:
        console.log(new Error('Provided tableId ' + this.tableId + ' was not found! ' +
            'Check servers class and interface of the table. '));
        break;
    }
    return this.jsonResult;
  }
}
