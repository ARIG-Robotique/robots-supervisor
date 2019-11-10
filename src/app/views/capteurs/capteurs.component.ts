import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CapteursService} from '../../services/capteurs.service';
import {BehaviorSubject, timer} from 'rxjs';
import {RobotTabComponent} from '../robot/robotTab.component';
import {Capteurs} from '../../models/Capteurs';
import {switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector   : 'app-robot-capteur',
  templateUrl: './capteurs.component.html',
  styleUrls  : ['./capteurs.component.scss']
})
export class CapteursComponent extends RobotTabComponent implements OnInit {

  capteurs$ = new BehaviorSubject<Capteurs>(null);

  constructor(route: ActivatedRoute,
              private capteursService: CapteursService) {
    super(route);
  }

  ngOnInit() {
    timer(0, 1000)
      .pipe(
        takeUntil(this.ngDestroy$),
        switchMap(() => this.capteursService.getCapteurs(this.robot))
      )
      .subscribe({
        next : capteurs => this.capteurs$.next(capteurs),
        error: () => this.capteurs$.next(null),
      });
  }

  setTirette(present: boolean) {
    this.capteursService.setTirette(this.robot, present)
      .subscribe((result) => {
        this.capteurs$.next({
          ...this.capteurs$.value,
          numerique: {
            ...this.capteurs$.value.numerique,
            Tirette: present,
          }
        });
      });
  }

  setTeam(team: string) {
    this.capteursService.setTeam(this.robot, team)
      .subscribe((result) => {
        this.capteurs$.next({
          ...this.capteurs$.value,
          text: {
            ...this.capteurs$.value.text,
            Equipe: team,
          }
        });
      });
  }

  setAu(present: boolean) {
    this.capteursService.setAu(this.robot, present)
      .subscribe((result) => {
        this.capteurs$.next({
          ...this.capteurs$.value,
          numerique: {
            ...this.capteurs$.value.numerique,
            AU: present,
          }
        });
      });
  }

}
