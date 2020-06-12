import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mouvements } from 'app/constants/mouvements.constants';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { catchError, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { AbstractComponent } from '../../components/abstract.component';
import { Capteurs } from '../../models/Capteurs';
import { Exec } from '../../models/Exec';
import { Robot } from '../../models/Robot';
import { Servos } from '../../models/Servo';
import { CapteursService } from '../../services/capteurs.service';
import { RobotsUiService } from '../../services/robots-ui.service';
import { RobotsService } from '../../services/robots.service';
import { ServosService } from '../../services/servos.service';

@Component({
  templateUrl: './controls.component.html',
  styleUrls  : ['./controls.component.scss'],
  host       : {
    class: 'd-block container-fluid mt-3',
  },
})
export class ControlsComponent extends AbstractComponent implements OnInit {

  robot: Robot;
  servos$: Observable<Servos>;
  capteurs$: Observable<Capteurs>;
  execs$: Observable<Exec[]>;

  Mouvements = Mouvements;

  refreshServos$ = new BehaviorSubject<void>(null);

  trackById = (item: any) => item.id;

  constructor(private route: ActivatedRoute,
              private robotsService: RobotsService,
              private robotsUiService: RobotsUiService,
              private servosService: ServosService,
              private capteursService: CapteursService) {
    super();
    this.robot = this.route.snapshot.data['robot'];
  }

  ngOnInit(): void {
    this.servos$ = this.refreshServos$
      .pipe(
        switchMap(() => this.servosService.getServos(this.robot)),
        catchError(() => of(null))
      );

    this.capteurs$ = timer(0, 1000)
      .pipe(
        takeUntil(this.ngDestroy$),
        switchMap(() => this.capteursService.getCapteurs(this.robot)),
        shareReplay(1),
        catchError(() => of(null))
      );

    this.execs$ = this.robotsService.getRobotExecs(this.robot.id)
      .pipe(
        map(execs => execs.reverse().slice(0, 5))
      );
  }

  showPaths(exec: Exec) {
    this.robotsUiService.showPaths(this.robot.id, exec);
  }

  showLogs(exec: Exec) {
    this.robotsUiService.showLogs(this.robot.id, exec);
  }

  setTirette(present: boolean) {
    this.capteursService.setTirette(this.robot, present)
      .subscribe();
  }

  setAu(present: boolean) {
    this.capteursService.setAu(this.robot, present)
      .subscribe();
  }

}
