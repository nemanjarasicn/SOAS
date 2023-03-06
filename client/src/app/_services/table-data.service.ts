import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {ConstantsService, SoasModel, ViewQueryTypes} from "./constants.service";
import {Router} from "@angular/router";
import {SequelizeModelOption} from "../interfaces/sequelize-model-option";

@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  constructor(
    private http: HttpClient,
    private CONSTANTS: ConstantsService,
    private router: Router
  ) {
  }

  /**
   * redirect to given uri
   *
   * @param uri
   */
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      if (uri) {
        this.router.navigate([uri]);
      }
    });
  }

  /**
   * returns all rows of a table.
   *
   * For example to load customer data provide as id referral table 'custbtwoc' or 'custbtwob' and
   * as view query type 'PURE_SELECT'. As result, it returns all rows of CUSTOMERS table.
   *
   * @param viewQueryType - type of view query: 'MAIN_TABLE', 'DETAIL_TABLE' or 'PURE_SELECT'
   * @param data - refTable, e.g. 'custbtwoc'
   * @param orderByColumn - optional
   * @param orderByDirection - optional
   */
  getTableData(viewQueryType: ViewQueryTypes, data: string, orderByColumn?: string, orderByDirection?: string):
    Promise<{ table: [any[string], any[]], maxRows: number, page: number }> {
    let url: string = this.CONSTANTS.SERVER_URL + '/table';
    let body: {} = (orderByColumn && orderByDirection) ?
      {id: data, viewQueryType: viewQueryType, orderByColumn: orderByColumn, orderByDirection: orderByDirection} :
      {id: data, viewQueryType: viewQueryType};
    return this.http.post(url, body).toPromise().then((res: any) => {
      return res;
    }, err => {
      return err;
    });
  }

  /**
   * Get customers data from server
   *
   * @param refTable - db table, e.g. 'custbtwoc'
   * @param viewQueryType - type of view query: 'MAIN_TABLE', 'DETAIL_TABLE' or 'PURE_SELECT'
   * @param customerColumn - e.g. 'CUSTOMERS_NUMBER'
   * @param customersNumber => null - get all customers for table view;
   *                        => '00000000000000' - get empty data fields for new customer form;
   *                        => '50019CUS20038' - get one specific customer data;
   *                                             returns B2C or B2B items, no need to specify CUSTOMERS_TYPE;
   * @param optionalParameterColumn => optional, e.g. provide 'CUSTOMERS_TYPE' to receive B2C or B2B items for customers.
   *                                              provide 'CUSGROUP' for prilists;
   * @param optionalParameterValue => optional, e.g. 'B2B'
   */
  async getTableDataByCustomersNumber(refTable: string, viewQueryType: ViewQueryTypes,
                                      customerColumn: string, customersNumber: string,
                                      optionalParameterColumn?: string, optionalParameterValue?: string):
    Promise<{ table: [any[string], any[]], maxRows: number, page: number }> {
    if (optionalParameterColumn && optionalParameterValue) {
      return await this.getTableDataById(refTable, viewQueryType, customerColumn, customersNumber, optionalParameterColumn,
        optionalParameterValue);
    } else {
      return await this.getTableDataById(refTable, viewQueryType, customerColumn, customersNumber);
    }
  }

  /**
   * Get table data from server by column and id
   *
   * @param refTable
   * @param viewQueryType - type of view query: 'MAIN_TABLE', 'DETAIL_TABLE' or 'PURE_SELECT'
   * @param column
   * @param id
   * @param secondColumn
   * @param secondId
   * @param offsetRowCount
   * @param fetchRowCount
   */
  getTableDataById(refTable: string, viewQueryType: ViewQueryTypes, column: string, id: string,
                   secondColumn?: string, secondId?: string | {}, offsetRowCount?: number, fetchRowCount?: number):
    Promise<{ table: [any[string], any[]], maxRows: number, page: number }> {
    return new Promise((resolve, reject) => {
      if (refTable) {
        let url: string = '/table';
        let body: {} = {
          id: refTable,
          viewQueryType: viewQueryType,
          customerColumn: column,
          customerId: id,
          offsetRowCount: offsetRowCount,
          fetchRowCount: fetchRowCount,
        }
        console.log(column);
        if (secondColumn && secondId) {
          body['secondColumn'] = secondColumn;
          body['secondId'] = secondId;
        }
        this.http.post(url, body)
          .toPromise()
          .then((res: any) => {
            resolve(res);
          });
      } else {
        reject(undefined);
      }
    });
  }

  /**
   * Check if given data is consistent
   *
   * @param refTable
   * @param objectData
   * @param onlyCheck
   */
  checkTableData(refTable: string, objectData: object, onlyCheck: boolean): Promise<{ result: any }> {
    return new Promise((resolve, reject) => {
      if (refTable && objectData) {
        let url: string = this.CONSTANTS.SERVER_URL + '/check';
        let body: {} = {
          refTable: refTable,
          objectData: objectData,
          onlyCheck: onlyCheck
        };
        this.http.post(url, body)
          .toPromise()
          .then((res: any) => {
            resolve(res);
          });
      } else {
        console.log('refTable or objectData is undefined...');
        reject(undefined);
      }
    });
  }

  /**
   * Search given text in one column of the table. Use 'LIKE' if needed.
   *
   * @param refTable - 'articles'
   * @param searchColumn - 'ITMNUM' or 'LOC'
   * @param searchText - 'INF'
   * @param primaryColumn - 'CROSSSELLING_FLG'
   * @param primaryValue - '1' or 'text'
   * @param searchWithLike - false
   * @param returnArray - if true, returned result be an array
   * @param additionalColumns - optional, specify column names, separated by comma, e.g. "ITMNUM,NAME".
   */
  searchTableColumnData(refTable: string, searchColumn: string, searchText: string, primaryColumn: string,
                        primaryValue: any, searchWithLike: boolean, returnArray: boolean, additionalColumns: string): Promise<{}> {
    return new Promise((resolve, reject) => {
      if (refTable) {
        let url: string = this.CONSTANTS.SERVER_URL + '/search';
        let body: {} = {
          refTable: refTable,
          searchColumn: searchColumn,
          searchText: searchText,
          primaryColumn: primaryColumn,
          primaryValue: primaryValue,
          searchWithLike: searchWithLike,
          additionalColumns: additionalColumns
        };
        this.http.post(url, body)
          .toPromise()
          .then((res: any) => {
            resolve(res);
          });
      } else {
        return reject((returnArray) ? [] : undefined);
      }
    });
  }

  /**
   * get from data by customer number
   *
   * @param refTable
   * @param customerColumn
   * @param customersNumber
   * @param secondColumn
   * @param secondId
   * @param createNewItemMode
   */
  getFormDataByCustomersNumber(refTable: string, customerColumn: string, customersNumber: string,
                               secondColumn: string, secondId: string, createNewItemMode: boolean): Promise<{}> {
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/createform';
      let body: {} = {
        id: refTable,
        language: localStorage.getItem(this.CONSTANTS.LS_LANGUAGE)
      };
      if (!createNewItemMode) {
        url = this.CONSTANTS.SERVER_URL + '/form';
        body = {
          id: refTable,
          customercolumn: customerColumn,
          customerid: customersNumber,
          secondcolumn: secondColumn,
          secondid: secondId,
          language: localStorage.getItem(this.CONSTANTS.LS_LANGUAGE)
        }
      }
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        });
    });
  }

  /**
   * get form data by item number
   *
   * @param refTable
   * @param itemNumber
   */
  getFormDataByItem(refTable: string, itemNumber: string): Promise<{}> {
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/form';
      let body: {} = {
        id: refTable,
        customercolumn: 'ITMNUM',
        customerid: itemNumber,
        secondcolumn: undefined,
        secondid: undefined,
        language: localStorage.getItem(this.CONSTANTS.LS_LANGUAGE)
      };
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        });
    });
  }

  /**
   * get db data for formly form
   *
   * @param refTable
   * @param customerColumn
   * @param customersNumber
   * @param secondColumn
   * @param secondId
   */
  getFormlyFormData(
    refTable: string,
    customerColumn: string,
    customersNumber: string,
    secondColumn: string,
    secondId: string
  ): Promise<{row: { data: {}, rows: number, page: number }}> {
    return new Promise((resolve, reject) => {
      if (refTable) {
        let url: string = this.CONSTANTS.SERVER_URL + '/getform';
        let body: {} = {
          id: refTable,
          customercolumn: customerColumn,
          customerid: customersNumber,
          secondcolumn: secondColumn,
          secondid: secondId,
          language: localStorage.getItem(this.CONSTANTS.LS_LANGUAGE)
        };
        this.http.post(url, body)
          .toPromise()
          .then((res: any) => {
            resolve(res);
          });
      } else {
        reject(undefined);
      }
    });
  }

  /**
   * get formly form by given referral table.
   * returns form object with form fields from FORM_TEMPLATES table.
   *
   * @param refTable
   */
  getFormlyForm(refTable: string):Promise<{formTemplate: any}> {
    return new Promise((resolve, reject) => {
      if (refTable) {
        let url: string = this.CONSTANTS.SERVER_URL + '/formlyform';
        let body: {} = {refTable: refTable};
        this.http.post(url, body)
          .toPromise()
          .then((res: any) => {
            resolve(res);
          });
      } else {
        reject(undefined);
      }
    });
  }


  insertIntoTemp(idTempField: number, idTempConst: number) {
    return this.http.post(this.CONSTANTS.SERVER_URL + '/insertTemp', {
      idTempField: idTempField,
      idTempConst: idTempConst
    });
  }

  /**
   * set table data with promise
   *
   * @return {} - {success: 'Fertig'} or {error: tableName + ' method was not updated.'}
   * @param saveData
   */
  setTableData(saveData: {
    refTable: string,
    tableName: string,
    dataArray: {},
    primaryKey: string,
    primaryValue: string,
    isIdentity: boolean,
    newItemMode: boolean,
    secondaryKey: string,
    secondaryValue: any,
    thirdKey?: string,
    thirdValue?: string
  }): Promise<{result: {success: boolean, message: string, data: []}}> {
    return new Promise((resolve, reject) => {
      let url: string = (saveData.newItemMode) ? '/insert' : '/update';
      let body: {} = (saveData.newItemMode) ? {
          refTable: saveData.refTable,
          tableName: saveData.tableName,
          elementsArray: saveData.dataArray,
          pKey: saveData.primaryKey,
          isIdentity: saveData.isIdentity
        } :
        {
          refTable: saveData.refTable,
          tableName: saveData.tableName,
          elementsArray: saveData.dataArray,
          pKey: saveData.primaryKey,
          pValue: saveData.primaryValue,
          isIdentity: saveData.isIdentity, // if is identity = true, then the primaryKey will be removed from column list
          sKey: saveData.secondaryKey,
          sValue: saveData.secondaryValue,
          tKey: saveData.thirdKey,
          tValue: saveData.thirdValue
        };
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        });
    });
  }

  /**
   * Update many rows with one query
   *
   * @param refTable
   * @param dataRowsArray
   * @param primaryKey
   * @param primaryValue
   * @param newItemMode
   * @param secondaryKey
   * @param secondaryValue
   * @param thirdKey
   * @param thirdValue
   */
  setTableRowsData(refTable: string, dataRowsArray: {}, primaryKey: string, primaryValue: string,
                   newItemMode: boolean, secondaryKey: string, secondaryValue: string, thirdKey?: string,
                   thirdValue?: string): Promise<{result: any}|{error: any}> {
    return new Promise((resolve, reject) => {
      if (newItemMode) {
        reject({error: 'newItemMode true is not supported.'});
        // return this.http.post(this.CONSTANTS.SERVER_URL + '/insertRows', {
        //   tableName: refTable,
        //   elementsArray: dataRowsArray
        // });
      } else {
        let url: string = this.CONSTANTS.SERVER_URL + '/updateRows';
        let body: {} = {
          tableName: refTable,
          elementsArray: dataRowsArray,
          pKey: primaryKey,
          pValue: primaryValue,
          sKey: secondaryKey,
          sValue: secondaryValue,
          tKey: thirdKey,
          tValue: thirdValue
        };
        this.http.post(url, body)
          .toPromise()
          .then((res: any) => {
            resolve(res);
          });
      }
    });
  }

  /**
   * delete table at server:
   *
   * @param refTable
   * @param primaryKey
   * @param primaryValue
   * @param secondaryKey
   * @param secondaryValue
   * @param thirdKey optional
   * @param thirdValue optional
   * @param userRole optional
   */
  deleteTableData(refTable: string, primaryKey: string, primaryValue: string,
                  secondaryKey: string, secondaryValue: string,
                  thirdKey?: string, thirdValue?: string,
                  userRole?: string): Promise<{}> {
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/delete';
      let body: {} = {
        tableName: refTable,
        pKey: primaryKey,
        pValue: primaryValue,
        sKey: secondaryKey,
        sValue: secondaryValue,
        tKey: thirdKey,
        tValue: thirdValue,
        userRole: userRole
      };
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        });
    });
  }

  /**
   * Create delivery note manually (at orders form view, over "Create delivery note" button at the bottom)
   *
   * @param thisItem
   * @param primaryKey
   * @param primaryValue
   * @param userName
   * @param language
   * @param components - array of components with warehousing checked qty
   * @param partlyDelivery - if true, a partly delivery note should be created
   * @return { message: undefined | { errorCode: string, newDeliveryNote: string, positions: string } }
   */
  setDeliveryNote(thisItem: string, primaryKey: string, primaryValue: string, userName: string,
                  language: string, components: {}, partlyDelivery: boolean):
    Promise<{ message: { success: boolean, errorCode: string, newDeliveryNote: string, positions: string } }> {
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/createnote';
      let body: {} = {
        thisItem: thisItem,
        pKey: primaryKey,
        pValue: primaryValue,
        userName: userName,
        language: language,
        components: components,
        partlyDelivery: partlyDelivery,
      };
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        });
    });
  }

  /**
   * Create invoice note manually (at delivery notes form view, over "Create invoice" button at the bottom)
   *
   * @param data
   */
  setInvoice(data: {
               thisItem: string, primaryKey: string, primaryValue: string, secondaryKey: string,
               secondaryValue: string, userName: string, language: string, partlyDelivery: boolean
             }
  ):
    Promise<{ message: { success: boolean, errorCode: string, newInvoice: string, positions: string } }> {
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/createinvoice';
      let body: {} = {
        thisItem: data.thisItem,
        pKey: data.primaryKey,
        pValue: data.primaryValue,
        sKey: data.secondaryKey,
        sValue: data.secondaryValue,
        userName: data.userName,
        language: data.language,
        partlyDelivery: data.partlyDelivery
      };
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        });
    });
  }

  /**
   * Show pdf file to user by downloading it to "public" folder, show them in browser and delete it in "public" folder
   *
   * @param fullPath
   * @param pdfFilename
   * @param refTable
   * @param language
   */
  showPDF(fullPath: string, pdfFilename: string, refTable: string, language: string): Promise<{}> {
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/downloadpdf';
      let body: {} = {
        fullPath: fullPath,
        pdfFilename: pdfFilename,
        refTable: refTable,
        language: language
      };
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        });
    });
  }

  /**
   * Delete one lock of the user or all users table locks.
   * To delete lock of one user: set deleteAllFlag = true AND lockedBy = "AL".
   * To delete locks of all users: set deleteAllFlag = true AND lockedBy = ""
   *
   * @param deleteAllFlag if true - delete all locks; false - delete only one item
   * @param tableName optional
   * @param dataSet optional
   * @param lockedBy user login name, e.g.: "AL"
   */
  deleteTableLocks(deleteAllFlag: boolean, tableName: string, dataSet: string, lockedBy: string): Promise<{}> {
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/deleteTableLocks';
      let body: {} = {
        deleteAll: deleteAllFlag,
        tableName: tableName,
        dataSet: dataSet,
        lockedBy: lockedBy
      };
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        });
    });
  }

  /**
   * get table locks
   *
   * @param refTable
   * @param column
   * @param id
   * @private
   */
  private async getTableLocksPromise(refTable: string, column: string, id: string): Promise<{
    locked: boolean, lockedByCurrentUser: boolean, dataset?: string, username?: string, since?: string }>
  {
    if (refTable) {
      refTable = refTable.toUpperCase();
      let dbData: {} = this.getTableDataById(this.CONSTANTS.REFTABLE_TABLELOCKS, ViewQueryTypes.MAIN_TABLE,
        this.CONSTANTS.REFTABLE_TABLELOCKS_TABLE_COLUMN, refTable);
      if (!dbData) {
        return {locked: false, lockedByCurrentUser: false};
      }
      let resultFound = false;
      if (dbData['table'][1]) {
        for (let elm in dbData['table'][1]) {
          if (dbData['table'][1].hasOwnProperty(elm)) {
            if (refTable === dbData['table'][1][elm][this.CONSTANTS.REFTABLE_TABLELOCKS_TABLE_COLUMN] &&
              (parseInt(dbData['table'][1][elm][this.CONSTANTS.REFTABLE_TABLELOCKS_DATASET_COLUMN]) === parseInt(id) ||
                dbData['table'][1][elm][this.CONSTANTS.REFTABLE_TABLELOCKS_DATASET_COLUMN] === id) &&
              parseInt(dbData['table'][1][elm][this.CONSTANTS.REFTABLE_TABLELOCKS_LOCKED_COLUMN]) === 1) {
              // check if current user still locking item
              if (dbData['table'][1][elm][this.CONSTANTS.REFTABLE_TABLELOCKS_LOCKED_BY_COLUMN] !==
                localStorage.getItem(this.CONSTANTS.LS_USERNAME)) {
                return {
                  locked: true,
                  lockedByCurrentUser: false,
                  dataset: dbData['table'][1][elm]['LOCKED_DATASET'],
                  username: dbData['table'][1][elm]['LOCKED_BY'],
                  since: dbData['table'][1][elm]['LOCKED_SINCE']
                };
              } else {
                return {
                  locked: false,
                  lockedByCurrentUser: true
                };
              }
            }
          }
        }
      }
      if (!resultFound) {
        return {locked: false, lockedByCurrentUser: false};
      }
    } else {
      return {locked: false, lockedByCurrentUser: false};
    }
  }

  /**
   * set table locks
   *
   * @param columnTable
   * @param tableName
   * @param columnData
   * @param dataId
   * @private
   */
  private async setTableLocks(columnTable: string, tableName: string, columnData: string, dataId: string):
    Promise<{result: {success: boolean, message: string, data: []}}> {
    let insertMode: boolean = true;
    let dataArray = {};
    let currDate = new Date();
    dataArray['TABLENAME'] = tableName;
    dataArray['LOCKED_BY'] = localStorage.getItem(this.CONSTANTS.LS_USERNAME);
    dataArray['LOCKED_SINCE'] = new Date(Date.UTC(
      currDate.getFullYear(), currDate.getMonth(), currDate.getDate(), currDate.getHours(), currDate.getMinutes(),
      currDate.getSeconds()
    ));
    dataArray['LOCKED'] = '1';
    dataArray[columnData] = dataId;
    // returns true if dbData is defined, otherwise false
    return await this.setTableData({
      refTable: this.CONSTANTS.REFTABLE_TABLELOCKS, tableName: this.CONSTANTS.REFTABLE_TABLELOCKS_TITLE,
      dataArray: dataArray, primaryKey: columnTable, primaryValue: tableName, isIdentity: undefined,
      newItemMode: insertMode, secondaryKey: undefined, secondaryValue: undefined
    });
  }

  /**
   * remove table locks
   *
   * @param columnTable
   * @param tableName
   * @param columnData
   */
  public async removeTableLocks(columnTable: string, tableName: string, columnData: string):
    Promise<{result: {success: boolean, message: string, data: []}}> {
    let dataArray = {};
    dataArray[columnData] = null;
    dataArray['LOCKED'] = '0';
    // returns true if dbData is defined, otherwise false
    return await this.setTableData({
      refTable: this.CONSTANTS.REFTABLE_TABLELOCKS, tableName: this.CONSTANTS.REFTABLE_TABLELOCKS_TITLE,
      dataArray: dataArray, primaryKey: columnTable, primaryValue: tableName, isIdentity: undefined, newItemMode: false,
      secondaryKey: undefined, secondaryValue: undefined
    });
  }

  /**
   * should return Promise<boolean>
   *
   * @param refTableTitle
   * @param customerNumber
   * @param lockedMessage
   */
  public isTableLocked(refTableTitle: string, customerNumber: string, lockedMessage: string): Promise<boolean> {
    //ToDo: Temporarily ignoring table locks. Enable again for production mode. Check unit tests.
    return new Promise((resolve) => {
      resolve(false);
    });
    /*
    let self = this;
    // exceptions of customer number
    if (customerNumber && (customerNumber !== this.CONSTANTS.CUSTOMER_B2C_PLACEHOLDER &&
      customerNumber !== this.CONSTANTS.CUSTOMER_B2B_PLACEHOLDER &&
      customerNumber !== this.CONSTANTS.UNIVERSAL_ID_PLACEHOLDER)) {
      let gtbResult: {} = await this.getTableLocksPromise(refTableTitle,
        this.CONSTANTS.REFTABLE_TABLELOCKS_DATASET_COLUMN, customerNumber);
      if (gtbResult) {
        if (gtbResult['locked'] === false) {
          if (gtbResult['lockedByCurrentUser'] === false) {
            // lock current item
            self.setTableLocks(self.CONSTANTS.REFTABLE_TABLELOCKS_TABLE_COLUMN, refTableTitle,
              self.CONSTANTS.REFTABLE_TABLELOCKS_DATASET_COLUMN, customerNumber, function (setResult) {
                console.log('WAS NOT LOCKED => SET TO LOCKED : ' + refTableTitle + " - " + customerNumber);
                return false;
              });
          } else {
            // Another item still locked by current user ???
            // throw new Error("Another item still locked by current user ???");
            // console.log("Another item still locked by current user ???");
            console.log('STILL LOCKED (BY CURRENT USER?) : ' + refTableTitle + " - " + customerNumber);
            return false;
          }
        } else {
          if (gtbResult['lockedByCurrentUser'] === false) {
            if (gtbResult['dataset'] === customerNumber) {
              // disable save function and inform user about lock
              let description = 'Locked Message';
              lockedMessage = lockedMessage.replace('%s1', '"' + customerNumber + '"');
              lockedMessage = lockedMessage.replace('%s2', '"' + refTableTitle + '"');
              lockedMessage = lockedMessage.replace('%s3', '<br />');
              lockedMessage = lockedMessage.replace('%s4', gtbResult['username']);
              lockedMessage = lockedMessage.replace('%s5', gtbResult['since']);
              self.showInfoDialog(self, description, lockedMessage);
              console.log('LOCKED : ' + refTableTitle + " - " + customerNumber);
              return true;
            } else {
              // Table is locked, but not current customerNumber
              console.log('LOCKED, BUT NOT CURRENT NUMBER : ' + refTableTitle + " - " + customerNumber);
              return false;
            }
          } else {
            // Do nothing, because already locked by current user
            console.log('ALREADY LOCKED BY CURRENT USER : ' + refTableTitle + " - " + customerNumber);
            return false;
          }
        }
      } else {
        console.log('LOCKED : ' + refTableTitle + " - " + customerNumber + " - Table locks data not available...");
        return true;
        // throw new Error("ERROR: Table locks data not available...");
      }
    } else {
      console.log('NO LOCK, IF CUSTOMER NUMBER IS PLACEHOLDER : ' + refTableTitle + " - " + customerNumber);
      return false;
    }
    */
  }

  /**
   * returns last (inserted) id of the table (order by columnName DESC)
   *
   * @param tableName
   * @param columnName
   * @param uniqueColumnName
   * @param uniqueValue
   * @return { id: any | 0 } - 0 means no id was found
   */
  async getLastIdOfTable(tableName: string, columnName: string, uniqueColumnName?: string, uniqueValue?: string):
    Promise<{ id: any | 0 }> {
    return new Promise((resolve, reject) => {
      this.http.post(this.CONSTANTS.SERVER_URL + '/getLastTableId', {
        tableName: tableName,
        columnName: columnName,
        uniqueColumnName: uniqueColumnName,
        uniqueValue: uniqueValue
      }).toPromise()
        .then((res: any) => {
          resolve(res);
        });
    });
  }

  /**
   * copy all rows from one table into another
   *
   * @param tableName1
   * @param tableName2
   * @param columnsTo
   */
  copyRowsFromIntoTable(tableName1: string, tableName2: string, columnsTo: string) {
    console.log('copy all rows from table');
    // console.log('try to call form... ', tableName);
    return this.http.post(this.CONSTANTS.SERVER_URL + '/copyRowsIntoTable', {
      tableName1: tableName1,
      tableName2: tableName2,
      columnsTo: columnsTo
    });
  }


  /**
   * returns last (inserted) column value from  the table
   *

   * @param tableName
   * @param columnName
   * @param uniqueColumnName
   * @param uniqueValue
   */
  async getLastColumnValue(tableName: string, columnName: string, uniqueColumnName?: string, uniqueValue?: string):
    Promise<{}> {
    return this.http.post(this.CONSTANTS.SERVER_URL + '/getLastColumnValue', {
      tableName: tableName,
      columnName: columnName,
      uniqueColumnName: uniqueColumnName,
      uniqueValue: uniqueValue
    }).toPromise();
  }


  /**
   * update column value from  the table
   *

   * @param tableName
   * @param columnName
   * @param uniqueValue
   * @param whereColumnValue
   */
  async updateColumn(tableName: string, columnName: string, whereColumnValue: string, uniqueValue?: string):
    Promise<{}> {
    return this.http.post(this.CONSTANTS.SERVER_URL + '/updateColumn', {
      tableName: tableName,
      columnName: columnName,
      whereColumnValue: whereColumnValue,
      uniqueValue: uniqueValue,
    }).toPromise();
  }




  /*getImportTypeConstants(): Observable<Array<{id: number, label: string}> | false>{
    return this.http.post<Array<{id: number, label: string}> | false>(
      this.CONSTANTS.SERVER_URL + '/getImportTypesConstants',
      {},
      {...this.getHeaders()}

    )
  }*/


  /**
   * delete all rows from table
   *
   * @param tableName
   * @param columnsTo
   */
  deleteAllRowsTable(tableName: string, columnsTo: string) {
    console.log('table ' + tableName );
    // console.log('try to call form... ', tableName);
    return this.http.post(this.CONSTANTS.SERVER_URL + '/deleteAllRows', {
      tableName: tableName,
      columnsTo: columnsTo
    });
  }

  /**
   * remove table locks for all users or only for current logged in user
   *
   * @param allFlag - if true, all users locks will be removed; otherwise just for logged in user
   * @param tableName
   * @param dataSet
   */
  public async removeAllTableLocks(allFlag: boolean, tableName: string, dataSet: string): Promise<{}> {
    let lockedBy: string = localStorage.getItem(this.CONSTANTS.LS_USERNAME);
    // returns true if dbData is defined, otherwise false
    return await this.deleteTableLocks(allFlag, tableName, dataSet, lockedBy);
  }

  public handleHttpError(err: HttpErrorResponse) {
    if (err.error instanceof Error) {
      console.log('Client-side error occurred.');
    } else {
      console.log('Server-side error occurred.');
    }
    console.log('error', err);
    if (err.status === 401) {
      // logout user, because unauthorized
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
        this.router.navigate(['/logout']));
    }
  }

  /**
   * open new window
   *
   * @param $event
   * @param refTable
   */
  openNewWindow($event: MouseEvent, refTable: string) {
    $event.preventDefault();
    $event.stopPropagation();
    // this.autocompleteService.redirectTo('//showNewWindow');
    // create an external window
    let newWindow: Window = window.open(
      this.CONSTANTS.SERVER_URL + '/#/' + refTable,
      '',
      'location=yes,width=800,height=600,left=200,top=200,scrollbars=yes,status=no,menubar=no,toolbar=no,titlebar=no'
    );
    // newWindow.location.assign('custbtwoc');
    // newWindow.window.document.location.assign('custbtwoc');
  }

  /**
   * try to allocate positions for given orders number and warehouse
   *
   * @param type - CHECK or SET
   * @param data
   */
  tryAllocate(type: string, data: {}): Promise<{ success: boolean, message: any, data: any }> {
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/allocate';
      let body: {} = {
        type: type,
        data: data
      };
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        });
    });
  }

  /**
   * run test function on server
   */
  runTestFunction():
    Promise<{ result: boolean }> {
    let url: string = this.CONSTANTS.SERVER_URL + '/test';
    let body: {} = {};
    return this.http.post(url, body)
      // .pipe(timeout(3000)) // set timeout for request
      .toPromise().then((res: any) => {
        return res;
      });
  }

  // TODO: we should remove all the above when we finish refactoring!
  // TODO put modelName as enumeration
  // TODO need a better solution for modelOptions, a string is not valid by default (enumeration possibly?)
  /**
   * default GET model endpoint for all components
   *
   * @param params
   */
  getModelEndpoint(params: {
    modelName: string,
    modelOptions?: SequelizeModelOption[], // additional model options, that should be loaded together with the model
    primaryKey?: string,
    query?: {
      page?: number,   // actual page
      offset?: number, // offset to query next rows: a calculation of (page * size)
      size?: number,   // number of items per page to be shown
      sort?: {         // sort direction asc/desc
        column: string,
        direction: string
      },
      searchColumn?: string,
      searchText?: string,
      // exact search will be for searching more columns with different values
      exactSearchColumn?: string // ID,NAME
      exactSearchText?: string // 201,John
    }
  }): Promise<{table: [string, SoasModel[] ], maxRows: number, page: number}> {

    if (!params.modelName) {
      throw new Error('modelName is not set!');
    } else params.modelName = params.modelName.toLowerCase(); // make modelName lower case if it exists

    let url = this.CONSTANTS.SERVER_URL + '/models/' + params.modelName;

    let queryParams = new HttpParams();
    queryParams = params?.primaryKey ? queryParams.append('pk', params.primaryKey) : queryParams;
    queryParams = params?.modelOptions ?
      queryParams.append('modelOptions', JSON.stringify(params.modelOptions)) : queryParams;

    if (params.query?.searchText && params.query?.searchColumn) {
      queryParams = queryParams.append('searchColumn', params.query.searchColumn);
      queryParams = queryParams.append('searchText', params.query.searchText);
    }

    if (params.query?.exactSearchText && params.query?.exactSearchColumn) {
      queryParams = queryParams.append('exactSearchColumn', params.query.exactSearchColumn);
      queryParams = queryParams.append('exactSearchText', params.query.exactSearchText);
    }

    queryParams = params.query?.page || params.query?.page === 0 ?
      queryParams.append('page', params.query.page.toString()) : queryParams;
    queryParams = params.query?.size ?
      queryParams.append('size', params.query.size.toString()) : queryParams;
    queryParams = params.query?.sort?.column ?
      queryParams.append('sortColumn', params.query.sort.column.toString()) : queryParams;
    queryParams = params.query?.sort?.direction ?
      queryParams.append('sortDirection', params.query.sort.direction.toString()) : queryParams;

    return this.http.get<{table: [string, SoasModel[] ], maxRows: number, page: number}>(url, {params: queryParams})
      .toPromise()
      .then((res) => {
        return res;
      });
  }

  /**
   * default POST model endpoint for inserting models
   *
   * @param params
   */
  postModelEndpoint(params: {
    modelName: string
    data: string
    insertTogetherData?: string
  }): Promise<SoasModel> {

    const url = this.CONSTANTS.SERVER_URL + '/models/' + params.modelName;
    return this.http.post<SoasModel>(
      url,
      {
        data: params.data,
        insertTogetherData:  params.insertTogetherData
      }
    )
      .toPromise()
      .then(res => {
        return res;
      })
  }

  /**
   * default PUT model endpoint for updating models
   *
   * @param params
   */
  putModelEndpoint(params: {
    modelName: string
    primaryKey: string
    data: string
  }) {
    const url = this.CONSTANTS.SERVER_URL + '/models/' + params.modelName;
    console.log('asaasas' + url);
    return this.http.put(
      url,
      {pk: params.primaryKey, data: params.data}
    )
      .toPromise()
      .then(res => {
        return res;
      })
  }

  /**
   * simulate client error
   */
  clientError() {
    throw Error('The app component has thrown an error!');
  }

  /**
   * simulate server error
   */
  failingRequest() {
    this.http.get('https://httpstat.us/404?sleep=2000').toPromise();
  }

  /**
   * simulate server success
   */
  successfulRequest() {
    this.http.get('https://httpstat.us/200?sleep=2000').toPromise();
  }
}
