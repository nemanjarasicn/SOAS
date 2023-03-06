/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 01.06.2021 */

import {constants} from '../../constants/constants';

/**
 * Get current date formatted for storing it in db
 *
 * @returns {string}
 */
export function getCurrentDate() {
    let now = new Date();
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':'
        + now.getMinutes() + ':00';
}

/**
 * Get current date with seconds formatted for storing it in db
 *
 * @returns {string}
 */
export function getCurrentDateWithSeconds() {
    let now = new Date();
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':'
        + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();
}

/**
 * get date for query
 *
 * @param locale de_DE - optional
 * @param timeZoneBase - optional
 */
export function getDateForQuery(locale?: string, timeZoneBase?: string) { // , timeZoneBase: string, timeZoneCurrent: string
    // return "GETDATE() AT TIME ZONE '" + timeZoneBase + "' " + "AT TIME ZONE '" + timeZoneCurrent + "' ";
    // Output: 2021-5-26 15:25:17
    if (locale && timeZoneBase) {
        return new Date().toLocaleString(locale, {timeZone: timeZoneBase});
    } else {
        // https://stackoverflow.com/a/13219636
        return new Date().toISOString();
        // return new Date().toLocaleString(constants.LOCALE, {timeZone: constants.TIME_ZONE_BASE});
    }
}

/**
 * 1. Check if given param is a string and then trim it.
 * 2. Check if param is a Date and format it to ISO string.
 *
 * https://stackoverflow.com/a/1353711
 * @param date
 */
export function checkDate(date: any) {
    if (typeof date === 'string') {
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
