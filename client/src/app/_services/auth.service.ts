import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import * as forge from "node-forge";
import {HttpClient} from "@angular/common/http";
import {ConstantsService} from "./constants.service";

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient,
              private CONSTANTS: ConstantsService) {
  }

  /**
   * login
   *
   * @param us
   * @param pa
   */
  login(us: string, pa: string): Observable<boolean> {
    let md = forge.md.sha256.create();
    md.update(pa.toString());
    return this.http.post<{ token: string, localize: object, language: string, username: string, role: string }>
    ('auth', {us: us, pa: md.digest().toHex()}) // '/api/auth'
      .pipe(
        map(result => {
          localStorage.setItem(this.CONSTANTS.LS_ACCESS_TOKEN, result.token);
          localStorage.setItem(this.CONSTANTS.LS_LOCALIZE, JSON.stringify(result.localize));
          localStorage.setItem(this.CONSTANTS.LS_LANGUAGE, result.language);
          localStorage.setItem(this.CONSTANTS.LS_USERNAME, result.username);
          localStorage.setItem(this.CONSTANTS.LS_ROLE, result.role);
          return true;
        })
      );
  }

  /**
   * logout - empty settings in local storage
   */
  logout() {
    localStorage.removeItem(this.CONSTANTS.LS_ACCESS_TOKEN);
    localStorage.removeItem(this.CONSTANTS.LS_LOCALIZE);
    localStorage.removeItem(this.CONSTANTS.LS_LANGUAGE);
    localStorage.removeItem(this.CONSTANTS.LS_USERNAME);
    localStorage.removeItem(this.CONSTANTS.LS_ROLE);
    localStorage.removeItem(this.CONSTANTS.LS_SEL_CUSTOMERS_NUMBER);
    localStorage.removeItem(this.CONSTANTS.LS_SEL_CUSTOMER_ADDRESSES_DLV_ID);
    localStorage.removeItem(this.CONSTANTS.LS_SEL_CUSTOMER_ADDRESSES_INV_ID);
    localStorage.removeItem(this.CONSTANTS.LS_SEL_PARTNER_ADDRESSES_DLV_ID);
    localStorage.removeItem(this.CONSTANTS.LS_SEL_PARTNER_ADDRESSES_INV_ID);
  }

  /**
   * check if user is logged in
   */
  public get loggedIn(): boolean {
    return (localStorage.getItem(this.CONSTANTS.LS_ACCESS_TOKEN) !== null);
  }

}
