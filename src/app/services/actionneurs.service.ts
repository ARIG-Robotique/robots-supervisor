import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ESide} from '../models/ESide';
import {EActionneurState} from '../models/EActionneurState';
import {Robot} from '../models/Robot';
import {Observable} from 'rxjs';

@Injectable()
export class ActionneursService {

  constructor(private http: HttpClient) {
  }

  ev(robot: Robot, side: ESide, state: EActionneurState): Observable<unknown> {
    const params = new HttpParams()
      .set('state', state);

    return this.http.post(`http://${robot.host}/actionneurs/ev/${side}`, {}, {params: params});
  }

  pompe(robot: Robot, side: ESide, state: EActionneurState): Observable<unknown> {
    const params = new HttpParams()
      .set('state', state);

    return this.http.post(`http://${robot.host}/actionneurs/pompe/${side}`, {}, {params: params});
  }

}
