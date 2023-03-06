import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstantsService} from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  tableName: string = this.CONSTANTS.REFTABLE_USERS;

  constructor(private http: HttpClient,
              private CONSTANTS: ConstantsService) {
  }

  /**
   * get all users
   */
  getUsers(): Promise<any> {
    // get all users - showOnPageMax must be max number of users
    enum orderConditionTypes {
      USER_SOAS_ID = 'USER_SOAS_ID' as any,
      USER_SOAS_NAME = 'USER_SOAS_NAME' as any,
      USER_SOAS_LOGIN = 'USER_SOAS_LOGIN' as any,
    }
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/selectUser';
      let body: {} = {showOnPageMax: this.CONSTANTS.SHOW_ON_PAGE_MAX,
        orderCondition: orderConditionTypes['USER_SOAS_ID']};
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  /**
   * delete user
   *
   * @param userId
   */
  deleteUser(userId: number): Promise<any> {
    //let userId = user.id;
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/deleteUser';
      let body: {} = userId;
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  /**
   * insert user
   *
   * @param user
   */
  insertUser(user): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/insertUser';
      let body: {} = user;
      this.http.post(url, body)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  /**
   * update user
   *
   * @param user
   */
  updateUser(user): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.CONSTANTS.SERVER_URL + '/updateUser';
      let body: {} = user;
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
