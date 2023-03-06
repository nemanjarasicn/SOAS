import {ImportBasic} from "./ImportBasic";
import * as sql from 'mssql';
import {_columns, _columnsPos} from "../constants/OrderImportConstants";
import {
  IOrdersColumns,
  IOrdersPosColumns,
  IPositionWC,
  IRequiredDataOrderImport,
  IRequiredDataOrderPosImport
} from "./interfaces/Import";
import {mssqlCallEscaped} from "../mssql_call";
import {SupplyOrderImport, SupplyOrderPositions} from "./SupplyOrderImport";
import {SecondaryOrderImport, SecondaryOrderPosImport} from "./SecondaryOrderImport";
import {insertRestComponentsOrdPosDBFun} from "../insertRestComponentsOrdPosDBFun";
import {mssql_select_states} from "../sql/states/States";
import {mssql_create_notes_manually} from "../sql/delivery-note/DeliveryNote";
import {WarehouseControl} from "./WarehouseControl";
import {setStockTransfer} from "../sql/stock-transfer/StockTransfer";
import {constants} from "../constants/constants";
import {getCompanyBySalesLocation} from "../mssql_logic";

export class OrderImport extends ImportBasic{
  /**
   * Author Strahinja Belic 03.11.2021.
   * Last Change: 03.11.2021.
   * @param orderamount_net_forSUM - number
   * @param orderamount_bru_forSUM - number
   * @param orders_number - string
   * @param orders_number_secondary - string
   * @param customer_order - string
   */
  static async updateNetAndBruPrice(
      orderamount_net_forSUM: number | null | undefined,
      orderamount_bru_forSUM: number,
      orders_number: string,
      orders_number_secondary: string,
      customer_order: string
  ){
    let netPrice: number
    if(
        orderamount_net_forSUM === null ||
        orderamount_net_forSUM === undefined
    ) {
      netPrice = await OrderImport.getNetPriceForOrdPos(orderamount_bru_forSUM, customer_order)
    } else {
      netPrice = orderamount_net_forSUM
    }

    const query = `UPDATE ORDERS SET ORDERAMOUNT_NET = ORDERAMOUNT_NET + @ORDERAMOUNT_NET, 
    ORDERAMOUNT_BRU = ORDERAMOUNT_BRU + @ORDERAMOUNT_BRU WHERE ORDERS_NUMBER IN (@ORDERS_NUMBER, @ORDERS_NUMBER_SEC)`
    const queryParams = [
      {
        name: 'ORDERAMOUNT_NET',
        type: sql.Float,
        value: netPrice
      },
      {
        name: 'ORDERAMOUNT_BRU',
        type: sql.Float,
        value: orderamount_bru_forSUM
      },
      {
        name: 'ORDERS_NUMBER',
        type: sql.NVarChar,
        value: orders_number
      },
      {
        name: 'ORDERS_NUMBER_SEC',
        type: sql.NVarChar,
        value: orders_number_secondary
      }
    ]

    await mssqlCallEscaped(queryParams, query)
  }

  /**
   * Author Strahinja Belic 16.07.2021.
   * Last Change: 23.08.2021.
   *
   * It will return last orders number from DB
   * @param whereParam string - LIKE part for sql query
   * @returns Promise<string> ORDERS_NUMBER
   */
  static async getLastOrder(whereParam: string): Promise<string>{
    const sqlQuery = `SELECT TOP 1 ORDERS_NUMBER as ordnum FROM ORDERS 
    WHERE ORDERS_NUMBER LIKE @LIKE ORDER BY ORDERS_NUMBER DESC`
    const result = await mssqlCallEscaped([{
      name: 'LIKE',
      value: `%${whereParam}%`,
      type: sql.NVarChar
    }], sqlQuery)

    return result[0]?.ordnum
  }

  /**
   * Author Strahinja Belic 16.07.2021.
   * Last Change: 23.08.2021.
   *
   * It will make last 5 digits for order number
   * @param forLastOrderParam string - start part of ORDERS_NUMBER
   * @param supplyOrder
   * @returns Promise<string> 5 digits for order number
   */
  static async getLastDigitsForOrdersNumber(forLastOrderParam: string, supplyOrder = false): Promise<string>{
    const lastOrder: string = supplyOrder?
        await SupplyOrderImport.getLastSupplyOrder(forLastOrderParam) :
        await OrderImport.getLastOrder(forLastOrderParam)
    let newDigits = 1

    if(lastOrder){
      const lastOrderDigits = lastOrder.slice(lastOrder.length - constants.MINIMUM_NUMBER_LENGTH_ORDERS_NUMBER, lastOrder.length)
      newDigits = +lastOrderDigits + 1
    }

    return newDigits.toString().padStart(constants.MINIMUM_NUMBER_LENGTH_ORDERS_NUMBER, '0')
  }

  /**
   * Author Strahinja Belic 16.07.2021.
   * Last Change: 23.08.2021.
   *
   * It will make order number
   * @param salesLocation - string
   * @param makeSupplyOrdNum - default = false
   * @returns Promise<string> - ORDERS_NUMBER
   */
  static async makeOrdersNumber(salesLocation: string, makeSupplyOrdNum = false): Promise<string>{
    const typeID = makeSupplyOrdNum? constants.SUPPLY_ORDER_TYPE_ID : constants.ORDER_TYPE_ID // TODO change hardcoded vars
    const company = await getCompanyBySalesLocation(salesLocation) as string
    const start = `${company}${String(new Date().getFullYear()).slice(2)}${typeID}`
    const lastDigits = await OrderImport.getLastDigitsForOrdersNumber(start, makeSupplyOrdNum)

    return `${start}${lastDigits}`
  }

  /**
   * Author: Strahinja Belic 24/09/2021
   * Last Change: 24/09/2021
   *
   * It will check if salesLocation is compatible with warehouseLocation
   * @example {salesLocation: '100', warehouseLocation: '101'} -> true
   * @example {salesLocation: '100', warehouseLocation: '201'} -> false
   * @param params - {salesLocation: string, warehouseLocation: string}
   * @returns boolean
   */
  static checkSalesLocationAndWarehouse(params: {
    salesLocation: string,
    warehouseLocation: string
  }): boolean{
    return params.salesLocation.length === params.warehouseLocation.length &&
        params.salesLocation[0] === params.warehouseLocation[0]
  }

  /**
   * Author: Strahinja Belic 20.07.2021.
   * Last Change 20.07.2021.
   *
   * It makes date for order
   * @param value string - for example: '20210314', yyyymmdd
   * @returns string - yyyy-mm-dd 00:00:00
   */
  static makeDateForOrd(value: string): string{
    return `${value.substring(0,4)}-${value.substring(4,6)}-${value.substring(6,8)} 00:00:00`
  }

  /**
   * Author: Strahinja Belic 23.07.2021.
   * Last Update 23.08.2021.
   *
   * It will serch for it for given currency name
   * @param value string - for example EUR
   * @returns Promise<number> - ID of currency
   */
  static async getCurrencyID(value: string): Promise<number>{
    const sqlQuery = "SELECT CURRENCY_ID as id FROM CURRENCIES WHERE CURRENCY_ISO_CODE = @CURRENCY_ISO_CODE"
    const result = await mssqlCallEscaped([{
      name: 'CURRENCY_ISO_CODE',
      type: sql.NVarChar,
      value
    }], sqlQuery)


    return result[0]?.id
  }

  /**
   * Author: Strahinja Belic 20.07.2021.
   * Last Change: 23.08.2021.
   *
   * It will return CUSTOMER_TYPE from CUSTOMERS for given customerNumber
   * @param customerNumber string
   * @returns Promise<string>
   */
  async getOrderClient(customerNumber: string): Promise<string>{
    const sqlQuery = "SELECT CUSTOMERS_TYPE as client FROM CUSTOMERS WHERE CUSTOMERS_NUMBER = @CUSTOMERS_NUMBER"
    const result = await mssqlCallEscaped([{
      name: 'CUSTOMERS_NUMBER',
      type: sql.NVarChar,
      value: customerNumber
    }], sqlQuery)

    return result[0]?.client
  }

  /**
   * Author: Strahinja Belic 11.10.2021.
   * Last Change: 21.02.2022.
   *
   * @param customer string
   * @returns Promise<number>
   */
  static async getTaxRate(customer: string): Promise<{
    taxrate: number
    taxcode: string
  }>{

    const sqlQuery = `SELECT TOP 1 TR.TAXRATE as taxrate, TR.TAXCODE as taxcode FROM TAXRATES TR INNER JOIN TAXCODES TC ON TC.TAXCODE = TR.TAXCODE
    INNER JOIN CUSTOMERS_ADDRESSES CA ON CA.ADDRESS_ISO_CODE = TC.COUNTRY
    WHERE CA.CUSTOMERS_NUMBER = @CUSTOMERS_NUMBER AND TR.PER_END IS NULL ORDER BY TR.PER_START DESC`

    const result = await mssqlCallEscaped([{
      name: 'CUSTOMERS_NUMBER',
      type: sql.NVarChar,
      value: customer
    }], sqlQuery)

    return {
      taxrate: Number(result[0]?.taxrate.replace('%', '')),
      taxcode: result[0]?.taxcode
    }
  }

  /**
   * Author: Strahinja Belic 16.07.2021.
   * Last Change: 11.10.2021.
   *
   * Calculate Net price for ORDERS_POSITIONS
   * @param value number
   * @param customer string
   * @returns Promise<number.toFixed(2)>
   */
  static async getNetPriceForOrdPos(value: number, customer: string): Promise<number>{
    const { taxrate } = await OrderImport.getTaxRate(customer)
    const tmpValue = value / (1 + (taxrate/100))

    return +tmpValue.toFixed(2)
  }

  addPosition(data: IPositionWC): void{
    this.positions.push(data)
  }

  /**
   * Author: Strahinja Belic 20.11.2021.
   * Last Change: 20.11.2021.
   * @param itemNumber - Article number
   */
  async getWarehousingIdFromForArticle(itemNumber: string): Promise<{WAREHOUSING_ID: string}[]>{
    const sqlQuery = `SELECT WAREHOUSING_ID FROM WAREHOUSE_RESERVATION_CACHE 
    WHERE ITMNUM = @ITMNUM AND DOCUMENT_NUMBER = @DOCUMENT_NUMBER`
    const params = [
      {
        name: 'ITMNUM',
        value: itemNumber,
        type: sql.NVarChar
      },
      {
        name: 'DOCUMENT_NUMBER',
        value: this.getColumnValue('orders_number'),
        type: sql.NVarChar
      }
    ]

    return await mssqlCallEscaped(params, sqlQuery)
  }

  /**
   * Author: Strahinja Belic 20.11.2021.
   * Last Change: 20.11.2021.
   * @param itemNumber - Article number
   * @param loc
   * @param whloc
   */
  async checkWarehousingID(itemNumber: string, loc: string, whloc: number){
    const sqlQuery = `SELECT ID FROM WAREHOUSING WHERE LOC = @LOC AND WHLOC = @WHLOC AND ITMNUM = @ITMNUM`
    const params = [
      {
        name: 'LOC',
        value: loc,
        type: sql.NVarChar
      },
      {
        name: 'WHLOC',
        value: whloc,
        type: sql.NVarChar
      },
      {
        name: 'ITMNUM',
        value: itemNumber,
        type: sql.NVarChar
      }
    ]

    return await mssqlCallEscaped(params, sqlQuery)
  }

  /**
   * Author: Strahinja Belic 20.11.2021.
   * Last Change: 20.11.2021.
   * @param itemNumber - Article number
   */
  async getWarehousingIdToForArticle(itemNumber: string): Promise<string>{
    let result = await this.checkWarehousingID(itemNumber, '000A01', 201) // TODO change hardcoded vars

    if(!!result[0]){
      // it exists
      return result[0].ID
    }

    await this.warehouseControl.insertWarehousing({
      warehousingBatchNumber: "",
      warehousingItemNumber: itemNumber,
      warehousingLocation: "201", // TODO change hardcoded vars
      warehousingQuantity: 0,
      warehousingReserved: 0,
      warehousingStatusPosition: "A", // TODO change hardcoded vars?
      warehousingStorageLocation: "000A01", // TODO change hardcoded vars
      warehousingUpdateLocation: new Date()
    })

    result = await this.checkWarehousingID(itemNumber, '000A01', 201) // TODO change hardcoded vars
    return result[0].ID
  }

  /**
   * Author: Strahinja Belic 18.12.2021.
   * Last Change: 18.12.2021.
   * @desc update supplied_qty column at SUPPLY_ORDERS table
   * @param position
   */
  async updateSuppliedQty(position: {
    assignedQty: number,
    itmnum: string,
    warehouse: string
  }){
    const sqlQuery = `UPDATE SUPPLY_ORDERS_POSITIONS SET SUPPLIED_QTY = @SUPPLIED_QTY
      WHERE ITMNUM = @ITMNUM AND PROVIDERS_ORDER = @PROVIDERS_ORDER AND WAREHOUSE = @WAREHOUSE`
    const params = [
      {
        name: 'SUPPLIED_QTY',
        value: position.assignedQty,
        type: sql.Int
      },
      {
        name: 'ITMNUM',
        value: position.itmnum,
        type: sql.NVarChar
      },
      {
        name: 'PROVIDERS_ORDER',
        value: this.supplyOrderImportClass.getColumnValue('providers_order_supply'),
        type: sql.NVarChar
      },
      {
        name: 'WAREHOUSE',
        value: position.warehouse,
        type: sql.Int
      }
    ]

    await mssqlCallEscaped(params, sqlQuery)
  }

  /**
   * Author: Strahinja Belic 20.11.2021.
   * Last Change: 20.11.2021.
   * @desc 1.Reserve Stock -> 2. CREATE DELIVERY NOTE -> 3. Move Items
   * @param username
   */
  async invokeWarehouseControl(username: string){
    let positionsNewFormat: {
      ID: number
      ORDERS_NUMBER: string
      ITMNUM: string
      ITMDES: string
      CATEGORY_SOAS: string
      ORDER_QTY: number
      ASSIGNED_QTY: number
      DELIVERED_QTY: number
      PRICE_NET: number
      PRICE_BRU: number
      CURRENCY: string
      POSITION_STATUS: string
      POSITION_ID: number
      PARENT_LINE_ID: number
      WAREHOUSE: string
      DIST_COMPONENTS_ID: string
    }[] = []

    // RESERVE STOCK
    for (let position of this.positions){
      await this.warehouseControl.reserveStock(
          this.getColumnValue('orders_number'),
          {
            warehouseRCDocumentNumber: this.getColumnValue('orders_number'),
            warehouseRCItemNumber: position.itemNumber,
            warehouseRCAssignedQuantity: position.assignedQuantity,
            warehouseRCBatchNumber: null,
            warehouseRCStorageLocation: "000A01", // TODO change hardcoded vars
            warehouseRCWarehouse: position.warehouse,
            warehouseRCPositionId: position.positionId,
            warehouseRCAssignmentDate: `${position.assignmentDate.getFullYear()}-${position.assignmentDate.getMonth() + 1}-${position.assignmentDate.getDate()}`,
            warehouseRCWarehousingId: null,
            warehouseRCOrdersPositionsId: position.ordersPositionsId,
            warehouseRCDeliveryNotesPositionsId: null,
          }
      )

      positionsNewFormat.push({
        ID: position.ordersPositionsId,
        ORDERS_NUMBER: this.getColumnValue('orders_number'),
        ITMNUM: position.itemNumber,
        ITMDES: position.itemDes,
        CATEGORY_SOAS: position.categorySoas,
        ORDER_QTY: position.orderQuantity,
        ASSIGNED_QTY: position.assignedQuantity,
        DELIVERED_QTY: 0,
        PRICE_NET: position.priceNet,
        PRICE_BRU: position.priceBru,
        CURRENCY: position.currency,
        POSITION_STATUS: '3', // TODO change hardcoded vars
        POSITION_ID: position.positionId,
        PARENT_LINE_ID: position.parentLineId,
        WAREHOUSE: position.warehouse,
        DIST_COMPONENTS_ID: position.distComponentId
      })
    }

    // CREATE DELIVERY NOTE
    const statesResult = await mssql_select_states();
    await mssql_create_notes_manually(
        '/selectThisOrderAvise',
        'ORDERS_NUMBER',
        this.getColumnValue('orders_number'),
        username,
        statesResult,
        positionsNewFormat,
        false
    )

    // MOVE ITEMS
    for (let position of positionsNewFormat){
      const fromIdsResult = await this.getWarehousingIdFromForArticle(position.ITMNUM)
      const toId = await this.getWarehousingIdToForArticle(position.ITMNUM)

      for(let fromIdResult of fromIdsResult){
        await setStockTransfer('updateAndDeleteLocation', {
          fromWarehousingId: fromIdResult.WAREHOUSING_ID,
          toWarehousingId: toId,
          quantity: position.ASSIGNED_QTY,
        })
      }
    }

    // UPDATE SUPPLIED_QTY for positions
    for (let position of this.positions){
      if(position.categorySoas === 'KOMP'){ // TODO change hardcoded vars
        await this.updateSuppliedQty({
          assignedQty: position.assignedQuantity,
          itmnum: position.itemNumber,
          warehouse: position.warehouse
        })
      }
    }
  }

  secondaryOrderImportClass = undefined
  supplyOrderImportClass = undefined
  private positions: IPositionWC[] = []
  private warehouseControl

  constructor(requiredData: IRequiredDataOrderImport) {
    super();
    this.tableName = "ORDERS"
    this.columns = _columns as IOrdersColumns
    this.warehouseControl = new WarehouseControl()

    for (const dataKey in requiredData) {
      this.columns[dataKey].value = requiredData[dataKey]
    }

  }

  async prepareInsert() {
    this.setColumnValue(
        'orders_number',
        await OrderImport.makeOrdersNumber(this.getColumnValue('sales_location'))
    )

    this.setColumnValue(
        'client',
        await this.getOrderClient(this.getColumnValue('customer_order'))
    )

    const tmpCurrency = this.getColumnValue('currency')
    this.setColumnValue(
      'currency',
        !+`${tmpCurrency}`? await OrderImport.getCurrencyID( tmpCurrency ) : tmpCurrency
    )

    this.setColumnValue(
        'orders_date',
        OrderImport.makeDateForOrd(this.getColumnValue('orders_date'))
    )

    if(
        this.getColumnValue('orderamount_net') === null ||
        this.getColumnValue('orderamount_net') === undefined
    ) {
      this.setColumnValue(
          'orderamount_net',
          await OrderImport.getNetPriceForOrdPos(
              +this.getColumnValue('orderamount_bru'),
              this.getColumnValue('customer_order')
          )
      )

      this.setColumnValue(
      'tax_amount',
      +this.getColumnValue('orderamount_bru') - +this.getColumnValue('orderamount_net')
      )

      const {taxrate, taxcode} = await OrderImport.getTaxRate(this.getColumnValue('customer_order'))
      this.setColumnValue('taxrate', taxrate)
      this.setColumnValue('taxcode', taxcode)

      this.setColumnValue('net_order',0) // at the moment |  if it is B2B its 1, else 0
    }

    await this.insert()

    // if it's supply order, according to salesLocation, then insert to SUPPLY_ORDER and make Secondary too
    if(await SupplyOrderImport.checkIsItSupplyOrder(this.getColumnValue('sales_location'))){
      const tmpSupplyOrderNumber = await OrderImport.makeOrdersNumber(this.getColumnValue('sales_location'), true)

      this.supplyOrderImportClass = new SupplyOrderImport({
        order_ref_supply: this.getColumnValue('orders_number'),
        provider_order_supply: tmpSupplyOrderNumber,
        orders_date_supply: this.getColumnValue('orders_date'),
        currency_supply: this.getColumnValue('currency'),
        warehouse_supply: 201 // TODO change hardcoded vars
      })

      const secondaryOrdersNumber = await OrderImport.makeOrdersNumber('101') // TODO change hardcoded vars

      this.secondaryOrderImportClass = new SecondaryOrderImport({
        orders_number_secondary: secondaryOrdersNumber,
        client_secondary: this.getColumnValue('client'),
        orders_type_secondary: this.getColumnValue('orders_type') || "",
        project_field_0_secondary: this.getColumnValue('project_field_0') || "",
        project_field_1_secondary: this.getColumnValue('project_field_1') || "",
        project_field_2_secondary: this.getColumnValue('project_field_2') || "",
        customer_order_secondary: this.getColumnValue('customer_order'),
        customer_delivery_secondary: 200, // TODO change hardcoded vars
        customer_invoice_secondary: 200, // TODO change hardcoded vars
        orders_date_secondary: this.getColumnValue('orders_date'),
        orderamount_net_secondary: +this.getColumnValue('orderamount_net'),
        orderamount_bru_secondary: +this.getColumnValue('orderamount_bru'),
        customer_orderref_secondary: this.getColumnValue('customer_orderref'),
        edi_orderresponse_sent_secondary: this.getColumnValue('edi_orderresponse_sent'),
        release_secondary: this.getColumnValue('release'),
        payed_secondary: this.getColumnValue('payed'),
        currency_secondary: this.getColumnValue('currency'),
        orders_state_secondary: this.getColumnValue('orders_state'),
        last_delivery_secondary: this.getColumnValue('last_delivery'),
        last_invoice_secondary: this.getColumnValue('last_invoice'),
        payment_term_id_secondary: this.getColumnValue('payment_term_id'),
        webshop_id_secondary: this.getColumnValue('webshop_id'),
        webshop_order_ref_secondary: this.getColumnValue('webshop_order_ref'),
        voucher_secondary: this.getColumnValue('voucher')  || "",
        shipping_costs_secondary: +this.getColumnValue('shipping_costs') || "",
        warehouse_secondary: 101, // TODO change hardcoded vars
        sales_location_secondary: 101, // TODO change hardcoded vars
        delivery_method_secondary: this.getColumnValue('delivery_method'),
        comment_secondary: this.getColumnValue('comment'),
        pac_qty_secondary: this.getColumnValue('pac_qty'),
        discount_perc_secondary: this.getColumnValue('discount_perc'),
        supply_order_reference_secondary: this.supplyOrderImportClass.getColumnValue(''),
        discount_secondary: this.getColumnValue('discount')
      })

      await this.supplyOrderImportClass.prepareInsert()
      await this.secondaryOrderImportClass.prepareInsert()

    }
  }
}

export class OrderPosImport extends ImportBasic{
  /**
   * Author: Strahinja Belic 29.07.2021.
   * Last Change: 23.08.2021.
   * @param ordersNumber string
   * @param itmnum string
   * @returns Promise<ID: number, CURRENCY: number, DELIVERED_QTY: number, WAREHOUSE: string}>
   */
  static async getParentForOrdPosComponents(
      ordersNumber: string,
      itmnum: string
  ): Promise<{ID: number, CURRENCY: number, DELIVERED_QTY: number, WAREHOUSE: string}>{
    let toReturn: {ID: number, CURRENCY: number, DELIVERED_QTY: number, WAREHOUSE: string}[]

    const sqlQuery = `SELECT ID, CURRENCY, DELIVERED_QTY, WAREHOUSE FROM 
    ORDERS_POSITIONS WHERE ORDERS_NUMBER = @ORDERS_NUMBER AND ITMNUM = @ITMNUM`
    toReturn =  await mssqlCallEscaped([
      {
        name: 'ORDERS_NUMBER',
        type: sql.NVarChar,
        value: ordersNumber
      },
      {
        name: 'ITMNUM',
        type: sql.NVarChar,
        value: itmnum
      }
    ], sqlQuery)

    return toReturn[0]
  }

  /**
   * Author: Strahinja Belic 30.07.2021.
   * Last Change: 23.08.2021.
   * It will get component for Order Positions
   * @param itmnum string
   * @returns Promise<{DIST_COMPONENTS_ID: number, DIST_QTY: number, ITMDES: string, CATEGORY_SOAS: string, ITMNUM: string}[]>
   */
  static async getComponentsForOrdPos(itmnum: string):
      Promise<{
        DIST_COMPONENTS_ID: number,
        DIST_QTY: number,
        ITMDES: string,
        CATEGORY_SOAS: string,
        ITMNUM: string
      }[]>{
    let toReturn: {DIST_COMPONENTS_ID: number, DIST_QTY: number, ITMDES: string, CATEGORY_SOAS: string, ITMNUM: string}[]
    const sqlQuery = `SELECT dc.ID as DIST_COMPONENTS_ID, dc.DIST_QTY, itm.ITMDES, itm.CATEGORY_SOAS, itm.ITMNUM,
    itm.WAREHOUSE_MANAGED FROM DIST_COMPONENTS dc INNER JOIN ITEM_BASIS itm ON itm.ITMNUM = dc.COMPNUM 
    WHERE dc.ITMNUM = @ITMNUM`
    toReturn =  await mssqlCallEscaped([{
      name: 'ITMNUM',
      type: sql.NVarChar,
      value: itmnum
    }], sqlQuery)

    return toReturn
  }

  static async checkIsItSupplyOrder(salesLocation: string): Promise<boolean>{
    const companyStart = salesLocation[0]
    const sqlQuery = `SELECT COUNT(COMPANY) as 'num' from COMPANIES WHERE COMPANY LIKE @COMPANY 
     AND INTERCOMPANY = @INTERCOMPANY AND ACTIVE = @ACTIVE`
    const result = await mssqlCallEscaped([
      {
        name: 'COMPANY',
        type: sql.NVarChar,
        value: `${companyStart}%`
      },
      {
        name: 'INTERCOMPANY',
        type: sql.Int,
        value: 1
      },
      {
        name: 'ACTIVE',
        type: sql.Int,
        value: 1
      }
    ], sqlQuery)

    return +result[0].num > 0
  }

  /**
   * Author: Strahinja Belic 22.07.2021.
   * Last Change 18.10.2021.
   *
   * It will insert `KOMP` for ITMNUM that's `SET` into ORDERS_POSITIONS table
   * @returns Promise<number> return current value of tmpPositionID_ord
   * @param params
   * @param salesLocation
   * @param setPositionCallBack
   */
   static async insertRestComponentsOrdPos(
      params:{
        ordersNumber: string,
        itmnum: string,
        order_qty: number,
        positionID_ord: number,
        supplyOrderNumber?: string,
        secondaryOrdersNumber?: string
      },
      salesLocation: string,
      setPositionCallBack?: (position: IPositionWC) => void
  ): Promise<number>{
    let tmpPositionID_ord = params.positionID_ord as number

    //get parent
    const resParent_line_id = await OrderPosImport.getParentForOrdPosComponents(params.ordersNumber, params.itmnum)
    let parent_line_id = resParent_line_id.ID as number

    //get components
    const resultDistComp = await OrderPosImport.getComponentsForOrdPos(params.itmnum)

    //insert
    for (const row of resultDistComp) {
      tmpPositionID_ord += 1000
      await insertRestComponentsOrdPosDBFun(
          params.ordersNumber,
          resParent_line_id['CURRENCY'],
          resParent_line_id['DELIVERED_QTY'],
          resParent_line_id['WAREHOUSE'],
          row['CATEGORY_SOAS'],
          parent_line_id,
          row['DIST_QTY'],
          params.order_qty,
          row['ITMDES'],
          row['ITMNUM'],
          row['DIST_COMPONENTS_ID'],
          tmpPositionID_ord
      )

      if(
          +row['WAREHOUSE_MANAGED'] === 0 &&
          params.supplyOrderNumber &&
          params.secondaryOrdersNumber
      ){
        if(row['CATEGORY_SOAS'] === 'KOMP'){
          const tmpClass = new SupplyOrderPositions({
            warehouse_supply: resParent_line_id['WAREHOUSE'],
            order_qty_supply: params.order_qty,
            item_num_supply: row['ITMNUM'],
            providers_order_supply: params.supplyOrderNumber
          })

          await tmpClass.prepareInsert()
        }

        const tmpClass = new SecondaryOrderPosImport({
          orders_number_secondary: params.secondaryOrdersNumber,
          itmdes_secondary: row['ITMDES'],
          itmnum_secondary: row['ITMNUM'],
          order_qty_secondary: +row['DIST_QTY'] * params.order_qty,
          currency_secondary: resParent_line_id['CURRENCY'],
          position_id_secondary: tmpPositionID_ord,
          dist_components_id_secondary: row['DIST_COMPONENTS_ID'],
          warehouse_secondary: 101, // TODO change hardcoded vars
          delivered_qty_secondary: resParent_line_id['DELIVERED_QTY'],
          category_soas_secondary: row['CATEGORY_SOAS'],
          parent_line_id_secondary: parent_line_id,
        })

        await tmpClass.prepareInsert()

        if(setPositionCallBack){
          const query = `SELECT ID FROM ORDERS_POSITIONS WHERE ITMNUM = @ITMNUM AND 
          POSITION_ID = @POSITION_ID AND PARENT_LINE_ID = @PARENT_LINE_ID AND 
          WAREHOUSE = @WAREHOUSE AND DIST_COMPONENTS_ID = @DIST_COMPONENTS_ID`
          const queryParams = [
            {
              name: 'ITMNUM',
              type: sql.NVarChar,
              value: row['ITMNUM']
            },
            {
              name: 'POSITION_ID',
              type: sql.NVarChar,
              value: tmpPositionID_ord
            },
            {
              name: 'PARENT_LINE_ID',
              type: sql.NVarChar,
              value: parent_line_id
            },
            {
              name: 'WAREHOUSE',
              type: sql.NVarChar,
              value: 101 // TODO change hardcoded vars
            },
            {
              name: 'DIST_COMPONENTS_ID',
              type: sql.NVarChar,
              value: row['DIST_COMPONENTS_ID']
            },
          ]
          // GET LAST INSERTED
          const tmpSecondaryOrderPosID: number = await mssqlCallEscaped(queryParams, query)

          setPositionCallBack({
            itemNumber: row['ITMNUM'],
            assignedQuantity: +row['DIST_QTY'] * params.order_qty,
            positionId: tmpPositionID_ord,
            assignmentDate: new Date(),
            warehouse: '101', // TODO change hardcoded vars
            ordersPositionsId: tmpSecondaryOrderPosID[0].ID,
            itemDes: row['ITMDES'],
            categorySoas: row['CATEGORY_SOAS'],
            orderQuantity: +row['DIST_QTY'] * params.order_qty,
            priceNet: 0,
            priceBru: 0,
            currency: resParent_line_id['CURRENCY'].toString(),
            parentLineId: parent_line_id,
            distComponentId: row['DIST_COMPONENTS_ID'].toString(),
          })
        }
      }
    }

    return tmpPositionID_ord + 1000 //increased by 1000 because of next SET/KOMP
  }

  /**
   * Author: Strahinja Belic 21.07.2021.
   * Last Change 23.08.2021.
   *
   * It will check does article exists and is it still active
   * @param itmnum string
   * @returns Promise<boolean> - true if find something with same ITMNUM and ACTIVE_FLG = 1
   */
  static async checkArticle(itmnum: string): Promise<boolean>{
    const sqlQuery = "SELECT COUNT(ID) as 'num' FROM ITEM_BASIS WHERE ACTIVE_FLG = @ACTIVE_FLG AND ITMNUM = @ITMNUM"
    const result = await mssqlCallEscaped([
      {
        name: 'ACTIVE_FLG',
        type: sql.Int,
        value: 1
      },
      {
        name: 'ITMNUM',
        type: sql.NVarChar,
        value: itmnum
      }
    ], sqlQuery)

    return !+result[0].num
  }

  /**
   * Author: Strahinja Belic 21.07.2021.
   * Last Change 23.08.2021.
   *
   * It will return ITMDES for given ITMNUM
   * @param itmnum string, ITMNUM
   * @returns Promise<string> - ITMDES
   */
  static async getItmDes(itmnum: string): Promise<string>{
    const sqlQuery = "SELECT ITMDES as 'itmdes' FROM ITEM_BASIS WHERE ITMNUM = @ITMNUM"
    const result = await mssqlCallEscaped([
      {
        name: 'ITMNUM',
        type: sql.NVarChar,
        value: itmnum
      }
    ], sqlQuery)

    return result[0]?.itmdes
  }

  /**
   * Author: Strahinja Belic 13.12.2021.
   * Last Change: 13.12.2021.
   * It will get dist_qty for component for Order Positions
   * @param itmnum string
   * @returns Promise<{DIST_QTY: number}>
   */
   static async getDistQtyForComponent(itmnum: string):
      Promise<number>{
    let toReturn: number
    const sqlQuery = `SELECT dc.DIST_QTY AS qty FROM DIST_COMPONENTS dc INNER JOIN ITEM_BASIS itm ON itm.ITMNUM = dc.COMPNUM 
    WHERE dc.ITMNUM = @ITMNUM`
    toReturn =  await mssqlCallEscaped([{
      name: 'ITMNUM',
      type: sql.NVarChar,
      value: itmnum
    }], sqlQuery)

    return toReturn[0]?.qty || 0
  }

  customer_order: string
  constructor(requiredData: IRequiredDataOrderPosImport, customer_order: string) {
    super();
    this.tableName = "ORDERS_POSITIONS"
    this.columns = _columnsPos as IOrdersPosColumns
    this.customer_order = customer_order

    for (const dataKey in requiredData) {
      this.columns[dataKey].value = requiredData[dataKey]
    }
  }

  async prepareInsert(){
    this.setColumnValue(
        'itmdes',
        await OrderPosImport.getItmDes(this.getColumnValue('itmnum'))
    )

    const distQty = await OrderPosImport.getDistQtyForComponent(this.getColumnValue('itmnum')) as number
    this.setColumnValue(
        'assigned_qty',
        +this.getColumnValue('order_qty') * distQty
    )

    if(this.getColumnValue('category_soas') === 'KOMP'){
      this.setColumnValue('price_net', 0)
      this.setColumnValue('price_bru', 0)
      this.setColumnValue('tax_amount', 0)
    }
    else if(
        this.getColumnValue('price_net') === null ||
        this.getColumnValue('price_net') === undefined
    ){
      this.setColumnValue(
          'price_net',
          await OrderImport.getNetPriceForOrdPos(
              +this.getColumnValue('price_bru'),
              this.customer_order
          )
      )

        this.setColumnValue(
            'tax_amount',
            +this.getColumnValue('price_bru') - +this.getColumnValue('price_net')
        )

    }

    const tmpCurrency = this.getColumnValue('currency')
    this.setColumnValue(
        'currency',
        !+`${tmpCurrency}`? await OrderImport.getCurrencyID( tmpCurrency ) : tmpCurrency
    )

    await this.insert()


  }
}
