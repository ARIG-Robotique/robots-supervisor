import {Injectable} from '@angular/core';
import {Robot} from '../models/Robot';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {httpurl} from '../constants/httpurl.constants';
import {Observable} from 'rxjs';
import {RobotInfo} from '../models/RobotInfo';
import {Execs} from '../models/Execs';

@Injectable()
export class RobotsService {

  constructor(private http: HttpClient) {
  }

  getRobot(robotId: number): Observable<Robot> {
    const url = this.completetUrl(httpurl.robotAction.replace(':id', robotId.toString()));
    return this.http.get<Robot>(url);
  }

  getRobots(): Observable<Robot[]> {
    const url = this.completetUrl(httpurl.robot);
    return this.http.get<Robot[]>(url);
  }

  addRobot(robot: Robot): Observable<Robot> {
    const url = this.completetUrl(httpurl.robot);
    return this.http.post<Robot>(url, robot);
  }

  editRobot(robot: Robot): Observable<Robot> {
    const url = this.completetUrl(httpurl.robotAction.replace(':id', robot.id.toString()));
    return this.http.put<Robot>(url, robot);
  }

  deleteRobot(robotId: number): Observable<unknown> {
    const url = this.completetUrl(httpurl.robotAction.replace(':id', robotId.toString()));
    return this.http.delete(url);
  }

  getRobotInfo(robot: Robot): Observable<RobotInfo> {
    return this.http.get<RobotInfo>(`http://${robot.host}/robot`);
  }

  getRobotExecs(robotId: number): Observable<Execs[]> {
    const url = this.completetUrl(httpurl.robotExecs.replace(':robotId', robotId.toString()));
    return this.http.get<Execs[]>(url);
  }

  deleteRobotExec(execId): Observable<unknown> {
    const url = this.completetUrl(httpurl.exec.replace(':id', execId));
    return this.http.delete(url);
  }

  copyLogs(robotId: number): Observable<unknown> {
    const url = this.completetUrl(httpurl.copyLogs.replace(':id', robotId.toString()));
    return this.http.get(url);
  }

  importLogs(robotId: number): Observable<unknown> {
    const url = this.completetUrl(httpurl.importLogs.replace(':id', robotId.toString()));
    return this.http.get(url);
  }

  private completetUrl(req: string) {
    return environment.server + req;
  }
}
