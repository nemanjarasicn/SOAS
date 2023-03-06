import PdfPrinter from 'pdfmake';
import * as fs from "fs";
import {getHeader} from "./DocumentHeader";
import {getFooter} from "./DocumentFooter";
import {getDocumentPositions} from "./DocumentPositions";
import {getDocStyles} from "./DocumentStyles";
import {getDocumentData} from "./DocumentData";

export class TradeDocument {

    private readonly avisNumber: string;

    private fonts = {
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
        }
    }

    /**
     * Creates a new TradeDocument
     * @author Ronny Brandt
     * @class
     * @param avisNumber
     */
    constructor(avisNumber: string){
        this.avisNumber = avisNumber;
    }

    /**
     * Writes a pdf file based on the specified docDefinition template
     * that fits for ORDERS, DELIVERY_NOTES and INVOICES and returns the path to the document
     * @author Ronny Brandt
     * @function
     */
    async createDocument(): Promise<string>{
        const docData = await getDocumentData(this.avisNumber);

        const printer = new PdfPrinter(this.fonts);

        const docDefinitions = {
            pageMargins: [40, 295, 40, 180],
            header: (currentPage: number, pageCount: number) => {
                return getHeader(currentPage, pageCount, docData);
            },
            footer: (currentPage: number, pageCount: number) => {
                return getFooter(currentPage === pageCount, docData);
            },
            content: [
                {
                    layout: {
                        paddingTop: (i: number) => {
                            return i === 0 ? 5 : 0;
                        },
                        hLineWidth: (i: number, node: any) => {
                            return i <= 1 ? 1 : 0;
                        },
                        vLineWidth: (i: number, node: any) => {
                            return 0;
                        }
                    },
                    table: {
                        headerRows: 1,
                        dontBreakRows: true,
                        widths: [25, '*', 40, 70, 70],
                        body: getDocumentPositions(docData)
                    }
                },
                {
                    // this is a hacky way to make sure our negative margin footer content doesn't overlap the table
                    text: `\n\n\n\n\n\n\n\n`
                },
            ],
            background: {
                canvas: [
                    {
                        type: 'line',
                        x1: 40, y1: 695,
                        x2: 550, y2: 695
                    }
                ]
            },
            defaultStyle: {
                font: 'Helvetica',
                fontSize: 11
            },
            styles: getDocStyles()
        };

        const docOptions = {}; // left it here as a reference, not needed for now
        // @ts-ignore
        const pdfDoc = printer.createPdfKitDocument(docDefinitions, docOptions);
        pdfDoc.pipe(fs.createWriteStream(this.avisNumber + '.pdf'));
        pdfDoc.end();

        // TODO return path to document
        return 'Hello World';
    }
}
