import {Injectable} from '@angular/core';
import {ServoConfig, ServoGroup, Servos} from '../models/Servo';
import {Robot} from '../models/Robot';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class ServosService {

  constructor(private http: HttpClient) {
  }

  /**
   * Retourne les servos d'un robot
   */
  getServos(robot: Robot): Observable<Servos> {
    return this.http.get<Servos>(`http://${robot.host}/servos`);
  }

  /**
   * Envoie une commande déplacement de servo
   */
  setPosition(robot: Robot, servo: ServoConfig, position: number, speed: number): Observable<unknown> {
    const search = new HttpParams()
      .set('position', '' + position)
      .set('speed', '' + speed);

    return this.http.post(`http://${robot.host}/servos/${servo.id}`, {}, {params: search});
  }

  setPositionBatch(robot: Robot, group: ServoGroup, position: number): Observable<unknown> {
    const search = new HttpParams()
      .set('position', '' + position);

    return this.http.post(`http://${robot.host}/servos/batch/${group.id}`, {}, {params: search});
  }

}
