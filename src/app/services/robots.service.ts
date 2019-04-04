import {Injectable} from '@angular/core';
import {Robot} from '../models/Robot';
import {environment, environment as env} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {httpurl} from "../constants/httpurl.constants";
import {BehaviorSubject, Observable} from "rxjs";


@Injectable()
export class RobotsService {

  private dataStore : {
    robots: Robot[],
    selectedRobots: Robot[]
  };

  private robotBehavior: BehaviorSubject<Robot[]>;
  private selectedRobotBehavior: BehaviorSubject<Robot[]>;

  constructor(private http: HttpClient) {
    this.dataStore = {
      robots: [],
      selectedRobots: []
    };

    this.robotBehavior = new BehaviorSubject<Robot[]>(null);
    this.selectedRobotBehavior = new BehaviorSubject<Robot[]>(null);
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
    return null;
    // return Promise.resolve(this.robots.find((robot: Robot) => robot.id === id));
  }

  /**
   * Retourne tous les robots
   * @returns {Promise<Robot[]>}
   */
  getRobots(): void {
    this.http.get<Robot[]>(this.completetUrl(httpurl.robot))
      .subscribe((robots: Robot[]) => {
        this.dataStore.robots = robots;
        this.robotBehavior.next(this.dataStore.robots);
      });
  }

  getRobotObservable(): Observable<Robot[]> {
    return this.robotBehavior.asObservable();
  }

  /**
   * Ajoute un robot
   * @param {Robot} robot
   * @returns {Promise<Robot>}
   */
  addRobot(robot: Robot): Observable<Robot> {
    const url = this.completetUrl(httpurl.robot);
    return this.http.post<Robot>(url, robot);
  }

  /**
   * Modifier un robot
   * @param robot
   */
  modifyRobot(robot: Robot): Observable<Robot> {
    const url = this.completetUrl(httpurl.robotAction.replace(':id', robot.id.toString()));
    return this.http.put<Robot>(url, robot);
  }

  deleteRobot(robotId: number) {
    const url = this.completetUrl(httpurl.robotAction.replace(':id', robotId.toString()));
    return this.http.delete(url);
  }

  /**
   * Retourne les infos d'un robot
   * @param {Robot} robot
   * @returns {Promise<any>}
   */
  getRobotInfo(robot: Robot): Observable<any> {
    return this.http.get(`http://${robot.host}/robot`);
  }

  /**
   * Retourne les informations complètes d'un robot
   * @param robotId
   */
  getRobotFullInfo(robotId: number): Observable<Robot> {
    const url = this.completetUrl(httpurl.robotFullInfo.replace(':robotId', robotId.toString()));
    return this.http.get<Robot>(url);
  }

  deleteRobotExec(execId) {
    const url = this.completetUrl(httpurl.robotExec.replace(':id', execId));
    return this.http.delete(url);
  }

  copyLogs(robotId: number) {
    const url= this.completetUrl(httpurl.copyLogs.replace(':id', robotId.toString()));
    return this.http.get(url);
  }

  importLogs(robotId: number) {
    const url= this.completetUrl(httpurl.importLogs.replace(':id', robotId.toString()));
    return this.http.get(url);
  }

  notifySelectedRobot(robots: Robot[]) {
    this.selectedRobotBehavior.next(robots);
  }

  getNotifySelectedRobotObservable(): Observable<Robot[]> {
    return this.selectedRobotBehavior.asObservable();
  }

  private completetUrl(req: string) {
    return environment.server + req;
  }
}
