import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Mouvements } from 'app/constants/mouvements.constants';
import { Observable } from 'rxjs';
import { Robot } from '../../../models/Robot';
import { selectMainRobot } from '../../../store/robots.selector';
import { AbstractSidebarContainer } from '../container/sidebar-container.component';

@Component({
    selector: 'arig-sidebar-mouvements',
    templateUrl: 'mouvements.component.html',
})
export class SidebarMouvementsComponent extends AbstractSidebarContainer implements OnInit {
    readonly Mouvements = Mouvements;

    robot$: Observable<Robot>;

    constructor(private store: Store<any>) {
        super();
    }

    ngOnInit(): void {
        this.robot$ = this.store.select(selectMainRobot);
    }
}
