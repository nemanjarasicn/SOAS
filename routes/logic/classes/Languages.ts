import {LanguagesInterface, LanguagesDataInterface} from "./interfaces/LanguagesInterface";

export class Languages implements LanguagesInterface {
    private _languagesCode: string;
    private _languagesName: string;
    private _languagesIsoAlpha2: string;
    private _languagesIsoAlpha3: string;

    constructor(languagesData: LanguagesDataInterface) {
        this._languagesCode = languagesData.LANGUAGE_CODE;
        this._languagesName = languagesData.LANGUAGE_NAME;
        this._languagesIsoAlpha2 = languagesData.LANGUAGE_ISO_ALPHA_2;
        this._languagesIsoAlpha3 = languagesData.LANGUAGE_ISO_ALPHA_3;
    }

    get languagesData(): LanguagesDataInterface {
        return {
            LANGUAGE_CODE: this._languagesCode,
            LANGUAGE_NAME: this._languagesName,
            LANGUAGE_ISO_ALPHA_2: this._languagesIsoAlpha2,
            LANGUAGE_ISO_ALPHA_3: this._languagesIsoAlpha3
        }
    }

    get languagesCode(): string {
        return this._languagesCode;
    }

    set languagesCode(value: string) {
        this._languagesCode = value;
    }

    get languagesName(): string {
        return this._languagesName;
    }

    set languagesName(value: string) {
        this._languagesName = value;
    }

    get languagesIsoAlpha2(): string {
        return this._languagesIsoAlpha2;
    }

    set languagesIsoAlpha2(value: string) {
        this._languagesIsoAlpha2 = value;
    }

    get languagesIsoAlpha3(): string {
        return this._languagesIsoAlpha3;
    }

    set languagesIsoAlpha3(value: string) {
        this._languagesIsoAlpha3 = value;
    }
}
