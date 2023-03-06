import {StatesInterface, StatesDataInterface} from "./interfaces/StatesInterface";

export class States implements StatesInterface {
    private _statesId: number;
    private _statesName: string;
    private _statesComment: string;
    private _statesActive: boolean;
    private _statesType: string;

    constructor(statesData: StatesDataInterface) {
        this._statesId = statesData.STATES_ID;
        this._statesName = statesData.STATES_NAME;
        this._statesComment = statesData.STATES_COMMENT;
        this._statesActive = statesData.STATES_ACTIVE;
        this._statesType = statesData.STATES_TYPE;
    }

    get statesData(): StatesDataInterface {
        return {
            STATES_ID: this._statesId,
            STATES_NAME: this._statesName,
            STATES_COMMENT: this._statesComment,
            STATES_ACTIVE: this._statesActive,
            STATES_TYPE: this._statesType
        }
    }

    get statesId(): number {
        return this._statesId;
    }

    set statesId(value: number) {
        this._statesId = value;
    }

    get statesName(): string {
        return this._statesName;
    }

    set statesName(value: string) {
        this._statesName = value;
    }

    get statesComment(): string {
        return this._statesComment;
    }

    set statesComment(value: string) {
        this._statesComment = value;
    }

    get statesActive(): boolean {
        return this._statesActive;
    }

    set statesActive(value: boolean) {
        this._statesActive = value;
    }

    get statesType(): string {
        return this._statesType;
    }

    set statesType(value: string) {
        this._statesType = value;
    }
}
