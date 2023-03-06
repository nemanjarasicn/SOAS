/* AUTHOR: Stefan Schimmelpfennig & Andreas Lening */
// @ts-ignore
import mssqlCall = require('./mssql_call');

module.exports = {
    mssql_query_active_batches: async function (activeFlag: string, callback: (arg0: any) => void) {
        let query = "SELECT * FROM SOAS.dbo.BATCH_PROCESSES WHERE BATCH_ACTIVE = " + activeFlag;
        // console.log("query: ", query);
        // @ts-ignore
        return await mssqlCall.mssqlCall(query);
    }
};
