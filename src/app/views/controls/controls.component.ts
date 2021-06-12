import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Mouvements } from 'app/constants/mouvements.constants';
import { BehaviorSubject, combineLatest, Observable, of, timer } from 'rxjs';
import { catchError, filter, map, shareReplay, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { AbstractComponent } from '../../components/abstract.component';
import { Capteurs } from '../../models/Capteurs';
import { Exec } from '../../models/Exec';
import { Robot } from '../../models/Robot';
import { RobotInfo } from '../../models/RobotInfo';
import { Servos } from '../../models/Servo';
import { CapteursService } from '../../services/capteurs.service';
import { RobotsUiService } from '../../services/robots-ui.service';
import { RobotsService } from '../../services/robots.service';
import { ServosService } from '../../services/servos.service';
import { selectMainRobot } from '../../store/robots.selector';

@Component({
  templateUrl: './controls.component.html',
  styleUrls  : ['./controls.component.scss'],
  host       : {
    class: 'd-block container-fluid mt-3',
  },
})
export class ControlsComponent extends AbstractComponent implements OnInit {

  robot$: Observable<Robot>;
  robotInfo$: Observable<RobotInfo>;
  servos$: Observable<Servos>;
  capteurs$: Observable<Capteurs>;
  execs$: Observable<Exec[]>;

  Mouvements = Mouvements;

  refreshServos$ = new BehaviorSubject<void>(null);

  trackById = (item: any) => item.id;

  constructor(private store: Store<any>,
              private robotsService: RobotsService,
              private robotsUiService: RobotsUiService,
              private servosService: ServosService,
              private capteursService: CapteursService) {
    super();
  }

  ngOnInit(): void {
    this.robot$ = this.store.select(selectMainRobot);

    this.robotInfo$ = this.robot$
      .pipe(
        filter(robot => !!robot),
        switchMap(robot => this.robotsService.getRobotInfo(robot)),
        catchError(() => of({
          id     : null,
          nom    : 'Erreur',
          version: 'Unknown',
        })),
        takeUntil(this.ngDestroy$)
      );

    this.servos$ = combineLatest([
      this.refreshServos$,
      this.robot$
    ])
      .pipe(
        switchMap(([, robot]) => this.servosService.getServos(robot)),
        catchError(() => of(null)),
        takeUntil(this.ngDestroy$)
      );

    this.capteurs$ = timer(0, 1000)
      .pipe(
        withLatestFrom(this.robot$),
        switchMap(([, robot]) => this.capteursService.getCapteurs(robot)),
        shareReplay(1),
        catchError(() => of(null)),
        takeUntil(this.ngDestroy$)
      );

    this.execs$ = this.robot$
      .pipe(
        switchMap(robot => this.robotsService.getRobotExecs(robot.id)),
        map(execs => execs.reverse().slice(0, 5)),
        takeUntil(this.ngDestroy$)
      );
  }

  showPaths(robot: Robot, exec: Exec) {
    this.robotsUiService.showPaths(robot.id, exec);
  }

  showLogs(robot: Robot, exec: Exec) {
    this.robotsUiService.showLogs(robot.id, exec);
  }

  setTirette(robot: Robot, present: boolean) {
    this.capteursService.setTirette(robot, present)
      .subscribe();
  }

  setAu(robot: Robot, present: boolean) {
    this.capteursService.setAu(robot, present)
      .subscribe();
  }

  importLogs(robot: Robot) {
    this.robotsUiService.importLogs(robot);
  }

}
