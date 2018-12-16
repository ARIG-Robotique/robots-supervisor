import {Injectable} from '@angular/core';

import {Robot} from '../models/Robot';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CapteursService {

  constructor(private http: HttpClient) {
  }

  /**
   * Retourne les infos des capteurs
   * @param {Robot} robot
   * @returns {Promise<any>}
   */
  getCapteurs(robot: Robot) {
    return this.http.get(`http://${robot.host}/capteurs`);
  }

  /**
   * Enlève ou met la tirette
   * @param {Robot} robot
   * @param {boolean} present
   * @returns {Promise<boolean>}
   */
  setTirette(robot: Robot, present: boolean) {
    return this.http.post(`http://${robot.host}/capteurs/tirette`, present);
  }

  /**
   * Changement de team
   * @param {Robot} robot
   * @param {string} team
   * @returns {Promise<string>}
   */
  setTeam(robot: Robot, team: string) {
    const value = team === 'JAUNE';
    return this.http.post(`http://${robot.host}/capteurs/team`, value);
  }

  /**
   * Enlève ou met l'AU
   * @param {Robot} robot
   * @param {boolean} present
   * @returns {Promise<boolean>}
   */
  setAu(robot: Robot, present: boolean) {
    return this.http.post(`http://${robot.host}/capteurs/au`, present);
  }

}
