import {Injectable} from '@angular/core';
import {Robot} from '../models/Robot';
import {HttpClient} from '@angular/common/http';
import {httpurl} from '../constants/httpurl.constants';
import {Observable} from 'rxjs';
import {RobotInfo} from '../models/RobotInfo';
import {Exec} from '../models/Exec';
import {map} from 'rxjs/operators';
import {buildUrl} from '../utils/buildUrl';

@Injectable()
export class RobotsService {

  constructor(private http: HttpClient) {
  }

  getRobot(idRobot: number): Observable<Robot> {
    const url = buildUrl(httpurl.robotAction, {idRobot});
    return this.http.get<Robot>(url);
  }

  getRobots(): Observable<Robot[]> {
    const url = buildUrl(httpurl.robot);
    return this.http.get<Robot[]>(url);
  }

  getRobotInfo(robot: Robot): Observable<RobotInfo> {
    return this.http.get<RobotInfo>(`http://${robot.host}/robot`)
      .pipe(
        map(infos => ({...infos, id: robot.id}))
      );
  }

  getRobotExecs(idRobot: number): Observable<Exec[]> {
    const url = buildUrl(httpurl.robotExecs, {idRobot});
    return this.http.get<Exec[]>(url);
  }

  copyLogs(idRobot: number): Observable<unknown> {
    const url = buildUrl(httpurl.copyLogs, {idRobot});
    return this.http.get(url);
  }

  importLogs(idRobot: number): Observable<unknown> {
    const url = buildUrl(httpurl.importLogs, {idRobot});
    return this.http.get(url);
  }

}
