import {ISqlTypeFactory} from "mssql";

export interface IColumn{
    columnName: string
    sqlType: ISqlTypeFactory
    notNull?: boolean
    value?: string | number | Date
    default?: string | number | Date
}

export interface ICustomers{
    customers_number: IColumn
    customers_prename: IColumn
    customers_name: IColumn
    customers_company: IColumn
    customers_type: IColumn
    eec_num: IColumn
    language: IColumn
    edi_invoic: IColumn
    edi_ordersp: IColumn
    edi_desadv: IColumn
    create_date: IColumn
    customers_email: IColumn
    customers_phone: IColumn
    email_rg: IColumn
    email_li: IColumn
    email_au: IColumn
    phone_0: IColumn
    phone_1: IColumn
    fax_0: IColumn
    mob_0: IColumn
    mob_1: IColumn
    crnnum: IColumn
    payment_term_id: IColumn
    email: IColumn
    different_dlv_name_0: IColumn
    different_dlv_name_1: IColumn
}

export interface ICustomersAddr{
    address_type: IColumn
    customers_number: IColumn
    address_cryname: IColumn
    address_street: IColumn
    address_city: IColumn
    address_postcode: IColumn
    address_iso_code: IColumn
    address_comment: IColumn
    taxation: IColumn
    name_addr: IColumn
    email: IColumn
    phone: IColumn
    address_id: IColumn
}

export interface ISupplyOrderColumns{
    provider_order_supply: IColumn
    provider_supply: IColumn
    client_delivery_supply: IColumn
    client_invoice_supply: IColumn
    amount_net_supply: IColumn
    amount_bru_supply: IColumn
    order_ref_supply: IColumn
    currency_supply: IColumn
    shipping_costs_supply: IColumn
    warehouse_supply: IColumn
    orders_date_supply: IColumn
    inter_company_supply: IColumn
}

export interface IRequiredDataSupplyOrderImport{
    provider_order_supply: string
    order_ref_supply: string
    currency_supply: string | number
    orders_date_supply: string | number
    warehouse_supply: string | number
}

export interface IRequiredDataSupplyOrderPosImport{
    warehouse_supply: string | number
    order_qty_supply: string | number
    item_num_supply: string | number
    providers_order_supply: string
}

export interface ISupplyOrderPositionsColumns{
    providers_order_supply: IColumn
    item_num_supply: IColumn
    order_qty_supply: IColumn
    price_net_supply: IColumn
    price_bru_supply: IColumn
    scheduled_arrival_supply: IColumn
    supplied_qty_supply: IColumn
    warehouse_supply: IColumn
}

export interface IOrdersColumns{
    orders_number: IColumn
    client: IColumn
    orders_type: IColumn
    project_field_0: IColumn
    project_field_1: IColumn
    project_field_2: IColumn
    customer_order: IColumn
    customer_delivery: IColumn
    customer_invoice: IColumn
    orders_date: IColumn
    orderamount_net: IColumn
    orderamount_bru: IColumn
    customer_orderref: IColumn
    last_delivery: IColumn
    last_invoice: IColumn
    edi_orderresponse_sent: IColumn
    release: IColumn
    payed: IColumn
    currency: IColumn
    orders_state: IColumn
    customer_addresses_id_delivery: IColumn
    customer_addresses_id_invoice: IColumn
    payment_term_id: IColumn
    webshop_id: IColumn
    webshop_order_ref: IColumn
    discount: IColumn
    voucher: IColumn
    shipping_costs: IColumn
    warehouse: IColumn
    sales_location: IColumn
    delivery_method: IColumn
    comment: IColumn
    pac_qty: IColumn
    discount_perc: IColumn
    supply_order_reference: IColumn
    taxcode: IColumn
    taxrate: IColumn
    tax_amount: IColumn
    net_order: IColumn

}

export interface IOrdersPosColumns{
    orders_number: IColumn
    itmnum: IColumn
    order_qty: IColumn
    assigned_qty: IColumn
    price_net: IColumn
    price_bru: IColumn
    currency: IColumn
    position_status: IColumn
    position_id: IColumn
    category_soas: IColumn
    parent_line_id: IColumn
    delivered_qty: IColumn
    itmdes: IColumn
    warehouse: IColumn
    dist_components_id: IColumn
    tax_amount: IColumn
}

export interface IOrdersSecondaryColumns{
    orders_number_secondary: IColumn
    client_secondary: IColumn
    orders_type_secondary: IColumn
    project_field_0_secondary: IColumn
    project_field_1_secondary: IColumn
    project_field_2_secondary: IColumn
    customer_order_secondary: IColumn
    customer_delivery_secondary: IColumn
    customer_invoice_secondary: IColumn
    orders_date_secondary: IColumn
    orderamount_net_secondary: IColumn
    orderamount_bru_secondary: IColumn
    customer_orderref_secondary: IColumn
    last_delivery_secondary: IColumn
    last_invoice_secondary: IColumn
    edi_orderresponse_sent_secondary: IColumn
    release_secondary: IColumn
    payed_secondary: IColumn
    currency_secondary: IColumn
    orders_state_secondary: IColumn
    customer_addresses_id_delivery_secondary: IColumn
    customer_addresses_id_invoice_secondary: IColumn
    payment_term_id_secondary: IColumn
    webshop_id_secondary: IColumn
    webshop_order_ref_secondary: IColumn
    discount_secondary: IColumn
    voucher_secondary: IColumn
    shipping_costs_secondary: IColumn
    warehouse_secondary: IColumn
    sales_location_secondary: IColumn
    delivery_method_secondary: IColumn
    comment_secondary: IColumn
    pac_qty_secondary: IColumn
    discount_perc_secondary: IColumn
    supply_order_reference_secondary: IColumn
}

export interface IOrdersPosSecondaryColumns{
    orders_number_secondary: IColumn
    itmnum_secondary: IColumn
    order_qty_secondary: IColumn
    assigned_qty_secondary: IColumn
    price_net_secondary: IColumn
    price_bru_secondary: IColumn
    currency_secondary: IColumn
    position_status_secondary: IColumn
    position_id_secondary: IColumn
    category_soas_secondary: IColumn
    parent_line_id_secondary: IColumn
    delivered_qty_secondary: IColumn
    itmdes_secondary: IColumn
    warehouse_secondary: IColumn
    dist_components_id_secondary: IColumn
}

export interface IPositionWC{
    itemNumber: string
    assignedQuantity: number
    positionId: number
    assignmentDate: Date
    warehouse: string
    ordersPositionsId: number
    itemDes: string
    categorySoas: string
    orderQuantity: number
    priceNet: number
    priceBru: number
    currency: string
    parentLineId: number | null
    distComponentId: string | null
}

export interface IRequiredDataOrderImport{
    orders_type: string | number
    project_field_0: string | number
    project_field_1: string | number
    project_field_2: string | number
    customer_order: string | number
    customer_delivery: string | number
    customer_invoice: string | number
    orders_date: string | number
    orderamount_net: string | number
    orderamount_bru: string | number
    customer_orderref: string | number
    edi_orderresponse_sent: string | number
    release: string | number
    payed: string | number
    currency: string | number
    orders_state: string | number
    voucher: string | number
    shipping_costs: string | number
    warehouse?: string | number
    sales_location?: string | number
    delivery_method?: string | number
    comment?: string
    pac_qty?: string | number
    discount_perc?: string | number
    supply_order_reference?: string
    last_delivery?: string | number
    last_invoice?: string | number
    payment_term_id?: string | number
    webshop_id?: string | number
    webshop_order_ref?: string | number,
    discount?: number
}

export interface IRequiredDataOrderPosImport{
    orders_number: string | number
    itmnum: string | number
    order_qty: string | number
    currency: string | number
    price_net: number
    price_bru: number
    position_id: number
    dist_components_id: number
    warehouse: string | number
    delivered_qty: number
    category_soas: string | number
    parent_line_id: string | number
}

export interface IRequiredDataSecondaryOrderImport{
    orders_number_secondary: string | number
    client_secondary: string | number
    orders_type_secondary: string | number
    project_field_0_secondary: string | number
    project_field_1_secondary: string | number
    project_field_2_secondary: string | number
    customer_order_secondary: string | number
    customer_delivery_secondary: string | number
    customer_invoice_secondary: string | number
    orders_date_secondary: string | number
    orderamount_net_secondary: string | number
    orderamount_bru_secondary: string | number
    customer_orderref_secondary: string | number
    edi_orderresponse_sent_secondary: string | number
    release_secondary: string | number
    payed_secondary: string | number
    currency_secondary: string | number
    orders_state_secondary: string | number
    voucher_secondary: string | number
    shipping_costs_secondary: string | number
    warehouse_secondary?: string | number
    sales_location_secondary?: string | number
    delivery_method_secondary?: string | number
    comment_secondary?: string
    pac_qty_secondary?: string | number
    discount_perc_secondary?: string | number
    supply_order_reference_secondary?: string
    last_delivery_secondary?: string | number
    last_invoice_secondary?: string | number
    payment_term_id_secondary?: string | number
    webshop_id_secondary?: string | number
    webshop_order_ref_secondary?: string | number,
    discount_secondary?: number
}

export interface IRequiredDataSecondaryOrderPosImport{
    orders_number_secondary: string | number
    itmdes_secondary?: string | number
    itmnum_secondary: string | number
    order_qty_secondary: string | number
    currency_secondary: string | number
    position_id_secondary: number
    dist_components_id_secondary: number
    warehouse_secondary: string | number
    delivered_qty_secondary: number
    category_soas_secondary: string | number
    parent_line_id_secondary: string | number
    price_bru_secondary?: number
    price_net_secondary?: number
}

export interface IRequiredDataCustomersImport{
    customers_number: string
    customers_prename: string
    customers_name: string
    customers_company?: string
    eec_num: string
    language: string
    edi_invoic?:  number
    edi_ordersp?: number
    edi_desadv?: number
    create_date: string
    customers_email?: string
    customers_phone?: string
    email_rg: string
    email_li: string
    email_au: string
    phone_0: string
    phone_1: string
    fax_0: string
    mob_0: string
    mob_1: string
    crnnum?: string
    payment_term_id: string
    email: string
    different_dlv_name_0?: string
    different_dlv_name_1?: string
}

export interface IRequiredDataCustomersAddrImport{
    address_type:  string
    customers_number:  string
    address_street:  string
    address_city:  string
    address_postcode:  string
    address_iso_code:  string
    address_comment?: {name: string, type: any, value: any}[]
    taxation: string
    name_addr?:  string
    email:  string
    phone:  string
    address_id?:  string
}
