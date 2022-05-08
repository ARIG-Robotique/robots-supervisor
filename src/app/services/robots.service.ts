import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { httpurl } from '../constants/httpurl.constants';
import { Exec } from '../models/Exec';
import { Robot } from '../models/Robot';
import { RobotInfo } from '../models/RobotInfo';
import { buildUrl } from '../utils/buildUrl';

@Injectable()
export class RobotsService {

  constructor(private http: HttpClient) {
  }

  getRobot(idRobot: number): Observable<Robot> {
    const url = buildUrl(httpurl.robotAction, { idRobot });
    return this.http.get<Robot>(url);
  }

  getRobots(): Observable<Robot[]> {
    const url = buildUrl(httpurl.robot);
    return this.http.get<Robot[]>(url)
      .pipe(
        map(robots => robots.sort((a, b) => {
          if (a.simulateur === b.simulateur) {
            return a.name.localeCompare(b.name);
          } else {
            return a.simulateur ? 1 : -1;
          }
        }))
      );
  }

  getRobotInfo(robot: Robot): Observable<RobotInfo> {
    return this.http.get<RobotInfo>(`http://${robot.host}/robot`)
      .pipe(
        map(infos => ({ ...infos, id: robot.id }))
      );
  }

  getRobotExecs(idRobot: number): Observable<Exec[]> {
    const url = buildUrl(httpurl.robotExecs, { idRobot });
    return this.http.get<Exec[]>(url);
  }

  copyLogs(idRobot: number): Observable<unknown> {
    const url = buildUrl(httpurl.copyLogs, { idRobot });
    return this.http.get(url);
  }

  importLogs(idRobot: number): Observable<unknown> {
    const url = buildUrl(httpurl.importLogs, { idRobot });
    return this.http.get(url);
  }

}
