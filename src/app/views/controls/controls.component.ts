import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ServosService} from '../../services/servos.service';
import {BehaviorSubject, Observable, of, timer} from 'rxjs';
import {catchError, map, shareReplay, switchMap, takeUntil} from 'rxjs/operators';
import {Mouvements} from 'app/constants/mouvements.constants';
import {CapteursService} from '../../services/capteurs.service';
import {Capteurs} from '../../models/Capteurs';
import {Robot} from '../../models/Robot';
import {AbstractComponent} from '../../components/abstract.component';
import {Exec} from '../../models/Exec';
import {RobotsService} from '../../services/robots.service';
import {RobotsUiService} from '../../services/robots-ui.service';
import {Servos} from '../../models/Servo';

@Component({
  templateUrl: './controls.component.html',
  styleUrls  : ['./controls.component.scss']
})
export class ControlsComponent extends AbstractComponent implements OnInit {

  robot: Robot;
  servos$: Observable<Servos>;
  capteurs$: Observable<Capteurs>;
  execs$: Observable<Exec[]>;

  Mouvements = Mouvements;

  refreshServos$ = new BehaviorSubject<void>(null);

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
    this.robotsUiService.showPaths(this.robot.id, exec.id);
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
