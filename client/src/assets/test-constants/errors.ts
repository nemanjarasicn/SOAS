import {HttpErrorResponse} from "@angular/common/http";
/**
 * errors constants for unit tests
 */
export class ErrorsTestConstants {

  public static HTTP_ERROR = new HttpErrorResponse({
    error: {code: `some code`, message: `some message.`},
    status: 400,
    statusText: 'Bad Request',
  });

  public static HTTP_ERROR_401 = new HttpErrorResponse({
    error: {code: `some code`, message: `some message.`},
    status: 401,
    statusText: 'Unauthorized',
  });

  public static ERROR = new HttpErrorResponse({
    error: new Error('some message'),
    status: undefined,
    statusText: '',
  });
}
