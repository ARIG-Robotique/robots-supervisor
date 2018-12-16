import {Injectable} from '@angular/core';
import {Robot} from '../models/Robot';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable()
export class MouvementsService {

  constructor(private http: HttpClient) {
  }

  /**
   * Envoie une commande de mouvement
   * @param {Robot} robot
   * @param {string} type
   * @param {object.<string, number>} values
   * @returns {Promise}
   */
  sendMouvement(robot: Robot, type: string, values: any) {
    let search = new HttpParams();
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        search = search.set(key, values[key]);
      }
    }

    return this.http.post(`http://${robot.host}/mouvement/${type}`, {}, {params: search});
  }

  /**
   * Retourne la position du robot
   * @param {Robot} robot
   * @returns {Promise<Position>}
   */
  getPosition(robot: Robot) {
    return this.http.get(`http://${robot.host}/mouvement`);
  }

}
