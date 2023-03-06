import express from 'express';

const router = express.Router();
import {getGETParams, getPOSTParams, getPUTParams} from "./logic/models/Helper";
import {Provider} from "./logic/models/Provider";
import {Currency} from "./logic/models/Currency";
import {Country} from "./logic/models/Country";
import {Language} from "./logic/models/Language";
import {ProdUnit} from "./logic/models/ProdUnit";
import {WarehouseLoc} from "./logic/models/WarehouseLoc";
import {Warehousing} from "./logic/models/Warehousing";
import {DistComponent} from "./logic/models/DistComponent";
import {Article} from "./logic/models/Article";
import {Customer} from "./logic/models/Customer";
import {Order} from "./logic/models/Order";
import {AttributeName} from "./logic/models/AttributeName";
import {BatchProcess} from "./logic/models/BatchProcess";
import {Company} from "./logic/models/Company";
import {DeliveryNotePosition} from "./logic/models/DeliveryNotePosition";
import {DeliveryNote} from "./logic/models/DeliveryNote";
import {TableTemplate} from "./logic/models/TableTemplate";
import {ImportType} from "./logic/models/ImportType";
import {ImportTypeConstant} from "./logic/models/ImportTypeConstant";
import {ImportTypeReferencedTable} from "./logic/models/ImportTypeReferencedTable";
import {InvoicePosition} from "./logic/models/InvoicePosition";
import {Invoice} from "./logic/models/Invoice";
import {ReCrediting} from "./logic/models/ReCrediting";
import {SaleOffer} from "./logic/models/SaleOffer";
import {SupplyOrder} from "./logic/models/SupplyOrder";
import {TableLock} from "./logic/models/TableLock";
import {ItemLock} from "./logic/models/ItemLock";
import {ItmVariant} from "./logic/models/ItmVariant";
import {LocalizeIt} from "./logic/models/LocalizeIt";
import {PaymentTerm} from "./logic/models/PaymentTerm";
import {Prilist} from "./logic/models/Prilist";
import {ProdComponent} from "./logic/models/ProdComponent";
import {PurchaseOrder} from "./logic/models/PurchaseOrder";
import {TaxationRelation} from "./logic/models/TaxationRelation";
import {TaxRate} from "./logic/models/TaxRate";
import {State} from "./logic/models/State";
import {Role} from "./logic/models/Role";
import {WarehouseReservationCache} from "./logic/models/WarehouseReservationCache";
import {User} from "./logic/models/User";
import {Comment} from "./logic/models/Comment";
import {CustomerAddress} from "./logic/models/CustomerAddress";
import {FormTemplate} from "./logic/models/FormTemplate";
import {ImportTemplate} from "./logic/models/ImportTemplate";
import {OrderPosition} from "./logic/models/OrderPosition";
import {ReCreditingPosition} from "./logic/models/ReCreditingPosition";
import {SaleOfferPosition} from "./logic/models/SaleOfferPosition";
import {SupplyOrderPosition} from "./logic/models/SupplyOrderPosition";
import {TaxCode} from "./logic/models/TaxCode";
import {getNewListNumber} from "./logic/mssql_logic";
import {constants} from "./logic/constants/constants";
import {ImportTypesConstants} from './logic/classes/ImportTypesConstants';

/**
 * GET routes
 */

router.get('/article', function (req, res: any) {

    new Article().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/attributeName', function (req, res: any) {

    new AttributeName().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/batchProcess', function (req, res: any) {

    new BatchProcess().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/categorySoas', function (req, res: any) {

    // ToDo: ARTICLE_CATEGORIES - Move and load options to/from db?
    // new ArticleCategory().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
    //     res.promise(Promise.reject(err))
    // });
    const CATEGORIES: { CATEGORY_NAME: string, CATEGORY_DESCRIPTION: string }[] = [
        {CATEGORY_NAME: 'FERT', CATEGORY_DESCRIPTION: 'production'},
        {CATEGORY_NAME: 'HAUPT', CATEGORY_DESCRIPTION: 'main'},
        {CATEGORY_NAME: 'KOMP', CATEGORY_DESCRIPTION: 'component'},
        {CATEGORY_NAME: 'RAW', CATEGORY_DESCRIPTION: 'raw'},
        {CATEGORY_NAME: 'SERV', CATEGORY_DESCRIPTION: 'service'},
        {CATEGORY_NAME: 'SET', CATEGORY_DESCRIPTION: 'set'}
    ];
    res.send({table: ['CATEGORY_NAME,CATEGORY_DESCRIPTION', CATEGORIES], maxRows: CATEGORIES.length, page: 0});
});

router.get('/comment', function (req, res: any) {

    new Comment().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/company', function (req, res: any) {

    new Company().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/companyLocation', function (req, res: any) {

    new Company().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/country', function (req, res: any) {

    new Country().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/currency', function (req, res: any) {

    new Currency().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/customer', function (req, res: any) {

    new Customer().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/customerAddress', function (req, res: any) {

    new CustomerAddress().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/deliveryNote', function (req, res: any) {

    new DeliveryNote().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/deliveryNotePosition', function (req, res: any) {

    new DeliveryNotePosition().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/distComponent', function (req, res: any) {

    new DistComponent().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/formTemplate', function (req, res: any) {

    new FormTemplate().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/importTemplate', function (req, res: any) {

    new ImportTemplate().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/importType', function (req, res: any) {

    new ImportType().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/importTypeConstant', function (req, res: any) {

    new ImportTypeConstant().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/importTypeReferencedTable', function (req, res: any) {

    new ImportTypeReferencedTable().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/invoice', function (req, res: any) {

    new Invoice().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/invoicePosition', function (req, res: any) {

    new InvoicePosition().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/itemLock', function (req, res: any) {

    new ItemLock().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/itmVariant', function (req, res: any) {

    new ItmVariant().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/language', function (req, res: any) {

    new Language().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/localizeIt', function (req, res: any) {

    new LocalizeIt().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/order', function (req, res: any) {

    new Order().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/orderPosition', function (req, res: any) {

    new OrderPosition().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/paymentTerm', function (req, res: any) {

    new PaymentTerm().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/prilist', function (req, res: any) {

    new Prilist().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/prodComponent', function (req, res: any) {

    new ProdComponent().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/prodUnit', function (req, res: any) {

    new ProdUnit().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/provider', function (req, res: any) {

    new Provider().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/purchaseOrder', function (req, res: any) {

    new PurchaseOrder().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/reCrediting', function (req, res: any) {

    new ReCrediting().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/reCreditingPosition', function (req, res: any) {

    new ReCreditingPosition().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/role', function (req, res: any) {

    new Role().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/saleOffer', function (req, res: any) {

    new SaleOffer().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/saleOfferPosition', function (req, res: any) {

    new SaleOfferPosition().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/state', function (req, res: any) {

    new State().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/supplyOrder', function (req, res: any) {

    new SupplyOrder().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/supplyOrderPosition', function (req, res: any) {

    new SupplyOrderPosition().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/statusPos', function (req, res: any) {
    // ToDo: Load options from db or constants
    const STATUS_POS: { STATUS_POS: string, STATUS_POS_NAME: string }[] = [
        {STATUS_POS: '101', STATUS_POS_NAME: '101'},
        {STATUS_POS: '110', STATUS_POS_NAME: '110'},
        {STATUS_POS: '111', STATUS_POS_NAME: '111'},
        {STATUS_POS: '201', STATUS_POS_NAME: '201'},
        {STATUS_POS: '401', STATUS_POS_NAME: '401'},
    ];
    res.send({table: ['STATUS_POS,STATUS_POS_NAME', STATUS_POS], maxRows: STATUS_POS.length, page: 0});
});

router.get('/tableLock', function (req, res: any) {

    new TableLock().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/tableTemplate', function (req, res: any) {

    new TableTemplate().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/taxCode', function (req, res: any) {

    new TaxCode().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/taxRate', function (req, res: any) {

    new TaxRate().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/taxationRelation', function (req, res: any) {

    new TaxationRelation().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/user', function (req, res: any) {

    new User().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/whLoc', function (req, res: any) {
    // ToDo: Load options from db or constants
    const WHLOC: { WHLOC: string, WHLOC_NAME: string }[] = [
        {WHLOC: 'R1', WHLOC_NAME: 'R1'},
        {WHLOC: 'A', WHLOC_NAME: 'A'},
        {WHLOC: 'Q', WHLOC_NAME: 'Q'},
        {WHLOC: 'R', WHLOC_NAME: 'R'}
    ];
    res.send({table: ['WHLOC,WHLOC_NAME', WHLOC], maxRows: WHLOC.length, page: 0});
});

router.get('/warehouseLoc', function (req, res: any) {

    new WarehouseLoc().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.get('/warehouseReservationCache', function (req, res: any) {

    new WarehouseReservationCache().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.get('/warehousing', function (req, res: any) {

    new Warehousing().fetchData(getGETParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

/**
 * POST routes
 */

router.post('/customer', async function (req, res: any) {
    const reqParams = getPOSTParams(req)
    reqParams.data['CUSTOMERS_NUMBER'] = await getNewListNumber(constants.NEW_LINE_ITEM.CUSTOMER)

    if (reqParams?.insertTogetherData) {
        // DLV customersAddrDlv
        for (let dlv of reqParams.insertTogetherData['customersAddrDlv'].data) {
            dlv['CUSTOMERS_NUMBER'] = reqParams.data['CUSTOMERS_NUMBER']
            await new CustomerAddress().saveData({data: dlv})
        }

        // INV customersAddrInv
        for (let inv of reqParams.insertTogetherData['customersAddrInv'].data) {
            inv['CUSTOMERS_NUMBER'] = reqParams.data['CUSTOMERS_NUMBER']
            await new CustomerAddress().saveData({data: inv})
        }
    }

    new Customer().saveData({data: reqParams.data}).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.post('/customerAddress', function (req, res: any) {

    new CustomerAddress().saveData(getPOSTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.post('/article', function (req, res: any) {

    new Article().saveData(getPOSTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.post('/currency', function (req, res: any) {

    new Currency().saveData(getPOSTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.post('/distComponent', function (req, res: any) {

    new DistComponent().saveData(getPOSTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.post('/prodUnit', function (req, res: any) {

    new ProdUnit().saveData(getPOSTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.post('/provider', function (req, res: any) {

    new Provider().saveData(getPOSTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.post('/warehouseLoc', function (req, res: any) {

    new WarehouseLoc().saveData(getPOSTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.post('/warehousing', function (req, res: any) {

    new Warehousing().saveData(getPOSTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});


/**
 * PUT routes
 */

router.put('/customer', function (req, res: any) {
    new Customer().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.put('/customerAddress', function (req, res: any) {
    new CustomerAddress().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.put('/article', function (req, res: any) {
    new Article().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.put('/distComponent', function (req, res: any) {
    new DistComponent().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.put('/prodUnit', function (req, res: any) {
    new ProdUnit().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.put('/provider', function (req, res: any) {
    new Provider().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.put('/warehouseLoc', function (req, res: any) {
    new WarehouseLoc().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.put('/warehousing', function (req, res: any) {
    new Warehousing().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
});

router.put('/country', function (req, res: any) {
    new Country().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.put('/currency', function (req, res: any) {
    new Currency().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.put('/paymentTerm', function (req, res: any) {
    new PaymentTerm().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.put('/importType', function (req, res: any) {
    new ImportType().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.put('/importTypeReferencedTable', function (req, res: any) {
    new ImportTypeReferencedTable().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.put('/importTypeConstant', function (req, res: any) {
    new ImportTypeConstant().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

router.put('/company', function (req, res: any) {
    new Company().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})


router.put('/taxCode', function (req, res: any) {
    new TaxCode().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})


router.put('/user', function (req, res: any) {
    console.log( req.body);
    new User().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})


router.put('/batchProcess', function (req, res: any) {
    new BatchProcess().updateData(getPUTParams(req)).then(result => res.send(result)).catch(err => {
        res.promise(Promise.reject(err))
    });
})

module.exports = router;
