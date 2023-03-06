import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstantsService} from "./constants.service";

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  tableName = "batches";

  constructor(private http: HttpClient,
              private CONSTANTS: ConstantsService) {
  }

  getBatches(): Promise<any> {
    // Workaround to receive all users - showOnPageMax must be min number of users
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/selectBatchProcesses';
      let body: {} = {showOnPageMax: this.CONSTANTS.SHOW_ON_PAGE_MAX, showTable: '0'};
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  deleteBatch(batch): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/deleteBatch';
      let body: {} = batch;
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  insertBatch(batch): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/insertBatch';
      let body: {} = batch;
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  updateBatch(batch): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/updateBatch';
      let body: {} = batch;
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }


}
