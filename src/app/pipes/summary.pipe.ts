//https://gist.github.com/salmanx/2475b587a7413bcd9de5dd4d8db82d7c

import { Pipe, PipeTransform } from "@angular/core";

//Metin Kısaltma Pipe

@Pipe({
    name: 'summary'
})

export class SummaryPipe implements PipeTransform {

    transform(value: string, limit?: number) {
        if (!value) return null

        let _limit = (limit) ? limit : 20;
        if(value.length <=_limit){
            return value.substring(0, _limit);
        }
        return value.substring(0, _limit) + '...';
    }
}