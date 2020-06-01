import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';
import FR from 'date-fns/locale/fr';
import { Exec } from '../models/Exec';

@Pipe({name: 'exec'})
export class ExecPipe implements PipeTransform {

  transform(exec: Exec): any {
    return `${exec.id} :
    le ${format(exec.dateStart, 'PP', {locale: FR})}
    de ${format(exec.dateStart, 'pp', {locale: FR})}
    à ${format(exec.dateEnd, 'pp', {locale: FR})}`;
  }

}
