import fs = require('fs');
import path = require('path');
import {constants} from './constants/constants';

let fontsServer = {
    FontAwesome: {
        normal: path.join(__dirname, '..', '/logic/', '/fonts/fontawesome-free-5.11.2-web/webfonts/fa-solid-900.ttf'),
    },
    Roboto: {
        normal: path.join(__dirname, '..', '/logic/', '/fonts/Lato2OFL/Lato-Regular.ttf'),
        bold: path.join(__dirname, '..', '/logic/', '/fonts/Lato2OFL/Lato-Bold.ttf'),
        italics: path.join(__dirname, '..', '/logic/', '/fonts/Lato2OFL/Lato-Italic.ttf'),
        bolditalics: path.join(__dirname, '..', '/logic/', '/fonts/Lato2OFL/Lato-BoldItalic.ttf')
    },
};
let fontsClient = {
    FontAwesome: {
        normal: 'fa-solid-900.ttf',
    },
    Roboto: {
        normal: 'Lato-Regular.ttf',
        bold: 'Lato-Bold.ttf',
        italics: 'Lato-Italic.ttf',
        bolditalics: 'Lato-BoldItalic.ttf'
    }
};
let PdfPrinter = require('../../node_modules/pdfmake/src/printer');

const fontSizeOffset = 0;

module.exports = {

    generatePDFText: function (refTable: any, delivery_notes_number: any, invoice_number: any, data: any, shouldCallbackData: any, callback: any) {

        let addrData = data['addrData'];
        let tableData = data['tableData'];
        let invoiceSummeNet = data['invoiceSummeNet'];
        let invoiceSummeBru = data['invoiceSummeBru'];
        let deliveryNoteWeightSumme = data['deliveryNoteWeightSumme'];

        let pdfFileName: any;
        let pdfFilePath = constants.tempPdfFilePath; // tempPdfFileBasePath
        if (refTable == 'deliveryNote') {
            pdfFileName = delivery_notes_number;
            //pdfFilePath = constants.PDF_FILE_FULL_PATH_DELIVERY_NOTES;
        } else if (refTable == 'invoice') {
            pdfFileName = invoice_number;
            // pdfFilePath = constants.PDF_FILE_FULL_PATH_INVOICES;
        }
        pdfFileName = pdfFileName + '.pdf';

        let docTitle: any;
        let devInvDetails: any;
        let tableWidths;
        let footerWeightText;
        let invoiceSummeText;
        let docDate;
        let tableAndSummeSeparator = "";
        let shippingAddressSeparator = "";

        // let billingAddressData = addrData['CUSTOMERS_PRENAME'] + ' ' + addrData['CUSTOMERS_NAME'] + ' \n ' +
        //     addrData['ADDR_STREET_DLV'] + ' \n ' +
        //     addrData['ADDR_CITY_DLV'] + ' ' + addrData['ADDR_POSTCODE_DLV'];
        //
        // let shippingAddressData = addrData['CUSTOMERS_NAME'] + ' \n ' + addrData['ADDR_STREET_INV'] + ' \n ' +
        //     addrData['ADDR_CITY_INV'] + ' ' + addrData['ADDR_POSTCODE_INV'];

        let shippingAddressDataPartOne: any;
        let shippingAddressDataParTwo: any;

        let phone = addrData['CUSTOMERS_PHONE'] != null ?  addrData['CUSTOMERS_PHONE'] : '';
        let billingAddressData = addrData['CUSTOMERS_PRENAME'] + ' ' + addrData['CUSTOMERS_NAME'] + ' \n ' + addrData['ADDR_STREET_INV'] + ' \n ' +
            addrData['ADDR_CITY_INV'] + ' ' + addrData['ADDR_POSTCODE_INV'] + ' \n\n\n\n ' + 'Phone:  ' + phone;

        if (refTable == 'deliveryNote') {
            docTitle = 'Delivery Note';
            docDate = addrData['SHIPPING_DATE'];
            tableWidths = [40, 180, 180, 80];
            footerWeightText = ['total weight (kg): ', {text: deliveryNoteWeightSumme, fontSize: 9, bold: true}];
            invoiceSummeText = '';
            devInvDetails = getDevInvDetails(refTable,
                [{name: 'delivery number:', value: addrData['DELIVERY_NOTES_NUMBER']},
                    {name: 'Date:', value: docDate},
                    {name: 'Customer Number:', value: addrData['CUSTOMER_ORDER']}]);
            shippingAddressSeparator = '\n\n';
            // Billing To
            shippingAddressDataPartOne = {columns: [{
                            text: 'Shipping Address:\n\n',
                            style: 'invoiceBillingAddressSmallMarginBottom',
                        }]};
            // Billing Address Title
            shippingAddressDataParTwo = {columns: [{
                            text: addrData['CUSTOMERS_NAME'] + ' \n ' +
                                addrData['ADDR_STREET_DLV'] + ' \n ' +
                                addrData['ADDR_CITY_DLV'] + ' ' + addrData['ADDR_POSTCODE_DLV'],
                            style: 'invoiceBillingAddress'
                        }]};
        } else if (refTable == 'invoice') {
            docTitle = 'Invoice';
            docDate = data['invoiceDate'];
            tableWidths = [40, 170, 105, 105, 60];
            footerWeightText = [' ', {text: ' ', fontSize: 9, bold: true}];
            invoiceSummeText = ['Total NET: $ ' + invoiceSummeNet +
                                '\n Total: ', {text: '$ ' + invoiceSummeBru, fontSize: 10, bold: true}];
            devInvDetails = getDevInvDetails(refTable,
                [{name: 'invoice number:', value: invoice_number},
                    {name: 'Date:', value: docDate},
                    {name: 'Customer Number:', value: addrData['CUSTOMER_ORDER']},
                    {name: 'Delivery Note Ref.:', value: addrData['DELIVERY_NOTES_NUMBER']},]);
            tableAndSummeSeparator = '\n';
            billingAddressData += '\nEmail: ' + addrData['CUSTOMERS_EMAIL'];
            shippingAddressDataPartOne = "";
            shippingAddressDataParTwo = "";
        }

        let docDefinition = {
            info: {
                title: pdfFileName,
                // author: 'john doe',
                // subject: 'subject of document',
                // keywords: 'keywords for document',
            },
            header: function (currentPage: any, pageCount: any) {
                if (currentPage == 1) {
                    return {
                        margin: [50, 10, 50, 10],
                        stack: [
                            // Billing Details
                            // Logo Image
                            '\n\n',
                            {
                                columns: [
                                    [
                                        {
                                            image: 'headerImage',
                                            style: 'invoiceImage',
                                            width: '220'
                                        }
                                    ]
                                ]
                            },
                            '\n\n\n\n',
                            {
                                columns: [
                                    [
                                        {
                                            text: 'Emotion USA Corp. . 40E Main Street . Suite 2700 . Newark . DE 19711 \n\n Billing Address: \n\n',
                                            style: 'invoiceBillingAddressSmall',
                                        },
                                        {
                                            stack: [
                                                {
                                                    text: billingAddressData,
                                                    style: 'invoiceBillingAddress',
                                                }
                                            ]
                                        }
                                    ],
                                    [
                                        {
                                            text: docTitle,
                                            style: 'invoiceTitle',
                                        },
                                        {
                                            stack: [{
                                                headerRows: 1,
                                                margin: [55, 0, 0, 0],
                                                table: {

                                                    body: [
                                                        [
                                                            {
                                                                stack: devInvDetails
                                                            }
                                                        ]
                                                    ]
                                                },
                                                layout: {
                                                    hLineColor: function (i: any, node: any) {
                                                        return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
                                                    },
                                                    vLineColor: function (i: any, node: any) {
                                                        return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                                                    },
                                                    paddingLeft: function (i: any, node: any) {
                                                        return 7;
                                                    },
                                                    paddingRight: function (i: any, node: any) {
                                                        return 7;
                                                    },
                                                    paddingTop: function (i: any, node: any) {
                                                        return 7;
                                                    },
                                                    paddingBottom: function (i: any, node: any) {
                                                        return 7;
                                                    }
                                                }
                                            }]
                                        }
                                    ],
                                ]
                            },
                            shippingAddressSeparator,
                            shippingAddressDataPartOne,
                            shippingAddressDataParTwo,
                            {
                                text: 'Seite ' + currentPage.toString() + ' von ' + pageCount,
                                style: 'pageNumberStyle'
                            }
                        ]
                    }
                }
                if (currentPage != 1) {
                    return {
                        margin: [50, 10, 50, 10],
                        stack: [
                            // Billing Details
                            // Logo Image
                            '\n\n',
                            {
                                columns: [
                                    [
                                        {
                                            text: '\n',
                                            style: 'invoiceImage',
                                            width: '220'
                                        }
                                    ]
                                ]
                            },
                            '\n\n\n\n',
                            {
                                columns: [
                                    [
                                        {
                                            text: '\n',
                                            style: 'invoiceBillingAddressSmall',
                                        },
                                        {
                                            stack: [
                                                {
                                                    text: '',
                                                    style: 'invoiceBillingAddress',
                                                }
                                            ]
                                        }
                                    ],
                                    [
                                        {
                                            text: '\n',
                                            style: 'invoiceTitle',
                                        },
                                        {
                                            stack: [{
                                                headerRows: 1,
                                                margin: [55, 0, 0, 0],
                                                table: {

                                                    body: [
                                                        [
                                                            {
                                                                stack: devInvDetails
                                                            }
                                                        ]
                                                    ]
                                                },
                                                layout: {
                                                    hLineColor: function (i: any, node: any) {
                                                        return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
                                                    },
                                                    vLineColor: function (i: any, node: any) {
                                                        return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                                                    },
                                                    paddingLeft: function (i: any, node: any) {
                                                        return 7;
                                                    },
                                                    paddingRight: function (i: any, node: any) {
                                                        return 7;
                                                    },
                                                    paddingTop: function (i: any, node: any) {
                                                        return 7;
                                                    },
                                                    paddingBottom: function (i: any, node: any) {
                                                        return 7;
                                                    }
                                                }
                                            }]
                                        }
                                    ],
                                ]
                            },
                            shippingAddressSeparator,
                            '\n\n\n\n\n\n\n',
                            '\n',
                            {
                                text: 'Seite ' + currentPage.toString() + ' von ' + pageCount,
                                style: 'pageNumberStyle'
                            }
                        ]
                    }
                }

            },
            footer: {
                margin: [50, 10, 50, 10],
                stack: [
                    {
                        text: footerWeightText,
                        style: 'documentFooterLeft'
                    },
                    {text: 'Our General Terms and Conditions apply', style: 'documentFooterLeftLast'},
                    {
                        canvas: [{
                            type: 'line',
                            x1: 0,
                            y1: 0,
                            x2: 595 - 100,
                            y2: 0,
                            lineWidth: 1,
                            margin: [0, 10, 0, 10],
                            lineColor: '#dddddd'
                        }]
                    },
                    {
                        columns: [
                            {   width: 95,
                                margin: [5, 0, 0, 0],
                                stack: [
                                    {
                                        text: ['', {text: 'Address', fontSize: 7, bold: true}],
                                        style: 'documentFooterAdressesFirstRight',
                                    },
                                    {
                                        text: 'Emotion USA Corp.',
                                        style: 'documentFooterAdresses',
                                    },
                                    {
                                        text: '40E Main Street, Suite 2700',
                                        style: 'documentFooterAdresses',
                                    },
                                    {
                                        text: 'Newark, DE 19711',
                                        style: 'documentFooterAdresses',
                                    },
                                ]
                            },
                            { width: 115,
                                stack: [
                                    {
                                        text: ['', {text: 'Contact', fontSize: 7, bold: true}],
                                        style: 'documentFooterAdressesFirstRight',
                                    },
                                    {
                                        text: ['', {text: '', font: 'FontAwesome', fontSize: 7}, ' www.emotion-bathroom.com'],
                                        style: 'documentFooterAdresses',
                                    },
                                    {
                                        text: ['', {text: '', font: 'FontAwesome', fontSize: 7}, ' contact@emotion-bathroom.com'],
                                        style: 'documentFooterAdresses',
                                    },
                                    {
                                        text: ['', {text: '', font: 'FontAwesome', fontSize: 7}, ' +18334223234'],
                                        style: 'documentFooterAdresses',
                                    }
                                ]
                            },
                            {
                                margin: [0, 10, 0, 10],
                                columns: [
                                    [
                                        {
                                            image: 'footerImage',
                                            style: 'documentFooterLogos',
                                            width: 120
                                        }
                                    ]
                                ]
                            },
                        ]
                    }
                ]
            },
            content: [
                // Items
                {
                    table: {
                        // headers are automatically repeated if the orders spans over multiple pages
                        // you can declare how many rows should be treated as headers
                        headerRows: 1,
                        widths: tableWidths,
                        body: tableData
                    }, // orders
                    layout: 'noBorders'
                },
                tableAndSummeSeparator,
                {
                    // Invoice summe
                    width: '*',
                    text: invoiceSummeText,
                    style: 'invoiceSummeRight'
                }
            ],
            images: {
                headerImage: 'data:image/jpeg;base64,' + base64_encode(path.join(__dirname, '..', '/logic/', '/img/Logo_emotion_RGB.jpg')),
                footerImage: 'data:image/png;base64,' + base64_encode(path.join(__dirname, '..', '/logic/', '/img/footer.png')),
            },
            styles: {
                // Document Header
                documentHeaderLeft: {
                    fontSize: 10,
                    margin: [5, 5, 5, 5],
                    alignment: 'left'
                },
                documentHeaderCenter: {
                    fontSize: 10,
                    margin: [5, 5, 5, 5],
                    alignment: 'center'
                },
                documentHeaderRight: {
                    fontSize: 10,
                    margin: [5, 5, 5, 5],
                    alignment: 'right'
                },
                // Document Footer
                documentFooterCenter: {
                    fontSize: 10,
                    margin: [5, 5, 5, 5],
                    alignment: 'center'
                },
                documentFooterRight: {
                    fontSize: 10,
                    margin: [5, 5, 5, 5],
                    alignment: 'right'
                },
                // Invoice Image
                invoiceImage: {
                    alignment: 'right'
                },
                // Invoice Title
                invoiceTitle: {
                    margin: [55, 0, 10, 5]
                },
                // Invoice Details
                invoiceSubTitle: {
                    fontSize: 9,
                    margin: [0, 0, 0, 5]
                },
                invoiceSubTitleLast: {
                    fontSize: 9,
                },
                invoiceSubValue: {
                    fontSize: 10,
                    alignment: 'left',
                    margin: [0, 0, 0, 5]
                },
                invoiceSubValueLast: {
                    fontSize: 10,
                    alignment: 'left'
                },
                // Billing Headers
                invoiceBillingTitle: {
                    fontSize: 14,
                    bold: true,
                    alignment: 'left',
                    margin: [0, 20, 0, 5],
                },
                // Billing Details
                invoiceBillingDetails: {
                    alignment: 'left'

                },
                invoiceBillingAddressTitle: {
                    margin: [0, 7, 0, 3],
                    bold: true
                },
                invoiceBillingAddress: {
                    fontSize: 9,
                    margin: [25, 0, 0, 0]
                },
                invoiceBillingAddressSmall: {
                    fontSize: 6,
                    margin: [25, 0, 0, 0]
                },
                invoiceBillingAddressSmallMarginBottom: {
                    fontSize: 6,
                    margin: [25, 20, 0, 0]
                },
                // Items Header
                itemsHeader: {
                    fontSize: 11,
                    margin: [0, 0, 0, 0],
                    bold: true,
                    fillColor: '#dddddd',
                },
                // Pos.
                itemPosition: {
                    margin: [0, 5, 0, 0],
                    alignment: 'center',
                    fontSize: 10
                },
                // Item Name
                itemName: {
                    margin: [0, 5, 0, 0],
                    fontSize: 10,
                    alignment: 'left',
                },
                itemNameSmall: {
                    margin: [0, 5, 0, 0],
                    fontSize: 8,
                    alignment: 'left',
                },
                itemDescription: {
                    margin: [0, 5, 0, 0],
                    fontSize: 10,
                    alignment: 'left',
                    width: '*'
                },
                itemDescriptionBold: {
                    margin: [0, 5, 0, 0],
                    fontSize: 10,
                    alignment: 'left',
                    width: '*',
                    bold: true
                },
                itemGTIN: {
                    margin: [0, 5, 0, 0],
                    alignment: 'center',
                    fontSize: 10
                },
                itemGTINSmall: {
                    margin: [0, 5, 0, 0],
                    alignment: 'center',
                    fontSize: 8
                },
                itemQuantity: {
                    margin: [0, 5, 0, 0],
                    alignment: 'center',
                    fontSize: 10
                },
                itemQuantitySmall: {
                    margin: [0, 5, 0, 0],
                    alignment: 'center',
                    fontSize: 8
                },
                itemTotal: {
                    margin: [0, 5, 0, 0],
                    bold: true,
                    alignment: 'center',
                    fontSize: 10
                },
                // Items Footer (Subtotal, Total, Tax, etc)
                itemsFooterSubTitle: {
                    margin: [0, 5, 0, 5],
                    bold: true,
                    alignment: 'right',
                },
                itemsFooterSubValue: {
                    margin: [0, 5, 0, 5],
                    bold: true,
                    alignment: 'center',
                },
                itemsFooterTotalTitle: {
                    margin: [0, 5, 0, 5],
                    bold: true,
                    alignment: 'right',
                },
                itemsFooterTotalValue: {
                    margin: [0, 5, 0, 5],
                    bold: true,
                    alignment: 'center',
                },
                signaturePlaceholder: {
                    margin: [0, 70, 0, 0],
                },
                signatureName: {
                    bold: true,
                    alignment: 'center',
                },
                signatureJobTitle: {
                    italics: true,
                    fontSize: 10,
                    alignment: 'center',
                },
                notesTitle: {
                    fontSize: 10,
                    bold: true,
                    margin: [0, 50, 0, 3],
                },
                notesText: {
                    fontSize: 10
                },
                center: {
                    alignment: 'center',
                },
                documentFooterLogos: {
                    alignment: 'center',
                },
                documentFooterLeft: {
                    fontSize: 9,
                    margin: [0, 0, 0, 0],
                },
                documentFooterLeftLast: {
                    fontSize: 9,
                    margin: [0, 0, 0, 10],
                },
                documentFooterAdressesFirstLeft: {
                    // fontSize: 6,
                    margin: [5, 12, 0, 0]
                },
                documentFooterAdressesFirstRight: {
                    // fontSize: 6,
                    margin: [0, 12, 0, 0]
                },
                documentFooterAdresses: {
                    fontSize: 7,
                    margin: [0, 1, 0, 0]
                },
                documentFooterHrLine: {
                    bold: true,
                },
                invoiceSummeRight: {
                    margin: [0, 0, 0, 0],
                    fontSize: 10,
                    alignment: 'right',
                },
                pageNumberStyle: {
                    alignment: 'right',
                    fontSize: 10,
                    margin: [0, 5, 50, 5]
                }
            },
            pageSize: 'A4',
            pageMargins: [50, 395, 50, 150],
            defaultStyle: {
                fontSize: 12,
                columnGap: 20
            },
        };

        console.log('pdfFilePath: ', pdfFilePath);


        // check if path for pdf exists,
        // create one, if not
        if (!fs.existsSync(pdfFilePath)) {
            console.log('Try to create: ', pdfFilePath);
            // @ts-ignore
            fs.mkdirSync(pdfFilePath, { recursive: true });
        }
        if (fs.existsSync(pdfFilePath)) {

            console.log('Path exists: ', pdfFilePath);
            let finalPdfFilePath = path.join(pdfFilePath, pdfFileName);

            console.log('finalPdfFilePath: ', finalPdfFilePath);

            module.exports.checkIfFileIsOpened(finalPdfFilePath, function (isFileOpened: any) {
                if (isFileOpened === true) {

                    let printer = new PdfPrinter(fontsServer);
                    let pdfDoc = printer.createPdfKitDocument(docDefinition);
                    let pdfFile;

                    pdfDoc.pipe(pdfFile = fs.createWriteStream(finalPdfFilePath));
                    pdfDoc.end();

                    // https://stackoverflow.com/a/50629205
                    pdfFile.on('finish', async function () {
                        // res.download('tables.pdf');
                        if (fs.existsSync(finalPdfFilePath)) {
                            let dataResult = {
                                pdfFileName: pdfFileName,
                                pdfFileNameFullPath: finalPdfFilePath
                            };
                            if (shouldCallbackData) {
                                // @ts-ignore
                                dataResult['docDefinition'] = docDefinition;
                                // @ts-ignore
                                dataResult['fonts'] = fontsClient;
                            }
                            callback(dataResult);
                        } else {
                            // console.error('ERROR: PDF document not existing at path: ' + finalPdfFilePath);
                            callback({error: 'PDF document not existing at path: ' + finalPdfFilePath});
                        }
                    });

                } else {
                    callback(isFileOpened);
                }
            });

        } else {
            // console.error('ERROR: Path error: ' + pdfFilePath);
            callback({error: 'Path error: ' + pdfFilePath});
        }
    },

    getPDFTableData: function (refTable: any, resultArray: any, orderItems: any) {
        // console.log('resultArray:::: ', resultArray);
        // ToDo: Add translation to db
        let articleContainsText = 'This article contains:'; //'Dieser Artikel beinhaltet:';
        let unitText = ' UN';
        let addrData: any = {};
        let tableData: any = [];
        if (refTable == 'deliveryNote') {
            tableData = [[{text: 'Pos.', style: ['itemsHeader', 'center']}, {
                text: 'Item Name',
                style: ['itemsHeader', 'left']
            },
                {text: 'GTIN', style: ['itemsHeader', 'center']}, {
                    text: 'Quantity',
                    style: ['itemsHeader', 'center']
                }]];
        } else if (refTable == 'invoice') {
            tableData = [[{text: 'Pos.', style: ['itemsHeader', 'center']}, {
                text: 'Item Name',
                style: ['itemsHeader', 'left']
            },
                {text: 'Quantity', style: ['itemsHeader', 'center']},
                {text: 'Price per Unit', style: ['itemsHeader', 'center']},
                {text: 'Price', style: ['itemsHeader', 'center']}]];
        }

        let itemPosition = 1;
        let currValue = "";
        let itemName = "";
        let itemGTIN = "";
        let itemDESC = "";
        let itemQuantity = "";

        let weightPer = 0;
        let deliveryNoteWeightSumme = 0;
        let priceNet = 0;
        let priceBru = 0;
        let price = 0;
        // let invoicePriceNet = 0;
        let invoiceSummeNet = 0;
        let invoiceSummeBru = 0;
        let invoiceDate = "";

        let positionsArrData: any = [];
        // search for data
        // console.log('resultArray: ', resultArray);
        for (let i = 0; i < resultArray.length; i++) { // 3 dimensions
            for (let j = 0; j < resultArray[i].length; j++) { // objects
                if (i === 0) {
                    for (let k = 0; k < resultArray[i][j].length; k++) { // objects
                        if (resultArray[i][j][k].name === 'INVOICES_DATE') {
                            invoiceDate = resultArray[i][j][k].value;
                            k = resultArray[i][j].length;
                        }
                    }
                }
                if (i === 2) { // item positions data
                    if (positionsArrData[resultArray[i][j].ITMNUM] === undefined) {
                        positionsArrData[resultArray[i][j].ITMNUM] = [];
                    }
                    // if (positionsArrData[resultArray[i][j].ITMNUM].length === 0) {
                        positionsArrData[resultArray[i][j].ITMNUM].push(resultArray[i][j]);
                    // }
                }
            }
        }
        // console.log('positionsArrData::: ', positionsArrData);
        for (let keyITNUM in positionsArrData) {
            for (let j = 0; j < positionsArrData[keyITNUM].length; j++) { // objects
                if (positionsArrData[keyITNUM][j]) {
                    if (positionsArrData[keyITNUM][j].ITMNUM) {
                        itemName = positionsArrData[keyITNUM][j].ITMNUM;
                    }
                    if (positionsArrData[keyITNUM][j].EANCOD) {
                        itemGTIN = positionsArrData[keyITNUM][j].EANCOD;
                    }
                    if (positionsArrData[keyITNUM][j].ORDER_QTY) {
                        itemQuantity = positionsArrData[keyITNUM][j].ORDER_QTY;
                    }
                    if (positionsArrData[keyITNUM][j].PRICE_NET) {
                        priceNet = positionsArrData[keyITNUM][j].PRICE_NET;
                    }
                    if (positionsArrData[keyITNUM][j].PRICE_BRU) {
                        priceBru = positionsArrData[keyITNUM][j].PRICE_BRU;
                    }
                    if (positionsArrData[keyITNUM][j].WEIGHT_PER) {
                        weightPer = positionsArrData[keyITNUM][j].WEIGHT_PER;
                    }
                    if (positionsArrData[keyITNUM][j].ITMDES) {
                        itemDESC = positionsArrData[keyITNUM][j].ITMDES;
                    }
                    if (positionsArrData[keyITNUM][j].CUSTOMERS_NAME) {
                        addrData['CUSTOMERS_NAME'] = positionsArrData[keyITNUM][j].CUSTOMERS_NAME;
                    }
                    if (positionsArrData[keyITNUM][j].CUSTOMERS_PRENAME) {
                        addrData['CUSTOMERS_PRENAME'] = positionsArrData[keyITNUM][j].CUSTOMERS_PRENAME;
                    }
                    if (positionsArrData[keyITNUM][j].DELIVERY_NOTES_NUMBER) {
                        addrData['DELIVERY_NOTES_NUMBER'] = positionsArrData[keyITNUM][j].DELIVERY_NOTES_NUMBER;
                    }
                    if (positionsArrData[keyITNUM][j].CUSTOMER_ORDER) {
                        addrData['CUSTOMER_ORDER'] = positionsArrData[keyITNUM][j].CUSTOMER_ORDER;
                    }
                    if (positionsArrData[keyITNUM][j].CUSTOMERS_EMAIL) {
                        addrData['CUSTOMERS_EMAIL'] = positionsArrData[keyITNUM][j].CUSTOMERS_EMAIL;
                    }
                    if (positionsArrData[keyITNUM][j].SHIPPING_DATE) {
                        addrData['SHIPPING_DATE'] = positionsArrData[keyITNUM][j].SHIPPING_DATE;
                    }
                    if (positionsArrData[keyITNUM][j].ADDRESS_TYPE) {
                        if (positionsArrData[keyITNUM][j].ADDRESS_TYPE === 'DLV') {
                            addrData['ADDR_STREET_DLV'] = positionsArrData[keyITNUM][j].ADDRESS_STREET;
                            addrData['ADDR_CITY_DLV'] = positionsArrData[keyITNUM][j].ADDRESS_CITY;
                            addrData['ADDR_POSTCODE_DLV'] = positionsArrData[keyITNUM][j].ADDRESS_POSTCODE;
                        } else if (positionsArrData[keyITNUM][j].ADDRESS_TYPE === 'INV') {
                            addrData['ADDR_STREET_INV'] = positionsArrData[keyITNUM][j].ADDRESS_STREET;
                            addrData['ADDR_CITY_INV'] = positionsArrData[keyITNUM][j].ADDRESS_CITY;
                            addrData['ADDR_POSTCODE_INV'] = positionsArrData[keyITNUM][j].ADDRESS_POSTCODE;
                        }
                    }
                }
            }

            if (refTable == 'deliveryNote') {
                itemQuantity += unitText;
                tableData.push([{text: itemPosition, style: 'itemPosition'}, [{
                    text: itemName,
                    style: 'itemName'
                }], {text: itemGTIN, style: 'itemGTIN'}, {text: itemQuantity, style: 'itemQuantity'}]);
                tableData.push([{text: '', style: 'itemPosition'}, [{
                    text: itemDESC,
                    style: 'itemDescription'
                }], {text: ''}, {text: ''}]);
                tableData.push([{text: '', style: 'itemPosition'}, [{
                    text: articleContainsText,
                    style: 'itemDescriptionBold'
                }], {text: ''}, {text: ''}]);

                for (let j = 0; j < orderItems.length; j++) {
                    if (orderItems[j]['ITMNUM'] == itemName) {
                        tableData.push([
                            {text: '', style: 'itemPosition'},
                            [{text: '-   ' + orderItems[j]['ITMNUM'], style: 'itemNameSmall'}],
                            {text: orderItems[j]['COMPNUM'], style: 'itemGTINSmall'},
                            {text: orderItems[j]['DIST_QTY'] + unitText, style: 'itemQuantitySmall'}
                            ]);
                    }
                }

                // add empty line
                tableData.push([{text: '', style: 'itemPosition'}, [{
                    text: '',
                    style: 'itemDescriptionBold'
                }], {text: ''}, {text: ''}]);

            } else if (refTable == 'invoice') {
                // @ts-ignore
                price = priceBru * parseInt(itemQuantity);
                invoiceSummeNet += priceNet * parseInt(itemQuantity);
                itemQuantity += unitText;
                invoiceSummeBru += price;
                // invoicePriceNet += priceNet;
                price = formatPrice(price);
                priceNet = formatPrice(priceNet);
                deliveryNoteWeightSumme += weightPer;
                tableData.push([{text: itemPosition, style: 'itemPosition'}, [{
                    text: itemName,
                    style: 'itemName'
                }], {text: itemQuantity, style: 'itemQuantity'}, {text: priceNet, style: 'itemGTIN'},
                    {text: price, style: 'itemGTIN'}]);
            }
            currValue = "";
            itemName = "";
            itemGTIN = "";
            itemQuantity = "";
            priceNet = 0;
            weightPer = 0;
            itemPosition++;
        }

        invoiceSummeNet = formatPrice(invoiceSummeNet);
        invoiceSummeBru = formatPrice(invoiceSummeBru);
        return {
            tableData: tableData,
            addrData: addrData,
            invoiceSummeNet: invoiceSummeNet,
            invoiceSummeBru: invoiceSummeBru,
            invoiceDate: invoiceDate,
            deliveryNoteWeightSumme: deliveryNoteWeightSumme
        };
    },

    checkIfFileIsOpened: function (file: any, callback: any) {
        // https://stackoverflow.com/a/37707620
        fs.open(file, 'r+', function (err, fd) {
            if (err && err.code === 'EBUSY') {
                // file is opened by another application
                console.error('file is opened by another application');
                callback({error: 'EBUSY'});
            } else if (err && err.code === 'ENOENT') {
                // no such file or directory, is still ok,
                // because it will be created later
                callback(true);
            } else {
                // everything ok, close file before callback
                fs.close(fd, (err) => {
                    if (err) {
                        console.error('couldn\'t close file: ' + err);
                    }
                    callback(true);
                })
            }
        });
    }
};

function formatPrice(price: any) {
    return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function getDevInvDetails(refTable: any, data: any) {
    let details = [];
    for (let i = 0; i < data.length; i++) {
        details.push(
                    {columns: [
                        {
                            text: data[i].name,
                            style: 'invoiceSubTitle',
                            width: 80
                        },
                        {
                            text: data[i].value,
                            style: 'invoiceSubValue',
                            width: 'auto'
                        }
                    ]
                });
    }
    return details;
}

// function to encode file data to base64 encoded string
//https://stackoverflow.com/a/24526156
function base64_encode(file: any) {
    // // read binary data
    // var bitmap = fs.readFileSync(file);
    // // convert binary data to base64 encoded string
    // return Buffer.from(bitmap).toString('base64');

    // // This line opens the file as a readable stream
    // var readStream = fs.createReadStream(file);
    //
    // // This will wait until we know the readable stream is actually valid before piping
    // readStream.on('open', function () {
    //     // This just pipes the read stream to the response object (which goes to the client)
    //     readStream.pipe(res);
    // });
    //
    // // This catches any errors that happen while creating the readable stream (usually invalid names)
    // readStream.on('error', function(err) {
    //     res.end(err);
    // });

    return fs.readFileSync(file, { encoding: 'base64' });
}
