import { Injectable } from '@angular/core';
import { Asserv } from 'app/models/Asserv';
import { Observable, of } from 'rxjs';
import { Robot } from '../../models/Robot';
import { AsservissementService } from '../asservissement.service';
import { MockData } from './mock.utils';

@Injectable()
export class AsservissementMockService extends AsservissementService {

  private data = new MockData<number, MockData<string, Asserv>>(() => new MockData(() => ({
    kp     : 9,
    ki     : 0,
    kd     : 2,
    rampAcc: 500,
    rampDec: 500,
    vitesse: 900,
  })));

  getValues(robot: Robot, type: string): Observable<Asserv> {
    return of(this.data.get(robot.id).get(type));
  }

  setValues(robot: Robot, type: string, values: Asserv): Observable<unknown> {
    this.data.get(robot.id).set(type, values);
    return of(null);
  }

}
