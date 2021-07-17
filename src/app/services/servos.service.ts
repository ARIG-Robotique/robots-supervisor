import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Robot } from '../models/Robot';
import { Servo, ServoGroup, Servos } from '../models/Servo';

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
  setPosition(robot: Robot, servo: Servo, position: number, speed: number): Observable<unknown> {
    const search = new HttpParams()
      .set('position', '' + position)
      .set('speed', '' + speed);

    return this.http.post(`http://${robot.host}/servos/${servo.id}`, {}, { params: search });
  }

  setPositionBatch(robot: Robot, group: ServoGroup, position: string): Observable<unknown> {
    const search = new HttpParams()
      .set('group', group.name)
      .set('position', position);

    return this.http.post(`http://${robot.host}/servos/batch`, {}, { params: search });
  }

}
