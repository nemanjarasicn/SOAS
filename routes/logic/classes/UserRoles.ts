import {UserRolesInterface, UserRolesDataInterface} from "./interfaces/UserRolesInterface";

export class UserRoles implements UserRolesInterface {
    private _roleName: string;
    private _roleDescription: string;

    constructor(userRoleData: UserRolesDataInterface) {
        this._roleName = userRoleData.ROLE_NAME;
        this._roleDescription = userRoleData.ROLE_DESCRIPTION
    }

    get userRoleData(): UserRolesDataInterface {
        return {
            ROLE_NAME: this._roleName,
            ROLE_DESCRIPTION: this._roleDescription
        }

    }

    get roleName(): string {
        return this._roleName;
    }

    set roleName(value: string) {
        this._roleName = value;
    }

    get roleDescription(): string {
        return this._roleDescription;
    }

    set roleDescription(value: string) {
        this._roleDescription = value;
    }
}
