import {ErrorHandler, Injectable, Injector, NgZone} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {LoggingService} from './_services/logging.service';
import {ErrorService} from './_services/error.service';
import {MessagesService} from "./_services/messages.service";
import {TranslateItPipe} from "./shared/pipes/translate-it.pipe";
import {ErrorDialogComponent} from './dialogs/error-dialog/error-dialog.component';
import {MatDialog} from '@angular/material/dialog';

/**
 * clients global error handler to processes all errors
 * differentiate, if it is a server or client error type.
 * depends on type show error message in form of p-toast and MatSnackBar.
 * allows to log the error via server route (not implemented yet)
 */

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  private opened = false;

  constructor(private injector: Injector,
              private messagesService: MessagesService,
              public translatePipe: TranslateItPipe,
              private zone: NgZone,
              private dialog: MatDialog) {
    this.messagesService.setTranslatePipe(translatePipe);
  }

  handleError(error: Error | HttpErrorResponse) {

    // Check if it's an error from an HTTP response
    // @ts-ignore
    if (!(error instanceof HttpErrorResponse) && error.promise && error.rejection) {
      // @ts-ignore
      error = error.rejection; // get the error object
    }

    const errorService = this.injector.get(ErrorService);
    const logger = this.injector.get(LoggingService);

    let message: string;
    let stackTrace: string;
    let status: number;
    let statusText: string;
    let description: string;

    if (error instanceof HttpErrorResponse) {
      // Server error - should by type of HttpErrorResponse
      console.log('Server error...');
      message = 'Server error: ' + errorService.getServerErrorMessage(error);
      description = errorService.getServerErrorDescription(error);
      stackTrace = errorService.getServerErrorStackTrace(error);
      status = errorService.getServerErrorStatus(error);
      statusText = errorService.getServerErrorStatusText(error);
    } else {
      // Client Error - should by type of Error with 2 properties: message and stack
      console.log('Client error... ');
      message = 'Client error: ' + errorService.getClientErrorMessage(error);
      stackTrace = errorService.getClientErrorStackTrace(error);
      status = errorService.getClientErrorStatus(error);
      statusText = errorService.getClientErrorStatusText(error);
    }

    // show error as p-toast
    this.messagesService.showErrorMessage((description ? 'Description: ' + description + ' - ' : '') + message);

    this.openDialog(message, status, statusText, description);

    // Always log errors
    logger.logError(message, stackTrace);
  }

  private openDialog(message: string, status: number, statusText: string, description: string) {
    if (!this.opened) {
      this.opened = true;

      this.zone.run(() => {

        const dialogRef = this.dialog.open(ErrorDialogComponent, {
          data: {message, status, statusText, description},
          maxHeight: '100%',
          width: '540px',
          maxWidth: '100%',
          disableClose: true,
          hasBackdrop: true,
        });

        dialogRef.afterClosed().subscribe(() => {
          this.opened = false;
        });
      });

    }
  }
}
