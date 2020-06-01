import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { deleteRobot } from 'app/store/robots.actions';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddRobotModalComponent } from '../components/add-robot-modal/add-robot-modal.component';
import { ImportLogsModalComponent } from '../components/import-logs-modal/import-logs-modal.component';
import { LogsModalComponent } from '../components/logs-modal/logs-modal.component';
import { PathsModalComponent } from '../components/paths-modal/paths-modal.component';
import { Exec } from '../models/Exec';
import { Robot } from '../models/Robot';
import { RobotsService } from './robots.service';

@Injectable()
export class RobotsUiService {

  constructor(private robotsService: RobotsService,
              private modal: NgbModal,
              private store: Store<any>) {

  }

  importLogs(robot: Robot) {
    const modalRef = this.modal.open(ImportLogsModalComponent, {backdrop: 'static', size: 'lg'});
    modalRef.componentInstance.robot = {...robot};
  }

  deleteRobot(robot: Robot) {
    const ok = confirm('Etes-vous sûr ?');

    if (ok) {
      return this.robotsService.deleteRobot(robot.id)
        .pipe(map(() => {
          this.store.dispatch(deleteRobot({id: robot.id}));

          return true;
        }));
    } else {
      return of(false);
    }
  }

  addRobot() {
    this.modal.open(AddRobotModalComponent);
  }

  editRobot(robot: Robot) {
    const modalRef = this.modal.open(AddRobotModalComponent);
    modalRef.componentInstance.robot = {...robot};
  }

  showPaths(idRobot: number, exec: Exec) {
    const modalRef = this.modal.open(PathsModalComponent, {size: 'lg'});
    modalRef.componentInstance.setRobotExec(idRobot, exec);
  }

  showLogs(idRobot: number, exec: Exec) {
    const modalRef = this.modal.open(LogsModalComponent, {size: 'xl'});
    modalRef.componentInstance.setRobotExec(idRobot, exec);
  }
}
