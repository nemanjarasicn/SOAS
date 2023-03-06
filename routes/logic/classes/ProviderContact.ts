import {ProviderContactInterface, ProviderContactDataInterface} from "./interfaces/ProviderContactInterface";

export class ProviderContact implements ProviderContactInterface {
    private _providerName: string;
    private _providerContactName: string;
    private _providerContactTitle: string;
    private _providerContactEmail: string;
    private _providerContactTelefon: string;
    private _providerContactPosition: string;

    constructor(providerContactData: ProviderContactDataInterface) {
        this._providerName = providerContactData.PROVIDERS_NAME;
        this._providerContactName = providerContactData.PROVIDERS_CONTACT_NAME;
        this._providerContactTitle = providerContactData.PROVIDERS_CONTACT_TITLE;
        this._providerContactEmail = providerContactData.PROVIDERS_CONTACT_EMAIL;
        this._providerContactTelefon = providerContactData.PROVIDERS_CONTACT_TELEFON;
        this._providerContactPosition = providerContactData.PROVIDERS_CONTACT_POSITION;
    }

    get porviderContactData(): ProviderContactDataInterface {
        return {
            PROVIDERS_NAME: this._providerName,
            PROVIDERS_CONTACT_NAME: this._providerContactName,
            PROVIDERS_CONTACT_TITLE: this._providerContactTitle,
            PROVIDERS_CONTACT_EMAIL: this._providerContactEmail,
            PROVIDERS_CONTACT_TELEFON: this._providerContactTelefon,
            PROVIDERS_CONTACT_POSITION: this._providerContactPosition
        }
    }

    get providerName(): string {
        return this._providerName;
    }

    set providerName(value: string) {
        this._providerName = value;
    }

    get providerContactName(): string {
        return this._providerContactName;
    }

    set providerContactName(value: string) {
        this._providerContactName = value;
    }

    get providerContactTitle(): string {
        return this._providerContactTitle;
    }

    set providerContactTitle(value: string) {
        this._providerContactTitle = value;
    }

    get providerContactEmail(): string {
        return this._providerContactEmail;
    }

    set providerContactEmail(value: string) {
        this._providerContactEmail = value;
    }

    get providerContactTelefon(): string {
        return this._providerContactTelefon;
    }

    set providerContactTelefon(value: string) {
        this._providerContactTelefon = value;
    }

    get providerContactPosition(): string {
        return this._providerContactPosition;
    }

    set providerContactPosition(value: string) {
        this._providerContactPosition = value;
    }
}
