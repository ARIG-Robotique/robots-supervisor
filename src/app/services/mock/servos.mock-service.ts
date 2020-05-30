import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Robot } from '../../models/Robot';
import { ServoConfig, ServoGroup, Servos } from '../../models/Servo';
import { ServicesModule } from '../services.module';

@Injectable()
export class ServosMockService extends ServicesModule {

  getServos(robot: Robot): Observable<Servos> {
    return of([
      {
        id    : 1,
        name  : 'Mock',
        servos: [
          {
            id             : 1,
            name           : 'Mock',
            currentSpeed   : 0,
            currentPosition: 1500,
            positions      : [
              {name: 'Top', value: 0},
              {name: 'Bottom', value: 3000},
            ],
          },
        ],
        batch : [
          {name: 'Top', value: 0},
          {name: 'Bottom', value: 3000},
        ],
      },
    ]);
  }

  setPosition(robot: Robot, servo: ServoConfig, position: number, speed: number): Observable<unknown> {
    return of(null);
  }

  setPositionBatch(robot: Robot, group: ServoGroup, position: number): Observable<unknown> {
    return of(null);
  }

}
