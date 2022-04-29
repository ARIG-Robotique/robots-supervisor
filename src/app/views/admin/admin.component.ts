import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { IconDefinition, IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponent } from '../../components/abstract.component';
import { Exec } from '../../models/Exec';
import { Robot } from '../../models/Robot';
import { ExecsService } from '../../services/execs.service';
import { RobotsUiService } from '../../services/robots-ui.service';
import { RobotsService } from '../../services/robots.service';
import { selectRobots } from '../../store/robots.selector';

@Component({
  templateUrl: './admin.component.html',
})
export class AdminComponent extends AbstractComponent implements OnInit, OnDestroy {

  icons: [IconPrefix, IconName][] = [];

  robots$: Observable<Robot[]>;
  execs$ = new BehaviorSubject<Exec[]>([]);
  selectedRobot: Robot = null;

  @HostBinding('class')
  cssClass = 'd-block container-fluid mt-3';

  constructor(private store: Store<any>,
              private library: FaIconLibrary,
              private robotsUiService: RobotsUiService,
              private robotsService: RobotsService,
              private execsService: ExecsService) {
    super();
  }

  ngOnInit() {
    this.robots$ = this.store.select(selectRobots);
  }

  addRobot() {
    this.robotsUiService.addRobot();
  }

  editRobot(robot: Robot) {
    this.robotsUiService.editRobot(robot);
  }

  deleteRobot(robot: Robot) {
    this.robotsUiService.deleteRobot(robot)
      .subscribe(done => {
        if (done && this.selectedRobot && this.selectedRobot.id === robot.id) {
          this.selectRobot(null);
        }
      });
  }

  selectRobot(robot: Robot) {
    if (!robot) {
      this.selectedRobot = null;
      this.execs$.next([]);
    } else if (this.selectedRobot && this.selectedRobot.id === robot.id) {
      this.selectRobot(null);
    } else {
      this.selectedRobot = robot;
      this.robotsService.getRobotExecs(robot.id)
        .subscribe((execs) => {
          this.execs$.next(execs);
        });
    }
  }

  importLogs(robot: Robot) {
    this.robotsUiService.importLogs(robot);
  }

  deleteExec(exec: Exec) {
    this.execsService.deleteExec(this.selectedRobot.id, exec.id)
      .subscribe(() => {
        this.execs$.next(this.execs$.value.filter(e => e !== exec));
      });
  }

  loadIcons() {
    if (this.icons.length === 0) {
      const definitions = (this.library as any).definitions as { [prefix: string]: { [name: string]: IconDefinition } };

      for (const [prefix, icons] of Object.entries(definitions)) {
        for (const name of Object.keys(icons)) {
          this.icons.push([prefix, name] as any);
        }
      }
    } else {
      this.icons.length = 0;
    }
  }

}
