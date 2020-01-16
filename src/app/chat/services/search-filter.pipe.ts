import { Injectable,Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})

@Injectable()
export class SearchFilterPipe implements PipeTransform {

  // transform(value: any, ...args: any[]): any {
  //   return null;
  // }
  public transform(value, keys: string, term: string) {
    console.log('value ',value ,'keys ',keys ,'term ',term)
    if (!term) return value;
    return (value || []).filter(item => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])));

  }

}
