import { Injectable } from '@angular/core';
import { range } from 'lodash';
import { Observable, of } from 'rxjs';
import { MapPosition } from '../../models/MapPosition';
import { Position } from '../../models/Position';
import { Robot } from '../../models/Robot';
import { EColor } from '../../models/sailTheWorld/GameStatus';
import { MouvementsService } from '../mouvements.service';
import { MockData } from './mock.utils';

@Injectable()
export class MouvementsMockService extends MouvementsService {

  private data = new MockData<number, MapPosition>(() => ({
    x    : 1500,
    y    : 1000,
    angle: 90,
  }));

  sendMouvement(robot: Robot, type: string, values: any): Observable<unknown> {
    const pos = this.data.get(robot.id);
    switch (type) {
      case 'path':
      case 'position':
        pos.x = values.x;
        pos.y = values.y;
        break;

      case 'orientation':
        pos.angle = values.angle;
        break;
    }
    this.data.set(robot.id, pos);

    return of(null);
  }

  getPosition(robot: Robot): Observable<Position> {
    const pos = this.data.get(robot.id);
    return of({
      ...pos,
      targetMvt       : null,
      trajetAtteint   : true,
      trajetEnApproche: false,
      typeAsserv      : 'DIST,ANGLE',
      pointsLidar     : range(20).map(i => ({ x: 500 + i * 20, y: 500 + i * 20 })),
      collisions      : [{
        type  : 'CIRCLE',
        centre: {
          x: 600,
          y: 600,
        },
        rayon : 200
      }],
      matchTime       : 25000,
      score           : 52,
      currentAction   : 'Mock',
      actions         : [
        { uuid: '1', order: 10, name: 'Action 1', valid: true },
        { uuid: '2', order: 10, name: 'Action 2', valid: true },
        { uuid: '3', order: 10, name: 'Action 3', valid: false },
        { uuid: '4', order: 10, name: 'Action 4', valid: true },
        { uuid: '5', order: 10, name: 'Action 5', valid: false },
        { uuid: '6', order: 10, name: 'Action 6', valid: false },
      ],
      scoreStatus     : {
        Foo: 10,
        Bar: 15,
      },
      gameStatus      : {
        echantillons: [
          { x: 900, y: 2000 - 795, angle: 0, color: EColor.ROUGE, visibleColor: EColor.ROCK },
          { x: 830, y: 2000 - 675, angle: 0, color: EColor.VERT, visibleColor: EColor.ROCK },
          { x: 900, y: 2000 - 555, angle: 0, color: EColor.BLEU, visibleColor: EColor.ROCK },

          { x: 900, y: 2000 - 1300, angle: -10, color: EColor.BLEU, visibleColor: EColor.BLEU },
          { x: 1050, y: 2000 - 1350, angle: 40, color: EColor.VERT, visibleColor: EColor.VERT },
          { x: 930, y: 2000 - 1450, angle: -20, color: EColor.ROUGE, visibleColor: EColor.ROUGE },

          { x: 2300, y: 2000 - 1200, angle: -10, color: EColor.UNKNOWN, visibleColor: EColor.ROCK },
        ],
      },
    });
  }

}
