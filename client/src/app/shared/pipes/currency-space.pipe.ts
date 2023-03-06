import { Pipe } from '@angular/core';
import {CurrencyPipe} from "@angular/common";

@Pipe({
  name: 'currencySpace'
})
export class CurrencySpacePipe extends CurrencyPipe {
  transform(value: number, ...args: any[]): any {
    return value !== undefined ?
      super.transform(value, ...args).replace(/([^\d.,])(\d)/, "$1 $2") : "";
  }
}
