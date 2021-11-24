import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Capteurs } from '../../models/Capteurs';
import { Robot } from '../../models/Robot';
import { CapteursService } from '../capteurs.service';
import { MockData } from './mock.utils';

@Injectable()
export class CapteursMockService extends CapteursService {

  private data = new MockData<number, Capteurs>(() => ({
    numerique : {
      [`AU`]     : true,
      [`Tirette`]: true,
    },
    analogique: {},
    text      : {
      [`Equipe`]: 'VIOLET',
    },
  }));

  getCapteurs(robot: Robot): Observable<Capteurs> {
    return of(this.data.get(robot.id));
  }

  setTirette(robot: Robot, present: boolean): Observable<unknown> {
    const data = this.data.get(robot.id);
    data.numerique[`Tirette`] = present;
    this.data.set(robot.id, data);
    return of(null);
  }

  setAu(robot: Robot, present: boolean): Observable<unknown> {
    const data = this.data.get(robot.id);
    data.numerique[`AU`] = present;
    this.data.set(robot.id, data);
    return of(null);
  }

}
