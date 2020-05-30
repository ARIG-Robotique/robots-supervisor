import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Codeurs } from '../../models/Codeurs';
import { Robot } from '../../models/Robot';
import { CodeursService } from '../codeurs.service';

@Injectable()
export class CodeursMockService extends CodeursService {

  getCodeurs(robot: Robot): Observable<Codeurs> {
    return of({
      distance   : 0,
      orientation: 0,
      gauche     : 0,
      droite     : 0,
    });
  }

}
