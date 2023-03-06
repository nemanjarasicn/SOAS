import {Injectable, NgZone} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {InfoDialogComponent} from "../dialogs/info-dialog/info-dialog.component";
import {ConstantsService} from "./constants.service";
import {TranslateItPipe} from "../shared/pipes/translate-it.pipe";
import {Message} from "primeng/api/message";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private translatePipe: TranslateItPipe;

  constructor(private CONSTANTS: ConstantsService,
              private confirmationService: ConfirmationService,
              public dialog: MatDialog,
              private messageService: MessageService,
              private ngZone: NgZone) { }

  /**
   * set translate pipe
   *
   * @param translatePipe
   */
  public setTranslatePipe(translatePipe: TranslateItPipe) {
    this.translatePipe = translatePipe;
  }

  /**
   * check if message service is set
   */
  public isMessageServiceSet() {
    return !!this.messageService;
  }

  /**
   * clear all p-toast messages
   */
  public clearMessages() {
    this.messageService?.clear();
  }

  /**
   * show success message
   *
   * @param msg
   */
  public showSuccessMessage(msg: string) {
    if (this.messageService) {
      this.messageService.add({
        key: 'main', // means, that should be added to main message service at app.component
        severity: 'success',
        summary: this.translatePipe.transform('INFO'),
        detail: this.translatePipe.transform(msg),
        life: this.CONSTANTS.MESSAGES_LIFE_TIME
      });
      return true;
    } else {
      console.log('ERROR: messageService is not set!');
      return false;
    }
  }

  /**
   * show info message as toast. message close by default after 6 seconds.
   *
   * @param msg
   * @param closeMsg - optional, is true by default
   */
  public showInfoMessage(msg: string, closeMsg: boolean = true): boolean {
    if (this.messageService) {
      this.messageService.add({
        key: 'main', // means, that should be added to main message service at app.component
        severity: 'info',
        summary:  this.translatePipe.transform('INFO'),
        detail: this.translatePipe.transform(msg),
        life: this.CONSTANTS.MESSAGES_LIFE_TIME
      });
           return true;
    } else {
      console.log('ERROR: messageService is not set!');
      return false;
    }
  }

  /**
   * show error message as toast. message don't close by default.
   *
   * @param msg
   * @param closeMsg - optional, is false by default
   */
  public showErrorMessage(msg: string, closeMsg: boolean = false): boolean {
    if (this.messageService) {
      const msgSettings: Message = {
        key: 'main', // means, that should be added to main message service at app.component
        severity: 'error',
        summary: 'Error',
        detail: this.translatePipe.transform(msg),
        sticky: !closeMsg
      }
      if (closeMsg) {
        msgSettings.life = this.CONSTANTS.MESSAGES_LIFE_TIME;
      }
      // Workaround to show error message inside a subscribed
      // (not existing route error, e.g.: this.http.get('urlhere').subscribe();)
      // @link https://stackoverflow.com/a/54294071
      this.ngZone.run(() => {
        this.messageService.add(msgSettings);
      });
      return true;
    } else {
      console.log('ERROR: messageService is not set!');
      return false;
    }
  }

  /**
   * show primeng confirmation dialog (yes/no)
   *
   * @param dialogTitle
   * @param dialogMessage
   * @param buttonYesText
   * @param buttonNoText
   */
  public showConfirmationDialog(dialogTitle: string, dialogMessage: string, buttonYesText: string,
                                buttonNoText: string): Promise <boolean> {
    return new Promise((resolve, reject) => {
      this.confirmationService.confirm({
        header: dialogTitle,
        message: dialogMessage,
        acceptLabel: buttonYesText,
        rejectLabel: buttonNoText,
        accept: () => {
          resolve(true);
        },
        reject: () => {
          reject(false);
        }
      });
    });
  }

  /**
   * show info dialog
   *
   * @param self
   * @param description
   * @param text
   */
  public showInfoDialog(self: this, description: string, text: string): void {
    let refTable = self.CONSTANTS.INFO_DIALOG_NO_NAVIGATION_KEY;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      description, text, refTable
    };
    self.dialog.open(InfoDialogComponent, dialogConfig);
  }

  /**
   * get translated error text
   *
   * @param errorText
   * @param fieldValue
   * @param fieldName
   */
  public getErrorMessage(errorText: string, fieldValue: string, fieldName: string): string {
    let errorMessage: string = this.translatePipe.transform(errorText);
    errorMessage = errorMessage.replace('%s', '"' + fieldValue + '" ' +
      this.translatePipe.transform('ERROR_IN_FIELD') + ' "' +
      this.translatePipe.transform(fieldName) + '" ');
    return errorMessage;
  }
}
