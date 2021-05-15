import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Codeurs } from '../../models/Codeurs';
import { Robot } from '../../models/Robot';
import { CodeursService } from '../codeurs.service';
import { MockData } from './mock.utils';

@Injectable()
export class CodeursMockService extends CodeursService {

  private data = new MockData<number, Codeurs>(() => ({
    distance   : 0,
    orientation: 0,
    gauche     : 0,
    droite     : 0,
  }));

  getCodeurs(robot: Robot): Observable<Codeurs> {
    return of(this.data.get(robot.id));
  }

}
