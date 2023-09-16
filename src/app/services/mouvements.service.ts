import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Position } from '../models/Position';
import { Robot } from '../models/Robot';

@Injectable()
export class MouvementsService {
    constructor(private http: HttpClient) {}

    /**
     * Envoie une commande de mouvement
     */
    sendMouvement(robot: Robot, type: string, values: Record<string, string | number>): Observable<unknown> {
        let params = new HttpParams();
        for (const key in values) {
            params = params.set(key, values[key]);
        }

        return this.http.post(`http://${robot.host}/mouvement/${type}`, {}, { params });
    }

    /**
     * Retourne la position du robot
     */
    getPosition(robot: Robot, full: boolean): Observable<Position> {
        const params = new HttpParams().set('full', `${full}`);

        return this.http.get<Position>(`http://${robot.host}/mouvement`, { params });
    }

    getMaskUrl(robot: Robot): string {
        return `http://${robot.host}/mouvement/mask?t=${new Date().getTime()}`;
    }
}
