import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from "@angular/forms";
import {ConstantsService} from "../_services/constants.service";

@Directive({
  selector: '[validMinutes]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MinutesValidator, multi: true }
  ]
})
export class MinutesValidator implements Validator {
  constructor(private constantsService: ConstantsService) {}
  validate(control: AbstractControl): {[key: string]: any} | null {
    return control.value ? regexValidator(new RegExp(this.constantsService.PATTERN_MINUTES_0_59_AND_STAR),['Error...'])(control) : null;
  }
}

@Directive({
  selector: '[validHours]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: HoursValidator, multi: true }
  ]
})
export class HoursValidator implements Validator {
  constructor(private constantsService: ConstantsService) {}
  validate(control: AbstractControl): {[key: string]: any} | null {
    return control.value ? regexValidator(new RegExp(this.constantsService.PATTERN_HOURS_0_23_AND_STAR),['Error...'])(control) : null;
  }
}

@Directive({
  selector: '[validDays]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: DaysValidator, multi: true }
  ]
})
export class DaysValidator implements Validator {
  constructor(private constantsService: ConstantsService) {}
  validate(control: AbstractControl): {[key: string]: any} | null {
    return control.value ? regexValidator(new RegExp(this.constantsService.PATTERN_DAYS_1_31_AND_STAR),['Error...'])(control) : null;
  }
}

@Directive({
  selector: '[validMonths]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MonthsValidator, multi: true }
  ]
})
export class MonthsValidator implements Validator {
  constructor(private constantsService: ConstantsService) {}
  validate(control: AbstractControl): {[key: string]: any} | null {
    return control.value ? regexValidator(new RegExp(this.constantsService.PATTERN_MONTHS_1_12_AND_STAR),['Error...'])(control) : null;
  }
}

@Directive({
  selector: '[validDayOfMonths]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: DayOfMonthsValidator, multi: true }
  ]
})
export class DayOfMonthsValidator implements Validator {
  constructor(private constantsService: ConstantsService) {}
  validate(control: AbstractControl): {[key: string]: any} | null {
    return control.value ? regexValidator(new RegExp(this.constantsService.PATTERN_MONTHS_0_7_AND_STAR),['Error...'])(control) : null;
  }
}

/** Check given regular expression */
export function regexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    if (!control.value) {
      return null;
    }
    const valid = regex.test(control.value);
    return valid ? null : error;
  };
}
