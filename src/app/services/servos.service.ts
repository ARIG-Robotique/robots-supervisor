import {Injectable} from '@angular/core';

import {Servo} from '../models/Servo';
import {Robot} from '../models/Robot';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable()
export class ServosService {

  constructor(private http: HttpClient) {
  }

  /**
   * Retourne les servos d'un robot
   * @param {Robot} robot
   * @returns {Promise<Servo[]>}
   */
  getServos(robot: Robot) {
    return this.http.get(`http://${robot.host}/servos`);
  }

  /**
   * Envoie une commande déplacement de servo
   * @param {Robot} robot
   * @param {Servo} servo
   * @param {number} position
   * @param {number} speed
   * @returns {Promise}
   */
  setPosition(robot: Robot, servo: Servo, position: number, speed: number) {
    const search = new HttpParams()
      .set('position', '' + Math.max(servo.minPosition, Math.min(servo.maxPosition, position)))
      .set('speed', '' + Math.max(servo.minSpeed, Math.min(servo.maxSpeed, speed)));

    return this.http.post(`http://${robot.host}/servos/${servo.id}`, {}, {params: search});
  }

}
