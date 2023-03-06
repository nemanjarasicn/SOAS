import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConstantsService} from "./constants.service";

@Injectable({
  providedIn: 'root'
})

/**
 * ToDo: check if this service still needed
 */
export class AppHttpService {

  constructor(private http: HttpClient,
              private CONSTANTS: ConstantsService) {}

  getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem(this.CONSTANTS.LS_ACCESS_TOKEN)
    });
  }

  get(url: string) {
    return this.http.get(url, {
      headers: this.getHeaders()
    });
  }

  post<T>(url: string, data: any) {
    return this.http.post(url, data, {
      headers: this.getHeaders()
    });
  }
}
