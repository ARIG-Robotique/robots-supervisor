import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Robot } from '../../models/Robot';
import { IOService } from '../io.service';

@Injectable()
export class IOMockService extends IOService {
    constructor(http: HttpClient) {
        super(http);
    }

    /**
     * Change l'état d'une pompe
     */
    setPumpState(robot: Robot, pump: 'haut' | 'bas', state: boolean): Observable<void> {
        return of(null);
    }
}
