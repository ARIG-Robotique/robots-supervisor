import {Injectable} from '@angular/core';
import {Robot} from '../models/Robot';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Position} from '../models/Position';

@Injectable()
export class MouvementsService {

  constructor(private http: HttpClient) {
  }

  /**
   * Envoie une commande de mouvement
   */
  sendMouvement(robot: Robot, type: string, values: any) {
    let params = new HttpParams();
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        params = params.set(key, values[key]);
      }
    }

    return this.http.post(`http://${robot.host}/mouvement/${type}`, {}, {params: params});
  }

  /**
   * Retourne la position du robot
   */
  getPosition(robot: Robot): Observable<Position> {
    return this.http.get<Position>(`http://${robot.host}/mouvement`);
  }

}
