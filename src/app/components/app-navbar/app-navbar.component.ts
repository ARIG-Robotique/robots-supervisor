import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PointsCalculatorModalComponent } from '../../modals/points-calculator-modal/points-calculator-modal.component';
import { Robot } from '../../models/Robot';
import { setMainRobot, toggleRobot } from '../../store/robots.actions';
import { selectRobots, selectSelectedRobotsState } from '../../store/robots.selector';
import { AbstractComponent } from '../abstract.component';

@Component({
  selector   : 'arig-app-navbar',
  templateUrl: './app-navbar.component.html',
  providers  : [NgbDropdownConfig],
})
export class AppNavbarComponent extends AbstractComponent implements OnInit {

  robots$: Observable<{ robot: Robot, selected: boolean, main: boolean }[]>;

  constructor(private store: Store<any>,
              private modal: NgbModal) {
    super();
  }

  ngOnInit() {
    this.robots$ = combineLatest([
      this.store.select(selectRobots),
      this.store.select(selectSelectedRobotsState),
    ])
      .pipe(
        map(([robots, selected]) => {
          return robots.map(robot => ({
            robot,
            selected: !!selected.find(r => r.id === robot.id),
            main    : selected.find(r => r.id === robot.id)?.main || false,
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
