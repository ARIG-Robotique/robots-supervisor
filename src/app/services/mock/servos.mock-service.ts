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
