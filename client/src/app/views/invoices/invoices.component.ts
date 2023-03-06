import {Component} from '@angular/core';
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})

/**
 * InvoicesComponent: invoices view component with a CustomTableTabGroupViewComponent:
 * table (on left) and tab-group (on right)
 *
 * table:    [INVOICES]
 * refTable: invoice
 */
export class InvoicesComponent{
  title = 'INVOICES'
  fetchTableConfig: IFetchTableConfig = {
    pk: "INVOICES_NUMBER",
    refTable: 'invoice',
    subtitle: 'Details',
    additionalSearch: 'INVOICES_CUSTOMER,DELIVERY_NOTES_NUMBER,ORDERS_NUMBER',

    insertTogether: [
      {
        pk: 'ID',
        refTable: 'invoicePositions',
        subtitle: 'Positions',
        referenceColumn: 'INVOICES_NUMBER',
      },
    ], // Invoice Positions

    viewEditTabs: [
      {
        pk: 'DELIVERY_NOTES_NUMBER',
        referenceColumn: 'DELIVERY_NOTES_NUMBER',
        refTable: 'deliveryNote',
        tabTitle: 'DELIVERY_NOTES',
        subtitle: 'Details',
        showTogether: [
          {
            refTable: 'deliveryNotePositions',
            referenceColumn: 'DELIVERY_NOTES_NUMBER',
            subTubTitle: 'DELIVERY_NOTES_POSITIONS',
          }
        ]
      },
      {
        pk: 'ORDERS_NUMBER',
        referenceColumn: 'ORDERS_NUMBER',
        refTable: 'orders',
        tabTitle: 'ORDERS',
        subtitle: 'Details',
        showTogether: [
          {
            refTable: 'orderPosition',
            referenceColumn: 'ORDERS_NUMBER',
            subTubTitle: 'ORDER_POSITIONS',
          }
        ]
      },
      {
        pk: 'CUSTOMERS_NUMBER',
        referenceColumn: 'INVOICES_CUSTOMER',
        refTable: 'custbtwoc',
        tabTitle: 'CUSTOMERS',
        subtitle: 'Details',
        showTogether: [
          {
            refTable: 'customersAddrDlv',
            subTubTitle: 'Delivery & Invoice Address',
            referenceColumn: 'CUSTOMERS_NUMBER',
          },
        ]
      }
    ] // Order, Delivery Note, Customer,
  }
}
