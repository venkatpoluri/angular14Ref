import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterHeader'
})
export class FilterHeaderPipe implements PipeTransform {

    transform(items: Object, filter: any[]): any {
      if (!items || !filter) {
          return items;
      }
      return filter.reduce(function(result, prop) {
        result[prop] = items[prop];
        return result;
      }, {});
  }

}
