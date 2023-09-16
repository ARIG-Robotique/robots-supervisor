import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { catchError, shareReplay, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Capteurs } from '../../../models/Capteurs';
import { Robot } from '../../../models/Robot';
import { CapteursService } from '../../../services/capteurs.service';
import { selectMainRobot } from '../../../store/robots.selector';
import { AbstractSidebarContainer } from '../container/sidebar-container.component';

@Component({
    selector: 'arig-sidebar-capteurs',
    templateUrl: 'capteurs.component.html',
})
export class SidebarCapteursComponent extends AbstractSidebarContainer implements OnInit {
    robot$: Observable<Robot>;
    capteurs$: Observable<Capteurs>;

    trackByKey = (i: number, keyvalue: KeyValue<string, any>) => keyvalue.key;

    constructor(
        private store: Store<any>,
        private capteursService: CapteursService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.robot$ = this.store.select(selectMainRobot);

        this.capteurs$ = timer(0, 1000).pipe(
            withLatestFrom(this.robot$),
            switchMap(([, robot]) => this.capteursService.getCapteurs(robot)),
            shareReplay(1),
            catchError(() => of(null)),
            takeUntil(this.ngDestroy$),
        );
    }

    setTirette(robot: Robot, present: boolean) {
        this.capteursService.setTirette(robot, present).subscribe();
    }

    setAu(robot: Robot, present: boolean) {
        this.capteursService.setAu(robot, present).subscribe();
    }
}
