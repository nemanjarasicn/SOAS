import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, startWith, map, share } from 'rxjs/operators';
import { indicate } from './operators';
import { Page, Sort, PaginatedEndpoint } from './page';
import {Injectable} from '@angular/core';

/**
 * Implement Pagination
 */

export interface SimpleDataSource<T> extends DataSource<T> {
  connect(): Observable<T[]>;
  disconnect(): void;
}

@Injectable({
  providedIn: 'root'
})
export class PaginatedDataSource<T, Q> implements SimpleDataSource<T> {
  private pageNumber = new Subject<number>(); // RxJS-Subject
  private sort: BehaviorSubject<Sort<T>>;
  private query: BehaviorSubject<Q>;
  private loading = new Subject<boolean>();

  public loading$ = this.loading.asObservable();
  public page$: Observable<Page<T>>; // Pages stream

  /**
   * Parameters:
   * 1. a paginated endpoint that we use to fetch pages
   * 2. an initial sort
   * 3. an optional page size, set to 20 items per page by default
   * 4. additional page size param
   * @param endpoint
   * @param initialSort
   * @param initialQuery
   * @param pageSize - number of items per page
   * @param startPage - page number from where to start
   */
  constructor(
    private endpoint: PaginatedEndpoint<T, Q>,
    initialSort: Sort<T>,
    initialQuery: Q,
    public pageSize = 14,
    public startPage = 0) {
      this.query = new BehaviorSubject<Q>(initialQuery)
      this.sort = new BehaviorSubject<Sort<T>>(initialSort)
      const param$ = combineLatest([this.query, this.sort]);
      this.page$ = param$.pipe(
        switchMap(([query, sort]) => this.pageNumber.pipe(
          startWith(startPage),
          switchMap(page => this.endpoint({page, sort, size: this.pageSize, offset: (page*this.pageSize)}, query)
            .pipe(indicate(this.loading))
          )
        )),
        share()
      )
  }

  sortBy(sort: Partial<Sort<T>>): void {
    const lastSort = this.sort.getValue();
    const nextSort = {...lastSort, ...sort};
    this.sort.next(nextSort);
  }

  queryBy(query: Partial<Q>): void {
    const lastQuery = this.query.getValue();
    const nextQuery = {...lastQuery, ...query};
    this.query.next(nextQuery);
  }

  /**
   * Tell the DataSource which page should be requested next.
   * @param page
   */
  fetch(page: number): void {
    this.pageNumber.next(page);
  }

  connect(): Observable<T[]> {
    return this.page$.pipe(map(page => page.content));
  }

  disconnect(): void {}

  /**
   * set start page
   *
   * @param page
   */
  // setStartPage(page: number) {
  //   this.startPage = page;
  //   startWith(this.startPage);
  // }

}
