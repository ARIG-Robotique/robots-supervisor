import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Position } from '../../models/Position';
import { Robot } from '../../models/Robot';
import { ECouleurBouee } from '../../models/sailTheWorld/ECouleurBouee';
import { EDirectionGirouette } from '../../models/sailTheWorld/EDirectionGirouette';
import { MouvementsService } from '../mouvements.service';

@Injectable()
export class MouvementsMockService extends MouvementsService {

  sendMouvement(robot: Robot, type: string, values: any): Observable<unknown> {
    return of(null);
  }

  getPosition(robot: Robot): Observable<Position> {
    return of({
      x               : 1500,
      y               : 1000,
      angle           : 90,
      targetMvt       : null,
      trajetAtteint   : true,
      trajetEnApproche: false,
      typeAsserv      : 'DIST,ANGLE',
      pointsLidar     : [],
      collisions      : [],
      matchTime       : 25000,
      score           : 52,
      currentAction   : 'Mock',
      actions         : [
        {uuid: '1', order: 10, name: 'Action 1', valid: true},
        {uuid: '2', order: 10, name: 'Action 2', valid: true},
        {uuid: '3', order: 10, name: 'Action 3', valid: false},
        {uuid: '4', order: 10, name: 'Action 4', valid: true},
        {uuid: '5', order: 10, name: 'Action 5', valid: false},
        {uuid: '6', order: 10, name: 'Action 6', valid: false},
      ],
      scoreStatus     : {
        'Phare'        : 15,
        'Grand port'   : 1,
        'Petit port'   : 2,
        'Grand chenaux': 16,
        'Petit chenaux': 13,
        'Manche a air' : 5,
        'Port'         : 0,
        'Pavillon'     : 0,
      },
      gameStatus      : {
        bouees          : [
          false, false, false, false,
          false, false, false, false,
          false, false, true, true,
          true, true, false, false,
        ],
        grandPort       : [ECouleurBouee.INCONNU],
        grandChenalVert : [ECouleurBouee.VERT, ECouleurBouee.VERT, ECouleurBouee.ROUGE],
        grandChenalRouge: [ECouleurBouee.VERT, ECouleurBouee.ROUGE, ECouleurBouee.ROUGE],
        petitPort       : [ECouleurBouee.INCONNU, ECouleurBouee.INCONNU],
        petitChenalVert : [ECouleurBouee.VERT, ECouleurBouee.VERT, ECouleurBouee.ROUGE],
        petitChenalRouge: [ECouleurBouee.VERT, ECouleurBouee.ROUGE, ECouleurBouee.ROUGE],
        pincesAvant     : [null, ECouleurBouee.ROUGE, null, ECouleurBouee.VERT],
        pincesArriere   : [ECouleurBouee.VERT, ECouleurBouee.VERT, ECouleurBouee.ROUGE, ECouleurBouee.ROUGE, ECouleurBouee.ROUGE],
        phare           : true,
        mancheAAir1     : true,
        mancheAAir2     : false,
        ecueilEquipePris: true,
        ecueilCommunEquipePris: false,
        ecueilCommunAdversePris: false,
        girouette       : EDirectionGirouette.DOWN,

        // tslint:disable-next-line:max-line-length
        couleursEcueilEquipe       : [ECouleurBouee.ROUGE, ECouleurBouee.VERT, ECouleurBouee.ROUGE, ECouleurBouee.VERT, ECouleurBouee.ROUGE],
        // tslint:disable-next-line:max-line-length
        couleursEcueilCommunEquipe : [ECouleurBouee.ROUGE, ECouleurBouee.INCONNU, ECouleurBouee.INCONNU, ECouleurBouee.INCONNU, ECouleurBouee.VERT],
        // tslint:disable-next-line:max-line-length
        couleursEcueilCommunAdverse: [ECouleurBouee.ROUGE, ECouleurBouee.INCONNU, ECouleurBouee.INCONNU, ECouleurBouee.INCONNU, ECouleurBouee.VERT],
      },
    });
  }

}
