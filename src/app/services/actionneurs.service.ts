import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ESide} from "../models/ESide";
import {EActionneurState} from "../models/EActionneurState";
import {Robot} from "../models/Robot";
import {Observable} from "rxjs";

@Injectable()
export class ActionneursService {

  constructor(private http: HttpClient) {
  }

  ev(robot: Robot, side: ESide, state: EActionneurState): Observable<any> {
    return this.http.post(`http://${robot.host}/actionneurs/ev/${side}`, state, {
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  pompe(robot: Robot, side: ESide, state: EActionneurState): Observable<any> {
    return this.http.post(`http://${robot.host}/actionneurs/pompe/${side}`, state, {
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

}
