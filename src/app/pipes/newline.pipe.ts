import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newline'
})
export class NewlinePipe implements PipeTransform {

  transform(value: string): string {
    // \n karakterlerini <br> etiketlerine çevir
    return value.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

}
