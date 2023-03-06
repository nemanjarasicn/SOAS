import {Component, ViewChild} from '@angular/core';
import {CustomTableFormViewComponent} from '../custom/custom-views/custom-table-form-view/custom-table-form-view.component';
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";

@Component({
  selector: 'app-payment-terms',
  templateUrl: './payment-terms.component.html',
  styleUrls: ['./payment-terms.component.css']
})

/**
 * PaymentTermsComponent - payment terms view component with a CustomTableFormViewComponent: table (on left) and form (on right)
 *
 * table:    [PAYMENT_TERMS]
 * refTable: paymentTerms
 */
export class PaymentTermsComponent  {

  // custom table form view component
  @ViewChild(CustomTableFormViewComponent) customComponent !: CustomTableFormViewComponent;

  constructor() {}

  title = 'PAYMENT_TERMS'
  fetchTableConfig: IFetchTableConfig = {
    refTable: 'paymentTerms',
    pk: 'PAYMENT_TERM_ID',
  }
}

