import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Robot } from '../models/Robot';

@Injectable()
export class IOService {
    constructor(private http: HttpClient) {}

    /**
     * Change l'état d'une pompe
     */
    setPumpState(robot: Robot, pump: 'haut' | 'bas', state: boolean): Observable<void> {
        const params = new HttpParams().set('state', state);

        return this.http.post<void>(`http://${robot.host}/io/pumps/${pump}`, {}, { params });
    }
}
