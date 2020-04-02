import {Injectable} from '@angular/core';
import {Robot} from '../models/Robot';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Pid} from 'app/models/Pid';

@Injectable()
export class AsservissementService {

  constructor(private http: HttpClient) {
  }

  /**
   * Retourne les servos d'un robot
   */
  getPid(robot: Robot, type: string): Observable<Pid> {
    return this.http.get<Pid>(`http://${robot.host}/asservissement/pid/${type}`);
  }

  /**
   * Envoie une commande déplacement de servo
   */
  setPid(robot: Robot, type: string, pid: Pid): Observable<unknown> {
    return this.http.post(`http://${robot.host}/asservissement/pid/${type}`, {}, {params: pid as any});
  }

}
