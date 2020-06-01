import { Component, OnDestroy, OnInit } from '@angular/core';
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
  host       : {
    class: 'd-block container-fluid mt-3',
  },
})
export class AdminComponent extends AbstractComponent implements OnInit, OnDestroy {

  robots$: Observable<Robot[]>;
  execs$ = new BehaviorSubject<Exec[]>([]);
  selectedRobot: Robot = null;

  constructor(private store: Store<any>,
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

}
