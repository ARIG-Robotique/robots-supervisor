import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Exec } from '../../../models/Exec';
import { Robot } from '../../../models/Robot';
import { ExecsService } from '../../../services/execs.service';
import { RobotsUiService } from '../../../services/robots-ui.service';
import { RobotsService } from '../../../services/robots.service';
import { selectMainRobot } from '../../../store/robots.selector';
import { AbstractSidebarContainer } from '../container/sidebar-container.component';

@Component({
    selector: 'arig-sidebar-execs',
    templateUrl: 'execs.component.html',
})
export class SidebarExecsComponent extends AbstractSidebarContainer implements OnInit {
    robot$: Observable<Robot>;
    execs: Exec[] = [];

    trackById = (i, e: Exec) => e.id;

    constructor(
        private store: Store<any>,
        private robotsService: RobotsService,
        private robotsUiService: RobotsUiService,
        private execsService: ExecsService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.robot$ = this.store.select(selectMainRobot);

        this.refresh();
    }

    async refresh() {
        const robot = await this.robot$.pipe(first()).toPromise();

        this.robotsService
            .getRobotExecs(robot.id)
            .pipe(map((execs) => execs.slice(0, 50)))
            .subscribe((execs) => {
                this.execs = execs;
            });
    }

    showPaths(robot: Robot, exec: Exec) {
        this.robotsUiService.showPaths(robot.id, exec);
    }

    showLogs(robot: Robot, exec: Exec) {
        this.robotsUiService.showLogs(robot.id, exec);
    }

    importLogs(robot: Robot) {
        this.robotsUiService.importLogs(robot).subscribe(() => {
            this.refresh();
        });
    }

    deleteExec(robot: Robot, exec: Exec) {
        this.execsService.deleteExec(robot.id, exec.id).subscribe(() => {
            this.refresh();
        });
    }

    deleteAll(robot: Robot) {
        const ok = confirm('Etes-vous sûr ?');

        if (ok) {
            this.execsService.deleteAll(robot.id).subscribe(() => {
                this.execs = [];
            });
        }
    }
}
