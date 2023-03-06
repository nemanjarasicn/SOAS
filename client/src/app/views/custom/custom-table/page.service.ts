import {Page, PageRequest} from './page';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ConstantsService, modelNames, SoasModel, ViewQueryTypes} from '../../../_services/constants.service';
import {HttpClient} from '@angular/common/http';
import {TableDataService} from "../../../_services/table-data.service";


export interface ArticleQuery {
  search: string;
  registration: Date;
}

@Injectable({providedIn: 'root'})
export class PageService {

  constructor(private http: HttpClient, private CONSTANTS: ConstantsService,
              private tableDataService: TableDataService) {}

  /**
   * @deprecated, switch to fetchData
   */
  fetchData_OLD(params: {
    request?: PageRequest<SoasModel>,
    query?: ArticleQuery,
    refTable: string,
    primaryColumn?: string,
    primaryValue?: string,
    secondaryColumn?: string,
    secondaryValue?: string,
    searchColumn?: string,
    referenceColumnValue?: string | number
    additionalSearchColumns?: string,
    viewQueryType: ViewQueryTypes
  }): Promise<
    { table: [string, SoasModel[]], maxRows: number, page: number } |
    SoasModel[]
    >{
    let orderByColumnName: string = params?.request?.sort && params?.request?.sort.property ? params?.request?.sort.property : params.primaryColumn;
    let orderByDirection: string = params?.request?.sort && params?.request?.sort.order ? params?.request?.sort.order.toUpperCase() : 'ASC';
    if (!params?.query?.search) {
      let result = this.http.post<{ table: [string, SoasModel[]], maxRows: number, page: number }>(
        this.CONSTANTS.SERVER_URL + '/table',
        {
          id: params.refTable,
          viewQueryType: params.viewQueryType,
          customerColumn: params.primaryColumn,
          customerId: params?.referenceColumnValue,
          secondColumn: params?.secondaryColumn,
          secondId: params?.secondaryValue,
          offsetRowCount: params?.request?.offset,
          fetchRowCount: params?.request?.size,
          page: params?.request?.page,
          orderByColumn: orderByColumnName,
          orderByDirection: orderByDirection
        }
      ).toPromise();

      console.log('result::: ', result);
      return result;
    } else {
      let result = this.http.post<{ table: [string, SoasModel[]], maxRows: number, page: number }>(
        this.CONSTANTS.SERVER_URL + '/search',
        {
          refTable: params.refTable,
          primaryColumn: params.primaryColumn,
          primaryValue: "",
          secondColumn: params.secondaryColumn,
          secondValue: params.secondaryValue,
          searchColumn: params.searchColumn,
          searchText: params.query.search,
          searchWithLike: true,
          additionalColumns: params.additionalSearchColumns,
          offsetNumber: params?.request?.offset,
          fetchNumber: params?.request?.size,
          showAllFlag: false,
          page: params?.request?.page,
          orderByColumn: orderByColumnName,
          orderByDirection: orderByDirection
        }
      ).toPromise();

      console.log('result::: ', result);
      return result;
    }
  }



  /**
   * page service with http posts for loading table data or search results
   *
   * @param request
   * @param query
   * @param refTable
   * @param primaryColumn
   * @param primaryValue
   * @param secondaryColumn
   * @param secondaryValue
   * @param searchColumn
   * @param additionalSearchColumns
   * @param viewQueryType => view query type: MAIN_TABLE show main table data (on left side)
   *                                          DETAIL_TABLE show detail table (on right side)
   * @return Page<SoasModel|any> - any, because search query returns not all model fields
   */
  public page(
    request: PageRequest<SoasModel>,
    query: ArticleQuery,
    refTable: string,
    primaryColumn: string,
    primaryValue: string,
    secondaryColumn: string,
    secondaryValue: string,
    searchColumn: string,
    additionalSearchColumns: string,
    viewQueryType: ViewQueryTypes
  ):
    Observable<Page<SoasModel | any>> {
    let filteredPageData: any;
    let orderByColumnName: string = request.sort && request.sort.property ? request.sort.property : primaryColumn;
    let orderByDirection: string = request.sort && request.sort.order ? request.sort.order.toUpperCase() : 'ASC';
    if (query.search === '') {
      return this.http.post(this.CONSTANTS.SERVER_URL + '/table', {
        id: refTable,
        viewQueryType: viewQueryType,
        customerColumn: primaryColumn,
        customerId: primaryValue,
        secondColumn: secondaryColumn,
        secondId: secondaryValue,
        offsetRowCount: request.offset,
        fetchRowCount: request.size,
        page: request.page,
        orderByColumn: orderByColumnName,
        orderByDirection: orderByDirection
      }).pipe(
        map((result) => { // result: { table: [any[string], any[]], maxRows: number, page: number }
          filteredPageData = result['table'][1];
          const pageData = filteredPageData;
          return {
            content: pageData,
            number: result['page'],
            size: request.size,
            totalElements: result['maxRows']
          }; // of(page).pipe(delay(500));
        })
      );
    } else {
      if (request.sort && request.sort.property && request.sort.property !== '') {
        searchColumn = request.sort.property;
      }
      return this.http.post(this.CONSTANTS.SERVER_URL + '/search', {
        refTable: refTable,
        primaryColumn: primaryColumn,
        primaryValue: primaryValue,
        secondColumn: secondaryColumn,
        secondValue: secondaryValue,
        searchColumn: searchColumn,
        searchText: query.search,
        searchWithLike: true,
        additionalColumns: additionalSearchColumns,
        offsetNumber: undefined, //request.page,
        fetchNumber: undefined, // request.size
        showAllFlag: false,
        page: request.page,
        orderByColumn: orderByColumnName,
        orderByDirection: orderByDirection
      }).pipe(
        map((result) => { // result: any[]
          console.log(result);
          filteredPageData = result;
          const start = request.page * request.size;
          const end = start + request.size;
          const pageArticles = filteredPageData.slice(start, end);
          return {
            content: pageArticles,
            number: request.page,
            size: pageArticles.length,
            totalElements: filteredPageData.length
          };
        })
      );
    }
  }
}
