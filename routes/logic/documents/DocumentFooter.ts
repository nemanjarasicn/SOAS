import {DocumentData, DocumentName, TextStack} from "./DocumentData";
import {formatCostAmount} from "./DocumentNumberFormat";

function getSeparationLines(): Object {
    return {
        canvas: [
            {
                type: 'line',
                x1: 40, y1: -77,
                x2: 550, y2: -77
            },
            {
                type: 'line',
                x1: 335, y1: -46,
                x2: 550, y2: -46
            },
            {
                type: 'line',
                x1: 335, y1: 0,
                x2: 550, y2: 0
            }
        ]
    };
}

function getFooterMeta(docData: DocumentData): TextStack[]{
    const paymentTerm = docData.avis.getDataValue('PAYMENT_TERM_ID');
    const deliveryMethod = docData.avis.getDataValue('DELIVERY_METHOD');
    let metaInfo: TextStack[] = [];

    if(paymentTerm)
        metaInfo.push({text: 'Zahlungsbedingung: ' + paymentTerm, style: 'bold', lineHeight: 1.25, margin: [0, 2, 0, 0]});
    if(deliveryMethod)
        metaInfo.push({text: 'Lieferbedingung: ' + deliveryMethod, style: 'bold', lineHeight: 1.25});

    metaInfo.push({text: 'Es gelten unsere allgemeinen Geschäftsbedingungen', style: 'smaller'});
    // todo implement skonto texts
    // {text: 'Zahlbar bis 17.11.2019 - 3.000% Skonto - Skontobetrag 0,32 € - Endbetrag 10,32 €\n18.11.2019 - 07.12.2019 netto ohne Abzug\n- 2% ZR -', fontSize: 7.5, lineHeight: 1.1, margin: [0,5,0,0]}

    return metaInfo;
}

// TODO not done yet
function getFooterTotals(docData: DocumentData): any[]{
    const currencySymbol = docData.avis.getDataValue('Currency').getDataValue('CURRENCY_SYMBOL');
    let totalsBody = [];
    if(docData.avisName === DocumentName.INVOICE || docData.avisName === DocumentName.ORDER){
        const subtotalNet = docData.avisName === DocumentName.INVOICE ?
            formatCostAmount(docData.avis.getDataValue('INVOICE_AMOUNT_NET'), currencySymbol) :
            formatCostAmount(docData.avis.getDataValue('ORDERAMOUNT_NET'), currencySymbol);
        const taxAmount = formatCostAmount(docData.avis.getDataValue('TAX_AMOUNT'), currencySymbol);
        const subtotalBru = docData.avisName === DocumentName.INVOICE ?
            formatCostAmount(docData.avis.getDataValue('INVOICE_AMOUNT_BRU'), currencySymbol) :
            formatCostAmount(docData.avis.getDataValue('ORDERAMOUNT_BRU'), currencySymbol);
        const shippingCost = formatCostAmount(docData.avis.getDataValue('SHIPPING_COST'), currencySymbol);
    }
    return totalsBody;
}

function getTotalsMetaBlock(docData: DocumentData): Object{
    return {
        columns: [
            {
                width: 'auto',
                stack: getFooterMeta(docData)
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
                    widths: [130, 80],
                    body: [
                        ['Zwischensumme Brutto', {text: '1.234,34 €', style: 'prices_table'}],
                        ['Steuerbetrag', {text: '321,56 €', style: 'prices_table'}],
                        ['', ''],
                        [{text: 'Zwischensumme Netto', style: 'bold'}, {text: '1.556,90 €', style: 'prices_table_bold'}],
                        ['Fracht / Versand', {text: '-', style: 'prices_table'}],
                        ['Rabatt', {text: '-', style: 'prices_table'}],
                        ['', ''],
                        [{text: 'Summe', style: 'total_sum'}, {text: '1.556,90 €', style: 'total_sum_value'}],
                        [{text: 'MwSt: 19%', fontSize: 9}, {text: '', style: 'prices_table', fontSize: 9}]
                    ]
                }
            }
        ],
        margin: [40, -75]
    };
}

export function getFooter(isLastPage: boolean, docData: DocumentData): Object[]{
    const margins = [40, isLastPage ? 85 : 40];

    const separationLines = getSeparationLines();
    const totalsMetaBlock = getTotalsMetaBlock(docData);

    let footerData = [];
    if(isLastPage){
        footerData.push(separationLines);
        footerData.push(totalsMetaBlock);
    }
    footerData.push({
        columns: [
            {
                width: '25%',
                text: `Address
                            Emotion Warenhandels GmbH
                            Bordeaux Str. 3
                            28309 Bremen
                            Germany`,
                style: 'smaller'
            },
            {
                width: '25%',
                text: `Contact
                            Tel: 020 - 34 99 50 19
                            Email: contact@emotion-24.co.uk
                            Internet: www.emotion-24.co.uk
                            Management
                            Dominik Entelmann`,
                style: 'smaller'
            },
            {
                width: '25%',
                text: `HRB24827HB 
                            Local Court Bremen
                            VAT number: DE260254947
                            E-waste Regulation:
                            WEEE-Reg.-Nr. DE 26323008
                            Packaging ordinance:
                            Zentek-Vertrags Nr.: 03051
                            Registrierungs Nr.: DE4956329119597-V`,
                style: 'smaller'
            },
            {
                width: '25%',
                text: `Bank details
                            Commerzbank Bremen
                            IBAN: DE61290400900103483400
                            BIC: COBADEFFXXX`,
                style: 'smaller'
            },
        ], margin: margins
    });

    return footerData;
}
