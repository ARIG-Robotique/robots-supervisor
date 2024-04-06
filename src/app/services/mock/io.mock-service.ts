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
     * Change l'état des electro aimants
     */
    setElectroAimant(robot: Robot, state: 'on' | 'off'): Observable<void> {
        return of(null);
    }

    /**
     * Change l'état de la roue
     */
    setSolarWheel(robot: Robot, state: 'bleu' | 'jaune' | 'off', speed: number = 512): Observable<void> {
        return of(null);
    }
}
