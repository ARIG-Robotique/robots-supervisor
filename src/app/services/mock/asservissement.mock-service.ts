import { Injectable } from '@angular/core';
import { Asserv } from 'app/models/Asserv';
import { Observable, of } from 'rxjs';
import { Robot } from '../../models/Robot';
import { AsservissementService } from '../asservissement.service';

@Injectable()
export class AsservissementMockService extends AsservissementService {

  getValues(robot: Robot, type: string): Observable<Asserv> {
    return of({
      kp     : 9,
      ki     : 0,
      kd     : 2,
      rampAcc: 500,
      rampDec: 500,
      vitesse: 900,
    });
  }

  setValues(robot: Robot, type: string, values: Asserv): Observable<unknown> {
    return of(null);
  }

}
