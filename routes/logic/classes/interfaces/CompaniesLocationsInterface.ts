export interface CompaniesLocationsInterface {
    company : number;
    location : string;
    description : string;
    is_sales_location: number;
    is_warehouse_location: number;
    street : string;
    postcode : string;
    city : string;
    country_iso_code : string;

    
}

export interface CompaniesLocationsDataInterface {
    COMPANY: number;
    LOCATION: string;
    DESCRIPTION: string;
    IS_SALES_LOCATION: number;
    IS_WAREHOUSE_LOCATION: number;
    STREET:string;
    POSTCODE:string;
    CITY:string;
    COUNTRY_ISO_CODE:string;
}
