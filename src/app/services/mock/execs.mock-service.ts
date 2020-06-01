import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Log } from '../../models/Log';
import { ExecsService } from '../execs.service';

@Injectable()
export class ExecsMockService extends ExecsService {

  deleteExec(idRobot: number, idExec: string): Observable<unknown> {
    return of(null)
  }

  getLogs(idRobot: number, idExec: string): Observable<Log[]> {
    return of([
      {
        id     : 1,
        idExec,
        date   : '2020-04-05 12:55:18.417' as any,
        level  : 'INFO',
        thread : 'main',
        clazz  : 'org.arig.robot.config.spring.NerellSimulator',
        message: `Starting NerellSimulator on SGLK-HF48JM2.sglk.local with PID 21171 (/var/arig/workspaces/java/robots/nerell-parent/nerell-simulator/build/classes/java/main started by damiensorel@sglk.local in /var/arig/workspaces/java/robots/nerell-parent/nerell-simulator)`,
      },
      {
        id     : 2,
        idExec,
        date   : '2020-04-05 12:55:18.418' as any,
        level  : 'INFO',
        thread : 'main',
        clazz  : 'org.arig.robot.system.LidarService',
        message: `Initialisation du service d'évittement d'obstacle`,
      },
      {
        id     : 3,
        idExec,
        date   : '2020-04-05 12:56:02.759' as any,
        level  : 'WARN',
        thread : 'pool-2-thread-20',
        clazz  : 'org.arig.robot.system.pathfinding.impl.MultiPathFinderImpl',
        message: `Impossible de trouver le noeud de départ, tentative de trouver un autre point proche`,
      },
      {
        id     : 4,
        idExec,
        date   : '2020-04-05 12:57:52.880' as any,
        level  : 'INFO',
        thread : 'main',
        clazz  : 'org.arig.robot.services.EcranService',
        message: `FIN`,
      },
      {
        id     : 5,
        idExec,
        date   : '2020-04-05 12:57:54.698' as any,
        level  : 'ERROR',
        thread : 'pool-2-thread-8',
        clazz  : 'org.arig.robot.system.TrajectoryManager',
        message: `Problème dans l'attente d'atteinte du point : java.lang.InterruptedException: sleep interrupted`,
      },
    ]);
  }

  getPaths(idRobot: number, idExec: string): Observable<string[]> {
    return of([])
  }

}
