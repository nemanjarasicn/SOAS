import {getDataByPk, ModelEnum} from "../models/Helper";
import {SequelizeModel} from "../constants/constants";
import {TaxCode} from "../models/TaxCode";
import {OrderPosition} from "../models/OrderPosition";
import {Currency} from "../models/Currency";

// interfaces and enums TODO refactor those into their own files
export enum DocumentName{
    ORDER = 'Auftragsbestätigung',
    DELIVERY_NOTE = 'Lieferschein',
    INVOICE = 'Rechnung'
}
export interface DocumentData{
    avisName: DocumentName,
    avis: SequelizeModel,
    positionModel: string,
    customerFirst?: SequelizeModel,
    customerSecond?: SequelizeModel,
    customerOrder?: SequelizeModel,
    relatedOrder?: SequelizeModel,
    relatedDeliveryNote?: SequelizeModel
}
export interface DocumentDataTyping{
    avisName: DocumentName,
    avisModel: ModelEnum,
    customerDeliveryKey?: string,
    customerInvoiceKey?: string,
    relatedOrderKey?: string,
    relatedDeliveryNoteKey?: string
}
export interface TextStack{
    text?: string,
    style?: string,
    lineHeight?: number,
    margin?: number[],
    fontSize?: number,
    stack?: TextStack[]
}


function selectModel(avisNumber: string): DocumentDataTyping{
    let ddt: DocumentDataTyping = {
        avisName: undefined,
        avisModel: undefined,
        customerDeliveryKey: undefined,
        customerInvoiceKey: undefined
    };

    if(avisNumber.includes('RG')){
        ddt.avisName = DocumentName.INVOICE; // TODO translate it
        ddt.avisModel = ModelEnum.Invoice;
        ddt.customerInvoiceKey = 'INVOICES_CUSTOMER'; // TODO enum it
        ddt.relatedDeliveryNoteKey = 'DELIVERY_NOTES_NUMBER';
        ddt.relatedOrderKey = 'ORDERS_NUMBER';
    } else if(avisNumber.includes('LI')){
        ddt.avisName = DocumentName.DELIVERY_NOTE;
        ddt.avisModel = ModelEnum.DeliveryNote;
        ddt.customerDeliveryKey = 'CUSTOMERS_NUMBER';
        ddt.relatedOrderKey = 'ORDERS_NUMBER';
    } else if(avisNumber.includes('AU')){
        ddt.avisName = DocumentName.ORDER;
        ddt.avisModel = ModelEnum.Order;
        ddt.customerDeliveryKey = 'CUSTOMER_DELIVERY';
        ddt.customerInvoiceKey = 'CUSTOMER_INVOICE';
    } else throw new Error('Model type is not defined. Extend this method to provide a correct model type');

    return ddt;
}

export function selectPositionModel(model: ModelEnum): string{
    let positionModel = 'OrderPosition';
    if(model === ModelEnum.DeliveryNote) positionModel = 'DeliveryPosition';
    else if(model === ModelEnum.Invoice) positionModel = 'InvoicePosition';

    return positionModel;
}

export async function getDocumentData(avisNumber: string): Promise<DocumentData>{

    let type: DocumentDataTyping = selectModel(avisNumber);
    let positionModel = selectPositionModel(type.avisModel);

    const avisData = await getDataByPk(type.avisModel, avisNumber, [
        {model: 'TaxCode'},
        {model: 'Currency'},
        {model: positionModel}
    ]);

    let customerDelivery: SequelizeModel;
    let customerInvoice: SequelizeModel;
    let relatedOrder: SequelizeModel;
    let relatedDeliveryNote: SequelizeModel;

    if(type.customerDeliveryKey){
        customerDelivery = await getDataByPk(ModelEnum.Customer, avisData.getDataValue(type.customerDeliveryKey), [
            {model: 'CustomerAddress', where: {ADDRESS_TYPE: 'DLV'}},
            {model: 'Language'}
        ]);
    }

    if(type.customerInvoiceKey){
        customerInvoice = await getDataByPk(ModelEnum.Customer, avisData.getDataValue(type.customerInvoiceKey), [
            {model: 'CustomerAddress', where: {ADDRESS_TYPE: 'INV'}},
            {model: 'Language'}
        ]);
    }

    if(type.relatedOrderKey)
        relatedOrder = await getDataByPk(ModelEnum.Order, avisData.getDataValue(type.relatedOrderKey));
    if(type.relatedDeliveryNoteKey)
        relatedDeliveryNote = await getDataByPk(ModelEnum.DeliveryNote, avisData.getDataValue(type.relatedDeliveryNoteKey));

    let customerFirst = (type.avisModel === ModelEnum.Order || type.avisModel === ModelEnum.DeliveryNote) ?
        customerDelivery : customerInvoice;
    let customerSecond = (type.avisModel === ModelEnum.Order || type.avisModel === ModelEnum.DeliveryNote) ?
        customerInvoice : customerDelivery;
    let customerOrder = type.avisModel === ModelEnum.Order ?
        await getDataByPk(ModelEnum.Customer, avisData.getDataValue('CUSTOMER_ORDER')) : undefined;

    return {
        avisName: type.avisName,
        avis: avisData,
        positionModel: `${positionModel}s`, // plural is needed...
        customerFirst: customerFirst,
        customerSecond: customerSecond,
        customerOrder: customerOrder,
        relatedOrder: relatedOrder,
        relatedDeliveryNote: relatedDeliveryNote
    }
}



