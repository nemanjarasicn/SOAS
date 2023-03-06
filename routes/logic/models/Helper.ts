import {constants, SequelizeModel, SequelizeModelStatic} from "../constants/constants";
import {Model, Op, Includeable} from "sequelize";
import {IGetParams, IPostParams, IPutParams} from "./SoasModel";
import {Provider} from "./Provider";
import {Currency} from "./Currency";
import {WarehouseLoc} from "./WarehouseLoc";
import {Language} from "./Language";
import {Country} from "./Country";
import {ProdUnit} from "./ProdUnit";
import {Warehousing} from "./Warehousing";
import {DistComponent} from "./DistComponent";
import {Article} from "./Article";
import {CrossSelling} from "./CrossSelling";
import {Attribute} from "./Attribute";
import {Customer} from "./Customer";
import {CustomerAddress} from "./CustomerAddress";
import {Order} from "./Order";
import {OrderPosition} from "./OrderPosition";
import {TaxCode} from "./TaxCode";
import {AttributeName} from "./AttributeName";
import {BatchProcess} from "./BatchProcess";
import {Company} from "./Company";
import {CompanyLocation} from "./CompanyLocation";
import {ImportTemplate} from "./ImportTemplate";
import {FormTemplate} from "./FormTemplate";
import {DeliveryNotePosition} from "./DeliveryNotePosition";
import {DeliveryNote} from "./DeliveryNote";
import {TableTemplate} from "./TableTemplate";
import {ImportType} from "./ImportType";
import {ImportTypeReferencedTable} from "./ImportTypeReferencedTable";
import {ImportTypeConstant} from "./ImportTypeConstant";
import {Invoice} from "./Invoice";
import {InvoicePosition} from "./InvoicePosition";
import {ReCreditingPosition} from "./ReCreditingPosition";
import {ReCrediting} from "./ReCrediting";
import {SaleOfferPosition} from "./SaleOfferPosition";
import {SaleOffer} from "./SaleOffer";
import {SupplyOrder} from "./SupplyOrder";
import {SupplyOrderPosition} from "./SupplyOrderPosition";
import {ItemLock} from "./ItemLock";
import {TableLock} from "./TableLock";
import {PaymentTerm} from "./PaymentTerm";
import {LocalizeIt} from "./LocalizeIt";
import {ItmVariant} from "./ItmVariant";
import {PurchaseOrder} from "./PurchaseOrder";
import {ProdComponent} from "./ProdComponent";
import {Prilist} from "./Prilist";
import {TaxationRelation} from "./TaxationRelation";
import {TaxRate} from "./TaxRate";
import {State} from "./State";
import {Role} from "./Role";
import {WarehouseReservationCache} from "./WarehouseReservationCache";
import {User} from "./User";
import {Comment} from "./Comment";
import {WhereOptions} from "sequelize/types/model";

export enum ModelEnum {
    'Article' = 'Article',
    'Attribute' = 'Attribute',
    'AttributeName' ='AttributeName',
    // 'AttributeRelation' = 'AttributeRelation',
    'BatchProcess' = 'BatchProcess',
    'Comment' = 'Comment',
    'Company' = 'Company',
    'CompanyLocation' = 'CompanyLocation',
    'Country' = 'Country',
    'CrossSelling' = 'CrossSelling',
    'Currency' = 'Currency',
    'Customer' = 'Customer',
    'CustomerAddress' = 'CustomerAddress',
    'DeliveryNote' = 'DeliveryNote',
    'DeliveryNotePosition' = 'DeliveryNotePosition',
    'DistComponent' = 'DistComponent',
    'FormTemplate' = 'FormTemplate',
    'ImportTemplate' = 'ImportTemplate',
    'ImportType' = 'ImportType',
    'ImportTypeConstant' = 'ImportTypeConstant',
    'ImportTypeReferencedTable' = 'ImportTypeReferencedTable',
    'Invoice' = 'Invoice',
    'InvoicePosition' = 'InvoicePosition',
    'ItemLock' = 'ItemLock',
    'ItmVariant' = 'ItmVariant',
    'Language' = 'Language',
    'LocalizeIt' = 'LocalizeIt',
    'Order' = 'Order',
    'OrderPosition' = 'OrderPosition',
    'PaymentTerm' = 'PaymentTerm',
    'Prilist' = 'Prilist',
    'ProdComponent' = 'ProdComponent',
    'ProdUnit' = 'ProdUnit',
    'Provider' = 'Provider',
    'PurchaseOrder' = 'PurchaseOrder',
    'ReCrediting' = 'ReCrediting',
    'ReCreditingPosition' = 'ReCreditingPosition',
    'Role' = 'Role',
    'SaleOffer' = 'SaleOffer',
    'SaleOfferPosition' = 'SaleOfferPosition',
    'State' = 'State',
    'SupplyOrder' = 'SupplyOrder',
    'SupplyOrderPosition' = 'SupplyOrderPosition',
    'TableLock' = 'TableLock',
    'TableTemplate' = 'TableTemplate',
    'TaxCode' = 'TaxCode',
    'TaxRate' = 'TaxRate',
    'TaxationRelation' = 'TaxationRelation',
    'User' = 'User',
    'WarehouseLoc' = 'WarehouseLoc',
    'WarehouseReservationCache' = 'WarehouseReservationCache',
    'Warehousing' = 'Warehousing',
}

export interface IncludeModel{
    model: string,
    where?: {}
}

export function getModelByType(type: ModelEnum): SequelizeModelStatic {
    switch (type) {
        case (ModelEnum.Article):
            return Article;
        case (ModelEnum.Attribute):
            return Attribute;
        case(ModelEnum.AttributeName):
            return AttributeName;
        case (ModelEnum.BatchProcess):
            return BatchProcess;
        case (ModelEnum.Comment):
            return Comment;
        case (ModelEnum.Company):
            return Company;
        case (ModelEnum.CompanyLocation):
            return CompanyLocation;
        case(ModelEnum.Country):
            return Country;
        case (ModelEnum.CrossSelling):
            return CrossSelling;
        case (ModelEnum.Currency):
            return Currency;
        case (ModelEnum.Customer):
            return Customer;
        case (ModelEnum.CustomerAddress):
            return CustomerAddress;
        case (ModelEnum.DeliveryNote):
            return DeliveryNote;
        case (ModelEnum.DeliveryNotePosition):
            return DeliveryNotePosition;
        case ModelEnum.DistComponent:
            return DistComponent;
        case (ModelEnum.FormTemplate):
            return FormTemplate;
        case (ModelEnum.ImportTemplate):
            return ImportTemplate;
        case (ModelEnum.ImportType):
            return ImportType;
        case (ModelEnum.ImportTypeConstant):
            return ImportTypeConstant;
        case (ModelEnum.ImportTypeReferencedTable):
            return ImportTypeReferencedTable;
        case (ModelEnum.Invoice):
            return Invoice;
        case (ModelEnum.InvoicePosition):
            return InvoicePosition;
        case (ModelEnum.ItemLock):
            return ItemLock;
        case (ModelEnum.ItmVariant):
            return ItmVariant;
        case (ModelEnum.Language):
            return Language;
        case (ModelEnum.LocalizeIt):
            return LocalizeIt;
        case (ModelEnum.Order) :
            return Order;
        case (ModelEnum.OrderPosition) :
            return OrderPosition;
        case (ModelEnum.PaymentTerm):
            return PaymentTerm;
        case (ModelEnum.Prilist):
            return Prilist;
        case (ModelEnum.ProdComponent):
            return ProdComponent;
        case (ModelEnum.ProdUnit):
            return ProdUnit;
        case (ModelEnum.Provider):
            return Provider;
        case (ModelEnum.PurchaseOrder):
            return PurchaseOrder;
        case (ModelEnum.ReCrediting):
            return ReCrediting;
        case (ModelEnum.ReCreditingPosition):
            return ReCreditingPosition;
        case (ModelEnum.Role):
            return Role;
        case (ModelEnum.SaleOffer):
            return SaleOffer;
        case (ModelEnum.SaleOfferPosition):
            return SaleOfferPosition;
        case (ModelEnum.State):
            return State;
        case (ModelEnum.SupplyOrder):
            return SupplyOrder;
        case (ModelEnum.SupplyOrderPosition):
            return SupplyOrderPosition;
        case (ModelEnum.TableLock):
            return TableLock;
        case (ModelEnum.TableTemplate):
            return TableTemplate;
        case (ModelEnum.TaxCode) :
            return TaxCode;
        case (ModelEnum.TaxRate) :
            return TaxRate;
        case (ModelEnum.TaxationRelation) :
            return TaxationRelation;
        case (ModelEnum.User):
            return User;
        case (ModelEnum.WarehouseLoc):
            return WarehouseLoc;
        case (ModelEnum.WarehouseReservationCache):
            return WarehouseReservationCache;
        case (ModelEnum.Warehousing):
            return Warehousing;
        default:
            console.warn(type + ' was not found! Extend getModelByType() with new case for this type!');
            return undefined;
    }
}

function getStaticModel(modelName: string, optionsData?: { model: string; include?: { model: string; }; }):
    SequelizeModelStatic | {} {
    switch (modelName) {
        case ('Attribute') :
            return Attribute;
        case ('CrossSelling') :
            return CrossSelling;
        case ('Currency') :
            return Currency;
        case ('Customer') :
            return Customer;
        case ('CustomerAddress') :
            return CustomerAddress;
        case ('DeliveryNote') :
            return DeliveryNote;
        case ('InvoicePosition') :
            return InvoicePosition;
        case ('Order') :
            return Order;
        case ('OrderPosition') :
            return OrderPosition;
        case ('SaleOffer') :
            return SaleOffer;
        case ('SaleOfferPosition') :
            return SaleOfferPosition;
        case ('SupplyOrder') :
            return SupplyOrder;
        case ('SupplyOrderPosition') :
            return SupplyOrderPosition;
        case ('TaxCode') :
            return TaxCode;
        case ('Language'):
            return Language;
        default:
            console.warn(modelName + ' was not found! Extend getStaticModel() with new case for this model!');
            return undefined;
    }
}

function getIncludeOptions(options: [] | { model: string; where?: {}, include?: { model: string; }; }[]): any[] {
    let includeOptions = [];
    for (let opItem in options) {
        if (options[opItem]['model']) {

            let obj = {
                model: getStaticModel(options[opItem]['model']),
                include: options[opItem]['include'],
                where: options[opItem]['where']
            };

            // remove undefined fields to avoid sequelize errors
            Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : {});

            includeOptions.push(obj);
        }
    }
    return includeOptions;
}

/**
 * return model column names as string separated by ,
 */
export function getModelColumnNames(modelType: SequelizeModelStatic): string {
    let columnNames: string = '';
    for (let key in Object.keys(modelType.getAttributes())) {
        columnNames += Object.keys(modelType.getAttributes())[key] + ',';
    }
    return columnNames.substr(0, columnNames.length - 1); // remove last ,
}

/**
 * returns model attributes as string array
 */
export function getModelAttributes(modelType: SequelizeModelStatic): string[] {
    return Object.keys(modelType.getAttributes());
}

/**
 * returns options for the find function for given search column(s) and text
 *
 * @param esc - exact search columns | example: 'column1,column2'
 * @param est - exact  search text | example: 'value1,value2
 */
export function getExactSearchByOptions(esc: string, est: string): WhereOptions<any>{

    const splitColumns: string[] = esc.split(',')
    const splitValues: string[] = est.split(',')
    let arrayOptions = []

    for (let i = 0; i < splitColumns.length; i++) {
        arrayOptions.push({[splitColumns[i]]: {[Op.eq]: `${splitValues[i]}`}})
    }

    return {[Op.and] : arrayOptions}
}

/**
 * returns options for the find function for given search column(s) and text
 *
 * @param sc - search columns | example: 'column1,column2'
 * @param st - search text
 */
export function getSearchByOptions(sc?: string, st?: string): WhereOptions<any> | undefined {
    if (sc && st) {
        const splitOptions: string[] = sc.split(',')
        let arrayOptions = []

        for (let item in splitOptions) {
            if (splitOptions.hasOwnProperty(item)) {
                let object = {}
                object[splitOptions[item]] = {[Op.like]: `%${st}%`}
                arrayOptions.push(object)
            }
        }

        return {[Op.or] : arrayOptions}
    }

    return undefined
}

/**
 * shorthand function, that always returns a Model by pk
 * include options are allowed too
 * @author Ronny Brandt <r.brandt@emotion-24.de>
 * @param type
 * @param primaryKey
 * @param includeOptions
 */
export async function getDataByPk(type: ModelEnum, primaryKey: string, includeOptions?: IncludeModel[]): Promise<SequelizeModel>{
    const modelType: SequelizeModelStatic = getModelByType(type);

    let res : SequelizeModel;

    const include = getIncludeOptions(includeOptions);

    await modelType.findByPk(primaryKey, {include})
        .then(result => {res = result;})
        .catch(err => {throw err});

    return res;
}

/**
 * load data from db by select query
 *
 * @param type
 * @param params
 */
export async function getData(type: ModelEnum, params: IGetParams):
    Promise<SequelizeModel[] | { table: [string, SequelizeModel[]]; maxRows: number; page: number }> {

    console.log(params.options);

    const modelType: SequelizeModelStatic = getModelByType(type);
    const columnNames: string = getModelColumnNames(modelType);
    const include = getIncludeOptions(params.options);
    let results: SequelizeModel[] | { table: [string, SequelizeModel[]], maxRows: number, page: number };

    if (params.primaryKey) {
        await modelType.findByPk(String(params.primaryKey), {include}).then(result => {
            results = result ? [result.get()] : results;
        });
    } else {
        let where: WhereOptions<any> | undefined;

        if (params?.exactSearchColumn && params?.exactSearchText) {
            where = getExactSearchByOptions(params.exactSearchColumn, params.exactSearchText);
        }

        if (params?.searchColumn && params?.searchText) {
            where = {
                ...where,
                ...getSearchByOptions(params.searchColumn, params.searchText)
            }
        }

        results = {
            table: [
                columnNames,
                await modelType.findAll({
                    include,
                    where,
                    order: params?.sortColumn && params?.sortDirection ? [[params.sortColumn, params.sortDirection]] : undefined,
                    limit: params.size,
                    offset: (params?.page || 0) * params.size
                })
            ],
            maxRows: await modelType.count(),
            page: params.page
        }
    }

    return results;
}

/**
 * save data to db by create or update query
 *
 * @param type
 * @param postParams
 */
export async function setData(type: ModelEnum, postParams: IPostParams) {
    const modelType: SequelizeModelStatic = getModelByType(type)
    return await (modelType).create(postParams.data)
}

/**
 * save data to db by update query
 *
 * @param type
 * @param putParams
 */
export async function updateData(type: ModelEnum, putParams: IPutParams) {
    const modelType: SequelizeModelStatic = getModelByType(type)
    const sequelizeData = await modelType.findByPk(String(putParams.primaryKey)).catch((error) => {throw new Error(error)})

    if (!sequelizeData) {throw new Error('No record found for primaryKey: ' + putParams.primaryKey)}

    return sequelizeData.update(putParams.data).catch((error) => {throw new Error(error)})
}

/**
 * helper function to get parameters from GET request
 *
 * @param req
 */
export function getGETParams(req): IGetParams {
    console.log('req-query-params: ', req.query);
    const primaryKey = req.query.pk;
    const searchColumn = req.query.searchColumn as string; // if many so separated by ,
    const searchText = req.query.searchText as string;
    const exactSearchColumn = req.query.exactSearchColumn as string; // if many so separated by ,
    const exactSearchText = req.query.exactSearchText as string;
    const page = req.query.page ? parseInt(req.query.page as string) : constants.QUERY_PAGE_DEFAULT;
    const size = req.query.size ? parseInt(req.query.size as string) : constants.QUERY_SIZE_DEFAULT;
    const sortColumn = req.query.sortColumn as string;
    const sortDirection = req.query.sortDirection as string;
    console.log('req.query.modelOptions: ', req.query.modelOptions);
    const options = req.query.modelOptions ? JSON.parse(req.query.modelOptions) : undefined;
    return {primaryKey, searchColumn, searchText, exactSearchText, exactSearchColumn, page, size, sortColumn, sortDirection, options};
}

/**
 * helper function to get parameters from POST request
 *
 * @param req
 */
export function getPOSTParams(req): IPostParams {
    const data = req.body?.data ? JSON.parse(req.body.data) : undefined;
    const insertTogetherData = req.body?.insertTogetherData ? JSON.parse(req.body.insertTogetherData) : undefined;
    return {
        data,
        insertTogetherData
    }
}

/**
 * helper function to get parameters from POST request
 *
 * @param req
 */
export function getPUTParams(req): IPutParams {
    const primaryKey = req.body.pk;
    const data = JSON.parse(req.body.data)

    return {
        primaryKey,
        data
    }
}
