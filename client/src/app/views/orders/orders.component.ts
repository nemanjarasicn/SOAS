import {IFetchTableConfig} from "../../interfaces/dynamic-view-main-table.interface";
import {Component} from "@angular/core";
import {TableTypes} from "../../_services/constants.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent {
  constructor() {}

  title = 'ORDERS'
  fetchTableConfig: IFetchTableConfig = {
    subtitle: 'Details',
    refTable: 'orders',
    pk: "ORDERS_NUMBER",
    additionalSearch: 'CUSTOMER_ORDER',
    modelOptions: [
      // {model: 'OrderPosition'},
      // {model: 'CustomerAddress'},
      // {model: 'TaxCode'}
    ],

    insertTogether: [
      {
        refTable: 'orderPosition',
        subtitle: 'Order Positions',
        referenceColumn: 'ORDERS_NUMBER',
        pk: 'ORDERS_NUMBER', // 'ID'
        tableType: TableTypes.pTable
      },
    ], // OrderPosition

    viewEditTabs: [
      // {
      //   foreignColumn: 'CUSTOMER_ORDER',
      //   refTable: 'orders',
      //   subTabTitle: 'ORDERS',
      //   listView: true,
      //   subtitle: 'Details',
      //   showTogether: [
      //     {
      //       foreignColumn: 'ORDERS_NUMBER',
      //       tabTitle: 'ORDER_POSITIONS',
      //     }
      //   ]
      //
      // }
    ] // Order, Delivery Note, Invoice, Comment
  }
}
