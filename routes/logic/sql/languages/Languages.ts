/* AUTHOR: Andreas Lening */
/* LAST UPDATE: 09.06.2021 */

import * as mssqlCall from '../../mssql_call';
import {constants} from '../../constants/constants';

/**
 * get all languages data
 */
export async function getAllLanguages() {
    return await mssqlCall.mssqlCallEscaped([],
        `SELECT * FROM ` + constants.DB_TABLE_PREFIX + `LANGUAGES`);
}
