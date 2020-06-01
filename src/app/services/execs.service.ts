import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpurl } from '../constants/httpurl.constants';
import { Log } from '../models/Log';
import { buildUrl } from '../utils/buildUrl';

@Injectable()
export class ExecsService {

  constructor(private http: HttpClient) {
  }

  deleteExec(idRobot: number, idExec: string): Observable<unknown> {
    const url = buildUrl(httpurl.exec, {idRobot, idExec});
    return this.http.delete(url);
  }

  getLogs(idRobot: number, idExec: string): Observable<Log[]> {
    const url = buildUrl(httpurl.execLogs, {idRobot, idExec});
    return this.http.get<Log[]>(url);
  }

  getPaths(idRobot: number, idExec: string): Observable<string[]> {
    const url = buildUrl(httpurl.execPaths, {idRobot, idExec});
    return this.http.get<string[]>(url);
  }

  getPathFile(idRobot: number, idExec: string, file: string): string {
    return buildUrl(httpurl.execPathFile, {idRobot, idExec, file});
  }

}
