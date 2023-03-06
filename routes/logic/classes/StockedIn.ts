import {StockedInDataInterface, StockedInInterface} from "./interfaces/StockedInInterface";

export class StockedIn implements StockedInInterface {
    private _articleNummer: string;
    private _warehouse: string;
    private _stockedIn: string;
    private _purchaseNumber: string;

    constructor(stockedInData: StockedInDataInterface) {
        this._articleNummer = stockedInData.ITMNUM;
        this._warehouse = stockedInData.WAREHOUSE;
        this._stockedIn = stockedInData.STOCKED_IN;
        this._purchaseNumber = stockedInData.PURCHASE_NUMBER
    }

    get stockedInData(): StockedInDataInterface {
        return {
            ITMNUM: this._articleNummer,
            WAREHOUSE: this._warehouse,
            STOCKED_IN: this._stockedIn,
            PURCHASE_NUMBER: this._purchaseNumber
        }
    }

    get articleNummer(): string {
        return this._articleNummer;
    }

    set articleNummer(value: string) {
        this._articleNummer = value;
    }

    get warehouse(): string {
        return this._warehouse;
    }

    set warehouse(value: string) {
        this._warehouse = value;
    }

    get stockedIn(): string {
        return this._stockedIn;
    }

    set stockedIn(value: string) {
        this._stockedIn = value;
    }

    get purchaseNumber(): string {
        return this._purchaseNumber;
    }

    set purchaseNumber(value: string) {
        this._purchaseNumber = value;
    }
}
