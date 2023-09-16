import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Robot } from '../models/Robot';

@Injectable()
export class StrategyService {
    constructor(private http: HttpClient) {}

    /**
     * Execute une action
     */
    execute(robot: Robot, uid: string): Observable<void> {
        const params = new HttpParams().set('uid', uid);
        return this.http.post<void>(`http://${robot.host}/strategy/execute`, null, { params });
    }
}
