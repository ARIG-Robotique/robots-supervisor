import { Injectable } from '@angular/core';
import { Robot } from '../models/Robot';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Capteurs } from '../models/Capteurs';

@Injectable()
export class CapteursService {
    constructor(private http: HttpClient) {}

    /**
     * Retourne les infos des capteurs
     */
    getCapteurs(robot: Robot): Observable<Capteurs> {
        return this.http.get<Capteurs>(`http://${robot.host}/capteurs`);
    }

    /**
     * Enlève ou met la tirette
     */
    setTirette(robot: Robot, present: boolean): Observable<unknown> {
        if (!robot.simulateur) {
            return throwError('Action on permise sur robot réel');
        }
        return this.http.post(`http://${robot.host}/capteurs/tirette`, present, {
            headers: new HttpHeaders().append('Content-Type', 'application/json'),
        });
    }

    /**
     * Enlève ou met l'AU
     */
    setAu(robot: Robot, present: boolean): Observable<unknown> {
        if (!robot.simulateur) {
            return throwError('Action on permise sur robot réel');
        }
        return this.http.post(`http://${robot.host}/capteurs/au`, present, {
            headers: new HttpHeaders().append('Content-Type', 'application/json'),
        });
    }
}
