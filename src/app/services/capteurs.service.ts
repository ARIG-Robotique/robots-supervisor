import {Injectable} from "@angular/core";
import {Http, URLSearchParams, Response} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {Robot} from "../models/Robot";
import {RobotPosition} from "../models/RobotPosition";

@Injectable()
export class CapteursService {

  constructor(private http:Http) {
  }

  /**
   * Retourne les infos des capteurs
   * @param {Robot} robot
   * @returns {Promise<any>}
   */
  getCapteurs(robot:Robot):Promise<any> {
    return this.http.get(`http://${robot.host}/capteurs`)
      .toPromise()
      .then((response:Response) => response.json());
  }

}
