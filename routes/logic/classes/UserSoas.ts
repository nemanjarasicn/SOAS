import {UserSoasInterface, UserSoasDataInterface} from "./interfaces/UserSoasInterface";

export class UserSoas implements UserSoasInterface {
    private _userSoasName: string;
    private _userSoasLogin: string;
    private _userSoasPassword: string;
    private _userSoasRole: string;
    private _userSoasLanguage: string;

    constructor(userSoasData: UserSoasDataInterface) {
        this._userSoasName = userSoasData.USER_SOAS_ID;
        this._userSoasLanguage = userSoasData.USER_LANGUAGE;
        this._userSoasLogin = userSoasData.USER_SOAS_LOGIN;
        this._userSoasPassword = userSoasData.USER_SOAS_PASSWD;
        this._userSoasRole = userSoasData.USER_SOAS_ROLE;
    }

    get userSoasData(): UserSoasDataInterface {
        return {
            USER_SOAS_ID: this._userSoasName,
            USER_LANGUAGE: this._userSoasLanguage,
            USER_SOAS_LOGIN: this._userSoasLogin,
            USER_SOAS_PASSWD: this._userSoasPassword,
            USER_SOAS_ROLE: this._userSoasRole
        }

    }

    get userSoasName(): string {
        return this._userSoasName;
    }

    set userSoasName(value: string) {
        this._userSoasName = value;
    }

    get userSoasLogin(): string {
        return this._userSoasLogin;
    }

    set userSoasLogin(value: string) {
        this._userSoasLogin = value;
    }

    get userSoasPassword(): string {
        return this._userSoasPassword;
    }

    set userSoasPassword(value: string) {
        this._userSoasPassword = value;
    }

    get userSoasRole(): string {
        return this._userSoasRole;
    }

    set userSoasRole(value: string) {
        this._userSoasRole = value;
    }

    get userSoasLanguage(): string {
        return this._userSoasLanguage;
    }

    set userSoasLanguage(value: string) {
        this._userSoasLanguage = value;
    }
}
