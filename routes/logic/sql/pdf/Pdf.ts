/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 01.06.2021 */

import {constants} from '../../constants/constants';
import logger = require('../../../config/winston');
let fs = require('fs');
let path = require('path');

/**
 * download pdf to public folder
 * public pdf file must be be deleted after loading
 *
 * @param refTable
 * @param fullPath
 * @param pdfFilename
 * @param symLinkPublicPath
 * @param symLinkPath
 * @param language
 */
export function downloadPdf(refTable: string, fullPath: string, pdfFilename: string, symLinkPublicPath: string,
                            symLinkPath: string, language: string) {
    let batchCall: boolean = false;
    let finalPdfFilePath: any;
    let errorMessage = 'PDF-Datei existiert nicht';
    let publicPDFsFolderPath: string = path.join(__dirname, '../public/', '/pdfs/');
    if (!fs.existsSync(publicPDFsFolderPath)) {
        fs.mkdirSync(publicPDFsFolderPath, { recursive: true });
    }
    finalPdfFilePath = path.join(constants.PDF_FILE_LINK_SHORT, fullPath);
    if (fs.existsSync(publicPDFsFolderPath)) {
        if (fs.existsSync(finalPdfFilePath)) {
            fs.link(finalPdfFilePath, symLinkPath, function (result: any) {
                return {success: true, data: JSON.stringify(symLinkPublicPath)};
                // setTimeout(function () {
                //     fs.unlink(symLinkPath, function (result: any) {
                //     });
                // }, 100);
            });
        } else {
            // @ts-ignore
            logger.error(new Error(errorMessage));
            //Variante 1: Dialog message, dass die PDF nicht existiert.
            // res.send({error: errorMessage});
            return {success: false, data: errorMessage};
            //Variante 2: Es wird eine neue PDF erstellt und dann angezeigt.
            // let language = req.session.language;
            // let shouldCallbackData = true;
            // logic_a.mssql_select_thisItem(pdfFilename, refTable, language, shouldCallbackData, batchCall,
            // function (result: any) {
            //     if (refTable === 'deliveryNote') {
            //         finalPdfFilePath = path.join(constants.PDF_FILE_FULL_PATH_DELIVERY_NOTES, '/' + pdfFilename + '.pdf');
            //     } else if (refTable === 'invoice') {
            //         finalPdfFilePath = path.join(constants.PDF_FILE_FULL_PATH_INVOICES, '/' + pdfFilename + '.pdf');
            //     }
            //     if (fs.existsSync(finalPdfFilePath)) {
            //         fs.link(finalPdfFilePath, symLinkPath, function (result: any) {
            //             res.send(JSON.stringify(symLinkPublicPath));
            //             setTimeout(function () {
            //                 fs.unlink(symLinkPath, function (result: any) {
            //                 });
            //             }, 100);
            //         });
            //     } else {
            //         logger.error(new Error(errorMessage));
            //         res.send(undefined);
            //     }
            // });
        }
    } else {
        errorMessage = 'PDFs Ordner existiert nicht.';
        // @ts-ignore
        logger.error(new Error(errorMessage));
        return {success: false, data: errorMessage};
    }
}
