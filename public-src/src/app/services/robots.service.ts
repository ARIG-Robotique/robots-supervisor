import {Injectable} from "@angular/core";
import {Robot} from "../models/Robot";
import {Http, Response} from "@angular/http";
import {environment as env} from "./../../environments/environment";
import "rxjs/add/operator/toPromise";

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

  echo(name:string):Promise<string> {
    return this.http.get(`${env.server}/echo/${name}`)
      .toPromise()
      .then((response:Response) => response.text());
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
   * Retourne les infos d'un robot
   * @param {Robot} robot
   * @returns {Promise<any>}
   */
  getRobotInfo(robot:Robot):Promise<any> {
    return this.http.get(`http://${robot.host}/robot`)
      .toPromise()
      .then((response:Response) => response.json());
  }

}
