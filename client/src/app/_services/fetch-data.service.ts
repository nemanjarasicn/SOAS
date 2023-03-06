import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {SoasModel} from "./constants.service";

@Injectable({
  providedIn: 'root'
})

/**
 * A service to fetch data between components.
 * custom-table component notify via this service other components (like price-list-sales or orders),
 * that have a subscription for this service, that data has changed and updates components table or detail view.
 */
export class FetchDataService {

  dataObs$ = new BehaviorSubject<{ selTableRow: SoasModel, selTableIndex: number, refTableName: string }>(null);

  constructor() {}

  /**
   * get fetch data observable
   */
  getDataObs(): Observable<{ selTableRow: SoasModel, selTableIndex: number, refTableName: string }> {
    return this.dataObs$.asObservable();
  }

  /**
   * set fetch data observable
   *
   * @param selTableRow
   * @param selTableIndex
   * @param refTableName
   */
  setDataObs(selTableRow: SoasModel, selTableIndex: number, refTableName?: string): void {
    this.dataObs$.next({selTableRow, selTableIndex, refTableName});
  }
}
