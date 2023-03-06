import path from "path";
import {SequelizeModel} from "../constants/constants";
import {DocumentData, DocumentName, TextStack} from "./DocumentData";

function getCompanyDetails(): Object{
    const imagePath = path.join(__dirname, 'documentImages', 'EMOTION_Logo_Grau-Orange.png');
    return {
        columns: [
            {
                width: 'auto',
                text: '\n\nBeautiful company header with underline',
                style: 'underlined'
            },
            {
                width: '*',
                text: ''
            },
            {
                width: 200,
                image: imagePath,
                fit: [200, 100]
            }
        ], margin: [40, 40, 40, 20]
    };
}

function getDocumentType(documentName: string): Object{
    return {text: documentName, margin: [40, 5, 120, 5], fontSize: 15, alignment: 'right', bold: true};
}

function parseDate(date: Date): string{
    const d = new Date(date);
    // TODO the date representation might be different in other countries, so 'translate' it
    // default dd.MM.yyyy is used
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

function getAddressBlock(customer: SequelizeModel): TextStack[]{
    console.log(customer.getDataValue('Language'));
    let addressBlock: TextStack[] = [];
    if(customer.getDataValue('CustomerAddresses')[0]){
        const addressType = customer.getDataValue('CustomerAddresses')[0].getDataValue('ADDRESS_TYPE');
        const isoCode = customer.getDataValue('CustomerAddresses')[0].getDataValue('ADDRESS_ISO_CODE');
        const postCode = customer.getDataValue('CustomerAddresses')[0].getDataValue('ADDRESS_POSTCODE');
        const city = customer.getDataValue('CustomerAddresses')[0].getDataValue('ADDRESS_CITY');

        // TODO translate it
        addressBlock.push({text: addressType === 'INV' ? 'Rechnungsadresse' : 'Lieferadresse', style: 'bold'});
        addressBlock.push({text: customer.getDataValue('CUSTOMERS_COMPANY')});
        addressBlock.push(
            {text: customer.getDataValue('CustomerAddresses')[0].getDataValue('ADDRESS_STREET')});
        addressBlock.push({text: `${isoCode} ${postCode} ${city}`});
    }
    return addressBlock;
}

function getDocumentSpec(docData: DocumentData): [string[]]{
    let documentSpec: [string[]] = [[]];
    if(docData.avisName === DocumentName.ORDER){
        documentSpec[0] = ['Auftrag', docData.avis.getDataValue('ORDERS_NUMBER')];
        documentSpec.push(['Bestelldatum', parseDate(docData.avis.getDataValue('ORDERS_DATE'))]);
        documentSpec.push(['Kundennummer', docData.avis.getDataValue('CUSTOMER_ORDER')]);
        documentSpec.push(['Steuer ID', docData.customerOrder.getDataValue('EEC_NUM')]);
    }else if(docData.avisName === DocumentName.DELIVERY_NOTE){
        documentSpec[0] = ['Lieferschein', docData.avis.getDataValue('DELIVERY_NOTES_NUMBER')];
        documentSpec.push(['Lieferdatum', parseDate(docData.avis.getDataValue('SHIPPING_DATE'))]);
        documentSpec.push(['Kundennummer', docData.avis.getDataValue('CUSTOMERS_NUMBER')]);
        documentSpec.push(['Steuer ID', docData.customerFirst.getDataValue('EEC_NUM')]);
    }else if(docData.avisName === DocumentName.INVOICE){
        documentSpec[0] = ['Rechnung', docData.avis.getDataValue('INVOICES_NUMBER')];
        documentSpec.push(['Rechnungsdatum', parseDate(docData.avis.getDataValue('INVOICES_DATE'))]);
        documentSpec.push(['Kundennummer', docData.avis.getDataValue('INVOICES_CUSTOMER')]);
        documentSpec.push(['Steuer ID', docData.customerFirst.getDataValue('EEC_NUM')]);
    }
    return documentSpec;
}

function getRelatedDocumentData(docData: DocumentData): any[]{
    let relatedDocs = [];
    if(docData.avisName === DocumentName.ORDER){
        relatedDocs.push([{text: 'Auftragsreferenz', style: 'document_meta_description'},
            docData.avis.getDataValue('CUSTOMER_ORDERREF')]);
    }else if(docData.avisName === DocumentName.DELIVERY_NOTE){
        relatedDocs.push([{text: 'Auftrag', style: 'document_meta_description'},
            docData.avis.getDataValue('ORDERS_NUMBER')]);
        if(docData.relatedOrder){
            relatedDocs.push([{text: 'Auftragsreferenz', style: 'document_meta_description'},
                docData.relatedOrder.getDataValue('CUSTOMER_ORDERREF')]);
            relatedDocs.push([{text: 'Bestelldatum', style: 'document_meta_description'},
                parseDate(docData.relatedOrder.getDataValue('ORDERS_DATE'))]);
            relatedDocs.push([{text: 'Anzahl Pakete', style: 'docment_meta_description'},
                docData.relatedOrder.getDataValue('PAC_QTY')]);
        }
        // TODO we don't have a database field for tracking numbers yet
        relatedDocs.push([{text: 'Paketnummern', style: 'document_meta_description'},
            docData.avis.getDataValue('TRACKING_NVE')]);
    }else if(docData.avisName === DocumentName.INVOICE){
        relatedDocs.push([{text: 'Auftrag', style: 'document_meta_description'},
            docData.avis.getDataValue('ORDERS_NUMBER')]);
        relatedDocs.push([{text: 'Lieferschein', style: 'document_meta_description'},
            docData.avis.getDataValue('DELIVERY_NOTES_NUMBER')]);
        if(docData.relatedOrder){
            relatedDocs.push([{text: 'Bestelldatum', style: 'document_meta_description'},
                docData.relatedOrder.getDataValue('ORDERS_DATE')]);
        }
        if(docData.relatedDeliveryNote){
            relatedDocs.push([{text: 'Lieferdatum', style: 'document_meta_description'},
                docData.relatedDeliveryNote.getDataValue('SHIPPING_DATE')]);
            relatedDocs.push([{text: 'Paketnummern', style: 'document_meta_description'},
                docData.relatedDeliveryNote.getDataValue('TRACKING_NVE')]);
        }
    }

    // hacky way of adding empty space to the table since the document height is calculated with this
    const curLength = relatedDocs.length;
    // make sure to have one whitespace here, otherwise it would be discarded
    for(let i = curLength; i < 5; i++) relatedDocs.push([' ', '']);

    return relatedDocs;
}

function getAddressAndDocumentSpecRow(docData: DocumentData): Object{
    let firstAddress: TextStack[] = getAddressBlock(docData.customerFirst);
    let docSpec: [string[]] = getDocumentSpec(docData);
    console.log(docSpec);
    return {
        columns: [
            {
                width: 'auto',
                stack: firstAddress
            },
            {
                width: '*',
                text: ''
            },
            {
                width: 'auto',
                table: {
                    headerRows: 0,
                    widths: ['auto'],
                    body: [
                        [
                            {
                                layout: 'noBorders',
                                table: {
                                    headerRows: 0,
                                    widths: ['auto', 'auto'],
                                    body: docSpec
                                }
                            }
                        ]
                    ]
                }
            }
        ], margin: [40, 0, 40, 10]
    };
}

function getAddressAndRelatedDocumentsRow(docData: DocumentData){
    let addressBlock: TextStack[] = getAddressBlock(docData.customerSecond);
    let relatedDocumentData: TextStack[] = getRelatedDocumentData(docData);
    return {
        columns: [
            {
                width: 'auto',
                stack: addressBlock
            },
            {
                width: '*',
                text: ''
            },
            {
                width: 'auto',
                layout: 'noBorders',
                table: {
                    headerRows: 0,
                    widths: ['auto', 'auto'],
                    body: relatedDocumentData
                }
            }
        ], margin: [40, 0, 40, 10]
    };
}

function getPagination(currentPage: number, pageCount: number){
    return {text: `Seite ${currentPage} von ${pageCount}`, alignment: 'left', margin: [45, 0, 40, 0]};
}

export function getHeader(currentPage: number, pageCount: number, docData: DocumentData): Object[]{

    const companyDetails = getCompanyDetails();
    const documentType = getDocumentType(docData.avisName);

    const addressAndDocSpec = getAddressAndDocumentSpecRow(docData);
    const addressAndRelatedDocs = getAddressAndRelatedDocumentsRow(docData);
    const pagination = getPagination(currentPage, pageCount);
    return [
        companyDetails,
        documentType,
        addressAndDocSpec,
        addressAndRelatedDocs,
        pagination
    ];
}
