import {CompaniesInterface, CompaniesDataInterface} from "./interfaces/CompaniesInterface";

export class Companies implements CompaniesInterface {
    private _company: number;
    private _description: string;
    private _active: number;
    private _intercompany: number;
    private _intercompany_connection: number;

    constructor(CompaniesData: CompaniesDataInterface) {
        this._company = CompaniesData.COMPANY;
        this._description = CompaniesData.DESCRIPTION;
        this._active = CompaniesData.ACTIVE;
        this._intercompany = CompaniesData.INTERCOMPANY;
        this._intercompany_connection = CompaniesData.INTERCOMPANY_CONNECTION;
    }

    get CompaniesData(): CompaniesDataInterface {
        return {
            COMPANY: this._company,
            DESCRIPTION: this._description,
            ACTIVE: this._active,
            INTERCOMPANY: this._intercompany,
            INTERCOMPANY_CONNECTION: this._intercompany_connection,
        }
    }

    get company(): number {
        return this._company;
    }

    set company(value: number) {
        this._company = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get active(): number {
        return this._active;
    }

    set active(value: number) {
        this._active = value;
    }

    get intercompany(): number {
        return this._intercompany;
    }

    set intercompany(value: number) {
        this._intercompany = value;
    }


    get intercompany_connection(): number {
        return this._intercompany_connection;
    }

    set intercompany_connection(value: number) {
        this._intercompany_connection = value;
    }
}
