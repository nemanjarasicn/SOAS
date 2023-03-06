import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  /**
   * Remove one string element from array
   *
   * @param array
   * @param element
   */
  public removeElmFromArr(array: string[], element: string) {
    if (array.find(x => x == element)) {
      array.splice(array.findIndex(x => x == element), 1);
    }
    return array;
  }

  /**
   * Remove elements from array
   *
   * @param array
   * @param elementsToRemoveArr
   */
  public removeElmsFromArr(array: any[], elementsToRemoveArr: any[]) {
    for (let elm in elementsToRemoveArr) {
      if (array.find(x => x == elementsToRemoveArr[elm])) {
        array.splice(array.findIndex(x => x == elementsToRemoveArr[elm]), 1);
      }
    }
    return array;
  }

  /**
   * Rename element in array
   *
   * @param array
   * @param oldElementName
   * @param newElementName
   */
  public renameElmInArr(array: any[], oldElementName: string, newElementName: string) {
    for (let elm in array) {
      if (array[elm] === oldElementName) {
        array[elm] = newElementName;
      }
    }
    return array;
  }

  /**
   * Calculate brutto price by given netto price, taxation and optional decimal places (by default 3)
   *
   * @param priceNet
   * @param taxation
   * @param decimalPlaces
   */
  public calcB2BPriceBru(priceNet: number, taxation: number, decimalPlaces: number = 3) {
    let price: number = Number(Number(priceNet) + Number(((priceNet / 100) * taxation)));
    return  Number(price.toFixed(decimalPlaces));
  }

  /**
   * Calculate netto price by given brutto price, taxation and optional decimal places (by default 3)
   *
   * @param priceBru
   * @param taxation
   * @param decimalPlaces
   */
  public calcB2CPriceNet(priceBru: number, taxation: number, decimalPlaces: number = 3) {
    let price: number = Number(Number(priceBru) - Number(((priceBru / 100) * taxation)));
    return  Number(price.toFixed(decimalPlaces));
  }

  /**
   * calculate taxation amount by subtracting gross price from net price
   *
   * @param priceBru
   * @param priceNet
   * @param decimalPlaces
   */
  public calcTaxAmount(priceBru: number, priceNet: number, decimalPlaces: number = 3) {
    let taxAmount: number = Number(Number(priceBru) - Number(priceNet));
    return Number(taxAmount.toFixed(decimalPlaces));
  }

  /**
   * returns fixed price. default decimal places = 3
   *
   * @param price
   * @param decimalPlaces
   */
  public getFixedPrice(price: number, decimalPlaces: number = 3) {
    return Number(price.toFixed(decimalPlaces));
  }

  /**
   * Get current data formatted as string "2020-05-31 23:05:07"
   */
  public getCurrentDate() {
    let currDate = new Date();
    return currDate.getFullYear() + '-' + ('0' + (currDate.getMonth()+1)).slice(-2) + '-' +
      ('0' + currDate.getDate()).slice(-2) + " " + ('0' + currDate.getHours()).slice(-2) + ":" +
      ('0' + currDate.getMinutes()).slice(-2) + ":" + ('0' + currDate.getSeconds()).slice(-2);
  }

  /**
   * get string inside brackets: "abc (test) def" => returns "test"
   *
   * @param text
   */
  public getStringInBrackets(text: string) {
    return text.match(/\(([^)]+)\)/)[1];
  }

  /**
   * sort options
   *
   * @param arrayObject
   */
  public sortOptions(arrayObject: {label, value }[] | {name, value }[]) {
    arrayObject.sort(function (a, b) {
      let labelA = (a.label) ? a.label.toString().toUpperCase() : a.name?.toString().toUpperCase();
      let labelB = (b.label) ? b.label.toString().toUpperCase() : b.name?.toString().toUpperCase();
      if (labelA < labelB) {
        return -1;
      }
      if (labelA > labelB) {
        return 1;
      }
      return 0;
    });
  }

  /**
   * Get currency name by given id.
   * If id was not found returns id.
   *
   * @param currencies
   * @param currencyId
   */
  public getCurrencyName(currencies: any, currencyId: string): string {
    for (let cur in currencies) {
      if (currencies.hasOwnProperty(cur) && parseInt(currencyId) === parseInt(currencies[cur].value)) {
        return currencies[cur].name;
      }
    }
    return currencyId;
  }

  /**
   * Get currency id by iso code. e.g. 'EUR' returns '1'.
   * If iso code was not found returns undefined.
   *
   * @param currencies
   * @param isoCode
   */
  public getCurrencyIdByIsoCode(currencies: any, isoCode: string): undefined|string {
    for (let cur in currencies) {
      if (currencies.hasOwnProperty(cur) && isoCode === (currencies[cur].name)) {
        return currencies[cur].value;
      }
    }
    return undefined;
  }

  /**
   * check if list2 object is in list by comparing 'name' attributes
   *
   * @param list
   * @param list2
   * @param propertyName
   */
  isObjectInArray(list: any[], list2: {}, propertyName: string = 'name'): boolean {
    if (list.length > 0 ) {
      if (list2[propertyName]) {
        for (let i in list) {
          if (list.hasOwnProperty(i)) {
            if (list[i][propertyName] === list2[propertyName]) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * check if list2 object is in list by comparing 'name' attributes
   *
   * @param list
   * @param value
   * @param propertyName
   */
  isValueInArray(list: any[], value: any, propertyName: string = 'value'): boolean {
    if (list.length > 0 ) {
      if (value) {
        for (let i in list) {
          if (list.hasOwnProperty(i)) {
            if (list[i][propertyName] === value) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }


  /**
   * start tracking time
   *
   * @param functionName
   * @returns startTime start time as number of milliseconds
   */
  startTimeTracking(functionName: string) {
    let startTime = new Date().getTime();
    let startDate = new Date();
    console.log(functionName + ' STARTED AT ... ', startDate.getHours() + ':' + startDate.getMinutes() +
      ':' + startDate.getSeconds() + '.' + startDate.getMilliseconds());
    return startTime;
  }

  /**
   * stop time tracking, compare with start date and print time duration
   *
   * @param startTime
   * @param functionName
   */
  stopTimeTracking(startTime: number, functionName: string) {
    let stopDate = new Date();
    let stopTime: number | Date = stopDate.getTime() - startTime;
    stopTime = new Date(stopTime);
    console.log(functionName + ' STOPPED AT ... ', stopDate.getHours() + ':' + stopDate.getMinutes() +
      ':' + stopDate.getSeconds() + '.' + stopDate.getMilliseconds());
    console.log(functionName + " Duration: " + (stopTime.getHours() - 1) + ':' + stopTime.getMinutes() +
      ':' + stopTime.getSeconds() + '.' + stopTime.getMilliseconds());
  }
}
