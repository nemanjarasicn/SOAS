import {
    buildHeadersAndFieldsForImportFile,
    prepareTableToDealWith,
} from "../../routes/logic/csv_import";
import sql = require('mssql');
import "mocha";
import {expect} from "chai"
import {CustomerImport, CustomerAddrImport} from "../../routes/logic/classes/CustomerImport";
import {OrderImport, OrderPosImport} from "../../routes/logic/classes/OrderImport";

describe('CSV IMPORT', function(){
    describe('buildHeadersAndFieldsForImportFile', function(){
        it('should return fields and headers', async function(){
            const params = [
                {id:1, short_desc: 'category',	required: 0},
                {id:2, short_desc: 'payment condition', required: 0},
                {id:3, short_desc: 'customer number', required: 1},
                {id:4, short_desc: 'statistic group', required: 0}
            ]
            const {headers, fields} = await buildHeadersAndFieldsForImportFile(params)
            expect(headers).to.be.eql([
                "category",
                "payment condition",
                "customer number",
                "statistic group"
            ])
            expect(fields.length).to.be.eql(4)
            for(let f of fields){
                // @ts-ignore
                if(f?.length) {
                    // @ts-ignore
                    f.forEach( innerF => {
                        expect(innerF).to.have.all.keys('table', 'column', 'required')
                    })
                }
                else expect(f).to.have.all.keys('table', 'column', 'required')
            }

        })
    })

    describe('checkCustomer', function(){
        it("should return true, for CUSTOMER_NUMBER = 'NEW_ONE_FOR_SURE'", async function(){
            const res =  await CustomerImport.checkCustomer('NEW_ONE_FOR_SURE')
            expect(res).to.be.true
        })
    })

    describe('checkCustomerAddress', function(){
        it('should return true, CUSTOMERS_NUMBER = "NEW_ONE_FOR_SURE", ADDRESS_TYPE = DLV', async function(){
            const res = await CustomerAddrImport.checkCustomerAddress('NEW_ONE_FOR_SURE', 'DLV')
            expect(res).to.be.true
        })
    })

    describe('checkArticle', function(){
        it('should return true , ITMNUM = "NEW_ONE_FOR_SURE"', async function(){
            const res = await OrderPosImport.checkArticle('NEW_ONE_FOR_SURE')
            expect(res).to.be.true
        })
    })

    describe('getItmDes', function(){
        it('shuold return NULL, for ITMNUM = "NEW_ONE_FOR_SURE"', async function(){
            const res = await OrderPosImport.getItmDes('NEW_ONE_FOR_SURE')
            expect(res).to.be.undefined
        })
    })

    describe('getCustomerType', function(){
        it('should return B2C, for value = "SOME_CUSTOMER_NUM_THAT_IS_NOT_IN_LIST"', async function(){
            const res = await CustomerImport.getCustomerType('SOME_CUSTOMER_NUM_THAT_IS_NOT_IN_LIST')
            expect(res).to.be.eql('B2C')
        })
    })

    describe('makeDateForOrd', function(){
        it('should return yyyy-mm-dd 00:00:00 for given value',  function(){
            const value = '20210314'
            const res = OrderImport.makeDateForOrd(value)

            expect(res).to.be.eql('2021-03-14 00:00:00')
        })

        it('should return yyyy-mm-dd 00:00:00 for given value',  function(){
            const value = '20210314'
            const res = OrderImport.makeDateForOrd(value)

            expect(res).to.be.eql('2021-03-14 00:00:00')
        })
    })

    describe('checkSalesLocationAndWarehouse', function(){
        it('will check if salesLocation compatible with warehouseLocation', function(){
            let params = {
                salesLocation: '100',
                warehouseLocation: '101'
            }
            let res = OrderImport.checkSalesLocationAndWarehouse(params)
            expect(res).to.be.true

            params = {
                salesLocation: '100',
                warehouseLocation: '201'
            }
            res = OrderImport.checkSalesLocationAndWarehouse(params)
            expect(res).to.be.false

            params = {
                salesLocation: '200',
                warehouseLocation: '2001'
            }
            res = OrderImport.checkSalesLocationAndWarehouse(params)
            expect(res).to.be.false

            params = {
                salesLocation: '1000',
                warehouseLocation: '1010'
            }
            res = OrderImport.checkSalesLocationAndWarehouse(params)
            expect(res).to.be.true

        })
    })

    describe('prepareTableToDealWith', function(){
        it('should fill the Map() on right way', async function(){
            let tmpMap = new Map();
            const param1 = {
                table: 'TB1',
                columnName: 'column1_1',
                value: 'v1_1',
                import_type: 1
            }
            const param2 = {
                table: 'TB1',
                columnName: 'column1_2',
                value: 'v1_2',
                import_type: 1
            }
            const param3 = {
                table: 'TB2',
                columnName: 'column2_1',
                value: 'v2_1',
                import_type: 1
            }

            tmpMap = prepareTableToDealWith(
                param1.table,
                param1.columnName,
                param1.value,
                tmpMap,
                param1.import_type
            )
            expect(tmpMap.get('TB1')).to.be.eql({
                tableName: 'TB1',
                params: [{
                    name: 'column1_1',
                    type: sql.NVarChar,
                    value: 'v1_1'
                }]
            })

            tmpMap = prepareTableToDealWith(
                param2.table,
                param2.columnName,
                param2.value,
                tmpMap,
                param2.import_type
            )
            expect(tmpMap.get('TB1')).to.be.eql({
                tableName: 'TB1',
                params: [
                    {
                        name: 'column1_1',
                        type: sql.NVarChar,
                        value: 'v1_1'
                    },
                    {
                        name: 'column1_2',
                        type: sql.NVarChar,
                        value: 'v1_2'
                    }
                ]
            })

            tmpMap = prepareTableToDealWith(
                param3.table,
                param3.columnName,
                param3.value,
                tmpMap,
                param3.import_type
            )
            expect(tmpMap.get('TB2')).to.be.eql({
                tableName: 'TB2',
                params: [{
                    name: 'column2_1',
                    type: sql.NVarChar,
                    value: 'v2_1'
                }]
            })
            expect(tmpMap.get('TB1')).to.be.eql({
                tableName: 'TB1',
                params: [
                    {
                        name: 'column1_1',
                        type: sql.NVarChar,
                        value: 'v1_1'
                    },
                    {
                        name: 'column1_2',
                        type: sql.NVarChar,
                        value: 'v1_2'
                    }
                ]
            })
        })
    })
})
