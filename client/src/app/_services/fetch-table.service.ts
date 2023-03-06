import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FetchTableService {

  dataObs$: BehaviorSubject<{
    refTableName: string, fieldName: string, disableSaveButton: boolean, positions: string[], refreshDetailView: boolean
  }> = new BehaviorSubject(null);

  constructor() {
  }

  /**
   * get fetch data observable
   */
  getDataObs(): Observable<{
    refTableName: string, fieldName: string, disableSaveButton: boolean, positions: string[], refreshDetailView: boolean
  }> {
    return this.dataObs$.asObservable();
  }

  /**
   * set fetch data observable
   *
   * @param refTableName - referral table name as string
   * @param fieldName - currently edited field name: ITMNUM or tag id
   * @param disableSaveButton - boolean flag if save button should be disabled (true - disabled; false - enabled);
   * @param positions - array with strings of updated table positions: ["id_79_td_1_2","id_80_td_1_2"]
   * @param refreshDetailView - boolean flag to refresh detail view (true - refresh view; false - not refresh view)
   */
  setDataObs(refTableName: string, fieldName: string, disableSaveButton: boolean, positions: string[],
             refreshDetailView: boolean): void {
    this.dataObs$.next({refTableName, fieldName, disableSaveButton, positions, refreshDetailView});
  }

  resetDataObs() {
    this.dataObs$ = new BehaviorSubject(null);
  }
}
