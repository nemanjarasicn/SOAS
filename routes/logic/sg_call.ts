/**
 * Author: Andreas Lening
 * Last update: 02.06.2020
 */

// @ts-ignore
import  sql = require('mssql');
// @ts-ignore
import config = require('../config/sgConfig');
import logger = require('./../config/winston');

const pools = {};

// manage a set of pools by name (config will be required to create the pool)
// a pool will be removed when it is closed
async function getPool(name: string, config: any) {
    if (!Object.prototype.hasOwnProperty.call(pools, name)) {
        const pool = new sql.ConnectionPool(config);
        const close = pool.close.bind(pool);
        // @ts-ignore
        pool.close = (...args) => {
            // @ts-ignore
            delete pools[name];
            // @ts-ignore
            return close(...args);
        }
        await pool.connect();
        // @ts-ignore
        pools[name] = pool;
    }
    // @ts-ignore
    return pools[name];
}

// close all pools
function closeAll() {
    return Promise.all(Object.values(pools).map((pool) => {
        // @ts-ignore
        return pool.close()
    }))
}

module.exports = {
    sage_close_pool_connections: async function () {
        return await closeAll();
    },
    /**
     * Get customers from sage db.
     *
     * @param startNum
     * @param maxNum
     * @param callback
     */
    sage_call_get_new_customers: function (startNum: number, maxNum: number, callback: any) {
        // WHERE ordertime BETWEEN date_sub(now(), INTERVAL 1 day) AND date_sub(now(), INTERVAL 1 hour);
        // "WHERE YEAR(BPCUSTOMER.CREDAT_0) = '2020' " +
        // TOP (20) TOP(100)
        let query: string = "SELECT BPCUSTOMER.BPCNAM_0, BPCUSTOMER.BPCNUM_0, BPCUSTOMER.CREDAT_0, BPCUSTOMER.BCGCOD_0, " +
            "BPCUSTOMER.CUR_0, BPCUSTOMER.PTE_0, BPCUSTOMER.VACBPR_0, " +
            "BPADDRESS.BPAADDLIG_0, BPADDRESS.POSCOD_0, BPADDRESS.CTY_0, BPADDRESS.CRYNAM_0, BPADDRESS.BPADES_0, BPADDRESS.CRY_0, " +
            "BPADDRESS.WEB_0, BPADDRESS.WEB_1, BPADDRESS.WEB_2, BPADDRESS.TEL_0, BPADDRESS.TEL_1, BPADDRESS.TEL_2, BPADDRESS.TEL_3, BPADDRESS.TEL_4, BPADDRESS.BPAADDFLG_0, " +
            "BPARTNER.EECNUM_0, BPARTNER.CRN_0, BPARTNER.ZIWOINVOIC_0, BPARTNER.ZIWOORDERSP_0, BPARTNER.ZIWODESADV_0 " +
            "FROM x3v65p.EMOPILOT.BPCUSTOMER " +
            "left join x3v65p.EMOPILOT.BPADDRESS on BPADDRESS.BPANUM_0 = BPCUSTOMER.BPCNUM_0 " +
            "left join x3v65p.EMOPILOT.BPARTNER on BPARTNER.BPRNUM_0 = BPCUSTOMER.BPCNUM_0 " +

            // "WHERE BPCUSTOMER.BPCNUM_0 = '0300000004289' " +
            // "ORDER BY BPCNUM_0 ASC;";

            "ORDER BY BPCNUM_0 ASC " +
            "OFFSET " + startNum + " ROWS " + "FETCH NEXT " + maxNum + " ROWS ONLY;";

        // "WHERE BPCUSTOMER.BPCNUM_0 = '0100003332' " +
        // "ORDER BY BPCNUM_0 ASC;";

        // "ORDER BY BPCNUM_0 DESC;";

        mssqlCall(query, function (data: any) {
            callback(data);
        });
    },

    sage_call_get_new_customers_promise: async function (startNum: number, maxNum: number) {
        // 20210114 - CREDAT_0 changed to BPCSNCDAT_0
        // let query: string = "SELECT CONVERT(nvarchar(255), BPCUSTOMER.BPCNAM_0) COLLATE Latin1_General_CI_AS AS BPCNAM_0, BPCUSTOMER.BPCNUM_0, BPCUSTOMER.BPCSNCDAT_0, BPCUSTOMER.BCGCOD_0, " +
        //     "BPCUSTOMER.CUR_0, BPCUSTOMER.PTE_0, BPCUSTOMER.VACBPR_0, " +
        //     "BPADDRESS.BPAADD_0, BPADDRESS.BPAADDLIG_0, BPADDRESS.POSCOD_0, BPADDRESS.CTY_0, BPADDRESS.CRYNAM_0, BPADDRESS.BPADES_0, BPADDRESS.CRY_0, " +
        //     "BPADDRESS.WEB_0, BPADDRESS.WEB_1, BPADDRESS.WEB_2, BPADDRESS.TEL_0, BPADDRESS.TEL_1, BPADDRESS.TEL_2, BPADDRESS.TEL_3, BPADDRESS.TEL_4, BPADDRESS.BPAADDFLG_0, " +
        //     "BPARTNER.EECNUM_0, BPARTNER.CRN_0, BPARTNER.ZIWOINVOIC_0, BPARTNER.ZIWOORDERSP_0, BPARTNER.ZIWODESADV_0 " +
        //     "FROM x3v65p.EMOPILOT.BPCUSTOMER " +
        //     "left join x3v65p.EMOPILOT.BPADDRESS on BPADDRESS.BPANUM_0 = BPCUSTOMER.BPCNUM_0 " +
        //     "left join x3v65p.EMOPILOT.BPARTNER on BPARTNER.BPRNUM_0 = BPCUSTOMER.BPCNUM_0 " +
        //     "ORDER BY BPCUSTOMER.BPCSNCDAT_0 ASC, BPCNUM_0 ASC ";
        // if (startNum > 0) {
        //     query += "OFFSET " + startNum + " ROWS FETCH NEXT " + maxNum + " ROWS ONLY;";
        // } else {
        //     query += ";"
        // }

        let query: string = "";
        if (maxNum > 0) { // get only last items => stepNumber
            query = "SELECT q.BPCNAM_0, q.BPCNUM_0, q.BPCSNCDAT_0, q.BCGCOD_0, q.CUR_0, q.PTE_0, q.VACBPR_0, " +
                "q.BPAADD_0, q.BPAADDLIG_0, q.POSCOD_0, q.CTY_0, q.CRYNAM_0, q.BPADES_0, q.CRY_0, " +
                "q.WEB_0, q.WEB_1, q.WEB_2, q.TEL_0, q.TEL_1, q.TEL_2, q.TEL_3, q.TEL_4, q.BPAADDFLG_0, " +
                "q.EECNUM_0, q.CRN_0, q.ZIWOINVOIC_0, q.ZIWOORDERSP_0, q.ZIWODESADV_0 " +
                "FROM " +
                "(SELECT TOP(" + maxNum + ") BPCUSTOMER.ROWID, CONVERT(nvarchar(255), BPCUSTOMER.BPCNAM_0) COLLATE Latin1_General_CI_AS AS BPCNAM_0, BPCUSTOMER.BPCNUM_0, BPCUSTOMER.BPCSNCDAT_0, BPCUSTOMER.BCGCOD_0, " +
                "BPCUSTOMER.CUR_0, BPCUSTOMER.PTE_0, BPCUSTOMER.VACBPR_0, " +
                "BPADDRESS.BPAADD_0, BPADDRESS.BPAADDLIG_0, BPADDRESS.POSCOD_0, BPADDRESS.CTY_0, BPADDRESS.CRYNAM_0, BPADDRESS.BPADES_0, BPADDRESS.CRY_0, " +
                "BPADDRESS.WEB_0, BPADDRESS.WEB_1, BPADDRESS.WEB_2, BPADDRESS.TEL_0, BPADDRESS.TEL_1, BPADDRESS.TEL_2, BPADDRESS.TEL_3, BPADDRESS.TEL_4, BPADDRESS.BPAADDFLG_0, " +
                "BPARTNER.EECNUM_0, BPARTNER.CRN_0, BPARTNER.ZIWOINVOIC_0, BPARTNER.ZIWOORDERSP_0, BPARTNER.ZIWODESADV_0 " +
                "FROM x3v65p.EMOPILOT.BPCUSTOMER " +
                "left join x3v65p.EMOPILOT.BPADDRESS on BPADDRESS.BPANUM_0 = BPCUSTOMER.BPCNUM_0 " +
                "left join x3v65p.EMOPILOT.BPARTNER on BPARTNER.BPRNUM_0 = BPCUSTOMER.BPCNUM_0 " +
                "ORDER BY BPCUSTOMER.ROWID DESC) q " +
                "ORDER BY q.ROWID ASC;";
            // "ORDER BY BPCUSTOMER.BPCSNCDAT_0 ASC, BPCNUM_0 ASC ";
        } else {
            query = "SELECT CONVERT(nvarchar(255), BPCUSTOMER.BPCNAM_0) COLLATE Latin1_General_CI_AS AS BPCNAM_0, BPCUSTOMER.BPCNUM_0, BPCUSTOMER.BPCSNCDAT_0, BPCUSTOMER.BCGCOD_0, " +
                "BPCUSTOMER.CUR_0, BPCUSTOMER.PTE_0, BPCUSTOMER.VACBPR_0, " +
                "BPADDRESS.BPAADD_0, BPADDRESS.BPAADDLIG_0, BPADDRESS.POSCOD_0, BPADDRESS.CTY_0, BPADDRESS.CRYNAM_0, BPADDRESS.BPADES_0, BPADDRESS.CRY_0, " +
                "BPADDRESS.WEB_0, BPADDRESS.WEB_1, BPADDRESS.WEB_2, BPADDRESS.TEL_0, BPADDRESS.TEL_1, BPADDRESS.TEL_2, BPADDRESS.TEL_3, BPADDRESS.TEL_4, BPADDRESS.BPAADDFLG_0, " +
                "BPARTNER.EECNUM_0, BPARTNER.CRN_0, BPARTNER.ZIWOINVOIC_0, BPARTNER.ZIWOORDERSP_0, BPARTNER.ZIWODESADV_0 " +
                "FROM x3v65p.EMOPILOT.BPCUSTOMER " +
                "left join x3v65p.EMOPILOT.BPADDRESS on BPADDRESS.BPANUM_0 = BPCUSTOMER.BPCNUM_0 " +
                "left join x3v65p.EMOPILOT.BPARTNER on BPARTNER.BPRNUM_0 = BPCUSTOMER.BPCNUM_0 " +
                "ORDER BY BPCUSTOMER.BPCSNCDAT_0 ASC, BPCNUM_0 ASC;";
        }
        console.log("customers promise: ", query);
        return await module.exports.sage_exec_one_query_with_promise(query);
    },
    sage_call_get_new_payment_terms: async function() {
        let query: string = "SELECT PTE_0, LANDESSHO_0 FROM x3v65p.EMOPILOT.TABPAYTERM;";
        return await module.exports.sage_exec_one_query_with_promise(query);
    },
    /**
     * Helper method for customers cron import
     *
     * @param callback
     */
    sage_call_get_all_prilists: function (callback: any) {
        let query: string = "SELECT PLICRI2_0 FROM x3v65p.EMOPILOT.SPRICLIST ORDER BY ROWID ASC;";
        mssqlCall(query, function (data: any) {
            callback(data);
        });
    },

    sage_call_get_all_prilists_promise: async function () {
        let query: string = "SELECT PLICRI2_0 FROM x3v65p.EMOPILOT.SPRICLIST ORDER BY ROWID ASC;";
        return await module.exports.sage_exec_one_query_with_promise(query);
    },

    /**
     * Method for import all prilists via cron
     *
     * PLICRI1_0 as 'Artikel' = 'ITMNUM',
     * PRI_0 as 'Nettopreis' = 'EKPR' = 'PRICE_NET',
     * ZBRUPRI_0 as 'Bruttopreis' = 'PSEUDOPR' = 'PRICE_BRU'
     * CUR_0 as 'CURRENCY'
     * PLICRD_0 as 'Preisblatt' = 'PRILIST',
     * PLI_0 as 'Katalog' = 'CUSGRP',
     * PLICRI2_0 as 'Kundennummer oder Gruppe', --bei PLI_0 EMT* Preislisten sind B2C, alle anderen B2B
     *
     * @param callback
     */
    sage_call_get_all_prilists_for_import: async function (startNumber: number, stepNumber: number) {
        // let query: string = "SELECT PLICRI2_0, PRI_0, ZBRUPRI_0 FROM x3v65p.EMOPILOT.SPRICLIST;";
        let query: string = "SELECT " +
            "PLICRI1_0 AS 'ITMNUM', " +
            "PRI_0 AS 'PRICE_NET', " +
            "ZBRUPRI_0 AS 'PRICE_BRU', " +
            "'CURRENCY' = REPLACE(REPLACE(REPLACE(CUR_0, 'GPB', '3'), 'GBP', '3'), 'EUR', '1'), " +
            "PLICRD_0 AS 'PRILIST', " +
            "'CUSGRP' = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(PLI_0, 'EMT5', PLICRI2_0 + '_B2C'), 'EMT6', PLICRI2_0 + '_B2C'), 'EMT7', PLICRI2_0 + '_B2C'), 'HPREIS', PLICRI2_0), 'EMT1', PLICRI2_0 + '_B2C'), 'POSNH', PLICRI2_0), 'EMT2', PLICRI2_0 + '_B2C'), " +
            "PLICRI2_0 AS 'Kundennummer oder Gruppe' " +
            "FROM x3v65p.EMOPILOT.SPRICLIST " +
            "WHERE PLIENDDAT_0 >= GETDATE() " +
            "AND PLICRI1_0 != '' " +
            "ORDER BY ROWID ASC " +
            "OFFSET " + startNumber + " ROWS " + "FETCH NEXT " + stepNumber + " ROWS ONLY;";
        return await module.exports.sage_exec_one_query_with_promise(query);
    },
    sage_call_get_attribute_by_name: async function (name: string) {
        let query: string = "SELECT DISTINCT " + name + " FROM x3v65p.EMOPILOT.ITMMASTER WHERE TCLCOD_0 = 'SET';";
        console.log("query: ", query);
        return await module.exports.sage_exec_one_query_with_promise(query);
    },
    sage_call_get_colors: function (callback: any) {
        let query: string = "SELECT DISTINCT ATTRIBUT3_0 FROM x3v65p.EMOPILOT.ITMMASTER WHERE TCLCOD_0 = 'SET';";
        mssqlCall(query, function (data: any) {
            callback(data);
        });
    },
    sage_call_count_itmmaster: function (callback: any) {
        let query: string = "SELECT COUNT(ITMMASTER.ITMREF_0) FROM x3v65p.EMOPILOT.ITMMASTER WHERE TCLCOD_0 = 'SET';";
        mssqlCall(query, function (data: any) {
            callback(data);
        });
    },
    /**
     * Get articles from sage.
     * Example: Get 100 rows started by row 0 (0 to 100): startRowId = 0, maxRows = 100
     *
     * @param startRowId row id: 0
     * @param maxRows number of rows: 100
     */
    sage_call_get_new_itmmaster: async function (itmRowsNumber: number) { //startRowId: number, maxRows: number) {

        // let query: string = "SELECT ITMMASTER.ITMREF_0, ITMMASTER.ITMDES1_0, " +
        //     "ITMMASTER.ITMDES2_0, ITMMASTER.EANCOD_0, ITMMASTER.TCLCOD_0, ITMMASTER.ZPACKLENGTH_0, " +
        //     "ITMMASTER.ZPACKWIDTH_0, ITMMASTER.ZPACKHEIGHT_0, ITMMASTER.ITMWEI_0, ITMMASTER.ZCROSSSELL_0, " +
        //     "ITMMASTER.ZSHOPACTIVE_0, ITMMASTER.ATTRIBUT1_0, ITMMASTER.ATTRIBUT2_0, ITMMASTER.ATTRIBUT3_0, " +
        //     "ITMMASTER.ATTRIBUT4_0, ITMMASTER.ATTRIBUT5_0, ITMMASTER.ATTRIBUT6_0, ITMMASTER.ATTRIBUT7_0, " +
        //     "ITMMASTER.ATTRIBUT8_0, ITMMASTER.ATTRIBUT9_0, ITMMASTER.ATTRIBUT10_0, ITMMASTER.ATTRIBUT11_0, " +
        //     "ITMMASTER.ATTRIBUT12_0, ITMMASTER.ATTRIBUT13_0, ITMMASTER.ITMSTA_0 " +
        //     "FROM x3v65p.EMOPILOT.ITMMASTER " +
        //     // "WHERE ITMREF_0 = 'MSUBWAY2-0-80CM000104DE';";
        //     // "WHERE ITMREF_0 = 'VIVA60000214DE';";
        //     "ORDER BY ITMMASTER.ROWID";
        // query += startRowId > 0 ? " OFFSET " + startRowId + " ROWS " + "FETCH NEXT " + maxRows + " ROWS ONLY;" : ";";

        let query: string;
        if (itmRowsNumber > 0) {

            query = "SELECT q.ITMREF_0, q.ITMDES1_0, q.ITMDES2_0, q.EANCOD_0, q.TCLCOD_0, q.ZPACKLENGTH_0, q.ZPACKWIDTH_0, " +
                "q.ZPACKHEIGHT_0, q.ITMWEI_0, q.ZCROSSSELL_0, q.ZSHOPACTIVE_0, q.ATTRIBUT1_0, q.ATTRIBUT2_0, q.ATTRIBUT3_0, " +
                "q.ATTRIBUT4_0, q.ATTRIBUT5_0, q.ATTRIBUT6_0, q.ATTRIBUT7_0, q.ATTRIBUT8_0, q.ATTRIBUT9_0, q.ATTRIBUT10_0, " +
                "q.ATTRIBUT11_0, q.ATTRIBUT12_0, q.ATTRIBUT13_0, q.ITMSTA_0 FROM " +
                "(SELECT TOP(" + itmRowsNumber + ") ROWID, ITMREF_0, ITMDES1_0, ITMDES2_0, EANCOD_0, TCLCOD_0, ZPACKLENGTH_0, " +
                "ZPACKWIDTH_0, ZPACKHEIGHT_0, ITMWEI_0, ZCROSSSELL_0, ZSHOPACTIVE_0, ATTRIBUT1_0, ATTRIBUT2_0, ATTRIBUT3_0, " +
                "ATTRIBUT4_0, ATTRIBUT5_0, ATTRIBUT6_0, ATTRIBUT7_0, ATTRIBUT8_0, ATTRIBUT9_0, ATTRIBUT10_0, ATTRIBUT11_0, " +
                "ATTRIBUT12_0, ATTRIBUT13_0, ITMSTA_0 " +
                "FROM x3v65p.EMOPILOT.ITMMASTER " +
                "ORDER BY ROWID DESC) q " +
                "ORDER BY q.ROWID ASC " +
                "OFFSET 26000 ROWS FETCH NEXT 500 ROWS ONLY;";

            // query = "SELECT q.ITMREF_0, q.ITMDES1_0, q.ITMDES2_0, q.EANCOD_0, q.TCLCOD_0, q.ZPACKLENGTH_0, q.ZPACKWIDTH_0, " +
            //     "q.ZPACKHEIGHT_0, q.ITMWEI_0, q.ZCROSSSELL_0, q.ZSHOPACTIVE_0, q.ATTRIBUT1_0, q.ATTRIBUT2_0, q.ATTRIBUT3_0, " +
            //     "q.ATTRIBUT4_0, q.ATTRIBUT5_0, q.ATTRIBUT6_0, q.ATTRIBUT7_0, q.ATTRIBUT8_0, q.ATTRIBUT9_0, q.ATTRIBUT10_0, " +
            //     "q.ATTRIBUT11_0, q.ATTRIBUT12_0, q.ATTRIBUT13_0, q.ITMSTA_0 FROM " +
            //     "(SELECT TOP(" + itmRowsNumber + ") ROWID, ITMREF_0, ITMDES1_0, ITMDES2_0, EANCOD_0, TCLCOD_0, ZPACKLENGTH_0, " +
            //     "ZPACKWIDTH_0, ZPACKHEIGHT_0, ITMWEI_0, ZCROSSSELL_0, ZSHOPACTIVE_0, ATTRIBUT1_0, ATTRIBUT2_0, ATTRIBUT3_0, " +
            //     "ATTRIBUT4_0, ATTRIBUT5_0, ATTRIBUT6_0, ATTRIBUT7_0, ATTRIBUT8_0, ATTRIBUT9_0, ATTRIBUT10_0, ATTRIBUT11_0, " +
            //     "ATTRIBUT12_0, ATTRIBUT13_0, ITMSTA_0 " +
            //     "FROM x3v65p.EMOPILOT.ITMMASTER " +
            //     "ORDER BY ROWID DESC) q " +
            //     "ORDER BY q.ROWID ASC;";
        } else {
            query = "SELECT ITMREF_0, ITMDES1_0, ITMDES2_0, EANCOD_0, TCLCOD_0, ZPACKLENGTH_0, ZPACKWIDTH_0, ZPACKHEIGHT_0, " +
                "ITMWEI_0, ZCROSSSELL_0, ZSHOPACTIVE_0, ATTRIBUT1_0, ATTRIBUT2_0, ATTRIBUT3_0, ATTRIBUT4_0, ATTRIBUT5_0, " +
                "ATTRIBUT6_0, ATTRIBUT7_0, ATTRIBUT8_0, ATTRIBUT9_0, ATTRIBUT10_0, ATTRIBUT11_0, ATTRIBUT12_0, ATTRIBUT13_0, ITMSTA_0 " +
                "FROM x3v65p.EMOPILOT.ITMMASTER " +
                "ORDER BY ROWID ASC;";
        }
        console.log("itm_master query: ", query);
        return await module.exports.sage_exec_one_query_with_promise(query);
    },

    /**
     * Get sage sorder items
     *
     * @param startRowId
     * @param maxRows
     * @param callback
     */
    sage_call_get_new_sorder_promise: async function (startRowId: number, maxRows: number) {
        let query: string = "";
        if (maxRows > 0) { // get only last items => stepNumber
            query = "SELECT " +
                "q.SOHNUM_0, q.ORDDAT_0, q.ORDNOT_0, q.ORDATI_0, q.BPCORD_0, q.CUSORDREF_0, " +
                "q.ORDSTA_0, q.PTE_0, q.CUR_0, q.ITMREF_0, q.QTY_0, q.ALLQTY_0, q.SOPLIN_0, " +
                "q.NETPRIATI_0, q.NETPRINOT_0, q.VAT_0, q.TCLCOD_0 " +
                "FROM " +
                "(SELECT TOP(" + maxRows + ") SORDER.ROWID, " +
                "SORDER.SOHNUM_0, SORDER.ORDDAT_0, SORDER.ORDNOT_0, SORDER.ORDATI_0, SORDER.BPCORD_0, SORDER.CUSORDREF_0, " +
                "SORDER.ORDSTA_0, SORDER.PTE_0, SORDER.CUR_0, SORDERQ.ITMREF_0, SORDERQ.QTY_0, SORDERQ.ALLQTY_0, SORDERQ.SOPLIN_0, " +
                "(select TOP 1 NETPRIATI_0 FROM x3v65p.EMOPILOT.SORDERP " +
                "where SORDERP.SOHNUM_0 = SORDERQ.SOHNUM_0 AND SORDERP.ITMREF_0 = SORDERQ.ITMREF_0) AS 'NETPRIATI_0', " +
                "(select TOP 1 NETPRINOT_0 FROM x3v65p.EMOPILOT.SORDERP " +
                "where SORDERP.SOHNUM_0 = SORDERQ.SOHNUM_0 AND SORDERP.ITMREF_0 = SORDERQ.ITMREF_0) AS 'NETPRINOT_0', " +
                "(select TOP 1 VAT_0 FROM x3v65p.EMOPILOT.SORDERP " +
                "where SORDERP.SOHNUM_0 = SORDERQ.SOHNUM_0 AND SORDERP.ITMREF_0 = SORDERQ.ITMREF_0) AS 'VAT_0', " +
                "ITMMASTER.TCLCOD_0 " +
                "FROM x3v65p.EMOPILOT.SORDER " +
                "inner join x3v65p.EMOPILOT.SORDERQ on SORDERQ.SOHNUM_0 = SORDER.SOHNUM_0 " +
                "left join x3v65p.EMOPILOT.ITMMASTER on ITMMASTER.ITMREF_0 = SORDERQ.ITMREF_0 " +
                "WHERE SORDER.ORDDAT_0 >= '2018-01-01 00:00:00.000' " +
                // "ORDER BY SORDER.ORDDAT_0 ASC, SORDER.SOHNUM_0 ASC " +
                "ORDER BY SORDER.ROWID DESC) q " +
                "ORDER BY q.ROWID ASC;";
        } else {
            // get all items
            query = "SELECT SORDER.SOHNUM_0, SORDER.ORDDAT_0, SORDER.ORDNOT_0, SORDER.ORDATI_0, SORDER.BPCORD_0, " +
                "SORDER.CUSORDREF_0, SORDER.ORDSTA_0, SORDER.PTE_0, SORDER.CUR_0, SORDERQ.ITMREF_0, SORDERQ.QTY_0, " +
                "SORDERQ.ALLQTY_0, SORDERQ.SOPLIN_0, " +
                "(select TOP 1 NETPRIATI_0 FROM x3v65p.EMOPILOT.SORDERP " +
                "where SORDERP.SOHNUM_0 = SORDERQ.SOHNUM_0 AND SORDERP.ITMREF_0 = SORDERQ.ITMREF_0) AS 'NETPRIATI_0', " +
                "(select TOP 1 NETPRINOT_0 FROM x3v65p.EMOPILOT.SORDERP " +
                "where SORDERP.SOHNUM_0 = SORDERQ.SOHNUM_0 AND SORDERP.ITMREF_0 = SORDERQ.ITMREF_0) AS 'NETPRINOT_0', " +
                "(select TOP 1 VAT_0 FROM x3v65p.EMOPILOT.SORDERP " +
                "where SORDERP.SOHNUM_0 = SORDERQ.SOHNUM_0 AND SORDERP.ITMREF_0 = SORDERQ.ITMREF_0) AS 'VAT_0', " +
                "ITMMASTER.TCLCOD_0 " +
                "FROM x3v65p.EMOPILOT.SORDER " +
                "inner join x3v65p.EMOPILOT.SORDERQ on SORDERQ.SOHNUM_0 = SORDER.SOHNUM_0 " +
                "left join x3v65p.EMOPILOT.ITMMASTER on ITMMASTER.ITMREF_0 = SORDERQ.ITMREF_0 " +
                "WHERE SORDER.ORDDAT_0 >= '2018-01-01 00:00:00.000' " +
                "ORDER BY SORDER.ORDDAT_0 ASC, SORDER.SOHNUM_0 ASC;"; // , SORDER.SOHNUM_0 ASC , SORDER.ROWID ASC
        }
        console.log("order promise: ", query);
        return await module.exports.sage_exec_one_query_with_promise(query);
    },

    sage_call_get_new_sdelivery: async function (startRowId: number, maxRows: number) { // MAX 234236 Einträge
        /*
        let query: string = "SELECT SDELIVERY.SDHNUM_0, SDELIVERY.DLVDAT_0, SDELIVERY.SOHNUM_0, SDELIVERY.BPCORD_0, SDELIVERY.CUR_0, " +
            "SDELIVERYD.ITMREF_0, SDELIVERYD.QTY_0, SDELIVERYD.DSPLINWEI_0, SDELIVERYD.UNTWEI_0, SDELIVERYD.SDDLIN_0 " +
            "FROM x3v65p.EMOPILOT.SDELIVERY " +
            "left join x3v65p.EMOPILOT.SDELIVERYD on SDELIVERYD.SDHNUM_0 = SDELIVERY.SDHNUM_0 " +
            "left join x3v65p.EMOPILOT.SORDER on SORDER.SOHNUM_0 = SDELIVERY.SOHNUM_0 " +
            "WHERE SDELIVERY.SHIDAT_0 >= '2018-01-01 00:00:00.000' " +
            "AND SORDER.ORDDAT_0 >= '2018-01-01 00:00:00.000' " +
            // "ORDER BY SDELIVERY.SDHNUM_0 DESC " +
            "ORDER BY SDELIVERY.SHIDAT_0 ASC, SDELIVERY.SDHNUM_0 ASC "; // , SDELIVERY.ROWID ASC
        if(startRowId > 0) {
            query += "OFFSET " + startRowId + " ROWS FETCH NEXT " + maxRows + " ROWS ONLY;";
        } else {
            query += ";";
        }
        */
        let query: string = "";
        if (maxRows > 0) { // get only last items => stepNumber
            query = "SELECT " +
                "q.SDHNUM_0, q.DLVDAT_0, q.SOHNUM_0, q.BPCORD_0, q.CUR_0, " +
                "q.ITMREF_0, q.QTY_0, q.DSPLINWEI_0, q.UNTWEI_0, q.SDDLIN_0 " +
                "FROM " +
                "(SELECT TOP(" + maxRows + ") SDELIVERY.ROWID, " +
                "SDELIVERY.SDHNUM_0, SDELIVERY.DLVDAT_0, SDELIVERY.SOHNUM_0, SDELIVERY.BPCORD_0, SDELIVERY.CUR_0, " +
                "SDELIVERYD.ITMREF_0, SDELIVERYD.QTY_0, SDELIVERYD.DSPLINWEI_0, SDELIVERYD.UNTWEI_0, SDELIVERYD.SDDLIN_0 " +
                "FROM x3v65p.EMOPILOT.SDELIVERY " +
                "left join x3v65p.EMOPILOT.SDELIVERYD on SDELIVERYD.SDHNUM_0 = SDELIVERY.SDHNUM_0 " +
                "left join x3v65p.EMOPILOT.SORDER on SORDER.SOHNUM_0 = SDELIVERY.SOHNUM_0 " +
                "WHERE SDELIVERY.SHIDAT_0 >= '2018-01-01 00:00:00.000' " +
                "AND SORDER.ORDDAT_0 >= '2018-01-01 00:00:00.000' " +
                //"ORDER BY SDELIVERY.SHIDAT_0 ASC, SDELIVERY.SDHNUM_0 ASC "; // , SDELIVERY.ROWID ASC
                "ORDER BY SDELIVERY.ROWID DESC) q " +
                "ORDER BY q.ROWID ASC;";
        } else {
            // get all items
            query = "SELECT SDELIVERY.SDHNUM_0, SDELIVERY.DLVDAT_0, SDELIVERY.SOHNUM_0, SDELIVERY.BPCORD_0, SDELIVERY.CUR_0, " +
                "SDELIVERYD.ITMREF_0, SDELIVERYD.QTY_0, SDELIVERYD.DSPLINWEI_0, SDELIVERYD.UNTWEI_0, SDELIVERYD.SDDLIN_0 " +
                "FROM x3v65p.EMOPILOT.SDELIVERY " +
                "left join x3v65p.EMOPILOT.SDELIVERYD on SDELIVERYD.SDHNUM_0 = SDELIVERY.SDHNUM_0 " +
                "left join x3v65p.EMOPILOT.SORDER on SORDER.SOHNUM_0 = SDELIVERY.SOHNUM_0 " +
                "WHERE SDELIVERY.SHIDAT_0 >= '2018-01-01 00:00:00.000' " +
                "AND SORDER.ORDDAT_0 >= '2018-01-01 00:00:00.000' " +
                // "ORDER BY SDELIVERY.SDHNUM_0 DESC " +
                "ORDER BY SDELIVERY.SHIDAT_0 ASC, SDELIVERY.SDHNUM_0 ASC "; // , SDELIVERY.ROWID ASC
        }
        console.log("sdelivery promise: ", query);
        return await module.exports.sage_exec_one_query_with_promise(query);
    },

    sage_call_get_new_sinvoice: async function (startRowId: number, maxRows: number) { // MAX 663096 Einträge
        let query: string = "";
        if (maxRows > 0) { // get only last items => stepNumber
            query = "SELECT " +
                "q.NUM_0, q.BPR_0, q.CREDAT_0, q.CREUSR_0, q.UPDUSR_0, " +
                "q.UPDDAT_0, q.CUR_0, q.SDHNUM_0, q.SOHNUM_0, q.PTE_0, q.ITMREF_0, q.NETPRIATI_0, " +
                "q.NETPRINOT_0, q.QTY_0, q.QTYSTU_0, q.SIDLIN_0, q.INVPRNBOM_0, q.INVDAT " +
                "FROM " +
                "(SELECT TOP(" + maxRows + ") SINVOICE.ROWID, " +
                "SINVOICE.NUM_0, SINVOICE.BPR_0, SINVOICE.CREDAT_0, SINVOICE.CREUSR_0, SINVOICE.UPDUSR_0, " +
                "SINVOICE.UPDDAT_0, SINVOICE.CUR_0, SDELIVERY.SDHNUM_0, SORDER.SOHNUM_0, SORDER.PTE_0, SINVOICED.ITMREF_0, " +
                "SINVOICED.NETPRIATI_0, SINVOICED.NETPRINOT_0, SINVOICED.QTY_0, SINVOICED.QTYSTU_0, SINVOICED.SIDLIN_0, " +
                "SINVOICED.INVPRNBOM_0, SINVOICED.INVDAT " +
                "FROM x3v65p.EMOPILOT.SINVOICE " +
                "left join x3v65p.EMOPILOT.SINVOICED on SINVOICED.NUM_0 = SINVOICE.NUM_0 " +
                "left join x3v65p.EMOPILOT.SORDER on SORDER.LASINVNUM_0 = SINVOICE.NUM_0 " +
                "left join x3v65p.EMOPILOT.SDELIVERY on SDELIVERY.SDHNUM_0 = SORDER.LASDLVNUM_0 " +
                "WHERE SINVOICE.ACCDAT_0 >= '2018-01-01 00:00:00.000' " +
                "AND SORDER.ORDDAT_0 >= '2018-01-01 00:00:00.000' " +
                // "ORDER BY SINVOICE.ACCDAT_0 ASC, SINVOICE.NUM_0 ASC "; // , SINVOICE.ROWID ASC
                "ORDER BY SINVOICE.ROWID DESC) q " +
                "ORDER BY q.ROWID ASC;";
        } else {
            // get all items
            query = "SELECT SINVOICE.NUM_0, SINVOICE.BPR_0, SINVOICE.CREDAT_0, SINVOICE.CREUSR_0, SINVOICE.UPDUSR_0, " +
                "SINVOICE.UPDDAT_0, SINVOICE.CUR_0, SDELIVERY.SDHNUM_0, SORDER.SOHNUM_0, SORDER.PTE_0, SINVOICED.ITMREF_0, " +
                "SINVOICED.NETPRIATI_0, SINVOICED.NETPRINOT_0, SINVOICED.QTY_0, SINVOICED.QTYSTU_0, SINVOICED.SIDLIN_0, " +
                "SINVOICED.INVPRNBOM_0, SINVOICED.INVDAT " +
                "FROM x3v65p.EMOPILOT.SINVOICE " +
                "left join x3v65p.EMOPILOT.SINVOICED on SINVOICED.NUM_0 = SINVOICE.NUM_0 " +
                "left join x3v65p.EMOPILOT.SDELIVERY on SDELIVERY.SDHNUM_0 = SORDER.LASDLVNUM_0 " +
                "left join x3v65p.EMOPILOT.SORDER on SORDER.LASINVNUM_0 = SINVOICE.NUM_0 " +
                "WHERE SINVOICE.ACCDAT_0 >= '2018-01-01 00:00:00.000' " +
                "AND SORDER.ORDDAT_0 >= '2018-01-01 00:00:00.000' " +
                "ORDER BY SINVOICE.ACCDAT_0 ASC, SINVOICE.NUM_0 ASC "; // , SINVOICE.ROWID ASC
        }
        console.log("sinvoice promise: ", query);
        return await module.exports.sage_exec_one_query_with_promise(query);
    },

    sage_call_get_all_sorderp: function (callback: any) { // MAX 1104350 Einträge
        let query: string = "SELECT SOHNUM_0, ITMREF_0, NETPRINOT_0, NETPRIATI_0, VAT_0 FROM x3v65p.EMOPILOT.SORDERP;";
        // let query: string = "SELECT * FROM x3v65p.EMOPILOT.SORDERP " +
        // "WHERE SOHNUM_0 = '20013AU00001';"; // TOP (10)
        mssqlCall(query, function (data: any) {
            // console.log('SORDP RESULT: ', data);
            // console.log('Bin hier... ', 'SORDERP111');
            // throw new Error("hmmm");
            callback(data);
        });
    },
    sage_call_get_all_sorderp_by_itmnum: function (itmnum: string, callback: any) { // MAX 1104350 Einträge
        let query: string = "SELECT SOHNUM_0, ITMREF_0, NETPRINOT_0, NETPRIATI_0, VAT_0 FROM x3v65p.EMOPILOT.SORDERP WHERE SOHNUM_0 = '" + itmnum + "';";
        mssqlCall(query, function (data: any) {
            callback(data);
        });
    },
    sage_call_get_all_sorderq: function (callback: any) { // MAX 1104357 Einträge
        let query: string = "SELECT SOHNUM_0, ITMREF_0, QTY_0, ALLQTY_0 FROM x3v65p.EMOPILOT.SORDERQ;";
        // let query: string = "SELECT * FROM x3v65p.EMOPILOT.SORDERQ " +
        //     "WHERE SOHNUM_0 = '20013AU00001';";
        mssqlCall(query, function (data: any) {
            callback(data);
        });
    },
    sage_call_get_all_sorderq_by_itmnum: function (itmnum: string, callback: any) { // MAX 1104357 Einträge
        let query: string = "SELECT * FROM x3v65p.EMOPILOT.SORDERQ WHERE SOHNUM_0 = '" + itmnum + "';";
        mssqlCall(query, function (data: any) {
            callback(data);
        });
    },
    sage_call_get_all_sdeliveryd: function (callback: any) { // MAX 1060707 Einträge
        let query: string = "SELECT TOP (10) * FROM x3v65p.EMOPILOT.SDELIVERYD;";
        // let query: string = "SELECT TOP (10) * FROM x3v65p.EMOPILOT.SDELIVERYD " +
        //     "WHERE SOHNUM_0 = '20013AU00001';";
        mssqlCall(query, function (data: any) {
            callback(data);
        });
    },
    sage_call_get_all_sinvoiced: function (callback: any) { // MAX 953041 Einträge
        let query: string = "SELECT TOP (10) * FROM x3v65p.EMOPILOT.SINVOICED;";
        // let query: string = "SELECT TOP (10) * FROM x3v65p.EMOPILOT.SINVOICED " +
        //     "WHERE SOHNUM_0 = '20013AU00001';";
        mssqlCall(query, function (data: any) {
            callback(data);
        });
    },
    /**
     * STOCK => WAREHOUSING (Lager)
     */
    sage_call_get_all_stock: async function (startNumber: number, stepNumber: number) {
        /**
         * STOFCY_0,    ITMREF_0,    LOT_0,            LOC_0,        STA_0,        QTYPCU_0    CREDAT_0
         * 401            PK2587076   LO18084010156   114A01      A            12            2020-05-07 00:00:00
         */
        let query: string = "SELECT STOFCY_0, ITMREF_0, LOT_0, LOC_0, STA_0, QTYPCU_0, CREDAT_0 " +
            "FROM x3v65p.EMOPILOT.STOCK " +
            "ORDER BY ROWID ASC";
        query += startNumber > 0 ? " OFFSET " + startNumber + " ROWS " + "FETCH NEXT " + stepNumber + " ROWS ONLY;" : ";";
        // "WHERE SOHNUM_0 = '20013AU00001';";
        console.log("query: ", query);
        return await module.exports.sage_exec_one_query_with_promise(query);
    },
    /**
     * BOMD => DIST_COMPONENTS (Artikel Stücklisten)
     */
    sage_call_get_all_bomd: async function (rowsNumber: number) {
        // let query: string = "SELECT ITMREF_0, CPNITMREF_0, BOMQTY_0 FROM x3v65p.EMOPILOT.BOMD " +
        //     "ORDER BY ROWID ASC " +
        //     "OFFSET " + startNumber + " ROWS " + "FETCH NEXT " + stepNumber + " ROWS ONLY;";
        let query: string = "";
        if (rowsNumber > 0) { // get only last items => stepNumber

            // 2022
            query = "SELECT DISTINCT q.ITMREF_0, q.CPNITMREF_0, q.BOMQTY_0 FROM " +
                "(SELECT TOP(" + rowsNumber + ") ROWID, ITMREF_0, CPNITMREF_0, BOMQTY_0 FROM x3v65p.EMOPILOT.BOMD " +
                "ORDER BY ROWID DESC) q " +
                "ORDER BY q.ITMREF_0, q.CPNITMREF_0 ASC;";

            // query = "SELECT q.ITMREF_0, q.CPNITMREF_0, q.BOMQTY_0 FROM " +
            // "(SELECT TOP(" + rowsNumber + ") ROWID, ITMREF_0, CPNITMREF_0, BOMQTY_0 FROM x3v65p.EMOPILOT.BOMD " +
            // "ORDER BY ROWID DESC) q " +
            // "ORDER BY q.ROWID ASC;";
        } else {
            // get all items
            query = "SELECT ITMREF_0, CPNITMREF_0, BOMQTY_0 FROM x3v65p.EMOPILOT.BOMD ORDER BY ROWID ASC;";
        }
        console.log("query: ", query);
        return await module.exports.sage_exec_one_query_with_promise(query);
    },
    /**
     * TABCUR => CURRENCIES (Währungen)
     */
    sage_call_get_all_tabcur: async function () {
        /**
         * CURSHO_0,            CUR_0,              CURSYM_0
         * Euro                 EUR                 €
         */
        let query: string = "SELECT CURSHO_0, CUR_0, CURSYM_0 FROM x3v65p.EMOPILOT.TABCUR " +
            "ORDER BY CURSYM_0 DESC, CUR_0 ASC;";
        // "ORDER BY ROWID ASC;";
        console.log("query: ", query);
        return await module.exports.sage_exec_one_query_with_promise(query);
    },
    sage_exec_one_query_with_promise: function(query: any) {
        // execOneMSSQLQueryWithPromise(query, function (result) {
        //     callback(result);
        // });
        return new Promise((resolve, reject) => {
            // console.log('Promise query: ', query);
            // @ts-ignore
            mssql_get_it_through_async(query, function (queryResult) {
                resolve(queryResult);
            });
        });
    }
};

async function mssqlCall (query: string, callback: any) {
    let successData = await dbCall(query);
    callback(successData);
}

/*
    send the query string to db
 */
async function dbCall(query: any) {
    // pool will always be connected when the promise has resolved - may reject if the connection config is invalid
    const pool = await getPool('sage', config);
    try {
        const result = await pool.request().query(query);
        // console.dir("query-result: ", result.recordset);
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
        // @ts-ignore
        logger.error(new Error(err));
        return {error: 'SQL error'};
    }
}

async function mssql_get_it_through_async (query: string, callback: any) {
    // console.log('mssql_get_it_through: ', query);
    // @ts-ignore
    await mssqlCall(query, function (data) {
        callback(data);
    });
}
