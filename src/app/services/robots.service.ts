import {Injectable} from '@angular/core';
import {Robot} from '../models/Robot';
import {environment as env} from '../../environments/environment';
import {HttpClient} from "@angular/common/http";


@Injectable()
export class RobotsService {

  private robots: Robot[];

  constructor(private http: HttpClient) {
    const robots = localStorage.getItem('robots');
    if (robots) {
      this.robots = JSON.parse(robots);
    } else {
      this.robots = [];
    }
  }

  echo(name: string) {
    return this.http.get(`${env.server}/echo/${name}`);
  }

  /**
   * Retourne un robot
   * @param {string} id
   * @returns {Promise<Robot>}
   */
  getRobot(id: any): Promise<Robot> {
    return Promise.resolve(this.robots.find((robot: Robot) => robot.id === id));
  }

  /**
   * Retourne tous les robots
   * @returns {Promise<Robot[]>}
   */
  getRobots(): Promise<Robot[]> {
    return Promise.resolve(this.robots);
  }

  /**
   * Ajoute un robot
   * @param {Robot} robot
   * @returns {Promise<Robot>}
   */
  addRobot(robot: Robot): Promise<Robot> {
    this.robots.push(robot);
    localStorage.setItem('robots', JSON.stringify(this.robots));

    return Promise.resolve(robot);
  }

  /**
   * Supprime un robot
   * @param {Robot} robot
   * @returns {Promise<void>}
   */
  deleteRobot(robot: Robot): Promise<void> {
    for (let i = 0; i < this.robots.length; i++) {
      if (this.robots[i].id === robot.id) {
        this.robots.splice(i, 1);
        break;
      }
    }

    localStorage.setItem('robots', JSON.stringify(this.robots));

    return Promise.resolve();
  }

  /**
   * Retourne les infos d'un robot
   * @param {Robot} robot
   * @returns {Promise<any>}
   */
  getRobotInfo(robot: Robot){
    return this.http.get(`http://${robot.host}/robot`);
  }

}
