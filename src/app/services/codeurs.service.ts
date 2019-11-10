import {Injectable} from '@angular/core';
import {Robot} from '../models/Robot';
import {HttpClient} from '@angular/common/http';
import {Codeurs} from '../models/Codeurs';
import {Observable} from 'rxjs';

@Injectable()
export class CodeursService {

  constructor(private http: HttpClient) {
  }

  /**
   * Retourne les infos des codeurs
   */
  getCodeurs(robot: Robot): Observable<Codeurs> {
    return this.http.get<Codeurs>(`http://${robot.host}/codeurs`);
  }

}
