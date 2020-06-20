import { Pipe, PipeTransform } from '@angular/core';
import { Exec } from '../models/Exec';
import { formatDate } from '../utils/formatDate';

@Pipe({name: 'arigExec'})
export class ArigExecPipe implements PipeTransform {

  transform(exec: Exec): any {
    return `${exec.id} :
    le ${formatDate(exec.dateStart, 'PP')}
    de ${formatDate(exec.dateStart, 'pp')}
    à ${formatDate(exec.dateEnd, 'pp')}`;
  }

}
