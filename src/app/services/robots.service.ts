import {Injectable} from '@angular/core';
import {Robot} from '../models/Robot';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {httpurl} from '../constants/httpurl.constants';
import {Observable} from 'rxjs';
import {RobotInfo} from '../models/RobotInfo';
import {Exec} from '../models/Exec';
import {map} from 'rxjs/operators';

@Injectable()
export class RobotsService {

  constructor(private http: HttpClient) {
  }

  getRobot(idRobot: number): Observable<Robot> {
    const url = this.completetUrl(httpurl.robotAction.replace(':id', idRobot.toString()));
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

  deleteRobot(idRobot: number): Observable<unknown> {
    const url = this.completetUrl(httpurl.robotAction.replace(':id', idRobot.toString()));
    return this.http.delete(url);
  }

  getRobotInfo(robot: Robot): Observable<RobotInfo> {
    return this.http.get<RobotInfo>(`http://${robot.host}/robot`)
      .pipe(
        map(infos => ({...infos, id: robot.id}))
      );
  }

  getRobotExecs(idRobot: number): Observable<Exec[]> {
    const url = this.completetUrl(httpurl.robotExecs.replace(':id', idRobot.toString()));
    return this.http.get<Exec[]>(url);
  }

  deleteRobotExec(idExec: string): Observable<unknown> {
    const url = this.completetUrl(httpurl.exec.replace(':id', idExec));
    return this.http.delete(url);
  }

  copyLogs(idRobot: number): Observable<unknown> {
    const url = this.completetUrl(httpurl.copyLogs.replace(':id', idRobot.toString()));
    return this.http.get(url);
  }

  importLogs(idRobot: number): Observable<unknown> {
    const url = this.completetUrl(httpurl.importLogs.replace(':id', idRobot.toString()));
    return this.http.get(url);
  }

  private completetUrl(req: string) {
    return environment.server + req;
  }
}
