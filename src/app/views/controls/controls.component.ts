import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ServosService} from '../../services/servos.service';
import {Observable, of, timer} from 'rxjs';
import {ServoGroup} from '../../models/Servo';
import {catchError, map, shareReplay, switchMap, takeUntil} from 'rxjs/operators';
import {ActionneursService} from '../../services/actionneurs.service';
import {ESide} from 'app/models/ESide';
import {EActionneurState} from 'app/models/EActionneurState';
import {Mouvements} from 'app/constants/mouvements.constants';
import {CapteursService} from '../../services/capteurs.service';
import {Capteurs} from '../../models/Capteurs';
import {Robot} from '../../models/Robot';
import {AbstractComponent} from '../../components/abstract.component';
import {Exec} from '../../models/Exec';
import {RobotsService} from '../../services/robots.service';
import {RobotsUiService} from '../../services/robots-ui.service';

@Component({
  templateUrl: './controls.component.html',
  styleUrls  : ['./controls.component.scss']
})
export class ControlsComponent extends AbstractComponent implements OnInit {

  robot: Robot;
  servos$: Observable<ServoGroup[]>;
  capteurs$: Observable<unknown | Capteurs>;
  execs$: Observable<Exec[]>;

  ESide = ESide;
  EActionneurState = EActionneurState;
  Mouvements = Mouvements;

  constructor(private route: ActivatedRoute,
              private robotsService: RobotsService,
              private robotsUiService: RobotsUiService,
              private actionneursService: ActionneursService,
              private servosService: ServosService,
              private capteursService: CapteursService) {
    super();
    this.robot = this.route.snapshot.data['robot'];
  }

  ngOnInit(): void {
    this.servos$ = this.servosService.getServos(this.robot)
      .pipe(
        map(servos => {
          return Object.keys(servos).map(name => ({
            name,
            servos: servos[name],
          }))
        }),
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

  setEv(side: ESide, state: EActionneurState) {
    this.actionneursService.ev(this.robot, side, state)
      .subscribe();
  }

  setPompe(side: ESide, state: EActionneurState) {
    this.actionneursService.pompe(this.robot, side, state)
      .subscribe();
  }

  setTirette(present: boolean) {
    this.capteursService.setTirette(this.robot, present)
      .subscribe();
  }

  setTeam(team: string) {
    this.capteursService.setTeam(this.robot, team)
      .subscribe();
  }

  setAu(present: boolean) {
    this.capteursService.setAu(this.robot, present)
      .subscribe();
  }

}
