import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Robot } from '../../models/Robot';
import { Servo, ServoGroup, Servos } from '../../models/Servo';
import { ServosService } from '../servos.service';
import { AppToastService } from '../toast.service';

@Injectable()
export class ServosMockService extends ServosService {
    servos: Servos = [
        {
            id: 1,
            name: 'Mock',
            servos: [
                {
                    id: 1,
                    name: 'Mock',
                    currentSpeed: 0,
                    currentPosition: 3000,
                    positions: {
                        Top: { name: 'Top', value: 0, speed: 0 },
                        Bottom: { name: 'Bottom', value: 3000, speed: 0 },
                    },
                },
            ],
            batch: ['Top', 'Bottom'],
        },
        {
            id: 2,
            name: 'Pinces avant',
            servos: [
                {
                    id: 2,
                    name: 'Pince avant droite',
                    currentSpeed: 0,
                    currentPosition: 0,
                    positions: {
                        Ferme: { name: 'Ferme', value: 0, speed: 0 },
                        Prise: { name: 'Prise', value: 1500, speed: 0 },
                        Ouvert: { name: 'Ouvert', value: 3000, speed: 0 },
                    },
                },
                {
                    id: 3,
                    name: 'Pince avant centre',
                    currentSpeed: 0,
                    currentPosition: 0,
                    positions: {
                        Ferme: { name: 'Ferme', value: 0, speed: 0 },
                        Prise: { name: 'Prise', value: 1500, speed: 0 },
                        Ouvert: { name: 'Ouvert', value: 3000, speed: 0 },
                    },
                },
                {
                    id: 4,
                    name: 'Pince avant gauche',
                    currentSpeed: 0,
                    currentPosition: 0,
                    positions: {
                        Ferme: { name: 'Ferme', value: 0, speed: 0 },
                        Prise: { name: 'Prise', value: 1500, speed: 0 },
                        Ouvert: { name: 'Ouvert', value: 3000, speed: 0 },
                    },
                },
            ],
            batch: ['Ferme', 'Prise', 'Ouvert'],
        },
        {
            id: 3,
            name: 'Pinces arrière',
            servos: [
                {
                    id: 5,
                    name: 'Pince arrière droite',
                    currentSpeed: 0,
                    currentPosition: 0,
                    positions: {
                        Ferme: { name: 'Ferme', value: 0, speed: 0 },
                        Prise: { name: 'Prise', value: 1500, speed: 0 },
                        Ouvert: { name: 'Ouvert', value: 3000, speed: 0 },
                    },
                },
                {
                    id: 6,
                    name: 'Pince arrière centre',
                    currentSpeed: 0,
                    currentPosition: 0,
                    positions: {
                        Ferme: { name: 'Ferme', value: 0, speed: 0 },
                        Prise: { name: 'Prise', value: 1500, speed: 0 },
                        Ouvert: { name: 'Ouvert', value: 3000, speed: 0 },
                    },
                },
                {
                    id: 7,
                    name: 'Pince arrière gauche',
                    currentSpeed: 0,
                    currentPosition: 0,
                    positions: {
                        Ferme: { name: 'Ferme', value: 0, speed: 0 },
                        Prise: { name: 'Prise', value: 1500, speed: 0 },
                        Ouvert: { name: 'Ouvert', value: 3000, speed: 0 },
                    },
                },
            ],
            batch: ['Ferme', 'Prise', 'Ouvert'],
        }
    ];

    constructor(
        http: HttpClient,
        private toastService: AppToastService,
    ) {
        super(http);
    }

    getServos(robot: Robot): Observable<Servos> {
        return of(this.servos);
    }

    setPosition(robot: Robot, servo: Servo, position: number, speed: number): Observable<unknown> {
        this.toastService.info(`Servo ${servo.name} to position ${position} at speed ${speed}.`);
        return of(null);
    }

    setPositionBatch(robot: Robot, group: ServoGroup, position: string): Observable<unknown> {
        this.toastService.info(`Group ${group.name} to position ${position}.`);
        group.servos.forEach((servo) => {
            if (servo.positions[position]) {
                servo.currentPosition = servo.positions[position].value;
                servo.currentSpeed = servo.positions[position].speed;
            }
        });
        return of(null);
    }
}
