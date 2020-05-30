import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ExecsService } from '../execs.service';

@Injectable()
export class ExecsMockService extends ExecsService {

  deleteExec(idRobot: number, idExec: string): Observable<unknown> {
    return of(null)
  }

  getPaths(idRobot: number, idExec: string): Observable<string[]> {
    return of([])
  }

}
