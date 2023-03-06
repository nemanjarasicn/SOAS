import {TestBed} from "@angular/core/testing";
import {TestingModule} from "../../../testing/testing.module";
import {ArticleQuery, PageService} from "./page.service";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Page, PageRequest, Sort} from "./page";
import {ConstantsService, SoasModel, ViewQueryTypes} from "../../../_services/constants.service";
import {ArticlesTestConstants} from "../../../../assets/test-constants/articles";
import {Article} from "../../../models/article";
import {SearchTestConstants} from "../../../../assets/test-constants/search";

describe('PageService', () => {
  let service: PageService;
  let httpClient: HttpClient;
  let constantsService: ConstantsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, HttpClientTestingModule],
      providers: [ConstantsService]
    });
    service = TestBed.inject(PageService);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    constantsService = TestBed.inject(ConstantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return page data for empty search query', () => {

    // Arrange
    const request: PageRequest<SoasModel> = {
      page: 0,
      offset: 0,
      size: 14,
      sort: undefined
    };
    const query: ArticleQuery = {
      search: '',
      registration: new Date
    };
    const refTable: string = constantsService.REFTABLE_ARTICLES;
    const primaryColumn: string = constantsService.REFTABLE_ARTICLES_COLUMN;
    const primaryValue: string = ArticlesTestConstants.ARTICLES_ITEM.ITMNUM;
    const secondaryColumn: string = constantsService.REFTABLE_ARTICLES_SECONDARY_COLUMN;
    const secondaryValue: string = ArticlesTestConstants.ARTICLES_ITEM.ID.toString();
    const searchColumn: string = constantsService.REFTABLE_ARTICLES_COLUMN;
    const additionalSearchColumns: string = constantsService.REFTABLE_ARTICLES_SECONDARY_COLUMN;
    const viewQueryType: ViewQueryTypes = ViewQueryTypes.DETAIL_TABLE;
    const expectedPageResult: Page<SoasModel | any> = {
      content: ArticlesTestConstants.ARTICLES_TABLE_DB_DATA['table'][1],
      number: ArticlesTestConstants.ARTICLES_TABLE_DB_DATA['page'],
      size: request.size,
      totalElements: ArticlesTestConstants.ARTICLES_TABLE_DB_DATA['maxRows']
    };
    const expectedResult = {
      id: 'articles',
      viewQueryType: 'DETAIL_TABLE',
      customerColumn: 'ITMNUM',
      customerId: 'MARS600SET000104DE',
      secondId: '1471',
      offsetRowCount: 0,
      fetchRowCount: 14,
      secondColumn: 'ID',
      page: 0,
      orderByColumn: 'ITMNUM',
      orderByDirection: 'ASC'
    };

    // Act
    service.page(request, query, refTable, primaryColumn, primaryValue, secondaryColumn, secondaryValue,
      searchColumn, additionalSearchColumns, viewQueryType).subscribe(result => {

      // Assert
      expect(result).toBeTruthy();
      expect(result).toEqual(expectedPageResult);
    });

    // page() should have made one request to POST table
    const req = httpMock.expectOne(constantsService.SERVER_URL + '/table');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(expectedResult);

    // Expect server to return the user after POST
    const expectedResponse = new HttpResponse(
      {status: 201, statusText: 'Created', body: ArticlesTestConstants.ARTICLES_TABLE_DB_DATA}
    );
    req.event(expectedResponse);

  });

  it('should return page data for search query = "MARS600SET"', () => {

    // Arrange
    const sort: Sort<Article> = {property: 'ITMNUM', order: 'asc'};
    const request: PageRequest<SoasModel> = {
      page: 0,
      offset: 0,
      size: 3,
      sort: sort
    };
    const query: ArticleQuery = {
      search: 'MARS600SET',
      registration: new Date
    };
    const refTable: string = constantsService.REFTABLE_ARTICLES;
    const primaryColumn: string = constantsService.REFTABLE_ARTICLES_COLUMN;
    const primaryValue: string = ArticlesTestConstants.ARTICLES_ITEM.ITMNUM;
    const secondaryColumn: string = constantsService.REFTABLE_ARTICLES_SECONDARY_COLUMN;
    const secondaryValue: string = ArticlesTestConstants.ARTICLES_ITEM.ID.toString();
    const searchColumn: string = constantsService.REFTABLE_ARTICLES_COLUMN;
    const additionalSearchColumns: string = constantsService.REFTABLE_ARTICLES_SECONDARY_COLUMN;
    const viewQueryType: ViewQueryTypes = ViewQueryTypes.DETAIL_TABLE;
    const expectedPageResult: Page<SoasModel | any> = {
      content: SearchTestConstants.ARTICLES,
      number: ArticlesTestConstants.ARTICLES_TABLE_DB_DATA['page'],
      size: SearchTestConstants.ARTICLES.length,
      totalElements: SearchTestConstants.ARTICLES.length
    };
    const expectedResult = {
      refTable: 'articles',
      primaryColumn: 'ITMNUM',
      primaryValue: 'MARS600SET000104DE',
      secondColumn: 'ID',
      secondValue: '1471',
      searchColumn: 'ITMNUM',
      searchText: 'MARS600SET',
      searchWithLike: true,
      additionalColumns: 'ID',
      offsetNumber: undefined,
      fetchNumber: undefined,
      showAllFlag: false,
      page: 0,
      orderByColumn: 'ITMNUM',
      orderByDirection: 'ASC'
    };

    // Act
    service.page(request, query, refTable, primaryColumn, primaryValue, secondaryColumn, secondaryValue,
      searchColumn, additionalSearchColumns, viewQueryType).subscribe((result) => {

      // Assert
      expect(result).toBeTruthy();
      expect(result).toEqual(expectedPageResult);
    });

    // page() should have made one request to POST search
    const req = httpMock.expectOne(constantsService.SERVER_URL + '/search');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(expectedResult);

    // Expect server to return the user after POST
    const expectedResponse = new HttpResponse(
      {status: 201, statusText: 'Created', body: SearchTestConstants.ARTICLES}
    );
    req.event(expectedResponse);

  });
})
