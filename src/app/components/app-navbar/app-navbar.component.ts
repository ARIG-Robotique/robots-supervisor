import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PointsCalculatorModalComponent } from '../../modals/points-calculator-modal/points-calculator-modal.component';
import { Robot } from '../../models/Robot';
import { setMainRobot, toggleRobot } from '../../store/robots.actions';
import { selectRobots, selectRobotsStatusState, selectSelectedRobotsState } from '../../store/robots.selector';
import { AbstractComponent } from '../abstract.component';

@Component({
  selector   : 'arig-app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls  : ['app-navbar.component.scss'],
})
export class AppNavbarComponent extends AbstractComponent implements OnInit {

  robots$: Observable<{ robot: Robot, selected: boolean, main: boolean, online: boolean }[]>;

  trackById = (i, r) => r.robot.id;

  constructor(private store: Store<any>,
              private modal: NgbModal) {
    super();
  }

  ngOnInit() {
    this.robots$ = combineLatest([
      this.store.select(selectRobots),
      this.store.select(selectSelectedRobotsState),
      this.store.select(selectRobotsStatusState),
    ])
      .pipe(
        map(([robots, selected, state]) => {
          return robots.map(robot => ({
            robot,
            selected: !!selected.find(r => r.id === robot.id),
            main    : selected.find(r => r.id === robot.id)?.main || false,
            online  : state.find(r => r.id === robot.id)?.status || false,
          }));
        })
      );
  }

  openCalculator() {
    this.modal.open(PointsCalculatorModalComponent, { size: 'lg' });
  }

  toggleRobot(robot: Robot) {
    this.store.dispatch(toggleRobot({ id: robot.id }));
  }

  setMainRobot(robot: Robot) {
    this.store.dispatch(setMainRobot({ id: robot.id }));
  }

}
