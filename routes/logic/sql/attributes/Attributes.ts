/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 26.10.2021 */

import * as sql from 'mssql';
import * as mssqlCall from '../../mssql_call';
import {constants} from '../../constants/constants';
import {execMSSQLQueryWithPromise} from '../../mssql_logic';
import {mssql_last_table_id} from '../table/Table';


/**
 * select all from attributes table
 */
export async function mssql_select_Attributes() {
    let selectQuery: string = `SELECT * FROM ` + constants.DB_TABLE_PREFIX + `ATTRIBUTES`;
    return await mssqlCall.mssqlCallEscaped([], selectQuery);
}

/**
 * select all (except youtube items) from attributes table
 */
export async function select_Attributes_Except_Youtube() {
    let selectQuery: string = `SELECT * FROM ` + constants.DB_TABLE_PREFIX + `ATTRIBUTES 
    WHERE ATTRIBUTE_NAME != 'ATTR_YOUTUBE' ORDER BY ATTRIBUTE_NAME ASC`;
    return await mssqlCall.mssqlCallEscaped([], selectQuery);
}

/**
 * check if attributes exists for given item basis and
 *
 * @param objectData
 */
export async function checkExistingAttributes(objectData: {primaryValue: string, secondaryValue: string}) {
    console.log('objectData: ', objectData);
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'PRIMARY_VALUE', type: sql.VarChar, value: objectData.primaryValue},
        {name: 'SECONDARY_VALUE', type: sql.VarChar, value: objectData.secondaryValue}];
    let checkQuery: string = `SELECT ATTRIBUTE_ID, BB.ATTRIBUTE_NAME, BB.ATTRIBUTE_DATA 
                    FROM ` +
        constants.DB_TABLE_PREFIX + `ATTRIBUTE_RELATIONS AA 
                    LEFT JOIN ` +
        constants.DB_TABLE_PREFIX + `ATTRIBUTES BB ON BB.ID = AA.ATTRIBUTE_ID 
                    WHERE AA.ITEM_BASIS_ID = @PRIMARY_VALUE AND BB.ATTRIBUTE_NAME = @SECONDARY_VALUE `;
    return await mssqlCall.mssqlCallEscaped(inputParamsArray, checkQuery);
}

/**
 * update article attributes - cron sage import function
 *
 * @param primaryValue
 * @param secondaryValue
 * @param elementsArray
 */
export async function updateAttributes(primaryValue: string, secondaryValue: any, elementsArray: any) {
    let newSecondaryValue: string;
    let insertUpdateQueriesArr: any[] = [];
    let insertYoutubeQuery: string = '';
    let insertYoutubeRelationQuery: string = '';
    const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    const ARTICLE_DEFAULT_ATTRIBUTES: {} = constants.ARTICLE_DEFAULT_ATTRIBUTES;
    // get all attributes except youtube, to be able ot find id of attribute for insert a new one...
    // let allAttributesExceptYoutube: {} = await select_Attributes_Except_Youtube();
    let query: string = '';
    let checkQueryData: any[] = [];
    let inputParamsArray: { name: string, type: any, value: any }[] = [
        {name: 'PRIMARY_VALUE', type: sql.VarChar, value: primaryValue}];
    for (let key in elementsArray) {
        if (elementsArray.hasOwnProperty(key)) {
            key = key.trim();
            let checkQuery: string =
                `SELECT ATTRIBUTE_ID, BB.ATTRIBUTE_NAME, BB.ATTRIBUTE_DATA 
                    FROM ` + DB_TABLE_PREFIX + `ATTRIBUTE_RELATIONS AA 
                    LEFT JOIN ` + DB_TABLE_PREFIX + `ATTRIBUTES BB ON BB.ID = AA.ATTRIBUTE_ID 
                    WHERE AA.ITEM_BASIS_ID = @PRIMARY_VALUE `;
            let foundDefAttr: boolean = false;
            for (let defAttrItem in ARTICLE_DEFAULT_ATTRIBUTES) {
                if (ARTICLE_DEFAULT_ATTRIBUTES.hasOwnProperty(defAttrItem) &&
                    key === ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem]) {
                    if (!foundDefAttr) {
                        checkQuery += `AND (`;
                        foundDefAttr = true;
                    }
                    checkQuery += `BB.ATTRIBUTE_NAME = '` + key + `' OR `;
                }
            }
            // remove last OR
            checkQuery = foundDefAttr ? checkQuery.substr(0, checkQuery.length - 3) + `)` : checkQuery;
            checkQueryData = await mssqlCall.mssqlCallEscaped(inputParamsArray, checkQuery);
            if (checkQueryData.length === 0) {
                // console.log('INSERT... ', key);
                // Workaround to be able to store youtube attribute, because if it is not edited, then value is null
                if (elementsArray[key] || ((elementsArray[key] === '') && (key === 'ATTR_YOUTUBE'))) {
                    // Attribute is not available => insert all default attributes
                    const __ret = getAttrInsertQuery(key, insertYoutubeQuery, insertYoutubeRelationQuery, query,
                        elementsArray, primaryValue, secondaryValue);
                    insertYoutubeQuery = __ret.insertYoutubeQuery;
                    insertYoutubeRelationQuery = __ret.insertYoutubeRelationQuery;
                    query = __ret.query;
                }
            } else {
                // Check if current (default attribute) key is already available in article table:
                // if available => update, otherwise => insert
                let defaultAttrFound: boolean = false;
                for (let checkQItem in checkQueryData) {
                    if (checkQueryData[checkQItem].ATTRIBUTE_NAME?.trim() === key && // ATTR_CATEGORY_1
                        (checkQueryData[checkQItem].ATTRIBUTE_ID !== elementsArray[key] &&
                            (key === 'ATTR_YOUTUBE' || elementsArray[key] !== ''))) { // Keramik
                        defaultAttrFound = true;
                        // load the id of attribute, to update it...
                        secondaryValue = checkQueryData[checkQItem].ATTRIBUTE_ID;
                        newSecondaryValue = elementsArray[key];
                        break;
                    }
                }
                if (defaultAttrFound) {
                    // Attribute is available => update
                    query = getAttrUpdateQuery(key, query, elementsArray, secondaryValue, newSecondaryValue,
                        primaryValue);
                } else {
                    // Attribute is not available => insert
                }
            }
            // console.log("query: ", query);
            if (query && query.length > 0) {
                insertUpdateQueriesArr.push(query);
            }
            query = '';
        }
    }
    // console.log('insertUpdateQueriesArr: ', insertUpdateQueriesArr);
    if (insertUpdateQueriesArr && Object.keys(insertUpdateQueriesArr).length > 0) {
        return await execMSSQLQueryWithPromise([], insertUpdateQueriesArr).then(async r => {
            return await insertYoutubeFunc(insertYoutubeQuery, insertYoutubeRelationQuery);
        });
    } else {
        return await insertYoutubeFunc(insertYoutubeQuery, insertYoutubeRelationQuery);
    }
}

function getAttrUpdateQuery(key: string, query: string, elementsArray: any, oldSecondaryValue: any,
                            newSecondaryValue: any, primaryValue: any) {
    const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    if ((key === 'ATTR_YOUTUBE') || (key === 'ATTR_CRAFT') || (key === 'ATTR_SHOP_ACTIVE')) {
        const value: string = ((key === 'ATTR_CRAFT') || (key === 'ATTR_SHOP_ACTIVE')) ?
            (elementsArray[key] ? `1` : `0` ) : `'` + elementsArray[key] + `'`;
        query = `UPDATE ` + DB_TABLE_PREFIX + `ATTRIBUTES SET ATTRIBUTE_DATA = ` + value + ` WHERE ID = '` +
            oldSecondaryValue + `' AND ATTRIBUTE_NAME = '` + key + `'`;
    } else {
        query = `UPDATE ` + DB_TABLE_PREFIX + `ATTRIBUTE_RELATIONS SET ATTRIBUTE_ID = '` + newSecondaryValue + `' 
            WHERE ITEM_BASIS_ID = '` + primaryValue + `' AND ATTRIBUTE_ID = '` + oldSecondaryValue + `'`;
    }
    // console.log('getAttrUpdateQuery: ', query);
    return query;
}

function getAttrInsertQuery(key: string, insertYoutubeQuery: string, insertYoutubeRelationQuery: string,
                            query: string, elementsArray: any, primaryValue: any, secondaryValue: any) {
    const DB_TABLE_PREFIX: string = constants.DB_TABLE_PREFIX;
    if (key === 'ATTR_YOUTUBE') {
        insertYoutubeQuery = `INSERT INTO ` + DB_TABLE_PREFIX + `ATTRIBUTES (ATTRIBUTE_NAME,ATTRIBUTE_DATA) VALUES 
        ('` + key + `','` + elementsArray[key] + `')`;
        insertYoutubeRelationQuery = `INSERT INTO ` + DB_TABLE_PREFIX + `ATTRIBUTE_RELATIONS 
        (ITEM_BASIS_ID, ATTRIBUTE_ID) VALUES ('` + primaryValue + `',`;
    } else {
        query = `INSERT INTO ` + DB_TABLE_PREFIX + `ATTRIBUTE_RELATIONS (ITEM_BASIS_ID, ATTRIBUTE_ID) VALUES ('` +
            primaryValue + `', '` + elementsArray[key] + `')`; // secondaryValue
    }
    // console.log('Insert query: ', query);
    return {insertYoutubeQuery, insertYoutubeRelationQuery, query};
}

async function insertYoutubeFunc(insertYoutubeQuery: string, insertYoutubeRelationQuery: string) {
    // If Youtube link is nt available, insert it, get new attribute id and insert into attribute relations
    if (insertYoutubeQuery && insertYoutubeRelationQuery) {
        await mssqlCall.mssqlCall(insertYoutubeQuery);
        let lastAttributeIDResult: any =
            await mssql_last_table_id('ATTRIBUTES', 'ID', undefined,
                undefined);
        if (typeof lastAttributeIDResult === 'number') {
            insertYoutubeRelationQuery += `'` + lastAttributeIDResult + `')`;
            await mssqlCall.mssqlCall(insertYoutubeRelationQuery);
            return {success: true};
        }
    } else {
        return {success: true};
    }
}

/**
 * check if given delivery note position item is one of given invoices positions entries
 *
 * @param invPositions
 * @param deliveryNotePosition
 * @return true if delivery note position is in invoice positions, otherwise false
 */
function checkPositionIsInInvp(invPositions: any, deliveryNotePosition: any) {
    let invQTY = 0;
    let foundSameITMNUM = false;
    for (let ivItem in invPositions) {
        if (invPositions.hasOwnProperty(ivItem) && invPositions[ivItem].ITMNUM === deliveryNotePosition.ITMNUM &&
            invPositions[ivItem].DELIVERY_NOTES_POSITIONS_ID === deliveryNotePosition.ID) {
            foundSameITMNUM = true;
            invQTY += invPositions[ivItem].ORDER_QTY;
            break;
        }
    }
    if (foundSameITMNUM) {
        if (deliveryNotePosition.ORDER_QTY === invQTY) {
            return true;
        }
    }
    return false;
}
