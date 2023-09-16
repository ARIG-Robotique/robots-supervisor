import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Robot } from '../../models/Robot';

@Injectable()
export class StrategyMockService {
    execute(robot: Robot, uid: string): Observable<void> {
        console.log(`Execution action ${uid}`);
        return of(null);
    }
}
