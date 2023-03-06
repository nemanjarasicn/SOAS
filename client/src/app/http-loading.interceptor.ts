import {
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {environment} from "../environments/environment";

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {
  env = environment;

  constructor() {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.env.isloadingdata = true
    return next.handle(request).pipe(
      finalize(() => {
        this.env.isloadingdata = false
      })
    ) as Observable<HttpEvent<any>>;
  }
}
