import { NgModule } from '@angular/core';
import {TranslateItPipe} from "./pipes/translate-it.pipe";
import {BooleanToMatIconPipe} from "./pipes/boolean-to-mat-icon.pipe";
import {CurrencySpacePipe} from "./pipes/currency-space.pipe";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    /* declare it once, here */
    TranslateItPipe,
    BooleanToMatIconPipe,
    CurrencySpacePipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  exports: [
    /* then export it */
    TranslateItPipe,
    BooleanToMatIconPipe,
    CurrencySpacePipe,
  ]
})
export class SharedModule { }
