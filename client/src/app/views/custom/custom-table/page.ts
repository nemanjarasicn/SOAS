import { Observable } from 'rxjs';
import {SortDirection} from "@angular/material/sort";

/**
 * Define a few reusable data types for paginated data. Used for PaginationDataSource.
 * The generic parameter T references the data type that we want to represent (e.g. Article).
 */

/**
 * Sorting
 */
export interface Sort<T> {
  property: string;
  order: SortDirection
}

/**
 * PageRequest we pass on to a service, which then fetches the corresponding page from the server via HTTP.
 * In response, we expect a Page <T> with the requested data.
 */
export interface PageRequest<T> {
  page?: number;
  offset?: number; // 0
  size?: number;  // 14
  sort?: Sort<T>;
}

/**
 * Page data
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  size: number;
  number: number;
}

/**
 * Accepts a PageRequest <T> and returns an RxJS stream, i.e. an observable, with the corresponding Page <T>.
 */
export type PaginatedEndpoint<T, Q> = (req: PageRequest<T>, query: Q) => Observable<Page<T>>
