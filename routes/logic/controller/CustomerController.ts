import {Customer} from "../classes/Customer";
import {CustomerDataInterface} from "../classes/interfaces/CustomerInterface";

export class CustomerController extends Customer {

    private jsonData: object;

    constructor(singleCustomerJson: CustomerDataInterface) {
        super(singleCustomerJson);
        this.jsonData = singleCustomerJson;
    }

    public get customerJson(): object {
        return this.jsonData;
    }

    public set customerJSON(jsonObject: object) {
        this.jsonData = jsonObject;
    }
}
