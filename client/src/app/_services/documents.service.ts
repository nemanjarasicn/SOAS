import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {ConstantsService} from "./constants.service";

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private CONSTANTS: ConstantsService,
  ) { }

  generateDocument(documentNumber: string): Promise<{docUri: string}>{
    const url = this.CONSTANTS.SERVER_URL + '/documents/generate';
    let queryParams = new HttpParams();
    queryParams = queryParams.append('documentNumber', documentNumber);

    return this.http.get<{docUri: string}>(url, {params: queryParams})
      .toPromise()
      .then(res => {
        return res;
      });
  }
}
