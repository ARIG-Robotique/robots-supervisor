import {Injectable} from '@angular/core';

import {Robot} from '../models/Robot';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class CodeursService {

  constructor(private http: HttpClient) {
  }

  /**
   * Retourne les infos des codeurs
   * @param {Robot} robot
   * @returns {Promise<any>}
   */
  getCodeurs(robot: Robot) {
    return this.http.get(`http://${robot.host}/codeurs`);
  }

}
