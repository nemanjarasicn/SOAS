import {Injectable} from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

/**
 * server success interceptor
 * intercept the successful server body response and modify it by wrapping out the data from the uniform response model
 * ({ status: 200, error: false, message: 'OK', data: [{"table": [...], }]} ),
 * so the client logic can work like before (without modifications)
 */

@Injectable()
export class ServerSuccessInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        event = event.clone({body: this.modifyBody(event.body)});
      }
      return event;
    }));
  }

  private modifyBody(body: { "status": number, "error": boolean, "message": string, "data": [any] }): any {
    /*
     * logic to modify the server body
     */
    return body && body.data ? body.data[0] : body;
  }
}
