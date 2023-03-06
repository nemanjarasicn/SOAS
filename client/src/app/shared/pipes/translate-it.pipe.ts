import { Pipe, PipeTransform } from '@angular/core';
import {ConstantsService} from "../../_services/constants.service";

@Pipe({
  name: 'translateIt'
})
export class TranslateItPipe implements PipeTransform {
  constructor(private CONSTANTS: ConstantsService) {}
  transform(value: string): string {
    let result = value;
    const LANGUAGE = localStorage.getItem(this.CONSTANTS.LS_LANGUAGE);
    const TRANSLATE_ARRAY = JSON.parse( localStorage.getItem(this.CONSTANTS.LS_LOCALIZE));
    if (TRANSLATE_ARRAY) {
      for (let i = 0; i < TRANSLATE_ARRAY.length; i++) {
        if (value && TRANSLATE_ARRAY[i]['LOCALIZE_TAG'] === value.trim()) {
          result = TRANSLATE_ARRAY[i][LANGUAGE];
          break;
        }
      }
    } else {
      //console.log(new Error("LocalStorage item was not found! Please logout and login again."));
    }
    return result;
  }
}
