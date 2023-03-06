import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'booleanToMatIcon'
})
export class BooleanToMatIconPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'done' : 'clear'
  }
}
