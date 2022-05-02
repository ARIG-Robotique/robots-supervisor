import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Exec } from '../../models/Exec';
import { Robot } from '../../models/Robot';
import { RobotInfo } from '../../models/RobotInfo';
import { RobotsService } from '../robots.service';

const MOCK_ROBOTS: { [id: string]: Robot } = {
  1: {
    id        : 1,
    host      : 'localhost:8080',
    name      : 'Nerell',
    simulateur: true,
  },
  2: {
    id        : 2,
    host      : 'localhost:8081',
    name      : 'Odin',
    simulateur: true,
  },
};

const MOCK_ROBOTS_INFO: { [id: string]: RobotInfo } = {
  1: {
    id     : 1,
    nom    : 'Nerell Mock',
    version: 'BUILD-SNAPSHOT',
  },
  2: {
    id     : 2,
    nom    : 'Odin Mock',
    version: 'BUILD-SNAPSHOT',
  },
};

@Injectable()
export class RobotsMockService extends RobotsService {

  getRobot(idRobot: number): Observable<Robot> {
    return of(MOCK_ROBOTS[idRobot]);
  }

  getRobots(): Observable<Robot[]> {
    return of(Object.values(MOCK_ROBOTS));
  }

  getRobotInfo(robot: Robot): Observable<RobotInfo> {
    return of(MOCK_ROBOTS_INFO[robot.id]);
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
