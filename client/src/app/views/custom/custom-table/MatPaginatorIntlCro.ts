import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import {TranslateItPipe} from "../../../shared/pipes/translate-it.pipe";

/**
 * @link https://stackoverflow.com/a/46883528
 */

@Injectable()
export class MatPaginatorIntlCro extends MatPaginatorIntl {

  constructor(public translatePipe: TranslateItPipe) {
    super();
  }

  getRangeLabel = function (page, pageSize, length) {
    const initialText = ``;  // customize this line
    const ofText = this.translatePipe.transform('PAGINATOR_OF');
    if (length === 0 || pageSize === 0) {
      return `${initialText} 0 ${ofText} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${initialText} ${startIndex + 1} - ${endIndex} ${ofText} ${length}`; // customize this line
  };

}
