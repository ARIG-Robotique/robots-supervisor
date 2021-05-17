import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { interval, merge, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { RobotsService } from '../services/robots.service';
import { loadRobots, setRobotStatus } from './robots.actions';
import { selectRobots } from './robots.selector';

@Injectable()
export class RobotsEffects {

  updateRobotsStatus$ = createEffect(() =>
    merge(
      interval(5000),
      this.actions$.pipe(ofType(loadRobots.type))
    )
      .pipe(
        withLatestFrom(this.store.select(selectRobots)),
        switchMap(([, robots]) => {
          return merge(...robots.map(r => {
            return this.robotsService.getRobotInfo(r)
              .pipe(
                map((info) => ({ id: r.id, status: !!info.nom })),
                catchError(() => of({ id: r.id, status: false }))
              );
          }));
        }),
        map((status: { id: number, status: boolean }) => setRobotStatus(status))
      )
  );

  constructor(private actions$: Actions,
              private store: Store<any>,
              private robotsService: RobotsService) {

  }

}
