import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Capteurs } from '../../models/Capteurs';
import { Robot } from '../../models/Robot';
import { CapteursService } from '../capteurs.service';

@Injectable()
export class CapteursMockService extends CapteursService {

  private MOCK = {
    numerique : {
      [`AU`]: true,
      [`Tirette`]        : true,
    },
    analogique: {},
    text      : {
      [`Equipe`]: 'JAUNE',
    },
  };

  getCapteurs(robot: Robot): Observable<Capteurs> {
    return of(this.MOCK);
  }

  setTirette(robot: Robot, present: boolean): Observable<unknown> {
    this.MOCK.numerique[`Tirette`] = present;
    return of(null);
  }

  setAu(robot: Robot, present: boolean): Observable<unknown> {
    this.MOCK.numerique[`AU`] = present;
    return of(null);
  }

}
