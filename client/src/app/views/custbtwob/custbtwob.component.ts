import {Component} from '@angular/core';
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";


@Component({
  selector: 'app-custbtwob',
  templateUrl: './custbtwob.component.html',
  styleUrls: ['./custbtwob.component.css']
})

/**
 * CustbtwobComponent: customers b2b (business to business) view component with a CustomTableTabGroupViewComponent:
 * table (on left) and tab-group (on right)
 *
 * table:    [CUSTOMERS]
 * refTable: custbtwob
 */
export class CustbtwobComponent{

  title = 'CUSTOMERS'
  fetchTableConfig: IFetchTableConfig = {
    pk: "CUSTOMERS_NUMBER",
    refTable: 'custbtwob',
    subtitle: 'Details',
    secondColumn: "CUSTOMERS_TYPE",
    secondColumnValue: "B2B",
    additionalSearch: 'CUSTOMERS_COMPANY',
    modelOptions: [
      {
        model: 'CustomerAddress'
      }
    ],

    insertTogether: [
      {
        pk: 'ID',
        refTable: 'customersAddrDlv',
        subtitle: 'Delivery Address',
        referenceColumn: 'CUSTOMERS_NUMBER',
        secondColumn: "ADDRESS_TYPE",
        secondColumnValue: "DLV"
      },
      {
        pk: 'ID',
        refTable: 'customersAddrInv',
        subtitle: 'Invoice Address',
        referenceColumn: 'CUSTOMERS_NUMBER',
        secondColumn: "ADDRESS_TYPE",
        secondColumnValue: "INV"
      }
    ], // Delivery Addr, Invoice Addr

    viewEditTabs: [
      {
        pk: 'ORDERS_NUMBER',
        referenceColumn: 'CUSTOMER_ORDER',
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
        pk: 'DELIVERY_NOTES_NUMBER',
        referenceColumn: 'CUSTOMERS_NUMBER',
        refTable: 'deliveryNote',
        tabTitle: 'DELIVERY_NOTES',
        subtitle: 'Details',
        showTogether: [
          {
            refTable: 'deliveryNotePositions',
            referenceColumn: 'DELIVERY_NOTES_NUMBER',
            subTubTitle: 'DELIVERY_NOTE_POSITIONS',
          }
        ]
      },
      {
        pk: 'INVOICES_NUMBER',
        referenceColumn: 'INVOICES_CUSTOMER',
        refTable: 'invoice',
        tabTitle: 'INVOICES',
        subtitle: 'Details',
        showTogether: [
          {
            refTable: 'invoicePositions',
            referenceColumn: 'INVOICES_NUMBER',
            subTubTitle: 'INVOICE_POSITIONS',
          }
        ]
      }
    ] // Order, Delivery Note, Invoice
  }
}
