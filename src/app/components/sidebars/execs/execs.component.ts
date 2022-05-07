import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { Exec } from '../../../models/Exec';
import { Robot } from '../../../models/Robot';
import { ExecsService } from '../../../services/execs.service';
import { RobotsUiService } from '../../../services/robots-ui.service';
import { RobotsService } from '../../../services/robots.service';
import { selectMainRobot } from '../../../store/robots.selector';
import { AbstractComponent } from '../../abstract.component';

@Component({
  selector   : 'arig-sidebar-execs',
  templateUrl: 'execs.component.html',
})
export class SidebarExecsComponent extends AbstractComponent implements OnInit {

  robot$: Observable<Robot>;
  execs$: Observable<Exec[]>;

  constructor(private store: Store<any>,
              private robotsService: RobotsService,
              private robotsUiService: RobotsUiService,
              private execsService: ExecsService) {
    super();
  }

  ngOnInit(): void {
    this.robot$ = this.store.select(selectMainRobot);

    this.refresh();
  }

  refresh() {
    this.execs$ = this.robot$
      .pipe(
        switchMap(robot => this.robotsService.getRobotExecs(robot.id)),
        map(execs => execs.slice(0, 50)),
        takeUntil(this.ngDestroy$)
      );
  }

  showPaths(robot: Robot, exec: Exec) {
    this.robotsUiService.showPaths(robot.id, exec);
  }

  showLogs(robot: Robot, exec: Exec) {
    this.robotsUiService.showLogs(robot.id, exec);
  }

  importLogs(robot: Robot) {
    this.robotsUiService.importLogs(robot);
  }

  deleteExec(robot: Robot, exec: Exec) {
    this.execsService.deleteExec(robot.id, exec.id)
      .subscribe(() => {
        this.refresh();
      });
  }

}
