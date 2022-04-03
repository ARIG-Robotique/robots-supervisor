import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sort' })
export class SortPipe implements PipeTransform {

  transform(values: any[]): any[] {
    return values?.sort();
  }

}
