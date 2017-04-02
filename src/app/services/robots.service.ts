import {Injectable} from "@angular/core";
import {Robot} from "../models/Robot";
import {Http, Response} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {Servo} from "../models/Servo";

@Injectable()
export class RobotsService {

  private robots:Robot[];

  constructor(private http:Http) {
    let robots = localStorage.getItem('robots');
    if (robots) {
      this.robots = JSON.parse(robots);
    }
    else {
      this.robots = [];
    }
  }

  /**
   * Retourne un robot
   * @param {string} id
   * @returns {Promise<Robot>}
   */
  getRobot(id:any):Promise<Robot> {
    return Promise.resolve(this.robots.find((robot:Robot) => robot.id === id));
  }

  /**
   * Retourne tous les robots
   * @returns {Promise<Robot[]>}
   */
  getRobots():Promise<Robot[]> {
    return Promise.resolve(this.robots);
  }

  /**
   * Ajoute un robot
   * @param {Robot} robot
   * @returns {Promise<Robot>}
   */
  addRobot(robot:Robot):Promise<Robot> {
    this.robots.push(robot);
    localStorage.setItem('robots', JSON.stringify(this.robots));

    return Promise.resolve(robot);
  }

  /**
   * Retourne les infos d'un robot&
   * @param {Robot} robot
   * @returns {Promise<any>}
   */
  getRobotInfo(robot:Robot):Promise<any> {
    return this.http.get(`http://${robot.host}/robot`)
      .toPromise()
      .then((response:Response) => {
        return response.json();
      });
  }

  /**
   * Retourne les servos d'un robot
   * @param {Robot} robot
   * @returns {Promise<Servo[]>}
   */
  getRobotServos(robot:Robot):Promise<Servo[]> {
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
}
