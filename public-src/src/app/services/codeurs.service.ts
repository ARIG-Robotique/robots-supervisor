import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Robot} from '../models/Robot';

@Injectable()
export class CodeursService {

  constructor(private http: Http) {
  }

  /**
   * Retourne les infos des codeurs
   * @param {Robot} robot
   * @returns {Promise<any>}
   */
  getCodeurs(robot: Robot): Promise<any> {
    return this.http.get(`http://${robot.host}/codeurs`)
      .toPromise()
      .then((response: Response) => response.json());
  }

}