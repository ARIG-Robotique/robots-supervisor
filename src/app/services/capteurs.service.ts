import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Robot} from '../models/Robot';

@Injectable()
export class CapteursService {

  constructor(private http: Http) {
  }

  /**
   * Retourne les infos des capteurs
   * @param {Robot} robot
   * @returns {Promise<any>}
   */
  getCapteurs(robot: Robot): Promise<any> {
    return this.http.get(`http://${robot.host}/capteurs`)
      .toPromise()
      .then((response: Response) => response.json());
  }

  /**
   * Enlève ou met la tirette
   * @param {Robot} robot
   * @param {boolean} present
   * @returns {Promise<boolean>}
   */
  setTirette(robot: Robot, present: boolean): Promise<boolean> {
    return this.http.post(`http://${robot.host}/capteurs/tirette`, present, {
      headers: new Headers({'Content-Type': 'application/json'})
    })
      .toPromise()
      .then(() => present);
  }

  /**
   * Changement de team
   * @param {Robot} robot
   * @param {string} team
   * @returns {Promise<string>}
   */
  setTeam(robot: Robot, team: string): Promise<string> {
    let value = team === 'JAUNE';
    return this.http.post(`http://${robot.host}/capteurs/team`, value, {
      headers: new Headers({'Content-Type': 'application/json'})
    })
      .toPromise()
      .then(() => team);
  }

  /**
   * Enlève ou met l'AU
   * @param {Rovbot} robot
   * @param {boolean} present
   * @returns {Promise<boolean>}
   */
  setAu(robot: Robot, present: boolean): Promise<boolean> {
    return this.http.post(`http://${robot.host}/capteurs/au`, present, {
      headers: new Headers({'Content-Type': 'application/json'})
    })
      .toPromise()
      .then(() => present);
  }

}
