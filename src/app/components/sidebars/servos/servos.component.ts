import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { Robot } from '../../../models/Robot';
import { Servos } from '../../../models/Servo';
import { ServosService } from '../../../services/servos.service';
import { selectMainRobot } from '../../../store/robots.selector';
import { AbstractSidebarContainer } from '../container/sidebar-container.component';

@Component({
    selector: 'arig-sidebar-servos',
    templateUrl: 'servos.component.html',
})
export class SidebarServosComponent extends AbstractSidebarContainer implements OnInit {
    robot$: Observable<Robot>;
    servos$: Observable<Servos>;

    refreshServos$ = new BehaviorSubject<void>(null);

    trackById = (item: any) => item.id;

    constructor(
        private store: Store<any>,
        private servosService: ServosService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.robot$ = this.store.select(selectMainRobot);

        this.servos$ = combineLatest([this.refreshServos$, this.robot$]).pipe(
            switchMap(([, robot]) => this.servosService.getServos(robot)),
            catchError(() => of(null)),
            takeUntil(this.ngDestroy$),
        );
    }
}
