import { Injectable } from '@angular/core';
import { range } from 'lodash';
import { Observable, of } from 'rxjs';
import { MapPosition } from '../../models/MapPosition';
import { Position } from '../../models/Position';
import { Robot } from '../../models/Robot';
import { CouleurPanneauSolaire, TypePlante } from '../../models/farmingMars/GameStatus';
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
                stockPots: {
                    BLEU_NORD: true,
                    BLEU_MILIEU: true,
                    BLEU_SUD: true,
                    JAUNE_NORD: true,
                    JAUNE_MILIEU: true,
                    JAUNE_SUD: true,
                },
                airesDepose: {
                    NORD: [
                        { type: TypePlante.FRAGILE, dansPot: true },
                        { type: TypePlante.RESISTANTE, dansPot: true },
                        { type: TypePlante.RESISTANTE, dansPot: false },
                        { type: TypePlante.FRAGILE, dansPot: false },
                        { type: TypePlante.FRAGILE, dansPot: false },
                        { type: TypePlante.FRAGILE, dansPot: false },
                    ],
                    MILIEU: [
                        { type: TypePlante.FRAGILE, dansPot: false },
                        { type: TypePlante.FRAGILE, dansPot: true },
                        { type: TypePlante.FRAGILE, dansPot: false },
                        { type: TypePlante.FRAGILE, dansPot: false },
                        { type: TypePlante.FRAGILE, dansPot: false },
                    ],
                    SUD: [
                        { type: TypePlante.FRAGILE, dansPot: true },
                        { type: TypePlante.RESISTANTE, dansPot: true },
                        { type: TypePlante.RESISTANTE, dansPot: false },
                        { type: TypePlante.FRAGILE, dansPot: false },
                        { type: TypePlante.FRAGILE, dansPot: false },
                        { type: TypePlante.FRAGILE, dansPot: false },
                    ],
                },
                jardinieres: {
                    NORD: [
                        { type: TypePlante.FRAGILE, dansPot: true },
                        { type: TypePlante.RESISTANTE, dansPot: true },
                        { type: TypePlante.RESISTANTE, dansPot: false },
                        { type: TypePlante.FRAGILE, dansPot: false },
                        { type: TypePlante.FRAGILE, dansPot: false },
                        { type: TypePlante.FRAGILE, dansPot: true },
                    ],
                    MILIEU: [
                        { type: TypePlante.FRAGILE, dansPot: false },
                        { type: TypePlante.FRAGILE, dansPot: true },
                        { type: TypePlante.FRAGILE, dansPot: false },
                    ],
                    SUD: [
                        { type: TypePlante.FRAGILE, dansPot: true },
                        { type: TypePlante.RESISTANTE, dansPot: true },
                        { type: TypePlante.RESISTANTE, dansPot: false },
                        { type: TypePlante.FRAGILE, dansPot: false },
                        { type: TypePlante.FRAGILE, dansPot: false },
                    ],
                },
                plantes: [
                    { type: TypePlante.FRAGILE, dansPot: true, x: 2580, y: 1060 },
                    { type: TypePlante.FRAGILE, dansPot: false, x: 2500, y: 1100 },
                    { type: TypePlante.RESISTANTE, dansPot: false, x: 2500, y: 1000 },
                ],
                panneaux: [
                    { color: CouleurPanneauSolaire.AUCUNE },
                    { color: CouleurPanneauSolaire.AUCUNE },
                    { color: CouleurPanneauSolaire.TEMP_BLEU },
                    { color: CouleurPanneauSolaire.BLEU },
                    { color: CouleurPanneauSolaire.JAUNE_ET_BLEU },
                    { color: CouleurPanneauSolaire.JAUNE },
                    { color: CouleurPanneauSolaire.TEMP_JAUNE },
                    { color: CouleurPanneauSolaire.AUCUNE },
                    { color: CouleurPanneauSolaire.AUCUNE },
                ],
            },
            gameFlags: {
                foo: true,
                bar: false,
            },
        });
    }

    getMaskUrl(robot: Robot): string {
        return `assets/mock/work.png?t=${new Date().getTime()}`;
    }
}
