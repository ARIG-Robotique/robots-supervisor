import {Injectable} from '@angular/core';
import {Http, URLSearchParams, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Robot} from '../models/Robot';
import {RobotPosition} from '../models/RobotPosition';

@Injectable()
export class MouvementsService {

  constructor(private http: Http) {
  }

  /**
   * Envoie une commande de mouvement
   * @param {Robot} robot
   * @param {string} type
   * @param {object.<string, number>} values
   * @returns {Promise}
   */
  sendMouvement(robot: Robot, type: string, values: any): Promise<boolean> {
    const search = new URLSearchParams();
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        search.set(key, values[key]);
      }
    }

    return this.http.post(`http://${robot.host}/mouvement/${type}`, {}, {search})
      .toPromise()
      .then(() => true);
  }

  /**
   * Retourne la position du robot
   * @param {Robot} robot
   * @returns {Promise<Position>}
   */
  getPosition(robot: Robot): Promise<RobotPosition> {
    return this.http.get(`http://${robot.host}/mouvement`)
      .toPromise()
      .then((response: Response) => response.json());
  }

}