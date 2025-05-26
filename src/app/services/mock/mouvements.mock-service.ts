import { Injectable } from '@angular/core';
import { range } from 'lodash';
import { Observable, of } from 'rxjs';
import { MapPosition } from '../../models/MapPosition';
import { Position } from '../../models/Position';
import { Robot } from '../../models/Robot';
import { GradinBrutId, } from '../../models/showMustGoOn/GameStatus';
import { MouvementsService } from '../mouvements.service';
import { MockData } from './mock.utils';

@Injectable()
export class MouvementsMockService extends MouvementsService {
    private data = new MockData<number, MapPosition>(() => ({
        x: 1500,
        y: 1000,
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
            targetMvt: null,
            trajetAtteint: true,
            trajetEnApproche: false,
            typeAsserv: 'DIST,ANGLE',
            strategy: 'Qualification',
            pointsLidar: range(20).map((i) => ({ x: 500 + i * 20, y: 500 + i * 20 })),
            collisions: [
                {
                    type: 'CIRCLE',
                    centre: {
                        x: 600,
                        y: 600,
                    },
                    rayon: 200,
                },
            ],
            matchTime: 25000,
            score: 52,
            currentAction: 'Mock',
            actions: [
                { uuid: '1', order: 10, name: 'Action 1', valid: true },
                { uuid: '2', order: 10, name: 'Action 2', valid: true },
                { uuid: '3', order: 10, name: 'Action 3', valid: false },
                { uuid: '4', order: 10, name: 'Action 4', valid: true },
                { uuid: '5', order: 10, name: 'Action 5', valid: false },
                { uuid: '6', order: 10, name: 'Action 6', valid: false },
            ],
            scoreStatus: {
                Foo: 10,
                Bar: 15,
            },
            gameStatus: {
                gradinBrutStock: [
                    { x: 825, y: 1725, id: GradinBrutId.JAUNE_RESERVE, present: false, bloque: false },
                    { x: 75, y: 1325, id: GradinBrutId.JAUNE_HAUT_GAUCHE, present: true, bloque: true },
                    { x: 1100, y: 950, id: GradinBrutId.JAUNE_MILIEU_CENTRE, present: true, bloque: false },
                    { x: 75, y: 400, id: GradinBrutId.JAUNE_BAS_GAUCHE, present: true, bloque: false },
                    { x: 775, y: 250, id: GradinBrutId.JAUNE_BAS_CENTRE, present: true, bloque: false },
                    { x: 2175, y: 1725, id: GradinBrutId.BLEU_RESERVE, present: true, bloque: false },
                    { x: 2925, y: 1325, id: GradinBrutId.BLEU_HAUT_DROITE, present: true, bloque: false },
                    { x: 1900, y: 950, id: GradinBrutId.BLEU_MILIEU_CENTRE, present: true, bloque: true },
                    { x: 2925, y: 400, id: GradinBrutId.BLEU_BAS_DROITE, present: false, bloque: false },
                    { x: 2225, y: 250, id: GradinBrutId.BLEU_BAS_CENTRE, present: true, bloque: false }
                ],

                airesConstruction: {
                    grandEquipe: [
                        [ true, true, true ],
                        [ true, true, false ],
                        [ true, false, false ],
                    ],
                    petitAdverse: [
                        [ true, true, false ],
                    ],
                    petitEquipe: [
                        [ true, false, false ],
                    ],
                    grandAdverse: [
                        [ false, false, false ],
                        [ true, false, false ],
                        [ true, true, false ],
                    ]
                },

                faceAvant: {
                    pinceGauche: false,
                    pinceDroite: false,
                    solGauche: false,
                    solDroite: false,
                    tiroirHaut: false,
                    tiroirBas: false,
                },

                faceArriere: {
                    pinceGauche: false,
                    pinceDroite: false,
                    solGauche: false,
                    solDroite: false,
                    tiroirHaut: false,
                    tiroirBas: false,
                },
            },
            gameFlags: {
                foo: true,
                bar: false,
            },
            gameConfigs: {
                option1: true,
                option2: false,
            }
        });
    }

    getMaskUrl(robot: Robot): string {
        return `assets/mock/work.png?t=${new Date().getTime()}`;
    }
}
