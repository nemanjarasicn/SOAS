import {Component} from '@angular/core';
import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";
@Component({
  selector: 'app-delivery-notes',
  templateUrl: './delivery-notes.component.html',
  styleUrls: ['./delivery-notes.component.css']
})

/**
 * DeliveryNotesComponent: delivery notes view component with a CustomTableTabGroupViewComponent:
 * table (on left) and tab-group (on right)
 *
 * table:    [DELIVERY_NOTES]
 * refTable: deliveryNote
 */
export class DeliveryNotesComponent{
  title = 'DELIVERY_NOTES'
  fetchTableConfig: IFetchTableConfig = {
    pk: "DELIVERY_NOTES_NUMBER",
    refTable: 'deliveryNote',
    subtitle: 'Details',
    additionalSearch: 'CUSTOMERS_NUMBER,ORDERS_NUMBER',

    insertTogether: [
      {
        pk: 'ID',
        refTable: 'deliveryNotePositions',
        subtitle: 'Positions',
        referenceColumn: 'DELIVERY_NOTES_NUMBER',
      },
    ], // Delivery Positions

    viewEditTabs: [
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
        referenceColumn: 'CUSTOMERS_NUMBER',
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
    ] // Order, Customer,
  }
}
