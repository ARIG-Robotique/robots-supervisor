import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Exec } from '../../models/Exec';
import { Robot } from '../../models/Robot';
import { RobotInfo } from '../../models/RobotInfo';
import { RobotsService } from '../robots.service';

const MOCK_ROBOT: Robot = {
  id        : 1,
  host      : '127.0.0.1',
  name      : 'Mock',
  dir       : '',
  simulateur: true,
  login     : null,
  pwd       : null,
};

const MOCK_ROBOT_INFO: RobotInfo = {
  id     : 1,
  nom    : 'Mock',
  version: 'BUILD-SNAPSHOT',
};

@Injectable()
export class RobotsMockService extends RobotsService {

  getRobot(idRobot: number): Observable<Robot> {
    return of(MOCK_ROBOT);
  }

  getRobots(): Observable<Robot[]> {
    return of([MOCK_ROBOT]);
  }

  addRobot(robot: Robot): Observable<Robot> {
    return of(robot);
  }

  editRobot(robot: Robot): Observable<Robot> {
    return of(robot);
  }

  deleteRobot(idRobot: number): Observable<unknown> {
    return of(null);
  }

  getRobotInfo(robot: Robot): Observable<RobotInfo> {
    return of(MOCK_ROBOT_INFO);
  }

  getRobotExecs(idRobot: number): Observable<Exec[]> {
    return of([
      {
        id       : '1234',
        idRobot,
        dateStart: new Date(),
        dateEnd  : new Date(new Date().getTime() + 100000),
      },
    ]);
  }

  copyLogs(idRobot: number): Observable<unknown> {
    return of(null);
  }

  importLogs(idRobot: number): Observable<unknown> {
    return of(null);
  }

}
