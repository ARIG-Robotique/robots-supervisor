import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AllConfigBras, AnglesBras, BRAS, Bras, CurrentBras, PointBras } from '../models/Bras';
import { Robot } from '../models/Robot';

@Injectable()
export class BrasService {
    constructor(private http: HttpClient) {}

    getConfig(robot: Robot): Observable<AllConfigBras> {
        return this.http.get<AllConfigBras>(`http://${robot.host}/bras/config`);
    }

    getCurrent(robot: Robot): Observable<Bras<CurrentBras>> {
        return this.http.get<Bras<CurrentBras>>(`http://${robot.host}/bras`);
    }

    setBras(robot: Robot, bras: BRAS, { x, y, a }: PointBras): Observable<boolean> {
        const search = new HttpParams().set('x', x).set('y', y).set('a', a);

        return this.http.post<boolean>(`http://${robot.host}/bras/${bras}`, {}, { params: search });
    }

    setBrasByName(robot: Robot, bras: BRAS, name: string): Observable<void> {
        const search = new HttpParams().set('name', name);

        return this.http.post<void>(`http://${robot.host}/bras/${bras}/byName`, {}, { params: search });
    }

    calculerAngles(robot: Robot, bras: BRAS, { x, y, a }: PointBras): Observable<AnglesBras> {
        const search = new HttpParams().set('x', x).set('y', y).set('a', a);

        return this.http.get<AnglesBras>(`http://${robot.host}/bras/${bras}/compute`, { params: search });
    }
}
