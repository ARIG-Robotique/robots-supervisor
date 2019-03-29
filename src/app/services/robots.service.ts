import {Injectable} from '@angular/core';
import {Robot} from '../models/Robot';
import {environment as env} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {httpurl} from "../constants/httpurl.constants";
import {Observable} from "rxjs";


@Injectable()
export class RobotsService {

  private robots: Robot[];

  constructor(private http: HttpClient) {
  }

  echo(name: string) {
    return this.http.get(`${env.server}/echo/${name}`);
  }

  /**
   * Retourne un robot
   * @param {string} id
   * @returns {Promise<Robot>}
   */
  getRobot(id: number): Promise<Robot> {
    return Promise.resolve(this.robots.find((robot: Robot) => robot.id === id));
  }

  /**
   * Retourne tous les robots
   * @returns {Promise<Robot[]>}
   */
  getRobots(): Observable<Robot[]> {
    return this.http.get<Robot[]>(httpurl.robot);
  }

  /**
   * Ajoute un robot
   * @param {Robot} robot
   * @returns {Promise<Robot>}
   */
  addRobot(robot: Robot): Observable<Robot> {
    const url = httpurl.robot;
    return this.http.post<Robot>(url, robot);
  }

  /**
   * Modifier un robot
   * @param robot
   */
  modifyRobot(robot: Robot): Observable<Robot> {
    const url = httpurl.robotAction.replace(':id', robot.id.toString());
    return this.http.put<Robot>(url, robot);
  }

  deleteRobot(robotId: number) {
    const url = httpurl.robotAction.replace(':id', robotId.toString());
    return this.http.delete(url);
  }

  /**
   * Retourne les infos d'un robot
   * @param {Robot} robot
   * @returns {Promise<any>}
   */
  getRobotInfo(robot: Robot) {
    return this.http.get(`http://${robot.host}/robot`);
  }

  /**
   * Retourne les informations complètes d'un robot
   * @param robotId
   */
  getRobotFullInfo(robotId: number): Observable<Robot> {
    const url = httpurl.robotFullInfo.replace(':robotId', robotId.toString());
    return this.http.get<Robot>(url);
  }

  deleteRobotExec(execId) {
    const url = httpurl.robotExec.replace(':id', execId);
    return this.http.delete(url);
  }

  copyLogs(robotId: number) {
    const url= httpurl.copyLogs.replace(':id', robotId.toString());
    return this.http.get(url);
  }

  importLogs(robotId: number) {
    const url= httpurl.importLogs.replace(':id', robotId.toString());
    return this.http.get(url);
  }

}
