import { formatDate } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { Exec } from '../models/Exec';

@Pipe({ name: 'arigExec' })
export class ArigExecPipe implements PipeTransform {
    constructor(@Inject(LOCALE_ID) private locale: string) {}

    transform(exec: Exec): any {
        return `${exec.id} :
    le ${formatDate(exec.dateStart, 'shortDate', this.locale)}
    de ${formatDate(exec.dateStart, 'shortTime', this.locale)}
    à ${formatDate(exec.dateEnd, 'shortTime', this.locale)}`;
    }
}
