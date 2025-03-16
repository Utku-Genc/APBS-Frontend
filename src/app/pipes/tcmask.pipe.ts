import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tcMask'
})
export class TcMaskPipe implements PipeTransform {
  transform(value: string, showFull: boolean = false): string {
    if (!value || value.length < 3) {
      return value; 
    }

    return showFull ? value : `${value.substring(0, 3)}•••••••••`;
  }
}
