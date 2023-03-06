/**
 * Author: Andreas Lening
 * Last update: 02.06.2020
 */

import sgCall = require('./sg_call');
import {constants} from "./constants/constants";
import logger = require('./../config/winston');
import mssqlCall = require('./mssql_call.js');

module.exports = {
    /**
     * @deprecated
     * @param callback
     */
    sage_get_all_tabcur: function(callback: any) {
        // @ts-ignore
        sgCall.sage_call_get_all_tabcur(function (resultAttr: any) {
            // console.log('resultAttr: ', resultAttr);
            if (resultAttr && resultAttr.length) {
                callback(resultAttr);
            } else {
                console.log('No tabcur found...');
                callback(undefined);
            }
        });
    },
    /**
     * @deprecated
     */
    sage_get_all_bomd: function(callback: any) {
        // @ts-ignore
        sgCall.sage_call_get_all_bomd(function (resultAttr: any) {
            // console.log('resultAttr: ', resultAttr);
            if (resultAttr && resultAttr.length) {
                callback(resultAttr);
            } else {
                console.log('No bomd found...');
                callback(undefined);
            }
        });
    },
    sage_call_get_all_prilists_for_import: function(callback: any) {
        // @ts-ignore
        sgCall.sage_call_get_all_prilists_for_import(function (resultAttr: any) {
            // console.log('resultAttr: ', resultAttr);
            if (resultAttr && resultAttr.length) {
                callback(resultAttr);
            } else {
                console.log('No prilists found...');
                callback(undefined);
            }
        });
    },
    /**
     * @deprecated
     * @param callback
     */
    sage_call_get_all_stock_for_import: function(callback: any) {
        // @ts-ignore
        sgCall.sage_call_get_all_stock(function (resultAttr: any) {
            if (resultAttr && resultAttr.length) {
                callback(resultAttr);
            } else {
                console.log('No stock items found...');
                callback(undefined);
            }
        });
    },

    sage_get_attributes_by_name: function (name: string, callback: any) {
        // @ts-ignore
        sgCall.sage_call_get_attribute_by_name(name, function (resultAttr: any) {
            // console.log('resultAttr: ', resultAttr);
            if (resultAttr && resultAttr.length) {
                callback(resultAttr);
            } else {
                console.log('No attributes found for :', name);
                callback(undefined);
            }
        });
    },
    sage_get_colors: function (callback: any) {
        // @ts-ignore
        sgCall.sage_call_get_colors(function (resultNewColors: any) {
            console.log('resultNewColors: ', resultNewColors);
            if (resultNewColors && resultNewColors.length) {
                callback(resultNewColors);
            } else {
                console.log('No colors found...');
                callback(undefined);
            }
        });
    },

    /**
     * sage add new customers
     *
     * @param resultNewCustomers
     * @param lastCustomersNumber
     * @param lastCustomersAddressesId
     * @param soasCustomers
     * @param languages
     * @param allSoasPrilistsByCusGrp
     * @param resultArray
     * @param detectedCustomersCounter
     * @param duplicatedCustomersCounter
     */
    sage_add_new_customers: function (resultNewCustomers: any, lastCustomersNumber: any, lastCustomersAddressesId: any,
                                      soasCustomers: any, languages: any, allSoasPrilistsByCusGrp: any,
                                      resultArray: never[] | any[][], detectedCustomersCounter: number,
                                      duplicatedCustomersCounter: number) {
        // console.log("sage_add_new_customers: ", lastCustomersNumber + " --- " + lastCustomersAddressesId);
        lastCustomersAddressesId++;
        // let resultArray: never[] | any[][] = [];
        let customerData: never[] | any[][] = [];
        let customerAddressData: never[] | any[][] = [];
        let customerAddressTypes = [{'type': 'DLV'}, {'type': 'INV'}];
        // let customerAddressesID: undefined |number = lastCustomersAddressesId;
        // let countriesIsocodeTypes: string[] = ['US', 'DE'];
        let customerNumber: string;
        let customerCREDAT_0: string;
        // let duplicated: boolean = false;
        let customergroup: string = '';
        // let sageCustomerNumber: string = "";
        let taxation: number = 0;
        let lastNumber: any = 0;
        let email: string = '';
        let phone: string = '';
        if (lastCustomersNumber && lastCustomersNumber.includes(constants.CUSTOMER_TYPE_ID)) { // 0100000014 or 0100012480
            lastNumber = lastCustomersNumber.split(constants.CUSTOMER_TYPE_ID);
            lastNumber = parseInt(lastNumber[1]);
            // lastNumber = lastCustomersNumber;
        } else {
            lastNumber = 0;
        }
        // let shortYear = new Date().getFullYear().toString().substr(-2);
        // console.log("lastNumber: ", lastNumber);

        // @ts-ignore
        // let resultNewCustomers = await sgCall.sage_call_get_new_customers_promise(startNumber, stepNumber);
        // console.log("resultNewCustomers: ", resultNewCustomers.length);

        if (resultNewCustomers && resultNewCustomers.length) {
            for (let i = 0; i < resultNewCustomers.length; i++) {
                // duplicated = false;
                // console.log('SAGE DATA ROW: ', resultNewCustomers[i]);
                customerNumber = resultNewCustomers[i]['BPCNUM_0'].trim();
                // check if new customers is already in db
                // customerCREDAT_0 = checkDate(resultNewCustomers[i]['CREDAT_0']); //resultNewCustomers[i]['CREDAT_0'].toISOString(); // checkDate(resultNewSORDER[i].ORDDAT_0);
                customerCREDAT_0 = checkDate(resultNewCustomers[i]['BPCSNCDAT_0']);

                // if (resultArray) {
                //     // Check if current Sage customer number already existing in results array (Sage items already found for import/update)
                //     for (let j = 0; j < resultArray[0].length; j++) {
                //         if (resultArray[0][j]) {
                //             let soasCustomersNr = resultArray[0][j][0]; //['CUSTOMERS_NUMBER'];
                //             // console.log("resultArray[0][j]: ", resultArray[0][j]);
                //             // console.log("Comapre 1: " + sageCustomerNumber + " == " + soasCustomersNr);
                //             // console.log("Comapre 11: ", (sageCustomerNumber == soasCustomersNr));
                //             // console.log("Comapre 2: " + parseInt(sageCustomerNumber) + " == " + parseInt(soasCustomersNr));
                //             // console.log("Comapre 22: ", (parseInt(sageCustomerNumber) == parseInt(soasCustomersNr)));
                //             if ((sageCustomerNumber == soasCustomersNr) || (parseInt(sageCustomerNumber) == parseInt(soasCustomersNr))) {
                //                 // console.log('CUSTOMER NUMBER duplicate found... ', sageCustomerNumber);
                //                 duplicated = true;
                //                 j = resultArray[0].length;
                //             }
                //         }
                //     }
                // }

                // if (updateFlag && !duplicated) {
                //     for (let j = 0; j < soasCustomers.length; j++) {
                //         if (soasCustomers[j]) {
                //             let soasCustomersNr = soasCustomers[j]['CUSTOMERS_NUMBER'];
                //             // console.log("Comapre 1: " + sageCustomerNumber + " == " + soasCustomersNr);
                //             // console.log("Comapre 11: ", (sageCustomerNumber == soasCustomersNr));
                //             // console.log("Comapre 2: " + parseInt(sageCustomerNumber) + " == " + parseInt(soasCustomersNr));
                //             // console.log("Comapre 22: ", (parseInt(sageCustomerNumber) == parseInt(soasCustomersNr)));
                //             if ((sageCustomerNumber == soasCustomersNr) || (parseInt(sageCustomerNumber) == parseInt(soasCustomersNr))) {
                //                 // console.log('CUSTOMER NUMBER duplicate found...');
                //                 duplicated = true;
                //                 // throw new Error("test");
                //                 j = soasCustomers.length;
                //             }
                //         }
                //     }
                // }

                // console.log('1. Check ist abgeschlossen... sageCustomerNumber: ' + sageCustomerNumber + ' duplicated : ' + duplicated);
                // customerNumber = sageCustomerNumber.trim();

                // if (!duplicated) { // updateFlag ||

                let custNumberDuplicate: boolean = false;
                let selectedCustNumberItem: number;
                // let replacePhone2: boolean = false;

                //Check if current Sage customer number is already existing in SOAS table
                for (let crdItem in customerData) {
                    // console.log("Comapre 3: " + sageCustomerNumber.trim() + " == " + customerData[crdItem][0].trim() );
                    // console.log("Comapre 33: ", (sageCustomerNumber.trim() === customerData[crdItem][0].trim()) );

                    // ||
                    //     (parseInt(customerNumber) === parseInt(customerData[crdItem][0].trim()))

                    if (customerNumber == customerData[crdItem][0].trim()) {
                        // console.log("Comapre 33: " + customerNumber + " == " + customerData[crdItem][0].trim() );
                        // @ts-ignore
                        selectedCustNumberItem = crdItem;
                        custNumberDuplicate = true;
                        // console.log('Customernumber ' + selectedCustNumberItem + ' is already in array...');
                        break;
                    }
                }

                // ToDo: Do check after import and update customergroup...
                // 72518 items
                // let isInPrilists: boolean = false;

                // for (let pPos in allSoasPrilistsByCusGrp) {
                // if (allPrilists[pPos].PLICRI2_0 === sageCustomerNumber) { // sage compare
                // if (allPrilists[pPos].CUSGRP === sageCustomerNumber) {
                // if (sageCustomerNumber == allSoasPrilistsByCusGrp[pPos][0].trim() ||
                //     (parseInt(sageCustomerNumber) === parseInt(allSoasPrilistsByCusGrp[pPos][0].trim()))) {
                //     isInPrilists = true;
                customergroup = allSoasPrilistsByCusGrp && allSoasPrilistsByCusGrp[customerNumber] &&
                allSoasPrilistsByCusGrp[customerNumber].length > 0 ? 'B2B' : 'B2C';
                // break;
                // }

                // console.log('PRILIST - Result: ', isInPrilists);
                // BCGCOD_0 -
                // resultNewCustomers[i]['BCGCOD_0'] === 'POS' ||
                // if (isInPrilists) {
                //     customergroup = 'B2B';
                // } else {
                //     customergroup = 'B2C';
                // }
                // console.log('customergroup: ', customergroup);
                // ToDo: Check if "Customer 3200004259 - Company: 'Frau Heike MÃ¼ller'" is correctly imported,
                //  after encoding via Buffer
                let companyString: string =
                    Buffer.from(resultNewCustomers[i]['BPCNAM_0'].trim(), 'utf-8').toString();
                let company: string = companyString;
                company = replaceAll(company, "'", "''");
                // Vorname, Nachname erstmals leer, kann später aus company exportiert werden
                let firstName: string = '';
                let lastName: string = '';
                // firstName = resultNewCustomers[i]['BPCNAM_0'];
                // if (firstName.includes(",")) {
                //     let companyArr = firstName.split(",");
                //     firstName = companyArr[0];
                //     lastName = companyArr[1];
                // }

                // ToDo: BPADES_0 is not used: Lieferadresse/Jim Ridder, see for BPCUSTOMER.BPCNUM_0 = '0100000573'

                // B2B nur RG erforderlich * B2C alle 3 erforderlich, ggf. alle mit gleichen EMailadresse füllen
                let emailRG: string = resultNewCustomers[i]['WEB_0'].trim(); // 0
                let emailLS: string = '';
                let emailAU: string = '';
                // ToDo: Why not save for B2B ???
                // if (customergroup != 'B2B') {
                emailLS = resultNewCustomers[i]['WEB_1'].trim(); // 1
                emailAU = resultNewCustomers[i]['WEB_2'].trim(); // 2
                // }

                let phone1: string = resultNewCustomers[i]['TEL_0'].trim();  // 0
                let fax: string = resultNewCustomers[i]['TEL_1'].trim();     // 1
                let phone2: string = resultNewCustomers[i]['TEL_2'].trim();  // 2
                let mobile1: string = resultNewCustomers[i]['TEL_3'].trim(); // 3
                let mobile2: string = resultNewCustomers[i]['TEL_4'].trim(); // 4

                let country: string = resultNewCustomers[i]['CRYNAM_0'].trim();
                let countryIsoCode: string = resultNewCustomers[i]['CRY_0'].trim(); // DE/FR/ES/CN/CZ/DK/MK/NL/AT/GB/BE/

                let eecNum: string = '';
                let crnNum: string = '';
                let ediInvoice: string = '0';
                let ediOrdersp: string = '0';
                let editDesadv: string = '0';

                let paymentTermId: string = resultNewCustomers[i]['PTE_0'].trim(); // PAYMENT_TERM_ID

                // if (customergroup === 'B2B') {
                eecNum = resultNewCustomers[i]['EECNUM_0'].trim();
                crnNum = resultNewCustomers[i]['CRN_0'].trim();
                ediInvoice = resultNewCustomers[i]['ZIWOINVOIC_0'];
                ediOrdersp = resultNewCustomers[i]['ZIWOORDERSP_0'];
                editDesadv = resultNewCustomers[i]['ZIWODESADV_0'];
                // }

                let language: string = 'ENG'; // 'US'
                // 13 items
                for (let pos in languages) {
                    // console.log("languages[pos].LANGUAGE_ISO: ", languages[pos].LANGUAGE_ISO_ALPHA_2);
                    if (languages[pos].LANGUAGE_ISO_ALPHA_2 === countryIsoCode) {
                        language = languages[pos].LANGUAGE_ISO_ALPHA_3;
                        break;
                    }
                }
                // console.log("Language found: ", language);
                // let paymentCondition: string = resultNewCustomers[i]['PTE_0'].trim(); // PTE - Zahlungsbedingung => Payment Term ???
                taxation = resultNewCustomers[i]['VACBPR_0'].trim();

                let nameAddr: string = company; // NAME_ADDR

                let custAddrType: number = resultNewCustomers[i]['BPAADDFLG_0']; // tinyint: 2 - Lieferkundenadresse (DLV); 1 - Rechnungsadresse (INV)
                // console.log('custAddrType:1:: ', custAddrType);
                // console.log('custAddrType:2:: ', (typeof custAddrType));
                // console.log('custAddrType:3:: ', (custAddrType === 1));
                // console.log('custAddrType:4:: ', (custAddrType === 2));

                // ToDo: Check Date Format with "Add new Customer" via Frontend
                // 24 fields:
                // 0-4:     [CUSTOMERS_NUMBER],[CUSTOMERS_PRENAME],[CUSTOMERS_NAME],[CUSTOMERS_COMPANY],[CUSTOMERS_TYPE],
                // 5-11:    [EEC_NUM] ,[LANGUAGE] ,[EDI_INVOIC] ,[EDI_ORDERSP],[EDI_DESADV],[CREATE_DATE],[CUSTOMERS_EMAIL],
                // 12-16 :  [CUSTOMERS_PHONE],[EMAIL_RG],[EMAIL_LI],[EMAIL_AU],
                // 17-23:   [PHONE_0],[PHONE_1],[FAX_0],[MOB_0],[MOB_1],[CRNNUM],[PAYMENT_TERM_ID]

                if (!custNumberDuplicate) {
                    // @ts-ignore
                    customerData.push([customerNumber, firstName, lastName, company, customergroup, eecNum,
                        language, ediInvoice, ediOrdersp, editDesadv, customerCREDAT_0, email, phone,
                        emailRG, emailLS, emailAU, phone1, phone2, fax, mobile1, mobile2, crnNum, paymentTermId]);
                    detectedCustomersCounter++;
                } else {
                    duplicatedCustomersCounter++;
                    // only if insert mode: make sense only if at update the changed data will be not overwritten...
                    // if (!updateFlag) {
                    // Add phone number to already available customer in array
                    // If there is empty phone number place (1-2)
                    // @ts-ignore
                    // console.log('18-Länge: ', customerData[selectedCustNumberItem][18].length );
                    // Disables saving many phone numbers into customer, because two different phone numbers are already in addresses
                    if (phone1.length) {
                        // @ts-ignore
                        if (customerData[selectedCustNumberItem][17].length === 0) {
                            // @ts-ignore
                            customerData[selectedCustNumberItem][17] = phone1;
                            // @ts-ignore
                        } else if (customerData[selectedCustNumberItem][18].length === 0 && (customerData[selectedCustNumberItem][17] !== phone1)) { // TEL_0 => phone2
                            // @ts-ignore
                            customerData[selectedCustNumberItem][18] = phone1;
                            // @ts-ignore
                        } else if (customerData[selectedCustNumberItem][20].length === 0 && (customerData[selectedCustNumberItem][17] !== phone1 && customerData[selectedCustNumberItem][18] !== phone1)) {
                            // @ts-ignore
                            customerData[selectedCustNumberItem][20] = phone1; // => mobile1
                            // @ts-ignore
                        } else if (customerData[selectedCustNumberItem][21].length === 0 && (customerData[selectedCustNumberItem][17] !== phone1 && customerData[selectedCustNumberItem][18] !== phone1 && customerData[selectedCustNumberItem][20] !== phone1)) {
                            // @ts-ignore
                            customerData[selectedCustNumberItem][21] = phone1; // => mobile2
                        }
                    }

                    if (emailRG.length) {
                        // @ts-ignore
                        if (customerData[selectedCustNumberItem][14].length === 0) { // WEB_0 => emailRG
                            // @ts-ignore
                            customerData[selectedCustNumberItem][14] = emailRG;
                        }
                    }
                    // }
                }
                // 10 fields: ADDRESS_TYPE,CUSTOMERS_NUMBER,ADDRESS_CRYNAME,ADDRESS_STREET,ADDRESS_CITY,ADDRESS_POSTCODE,ADDRESS_ISO_CODE,ADDRESS_COMMENT,TAXATION,ADDRESS_ID
                let customerAddressEmail: string = '';
                let customerAddressPhone: string = phone1;
                let customerAddressTypeValue: undefined | string;
                if (custAddrType === 2) { // DLV
                    customerAddressTypeValue = customerAddressTypes[0].type;
                    customerAddressEmail = emailLS;
                } else if (custAddrType === 1) { // INV
                    customerAddressTypeValue = customerAddressTypes[1].type;
                    customerAddressEmail = emailRG;
                }
                // console.log('customerAddressTypeValue: ', customerAddressTypeValue);
                if (customerAddressTypeValue) {
                    let customerAddressAddressId: string = resultNewCustomers[i]['BPAADD_0'].trim();
                    let customerAddressStreet: string = resultNewCustomers[i]['BPAADDLIG_0'].trim();
                    customerAddressStreet = replaceAll(customerAddressStreet, "'", "''");
                    let customerAddressCity: string = resultNewCustomers[i]['CTY_0'].trim();
                    customerAddressCity = replaceAll(customerAddressCity, "'", "''");
                    let customerAddressPostcode: string = resultNewCustomers[i]['POSCOD_0'].toString().trim()
                    customerAddressPostcode = replaceAll(customerAddressPostcode, "'", "''");
                    // ToDo: Compare by more then one address, if they are same/different. Insert only if different.
                    let allowAddress: boolean = true;
                    if (custNumberDuplicate) {
                        for (let cusAddrItem in customerAddressData) {
                            if (customerAddressData[cusAddrItem][1] === customerNumber) {
                                if ((customerAddressTypeValue.toUpperCase() === customerAddressData[cusAddrItem][0].toUpperCase()) && (customerAddressStreet.toUpperCase() === customerAddressData[cusAddrItem][3].toUpperCase()) && (customerAddressCity.toUpperCase() === customerAddressData[cusAddrItem][4].toUpperCase()) && (customerAddressPostcode.toUpperCase() === customerAddressData[cusAddrItem][5].toUpperCase())) { // Street + City + Postcode
                                    allowAddress = false;
                                    console.log('SAME ADDRESS DATA FOR STREET, CITY, POSTCODE found...', customerNumber);
                                    break;
                                } else {
                                    // console.log('DIFFRENT ADDRESS DATA DATA for ID ... ', customerID);
                                }
                            }
                        }
                    }
                    if (allowAddress) {
                        // @ts-ignore
                        customerAddressData.push([customerAddressTypeValue, customerNumber, customerAddressAddressId, country, customerAddressStreet, customerAddressCity, customerAddressPostcode, countryIsoCode, '', taxation, nameAddr, customerAddressEmail, customerAddressPhone]);
                    } else {
                        console.log('Ignore Address. Is already available...');
                    }
                } else {
                    console.log('ERROR:. Customer address type was not detected... ');
                }
                // } else {
                //     // console.log('sw_new_orders - Duplicate found. Ignore following customer id: ' + customerID + ' for sageCustomerNumber: ' + sageCustomerNumber);
                // }

            }

            // Merge results with already available
            if (customerData && customerAddressData) {
                if (!resultArray) {
                    resultArray = [];
                    // @ts-ignore
                    resultArray.push(customerData);
                    // Check customer addresses if there are items with only 1 address (dlv or inv)
                    // add for this items missing address type with same address data of available type
                    customerAddressData = checkCustomerAddressData(customerAddressData);
                    // @ts-ignore
                    resultArray.push(customerAddressData);
                } else {
                    let newResultArray: never[] | any[][] = [];
                    // @ts-ignore
                    newResultArray.push(resultArray[0]);
                    // @ts-ignore
                    for (let cdItem in customerData) {
                        newResultArray[0].push(customerData[cdItem]);
                    }
                    customerAddressData = checkCustomerAddressData(customerAddressData);
                    // @ts-ignore
                    newResultArray.push(resultArray[1]);
                    for (let caItem in customerAddressData) {
                        newResultArray[1].push(customerAddressData[caItem]);
                    }
                    resultArray = newResultArray;
                }
            } else {
                console.log("customerData or customerAddressData are empty");
                console.log("customerData: ", customerData);
                console.log("customerAddressData: ", customerAddressData);
                // @ts-ignore
                logger.error(new Error("customerData or customerAddressData are empty"));
            }
            return {resultArray: resultArray, detectedCustomersCounter: detectedCustomersCounter, duplicatedCustomersCounter: duplicatedCustomersCounter};
        } else {
            console.log('resultNewCustomers is empty...');
            return {resultArray: resultArray, detectedCustomersCounter: detectedCustomersCounter, duplicatedCustomersCounter: duplicatedCustomersCounter};
        }
    },

    /**
     * Function to import articles from SAGE into SOAS db. Check for duplicates and don't import them.
     *
     * @param resultNewITMMASTER Sage articles
     * @param allAttributes all attributes from SOAS db
     * @param updateFlag if true => update mode, otherwise insert mode
     */
    sage_add_new_itm_master: async function (resultNewITMMASTER: any, allAttributes: any, updateFlag: boolean) {

        let debug: boolean = false;

        let duplicated: boolean = false;

        let insertedItemBasis: number = 0;
        let insertedCrossselling: number = 0;
        let insertedAttributes: number = 0;
        let updatedItemBasis: number = 0;
        let updatedCrossselling: number = 0;
        let updatedAttributes: number = 0;

        let sageItmNum: string = "";

        /* SOAS DB Fields */
        // ToDo: 1. Set right fields types based on table fields types: PACK_LENGTH (decimal=number), ATTR_CRAFT (bit=boolean)
        let soasACTIVE_FLG: number = 1; // ToDo: change to soasATTR_SHOP_ACTIVE: States: 0, 1, 2
        let soasITMNUM: string = "";
        let soasITMDES: string = "";
        let soasITMDES_UC: string = "";
        let soasEANCOD: string = "";
        let soasITMWEIGHT: string = "'0'"; // : number = 0.0; // ToDo: Check if float numbers are imported correctly
        let soasART_LENGTH: string = "'0'"; // soasATTR_X
        let soasART_WIDTH: string = "'0'"; // soasATTR_Z
        let soasART_HEIGHT: string = "'0'"; // soasATTR_Y
        let soasPACK_LENGTH: string = "'0'";
        let soasPACK_WIDTH: string = "'0'";
        let soasPACK_HEIGHT: string = "'0'";
        let soasCATEGORY_SOAS: string = "";
        let soasATTR_CATEGORY_0: string = "";
        let soasATTR_CATEGORY_1: string = "";
        let soasATTR_CATEGORY_2: string = "";
        let soasATTR_CATEGORY_3: string = "";
        let soasATTR_CATEGORY_4: string = "";
        let soasATTR_CATEGORY_5: string = "";
        let soasATTR_CATEGORY_6: string = "";
        let soasATTR_CATEGORY_7: string = "";
        let soasATTR_CATEGORY_8: string = "";
        let soasATTR_CATEGORY_9: string = "";
        let soasATTR_BASIN_TYPE: string = "";
        let soasATTR_COLOR: string = "";
        let soasATTR_BRAND: string = "";
        let soasATTR_YOUTUBE: string = "";
        let soasATTR_GROUP: string = "";
        let soasATTR_CRAFT: string = "";
        let soasATTR_DELIVERY_TIME: string = "";
        let soasATTR_SHOP_ACTIVE: number = 1;
        let soasATTR_FEATURE: string = "";
        let soasATTR_WEIGHT_COMB: string = "";
        let soasATTR_WP_BM: string = "";
        let soasCROSSSELLING: string = "";
        let soasRAW_FLG: boolean = false;
        let soasCROSSSELLING_FLG: boolean = false;

        // Compare SAGE and SOAS entries to detect of already available items and then to do insert or update
        if (resultNewITMMASTER && resultNewITMMASTER.length) {
            for (let i = 0; i < resultNewITMMASTER.length; i++) {

                sageItmNum = resultNewITMMASTER[i].ITMREF_0.trim();
                // @ts-ignore
                let soasItem = await mssqlCall.mssqlCall("SELECT * FROM " + constants.DB_TABLE_PREFIX + "ITEM_BASIS " +
                    "WHERE ITMNUM = '" + sageItmNum + "';");
                duplicated = soasItem && soasItem.length ? true : false;
                // console.log("duplicated: ", duplicated);

                // Fields of ITEM_BASIS table
                soasITMNUM = sageItmNum;
                soasITMDES = resultNewITMMASTER[i].ITMDES1_0.trim();
                soasITMDES_UC = resultNewITMMASTER[i].ITMDES2_0.trim();
                soasEANCOD = resultNewITMMASTER[i].EANCOD_0;
                // Workaround to solve wrong EAN with , at end : remove ,
                if (soasEANCOD.length === 14) { // && (soasEANCOD.substr(soasEANCOD.length-1,soasEANCOD.length) === ',')){
                    soasEANCOD = soasEANCOD.substr(0, soasEANCOD.length - 1);
                }
                soasCATEGORY_SOAS = resultNewITMMASTER[i].TCLCOD_0.trim();

                soasART_LENGTH = resultNewITMMASTER[i].ATTRIBUT4_0; //checkNumber(resultNewITMMASTER[i].ATTRIBUT4_0); //nvarchar(50)
                soasART_WIDTH = resultNewITMMASTER[i].ATTRIBUT5_0; //nvarchar(50)
                soasART_HEIGHT = resultNewITMMASTER[i].ATTRIBUT6_0; //nvarchar(50) // 86,80
                soasPACK_LENGTH = resultNewITMMASTER[i].ZPACKLENGTH_0;  // numeric(14,5)
                soasPACK_WIDTH = resultNewITMMASTER[i].ZPACKWIDTH_0;  // numeric(14,5)
                soasPACK_HEIGHT = resultNewITMMASTER[i].ZPACKHEIGHT_0;  // numeric(14,5)
                soasITMWEIGHT = resultNewITMMASTER[i].ITMWEI_0; // numeric(13,4)

                soasATTR_CRAFT = "0";
                // soasATTR_SHOP_ACTIVE = resultNewITMMASTER[i].ZSHOPACTIVE_0; // Add to ATTRIBUTES
                soasATTR_SHOP_ACTIVE = parseInt(resultNewITMMASTER[i].ZSHOPACTIVE_0) === 2 ? 1 : 0; // Add to ATTRIBUTES

                // select distinct ITMSTA_0 from x3v65p.EMOPILOT.ITMMASTER where ITMREF_0 like 'MARS%'
                // 1 => active; 7 => not active
                soasACTIVE_FLG = parseInt(resultNewITMMASTER[i].ITMSTA_0) === 1 ? 1 : 0;

                // soasPACK_LENGTH = resultNewITMMASTER[i].ATTRIBUT13_0;

                // Fields for ATTRIBUTES/ATTRIBUTE_RELATIONS tables
                // ToDo: 2. Add this fields to ATTRIBUTE_RELATIONS table as pair (ITEM_BASIS_ID = '144', ATTRIBUTE_ID = '10'...)
                soasATTR_BASIN_TYPE = resultNewITMMASTER[i].ATTRIBUT2_0.trim();
                soasATTR_BRAND = resultNewITMMASTER[i].ATTRIBUT7_0.trim();
                soasATTR_CATEGORY_0 = resultNewITMMASTER[i].ATTRIBUT1_0.trim();
                soasATTR_CATEGORY_1 = resultNewITMMASTER[i].ATTRIBUT10_0.trim();
                soasATTR_CATEGORY_2 = "";
                soasATTR_CATEGORY_3 = "";
                soasATTR_CATEGORY_4 = "";
                soasATTR_CATEGORY_5 = "";
                soasATTR_CATEGORY_6 = "";
                soasATTR_CATEGORY_7 = "";
                soasATTR_CATEGORY_8 = "";
                soasATTR_CATEGORY_9 = "";
                soasATTR_COLOR = resultNewITMMASTER[i].ATTRIBUT3_0.trim(); // Farbe

                soasATTR_FEATURE = resultNewITMMASTER[i].ATTRIBUT12_0.trim();
                soasATTR_GROUP = resultNewITMMASTER[i].ATTRIBUT11_0.trim();
                soasATTR_YOUTUBE = resultNewITMMASTER[i].ATTRIBUT8_0.trim();

                soasATTR_DELIVERY_TIME = "";
                soasATTR_WEIGHT_COMB = "";
                soasATTR_WP_BM = "";

                // ToDo: 3. Check first, if Crossselling data already exists in CROSSSELLING table. Then write ID of it into CROSSSELLING field.
                //  Otherwise insert Crossselling data to CROSSSELLING table, get the ID of new entry and save the ID to CROSSSELLING field
                soasCROSSSELLING = resultNewITMMASTER[i].ZCROSSSELL_0.trim();
                // @ts-ignore
                soasCROSSSELLING = replaceAll(soasCROSSSELLING, ';', ',');
                if (soasCROSSSELLING.substr(soasCROSSSELLING.length - 1, soasCROSSSELLING.length) === ',') {
                    soasCROSSSELLING = soasCROSSSELLING.substr(0, soasCROSSSELLING.length - 1); // remove last ,
                }
                soasRAW_FLG = false;
                soasCROSSSELLING_FLG = false; // Update value after all articles are inserted...

                // ToDo: 4. Check Date Format with "Add new ITEM" via Frontend

                // ToDo: Add ID's of allAttributes to default attributes... {name:, data:, id: }

                // @ts-ignore
                let ARTICLE_DEFAULT_ATTRIBUTES: string[{ name, data }] = [
                    {name: 'ATTR_BRAND', data: soasATTR_BRAND},
                    {name: 'ATTR_CATEGORY_0', data: soasATTR_CATEGORY_0},
                    {name: 'ATTR_CATEGORY_1', data: soasATTR_CATEGORY_1},
                    {name: 'ATTR_GROUP', data: soasATTR_GROUP},
                    {name: 'ATTR_COLOR', data: soasATTR_COLOR},
                    {name: 'ATTR_FEATURE', data: soasATTR_FEATURE},
                    // {name: 'ATTR_YOUTUBE', data: soasATTR_YOUTUBE},
                    {name: 'ATTR_SHOP_ACTIVE', data: soasATTR_SHOP_ACTIVE}]; // ToDo: Muss ATTR_SHOP_ACTIVE zu default Attributen gehören?

                // for all other categories then SET, add only not empty attributes
                if (soasCATEGORY_SOAS !== 'SET') {
                    ARTICLE_DEFAULT_ATTRIBUTES = [];
                    if (soasATTR_BRAND.length > 0) {
                        ARTICLE_DEFAULT_ATTRIBUTES.push({name: 'ATTR_BRAND', data: soasATTR_BRAND});
                    }
                    if (soasATTR_CATEGORY_0.length > 0) {
                        ARTICLE_DEFAULT_ATTRIBUTES.push({name: 'ATTR_CATEGORY_0', data: soasATTR_CATEGORY_0});
                    }
                    if (soasATTR_CATEGORY_1.length > 0) {
                        ARTICLE_DEFAULT_ATTRIBUTES.push({name: 'ATTR_CATEGORY_1', data: soasATTR_CATEGORY_1});
                    }
                    if (soasATTR_GROUP.length > 0) {
                        ARTICLE_DEFAULT_ATTRIBUTES.push({name: 'ATTR_GROUP', data: soasATTR_GROUP});
                    }
                    if (soasATTR_COLOR.length > 0) {
                        ARTICLE_DEFAULT_ATTRIBUTES.push({name: 'ATTR_COLOR', data: soasATTR_COLOR});
                    }
                    if (soasATTR_FEATURE.length > 0) {
                        ARTICLE_DEFAULT_ATTRIBUTES.push({name: 'ATTR_FEATURE', data: soasATTR_FEATURE});
                    }
                    // if (soasATTR_YOUTUBE.length > 0) {
                    //     ARTICLE_DEFAULT_ATTRIBUTES.push({name: 'ATTR_YOUTUBE', data: soasATTR_YOUTUBE});
                    // }
                    // ToDo: ATTR_SHOP_ACTIVE relevant for KOMP, HAUPT, SERV ???
                    ARTICLE_DEFAULT_ATTRIBUTES.push({name: 'ATTR_SHOP_ACTIVE', data: soasATTR_SHOP_ACTIVE});
                }

                // if (updateFlag) {
                // add id's to default attributes
                ARTICLE_DEFAULT_ATTRIBUTES = await getDefaultAttributesIds(ARTICLE_DEFAULT_ATTRIBUTES, soasITMNUM);
                // }

                if (!duplicated) {
                    // @ts-ignore
                    // insertItmBasisData.push([soasITMNUM, soasITMDES, soasITMDES_UC, soasEANCOD, soasCATEGORY_SOAS, soasART_LENGTH, soasART_WIDTH, soasART_HEIGHT, soasPACK_LENGTH, soasPACK_WIDTH, soasPACK_HEIGHT, soasITMWEIGHT, soasACTIVE_FLG, soasRAW_FLG, soasCROSSSELLING_FLG]); // soasATTR_CRAFT, soasCROSSSELLING,

                    let insertItmBasisDataQuery = "INSERT INTO " + constants.DB_TABLE_PREFIX + "ITEM_BASIS " +
                        "(ITMNUM,ITMDES,ITMDES_UC,EANCOD,CATEGORY_SOAS,ART_LENGTH,ART_WIDTH,ART_HEIGHT,PACK_LENGTH," +
                        "PACK_WIDTH,PACK_HEIGHT,ITMWEIGHT,ACTIVE_FLG,RAW_FLG,CROSSSELLING_FLG) VALUES ";
                    insertItmBasisDataQuery += "('" + soasITMNUM + "','" + soasITMDES + "','" + soasITMDES_UC + "','" + soasEANCOD + "'," +
                        "'" + soasCATEGORY_SOAS + "'," +
                        checkNumber(soasART_LENGTH) + "," + checkNumber(soasART_WIDTH) + "," + checkNumber(soasART_HEIGHT) + "," +
                        checkNumber(soasPACK_LENGTH) + "," + checkNumber(soasPACK_WIDTH) + "," + checkNumber(soasPACK_HEIGHT) + "," +
                        checkNumber(soasITMWEIGHT) + "," +
                        "'" + soasACTIVE_FLG + "','" + soasRAW_FLG + "','" + soasCROSSSELLING_FLG + "');";
                    console.log("Execute insert ITEM_BASIS query: ", insertItmBasisDataQuery);
                    // @ts-ignore
                    await mssqlCall.mssqlCall(insertItmBasisDataQuery);
                    // @ts-ignore
                    let newSoasItemId = await mssqlCall.mssqlCall("SELECT ID FROM " + constants.DB_TABLE_PREFIX + "ITEM_BASIS " +
                        "WHERE ITMNUM = '" + soasITMNUM + "';");
                    if (newSoasItemId && newSoasItemId.length) {
                        insertedItemBasis++;
                        if ((soasCATEGORY_SOAS === 'SET') || soasCROSSSELLING.trim().length > 0) {
                            let crosssellingQuery = "INSERT INTO " + constants.DB_TABLE_PREFIX + "CROSSSELLING " +
                                "(CROSSSELLING_DATA) VALUES ('";
                            let splittedCrossItems: string[] = soasCROSSSELLING.split(',');
                            for (let soasCrossItem in splittedCrossItems) {
                                crosssellingQuery += splittedCrossItems[soasCrossItem] + ",";
                            }
                            crosssellingQuery = crosssellingQuery.trim();
                            if (crosssellingQuery.substr(crosssellingQuery.length - 1, crosssellingQuery.length) === ',') {
                                crosssellingQuery = crosssellingQuery.substr(0, crosssellingQuery.length - 1); // remove last ,
                            }
                            crosssellingQuery += "');";
                            // @ts-ignore
                            // insertCrossQueries[soasITMNUM] = crosssellingQuery;
                            // console.log("Execute insert CROSSSELLING query: ", crosssellingQuery);
                            // @ts-ignore
                            await mssqlCall.mssqlCall(crosssellingQuery);

                            // @ts-ignore
                            let newSoasCrossId = await mssqlCall.mssqlCall("SELECT TOP(1) CROSSSELLING_ID " +
                                "FROM " + constants.DB_TABLE_PREFIX + "CROSSSELLING ORDER BY CROSSSELLING_ID DESC;"); // WHERE CROSSSELLING_DATA = '" + soasITMNUM + "'
                            if (newSoasCrossId && newSoasCrossId.length) {
                                insertedCrossselling++;
                                let updateCrosssellingQuery = "UPDATE " + constants.DB_TABLE_PREFIX + "ITEM_BASIS " +
                                    "SET CROSSSELLING = '" + newSoasCrossId[0].CROSSSELLING_ID + "' WHERE ID = '" + newSoasItemId[0].ID + "';";
                                console.log('updateCrosssellingQuery: ', updateCrosssellingQuery);
                                // @ts-ignore
                                await mssqlCall.mssqlCall(updateCrosssellingQuery);
                            } else {
                                console.log("ERROR insert CROSSSELLING failed!");
                                console.log("ERROR-Query: ", crosssellingQuery);
                            }
                        }

                        if ((soasCATEGORY_SOAS === 'SET') || soasATTR_YOUTUBE.length > 0) {
                            let attributesYoutubeQuery = "INSERT INTO " + constants.DB_TABLE_PREFIX + "ATTRIBUTES " +
                                "(ATTRIBUTE_NAME, ATTRIBUTE_DATA) VALUES (";
                            attributesYoutubeQuery += "'ATTR_YOUTUBE','" + soasATTR_YOUTUBE + "'" + ");"; // soasATTR_YOUTUBE = resultNewITMMASTER[i].ATTRIBUT8_0;
                            // @ts-ignore
                            // attributesYoutubeInsertQuery[soasITMNUM] = attributesYoutubeQuery;
                            console.log("Execute insert YOUTUBE query: ", attributesYoutubeQuery);
                            // @ts-ignore
                            await mssqlCall.mssqlCall(attributesYoutubeQuery);

                            // @ts-ignore
                            let insertedAttributesIdResult: [{ ID }] = await mssqlCall.mssqlCall("SELECT TOP 1 ID " +
                                "FROM " + constants.DB_TABLE_PREFIX + "ATTRIBUTES ORDER BY ID DESC;");
                            if (insertedAttributesIdResult && insertedAttributesIdResult[0] && insertedAttributesIdResult[0].ID) {
                                let attrRelInsertQuery = "INSERT INTO " + constants.DB_TABLE_PREFIX + "ATTRIBUTE_RELATIONS " +
                                    "(ITEM_BASIS_ID,ATTRIBUTE_ID) VALUES " +
                                    "('" + newSoasItemId[0].ID + "','" + insertedAttributesIdResult[0].ID + "');";
                                console.log("attrRelInsertQuery: ", attrRelInsertQuery);
                                // @ts-ignore
                                await mssqlCall.mssqlCall(attrRelInsertQuery);
                                insertedAttributes++;
                            } else {
                                console.log("ERROR insert ATTRIBUTE YOUTUBE failed!");
                                console.log("ERROR-Query: ", attributesYoutubeQuery);
                            }
                        }

                        // Get Id's of default attributes

                        // @ts-ignore
                        // insertAttributesRelations[soasITMNUM] = [];

                        // too slow... if using, remove if (updateFlag) { ... at getDefaultAttributesIds

                        if (ARTICLE_DEFAULT_ATTRIBUTES.length > 0) {
                            // console.log("ARTICLE_DEFAULT_ATTRIBUTES: ", ARTICLE_DEFAULT_ATTRIBUTES);
                            for (let defAttrItem in ARTICLE_DEFAULT_ATTRIBUTES) {
                                if (ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].id && ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].name != 'ATTR_YOUTUBE') {
                                    let attrRelInsertQuery = "INSERT INTO " + constants.DB_TABLE_PREFIX + "ATTRIBUTE_RELATIONS " +
                                        "(ITEM_BASIS_ID,ATTRIBUTE_ID) VALUES " +
                                        "('" + newSoasItemId[0].ID + "','" + ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].id + "');";
                                    console.log("attrRelInsertQuery: ", attrRelInsertQuery);
                                    // @ts-ignore
                                    await mssqlCall.mssqlCall(attrRelInsertQuery);
                                    insertedAttributes++;
                                } else {
                                    console.log("ERROR: ATTRIBUTE " + ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].name + " - " +
                                        ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].data + " has no ID! Try to insert Attribute... ITMNUM-ID: " + newSoasItemId[0].ID);
                                    let attrInsertQuery = "INSERT INTO " + constants.DB_TABLE_PREFIX + "ATTRIBUTES " +
                                        "(ATTRIBUTE_NAME,ATTRIBUTE_DATA) VALUES " +
                                        "('" + ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].name + "','" + ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].data + "');";
                                    console.log("attrInsertQuery: ", attrInsertQuery);
                                    // @ts-ignore
                                    await mssqlCall.mssqlCall(attrInsertQuery);

                                    // @ts-ignore
                                    let newSoasAttrId = await mssqlCall.mssqlCall("SELECT TOP(1) ID " +
                                        "FROM " + constants.DB_TABLE_PREFIX + "ATTRIBUTES " +
                                        "WHERE ATTRIBUTE_NAME = '" + ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].name + "' AND " +
                                        "ATTRIBUTE_DATA = '" + ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].data + "' ORDER BY ID DESC ;");
                                    if (newSoasAttrId && newSoasAttrId.length) {
                                        let attrRelInsertQuery = "INSERT INTO " + constants.DB_TABLE_PREFIX + "ATTRIBUTE_RELATIONS " +
                                            "(ITEM_BASIS_ID,ATTRIBUTE_ID) VALUES " +
                                            "('" + newSoasItemId[0].ID + "','" + newSoasAttrId[0].ID + "');";
                                        console.log("attrRelInsertQuery: ", attrRelInsertQuery);
                                        // @ts-ignore
                                        await mssqlCall.mssqlCall(attrRelInsertQuery);
                                        insertedAttributes++;
                                    } else {
                                        console.log("ERROR: INSERT ATTRIBUTE FAILED FOR: " + ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].name + " - " +
                                            ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].data + ". ITMNUM-ID: " + newSoasItemId[0].ID);
                                    }
                                }
                            }
                        }

                        /*
                        if (ARTICLE_DEFAULT_ATTRIBUTES.length > 0) {
                            for (let allAttrItem in allAttributes) {
                                for (let defAttrItem in ARTICLE_DEFAULT_ATTRIBUTES) {
                                    let allAttrName = allAttributes[allAttrItem];
                                    if (allAttrName) {
                                        allAttrName = allAttrName.ATTRIBUTE_NAME.trim();
                                        if ((allAttrName !== 'ATTR_YOUTUBE') && ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem] && ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].name) {
                                            if (allAttrName === ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].name) {
                                                if (allAttributes[allAttrItem].ATTRIBUTE_DATA.trim() === ((typeof ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].data === 'number') ? ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].data.toString().trim() : ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].data.trim())) {
                                                    let attrRelInsertQuery = "INSERT INTO " + constants.DB_TABLE_PREFIX + "ATTRIBUTE_RELATIONS (ITEM_BASIS_ID,ATTRIBUTE_ID) VALUES " +
                                                        "('" + newSoasItemId[0].ID + "','" + allAttributes[allAttrItem].ID + "');";
                                                    // console.log("attrRelInsertQuery: ", attrRelInsertQuery);
                                                    // @ts-ignore
                                                    await mssqlCall.mssqlCall(attrRelInsertQuery);
                                                    insertedAttributes++;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        */

                    } else {
                        console.log("ERROR insert ITEM_BASIS failed!");
                        console.log("ERROR-Query: ", insertItmBasisDataQuery);
                    }
                } else {
                    // Update items

                    // 1. Compare if SAGE and SOAS items (except ITMNUM) has difference
                    let updateItemBasisQuery: string = "UPDATE " + constants.DB_TABLE_PREFIX + "ITEM_BASIS SET ";
                    let changeDetected: boolean = false;
                    if (soasItem[0].ITMDES.toString() !== soasITMDES.toString()) {
                        updateItemBasisQuery += "ITMDES='" + soasITMDES + "',";
                        changeDetected = true;
                    }
                    if (soasItem[0].ITMDES_UC.toString() !== soasITMDES_UC.toString()) {
                        updateItemBasisQuery += "ITMDES_UC='" + soasITMDES_UC + "',";
                        changeDetected = true;
                    }
                    if (soasItem[0].EANCOD.toString() !== soasEANCOD.toString()) {
                        updateItemBasisQuery += "EANCOD='" + soasEANCOD + "',";
                        changeDetected = true;
                    }
                    if (soasItem[0].CATEGORY_SOAS.toString() !== soasCATEGORY_SOAS.toString()) {
                        updateItemBasisQuery += "CATEGORY_SOAS='" + soasCATEGORY_SOAS + "',";
                        changeDetected = true;
                    }
                    if (soasItem[0].ART_LENGTH.toString() !== checkNumber(soasART_LENGTH, true)) {
                        updateItemBasisQuery += "ART_LENGTH=" + checkNumber(soasART_LENGTH) + ",";
                        changeDetected = true;
                    }
                    if (soasItem[0].ART_WIDTH.toString() !== checkNumber(soasART_WIDTH, true)) {
                        updateItemBasisQuery += "ART_WIDTH=" + checkNumber(soasART_WIDTH) + ",";
                        changeDetected = true;
                    }
                    if (soasItem[0].ART_HEIGHT.toString() !== checkNumber(soasART_HEIGHT, true)) {
                        updateItemBasisQuery += "ART_HEIGHT=" + checkNumber(soasART_HEIGHT) + ",";
                        changeDetected = true;
                    }
                    if (soasItem[0].PACK_LENGTH.toString() !== checkNumber(soasPACK_LENGTH, true)) {
                        updateItemBasisQuery += "PACK_LENGTH=" + checkNumber(soasPACK_LENGTH) + ",";
                        changeDetected = true;
                    }
                    if (soasItem[0].PACK_WIDTH.toString() !== checkNumber(soasPACK_WIDTH, true)) {
                        updateItemBasisQuery += "PACK_WIDTH=" + checkNumber(soasPACK_WIDTH) + ",";
                        changeDetected = true;
                    }
                    if (soasItem[0].PACK_HEIGHT.toString() !== checkNumber(soasPACK_HEIGHT, true)) {
                        updateItemBasisQuery += "PACK_HEIGHT=" + checkNumber(soasPACK_HEIGHT) + ",";
                        changeDetected = true;
                    }
                    if (soasItem[0].ITMWEIGHT.toString() !== checkNumber(soasITMWEIGHT, true)) {
                        updateItemBasisQuery += "ITMWEIGHT=" + checkNumber(soasITMWEIGHT) + ",";
                        changeDetected = true;
                    }
                    if (soasItem[0].ACTIVE_FLG !== (soasACTIVE_FLG ? true : false)) {
                        updateItemBasisQuery += "ACTIVE_FLG='" + soasACTIVE_FLG + "',";
                        changeDetected = true;
                    }
                    if (soasItem[0].RAW_FLG !== (soasRAW_FLG ? true : false)) {
                        updateItemBasisQuery += "RAW_FLG='" + soasRAW_FLG + "',";
                        changeDetected = true;
                    }
                    // if (soasItem[0].CROSSSELLING_FLG !== (soasCROSSSELLING_FLG ? true : false)) {
                    //     updateItemBasisQuery += "CROSSSELLING_FLG='" + soasCROSSSELLING_FLG + "',";
                    //     changeDetected = true;
                    // }
                    updateItemBasisQuery = changeDetected ? updateItemBasisQuery.substr(0, updateItemBasisQuery.length-1) : updateItemBasisQuery;
                    // 1a. If differences, update SOAS item via query
                    if (changeDetected) {
                        updateItemBasisQuery += " WHERE ID = '" + soasItem[0].ID + "' AND ITMNUM = '" + sageItmNum + "';";
                        console.log("updateItemBasisQuery: ", updateItemBasisQuery);
                        // @ts-ignore
                        await mssqlCall.mssqlCall(updateItemBasisQuery);
                        updatedItemBasis++;
                    }

                    // 2. Get via query SOAS crossselling item
                    if ((soasItem[0].CROSSSELLING && soasItem[0].CROSSSELLING.length) || (soasCROSSSELLING && soasCROSSSELLING.length)) {
                        // @ts-ignore
                        let soasCrosssellingItem = await mssqlCall.mssqlCall("SELECT * " +
                            "FROM " + constants.DB_TABLE_PREFIX + "CROSSSELLING WHERE CROSSSELLING_ID = '" + soasItem[0].CROSSSELLING + "';");
                        if (soasCrosssellingItem && soasCrosssellingItem.length) {
                            if ((soasCATEGORY_SOAS === 'SET') || soasCROSSSELLING.trim().length > 0) {
                                // 2a. Compare if SAGE and SOAS crossselling items has difference
                                if (soasCrosssellingItem[0].CROSSSELLING_DATA !== soasCROSSSELLING) {
                                    // 2b. If differences, update crossselling item
                                    let updateCrosssellingQuery = "UPDATE " + constants.DB_TABLE_PREFIX + "CROSSSELLING " +
                                        "SET CROSSSELLING_DATA = '" + soasCROSSSELLING + "' WHERE CROSSSELLING_ID = '" + soasItem[0].CROSSSELLING + "';";
                                    console.log('updateCrosssellingQuery: ', updateCrosssellingQuery);
                                    // @ts-ignore
                                    await mssqlCall.mssqlCall(updateCrosssellingQuery);
                                    updatedCrossselling++;
                                }
                            }
                        } else {
                            // 2c. If SOAS crossselling not available, insert crossselling item
                            // ToDo duplicate code... move to function ?
                            if ((soasCATEGORY_SOAS === 'SET') || soasCROSSSELLING.trim().length > 0) {
                                let crosssellingQuery = "INSERT INTO " + constants.DB_TABLE_PREFIX + "CROSSSELLING " +
                                    "(CROSSSELLING_DATA) VALUES ('";
                                let splittedCrossItems: string[] = soasCROSSSELLING.split(',');
                                for (let soasCrossItem in splittedCrossItems) {
                                    crosssellingQuery += splittedCrossItems[soasCrossItem] + ",";
                                }
                                crosssellingQuery = crosssellingQuery.trim();
                                if (crosssellingQuery.substr(crosssellingQuery.length - 1, crosssellingQuery.length) === ',') {
                                    crosssellingQuery = crosssellingQuery.substr(0, crosssellingQuery.length - 1); // remove last ,
                                }
                                crosssellingQuery += "');";
                                console.log("Execute insert CROSSSELLING query: ", crosssellingQuery);
                                // @ts-ignore
                                await mssqlCall.mssqlCall(crosssellingQuery);

                                // @ts-ignore
                                let newSoasCrossId = await mssqlCall.mssqlCall("SELECT TOP(1) CROSSSELLING_ID " +
                                    "FROM " + constants.DB_TABLE_PREFIX + "CROSSSELLING ORDER BY CROSSSELLING_ID DESC;"); // WHERE CROSSSELLING_DATA = '" + soasITMNUM + "'
                                if (newSoasCrossId && newSoasCrossId.length) {
                                    insertedCrossselling++;
                                    let updateCrosssellingQuery = "UPDATE " + constants.DB_TABLE_PREFIX + "ITEM_BASIS " +
                                        "SET CROSSSELLING = '" + newSoasCrossId[0].CROSSSELLING_ID + "' WHERE ID = '" + soasItem[0].ID + "';";
                                    console.log("Execute update CROSSSELLING query: ", updateCrosssellingQuery);
                                    // @ts-ignore
                                    await mssqlCall.mssqlCall(updateCrosssellingQuery);
                                } else {
                                    console.log("ERROR insert CROSSSELLING failed!");
                                    console.log("ERROR-Query: ", crosssellingQuery);
                                }
                            }
                        }
                    } else {
                        // console.log("No crossselling data found in SAGE and SOAS...");
                    }


                    // 3. Get via query SOAS attributes item
                    let soasAttributesQuery: string = "SELECT * FROM " + constants.DB_TABLE_PREFIX + "ATTRIBUTE_RELATIONS AR " +
                        "LEFT JOIN " + constants.DB_TABLE_PREFIX + "ATTRIBUTES AA ON AA.ID = AR.ATTRIBUTE_ID " +
                        "WHERE AR.ITEM_BASIS_ID = '" + soasItem[0].ID + "';";
                    // @ts-ignore
                    let soasAttributesItems = await mssqlCall.mssqlCall(soasAttributesQuery);
                    if (soasAttributesItems && soasAttributesItems.length) {
                        // 3a. Compare if SAGE and SOAS attributes items has differences
                        // Youtube
                        let youtubeAttributeChanged: boolean = false;
                        if ((soasCATEGORY_SOAS === 'SET') || soasATTR_YOUTUBE.length > 0) {
                            for(let attrItem in soasAttributesItems) {
                                if (soasAttributesItems[attrItem].ATTRIBUTE_NAME === 'ATTR_YOUTUBE' &&
                                    soasAttributesItems[attrItem].ATTRIBUTE_DATA !== soasATTR_YOUTUBE) {
                                    let updateAttributesQuery = "UPDATE " + constants.DB_TABLE_PREFIX + "ATTRIBUTES " +
                                        "SET ATTRIBUTE_DATA = '" + soasATTR_YOUTUBE + "' " +
                                        "WHERE ID = '" + soasAttributesItems[attrItem].ID + "';";
                                    console.log("Execute update Attributes Youtube query: ", updateAttributesQuery);
                                    // @ts-ignore
                                    await mssqlCall.mssqlCall(updateAttributesQuery);
                                    updatedAttributes++;
                                    break;
                                }
                            }
                        }

                        // Other attributes => only update relations, don't change default attributes!
                        /*
                        if (ARTICLE_DEFAULT_ATTRIBUTES.length > 0) {
                            for (let attrItem in soasAttributesItems) {
                                for (let defAttrItem in ARTICLE_DEFAULT_ATTRIBUTES) {
                                    let soasAttrName = soasAttributesItems[attrItem];
                                    if (soasAttrName) {
                                        soasAttrName = soasAttrName.ATTRIBUTE_NAME.trim();
                                        if ((soasAttrName !== 'ATTR_YOUTUBE') && ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem] && ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].name) {
                                            if (soasAttrName === ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].name) {
                                                let sageAttrData = (typeof ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].data === 'number') ? ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].data.toString().trim() : ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].data.trim();
                                                // 3b. If differences, update attributes item
                                                if (soasAttributesItems[attrItem].ATTRIBUTE_DATA.trim() !== sageAttrData) {
                                                    let updateAttributesQuery = "UPDATE " + constants.DB_TABLE_PREFIX + "ATTRIBUTES SET ATTRIBUTE_DATA = '" + sageAttrData + "' " +
                                                        "WHERE ID = '" + soasAttributesItems[attrItem].ID + "';";
                                                    console.log("Execute update Attributes Other query: ", updateAttributesQuery);
                                                    // @ts-ignore
                                                    await mssqlCall.mssqlCall(updateAttributesQuery);
                                                    updatedAttributes++;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                         */


                        if (ARTICLE_DEFAULT_ATTRIBUTES.length > 0) {
                            if (soasAttributesItems && soasAttributesItems.length) {
                                for (let defAttrItem in ARTICLE_DEFAULT_ATTRIBUTES) {
                                    let defAttrFound: boolean = false;
                                    for (let attrItem in soasAttributesItems) {
                                        // check if attribute name of relation already exists:
                                        if (soasAttributesItems[attrItem].ATTRIBUTE_NAME !== 'ATTR_YOUTUBE' &&
                                            ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem] &&
                                            soasAttributesItems[attrItem].ATTRIBUTE_NAME === ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].name) {
                                            defAttrFound = true;
                                            // Update here
                                            // Attribute with same attribute name is already available...
                                            // Check if attributes have different id's, if not, replace relation item with new id
                                            // @ts-ignore
                                            if (parseInt(soasAttributesItems[attrItem].ID) !== parseInt(ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].id)) {
                                                // Replace relation attribute id with new one...
                                                let attrRelationReplaceQuery = "UPDATE " + constants.DB_TABLE_PREFIX + "ATTRIBUTE_RELATIONS SET " +
                                                    "ATTRIBUTE_ID = '" + ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].id + "' " +
                                                    "WHERE ITEM_BASIS_ID = '" + soasItem[0].ID + "' AND ATTRIBUTE_ID = '" + soasAttributesItems[attrItem].ID + "';";
                                                console.log("attrRelationReplaceQuery: ", attrRelationReplaceQuery);
                                                // @ts-ignore
                                                let attributesRelationsReplaceQueryResult = await mssqlCall.mssqlCall(attrRelationReplaceQuery);
                                                updatedAttributes++;
                                            }
                                            break;
                                        }
                                    }
                                    if (!defAttrFound) {
                                        for (let allAttrItem in allAttributes) {
                                            let allAttrName = allAttributes[allAttrItem];
                                            if (allAttrName) {
                                                allAttrName = allAttrName.ATTRIBUTE_NAME.trim();
                                                if ((allAttrName !== 'ATTR_YOUTUBE') && ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem] && ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].name) {
                                                    if (allAttrName === ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].name) {
                                                        if (allAttributes[allAttrItem].ATTRIBUTE_DATA.trim() ===
                                                            ((typeof ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].data === 'number') ? ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].data.toString().trim() : ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem].data.trim())) {
                                                            let attrRelInsertQuery = "INSERT INTO " + constants.DB_TABLE_PREFIX + "ATTRIBUTE_RELATIONS " +
                                                                "(ITEM_BASIS_ID,ATTRIBUTE_ID) VALUES " +
                                                                "('" + soasItem[0].ID + "','" + allAttributes[allAttrItem].ID + "');";
                                                            console.log("attrRelInsertQuery: ", attrRelInsertQuery);
                                                            // @ts-ignore
                                                            await mssqlCall.mssqlCall(attrRelInsertQuery);
                                                            insertedAttributes++;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        console.log("ERROR update attributes failed! Not attributes items found in SOAS.");
                        console.log("ERROR-Query: ", soasAttributesQuery);
                    }

                    // 3c. If SOAS not available, insert attributes item
                    // ToDo: insert attributes if not found in SOAS
                }
            }

            return {insertedItemBasis: insertedItemBasis, insertedCrossselling: insertedCrossselling, insertedAttributes: insertedAttributes,
                updatedItemBasis: updatedItemBasis, updatedCrossselling: updatedCrossselling, updatedAttributes: updatedAttributes};

        } else {
            if (debug) {
                console.log('sage_add_new_itm_master - Duplicate found. Ignore following ITMNUM: ' + sageItmNum);
            }
            return;
        }
    },

    /**
     * @ToDo Implement adding of SAGE TCLCOD_0 field data to orders positions and check import
     *
     * @param resultNewSORDER
     * @param lastOrderNumber
     * @param lastCustomersAddressesId
     * @param soasOrders
     * @param soasAllOrdersPositions
     * @param statesResult
     * @param soasAllCustomers
     * @param soasAllCustomersAddresses
     * @param soasAllCurrencies
     * @param soasAllPaymentTerms
     * @param updateFlag
     * @param resultArray
     */
    sage_add_new_sorders: function (resultNewSORDER: any, lastOrderNumber: any, lastCustomersAddressesId: any,
                                    soasOrders: any, soasAllOrdersPositions: any, statesResult: any, soasAllCustomers: any,
                                    soasAllCustomersAddresses: any, soasAllCurrencies: any, soasAllPaymentTerms: any,
                                    updateFlag: boolean, resultArray: any) {
        let duplicated: boolean = false;
        let sageSOHNUM: string = "";
        let ordersData: never[] | any[][] = [];
        let ordersDataPosition: never[] | any[][] = [];

        /// SOAS ORDERS DB Fields ///

        let soasORDERS_NUMBER: string = "";
        let soasCLIENT: string = "";
        let soasORDERS_TYPE: string = "";
        let soasPROJECT_FIELD_0: string = "";
        let soasPROJECT_FIELD_1: string = "";
        let soasPROJECT_FIELD_2: string = "";
        let soasCUSTOMER_ORDER: string = "";
        let soasCUSTOMER_DELIVERY: string = "";
        let soasCUSTOMER_INVOICE: string = "";
        let soasORDERS_DATE: string = "";
        let soasORDERAMOUNT_NET: number = 0;
        let soasORDERAMOUNT_BRU: number = 0;
        let soasCUSTOMER_ORDERREF: string = "";
        let soasLAST_DELIVERY: string = "";
        let soasLAST_INVOICE: string = "";
        let soasEDI_ORDERRESPONSE_SENT: number = 0;
        let soasPAYMENT_TERM_ID: string = "";
        let soasRELEASE: number = 0;
        let soasPAYED: number = 0;
        let soasCURRENCY: string = "";
        let soasORDERS_STATE: number = 10;
        let soasCUSTOMER_ADDRESSES_ID_DELIVERY: string = "";
        let soasCUSTOMER_ADDRESSES_ID_INVOICE: string = "";

        // let soasCUSTOMER_PAYMENT_TERM_ID: string = "";
        let soasCUSTOMER_WEBSHOP_ID: number = 0;
        let soasCUSTOMER_WEBSHOP_ORDER_REF: string = '';
        let soasCUSTOMER_DISCOUNT: number = 0.0;
        let soasCUSTOMER_VOUCHER: number = 0.0;
        let soasCUSTOMER_SHIPPING_COSTS: number = 0.0;

        /// SOAS ORDERS POSITIONS DB Fields ///

        let soas_OP_ORDERS_NUMBER: string = "";
        let soas_OP_ITMNUM: string = "";
        let soas_OP_ORDER_QTY: number = 0;
        let soas_OP_ASSIGNED_QTY: number = 0;
        let soas_OP_PRICE_NET: number = 0;
        let soas_OP_PRICE_BRU: number = 0;
        let soas_OP_CURRENCY: string = "";
        let soas_OP_POSITION_STATUS: number = 0;
        let soas_OP_POSITION_ID: number = 0; // SOPLIN_0
        let soas_OP_CATEGORY: string = ""; // TCLCOD_0

        // console.log('resultNewSORDER: ', resultNewSORDER);
        if (resultNewSORDER && resultNewSORDER.length) {
            for (let i = 0; i < resultNewSORDER.length; i++) {
                // console.log("resultNewSORDER[i]: ", resultNewSORDER[i]);
                duplicated = false;
                sageSOHNUM = resultNewSORDER[i].SOHNUM_0.trim();
                // console.log('sageSOHNUM: ', sageSOHNUM);
                if (resultArray) {
                    // console.log('resultArray[0].length: ', resultArray[0].length);
                    for (let j = 0; j < resultArray[0].length; j++) {
                        if (resultArray[0][j]) {
                            // console.log('COMPARE 0: ', resultArray[0][j]);
                            // console.log('COMPARE 1: ' + resultArray[0][j][0] + " === " + sageSOHNUM);
                            // console.log('COMPARE 11: ' + (resultArray[0][j][0] === sageSOHNUM));
                            if (resultArray[0][j][0] === sageSOHNUM) {
                                duplicated = true;
                                j = resultArray[0].length;
                            }
                        }
                    }
                }
                if (updateFlag || !duplicated) {
                    for (let k = 0; k < soasOrders.length; k++) {
                        if (soasOrders[k]) {
                            if (soasOrders[k].ORDERS_NUMBER === sageSOHNUM) {
                                // console.log('FOUND SAME ORDERS_NUMBER: ', sageSOHNUM);
                                duplicated = true;
                                k = soasOrders.length;
                            }
                        }
                    }
                }
                // console.log('duplicated: ', duplicated);
                if (updateFlag || !duplicated) {

                    /// SOAS ORDERS DB Fields ///

                    soasORDERS_NUMBER = sageSOHNUM;
                    soasCUSTOMER_ORDER = resultNewSORDER[i].BPCORD_0.trim(); // CUSORDREF_0
                    soasCUSTOMER_DELIVERY = soasCUSTOMER_ORDER;
                    soasCUSTOMER_INVOICE = soasCUSTOMER_ORDER;
                    soasCLIENT = "";
                    soasCUSTOMER_ADDRESSES_ID_DELIVERY = "";
                    soasCUSTOMER_ADDRESSES_ID_INVOICE = "";

                    if (soasCUSTOMER_ORDER && soasCUSTOMER_ORDER != '') {
                        let soasCustomerFound: boolean = false;
                        for (let cusItem in soasAllCustomers[soasCUSTOMER_ORDER]) {
                            soasCustomerFound = true;
                            soasCLIENT = soasAllCustomers[soasCUSTOMER_ORDER][cusItem]['CUSTOMERS_TYPE'];
                            break;
                        }
                        if (soasCustomerFound) {
                            let soasCustomerAddressFound: boolean = false;
                            for (let cusAddrItem in soasAllCustomersAddresses[soasCUSTOMER_ORDER]) {
                                if (soasAllCustomersAddresses[soasCUSTOMER_ORDER][cusAddrItem]['ADDRESS_TYPE'] === 'DLV') {
                                    soasCUSTOMER_ADDRESSES_ID_DELIVERY = soasAllCustomersAddresses[soasCUSTOMER_ORDER][cusAddrItem]['ID'];
                                } else if (soasAllCustomersAddresses[soasCUSTOMER_ORDER][cusAddrItem]['ADDRESS_TYPE'] === 'INV') {
                                    soasCUSTOMER_ADDRESSES_ID_INVOICE = soasAllCustomersAddresses[soasCUSTOMER_ORDER][cusAddrItem]['ID'];
                                }
                                if (soasCUSTOMER_ADDRESSES_ID_DELIVERY.length > 0 && soasCUSTOMER_ADDRESSES_ID_INVOICE.length > 0) {
                                    soasCustomerAddressFound = true;
                                    break;
                                }
                            }
                            if (!soasCustomerAddressFound) {
                                soasORDERS_DATE = checkDate(resultNewSORDER[i].ORDDAT_0);
                                // let trimmedSoasORDERS_DATE = soasORDERS_DATE;
                                // if (typeof trimmedSoasORDERS_DATE === 'string') {
                                //     trimmedSoasORDERS_DATE = trimmedSoasORDERS_DATE.trim();
                                // }
                                // if (trimmedSoasORDERS_DATE && !(trimmedSoasORDERS_DATE != '')) {
                                //     soasORDERS_DATE = trimmedSoasORDERS_DATE.replace("T", " ").replace(".000Z", "");
                                // }

                                soasORDERAMOUNT_NET = resultNewSORDER[i].ORDNOT_0; // numeric(23,13)
                                soasORDERAMOUNT_BRU = resultNewSORDER[i].ORDATI_0; // numeric(23,13)
                                soasCUSTOMER_ORDERREF = resultNewSORDER[i].CUSORDREF_0.trim();
                                soasCUSTOMER_ORDERREF = replaceAll(soasCUSTOMER_ORDERREF, "'", "''");

                                // ToDo: Set following 7 fields
                                soasORDERS_TYPE = "webus";
                                soasPROJECT_FIELD_0 = "";
                                soasPROJECT_FIELD_1 = "";
                                soasPROJECT_FIELD_2 = "";
                                soasLAST_DELIVERY = "";
                                soasLAST_INVOICE = "";
                                soasEDI_ORDERRESPONSE_SENT = 0;

                                soasRELEASE = 0;
                                soasPAYED = 0;
                                soasORDERS_STATE = 10;

                                if (resultNewSORDER[i].ORDSTA_0 &&
                                    parseInt(resultNewSORDER[i].ORDSTA_0) === 2) {
                                    soasORDERS_STATE = 30; // statesResult
                                    soasRELEASE = 1;
                                    soasPAYED = 1;
                                }
                                // ToDo: Add logic for checking PaymentTerms > PAYMENT_CONFIRMED here, and set soasPAYED = 1

                                // Write Payment term directly name: PAYPAL or DE10T
                                soasPAYMENT_TERM_ID = resultNewSORDER[i].PTE_0.trim();
                                soasCURRENCY = resultNewSORDER[i].CUR_0.trim();

                                for (let currItem in soasAllCurrencies) {
                                    if (soasAllCurrencies[currItem].CURRENCY_ISO_CODE === soasCURRENCY.toUpperCase()) {
                                        soasCURRENCY = soasAllCurrencies[currItem].CURRENCY_ID;
                                        break;
                                    }
                                }

                                // check if an order item is already available in ordersData ?
                                // let orderDuplicate: boolean = false;
                                if (updateFlag) {
                                    duplicated = false;
                                }
                                if (!duplicated) {
                                    for (let ordItem in ordersData) {
                                        if (ordersData[ordItem][0] === soasORDERS_NUMBER) {
                                            // orderDuplicate = true;
                                            duplicated = true;
                                            break;
                                        }
                                    }
                                }

                                // ToDo: Check Date Format with "Add new ORDER" via Frontend
                                // 23 fields: [ORDERS_NUMBER],[CLIENT],[ORDERS_TYPE],[PROJECT_FIELD_0],[PROJECT_FIELD_1]
                                // ,[PROJECT_FIELD_2],[CUSTOMER_ORDER],[CUSTOMER_DELIVERY],[CUSTOMER_INVOICE],[ORDERS_DATE]
                                // ,[ORDERAMOUNT_NET],[ORDERAMOUNT_BRU],[CUSTOMER_ORDERREF],[LAST_DELIVERY],[LAST_INVOICE]
                                // ,[EDI_ORDERRESPONSE_SENT],[RELEASE],[PAYED],[CURRENCY],[ORDERS_STATE]
                                // ,[CUSTOMER_ADDRESSES_ID_DELIVERY],[CUSTOMER_ADDRESSES_ID_INVOICE]

                                if (!duplicated) { // !orderDuplicate
                                    // @ts-ignore
                                    ordersData.push([soasORDERS_NUMBER, soasCLIENT, soasORDERS_TYPE, soasPROJECT_FIELD_0, soasPROJECT_FIELD_1, soasPROJECT_FIELD_2, soasCUSTOMER_ORDER, soasCUSTOMER_DELIVERY, soasCUSTOMER_INVOICE, soasORDERS_DATE, soasORDERAMOUNT_NET, soasORDERAMOUNT_BRU, soasCUSTOMER_ORDERREF, soasLAST_DELIVERY, soasLAST_INVOICE, soasEDI_ORDERRESPONSE_SENT, soasRELEASE, soasPAYED, soasCURRENCY, soasORDERS_STATE, soasCUSTOMER_ADDRESSES_ID_DELIVERY, soasCUSTOMER_ADDRESSES_ID_INVOICE, soasPAYMENT_TERM_ID, soasCUSTOMER_WEBSHOP_ID, soasCUSTOMER_WEBSHOP_ORDER_REF, soasCUSTOMER_DISCOUNT, soasCUSTOMER_VOUCHER, soasCUSTOMER_SHIPPING_COSTS]);
                                } else {
                                    // console.log('Duplicate found for: ', soasORDERS_NUMBER);
                                }

                                // let orderPositionsItems = [{'SORDERQ': [], 'SORDERP': []}];
                                let orderPositionsItems: any = [];

                                for (let i = 0; i < resultNewSORDER.length; i++) {
                                    if (resultNewSORDER[i].SOHNUM_0.trim() === soasORDERS_NUMBER) {
                                        // ToDo: ALLQTY_0 is 0.
                                        orderPositionsItems.push({
                                            'SOHNUM_0': resultNewSORDER[i].SOHNUM_0.trim(),
                                            'ITMREF_0': resultNewSORDER[i].ITMREF_0.trim(),
                                            'QTY_0': resultNewSORDER[i].QTY_0.toString(),
                                            'ALLQTY_0': resultNewSORDER[i].ALLQTY_0.toString(),
                                            'NETPRINOT_0': resultNewSORDER[i].NETPRINOT_0.toString(),
                                            'NETPRIATI_0': resultNewSORDER[i].NETPRIATI_0.toString(),
                                            'VAT_0': resultNewSORDER[i].VAT_0.trim(),
                                            'SOPLIN_0': resultNewSORDER[i].SOPLIN_0.toString(),
                                            'TCLCOD_0': resultNewSORDER[i].TCLCOD_0.toString()
                                        });
                                    }
                                }

                                /// SOAS ORDERS POSITIONS DB Fields ///
                                // console.log('READY orderPositionsItems: ', orderPositionsItems);
                                // soas_OP_POSITION_STATUS
                                for (let oPItem in orderPositionsItems) {
                                    // check if an order position item is already available in ordersDataPosition ?
                                    let orderPositionDuplicate: boolean = false;
                                    for (let ordPosItem in ordersDataPosition) {

                                        // console.log('"COMPARE1: ' + ordersDataPosition[ordPosItem][0] + " === " + orderPositionsItems[oPItem].SOHNUM_0 + ' result: ' + (ordersDataPosition[ordPosItem][0] === orderPositionsItems[oPItem].SOHNUM_0));
                                        // console.log('"COMPARE11: ' + typeof ordersDataPosition[ordPosItem][0] + " === " + typeof orderPositionsItems[oPItem].SOHNUM_0 );
                                        // console.log('"COMPARE2: ' + ordersDataPosition[ordPosItem][1] + " === " + orderPositionsItems[oPItem].SOPLIN_0 + ' result: ' +  (ordersDataPosition[ordPosItem][1] === orderPositionsItems[oPItem].SOPLIN_0));
                                        // console.log('"COMPARE21: ' + typeof ordersDataPosition[ordPosItem][1] + " === " + typeof orderPositionsItems[oPItem].SOPLIN_0);
                                        // console.log('"COMPARE3: ' + ordersDataPosition[ordPosItem][2] + " === " + orderPositionsItems[oPItem].ITMREF_0.trim() + ' result: ' +  (ordersDataPosition[ordPosItem][2] === orderPositionsItems[oPItem].ITMREF_0.trim()));
                                        // console.log('"COMPARE31: ' + typeof ordersDataPosition[ordPosItem][2] + " === " + typeof orderPositionsItems[oPItem].ITMREF_0.trim());

                                        // Compare article-nr (itemnum)
                                        if ((ordersDataPosition[ordPosItem][0] === orderPositionsItems[oPItem].SOHNUM_0) &&
                                            (ordersDataPosition[ordPosItem][2] === orderPositionsItems[oPItem].ITMREF_0.trim()) &&
                                            (ordersDataPosition[ordPosItem][1] === orderPositionsItems[oPItem].SOPLIN_0)) {
                                            orderPositionDuplicate = true;
                                            break;
                                        }

                                    }
                                    // if (orderPositionsItems[oPItem].SOHNUM_0 == '10020AU62353') {
                                    //     throw new Error("FOUND");
                                    // }
                                    if (!orderPositionDuplicate) {
                                        // console.log('COMPARE-123: OK');
                                        soas_OP_ORDERS_NUMBER = sageSOHNUM;
                                        soas_OP_ITMNUM = orderPositionsItems[oPItem].ITMREF_0.trim();
                                        soas_OP_ORDER_QTY = orderPositionsItems[oPItem].QTY_0.toString();
                                        soas_OP_ASSIGNED_QTY = orderPositionsItems[oPItem].ALLQTY_0.toString();
                                        soas_OP_PRICE_NET = orderPositionsItems[oPItem].NETPRINOT_0.toString();
                                        soas_OP_PRICE_BRU = orderPositionsItems[oPItem].NETPRIATI_0.toString();
                                        soas_OP_CURRENCY = soasCURRENCY;
                                        soas_OP_POSITION_ID = orderPositionsItems[oPItem].SOPLIN_0.toString();
                                        soas_OP_CATEGORY = orderPositionsItems[oPItem].TCLCOD_0.toString();
                                        // ToDo: Important is, that the order should be the same like at IMPORT_TEMPLATES !!!
                                        // 9 fields: ORDERS_NUMBER,POSITION_ID,ITMNUM,ORDER_QTY,ASSIGNED_QTY,PRICE_NET,PRICE_BRU,CURRENCY,POSITION_STATUS,
                                        // @ts-ignore
                                        ordersDataPosition.push([soas_OP_ORDERS_NUMBER, soas_OP_POSITION_ID, soas_OP_ITMNUM, soas_OP_CATEGORY, soas_OP_ORDER_QTY, soas_OP_ASSIGNED_QTY, soas_OP_PRICE_NET, soas_OP_PRICE_BRU, soas_OP_CURRENCY, soas_OP_POSITION_STATUS]);
                                    } else {
                                        // console.log('COMPARE-123: FAILED!!! sohnum: ' + sageSOHNUM + " - itemref: " + orderPositionsItems[oPItem].ITMREF_0.trim());
                                    }
                                }
                            } else {
                                // @ts-ignore
                                logger.error(new Error('SAGE Customer Order: "' + soasCUSTOMER_ORDER + '" not found in SOAS Customers Addresses! SAGE Order Number "' + soasORDERS_NUMBER + '" will be not imported!'));
                            }
                        } else {
                            // @ts-ignore
                            logger.error(new Error('SAGE Customer Order: "' + soasCUSTOMER_ORDER + '" not found in SOAS Customers! SAGE Order Number "' + soasORDERS_NUMBER + '" will be not imported!'));
                        }
                    } else {
                        // @ts-ignore
                        logger.error(new Error('SAGE Order Number is empty and will be not imported!'));
                        console.log('SAGE Order Number is empty and will be not imported! resultNewSORDER[i]: ', resultNewSORDER[i]);
                    }
                } else {
                    // console.log('1 sage_add_new_sorders - Duplicate found. Ignore following ORDERS_NUMBER: ' + soasORDERS_NUMBER);
                }
            }

            // Merge results with already available
            if (!resultArray) {
                resultArray = [];
                // @ts-ignore
                resultArray.push(ordersData);
                // @ts-ignore
                resultArray.push(ordersDataPosition);
            } else {
                let newResultArray: never[] | any[][] = [];
                // @ts-ignore
                newResultArray.push(resultArray[0]);
                for (let oItem in ordersData) {
                    newResultArray[0].push(ordersData[oItem]);
                }
                // @ts-ignore
                newResultArray.push(resultArray[1]);
                for (let opItem in ordersDataPosition) {
                    newResultArray[1].push(ordersDataPosition[opItem]);
                }
                resultArray = newResultArray;
            }

            return resultArray;
        } else {
            console.log('2 sage_add_new_sorders - resultNewSORDER is empty...');
            return resultArray;
        }
    },

    sage_add_new_sdelivery: function (resultNewSDELIVERY: any, lastDeliveryNotesNumber: any, soasAllDeliveryNotes: any, statesResult: any, soasAllCurrencies: any, updateFlag: boolean, resultArray: any, allOrdersPositionsByOrdnum: any) {
        let duplicated: boolean = false;
        let sageSDHNUM_0: string = "";
        let deliveryNoteData: never[] | any[][] = [];
        let deliveryNoteDataPosition: never[] | any[][] = [];

        /* SOAS DELIVERY_NOTES DB Fields */

        let soasDELIVERY_NOTES_NUMBER: string = "";
        let soasSHIPPING_DATE: string = "";
        let soasDELIVERY_NOTES_STATE: number = 40;
        let soasORDERS_NUMBER: string = "";

        let soasEXPORT_PRINT: number = 0;
        let soasRETOUR: string = "";
        let soasPDF_CREATED_DATE: string = "";
        let soasPDF_DOWNLOAD_LINK: string = "";
        let soasCUSTOMERS_NUMBER: string = "";
        let soasRELEASE: boolean = false;
        let soasCURRENCY: string = "";

        /* SOAS DELIVERY_NOTES POSITIONS DB Fields */

        let soas_DP_DELIVERY_NOTES_NUMBER: string = "";
        let soas_DP_ORDERS_NUMBER: string = "";
        let soas_DP_ITMNUM: string = "";
        let soas_DP_ORDER_QTY: number = 0;
        let soas_DP_WEIGHT_PER: number = 0;
        let soas_DP_ROWID: number = 0;

        let soas_DP_DELIVERY_QTY: number = 0;
        let soas_DP_ORDER_POSITION_ID: number = 0;

        // console.log('resultNewSDELIVERY: ', resultNewSDELIVERY);
        if (resultNewSDELIVERY && resultNewSDELIVERY.length) {
            for (let i = 0; i < resultNewSDELIVERY.length; i++) {
                // console.log("resultNewSDELIVERY[i]: ", resultNewSDELIVERY[i]);
                duplicated = false;
                sageSDHNUM_0 = resultNewSDELIVERY[i].SDHNUM_0;
                if (resultArray) {
                    // console.log('resultArray[0].length: ', resultArray[0].length);
                    for (let j = 0; j < resultArray[0].length; j++) {
                        if (resultArray[0][j]) {
                            if (resultArray[0][j][0] === sageSDHNUM_0) {
                                duplicated = true;
                                j = resultArray[0].length;
                            }
                        }
                    }
                }
                if (updateFlag || !duplicated) {
                    for (let j = 0; j < soasAllDeliveryNotes.length; j++) {
                        if (soasAllDeliveryNotes[j]) {
                            // console.log("allItmBasis[j]: ", soasAllDeliveryNotes[j]);
                            if (soasAllDeliveryNotes[j].DELIVERY_NOTES_NUMBER === sageSDHNUM_0) {
                                // console.log('FOUND SAME DELIVERY_NOTES_NUMBER: ', sageSDHNUM_0);
                                duplicated = true;
                                j = soasAllDeliveryNotes.length;
                            }
                        }
                    }
                }

                // check if an delivery notes item is already available in deliveryNoteData ?
                if (!duplicated) {
                    for (let dnItem in deliveryNoteData) {
                        if (deliveryNoteData[dnItem][0] === sageSDHNUM_0) {
                            duplicated = true;
                            break;
                        }
                    }
                }

                if (!duplicated) {

                    /* SOAS ORDERS DB Fields */
                    soasDELIVERY_NOTES_NUMBER = sageSDHNUM_0;
                    soas_DP_DELIVERY_NOTES_NUMBER = sageSDHNUM_0;
                    soasSHIPPING_DATE = checkDate(resultNewSDELIVERY[i].DLVDAT_0);
                    soasORDERS_NUMBER = resultNewSDELIVERY[i].SOHNUM_0.toString();
                    soas_DP_ORDERS_NUMBER = resultNewSDELIVERY[i].SOHNUM_0.toString();
                    soasCUSTOMERS_NUMBER = resultNewSDELIVERY[i].BPCORD_0.toString();
                    soasCURRENCY = resultNewSDELIVERY[i].CUR_0.trim();

                    for (let currItem in soasAllCurrencies) {
                        if (soasAllCurrencies[currItem].CURRENCY_ISO_CODE === soasCURRENCY.toUpperCase()) {
                            soasCURRENCY = soasAllCurrencies[currItem].CURRENCY_ID;
                            break;
                        }
                    }

                    // ToDo: Set 5 fields
                    soasDELIVERY_NOTES_STATE = 70; // 40;
                    soasEXPORT_PRINT = 0;
                    soasRETOUR = "";
                    soasPDF_CREATED_DATE = "";
                    soasPDF_DOWNLOAD_LINK = "";

                    // ToDo: Check Date Format with "Add new ORDER" via Frontend
                    // 9 fields: [DELIVERY_NOTES_NUMBER],[SHIPPING_DATE],[EXPORT_PRINT],[DELIVERY_NOTES_STATE]
                    // ,[RETOUR],[ORDERS_NUMBER],[PDF_CREATED_DATE],[PDF_DOWNLOAD_LINK],[CUSTOMERS_NUMBER]

                    // @ts-ignore
                    deliveryNoteData.push([soasDELIVERY_NOTES_NUMBER, soasSHIPPING_DATE, soasEXPORT_PRINT, soasDELIVERY_NOTES_STATE, soasRETOUR, soasORDERS_NUMBER, soasPDF_CREATED_DATE, soasPDF_DOWNLOAD_LINK, soasCUSTOMERS_NUMBER, soasRELEASE, soasCURRENCY]);

                    let deliveryPositionsItems: any = [];
                    // console.log("allSDeliverydData: ", allSDeliverydData);

                    for (let i = 0; i < resultNewSDELIVERY.length; i++) {
                        if (resultNewSDELIVERY[i].SDHNUM_0.trim() === soasDELIVERY_NOTES_NUMBER) {
                            // ToDo: ALLQTY_0 is 0.
                            deliveryPositionsItems.push({
                                'SDHNUM_0': resultNewSDELIVERY[i].SDHNUM_0.trim(),
                                'SOHNUM_0': resultNewSDELIVERY[i].SOHNUM_0.trim(),
                                'ITMREF_0': resultNewSDELIVERY[i].ITMREF_0.trim(),
                                'QTY_0': resultNewSDELIVERY[i].QTY_0.toString(),
                                'WEIGHT_PER': resultNewSDELIVERY[i].UNTWEI_0 ? resultNewSDELIVERY[i].UNTWEI_0.toString() : resultNewSDELIVERY[i].UNTWEI_0,
                                'SDDLIN_0': resultNewSDELIVERY[i].SDDLIN_0.toString()
                            }); // , 'ALLQTY_0': resultNewSDELIVERY[i].ALLQTY_0.toString()
                            // console.log('resultNewSDELIVERY[i]: ', resultNewSDELIVERY[i]);
                            // console.log("deliveryPositionsItems::: ", deliveryPositionsItems);
                            // throw new Error("test");
                        }
                    }

                    /* SOAS DELIVERY NOTES POSITIONS DB Fields */
                    // console.log('READY deliveryPositionsItems: ', deliveryPositionsItems);
                    for (let oPItem in deliveryPositionsItems) {

                        soas_DP_ITMNUM = "";
                        soas_DP_ORDER_QTY = 0;
                        soas_DP_WEIGHT_PER = 0;
                        soas_DP_ORDER_POSITION_ID = 0;

                        // // 7 fields: ORDERS_NUMBER,ITMNUM,ORDER_QTY,ASSIGNED_QTY,PRICE_NET,CURRENCY,PRICE_BRU
                        // // @ts-ignore
                        // ordersDataPosition.push([soas_OP_ORDERS_NUMBER, soas_OP_ITMNUM, soas_OP_ORDER_QTY, soas_OP_ASSIGNED_QTY, soas_OP_PRICE_NET, soas_OP_CURRENCY, soas_OP_PRICE_BRU]);

                        // check if an order position item is already available in ordersDataPosition ?
                        let dnDataPositionDuplicate: boolean = false;
                        for (let ordPosItem in deliveryNoteDataPosition) {
                            // @ts-ignore
                            if ((deliveryNoteDataPosition[ordPosItem][0] === deliveryPositionsItems[oPItem].SDHNUM_0) &&
                                (deliveryNoteDataPosition[ordPosItem][2] === deliveryPositionsItems[oPItem].SOHNUM_0) &&
                                (deliveryNoteDataPosition[ordPosItem][3] === deliveryPositionsItems[oPItem].ITMREF_0)) {
                                // if (deliveryNoteDataPosition[ordPosItem][1] === deliveryPositionsItems[oPItem].ITMREF_0.trim()) {
                                dnDataPositionDuplicate = true;
                                break;
                            }
                        }
                        if (!dnDataPositionDuplicate) {
                            soas_DP_ITMNUM = deliveryPositionsItems[oPItem].ITMREF_0.trim(); // resultNewSDELIVERY[i].ITMREF_0;
                            soas_DP_ORDER_QTY = deliveryPositionsItems[oPItem].QTY_0.toString(); // resultNewSDELIVERY[i].QTY_0;
                            soas_DP_WEIGHT_PER = parseFloat(deliveryPositionsItems[oPItem].WEIGHT_PER);
                            soas_DP_ROWID = deliveryPositionsItems[oPItem].SDDLIN_0.toString();

                            for(let dpOrdNumItem in  allOrdersPositionsByOrdnum[soas_DP_ORDERS_NUMBER]) {
                                // console.log("COMPARE1: ", allOrdersPositionsByOrdnum[soas_DP_ORDERS_NUMBER][dpOrdNumItem]['ORDERS_NUMBER'] + " === " + soas_DP_ORDERS_NUMBER + " => result: " + (allOrdersPositionsByOrdnum[soas_DP_ORDERS_NUMBER][dpOrdNumItem]['ORDERS_NUMBER'] === soas_DP_ORDERS_NUMBER));
                                // console.log("COMPARE12: ", typeof allOrdersPositionsByOrdnum[soas_DP_ORDERS_NUMBER][dpOrdNumItem]['ORDERS_NUMBER'] + " === " + typeof soas_DP_ORDERS_NUMBER);
                                // console.log("COMPARE2: ", allOrdersPositionsByOrdnum[soas_DP_ORDERS_NUMBER][dpOrdNumItem]['ITMNUM'] + " === " + soas_DP_ITMNUM + " => result: " + (allOrdersPositionsByOrdnum[soas_DP_ORDERS_NUMBER][dpOrdNumItem]['ITMNUM'] === soas_DP_ITMNUM));
                                // console.log("COMPARE22: ", typeof allOrdersPositionsByOrdnum[soas_DP_ORDERS_NUMBER][dpOrdNumItem]['ITMNUM'] + " === " + typeof soas_DP_ITMNUM);
                                // console.log("COMPARE3: ", allOrdersPositionsByOrdnum[soas_DP_ORDERS_NUMBER][dpOrdNumItem]['POSITION_ID'].toString() + " === " + soas_DP_ROWID + " => result: " + (allOrdersPositionsByOrdnum[soas_DP_ORDERS_NUMBER][dpOrdNumItem]['POSITION_ID'] === soas_DP_ROWID));
                                // console.log("COMPARE32: ", typeof allOrdersPositionsByOrdnum[soas_DP_ORDERS_NUMBER][dpOrdNumItem]['POSITION_ID'].toString() + " === " + typeof soas_DP_ROWID);
                                if(allOrdersPositionsByOrdnum[soas_DP_ORDERS_NUMBER][dpOrdNumItem]['ORDERS_NUMBER'] === soas_DP_ORDERS_NUMBER &&
                                    allOrdersPositionsByOrdnum[soas_DP_ORDERS_NUMBER][dpOrdNumItem]['ITMNUM'] === soas_DP_ITMNUM &&
                                    allOrdersPositionsByOrdnum[soas_DP_ORDERS_NUMBER][dpOrdNumItem]['POSITION_ID'].toString() === soas_DP_ROWID) {
                                    soas_DP_ORDER_POSITION_ID = allOrdersPositionsByOrdnum[soas_DP_ORDERS_NUMBER][dpOrdNumItem]['ID'].toString();
                                }
                            }
                            // console.log("soas_DP_ORDER_POSITION_ID: ", soas_DP_ORDER_POSITION_ID);

                            // ToDo: WEIGHT_PER
                            // soas_DP_WEIGHT_PER = resultNewSDELIVERY[i].DLVDAT_0;

                            // 5 fields: [DELIVERY_NOTES_NUMBER],[ORDERS_NUMBER],[ITMNUM],[ORDER_QTY],[WEIGHT_PER]
                            // @ts-ignore
                            deliveryNoteDataPosition.push([soas_DP_DELIVERY_NOTES_NUMBER, soas_DP_ROWID, soas_DP_ORDERS_NUMBER, soas_DP_ITMNUM, soas_DP_ORDER_QTY, soas_DP_WEIGHT_PER, soas_DP_DELIVERY_QTY, soas_DP_ORDER_POSITION_ID]);
                            // console.log("deliveryNoteDataPosition: ", deliveryNoteDataPosition);
                            // throw new Error("!!!");
                        }
                    }
                } else {
                    // console.log('sage_add_new_sdelivery - Duplicate found. Ignore following DELIVERY_NOTES_NUMBER: ' + soasDELIVERY_NOTES_NUMBER);
                }
            }
            // Merge results with already available
            if (!resultArray) {
                resultArray = [];
                // @ts-ignore
                resultArray.push(deliveryNoteData); // 0
                // @ts-ignore
                resultArray.push(deliveryNoteDataPosition); // 1
            } else {
                let newResultArray: never[] | any[][] = [];
                // @ts-ignore
                newResultArray.push(resultArray[0]);
                for (let dnItem in deliveryNoteData) {
                    newResultArray[0].push(deliveryNoteData[dnItem]);
                }
                // @ts-ignore
                newResultArray.push(resultArray[1]);
                for (let dnpItem in deliveryNoteDataPosition) {
                    newResultArray[1].push(deliveryNoteDataPosition[dnpItem]);
                }
                resultArray = newResultArray;
            }
            return resultArray;
        } else {
            console.log('sage_add_new_sdelivery - resultNewSDELIVERY is empty...');
            return resultArray;
        }
    },

    sage_add_new_sinvoice: function (resultNewSINVOICE: any, lastInvoiceNumber: any, soasInvoices: any,
                                     statesResult: any, soasAllCurrencies: any, updateFlag: boolean, resultArray: any,
                                     allDLVNPositionsByDlvnum: any) {
        // console.log('sage_add_new_sinvoice...');
        let duplicated: boolean = false;
        let sageNUM_0: string = "";
        let invoicesData: never[] | any[][] = [];
        let invoicesDataPosition: never[] | any[][] = [];

        /* SOAS INVOICES DB Fields */

        let soasINVOICES_NUMBER: string = "";
        let soasINVOICES_CUSTOMER: string = "";
        let soasINVOICES_DATE: string = "";
        let soasINVOICES_CREATOR: string = "";
        let soasINVOICES_UPDATE: string = "";
        let soasINVOICES_STATE: number = 100; // 80

        // ToDo: Add Payment Therms value here
        let soasPAYMENT_TERM_ID: number = 0;

        // ToDo: left join to SDELIVERY
        let soasDELIVERY_NOTES_NUMBER: string = "";
        // ToDo: left join to SORDER
        let soasORDERS_NUMBER: string = "";

        let soasPAYED: number = 0;

        let soasPDF_CREATED_DATE: string = "";
        let soasPDF_DOWNLOAD_LINK: string = "";

        let soasRELEASE: boolean = false;
        let soasCURRENCY: string = "";

        /* SOAS INVOICES POSITIONS DB Fields */

        let soas_IP_INVOICES_NUMBER: string = "";
        let soas_IP_ORDERS_NUMBER: string = "";
        let soas_IP_DELIVERY_NOTES_NUMBER: string = "";
        let soas_IP_ITMNUM: string = "";
        let soas_IP_ORDER_QTY: number = 0;
        let soas_IP_DELIVERY_QTY: number = 0;
        let soas_IP_PRICE_NET: number = 0;
        let soas_IP_PRICE_BRU: number = 0;
        let soas_IP_CURRENCY: string = "";
        let soas_IP_DELIVERY_NOTES_POSITIONS_ID: number = 0;
        let soas_IP_SIDLIN: number = 0;

        // console.log('resultNewSINVOICE: ', resultNewSINVOICE);
        if (resultNewSINVOICE && resultNewSINVOICE.length) {
            for (let i = 0; i < resultNewSINVOICE.length; i++) {
                // console.log("resultNewSORDER[i]: ", resultNewSINVOICE[i]);
                duplicated = false;
                sageNUM_0 = resultNewSINVOICE[i].NUM_0.trim();
                // console.log('sageNUM_0: ', sageNUM_0);
                if (resultArray) {
                    // console.log('resultArray[0].length: ', resultArray[0].length);
                    for (let j = 0; j < resultArray[0].length; j++) {
                        if (resultArray[0][j]) {
                            if (resultArray[0][j][0] === sageNUM_0) {
                                duplicated = true;
                                j = resultArray[0].length;
                            }
                        }
                    }
                }
                if (updateFlag || !duplicated) {
                    for (let j = 0; j < soasInvoices.length; j++) {
                        if (soasInvoices[j]) {
                            if (soasInvoices[j].INVOICES_NUMBER === sageNUM_0) {
                                // console.log('FOUND SAME INVOICES_NUMBER: ', sageNUM_0);
                                duplicated = true;
                                j = soasInvoices.length;
                            }
                        }
                    }
                }
                // check if an invoice item is already available in invoicesData ?
                if (!duplicated) {
                    for (let inItem in invoicesData) {
                        if (invoicesData[inItem][0] === sageNUM_0) {
                            duplicated = true;
                            break;
                        }
                    }
                }
                if (!duplicated) {

                    /* SOAS INVOICES DB Fields */

                    soasINVOICES_NUMBER = sageNUM_0;
                    soasINVOICES_CUSTOMER = resultNewSINVOICE[i].BPR_0.trim();
                    soasINVOICES_DATE = checkDate(resultNewSINVOICE[i].CREDAT_0);
                    let trimmedSoasINVOICES_DATE = soasINVOICES_DATE;
                    if (typeof trimmedSoasINVOICES_DATE === 'string') {
                        trimmedSoasINVOICES_DATE = trimmedSoasINVOICES_DATE.trim();
                    }
                    if (trimmedSoasINVOICES_DATE && !(trimmedSoasINVOICES_DATE != '')) {
                        soasINVOICES_DATE = trimmedSoasINVOICES_DATE.replace("T", " ").replace(".000Z", "");
                    }

                    soasINVOICES_CREATOR = resultNewSINVOICE[i].CREUSR_0.trim();
                    soasINVOICES_UPDATE = resultNewSINVOICE[i].UPDUSR_0.trim(); //checkDate(resultNewSINVOICE[i].UPDDAT_0);

                    soasINVOICES_STATE = 100;

                    // ToDo: If B2C, all without 'Kauf auf Rechnung' are PAYED = 1. B2B ???
                    soasPAYED = 1;

                    // ToDo: Add Payment Therms value here ART ODER BEDINGUNG ?
                    soasPAYMENT_TERM_ID = resultNewSINVOICE[i].PTE_0; // can be 'null'

                    soasDELIVERY_NOTES_NUMBER = resultNewSINVOICE[i].SDHNUM_0 ? resultNewSINVOICE[i].SDHNUM_0.trim() : resultNewSINVOICE[i].SDHNUM_0;
                    soasORDERS_NUMBER = resultNewSINVOICE[i].SOHNUM_0 ? resultNewSINVOICE[i].SOHNUM_0.trim() : resultNewSINVOICE[i].SOHNUM_0;

                    soasPDF_CREATED_DATE = (resultNewSINVOICE[i].INVPRNBOM_0 === 2 && resultNewSINVOICE[i].INVDAT !== null) ?
                        resultNewSINVOICE[i].INVDAT : "";

                    // ToDo: PDF_DOWNLOAD_LINK setzen...
                    soasPDF_DOWNLOAD_LINK = "";

                    /* SOAS ORDERS POSITIONS DB Fields */

                    soas_IP_INVOICES_NUMBER = soasINVOICES_NUMBER;
                    soas_IP_ORDERS_NUMBER = soasORDERS_NUMBER;
                    soas_IP_DELIVERY_NOTES_NUMBER = soasDELIVERY_NOTES_NUMBER;

                    // soas_IP_ITMNUM = resultNewSINVOICE[i].ITMREF_0;
                    // soas_IP_PRICE_NET = resultNewSINVOICE[i].NETPRINOT_0;
                    // soas_IP_PRICE_BRU = resultNewSINVOICE[i].NETPRIATI_0;
                    //
                    // soas_IP_ORDER_QTY = resultNewSINVOICE[i].QTY_0;
                    // soas_IP_DELIVERY_QTY = resultNewSINVOICE[i].QTYSTU_0;

                    soasCURRENCY = resultNewSINVOICE[i].CUR_0.trim();
                    soas_IP_CURRENCY = resultNewSINVOICE[i].CUR_0.trim();

                    for (let currItem in soasAllCurrencies) {
                        if (soasAllCurrencies[currItem].CURRENCY_ISO_CODE === soas_IP_CURRENCY.toUpperCase()) {
                            soasCURRENCY = soasAllCurrencies[currItem].CURRENCY_ID;
                            soas_IP_CURRENCY = soasAllCurrencies[currItem].CURRENCY_ID;
                            break;
                        }
                    }

                    // ToDo: Check Date Format with "Add new ORDER" via Frontend
                    // 12 fields: [INVOICES_NUMBER],[INVOICES_CUSTOMER],[INVOICES_DATE],[INVOICES_CREATOR]
                    // ,[INVOICES_UPDATE],[INVOICES_STATE],[PAYMENT_TERM_ID],[DELIVERY_NOTES_NUMBER],[ORDERS_NUMBER]
                    // ,[PAYED],[PDF_CREATED_DATE],[PDF_DOWNLOAD_LINK]

                    // ToDo: PDF_CREATED_DATE,PDF_DOWNLOAD_LINK not provide to insert (remove from IMPORT_TEMPLATES) so they stay NULL. Will be updated separatly.
                    // @ts-ignore
                    invoicesData.push([soasINVOICES_NUMBER, soasINVOICES_CUSTOMER, soasINVOICES_DATE, soasINVOICES_CREATOR, soasINVOICES_UPDATE, soasINVOICES_STATE, soasPAYMENT_TERM_ID, soasDELIVERY_NOTES_NUMBER, soasORDERS_NUMBER, soasPAYED, soasPDF_CREATED_DATE, soasPDF_DOWNLOAD_LINK, soasRELEASE, soasCURRENCY]);

                    let invoicePositionsItems: any = [];

                    // console.log("allSInvoicedData: ", allSInvoicedData);

                    for (let i = 0; i < resultNewSINVOICE.length; i++) {
                        if (resultNewSINVOICE[i].NUM_0.trim() === soasINVOICES_NUMBER) {
                            // ToDo: Ask if resultNewSINVOICE[i].ITMREF_0 can be null ???
                            if (resultNewSINVOICE[i].ITMREF_0) {
                                invoicePositionsItems.push({
                                    'ITMREF_0': resultNewSINVOICE[i].ITMREF_0 ? resultNewSINVOICE[i].ITMREF_0.trim() : resultNewSINVOICE[i].ITMREF_0,
                                    'QTY_0': resultNewSINVOICE[i].QTY_0 ? resultNewSINVOICE[i].QTY_0.toString() : resultNewSINVOICE[i].QTY_0,
                                    'NETPRINOT_0': resultNewSINVOICE[i].NETPRINOT_0 ? resultNewSINVOICE[i].NETPRINOT_0.toString() : resultNewSINVOICE[i].NETPRINOT_0,
                                    'NETPRIATI_0': resultNewSINVOICE[i].NETPRIATI_0 ? resultNewSINVOICE[i].NETPRIATI_0.toString() : resultNewSINVOICE[i].NETPRIATI_0,
                                    'QTYSTU_0': resultNewSINVOICE[i].QTYSTU_0 ? resultNewSINVOICE[i].QTYSTU_0.toString() : resultNewSINVOICE[i].QTYSTU_0,
                                    'SIDLIN_0': resultNewSINVOICE[i].SIDLIN_0 ? resultNewSINVOICE[i].SIDLIN_0.toString() : resultNewSINVOICE[i].SIDLIN_0
                                });
                            } else {
                                console.log('Invoice Position ITMREF_0 is NULL for : ', soasINVOICES_NUMBER);
                            }
                        }
                    }

                    /* SOAS DELIVERY NOTES POSITIONS DB Fields */
                    // console.log('READY invoicePositionsItems: ', invoicePositionsItems);
                    for (let oPItem in invoicePositionsItems) {

                        soas_IP_ITMNUM = invoicePositionsItems[oPItem].ITMREF_0; // resultNewSINVOICE[i].ITMREF_0;
                        soas_IP_PRICE_NET = invoicePositionsItems[oPItem].NETPRINOT_0; // resultNewSINVOICE[i].NETPRINOT_0;
                        soas_IP_PRICE_BRU = invoicePositionsItems[oPItem].NETPRIATI_0; // resultNewSINVOICE[i].NETPRIATI_0;

                        soas_IP_ORDER_QTY = invoicePositionsItems[oPItem].QTY_0; // resultNewSINVOICE[i].QTY_0;
                        soas_IP_DELIVERY_QTY = invoicePositionsItems[oPItem].QTYSTU_0; // resultNewSINVOICE[i].QTYSTU_0;
                        // soas_IP_CURRENCY = invoicePositionsItems[oPItem].CUR_0; // resultNewSINVOICE[i].CUR_0;
                        soas_IP_SIDLIN = invoicePositionsItems[oPItem].SIDLIN_0;

                        for(let dpDlvNumItem in  allDLVNPositionsByDlvnum[soas_IP_DELIVERY_NOTES_NUMBER]) {
                            if(allDLVNPositionsByDlvnum[soas_IP_DELIVERY_NOTES_NUMBER][dpDlvNumItem]['DELIVERY_NOTES_NUMBER'] === soas_IP_DELIVERY_NOTES_NUMBER &&
                                allDLVNPositionsByDlvnum[soas_IP_DELIVERY_NOTES_NUMBER][dpDlvNumItem]['ITMNUM'] === soas_IP_ITMNUM &&
                                allDLVNPositionsByDlvnum[soas_IP_DELIVERY_NOTES_NUMBER][dpDlvNumItem]['POSITION_ID'].toString() === soas_IP_SIDLIN) {
                                soas_IP_DELIVERY_NOTES_POSITIONS_ID = allDLVNPositionsByDlvnum[soas_IP_DELIVERY_NOTES_NUMBER][dpDlvNumItem]['ID'].toString();
                            }
                        }

                        // 9 fields: [INVOICES_NUMBER],[ORDERS_NUMBER],[DELIVERY_NOTES_NUMBER],[ITMNUM],[ORDER_QTY]
                        // ,[DELIVERY_QTY],[PRICE_NET],[CURRENCY],[PRICE_BRU]
                        // @ts-ignore
                        invoicesDataPosition.push([soas_IP_INVOICES_NUMBER, soas_IP_SIDLIN, soas_IP_ORDERS_NUMBER, soas_IP_DELIVERY_NOTES_NUMBER, soas_IP_ITMNUM, soas_IP_ORDER_QTY, soas_IP_DELIVERY_QTY, soas_IP_PRICE_NET, soas_IP_PRICE_BRU, soas_IP_CURRENCY, soas_IP_DELIVERY_NOTES_POSITIONS_ID]);
                    }

                } else {
                    // console.log('sage_add_new_sinvoice - Duplicate found. Ignore following INVOICES_NUMBER: ' + soasINVOICES_NUMBER);
                }
            }

            // Merge results with already available
            if (!resultArray) {
                resultArray = [];
                // @ts-ignore
                resultArray.push(invoicesData); // 0
                // @ts-ignore
                resultArray.push(invoicesDataPosition); // 1
            } else {
                let newResultArray: never[] | any[][] = [];
                // @ts-ignore
                newResultArray.push(resultArray[0]);
                for (let inItem in invoicesData) {
                    newResultArray[0].push(invoicesData[inItem]);
                }
                // @ts-ignore
                newResultArray.push(resultArray[1]);
                for (let inpItem in invoicesDataPosition) {
                    newResultArray[1].push(invoicesDataPosition[inpItem]);
                }
                resultArray = newResultArray;
            }

            return resultArray;
        } else {
            console.log('sage_add_new_sinvoice - resultNewSINVOICE is empty...');
            return resultArray;
        }
    },
    sage_add_new_payment_terms: async function() {

        console.log('sage_add_new_payment_terms...');
        let duplicated: boolean = false;
        let resultArray: never[] | any[][];
        let paymentTermsData: never[] | any[][] = [];

        let soasPAYMENT_TERM_ID: string = "";   // PTE_0
        let soasPAYMENT_TERM_NAME: string = ""; // LANDESSHO_0
        let soasPAYMENT_TERM_COMMENT: string = "";
        let soasPAYMENT_TERM_ACTIVE: boolean = true; // active by default

        // @ts-ignore
        let resultNewPaymentTerms = await sgCall.sage_call_get_new_payment_terms();
        console.log("resultNewPaymentTerms: ", resultNewPaymentTerms.length);
        console.log("resultNewPaymentTerms: ", resultNewPaymentTerms);
        if (resultNewPaymentTerms && resultNewPaymentTerms.length)
        {
            for (let i = 0; i < resultNewPaymentTerms.length; i++) {
                duplicated = false;
                console.log('resultNewPaymentTerms[i]: ', resultNewPaymentTerms[i]);
                soasPAYMENT_TERM_ID = resultNewPaymentTerms[i].PTE_0.trim();
                soasPAYMENT_TERM_NAME = resultNewPaymentTerms[i].LANDESSHO_0.trim();
                // check if an payment term item is already available in paymentTermsData ?
                for (let ptItem in paymentTermsData) {
                    if (paymentTermsData[ptItem][0] === soasPAYMENT_TERM_ID) {
                        duplicated = true;
                        break;
                    }
                }
                // @ts-ignore
                paymentTermsData.push([soasPAYMENT_TERM_ID, soasPAYMENT_TERM_NAME, soasPAYMENT_TERM_COMMENT, soasPAYMENT_TERM_ACTIVE]);
            }

            // Merge results with already available
            // @ts-ignore
            if (!resultArray) {
                resultArray = [];
                // @ts-ignore
                resultArray.push(paymentTermsData);
            } else {
                let newResultArray: never[] | any[][] = [];
                // @ts-ignore
                newResultArray.push(resultArray[0]);
                for (let ptItem in paymentTermsData) {
                    newResultArray[0].push(paymentTermsData[ptItem]);
                }
            }
            // @ts-ignore
            return resultArray;
        } else {
            console.log('sage_add_new_payment_terms - resultNewPaymentTerms is empty...');
            // @ts-ignore
            return resultArray;
        }
    },
    sage_find_table_keys_for_soas: function (sageTableName: string, soasTableAllItems: any, callback: any) {

        switch (sageTableName) {
            case("ITMMASTER"):
                // @ts-ignore
                sgCall.sage_call_get_new_itmmaster(function (sageTableResult: any) { // replace with other table
                    getComparedKeys(sageTableResult);
                });
                break;
            case("SORDER"):
                // @ts-ignore
                sgCall.sage_call_get_new_sorder(function (sageTableResult: any) { // replace with other table
                    getComparedKeys(sageTableResult);
                });
                break;
            default: break;
        }

        function getComparedKeys(sageTableResult: any) {
            let allKeys = [];
            let itmMasterKeys = [];
            let itmBasisKeys = [];
            for (let i = 0; i < sageTableResult.length; i++) {
                for (let itmMasterKey in sageTableResult[i]) {
                    for (let j = 0; j < soasTableAllItems.length; j++) {
                        if (soasTableAllItems[j]) {
                            for (let itmBasisKey in soasTableAllItems[j]) {
                                let trimmedItmMasterKey = sageTableResult[i][itmMasterKey];
                                if (typeof trimmedItmMasterKey === 'string') {
                                    trimmedItmMasterKey = trimmedItmMasterKey.trim();
                                } else {
                                    // console.log('is : ', typeof trimmedItmMasterKey);
                                    // console.log('trimmedItmMasterKey: ', trimmedItmMasterKey);
                                }
                                if (!(trimmedItmMasterKey == '')
                                    && (sageTableResult[i][itmMasterKey] === soasTableAllItems[j][itmBasisKey])) {
                                    // console.log('FOUND SAME: ', itmMasterKey + ' vs. ' + itmBasisKey + ' value: ' + resultNewITMMASTER[i][itmMasterKey]);
                                    itmMasterKeys.push(itmMasterKey);
                                    itmBasisKeys.push(itmBasisKey);
                                    allKeys.push({'itmMasterKey': itmMasterKey, 'itmBasisKey': itmBasisKey});
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            console.log('itmMasterKeys: ', itmMasterKeys);
            console.log('itmBasisKeys: ', itmBasisKeys);
            console.log('allKeys: ', allKeys);
        }
    },
    sage_get_all_rows_of_table_by_name: function (sageTableName: string, callback: any) {
        switch (sageTableName) {
            case("SORDERP"):
                // @ts-ignore
                sgCall.sage_call_get_all_sorderp(function (sageTableResult: any) { // replace with other table
                    callback(sageTableResult);
                });
                break;
            case("SORDERQ"):
                // @ts-ignore
                sgCall.sage_call_get_all_sorderq(function (sageTableResult: any) { // replace with other table
                    callback(sageTableResult);
                });
                break;
            case("SDELIVERYD"):
                // @ts-ignore
                sgCall.sage_call_get_all_sdeliveryd(function (sageTableResult: any) { // replace with other table
                    callback(sageTableResult);
                });
                break;
            case("SINVOICED"):
                // @ts-ignore
                sgCall.sage_call_get_all_sinvoiced(function (sageTableResult: any) { // replace with other table
                    callback(sageTableResult);
                });
                break;
            default:
                break;
        }
    }
};


/**
 * https://stackoverflow.com/a/1353711
 * @param date
 */
function checkDate(date: any) {
    if (typeof date === 'string' && date !== null) {
        date = date.trim();
    }
    if (Object.prototype.toString.call(date) === "[object Date]") {
        // it is a date
        if (!isNaN(date.getTime())) {  // !d.valueOf() could also work
            // date is valid, format it
            return date.toISOString()
                .replace(/T/, ' ')    // replace T with a space
                .replace(/\..+/, ''); // delete the dot and everything after);
        }
    }
    return date;
}

/**
 * Replaces text in a string (all occurrences)
 * https://stackoverflow.com/a/1144788
 *
 * @param str
 * @param find
 * @param replace
 */
function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function checkCustomerAddressData(custAddrData: never[] | any[][]) {
    // let startDate = new Date();
    // console.log('sage_add_new_customers START of checkCustomerAddressData... ', startDate.getHours() + ':' + startDate.getMinutes() + ':' + startDate.getSeconds());
    let newCAD: never[] | any[][] = [];
    let foundNum: number = 0;
    for (let cadItem in custAddrData) {
        let lastCustNum = custAddrData[cadItem][1];
        foundNum = 0;
        for (let cadItem2 in custAddrData) {
            if (lastCustNum === custAddrData[cadItem2][1]) {
                foundNum++;
            }
        }
        // @ts-ignore
        newCAD.push(custAddrData[cadItem]);
        if (foundNum === 1) {
            // Duplicate address for missing type
            if (custAddrData[cadItem][0] === 'DLV') {
                // @ts-ignore
                newCAD.push(['INV', custAddrData[cadItem][1], custAddrData[cadItem][2] , custAddrData[cadItem][3], custAddrData[cadItem][4], custAddrData[cadItem][5], custAddrData[cadItem][6], custAddrData[cadItem][7], custAddrData[cadItem][8], custAddrData[cadItem][9], custAddrData[cadItem][10], custAddrData[cadItem][11], custAddrData[cadItem][12]]);
            } else {
                // @ts-ignore
                newCAD.push(['DLV', custAddrData[cadItem][1], custAddrData[cadItem][2], custAddrData[cadItem][3], custAddrData[cadItem][4], custAddrData[cadItem][5], custAddrData[cadItem][6], custAddrData[cadItem][7], custAddrData[cadItem][8], custAddrData[cadItem][9], custAddrData[cadItem][10], custAddrData[cadItem][11], custAddrData[cadItem][12]]);
            }
        }
    }
    return newCAD;
}

function checkNumber(number: any, onlyCompare: boolean = false) {
    number = (typeof number === 'number') ? number.toString() : number;
    number = number.replace(/,/, '.');
    if (!onlyCompare) {
        number = number && number.trim() !== '' && !isNaN(Number(number)) ? "CAST('" + parseFloat(number).toString() + "' AS DECIMAL(18,4))" : "'0'";
    } else {
        number = number && number.trim() !== '' && !isNaN(Number(number)) ? parseFloat(number).toString() : "0";
    }
    return number;
}

// @ts-ignore
async function getDefaultAttributesIds(defaultAttributes: string[{ name, data }], soasITMNUM: string) {
    for (let defAttrItem in defaultAttributes) {
        // @ts-ignore
        let defAttrId = await mssqlCall.mssqlCall("SELECT ID FROM " + constants.DB_TABLE_PREFIX + "ATTRIBUTES WHERE " +
            "ATTRIBUTE_NAME = '" + defaultAttributes[defAttrItem].name + "' AND ATTRIBUTE_DATA = '" + defaultAttributes[defAttrItem].data + "';");
        if (defAttrId && defAttrId.length) {
            defaultAttributes[defAttrItem].id = defAttrId[0].ID;
        } else {
            console.log("ERROR Default Attribute ID not found! ATTRIBUTE_NAME = '" + defaultAttributes[defAttrItem].name + "' " +
                "AND ATTRIBUTE_DATA = '" + defaultAttributes[defAttrItem].data + "'");
            console.log("ERROR-ITMNUM: ", soasITMNUM);
        }
    }
    return defaultAttributes;
}
