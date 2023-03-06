// import { Pipe, PipeTransform } from '@angular/core';
// import {ConstantsService} from "./_services/constants.service";
// import {CurrencyPipe} from "@angular/common";
//
// @Pipe({
//   name: 'soasTranslateIt',
//   pure: true
// })
// export class SoasTranslateItPipe implements PipeTransform {
//   constructor(private CONSTANTS: ConstantsService) {}
//   transform(value: string): string {
//     let result = value;
//     const LANGUAGE = localStorage.getItem(this.CONSTANTS.LS_LANGUAGE);
//     const TRANSLATEARRAY = JSON.parse( localStorage.getItem(this.CONSTANTS.LS_LOCALIZE));
//     if (TRANSLATEARRAY) {
//       for (let i = 0; i < TRANSLATEARRAY.length; i++) {
//         if (value && TRANSLATEARRAY[i]['LOCALIZE_TAG'] === value.trim()) {
//           result = TRANSLATEARRAY[i][LANGUAGE];
//           break;
//         }
//       }
//     } else {
//       //console.log(new Error("LocalStorage item was not found! Please logout and login again."));
//     }
//     return result;
//   }
// }
// //
// // @Pipe({
// //   name: 'soasBooleanTranslateMatIcon',
// //   pure: true
// // })
// // export class SoasBooleanTranslateMatIconPipe implements PipeTransform {
// //   transform(value: boolean): string {
// //     let result = value ? 'done' : 'clear';
// //     return result
// //   }
// // }
// //
// // @Pipe({
// //   name: 'currencySpace'
// // })
// // export class CurrencySpacePipe extends CurrencyPipe {
// //   transform(value: number, ...args: any[]): any {
// //     return value !== undefined ?
// //       super.transform(value, ...args).replace(/([^\d.,])(\d)/, "$1 $2") : "";
// //   }
// // }
