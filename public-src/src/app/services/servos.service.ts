import {Injectable} from "@angular/core";
import {Http, URLSearchParams, Response} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {Servo} from "../models/Servo";
import {Robot} from "../models/Robot";

@Injectable()
export class ServosService {

  constructor(private http:Http) {
  }

  /**
   * Retourne les servos d'un robot
   * @param {Robot} robot
   * @returns {Promise<Servo[]>}
   */
  getServos(robot:Robot):Promise<Servo[]> {
    return this.http.get(`http://${robot.host}/servos`)
      .toPromise()
      .then((response:Response) => {
        return response.json().map((servo:Servo) => {
          servo.minPosition = servo.minPosition || 500;
          servo.maxPosition = servo.maxPosition || 2500;
          servo.minSpeed = 0;
          servo.maxSpeed = 50;
          return servo;
        });
      });
  }

  /**
   * Envoie une commande déplacement de servo
   * @param {Robot} robot
   * @param {Servo} servo
   * @param {number} position
   * @param {number} speed
   * @returns {Promise}
   */
  setPosition(robot:Robot, servo:Servo, position:number, speed:number):Promise<boolean> {
    let search = new URLSearchParams();
    search.set('position', '' + Math.max(servo.minPosition, Math.min(servo.maxPosition, position)));
    search.set('speed', '' + Math.max(servo.minSpeed, Math.min(servo.maxSpeed, speed)));

    return this.http.post(`http://${robot.host}/servos/${servo.id}`, {}, {search})
      .toPromise()
      .then(() => true);
  }

}
