import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Robot } from '../../../models/Robot';
import { setMainRobot, toggleRobot } from '../../../store/robots.actions';
import { selectRobots, selectRobotsStatusState, selectSelectedRobotsState } from '../../../store/robots.selector';
import { AbstractComponent } from '../../abstract.component';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'arig-app-navbar',
    templateUrl: './app-navbar.component.html',
    styleUrls: ['app-navbar.component.scss'],
    imports: [RouterLink, NgFor, NgIf, NgbTooltip, FaIconComponent, AsyncPipe],
})
export class AppNavbarComponent extends AbstractComponent implements OnInit {
    robots$: Observable<{ robot: Robot; selected: boolean; main: boolean; online: boolean }[]>;

    trackById = (i, r) => r.robot.id;

    constructor(private store: Store<any>) {
        super();
    }

    ngOnInit() {
        this.robots$ = combineLatest([
            this.store.select(selectRobots),
            this.store.select(selectSelectedRobotsState),
            this.store.select(selectRobotsStatusState),
        ]).pipe(
            map(([robots, selected, state]) => {
                return robots.map((robot) => ({
                    robot,
                    selected: !!selected.find((r) => r.id === robot.id),
                    main: selected.find((r) => r.id === robot.id)?.main || false,
                    online: state.find((r) => r.id === robot.id)?.status || false,
                }));
            }),
        );
    }

    toggleRobot(robot: Robot) {
        this.store.dispatch(toggleRobot({ id: robot.id }));
    }

    setMainRobot(robot: Robot) {
        this.store.dispatch(setMainRobot({ id: robot.id }));
    }
}
