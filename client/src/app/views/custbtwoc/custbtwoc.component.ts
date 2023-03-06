import { Component } from '@angular/core';
import { TableTypes } from 'src/app/_services/constants.service';
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";

@Component({
  selector: 'app-custbtwoc',
  templateUrl: './custbtwoc.component.html',
  styleUrls: ['./custbtwoc.component.css']
})

/**
 * CustbtwocComponent: customers b2c (business to customer) view component
 *
 * table:    CUSTOMERS
 * refTable: custbtwoc
 */
export class CustbtwocComponent {
  constructor() {}

  title = 'CUSTOMERS'
  fetchTableConfig: IFetchTableConfig = {
    pk: "CUSTOMERS_NUMBER",
    refTable: 'custbtwoc',
    subtitle: 'Details',
    secondColumn: "CUSTOMERS_TYPE",
    secondColumnValue: "B2C",
    additionalSearch: 'CUSTOMERS_COMPANY',

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
            tableType: TableTypes.pTable
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
            tableType: TableTypes.pTable
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
            tableType: TableTypes.pTable
          }
        ]
      }
    ] // Order, Delivery Note, Invoice
  }
}
