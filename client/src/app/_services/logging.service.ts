import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class LoggingService {

  constructor() {
  }


  logError(message: string, stack: string) {
    // ToDo: Send errors to server here for saving into log file
    // console.log('LoggingService: ', message);
    console.error(message);
    console.log(stack);
  }

}
