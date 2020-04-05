import {Injectable} from '@angular/core';
import {Robot} from '../models/Robot';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Asserv} from 'app/models/Asserv';

@Injectable()
export class AsservissementService {

  constructor(private http: HttpClient) {
  }

  /**
   * Retourne les valeurs d'asservissement
   */
  getValues(robot: Robot, type: string): Observable<Asserv> {
    return this.http.get<Asserv>(`http://${robot.host}/asservissement/${type}`);
  }

  /**
   * Change les valeurs d'asservissement
   */
  setValues(robot: Robot, type: string, values: Asserv): Observable<unknown> {
    return this.http.post(`http://${robot.host}/asservissement/${type}`, {}, {params: values as any});
  }

}
