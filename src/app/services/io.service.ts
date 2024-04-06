import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Robot } from '../models/Robot';

@Injectable()
export class IOService {
    constructor(private http: HttpClient) {}

    /**
     * Change l'état des electro aimants
     */
    setElectroAimant(robot: Robot, state: 'on' | 'off'): Observable<void> {
        const params = new HttpParams().set('state', state);

        return this.http.post<void>(`http://${robot.host}/io/electro-aimant`, {}, { params });
    }

    /**
     * Change l'état de la roue
     */
    setSolarWheel(robot: Robot, state: 'bleu' | 'jaune' | 'off', speed: number = 512): Observable<void> {
        const params = new HttpParams().set('state', state).set('speed', speed);

        return this.http.post<void>(`http://${robot.host}/io/solar-wheel`, {}, { params });
    }
}
