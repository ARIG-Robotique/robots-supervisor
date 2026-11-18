import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Mouvements } from 'app/constants/mouvements.constants';
import { Observable, switchMap } from 'rxjs';
import { first } from 'rxjs/operators';
import { Robot } from '../../../models/Robot';
import { selectMainRobot } from '../../../store/robots.selector';
import { AbstractSidebarContainer, SidebarContainerComponent } from '../container/sidebar-container.component';
import { MouvementsService } from '../../../services/mouvements.service';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MouvementInputComponent } from '../../misc/mouvement-input/mouvement-input.component';
import { AsservInputComponent } from '../../misc/asserv-input/asserv-input.component';

@Component({
    selector: 'arig-sidebar-mouvements',
    templateUrl: 'mouvements.component.html',
    imports: [
        SidebarContainerComponent,
        NgIf,
        FaIconComponent,
        NgFor,
        MouvementInputComponent,
        AsservInputComponent,
        AsyncPipe,
    ],
})
export class SidebarMouvementsComponent extends AbstractSidebarContainer implements OnInit {
    readonly Mouvements = Mouvements;

    robot$: Observable<Robot>;

    constructor(
        private store: Store<any>,
        private mouvementsService: MouvementsService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.robot$ = this.store.select(selectMainRobot);
    }

    calage(type: string) {
        this.robot$
            .pipe(
                first(),
                switchMap((robot) => this.mouvementsService.sendMouvement(robot, 'calage', { type })),
            )
            .subscribe();
    }
}
