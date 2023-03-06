
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

// nodemailer for sending emails
// @ts-ignore
import nodemailer = require('nodemailer');
// @ts-ignore
import config = require('../config/mailConfig');

import logger = require('./../config/winston');

// https://nodemailer.com/smtp/
let transporter = nodemailer.createTransport(config);

module.exports = {
    send_mail: function(data: any, callback: any) {

        let emailAddress :string = data[0].emailAddress;
        let emailSubject :string= data[0].emailSubject;
        let emailHtmlText :string= data[0].emailHtmlText;
        let functionName :string= data[0].functionName;
        let csvFilenamePrefix :string= data[0].csvFilenamePrefix;
        let csvData = data[0].csvData;

        let date = new Date();

        // https://www.w3schools.com/nodejs/nodejs_email.asp
        let mailOptions = {
            from: 'a.lening@emotion-24.de', // 'soas-info@emotion-24.de'
            to: emailAddress,
            subject: emailSubject, //'[SOAS Cron Job] Ergebnisse von ' + functionName,
            //text: 'That was easy!'
            html: emailHtmlText,
            attachments: [
                {
                    filename: csvFilenamePrefix +'_' + date.toISOString().split('T')[0] +'.csv',
                    content: csvData
                }
            ]
        };

        // console.log('Try send mail');

        // send mail
        transporter.sendMail(mailOptions, function (error: any, info: any) {
            if (error) {
                // @ts-ignore
                logger.error(new Error(error));
            } else {
                // @ts-ignore
                logger.info('Email sent: ' + info.response);
            }

            // ToDo: Make sure if some alternatives needed here instead of System.exit
            // setTimeout(function () {
            //     // @ts-ignore
            //     System.exit(0);
            // }, 6000);
        });

        //res.send(csv_result);
       callback('Mail Routine ist durchgelaufen.');
    },

    /**
     * Get csv text with error data of articles for sending it via email
     *
     * @param data
     * @param separator
     * @returns {string}
     */
    getFormattedCsvData: function (data: any, separator: any) {
        let newLine = "\r\n";
        let csvData = '';
        if(data.length) {
            for(let key in data[0]) {
                csvData += key + separator;
            }
            csvData += newLine;
            for (let i = 0; i < data.length; i++) {
                for (let key in data[i]) {
                    csvData += data[i][key] + separator;
                }
                csvData += newLine;
            }
        }
        return csvData;
    }
}
