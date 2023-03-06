const logger = require('../config/winston');

/**
 * start tracking time
 *
 * @param functionName
 * @returns startTime start time as number of milliseconds
 */
export function startTimeTracking(functionName: string) {
    let startTime = new Date().getTime();
    let startDate = new Date();
    console.log(functionName + ' STARTED AT ... ', startDate.getHours() + ':' + startDate.getMinutes() +
        ':' + startDate.getSeconds() + '.' + startDate.getMilliseconds());
    // @ts-ignore
    logger.info(functionName + ' STARTED AT ... ' + startDate.getHours() + ':' + startDate.getMinutes() +
        ':' + startDate.getSeconds() + '.' + startDate.getMilliseconds());
    return startTime;
}

/**
 * stop time tracking, compare with start date and print time duration
 *
 * @param startTime
 * @param functionName
 */
export function stopTimeTracking(startTime: number, functionName: string) {
    let stopDate = new Date();
    let stopTime: number | Date = stopDate.getTime() - startTime;
    stopTime = new Date(stopTime);
    console.log(functionName + ' STOPPED AT ... ', stopDate.getHours() + ':' + stopDate.getMinutes() +
        ':' + stopDate.getSeconds() + '.' + stopDate.getMilliseconds());
    console.log(functionName + " Duration: " + (stopTime.getHours() - 1) + ':' + stopTime.getMinutes() +
        ':' + stopTime.getSeconds() + '.' + stopTime.getMilliseconds());
    // @ts-ignore
    logger.info(functionName + ' STOPPED AT ... ' + stopDate.getHours() + ':' + stopDate.getMinutes() +
        ':' + stopDate.getSeconds() + '.' + stopDate.getMilliseconds());
    // @ts-ignore
    logger.info(functionName + "Duration (Hours:Minutes:Seconds): " + (stopTime.getHours() - 1) + ':' +
        stopTime.getMinutes() + ':' + stopTime.getSeconds()+ '.' + stopTime.getMilliseconds());
}

/**
 * remove last char from given string
 *
 * @param values: string
 */
export function removeLastChar(values: string) {
    if (values.length) {
        values = values.trim();
        values = values.substr(0, values.length - 1);
    }
    return values;
}

/**
 * append items to query
 *
 * @param additionalColumnsArr
 * @param additionalColumnsTypes
 * @param query
 * @param removeLastComma - optional - true by default
 */
export function addItemsToQuery(additionalColumnsArr: string[], additionalColumnsTypes: any,
                         query: string, removeLastComma: boolean = true) {
    let added: boolean = false;
    if (additionalColumnsArr && additionalColumnsArr.length > 0) {
        for (let item in additionalColumnsArr) {
            if (Object.values(additionalColumnsTypes).includes(additionalColumnsArr[item])) {
                query +=
                    additionalColumnsTypes[additionalColumnsArr[item] as keyof typeof additionalColumnsTypes] + `,`;
                added = true;
            }
        }
    }
    if (removeLastComma && added) {
        //remove last comma
        query = removeLastChar(query);
    }
    return query;
}

/**
 * get item for query
 *
 * @param additionalColumnsArr
 * @param additionalColumnsTypes
 */
export function getItemForQuery(additionalColumnsArr: string[], additionalColumnsTypes: any) {
    let itemValue: any;
    // console.log('test' + additionalColumnsArr);
    if (additionalColumnsArr && additionalColumnsArr.length > 0) {
        for (let addItem in additionalColumnsArr) {
            if (Object.values(additionalColumnsTypes).includes(additionalColumnsArr[addItem])) {
                itemValue = additionalColumnsTypes[additionalColumnsArr[addItem] as keyof typeof additionalColumnsTypes];
            }
        }
    }
    console.log('getItemForQuery: ' + (itemValue ? 'itemValue: ' + itemValue : 'ERROR - itemValue was not found! '));
    return itemValue;
}

/**
 * calculate taxation amount by subtracting gross price from net price
 *
 * @param priceBru
 * @param priceNet
 * @param decimalPlaces
 */
export function calcTaxAmount(priceBru: number, priceNet: number, decimalPlaces: number = 3) {
    let taxAmount: number = Number(Number(priceBru) - Number(priceNet));
    return Number(taxAmount.toFixed(decimalPlaces));
}
