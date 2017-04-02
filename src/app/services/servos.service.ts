import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {Servo} from "../models/Servo";
import {Robot} from "../models/Robot";

@Injectable()
export class ServosService {

  constructor(private http:Http) {
  }

  setPosition(robot:Robot, servo:Servo, position:number, speed:number):Promise<boolean> {
    let search = new URLSearchParams();
    search.set('position', '' + Math.max(servo.minPosition, Math.min(servo.maxPosition, position)));
    search.set('speed', '' + Math.max(servo.minSpeed, Math.min(servo.maxSpeed, speed)));

    return this.http.post(`http://${robot.host}/servos/${servo.id}`, {}, {search})
      .toPromise()
      .then(() => true);
  }

  sendMouvement(robot:Robot, type:string, values:any):Promise<boolean> {
    let search = new URLSearchParams();
    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        search.set(key, values[key])
      }
    }

    return this.http.post(`http://${robot.host}/mouvement/${type}`, {}, {search})
      .toPromise()
      .then(() => true);
  }

}
