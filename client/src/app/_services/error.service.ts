import {Injectable} from '@angular/core';

import {HttpErrorResponse} from '@angular/common/http';


@Injectable({

  providedIn: 'root'

})
/**
 * ErrorService - logic for parsing error messages and stack traces from the server and client.
 */
export class ErrorService {

  constructor() {
  }

  getClientErrorMessage(error: Error): string {
    return error && error?.message ? error.message : error ? error.toString() : undefined;
  }

  getClientErrorData(error: Error): any {
    return error && error?.stack ? error.stack : undefined;
  }

  getClientErrorStackTrace(error: Error): string {
    return error.stack;
  }

  getClientErrorStatus(error: Error): number {
    // ToDo: handle status
    return 400;
  }

  getClientErrorStatusText(error: Error): string {
    // ToDo: handle status text
    return error.message;
  }

  getServerErrorMessage(error: HttpErrorResponse): string {
    return navigator.onLine ? error.message : 'No Internet Connection';
  }

  getServerErrorDescription(error: HttpErrorResponse): string {
    return (error?.error?.data && error?.error?.data[0].message) ? error.error.data[0].message : '';
  }

  getServerErrorStackTrace(error: HttpErrorResponse): string {
    // ToDo: handle stack trace
    return 'stack';
  }

  getServerErrorStatus(error: HttpErrorResponse): number {
    return error?.status
  }

  getServerErrorStatusText(error: HttpErrorResponse): string {
    return error?.statusText
  }
}
