import {CompaniesLocationsDataInterface, CompaniesLocationsInterface} from "./interfaces/CompaniesLocationsInterface";

export class CompaniesLocations implements CompaniesLocationsInterface {
    private _company: number;
    private _location: string;
    private _description: string;
    private _is_sales_location: number;
    private _is_warehouse_location: number;
    private _street: string;
    private _postcode: string;
    private _city: string;
    private _country_iso_code: string;


    constructor(CompaniesLocationsData: CompaniesLocationsDataInterface) {
        this._company = CompaniesLocationsData.COMPANY;
        this._location = CompaniesLocationsData.LOCATION;
        this._description = CompaniesLocationsData.DESCRIPTION;
        this._is_sales_location = CompaniesLocationsData.IS_SALES_LOCATION;
        this._is_warehouse_location = CompaniesLocationsData.IS_WAREHOUSE_LOCATION;
        this._street=CompaniesLocationsData.STREET;
        this._postcode=CompaniesLocationsData.POSTCODE;
        this._city=CompaniesLocationsData.CITY;
        this._country_iso_code=CompaniesLocationsData.COUNTRY_ISO_CODE;
    }

    get CompaniesLocationsData(): CompaniesLocationsDataInterface {
        return {
            COMPANY: this._company,
            LOCATION: this._location,
            DESCRIPTION: this._description,
            IS_SALES_LOCATION: this._is_sales_location,
            IS_WAREHOUSE_LOCATION: this._is_warehouse_location,
            STREET:this._street,
            POSTCODE:this._postcode,
            CITY:this._city,
            COUNTRY_ISO_CODE:this._country_iso_code
        }
    }

    get company(): number {
        return this._company;
    }

    set company(value: number) {
        this._company = value;
    }

    get location(): string {
        return this._location;
    }

    set location(value: string) {
        this._location = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get is_sales_location(): number {
        return this._is_sales_location;
    }

    set is_sales_location(value: number) {
        this._is_sales_location = value;
    }

    get is_warehouse_location(): number {
        return this._is_warehouse_location;
    }

    set is_warehouse_location(value: number) {
        this._is_warehouse_location = value;
    }

    get street(): string {
        return this._street;
    }

    set street(value: string) {
        this._street = value;
    }

    get postcode(): string {
        return this._postcode;
    }

    set postcode(value: string) {
        this._postcode = value;
    }

    get city(): string {
        return this._city;
    }

    set city(value: string) {
        this._city = value;
    }

    get country_iso_code(): string {
        return this._country_iso_code;
    }

    set country_iso_code(value: string) {
        this._country_iso_code = value;
    }
}
